/** * @name test shiptech dashboard
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
    testCase.result = true;

    if(!commonTestData)
      throw new Error("Missing parameter");

    var orderId = commonTestData[testCase.input.orderId];

    await this.tools.getPage("Invoice - " + orderId + " - " + commonTestData.vesselName, false, true);

    if(testCase.invoiceStatusAfterRevert)
    {
      await this.tools.click('#revert_invoice');     
      await this.checkInvoiceStatus(testCase.invoiceStatusAfterRevert, "invoiceStatusAfterSave");
    }

    await this.tools.click('#openMoreActions');
    await this.tools.click('#btn_Cancel');
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterCancel, "invoiceStatusAfterCancel");
    
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

    if(countButtons < products.length)
      throw new Error("Not enaugh products in invoice.");
  
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




  async insertCosts(costs, commonTestData)
  {
    var i=0; 
    var countButtons = 0;
    var endidx = -1;

    while(i < 100)
    {
      if (await this.tools.page.$("#grid_invoiceCostDetails_remRow_" + i) != null) 
        countButtons++;
      else 
        break;
      i++;
    }

    while(countButtons > costs.length)
    {
      await this.tools.click("#grid_invoiceCostDetails_remRow_0");
      countButtons--;
    }


    for(var k=0; k<15; k++)
    {
      var rowExists = await this.tools.page.$("#grid_invoiceCostDetails_remRow_" + k);
      if(rowExists)
        endidx = k;
    }
    

      //insert costs
      for (i = 0; i < costs.length; i++) 
      {
        if(costs[i].fromOrder)
        {
            var idx = await this.findCostIdx(costs[i], commonTestData);

            if(idx < 0)
              throw new Error("Cannot find cost from order " + costs[i].nameId);

            await this.tools.setText("#grid_invoiceCostDetails_invoiceQuantity_" + idx, costs[i].quantity);
            await this.tools.setText("#grid_invoiceCostDetails_invoiceRate_" + idx, costs[i].unitPrice);  
            if(costs[i].type == "Percent")
                await this.tools.setText("#grid_invoiceCostDetails_invoiceAmount_" + idx, costs[i].amount);
        }
        else
        {
          var typeCostName = costs[i].name;
          if(!typeCostName)
            typeCostName = commonTestData[costs[i].nameId];
          if(!typeCostName)
            throw new Error("Cannot find type for additional cost for invoice");          

          await this.tools.selectBySelector("select.form-control[ng-model='INV_SELECTED_COST']", typeCostName);

          await this.tools.click("a.btn[ng-click='addCostDetail(INV_SELECTED_COST)']");
          endidx++;
        
          await this.tools.selectBySelector("#grid_invoiceCostDetails_costType_" + (i+endidx), costs[i].type);
          if(costs[i].applicableFor && costs[i].applicableFor.toUpperCase() == "ALL")
            await this.tools.selectBySelector("#grid_invoiceCostDetails_product_" + (i+endidx), "All", false, false);
          else
          {
            var prodName = commonTestData.products.find(p => p.id === costs[i].applicableForId).name;
            if(!prodName || prodName.length <= 0)
              throw new Error('Cannot find additional cost product ' + prodName + " " + costs[i].applicableForId);

            await this.tools.selectBySelector("#grid_invoiceCostDetails_product_" + (i+endidx), prodName, false, false);
          }
                  
          await this.tools.setText("#grid_invoiceCostDetails_invoiceQuantity_" + (i+endidx), costs[i].quantity);
          await this.tools.setText("#grid_invoiceCostDetails_invoiceRate_" + (i + endidx), costs[i].unitPrice);
          await this.tools.selectBySelector("#grid_invoiceCostDetails_Currency__invoiceRateCurrency_" + (i + endidx), "MT");

          if(costs[i].type == "Percent")
              await this.tools.setText("#grid_invoiceCostDetails_invoiceAmount_" + (i + endidx), costs[i].amount);
       }
      }
  }




  //search the cost from the screen matching with the cost parameter
  async findCostIdx(cost, commonTestData)
  {
    var prodName = "";
    var i = 0;
    var validIdx = -1;
    var foundIdx = -1;

    if(cost.applicableFor == "All")
      prodName = "All";
    else
    {
      var commonDataCost = commonTestData.products.find(p => p.id == cost.applicableForId);
      if(commonDataCost == null)
        throw new Error('Cannot find common data for ' + cost.applicableForId);

      prodName = commonDataCost.name;
    }

    if(!prodName || prodName.length <= 0)
      throw new Error('Cannot find additional cost product ' + cost.applicableForId);
    
    while(i < 100)
      {
        if (await this.tools.page.$("#grid_invoiceCostDetails_remRow_" + i) != null) 
          {
            var costType = await this.tools.getSelectedOption("#grid_invoiceCostDetails_costType_" + i);
            var product = await this.tools.getSelectedOption("#grid_invoiceCostDetails_product_" + i);
            if(costType == cost.type && product.indexOf(prodName) >= 0)
            {
              if(foundIdx >= 0)
                throw new Error("Multiple similar costs found for " + cost.type + " and " + prodName);
              foundIdx = i;
            }
   
            validIdx = i;
          }
        else 
          {
            if(validIdx >= 0)
              break;//finish the continuous indexed zone
          }
        i++;
      }

      return foundIdx;
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

    if(testCase.provisionalData)
      this.shiptech.findProducts(testCase.provisionalData.products, commonTestData);
    if(testCase.finalData)
      this.shiptech.findProducts(testCase.finalData.products, commonTestData);    

    if(!testCase.input || !testCase.input.orderId)
      throw new Error("orderId not defined in input parameters");

    var orderId = commonTestData[testCase.input.orderId];

    if(!orderId || orderId.length <= 0)
        throw new Error("Missing orderId from parameters in InvoiceDeliveriesList()");

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", commonTestData.defaultCurrency);
    if(testCase.paymentDate)
      await this.tools.setText("#PaymentDate_dateinput", testCase.paymentDate);

    if(testCase.provisionalData && testCase.provisionalData.products)
      await this.insertProducts(testCase.provisionalData.products);      

    if(testCase.action != "final" && testCase.provisionalData && testCase.provisionalData.costs)
      await this.insertCosts(testCase.provisionalData.costs, commonTestData);

    if((testCase.action == "final" || testCase.action == "provisionalThenFinal") && testCase.finalData && testCase.finalData.costs)
      await this.insertCosts(testCase.finalData.costs, commonTestData);

    if(testCase.action == "final" && testCase.finalData && testCase.finalData.products)
       await this.insertProducts(testCase.finalData.products, commonTestData);      
      
    await this.tools.clickOnItemByText('#header_action_save', 'Save');    
    await this.checkInvoiceStatus(testCase.invoiceStatusAfterSave, "invoiceStatusAfterSave");


    if(testCase.cancelInvoice)
    {
      await this.CancelInvoice(testCase, commonTestData);
      if(testCase.output && testCase.output.invoiceId)
        commonTestData[testCase.output.invoiceId] = await this.readInvoiceNumber();    
      await this.tools.closeCurrentPage();
      return testCase;
    }
    

    if(testCase.invoiceStatusAfterSubmit)
    {
      await this.tools.click("#openMoreActions");

      if(await this.tools.isElementVisible("#btn_SubmitForReview")){
        await this.tools.click("#btn_SubmitForReview");
        await this.tools.click("#openMoreActions");        
      }

      if(await this.tools.isElementVisible("#btn_SubmitForReview")){
        await this.tools.click("#btn_Accept");
        await this.tools.click("#openMoreActions");        
      }

      if(await this.tools.isElementVisible("#btn_SubmitForApprovalInvoice", 200, "Submit For Approval Invoice"))
        await this.tools.click("#btn_SubmitForApprovalInvoice");
      
      var currentStatus = await this.checkInvoiceStatus(testCase.invoiceStatusAfterSubmit, "invoiceStatusAfterSubmit");      
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
        await this.tools.clickOnItemByText("a[ng-href='#/edit-order/" + orderId + "']", 'Order');
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
      await this.CreateFinalInvoiceFromProvizional(testCase, commonTestData);      
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
    for(var i=0; i<statusList.length; i++)
    {
      if(labelTitle.includes(statusList[i]))
        isValid = true;        
    }

    if(!isValid)
        throw new Error("The invoice " + title + " status is not as expected: (expected: " + flatStatus + ", current: " + labelTitle + ")");
    
    return labelTitle;
  }



  async CreateFinalInvoiceFromProvizional(testCase, commonTestData)
  {

    if(!testCase.finalData)
      throw  new Error("Missing data for final invoice");

    //create final invoice
    await this.tools.waitForLoader();
    await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Create Final Invoice');
    await this.tools.closeCurrentPage();
    await this.tools.getPage("Invoices", false, true);
    await this.tools.waitForLoader();

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    if(!labelTitle.includes("Invoices :: Edit"))
      this.tools.log("FAIL!");

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", commonTestData.defaultCurrency);

    await this.insertProducts(testCase.finalData.products);
    
    await this.tools.clickOnItemByText('#header_action_save', 'Save');
    await this.tools.waitForLoader();      
    await this.tools.click("#btn_ApproveInvoice");
    await this.tools.waitForLoader();
    await this.tools.waitForLoader();    

  }




  
  async CreateFinalInvoiceSearchProvisional(testCase, commonTestData)
  {

    if(!testCase.finalData)
      throw new Error("CreateFinalInvoiceSearchProvisional(): Missing data for final invoice");

    if(!testCase.input)
      throw new Error("CreateFinalInvoiceSearchProvisional(): No input parameters.");
    
    var orderId = commonTestData[testCase.input.orderId];

    if(!orderId)
      throw new Error("CreateFinalInvoiceSearchProvisional(): orderId from commonTestData.");

    await this.tools.getPage("Invoice - " + orderId + " - " + commonTestData.vesselName, false, true);

    this.tools.log("Create final invoice after searching provisional");

    await this.tools.waitForLoader();

    const pageTitle = await this.tools.page.title();
    if(pageTitle.indexOf("Invoice") < 0 || pageTitle.indexOf("Invoices List") > 0)
    {
      throw new Error("Page title is incorrect: " + pageTitle);
    }

    if(testCase.action != "finalAfterProvisional")
      return testCase;
        
    //create final invoice
    await this.tools.clickOnItemByText("a[data-toggle='dropdown']", '...');
    await this.tools.clickOnItemByText("a[ng-click='$eval(value.action)']", 'Create Final Invoice');    
    //await this.tools.getPage("Invoice - " + commonTestData.orderId + " - " + commonTestData.vesselName, false, true);
    await this.tools.getPage("Invoices", false, true);    

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    if(!labelTitle.includes("Invoices :: Edit"))
      this.tools.log("FAIL!");

    await this.tools.setText("#SellerInvoiceNo", "123456AutoTests");
    await this.tools.selectBySelector("#CurrencyInvoiceRateCurrency", commonTestData.defaultCurrency);

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

