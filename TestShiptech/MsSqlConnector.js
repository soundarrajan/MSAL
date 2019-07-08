 /**
 * @name create-request
 * @desc Create a request  
 */


var SQLLib = require("mssql");

class MsSqlConnector {


  constructor(dbConfig) {

    this.config = dbConfig;    
    this.isConnected = false;
  }


  async executeSql(sql)
  {
    try 
      {
        
        if(!this.isConnected)
          await SQLLib.connect(this.config)
        this.isConnected = true;

        await SQLLib.query(sql);     

        SQLLib.close()
        this.isConnected = false;

      } catch (err) {
          SQLLib.close();
          this.isConnected = false;
          throw err;
      }
  }

    async read(sql, config = "")
    {


      try 
      {
        if(!this.isConnected)
          await SQLLib.connect(this.config)
        this.isConnected = true;

        const result = await SQLLib.query(sql);//`select * from Logs where id = ${value}`        
        SQLLib.close()
        this.isConnected = false;

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
          this.isConnected = false;
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





