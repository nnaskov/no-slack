app.controller('TasksController', ['$scope', '$http', 'tasks', '$state', '$stateParams', '$log', 'taskService', '$location', 'ngProgressFactory', '$timeout' , function($scope, $http, tasks, $state, $stateParams, $log, taskService, $location, ngProgressFactory, $timeout) {
    if($stateParams.refresh==="true"){
        taskService.getTasks().then(function(tasks){
            $scope.tasks = tasks;
            $location.search({});
        });
    }
    else{
        $scope.tasks=tasks;  
    }
}]);