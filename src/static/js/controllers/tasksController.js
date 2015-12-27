app.controller('TasksController', ['$scope', '$http', 'tasks', '$state', '$stateParams', '$log', 'taskService', '$location', 'ngProgressFactory', '$timeout', '$rootScope', function($scope, $http, tasks, $state, $stateParams, $log, taskService, $location, ngProgressFactory, $timeout, $rootScope) {
    
    $scope.$watch('tasks', function (newValue, oldValue) {
        $rootScope.tasks = newValue;
    });
    
    $scope.refreshTasks = function(){
        taskService.getTasks().then(function(tasks){
            $scope.tasks = tasks;
            $location.search({});
        });
    }
    
    $scope.sortableOptions = {
        items: ".block-grid-item:not(.not-sortable)",
        update: function(e, ui) {
            //the dragged tile
            $log.log(ui.item.sortable.model)
        }
    };
    
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