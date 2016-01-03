/**
* Task Service is responsible for retrieving, updating, adding and deleting tasks
* self-commented
*/
app.factory('taskService', ['$http', '$q', '$timeout', '$log', 'moment', function($http, $q, $timeout, $log, moment) {
    return {
        getTasks: function() {
            var deferred = $q.defer();
            $http.get('/requests/task').success(function(data) { 
                var now = new Date().getTime();
                
                data.forEach(function(datum){
                    datum.duration = (datum.frequency * 60 * 60) + "s";
                    datum.delay = ((moment(datum.dateLastTaskEvent).toDate().getTime() - now)/1000) + "s";
                    datum.bounceDelay = Math.floor((Math.random()*5)+1);
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
                data: {'goodJob': positive},
                url: '/requests/task/' + taskID + '/taskevent'
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });  
            return deferred.promise;
        },
        
        sendTask: function(taskID, nameField, iconClass, descriptionField, frequency){
            var deferred = $q.defer();
            $http({
                method: (taskID ? 'PUT' : 'POST'),
                data: {'taskID': taskID, 'name': nameField, 'iconClass': iconClass, 'description': descriptionField, 'frequency': frequency, 'difficulty': 1},
                url: '/requests/task/'
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });  
            return deferred.promise;
        },

        deleteTask: function(taskID){
            var deferred = $q.defer();
            $http({
                method: 'DELETE',
                url: '/requests/task/' + taskID
            }).success(function(response) {
                deferred.resolve(response);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });  
            return deferred.promise;
        },
        
        getTaskByID: function(taskID){
            var deferred = $q.defer();
            $http.get('/requests/task/'+taskID).success(function(data) { 
                deferred.resolve(data);
            }).error(function(msg, code) {
                deferred.reject(msg);
                $log.error(msg, code);
            });
            return deferred.promise;
        }
    }
}]);