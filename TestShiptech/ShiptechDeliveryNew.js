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




  async DeliveryNew(testCase)
  { 
      
    if(testCase.products.length <= 0)
      throw "DeliveryNew invalid arguments";
    
    this.tools.log("Loading Delivery Edit for order " + testCase.orderId);
    await this.tools.waitForLoader();

    const pageTitle = await this.tools.page.title();
    if(pageTitle != "New Delivery")
    {
      await this.tools.click('div.menu-toggler.sidebar-toggler');
      this.tools.log("Open side menu");  
      await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
          
      var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Delivery');    
      result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/delivery/delivery/edit/')\"] > span", 'New delivery');
      var page = await this.tools.getPage("New Delivery", true);
      this.shiptech.page = page;
    }

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    this.tools.log("Current screen is " + labelTitle.trim());
    if(!labelTitle.includes("Delivery Entity Edit"))    
      throw "Cannot find delivery screen";

    await this.tools.setText("input[id='productProduct']", testCase.orderId);
    await this.tools.page.keyboard.press("Tab", {delay: 500});
    await this.tools.setText("input[id='bdnDate_dateinput']", testCase.bdnDate, 0, false);
    
    for (let i = 0; i < testCase.products.length; i++) {
      await this.tools.selectBySelector("select[ng-model='selectedProductToAddInDelivery']", testCase.products[i].name, true);
      await this.tools.clickOnItemByText('button', 'Add product');    
      await this.tools.clickOnItemByText('span > b.ng-binding', testCase.products[i].name);
      await this.tools.setText("input[name='Product "+ (i+1) +" BDN quantity']", testCase.products[i].quantity, 0, true);
    }

    await this.tools.clickOnItemByText('a.btn.btn-default.btn-outline', 'Save');
    await this.tools.clickOnItemByText('a.btn.btn-default.btn-outline', 'Verify Delivery');
    await this.tools.clickBySelector("#completed");
    await this.tools.clickOnItemByText('a.btn.btn-default.btn-outline', 'Save');
    await this.tools.waitForLoader();
    await this.tools.closeCurrentPage();

    return testCase;
  
  }





}


module.exports = ShiptechDeliveryNew;

