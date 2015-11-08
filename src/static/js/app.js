'use strict';

var index_app = angular.module('app.index',[]);

var app = angular.module('app.dashboard', ['ui.router', 'ui.bootstrap','ui.bootstrap.tpls','angular.vertilize', 'angularMoment', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");
    //
    // Now set up the states
    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "static/partials/dashboard.html",
            controller: 'TasksController'
        })
        .state("dashboard.addTask", {
        url: "/add/task",
        onEnter: function($stateParams, $state, $uibModal) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'static/partials/addTask.html',
                controller: 'AddTaskController'
            });
            
            modalInstance.result.then(function success(){
                //Do success things
            },function fail(reason){
                if( ~reason.indexOf('backdrop') ){ 
                    $state.go("dashboard");
                }
            });
        }})
        .state('house', {
            url: "/house",
            templateUrl: "static/partials/house.html",
            controller: function(){
            }
        })
    ;
});

app.factory('taskService', function ($http, $q, $timeout) {
    return {
        loadTasks: function (data) {
            var defer = $q.defer();
            
            $http({
                method: 'GET',
                url: '/requests/task'
            }).then(function successCallback(response) {
                    // successful http request, resolve after two seconds
                    $timeout(function() {
                        defer.resolve(response);
                    }, 500)
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
                return defer.promise;
        }
            
        };
    }
);