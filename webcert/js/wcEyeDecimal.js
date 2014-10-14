/**
 * Directive for 'Eye Decimals' with two way binding /
 */
angular.module('common').directive('wcEyeDecimal',
    function() {
        'use strict';

        return {
            restrict: 'A',
            require: 'ngModel',
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
                    var maxLength = (dec ? 3 : 2);
                    return filtered.length <= maxLength ? filtered : filtered.substring(0,maxLength);
                }

                function format(value) {
                    var l = value.length;
                    var valForView = '';
                    var valForModel;
                    if (l === 0) {
                        valForModel = null;
                    } else {

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

                function eyeDecimal(valFromView) {
                    var filtered = filter(valFromView);
                    var val = format(filtered);

                    if (filtered !== valFromView) {
                        ngModelCtrl.$setViewValue(filtered);
                        ngModelCtrl.$render();
                    }
                    return val.valForModel;
                }

                elem.bind('blur', blurFormat);
                ngModelCtrl.$parsers.push(eyeDecimal);
            }
        };
    });
