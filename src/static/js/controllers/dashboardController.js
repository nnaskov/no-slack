app.controller('DashboardController', ['$scope', 'channelClientID', '$log', 'channelService', function($scope, channelClientID, $log, channelService){
    //dispatching events down to the children
    channelService.openChannel(channelClientID);
    //event types: addTask, deleteTask, editTask, taskEvent, taskFeedback
}]);