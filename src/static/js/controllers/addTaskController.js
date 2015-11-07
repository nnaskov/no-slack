app.controller('AddTaskController', function ($scope, $state, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go("dashboard");
    };
});