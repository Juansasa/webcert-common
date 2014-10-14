/**
 * wc-maxlength directive which limits amount of characters that can be entered in a input box/textarea and adds a
 * counter below the element
 *
 * usage:
 *  directive demands the following attributes on the element:
 *  wc-maxlength
 *  name (for unique id for counter scope name)
 *  ng-model (for mapping model)
 *  maxlength (for setting maxlength)
 */
angular.module('common').directive('wcMaxlength',
    function($compile) {
        'use strict';

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, controller) {

                var counterName = 'charsRemaining' + element[0].id;
                counterName = counterName.replace('.', '');
                scope[counterName] = attrs.maxlength;

                var counter = angular.
                    element('<div class="counter">Tecken kvar: {{' + counterName + '}}</div>');
                $compile(counter)(scope);
                element.parent().append(counter);

                function limitLength(text) {
                    if (text === undefined) {
                        return;
                    }
                    if (text.length > attrs.maxlength) {
                        var transformedInput = text.substring(0, attrs.maxlength);
                        controller.$setViewValue(transformedInput);
                        controller.$render();
                        return transformedInput;
                    }
                    scope[counterName] = attrs.maxlength - text.length;
                    return text;
                }

                controller.$formatters.unshift(limitLength);
                controller.$parsers.unshift(limitLength);
            }
        };
    });
