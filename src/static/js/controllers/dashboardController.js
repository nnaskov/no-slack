app.controller('DashboardController', ['$scope', 'channelClientID', 'userID', '$log', 'channelService', 'memberService', '$sce', '$rootScope', function($scope, channelClientID, userID, $log, channelService, memberService, $sce, $rootScope){
    channelService.openChannel(channelClientID);
    
    $scope.userName = "Loading...";
    $scope.initials = "?";
    $scope.houseName = "Loading...";
    $scope.avatar = "static/img/blank-picture.jpg";
    $scope.notificationsOn = true;
    $scope.notifications = [];
    
    $scope.notificationsStatus = false;
    
    var houseData = memberService.getHouseData().then(function(data){
        if(data['users'][userID] !== undefined){
            var userData = data['users'][userID];
            var firstName = userData.firstName;
            var lastName = userData.lastName;
            var initials = userData.initials;
            var notificationsOn = userData.notificationsOn;
            $scope.userName = firstName+" "+lastName;
            $scope.initials = initials;
            $scope.houseName = data.name;
            $scope.avatar = "/requests/avatar/"+userID;
            $scope.notificationsOn = notificationsOn;
        }
    });
    
    $scope.refreshAvatar = function(){
        $scope.avatar = "/requests/avatar/"+userID+"?decache="+ Math.random();
    }
    
    var addNotification = function(ev, args){
        var task;
        if(args.taskId){
            task = $rootScope.tasks.filter(function(task){return task.taskID===args.taskId;})[0].task;    
        }
        
        var taskName;
        if(task != undefined){
            taskName = task.taskName;
        }
        else{
            taskName = task.taskID;
        }
        
        if(args.eventType == "taskFeedback"){
            var isPositive = ((args.positive - task.positiveFeedback) > 0);
            var action;
            if(isPositive==true) action = "liked";
            else action = "disliked";
            $scope.notifications.push({icon: "fa fa-fw fa-thumbs-o-up", text: $sce.trustAsHtml("<b>"+args.doneBy.split(" ")[0]+"</b> "+action+" your <span class=\"badge\">Task</span> "+taskName) });    
        }
        else if(args.eventType == "taskEvent"){
            $scope.notifications.push({icon: "fa fa-fw fa-tag", text: $sce.trustAsHtml("<b>"+args.doneBy.split(" ")[0]+"</b> completed <span class=\"badge\">Task</span> "+taskName) }); 
        }

        $scope.notificationsStatus = true;
    };
    
    $scope.$on('taskFeedback', addNotification);
    $scope.$on('taskEvent', addNotification);
    
    
}]);