angular.module("Loc8rApp").directive("outputRating", function () {
  return {
    restrict: "EA",
    link: function ($scope, $element, $attrs) {
      $attrs.$observe("rating", function (value) {
        let rating = parseInt(value);
        if (rating > 0) {
          for (let index = 0; index < rating; index++) {
            $element.append('<span class="glyphicon glyphicon-star"></span>');
          }
          for (let index = rating; index < 5; index++) {
            $element.append(
              '<span class="glyphicon glyphicon-star-empty"></span>'
            );
          }
        }
      });
    },
  };
});
