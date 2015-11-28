app.controller('DashboardController', ['$scope', 'channelClientID', '$log', function($scope, channelClientID, $log){
    var cleanMessage;
    var onOpened = function(){
        $log.log("BOO");
    }
    onMessage = function(message){      
        cleanMessage = JSON.parse(message.data);
        $scope.$broadcast(cleanMessage.eventType, cleanMessage);
        $scope.$apply();        
    }

    onError = function(error){
        $log.log(error.description);
    }
    
    var channel = new goog.appengine.Channel(channelClientID);
    var socket = channel.open();
    socket.onopen = onOpened;
    socket.onmessage = onMessage;
    socket.onerror = onError;
}]);