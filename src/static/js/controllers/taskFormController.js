/**
* Task Form Controller manages the form for adding and editing tasks
* The same controller manages the same view and determines whether we are editing or adding a new task
* by whether we inject a task object into the controller prior to loading it
*/
app.controller('TaskFormController', ['$scope', '$state', '$http', '$uibModalInstance', '$state', '$stateParams', '$log','taskService', 'task', 'cssInjector' , function ($scope, $state, $http, $uibModalInstance, $state, $stateParams, $log, taskService, task, cssInjector) {
    //removing unnecessary css and injecting only the stylesheets we need
    cssInjector.removeAll();
    cssInjector.add("//rawgithub.com/angular/code.angularjs.org/master/1.4.8/angular-csp.css");
    cssInjector.add("../static/bower_components/ui-iconpicker-angular/dist/styles/ui-iconpicker.min.css");
    
    //list of common tasks to be loaded in the typeahead as suggestions when the user starts typing in the task name field in the form
    $scope.commonTasks = ['Washing up', 'Clean kitchen', 'Hoovering', 'Rinse bathroom', 'Do the dishes', 'Unclog the sink', 'Unclog the toilet', 'Empty the bin', 'Clear the fridge', 'Tidy up living room', 'Tidy up hallway', , 'Tidy up lounge'];

    //loading today's date in the datepicker field
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    //the datepicker is closed by default
    $scope.status = {
        opened: false
    };
    
    //default icon loaded in the iconpicker
    $scope.defaultIcon = "glyphicon glyphicon-asterisk";
    
    //defining the min and max date for the datepicker as well as the accepted date format
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.maxDate = new Date(2020, 5, 22);
    $scope.format = 'dd-MM-yyyy';
    
    /**
    * Difficulty slider implemented using ui.bootstrap.rating
    * Default is 5 out of 10
    */
    $scope.difficulty = 5;
    $scope.max = 10;
    $scope.isReadonly = false;
    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = value * 10;
    };
    
    //title of the modal
    $scope.title = "New Task";
    
    //loading the frequency options and the default unit
    $scope.frequencyUnitOptions = [ {name: 'hours', value: 'hours'}, {name: 'days', value: 'days'}, {name: 'weeks', value: 'weeks'}, {name: 'months', value: 'months'}]; 
    $scope.frequencyUnit = $scope.frequencyUnitOptions[0].value;
    
    /**
    * If a task is injected in the controller (see app.js; state: dashboard.editTask; resolve)
    * we are editing the respective task instead of adding a new one
    * here we change the template accordingly
    */
    if(task !== null){
        $scope.title = "Edit task "+task.taskName;
        $scope.edit = true;
        $scope.nameField = task.taskName;
        $scope.descriptionField = task.description;
        $scope.iconClass = task.taskStyle;
        $scope.defaultIcon = task.taskStyle;
        $scope.difficulty = task.difficulty;

        /**
        * we are automatically determining the frequency unit type by the value
        * e.g. we convert 86400 seconds (which is what we get from the database) to 1 day in the form
        */
        var frequency = task.frequency;
        if(frequency % (24*30) === 0){
            $scope.frequencyValue = frequency / (24*30);
            $scope.frequencyUnit = "months";
        }
        else if(frequency % (24*7) === 0){
            $scope.frequencyValue = frequency / (24*7);
            $scope.frequencyUnit = "weeks";
        }
        else if(frequency % 24 === 0){
            $scope.frequencyValue = frequency / 24;
            $scope.frequencyUnit = "days";
        }
        else{
            $scope.frequencyValue = frequency;
            $scope.frequencyUnit = "hours";
        }
    }
    
    $scope.open = function($event) {
        $scope.status.opened = true;
    };
    
    //converts the frequency input from the form from days/months/weeks/days to hours
    var convertToHours = function(value, type){
        var frequency;
        switch(type) {
            case 'hours':
                frequency = value;
                break;
            case 'days':
                frequency = value*24;
                break;
            case 'weeks':
                frequency = value*24*7;
                break;
            case 'months':
                frequency = value*24*30;
                break;
            default:
                frequency = value;
                break;
        }
        return frequency;
    };
    
    //this method is called when we add a new task
    $scope.ok = function () {
        var frequency = convertToHours($scope.frequencyValue,$scope.frequencyUnit);
        taskService.sendTask(undefined, $scope.nameField, $scope.iconClass, $scope.descriptionField, frequency, $scope.difficulty).then(function (response) {
            $uibModalInstance.dismiss('cancel');
            $state.transitionTo('dashboard', {refresh:"true"}, { 
                reload: true, inherit: true, notify: true
            });
        });
    };

    //this method is called when we edit an existing task
    $scope.update = function (){
        var frequency = convertToHours($scope.frequencyValue,$scope.frequencyUnit);
        taskService.sendTask(task.taskID, $scope.nameField, $scope.iconClass, $scope.descriptionField, frequency, $scope.difficulty).then(function (response) {
            $uibModalInstance.dismiss('cancel');
            $state.transitionTo('dashboard', {refresh:"true"}, { 
                reload: true, inherit: true, notify: true
            });
        });
    };

    //this method is called when we delete the current task
    $scope.delete = function (){
        taskService.deleteTask(task.taskID).then(function (response) {
            $uibModalInstance.dismiss('cancel');
            $state.transitionTo('dashboard', {refresh:"true"}, { 
                reload: true, inherit: true, notify: true
            });
        });
    };

    //this method is called when we close the modal using the cancel button
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $state.go("dashboard", null);
    };
}]);