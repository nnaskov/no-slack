app.directive('historyPopover', ['$http', '$compile', '$templateCache', '$log', function($http, $compile, $templateCache, $log) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            taskId: '@'
        },
        template:
        '<span popover-placement="bottom" ' +
        '      uib-popover-template="\'../static/partials/eventHistory.html\'" ' +
        '      popover-trigger="click" ' +
        '      popover-title="History" ' +
        '      popover-append-to-body="true" ' +
        '      class="glyphicon glyphicon-list glyph-button" aria-hidden="true">' +
        '</span>',
        link: function(scope, elem, attrs) {
            scope.taskEvents = null;
            
            scope.loadHistory = function(){
                $http({
                    method: 'GET',
                    params: {'taskID': scope.taskId},
                    url: '/requests/task/' + scope.taskId + '/taskevent'
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