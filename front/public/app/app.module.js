var myApp = angular.module('myApp', ['ui.router']);

// define our canstant for the API
myApp.constant('constants', {
  URL: ipaddress,
  API_URL: ipaddress + '/api/v1'
});


// configure our routes
myApp.config(function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state({
    name: 'partidos',
    url: '/',
    templateUrl: '../public/app/partidos/partidos.template.html',
    controller: 'PartidoController'
  })

  $stateProvider.state({
    name: 'posiciones',
    url: '/posiciones',
    templateUrl: '../public/app/posiciones/posiciones.template.html',
    controller: 'PosicionController'
  })

  $stateProvider.state({
    name: 'noticias',
    url: '/noticias',
    templateUrl: '../public/app/noticias/noticias.template.html',
    controller: 'NoticiaController'
  })


});

myApp.directive('dateFormat', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attr, ngModelCtrl) {
      //Angular 1.3 insert a formater that force to set model to date object, otherwise throw exception.
      //Reset default angular formatters/parsers
      ngModelCtrl.$formatters.length = 0;
      ngModelCtrl.$parsers.length = 0;
    }
  };
});

myApp.run(['$rootScope', '$location', '$window', '$state', '$transitions', 'ligas',
  function ($rootScope, $location, $window, $state, $transitions, ligas) {

    /* $rootScope.socket = io.connect();
    $rootScope.socket.on('connect', function(data){
        console.log("connect")
    })
    */

    ligas.getAll().then(function (data) {
      $rootScope.liga = data.data[0];
    })

    $transitions.onStart({}, function (transitions) {
      var to = transitions.to().name;
      $rootScope.location = to;
    });
  }
]);