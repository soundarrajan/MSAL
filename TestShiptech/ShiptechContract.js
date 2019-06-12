/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechContract {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async ContractList(testCase)
  {    
    console.log("Loading Contract List");    
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    console.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
    
    console.log("Procurement");
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Contract');
    console.log("Contract List");
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Contract list');
    var page = await this.tools.getPage("Contract List", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    console.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Contract List"))
      console.log("SUCCES!");
    else
      console.log("FAIL!");

    //await browser.close()
  
  }



  
  async ContractNew(testCase)
  {    
    testCase.result = true;
    console.log("Loading New Contract");    
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    console.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
    
    console.log("Procurement");
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Contract');
    console.log("New Contract");
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'New contract');
    var page = await this.tools.getPage("New Contract", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    console.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Contracts :: Edit"))
      console.log("SUCCES!");
    else
      console.log("FAIL!");

    await this.tools.closeCurrentPage();
  
  }


}


module.exports = ShiptechContract;

