app.controller('HouseController', ['$scope', '$http', 'houseData', 'tasks', 'cssInjector', 'userID', '$rootScope', function($scope, $http, houseData, tasks, cssInjector, userID, $rootScope) {
    $scope.houseData = houseData;
    $scope.tasks = tasks;
    
    $scope.users = houseData.users;
    
    $scope.random = [];
    $scope.decache = function(){
        return Math.random();
    }

    
    Object.keys($scope.users).forEach(function(val, key, arr){
        $scope.random[val] = $scope.decache();
    })
    
    cssInjector.removeAll();
    cssInjector.add("../static/bower_components/angular-chart.js/dist/angular-chart.min.css");   
    
    
    
}]);