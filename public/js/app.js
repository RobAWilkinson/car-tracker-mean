angular
  .module('myApp',[])
  .controller('mainController', mainController);
  mainController.$inject = ['$http'];

  function mainController($http) {
    var mainCtrl = this;
    var accessToken = "1337";
    mainCtrl.text = 'rob';
    mainCtrl.car = {};
    mainCtrl.addCar = addCar;
    mainCtrl.cars;
    mainCtrl.logCars = function(){
      console.log(mainCtrl.cars);
    }
    mainCtrl.display = display;
    function addCar(car) {
      $http.post('/cars', car)
        .success(function(data,status) {
          mainCtrl.cars = data;
          console.log(data);
        })
        .error(function(data,status) {
          console.log(status);
        });
        getCars();
    }
    function getCars() {
      var cars;
      $http.get('/cars?access_token='+accessToken)
        .success(function(data,status) {
          mainCtrl.cars = data;
          console.log(data);
        })
        .error(function(data,status) {
          console.log(status);
        });
    }
    function display(car) {
      $http.get('cars/'+car._id)
        .success(function(data){
          mainCtrl.car = data;
        });
    }
    getCars();


  }

