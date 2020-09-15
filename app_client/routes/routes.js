angular.module("Loc8rApp", ["ngRoute"]).config(["$routeProvider",
  function ($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "../views/locations-list.html",
      controller: "homeController"
    });
    $routeProvider.when("/location/:locationid", {
      templateUrl: "../views/location-info.html",
      controller: "locationInfoController"
    });
    $routeProvider.when("/location/:locationid/reviews/new", {
      templateUrl: "../views/location-review-form.html",
      controller: "reviewController"
    });
  },
]);
