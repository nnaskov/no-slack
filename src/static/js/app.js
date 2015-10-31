'use strict';

var index_app = angular.module('app.index',[]);
var app = angular.module('app.dashboard', ['ngRoute', 'ui.bootstrap','angular.vertilize']);

app.factory('myHttpInterceptor', function($rootScope, $q) {
  return {
    'requestError': function(config) {
      $rootScope.status = 'HTTP REQUEST ERROR ' + config;
      return config || $q.when(config);
    },
    'responseError': function(rejection) {
      $rootScope.status = 'HTTP RESPONSE ERROR ' + rejection.status + '\n' +
                          rejection.data;
      return $q.reject(rejection);
    },
  };
});


app.config(function($httpProvider) {
  $httpProvider.interceptors.push('myHttpInterceptor');
});


(function($) {
    "use strict"; // Start of use strict
    //tweaking the home page
    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });
})(jQuery); // End of use strict