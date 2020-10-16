myApp.controller('RootController', function RootController($scope, $state, $rootScope) {

    $rootScope.changeLocation = function (path) {
        $rootScope.location = path;
        $state.go(path);
      }

    $scope.logout = function () {
        localStorage.clear();
        $state.go("login")
    }

});