myApp.controller('TemporadasController', function TemporadasController($scope,temporadas, ligas, clubes,constants) {

    const swalWithBootstrapButtons = constants.swalWithBootstrapButtons;
    $scope.pagination = {
        page: 1,
        perPage: 10,
        maxSize: 10
    }

    ligas.getAll().then(function (data) {
        $scope.ligas = data.data;
    })

    temporadas.getAll().then(function (data) {
        $scope.objects = data.data;
        $scope.pagination.numPages = Math.ceil($scope.objects.length /$scope.pagination.perPage);
        $scope.loaded = true;
    })

    $scope.new = function(){
        $scope.object = {};
    }

    $scope.filtering = function () {
        if ($scope.textFilter.length > 0) {
            $scope.pagination.page = 1;
            $scope.pagination.perPage = $scope.objects.length;
            $scope.pagination.numPages = 1; 
        }
        else {
            $scope.pagination = constants.pagination;
            $scope.pagination.perPage = 10;
            $scope.pagination.numPages = Math.ceil($scope.objects.length /$scope.pagination.perPage);
        }
    }

    $scope.save = function(){
        if($scope.object._id){
            temporadas.update($scope.object).then(function(data){
                temporadas.getAll().then(function(data){
                    $scope.objects = data.data;
                    $scope.pagination.page = 1;
                    $scope.pagination.numPages = Math.ceil($scope.objects.length /$scope.pagination.perPage);
                    $scope.object = null;
                })
            })
        }
        else{
            temporadas.save($scope.object).then(function(data){
                temporadas.getAll().then(function(data){
                    $scope.objects = data.data;
                    $scope.pagination.page = 1;
                    $scope.pagination.numPages = Math.ceil($scope.objects.length /$scope.pagination.perPage);
                    $scope.object = null;
                })
            })
        }
    }

    $scope.edit = function(o){
        $scope.object = o;
    }

    $scope.remove = function (o) {
        swalWithBootstrapButtons.fire({
            title: '¿Esta seguro que desea eliminar?',
            text: "",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                temporadas.remove(o._id).then(function (data) {
                    temporadas.getAll().then(function (data) {
                        $scope.objects = data.data;
                        swalWithBootstrapButtons.fire(
                            'Eliminado!',
                            'El objeto a sido eliminado',
                            'success'
                        )
                    })                    
                }).catch(function (data) {
                    swalWithBootstrapButtons.fire(
                        'Error al eliminar objeto',
                        'No es posible eliminar el objeto',
                        'error'
                    )
                });
            }
        })
    }

    $scope.back = function(){
        $scope.object = null;
    }

    $scope.openFechas = function(o){
        $scope.temporada = o;
        $scope.fecha = null;
        $('#modalFechas').modal()
        $('#modalFechas').modal({ keyboard: false })
        $('#modalFechas').modal('show');
        clubes.getByLiga(o.liga._id).then(function(data){
            $scope.clubes = data.data
        })
    }

    $scope.addFecha = function(){
        $scope.fecha = {};
    }

    $scope.saveFecha = function(){
        $scope.fecha.temporada = $scope.temporada._id;
        temporadas.saveFecha($scope.fecha).then(function(data){            
            $scope.temporada = data.data;
            $scope.fecha = null;
        })
    }

    $scope.removeFecha = function(o,indice){
        swalWithBootstrapButtons.fire({
            title: '¿Esta seguro que desea eliminar?',
            text: "",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                temporadas.removeFecha(o._id).then(function (data) {
                    $scope.temporada.fechas.splice(indice,1);
                })
            }
        })
    }

    $scope.showPartidos = function(o){        
        temporadas.getPartidosByFecha(o._id).then(function(data){
            $scope.fechaSelected = data.data;
            $scope.partidos = [];
            $('#modalPartidos').modal()
            $('#modalPartidos').modal({ keyboard: false })
            $('#modalPartidos').modal('show');
        })        
    }

    $scope.addPartido = function(){
        $scope.partidos.push({});
    }
    
    $scope.removePartido = function(indice){
        $scope.partidos.splice(indice,1)
    }

    $scope.savePartido = function(p,index){
        p.fecha = $scope.fechaSelected._id;
        temporadas.savePartido(p).then(function(data){
            $scope.partidos.splice(index,1)
            $scope.fechaSelected = data.data;
        })
    }

    $scope.deletePartido = function(p,index){
        temporadas.removePartido(p._id).then(function(data){
            $scope.fechaSelected.partidos.splice(index,1);
        })
    }

    $scope.openDetalle = function(p){
        temporadas.getDetallesPartido(p._id).then(function(data){
            $scope.detalleLocal = {};
            $scope.detalleVisitante = {};
            p.detalles = data.data;
            $scope.partido = p;
            $scope.partido.fechaPartido = new Date(p.fechaPartido)
            $('#modalPartidoDetalle').modal()
            $('#modalPartidoDetalle').modal({ keyboard: false })
            $('#modalPartidoDetalle').modal('show');
        })        
    }

    $scope.addDetalle = function(o,tipo){    
        o.randomId =  makeid(10);
        if(tipo == 1){
            o.tipo = 1;
            $scope.partido.detalles.push(o);
            $scope.detalleLocal = {};
        }
        if(tipo == 2){
            o.tipo = 2;
            $scope.partido.detalles.push(o);
            $scope.detalleVisitante = {};
        }
    }

    $scope.removeDetalle = function(o){
        if(!o._id){
            var index = 0;
            $scope.partido.detalles.forEach(element => {
                if(o.randomId == element.randomId){
                    $scope.partido.detalles.splice(index,1)
                }
                index++;
            });
        }
        else{
            temporadas.removeDetallePartido(o._id,$scope.partido._id).then(function(data){
                $scope.partido.detalles.forEach(function(element,index) {
                    if(element._id == o._id){
                        $scope.partido.detalles.splice(index,1);
                    }
                });
            })
        }
    }

    $scope.updatePartido = function(){
        temporadas.updatePartido($scope.partido).then(function(d){            
            temporadas.getDetallesPartido($scope.partido._id).then(function(data){
                $scope.partido = d.data;
                $scope.partido.detalles = data.data;
                $scope.partido.fechaPartido = new Date(d.data.fechaPartido);
                swalWithBootstrapButtons.fire(
                    'Datos del partido actualizados',
                    'Se han actualizado los datos del partido',
                    'success'
                )
            })
        })
    }

    $scope.closeDetalle = function(){
        temporadas.getPartidosByFecha($scope.fechaSelected._id).then(function(data){
            $scope.fechaSelected = data.data;
            $scope.partidos = [];
            $('#modalPartidoDetalle').modal('hide')
        })  
    }

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
});