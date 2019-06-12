/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterCalendar {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewCalendar(testCase)
  {  
    testCase.result = true;
    var isFound = await this.SearchCalendar(testCase);
    
    if(isFound)
    {
      this.tools.log("Calendar already exists " + testCase.CalendarNameNew);
      return;
    }
    
    //insert new calendar
    await this.tools.click("#general_action_0");
    await this.AddCalendar(testCase);

    isFound = await this.SearchCalendar(testCase);
    if(!isFound)
      throw new Error("Calendar not found in list " + testCase.CalendarNameNew);

    await this.tools.waitFor(5000);
  }




  async SearchCalendar(testCase)
  {
    testCase.url = "masters/calendar";
    testCase.pageTitle = "Calendar List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/calendar']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
      throw new Error("FAIL!");

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.CalendarNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();

     return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
    
  }

  

  async AddCalendar(testCase)
  {
     
    if(testCase.HolidayDate)
      testCase.HolidayDate = await this.shiptech.getFutureDate(testCase.HolidayDate, false);  

    await this.tools.getPage("Calendar", false, true);
    await this.tools.setText("#CalendarName", testCase.CalendarNameNew);
    await this.tools.setText("#grid_holidays_date__0_dateinput", testCase.HolidayDate);
    await this.tools.setText("input[id='grid_holidays_Holiday Name_0']", testCase.HolidayName);   
    
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#CalendarName");
    if(name != testCase.CalendarNameNew)
      throw new Error("Cannot save Calendar " + testCase.CalendarNameNew + " current value: " + name);

    this.tools.log("Calendar saved " + testCase.CalendarNameNew);

    this.tools.log("SUCCES!");
  }

}



module.exports = ShiptechMasterCalendar;



