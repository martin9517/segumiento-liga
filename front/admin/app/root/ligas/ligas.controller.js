myApp.controller('LigasController', function LigasController($scope,ligas, uploads,constants) {

    const swalWithBootstrapButtons = constants.swalWithBootstrapButtons;
    $scope.pagination = {
        page: 1,
        perPage: 10,
        maxSize: 10
    }

    ligas.getAll().then(function (data) {
        $scope.objects = data.data;
        $scope.pagination.numPages = Math.ceil($scope.objects.length /$scope.pagination.perPage);
        $scope.loaded = true;
    })

    $scope.new = function(){
        $scope.object = {};
        $(function () {
            $("#principalColor").val("black");
            $("#principalColor").trigger('change');
            $('.my-colorpicker1').colorpicker({"color": "black"});
            $('.my-colorpicker1').trigger('change');

            $("#secundaryColor").val("black");
            $("#secundaryColor").trigger('change');
            $('.my-colorpicker2').colorpicker({"color": "white"});
            $('.my-colorpicker2').trigger('change');
        })
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
        $scope.object.colorPrimario = String(document.getElementById('principalColor').value);
        $scope.object.colorSecundario = String(document.getElementById('secundaryColor').value);
        if($scope.object._id){
            ligas.update($scope.object).then(function(data){
                ligas.getAll().then(function(data){
                    $scope.objects = data.data;
                    $scope.pagination.page = 1;
                    $scope.pagination.numPages = Math.ceil($scope.objects.length /$scope.pagination.perPage);
                    $scope.object = null;
                })
            })
        }
        else{
            ligas.save($scope.object).then(function(data){
                ligas.getAll().then(function(data){
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

        $(function () {
            $("#principalColor").val(o.colorPrimario);
            $("#principalColor").trigger('change');
            $('.my-colorpicker1').colorpicker({"color": o.colorPrimario});
            $('.my-colorpicker1').trigger('change');

            $("#secundaryColor").val(o.colorSecundario);
            $("#secundaryColor").trigger('change');
            $('.my-colorpicker2').colorpicker({"color": o.colorSecundario});
            $('.my-colorpicker2').trigger('change');
        })
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
                ligas.remove(o._id).then(function (data) {
                    ligas.getAll().then(function (data) {
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

    $scope.uploadImagen = function (files) {

        if (files.length > 0) {
            swalWithBootstrapButtons.fire({
                title: 'Subiendo imagen...',
                text: 'Esto puede tardar unos segundos',
                showCancelButton: false,
                showConfirmButton: false,
                closeOnConfirm: false, //It does close the popup when I click on close button
                closeOnCancel: false,
                allowOutsideClick: false
            });
            swalWithBootstrapButtons.showLoading();
            uploads.upload(files).then(function (data) {
                var files = data.data;
                files.forEach(element => {
                    $scope.object.icono = element
                });

                swalWithBootstrapButtons.close();
            }).catch(function (error) {
                swal.close();
                swalWithBootstrapButtons.fire(
                    'Error!',
                    'Ocurrió un error al subir la imagen',
                    'error'
                )
            })
        }
    }

    $scope.deleteImg = function(){
        if($scope.object.icono){        
            uploads.delete($scope.object.icono).then(function(data){
                $scope.object.icono = null;
            })            
        }   
    }
});