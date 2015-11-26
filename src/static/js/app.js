'use strict';

var index_app = angular.module('app.index', []);

var app = angular.module('app.dashboard', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.tpls', 'ngAnimate', 'ui-iconpicker', 'chart.js', 'as.sortable', 'ngSanitize']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");
    //
    // Now set up the states
    $stateProvider
        .state('dashboard', {
            url: "/dashboard?refresh",
            templateUrl: "static/partials/dashboard.html",
            controller: 'TasksController',
            resolve: {
                tasks: ['taskService', function (taskService) {
                    return taskService.getTasks();
                }]
            },
            reloadOnSearch: false,
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
                        $state.go("dashboard", null);
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
        })
        .state('analysis', {
            url: "/analysis",
            templateUrl: "static/partials/analysis.html",
            controller: "AnalysisController"
        });
});