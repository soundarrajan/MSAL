/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterCounterparty {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewCounterparty(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchCounterparty(testCase);

    if(isFound)
    {
      this.tools.log("Counterparty already exists " + testCase.CounterpartyNameNew);
      return;
    }
        
    //insert new contact type
    await this.tools.click("#general_action_0");
    await this.AddCounterparty(testCase);

    isFound = await this.SearchCounterparty(testCase);

    if(!isFound)
      throw new Error("Counterparty type not found in list: \"" + testCase.CounterpartyNameNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchCounterparty(testCase)
  {
    testCase.url = "masters/counterparty";
    testCase.pageTitle = "Counterparty List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/counterparty']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.CounterpartyNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddCounterparty(testCase)
  {

    await this.tools.getPage("Counterparty", false, true);
    await this.tools.setText("#CounterpartyName", testCase.CounterpartyNameNew);

    await this.tools.click("#lookup-search-parent");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");

    await this.tools.click("span[id='lookup-search-address.country']");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");

    await this.tools.setText("#contact", testCase.Contact);

    await this.tools.click("span[ng-click=\"triggerModal('general', 'masters_contacttypelist',  CM.app_id + '.CONTACT_TYPE' | translate , 'formValues.contacts.'+$index+'.contactType');\"]");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");

    await this.tools.setText("#Email", testCase.Email);
    
        
    await this.tools.click("#" + testCase.CounterpartyType);

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#CounterpartyName");
    if(name != testCase.CounterpartyNameNew)
      throw new Error("Cannot save contact type " + testCase.CounterpartyNameNew + " current value: " + name);

    this.tools.log("Contact Type saved " + testCase.CounterpartyNameNew);
  }

}



module.exports = ShiptechMasterCounterparty;



