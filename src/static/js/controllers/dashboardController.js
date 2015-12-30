app.controller('DashboardController', ['$scope', 'channelClientID', 'userID', '$log', 'channelService', 'memberService', '$sce', '$rootScope', 'webNotification','$http', '$location', 'taskService', '$state', '$filter', function ($scope, channelClientID, userID, $log, channelService, memberService, $sce, $rootScope, webNotification, $http, $location, taskService, $state, $filter) {
    channelService.openChannel(channelClientID);

    $scope.refreshTasks = function(){
        taskService.getTasks().then(function(tasks){
            $scope.tasks = tasks;
            $scope.tasks = $filter('orderBy')($scope.tasks, '+order');
            $location.search({});
        });
    }
    
    $scope.refreshDashboard = function(){
        $state.transitionTo('dashboard', {refresh:"true"}, { 
            reload: true, inherit: true, notify: true
        });
    }
    
    $scope.userName = "Loading...";
    $scope.initials = "?";
    $scope.houseName = "Loading...";
    $scope.avatar = "static/img/blank-picture.jpg";
    $scope.notificationsOn = true;
    $scope.notifications = [];

    $scope.notificationsStatus = false;

    var houseData = memberService.getHouseData().then(function (data) {
        if (data['users'][userID] !== undefined) {
            var userData = data['users'][userID];
            var firstName = userData.firstName;
            var lastName = userData.lastName;
            var initials = userData.initials;
            var notificationsOn = userData.notificationsOn;
            $scope.userName = firstName + " " + lastName;
            $scope.initials = initials;
            $scope.houseName = data.name;
            $scope.avatar = "/requests/avatar/" + userID;
            $scope.notificationsOn = ((notificationsOn != undefined) ? notificationsOn : true);
        }
    });

    $scope.populate = function(){
        $rootScope.progressbar.reset();
        $rootScope.progressbar.start();
        $http.get('/requests/populate', {}).then(function(){
            $rootScope.progressbar.complete();
            $scope.refreshDashboard();
        });
    }
    
    $scope.refreshAvatar = function(){
        $scope.avatar = "/requests/avatar/" + userID + "?decache=" + Math.random();
    }

    var addNotification = function (ev, args) {
        if ($scope.notificationsOn === true) {
            var task;
            if (args.taskId) {
                task = $rootScope.tasks.filter(function (task) {
                    return task.taskID === args.taskId;
                })[0];
            }

            var taskName;
            if (task != undefined) {
                taskName = task.taskName;
            } else {
                taskName = args.taskId;
            }

            if (args.eventType == "taskFeedback") {
                var isPositive = (args.positive > (task.positiveFeedback !== undefined ? task.positiveFeedback : 0));
                var action, icon;
                if (isPositive == true) {
                    action = "liked";
                    icon = "fa-thumbs-o-up";
                } else {
                    action = "disliked";
                    icon = "fa-thumbs-o-down";
                }
                $scope.notifications.push({
                    icon: "fa fa-fw " + icon,
                    text: $sce.trustAsHtml("<b>" + args.doneBy.split(" ")[0] + "</b> " + action + " your <span class=\"badge\">Task</span> " + taskName)
                });

                webNotification.showNotification('Task Feedback', {
                    body: args.doneBy.split(" ")[0] + " " + action + " your Task " + taskName,
                    icon: 'static/img/notification.png',
                    autoClose: 4000 
                }, function () {});
                $scope.notificationsStatus = true;

            } else if(args.eventType == "taskEvent") {
                $scope.notifications.push({
                    icon: "fa fa-fw fa-check",
                    text: $sce.trustAsHtml("<b>" + args.doneBy.split(" ")[0] + "</b> completed <span class=\"badge\">Task</span> " + taskName)
                });

                webNotification.showNotification('Task Event', {
                    body: args.doneBy.split(" ")[0] + " completed Task " + taskName,
                    icon: 'static/img/notification.png',
                    autoClose: 4000 
                }, function () {});
                $scope.notificationsStatus = true;
            }
            else if (args.eventType == "addTask") {
                $scope.notifications.push({
                    icon: "glyphicon glyphicon-plus small-glyph",
                    text: $sce.trustAsHtml("<span class=\"badge\">Task</span> <b>" + args.task.taskName + "</b> was added to the schedule. ")
                });

                webNotification.showNotification('Task Added', {
                    body: args.task.taskName + " was added to the schedule.",
                    icon: 'static/img/notification.png',
                    autoClose: 4000 
                }, function () {});
            }
            else if (args.eventType == "deleteTask") {
                args;
                $scope.notifications.push({
                    icon: "fa fa-fw fa-times",
                    text: $sce.trustAsHtml("<span class=\"badge\">Task</span> <b>" +task.taskName + "</b> was deleted from the schedule. ")
                });

                webNotification.showNotification('Task Deleted', {
                    body: task.taskName + " was deleted from the schedule.",
                    icon: 'static/img/notification.png',
                    autoClose: 4000 
                }, function () {});
            }

            
        }
    };

    $scope.$on('taskFeedback', addNotification);
    $scope.$on('taskEvent', addNotification);
    $scope.$on('addTask', addNotification);
    $scope.$on('deleteTask', addNotification);
}]);