app.controller('MemberChartsController', ['$scope', '$http', function($scope, $http) {
    $scope.memberID = $scope.$parent.id;

    $scope.chart1Data = [];
    $scope.chart1Labels = [];
    
    //For the thumbs bar chart
    $scope.chart2Series= ['Positive', 'Negative'];
    $scope.chart2Labels= [];
    $scope.chart2Data = [];

    $scope.colorsBar = ['#42A76B', '#8A0801'];
    
    $http({
        method: "GET",
        params: {charttype: "userchart", userid: $scope.memberID},
        url: "/requests/analysis",
    }).success(function (data) {
        //For the donought chart
        for(var i = 0; i < data.taskeventspertask.length; i ++){
            $scope.chart1Data[i] = data.taskeventspertask[i].value;
            $scope.chart1Labels[i] = data.taskeventspertask[i].name;
        }

        //For the bar chart
        $scope.chart2Labels = data.feedbackevents.labels;
        $scope.chart2Data = [data.feedbackevents.positive, data.feedbackevents.negative]
    });
    
}]);

