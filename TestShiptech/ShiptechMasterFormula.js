/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterFormula {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewFormula(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchFormula(testCase);

    if(isFound)
    {
      this.tools.log("Formula already exists " + testCase.FormulaName);
      return;
    }
        
    //insert new country type
    await this.tools.click("#general_action_0");
    await this.AddFormula(testCase);

    isFound = await this.SearchFormula(testCase);

    if(!isFound)
      throw new Error("Formula not found in list: \"" + testCase.FormulaName + "\"");

    await this.tools.waitFor(5000);
  }




  
  async TestFormulaInList(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchFormula(testCase);

    if(isFound)
    {
      currentTestCase.result = true;
    }
    else
    {
      throw new Error("Formula not found " + testCase.FormulaName);
    }

  }



  async SearchFormula(testCase, commonTestData)
  {
    testCase.url = "masters/formula";
    testCase.pageTitle = "Formula List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/formula']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.FormulaName);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddFormula(testCase)
  {

    testCase.FromDateDate = await this.shiptech.getFutureDate(testCase.FromDate, false);
    testCase.ToDateDate = await this.shiptech.getFutureDate(testCase.ToDate, false);

    await this.tools.getPage("Formula", false, true);
    await this.shiptech.selectWithText("#formula_description", testCase.FormulaName);

    if(testCase.FormulaType == "Simple")
      this.tools.click("input[name='inlineRadiosformulatype[]'][value='1']");
    else if(testCase.FormulaType == "Complex")
      this.tools.click("input[name='inlineRadiosformulatype[]'][value='2']");

    //Quotes
    await this.tools.click("span[ng-click=\"triggerModal('general', 'masters_systeminstrumentlist', CM.app_id + '.FORMULA_QUOTES' | translate , 'formValues.simpleFormula.systemInstrument');\"]");
    await this.tools.click("tr[id='1']");
    await this.tools.click("#header_action_select");

    await this.tools.setText("#formula_amount", testCase.Amount);
    await this.tools.selectBySelector("select[ng-model=\"formValues.simpleFormula.priceType\"]", testCase.PriceType);
    await this.tools.selectBySelector("select[ng-model=\"formValues.simpleFormula.flatPercentage\"]", testCase.FlatOrPercentage);
    await this.tools.selectBySelector("select[ng-model=\"formValues.simpleFormula.plusMinus\"]", testCase.PlusMinus);
    if(await this.tools.isElementVisible("select[ng-model=\"formValues.simpleFormula.uom\"]"))
      await this.tools.selectBySelector("select[ng-model=\"formValues.simpleFormula.uom\"]", testCase.Uom);
    await this.tools.click("a[href='#pricing_schedule']");

    //DateRange radio
    this.tools.click("input[name='inlineRadiospricingSchedule[]'][value='4']");
    await this.tools.setText("#schedule_description_add", testCase.ScheduleDescription);
    await this.tools.setText("#pricing_schedule_from_dateinput", testCase.FromDateDate);
    await this.tools.pressTab();
    await this.tools.setText("#pricing_schedule_to_dateinput", testCase.ToDateDate);
    await this.tools.pressTab();
    

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#formula_description");
    if(name != testCase.FormulaName)
      throw new Error("Cannot save formula " + testCase.FormulaName + " current value: " + name);

    this.tools.log("Formula saved " + testCase.FormulaName);
  }

}



module.exports = ShiptechMasterFormula;



