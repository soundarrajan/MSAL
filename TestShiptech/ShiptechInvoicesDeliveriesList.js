/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
//const Db = require('./MsSqlConnector.js');
//const TestTools24 = require('./TestTools24.js');
//const ShiptechTools = require('./ShiptechTools.js');
const ShiptechInvoice = require('./ShiptechInvoice.js');



class ShiptechInvoicesDeliveriesList {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.shiptechInvoice = new ShiptechInvoice(tools, shiptech, db);
  }




  async InvoiceDeliveriesList(testCase)
  {    
    testCase.result = true;
    this.tools.log("Invoice, " + testCase.invoiceType + " OrderId=" + testCase.orderId);

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
    {
      testCase.result = false;
      return testCase;
    }

      /*//navigate using the menu
        await this.tools.click('div.menu-toggler.sidebar-toggler');
        this.tools.log("Open side menu");  
        await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
          
        var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Invoices');    
        result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/invoices/deliveries')\"] > span", 'Deliveries list');
        var page = await this.tools.getPage("Transactions to be Invoiced List", true);
        this.shiptech.page = page;
      //*/




    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    if(!labelTitle)
      lavelTitle = "";
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes("Transactions to be invoiced List"))      
    {
      
      this.tools.error("FAIL!");
      testCase.result = false;
      return testCase;
    }

    await this.tools.waitForLoader();    
    await this.tools.page.waitFor(2000);

    await this.tools.clickOnItemWait("a[data-sortcol='order_name']", "", "", "", 0);
    await this.tools.setText("#filter0_Text", testCase.orderId);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');    
    //checkbox
    await this.tools.clickBySelector("#jqg_flat_invoices_app_deliveries_list_1");    
    await this.tools.waitFor('#newInvoiceType');
    this.tools.log("Create " + testCase.invoiceType);
    await this.tools.selectBySelector("#newInvoiceType", testCase.invoiceType);    
    
    await this.tools.clickOnItemByText("a[ng-click='createInvoiceFromDelivery()']", 'Create Invoice');

    var page = await this.tools.getPage("Invoices");
    this.shiptech.page = page;

    if(testCase.action == "new")
      await this.shiptechInvoice.CreateInvoice(testCase);
    else
      this.tools.log("Invalid action for InvoicesList " + testCase.action);

    await this.tools.closeCurrentPage();
    
    return testCase;
  
  }

}



module.exports = ShiptechInvoicesDeliveriesList;

