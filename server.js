var express = require('express');
var util = require('util');
var app = express();
var bodyParser = require('body-parser')
var request = require('request');
app.use(bodyParser.json())
var mongo = require('mongoose');
mongo.connect('mongodb://localhost:27017/');
var db = mongo.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  var carSchema = mongo.Schema({
    make: String,
    model: String,
    year: Number
  });
  var Car = mongo.model('Car', carSchema);
  app.use(express.static('public'));
  var http = require('http');
  app.use('/cars', function(req, res, next){
    if (req.query.access_token == "1337"){
      next();
    } else {
      res.end("Sorry Buster, access denied");
    }
  });
  app.get('/cars', function(req, res) {
    Car.find(function(err, cars){
      if(err) { 
        return console.error(err); 
      } else{
        res.json(cars);
      }
    });
  });
  app.post('/cars', function(req, res) {
    request("http://www.carqueryapi.com/api/0.3/?callback=?&cmd=getMakes&year="+req.body.year,function(err, res, body){
      data = res.body.substring(4, res.body.length -2);
      data = JSON.parse(data);
      makes = data["Makes"];
      var output = [];
      for (var i = 0; i < makes.length; i++) {
        if(makes[i]['make_display'].toLowerCase() == req.body.make.toLowerCase()) {
          output.push(makes[i]);
        }
      }
      output.forEach(function(elem) {
        request("http://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make="+elem['make_id']+"&year="+req.body.year, function(err, res, body) {
          var cars  = [];
          data = res.body.substring(4, res.body.length -2);
          data = JSON.parse(data);
          dataArray = data['Trims'];
          for(var i = 0; i < dataArray.length; i++) {
            console.log(dataArray[i]['model_name'].toLowerCase());
            util.inspect(req.body.model.toLowerCase());
            //console.log(i + " : " + dataArray[i].model_name.toLowerCase + " : " + res.body.model);
            //if( dataArray[i].model_name == res.body.model.toLowerCase()) {
            //cars.push(dataArray[i]);
            //}
          }
        });
      });

    });

    var newCar = new Car({ make: req.body.make, model: req.body.model, year: req.body.year });
    newCar.save();
    res.json(newCar);
  });
  app.get('/cars/:id', function(req,res) {
    Car.findById(req.params.id, function(err,car) {
      res.json(car);
    });
  });
  var server = app.listen(3000, function() {
    console.log('this app is running');
  });
});
