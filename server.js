var express = require("express"); //for routes
var cors = require('cors')
var app = express(); //create an express app
var router = require("./routes"); //where all the routes are.
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/", router);// all the routes are pass as middleware

app.listen("8081");
console.log("Running on 8081");
exports = module.exports = app;
