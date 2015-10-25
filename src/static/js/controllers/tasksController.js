app.controller('TasksController', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/requests/getalltasks'
    }).then(function successCallback(response) {
    	var data = response.data;
    	var date;//10:00 11:00
    	for(i=0; i<data.length;i++){
    		data[i].dateModified = moment(data[i].dateModified, "YYYY-MM-DD HH:mm:ss");
    		/* TODO replace "28880s" with task interval/ freqency time.
    		 * Awaiting value from back end team.
    		 */
    		data[i].duration = "28880s";
    		//Works out starting point for colour change.
    		data[i].delay = (data[i].dateModified.valueOf() - moment().valueOf()) + "ms";
    	}
        $scope.list = response.data;
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
}]);
