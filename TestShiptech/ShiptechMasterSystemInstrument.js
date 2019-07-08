/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterSystemInstrument {


    constructor(tools, shiptech, db, page) {
        this.tools = tools;
        this.shiptech = shiptech;
        this.db = db;
        this.page = page;
    }



    async NewSystemInstrument(testCase, commonTestData) {

        testCase.result = true;

        var isFound = await this.SearchInList(testCase, commonTestData);

        if (isFound) {
            this.tools.log("System Instrument already exists " + testCase.Name);
            return;
        }

        await this.tools.click("#general_action_0");
        await this.AddItem(testCase, commonTestData);

        isFound = await this.SearchInList(testCase, commonTestData);

        if (!isFound)
            throw new Error("System Instrument not found in list: \"" + testCase.Name + "\"");

        await this.tools.waitFor(5000);
    }




    async SearchInList(testCase, commonTestData) {
        testCase.url = "masters/systeminstrument";
        testCase.pageTitle = "System Instrument List";

        if (!await this.tools.navigate(testCase.url, testCase.pageTitle))
            throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);

        var labelTitle = await this.tools.getText("a[href='#/masters/systeminstrument']");
        labelTitle = labelTitle.trim();
        this.tools.log("Current screen is " + labelTitle);
        if (!labelTitle.includes(testCase.pageTitle))
            throw new Error("FAIL!");

        await this.tools.clickOnItemWait("a[data-sortcol='name']");
        await this.tools.setText("#filter0_Text", testCase.Name);
        await this.tools.clickOnItemByText("button[ng-click='applyFilters(columnFilters[column], true, true);hidePopover()']", 'Filter');
        await this.tools.waitForLoader();

        return await this.tools.isElementVisible("span[title='Edit']", 3000, 'Edit');
    }



    async AddItem(testCase, commonTestData) {        

        if (testCase.MarketInstrumentId) {
            var marketInstrument = commonTestData.marketInstruments[testCase.MarketInstrumentId];
            if (!marketInstrument)
                throw new Error("Cannot generate Market Instrument");
        }

        await this.tools.getPage("System Instrument", false, true);
        await this.tools.setText("#SystemInstrument", testCase.Name);
        await this.tools.setText("#SystemInstrumentCode", testCase.Code);
        await this.tools.selectBySelector("#InstrumentTypeInstrumentType", testCase.InstrumentType);
        await this.tools.selectFirstOptionBySelector("#PricePublisherPricePublisher");
        await this.shiptech.selectWithText("#MarketInstrumentMarketInstrument", marketInstrument);
        await this.tools.click(testCase.MarketPriceType);
        await this.shiptech.selectWithText("#UomMassconversionFactorMass", testCase.ConversionFactorMass);
        await this.tools.setText("#conversionFactors", testCase.ConversionFactorValue);
        await this.shiptech.selectWithText("#UomVolumeconversionFactorVolume", testCase.ConversionFactorVolume);


        await this.tools.click("#header_action_save");
        await this.tools.waitForLoader();

        var name = await this.tools.getTextValue("#SystemInstrument");
        if (name != testCase.Name)
            throw new Error("Cannot save System Instrument " + testCase.Name + " current value: " + name);

        this.tools.log("System Instrument saved " + testCase.Name);
    }
}



module.exports = ShiptechMasterSystemInstrument;