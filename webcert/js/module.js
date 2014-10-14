/* global commonMessages */
angular.module('common', [ 'ui.bootstrap', 'ngCookies', 'ngRoute', 'ngSanitize' ]);

// Inject language resources
angular.module('common').run([ 'common.messageService',
    function(messageService) {
        'use strict';

        messageService.addResources(commonMessages);
    }]);
