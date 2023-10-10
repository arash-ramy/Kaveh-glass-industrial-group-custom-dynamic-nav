const express = require("express");
require("dotenv").config({});
const cookieParser = require("cookie-parser");
const ejs = require("ejs");
const path = require("path")

const ErrorHandler = require("./middleware/error");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public/styles'));

console.log(path.join(__dirname, 'public'),"*************************") 
console.log(__dirname + '/public',"*************************") 



// app.use(cors({
//   origin: ['http://localhost:3000',],
//   credentials: true
// }));

app.get("/", (req, res) => {
  console.log("Cookies:", req.cookies);
});

app.use(express.json());
app.use(cookieParser());

app.get("/test", (req, res) => {
  res.render("posts.ejs", {
    // mascots: mascots,
    // tagline: tagline
  });
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
// const eventData = require("./events/index");
// eventData.getEvents()

// import routes
const sidebar = require("./controller/sidebar");
const TelegramChannel = require("./controller/telegramChannel");
const UserQ = require("./controller/userq");
const PostQ = require("./controller/postq");

const User = require("./controller/user");

const Events = require("./controller/eventController");

const CreateTable = require("./utils/createTable");
const Comment = require("./controller/comment");

app.use("/api/v1/db", CreateTable);

app.use("/api/v2/sidebar", sidebar);
app.use("/api/v2/media", TelegramChannel);

app.use("/api/v2/userq", UserQ);
app.use("/api/v2/postq", PostQ);

app.use("/api/v2/user", User);
app.use("/api/v2/comments", Comment);

app.use("/api/v2/events", Events);



const PostRenderQ = require("./render/postq");

console.log("objeddddct");


// Render
app.use("/posts", PostRenderQ);


// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
