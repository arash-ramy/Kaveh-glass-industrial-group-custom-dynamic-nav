const eventData = require("../events/index");
const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const config = require("../db/configSql");

const sql = require("mssql");

const getEvents = async (req, res, next) => {
  try {
    const events = eventData.getEvents();
    res.send(events);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

router.post(
  "/create",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {caption,row,floor}=req.body;
      await sql
        .connect(config.sql)
        .then(async () => {
          let connection = new sql.Request();
          let result = await connection.query(`USE ARASH    
          INSERT INTO [dbo].[Sidebar]
                     (
                    [Caption]
                     ,[Row]
                     ,[Floor]
                     ,[ParentId])
               VALUES
                     (
                     '${req.body.Caption}',
                     '${req.body.Row}',
                     '${req.body.Floor}',
                     '${req.body.ParentId}'
                
          
                 )
          
          
          `);
          console.log(result.recordset);
          const data=result.recordset
          return res.json({data})
        })
        

      // const events = eventData.getEvents();
      //   console.log(events,"d")
      // res.json(events)
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
);





router.delete(
  "/delete",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {caption,Row,floor}=req.body;
      await sql
        .connect(config.sql)
        .then(async () => {
          let connection = new sql.Request();
          let result = await connection.query(`USE [ARASH]    
          DELETE FROM [dbo].[Sidebar]
                WHERE Row='${req.body.Row}'
         
          `);
          console.log(result.recordset);
          const data=result.recordset
          return res.json({data})
        })
        

      // const events = eventData.getEvents();
      //   console.log(events,"d")
      // res.json(events)
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
);



































router.post(
  "/create",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {caption,row,floor}=req.body;
      const dataInsert={
        caption,
        row,
        floor
      }
      console.log(req.body)
      await sql
        .connect(config.sql)
        .then(async () => {
          let connection = new sql.Request();
          let result = await connection.query(` INSERT INTO sidebar (sidebarCaption ,row , floor  )
          VALUES(${
            caption
          },${
            row
          },
          ${
            floor
          }
 
 
          `) 
          //body: {row: 0, floor: 1} => VALUES({row: 0, floor: 1} , 'this is text for event Description 4 ' , '2023-12-05','2023-12-12' ,'shamsaei',1000)
          // console.log(result.recordset);
          const data=result.recordset
          return res.json({data})
        })
        .then(async (resp) => {
          res.json({ resp });
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