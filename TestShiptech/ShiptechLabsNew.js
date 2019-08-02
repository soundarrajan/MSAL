/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechLabsNew {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async LabsNew(testCase, commonTestData)
  {    
    testCase.result = true;

    if(!testCase.input.orderId)
      throw new Error("orderId not defined in input parameters");

    if(!testCase.orderId || testCase.orderId.length <= 0)
      testCase.orderId = commonTestData[testCase.input.orderId];

    if(!testCase.orderId || testCase.orderId.length <= 0)
      throw new Error("OrderId missing from parameters in DeliveryNew().");

    var productName = commonTestData.products[testCase.productId];

    this.tools.log("Loading Labs New");
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
        
    await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Labs');    
    await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/labs/labresult/edit/')\"] > span", 'New lab result');
    var page = await this.tools.getPage("New Labs Result", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes("Labs Entity Edit"))
      throw new Error("Invalid page title '" + labelTitle + "' should have been '" + labelTitle + "'");

    await this.shiptech.selectWithText("#OrderOrderID", testCase.orderId);

    var surveyor = commonTestData.surveyors[testCase.surveyorId];
    await this.shiptech.selectWithText("#SurveyorSurveyor", surveyor);    
    await this.tools.selectFirstOptionBySelector("#LabResultTestTypeTestType");

    var labCounterparty = commonTestData.counterpartiesLab[testCase.counterparty];
    await this.shiptech.selectWithText("#Counterpartycounterparty", labCounterparty);
    await this.tools.selectBySelector("#ProductProduct", productName);

    var company = commonTestData.companies[testCase.companyId];
    await this.shiptech.selectWithText("#CompanyCompany", company);
    await this.tools.setText("#SurveyedHours", testCase.SurveyedHours);
    
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader("Create Lab");

    var labelStatus = await this.tools.getText("span[id='entity-status-2']");
    labelStatus = labelStatus.trim();
    this.tools.log("Lab status is " + labelStatus.trim());   
     
    if(!labelStatus.includes(testCase.StatusAfterSave))
      throw new Error("Lab status is not " + testCase.StatusAfterSave);

    await this.tools.closeCurrentPage();
  
  }




}


module.exports = ShiptechLabsNew;

