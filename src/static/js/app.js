'use strict';

var index_app = angular.module('app.index',[]);

var app = angular.module('app.dashboard', ['ui.router', 'ui.bootstrap','angular.vertilize']);

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
        .state('house', {
            url: "/house",
            templateUrl: "static/partials/house.html",
            controller: function($scope){
            }
        })
    ;
});