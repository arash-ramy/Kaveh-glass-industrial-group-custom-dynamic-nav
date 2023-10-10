const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticatedQ } = require("../middleware/auth");
const config = require("../db/configSql");
const jwt = require("jsonwebtoken");
const sql = require("mssql");

router.get(
  "/",
  isAuthenticatedQ,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const slug = req.params.slug;
      console.log(slug);
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

      return res.render("posts.ejs", {
        posts: inoo,
      });

      return res.json({ message: "successfully test post", status: 200 });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/:slug",
  isAuthenticatedQ,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const slug = req.params.slug;
      console.log("sf");

      console.log(req.params);
      console.log("*****************");

      //   const {Content,Title}=req.body;
      //   Slug = Title.replace(/\s+/g, '-').toLowerCase();
      const inoo = await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        let fetchingSlug = await connection.query(`
          SELECT * FROM Posts WHERE Slug='${slug}'
      
                                 `);
        console.log(fetchingSlug.recordset[0].Id, "slug");
        let foundedUserId = fetchingSlug.recordset[0].Id;
        let fetchingUser = await connection.query(`
          SELECT Email FROM Users WHERE Id='${foundedUserId}'

                                 `);
        console.log(fetchingUser.recordset[0], "fetchingUser");
        // return fetchingSlug.recordset;
        return {
            post: fetchingSlug.recordset,
            user: fetchingUser.recordset,
        };
      });
      console.log( "-");

      console.log(inoo.post[0], "post");
      console.log(inoo.user[0], "user");

      const date = new Date();
      console.log(   
       parseInt(date.getMonth())+1.
      )

      return res.render("post.ejs", {
        posts: inoo.post,
        user:inoo.user
      });

      return res.json({ message: "successfully test post", status: 200 });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
