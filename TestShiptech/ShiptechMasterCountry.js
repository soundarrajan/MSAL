/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterCounterparty {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewCountry(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchCountry(testCase);

    if(isFound)
    {
      this.tools.log("Country already exists " + testCase.CountryNameNew);
      return;
    }
        
    //insert new country type
    await this.tools.click("#general_action_0");
    await this.AddCountry(testCase);

    isFound = await this.SearchCountry(testCase);

    if(!isFound)
      throw new Error("Country type not found in list: \"" + testCase.CountryNameNew + "\"");

    await this.tools.waitFor(5000);
      
  }




  async SearchCountry(testCase)
  {
    testCase.url = "masters/country";
    testCase.pageTitle = "Country List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/country']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.CountryNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddCountry(testCase)
  {

    await this.tools.getPage("Country", false, true);
    await this.tools.setText("#CountryName", testCase.CountryNameNew);
    await this.tools.setText("#CountryCode", testCase.CountryCode);
    

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#CountryName");
    if(name != testCase.CountryNameNew)
      throw new Error("Cannot save contact type " + testCase.CountryNameNew + " current value: " + name);

    this.tools.log("Contact Type saved " + testCase.CountryNameNew);
  }

}



module.exports = ShiptechMasterCounterparty;



