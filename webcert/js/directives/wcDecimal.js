/**
 * Directive for 'Decimal numbers' with two way binding /
 */
angular.module('common').directive('wcDecimalNumber',
    function() {
        'use strict';

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                wcDecimalMaxNumbers: '@'
            },

            link: function(scope, elem, attrs, ngModelCtrl) {
                var decimalPoint = /[\,,\.]/;
                var number = /[0-9]/;

                function filter(s) {
                    var filtered = '', dec = false;
                    angular.forEach(s, function(c) {
                        if (number.test(c)) {
                            filtered += c;
                        }
                        if (!dec && decimalPoint.test(c)) {
                            dec = true;
                            filtered += ',';
                        }
                    });
                    if (scope.wcDecimalMaxNumbers > 0) {
                        // Limits length to maxNumbers with optional decimal separator
                        var maxLength = scope.wcDecimalMaxNumbers;
                        if (dec)
                            maxLength++;
                        return filtered.length <= maxLength ? filtered : filtered.substring(0,maxLength);
                    }
                    return filtered;
                }

                function format(value) {
                    var l = value.length;
                    var valForView = '';
                    var valForModel = null;
                    if (l > 0) {
                        if (scope.wcDecimalMaxNumbers == 2) {
                            if (l === 1) {
                                if (value[0] === ',') {
                                    valForView = '0,0';
                                }
                                else {
                                    valForView = value[0] + ',0';
                                }
                            } else if (l === 2) {
                                if (value[0] === ',') {
                                    valForView = '0,' + value[1];
                                } else if (value[1] === ',') {
                                    valForView = value[0] + ',0';
                                } else {
                                    valForView = value[0] + ',' + value[1];
                                }
                            } else if (l === 3) {
                                if (value[0] === ',') {
                                    valForView = '0,' + value[1];
                                } else if (value[1] === ',') {
                                    valForView = value;
                                } else {
                                    valForView = value[0] + ',' + value[1];
                                }
                            }
                            valForModel = Number(valForView[0] + '.' + valForView[2]);
                        }
                        else {
                            valForView = value.replace('.', ',');
                            valForModel = valForView.replace(',','.');
                        }
                    }

                    return {
                        valForView: valForView,
                        valForModel: valForModel
                    };
                }

                function blurFormat() {
                    var filtered = filter(this.value);
                    var val = format(filtered);
                    if (this.value !== val.valForView) {
                        this.value = val.valForView;
                    }
                }

                function decimalParse(valFromView) {
                    var filtered = filter(valFromView);
                    var val = format(filtered);

                    if (filtered !== valFromView) {
                        ngModelCtrl.$setViewValue(filtered);
                        ngModelCtrl.$render();
                    }
                    return val.valForModel;
                }

                elem.bind('blur', blurFormat);
                ngModelCtrl.$parsers.push(decimalParse);
            }
        };
    });
