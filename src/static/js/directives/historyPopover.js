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
        '      class="glyphicon glyphicon-list glyph-button" aria-hidden="true">' +
        '</span>',
        link: function(scope, elem, attrs) {
            scope.taskEvents = null;
            $http({
                method: 'GET',
                params: {'taskID': scope.taskId},
                url: '/requests/task/' + scope.taskId + '/taskevent'
            }).then(function successCallback(response) {
                scope.taskEvents = response.data;    
               
            });
        }
    };
}]);