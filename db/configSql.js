const dotenv = require('dotenv')
const asset =require("assert");

dotenv.config();


const {SQL_USER,SQL_PASSWORD , SQL_DATABASE, SQL_SERVER }=process.env;


const sqlEncrypt = process.env.SQL_ENCRYPT==="true";

module.exports={
    sql:{
        user: "rahimi",
        password: 'Keep055',
        server: 'AR-RAHIMI', 
        database: 'ARASH' ,

        trustServerCertificate:true,
    

        // server : "AR-RAHIMI",
        // database:"events",
        // user :SQL_USER ,
        // password:SQL_PASSWORD,
        // options:{
        //     encrypt:sqlEncrypt,
        //     enableArithAbort:true
        // }
    }
}



// User Name
// KAVEH\ar-rahimi
// 
//databases
// master