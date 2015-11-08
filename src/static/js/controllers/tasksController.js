app.controller('TasksController', ['$scope', '$http', 'moment', 'taskService', function($scope, $http, moment, taskService) {
    
    taskService.loadTasks().then(function(response) {
        var data = response.data;

        for(i=0; i<data.length;i++){
            data[i].dateModified = moment(data[i].dateModified, "YYYY-MM-DD HH:mm:ss");
            data[i].duration = (data[i].frequency * 60 * 60) + "s";

            //Works out starting point for colour change.
            data[i].delay = (data[i].dateModified.valueOf() - moment().valueOf())/1000 + "s";
        }
        $scope.list = response.data;
    });
    
    
}]);