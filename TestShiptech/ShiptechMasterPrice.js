/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterPrice {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewPrice(testCase, commonTestData)
  {  
    
    testCase.result = true;
    testCase.QuoteDateDate = await this.shiptech.getFutureDate(testCase.QuoteDate, false);
    testCase.SystemInstrumentValue = commonTestData[testCase.SystemInstrument];


    var isFound = await this.SearchInList(testCase, commonTestData);

    if(isFound)
    {
      this.tools.log("Price already exists " + testCase.Name);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase, commonTestData);

    isFound = await this.SearchInList(testCase, commonTestData);

    if(!isFound)
      throw new Error("Price not found in list: \"" + testCase.SystemInstrumentValue + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/price";
    testCase.pageTitle = "Price List";

    testCase.QuoteDateDate = await this.shiptech.getFutureDate(testCase.QuoteDate, false);
    testCase.SystemInstrumentValue = commonTestData[testCase.SystemInstrument];

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/price']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");

    testCase.SystemInstrumentValue = commonTestData[testCase.SystemInstrument];

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.SystemInstrumentValue);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();

    await this.tools.clickOnItemWait("a[data-sortcol='quotedate']");
    await this.tools.selectBySelector("#rule_0_condition", "Is equal");
    await this.tools.setText("input[id='0_date_0_dateinput']", testCase.QuoteDateDate);
    await this.tools.pressTab();
    await this.tools.clickOnItemByText("button[ng-click=\"applyFilters(columnFilters[column], true, true);hidePopover()\"]", 'Filter');
    await this.tools.waitForLoader();

    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddItem(testCase, commonTestData)
  {
    
    testCase.QuoteDateDate = await this.shiptech.getFutureDate(testCase.QuoteDate, false);
    testCase.SystemInstrumentValue = commonTestData[testCase.SystemInstrument];


    await this.tools.getPage("Price", false, true);
    await this.shiptech.selectWithText("#SystemInstrumentsystemInstrument", testCase.SystemInstrumentValue);
    await this.tools.setText("#quoteDate_dateinput", testCase.QuoteDateDate);

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#SystemInstrumentsystemInstrument");
    if(name != testCase.SystemInstrumentValue)
      throw new Error("Cannot save price " + testCase.SystemInstrumentValue + " current value: " + name);

    this.tools.log("Price saved " + testCase.SystemInstrumentValue);
  }

}



module.exports = ShiptechMasterPrice;



