/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechDeliveryOrders {


  constructor(tools, shiptech, db) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
  }




  async DeliveryOrders(testCase)
  {    
    var answer = {    
      testSatus: 0,
      testName: "DeliveryOrders"
    }

    this.tools.log("Loading Orders to be delivered");
    await this.tools.waitForLoader();
    await this.tools.click('div.menu-toggler.sidebar-toggler');
    this.tools.log("Open side menu");  
    await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');  
    
    this.tools.log("Delivery");
    var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Delivery');
    this.tools.log("Orders Delivery List");
    result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'Orders to be delivered');
    var page = await this.tools.getPage("Orders Delivery List", true);
    this.shiptech.page = page;

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    this.tools.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Orders Delivery List"))
      this.tools.log("SUCCES!");
    else
      this.tools.log("FAIL!");

    await this.tools.closeCurrentPage();
    return answer;
  
  }




}


module.exports = ShiptechDeliveryOrders;

