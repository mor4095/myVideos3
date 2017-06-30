/**
 * Created by Administrator on 04/02/15.
 */
angular.module('MyApp')
    .factory('NewDir', ['$http', '$location', '$rootScope', '$cookieStore', '$alert',
        function($http, $location, $rootScope, $cookieStore, $alert) {

            return {
                addNewDir: function(dirName) {
                    return $http.post('/api/addNewDir', dirName)
                        .success(function() {

                            $alert({
                                title: 'Cheers!',
                                content: 'You have successfully Added new Directory.',
                                placement: 'top-right',
                                type: 'success',
                                duration: 3
                            });
                        })
                        .error(function() {
                            $alert({
                                title: 'Error!',
                                content: 'Invalid Directory.',
                                placement: 'top-right',
                                type: 'danger',
                                duration: 3
                            });
                        });


                }

            };

        }]);
