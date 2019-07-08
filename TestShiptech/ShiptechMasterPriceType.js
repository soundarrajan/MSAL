/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterPriceType {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewPriceType(testCase, commonTestData)
  {  
    
    testCase.result = true;
    
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
    testCase.url = "masters/pricetype";
    testCase.pageTitle = "Market Price Type List";

    testCase.QuoteDateDate = await this.shiptech.getFutureDate(testCase.QuoteDate, false);
    testCase.SystemInstrumentValue = commonTestData[testCase.SystemInstrument];

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/pricetype']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");

    testCase.SystemInstrumentValue = commonTestData[testCase.SystemInstrument];

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.SystemInstrumentValue);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddItem(testCase, commonTestData)
  {    

    await this.tools.getPage("Market Price Type", false, true);    
    await this.tools.setText("#MarketPriceTypeName", testCase.PriceTypeName);
    await this.tools.setText("#Code", testCase.PriceTypeCode);
    

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#MarketPriceTypeName");
    if(name != testCase.PriceTypeName)
      throw new Error("Cannot save price type " + testCase.PriceTypeName + " current value: " + name);

    this.tools.log("Market Price Type saved " + testCase.PriceTypeName);
  }

}



module.exports = ShiptechMasterPriceType;



