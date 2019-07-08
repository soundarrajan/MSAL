/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterPaymentTerm {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewPaymentTerm(testCase, commonTestData)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchInList(testCase);

    if(isFound)
    {
      this.tools.log("Payment Term already exists " + testCase.Name);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase);

    isFound = await this.SearchInList(testCase);

    if(!isFound)
      throw new Error("Payment Term not found in list: \"" + testCase.Name + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/paymentterm";
    testCase.pageTitle = "Payment Term List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/paymentterm']");
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
    
    await this.tools.getPage("Payment Term", false, true);
    await this.tools.setText("#PaymenttermName", testCase.Name);

    if(testCase.PaymentCondition == "LastDate")
    {
      await this.tools.click("input[id='inlineRadio0']");
    }
    else if(testCase.PaymentCondition == "EarliestDate")
    {
      await this.tools.click("input[id='inlineRadio1']");
    }

    await this.tools.setText("#grid_conditions_Days_0", testCase.Days);
    await this.tools.selectBySelector("select[ng-model=\" row['entity']['conditionTypeDay'] \"]", testCase.Condition);
    await this.shiptech.selectWithText("input[id='grid_conditions_event_0']", testCase.Event);

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#PaymenttermName");
    if(name != testCase.Name)
      throw new Error("Cannot save payment term " + testCase.Name + " current value: " + name);

    this.tools.log("Payment Term saved " + testCase.Name);
  }

}



module.exports = ShiptechMasterPaymentTerm;



