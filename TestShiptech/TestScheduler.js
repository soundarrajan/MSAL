/**
 * @name main test entry point
 */

var schedule = require('node-schedule');
const { spawnSync } = require( 'child_process' );
const commander = require('commander');
var runNowFlag = false;
var cmdToExecute = "";

(async () => {  


  commander
  .version('1.0.2', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-b, --batch <batch>', 'Batch file', 'batch')
  .option('-p, --params <params>', 'Runtime parameters', 'params')
  .option('-h, --hour <hour>', 'Start hour 0-24', 'hour')
  .option('-m, --minute <min>', 'Start minute 0-59', 'min')
  .parse(process.argv);

cmdToExecute = commander.batch;
var params = commander.params;
var scheduleHour = commander.hour;
var scheduleMinutes = commander.minute;

if(!scheduleMinutes || scheduleMinutes == "min")
  scheduleMinutes = -1;
if(!scheduleHour || scheduleHour == "hour")
  scheduleHour = -1;

if(!cmdToExecute)
{
  console.log("Missing -b argument, batch file to run");
  return;
}
if(!params)
  params = "";


if(scheduleHour < 0 && scheduleMinutes > 0)
{
  console.log("Missing -h argument, hour to run")
  return;
}

if(scheduleHour < 0 && scheduleMinutes < 0)
{
  runNowFlag = true;
}

/*
  var args = process.argv.slice(2);  
  if(!args || args.length <= 0 || args[0].indexOf("?") >= 0 )
    {
      console.log("24S Schedule tool:");
      console.log("Usage:");
      console.log(">node TestScheduler.js run_tests.bat start_hour start_minute");
      return;
    }
*/

  //if(args.length >= 2)
  //{//wait for the scheduled moment to run this test
    //var cmdToExecute = args[0];
    //var scheduleHour = args[1];
    //var scheduleMinutes = 0;

    //if(args.length >= 3)
      //scheduleMinutes = args[2];

    if(runNowFlag)
    {
      console.log('Test is scheduled now!');
      await runNow();
    }
    else
    {
      var rule = new schedule.RecurrenceRule();
      rule.hour = parseInt(scheduleHour);
      rule.minute = parseInt(scheduleMinutes);
  
      console.log('Test is scheduled at ' + paddy(scheduleHour, 2) + ":" + paddy(scheduleMinutes, 2));
      schedule.scheduleJob(rule, runNow);  
    }

})();





async function runNow()
{      
  console.log('Launching the test now! ' + new Date());
  console.log("Executing " + cmdToExecute);
  //console.log("Params: " + params);

  if(!cmdToExecute || cmdToExecute.length <= 0)
  {
    console.log("Nothing to execute!");
    return;
  }


  const { exec } = require('child_process');
  exec(cmdToExecute, {maxBuffer: 1024 * 1000}, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });



}


function paddy(num, padlen, padchar) {
  var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
  var pad = new Array(1 + padlen).join(pad_char);
  return (pad + num).slice(-pad.length);
}














  