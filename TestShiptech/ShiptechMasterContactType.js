/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterContactType {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewContactType(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchContactType(testCase);

    if(isFound)
    {
      this.tools.log("Contact type already exists " + testCase.ContactTypeNew);
      return;
    }
        
    //insert new contact type
    await this.tools.click("#general_action_0");
    await this.AddContactType(testCase);

    isFound = await this.SearchContactType(testCase);

    if(!isFound)
      new Error("Contact type not found in list: \"" + testCase.ContactTypeNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchContactType(testCase)
  {
    testCase.url = "masters/contacttype";
    testCase.pageTitle = "Contact Type List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/contacttype']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.ContactTypeNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddContactType(testCase)
  {     

    await this.tools.getPage("Contact Type", false, true);
    await this.tools.setText("#ContacttypeName", testCase.ContactTypeNew);

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#ContacttypeName");
    if(name != testCase.ContactTypeNew)
      throw new Error("Cannot save contact type " + testCase.ContactTypeNew + " current value: " + name);

    this.tools.log("Contact Type saved " + testCase.ContactTypeNew);
  }

}



module.exports = ShiptechMasterContactType;



