app.controller('TaskController', ['$scope', '$http', '$element', 'taskService', function($scope, $http, $element, taskService) {    
    var addTaskEventCb = function(response){
        $element.css("background-color", "#00A600");
        $element.css("animation", "none");

        $scope.feedback.positive = 0;
        $scope.feedback.negative = 0;

        $scope.task.userFeedback = null;
        $scope.task.assigned = response.assigned;
        $scope.task.assignedInitials = response.assignedInitials;

        $scope.task.everCompleted = true;
    }
    
    //listeners
    $scope.$on('taskFeedback', function(ev, args){
        if(args.taskId === $scope.task.taskID){
            $scope.feedback.positive = args.positive;
            $scope.feedback.negative = args.negative;
            $scope.$apply();
        }
    });
    
    $scope.$on('taskEvent', function(ev, args){
        if(args.taskId === $scope.task.taskID){
            addTaskEventCb({});
            $scope.$apply();
        }
    });
    
    $scope.feedback = {
        positive: $scope.task.positiveFeedback ? $scope.task.positiveFeedback : 0,
        negative: $scope.task.negativeFeedback ? $scope.task.negativeFeedback : 0,
    };
    
    $scope.addTaskEvent = function(){
        taskService.addTaskEvent($scope.task.taskID).then(addTaskEventCb);
	};

    $scope.addFeedback = function(positive){
        taskService.addFeedback($scope.task.taskID, positive).then(function (response) {
            if(positive){
                $scope.task.userFeedback = true;
            }
            else{
                $scope.task.userFeedback = false;
            }
            $scope.feedback.positive = response.positiveFeedback;
            $scope.feedback.negative = response.negativeFeedback;
        });
    };
}]);