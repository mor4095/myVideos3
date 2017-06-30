/**
 * Created by Administrator on 01/02/15.
 */
angular.module('MyApp')
    .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'Show', 'Subscription',
        function($scope, $rootScope, $routeParams, Show, Subscription) {
            Show.get({ _id: $routeParams.id }, function(show) {
                $scope.show = show;
               
            });
        }]);
