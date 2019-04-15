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




  async InvoicesList(testCase, commonTestData)
  {
    this.tools.log("Loading Invoices List");
    testCase.result = true;
    if(!await this.tools.navigate("invoices/invoice", "Invoices List"))
    {      
      testCase.result = false;
      return testCase;
    }

    if(commonTestData.invoiceId)
    {
      await this.tools.clickOnItemWait("a[data-sortcol='invoice_id']");
      await this.tools.selectBySelector("#rule_0_condition", "Is equal");
      await this.tools.setText("#filter0_Number", commonTestData.invoiceId);
      await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
      await this.tools.waitFor(2000);
      await this.tools.waitForLoader();        
      // await this.tools.click("#flat_invoices_app_invoice_list_invoice.id>a");
      // await this.tools.setText("#filter0_Text", testCase.invoiceId);
    }else if(commonTestData.orderId)
    {
      await this.tools.clickOnItemWait("a[data-sortcol='orderproductid']");
      await this.tools.setText("#rule_0_condition", commonTestData.orderId);
      await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
      await this.tools.waitFor(2000);
      await this.tools.waitForLoader();        

      // await this.tools.click("#flat_invoices_app_invoice_list_order.name");
      // await this.tools.setText("#filter0_Text", commonTestData.orderId);
    }
    else 
      await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    

    if(testCase.action == "cancel")
    {
      await this.shiptechInvoice.CancelInvoice(testCase, commonTestData);
    }
    else if(testCase.action == "finalAfterProvisional")
    {
      await this.tools.clickOnItemByText("span.formatter.edit_link", commonTestData.invoiceId);
      await this.tools.waitForLoader();
      var page = await this.tools.getPage("Invoice - " + commonTestData.orderId + " - " + commonTestData.vesselName, false, false);
      await this.shiptechInvoice.CreateFinalInvoiceSearchProvisional(testCase);
    }
    else
      this.tools.log("Invalid action for InvoicesList " + testCase.action);

    await this.tools.closeCurrentPage();

    return testCase;
  
  }


}


module.exports = ShiptechInvoicesList;

