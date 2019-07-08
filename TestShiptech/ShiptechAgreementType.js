/**
 * @name test shiptech dashboard
 * @desc Test the Shiptech dashboard
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechAgreementType {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewAgreementType(testCase)
  {  
    testCase.result = true;
    testCase.url = "masters/agreementtype";
    testCase.pageTitle = "Agreement Type List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
            
    var labelTitle = await this.tools.getText("a[href='#/masters/agreementtype']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
      this.tools.log("FAIL!");

    await this.SearchAgreementType(testCase.AgreementTypeNameNew);
    
    if(await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit'))
    {
      this.tools.log("Agreement Type already exists " + testCase.AgreementTypeNameNew);
      return;
    }
    
    //insert new agreement type
    await this.tools.click("#general_action_0");    
    await this.AddAgreementType(testCase);

    await this.tools.waitFor(5000);

    if(testCase.RemoveAfterSave)
    {
      await this.tools.executeSql("delete from [" + this.tools.databaseName + "].[master].[agreementtypes] where name = '" + testCase.AgreementTypeNameNew  + "'");
      await this.tools.waitFor(1000);
    }
  

  }




  async SearchAgreementType(name)
  {
    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", name);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
  }

  

  async AddAgreementType(testCase)
  {
    await this.tools.getPage("Agreement Type", false, true);
    await this.tools.setText("#AgreementtypeName", testCase.AgreementTypeNameNew);
    await this.tools.click("span[ng-click=\"triggerModal('general', field.clc_id, CM.app_id + '.'+ field.Label | translate , 'formValues.' + field.Unique_ID,'','',field.Name, field.filter);\"]");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");    
    
   // await this.shiptech.selectWithText("#IncotermDefaultIncoterm", testCase.DefaultIncoterm);
    //await this.shiptech.selectWithText("#strategyDefaultStrategy", testCase.DefaultStrategy);
    await this.tools.click("span[id='lookup-search-defaultStrategy']");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");    

    await this.tools.selectBySelector("#ApplicableForApplicableFor", testCase.ApplicableFor);
    
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#AgreementtypeName");
    if(name != testCase.AgreementTypeNameNew)
      throw new Error("Cannot save Agreement type " + testCase.AgreementTypeNameNew + " current value: " + name);

    this.tools.log("Agreement type saved " + testCase.AgreementTypeNameNew);

    this.tools.log("SUCCES!");
  }


}


module.exports = ShiptechAgreementType;



