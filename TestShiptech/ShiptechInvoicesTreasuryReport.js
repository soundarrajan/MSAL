/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');
const h2p = require('html2plaintext');
const fs = require('fs');
const csv=require('csvtojson/v2');


class ShiptechInvoicesTreasuryReport {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }



  async clearFilters()
  {
      var selector = "input[name='isDefault']";
      this.tools.waitFor(selector);
      var checkbox = await this.tools.page.$(selector);
      var ischecked = await (await checkbox.getProperty('checked')).jsonValue();
      if(ischecked)
      {        
        await this.tools.clickBySelector("span.fa-save");
        await this.tools.waitForLoader();
        checkbox = await this.tools.page.$(selector);
        ischecked = await (await checkbox.getProperty('checked')).jsonValue();
        if(ischecked)
          throw "Cannot uncheck " + selector;
        
        await this.tools.waitForLoader();
        //const links = await this.tools.page.evaluate(() => { location.reload() });
        //await this.tools.waitForLoader();
      }
      
      
  }



  async TreasuryReport(testCase)
  {
    this.tools.log("Loading Treasury Report...");
    await this.tools.waitForLoader();

    const pageTitle = await this.tools.page.title();
    if(pageTitle != "Treasury Report")
    {
      await this.tools.click('div.menu-toggler.sidebar-toggler');
      this.tools.log("Open side menu");  
      await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
          
      var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Invoices');    
      result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/invoices/treasuryreport')\"] > span", 'Treasury report');
      var page = await this.tools.getPage("Treasury Report", true);
      this.shiptech.page = page;
    }

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes("Treasury Report"))
      throw "Tresury Report - invalid page";

    await this.clearFilters();

    await this.tools.clickOnItemWait("a[data-sortcol='order_name']");
    //await this.tools.clickBySelector("title="Order_Name");
    await this.tools.setText("#filter0_Text", testCase.orderId);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitFor(2000);
    await this.tools.waitForLoader();        

    await this.tools.clickOnItemWait("a[data-sortcol='invoice_id']");
    await this.tools.clickOnItemByText("a[ng-click='columnSort(table, sortcol, 1,  columnFilters[column][0].column.sortColumnValue)']", 'Sort Ascending');
    await this.tools.waitFor(2000);
    await this.tools.waitForLoader();
       
    var exportFolder = await this.tools.prepareDownloadFolder();
    
    await this.tools.clickOnItemWait("a.btn.export_csv");
    await this.tools.waitForLoader();   
    await this.tools.waitFor(2000);

    
    var exportFile = exportFolder + "\\downloaded\\TreasuryReport.csv";
    await this.tools.waitForFile(exportFile);    
    
    const jsonArray = await csv({
      trim:true,
      checkColumn: false
    }).preRawData((csvRawData)=>{
      var newData=csvRawData.replace(/\0/g, '');
      return newData;
   }).fromFile(exportFile);


    if(this.checkTreasuryReport(jsonArray, testCase))
      this.tools.log("Treasury report test passed!");
   
    //this.tools.log(JSON.stringify(jsonArray));
    //await this.tools.closeCurrentPage();
    return testCase;
  
  }



  checkTreasuryReport(reportCase, testCase)
  {

    if(reportCase.length != testCase.rows.length)
      throw "Treasury report contains " + reportCase.length + " rows but the test case has" + testCase.rows.length;

    var differences = [];

    for(var i=0; i<testCase.rows.length; i++)
    {
      var rowTest = testCase.rows[i];
      var rowReport = reportCase[i];

      for(var key in rowTest)
      {
        if(!rowReport[key])
          throw "The field " + key + " was not found in raport.";

        if(rowTest[key] != rowReport[key])
          differences += "Difference in report: " + key + " Report:" + rowReport[key] + "; TestCase:" + rowTest[key];
      }

      if(differences.length > 0)
        break;
    }


    var error = "";
    if(differences.length > 0)
    {
      for(var i=0; i<differences.length; i++)
        error += differences[i] + "\n";

      throw error;
    }



    /*
    Calculated Amount
    Invoice Amount
    Due Date
    Working Due Date
    PaymentDate
    Invoice No
    Invoice Type = {"Final Invoice", "Provisional"}
    */

    return true;
  }

  
  

}


module.exports = ShiptechInvoicesTreasuryReport;

