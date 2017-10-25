var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  // url = 'http://services7.arcgis.com/WvgOaBfZeRNlBq3y/ArcGIS/rest/services/CS_Trails/FeatureServer/0/query?where=OBJECTID+BETWEEN+15000+AND+20000&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';
  // url2 = 'http://services7.arcgis.com/WvgOaBfZeRNlBq3y/ArcGIS/rest/services/CS_Trails/FeatureServer/0/query?where=OBJECTID+BETWEEN+20000+AND+25000&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';
  url3 = 'http://services7.arcgis.com/WvgOaBfZeRNlBq3y/ArcGIS/rest/services/CS_Trails/FeatureServer/0/query?where=OBJECTID+BETWEEN+25000+AND+30000&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';
  
  request(url3, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
    }
    fs.writeFile('../trails/trails25kto30k.json', html, function(err){
      console.log('20k done');
    })

    res.send('Check your console!')
  })
  // request(url2, function(error, response, html){
  //   if(!error){
  //     var $ = cheerio.load(html);
  //   }
  //   fs.writeFile('../trails/trails20kto25k.json', html, function(err){
  //     console.log('30k done');
  //   })

  // })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
