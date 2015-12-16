'use strict';

var index_app = angular.module('app.index', []);

var app = angular.module('app.dashboard', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.tpls', 'ngAnimate', 'ui-iconpicker', 'chart.js', 'as.sortable', 'ngSanitize', 'ngProgress', 'angularMoment']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/dashboard");
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
                    templateUrl: 'static/partials/taskForm.html',
                    controller: 'TaskFormController',
                    resolve: {
                        task: function(){ return null; }
                    }
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
        .state("dashboard.editTask", {
            url: "/edit/task/:taskID",
            onEnter: function ($stateParams, $state, $uibModal, task) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'static/partials/taskForm.html',
                    controller: 'TaskFormController',
                    resolve: {
                        task: function(){return task;}
                    }
                });
                modalInstance.result.then(function success() {
                    //Do success things
                }, function fail(reason) {
                    if (~reason.indexOf('backdrop')) {
                        $state.go("dashboard", null);
                    }
                });
            },
            resolve: {
                task: ['taskService', '$stateParams', function (taskService, $stateParams) {
                    return taskService.getTaskByID($stateParams.taskID);
                }]
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
        .state('settings', {
            url: "/settings",
            templateUrl: "static/partials/settings.html",
            controller: "SettingsController"
        });
});

app.run(function($rootScope, ngProgressFactory) {    
    $rootScope.$on("$stateChangeStart", function () {
        $rootScope.progressbar = ngProgressFactory.createInstance();
        $rootScope.progressbar.setColor("#000");
        $rootScope.progressbar.start();
    });

    $rootScope.$on("$stateChangeSuccess", function () {
        $rootScope.progressbar.complete();
    });
});