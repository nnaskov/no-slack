app.controller('SettingsController', ['$scope', '$http', function($scope, $http) {
    $scope.tenantName = "Loading...";
    $scope.originalTenantName = undefined;
    
    $scope.houseName = "Loading...";
    $scope.houseNameExists = false;
    $scope.originalHouseName = undefined;
    
    $scope.$watch('$parent.userName', function(newValue, oldValue) {
        $scope.tenantName = newValue;
        if($scope.originalTenantName === undefined && newValue!=="Loading..."){
            $scope.originalTenantName = newValue;
        }
    });
    
    $scope.$watch('tenantName', function(newValue, oldValue) {
        if(newValue !== undefined){
            $scope.$parent.userName = newValue;
        }
    });
    
    $scope.$watch('$parent.houseName', function(newValue, oldValue) {
        $scope.houseName = newValue;
        if($scope.originalHouseName === undefined && newValue!=="Loading..."){
            $scope.originalHouseName = $scope.houseName;
        }
    });

    $scope.$watch('houseName', function(newValue, oldValue) {
        if(newValue!==$scope.originalHouseName){
            $http({
                method: "GET",
                url: "/requests/house/check/" + newValue,
            }).success(function (data) {
                $scope.houseNameExists = data.exists;

                if(newValue !== undefined && !$scope.houseNameExists){
                    $scope.$parent.houseName = newValue;
                }
            }); 
        }
        else{
            $scope.$parent.houseName = newValue;
            $scope.houseName = newValue;
        }
    });
    
    $scope.dismiss = function(){
        $scope.tenantName = $scope.originalTenantName;
        $scope.houseName = $scope.originalHouseName;
    }
}]);