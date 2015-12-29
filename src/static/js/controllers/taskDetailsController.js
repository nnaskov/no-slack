app.controller('TaskDetailsController', ['$scope', '$state', '$http', '$uibModalInstance', '$state', '$stateParams', '$log','taskService', 'task', 'cssInjector' , function ($scope, $state, $http, $uibModalInstance, $state, $stateParams, $log, taskService, task, cssInjector) {
    cssInjector.removeAll();
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go("dashboard", null);
    };
}]);