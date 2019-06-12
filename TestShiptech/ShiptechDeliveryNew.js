/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechDeliveryNew {


  constructor(tools, shiptech) {    
    this.tools = tools;    
    this.shiptech = shiptech;
  }




  async DeliveryNew(testCase, commonTestData)
  { 
      
    testCase.result = true;

    testCase.url = "delivery/delivery/edit/";
    if(!testCase.pageTitle)
      testCase.pageTitle = "New Delivery";

    if(testCase.products.length <= 0)
      throw new Error("DeliveryNew invalid arguments");

    if(!testCase.input.orderId)
      throw new Error("orderId not defined in input parameters");

    if(!testCase.orderId || testCase.orderId.length <= 0)
      testCase.orderId = commonTestData[testCase.input.orderId];

    if(!testCase.orderId || testCase.orderId.length <= 0)
      throw new Error("OrderId missing from parameters in DeliveryNew().");

    this.shiptech.findProducts(testCase.products, commonTestData);
    
    this.tools.log("Order: " + testCase.orderId);
    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
    {
      testCase.result = false;
      return testCase;
    }

      /*//navigate using the menu
       await this.tools.click('div.menu-toggler.sidebar-toggler');
       this.tools.log("Open side menu");  
       await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
          
       var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Delivery');    
       result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/delivery/delivery/edit/')\"] > span", 'New delivery');
       var page = await this.tools.getPage("New Delivery", true);
       this.shiptech.page = page;
      //*/

   
    
    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is: " + labelTitle.trim());
    if(!labelTitle.includes("Delivery Entity Edit"))  
    {  
      this.tools.error("Cannot find delivery screen");
      testCase.result = false;
      return testCase;
    }

    await this.tools.setText("input[id='productProduct']", testCase.orderId);
    await this.tools.page.keyboard.press("Tab", {delay: 500});
    await this.tools.setText("input[id='bdnDate_dateinput']", testCase.bdnDate, 0, false);

    if(await this.tools.isElementVisible("#buyerQuantity"))
      await this.tools.selectBySelector("#buyerQuantity", "Bdn Quantity", false);

    if(await this.tools.isElementVisible("#sellerQuantity"))
      await this.tools.selectBySelector("#sellerQuantity", "Bdn Quantity", false);
    
    
    
    for (let i = 0; i < testCase.products.length; i++) {        
      await this.tools.selectBySelector("#addProductToDeliverySelect", testCase.products[i].name, false);
      await this.tools.clickOnItemByText('button', 'Add product');    
      await this.tools.clickOnItemByText('span > b.ng-binding', testCase.products[i].name);
      await this.tools.setText("input[name='Product "+ (i+1) +" BDN quantity']", testCase.products[i].quantity, 0, true);
    }

    await this.tools.clickOnItemByText('a.btn.btn-default.btn-outline', 'Save');
    await this.tools.clickOnItemByText('a.btn.btn-default.btn-outline', 'Verify Delivery');
    await this.tools.clickBySelector("#completed");
    await this.tools.clickOnItemByText('a.btn.btn-default.btn-outline', 'Save');
    await this.tools.waitForLoader("Save Delivery");
    await this.tools.waitFor(5000);
    await this.tools.closeCurrentPage();    
  
  }





}


module.exports = ShiptechDeliveryNew;

