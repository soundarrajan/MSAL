/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');
const csv=require('csvtojson/v2');
const isNumber = require('is-number');


class ShiptechInvoicesTreasuryReport {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }



  async clearFilters()
  {
      await this.tools.waitForLoader();
      var selector = "input[name='isDefault']";
      this.tools.waitFor(selector);
      var checkbox = await this.tools.page.$(selector);
      var ischecked = await (await checkbox.getProperty('checked')).jsonValue();
      if(ischecked)
      {        
        await this.tools.clickBySelector(selector);
        await this.tools.waitForLoader();
        checkbox = await this.tools.page.$(selector);
        ischecked = await (await checkbox.getProperty('checked')).jsonValue();
        if(ischecked)
          throw  new Error("Cannot uncheck " + selector);
        
        //save this configuration
        await this.tools.clickBySelector("#save_layout");
        await this.tools.waitForLoader();
        //const links = await this.tools.page.evaluate(() => { location.reload() });
        //await this.tools.waitForLoader();
      }
      
      
  }



  async TreasuryReport(testCase, commonTestData)
  {
    testCase.url = "invoices/treasuryreport";
    if(!testCase.pageTitle)
      testCase.pageTitle = "Treasury Report";

    testCase.result = true;
    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
    {      
      testCase.result = false;
      return testCase;
    }

    if(!commonTestData)
      throw new Error("missing parameter commonTestData");

    if(!testCase.input)
    throw new Error("Treasury Report no input parameters.");
    
    if(!testCase.input.orderId)
      throw new Error("orderId not defined in input parameters");

    if(!testCase.orderId || testCase.orderId.length <= 0)
      testCase.orderId = commonTestData[testCase.input.orderId];

    if(!testCase.orderId)
      throw new Error("missing OrderId parameter from TreasuryReport");

    this.tools.log("OrderId=" + testCase.orderId);
      /*//navigate using the menu
      await this.tools.click('div.menu-toggler.sidebar-toggler');
      this.tools.log("Open side menu");  
      await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
          
      var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Invoices');    
      result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/invoices/treasuryreport')\"] > span", 'Treasury report');
      await this.tools.waitFor(3000);
      await this.tools.waitForLoader();
      //*/

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    if(!labelTitle.includes("Treasury Report"))
    {
      this.tools.error("Tresury Report - invalid page label");
      testCase.result = false;
      return testCase;
    }

    await this.clearFilters();
    await this.shiptech.filterByOrderId(testCase.orderId);
    
    await this.tools.clickOnItemWait("a[data-sortcol='invoice_id']");
    await this.tools.clickOnItemByText("a[ng-click='columnSort(table, sortcol, 1,  columnFilters[column][0].column.sortColumnValue, columnFilters[column][0])", 'Sort Ascending');
    await this.tools.waitFor(2000);
    await this.tools.waitForLoader("Sort Treasury Report");
       
    var exportFolder = await this.tools.prepareDownloadFolder();
    
    await this.tools.clickOnItemWait("a.btn.export_csv");
    await this.tools.waitForLoader("Export with filters - Treasury Report");
    await this.tools.waitFor(2000);

    //wait for the file to be saved
    var exportFile = exportFolder + "\\TreasuryReport.csv";
    await this.tools.waitForFile(exportFile);    
    
    const jsonArray = await csv({
      trim:true,
      checkColumn: false
    }).preRawData((csvRawData)=>{
      var newData=csvRawData.replace(/\0/g, '');
      return newData;
   }).fromFile(exportFile);


    if(this.checkTreasuryReport(jsonArray, testCase))
    {
      this.tools.log("Treasury report test PASSED!");
      testCase.result = true;
    }
    else
    {
      this.tools.log("Treasury report test FAILED!");
      testCase.result = false;
    }
    
    await this.tools.closeCurrentPage();    
    return testCase;
  
  }



  checkTreasuryReport(reportCase, testCase)
  {

    var result = true;

    if(reportCase.length != testCase.rows.length)
    {
        this.tools.log("Treasury report contains " + reportCase.length + " rows but the test case has " + testCase.rows.length);
        return false;
    }    

    for(var i=0; i<testCase.rows.length; i++)
    {
      var rowTest = testCase.rows[i];
      var rowReport = reportCase[i];

      for(var key in rowTest)
      {
        
        var valTest = rowTest[key];        

        if(!valTest && valTest != "")
        {
          this.tools.log("The field " + key + " was not found in test case.");
          result = false;
          continue;
        }

        valTest = valTest.toString();
        valTest = valTest.replace(/,/g, '');
        
        if(!rowReport[key] && valTest.length > 0 && valTest!="0")
        {
          this.tools.log("The field " + key + " was not found in raport.");
          result = false;
          continue;
        }

        var valReport = rowReport[key];
        if(!valReport)
          valReport = "";
        valReport = valReport.toString();
        valReport = valReport.replace(/,/g, '');

        if(isNumber(valTest))
        {
          var floatTest = parseFloat(valTest);
          var floatReport = parseFloat(valReport);

          if(isNaN(floatTest))
          {
            this.tools.log("Invlid number in testCase: " + floatTest);
            result = false;
          }
          else if(isNaN(floatReport))
          {
            this.tools.log("Invlid number in testCase: " + floatReport);
            result = false;
          }
          else if(Math.trunc(floatTest) != Math.trunc(floatReport))
          {
            this.tools.log("Numbers don't match for " + key + "; row: " + (i+1) + " : test: " + floatTest + " report: " + floatReport);
            result = false;
          }
        }
        else if(valTest != valReport)
        {
           this.tools.log("Difference in report: " + key + "; row: "+ (i+1)  +" Report:" + rowReport[key] + "; TestCase:" + rowTest[key]);
           result = false;
        }
      }
    }

    return result;
  }

  
  

}


module.exports = ShiptechInvoicesTreasuryReport;


