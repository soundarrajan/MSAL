/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterIncoterms {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewIncoterm(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchInList(testCase);

    if(isFound)
    {
      this.tools.log("Incoterm already exists " + testCase.Name);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase);

    isFound = await this.SearchInList(testCase);

    if(!isFound)
      throw new Error("Incoterm not found in list: \"" + testCase.Name + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/incoterms";
    testCase.pageTitle = "Incoterms List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/incoterms']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.Name);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddItem(testCase)
  {
    
    await this.tools.getPage("Incoterms", false, true);
    await this.shiptech.selectWithText("#IncotermName", testCase.Name);

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#IncotermName");
    if(name != testCase.Name)
      throw new Error("Cannot save incoterm " + testCase.Name + " current value: " + name);

    this.tools.log("Incoterm saved " + testCase.Name);
  }

}



module.exports = ShiptechMasterIncoterms;



