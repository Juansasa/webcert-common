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
