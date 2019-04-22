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

    testCase.url = "invoices/invoice";
    testCase.pageTitle = "Invoices List";     
    
    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
    {      
      testCase.result = false;
      return testCase;
    }

    testCase.invoiceId = null;
    
    if(!testCase.input.orderId)
        throw new Error("orderId not defined in input parameters");

    testCase.orderId = commonTestData[testCase.input.orderId];
    if(!testCase.orderId || testCase.orderId.length <= 0)
      throw new Error("No orderId found in parameters to Invoice List for action " + testCase.action);


    if(testCase.action == "finalAfterProvisional")
    {//search the invoice id


      if(!testCase.input.invoiceId)
        throw new Error("invoiceId not defined in input parameters");

      testCase.invoiceId = commonTestData[testCase.input.invoiceId];
      if(!testCase.invoiceId || testCase.invoiceId.length <= 0)
        throw new Error("No invoiceId found in parameters to Invoice List for action " + testCase.action);

      await this.tools.clickOnItemWait("a[data-sortcol='invoice_id']");
      await this.tools.selectBySelector("#rule_0_condition", "Is equal");
      await this.tools.setText("#filter0_Number", testCase.invoiceId);
      await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
      await this.tools.waitFor(2000);
      await this.tools.waitForLoader();
      // await this.tools.click("#flat_invoices_app_invoice_list_invoice.id>a");
      // await this.tools.setText("#filter0_Text", testCase.invoiceId);

      await this.tools.clickOnItemByText("span.formatter.edit_link", testCase.invoiceId);
      await this.tools.waitForLoader();      
      await this.shiptechInvoice.CreateFinalInvoiceSearchProvisional(testCase, commonTestData);

    }
    else if(testCase.action == "provisional" || testCase.action == "final" || testCase.action == "provisionalThenFinal")
    {//search the order
      
     // testCase.url = "invoices/deliveries";
     // testCase.pageTitle = "Transactions to be Invoiced List";      

      await this.tools.clickOnItemWait("a[data-sortcol='orderproductid']");
      await this.tools.setText("#rule_0_condition", testCase.orderId);
      await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
      await this.tools.waitFor(2000);
      await this.tools.waitForLoader();        

      // await this.tools.click("#flat_invoices_app_invoice_list_order.name");
      // await this.tools.setText("#filter0_Text", commonTestData.orderId);
    }
    else if(testCase.action == "cancel")
    {
      await this.shiptechInvoice.CancelInvoice(testCase, commonTestData);
    }
    else
      this.tools.log("Invalid action for InvoicesList " + testCase.action);

    //await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');

    await this.tools.closeCurrentPage();

    return testCase;
  
  }


}


module.exports = ShiptechInvoicesList;

