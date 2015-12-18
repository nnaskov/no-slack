app.controller('DashboardController', ['$scope', 'channelClientID', 'userID', '$log', 'channelService', 'memberService', function($scope, channelClientID, userID, $log, channelService, memberService){
    channelService.openChannel(channelClientID);
    
    $scope.userName = "Loading...";
    $scope.initials = "?";
    $scope.houseName = "Loading...";
    $scope.avatar = "static/img/blank-picture.jpg";
    
    var houseData = memberService.getHouseData().then(function(data){
        if(data['users'][userID] !== undefined){
            var userData = data['users'][userID];
            var firstName = userData.firstName;
            var lastName = userData.lastName;
            var initials = userData.initials;
            $scope.userName = firstName+" "+lastName;
            $scope.initials = initials;
            $scope.houseName = data.name;
            $scope.avatar = "/requests/avatar/"+userID;
        }
    });
    
}]);