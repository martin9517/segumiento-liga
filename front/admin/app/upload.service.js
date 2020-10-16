myApp.factory('uploads', function ($http,constants) {
    var token = 'Bearer ' + localStorage.getItem('token');
    return {              
        
        upload:function(files){
            var fd = new FormData();
            files.forEach(element => {
                fd.append('files', element);
            });

            return $http({
                method: 'POST',
                url: constants.API_URL + '/uploads',
                data: fd,
                headers: {'Content-Type': undefined, 'Authorization': token}
            })
        },

        delete: function(file){
            return $http.get(constants.API_URL + '/uploads/delete/' + file.filename,{
                headers: {'Authorization': token}
            })
        }
        
    };
});