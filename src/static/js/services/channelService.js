app.factory('channelService', ['$http', '$rootScope', '$timeout', '$log' , function ($http, $rootScope, $timeout, $log) {
        var service = {};
        var isConnectionAlive = false;
        var retryCount = 0;
        var MAX_RETRY_COUNT = 3;

        service.onOpened = function(){
            isConnectionAlive = true;
            $log.log("Connected to Channel API");
        }
        
        service.onMessage = function(message){      
            var cleanMessage = JSON.parse(message.data);
            console.log(cleanMessage);
            $rootScope.$broadcast(cleanMessage.eventType, cleanMessage);
            $rootScope.$apply();        
        }

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
            //$timeout(service.checkConnection, 20000, false);
        };

        service.obtainNewToken = function(isRetry) {
            $log.log('Retrieving a clientId.');
            if (isRetry) {
                retryCount++;
            } else {
                retryCount = 0;
            }
            $http.get('/requests/token')
                .success(function(json){
                    service.openChannel(json.token);
                })
                .error(function (data, status) {
                    $log.log('Can not retrieve a clientId');
                    if (status != 403 && retryCount <= MAX_RETRY_COUNT) {
                        $log.log('Retrying to obtain a client id')
                        service.obtainNewToken(true);
                    }
                })
        }

        /*
        service.pingCallback = function() {
            $log.log('Got a ping from the server.');
            isConnectionAlive = true;
        }
        */
        /*
        service.checkConnection = function() {
            if (isConnectionAlive) {
                $log.log('Connection is alive.');
                return;
            }
            if (service.socket == undefined) {
                $log.log('will open a new connection in 1 sec');
                $timeout(service.obtainNewToken, 1000, false);
                return;
            }
            // Ping didn't arrive
            // Assuming onclose handler automatically open a new channel.
            $log.log('Not receiving a ping, closing the connection');
            service.socket.close();
        }
        */

        return service;
}]);