app.controller('TaskController', ['$scope', '$http', function($scope, $http) {
    
    $scope.addTaskEvent = function(){
    	$http({
            method: 'POST',
            data: {'taskID': $scope.task.taskID},
            url: '/requests/taskevent/add'
        }).then(function successCallback(response) {
            var data = response.data;
            var tile = angular.element(document.getElementById(data.taskID));
            var date;//10:00 11:00
            data.dateModified = moment(data.dateModified, "YYYY-MM-DD HH:mm:ss");
            //data.duration = (data.frequency * 60 * 60) + "s";
            //Works out starting point for colour change.
            //data.delay = (data.dateModified.valueOf() - moment().valueOf()) + "s";
            tile[0].style["background-color"] = "#00A600";
            tile[0].style.animation = 'none';
    		
    		setTimeout(function() {
		        tile[0].style.animation = '';
    			tile[0].style["animation-duration"] = (data.frequency * 60 * 60) + "s"; //"4s";
    			tile[0].style["animation-delay"] = (data.dateModified.valueOf() - moment().valueOf())/1000 + "s";//"0s";
    			tile[0].style["background-color"] = "#AC193D";
		    }, 2);


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
            method: 'POST',
            data: {'taskID': $scope.task.taskID, 'goodJob': goodJob},
            url: '/requests/tasks/feedback'
        }).then(function successCallback(response) {
            console.log(response.data);
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

            console.log("Feedback recieved");
        });
    };

    $scope.getAllForTask = function(){
        $http({
            method: 'GET',
            params: {'taskID': $scope.task.taskID},
            url: '/requests/taskevent/getAllForTask'
        }).then(function successCallback(response) {
            console.log(response.data);
            /*
            var data = response.data;
            var name = angular.element(document.getElementbyId(taskID + "-" + "name"))[0];
            var date = angular.element(document.getElementById(taskID + "-" + "Date"))[0];
            var pos = angular.element(document.getElementById(taskID + "-" + "Positive Feedback"))[0];
            var neg = angular.element(document.getElementById(taskID + "-" + "Negative Feedback"))[0];

            name.innerHTML = data.name;
            date.innerHTML = data.date;
            pos.innerHTML = data.positiveFeedback;
            neg.innerHTML = data.negativeFeedback;

            var historyIcon = angular.element(document.getElementById(taskID + "-" + "get-all-for-task"))[0];
            historyIcon.className = "fa fa-get-all-for-task glyph-button";
            */
        });
    };
}]);