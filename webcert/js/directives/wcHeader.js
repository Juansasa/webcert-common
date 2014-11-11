angular.module('common').directive('wcHeader',
    [ '$cookieStore', '$location', '$modal', '$window', 'common.featureService', 'common.messageService', 'common.statService', 'common.User',
        function($cookieStore, $location, $modal, $window, featureService, messageService, statService, User) {
            'use strict';

            return {
                restrict: 'A',
                replace: true,
                scope: {
                    defaultActive: '@'
                },
                controller: function($scope) {
                    //Expose 'now' as a model property for the template to render as todays date
                    $scope.today = new Date();
                    $scope.user = User;
                    $scope.statService = statService;
                    $scope.statService.startPolling();
                    $scope.stat = {
                        fragaSvarValdEnhet: 0,
                        fragaSvarAndraEnheter: 0,
                        intygValdEnhet: 0,
                        intygAndraEnheter: 0,
                        vardgivare: []
                    };

                    $scope.$on('wc-stat-update', function(event, message) {
                        $scope.stat = message;
                    });

                    $scope.menuDefs = [];

                    if (featureService.isFeatureActive(featureService.features.HANTERA_FRAGOR)) {
                        $scope.menuDefs.push({
                            link: '/web/dashboard#/unhandled-qa',
                            label: 'Frågor och svar',
                            requiresDoctor: false,
                            statNumberId: 'stat-unitstat-unhandled-question-count',
                            statTooltip: 'not set',
                            getStat: function() {
                                this.statTooltip = 'Vårdenheten har ' + $scope.stat.fragaSvarValdEnhet +
                                    ' ej hanterade frågor och svar.';
                                return $scope.stat.fragaSvarValdEnhet || '';
                            }
                        });
                    }

                    if (featureService.isFeatureActive(featureService.features.HANTERA_INTYGSUTKAST)) {
                        $scope.menuDefs.push({
                            link: '/web/dashboard#/unsigned',
                            label: messageService.getProperty('dashboard.unsigned.title'),
                            requiresDoctor: false,
                            statNumberId: 'stat-unitstat-unsigned-certs-count',
                            statTooltip: 'not set',
                            getStat: function() {
                                this.statTooltip =
                                    'Vårdenheten har ' + $scope.stat.intygValdEnhet + ' ej signerade utkast.';
                                return $scope.stat.intygValdEnhet || '';
                            }
                        });
                    }

                    if (featureService.isFeatureActive(featureService.features.HANTERA_INTYGSUTKAST)) {
                        var writeCertMenuDef = {
                            link: '/web/dashboard#/create/index',
                            label: 'Sök/skriv intyg',
                            requiresDoctor: false,
                            getStat: function() {
                                return '';
                            }
                        };

                        if (User.userContext.lakare) {
                            $scope.menuDefs.splice(0, 0, writeCertMenuDef);
                        } else {
                            $scope.menuDefs.push(writeCertMenuDef);
                        }
                    }

                    $scope.menuDefs.push({
                        link: '/web/dashboard#/webcert/about',
                        label: 'Om Webcert',
                        requiresDoctor: false,
                        getStat: function() {
                            return '';
                        }
                    });

                    $scope.isActive = function(page) {
                        if (!page) {
                            return false;
                        }

                        page = page.substr(page.lastIndexOf('/') + 1);
                        if (angular.isString($scope.defaultActive)) {
                            if (page === $scope.defaultActive) {
                                return true;
                            }
                        }

                        var currentRoute = $location.path().substr($location.path().lastIndexOf('/') + 1);
                        return page === currentRoute;
                    };

                    $scope.logout = function() {
                        if (User.userContext.authenticationScheme === 'urn:inera:webcert:fake') {
                            $window.location = '/logout';
                        } else {
                            iid_Invoke('Logout');
                            $window.location = '/saml/logout/';
                        }
                    };

                    $scope.openChangeCareUnitDialog = function() {

                        $modal.open({
                            templateUrl: '/web/webjars/common/webcert/js/directives/wcHeaderCareUnitDialog.html',
                            controller: function($scope, $modalInstance, vardgivare) {
                                $scope.vardgivare = vardgivare;
                                $scope.error = false;

                                $scope.close = function() {
                                    $modalInstance.close();
                                };

                                $scope.selectVardenhet = function(enhet) {
                                    $scope.error = false;
                                    User.setValdVardenhet(enhet, function() {
                                        // Remove stored cookie for selected filter. We want to choose a new
                                        // filter after choosing another unit to work on
                                        $cookieStore.remove('enhetsId');

                                        // We updated the user context. Reroute to start page so as not to end
                                        // up on a page we aren't welcome anymore. Maybe we should make these
                                        // routes some kind of global configuration? No other choices are
                                        // relevant today though.
                                        if (User.userContext.lakare === true) {
                                            $location.path('/');
                                        } else {
                                            $location.path('/unhandled-qa');
                                        }

                                        $modalInstance.close();
                                    }, function() {
                                        $scope.error = true;
                                    });

                                };
                            },
                            resolve: {
                                vardgivare: function() {
                                    return angular.copy($scope.stat.vardgivare);
                                }
                            }
                        });
                    };
                },
                templateUrl: '/web/webjars/common/webcert/js/directives/wcHeader.html'
            };
        }]);
