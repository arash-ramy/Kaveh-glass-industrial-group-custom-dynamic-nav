
const config = require("../db/configSql")

const sql = require('mssql');

const getEvents = async ()=>{
    try{
        console.log("indexEvent")

        await sql.connect(config.sql)
        .then( async () => {
            let connection = new sql.Request()
            let result = await connection.query('SELECT * from events')
        })
        
        console.log("list")

       
    }
    catch(error){
        console.log(error)

    }
}


module.exports={
    getEvents
}