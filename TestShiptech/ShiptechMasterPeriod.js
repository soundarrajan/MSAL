/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterPeriod {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewPeriod(testCase, commonTestData)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchInList(testCase);

    if(isFound)
    {
      this.tools.log("Period already exists " + testCase.Name);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase);

    isFound = await this.SearchInList(testCase);

    if(!isFound)
      throw new Error("Period not found in list: \"" + testCase.Name + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/period";
    testCase.pageTitle = "Period List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/period']");
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
    
    await this.tools.getPage("Period", false, true);
    await this.tools.setText("#PeriodName", testCase.Name);
    await this.tools.setText("#PeriodCode", testCase.Code);

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#PeriodName");
    if(name != testCase.Name)
      throw new Error("Cannot save Period " + testCase.Name + " current value: " + name);

    this.tools.log("Period saved " + testCase.Name);
  }

}



module.exports = ShiptechMasterPeriod;



