app.controller('SettingsController', ['$scope', '$http', 'Upload', function ($scope, $http, Upload) {
    $scope.tenantName = "Loading...";
    $scope.originalTenantName = undefined;

    $scope.houseName = "Loading...";
    $scope.houseNameExists = false;
    $scope.originalHouseName = undefined;



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

            }, function (resp) {
                alert("There was a problem with uploading your avatar.");
            }, function (evt) {
                avatar.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
        else{
            var data = {'firstName': firstName, 'lastName': lastName, 'houseName': houseName, avatar: undefined};

            var res = $http.put('/requests/member', data);

            res.success(function(data, status, headers, config) {
                
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