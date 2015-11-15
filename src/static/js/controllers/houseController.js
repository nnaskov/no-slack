app.controller('HouseController', ['$scope', '$http', 'houseData', 'tasks', function($scope, $http, houseData, tasks) {
    $scope.houseData = houseData;
    $scope.tasks = tasks;
}]);