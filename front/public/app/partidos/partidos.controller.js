myApp.controller('PartidoController', function PartidoController($scope,$rootScope,ligas,partidos) {
    
    if(!$rootScope.liga){
        ligas.getAll().then(function (data) {
            $rootScope.liga = data.data[0];
    
            partidos.getAll($rootScope.liga._id).then(function(data){
                if(data.data[0]){
                    $scope.fechas = data.data[0].fechas;
                }            
                $scope.loaded = true;
            })
        })
    }
    else{
        partidos.getAll($rootScope.liga._id).then(function(data){
            if(data.data[0]){
                $scope.fechas = data.data[0].fechas;
            }            
            $scope.loaded = true;
        })
    }

    


    $scope.getFecha = function(f){
        var d = new Date(f);
        var weekday = new Array(7);
        weekday[0] = "Dom.";
        weekday[1] = "Lun.";
        weekday[2] = "Mar.";
        weekday[3] = "Mier.";
        weekday[4] = "Jue.";
        weekday[5] = "Vie.";
        weekday[6] = "Sab.";
        
        var day = weekday[d.getDay()];

        return day;
    }
});