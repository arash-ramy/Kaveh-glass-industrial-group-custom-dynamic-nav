const express = require("express");
require("dotenv").config({
});
const cookieParser = require("cookie-parser");

const ErrorHandler = require("./middleware/error");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

// app.use(cors({
//   origin: ['http://localhost:3000',],
//   credentials: true
// }));  

app.get("/", (req, res) => {
  console.log("Cookies:",req.cookies)
});


app.use(express.json());
app.use(cookieParser());

app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
// const eventData = require("./events/index");
// eventData.getEvents()

// import routes
const sidebar = require("./controller/sidebar");
const TelegramChannel = require("./controller/telegramChannel");
const UserQ = require("./controller/userq");
const User = require("./controller/user");

const Events = require("./controller/eventController");


const CreateTable = require("./utils/createTable");

app.use("/api/v1/db", CreateTable);



app.use("/api/v2/sidebar", sidebar);
app.use("/api/v2/media", TelegramChannel);

app.use("/api/v2/userq", UserQ);
app.use("/api/v2/user", User);



app.use("/api/v2/events", Events);



console.log("objeddddct")


// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;