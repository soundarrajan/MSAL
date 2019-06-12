/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterStrategy {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewStrategy(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchStrategy(testCase);

    if(isFound)
    {
      this.tools.log("Strategy already exists " + testCase.StrategyNameNew);
      return;
    }
        
    //insert new country type
    await this.tools.click("#general_action_0");
    await this.AddStrategy(testCase);

    isFound = await this.SearchStrategy(testCase);

    if(!isFound)
      throw new Error("Strategy not found in list: \"" + testCase.StrategyNameNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchStrategy(testCase)
  {
    testCase.url = "masters/strategy";
    testCase.pageTitle = "Strategy List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/strategy']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.StrategyNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddStrategy(testCase)
  {

    await this.tools.getPage("Strategy", false, true);
    
    await this.tools.setText("#Strategy", testCase.StrategyNameNew);

    //Select Parent Strategy
    await this.tools.click("span[id='lookup-search-parent']");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");    

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#Strategy");
    if(name != testCase.StrategyNameNew)
      throw new Error("Cannot save strategy " + testCase.StrategyNameNew + " current value: " + name);

    this.tools.log("Strategy saved " + testCase.StrategyNameNew);
  }

}



module.exports = ShiptechMasterStrategy;



