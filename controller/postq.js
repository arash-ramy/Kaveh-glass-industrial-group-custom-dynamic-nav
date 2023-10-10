const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticatedQ } = require("../middleware/auth");
const config = require("../db/configSql");
const jwt = require("jsonwebtoken");
var sp = require("../Procedure/sp");
const sql = require("mssql");









router.post (
  "/create",
  isAuthenticatedQ,
  catchAsyncErrors(async (req, res, next) => {
    try {
const {Content,Title}=req.body;
Slug = Title.replace(/\s+/g, '-').toLowerCase();
        const inoo = await sql.connect(config.sql).then(async () => {
            let connection = new sql.Request();
    
            let CreartPost = await connection.query(`
    
                INSERT INTO Posts
                (
                  [Title],
                  [Content],
                  [Createdby],
                  [Slug]
    
                        )
                     VALUES
                          (
                              '${Title}',
                            '${Content}',
                           '${req.user.Id}',
                           '${Slug}'
    
                           )
                           
                           SELECT * FROM Posts 
                             `);
            console.log(CreartPost.recordset, "CreartPost");
            // return CreartUser.recordset[0].Id;
          });        
          
         
          
          return res.json({ message: "successfully test post", status: 200 });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


router.post (
    "/delet",
    isAuthenticatedQ,
    catchAsyncErrors(async (req, res, next) => {
      try {
  const {Content,Title}=req.body;
  Slug = Title.replace(/\s+/g, '-').toLowerCase();
          const inoo = await sql.connect(config.sql).then(async () => {
              let connection = new sql.Request();
      
              let CreartPost = await connection.query(`
      
                  INSERT INTO Posts
                  (
                    [Title],
                    [Content],
                    [Createdby],
                    [Slug]
      
                          )
                       VALUES
                            (
                                '${Title}',
                              '${Content}',
                             '${req.user.Id}',
                             '${Slug}'
      
                             )
                             
                             SELECT * FROM Posts 
                               `);
              console.log(CreartPost.recordset, "CreartPost");
              return CreartUser.recordset[0];
            });        
            
           
            
            return res.json({ message: "successfully test post", status: 200 });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );


  router.get (
    "/getAllpost",
    isAuthenticatedQ,
    catchAsyncErrors(async (req, res, next) => {
      try {
//   const {Content,Title}=req.body;
//   Slug = Title.replace(/\s+/g, '-').toLowerCase();
          const inoo = await sql.connect(config.sql).then(async () => {
              let connection = new sql.Request();
      
              let CreartPost = await connection.query(`
      
                
                             SELECT * FROM Posts 
                               `);
              console.log(CreartPost.recordset, "CreartPost");
              return CreartPost.recordset;
            });        
            console.log(inoo[0].Content, "****");

            return  res.render("posts.ejs", {
                posts:inoo[0].Content
              });
            
            return res.json({ message: "successfully test post", status: 200 });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );























module.exports = router;
