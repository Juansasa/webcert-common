angular.module('common').directive('wcDatePickerField',
    function($rootScope, $timeout) {
        'use strict';

        return {
            restrict: 'A',
            replace: true,
            scope: {
                targetModel: '=',
                domId: '@',
                invalid: '=',
                onChange: '&'
            },
            template: '<span><input id=\"{{domId}}\" name=\"{{domId}}\" class=\"form-control\" ng-class=\"{\'text-invalid\': invalid}\" type=\"text\" datepicker-popup ng-model=\"targetModel\" is-open=\"isOpen\" maxlength=\"10\"/><button id=\"{{domId}}-toggle\" class=\"btn btn-default\" ng-click=\"toggleOpen()\" ng-disabled=\"isOpen\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span>',

            controller: function($scope) {

                $scope.$watch('targetModel', function(newValue) {
                    if ($scope.onChange) {
                        $scope.onChange();
                    }
                }, false);

                $scope.isOpen = false;
                $scope.toggleOpen = function() {
                    $timeout(function() {
                        $scope.isOpen = !$scope.isOpen;
                    });
                };
            }
        };
    });
