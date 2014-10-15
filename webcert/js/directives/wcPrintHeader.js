angular.module('common').directive('wcPrintHeader',
    [ 'common.User',
        function(User) {
            'use strict';

            return {
                restrict: 'A',
                replace: true,
                scope: {
                    titleId: '@',
                    printMessageId: '@',
                    intygsId: '='
                },
                controller: function($scope) {
                    $scope.today = new Date();
                    $scope.user = User;
                },
                templateUrl: '/web/webjars/common/webcert/js/directives/wcPrintHeader.html'
            };
        }]);
