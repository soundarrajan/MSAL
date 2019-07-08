/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechAdditionalCost {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewAdditionalCost(testCase)
  {  
    testCase.result = true;
    var isFound = await this.SearchAdditionalCost(testCase);
    
    if(isFound)
    {
      this.tools.log("Additional Cost already exists " + testCase.AdditioalCostNameNew);
      return;
    }
    
    //insert new additional cost
    await this.tools.click("#general_action_0");    
    await this.ChangeAdditionalCost(testCase);

    isFound = await this.SearchAdditionalCost(testCase);
    
    if(!isFound)
      throw new Error("Additional Cost not found in list " + testCase.AdditioalCostNameNew);    

    await this.tools.waitFor(5000);

    if(testCase.RemoveAfterSave)
    {
      await this.tools.executeSql("delete from [" + this.tools.databaseName + "].[master].[AdditionalCosts] where name = '" + testCase.AdditioalCostNameNew  + "'");
      await this.tools.waitFor(1000);
    }
    
  }




  async SearchAdditionalCost(testCase)
  {
    testCase.url = "masters/additionalcost";
    testCase.pageTitle = "Master View";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);

    var labelTitle = await this.tools.getText("a[href='#/masters/additionalcost']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes("Additional Cost List"))
      this.tools.log("FAIL!");

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.AdditioalCostNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();

    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }




  async EditAdditionalCost(testCase)
  {  
    testCase.url = "masters/additionalcost";
    testCase.pageTitle = "Master View";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);

    var labelTitle = await this.tools.getText("a[href='#/masters/additionalcost']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes("Additional Cost List"))
      this.tools.log("FAIL!");

    await this.SearchAdditionalCost(testCase.AdditioalCostNameOld);

    if(await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit'))
      await this.tools.clickOnItemByText("span[title='Edit']", 'Edit');
    else
      {
        this.tools.log("Additional Cost not found " + testCase.AdditioalCostNameOld);
        return; 
      }

    await this.ChangeAdditionalCost(testCase);

    await this.tools.waitFor(5000);
  }



  async InsertNewAdditionalCost(testCase)
  {
    await this.tools.click("#general_action_0");    
    await this.ChangeAdditionalCost(testCase);
  }



  async ChangeAdditionalCost(testCase)
  {
    await this.tools.getPage("Additional Cost", false, true);
    await this.tools.setText("#AdditionalcostName", testCase.AdditioalCostNameNew);
    await this.tools.selectBySelector("#CostTypeCostType", testCase.CostType);
    await this.tools.selectBySelector("#ComponentTypeComponentType", testCase.ComponentType);
    await await this.tools.click("#header_action_savechanges");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#AdditionalcostName");
    if(name != testCase.AdditioalCostNameNew)
      throw new Error("Cannot save Additional cost " + testCase.AdditioalCostNameNew + " current value: " + name);

      this.tools.log("Additional cost saved " + testCase.AdditioalCostNameNew);

    this.tools.log("SUCCES!");
  }


}


module.exports = ShiptechAdditionalCost;



