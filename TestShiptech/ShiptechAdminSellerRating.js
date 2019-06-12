/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechAdminSellerRating {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async SellerRating(testCase)
  {    
    testCase.result = true;

    this.tools.log("Loading Admin Seller Rating");
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
        
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Admin');    
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/admin/sellerrating/edit/')\"] > span", 'Seller Rating');
    var page = await this.tools.getPage("Seller Rating", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Seller Rating"))
      this.tools.log("SUCCES!");
    else
      this.tools.log("FAIL!");

    await this.tools.closeCurrentPage();
  
  }


}


module.exports = ShiptechAdminSellerRating;

