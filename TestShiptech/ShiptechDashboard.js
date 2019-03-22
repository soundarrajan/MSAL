/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechDashboard {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }




  async TestDashboard(testCase)
  {           
    
    var answer = {    
      testSatus: 0,
      testName: "TestDashboard"
    }
    
    const element = await this.tools.page.$('a[href="#/schedule-dashboard-table"]');
    await element.click();
    await this.tools.waitForLoader("Dashboard");

    var labelTitle = await this.tools.getText("p[class='navbar-text ng-binding']");
    this.tools.log("Current screen is " + labelTitle);
    if(labelTitle.includes("Schedule Dashboard"))
      this.tools.log("SUCCES!");
    else
      this.tools.log("FAIL!");

    return answer;
  
  }


}


module.exports = ShiptechDashboard;

