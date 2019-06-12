/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterDocumentType {


  constructor(tools, shiptech, db, page) {    
    this.tools = tools;    
    this.shiptech = shiptech;
    this.db = db;
    this.page = page;
  }


  
  async NewDocumentType(testCase)
  {  
    
    testCase.result = true;
    var isFound = await this.SearchDocumentType(testCase);

    if(isFound)
    {
      this.tools.log("DocumentType already exists " + testCase.DocumentTypeNameNew);
      return;
    }
        
    //insert new country type
    await this.tools.click("#general_action_0");
    await this.AddDocumentType(testCase);

    isFound = await this.SearchDocumentType(testCase);

    if(!isFound)
      throw new Error("DocumentType not found in list: \"" + testCase.DocumentTypeNameNew + "\"");

    await this.tools.waitFor(5000);
  }




  async SearchDocumentType(testCase)
  {
    testCase.url = "masters/documenttype";
    testCase.pageTitle = "Document Type List";

    if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
      throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);
      
    var labelTitle = await this.tools.getText("a[href='#/masters/documenttype']");
    labelTitle = labelTitle.trim();
    this.tools.log("Current screen is " + labelTitle);
    if(!labelTitle.includes(testCase.pageTitle))
        throw new Error("FAIL!");


    await this.tools.clickOnItemWait("a[data-sortcol='name']");
    await this.tools.setText("#filter0_Text", testCase.DocumentTypeNameNew);
    await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
    await this.tools.waitForLoader();
    return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
  }

  

  async AddDocumentType(testCase)
  {

    await this.tools.getPage("Document Type", false, true);
    
    await this.tools.setText("#DocumenttypeDisplayname", testCase.DocumentTypeNameNew);

    await this.tools.click("#header_action_save");
    await this.tools.waitForLoader();

    var name = await this.tools.getTextValue("#DocumenttypeDisplayname");
    if(name != testCase.DocumentTypeNameNew)
      throw new Error("Cannot save Document Type " + testCase.DocumentTypeNameNew + " current value: " + name);

    this.tools.log("Document Type saved " + testCase.DocumentTypeNameNew);
  }

}



module.exports = ShiptechMasterDocumentType;



