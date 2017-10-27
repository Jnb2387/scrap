var express = require("express");
var fs = require("fs");
var request = require("request");
var app = express();
var rp = require("request-promise");
var Promise = require("bluebird");


app.get("/scrape", function(req, res) {
  console.log("getting the data");
  var total = 29990;
  var x = 0;
  var y = 5000;
  var data = [];
  while (x < total) {
    // console.log("start x : " + x + "       start y : " + y);
    url =
      "http://services7.arcgis.com/WvgOaBfZeRNlBq3y/ArcGIS/rest/services/CS_Trails/FeatureServer/0/query?where=OBJECTID+BETWEEN+" +
      x +
      "+AND+" +
      y +
      "&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=";
    rp(url)
      .then(function(htmlString) {
        console.log("Request Sent");
       data.push(htmlString);
        console.log(data.length)
        var files = [];
        for (var i = 0; i < data.length; ++i) {
            files.push( fs.writeFileSync("../trails/trail" + i  + ".geojson", data[i], function(err) {
              console.log("data appended");          
            }));
        }
        Promise.all(files).then(function() {
            console.log("all the files were created");
        });
      })
      .catch(function(err) {
        console.log("shit fucked up", err);
      });
    y = y + 5000;
    x = x + 5000;
    // console.log("End   x : " + x + "       End y : " + y);
    
  }
 


  res.send("SCRAPEDDD");
});
app.listen("8081");
console.log("Running on 8081");
exports = module.exports = app;
