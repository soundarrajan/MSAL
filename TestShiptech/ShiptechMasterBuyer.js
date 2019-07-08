/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterBuyer {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewBuyer(testCase)
  {  

    testCase.result = true;
    var isFound = await this.SearchBuyer(testCase);
    
    if(isFound)
    {
      this.tools.log("Buyer already exists " + testCase.BuyerNameNew);
      return;
    }
    
    //insert new buyer
    await this.tools.click("#general_action_0");
    await this.AddBuyer(testCase);

    isFound = await this.SearchBuyer(testCase);
    
    if(!isFound)
      throw new Error("Buyer not found in list " + testCase.BuyerNameNew);

    await this.tools.waitFor(5000);

    
    if(testCase.RemoveAfterSave)
    {
      var result = await this.tools.querySql("select id from [" + this.tools.databaseName + "].[master].[buyers] where name = '" + testCase.BuyerNameNew  + "'");
      if(result.length <= 0)
        return;
      var buyerId = result[0].id;
      if(!buyerId)
        return;
      this.tools.log("Removing buyer " + testCase.BuyerNameNew + " id=" + buyerId);
      await this.tools.executeSql("delete from [" + this.tools.databaseName + "].[admin].[UserBuyers] where BuyerId = '" + buyerId  + "'");
      await this.tools.executeSql("delete from [" + this.tools.databaseName + "].[master].[BuyerTransactionLimits] where BuyerId = '" + buyerId  + "'");
      await this.tools.executeSql("delete from [" + this.tools.databaseName + "].[master].[buyers] where name = '" + testCase.BuyerNameNew  + "'");
      await this.tools.waitFor(1000);
    }
  }





  async SearchBuyer(testCase)
  {

    testCase.url = "masters/buyer";
    testCase.pageTitle = "Buyer List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/buyer']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!"); 

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.BuyerNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();

    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddBuyer(testCase)
  {
    await this.tools.getPage("Buyer", false, true);
    await this.tools.setText("#Buyer", testCase.BuyerNameNew);
    await this.tools.selectBySelector("#TransactionLimitTypeTransactionLimits", testCase.TransactionLimit);
    await this.tools.click("#lookup-search-parent");

    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");    
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#Buyer");
    if(name != testCase.BuyerNameNew)
      throw new Error("Cannot save Buyer " + testCase.BuyerNameNew + " current value: " + name);

    this.tools.log("Buyer saved " + testCase.BuyerNameNew);

    this.tools.log("SUCCES!");
  }

}



module.exports = ShiptechMasterBuyer;



