app.factory('taskService', function ($http, $q, $timeout) {
    return {
        getTasks: function() {
            var deferred = $q.defer();
            $http.get('/requests/task').success(function(data) { 
                var now = new Date().getTime();
                
                data.forEach(function(datum){
                    datum.duration = (datum.frequency * 60 * 60) + "s";
                    datum.delay = ((new Date(datum.dateModified.replace("/\.([0-9]*)/ig","")).getTime() - now)/1000) + "s";
                });
                
                deferred.resolve(data);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });
            return deferred.promise;
        }
    }
}
);