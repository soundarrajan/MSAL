/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterSpecParameters {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewSpecParameter(testCase, commonTestData)
  {  
    
    testCase.result = true;
    
    var isFound = await this.SearchInList(testCase, commonTestData);

    if(isFound)
    {
      this.tools.log("SpecParameter already exists " + testCase.SpecParameterName);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase, commonTestData);

    isFound = await this.SearchInList(testCase, commonTestData);

    if(!isFound)
      throw new Error("SpecParameter not found in list: \"" + testCase.SpecParameterName + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/specparameter";
    testCase.pageTitle = "Spec Parameter List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/specparameter']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.SpecParameterName);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddItem(testCase, commonTestData)
  {
    var claimType = "";

    if(testCase.ClaimTypeId)
    {
      var claimType = commonTestData.claimTypes[testCase.ClaimTypeId];
      if(!claimType)
        throw new Error("Cannot generate ClaimType");
    }
    
    await this.tools.getPage("Spec Parameter", false, true);
    await this.tools.setText("#Specparameter", testCase.SpecParameterName);
    await this.shiptech.selectWithText("#claimTypes", claimType);
    await this.tools.click("a[ng-click=\"addTagToMulti(field.Unique_ID, dummyModel)\"]");    
    
    await this.tools.selectBySelector("#EnergyParameterTypeenergyParameterType", testCase.ParameterType);

    if(testCase.ExpressedAs == "Actual Value")
    {
      await this.tools.click("#inlineRadio0");
    }
    else
    {
      await this.tools.click("#inlineRadio1");
    }

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#Specparameter");
    if(name != testCase.SpecParameterName)
      throw new Error("Cannot save service " + testCase.SpecParameterName + " current value: " + name);

    this.tools.log("Spec Group saved " + testCase.SpecParameterName);
  }



}



module.exports = ShiptechMasterSpecParameters;



