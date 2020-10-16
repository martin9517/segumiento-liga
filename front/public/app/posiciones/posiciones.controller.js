myApp.controller('PosicionController', function PosicionController($scope, $rootScope, posiciones, ligas) {

    if (!$rootScope.liga) {
        ligas.getAll().then(function (data) {
            $rootScope.liga = data.data[0];

            posiciones.getTempordas($rootScope.liga._id).then(function (data) {
                $scope.temporadas = data.data;
                if ($scope.temporadas.length > 0) {
                    posiciones.get($scope.temporadas[0]._id, $rootScope.liga._id).then(function (data) {
                        $scope.posiciones = data.data;
                        $scope.loaded = true;
                    })
                }
            })
        })
    }
    else {
        posiciones.getTempordas($rootScope.liga._id).then(function (data) {
            $scope.temporadas = data.data;
            if ($scope.temporadas.length > 0) {
                posiciones.get($scope.temporadas[0]._id, $rootScope.liga._id).then(function (data) {
                    $scope.posiciones = data.data;                   
                })
            }
            $scope.loaded = true;
        })
    }



    $scope.changeTemporada = function (o) {
    }
});