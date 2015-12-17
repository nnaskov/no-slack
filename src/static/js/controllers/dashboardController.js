app.controller('DashboardController', ['$scope', 'channelClientID', 'userID', '$log', 'channelService', 'memberService', function($scope, channelClientID, userID, $log, channelService, memberService){
    //dispatching events down to the children
    channelService.openChannel(channelClientID);
    //event types: addTask, deleteTask, editTask, taskEvent, taskFeedback
    
    $scope.userName = "Loading...";
    
    var houseData = memberService.getHouseData().then(function(data){
        var firstName = data['users'][userID].firstName;
        var lastName = data['users'][userID].lastName;
        $scope.userName = firstName+" "+lastName;
    });
    
}]);