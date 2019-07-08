/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterCurrency {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewCurrency(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchCurrency(testCase);

    if(isFound)
    {
      this.tools.log("Currency already exists " + testCase.CurrencyCode);
      return;
    }
        
    //insert new country type
    await this.tools.click("#general_action_0");
    await this.AddCurrency(testCase);

    isFound = await this.SearchCurrency(testCase);

    if(!isFound)
      throw new Error("Currency type not found in list: \"" + testCase.CurrencyCode + "\"");

    await this.tools.waitFor(5000);
  }




  
  async TestCurrencyInList(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchCurrency(testCase);

    if(isFound)
    {
      currentTestCase.result = true;
    }
    else
    {
      throw new Error("Currency not found " + testCase.CurrencyCode)
    }

  }



  async SearchCurrency(testCase, commonTestData)
  {
    testCase.url = "masters/currency";
    testCase.pageTitle = "Currency List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/currency']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.CurrencyCode);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddCurrency(testCase)
  {

    await this.tools.getPage("Currency", false, true);

    await this.shiptech.selectWithText("#CurrencyIsoCodeCurrencyCode", testCase.CurrencyCode);

    // await this.tools.click("span[ng-click=\"triggerModal('general', field.clc_id, CM.app_id + '.'+ field.Label | translate , 'formValues.' + field.Unique_ID,'','',field.Name,field.filter);\"]");
    // await this.tools.click("tr[id='1']");
    // await this.tools.click("#header_action_select");

    await this.tools.setText("#CurrencyDescription", testCase.CurrencyCode);
    

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#CurrencyDescription");
    if(name != testCase.CurrencyCode)
      throw new Error("Cannot save currency type " + testCase.CurrencyCode + " current value: " + name);

    this.tools.log("Currency Type saved " + testCase.CurrencyCode);
  }

}



module.exports = ShiptechMasterCurrency;



