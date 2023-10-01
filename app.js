const express = require("express");
require("dotenv").config({
});

const ErrorHandler = require("./middleware/error");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors({
  origin: ['http://localhost:3000',],
  credentials: true
}));

app.use(express.json());
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config


// import routes
const sidebar = require("./controller/sidebar");
const TelegramChannel = require("./controller/telegramChannel");
const User = require("./controller/user");

app.use("/api/v2/sidebar", sidebar);
app.use("/api/v2/media", TelegramChannel);
app.use("/api/v2/user", User);

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;