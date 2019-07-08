/**
 * @name test shiptech barge
 * @desc Test the Shiptech barge
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechMasterVessel {


    constructor(tools, shiptech, db, page) {
        this.tools = tools;
        this.shiptech = shiptech;
        this.db = db;
        this.page = page;
    }



    async NewVessel(testCase, commonTestData) {

        testCase.result = true;

        var isFound = await this.SearchInList(testCase, commonTestData);

        if (isFound) {
            this.tools.log("Vessel already exists " + testCase.Name);
            return;
        }

        await this.tools.click("#general_action_0");
        await this.AddItem(testCase, commonTestData);

        isFound = await this.SearchInList(testCase, commonTestData);

        if (!isFound)
            throw new Error("Vessel not found in list: \"" + testCase.Name + "\"");

        await this.tools.waitFor(5000);
    }




    async SearchInList(testCase, commonTestData) {
        testCase.url = "masters/vessel";
        testCase.pageTitle = "Vessel List";

        if (!await this.tools.navigate(testCase.url, testCase.pageTitle))
            throw new Error("Cannot open page " + testCase.url + " " + testCase.pageTitle);

        var labelTitle = await this.tools.getText("a[href='#/masters/vessel']");
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

        var buyer;
        var contactType;
        var vesselType;

        if (testCase.BuyerId) {
            buyer = commonTestData.buyers[testCase.BuyerId];
            if (!buyer)
                throw new Error("Cannot generate Buyer");
        }

        if (testCase.ContactTypeId) {
            contactType = commonTestData.contactTypes[testCase.ContactTypeId];
            if (!contactType)
                throw new Error("Cannot generate Contact Type");
        }

        if (testCase.VesselTypeId) {
            vesselType = commonTestData.vesselTypes[testCase.VesselTypeId];
            if (!vesselType)
                throw new Error("Cannot generate Vessel Type");
        }
        

        await this.tools.getPage("Vessel", false, true);
        await this.tools.setText("#Vessel", testCase.Name);
        await this.tools.setText("#VesselCode", testCase.Code);
        await this.tools.setText("#IMONo", testCase.IMONo);        
        await this.shiptech.selectWithText("#BuyerBuyer", buyer);
        await this.tools.setText("#contact_name_0", testCase.ContactName);
        await this.shiptech.selectWithText("#contact_type_0", contactType);
        await this.tools.setText("#Email", testCase.ContactEmail);        
  //      await this.tools.click("a[ng-click=\"formValues.contacts.push({isActive: true, id: 0})\"]");
        if(testCase.EmailContact)
            await this.tools.click("input[ng-model=\"formValues.contacts[$index].emailContact\"]");

        await this.shiptech.selectWithText("#VesselTypeVesselType", vesselType);
        
        await this.tools.click("#header_action_save");
        await this.tools.waitForLoader();

        var name = await this.tools.getTextValue("#Vessel");
        if (name != testCase.Name)
            throw new Error("Cannot save Vessel " + testCase.Name + " current value: " + name);

        this.tools.log("Vessel saved " + testCase.Name);
    }
}



module.exports = ShiptechMasterVessel;