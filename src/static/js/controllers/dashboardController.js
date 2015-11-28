app.controller('DashboardController', ['$scope', 'channelClientID', '$log', 'channelService', function($scope, channelClientID, $log, channelService){
    channelService.openChannel(channelClientID);
}]);