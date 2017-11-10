var express = require('express');
var router = express.Router();//require the Router mini-app module
var csvgeocode = require("csvgeocode");// the geocode module
var fs = require("fs"); //to read and write files
var rp = require("request-promise"); // to send http request and get promises back
var Promise = require("bluebird"); //more promise stuff

router.get("/", function (req, res) {
  var options = {
    root: __dirname + '/public/',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  var fileName = "home.html";
  res.sendFile(fileName, options);
});

router.get("/scrape", function(req,res){
  res.sendFile(__dirname + "/public/" + "scrape.html");
})

//Route to Scrape for geojson
router.post("/scrape", function (req, res) {
  // var inputurl =req.body.scrapeurl;
  // var startobjectid =parseInt(req.body.startobjectid);
  // var endobjectid =parseInt(req.body.endobjectid);
  // var total =parseInt(req.body.total);
  // var interval =parseInt(req.body.interval);
  //to get the count
  // rp("https://services2.arcgis.com/VXHf6kKM5DRjswCH/ArcGIS/rest/services/NewGrids/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnHiddenFields=false&returnGeometry=false&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=true&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=")
  // .then(function(response){
// var res=JSON.parse(response)
//     console.log(res.properties.count)
//   })
//   while (startobjectid < total) {
//       endobjectid += interval;
//       startobjectid+=interval;
//       console.log("end : " +endobjectid + "       start : " + startobjectid);
// }

  var total = 62251;		
 var x = 1;		
 var y = 500;	
   var data = [];	
   while (x < total) {
    var AransasTXurl ="https://webmap.trueautomation.com/arcgis/rest/services/BurnetMapSearch/MapServer/7/query?where=Objectid>="+ x +
    "+AND+objectid<=" +
   y +
   "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson"
  console.log(AransasTXurl)

// var url = "https://utility.arcgis.com/usrsvcs/servers/219fd69ea8984aa69ef1cfe2ee68c69b/rest/services/CTS_TF_0_AllRoutesSegs_fsView/FeatureServer/0/query?where=OBJECTID+BETWEEN+" +
//       x +
//       "+AND+" +
//       y +
//       "&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="
    rp(AransasTXurl)
      .then(function (htmlString) {
        console.log("Request #" + data.length + " Sent");        
        data.push(htmlString);
        var files = [];
        for (var i = 0; i < data.length; ++i) {
          files.push(
            fs.writeFileSync(
              //"../trails/new/trails" + i + ".geojson",
              "../scrape/results/burnetparcels" + i + ".json",
              data[i],
              function (err) {
                console.log(err);
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
    y += 500;
    x += 500;
    // console.log("End   x : " + x + "       End y : " + y);
    }
  res.send("Scrapping")
  
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
