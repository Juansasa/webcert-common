/**
 * Common certificate management methods between certificate modules
 */
angular.module('common').factory('common.CertificateService',
    function($http, $log) {
        'use strict';

        function _handleError(callback, error) {
            if (callback) {
                callback(error);
            } else {
                $log.error(error);
            }
        }

        /*
         * Load certificate details from the server.
         */
        function _getCertificate(intygsId, intygsTyp, onSuccess, onError) {
            $log.debug('_getCertificate id:' + intygsId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/intyg/' + intygsTyp + '/' + intygsId;
            $http.get(restPath).success(function(data) {
                $log.debug('_getCertificate data:' + data);
                onSuccess(data);
            }).error(function(data, status) {
                $log.error('error ' + status);
                onError(data);
            });
        }

        /**
         * Get a certificate draft with the specified id from the server.
         */
        function _getDraft(intygsId, intygsTyp, onSuccess, onError) {
            $log.debug('_getDraft intygsId: ' + intygsId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/utkast/' + intygsTyp + '/' + intygsId;
            $http.get(restPath).
                success(function(data) {
                    $log.debug('_getDraft data: ' + data);
                    onSuccess(data);
                }).
                error(function(data, status) {
                    $log.error('error ' + status);
                    onError(data);
                });
        }

        /**
         * Saves a certificate draft to the server.
         */
        function _saveDraft(intygsId, intygsTyp, cert, onSuccess, onError) {
            $log.debug('_saveDraft id: ' + intygsId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/utkast/' + intygsTyp + '/' + intygsId;
            $http.put(restPath, cert).
                success(function(data) {
                    $log.debug('_saveDraft data: ' + data);
                    onSuccess(data);
                }).
                error(function(data, status) {
                    $log.error('error ' + status);
                    onError(data);
                });
        }

        /**
         * Discards a certificate draft and removes it from the server.
         */
        function _discardDraft(intygsId, intygsTyp, onSuccess, onError) {
            $log.debug('_discardDraft id: ' + intygsId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/utkast/' + intygsTyp + '/' + intygsId;
            $http['delete'](restPath).
                success(function(data) {
                    $log.debug('_discardDraft data: ' + data);
                    onSuccess(data);
                }).
                error(function(data, status) {
                    $log.error('error ' + status);
                    onError(data);
                });
        }

        function _getSigneringshash(intygsId, intygsTyp, onSuccess, onError) {
            $log.debug('_getSigneringshash, intygsId: ' + intygsId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/utkast/' + intygsTyp + '/' + intygsId + '/signeringshash';
            $http.post(restPath).
                success(function(data) {
                    onSuccess(data);
                }).
                error(function(error) {
                    _handleError(onError, error);
                });
        }

        function _getSigneringsstatus(ticketId, intygsTyp, onSuccess, onError) {
            $log.debug('_getSigneringsstatus, ticketId: ' + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/utkast/' + intygsTyp + '/' + ticketId + '/signeringsstatus';
            $http.get(restPath).
                success(function(data) {
                    onSuccess(data);
                }).
                error(function(error) {
                    _handleError(onError, error);
                });
        }

        function _signeraUtkast(intygsId, intygsTyp, onSuccess, onError) {
            $log.debug('_signeraUtkast, intygsId:' + intygsId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/utkast/' + intygsTyp + '/' + intygsId + '/signeraserver';
            $http.post(restPath).
                success(function(data) {
                    onSuccess(data);
                }).
                error(function(error) {
                    _handleError(onError, error);
                });
        }

        function _signeraUtkastWithSignatur(ticketId, intygsTyp, signatur, onSuccess, onError) {
            $log.debug('_signeraUtkastWithSignatur, ticketId: ' + ticketId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/utkast/' + intygsTyp + '/' + ticketId + '/signeraklient';
            $http.post(restPath).
                success(function() {
                    onSuccess();
                }).
                error(function(error) {
                    _handleError(onError, error);
                });
        }

        function _sendSigneratIntyg(intygsId, intygsTyp, recipientId, patientConsent, onSuccess, onError) {
            $log.debug('_sendSigneratIntyg: ' + intygsId);
            var restPath = '/moduleapi/intyg/' + intygsTyp + '/' + intygsId + '/skicka';
            $http.post(restPath, {'recipient': recipientId, 'patientConsent': patientConsent}).
                success(function(data) {
                    onSuccess(data);
                }).
                error(function(error) {
                    _handleError(onError, error);
                });
        }

        function _revokeSigneratIntyg(intygsId, intygsTyp, onSuccess, onError) {
            $log.debug('_revokeSigneratIntyg: ' + intygsId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/intyg/' + intygsTyp + '/' + intygsId + '/aterkalla';
            $http.post(restPath, {}).
                success(function(data) {
                    if (data === '"OK"') {
                        onSuccess();
                    } else {
                        onError();
                    }
                }).
                error(function(error) {
                    _handleError(onError, error);
                });
        }

        function _logPrint(intygsId, intygsTyp, onSuccess, onError) {
            $log.debug('_logPrint, intygsId: ' + intygsId + ' intygsTyp: ' + intygsTyp);
            var restPath = '/moduleapi/utkast/' + intygsTyp + '/' + intygsId + '/loggautskrift';
            $http.post(restPath, intygsId).
                success(function(data) {
                    onSuccess(data);
                }).
                error(function(error) {
                    _handleError(onError, error);
                });
        }

        // Return public API for the service
        return {
            getCertificate: _getCertificate,
            getDraft: _getDraft,
            saveDraft: _saveDraft,
            discardDraft: _discardDraft,
            getSigneringshash: _getSigneringshash,
            getSigneringsstatus: _getSigneringsstatus,
            revokeSigneratIntyg: _revokeSigneratIntyg,
            signeraUtkast: _signeraUtkast,
            signeraUtkastWithSignatur: _signeraUtkastWithSignatur,
            sendSigneratIntyg: _sendSigneratIntyg,
            logPrint: _logPrint
        };
    });
