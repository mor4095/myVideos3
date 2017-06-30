/**
 * Created by Administrator on 02/02/15.
 */
angular.module('MyApp')
    .controller('LoginCtrl', ['$scope', 'Auth', function($scope, Auth) {
        $scope.login = function() {
            Auth.login({
                email: $scope.email,
                password: $scope.password
            });
        };
    }]);
