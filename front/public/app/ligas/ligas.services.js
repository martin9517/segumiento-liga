myApp.factory('ligas', function ($http,constants) {
    return {     
        getAll: function () {
            return $http.get(constants.API_URL + '/public/ligas');
        },
    };
});