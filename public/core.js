// public/core.js
var usMap = angular.module('usMap', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $scope.loginData = {
        username: '',
        password: ''
    };

    $scope.loginJira = function() {
        $http.post('/api/login', $scope.loginData)
            .success(function(data){
                console.log(data);
            })
            .error(function(data){
                console.log('Error: ' + data);
            })
    };

}
