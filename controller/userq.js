const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendMail = require("../utils/sendMail");
const { isAuthenticatedQ } = require("../middleware/auth");

const config = require("../db/configSql");
const jwt = require("jsonwebtoken");
var sp = require("../Procedure/sp");

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
      console.log(req.query.token, "this is token ");

      const authUser = jwt.verify(token, process.env.ACTIVATION_SECRET);
      if (!authUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      console.log(authUser, "authUser");

      const { email, password } = authUser;
      const passwordhash = await bcrypt.hash(password, 10);

      // jwt token
      // userSchema.methods.getJwtToken = function () {
      //   return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
      //     expiresIn: process.env.JWT_EXPIRES,
      //   });
      // };

      // CREATE USER

      const inoo = await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();

        let CreartUser = await connection.query(`

            INSERT INTO Users
            (
              [Email],
              [Password]

                    )
                 VALUES
                      (
                        '${email}',
                       '${passwordhash}'

                       )
                       
                       SELECT Id FROM Users WHERE Email='${email}'
                         `);
        console.log(CreartUser.recordset[0].Id, "CreartUser");
        return CreartUser.recordset[0].Id;
      });

      // console.log(inoo,"inoo");
      // console.log("until here")

      // Options for cookies
      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        // secure: true,
      };

      const jwtvar = jwt.sign({ id: inoo }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
      });
      // const decoded = jwt.verify(jwtvar, process.env.JWT_SECRET_KEY);

      // console.log(decoded.id,"decoded_____________");

      // res.cookie("token",jwtvar,options)

      // console.log(CreartUser);
      return res
        .cookie("token", jwtvar, options)
        .json({ message: "successfully", status: 200 });
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
      console.log("cookie", req.cookies);
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        // secure: true,
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
  "/resetpassword",
  catchAsyncErrors(async (req, res, next) => {
    console.log("resid");
    try {
      const { email } = req.body;
      // console.log(email);
      if (email === null || email === undefined || email === "") {
        return res.json({ message: "please enter valid email" });
      }

      const inoo = await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();

        let findGmail = await connection.query(`

        SELECT Email FROM Users WHERE  Email='${email}'
  
                     `);
        if (findGmail.recordset.length === 0) {
          return res.json({ message: "entered email there isnt (1)" });
        }
        return findGmail.recordset[0].Email;
      });

      console.log(inoo);

      if (!inoo) {
        return res.json({ message: "entered email there isnt" });
      }

      const nono = await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();
        var currentdate = new Date();
        var datetime =
          addZero(currentdate.getFullYear()) +
          "-" +
          addZero(currentdate.getMonth() + 1) +
          "-" +
          addZero(currentdate.getDate()) +
          " " +
          addZero(currentdate.getHours()) +
          ":" +
          addZero(currentdate.getMinutes()) +
          ":" +
          addZero(currentdate.getSeconds());
        function addZero(str) {
          return str < 10 ? "0" + str : str;
        }

        const genCode = Math.floor(100000 + Math.random() * 900000);

        let findGmail = await connection.query(`

        
      UPDATE Users
      set Verificationdate='${datetime}', Resetpassword='${genCode}'
      WHERE  Email='${email}'
      SELECT * FROM Users WHERE Email='${email}'
  
                     `);

        const onMind = findGmail.recordset[0].Verificationdate;
        console.log(new Date().getMinutes(), "getMinutes");

        // console.log(onMind,"onMind")
        console.log(findGmail.recordset[0].Verificationdate, "db");
        console.log(new Date(), "now");
        // console.log(verificationDateExp,"verificationDateExp")
        const verificationDateExp = new Date(onMind.getTime() + 5 * 1000);
        if (verificationDateExp < new Date()) {
          return res.json({ message: "كد تاييد منقضي شده است" });
        }
        console.log(findGmail.recordset[0]);

        // return findGmail.recordset[0].Verificationdate;
        try {
          await sendMail({
            email: findGmail.recordset[0].Email,
            subject: "reset your account",
            message: `  Enter   ${findGmail.recordset[0].Resetpassword}   to reset your password  `,
          });
          res.status(201).json({
            success: true,
            message: `please check your email:- 
            ${userEmail.email} to reset your account!`,
          });
        } catch (error) {
          return next(new ErrorHandler(error.message, 500));
        }
        //  return    findGmail.recordset[0].Email;
      });

      console.log(nono, "this is nono");

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

router.post(
  "/login",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // SELECT Email, Password ,Id FROM Users WHERE  Email



      let pool = await sql.connect(config.sql);
      let ex = await pool.request()
      .input('Email', email)


      ex.execute("Login").then((resp) => {
        return res.json({
          message: "successfully test",
          status: 200,
          res: resp.recordsets,
        });
      })

      console.log(ex,"ex");
      console.log(pool,"pool");
      





      // const myquery = await sql.connect(config.sql).then(async () => {
      //   let connection = new sql.Request();
          
      //   let findGmail = await connection.query(`

      //   SELECT Email, Password ,Id FROM Users WHERE  Email='${email}'
  
      //                `);
      //   console.log(findGmail.recordset[0]);
      //   if (findGmail.recordset[0].length === 0) {
      //     return res.json({ message: "user not found code:98765" });
      //   }
      //   return findGmail.recordset[0];
      // });
      // console.log(myquery.Password);

      // const comparePassword = await bcrypt.compare(password, myquery.Password);

      // if (!comparePassword) {
      //   return res.json({ message: "password is not correct" });
      // }

      // const options = {
      //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      //   httpOnly: true,
      //   sameSite: "none",
      //   // secure: true,
      // };

      // const jwtvar = jwt.sign({ id: myquery.Id }, process.env.JWT_SECRET_KEY, {
      //   expiresIn: process.env.JWT_EXPIRES,
      // });
      // // const decoded = jwt.verify(jwtvar, process.env.JWT_SECRET_KEY);

      // // console.log(decoded.id,"decoded_____________");

      // // res.cookie("token",jwtvar,options)

      // // console.log(CreartUser);
      // return res
      //   .cookie("token", jwtvar, options)
      //   .json({ message: "successfully log in", status: 200 });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;

module.exports = router;

router.get(
  "/test",
  // isAuthenticatedQ,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let pool = await sql.connect(config.sql);
      let ex = await pool.request()
      

      ex.execute("Test").then((resp) => {
        return res.json({
          message: "successfully test",
          status: 200,
          res: resp,
        });
      });

      // return res.json({ message: "successfully test", status: 200 });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// router.get(
//   "/test",
//   // isAuthenticatedQ,
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//             let  request1 = await  sql.connect(config.sql);

//       var request = new pp.Request();

//       let query = "exec Test ";
//       request.query(query, function (err, recordset) {
//         if (err) {
//             console.log(err);
//             sql.close();
//         }    })

//       return res.json({ message: "successfully test", status: 200 });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// sync  function  getOrder(productId) {
//   try {
//     let  pool = await  sql.connect(config.sql);
//     let  product = await  pool.request()
//     .input('input_parameter', sql.Int, productId)
//     .query("SELECT * from Orders where Id = @input_parameter");
//     return  product.recordsets;
//   }
//   catch (error) {
//     console.log(error);
//   }
// }

// async  function  addOrder(order) {
//   try {
//     let  pool = await  sql.connect(config);
//     let  insertProduct = await  pool.request().execute('Test');
//     return  insertProduct.recordsets;
//   }
//   catch (err) {
//     console.log(err);
//   }
// }

// router.get(
//   "/testp",catchAsyncErrors(async (req, res, next) => {
//     try {
//       let  pool = await  sql.connect(config.sql);
//       let  products = await  pool.request()
//       pool.T

//     } catch (error) {
//       console.log(error);
//     }
//   })
// );

// router.get(
//   "/testp",catchAsyncErrors(async (req, res, next) => {
//     sp.getAllUsers().then((data) => {
//       res.json(data[0]);
//     })
//   })
// );
// // router.route('/orders').get((request, response) => {

// // })

module.exports = router;
