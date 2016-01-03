/**
* The Member service retrieves basic house data for each user
* including house name, flatmates name, profile picture etc
*/
app.factory('memberService', function ($http, $q, $timeout) {
    return {
        getHouseData: function () {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: '/requests/house'
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