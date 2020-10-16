myApp.factory('ligas', function ($http,constants) {
    var token = 'Bearer ' + localStorage.getItem('token');
    return {     
        getAll: function () {
            return $http.get(constants.API_URL + '/ligas',{
                headers: {'Authorization': token}
            });
        },
        save: function (object) {
            return $http.post(constants.API_URL + '/ligas', object ,{
                headers: {'Authorization': token}
            });
        },
        
        update: function (object) {
            return $http.put(constants.API_URL + '/ligas/' + object._id , object ,{
                headers: {'Authorization': token}
            });
        },
        
        remove: function (id) {
            return $http.delete(constants.API_URL + '/ligas/'+ id ,{
                headers: {'Authorization': token}
            });
        }
    };
});