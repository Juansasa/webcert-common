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
            templateUrl: '/web/webjars/common/webcert/js/directives/wcSpinner.html'
        };
    });
