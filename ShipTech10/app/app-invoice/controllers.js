/**
 * Invoice Controller
 */
APP_INVOICE.controller('Controller_Invoice', [ 'API', '$scope', '$rootScope', 'Factory_Invoice', '$state', '$location', '$q', '$compile', '$timeout', 'Factory_Master', '$listsCache', '$http', 'statusColors', '$tenantSettings', 'screenLoader', 'COMPONENT_TYPE_IDS', 'COST_TYPE_IDS', 'lookupModel', '$controller', '$filter', 'uiGridConstants', '$sce', function(API, $scope, $rootScope, Factory_Invoice, $state, $location, $q, $compile, $timeout, Factory_Master, $listsCache, $http, statusColors, $tenantSettings, screenLoader, COMPONENT_TYPE_IDS, COST_TYPE_IDS, lookupModel, $controller, $filter, uiGridConstants, $sce) {
    let vm = this;
    let guid = '';
    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }
    vm.listsCache = $listsCache;
    $scope.vm = this;
    $scope.newProp = 'adasdsad';
    // $controller("Controller_Master as CM", {
    //     $scope: $scope
    // });
    $controller('ScreenLayout_Controller', {
        $scope: $scope
    });

    $controller('Controller_Datatables', {
        $scope: $scope
    }); // This works

    vm.master_id = $state.params.master_id;
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object();
    vm.response = '';
    vm.ids = '';
    vm.additionalCostTypes = [];
    $scope.listsCache = $listsCache;
    vm.invoiceTree = [];


    /** *****************************************************************************/
    /** *****************************************************************************/

    if (!vm.entity_id) {
        $scope.isEdit = false;
        vm.isEdit = false;
        $scope.isCreate = true;
    } else {
        $scope.isEdit = true;
        vm.isEdit = true;
        $scope.isCreate = false;
    }

    vm.getStatusColor = function(statusName, cell) {
        let statusColor = statusColors.getDefaultColor();
        if(statusName) {
            statusColor = statusColors.getColorCode(statusName);
        }
        if(cell && cell.displayName) {
            statusColor = statusColors.getColorCode(cell.displayName);
            $.each(vm.listsCache.ScheduleDashboardLabelConfiguration, (k, v) => {
                if(cell.id === v.id && cell.transactionTypeId === v.transactionTypeId) {
                    statusColor = v.code;
                    return false;
                }
            });
        }
        return statusColor;
    };
    $scope.$on('visible_sections', (event, object) => {
        // console.log(12)
        $scope.visible_sections = object;
        if (vm.app_id == 'contracts') {
            if ($rootScope.formValues.productQuantityRequired) {
                vm.equalizeColumnsHeightGrouped('.group_ContractSummary', '.group_General_Contract, .group_contact');
            } else {
                vm.equalizeColumnsHeightGrouped('.group_ContractSummary', '.group_General_Contract, .group_contact, .group_contractualQuantity, .group_ProductDetails, .group_AdditionalCosts, .group_Penalty');
            }
        }
    });

    $scope.systemInstrumentCurrency = '';
    $scope.refreshValue = 0;
    $scope.tenantSetting = $tenantSettings;
    vm.tenantSetting = $tenantSettings;
    // console.log('tenantSetting', $scope.tenantSetting);
    $scope.addedFields = new Object();
    $scope.formFields = new Object();
    $scope.formValues = new Object();
    $scope.locationReload = function() {
        if ($scope.copiedId > 0) {
            localStorage.setItem(`${vm.app_id + vm.screen_id }_copy`, $scope.copiedId);
            $state.reload();
        } else {
            $scope.formValues = {};
        }
    };
    $scope.getDefaultUom = function() {
        return $scope.tenantSetting.tenantFormats.uom;
    };
    vm.getTranslations = function() {
        Factory_Master.getTranslations((callback) => {
            if (callback) {
                $scope.translations = callback;
            }
        });
    };
    vm.checkLabelsHeight = function() {
        setTimeout(() => {
            $.each($('.form-group label:not(.mt-checkbox)'), function(key, val) {
                if (this.offsetHeight > 26) {
                    $(this)
                        .css('height', 30)
                        .css('padding-top', 0);
                }
            });
        }, 1);
    };
    $scope.reset_form = function(ev) {
        if ($scope.copiedId > 0) {
            localStorage.setItem(`${vm.app_id + vm.screen_id }_copy`, $scope.copiedId);
            $state.reload();
        } else {
            $state.reload();
        }
    };
    $scope.undirtyForm = function() {
        if (vm.editInstance) {
            vm.editInstance.$pristine = true;
            vm.editInstance.$dirty = false;
            angular.forEach(vm.editInstance, (input, key) => {
                if (typeof input == 'object' && input.$name) {
                    if (input.$pristine) {
                        input.$pristine = true;
                    }
                    if (input.$dirty) {
                        input.$dirty = false;
                    }
                }
            });
        }
    };
    $scope.save_modal_entity = function(app, screen) {
        if (app == 'alerts' && screen == 'alerts') {
            if ($rootScope.formValues.isRecurrent && (typeof $rootScope.formValues.statusId == 'undefined' || $rootScope.formValues.statusId == null)) {
                toastr.error('Until status cannot be null if Remind Every is checked');
                return;
            }
            if ($rootScope.formValues.temp.dummyActivateOn && !$rootScope.formValues.activateOn) {
                toastr.error('Please select a date for activate on');
                return;
            }
            if ($rootScope.formValues.temp.dummyDeactivateOn && !$rootScope.formValues.deactivateOn) {
                toastr.error('Please select a date for deactivate on');
                return;
            }
        }
        vm.invalid_form = false;

        $rootScope.filterFromData = {};
        $.each($rootScope.formValues, (key, val) => {
            if (!angular.equals(val, [ {} ])) {
                $rootScope.filterFromData[key] = val;
            }
        });

        vm.fields = angular.toJson($rootScope.filterFromData);
        if ($rootScope.filterFromData.id > 0) {
            Factory_Master.save_master_changes(app, screen, vm.fields, (callback) => {
                if (callback.status == true) {
                    toastr.success(callback.message);
                    $('table.ui-jqgrid-btable').trigger('reloadGrid');
                    $scope.prettyCloseModal();
                    // $scope.modalInstance.close();
                } else if (callback.message) {
                    toastr.error(callback.message);
                } else {
                    toastr.error('An error has occured, please check the fields');
                }
            });
        } else {
            Factory_Master.create_master_entity(app, screen, vm.fields, (callback) => {
                if (callback.status == true) {
                    toastr.success(callback.message);
                    $('table.ui-jqgrid-btable').trigger('reloadGrid');
                    $scope.prettyCloseModal();
                } else if (callback.message) {
                    toastr.error(callback.message);
                } else {
                    toastr.error('An error has occured, please check the fields');
                }
            });
        }
    };

    $scope.save_master_changes = function(ev, sendEmails, noReload, completeCallback) {
        screenLoader.showLoader();
        $('form').addClass('submitted');
        vm.invalid_form = false;

        if (vm.editInstance.$valid) {
            $scope.filterFromData = {};
            $scope.submitedAction = true;
            $.each($scope.formValues, (key, val) => {
                if (!angular.equals(val, [ {} ])) {
                    $scope.filterFromData[key] = angular.copy(val);
                }
                if (val && val.id && angular.equals(val.id, -1)) {
                    $scope.filterFromData[key] = null;
                }
                if (vm.screen_id == 'formula' || vm.screen_id == 'labresult') {
                    if (angular.equals(val, {})) {
                        $scope.filterFromData[key] = null;
                    }
                    if (key == 'pricingScheduleOptionSpecificDate') {
                        if (val && val.dates && angular.equals(val.dates, [ {} ])) {
                            $scope.filterFromData[key] = null;
                        }
                    }
                }
            });

            if (vm.app_id == 'invoices' && vm.screen_id == 'invoice') {
            	var validCostDetails = [];
                if ($scope.filterFromData.costDetails.length > 0) {
                    $.each($scope.filterFromData.costDetails, (k, v) => {
                        if (typeof v.product != 'undefined' && v.product != null) {
                            if (v.product.id == -1) {
                                v.product = null;
                                v.deliveryProductId = null;
                            } else {
                                	if (v.product.productId) {
	                                    v.product.id = v.product.productId;
                                	}
                                	if (v.product.deliveryProductId) {
                                		v.deliveryProductId = angular.copy(v.product.deliveryProductId);
                                	}
	                            	v.isAllProductsCost = false;
	                            }
                        }
	                        if (Boolean(v.id) && !(v.id == 0 && v.isDeleted) || !v.Id && !v.isDeleted) {
                            // v.isDeleted = false;
	                        	validCostDetails.push(v);
	                        }
                    });
                }
                $scope.filterFromData.costDetails = validCostDetails;
                // return;
                var costTypeError = false;
                for (var i = $scope.filterFromData.costDetails.length - 1; i >= 0; i--) {
                    	if (!$scope.filterFromData.costDetails[i].costType) {
		                    costTypeError = true;
                    	}
                }
                if (costTypeError) {
                    toastr.error('Please select Cost type');
                    $scope.submitedAction = false;
                    return false;
                }
                if ($state.params.screen_id != 'claims') {
                    	var availableCostOrProductCount = 0;
                    	$.each($scope.filterFromData.productDetails, (k, v) => {
                    		if (!v.isDeleted) {
		                    	availableCostOrProductCount++;
                    		}
                    	});
                    	$.each($scope.filterFromData.costDetails, (k, v) => {
                    		if (!v.isDeleted) {
		                    	availableCostOrProductCount++;
                    		}
                    	});
                    if (availableCostOrProductCount == 0) {
                        toastr.error('Please add at least one product or one cost');
                        $scope.submitedAction = false;
                        return false;
                    }
                }
            }
            vm.fields = angular.toJson($scope.filterFromData);
            if (!vm.entity_id) {
                vm.entity_id = 0;
            }
            if (vm.entity_id > 0) {
                Factory_Master.save_master_changes(vm.app_id, vm.screen_id, vm.fields, (callback) => {
                    screenLoader.showLoader();
                    // alert('no reload');
                    if (callback.status == true) {
                        $scope.loaded = true;
                        if (vm.app_id == 'admin' && vm.screen_id == 'configuration') {
                            vm.entity_id = 0;
                        }
                        setTimeout(() => {
                            $scope.submitedAction = false;
                        }, 100);
                        if (sendEmails) {
                            $scope.sendEmails();
                        }
                        if(noReload == undefined || typeof noReload == undefined || !noReload) {
                            toastr.success(callback.message);
                            // alert('reloading');
                            $state.reload();
                            screenLoader.hideLoader();
                        } else if(completeCallback) {
                            toastr.success('Saved');
                            toastr.warning('Preparing to complete');
                            completeCallback();
                        }
                    } else {
                        // toastr.error(callback.message);
                        setTimeout(() => {
                            $scope.submitedAction = false;
                        }, 100);

                        if (vm.app_id == 'invoices' && vm.screen_id == 'invoice') {
                            if ($scope.filterFromData.costDetails.length > 0) {
                                $.each($scope.filterFromData.costDetails, (k, v) => {
                                    if (v.product == null) {
                                        if (v.associatedOrderProduct == 'All' || v.isAllProductsCost) {
                                            v.product = {
                                                id: -1
                                            };
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                Factory_Master.create_master_entity(vm.app_id, vm.screen_id, vm.fields, (callback) => {
                    if (callback.status == true) {
                        toastr.success(callback.message);
                        if (vm.app_id == 'admin' && vm.screen_id == 'configuration') {
                            vm.entity_id = 0;
                            Factory_Master.get_master_entity(vm.entity_id, vm.screen_id, vm.app_id, (callback2) => {
                                if (callback2) {
                                    $scope.formValues = callback2;
                                }
                            });
                        } else {
                        	var locationPath;
                            if ($location.path().slice(-2) == '/0') {
                                locationPath = $location.path().slice(0, -1);
                            } else {
                                locationPath = $location.path();
                            }
                            if (vm.app_id == 'admin') {
                                if(vm.screen_id == 'sellerrating') {
                                    // do nothing
                                }else if (sendEmails) {
                                    $location.path(locationPath + callback.id).hash('mail');
                                } else {
                                    $location.path(locationPath + callback.id);
                                }
                            }else if (sendEmails) {
                                $location.path(locationPath + callback.id).hash('mail');
                            } else {
                                $location.path(locationPath + callback.id);
                            }
                        }
                        setTimeout(() => {
                            $scope.submitedAction = false;
                        }, 100);
                    } else {
                        // toastr.error(callback.message);
                        setTimeout(() => {
                            $scope.submitedAction = false;
                        }, 1000);
                        $scope.submitedAction = false;
                    }
                });
            }
            // $scope.refreshSelect();
        } else {
            $scope.submitedAction = false;
            vm.invalid_form = true;
            let message = 'Please fill in required fields:';
            let names = [];
            $.each(vm.editInstance.$error.required, (key, val) => {
                if (names.indexOf(val.$name) == -1) {
                    message = `${message }<br>${ val.$name}`;
                }
                names = names + val.$name;
            });
            i = 0;
            $.each(vm.editInstance.$error.pattern, (key, val) => {
                i++;
                if (i === 1) {
                    message = `${message }<br>Please check format:`;
                }
                message = `${message }<br>${ val.$name}`;
            });
            toastr.error(message);
            setTimeout(() => {
                $scope.submitedAction = false;
            }, 100);
        }
    };
    $scope.triggerError = function(name, errors) {
        if (errors.$viewValue != 'NaN') {
            toastr.error(name);
        }
    };
    $scope.createModalParams = function(obj) {
        $rootScope.modalParams = obj;
    };
    $scope.$on('modal.closing', (event, reason, closed) => {
        if (!$scope.modalClosed) {
            if (typeof $scope.modalInstance != 'undefined') {
                event.preventDefault();
                console.log($rootScope.modalInstance);
                console.log($scope.modalInstance);
                $scope.prettyCloseModal();
                $scope.modalClosed = true;
            }
        }
    });
    $scope.prettyCloseModal = function() {
        let modalStyles = {
            transition: '0.3s',
            opacity: '0',
            transform: 'translateY(-50px)'
        };
        let bckStyles = {
            opacity: '0',
            transition: '0.3s'
        };
        $('[modal-render=\'true\']').css(modalStyles);
        $('.modal-backdrop').css(bckStyles);
        setTimeout(() => {
            if ($scope.modalInstance) {
                $scope.modalInstance.close();
            }
            if ($rootScope.modalInstance) {
                $rootScope.modalInstance.close();
            }
        }, 500);
    };
    vm.addHeadeActions = function() {
        $('.page-content-wrapper a[data-group="extern"]').each(function() {
            if ($(this).attr('data-compiled') == 0) {
                if ($(this).attr('data-method') != '') {
                    $(this).attr('ng-click', `${$(this).data('method') };submitedAcc("${ $(this).data('method') }")`);
                    $(this).attr('data-method', '');
                    $(this).attr('data-compiled', 1);
                    $compile($(this))($scope);
                }
            }
        });
        if (vm.app_id == 'masters' && vm.screen_id == 'counterparty') {
            $('.entity_active').attr('ng-model', 'formValues.isDeleted');
        } else {
            $('.entity_active')
                .attr('ng-checked', '!CM.entity_id || formValues.isDeleted == false')
                .attr('ng-true-value', 'false')
                .attr('ng-false-value', 'true')
                .attr('ng-model', 'formValues.isDeleted');
            $('.completed').attr('ng-model', 'formValues.completed');
            if (vm.screen_id == 'claimtype') {
                $('.entity_active').attr('ng-disabled', 'formValues.name ? true : false');
            }
        }
        $compile($('.entity_active'))($scope);
        $compile($('.completed'))($scope);
        // added++;
    };
    vm.delayaddModalActions = function() {
        setTimeout(() => {
            // $(this).unbind();
            $('.modal-content a[data-group="extern"]').each(function() {
                if (!$(this).attr('ng-click')) {
                    $(this).attr('ng-click', $(this).data('method'));
                    $(this).attr('data-method', '');
                    $(this).attr('data-compiled', Number($(this).attr('data-compiled')) + 1);
                    $compile($(this))($scope);
                }
            });
        }, 100);
    };
    vm.setPageTitle = function(title) {
        $state.params.title = title;
    };
    $scope.triggerChangeFields = function(name, id) {
        $rootScope.formDataFields = $scope.formValues;
        var fields = [ 'OrderID', 'labResultID', 'deliveryNumber', 'Product' ];
        var company_id = $('#companylistCompany').val();
        var market_id = $('#MarketInstrumentMarketInstrument').val();
        if (typeof $scope.triggerChangeFieldsAppSpecific == 'function') {
            $scope.triggerChangeFieldsAppSpecific(name, id);
        }
    };

    vm.getDataTable = function(id, data, obj, idx, app, screen) {
        $scope.dynamicTable = [];
        if (!app) {
            app = vm.app_id;
        }
        if (!screen) {
            screen = vm.screen_id;
        }
        if (id) {
            id = id.toLowerCase();
            Factory_Master.getDataTable(app, screen, id, data, (callback) => {
                if (callback) {
                    $scope.dynamicTable[id] = callback;
                    if (obj == 'labTestResults') {
                        $scope.formValues.labTestResults = [];
                        $scope.formValues.labTestResults = callback;
                    } else if (obj == 'deliveryProducts') {
                        $scope.formValues.deliveryProducts[idx].qualityParameters = [];
                        angular.merge($scope.formValues.deliveryProducts[idx].qualityParameters, callback);
                    } else if (obj == 'sealNumber') {
                        $scope.formValues.labSealNumberInformation = [];
                        $scope.formValues.labSealNumberInformation = callback;
                    }
                    $scope.selectedReconProduct = null;
                }
            });
        }
    };
    vm.useDisplayName = function(fieldName) {
        let displayNameList = [ 'invoiceStatus', 'ClaimType' ];
        let found = _.indexOf(displayNameList, fieldName);
        if(found < 0) {
            return false;
        }
        return true;
    };
    vm.getOptions = function(field, fromListsCache) {
        // Move this somewhere nice and warm
        var objectByString = function(obj, string) {
            if (string.includes('.')) {
                return objectByString(obj[string.split('.', 1)], string.replace(`${string.split('.', 1) }.`, ''));
            }
            return obj[string];
        };
        if (!fromListsCache) {
            if (field == 'agreementType') {
                field = { name: 'AgreementType' };
            }

            if (field) {
                if (!$scope.options) {
                    $scope.options = [];
                }

                // setTimeout(function() {
                if (field.Filter && typeof $scope.formValues != 'undefined') {
                    field.Filter.forEach((entry) => {
                        if (entry.ValueFrom == null) {
                            return;
                        }
                        let temp = 0;
                        try {
                            temp = _.get($scope, "formValues[" +  entry.ValueFrom.split(".").join("][") + "]");
                        } catch (error) {}
                        entry.Value = temp;
                    });
                }
                var retFunc = false;
                if (field.Name == 'Product') {
                    $.each(field.Filter, (key, val) => {
                        if (val.ColumnName == 'OrderId') {
                            if (val.Value == 0) {
                                retFunc = true;
                            }
                        }
                    });
                }
                if (retFunc) {
                    return;
                }

                let app_id = vm.app_id;
                let screen_id = vm.screen_id;
                if ($state.params.title == 'New Request' || $state.params.title == 'Edit Request') {
                    app_id = 'procurement';
                    screen_id = 'request';

                    if (field.Name == 'BunkerablePort') {
                        if (typeof field.filters != 'undefined' && field.filters != null) {
                            field.Filters = [
                                {
                                    ColumnName: 'VesselId',
                                    Value: field.filters.name.id
                                },
                                {
                                    ColumnName: 'VesselVoyageDetailId',
                                    Value: null
                                }
                            ];
                            delete field.filters;
                        }
                    }
                    if (field.Name == 'Buyer') {
                        if (typeof field.filters != 'undefined' && field.filters != null) {
                            field.Filters = [
                                {
                                    ColumnName: 'VesselId',
                                    Value: field.filters.name.id
                                },
                                {
                                    ColumnName: 'VesselVoyageDetailId',
                                    Value: null
                                }
                            ];
                            delete field.filters;
                        }
                    }
                }

                if (!$scope.optionsCache) {
                    $scope.optionsCache = {};
                }

                if (!(JSON.stringify($scope.optionsCache[field.Name]) == JSON.stringify(field))) {
                    $scope.optionsCache[field.Name] = JSON.stringify(field);
                    Factory_Master.get_master_list(app_id, screen_id, field, (callback) => {
                        if (callback) {
                            $scope.options[field.Name] = callback;
                            if (vm.app_id == 'masters' && vm.screen_id == 'vessel') {
                                vm.checkSpecGroup(field);
                            }
                            $scope.$watchGroup([ $scope.formValues, $scope.options ], () => {
                                $timeout(() => {
                                    var id;
                                    if (field.Type == 'textUOM') {
                                        id = `#${ field.Name}`;
                                    } else {
                                        id = `#${ field.masterSource }${field.Name}`;
                                    }
                                    if ($(id).data('val')) {
                                        $(id).val($(id).data('val'));
                                    }
                                }, 50);
                            });
                        }
                    });
                }
                // }, 1000)
            }
        } else {
            // get values from listsCache, put in options obj for specific dropdowns
            // get options for request status
            if (field.Name == 'etaFreezeStatus' && field.masterSource) {
                $scope.options.etaFreezeStatus = angular.copy($scope.listsCache.RequestStatus);
            }
            if (field.Name == 'numberOfCounterpartiesToDisplay') {
                console.log(vm.listsCache);
                $scope.options.numberOfCounterpartiesToDisplay = [];
                $.each(vm.listsCache.ItemsToDisplay, (key, val) => {
                    $scope.options.numberOfCounterpartiesToDisplay.push(val.name);
                });
            }
        }
    };

    $scope.multiTags = function(id, idx, name) {
        console.log('$scope.multiTags');
        let elt = $(`.object_tagsinput_${ id}`),
            elt_plus = $(`.object_tagsinput_add_${ id}`);
        elt.tagsinput({
            itemValue: 'value',
            itemText: 'text'
        });
        $(elt).on('itemAdded', (event) => {
            if (id == 'agents') {
                var index = $scope.formValues[id].length - 1;
                selectDefaultAgent(id, index);
            }
        });
        $(elt).on('itemRemoved', (event) => {
            let idToRemove = event.item.value;
            $.each($scope.formValues[id], (index, value) => {
                var indexRmv;
                if (id == 'applications' && vm.screen_id == 'sellerrating') {
                    if (value.module.id == idToRemove) {
                        indexRmv = index;
                    }
                } else {
                    indexRmv = null;
                    if (typeof value == 'undefined') {
                        return;
                    }
                    console.log(value.id);
                    console.log(idToRemove);
                    if (id == 'agents') {
                        var comparator = 'counterpartyId';
                        if (value[comparator] == idToRemove) {
                            indexRmv = index;
                            console.log($scope.formValues[id][index]);
                            $('*').tooltip('destroy');
                            if ($scope.formValues[id][index].id > 0) {
                                $scope.formValues[id][index].isDeleted = true;
                            } else {
                                $scope.formValues[id].splice(index, 1);
                            }
                        }
                    } else {
                        comparator = 'id';
                        if (value[comparator] == idToRemove) {
                            indexRmv = index;
                            $scope.formValues[id].splice(index, 1);
                        }
                    }
                }
            });
            hideTheChildren();
        });
        elt_plus.on('click', () => {
        	var selector;
            if (idx >= 0) {
                selector = id + idx;
            } else {
                selector = id;
            }
            if ($(`#${ selector}`).attr('data-value') != '') {
                let itemToAdd = {};
                if (id == 'agents') {
                    $.each($scope.options.Agents, (index, value) => {
                        if ($('#agentsVal').val() == value.id) {
                            itemToAdd = {
                                counterpartyId: value.id,
                                counterpartyName: value.name,
                                id: 0,
                                isDefault: false
                            };
                        }
                    });
                } else {
                    $.each($scope.options[name], (index, value) => {
                        var selectorElement = $(`#${ selector }:not([data-value^="{{"])`);
                        if (selectorElement.attr('data-value') == value.id) {
                            itemToAdd = {
                                id: value.id,
                                name: value.name
                            };
                        }
                    });
                }
                if ($scope.formValues[id] == '' || !$scope.formValues[id]) {
                    $scope.formValues[id] = [];
                    if (id == 'agents' && itemToAdd) {
                        $scope.formValues[id].push(itemToAdd);
                        elt.tagsinput('add', {
                            value: itemToAdd.counterpartyId,
                            text: itemToAdd.counterpartyName
                        });
                    } else if (id == 'applications' && vm.screen_id == 'sellerrating') {
                        $scope.formValues.applications.push({
                            module: {
                                id: itemToAdd.id,
                                name: itemToAdd.name
                            }
                        });
                        elt.tagsinput('add', {
                            value: itemToAdd.id,
                            text: itemToAdd.name
                        });
                    } else if (id == 'allowedCompanies' && vm.screen_id == 'contract') {
                        if (itemToAdd.id != $scope.formValues.company.id) {
                            $scope.formValues[id].push(itemToAdd);
                            // $scope.formValues[id].push('asdaskdnqw');
                            elt.tagsinput('add', {
                                value: itemToAdd.id,
                                text: itemToAdd.name
                            });
                        } else {
                            toastr.error('This is main company');
                        }
                    }
                } else {
                    let added = [];
                    if (id == 'agents') {
                        $.each($scope.formValues.agents, (index, value) => {
                            added.push(value.counterpartyId);
                        });
                        console.log(itemToAdd);
                        if ($.inArray(itemToAdd.counterpartyId, added) == -1 && itemToAdd.id >= 0) {
                            $scope.formValues.agents.push(itemToAdd);
                            elt.tagsinput('add', {
                                value: itemToAdd.counterpartyId,
                                text: itemToAdd.counterpartyName
                            });
                        }
                    } else if (id == 'applications' && vm.screen_id == 'sellerrating') {
                        $.each($scope.formValues.applications, (index, value) => {
                            added.push(value.module.id);
                        });
                        if ($.inArray(itemToAdd.id, added) == -1) {
                            $scope.formValues.applications.push({
                                module: {
                                    id: itemToAdd.id,
                                    name: itemToAdd.name
                                }
                            });
                            elt.tagsinput('add', {
                                value: itemToAdd.id,
                                text: itemToAdd.name
                            });
                        }
                    }
                }
            }
            hideTheChildren();
        });
        if (idx >= 0) {
            var values = $scope.formValues.products[idx].allowedProducts;
        } else {
            var values = $scope.formValues[id];
        }
        if (values) {
            if (id == 'agents') {
                $.each(values, function(index, value) {
                    if (!value.isDeleted || value.isDeleted == false) {
                        if (index > 2) {
                            $(this).hide();
                        }
                        console.log(value);
                        elt.tagsinput('add', {
                            value: value.counterpartyId,
                            text: value.counterpartyName
                        });
                        selectDefaultAgent(id, index);
                    }
                });
            } else {
                $.each(values, function(index, value) {
                    if (index > 2) {
                        $(this).hide();
                    }
                    elt.tagsinput('add', {
                        value: value.id,
                        text: value.name
                    });
                });
                $scope.initMultiTags(id);
            }
        }
        hideTheChildren();

        function hideTheChildren() {
            var currentTags = elt.next('.bootstrap-tagsinput').children('.label');
            currentTags.removeAttr('big-child');
            currentTags.show();
            currentTags.css('clear', 'none');
            currentTags
                .parent('.bootstrap-tagsinput')
                .children('.hideTagsChild')
                .remove();
            $.each(currentTags, function(index, value) {
                if (index > 2) {
                    $(this)
                        .parent('.bootstrap-tagsinput')
                        .addClass('expanded');
                    $(this)
                        .parents('.multi_lookup_tags')
                        .addClass('expanded');
                    if (index % 3 == 0) {
                        $(this).css('clear', 'both');
                    }
                    $(this).attr('big-child', 'true');
                }
            });
            if (currentTags.length > 3 && !elt.next('.bootstrap-tagsinput').children('.hideTagsChild').length) {
                currentTags.parent().prepend('<span class=\'hideTagsChild\'><i class=\'fa fa-ellipsis-h\' aria-hidden=\'true\'></i><span>');
                $(`.hideTagsChild_${ id}`).css('float', 'right');
            } else {
                currentTags.parent('.bootstrap-tagsinput').removeClass('expanded');
                currentTags.parents('.multi_lookup_tags').removeClass('expanded');
            }
        }

        function selectDefaultAgent(id, index, e) {
            $(`.tagsFor${ id } .bootstrap-tagsinput .tag`)
                .last()
                .append(`<input class="defaulttag "  type="checkbox"  name="defaulttag[]" ng-model="formValues.agents[${ index }].isDefault">`);
            $compile($('.defaulttag'))($scope);
            return;
        }
        let childExpanded = false;
        $('body').on('click', '.bootstrap-tagsinput .hideTagsChild', function() {
            if (childExpanded == true) {
                $(this)
                    .parent('.bootstrap-tagsinput')
                    .children('span.tag[big-child=\'true\']')
                    .hide();
                $(this)
                    .parent('.bootstrap-tagsinput')
                    .removeClass('expanded');
                $(this)
                    .parents('.multi_lookup_tags')
                    .removeClass('expanded');
                childExpanded = false;
            } else {
                $(this)
                    .parent('.bootstrap-tagsinput')
                    .children('span.tag[big-child=\'true\']')
                    .show();
                $(this)
                    .parent('.bootstrap-tagsinput')
                    .addClass('expanded');
                $(this)
                    .parents('.multi_lookup_tags')
                    .addClass('expanded');
                childExpanded = true;
            }
        });
    };
    $scope.initMultiTags = function(id) {
        let elt = $(`.object_tagsinput_${ id}`);
        elt.tagsinput({
            itemValue: 'value',
            itemText: 'text'
        });
        elt.tagsinput('removeAll');
        if (vm.screen_id == 'sellerrating') {
            var values = $scope.formValues[id];
            values = [];
            $.each($scope.formValues[id], (index, value) => {
                values.push(value.module);
            });
        } else {
            var values = $scope.formValues[id];
        }
        $.each(values, (index, value) => {
            elt.tagsinput('add', {
                value: value.id,
                text: value.name
            });
        });
        hideTheChildren();

        function hideTheChildren() {
            var currentTags = elt.next('.bootstrap-tagsinput').children('.label');
            currentTags.removeAttr('big-child');
            currentTags.show();
            currentTags.css('clear', 'none');
            currentTags
                .parent('.bootstrap-tagsinput')
                .children('.hideTagsChild')
                .remove();
            $.each(currentTags, function(index, value) {
                if (index > 2) {
                    $(this)
                        .parent('.bootstrap-tagsinput')
                        .addClass('expanded');
                    $(this)
                        .parents('.multi_lookup_tags')
                        .addClass('expanded');
                    if (index % 3 == 0) {
                        $(this).css('clear', 'both');
                    }
                    $(this).attr('big-child', 'true');
                }
            });
            if (currentTags.length > 3 && !elt.next('.bootstrap-tagsinput').children('.hideTagsChild').length) {
                currentTags.parent().prepend('<span class=\'hideTagsChild\'><i class=\'fa fa-ellipsis-h\' aria-hidden=\'true\'></i><span>');
                $(`.hideTagsChild_${ id}`).css('float', 'right');
            } else {
                currentTags.parent('.bootstrap-tagsinput').removeClass('expanded');
                currentTags.parents('.multi_lookup_tags').removeClass('expanded');
            }
            setTimeout(() => {
                $('.bootstrap-tagsinput')
                    .children('span.tag[big-child=\'true\']')
                    .hide();
                $('.bootstrap-tagsinput').removeClass('expanded');
                $('.multi_lookup_tags').removeClass('expanded');
            }, 1);
        }
    };
    $scope.addTagToMulti = function(model, data) {
        vm.plusClickedMultilookup = true;
        var alreadyAdded = false;
        if (!$scope.formValues[model] || typeof $scope.formValues[model] == 'undefined') {
            $scope.formValues[model] = [];
        }
        if (model != '' && typeof $scope.formValues[model] != 'undefined') {
            $.each($scope.formValues[model], (k, v) => {
                if (v.id == data.id) {
                    alreadyAdded = true;
                }
            });
        }
        if (alreadyAdded == true) {
            toastr.error('Field is already added!');
        } else {
            $scope.formValues[model].push(data);
        }
    };

    vm.cloneEntity = function(group, obj) {
        if (obj) {
            let new_obj = angular.copy(obj);
            new_obj.id = 0;
            new_obj.isActive = true;
            $scope.formValues[group].push(new_obj);
        } else {
            let index = Object.keys($scope.formValues[group]).length;
            $scope.formValues[group][index] = new Object();
        }
    };

    if ($state.current.name && $state.current.name != 'default.group-of-requests') {
	        setTimeout(() => {
	            let hideableFields = $('.fe_entity:not([data-dependent=""])');
	            $.each(hideableFields, function() {
	                if ($(this).parents('#accordion1').length < 1) {
	                    $(this).hide();
	                }
	            });
	            let dataDependent = [];
	            $(hideableFields).each(function() {
	                dataDependent.push($(this).attr('data-dependent'));
	            });
	            dataDependent = $.unique(dataDependent);
	            $.each(dataDependent, (key, value) => {
	                if ($(`input[type='radio'][name*=${ value }]`)) {
	                    var selectedRadioVal = $(`input[type='radio'][name*=${ value }]:checked`).val();
	                    var fieldstoShow = $(`.fe_entity[data-dependent="${ value }"][data-show*="${ selectedRadioVal }"]`);
	                    fieldstoShow.show();
	                }
	            });
	        }, 50);
    }

    $scope.checkIfTab = function() {
        $scope.$watch('formFields', () => {
            $timeout(() => {
                var tab = $('.grp_unit')
                    .children('.tab-pane')
                    .first()
                    .addClass('active in');
                // console.log(tab);
                $('#tabs_navigation')
                    .insertBefore(tab)
                    .removeClass('hidden');
                $('#tabs_navigation ul li')
                    .first()
                    .addClass('active');
            }, 10);
        });
    };

    /**
         * Load DLC config using object
         */
    vm.load_dlc_config = function(structure, elements) {
        $scope.formFields = structure;
        $scope.dragElements = elements;
    };

    if ($listsCache.AdditionalCost) {
        $scope.additionalCostsList = $listsCache.AdditionalCost;
    }

    $scope.refreshSelect = function() {};
    $scope.convertValues = function(oldObj, newObj, type, parent) {
        oldObj = eval(oldObj);
        var param = {
            custom: type,
            data: {
                from: oldObj,
                to: newObj
            }
        };
        Factory_Master.exchangeRate(param, (callback) => {
            // callback = '1.5';
            if (callback) {
                let initial_val = $(`#${ parent}`).val();
                let updated_val = initial_val * callback;
                $(`#${ parent}`).val(updated_val);
            }
        });
    };
    $scope.isVisible = function(id) {
        return $(`#${ id}`).is(':visible');
    };
    $scope.fVal = function(id) {
        return $scope;
    };
    $scope.addData = function(obj) {
        obj = eval("$scope." + obj);
        obj.push({
            id: 0
        });
    };
    $scope.remData = function(obj, row, idx) {
        obj = eval("$scope." + obj);
        var index = obj.indexOf(row);
        length = 0;
        $.each(Object.values(obj), (key, val) => {
            if (!val.isDeleted) {
                length++;
            }
        });
        if (vm.screen_id == 'invoice' && vm.app_id == 'invoices') {
            	if ($scope.formValues.status) {
	                if ($scope.formValues.status.name == 'Approved') {
	                	if (obj[idx].id) {
		                    toastr.info('You cannot delete product if invoice status is Approved');
		                    return;
	                	}
	                }
            	}
            if (vm.entity_id) {
                	 $scope.sweetConfirm('Are you sure you want to delete this item?', (response) => {
                	 	if (response == true) {
                        if (row.id > 0) {
							    row.isDeleted = true;
                            $scope.save_master_changes();
                        } else {
							    row.isDeleted = true;
                        }
                	 	}
                	 });
            } else if (row.id > 0 || !row.id) {
	                    row.isDeleted = true;
	                } else {
	                    // row.isDeleted = true;
	                    obj.splice(index, 1);
	                }
            return;
        }

        if (row.id > 0) {
            row.isDeleted = true;
        } else {
            obj.splice(index, 1);
        }
    };
    $scope.showRow = function(row, grid) {
        if (angular.equals(grid.options.data, 'formValues.periods')) {
            return true;
        }
        return !row.isDeleted;
    };
    $scope.setDefaultValue = function(id, val) {
        $timeout(() => {
            $(`#${ id}`)
                .val(val)
                .trigger('change');
        }, 10);
    };
    vm.enableMultiSelect = function(id, fromLabel, toLabel) {
        $timeout(() => {
            $(`#${ id}`).multiSelect({
                selectableHeader: `<div class='custom-header'>${ fromLabel }</div>`,
                selectionHeader: `<div class='custom-header'>${ toLabel }</div>`
            });
            $(`#${ id}`)
                .parents('.multiSelectSwitch')
                .find('.ms-selectable')
                .append('<span class="switches"><span>&gt;&gt;</span><span>&lt;&lt;</span></span>');
        }, 100);
    };

    $scope.mapLocation = function(name, id) {
        var val = $(`[name= "${ name }"]`).val();
        Factory_Master.get_master_entity(val, 'location', 'masters', (response) => {
            if (response) {
                var newSysInst = [];
                var i = 0;
                $.each($scope.formValues.productsSystemInstruments, (key, kval) => {
                    if (!kval.canBeDeleted && kval.id > 0 || typeof kval.canBeDeleted === 'undefined' && kval.id == 0) {
                        newSysInst[key] = kval;
                        i++;
                    }
                });
                $.each(response.productsSystemInstruments, (key, kval1) => {
                    if (kval1.id) {
                        kval1.id = 0;
                        $scope.formValues.productsSystemInstruments.push(kval1);
                        // newSysInst[i] = kval1;
                    }
                });
                // $scope.formValues.productsSystemInstruments = [];
                // $scope.formValues.productsSystemInstruments = newSysInst;
            }
        });
    };

    $scope.$watch('formValues', (data) => {
        $rootScope.formValues = data;
    });

    $scope.selectedModalValue = function(element) {
        // if (!element)return
        if (!element) {
            if ($rootScope.modalParams) {
                element = $rootScope.modalParams;
            } else {
                return;
            }
        }
        // console.log($rootScope)
        var id = element.clc;
        var object = element.source;
        var formvalue = element.formvalue;
        var idx = element.idx;
        var field_name = element.field_name;
        let CLC = $(`#modal_${ id } table.ui-jqgrid-btable`);
        let rowId = CLC.jqGrid('getGridParam', 'selrow');
        let rowData = CLC.jqGrid.Ascensys.gridObject.rows[rowId - 1];

        $scope.selected_value = {};
        let transaction_type = '';
        let transactionstobeinvoiced_dtRow = '';
        let toastr_msg = '';
        if (element.screen == 'contactlist') {
            $scope.selected_value = rowData;
        } else if (element.screen == 'transactionstobeinvoiced') {
            $scope.addTransactionsInInvoice(element);
            return false;
        } else if (element.screen == 'orders') {
            $scope.selected_value = {
                id: rowData.order.id,
                name: rowData.order.name
            };
        } else if (element.screen == 'formulalist' && vm.app_id == 'contracts') {
            $scope.selected_value = {
                id: rowData.id,
                name: rowData.name,
                isContractReference: rowData.isContractReference
            };
        } else if (element.screen == 'bunkerableport' && vm.app_id == 'default') {
            $scope.selected_value = angular.copy(rowData);
            // id from row data is order in table, actual locationId is in rowData.locationId
            if (!angular.equals($scope.selected_value, {})) {
                $scope.selected_value.id = $scope.selected_value.locationId;
            }
        } else if (element.screen == 'destinationport' && vm.app_id == 'default') {
            $scope.selected_value = angular.copy(rowData);
            if (!angular.equals($scope.selected_value, {})) {
                $scope.selected_value.id = $scope.selected_value.destinationId;
            }
        } else if (element.screen == 'rfqrequestslist' && vm.app_id == 'default') {
            $scope.selected_value = angular.copy(rowData);
            if (!angular.equals($scope.selected_value, {})) {
                $scope.selected_value.id = $scope.selected_value.requestId;
            }
        } else if (element.screen == 'productcontractlist' && vm.app_id == 'default') {
            $scope.selected_value = angular.copy(rowData);
            if (!angular.equals($scope.selected_value, {})) {
                $scope.selected_value.id = $scope.selected_value.contractProductId;
            }
        } else if (element.screen == 'requestcounterpartytypes' && vm.app_id == 'default') {
            $scope.selected_value = angular.copy(rowData);
        } else if(element.screen == 'contractlist' && vm.app_id == 'default') {
            $scope.selected_value = angular.copy(rowData);
        }else {
            $.each(rowData, (key, val) => {
                if (key == 'id' || key == 'name' || key == 'code' || key == 'displayName') {
                    $scope.selected_value[key] = val;
                }
            });
        }
        if (angular.equals($scope.selected_value, {})) {
            toastr.error('Please select one row');
            return;
        }
        if (transaction_type == 'delivery') {
            element.source = 'formValues.productDetails';
            toastr_msg = 'Delivery added';
        }
        if (transaction_type == 'cost') {
            element.source = 'formValues.costDetails';
            toastr_msg = 'Cost added';
        }
        // Check if modal triggered from datatable
        if (!formvalue) {
            if (vm.app_id == 'invoices' && element.name != 'Physical Supplier') {
                check = eval("$scope." + element.source);
                if (Array.isArray(check)) {
                    $scope.target_element = `${element.source }.${ check.length}`;
                    element.source = `${element.source }.${ check.length}`;
                } else {
                    $scope.target_element = element.source;
                }
            } else {
                $scope.target_element = element.source;
            }
            var elements = element.source.split('.');
        } else {
            $scope.target_element = element.source;
            var elements = formvalue.split('.');
            elements.push(idx);
            if (object.indexOf('[') > -1) {
                object = object.replace('[', '.');
                object = object.replace(']', '');
                object = object.split('.');
                $.each(object, (key, val) => {
                    elements.push(val);
                });
            } else {
                elements.push(object);
            }
        }
        if (!formvalue) {
            $scope.assignObjValue($scope, elements, $scope.selected_value);
            if (element.screen == 'rfqrequestslist') {
                	$scope.selected_value = [];
                	var rowsData = CLC.jqGrid('getGridParam', 'selarrrow');
                	$.each(rowsData, (k, v) => {
	                	$scope.selected_value.push(CLC.jqGrid.Ascensys.gridObject.rows[v - 1]);
                	});
            }
            $rootScope.$broadcast('dataListModal', { val: $scope.selected_value, elem: elements });
        } else if ($scope.grid) {
	                $scope.assignObjValue($scope.grid.appScope.fVal(), elements, $scope.selected_value);
            	} else {
	                $scope.assignObjValue($scope, elements, $scope.selected_value);
            	}
        if (transaction_type == 'delivery' || transaction_type == 'cost') {
            toastr.success(toastr_msg);
        }
        $scope.prettyCloseModal();
        $('*').tooltip('destroy');
        $scope.triggerChangeFields(field_name, elements[1]);
    };

    $scope.assignObjValue = function(obj, keyPath, value) {
        var lastKeyIndex = keyPath.length - 1;
        for (let i = 0; i < lastKeyIndex; ++i) {
            var key = keyPath[i];
            var next_key = keyPath[i + 1];
            if (typeof next_key === 'number') {
                if (!(key in obj)) {
                    obj[key] = [];
                }
            } else if (!(key in obj)) {
                obj[key] = {};
            }
            if (obj[key] == null) {
                obj[key] = {};
            }
            obj = obj[key];
        }
        obj[keyPath[lastKeyIndex]] = value;
    };

    // Check default options from layout
    $scope.checkDefaults = function(options, name, id) {
        $scope.formValues[id] = [];
        $.each(options, (key, val) => {
            $scope.formValues[id].push($scope.options[name][val]);
        });
    };

    $scope.goToFormula = function() {
        window.open('#/masters/formula/edit/', '_blank');
    };

    $scope.stringToObject = function(string, obj) {
        $scope[obj] = JSON.parse(string);
    };

    $scope.closeBlade = function() {
        	if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !$rootScope.overrideCloseNavigation) {
	        	$('.confirmBladeClose').removeClass('hide');
	        	$('.confirmBladeClose').modal();
        	} else {
        		$scope.confirmCloseBlade();
        	}
    };
    $scope.confirmCloseBlade = function() {
        $('.bladeEntity').removeClass('open');
        $('body').css('overflow-y', 'auto');
        setTimeout(() => {
            $rootScope.bladeTemplateUrl = '';
            if($rootScope.refreshPending) {
                	$state.reload();
                // window.location.reload();
            }
            $rootScope.$broadcast('counterpartyBladeClosed', true);
            $rootScope.overrideCloseNavigation = false;
        }, 500);
    };
    $scope.getToday = function() {
        return new Date();
    };

    vm.trustAsHtml = function(data) {
        return $sce.trustAsHtml(data);
    };

    vm.trustAsHtmlField = function(data) {
        if (data && _.has($scope, `formValues.${ data.Unique_ID}`)) {
            	if (_.get($scope, `formValues.${ data.Unique_ID}`)) {
	                return $sce.trustAsHtml(_.get($scope, `formValues.${ data.Unique_ID}`).replace(/\n/g, '<br/>'));
            	}
        }
    };

    vm.getAdditionalCostsComponentTypes = function(callback) {
        if (!$scope.additionalCostsComponentTypes) {
		    	if (!$rootScope.called_getAdditionalCosts) {
		    		$rootScope.called_getAdditionalCosts = 1;
	                Factory_Master.getAdditionalCosts(0, (response) => {
			    		$rootScope.called_getAdditionalCosts = false;
	                    $rootScope.additionalCostsComponentTypes = response.data.payload;
	                    console.log(response);
                    $scope.additionalCostsComponentTypes = response.data.payload;
                    if (callback) {
		                    callback($scope.additionalCostsComponentTypes);
                    }
	                });
		    	}
        } else if (callback) {
            callback($scope.additionalCostsComponentTypes);
        }
    };

    $scope.filterCostTypesByAdditionalCostInvoice = function(rowRenderIndex) {
        if (typeof vm.filteredCostTypesByAdditionalCost == 'undefined') {
	            vm.filteredCostTypesByAdditionalCost = [];
        }
        if (!$scope.grid.appScope.fVal().formValues.costDetails[rowRenderIndex]) {
            return;
        };
        var cost = $scope.grid.appScope.fVal().formValues.costDetails[rowRenderIndex].costName.id;
        let costType = null;
        var currentCost = cost;
        if (!$rootScope.additionalCostsComponentTypes) {
            return;
        }
        $.each($rootScope.additionalCostsComponentTypes, (k, v) => {
            if (v.id == currentCost) {
                costType = v.costType.id;
            }
        });

        var availableCosts = [];
        $.each(vm.listsCache.CostType, (ack, acv) => {
            if (acv) {
                if (costType == 1 || costType == 2) {
                    if (acv.id == 1 || acv.id == 2) {
                        availableCosts.push(acv);
                    }
                }
                if (costType == 3) {
                    if (acv.id == 3) {
                        availableCosts.push(acv);
                    }
                }
            }
        });


        return availableCosts;
    };

    $scope.filterCostTypesByAdditionalCost = function(cost, rowRenderIndex) {
        let doFiltering = function(addCostCompTypes) {
            var costType = null;
            $.each(addCostCompTypes, (k, v) => {
                if (v.id == cost) {
                    costType = v.costType.id;
                }
            });
            var availableCosts = [];
            if (costType == 1 || costType == 2) {
                $.each(vm.listsCache.CostType, (k, v) => {
                    if (v.id == 1 || v.id == 2) {
                        availableCosts.push(v);
                    }
                });
            }
            if (costType == 3) {
                $.each(vm.listsCache.CostType, (k, v) => {
                    if (v.id == 3) {
                        availableCosts.push(v);
                    }
                });
            }
            return availableCosts;
        };

        if($scope.additionalCostsComponentTypes === undefined) {
            vm.getAdditionalCostsComponentTypes((additionalCostsComponentTypes) => {
                return doFiltering(additionalCostsComponentTypes);
            });
        }else{
            return doFiltering($scope.additionalCostsComponentTypes);
        }
    };

    $scope.showMultiLookupWarning = function(model) {
        setTimeout(() => {
            if (model) {
                if (model.id && !vm.plusClickedMultilookup) {
                    toastr.warning('Please click on ‘+’ button to add');
                }
            }
            vm.plusClickedMultilookup = false;
        }, 300);
    };

    jQuery(document).ready(() => {
        $.each($('.bootstrap-tagsinput .tag'), function(k, v) {
            $(this).attr('tooltip', '');
            $(this).attr('data-original-title', $(v).text());
            $(v)
                .tooltip('show')
                .tooltip('hide');
        });
    });

    $scope.getEditInstance = function() {
        return vm.editInstance;
    };

    $scope.sweetConfirm = function(message, callback) {
        	if (!message) {
            return false;
        }
        	// confirm = confirm(message);
    		var sweetConfirmResponse = {};
        	$('.sweetConfirmModal').modal();
        	$('.sweetConfirmModal').removeClass('hide fade');
        	$('.sweetConfirmModal').css('transform', 'translateY(100px)');
        	$('.sweetConfirmModal .modal-body').text(message);

        	$('.sweetConfirmModal .sweetConfirmModalYes').on('click', () => {
        		callback(true);
            $('.sweetConfirmModal .sweetConfirmModalYes').off('click');
        	});
        	$('.sweetConfirmModal .sweetConfirmModalNo').on('click', () => {
        		callback(false);
            $('.sweetConfirmModal .sweetConfirmModalNo').off('click');
        	});
    };

    vm.useDisplayName = function(fieldName) {
        let displayNameList = [ 'invoiceStatus', 'customStatus', 'ClaimType' ];
        let found = _.indexOf(displayNameList, fieldName);
        if(found < 0) {
            return false;
        }
        return true;
    };


    $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
		  let target = $(e.target).attr('href'); // activated tab
		  setTimeout(() => {
		  	$scope.$apply();
		  });
    });


	    $rootScope.$on('setInvoiceApplicableFor', (e, data) => {
	    	$scope.dtMasterSource.applyFor = data;
	    	vm.invoiceApplicableForProducts = data;
    });


    /** *****************************************************************************/
    /** *****************************************************************************/

    vm.invoiceCatalog = function() {
        vm.invoiceTree = [ {
            id: 1,
            title: 'Deliveries List',
            slug: 'deliveries',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, {
            id: 2,
            title: 'Claims List',
            slug: 'claims',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, {
            id: 3,
            title: 'Invoices List',
            slug: 'invoice',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, {
            id: 4,
            title: 'Complete View',
            slug: 'complete_view',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, /* {
            id: 5,
            title: 'Filters',
            slug: 'filters',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        },*/ {
            id: 6,
            title: 'Treasury Report',
            slug: 'treasuryreport',
            icon: 'fa fa-folder icon-lg',
            nodes: 1
        }, ];
    };


    vm.selectInvoiceScreen = function(id, name) {
        $location.path(`/invoices/${ id}`);
        $scope.invoice_screen_name = name;
    };


    vm.getColorCodeFromLabels = function(statusObj) {
        return statusColors.getColorCodeFromLabels(statusObj, vm.listsCache.ScheduleDashboardLabelConfiguration);
    };

    $scope.initInvoiceScreen = function() {
        vm.getAdditionalCostsComponentTypes();
        if(!$scope.formValues.paymentDate) {
            $scope.formvalues.paymentDate = $scope.formValues.workingDueDate;
        }
        if ($scope.formValues.relatedInvoices) {
        	$.each($scope.formValues.relatedInvoices, (k, v) => {
        		v.invoiceStatus.colorCode = statusColors.getColorCodeFromLabels(
                    v.invoiceStatus,
                    $scope.listsCache.ScheduleDashboardLabelConfiguration);
        	});
        }
        if (typeof $scope.formValues.status != 'undefined') {
            if ($scope.formValues.status.name) {
                // $state.params.title = "DEL - " + delID + " - " + $scope.formValues.order.name + ' - ' + $scope.formValues.temp.deliverysummary.vesselName;
                // $state.params.title = 'CTRL' + $scope.formValues.name;
                if (!$state.params.status) {
                    $state.params.status = {};
                }
                // $state.params.status.name = $scope.formValues.status.name;
                $state.params.status.name = $scope.formValues.status.displayName;
                $state.params.status.bg = statusColors.getColorCodeFromLabels(
                    $scope.formValues.status,
                    $scope.listsCache.ScheduleDashboardLabelConfiguration);
                $state.params.status.color = 'white';
            }

            /* Disable some fields if invoice STATUS is Approved*/
            if ($scope.formValues.status.name == 'Approved') {
            	console.log($scope.formFields);
            	$.each($scope.formFields.OrderDetails.children, (k, v) => {
            		if (v.required == true || v.Required == true) {
                        v.disabled = true; v.Disabled = true;
                    }
            	});
            	$.each($scope.formFields.CounterpartyDetails.children, (k, v) => {
            		if (v.required == true || v.Required == true) {
                        v.disabled = true; v.Disabled = true;
                    }
            	});
            	$.each($scope.formFields.invoiceDetails.children, (k, v) => {
            		if (v.required == true || v.Required == true) {
                        v.disabled = true; v.Disabled = true;
                    }
            	});
            }
        } else {
            $state.params.status = null;
        }
        if ($scope.formValues.costDetails) {
            $.each($scope.formValues.costDetails, (k, v) => {
                if (v.product.id != -1) {
                	if (v.product.id != v.deliveryProductId) {
	                	v.product.productId = angular.copy(v.product.id);
	                	v.product.id = angular.copy(v.deliveryProductId);
                	}
                }
            });
        }
        $scope.manualPaymentDateReference = angular.copy($scope.formValues.paymentDate);
        $scope.initialHasManualPaymentDate = angular.copy($scope.formValues.hasManualPaymentDate);
    };

    $scope.dtMasterSource = {};
    $scope.$watch('formValues', (val) => {
    	if (!val) {
            return false;
        }
        vm.initialDueDate = angular.copy($scope.formValues.dueDate);
    	if ($scope.formValues.manualDueDate) {
    		if (vm.initialDueDate != $scope.formValues.manualDueDate) {
	    		$scope.formValues.dueDate = $scope.formValues.manualDueDate;
    		}
    	}

        $scope.manualPaymentDateReference = angular.copy($scope.formValues.paymentDate);
        $scope.initialHasManualPaymentDate = angular.copy($scope.formValues.hasManualPaymentDate);
    });

    vm.formatDate = function(elem, dateFormat) {
        if (elem) {
            var formattedDate = elem;
            dateFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;
	    	var hasDayOfWeek = false;
            if (dateFormat.startsWith('DDD ')) {
            	hasDayOfWeek = true;
            	dateFormat = dateFormat.split('DDD ')[1].split(' ')[0];
            } else {
            	dateFormat = dateFormat.split(' ')[0];
            }
            let date = Date.parse(elem);
            date = new Date(date);
            if (date) {
                let utc = date.getTime() + date.getTimezoneOffset() * 60000;
                // var utc = date.getTime();
                if (dateFormat.name) {
                    dateFormat = dateFormat.name.replace(/d/g, 'D').replace(/y/g, 'Y');
                } else {
                    dateFormat = dateFormat.replace(/d/g, 'D').replace(/y/g, 'Y');
                }
                formattedDate = fecha.format(utc, dateFormat);
            }
            if (hasDayOfWeek) {
            	formattedDate = `${moment(elem).format('ddd') } ${ formattedDate}`;
            }
            return formattedDate;
        }
    };
    vm.formatDateTime = function(elem, dateFormat, fieldUniqueId) {
        // console.log(fieldUniqueId)
        if (elem) {
            var formattedDate, hasDayOfWeek;
            dateFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;
            if (dateFormat.startsWith('DDD ')) {
            	hasDayOfWeek = true;
            	dateFormat = dateFormat.split('DDD ')[1];
            }
            dateFormat = dateFormat.replace(/D/g, 'd').replace(/Y/g, 'y');
            if (typeof fieldUniqueId == 'undefined') {
                fieldUniqueId = 'date';
            }
            if (fieldUniqueId == 'deliveryDate' && vm.app_id == 'recon') {
                return vm.formatDate(elem, 'dd/MM/yyyy');
            }
            if (fieldUniqueId == 'invoiceDate' && vm.app_id == 'invoices') {
                return vm.formatDate(elem, 'dd/MM/yyyy');
            }
            if (fieldUniqueId == 'eta' || fieldUniqueId == 'orderDetails.eta' || fieldUniqueId == 'etb' || fieldUniqueId == 'etd' || fieldUniqueId.toLowerCase().indexOf('delivery') >= 0 || fieldUniqueId == 'pricingDate') {
                // debugger;
                // return moment.utc(elem).format($scope.tenantSetting.tenantFormatss.dateFormat.name);
                let utcDate = moment.utc(elem).format();
                formattedDate = $filter('date')(utcDate, dateFormat, 'UTC');
                // return moment.utc(elem).format(dateFormat);
            } else {
                formattedDate = $filter('date')(elem, dateFormat);
            }
            if (hasDayOfWeek) {
            	formattedDate = `${moment.utc(elem).format('ddd') } ${ formattedDate}`;
            }
            return formattedDate;
        }
    };

    $scope.$watch('formValues.orderDetails.order.id', (val) => {
        if (!val || val == vm.last_order_id_get_apply_for_list) {
            return false;
        }
        vm.last_order_id_get_apply_for_list = val;
        // $timeout(function() {
        $scope.dtMasterSource.applyFor = [];
        if (typeof $scope.formValues.orderDetails != 'undefined') {
            let order_id = $scope.formValues.orderDetails.order.id;

            if (window.location.href.indexOf('invoices/claims') == -1) {
                Factory_Master.get_apply_for_list(order_id, (callback) => {
                    if (callback.status == true) {
                        callback.data.forEach((val, key) => {
                        	var itemName;
                            	if (val.name != 'All') {
	                                itemName = `${key } - ${ val.name}`;
                            	} else {
	                                itemName = val.name;
                            	}

                            let element = {
                                code: val.code,
                                id: val.id,
                                name: itemName,
                                productId: val.productId,
                                deliveryProductId: val.deliveryProductId,
                                finalQuantityAmountUomId: val.finalQuantityAmountUomId,
                                finalQuantityAmount: val.finalQuantityAmount
                            };
                            $scope.dtMasterSource.applyFor.push(element);
                        });
                        for (let i = $scope.formValues.costDetails.length - 1; i >= 0; i--) {
                            	$scope.invoiceConvertUom('cost', i, $scope.formValues);
                        }
                    }
                    if (!$rootScope.reloadPage) {
                        $.each($scope.dtMasterSource.applyFor, (key, val) => {
                            var product = _.find($scope.formValues.productDetails, function(object) {
                                return object.product.id == val.productId;
                            });
                            if (product) {
                                $scope.getUomConversionFactor(val.productId, val.finalQuantityAmount, val.finalQuantityAmountUomId, $tenantSettings.tenantFormats.uom.id, product.contractProductId,  product.orderProductId, (response) => {
                                     val.convertedFinalQuantityAmount = response;
                                });
                            } else {
                                $scope.getUomConversionFactor(val.productId, val.finalQuantityAmount, val.finalQuantityAmountUomId, $tenantSettings.tenantFormats.uom.id, (response) => {
                                     val.convertedFinalQuantityAmount = response;
                                });
                            }

                        });
                    }
                });
            }
        }

        // });
    });
    // if ($scope.formValues) {
	   //  $scope.initInvoiceScreen();
    // }
    $scope.triggerChangeFields = function(name, id) {
	    $scope.triggerChangeFieldsAppSpecific(name, id);
    };
    $scope.triggerChangeFieldsAppSpecific = function(name, id) {
        var dueDate = $scope.formValues.dueDate;
        let array = [ 'DueDate', 'PaymentDate', 'costType', 'InvoiceRateCurrency', 'invoiceSummaryDeductions', 'documentNo', 'PaymentTerm', 'DeliveryDate' ];
        if (array.indexOf(name) != -1) {
            $scope.computeInvoiceTotalConversion(vm.conversionRoe, vm.conversionTo);
            if (name == 'DueDate') {
                	if (vm.initialDueDate) {
        	    		if (vm.initialDueDate.split('T')[0] != $scope.formValues.dueDate) {
        		        	$scope.formValues.manualDueDate = $scope.formValues.dueDate;
        	    		} else {
        	    			$scope.formValues.manualDueDate = null;
        	    		}
                	} else {
        	        	$scope.formValues.manualDueDate = $scope.formValues.dueDate;
                	}
                if (parseFloat(dueDate.split('-')[0]) < 1753) {
                    	return;
        	        }
                Factory_Master.get_working_due_date(dueDate, (response) => {
                    $scope.formValues.workingDueDate = response.data;
                    if (!$scope.initialHasManualPaymentDate) {
        		        	$scope.formValues.hasManualPaymentDate = false;
        	                $scope.formValues.paymentDate = response.data;
        	            	$scope.manualPaymentDateReference = angular.copy($scope.formValues.paymentDate);
                    }
                });
            }
            if (name == 'PaymentDate') {
                if (!$scope.initialHasManualPaymentDate) {
        	        	$scope.formValues.hasManualPaymentDate = false;
        	        	if ($scope.manualPaymentDateReference) {
        	            	if ($scope.manualPaymentDateReference.split('T')[0] != $scope.formValues.paymentDate.split('T')[0]) {
        			        	$scope.formValues.hasManualPaymentDate = true;
        	            	}
        	        	}
                }
            }
            if (name == 'costType') {
                	if ($scope.formValues.costDetails.length > 0) {
                		if ($scope.formValues.costDetails[id]) {
	        	            if ($scope.formValues.costDetails[id].costType.name == 'Flat') {
	        	                $scope.formValues.costDetails[id].invoiceQuantity = 1;
	        	            } else {
	        	                $scope.formValues.costDetails[id].invoiceQuantity = '';
	        	            }
                		}
                	}
            }
            if (name == 'InvoiceRateCurrency') {
                $.each($scope.formValues.productDetails, (key, value) => {
                    value.invoiceRateCurrency = $scope.formValues.invoiceRateCurrency;
                });
                $.each($scope.formValues.costDetails, (key, value) => {
                    value.invoiceRateCurrency = $scope.formValues.invoiceRateCurrency;
                });
                if (window.location.href.indexOf('invoices/claims')) {
                    console.log(window.location.href);
                    $.each($scope.formValues.invoiceClaimDetails, (key, value) => {
                        let exchangeDate = $scope.formValues.createdAt;
                        if ($scope.formValues.createdAt == '0001-01-01T00:00:00') {
                            exchangeDate = null;
                        }
                        if (value.invoiceAmountCurrency.id != $scope.formValues.invoiceRateCurrency.id) {
                            // $scope.convertCurrency(value.baseInvoiceAmountCurrency.id, $scope.formValues.invoiceRateCurrency.id, exchangeDate, value.invoiceAmount, function(response) {
                            //     if (response != 0) {
        	                       //      value.invoiceAmount = response;
                            //     }
                            // });
                            value.invoiceAmountCurrency = $scope.formValues.invoiceRateCurrency;
                        }
                    });
                }

                // this is triggered after formValues are received
                $scope.recalcultateAdditionalCost();
            }
            if (name == 'invoiceSummaryDeductions') {
                $scope.invoiceConvertUom(null, null, $scope.formValues);
            }
            if (name == 'documentNo') {
                if (!isNaN(parseInt($scope.formValues.documentNo))) {
                    $scope.formValues.documentNo = parseInt($scope.formValues.documentNo);
                } else {
                    $scope.formValues.documentNo = null;
                }

            }

            if (name == 'PaymentTerm' || name == 'DeliveryDate') {
                	if (!$scope.formValues.id) {
                		return;
                	}
                	var payload = { Payload:{
        	        		InvoiceId:$scope.formValues.id,
        	        		PaymentTermId:$scope.formValues.counterpartyDetails.paymentTerm.id,
        	        		InvoiceDeliveryDate:$scope.formValues.deliveryDate,
        	        		ManualDueDate:$scope.formValues.manualDueDate
                		}
                	};
        	        Factory_Master.dueDateWithoutSave(payload, (callback) => {
        	        	if (callback.status == true) {
        					// if (!callback.data.manualDueDate) { return }
        					if (!callback.data.dueDate) {
                            return;
                        }
        					if (!callback.data.paymentDate) {
                            return;
                        }
        					if (!callback.data.workingDueDate) {
                            return;
                        }
        					// $scope.formValues.manualDueDate = callback.data.manualDueDate;
        					$scope.formValues.dueDate = callback.data.dueDate;
        					if (!$scope.initialHasManualPaymentDate) {
        						$scope.formValues.paymentDate = callback.data.paymentDate;
        						$scope.manualPaymentDateReference = angular.copy($scope.formValues.paymentDate);
        					}
        					$scope.formValues.workingDueDate = callback.data.workingDueDate;

                        /*
        					$('.date-picker [name="Workingduedate"]').parent().datetimepicker('setDate', new Date( callback.data.workingDueDate ) )
        					$('.date-picker [name="DueDate"]').parent().datetimepicker('setDate', new Date( callback.data.dueDate ) )
        					$('.date-picker [name="PaymentDate"]').parent().datetimepicker('setDate', new Date( callback.data.paymentDate ) )
                            */
        	        	}
        		    	// api/invoice/dueDateWithoutSave
        	        });
            }
        }
    };

    $scope.convertCurrency = function(fromCurrencyId, toCurrencyId, exchangeDate, amount, convertCallback) {
	    let d = new Date();
	    var month = d.getMonth() + 1;
	    var day = d.getDate();
	    var hours = d.getHours();
	    var minutes = d.getMinutes();
	    var seconds = d.getSeconds();
	    if (month < 10) {
	        month = `0${ month}`;
	    }
	    if (day < 10) {
	        day = `0${ day}`;
	    }
	    if (hours < 10) {
	        hours = `0${ hours}`;
	    }
	    if (minutes < 10) {
	        minutes = `0${ minutes}`;
	    }
	    if (seconds < 10) {
	        seconds = `0${ seconds}`;
	    }
	    var date = `${d.getFullYear() }-${ month }-${ day }T${ hours }:${ minutes }:${ seconds}`;
	    if (!exchangeDate) {
	        exchangeDate = date;
	    }
	    var data = {
	        Payload: {
	            Order: null,
	            Filters: [
	                {
	                    ColumnName: 'FromCurrencyId',
	                    Value: fromCurrencyId
	                },
	                {
	                    ColumnName: 'ToCurrencyId',
	                    Value: toCurrencyId
	                },
	                {
	                    ColumnName: 'ExchangeDate',
	                    Value: exchangeDate
	                },
	                {
	                    ColumnName: 'Amount',
	                    Value: amount
	                }
	            ],
	            Pagination: {
	                Skip: 0,
	                Take: 10
	            }
	        }
	    };
	    Factory_Master.convertCurrency(data, (callback) => {
	        if (callback) {
	            if (convertCallback) {
	                convertCallback(callback.data);
	            }
	        }
	    });
    };
    // Cancel Invoice
    $scope.cancel_invoice = function() {
        Factory_Master.cancel_invoice(vm.entity_id, (callback) => {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    };
    // Submit Invoice for Review
    $scope.submit_invoice_review = function() {
        screenLoader.showLoader();
        Factory_Master.submit_invoice_review(vm.entity_id, (callback) => {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                screenLoader.hideLoader();
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    };
    // Accept Invoice
    $scope.accept_invoice = function() {
        vm.fields = angular.toJson($scope.formValues);
        Factory_Master.accept_invoice(vm.entity_id, (callback) => {
            $scope.loaded = true;
            if (callback.status == true) {
                toastr.success(callback.message);
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    };
    // Submit Invoice for Approve
    $scope.submit_invoice_approve = function() {
        vm.fields = angular.toJson($scope.formValues);
        screenLoader.showLoader();
        Factory_Master.submit_invoice_approve(vm.entity_id, (callback) => {
            screenLoader.showLoader();
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
                screenLoader.hideLoader();
            } else {
                toastr.error(callback.message);
            }
        });
    };
    // Approve Invoice
    $scope.approve_invoice = function() {
        vm.fields = angular.toJson($scope.formValues);
        screenLoader.showLoader();
        Factory_Master.approve_invoice(vm.entity_id, (callback) => {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
                screenLoader.hideLoader();
            } else {
                toastr.error(callback.message);
            }
        });
    };
    // Revert Invoice
    $scope.revert_invoice = function() {
        vm.fields = angular.toJson($scope.formValues);
        Factory_Master.revert_invoice(vm.entity_id, (callback) => {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    };
    // Reject Invoice
    $scope.reject_invoice = function() {
        vm.fields = angular.toJson($scope.formValues);
        Factory_Master.reject_invoice(vm.entity_id, (callback) => {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
            } else {
                toastr.error(callback.message);
            }
        });
    };
    $scope.addCostDetail = function(data) {
        // console.log(vm.getAdditionalCostsComponentTypes());
        $rootScope.addNewCost = true;
        $rootScope.reloadPage = false;
        vm.getAdditionalCostsComponentTypes((additionalCostsComponentTypes) => {
            $scope.additionalCostsComponentTypes = additionalCostsComponentTypes;
            var isTaxComponent = false;
            $.each(additionalCostsComponentTypes, (k, v) => {
                if (v.id == data) {
                    if (v.componentType) {
                        if (v.componentType.id == COMPONENT_TYPE_IDS.TAX_COMPONENT) {
                            isTaxComponent = true;
                        }
                    }
                    // flat costs (costType.id == 1) should allow choosing applicable product
                    // else if (v.costType) {
                    //    if (v.costType.id == 1) {
                    //        isTaxComponent = true;
                    //    }
                    // }
                }
            });
            if (typeof data != 'undefined' && data != '') {
                let selected = {};
                $scope.additionalCostsList.forEach((item, key) => {
                    if (item.id == data) {
                        selected = item;
                    }
                });
                $scope.formValues.costDetails.push({
                    costName: {
                        id: selected.id,
                        name: selected.name,
                        code: selected.code,
                        collectionName: null,
                    },
                    invoiceQuantity: null,
                    invoiceQuantityUom: $tenantSettings.tenantFormats.uom,
                    invoiceRate: null,
                    invoiceRateCurrency: $scope.formValues.invoiceRateCurrency,
                    product: {
                        id: -1,
                        name: 'All',
                        deliveryProductId: null
                    },
                    isTaxComponent: isTaxComponent
                });
                $scope.recalcultateAdditionalCost();
            } else {
                toastr.error('Please select a Cost');
            }
        });
        // debugger
    };
    vm.getOptions = function(field) {
        // Move this somewhere nice and warm
        var objectByString = function(obj, string) {
            if (string.includes('.')) {
                return objectByString(obj[string.split('.', 1)], string.replace(`${string.split('.', 1) }.`, ''));
            }
            return obj[string];
        };
        if (field) {
            setTimeout(() => {
                if (field.Filter && typeof $scope.formValues != 'undefined') {
                    field.Filter.forEach((entry) => {
                        if (entry.ValueFrom == null) {
                            return;
                        }
                        let temp = 0;
                        try {
                            temp = eval("$scope.formValues." + entry.ValueFrom);
                        } catch (error) {}
                        entry.Value = temp;
                    });
                }
                if (!$scope.options) {
                    $scope.options = [];
                }
                Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, (callback) => {
                    if (callback) {
                        $scope.options[field.Name] = callback;
                        $scope.$watchGroup([ $scope.formValues, $scope.options ], () => {
                            $timeout(() => {
                                var id;
                                if (field.Type == 'textUOM') {
                                    id = `#${ field.Name}`;
                                } else {
                                    id = `#${ field.masterSource }${field.Name}`;
                                }
                                if ($(id).data('val')) {
                                    $(id).val($(id).data('val'));
                                }
                            }, 50);
                        });
                    }
                });
            }, 1000);
        }
    };

    /* INVOICES FROM DELIVERIES*/
    $scope.initInvoiceTypeOptions = function() {
        vm.getOptions({
            Name: 'DocumentTypeEnum',
            Type: 'dropdown',
            masterSource: 'DocumentTypeEnum'
        });
        $('#newInvoiceType').find('option').remove();
        if (!$scope.options) {
            $scope.options = [];
        }
        // vm.listsCache['DocumentTypeEnum'];
        $($('[name=\'newInvoiceType\']').parent().parent()[1]).hide();
        $('#newInvoiceType').append($('<option>', {
            value: '',
            text: ''
        }));
        $.each(vm.listsCache.DocumentTypeEnum, (k, v) => {
            if(v.internalName != 'PreclaimCreditNote' && v.internalName != 'PreclaimDebitNote') {
                $('#newInvoiceType').append($('<option>', {
                    // value: v.name,
                    value: v.internalName,
                    internalName: `${v.internalName }`,
                    text: `${v.name }`
                }));
            }
        });
    };
    $scope.createInvoiceFromDelivery = function() {
        let productIds = $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.selectedProductIds;
        let orderAdditionalCostId = $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.selectedOrderAdditionalCostId;
        let invoiceType = $('#newInvoiceType').val();
        if (!invoiceType) {
            toastr.error('Please select invoice type');
            return;
        }
        if (!orderAdditionalCostId) {
            toastr.error('Please select at least one row');
            return;
        }
        if (productIds.length == 0 && orderAdditionalCostId.length == 0) {
            toastr.error('Please select at least one row');
            return;
        }
        let data = {
            DeliveryProductIds: productIds,
            OrderAdditionalCostIds: orderAdditionalCostId,
            InvoiceTypeName: invoiceType,
        };
        localStorage.setItem('invoiceFromDelivery', angular.toJson(data));
        // window.open(`/#/${ vm.app_id }/` + 'invoice' + '/edit/', '_blank');
        window.open(`/v2/${ vm.app_id }/` + 'edit/0', "_blank");
    };

    /* INVOICES FROM DELIVERIES*/
    /* INVOICES - CLAIMS*/
    $scope.createCreditNote = function() {
        let selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
        if (selectedRowData) {
            let claimSettlementType = selectedRowData.settlementType.name;
            let actualSettlementAmount = selectedRowData.actualSettlementAmount;
            let claimType = selectedRowData.claimType.name;
            let claimId = selectedRowData.id;
            if (selectedRowData.claimsPossibleActions.canCreateCreditNote) {
                let data = {
                    ClaimId: claimId
                };
                localStorage.setItem('createCreditNoteFromInvoiceClaims', JSON.stringify(data));
                // window.open(`/#/${ vm.app_id }/` + 'claims' + '/edit/', '_blank');
                window.open(`/v2/${ vm.app_id }/` + 'edit/0', "_blank");

                /*
                Factory_Master.create_credit_note(data, function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $rootScope.transportData = response.data;
                            $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                })
                */
            } else {
                toastr.error('You can\'t create credit note for this claim');
            }
            $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData = null;
        } else {
            toastr.error('Please select one claim');
        }
    };
    $scope.claims_create_credit_note = function(id) {
        let data = {
            claimId: vm.entity_id,
            InvoiceTypeName: 'CreditNote'
        };
        if (id == 1) {
            data.IsResale = 1;
        }
        if (id == 2) {
            data.IsDebunker = 1;
        }
        Factory_Master.claims_create_credit_note(data, (response) => {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    toastr.success(response.message);
                    $rootScope.transportData = response.data;
                    // $location.path('invoices/claims/edit/');

                    localStorage.setItem('createCreditNote', JSON.stringify(response.data));
                    window.open($location.$$absUrl.replace('#'+$location.$$path, 'v2/invoices/edit/0'), '_self');
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.createDebunkerCreditNote = function() {
        let selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
        if (selectedRowData) {
            let claimSettlementType = selectedRowData.settlementType.name;
            let actualSettlementAmount = selectedRowData.actualSettlementAmount;
            let claimType = selectedRowData.claimType.name;
            let claimId = selectedRowData.id;
            if (selectedRowData.claimsPossibleActions.canCreateDebunkerCreditNote) {
                let data = {
                    ClaimId: claimId,
                    IsDebunker: 1
                };
                localStorage.setItem('createDebunkerCreditNoteFromInvoiceClaims', JSON.stringify(data));
                // window.open(`/#/${ vm.app_id }/` + 'claims' + '/edit/', '_blank');
                window.open(`/v2/${ vm.app_id }/` + 'edit/0', "_blank");

                /*
                Factory_Master.create_credit_note(data, function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $rootScope.transportData = response.data;
                            $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                })
                */
            } else {
                toastr.error('You can\'t create debunker credit note for this claim');
            }
        } else {
            toastr.error('Please select one claim');
        }
    };
    $scope.createResaleCreditNote = function() {
        let selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
        if (selectedRowData) {
            let claimSettlementType = selectedRowData.settlementType.name;
            let actualSettlementAmount = selectedRowData.actualSettlementAmount;
            let resaleAmount = selectedRowData.resaleAmount;
            let claimType = selectedRowData.claimType.name;
            let claimId = selectedRowData.id;
            if (selectedRowData.claimsPossibleActions.canCreateResaleCreditNote) {
                let data = {
                    ClaimId: claimId,
                    IsResale: 1
                };
                localStorage.setItem('createResaleCreditNoteFromInvoiceClaims', JSON.stringify(data));
                // window.open(`/#/${ vm.app_id }/` + 'claims' + '/edit/', '_blank');
                window.open(`/v2/${ vm.app_id }/` + 'edit/0', "_blank");

                /*
                Factory_Master.create_credit_note(data, function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            toastr.success(response.message);
                            $rootScope.transportData = response.data;
                            $location.path(vm.app_id + '/claims/edit/');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                })
                */
            } else {
                toastr.error('You can\'t create resale credit note for this claim');
            }
        } else {
            toastr.error('Please select one claim');
        }
    };

    /* INVOICES - CLAIMS*/
    $scope.saveTreasury = function() {
        var checkedRows = $rootScope.treasuryChangedfields;
        let CLC = $('#invoices_treasuryreport');
        let rowData = CLC.jqGrid.Ascensys.gridObject.rows;
        var rowsToSave = [];
        if (!checkedRows) {
            toastr.error('Please select at least one row!');
            return;
        }
        Object.keys(checkedRows).forEach(function(key, index) {
            if (this[key].isChecked == true) {
                var selectedData = this[key];
                $.each(rowData, (k, v) => {
                    if (v.id == key) {
                        rowsToSave.push(v);
                    }
                });
                $.each(rowsToSave, (k1, v1) => {
                    if (v1.id == key) {
                        $.each(v1, (k3, v3) => {
                            $.each(selectedData, (k2, v2) => {
                                if (k3 == k2) {
                                    v1[k3] = v2;
                                }
                            });
                        });
                    }
                });
            }
        }, checkedRows);
        console.log(rowsToSave);
        Factory_Master.saveTreasuryTableData(rowsToSave, (response) => {
            if (response) {
                if (response.status == true) {
                    console.log(response);
                    if (response.status) {
                        // toastr.success("Saved successfully!")
                    } else {
                        toastr.error('An error has occured!');
                    }
                } else {
                    toastr.error('An error has occured!');
                }
            }
        });
    };

    $rootScope.$on('gridDataDone', (data, res) => {
    	var isTreasuryReport = window.location.hash.indexOf('treasuryreport') != -1;
    	if (isTreasuryReport) {
            // elm = $('#tab_0 > div.col-md-12.portlet.light > div.portlet-body.main-portlet_content > div > div.col-md-12.fe_entity.edit_form_fields_GenerateReport_invoices.conditional_hidden > span > span > div > div').detach();
            // $('#tab_0 > div.col-md-12.portlet.light > div.portlet-title.ng-scope').append(elm);
            // elm.show();
            // elm.css('padding-right', '20px');

            console.log($rootScope.rawFilters);
            let CLC = $('#invoices_treasuryreport');
            let rowData = CLC.jqGrid.Ascensys.gridData[0];
            $scope.treasuryReportTotals = null;
            if (rowData) {
                if (rowData.totals) {
                    $scope.treasuryReportTotals = JSON.parse(rowData.totals);
                }
            }
    	}
    });


    $scope.invoiceConvertUom = function(type, rowIndex, formValues, isUom) {
    	var currentRowIndex = rowIndex;
        var additionalCost = formValues.costDetails[currentRowIndex];
        if ($rootScope.reloadPage) {
            return;
        }
        if (!isUom || $rootScope.addNewCost) {
            if (additionalCost.product.name != 'All') {
                getDefaultUomForAdditionalCost(additionalCost, currentRowIndex);
            } else {
                getDefaultUomForAdditionalCost(additionalCost, currentRowIndex, 1);
            }
            $rootScope.addNewCost = false;
        }
        if ($rootScope.reloadPage) {
            return;
        }
    	if ($('form[name="CM.editInstance"]').hasClass('ng-pristine')) {
    		if (!window.compiledinvoiceConvertUom) {
    			window.compiledinvoiceConvertUom = [];
    		}
    		if (!(window.compiledinvoiceConvertUom[`${type }-${ currentRowIndex}`] < 2)) {
    			window.compiledinvoiceConvertUom[`${type }-${ currentRowIndex}`] += 1;
                // myScope.$apply();
    		} else {
    			return;
    		}
    		// $scope.$apply();
    		// return;
    	}
        calculateGrand(formValues);
        vm.type = type;
        if (vm.type == 'product') {
            var product = formValues.productDetails[currentRowIndex];
            if (typeof product.product != 'undefined' && typeof product.invoiceQuantityUom != 'undefined' && typeof product.invoiceRateUom !== 'undefined') {
                if (product.invoiceQuantityUom == null || product.invoiceRateUom == null /* || typeof(product.invoiceAmount) == 'undefined'*/) {
                    return;
                };
                console.log('called getUomConversionFactor with params:', product.product.id, product.invoiceRateUom.id, product.invoiceQuantityUom.id);
                $scope.getUomConversionFactor(product.product.id, 1, product.invoiceQuantityUom.id, product.invoiceRateUom.id, product.contractProductId, product.orderProductId ? product.orderProductId : product.id, (response) => {
                	var conversionFactor = response;
                	if (false && formValues.productDetails[currentRowIndex].sapInvoiceAmount) {
	                    formValues.productDetails[currentRowIndex].invoiceAmount = formValues.productDetails[currentRowIndex].sapInvoiceAmount;
                	} else {
	                    formValues.productDetails[currentRowIndex].invoiceAmount = formValues.productDetails[currentRowIndex].invoiceQuantity * (formValues.productDetails[currentRowIndex].invoiceRate / conversionFactor);
                	}
                    // formValues.productDetails[currentRowIndex].invoiceComputedAmount = formValues.productDetails[currentRowIndex].invoiceAmount;
                    formValues.productDetails[currentRowIndex].difference = parseFloat(formValues.productDetails[currentRowIndex].invoiceAmount) - parseFloat(formValues.productDetails[currentRowIndex].estimatedAmount);

                    calculateGrand(formValues);
                    if (formValues.productDetails[currentRowIndex]) {
                        calculateProductRecon();
                    }
                });
            }
            // recalculatePercentAdditionalCosts(formValues);
        }
        if (vm.type == 'cost') {
            vm.old_cost = formValues.costDetails[currentRowIndex];
            if (formValues.costDetails[currentRowIndex].product) {
            	if (formValues.costDetails[currentRowIndex].product.id == -1) {
		            vm.old_product = formValues.costDetails[currentRowIndex].product.id;
            	} else {
		            vm.old_product = formValues.costDetails[currentRowIndex].product.productId;
            	}
            }
            vm.old_costType = formValues.costDetails[currentRowIndex].costType;
            if (vm.old_product == -1) {
                formValues.costDetails[currentRowIndex].isAllProductsCost = true;
                if (typeof $scope.dtMasterSource.applyFor == 'undefined') {
                    $http.post(`${API.BASE_URL_DATA_INVOICES }/api/invoice/getApplicableProducts`, {
                        Payload: formValues.orderDetails.order.id
                    }).then((response) => {
                        calculate(vm.old_cost, response.data.payload[1].id, vm.old_costType);
                    });
                } else {
                    if (!$scope.dtMasterSource.applyFor[1]) {
                        return;
                    }
                    calculate(vm.old_cost, $scope.dtMasterSource.applyFor[1].id, vm.old_costType);
                }
            } else {
                calculate(vm.old_cost, vm.old_product, vm.old_costType);
            }

            var allCostApplyFor = 0;
            $.each($scope.dtMasterSource.applyFor, (k, v) => {
            	if (v.name != 'All') {
		            allCostApplyFor = allCostApplyFor + v.convertedFinalQuantityAmount;
            	}
            });
            $.each($scope.dtMasterSource.applyFor, (k, v) => {
            	if (v.name == 'All') {
            		v.convertedFinalQuantityAmount = allCostApplyFor;
            	}
            });

            function calculate(cost, product, costType) {
                vm.cost = cost;
                vm.product = product;
                vm.costType = costType;
                // calculate extra
                if (!formValues.costDetails[rowIndex].invoiceExtras) {
                    formValues.costDetails[rowIndex].invoiceExtras = 0;
                }
                var rateUom, quantityUom;
                if (vm.cost.invoiceRateUom) {
                    rateUom = vm.cost.invoiceRateUom.id;
                } else {
                    rateUom = null;
                }
                if (vm.cost.invoiceQuantityUom) {
                    quantityUom = vm.cost.invoiceQuantityUom.id;
                } else {
                    quantityUom = null;
                }
                if (vm.costType.name == 'Percent' || vm.costType.name == 'Flat') {
                    rateUom = quantityUom;
                }


                if (vm.costType.name == 'Flat') {
                    formValues.costDetails[rowIndex].invoiceAmount = vm.cost.invoiceRate;
                    formValues.costDetails[rowIndex].invoiceExtrasAmount = formValues.costDetails[rowIndex].invoiceExtras / 100 * formValues.costDetails[rowIndex].invoiceAmount;
                    formValues.costDetails[rowIndex].invoiceTotalAmount = parseFloat(formValues.costDetails[rowIndex].invoiceExtrasAmount) + parseFloat(formValues.costDetails[rowIndex].invoiceAmount);
                    calculateGrand(formValues);
                    return;
                }
                $scope.getUomConversionFactor(vm.product, 1, quantityUom, rateUom, null, 1, (response) => {
                    if (vm.costType) {
                        if (vm.costType.name == 'Unit') {
                            formValues.costDetails[rowIndex].invoiceAmount = response * vm.cost.invoiceRate * vm.cost.invoiceQuantity;
                        }

                        formValues.costDetails[rowIndex].invoiceExtrasAmount = formValues.costDetails[rowIndex].invoiceExtras / 100 * formValues.costDetails[rowIndex].invoiceAmount;
                        formValues.costDetails[rowIndex].invoiceTotalAmount = parseFloat(formValues.costDetails[rowIndex].invoiceExtrasAmount) + parseFloat(formValues.costDetails[rowIndex].invoiceAmount);
                        formValues.costDetails[rowIndex].difference = parseFloat(formValues.costDetails[rowIndex].invoiceTotalAmount) - parseFloat(formValues.costDetails[rowIndex].estimatedTotalAmount);

                        formValues.costDetails[rowIndex].deliveryProductId = formValues.costDetails[rowIndex].product.deliveryProductId ? formValues.costDetails[rowIndex].product.deliveryProductId : formValues.costDetails[rowIndex].deliveryProductId;
                        console.log('-----------------------', formValues.costDetails[rowIndex].deliveryProductId);
                        // calculate grandTotal
                        if (vm.cost) {
                            calculateCostRecon();
                        }
                        calculateGrand(formValues);
                    }
                });
            }
        }
        function getDefaultUomForAdditionalCost(additionalCost, index, isAll) {
            console.log(additionalCost);
            console.log(product);
            if (!$scope.listProductTypeGroupsDefaults) {
                let payload1 = { Payload: {} };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload1).then((response) => {
                    console.log(response);
                    if (response.data.payload != 'null') {
                        $scope.listProductTypeGroupsDefaults = response.data.payload;
                        let payload;
                        if (isAll) {
                            payload = { Payload: formValues.productDetails[0].product.id };
                        } else {
                            payload = { Payload: product.product.id  ? product.product.id : additionalCost.product.productId };
                        }
                        $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                            if (response.data.payload != 'null') {
                                let productTypeGroup  = response.data.payload.productTypeGroup;
                                let defaultUomAndCompany = _.find($scope.listProductTypeGroupsDefaults, function(object) {
                                        return object.id == productTypeGroup.id;
                                });
                                if (defaultUomAndCompany) {
                                    formValues.costDetails[index].invoiceRateUom = defaultUomAndCompany.defaultUom;
                                    formValues.costDetails[index].invoiceQuantityUom = defaultUomAndCompany.defaultUom;

                                }
                            }
                        });
                    }
                });

            } else {
                let payload;
                if (isAll) {
                    payload = { Payload: formValues.productDetails[0].product.id };
                } else {
                    payload = { Payload: product.product.id  ? product.product.id  : additionalCost.product.productId };
                }
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                    if (response.data.payload != 'null') {
                        let productTypeGroup  = response.data.payload.productTypeGroup;
                        let defaultUomAndCompany = _.find($scope.listProductTypeGroupsDefaults, function(object) {
                                return object.id == productTypeGroup.id;
                        });
                        if (defaultUomAndCompany) {
                            formValues.costDetails[index].invoiceRateUom = defaultUomAndCompany.defaultUom;
                            formValues.costDetails[index].invoiceQuantityUom = defaultUomAndCompany.defaultUom;
                        }

                    }
                });
            }

        }


        function recalculatePercentAdditionalCosts(formValues) {
    		$.each(formValues.costDetails, (ck, cv) => {
    			if (cv.costType.name == 'Percent') {
	    			$scope.invoiceConvertUom('cost', ck, formValues, true);
    			}
    		});
        }

        function calculateCostRecon() {
            if (!vm.cost.estimatedRate || !vm.cost.invoiceAmount) {
                return;
            }
            // debugger
            $http.post(`${API.BASE_URL_DATA_RECON }/api/recon/invoicecost`, {
                payload: vm.cost
            }).then((response) => {
                console.log(response);
                var obj;
                if (response.data == 1) {
                    obj = {
                        id: 1,
                        name: 'Matched'
                    };
                } else {
                    obj = {
                        id: 2,
                        name: 'Unmatched'
                    };
                }
                formValues.costDetails[rowIndex].reconStatus = obj;
            });
        }

        function calculateProductRecon() {
        	if (!product.invoiceRateCurrency || !product.estimatedRateCurrency) {
        		return false;
        	}
        	if (!product.invoiceRateCurrency.id || !product.estimatedRateCurrency.id) {
        		return false;
        	}
            $http.post(`${API.BASE_URL_DATA_RECON }/api/recon/invoiceproduct`, {
                payload: product
            }).then((response) => {
                console.log(response);
                var obj;
                if (response.data == 1) {
                    obj = {
                        id: 1,
                        name: 'Matched'
                    };
                } else {
                    obj = {
                        id: 2,
                        name: 'Unmatched'
                    };
                }
                product.reconStatus = obj;
            });
        }

        function calculateGrand(formValues) {
            if (!formValues.invoiceSummary) {
                formValues.invoiceSummary = {};
            }
            // formValues.invoiceSummary.provisionalInvoiceAmount = $scope.calculateprovisionalInvoiceAmount(formValues)
            formValues.invoiceSummary.invoiceAmountGrandTotal = $scope.calculateInvoiceGrandTotal(formValues) - formValues.invoiceSummary.provisionalInvoiceAmount;
            formValues.invoiceSummary.estimatedAmountGrandTotal = $scope.calculateInvoiceEstimatedGrandTotal(formValues);
            formValues.invoiceSummary.totalDifference = formValues.invoiceSummary.invoiceAmountGrandTotal - formValues.invoiceSummary.estimatedAmountGrandTotal;
            formValues.invoiceSummary.netPayable = formValues.invoiceSummary.invoiceAmountGrandTotal - formValues.invoiceSummary.deductions;
            $scope.changedFVal = formValues;
        }
    };


    $scope.getComponentTypeOfCost = function(costId) {
        $.each($rootScope.additionalCostsData, (k, v) => {
            if (costId == v.id) {
                var costComponentType = v.componentType.id;
            }
        });
        return costComponentType;
    };
    $scope.getCostsProductsAmount = function(formValues) {
        var allProductsAmount = 0;
        $.each(formValues.productDetails, (k, v) => {
            allProductsAmount = allProductsAmount + v.invoiceAmount;
        });
        var allCostsAmount = 0;
        $.each(formValues.costDetails, (k, v) => {
            var ct = $scope.getComponentTypeOfCost(v.costName.id);
            if (ct == 2) {
                allCostsAmount = allCostsAmount + parseFloat(v.invoiceAmount);
            }
        });
        return allProductsAmount;
    };
    $scope.getCostsProductsAndCostsAmount = function(formValues) {
        var allProductsAmount = 0;
        $.each(formValues.productDetails, (k, v) => {
            allProductsAmount = allProductsAmount + v.invoiceAmount;
        });
        var allCostsAmount = 0;
        $.each(formValues.costDetails, (k, v) => {
            var componentType = $scope.getComponentTypeOfCost(v.costName.id);
            if (componentType == 2) {
                allCostsAmount = allCostsAmount + parseFloat(v.invoiceAmount);
            }
        });
        return allProductsAmount + allCostsAmount;
    };
    $scope.createInvoiceFromEdit = function(invoiceType, isFinal) {
        if (!invoiceType) {
            toastr.error('Please select an invoice type');
            return;
        }
        invoiceType = JSON.parse(invoiceType);
        // if (invoiceType.name == "Final Invoice") {
        // 	$scope.createFinalInvoiceFromEditPage();
        // 	return;
        // }

        $rootScope.transportData = angular.copy($scope.formValues);

        if ($rootScope.transportData.documentType.internalName == 'ProvisionalInvoice') {
            !$rootScope.transportData.paymentDate ? $rootScope.transportData.paymentDate = $rootScope.transportData.workingDueDate : '';
        }

        $rootScope.transportData.id = 0;
        $rootScope.transportData.invoiceDetails = null;
        $rootScope.transportData.documentNo = null;
        $rootScope.transportData.dueDate = null;
        $rootScope.transportData.invoiceDate = `${moment(new Date()).format('YYYY-MM-DDTHH:mm:ss').split('T')[0] }T00:00:00`;
        $rootScope.transportData.invoiceSummary.deductions = null;
        $rootScope.transportData.paymentDate = null;
        $rootScope.transportData.accountNumber = null;
        $rootScope.transportData.paymentDetails.paidAmount = null;
        $rootScope.transportData.documentType = invoiceType;
        $rootScope.transportData.paymentDetails = null;
        $rootScope.transportData.invoiceDetails = null;
        $rootScope.transportData.sellerInvoiceNo = null;
        $rootScope.transportData.receivedDate = null;
        $rootScope.transportData.manualDueDate = null;
        $rootScope.transportData.sellerInvoiceDate = null;
        $rootScope.transportData.sellerDueDate = null;
        $rootScope.transportData.approvedDate = null;
        // $rootScope.transportData.invoiceRateCurrency = null;
        $rootScope.transportData.backOfficeComments = null;
        $rootScope.transportData.invoiceSummary.invoiceAmountGrandTotal = null;
        $rootScope.transportData.invoiceSummary.estimatedAmountGrandTotal = null;
        $rootScope.transportData.invoiceSummary.totalDifference = null;
        $rootScope.transportData.status = null;
        $rootScope.transportData.customStatus = null;
        $rootScope.transportData.invoiceSummary.provisionalInvoiceNo = null;
        $rootScope.transportData.accountancyDate = null;
        $rootScope.transportData.counterpartyDetails.paymentTerm = null;
        $rootScope.transportData.sellerName = null;

        $rootScope.transportData.paymentDetails = {};

        var invoiceAmountGrandTotal = 0;
        var provisionalInvoiceAmount = 0;
        var deductions = 0;

        $rootScope.transportData.invoiceSummary.netPayable = invoiceAmountGrandTotal - deductions;
        $.each($rootScope.transportData.productDetails, (k, v) => {
            v.id = 0;
            v.invoiceRate = 0;
            v.description = null;
            v.invoiceAmount = null;
            v.reconStatus = null;
            v.amountInInvoice = null;
        });
        if ($rootScope.transportData.costDetails) {
            $.each($rootScope.transportData.costDetails, (k, v) => {
	            v.id = 0;
	            v.invoiceRate = null;
	            v.invoiceExtras = null;
	            v.description = null;
	            v.invoiceAmount = null;
                if (v.product) {
	                if (v.product.id != -1) {
	                	if (v.product.id != v.deliveryProductId) {
		                	v.product.productId = angular.copy(v.product.id);
		                	v.product.id = angular.copy(v.deliveryProductId);
	                	}
	                }
                } else {
                	v.product = {
                		id : -1,
                	};
                }
            });
        }

        var passedData = angular.copy($rootScope.transportData);
        $rootScope.transportData = null;
        localStorage.setItem('invoice_createInvoiceFromEdit', angular.toJson(passedData));
        window.open('/#/invoices/invoice/edit/', '_blank');
    };
    $scope.createFinalInvoiceFromEditPage = function(fv) {
        var invoiceType = {
            id: 2,
            name: 'FinalInvoice',
            code: null
        };
        var data = {
	        invoiceType : invoiceType,
	        entityId : vm.entity_id
        };

        localStorage.setItem('invoice_createFinalInvoiceFromEditPage', angular.toJson(data));
        window.open('/#/invoices/invoice/edit/', '_blank');
    };

    $scope.getAdditionalCostsData = function() {
        data = 0;
        Factory_Master.getAdditionalCosts(data, (response) => {
            if (response) {
                if (response.status == true) {
                    // debugger;
                    $rootScope.additionalCostsData = response.data.payload;

                    return response.data.payload;
                }
                toastr.error('An error has occured!');
            }
        });
    };
    $scope.calculateInvoiceGrandTotal = function(formValues) {
        var grandTotal = 0;
        $.each(formValues.productDetails, (k, v) => {
            if (!v.isDeleted && typeof v.invoiceAmount != 'undefined') {
                grandTotal = grandTotal + v.invoiceAmount;
            }
        });
        $.each(formValues.costDetails, (k, v) => {
            if (!v.isDeleted) {
                if (typeof v.invoiceTotalAmount != 'undefined') {
                    grandTotal = grandTotal + v.invoiceTotalAmount;
                }
            }
        });
        return grandTotal;
    };
    $scope.calculateprovisionalInvoiceAmount = function(formValues) {
        var grandTotal = 0;
        $.each(formValues.relatedInvoices, (k, v) => {
            if (!v.isDeleted && typeof v.invoiceAmount != 'undefined' && v.invoiceType.name == 'ProvisionalInvoice') {
                grandTotal = grandTotal + v.invoiceAmount;
            }
        });
        return grandTotal;
    };
    $scope.calculateInvoiceEstimatedGrandTotal = function(formValues) {
        var grandTotal = 0;
        $.each(formValues.productDetails, (k, v) => {
            if (!v.isDeleted && typeof v.estimatedAmount != 'undefined') {
                grandTotal = grandTotal + v.estimatedAmount;
            }
        });
        $.each(formValues.costDetails, (k, v) => {
            if (!v.isDeleted) {
                if (typeof v.estimatedAmount != 'undefined') {
                    grandTotal = grandTotal + v.estimatedAmount;
                }
            }
        });
        return grandTotal;
    };

    $scope.addTransactionsInInvoice = function(element) {
        id = element.clc;
        var object = element.source;
        var formvalue = element.formvalue;
        var idx = element.idx;
        var field_name = element.field_name;
        let CLC = $(`#modal_${ id } table.ui-jqgrid-btable`);
        let rowId = CLC.jqGrid('getGridParam', 'selrow');
        let rowData = CLC.jqGrid.Ascensys.gridObject.rows[rowId - 1];
        var selectedRows = [];
        $.each(CLC.jqGrid.Ascensys.selectedProductIds, (k1, v1) => {
            $.each(CLC.jqGrid.Ascensys.gridObject.rows, (k2, v2) => {
                if (v1 == v2.deliveryProductId && CLC.jqGrid.Ascensys.rowsProduct[k1] - 1 == k2) {
                    selectedRows.push(v2);
                }
            });
        });
        var orderAdditionalCostId = [];
        $.each(CLC.jqGrid.Ascensys.selectedOrderAdditionalCostId, (k1, v1) => {
            $.each(CLC.jqGrid.Ascensys.gridObject.rows, (k2, v2) => {
                if (v1 == v2.orderAdditionalCostId) {
                    orderAdditionalCostId.push(v2);
                }
            });
        });

        var mixedRows = selectedRows.concat(orderAdditionalCostId);

        $.each(mixedRows, (k, rowData) => {
            if (rowData.costName) {
                var transaction_type = 'cost';
                let product = angular.copy(rowData.product);
            	product.productId = angular.copy(rowData.product.id);
                product.id = angular.copy(rowData.deliveryProductId);
                transactionstobeinvoiced_dtRow = {
                    product: product,
                    costName: rowData.costName,
                    costType: rowData.costType,
                    orderAdditionalCostId: rowData.orderAdditionalCostId,
                    deliveryProductId: rowData.deliveryProductId,
                    deliveryQuantity: rowData.deliveryQuantity,
                    deliveryQuantityUom: rowData.deliveryQuantityUom,
                    estimatedAmount: rowData.estimatedAmount,
                    estimatedAmountCurrency: rowData.estimatedAmountCurrency,
                    estimatedRate: rowData.estimatedRate,
                    estimatedRateCurrency: rowData.estimatedRateCurrency,
                    invoiceRateCurrency: $scope.formValues.invoiceRateCurrency,
                    estimatedRateUom: rowData.estimatedRateUom,
                    sulphurContent: rowData.sulphurContent,
                    pricingDate: rowData.pricingDate,
                    isDeleted: rowData.isDeleted,
                    invoiceAmount: rowData.invoiceAmount,
                    invoiceQuantity: rowData.deliveryQuantity,
                    invoiceTotalAmount: rowData.invoiceTotalAmount,
                    estimatedTotalAmount: rowData.estimatedTotalAmount,
                    // new on 30.08.2018
                    invoiceQuantityUom: rowData.invoiceQuantityUom,
                    invoiceRateUom: rowData.invoiceRateUom,
                    estimatedExtras: rowData.estimatedExtra,
                    // invoiceExtras: rowData.estimatedExtra,
                    estimatedExtrasAmount: rowData.estimatedExtraAmount
                };
            }
            if (rowData.delivery) {
            	rowData.product.productId = angular.copy(rowData.product.id);
                var transactionstobeinvoiced_dtRow = {
                    amountInInvoice: '',
                    deliveryNo: rowData.delivery.name,
                    agreementType: rowData.agreementType,
                    deliveryProductId: rowData.deliveryProductId,
                    invoicedProduct: rowData.invoicedProduct,
                    orderedProduct: rowData.orderedProduct,
                    contract: rowData.contract,
                    confirmedQuantity: rowData.confirmedQuantity,
                    confirmedQuantityUom: rowData.confirmedQuantityUom,
                    deliveryQuantity: rowData.deliveryQuantity,
                    deliveryQuantityUom: rowData.confirmedQuantityUom,
                    deliveryMFM: rowData.deliveryMFM,
                    sulphurContent: rowData.sulphurContent,
                    difference: '',
                    estimatedAmount: rowData.estimatedAmount,
                    estimatedAmountCurrency: rowData.estimatedRateCurrency,
                    estimatedRate: rowData.estimatedRate,
                    estimatedRateCurrency: rowData.estimatedRateCurrency,
                    invoiceAmount: '',
                    invoiceAmountCurrency: {},
                    invoiceQuantity: '',
                    invoiceQuantityUom: {},
                    invoiceRate: '',
                    invoiceRateUom: rowData.invoiceRateUom,
                    invoiceRateCurrency: $scope.formValues.invoiceRateCurrency,
                    isDeleted: rowData.isDeleted,
                    pricingDate: rowData.pricingDate,
                    product: rowData.product,
                    physicalSupplierCounterparty: rowData.physicalSupplierCounterparty,
                    estimatedRateUom: rowData.estimatedRateUom,
                    pricingScheduleName: rowData.pricingScheduleName,
                    reconStatus: {
                        id: 1,
                        name: 'Matched',
                        code: '',
                        collectionName: null
                    }
                };
            }
            if (rowData.costName) {
                var alreadyExists = false;
                var alreadyExistsKey = false;
                $.each($scope.formValues.costDetails, (idx, val) => {
                    if (rowData.orderAdditionalCostId == val.orderAdditionalCostId) {
                        alreadyExists = true;
                        alreadyExistsKey = idx;
                    }
                });
                if (!alreadyExists) {
                    $scope.formValues.costDetails.push(transactionstobeinvoiced_dtRow);
                } else if (alreadyExistsKey !== false) {
	                	if ($scope.formValues.costDetails[alreadyExistsKey].isDeleted && !$scope.formValues.costDetails[alreadyExistsKey].id) {
		                    $scope.formValues.costDetails[alreadyExistsKey] = transactionstobeinvoiced_dtRow;
	                	} else {
		                    toastr.error('Selected cost already exists');
	                	}
                	} else {
	                    toastr.error('Selected cost already exists');
                	}
            }
            if (rowData.delivery) {
                alreadyExists = false;
                $.each($scope.formValues.productDetails, (idx, val) => {
                    if (rowData.deliveryProductId == val.deliveryProductId && !val.isDeleted) {
                        alreadyExists = true;
                    }
                });
                if (!alreadyExists) {
                	transactionstobeinvoiced_dtRow.invoiceQuantity = transactionstobeinvoiced_dtRow.deliveryQuantity;
                	transactionstobeinvoiced_dtRow.invoiceQuantityUom = transactionstobeinvoiced_dtRow.deliveryQuantityUom;
                    $scope.formValues.productDetails.push(transactionstobeinvoiced_dtRow);
                } else {
                    toastr.error('Selected product already exists');
                }
            }
        });
        $scope.modalInstance.close();
    };

    $scope.getUomConversionFactor = function(ProductId, Quantity, FromUomId, ToUomId, contractProductId, orderProductId, callback) {
    	var productId = ProductId;
    	var quantity = Quantity;
    	var fromUomId = FromUomId;
    	var toUomId = ToUomId;
        var data = {
            Payload: {
                ProductId: productId,
                OrderProductId: orderProductId,
                Quantity: quantity,
                FromUomId: fromUomId,
                ToUomId: toUomId,
                ContractProductId: contractProductId ? contractProductId : null

            }
        };
        if (!productId || !toUomId || !fromUomId) {
        	return;
        }
        if (toUomId == fromUomId) {
            callback(1);
            return;
        }
        Factory_Master.getUomConversionFactor(data, (response) => {
            if (response) {
                if (response.status == true) {
                    callback(response.data.payload);
                } else {
                    toastr.error('An error has occured!');
                }
            }
        });
    };
    $scope.checkIfShowPaymentProofButton = function() {
        var shouldDisplay = false;
        $.each($rootScope.screenButtons, (k, v) => {
            if (v.label == 'UpdatePaymentProofDetails') {
                shouldDisplay = true;
            }
        });
        return shouldDisplay;
    };
    $scope.isPaymentProofEnabled = function() {
        return !$scope.paymentProofEnabled;
    };
    $scope.updatePaymentProofDetails = function() {
        data = '';
        Factory_Master.updatePaymentProofDetails(data, (response) => {
            if (response) {
                if (response.status == true) {
                    // toastr.success("Payment proof details updated");
                    $scope.paymentProofEnabled = true;
                } else {
                    $scope.paymentProofEnabled = false;
                    toastr.error('An error has occured!');
                }
            }
        });
    };
    $scope.filterInvoiceCostTypeDropdown = function() {
        $scope.filterCostTypesByAdditionalCost();
    };

    $scope.computeInvoiceTotalConversion = function(conversionRoe, conversionTo) {
    	if (!conversionRoe || !conversionTo /* || !$scope.formValues.invoiceSummary*/) {
    		return false;
    	}
    	if (typeof vm.changedFromCurrency == 'undefined') {
    		vm.changedFromCurrency = false;
    	}

        if (!$scope.formValues.invoiceSummary) {
            return;
        }

    	var payloadData = {
		     Amount : $scope.formValues.invoiceSummary.invoiceAmountGrandTotal,
		     CurrencyId: $scope.formValues.invoiceRateCurrency.id,
		     ROE: conversionRoe,
		     ToCurrencyId: conversionTo.id,
		     CompanyId: $scope.formValues.orderDetails.carrierCompany.id,
		     GetROE:  vm.changedFromCurrency
        };
	    Factory_Master.invoiceTotalConversion(payloadData, (callback) => {
	        if (callback.status == true) {
	        	 if (vm.changedFromCurrency && !callback.data.getROE) {
                    toastr.warning('There is no conversion rate available for current selection');
	        	 } else {
                    vm.convertedAmount = callback.data.convertedAmount;
                    vm.conversionRoe = callback.data.roe;
	        	 }
	        }
	    });
    	vm.changedFromCurrency = false;
    };

    $scope.getProductTypeById = function(id) {
        let prodType = _.filter($scope.listsCache.ProductType, [ 'id', id ]);
        return prodType[0].name;
    };


    $scope.setPageTitle = function(title) {
        if(title) {
            // tab title
            // var title = "Invoice - " + title;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            });
        }else{
            // page title
        //    debugger;
            let invoicePageTitles = {};
            invoicePageTitles.claims = 'Invoice Claims List';

            if(invoicePageTitles[$state.params.screen_id]) {
                $state.params.title = invoicePageTitles[$state.params.screen_id];
                $scope.setPageTitle($state.params.title);
            }
        }
    };

    $scope.$on('formValues', () => {
        // debugger;
        if(vm.screen_id == 'invoice') {
            // 1.if request available, use request id
            if($scope.formValues.requestInfo) {
                if($scope.formValues.requestInfo.request) {
                    let title = `Invoice - ${ $scope.formValues.requestInfo.request.name } - ${ $scope.formValues.requestInfo.vesselName}`;
                    $scope.setPageTitle(title);
                    return;
                }
            }

            // 2. else use order id
            if($scope.formValues.orderDetails) {
                if($scope.formValues.orderDetails.order) {
                    var invoiceTitle = `Invoice - ${ $scope.formValues.orderDetails.order.name } - ${ $scope.formValues.orderDetails.vesselName}`;
                    $scope.setPageTitle(invoiceTitle);
                    return;
                }
            }

            // 3. use invoice name
            if($scope.formValues.id) {
                var invoiceTitle = `Invoice - INV${ $scope.formValues.id } - ${ $scope.formValues.orderDetails.vesselName}`;
                $scope.setPageTitle(invoiceTitle);
            }


            $scope.recalcultateAdditionalCost();
        }
    });


    $scope.setPageTitle = function(title) {
        if(title) {
            // tab title
            // var title = "Invoice - " + title;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            });
        }else{
            // page title
        //    debugger;
            let invoicePageTitles = {};
            invoicePageTitles.claims = 'Invoice Claims List';

            if(invoicePageTitles[$state.params.screen_id]) {
                $state.params.title = invoicePageTitles[$state.params.screen_id];
                $scope.setPageTitle($state.params.title);
            }
        }
    };


    $scope.recalcultateAdditionalCost = function() {


    };


    function setConvertedAddCost(product, additionalCost, i) {
        lookupModel.getConvertedUOM(product.product.id, 1, additionalCost.estimatedRateUom.id, additionalCost.deliveryQuantityUom.id).then((server_data) => {
            return server_data.payload;
        }).catch((e) => {
            throw 'Unable to get the uom.';
        });
    }

    function isProductComponent(additionalCost) {
        if (!additionalCost.additionalCost) {
            return false;
        }
        if (vm.additionalCostTypes[additionalCost.costName.id].componentType) {
            additionalCost.isTaxComponent = vm.additionalCostTypes[additionalCost.costName.id].componentType.id === COMPONENT_TYPE_IDS.TAX_COMPONENT;
            return ctrl.additionalCostTypes[additionalCost.costName.id].componentType.id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT;
        }
        return null;
    }

    function sumProductAmounts() {
        let result = 0;
        for (let i = 0; i < $scope.formValues.orderDetails.products; i++) {
            if (!$scope.formValues.productDetails[i].status) {
                result = result + $scope.formValues.orderDetails.productss[i].amount;
            } else if($scope.formValues.productDetails[i].status.id != ctrl.STATUS.Cancelled.id) {
                result = result + $scope.formValues.orderDetails.products[i].amount;
            }
        }
        return result;
    }

    /**
         * Calculates the amount-related fields of an additional cost, as per FSD p. 210: Amount, Extras Amount, Total Amount.
         */


    function calculateAdditionalCostAmounts(additionalCost, product) {
        let totalAmount, productComponent;
        if (!additionalCost.costType) {
            return additionalCost;
        }
        switch (additionalCost.costType.id) {
        case COST_TYPE_IDS.UNIT:

            additionalCost.estimatedAmount = 0;

            if (additionalCost.priceUom && additionalCost.prodConv) {
                for (let i = 0; i < $scope.formValues.orderDetails.products.length; i++) {
                    let prod = $scope.formValues.orderDetails.products[i];


                    if (!prod.status) {
                        // product w. no status
                        var confirmedQuantityOrMaxQuantity = prod.confirmedQuantity ? prod.confirmedQuantity : prod.maxQuantity;

                        if (additionalCost.isAllProductsCost) {
                            // estimatedAmount calculation
                            additionalCost.estimatedAmount = additionalCost.amount + confirmedQuantityOrMaxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                        } else{
                            // check if product sent to function for calculation is the same as current product in list.
	                                if (product === prod) {
                                additionalCost.estimatedAmount = confirmedQuantityOrMaxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                            }
                        }
                    } else {
                        // if status set
                        if (prod.status.id != ctrl.STATUS.Cancelled.id) {
                        	var confirmedQuantityOrMaxQuantity = prod.confirmedQuantity ? prod.confirmedQuantity : prod.maxQuantity;

                        	if (additionalCost.isAllProductsCost) {
                        		additionalCost.estimatedAmount = additionalCost.estimatedAmount + confirmedQuantityOrMaxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                        	} else if (product === prod) {
                        		additionalCost.estimatedAmount = confirmedQuantityOrMaxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                        	}
                        }
                    }
                }
            }
            // else {
            //    additionalCost.amount = additionalCost.confirmedQuantity * additionalCost.price;
            // }
            break;
        case COST_TYPE_IDS.FLAT:
            additionalCost.estimatedAmount = additionalCost.price || 0;
            break;
        case COST_TYPE_IDS.PERCENT:
            productComponent = isProductComponent(additionalCost);
            if (additionalCost.isAllProductsCost || !productComponent) {
                totalAmount = sumProductAmounts();
            } else {
                totalAmount = product.estimatedAmount;
            }
            if (productComponent) {
                additionalCost.estimatedAmount = totalAmount * additionalCost.price / 100 || 0;
            } else {
                totalAmount = totalAmount + sumProductComponentAdditionalCostAmounts();
                additionalCost.estimatedAmount = totalAmount * additionalCost.price / 100 || 0;
            }
            break;
        }
        return additionalCost;
    }
} ]);
