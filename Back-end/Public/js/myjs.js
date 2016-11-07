(function(){
  app = angular.module('Application', ['ngMaterial','ngRoute']);

  app.controller('FirstController', ['$http', '$scope', function($http,$scope){
      $scope.test = "ttttttttttt";
      this.tt = "aaaaaaaa";
      $http.get("http://127.0.0.1:8080/site")
      .then(function(response){
        $scope.res = response.data;
        console.log($scope.res);
      });



  }]);
})();
