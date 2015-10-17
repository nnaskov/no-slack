app.controller('TasksController', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/requests/getalltasks'
    }).then(function successCallback(response) {
        $scope.list = response.data;
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
}]);

