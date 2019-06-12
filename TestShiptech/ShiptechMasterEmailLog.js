/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterEmailLog {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async EditEmailLog(testCase)
  {  
    
    testCase.result = true;
    await this.SearchEmailLog(testCase);
    await this.tools.clickOnItemWait("span[class='jqgrid-ng-action edit']");

    await this.tools.getPage("Email Log", false, true);    

    var toAddress = await this.tools.getTextValue("#To");
    if(toAddress != testCase.emailToEdit)
      throw new Error("Cannot find email to: " + testCase.emailToEdit + " current value: " + toAddress);

    this.tools.log("Email log viewed " + testCase.emailToEdit);

    await this.tools.waitFor(5000);
  }




  async SearchEmailLog(testCase)
  {
    testCase.url = "masters/emaillogs";
    testCase.pageTitle = "Email Log List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/emaillogs']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='to']");
    await this.tools.setText("#filter0_Text", testCase.emailToEdit);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[class='jqgrid-ng-action edit']", 3000);
  }


}



module.exports = ShiptechMasterEmailLog;



