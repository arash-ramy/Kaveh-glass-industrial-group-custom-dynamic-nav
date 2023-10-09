const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const sql = require("mssql");
const config = require("../db/configSql");

exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;
console.log("middleware")
console.log(token,"token")

    if(!token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});

exports.isAuthenticatedQ = catchAsyncErrors(async(req,res,next) => {
    console.log(res.cookie)
    console.log(req.cookies)
    const {token} = req.cookies;
console.log("middleware")
console.log("tokenMiddleware")

    if(!token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("decoded",decoded)

    req.user = await sql.connect(config.sql).then(async () => {
        let connection = new sql.Request();

        let findGmail = await connection.query(`

        SELECT * FROM Users WHERE Id='${decoded.id}'
                     `);

                    console.log(findGmail,"findGmail")
        return  findGmail.recordset[0]
      });
    //   console.log(req.user)
    // req.user = await User.findById(decoded.id);

    next();
});

// exports.isSeller = catchAsyncErrors(async(req,res,next) => {
//     const {seller_token} = req.cookies;
//     if(!seller_token){
//         return next(new ErrorHandler("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

//     req.seller = await Shop.findById(decoded.id);

//     next();
// });


// exports.isAdmin = (...roles) => {
//     return (req,res,next) => {
//         if(!roles.includes(req.user.role)){
//             return next(new ErrorHandler(`${req.user.role} can not access this resources!`))
//         };
//         next();
//     }
// }


