/**
 * Created by Administrator on 01/02/15.
 */
/*angular.module('MyApp')
    .controller('AddCtrl', ['$scope', '$alert', 'Show', function($scope, $alert, Show) {
        $scope.addShow = function() {
            Show.save({ showName: $scope.showName },
                function() {
                    $scope.showName = '';
                    $scope.addForm.$setPristine();
                    $alert({
                        content: 'TV show has been added.',
                        placement: 'top-right',
                        type: 'success',
                        duration: 3
                    });
                },
                function(response) {
                    $scope.showName = '';
                    $scope.addForm.$setPristine();
                    $alert({
                        content: response.data.message,
                        placement: 'top-right',
                        type: 'danger',
                        duration: 3
                    });
                });
        };
    }]);*/

angular.module('MyApp')
    .controller('AddDirCtrl', ['$scope', 'NewDir', function($scope, NewDir) {
        $scope.addNewDir = function() {
            NewDir.addNewDir({
                dirName: $scope.dirName
            });
        };
    }]);