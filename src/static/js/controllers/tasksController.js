app.controller('TasksController', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/requests/getalltasks'
    }).then(function successCallback(response) {
    	var data = response.data;
    	var date;//10:00 11:00

		for(i=0; i<data.length;i++){
    		data[i].dateModified = moment(data[i].dateModified, "YYYY-MM-DD HH:mm:ss");
    		data[i].duration = (data[i].frequency * 60 * 60) + "s";

    		//Works out starting point for colour change.
    		data[i].delay = (data[i].dateModified.valueOf() - moment().valueOf())/1000 + "s";
    	}
        $scope.list = response.data;
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    $scope.addTaskEvent = function(taskID){
    	$http({
            method: 'POST',
            data: {'taskID': taskID},
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
        });
	};

	$scope.addFeedback = function(taskID, goodJob){
		/*var pos = angular.element(document.getElementById(taskID + "-" + "positive-feedback"))[0];//.find("positive-feedback")[0];
        	var neg = angular.element(document.getElementById(taskID)).find("negative-feedback");
        	console.log(pos);
        	pos.innerHTML = "5";
        	neg.html = "5";*/
    	$http({
            method: 'POST',
            data: {'taskID': taskID, 'goodJob': goodJob},
            url: '/requests/tasks/feedback'
        }).then(function successCallback(response) {
        	console.log(response.data);
        	var data = response.data;
        	var pos = angular.element(document.getElementById(taskID + "-" + "positive-feedback"))[0];
        	var neg = angular.element(document.getElementById(taskID + "-" + "negative-feedback"))[0];
        	pos.innerHTML = data.positiveFeedback;
        	neg.innerHTML = data.negativeFeedback;


			/*
			Change the thumbs icons.
			 */
			var thumbsUp = angular.element(document.getElementById(taskID + "-" + "thumbs-up"))[0];
        	var thumbsDown = angular.element(document.getElementById(taskID + "-" + "thumbs-down"))[0];

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
}]);