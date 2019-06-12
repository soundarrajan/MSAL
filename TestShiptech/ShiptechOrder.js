/**
 * @name create-order
 * @desc Create an order
 */


const puppeteer = require('puppeteer');
const Db = require('./MsSqlConnector.js');
const TestTools24 = require('./TestTools24.js');
const ShiptechTools = require('./ShiptechTools.js');



class ShiptechOrder {


  constructor(tools, shiptech) {    
    this.tools = tools;    
    this.shiptech = shiptech;
  }

  


  async CreateOrder(testCase, commonTestData)
  {
        testCase.result = true;
        testCase.url = "new-order";
        if(!testCase.pageTitle)
          testCase.pageTitle = "New Order";
          
        if(!testCase.vesselName)
        {
          testCase.vesselName = await this.shiptech.getRandomVessel();
          commonTestData.vesselName = testCase.vesselName;
        }
        if(!testCase.carrier)
        {
          testCase.carrier = await this.shiptech.getRandomCompany();
          commonTestData.carrier = testCase.carrier;
        }
        if(!testCase.port)
        {
          testCase.port =  await  this.shiptech.getRandomPort();
          commonTestData.port = testCase.port;
        }
          
        if(!testCase.seller)
        {
          testCase.seller = await this.shiptech.getRandomSeller();
          commonTestData.seller = testCase.seller;
        }
        if(!testCase.paymentCompany)
        {
          testCase.paymentCompany = await this.shiptech.getRandomCompany();
          commonTestData.paymentCompany = testCase.paymentCompany;
        }
                        
        if(await this.shiptech.validateDate(testCase.eta) != true)
        {
          var dateFormat = await this.shiptech.getDateFormat();
          this.tools.error("Invalid date format " + testCase.eta + " valid format: " + dateFormat); 
          testCase.result = false;
        }

        if(!await this.tools.navigate(testCase.url, testCase.pageTitle))
        {         
          testCase.result = false;
          return testCase;
        }
  
          /*//navigate using the menu
          await this.tools.waitFor("li.nav-item > a.nav-link.nav-toggle > span");
          await this.tools.click('div.menu-toggler.sidebar-toggler');
          this.tools.log("Open side menu");  
          await this.tools.waitFor('div.page-sidebar.navbar-collapse.collapse.ng-scope');
          
          this.tools.log("Procurement");
          var result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Procurement');
          this.tools.log("Order");
          result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link.nav-toggle > span", 'Order');
          this.tools.log("New Order");
          result = await this.tools.clickOnItemByText("li.nav-item > a.nav-link > span", 'New Order');
          var page = await this.tools.getPage("New Order", true);
          this.shiptech.page = page;
          //*/
                
        await this.shiptech.selectWithText("input[name='Vessel']", testCase.vesselName);
        await this.shiptech.selectWithText("input[id='id_carrierCompany']", testCase.carrier);
        await this.tools.setText('input[id="eta_dateinput"]', testCase.eta);
        await this.shiptech.selectWithText("input[name='locationName']", testCase.port, false);
        await this.shiptech.selectWithText("input[name='Seller']", testCase.seller);
        await this.shiptech.selectWithText("input[name='paymentCompany']", testCase.paymentCompany);
 
        //ensure the number of products
        var countbuttons = 0;
        var limit = 10;
        do{
          countbuttons = await this.tools.countElements('span', 'ctrl.deleteProduct(product)', "attr", 'ng-click');
          //delete the product
          if(countbuttons > testCase.products.length)
            await this.tools.click("#product_remRow_0");
          else if(countbuttons < testCase.products.length)
            await this.tools.click("#product_addRow_header");

          countbuttons = await this.tools.countElements('span', 'ctrl.deleteProduct(product)', "attr", 'ng-click');
          limit--;

        }while(countbuttons != testCase.products.length && limit > 0);

        this.shiptech.findProducts(testCase.products, commonTestData);

        //clear products name
        var last = testCase.products.length - 1;
        for(var i=0; i<testCase.products.length; i++)
        {                    
          await this.shiptech.selectWithText('input[name="Product '+ i +'"]', testCase.products[last].name, true);          
        }
      

        for(var i=0; i<testCase.products.length; i++)
        {                    
          await this.shiptech.selectWithText('input[name="Product '+ i +'"]', testCase.products[i].name, true);

          if(testCase.products[i].quantity)
          {
            await this.tools.setText('input[name="minQuantity"]', testCase.products[i].quantity, i);
            await this.tools.setText('input[name="maxQuantity"]', testCase.products[i].quantity, i);
            await this.tools.setText('input[name="confirmedQuantity"]', testCase.products[i].quantity, i);
          }
          if(testCase.products[i].unitPrice)
            await this.tools.setText('input[name="price"]', testCase.products[i].unitPrice, i);
        }
      

        //ensure the number of costs
        if(!testCase.costs)
          testCase.costs = [];
        countbuttons = 0;
        limit = 10;
        do{
          countbuttons = await this.tools.countElements('span', '$ctrl.deleteAdditionalCost(additionalCost)', "attr", 'ng-click');
          //delete the cost
          if(countbuttons > testCase.costs.length)
          {
            await this.tools.selectFirstOptionBySelector("#additional_cost_additional_cost_0");
            await this.tools.click("#addCost_remRow_0");
          }
          else if(countbuttons < testCase.costs.length)
            await this.tools.click("#addCost_addRow_header");

          countbuttons = await this.tools.countElements('span', '$ctrl.deleteAdditionalCost(additionalCost)', "attr", 'ng-click');
          limit--;

        }while((countbuttons != testCase.costs.length && limit > 0  && countbuttons > 1));
        
        for(var i=0; i<testCase.costs.length; i++)
        { 
          var typeCostName = testCase.costs[i].name;
          if(!typeCostName)
            typeCostName = commonTestData[testCase.costs[i].nameId];
          if(!typeCostName)
            throw new Error("Cannot find type for additional cost");

          await this.tools.selectBySelector("#additional_cost_additional_cost_" + i, typeCostName);
          
          await this.tools.selectBySelector("#additional_cost_type_" + i, testCase.costs[i].type);
          await this.tools.setText("#additional_cost_price_" + i, testCase.costs[i].unitPrice);
          if(testCase.costs[i].applicableFor && testCase.costs[i].applicableFor.toUpperCase() == "ALL")
            await this.tools.selectBySelector("#ApplicableFor_" + i, "All", false, false);
          else
          {
            var prodName = commonTestData.products.find(p => p.id === testCase.costs[i].applicableForId).name;
            if(!prodName || prodName.length <= 0)
              throw new Error('Cannot find additional cost product ' + testCase.costs[i].applicableForId);
            await this.tools.selectBySelector("#ApplicableFor_" + i, prodName, false, false);
          }
        }

        
        await this.tools.clickOnItemByText('a.btn', 'Save');
        await this.tools.waitForLoader("Save Order");
        if(!this.tools.isElementVisible("#entity-status-1", 2000))
          throw new Error("Order status is missing, check if the order can be saved.");

        var labelStatus = await this.tools.getText("#entity-status-1");
        this.tools.log("Order status is " + labelStatus.trim());
        if(!labelStatus.includes("Stemmed"))
        {
          this.tools.error("FAIL! The Order status is not Stemmed");          
          testCase.result = false;
          return testCase;
        }        
        

        var isVisible = await this.tools.isElementVisible('a.btn[ng-click="$ctrl.sendOrderCommand($ctrl.ORDER_COMMANDS.CONFIRM_TO_SELLER, $ctrl.data.id)"]');
        if(isVisible)
        {
          await this.tools.clickOnItemByText('a.btn[ng-click="$ctrl.sendOrderCommand($ctrl.ORDER_COMMANDS.CONFIRM_TO_SELLER, $ctrl.data.id)"]', 'Confirm to Seller');
          await this.tools.clickOnItemByText('a.btn[ng-click="$ctrl.saveAndSend()"', 'Save and Send');
          await this.tools.clickOnItemByText('a.btn[ng-click="$ctrl.sendOrderCommand($ctrl.ORDER_COMMANDS.CONFIRM_TO_ALL, $ctrl.data.id)"]', 'Confirm to Vessel');
          await this.tools.clickOnItemByText('a.btn[ng-click="$ctrl.saveAndSend()"', 'Save and Send');
        }

        await this.tools.waitForLoader();

        //select Spec group
        for(var i=0; i<testCase.products.length; i++)
        {                              
          await this.tools.selectFirstOption("select[ng-model='product.specGroup']", 'ng-model', 'product.specGroup', i);
        }

        
        await this.tools.clickOnItemByAttr('a', 'ctrl.confirmOrder(true)', 'ng-click');
        await this.tools.waitForLoader("Confirm order");
                

        labelStatus = await this.tools.getText("#entity-status-1");
        this.tools.log("Order status is " + labelStatus.trim());

        if(testCase.output && testCase.output.orderId)
          commonTestData[testCase.output.orderId] = await this.readOrderId();
        
        this.tools.log("OrderId=" + commonTestData[testCase.output.orderId]);
         
        if(!labelStatus.includes("Confirmed"))          
        {
          this.tools.log("Cannot confirm the order " + commonTestData[testCase.output.orderId]);
          testCase.result = false;
        }

        await this.tools.waitFor(5000);
        await this.tools.closeCurrentPage();
        
  }




  async readOrderId()
  { 
    var labelOrderId = await this.tools.getText("div.note.note-related.active>p.ng-binding:first-child");
    labelOrderId = labelOrderId.replace("Order No", '');
    labelOrderId = labelOrderId.replace(":", '');
    //labelOrderId = labelOrderId.replace(" ", "");
    labelOrderId = labelOrderId.replace(/ +?/g, '').trim();
    //labelOrderId = labelOrderId.replace(/\D/g,'');
    return labelOrderId;
  }


}


module.exports = ShiptechOrder;

