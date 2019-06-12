/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');
const csv=require('csvtojson/v2');
const isNumber = require('is-number');



class ShiptechInvoicesCompleteView {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async CompleteView(testCase, commonTestData)
  {

    testCase.result = true;
    this.tools.log("Loading Complete View");
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
        
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Invoices');    
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/invoices/complete_view')\"] > span", 'Complete view');
    var page = await this.tools.getPage("Complete View List", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes("Complete View List"))
      throw new Error("Cannot display Complete View List label: " + labelTitle);

      if(!commonTestData)
      throw new Error("missing parameter commonTestData");

    if(!testCase.input)
    throw new Error("Complete View no input parameters.");
    
    if(!testCase.input.orderId)
      throw new Error("orderId not defined in input parameters");

    if(!testCase.orderId || testCase.orderId.length <= 0)
      testCase.orderId = commonTestData[testCase.input.orderId];

    if(!testCase.orderId)
      throw new Error("missing OrderId parameter from Complete View");


      await this.shiptech.clearFilters();
      await this.shiptech.filterByOrderId(testCase.orderId);
      
      await this.tools.clickOnItemWait("a[data-sortcol='invoice_id']");
      await this.tools.clickOnItemByText("a[ng-click='columnSort(table, sortcol, 1,  columnFilters[column][0].column.sortColumnValue, columnFilters[column][0])", 'Sort Ascending');
      await this.tools.waitFor(2000);
      await this.tools.waitForLoader("Sort Complete View Report");
         
      var exportFolder = await this.tools.prepareDownloadFolder();
      
      await this.tools.clickOnItemWait("a.btn.export_csv");
      await this.tools.waitForLoader("Export with filters - Complete View Report");
      await this.tools.waitFor(2000);
  
      //wait for the file to be saved
      var exportFile = exportFolder + "\\Invoice.csv";
      await this.tools.waitForFile(exportFile);    
      
      const jsonArray = await csv({
        trim:true,
        checkColumn: false
      }).preRawData((csvRawData)=>{
        var newData=csvRawData.replace(/\0/g, '');
        return newData;
     }).fromFile(exportFile);
  
  
      if(this.checkCompleteView(jsonArray, testCase))
      {
        this.tools.log("Complete View report test PASSED!");
        testCase.result = true;
      }
      else
      {
        this.tools.log("Complete View report test FAILED!");
        testCase.result = false;
      }


    await this.tools.waitFor(5000);
    await this.tools.closeCurrentPage();
    
  
  }



  findBestMatchingRow(reportList, etalon)
  {
    if(reportList.length <= 0)
      return null;
    if(reportList.length == 1)
      return reportList[0];
    var i = 0;
    var maxi = 0;
    var max = -1;

    var matchScoreList = new Array(reportList.length);

    for(i=0; i<reportList.length; i++)
    {
      matchScoreList[i] = 0;
      for(var key in etalon)
      { 
        var valTest = etalon[key];
        if(!valTest && valTest != "")
          continue;
        valTest = valTest.toString();
        valTest = valTest.replace(/,/g, '');

        var valReport = reportList[i][key];
        if(!valReport)
          continue;
        valReport = valReport.toString();
        valReport = valReport.replace(/,/g, '');

        if(isNumber(valTest))
        {
          var floatTest = parseFloat(valTest);
          var floatReport = parseFloat(valReport);

          if(isNaN(floatTest))
            continue;

          if(isNaN(floatReport))
            continue;
          
          if(floatTest == floatReport)
            matchScoreList[i] += 3;

          else if(Math.abs(floatTest - floatReport) < 0.1)
            matchScoreList[i] += 2;

          else if(Math.abs(floatTest - floatReport) < 1)
            matchScoreList[i] += 1;
        }
        else if(valTest == valReport)
          matchScoreList[i] += 3;
        else if (valTest.indexOf(valReport) >= 0 || valReport.indexOf(valTest) >= 0)
        {
          matchScoreList[i] += 1;
        }
      }

    }

    max = -1;
    for(i=0; i<matchScoreList.length; i++)
    {      
      if(max < matchScoreList[i])
      {
        max = matchScoreList[i];
        maxi = i;
      }
    }
    

    return reportList[maxi];
  }




  checkCompleteView(reportCase, testCase)
  {

    var result = true;

    if(reportCase.length != testCase.rows.length)
    {
        this.tools.log("Complete View report contains " + reportCase.length + " rows but the test case has " + testCase.rows.length);
        return false;
    }

    for(var i=0; i<testCase.rows.length; i++)
    {
      var rowTest = testCase.rows[i];
      var rowReport = this.findBestMatchingRow(reportCase, rowTest);
      
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
        if(!valReport || valReport == "")
          valReport = "0";
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
          else if(Math.abs(floatTest - floatReport) > 1)
          {
            this.tools.log("Numbers don't match for " + key + "; row: " + (i+1) + " : test: " + floatTest + " report: " + floatReport);
            result = false;
          }
        }
        else if(Math.abs(floatTest - floatReport) > 1)
        {
           this.tools.log("Difference in report: " + key + "; row: "+ (i+1)  +" Report:" + rowReport[key] + "; TestCase:" + rowTest[key]);
           result = false;
        }
      }
    }

    return result;
  }

  








}


module.exports = ShiptechInvoicesCompleteView;

