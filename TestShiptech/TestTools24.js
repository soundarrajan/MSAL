/**
 * @name create-request
 * @desc Create a request  
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
var util = require('util');
const path = require('path');
const fsExtra = require('fs-extra')
var endOfLine = require('os').EOL;
var urljoin = require('url-join');






class TestTools24 {


  constructor() {
    this.baseUrl = "";
    this.page = null;
    this.browser = null;    
    this.timeout = 60000;//60 sec
    this.standardWait = 500;        
    var now = this.getFormattedDateNow();
    now = this.replaceAll(now, "/", "-");
    this.filename = "perf_" + now + ".csv";
    this.filenameResults = "testResult_" + now + ".txt";
    this.stream = null;
    this.streamResults = null;
    this.logmap = new Map();
    this.pagesHistory = [];
    this.logfileName = 'log.txt';
    this.browserLogfileName = 'blog.txt';
    this.currentTextCase = 0;
    this.currentTextTitle = "";

    this.truncateLogfile(this.logfileName);
    this.truncateLogfile(this.browserLogfileName);
  }




  truncateLogfile(filename)
  {    
    const maxLogSize = 3000000;
    var alllogs = "";


    if (fs.existsSync(filename)) 
    {
      var stats = fs.statSync(filename);
      //if the file is too large, delete it
      if(stats.size > maxLogSize * 10)
        fs.unlinkSync(filename);
      else
      {//truncate the logfile
        alllogs = fs.readFileSync(filename, 'utf8');
        if(alllogs.length > maxLogSize)
        {
          alllogs = alllogs.substring(alllogs.length - maxLogSize, alllogs.length-1);
          fs.unlinkSync(filename);
        }
        else
          alllogs = "";
      }
    }
    
    //this.logFile = fs.createWriteStream(this.logfileName, { flags: 'a' });
    //fs.writeFileSync(this.logfileName, alllogs + endOfLine + endOfLine, 'utf8');    

    fs.appendFileSync(this.logfileName, alllogs + endOfLine + endOfLine, 'utf8');    
    alllogs = "";
  }


  async navigate(pageUrl, pageTitle)
  {
    if(!pageUrl || pageUrl.length <= 0)
      throw new Error("Missing url from navigate()");

    await this.waitForLoader();
    this.log("Loading " + pageTitle + "...");
    var currentTitlte = await this.page.title();
    if(currentTitlte != pageTitle)
    {
      var page = await this.getPage(pageTitle, false, false);
      if(!page)
        page = await this.openPageRelative(pageUrl);

      currentTitlte = await this.page.title();
      if(currentTitlte != pageTitle)
      {
        this.error("Cannot navigate to " + pageTitle + " at " + pageUrl);
        return false;
      }      
    }
   
    await this.waitForLoader();
    await this.page.waitFor(2000);

    return true;
  }


  log(message)
  {
    console.log(message);    
    fs.appendFileSync(this.logfileName, util.format(message) + endOfLine);
  }


  
  error(message)
  {
    console.error(message);
    fs.appendFileSync(this.logfileName, util.format(message) + endOfLine);
  }



  addPage(page)
  {
    this.page = page;
    if(this.pagesHistory.length == 0 || this.pagesHistory[this.pagesHistory.length - 1] != this.page)
          this.pagesHistory.push(this.page);
  }


  record(durationMs, title)
  {    
     this.logmap.set(title, (durationMs / 1000).toFixed(2));     
  }



  createPerformanceLog(){

    this.stream = fs.createWriteStream(this.filename, {flags:'a'});

    var fileSize = 0;

    if (fs.existsSync(this.filename)) {
      const stats = fs.statSync(this.filename); 
      fileSize = stats.size;
    }    

    var header = "Date,";
    for (const k of this.logmap.keys()) {
      header += k +",";
    }


    header += "Average" + endOfLine;    
    this.stream.write(header);
  }



  

  createResultsReport(test, testCase, result, orderId){

    this.streamResults = fs.createWriteStream(this.filenameResults, {flags:'a'});

    var fileSize = 0;

    if (fs.existsSync(this.filenameResults)) {
      const stats = fs.statSync(this.filenameResults); 
      fileSize = stats.size;
    }    

    if(fileSize == 0)
    {
      var header = "Date, Test, TestCase, Result, OrderId " + endOfLine;
      this.streamResults.write(header);
    }

    var row = this.getFormattedDateTimeNow() + "," + test + "," + testCase + "," + result + "," + orderId + endOfLine;
    this.streamResults.write(row);
    this.streamResults.end();
    this.streamResults = null;
  }






  endrow()
  {
    if(this.stream == null)
       this.createPerformanceLog();

    var row = this.getFormattedDateTimeNow() + ",";

    var average = 0;
    for (const k of this.logmap.keys()) {
      average += this.logmap.get(k);
      row += this.logmap.get(k) + ",";
    }

    average = average / this.logmap.length;
    this.stream.write(row +"," + average.toPrecision(3) + endOfLine);

    this.logmap.clear();
  }


  end(save)
  {
    if(save)
      this.endrow();

    if(this.stream != null)
    {      
      this.logmap.clear();
      this.stream.end();
      this.stream = null;
    }
  }



      async goto(url)
      {
        await this.page.goto(url, {  
          waitUntil: 'networkidle2',
          timeout: 60000
        });
        await this.page.setViewport({width: 1900, height: 1000 });
        this.addPage(this.page);        
        return this.page;
      }





      async launchBrowser(url, headless = false){
        this.browser = await puppeteer.launch(
        {
          headless: headless,
          args: ['--start-maximized']
        }
      );

      this.page = await this.getFirstPage(this.browser);      
      await this.goto(url);
      this.addPage(this.page);
      return this.page;
    }
  



    async createPageErrorHook(page, logicalTarget = "")
    {
      try
      {
        await page.exposeFunction('publishError', this.error);
      }
      catch(err)
      {
        //ignore the error:
        //Failed to add page binding with name publishError: window['publishError'] already exists!
        if(err.message.indexOf("already exists") < 0)
          throw err;
      }

      //get the error GUID from #autoTestingGUIDerror

     var repeatReadError = setInterval(async () => {

        var element = null;
        var maxretry = 10;
        var retries = 0;
        try
        {
            if(!this.page)
              return;

           element = await this.page.$("#autoTestingGUIDerror");
            
           if(!element)
            {
              var title = await page.title();
              if(title != "Sign in to your account" && title != "Sign out")
                console.log("Element autoTestingGUIDerror not found in browser page: \"" + title + "\"");
              return;
            }

            //read the error guid
            var errGuid = await this.page.evaluate(element => element.textContent, element);        
            if(errGuid && errGuid.length > 0)
            {
              this.error("Backend error " + errGuid);
              this.createResultsReport(this.currentTextTitle, this.currentTextCase, "FAIL", logicalTarget);
              process.exit(1);
            }
            retries = 0;
        }
        catch(err)
        {
          if(retries > 1)
          {
            var errtext = JSON.stringify(err);
            if(errtext.indexOf("Execution context was destroyed, most likely because of a navigation.") < 0)
              this.log("#autoTestingGUIDerror " + errtext);
          }
          retries++;

          if(errGuid && errGuid.length > 0)
            process.exit(1);
        }

        if(retries >= maxretry)
        {
          clearInterval(repeatReadError);
          this.log("I give up reading backend errors from the browser.");
        }
                      
      }, 2000);


     //Error: Request is already handled!
      //await page.setRequestInterception(true);

      
/*
      page.on("request", request => {
        const url = request.url();
        if(url && url.length > 0 && !url.endsWith(".css") &&  !url.endsWith(".woff") &&
          !url.endsWith(".png") && !url.endsWith(".jpg") && !url.endsWith(".gif") && !url.endsWith(".svg") && !url.endsWith(".js"))
              fs.appendFileSync(this.browserLogfileName, "request url:" + url + endOfLine);

        try
        {
          request.continue();
        }
        catch(e)
        {
          //this.log(e.message); 
        }
      });


      page.on("requestfailed", request => {
        const url = request.url();
        fs.appendFileSync(this.browserLogfileName, "request failed url:" + url + endOfLine);
      });

      page.on("response", response => {
        const request = response.request();
        const url = request.url();
        const status = response.status();
        if(status != 200)
          fs.appendFileSync(this.browserLogfileName, "response url:" + url + " http status:" + endOfLine);
      });
      */

      page.on('console', msg => {
        if(!msg || !msg._text)
          return;

        fs.appendFileSync(this.browserLogfileName, util.format(msg._text) + endOfLine);
      });

      page.on('error', err => {
        fs.appendFileSync(this.browserLogfileName, util.format(err) + endOfLine);
      });
    
      page.on('pageerror', pageerr => {
        fs.appendFileSync(this.browserLogfileName, util.format(pageerr) + endOfLine);
      })
  
    }




    async openPageRelative(relativeUrl, performance = false)
    {
      var fullUrl = urljoin(this.baseUrl, relativeUrl);
      this.log("Navigate to " + relativeUrl);
      var page = await this.goto(fullUrl);

      await this.waitForLoader(performance ? relativeUrl : "");
      return page;
    }

        
    async setText(selector, text, index = 0, test = false)
    {
      if(!text)
        text = "";
        
      text = text.toString();
      if(!text)
        throw new Error("setText: missing parameter: text");
      if(!selector)
        throw new Error("setText: missing parameter: selector");
      var elementsSelector = [];
      var elementSelector = "";

      await this.waitForLoader();
      await this.waitFor(selector);
      
      if(index == 0)
        elementSelector = selector;
      else
      {
        elementsSelector = await this.getSelectors(selector);

        if(elementsSelector.length <= index)
          throw new Error("setText(): Not found " + (index + 1) + " elements");

        elementSelector = elementsSelector[index];
      }

      if(elementSelector.length <= 0)
        throw new Error("setText(): Not found elements with selector " + elementSelector);

      await this.page.evaluate(elementSelector => {document.querySelector(elementSelector).value = ''}, elementSelector);
      await this.page.type(elementSelector, "");
      await this.page.waitFor(300);
      await this.page.type(elementSelector, text);
      var implementedText = await this.page.evaluate(elementSelector => {return document.querySelector(elementSelector).value;}, elementSelector);
      if(elementSelector != text)
        await this.page.evaluate((elementSelector, text) => {document.querySelector(elementSelector).value = text}, elementSelector, text);
      await this.page.waitFor(900);
     // await this.page.keyboard.press("Tab", {delay: 1000});
     // await this.page.waitFor(900);

      //the page may refresh after tab, the custom attribute is deleted
      if(index > 0)
      {
        elementsSelector = await this.getSelectors(selector);
        if(elementsSelector.length <= index)
          throw new Error("setText(): Not found " + (index + 1) + " elements");
        elementSelector = elementsSelector[index];
      }

      if(test)
      {
        var implementedText = await this.page.evaluate(elementSelector => {return document.querySelector(elementSelector).value;}, elementSelector);

        implementedText = implementedText.replace(/-/g, "");
        implementedText = implementedText.replace(/\.0*$/, "");
        implementedText = implementedText.replace(/,/g, "");


        text = text.replace(/-/g, "");
        text = text.replace(/\.0*$/, "");
        text = text.replace(/,/g, "");
        
        if(text != implementedText)
          throw new Error("setText() - cannot set " + text +  " into " + selector);
      }

     // await this.page.keyboard.press("Tab", {delay: 1000});
    }






    
        
    async makeSelector(selector, attributeName, textToSelectInAttr, index)
    {      
      if(!selector)
        throw new Error("makeSelector(): invalid parameter: selector");

      var elementsSelector = [];
      var selectedElements = [];
      var elementSelector = "";
      
      elementsSelector = await this.getSelectors(selector);

      if(elementsSelector.length <= index)
        throw ("makeSelector(): Not found " + (index + 1) + " elements");

      //find the element containing an attribute with textToSelectInAttr inside
      for(var i=0; i<elementsSelector.length; i++)
      {
        var selector = elementsSelector[i];
        var attr = await this.page.evaluate(({selector, attributeName}) => {return document.querySelector(selector).getAttribute(attributeName);}, {selector, attributeName});

        if(attr != null && attr.includes(textToSelectInAttr))
          selectedElements.push(elementsSelector[i]);
      }

      if(selectedElements.length <= index)
        throw new Error("makeSelector() Not found " + attributeName + " " + textToSelectInAttr + " index: " + index + " elements with specified attr. Selector " + selector + " len=" + elementsSelector.length);
        
      elementSelector = selectedElements[index];

      if(!elementSelector)
        throw new Error("makeSelector() selected element is null " + elementSelector + " " + attributeName + " " + textToSelectInAttr + " idx=" + index);

      if(elementSelector.length <= 0)
        throw new Error("makeSelector() is empty having " + elementSelector + " " + attributeName + " " + textToSelectInAttr);

      return elementSelector;
    }





    
    async selectFirstOptionBySelector(elementSelector)
    {
      var implementedText = await this.getSelectedOption(elementSelector);
      
      if(implementedText.length > 0)
        return;

      var allOptions = await this.getAllOptionsBySelector(elementSelector, 0);

      if(allOptions.length <= 0)
        throw new Error("no options available in " + textToSelectInAttr);

      var optionToSelect = "";
      for(var i=0; i<allOptions.length; i++)
        if(allOptions[i].text.length > 0)
        {
          optionToSelect = allOptions[i].value;
          break;
        }

       if(optionToSelect.length <= 0)
        throw new Error("no options available in " + elementSelector);

      await this.page.select(elementSelector, optionToSelect);

      await this.page.waitFor(900);

      implementedText = await this.getSelectedOption(elementSelector);    

      if(implementedText.length <= 0)
        throw new Error("Cannot select first option on " + elementSelector); 

      await this.page.keyboard.press("Tab", {delay: 1000});
    }




    
        
    async selectFirstOption(selector, attributeName, textToSelectInAttr, index)
    {
      await this.waitFor(selector);
      var elementSelector = await this.makeSelector(selector, attributeName, textToSelectInAttr, index);
      await this.selectFirstOptionBySelector(elementSelector);      
    }




            
    async selectBySelector(elementSelector, textToSelect, test=false)
    {      

      if(!textToSelect)
        throw new Error("selectBySelector invalid text parameter for " + elementSelector);

      var options = await this.getAllOptionsBySelector(elementSelector);
      var valueToSelect = null;
      var found = false;
      //find the value knowing the text      
      for(var i=0; i<options.length; i++)
        if(options[i].text == textToSelect){
          valueToSelect = options[i].value;
          found = true;
          break;
        }

      if(!found)
        for(var i=0; i<options.length; i++)
        {
          if((!options[i].text || options[i].text.length <= 0) && textToSelect.length <= 0)
          {
            valueToSelect = options[i].value;
            break;
          }

          if(options[i].text && options[i].text.indexOf(textToSelect) >= 0){
            valueToSelect = options[i].value;
            break;
          }
        }

      if(valueToSelect == null)
        throw new Error("cannot find " + textToSelect + " into " + elementSelector);

      await this.page.select(elementSelector, valueToSelect);

      await this.page.waitFor(900);

      if(test)
      {
        var implementedText = await this.getSelectedOption(elementSelector);

        implementedText = implementedText.replace(/-/g, "");
        implementedText = implementedText.replace(/\.0*$/, "");
        implementedText = implementedText.replace(/,/g, "");

        valueToSelect = valueToSelect.replace(/-/g, "");
        valueToSelect = valueToSelect.replace(/\.0*$/, "");
        valueToSelect = valueToSelect.replace(/,/g, "");
        
        if(textToSelect != implementedText && textToSelect.indexOf(implementedText) < 0 && implementedText.indexOf(textToSelect) < 0)
          throw new Error("select - cannot set " + valueToSelect +  " into " + elementSelector);
      }

      await this.page.keyboard.press("Tab", {delay: 1000});
      
    }



    
        
    async select(selector, attributeName, textToSelectInAttr, textToSelect, index)
    {      
      var elementSelector = await this.makeSelector(selector, attributeName, textToSelectInAttr, index);

      await this.page.select(elementSelector, textToSelect);

      await this.page.waitFor(900);

      var implementedText = await this.getSelectedOption('select', textToSelectInAttr, attributeName, index);      

      implementedText = implementedText.replace(/-/g, "");
      implementedText = implementedText.replace(/\.0*$/, "");
      implementedText = implementedText.replace(/,/g, "");

      textToSelect = textToSelect.replace(/-/g, "");
      textToSelect = textToSelect.replace(/\.0*$/, "");
      textToSelect = textToSelect.replace(/,/g, "");
      
//      if(textToSelect != implementedText)
  //      throw new Error("select - cannot set " + textToSelect +  " into " + selector + " " + textToSelectInAttr);

      await this.page.keyboard.press("Tab", {delay: 1000});
    }




    







         
    async getText(selector)
    {
      await this.waitFor(selector);
      var element = await this.page.$(selector);
      if(!element)
        throw new Error("getText(): " + selector + " not found.");
      var text = await this.page.evaluate(element => element.textContent, element);      
      await this.page.waitFor(300);
      return text;
    }



    async getTextValue(selector)
    {
      await this.waitFor(selector);
      var element = await this.page.$(selector);
      if(!element)
        throw new Error("getText(): " + selector + " not found.");
      var text = await this.page.evaluate(element => element.value, element);
      await this.page.waitFor(300);
      return text;
    }


    async click(selector)
    {
      if(!selector)
        throw new Error("Missing selector for click() action!");

      await this.waitFor(selector);
      await this.page.click(selector);
      await this.page.waitFor(1000);
    }





    async isElementVisible(selector, waitTime = 100, text = null)
    {
      var isVisible = false;
      try
      {
        isVisible = await this.page.waitForSelector(selector, {
                visible: true,
                timeout: waitTime
              })
      }
      catch(e)
      {
          return false;
      }

      if(!isVisible)
        return false;

      if(text == null)
        return true;

      //the element is visible but it has the required text?
      var elementText = await this.getElementText(selector);
      if(elementText && elementText.length > 0 && elementText.indexOf(text) >= 0)
        return true;
      
      return false;
    }
    


    async waitFor(selector, actionTitle = "")
    {

      if(Number.isInteger(selector))
      {
        this.page.waitFor(selector, {timeout: this.timeout});
        return;
      }

        var found = false;        
        var totalWaitTime = 0;
        var start = new Date().getTime();
        var startMessage = new Date().getTime();
        var endMessage = new Date().getTime();
        var duration = 0;

        do
        {
          try
          {
            found = await this.page.waitForSelector(selector, { timeout: this.standardWait });
            if(!found)
                this.log("waiting for " + selector);
          }
          catch(error)
          {
  
          }

          totalWaitTime += this.standardWait;
          if(totalWaitTime > this.timeout)
              throw new Error("cannot find " + selector + " after " + totalWaitTime / 1000 + "sec. I give up!");

          endMessage = new Date().getTime();
          if(endMessage - startMessage >= 1000)
          {
            this.log("wait..." + ((endMessage - start) / 1000).toFixed(0) + " s");
            startMessage = new Date().getTime();
          }

        }
        while(!found);
        
        var end = new Date().getTime();
        duration = end - start;
        if(duration > 1000)
          this.log("Total wait for selector: " + selector + " " + (duration / 1000).toFixed(1) + " s");      

        if(actionTitle.length > 0)
          this.record(end-start, actionTitle);
    }

        

    async closeCurrentPage(){

      if(this.pagesHistory.length <= 1)
        return;

      var pages = await this.browser.pages();
      if(!pages)
        return;
      if(pages.length <= 1)
        return;

      if(this.page)
      {
        this.page.close();
        this.page = null;        
        this.pagesHistory.splice(this.pagesHistory.length - 1, 1);
      }

      if(this.pagesHistory.length > 0)
        this.page = this.pagesHistory[this.pagesHistory.length - 1];
      else
        this.page = null;
    }


    async getPage(title, logPerformance = false, dowait = true){

      var waitTime = 3000;
      var start = new Date().getTime();
      var startMessage = new Date().getTime();
      var endMessage = new Date().getTime();
      var duration = 0;
      var currentTimeout = this.timeout;
      var time = 0;
      if(!dowait)
      {
        waitTime = 500;
        currentTimeout = 1000;
      }

      await this.waitForLoader();
      for(time=0; time < currentTimeout; time += waitTime)
      {
        var pagenew = null;
        let pages = await this.browser.pages();
        await this.page.waitFor(1000);
        for(var i=0; i<pages.length; i++){   
          var pagetitle = await pages[i].title();
          if(pagetitle == title)
          {
            await pages[i].setViewport({width: 1900, height: 1000 });
            pagenew = pages[i];    
          }
        }

        if(pagenew == null)
        {
          endMessage = new Date().getTime();
          if(endMessage - startMessage >= 1000)
          {
            this.log("wait..." + ((endMessage - start) / 1000).toFixed(0) + " s");
            startMessage = new Date().getTime();
          }
        }
        else
          break;//page found

        await this.page.waitFor(waitTime);
      }

      if(pagenew == null && !dowait)
        return null;
    
      this.page = pagenew;

      await this.waitForLoader(logPerformance);

      if(pagenew == null)
        throw new Error("getPage(): " + title + " not found");
      else
      {        

        var end = new Date().getTime();
        duration = end - start;
        if(duration > 1000)
          this.log("Page: " + title + "; total wait: " + (duration / 1000).toFixed(1) + " s");            

        if(logPerformance)
          this.record(end-start, title);
      }

      this.addPage(pagenew);
      await this.createPageErrorHook(pagenew);
      return pagenew;
    }





    async  getFirstPage(browser){

      this.page = null;
      let pages = await browser.pages();
      if(pages.length == 1)
      {
        this.page = pages[0];
        await this.createPageErrorHook(this.page);
        return this.page;
      }
      
      this.page = await browser.newPage();
      await this.createPageErrorHook(this.page);
      return this.page;
    }







    getFutureDate(days, withTime, format)
    {//01/31/2019 16:14
        
        var date = new Date();
        date.setTime( date.getTime() + days * 86400000 );
    
        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
    
        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
    
        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
    
        var year = date.getFullYear();
    
        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
    
        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;
    
        if(format.indexOf("MM/dd/yyyy") >= 0)
        {
          if(withTime)
            return month + "/" + day + "/" + year + " " + hour + ":" + min;
          else
            return month + "/" + day + "/" + year;
        }
        else if(format.indexOf("dd/MM/yyyy") >= 0)
        {
          if(withTime)
            return day + "/" + month + "/" + year + " " + hour + ":" + min;
          else
            return day + "/" + month + "/" + year;
        }
        else if(format.indexOf("dd-MM-yyyy") >= 0)
        {
          if(withTime)
            return day + "-" + month + "-" + year + " " + hour + ":" + min;
          else
            return day + "-" + month + "-" + year;
        }
        else
          throw new Error("getFutureDate - invalid format");

    }
    



//<div class="screen-loader" style="display: none;">
//<div class="screen-loader" style="display: block;">


  //index - click only on the n-th element found
async getElementAttribute(selector, attrName, index = 0)
{
  
  var result = await this.page.evaluate(({selector, attrName, index}) => {
    var elements = document.querySelectorAll(selector);
    var valueFound = "getElementAttribute(): not found " + attrName + " in " + elements.length + " elements";
    if(index > elements.length - 1)
      valueFound = "Only " + elements.length + " element like " + selector + " was found.";
    else
      valueFound = elements[index].getAttribute(attrName);

    return valueFound;
  }, {selector, attrName, index});

  return result;

}




async getElementText(selector, index = 0)
{
  
  var result = await this.page.evaluate(({selector, index}) => {
    var elements = document.querySelectorAll(selector);
    var valueFound = "getElementText(): not found " + selector + " in " + elements.length + " elements";
    if(index > elements.length - 1)
      valueFound = "Only " + elements.length + " element like " + selector + " was found.";
    else
      valueFound = elements[index].textContent;

    return valueFound;
  }, {selector, index});

  return result;

}








//index - click only on the n-th element found
async countElements(selector, textToClick = "", itemPartType = "", attrName = "")
{
   
  
  var result = await this.page.evaluate(({selector, textToClick, itemPartType, attrName}) => {
    var elements = document.querySelectorAll(selector);
    var valueFound = 0;
    if(!elements || elements.length <= 0)
      return 0;

    for(var i=0; i<elements.length; i++)
    {
      var element = elements[i];
      if(element == null)
        continue;

      if(itemPartType == "text")
      {
        if(contains(element, textToClick))
          {
            valueFound++;
          }
      }else if(itemPartType == "attr"){
          var attr = element.getAttribute(attrName);
          if(attr != null && attr.contains(textToClick))
          {
            valueFound++;
          }
      }
      else
      {
        var elementToClick = element.getElementsByTagName("SPAN");
        if(elementToClick[0] != undefined)
        {        
          valueFound++;          
        }
        
      }
    }
    return valueFound;

    

function contains(elem, text) {
  return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
}


function getText(elem) {
  var node,
      ret = "",
      i = 0,
      nodeType = elem.nodeType;

  if ( !nodeType ) {
      // If no nodeType, this is expected to be an array
      for ( ; (node = elem[i]); i++ ) {
          // Do not traverse comment nodes
          ret += getText( node );
      }
  } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
      // Use textContent for elements
      // innerText usage removed for consistency of new lines (see #11153)
      if ( typeof elem.textContent === "string" ) {
          return elem.textContent;
      } else {
          // Traverse its children
          for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
              ret += getText( elem );
          }
      }
  } else if ( nodeType === 3 || nodeType === 4 ) {
      return elem.nodeValue;
  }
  // Do not include comment or processing instruction nodes

  return ret;
};


  }, {selector, textToClick, itemPartType, attrName});

  return result;

}












async waitForLoader(actionTitle = "")
{
  var maxWait = 0;
  var attribute = "";
  var confirmAtrribute = "";
  var start = new Date().getTime();
  var startMessage = new Date().getTime();
  var endMessage = new Date().getTime();
  var duration = 0;
  var reapearTime = 900;
  var displayBlock = "display: block;";
  var selector = "div.screen-loader";

  if(!this.page)
    return;
    
  try
  {
  do
  {
    do
    {
        await this.page.waitFor(this.standardWait);
        maxWait += this.standardWait;

        var maxRepeat = 30;
        do
        {
          attribute = "";
          confirmAtrribute = "";
          if(this.isElementVisible(selector))
            attribute = await this.getElementAttribute(selector, "style");
          await this.page.waitFor(400);
          if(this.isElementVisible(selector))
            confirmAtrribute = await this.getElementAttribute(selector, "style");
          maxRepeat--;
        }
        while(maxRepeat > 0 && attribute != confirmAtrribute);
        
        endMessage = new Date().getTime();
        if(endMessage - startMessage >= 1000)
        {
          this.log("wait..." + ((endMessage - start) / 1000).toFixed(0) + " s");
          startMessage = new Date().getTime();
        }
    }
    while(attribute != null && maxWait <= this.timeout && (attribute.indexOf(displayBlock) > -1));
    await this.page.waitFor(reapearTime);
  }
  while(attribute != null && maxWait <= this.timeout && (attribute.indexOf(displayBlock) > -1));
  }
  catch(error)
  {
    //mask the error
  }

  var end = new Date().getTime();
  duration = end - start;
  if(duration > reapearTime)
    duration -= reapearTime;

  if(duration > 1000)
    this.log("Total wait for loader: " + (duration / 1000).toFixed(1) + " s");

  if(actionTitle.length > 0)
    this.record(duration, actionTitle);
}










    
async clickOnItemByText(selector, textToClick)
{
  await this.page.waitFor(selector, {timeout: this.timeout});
  await this.waitForLoader();
  
  var result = await this.clickOnItemWait(selector, textToClick, "text", "", 0);
  this.log("Result click: " + result);
  return result;
}




async clickOnItemByAttr(selector, textToClick, attrName, index = 0)
{
  var result = await this.clickOnItemWait(selector, textToClick, "attr", attrName, index);
  this.log("Result click: " + result);
  return result;
}


async clickOnItemWait(selector, textToClick = "", itemPartType = "", attrName = "", index = 0)
{
  var result = "";
  var waitTime = 3000;
  var totalWaitTime = 0;

  while(result.length <= 0)
  {
        result = await  this.clickOnItem(selector, textToClick, itemPartType, attrName, index);

        if(result.length <= 0)
        {
          await this.page.waitFor(waitTime);
          totalWaitTime += waitTime;
          if(totalWaitTime > this.timeout)
          {
              this.error("cannot find " + selector + " / " + itemPartType + " / " + attrName + " after " + totalWaitTime / 1000 + "sec. I give up!");
              return;
          }
        }
        else//found!
          break;
  }

  await this.page.waitFor(500);
  return result;
}






async clickBySelector(selector, index = 0)
{
  var result = "";
  var waitTime = 3000;
  var totalWaitTime = 0;

  await this.waitForLoader();
  await this.page.waitFor(selector, {timeout: this.timeout});  

  while(result.length <= 0)
  {
        result = await  this.clickOnItem(selector, "");

        if(result.length <= 0)
        {
          await this.page.waitFor(waitTime);
          totalWaitTime += waitTime;
          if(totalWaitTime > this.timeout)
          {
              this.error("cannot find " + selector + " / " + itemPartType + " / " + attrName + " after " + totalWaitTime / 1000 + "sec. I give up!");
              return;
          }
        }
        else//found!
          break;
  }

  return result;
}






async getSelectedOption(selector)
{
   
  
  var result = await this.page.evaluate(selector => {
    var elements = document.querySelectorAll(selector);
    var valueFound = "getSelectedOption(): not found " + selector;
    
    if(elements.length <= 0)
      return valueFound;

    if(elements.length > 1)
      return "getSelectedOption(): Found multiple elements for selector " + selector;
   
      var element = elements[0];
      if(element == null)
        return "getSelectedOption(): Element not found with " + selector;

        valueFound = "";      
        for(var i=0; i<element.childNodes.length; i++ )
        {
          if(element.childNodes[i].selected)
          {
            valueFound = element.childNodes[i].text;
            break;
          }
        }
        
    
    return valueFound;

  }, selector);
  
  return result;

}







async getAllOptions(selector, attributeContains, attrName, index = 0)
{
   
  
  var result = await this.page.evaluate(({selector, attributeContains, attrName, index}) => {
    var elements = document.querySelectorAll("select");
    var valueFound = "getAllOptions(): not found " + selector + " with " + attributeContains + " in " + elements.length + " elements";
    var result = [];

    var matchingElements = [];
    for(var j=0; j<elements.length; j++)
    {
      var attr = elements[j].getAttribute(attrName);
      if(attr != null && attr.contains(attributeContains))
        matchingElements.push(elements[j]);
    }


    if(matchingElements.length <= index)
      return valueFound;
    
    var element = matchingElements[index];
    if(element == null)
      return "The element at " + index + " is null.";
    
    for(var i=0; i<element.childNodes.length; i++ )
    {
      result.push(element.childNodes[i].text);
    }          
    valueFound = result;    
    
    return valueFound;

    

function contains(elem, text) {
  return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
}


function getText(elem) {
  var node,
      ret = "",
      i = 0,
      nodeType = elem.nodeType;

  if ( !nodeType ) {
      // If no nodeType, this is expected to be an array
      for ( ; (node = elem[i]); i++ ) {
          // Do not traverse comment nodes
          ret += getText( node );
      }
  } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
      // Use textContent for elements
      // innerText usage removed for consistency of new lines (see #11153)
      if ( typeof elem.textContent === "string" ) {
          return elem.textContent;
      } else {
          // Traverse its children
          for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
              ret += getText( elem );
          }
      }
  } else if ( nodeType === 3 || nodeType === 4 ) {
      return elem.nodeValue;
  }
  // Do not include comment or processing instruction nodes

  return ret;
};


  }, {selector, attributeContains, attrName, index});
  
  return result;

}













async getAllOptionsBySelector(selector, index = 0)
{
   
  
  var result = await this.page.evaluate(({selector, index}) => {
    var elements = document.querySelectorAll(selector);
    var valueFound = "getAllOptionsBySelector(): not found " + selector;
    var result = [];

    if(elements.length <= index)
      return valueFound;
    
    var element = elements[index];
    if(element == null)
      return "The element at " + index + " is null.";
    
    for(var i=0; i<element.childNodes.length; i++ )
    {
      result.push({text: element.childNodes[i].text, value: element.childNodes[i].value});
    }          
    valueFound = result;    
    
    return valueFound;   

  }, {selector, index});
  
  return result;

}











//index - click only on the n-th element found
async clickOnItem(selector, textToClick = "", itemPartType = "", attrName = "", index = 0)
{
   
  
  var result = await this.page.evaluate(({selector, textToClick, itemPartType, attrName, index}) => {
    var elements = document.querySelectorAll(selector);
    var valueFound = "clickOnItem(): " + selector + ", " + textToClick + " not found " + attrName + " in " + elements.length + " elements";
    var countFoundElements = 0;

    for(var i=0; i<elements.length; i++)
    {
      var element = elements[i];
      if(element == null)
        continue;

      if(itemPartType == "text")
      {
        valueFound += " , " + element.tagName;
        if(contains(element, textToClick))
          {
            countFoundElements++;

            if(countFoundElements-1 >= index)
            {
              element.click();
              valueFound = textToClick;
              break;
            }

          }
      }
      else if(itemPartType == "")
      {
        valueFound += " , " + element.tagName;
        countFoundElements++;
        if(countFoundElements-1 >= index)
        {          
          element.click();
          //element.style.display = "none";
          valueFound = "element: " + JSON.stringify(element);
          break;
        }        
      }
      else if(itemPartType == "attr"){
          var attr = element.getAttribute(attrName);
          if(attr != null && attr.contains(textToClick))
          {
            countFoundElements++;

            if(countFoundElements-1 >= index)
            {
              element.click();
              valueFound = textToClick;
              break;
            }
          }
      }
      else
      {
        var elementToClick = element.getElementsByTagName("SPAN");
        if(elementToClick[0] != undefined)
        {        
          countFoundElements++;
          if(countFoundElements-1 >= index)
          {
            elementToClick[0].click();
            valueFound = elementToClick[0].tagName;
            break;
          }
          
        }
        
      }    }
    return valueFound;

    

function contains(elem, text) {
  return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
}


function getText(elem) {
  var node,
      ret = "",
      i = 0,
      nodeType = elem.nodeType;

  if ( !nodeType ) {
      // If no nodeType, this is expected to be an array
      for ( ; (node = elem[i]); i++ ) {
          // Do not traverse comment nodes
          ret += getText( node );
      }
  } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
      // Use textContent for elements
      // innerText usage removed for consistency of new lines (see #11153)
      if ( typeof elem.textContent === "string" ) {
          return elem.textContent;
      } else {
          // Traverse its children
          for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
              ret += getText( elem );
          }
      }
  } else if ( nodeType === 3 || nodeType === 4 ) {
      return elem.nodeValue;
  }
  // Do not include comment or processing instruction nodes

  return ret;
};


  }, {selector, textToClick, itemPartType, attrName, index});

  return result;

}







 async getCoordinates(sel)
{
    
  const coordinates = await this.page.evaluate(selector => {
    const element = document.querySelector(selector.selector);
    const { x, y } = element.getBoundingClientRect();
    return {x, y};
  }, {selector: sel});

  return coordinates;
}



async waitForFile(file)
{
  
  var maxWait = 0;
  var start = new Date().getTime();
  var duration = 0;
  var reapearTime = 900;

  do
  {
    await this.page.waitFor(this.standardWait);
    maxWait += this.standardWait;
      
  }
  while(maxWait <= this.timeout && !fs.existsSync(file));

  if(!fs.existsSync(file))  
    throw new Error("File not found " + file);  

  return true;
}


async prepareDownloadFolder()
{
  const client = await this.page.target().createCDPSession();  
  var exportFolder = path.resolve(__dirname, "export");

  if (!fs.existsSync(exportFolder)) {
    fs.mkdirSync(exportFolder);
  }    

  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow', downloadPath: exportFolder}
    );

  await this.waitFor(1000);
  fsExtra.emptyDirSync(exportFolder);  
  await this.waitFor(1000);

  return exportFolder;
}



async getCheckboxValue(selector){

}


//selects multiple elements using a selector
async getSelectors(selectorp) 
{
  
  var d = new Date();
  var ms = d.getTime();
  var tagselector = selectorp;
  var sep = selectorp.indexOf("[");
  if(sep >= 0)
    tagselector = selectorp.substring(0, sep);

  var ids = await this.page.evaluate((selector, tagselector, ms) => {
    const list = document.querySelectorAll(selector)
    const ids = []
    for (const element of list) {
      const id = tagselector + ids.length
      ids.push(id)
      element.setAttribute('puppeteer' + ms, id)
    }
    return ids
  }, selectorp, tagselector, ms)


  var getElements = [];
  for (var id of ids){
    if(id && id.length > 0)
      getElements.push(`${tagselector}[puppeteer${ms}='${id}']`);
  }

  /*
  for (const id of ids) {
    getElements.push(this.page.$(`${tagselector}[puppeteer${ms}=${id}]`))
  }*/

/*
  ids = await this.page.evaluate((selector, tagselector, ms) => {
    const list = document.querySelectorAll(selector)
    const ids = []
    for (const element of list) {
      const id = tagselector + ids.length
      ids.push(id)
      element.removeAttribute('puppeteer' + ms)
    }
    return ids
  }, selectorp, tagselector, ms)
*/

  //return Promise.all(getElements);
  return getElements;
}



getFormattedDateNow(){
  var d = new Date();
  d = ('0' + d.getDate()).slice(-2) + "/" + ('0' + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
  return d;
}


getFormattedDateTimeNow(){
  var d = new Date();
  d = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);
  return d;
}



replaceAll(subject, search, replacement) {  
  return subject.split(search).join(replacement);
}
 

async Close()
{
  if(this.page)
  {
    await this.page.close();
    this.page = null;
  }
  if(this.browser)
    await this.browser.close();
}


ReadTestCase()
{  
  var args = process.argv.slice(2);
  if(args.length <= 0)
    throw new Error("No test case cmd line argument.");  

  var filename = args[0];
  if(!fs.existsSync(filename))
    throw new Error("Test case " + filename + " not found.");

  var testCase = {};
  try
  {
    var testCase = JSON.parse(fs.readFileSync(filename, 'utf8'));
  }
catch(e)
{
  throw filename + " has an invalid format. (not JSON)" + endOfLine + e.message;
}  

 if(!testCase.testTitle || testCase.testTitle.length <= 0)
   throw filename + " has contains no testTitle" + endOfLine + e.message;


 if(!testCase.testCases || testCase.testCases.length <= 0)
  throw filename + " has no testCases array";


 if(!testCase.baseurl || testCase.baseurl.length <=0)
  throw filename + " missing baseurl field";

 return testCase;
}



isValidJSON (jsonString){
  try {
      var o = JSON.parse(jsonString);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object", 
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === "object") {
          return o;
      }
  }
  catch (e) { }

  return false;
};


}


module.exports = TestTools24;





