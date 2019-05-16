/**
 * @name main test entry point
 */


const TestTools24 = require('./TestTools24.js');
const Db = require('./MsSqlConnector.js');
const ShiptechRequest = require('./ShiptechRequest.js');
const ShiptechOrder = require('./ShiptechOrder.js');
const ShiptechTools = require('./ShiptechTools.js');
const ShiptechDashboard = require('./ShiptechDashboard.js');
const ShiptechContractPlanning = require('./ShiptechContractPlanning.js');
const ShiptechContract = require('./ShiptechContract.js');
const ShiptechDeliveryList = require('./ShiptechDeliveryList.js');
const ShiptechDeliveryNew = require('./ShiptechDeliveryNew.js');
const ShiptechDeliveryOrders = require('./ShiptechDeliveryOrders.js');
const ShiptechDeliveryToVerify = require('./ShiptechDeliveryToVerify.js');
const ShiptechLabsList = require('./ShiptechLabsList.js');
const ShiptechLabsNew = require('./ShiptechLabsNew.js');
const ShiptechClaimsList = require('./ShiptechClaimsList.js');
const ShiptechClaimsNew = require('./ShiptechClaimsNew.js');
const ShiptechInvoicesClaimsList = require('./ShiptechInvoicesClaimsList.js');
const ShiptechInvoicesCompleteView = require('./ShiptechInvoicesCompleteView.js');
const ShiptechInvoicesDeliveriesList = require('./ShiptechInvoicesDeliveriesList.js');
const ShiptechInvoicesList = require('./ShiptechInvoicesList.js');
const ShiptechInvoicesTreasuryReport = require('./ShiptechInvoicesTreasuryReport.js');
const ShiptechReconList = require('./ShiptechReconList.js');
const ShiptechAdminAlerts = require('./ShiptechAdminAlerts.js');
const ShiptechAdminConfiguration = require('./ShiptechAdminConfiguration.js');
const ShiptechAdminRolesList = require('./ShiptechAdminRolesList.js');
const ShiptechAdminNewRole = require('./ShiptechAdminNewRole.js');
const ShiptechAdminSellerRating = require('./ShiptechAdminSellerRating.js');
const ShiptechAdminUsersList = require('./ShiptechAdminUsersList.js');
const ShiptechAdminNewUser = require('./ShiptechAdminNewUser.js');


//const ShiptechBackend = require('./ShiptechBackend.js');

//*
var url = 'http://mail.24software.ro:8161/#/';
var databaseIntegration = {
                            server: '10.1.1.9', 
                            database: 'IntegrationShiptech10PrimeDbCRP2',
                            user: 'sa',
                            password: '!QAZ2wsx'
                          };
var username = 'superuser@twentyfoursoftwareoutlook.onmicrosoft.com';
var password = 'MyDocuments71%';
/*/


var url = 'https://stgcma.shiptech.com/#/';
var databaseIntegration = {
                            server: 'frc-sh-stg-db-01.database.windows.net',
                            user: 'supportuser',
                            password: 'Inatech@123',
                            port: 14330,
                            database: 'Shiptech-TNT-CMASTG',
                            options: {
                              port: 14330,
                              encrypt: true,                               
 
                           }
                          };
var username = '24software.ext@inatech.com';
var password = '24ext@123';
//*/

var tools = new TestTools24();
var shiptech = new ShiptechTools(tools);

(async () => {  

  try
  {

    var testCase = tools.ReadTestCase();    
    tools.baseUrl = testCase.connection.baseurl;
    tools.log("url: " + testCase.connection.baseurl);
    await shiptech.ConnectDb(testCase.connection.databaseIntegration, testCase.connection.baseurl, testCase.connection.isMasterDb);  
    await shiptech.login(testCase.starturl, testCase.connection.username, testCase.connection.password, testCase.headless);
  
    console.log("Open the dashboard");
    await tools.waitForLoader(true);

    await testDashboard(tools, shiptech);    
    await testCreateRequest(tools, shiptech);    
    /*
    var answerOrder = await testCreateOrder(tools, shiptech);
    await testContractPlanning(tools, shiptech);
    await testContractList(tools, shiptech);
    await testNewContract(tools, shiptech);
    await testDeliveryOrders(tools, shiptech);
    await testDeliveryNew(tools, shiptech, answerOrder);
    await testDeliveryList(tools, shiptech);
    await testDeliveryToVerify(tools, shiptech);
    await testLabsList(tools, shiptech);
    await testLabsNew(tools, shiptech);
    await testClaimsList(tools, shiptech);
    await testClaimsNew(tools, shiptech);
    await testInvoicesClaimsList(tools, shiptech);
    await testInvoicesCompleteView(tools, shiptech);
    await testInvoicesDeliveriesList(tools, shiptech);
    await testInvoicesList(tools, shiptech);
    await testInvoicesTreasuryReport(tools, shiptech);
    await testReconList(tools, shiptech);
    await testAdminUsersList(tools, shiptech);
    await testAdminNewUser(tools, shiptech);
    await testAdminRolesList(tools, shiptech);   
    await testAdminNewRole(tools, shiptech);
    await testAdminConfiguration(tools, shiptech);
    await testAdminSellerRating(tools, shiptech);
    await testAdminAlerts(tools, shiptech);
    */
    //await testBackend();

    tools.Close(true);
    process.exit(1);
  }
  catch(error)
  {
    if(error.message)
      console.error(error.message);
    else 
      console.error(error);

    if(error.stack)
      console.error(error.stack);
    
    process.exit(1);
  }



  })();





  async function testBackend()
  {
  
    var testCase = {       
      eta: tools.getFutureDate(2, true, "dd/MM/yyyy"),      
      products: [
        {
          name: "RMG 500 3.5%",
          quantity: 1500,
          unitPrice: 100
        },
        {
          name: "DMA 0.1%",
          quantity: 400,
          unitPrice: 200
        },

      ]
    }

    var shiptechBackend = new ShiptechBackend(tools);
    await shiptechBackend.CreateOrder(testCase);


  }






  

  async function testCreateOrder(tools, shiptech)
  {
  
    var testCase = {      
      eta: tools.getFutureDate(2, true, "dd/MM/yyyy"),      
      products: [
        {
          name: "RMG 500 3.5%",
          quantity: 1500,
          unitPrice: 100
        },
        {
          name: "DMA 0.1%",
          quantity: 400,
          unitPrice: 200
        },

      ]
    }

    var shiptechOrder = new ShiptechOrder(tools, shiptech);
    return await shiptechOrder.CreateOrder(testCase);
  }




  

  async function testDashboard(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechDashboard = new ShiptechDashboard(tools, shiptech);
    await shiptechDashboard.TestDashboard(testCase);

  }



  

  async function testContractPlanning(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechContractPlanning = new ShiptechContractPlanning(tools, shiptech);
    await shiptechContractPlanning.ContractPlanning(testCase);

  }





  async function testContractList(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechContract = new ShiptechContract(tools, shiptech);
    await shiptechContract.ContractList(testCase);

  }




  
  async function testNewContract(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechContract = new ShiptechContract(tools, shiptech);
    await shiptechContract.ContractNew(testCase);
  }

 

  
  async function testDeliveryOrders(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechDeliveryOrders = new ShiptechDeliveryOrders(tools, shiptech);
    await shiptechDeliveryOrders.DeliveryOrders(testCase);
  }


  
  async function testDeliveryNew(tools, shiptech, order)
  {
  
    var testCase = {
      orderId: order.orderId,
      bdnDate: tools.getFutureDate(1, true, "dd/MM/yyyy"),
      products: order.products
    }

    var shiptechDeliveryNew = new ShiptechDeliveryNew(tools, shiptech);
    await shiptechDeliveryNew.DeliveryNew(testCase);
  }


  
  async function testDeliveryList(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechDeliveryList = new ShiptechDeliveryList(tools, shiptech);
    await shiptechDeliveryList.DeliveryList(testCase);
  }


  
  async function testDeliveryToVerify(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechDeliveryToVerify = new ShiptechDeliveryToVerify(tools, shiptech);
    await shiptechDeliveryToVerify.DeliveryToVerify(testCase);
  }


  async function testLabsList(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechLabsList = new ShiptechLabsList(tools, shiptech);
    await shiptechLabsList.LabsList(testCase);
  }


  async function testLabsNew(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechLabsNew = new ShiptechLabsNew(tools, shiptech);
    await shiptechLabsNew.LabsNew(testCase);
  }




  async function testClaimsList(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechClaimsList = new ShiptechClaimsList(tools, shiptech);
    await shiptechClaimsList.ClaimsList(testCase);
  }




  async function testClaimsNew(tools, shiptech)
  {
  
    var testCase = {      
    }

    var shiptechClaimsNew = new ShiptechClaimsNew(tools, shiptech);
    await shiptechClaimsNew.ClaimsNew(testCase);
  }




  async function testInvoicesClaimsList(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechClaimsList = new ShiptechInvoicesClaimsList(tools, shiptech);
    await shiptechClaimsList.ClaimsList(testCase);
  }



  async function testInvoicesCompleteView(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechCompleteView = new ShiptechInvoicesCompleteView(tools, shiptech);
    await shiptechCompleteView.CompleteView(testCase);
  }



  async function testInvoicesDeliveriesList(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechDeliveriesList = new ShiptechInvoicesDeliveriesList(tools, shiptech);
    await shiptechDeliveriesList.InvoiceDeliveriesList(testCase);
  }



  async function testInvoicesList(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechInvoiceList = new ShiptechInvoicesList(tools, shiptech);
    await shiptechInvoiceList.InvoicesList(testCase);
  }



  async function testInvoicesTreasuryReport(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechTreasuryReport = new ShiptechInvoicesTreasuryReport(tools, shiptech);
    await shiptechTreasuryReport.TreasuryReport(testCase);
  }




  
  async function testReconList(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechReconList = new ShiptechReconList(tools, shiptech);
    await shiptechReconList.ReconList(testCase);
  }



  
  async function testAdminUsersList(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechAdminUsersList = new ShiptechAdminUsersList(tools, shiptech);
    await shiptechAdminUsersList.UsersList(testCase);
  }



  
  async function testAdminNewUser(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechAdminNewUser = new ShiptechAdminNewUser(tools, shiptech);
    await shiptechAdminNewUser.NewUser(testCase);
  }

  
  
  async function testAdminRolesList(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechAdminRolesList = new ShiptechAdminRolesList(tools, shiptech);
    await shiptechAdminRolesList.RolesList(testCase);
  }




  
  async function testAdminNewRole(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechAdminNewRole = new ShiptechAdminNewRole(tools, shiptech);
    await shiptechAdminNewRole.NewRole(testCase);
  }



  
  
  async function testAdminConfiguration(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechAdminConfiguration = new ShiptechAdminConfiguration(tools, shiptech);
    await shiptechAdminConfiguration.AdminConfiguration(testCase);
  }


  
  
  async function testAdminSellerRating(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechAdminSellerRating = new ShiptechAdminSellerRating(tools, shiptech);
    await shiptechAdminSellerRating.SellerRating(testCase);
  }


  
  
  async function testAdminAlerts(tools, shiptech)
  {
    var testCase = {      
    }

    var shiptechAdminAlerts = new ShiptechAdminAlerts(tools, shiptech);
    await shiptechAdminAlerts.AdminAlerts(testCase);
  }

   
  



  async function testCreateRequest(tools, shiptech)
  {
      
  
      var testCase = {             
        eta: tools.getFutureDate(2, true, "dd/MM/yyyy"),
        MinQuantity_0: "100",
        product: "DMA 0.1%"
      }

    var shiptechRequest = new ShiptechRequest(tools, shiptech);
    await shiptechRequest.CreateRequest(testCase);


  }


