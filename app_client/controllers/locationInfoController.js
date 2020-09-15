angular.module("Loc8rApp").controller("locationInfoController", ["$scope", "$http", "$routeParams",
  function ($scope, $http, $routeParams) {
    const url = "http://localhost:3000/api/location/" + $routeParams.locationid;
    $http.get(url).then(function (response) {
      let data = response.data;
      if (response.status === 200) {
        data.coords = {
          lng: response.data.coords[0],
          lat: response.data.coords[1],
        };
        $scope.data = {
          title: data.name,
          pageHeader: {
            title: data.name,
          },
          sidebar: {
            context:
              "Looking for wifi and a seat? Loc8r helps you find places to work when out and about." +
              "Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
            callToAction:
              "If you've been and you like it - or if you don't -please leave a review to help other people just like you.",
          },
          location: data,
        };
      } else {
        if (response.status === 404) {
          $scope.title = "404, page not found";
          $scope.content = "oh dear. Looks like we can not find this page. Sorry.";
        } else {
          $scope.title = status + ", something's gone wrong";
          $scope.content = "Something, somewhere, has gone just a little bit wrong";
        }
      }
    });
  },
]);
