/**
 * Created by Administrator on 02/02/15.
 */
angular.module('MyApp')
    .controller('NavbarCtrl', ['$scope', 'Auth', function($scope, Auth) {
        $scope.logout = function() {
            Auth.logout();
        };
    }]);
