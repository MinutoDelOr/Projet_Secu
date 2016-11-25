(function(){
  'use strict'
  var app = angular.module('Application',['ngMaterial','ngRoute','ngMessages','material.svgAssetsCache']);

  app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
  $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
  $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
  $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});
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

  app.controller('SiteController', ['$http', '$scope', function($http,$scope){

      $scope.joursFB = [];
      $scope.nbFB = [];

      $scope.joursGoogle = [];
      $scope.nbGoogle = [];

      $scope.joursAutres = [];
      $scope.nbAutres = [];

      $scope.ctx = document.getElementById("myChart1");
      $scope.ctxg = document.getElementById("myChart2");

      $http.get("http://127.0.0.1:8080/site")
      .then(function(response){
        for(var i = 0; i < response.data.length; i++) {
          if (typeof response.data[i].URL != 'undefined'){
            if ((response.data[i].URL).indexOf("facebook") !== -1){
              $scope.date = response.data[i].date.split('T')[0].split("-");
              $scope.date = $scope.date[2] +"/" + $scope.date[1] + "/" + $scope.date[0].split('0')[1];
              if($scope.joursFB.indexOf($scope.date) >= 0){
                $scope.nbFB[$scope.joursFB.indexOf($scope.date)] = $scope.nbFB[$scope.joursFB.indexOf($scope.date)] + 1;
              }
              else{
                $scope.joursFB.push($scope.date);
                $scope.nbFB[$scope.joursFB.indexOf($scope.date)] = 1;
              }
            }

            if ((response.data[i].URL).indexOf("google") !== -1){
              $scope.date = response.data[i].date.split('T')[0].split("-");
              $scope.dateg = $scope.date[2] +"/" + $scope.date[1] + "/" + $scope.date[0].split('0')[1];
              if($scope.joursGoogle.indexOf($scope.dateg) >= 0){
                $scope.nbGoogle[$scope.joursGoogle.indexOf($scope.dateg)] = $scope.nbGoogle[$scope.joursGoogle.indexOf($scope.dateg)] + 1;
              }
              else{
                $scope.joursGoogle.push($scope.dateg);
                $scope.nbGoogle[$scope.joursGoogle.indexOf($scope.dateg)] = 1;
              }
            }

          }
        }
      });

      $scope.option = {
        title: {
          display: true,
          text: "Nombre d'identifiants récupérés par jour"
        },
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Date"
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Occurences"
            }
          }]
        }
      };

      $scope.donneesfb = {
        labels: $scope.joursFB,
        datasets: [
          {
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: true,
            spanGaps: false,
            lineTension: 0.1,
            data: $scope.nbFB
          }
        ]
      };

      $scope.donneesg = {
        labels: $scope.joursGoogle,
        datasets: [
          {
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            fill: true,
            spanGaps: false,
            lineTension: 0.1,
            data: $scope.nbGoogle
          }
        ]
      };

$scope.myBarChart = new Chart($scope.ctx, {
        type: 'line',
        data: $scope.donneesfb,
        options: $scope.option
      });

$scope.myBarChartg = new Chart($scope.ctxg, {
        type: 'line',
        data: $scope.donneesg,
        options: $scope.option
      });

  }]);



  app.controller('ChartController', ['$http', '$scope', function($http,$scope){
      $scope.nbIdentifiants = [0,0,0];
      $scope.sites = ["Facebook", "Google", "Autres"];
      $scope.background_color = ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)'];
      $scope.border_color = ['rgba(255,99,132,1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)'];
      $scope.ctx = document.getElementById("myChart");

      $http.get("http://127.0.0.1:8080/site")
      .then(function(response){
        for(var i = 0; i < response.data.length; i++) {
          if (typeof response.data[i].URL != 'undefined'){
            if ((response.data[i].URL).indexOf("facebook") !== -1){
              $scope.nbIdentifiants[0] = $scope.nbIdentifiants[0] + 1;
            } else if (response.data[i].URL.indexOf("google") !== -1){
              $scope.nbIdentifiants[1] = $scope.nbIdentifiants[1] + 1;
            } else
            $scope.nbIdentifiants[2] = $scope.nbIdentifiants[2] + 1;
            } else i++;
        }
      });

      $scope.option = {
        title: {
          display: true,
          text: "Nombre d'identifiants récupérés par site"
        },
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Sites"
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Occurences"
            }
          }]
        }
      };

      $scope.donnees = {
        labels: $scope.sites,
        datasets: [
          {
            backgroundColor: $scope.background_color,
            borderColor: $scope.border_color,
            borderWidth: 1,
            data: $scope.nbIdentifiants
          }
        ]
      };

      $scope.myBarChart = new Chart($scope.ctx, {
        type: 'bar',
        data: $scope.donnees,
        options: $scope.option
      });

  }]);


app.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {

    $scope.toggleLeft = buildDelayedToggler('left');


    function change_tabs(){

    }

    function debounce(func, wait, context) {
       var timer;

       return function debounced() {
         var context = $scope,
             args = Array.prototype.slice.call(arguments);
         $timeout.cancel(timer);
         timer = $timeout(function() {
           timer = undefined;
           func.apply(context, args);
         }, wait || 10);
       };
 }


    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  });

})();
