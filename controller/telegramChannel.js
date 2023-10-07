const express = require("express");
const Sidebar = require("../model/sidebar");
const mongoose = require("mongoose");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");





router.post(
    "/create-telegram-channel",
    catchAsyncErrors(async (req, res, next) => {
      try {

      const { name, userCreater, promotedBycustomer, category, reports } = req.body;
        console.log(req.body)

        return res.json({status:200, message:"successfully"})
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    })
  );
  
  module.exports = router;
  