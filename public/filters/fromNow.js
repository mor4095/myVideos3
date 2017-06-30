/**
 * Created by Administrator on 01/02/15.
 */
angular.module('MyApp').
    filter('fromNow', function() {
        return function(date) {
            return moment(date).fromNow();
        }
    });
