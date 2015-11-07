app.controller('MembersController', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/requests/member'
    }).then(function successCallback(response) {
    	var data = response.data;
        $scope.list = response.data;
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
}]);