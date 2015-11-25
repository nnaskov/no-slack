app.controller('TaskController', ['$scope', '$http', '$element', function($scope, $http, $element) {    
    $scope.addTaskEvent = function(){
    	$http({
            method: 'POST',
            url: '/requests/task/' + $scope.task.taskID + '/taskevent'
        }).then(function successCallback(response) {
            var data = response.data;
            //var tile = angular.element(document.getElementById(data.taskID));
            //data.dateModified = moment(data.dateModified, "YYYY-MM-DD HH:mm:ss");

            $element.css("background-color", "#00A600");
            $element.css("animation", "none");
    		
            /*
    		setTimeout(function() {
		        tile[0].style.animation = '';
    			tile[0].style["animation-duration"] = (data.frequency * 60 * 60) + "s"; 
    			tile[0].style["animation-delay"] = (data.dateModified.valueOf() - moment().valueOf())/1000 + "s";
    			tile[0].style["background-color"] = "#AC193D";
		    }, 2);
            */

			/*
			Change feedback icons.
			 */

			var pos = angular.element(document.getElementById($scope.task.taskID + "-" + "positive-feedback"))[0];
            var neg = angular.element(document.getElementById($scope.task.taskID + "-" + "negative-feedback"))[0];
        	pos.innerHTML = 0;
        	neg.innerHTML = 0;


            var thumbsUp = angular.element(document.getElementById($scope.task.taskID + "-" + "thumbs-up"))[0];
            var thumbsDown = angular.element(document.getElementById($scope.task.taskID + "-" + "thumbs-down"))[0];

			thumbsDown.className = "fa-thumbs-o-down fa glyph-button";
			thumbsUp.className = "fa-thumbs-o-up fa glyph-button";
            
            $scope.task.everCompleted = true;

        });
	};

    $scope.addFeedback = function(goodJob){
        $http({
            method: 'PUT',
            data: {'taskID': $scope.task.taskID, 'goodJob': goodJob},
            url: '/requests/task/' + $scope.task.taskID + '/taskevent'
        }).then(function successCallback(response) {
            var data = response.data;
            var pos = angular.element(document.getElementById($scope.task.taskID + "-" + "positive-feedback"))[0];
            var neg = angular.element(document.getElementById($scope.task.taskID + "-" + "negative-feedback"))[0];
            pos.innerHTML = data.positiveFeedback;
            neg.innerHTML = data.negativeFeedback;


            /*
             Change the thumbs icons.
             */
            var thumbsUp = angular.element(document.getElementById($scope.task.taskID + "-" + "thumbs-up"))[0];
            var thumbsDown = angular.element(document.getElementById($scope.task.taskID + "-" + "thumbs-down"))[0];

            if(goodJob){
                thumbsUp.className = "fa fa-thumbs-up glyph-button";
                thumbsDown.className = "fa-thumbs-o-down fa glyph-button";
            }else{
                thumbsUp.className = "fa-thumbs-o-up fa glyph-button";
                thumbsDown.className = "fa fa-thumbs-down glyph-button";
            }
        });
    };
}]);