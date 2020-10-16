myApp.controller('NoticiaController', function NoticiaController($scope, $rootScope, noticias, ligas) {

    $scope.indiceCarousel = 0;

    if(!$rootScope.liga){
        ligas.getAll().then(function (data) {
            $rootScope.liga = data.data[0];
    
            noticias.get($rootScope.liga._id).then(function(data){
                $scope.noticias = data.data;
                $scope.loaded = true;
            })    
        })
    }
    else{
        noticias.get($rootScope.liga._id).then(function(data){
            $scope.noticias = data.data;
            $scope.loaded = true;
        })    
    }

    $scope.openNoticia = function(o){
        $scope.indiceCarousel = 0;
        $scope.noticia = o;
        $('.carousel').carousel({
            interval: 2000,
            keyboard: true
        })
    }
    
    $scope.back = function(){
        $scope.noticia = null;
    }
});