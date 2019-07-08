/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterBarge {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewBarge(testCase)
  {  
   
    testCase.result = true;
    var isFound = await this.SearchBarge(testCase);
    
    if(isFound)
    {
      this.tools.log("Barge already exists " + testCase.BargeNameNew);
      return;
    }
    
    //insert new agreement type
    await this.tools.click("#general_action_0");    
    await this.AddBarge(testCase);

    isFound = await this.SearchBarge(testCase);

    if(!isFound)
      throw new Error("Barge " + testCase.BargeNameNew + " not found in list.");

    await this.tools.waitFor(5000);

    if(testCase.RemoveAfterSave)
    {
      await this.tools.executeSql("delete from [" + this.tools.databaseName + "].[master].[barges] where name = '" + testCase.BargeNameNew  + "'");
      await this.tools.waitFor(1000);
    }
  
  }




  async SearchBarge(testCase)
  {
    testCase.url = "masters/barge";
    testCase.pageTitle = "Barge List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/barge']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.BargeNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();

    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddBarge(testCase)
  {
    await this.tools.getPage("Barge", false, true);
    await this.tools.setText("#BargeName", testCase.BargeNameNew);
    await this.tools.setText("#locations", testCase.Location);
    await this.tools.clickOnItemByText("a[title='" + testCase.Location + "']", testCase.Location);
    //+ button
    await this.tools.clickOnItemWait("a[ng-click='addTagToMulti(field.Unique_ID, dummyModel)'", "");
    await this.tools.setText("#BargeCode", "Test123");    

    await this.tools.click("span[ng-click=\"triggerModal('general', field.clc_id, CM.app_id + '.'+ field.Label | translate , 'formValues.' + field.Unique_ID,'','',field.Name, field.filter);\"]");

    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");       
    
    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#BargeName");
    if(name != testCase.BargeNameNew)
      throw new Error("Cannot save Barge " + testCase.BargeNameNew + " current value: " + name);

    this.tools.log("Barge saved " + testCase.BargeNameNew);

    this.tools.log("SUCCES!");
  }


}


module.exports = ShiptechMasterBarge;



