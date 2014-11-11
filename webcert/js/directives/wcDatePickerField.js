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
            templateUrl: '/web/webjars/common/webcert/js/directives/wcDatePickerField.html',
            controller: function($scope) {
/*
                $scope.$watch('targetModel', function() {
                    if ($scope.onChange) { MUST RENAME IF USED
                        $scope.onChange();
                    }
                });
*/
                $scope.isOpen = false;
                $scope.toggleOpen = function($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $timeout(function() {
                        $scope.isOpen = !$scope.isOpen;
                    });
                };
            }
        };
    });
