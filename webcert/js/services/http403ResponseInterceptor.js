/**
 * Response intercepter catching ALL responses coming back through the $http
 * service. On 403 status responses, the browser is redirected to the web apps
 * main starting point. To hook up the interceptor, simply config the http
 * provider for the app like this (in 1.1.5):
 *
 * $httpProvider.responseInterceptors.push('http403ResponseInterceptor');
 *
 * The url which the interceptor redirects to on a 403 response can be
 * configured via the providers setRedirectUrl in the apps config block, e.g:
 *
 * http403ResponseInterceptorProvider.setRedirectUrl("/web/403-error.jsp");
 */
angular.module('common').provider('common.http403ResponseInterceptor',
    function() {
        'use strict';

        /**
         * Object that holds config and default values.
         */
        this.config = {
            redirectUrl: '/'
        };

        /**
         * Setter for configuring the redirectUrl
         */
        this.setRedirectUrl = function(url) {
            this.config.redirectUrl = url;
        };

        /**
         * Mandatory provider $get function. here we can inject the dependencies the
         * actual implementation needs, in this case $q (and $window for redirection)
         */
        this.$get = [ '$q', '$window', function($q, $window) {
            //Ref our config object
            var config = this.config;
            // Add our custom success/failure handlers to the promise chain..
            function interceptorImpl(promise) {
                return promise.then(function(response) {
                    // success - simply return response as-is..
                    return response;
                }, function(response) {
                    // for 403 responses - redirect browser to configured redirect url
                    if (response.status === 403) {
                        $window.location.href = config.redirectUrl;
                    }
                    // signal rejection (arguably not meaningful here since we just
                    // issued a redirect)
                    return $q.reject(response);
                });
            }

            return interceptorImpl;
        }];
    });
