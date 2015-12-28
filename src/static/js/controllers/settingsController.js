app.controller('SettingsController', ['$scope', '$http', 'Upload', '$timeout', function ($scope, $http, Upload, $timeout) {
    $scope.tenantName = "Loading...";
    $scope.originalTenantName = undefined;

    $scope.houseName = "Loading...";
    $scope.houseNameExists = false;
    $scope.originalHouseName = undefined;
    
    $scope.submitted = false;

    $scope.$watch('submitted', function (newValue, oldValue) {
        if(newValue===true){
            $timeout(function(){$scope.submitted=false;}, 3000);
        }
    });

    $scope.$watch('$parent.notificationsOn', function (newValue, oldValue) {
        $scope.notifications = (newValue === true) ? "true" : "false";
    });

    $scope.$watch('$parent.userName', function (newValue, oldValue) {
        $scope.tenantName = newValue;
        if ($scope.originalTenantName === undefined && newValue !== "Loading...") {
            $scope.originalTenantName = newValue;
        }
    });

    $scope.$watch('tenantName', function (newValue, oldValue) {
        if (newValue !== undefined) {
            $scope.$parent.userName = newValue;
        }
    });

    $scope.$watch('$parent.houseName', function (newValue, oldValue) {
        $scope.houseName = newValue;
        if ($scope.originalHouseName === undefined && newValue !== "Loading...") {
            $scope.originalHouseName = $scope.houseName;
        }
    });

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

    $scope.submit = function () {
        var firstName = $scope.tenantName.split(" ")[0];
        var lastName = $scope.tenantName.split(" ")[1];
        var houseName = $scope.houseName;
        var avatar = $scope.file;

        if (avatar) {
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

    $scope.dismiss = function () {
        $scope.tenantName = $scope.originalTenantName;
        $scope.houseName = $scope.originalHouseName;
        $scope.notifications = "true";
    }
}]);