angular.module('common').directive('wcHeader',
    [ '$cookieStore', '$location', '$modal', '$window', 'common.messageService', 'common.statService', 'common.User',
        function($cookieStore, $location, $modal, $window, messageService, statService, User) {
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

                    $scope.menuDefs = [
                        {
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
                        },
                        {
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
                        },
                        {
                            link: '/web/dashboard#/webcert/about',
                            label: 'Om Webcert',
                            requiresDoctor: false,
                            getStat: function() {
                                return '';
                            }
                        }
                    ];

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
                        $scope.menuDefs.splice(2, 0, writeCertMenuDef);
                    }

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
                template: '<div><div class=\"header clearfix\"><div class=\"headerbox\"><span class=\"headerbox-logo pull-left\"><a href=\"/web/start\"><img alt=\"Till startsidan\" src=\"/img/webcert_logo.png\" /></a></span><span class=\"headerbox-date pull-left\"><span class=\"location\">{{today | date:\"shortDate\"}} - {{user.userContext.valdVardgivare.namn}} - {{user.userContext.valdVardenhet.namn}}</span><br><span class=\"otherLocations\" ng-show=\"(stat.intygAndraEnheter+stat.fragaSvarAndraEnheter) > 0\"><span style=\"font-weight:bold\">{{stat.intygAndraEnheter+stat.fragaSvarAndraEnheter}}</span> ej hanterade frågor och ej signerade utkast på andra vårdenheter.</span> <a id=\"wc-care-unit-clinic-selector\" tabindex=\"0\" href class=\"otherLocations\" ng-show=\"user.userContext.totaltAntalVardenheter > 1\" data-ng-click=\"openChangeCareUnitDialog()\">Byt vårdenhet</a> </span> </div> <div class=\"headerbox-user pull-right\"> <div class=\"headerbox-user-profile headerbox-avatar\" ng-show=\"user.userContext.namn.length\"> <span ng-switch=\"user.userContext.lakare\"> <strong ng-switch-when=\"true\">Läkare</strong> <strong ng-switch-default>Vårdadministratör</strong> </span> - <span class=\"logged-in\">{{user.userContext.namn}}</span><br> <a class=\"pull-right\" ng-click=\"logout()\" id=\"logoutLink\">Logga ut</a> </div> </div> </div> <div class=\"navbar navbar-default\"> <div class=\"container-fluid\"> <button type=\"button\" class=\"navbar-toggle\" ng-init=\"navCollapsed = true\" ng-click=\"navCollapsed = !navCollapsed\"> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> </button> <div class=\"navbar-collapse collapse\" ng-class=\"!navCollapsed && \'in\'\"> <ul class=\"nav navbar-nav\"> <li ng-class=\"{active: isActive(menu.link)}\" ng-repeat=\"menu in menuDefs\"> <a ng-href=\"{{menu.link}}\" ng-show=\"(menu.requiresDoctor && isDoctor) || !menu.requiresDoctor\">{{menu.label}} <span id=\"{{menu.statNumberId}}\" ng-if=\"menu.getStat()>0\" class=\"stat-circle stat-circle-active\" title=\"{{menu.statTooltip}}\">{{menu.getStat()}}</span> </div>'
            };
        }]);
