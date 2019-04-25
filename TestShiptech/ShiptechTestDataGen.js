/**
 * @name create-request
 * @desc Create a request  
 */


const Db = require('./MsSqlConnector.js');
//var urljoin = require('url-join');
//var endOfLine = require('os').EOL;


class ShiptechTestDataGen {


  constructor(tools) {    

    this.tools = tools;
    if(this.tools == null)
      throw  new Error("Tools parameters is invalid");    
    this.dbIntegrationConfig = null;
    this.dbConfig = null;
  }


async generateTestData(testDataRequired, commonTestData)
{
  if(!testDataRequired)
    return;

  if(testDataRequired.additionalCostType)
  {
    commonTestData[testDataRequired.additionalCostType.typeId] = await this.getCostType(testDataRequired.additionalCostType.type);
  }
}


//get date conform with the tenant settings
async getFutureDate(days, withTime)
{//01/31/2019 16:14

  if(typeof days != 'number')
    days = parseInt(days);

  var dateFormat = await this.getDateFormat();
  return this.tools.getFutureDate(days, withTime, dateFormat);
}




//inserts product name based on id
findProducts(products, commonTestData)
{
  for(var i=0; i<products.length; i++)
    {     
      if(!products[i].name && products[i].id)      
        products[i].name = commonTestData.products.find(p => p.id == products[i].id).name;

      if(!products[i].name)
        throw new Error("Cannot find product name");     
    }

    products.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
}



async getRandomProducts(count)
{
  if(!this.dbConfig)
    throw  new Error("Not connected to database");

  var db = new Db(this.dbConfig);
  var products = [];

  //var sql = "SELECT TOP (30)  [Name] FROM [" + this.dbConfig.database + "].[master].[Products]  WHERE [IsDeleted]=0";
  /*
  var sql = `select top(50) p.Name from master.Products p 
  inner join enums.ProductTypes pt on pt.Id = p.ProductTypeId 
  inner join enums.ProductTypeGroups ptg on ptg.Id = pt.ProductTypeGroupId
  where ptg.Name = 'FuelAndDistillate'
  and p.IsDeleted=0
  order by ptg.name, p.name`;
  */

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

  return products;
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
  var sql = "SELECT TOP (50) [Name] FROM [" + this.dbConfig.database + "].[master].[Locations]";  
  var records = await db.read(sql);
  if(records.length <= 0)
    throw  new Error("Cannot find any company");
  
    
  //choose a random record
  var idx = Math.floor(Math.random() * records.length);

  return records[idx].Name;

}




async getCostType(typeName)
{
  if(!this.tools.dbConfig)
    throw  new Error("Not connected to database");
  var db = new Db(this.tools.dbConfig);

  var sql = "select top 1 ac.Name from master.AdditionalCosts ac inner join enums.CostTypes ct on ct.Id = ac.CostTypeId where ct.name = '" + typeName + "'";

  var records = await db.read(sql);

  if(records.length <= 0)
    throw new Error("Cannot find " + typeName + " cost type for additional costs");

  this.tools.log("Additional cost type " + typeName + ": " + records[0].Name);

  return records[0].Name;
}



}



module.exports = ShiptechTestDataGen;

