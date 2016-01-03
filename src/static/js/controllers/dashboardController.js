/**
 * The Dashboard controller is present on every page of the application and manages the main layout 
 * templates/dashboard.html
 * It makes sure the dashboard of the app is personalised according to the user who logged in into it
 **/
app.controller('DashboardController', ['$scope', 'channelClientID', 'userID', '$log', 'channelService', 'memberService', '$sce', '$rootScope', 'webNotification', '$http', '$location', 'taskService', '$state', '$filter', function ($scope, channelClientID, userID, $log, channelService, memberService, $sce, $rootScope, webNotification, $http, $location, taskService, $state, $filter) {
    /**
     * the Channel API service opens a new socket and obtains a new token if necessary
     **/
    channelService.openChannel(channelClientID);

    /**
     * This method refreshes the data presented in task tiles on the main page without refreshing
     * the page and orders them by their priority (called "order" in this case)
     **/
    $scope.refreshTasks = function () {
        taskService.getTasks().then(function (tasks) {
            $scope.tasks = tasks;
            $scope.tasks = $filter('orderBy')($scope.tasks, '+order');
            $location.search({});
        });
    }

    /**
     * refreshes the entire dashboard route (see app.js; state: dashboard) forcing the controller to refresh
     * and reresolve his dependencies i.e. it guarantees the latest set of tasks for the house will be retrieved
     * see https://github.com/angular-ui/ui-router/wiki/Quick-Reference#statetransitiontoto-toparams--options
     * see http://stackoverflow.com/questions/22730868/ui-routers-resolve-functions-are-only-called-once
     **/
    $scope.refreshDashboard = function () {
        $state.transitionTo('dashboard', {
            refresh: "true"
        }, {
            reload: true,
            inherit: true,
            notify: true
        });
    }

    /**
     * Default values (placeholders) to be printed in the dashboard layout navbar before the actual data is loaded from the database
     * e.g. before the name of the user and his profile picture is loaded it will replace them with "Loading..." and a blank jpef image respectively
     **/
    $scope.userName = "Loading...";
    $scope.initials = "?";
    $scope.houseName = "Loading...";
    $scope.avatar = "static/img/blank-picture.jpg";

    /**
     * Are notifications switched on for this users
     * Default is true
     */
    $scope.notificationsOn = true;

    /**
     * Array with the notifications received since last refresh are stored here
     * These are contained in the notification dropdown (when you click on the bell or the username in the navbar)
     **/
    $scope.notifications = [];

    /**
     * Is the notification dropdown opened for this user at the moment
     * Default is false
     **/
    $scope.notificationsStatus = false;

    /**
     * The Member service loads the logged-in user's name, profile picture and initials
     * It also loads his current settings details s.a. whether notifications are switched on or off
     */
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

    /**
     * This method populates the house the user is subscribed to 
     * with random dummy data
     **/
    $scope.populate = function () {
        $rootScope.progressbar.reset();
        $rootScope.progressbar.start();
        $http.get('/requests/populate', {}).then(function () {
            $rootScope.progressbar.complete();
            $scope.refreshDashboard();
        });
    }

    /**
     * This method generated decached image paths to the avatars of users
     * i.e. it forces the browser to download the avatar every time angularjs loads an html template
     * which requires profile pictures to be loaded.
     * We do this so that when a user changes his profile picture, his fellow flatmates will see the update automatically
     * without the need to refresh the application in the browser
     * see http://stackoverflow.com/questions/18845298/forcing-a-ng-src-reload
     */
    $scope.refreshAvatar = function () {
        $scope.avatar = "/requests/avatar/" + userID + "?decache=" + Math.random();
    }

    /**
     * This processes events received by the rootscope from the channel service
     * who were then broadcasted down the tree by the root scope
     * For certain type of events it adds a Facebook-like notification in a dropdown in the navbar
     * as well as a browser notification if the browser supports it and agrees to enable it
     **/
    var addNotification = function (ev, args) {
        //checks if this user has enabled receiving notifications
        if ($scope.notificationsOn === true) {
            var task;
            //if the received event contains a task ID retrieve the respective task from a local copy of tasks
            if (args.taskId) {
                task = $rootScope.tasks.filter(function (task) {
                    return task.taskID === args.taskId;
                })[0];
            }

            //try to retrieve the task name of the task in question or if you fail just return its ID
            var taskName;
            if (task != undefined) {
                taskName = task.taskName;
            } else {
                taskName = args.taskId;
            }

            //here we handle the event triggered by a user giving feedback to a completed task
            //this event is dispatched to everyone but the person who did it
            if (args.eventType == "taskFeedback") {
                //determine whether it was a positive or a negative feedback
                var isPositive = (args.positive > (task.positiveFeedback !== undefined ? task.positiveFeedback : 0));
                
                //based on that decide what kind of an icon and an action verb you are going to use in the notification message
                var action, icon;
                if (isPositive == true) {
                    action = "liked";
                    icon = "fa-thumbs-o-up";
                } else {
                    action = "disliked";
                    icon = "fa-thumbs-o-down";
                }
                
                //display it in the notification dropdown in the navbar
                $scope.notifications.push({
                    icon: "fa fa-fw " + icon,
                    text: $sce.trustAsHtml("<b>" + args.doneBy.split(" ")[0] + "</b> " + action + " your <span class=\"badge\">Task</span> " + taskName)
                });

                //display it as a browser notification
                webNotification.showNotification('Task Feedback', {
                    body: args.doneBy.split(" ")[0] + " " + action + " your Task " + taskName,
                    icon: 'static/img/notification.png',
                    autoClose: 4000
                }, function () {});
                
                //show the notification dropdown in the navbar
                $scope.notificationsStatus = true;

            } 
            //here we handle the event triggered by a user completing a task
            //this event is dispatched to everyone but the person who did it
            else if (args.eventType == "taskEvent") {
                //display it in the notification dropdown in the navbar
                $scope.notifications.push({
                    icon: "fa fa-fw fa-check",
                    text: $sce.trustAsHtml("<b>" + args.doneBy.split(" ")[0] + "</b> completed <span class=\"badge\">Task</span> " + taskName)
                });

                //display it as a browser notification
                webNotification.showNotification('Task Event', {
                    body: args.doneBy.split(" ")[0] + " completed Task " + taskName,
                    icon: 'static/img/notification.png',
                    autoClose: 4000
                }, function () {});
                
                //show the notification dropdown in the navbar
                $scope.notificationsStatus = true;
            } 
            //here we handle the event triggered by a user adding a new task to the house he is in
            //this event is dispatched to everyone but the person who did it
            else if (args.eventType == "addTask") {
                //display it in the notification dropdown in the navbar
                $scope.notifications.push({
                    icon: "glyphicon glyphicon-plus small-glyph",
                    text: $sce.trustAsHtml("<span class=\"badge\">Task</span> <b>" + args.task.taskName + "</b> was added to the schedule. ")
                });

                //display it as a browser notification
                webNotification.showNotification('Task Added', {
                    body: args.task.taskName + " was added to the schedule.",
                    icon: 'static/img/notification.png',
                    autoClose: 4000
                }, function () {});
            } 
            //here we handle the event triggered by a user deleting a task from the house he is in
            //this event is dispatched to everyone but the person who did it
            else if (args.eventType == "deleteTask") {
                //display it in the notification dropdown in the navbar
                $scope.notifications.push({
                    icon: "fa fa-fw fa-times",
                    text: $sce.trustAsHtml("<span class=\"badge\">Task</span> <b>" + task.taskName + "</b> was deleted from the schedule. ")
                });

                //display it as a browser notification
                webNotification.showNotification('Task Deleted', {
                    body: task.taskName + " was deleted from the schedule.",
                    icon: 'static/img/notification.png',
                    autoClose: 4000
                }, function () {});
            }
        }
    };

    //binding Channel API events to local event handlers
    $scope.$on('taskFeedback', addNotification);
    $scope.$on('taskEvent', addNotification);
    $scope.$on('addTask', addNotification);
    $scope.$on('deleteTask', addNotification);
    /**
    * This event is triggered when someone presses the "+" sign in the navbar
    * and repopulates his house with dummy random tasks
    * It is received from everyone but the person who triggered it
    */
    $scope.$on('populatedEvent', function (ev, args) {
        $scope.refreshDashboard();
    });
}]);