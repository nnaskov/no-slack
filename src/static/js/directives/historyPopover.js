app.directive('historyPopover', ['$http', function($http) {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            taskId: '@'
        },
        template:
        '<span ng-transclude></span>'+
        '<span popover-placement="bottom" ' +
        '      uib-popover="eventHistory.html" ' +
        '      popover-trigger="click" ' +
        '      popover-title="History" ' +
        '      class="glyphicon glyphicon-list glyph-button" aria-hidden="true">' +
        '</span>',
        
        controller:function($scope){
            $http({
                method: 'GET',
                params: {'taskID': $scope.taskId},
                url: '/requests/task/' + $scope.taskId + '/taskevent'
            }).then(function successCallback(response) {
                $scope.taskEvents = response.data;          
            });
        }
    };
}]);

/*
app.directive('historyPopover', ['$http', '$compile', '$templateCache', '$q', function($http, $compile, $templateCache, $q) {
    var getTemplate = function(contentType) {
        var def = $q.defer();
        var template = $templateCache.get("eventHistory.html");
        if (typeof template === "undefined") {
            $http.get("templateId.html")
                .success(function(data) {
                $templateCache.put("eventHistory.htm", data);
                def.resolve(data);
            });
        } else {
            def.resolve(template);
        }
        return def.promise;
    };

    return {
        restrict: "A",
        scope: {
            item: "=" // what needs to be passed to the template
        },
        link: function(scope, element, attrs) {
            getTemplate().then(function(popOverContent) {
                var options = {
                    content: $compile($(popOverContent))(scope),
                    placement: "bottom",
                    html: true,
                    trigger: "hover"
                };
                $(element).popover(options);

            });
        }
    };
}]);*/