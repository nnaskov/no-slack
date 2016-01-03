/**
* Task Details Controller manages the modal displayed after a user clicks on the body of a task tile in the dashboard
* For now it displays a simple task-related chart partitioning the activity of the flatmates in a pie chart
*/
app.controller('TaskDetailsController', ['$scope', '$state', '$http', '$uibModalInstance', '$state', '$stateParams', '$log','taskService', 'task', 'cssInjector' , function ($scope, $state, $http, $uibModalInstance, $state, $stateParams, $log, taskService, task, cssInjector) {
    //removing unnecessary css and injecting only the stylesheets we need
    cssInjector.removeAll();
    cssInjector.add("../static/bower_components/angular-chart.js/dist/angular-chart.min.css"); 
    
    //displaying the title of the task as the title of the bootstrap modal
    $scope.title = task.taskName;
    
    //defining simple event handler for closing the modal
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go("dashboard", null);
    };
    
    //getting the data for the chart
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