app.factory('taskService', function ($http, $q, $timeout) {
    return {
        getTasks: function() {
            var deferred = $q.defer();
            $http.get('/requests/task').success(function(data) { 

                for(var i=0; i<data.length;i++){
                    data[i].dateModified = moment(data[i].dateModified, "YYYY-MM-DD HH:mm:ss");
                    data[i].duration = (data[i].frequency * 60 * 60) + "s";

                    //Works out starting point for colour change.
                    data[i].delay = (data[i].dateModified.valueOf() - moment().valueOf())/1000 + "s";
                }
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