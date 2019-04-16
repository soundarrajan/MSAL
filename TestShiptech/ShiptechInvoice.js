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

  async CancelInvoice(testCase, commonTestData)
  {   
    if(testCase.action != "cancel")
      return testCase;

    if(!commonTestData)
      throw new Error("Missing parameter");

    await this.tools.click('a[ng-click="$eval(value.action)"]');
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterCancel, "invoiceStatusAfterCancel");
    
    return testCase;
  }




  async insertProducts(products)
  {
    var i=0;  
    var countButtons = 0;

    //count the product rows
    for(i=0; i<100; i++)
      if(await this.tools.isElementVisible("#grid_invoiceProductDetails_remRow_" + i))
        countButtons++;
      else
        break;
        
  
    //delete if there are more
    for(i=0; i<countButtons; i++)
    {
      var productName = await this.tools.getTextValue("#grid_invoiceProductDetails_invoicedProduct_" + i);
      if(productName && productName.length > 0)
      {
        let product = products.find(p => p.name == productName);
        if(product)
        {
          await this.tools.setText("#grid_invoiceProductDetails_invoiceQuantity_" + i, product.quantity);
          await this.tools.setText("#grid_invoiceProductDetails_invoiceRate_" + i, product.rate);
        }
        else
        {
          await this.tools.click("#grid_invoiceProductDetails_remRow_" + i);
        }
      }
    }
  }




  async insertCosts(costs)
  {
    var i=0; 
    var countButtons = 0;
    var startidx = 0;


    while(i < 100)
    {
      if (await this.tools.page.$("#grid_invoiceCostDetails_remRow_" + i) != null) 
        countButtons++;
      else 
        break;
      i++;
    }
    
    for(i=0; i<countButtons; i++)
      await this.tools.click("#grid_invoiceCostDetails_remRow_" + i);

      //insert new ones
      for (i = 0; i < costs.length; i++)
      {       
        await this.tools.selectBySelector("select.form-control[ng-model='INV_SELECTED_COST']", costs[i].name);
        await this.tools.click("a.btn[ng-click='addCostDetail(INV_SELECTED_COST)']");
        //find out if the items start with 0 or with 1
        if(i==0)
        {
          var row0Exists = await this.tools.page.$("#grid_invoiceCostDetails_remRow_" + 0);
          var row1Exists = await this.tools.page.$("#grid_invoiceCostDetails_remRow_" + 1);
          if(!row0Exists && row1Exists)
            startidx = 1;
          if(!row0Exists && !row1Exists)
            throw new Error("Cannot add costs to the list.");
        }

        await this.tools.selectBySelector("#grid_invoiceCostDetails_costType_" + (i+startidx), costs[i].type);
        await this.tools.selectBySelector("#grid_invoiceCostDetails_product_" + (i+startidx), costs[i].applicableFor);
        await this.tools.setText("#grid_invoiceCostDetails_invoiceQuantity_" + (i+startidx), costs[i].quantity);
        await this.tools.setText("#grid_invoiceCostDetails_invoiceRate_" + (i + startidx), costs[i].unitPrice);
      }
  }


  async CreateInvoice(testCase, commonTestData)
  {   

    if(testCase.paymentDate)
    {
      if(await this.shiptech.validateDate(testCase.paymentDate) != true)
      {
        var dateFormat = await this.shiptech.getDateFormat();
        throw  new Error("Invalid date format " + testCase.paymentDate + " valid format: " + dateFormat);
      }
    }    

    if(!testCase.input.orderId)
      throw new Error("orderId not defined in input parameters");

    if(!testCase.orderId || testCase.orderId.length <= 0)
      testCase.orderId = commonTestData[testCase.input.orderId];

    if(!testCase.orderId || testCase.orderId.length <= 0)
        throw new Error("Missing orderId from parameters in InvoiceDeliveriesList()");

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", testCase.currency);
    if(testCase.paymentDate)
      await this.tools.setText("#PaymentDate_dateinput", testCase.paymentDate);

    if(testCase.provisionalData && testCase.provisionalData.products)
      await this.insertProducts(testCase.provisionalData.products);      

    if(testCase.action != "final" && testCase.provisionalData && testCase.provisionalData.costs)
      await this.insertCosts(testCase.provisionalData.costs);

    if(testCase.action == "final" && testCase.finalData)
       await this.insertProducts(testCase.finalData.products);      

    if(testCase.action != "final" && testCase.finalData && testCase.finalData.costs)
       await this.insertCosts(testCase.finalData.costs);
      
    await this.tools.clickOnItemByText('#header_action_save', 'Save');    
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterSave, "invoiceStatusAfterSave");
    
    if(testCase.invoiceStatusAfterSubmit)
    {
      if(!await this.tools.isElementVisible("a[ng-click='$eval(value.action)']", 200, "Submit For Approval Invoice"))
        await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
      await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Submit For Approval Invoice');
      await this.checkInvoiceStatus(testCase.invoiceStatusAfterSubmit, "invoiceStatusAfterSubmit");
    }

    
    await this.tools.click("#btn_ApproveInvoice");
    await this.tools.waitForLoader();
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterApprove, "invoiceStatusAfterApprove");

    if(testCase.testRevert)
    {
        await this.tools.clickOnItemByText("a[ng-click='revert_invoice()']", 'Revert');
        await this.checkInvoiceStatus(testCase.invoiceStatusAfterSave, "invoiceStatusAfterSave");
        
        if(testCase.invoiceStatusAfterSubmit)
        {
          await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
          await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Submit For Approval Invoice');        
          await this.checkInvoiceStatus(testCase.invoiceStatusAfterSubmit, "invoiceStatusAfterSubmit");
        }
        
        await this.tools.click("#btn_ApproveInvoice");
        await this.tools.waitForLoader();
        await this.checkInvoiceStatus(testCase.invoiceStatusAfterApprove, "invoiceStatusAfterApprove");
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
        await this.checkInvoiceStatus(testCase.invoiceStatusAfterApprove, "invoiceStatusAfterApprove");
    }

    if(testCase.action == "provisionalThenFinal") {
      await this.CreateFinalInvoiceFromProvizional(testCase);      
    }

    if(testCase.output && testCase.output.invoiceId)
      commonTestData[testCase.output.invoiceId] = await this.readInvoiceNumber();
    
    await this.tools.closeCurrentPage();
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


async readInvoiceNumber()
{
  await this.tools.waitForLoader();
  var labelTitle = await this.tools.getText("p.navbar-text.ng-binding");
  labelTitle = labelTitle.replace(/[^0-9]/gi, '');  
  this.tools.log("Current invoice number: " + labelTitle);
  return labelTitle;
}



  async checkInvoiceStatus(status, title = "")
  {
    var flatStatus = "";
    if(!status)
      throw  new Error("checkInvoiceStatus() " + status + " is not specified in the testcase.");
    
    await this.tools.waitForLoader();
    var labelTitle = await this.tools.getText("span[ng-if='state.params.status.name']");
    labelTitle = labelTitle.replace(/[^0-9a-z]/gi, '');
    labelTitle = labelTitle.trim();
    this.tools.log("Current invoice status " + labelTitle);

    var statusList = [];
    if(Array.isArray(status))
      statusList = status;      
    else 
      statusList.push(status);

    flatStatus = statusList.join(",");
      
    var isValid = false;
    var flatStatus = status.join
    for(var i=0; i<statusList.length; i++)
    {
      if(labelTitle.includes(statusList[i]))
        isValid = true;        
    }

    if(!isValid)
        throw new Error("The invoice " + title + " status is not as expected: (expected: " + flatStatus + ", current: " + labelTitle + ")");
    
    return true;
  }



  async CreateFinalInvoiceFromProvizional(testCase)
  {

    if(!testCase.finalData)
      throw  new Error("Missing data for final invoice");

    //create final invoice
    await this.tools.waitForLoader();
    await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Create Final Invoice');
    await this.tools.waitForLoader();

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    if(!labelTitle.includes("Invoices :: Edit"))
      this.tools.log("FAIL!");

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", testCase.currency);

    await this.insertProducts(testCase.finalData.products);
    
    await this.tools.clickOnItemByText('#header_action_save', 'Save');
    await this.tools.waitForLoader();      
    await this.tools.click("#btn_ApproveInvoice");
    await this.tools.waitForLoader();
    await this.tools.waitForLoader();    

  }




  
  async CreateFinalInvoiceSearchProvisional(testCase)
  {

    if(!testCase.finalData)
      throw  new Error("Missing data for final invoice");    

    this.tools.log("Create final invoice after searching provisional");

    await this.tools.waitForLoader();

    const pageTitle = await this.tools.page.title();
    if(pageTitle.indexOf("Invoice") < 0)
      {
        throw new Error("Page title is incorrect.");
      }

    if(testCase.action != "finalAfterProvisional")
      return testCase;
        
    //create final invoice
    await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Create Final Invoice');    
    await this.tools.getPage("Invoices", false, false);    

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    if(!labelTitle.includes("Invoices :: Edit"))
      this.tools.log("FAIL!");

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", testCase.currency);

    for (let i = 0; i < testCase.finalData.products.length; i++) 
    { 
      await this.tools.setText("#grid_invoiceProductDetails_invoiceQuantity_" + i, testCase.finalData.products[i].quantity);
      await this.tools.setText("#grid_invoiceProductDetails_invoiceRate_" + i, testCase.finalData.products[i].rate);
    }

    await this.tools.clickOnItemByText('#header_action_save', 'Save');
    await this.tools.waitForLoader();      
    await this.tools.click("#btn_ApproveInvoice");
    await this.tools.waitForLoader();
    await this.tools.waitForLoader();
    await this.tools.closeCurrentPage();

  }




}


module.exports = ShiptechInvoice;

