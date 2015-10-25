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

    $scope.updateDateModified = function(taskID){
    	$http({
            method: 'POST',
            data: {'taskID': taskID},
            url: '/requests/taskevent/add'
        }).then(function successCallback(response) {
            var data = response.data;
            var tile = angular.element(document.getElementById(data.taskID));
            var date;//10:00 11:00
                data.dateModified = moment(data[i].dateModified, "YYYY-MM-DD HH:mm:ss");
                data.duration = (data.frequency * 60 * 60) + "s";
                //Works out starting point for colour change.
                data.delay = (data.dateModified.valueOf() - moment().valueOf()) + "s";
                tile[0].style.animation = 'none';
	    		
	    		setTimeout(function() {
			        tile[0].style.animation = '';
	    			tile[0].style["animation-duration"] = "10s";
	    			tile[0].style["animation-delay"] = "0s";
			    }, 10);
            });
 

    	/*var tile = angular.element(document.getElementById(taskID));
	    		tile[0].style.animation = 'none';
	    		
	    		setTimeout(function() {
			        tile[0].style.animation = '';
	    			tile[0].style["animation-duration"] = "10s";
	    			tile[0].style["animation-delay"] = "0s";
			    }, 10);*/

	    
	    };
}]);