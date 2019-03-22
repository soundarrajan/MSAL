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
    var orderId = "";
    await shiptech.ConnectDb(testCase.databaseIntegration, testCase.url, true);    
    await validateTestCase(testCase);
    
    await shiptech.login(testCase.url, testCase.username, testCase.password);

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
  }

    for(var i=0; i<testCase.testCases.length; i++)
    {
      try
      {
          var currentTestCase = testCase.testCases[i];
          tools.log("Starting test #" + (i+1) + " " + testCase.testTitle);

          for (var testScreen in currentTestCase) 
          {
            if (!currentTestCase.hasOwnProperty(testScreen))
              continue;

            if(!currentTestCase[testScreen].orderId || currentTestCase[testScreen].orderId.length <= 0)
            currentTestCase[testScreen].orderId = orderId;

            if(testScreen == "order")
               await shiptechOrder.CreateOrder(currentTestCase[testScreen]);
            if(testScreen == "delivery")
              await shiptechDeliveryNew.DeliveryNew(currentTestCase[testScreen]);
            if(testScreen == "invoice")
              await shiptechDeliveriesList.InvoiceDeliveriesList(currentTestCase[testScreen]);
            if(testScreen == "treasury")
              await shiptechTreasuryReport.TreasuryReport(currentTestCase[testScreen]);
  
            if(currentTestCase[testScreen].orderId && currentTestCase[testScreen].orderId.length > 0)
              orderId = currentTestCase[testScreen].orderId;                        
          }

          tools.createResultsReport(testCase.testTitle, i+1, "PASS", orderId);
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
  }  
  )();




  async function validateTestCase(testCase)
  {

    for(var i=0; i<testCase.testCases.length; i++)
    {
        if(testCase.testCases[i].order)
        {
          if(!testCase.testCases[i].order.eta)
            throw "Missing order.eta";

          testCase.testCases[i].order.eta = await shiptech.getFutureDate(testCase.testCases[i].order.eta, true);
        }

        if(testCase.testCases[i].delivery)
        {
          if(!testCase.testCases[i].delivery.bdnDate)
              throw "Missing delivery.bdnDate";

          testCase.testCases[i].delivery.bdnDate = await shiptech.getFutureDate(testCase.testCases[i].delivery.bdnDate, true);
        }
    }
    

  }













