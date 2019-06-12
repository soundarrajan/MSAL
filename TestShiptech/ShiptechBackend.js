/**
 * @name create-order
 * @desc Create an order
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechBackend {


  constructor() {    

  
  }



  async CreateOrder(testCase)
  {   
  
    
        var tools = new TestTools24();
        var shiptech = new ShiptechTools(tools);

        var autoTestCase = 
        {
          vesselName: await shiptech.getRandomVessel(),
          carrier: await shiptech.getRandomCompany(),
          port: await  shiptech.getRandomPort(),
          seller: await shiptech.getRandomSeller(),  
          paymentCompany: await shiptech.getRandomCompany(),        
        }  
                        
        this.tools.log("Choose vessel: " + autoTestCase.vesselName);
  
        //var page = await shiptech.login(testCase.url, testCase.username, testCase.password);
        //await browser.close()
  
  }


}


module.exports = ShiptechBackend;

