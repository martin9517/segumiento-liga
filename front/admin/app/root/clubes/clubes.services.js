myApp.factory('clubes', function ($http,constants) {
    var token = 'Bearer ' + localStorage.getItem('token');
    return {     
        getAll: function () {
            return $http.get(constants.API_URL + '/clubes',{
                headers: {'Authorization': token}
            });
        },
        save: function (object) {
            return $http.post(constants.API_URL + '/clubes', object ,{
                headers: {'Authorization': token}
            });
        },
        
        update: function (object) {
            return $http.put(constants.API_URL + '/clubes/' + object._id , object ,{
                headers: {'Authorization': token}
            });
        },
        
        remove: function (id) {
            return $http.delete(constants.API_URL + '/clubes/'+ id ,{
                headers: {'Authorization': token}
            });
        },
        
        getByLiga: function (liga) {
            return $http.get(constants.API_URL + '/clubes/findByLiga/' + liga,{
                headers: {'Authorization': token}
            });
        },

        importJugadores: function (object) {
            return $http.post(constants.API_URL + '/clubes/importJugadores', object ,{
                headers: {'Authorization': token}
            });
        },
    };
});