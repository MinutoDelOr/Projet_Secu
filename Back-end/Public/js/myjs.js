(function(){
  'use strict'
  var app = angular.module('Application',['ngMaterial','ngRoute','ngMessages','material.svgAssetsCache']);


  app.controller('FirstController', ['$http', '$scope', function($http,$scope){
      $scope.resFacebook = [];
      $scope.resGoogle = [];
      $scope.resAutres = [];
      this.tt = "aaaaaaaa";
      $http.get("http://127.0.0.1:8080/site")
      .then(function(response){
        for(var i = 0; i < response.data.length; i++) {
          if (typeof response.data[i].URL != 'undefined'){
            if ((response.data[i].URL).indexOf("facebook") !== -1){
              $scope.resFacebook.push(response.data[i]);
            } else if (response.data[i].URL.indexOf("google") !== -1){
              $scope.resGoogle.push(response.data[i]);
            } else
              $scope.resAutres.push(response.data[i]);
            } else i++;
        }
      });



  }]);
})();
