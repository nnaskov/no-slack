app.controller('MemberChartsController', ['$scope', '$http', function($scope, $http) {
    $scope.memberID = $scope.$parent.id;
    $scope.data = [];
    $scope.labels = [];
    
    //For the thumbs bar chart
    $scope.seriesNames = ['Positive', 'Negative'];
    $scope.labelsBar = [];
    $scope.dataBar = [];

    $scope.colorsBar = ['#42A76B', '#8A0801'];
    
    $http({
        method: "GET",
        params: {charttype: "userchart", userid: $scope.memberID},
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
    
}]);

