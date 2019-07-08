/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterSpecGroup {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewSpecGroup(testCase, commonTestData)
  {  
    
    testCase.result = true;
    
    var isFound = await this.SearchInList(testCase, commonTestData);

    if(isFound)
    {
      this.tools.log("SpecGroup already exists " + testCase.SpecGroupName);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase, commonTestData);

    isFound = await this.SearchInList(testCase, commonTestData);

    if(!isFound)
      throw new Error("SpecGroup not found in list: \"" + testCase.SpecGroupName + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/specgroup";
    testCase.pageTitle = "Spec Group List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/specgroup']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.SpecGroupName);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddItem(testCase, commonTestData)
  {    

    var productName = commonTestData.products[testCase.ProductId];
    //first product
    await this.tools.getPage("Spec Group", false, true);    
    await this.tools.setText("#SpecgroupName", testCase.SpecGroupName);
    await this.tools.selectWithText("#ProductProduct", productName);
      
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#SpecgroupName");
    if(name != testCase.SpecGroupName)
      throw new Error("Cannot save service " + testCase.SpecGroupName + " current value: " + name);

    this.tools.log("Spec Group saved " + testCase.SpecGroupName + " for product " + productName);
  }

}



module.exports = ShiptechMasterSpecGroup;



