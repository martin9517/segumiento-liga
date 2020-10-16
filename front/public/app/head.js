myApp.controller('HeadController', function HeadController($scope, $rootScope, $state, ligas) {

    $rootScope.changeLocation = function (path) {
        $rootScope.location = path;
        $state.go(path);
    }    

    ligas.getAll().then(function (data) {
        document.getElementsByClassName("initial-loader")[0].style.display = "none";
        $rootScope.liga = data.data[0];
        $scope.ligas = data.data;
    })

    $rootScope.selectLiga = function (o) {
        $rootScope.liga = o;
        $state.go($rootScope.location, {}, {reload: true});
    }
});