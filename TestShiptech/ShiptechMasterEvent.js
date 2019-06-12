/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterEvent {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewEvent(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchEvent(testCase);

    if(isFound)
    {
      this.tools.log("Event already exists " + testCase.EventNameNew);
      return;
    }
        
    //insert new event type
    await this.tools.click("#general_action_0");
    await this.AddEvent(testCase);

    isFound = await this.SearchEvent(testCase);

    if(!isFound)
      throw new Error("Event not found in list: \"" + testCase.EventNameNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchEvent(testCase)
  {
    testCase.url = "masters/event";
    testCase.pageTitle = "Event List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/event']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.EventNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddEvent(testCase)
  {

    await this.tools.getPage("Event", false, true);
    
    await this.tools.setText("#EventName", testCase.EventNameNew);
    await this.tools.selectFirstOptionBySelector("#EventBusinessTypeEventBusinessType");

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#EventName");
    if(name != testCase.EventNameNew)
      throw new Error("Cannot save Event " + testCase.EventNameNew + " current value: " + name);

    this.tools.log("Event saved " + testCase.EventNameNew);
  }

}



module.exports = ShiptechMasterEvent;



