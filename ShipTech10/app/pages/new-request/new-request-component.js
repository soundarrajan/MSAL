angular.module('shiptech.pages').controller('NewRequestController', [
    '$rootScope',
    '$scope',
    '$q',
    '$listsCache',
    '$element',
    '$attrs',
    '$timeout',
    '$state',
    '$filter',
    '$stateParams',
    '$tenantSettings',
    'newRequestModel',
    'orderModel',
    'listsModel',
    'uiApiModel',
    'lookupModel',
    'groupOfRequestsModel',
    'screenActionsModel',
    'tenantService',
    'Factory_Master',
    'STATE',
    'LOOKUP_MAP',
    'LOOKUP_TYPE',
    'SCREEN_LAYOUTS',
    'SCREEN_ACTIONS',
    'IDS',
    'VALIDATION_MESSAGES',
    'STATUS',
    'PRODUCT_STATUS_IDS',
    'EMAIL_TRANSACTION',
    '$uibTooltip',
    'selectContractModel',
    '$uibModal',
    '$templateCache',
    '$compile',
    'emailModel',
    'statusColors',
    '$location',
    'screenLoader',
    'Factory_Admin',
	'$http',
	'API',
    function($rootScope, $scope, $q, $listsCache, $element, $attrs, $timeout, $state, $filter, $stateParams, $tenantSettings, newRequestModel, orderModel, listsModel, uiApiModel, lookupModel, groupOfRequestsModel, screenActionsModel, tenantService, Factory_Master, STATE, LOOKUP_MAP, LOOKUP_TYPE, SCREEN_LAYOUTS, SCREEN_ACTIONS, IDS, VALIDATION_MESSAGES, STATUS, PRODUCT_STATUS_IDS, EMAIL_TRANSACTION, $uibTooltip, selectContractModel, $uibModal, $templateCache, $compile, emailModel, statusColors, $location, screenLoader, Factory_Admin,$http, API) {
        let ctrl = this;

        let voyageId = $stateParams.voyageId;
        let requestId = $stateParams.requestId;
        ctrl.requestId = $stateParams.requestId;
        ctrl.showAllContracts = false;
        $scope.forms = {};
        $scope.etaDatevalid=false;
        ctrl.tableLength = {};
        $scope.portsModal = false;
        ctrl.isReadonlyForm = false;
        ctrl.canComplete = false;
        ctrl.SCREEN_ACTIONS = SCREEN_ACTIONS;
        ctrl.STATUS = {};
        ctrl.isNewRequest = true;
        ctrl.saved = false;
        ctrl.request = [];
        ctrl.request.locations = [];
        $scope.portCall = [];
        ctrl.lookupInput = null;
        ctrl.screenActions = null;
        ctrl.checkedProducts = [];
        ctrl.buttonsDisabled = false;
        ctrl.requirementsToAmend = null;
        ctrl.loadedTypeaheadPort = false;
        ctrl.buyer = null;
        ctrl.stateParams = $stateParams;
        ctrl.productIds = [];
        ctrl.tableEntries = 10;
        ctrl.listsCache = $listsCache;
        ctrl.lists = $listsCache;
        ctrl.tenantSettings = $tenantSettings;
        ctrl.RequestStatusesOrdered = [];
        ctrl.etaEnabled = [];
        ctrl.requiredQty = false;
        ctrl.options = [];
        ctrl.emailTransactionTypeId = 10;
        if ($stateParams.requestId) {
            $state.params.title = 'Edit Request';
        } else {
            $state.params.title = 'New Request';
            $rootScope.defaultSelectedBestContracts = [];

        }
   
        if (!ctrl.numberPrecision) {
        	ctrl.numberPrecision = {};
            ctrl.numberPrecision.quantityPrecision = 3;
            ctrl.numberPrecision.pricePrecision = 3;
            ctrl.numberPrecision.amountPrecision = 3;
        }

        $rootScope.$on('tenantConfiguration', (event, value) => {
            ctrl.numberPrecision = value.general.defaultValues;
            ctrl.requestTenantSettings = value.procurement.request;
        	ctrl.emailSettings = value.email;
            ctrl.showReport = value.report.tabConfigurations.length ? value.report.tabConfigurations[0].showReport : false;
        });

        // tenantService.tenantSettings.then(function(settings) {
        //     ctrl.numberPrecision = settings.payload.defaultValues;
        // });
        // tenantService.procurementSettings.then(function(settings) {
        //     ctrl.requestTenantSettings = settings.payload.request;
        // });
        // tenantService.emailSettings.then(function(settings){
        // 	ctrl.emailSettings = settings.payload;
        // })
        ctrl.previewEmailDisabled = false;

        screenLoader.showLoader();

        ctrl.disableAllFields = false;

        Factory_Master.get_master_entity(1, 'configuration', 'admin', (callback2) => {
            if (callback2) {
                $rootScope.adminConfiguration = callback2;
            }
        });

        /**
         * Perform initializations dependent upon the DOM being ready.
         */
        if (typeof $rootScope.cancelRequestMessage != 'undefined') {
            if ($rootScope.cancelRequestMessage) {
                toastr.info($rootScope.cancelRequestMessage, null, { timeOut: 15000 });
                $rootScope.cancelRequestMessage = null;
            }
        }

        $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
            // ctrl.contractHasProduct = false;
        });
        ctrl.hasAccess = false;
        ctrl.getData = function() {
            if (ctrl.showReport) {
                let payload = {
                    Payload: {}
                }
                $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/request/isAuthorizedForReportsTab`, payload).then((response) => {
                    if (response) {
                        if (response.data) {
                            ctrl.hasAccess = true;
                        }
                    } else {
                        ctrl.hasAccess = false;
                    }
                });
            }
        }
        ctrl.get_MIN_QUANTITY_TO_REACHData = function() {
            if (ctrl.showReport) {
                let payload = {
                    Payload: { ScreenType: 4}

                }
                $http.post(`${API.BASE_URL_DATA_INFRASTRUCTURE}/api/infrastructure/screenlayout/get`, payload).then((response) => {
                    if (response) {
                        if (response.data) {
                            $scope.best_contract = [];
                            $scope.best_contract = [];
                            ctrl.hasAccess = true;
                        }
                    } else {
                        ctrl.hasAccess = false;
                    }
                });
            }
        }

        ctrl.defaultProductsTooltip = function() {
            let ret = '';
            if (ctrl.selectedVessel && ctrl.selectedVessel.defaultDistillateProduct && ctrl.selectedVessel.distillateSpecGroup) {
                ret = ret + ctrl.selectedVessel.defaultDistillateProduct.name;
                ret = `${ret } - ${ ctrl.selectedVessel.distillateSpecGroup.name}`;
                ret = `${ret }<br>`;
            }
            if (ctrl.selectedVessel && ctrl.selectedVessel.defaultLsfoProduct && ctrl.selectedVessel.lsfoSpecGroup) {
                ret = ret + ctrl.selectedVessel.defaultLsfoProduct.name;
                ret = `${ret } - ${ ctrl.selectedVessel.lsfoSpecGroup.name}`;
                ret = `${ret }<br>`;
            }
            if (ctrl.selectedVessel && ctrl.selectedVessel.defaultFuelOilProduct && ctrl.selectedVessel.fuelOilSpecGroup) {
                ret = ret + ctrl.selectedVessel.defaultFuelOilProduct.name;
                ret = `${ret } - ${ ctrl.selectedVessel.fuelOilSpecGroup.name}`;
                ret = `${ret }<br>`;
            }

            return ret;
        };

        ctrl.serviceTooltip = function(from, serviceLocationIndex) {
            let hsfoValue;
            let dmaValue;
            let lsfoValue;
            let hsfoUom;
            let dmaUom;
            let lsfoUom;
            if (from === 'Vessel' && _.get(ctrl, 'request.vesselDetails.service.name')) {
                hsfoValue = _.get(ctrl, 'request.vesselDetails.service.hsfoValue');
                dmaValue = _.get(ctrl, 'request.vesselDetails.service.dmaValue');
                lsfoValue = _.get(ctrl, 'request.vesselDetails.service.lsfoValue');
                hsfoUom = _.get(ctrl, 'request.vesselDetails.service.hsfoUom');
                dmaUom = _.get(ctrl, 'request.vesselDetails.service.dmaUom');
                lsfoUom = _.get(ctrl, 'request.vesselDetails.service.lsfoUom');
            } else if (from === 'Port' && _.get(ctrl, `request.locations[${ serviceLocationIndex }].service.name`)) {
                hsfoValue = _.get(ctrl, `request.locations[${ serviceLocationIndex }].service.hsfoValue`);
                dmaValue = _.get(ctrl, `request.locations[${ serviceLocationIndex }].service.dmaValue`);
                lsfoValue = _.get(ctrl, `request.locations[${ serviceLocationIndex }].service.lsfoValue`);
                hsfoUom = _.get(ctrl, `request.locations[${ serviceLocationIndex }].service.hsfoUom`);
                dmaUom = _.get(ctrl, `request.locations[${ serviceLocationIndex }].service.dmaUom`);
                lsfoUom = _.get(ctrl, `request.locations[${ serviceLocationIndex }].service.lsfoUom`);
            } else {
                return;
            }
            let quantityPrecision = _.get(ctrl, 'numberPrecision.quantityPrecision') ? _.get(ctrl, 'numberPrecision.quantityPrecision') : 0;
            let ret = '';
            if (typeof hsfoValue != 'undefined') {
                ret = `${ret }HSFO : `;
                if (hsfoValue) {
                    ret = ret + String(parseFloat(hsfoValue).toFixed(quantityPrecision));
                    if (hsfoUom) {
                        ret = `${ret } ${ hsfoUom.name}`;
                    }
                } else {
                    ret = `${ret } - `;
                }
                ret = `${ret }<br>`;
            }
            if (typeof dmaValue != 'undefined') {
                ret = `${ret }MGO : `;
                if (dmaValue) {
                    ret = ret + String(parseFloat(dmaValue).toFixed(quantityPrecision));
                    if (dmaUom) {
                        ret = `${ret } ${ dmaUom.name}`;
                    }
                } else {
                    ret = `${ret } - `;
                }
                ret = `${ret }<br>`;
            }
            if (typeof lsfoValue != 'undefined') {
                ret = `${ret }ULSFO : `;
                if (lsfoValue) {
                    ret = ret + String(parseFloat(lsfoValue).toFixed(quantityPrecision));
                    if (lsfoUom) {
                        ret = `${ret } ${ lsfoUom.name}`;
                    }
                } else {
                    ret = `${ret } - `;
                }
                ret = `${ret }<br>`;
            }
            return ret;
        };

        var decodeHtmlEntity = function(str) {
            return str.replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec);
            });
        };
        ctrl.$onInit = function() {
            screenLoader.showLoader();
            ctrl.checkedProducts = [];
            ctrl.productIds = [];
            // Get the UI settings from server. When complete, get business data.
            uiApiModel
                .get(SCREEN_LAYOUTS.NEW_REQUEST)
                .then((data) => {
                    if ($stateParams.copyFrom) {
                        newRequestModel.getDefaultBuyer($stateParams.copyFrom.vesselId).then((data) => {
                            ctrl.disableAllFields = false;// fields enabled at copy
                            ctrl.request = angular.copy($stateParams.copyFrom);
                            ctrl.request.requestCompleted = false;// fields enabled at copy, send this to be
                            ctrl.request.hasBestContract = false;
                            ctrl.request = traverseObject(ctrl.request, nullifyId);
                            ctrl.request.requestStatus = null;
                            ctrl.request.requestDate = new Date().toJSON();
                            setTimeout(() => {
                            	if (ctrl.request.vesselDetails) {
	                                ctrl.robDetails = ctrl.request.vesselDetails.robDetails;
                            	}
                            }, 100);
                            for (let i = 0; i < ctrl.request.locations.length; i++) {
                                ctrl.request.locations[i].eta = '';
                                ctrl.request.locations[i].recentEta = '';
                                ctrl.request.locations[i].etb = '';
                                ctrl.request.locations[i].etd = '';
                                ctrl.request.locations[i].vesselVoyageDetailId = null;
                                ctrl.request.locations[i].vesselVoyageId = null;
                                ctrl.request.locations[i].buyer = data.payload;
                                ctrl.request.locations[i].agentCounterpartyFreeText = null;
                                ctrl.request.locations[i].deliveryFrom = null;
                                ctrl.request.locations[i].deliveryTo = null;
                                ctrl.request.locations[i].voyageCode = null;
                                ctrl.request.locations[i].portCallId = null;
                                ctrl.request.locations[i].destination = $stateParams.copyFrom.locations[i].destination;
                                ctrl.request.locations[i].destinationVesselVoyageDetailId = null;
                                ctrl.request.locations[i].destinationEta = null;
                                // ctrl.request.locations[i].destination = null;
                                ctrl.request.locations[i].requestId = null;
                                if(ctrl.request.locations[i].terminal){
                                    ctrl.request.locations[i].terminal.descriptions = ctrl.request.locations[i].terminal.name;
                                    ctrl.request.locations[i].terminal.terminalCode = ctrl.request.locations[i].terminal.code;
                                }
                                getTerminalLocations(LOOKUP_TYPE.LOCATIONS, ctrl.request.locations[i].location.id);
                                for (let j = 0; j < ctrl.request.locations[i].products.length; j++) {
                                	ctrl.request.locations[i].products[j].uniqueIdUI = Math.random().toString(36).substring(7);
                                    ctrl.request.locations[i].products[j].sellers = [];
                                    ctrl.request.locations[i].products[j].productStatus = null;
                                    ctrl.request.locations[i].products[j].workflowId = null;
                                    ctrl.request.locations[i].products[j].requestLocationId = null;
                                    ctrl.request.locations[i].products[j].contract = null;
                                    ctrl.request.locations[i].products[j].contractProductId = null;
                                    ctrl.request.locations[i].products[j].comments = null;
                                    // get cancel action
                                    var cancelAction = ctrl.getScreenActionByName(ctrl.SCREEN_ACTIONS.CANCEL);
                                    if (cancelAction != null) {
                                        if (ctrl.request.locations[i].products[j].screenActions == null || typeof ctrl.request.locations[i].products[j].screenActions == 'undefined') {
                                            // no actions defined, add cancel
                                            ctrl.request.locations[i].products[j].screenActions = [];
                                            ctrl.request.locations[i].products[j].screenActions.push(cancelAction);
                                        } else {
                                            // some actions defined, add cancel too if not there
                                            var found = _.find(ctrl.request.locations[i].products[j].screenActions, [ 'id', cancelAction.id ]);
                                            if (typeof found == 'undefined') {
                                                ctrl.request.locations[i].products[j].screenActions.push(cancelAction);
                                            }
                                        }
                                    }
                                }
                            }
                            ctrl.request.requestGroup = null;
                            addDefaultProducts();
                            if (typeof ctrl.request.vesselId != 'undefined') {
                                if (ctrl.request.vesselId != null) {
                                    ctrl.selectVessel(ctrl.request.vesselId);
                                }
                            }
                            ctrl.calculateScreenActions();
                            ctrl.isNewRequest = true;
                            $timeout(() => {
                                ctrl.isEnabledEta();
                            });
                        });
                    } else if (typeof voyageId != 'undefined' && voyageId !== null) {
                        newRequestModel.newRequest(voyageId).then((newRequestData) => {
                            ctrl.request = newRequestData.payload;

                            $.each(ctrl.request.locations, (i, j) => {

                                getTerminalLocations('locations',j.location.id);
                            });
                            setPageTitle();
                            setRequestStatusHeader();

                            $scope.productTypesLoadedPerLocation = {
                            	totalProducts : 0,
                            	loadedProducts : 0
                            };

                            for (let j = 0; j < ctrl.request.locations.length; j++) {
                                if (ctrl.requestTenantSettings.recentEta.id == 1 && ctrl.request.locations[j].eta && ctrl.request.locations[j].id) {
                                    if (!ctrl.request.locations[j].recentEta) {
                                        ctrl.request.locations[j].recentEta = ctrl.request.locations[j].eta;
                                    }
                                }

				                $scope.productTypesLoadedPerLocation.totalProducts += ctrl.request.locations[j].products.length;
                                for (let i = 0; i < ctrl.request.locations[j].products.length; i++) {
                                    var cancelAction = ctrl.getScreenActionByName(ctrl.SCREEN_ACTIONS.CANCEL);
                                    if (cancelAction != null) {
                                        if (ctrl.request.locations[j].products[i].screenActions == null || typeof ctrl.request.locations[j].products[i].screenActions == 'undefined') {
                                            // no actions defined, add cancel
                                            ctrl.request.locations[j].products[i].screenActions = [];
                                            ctrl.request.locations[j].products[i].screenActions.push(cancelAction);
                                            ctrl.request.locations[j].products[i].deliveryOption = angular.copy(ctrl.requestTenantSettings.defaultDeliveryOption);

                                            if(typeof ctrl.request.destination != 'undefined') {
                                                ctrl.request.destination[j].name = ctrl.request.destination[j].code;
                                            }
                                        } else {
                                            // some actions defined, add cancel too if not there
                                            var found = _.find(ctrl.request.locations[j].products[i].screenActions, [ 'id', cancelAction.id ]);
                                            if (typeof found == 'undefined') {
                                                ctrl.request.locations[j].products[i].screenActions.push(cancelAction);
                                            }
                                        }
                                    }

                                    ctrl.request.locations[j].products[i].uniqueIdUI = Math.random().toString(36).substring(7);
                                    if (ctrl.request.locations[j].products[i].product) {
                                        listsModel.getProductTypeByProduct(ctrl.request.locations[j].products[i].product.id, j, i).then((server_data) => {
                                            ctrl.request.locations[server_data.id].products[server_data.id2].productType = server_data.data.payload;
                                            if(ctrl.request.locations[server_data.id].products[server_data.id2].productType.name.includes('VLSFO')){
                                                ctrl.request.locations[server_data.id].products[server_data.id2].isPretestRequired = true;
                                            }

                                            $scope.productTypesLoadedPerLocation.loadedProducts += 1;
                                        });
                                    }
                                }
                            }
                            newRequestModel.getDefaultBuyer(ctrl.request.vesselId).then((buyer) => {
                                ctrl.buyer = buyer.payload;
                            });
                            addDefaultProducts();
                            ctrl.calculateScreenActions();
                            ctrl.isNewRequest = true;
                            if (ctrl.request.vesselDetails.vessel.id) {
                                ctrl.selectVessel(ctrl.request.vesselDetails.vessel.id);
                            }
                            $timeout(() => {
                                ctrl.isEnabledEta();
                            });
                            if (ctrl.request.id == 0) {
                                setTimeout(() => {
                                    ctrl.robDetails = ctrl.request.vesselDetails.robDetails;
                                }, 100);
                            }
                        });
                    } else if (typeof requestId != 'undefined' && requestId !== null) {
                        newRequestModel.getRequest(requestId).then((newRequestData) => {
                            ctrl.request = newRequestData.payload;
                            ctrl.getRequestinitialSnapshot = angular.copy(newRequestData.payload);
                            $.each(ctrl.request.locations, (i, j) => {
                                if(j.terminal != null && j.terminal.length != 0){
                                    j.terminal.descriptions = j.terminal.name;
                                    j.terminal.terminalCode = j.terminal.code;
                                }
                                getTerminalLocations('locations',j.location.id);
                            });
                            ctrl.request.footerSection.comments =  decodeHtmlEntity(_.unescape(ctrl.request.footerSection.comments));
                            ctrl.getOperationalReportParameters();
                            ctrl.disableAllFields = false;
                            if(typeof ctrl.request.requestCompleted != 'undefined') {
                                if(ctrl.request.requestCompleted != null) {
                                    ctrl.disableAllFields = ctrl.request.requestCompleted; // disable all fields if request is completed
                                }
                            }

                            setPageTitle();
                            setTimeout(() => {
                                ctrl.robDetails = ctrl.request.vesselDetails.robDetails;
                            }, 100);
                            setRequestStatusHeader();
                            uiApiModel.getListLayout('requestsContractList').then(
                                (data) => {
                                    if (data.payload) {
                                        ctrl.tableLength.layout = angular.fromJson(data.payload.layout);
                                        ctrl.tableLength.id = data.payload.id;
                                        ctrl.tableEntries = ctrl.tableLength.layout.layout;
                                        ctrl.initContractTable();
                                    } else {
                                        ctrl.initContractTable();
                                    }
                                    // console.log(data)
                                },
                                (reason) => {
                                    ctrl.initContractTable();
                                }
                            );
                            $scope.productTypesLoadedPerLocation = {
                            	totalProducts : 0,
                            	loadedProducts : 0
                            };
                            for (let j = 0; j < ctrl.request.locations.length; j++) {
                                if (ctrl.requestTenantSettings.recentEta.id == 1 && ctrl.request.locations[j].eta && ctrl.request.locations[j].id) {
                                    if (!ctrl.request.locations[j].recentEta) {

                                        ctrl.request.locations[j].recentEta = ctrl.request.locations[j].eta;
                                    }
                                }
	                            $scope.productTypesLoadedPerLocation.totalProducts += ctrl.request.locations[j].products.length;
                                for (let i = 0; i < ctrl.request.locations[j].products.length; i++) {
                                	ctrl.request.locations[j].products[i].uniqueIdUI = Math.random().toString(36).substring(7);
                                    ctrl.request.locations[j].products[i].comments =  decodeHtmlEntity(_.unescape(ctrl.request.locations[j].products[i].comments));
                                    if (ctrl.request.locations[j].products[i].product) {
                                    	// ctrl.request.locations[j].products[i].product.name = ctrl.request.locations[j].products[i].requestIndex + ' - ' + ctrl.request.locations[j].products[i].product.name;
                                    	if (ctrl.request.locations[j].products[i].productTypeId) {
                                    			ctrl.request.locations[j].products[i].productType = ctrl.getProductTypeObjById(ctrl.request.locations[j].products[i].productTypeId);
	                                        	$scope.productTypesLoadedPerLocation.loadedProducts += 1;
                                    	} else {
	                                        listsModel.getProductTypeByProduct(ctrl.request.locations[j].products[i].product.id, j, i).then((server_data) => {
	                                            ctrl.request.locations[server_data.id].products[server_data.id2].productType = server_data.data.payload;
	                                        	$scope.productTypesLoadedPerLocation.loadedProducts += 1;
	                                        });
                                    	}
                                    }
                                }
					            _.each(ctrl.request.locations[j].products, (value, key) => {
					                value.product.name = `${String(key + 1) } - ${ value.product.name}`;
					            });
                            }
                            // newRequestModel.getDefaultBuyer(ctrl.request.vesselId).then(function(buyer) {
                            //     ctrl.buyer = buyer.payload;
                            // });
                            addDefaultProducts();
                            ctrl.calculateScreenActions();
                            if (ctrl.request.vesselDetails.vessel.id) {
                                ctrl.selectVessel(ctrl.request.vesselDetails.vessel.id, true);
                            }
                            ctrl.isNewRequest = false;

                            // if (ctrl.request.requestStatus.id == ctrl.STATUS.STEMMED.id) ctrl.isReadonlyForm = true;
                            // if (ctrl.request.requestStatus.id == ctrl.STATUS.PARTIALLY_STEMMED.id) ctrl.canComplete = true;

                            ctrl.getCurrentProductsCurrentIds();
					        emailModel.getTemplates(ctrl.emailTransactionTypeId).then((data) => {
					            if (data.payload.length == 0) {
					                ctrl.previewEmailDisabled = true;
					            }
					        });
                            
                        });
                    } else {
                        newRequestModel.getEmptyRequest().then((newRequestData) => {
                            ctrl.request = newRequestData.payload;
                            ctrl.request.locations.length = 0;
                            addDefaultProducts();
                            ctrl.previewEmailDisabled = true;
                            ctrl.calculateScreenActions();
                            ctrl.isNewRequest = true;
                            $timeout(() => {
                                setPageTitle();
                            });
                        });
                    }

			        Factory_Admin.getAgreementTypeIndividualList(true, (response) => {
			        	ctrl.contractAgreementTypesList = response.payload.contractAgreementTypesList;
			        	ctrl.spotAgreementTypesList = response.payload.spotAgreementTypesList;
			        });

                    ctrl.ui = data.layout.children.edit;
                    if(ctrl.requestTenantSettings != undefined){

                        $.each(ctrl.ui.Locations.columns, (a, b) => {
                            if (b.name == 'PreTest') {
                                if(ctrl.requestTenantSettings.isRequestPreTestHidden != undefined && ctrl.requestTenantSettings.isRequestPreTestHidden == true){
                                    b.visible = false;
                                }
                                else
                                {
                                    b.visible = true;
                                }
                            }
                            if (b.name == 'expectedPrice') {
                                if(ctrl.requestTenantSettings.isRequestExpectedPriceHidden != undefined && ctrl.requestTenantSettings.isRequestExpectedPriceHidden == true){
                                    b.visible = false;
                                }
                                else
                                {
                                    b.visible = true;
                                }
                            }
                            if (b.name == 'SuggestedLift') {
                                if(ctrl.requestTenantSettings.isRequestSuggestedLiftHidden != undefined && ctrl.requestTenantSettings.isRequestSuggestedLiftHidden == true){
                                    b.visible = false;
                                }
                                else
                                {
                                    b.visible = true;
                                }
                            }
                            if (b.name == 'ProductCategory') {
                                if(ctrl.requestTenantSettings.isRequestProductCategoryHidden != undefined && ctrl.requestTenantSettings.isRequestProductCategoryHidden == true){
                                    b.visible = false;
                                }
                                else
                                {
                                    b.visible = true;
                                }
                            }

                        });

                    }
                    ctrl.screenActions = uiApiModel.getScreenActions();
                    $scope.formFieldsNew = data;
                    // Normalize relevant data for use in template.
                    ctrl.vesselDetailsFields = normalizeArrayToHash(ctrl.ui.vesselDetails.fields, 'name');
                    ctrl.productInfoFields = normalizeArrayToHash(ctrl.ui.Locations.fields, 'name');
                    ctrl.productInfoColumns = normalizeArrayToHash(ctrl.ui.Locations.columns, 'name');
                    $.each(ctrl.productInfoColumns, (k, v) => {
                        if (v.name == 'ProductType') {
                            if (ctrl.requestTenantSettings.productTypeInRequest.id == 2) {
                                delete ctrl.productInfoColumns[k];
                            }
                        }
                    });
                    ctrl.ui.Locations.columns = ctrl.productInfoColumns;
                    ctrl.footerSectionFields = normalizeArrayToHash(ctrl.ui.FooterSection.fields, 'name');
                    $timeout(() => {
                        ctrl.agentCounterpartyTypeId = [ IDS.AGENT_COUNTERPARTY_ID ];
                        initializeLookupInputs();
                    });
                    // listsModel.get().then(function(data) {
                    // });
                })
                .then((data) => {

                    initDataTables();
                    $timeout(() => {
                    });
                }).catch(
                    (error) => {
	                	console.error('Screen Layout Failed');
                    }
                );
        };

        $scope.$watch('productTypesLoadedPerLocation.loadedProducts', (obj) => {
        	if (obj) {
	        	if (obj == $scope.productTypesLoadedPerLocation.totalProducts) {
	        		for (let j = 0; j < ctrl.request.locations.length; j++) {
                        if (!ctrl.request.id) {
                            ctrl.request.locations[j].products = _.orderBy(ctrl.request.locations[j].products, [ 'productTypeId', 'product.name' ], [ 'asc', 'asc' ]);
                        }
                        for (let i = 0; i < ctrl.request.locations[j].products.length; i++) {
                            ctrl.request.locations[j].products[i].name = `${String(i + 1) } - ${ ctrl.request.locations[j].products[i].name}`;
                                listsModel.getSpecGroupByProductAndVessel(ctrl.request.locations[j].products[i].product.id, ctrl.request.vesselDetails.vessel.id, j, i).then((server_data) => {
                                    ctrl.request.locations[server_data.id].products[server_data.id2].specGroups = server_data.data.payload;
                                    let isInList = false;
                                    $.each(ctrl.request.locations[server_data.id].products[server_data.id2].specGroups, (k, v) => {
                                        if (v.isDefault && !ctrl.request.locations[server_data.id].products[server_data.id2].specGroup && !ctrl.request.locations[server_data.id].products[server_data.id2].id) {
                                            ctrl.request.locations[server_data.id].products[server_data.id2].specGroup = v;
                                        }
                                    	if (ctrl.request.locations[server_data.id].products[server_data.id2].specGroup) {
	                                        if (v.id == ctrl.request.locations[server_data.id].products[server_data.id2].specGroup.id) {
	                                            isInList = true;
	                                        }
                                    	}
                                    });
                                    if (!isInList) {
                                    	ctrl.request.locations[server_data.id].products[server_data.id2].specGroup.isDeleted = true;
                                        ctrl.request.locations[server_data.id].products[server_data.id2].specGroups.push(ctrl.request.locations[server_data.id].products[server_data.id2].specGroup);
                                    }
                                });
                        }
                    }
	        	}
        	}
        });

        ctrl.getCurrentProductsCurrentIds = function() {
            ctrl.productsContractIds = [];
            var addedProductRequestIds = [];
            $.each(ctrl.request.locations, (lk, lv) => {
                $.each(lv.products, (pk, pv) => {
                    if (addedProductRequestIds.indexOf(pv.id) == -1) {
                        if (pv.contract) {
	                        if (pv.contract.contract) {
	                            var obj = {
	                                contractId: pv.contract.contract.id,
	                                requestProductId: pv.id
	                            };
	                            addedProductRequestIds.push(pv.id);
	                            ctrl.productsContractIds.push(obj);
	                        }
                        }
                    }
                });
            });
            $scope.$broadcast('productsContractIds', ctrl.productsContractIds);
        };

        function initDataTables() {
            ProductInfoDatatable.init({
                selector: '[id^="product_info_table_"]'
            });
        }

        /** ***************************************************************************************************/
        /* "REQUEST COPY" FUNCTIONALITY.
        /*****************************************************************************************************/
        /**
         * Reset certain location data in preparation for the request copy process.
         * @param {Object} request - A request object (normally it's the DTO provided by the server).
         * @returns {Object} - The modified input request.
         */
        function resetLocations(request) {}

        /**
         * Nullifies an object's "id" property, if it has one.
         * @parma {Object} - The source object.
         * @param {Object} - The object with its id property nullified.
         */
        function nullifyId(obj, property) {
            if (!isNullifiableObject(obj) || !obj.hasOwnProperty('id')) {
                return obj;
            }
            if (!isNullifiableObject(obj)) {
                console.log(property);
            }
            // if (property == "service") {
            //  console.log("service", obj.id);
            //     return obj;
            // }
            obj.id = null;
            return obj;
        }

        /**
         * Checks if an object is "nullifiable", i.e. its "id" property can be safely nullified.
         * The check condition is flexible, can be anything. Currently, we check for the "collectionName"
         * property absence in the object.
         * @param {Object} obj - The source object.
         * @returns {Boolean} - True if the object's ID may be set to null, false otherwise.
         */
        function isNullifiableObject(obj) {
            let definingProperty = 'collectionName';
            return !obj.hasOwnProperty(definingProperty);
        }

        /**
         * Iterate an object recursively and fire a callback for each child object.
         * @oaram {Object} obj - The object to traverse.
         * @param {Function} callback - A callback function to call for each child object.
         * @returns {Object} - The resulting object, after the callback function was applied to all its children.
         */
        function traverseObject(obj, callback) {
            for (let property in obj) {
                if (property == 'service') {
                    continue;
                }
                if (obj.hasOwnProperty(property)) {
                    if (typeof obj[property] === 'object') {
                        obj = callback(obj, property);
                        traverseObject(obj[property], callback);
                    } else {
                        // console.log(property + "   " + obj[property]);
                    }
                }
            }
            return obj;
        }

        /** ***************************************************************************************************/
        /* END "REQUEST COPY" FUNCTIONALITY.
        /*****************************************************************************************************/
        ctrl.goSpot = function(verifyContracts) {
            var validActiveSpecGroupMessage = ctrl.checkInactiveSpecGroup();
            if (validActiveSpecGroupMessage != true) {
                toastr.error(validActiveSpecGroupMessage);
                return;
            }
            if (verifyContracts) {
                var contractExistsForSelection = false;
                ctrl.existingContractLocations = [];
                $.each(ctrl.bestContractsList, (k, v) => {
                    if (ctrl.checkedProducts[v.requestProductId] == true) {
                        contractExistsForSelection = true;
                        ctrl.existingContractLocations.push(v.requestProductLocationName);
                    }
                });
                ctrl.existingContractLocations = ctrl.existingContractLocations.join(', ');
                if (contractExistsForSelection) {
                    var tpl = $templateCache.get('pages/new-request/views/goSpotActionPopup.html');
                    // tpl = $templateCache.get('app-general-components/views/modal_sellerrating.html');
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        size: 'full',
                        appendTo: angular.element(document.getElementsByClassName('page-container')),
                        windowTopClass: 'fullWidthModal autoWidthModal',
                        scope: $scope
                    });
                    return;
                }
            }
            ctrl.buttonsDisabled = true;
            if (ctrl.request.requestGroup !== null) {
                screenLoader.showLoader();
                $state.go(STATE.GROUP_OF_REQUESTS, {
                    groupId: ctrl.request.requestGroup.id
                });
            } else {
                screenLoader.showLoader();
                groupOfRequestsModel.groupRequests([ ctrl.request.id ]).then(
                    (data) => {
                        ctrl.buttonsDisabled = false;
                        var requestGroup = data.payload;
                        $state.go(STATE.GROUP_OF_REQUESTS, {
                            // group: requestGroup,
                            groupId: requestGroup[0].requestGroup.id
                        });
                    },
                    () => {
                        ctrl.buttonsDisabled = false;
                    }
                ).finally(() => {
                    screenLoader.hideLoader();
                });
            }
        };

        ctrl.goEmail = function() {
            // screenLoader.showLoader();
            if (ctrl.request.id) {
                // $state.go(STATE.PREVIEW_EMAIL, {

                // });
                let previewEmailData = {
                    data: {
                        requestId: ctrl.request.id,
                        requestStatus: ctrl.request.requestStatus
                    },
                    transaction: EMAIL_TRANSACTION.REQUEST
                };
                let isPreviewButton = {
                    data: {
                        isPreview: true
                    }
                }

                localStorage.setItem('previewEmailData', JSON.stringify(previewEmailData));
                $rootScope.isPreview = true;

                let url = $state.href(STATE.PREVIEW_EMAIL);
                // $window.open(url, '_blank');

                $location.path(url.replace('#', ''));
                // window.open($location.$$absUrl.replace($location.$$path, url), '_blank');
            }
        };

        ctrl.goContract = function() {
            $state.go(STATE.SELECT_CONTRACT, {
                requestId: ctrl.request.id
            });
        };


        ctrl.completeRequest = function() {
            ctrl.buttonsDisabled = true;
            newRequestModel.completeRequest(ctrl.request.id).then(
                (responseData) => {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                },
                () => {
                    ctrl.buttonsDisabled = false;
                }
            );
        };

        ctrl.removeClientSideCodeInjection = function(comments) {
            let value = comments, newValue, finalValue = '', removeValue, nr = 0;
            let hasClientSideCodeInjection = true;
            while(hasClientSideCodeInjection) {
                removeValue = '';
                if (value && value.split('<script>')) {
                    newValue = value.split('<script>');
                }
                if (newValue && newValue[1] && newValue[1].split('</script>')) {
                    removeValue = '<script>' + newValue[1].split('</script>')[0] + '</script>';
                }
                value = value.replace(removeValue, '');
                if (value.split('<script>').length == 1) {
                    hasClientSideCodeInjection = false;
                }
            }
            return value;
        };

        ctrl.validateMinMaxQuantity = function(min, max) {
            if(typeof min == 'string') {
                min = parseFloat(min);
            }
            if(typeof max == 'string') {
                max = parseFloat(max);
            }
            var response = {
                minQuantity: min,
                maxQuantity: max
            };
            if (isNaN(min)) {
                min = null;
            }
            if (isNaN(max)) {
                max = null;
            }
            if (min && min > max) {
                response.maxQuantity = null;
            }
            if (max && min > max) {
                response.minQuantity = null;
            }
            if (min && max && min > max) {
                toastr.warning('Min Quantity can\'t be greater than Max Quantity');
            }
            return response;
        };



        ctrl.saveRequest = function() {
            ctrl.request.requestNotes = $rootScope.notes;
            ctrl.buttonsDisabled = true;
            var valid;
            var validMQTR;
            if(ctrl.request.operatorBy && ctrl.request.operatorBy.name == '') //operator field empty
            {
                ctrl.request.operatorBy = null;  
            }
            ctrl.isRequiredMinMax(false);
            if (ctrl.request.requestStatus) {
                if (ctrl.request.requestStatus.name == "Validated" || !ctrl.requestTenantSettings.isPrerequestEnabled) {
                    valid = ctrl.checkValidQuantities();
                    validMQTR= ctrl.checkValidMQTRs();
                    ctrl.isRequiredMinMax(true);
                }
            } else {
                ctrl.isRequiredMinMax();
            }
            ctrl.isSpecGroupIsRequired();

            if (ctrl.showVesselExpiryWarningMessage && !ctrl.request.id) {
            	toastr.warning(ctrl.showVesselExpiryWarningMessage);
            }

            $timeout(() => {
                $('form').addClass('submitted');
                ctrl.saved = true;
                let forms_validation = validateForms();
                if (forms_validation !== null) {
                    toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(', '));
                    ctrl.buttonsDisabled = false;
                    // ctrl.initMask(); // reinit mask for date inputs
                }
                if(validMQTR!=='' && validMQTR!==undefined){
                    toastr.error(validMQTR );
                    ctrl.buttonsDisabled = false;
                    return false;
                }
                let invalidDates = false;
                $.each(ctrl.requestDateFieldsErrors, (k, v) => {
                    if (v) {
                        invalidDates = true;
                        toastr.error(v);
                        ctrl.buttonsDisabled = false;
                    }
                });

                /*
                var invalidDates = [];
                $('.new-date-picker').each(function(key, value) {
                    if ($(this).hasClass('invalid')) {
                        invalidDates.push($(this).attr('name').split('_')[1].toUpperCase());
                    }
                });
                if (invalidDates.length > 0) {
                    toastr.error('Please check the date fields: ' + invalidDates.join(', '));
                    return false;
                }
                */
                if (forms_validation !== null || invalidDates) {
                    ctrl.buttonsDisabled = false;
                    return;
                }
                // remove empty products
                for (let i = ctrl.request.locations.length - 1; i >= 0; i--) {
                    if (ctrl.request.locations[i].isDeleted) {
                        ctrl.request.locations.splice(i, 1);
                    } else {
                        // products
                        for (let j = ctrl.request.locations[i].products.length - 1; j >= 0; j--) {
                            if (ctrl.request.locations[i].products[j].product === null || ctrl.request.locations[i].products[j].isDeleted) {
                                ctrl.request.locations[i].products.splice(j, 1);
                            }
                        }
                        // if agent == {} se null
                        if (_.isEmpty(ctrl.request.locations[i].agent)) {
                            ctrl.request.locations[i].agent = null;
                        }
                    }
                }
                if (ctrl.request.footerSection) {
	                ctrl.request.footerSection.isPrerequest = ctrl.requestTenantSettings.isPrerequestEnabled;
                }
                if (ctrl.isNewRequest) {
                    var validActiveSpecGroupMessage = ctrl.checkInactiveSpecGroup();
                    if (validActiveSpecGroupMessage != true) {
                        toastr.error(validActiveSpecGroupMessage);
                        ctrl.buttonsDisabled = false;
                        return;
                    }
                    screenLoader.showLoader();

                    newRequestModel.createRequest(ctrl.request).then(
                        (responseData) => {
                            ctrl.buttonsDisabled = false;
                            $state.go(STATE.EDIT_REQUEST, {
                                requestId: responseData.payload.id
                            });
                        },
                        () => {
                            ctrl.buttonsDisabled = false;
                        }
                    ).finally(() => {
                        screenLoader.hideLoader();
                        ctrl.buttonsDisabled = false;
                    });
                } else {

                    var validActiveSpecGroupMessage = ctrl.checkInactiveSpecGroup();
                    if (validActiveSpecGroupMessage != true) {
                        toastr.error(validActiveSpecGroupMessage);
                        ctrl.buttonsDisabled = false;
                        return;
                    }
                    ctrl.prepareReasonsForSave();
                    screenLoader.showLoader();
                    //Map port call id and voyageId, vesselVoyageDetailId with request payload locations->portCallId,vesselVoyageId
                    // let selectedPortCall = ctrl.request.portCall;
                    let selectedPortCall = (angular.isArray($scope.portCall))? $scope.portCall: [$scope.portCall];
                    let PayloadLocations = ctrl.request.locations;
                    PayloadLocations.map((location, index)=>{
                        let selectedPortCallObj = selectedPortCall.find(portCallItem=>portCallItem?.locationId == location?.locationId);
                        location.portCallId = selectedPortCallObj?.locationId;
                        location.vesselVoyageId = selectedPortCallObj?.voyageId;
                        location.vesselVoyageDetailId = selectedPortCallObj?.vesselVoyageDetailId;
                        return true;
                    });
                    newRequestModel.updateRequest(ctrl.request).then(
                        (responseData) => {
                            let data = responseData.payload;
                            ctrl.buttonsDisabled = false;
                            if (data.requirementsToAmend !== null && data.requirementsToAmend.length > 0) {
                                ctrl.requirementsToAmend = data.requirementsToAmend;
                                $('amend-dialog').modal('show');
                            } else {
                                ctrl.requirementsToAmend = null;
                            }
                            screenLoader.hideLoader();
                            $state.reload();
                        },
                        () => {
                            ctrl.buttonsDisabled = false;
                        }
                    ).finally(() => {
                        ctrl.buttonsDisabled = false;
                    });
                }
            });
        };


        ctrl.showDeleteLocationConfirm = function(location) {
            ctrl.entityToDelete = 'location';
            ctrl.deleteDataParams = {
                location: location
            };
            // $(".confirmModal").modal();
        };

        ctrl.showCanBeCancelledLocationConfirm = function(locationId, message) {
            ctrl.entityToDelete = 'canBeCanceledLocation';
            ctrl.deleteDataParams = {
                locationId: locationId,
                confirmText: message
            };
        };
        ctrl.canBeCancelledLocation = function(locationId, payload) {
            if(!ctrl.reasonProvidedForCancellation && ctrl.selectedVessel.isVesselManagable) {
                locationIndex = null;
                $.each(ctrl.request.locations, (k,v) => {
                    if (v.id == locationId) {
                        locationIndex = k;
                    }
                })
                ctrl.captureReasonModal(locationIndex, null, "REQUEST_LOCATION_CANCEL", "locationCancel");
            } else {
                ctrl.reasonProvidedForCancellation = false;
                if(!payload) {
                    payload = {};
                    payload.id = locationId
                    payload.reason = null;                    
                } else {
                    payload.id = locationId
                }
                newRequestModel.cancelLocation(payload).then((data) => {
                    if (data.message) {
                        toastr.info(data.message, null, { timeOut: 15000 });
                    }
                    // for (var i = 0; i < location.products.length; i++) {
                    //     location.products[i].productStatus = ctrl.STATUS['Cancelled'];
                    // }
                    $state.reload();
                });

            }
        };
        ctrl.deleteLocation = function(location) {
            // ctrl.confirmLocationDelete = confirm("Are you sure you want to delete " + location.location.name);
            // if (ctrl.confirmLocationDelete) {
            if (location.id) {
                if (!ctrl.checkProductsActionForCancelLocation(location)) {
                    return;
                }
                var canBeCancelledPayload = {
                    Filters: [
                        {
                            ColumnName: 'RequestLocationId',
                            Value: location.id
                        },
                        {
                            ColumnName: 'RequestName',
                            Value: ctrl.request.name
                        },
                        {
                            ColumnName: 'RequestLocationName',
                            Value: location.location.name
                        }
                    ]
                };
                newRequestModel.canBeCancelled(canBeCancelledPayload).then((data) => {
                    if (data.payload) {
                        ctrl.showCanBeCancelledLocationConfirm(location.id, data.payload);
                    } else {
                        newRequestModel.cancelLocation(location.id).then((data) => {
                            if (data.message) {
                                toastr.info(data.message, null, { timeOut: 15000 });
                            }
                            for (let i = 0; i < location.products.length; i++) {
                                location.products[i].productStatus = ctrl.STATUS.Cancelled;
                                $state.reload();
                                // ctrl.deleteProductFromLocation(location.products[i], location);
                            }
                        });
                    }
                });
            } else {
                location.isDeleted = true;
                for (let i = 0; i < location.products.length; i++) {
                    location.products[i].isDeleted = true;
                }
            }
            // }
        };
        ctrl.addEmptyProduct = function(products, addCancel, locationIdx) {
            let agreementType = tenantService.getAgreementType();
            let uomSelection = tenantService.getUom();
            var product = {
                product: null,
                uniqueIdUI: Math.random()
                    .toString(36)
                    .substring(7),
                productStatus: null,
                workflowId: null,
                specGroup: null,
                productType: null,
                productCategory: null,
                specGroups: [],
                deliveryOption: angular.copy(ctrl.requestTenantSettings.defaultDeliveryOption),
                robOnArrival: null,
                minQuantity: null,
                maxQuantity: null,
                uom: angular.copy(uomSelection),
                agreementType: angular.copy(agreementType),
                pricingType: null,
                buyerComments: null,
                sellers: null,
                possibleActions: null,
                contract: null,
                id: null,
                isDeleted: false,
                screenActions: []
            };
            // add cancel action to new product
            if (addCancel) {
                // addCancel is true when function called directly from + sign in grid
                var cancelAction = ctrl.getScreenActionByName(ctrl.SCREEN_ACTIONS.CANCEL);
                if (cancelAction != null) {
                    product.screenActions.push(cancelAction);
                }
            }
            if(locationIdx !== null) {
                product.isNew = true;
            }
            products.push(product);
            ctrl.captureReasonModal(locationIdx,products.length-1,"REQUEST_PRODUCT", "product");
            // clear product selection
            ctrl.checkedProducts = [];
        };
        ctrl.addProductAndSpecGroupToList = function(product, specGroup, productTypeId, productList, extraInfo) {
            ctrl.addEmptyProduct(productList);
            let newProduct = productList[productList.length - 1];
        	if (extraInfo) {
        		if (extraInfo.vesselVoyageDetailId) {
		            newProduct.vesselVoyageDetailId = extraInfo.vesselVoyageDetailId;
                    newRequestModel.getBunkerPlansForVesselVoyageDetailId(extraInfo.vesselVoyageDetailId).then((response) => {
                        if (response.payload) {
                            $.each(response.payload, (k, v) => {
                                if (v.productTypeDto.id == newProduct.productType.id) {
                                    if (v.supplyQuantity != 0) {
                                        newProduct.minQuantity = v.supplyQuantity;
                                        newProduct.maxQuantity = v.supplyQuantity;
                                    }
                                    newProduct.uom = v.supplyUom;
                                }
                            });
                        }
		            });
        		}
        	}
            newProduct.product = product;
            newProduct.defaultProduct = angular.copy(product);
            newProduct.screenActions = [];
            newProduct.productType = angular.copy(ctrl.getProductTypeObjById(productTypeId));
            if(newProduct.productType != null && newProduct.productType.name != null){


                if(newProduct.productType.name.includes('VLSFO')){
                    newProduct.isPretestRequired = true;
                }
                else{
                    newProduct.isPretestRequired = false;
                }
            }

            cancelAction = ctrl.getScreenActionByName(ctrl.SCREEN_ACTIONS.CANCEL);
            if (cancelAction != null) {
                newProduct.screenActions.push(cancelAction);
            }
            listsModel.getSpecGroupByProductAndVessel(product.id, ctrl.request.vesselDetails.vessel.id).then((server_data) => {
                newProduct.specGroups = server_data.data.payload;
            	$.each(newProduct.specGroups, (k, v) => {
	            	if (v.isDefault) {
			            newProduct.specGroup = v;
	            	}
            	});
                let payload = { Payload: product.id };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                    if (response.data.payload != 'null') {
                        let productTypeGroup  = response.data.payload.productTypeGroup;
                        let sludgeProductTypeGroup = _.find(ctrl.listsCache.ProductTypeGroup, { name : 'Sludge' });
                        let payload1 = { Payload: {} };
                        $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload1).then((response) => {
                            if (response.data.payload != 'null') {
                               let defaultUomAndCompany = _.find(response.data.payload, function(object) {
                                    return object.id == productTypeGroup.id;
                               });
                               if (defaultUomAndCompany) {
                                    newProduct.robOnArrivalUom = defaultUomAndCompany.defaultUom;
                                    newProduct.uom = defaultUomAndCompany.defaultUom;
                                    newProduct.roundVoyageConsumptionUom = defaultUomAndCompany.defaultUom;
                               }

                            }
                        });
                    }
                });
            });

        };

        ctrl.getProductTypeObjById = function(id) {
            let prodType = _.filter(ctrl.listsCache.ProductType, [ 'id', id ]);
            if (prodType.length > 0) {
                if (typeof prodType[0] != 'undefined') {
                    return prodType[0];
                }
            }
            return null;
        };
        ctrl.getSpecGroups = function(product) {
            listsModel.getSpecGroupByProductAndVessel(product.product.id, ctrl.request.vesselDetails.vessel.id).then((server_data) => {
                product.specGroups = server_data.data.payload;
                let isInList = false;
            	$.each(product.specGroups, (k, v) => {
	            	if (v.isDefault) {
		                isInList = true;
		                product.specGroup = v;
	            	}
            	});
            	if (!isInList) {
		            product.specGroup = null;
            	}
            });
        };
        ctrl.getProductType = function(product) {
            listsModel.getProductTypeByProduct(product.id).then((server_data) => {
                product.productType = server_data.data.payload;
            });
        };
        ctrl.getScreenActionByName = function(name) {
            var action = null;
            $.each(ctrl.listsCache.ScreenAction, (key, val) => {
                if (val.name == name) {
                    action = val;
                }
            });
            return action;
        };

        /**
         * Mark product as deleted
         */

        ctrl.showDeleteProductFromLocationConfirm = function(product, location, pIndex, locIndex) {
            if (!product.id) {
                $.each(location.products, (k, v) => {
                	if (v) {
	                    if (v.uniqueIdUI == product.uniqueIdUI) {
	                        ctrl.request.locations[locIndex].products.splice(k, 1);
	                    }
                	}
                });
                return;
            }
            ctrl.entityToDelete = 'product';
            ctrl.deleteDataParams = {
                product: product,
                location: location,
                pIndex: pIndex,
                locIndex: locIndex
            };
            $('.confirmModal').modal();
        };
        ctrl.showCanBeCancelledProductFromLocationConfirm = function(location, productId, message) {
            ctrl.entityToDelete = 'canBeCanceledProduct';
            ctrl.deleteDataParams = {
                location: location,
                productId: productId,
                confirmText: message
            };
            // $(".confirmModal").modal();
        };
        ctrl.canBeCancelledProductFromLocation = function(location, productId, payload) {
            if(!ctrl.reasonProvidedForCancellation && ctrl.selectedVessel.isVesselManagable) {
                locationIndex = null;
                productIndex = null;
                $.each(ctrl.request.locations, (k,v) => {
                    if (v.id == location.id) {
                        locationIndex = k;
                        $.each(v.products, (k2,v2) => {
                            if (v2.id == productId) {
                                productIndex = k2;
                            }
                        })
                    }
                })
                ctrl.captureReasonModal(locationIndex, productIndex, "REQUEST_PRODUCT_CANCEL", "productCancel");
            } else {
                ctrl.reasonProvidedForCancellation = false;
                if(!payload) {
                    payload = {};
                    payload.id = productId;
                    payload.reason = null;
                } else {
                    payload.id = productId
                }
                newRequestModel.cancelProduct(payload).then((data) => {
                    $state.reload();
                    for (var i = 0; i < location.products.length; i++) {
                        if (location.products[i].id == productId) {
                            location.products[i].productStatus = ctrl.STATUS.Cancelled;
                        }
                    }
                    // product.productStatus = ctrl.STATUS['Cancelled'];
                    let existingProductNr = 0;
                    for (var i = 0; i < location.products.length; i++) {
                        if (location.products[i].isDeleted === false) {
                            existingProductNr++;
                        }
                    }
                    if (existingProductNr <= 1) {
                        ctrl.addEmptyProduct(location.products);
                    }
                    ctrl.checkboxes = [];
                    ctrl.selectedContracts = [];
                });
            }
        };
        ctrl.deleteProductFromLocation = function(product, location, pIndex, locIndex) {
            // ctrl.confirmProductDelete = confirm("Are you sure you want to delete "+product.product.name+ " from " + location.location.name);
            // if (ctrl.confirmProductDelete) {
            if (product.product !== null) {
                if (product.id) {
                    var canBeCancelledPayload = {
                        Filters: [
                            {
                                ColumnName: 'RequestProductId',
                                Value: product.id
                            },
                            {
                                ColumnName: 'RequestName',
                                Value: ctrl.request.name
                            },
                            {
                                ColumnName: 'RequestProductName',
                                Value: product.product.name
                            }
                        ]
                    };
                    newRequestModel.canBeCancelled(canBeCancelledPayload).then((data) => {
                        if (data.payload) {
                            ctrl.showCanBeCancelledProductFromLocationConfirm(location, product.id, data.payload);
                        } else {
                        	var message = `Are you sure you want to delete ${ product.product.name } from ${ location.location.name }?`;
                            ctrl.showCanBeCancelledProductFromLocationConfirm(location, product.id, message);
                            // newRequestModel.cancelProduct(product.id).then(function(data) {
                            //     $state.reload();
                            //     if (data.message) {
                            //         toastr.info(data.message, null, { timeOut: 15000 });
                            //     }
                            //     product.productStatus = ctrl.STATUS["Cancelled"];
                            //     ctrl.checkboxes = [];
                            //     ctrl.selectedContracts = [];
                            // });
                        }
                    });
                } else {
                    // if location is not saved (product doesn't have an id) -> delete row
                    ctrl.request.locations[locIndex].products.splice(pIndex, 1);
                    if (ctrl.request.locations[locIndex].products.length == 0) {
                        if (!location.id) {
                            ctrl.deleteLocation(location);
                        }
                    }
                }
            } else {
                product.isDeleted = true;
            }
            // }
        };

        /**
         * check if we should show extra buttons
         */
        ctrl.extraButtons = function() {
            return $('.st-extra-buttons').find('li').length === 0;
        };
        // retrieve invalid fields from a form
        function getInvalidFields(form) {
            let fields = [];
            let fieldName;
            for (let errorName in form.$error) {
                for (let i = 0; i < form.$error[errorName].length; i++) {
                    fieldName = form.$error[errorName][i].$name;
                    if (fields.indexOf(fieldName) === -1) {
                        fields.push(fieldName);
                    }
                }
            }
            return fields;
        }

        /**
         * Validate new request forms and fields
         */
        function validateForms() {
            let pageValid = true;
            let invalidFields = [];
            let forms = $scope.forms;
            let index, form;
            if (!forms.vesselDetailsForm.$valid) {
                return getInvalidFields(forms.vesselDetailsForm);
            }
            if (!forms.portsForm.$valid) {
                return getInvalidFields(forms.portsForm);
            }
            for (index in forms.locationForm) {
                form = forms.locationForm[index];
                if (form && !form.$valid) {
                    return getInvalidFields(form);
                }
            }
            for (index in forms.productForm) {
                form = forms.productForm[index];
                if (form && !form.$valid) {
                    return getInvalidFields(form);
                }
            }
            if (!forms.footerForm.$valid) {
                return getInvalidFields(forms.footerForm);
            }
            return null;
        }

        /**
         * Check if request contains quoted products
         */
        function areProductsQuoted() {
            for (let i = ctrl.request.locations.length - 1; i >= 0; i--) {
                for (let j = ctrl.request.locations[i].products.length - 1; j >= 0; j--) {
                    if (ctrl.request.locations[i].products[j].productStatus.id == PRODUCT_STATUS_IDS.PARTIALLY_INQUIRED || ctrl.request.locations[i].products[j].productStatus.id == PRODUCT_STATUS_IDS.INQUIRED || ctrl.request.locations[i].products[j].productStatus.id == PRODUCT_STATUS_IDS.QUOTED) {
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * Add at least one product row to existing locations
         */
        function addDefaultProducts() {
            for (let i = 0; i < ctrl.request.locations.length; i++) {
                if (ctrl.request.locations[i].products.length === 0) {
                    ctrl.addEmptyProduct(ctrl.request.locations[i].products);
                }
                if (ctrl.request.locations[i].agent === null) {
                    // ctrl.request.locations[i].agent = {};
                }
            }
        }

        /**
         * Initializes screenactions (buttons) according to possible actions and request actions
         */
        ctrl.calculateScreenActions = function() {
            let requestProducts = [];
            let product, requestActions;
            // Iterate Requests and their respective locations and products to extract actions.
            for (let j = 0; j < ctrl.request.locations.length; j++) {
                if(j==ctrl.request.locations.length-1){
                    ctrl.request.locations[j].optionId=ctrl.request.locations.length;
                }
                for (let k = 0; k < ctrl.request.locations[j].products.length; k++) {
                    product = ctrl.request.locations[j].products[k];
                    if (
                        $filter('filter')(
                            requestProducts,
                            {
                                id: product.id
                            },
                            true
                        ).length === 0
                    ) {
                        if (ctrl.checkedProducts[product.id]) {
                            requestProducts.push(product);
                        }
                    }
                }
            }
            requestActions = screenActionsModel.getActionsFromProductList(requestProducts);
            ctrl.screenActions = screenActionsModel.intersectActionLists(uiApiModel.getScreenActions(), requestActions);
        };

        /**
         * Initializes the lookup input fields in the template.
         * TODO: This will be gone entirely after refactoring for the uib-typeahead directive.
         */
        function initializeLookupInputs() {
            // bindTypeahead('#id_Ports', normalizeJSONLookupData(ctrl.lists.Location), portsTypeaheadChange);
        }

        /**
         * Set the global lookupInput to the given model.
         */
        ctrl.setLookupInput = function(field) {

            ctrl.lookupInput = field;
        };

        /**
         *
         * Function used to late-initialize the lookup input fields in the template.
         */
        ctrl.initializeDynamicLookupBuyerInputs = function(field, list, event) {
            let input = $(event.currentTarget);
            bindTypeahead(input, normalizeJSONLookupData(list), buyerTypeaheadChange);
            ctrl.lookupInput = field;
            input.focus();
        };

        /**
         * TODO: re-asses the need for this!
         * Function used to late-initialize the date input fields in the template.
         */
        ctrl.initializeDynamicDateInput = function(event) {
            let date = $(event.currentTarget);
            if (date.data('datetimepicker') !== undefined) {
                return false;
            }
            date.datetimepicker({
                isRTL: App.isRTL(),
                // format: "dd MM yyyy - HH:ii P",
                showMeridian: true,
                autoclose: true,
                pickerPosition: 'bottom-left',
                todayBtn: false
            });
            date.focus();
        };

        /**
         * Bind Twitter Typeahead functionality to a given input.
         * @param {*} selector - A valid jQuery selector.
         * @param {Array} list - The lookup list, in which to search.
         * @param {function} cb - A callback function to call when user selects an option.
         */
        function bindTypeahead(selector, list, cb) {
            let element = $(selector);
            if (element.data('ttTypeahead') !== undefined) {
                return false;
            }
            element
                .typeahead(
                    {
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },
                    {
                        source: lookupModel.substrMatcher(list)
                    }
                )
                .bind('typeahead:select', (event, suggestion) => {
                    if (cb) {
                        cb(event, suggestion);
                    }
                });
        }

        function getTerminalLocations(LOCATIONS, locationId){

            lookupModel.getForRequest(LOCATIONS, locationId).then(
                (server_data) => {

                    $.each(ctrl.request.locations, (e, f) => {

                        if(f.location.id == server_data.payload.id){
                            if($scope.locationTerminal == undefined){
                                $scope.locationTerminal = [];
                                if(server_data.payload.terminals.length == 0 || server_data.payload.terminals == []){
                                    $scope.locationTerminal[e] = [];
                                }
                                else{
                                    $scope.locationTerminal[e] = angular.copy(server_data.payload.terminals);
                                }

                            }
                            else{
                                if(server_data.payload.terminals.length == 0 || server_data.payload.terminals == []){
                                    $scope.locationTerminal[e] = [];
                                }
                                else{
                                    $scope.locationTerminal[e] = angular.copy(server_data.payload.terminals);
                                }

                            }
                        }
                    });
                }
            );
        }
        /**
         * Adds a port to the request locations array.
         * Returns a promise so we can do extra work afterwards
         */
        function addLocation(locationId, voyageId, vesselVoyageDetailId, extraInfo) {

            let location, productList,locationTerminal;
            let agent = null;
            let deferred = $q.defer();
            lookupModel.getForRequest(LOOKUP_TYPE.LOCATIONS, locationId).then(
                (server_data) => {

                    if($scope.locationTerminal == undefined){
                        $scope.locationTerminal = [];
                    $scope.locationTerminal.push(angular.copy(server_data.payload.terminals));
                    }
                    else{
                        $scope.locationTerminal.push(angular.copy(server_data.payload.terminals));

                    }
                    location = server_data.payload;
                    let agent = {};
                    // only set agent if agent field is of type lookup
                    // if its free text, let the user fill in info
                    if (ctrl.requestTenantSettings.agentDisplay.name == 'Lookup') {
                        if (location.agents.length > 0) {
                            $.each(location.agents, (k, v) => {
                                if (v.isDefault) {
                                    agent.id = v.counterpartyId;
                                    agent.name = v.counterpartyName;
                                }
                            });
                        }
                    }
                    let locationObject = {
                        location: {
                            code: location.code,
                            id: location.id,
                            name: location.name
                        },
                        vesselVoyageDetailId: vesselVoyageDetailId,
                        // vesselVoyageDetailId: extraInfo.vesselVoyageCode,
                        vesselVoyageId: voyageId,
                        voyageCode: extraInfo.voyageCode,
                        products: [],
                        agent: agent,
                        agentCounterpartyFreeText: null,
                        destination: null,
                        buyer: {}
                    };

                    if (_.isEmpty(agent)) {
                        // nothing
                    } else {
                        // add extra info if available
                        locationObject.agentCounterpartyFreeText = agent.name;
                    }

                    if (ctrl.requestTenantSettings.displayOfService.id == 2) {
                        if (typeof ctrl.vesselDefaultDetails != 'undefined') {
                            locationObject.service = angular.copy(ctrl.vesselDefaultDetails.service);
                        }
                    }
                    if (ctrl.requestTenantSettings.displayOfCompany.id == 2) {
                    	if (extraInfo.company) {
	                        locationObject.company = angular.copy(extraInfo.company);
                    	}
                    	if (ctrl.vesselDefaultDetails.company) {
	                        locationObject.company = angular.copy(ctrl.vesselDefaultDetails.company);
                    	}
                    } else {
                    	if (extraInfo.company) {
	                        ctrl.request.company = angular.copy(extraInfo.company);
                    	}
                    	if (ctrl.vesselDefaultDetails) {
	                    	if (ctrl.vesselDefaultDetails.company) {
		                        ctrl.request.company = angular.copy(ctrl.vesselDefaultDetails.company);
	                    	}
                    	}
                    }
                    if (extraInfo) {
                        locationObject.vesselVoyageDetailId = extraInfo.vesselVoyageDetailId;
                        locationObject.vesselVoyageId = extraInfo.vesselVoyageId ? extraInfo.vesselVoyageId : extraInfo.voyageId;
                        locationObject.voyageCode = extraInfo.voyageCode ? extraInfo.voyageCode : extraInfo.vesselVoyageCode;
                        locationObject.portCallId = extraInfo.portCallId ? extraInfo.portCallId : '';

                        if (extraInfo.destinationId) {
                            locationObject.destination = {
                                id: extraInfo.destinationId,
                                name: extraInfo.destinationName
                            };
                        }
                        locationObject.destinationVesselVoyageDetailId = extraInfo.destinationVesselVoyageDetailId;
                        locationObject.destinationEta = extraInfo.destinationEta;
                    }
                    ctrl.request.locations.push(locationObject);

                    ctrl.etaEnabled[ctrl.request.locations.length - 1] = true;
                    productList = ctrl.request.locations[ctrl.request.locations.length - 1].products;
                    if (ctrl.selectedVessel) {
                        // console.log('ctrl.selectedVessel',ctrl.selectedVessel);
                        if (ctrl.selectedVessel.defaultFuelOilProduct != null) {
                            ctrl.addProductAndSpecGroupToList(ctrl.selectedVessel.defaultFuelOilProduct, ctrl.selectedVessel.fuelOilSpecGroup, ctrl.selectedVessel.defaultFuelOilProductTypeId, productList, extraInfo);
                        }
                        if (ctrl.selectedVessel.defaultDistillateProduct != null) {
                            ctrl.addProductAndSpecGroupToList(ctrl.selectedVessel.defaultDistillateProduct, ctrl.selectedVessel.distillateSpecGroup, ctrl.selectedVessel.defaultDistillateProductProductTypeId, productList, extraInfo);
                        }
                        if (ctrl.selectedVessel.defaultLsfoProduct != null) {
                            ctrl.addProductAndSpecGroupToList(ctrl.selectedVessel.defaultLsfoProduct, ctrl.selectedVessel.lsfoSpecGroup, ctrl.selectedVessel.defaultLsfoProductTypeId, productList, extraInfo);
                        }
                        if (ctrl.selectedVessel.buyer !== null) {
                            locationObject.buyer = ctrl.buyer;
                        }
                        if (productList.length === 0) {
                            ctrl.addEmptyProduct(productList);
                        }
                    } else if (ctrl.request.vesselId) {
                        lookupModel.getForRequest(LOOKUP_TYPE.VESSEL, ctrl.request.vesselId).then((server_data) => {
                            ctrl.selectedVessel = server_data.payload;
                            if (ctrl.selectedVessel.defaultFuelOilProduct !== null) {
                                ctrl.addProductAndSpecGroupToList(ctrl.selectedVessel.defaultFuelOilProduct, ctrl.selectedVessel.fuelOilSpecGroup, ctrl.selectedVessel.defaultFuelOilProductTypeId, productList, extraInfo);
                            }
                            if (ctrl.selectedVessel.defaultFuelOilProduct !== null) {
                                ctrl.addProductAndSpecGroupToList(ctrl.selectedVessel.defaultDistillateProduct, ctrl.selectedVessel.distillateSpecGroup, ctrl.selectedVessel.defaultDistillateProductProductTypeId, productList, extraInfo);
                            }
                            if (ctrl.selectedVessel.defaultLsfoProduct !== null) {
                                ctrl.addProductAndSpecGroupToList(ctrl.selectedVessel.defaultLsfoProduct, ctrl.selectedVessel.lsfoSpecGroup, ctrl.selectedVessel.defaultLsfoProductTypeId, productList, extraInfo);
                            }
                            if (ctrl.selectedVessel.buyer !== null) {
                                locationObject.buyer = ctrl.buyer;
                            }
                            if (productList.length === 0) {
                                ctrl.addEmptyProduct(productList);
                            }
                        });
                    }
                    ctrl.request.locations[ctrl.request.locations.length - 1].products = _.orderBy(ctrl.request.locations[ctrl.request.locations.length - 1].products, [ 'productTypeId', 'product.name' ], [ 'asc', 'asc' ]);
                    ctrl.request.locations[ctrl.request.locations.length - 1].isNew = true;
                    ctrl.captureReasonModal(ctrl.request.locations.length - 1,null,"REQUEST_LOCATION", "location");
                    _.each(ctrl.request.locations[ctrl.request.locations.length - 1].products, (value, key) => {
		                if (value.product) {
			                if (!value.product.originalName) {
			                	value.product.originalName = value.product.name;
			                }
			                value.product.name = `${String(key + 1) } - ${ angular.copy(value.product.originalName)}`;
		                }
		            });
                    deferred.resolve();
                    ctrl.getLowestEtaForDestinationInLocation(ctrl.request.locations.length - 1);
                },
                () => {
                    deferred.reject();
                }
            );
            return deferred.promise;
        }

        function setLocationDates(locationId, vesselVoyageId, eta, etb, etd, recentEta) {
            let location;
            for (let i = 0; i < ctrl.request.locations.length; i++) {
                location = ctrl.request.locations[i];
                if(i==ctrl.request.locations.length-1){
                    location.optionId=ctrl.request.locations.length;
                }
                if (location.location.id === locationId && location.vesselVoyageId == vesselVoyageId && !location.eta && !location.etb && !location.etd) {
                    location.eta = eta;
                    location.etb = etb;
                    location.etd = etd;
                    location.recentEta = recentEta;
                    if (eta && etb && etd) {
                        if (!ctrl.etaDefaultedCount) {
                            ctrl.etaDefaultedCount = {};
                        }
                        ctrl.etaDefaultedCount[locationId] = 3;
                    }
                }
            }
        }

        function portsTypeaheadChange(event, suggestion) {
            let selectedItems = $filter('filter')(
                ctrl.lists.Location,
                {
                    name: suggestion
                },
                true
            );
            if (selectedItems.length > 0) {
                addLocation(selectedItems[0].id, null, null).then(() => {
                    // $timeout(function() {
                    // ctrl.initializeDateInputs();
                    // });
                });
            }
            // Clear the input.
            $(event.target).typeahead('val', '');
        }
        $scope.addTypeLocation = function(val, extra) {
            return addLocation(val, null, null, extra).then(() => {
                setLocationDates(extra.id, extra.vesselVoyageId || extra.voyageId, extra.eta, extra.etb, extra.etd, extra.recentEta);
                if (extra.vesselVoyageId || extra.voyageId) {
	                setDefaultLocationFields(extra.id, extra.vesselVoyageId || extra.voyageId, extra);
                }
                $timeout(() => {
                    ctrl.new_location = null;
                    // console.log('Dumm');
                    $scope.dumm = null;
                    $('#id_Ports').val('');
                });
            });
        };
        function setDefaultLocationFields(locationId, vesselVoyageId, data) {
            let location;
            for (let i = 0; i < ctrl.request.locations.length; i++) {
                location = ctrl.request.locations[i];
                if (location.location.id === locationId && location.vesselVoyageId == vesselVoyageId) {
                	if (ctrl.requestTenantSettings.displayOfService.id == 2) {
	                    location.service = data.service;
                	}
                	// if (ctrl.requestTenantSettings.displayOfCompany.id == 2) {
	                //     location.company = data.company;
                	// }
                }
            }
        }

        function vesselTypeaheadChange(event, suggestion) {
            let selectedItems = $filter('filter')(
                ctrl.lists.Vessel,
                {
                    name: suggestion
                },
                true
            );
            if (selectedItems.length > 0) {
                ctrl.selectVessel(selectedItems[0].id);
            }
        }

        function companyTypeaheadChange(event, suggestion) {
            let selectedItems = $filter('filter')(
                ctrl.lists.Company,
                {
                    name: suggestion
                },
                true
            );
            if (selectedItems.length > 0) {
                ctrl.selectCompany(selectedItems[0].id);
            }
        }

        function serviceTypeaheadChange(event, suggestion) {
            let selectedItems = $filter('filter')(
                ctrl.lists.Service,
                {
                    name: suggestion
                },
                true
            );
            if (selectedItems.length > 0) {
                ctrl.selectService(selectedItems[0].id);
            }
        }

        function buyerTypeaheadChange(event, suggestion) {
            let selectedItems = $filter('filter')(
                ctrl.lists.Buyer,
                {
                    name: suggestion
                },
                true
            );
            if (selectedItems.length > 0) {
                lookupModel.get(LOOKUP_TYPE.BUYER, selectedItems[0].id).then((server_data) => {
                    ctrl.selectBuyer(server_data.payload);
                });
            }
        }

        /** ****************************************************************************
         * EVENT HANDLERS
         *******************************************************************************/
        ctrl.portsChange = function(ports) {
            // If there is a request.locations array reset it,
            // otherwise create it.
            if (ctrl.request && ctrl.request.locations) {
                ctrl.request.locations.length = 0;
            } else {
                ctrl.request.locations = [];
            }
            // Iterate selected ports.
            angular.forEach(ports, (port, key) => {
                // Add selected port data to locations array.
                ctrl.request.locations.push({
                    location: {
                        collectionName: null,
                        id: port.key,
                        name: port.value
                    },
                    products: []
                });
                ctrl.etaEnabled[ctrl.request.locations.length - 1] = true;
                // Add a blank item (table row) to the last item (the one we've just added) in the locations array.
                ctrl.addEmptyProduct(ctrl.request.locations[ctrl.request.locations.length - 1].products);
            });
        };
        ctrl.setDialogType = function(type, input) {
            ctrl.lookupType = LOOKUP_MAP[type];
            ctrl.lookupInput = input;
            ctrl.voyageId = null;
        };
        ctrl.setDialogTypeDestination = function(type, voyageId) {
            ctrl.lookupType = LOOKUP_MAP[type];
            ctrl.voyageId = voyageId;
        };
        ctrl.selectVessel = function(vesselId, preventUpdateCompany) {
            let vessel;
            if (vesselId == null) {
                return;
            }

            lookupModel.getForRequest(LOOKUP_TYPE.VESSEL, vesselId).then((server_data) => {
                vessel = server_data.payload;
                // keep vesselDTO for later use
                ctrl.selectedVessel = vessel;
                if (!ctrl.request.vesselDetails.vessel) {
                    ctrl.request.vesselDetails.vessel = {};
                }

                ctrl.showVesselExpiryWarningMessage = false;
                if (vessel.validateVesselExpiryDate && vessel.expiry) {
                	todayOffset = moment.utc().add(ctrl.requestTenantSettings.vesselExpiryNoOfDays, "days");
                	if(moment.utc(todayOffset).isAfter(moment.utc(vessel.expiry))){

	                    var dateFormat = ctrl.tenantSettings.tenantFormats.dateFormat.name;
	                    var hasDayOfWeek = false;
	                    if (dateFormat.startsWith("DDD ")) {
	                        hasDayOfWeek = true;
	                        dateFormat = dateFormat.split("DDD ")[1];
	                    }
	                    formattedVesselExpiry = $filter("date")(vessel.expiry, dateFormat.split(" ")[0], "UTC");

                		daysRemaining = moment.utc(vessel.expiry).diff(moment.utc(), 'days') + 1 ; /* +1day because it returns full days remaining */
                		ctrl.showVesselExpiryWarningMessage = `${vessel.name} will expire on ${formattedVesselExpiry}. ${daysRemaining} days remaining`
                		if ($("#id_Vessel").hasClass("ng-dirty")) {
		                	toastr.warning(ctrl.showVesselExpiryWarningMessage);
                		}
                	}
                }
                newRequestModel.getDefaultBuyer(vessel.id).then((buyer) => {
                    ctrl.buyer = buyer.payload;
                    ctrl.request.vesselDetails.vessel = angular.copy(vessel);
                    setPageTitle();
                    ctrl.request.vesselId = vessel.id;
                    ctrl.request.vesselDetails.vesselImoNo = vessel.imoNo;
                    if (ctrl.requestTenantSettings.displayOfService.id == 1) {
                        if (!ctrl.request.vesselDetails.service) {
                            ctrl.request.vesselDetails.service = {};
                        }

                        if (typeof ctrl.request.id == 'undefined' || ctrl.request.id == 0 || !ctrl.request.id) {
                            ctrl.request.vesselDetails.service.name = vessel.defaultService ? vessel.defaultService.name : ctrl.request.vesselDetails.service.name;
                            ctrl.request.vesselDetails.service.id = vessel.defaultService ? vessel.defaultService.id : ctrl.request.vesselDetails.service.id;
                            ctrl.request.vesselDetails.service = vessel.defaultService ? vessel.defaultService : ctrl.request.vesselDetails.service;
                            ctrl.selectService(ctrl.request.vesselDetails.service.id);
                        }
                    }

                	let companyToDefault = null;
                	if (vessel.operatingCompany) {
                    	companyToDefault = vessel.operatingCompany;
                	} else if (vessel.voyages.length > 0) {
                			if (vessel.voyages[0].voyageDetails) {
                				if (vessel.voyages[0].voyageDetails[0].company) {
		                        	// companyToDefault = vessel.voyages[0].voyageDetails[0].company;
                				}
                			}
                		}

                    if (ctrl.requestTenantSettings.displayOfCompany.id == 1) {
                        if (!ctrl.request.company) {
                            ctrl.request.company = {};
                        }
                        if (!preventUpdateCompany) {
	                        ctrl.request.company.name = companyToDefault.name;
	                        ctrl.request.company.id = companyToDefault.id;
                        }
                    }

                    ctrl.vesselDefaultDetails = {
                        company: companyToDefault,
                        service: vessel.defaultService ? vessel.defaultService : ctrl.request.vesselDetails.service
                    };

                    ctrl.request.vesselDetails.vesselOwnershipId = vessel.vesselOwnership.id;
                    ctrl.request.vesselDetails.vesselPumpingRate = vessel.pumpingRate;
                    ctrl.request.vesselDetails.earliestRedeliveryDate = vessel.earliestRedelivery;
                    ctrl.request.vesselDetails.estimatedRedeliveryDate = vessel.estimatedRedelivery;
                    ctrl.request.vesselDetails.latestRedeliveryDate = vessel.latestRedelivery;
                });
                ctrl.robDetails = {
                    robDate: server_data.payload.robDate,
                    robDoGoDeliveryUom: server_data.payload.robDoGoDeliveryUom,
                    robDoGoRedeliveryQuantity: server_data.payload.robDoGoRedeliveryQuantity,
                    robDoGoDeliveryQuantity: server_data.payload.robDoGoDeliveryQuantity,
                    robDoGoRedeliveryUom: server_data.payload.robDoGoRedeliveryUom,
                    robHsfoDeliveryQuantity: server_data.payload.robHsfoDeliveryQuantity,
                    robHsfoDeliveryUom: server_data.payload.robHsfoDeliveryUom,
                    robHsfoRedeliveryQuantity: server_data.payload.robHsfoRedeliveryQuantity,
                    robHsfoRedeliveryUom: server_data.payload.robHsfoRedeliveryUom,
                    robLsfoDeliveryQuantity: server_data.payload.robLsfoDeliveryQuantity,
                    robLsfoDeliveryUom: server_data.payload.robLsfoDeliveryUom,
                    robLsfoRedeliveryQuantity: server_data.payload.robLsfoRedeliveryQuantity,
                    robLsfoRedeliveryUom: server_data.payload.robLsfoRedeliveryUom
                };
                ctrl.vesselCharteredDetails = {
                    vesselOwnership: server_data.payload.vesselOwnership,
                    chartererName: server_data.payload.chartererName,
                    delivery: server_data.payload.delivery,
                    expiry: server_data.payload.expiry,
                    earliestRedelivery: server_data.payload.earliestRedelivery,
                    estimatedRedelivery: server_data.payload.estimatedRedelivery,
                    latestRedelivery: server_data.payload.latestRedelivery,
                    redeliveryLocation: server_data.payload.redeliveryLocation
                };
            });
        };
        ctrl.selectOperator = function(operator) {
            ctrl.request.operatorBy = operator;
            ctrl.captureReasonModal(null,null,"REQUEST_OPERATOR", "operatorBy");
        };
        ctrl.selectCompany = function(companyId) {
            if (ctrl.companyInLocationIndex != null) {
                ctrl.selectCompanyInLocation(companyId, ctrl.companyInLocationIndex);
                ctrl.companyInLocationIndex = null;
                return;
            }
            let company;
            lookupModel.get(LOOKUP_TYPE.COMPANY, companyId).then((server_data) => {
                company = server_data.payload;
                if (!ctrl.request.company) {
                    ctrl.request.company = {};
                }
                ctrl.request.company.name = company.name;
                ctrl.request.company.id = company.id;
            });
        };
        ctrl.selectCompanyInLocation = function(itemId, locationIndex) {
            let company;
            lookupModel.get(LOOKUP_TYPE.COMPANY, itemId).then((server_data) => {
                company = server_data.payload;
                if (!ctrl.request.locations[locationIndex].company) {
                    ctrl.request.locations[locationIndex].company = {};
                }
                ctrl.request.locations[locationIndex].company.name = company.name;
                ctrl.request.locations[locationIndex].company.id = company.id;
            });
        };
        ctrl.selectServiceInLocation = function(itemId, locationIndex) {
            let service;
            lookupModel.getForRequest(LOOKUP_TYPE.SERVICES, itemId).then((server_data) => {
                service = server_data.payload;
                if (!ctrl.request.locations[locationIndex].service) {
                    ctrl.request.locations[locationIndex].service = {};
                }
                ctrl.request.locations[locationIndex].service.name = service.name;
                ctrl.request.locations[locationIndex].service.id = service.id;
                ctrl.request.locations[locationIndex].service = service;
                if (service.contacts) {
                    ctrl.request.locations[locationIndex].service.contacts = [];
                    ctrl.request.locations[locationIndex].service.contactEmails = [];
                    $timeout(() => {
                        $.each(service.contacts, (key, val) => {
                            if (val.isActive) {
                                ctrl.request.locations[locationIndex].service.contacts.push({
                                    name: val.name,
                                    id: val.id,
                                    email: val.email
                                });
                            }
                        });
                        ctrl.buildValidatedByListsFromLocationsServices();
                    });
                }
            });
        };
        ctrl.buildValidatedByListsFromLocationsServices = function() {
            if(typeof ctrl.lists == 'undefined') {
                ctrl.lists = {};
            }
            ctrl.lists.contacts = [];
            ctrl.lists.contactEmails = [];
            $.each(ctrl.request.locations, (lk, lv) => {
                if (typeof lv.service != 'undefined') {
                    if (lv.service != null) {
                        $.each(lv.service.contacts, (sck, scv) => {
                            var contactExists = false;
                            var contactEmailExists = false;
                            $.each(ctrl.lists.contacts, (ck, cv) => {
                                if (cv.id == scv.id) {
                                    contactExists = true;
                                }
                            });
                            $.each(ctrl.lists.contactEmails, (ck, cv) => {
                                if (cv.id == scv.id) {
                                    contactEmailExists = true;
                                }
                            });
                            if (!contactExists) {
                                ctrl.lists.contacts.push(scv);
                            }
                            if (!contactEmailExists) {
                                ctrl.lists.contactEmails.push(scv);
                            }
                        });
                    }
                }
            });
            // console.log(ctrl.request);
            if (ctrl.request.footerSection) {
	            ctrl.request.footerSection.validatedBy = ctrl.request.footerSection.validatedBy ? ctrl.request.footerSection.validatedBy : ctrl.lists.contacts[0];
            }
        };
        ctrl.selectPort = function(locationId, extraInfo) {
            if ($scope.portsModal) {
                addLocation(locationId, null, null, extraInfo).then(() => {
                    setLocationDates(extraInfo.locationId, extraInfo.voyageId, extraInfo.eta, extraInfo.etb, extraInfo.etd, extraInfo.recentEta);
                });
                $scope.portsModal = false;
            } else {
                ctrl.selectDestination(locationId, extraInfo);
                $scope.portsModal = false;
            }
        };
        ctrl.selectDestination = function(locationId, extraInfo) {
            // location.destination = extraInfo;
            ctrl.request.locations[ctrl.locationIdx].destination = {};
            ctrl.request.locations[ctrl.locationIdx].destination.id = extraInfo.locationId;
            ctrl.request.locations[ctrl.locationIdx].destination.name = extraInfo.name;
            // addLocation(locationId, null, null).then(function() {
            //     $timeout(function() {
            //         ctrl.initializeDateInputs();
            //     });
            // });
        };
        ctrl.selectAgent = function(agentId) {
            let agent;
            ctrl.lookupInput = {};
            $.each(ctrl.lists.Agent, (agK, agV) => {
                if (agV.id == agentId) {
                    if (ctrl.lookupInput) {
                        delete ctrl.lookupInput.collectionName;
                    }
                    ctrl.lookupInput.code = null;
                    ctrl.lookupInput.id = agV.id;
                    ctrl.lookupInput.internalName = null;
                    ctrl.lookupInput.name = agV.name;
                }
            });
            if (ctrl.agentLocationIdx != -1) {
                ctrl.request.locations[ctrl.agentLocationIdx].agent = ctrl.lookupInput;
                // ctrl.agentLocationIdx = -1
            }
            // console.log(ctrl.agentLocationIdx);
            return ctrl.lookupInput;
            // lookupModel.get(LOOKUP_TYPE.AGENT, agentId).then(function(server_data) {
            //     agent = server_data.payload;
            //     ctrl.lookupInput.id = agent.id;
            //     ctrl.lookupInput.name = agent.name;
            //     ctrl.lookupInput.code = null;
            //     delete ctrl.lookupInput.collectionName
            //     ctrl.lookupInput.internalName = null;
            // });
        };
        ctrl.setDialogTypeContract = function() {
            ctrl.lookupType = LOOKUP_TYPE.CONTRACT;
        };
        ctrl.gotoContractEvaluation = function() {
            // contract Id is 0 in order to get all contracts
            let contractId = 0;
            $state.go(STATE.CONTRACT_EVALUATION, {
                contractId: contractId,
                requestId: ctrl.requestId
            });
        };
        ctrl.getContractsProducts = function(contractList) {
            let contract;
            let products = [];
            // console.log(contractList);
            // contractList[3].product.id = 10;
            // contractList[3].product.name = 'testprod';
            $.each(contractList, (key, val) => {
                // contract = contractList[key];
                if (Array.isArray(val.product)) {
                    $.each(val.contract, (key2, val2) => {
                        products = addProductToSet(val2, products);
                    });
                } else {
                    products = addProductToSet(val.product, products);
                }
            });
            return products;
            // old version
            // for (var i = contractList.length - 1; i >= 0; i--) {
            //     contract = contractList[i];
            //     if (Array.isArray(contract.product)) {
            //         for (var j = contract.product.length - 1; j >= 0; j--) {
            //             products = addProductToSet(contract.product[j], products);
            //         }
            //     } else {
            //         products = addProductToSet(contract.product, products);
            //     }
            // }
            // return products;
        };
        ctrl.selectContract = function(contractId) {
            ctrl.autocompleteContract = null;
            selectContractModel.getRequestContract(ctrl.requestId, contractId).then((data) => {
                if (data.payload !== null) {
                    $.each(data.payload, (key, val) => {
                        var contractAlreadyInList = false;
                        $.each(ctrl.contracts, (k, v) => {
                            if (v.contract.id == val.contract.id) {
                                contractAlreadyInList = true;
                            }
                        });
                        if (!contractAlreadyInList) {
                            ctrl.contracts.unshift(val);
                            // put contract added as first in list
                        }
                    });
                    // ctrl.contracts.push(data.payload);
                    ctrl.products = ctrl.getContractsProducts(ctrl.contracts);
                }
            });
        };
        ctrl.confirmContractSelection = function() {
            var validActiveSpecGroupMessage = ctrl.checkInactiveSpecGroup();
            if (validActiveSpecGroupMessage != true) {
                toastr.error(validActiveSpecGroupMessage);
                return;
            }
            ctrl.buttonsDisabled = true;
            var requestProductIds = [];
            var contractProductIds = [];
            var contractIds = [];
            var errors = 0;
            $.each(ctrl.selectedContracts, (ck, cv) => {
                if (cv.requestProductId) {
                    if (requestProductIds.indexOf(cv.requestProductId) > -1) {
                        errors++;
                        toastr.error(`For Product ${ cv.product.name } you selected multiple Contract to be confirmed. Please select only one Contract per Product from Request.`);
                    }
                    contractIds.push(cv.contract.id);
                    contractProductIds.push(cv.contractProductId);
                    requestProductIds.push(cv.requestProductId);
                }

            });
            if (errors == 0) {
                orderModel.getExistingOrders(requestProductIds.join(',')).then(
                    (responseData) => {
                        ctrl.buttonsDisabled = false;
                        var responseOrderData = responseData.payload;
                        if (responseOrderData.length == 0) {
                            $('#confirm').modal('show');
                            var responseOrders = null;
                        } else {
                            var selectedProductsRequestLocationIds = [];
                            $.each(responseOrderData, (locK, locV) => {
                                $.each(ctrl.selectedContracts, (ck, cv) => {
                                    if (cv.requestLocationId == locV.requestLocationId) {
                                        if (selectedProductsRequestLocationIds.indexOf(locV.requestLocationId) == -1) {
                                            selectedProductsRequestLocationIds.push(locV.requestLocationId);
                                        }
                                    }
                                });
                                // $.each(locV.products, function(prodK, prodV) {
                                // })
                            });
                            responseOrders = [];
                            $.each(responseOrderData, (rdk, rdv) => {
                                if (selectedProductsRequestLocationIds.indexOf(rdv.requestLocationId) != -1) {
                                    responseOrders.push(rdv);
                                }
                            });
                            // selectedContracts, selectedProducts, orderFromResponse
                            var ordersWithErrorsIdx = [];
                            $.each(ctrl.selectedContracts, (selConK, selConV) => {
                                $.each(responseOrders, (respOrdK, respOrdV) => {
                                    if (ctrl.selectedContracts[selConK].requestLocationId == responseOrders[respOrdK].requestLocationId) {
                                        var hasError = false;
                                        var errorMessages = [];
                                        var errorType = [];
                                        if (responseOrders.length > 0) {
                                            if (ctrl.selectedContracts[selConK].currency.id != responseOrders[respOrdK].products[0].currency.id) {
                                                hasError = true;
                                                errorType.push('Currency');
                                            }
                                            // 259200000 is 3 days in miliseconds
                                            if (new Date($scope.getProductLocationETAByRequestProductId(selConV.requestProductId)) - new Date(responseOrders[respOrdK].orderEta) > 259200000 || new Date($scope.getProductLocationETAByRequestProductId(selConV.requestProductId)) - new Date(responseOrders[respOrdK].orderEta) < -259200000) {
                                                hasError = true;
                                                errorType.push('ETA Difference');
                                            }
                                            if (responseOrders[respOrdK].seller) {
                                                if (ctrl.selectedContracts[selConK].seller.id != responseOrders[respOrdK].seller.id) {
                                                    hasError = true;
                                                    errorType.push('Seller');
                                                }
                                            } else {
                                                hasError = true;
                                            }
                                        }
                                        if (hasError) {
                                            var errorTypes = errorType.join(' and ');
                                            if (errorTypes) {
                                                var errorMessage = `Unable to add ${ $scope.getProductNameByRequestProductId(selConV.requestProductId) } for ${ ctrl.request.vesselDetails.vessel.name } in existing stemmed order ${ responseOrders[respOrdK].id } due to conflicting ${ errorTypes }. New order will be created.${ errorTypes } will be only that did not met the criteria for extending the order`;
                                            }
                                            ordersWithErrorsIdx.push(respOrdK);
                                            // responseOrders = null;
                                            // alert(errorMessage);
                                            toastr.info(errorMessage, '', {
                                                timeOut: 10000
                                            });
                                        } else {
                                            errorMessage = null;
                                        }
                                    }
                                });
                            });
                            for (let i = ordersWithErrorsIdx.length - 1; i >= 0; i--) {
                                responseOrders.splice(ordersWithErrorsIdx[i], 1);
                            }
                            $('#confirm').modal('show');
                        }
                        ctrl.confirmationProductOrders = {
                            requestId: ctrl.requestId,
                            contractId: contractIds.join(','),
                            contractProductId: contractProductIds.join(','),
                            requestProductId: requestProductIds.join(','),
                            requestOrder: responseOrders
                        };
                        var broadcastDataConfirmation = {
                            confirmationProductOrders: ctrl.confirmationProductOrders,
                            requestOrder: responseOrders
                        };
                        $scope.$broadcast('confirmationProductOrders', broadcastDataConfirmation);
                    },
                    (responseData) => {
                        ctrl.buttonsDisabled = false;
                    }
                );
            } else {
                ctrl.buttonsDisabled = false;
            }
        };
        // $scope.$on('selectedContract', function(ev, obj) {
        //     ctrl.selectedContract = obj;
        // })
        // $scope.$on('selectedContracts', function(ev, obj) {
        //     console.log(obj)
        //     ctrl.selectedContracts = obj;
        // })
        $scope.getProductNameByRequestProductId = function(rpid) {
            var foundProduct;
            $.each(ctrl.request.locations, (locK, locV) => {
                $.each(locV.products, (prodK, prodV) => {
                    if (prodV.id == rpid) {
                        foundProduct = prodV.product.name;
                    }
                });
            });
            return foundProduct;
        };
        $scope.getProductLocationETAByRequestProductId = function(rpid) {
            var foundProduct;
            $.each(ctrl.request.locations, (locK, locV) => {
                $.each(locV.products, (prodK, prodV) => {
                    if (prodV.id == rpid) {
                        foundProduct = locV.eta;
                    }
                });
            });
            return foundProduct;
        };
        $rootScope.$on('showProceedButton', (event, data) => {
            ctrl.checkboxes = data.checkboxes;
            ctrl.showProceedButton();
        });

        ctrl.showProceedButton = function() {
            var selected = 0;
            ctrl.selectedContracts = [];
            ctrl.selectedContractHasStemmedProduct = false;
            let CLC = $('#flat_available_contracts');
            ctrl.contracts = CLC.jqGrid.Ascensys.gridObject.rows;
            $.each(ctrl.checkboxes, (k, v) => {
                if (v) {
                    $.each(ctrl.contracts, (kc, vc) => {
                        if (vc.requestProductId) {
                            if (k == vc.id) {
                                selected++;
                                ctrl.selectedContracts.push(vc);
                                $.each(ctrl.request.locations, (lk, lv) => {
                                    $.each(lv.products, (prodk, prodv) => {
                                        if (prodv.id == vc.requestProductId) {
                                            if (prodv.productStatus.name == 'Stemmed') {
                                                ctrl.selectedContractHasStemmedProduct = true;
                                            }
                                        }
                                    });
                                });
                            }
                        }
                    });
                }
            });

            if (selected > 0) {
                ctrl.contractHasProduct = true;
            } else {
                ctrl.contractHasProduct = false;
            }
        };
        $rootScope.$on('buttonsDisabled', (ev, value) => {
            ctrl.buttonsDisabled = false;
        });
        $scope.$on('buttonsEnabled', (ev, value) => {
            ctrl.buttonsDisabled = false;
        });
        ctrl.selectProduct = function(productId) {
            // var product;


            var productKey;
            var locIdx = ctrl.requestProductDataOnChange.location;
            var prodIdx = ctrl.requestProductDataOnChange.product;
            var prodUniqueIdUI = ctrl.actveProductUniqueIdUi;
	    	$.each(ctrl.request.locations[locIdx].products, (k, v) => {
	    		if (v.uniqueIdUI == prodIdx) {
	    			productKey = k;
	    		}
	    	});
            ctrl.captureReasonModal(locIdx, productKey, 'REQUEST_PRODUCT_PRODUCTNAME', 'product');
            lookupModel.get(LOOKUP_TYPE.PRODUCTS, productId).then((server_data) => {

				ctrl.request.locations[locIdx].products[productKey].product = server_data.payload;

                listsModel.getProductTypeByProduct(server_data.payload.id).then((server_data1) => {
                	ctrl.request.locations[locIdx].products[productKey].productType = server_data1.data.payload
                    if(ctrl.request.locations[locIdx].products[productKey].product != undefined && ctrl.request.locations[locIdx].products[productKey].product.productType != undefined){
                        if(ctrl.request.locations[locIdx].products[productKey].product.productType.name != undefined && ctrl.request.locations[locIdx].products[productKey].product.productType.name != '')
                        {
                            if(ctrl.request.locations[locIdx].products[productKey].product.productType.name.includes('VLSFO')){
                                ctrl.request.locations[locIdx].products[productKey].isPretestRequired = true;
                            }
                        }


                    }

	                listsModel.getSpecGroupByProductAndVessel(server_data.payload.id, ctrl.request.vesselDetails.vessel.id).then((server_data2) => {
	                    ctrl.request.locations[locIdx].products[productKey].specGroups = server_data2.data.payload;
	                    ctrl.request.locations[locIdx].products[productKey].specGroup = null;
	                    $.each(server_data2.data.payload, (k2, v2) => {
	                    	if (v2.isDefault) {
			                    ctrl.request.locations[locIdx].products[productKey].specGroup = v2;
	                    	}
	                    });
                        let productTypeGroup  = server_data.payload.productTypeGroup;
                        let sludgeProductTypeGroup = _.find(ctrl.listsCache.ProductTypeGroup, { name : 'Sludge' });
                        payload = { Payload: {} };
                        $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload).then((response) => {
                            if (response.data.payload != 'null') {
                               let defaultUomAndCompany = _.find(response.data.payload, function(object) {
                                    return object.id == productTypeGroup.id;
                               });
                               console.log(defaultUomAndCompany);
                               if (defaultUomAndCompany) {
                                   ctrl.request.locations[locIdx].products[productKey].robOnArrivalUom = defaultUomAndCompany.defaultUom;
                                   ctrl.request.locations[locIdx].products[productKey].uom = defaultUomAndCompany.defaultUom;
                                   ctrl.request.locations[locIdx].products[productKey].roundVoyageConsumptionUom = defaultUomAndCompany.defaultUom;
                               }
                            }
                        });

	                });
                });
                lookupModel.getSpecParameterForRequestProduct(server_data.payload.id).then((server_data) => {
                    if (typeof $scope.filteredSpecs == 'undefined') {
                        $scope.filteredSpecs = {};
                    }

                    $scope.filteredSpecs[`product_${ productId}`] = server_data.payload;

                });
            });
        };
        ctrl.canValidate = function() {
            var validProducts = 0;
            $.each(ctrl.request.locations, (lk, lv) => {
                $.each(lv.products, (pk, pv) => {
                    $.each(pv.screenActions, (sk, sv) => {
                        if (sv.name == 'ValidatePreRequest') {
                            validProducts++;
                        }
                    });
                });
            });
            return validProducts;
        };
        ctrl.checkCancelInProducts = function() {
            var validProducts = 0;
            $.each(ctrl.request.locations, (lk, lv) => {
                $.each(lv.products, (pk, pv) => {
                    $.each(pv.screenActions, (sk, sv) => {
                        if (sv.name == 'Cancel') {
                            validProducts++;
                        }
                    });
                });
            });
            return validProducts;
        };
        ctrl.canCancel = function() {
            if (!ctrl.request) {
                return;
            }
            if (!ctrl.request.requestStatus) {
                return;
            }
            if (ctrl.request.requestStatus.name != 'Cancelled' && ctrl.request.requestStatus.name != 'Stemmed') {
                var canCancel = ctrl.checkCancelInProducts();
                if (canCancel > 0) {
                    return true;
                }
            }
            if (ctrl.request.requestStatus.name != 'Cancelled' && ctrl.request.requestStatus.name != 'Stemmed') {
            	return true;
            }
            if(ctrl.request.requestCompleted) {
                return true;
            }
            return false;
        };
        ctrl.canQuestionnaire = function() {
            var validProducts = 0;
            $.each(ctrl.request.locations, (lk, lv) => {
                $.each(lv.products, (pk, pv) => {
                    $.each(pv.screenActions, (sk, sv) => {
                        if (sv.name == 'SendQuestionnaire') {
                            validProducts++;
                        }
                    });
                });
            });
            return validProducts;
        };
        ctrl.selectService = function(serviceId) {
            let service;
            if (ctrl.serviceInLocationIndex != null) {
                ctrl.selectServiceInLocation(serviceId, ctrl.serviceInLocationIndex);
                ctrl.serviceInLocationIndex = null;
                return;
            }
            if (!serviceId) {
                return;
            }
            lookupModel.getForRequest(LOOKUP_TYPE.SERVICES, serviceId).then((server_data) => {
                service = server_data.payload;
                console.log(service);
                if (!ctrl.request.vesselDetails.service) {
                    ctrl.request.vesselDetails.service = {};
                }
                ctrl.request.vesselDetails.service.name = service.name;
                ctrl.request.vesselDetails.service.name = service.name;
                ctrl.request.vesselDetails.service.id = service.id;
                ctrl.request.vesselDetails.service = service;
                if (service.contacts) {
                    $timeout(() => {
                        ctrl.lists.contacts = [];
                        ctrl.lists.contactEmails = [];
                        $.each(service.contacts, (key, val) => {
                            if (val.isActive) {
                                ctrl.lists.contacts.push({
                                    name: val.name,
                                    id: val.id
                                });
                                ctrl.lists.contactEmails.push({
                                    id: val.id,
                                    email: val.email
                                });
                            }
                        });
                        ctrl.request.footerSection.validatedBy = ctrl.lists.contacts[0];
                    });
                }
            });
        };
        ctrl.selectBuyer = function(buyer) {
            if (!ctrl.lookupInput.buyer) {
                ctrl.lookupInput.buyer = {};
            }
            ctrl.lookupInput.buyer.name = decodeHtmlEntity(_.unescape(buyer.name));
            ctrl.lookupInput.buyer.id = buyer.id;
        };
        ctrl.selectVesselSchedules = function(locations) {
            // console.log(ctrl.scheduleVoyageID );
            angular.forEach(locations, (location, key) => {
                addLocation(location.locationId, location.voyageId, location.vesselVoyageDetailId, location).then(() => {
                    setLocationDates(location.locationId, location.voyageId, location.eta, location.etb, location.etd, location.recentETA);
                    setDefaultLocationFields(location.locationId, location.vesselVoyageId || location.voyageId, location);
                });
            });
        };
        ctrl.selectedPortCall = function(locations) {
            // ctrl.request.portCall = locations;
            $scope.portCall[locations.locationId] = locations;
            // angular.forEach(locations, (location, key) => {
            //     addLocation(location.locationId, location.voyageId, location.vesselVoyageDetailId, location).then(() => {
            //         setLocationDates(location.locationId, location.voyageId, location.eta, location.etb, location.etd, location.recentETA);
            //         setDefaultLocationFields(location.locationId, location.vesselVoyageId || location.voyageId, location);
            //     });
            // });
        };
        ctrl.setPortCallDefaultView = function(index, locationObj) {
            if(!(locationObj?.vesselVoyageDetailId)) { return true; }
            locationObj.locationId = locationObj.location.id;
            locationObj.locationName = locationObj.location.name;
            locationObj.voyageId = locationObj.vesselVoyageId;
            locationObj.vesselVoyageDetailId = locationObj.vesselVoyageDetailId;
            ctrl.request.portCall = locationObj;
            $scope.portCall[index] = locationObj;
        };
        ctrl.selectVesselSchedulesMintoReach = function(locations) {
            ctrl.EnableSingleSelect = false;
            // $scope.formValues.minimumQuantitiesToReach = locations;
            if(ctrl.request.minimumQuantitiesToReach != undefined){
                let Minquantitytoreach  = {
                    PortId: [
                        {
                            code: locations[0].product[0].minimumQuantitiesToReach[0].code,
                        }
                    ],
                    Eta: locations[0].product[0].minimumQuantitiesToReach[0].Eta,
                    MinQtyToReach: locations[0].product[0].minimumQuantitiesToReach[0].MinQtyToReach,
                    MinQtyToReachPretest: locations[0].product[0].minimumQuantitiesToReach[0].MinQtyToReachPretest,
                    EstimatedPrice: locations[0].product[0].minimumQuantitiesToReach[0].EstimatedPrice
                };

                ctrl.request.minimumQuantitiesToReach[ctrl.CurrentSelectRow] = Minquantitytoreach;
           // ctrl.request.minimumQuantitiesToReach.push(Minquantitytoreach);
            }
            else{
                ctrl.request.minimumQuantitiesToReach = [];
                let Minquantitytoreach  = {
                    PortId: [
                        {
                            id: locations[0].vesselVoyageDetailId,
                            code: locations[0].voyageCode,
                            name: locations[0].locationName
                        }
                    ],
                    Eta:locations[0].eta,
                    EstimatedPrice:''
                };

                    ctrl.request.minimumQuantitiesToReach[ctrl.CurrentSelectRow] = Minquantitytoreach;
               // ctrl.request.minimumQuantitiesToReach.push(Minquantitytoreach);
            }







            // angular.forEach(locations, (location, key) => {
            //     addLocation(location.locationId, location.voyageId, location.vesselVoyageDetailId, location).then(() => {
            //         setLocationDates(location.locationId, location.voyageId, location.eta, location.etb, location.etd, location.recentETA);
            //         setDefaultLocationFields(location.locationId, location.vesselVoyageId || location.voyageId, location);
            //     });
            // });
        };
        ctrl.minQtyBlur = function(product) {
            if (product.maxQuantity < product.minQuantity || !product.maxQuantity) {
                product.maxQuantity = product.minQuantity;
            }
        };

        ctrl.hasAction = function(action) {
        	if (action == 'GoSpot') {
	            var hasGoSpot = false;
	            $.each(ctrl.request.locations, (kl, vl) => {
	                $.each(vl.products, (kp, vp) => {
	                    $.each(vp.screenActions, (ks, vs) => {
	                        if (vs.name == ctrl.SCREEN_ACTIONS.GOSPOT) {
	                            hasGoSpot = true;
	                        }
	                    });
	                });
	            });
	            if (hasGoSpot && ctrl.request.id) {
	            	return true;
	            }
        	}
            return screenActionsModel.hasAction(action, ctrl.screenActions);
        };
        ctrl.checkGoContract = function() {
            var found = 0;
            $.each(ctrl.request.locations, (kl, vl) => {
                $.each(vl.products, (kp, vp) => {
                    $.each(vp.screenActions, (ks, vs) => {
                        if (vs.name == ctrl.SCREEN_ACTIONS.GOCONTRACT) {
                            found++;
                        }
                    });
                });
            });
            if (found > 0) {
                return true;
            }
            return false;
        };
        ctrl.canSave = function() {
            return screenActionsModel.canSave(ctrl.screenActions);
        };
        ctrl.isSelectProductDisabled = function() {
            for (let i = 0; i < ctrl.request.locations.length; i++) {
                for (let j = 0; j < ctrl.request.locations[i].products.length; j++) {
                    if (ctrl.request.locations[i].products[j].id === null && ctrl.request.locations[i].products[j].isDeleted === false) {
                        return true;
                    }
                    var index = 0;
                    $.each(ctrl.request.locations[i].products[j].screenActions, (key, val) => {
                        if (val.name == 'SendQuestionnaire') {
                            index++;
                        }
                        if (val.name == 'ValidatePreRequest') {
                            index++;
                        }
                    });
                    if (index > 0) {
                        return true;
                    }
                }
            }
            return false;
        };
        ctrl.showCancelRequestConfirm = function(product, location, pIndex, locIndex) {
            ctrl.entityToDelete = 'request';
            ctrl.deleteDataParams = Math.random()
                .toString(36)
                .substring(7);
            $('.confirmModal').modal();
        };

        ctrl.showCanBeCancelledRequestConfirm = function(confirmText) {
            ctrl.entityToDelete = 'canBeCanceledRequest';
            ctrl.deleteDataParams = { confirmText: confirmText };
        };

        ctrl.sendCancelRequestAction = function() {
            var payload;
            if (ctrl.dataReasonCancel) {
                payload = ctrl.dataReasonCancel;
            } else {
                payload = {
                    id: ctrl.request.id
                };
            }
            ctrl.buttonsDisabled = true;
            newRequestModel.cancelRequest(payload).then(
                (responseData) => {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                },
                () => {
                    ctrl.buttonsDisabled = false;
                }
            );
        };

        ctrl.sendCanBeCanceledRequest = function(payload, dataReasonCancel) {
            $scope.prettyCloseModal();
            newRequestModel.canBeCancelled(payload).then((data) => {
                ctrl.sendCancelRequestAction();
                ctrl.buttonsDisabled = false;

            //
            //         if (data.payload) {
            //             ctrl.showCanBeCancelledRequestConfirm(data.payload);
            //             // newRequestModel.cancelRequest({
            //             //     "id": ctrl.request.id
            //             // }).then(function (responseData) {
            //             //     ctrl.buttonsDisabled = false;
            //             //     $state.reload();
            //             // }, function () {
            //             //     ctrl.buttonsDisabled = false;
            //             // });
            //             ctrl.buttonsDisabled = false;
            //         } else {
            //             // newRequestModel.cancelRequest({
            //             //     "id": ctrl.request.id
            //             // }).then(function (responseData) {
            //             //     ctrl.buttonsDisabled = false;
            //             //     $state.reload();
            //             // }, function () {
            //             //     ctrl.buttonsDisabled = false;
            //             // });
            //         }
            //
            });
        };

        ctrl.cancelRequest = function() {
            // ctrl.cancelRequestConfirm = confirm("Are you sure you want to cancel the request?");
            // if (ctrl.cancelRequestConfirm) {

            ctrl.buttonsDisabled = true;
            if (ctrl.requestTenantSettings.captureReasonToCancelRequest.id == 1) {
                var tpl = $templateCache.get('app-general-components/views/modal_reasonToCancelRequest.html');
                // tpl = $templateCache.get('app-general-components/views/modal_sellerrating.html');
                $scope.modalInstance = $uibModal.open({
                    template: tpl,
                    size: 'full',
                    appendTo: angular.element(document.getElementsByClassName('page-container')),
                    windowTopClass: 'fullWidthModal autoWidthModal',
                    scope: $scope
                });
                let list = [ 'Inquired', 'PartiallyInquired', 'Quoted', 'PartiallyQuoted', 'Amended' ];
                if (list.indexOf($state.params.status.name) != -1) {
                    ctrl.textValue = 'Are you sure you want to cancel this request?(The Request belongs to a Group and this Group will be deleted)';
                } else {
                    ctrl.textValue = 'Are you sure you want to cancel this request?';
                }
            } else {
                var canBeCancelledPayload = {
                    Filters: [
                        {
                            ColumnName: 'RequestId',
                            Value: ctrl.request.id
                        },
                        {
                            ColumnName: 'RequestName',
                            Value: ctrl.request.Name
                        }
                    ]
                };
                ctrl.sendCanBeCanceledRequest(canBeCancelledPayload);
                // newRequestModel.canBeCancelled(canBeCancelledPayload).then(function (data) {
                //     if (data.payload) {
                //         $scope.confirmationOfCancelation = confirm(data.payload);
                //         if ($scope.confirmationOfCancelation) {
                //             newRequestModel.cancelRequest({
                //                 "id": ctrl.request.id
                //             }).then(function (responseData) {
                //                 ctrl.buttonsDisabled = false;
                //                 $state.reload();
                //             }, function () {
                //                 ctrl.buttonsDisabled = false;
                //             });
                //         } else {
                //             ctrl.buttonsDisabled = false;
                //         }
                //     } else {
                //         newRequestModel.cancelRequest({
                //             "id": ctrl.request.id
                //         }).then(function (responseData) {
                //             ctrl.buttonsDisabled = false;
                //             $state.reload();
                //         }, function () {
                //             ctrl.buttonsDisabled = false;
                //         });
                //     }
                // })
            }
            // }
        };
        ctrl.confirmCancelRequest = function(requestId, reason) {
            window.actionLevel = 'Cancel';
            if (typeof reason == 'undefined') {
                toastr.error('Please select the reason');
                return;
            }
            if (!reason.id) {
                toastr.error('Please select the reason');
                return;
            }
            ctrl.dataReasonCancel = {
                id: requestId,
                requestCancelReasonOption: reason
            };
            var canBeCancelledPayload = {
                Filters: [
                    {
                        ColumnName: 'RequestId',
                        Value: ctrl.request.id
                    },
                    {
                        ColumnName: 'RequestName',
                        Value: ctrl.request.name
                    }
                ]
            };

            ctrl.sendCanBeCanceledRequest(canBeCancelledPayload);

            // newRequestModel.canBeCancelled(canBeCancelledPayload).then(function(data) {
            //     if (data.payload) {
            //         $scope.confirmationOfCancelation = confirm(data.payload);
            //         if ($scope.confirmationOfCancelation) {
            //             newRequestModel.cancelRequest(dataReasonCancel).then(function(responseData) {
            //                 ctrl.buttonsDisabled = false;
            //                 $state.reload();
            //             }, function() {
            //                 ctrl.buttonsDisabled = false;
            //             });
            //         } else {
            //             ctrl.buttonsDisabled = false;
            //         }
            //     } else {
            //         newRequestModel.cancelRequest(dataReasonCancel).then(function(responseData) {
            //             ctrl.buttonsDisabled = false;
            //             $state.reload();
            //         }, function() {
            //             ctrl.buttonsDisabled = false;
            //         });
            //     }
            // })
        };
        ctrl.copyRequest = function() {
            let new_request = angular.copy(ctrl.request);
            for (var i = 0; i < ctrl.request.locations.length; i++) {
                let new_products = [];
                for (let j = 0; j < ctrl.request.locations[i].products.length; j++) {
                    if (ctrl.request.locations[i].products[j].productStatus) {
	                    if(ctrl.request.locations[i].products[j].productStatus.name !== 'Cancelled') {
	                        new_products.push(ctrl.request.locations[i].products[j]);
	                    }
                    }
                }
                new_request.locations[i].products = new_products;
            }
            var new_locations = [];
            for (var i = 0; i < new_request.locations.length; i++) {
            	if (new_request.locations[i].portStatus) {
	            	if (new_request.locations[i].portStatus.name !== 'Cancelled') {
	        			new_locations.push(new_request.locations[i]);
	            	}
            	}
            }
            new_request.locations = new_locations;

        	$.each(new_request.locations, (k, v) => {
            	$.each(ctrl.lists.Location, (lk, lv) => {
            		if (v.destination) {
	            		if (lv.id == v.destination.id) {
	                    	v.destination = lv;
	            		}
            		}
            	});
        	});
            $state.go(STATE.COPY_REQUEST, {
                copyFrom: new_request
            });
        };
        ctrl.validatePreRequest = function() {
            ctrl.buttonsDisabled = true;
            // call function to see required fields
            var valid = ctrl.checkValidQuantities();
            var validMQTR = ctrl.checkValidMQTRs();
            $('form').addClass('submitted');
            ctrl.isRequiredMinMax(true);
            ctrl.isSpecGroupIsRequired(true);
            $timeout(() => {
                // show errors if needed
                ctrl.saved = true;
                let forms_validation = validateForms();
                var validActiveSpecGroupMessage = ctrl.checkInactiveSpecGroup();

                if (validActiveSpecGroupMessage != true) {
                    toastr.error(validActiveSpecGroupMessage);
                    ctrl.buttonsDisabled = false;
                    return false;
                }
                if (forms_validation !== null) {
                    toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(', '));
                    ctrl.buttonsDisabled = false;
                    return false;
                }

                if(validMQTR!=='' && validMQTR!==undefined){
                    toastr.error(validMQTR);
                    ctrl.buttonsDisabled = false;
                    return false;
                }
                // validate request
                screenLoader.showLoader();
                newRequestModel.validate(ctrl.request).then(
                    (responseData) => {
                        ctrl.buttonsDisabled = false;
                        $state.reload();
                    },
                    () => {
                        ctrl.buttonsDisabled = false;
                    }
                ).finally(() => {
                    screenLoader.hideLoader();
                    ctrl.buttonsDisabled = false;
                });
            });
        };
        ctrl.isRequiredMinMax = function(validate) {
            if (validate) {
                // function is called from validate - make fields required for validation
                ctrl.requiredQty = true;
                return false;
            }
            	if (ctrl.requestTenantSettings) {
	                // general function call (from template)
	                // 1. if prerequest enabled -> required at validate
	                if (ctrl.requestTenantSettings.isPrerequestEnabled) {
                    ctrl.requiredQty = false;
                } // not required

	                // 2. if prerequest not enabled -> required from save
	                if (!ctrl.requestTenantSettings.isPrerequestEnabled) {
                    ctrl.requiredQty = true;
                }
            	}
        };
        ctrl.isSpecGroupIsRequired = function(validate) {
            if (validate) {
                // function is called from validate - make fields required for validation
                ctrl.specGroupIsRequired = true;
                return false;
            }
            	if (ctrl.requestTenantSettings) {
	                // general function call (from template)
	                // 1. if prerequest enabled -> required at validate
	                if (ctrl.requestTenantSettings.isPrerequestEnabled) {
                    ctrl.specGroupIsRequired = false;
                } // not required

	                // 2. if prerequest not enabled -> required from save
	                if (!ctrl.requestTenantSettings.isPrerequestEnabled) {
                    ctrl.specGroupIsRequired = true;
                }
            	}
        };

        ctrl.checkValidQuantities = function() {
            let text = '';
            $.each(ctrl.request.locations, (key, val) => {
                $.each(val.products, (key2, val2) => {
                    if (val2.minQuantity != null && isNaN(val2.minQuantity)) {
                        ctrl.request.locations[key].products[key2].minQuantity = null;
                    }
                    if (val2.maxQuantity != null && isNaN(val2.maxQuantity)) {
                        ctrl.request.locations[key].products[key2].maxQuantity = null;
                    }
                    if (val2.minQty != null) {
                        if (val2.maxQuantity != null) {
                            if (val2.minQty > val2.maxQuantity) {
                                // ok
                            }
                        } else {
                            // ok
                        }
                    } else {
                        text = 'The following fields are required or invalid: MinQuantity, MaxQuantity';
                    }
                });
            });

            if (text != '') {
                return text;
            }
            return true;
        };
        ctrl.checkValidMQTRs = function() {
            let text = '';
            if(ctrl.requestTenantSettings.isRequestMinimumQuantityToReachMandatory){
                $.each(ctrl.request.locations, (key, val) => {
                    $.each(val.products, (key2, val2) => {
                        if(val2.id==null){
                             if(val2.minimumQuantitiesToReach==undefined){ 
                                text = 'The following fields are required minimumQuantitiesToReach  '+ ctrl.request.locations[key].location.name+':-'+ctrl.request.locations[key].products[key2].product.name;
                                ctrl.request.locations[key].products[key2].minimumQuantitiesToReach = null;           
                             }
                        }else if(val2.productStatus.id!==14 && val2.minimumQuantitiesToReach.length==0 ){
                                text = 'The following fields are required minimumQuantitiesToReach  '+ ctrl.request.locations[key].location.name+':-'+ctrl.request.locations[key].products[key2].product.name;
                                ctrl.request.locations[key].products[key2].minimumQuantitiesToReach = null
                        }
                    });
                });
            }
            if (text != '') {
                return text;
            }
        };

        ctrl.checkInactiveSpecGroup = function() {
            let firstLocationWithInactiveSpecGroup = true;
            var specGroupErrors = [];
            var isStemmedProduct = false;
            $.each(ctrl.request.locations, (key, val) => {
                let firstProductWithInactiveSpecGroup = true;
                $.each(val.products, (key2, val2) => {
                    if (val2.productStatus) {
                        if (val2.productStatus.name == "Stemmed") {
                            isStemmedProduct = true;
                        }
                    }
                    if (val2.specGroup != null) {
                        var findSpecGroup = _.find($listsCache.SpecGroup, function(object) {
                            return object.id == val2.specGroup.id;
                        });
                        if (val2.specGroup.isDeleted) {
                            if (val2.product && ctrl.request.id) {
                                if (val2.productStatus) {
                                    if ( val2.productStatus.name != "Cancelled") {
                        	               specGroupErrors.push(`Spec Group for "`+val2.product.name+`" from ` + val.location.name + ` is invalid.`);
                                    }
                                }
                            }
                        }
                    } else {
                    	if (val2.product) {
                            if (val2.productStatus) {
                                if ( val2.productStatus.name != "Cancelled") {
                                    specGroupErrors.push(`Please select a specGroup for "`+val2.product.name+`" from ` + val.location.name + `.`);
                                }
                            } else {
                                specGroupErrors.push(`Please select a specGroup for "`+val2.product.name+`" from ` + val.location.name + `.`);

                            }
                    	}
                    }
                });
            });

            if (specGroupErrors.length > 0 && !isStemmedProduct) {
            	text = specGroupErrors.join("<br>");
                return text;
            }
            return true;
        }
        ctrl.sendQuestionnaire = function() {

        	console.log(ctrl.sendQuestionnaireEmailType);
            var validActiveSpecGroupMessage = ctrl.checkInactiveSpecGroup();
            if (validActiveSpecGroupMessage != true) {
                toastr.error(validActiveSpecGroupMessage);
                return;
            }

        	$.each(ctrl.emailSettings, (k, v) => {
        		if ((v.process == 'Redelivery' || v.process == 'Standard') && v.transactionType.name == 'PreRequest' && v.emailType.name == 'Manual') {
        			ctrl.sendQuestionnaireEmailType = v.emailType.name;
        			ctrl.sendQuestionnaireEmailTemplate = v.template;
        		}

        	});

        	if (ctrl.sendQuestionnaireEmailType == 'Manual') {
        		ctrl.goEmail();
        		return;
        	}

            ctrl.buttonsDisabled = true;
            newRequestModel.sendPrerequest(ctrl.request.id).then(
                (responseData) => {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                },
                () => {
                    ctrl.buttonsDisabled = false;
                }
            );
        };
        ctrl.amendRFQ = function() {
            groupOfRequestsModel.amendRFQ(ctrl.requirementsToAmend).then(() => {
	            $state.reload();
            });
        };
        ctrl.reloadRequest = function() {
            $state.reload();
        };

        ctrl.requestDateFieldsErrors = {};
        ctrl.validateEtaDateFields = function(key,etadate,elm) {
            function toggleInvalid(elm, action) {
                if (action === 'add') {
                    $(`#${ elm }_dateinput`).parent().find('input').addClass('invalidEta');
                    $(`#${ elm }_dateinput`).addClass('invalidEta');
                }
                if (action === 'remove') {
                    $(`#${ elm }_dateinput`).parent().find('input').removeClass('invalidEta');
                    $(`#${ elm }_dateinput`).removeClass('invalidEta');
                }
            }
            let hasError = false;
            let errorMessage = '';
            if (ctrl.request.locations[ctrl.selectedLocationIdx].eta != null, etadate != null) {
                if (moment.utc(etadate).isBefore(moment.utc(ctrl.request.locations[ctrl.selectedLocationIdx].eta))) {
                    errorMessage = 'MinQtyToReach ETA date must be greater than to InitialETA.';
                    toastr.error(errorMessage);
                    toggleInvalid(`${key }_etaMQTR`, 'add');
                    ctrl.requestDateFieldsErrors[`${key }eta`] = errorMessage;
                    hasError = true;
                    $scope.etaDatevalid=true;
                } else if (ctrl.request.locations[ctrl.selectedLocationIdx].eta) {
                    toggleInvalid(`${key }_etaMQTR`, 'remove');
                    ctrl.requestDateFieldsErrors[`${key }eta`] = null;
                    $scope.etaDatevalid=false;
                }
            }

            if (hasError) {
                toggleInvalid(`${key }_etaMQTR`, 'add');
            } else if (ctrl.request.locations[ctrl.selectedLocationIdx].eta) {
                toggleInvalid(`${key }_etaMQTR`, 'remove');
            }
        };
        ctrl.validateRequestDateFields = function(location, locationIdx, elm) {
            $timeout(() => {
                function toggleInvalid(elm, action) {
                    if (action === 'add') {
                        $(`#${ elm }_dateinput`).parent().find('input').addClass('invalid');
                        $(`#${ elm }_dateinput`).addClass('invalid');
                    }
                    if (action === 'remove') {
                        $(`#${ elm }_dateinput`).parent().find('input').removeClass('invalid');
                        $(`#${ elm }_dateinput`).removeClass('invalid');
                    }
                }

                let hasError = false;
                let errorMessage = '';
                if (!ctrl.request.locations[locationIdx].recentEta) {
                    if (moment.utc(ctrl.request.locations[locationIdx].etb).isBefore(moment.utc(ctrl.request.locations[locationIdx].eta))) {
                        errorMessage = 'ETA must be lower or equal to ETB.';
                        toastr.error(errorMessage);
                        toggleInvalid(`${locationIdx }_etb`, 'add');
                        ctrl.requestDateFieldsErrors[`${locationIdx }_etb`] = errorMessage;
                        hasError = true;
                    } else if (ctrl.request.locations[locationIdx].etb) {
                        toggleInvalid(`${locationIdx }_etb`, 'remove');
                        ctrl.requestDateFieldsErrors[`${locationIdx }_etb`] = null;
                    }

                    if (moment.utc(ctrl.request.locations[locationIdx].etd).isBefore(moment.utc(ctrl.request.locations[locationIdx].eta))) {
                        errorMessage = 'ETA must be lower or equal to ETD.';
                        toastr.error(errorMessage);
                        toggleInvalid(`${locationIdx }_etd`, 'add');
                        ctrl.requestDateFieldsErrors[`${locationIdx }_etd`] = errorMessage;
                        hasError = true;
                    } else if (ctrl.request.locations[locationIdx].etd) {
                        toggleInvalid(`${locationIdx }_etd`, 'remove');
                        ctrl.requestDateFieldsErrors[`${locationIdx }_etd`] = null;
                    }
                }



                if (hasError) {
                    toggleInvalid(`${locationIdx }_eta`, 'add');
                } else if (ctrl.request.locations[locationIdx].eta) {
                    toggleInvalid(`${locationIdx }_eta`, 'remove');
                }

                hasError = false;

                if (ctrl.request.locations[locationIdx].recentEta) {
                    if (moment.utc(ctrl.request.locations[locationIdx].etb).isBefore(moment.utc(ctrl.request.locations[locationIdx].recentEta))) {
                        errorMessage = 'Updated ETA must be lower or equal to ETB.';
                        toastr.error(errorMessage);
                        toggleInvalid(`${locationIdx }_etb`, 'add');
                        ctrl.requestDateFieldsErrors[`${locationIdx }_etb`] = errorMessage;
                        hasError = true;
                    } else if (ctrl.request.locations[locationIdx].etb) {
                        toggleInvalid(`${locationIdx }_etb`, 'remove');
                        ctrl.requestDateFieldsErrors[`${locationIdx }_etb`] = errorMessage;
                    }
                    if (moment.utc(ctrl.request.locations[locationIdx].etd).isBefore(moment.utc(ctrl.request.locations[locationIdx].recentEta))) {
                        errorMessage = 'Updated ETA must be lower or equal to ETD.';
                        toastr.error(errorMessage);
                        toggleInvalid(`${locationIdx }_etd`, 'add');
                        ctrl.requestDateFieldsErrors[`${locationIdx }_etd`] = errorMessage;
                        hasError = true;
                    } else if (ctrl.request.locations[locationIdx].etd) {
                        toggleInvalid(`${locationIdx }_etd`, 'remove');
                        ctrl.requestDateFieldsErrors[`${locationIdx }_etd`] = errorMessage;
                    }
                }

                if (hasError) {
                    toggleInvalid(`${locationIdx }_recentEta`, 'add');
                } else if (ctrl.request.locations[locationIdx].eta) {
                    toggleInvalid(`${locationIdx }_recentEta`, 'remove');
                }

                if (moment.utc(ctrl.request.locations[locationIdx].etd).isBefore(moment.utc(ctrl.request.locations[locationIdx].etb))) {
                    errorMessage = 'ETB must be lower or equal to ETD.';
                    toastr.error(errorMessage);
                    toggleInvalid(`${locationIdx }_etd`, 'add');
                    toggleInvalid(`${locationIdx }_etb`, 'add');
                    ctrl.requestDateFieldsErrors[`${locationIdx }_etb_etd`] = errorMessage;
                    hasError = true;
                } else if (ctrl.request.locations[locationIdx].etd && !(ctrl.requestDateFieldsErrors[`${locationIdx }_etd`] || ctrl.requestDateFieldsErrors[`${locationIdx }_etb`])) {
                    toggleInvalid(`${locationIdx }_etd`, 'remove');
                    toggleInvalid(`${locationIdx }_etb`, 'remove');
                    ctrl.requestDateFieldsErrors[`${locationIdx }_etb_etd`] = null;
                }
            });
        };

        ctrl.etaChanged = function(location, locationIdx) {           
                $timeout(() => {
                    if (!location.etb) {
                        location.etb = location.eta;
                    }
                    if (!location.etd) {
                        location.etd = location.eta;
                    }
                    location.recentEta = location.eta;
                });
            return;
        };

        $scope.updateDestinations = function(val, index, location) {
        	if (val.length < 2) {
        		return;
        	}
            let IsDestinationPort = false;
            let voyageIdToSend = angular.copy($stateParams.voyageId);
            if (index == 'DestinationPort') {
                IsDestinationPort = true;
	            if (!voyageIdToSend) {
            		if (location && location.vesselVoyageDetailId) {
            			voyageIdToSend = location.vesselVoyageDetailId;
            		}
	            }
            } else {
            	voyageIdToSend = null;
            }
            ctrl.loadedTypeaheadPort = false;
            return newRequestModel.getDestinations(val, ctrl.request.vesselId, voyageIdToSend, IsDestinationPort).then((response) => {
                if (response && response.payload) {
                    ctrl.loadedTypeaheadPort = true;
                    // if(index != null){
                    //     ctrl.request.locations[index].destination = response.payload[0];
                    // }
                    return response.payload;
                }
                return null;
            });
        };
        ctrl.addInSelection = function(id) {
            if (typeof ctrl.productIds == 'undefined') {
                ctrl.productIds = [];
            }
            var prodIndex = ctrl.productIds.indexOf(id);
            // console.log(prodIndex)
            if (prodIndex == -1) {
                ctrl.productIds.push(id);
            } else {
                ctrl.productIds.splice(prodIndex, 1);
            }
            // ctrl.productIds = productIds;
            // console.log(productIds)
        };
        ctrl.getProductTooltipByProductId = function(productId) {
            // console.log($listsCache);
            var tooltipName = null;
            $.each($listsCache.Product, (pk, pv) => {
                if (pv.id == productId) {
                    tooltipName = pv.displayName;
                }
            });
            return tooltipName;
        };
        $scope.showHideSections = function(obj) {
            if (obj.length > 0) {
                $scope.visible_sections_old = $scope.visible_sections;
            } else if (typeof $scope.visible_sections_old != 'undefined') {
                $scope.visible_sections = $scope.visible_sections_old;
                $('select#multiple').selectpicker('val', $scope.visible_sections_old[0]);
                $('select#multiple').selectpicker('render');
            }
        };

        function setRequestStatusHeader() {
            if (typeof ctrl.request.requestStatus != 'undefined') {
                if (!ctrl.request.requestStatus) {
                    ctrl.request.requestStatus = {};
                }
                if (ctrl.request.requestStatus.name) {
                    $state.params.status = {};
                    $state.params.status.name = ctrl.request.requestStatus.displayName ? ctrl.request.requestStatus.displayName : ctrl.request.requestStatus.name;
                    $state.params.status.bg = statusColors.getColorCodeFromLabels(
                        ctrl.request.requestStatus,
                        $listsCache.ScheduleDashboardLabelConfiguration);
                    $state.params.status.color = 'white';
                }
            } else {
                $state.params.status = null;
            }
        }

        function setPageTitle() {
            if(ctrl.request.id) {
                if(ctrl.request.name) {
                    if(ctrl.request.vesselDetails.vessel) {
                        let title = `${'Request' + ' - '}${ ctrl.request.name } - ${ ctrl.request.vesselDetails.vessel.name}`;
                        $rootScope.$broadcast('$changePageTitle', {
                            title: title
                        });
                    }
                }
            }
        }

        // $scope.$on('formValues', function(){
        //     console.log($scope.formValues);
        //     console.log($state);
        //     $scope.setPageTitle();
        // });


        /** ****************************************************************************
         * END EVENT HANDLERS
         *******************************************************************************/
        // used in nav
        $scope.NAV = {};
        $scope.NAV.requestId = $state.params.requestId;
        ctrl.selectDefaultContracts = function() {
            ctrl.checkboxes = {};
            $.each(ctrl.request.locations, (lock, locv) => {
                $.each(locv.products, (prodk, prodv) => {
                    if (prodv.contract) {
                        if (prodv.contract.contract) {
                            if (prodv.contract.contract.id) {
                                // ctrl.checkboxes[prodv.contract.contract.id] = true;
                                // if (contractIds.indexOf(prodv.contract.contract.id) == -1) {
                                //      contractIds.push(prodv.contract.contract.id);
                                // }
                                $.each(ctrl.contracts, (ck, cv) => {
                                    if (cv.contract.id == prodv.contract.contract.id) {
                                        if (cv.product.id == prodv.product.id) {
                                            ctrl.checkboxes[cv.id] = true;
                                            ctrl.showProceedButton();
                                        }
                                    }
                                });
                                console.log(ctrl.checkboxes);
                            }
                        }
                    }
                });
            });
            // $scope.$broadcast('defaultSelectedContracts', contractIds);
        };

        /*
         *  best contracts section - updated
         */
        // selectContractModel.getContractsAutocomplete().then(function(data) {
        //     ctrl.contractList = data.payload;
        // });
        ctrl.searchContract = function() {
            if (ctrl.showAllContracts) {
                ctrl.displayAllContracts(ctrl.tableEntries, ctrl.search_contract);
            } else {
                ctrl.initContractTable(ctrl.tableEntries, ctrl.search_contract);
            }
        };
        ctrl.initContractTable = function(pagination, search) {
            if (!pagination) {
                pagination = {};
                pagination.start = 0;
                pagination.length = ctrl.tableEntries;
            }
            search = search ? search : '';

            var hasValidatedProduct = false;
            $.each(ctrl.request.locations, (lk, lv) => {
	            $.each(lv.products, (pk, pv) => {
	            	if (pv.productStatus.name == 'Validated') {
			            hasValidatedProduct = true;
	            	}
	            });
            });

            if (!ctrl.request.hasBestContract || !hasValidatedProduct) {
                return false;
            }
        };
        ctrl.displayAllContracts = function(pagination, search) {
            if (!pagination) {
                pagination = {};
                pagination.start = 0;
                pagination.length = ctrl.tableEntries;
            }
            search = search ? search : '';
            selectContractModel.getAllContract(ctrl.requestId, pagination, search).then((data) => {
                processData(data, true);
                ctrl.showAllContracts = true;
            });
        };
        var processData = function(data, all) {
            ctrl.contracts = data.payload;
            var result = ctrl.contracts.length;
            if (typeof ctrl.currentPage == 'undefined') {
                ctrl.currentPage = 1;
            }
            // page = 1;
            ctrl.entries = result;
            var skip = ctrl.entries * (ctrl.currentPage - 1);
            ctrl.matchedCount = data.matchedCount;
            // ctrl.currentPage = page;
            ctrl.maxPages = Math.ceil(ctrl.matchedCount / ctrl.tableEntries);
            if (all) {
                ctrl.showAllContracts = true;
            }
        };
        ctrl.getNotificationsListPage = function(currentPage, direction) {
            var newPage = currentPage;
            if (direction == 'next') {
                newPage = currentPage + 1;
                ctrl.changePage(newPage);
            }
            if (direction == 'prev') {
                newPage = currentPage - 1;
                ctrl.changePage(newPage);
            }
        };
        ctrl.changePage = function(newPage) {
            ctrl.currentPage = newPage;
            var pagination = {};
            pagination.start = newPage * ctrl.tableEntries - ctrl.tableEntries;
            pagination.length = ctrl.tableEntries;
            if (ctrl.showAllContracts) {
                ctrl.displayAllContracts(pagination, ctrl.search_contract);
            } else {
                ctrl.initContractTable(pagination, ctrl.search_contract);
            }
        };
        ctrl.initTableScale = function() {
            setTimeout(() => {
                $('.custom-hardcoded-table table').css('display', 'none');
                $('.custom-hardcoded-table').css('max-width', function() {
                    return `${$($(this).parent()).width() }px`;
                });
                $('.custom-hardcoded-table table').css('display', 'initial');
            }, 500);
        };
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
        ctrl.checkProductsActionForCancelLocation = function(location) {
            var canCancelLocation = false;
            $.each(location.products, (pk, pv) => {
                if (pv.id) {
                    $.each(pv.screenActions, (sak, sav) => {
                        if (sav.name == SCREEN_ACTIONS.CANCEL) {
                            canCancelLocation = true;
                        }
                    });
                }
            });
            if (canCancelLocation) {
                return true;
            }
            if(location.portStatus.name === 'Stemmed') {
                toastr.error('Order stemmed for the location and can\'t be removed');
            } else {
                toastr.error('The location is already cancelled');
            }
            return false;
        };
        ctrl.parseStatuses = function() {
            if (typeof ctrl.STATUS == 'undefined') {
                ctrl.STATUS = {};
            }
            $.each($listsCache.Status, (key, val) => {
                ctrl.STATUS[val.name] = val;
            });
        };
        ctrl.parseStatuses();
        ctrl.canCancelProduct = function(product) {
            var canCancel = false;
            $.each(product.screenActions, (k, v) => {
                if (v.name == SCREEN_ACTIONS.CANCEL) {
                    canCancel = true;
                }
            });
            return canCancel;
        };
        $(window).resize(() => {
            ctrl.initTableScale();
        });

        ctrl.isEnabledEta = function(locationIndex) {
            // 1. new request, enable eta
            if (!$stateParams.requestId) {
                $.each(ctrl.request.locations, (locationIndex, value) => {
                    ctrl.etaEnabled[locationIndex] = true;
                });
                return;
            }
            // 2. edit request
            $.each(ctrl.request.locations, (locationIndex, value) => {
                // for each location, check if eta should be enabled
                if (ctrl.requestTenantSettings.recentEta.id == 1) {
                    // recent eta is displayed
                    // now check if eta is editable
                    if (ctrl.shouldBeFreezed(locationIndex)) {
                        ctrl.etaEnabled[locationIndex] = false;
                        // return false;
                        // if etaFreezeStatus matches current location status, eta disabled
                    } else {
                        // else return true
                        // return true;
                        ctrl.etaEnabled[locationIndex] = true;
                    }
                } else {
                    // else recent eta not displayed, eta is editable
                    // return true;
                    ctrl.etaEnabled[locationIndex] = true;
                }
            });
        };
        ctrl.shouldBeFreezed = function(locationIndex) {
            // 1. current status order
            /* $.each(ctrl.RequestStatusesOrdered, function(key,val){
                if(val.id == ctrl.request.requestStatus.id){
                    currentStatusOrder = val.requestStatusOrder;
                }
            });*/
            if (locationIndex == null) {
                return;
            }
            // 1. current location status order
            let currentStatusOrder = 0;
            $.each(ctrl.RequestStatusesOrdered, (key, val) => {
                if (typeof ctrl.request.locations[locationIndex].portStatus != 'undefined') {
                    if (ctrl.request.locations[locationIndex].portStatus != null) {
                        if (val.id == ctrl.request.locations[locationIndex].portStatus.id) {
                            currentStatusOrder = val.requestStatusOrder;
                        }
                    }
                } else {
                    // new location
                    return false; // not freezed
                }
            });
            // 2. get eta freeze status order
            let etaStatusOrder = 99;
            // set etaStatusOrdern to a big number, if it doesn't match in  ctrl.RequestStatusesOrdered or is not defined, let ETA unfreezed.
            $.each(ctrl.RequestStatusesOrdered, (key, val) => {
                if (ctrl.requestTenantSettings.etaFreezeStatus != 'undefined') {
                    if (ctrl.requestTenantSettings.etaFreezeStatus != null) {
                        if (val.id == ctrl.requestTenantSettings.etaFreezeStatus.id) {
                            etaStatusOrder = val.requestStatusOrder;
                        }
                    }
                }
            });
            if (etaStatusOrder <= currentStatusOrder) {
                return true;
            } // freeze
            return false;
        };

        ctrl.datesValid = function(locationIdx, date) {
            if (ctrl.request.locations[locationIdx].deliveryTo != null && ctrl.request.locations[locationIdx].deliveryFrom != null && typeof ctrl.request.locations[locationIdx].deliveryTo != 'undefined' && typeof ctrl.request.locations[locationIdx].deliveryFrom != 'undefined') {
                if (ctrl.request.locations[locationIdx].deliveryFrom <= ctrl.request.locations[locationIdx].deliveryTo) {
                    return false;
                }
                return true;
            }
            return false;
        };
        ctrl.getRequestStatusesOrdered = function() {
            newRequestModel.getRequestStatusesOrdered().then(
                (responseData) => {
                    ctrl.RequestStatusesOrdered = responseData.payload;
                    console.log(ctrl.RequestStatusesOrdered);
                },
                () => {}
            );
        };
        if (ctrl.requestId) {
	        ctrl.getRequestStatusesOrdered();
        }

        ctrl.savePageSize = function(size) {
            ctrl.tableLength.layout = size;
            let payload = ctrl.tableLength;
            uiApiModel.saveListLayout('requestsContractList', payload).then((data) => {
                if (data.isSuccess) {
                    toastr.success('Layout successfully saved');
                }
            });
        };

        ctrl.goToContractsSection = function() {
            window.scrollTo({
                top: 9999,
                behavior: 'smooth'
            });
        };

        //  changed procurement lookups
        // ctrl.triggerModal = function(template, clc, name, id, formvalue, idx, field_name, filter) {
        //     data = {
        //         'template': template,
        //         'clc': clc,
        //         'name': name,
        //         'id': id,
        //         'formvalue': formvalue,
        //         'idx': idx,
        //         'field_name': field_name,
        //         'filter': filter
        //     }
        //     $scope.$emit('triggerListModal',{ 'listOptions': data });
        // }
        $scope.modalGetIndex = function(str) {
            str = str.split('[')[1];
            str = str.split(']')[0];
            return str;
        };
        $scope.$on('dataListModal', (e, a) => {
            if (typeof a.elem != 'undefined') {
                if (typeof a.val != 'undefined') {
                    if (a.elem[a.elem.length - 1] == 'vesselImoNo') {
                        ctrl.request.vesselDetails.vesselImoNo = ctrl.getImoObj(a.val.id);
                        ctrl.selectVessel(ctrl.request.vesselDetails.vesselImoNo.id);
                        return;
                    }
                    if (a.elem[a.elem.length - 1] == 'vessel') {
                        ctrl.selectVessel(a.val.id);
                        return;
                    }

                    if (a.elem[a.elem.length - 1] == 'autocompleteContract') {
                        ctrl.selectContract(a.val.id1);
                        return;
                    }
                    if (a.elem[a.elem.length - 1] == 'Operator') {
                        ctrl.request.operatorBy = a.val;
                        ctrl.captureReasonModal(null,null,"REQUEST_OPERATOR", "operatorBy");
                        return;
                    }
                    if (a.elem[a.elem.length - 1] == 'new_location') {
                        // var location = ctrl.getLocationObj(a.val.id);
                        // $scope.addTypeLocation(location.id, location);
                        // var location = ctrl.getLocationObj(a.val.id);
                        $scope.addTypeLocation(a.val.id, a.val);
                        return;
                    }
                    if (a.elem[a.elem.length - 2].indexOf('location') >= 0) {
                        // location lookups
                        if (a.elem[a.elem.length - 1] == 'service') {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            ctrl.selectServiceInLocation(a.val.id, idx);
                        }
                        if (a.elem[a.elem.length - 1] == 'agent') {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            a.val.name = decodeHtmlEntity(_.unescape(a.val.name));
                            ctrl.request.locations[idx].agent = a.val;
                        }
                        if (a.elem[a.elem.length - 1] == 'buyer') {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            ctrl.captureReasonModal(idx, null, 'REQUEST_LOCATION_BUYER', 'buyer');
                            a.val.name = decodeHtmlEntity(_.unescape(a.val.name));
                            ctrl.request.locations[idx].buyer = a.val;
                        }
                        if (a.elem[a.elem.length - 1] == 'destinationInput') {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            if(a.val.voyageCode) {
                                a.val.name = `${a.val.locationCode } - ${ a.val.voyageCode } - ${ a.val.etaFormated}`;
                            }
                        	ctrl.selectDestinationPort(a.val, idx);

                            // ctrl.request.locations[idx].destination = {
                            //   id: a.val.locationId,
                            //   name: a.val.name,
                            // };
                            // ctrl.request.locations[idx].destinationVesselVoyageDetailId = a.val.vesselVoyageDetailId;
                        }
                        if (a.elem[a.elem.length - 1] == 'company') {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            ctrl.selectCompanyInLocation(a.val.id, idx);
                            ctrl.request.locations[idx].company = a.val;
                        }
                        if (a.elem[a.elem.length - 1].indexOf('products') >= 0) {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            let idx2 = $scope.modalGetIndex(a.elem[a.elem.length - 1]);
                            let prod = ctrl.getProductObj(a.val.id);
                            ctrl.selectProduct(prod.id);
                            ctrl.request.locations[idx].products[idx2].product = prod;
                        }
                    } else if (a.elem.indexOf('company') != -1) {
                    		ctrl.request.company = a.val;
                    	}
                    if (a.elem[a.elem.length - 1] == 'service') {
                        ctrl.selectService(a.val.id);
                        return;
                    }
                }
            }
        });

        ctrl.isOperatorRequired = function(){

            if(ctrl.requestTenantSettings.isRequestOperatorMandatory) {

                if (ctrl.request.operatorEmail !== "" && ctrl.request.operatorEmail !==undefined  && ctrl.request.operatorEmail !== null ) {
                    return false;
                }

                return true;
            }

            return false;
        }
        ctrl.selectDestinationPort = function(data, locationIdx) {
            let nextAvailableDestinationIndex = '';
            if (!ctrl.request.locations[locationIdx].destination4) {
                nextAvailableDestinationIndex = 4;
            }
            if (!ctrl.request.locations[locationIdx].destination3) {
                nextAvailableDestinationIndex = 3;
            }
            if (!ctrl.request.locations[locationIdx].destination2) {
                nextAvailableDestinationIndex = 2;
            }
            if (!ctrl.request.locations[locationIdx].destination1) {
                nextAvailableDestinationIndex = 1;
            }
            if (!ctrl.request.locations[locationIdx].destination) {
                nextAvailableDestinationIndex = '';
            }
            ctrl.request.locations[locationIdx].destinationInput = null;

            if (
                ctrl.request.locations[locationIdx].destination &&
                ctrl.request.locations[locationIdx].destination1 &&
                ctrl.request.locations[locationIdx].destination2 &&
                ctrl.request.locations[locationIdx].destination3 &&
                ctrl.request.locations[locationIdx].destination4
            ) {
                toastr.warning('You can select up to 5 Destination Ports');
                ctrl.getLowestEtaForDestinationInLocation(locationIdx);
                return;
            }

            var allDestinations = [
                ctrl.request.locations[locationIdx].destination ? ctrl.request.locations[locationIdx].destination : undefined,
                ctrl.request.locations[locationIdx].destination1 ? ctrl.request.locations[locationIdx].destination1 : undefined,
                ctrl.request.locations[locationIdx].destination2 ? ctrl.request.locations[locationIdx].destination2 : undefined,
                ctrl.request.locations[locationIdx].destination3 ? ctrl.request.locations[locationIdx].destination3 : undefined,
                ctrl.request.locations[locationIdx].destination4 ? ctrl.request.locations[locationIdx].destination4 : undefined
            ];
            var allEta = [
                ctrl.request.locations[locationIdx].destinationEta ? ctrl.request.locations[locationIdx].destinationEta: undefined,
                ctrl.request.locations[locationIdx].destination1Eta ? ctrl.request.locations[locationIdx].destination1Eta: undefined,
                ctrl.request.locations[locationIdx].destination2Eta ? ctrl.request.locations[locationIdx].destination2Eta: undefined,
                ctrl.request.locations[locationIdx].destination3Eta ? ctrl.request.locations[locationIdx].destination3Eta: undefined,
                ctrl.request.locations[locationIdx].destination4Eta ? ctrl.request.locations[locationIdx].destination4Eta: undefined
            ];
            // allDestinations = _.compact(allDestinations);
            var duplicateDestination = false;
            $.each(allDestinations, (k, v) => {
                if (v) {
                    if (v.id == data.id) {
                        if (data.eta == allEta[k]) {
                            duplicateDestination = true;
                        }
                    }
                }
            });
            if (duplicateDestination) {
                toastr.warning('The same Destination cannot be added more than once!');
                ctrl.getLowestEtaForDestinationInLocation(locationIdx);
                return;
            }


            ctrl.request.locations[locationIdx][`destination${ nextAvailableDestinationIndex }VesselVoyageDetailId`] = data.destinationVesselVoyageDetailId;
            //
            ctrl.request.locations[locationIdx][`destination${ nextAvailableDestinationIndex}`] = {
                id: data.id,
                name: data.name,
            };
            ctrl.request.locations[locationIdx][`destination${ nextAvailableDestinationIndex }VesselVoyageDetailId`] = data.vesselVoyageDetailId;
            ctrl.request.locations[locationIdx][`destination${ nextAvailableDestinationIndex }Eta`] = data.eta;

            ctrl.getLowestEtaForDestinationInLocation(locationIdx);
        };

        ctrl.getLowestEtaForDestinationInLocation = function(locationIdx) {
            let lowestEta = '9999-12-30T00:00:00.0000000Z';
            ctrl.request.locations[locationIdx].destinationInput = null;
            if (ctrl.request.locations[locationIdx].destinationEta) {
                if (moment.utc(ctrl.request.locations[locationIdx].destinationEta).isBefore(moment.utc(lowestEta))) {
                    lowestEta = ctrl.request.locations[locationIdx].destinationEta;
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination;
                }
            }
            if (ctrl.request.locations[locationIdx].destination1Eta) {
                if (moment.utc(ctrl.request.locations[locationIdx].destination1Eta).isBefore(moment.utc(lowestEta))) {
                    lowestEta = ctrl.request.locations[locationIdx].destination1Eta;
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination1;
                }
            }
            if (ctrl.request.locations[locationIdx].destination2Eta) {
                if (moment.utc(ctrl.request.locations[locationIdx].destination2Eta).isBefore(moment.utc(lowestEta))) {
                    lowestEta = ctrl.request.locations[locationIdx].destination2Eta;
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination2;
                }
            }
            if (ctrl.request.locations[locationIdx].destination3Eta) {
                if (moment.utc(ctrl.request.locations[locationIdx].destination3Eta).isBefore(moment.utc(lowestEta))) {
                    lowestEta = ctrl.request.locations[locationIdx].destination3Eta;
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination3;
                }
            }
            if (ctrl.request.locations[locationIdx].destination4Eta) {
                if (moment.utc(ctrl.request.locations[locationIdx].destination4Eta).isBefore(moment.utc(lowestEta))) {
                    lowestEta = ctrl.request.locations[locationIdx].destination4Eta;
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination4;
                }
            }
            if (!ctrl.request.locations[locationIdx].destinationInput) {
                if (ctrl.request.locations[locationIdx].destination4) {
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination4;
                }
                if (ctrl.request.locations[locationIdx].destination3) {
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination3;
                }
                if (ctrl.request.locations[locationIdx].destination2) {
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination2;
                }
                if (ctrl.request.locations[locationIdx].destination1) {
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination1;
                }
                if (ctrl.request.locations[locationIdx].destination) {
                    ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination;
                }
            }
        };

        ctrl.getImoObj = function(vesselId) {
            let found = null;
            $.each(ctrl.listsCache.VesselWithImo, (key, val) => {
                if (val.id == vesselId) {
                    found = val;
                }
            });
            return found;
        };
        ctrl.getProductObj = function(prodId) {
            let found = null;
            $.each(ctrl.listsCache.Product, (key, val) => {
                if (val.id == prodId) {
                    found = val;
                }
            });
            return found;
        };
        ctrl.getLocationObj = function(locId) {
            let found = null;
            $.each(ctrl.listsCache.Location, (key, val) => {
                if (val.id == locId) {
                    found = val;
                }
            });
            return found;
        };

        ctrl.goToReport = function() {
			var win = window.open("/#/reports/operationalreport/" + ctrl.computedReportUrl, '_blank');
			win.focus();
        }
		ctrl.getOperationalReportParameters = function() {
            if (!ctrl.requestTenantSettings.showOperationalReport || ctrl.tenantSettings.shiptechLite) return;
			serviceId = ctrl.request.operationalReportServiceId;
			console.log(serviceId);
			ctrl.enableReport = false;
			$http.post(`${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/reports/getOperationalReportParameters`, { Payload: serviceId }).then(
			    (response) => {
			        if (response.status == 200) {
			        	console.log(response.data);
			        	ctrl.computedReportUrl = serviceId;
						$.each(response.data.payload.serLocIds, function(k,v){
							if (v.id == 1) {
								serlocid1 = v.serviceLocationId
								ctrl.computedReportUrl += "/" + serlocid1;
							}
							if (v.id == 2) {
								serlocid2 = v.serviceLocationId
								ctrl.computedReportUrl += "/" + serlocid2;
							}
							if (v.id == 3) {
								serlocid3 = v.serviceLocationId
								ctrl.computedReportUrl += "/" + serlocid3;
							}
							if (v.id == 4) {
								serlocid4 = v.serviceLocationId
								ctrl.computedReportUrl += "/" + serlocid4;
							}
							if (v.id == 5) {
								serlocid5 = v.serviceLocationId
								ctrl.computedReportUrl += "/" + serlocid5;
							}
							if (v.id == 6) {
								serlocid6 = v.serviceLocationId
								ctrl.computedReportUrl += "/" + serlocid6;
							}
						})
						console.log(ctrl.computedReportUrl);
						ctrl.enableReport = true;
			        } else {
                        if (window.location.href.indexOf("group-of-requests") == -1) {
			                toastr.error('Error occured while getting reports data!');
                        }
			        }
			    }
			);
			setTimeout(function(){
			},4000)
		}

        ctrl.getServiceIdForReport = function() {
        	if (!ctrl.requestTenantSettings || !ctrl.request.locations) {
        		return;
        	}
            let computedServiceId = 0;
            if (ctrl.requestTenantSettings.displayOfService.internalName == 'PortSection') {
                let servicesEtas = [];
                $.each(ctrl.request.locations, (k, v) => {
                    if (v.service) {
                        if (v.service.id) {
                            let currentDateEta = null;
                            if (v.recentEta) {
                                currentDateEta = v.recentEta;
                            }
                            if (v.eta) {
                                currentDateEta = v.eta;
                            }
                            servicesEtas.push([ v.service.id, currentDateEta ]);
                        }
                    }
                });
                let minIdx = 0;
                for(let i = 0; i < servicesEtas.length; i++) {
				    if(servicesEtas[i][1] < servicesEtas[minIdx][1]) {
                        minIdx = i;
                    }
                }
                if (servicesEtas.length > 0) {
                    computedServiceId = servicesEtas[minIdx][0];
                }
            } else if (ctrl.request.vesselDetails) {
                if (ctrl.request.vesselDetails.service) {
                    computedServiceId = ctrl.request.vesselDetails.service.id;
                }
            }
            return computedServiceId;
        	// console.log();
        };
        ctrl.getSerLocId1ForReport = function() {
            if (!ctrl.requestTenantSettings || !ctrl.request.locations) {
                return;
            }
            if (ctrl.request) {
                if (ctrl.request.serlocid1) {
                    return ctrl.request.serlocid1;
                } else if (ctrl.request.serlocid2) {
                    return ctrl.request.serlocid2;
                }

            }
        }
        ctrl.getSerLocId2ForReport = function() {
            if (!ctrl.requestTenantSettings || !ctrl.request.locations) {
                return;
            }
            if (ctrl.request) {
                if (ctrl.request.serlocid2) {
                    return ctrl.request.serlocid2;
                } else if (ctrl.request.serlocid1) {
                    return ctrl.request.serlocid1;
                }

            }
        }

        function IsDataExists(data) {
            if (data == "" || data == null || data == undefined) {
                return true;
            } else {
                return false;
            }
        }
        function IsZeroOrHigher(data) {
            if (data >= 0) {
                return false;
            } else {
                return true;
            }
        }
          // modal close
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
                // $(".modal-scrollable").css("display", "none")
            }, 500);
        };
        ctrl.showDestinations = function(locationIdx, event) {
        	console.log(ctrl.request.locations[locationIdx]);
        	console.log(event);
        };

        $scope.$on('getSelectedPortMinQty', (_evt, value,EnableSingleselect,Page) => {
            ctrl.EnableSingleSelect = EnableSingleselect;
            if(Page == 'NewRequestMinQty'){
                ctrl.request.minimumQuantitiesToReach=angular.copy(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[ctrl.CurrentSelectRow]);
                if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length>1){
                    for(let i=0;i<ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length;i++){
                        if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[i].port.id==value.id){
                            ctrl.request.minimumQuantitiesToReach.port.id="";
                            ctrl.request.minimumQuantitiesToReach.port.name="";
                            ctrl.request.minimumQuantitiesToReach.portid="";
                            break;
                        }else{
                            ctrl.request.minimumQuantitiesToReach.port.id=value.id;
                            ctrl.request.minimumQuantitiesToReach.port.name=value.name;
                            ctrl.request.minimumQuantitiesToReach.portid=value.id;
                        }
                    }
                }else{
                    ctrl.request.minimumQuantitiesToReach.port.id=value.id;
                    ctrl.request.minimumQuantitiesToReach.port.name=value.name;
                    ctrl.request.minimumQuantitiesToReach.portid=value.id;
                }
                ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[ctrl.CurrentSelectRow]=angular.copy(ctrl.request.minimumQuantitiesToReach);
            }
        });
        $scope.deleteMinimumQuantityToReach = function(key) {
            if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[key]){
                ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[key].isDeleted = true;
                $rootScope.RootTempMinQtyToReach[key].isDeleted = true;
            }
            else
            ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.splice(key, 1);
        }
        ctrl.changeValue=function(key){
            $('#'+key).removeClass('ng-cus-invalidcolor');
        }
        ctrl.etaDateChange=function(key,value){
            if(value>ctrl.request.locations[ctrl.selectedLocationIdx].eta){
                ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[key].eta=value;
            }else{
                ctrl.validateEtaDateFields(ctrl.CurrentSelectRow,portDetails.eta,"");
                ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[key].eta=null;
            }
        }
        //MinimumQuantitytoReach save
        $scope.saveMinimumQuantityToReach = function() {
            if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length > 0 && !$scope.etaDatevalid)
            {
                var isvalidminQtyTOReach= true;
                var isvalidminmaxqty = true;
                var FormvalueLength = ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length-1;
                for(let k = 0; k < ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length; k++)
                {
                    let v = ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[k];
                    if(v.isDeleted!=true ){
                        if(FormvalueLength != k ) {
                            if(IsZeroOrHigher(v.minQtyToReach) || IsZeroOrHigher(v.minQtyToReachPretest) ||IsDataExists(v.minQtyToReach)  ||IsDataExists(v.minQtyToReachPretest) || IsDataExists(v.eta) || IsDataExists(v.port.id)){
                                isvalidminQtyTOReach = false;
                                if(IsDataExists(v.minQtyToReachPretest) ){
                                    $('#minQtyToReachPretest'+k).addClass('ng-cus-invalidcolor');
                                }
                                if(IsDataExists(v.minQtyToReach) ){
                                    $('#minQtyToReach'+k).addClass('ng-cus-invalidcolor');
                                }
                                if(IsDataExists(v.port.id)){
                                    $('#Port'+k).addClass('ng-cus-invalidcolor');
                                }
                                if (IsDataExists(v.eta)) {
                                    $(k + '#_etaMQTR').addClass('ng-cus-invalidcolor');
                                }
                                break;
                            }
                            else if(parseInt(v.minQtyToReach)<parseInt(v.minQtyToReachPretest) ){
                                $('#minQtyToReach'+k).addClass('ng-cus-invalidcolor');
                                isvalidminmaxqty = false;
                                break;
                            }
                        }
                        else{
                            if(IsZeroOrHigher(v.minQtyToReach) ||IsZeroOrHigher(v.minQtyToReachPretest) || IsDataExists(v.minQtyToReach) ||IsDataExists(v.minQtyToReachPretest)    || IsDataExists(v.eta) || IsDataExists(v.port.id)){
                                isvalidminQtyTOReach = false;
                                if(IsDataExists(v.minQtyToReachPretest)  ){
                                    $('#minQtyToReachPretest'+k).addClass('ng-cus-invalidcolor');
                                }
                                if(IsDataExists(v.minQtyToReach) ){
                                    $('#minQtyToReach'+k).addClass('ng-cus-invalidcolor');
                                }
                                if(IsDataExists(v.port.id)){
                                    $('#Port'+k).addClass('ng-cus-invalidcolor');
                                }
                                if(IsDataExists(v.eta)){
                                    $(k+'#_etaMQTR').addClass('ng-cus-invalidcolor');
                                }
                                break;
                            }
                            else if(parseInt(v.minQtyToReach)<parseInt(v.minQtyToReachPretest) ){
                                $('#minQtyToReach'+k).addClass('ng-cus-invalidcolor');
                                isvalidminmaxqty = false;
                                break;
                            }
                            else{
                                $scope.prettyCloseModal();
                            }
                        }
                    }
                }
                if(!isvalidminQtyTOReach){
                    toastr.error('Please fill all required details');
                    return
                }
                if(!isvalidminmaxqty){
                    toastr.error(' Quantity without Pretest must be great than or equal to Quantity with Pretest ');
                    return
                }
                ctrl.captureReasonModal(ctrl.selectedLocationIdx, ctrl.selectedProductIdx, 'REQUEST_PRODUCT_MTR', 'minimumQuantitiesToReach');
                $scope.prettyCloseModal();
            }
        };
        /*MinimumQuantitytoReach Popup Close Modal start*/
        $scope.PopupprettyCloseModal = function(){
            if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length>0){
                for(let i=0;ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length>i;i++){
                    if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[i].port.id==0 
                        || ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[i].eta==null
                        || ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[i].minQtyToReachPretest==undefined
                        || ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[i].minQtyToReach==undefined){
                        ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.splice(i,1);
                    }
                }
            }
            $scope.prettyCloseModal();
        };
        ctrl.getVesselSchedules = function(param, locationId) {
            ctrl.EnableSingleSelect = false;
        	if (ctrl.request.vesselDetails.vessel) {
	        	if (ctrl.request.vesselDetails.vessel.id) {
                    let locationFilterModel = {
                        ColumnName: 'LocationId',
                        OperationType: 0,
                        ValueType: 5,
                        Value: null
                    }
                    let selectedBunkerPort = ctrl.request?.locations;
                    
                    let filterPayload = [
                        {
                            ColumnName: 'Id',
                            OperationType: 0,
                            ValueType: 5,
                            Value: ctrl.request?.vesselDetails?.vessel?.id
                        }
                    ];
                    if(param && param=='portCall' && selectedBunkerPort?.length) {
                        ctrl.EnableSingleSelect = true;
                        let locationFilter = selectedBunkerPort.map(location=> {
                            if(locationId == location?.location?.id) {
                                locationFilterModel.value = location?.location?.id;
                                return locationFilterModel;
                            }
                        }).filter(Boolean);
                        filterPayload.push(...locationFilter);

                    }
                    $scope.$broadcast('getVesselSchedules', ctrl.request.vesselDetails.vessel.id, ctrl.EnableSingleSelect,'NewRequest', filterPayload);
	        	}
        	}
        };
        ctrl.formatPortCallFilter = function(param) {
            let locationFilterModel = {
                ColumnName: 'LocationId',
                OperationType: 0,
                ValueType: 5,
                Value: null
            }
            let selectedBunkerPort = ctrl.request?.locations;
            
            let filterPayload = [
                {
                    ColumnName: 'Id',
                    OperationType: 0,
                    ValueType: 5,
                    Value: ctrl.request?.vesselDetails?.vessel?.id
                }
            ];
            if(param && param=='portCall' && selectedBunkerPort?.length) {
                let locationFilter = selectedBunkerPort.map(location=> {
                    locationFilterModel.value = location?.location?.id;
                    return locationFilterModel;
                })
                filterPayload.push(...locationFilter);
            }
            return filterPayload;
        };
        ctrl.getVesselSchedulesSingleselect = function(key) {
            ctrl.EnableSingleSelect = true;
            ctrl.CurrentSelectRow =key;
        	if (ctrl.request.vesselDetails.vessel) {
	        	if (ctrl.request.vesselDetails.vessel.id) {

                    $scope.$broadcast('getVesselSchedules', ctrl.request.vesselDetails.vessel.id, true,'NewRequest1');
	        	}
        	}
        };

        $(document).on('keyup', '.typeahead', (ev, suggestion) => {
        	if ($('[uib-typeahead-popup]').is(':visible')) {
        		if ($(ev.target).attr('typeahead-append-to') == '\'body\'') {
                    $('[uib-typeahead-popup]').css('top', '');
                    $('[uib-typeahead-popup]').css('left', '');
        			var currentTargetTopPosition = $(ev.target).offset().top;
        			var currentTargetLeftPosition = $(ev.target).offset().left;
        			var currentTargetHeight = parseFloat($(ev.target).css('height'));
        			$('[uib-typeahead-popup]').css('top', currentTargetTopPosition + currentTargetHeight);
        			$('[uib-typeahead-popup]').css('left', currentTargetLeftPosition);
        		}
        	}
        });
        ctrl.formatDate = function(elem, dateFormat) {
            if (elem) {
                var formattedDate = elem;
                var dateFormat = ctrl.tenantSettings.tenantFormats.dateFormat.name;
                var hasDayOfWeek = false;
                if (dateFormat.startsWith('DDD ')) {
                    hasDayOfWeek = true;
                    dateFormat = dateFormat.split('DDD ')[1];
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
                return formattedDate.split('00:00')[0];
            }
            else{
                return null;
            }
        };
        //selected Port on change to fill the eta date
        ctrl.selectedPortOnChange=function(portDetails,key){
            ctrl.CurrentSelectRow=key;
            ctrl.request.minimumQuantitiesToReach=angular.copy(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[ctrl.CurrentSelectRow]);
            if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length>0){
                for(let i=0;i<ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length;i++){
                    if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[i].port.id==portDetails.id){
                        ctrl.request.minimumQuantitiesToReach.port.id="";
                        ctrl.request.minimumQuantitiesToReach.port.name="";
                        ctrl.request.minimumQuantitiesToReach.portid="";
                        break;
                    }else{
                        ctrl.request.minimumQuantitiesToReach.port.id=portDetails.id;
                        ctrl.request.minimumQuantitiesToReach.port.name=portDetails.name;
                        ctrl.request.minimumQuantitiesToReach.portid=portDetails.id;
                    }
                }
            }           
            ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach[key]=angular.copy(ctrl.request.minimumQuantitiesToReach);
        }

        /* Request.Product - Min Qty to Reach */
        $scope.openMinQtyToReach = function(productIdx, currProd,locationIdx) {
            ctrl.selectedLocationIdx=locationIdx;
            ctrl.selectedProductIdx=productIdx;
            ctrl.selProductIdx=productIdx+locationIdx;          
            if(currProd.products[ctrl.selectedProductIdx].minimumQuantitiesToReach != undefined)
            {
                if($rootScope.RootTempMinQtyToReach==undefined)
                {
                    $rootScope.RootTempMinQtyToReach = angular.copy(currProd.products[ctrl.selectedProductIdx].minimumQuantitiesToReach);          
                }
            }
            if(ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach== undefined || ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.length==0 ){
                ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach=[];
                ctrl.request.locations[ctrl.selectedLocationIdx].products[ctrl.selectedProductIdx].minimumQuantitiesToReach.push({'id':0,'port':{'id': 0,'name': '',},'portid':0,'eta':null,'isDeleted':false});
            }
            tpl = $templateCache.get('app-general-components/views/modal_RequestMinimumQuantityToReach.html');
            $scope.modalInstance = $uibModal.open({
                template: tpl,
                size: 'full',
                appendTo: angular.element(document.getElementsByClassName('page-container')),
                windowTopClass: 'fullWidthModal',
                scope: $scope // passed current scope to the modal
            });
        };
        


/* Capture reason for change */
        ctrl.captureReasonModal = (locationIndex, productIndex, changedFieldName, modelProperty) => {
            if(ctrl.request.id == 0 || !ctrl.selectedVessel.isVesselManagable) {
                return false;
            }
            fieldChanged = ctrl.checkIfFieldChanged(locationIndex, productIndex, changedFieldName, modelProperty);
            if (!fieldChanged) {
                return false
            }

            ctrl.captureReasonModalData = {};
            ctrl.captureReasonModalData.changedFieldName = changedFieldName;
            ctrl.captureReasonModalData.locationIndex = locationIndex;
            ctrl.captureReasonModalData.productIndex = productIndex;
            ctrl.captureReasonModalData.field = ctrl.getReasonField(changedFieldName);
            ctrl.captureReasonModalData.requestLocation = locationIndex !== null ? ctrl.request.locations[locationIndex].location.id : null;
            ctrl.captureReasonModalData.location = locationIndex !== null ? ctrl.request.locations[locationIndex].location : null;
            ctrl.captureReasonModalData.requestLocationId = locationIndex !== null ? ctrl.request.locations[locationIndex].id : null;
            ctrl.captureReasonModalData.requestProductId = locationIndex !== null && productIndex !== null ? ctrl.request.locations[locationIndex].products[productIndex].id : null;
            ctrl.captureReasonModalData.product = locationIndex !== null && productIndex !== null ? ctrl.request.locations[locationIndex].products[productIndex].product : null;
        }
        ctrl.getReasonField = (fieldName) => {
            var foundField = false;
            $.each(ctrl.listsCache.FieldName, (k,v) => {
                if (v.name == fieldName) {
                    foundField = v;
                }
            })
            return foundField;
        } 
        ctrl.saveCapturedReason = () => {
            if(!ctrl.captureReasonModalData.reason) {
                toastr.error("Please select a reason for change");
                return;
            }  
            if(ctrl.captureReasonModalData.reason.name == "Other" && !ctrl.captureReasonModalData.comments ) {
                toastr.error("Please select a comment for the reason");
                return;
            }  

            if(ctrl.captureReasonModalData.locationIndex == null) {
                ctrl.request.tempReasons[ctrl.captureReasonModalData.changedFieldName] = ctrl.buildReasonDataStructure();
            } else {

                if (ctrl.captureReasonModalData.productIndex == null) {
                    if(!ctrl.request.locations[ctrl.captureReasonModalData.locationIndex].tempReasons) {
                        ctrl.request.locations[ctrl.captureReasonModalData.locationIndex].tempReasons = {}
                    }
                    ctrl.request.locations[ctrl.captureReasonModalData.locationIndex].tempReasons[ctrl.captureReasonModalData.changedFieldName] = ctrl.buildReasonDataStructure();
                } else {
                    if (!ctrl.request.locations[ctrl.captureReasonModalData.locationIndex].products[ctrl.captureReasonModalData.productIndex].tempReasons) {
                        ctrl.request.locations[ctrl.captureReasonModalData.locationIndex].products[ctrl.captureReasonModalData.productIndex].tempReasons = {}
                    }
                    ctrl.request.locations[ctrl.captureReasonModalData.locationIndex].products[ctrl.captureReasonModalData.productIndex].tempReasons[ctrl.captureReasonModalData.changedFieldName] = ctrl.buildReasonDataStructure();
                }
            }            
            if (ctrl.captureReasonModalData.changedFieldName == "REQUEST_PRODUCT_CANCEL") {
                ctrl.reasonProvidedForCancellation = true;
                payload = {
                    id : ctrl.request.id,
                    reason : ctrl.buildReasonDataStructure()
                }
                ctrl.canBeCancelledProductFromLocation(null, ctrl.captureReasonModalData.requestProductId, payload);                
            }
            if (ctrl.captureReasonModalData.changedFieldName == "REQUEST_LOCATION_CANCEL") {
                ctrl.reasonProvidedForCancellation = true;
                payload = {
                    id : ctrl.request.id,
                    reason : ctrl.buildReasonDataStructure()
                }
                ctrl.canBeCancelledLocation(ctrl.captureReasonModalData.requestLocationId, payload);                
            }            
            ctrl.captureReasonModalData = null;
        } 
        ctrl.buildReasonDataStructure = () => {
            console.log(ctrl.captureReasonModalData);
            data = {
                "id": 0,
                "requestId" : ctrl.request.id,
                "location" : ctrl.captureReasonModalData.location,
                "product" : ctrl.captureReasonModalData.product,
                "fieldName" : ctrl.captureReasonModalData.field,
                "reasonName" : ctrl.captureReasonModalData.reason,
                "comments" : ctrl.captureReasonModalData.comments

            }
            return data;
        }

        ctrl.checkIfFieldChanged = (locationIndex, productIndex, changedFieldName, modelProperty) => {
            fieldChanged = true;
            if(changedFieldName == "REQUEST_PRODUCT_CANCEL" || changedFieldName == "REQUEST_LOCATION_CANCEL") {
                return true;
            }
            if(locationIndex == null) {
                if (!ctrl.request.tempReasons) {
                    ctrl.request.tempReasons = {};
                }
                if (typeof(ctrl.getRequestinitialSnapshot[modelProperty]) == "object") {
                    if (ctrl.request[modelProperty].id == ctrl.getRequestinitialSnapshot[modelProperty].id) {
                        ctrl.request.tempReasons[changedFieldName] = null;
                        ctrl.captureReasonModalData = null;
                        fieldChanged = false;
                    }
                } else {
                    if (ctrl.request[modelProperty] == ctrl.getRequestinitialSnapshot[modelProperty]) {
                        ctrl.request.tempReasons[changedFieldName] = null;
                        ctrl.captureReasonModalData = null;
                        fieldChanged = false;
                    }                    
                }
            } else {
                if (productIndex == null) {
                    if(ctrl.request.locations[locationIndex].isNew){ 
                        ctrl.request.locations[locationIndex].isNew = false;
                        return true;
                    }
                    if(!ctrl.request.locations[locationIndex].id){ return false}
                    if (!ctrl.request.locations[locationIndex].tempReasons) {
                        ctrl.request.locations[locationIndex].tempReasons = {};
                    }
                    if (typeof(ctrl.getRequestinitialSnapshot.locations[locationIndex][modelProperty]) == "object" ) {
                        if (ctrl.request.locations[locationIndex][modelProperty].id == ctrl.getRequestinitialSnapshot.locations[locationIndex][modelProperty].id) {
                            ctrl.request.locations[locationIndex].tempReasons[changedFieldName] = null;
                            ctrl.captureReasonModalData = null;
                            fieldChanged = false;
                        }
                    } else {
                        if (ctrl.request.locations[locationIndex][modelProperty] == ctrl.getRequestinitialSnapshot.locations[locationIndex][modelProperty]) {
                            ctrl.request.locations[locationIndex].tempReasons[changedFieldName] = null;
                            ctrl.captureReasonModalData = null;
                            fieldChanged = false;
                        }                    
                    }                    
                } else {
                    if (!ctrl.request.locations[locationIndex].products[productIndex].tempReasons) {
                        ctrl.request.locations[locationIndex].products[productIndex].tempReasons = {};
                    }
                    if(!ctrl.request.locations[locationIndex].id ) { /* is new location */
                        return false;
                    }
                    if(ctrl.request.locations[locationIndex].products[productIndex].isNew){ 
                        ctrl.request.locations[locationIndex].products[productIndex].isNew = false;
                        return true;
                    }
                    if(!ctrl.request.locations[locationIndex].products[productIndex].id){ return false}
                    if (typeof(ctrl.getRequestinitialSnapshot.locations[locationIndex].products[productIndex][modelProperty]) == "object" &&  modelProperty != "minimumQuantitiesToReach") {
                        if (ctrl.request.locations[locationIndex].products[productIndex][modelProperty].id == ctrl.getRequestinitialSnapshot.locations[locationIndex].products[productIndex][modelProperty].id) {
                            ctrl.request.locations[locationIndex].products[productIndex].tempReasons[changedFieldName] = null;
                            ctrl.captureReasonModalData = null;
                            fieldChanged = false;
                        }
                    } else {
                        if (ctrl.request.locations[locationIndex].products[productIndex][modelProperty] == ctrl.getRequestinitialSnapshot.locations[locationIndex].products[productIndex][modelProperty]) {
                            ctrl.request.locations[locationIndex].products[productIndex].tempReasons[changedFieldName] = null;
                            ctrl.captureReasonModalData = null;
                            fieldChanged = false;
                        }                    
                    } 
                }
            }
            return fieldChanged;
        }

        ctrl.prepareReasonsForSave = () => {
            if(!ctrl.request.id) {
                return false;
            }  
            if(ctrl.request.tempReasons) {
                Object.keys(ctrl.request.tempReasons).forEach(key => {
                    if(ctrl.request.tempReasons[key]) {
                        ctrl.request.reasons.push(ctrl.request.tempReasons[key]);
                    }
                });
            }
            $.each(ctrl.request.locations, (k,v) => {
                if (v.tempReasons) {
                    Object.keys(v.tempReasons).forEach(key => {
                        if( v.tempReasons[key] ) {
                            ctrl.request.reasons.push(v.tempReasons[key]);
                        }
                    });                    
                }
                $.each(v.products, (k2,v2) => {
                    if (v2.tempReasons) {
                        Object.keys(v2.tempReasons).forEach(key => {
                            if( v2.tempReasons[key] ) {
                                if(!v2.tempReasons[key].product) {
                                    v2.tempReasons[key].product = v2.product;
                                }
                                ctrl.request.reasons.push(v2.tempReasons[key]);
                            }
                        });                    
                    }                    
                })
            })
            
        }

/* END Capture reason for change */


    }
]);
angular.module('shiptech.pages').component('newRequest', {
    templateUrl: 'pages/new-request/views/new-request-component.html',
    controller: 'NewRequestController'
});
