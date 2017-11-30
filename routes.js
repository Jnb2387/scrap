var express = require("express");
var router = express.Router(); //require the Router mini-app module
var csvgeocode = require("csvgeocode"); // the geocode module
var fs = require("fs"); //to read and write files
var rp = require("request-promise"); // to send http request and get promises back
var Promise = require("bluebird"); //more promise stuff

router.get("/", function(req, res) {
  var options = {
    root: __dirname + "/public/",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true
    }
  };
  var fileName = "home.html";
  res.sendFile(fileName, options);
});

router.get("/scrape", function(req, res) {
  res.sendFile(__dirname + "/public/" + "scrape.html");
});

//Route to Scrape for geojson
router.post("/scrape", function(req, res) {
  var inputx = parseInt(req.body.startobjectid);  
  var start = inputx;    
  var inputy = parseInt(req.body.endobjectid);
  var inputtotal = parseInt(req.body.total);
  var interval = parseInt(req.body.interval);
  var data = [];

  while (inputx < inputtotal) {
    // console.log(url);
    var url =
      "https://gis.ohiodnr.gov/arcgis/rest/services/OIT_Services/odnr_landbase_v3/MapServer/4/query?where=OBJECTID+BETWEEN+" +
      inputx +
      "+AND+" +
      inputy +
      "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&returnTrueCurves=false&resultOffset=&resultRecordCount=&f=pjson";
    rp(url)
      .then(function(htmlString) {
        console.log("Request #" + data.length + " Sent");
        data.push(htmlString);
        var files = [];
        console.log("JSON file created");         
        for (var i = 0; i < data.length; ++i) {
          files.push(
            fs.writeFileSync(
              "../scrape/results/guernseyparcels" + start + "_" + inputtotal + "_" + i + ".json",
              data[i],
              function(err) {
                console.log(err);
              }
            )
          );
        }
        return Promise.map(files, function (elem){
      }, {concurrency: 1})
      })
      .catch(function(err) {
        console.log("shit fucked up", err);
      });
    inputy += interval;
    inputx += interval;
    // console.log("End   x : " + inputx + "       End y : " + inputy);
  }
  // res.send("Scrapping");
});





router.get("/geocode", function(req, res) {
  console.log("Finding CSV File");
  var options = {
    url:
      "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/{{fulladdress}}.json?access_token=pk.eyJ1Ijoiam5iMjM4NyIsImEiOiJjajcwcTgxeWMwY3RkMzFtcWU2d3BxbWFkIn0.LWlSNqnmsFKuSy2kUwJOVA",
    //"url": "https://maps.googleapis.com/maps/api/geocode/json?address={{fulladdress}}&key=AIzaSyAhBkg12rvjJdJ3JQ_Heg6_2YdTNRmAmiw",
    delay: 0,
    force: true,
    // "handler": "google"
    handler: "mapbox"
  };
  //write to a file
  csvgeocode(
    "/Users/jnb23/Desktop/node-web-scraper/address.csv",
    "/Users/jnb23/Desktop/node-web-scraper//output.csv",
    options
  )
    .on("row", function(err, row) {
      if (err) {
        console.warn(err);
      }
      console.log("Located");
    })
    .on("complete", function(summary) {
      console.log(summary);
    });
  res.send("GEOCODING.....");
});
module.exports = router;
