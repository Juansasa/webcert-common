angular.module('common').controller('common.SendCertWizardCtrl',
    [ '$filter', '$location', '$rootScope', '$routeParams', '$scope', 'minaintyg.listCertService',
        'minaintyg.sendCertService',
        function($filter, $location, $rootScope, $routeParams, $scope, listCertService, sendCertService) {
            'use strict';

            // Get module and default recipient from querystring
            var params = $location.search();
            $scope.module = params.module;

            // Initialize default recipient
            if ($scope.selectedRecipientId === undefined) {
                $scope.selectedRecipientId = params.defaultRecipient;
            }

            $scope.sendingInProgress = false;
            // Get active certificate from rootscope (passed from previous controller)
            $scope.cert = $rootScope.cert;

            if (!angular.isObject($scope.cert)) {
                $location.path($scope.module + '/fel/certnotfound');
                return;
            }
            // expose calculated static link for pdf download
            $scope.downloadAsPdfLink = '/moduleapi/certificate/' + $scope.cert.id + '/pdf';

            // set selected recipeintID in rootscope to preserve state between
            // controller instance invocations
            $rootScope.selectedRecipientId = $scope.selectedRecipientId;

            $scope.recipientList = [];
            sendCertService.getRecipients($scope.module, function(result) {
                if (result !== null && result.length > 0) {
                    for (var i = 0; i < result.length; ++i) {
                        $scope.recipientList[i] = {
                            'id': result[i].id,
                            'recipientName': result[i].name
                        };
                    }
                } else {
                    // show error view
                    $location.path($scope.module + '/fel/failedreceiverecipients');
                }
            }, function() {
                // show error view
                $location.path($scope.module + '/fel/failedreceiverecipients');
            });

            $scope.getRecipientName = function(id) {
                for (var i = 0; i < $scope.recipientList.length; i++) {
                    var recipient = $scope.recipientList[i];
                    if (recipient.id === id) {
                        return recipient.recipientName;
                    }
                }
            };

            $scope.confirmRecipientSelection = function() {
                // now we have a recipient selected, set the selection in rootscope
                $rootScope.selectedRecipientId = $scope.selectedRecipientId;
                $location.path($scope.module + '/summary');
            };

            $scope.confirmAndSend = function() {
                $scope.sendingInProgress = true;
                sendCertService.sendCertificate($scope.cert.id, $scope.selectedRecipientId, function(result) {
                    $scope.sendingInProgress = false;
                    if (result !== null && result.resultCode === 'sent') {
                        listCertService.emptyCache();
                        $location.path($scope.module + '/sent');
                    } else {
                        // show error view
                        $location.path($scope.module + '/fel/couldnotsend');
                    }
                });
            };

            $scope.backToViewRecipents = function() {
                $location.path($scope.module + '/recipients');
            };

            $scope.alreadySentToRecipient = function() {
                // check if selected recipient exists with SENT status in cert history
                if (angular.isObject($scope.cert.filteredStatuses)) {
                    for (var i = 0; i < $scope.cert.filteredStatuses.length; i++) {
                        if (($scope.cert.filteredStatuses[i].type === 'SENT') &&
                            ($scope.cert.filteredStatuses[i].target === $scope.selectedRecipientId)) {
                            return true;
                        }
                    }
                }
                return false;
            };

            $scope.backToViewCertificate = function() {
                $location.path($scope.module + '/view/' + $scope.cert.id).search({});
            };

            $scope.pagefocus = true;
        }]);
