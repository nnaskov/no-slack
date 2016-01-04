app.factory('channelService', ['$http', '$rootScope', '$timeout', '$log', function ($http, $rootScope, $timeout, $log) {
    /**
    * The channel service implementation is adapted from the original code written by Takashi Matsuo - http://stackoverflow.com/a/20421866
    **/
    var service = {};
    
    /**
    * Status of the Channel API socket
    * true or false, false by default
    **/
    var isConnectionAlive = false;
    
    /**
    * How many times have we retried to connect to the Channel so far
    **/
    var retryCount = 0;
    
    /**
    * Maximum number of retries before giving up on the connection
    **/
    var MAX_RETRY_COUNT = 3;

    /**
    * This event fires after the Channel API socket is successfully opened
    **/
    service.onOpened = function () {
        isConnectionAlive = true;
        $log.log("Connected to Channel API");
    };
    
    /**
    * When a message is received from the server it is broadcasted from the root scope
    * down the tree to all its children i.e. to every controller in the application
    **/
    service.onMessage = function (message) {
        var cleanMessage = JSON.parse(message.data);
        $rootScope.$broadcast(cleanMessage.eventType, cleanMessage);
        $rootScope.$apply();
    };

    /**
    * This is the bootstrap function of the service. It binds all the Channel API events
    * to service methods and resolves any connection-related exceptions i.e. it obtains a new token
    * if the current on in use has expired
    **/
    service.openChannel = function (channelToken) {
        var channel = new goog.appengine.Channel(channelToken);
        service.socket = channel.open();
        isConnectionAlive = false;
        service.socket.onmessage = service.onMessage;
        service.socket.onopen = service.onOpened;
        service.socket.onerror = function (error) {
            $log.log('Detected an error on the channel.');
            $log.log('Channel Error: ' + error.description + '.');
            $log.log('Http Error Code: ' + error.code);
            isConnectionAlive = false;
            if (error.description == 'Invalid+token.' || error.description == 'Token+timed+out.') {
                $log.log('It should be recovered with onclose handler.');
            } else {
                $log.log('Presumably it is "Unknown SID Error". Try closing the socket manually.');
                service.socket.close();
            }
        };
        service.socket.onclose = function () {
            isConnectionAlive = false;
            $log.log('Reconnecting to a new channel');
            service.obtainNewToken();
        };
        $log.log('A channel was opened successfully. Will check the ping in 20 secs.');
    };

    /**
    * Tries to obtian a new Channel API token automatically without the need for page refresh
    **/
    service.obtainNewToken = function (isRetry) {
        $log.log('Retrieving a clientId.');
        if (isRetry) {
            retryCount++;
        } else {
            retryCount = 0;
        }
        $http.get('/requests/token')
            .success(function (json) {
                service.openChannel(json.token);
            })
            .error(function (data, status) {
                $log.log('Can not retrieve a clientId');
                if (status != 403 && retryCount <= MAX_RETRY_COUNT) {
                    $log.log('Retrying to obtain a client id');
                    service.obtainNewToken(true);
                }
            });
    };

    return service;
}]);