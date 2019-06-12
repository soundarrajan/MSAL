/**
 * @name main test entry point
 */

var schedule = require('node-schedule');
const { spawnSync } = require( 'child_process' );
    

(async () => {  


  var args = process.argv.slice(2);  
  if(!args || args.length <= 0 || args[0].indexOf("?") >= 0 )
    {
      console.log("24S Schedule tool:");
      console.log("Usage:");
      console.log(">node TestScheduler.js run_tests.bat start_hour start_minute");
      process.exit(1);
      return;
    }


  if(args.length >= 2)
  {//wait for the scheduled moment to run this test
    var cmdToExecute = args[0];
    var scheduleHour = args[1];
    var scheduleMinutes = 0;
    if(args.length >= 3)
      scheduleMinutes = args[2];

    var rule = new schedule.RecurrenceRule();
    rule.hour = parseInt(scheduleHour);
    rule.minute = parseInt(scheduleMinutes);

    console.log('Test is scheduled at ' + paddy(scheduleHour, 2) + ":" + paddy(scheduleMinutes, 2));
    var j = schedule.scheduleJob(rule, async function(){
      console.log('Launching the test now! ' + new Date());
      proc = spawnSync(cmdToExecute);
      console.log( `stderr: ${proc.stderr.toString()}` );
      console.log( `stdout: ${proc.stdout.toString()}` );
    });
  }
  else
    console.log("Invalid arguments");
  

})();



function paddy(num, padlen, padchar) {
  var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
  var pad = new Array(1 + padlen).join(pad_char);
  return (pad + num).slice(-pad.length);
}














  