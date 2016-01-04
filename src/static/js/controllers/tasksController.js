/**
* The Tasks Controller manages the element who contains all the tasks on the dashboard
* It takes care of sorting the tasks, reordering them as well as reacting appropriately to
* the addition and deletion of tasks
* see: partials/dashboard.html
*/
app.controller('TasksController', ['$scope', '$http', 'tasks', '$state', '$stateParams', '$log', 'taskService', '$location', 'ngProgressFactory', '$timeout', '$rootScope', 'cssInjector', '$filter', function($scope, $http, tasks, $state, $stateParams, $log, taskService, $location, ngProgressFactory, $timeout, $rootScope, cssInjector, $filter) {
    //remove unnecessary css
    cssInjector.removeAll();  
    //makes sure we have the latest task data
    $scope.$watch('tasks', function (newValue, oldValue) {
        $rootScope.tasks = newValue;
    });
    //keeps track of the initial position of the tile before
    // reordering and his position after dropping it
    var sourceIndex, sourceTask, targetIndex, targetTask;
    /**
    * using ui.sortable to
    * make the task tiles sortable
    * see https://github.com/angular-ui/ui-sortable for more details
    */
    $scope.sortableOptions = {
        //this css selector makes sure we exclude the add task tile from the sortable tiles
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
        //we determine the initial position of the tile moved when the start event fires
        start: function (event, ui) {
            sourceTask = angular.element(ui.item).scope().task;
            sourceIndex = ui.item.index();
            //remove animations from task tiles in between dragging and dropping to remove animation glitch
            $("[class*=fadeInForward]").removeClass(function(index, css){
                return (css.match (/(^|\s)fadeInForward-\S+/g) || []).join(' ');
            });
        },
        //we determine the new position of the dragged tile slightly before dropping it
        beforeStop: function(e, ui) {
            targetIndex = ui.item.index();
            //dont do anything if after drag&drop the tile has the same position
            if(targetIndex!=sourceIndex){
                /**
                * determine the direction of movement of the tile in order to
                * decide whether the left or the right neighbour of the new position of our tile
                * is the one where we have to start incrementing the order by one (targetIndex)
                * we increment the order by one of each tile between the targetIndex and the sourceIndex (the original position of the tile)
                */
                var target;
                if(sourceIndex>targetIndex){
                    target = targetIndex+1;
                }
                else{
                    target = targetIndex-1;
                }
                targetTask = angular.element(ui.item).parent().find(".block-grid-item.ng-scope").eq(target).scope().task;
                var newOrder = targetTask.order;
                var oldOrder = sourceTask.order;
                
                $http.put('/requests/taskorder/', {oldOrder: oldOrder, newOrder: newOrder}, {});
                $timeout(function(){
                    //refresh dashboard when done
                    $scope.$parent.refreshDashboard();
                },2000);
            }
        }
    };
    
    //when someone adds a new task, refresh the dashboard
    $scope.$on('addTask', function(ev, args){
        $scope.$parent.refreshDashboard();
    });
    
    //when someone deletes a task, refresh the dashboard
    $scope.$on('deleteTask', function(ev, args){
        $scope.$parent.refreshDashboard();
    });
    
    //when someone reorders a tile, refresh the dashboard
    $scope.$on('orderChangedEvent', function(ev, args){
        $timeout(function(){
            $scope.$parent.refreshDashboard();
        },1000);
    });
    
    if($stateParams.refresh==="true"){
        $scope.$parent.refreshTasks();
    }
    else{
        $scope.tasks=tasks;  
        $scope.tasks = $filter('orderBy')($scope.tasks, '+order');
    }
}]);