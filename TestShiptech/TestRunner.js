/**
 * @name main test entry point
 */


const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');
const ShiptechTestDataGen = require('./ShiptechTestDataGen.js');
const ShiptechOrder = require('./ShiptechOrder.js');
const ShiptechDeliveryNew = require('./ShiptechDeliveryNew.js');
const ShiptechInvoicesDeliveriesList = require('./ShiptechInvoicesDeliveriesList.js');
const ShiptechInvoicesTreasuryReport = require('./ShiptechInvoicesTreasuryReport.js');
const ShiptechInvoicesCompleteView = require('./ShiptechInvoicesCompleteView.js');
const ShiptechInvoicesList = require('./ShiptechInvoicesList.js');
const ShiptechAdditionalCost = require('./ShiptechAdditionalCost.js');
const ShiptechAgreementType = require('./ShiptechAgreementType.js');
const ShiptechMasterBarge = require('./ShiptechMasterBarge.js');
const ShiptechMasterBuyer = require('./ShiptechMasterBuyer.js');
const ShiptechMasterCalendar = require('./ShiptechMasterCalendar.js');
const ShiptechMasterClaim = require('./ShiptechMasterClaim.js');
const ShiptechMasterCompany = require('./ShiptechMasterCompany.js');
const ShiptechMasterContactType = require('./ShiptechMasterContactType.js');
const ShiptechMasterCounterparty = require('./ShiptechMasterCounterparty.js');
const ShiptechMasterCountry = require('./ShiptechMasterCountry.js');
const ShiptechMasterCurrency = require('./ShiptechMasterCurrency.js');
const ShiptechMasterStrategy = require('./ShiptechMasterStrategy.js');
const ShiptechMasterDeliveryOption = require('./ShiptechMasterDeliveryOption.js');
const ShiptechMasterDocumentType = require('./ShiptechMasterDocumentType.js');
const ShiptechMasterEmailLog = require('./ShiptechMasterEmailLog.js');
const ShiptechMasterEvent = require('./ShiptechMasterEvent.js');




var schedule = require('node-schedule');


var tools = new TestTools24();
var shiptech = new ShiptechTools(tools);



(async () => {  


  var args = process.argv.slice(2);  
  if(!args || args.length < 2)
    {
      console.log("Shiptech 24S Automatic Testing tool:");
      console.log("Usage:");
      console.log(">node TestRunner.js Scenario_X.json connection.XXX.json start_hour");
      process.exit(1);
      return;
    }


  if(args.length >= 3)
  {//scheduler activated, wait for the scheduled moment to run this test
    var scheduleCmd = args[2];

    var rule = new schedule.RecurrenceRule();
    
    rule.hour = parseInt(args[2]);
    if(args.length > 3)
      rule.minute = parseInt(args[3]);    

    console.log('Test is scheduled at ' + paddy(rule.hour) + ":" + paddy(rule.minute));
    var j = schedule.scheduleJob(rule, async function(){
      console.log('Launching the test now!');
      await executeTest();
    });
  }
  else
    await executeTest();


})();





  async function executeTest()
  {

    try
    {
    var testCase = tools.ReadTestCase();
    var commonTestData = {};
    var orderId = "";    
    tools.connection = testCase.connection;
    tools.log("");
    tools.log("======================================================");
    var d = new Date(); tools.log(d.toJSON());
    tools.log("running: " + testCase.filename);
    tools.log("url: " + testCase.connection.baseurl);
    await tools.ConnectDb(testCase.connection.databaseIntegration, testCase.connection.baseurl, testCase.connection.isMasterDb);
    await validateTestCase(testCase);

    if(!testCase.testCases || testCase.testCases.length <= 0)
    {
      tools.log("Invalid test case, no test cases: " + testCase.filename);
      return;
    }

    if(testCase.testCases.length > 1 || testCase.testCases[0].keyname != "sendemail")
      await shiptech.login(testCase.starturl, testCase.connection.username, testCase.connection.password, testCase.headless);
    else
      await tools.openBrowser();

  
    var shiptechOrder = new ShiptechOrder(tools, shiptech);
    var shiptechDeliveryNew = new ShiptechDeliveryNew(tools, shiptech);
    var shiptechDeliveriesList = new ShiptechInvoicesDeliveriesList(tools, shiptech);  
    var shiptechTreasuryReport = new ShiptechInvoicesTreasuryReport(tools, shiptech);
    var shiptechCompleteView = new ShiptechInvoicesCompleteView(tools, shiptech);
    var shiptechInvoicesList =  new ShiptechInvoicesList(tools, shiptech);
    var shiptechAdditionalCost =  new ShiptechAdditionalCost(tools, shiptech);
    var shiptechAgreementType =  new ShiptechAgreementType(tools, shiptech);
    var shiptechMasterBarge =  new ShiptechMasterBarge(tools, shiptech);
    var shiptechMasterBuyer =  new ShiptechMasterBuyer(tools, shiptech);
    var shiptechMasterCalendar =  new ShiptechMasterCalendar(tools, shiptech);
    var shiptechMasterClaim =  new ShiptechMasterClaim(tools, shiptech);
    var shiptechMasterCompany =  new ShiptechMasterCompany(tools, shiptech);
    var shiptechMasterContactType =  new ShiptechMasterContactType(tools, shiptech);
    var shiptechMasterCounterparty =  new ShiptechMasterCounterparty(tools, shiptech);
    var shiptechMasterCountry =  new ShiptechMasterCountry(tools, shiptech);
    var shiptechMasterCurrency =  new ShiptechMasterCurrency(tools, shiptech);
    var shiptechMasterStrategy =  new ShiptechMasterStrategy(tools, shiptech);
    var shiptechMasterDeliveryOption =  new ShiptechMasterDeliveryOption(tools, shiptech);
    var shiptechMasterDocumentType =  new ShiptechMasterDocumentType(tools, shiptech);
    var shiptechMasterEmailLog = new ShiptechMasterEmailLog(tools, shiptech);
    var shiptechMasterEvent =  new ShiptechMasterEvent(tools, shiptech);
    
    
    
    var shiptechDataGen = new ShiptechTestDataGen(tools, shiptech);

    process.on('unhandledRejection', (reason, p) => {
      console.error(reason, 'Unhandled Rejection in Promise ', p);
    });
    process.on('uncaughtException', async err => {
      console.error(err, 'Uncaught Exception thrown');
      //await this.tools.waitFor(5000);
      //process.exit(1);
    });
    process.on('exit', async (exitCode) => {      
      //await this.tools.waitFor(5000);
      //process.exit(1);
    });

  }
  catch(error)
  {
    if(error.message)
      tools.error(error.message);
    else 
      tools.error(error);

    if(error.stack)
      tools.error(error.stack);

    await this.tools.waitFor(5000);
    process.exit(1);
  }

  if (!testCase.testTitle)
            throw new Error("testTitle missing from the testcase.");

    await shiptechDataGen.generateTestData(testCase.testData, commonTestData);

    for(var i=0; i<testCase.testCases.length; i++)
    {
      try
      {
          var currentTestCase = testCase.testCases[i];
          if (!currentTestCase.hasOwnProperty("keyname"))
            throw new Error("keyname missing from the testcase.");

          tools.log("");
          tools.log("");
          tools.log("___________________________________________");
          tools.log("Starting test #" + (i+1) + " " + currentTestCase["keyname"] + " " + testCase.testTitle);          
          tools.currentTextCase = i;
          tools.currentTextTitle = testCase.testTitle;
          var hasPassed = true;          

          
          
          

          if(currentTestCase.keyname == "newEvent")
          {
            await shiptechMasterEvent.NewEvent(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "editEmailLog")
          {
            await shiptechMasterEmailLog.EditEmailLog(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newDocumentType")
          {
            await shiptechMasterDocumentType.NewDocumentType(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newDeliveryOption")
          {
            await shiptechMasterDeliveryOption.NewDeliveryOption(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newStrategy")
          {
            await shiptechMasterStrategy.NewStrategy(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "sendemail")
          {
              await shiptech.sendEmail();
              currentTestCase.result = true;              
          }
          else if(currentTestCase.keyname == "newCurrency")
          {
              await shiptechMasterCurrency.NewCurrency(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newCountry")
          {
              await shiptechMasterCountry.NewCountry(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newCounterparty")
          {
              await shiptechMasterCounterparty.NewCounterparty(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newContactType")
          {
              await shiptechMasterContactType.NewContactType(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newCompany")
          {
              await shiptechMasterCompany.NewCompany(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newClaim")
          {
              await shiptechMasterClaim.NewClaim(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newCalendar")
          {
              await shiptechMasterCalendar.NewCalendar(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newBuyer")
          {
              await shiptechMasterBuyer.NewBuyer(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newBarge")
          {
              await shiptechMasterBarge.NewBarge(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newAgreementType")
          {
              await shiptechAgreementType.NewAgreementType(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "newAdditionalCost")
          {
              await shiptechAdditionalCost.NewAdditionalCost(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "editAdditionalCost")
          {
              await shiptechAdditionalCost.EditAdditionalCost(currentTestCase, commonTestData);              
          }
          else if(currentTestCase.keyname == "order")
          {
              await shiptechOrder.CreateOrder(currentTestCase, commonTestData);
              orderId = commonTestData[currentTestCase.output.orderId];
          }
          else if(currentTestCase.keyname == "delivery")
          {
              await shiptechDeliveryNew.DeliveryNew(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "invoice")
          {
            if(currentTestCase.action == "provisional" || currentTestCase.action == "final" || currentTestCase.action == "provisionalThenFinal" )
              await shiptechDeliveriesList.InvoiceDeliveriesList(currentTestCase, commonTestData);
            else if(currentTestCase.action == "cancel")
              await shiptechInvoicesList.InvoicesList(currentTestCase, commonTestData);
            else if(currentTestCase.action == "finalAfterProvisional")
              await shiptechInvoicesList.InvoicesList(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "treasury")
          {
              await shiptechTreasuryReport.TreasuryReport(currentTestCase, commonTestData);
          }
          else if(currentTestCase.keyname == "completeView")
              await shiptechCompleteView.CompleteView(currentTestCase, commonTestData);
         

          if(!currentTestCase.result)
            hasPassed = false;
          
          if(hasPassed)
            await tools.createResultsReport(testCase.testTitle, i+1, "PASS", orderId);
          else
          {
            await tools.createResultsReport(testCase.testTitle, i+1, "FAIL", orderId);
            await this.tools.waitFor(5000);
            process.exit(1);
          }
      }
      catch(error)
      {
        if(error.message)
          tools.error(error.message);
        else 
          tools.error(error);
    
        if(error.stack)
          tools.error(error.stack);          

        await tools.createResultsReport(testCase.testTitle, i+1, "FAIL", orderId);

        //await this.tools.waitFor(5000);
        process.exit(1);
      }
    }
    
    await tools.Close(true);
    tools.log(testCase.testTitle + " FINISHED");    
    process.exit(1);
  }



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

        if(!await shiptech.validateDatabaseConfiguration())
          throw new Error("Cannot run automated tests on this configuration. Please change the configuration and try again.");

          if(testCase.testCases.length > 0 && (testCase.testCases[0].keyname != "newAdditionalCost" || testCase.testCases[0].CostType != "Percent"))
            if(!await shiptech.validatePercentCost())
              throw new Error("Cannot run automated tests on this configuration. Please change the configuration and try again.");

        if(!testCase.starturl)
          throw new Error("starturl is missing in current testcase");


          /*
          buyerQuantity visibility, cannot select Bdn Quantity when buyerQuantity is invisible.
            select co.InternalName, showHide.Hidden from admin.TenantConfigurationHiddenFields showHide
          join enums.ConfigurationOptions co on showHide.ConfigurationOptionId = co.Id
          where co.IsDeleted = 0 and showHide.IsDeleted = 0
          */
    }
    

  }














  