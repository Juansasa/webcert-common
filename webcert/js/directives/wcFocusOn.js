/**
 * FocusMe directive. Used to set focus to an element via model value
 */
angular.module('common').directive('wcFocusOn',
    function() {
        'use strict';
        return function(scope, elem, attr) {
            return scope.$on('wcFocusOn', function(e, name) {
                if (name === attr.wcFocusOn) {
                    return elem[0].focus();
                }
            });
        };
    });

angular.module('common').factory('common.wcFocus', [
    '$rootScope', '$timeout', function($rootScope, $timeout) {
        'use strict';
        return function(name) {
            return $timeout(function() {
                    return $rootScope.$broadcast('wcFocusOn', name);
                });
        };
    }
]);
