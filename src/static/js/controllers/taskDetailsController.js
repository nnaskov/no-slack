app.controller('TaskDetailsController', ['$scope', '$state', '$http', '$uibModalInstance', '$state', '$stateParams', '$log','taskService', 'task', 'cssInjector' , function ($scope, $state, $http, $uibModalInstance, $state, $stateParams, $log, taskService, task, cssInjector) {
    cssInjector.removeAll();
    
    $scope.title = task.taskName;
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go("dashboard", null);
    };
    
    $http({
        method: "GET",
        params: {charttype: "tilechart", taskid: task.taskID},
        url: "/requests/analysis",
    }).success(function (data) {
        //For the pie chart
        $scope.chart1Data = data.chart1.data;
        $scope.chart1Labels = data.chart1.labels;
    });
}]);