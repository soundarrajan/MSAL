/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterProduct {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewProduct(testCase, commonTestData)
  {  
    
    testCase.result = true;
    
    var isFound = await this.SearchInList(testCase, commonTestData);

    if(isFound)
    {
      this.tools.log("Product already exists " + testCase.ProductName);
      return;
    }
        
    await this.tools.click("#general_action_0");
    await this.AddItem(testCase, commonTestData);

    isFound = await this.SearchInList(testCase, commonTestData);

    if(!isFound)
      throw new Error("Product not found in list: \"" + testCase.ProductName + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchInList(testCase, commonTestData)
  {
    testCase.url = "masters/product";
    testCase.pageTitle = "Product List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/product']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");

    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.ProductName);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddItem(testCase, commonTestData)
  {    

    await this.tools.getPage("Product", false, true);    
    await this.tools.setText("#Product", testCase.ProductName);

    await this.tools.click("span[id=\"lookup-search-parent\"]");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");

    await this.tools.selectBySelector("#ProductTypeproductType", testCase.ProductType);
    await this.tools.setText("#ProductCode", testCase.ProductCode);

    await this.tools.click("span[id=\"lookup-search-defaultSpecGroup\"]");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");

    

    await this.tools.selectBySelector("#UomMassconversionFactormassUom", "MT");
    await this.tools.setText("#conversionFactorvalue", 1);
    await this.tools.selectFirstOptionBySelector("#UomVolumeconversionFactorvolumeUom");
    
  
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#Product");
    if(name != testCase.ProductName)
      throw new Error("Cannot save product " + testCase.ProductName + " current value: " + name);

    this.tools.log("Product saved " + testCase.ProductName);
  }

}



module.exports = ShiptechMasterProduct;



