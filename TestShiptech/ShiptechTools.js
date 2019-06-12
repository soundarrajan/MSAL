/**
 * @name create-request
 * @desc Create a request  
 */



var urljoin = require('url-join');
var endOfLine = require('os').EOL;
//var nodemailer = require('nodemailer');
var nodeoutlook = require('nodejs-nodemailer-outlook');
const fs = require('fs');
const Db = require('./MsSqlConnector.js');



class ShiptechTools {


  constructor(tools) {    

    this.tools = tools;
    if(this.tools == null)
      throw  new Error("Tools parameters is invalid");    
    this.dbIntegrationConfig = null;
    
    
  }



  async login(relativeurl, username, password, headless = false){

    if(!this.tools.connection.baseurl || this.tools.connection.baseurl.length <= 0)
      throw new Error("Missing base url from connection file.");
    
    var url = urljoin(this.tools.connection.baseurl, relativeurl);
    var page = await this.tools.launchBrowser(url, headless); 
    this.tools.addPage(page);

    this.tools.log("Login with " + username);
    
    for(var i=0; i<5; i++)
    {
      if(await this.tools.isElementVisible('#otherTileText', 4000))
        await this.tools.click('#otherTileText');//use another account
      else if(i >= 4)
        this.tools.log("Cannot find 'Use another account' dialog.");
        
      this.tools.waitFor(2000);    
    }
    
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
    if(await this.tools.isElementVisible('#idBtn_Back'))
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





//inserts product name based on id
findProducts(products, commonTestData)
{
  if(!commonTestData.products)
    throw new Error("Cannot find products");
    
  for(var i=0; i<products.length; i++)
    {     
      if(!products[i].name && products[i].id)      
        products[i].name = commonTestData.products.find(p => p.id == products[i].id).name;

      if(!products[i].name)
        throw new Error("Cannot find product name");     
    }
}


/*
async getRandomProducts(count)
{
  if(!this.tools.dbConfig)
    throw  new Error("Not connected to database");

  var db = new Db(this.tools.dbConfig);
  var products = [];

  //var sql = "SELECT TOP (30)  [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Products]  WHERE [IsDeleted]=0";
  
  // var sql = `select top(50) p.Name from master.Products p 
  // inner join enums.ProductTypes pt on pt.Id = p.ProductTypeId 
  // inner join enums.ProductTypeGroups ptg on ptg.Id = pt.ProductTypeGroupId
  // where ptg.Name = 'FuelAndDistillate'
  // and p.IsDeleted=0
  // order by ptg.name, p.name`;
  

  var sql = `select p.Name from master.Products p
  inner join enums.ProductTypes pt on pt.Id = p.ProductTypeId
  inner join enums.ProductTypeGroups ptg on ptg.Id = pt.ProductTypeGroupId
  inner join master.SpecGroups sp on p.DefaultSpecGroupId = sp.Id
  where ptg.Name = 'FuelAndDistillate' AND p.isDeleted=0`;

  var records = await db.read(sql);

  if(!records || records.length <= count)
    throw  new Error("Cannot find " +  count + " products with " + sql);
  
  
  //choose a random record
  for(var i=0; i<count; i++)
  {
    var idx = -1;
    var maxtry = 10;
    do
    {
       idx = Math.floor(Math.random() * records.length);
       maxtry--;
    }
    while(products.findIndex(p => p.Name == records[idx].Name) >= 0 && maxtry > 0);

    if(maxtry <= 0)
      throw new Error("Cannot find " + count + " distinct products in the database.");

    products.push(records[idx].Name);
    records.splice(idx, 1);
  }
  
  products.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
  
  return products;
}
*/



async getRandomVessel()
{
  if(!this.tools.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.tools.dbConfig);

  var sql = "SELECT TOP (20)  [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Vessels]  WHERE [IsDeleted]=0";
  var records = await db.read(sql);

  if(!records || records.length <= 0)
    throw  new Error("Cannot find any vessel " + sql);
  
  //choose a random record
  var idx = Math.floor(Math.random() * records.length);

  return records[idx].Name;

}





async getRandomCompany()
{
  if(!this.tools.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.tools.dbConfig);

  var sql = "SELECT TOP (20) [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Companies] WHERE [IsDeleted]=0";  
  var records = await db.read(sql);
  if(records.length <= 0)
    throw  new Error("Cannot find any company");
  
  //choose a random record
  var idx = Math.floor(Math.random() * records.length);

  return records[idx].Name;

}






async getRandomSeller()
{
  if(!this.tools.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.tools.dbConfig);
  var dbname = this.tools.dbConfig.database;

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
  if(!this.tools.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.tools.dbConfig);
  var sql = "SELECT TOP (50) [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Locations]";  
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
  //ignore DDD
  if(dateFormat.indexOf("DDD ") == 0)
    dateFormat = dateFormat.slice(4);

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
  var db = new Db(this.tools.dbConfig);
  
  var sql = "SELECT [" + this.tools.dbConfig.database + "].[enums].[TransactionDates].Name " + 
  "FROM [" + this.tools.dbConfig.database + "].[enums].[TransactionDates], [admin].[TenantConfigurations] " +
  "WHERE [" + this.tools.dbConfig.database + "].[enums].[TransactionDates].Id=[admin].[TenantConfigurations].[TransactionDateId]";

  var records = await db.read(sql);
  if(records.length <= 0)
    throw  new Error("Cannot find the current date format");
    
  return records[0].Name;
}


async validateDatabaseConfiguration()
{

  var isValid = true;
  var db = new Db(this.tools.dbConfig);
  
  var sql = "Select IsSellerConfirmationDocumentMandatory From admin.TenantConfigurations";

  var records = await db.read(sql);
  if(records.length <= 0)
    throw new Error("Cannot find IsSellerConfirmationDocumentMandatory from admin.TenantConfigurations");
    
  if(records[0].IsSellerConfirmationDocumentMandatory == 1)
  {
    this.tools.log("IsSellerConfirmationDocumentMandatory is 1 and should be 0");
    isValid = false;
  }


  return isValid;
  
}



async validatePercentCost()
{

  var isValid = true;
  var db = new Db(this.tools.dbConfig);
  var sql = "select top 1 ac.Name from master.AdditionalCosts ac inner join enums.CostTypes ct on ct.Id = ac.CostTypeId where ct.name = 'Percent'";

  var records = await db.read(sql);

  if(records.length <= 0 || records[0].length <= 0)
  {
    this.tools.log("Cannot find Percent cost type for additional costs");
    isValid = false;
  }
  return true;

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




async clearFilters()
{
    await this.tools.waitForLoader();
    var selector = "input[name='isDefault']";
    this.tools.waitFor(selector);
    var checkbox = await this.tools.page.$(selector);
    var ischecked = await (await checkbox.getProperty('checked')).jsonValue();
    if(ischecked)
    {        
      await this.tools.clickBySelector(selector);
      await this.tools.waitForLoader();
      checkbox = await this.tools.page.$(selector);
      ischecked = await (await checkbox.getProperty('checked')).jsonValue();
      if(ischecked)
        throw  new Error("Cannot uncheck " + selector);
      
      //save this configuration
      await this.tools.clickBySelector("#save_layout");
      await this.tools.waitForLoader();
      //const links = await this.tools.page.evaluate(() => { location.reload() });
      //await this.tools.waitForLoader();
    }    
}







async sendEmail()
{

  if (!fs.existsSync(this.tools.filenameResults)) {
    this.tools.log("Results file doesn't exist. Cannot send email.");
    return;
  }

  
  var testResults = fs.readFileSync(this.tools.filenameResults, 'utf8');
  //testResults = testResults.split("\n").join("<br />");

  if(testResults.length <= 0)
  {
    this.tools.log("Results file is empty. Cannot send email.");
    return;
  }

  testResults += "</table>" + endOfLine;

  var subject = "Shiptech Auto Test";  
  var logfile = fs.readFileSync("log.txt", 'utf8');
  var errorIdxs = this.tools.getIndicesOf("Backend error", logfile, true);
  var message = "Automated tests coverage: 16.9%";

  testResults = "<p>" + message + "</p>" + endOfLine + testResults;
  

  if(errorIdxs.length > 0)
  {
    
    testResults += "<br/>"
    testResults += "<br/>"
    testResults += "<p>Backend errors:</p>"
    testResults += "<ul>";
    for(var i=0; i<errorIdxs.length; i++)
    {
      var nextNewLine = logfile.indexOf(endOfLine, errorIdxs[i]);
      
      if(nextNewLine - errorIdxs[i] < 10000)
      {
        var line = logfile.substring(errorIdxs[i]+13, nextNewLine) + "</li>";
        if(line.length > 1000)
          line = line.substring(0, 1000);
        testResults += "<li>" + line + "</li>";    
      }
    }
    testResults += "</ul>";
  }

  if(testResults.indexOf("FAIL") >= 0 || errorIdxs.length > 0)
      subject += " - FAIL!";
  else
    subject += " - SUCCESS";

  testResults = "<p>" + subject + "</p>" + endOfLine + testResults;
  testResults += "<p>Some of the errors are caused by: #14719, ";

  this.sendEmailEx(this.tools.connection.emailrecipients, subject, testResults);
  await this.tools.waitFor(10000);

}





sendEmailEx(recipients, emailSubject, emailBody)
{

  if(!this.tools.connection)
    throw new Error("sendEmailEx: No connection defined.");
 
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  nodeoutlook.sendEmail({
    host: this.tools.connection.emailhost,
    port: this.tools.connection.emailport,
    secure: false,
    auth: {
        user: this.tools.connection.emailuser,
        domain: this.tools.connection.emaildomain,
        pass: this.tools.connection.emailpass
    },
    to: recipients,
    subject: emailSubject,
    html: emailBody,
    text: emailBody,
    onError: (e) => console.log(e),
    onSuccess: (i) => {
      console.log("Email sent to " + recipients); 
      //console.log(i);
    }
  });

}





/*
//obsolete
async sendEmail()
{
  
  if(!this.tools.connection.sendEmails)
    return;

  this.tools.log("Sending emails");

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pintea.petru@gmail.com',
      pass: 'xxxxxx'
    }  
  });

    var mailOptions = {
      from: 'pintea.petru@gmail.com',
      to: 'rares.tohanean@24software.ro ',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
  };



  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  await this.tools.waitFor(10000);

}
*/



}




module.exports = ShiptechTools;

