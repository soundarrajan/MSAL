angular.module("shiptech.pages").controller("NewRequestController", [
    "$rootScope",
    "$scope",
    "$q",
    "$listsCache",
    "$element",
    "$attrs",
    "$timeout",
    "$state",
    "$filter",
    "$stateParams",
    "$tenantSettings",
    "newRequestModel",
    "orderModel",
    "listsModel",
    "uiApiModel",
    "lookupModel",
    "groupOfRequestsModel",
    "screenActionsModel",
    "tenantService",
    "Factory_Master",
    "STATE",
    "LOOKUP_MAP",
    "LOOKUP_TYPE",
    "SCREEN_LAYOUTS",
    "SCREEN_ACTIONS",
    "IDS",
    "VALIDATION_MESSAGES",
    "STATUS",
    "PRODUCT_STATUS_IDS",
    "EMAIL_TRANSACTION",
    "$uibTooltip",
    "selectContractModel",
    "$uibModal",
    "$templateCache",
    "$compile",
    "emailModel",
    "statusColors",
    "$location",
	"screenLoader",
    "Factory_Admin",
    function($rootScope, $scope, $q, $listsCache, $element, $attrs, $timeout, $state, $filter, $stateParams, $tenantSettings, newRequestModel, orderModel, listsModel, uiApiModel, lookupModel, groupOfRequestsModel, screenActionsModel, tenantService, Factory_Master, STATE, LOOKUP_MAP, LOOKUP_TYPE, SCREEN_LAYOUTS, SCREEN_ACTIONS, IDS, VALIDATION_MESSAGES, STATUS, PRODUCT_STATUS_IDS, EMAIL_TRANSACTION, $uibTooltip, selectContractModel, $uibModal, $templateCache, $compile, emailModel, statusColors, $location, screenLoader, Factory_Admin) {
        var ctrl = this;

        var voyageId = $stateParams.voyageId;
        var requestId = $stateParams.requestId;
        ctrl.requestId = $stateParams.requestId;
        ctrl.showAllContracts = false;
        $scope.forms = {};
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
            $state.params.title = "Edit Request";
        } else {
            $state.params.title = "New Request";
        }
        tenantService.tenantSettings.then(function(settings) {
            ctrl.numberPrecision = settings.payload.defaultValues;
        });
        tenantService.procurementSettings.then(function(settings) {
            ctrl.requestTenantSettings = settings.payload.request;
        });
        ctrl.previewEmailDisabled = false;

        screenLoader.showLoader();

        ctrl.disableAllFields = false;
        tenantService.emailSettings.then(function(settings){
        	ctrl.emailSettings = settings.payload;
        	// $.each(settings.payload, function(k,v){
        	// 	if (v.process == 'Standard' && v.transactionType.name == "PreRequest" && v.emailType.name == "Manual") {
        	// 		ctrl.sendQuestionnaireEmailType = v.emailType.name;
        	// 		ctrl.sendQuestionnaireEmailTemplate = v.template;
        	// 	}
        	// })
        })
        emailModel.getTemplates(ctrl.emailTransactionTypeId).then(function(data) {
            if (data.payload.length == 0) {
                ctrl.previewEmailDisabled = true;
            }
        });

        Factory_Master.get_master_entity(1, "configuration", "admin", function(callback2) {
            if (callback2) {
                $rootScope.adminConfiguration = callback2;
            }
        });

        /**
         * Perform initializations dependent upon the DOM being ready.
         */
        if (typeof $rootScope.cancelRequestMessage != "undefined") {
            if ($rootScope.cancelRequestMessage) {
                toastr.info($rootScope.cancelRequestMessage, null, { timeOut: 15000 });
                $rootScope.cancelRequestMessage = null;
            }
        }

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            ctrl.contractHasProduct = false;
        });

        ctrl.defaultProductsTooltip = function () {
            var ret = '';
            if (ctrl.selectedVessel && ctrl.selectedVessel.defaultDistillateProduct && ctrl.selectedVessel.distillateSpecGroup) {
                ret += ctrl.selectedVessel.defaultDistillateProduct.name; 
                ret += ' - ' +  ctrl.selectedVessel.distillateSpecGroup.name; 
                ret += '<br>';
            }
            if (ctrl.selectedVessel && ctrl.selectedVessel.defaultLsfoProduct && ctrl.selectedVessel.lsfoSpecGroup) {
                ret += ctrl.selectedVessel.defaultLsfoProduct.name; 
                ret += ' - ' +  ctrl.selectedVessel.lsfoSpecGroup.name; 
                ret += '<br>';
            }
            if (ctrl.selectedVessel && ctrl.selectedVessel.defaultFuelOilProduct && ctrl.selectedVessel.fuelOilSpecGroup) {
                ret += ctrl.selectedVessel.defaultFuelOilProduct.name; 
                ret += ' - ' +  ctrl.selectedVessel.fuelOilSpecGroup.name; 
                ret += '<br>';
            }

            return ret;
        }

        ctrl.serviceTooltip = function(from, serviceLocationIndex) {
            var hsfoValue;
            var dmaValue;
            var lsfoValue;
            var hsfoUom;
            var dmaUom;
            var lsfoUom;
            if (from === 'Vessel' && _.get(ctrl, 'request.vesselDetails.service.name')) {
                hsfoValue = _.get(ctrl, 'request.vesselDetails.service.hsfoValue');
                dmaValue = _.get(ctrl, 'request.vesselDetails.service.dmaValue');
                lsfoValue = _.get(ctrl, 'request.vesselDetails.service.lsfoValue');
                hsfoUom = _.get(ctrl, 'request.vesselDetails.service.hsfoUom');
                dmaUom = _.get(ctrl, 'request.vesselDetails.service.dmaUom');
                lsfoUom = _.get(ctrl, 'request.vesselDetails.service.lsfoUom');
            } else if (from === 'Port' && _.get(ctrl, 'request.locations[' + serviceLocationIndex + '].service.name')) {
                hsfoValue = _.get(ctrl, 'request.locations[' + serviceLocationIndex + '].service.hsfoValue');
                dmaValue = _.get(ctrl, 'request.locations[' + serviceLocationIndex + '].service.dmaValue');
                lsfoValue = _.get(ctrl, 'request.locations[' + serviceLocationIndex + '].service.lsfoValue');
                hsfoUom = _.get(ctrl, 'request.locations[' + serviceLocationIndex + '].service.hsfoUom');
                dmaUom = _.get(ctrl, 'request.locations[' + serviceLocationIndex + '].service.dmaUom');
                lsfoUom = _.get(ctrl, 'request.locations[' + serviceLocationIndex + '].service.lsfoUom');
            } else {
                return;
            }
            var quantityPrecision = _.get(ctrl, 'numberPrecision.quantityPrecision') ? _.get(ctrl, 'numberPrecision.quantityPrecision') : 0;
            var ret = '';
            if (typeof(hsfoValue) != 'undefined' ) {
                ret += 'HSFO : ';
                if (hsfoValue) {
                    ret += String(parseFloat(hsfoValue).toFixed(quantityPrecision));
                    if (hsfoUom) {
                        ret += ' ' + hsfoUom.name; 
                    }
                } else {
                    ret += " - ";
                }
                ret += '<br>';
            }
            if (typeof(dmaValue) != 'undefined') {
                ret += 'MGO : ';
                if (dmaValue) {
                    ret += String(parseFloat(dmaValue).toFixed(quantityPrecision));
                    if (dmaUom) {
                        ret += ' ' + dmaUom.name; 
                    }
                } else {
                    ret += " - ";
                }
                ret += '<br>';
            }
            if (typeof(lsfoValue) != 'undefined') {
                ret += 'ULSFO : ';
                if (lsfoValue) {
                    ret += String(parseFloat(lsfoValue).toFixed(quantityPrecision));
                    if (lsfoUom) {
                        ret += ' ' +  lsfoUom.name; 
                    }
                } else {
                    ret += " - ";
                }
                ret += '<br>';
            }
            return ret;
        };

        ctrl.$onInit = function() {
            screenLoader.showLoader();
            ctrl.checkedProducts = [];
            ctrl.productIds = [];
            // Get the UI settings from server. When complete, get business data.
            uiApiModel
                .get(SCREEN_LAYOUTS.NEW_REQUEST)
                .then(function(data) {

			        Factory_Admin.getAgreementTypeIndividualList(true, function(response) {
			        	ctrl.contractAgreementTypesList = response.payload.contractAgreementTypesList;
			        	ctrl.spotAgreementTypesList = response.payload.spotAgreementTypesList;
			        })	

                    ctrl.ui = data.layout.children.edit;
                    ctrl.screenActions = uiApiModel.getScreenActions();
                    $scope.formFieldsNew = data;
                    //Normalize relevant data for use in template.
                    ctrl.vesselDetailsFields = normalizeArrayToHash(ctrl.ui.vesselDetails.fields, "name");
                    ctrl.productInfoFields = normalizeArrayToHash(ctrl.ui.Locations.fields, "name");
                    ctrl.productInfoColumns = normalizeArrayToHash(ctrl.ui.Locations.columns, "name");
                    $.each(ctrl.productInfoColumns, function(k, v) {
                        if (v.name == "ProductType") {
                            if (ctrl.requestTenantSettings.productTypeInRequest.id == 2) {
                                 delete ctrl.productInfoColumns[k];                           
                            }
                        }
                    })
                    ctrl.ui.Locations.columns  = ctrl.productInfoColumns;
                    ctrl.footerSectionFields = normalizeArrayToHash(ctrl.ui.FooterSection.fields, "name");
                        $timeout(function() {
                            ctrl.agentCounterpartyTypeId = [IDS.AGENT_COUNTERPARTY_ID];
                            initializeLookupInputs();
                        });
                    // listsModel.get().then(function(data) {
                    // });
                    if ($stateParams.copyFrom) {
                        newRequestModel.getDefaultBuyer($stateParams.copyFrom.vesselId).then(function(data) {
                            ctrl.disableAllFields = false;// fields enabled at copy
                            ctrl.request = angular.copy($stateParams.copyFrom);
                            ctrl.request.requestCompleted = false;// fields enabled at copy, send this to be
                            ctrl.request.hasBestContract = false;
                            ctrl.request = traverseObject(ctrl.request, nullifyId);
                            ctrl.request.requestStatus = null;
                            ctrl.request.requestDate = new Date().toJSON();
                            setTimeout(function() {
                            	if (ctrl.request.vesselDetails) {
	                                ctrl.robDetails = ctrl.request.vesselDetails.robDetails;
                            	}
                            }, 100);
                            for (var i = 0; i < ctrl.request.locations.length; i++) {
                                ctrl.request.locations[i].eta = "";
                                ctrl.request.locations[i].recentEta = "";
                                ctrl.request.locations[i].etb = "";
                                ctrl.request.locations[i].etd = "";
                                ctrl.request.locations[i].vesselVoyageDetailId = null;
                                ctrl.request.locations[i].vesselVoyageId = null;
                                ctrl.request.locations[i].buyer = data.payload;
                                ctrl.request.locations[i].agentCounterpartyFreeText = null;
                                ctrl.request.locations[i].deliveryFrom = null;
                                ctrl.request.locations[i].deliveryTo = null;
                                ctrl.request.locations[i].voyageCode = null;
                                ctrl.request.locations[i].portCallId = null;
                                ctrl.request.locations[i].destination = $stateParams.copyFrom.locations[i].destination
                                ctrl.request.locations[i].destinationVesselVoyageDetailId = null;
                                ctrl.request.locations[i].destinationEta = null;
                                // ctrl.request.locations[i].destination = null;
                                ctrl.request.locations[i].requestId = null;
                                for (var j = 0; j < ctrl.request.locations[i].products.length; j++) {
                                	ctrl.request.locations[i].products[j].uniqueIdUI = Math.random().toString(36).substring(7);
                                    ctrl.request.locations[i].products[j].sellers = [];
                                    ctrl.request.locations[i].products[j].productStatus = null;
                                    ctrl.request.locations[i].products[j].workflowId = null;
                                    ctrl.request.locations[i].products[j].requestLocationId = null;
                                    ctrl.request.locations[i].products[j].contract = null;
                                    ctrl.request.locations[i].products[j].contractProductId = null;
                                    ctrl.request.locations[i].products[j].comments = null;
                                    //get cancel action
                                    cancelAction = ctrl.getScreenActionByName(ctrl.SCREEN_ACTIONS.CANCEL);
                                    if (cancelAction != null) {
                                        if (ctrl.request.locations[i].products[j].screenActions == null || typeof ctrl.request.locations[i].products[j].screenActions == "undefined") {
                                            // no actions defined, add cancel
                                            ctrl.request.locations[i].products[j].screenActions = [];
                                            ctrl.request.locations[i].products[j].screenActions.push(cancelAction);
                                        } else {
                                            // some actions defined, add cancel too if not there
                                            found = _.find(ctrl.request.locations[i].products[j].screenActions, ["id", cancelAction.id]);
                                            if (typeof found == "undefined") {
                                                ctrl.request.locations[i].products[j].screenActions.push(cancelAction);
                                            }
                                        }
                                    }
                                }
                            }
                            ctrl.request.requestGroup = null;
                            addDefaultProducts();
                            if (typeof ctrl.request.vesselId != "undefined") if (ctrl.request.vesselId != null) ctrl.selectVessel(ctrl.request.vesselId);
                            ctrl.calculateScreenActions();
                            ctrl.isNewRequest = true;
                            $timeout(function() {
                                ctrl.isEnabledEta();
                            });
                        });
                    } else if (typeof voyageId != "undefined" && voyageId !== null) {
                        newRequestModel.newRequest(voyageId).then(function(newRequestData) {
                            ctrl.request = newRequestData.payload;
                            setPageTitle();
                            setRequestStatusHeader();
                 
                            $scope.productTypesLoadedPerLocation = {
                            	totalProducts : 0,
                            	loadedProducts : 0
                            };

                            for (var j = 0; j < ctrl.request.locations.length; j++) {
                                if (ctrl.requestTenantSettings.recentEta.id == 1 && ctrl.request.locations[j].eta && ctrl.request.locations[j].id) {
                                    if (!ctrl.request.locations[j].recentEta) ctrl.request.locations[j].recentEta = ctrl.request.locations[j].eta;
                                }

				                $scope.productTypesLoadedPerLocation.totalProducts += ctrl.request.locations[j].products.length;
                                for (var i = 0; i < ctrl.request.locations[j].products.length; i++) {
                                    cancelAction = ctrl.getScreenActionByName(ctrl.SCREEN_ACTIONS.CANCEL);
                                    if (cancelAction != null) {
                                        if (ctrl.request.locations[j].products[i].screenActions == null || typeof ctrl.request.locations[j].products[i].screenActions == "undefined") {
                                            // no actions defined, add cancel
                                            ctrl.request.locations[j].products[i].screenActions = [];
                                            ctrl.request.locations[j].products[i].screenActions.push(cancelAction);
                                            ctrl.request.locations[j].products[i].deliveryOption = angular.copy(ctrl.requestTenantSettings.defaultDeliveryOption);

                                            if(typeof ctrl.request.destination != 'undefined'){
                                                ctrl.request.destination[j].name = ctrl.request.destination[j].code;
                                            }
                                        } else {
                                            // some actions defined, add cancel too if not there
                                            found = _.find(ctrl.request.locations[j].products[i].screenActions, ["id", cancelAction.id]);
                                            if (typeof found == "undefined") {
                                                ctrl.request.locations[j].products[i].screenActions.push(cancelAction);
                                            }
                                        }
                                    }
                                 
                                    ctrl.request.locations[j].products[i].uniqueIdUI = Math.random().toString(36).substring(7);
                                    if (ctrl.request.locations[j].products[i].product) {
                                        listsModel.getProductTypeByProduct(ctrl.request.locations[j].products[i].product.id, j, i).then(function(server_data) {
                                            ctrl.request.locations[server_data.id].products[server_data.id2].productType = server_data.data.payload;
                                            $scope.productTypesLoadedPerLocation.loadedProducts += 1;
                                        });
                                        
                                    }
                                }
                            }
                            newRequestModel.getDefaultBuyer(ctrl.request.vesselId).then(function(buyer) {
                                ctrl.buyer = buyer.payload;
                            });
                            addDefaultProducts();
                            ctrl.calculateScreenActions();
                            ctrl.isNewRequest = true;
                            if (ctrl.request.vesselDetails.vessel.id) ctrl.selectVessel(ctrl.request.vesselDetails.vessel.id);
                            $timeout(function() {
                                ctrl.isEnabledEta();
                            });
                            if (ctrl.request.id == 0) {
                                setTimeout(function() {
                                    ctrl.robDetails = ctrl.request.vesselDetails.robDetails;
                                }, 100);
                            }
                        });
                    } else if (typeof requestId != "undefined" && requestId !== null) {

                        newRequestModel.getRequest(requestId).then(function(newRequestData) {
                            ctrl.request = newRequestData.payload;
                            ctrl.disableAllFields = false;
                            if(typeof ctrl.request.requestCompleted != 'undefined'){
                                if(ctrl.request.requestCompleted != null){
                                    ctrl.disableAllFields = ctrl.request.requestCompleted; // disable all fields if request is completed
                                }
                            }

                            setPageTitle();
                            setTimeout(function() {
                                ctrl.robDetails = ctrl.request.vesselDetails.robDetails;
                            }, 100);
                            setRequestStatusHeader();
                            uiApiModel.getListLayout("requestsContractList").then(
                                function(data) {
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
                                function(reason) {
                                    ctrl.initContractTable();
                                }
                            );
                            $scope.productTypesLoadedPerLocation = {
                            	totalProducts : 0,
                            	loadedProducts : 0
                            };
                            for (var j = 0; j < ctrl.request.locations.length; j++) {
                                if (ctrl.requestTenantSettings.recentEta.id == 1 && ctrl.request.locations[j].eta && ctrl.request.locations[j].id) {
                                    if (!ctrl.request.locations[j].recentEta) ctrl.request.locations[j].recentEta = ctrl.request.locations[j].eta;
                                }
	                            $scope.productTypesLoadedPerLocation.totalProducts += ctrl.request.locations[j].products.length;
                                for (var i = 0; i < ctrl.request.locations[j].products.length; i++) {
                                	ctrl.request.locations[j].products[i].uniqueIdUI = Math.random().toString(36).substring(7);
                                    if (ctrl.request.locations[j].products[i].product) {
                                    	// ctrl.request.locations[j].products[i].product.name = ctrl.request.locations[j].products[i].requestIndex + ' - ' + ctrl.request.locations[j].products[i].product.name;
                                        listsModel.getProductTypeByProduct(ctrl.request.locations[j].products[i].product.id, j, i).then(function(server_data) {
                                            ctrl.request.locations[server_data.id].products[server_data.id2].productType = server_data.data.payload;
                                        	$scope.productTypesLoadedPerLocation.loadedProducts += 1;
                                        });
                                    }
                                }
					            _.each(ctrl.request.locations[j].products, function(value, key) {
					                value.product.name = String(key + 1) + ' - ' + value.product.name;
					            });                             
                            }
                            newRequestModel.getDefaultBuyer(ctrl.request.vesselId).then(function(buyer) {
                                ctrl.buyer = buyer.payload;
                            });
                            addDefaultProducts();
                            ctrl.calculateScreenActions();
                            if (ctrl.request.vesselDetails.vessel.id) ctrl.selectVessel(ctrl.request.vesselDetails.vessel.id, true);
                            ctrl.isNewRequest = false;
                            if (ctrl.request.requestStatus.id == ctrl.STATUS.STEMMED.id) ctrl.isReadonlyForm = true;
                            if (ctrl.request.requestStatus.id == ctrl.STATUS.PARTIALLY_STEMMED.id) ctrl.canComplete = true;
                            ctrl.getCurrentProductsCurrentIds();
                           
                        });
                    } else {
                        newRequestModel.getEmptyRequest().then(function(newRequestData) {
                            ctrl.request = newRequestData.payload;
                            ctrl.request.locations.length = 0;
                            addDefaultProducts();
                            ctrl.calculateScreenActions();
                            ctrl.isNewRequest = true;
                            $timeout(function() {
                                setPageTitle();
                            });
                        });
                    }
                })
                .then(function(data) {
                    initDataTables();
                    $timeout(function() {
                    });
                }).finally(
                    function(){
                        screenLoader.hideLoader();
                    }
                );
        };

        $scope.$watch('productTypesLoadedPerLocation.loadedProducts', function(obj) {
        	if (obj) {
	        	if (obj == $scope.productTypesLoadedPerLocation.totalProducts) {
	        		for (var j = 0; j < ctrl.request.locations.length; j++) {
                        if (!ctrl.request.id) {
                            ctrl.request.locations[j].products = _.orderBy(ctrl.request.locations[j].products, ['productTypeId', 'product.name'], ['asc', 'asc']);
                        }
                        for (var i = 0; i < ctrl.request.locations[j].products.length; i++) {
                            ctrl.request.locations[j].products[i].name = String(i + 1) + ' - ' + ctrl.request.locations[j].products[i].name;
                            listsModel.getSpecGroupByProductAndVessel(ctrl.request.locations[j].products[i].product.id, ctrl.request.vesselDetails.vessel.id, j, i).then(function(server_data) {
                                ctrl.request.locations[server_data.id].products[server_data.id2].specGroups = server_data.data.payload;
                                var isInList = false;
                                $.each(ctrl.request.locations[server_data.id].products[server_data.id2].specGroups, function(k,v){
                                    $.each(ctrl.request.locations[server_data.id].products[server_data.id2].specGroups, function(k,v){
                                        if (v.id == ctrl.request.locations[server_data.id].products[server_data.id2].specGroup.id) {
                                            isInList = true;
                                        }
                                        if (v.isDefault) {
                                        	ctrl.request.locations[server_data.id].products[server_data.id2].specGroup = v;
                                        }
                                    });  
                                });
                                if (!isInList) {
                                    ctrl.request.locations[server_data.id].products[server_data.id2].specGroup = null;
                                }                                               
                            });
                        }
					}
	        	}
        	}
        })

        ctrl.getCurrentProductsCurrentIds = function() {
            ctrl.productsContractIds = [];
            addedProductRequestIds = [];
            $.each(ctrl.request.locations, function(lk, lv) {
                $.each(lv.products, function(pk, pv) {
                    if (addedProductRequestIds.indexOf(pv.id) == -1) {
                        if (pv.contract.contract) {
                            obj = {
                                contractId: pv.contract.contract.id,
                                requestProductId: pv.id
                            };
                            addedProductRequestIds.push(pv.id);
                            ctrl.productsContractIds.push(obj);
                        }
                    }
                });
            });
            $scope.$broadcast("productsContractIds", ctrl.productsContractIds);
        };

        function initDataTables() {
            ProductInfoDatatable.init({
                selector: '[id^="product_info_table_"]'
            });
        }
        /*****************************************************************************************************/
        /* "REQUEST COPY" FUNCTIONALITY.
        /*****************************************************************************************************/
        /**
         * Reset certain location data in preparation for the request copy process.
         * @param {Object} request - A request object (normally it's the DTO provided by the server).
         * @return {Object} - The modified input request.
         */
        function resetLocations(request) {}
        /**
         * Nullifies an object's "id" property, if it has one.
         * @parma {Object} - The source object.
         * @param {Object} - The object with its id property nullified.
         */
        function nullifyId(obj, property) {
            if (!isNullifiableObject(obj) || !obj.hasOwnProperty("id")) {
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
         * @return {Boolean} - True if the object's ID may be set to null, false otherwise.
         */
        function isNullifiableObject(obj) {
            var definingProperty = "collectionName";
            return !obj.hasOwnProperty(definingProperty);
        }
        /**
         * Iterate an object recursively and fire a callback for each child object.
         * @oaram {Object} obj - The object to traverse.
         * @param {Function} callback - A callback function to call for each child object.
         * @return {Object} - The resulting object, after the callback function was applied to all its children.
         */
        function traverseObject(obj, callback) {
            for (var property in obj) {
                if (property == "service") {
                    continue;
                }
                if (obj.hasOwnProperty(property)) {
                    if (typeof obj[property] === "object") {
                        obj = callback(obj, property);
                        traverseObject(obj[property], callback);
                    } else {
                        // console.log(property + "   " + obj[property]);
                    }
                }
            }
            return obj;
        }
        /*****************************************************************************************************/
        /* END "REQUEST COPY" FUNCTIONALITY.
        /*****************************************************************************************************/
        ctrl.goSpot = function(verifyContracts) {
          
            if (verifyContracts) {
                console.log(ctrl.bestContractsList);
                console.log(ctrl.checkedProducts);
                contractExistsForSelection = false;
                ctrl.existingContractLocations = [];
                $.each(ctrl.bestContractsList, function(k, v) {
                    if (ctrl.checkedProducts[v.requestProductId] == true) {
                        contractExistsForSelection = true;
                        ctrl.existingContractLocations.push(v.requestProductLocationName);
                    }
                });
                ctrl.existingContractLocations = ctrl.existingContractLocations.join(", ");
                if (contractExistsForSelection) {
                    tpl = $templateCache.get("pages/new-request/views/goSpotActionPopup.html");
                    // tpl = $templateCache.get('app-general-components/views/modal_sellerrating.html');
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        size: "full",
                        appendTo: angular.element(document.getElementsByClassName("page-container")),
                        windowTopClass: "fullWidthModal autoWidthModal",
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
                groupOfRequestsModel.groupRequests([ctrl.request.id]).then(
                    function(data) {
                        ctrl.buttonsDisabled = false;
                        requestGroup = data.payload;
                        $state.go(STATE.GROUP_OF_REQUESTS, {
                            // group: requestGroup,
                            groupId: requestGroup[0].requestGroup.id
                        });
                    },
                    function() {
                        ctrl.buttonsDisabled = false;
                    }
                ).finally(function(){
                    screenLoader.hideLoader();
                });
            }
        };

        ctrl.goEmail = function() {
            //screenLoader.showLoader();
            if (ctrl.request.id) {
                // $state.go(STATE.PREVIEW_EMAIL, {
                    
                // });
                var previewEmailData = {
                    data: {
                        requestId: ctrl.request.id,
                        requestStatus: ctrl.request.requestStatus
                    },
                    transaction: EMAIL_TRANSACTION.REQUEST
                }
    
                localStorage.setItem('previewEmailData', JSON.stringify(previewEmailData));
    
                var url = $state.href(STATE.PREVIEW_EMAIL);
                // $window.open(url, '_blank');

                $location.path(url.replace("#",""));
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
                function(responseData) {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                },
                function() {
                    ctrl.buttonsDisabled = false;
                }
            );
        };

        ctrl.validateMinMaxQuantity = function (min, max) {
            if(typeof min == "string") min = parseFloat(min);
            if(typeof max == "string") max = parseFloat(max);
            response = {
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
                toastr.warning("Min Quantity can't be greater than Max Quantity");
            }
            return response;
        };

        ctrl.saveRequest = function() {
           
            ctrl.isRequiredMinMax();
            ctrl.isSpecGroupIsRequired();
            
            $timeout(function() {
                $("form").addClass("submitted");
                ctrl.saved = true;
                var forms_validation = validateForms();
                if (forms_validation !== null) {
                    toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(", "));
                    // ctrl.initMask(); // reinit mask for date inputs
                }
                var invalidDates = false;
                $.each(ctrl.requestDateFieldsErrors, function(k, v) {
                    if (v) {
                        invalidDates = true;
                        toastr.error(v);
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
                    return;
                }
                ctrl.buttonsDisabled = true;
                //remove empty products
                for (var i = ctrl.request.locations.length - 1; i >= 0; i--) {
                    if (ctrl.request.locations[i].isDeleted) {
                        ctrl.request.locations.splice(i, 1);
                    } else {
                        //products
                        for (var j = ctrl.request.locations[i].products.length - 1; j >= 0; j--) {
                            if (ctrl.request.locations[i].products[j].product === null || ctrl.request.locations[i].products[j].isDeleted) {
                                ctrl.request.locations[i].products.splice(j, 1);
                            }
                        }
                        //if agent == {} se null
                        if (_.isEmpty(ctrl.request.locations[i].agent)) ctrl.request.locations[i].agent = null;
                    }
                }
                if (ctrl.request.footerSection) {
	                ctrl.request.footerSection.isPrerequest = ctrl.requestTenantSettings.isPrerequestEnabled;
                }
                if (ctrl.isNewRequest) {
                    screenLoader.showLoader();
                    newRequestModel.createRequest(ctrl.request).then(
                        function(responseData) {
                            ctrl.buttonsDisabled = false;
                            $state.go(STATE.EDIT_REQUEST, {
                                requestId: responseData.payload.id
                            });
                        },
                        function() {
                            ctrl.buttonsDisabled = false;
                        }
                    ).finally(function(){
                        screenLoader.hideLoader();
                    });
                } else {
                    screenLoader.showLoader();
                    newRequestModel.updateRequest(ctrl.request).then(
                        function(responseData) {
                            var data = responseData.payload;
                            ctrl.buttonsDisabled = false;
                            if (data.requirementsToAmend !== null && data.requirementsToAmend.length > 0) {
                                ctrl.requirementsToAmend = data.requirementsToAmend;
                                $("amend-dialog").modal("show");
                            } else {
                                ctrl.requirementsToAmend = null;
                            }
                            screenLoader.hideLoader();
                            $state.reload();
                            
                        },
                        function() {
                            ctrl.buttonsDisabled = false;
                        }
                    );
                }
            });
        };

        ctrl.showDeleteLocationConfirm = function(location) {
            ctrl.entityToDelete = "location";
            ctrl.deleteDataParams = {
                location: location
            };
            // $(".confirmModal").modal();
        };

        ctrl.showCanBeCancelledLocationConfirm = function(locationId, message) {
            ctrl.entityToDelete = "canBeCanceledLocation";
            ctrl.deleteDataParams = {
                locationId: locationId,
                confirmText: message
            };
        };
        ctrl.canBeCancelledLocation = function(locationId) {
            newRequestModel.cancelLocation(locationId).then(function(data) {
                if (data.message) {
                    toastr.info(data.message, null, { timeOut: 15000 });
                }
                // for (var i = 0; i < location.products.length; i++) {
                //     location.products[i].productStatus = ctrl.STATUS['Cancelled'];
                // }
                $state.reload();
            });
        };
        ctrl.deleteLocation = function(location) {
            // ctrl.confirmLocationDelete = confirm("Are you sure you want to delete " + location.location.name);
            // if (ctrl.confirmLocationDelete) {
            if (location.id) {
                if (!ctrl.checkProductsActionForCancelLocation(location)) {
                    return;
                }
                canBeCancelledPayload = {
                    Filters: [
                        {
                            ColumnName: "RequestLocationId",
                            Value: location.id
                        },
                        {
                            ColumnName: "RequestName",
                            Value: ctrl.request.name
                        },
                        {
                            ColumnName: "RequestLocationName",
                            Value: location.location.name
                        }
                    ]
                };
                newRequestModel.canBeCancelled(canBeCancelledPayload).then(function(data) {
                    if (data.payload) {
                        ctrl.showCanBeCancelledLocationConfirm(location.id, data.payload);
                    } else {
                        newRequestModel.cancelLocation(location.id).then(function(data) {
                            if (data.message) {
                                toastr.info(data.message, null, { timeOut: 15000 });
                            }
                            for (var i = 0; i < location.products.length; i++) {
                                location.products[i].productStatus = ctrl.STATUS["Cancelled"];
                                $state.reload();
                                //ctrl.deleteProductFromLocation(location.products[i], location);
                            }
                        });
                    }
                });
            } else {
                location.isDeleted = true;
                for (var i = 0; i < location.products.length; i++) {
                    location.products[i].isDeleted = true;
                }
            }
            // }
        };
        ctrl.addEmptyProduct = function(products, addCancel) {
            var agreementType = tenantService.getAgreementType();
            var uomSelection = tenantService.getUom();
            product = {
                product: null,
                uniqueIdUI: Math.random()
                    .toString(36)
                    .substring(7),
                productStatus: null,
                workflowId: null,
                specGroup: null,
                productType: null,
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
            //add cancel action to new product
            if (addCancel) {
                //addCancel is true when function called directly from + sign in grid
                cancelAction = ctrl.getScreenActionByName(ctrl.SCREEN_ACTIONS.CANCEL);
                if (cancelAction != null) {
                    product.screenActions.push(cancelAction);
                }
            }
            products.push(product);
            //clear product selection
            ctrl.checkedProducts = [];
        };
        ctrl.addProductAndSpecGroupToList = function(product, specGroup, productTypeId, productList, extraInfo) {
            ctrl.addEmptyProduct(productList);
            var newProduct = productList[productList.length - 1];
        	if (extraInfo) {
        		if (extraInfo.vesselVoyageDetailId) {
		            newProduct.vesselVoyageDetailId = extraInfo.vesselVoyageDetailId;
					newRequestModel.getBunkerPlansForVesselVoyageDetailId(extraInfo.vesselVoyageDetailId).then(function(response) {
						console.log(newProduct);
						console.log(response);
						if (response.payload) {
							$.each(response.payload, function(k,v){
								if (v.productTypeDto.id == newProduct.productType.id) {
									newProduct.minQuantity = v.supplyQuantity
									newProduct.maxQuantity = v.supplyQuantity
									newProduct.uom = v.supplyUom
								}
							})
						}
		            });	            	
        		}
        	}
            newProduct.product = product;
            newProduct.defaultProduct = angular.copy(product);
            newProduct.screenActions = [];
            newProduct.productType = angular.copy(ctrl.getProductTypeObjById(productTypeId));
            cancelAction = ctrl.getScreenActionByName(ctrl.SCREEN_ACTIONS.CANCEL);
            if (cancelAction != null) {
                newProduct.screenActions.push(cancelAction);
            }
            listsModel.getSpecGroupByProductAndVessel(product.id, ctrl.request.vesselDetails.vessel.id).then(function(server_data) {
                newProduct.specGroups = server_data.data.payload;
            	$.each(newProduct.specGroups, function(k,v){
	            	if (v.isDefault) {
			            newProduct.specGroup = v;
	            	}
            	})
            });
        };
        ctrl.getProductTypeObjById = function(id) {
            var prodType = _.filter(ctrl.listsCache.ProductType, ["id", id]);
            if (prodType.length > 0) if (typeof prodType[0] != "undefined") return prodType[0];
            return null;
        };
        ctrl.getSpecGroups = function(product) {
            listsModel.getSpecGroupByProductAndVessel(product.product.id, ctrl.request.vesselDetails.vessel.id).then(function(server_data) {
                product.specGroups = server_data.data.payload;
                var isInList = false;
            	$.each(product.specGroups, function(k,v){
	            	if (v.isDefault) {
		                isInList = true;
		                product.specGroup = v;
	            	}
            	})      
            	if (!isInList) {
		            product.specGroup = null;
            	}      	
            });
        };
        ctrl.getProductType = function(product) {
            listsModel.getProductTypeByProduct(product.id).then(function(server_data) {
                product.productType = server_data.data.payload;
            });
        };
        ctrl.getScreenActionByName = function(name) {
            action = null;
            $.each(ctrl.listsCache.ScreenAction, function(key, val) {
                if (val.name == name) action = val;
            });
            return action;
        };
        /**
         * Mark product as deleted
         */

        ctrl.showDeleteProductFromLocationConfirm = function(product, location, pIndex, locIndex) {
            if (!product.id) {
                $.each(location.products, function(k, v) {
                	if (v) {
	                    if (v.uniqueIdUI == product.uniqueIdUI) {
	                        ctrl.request.locations[locIndex].products.splice(k, 1);
	                    }
                	}
                });
                return;
            }
            ctrl.entityToDelete = "product";
            ctrl.deleteDataParams = {
                product: product,
                location: location,
                pIndex: pIndex,
                locIndex: locIndex
            };
            $(".confirmModal").modal();
        };
        ctrl.showCanBeCancelledProductFromLocationConfirm = function(location, productId, message) {
                ctrl.entityToDelete = "canBeCanceledProduct";
                ctrl.deleteDataParams = {
                    location: location,
                    productId: productId,
                    confirmText: message
                };
            // $(".confirmModal").modal();
        };
        ctrl.canBeCancelledProductFromLocation = function(location, productId) {
            newRequestModel.cancelProduct(productId).then(function(data) {
                $state.reload();
                for (var i = 0; i < location.products.length; i++) {
                    if (location.products[i].id == productId) {
                        location.products[i].productStatus = ctrl.STATUS["Cancelled"];
                    }
                }
                // product.productStatus = ctrl.STATUS['Cancelled'];
                var existingProductNr = 0;
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
        };
        ctrl.deleteProductFromLocation = function(product, location, pIndex, locIndex) {
            // ctrl.confirmProductDelete = confirm("Are you sure you want to delete "+product.product.name+ " from " + location.location.name);
            // if (ctrl.confirmProductDelete) {
            if (product.product !== null) {
                if (product.id) {
                    canBeCancelledPayload = {
                        Filters: [
                            {
                                ColumnName: "RequestProductId",
                                Value: product.id
                            },
                            {
                                ColumnName: "RequestName",
                                Value: ctrl.request.name
                            },
                            {
                                ColumnName: "RequestProductName",
                                Value: product.product.name
                            }
                        ]
                    };
                    newRequestModel.canBeCancelled(canBeCancelledPayload).then(function(data) {
                        if (data.payload) {
                            ctrl.showCanBeCancelledProductFromLocationConfirm(location, product.id, data.payload);
                        } else {
                        	message = "Are you sure you want to delete " + product.product.name + " from " + location.location.name + "?" ;
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
            return $(".st-extra-buttons").find("li").length === 0;
        };
        //retrieve invalid fields from a form
        function getInvalidFields(form) {
            var fields = [];
            var fieldName;
            for (var errorName in form.$error) {
                for (var i = 0; i < form.$error[errorName].length; i++) {
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
            var pageValid = true;
            var invalidFields = [];
            var forms = $scope.forms;
            var index, form;
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
            for (var i = ctrl.request.locations.length - 1; i >= 0; i--) {
                for (var j = ctrl.request.locations[i].products.length - 1; j >= 0; j--) {
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
            for (var i = 0; i < ctrl.request.locations.length; i++) {
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
            var requestProducts = [];
            var product, requestActions;
            // Iterate Requests and their respective locations and products to extract actions.
            for (var j = 0; j < ctrl.request.locations.length; j++) {
                for (var k = 0; k < ctrl.request.locations[j].products.length; k++) {
                    product = ctrl.request.locations[j].products[k];
                    if (
                        $filter("filter")(
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
            var input = $(event.currentTarget);
            bindTypeahead(input, normalizeJSONLookupData(list), buyerTypeaheadChange);
            ctrl.lookupInput = field;
            input.focus();
        };
        /**
         * TODO: re-asses the need for this!
         * Function used to late-initialize the date input fields in the template.
         */
        ctrl.initializeDynamicDateInput = function(event) {
            var date = $(event.currentTarget);
            console.log("dynamic");
            if (date.data("datetimepicker") !== undefined) {
                return false;
            }
            date.datetimepicker({
                isRTL: App.isRTL(),
                // format: "dd MM yyyy - HH:ii P",
                showMeridian: true,
                autoclose: true,
                pickerPosition: App.isRTL() ? "bottom-left" : "bottom-left",
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
            var element = $(selector);
            if (element.data("ttTypeahead") !== undefined) {
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
                .bind("typeahead:select", function(event, suggestion) {
                    if (cb) {
                        cb(event, suggestion);
                    }
                });
        }
        /**
         * Adds a port to the request locations array.
         * Returns a promise so we can do extra work afterwards
         */
        function addLocation(locationId, voyageId, vesselVoyageDetailId, extraInfo) {
            var location, productList;
            var agent = null;
            var deferred = $q.defer();
            lookupModel.get(LOOKUP_TYPE.LOCATIONS, locationId).then(
                function(server_data) {
                    location = server_data.payload;
                    var agent = {};
                    // only set agent if agent field is of type lookup
                    // if its free text, let the user fill in info
                    if (ctrl.requestTenantSettings.agentDisplay.name == "Lookup") {
                        if (location.agents.length > 0) {
                            $.each(location.agents, function(k, v) {
                                if (v.isDefault) {
                                    agent.id = v.counterpartyId;
                                    agent.name = v.counterpartyName;
                                }
                            });
                        }
                    }
                    var locationObject = {
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
                        //nothing
                    } else {
                        // add extra info if available
                        locationObject.agentCounterpartyFreeText = agent.name;
                    }

                    if (ctrl.requestTenantSettings.displayOfService.id == 2) {
                        if (typeof ctrl.vesselDefaultDetails != "undefined") {
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
                    } else {
                        if (ctrl.request.vesselId) {
                            lookupModel.get(LOOKUP_TYPE.VESSEL, ctrl.request.vesselId).then(function(server_data) {
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
                    }
                    ctrl.request.locations[ctrl.request.locations.length - 1].products = _.orderBy(ctrl.request.locations[ctrl.request.locations.length - 1].products, ['productTypeId', 'product.name'], ['asc', 'asc']);
		            _.each(ctrl.request.locations[ctrl.request.locations.length - 1].products, function(value, key) {
		                value.product.name = String(key + 1) + ' - ' + angular.copy(value.product.displayName);
		            });    
                    deferred.resolve();
                    ctrl.getLowestEtaForDestinationInLocation(ctrl.request.locations.length - 1);
                },
                function() {
                    deferred.reject();
                }
            );
            return deferred.promise;
        }

        function setLocationDates(locationId, vesselVoyageId, eta, etb, etd) {
            var location;
            for (var i = 0; i < ctrl.request.locations.length; i++) {
                location = ctrl.request.locations[i];
                if (location.location.id === locationId && location.vesselVoyageId == vesselVoyageId && !location.eta && !location.etb && !location.etd) {
                    location.eta = eta;
                    location.etb = etb;
                    location.etd = etd;
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
            var selectedItems = $filter("filter")(
                ctrl.lists.Location,
                {
                    name: suggestion
                },
                true
            );
            if (selectedItems.length > 0) {
                addLocation(selectedItems[0].id, null, null).then(function() {
                    // $timeout(function() {
                        // ctrl.initializeDateInputs();
                    // });
                });
            }
            // Clear the input.
            $(event.target).typeahead("val", "");
        }
        $scope.addTypeLocation = function(val, extra) {
            return addLocation(val, null, null, extra).then(function() {
                setLocationDates(extra.id, extra.vesselVoyageId || extra.voyageId, extra.eta, extra.etb, extra.etd);
                if (extra.vesselVoyageId || extra.voyageId) {
	                setDefaultLocationFields(extra.id, (extra.vesselVoyageId || extra.voyageId), extra);
                }
                $timeout(function() {
                    ctrl.new_location = null;
                    // console.log('Dumm');
                    $scope.dumm = null; 
                    $('#id_Ports').val('');
                });
            });
        };

        function setDefaultLocationFields(locationId, vesselVoyageId, data) {
            var location;
            for (var i = 0; i < ctrl.request.locations.length; i++) {
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
            var selectedItems = $filter("filter")(
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
            var selectedItems = $filter("filter")(
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
            var selectedItems = $filter("filter")(
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
            var selectedItems = $filter("filter")(
                ctrl.lists.Buyer,
                {
                    name: suggestion
                },
                true
            );
            if (selectedItems.length > 0) {
                lookupModel.get(LOOKUP_TYPE.BUYER, selectedItems[0].id).then(function(server_data) {
                    ctrl.selectBuyer(server_data.payload);
                });
            }
        }
        /******************************************************************************
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
            angular.forEach(ports, function(port, key) {
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
            var vessel;
            if (vesselId == null) return;

            lookupModel.get(LOOKUP_TYPE.VESSEL, vesselId).then(function(server_data) {
                vessel = server_data.payload;
                //keep vesselDTO for later use
                ctrl.selectedVessel = vessel;
                if (!ctrl.request.vesselDetails.vessel) {
                    ctrl.request.vesselDetails.vessel = {};
                }
                newRequestModel.getDefaultBuyer(vessel.id).then(function(buyer) {
                    ctrl.buyer = buyer.payload;
                    ctrl.request.vesselDetails.vessel = angular.copy(vessel);
                    setPageTitle();
                    ctrl.request.vesselId = vessel.id;
                    ctrl.request.vesselDetails.vesselImoNo = vessel.imoNo;
                    if (ctrl.requestTenantSettings.displayOfService.id == 1) {
                        if (!ctrl.request.vesselDetails.service) {
                            ctrl.request.vesselDetails.service = {};
                        }

                        if (typeof ctrl.request.id == "undefined" || ctrl.request.id == 0 || !ctrl.request.id) {
                            ctrl.request.vesselDetails.service.name = vessel.defaultService ? vessel.defaultService.name : ctrl.request.vesselDetails.service.name;
                            ctrl.request.vesselDetails.service.id = vessel.defaultService ? vessel.defaultService.id : ctrl.request.vesselDetails.service.id;
                            ctrl.request.vesselDetails.service = vessel.defaultService ? vessel.defaultService : ctrl.request.vesselDetails.service;
                            ctrl.selectService(ctrl.request.vesselDetails.service.id);
                        }
                    }
                	
                	var companyToDefault = null;
                	if (vessel.operatingCompany) {
                    	companyToDefault = vessel.operatingCompany;
                	} else {
                		if (vessel.voyages) {
                			if (vessel.voyages[0].voyageDetails) {
                				if (vessel.voyages[0].voyageDetails[0].company) {
		                        	// companyToDefault = vessel.voyages[0].voyageDetails[0].company;
                				}
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
        ctrl.selectCompany = function(companyId) {
            if (ctrl.companyInLocationIndex != null) {
                ctrl.selectCompanyInLocation(companyId, ctrl.companyInLocationIndex);
                ctrl.companyInLocationIndex = null;
                return;
            }
            var company;
            lookupModel.get(LOOKUP_TYPE.COMPANY, companyId).then(function(server_data) {
                company = server_data.payload;
                if (!ctrl.request.company) {
                    ctrl.request.company = {};
                }
                ctrl.request.company.name = company.name;
                ctrl.request.company.id = company.id;
            });
        };
        ctrl.selectCompanyInLocation = function(itemId, locationIndex) {
            var company;
            lookupModel.get(LOOKUP_TYPE.COMPANY, itemId).then(function(server_data) {
                company = server_data.payload;
                if (!ctrl.request.locations[locationIndex].company) {
                    ctrl.request.locations[locationIndex].company = {};
                }
                ctrl.request.locations[locationIndex].company.name = company.name;
                ctrl.request.locations[locationIndex].company.id = company.id;
            });
        };
        ctrl.selectServiceInLocation = function(itemId, locationIndex) {
            var service;
            lookupModel.get(LOOKUP_TYPE.SERVICES, itemId).then(function(server_data) {
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
                    $timeout(function() {
                        $.each(service.contacts, function(key, val) {
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
            if(typeof ctrl.lists == 'undefined') ctrl.lists = {};
            ctrl.lists.contacts = [];
            ctrl.lists.contactEmails = [];
            $.each(ctrl.request.locations, function(lk, lv) {
                if (typeof lv.service != "undefined") {
                    if (lv.service != null) {
                        $.each(lv.service.contacts, function(sck, scv) {
                            contactExists = false;
                            contactEmailExists = false;
                            $.each(ctrl.lists.contacts, function(ck, cv) {
                                if (cv.id == scv.id) {
                                    contactExists = true;
                                }
                            });
                            $.each(ctrl.lists.contactEmails, function(ck, cv) {
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
                addLocation(locationId, null, null, extraInfo).then(function() {
                    setLocationDates(extraInfo.locationId, extraInfo.voyageId, extraInfo.eta, extraInfo.etb, extraInfo.etd);
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
            // alert(1)
            // addLocation(locationId, null, null).then(function() {
            //     $timeout(function() {
            //         ctrl.initializeDateInputs();
            //     });
            // });
        };
        ctrl.selectAgent = function(agentId) {
            var agent;
            ctrl.lookupInput = {};
            $.each(ctrl.lists.Agent, function(agK, agV) {
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
            //contract Id is 0 in order to get all contracts
            var contractId = 0;
            $state.go(STATE.CONTRACT_EVALUATION, {
                contractId: contractId,
                requestId: ctrl.requestId
            });
        };
        ctrl.getContractsProducts = function(contractList) {
            var contract;
            var products = [];
            // console.log(contractList);
            // contractList[3].product.id = 10;
            // contractList[3].product.name = 'testprod';
            $.each(contractList, function(key, val) {
                // contract = contractList[key];
                if (Array.isArray(val.product)) {
                    $.each(val.contract, function(key2, val2) {
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
            selectContractModel.getRequestContract(ctrl.requestId, contractId).then(function(data) {
                if (data.payload !== null) {
                    $.each(data.payload, function(key, val) {
                        contractAlreadyInList = false;
                        $.each(ctrl.contracts, function(k, v) {
                            if (v.contract.id == val.contract.id) {
                                contractAlreadyInList = true;
                            }
                        });
                        if (!contractAlreadyInList) {
                            ctrl.contracts.unshift(val);
                            //put contract added as first in list
                        }
                    });
                    //ctrl.contracts.push(data.payload);
                    ctrl.products = ctrl.getContractsProducts(ctrl.contracts);
                }
            });
        };
        ctrl.confirmContractSelection = function() {
            ctrl.buttonsDisabled = true;
            requestProductIds = [];
            contractProductIds = [];
            contractIds = [];
            errors = 0;
            console.log(ctrl.selectedContracts);
            $.each(ctrl.selectedContracts, function(ck, cv) {
                if (cv.requestProductId) {
                    if (requestProductIds.indexOf(cv.requestProductId) > -1) {
                        errors++;
                        toastr.error("For Product " + cv.product.name + " you selected multiple Contract to be confirmed. Please select only one Contract per Product from Request.");
                    }
                    contractIds.push(cv.contract.id);
                    contractProductIds.push(cv.contractProductId);
                    requestProductIds.push(cv.requestProductId);
                }
            });
            if (errors == 0) {
                orderModel.getExistingOrders(requestProductIds.join(",")).then(
                    function(responseData) {
                        ctrl.buttonsDisabled = false;
                        responseOrderData = responseData.payload;
                        if (responseOrderData.length == 0) {
                            $("#confirm").modal("show");
                            responseOrders = null;
                        } else {
                            selectedProductsRequestLocationIds = [];
                            $.each(responseOrderData, function(locK, locV) {
                                $.each(ctrl.selectedContracts, function(ck, cv) {
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
                            $.each(responseOrderData, function(rdk, rdv) {
                                if (selectedProductsRequestLocationIds.indexOf(rdv.requestLocationId) != -1) {
                                    responseOrders.push(rdv);
                                }
                            });
                            // selectedContracts, selectedProducts, orderFromResponse
                            ordersWithErrorsIdx = [];
                            $.each(ctrl.selectedContracts, function(selConK, selConV) {
                                $.each(responseOrders, function(respOrdK, respOrdV) {
                                    if (ctrl.selectedContracts[selConK].requestLocationId == responseOrders[respOrdK].requestLocationId) {
                                        hasError = false;
                                        errorMessages = [];
                                        errorType = [];
                                        if (responseOrders.length > 0) {
                                            if (ctrl.selectedContracts[selConK].currency.id != responseOrders[respOrdK].products[0].currency.id) {
                                                hasError = true;
                                                errorType.push("Currency");
                                            }
                                            // 259200000 is 3 days in miliseconds
                                            if (new Date($scope.getProductLocationETAByRequestProductId(selConV.requestProductId)) - new Date(responseOrders[respOrdK].orderEta) > 259200000 || new Date($scope.getProductLocationETAByRequestProductId(selConV.requestProductId)) - new Date(responseOrders[respOrdK].orderEta) < -259200000) {
                                                hasError = true;
                                                errorType.push("ETA Difference");
                                            }
                                            if (responseOrders[respOrdK].seller) {
                                                if (ctrl.selectedContracts[selConK].seller.id != responseOrders[respOrdK].seller.id) {
                                                    hasError = true;
                                                    errorType.push("Seller");
                                                }
                                            } else {
                                                hasError = true;
                                            }
                                        }
                                        if (hasError) {
                                            errorTypes = errorType.join(" and ");
                                            if (errorTypes) {
                                                errorMessage = "Unable to add " + $scope.getProductNameByRequestProductId(selConV.requestProductId) + " for " + ctrl.request.vesselDetails.vessel.name + " in existing stemmed order " + responseOrders[respOrdK].id + " due to conflicting " + errorTypes + ". New order will be created." + errorTypes + " will be only that did not met the criteria for extending the order";
                                            }
                                            ordersWithErrorsIdx.push(respOrdK);
                                            // responseOrders = null;
                                            // alert(errorMessage);
                                            toastr.info(errorMessage, "", {
                                                timeOut: 10000
                                            });
                                        } else {
                                            errorMessage = null;
                                        }
                                    }
                                });
                            });
                            for (var i = ordersWithErrorsIdx.length - 1; i >= 0; i--) {
                                responseOrders.splice(ordersWithErrorsIdx[i], 1);
                            }
                            $("#confirm").modal("show");
                        }
                        ctrl.confirmationProductOrders = {
                            requestId: ctrl.requestId,
                            contractId: contractIds.join(","),
                            contractProductId: contractProductIds.join(","),
                            requestProductId: requestProductIds.join(","),
                            requestOrder: responseOrders
                        };
                        broadcastDataConfirmation = {
                            confirmationProductOrders: ctrl.confirmationProductOrders,
                            requestOrder: responseOrders
                        };
                        $scope.$broadcast("confirmationProductOrders", broadcastDataConfirmation);
                    },
                    function(responseData) {
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
            $.each(ctrl.request.locations, function(locK, locV) {
                $.each(locV.products, function(prodK, prodV) {
                    if (prodV.id == rpid) {
                        foundProduct = prodV.product.name;
                    }
                });
            });
            return foundProduct;
        };
        $scope.getProductLocationETAByRequestProductId = function(rpid) {
            $.each(ctrl.request.locations, function(locK, locV) {
                $.each(locV.products, function(prodK, prodV) {
                    if (prodV.id == rpid) {
                        foundProduct = locV.eta;
                    }
                });
            });
            return foundProduct;
        };
		$rootScope.$on('showProceedButton', function(event, data) {
			ctrl.checkboxes = data.checkboxes;
			ctrl.showProceedButton();			
		})

        ctrl.showProceedButton = function() {
            selected = 0;
            ctrl.selectedContracts = [];
            ctrl.selectedContractHasStemmedProduct = false;
			var CLC = $('#flat_available_contracts');
			ctrl.contracts = CLC.jqGrid.Ascensys.gridObject.rows
            $.each(ctrl.checkboxes, function(k, v) {
                if (v) {
                    $.each(ctrl.contracts, function(kc, vc) {
                        if (vc.requestProductId) {
                            if (k == vc.id) {
                                selected++;
                                ctrl.selectedContracts.push(vc);
                                $.each(ctrl.request.locations, function(lk, lv) {
                                    $.each(lv.products, function(prodk, prodv) {
                                        if (prodv.id == vc.requestProductId) {
                                            if (prodv.productStatus.name == "Stemmed") {
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
        $rootScope.$on("buttonsDisabled", function(ev, value) {
            ctrl.buttonsDisabled = false;
        });
        $scope.$on("buttonsEnabled", function(ev, value) {
            ctrl.buttonsDisabled = false;
        });
        ctrl.selectProduct = function(productId) {
            // var product;
            locIdx = ctrl.requestProductDataOnChange.location;
            prodIdx = ctrl.requestProductDataOnChange.product;
            prodUniqueIdUI = ctrl.requestProductDataOnChange.product;
            prodUniqueIdUI = ctrl.actveProductUniqueIdUi;
            lookupModel.get(LOOKUP_TYPE.PRODUCTS, productId).then(function(server_data) {
                // product = server_data.payload;
            	$.each(ctrl.request.locations[locIdx].products, function(k,v){
            		if (v.uniqueIdUI == prodUniqueIdUI) {
		                v.product = server_data.payload;
            		}
            	})
                listsModel.getProductTypeByProduct(server_data.payload.id).then(function(server_data1) {
                	$.each(ctrl.request.locations[locIdx].products, function(k,v){
                		if (v.uniqueIdUI == prodUniqueIdUI) {
		                    v.productType = server_data1.data.payload;
			                listsModel.getSpecGroupByProductAndVessel(server_data.payload.id, ctrl.request.vesselDetails.vessel.id).then(function(server_data2) {
			                	$.each(ctrl.request.locations[locIdx].products, function(k,v){
			                		if (v.uniqueIdUI == prodUniqueIdUI) {
					                    v.specGroups = server_data2.data.payload;
					                    v.specGroup = null;
					                    $.each(server_data2.data.payload, function(k2,v2){
					                    	if (v2.isDefault) {
							                    v.specGroup = v2;
					                    	}	
					                    })
			                		}
			                	})
								// ctrl.request.locations[locIdx].products = $filter('orderBy')(ctrl.request.locations[locIdx].products, 'productType.name');
			                });
                		}
                	})
                });
                // If there's a set lookupInput, it means we need
                // to copy the lookup dialog selection into it.
                //
                // if (ctrl.lookupInput) {
                //     if (!ctrl.lookupInput.product) {
                //         ctrl.lookupInput.product = {};
                //     }
                //     ctrl.lookupInput.product.name = product.name;
                //     ctrl.lookupInput.product.id = product.id;
                //     ctrl.lookupInput.specGroup = product.defaultSpecGroup;
                //     ctrl.getSpecGroups(ctrl.lookupInput);
                // }
                lookupModel.getSpecParameterForRequestProduct(server_data.payload.id).then(function(server_data) {
                    if (typeof $scope.filteredSpecs == "undefined") {
                        $scope.filteredSpecs = {};
                    }
                    $scope.filteredSpecs["product_" + productId] = server_data.payload;
                });
            });
        };
        ctrl.canValidate = function() {
            validProducts = 0;
            $.each(ctrl.request.locations, function(lk, lv) {
                $.each(lv.products, function(pk, pv) {
                    $.each(pv.screenActions, function(sk, sv) {
                        if (sv.name == "ValidatePreRequest") {
                            validProducts++;
                        }
                    });
                });
            });
            return validProducts;
        };
        ctrl.checkCancelInProducts = function() {
            validProducts = 0;
            $.each(ctrl.request.locations, function(lk, lv) {
                $.each(lv.products, function(pk, pv) {
                    $.each(pv.screenActions, function(sk, sv) {
                        if (sv.name == "Cancel") {
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
            if (ctrl.request.requestStatus.name != "Cancelled" && ctrl.request.requestStatus.name != "Stemmed") {
                canCancel = ctrl.checkCancelInProducts();
                if (canCancel > 0) {
                    return true;
                }
            }
            if (ctrl.request.requestStatus.name != "Cancelled" && ctrl.request.requestStatus.name != "Stemmed") {
            	return true;
            }
            if(ctrl.request.requestCompleted){
                return true;
            }
            return false;
        };
        ctrl.canQuestionnaire = function() {
            validProducts = 0;
            $.each(ctrl.request.locations, function(lk, lv) {
                $.each(lv.products, function(pk, pv) {
                    $.each(pv.screenActions, function(sk, sv) {
                        if (sv.name == "SendQuestionnaire") {
                            validProducts++;
                        }
                    });
                });
            });
            return validProducts;
        };
        ctrl.selectService = function(serviceId) {
            var service;
            if (ctrl.serviceInLocationIndex != null) {
                ctrl.selectServiceInLocation(serviceId, ctrl.serviceInLocationIndex);
                ctrl.serviceInLocationIndex = null;
                return;
            }
            if (!serviceId) {
                return;
            }
            lookupModel.get(LOOKUP_TYPE.SERVICES, serviceId).then(function(server_data) {
                service = server_data.payload;
                console.log(service);
                if (!ctrl.request.vesselDetails.service) {
                    ctrl.request.vesselDetails.service = {};
                }
                ctrl.request.vesselDetails.service.name = service.name;
                ctrl.request.vesselDetails.service.id = service.id;
                ctrl.request.vesselDetails.service = service;
                if (service.contacts) {
                    $timeout(function() {
                        ctrl.lists.contacts = [];
                        ctrl.lists.contactEmails = [];
                        $.each(service.contacts, function(key, val) {
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
            ctrl.lookupInput.buyer.name = buyer.name;
            ctrl.lookupInput.buyer.id = buyer.id;
        };
        ctrl.selectVesselSchedules = function(locations) {
            // console.log(ctrl.scheduleVoyageID );
            angular.forEach(locations, function(location, key) {
                addLocation(location.locationId, location.voyageId, location.vesselVoyageDetailId, location).then(function() {
                    setLocationDates(location.locationId, location.voyageId, location.eta, location.etb, location.etd);
                    setDefaultLocationFields(location.locationId, (location.vesselVoyageId || location.voyageId), location);
                });
            });
        };
        ctrl.minQtyBlur = function(product) {
            if (product.maxQuantity < product.minQuantity || !product.maxQuantity) {
                product.maxQuantity = product.minQuantity;
            }
        };
        ctrl.hasAction = function(action) {
        	if (action == "GoSpot") {
	            hasGoSpot = false;
	            $.each(ctrl.request.locations, function(kl, vl) {
	                $.each(vl.products, function(kp, vp) {
	                    $.each(vp.screenActions, function(ks, vs) {
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
            found = 0;
            $.each(ctrl.request.locations, function(kl, vl) {
                $.each(vl.products, function(kp, vp) {
                    $.each(vp.screenActions, function(ks, vs) {
                        if (vs.name == ctrl.SCREEN_ACTIONS.GOCONTRACT) {
                            found++;
                        }
                    });
                });
            });
            if (found > 0) return true;
            return false;
        };
        ctrl.canSave = function() {
            return screenActionsModel.canSave(ctrl.screenActions);
        };
        ctrl.isSelectProductDisabled = function() {
            for (var i = 0; i < ctrl.request.locations.length; i++) {
                for (var j = 0; j < ctrl.request.locations[i].products.length; j++) {
                    if (ctrl.request.locations[i].products[j].id === null && ctrl.request.locations[i].products[j].isDeleted === false) {
                        return true;
                    } else {
                        index = 0;
                        $.each(ctrl.request.locations[i].products[j].screenActions, function(key, val) {
                            if (val.name == "SendQuestionnaire") {
                                index++;
                            }
                            if (val.name == "ValidatePreRequest") {
                                index++;
                            }
                        });
                        if (index > 0) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        ctrl.showCancelRequestConfirm = function(product, location, pIndex, locIndex) {
            ctrl.entityToDelete = "request";
            ctrl.deleteDataParams = Math.random()
                .toString(36)
                .substring(7);
            $(".confirmModal").modal();
        };

        ctrl.showCanBeCancelledRequestConfirm = function(confirmText) {
            ctrl.entityToDelete = "canBeCanceledRequest";
            ctrl.deleteDataParams = { confirmText: confirmText };
        };

        ctrl.sendCancelRequestAction = function() {
            if (ctrl.dataReasonCancel) {
                payload = ctrl.dataReasonCancel;
            } else {
                payload = {
                    id: ctrl.request.id
                };
            }
            ctrl.buttonsDisabled = true;
            newRequestModel.cancelRequest(payload).then(
                function(responseData) {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                },
                function() {
                    ctrl.buttonsDisabled = false;
                }
            );
        };

        ctrl.sendCanBeCanceledRequest = function(payload, dataReasonCancel) {
            $scope.prettyCloseModal();
            newRequestModel.canBeCancelled(payload).then(function(data) {
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
                tpl = $templateCache.get("app-general-components/views/modal_reasonToCancelRequest.html");
                // tpl = $templateCache.get('app-general-components/views/modal_sellerrating.html');
                $scope.modalInstance = $uibModal.open({
                    template: tpl,
                    size: "full",
                    appendTo: angular.element(document.getElementsByClassName("page-container")),
                    windowTopClass: "fullWidthModal autoWidthModal",
                    scope: $scope
                });
                var list = ['Inquired', 'PartiallyInquired', 'Quoted', 'PartiallyQuoted', 'Amended'];
                if (list.indexOf($state.params.status.name) != -1) {
                    ctrl.textValue = "Are you sure you want to cancel this request?(The Request belongs to a Group and this Group will be deleted)";
                } else {
                        ctrl.textValue = "Are you sure you want to cancel this request?";
                }
            } else {
                canBeCancelledPayload = {
                    Filters: [
                        {
                            ColumnName: "RequestId",
                            Value: ctrl.request.id
                        },
                        {
                            ColumnName: "RequestName",
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
            if (typeof reason == "undefined") {
                toastr.error("Please select the reason");
                return;
            }
            if (!reason.id) {
                toastr.error("Please select the reason");
                return;
            }
            ctrl.dataReasonCancel = {
                id: requestId,
                requestCancelReasonOption: reason
            };
            canBeCancelledPayload = {
                Filters: [
                    {
                        ColumnName: "RequestId",
                        Value: ctrl.request.id
                    },
                    {
                        ColumnName: "RequestName",
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
            var new_request = angular.copy(ctrl.request);
            for (var i = 0; i < ctrl.request.locations.length; i++) {
                var new_products = [];
                for (var j = 0; j < ctrl.request.locations[i].products.length; j++) {
                    if (ctrl.request.locations[i].products[j].productStatus) {
	                    if(ctrl.request.locations[i].products[j].productStatus.name !== 'Cancelled') {
	                        new_products.push(ctrl.request.locations[i].products[j]);
	                    }
                    }
                }
                new_request.locations[i].products = new_products;
            }
            new_locations = [];
            for (var i = 0; i < new_request.locations.length; i++) {
            	if (new_request.locations[i].portStatus.name !== 'Cancelled') {
        			new_locations.push(new_request.locations[i]);
            	}
            }
            new_request.locations = new_locations;

        	$.each(new_request.locations, function(k,v){
            	$.each(ctrl.lists.Location, function(lk,lv){
            		if (v.destination) {
	            		if (lv.id == v.destination.id) {
	                    	v.destination = lv;
	            		}		
            		}
            	})
        	})
            $state.go(STATE.COPY_REQUEST, {
                copyFrom: new_request
            });
        };
        ctrl.validatePreRequest = function() {
            // call function to see required fields
            valid = ctrl.checkValidQuantities();
            $("form").addClass("submitted");
            ctrl.isRequiredMinMax(true);
            ctrl.isSpecGroupIsRequired(true);
            $timeout(function() {
                // show errors if needed
                ctrl.saved = true;
                var forms_validation = validateForms();
                if (forms_validation !== null) {
                    toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + forms_validation.join(", "));
                    return false;
                }
                //validate request
                screenLoader.showLoader();
                newRequestModel.validate(ctrl.request).then(
                    function(responseData) {
                        ctrl.buttonsDisabled = false;
                        $state.reload();
                    },
                    function() {
                        ctrl.buttonsDisabled = false;
                    }
                ).finally(function(){
                    screenLoader.hideLoader();
                });
            });
        };
        ctrl.isRequiredMinMax = function(validate) {
            if (validate) {
                //function is called from validate - make fields required for validation
                ctrl.requiredQty = true;
                return false;
            } else {
            	if (ctrl.requestTenantSettings) {
	                //general function call (from template)
	                //1. if prerequest enabled -> required at validate
	                if (ctrl.requestTenantSettings.isPrerequestEnabled) ctrl.requiredQty = false; //not required

	                //2. if prerequest not enabled -> required from save
	                if (!ctrl.requestTenantSettings.isPrerequestEnabled) ctrl.requiredQty = true;
            	}
            }
        };        
		ctrl.isSpecGroupIsRequired = function(validate) {
            if (validate) {
                //function is called from validate - make fields required for validation
                ctrl.specGroupIsRequired = true;
                return false;
            } else {
            	if (ctrl.requestTenantSettings) {
	                //general function call (from template)
	                //1. if prerequest enabled -> required at validate
	                if (ctrl.requestTenantSettings.isPrerequestEnabled) ctrl.specGroupIsRequired = false; //not required

	                //2. if prerequest not enabled -> required from save
	                if (!ctrl.requestTenantSettings.isPrerequestEnabled) ctrl.specGroupIsRequired = true;
            	}
            }
        };
        ctrl.checkValidQuantities = function() {
            var text = "";
            $.each(ctrl.request.locations, function(key, val) {
                $.each(val.products, function(key2, val2) {
                    if (val2.minQty != null) {
                        if (val2.maxQuantity != null) {
                            if (val2.minQty > val2.maxQuantity) {
                                //ok
                            }
                        } else {
                            //ok
                        }
                    } else {
                        text = "The following fields are required or invalid: MinQuantity, MaxQuantity";
                    }
                });
            });

            if (text != "") return text;
            return true;
        };
        ctrl.sendQuestionnaire = function() {
        	console.log(ctrl.sendQuestionnaireEmailType);

        	$.each(ctrl.emailSettings, function(k,v){
	        	if (!ctrl.request.footerSection.isRedelivery) {
	        		if (v.process == 'Standard' && v.transactionType.name == "PreRequest" && v.emailType.name == "Manual") {
	        			ctrl.sendQuestionnaireEmailType = v.emailType.name;
	        			ctrl.sendQuestionnaireEmailTemplate = v.template;
	        		}
	        	} else {
	        		if (v.process == 'Redelivery' && v.transactionType.name == "PreRequest" && v.emailType.name == "Manual") {
	        			ctrl.sendQuestionnaireEmailType = v.emailType.name;
	        			ctrl.sendQuestionnaireEmailTemplate = v.template;
	        		}	        		
	        	}
        	})

        	if (ctrl.sendQuestionnaireEmailType == "Manual") {
        		localStorage.setItem("setQuestionnaireTemplate", JSON.stringify(ctrl.sendQuestionnaireEmailTemplate) );
        		ctrl.goEmail();
        		return;
        	}
            ctrl.buttonsDisabled = true;
            newRequestModel.sendPrerequest(ctrl.request.id).then(
                function(responseData) {
                    ctrl.buttonsDisabled = false;
                    $state.reload();
                },
                function() {
                    ctrl.buttonsDisabled = false;
                }
            );
        };
        ctrl.amendRFQ = function() {
            groupOfRequestsModel.amendRFQ(ctrl.requirementsToAmend).then(function(){
	            $state.reload();
            });
        };
        ctrl.reloadRequest = function() {
            $state.reload();
        };

        ctrl.requestDateFieldsErrors = {};

        ctrl.validateRequestDateFields = function(location, locationIdx, elm) {
            $timeout(function() {
                function toggleInvalid(elm, action) {
                    if (action === 'add') {
                        $('#' + elm + '_dateinput').parent().find('input').addClass('invalid');
                        $('#' + elm + '_dateinput').addClass('invalid');
                    }
                    if (action === 'remove') {
                        $('#' + elm + '_dateinput').parent().find('input').removeClass('invalid');
                        $('#' + elm + '_dateinput').removeClass('invalid');
                    }
                }

                var hasError = false;
                var errorMessage = '';

                if (moment.utc(ctrl.request.locations[locationIdx].etb).isBefore(moment.utc(ctrl.request.locations[locationIdx].eta))) {
                    errorMessage = "ETA must be lower or equal to ETB.";
                    toastr.error(errorMessage);
                    toggleInvalid(locationIdx + '_etb', 'add');
                    ctrl.requestDateFieldsErrors[locationIdx + '_etb'] = errorMessage;
                    hasError = true;
                } else {
                    if (ctrl.request.locations[locationIdx].etb) {
                        toggleInvalid(locationIdx + '_etb', 'remove');
                        ctrl.requestDateFieldsErrors[locationIdx + '_etb'] = null;
                    }
                }
                if (moment.utc(ctrl.request.locations[locationIdx].etd).isBefore(moment.utc(ctrl.request.locations[locationIdx].eta))) {
                    errorMessage = "ETA must be lower or equal to ETD.";
                    toastr.error(errorMessage);
                    toggleInvalid(locationIdx + '_etd', 'add');
                    ctrl.requestDateFieldsErrors[locationIdx + '_etd'] = errorMessage;
                    hasError = true;
                } else {
                    if (ctrl.request.locations[locationIdx].etd) {
                        toggleInvalid(locationIdx + '_etd', 'remove');
                        ctrl.requestDateFieldsErrors[locationIdx + '_etd'] = null;
                    }
                }

                if (hasError) {
                    toggleInvalid(locationIdx + '_eta', 'add');
                } else {
                    if (ctrl.request.locations[locationIdx].eta) {
                        toggleInvalid(locationIdx + '_eta', 'remove');
                    }
                }

                hasError = false;

                if (ctrl.request.locations[locationIdx].recentEta) {
                    if (moment.utc(ctrl.request.locations[locationIdx].etb).isBefore(moment.utc(ctrl.request.locations[locationIdx].recentEta))) {
                        errorMessage = "Updated ETA must be lower or equal to ETB.";
                        toastr.error(errorMessage);
                        toggleInvalid(locationIdx + '_etb', 'add');
                        ctrl.requestDateFieldsErrors[locationIdx + '_etb'] = errorMessage;
                        hasError = true;
                    } else {
                        if (ctrl.request.locations[locationIdx].etb) {
                            toggleInvalid(locationIdx + '_etb', 'remove');
                            ctrl.requestDateFieldsErrors[locationIdx + '_etb'] = errorMessage;
                        }
                    }
                    if (moment.utc(ctrl.request.locations[locationIdx].etd).isBefore(moment.utc(ctrl.request.locations[locationIdx].recentEta))) {
                        errorMessage = "Updated ETA must be lower or equal to ETD.";
                        toastr.error(errorMessage);
                        toggleInvalid(locationIdx + '_etd', 'add');
                        ctrl.requestDateFieldsErrors[locationIdx + '_etd'] = errorMessage;
                        hasError = true;
                    } else {
                        if (ctrl.request.locations[locationIdx].etd) {
                            toggleInvalid(locationIdx + '_etd', 'remove');
                            ctrl.requestDateFieldsErrors[locationIdx + '_etd'] = errorMessage;
                        }
                    }
                }

                if (hasError) {
                    toggleInvalid(locationIdx + '_recentEta', 'add');
                } else {
                    if (ctrl.request.locations[locationIdx].eta) {
                        toggleInvalid(locationIdx + '_recentEta', 'remove');
                    }
                }

                if (moment.utc(ctrl.request.locations[locationIdx].etd).isBefore(moment.utc(ctrl.request.locations[locationIdx].etb))) {
                    errorMessage = "ETB must be lower or equal to ETD.";
                    toastr.error(errorMessage);
                    toggleInvalid(locationIdx + '_etd', 'add');
                    toggleInvalid(locationIdx + '_etb', 'add');
                    ctrl.requestDateFieldsErrors[locationIdx + '_etb_etd'] = errorMessage;
                    hasError = true;
                } else {
                    if (ctrl.request.locations[locationIdx].etd && !(ctrl.requestDateFieldsErrors[locationIdx + '_etd'] || ctrl.requestDateFieldsErrors[locationIdx + '_etb'])) {
                        toggleInvalid(locationIdx + '_etd', 'remove');
                        toggleInvalid(locationIdx + '_etb', 'remove');
                        ctrl.requestDateFieldsErrors[locationIdx + '_etb_etd'] = null;
                    }
                }

            });
        };

        ctrl.etaChanged = function(location, locationIdx) {
            $timeout(function() {
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
            var IsDestinationPort = false;
            var voyageIdToSend = angular.copy($stateParams.voyageId);
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
            return newRequestModel.getDestinations(val, ctrl.request.vesselId, voyageIdToSend, IsDestinationPort).then(function(response) {
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
            if (typeof ctrl.productIds == "undefined") {
                ctrl.productIds = [];
            }
            prodIndex = ctrl.productIds.indexOf(id);
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
            tooltipName = null;
            $.each($listsCache.Product, function(pk, pv) {
                if (pv.id == productId) {
                    tooltipName = pv.displayName;
                }
            });
            return tooltipName;
        };
        $scope.showHideSections = function(obj) {
            if (obj.length > 0) {
                $scope.visible_sections_old = $scope.visible_sections;
            } else {
                if (typeof $scope.visible_sections_old != "undefined") {
                    $scope.visible_sections = $scope.visible_sections_old;
                    $("select#multiple").selectpicker("val", $scope.visible_sections_old[0]);
                    $("select#multiple").selectpicker("render");
                }
            }
        };

        function setRequestStatusHeader() {
            if (typeof ctrl.request.requestStatus != "undefined") {
                if (!ctrl.request.requestStatus) {
                    ctrl.request.requestStatus = {};
                }
                if (ctrl.request.requestStatus.name) {
                    $state.params.status = {};
                    $state.params.status.name = ctrl.request.requestStatus.displayName ? ctrl.request.requestStatus.displayName : ctrl.request.requestStatus.name;
                    $state.params.status.bg = statusColors.getColorCodeFromLabels(
                        ctrl.request.requestStatus,
                        $listsCache.ScheduleDashboardLabelConfiguration);
                    $state.params.status.color = "white";
                }
            } else {
                $state.params.status = null;
            }
        }
    
        function setPageTitle(){
            if(ctrl.request.id){
                if(ctrl.request.name){
                    if(ctrl.request.vesselDetails.vessel){
                        var title = "Request" + " - " + ctrl.request.name +  " - " + ctrl.request.vesselDetails.vessel.name;
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


        /******************************************************************************
         * END EVENT HANDLERS
         *******************************************************************************/
        // used in nav
        $scope.NAV = {};
        $scope.NAV.requestId = $state.params.requestId;
        ctrl.selectDefaultContracts = function() {
            ctrl.checkboxes = {};
            $.each(ctrl.request.locations, function(lock, locv) {
                $.each(locv.products, function(prodk, prodv) {
                    if (prodv.contract) {
                        if (prodv.contract.contract) {
                            if (prodv.contract.contract.id) {
                                // ctrl.checkboxes[prodv.contract.contract.id] = true;
                                // if (contractIds.indexOf(prodv.contract.contract.id) == -1) {
                                //      contractIds.push(prodv.contract.contract.id);
                                // }
                                $.each(ctrl.contracts, function(ck, cv) {
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
            search = search ? search : "";
            
            hasValidatedProduct = false;
            $.each(ctrl.request.locations, function(lk,lv){
	            $.each(lv.products, function(pk,pv){
	            	if (pv.productStatus.name == 'Validated') {
			            hasValidatedProduct = true;
	            	}
	            })
            })

            if (!ctrl.request.hasBestContract || !hasValidatedProduct) {return false;}
            selectContractModel.getBestContract(ctrl.requestId, pagination, search).then(function(data) {
                processData(data);
                ctrl.bestContractsList = data.payload;
                ctrl.selectDefaultContracts();
                ctrl.showAllContracts = false;
            });
        };
        ctrl.displayAllContracts = function(pagination, search) {
            if (!pagination) {
                pagination = {};
                pagination.start = 0;
                pagination.length = ctrl.tableEntries;
            }
            search = search ? search : "";
            selectContractModel.getAllContract(ctrl.requestId, pagination, search).then(function(data) {
                processData(data, true);
                ctrl.showAllContracts = true;
            });
        };
        processData = function(data, all) {
            ctrl.contracts = data.payload;
            result = ctrl.contracts.length;
            if (typeof ctrl.currentPage == "undefined") {
                ctrl.currentPage = 1;
            }
            // page = 1;
            ctrl.entries = result;
            skip = ctrl.entries * (ctrl.currentPage - 1);
            ctrl.matchedCount = data.matchedCount;
            // ctrl.currentPage = page;
            ctrl.maxPages = Math.ceil(ctrl.matchedCount / ctrl.tableEntries);
            if (all) {
                ctrl.showAllContracts = true;
            }
        };
        ctrl.getNotificationsListPage = function(currentPage, direction) {
            if (direction == "next") {
                newPage = currentPage + 1;
                ctrl.changePage(newPage);
            }
            if (direction == "prev") {
                newPage = currentPage - 1;
                ctrl.changePage(newPage);
            }
        };
        ctrl.changePage = function(newPage) {
            ctrl.currentPage = newPage;
            pagination = {};
            pagination.start = newPage * ctrl.tableEntries - ctrl.tableEntries;
            pagination.length = ctrl.tableEntries;
            if (ctrl.showAllContracts) {
                ctrl.displayAllContracts(pagination, ctrl.search_contract);
            } else {
                ctrl.initContractTable(pagination, ctrl.search_contract);
            }
        };
        ctrl.initTableScale = function() {
            setTimeout(function() {
                $(".custom-hardcoded-table table").css("display", "none");
                $(".custom-hardcoded-table").css("max-width", function() {
                    return $($(this).parent()).width() + "px";
                });
                $(".custom-hardcoded-table table").css("display", "initial");
            }, 500);
        };
        $scope.prettyCloseModal = function() {
            var modalStyles = {
                transition: "0.3s",
                opacity: "0",
                transform: "translateY(-50px)"
            };
            var bckStyles = {
                opacity: "0",
                transition: "0.3s"
            };
            $("[modal-render='true']").css(modalStyles);
            $(".modal-backdrop").css(bckStyles);


            setTimeout(function() {
                if ($scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                if ($rootScope.modalInstance) {
                    $rootScope.modalInstance.close();
                }
            }, 500);
        };
        ctrl.checkProductsActionForCancelLocation = function(location) {
            canCancelLocation = false;
            $.each(location.products, function(pk, pv) {
                if (pv.id) {
                    $.each(pv.screenActions, function(sak, sav) {
                        if (sav.name == SCREEN_ACTIONS.CANCEL) {
                            canCancelLocation = true;
                        }
                    });
                }
            });
            if (canCancelLocation) {
                return true;
            } else {
                if(location.portStatus.name === "Stemmed") {
                    toastr.error("Order stemmed for the location and can't be removed");

                } else {
                    toastr.error('The location is already cancelled');
                }
                return false;
            }
        };
        ctrl.parseStatuses = function() {
            if (typeof ctrl.STATUS == "undefined") ctrl.STATUS = {};
            $.each($listsCache.Status, function(key, val) {
                ctrl.STATUS[val.name] = val;
            });
        };
        ctrl.parseStatuses();
        ctrl.canCancelProduct = function(product) {
            canCancel = false;
            $.each(product.screenActions, function(k, v) {
                if (v.name == SCREEN_ACTIONS.CANCEL) {
                    canCancel = true;
                }
            });
            return canCancel;
        };
        $(window).resize(function() {
            ctrl.initTableScale();
        });

        ctrl.isEnabledEta = function(locationIndex) {
            // 1. new request, enable eta
            if (!$stateParams.requestId) {
                $.each(ctrl.request.locations, function(locationIndex, value) {
                    ctrl.etaEnabled[locationIndex] = true;
                });
                return;
            }
            // 2. edit request
            $.each(ctrl.request.locations, function(locationIndex, value) {
                //for each location, check if eta should be enabled
                if (ctrl.requestTenantSettings.recentEta.id == 1) {
                    //recent eta is displayed
                    //now check if eta is editable
                    if (ctrl.shouldBeFreezed(locationIndex)) {
                        ctrl.etaEnabled[locationIndex] = false;
                        // return false;
                        //if etaFreezeStatus matches current location status, eta disabled
                    } else {
                        // else return true
                        // return true;
                        ctrl.etaEnabled[locationIndex] = true;
                    }
                } else {
                    //else recent eta not displayed, eta is editable
                    // return true;
                    ctrl.etaEnabled[locationIndex] = true;
                }
            });
        };
        ctrl.shouldBeFreezed = function(locationIndex) {
            //1. current status order
            /*$.each(ctrl.RequestStatusesOrdered, function(key,val){
                if(val.id == ctrl.request.requestStatus.id){
                    currentStatusOrder = val.requestStatusOrder;
                }
            });*/
            if (locationIndex == null) return;
            //1. current location status order
            var currentStatusOrder = 0;
            $.each(ctrl.RequestStatusesOrdered, function(key, val) {
                if (typeof ctrl.request.locations[locationIndex].portStatus != "undefined") {
                    if (ctrl.request.locations[locationIndex].portStatus != null) {
                        if (val.id == ctrl.request.locations[locationIndex].portStatus.id) {
                            currentStatusOrder = val.requestStatusOrder;
                        }
                    }
                } else {
                    //new location
                    return false; //not freezed
                }
            });
            //2. get eta freeze status order
            var etaStatusOrder = 99;
            // set etaStatusOrdern to a big number, if it doesn't match in  ctrl.RequestStatusesOrdered or is not defined, let ETA unfreezed.
            $.each(ctrl.RequestStatusesOrdered, function(key, val) {
                if (ctrl.requestTenantSettings.etaFreezeStatus != "undefined") {
                    if (ctrl.requestTenantSettings.etaFreezeStatus != null) {
                        if (val.id == ctrl.requestTenantSettings.etaFreezeStatus.id) {
                            etaStatusOrder = val.requestStatusOrder;
                        }
                    }
                }
            });
            if (etaStatusOrder <= currentStatusOrder) return true; //freeze
            return false;
        };

        ctrl.datesValid = function(locationIdx, date) {
            if (ctrl.request.locations[locationIdx].deliveryTo != null && ctrl.request.locations[locationIdx].deliveryFrom != null && typeof ctrl.request.locations[locationIdx].deliveryTo != "undefined" && typeof ctrl.request.locations[locationIdx].deliveryFrom != "undefined") {
                if (ctrl.request.locations[locationIdx].deliveryFrom <= ctrl.request.locations[locationIdx].deliveryTo) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        };
        ctrl.getRequestStatusesOrdered = function() {
            newRequestModel.getRequestStatusesOrdered().then(
                function(responseData) {
                    ctrl.RequestStatusesOrdered = responseData.payload;
                    console.log(ctrl.RequestStatusesOrdered);
                },
                function() {}
            );
        };
        ctrl.getRequestStatusesOrdered();

        ctrl.savePageSize = function(size) {
            ctrl.tableLength.layout = size;
            var payload = ctrl.tableLength;
            uiApiModel.saveListLayout("requestsContractList", payload).then(function(data) {
                if (data.isSuccess) {
                    toastr.success("Layout successfully saved");
                }
            });
        };

        ctrl.goToContractsSection = function() {
            window.scrollTo({
                top: 9999,
                behavior: "smooth"
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
            str = str.split("[")[1];
            str = str.split("]")[0];
            return str;
        };
        $scope.$on("dataListModal", function(e, a) {
            if (typeof a.elem != "undefined") {
                if (typeof a.val != "undefined") {
                    if (a.elem[a.elem.length - 1] == "vesselImoNo") {
                        ctrl.request.vesselDetails.vesselImoNo = ctrl.getImoObj(a.val.id);
                        ctrl.selectVessel(ctrl.request.vesselDetails.vesselImoNo.id);
                        return;
                    }
                    if (a.elem[a.elem.length - 1] == "vessel") {
                        ctrl.selectVessel(a.val.id);
                        return;
                    }

                    if (a.elem[a.elem.length - 1] == "autocompleteContract") {
                        ctrl.selectContract(a.val.id1);
                        return;
                    }
                    if (a.elem[a.elem.length - 1] == "new_location") {
                        // var location = ctrl.getLocationObj(a.val.id);
                        // $scope.addTypeLocation(location.id, location);
                        // var location = ctrl.getLocationObj(a.val.id);
                        $scope.addTypeLocation(a.val.id, a.val);
                        return;
                    }
                    if (a.elem[a.elem.length - 2].indexOf("location") >= 0) {
                        //location lookups
                        if (a.elem[a.elem.length - 1] == "service") {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            ctrl.selectServiceInLocation(a.val.id, idx);
                        }
                        if (a.elem[a.elem.length - 1] == "agent") {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            ctrl.request.locations[idx].agent = a.val;
                        }
                        if (a.elem[a.elem.length - 1] == "buyer") {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            ctrl.request.locations[idx].buyer = a.val;
                        }
                        if (a.elem[a.elem.length - 1] == "destinationInput") {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            if(a.val.voyageCode) {
                              a.val.name = a.val.locationCode + ' - ' +  a.val.voyageCode + ' - ' + a.val.etaFormated;
                            }
                        	ctrl.selectDestinationPort(a.val, idx)
                            
                            // ctrl.request.locations[idx].destination = {
                            //   id: a.val.locationId,
                            //   name: a.val.name,
                            // };
                            // ctrl.request.locations[idx].destinationVesselVoyageDetailId = a.val.vesselVoyageDetailId;
                        }
                        if (a.elem[a.elem.length - 1] == "company") {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            ctrl.selectCompanyInLocation(a.val.id, idx);
                            ctrl.request.locations[idx].company = a.val;
                        }
                        if (a.elem[a.elem.length - 1].indexOf("products") >= 0) {
                            var idx = $scope.modalGetIndex(a.elem[a.elem.length - 2]);
                            var idx2 = $scope.modalGetIndex(a.elem[a.elem.length - 1]);
                            var prod = ctrl.getProductObj(a.val.id);
                            ctrl.selectProduct(prod.id);
                            ctrl.request.locations[idx].products[idx2].product = prod;
                        }
                    } else {
                    	if ( a.elem.indexOf("company") != -1 ) {
                    		ctrl.request.company = a.val;
                    	}
                    }
                    if (a.elem[a.elem.length - 1] == "service") {
                        ctrl.selectService(a.val.id);
                        return;
                    }

                }
            }
        });

		ctrl.selectDestinationPort = function(data,locationIdx) {
			var nextAvailableDestinationIndex = "";
			if (!ctrl.request.locations[locationIdx].destination4) {nextAvailableDestinationIndex = 4}
			if (!ctrl.request.locations[locationIdx].destination3) {nextAvailableDestinationIndex = 3}
			if (!ctrl.request.locations[locationIdx].destination2) {nextAvailableDestinationIndex = 2}
			if (!ctrl.request.locations[locationIdx].destination1) {nextAvailableDestinationIndex = 1}
            if (!ctrl.request.locations[locationIdx].destination) {nextAvailableDestinationIndex = ""}
	        ctrl.request.locations[locationIdx].destinationInput = null;

			if (
				ctrl.request.locations[locationIdx].destination && 
				ctrl.request.locations[locationIdx].destination1 && 
				ctrl.request.locations[locationIdx].destination2 && 
				ctrl.request.locations[locationIdx].destination3 && 
				ctrl.request.locations[locationIdx].destination4 
			) {
				toastr.warning("You can select up to 5 Destination Ports");
				ctrl.getLowestEtaForDestinationInLocation(locationIdx)
				return;
			}	

			allDestinations = [
				ctrl.request.locations[locationIdx].destination ? ctrl.request.locations[locationIdx].destination : undefined,
				ctrl.request.locations[locationIdx].destination1 ? ctrl.request.locations[locationIdx].destination1 : undefined,
				ctrl.request.locations[locationIdx].destination2 ? ctrl.request.locations[locationIdx].destination2 : undefined,
				ctrl.request.locations[locationIdx].destination3 ? ctrl.request.locations[locationIdx].destination3 : undefined,
				ctrl.request.locations[locationIdx].destination4 ? ctrl.request.locations[locationIdx].destination4 : undefined
			]

			allDestinations = _.compact(allDestinations);
			duplicateDestination = false
			$.each(allDestinations, function(k,v){
				if (data.id == v.id) {
					duplicateDestination = true
				}
			})

			if (duplicateDestination) {
				toastr.warning("The same Destination cannot be added more than once!");
				ctrl.getLowestEtaForDestinationInLocation(locationIdx)											
				return;
			}

			ctrl.request.locations[locationIdx]["destination" + nextAvailableDestinationIndex + "VesselVoyageDetailId"] = data.destinationVesselVoyageDetailId;
			// debugger; 
            ctrl.request.locations[locationIdx]["destination" + nextAvailableDestinationIndex] = {
                  id: data.id,
                  name: data.name,
            };
            ctrl.request.locations[locationIdx]["destination" + nextAvailableDestinationIndex + "VesselVoyageDetailId"] = data.vesselVoyageDetailId;
            ctrl.request.locations[locationIdx]["destination" + nextAvailableDestinationIndex + "Eta"] = data.eta;

			ctrl.getLowestEtaForDestinationInLocation(locationIdx)											

		}

		ctrl.getLowestEtaForDestinationInLocation = function(locationIdx) {
			var lowestEta = "9999-12-30T00:00:00.0000000Z";
			ctrl.request.locations[locationIdx].destinationInput = null;
			if (ctrl.request.locations[locationIdx].destinationEta) { 
				if (moment.utc(ctrl.request.locations[locationIdx].destinationEta).isBefore(moment.utc(lowestEta))) {
					lowestEta = ctrl.request.locations[locationIdx].destinationEta
					ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination
				}				
			}
			if (ctrl.request.locations[locationIdx].destination1Eta) {
				if (moment.utc(ctrl.request.locations[locationIdx].destination1Eta).isBefore(moment.utc(lowestEta))) {
					lowestEta = ctrl.request.locations[locationIdx].destination1Eta;
					ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination1
				}				
			}
			if (ctrl.request.locations[locationIdx].destination2Eta) {
				if (moment.utc(ctrl.request.locations[locationIdx].destination2Eta).isBefore(moment.utc(lowestEta))) {
					lowestEta = ctrl.request.locations[locationIdx].destination2Eta;
					ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination2
				}				
			}
			if (ctrl.request.locations[locationIdx].destination3Eta) {
				if (moment.utc(ctrl.request.locations[locationIdx].destination3Eta).isBefore(moment.utc(lowestEta))) {
					lowestEta = ctrl.request.locations[locationIdx].destination3Eta;
					ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination3
				}				
			}
			if (ctrl.request.locations[locationIdx].destination4Eta) {
				if (moment.utc(ctrl.request.locations[locationIdx].destination4Eta).isBefore(moment.utc(lowestEta))) {
					lowestEta = ctrl.request.locations[locationIdx].destination4Eta;
					ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination4
				}					
			}
			if (!ctrl.request.locations[locationIdx].destinationInput) {
				if (ctrl.request.locations[locationIdx].destination4) {ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination4}
				if (ctrl.request.locations[locationIdx].destination3) {ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination3}
				if (ctrl.request.locations[locationIdx].destination2) {ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination2}
				if (ctrl.request.locations[locationIdx].destination1) {ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination1}
				if (ctrl.request.locations[locationIdx].destination) {ctrl.request.locations[locationIdx].destinationInput = ctrl.request.locations[locationIdx].destination}
			}
		}

        ctrl.getImoObj = function(vesselId) {
            var found = null;
            $.each(ctrl.listsCache.VesselWithImo, function(key, val) {
                if (val.id == vesselId) found = val;
            });
            return found;
        };
        ctrl.getProductObj = function(prodId) {
            var found = null;
            $.each(ctrl.listsCache.Product, function(key, val) {
                if (val.id == prodId) found = val;
            });
            return found;
        };
        ctrl.getLocationObj = function(locId) {
            var found = null;
            $.each(ctrl.listsCache.Location, function(key, val) {
                if (val.id == locId) found = val;
            });
            return found;
        };

        ctrl.getServiceIdForReport = function() {
        	if (!ctrl.requestTenantSettings || !ctrl.request.locations) {
        		return;
        	}
			var computedServiceId = 0;
			if (ctrl.requestTenantSettings.displayOfService.internalName == "PortSection") {
				var servicesEtas = [];
				$.each(ctrl.request.locations, function(k,v){
					if (v.service) {
						if (v.service.id) {
							var currentDateEta = null;
							if (v.recentEta) {
								currentDateEta = v.recentEta;
							}
							if (v.eta) {
								currentDateEta = v.eta;
							}
							servicesEtas.push([v.service.id, currentDateEta]);
						}
					}
				})
				var minIdx = 0;
				for(var i = 0; i < servicesEtas.length; i++) {
				    if(servicesEtas[i][1] < servicesEtas[minIdx][1]) minIdx = i;
				}
				if (servicesEtas.length > 0) {
					computedServiceId = servicesEtas[minIdx][0];
				}	
			} else {
				if (ctrl.request.vesselDetails) {
					if (ctrl.request.vesselDetails.service) {
						computedServiceId = ctrl.request.vesselDetails.service.id;
					}
				}
			}
			return computedServiceId;
        	// console.log();
        }

        ctrl.showDestinations = function(locationIdx, event) {
        	console.log(ctrl.request.locations[locationIdx]);
        	console.log(event);
        }

        ctrl.changedValue = function(index) {
           $(".st-new-request-form.form-horizontal.collapse.in.row")[index].style.cssText = "overflow: initial";
        }
        ctrl.changeScroll = function(index) {
            $(".st-new-request-form.form-horizontal.collapse.in.row")[index].style.cssText = "overflow: auto";
        }

        // jQuery(document).ready(function(){
        //     $(document).on("click", function(e){
        //         if (e.toElement.name != "Product" && e.toElement.name != "") {
        //             $(".st-new-request-form.form-horizontal.collapse.in.row").css("overflow", "auto");
        //         } else if (e.toElement.name == "Product") {
                    
        //         }
        //     });
     
        // });

      

    }



   
]);
angular.module("shiptech.pages").component("newRequest", {
    templateUrl: "pages/new-request/views/new-request-component.html",
    controller: "NewRequestController"
});
