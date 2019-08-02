/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechClaimsNew {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async ClaimsNew(testCase, commonTestData)
  {    

    testCase.result = true;
    this.tools.log("Loading Claims New");
    
    if(!testCase.input.orderId)
      throw new Error("orderId not defined in input parameters");

    if(!testCase.orderId || testCase.orderId.length <= 0)
      testCase.orderId = commonTestData[testCase.input.orderId];

    if(!testCase.orderId || testCase.orderId.length <= 0)
      throw new Error("OrderId missing from parameters in DeliveryNew().");

      testCase.settlementDate = await this.shiptech.getFutureDate(testCase.settlementDate, true);
    
    var productName = commonTestData.products[testCase.productId];
    
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
        
    await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Labs');    
    await this.tools.clickOnItemByText("li.nav-item > a.nav-link[ng-click=\"openInNewTab('url','/claims/claim/edit/')\"] > span", 'New claim');
    var page = await this.tools.getPage("Claims", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes("Claims"))
      throw new Error("Incorrect screen label");
    
    await this.shiptech.selectWithText("#OrderOrderID", testCase.orderId);    
    await this.tools.selectBySelector("#productProduct", productName);
    await this.tools.setText("#EstimatedSettlementAmountCurrency", testCase.estimatedSettlementAmount);
    await this.tools.selectBySelector("#ClaimTypeClaimType", testCase.claimType);    
    if(testCase.claimSubType)
    {
        await this.tools.selectBySelector("#quantity_Parameter", testCase.claimSubType);
        await this.tools.click("a[ng-click=\"addClaimData('$scope.formValues.quantitySubtypes', quantity_Parameter, 'quantitySubtypes');\"");
    }

    await this.tools.setText("#SettlementDate_dateinput", testCase.settlementDate);
    await this.tools.setText("#ActualSettlementAmountCurrency", testCase.actualSettlementAmount);

    //save claim
    await this.tools.click("a[id=\"header_action_save\"");
    await this.tools.waitFor(3000);

    var labelStatus = await this.tools.getText("span[id='entity-status-1']");
    labelStatus = labelStatus.trim();
    this.tools.log("Claim status is " + labelStatus.trim());   
     
    if(!labelStatus.includes(testCase.StatusAfterSave))
      throw new Error("Claim status is not " + testCase.StatusAfterSave);
    
    if(testCase.StatusAfterComplete)
    {
      await this.tools.click("a[id=\"header_action_complete\"");
      await this.tools.waitFor(3000);

      labelStatus = await this.tools.getText("span[id='entity-status-1']");
      labelStatus = labelStatus.trim();
      this.tools.log("Claim status is " + labelStatus.trim());   
       
      if(!labelStatus.includes(testCase.StatusAfterComplete))
        throw new Error("Claim status is not " + testCase.StatusAfterComplete);
    }
    

    var isFound = await this.SearchInList(testCase, commonTestData);

    if(!isFound)
      throw new Error("Claim not found in list: orderId: \"" + testCase.orderId + "\"");

    await this.tools.closeCurrentPage();
  }



  

  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "claims/claim";
    testCase.pageTitle = "Claims List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);

    await this.tools.waitFor(3000);      
    await this.tools.getPage(testCase.pageTitle, true, false);
    
    await this.tools.clickOnItemWait("a[data-sortcol='ordername']");
    await this.tools.setText("#filter0_Text", testCase.orderId);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }



}


module.exports = ShiptechClaimsNew;

