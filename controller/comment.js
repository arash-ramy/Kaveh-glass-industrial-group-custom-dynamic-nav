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
const { isAuthenticated } = require("../middleware/auth");
const { where } = require("../model/user");


//    / => create
//    /delete => delete comment (inside panel)
//    /
// load user
router.post(
    "/",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
      console.log("Comment =>");
      try {

      
  
        res.redirect("/hello")
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );









module.exports = router;
