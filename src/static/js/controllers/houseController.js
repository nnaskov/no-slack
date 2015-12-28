app.controller('HouseController', ['$scope', '$http', 'houseData', 'tasks', 'cssInjector', function($scope, $http, houseData, tasks, cssInjector) {
    $scope.houseData = houseData;
    $scope.tasks = tasks;
    
    cssInjector.removeAll();
    cssInjector.add("../static/bower_components/angular-chart.js/dist/angular-chart.min.css");
}]);