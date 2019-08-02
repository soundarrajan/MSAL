/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechDeliveryToVerify {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async DeliveryToVerify(testCase, commonTestData)
  {    
    testCase.result = true;
    this.tools.log("Loading Delivery To Verify");

    if(!testCase.input.orderId)
      throw new Error("orderId not defined in input parameters");

    if(!testCase.orderId || testCase.orderId.length <= 0)
      testCase.orderId = commonTestData[testCase.input.orderId];

    if(!testCase.orderId || testCase.orderId.length <= 0)
      throw new Error("OrderId missing from parameters in DeliveryNew().");

    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
        
    await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Delivery');    
    await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/delivery/deliveriestobeverified')\"] > span", 'Deliveries to be verified');
    var page = await this.tools.getPage("Deliveries to be Verified", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes("Deliveries to be Verified"))
      throw new Error("Invalid screen name: " + labelTitle + " should have been 'Deliveries to be Verified'");

    await this.shiptech.SelectListFilter('order_name', testCase.orderId, "Delivery To be Verified filter by order");
    await this.tools.click("#jqg_flat_deliveries_to_be_verified_1");    
    await this.tools.click("#header_action_bulkverify");
    await this.tools.waitForLoader("One Delivery Bulk Verify");

    await this.tools.closeCurrentPage();  
  }



}


module.exports = ShiptechDeliveryToVerify;

