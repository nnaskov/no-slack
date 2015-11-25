app.controller("AnalysisController", function ($scope, $http) {

	$scope.data = [];
	$scope.labels = [];

	$scope.$watch('houseAnalysis', function() {
        $http({
            method: "GET",
    		params: {charttype: "housechart"},
            url: "http://localhost:8080/requests/analysis",
        }).success(function (data) {
        	$scope.houseName = data.house_name;

        	for(var i = 0; i < data.pie_elements.length; i ++){
        		$scope.data[i] = data.pie_elements[i].value;
        		$scope.labels[i] = data.pie_elements[i].name;
        	}
        });
    });
 	$scope.options = {
	    tooltipEvents: [],
	    onAnimationComplete: function () {
	        this.showTooltip(this.segments, true);
    	},
	};
});