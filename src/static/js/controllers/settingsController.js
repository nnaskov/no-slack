/**
* The Settings Controller applies and updates the settings of every user
* It retrieves the data recorded on the server and applies defaults if necessary
* It also submits settings changes to the backend
**/
app.controller('SettingsController', ['$scope', '$http', 'Upload', '$timeout', function ($scope, $http, Upload, $timeout) {
    /**
    * Placeholders used until the real data is retrieved from the server
    */
    $scope.tenantName = "Loading...";
    $scope.originalTenantName = undefined;
    $scope.houseName = "Loading...";
    
    /**
    * Keeps track whether the house name currently typed by the user already exists or not
    */
    $scope.houseNameExists = false;
    /**
    * Remembers the last submitted house name so that when the user decides to reset the form it
    * can rollback to the original value
    */
    $scope.originalHouseName = undefined;
    
    /**
    * Triggers an alert box on successful update of settings
    * After 3 seconds the alert box disappears
    */
    $scope.submitted = false;
    $scope.$watch('submitted', function (newValue, oldValue) {
        if(newValue===true){
            $timeout(function(){$scope.submitted=false;}, 3000);
        }
    });

    /**
    * Watches for settings updates in the Dashboard controller
    * which makes sure we have the latest settings at disposal without refreshing the page
    * The notificationsOn value determines whether notifications are displayed for the current user
    * The value here is later populated in the settings form
    */
    $scope.$watch('$parent.notificationsOn', function (newValue, oldValue) {
        $scope.notifications = (newValue === true) ? "true" : "false";
    });

    /**
    * The latest user name retrieved in the Dashboard controller
    * is populated in the settings form
    */
    $scope.$watch('$parent.userName', function (newValue, oldValue) {
        $scope.tenantName = newValue;
        if ($scope.originalTenantName === undefined && newValue !== "Loading...") {
            $scope.originalTenantName = newValue;
        }
    });
    
    /**
    * When the tenant name changes in the settings form
    * it updates in the navbar of the application
    */
    $scope.$watch('tenantName', function (newValue, oldValue) {
        if (newValue !== undefined) {
            $scope.$parent.userName = newValue;
        }
    });
    
    /**
    * It loads the house name from the Dashboard controller
    * into the settings form
    */
    $scope.$watch('$parent.houseName', function (newValue, oldValue) {
        $scope.houseName = newValue;
        if ($scope.originalHouseName === undefined && newValue !== "Loading...") {
            $scope.originalHouseName = $scope.houseName;
        }
    });

    /**
    * When the house name changes in the settings form
    * it updates in the navbar of the application
    */
    $scope.$watch('houseName', function (newValue, oldValue) {
        if (newValue !== $scope.originalHouseName && newValue !== "Loading...") {
            $http({
                method: "GET",
                url: "/requests/house/check/" + newValue,
            }).success(function (data) {
                $scope.houseNameExists = data.exists;

                if (newValue !== undefined && !$scope.houseNameExists) {
                    $scope.$parent.houseName = newValue;
                }
            });
        } else {
            $scope.$parent.houseName = newValue;
            $scope.houseName = newValue;
        }
    });

    /**
    * It updates the settings for the user
    * There are two cases for submission:
    * 1) with uploading a profile picture and 2) without
    */
    $scope.submit = function () {
        //retrieving the textual data from the form
        var firstName = $scope.tenantName.split(" ")[0];
        var lastName = $scope.tenantName.split(" ")[1];
        var houseName = $scope.houseName;
        var avatar = $scope.file;

        if (avatar) {
            //handling the image upload
            var upload = Upload.upload({
                url: '/requests/member',
                method: 'PUT',
                data: {
                    avatar: avatar,
                    firstName: firstName,
                    lastName: lastName,
                    notificationsOn: $scope.notifications,
                    houseName: houseName
                }
            });
            
            //resolving the uploading promise
            upload.then(function (resp) {
                $scope.$parent.notificationsOn = ($scope.notifications === 'true');
                avatar.result = resp.data;
                $scope.$parent.refreshAvatar();

            }, function (resp) {
                alert("There was a problem with uploading your avatar.");
            }, function (evt) {
                avatar.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                $scope.submitted = true;
            });
        }
        else{
            //this is the case where no new image is uploaded
            //we use an ordinary ajax query
            var data = {'firstName': firstName, 'lastName': lastName, 'houseName': houseName, notificationsOn: $scope.notifications, avatar: undefined};
            var res = $http.put('/requests/member', data,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: function(data){
                    return $.param(data);
                }
            });

            res.success(function(data, status, headers, config) {
                $scope.$parent.notificationsOn = ($scope.notifications === 'true');
                $scope.submitted = true;
            });

            res.error(function(data, status, headers, config) {
                alert("The query can't be processed at the moment. Please try again later.");
            });
        }
    };

    //method activated when user tries to reset the form
    $scope.dismiss = function () {
        $scope.tenantName = $scope.originalTenantName;
        $scope.houseName = $scope.originalHouseName;
        $scope.notifications = "true";
    }
}]);