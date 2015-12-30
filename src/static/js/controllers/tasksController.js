app.controller('TasksController', ['$scope', '$http', 'tasks', '$state', '$stateParams', '$log', 'taskService', '$location', 'ngProgressFactory', '$timeout', '$rootScope', 'cssInjector', '$filter', function($scope, $http, tasks, $state, $stateParams, $log, taskService, $location, ngProgressFactory, $timeout, $rootScope, cssInjector, $filter) {
    cssInjector.removeAll();  
    
    $scope.$watch('tasks', function (newValue, oldValue) {
        $rootScope.tasks = newValue;
    });
    
    var sourceIndex, sourceTask, targetIndex, targetTask;
    
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
        start: function (event, ui) {
            sourceTask = angular.element(ui.item).scope().task;
            sourceIndex = ui.item.index();
            
            $("[class*=fadeInForward]").removeClass(function(index, css){
                return (css.match (/(^|\s)fadeInForward-\S+/g) || []).join(' ');
            });
        },
        beforeStop: function(e, ui) {
            targetIndex = ui.item.index();
            targetTask = angular.element(ui.item).parent().find(".block-grid-item.ng-scope").eq(targetIndex+1).scope().task
            $http.put('/requests/taskorder/', {oldOrder: sourceTask.order, newOrder: targetTask.order}, {});
        }
    };
    
    $scope.$on('addTask', function(ev, args){
        $scope.$parent.refreshDashboard();
    });
    
    $scope.$on('deleteTask', function(ev, args){
        $scope.$parent.refreshDashboard();
    });
    
    if($stateParams.refresh==="true"){
        $scope.$parent.refreshTasks();
        $scope.$parent.notificationsStatus=true;
    }
    else{
        $scope.tasks=tasks;  
        $scope.tasks = $filter('orderBy')($scope.tasks, '+order');
    }
}]);