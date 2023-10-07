const config = require("../db/configSql");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const sql = require("mssql");
const express = require("express");
const router = express.Router();




router.post(
    "/create-user-table",
    catchAsyncErrors(async (req, res, next) => {
      try {
        await sql.connect(config.sql).then(async () => {
          let connection = new sql.Request();
          let result = await connection.query(`   


           CREATE TABLE Posts (
            Id int  IDENTITY(2023,1) PRIMARY KEY ,
            creater_id int NOT NULL,
            content varchar(255),
            rating text[],
            published_date DATETIME NOT NULL  DEFAULT CURRENT_TIMESTAMP
            FOREIGN KEY (creater_id)
          )

            `);
          console.log(result.recordset);
          const data = result.recordset;
          return res.json({ data });
        });
  
        // const events = eventData.getEvents();
        //   console.log(events,"d")
        // res.json(events)
      } catch (error) {
        res.status(400).send(error.message);
      }
    })
  );

  module.exports = router;


//   CREATE TABLE User (
//     Id int  IDENTITY(1, 1) PRIMARY KEY UNIQUE,
//     Name varchar(100) NOT NULL,
//     Email varchar(100) NOT NULL UNIQUE,
//     PhoneNumber int NOT NULL UNIQUE,
//     Created_at timestamp DEFAULT CURRENT_TIMESTAMP,
//     PRIMARY KEY (id)
    
//   )
         