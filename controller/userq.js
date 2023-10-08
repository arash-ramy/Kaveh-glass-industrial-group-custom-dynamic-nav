const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const { isAuthenticatedQ } = require("../middleware/auth");


const config = require("../db/configSql");
const jwt = require("jsonwebtoken");

const sql = require("mssql");
const bcrypt = require("bcryptjs");

router.post(
  "/register",
  catchAsyncErrors(async (req, res, next) => {
    console.log("object");
    try {
      await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        console.log(req.body);

        let beforUserExist = await connection.query(`

        SELECT Email  FROM Users WHERE Email='${req.body.email}'
            `);

        console.log(beforUserExist.recordset.length);
        // IF USER EXIST BEFOR
        if (beforUserExist.recordset.length !== 0) {
          return res.json({
            message: "User befor registered Please Login ",
            status: "400",
            error: [],
          });
        }
        const user = {
          email: req.body.email,
          password: req.body.password,
        };

        const createActivationToken = jwt.sign(
          user,
          process.env.ACTIVATION_SECRET,
          {
            expiresIn: "25m",
          }
        );

        // create activation token

        const activationUrl = `http://localhost:3005/api/v2/userq/activation?token=${createActivationToken}`;
        try {
          await sendMail({
            email: user.email,
            subject: "Activate your account",
            message: `Hello mr-mis, please click on the link to activate your account: ${activationUrl}`,
          });

          return res.json({
            message: "activation link successfully send",
            activationUrl: activationUrl,
          });
        } catch (error) {
          return res.json({
            message: "Proccess failed over SMPT",
            activationUrl: activationUrl,
          });
        }

        // HASHING ENTERED PASSWORD

        // YYYYMMDDD FORMAT DATE

        // let date = new Date()
        //   function formatDate(date = new Date()) {
        //     return [
        //       date.getFullYear(),
        //       padTo2Digits(date.getMonth() ),
        //       padTo2Digits(date.getDate()),
        //     ].join('');
        //   }
        //   function padTo2Digits(num) {
        //     return num.toString().padStart(2, '0');
        //   }
        //   let year =date.getFullYear()
        //   let month = padTo2Digits(date.getMonth() + 1);
        //   let day =padTo2Digits(date.getDate());
        //   let fullthem =[
        //     year,month,day
        //   ].join("-")
        //   console.log(fullthem);

        const data = connection;
        return res.json({
          message: "successfuly ",
          status: "201",
          error: [],
        });
      });

      // const events = eventData.getEvents();
      //   console.log(events,"d")
      // res.json(events)
    } catch (error) {
      return res.status(400).send(error.message);
    }
  })
);

// ACTIVATION

router.get(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    console.log("resid");
    try {
      const token = req.query.token;
      console.log(req.query.token);

      const authUser = jwt.verify(token, process.env.ACTIVATION_SECRET);
      if (!authUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      console.log(authUser);

      const { email, password } = authUser;
      const passwordhash = await bcrypt.hash(password, 10);

      // jwt token
      // userSchema.methods.getJwtToken = function () {
      //   return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
      //     expiresIn: process.env.JWT_EXPIRES,
      //   });
      // };
     const inoo= await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();

        let findGmail = await connection.query(`

        SELECT Id FROM Users WHERE  Email='${email}'
  
            
                 
                     `);

                    
     return    findGmail.recordset[0].Id;
      });

      console.log(inoo);

       // Options for cookies
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    };

     const jwtvar= jwt.sign({ id:inoo}, process.env.JWT_SECRET_KEY,{
            expiresIn: process.env.JWT_EXPIRES,
          });
          const decoded = jwt.verify(jwtvar, process.env.JWT_SECRET_KEY);

          console.log(decoded.id,"decoded_____________");

          // res.cookie("token",jwtvar,options)
  

      // CREATE USER

      // await sql.connect(config.sql).then(async () => {
      //   let connection = new sql.Request();

      //   let CreartUser = await connection.query(`

      //       INSERT INTO Users
      //       (
      //         [Email],
      //         [Password]

      //               )
      //            VALUES
      //                 (
      //                   '${email}',
      //                  '${passwordhash}'

      //                  )
      //                    `);
      // });

      // console.log(CreartUser);
      return res.cookie("token", jwtvar, options).json({ message: "successfully", status: 200 });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// reset user password 
router.post(
  "/resetpasswordphn",
  catchAsyncErrors(async (req, res, next) => {
    console.log("resid");
    try {
      const { email } = req.body;
      // console.log(email);
      if (email === null || email === undefined || email === "") {
       return res.json({message:"please enter valid email"})
      }
     

      const inoo= await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();

        let findGmail = await connection.query(`

        SELECT Email FROM Users WHERE  Email='${email}'
  
                     `) 
     return    findGmail.recordset[0].Email;
      });


console.log(inoo)

      if (!inoo) {
        return res.json({message:"entered email there isnt"})
      }




      const nono= await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        const genCode = Math.floor(100000 + Math.random() * 900000);
          const dtime=new Date();
          console.log(dtime)
        let findGmail = await connection.query(`

        
      UPDATE Users
      Verificationdate='${dtime}'
      WHERE  Email='${email}'
  
                     `) 
                     console.log(findGmail)
    //  return    findGmail.recordset[0].Email;
      });



      // userEmail.resetPassword = genCode;
      // userEmail.verificationDate = new Date();
      // console.log(genCode);

      // await userEmail.save();

      // const verificationDateExp = new Date(
      //   userEmail.verificationDate.getTime() + 120 * 1000
      // );

      // if (verificationDateExp < new Date()) {
      //   userEmail.verificationCode = "";
      //   userEmail.verificationDate = null;
      //   await userEmail.save();
      //   return next(new AppError("کد تایید منقضی شده است", 401));
      // }

      // try {
      //   await sendMail({
      //     email: userEmail.email,
      //     subject: "reset your account",
      //     message: `  Enter   ${genCode}   to reset your password  `,
      //   });
      //   res.status(201).json({
      //     success: true,
      //     message: `please check your email:- 
      //     ${userEmail.email} to reset your account!`,
      //   });
      // } catch (error) {
      //   return next(new ErrorHandler(error.message, 500));
      // }
    } catch (err) {
      return next(new ErrorHandler(err, 500));
    }
  })
);

module.exports = router;

















router.get(
  "/test",isAuthenticatedQ,
  catchAsyncErrors(async (req, res, next) => {
    try {
      
      
 console.log("req.signedCookies",req.signedCookies)
      return res.json({ message: "successfully", status: 200 });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;

