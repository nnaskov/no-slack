app.controller('TaskController', ['$scope', '$http', '$element', 'taskService', function($scope, $http, $element, taskService) {    
    $scope.feedback = {
        positive: $scope.task.positiveFeedback,
        negative: $scope.task.negativeFeedback,
    };
    
    $scope.addTaskEvent = function(){
        taskService.addTaskEvent($scope.task.taskID).then(function(response){
            $element.css("background-color", "#00A600");
            $element.css("animation", "none");

            $scope.feedback.positive = 0;
            $scope.feedback.negative = 0;
            
            $scope.task.userFeedback = null;
            
            $scope.task.everCompleted = true;
        });
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