angular.module('common').directive('wcSpinner',
    function() {
        'use strict';

        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: {
                label: '@',
                showSpinner: '=',
                showContent: '='
            },
            template: '<div> <div ng-show=\"showSpinner\" class=\"wc-spinner\"> <img aria-labelledby=\"loading-message\" src=\"/img/ajax-loader.gif\" /> <p id=\"loading-message\"> <strong><span message key=\"{{ label }}\"></span></strong> </p> </div> <div ng-show=\"showContent\"> <div ng-transclude></div> </div> </div> '
        };
    });
