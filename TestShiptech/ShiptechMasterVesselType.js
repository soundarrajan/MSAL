/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterVesselType {


    constructor(tools, shiptech, db, page) {
        this.tools = tools;
        this.shiptech = shiptech;
        this.db = db;
        this.page = page;
    }



    async NewVesselType(testCase, commonTestData) {

        testCase.result = true;

        var isFound = await this.SearchInList(testCase, commonTestData);

        if (isFound) {
            this.tools.log("Vessel type already exists " + testCase.Name);
            return;
        }

        await this.tools.click("#general_action_0");
        await this.AddItem(testCase, commonTestData);

        isFound = await this.SearchInList(testCase, commonTestData);

        if (!isFound)
            throw new Error("Vessel Type not found in list: \"" + testCase.Name + "\"");

        await this.tools.waitFor(5000);
    }




    async SearchInList(testCase, commonTestData) {
        testCase.url = "masters/vesseltype";
        testCase.pageTitle = "Vessel Type List";

        if (!await this.tools.navigate(testCase.url, testCase.pageTitle))
            throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);

        var labelTitle = await this.tools.getText("a[href='#/masters/vesseltype']");
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

        await this.tools.getPage("Vessel Type", false, true);
        await this.tools.setText("#VesselTypeName", testCase.Name);

        await this.tools.click("#header_action_save");
        await this.tools.waitForLoader();

        var name = await this.tools.getTextValue("#VesselTypeName");
        if (name != testCase.Name)
            throw new Error("Cannot save Vessel Type " + testCase.Name + " current value: " + name);

        this.tools.log("Vessel Type saved " + testCase.Name);
    }
}



module.exports = ShiptechMasterVesselType;