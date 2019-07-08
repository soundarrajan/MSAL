/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');
const ShiptechTestDataGen = require('./ShiptechTestDataGen.js');



class ShiptechMasterExchangeRate {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewExchangeRate(testCase, commonTestData)
  {  
    
    testCase.result = true;

    var shiptechDataGen = new ShiptechTestDataGen(this.tools, this.shiptech);
    if(testCase.CompanyId)
    {
      commonTestData[testCase.CompanyId] = await shiptechDataGen.getRandomCompany();
      testCase.CompanyName = commonTestData[testCase.CompanyId];
    }

    testCase.CreatedOn = await this.shiptech.getFutureDate(0, false);

    var isFound = await this.SearchExchangeRate(testCase);

    if(isFound)
    {
      this.tools.log("ExchangeRate already exists " + testCase.BaseCurrency + " " + testCase.CompanyName);
      return;
    }
        
    //insert new event type
    await this.tools.click("#general_action_0");
    await this.AddExchangeRate(testCase);

    isFound = await this.SearchExchangeRate(testCase);

    if(!isFound)
      throw new Error("ExchangeRate not found in list: \"" + testCase.EventNameNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchExchangeRate(testCase)
  {
    testCase.url = "masters/exchangerate";
    testCase.pageTitle = "Exchange Rate List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/exchangerate']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    // await this.tools.clickOnItemWait("a[data-sortcol='currency_name']");
    // await this.tools.setText("#filter0_Text", testCase.BaseCurrency);
    // await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    // await this.tools.waitForLoader();


    await this.tools.clickOnItemWait("a[data-sortcol='company_name']");
    await this.tools.setText("#filter0_Text", testCase.CompanyName);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();

    await this.tools.clickOnItemWait("a[data-sortcol='createdon']");    
    await this.tools.selectBySelector("#rule_0_condition", "Is after or equal to");
    await this.tools.setText("input[id='0_date_0_dateinput'", testCase.CreatedOn);
    await this.tools.pressTab();
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');    
    await this.tools.waitForLoader();


    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddExchangeRate(testCase)
  {

    await this.tools.getPage("Exchange Rate", false, true);
    
    await this.tools.setText("#CompanyCompany", testCase.CompanyName);
    await this.tools.selectBySelector("select[id='ExchangeRateTypeExchangeRateType']", testCase.ExchangeRateType);
    await this.tools.setText("#grid_exchangeRateDetails_date__0_dateinput", testCase.CreatedOn);
    await this.tools.pressTab();
    await this.tools.selectBySelector("#grid_exchangeRateDetails_currency_0", testCase.Currency);
    await this.tools.setText("input[name='Exchangez Rate']", testCase.ExchangeRate);
    
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#CompanyCompany");
    if(name != testCase.CompanyName)
      throw new Error("Cannot save Exchange Rate for company " + testCase.CompanyName + " current company: " + name);

    this.tools.log("Exchange rate saved for " + testCase.CompanyName);
  }

}



module.exports = ShiptechMasterExchangeRate;



