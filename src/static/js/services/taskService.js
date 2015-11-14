app.factory('taskService', function ($http, $q, $timeout) {
    return {
        loadTasks: function (data) {
            var defer = $q.defer();

            $http({
                method: 'GET',
                url: '/requests/task'
            }).then(function successCallback(response) {
                // successful http request, resolve after two seconds
                $timeout(function() {
                    defer.resolve(response);
                }, 500)
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            return defer.promise;
        }

    };
}
           );