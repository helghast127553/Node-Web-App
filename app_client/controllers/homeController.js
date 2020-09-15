angular.module("Loc8rApp")
  .constant("url", "http://localhost:3000/api/locations")
  .controller("homeController", ["$scope", "$http", "url",
    function ($scope, $http, url) {
      $http.get(url).then(function (response) {
        let message = undefined;
        if (!response.data instanceof Array) {
          message = "API lookup error";
          response.data = [];
        } else {
          if (!response.data.length) {
            message = "No places found nearby";
          }
        }
        $scope.locations = {
          title: "Loc8r - find a place to work with wifi",
          pageHeader: {
            title: "Loc8r",
            strapline: "Find places to work with wifi near you!",
          },
          sidebar:
            "Looking for wifi and a seat? Loc8r helps you find places to work when out and about." +
            "Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
          data: response.data,
          message: message,
        };
      });
    },
  ]);
