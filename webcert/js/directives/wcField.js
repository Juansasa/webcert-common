/**
 * wcField directive. Used to abstract common layout for full-layout form fields in cert modules
 */
angular.module('common').directive('wcField',
    [ 'common.messageService',
        function(messageService) {
            'use strict';

            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div class=\"body-row clearfix\"><h4 class=\"cert-field-number\" ng-if=\"fieldNumber != undefined\"><span message key=\"modules.label.field\"></span> {{fieldNumber}} </h4><h3 class=\"title\" ng-class=\"{\'unfilled\' : filled == \'false\'}\"><span message key=\"{{fieldLabel}}\"></span><span class=\"cert-field-blank\" ng-hide=\"filled\"> <span message key=\"modules.label.blank\"></span></span><span ng-if=\"fieldHelpText != undefined\" class=\"glyphicon glyphicon-question-sign\" tooltip-trigger=\"mouseenter\" tooltip-html-unsafe=\"{{getMessage(fieldHelpText)}}\" tooltip-placement=\"{{placement}}\"></span></h3><span class=\"text\" ng-show=\"filled\" ng-class=\"{fielderror: fieldHasErrors}\"><span ng-transclude></span></span></div>\n',
                scope: {
                    fieldLabel: '@',
                    fieldNumber: '@?',
                    fieldHelpText: '@',
                    fieldHasErrors: '=',
                    fieldTooltipPlacement: '@',
                    filled: '@?'
                },
                compile: function(element, attrs){
                    if (!attrs.filled) { attrs.filled = true; }
                },
                controller: function($scope) {

                    if ($scope.fieldNumber === null) {
                        $scope.fieldNumber = undefined;
                    }

                    if ($scope.fieldTooltipPlacement === undefined) {
                        $scope.placement = 'right';
                    } else {
                        $scope.placement = $scope.fieldTooltipPlacement;
                    }

                    $scope.getMessage = function(key) {
                        return messageService.getProperty(key);
                    };
                }
            };
        }]);
