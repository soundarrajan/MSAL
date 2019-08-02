/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechContract {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async ContractList(testCase)
  {    
    console.log("Loading Contract List");    
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    console.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
    
    console.log("Procurement");
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Contract');
    console.log("Contract List");
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Contract list');
    var page = await this.tools.getPage("Contract List", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    console.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Contract List"))
      console.log("SUCCES!");
    else
      console.log("FAIL!");

    //await browser.close()
  
  }



  

  async ContractNew(testCase, commonTestData)
  {   
    var seller; 
    var product;
    var port;

    testCase.result = true;
    console.log("Loading New Contract");    
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    console.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
    
    console.log("Procurement");
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Contract');
    console.log("New Contract");
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'New contract');
    var page = await this.tools.getPage("New Contract", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    console.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Contracts :: Edit"))
      console.log("SUCCES!");
    else
      console.log("FAIL!");

    if (testCase.sellerId) {
      seller = commonTestData.sellers[testCase.sellerId];
      if (!seller)
          throw new Error("Cannot generate Seller");
    }

    if (testCase.productId) {
      product = commonTestData.products[testCase.productId];
      if (!product)
          throw new Error("Cannot generate product");
    }

    if (testCase.portId) {
      port = commonTestData.ports[testCase.portId];
      if (!port)
          throw new Error("Cannot generate port");
    }

    if (testCase.StartDate)
     testCase.StartDate = await this.shiptech.getFutureDate(testCase.StartDate, false);

    if (testCase.EndDate)
      testCase.EndDate = await this.shiptech.getFutureDate(testCase.EndDate, false);
    
    await this.tools.setText("#name", testCase.name);
    await this.shiptech.selectWithText("input[name=\"Seller\"]", seller);
    await this.tools.selectBySelector("#AgreementTypeAgreementType", testCase.AgreementType);
    await this.tools.setText("#StartDate_dateinput", testCase.StartDate);
    await this.tools.setText("#EndDate_dateinput", testCase.EndDate);
    await this.tools.selectFirstOptionBySelector("#CompanyCompany");
    await this.tools.selectFirstOptionBySelector("#primaryContact");
    await this.tools.click("span[ng-click=\"CC.addProductToContract()\"]");
    await this.shiptech.selectWithText("#Product_1_Main_Product", product);
    await this.shiptech.selectWithText("#Product_1_Location", port);
    await this.tools.setText("#grid_contractualQuantity_Min_0", testCase.min);
    await this.tools.setText("#grid_contractualQuantity_Max_0", testCase.max);
    await this.tools.setText("input[name=\"Product_1_Price\"]", testCase.price);
    await this.tools.setText("input[name=\"Product_1_MTM_Price\"]", testCase.mtmprice);
    
    await this.tools.click("#header_action_save");
    var labelStatus = await this.tools.getText("span[id='entity-status-1']");
    labelStatus = labelStatus.replace(/[^0-9a-zA-Z]/gi, '');
    labelStatus = labelStatus.trim();
    if(labelStatus != testCase.StatusAfterSave)
      throw new Error("Invalid contract status after save " + labelStatus + " expected: " + testCase.StatusAfterSave);


    await this.tools.click("#header_action_confirm");
    var labelStatus = await this.tools.getText("span[id='entity-status-1']");
    labelStatus = labelStatus.replace(/[^0-9a-zA-Z]/gi, '');
    labelStatus = labelStatus.trim();
    if(labelStatus != testCase.StatusAfterConfirm)
      throw new Error("Invalid contract status after confirm " + labelStatus + " expected: " + testCase.StatusAfterConfirm);
  
    await this.tools.closeCurrentPage();
  }
}


module.exports = ShiptechContract;

