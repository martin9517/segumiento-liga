myApp.controller('LoginController', function LoginController($scope, $state,auth) {
    document.body.className += ' ' + 'login-page';
    $scope.object = {};

    $scope.login = function(){
        $scope.error = null;
        auth.login($scope.object).then(function(data){
            localStorage.setItem('token', data.data.token);            
            $state.go("root")
        }).catch(function(error){
            $scope.error = error.data.message;            
        })
    }
});