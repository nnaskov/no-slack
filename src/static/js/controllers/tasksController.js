app.controller('TasksController', ['$scope', '$http', 'tasks', '$uibModal', function($scope, $http, tasks) {
    $scope.tasks=tasks;  
}]);