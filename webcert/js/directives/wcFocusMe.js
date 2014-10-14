/**
 * FocusMe directive. Used to set focus to an element via model value
 */
angular.module('common').directive('wcFocusMe',
    function() {
        'use strict';

        return {
            scope: { trigger: '=wcFocusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === true) {
                        element[0].focus();
                        scope.trigger = false;
                    }
                });
            }
        };
    });
