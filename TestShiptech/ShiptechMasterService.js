/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterService {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewService(testCase, commonTestData)
  {  
    
    testCase.result = true;
    
    var isFound = await this.SearchInList(testCase, commonTestData);

    if(isFound)
    {
      this.tools.log("Service already exists " + testCase.ServiceName);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase, commonTestData);

    isFound = await this.SearchInList(testCase, commonTestData);

    if(!isFound)
      throw new Error("Service not found in list: \"" + testCase.ServiceName + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/service";
    testCase.pageTitle = "Service List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/service']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.ServiceName);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddItem(testCase, commonTestData)
  {    

    await this.tools.getPage("Service", false, true);    
    await this.tools.setText("#Service", testCase.ServiceName);
    await this.tools.setText("#ServiceCode", testCase.ServiceCode);
    
    //Parent Service
    await this.tools.click("span[id=\"lookup-search-parent\"]");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");

    //Buyer
    await this.tools.click("span[id=\"lookup-search-buyer\"]");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");

    await this.tools.setText("#contact", testCase.ServiceContact);

    //Contact Type
    await this.tools.click("span[id=\"triggerModal('general', 'masters_contacttypelist',  CM.app_id + '.CONTACT_TYPE' | translate , 'formValues.contacts.'+$index+'.contactType');\"]");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");
    
    await this.tools.setText("#Email", testCase.ServiceEmail);   
    
  
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#Service");
    if(name != testCase.ServiceName)
      throw new Error("Cannot save service " + testCase.ServiceName + " current value: " + name);

    this.tools.log("Service saved " + testCase.ServiceName);
  }

}



module.exports = ShiptechMasterService;



