/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterCompany {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewCompany(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchCompany(testCase);

    if(isFound)
    {
      this.tools.log("Company already exists " + testCase.CompanyNameNew);
      return;
    }
        
    //insert new company
    await this.tools.click("#general_action_0");
    await this.AddCompany(testCase);

    isFound = await this.SearchCompany(testCase);

    if(!isFound)
      throw new Error("Company not found in list: \"" + testCase.CompanyNameNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchCompany(testCase)
  {
    testCase.url = "masters/company";
    testCase.pageTitle = "Company List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/company']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.CompanyNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddCompany(testCase)
  {     

    await this.tools.getPage("Company", false, true);
    await this.tools.setText("#Company", testCase.CompanyNameNew);
    await this.tools.setText("#CompanyCode", testCase.CompanyNameNew);
    
    await this.tools.click("#lookup-search-parent");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");    
    
    await this.tools.click("#lookup-search-currencyId");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");
    
    await this.tools.click("span[id='lookup-search-address.country']");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");    

    await this.tools.click("span[id='lookup-search-uom']");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");    

    await this.tools.selectBySelector("#TimeZoneTimeZone", testCase.TimeZone);
    
    await this.tools.setText("#Country", testCase.PaymentInstructions);

    await this.tools.click("input[id='inlineCheckboxPaymentCompany']");
    await this.tools.click("input[id='inlineCheckboxOperatingCompany']");

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#Company");
    if(name != testCase.CompanyNameNew)
      throw new Error("Cannot save company " + testCase.CompanyNameNew + " current value: " + name);

    this.tools.log("Company saved " + testCase.CompanyNameNew);
  }

}



module.exports = ShiptechMasterCompany;



