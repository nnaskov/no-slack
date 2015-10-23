'use strict';

var app = angular.module('app.dashboard', ['ngRoute']);

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

app.directive('username', ['$http', function($http) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      function validator(houseName) {

            if(houseName==="Jill"){
                ctrl.$setValidity('username', true);
            }
            else{
                ctrl.$setValidity('username', false);
            }

        $http(
          {
            method:"GET", 
            url: "/requests/checkhousename",
            params: {'houseName': houseName}
          }
        ).success(function(data){
            if(data.exists==true){
                ctrl.$setSubmitted('username', false);
            }
            else{
                ctrl.$setSubmitted('username', false);
            }
          }
        );

        return houseName;
      }
        
      ctrl.$parsers.push(validator);
    }
  };
}]);


$(function(){
    $('#houseName').on('keyup', function(e){
        var houseName = $("#houseName").val();
        if(houseName.length == 0){
            $("#create-join-house").html("Create or join a house");
        } else if(houseName.length < 4){
            $("#create-join-house").html("Enter 4 or more characters");
        } 
        else {
            $.ajax({
                type: "GET", url: "/requests/checkhousename", contentType: "application/json", dataType: "json", data: { 'houseName': houseName },
                success: function(data){
                    $("#create-join-house").html("Looking");
                    if(data.exists){
                        $("#create-join-house").html(houseName + " exists. We'll add you to it.");
                    } else {
                        $("#create-join-house").html(houseName + " does not exist. We'll create it.");
                    }
                }
            });
        }
    });
});

$(function(){
    $('#houseName').on('keydown', function(e){
        if((e.keyCode != 8) && ($('#houseName').val().length == 15) ){
            e.preventDefault();
        }
    });
});

$(function(){
    $('#firstName').on('keydown', function(e){
        if((e.keyCode != 8) && ($('#firstName').val().length == 15) ){
            e.preventDefault();
        }
    });
});

$(function(){
    $('#lastName').on('keydown', function(e){
        if((e.keyCode != 8) && ($('#lastName').val().length == 20) ){
            e.preventDefault();
        }
    });
});

//may not be used, filling names of register page on sign up
function fillnames(){
    $.ajax({
        type: "GET",
        url: "/requests/fillnames",
        contentType: "application/json",
        dataType: "json",
        success: function(data){
            $("#firstName").html(data.firstName);
            $("#lastName").html(data.lastName);
        }
    });
};

$(function(){
    $('#sign-up-btn').on('click', function (e){
        console.log("asdas");
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();
        var houseName = $('#houseName').val();
        if(houseName.length < 4){

        } else {
            $.ajax({
                type: "POST",
                url: "/register/",
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify({ 'firstName': firstName, 'lastName': lastName, 'houseName': houseName }),
                success: function(data){
                    window.location.replace(data.redirect);
                }
            });
        }
    });
});
