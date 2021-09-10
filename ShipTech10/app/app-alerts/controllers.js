/**
 * Labs Controller
 */
APP_ALERTS.controller('Controller_Alerts', [ '$scope', '$rootScope', '$Api_Service', 'Factory_Master', 'API', '$state', '$location', '$q', '$compile', '$timeout', '$filter', function($scope, $rootScope, $Api_Service, Factory_Master, API, $state, $location, $q, $compile, $timeout, $filter) {
    let vm = this;
    let guid = '';
    vm.master_id = $state.params.master_id;
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object();
    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }
    vm.response = '';
    vm.ids = '';
    vm.formSteps = function() {
        setTimeout(() => {
            $('#formBuilderContent').bootstrapWizard({
                nextSelector: '.button-next',
                previousSelector: '.button-previous',
                onTabClick: function(tab, navigation, index, clickedIndex) {
                    return;
                },
                onNext: function(tab, navigation, index) {
                    alert(1);
                },
                onPrevious: function(tab, navigation, index) {},
                onTabShow: function(tab, navigation, index) {
                    let current = index + 1;
                    if (current >= 1) {
                        $('.button-previous').removeClass('disabled');
                    } else {
                        $('.button-previous').addClass('disabled');
                    }
                    if (current >= 7) {
                        $('.button-next').addClass('disabled');
                        $('.button-submint').removeClass('hide');
                    } else {
                        $('.button-submint').addClass('hide');
                        $('.button-next').removeClass('disabled');
                    }
                }
            });
        }, 10);
    };
    $scope.formatDate = function(elem, dateFormat) {
        if (elem) {
            var messageDate = new Date(elem);
            var nowTime = new Date();
            var difference = (nowTime - messageDate) / 1000;
            var difference = JSON.stringify(difference);
            var secondsPassed = difference.split('.')[0];
            var minutesPassed = JSON.stringify(secondsPassed / 60).split('.')[0];
            var hoursPassed = JSON.stringify(minutesPassed / 60).split('.')[0];
            var daysPassed = JSON.stringify(hoursPassed / 60).split('.')[0];
            if (minutesPassed < 1) {
                return 'Just Now';
            }
            if (hoursPassed < 1) {
                return `${minutesPassed } mins ago`;
            }
            if (daysPassed < 1) {
                return `${hoursPassed } hours ago`;
            }
            if (daysPassed >= 1) {
                return `${daysPassed } days ago`;
            }
        }
    };

    /* Bussiness Alerts*/
    $scope.pasteHtmlAtCaret = function(html) {
        let sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                let el = document.createElement('div');
                el.innerHTML = html;
                let frag = document.createDocumentFragment(),
                    node, lastNode;
                while (node = el.firstChild) {
                    lastNode = frag.appendChild(node);
                }
                let firstNode = frag.firstChild;
                range.insertNode(frag);
                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.setStartBefore(firstNode);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if ((sel = document.selection) && sel.type != 'Control') {
            // IE < 9
            let originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
            range = sel.createRange();
            range.setEndPoint('EndToEnd', originalRange);
            range.select();
        }
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    };
    $scope.moveCaret = function(win, charCount) {
        let sel, range;
        if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                let textNode = sel.focusNode;
                let newOffset = charCount;
                sel.collapse(textNode, Math.min(textNode.length, newOffset));
            }
        } else if (sel = win.document.selection) {
            if (sel.type != 'Control') {
                range = sel.createRange();
                range.move('character', charCount);
                range.select();
            }
        }
    };
    $scope.getCaretPosition = function(editableDiv) {
        let caretPos = 0,
            sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (range.commonAncestorContainer.parentNode == editableDiv) {
                    caretPos = range.endOffset;
                }
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            if (range.parentElement() == editableDiv) {
                let tempEl = document.createElement('span');
                editableDiv.insertBefore(tempEl, editableDiv.firstChild);
                let tempRange = range.duplicate();
                tempRange.moveToElementText(tempEl);
                tempRange.setEndPoint('EndToEnd', range);
                caretPos = tempRange.text.length;
            }
        }
        return caretPos;
    };
    $scope.placeCaretAtEnd = function(el) {
        el.focus();
        if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
            let range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != 'undefined') {
            let textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    };
    $scope.setCaretPosition = function() {
        $scope.caretPosition = window.getSelection().anchorOffset;
    };
    $scope.addHtmlValueIn = function(value, targetElement) {
        // val = value.name;
        $(targetElement).focus();
        // caretPosition = 0;
        // caretPosition = $scope.caretPosition;
        if ($scope.caretPosition == 0 || typeof $scope.caretPosition == 'undefined') {
            $scope.placeCaretAtEnd($(targetElement).get(0));
        }
        $scope.moveCaret(window, $scope.caretPosition);
        if (!value) {
            return;
        }
        if (!value.id) {
            return;
        }
        // console..log(document.activeElement);
        $scope.pasteHtmlAtCaret(`<span class="tag" contenteditable="false"><span class="hidden">{</span><b contenteditable="false" parameter-id="${ value.id }">${ value.name }</b><span class="hidden">}</span></span>`);
        $scope.caretPosition = 0;
        return false;
    };
    $scope.cleanUnwantedChars = function($event) {
        if ($event.keyCode == '123' || $event.keyCode == '125') {
            $event.preventDefault();
            toastr.error('Following characters are forbidden: \'{\', \'}\'');
        }
    };
    $scope.convertForSave = function($event) {
        element = $event.target;
        $scope.formValues.messageTemplate = $(element).text();
        $('#clonedAlertMessage').html($('#alertMessage').html());
        var tags = $('#clonedAlertMessage span.tag');
        $.each(tags, function(key, value) {
            $(this).children('b').text($(this).children('b').attr('parameter-id'));
        });
        $scope.formValues.messageTemplate = $('#clonedAlertMessage').text();
    };
    $scope.initAlertTransform = function() {
        var str = $scope.formValues.messageTemplate;
        var startTag = '<span class="tag" contenteditable="false"><span class="hidden">{</span><b contenteditable="false">';
        var endTag = '</b><span class="hidden">}</span></span>';
        str = str.replace(/{/g, startTag);
        str = str.replace(/}/g, endTag);
        var parameters = [];
        $.each($scope.formValues.parameters, (key, value) => {
            parameters[value.id] = value.name;
        });
        var targetElement = $('#alertMessage');
        setTimeout(() => {
            targetElement.html(str);
            var tags = $('#alertMessage span.tag');
            $.each(tags, function(key, value) {
                let currentText = $(this).children('b').text();
                $(this).children('b').attr('parameter-id', currentText);
                $(this).children('b').text(parameters[currentText]);
            });
        });
    };
    $scope.initAlertsModal = function() {
        $rootScope.alertsActiveTab = 1;
        $rootScope.$watch('formValues', () => {
            if ($rootScope.formValues.id) {
                if (typeof copyAlertAction != 'undefined') {
                    if (copyAlertAction) {
                        $rootScope.formValues.id = 0;
                        $rootScope.formValues.name = null;
                        var copyAlertAction = null;
                    }
                }
            }
        });
        $rootScope.$watch('alertsActiveTab', () => {
            $scope.alertsActiveTab = $rootScope.alertsActiveTab;
        });
    };
    $scope.initWatchAlerts = function() {
        $rootScope.$watch('alertsActiveTab', () => {
            $scope.alertsActiveTab = $rootScope.alertsActiveTab;
        });
    };
    $scope.backTabAlert = function() {
        $rootScope.alertsActiveTab = $rootScope.alertsActiveTab - 1;
    };
    $scope.nextTabAlert = function(currentTab) {
        if (currentTab == 1) {
            if (typeof $rootScope.formValues.name == 'undefined' || typeof $rootScope.formValues.apps == 'undefined' || typeof $rootScope.formValues.transactions == 'undefined') {
                toastr.error('Please check that all the fields are filled');
                return;
            }
            if ($rootScope.formValues.name == '' || $rootScope.formValues.apps.length < 1 || $rootScope.formValues.transactions.length < 1) {
                toastr.error('Please check that all the fields are filled');
                return;
            }
        }
        if (currentTab == 2) {
            if (typeof $rootScope.formValues.parameters == 'undefined') {
                toastr.error('Please check that all the fields are filled');
                return;
            }
            if ($rootScope.formValues.parameters.length < 1) {
                toastr.error('Please check that all the fields are filled');
                return;
            }
        }
        if (currentTab == 3) {
            if (typeof $rootScope.formValues.triggerRules == 'undefined') {
                toastr.error('Please check that all the fields are filled');
                return;
            }
            var hasError = false;
            $.each($rootScope.formValues.triggerRules, (k, v) => {
                if (!v.parameterId || !v.conditionId) {
                    hasError = true;
                }
            });
            if (hasError == true) {
                toastr.error('Please check that all the fields are filled');
                return;
            }
        }
        if (currentTab == 4) {
            if (typeof $rootScope.formValues.messageTemplate == 'undefined') {
                toastr.error('Please check that all the fields are filled');
                return;
            }
            if ($rootScope.formValues.messageTemplate.length < 1) {
                toastr.error('Please check that all the fields are filled');
                return;
            }
        }
        if (currentTab == 5) {
            if (typeof $rootScope.formValues.includedUsers == 'undefined') {
                toastr.error('Please check that all the fields are filled');
                return;
            }
            if ($rootScope.formValues.includedUsers.length < 1) {
                toastr.error('Please check that all the fields are filled');
                return;
            }
        }
        $rootScope.alertsActiveTab = $rootScope.alertsActiveTab + 1;
    };
    $scope.addAppInAlert = function(dummyModel) {
        if (typeof $scope.formValues.apps == 'undefined' || $scope.formValues.apps == null) {
            $scope.formValues.apps = [];
        }
        var addedApps = [];
        $.each($scope.formValues.apps, (k, v) => {
            addedApps.push(v.id);
        });
        if (addedApps.length > 0) {
            if (dummyModel.id == 9) {
                toastr.error('Master can only be added individualy!');
                return;
            }
            if (addedApps[0] == 9) {
                toastr.error('Master can only be added individualy!');
                return;
            }
        }
        if (addedApps.length == 3) {
            toastr.error('You can select maximum 3 apps');
            return;
        }
        if (addedApps.indexOf(dummyModel.id) == -1) {
            $scope.formValues.apps.push(dummyModel);
        } else {
            toastr.error('App is already added');
        }
        $scope.getTransactionsForApp();
    };
    $scope.addTransactionInAlert = function(dummyModel) {
        if (typeof $scope.formValues.transactions == 'undefined' || $scope.formValues.transactions == null) {
            $scope.formValues.transactions = [];
        }
        var addedTransactions = [];
        $.each($scope.formValues.transactions, (k, v) => {
            addedTransactions.push(v.id);
        });
        if (addedTransactions.length > 0 && $scope.formValues.apps[0].id == 9) {
            toastr.error('Only one transaction is permitted if selected App is Master');
            return;
        }
        if (addedTransactions.indexOf(dummyModel.id) == -1) {
            $scope.formValues.transactions.push(dummyModel);
        } else {
            toastr.error('Transaction is already added');
        }
        $scope.getTransactionsForApp();
    };
    $scope.addRolesInAlert = function(dummyModel) {
        if (typeof $scope.formValues.roles == 'undefined' || $scope.formValues.roles == null) {
            $scope.formValues.roles = [];
        }
        var addedroles = [];
        $.each($scope.formValues.roles, (k, v) => {
            addedroles.push(v.id);
        });
        if (addedroles.indexOf(dummyModel.id) == -1) {
            $scope.formValues.roles.push(dummyModel);
        } else {
            toastr.error('Role is already added');
        }
    };
    $scope.getAlertsParametersForTransaction = function() {
        $.each(Object.keys($scope.options), (key, value) => {
            if (value.indexOf('alertsParametersForTransaction') != -1) {
                $scope.options[value] = [];
            }
        });
        Factory_Master.getAlertsParametersForTransaction(null, (response) => {
            if (response) {
                if (response.status == true) {
                    var result = response.data;
                    $scope.allParametersData = response.data;
                    $.each(result, (key, value) => {
                        if (typeof $scope.options[`alertsParametersForTransaction${ value.transactionId}`] == 'undefined') {
                            $scope.options[`alertsParametersForTransaction${ value.transactionId}`] = [];
                        }
                        $scope.options[`alertsParametersForTransaction${ value.transactionId}`].push({
                            id: value.id,
                            name: value.name,
                            transactionId: value.transactionId
                        });
                    });
                } else {
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.alertsGetAllParametersData = function() {
        Factory_Master.getAlertsParametersForTransaction(null, (response) => {
            if (response) {
                console.log(response);
                if (response.status == true) {
                    $scope.initAllParametersData = response.data;
                } else {
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.alertsGetRuleCondition = function() {
        Factory_Master.alertsGetRuleCondition(null, (response) => {
            if (response) {
                if (response.status == true) {
                    var result = response.data;
                    $scope.options.alertsCondition = result;
                } else {
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.alertsGetRuleOperator = function() {
        Factory_Master.alertsGetRuleOperator(null, (response) => {
            if (response) {
                if (response.status == true) {
                    var result = response.data;
                    $scope.options.alertsOperator = result;
                } else {
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.changeAlertsOperatorsId = function(elem) {
        $.each($scope.formValues.triggerRules, (k, v) => {
            if (k > 0) {
                v.operatorId = elem.id;
                $scope.CM.selectedOperatorId[k] = elem;
            }
        });
    };
    $scope.removeAlertsParameterById = function(paramId) {
        $.each($scope.formValues.parameters, (key, val) => {
            if (val.id == paramId) {
                $scope.formValues.parameters.splice(key, 1);
            }
        });
    };
    $scope.alertsAddParameter = function(objToAdd) {
        if (!objToAdd.id) {
            return;
        }
        var currentParamIds = [];
        if (typeof $scope.formValues.parameters == 'undefined') {
            $scope.formValues.parameters = [];
        }
        $.each($scope.formValues.parameters, (key, val) => {
            currentParamIds.push(val.id);
        });
        if (currentParamIds.indexOf(objToAdd.id) == -1) {
            $scope.formValues.parameters.push(objToAdd);
            $rootScope.formValues.messageTemplate = null;
            $scope.formValues.messageTemplate = null;
        } else {
            toastr.error('Parameter is already added');
        }
    };
    $scope.getTransactionsForApp = function() {
        setTimeout(() => {
            var apps = $scope.formValues.apps;
            var currentTransactions = $scope.formValues.transactions;
            Factory_Master.getTransactionsForApp(null, (response) => {
                if (response) {
                    if (response.status == true) {
                        var availableTransactions = [];
                        var transactions = response.data;
                        $.each(transactions, (key, value) => {
                            var transactionAppId = value.appId;
                            $.each(apps, (key2, value2) => {
                                if (value2.id == transactionAppId) {
                                    availableTransactions.push(value);
                                }
                            });
                        });
                        var transactionsToRmv = [];
                        $.each(currentTransactions, (idx, val) => {
                            var inTransactions = false;
                            $.each(availableTransactions, (idx2, val2) => {
                                if (val.id == val2.id) {
                                    inTransactions = true;
                                }
                            });
                            if (!inTransactions) {
                                transactionsToRmv.push(idx);
                            }
                        });
                        transactionsToRmv.reverse();
                        $.each(transactionsToRmv, (k, v) => {
                            $scope.formValues.transactions.splice(v, 1);
                        });
                        $scope.CM.appTransactions = availableTransactions;
                        $scope.options.selectTransaction = availableTransactions;
                    } else {
                        toastr.error(response.message);
                    }
                }
            });
        }, 100);
    };
    $scope.alertsGetTriggerRuleValuesByParamId = function(paramId) {
        console.log(paramId);
        console.log($scope.formValues.parameters);
        if (typeof $scope.parameterTypeId == 'undefined') {
            $scope.parameterTypeId = [];
        }
        $scope.parameterTypeId[paramId] = {};
        $.each($scope.initAllParametersData, (key, value) => {
            if (value.id == paramId) {
                $scope.parameterTypeId[paramId].id = value.parameterTypeId;
                $scope.parameterTypeId[paramId].conditions = value.parameterType.conditions;
            }
        });
        if (typeof paramId !== 'undefined') {
            Factory_Master.alertsGetTriggerRuleValuesByParamId(paramId, (response) => {
                if (response) {
                    if (response.status == true) {
                        var result = response.data;
                        $scope.options[`triggerRuleValuesFor${ paramId}`] = result;
                    } else {
                        toastr.error(response.message);
                        $scope.alertsGetTriggerRuleValuesByParamId(paramId);
                    }
                }
            });
        }
    };
    $scope.alertsGetRoles = function() {
        Factory_Master.alertsGetRoles(null, (response) => {
            if (response) {
                if (response.status == true) {
                    var result = response.data;
                    $scope.options.userRoles = result;
                } else {
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.alertsGetUserFromRoles = function() {
        if (typeof $scope.formValues.includedUsers == 'undefined') {
            $scope.formValues.includedUsers = [];
        }
        if (typeof $scope.formValues.excludedUsers == 'undefined') {
            $scope.formValues.excludedUsers = [];
        }
        var currentRolesIds = [];
        Factory_Master.alertsGetUserFromRoles(null, (response) => {
            if (response) {
                $.each($scope.formValues.roles, (key, value) => {
                    currentRolesIds.push(value.id);
                });
                if (response.status == true) {
                    var result = response.data;
                    var availableUsers = [];
                    var availableUsersIds = [];
                    $.each(result, (key, value) => {
                        $.each(value.roleIds, (k, v) => {
                            if (currentRolesIds.indexOf(v) !== -1) {
                                availableUsers.push(value);
                                availableUsersIds.push(value.id);
                            }
                        });
                    });
                    var includedUsersIds = [];
                    $.each($scope.formValues.includedUsers, (key, val) => {
                        if (availableUsersIds.indexOf(val.id) == -1) {
                            $scope.formValues.includedUsers.splice(key, 1);
                        }
                        includedUsersIds.push(val.id);
                    });
                    var excludedUsersIds = [];
                    $.each($scope.formValues.excludedUsers, (key, val) => {
                        if (availableUsersIds.indexOf(val.id) == -1) {
                            $scope.formValues.excludedUsers.splice(key, 1);
                        }
                        excludedUsersIds.push(val.id);
                    });
                    $.each(availableUsers, (key, value) => {
                        if (includedUsersIds.indexOf(value.id) == -1 && excludedUsersIds.indexOf(value.id) == -1) {
                            $scope.formValues.excludedUsers.push({
                                id: value.id,
                                name: value.name
                            });
                        }
                    });
                } else {
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.getAlertTypes = function() {
        Factory_Master.getAlertTypes(null, (response) => {
            if (response) {
                if (response.status == true) {
                    var result = response.data;
                    $scope.options.alertTypes = result;
                } else {
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.checkAlertTypes = function() {
        setTimeout(() => {
            $scope.EmailTypeIsSelected = false;
            $.each($scope.formValues.types, (key, val) => {
                if (val.name == 'Email') {
                    $scope.EmailTypeIsSelected = true;
                }
            });
        });
    };
    $scope.initIncludedEmailUsers = function() {
        typeof $scope.formValues.includedEmailUsers == 'undefined' ? $scope.formValues.includedEmailUsers = [] : '';
        $scope.formValues.excludedEmailUsers = [];
        var includedEmailUsersIds = [];
        $.each($scope.formValues.includedEmailUsers, (k, v) => {
            includedEmailUsersIds.push(v.id);
        });
        $.each($scope.formValues.includedUsers, (key, value) => {
            if (includedEmailUsersIds.indexOf(value.id) == -1) {
                $scope.formValues.excludedEmailUsers.push(value);
            }
        });
    };
    $scope.alertsGetActivationDetailsOptions = function() {
        Factory_Master.alertsGetActivationDetailsRecurrences(null, (response) => {
            if (response) {
                if (response.status == true) {
                    console.log(response);
                    $scope.options.AlertsRecurrences = response.data;
                } else {
                    toastr.error(response.message);
                }
            }
        });
        Factory_Master.alertsGetActivationDetailsUntils(null, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.options.AlertsUntils = response.data;
                } else {
                    toastr.error(response.message);
                }
            }
        });
    };

    /* Bussiness Alerts*/
    /* Notification Page*/
    $scope.initNotificationsPage = function() {
        $scope.getNotificationsList();
    };
    $scope.getNotificationsList = function(page, entries) {
        if (!page) {
            page = 1;
        }
        if (!entries) {
            $scope.entries = 10;
        }
        var skip = $scope.entries * (page - 1);
        if ($state.params.title == 'NOTIFICATION') {
            $scope.read = true;
        } else {
            $scope.read = false;
        }
        var data = {
            Payload: {
                Filters: [ {
                    ColumnName: 'IsRead',
                    Value: false
                }, {
                    ColumnName: 'MarkAsRead',
                    Value: $scope.read
                } ],
                Pagination: {
                    Skip: skip,
                    Take: $scope.entries
                },
                Order : {
                	ColumnName : 'addedAt',
                	SortOrder : 'desc'
                }
            }
        };
        Factory_Master.getNotificationsList(data, (callback) => {
            if (callback) {
                if (callback.status == true) {
                    $scope.notificationList = callback.data;
                    $scope.matchedCount = callback.matchedCount;
                    $scope.currentPage = page;
                    $scope.maxPages = Math.ceil(callback.matchedCount / $scope.entries);
                } else {
                    toastr.error('An error has occured!');
                }
            }
        });
    };
    $scope.getNotificationsListPage = function(currentPage, direction) {
        if (direction == 'next') {
            var newPage = currentPage + 1;
        }
        if (direction == 'prev') {
            var newPage = currentPage - 1;
        }
        $scope.getNotificationsList(newPage, null);
        $rootScope.selectedNotifications = [];
    };
    $scope.selectNotification = function(modelVal, notificationId) {
        if (modelVal == true) {
            $rootScope.selectedNotifications = notificationId;
            $.each($scope.notificationList, (k, v) => {
                if (v.id != notificationId) {
                    v.checked = false;
                }
            });
        } else {
            $rootScope.selectedNotifications = null;
        };
    };
    $scope.notificationAction = function(type) {
        if ($rootScope.selectedNotifications == null || typeof $rootScope.selectedNotifications == 'undefined') {
            if (type != 'stats') {
                toastr.error('Please select a notification!');
                return;
            }
        }
        console.log(type);
        var data = {
            action: type,
            notificationId: $rootScope.selectedNotifications
        };
        Factory_Master.notificationsActions(data, (callback) => {
            if (callback) {
                if (callback.status == true) {
                    if (type != 'stats') {
                        toastr.success('Success!');
                        $state.reload();
                    } else {
                        $rootScope.notificationsStats = callback.data.unreadCount;
                    }
                } else {
                    toastr.error('An error has occured!');
                }
            }
        });
    };

    /* END Notification Page*/
    $scope.loaded = function() {
        $timeout(() => {
            console.log(1213);
        }, 0);
    };
} ]);
