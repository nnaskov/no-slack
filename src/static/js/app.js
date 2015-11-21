'use strict';

var index_app = angular.module('app.index', []);

var app = angular.module('app.dashboard', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.tpls', 'angular.vertilize', 'angularMoment', 'ngAnimate', 'ui-iconpicker']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");
    //
    // Now set up the states
    $stateProvider
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "static/partials/dashboard.html",
            controller: 'TasksController',
            resolve: {
                tasks: ['taskService', function (taskService) {
                    return taskService.getTasks();
                }]
            },
        })
        .state("dashboard.addTask", {
            url: "/add/task",
            onEnter: function ($stateParams, $state, $uibModal) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'static/partials/addTask.html',
                    controller: 'AddTaskController'
                });

                modalInstance.result.then(function success() {
                    //Do success things
                }, function fail(reason) {
                    if (~reason.indexOf('backdrop')) {
                        $state.go("dashboard");
                    }
                });
            }
        })
        .state('house', {
            url: "/house",
            templateUrl: "static/partials/house.html",
            controller: "HouseController",
            resolve: {
                tasks: ['taskService', function (taskService) {
                    return taskService.getTasks();
                }],
                houseData: ['memberService', function (memberService) {
                    return memberService.getHouseData();
                }]
            }
        });
});

