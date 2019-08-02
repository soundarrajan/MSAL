/**
 * @name create-request
 * @desc Create a request  
 */


const Db = require('./MsSqlConnector.js');
//var urljoin = require('url-join');
//var endOfLine = require('os').EOL;


class ShiptechTestDataGen {


    constructor(tools, shiptech) {

        this.tools = tools;
        if (this.tools == null)
            throw new Error("Tools parameters is invalid");
        this.dbIntegrationConfig = null;
        this.shiptech = shiptech;
    }


    async generateTestData(testDataRequired, commonTestData) {
        if (!testDataRequired)
            return;

        if (testDataRequired.additionalCostType) {
            commonTestData.additionalCostType = [];
            for (var i = 0; i < testDataRequired.additionalCostType.length; i++) {
                commonTestData.additionalCostType[testDataRequired.additionalCostType[i].typeId] = await this.getCostType(testDataRequired.additionalCostType[i].type);
            }
        }



        if (testDataRequired.claimTypes) {
            commonTestData.claimTypes = [];

            for (var i = 0; i < testDataRequired.claimTypes.length; i++) {
                commonTestData.claimTypes[testDataRequired.claimTypes[i]] = await this.getClaimType();
            }
        }


        if (testDataRequired.physicalSuppliers) {
            commonTestData.physicalSuppliers = [];

            for (var i = 0; i < testDataRequired.physicalSuppliers.length; i++) {
                commonTestData.physicalSuppliers[testDataRequired.physicalSuppliers[i]] = await this.getRandomCouterparty("Supplier");
            }
        }


        if (testDataRequired.products) {
            commonTestData.products = [];
            var productsName = await this.getRandomProducts(testDataRequired.products.length);
            for (var i = 0; i < testDataRequired.products.length; i++) {
                this.tools.log("Product #" + (i + 1) + ": " + productsName[i]);
                commonTestData.products[testDataRequired.products[i]] = productsName[i];
            }
            //this.shiptech.findProducts(testDataRequired.products, commonTestData);
        }

        if (testDataRequired.systemInstrument) {
            commonTestData.systemInstruments = [];
            commonTestData.systemInstruments[testDataRequired.systemInstrument[0]] = await this.getSystemInstrument();
        }


        if (testDataRequired.marketInstrument) {
            commonTestData.marketInstruments = [];
            commonTestData.marketInstruments[testDataRequired.marketInstrument[0]] = await this.getMarketInstrument();
        }

        if (testDataRequired.buyer) {
            commonTestData.buyers = [];
            commonTestData.buyers[testDataRequired.buyer[0]] = await this.getBuyer();
        }


        if (testDataRequired.contactType) {
            commonTestData.contactTypes = [];
            commonTestData.contactTypes[testDataRequired.contactType[0]] = await this.getContactType();
        }


        if (testDataRequired.vesselType) {
            commonTestData.vesselTypes = [];
            commonTestData.vesselTypes[testDataRequired.vesselType[0]] = await this.getVesselType();
        }


        if (testDataRequired.vessels) {
            commonTestData.vessels = [];
            commonTestData.vessels[testDataRequired.vessels[0]] = await this.getVessel();
        }

        if (testDataRequired.serviceCodes) {
            commonTestData.serviceCodes = [];
            commonTestData.serviceCodes[testDataRequired.serviceCodes[0]] = await this.getServiceCode();
        }

        if (testDataRequired.ports) {
            commonTestData.ports = [];
            for (var i = 0; i < testDataRequired.ports.length; i++) 
                commonTestData.ports[testDataRequired.ports[i]] = await this.getRandomPort();
        }

        if (testDataRequired.companies) {
            commonTestData.companies = [];
            for (var i = 0; i < testDataRequired.companies.length; i++) 
                commonTestData.companies[testDataRequired.companies[i]] = await this.getRandomCompany();
        }

        if (testDataRequired.sellers) {
            commonTestData.sellers = [];
            for (var i = 0; i < testDataRequired.sellers.length; i++) 
                commonTestData.sellers[testDataRequired.sellers[i]] = await this.getRandomCouterparty("Seller");
        }

        if (testDataRequired.counterpartiesLab) {
            commonTestData.counterpartiesLab = [];
            for (var i = 0; i < testDataRequired.counterpartiesLab.length; i++) 
                commonTestData.counterpartiesLab[testDataRequired.counterpartiesLab[i]] = await this.getRandomCouterparty("Lab");
        }

        if (testDataRequired.surveyors) {
            commonTestData.surveyors = [];
            for (var i = 0; i < testDataRequired.surveyors.length; i++) 
                commonTestData.surveyors[testDataRequired.surveyors[i]] = await this.getRandomCouterparty("Surveyor");
        }


        commonTestData.defaultCurrency = await this.getDefaultCurrency();

    }








    async getClaimType() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (30) [Name] FROM [master].[ClaimTypes] where [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find claim type " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;
    }




    async getSystemInstrument() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (30) [Name] FROM [master].[SystemInstruments] where [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find system instrument " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;
    }



    
    async getBuyer() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (30) [Name] FROM [master].[Buyers] where [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find buyer " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;
    }



    async getServiceCode(){
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (30) [Name] FROM [master].[Services] where [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find service " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;    
    }
    

    async getVessel() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (30) [Name] FROM [master].[Vessels] where [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find vessel " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;
    }

    

    async getVesselType() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (30) [Name] FROM [master].[VesselTypes] where [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find contact type " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;
    }



    
    async getContactType() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (30) [Name] FROM [master].[ContactTypes] where [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find contact type " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;
    }



    async getMarketInstrument() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (30) [Name] FROM [master].[MarketInstruments] where [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find market instrument " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;
    }




    async getDefaultCurrency() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "select c.Name, c.Code from admin.TenantConfigurations tc join master.Currencies c on tc.CurrencyId = c.Id";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find default currency " + sql);

        return records[0].Name;
    }


    //get date conform with the tenant settings
    async getFutureDate(days, withTime) { //01/31/2019 16:14

        if (typeof days != 'number')
            days = parseInt(days);

        var dateFormat = await this.getDateFormat();
        return this.tools.getFutureDate(days, withTime, dateFormat);
    }




    //inserts product name based on id
    findProducts(products, commonTestData) {
        for (var i = 0; i < products.length; i++) {
            if (!products[i].name && products[i].id)
                products[i].name = commonTestData.products.find(p => p.id == products[i].id).name;

            if (!products[i].name)
                throw new Error("Cannot find product name");
        }

        products.sort((a, b) => (a.name > b.name) ? -1 : ((b.name > a.name) ? 1 : 0));
    }



    async getRandomProducts(count) {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");

        var db = new Db(this.tools.dbConfig);
        var products = [];

        //var sql = "SELECT TOP (30)  [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Products]  WHERE [IsDeleted]=0";
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

        if (!records || records.length <= count)
            throw new Error("Cannot find " + count + " products with " + sql);


        //choose a random record
        for (var i = 0; i < count; i++) {
            var idx = -1;
            var maxtry = 10;
            do {
                idx = Math.floor(Math.random() * records.length);
                maxtry--;
            }
            while (products.findIndex(p => p.Name == records[idx].Name) >= 0 && maxtry > 0);

            if (maxtry <= 0)
                throw new Error("Cannot find " + count + " distinct products in the database.");

            products.push(records[idx].Name);
            records.splice(idx, 1);
        }

        products.sort((a, b) => (a > b) ? -1 : ((b > a) ? 1 : 0));

        return products;
    }




    async getRandomVessel() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (20)  [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Vessels]  WHERE [IsDeleted]=0";
        var records = await db.read(sql);

        if (!records || records.length <= 0)
            throw new Error("Cannot find any vessel " + sql);

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;

    }



    


    

    async getRandomCouterparty(counterpartyType) {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

       // var sql = "SELECT TOP (20) [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Counterparties] WHERE [IsDeleted]=0";
        var sql = "select TOP (20) counterparty.Name from master.Counterparties counterparty inner join master.CounterpartyCounterpartyTypes cct " +
            " on counterparty.id = cct.CounterpartyId and counterparty.IsDeleted = 0 " +
            " inner join enums.CounterpartyTypes ct on ct.id = cct.CounterpartyTypeId and ct.IsDeleted = 0 " + 
            " where ct.InternalName = '" + counterpartyType + "'";

        var records = await db.read(sql);
        if (records.length <= 0)
            throw new Error("Cannot find any counterparty type '" + counterpartyType + "'");

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;

    }




    async getRandomCompany() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "SELECT TOP (20) [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Companies] WHERE [IsDeleted]=0";
        var records = await db.read(sql);
        if (records.length <= 0)
            throw new Error("Cannot find any company");

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;

    }






    async getRandomSeller() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
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
        if (records.length <= 0)
            throw new Error("Cannot find any seller");

        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;

    }







    async getRandomPort() {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);
        var sql = "SELECT TOP (50) [Name] FROM [" + this.tools.dbConfig.database + "].[master].[Locations] WHERE [Name]<>''";
        var records = await db.read(sql);
        if (records.length <= 0)
            throw new Error("Cannot find any port");


        //choose a random record
        var idx = Math.floor(Math.random() * records.length);

        return records[idx].Name;

    }




    async getCostType(typeName) {
        if (!this.tools.dbConfig)
            throw new Error("Not connected to database");
        var db = new Db(this.tools.dbConfig);

        var sql = "select top 1 ac.Name from master.AdditionalCosts ac inner join enums.CostTypes ct on ct.Id = ac.CostTypeId where ct.name = '" + typeName + "'";

        var records = await db.read(sql);

        if (records.length <= 0)
            throw new Error("Cannot find " + typeName + " cost type for additional costs");

        this.tools.log("Additional cost type " + typeName + ": " + records[0].Name);

        return records[0].Name;
    }



}



module.exports = ShiptechTestDataGen;