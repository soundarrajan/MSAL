/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechInvoice {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }

  async CancelInvoice(testCase)
  {   
    if(testCase.action != "cancel")
      return testCase;

    await this.tools.click('a[ng-click="$eval(value.action)"]');
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterCancel);
    
    return testCase;
  }


  async CreateInvoice(testCase)
  {   
    if(testCase.paymentDate)
    {
      if(await this.shiptech.validateDate(testCase.paymentDate) != true)
      {
        var dateFormat = await this.shiptech.getDateFormat();
        throw  new Error("Invalid date format " + testCase.paymentDate + " valid format: " + dateFormat);
      }
    }

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", testCase.currency);
    if(testCase.paymentDate)
      await this.tools.setText("#PaymentDate_dateinput", testCase.paymentDate);

    if(testCase.provisionalData && testCase.provisionalData.products)
      for (let i = 0; i < testCase.provisionalData.products.length; i++) 
      { 
        await this.tools.setText("input[name='invoiceQuantity']", testCase.provisionalData.products[i].quantity, i);
        await this.tools.setText("input[name='invoiceRate']", testCase.provisionalData.products[i].rate, i);
      }

    if(testCase.invoiceType != "Final Invoice" && testCase.provisionalData && testCase.provisionalData.costs)
      for (let i = 0; i < testCase.provisionalData.costs.length; i++) 
      {       
        await this.tools.selectBySelector("select.form-control[ng-model='INV_SELECTED_COST']", testCase.provisionalData.costs[i].name);
        await this.tools.click("a.btn[ng-click='addCostDetail(INV_SELECTED_COST)']");
        await this.tools.selectBySelector("#grid_invoiceCostDetails_costType_" + i, testCase.provisionalData.costs[i].type);
        await this.tools.selectBySelector("#grid_invoiceCostDetails_product_" + i, testCase.provisionalData.costs[i].applicableFor);
        await this.tools.setText("#grid_invoiceCostDetails_invoiceQuantity_" + i, testCase.provisionalData.costs[i].quantity);
        await this.tools.setText("#grid_invoiceCostDetails_invoiceRate_" + i, testCase.provisionalData.costs[i].unitPrice);    
      }

      if(testCase.invoiceType == "Final Invoice" && testCase.finalData)
          for (let i = 0; i < testCase.finalData.products.length; i++) 
          { 
            await this.tools.setText("input[name='invoiceQuantity']", testCase.finalData.products[i].quantity, i);
            await this.tools.setText("input[name='invoiceRate']", testCase.finalData.products[i].rate, i);
          }

      if(testCase.invoiceType != "Final Invoice" && testCase.finalData && testCase.finalData.costs)
        for (let i = 0; i < testCase.finalData.costs.length; i++) 
        {       
          await this.tools.selectBySelector("select.form-control[ng-model='INV_SELECTED_COST']", testCase.provisionalData.costs[i].name);
          await this.tools.click("a.btn[ng-click='addCostDetail(INV_SELECTED_COST)']");
          await this.tools.selectBySelector("#grid_invoiceCostDetails_costType_" + i, testCase.provisionalData.costs[i].type);
          await this.tools.selectBySelector("#grid_invoiceCostDetails_product_" + i, testCase.provisionalData.costs[i].applicableFor);
          await this.tools.setText("#grid_invoiceCostDetails_invoiceQuantity_" + i, testCase.provisionalData.costs[i].quantity);
          await this.tools.setText("#grid_invoiceCostDetails_invoiceRate_" + i, testCase.provisionalData.costs[i].unitPrice);    
        }

    await this.tools.clickOnItemByText('a[ng-click*="save_master_changes()"]', 'Save');    
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterSave);
    
    if(testCase.invoiceStatusAfterSubmit)
    {
      if(!await this.tools.isElementVisible("a[ng-click='$eval(value.action)']", 200, "Submit For Approval Invoice"))
        await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
      await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Submit For Approval Invoice');
      await this.checkInvoiceStatus(testCase.invoiceStatusAfterSubmit);
    }
    
    if(!await this.tools.isElementVisible("a[ng-click='$eval(value.action)']", 200, "Approve Invoice"))
        await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Approve Invoice');
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterApprove);

    if(testCase.testRevert)
    {
        await this.tools.clickOnItemByText("a[ng-click='revert_invoice()']", 'Revert');
        await this.checkInvoiceStatus(testCase.invoiceStatusAfterSave);
        
        if(testCase.invoiceStatusAfterSubmit)
        {
          await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
          await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Submit For Approval Invoice');        
          await this.checkInvoiceStatus(testCase.invoiceStatusAfterSubmit);
        }
        
        await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
        await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Approve Invoice');
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

    if(testCase.createFinalFromProvisional) {
      await this.CreateFinalInvoiceFromProvizional(testCase);      
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



  async CreateFinalInvoiceFromProvizional(testCase)
  {

    if(!testCase.finalData)
      throw  new Error("Missing data for final invoice");

    //create final invoice
    await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Create Final Invoice');
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
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Approve Invoice');
    await this.tools.waitForLoader();

  }
}


module.exports = ShiptechInvoice;

