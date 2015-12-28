app.controller("UserChartController", ['$scope', '$http', 'userID', 'houseData', function ($scope, $http, userID, houseData) {


	//For the donought chart
	$scope.data = [];
	$scope.labels = [];

	//House Data is an Map
	// Key = userID
	// Value = Map of values for the user

	//For the thumbs bar chart
	$scope.seriesNames = ['Positive', 'Negative'];
	$scope.labelsBar = [];
	$scope.dataBar = [];
	$scope.$watch('analysisUserChartTaskEventPerTask', function() {
        $http({
            method: "GET",
            //The parameter userid must be the id of the loaded user.
			//TODO Bogomil please add the userid on click from different users on house page.
    		params: {charttype: "userchart", userid: userID},
            url: "/requests/analysis",
        }).success(function (data) {

			//For the donought chart
        	for(var i = 0; i < data.taskeventspertask.length; i ++){
        		$scope.data[i] = data.taskeventspertask[i].value;
        		$scope.labels[i] = data.taskeventspertask[i].name;
        	}

			//For the bar chart
			$scope.labelsBar = data.feedbackevents.labels;
			$scope.dataBar = [data.feedbackevents.positive, data.feedbackevents.negative]



        });
    });

	// This is testing for bar charts




	//TODO: Have to deal with the colors. Currently it is displayed in a panel-red and looks very ugly
	//Colors for the thumbs bar chart - green/ red
	$scope.colorsBar = ['#42A76B', '#8A0801'];


 	//$scope.options = {
	//    tooltipEvents: [],
	//    onAnimationComplete: function () {
	//        this.showTooltip(this.segments, true);
    	//},
	//};
}]);