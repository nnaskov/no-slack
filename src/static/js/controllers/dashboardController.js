app.controller('DashboardController', ['$scope', 'channelClientID', '$log', function($scope, channelClientID, $log){
    var onMessage = function(data) {
        var json = JSON.parse(data['data']);
        $scope.$broadcast(json.eventType, json);
    }
    
    $scope.channel = new goog.appengine.Channel(channelClientID);
    $scope.socket = $scope.channel.open();
    $scope.socket.onmessage = onMessage;
}]);