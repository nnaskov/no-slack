app.controller('DashboardController', ['$scope', 'channelClientID', 'userID', '$log', 'channelService', 'memberService', function($scope, channelClientID, userID, $log, channelService, memberService){
    //dispatching events down to the children
    channelService.openChannel(channelClientID);
    //event types: addTask, deleteTask, editTask, taskEvent, taskFeedback
    
    $scope.userName = "Loading...";
    $scope.initials = "?";
    
    var houseData = memberService.getHouseData().then(function(data){
        if(data['users'][userID] !== undefined){
            var userData = data['users'][userID];
            var firstName = userData.firstName;
            var lastName = userData.lastName;
            var initials = userData.initials;
            $scope.userName = firstName+" "+lastName;
            $scope.initials = initials;
        }
    });
    
}]);