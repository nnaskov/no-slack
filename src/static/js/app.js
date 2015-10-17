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



$(function(){
    $('#houseName').on('keyup', function(e){
        var houseName = $("#houseName").val();
        if(houseName.length == 0){
            $("#create-join-house").html("Create or join a house");
        } else if(houseName.length < 4){
            $("#create-join-house").html("Enter 4 or more characters");
        } else {
            $.ajax({
                type: "GET",
                url: "/requests/checkhousename",
                contentType: "application/json",
                dataType: "json",
                data: { 'houseName': houseName },
                success: function(data){
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
