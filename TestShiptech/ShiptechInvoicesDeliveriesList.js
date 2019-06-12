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




  async InvoiceDeliveriesList(testCase, commonTestData)
  {    
    testCase.result = true;
    testCase.url = "invoices/deliveries";
    testCase.pageTitle = "Transactions to be Invoiced List";

    if(!commonTestData)
      throw new Error("Missing parameter");

    if(testCase.action == "provisional" || testCase.action == "provisionalThenFinal")
      testCase.invoiceType = "Provisional Invoice";
    else if(testCase.action == "final")
      testCase.invoiceType = "Final Invoice";    

    if(!testCase.input.orderId)
        throw new Error("orderId not defined in input parameters");

    if(testCase.provisionalData)
      this.shiptech.findProducts(testCase.provisionalData.products, commonTestData);
    if(testCase.finalData)
      this.shiptech.findProducts(testCase.finalData.products, commonTestData);

    if(!testCase.orderId || testCase.orderId.length <= 0)
      testCase.orderId = commonTestData[testCase.input.orderId];

    if(!testCase.orderId || testCase.orderId.length <= 0)
        throw new Error("Missing orderId from parameters in InvoiceDeliveriesList()");

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
   
    await this.shiptech.filterByOrderId(testCase.orderId);

    //checkbox
    //check the row matching the products
    var productData = null;
    if(testCase.provisionalData)
      productData = testCase.provisionalData;
    else 
      productData = testCase.finalData;

    //select the rows having the specified products    
    var rowsInFocus = [];
    for (var i=0; i<productData.products.length; i++)
    {
      var rowIdx = await this.shiptech.findRowIdxContainingText("#flat_invoices_app_deliveries_list", productData.products[i].name);
      if(rowIdx < 0)
        throw new Error("Cannot find product " + productData.products[i].name + " in deliveries list.");
        
      rowsInFocus.push(rowIdx);

      if(i == 0)//all the checkboxes will automaticaly check
        await this.tools.click("#jqg_flat_invoices_app_deliveries_list_" + rowIdx);
      
      //now all the rows should be selected
    }

    //costs that have to be selected
    if(productData.costs)
    {      
      for (var i=0; i<productData.costs.length; i++)
      {
        if(!productData.costs[i].nameId)
           throw new Error("Cost name was not generated, invalid testcase.");

        if(commonTestData[productData.costs[i].nameId])
          productData.costs[i].name = commonTestData[productData.costs[i].nameId];

        //doesn't work because I can't identify corectly the costs
        //for example BARGING may appear multiple times
        var rowIdx = await this.shiptech.findRowIdxContainingText("#flat_invoices_app_deliveries_list", productData.costs[i].name);
        if(rowIdx < 0)
          continue;//that means the costs are not on the order
          
        rowsInFocus.push(rowIdx);
      }
    }

    /*
    //unselect all other rows that are not in the productData.products    
    var rowCount = await this.shiptech.findTableRowsCount("#flat_invoices_app_deliveries_list");
    for(var i=1; i<rowCount; i++)
    {
      if(rowsInFocus.indexOf(i) < 0)
        await this.tools.click("#jqg_flat_invoices_app_deliveries_list_" + i);
    }
    */
    
    if(testCase.action == "provisional")
      testCase.invoiceType = "Provisional Invoice";
    else if(testCase.action == "final")
      testCase.invoiceType = "Final Invoice";

    this.tools.log("Create " + testCase.invoiceType);    
    await this.tools.selectBySelector("#newInvoiceType", testCase.invoiceType);    
    
    await this.tools.clickOnItemByText("a[ng-click='createInvoiceFromDelivery()']", 'Create Invoice');

    var page = await this.tools.getPage("Invoices");
    this.shiptech.page = page;
    
    await this.shiptechInvoice.CreateInvoice(testCase, commonTestData);

    await this.tools.waitFor(5000);
    await this.tools.closeCurrentPage();
  
  
  }

}



module.exports = ShiptechInvoicesDeliveriesList;

