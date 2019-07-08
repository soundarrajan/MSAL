
/**
 * @name create-request
 * @desc Create a request  
 */


const puppeteer = require('puppeteer');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechRequest {


  constructor(tools, shiptech) {
    this.tools = tools;    
    this.shiptech = shiptech;
  }



  async CreateRequest(testCase, commonTestData)
  {
        testCase.result = true;
        var vesselName;
        var bunkerablePort;
        var destinationPort;
        var company;
        var product;
        var serviceCode;
        var url = "new-request";
        
        testCase.eta = await this.shiptech.getFutureDate(testCase.eta, true);

        if (testCase.VesselId) {
          vesselName = commonTestData.vessels[testCase.VesselId];
          if (!vesselName)
              throw new Error("Cannot generate Vessel");
        }

      if (testCase.BunkerablePortId) {
        bunkerablePort = commonTestData.ports[testCase.BunkerablePortId];
        if (!bunkerablePort)
            throw new Error("Cannot generate bunkerablePort");
      }

      if (testCase.DestinationPortId) {
        destinationPort = commonTestData.ports[testCase.DestinationPortId];
      if (!destinationPort)
          throw new Error("Cannot generate destinationPortId");
      }

      if (testCase.CompanyId) {
        company = commonTestData.companies[testCase.CompanyId];
      if (!company)
          throw new Error("Cannot generate company");
      }

      if (testCase.ProductId) {
        product = commonTestData.products[testCase.ProductId];
      if (!product)
          throw new Error("Cannot generate product");
      }

      if (testCase.ServiceCodeId) {
        serviceCode = commonTestData.serviceCodes[testCase.ServiceCodeId];
      if (!serviceCode)
          throw new Error("Cannot generate service code");
      }

                   
        if(await this.shiptech.validateDate(testCase.eta) != true)
        {
          var dateFormat = await this.shiptech.getDateFormat();
          throw  new Error("Invalid date format " + testCase.eta + " valid format: " + dateFormat); 
        }

        var pageTitle = await this.tools.page.title();
        if(pageTitle != "New Request")
        {      
          var page = await this.tools.getPage("New Request", false, false);
          if(!page)
            page = this.tools.openPageRelative(url);

          /*//navigate using the menu
            await this.tools.waitForLoader();
            await this.tools.click('div.menu-toggler.sidebar-toggler');
            this.tools.log("Open side menu");  
            await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
            this.tools.log("Procurement");
            var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Procurement');
            this.tools.log("Request");
            result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Request');
            this.tools.log("New Request");
            result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'New Request');
            var page = await this.tools.getPage("New Request", true);
            this.shiptech.page = page;
          //*/

          this.shiptech.page = page;
        }
             
        pageTitle = await this.tools.page.title();
        if(pageTitle != "New Request")
          throw new Error("Incorrect page name:" + pageTitle);
                      
        await this.shiptech.selectWithText("input[name='Vessel']", vesselName);
        await this.shiptech.selectWithText("input[name='ports']", bunkerablePort, false);
        await this.shiptech.selectWithText("input[name='DestinationPort0']", destinationPort, false);        
        await this.shiptech.selectWithText("#id_Company", company);
        await this.shiptech.selectWithText("#id_ServiceCode", serviceCode);
        
        
        await this.tools.setText('input[id="0_eta_dateinput"]', testCase.eta);
        await this.tools.setText('input[name="MinQuantity_0"]', testCase.MinQuantity_0);            
        await this.tools.waitForLoader();
        await this.tools.page.waitFor(800);
        await this.shiptech.selectWithText("input[name='Product']", testCase.product, false);

        await this.tools.setText('input[id="id_delivery_from-0_dateinput"]', testCase.eta, 0, false, true);
        await this.tools.setText('input[id="id_delivery_to-0_dateinput"]', testCase.eta, 0, false, true);
  
        var countbuttons = 0;
  
        //ensure there is only one product
        do{
          var countbuttons = await this.tools.countElements('a', 'deleteProductFromLocation', "attr", 'ng-click');
          //delete the second product
          if(countbuttons > 1)
            await this.tools.clickOnItemByAttr('a', 'deleteProductFromLocation', 'ng-click', 1);
        }while(countbuttons > 1);
  
        await this.tools.click("a[ng-click=\"$ctrl.saveRequest()\"]");
        await this.tools.waitForLoader("Save Request");
        var labelStatus = await this.tools.getText("span[ng-if='state.params.status.name']");
        labelStatus = labelStatus.trim();

        if(labelStatus != "Validated" && testCase.Validate)
        {
          await this.tools.clickOnItemByText('a.btn', '…'); 
          await this.tools.clickOnItemByAttr('a', 'validatePreRequest', 'ng-click');
          await this.tools.waitForLoader("Validate Request");
          labelStatus = await this.tools.getText("span[ng-if='state.params.status.name']");
        }

        this.tools.log("Request status is " + labelStatus);

        if(testCase.Validate)
        {
          if(labelStatus.includes("Validated"))
            this.tools.log("SUCCES!");
          else
            this.tools.log("FAIL!");
        }

        await this.tools.closeCurrentPage();
        
  
  }


}


module.exports = ShiptechRequest;