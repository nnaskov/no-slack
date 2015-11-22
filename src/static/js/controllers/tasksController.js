app.controller('TasksController', ['$scope', '$http', 'moment', 'tasks', '$uibModal', function($scope, $http, moment, tasks) {
    $scope.tasks=tasks;  
}]);