/**
* The history popover is a custom directive that allows the user to examine the history of task events of each task
* within a bootstrap popover by clicking on the rightmost icon of a task tile
* see https://docs.angularjs.org/guide/directive
* see partials/dashboard.html
*/
app.directive('historyPopover', ['$http', '$log', function($http, $log) {
    return {
        /**
        * we can match this directive as an element or an attribute
        * e.g. both <history-popover>... and <... history-popover="..." ..> will activate it
        */
        restrict: 'EA',
        //replaces our custom tag/attribute with the template
        replace: true,
        /**
        * we create an isolated scope and bind our local var "task" with whatever variable is passed in 
        * the task attribute in the history popover tag
        * e.g. <history-popover task="whateverVar">...</..>
        */
        scope: {
            task: '='
        },
        /**
        * This is the html we replace our history popover tag with
        * it initializes a bootstrap popover template
        * see partials/eventHistory.html
        * see https://angular-ui.github.io/bootstrap/#/popover
        */
        template:
        '<span popover-placement="bottom" ' +
        '      uib-popover-template="\'../static/partials/eventHistory.html\'" ' +
        '      popover-trigger="click" ' +
        '      popover-append-to-body="true" ' +
        '      popover-title="{{task.taskName}}: History" ' +
        '      class="glyphicon glyphicon-list glyph-button" aria-hidden="true">' +
        '</span>',
        /**
        * Retrieves the required task history and replaces it
        * in the popover template above
        */
        link: function(scope, elem, attrs) {
            scope.taskEvents = null;
            
            scope.loadHistory = function(){
                $http({
                    method: 'GET',
                    params: {'taskID': scope.task.taskID},
                    url: '/requests/task/' + scope.task.taskID + '/taskevent'
                }).then(function successCallback(response) {
                    scope.taskEvents = response.data;  
                    scope.taskEvents.map(function(event){ event.date = new Date(event.date).getTime(); });
                });
            };
            
            elem.bind('click', function() {
                scope.loadHistory();    
            });
            
            scope.loadHistory();
        }
    };
}]);