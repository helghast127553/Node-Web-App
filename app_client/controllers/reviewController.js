angular.module("Loc8rApp").controller("reviewController", ["$scope", "$http", "$routeParams", "$location",
  function ($scope, $http, $routeParams, $location) {
    $scope.review = {
      author: "",
      rating: "5",
      reviewText: "",
    };

    $scope.addReview = function () {
      let data = $scope.review;
      const url = "http://localhost:3000/api/location/" + $routeParams.locationid + "/reviews";
      $http.post(url, data)
        .then(function (response) {
          if (response.status === 201) {
            $location.path("/location/" + $routeParams.locationid);
          } else if (response.status === 400) {
            $scope.error = "val";
          } else {
            if (response.status === 404) {
              $scope.status = response.status;
              $scope.title = "404, page not found";
              $scope.content = "oh dear. Looks like we can not find this page. Sorry.";
            } else {
              $scope.status = response.status;
              $scope.title = status + ", something's gone wrong";
              $scope.content = "Something, somewhere, has gone just a little bit wrong";
            }
          }
        });
    };
  },
]);
