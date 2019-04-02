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

  


  async CreateOrder(testCase)
  {
        testCase.result = true;
        if(!testCase.vesselName)
          testCase.vesselName = await this.shiptech.getRandomVessel();
        if(!testCase.carrier)
          testCase.carrier = await this.shiptech.getRandomCompany();
        if(!testCase.port)
          testCase.port =  await  this.shiptech.getRandomPort();
        if(!testCase.seller)
          testCase.seller = await this.shiptech.getRandomSeller();
        if(!testCase.paymentCompany)
          testCase.paymentCompany = await this.shiptech.getRandomCompany();
                        
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

        for(var i=0; i<testCase.products.length; i++)
        {          
          if(testCase.products[i].name)
            await this.shiptech.selectWithText('input[name="Product '+ i +'"]', testCase.products[i].name);
          if(testCase.products[i].quantity)
            await this.tools.setText('input[name="minQuantity"]', testCase.products[i].quantity, i);
          if(testCase.products[i].quantity)
            await this.tools.setText('input[name="maxQuantity"]', testCase.products[i].quantity, i);
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
            await this.tools.selectBySelector("#additional_cost_additional_cost_0", "TAX");
            await this.tools.click("#addCost_remRow_0");
          }
          else if(countbuttons < testCase.costs.length)
            await this.tools.click("#addCost_addRow_header");

          countbuttons = await this.tools.countElements('span', '$ctrl.deleteAdditionalCost(additionalCost)', "attr", 'ng-click');
          limit--;

        }while(countbuttons != testCase.costs.length && limit > 0);
        
        for(var i=0; i<testCase.costs.length; i++)
        {          
          await this.tools.selectBySelector("#additional_cost_additional_cost_" + i, testCase.costs[i].name);
          await this.tools.selectBySelector("#additional_cost_type_" + i, testCase.costs[i].type);
          await this.tools.setText("#additional_cost_price_" + i, testCase.costs[i].unitPrice);
          await this.tools.selectBySelector("#ApplicableFor_" + i, testCase.costs[i].applicableFor);
        }

        
        await this.tools.clickOnItemByText('a.btn', 'Save');
        await this.tools.waitForLoader("Save Order");
        var labelStatus = await this.tools.getText("span[ng-if='state.params.status.name']");        
        this.tools.log("Order status is " + labelStatus.trim());
        if(!labelStatus.includes("Stemmed"))
        {
          this.tools.error("FAIL! The Order status is not Stemmed");          
          testCase.result = false;
          return testCase;
        }        

        if(this.tools.isElementVisible('a.btn[ng-click="$ctrl.sendOrderCommand($ctrl.ORDER_COMMANDS.CONFIRM_TO_SELLER, $ctrl.data.id)"]'))
        {
          await this.tools.clickOnItemByText('a.btn[ng-click="$ctrl.sendOrderCommand($ctrl.ORDER_COMMANDS.CONFIRM_TO_SELLER, $ctrl.data.id)"]', 'Confirm to Seller');
          await this.tools.clickOnItemByText('a.btn[ng-click="$ctrl.saveAndSend()"', 'Save and Send');
          await this.tools.clickOnItemByText('a.btn[ng-click="$ctrl.sendOrderCommand($ctrl.ORDER_COMMANDS.CONFIRM_TO_ALL, $ctrl.data.id)"]', 'Confirm to Vessel');
          await this.tools.clickOnItemByText('a.btn[ng-click="$ctrl.saveAndSend()"', 'Save and Send');
        }

        //select Spec group
        for(var i=0; i<testCase.products.length; i++)
        {                              
          await this.tools.selectFirstOption("select[ng-model='product.specGroup']", 'ng-model', 'product.specGroup', i);
        }

        
        await this.tools.clickOnItemByAttr('a', 'ctrl.confirmOrder(true)', 'ng-click');
        await this.tools.waitForLoader("Confirm order");
                

        labelStatus = await this.tools.getText("span[ng-if='state.params.status.name']");
        this.tools.log("Order status is " + labelStatus.trim());

        testCase.orderId = await this.readOrderId();
        if(testCase.delivery)
          testCase.delivery.orderId = testCase.orderId;
        if(testCase.invoice)
          testCase.invoice.orderId = testCase.orderId;
        if(testCase.treasury)
          testCase.treasury.orderId = testCase.orderId;

        this.tools.log("OrderId=" + testCase.orderId);
         
        if(!labelStatus.includes("Confirmed"))          
        {
          this.tools.log("Cannot confirm the order " + testCase.orderId);
          testCase.result = false;
        }

        await this.tools.closeCurrentPage();

        testCase.result = true;
        return testCase;  
  }




  async readOrderId()
  {
    var labelOrderId = await this.tools.getText("div.note.note-related.active>p.ng-binding:first-child");
    labelOrderId = labelOrderId.replace(/\D/g,'');
    return labelOrderId;
  }




}


module.exports = ShiptechOrder;

