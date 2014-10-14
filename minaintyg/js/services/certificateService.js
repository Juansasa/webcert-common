/**
 * Common certificate management methods between certificate modules
 */
angular.module('common').factory('common.certificateService',
    function($http, $log) {
        'use strict';

        /*
         * Load certificate details from the server.
         */
        function _getCertificate(id, onSuccess, onError) {
            $log.debug('_getCertificate id:' + id);
            var restPath = '/moduleapi/certificate/' + id;
            $http.get(restPath).success(function(data) {
                $log.debug('_getCertificate data:' + data);
                onSuccess(data);
            }).error(function(data, status) {
                $log.error('error ' + status);
                onError(data);
            });
        }


        // Return public API for the service
        return {
            getCertificate: _getCertificate
        };
    });
