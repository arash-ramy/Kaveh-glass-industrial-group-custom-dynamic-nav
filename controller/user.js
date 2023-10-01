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

// create user
router.post("/create-user", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }
    if (email === null || password === null) {
      return next(
        new ErrorHandler("Please enter valid email and password_4888", 400)
      );
    }
    if (email === undefined || password === undefined) {
      return next(
        new ErrorHandler("Please enter valid email and password_055", 400)
      );
    }
    if (email === "" || password === "") {
      return next(
        new ErrorHandler("Please enter valid email and password_589", 400)
      );
    }
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // const myCloud = await cloudinary.v2.uploader.upload(avatar, {
    //   folder: "avatars",
    // });

    const user = {
      email: email,
      password: password,
      // avatar: {
      //   public_id: myCloud.public_id,
      //   url: myCloud.secure_url,
      // },
    };
    const activationToken = createActivationToken(user);
    // console.log("activationToken____For__CREATE__USER",activationToken)

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
    //   await sendMail({
    //     email: user.email,
    //     subject: "Activate your account",
    //     message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
    //   });
    console.log(activationToken,"ine")
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    console.log("resid");
    try {
      const { activation_token } = req.body;
      // console.log("activation_token",activation_token)
      console.log("activationToken____For__ACTIVATION", activation_token);

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      console.log("newUser", newUser);
      // console.log("resid 1")

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const {
        email,
        password,
        // , avatar
      } = newUser;
      //  console.log("resid 2")

      const user = await User.findOne({ email });
      // console.log("resid 3")
      // console.log(user)
      // console.log(newUser)

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const user1 = await User.create({
        email,
        // avatar,
        password,
      });
      // console.log("resid 4")
      sendToken(user1, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    console.log("first");

    try {
      const user = await User.findById(req.user.id);
      console.log("first");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
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
      console.log(email);
      if (email === null || email === undefined || email === "") {
        return next(new ErrorHandler("enter a vlid Email", 400));
      }
      const userEmail = await User.findOne({ email });
      console.log(userEmail, "userFounded");

      if (!userEmail) {
        return next(
          new ErrorHandler(
            "لطفا با ايميلي كه ثبت نام كرده ايد را وارد كنيد",
            400
          )
        );
      }

      const genCode = Math.floor(100000 + Math.random() * 900000);

      userEmail.resetPassword = genCode;
      console.log(userEmail, "this is");

      // const userWithResetPassword= await userEmail.save;

      userEmail.resetPassword = genCode;
      userEmail.verificationDate = new Date();
      console.log(genCode);

      await userEmail.save();

      const verificationDateExp = new Date(
        userEmail.verificationDate.getTime() + 120 * 1000
      );

      if (verificationDateExp < new Date()) {
        userEmail.verificationCode = "";
        userEmail.verificationDate = null;
        await userEmail.save();
        return next(new AppError("کد تایید منقضی شده است", 401));
      }

      try {
        await sendMail({
          email: userEmail.email,
          subject: "reset your account",
          message: `  Enter   ${genCode}   to reset your password  `,
        });
        res.status(201).json({
          success: true,
          message: `please check your email:- 
          ${userEmail.email} to reset your account!`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (err) {
      return next(new ErrorHandler(err, 500));
    }
  })
);

// reset user password part2
router.post(
  "/resetpasswordpsw",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { firstPassword, secondPassword, resetCode, resetPasswordPhone } =
        req.body;
      if (!firstPassword || !secondPassword || !resetCode) {
        return next(new ErrorHandler("ورودي ها چك شود", 400));
      }
      if (firstPassword !== secondPassword) {
        return next(new ErrorHandler("عدم تطابق گذرواژه ", 401));
      }
      if (firstPassword <= 6) {
        return next(new ErrorHandler("رمز كوتاه است ", 401));
      }
      const user = await User.find({ email: resetPasswordPhone })
        .where("resetPassword")
        .equals(resetCode);

      // .select("-resetPassword")
      // console.log(user.password,"099")
      if (!user || user.length <= 0) {
        return next(new ErrorHandler("كد وارد شده صحيح نيست", 401));
      }
      console.log(user, "inja khatas");
      user[0].password = firstPassword;
      await user[0].save();

      res.status(200).json({
        message: "عمليات نوسازي رمز عبور با موفقيت انجام شد",
      });
      console.log(req.body, "dd");
    } catch (error) {
      console.log(error.message);
      return next(new ErrorHandler("خطا ورودي ها چك شود", 401));
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

router.get(
  "/getalluser",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.find();

      res.status(201).json({
        success: true,
        message: "fetching data successfullky",
        users: users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);











module.exports = router;
