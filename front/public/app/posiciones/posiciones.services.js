myApp.factory('posiciones', function ($http,constants) {
    return {     
        getTempordas: function (liga) {
            return $http.get(constants.API_URL + '/public/temporadas/' + liga);
        },

        get: function (temporada,liga) {
            return $http.get(constants.API_URL + '/public/posiciones/' + temporada + '/' + liga);
        },
    };
});