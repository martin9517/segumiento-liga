myApp.factory('temporadas', function ($http,constants) {
    var token = 'Bearer ' + localStorage.getItem('token');
    return {     
        getAll: function () {
            return $http.get(constants.API_URL + '/temporadas',{
                headers: {'Authorization': token}
            });
        },
        save: function (object) {
            return $http.post(constants.API_URL + '/temporadas', object ,{
                headers: {'Authorization': token}
            });
        },
        
        update: function (object) {
            return $http.put(constants.API_URL + '/temporadas/' + object._id , object ,{
                headers: {'Authorization': token}
            });
        },
        
        remove: function (id) {
            return $http.delete(constants.API_URL + '/temporadas/'+ id ,{
                headers: {'Authorization': token}
            });
        },

        saveFecha: function (object) {
            return $http.post(constants.API_URL + '/fechas', object ,{
                headers: {'Authorization': token}
            });
        },

        removeFecha: function (id) {
            return $http.delete(constants.API_URL + '/fechas/'+ id ,{
                headers: {'Authorization': token}
            });
        },

        getPartidosByFecha: function (id) {
            return $http.get(constants.API_URL + '/fechas/' + id + '/partidos',{
                headers: {'Authorization': token}
            });
        },

        savePartido: function (object) {
            return $http.post(constants.API_URL + '/partidos', object ,{
                headers: {'Authorization': token}
            });
        },

        updatePartido:function (object) {
            return $http.put(constants.API_URL + '/partidos/' + object._id , object ,{
                headers: {'Authorization': token}
            });
        },

        getDetallesPartido: function (id) {
            return $http.get(constants.API_URL + '/partidos/getDetalles/' + id,{
                headers: {'Authorization': token}
            });
        },

        removeDetallePartido: function (detalle,partido) {
            return $http.delete(constants.API_URL + '/partidos/removeDetalle/'+ detalle  + '/' + partido,{
                headers: {'Authorization': token}
            });
        },

        removePartido: function (id) {
            return $http.delete(constants.API_URL + '/partidos/'+ id ,{
                headers: {'Authorization': token}
            });
        },
    };
});