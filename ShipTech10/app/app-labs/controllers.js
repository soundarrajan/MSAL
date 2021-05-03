/**
 * Labs Controller
 */
APP_LABS.controller('Controller_Labs', ['$scope', '$rootScope', '$Api_Service', 'Factory_Labs', '$state', '$location', '$q', '$compile', '$timeout', 'Factory_Master', '$listsCache', '$filter', '$templateCache', '$uibModal', '$http', 'API', 'statusColors', function ($scope, $rootScope, $Api_Service, Factory_Labs, $state, $location, $q, $compile, $timeout, Factory_Master, $listsCache, $filter, $templateCache, $uibModal, $http, API, statusColors) {
    let vm = this;
    let guid = '';
    vm.relatedLabs = [];
    $scope.relatedLabs = [];
    vm.master_id = $state.params.master_id;
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object();
    vm.response = '';
    vm.ids = '';
    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }
    $rootScope.$on('formValues', (event, data) => {
        $scope.formValues = data;
        // $scope.reconMatchDisplayName();
        $scope.setStatusForHeader('init');
        $scope.registerDropdowns();
        $scope.formValues.notes = data.labNotes;
        if (!JSON.stringify($state.params.path).contains('labs.documents')) {
            $.each($scope.formFields, (index, value) => {
                $.each(value.children, (key, val) => {
                    if (val.Name != 'DocumentType') {
                        if ($scope.formValues.status.name == 'Verified') {
                            val.disabled = true;
                            val.Disabled = true;
                        }
                    }
                });
            });
        }
    });

    $scope.setStatusForHeader = function (value) {
        // value is true or false
        // only statuses that can be calculated are 3,4
        // for 5 (failed) and 2 (verified), display status but do not allow recalculation
        // 4 is passed (in spec), 3 is failed (off spec)
        if (typeof value == 'undefined') {
            return;
        }
        if (window.location.href.indexOf("/invoices/") != -1) {
            return;
        }
        if (value == 'init') {
            if (typeof $scope.formValues.status != 'undefined') {
                if ($scope.formValues.status.name) {
                    if (!$state.params.status_labs) {
                        $state.params.status_labs = {};
                    }

                    $state.params.status_labs = angular.copy($scope.formValues.status);
                    $state.params.status_labs.bg = statusColors.getColorCodeFromLabels(
                        $state.params.status_labs,
                        $listsCache.ScheduleDashboardLabelConfiguration);
                    $state.params.status_labs.color = 'white';
                }
            } else {
                $state.params.status_labs = null;
            }
        } else {
            if (typeof $state.params.status_labs == 'undefined') {
                $state.params.status_labs = {};
                // return;
            }
            // invalid
            if ($scope.formValues.status.id == 5) {
                return;
            }
            // verified
            if ($scope.formValues.status.id == 2) {
                return;
            }

            $.each($listsCache.LabResultStatus, (key, val) => {
                if (value && val.id == 4) {
                    $scope.formValues.status = val;
                }
                if (!value && val.id == 3) {
                    $scope.formValues.status = val;
                }
                $state.params.status_labs = angular.copy($scope.formValues.status);
                $state.params.status_labs.bg = statusColors.getColorCodeFromLabels(
                    $state.params.status_labs,
                    $listsCache.ScheduleDashboardLabelConfiguration);
                $state.params.status_labs.color = 'white';
            });
        }
    };

    $scope.reconMatchDisplayName = function (setOnTheFly, value) {
        if (!setOnTheFly) {
            $.each($listsCache.QualityMatch, (key, val) => {
                if (val.id == $scope.formValues.reconMatch.id) {
                    $scope.formValues.reconMatch.displayName = val.displayName;
                }
            });
        } else {
            // if set on the fly, value is true or false
            // 1 is passed, 2 id failed
            if (typeof $state.params.status == 'undefined') {
                return;
            }

            $.each($listsCache.QualityMatch, (key, val) => {
                if (value && val.id == 1) {
                    $scope.formValues.reconMatch = val;
                }
                if (!value && val.id == 2) {
                    $scope.formValues.reconMatch = val;
                }
                $state.params.status.name = $scope.formValues.reconMatch.name;
                $state.params.status.displayName = $scope.formValues.reconMatch.displayName;
                $state.params.status.bg = statusColors.getColorCodeFromLabels(
                    $scope.formValues.reconMatch,
                    $listsCache.ScheduleDashboardLabelConfiguration);
            });
        }
        // console.log($listsCache.QualityMatch);
        // console.log($scope.formValues.reconMatch);
    };

    $scope.registerDropdowns = function () {
        let field = new Object();
        field = vm.formFieldSearch($scope.formFields, 'delivery');
        if (field) {
            vm.getOptions(field);
        }
        field = vm.formFieldSearch($scope.formFields, 'product');
        if (field) {
            vm.getOptions(field);
        }
        delete field;
    };


    var decodeHtmlEntity = function (str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    };

    $scope.triggerChangeFieldsAppSpecific = function (name, id) {
        if (name == 'OrderID' && id == 'order') {
            // suprascriem niste date
            Factory_Master.get_master_entity($scope.formValues.order.id, 'orders', 'orders', (response) => {
                if (response) {
                    $scope.thirdParty = {};
                    var del;
                    if ($scope.formValues.delivery) {
                        del = $scope.formValues.delivery.id;
                    } else {
                        del = '';
                    }
                    var lab;
                    if ($scope.formValues.name) {
                        lab = $scope.formValues.name;
                    } else {
                        lab = 'Lab New';
                    }
                    $state.params.title = `${$scope.formValues.order.name}- DEL - ${del} - ${lab}`;
                    if (typeof $scope.formValues.vessel == 'undefined') {
                        $scope.formValues.vessel = {};
                    }
                    if (typeof $scope.formValues.barge == 'undefined') {
                        $scope.formValues.barge = {};
                    }
                    $scope.labOrderSummary = response;
                    if (response.seller) {
                        $scope.formValues.seller = response.seller.name;
                        $scope.thirdParty.seller = response.seller.name;
                    }
                    if (response.buyer) {
                        $scope.formValues.buyer = response.buyer.name;
                    }
                    if (response.vessel) {
                        $scope.formValues.vessel = response.vessel;
                        $scope.thirdParty.vessel = response.vessel.name;
                    }
                    if (response.location) {
                        $scope.formValues.port = response.location.name;
                    }
                    if (response.paymentCompany) {
                        $scope.formValues.company = response.paymentCompany;
                    }
                    if (response.deliveryDate && !$scope.formValues.deliveryDate) {
                        $scope.formValues.deliveryDate = response.deliveryDate;
                    }
                    if (response.surveyorCounterparty && !$scope.formValues.surveyor) {
                        $scope.formValues.surveyor = response.surveyorCounterparty;
                        $scope.formValues.surveyorName = response.surveyorCounterparty.name;
                        $scope.thirdParty.surveyor = response.surveyorCounterparty.name;
                    }
                    if (response.barge) {
                        $scope.thirdParty.barge = response.barge.name;
                    }
                    if (response.phisycalSupplier) {
                        $scope.thirdParty.phisycal_supplier = response.phisycalSupplier.name;
                    }
                    if (response.broker) {
                        $scope.thirdParty.broker = response.broker.name;
                    }
                    if (response.lab) {
                        $scope.thirdParty.labs = response.lab.name;
                        if (!$scope.formValues.counterparty) {
                            $scope.formValues.counterparty = response.lab;
                        }
                    }

                    if ($scope.formValues.labTestResults && $scope.formValues.labTestResults.length) {
                        _.forEach($scope.formValues.labTestResults, function (object) {
                            object.specParameter.name = decodeHtmlEntity(_.unescape(object.specParameter.name));
                        });
                    }
                    if (response.products) {
                        $scope.temp = {
                            products: response.products
                        };
                        if ($scope.formValues.product) {
                            var fil = $filter('filter')($scope.temp.products, { product: { id: $scope.formValues.product.id } })[0];
                            if (fil) {
                                $scope.formValues.specGroup = fil.specGroup.name;
                            }
                        }
                    }
                    // retrigger de dropdowns delivery, labs, products
                    let field = new Object();
                    field = vm.formFieldSearch($scope.formFields, 'delivery');
                    if (field) {
                        vm.getOptions(field);
                    }
                    field = vm.formFieldSearch($scope.formFields, 'product');
                    if (field) {
                        vm.getOptions(field);
                    }
                    delete field;
                    if (typeof $scope.formValues.reconMatch != 'undefined') {
                        if ($scope.formValues.reconMatch.name) {
                            // $state.params.title = "DEL - " + delID + " - " + $scope.formValues.order.name + ' - ' + $scope.formValues.temp.deliverysummary.vesselName;
                            // $state.params.title = 'CTRL' + $scope.formValues.name;
                            $scope.reconMatchDisplayName();
                            if (!$state.params.status) {
                                $state.params.status = {};
                            }
                            $state.params.status.name = $scope.formValues.reconMatch.name;
                            $state.params.status.displayName = $scope.formValues.reconMatch.displayName;
                            $state.params.status.bg = statusColors.getColorCodeFromLabels(
                                $scope.formValues.reconMatch,
                                $listsCache.ScheduleDashboardLabelConfiguration);
                            $state.params.status.color = 'white';
                        }
                    } else {
                        $state.params.status = null;
                    }

                    if (typeof $scope.formValues.status != 'undefined') {
                        if ($scope.formValues.status.name) {
                            if (!$state.params.status_labs) {
                                $state.params.status_labs = {};
                            }
                            $state.params.status_labs = angular.copy($scope.formValues.status);
                            $state.params.status_labs.bg = statusColors.getColorCodeFromLabels(
                                $state.params.status_labs,
                                $listsCache.ScheduleDashboardLabelConfiguration);
                            $state.params.status_labs.color = 'white';
                        }
                    } else {
                        $state.params.status_labs = null;
                    }
                    var data = {
                        Order: $scope.formValues.order.id,
                    };
                    if (!$scope.formValues.id) {
                        vm.getDataTable('SealNumber', data, 'sealNumber');
                    }
                }
            });
            Factory_Master.getLabInfoForOrder($scope.formValues.order.id, (response) => {
                vm.relatedLabs = response.data;
                $scope.relatedLabs = vm.relatedLabs;
                vm.relatedLabs = data;
            });
        }
        if (name == 'DeliveryID') {
            $scope.formValues.product = null; // 11269
            let field = new Object();
            field = vm.formFieldSearch($scope.formFields, 'product');
            if (field) {
                vm.getOptions(field);
            }
            delete field;
            if (!$scope.formValues.delivery) {
                return;
            }
            Factory_Master.get_master_entity($scope.formValues.delivery.id, 'delivery', 'delivery', (response) => {
                if (response.barge) {
                    $scope.formValues.barge = response.barge;
                }
                if (response.deliveryDate) {
                    $scope.formValues.deliveryDate = response.deliveryDate;
                }
                if (response.pumpingDurationSeconds) {
                    // $scope.formValues.surveyedHours = response.pumpingDurationSeconds;
                }
            });
            if ($scope.formValues.delivery) {
                del = $scope.formValues.delivery.id;
            } else {
                del = '';
            }
            if ($scope.formValues.name) {
                lab = $scope.formValues.name;
            } else {
                lab = 'Lab New';
            }
            $state.params.title = `${lab} - ${$scope.formValues.order.name} - DEL ${del}`;
        }
        if (name == 'Product' && $scope.formValues.product) {
            if (!$scope.formValues.isFromIntegration) {
                if (typeof $scope.temp != 'undefined') {
                    var filteredSpecGroup = $filter('filter')($scope.temp.products, { product: { id: $scope.formValues.product.id } })[0];
                    if (filteredSpecGroup) {
                        filteredSpecGroup = filteredSpecGroup.specGroup;
                    }
                    if (filteredSpecGroup) {
                        $scope.formValues.specGroup = filteredSpecGroup.name;
                    }
                }
                if (typeof $scope.formValues.labTestResults != 'undefined') {
                    for (let i = $scope.formValues.labTestResults.length - 1; i >= 0; i--) {
                        if ($scope.formValues.labTestResults[i].id != 0) {
                            $scope.formValues.labTestResults[i].isDeleted = true;
                        } else {
                            $scope.formValues.labTestResults.splice(i, 1);
                        }
                    }
                }
            }
            vm.setorderProdId();
            if (typeof vm.changed == 'undefined') {
                vm.changed = 0;
            }
            if (!$scope.formValues.order && !$scope.formValues.orderProductId) {
                return;
            }
            if (!$scope.formValues.isFromIntegration) {
                setTimeout(() => {
                    var data = {
                        orderId: $scope.formValues.order.id,
                        orderProductId: $scope.formValues.orderProductId,
                        deliveryProductId: $scope.formValues.deliveryProductId
                    };
                    console.log(data);
                    console.log($scope.formValues);
                    if (vm.changed > 0 && vm.entity_id > 0 || vm.changed >= 0 && vm.entity_id < 1) {
                        vm.getDataTable('spec', data, 'labTestResults');
                    }
                }, 100);
            }
            vm.changed++;
            vm.setPhysicalSupplier();
        }
    };
    vm.getDataTable = function (id, data, obj, idx, app, screen) {
        $scope.dynamicTable = [];
        if (!app) {
            app = vm.app_id;
        }
        if (!screen) {
            screen = vm.screen_id;
        }
        if (id) {
            id = id.toLowerCase();
            if ($scope.formValues.isFromIntegration) {
                return;
            }
            Factory_Master.getDataTable(app, screen, id, data, (callback) => {
                if (callback) {
                    $scope.dynamicTable[id] = callback;
                    if (obj == 'labTestResults') {
                        if (typeof $scope.formValues.labTestResults == 'undefined') {
                            $scope.formValues.labTestResults = [];
                            $scope.formValues.labTestResults = callback;
                        } else {
                            $.each(callback, (k, v) => {
                                $scope.formValues.labTestResults.push(callback[k]);
                            });
                        }
                        if ($scope.formValues.labTestResults && $scope.formValues.labTestResults.length) {
                            _.forEach($scope.formValues.labTestResults, function (object) {
                                object.specParameter.name = decodeHtmlEntity(_.unescape(object.specParameter.name));
                            });
                        }
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
    vm.getOptions = function (field) {
        // Move this somewhere nice and warm
        var objectByString = function (obj, string) {
            if (string.includes('.')) {
                return objectByString(obj[string.split('.', 1)], string.replace(`${string.split('.', 1)}.`, ''));
            }
            return obj[string];
        };
        if (!$scope.optionsCache) {
            $scope.optionsCache = {};
        }

        if (!(JSON.stringify($scope.optionsCache[field.Name]) == JSON.stringify(field))) {
            $scope.optionsCache[field.Name] = JSON.stringify(field);
            if (field.Filter && typeof $scope.formValues != 'undefined') {
                field.Filter.forEach((entry) => {
                    if (entry.ValueFrom == null) {
                        return;
                    }
                    let temp = 0;
                    try {
                        temp = _.get($scope, "formValues[" + entry.ValueFrom.split(".").join("][") + "]");
                    } catch (error) { }
                    entry.Value = temp;
                });
            }
            if (!$scope.options) {
                $scope.options = [];
            }
            Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, (callback) => {
                if (callback) {
                    $scope.options[field.Name] = [];
                    console.log('emptied options', $scope.options[field.Name]);
                    $scope.options[field.Name] = callback;
                    $scope.$watchGroup([$scope.formValues, $scope.options], () => {
                        vm.setPhysicalSupplier();
                        $timeout(() => {
                            var id;
                            if (field.Type == 'textUOM') {
                                id = `#${field.Name}`;
                            } else {
                                id = `#${field.masterSource}${field.Name}`;
                            }
                            if ($(id).data('val')) {
                                $(id).val($(id).data('val'));
                            }
                        }, 50);
                    });
                    if (field.Unique_ID == 'product') {
                        vm.setorderProdId();
                    }
                }
            });
        }
    };
    vm.setorderProdId = function () {
        $scope.formValues.orderProductId = null;
        $scope.formValues.deliveryProductId = null;
        if (!$scope.formValues.product) {
            return;
        }
        $.each($scope.options.Product, (k, v) => {
            if (v.name == $scope.formValues.product.name) {
                // console.log(v)
                if (v.payload) {
                    $scope.formValues.orderProductId = v.payload.orderProductId;
                    $scope.formValues.deliveryProductId = v.payload.deliveryProductId;
                }
            }
        });
    };

    vm.setPhysicalSupplier = function () {
        if (!$scope.formValues.product) {
            return;
        }
        $.each($scope.options.Product, (key, val) => {
            if (val.id == $scope.formValues.product.id) {
                if (val.physicalSupplier != null) {
                    $scope.formValues.physicalSupplier = val.physicalSupplier.name;
                }
            }
        });
    };
    vm.formFieldSearch = function (formFields, Unique_ID) {
        for (let key in formFields) {
            if (typeof formFields[key] == 'string') {
                if (key == 'Unique_ID' && formFields[key] == Unique_ID) {
                    return formFields;
                }
                continue;
            }
            let aux = vm.formFieldSearch(formFields[key], Unique_ID);
            if (aux) {
                return aux;
            }
        }
        return false;
    };
    // modal close
    $scope.prettyCloseModal = function () {
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
            // $(".modal-scrollable").css("display", "none")
        }, 500);
    };

    $scope.displayLabComparedResults = function () {
        if (!$scope.SelectedCheckbox || $scope.SelectedCheckbox.length < 2) {
            toastr.error('Please select 2 Lab results for comparison.');
            return;
        }
        let labResultIds = [];
        for (i = 0; i < $scope.SelectedCheckbox.length; i++) {
            labResultIds.push($scope.SelectedCheckbox[i].id);
        }
        let payload = {
            payload: labResultIds
        }
        $http.post(`${API.BASE_URL_DATA_LABS}/api/labs/GetLabTestResultsbyIds`, payload).then((response) => {
            if (response) {
                if (response.data) {
                    $scope.comparedLabResult = [];
                    $scope.compare_LabTestResultTestType = [];
                    $scope.compare_LabTestResultId = [];
                    $scope.comparableLabResults = [];
                    $scope.comparedLabResult = response.data.payload;
                    if ($scope.comparedLabResult.length > 0) {
                        var initArr = $scope.comparedLabResult[0].labTestResult.length == Math.max($scope.comparedLabResult[0].labTestResult.length, $scope.comparedLabResult[1].labTestResult.length) ?
                            $scope.comparedLabResult[0] : $scope.comparedLabResult[1];
                        for (let i = 0; i < initArr.labTestResult.length; i++) {
                            let firstLTR = {};
                            let secondLTR = {};
                            for (let j = 0; j < $scope.comparedLabResult[0].labTestResult.length; j++) {
                                if ($scope.comparedLabResult[0].labTestResult[i].specParameter.id == initArr.labTestResult[i].specParameter.id) {
                                    firstLTR = $scope.comparedLabResult[0].labTestResult[i];
                                    break;
                                }
                            }
                            for (let j = 0; j < $scope.comparedLabResult[1].labTestResult.length; j++) {
                                if ($scope.comparedLabResult[1].labTestResult[i].specParameter.id == initArr.labTestResult[i].specParameter.id) {
                                    secondLTR = $scope.comparedLabResult[1].labTestResult[i];
                                    break;
                                }
                            }

                            $scope.comparableLabResults.push({
                                'item_0_lrId': $scope.comparedLabResult[0].id,
                                'item_1_lrId': $scope.comparedLabResult[1].id,
                                'orderSpecParamName': initArr.labTestResult[i].specParameter.name,
                                'bdnValue': firstLTR?.bdnValue ?? secondLTR?.bdnValue,

                                'item_0_labs': firstLTR?.value,
                                'item_0_qualityMatch': firstLTR?.qualityMatch,

                                'item_1_labs': secondLTR?.value,
                                'item_1_qualityMatch': secondLTR?.qualityMatch
                            });
                        }

                        for (let i = 0; i < $scope.comparedLabResult.length; i++) {
                            if ($scope.compare_LabTestResultId != undefined && $scope.compare_LabTestResultId != null && $scope.compare_LabTestResultTestType != undefined && $scope.compare_LabTestResultTestType != null) {
                                $scope.compare_LabTestResultId.push($scope.comparedLabResult[i].labTestResult);
                            }
                            if ($scope.compare_LabTestResultTestType != undefined && $scope.compare_LabTestResultTestType != null) {
                                $scope.compare_LabTestResultTestType.push($scope.comparedLabResult[i].testType);
                            }
                        }
                        var tpl = $templateCache.get('app-labs/views/components/lab-result-comparison.html');
                        $scope.modalInstance = $uibModal.open({
                            template: tpl,
                            size: 'full',
                            appendTo: angular.element(document.getElementsByClassName('page-container')),
                            windowTopClass: 'fullWidthModal',
                            scope: $scope
                        });
                    }
                }
            } else {
                ctrl.hasAccess = false;
            }
        });
    }

    $scope.em = function (row, rowIdx) {
        let labCompareLimit = 2;
        if (row.isSelected) {
            if (!$scope.SelectedCheckbox || $scope.SelectedCheckbox.length == 0) {
                $scope.SelectedCheckbox = [];
                $scope.SelectedCheckbox_ProductMismatch = [];
                $scope.LabTestResultsForCompare = [];
                $scope.LabTestResultsForCompare.push({ "Id": row.id });
                $scope.SelectedCheckbox.push({ "id": row.id, "product": row.product });
            }
            else {
                if ($scope.SelectedCheckbox && $scope.SelectedCheckbox[0].product == row.product) {
                    if ($scope.SelectedCheckbox.length >= labCompareLimit) {
                        toastr.error('Please select a maximum of ' + labCompareLimit.toString() + ' Lab results for comparison.');
                        row.isSelected = false;
                        return;
                    }
                    else {
                        $scope.SelectedCheckbox.push({ "id": row.id, "product": row.product });
                    }
                }
                else {
                    toastr.error('Please select Lab result of same product for comparison.');
                    row.isSelected = false;
                    return;
                }
            }
        }
        else {
            if ($scope.SelectedCheckbox && $scope.SelectedCheckbox.length > 0) {
                for (i = 0; i < $scope.SelectedCheckbox.length; i++) {
                    if ($scope.SelectedCheckbox[i].id == row.id) {
                        $scope.SelectedCheckbox.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }

    $scope.labsActions = function (action) {
        if (action == 1) {
            $scope.verifyLab();
            return;
        }
        let id = $scope.formValues.id;
        let status = $scope.formValues.status;
        Factory_Master.labsActions(vm.app_id, vm.screen_id, id, action, status, (callback) => {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
            } else if (callback) {
                if (callback.message) {
                    toastr.error(callback.message);
                }
            }
        });
    };

    $scope.verifyLab = function () {
        data = angular.copy($scope.formValues);
        Factory_Master.verify_lab(data, (callback) => {
            if (callback.status == true) {
                $scope.loaded = true;
                if (!callback.message) {
                    toastr.success("Operation completed successfully");
                } else {
                    toastr.success(callback.message);
                }
                $state.reload();
            } else if (callback) {
                if (callback.message) {
                    toastr.error(callback.message);
                }
            }
        });
    };

    $scope.selectUniqueClaim = function (labClaimTypeSelection) {
        $scope.labResults_claimId = labClaimTypeSelection.id;
        $rootScope.selectedLabResults_claimId = labClaimTypeSelection.id;
    };
    $scope.raiseClaim = function (data) {
        // if (true) {
        if ($scope.labResults_claimId.length > 1 && !$rootScope.selectedLabResults_claimId) {
            $('.claimTypeSelectionModal').modal();
            $('.claimTypeSelectionModal').removeClass('hide fade');
            $('.claimTypeSelectionModal').css('transform', 'translateY(100px)');
            $scope.claimTypeSelectionModalOptions = [];
            var uniqueClaimTypes = _.uniq($scope.labResults_claimId);
            $.each($listsCache.ClaimType, (k, v) => {
                $.each(uniqueClaimTypes, (ck, cv) => {
                    if (v.id == cv) {
                        $scope.claimTypeSelectionModalOptions.push(v);
                    }
                });
            });
            return;
        }
        if ($scope.labResults_claimId.length != 1) {
            $scope.labResults_claimId = $rootScope.selectedLabResults_claimId;
        }


        if ($scope.labResults_claimId[0]) {
            $scope.labResults_claimId = $scope.labResults_claimId[0];
        }

        if (!data) {
            var data = {
                LabTestResultIds: $scope.labResults_specParamIds,
                DeliveryQualityParameterIds: [],
                DeliveryProductId: null,
                ClaimTypeId: $scope.labResults_claimId
            };
        }
        localStorage.setItem('raiseClaimFromLabsPayload', JSON.stringify(data));
        window.open('#/claims/claim/edit/', '_blank');
        // Factory_Master.raise_claim(data, function (response) {
        //     if (response) {
        //         if (response.status == true) {
        //             $scope.loaded = true;
        //             // toastr.success(response.message);
        //             $rootScope.transportData = response.data;
        //             console.log('-----', response.data);
        //             window.open('#/claims/claim/edit/', "_blank");
        //             // $location.path();
        //         } else {
        //             $scope.loaded = true;
        //             toastr.error(response.message);
        //         }
        //     }
        // })
    };

    $scope.invalidLab = function (data) {
        // console.log($scope.formValues.id);
        var data = {
            Payload: $scope.formValues.id
        };
        Factory_Master.invalid_lab(data, (response) => {
            if (response) {
                if (response.status == true) {
                    // console.log(response);
                    toastr.success('Lab status saved successfully.');
                    $timeout(() => {
                        $state.reload();
                    }, 2000);
                } else {
                    toastr.error('Lab Status could not be set to invalid.');
                }
            } else {
                toastr.error('Lab Status could not be set to invalid.');
            }
        });
    };

    $scope.initLabsPreviewEmail = function (id) {
        $rootScope.currentEmailTemplate = 38;
        var data = {
            Payload: {
                Filters: [{
                    ColumnName: 'LabResultId',
                    Value: id
                }, {
                    ColumnName: 'TemplateId',
                    Value: 38
                }, {
                    ColumnName: 'TemplateName',
                    Value: 'LabResultEmail'
                }]
            }
        };
        Factory_Master.labs_preview_email(data, (response) => {
            if (response) {
                if (response.status == true) {
                    if (response.data) {
                        if (response.data.comment) {
                            if (response.data.comment.emailTemplate) {
                                response.data.emailTemplateId = response.data.comment.emailTemplate.id;
                            }
                        }
                    }
                    $scope.$emit('previewEmail', response.data);
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        });
    };
    $scope.deleteRelatedLab = function (labId) {
        Factory_Master.deleteLab(labId, (callback) => {
            if (callback) {
                if (callback.status == true) {
                    toastr.success('Lab was deleted successfully');
                    for (let i = $scope.relatedLabs.length - 1; i >= 0; i--) {
                        var claim = $scope.relatedLabs[i];
                        if (claim.id == claimId) {
                            $scope.relatedLabs.splice(i, 1);
                        }
                    }
                    if (vm.entity_id == labId) {
                        $location.path(`/labs/labresult/edit/${vm.relatedLabs[0].id}`);
                    } else {
                        $state.reload();
                    }
                } else {
                    toastr.error(callback.errorMessage);
                }
            }
        });
    };

    // $scope.$on('reconMatchRecalculated', function(){
    //     console.log($scope.formValues.labTestResults);
    //     newReconMatch = _.reduce($scope.formValues.labTestResults, function(result, value, key){
    //         // console.log(value);
    //     });
    // })

    $scope.$watch(() => {
        return $scope.formValues.labTestResults;
    }, (oldVal, newVal) => {
        if (typeof $scope.formValues.labTestResults != 'undefined') {
            var newReconMatch = _.reduce($scope.formValues.labTestResults, (result, value, key) => {
                if (value != null && value.qualityMatch != null && typeof value.qualityMatch != 'undefined') {
                    if (value.qualityMatch.id == 1) {
                        result = result && true; // passed
                    } else {
                        result = result && false; // failed
                    }
                    return result;
                }
                return result;
            }, true);
            if ($scope.formValues.id) {
                $scope.reconMatchDisplayName(true, newReconMatch);
                $scope.setStatusForHeader(newReconMatch);
            }
            // console.log('newReconMatch', newReconMatch);
        }
    }, true);

    $('#Vessel').removeAttr('disabled').removeAttr('ng-disabled').attr('readonly', 'true');
    $scope.setPageTitle = function (lab, vessel) {
        // tab title
        let title = `Labs - ${lab} - ${vessel}`;
        $rootScope.$broadcast('$changePageTitle', {
            title: title
        });
    };

    $scope.formattedData = function (rowVal) {
        if (rowVal.bdnValue) {
            var array = '';
            var bdnValue = rowVal.bdnValue.split(',');
            for (var i = 0; i < bdnValue.length; i++) {
                array += bdnValue[i];
            }
            rowVal.bdnValue = array;
        }

        if (rowVal.value) {
            var array2 = '';
            var value = rowVal.value.split(',');
            for (var i = 0; i < value.length; i++) {
                array2 += value[i];
            }
            rowVal.value = array2;
        }


    }

    $scope.calculatePassedFailedInLab = function (rowVal) {
        var passedStatus = null;
        var failedStatus = null;
        $.each($listsCache.QualityMatch, (k, v) => {
            if (v.name == 'Passed') {
                passedStatus = v;
            }
            if (v.name == 'Failed') {
                failedStatus = v;
            }
        });
        var currentStatusResponse = null;
        if (rowVal.value != '') {
            if (rowVal.min != null && rowVal.max != null) {
                if (rowVal.value >= rowVal.min && rowVal.value <= rowVal.max) {
                    currentStatusResponse = passedStatus;
                } else {
                    currentStatusResponse = failedStatus;
                }
            } else {
                if (rowVal.min != null) {
                    if (rowVal.value >= rowVal.min) {
                        currentStatusResponse = passedStatus;
                    } else {
                        currentStatusResponse = failedStatus;
                    }
                }
                if (rowVal.max != null) {
                    if (rowVal.value <= rowVal.max) {
                        currentStatusResponse = passedStatus;
                    } else {
                        currentStatusResponse = failedStatus;
                    }
                }
            }
        }
        rowVal.qualityMatch = currentStatusResponse;
        if (currentStatusResponse != null) {
            console.log(currentStatusResponse.name);
        }
    };

    $scope.calculateQualityClaimType = function (rowData) {
        $scope.labResults_claimId = [];
        $scope.labResults_specParamIds = [];
        $scope.selectedClaimTypeIds = [];
        var currentChecksNo = 0;
        $.each($scope.formValues.labTestResults, (k, v) => {
            if (v.isSelected) {
                $.each(v.claimTypes, (k1, v1) => {
                    $scope.labResults_claimId.push(v1.id);
                });
                $scope.labResults_specParamIds.push(v.id);
            }
        });
        if ($scope.labResults_claimId.length > 0) {
            $.each($scope.formValues.labTestResults, (key, row) => {
                row.disableCheckbox = false;
                var isEnabled = false;
                $.each(row.claimTypes, (k, v) => {
                    if ($scope.labResults_claimId.indexOf(v.id) != -1) {
                        isEnabled = true;
                    }
                });
                row.disableCheckbox = !isEnabled;
            });
        } else {
            $.each($scope.formValues.labTestResults, (key, row) => {
                row.disableCheckbox = false;
            });
        }
    };

    $scope.isInSelectedClaimTypes = function (row) {
        if (!$scope.labResults_claimId) {
            return false;
        }
        return isEnabled;
    };

    $scope.$on('formValues', () => {
        // console.log($scope.formValues);
        if (vm.app_id == 'labs') {
            if ($scope.formValues.name) {
                // 1. if lab linked to delivery
                if ($scope.formValues.requestInfo) {
                    //  if order linked to delivery has a req, display req id
                    if ($scope.formValues.requestInfo) {
                        if ($scope.formValues.requestInfo.request) {
                            $scope.setPageTitle($scope.formValues.requestInfo.request.name, $scope.formValues.requestInfo.vesselName);
                            return;
                        }
                    }
                }

                // 2 if order linked to deleivery does not have a req, display order id
                if ($scope.formValues.order) {
                    $scope.setPageTitle($scope.formValues.order.name, $scope.formValues.vessel.name);
                    return;
                }


                // 3. else display lab name
                if ($scope.formValues.vessel) {
                    $scope.setPageTitle($scope.formValues.name, $scope.formValues.vessel.name);
                }
            }
        }
    });
}]);
