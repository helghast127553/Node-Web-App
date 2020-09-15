angular.module("Loc8rApp").directive("formatDate", function () {
  return {
    restrict: "E",
    link: function ($scope, $element, $attrs) {
      $attrs.$observe("date", function (value) {
        let date = new Date(value);
        let monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        let d = date.getDate();
        let m = monthNames[date.getMonth()];
        let y = date.getFullYear();
        let output = d + " " + m + " " + y;
        $element.text(output);
      });
    },
  };
});
