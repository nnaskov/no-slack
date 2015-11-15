app.factory('memberService', function ($http, $q, $timeout) {
    return {
        getHouseData: function () {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: '/requests/member'
            }).then(function successCallback(response) {
                defer.resolve(response.data);
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            return defer.promise;
        }
    };
});