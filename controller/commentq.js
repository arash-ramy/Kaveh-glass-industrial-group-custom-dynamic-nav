const express = require("express");
const User = require("../model/user");
const Sidebar = require("../model/sidebar");
const mongoose = require("mongoose");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticatedQ } = require("../middleware/auth");
const { where } = require("../model/user");
const sql = require("mssql");
const config = require("../db/configSql");


//    / => create
//    /delete => delete comment (inside panel)
//    /
// load user
router.post(
    "/",
    isAuthenticatedQ,
    catchAsyncErrors(async (req, res, next) => {
      console.log("Comment =>");
      try {
        let {postId,comment,Commentparent}= req.body;
        if(!req.body.comment){

        }
        if(!Commentparent){
          Commentparent=0
        }
        req.user.id

        console.log(postId)
        console.log(comment)
        console.log(req.user.Id)
   



        const inoo = await sql.connect(config.sql).then(async () => {
          let connection = new sql.Request();
  
          let CreateComment = await connection.query(`
  
              INSERT INTO Comments
              (
                [Content],
                [Postid],
                [Userid],
                [Commentparent]
  
                      )
                   VALUES
                        (
                            '${comment}',
                          '${postId}',
                         '${req.user.Id}',
                         '${Commentparent}'
  
                         )
                         SELECT * FROM Comments
                           `);
          console.log(CreateComment.recordset, "CreartPost");
          return CreateComment.recordset;
        });      

        res.redirect(req.get('referer'));
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );




  
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







module.exports = router;
