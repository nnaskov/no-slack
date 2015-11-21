app.controller('AddTaskController', function ($scope, $state, $http, $uibModalInstance) {
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
        var frequency = undefined;
        switch($scope.frequencyValue) {
            case 'days':
                frequency = $scope.frequencyValue*24;
                break;
            case 'weeks':
                frequency = $scope.frequencyValue*24*7;
                break;
            default:
                frequency = $scope.frequencyValue
                break;
        }
        $http({
            method: 'POST',
            data: {'name': $scope.nameField, 'iconClass': $scope.iconClass, 'description': $scope.descriptionField, 'frequency': frequency, 'difficulty': 1},
            url: '/requests/task/'
        }).then(function successCallback(response) {
            $uibModalInstance.close($scope);
            $state.go("dashboard");
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go("dashboard");
    };
});