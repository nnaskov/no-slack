app.controller('SettingsController', ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
    $scope.tenantName = "Loading...";
    $scope.originalTenantName = undefined;

    $scope.houseName = "Loading...";
    $scope.houseNameExists = false;
    $scope.originalHouseName = undefined;
    
    $scope.notifications = "true";

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

        var upload = Upload.upload({
            url: '/requests/member',
            method: 'PUT',
            data: {avatar: avatar, firstName: firstName, lastName: lastName, notificationsOn: $scope.notifications, houseName: houseName}
        });
        
        // returns a promise
        /*upload.then(function(resp) {
            // file is uploaded successfully
            console.log('file ' + resp.config.data.file.name + 'is uploaded successfully. Response: ' + resp.data);
        }, function(resp) {
            // handle error
        }, function(evt) {
            // progress notify
            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.data.file.name);
        });*/
    };

    $scope.dismiss = function () {
        $scope.tenantName = $scope.originalTenantName;
        $scope.houseName = $scope.originalHouseName;
        $scope.notifications = "true";
    }
}]);