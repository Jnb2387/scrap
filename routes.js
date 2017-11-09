var express = require('express');
var router = express.Router();//require the Router mini-app module
var csvgeocode = require("csvgeocode");// the geocode module
var fs = require("fs"); //to read and write files
var rp = require("request-promise"); // to send http request and get promises back
var Promise = require("bluebird"); //more promise stuff

router.get("/", function (req, res) {
    var options = {
        root: __dirname + '/public/',
        //dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };
    
      var fileName = "home.html";
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log('Sent:', fileName);
        }
  });
});
  router.get("/scrape", function (req, res) {
    console.log("getting the data");
    var total = 60000;
    var x = 20600;
    var y = 25600;
    var data = [];
    while (x < total) {
      // console.log("start x : " + x + "       start y : " + y);
      var url = "https://utility.arcgis.com/usrsvcs/servers/219fd69ea8984aa69ef1cfe2ee68c69b/rest/services/CTS_TF_0_AllRoutesSegs_fsView/FeatureServer/0/query?where=OBJECTID+BETWEEN+" +
        x +
        "+AND+" +
        y +
        "&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="
  
      rp(url)
        .then(function (htmlString) {
          data.push(htmlString);
          console.log("Request #" + data.length + " Sent");
          var files = [];
          for (var i = 0; i < data.length; ++i) {
            files.push(
              fs.writeFileSync(
                "../trails/new/trails" + i + ".geojson",
                data[i],
                function (err) {
                  console.log("data appended");
                }
              )
            );
          }
          Promise.all(files).then(function () {
            console.log("geoJSON file created");
          });
        })
        .catch(function (err) {
          console.log("shit fucked up", err);
        });
      y += 5000;
      x += 5000;
      // console.log("End   x : " + x + "       End y : " + y);
    }
  
    res.send("SCRAPEDDD");
  });
  
  
  router.get("/geocode", function (req, res) {
    console.log("Finding CSV File");
    var options = {
      "url": "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/{{fulladdress}}.json?access_token=pk.eyJ1Ijoiam5iMjM4NyIsImEiOiJjajcwcTgxeWMwY3RkMzFtcWU2d3BxbWFkIn0.LWlSNqnmsFKuSy2kUwJOVA",
      //"url": "https://maps.googleapis.com/maps/api/geocode/json?address={{fulladdress}}&key=AIzaSyAhBkg12rvjJdJ3JQ_Heg6_2YdTNRmAmiw",
      "delay": 0,
      "force": true,
      // "handler": "google"
      "handler": "mapbox"
    };
    //write to a file
    csvgeocode("/Users/jnb23/Desktop/node-web-scraper/address.csv", "/Users/jnb23/Desktop/node-web-scraper//output.csv", options)
      .on("row", function (err, row) {
        if (err) {
          console.warn(err);
        }
        console.log("Located");
      }).on("complete", function (summary) {
        console.log(summary);
      });
    res.send("GEOCODING.....");
  
  });
  module.exports = router