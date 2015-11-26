app.controller('TaskController', ['$scope', '$http', '$element', function($scope, $http, $element) {    
    if($scope.task!=null){
        $scope.feedback = {
            positive: $scope.task.positiveFeedback,
            negative: $scope.task.negativeFeedback,
        };
    }
    else{
        $scope.feedback = {
            positive: 0,
            negative: 0,
        };
    }
    
    $scope.addTaskEvent = function(){
    	$http({
            method: 'POST',
            url: '/requests/task/' + $scope.task.taskID + '/taskevent'
        }).then(function successCallback(response) {
            $element.css("background-color", "#00A600");
            $element.css("animation", "none");
    		
            $scope.feedback.positive = 0;
            $scope.feedback.negative = 0;
            
            $scope.task.everCompleted = true;
        });
	};

    $scope.addFeedback = function(positive){
        $http({
            method: 'PUT',
            data: {'taskID': $scope.task.taskID, 'goodJob': positive},
            url: '/requests/task/' + $scope.task.taskID + '/taskevent'
        }).then(function successCallback(response) {
            if(positive){
                $scope.task.userFeedback = true;
            }
            else{
                $scope.task.userFeedback = false;
            }
            $scope.feedback.positive = response.data.positiveFeedback;
            $scope.feedback.negative = response.data.negativeFeedback;
        });
    };
}]);