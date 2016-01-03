/**
* The Register Controller manages the registration step of the application
* It checks if the house name is already used and if true assigns the user to the existing house
* if not it creates a new house
* it submits the already validated form to the backend
**/
index_app.controller('RegisterController', ['$scope', '$http', function($scope, $http) {
    $scope.$watch('housename', function(newValue, oldValue) {
        $http({
            method: "GET",
            url: "/requests/house/check/" + newValue,
        }).success(function (data) {
            $scope.houseNameExists = data.exists;
        });
    });    
    
    $scope.submit = function(){
        var data = {'firstName': $scope.firstname, 'lastName': $scope.lastname, 'houseName': $scope.housename}; 
        var res = $http.post('/register', data);
        res.success(function(data, status, headers, config) {
            window.location.replace(data.redirect);
        });
        res.error(function(data, status, headers, config) {
            alert("The query can't be processed at the moment. Please try again later.");
        });
    };
}]);

