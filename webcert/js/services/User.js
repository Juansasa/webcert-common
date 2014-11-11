angular.module('common').factory('common.User',
    function($http, $log) {
        'use strict';

        return {

            reset: function() {
                this.userContext = null;
            },

            getActiveFeatures: function() {
                if (this.userContext) {
                    return this.userContext.aktivaFunktioner;
                } else {
                    return null;
                }
            },

            /**
             * Set user context from api
             * @param userContext
             */
            setUserContext: function(userContext) {
                this.userContext = userContext;
            },

            /**
             * returns valdVardenhet from user context
             * @returns valdVardenhet
             */
            getVardenhetSelectionList: function() {

                var ucVardgivare = angular.copy(this.userContext.vardgivare);

                var vardgivareList = [];

                angular.forEach(ucVardgivare, function(vardgivare, key1) {
                    this.push({ 'id': vardgivare.id, 'namn': vardgivare.namn, 'vardenheter': [] });
                    angular.forEach(vardgivare.vardenheter, function(vardenhet) {
                        this.push({ 'id': vardenhet.id, 'namn': vardenhet.namn });
                        angular.forEach(vardenhet.mottagningar, function(mottagning) {
                            mottagning.namn = vardenhet.namn + ' - ' + mottagning.namn;
                            this.push(mottagning);
                        }, vardgivareList[key1].vardenheter);
                    }, vardgivareList[key1].vardenheter);
                }, vardgivareList);

                return vardgivareList;
            },

            /**
             * Returns a list of the selected vardenhet and all its mottagningar
             * @returns {*}
             */
            getVardenhetFilterList: function(vardenhet) {
                if (!vardenhet) {

                    if (this.userContext.valdVardenhet) {
                        $log.debug('getVardenhetFilterList: using valdVardenhet');
                        vardenhet = this.userContext.valdVardenhet;
                    } else {
                        $log.debug('getVardenhetFilterList: parameter vardenhet was omitted');
                        return [];
                    }
                }

                var vardenhetCopy = angular.copy(vardenhet); // Don't modify the original!
                var units = [];
                units.push(vardenhetCopy);

                angular.forEach(vardenhetCopy.mottagningar, function(mottagning) {
                    mottagning.namn = vardenhet.namn + ' - ' + mottagning.namn;
                    this.push(mottagning);
                }, units);

                return units;
            },

            /**
             * returns valdVardgivare from user context
             * @returns valdVardgivare
             */
            getValdVardgivare: function() {
                return this.userContext.valdVardgivare;
            },

            /**
             * returns valdVardenhet from user context
             * @returns valdVardenhet
             */
            getValdVardenhet: function() {
                return this.userContext.valdVardenhet;
            },

            /**
             * setValdVardenhet. Tell server which vardenhet is active in user context
             * @param vardenhet - complete vardenhet object to send
             * @param onSuccess - success callback on successful call
             * @param onError - error callback on connection failure
             */
            setValdVardenhet: function(vardenhet, onSuccess, onError) {
                $log.debug('setValdVardenhet' + vardenhet.namn);

                var payload = vardenhet;

                var self = this;
                var restPath = '/api/anvandare/andraenhet';
                $http.post(restPath, payload).success(function(data) {
                    $log.debug('got callback data: ' + data);

                    // Update user context
                    self.setUserContext(data);

                    onSuccess(data);
                }).error(function(data, status) {
                    $log.error('error ' + status);
                    onError(data);
                });
            }
        };
    });
