myApp.controller('CanchasController', function CanchasController($scope,canchas,constants) {

    const swalWithBootstrapButtons = constants.swalWithBootstrapButtons;
    $scope.pagination = {
        page: 1,
        perPage: 10,
        maxSize: 10
    }

    canchas.getAll().then(function (data) {
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
            canchas.update($scope.object).then(function(data){
                canchas.getAll().then(function(data){
                    $scope.objects = data.data;
                    $scope.pagination.page = 1;
                    $scope.pagination.numPages = Math.ceil($scope.objects.length /$scope.pagination.perPage);
                    $scope.object = null;
                })
            })
        }
        else{
            canchas.save($scope.object).then(function(data){
                canchas.getAll().then(function(data){
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
                canchas.remove(o._id).then(function (data) {
                    canchas.getAll().then(function (data) {
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
});