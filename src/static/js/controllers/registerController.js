index_app.controller('RegisterController', ['$scope', '$http', function($scope, $http) {
    $scope.$watch('housename', function(newValue, oldValue) {
        $http({
            method: "GET",
            url: "/requests/checkhousename",
            params: {
                'houseName': newValue
            }
        }).success(function (data) {
            $scope.houseNameExists = data.exists;
        });
    });    
    
    $scope.submit = function(){
        var data = {'firstName': $scope.firstname, 'lastName': $scope.lastname, 'houseName': $scope.housename};
        
        var res = $http.post('/register', data);
        
        res.success(function(data, status, headers, config) {
            alert("Registration successful, "+ $scope.firstname+"!");
            window.location.replace(data.redirect); 
        });
        
        res.error(function(data, status, headers, config) {
            alert("The query can't be processed at the moment. Please try again later.");
        });
    };
}]);

