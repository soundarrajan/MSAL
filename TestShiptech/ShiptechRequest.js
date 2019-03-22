
/**
 * @name create-request
 * @desc Create a request  
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechRequest {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }



  async CreateRequest(testCase)
  {
        
        var autoTestCase = 
        {
          vesselName: await this.shiptech.getRandomVessel(),
          bunkerablePort: await this.shiptech.getRandomPort(),
          destinationPort: await this.shiptech.getRandomPort(),
          company: await this.shiptech.getRandomCompany(),
        }
                   
        if(await this.shiptech.validateDate(testCase.eta) != true)
        {
          var dateFormat = await this.shiptech.getDateFormat();
          throw "Invalid date format " + testCase.eta + " valid format: " + dateFormat; 
        }
       
        
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
              
        await this.shiptech.selectFromSelect("input[name='Vessel']", autoTestCase.vesselName);
        await this.shiptech.selectFromSelect("input[name='ports']", autoTestCase.bunkerablePort, false);
        await this.shiptech.selectFromSelect("input[name='DestinationPort0']", autoTestCase.destinationPort, false);

        if(await this.tools.page.waitFor("input[name='Location 1 Company']"))
          await this.shiptech.selectFromSelect("input[name='Location 1 Company']", autoTestCase.company);
        
        await this.tools.setText('input[id="0_eta_dateinput"]', testCase.eta);
        await this.tools.setText('input[name="MinQuantity_0"]', testCase.MinQuantity_0);            
        await this.tools.waitForLoader();
        await this.tools.page.waitFor(800);
        await this.shiptech.selectFromSelect("input[name='Product']", testCase.product, false);
  
        var countbuttons = 0;
  
        //ensure there is only one product
        do{
          var countbuttons = await this.tools.countElements('a', 'deleteProductFromLocation', "attr", 'ng-click');
          //delete the second product
          if(countbuttons > 1)
            result = await this.tools.clickOnItemByAttr('a', 'deleteProductFromLocation', 'ng-click', 1);
        }while(countbuttons > 1);
  
        result = await this.tools.clickOnItemByText('a.btn', 'Save');      
        await this.tools.waitForLoader("Save Request");
        result = await this.tools.clickOnItemByText('a.btn', '…'); 
        result = await this.tools.clickOnItemByAttr('a', 'validatePreRequest', 'ng-click');
        await this.tools.waitForLoader("Validate Request");

        var labelStatus = await this.tools.getText("span[ng-if='state.params.status.name']");
        this.tools.log("Request status is " + labelStatus);
        if(labelStatus.includes("Validated"))
          this.tools.log("SUCCES!");
        else
          this.tools.log("FAIL!");

        await this.tools.closeCurrentPage();
        return testCase;
  
  }


}


module.exports = ShiptechRequest;