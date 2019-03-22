/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechReconList {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async ReconList(testCase)
  {    
   
    var answer = {
      testSatus: 0,
      testName: "ReconList",
    }
    this.tools.log("Loading Recon List");
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
        
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Recon');    
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/recon/reconlist')\"] > span", 'Recon list');
    var page = await this.tools.getPage("Recon List", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    this.tools.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Recon List"))
      this.tools.log("SUCCES!");
    else
      this.tools.log("FAIL!");

    await this.tools.closeCurrentPage();
    return answer;
  
  }


}


module.exports = ShiptechReconList;

