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
          throw  new Error("Cannot uncheck " + selector);
        
        await this.tools.waitForLoader();
        //const links = await this.tools.page.evaluate(() => { location.reload() });
        //await this.tools.waitForLoader();
      }
      
      
  }



  async TreasuryReport(testCase)
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

    await this.tools.clickOnItemWait("a[data-sortcol='order_name']");
    //await this.tools.clickBySelector("title="Order_Name");
    await this.tools.setText("#filter0_Text", testCase.orderId);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitFor(2000);
    await this.tools.waitForLoader();        

    await this.tools.clickOnItemWait("a[data-sortcol='invoice_id']");
    await this.tools.clickOnItemByText("a[ng-click='columnSort(table, sortcol, 1,  columnFilters[column][0].column.sortColumnValue, columnFilters[column][0])", 'Sort Ascending');
    await this.tools.waitFor(2000);
    await this.tools.waitForLoader();
       
    var exportFolder = await this.tools.prepareDownloadFolder();
    
    await this.tools.clickOnItemWait("a.btn.export_csv");
    await this.tools.waitForLoader();   
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

    //this.tools.log(JSON.stringify(jsonArray));
    //await this.tools.closeCurrentPage();
    return testCase;
  
  }



  checkTreasuryReport(reportCase, testCase)
  {

    var result = true;

    if(reportCase.length != testCase.rows.length)
    {
        this.tools.log("Treasury report contains " + reportCase.length + " rows but the test case has" + testCase.rows.length);
        return false;
    }    

    for(var i=0; i<testCase.rows.length; i++)
    {
      var rowTest = testCase.rows[i];
      var rowReport = reportCase[i];

      for(var key in rowTest)
      {
        
        var valTest = rowTest[key];
        valTest = valTest.replace(/,/g, '');
        var valReport = rowReport[key];
        valReport = valReport.replace(/,/g, '');        

        if(!rowReport[key] && valTest.length > 0 && valTest!="0")
        {
          this.tools.log("The field " + key + " was not found in raport.");
          result = false;
          continue;
        }


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


