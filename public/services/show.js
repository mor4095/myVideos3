/**
 * Created by Administrator on 01/02/15.
 */
angular.module('MyApp')
    .factory('Show', ['$resource', function($resource) {
        return $resource('/api/shows/:_id');
    }]);
