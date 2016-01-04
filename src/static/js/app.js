'use strict';
/**
 * bootstrapping the index pre-authentication module which takes the user
 * through the registration process
 * see templates/register.html
 */
var index_app = angular.module('app.index', []);

/**
 * bootstrapping the dashboard post-authentication module 
 * which contains the rest of the app functionality
 * see templates/dashboard.html
 */
var app = angular.module('app.dashboard', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.tpls', 'ui.sortable', 'ngAnimate', 'ui-iconpicker', 'chart.js', 'ngSanitize', 'ngProgress', 'angularMoment', 'ngFileUpload', 'angular-web-notification', 'angular.css.injector']);

/**
 * Configure the routing of the angular app
 * see https://github.com/angular-ui/ui-router
 */
app.config(function ($stateProvider, $urlRouterProvider) {
    //if route is unrecognised redirect to #/dashboard by default
    $urlRouterProvider.otherwise("/dashboard");
    /**
     * Here we define all the routes:
     * 1) dashboard is the index page where we load all the task tiles in a house
     * 2) dashboard.loadTask is the task details page which opens a modal when you click on a task tile
     * 3) dashboard.addTask loads a modal with the "add new task" form
     * 4) dashboard.editTask loads a modal with the "edit task x" form
     * 5) dashboard.house loads charts containing overall and member specific statistics
     * 6) dashboard.settings loads a form where a user can change his settings
     */
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
        .state('dashboard.loadTask', {
            url: "/task/load/:taskID",
            onEnter: function ($stateParams, $state, $uibModal, task) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'static/partials/taskDetails.html',
                    controller: 'TaskDetailsController',
                    resolve: {
                        task: function () {
                            return task;
                        }
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
        .state("dashboard.addTask", {
            url: "/task/add",
            onEnter: function ($stateParams, $state, $uibModal) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'static/partials/taskForm.html',
                    controller: 'TaskFormController',
                    resolve: {
                        task: function () {
                            return null;
                        }
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
            url: "/task/edit/:taskID",
            onEnter: function ($stateParams, $state, $uibModal, task) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'static/partials/taskForm.html',
                    controller: 'TaskFormController',
                    resolve: {
                        task: function () {
                            return task;
                        }
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

/**
 * This makes sure that progress bar will be launched every time we change a route
 */
app.run(function ($rootScope, ngProgressFactory) {
    $rootScope.progressbar = ngProgressFactory.createInstance();
    $rootScope.progressbar.setColor("#000");

    $rootScope.$on("$stateChangeStart", function () {
        $rootScope.progressbar.reset();
        $rootScope.progressbar.start();
    });

    $rootScope.$on("$stateChangeSuccess", function () {
        $rootScope.progressbar.complete();
    });
});

/**
* Filter to convert seconds to javascript Date object
*/
app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])