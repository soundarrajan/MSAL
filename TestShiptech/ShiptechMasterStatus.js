/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterStatus {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }



  
  async NewStatus(testCase, commonTestData)
  {  
    
    testCase.result = true;
    
    var isFound = await this.SearchInList(testCase, commonTestData);

    if(isFound)
    {
      this.tools.log("Status already exists " + testCase.StatusName);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase, commonTestData);

    isFound = await this.SearchInList(testCase, commonTestData);

    if(!isFound)
      throw new Error("Status not found in list: \"" + testCase.StatusName + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/status";
    testCase.pageTitle = "Status List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/status']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.StatusName);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddItem(testCase, commonTestData)
  {    
    await this.tools.getPage("Status", false, true);
    await this.tools.setText("#StatusName", testCase.StatusName);
    await this.tools.setText("#DisplayName", testCase.StatusDisplayName);    
    await this.tools.click(testCase.ApplicableTransaction);    
    
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#StatusName");
    if(name != testCase.StatusName)
      throw new Error("Cannot save status " + testCase.StatusName + " current value: " + name);

    this.tools.log("Status saved " + testCase.StatusName);
  }



}



module.exports = ShiptechMasterStatus;



