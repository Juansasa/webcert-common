/**
 * Common Fragasvar Module - Common services and controllers related to
 * FragaSvar functionality to be used in webcert and modules handling Fraga/svar
 * related to certificates. (As of this time, only fk7263 module)
 */
angular.module('common').factory('common.fragaSvarCommonService',
    function($http, $log, $modal, $window) {
        'use strict';

        /*
         * Toggle vidarebefordrad state of a fragasvar entity with given id
         */
        function _setVidareBefordradState(fragaSvarId, intygsTyp, isVidareBefordrad, callback) {
            $log.debug('_setVidareBefordradState');
            var restPath = '/moduleapi/fragasvar/' + intygsTyp + '/' + fragaSvarId + '/hanterad';
            $http.put(restPath, isVidareBefordrad.toString()).success(function(data) {
                $log.debug('_setVidareBefordradState data:' + data);
                callback(data);
            }).error(function(data, status) {
                $log.error('error ' + status);
                // Let calling code handle the error of no data response
                callback(null);
            });
        }

        function _buildMailToLink(qa) {
            var baseURL = $window.location.protocol + '//' + $window.location.hostname +
                ($window.location.port ? ':' + $window.location.port : '');
            var url = baseURL + '/webcert/web/user/certificate/' + qa.intygsReferens.intygsId + '/questions';

            var recipient = '';
            var subject = 'En fraga-svar ska besvaras i Webcert.';
            if (qa.vardperson.enhetsnamn !== undefined) {
                subject += ' på enhet ' + qa.vardperson.enhetsnamn;
                if (qa.vardperson.vardgivarnamn !== undefined) {
                    subject += ' för vårdgivare ' + qa.vardperson.vardgivarnamn;
                }
            }

            var body = 'Klicka pa lanktexten for att besvara fraga-svar::\n' + url;
            var link = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=' +
                encodeURIComponent(body);
            $log.debug(link);
            return link;
        }

        function _setSkipVidareBefodradCookie() {
            var secsDays = 12 * 30 * 24 * 3600 * 1000; // 1 year
            var now = new Date();
            var expires = new Date(now.getTime() + secsDays);
            document.cookie = 'WCDontAskForVidareBefordradToggle=1; expires=' + expires.toUTCString();

        }

        function _isSkipVidareBefodradCookieSet() {
            return (document.cookie && document.cookie.indexOf('WCDontAskForVidareBefordradToggle=1') !== -1);
        }

        function _decorateSingleItemMeasure(qa) {
            if (qa.status === 'CLOSED') {
                qa.measureResKey = 'handled';
            } else if (qa.status === 'ANSWERED' || qa.amne === 'MAKULERING' || qa.amne === 'PAMINNELSE') {
                qa.measureResKey = 'markhandled';
            } else if (qa.amne === 'KOMPLETTERING_AV_LAKARINTYG') {
                qa.measureResKey = 'komplettering';
            } else {
                if (qa.status === 'PENDING_INTERNAL_ACTION') {
                    qa.measureResKey = 'svarfranvarden';
                } else if (qa.status === 'PENDING_EXTERNAL_ACTION') {
                    qa.measureResKey = 'svarfranfk';
                } else {
                    qa.measureResKey = '';
                    $log.debug('warning: undefined status');
                }
            }
        }

        function _showVidarebefordradPreferenceDialog(title, bodyText, yesCallback, noCallback, noDontAskCallback,
            callback) {

            var DialogInstanceCtrl = function($scope, $modalInstance, title, bodyText, yesCallback, noCallback,
                noDontAskCallback) {
                $scope.title = title;
                $scope.bodyText = bodyText;
                $scope.noDontAskVisible = noDontAskCallback !== undefined;
                $scope.yes = function(result) {
                    yesCallback();
                    $modalInstance.close(result);
                };
                $scope.no = function() {
                    noCallback();
                    $modalInstance.close('cancel');
                };
                $scope.noDontAsk = function() {
                    noDontAskCallback();
                    $modalInstance.close('cancel_dont_ask_again');
                };
            };

            var msgbox = $modal.open({
                templateUrl: '/views/partials/preference-dialog.html',
                controller: DialogInstanceCtrl,
                resolve: {
                    title: function() {
                        return angular.copy(title);
                    },
                    bodyText: function() {
                        return angular.copy(bodyText);
                    },
                    yesCallback: function() {
                        return yesCallback;
                    },
                    noCallback: function() {
                        return noCallback;
                    },
                    noDontAskCallback: function() {
                        return noDontAskCallback;
                    }
                }
            });

            msgbox.result.then(function(result) {
                if (callback) {
                    callback(result);
                }
            }, function() {
            });
        }

        function _handleVidareBefodradToggle(qa, onYesCallback) {
            // Only ask about toggle if not already set AND not skipFlag cookie is
            // set
            if (!qa.vidarebefordrad && !_isSkipVidareBefodradCookieSet()) {
                _showVidarebefordradPreferenceDialog(
                    'markforward',
                    'Det verkar som att du har informerat den som ska hantera ärendet. Vill du markera ärendet som vidarebefordrat?',
                    function() { // yes
                        $log.debug('yes');
                        qa.vidarebefordrad = true;
                        if (onYesCallback) {
                            // let calling scope handle yes answer
                            onYesCallback(qa);
                        }
                    },
                    function() { // no
                        $log.debug('no');
                        // Do nothing
                    },
                    function() {
                        $log.debug('no and dont ask');
                        // How can user reset this?
                        _setSkipVidareBefodradCookie();
                    }
                );
            }
        }

        // Return public API for the service
        return {
            setVidareBefordradState: _setVidareBefordradState,
            handleVidareBefodradToggle: _handleVidareBefodradToggle,
            buildMailToLink: _buildMailToLink,
            decorateSingleItemMeasure: _decorateSingleItemMeasure
        };
    });
