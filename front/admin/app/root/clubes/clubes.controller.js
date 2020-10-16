myApp.controller('ClubesController', function ClubesController($scope, clubes, canchas, ligas, uploads, constants) {

    const swalWithBootstrapButtons = constants.swalWithBootstrapButtons;
    $scope.pagination = {
        page: 1,
        perPage: 10,
        maxSize: 10
    }

    canchas.getAll().then(function (data) {
        $scope.canchas = data.data;
    })

    ligas.getAll().then(function (data) {
        $scope.ligas = data.data;
    })


    clubes.getAll().then(function (data) {
        $scope.objects = data.data;
        $scope.pagination.numPages = Math.ceil($scope.objects.length / $scope.pagination.perPage);
        $scope.loaded = true;
    })

    $scope.new = function () {
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
            $scope.pagination.numPages = Math.ceil($scope.objects.length / $scope.pagination.perPage);
        }
    }

    $scope.save = function () {
        if ($scope.object._id) {
            clubes.update($scope.object).then(function (data) {
                clubes.getAll().then(function (data) {
                    $scope.objects = data.data;
                    $scope.pagination.page = 1;
                    $scope.pagination.numPages = Math.ceil($scope.objects.length / $scope.pagination.perPage);
                    $scope.object = null;
                })
            })
        }
        else {
            clubes.save($scope.object).then(function (data) {
                clubes.getAll().then(function (data) {
                    $scope.objects = data.data;
                    $scope.pagination.page = 1;
                    $scope.pagination.numPages = Math.ceil($scope.objects.length / $scope.pagination.perPage);
                    $scope.object = null;
                })
            })
        }
    }

    $scope.edit = function (o) {
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
                clubes.remove(o._id).then(function (data) {
                    clubes.getAll().then(function (data) {
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

    $scope.back = function () {
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
                    $scope.object.escudo = element
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

    $scope.deleteImg = function () {
        if ($scope.object.escudo) {
            uploads.delete($scope.object.escudo).then(function (data) {
                $scope.object.escudo = null;
            })
        }
    }

    $scope.showJugadores = function (o) {
        $scope.club = o;
        $scope.importJugadores = false;
        $('#modalJugadores').modal()
        $('#modalJugadores').modal({ keyboard: false })
        $('#modalJugadores').modal('show');
    }

    $scope.openImport = function () {
        $scope.importJugadores = true;
        $scope.jugadores = [];
    }

    $scope.saveJugadores = function(){
        var requireProp = ['apellido', 'nombre'];


        $scope.result = $scope.jugadores.map(function (item) {
            var objProps = Object.keys(item)
            var totalProps = 0;

            var totalProps = 0;
            for (var i = 0; i < requireProp.length; i++) {
                if ((objProps.indexOf(requireProp[i]) != -1) && item[requireProp[i]]) {
                    totalProps++
                }
            }

            if (totalProps != requireProp.length) {
                item.incompleto = true;
            }
            return item;
        })

        for (var i = 0; i < $scope.result.length; i++) {
            $scope.result[i].club = $scope.club._id;
            if ($scope.result[i].incompleto) {
                $scope.result.splice(i, 1);
            }
        }
        if($scope.result.length > 0){
            var data = {
                club: $scope.club._id,
                jugadores: $scope.result
            }

            swalWithBootstrapButtons.fire({
                title: 'Importando...',
                text: 'Esto puede tardar unos segundos',
                showCancelButton: false,
                showConfirmButton: false,
                closeOnConfirm: false, //It does close the popup when I click on close button
                closeOnCancel: false,
                allowOutsideClick: false
            });
            swalWithBootstrapButtons.showLoading();

            clubes.importJugadores(data).then(function(data){
                swalWithBootstrapButtons.close();
                swalWithBootstrapButtons.fire(
                    'Importación exitosa!',
                    'Se han importado los jugadores correctamente',
                    'success'
                )
                $scope.club = data.data;
                $scope.jugadores = [];
            })
        }
    }

    $scope.backJugadores = function(){
        $scope.jugadores = null;
        $scope.importJugadores = false;
    }

});