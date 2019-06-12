/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechInvoicesClaimsList {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async ClaimsList(testCase)
  {    
    testCase.result = true;
    this.tools.log("Loading Invoice Claims List");
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
        
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Invoices');    
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/invoices/claims')\"] > span", 'Claims list');
    var page = await this.tools.getPage("Invoice Claims List", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Invoice Claims List"))
      this.tools.log("SUCCES!");
    else
      this.tools.log("FAIL!");

    await this.tools.closeCurrentPage();
    
  
  }




}


module.exports = ShiptechInvoicesClaimsList;

