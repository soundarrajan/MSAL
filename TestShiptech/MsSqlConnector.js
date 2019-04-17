/**
 * @name create-request
 * @desc Create a request  
 */


var SQLLib = require("mssql");

class MsSqlConnector {


  constructor(dbConfig) {

    this.config = dbConfig;

  }



    async read(sql)
    {

      try 
      {
        await SQLLib.connect(this.config)

        const result = await SQLLib.query(sql);//`select * from Logs where id = ${value}`        
        SQLLib.close()

        if(!result || !result.recordset)
          return [];
        
        return result.recordset;
        /*
        for(var i=0; i<result.recordset.length; i++)
        {
          console.log(result.recordset[i].Message);
        }
        */

      } catch (err) {
          SQLLib.close();
          throw err;
      }


      /*
        try
        {      
          SQLLib.connect(this.config, function (err) {
          
            if (err) console.log(err);

            // create Request object
            var request = new SQLLib.Request();
              
            // query to the database and get the records
            request.query('select * from Logs where id=1', function (err, recordset) {
                
                if (err) console.log(err)

                for(var i=0; i<recordset.recordset.length; i++)
                {
                  console.log(recordset.recordset[i].Message);
                }
                
            });
        });
      }
      catch(error)
      {
        console.log(error);
      }

      */

    }


}


module.exports = MsSqlConnector;





