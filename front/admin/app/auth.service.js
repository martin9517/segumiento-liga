myApp.factory('auth', function ($http,constants) {
    return {     
        login: function (object) {
            return $http.post(constants.API_URL + '/auth/login', object);
        },

        checkToken: function(object){
            return $http.post(constants.API_URL + '/checkToken', object);
        }
    };
});