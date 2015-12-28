app.controller('TasksController', ['$scope', '$http', 'tasks', '$state', '$stateParams', '$log', 'taskService', '$location', 'ngProgressFactory', '$timeout', '$rootScope', 'cssInjector', function($scope, $http, tasks, $state, $stateParams, $log, taskService, $location, ngProgressFactory, $timeout, $rootScope, cssInjector) {
    cssInjector.removeAll();  
    
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
        'ui-floating': 'auto',
        tolerance: "pointer",
        scroll: "true",
        scrollSensitivity: 1,
        placeholder: "ui-state-highlight block-grid-item tile",
        revert: true,
        opacity: 0.5,
        forcePlaceholderSize: true,
        handle: ".handler",
        update: function(e, ui) {
            //the dragged tile
            $log.log(ui.item.sortable.model)
            /*
            position
            Type: Object
            The current position of the helper represented as { top, left }.
            
            originalPosition
            Type: Object
            The original position of the element represented as { top, left }
            */
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