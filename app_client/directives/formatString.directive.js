angular.module("Loc8rApp").directive("formatString", function () {
  return {
    restrict: "E",
    link: function ($scope, $element, $attrs) {
        $attrs.$observe("str", function (value) {
            let str = value;
            $element.text(str.replace((/\n/g, "</br>")));
        });
    },
  };
});
