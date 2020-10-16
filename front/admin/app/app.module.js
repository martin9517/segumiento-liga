var myApp = angular.module('myApp', ['ui.router','ui.select','simplePagination','ui.bootstrap','ngFileUpload','ngHandsontable']);

// define our canstant for the API
myApp.constant('constants', {
    URL: ipaddress,
    API_URL: ipaddress + '/api/v1',
    swalWithBootstrapButtons: Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false,
    }),
});

myApp.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

// configure our routes
myApp.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider.state({
        name: 'root',
        url: '/',
        templateUrl: 'app/root/root.template.html',
        controller: 'RootController'
    })

    $stateProvider.state({
        name: 'root.jugadores',
        url: 'jugadores',
        templateUrl: 'app/root/jugadores/jugadores.template.html',
        controller: 'JugadoresController'
    })

    $stateProvider.state({
        name: 'root.clubes',
        url: 'clubes',
        templateUrl: 'app/root/clubes/clubes.template.html',
        controller: 'ClubesController'
    })

    $stateProvider.state({
        name: 'root.canchas',
        url: 'canchas',
        templateUrl: 'app/root/canchas/canchas.template.html',
        controller: 'CanchasController'
    })

    $stateProvider.state({
        name: 'root.ligas',
        url: 'ligas',
        templateUrl: 'app/root/ligas/ligas.template.html',
        controller: 'LigasController'
    })

    $stateProvider.state({
        name: 'root.temporadas',
        url: 'temporadas',
        templateUrl: 'app/root/temporadas/temporadas.template.html',
        controller: 'TemporadasController'
    })

    $stateProvider.state({
        name: 'root.noticias',
        url: 'noticias',
        templateUrl: 'app/root/noticias/noticias.template.html',
        controller: 'NoticiaController'
    })

    
    $stateProvider.state({
        name: 'root.usuarios',
        url: 'usuarios',
        templateUrl: 'app/root/usuarios/usuarios.template.html',
        controller: 'UsuarioController'
    })

    $stateProvider.state({
        name: 'login',
        url: '/login',
        templateUrl: 'app/login/login.template.html',
        controller: 'LoginController'
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

myApp.run(['$rootScope', '$location', '$state', '$transitions', 'auth',
    function ($rootScope, $location, $state, $transitions, auth) {

        /* $rootScope.socket = io.connect();
        $rootScope.socket.on('connect', function(data){
            console.log("connect")
        })
        */
        $transitions.onStart({}, function (transitions) {
            var to = transitions.to().name;
            $rootScope.location = to;
            var token = localStorage.getItem('token');
            if (token) {
                auth.checkToken({ token: token }).then(function (data) {
                    if (data.data.status && data.data.user) {
                        $rootScope.user = data.data.user;
                        if (to == "login") {
                            $state.go("root");
                        }
                    }
                    else {
                        localStorage.clear();
                        $state.go("login");
                    }
                }).catch(function (error) {
                    localStorage.clear();
                    $state.go("login");
                })
            }
            else {
                localStorage.clear();
                $state.go("login");
            }

        });
    }
]);