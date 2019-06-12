/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterDeliveryOption {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewDeliveryOption(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchDeliveryOption(testCase);

    if(isFound)
    {
      this.tools.log("Delivery Option already exists " + testCase.StrategyNameNew);
      return;
    }
        
    //insert new country type
    await this.tools.click("#general_action_0");
    await this.AddDeliveryOption(testCase);

    isFound = await this.SearchDeliveryOption(testCase);

    if(!isFound)
      throw new Error("DeliveryOption not found in list: \"" + testCase.DeliveryOptionNameNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchDeliveryOption(testCase)
  {
    testCase.url = "masters/deliveryoption";
    testCase.pageTitle = "Delivery Option List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/deliveryoption']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.DeliveryOptionNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddDeliveryOption(testCase)
  {

    await this.tools.getPage("Delivery Option", false, true);
    
    await this.tools.setText("#DeliveryoptionName", testCase.DeliveryOptionNameNew);

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#DeliveryoptionName");
    if(name != testCase.DeliveryOptionNameNew)
      throw new Error("Cannot save Delivery Option " + testCase.DeliveryOptionNameNew + " current value: " + name);

    this.tools.log("Delivery Option saved " + testCase.DeliveryOptionNameNew);
  }

}



module.exports = ShiptechMasterDeliveryOption;



