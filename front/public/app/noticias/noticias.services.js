myApp.factory('noticias', function ($http,constants) {
    return {

        get: function (liga) {
            return $http.get(constants.API_URL + '/public/noticias/' + liga);
        },
    };
});