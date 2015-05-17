var express = require('express');
var app = express();
var bodyParser = require('body-parser')
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
  var server = app.listen(3000, function() {
    console.log('this app is running');
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
    var newCar = new Car({ make: req.body.make, model: req.body.model, year: req.body.year });
    newCar.save();
    res.json(newCar);
  });
  app.get('/cars/:id', function(req,res) {
    Car.findById(req.params.id, function(err,car) {
      res.json(car);
    });
  });
});
