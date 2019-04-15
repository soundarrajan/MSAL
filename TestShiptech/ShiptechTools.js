/**
 * @name create-request
 * @desc Create a request  
 */


const puppeteer = require('puppeteer');
const TestTools24 = require('./TestTools24.js');
const Db = require('./MsSqlConnector.js');
var urljoin = require('url-join');


class ShiptechTools {


  constructor(tools) {    

    this.tools = tools;
    if(this.tools == null)
      throw  new Error("Tools parameters is invalid");    
    this.dbIntegrationConfig = null;
    this.dbConfig = null;    
  }



  async login(relativeurl, username, password, headless = false){

    if(!this.tools.baseUrl || this.tools.baseUrl.length <= 0)
      throw new Error("Missing base url.");
    var url = urljoin(this.tools.baseUrl, relativeurl);
    var page = await this.tools.launchBrowser(url, headless); 
    this.tools.addPage(page);

    this.tools.log("Login with " + username);
    //username
    await this.tools.setText("#i0116", username);
    //Next
    await this.tools.click('input[type="submit"]');  
    //password
    await this.tools.setText('input[name="passwd"]', password); 
    //Sign in
    await this.tools.waitFor('#idSIButton9');  
    await this.tools.click('input[type="submit"]'); 
    //No, don't remember the password
    await this.tools.click('#idBtn_Back');
    return page;
  }



  async selectFromPopup(filter, valueToSelect){

      this.tools.log("Select  " + filter + " / " + valueToSelect);
      await this.tools.clickOnItemByAttr('span.input-group-addon', filter, 'ng-click');
      await this.tools.page.waitFor(3000);
      await this.tools.clickOnItemByText("td", valueToSelect);
      await this.tools.page.waitFor(1000);
      await this.tools.page.click('a[type="submit"]');
      await this.tools.page.waitFor(3000);

  }




//get date conform with the tenant settings
async getFutureDate(days, withTime)
{//01/31/2019 16:14

  if(typeof days != 'number')
    days = parseInt(days);

  var dateFormat = await this.getDateFormat();
  return this.tools.getFutureDate(days, withTime, dateFormat);
}


async selectWithText(selector, valueToSelect, checkSelection = true){

  this.tools.log("Select  " + selector + " / " + valueToSelect);
  var success = false;
  var timeElapsed = 0;

  do
  {

      if(timeElapsed > 0){
        this.tools.log("Try again to select " + valueToSelect + " in " + selector);
      }

      await this.tools.setText(selector, valueToSelect);
    //  await this.page.click(selector);    
      await this.tools.page.waitFor(200);
      if(await this.tools.isElementVisible("a[title='" + valueToSelect + "']"))
      {
        await this.tools.page.click("a[title='" + valueToSelect + "']");
        await this.tools.page.waitFor(500);
      }
      
      await this.tools.page.keyboard.press("Tab", {delay: 1000});
      await this.tools.page.waitFor(1500);
      await this.tools.page.keyboard.press("Tab", {delay: 1000});

      if(checkSelection)
      {
        //check for the multiselect is not implemented
        var implementedText = await this.tools.getTextValue(selector);        

        if(implementedText.indexOf(valueToSelect) > -1)
          success = true;
      }      

      timeElapsed += 3000;

  }while(checkSelection && !success && timeElapsed < this.tools.timeout);


  if(!success && checkSelection)
    throw  new Error("Cannot select " + valueToSelect + " to " +  selector);

}


//"Data Source=10.1.1.9;Initial Catalog=Shiptech1060_PMG_20190211;User ID=sa;Password=!QAZ2wsx;MultipleActiveResultSets=true;Connection Timeout=400"
async ConnectDb(dbconfig, url, isMaster)
{
    if(!url)
      throw new Error("Invlid url parameter:" + url);

    const urlToSearch = new URL(url);    

    this.dbIntegrationConfig = dbconfig;
    var db = new Db(this.dbIntegrationConfig);
    var address = "";
    var userId = "";
    var databaseName = "";
    var password = "";
    var start = 0;
    var end = 0;
   
    this.dbConfig = null;

    if(isMaster)
    {
        var sql = "select TenantDbConnectionString from MasterConfigurations where url like '%" + urlToSearch.host + "%'";
        var tennantconfig = await db.read(sql);

        if(!tennantconfig || tennantconfig.length <= 0)
          throw  new Error("Cannot find current tenant database " + urlToSearch.host + ". Call this function with false for tenant database");
        if(!tennantconfig[0].TenantDbConnectionString)
          throw new Error("Cannot find current database, field TenantDbConnectionString not found");

        var connectionString = tennantconfig[0].TenantDbConnectionString;

        //parse the connection string
        start = connectionString.indexOf("Data Source=");
        end =  connectionString.indexOf(";", start);
        address = connectionString.slice(start + 12, end);

        start = connectionString.indexOf("Initial Catalog=");
        end =  connectionString.indexOf(";", start);
        databaseName = connectionString.slice(start+16, end);

        start = connectionString.indexOf("User ID=");
        end =  connectionString.indexOf(";", start);
        userId = connectionString.slice(start+8, end);

        start = connectionString.indexOf("Password=");
        end =  connectionString.indexOf(";", start);
        password = connectionString.slice(start+9, end);

        this.dbConfig = {server: address, database: databaseName, user: userId, password: password};
        //var vessel = this.getRandomVessel();
    }
    else
      this.dbConfig = dbconfig;    

    this.tools.log("Current database is: " + this.dbConfig.database);
    return this.dbConfig;

}





async getRandomVessel()
{
  if(!this.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.dbConfig);

  var sql = "SELECT TOP (20)  [Name] FROM [" + this.dbConfig.database + "].[master].[Vessels]  WHERE [IsDeleted]=0";
  var records = await db.read(sql);

  if(!records || records.length <= 0)
    throw  new Error("Cannot find any vessel " + sql);
  
  //choose a random record
  var idx = Math.floor(Math.random() * records.length);

  return records[idx].Name;

}





async getRandomCompany()
{
  if(!this.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.dbConfig);

  var sql = "SELECT TOP (20) [Name] FROM [" + this.dbConfig.database + "].[master].[Companies] WHERE [IsDeleted]=0";  
  var records = await db.read(sql);
  if(records.length <= 0)
    throw  new Error("Cannot find any company");
  
  //choose a random record
  var idx = Math.floor(Math.random() * records.length);

  return records[idx].Name;

}






async getRandomSeller()
{
  if(!this.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.dbConfig);
  var dbname = this.dbConfig.database;

  var sql = `SELECT TOP (20) [Id], [Name]
  FROM [${dbname}].[master].[Counterparties], [${dbname}].[master].[CounterpartyCounterpartyTypes] 
  where 
  [${dbname}].[master].[Counterparties].Id=[${dbname}].[master].[CounterpartyCounterpartyTypes].[CounterpartyId] AND 
  [${dbname}].[master].[CounterpartyCounterpartyTypes].[CounterpartyTypeId]=2 
  AND [${dbname}].[master].[Counterparties].[IsDeleted]=0
  AND [${dbname}].[master].[Counterparties].[DefaultPaymentTermId] IS NOT NULL`;

  var records = await db.read(sql);
  if(records.length <= 0)
    throw  new Error("Cannot find any seller");
  
  //choose a random record
  var idx = Math.floor(Math.random() * records.length);

  return records[idx].Name;

}







async getRandomPort()
{
  if(!this.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.dbConfig);
  var sql = "SELECT TOP (20) [Name] FROM [" + this.dbConfig.database + "].[master].[Locations]";  
  var records = await db.read(sql);
  if(records.length <= 0)
    throw  new Error("Cannot find any company");
  
  //choose a random record
  var idx = Math.floor(Math.random() * records.length);

  return records[idx].Name;

}





async validateDate(dateToValidate)
{
  var day = 0;
  var month = 0;
  var year = 0;
  var hour = 0;
  var minute = 0;

  if(!dateToValidate)
    return false;

  var dateFormat = await this.getDateFormat();
  if(!dateToValidate.match)
    return false;
  //find what is the separator for date
  var firstActualSeparatorList = dateToValidate.match(/[^0-9]/);
  var firstFormatSeparatorList = dateFormat.match(/[^0-9dDmMyYhH]/);
  var actualSep = "";
  var formatSep = "";
  if(firstActualSeparatorList.length > 0)
    actualSep = firstActualSeparatorList[0];
  if(firstFormatSeparatorList.length > 0)
    formatSep = firstFormatSeparatorList[0]
  if(actualSep.length < 0 || actualSep != formatSep)
    return false;

  var dateComponents = dateToValidate.split(formatSep).join(" ").split(" ").join(":").split(":");
  var formatComponents = dateFormat.split(formatSep).join(" ").split(" ").join(":").split(":");

  if(dateComponents.length < 3 || formatComponents.length < 3)
    return false;
  
  for(var i=0; i<dateComponents.length; i++)
  {
    if(formatComponents[i] == "MM")
    {
      month = parseInt(dateComponents[i].toLowerCase());    
    }

    if(formatComponents[i].toLowerCase() == "dd")
    {
      day = parseInt(dateComponents[i].toLowerCase());    
    }

    if(formatComponents[i].toLowerCase() == "yyyy")
    {
      year = parseInt(dateComponents[i].toLowerCase());
    }

    if(formatComponents[i] == "HH")
    {
      hour = parseInt(dateComponents[i].toLowerCase());    
    }

    if(formatComponents[i] == "mm")
    {
      minute = parseInt(dateComponents[i].toLowerCase());    
    }
  }

  if(year < 1980 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31 || hour > 24 || minute > 60)
    return false;


  var dateTry = new Date(year, month-1, day);
  if(dateTry.getFullYear() != year || dateTry.getMonth() != month - 1 || dateTry.getDate() != day)
    return false;

  if(dateTry.getTime())
    return true;
  else 
    return false;
  
}



/*
//index - if there are many elements with the same selector
async selectFirstItem(textToSelectInAttr, attributeName, index)
{

  var selectedSpec = await this.tools.getSelectedOption('select', textToSelectInAttr, attributeName, index);
  if(selectedSpec.length <= 0)
  {
    var allOptions = await this.tools.getAllOptions('select', textToSelectInAttr, attributeName, index);
    var firstNonEmptyOption = "";
    for(var i=0; i<allOptions.length; i++)
      if(allOptions[i].length > 0)
        {
          firstNonEmptyOption = allOptions[i];
          break;
        }


    await this.tools.select('select', attributeName, textToSelectInAttr, firstNonEmptyOption, index);
    //await this.page.select('select[' + attributeName + '="' + textToSelect + '"]', firstNonEmptyOption);
  }
        
}
*/



async getDateFormat()
{
  var db = new Db(this.dbConfig);
  
  var sql = "SELECT [" + this.dbConfig.database + "].[enums].[TransactionDates].Name " + 
  "FROM [" + this.dbConfig.database + "].[enums].[TransactionDates], [admin].[TenantConfigurations] " +
  "WHERE [" + this.dbConfig.database + "].[enums].[TransactionDates].Id=[admin].[TenantConfigurations].[TransactionDateId]";

  var records = await db.read(sql);
  if(records.length <= 0)
    throw  new Error("Cannot find the current date format");
    
  return records[0].Name;
}




async filterByOrderId(orderId)
{
  await this.tools.clickOnItemWait("a[data-sortcol='order_name']");
  await this.tools.setText("#filter0_Text", orderId);
  await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
  await this.tools.waitFor(2000);
  await this.tools.waitForLoader();
}



async filterByProductName(product)
{
  await this.tools.clickOnItemWait("a[data-sortcol='product_name']");
  await this.tools.setText("#filter0_Text", product);
  await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
  await this.tools.waitFor(2000);
  await this.tools.waitForLoader();
}




async findRowIdxContainingText(selector, text)
{

  var result = await this.tools.page.evaluate(({selector, text}) => {
    var elements = document.querySelectorAll(selector);    
    if(elements.length != 1)
      return -1;
    
    var element = elements[0];
    if(element == null)
      return -2;
    
    var rows = element.getElementsByTagName("tr");
    if(rows <= 0)
      rows = element.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    if(!rows || rows.length <= 0)
      return -3;

    for(var i=0; i<rows.length; i++)
    {
      if(rows[i].innerHTML.indexOf(text) >= 0)
        return i;
    }

    return -4;

  }, {selector, text});

  return result;
}


async findTableRowsCount(selector)
{
  
  if(!this.tools.isElementVisible(selector))
    throw new Error(selector + " not visible.");

  var result = await this.tools.page.evaluate(({selector}) => {
    var elements = document.querySelectorAll(selector);    
    if(elements.length != 1)
      return -1;
    
    var element = elements[0];
    if(element == null)
      return -1;

    var rows = element.getElementsByTagName("tr").length;
    if(rows <= 0)
      rows = element.getElementsByTagName("tbody")[0].getElementsByTagName("tr").length;

    return rows;
  }, {selector});

  return result;
}


}




module.exports = ShiptechTools;

