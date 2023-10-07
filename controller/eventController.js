// const eventData = require("../events/index");
const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const mongoose = require("mongoose");
// const config = require("../db/configSql");
const Sidebar = require("../model/sidebar");

const sql = require("mssql");
const config = {
  sql: {
    user: "rahimi",
    password: "Keep055",
    server: "AR-RAHIMI",
    database: "ARASH",

    trustServerCertificate: true,

    // server : "AR-RAHIMI",
    // database:"events",
    // user :SQL_USER ,
    // password:SQL_PASSWORD,
    // options:{
    //     encrypt:sqlEncrypt,
    //     enableArithAbort:true
    // }
  },
};

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
      await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        let result = await connection.query(`   
        UPDATE Sidebar
        SET Row = Row +1   WHERE  Row  >= '${req.body.Row}'

          INSERT INTO Sidebar
                     (
                    [Caption]
                     ,[Row]
                     ,[Floor]
                     ,[ParentId])
                 VALUES
                     (
                     '${req.body.Caption}',
                     '${req.body.Row}',
                     '${req.body.floor}',
                     '${req.body.ParentId}'
                
          
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

router.delete(
  "/delete",
  catchAsyncErrors(async (req, res, next) => {
    try {
      await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        let result = await connection.query(`  
        DELETE FROM Sidebar
              WHERE Row= '${req.body.Row}' AND Floor= '${req.body.floor}'
         
        UPDATE Sidebar
        SET Row = Row -1  WHERE  Row  > '${req.body.Row}' `);
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

router.get(
  "/getAllSidebar",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("get");

      await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        let result = await connection.query(`  SELECT * FROM Sidebar`);
        console.log(result.recordsets);
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

router.patch(
  "/update",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { caption, row, floor, newFloor, newCaption, newRow } = req.body;
      if (
        newCaption &&
        newCaption !== null &&
        newCaption !== undefined &&
        newCaption !== ""
      ) {
        await sql.connect(config.sql).then(async () => {
          let connection = new sql.Request();
          console.log("omad1");
          let result = await connection.query(`
          UPDATE Sidebar
          SET Caption = '${req.body.newCaption}'
          WHERE  Row = '${req.body.Row}' AND FLOOR='${req.body.floor}' AND Caption='${req.body.Caption}'    
          `);
          console.log("omad2");
          const data = result.recordset;
          return res.json({ data, result });
        });
      }

      console.log(req.body);
      await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        let result = await connection.query(` 
            UPDATE Sidebar
            SET Row = '${req.body.newRow}'
            WHERE  Row = '${req.body.Row}' AND FLOOR='${req.body.floor}'   
              
            UPDATE Sidebar
            SET Row = '${req.body.Row}'
            WHERE  Row = '${req.body.newRow}' AND FLOOR='${req.body.floor}' AND  Caption='${req.body.Caption}' 
          
           
          
          `);
        //body: {row: 0, floor: 1} => VALUES({row: 0, floor: 1} , 'this is text for event Description 4 ' , '2023-12-05','2023-12-12' ,'shamsaei',1000)
        // console.log(result.recordset);
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

router.get(
  "/sql",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log(process.platform);
      console.log("****", req.headers, "****");
      console.log("****", req.headers.something, "****");

      const { caption, row, floor, newFloor, newCaption, newRow } = req.body;

      console.log(req.body);
      await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        let result = await connection.query(` 
            SELECT *
            FROM Sidebar;
          `);
        //body: {row: 0, floor: 1} => VALUES({row: 0, floor: 1} , 'this is text for event Description 4 ' , '2023-12-05','2023-12-12' ,'shamsaei',1000)
        // console.log(result.recordset);
        console.log("run then sec 1");

        const data = result.recordset;
        return res.json({ data });
      });
      // .then(async (resp) => {
      //   console.log("run then sec 2")
      //   return  res.json({ resp });
      // });

      // const events = eventData.getEvents();
      //   console.log(events,"d")
      // res.json(events)
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
);

router.get(
  "/mongo",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { caption, row, floor, newFloor, newCaption, newRow } = req.body;

      const data = await Sidebar.find();
      return res.json({ data });

      // .then(async (resp) => {
      //   console.log("run then sec 2")
      //   return  res.json({ resp });
      // });

      // const events = eventData.getEvents();
      //   console.log(events,"d")
      // res.json(events)
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
);

module.exports = router;

// router.post(
//   "/create",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { caption, row, floor } = req.body;
//       const dataInsert = {
//         caption,
//         row,
//         floor,
//       };
//       console.log(req.body);
//       await sql
//         .connect(config.sql)
//         .then(async () => {
//           let connection = new sql.Request();
//           let result =
//             await connection.query(` INSERT INTO sidebar (sidebarCaption ,row , floor  )
//           VALUES(${caption},${row},
//           ${floor}

//           `);
//           //body: {row: 0, floor: 1} => VALUES({row: 0, floor: 1} , 'this is text for event Description 4 ' , '2023-12-05','2023-12-12' ,'shamsaei',1000)
//           // console.log(result.recordset);
//           const data = result.recordset;
//           return res.json({ data });
//         })
//         .then(async (resp) => {
//           res.json({ resp });
//         });

//       // const events = eventData.getEvents();
//       //   console.log(events,"d")
//       // res.json(events)
//     } catch (error) {
//       res.status(400).send(error.message);
//     }
//   })
// );

// aix
// darwin
// freebsd
// linux
// openbsd
// sunos
// win32
// android

router.get(
  "/userinfo",
  catchAsyncErrors(async (req, res, next) => {
    try {
      if(req.headers.who!=="admin"){
        return res.status(400).json({message:"please enter your strategi"})

      }
      console.log(process.platform);
      console.log("****", req.headers, "****");
      console.log("****", req.headers.who, "****");
      // const { caption, row, floor, newFloor, newCaption, newRow } = req.body;
      const who = req.headers.who;
      const platform = process.platform;
      const datai = {
        platform,
        who,
      };
      res.set({
        ETags: "12345",
      });
      console.log(req.headers.who, "who");
      const headerssss= req.headers
      return res.json({ who: who, platform: platform ,headerssss});

      // .then(async (resp) => {
      //   console.log("run then sec 2")
      //   return  res.json({ resp });
      // });

      // const events = eventData.getEvents();
      //   console.log(events,"d")
      // res.json(events)
    } catch (error) {
      res.status(400).send(error.message);
    }
  })
);
