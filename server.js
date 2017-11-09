var express = require("express"); //for routes
var app = express(); //create an express app
var router = require("./routes"); //where all the routes are.

app.use("/", router);// all the routes are pass as middleware

app.listen("8081");
console.log("Running on 8081");
exports = module.exports = app;
