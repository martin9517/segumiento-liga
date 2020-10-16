myApp.factory('partidos', function ($http,constants) {
    return {     
        getAll: function (liga) {
            return $http.get(constants.API_URL + '/public/partidos/' + liga);
        },
    };
});