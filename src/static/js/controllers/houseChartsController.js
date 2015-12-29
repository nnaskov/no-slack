app.controller('HouseChartsController', ['$scope', '$http', function($scope, $http) {
    $scope.chart2Data = [];
    $scope.chart2Labels = [];
    $scope.chart2Series = [];

    $scope.chart3Data = [];
    $scope.chart3Labels = [];
    $scope.chart3Series = [];




    $http({
        method: "GET",
        params: {charttype: "housechart"},
        url: "/requests/analysis",
    }).success(function (data) {

        $scope.chart2Data = data.chart2.data;
        $scope.chart2Labels = data.chart2.labels;
        $scope.chart2Series = data.chart2.series;

        $scope.chart3Data = data.chart3.data;
        $scope.chart3Labels = data.chart3.labels;
        $scope.chart3Series = data.chart3.series;

    });
    
}]);

