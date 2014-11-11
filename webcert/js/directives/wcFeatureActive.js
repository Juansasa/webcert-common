angular.module('common').directive('wcFeatureActive',
    [ 'common.User', 'common.featureService', function(User, featureService) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                feature: '@',
                intygstyp: '@'
            },
            link: function(scope, element) {

                // Make sure that the attribute 'feature' is set.
                if (scope.feature === undefined) {
                    element.remove();
                    throw new Error('\'wcFeatureActive\' kräver att du har angett attributet \'feature\' för att fungera.');
                }

                if (!featureService.isFeatureActive(scope.feature, scope.intygstyp)) {
                    element.remove();
                }
            }
        };
    }]);
