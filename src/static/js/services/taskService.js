app.factory('taskService', function ($http, $q, $timeout) {
    return {
        getTasks: function () {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: '/requests/task'
            }).then(function successCallback(response) {
                var data = response.data;

                for(i=0; i<data.length;i++){
                    data[i].dateModified = moment(data[i].dateModified, "YYYY-MM-DD HH:mm:ss");
                    data[i].duration = (data[i].frequency * 60 * 60) + "s";

                    //Works out starting point for colour change.
                    data[i].delay = (data[i].dateModified.valueOf() - moment().valueOf())/1000 + "s";
                }
                defer.resolve(data);
                
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            return defer.promise;
        }

    };
}
);