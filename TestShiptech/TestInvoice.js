/**
 * @name main test entry point
 */


const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');
const ShiptechOrder = require('./ShiptechOrder.js');
const ShiptechDeliveryNew = require('./ShiptechDeliveryNew.js');
const ShiptechInvoicesDeliveriesList = require('./ShiptechInvoicesDeliveriesList.js');
const ShiptechInvoicesTreasuryReport = require('./ShiptechInvoicesTreasuryReport.js');

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

    for(var i=0; i<testCase.testCases.length; i++)
    {
      try
      {
          var currentTestCase = testCase.testCases[i];
          tools.log("Starting test #" + (i+1) + " " + testCase.testTitle);
          tools.currentTextCase = i;
          tools.currentTextTitle = testCase.testTitle;
          var hasPassed = true;

          for (var testScreen in currentTestCase)
          {
            if (!currentTestCase.hasOwnProperty(testScreen))
              continue;

            if(!currentTestCase[testScreen].orderId || currentTestCase[testScreen].orderId.length <= 0)
            currentTestCase[testScreen].orderId = orderId;

            if(testScreen.indexOf("//") >= 0)
              continue;

            if(testScreen == "order")
              testResult = await shiptechOrder.CreateOrder(currentTestCase[testScreen]);
            if(testScreen == "delivery")
              testResult = await shiptechDeliveryNew.DeliveryNew(currentTestCase[testScreen]);
            if(testScreen == "invoice")
              testResult = await shiptechDeliveriesList.InvoiceDeliveriesList(currentTestCase[testScreen]);
            if(testScreen == "treasury")
              testResult = await shiptechTreasuryReport.TreasuryReport(currentTestCase[testScreen]);
  
            if(currentTestCase[testScreen].orderId && currentTestCase[testScreen].orderId.length > 0)
            {
              orderId = currentTestCase[testScreen].orderId;                        
              tools.currentBusinessReferenceName = "Order Id";
              tools.currentBusinessReferenceId = orderId;
            }

            if(!testResult.result)
              hasPassed = false;
          }

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
        if(testCase.testCases[i].order)
        {
          if(testCase.testCases[i].order.eta)
            testCase.testCases[i].order.eta = await shiptech.getFutureDate(testCase.testCases[i].order.eta, true);          
        }

        if(testCase.testCases[i].delivery)
        {
          if(testCase.testCases[i].delivery.bdnDate)
            testCase.testCases[i].delivery.bdnDate = await shiptech.getFutureDate(testCase.testCases[i].delivery.bdnDate, false);
        }

        
        if(testCase.testCases[i].invoice)
        {
          if(testCase.testCases[i].invoice.paymentDate)             
            testCase.testCases[i].invoice.paymentDate = await shiptech.getFutureDate(testCase.testCases[i].invoice.paymentDate, false);
        }


        if(testCase.testCases[i].treasury)
        {
          for(var j=0; j<testCase.testCases[i].treasury.rows.length; j++)
          {
              var row = testCase.testCases[i].treasury.rows[j];

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













