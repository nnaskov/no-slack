app.controller('TasksController', ['$scope', '$http', 'tasks', '$state', '$stateParams', '$log', 'taskService', '$location', 'ngProgressFactory', '$timeout' , function($scope, $http, tasks, $state, $stateParams, $log, taskService, $location, ngProgressFactory, $timeout) {
    
    $scope.refreshTasks = function(){
        taskService.getTasks().then(function(tasks){
            $scope.tasks = tasks;
            $location.search({});
        });
    }
    
    $scope.refreshDashboard = function(){
        $state.transitionTo('dashboard', {refresh:"true"}, { 
            reload: true, inherit: true, notify: true
        });
    }
    
    $scope.$on('addTask', function(ev, args){
        $scope.refreshDashboard();
    });
    
    $scope.$on('deleteTask', function(ev, args){
        $scope.refreshDashboard();
    });
    
    if($stateParams.refresh==="true"){
        $scope.refreshTasks();
    }
    else{
        $scope.tasks=tasks;  
    }
}]);