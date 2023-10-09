var  config = require('../db/configSql');
const  sql = require('mssql');

async  function  getAllUsers() {
  try {
    let  pool = await  sql.connect(config.sql);
    let  products = await  pool.request().query("SELECT * from Users");
    console.log(  products.recordsets);
    console.log("sp******************")
    return  products.recordsets;
  }
  catch (error) {
    console.log(error);
  }
}

module.exports = {
    getAllUsers:  getAllUsers,
    
  }