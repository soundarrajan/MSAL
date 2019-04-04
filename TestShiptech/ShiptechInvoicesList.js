/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');
const ShiptechInvoice = require('./ShiptechInvoice.js');



class ShiptechInvoicesList {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.shiptechInvoice = new ShiptechInvoice(tools, shiptech, db);
  }




  async InvoicesList(testCase)
  {    
    var answer = {    
      testSatus: 0,
      testName: "InvoicesList"
    }
    this.tools.log("Loading Invoices List");
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
        
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Invoices');    
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/invoices/invoice')\"] > span", 'Invoices list');
    var page = await this.tools.getPage("Invoices List", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    this.tools.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Invoices List"))
      this.tools.log("SUCCES!");
    else
      this.tools.log("FAIL!");

    await this.tools.waitForLoader();    
    await this.tools.page.waitFor(2000);

    await this.tools.clickOnItemWait("a[data-sortcol='order_name']", "", "", "", 0);
    await this.tools.setText("#filter0_Text", testCase.orderId);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');    
    

    var page = await this.tools.getPage("Invoices");
    this.shiptech.page = page;

    if(testCase.action == "cancel")
      await this.shiptechInvoice.CancelInvoice(testCase);
    else
      this.tools.log("Invalid action for InvoicesList " + testCase.action);

    await this.tools.closeCurrentPage();

    return answer;
  
  }


}


module.exports = ShiptechInvoicesList;

