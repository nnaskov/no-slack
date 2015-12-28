app.controller('TaskFormController', ['$scope', '$state', '$http', '$uibModalInstance', '$state', '$stateParams', '$log','taskService', 'task', 'cssInjector' , function ($scope, $state, $http, $uibModalInstance, $state, $stateParams, $log, taskService, task, cssInjector) {
    cssInjector.removeAll();
    cssInjector.add("//rawgithub.com/angular/code.angularjs.org/master/1.4.8/angular-csp.css");
    cssInjector.add("../static/bower_components/ui-iconpicker-angular/dist/styles/ui-iconpicker.min.css");
    
    //typeahead
    $scope.commonTasks = ['Washing up', 'Clean kitchen', 'Hoovering', 'Rinse bathroom'];

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
    
    $scope.defaultIcon = "glyphicon glyphicon-asterisk";
    
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.maxDate = new Date(2020, 5, 22);
    $scope.format = 'dd-MM-yyyy';
    
    $scope.title = "Create new task";
    
    if(task != null){
        $scope.title = "Edit task "+task.taskName;
        $scope.edit = true;
        $scope.nameField = task.taskName;
        $scope.descriptionField = task.description;
        $scope.iconClass = task.taskStyle;
        $scope.defaultIcon = task.taskStyle;
        $scope.recurring = "Yes";
        $scope.frequencyValue = task.frequency;
    }
    
    $scope.open = function($event) {
        $scope.status.opened = true;
    };
    
    $scope.frequencyUnitOptions = [ {name: 'hours', value: 'hours'}, {name: 'days', value: 'days'}, {name: 'weeks', value: 'weeks'}, {name: 'months', value: 'months'}]; 
    $scope.frequencyUnit = $scope.frequencyUnitOptions[0].value;
        
    $scope.ok = function () {
        var frequency = undefined;
        switch($scope.frequencyUnit) {
            case 'days':
                frequency = $scope.frequencyValue*24;
                break;
            case 'weeks':
                frequency = $scope.frequencyValue*24*7;
                break;
            default:
                frequency = $scope.frequencyValue;
                break;
        }
        
        taskService.sendTask(undefined, $scope.nameField, $scope.iconClass, $scope.descriptionField, frequency).then(function (response) {
            $uibModalInstance.dismiss('cancel');
            $state.transitionTo('dashboard', {refresh:"true"}, { 
                reload: true, inherit: true, notify: true
            });
        });
    };

    $scope.update = function (){
        var frequency = undefined;
        switch($scope.frequencyUnit) {
            case 'days':
                frequency = $scope.frequencyValue*24;
                break;
            case 'weeks':
                frequency = $scope.frequencyValue*24*7;
                break;
            default:
                frequency = $scope.frequencyValue;
                break;
        }
        
        taskService.sendTask(task.taskID, $scope.nameField, $scope.iconClass, $scope.descriptionField, frequency).then(function (response) {
            $uibModalInstance.dismiss('cancel');
            $state.transitionTo('dashboard', {refresh:"true"}, { 
                reload: true, inherit: true, notify: true
            });
        });
    };

    $scope.delete = function (){
        taskService.deleteTask(task.taskID).then(function (response) {
            $uibModalInstance.dismiss('cancel');
            $state.transitionTo('dashboard', {refresh:"true"}, { 
                reload: true, inherit: true, notify: true
            });
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go("dashboard", null);
    };
}]);