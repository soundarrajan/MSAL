/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechInvoicesDeliveriesList {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async InvoiceDeliveriesList(testCase)
  {    
    testCase.result = true;
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

    await this.CreateInvoice(testCase);        

    await this.tools.closeCurrentPage();
    
    return testCase;
  
  }






  async CreateInvoice(testCase)
  {   
    if(await this.shiptech.validateDate(testCase.paymentDate) != true)
    {
      var dateFormat = await this.shiptech.getDateFormat();
      throw  new Error("Invalid date format " + testCase.paymentDate + " valid format: " + dateFormat);
    }

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", testCase.currency);
    await this.tools.setText("#PaymentDate_dateinput", testCase.paymentDate);
    

    for (let i = 0; i < testCase.provisionalData.products.length; i++) 
    { 
      await this.tools.setText("input[name='invoiceQuantity']", testCase.provisionalData.products[i].quantity, i);
      await this.tools.setText("input[name='invoiceRate']", testCase.provisionalData.products[i].rate, i);
    }

    await this.tools.clickOnItemByText('a[ng-click*="save_master_changes()"]', 'Save');    
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterSave);
    
    if(testCase.invoiceStatusAfterSubmit)
    {
      await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
      await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'SubmitForApprovalInvoice');
      await this.checkInvoiceStatus(testCase.invoiceStatusAfterSubmit);
    }
    
    await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'ApproveInvoice');
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterApprove);

    if(testCase.testRevert)
    {
        await this.tools.clickOnItemByText("a[ng-click='revert_invoice()']", 'Revert');
        await this.checkInvoiceStatus(testCase.invoiceStatusAfterSave);
        
        if(testCase.invoiceStatusAfterSubmit)
        {
          await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
          await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'SubmitForApprovalInvoice');        
          await this.checkInvoiceStatus(testCase.invoiceStatusAfterSubmit);
        }
        
        await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
        await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'ApproveInvoice');
        await this.checkInvoiceStatus(testCase.invoiceStatusAfterApprove);
    }

    if(testCase.testOrderStatus)
    {
        await this.tools.clickOnItemByText("a[ng-href='#/edit-order/" + testCase.orderId + "']", 'Order');
        var labelStatus = await this.tools.getText("span[ng-if='state.params.status.name']");
        this.tools.log("Order status is " + labelStatus);                
        labelStatus = labelStatus.replace(/[^0-9a-z]/gi, '').trim();
        if(labelStatus != testCase.invoiceStatus)
          throw  new Error("FAIL! The Order status is not " + invoiceStatus + " but is " + labelStatus);
        //go back to the invoice screen
        await this.tools.clickOnItemByText("a[ng-href^='#/invoices/invoice/edit/']", 'Invoices');
        await this.checkInvoiceStatus(testCase.invoiceStatusAfterApprove);
    }

    if(testCase.createFinal) {
      await this.CreateFinalInvoice(testCase);      
    }
    
    return testCase;
  }


/*
  checkSameProducts(products1, products2)
  {
    if(products1.length != products2.length)
      return false;

    for(var i=0; i<products1.length; i++)
    {
      var productName = products1[i].name;
      var found = false;
      for(var j=0; j<products2.length; j++)
      {
        if(products2[j].name == productName)
        {
          found = true;
          break;
        }
      }

      if(!found)
        return false;
    }

    return true;
  }
*/


  async checkInvoiceStatus(status)
  {
    if(!status)
      throw  new Error("checkInvoiceStatus() " + status + " is not specified in the testcase.");
      
    await this.tools.waitForLoader();
    var labelTitle = await this.tools.getText("span[ng-if='state.params.status.name']");
    labelTitle = labelTitle.replace(/[^0-9a-z]/gi, '');
    labelTitle = labelTitle.trim();
    this.tools.log("Current invoice status " + labelTitle);
    if(!labelTitle.includes(status))
      throw  new Error("The invoice status is not as expected: (expected: " + status + ", current: " + labelTitle + ")");

  }



  async CreateFinalInvoice(testCase)
  {

    if(!testCase.finalData)
      throw  new Error("Missing data for final invoice");

    //create final invoice
    await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'CreateFinalInvoice');
    await this.tools.waitForLoader();

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    if(!labelTitle.includes("Invoices :: Edit"))
      this.tools.log("FAIL!");

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", testCase.currency);

    for (let i = 0; i < testCase.finalData.products.length; i++) 
    { 
      await this.tools.setText("input[name='invoiceQuantity']", testCase.finalData.products[i].quantity, i);
      await this.tools.setText("input[name='invoiceRate']", testCase.finalData.products[i].rate, i);
    }

    await this.tools.clickOnItemByText('a[ng-click*="save_master_changes()"]', 'Save');
    await this.tools.waitForLoader();      
    await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'ApproveInvoice');
    await this.tools.waitForLoader();

  }
}


module.exports = ShiptechInvoicesDeliveriesList;

