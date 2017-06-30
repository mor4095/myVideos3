/**
 * Created by Administrator on 01/02/15.
 */

angular.module('MyApp')
    .controller('AddDirCtrl', ['$scope', 'NewDir', function($scope, NewDir) {
        $scope.addNewDir = function() {
            NewDir.addNewDir({
                dirName: $scope.dirName
            });
        };
    }]);