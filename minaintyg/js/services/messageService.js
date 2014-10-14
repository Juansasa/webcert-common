/**
 * message directive for externalizing text resources.
 *
 * All resourcekeys are expected to be defined in lowercase and available in a
 * global js object named "messages"
 * Also supports dynamic key values such as key="status.{{scopedvalue}}"
 *
 * Usage: <message key="some.resource.key" [fallback="defaulttextifnokeyfound"]/>
 */
angular.module('common').factory('common.messageService',
    function($rootScope) {
        'use strict';

        var _messageResources = null;

        function _getProperty(key, language, defaultValue, fallbackToDefaultLanguage) {
            var value;

            if (typeof language === 'undefined') {
                language = $rootScope.lang;
            }

            value = _getPropertyInLanguage(language, key);
            if (typeof value === 'undefined') {
                // use fallback attr value if defined
                if (fallbackToDefaultLanguage) {
                    value = _getPropertyInLanguage($rootScope.DEFAULT_LANG, key);
                }
                if (typeof value === 'undefined') {
                    // use fallback attr value if defined
                    value = (typeof defaultValue === 'undefined') ? '[Missing "' + key + '"]' : defaultValue;
                }
            }
            return value;
        }

        function _getPropertyInLanguage(lang, key) {
            _checkResources();
            return _lookupProperty(_messageResources[lang], key);
        }

        function _lookupProperty(resources, key) {
            return resources[key];
        }

        function _addResources(resources) {
            _checkResources();
            angular.extend(_messageResources.sv, resources.sv);
            angular.extend(_messageResources.en, resources.en);
        }

        function _checkResources() {
            if (_messageResources === null) {
                _messageResources = {
                    'sv': {
                        'initial.key': 'Initial nyckel'
                    },
                    'en': {
                        'initial.key': 'Initial key'
                    }
                };
            }
        }

        return {
            getProperty: _getProperty,
            addResources: _addResources
        };
    });
