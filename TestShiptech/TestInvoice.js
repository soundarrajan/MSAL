/**
 * @name main test entry point
 */


const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');
const ShiptechOrder = require('./ShiptechOrder.js');
const ShiptechDeliveryNew = require('./ShiptechDeliveryNew.js');
const ShiptechInvoicesDeliveriesList = require('./ShiptechInvoicesDeliveriesList.js');
const ShiptechInvoicesTreasuryReport = require('./ShiptechInvoicesTreasuryReport.js');
const ShiptechInvoicesList = require('./ShiptechInvoicesList.js');

var tools = new TestTools24();
var shiptech = new ShiptechTools(tools);

(async () => {  

  try
  {    
    var testCase = tools.ReadTestCase();
    tools.baseUrl = testCase.baseurl;
    var testResult = null;
    var orderId = "";
    await shiptech.ConnectDb(testCase.databaseIntegration, testCase.baseurl, true);    
    await validateTestCase(testCase);    
    await shiptech.login(testCase.starturl, testCase.username, testCase.password, testCase.headless);

    var shiptechOrder = new ShiptechOrder(tools, shiptech);
    var shiptechDeliveryNew = new ShiptechDeliveryNew(tools, shiptech);
    var shiptechDeliveriesList = new ShiptechInvoicesDeliveriesList(tools, shiptech);  
    var shiptechTreasuryReport = new ShiptechInvoicesTreasuryReport(tools, shiptech);
    var shiptechInvoicesList =  new ShiptechInvoicesList(tools, shiptech);
  }
  catch(error)
  {
    if(error.message)
      tools.error(error.message);
    else 
      tools.error(error);

    if(error.stack)
      tools.error(error.stack);

    process.exit(1);
  }

  if (!testCase.testTitle)
            throw new Error("testTitle missing from the testcase.");

    for(var i=0; i<testCase.testCases.length; i++)
    {
      try
      {
          var currentTestCase = testCase.testCases[i];
          if (!currentTestCase.hasOwnProperty("keyname"))
            throw new Error("keyname missing from the testcase.");

          tools.log("Starting test #" + (i+1) + " " + currentTestCase["keyname"] + " " + testCase.testTitle);
          tools.log("____________________________");
          tools.log("");
          tools.currentTextCase = i;
          tools.currentTextTitle = testCase.testTitle;
          var hasPassed = true;          

          if(!currentTestCase.orderId || currentTestCase.orderId.length <= 0)
            currentTestCase.orderId = orderId;

          if(currentTestCase.keyname == "order")
            testResult = await shiptechOrder.CreateOrder(currentTestCase);
          if(currentTestCase.keyname == "delivery")
            testResult = await shiptechDeliveryNew.DeliveryNew(currentTestCase);
          if(currentTestCase.keyname == "invoice")
          {
            if(currentTestCase.action == "new")
              testResult = await shiptechDeliveriesList.InvoiceDeliveriesList(currentTestCase);
            else if(currentTestCase.action == "cancel")
              testResult = await shiptechInvoicesList.InvoicesList(currentTestCase);
          }
          if(currentTestCase.keyname == "treasury")
            testResult = await shiptechTreasuryReport.TreasuryReport(currentTestCase);

          if(currentTestCase.orderId && currentTestCase.orderId.length > 0)
          {
            orderId = currentTestCase.orderId;                        
            tools.currentBusinessReferenceName = "Order Id";
            tools.currentBusinessReferenceId = orderId;
          }

          if(!testResult.result)
            hasPassed = false;
          

          if(hasPassed)
            tools.createResultsReport(testCase.testTitle, i+1, "PASS", orderId);
          else
            tools.createResultsReport(testCase.testTitle, i+1, "FAIL", orderId);          
      }
      catch(error)
      {
        if(error.message)
          tools.error(error.message);
        else 
          tools.error(error);
    
        if(error.stack)
          tools.error(error.stack);          

        tools.createResultsReport(testCase.testTitle, i+1, "FAIL", orderId);
      }
    }
    await tools.Close();
    tools.log(testCase.testTitle + " FINISHED");
    process.exit(1);
  }  
  )();




  async function validateTestCase(testCase)
  {

    if(!testCase.headless)
      testCase.headless = false;

    for(var i=0; i<testCase.testCases.length; i++)
    {
        if(testCase.testCases[i].keyname == "order")
        {
          if(testCase.testCases[i].eta)
            testCase.testCases[i].eta = await shiptech.getFutureDate(testCase.testCases[i].eta, true);          
        }

        if(testCase.testCases[i].keyname == "delivery")
        {
          if(testCase.testCases[i].bdnDate)
            testCase.testCases[i].bdnDate = await shiptech.getFutureDate(testCase.testCases[i].bdnDate, false);
        }

        
        if(testCase.testCases[i].keyname == "invoice")
        {
          if(testCase.testCases[i].paymentDate)             
            testCase.testCases[i].paymentDate = await shiptech.getFutureDate(testCase.testCases[i].paymentDate, false);
        }


        if(testCase.testCases[i].keyname == "treasury")
        {
          for(var j=0; j<testCase.testCases[i].rows.length; j++)
          {
              var row = testCase.testCases[i].rows[j];

              if(row.PaymentDate)                 
                row.PaymentDate = await shiptech.getFutureDate(row.PaymentDate, false);
              if(row["Due Date"])                 
                row["Due Date"] = await shiptech.getFutureDate(row["Due Date"], false);
              if(row["Working Due Date"])
                row["Working Due Date"] = await shiptech.getFutureDate(row["Working Due Date"], false);
          }
        }

    }
    

  }













