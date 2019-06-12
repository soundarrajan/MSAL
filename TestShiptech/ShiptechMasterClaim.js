/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterClaim {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  //bug 14719
  async NewClaim(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchClaim(testCase);

    if(isFound)
    {
      this.tools.log("Claim already exists " + testCase.ClaimNameNew);
      return;
    }
    
    if(await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit'))
    {
      this.tools.log("Claim already exists " + testCase.ClaimNameNew);
      return;
    }
    
    //insert new claim
    await this.tools.click("#general_action_0");
    await this.AddClaim(testCase);

    isFound = await this.SearchClaim(testCase);

    if(!isFound)
      throw new Error("Claim not found in claim list: \"" + testCase.ClaimNameNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchClaim(testCase)
  {
    testCase.url = "masters/claimtype";
    testCase.pageTitle = "Claim Type List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/claimtype']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='displayname']");
    await this.tools.setText("#filter0_Text", testCase.ClaimNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddClaim(testCase)
  {     

    await this.tools.getPage("Claim Type", false, true);
    await this.tools.setText("#CaimTypeName", testCase.ClaimNameNew);
    
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();
    await this.tools.waitFor(50000);

    var name = await this.tools.getTextValue("#CaimTypeName");
    if(name != testCase.ClaimNameNew)
      throw new Error("Cannot save Claim " + testCase.ClaimNameNew + " current value: " + name);

    this.tools.log("Claim saved " + testCase.ClaimNameNew);

    this.tools.log("SUCCES!");
  }

}



module.exports = ShiptechMasterClaim;



