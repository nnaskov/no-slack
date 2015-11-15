app.controller('AddTaskController', function ($scope, $state, $uibModalInstance) {
    $scope.recurringOptions = ["Yes", "No"];
    $scope.recurring = "Yes";
    
    $scope.recurringType = "nOfPeriod";
    
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();
    
    $scope.status = {
        opened: false
    };
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.maxDate = new Date(2020, 5, 22);
    $scope.format = 'dd-MM-yyyy';
    
    $scope.open = function($event) {
        $scope.status.opened = true;
    };
    
    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go("dashboard");
    };
});