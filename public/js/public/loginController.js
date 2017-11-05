'use strict';
function LoginCtrl($scope, $modal, $location, $translate, $compile, $window, UserService, AuthenticationService) {
  $scope.logIn = function logIn(username, password) {
            if (username !== undefined && password !== undefined) {

                UserService.logIn(username, password).then(function(res) {
                    //AuthenticationService.isLogged = true;
                    $window.sessionStorage.token = res.data.entity[0]['type'];
                    $location.path("/p/home");
                });
            }
        }


}
