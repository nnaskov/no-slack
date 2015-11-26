app.factory('taskService', ['$http', '$q', '$timeout', '$log', function($http, $q, $timeout, $log) {
    return {
        getTasks: function() {
            var deferred = $q.defer();
            $http.get('/requests/task').success(function(data) { 
                var now = new Date().getTime();
                
                data.forEach(function(datum){
                    datum.duration = (datum.frequency * 60 * 60) + "s";
                    datum.delay = ((new Date(datum.dateModified).getTime() - now)/1000) + "s";
                });
                
                deferred.resolve(data);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });
            return deferred.promise;
        },
        
        addTaskEvent: function(taskID){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/requests/task/' + taskID + '/taskevent'
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });  
            return deferred.promise;
        },
        
        addFeedback: function(taskID, positive){
            var deferred = $q.defer();
            $http({
                method: 'PUT',
                data: {'taskID': taskID, 'goodJob': positive},
                url: '/requests/task/' + taskID + '/taskevent'
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });  
            return deferred.promise;
        },
        
        createTask: function(nameField, iconClass, descriptionField, frequency){
            var deferred = $q.defer();
            $http({
                method: 'POST',
                data: {'name': nameField, 'iconClass': iconClass, 'description': descriptionField, 'frequency': frequency, 'difficulty': 1},
                url: '/requests/task/'
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });  
            return deferred.promise;
        }
    }
}]);