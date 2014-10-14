/**
 * Enable tooltips for other components than wcFields
 */
angular.module('common').directive('wcEnableTooltip',
    [ 'common.messageService',
        function(messageService) {
            'use strict';

            return {
                restrict: 'A',
                transclude: true,
                scope: {
                    fieldHelpText: '@'
                },
                controller: function($scope) {
                    $scope.getMessage = function(key) {
                        return messageService.getProperty(key);
                    };
                },
                template: '<span class=\"glyphicon glyphicon-question-sign\" tooltip-trigger=\"mouseenter\" tooltip-html-unsafe=\"{{getMessage(fieldHelpText)}}\" tooltip-placement=\"right\"></span>\n'
            };
        }]);
