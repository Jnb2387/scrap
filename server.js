var express = require("express"); //for routes
var app = express(); //create an express app
var router = require("./routes"); //where all the routes are.
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use("/", router);// all the routes are pass as middleware

app.listen("8081");
console.log("Running on 8081");
exports = module.exports = app;
