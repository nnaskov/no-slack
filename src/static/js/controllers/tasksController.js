app.controller('TasksController', ['$scope', '$http', 'moment', 'tasks', '$uibModal', function($scope, $http, moment, tasks, $uibModal) {
    $scope.tasks=tasks;    
}]);