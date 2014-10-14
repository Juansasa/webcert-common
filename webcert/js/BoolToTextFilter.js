angular.module('common').filter('BoolToTextFilter',
    function() {
        'use strict';

        return function(input) {
            return input === true ? 'common.yes' : 'common.no';
        };
    });
