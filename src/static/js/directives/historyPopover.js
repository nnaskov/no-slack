app.directive('historyPopover', ['$http', '$compile', '$templateCache', '$log', function($http, $compile, $templateCache, $log) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            task: '='
        },
        template:
        '<span popover-placement="bottom" ' +
        '      uib-popover-template="\'../static/partials/eventHistory.html\'" ' +
        '      popover-trigger="click" ' +
        '      popover-append-to-body="true" ' +
        '      popover-title="{{task.taskName}}: History" ' +
        '      class="glyphicon glyphicon-list glyph-button" aria-hidden="true">' +
        '</span>',
        link: function(scope, elem, attrs) {
            scope.taskEvents = null;
            
            scope.loadHistory = function(){
                $http({
                    method: 'GET',
                    params: {'taskID': scope.task.taskID},
                    url: '/requests/task/' + scope.task.taskID + '/taskevent'
                }).then(function successCallback(response) {
                    scope.taskEvents = response.data;  
                    scope.taskEvents.map((event) => (event.date = new Date(event.date).getTime()));
                });
            };
            
            elem.bind('click', function() {
                scope.loadHistory();    
            });
            
            scope.loadHistory();
        }
    };
}]);