/**
 * Created by Administrator on 02/02/15.
 */
angular.module('MyApp')
    .controller('SignupCtrl', ['$scope', 'Auth', function($scope, Auth) {
        $scope.signup = function() {
            Auth.signup({
                email: $scope.email,
                password: $scope.password
            });
        };
    }]);