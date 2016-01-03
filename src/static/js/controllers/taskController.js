/**
* The task controller manages the scope for every task tile on the dashboard
* It manages all the task-related event such as task completion and task feedback
*/
app.controller('TaskController', ['$scope', '$http', '$element', 'taskService', function($scope, $http, $element, taskService) {    
    /**
    * This callback is called every time the user completes a task
    * It puts the user's initials on the tile to signify he is the last one who completed the task
    * It also transforms the task background to green
    * It displays the initials of the new assignee of the task
    */
    var addTaskEventCb = function(response){
        $element.css("background-color", "#00A600");
        $element.css("animation", "none");

        $scope.feedback.positive = 0;
        $scope.feedback.negative = 0;

        $scope.task.userFeedback = null;
        $scope.task.assigned = response.assigned;
        $scope.task.assignedInitials = response.assignedInitials;
        $scope.task.completedByInitials = response.completedByInitials;

        $scope.task.everCompleted = true;
    }
    
    /**
    * Listens to the task feedback event broadcasted from the root scope
    * and updates the respective task tile with the latest feedback data
    * i.e. when another flatmate gives feedback it will update on the screen of the current user
    */
    $scope.$on('taskFeedback', function(ev, args){
        if(args.taskId === $scope.task.taskID){
            $scope.feedback.positive = args.positive;
            $scope.feedback.negative = args.negative;
            $scope.$apply();
        }
    });
    
    /**
    * Listens to the "task completed" event broadcasted from the root scope
    * and marks the respective task tile as completed using the addTaskEventCb callback function
    * i.e. when another flatmate completes a task it will be displayed as completed on the screen of the current user
    */
    $scope.$on('taskEvent', function(ev, args){
        if(args.taskId === $scope.task.taskID){
            addTaskEventCb(args);
            $scope.$apply();
        }
    });
    
    /**
    * Default feedback values
    */
    $scope.feedback = {
        positive: $scope.task.positiveFeedback ? $scope.task.positiveFeedback : 0,
        negative: $scope.task.negativeFeedback ? $scope.task.negativeFeedback : 0,
    };
    
    /**
    * A method to be called when user tries to complete the task.
    * The responsibility is delegated to the taskService.js
    */
    $scope.addTaskEvent = function(){
        taskService.addTaskEvent($scope.task.taskID).then(addTaskEventCb);
	};

    /**
    * A method to be called when user tries to give feedback for the task
    * The responsibility is delegated to the taskService.js
    */
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