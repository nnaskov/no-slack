app.controller('TasksController', ['$scope', '$http', 'moment', 'tasks', function($scope, $http, moment, tasks) {
    $scope.tasks=tasks;
}]);