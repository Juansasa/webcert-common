/**
 * wcDialogService - Generic dialog service
 */
angular
        .module('common')
        .factory(
                'common.dialogService',
                function($modal) {
                    'use strict';

                    function _showErrorMessageDialog(message, callback) {
                        var msgbox = $modal.open({
                            templateUrl: '/web/webjars/common/webcert/js/services/dialogServiceErrorTemplate.html',
                            controller: function($scope, $modalInstance, bodyText) {
                                $scope.bodyText = bodyText;
                            },
                            resolve: {
                                bodyText: function() {
                                    return angular.copy(message);
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

                    function _showMessageDialog(titleId, bodyText, callback) {
                        var msgbox = $modal.open({
                            templateUrl: '/web/webjars/common/webcert/js/services/dialogServiceMessageTemplate.html',
                            controller: function($scope, $modalInstance, bodyText, titleId) {
                                $scope.bodyText = bodyText;
                                $scope.titleId = titleId;
                            },
                            resolve: {
                                bodyText: function() {
                                    return angular.copy(bodyText);
                                },
                                titleId: function() {
                                    return angular.copy(titleId);
                                }
                            }
                        });

                        msgbox.result['finally'](function(result) {
                            if (callback) {
                                callback(result);
                            }
                        });
                    }

                    /*
                     showDialog parameters:

                     scope = parent scope

                     options =
                     dialogId: html id attribute of dialog
                     titleId: message id of title text
                     bodyTextId: message id of body text
                     bodyText: body text (can be used instead of or in addition to bodyTextId
                     button1id: (optional) html id attribute of button 1
                     button2id: (optional) html id attribute of button 2
                     button3id: (optional) html id attribute of button 3
                     button1click: (optional) function on button 1 click
                     button2click: (optional) function on button 2 click
                     button3click: (optional) function on button 3 click
                     button1text: (optional) message id on button 1 text. default: OK
                     button2text: (optional) message id on button 2 text. default: Cancel
                     button3text: (optional) message id on button 3 text. default: No, don't ask
                     button3visible: (optional) whether button 3 should be visible. default: true if button3text is specified, otherwise false
                     autoClose: whether dialog should close on button click. If false, use .close() on return value from showDialog to close dialog later
                     */
                    function _showDialog(scope, options) {

                        if (scope.dialog === undefined) {
                            scope.dialog = {};
                        }

                        scope.dialog.errormessageid = (scope.dialog.errormessageid ? scope.dialog.errormessageid : 'common.error.cantconnect');
                        scope.dialog.acceptprogressdone = (scope.dialog.acceptprogressdone ? scope.dialog.acceptprogressdone : true);
                        scope.dialog.focus = (scope.dialog.focus ? scope.dialog.focus : false);
                        scope.dialog.showerror = (scope.dialog.showerror ? scope.dialog.showerror : false);

                        if (options.dialogId === undefined) {
                            throw 'dialogId must be specified';
                        }

                        // setup options defaults if parameters aren't included
                        options.bodyText = (options.bodyText === undefined) ? '' : options.bodyText;
                        options.button1text = (options.button1text === undefined) ? 'common.ok' : options.button1text;
                        options.button2text = (options.button2text === undefined) ? 'common.cancel' : options.button2text;
                        options.button3text = (options.button3text === undefined) ? undefined : options.button3text;
                        options.button3visible = options.button3visible === undefined ? options.button3text !== undefined : options.button3visible;
                        options.button1id = (options.button1id === undefined) ? 'button1' + options.dialogId : options.button1id;
                        options.button2id = (options.button2id === undefined) ? 'button2' + options.dialogId : options.button2id;
                        options.button3id = (options.button3id === undefined) ? 'button3' + options.dialogId : options.button3id;
                        options.autoClose = (options.autoClose === undefined) ? true : options.autoClose;
                        options.templateUrl = (options.templateUrl === undefined) ? '/views/partials/common-dialog.html' : options.templateUrl;
                        options.model = (options.model === undefined) ? undefined : options.model;

                        // Create controller to setup dialog
                        var DialogInstanceCtrl = function($scope, $modalInstance, model, dialogId, titleId, bodyTextId, bodyText, button1id, button2id, button3id, button1click, button2click, button3click, button3visible, button1text, button2text, button3text, autoClose) {

                            $scope.model = model;
                            $scope.dialogId = dialogId;
                            $scope.titleId = titleId;
                            $scope.bodyTextId = bodyTextId;
                            $scope.bodyText = bodyText;
                            $scope.button1click = function(result) {
                                button1click();
                                if (autoClose) {
                                    $modalInstance.close(result);
                                }
                            };
                            $scope.button2click = function() {
                                if (button2click) {
                                    button2click();
                                }
                                $modalInstance.dismiss('button2 dismiss');
                            };
                            $scope.button3visible = button3visible;
                            if ($scope.button3visible !== undefined) {
                                $scope.button3click = function() {
                                    if (button3click) {
                                        button3click();
                                    }
                                    $modalInstance.dismiss('button3 dismiss');
                                };
                            } else {
                                $scope.button3visible = false;
                            }
                            $scope.button1text = button1text;
                            $scope.button2text = button2text;
                            $scope.button3text = button3text;
                            $scope.button1id = button1id;
                            $scope.button2id = button2id;
                            $scope.button3id = button3id;
                        };

                        // Open dialog box using specified options, template and controller
                        var msgbox = $modal.open({
                            scope: scope,
                            templateUrl: options.templateUrl,
                            controller: DialogInstanceCtrl,
                            resolve: {
                                model: function() {
                                    return options.model;
                                },
                                dialogId: function() {
                                    return angular.copy(options.dialogId);
                                },
                                titleId: function() {
                                    return angular.copy(options.titleId);
                                },
                                bodyTextId: function() {
                                    return angular.copy(options.bodyTextId);
                                },
                                bodyText: function() {
                                    return angular.copy(options.bodyText);
                                },
                                button1id: function() {
                                    return angular.copy(options.button1id);
                                },
                                button2id: function() {
                                    return angular.copy(options.button2id);
                                },
                                button3id: function() {
                                    return angular.copy(options.button3id);
                                },
                                button1click: function() {
                                    return options.button1click;
                                },
                                button2click: function() {
                                    return options.button2click;
                                },
                                button3click: function() {
                                    return options.button3click;
                                },
                                button1text: function() {
                                    return angular.copy(options.button1text);
                                },
                                button2text: function() {
                                    return angular.copy(options.button2text);
                                },
                                button3text: function() {
                                    return angular.copy(options.button3text);
                                },
                                button3visible: function() {
                                    return angular.copy(options.button3visible);
                                },
                                autoClose: function() {
                                    return angular.copy(options.autoClose);
                                }
                            }
                        });

                        msgbox.result.then(function(result) {
                            if (options.callback) {
                                options.callback(result);
                            }
                        }, function() {
                        });

                        return msgbox;
                    }

                    // Return public API for the service
                    return {
                        showErrorMessageDialog: _showErrorMessageDialog,
                        showMessageDialog: _showMessageDialog,
                        showDialog: _showDialog
                    };
                });
