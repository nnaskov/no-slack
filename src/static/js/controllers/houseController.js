/**
* House Controller manages the partials/analysis.html page
* It provides the data for the house statistics
*/
app.controller('HouseController', ['$scope', '$http', 'houseData', 'tasks', 'cssInjector', 'userID', '$rootScope', function($scope, $http, houseData, tasks, cssInjector, userID, $rootScope) {
    //populates the house data
    $scope.houseData = houseData;
    //populates the tasks in the template
    $scope.tasks = tasks;
    //populates basic information about the flatmates
    $scope.users = houseData.users;
    
    //decaches the profile pictures of the flatmates
    $scope.random = [];
    $scope.decache = function(){
        return Math.random();
    }

    Object.keys($scope.users).forEach(function(val, key, arr){
        $scope.random[val] = $scope.decache();
    })
    
    //removes all unnecessary css files injected by previous controllers
    cssInjector.removeAll();
    //injects a page-specific css file for displaying beautiful charts
    cssInjector.add("../static/bower_components/angular-chart.js/dist/angular-chart.min.css");   
}]);