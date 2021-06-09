angular.module('shiptech.pages').controller('SupplierPortalController', [ 'API', '$scope', '$rootScope', 'Factory_Master', '$element', '$attrs', '$timeout','$http', '$filter', '$state', '$stateParams', 'tenantModel', 'tenantSupplierPortalService', 'uiApiModel', 'listsModel', 'lookupModel', 'supplierPortalModel', 'groupOfRequestsModel', 'LOOKUP_MAP', 'LOOKUP_TYPE', 'VALIDATION_MESSAGES', 'COST_TYPE_IDS', 'COMPONENT_TYPE_IDS', 'IDS', 'VALIDATION_STOP_TYPE_IDS', 'CUSTOM_EVENTS', 'MOCKUP_MAP', 'PACKAGES_CONFIGURATION', 'tenantService', '$compile', 'screenLoader', '$listsCache',

function(API, $scope, $rootScope, Factory_Master, $element, $attrs, $timeout, $http, $filter, $state, $stateParams, tenantModel, tenantSupplierPortalService, uiApiModel, listsModel, lookupModel, supplierPortalModel, groupOfRequestsModel, LOOKUP_MAP, LOOKUP_TYPE, VALIDATION_MESSAGES, COST_TYPE_IDS, COMPONENT_TYPE_IDS, IDS, VALIDATION_STOP_TYPE_IDS, CUSTOM_EVENTS, MOCKUP_MAP, PACKAGES_CONFIGURATION, tenantService, $compile, screenLoader, $listsCache) {
        let ctrl = this;
        ctrl.token = $stateParams.token;
        $scope.forms = {};
        ctrl.supplierUpdate = null;
        $scope.formsPkg = {};
        ctrl.additionalCosts = [];
        ctrl.isSupportedBrowser = true;
        // ctrl.packages = [];
        ctrl.lists = $listsCache;
        ctrl.FilterAdditionalCost = [];
        ctrl.reasons = ctrl.lists.NoQuoteReason;
        ctrl.lookupType = null;
        ctrl.sellerPortalModule = null;
        ctrl.additionalCostApplicableFor = {};
        ctrl.additionalCostTotalAmountSums = {};
        ctrl.tenantSettings = tenantSupplierPortalService.tenantSettings;
        ctrl.offer = null;
        ctrl.loaded = false;
        ctrl.tenantQuoteDisabled = null;
        ctrl.tenantQuoteWarning = null;
        ctrl.buttonsDisabled = false;
        ctrl.productTableNoQuoteCheckAll = [];
        ctrl.PRICING_TYPE_FORMULA_ID = 2;
        ctrl.packagesConfigurationEnabled = PACKAGES_CONFIGURATION.ENABLED;
        // There is no "Other" product at the moment. This is simply the first unassigned ID based on the products currently received from backend.
        // Once there is an "Other" product, its ID should replace the value below.
        ctrl.PRODUCT_OTHER_ID = 10;
        ctrl.COST_TYPE_UNIT_ID = 2;
        ctrl.invalidFields = [];
        ctrl.contact = null;
        ctrl.vesselsNumber = 0;
        ctrl.editSupplierIdx_individuals = null;
        ctrl.editSupplierIdx_package = null;
        $rootScope.reloadTenantConfiguration = true;
        if ($stateParams.title === 'Shiptech Supplier Portal') {
            ctrl.supplierPortalFlag = true;
        } else {
            ctrl.supplierPortalFlag = false;
        }
        ctrl.loadedData = false;
        if ($state.current.name == 'default.group-of-requests') {
            ctrl.numberPrecision = tenantSupplierPortalService.tenantSettings.$$state.value.payload.defaultValues;
            ctrl.currency = tenantSupplierPortalService.tenantSettings.$$state.value.payload.tenantFormats.currency;
            ctrl.tenantDefaultUom = tenantSupplierPortalService.tenantSettings.$$state.value.payload.tenantFormats.uom;
        } else {
            tenantSupplierPortalService.tenantSettings.then((settings) => {
                ctrl.numberPrecision = settings.payload.defaultValues;
                ctrl.currency = settings.payload.tenantFormats.currency;
                ctrl.tenantDefaultUom = settings.payload.tenantFormats.uom;
            });
        }
        $rootScope.$on('tenantConfiguration', (event, value) => {
            ctrl.procurementSettings = value.procurement;
        });

        Factory_Master.get_master_entity(1, 'configuration', 'admin', (callback2) => {
            if (callback2) {
                $rootScope.adminConfiguration = callback2;
            }
        });
        if ($stateParams.token) {
            tenantService.procurementSettings.then((settings) => {
                ctrl.procurementSettings = settings.payload;
            });
            browser = browserInfo();
            var Payload = {
                OperatingSystem: `${browser.os } ${ browser.osVersion}`,
                Build: '',
                Browser: `${browser.browser } ${ browser.browserMajorVersion}`,
                // "Browser": 'Opera',
                BrowserVersion: browser.browserVersion
            };
            tenantModel.checkBrowserSupport(ctrl.token, Payload).then((data) => {
                if (data.payload.isSupported) {
                    ctrl.isSupportedBrowser = true;
                    bootSellerPortal();
                } else {
                    // console.log(data)
                    ctrl.isSupportedBrowser = false;
                    ctrl.supportedBrowsers = data.payload.supportedBrowsers;
                }
            });

            function bootSellerPortal() {

                var quoteByDateExpired, timeNowUtc, quoteByDateInUtc, request, req_ids;
                $scope.display = 3;
                tenantModel.getForSupplierPortal(ctrl.token).then((data) => {
                    ctrl.tenantSettings = data.payload;
                    // console.log('Tenant Settings: ', ctrl.tenantSettings);
                    uiApiModel.get().then((data) => {
                        ctrl.ui = data;
                        // Normalize relevant data for use in template.
                        ctrl.requestDetailsFields = normalizeArrayToHash(ctrl.ui.requestDetails.fields, 'name');
                        ctrl.bunkerablePortsFields = normalizeArrayToHash(ctrl.ui.bunkerablePorts.fields, 'name');
                        ctrl.commentsFields = normalizeArrayToHash(ctrl.ui.comments.fields, 'name');
                        ctrl.productFormFields = normalizeArrayToHash(ctrl.ui.product.fields, 'name');
                        ctrl.productColumns = normalizeArrayToHash(ctrl.ui.product.columns, 'name');
                        ctrl.additionalCostColumns = normalizeArrayToHash(ctrl.ui.additionalCost.columns, 'name');
                        if (ctrl.tenantSettings) {
                            if (ctrl.tenantSettings.fieldVisibility.isSupplyQuantityHidden) {
                                delete ctrl.productColumns["supplyQuantity"];
                            }
                            if (ctrl.tenantSettings.fieldVisibility.isSupplyDeliveryDateHidden) {
                                delete ctrl.productColumns["supplyDeliveryDate"];
                            }
                        }                        
                        listsModel.getForSupplierPortal(ctrl.token).then((data) => {
                            ctrl.lists = data;
                            console.log(ctrl.lists);
                            lookupModel.getAdditionalCostTypesForSupplierPortal(ctrl.token).then((data) => {
                                ctrl.additionalCostTypes = normalizeArrayToHash(data.payload, 'id');
                                supplierPortalModel.getRfq(ctrl.token).then((data) => {
                                    ctrl.individuals = data.payload.individuals;
                                    ctrl.validity = data.payload.validity;
                                    ctrl.packagesOffers = [];
                                    ctrl.payload = data.payload;
                                    ctrl.buyerComments = data.payload.buyerComments;
                                    ctrl.packages = [];
                                    // ctrl.packages = data.payload.packages;
                                    $.each(data.payload.packages, (k, v) => {
                                        if (v.isPackageOffer) {
                                            ctrl.packagesOffers.push(v);
                                        } else {
                                            ctrl.packages.push(v);
                                        }
                                    });
                                    ctrl.requests = [];
                                    ctrl.loaded = true;
                                    // ctrl.request = ctrl.requests[0];
                                    req_ids = [];
                                    $.each(ctrl.individuals, (k, v) => {
                                        request = v.request;
                                        request.location = v.requestLocation;
                                        request.vesselDetails = v.vesselDetails;
                                        if (v.physicalSupplier) {
                                            v.rand = `i_${ v.id }_${ v.physicalSupplier.id}`;
                                        } else {
                                            v.rand = `i_${ v.id }_null`;
                                        }
                                        if ($.inArray(request.id, req_ids) == -1) {
                                            req_ids.push(request.id);
                                            ctrl.requests.push(request);
                                        }
                                    });
                                    $.each(ctrl.packages, (k, v) => {
                                        if (v.physicalSupplier) {
                                            v.rand = `p_${ v.id }_${ v.physicalSupplier.id }_null`;
                                        } else {
                                            v.rand = `p_${ v.id }_null` + '_null';
                                        }
                                    });
                                    $.each(ctrl.packagesOffers, (k, v) => {
                                        if (v.physicalSupplier) {
                                            v.rand = `po_${ v.id }_${ v.physicalSupplier.id }_null`;
                                        } else {
                                            v.rand = `po_${ v.id }_null` + '_null';
                                        }
                                    });
                                    ctrl.locations = getAllLocations();
                                    ctrl.vesselsNumber = getDistinctVessels();
                                    console.log(ctrl.locations);
                                    console.log(ctrl.vesselsNumber);

                                    /**
                                     * To be checked
                                     */
                                    // for (var i = 0; i < ctrl.individuals.length; i++) {
                                    //     var offersPS = $filter("filter")(ctrl.request.offers, {
                                    //         requestLocationId: ctrl.locations.id
                                    //     });
                                    //     for (var j = 0; j < offersPS.length; j++) {
                                    //         for (var k = 0; k < ctrl.individuals[i].products.length; k++) {
                                    //             for (var l = 0; l < ctrl.individuals[i].products[k].sellers.length; l++) {
                                    //                 if (ctrl.individuals[i].products[k].sellers[l].offers[0].offer.id == offersPS[j].id) offersPS[j].physicalSupplier = ctrl.individuals[i].products[k].sellers[l].offers[0].physicalSupplierCounterparty;
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // getLocationsSuppliers();
                                    // getPackages();
                                    calculateProductAmountsAllLocations();
                                    initNoQuoteCheckBoxAllLocations(ctrl.locations);
                                    // Holds the IDs of the locations checked in the Bunkerable Ports section.
                                    // It is bound there in the template, so updating it is reflected automagically
                                    // in the view.
                                    ctrl.selectedLocationIds = selectAllLocationIds(ctrl.locations);
                                    ctrl.offer = ctrl.locations[0].products[0].sellers[0].offers[0];
                                    ctrl.active_req = ctrl.requests[0].id;
                                    // console.log(ctrl.request);
                                    /**
                                     * Mock quote by date & timezone functionality.
                                     * Delete this to work with real data!
                                     * TODO: delete this after feature fully tested with live data.
                                     */
                                    // ctrl.offer.quoteByDate = mockQuoteDates.quoteByDate;
                                    // ctrl.tenantSettings.offer.needValidationOnQuoteByDateExpiry = VALIDATION_STOP_TYPE_IDS.SOFT;
                                    /* End mockup. */
                                    quoteByDateInUtc = parseFloat(moment(moment(ctrl.offer.quoteByDate)).format('x')) - parseFloat(ctrl.offer.utcOffset * 60 * 1000);
                                    timeNowUtc = new Date().getTime();
                                    quoteByDateExpired = quoteByDateInUtc < timeNowUtc;
                                    ctrl.tenantQuoteDisabled = quoteByDateExpired && ctrl.tenantSettings.offer.needValidationOnQuoteByDateExpiry.id === VALIDATION_STOP_TYPE_IDS.HARD;
                                    ctrl.tenantQuoteWarning = quoteByDateExpired && ctrl.tenantSettings.offer.needValidationOnQuoteByDateExpiry.id === VALIDATION_STOP_TYPE_IDS.SOFT;
                                    // ctrl.tenantQuoteWarning = moment(ctrl.offer.quoteByDate).isBefore() &&
                                    //                         ctrl.tenantSettings.offer.needValidationOnQuoteByDateExpiry.id === VALIDATION_STOP_TYPE_IDS.SOFT;
                                    // console.log(ctrl.offer);
                                    addFirstAdditionalCost(null);
                                    // Get the counterparty contacts to use in the Quoted by select control.
                                    lookupModel.getCounterpartyContactsForSupplierPortal(ctrl.token, getContactCounterparty().id).then((data) => {
                                        ctrl.counterpartyContacts = data.payload;
                                    });
                                    lookupModel.getNoQuoteReasonForSupplierPortal(ctrl.token).then((data) => {
                                        ctrl.reasons = data.payload;
                                    });
                                    $.each(ctrl.locations, (k, v) => {
                                        let addCost = ctrl.getAdditionalCosts(v);
                                        $.each(addCost, (k1, v1) => {
                                            addPriceUomChg(v1, v);
                                        });
                                    });
                                    // Bind Select2 selects.
                                    // $('.select2').select2({
                                    //     width: null
                                    // });
                                    ctrl.initSellersCardNavigation();
                                    ctrl.loadedData = true;
                                });
                            });
                        });
                    });
                }, (response) => {
                    if (response) {
                        ctrl.buttonsDisabled = true;
                        toastr.error(response.data.ErrorMessage, response.statusText, {
                            positionClass: 'toast-top-center',
                            timeOut: '-1'
                        });
                    }
                    // console.log(response)
                });
            }
        } else {
            ctrl.loadedData = true;
            $scope.display = 2;
            tenantService.procurementSettings.then((settings) => {
                ctrl.negotiationDisplayDecimal = settings.payload.request.negotiationDisplayDecimal.id == 1;
            });
            ctrl.$onChanges = function(change) {
                var activeRequest, quoteByDateExpired, timeNowUtc, quoteByDateInUtc, req_ids;
                ctrl.individuals = null;
                ctrl.packages = null;
                if (typeof change.source != 'undefined') {
                    if (change.source.currentValue) {
                        uiApiModel.get(MOCKUP_MAP['unrouted.seller-card']).then((data) => {
                            ctrl.lookupType = 'products';
                            ctrl.ui = data;

                            // Normalize relevant data for use in template.
                            ctrl.requestDetailsFields = normalizeArrayToHash(ctrl.ui.requestDetails.fields, 'name');
                            ctrl.bunkerablePortsFields = normalizeArrayToHash(ctrl.ui.bunkerablePorts.fields, 'name');
                            ctrl.commentsFields = normalizeArrayToHash(ctrl.ui.comments.fields, 'name');
                            ctrl.productFormFields = normalizeArrayToHash(ctrl.ui.product.fields, 'name');
                            ctrl.productColumns = normalizeArrayToHash(ctrl.ui.product.columns, 'name');
                            ctrl.additionalCostColumns = normalizeArrayToHash(ctrl.ui.additionalCost.columns, 'name');
                            ctrl.requests = [];
                            ctrl.activerequestid = null;

                            if (ctrl.procurementSettings) {
	                        	if (ctrl.procurementSettings.fieldVisibility.isSupplyQuantityHidden) {
									delete ctrl.productColumns["supplyQuantity"];
								}
	                        	if (ctrl.procurementSettings.fieldVisibility.isSupplyDeliveryDateHidden) {
									delete ctrl.productColumns["supplyDeliveryDate"];
								}
                            }


                            lookupModel.getAdditionalCostTypes().then((data) => {
                                setTimeout(() => {
                                    ctrl.additionalCostTypes = normalizeArrayToHash(data.payload, 'id');
                                    if (!change.source.currentValue.payload) {
                                        return false;
                                    }
                                    ctrl.individuals = change.source.currentValue.payload.data.payload.individuals;
                                    ctrl.packages = change.source.currentValue.payload.data.payload.packages;
                                    ctrl.cardInitData = change.source.currentValue.initData;

                                    /* calculate active tab*/
                                    ctrl.activeTabParams = change.source.currentValue.activeSellerCardTab;
                                    if (ctrl.activeTabParams) {
                                        if (ctrl.activeTabParams.requestId) {
                                            ctrl.active_req = ctrl.activeTabParams.requestId;
                                            ctrl.tabType = 'individual';
                                            $.each(ctrl.individuals, (k, v) => {
                                                if (v.request.id == ctrl.activeTabParams.requestId) {
                                                    activeRequest = v;
                                                }
                                            });
                                            // ctrl.request = activeRequest;
                                            // ctrl.onTabClick(activeRequest);
                                            if (ctrl.activeTabParams.packageType != 'individual') {
                                                if (ctrl.activeTabParams.rfqId != null) {
                                                    ctrl.tabType = 'package';
                                                    ctrl.activeRFQ = ctrl.activeTabParams.rfqId;
                                                    ctrl.isPackageOffer = false;
                                                } else {
                                                    ctrl.tabType = 'package';
                                                    ctrl.activeRFQ = 'surrogate';
                                                    ctrl.isPackageOffer = false;
                                                }
                                            }
                                        }
                                    }

                                    /* end calculate active tab*/
                                    ctrl.requests = [];
                                    ctrl.loaded = true;
                                    if (typeof ctrl.currency == 'undefined') {
                                        $.each(ctrl.individuals, (indK, indV) => {
                                            $.each(indV.products, (prodK, prodV) => {
                                                $.each(prodV.sellers, (selK, selV) => {
                                                    if (selV.quotedByCurrency.id && !ctrl.currency.id) {
                                                        ctrl.currency = selV.quotedByCurrency;
                                                    }
                                                });
                                            });
                                        });
                                        $.each(ctrl.packages, (indK, indV) => {
                                            $.each(indV.rfqs, (rfqK, rfqV) => {
                                                $.each(rfqV.requests, (reqK, reqV) => {
                                                    $.each(reqV.locations, (locK, locV) => {
                                                        $.each(locV.products, (prodK, prodV) => {
                                                            $.each(prodV.sellers, (selK, selV) => {
                                                                if (selV.quotedByCurrency.id && !ctrl.currency.id) {
                                                                    ctrl.currency = selV.quotedByCurrency;
                                                                }
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }
                                    // ctrl.request = ctrl.requests[0];
                                    req_ids = [];
                                    $.each(ctrl.individuals, (k, v) => {
                                        var request = v.request;
                                        request.location = v.requestLocation;
                                        if (v.physicalSupplier) {
                                            v.rand = `i_${ v.id }_${ v.physicalSupplier.id}`;
                                        } else {
                                            v.rand = `i_${ v.id }_null`;
                                        }
                                        if ($.inArray(request.id, req_ids) == -1) {
                                            req_ids.push(request.id);
                                            ctrl.requests.push(request);
                                        }
                                    });
                                    $.each(ctrl.packages, (k, v) => {
                                        if (v.physicalSupplier) {
                                            v.rand = `p_${ v.id }_${ v.physicalSupplier.id }_null`;
                                        } else {
                                            v.rand = `p_${ v.id }_null` + '_null';
                                        }
                                    });
                                    ctrl.locations = getAllLocations();
                                    console.log(ctrl.locations);

                                    /**
                                     * To be checked
                                     */
                                    // for (var i = 0; i < ctrl.individuals.length; i++) {
                                    //     var offersPS = $filter("filter")(ctrl.request.offers, {
                                    //         requestLocationId: ctrl.locations.id
                                    //     });
                                    //     for (var j = 0; j < offersPS.length; j++) {
                                    //         for (var k = 0; k < ctrl.individuals[i].products.length; k++) {
                                    //             for (var l = 0; l < ctrl.individuals[i].products[k].sellers.length; l++) {
                                    //                 if (ctrl.individuals[i].products[k].sellers[l].offers[0].offer.id == offersPS[j].id) offersPS[j].physicalSupplier = ctrl.individuals[i].products[k].sellers[l].offers[0].physicalSupplierCounterparty;
                                    //             }
                                    //         }
                                    //     }
                                    // }
                                    // getLocationsSuppliers();
                                    // getPackages();
                                    calculateProductAmountsAllLocations();
                                    initNoQuoteCheckBoxAllLocations(ctrl.locations);
                                    // Holds the IDs of the locations checked in the Bunkerable Ports section.
                                    // It is bound there in the template, so updating it is reflected automagically
                                    // in the view.
                                    ctrl.selectedLocationIds = selectAllLocationIds(ctrl.locations);
                                    ctrl.offer = ctrl.locations[0].products[0].sellers[0].offers[0];
                                    // if (ctrl.requests.length > 0) {
                                    //     ctrl.active_req = ctrl.requests[0].id
                                    // }
                                    // console.log(ctrl.request);
                                    /**
                                     * Mock quote by date & timezone functionality.
                                     * Delete this to work with real data!
                                     * TODO: delete this after feature fully tested with live data.
                                     */
                                    // ctrl.offer.quoteByDate = mockQuoteDates.quoteByDate;
                                    // ctrl.tenantSettings.offer.needValidationOnQuoteByDateExpiry = VALIDATION_STOP_TYPE_IDS.SOFT;
                                    /* End mockup. */
                                    quoteByDateInUtc = parseFloat(moment(moment(ctrl.offer.quoteByDate)).format('x')) - parseFloat(ctrl.offer.utcOffset * 60 * 1000);
                                    timeNowUtc = new Date().getTime();
                                    quoteByDateExpired = quoteByDateInUtc < timeNowUtc;
                                    ctrl.tenantQuoteDisabled = quoteByDateExpired && ctrl.tenantSettings.offer.needValidationOnQuoteByDateExpiry.id === VALIDATION_STOP_TYPE_IDS.HARD;
                                    ctrl.tenantQuoteWarning = quoteByDateExpired && ctrl.tenantSettings.offer.needValidationOnQuoteByDateExpiry.id === VALIDATION_STOP_TYPE_IDS.SOFT;
                                    // ctrl.tenantQuoteWarning = moment(ctrl.offer.quoteByDate).isBefore() &&
                                    //                         ctrl.tenantSettings.offer.needValidationOnQuoteByDateExpiry.id === VALIDATION_STOP_TYPE_IDS.SOFT;
                                    // console.log(ctrl.offer);
                                    addFirstAdditionalCost(null);
                                    // Get the counterparty contacts to use in the Quoted by select control.
                                    // lookupModel.getCounterpartyContacts(ctrl.token, getContactCounterparty().id).then(function(data) {
                                    //     ctrl.counterpartyContacts = data.payload;
                                    // });
                                    // lookupModel.getNoQuoteReason(ctrl.token).then(function(data) {
                                    //     ctrl.reasons = data.payload;
                                    // });
                                    $.each(ctrl.locations, (k, v) => {
                                        let addCost = ctrl.getAdditionalCosts(v);
                                        $.each(addCost, (k1, v1) => {
                                            addPriceUomChg(v1, v);
                                        });
                                    });
                                    // Bind Select2 selects.
                                    // $('.select2').select2({
                                    //     width: null
                                    // });
                                    ctrl.initSellersCardNavigation();
                                }, 10);
                            });
                        });
                    }
                }
            };
        }

        ctrl.stripDecimals = function(value) {
            if (!ctrl.negotiationDisplayDecimal) {
                return Math.round(value);
            }
        		return value;
        };

        ctrl.initUniqueAvailableRFQsForPkg = function() {
            var uniqueRfqs = [];
            var rfqObj;
            $.each(ctrl.packages, (pk, pv) => {
                $.each(pv.rfqs, (rk, rv) => {
                    if (rv.rfq != 'null') {
                        if (rv.rfq) {
                            if (uniqueRfqs.indexOf(rv.rfq.id) == -1) {
                                rfqObj = rv.rfq.id;
                                uniqueRfqs.push(rfqObj);
                            }
                        }
                    }
                });
            });
            ctrl.uniqueAvailableRFQsForPkg = uniqueRfqs;
            // return uniqueRfqs;
        };
        ctrl.getAllProductsinRFQPackage = function(rfqId) {
            var rfqProducts = [];
            var addedPorductsIds = [];
            $.each(ctrl.packages, (pk, pv) => {
                $.each(pv.rfqs, (rk, rv) => {
                    if (rv.rfq != 'null') {
                        if (rv.rfq) {
                            if (rv.rfq.id == rfqId) {
                                $.each(rv.requests, (reqK, reqV) => {
                                    $.each(reqV.request.locations, (locK, locV) => {
                                        $.each(locV.products, (prodK, prodV) => {
                                            if (addedPorductsIds.indexOf(prodV.product.id) == -1) {
                                                addedPorductsIds.push(prodV.product.id);
                                                rfqProducts.push(prodV.product);
                                            }
                                        });
                                    });
                                });
                            }
                        } else if (rfqId == 'surrogate') {
                            $.each(rv.requests, (reqK, reqV) => {
                                $.each(reqV.request.locations, (locK, locV) => {
                                    $.each(locV.products, (prodK, prodV) => {
                                        if (addedPorductsIds.indexOf(prodV.product.id) == -1) {
                                            addedPorductsIds.push(prodV.product.id);
                                            rfqProducts.push(prodV.product);
                                        }
                                    });
                                });
                            });
                        }
                    }
                });
            });
            return rfqProducts;
        };

        function initNoQuoteCheckBoxAllLocations(locations) {
            for (let i = 0; i < locations.length; i++) {
                ctrl.productTableNoQuoteCheckAll[locations[i].rand] = areAllProductsNoQuote(locations[i]);
                if (ctrl.productTableNoQuoteCheckAll[locations[i].rand]) {
                    setMainReason(locations[i]);
                }
            }
        }

        /**
         * Gets the contract counterparty object, which is the same for all products in all locations.
         * Due to the backend data model design, this is the way to get it: extract it from the first
         * offer of the first seller of the first product of the first location.
         */
        function getContactCounterparty() {
            // console.log(ctrl.request.locations[0].products[0].sellers[0].sellerCounterparty.id)
            var contactCounterparty = null;
            if (ctrl.individuals.length > 0) {
                contactCounterparty = ctrl.individuals[0].products[0].sellers[0].sellerCounterparty;
            }
            return contactCounterparty;
        }

        /**
         * Gets a reference to a product in the request object.
         * @param {Object} product - A Product object.
         * @param {Object} location - The location object to scan.
         * @returns {Object} The product object reference from the request object, if found.
         */
        function getRequestProductReference(product, location) {
            return $filter('filter')(location.products, {
                product: {
                    id: product.product.id
                }
            })[0];
        }

        function getLocationById(locationId, requestId) {
            return $filter('filter')(ctrl.locations, {
                rand: locationId
            })[0];
        }

        function getLocationsByRequestId(requestId) {
            return $filter('filter')(ctrl.locations, {
                request: {
                    id: requestId
                }
            })[0];
        }

        function getSupplierById(supplierId) {
            return $filter('filter')(ctrl.locations, {
                physicalSupplier: {
                    id: supplierId
                }
            })[0].physicalSupplier;
        }

        function getOfferForLocation(location) {
            return location.offer;
        }

        function getQuotedProductById(productId) {
            return $filter('filter')(ctrl.lists.Product, {
                id: productId
            })[0];
        }

        function getProductById(locationId, productId) {
            let location = getLocationById(locationId);
            return $filter('filter')(location.products, {
                id: productId
            })[0];
        }

        /**
         * Gets all locations in the data.
         */
        function getAllLocations() {
            let result = [];
            for (var i = 0; i < ctrl.individuals.length; i++) {
                result.push(ctrl.individuals[i]);
            }
            for (var i = 0; i < ctrl.packages.length; i++) {
                for (var j = 0; j < ctrl.packages[i].rfqs.length; j++) {
                    if (ctrl.packages[i].rfqs[j].requests) {
                        for (var k = 0; k < ctrl.packages[i].rfqs[j].requests.length; k++) {
                            ctrl.packages[i].rfqs[j].requests[k].request.locations[0].rand = `${ctrl.packages[i].rand }_${ ctrl.packages[i].rfqs[j].requests[k].request.id}`;
                            ctrl.packages[i].rfqs[j].requests[k].request.locations[0].physicalSupplier = ctrl.packages[i].physicalSupplier;
                            ctrl.packages[i].rfqs[j].requests[k].request.locations[0].offer = ctrl.packages[i].rfqs[j].requests[k].offer;
                            result.push(ctrl.packages[i].rfqs[j].requests[k].request.locations[0]);
                        }
                    }
                }
            }
            if (ctrl.packagesOffers) {
                for (var i = 0; i < ctrl.packagesOffers.length; i++) {
                    for (var j = 0; j < ctrl.packagesOffers[i].rfqs.length; j++) {
                        if (ctrl.packagesOffers[i].rfqs[j].requests) {
                            for (var k = 0; k < ctrl.packagesOffers[i].rfqs[j].requests.length; k++) {
                                ctrl.packagesOffers[i].rfqs[j].requests[k].request.locations[0].rand = `${ctrl.packagesOffers[i].rand }_${ ctrl.packagesOffers[i].rfqs[j].requests[k].request.id}`;
                                ctrl.packagesOffers[i].rfqs[j].requests[k].request.locations[0].physicalSupplier = ctrl.packagesOffers[i].physicalSupplier;
                                ctrl.packagesOffers[i].rfqs[j].requests[k].request.locations[0].offer = ctrl.packagesOffers[i].rfqs[j].requests[k].offer;
                                ctrl.packagesOffers[i].packageId = ctrl.packagesOffers[i].rfqs[j].requests[k].request.locations[0].products[0].sellers[0].offers[0].packageId;
                                result.push(ctrl.packagesOffers[i].rfqs[j].requests[k].request.locations[0]);
                            }
                        }
                    }
                }
            }
            console.log(result);
            return result;
        }

        function getDistinctVessels() {
            var vessels = [];
            $.each(ctrl.individuals, (k, v) => {
                if (vessels.indexOf(v.vesselDetails.vessel.id) == -1) {
                    vessels.push(v.vesselDetails.vessel.id);
                }
            });
            return vessels.length;
        }

        /**
         * Given an array of location objects, it extracts all their ID's in an
         * object whose keys are the IDs.
         */
        function selectAllLocationIds(locations) {
            let result = {};
            for (let i = 0; i < locations.length; i++) {
                result[locations[i].location.rand] = true;
            }
            return result;
        }

        /**
         * Determines if given location has additional costs.
         */
        function locationHasAdditionalCosts(location) {
            if (typeof ctrl.getAdditionalCosts(location) == 'undefined' || ctrl.getAdditionalCosts(location) == null) {
                return 0;
            }
            return ctrl.getAdditionalCosts(location).length;
        }

        /**
         * Adds a first additional cost row in case there are none in the respective location.
         * @param {Integer} locationId - The ID of the location to add the additional cost to.
         *    If it's null (strict checking), the funciton iterates through all locations.
         */
        function addFirstAdditionalCost(locationId) {
            let location;
            if (locationId === null) {
                $.each(ctrl.locations, (k, v) => {
                    if (!locationHasAdditionalCosts(v)) {
                        ctrl.addAdditionalCost(v);
                    }
                });
            } else {
                location = getLocationById(locationId);
                if (!locationHasAdditionalCosts(location)) {
                    ctrl.addAdditionalCost(location);
                }
            }
        }

        function resolveAllProductsAdditionalCosts() {}

        function removeNullAdditionalCosts(offers) {
            let result;
            if (offers) {
                for (let i = 0; i < offers.length; i++) {
                    result = [];
                    if (offers[i].additionalCosts) {
                        for (let j = 0; j < offers[i].additionalCosts.length; j++) {
                            if (offers[i].additionalCosts[j].additionalCost !== null && offers[i].additionalCosts[j].costType !== null) {
                                result.push(offers[i].additionalCosts[j]);
                            }
                        }
                    }
                    angular.copy(result, offers[i].additionalCosts);
                }
            }
            return offers;
        }

        function validateAdditionalCostsNonInputs(location) {
            let compare,
                nonFields = [ 'currency', 'priceUom' ],
                additionalCosts = ctrl.getAdditionalCosts(location),
                additionalCost;
            if (typeof additionalCosts != 'undefined' && additionalCosts) {
                for (let j = 0; j < additionalCosts.length; j++) {
                    for (let k = 0; k < nonFields.length; k++) {
                        additionalCost = additionalCosts[j];
                        compare = additionalCost[nonFields[k]];
                        if (additionalCost.additionalCost) {
                            if (!compare || angular.equals({}, compare)) {
                                // Special cases:
                                // Ommit priceUom check if the cost type exists isn't "Unit".
                                if (nonFields[k] === 'priceUom' && additionalCost.costType && additionalCost.costType.id !== ctrl.COST_TYPE_UNIT_ID) {
                                    continue;
                                }
                                return [ nonFields[k] ];
                            }
                        }
                    }
                }
            };
            return null;
        }
        // retrieve invalid fields from a form
        function getInvalidFields(form, type) {
            let fields = [];
            let fieldName;
            for (let errorName in form.$error) {
                for (let i = 0; i < form.$error[errorName].length; i++) {
                    fieldName = form.$error[errorName][i].$name;
                    if (fields.indexOf(fieldName) === -1) {
                        console.log(form);
                        fields.push(`<br>${ fieldName } from ${ type}`);
                    }
                }
            }
            return fields;
        }

        function calculateProductAmountsAllLocations() {
            for (let i = 0; i < ctrl.locations.length; i++) {
                calculateProductsAmountField(ctrl.locations[i]);
            }
        }

        /**
         * Checks if the given additional cost belongs
         * to the ProductComponent category.
         */
        function isProductComponent(additionalCost) {
            if (!additionalCost.additionalCost) {
                return false;
            }
            additionalCost.isTaxComponent = false;
            if (ctrl.additionalCostTypes[additionalCost.additionalCost.id].componentType) {
	                additionalCost.isTaxComponent = !(ctrl.additionalCostTypes[additionalCost.additionalCost.id].componentType.id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT);
	                if (additionalCost.isTaxComponent) {
	                	// console.log("Tax:" + additionalCost.additionalCost.name)
	                } else {
		                additionalCost.isTaxComponent = false;
	                }
	                // $scope.$apply();
	                return ctrl.additionalCostTypes[additionalCost.additionalCost.id].componentType.id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT;
            	// setTimeout(function(){
            	// })
            }

            return null;
        }

        /**
         * Get the corresponding component type ID for a given additional cost.
         */
        function getAdditionalCostDefaultCostType(additionalCost) {
            if (!additionalCost.additionalCost) {
                return false;
            }
            if (ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType) {
                if (ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType.id == 1 || ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType.id == 2) {
                    additionalCost.allowedCostTypes = [];
                    $.each(ctrl.lists.CostType, (k, v) => {
                        if (v.id == 1 || v.id == 2) {
                            additionalCost.allowedCostTypes.push(v);
                        }
                    });
                } else {
                    additionalCost.allowedCostTypes = [];
                    $.each(ctrl.lists.CostType, (k, v) => {
                        if (v.id == 3) {
                            additionalCost.allowedCostTypes.push(v);
                        }
                    });
                }


                return ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType;
            }
            return false;
        }
        ctrl.getAllowedCostTypes = function(additionalCost) {
            if (!additionalCost.additionalCost) {
                return false;
            }
            var allowedCostTypes;
            if (ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType) {
                if (ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType.id == 1 || ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType.id == 2) {
                    allowedCostTypes = [];
                    $.each(ctrl.lists.CostType, (k, v) => {
                        if (v.id == 1 || v.id == 2) {
                            allowedCostTypes.push(v);
                        }
                    });
                } else {
                    allowedCostTypes = [];
                    $.each(ctrl.lists.CostType, (k, v) => {
                        if (v.id == 3) {
                            allowedCostTypes.push(v);
                        }
                    });
                }
            }
            return allowedCostTypes;
        };

        /**
         * Goes through all the products in the location to calculate a totalAmount field according to
         * predetermined formula. This is needed to have an initial totalAmount value to display in the
         * products table, since totalAmount is not porived by server. If this changes in the future,
         * this function becomes redundant.
         */
        function calculateProductsAmountField(location) {
            for (let i = 0; i < location.products.length; i++) {
                productUomChg(location.products[i], location);
            }
        }

        function calculateProductAmount(product, loc) {
            var sellerKey = ctrl.getSellerKey(loc, product);
            var currentConfirmedQtyPrice = 1;
            let quotedPrice = 0;
            if (typeof product.confirmedQtyPrice != 'undefined') {
                currentConfirmedQtyPrice = product.confirmedQtyPrice;
            }
            if (product.sellers[sellerKey].offers['0'].hasNoQuote) {
                quotedPrice = 0;
            } else {
                quotedPrice = product.sellers[sellerKey].offers[0].price;
            }
            return Number(currentConfirmedQtyPrice) * Number(product.maxQuantity) * Number(quotedPrice) || 0;
        }

        function sumProductMaxQuantities(products, additionalCost) {
            let result = 0;
            for (let i = 0; i < products.length; i++) {
                var  product = products[i];
                if (additionalCost.isAllProductsCost || product.id == additionalCost.parentProductId) {
                    result = result + product.maxQuantity;
                }
            }
            return result;
        }

        /**
         * Sum the Amount field of all products.
         */
        ctrl.sumProductAmounts = function(products) {
            let result = 0;
            for (let i = 0; i < products.length; i++) {
                result = result + +Number(products[i].totalAmount);
            }
            return result;
        };

        /**
         * Get the grand total for a given location, that is the sum of product total and additional costs total.
         */
        ctrl.getGrandTotal = function(location) {
            return ctrl.sumProductAmounts(location.products) + Number(ctrl.additionalCostTotalAmountSums[location.rand] || 0);
        };

        /**
         * Calculates the amount-related fields of an additional cost, as per FSD p. 139: Amount, Extras Amount, Total Amount.
         */
        function calculateAdditionalCostAmounts(additionalCost, product, location) {
            let totalAmount,
                productComponent;
            if (!additionalCost.costType) {
                return additionalCost;
            }
            switch (additionalCost.costType.id) {
            case COST_TYPE_IDS.UNIT:
                // additionalCost.amount = additionalCost.maxQuantity * additionalCost.price;
                additionalCost.amount = 0;
                productComponent = isProductComponent(additionalCost);
                if (additionalCost.priceUom && additionalCost.prodConv && additionalCost.prodConv.length == location.products.length) {
                    for (let i = 0; i < location.products.length; i++) {
                        product = location.products[i];
                        if (additionalCost.isAllProductsCost || product.id == additionalCost.parentProductId) {
                            additionalCost.amount = additionalCost.amount + product.maxQuantity * additionalCost.prodConv[i] * parseFloat(additionalCost.price);
                        }
                    }
                }
                break;
            case COST_TYPE_IDS.FLAT:
                additionalCost.amount = parseFloat(additionalCost.price);
                productComponent = isProductComponent(additionalCost);
                break;
            case COST_TYPE_IDS.PERCENT:
                productComponent = isProductComponent(additionalCost);
                if (additionalCost.isAllProductsCost || !productComponent) {
                    totalAmount = ctrl.sumProductAmounts(location.products);
                } else {
                    totalAmount = product.totalAmount;
                }
                if (productComponent) {
                    additionalCost.amount = totalAmount * parseFloat(additionalCost.price) / 100;
                } else {
                    totalAmount = totalAmount + sumProductComponentAdditionalCostAmounts(location);
                    additionalCost.amount = totalAmount * parseFloat(additionalCost.price) / 100;
                }
                break;
            }
            additionalCost.extrasAmount = additionalCost.extras / 100 * additionalCost.amount;
            additionalCost.totalAmount = additionalCost.amount + additionalCost.extrasAmount || 0;
            additionalCost.rate = additionalCost.totalAmount / additionalCost.maxQuantity;
            return additionalCost;
        }

        /**
         * Sum the amounts of all additional costs that are NOT tax component additional costs.
         */
        function sumProductComponentAdditionalCostAmounts(location) {
            let result = 0;
            // Since this calculation has a circular nature (dependends upon other
            // additional costs), the per-location data needed may not be ready at the time of
            // the calculation, which will raise an exception unless dealt with.
            // This is not an issue on Order and Offer Details, where the
            // ctrl.additionalCosts array is unidimensional.
            let ps = 0;
            // if (location.physicalSupplier) ps = location.physicalSupplier.id;
            ps = location.rand.split('_')[2];
            if (!ctrl.additionalCosts[location.rand]) {
                return;
            }
            for (let i = 0; i < ctrl.additionalCosts[location.rand].length; i++) {
                if (isProductComponent(ctrl.additionalCosts[location.rand][i]) || ctrl.additionalCosts[location.rand][i].costType && ctrl.additionalCosts[location.rand][i].costType.id !== COST_TYPE_IDS.PERCENT) {
                    result = result + ctrl.additionalCosts[location.rand][i].totalAmount;
                }
            }
            return result;
        }

        /**
         * Compile all offers on the page (from all locations) to send to server.
         */
        function compileOffers() {
            let nonInputInvalidFields,
                offers,
                offerForLocation;
            if (ctrl.token) {
                if (ctrl.individuals[0].products[0].sellers[0].offers[0].contactCounterparty === null) {
                    ctrl.invalidFields = [ 'Quoted By' ];
                    return false;
                }
            }
            var validForm = true;
            ctrl.invalidFields = [];
            $.each($scope.forms, (key, val) => {
                if (!val.products) {
                    return;
                }
                if (!val.products.$valid) {
                    ctrl.invalidFields = ctrl.invalidFields.concat(getInvalidFields(val.products, 'Individuals'));
                    validForm = false;
                }
                if (!val.additionalCosts) {
                    return;
                }
                if (!val.additionalCosts.$valid) {
                    ctrl.invalidFields = ctrl.invalidFields.concat(getInvalidFields(val.additionalCosts, 'Individuals'));
                    validForm = false;
                }
            });
            $.each($scope.formsPkg, (key, val) => {
                if (typeof val.products != 'undefined') {
                    if (!val.products.$valid) {
                        ctrl.invalidFields = ctrl.invalidFields.concat(getInvalidFields(val.products, 'Packages'));
                        validForm = false;
                    }
                }
                if (typeof val.additionalCosts != 'undefined') {
                    if (!val.additionalCosts.$valid) {
                        ctrl.invalidFields = ctrl.invalidFields.conact(getInvalidFields(val.additionalCosts, 'Packages'));
                        validForm = false;
                    }
                }
            });


            if (!validForm) {
                return false;
            }
            let payload = {};
            for (let i = 0; i < ctrl.locations.length; i++) {
                ctrl.locations[i].sellerContact = ctrl.individuals[0].products[0].sellers[0].offers[0].contactCounterparty;
                // if (ctrl.selectedLocationIds[ctrl.request.locations[i].location.id]) {
                nonInputInvalidFields = validateAdditionalCostsNonInputs(ctrl.locations[i]);
                if (nonInputInvalidFields !== null) {
                    ctrl.invalidFields = nonInputInvalidFields;
                    return false;
                }
                offers = [];
                offerForLocation = getOfferForLocation(ctrl.locations[i]);
                for (let j = 0; j < ctrl.locations[i].products.length; j++) {
                    var sellerKey = ctrl.getSellerKey(ctrl.locations[i], ctrl.locations[i].products[j]);
                    offers = offers.concat(ctrl.locations[i].products[j].sellers[sellerKey].offers);
                    var seller = ctrl.locations[i].products[j].sellers[sellerKey];
                    ctrl.locations[i].products[j].sellers = [];
                    ctrl.locations[i].products[j].sellers.push(seller);
                }
                offers = removeNullAdditionalCosts(offers);
                ctrl.locations[i].offer = removeNullAdditionalCosts([ offerForLocation ])[0];
                // payload.push({
                //     requestLocationId: ctrl.individuals[i].id,
                //     requestOffers: offers,
                //     allProductsAdditionalCosts: offerForLocation.additionalCosts
                // });
                // }
            }
            payload.individuals = ctrl.individuals;
            if (ctrl.packagesOffers) {
                payload.packages = ctrl.packages.concat(ctrl.packagesOffers);
            } else {
                payload.packages = ctrl.packages;
            }
            return payload;
        }
        ctrl.setDialogType = function(type, input) {
            ctrl.lookupType = LOOKUP_MAP[type];
            ctrl.lookupInput = input;
            if (ctrl.token) {
                ctrl.sellerPortalModule = true;
            } else {
                ctrl.sellerPortalModule = false;
            }
        };
        ctrl.setSellerDialogType = function(type, input) {
            if (type === 'PhysicalSupplier') {
                ctrl.counterpartyTypeId = [ IDS.SUPPLIER_COUNTERPARTY_ID ];
                ctrl.counterpartyType = LOOKUP_TYPE.SUPPLIER;
            }
            ctrl.lookupInput = input;
        };
        // Retrieves the first seller of the first product of the given location.
        ctrl.getLocationSeller = function(location) {
            return location.products[0].sellers[0].company.name;
        };

        /**
         * Get the additional costs associated with a given location.
         * @param {Object} location - A location object.
         * @returns {Array} - An array of additionalCosts objects.
         */
        ctrl.getAdditionalCosts = function(location) {
            let offer,
                additionalCost,
                offerForLocation = getOfferForLocation(location),
                result = [];
            if (!offerForLocation || typeof offerForLocation == 'undefined') {
                return;
            }
            ctrl.additionalCostTotalAmountSums[location.rand] = 0;
            // Set result to th global additional costs array in the DTO,
            // which contains the "All Products" additional costs.
            var gasit = false;
            for (let a = 0; a < location.products.length; a++) {
	            location.products[a].totalAdditionalCostPerProductAll = 0;
                for (let b = 0; b < location.products[a].sellers.length; b++) {
                    if (offerForLocation.id == location.products[a].sellers[b].offers[0].offer.id &&
                    	(
                    		location.physicalSupplier == location.products[a].sellers[b].offers[0].physicalSupplierCounterparty ||
                    		location.physicalSupplier &&
                    			location.products[a].sellers[b].offers[0].physicalSupplierCounterparty &&
                    			location.physicalSupplier.id == location.products[a].sellers[b].offers[0].physicalSupplierCounterparty.id

                		)) {
                        result = offerForLocation.additionalCosts;
                        ctrl.additionalCostApplicableFor = {};
                        if (result) {
                            for (let m = 0; m < result.length; m++) {
                                additionalCost = result[m];
                                if (!additionalCost.fakeId) {
                                    additionalCost.fakeId = -Date.now();
                                    additionalCost.fakeIdOrdering = Date.now();
                                }
                                if (additionalCost.fakeId > 0) {
                                    additionalCost.fakeIdOrdering = additionalCost.additionalCost.id;
                                }
                                // Save product model for "Applicable for", and calculate the confirmedQuantity
                                // based on it:
                                ctrl.additionalCostApplicableFor[additionalCost.fakeId] = null;
                                additionalCost.maxQuantity = sumProductMaxQuantities(location.products, additionalCost);
                                // TODO: Get the quantityUom of the first product? Or is there a different business logic for this?
                                additionalCost.quantityUom = location.products[0].quantityUom;
                                additionalCost.parentLocationId = location.rand;
                                additionalCost = calculateAdditionalCostAmounts(additionalCost, null, location);
                                if (!additionalCost.isDeleted) {
                                    ctrl.additionalCostTotalAmountSums[location.rand] += Number(additionalCost.totalAmount);
                                    location.products[a].totalAdditionalCostPerProductAll += Number(additionalCost.totalAmount);
                                }
                                // ctrl.addPriceUomChanged(additionalCost, location);
                                gasit = true;
                            }
                        }
                    }
                    if (gasit) {
                        break;
                    }
                }
                if (gasit) {
                    break;
                }
            }
            for (let i = 0; i < location.products.length; i++) {
            	location.products[i].totalAdditionalCostPerProduct = 0;
                for (let j = 0; j < location.products[i].sellers.length; j++) {
                    offer = ctrl.getSellerLatestOffer(location.products[i].sellers[j]);
                    // Save product model for "Applicable for."
                    if (typeof offer != 'undefined') {
                        if (typeof offer.additionalCosts != 'undefined' && offer.additionalCosts) {
                            if (location.physicalSupplier == location.products[i].sellers[j].offers[0].physicalSupplierCounterparty || location.physicalSupplier && location.products[i].sellers[j].offers[0].physicalSupplierCounterparty && location.physicalSupplier.id == location.products[i].sellers[j].offers[0].physicalSupplierCounterparty.id) {
                                for (let k = 0; k < offer.additionalCosts.length; k++) {
                                    additionalCost = offer.additionalCosts[k];
                                    if (!additionalCost.fakeId) {
                                        additionalCost.fakeId = -Date.now();
                                        additionalCost.fakeIdOrdering = Date.now();
                                    }
                                    if (additionalCost.fakeId > 0) {
                                        additionalCost.fakeIdOrdering = additionalCost.additionalCost.id;
                                    }
                                    additionalCost.parentProductId = location.products[i].id;
                                    additionalCost.parentLocationId = location.rand;
                                    ctrl.additionalCostApplicableFor[additionalCost.fakeId] = location.products[i];
                                    additionalCost.maxQuantity = sumProductMaxQuantities(location.products, additionalCost);
                                    additionalCost = calculateAdditionalCostAmounts(additionalCost, location.products[i], location);
                                    if (!additionalCost.isDeleted) {
                                        ctrl.additionalCostTotalAmountSums[location.rand] += additionalCost.totalAmount;
                                        location.products[i].totalAdditionalCostPerProduct += Number(additionalCost.totalAmount);
                                    }
                                    // ctrl.addPriceUomChanged(additionalCost, location);
                                }
                                if (!result) {
                                    result = [];
                                }
                                if (result) {
                                    result = result.concat(offer.additionalCosts);
                                }
                                // else {
                                //  result = [offer.additionalCosts];
                                // }
                            }
                        }
                    }
                }
            }
            // console.log(result)
            result = $filter('filter')(result, {
                isDeleted: false
            });
            let ps = 0;
            ps = location.rand.split('_')[2];
            // if (location.physicalSupplier) ps = location.physicalSupplier.id;
            if (!ctrl.additionalCosts[location.rand]) {
                ctrl.additionalCosts[location.rand] = [];
            }
            ctrl.additionalCosts[location.rand] = result;
            // if (ctrl.token) {
            //  return result;
            // } else {
            // }
            setTimeout(() => {
            	// $scope.$apply();
	            // $compile($("#product_add_cost_table_1"))($scope)
            });
            if (result) {
                if (result.length > 0) {
                	var strLog = '';
                	$.each(result, (k, v) => {
                		if (v.additionalCost != null) {
                            strLog = `${strLog }${v.additionalCost.name };`;
                        }
                	});
                    if (result[0].fakeId) {
                        result = $filter('orderBy')(result, 'fakeId', true);
                        ctrl.additionalCostsList = result;
                        return result;
                    }
                    result = $filter('orderBy')(result[0], 'fakeId', true);
                    ctrl.additionalCostsList = result[0];
                    return result[0];
                }
            }
            return [];
        };

        /**
         * Get latest seller offer from product seller list.
         *
         * @param {object} seller - a product seller object
         */
        ctrl.getSellerLatestOffer = function(seller) {
            if (typeof seller.offers[0] == 'undefined') {
                return;
            }
            let latestDate = moment(seller.offers[0].quoteDate, moment.ISO_8601);
            let latestOffer = seller.offers[0];
            let currentDate;
            for (let i = 1; i < seller.offers.length; i++) {
                var currentOfferDate = moment(seller.offers[0].quoteDate, moment.ISO_8601);
                if (currentOfferDate.isAfter(latestDate)) {
                    latestDate = currentOfferDate;
                    latestOffer = seller.offers[i];
                }
            }
            return latestOffer;
        };
        ctrl.addPriceUomChanged = function(additionalCost, location) {
            addPriceUomChg(additionalCost, location);
        };

        function addPriceUomChg(additionalCost, location) {
            if (!additionalCost.priceUom) {
                return;
            }
            additionalCost.prodConv = [];
            for (let i = 0; i < location.products.length; i++) {
                var prod = location.products[i];
                if (prod.maxQuantity.id == additionalCost.priceUom.id) {
                    additionalCost.prodConv[i] = 1;
                } else {
                    setConvertedAddCost(prod, additionalCost, i);
                }
            }
        };

        function setConvertedAddCost(prod, additionalCost, i) {
            if (ctrl.token) {
                lookupModel.getConvertedUOMForSupplierPortal(ctrl.token, prod.product.id, 1, prod.uom.id, additionalCost.priceUom.id).then((server_data) => {
                    additionalCost.prodConv[i] = server_data.payload;
                }).catch((e) => {
                    throw 'Unable to get the uom.';
                });
            } else {
                lookupModel.getConvertedUOM(prod.product.id, 1, prod.uom.id, additionalCost.priceUom.id).then((server_data) => {
                    additionalCost.prodConv[i] = server_data.payload;
                }).catch((e) => {
                    throw 'Unable to get the uom.';
                });
            }
        }
        ctrl.productUomChanged = function(product, loc) {
            productUomChg(product, loc);
        };

        function productUomChg(product, loc) {
            var sellerKey = ctrl.getSellerKey(loc, product);
            if (!$stateParams.token) {
                var data = {
                        Payload: {
                            ProductId: product.product.id,
                            Quantity: 1,
                            FromUomId: product.uom.id,
                            ToUomId: product.sellers[sellerKey].offers[0].priceQuantityUom.id
                        }
                };
                Factory_Master.getUomConversionFactor(data, (server_data) => {
                    if (server_data) {
                        if (server_data.status == true) {
                            product.confirmedQtyPrice = server_data.data.payload;
                            product.totalAmount = Number(product.confirmedQtyPrice) * Number(product.maxQuantity) * Number(product.sellers[sellerKey].offers[0].price);
                        } else {
                            toastr.error('An error has occured!');
                        }
                    }
                });
            } else if (product.sellers.length > 0) {
                if (product.uom.id == product.sellers[sellerKey].offers[0].priceQuantityUom.id) {
                    product.confirmedQtyPrice = 1;
                    product.totalAmount = Number(product.confirmedQtyPrice) * Number(product.maxQuantity) * Number(product.sellers[sellerKey].offers[0].price);
                } else {
                    lookupModel.getConvertedUOMForSupplierPortal(ctrl.token, product.product.id, 1, product.uom.id, product.sellers[sellerKey].offers[0].priceQuantityUom.id).then((server_data) => {
                        product.confirmedQtyPrice = server_data.payload;
                        product.totalAmount = Number(product.confirmedQtyPrice) * Number(product.maxQuantity) * Number(product.sellers[sellerKey].offers[0].price);
                    }).catch((e) => {
                        throw 'Unable to get the uom.';
                    });
                }
            }
        }
        ctrl.onTabClick = function(request) {
            ctrl.request = request;
            addFirstAdditionalCost(null);
            // getLocationsSuppliers();
        };
        ctrl.sendOffer = function() {
            if (ctrl.tenantQuoteDisabled) {
                toastr.error('Quote by Date is expired, you may not quote for these products.');
                return;
            }
            if (ctrl.tenantQuoteWarning) {
                toastr.warning('Note: Quote by Date is expired.');
            }
            let payload = compileOffers();

            var allProductsAreNoQuote = true;

            let productsWithInvalidPrice = [];

            $.each(payload.individuals, (k, offer) => {
	            $.each(offer.products, (pk, product) => {
                    let hasNoQuote = product.sellers['0'].offers['0'].hasNoQuote;
                    let price = parseFloat(product.sellers[0].offers[0].price);
	            	if (!hasNoQuote) {
			            allProductsAreNoQuote = false;
	            	}
	            	if (!hasNoQuote) {
	                    if (product.allowZeroPricing && price == 0) {
	                        productsWithInvalidPrice.push(product.product.name);
	                    }
	            	}
	            });
            });

            if (productsWithInvalidPrice.length > 0) {
                toastr.error(`Please enter a valid price for the following products: ${ productsWithInvalidPrice.join(', ')}`);
                return;
            }

 			if (ctrl.token) {
                $rootScope.currentSellerCardHasSupplier = true;
 				$.each(payload.individuals, (ik, iv) => {
 					if (!iv.physicalSupplier) {
                        $rootScope.currentSellerCardHasSupplier = true;
 					}
 				});
 			}

            if (!$rootScope.currentSellerCardHasSupplier && !allProductsAreNoQuote) {
                toastr.error('Please add a physical supplier for the offer before continuing');
                return;
            }

            /* VALIDATION FOR ADDITIONAL COSTS THAT ARE APPLICABLE FOR NO QUOTE PRODUCTS*/
            var noQuoteProductsAndCostsByRequest = [];
            let hasNoQuoteProducts = false;
            var hasActiveCost;
            var hasAdditionalCostOnNoQuoteProduct = false;
            $.each(ctrl.individuals, (cik, civ) => {
	        	noQuoteProductsAndCostsByRequest[`r_${ civ.request.id}`] = {
	        		noQuoteProducts : 0
	        	};
	            $.each(civ.products, (pk, pv) => {
	            	var currentProduct = pv;
	            	noQuoteProductsAndCostsByRequest[`r_${ civ.request.id}`].noQuoteProducts--;
                    $.each(pv.sellers, (sk, sv) => {
                        $.each(sv.offers, (ok, ov) => {
                            hasActiveCost = false;
                            if (ov.additionalCosts.length > 0) {
                                hasActiveCost = _.find(ov.additionalCosts, (obj) => {
								    return !obj.isDeleted && obj.additionalCost;
                                });
                            }
                            if (ov.hasNoQuote) {
				            	noQuoteProductsAndCostsByRequest[`r_${ civ.request.id}`].noQuoteProducts++;
                            }
                            if (hasActiveCost && ov.hasNoQuote == true) {
					            if (!hasAdditionalCostOnNoQuoteProduct) {
						            hasAdditionalCostOnNoQuoteProduct = true;
					            }
                            }
                            if (ov.hasNoQuote) {
                                hasNoQuoteProducts = true;
                            }
                        });
                    });
	            });
            });

            $.each(ctrl.individuals, (ik, iv) => {
	            if (iv.offer) {
	            	if (iv.offer.additionalCosts.length > 0) {
                        hasActiveCost = _.find(iv.offer.additionalCosts, (obj) => {
						    return !obj.isDeleted && obj.additionalCost;
                        });
                        if (hasActiveCost && noQuoteProductsAndCostsByRequest[`r_${ iv.request.id}`].noQuoteProducts >= 0) {
				            hasAdditionalCostOnNoQuoteProduct = true;
                        }
	            	}
	            }
            });
            if (hasAdditionalCostOnNoQuoteProduct) {
            	toastr.error('Please remove Additional Costs that are applicable for no quote products');
                return false;
            }

            /* VALIDATION FOR ADDITIONAL COSTS THAT ARE APPLICABLE FOR NO QUOTE PRODUCTS*/


            if (payload) {
                ctrl.buttonsDisabled = true;
                if (ctrl.token) {
                    payload.validity = ctrl.validity;
                    supplierPortalModel.sendQuote(ctrl.token, payload).then((data) => {
                        setTimeout(() => {
                            location.reload();
                        }, 500);
                        ctrl.buttonsDisabled = false;
                        addFirstAdditionalCost(null);
                    }).catch((reason) => {
                        ctrl.buttonsDisabled = false;
                        addFirstAdditionalCost(null);
                    });
                } else {
                    $rootScope.refreshPending = true;
                    screenLoader.showLoader();
                    groupOfRequestsModel.saveSupplierCard(payload).then((data) => {
                        // $state.reload();
	                    $rootScope.$broadcast('bladeDataChanged', true);
	                    screenLoader.hideLoader();
                        ctrl.buttonsDisabled = false;
                        addFirstAdditionalCost(null);
                    }).catch((reason) => {
	                    $rootScope.$broadcast('bladeDataChanged', true);
	                    screenLoader.hideLoader();
                        ctrl.buttonsDisabled = false;
                        addFirstAdditionalCost(null);
                    });
                }
            } else {
                toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + ctrl.invalidFields.join(', '));
            }
        };
        ctrl.sendNoQuote = function() {
            if (ctrl.tenantQuoteDisabled) {
                toastr.error('Quote by Date is expired, you may not quote for these products.');
                return;
            }
            if (ctrl.tenantQuoteWarning) {
                toastr.warning('Note: Quote by Date is expired.');
            }
            let offers = compileOffers();
            if (offers) {
                ctrl.buttonsDisabled = true;
                supplierPortalModel.sendNoQuote(ctrl.token, offers).then((data) => {
                    ctrl.buttonsDisabled = false;
                }, (data) => {
                    ctrl.buttonsDisabled = false;
                });
            } else {
                toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + ctrl.invalidFields.join(', '));
            }
        };

        /**
         * Sets the price UOM on the specified additional cost.
         * @param {Object} additionalCost - An additional cost object.
         * @param {Object} uom - The selected UOM value.
         */
        ctrl.setPriceUom = function(additionalCost, uom) {
            additionalCost.priceUom = {
                id: uom.id,
                name: uom.name
            };
        };
        ctrl.selectQuotedProduct = function(productId) {
            let product,
                target;
            if (ctrl.lookupInput) {
                product = ctrl.lists.Product.find((currentValue) => {
                    return currentValue.id == productId;
                });
                target = ctrl.lookupInput.sellers[0].offers[0].quotedProduct;
                target.name = product.name;
                target.id = product.id;
            }

            /*            lookupModel.get(LOOKUP_TYPE.PRODUCTS, productId).then(function(server_data) {
                            product = server_data.payload;
                            // If there's a set lookupInput, it means we need
                            // to copy the lookup dialog selection into it.
                            if (ctrl.lookupInput) {
                                target = ctrl.lookupInput.sellers[0].offers[0].quotedProduct;
                                target.name = product.name;
                                target.id = product.id;
                            }
                        });*/
        };
        ctrl.selectCounterparty = function(sellerId) {
            console.log(sellerId);
            let data;
            lookupModel.get(ctrl.counterpartyType, sellerId).then((server_data) => {
                data = server_data.payload;
                ctrl.lookupInput.sellers[0].offers[0].physicalSupplierCounterparty = {};
                ctrl.lookupInput.sellers[0].offers[0].physicalSupplierCounterparty.id = data.id;
                ctrl.lookupInput.sellers[0].offers[0].physicalSupplierCounterparty.name = data.name;
            });
        };
        ctrl.setTypeahedVal = function(oldVal, newVal, fromBlur) {
            if (!fromBlur) {
                return angular.copy(newVal);
            }
            return oldVal;
        };
        ctrl.selectedSupplier = null;
        ctrl.selectSupplier = function(sellerId) {
            console.log(sellerId);
            ctrl.selectedSupplier = sellerId;
            console.log(ctrl.editSupplierIdx_individuals);
            console.log(ctrl.editSupplierIdx_package);
            if (ctrl.editSupplierIdx_individuals != null) {
                console.log('selectSupplier (individuals) edit', sellerId);
                // console.log(ctrl.individuals);
                ctrl.individuals[ctrl.editSupplierIdx_individuals].physicalSupplier = sellerId;
                ctrl.editSupplierIdx_individuals = null;
                console.log(ctrl.individuals);
                // return;
            }
            if (ctrl.editSupplierIdx_package != null) {
                console.log('selectSupplier (packages) - edit', sellerId);
                ctrl.packages[ctrl.editSupplierIdx_package].physicalSupplier = sellerId;
                ctrl.editSupplierIdx_package = null;
                // return;
            }

            /* add new physical supplier */
            let data;
            data = $filter('filter')(ctrl.lists.Supplier, {
                id: sellerId.id
            })[0];
            if (data == null) {
                console.log('ctrl', ctrl);
                console.log('ctrl.supplierUpdate', ctrl.supplierUpdate);
            }
            if (ctrl.supplierUpdate) {
                ctrl.changeOfferSupplier(data, ctrl.supplierUpdate);
            } else {
                ctrl.newSupplier = {};
                ctrl.newSupplier.id = data.id;
                ctrl.newSupplier.name = data.name;
            }
            // lookupModel.get(ctrl.counterpartyType, sellerId.id).then(function(server_data) {
            //     data = server_data.payload;
            // });
        };

        function findAdditionalCost(additionalCost, location) {
            let i,
                j,
                offerForLocation = getOfferForLocation(location);
            if (!offerForLocation.additionalCosts) {
                offerForLocation.additionalCosts = [];
            }
            for (i = 0; i < offerForLocation.additionalCosts.length; i++) {
                if (additionalCost.fakeId === offerForLocation.additionalCosts[i].fakeId) {
                    return {
                        container: offerForLocation.additionalCosts,
                        index: i
                    };
                }
            }
            for (i = 0; i < location.products.length; i++) {
                var sellerKey = ctrl.getSellerKey(location, location.products[i]);
                for (j = 0; j < location.products[i].sellers[sellerKey].offers[0].additionalCosts.length; j++) {
                    if (additionalCost.fakeId === location.products[i].sellers[sellerKey].offers[0].additionalCosts[j].fakeId) {
                        return {
                            container: location.products[i].sellers[sellerKey].offers[0].additionalCosts,
                            index: j
                        };
                    }
                }
            }
            return null;
        }

        function getAdditionalCostParentProduct(additionalCost) {
            return getProductById(additionalCost.parentLocationId, additionalCost.parentProductId);
        }

        /**
         * Returns an empty Additional Cost base on a hardcoded template. Yep.
         */
        function createNewAdditionalCostObject() {
            return {
                fakeId: null, // This will be used to identify the new object during frontend manipulation.
                additionalCost: null,
                amount: null,
                amountInBaseCurrency: null,
                comment: '',
                costType: null,
                currency: ctrl.currency,
                extras: null,
                extrasAmount: null,
                isAllProductsCost: false,
                isDeleted: false,
                confirmedQuantity: null,
                price: null,
                priceUom: null,
                rate: null,
                totalAmount: null
            };
        }

        /**
         * Check if all products in a location have the noQuote flag set to true;
         */
        function areAllProductsNoQuote(location) {
            for (let i = 0; i < location.products.length; i++) {
                let sellerKey = ctrl.getSellerKey(location, location.products[i]);
                if (!location.products[i].sellers[sellerKey].offers[0].hasNoQuote) {
                    return false;
                }
            }
            return true;
        }

        function setMainReason(location) {
            let sellerKey = ctrl.getSellerKey(location, location.products[0]);
            if (typeof ctrl.noQuoteReason == 'undefined') {
                ctrl.noQuoteReason = [];
            }
            ctrl.noQuoteReason[location.rand] = location.products[0].sellers[sellerKey].offers[0].noQuoteReason;
        }

        /**
         * Moves the given additional cost object under the given product in the given location,
         * deleting it from the product it is currently under.
         * @param {Object} additionalCost - An additional cost object.
         * @param {Object} product - A product object, which is the target parent product.
         * @param {Object} location - The current location (under which all of this happens).
         */
        ctrl.applicableForChange = function(additionalCost, product, location, where) {
            let index,
                indexInParent,
                offerForLocation = getOfferForLocation(location),
                products = []; // An array of products, needed to preserve code consistency between a product selection and "All".
            // If "All" is selected, product will be undefined.
            // See: http://stackoverflow.com/questions/30604938/add-two-extra-options-to-a-select-list-with-ngoptions-on-it/30606388#30606388
            additionalCost.isAllProductsCost = !product;
            // Delete the additional cost from parent, which is either a product, or the "global" Additional Cost array.
            deleteAdditionalCost(additionalCost, location);
            // Add the copy to the new parent, be it a product or the "global" Additional Costs array.
            if (additionalCost.isAllProductsCost) {
                additionalCost.parentProductId = -1;
                offerForLocation.additionalCosts.push(additionalCost);
            } else {
                additionalCost.parentProductId = product.id;
                let sellerKey = ctrl.getSellerKey(location, product);
                product.sellers[sellerKey].offers[0].additionalCosts.push(additionalCost);
            }
        };

        /**
         * Deletes the additional cost from its parent, which is either a product, or the "global" Additional Costs array,
         * found in root.offers[0].
         * @param {Object} additionalCost - The additional cost object to delete.
         * @param {Object} parentProduct - The parent product of the additional object. If null,
         *   the additional cost will be searched for/deleted from the "global" Additional Costs array.
         */
        function deleteAdditionalCost(additionalCost, location) {
            let parentData = findAdditionalCost(additionalCost, location);
            if (parentData) {
                parentData.container.splice(parentData.index, 1);
            } else {
                throw `Attempting deletion of a non-existent additional cost: ${ JSON.stringify(additionalCost)}`;
            }
        }

        /**
         * Change the cost type to the default for the respective additional cost.
         */
        ctrl.additionalCostNameChanged = function(additionalCost, theLocation, skipDefault) {
            console.log("IOANA");
        	if (!skipDefault) {
	            additionalCost.costType = getAdditionalCostDefaultCostType(additionalCost);
        	}
    		ctrl.addPriceUomChanged(additionalCost, theLocation);
        	// setTimeout(() => {
        		// $scope.$apply();
	         //    ctrl.getAdditionalCosts(theLocation);
        		// $scope.$apply();
        	// }, 1000);
        };

        ctrl.getDefaultUomForAdditionalCost = function(additionalCost, product) {
            if (product == null) {
                return;
            }
            if (!ctrl.listProductTypeGroupsDefaults) {
                let payload1 = { Payload: {} };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload1).then((response) => {
                    console.log(response);
                    if (response.data.payload != 'null') {
                        ctrl.listProductTypeGroupsDefaults = response.data.payload;
                        let payload = { Payload: product.product.id };
                        $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                            if (response.data.payload != 'null') {
                                let productTypeGroup  = response.data.payload.productTypeGroup;
                                let defaultUomAndCompany = _.find(ctrl.listProductTypeGroupsDefaults, function(object) {
                                        return object.id == productTypeGroup.id;
                                });
                                if (defaultUomAndCompany) {
                                    if (additionalCost.costType.name == "Unit") {
                                        additionalCost.priceUom =  defaultUomAndCompany.defaultUom;
                                    }

                                }
                            }
                        });
                    }
                });

            } else {
                let payload = { Payload: product.product.id };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                    if (response.data.payload != 'null') {
                        let productTypeGroup  = response.data.payload.productTypeGroup;
                        let defaultUomAndCompany = _.find(ctrl.listProductTypeGroupsDefaults, function(object) {
                                return object.id == productTypeGroup.id;
                        });
                        if (defaultUomAndCompany) {
                            if (additionalCost.costType.name == "Unit") {
                                additionalCost.priceUom =  defaultUomAndCompany.defaultUom;
                            }

                        }

                    }
                });
            }

        }
        ctrl.quotedByChanged = function(quotedBy) {
            for (let i = 0; i < ctrl.individuals.length; i++) {
                for (let j = 0; j < ctrl.individuals[i].products.length; j++) {
                    for (let k = 0; k < ctrl.individuals[i].products[j].sellers.length; k++) {
                        ctrl.individuals[i].products[j].sellers[k].offers[0].contactCounterparty = {};
                        ctrl.individuals[i].products[j].sellers[k].offers[0].contactCounterparty.id = quotedBy.id;
                        ctrl.individuals[i].products[j].sellers[k].offers[0].contactCounterparty.name = quotedBy.name;
                    }
                }
                ctrl.individuals[i].sellerContact = quotedBy;
            }
        };
        ctrl.validityChanged = function(validity) {
            for (let i = 0; i < ctrl.individuals.length; i++) {
                for (let j = 0; j < ctrl.individuals[i].products.length; j++) {
                    for (let k = 0; k < ctrl.individuals[i].products[j].sellers.length; k++) {
                        ctrl.individuals[i].products[j].sellers[k].offers[0].validity = validity;
                    }
                }
            }
        };

        /**
         * Adds an Additional Cost to the first product in a location.
         * @param {Object} location - The location object containing the product.
         */
        ctrl.addAdditionalCost = function(location) {
            let sellerKey = ctrl.getSellerKey(location, location.products[0]);
            let newAdditionalCost = createNewAdditionalCostObject();
            if (location.products[0].sellers.length > 0) {
                if (!location.products[0].sellers[sellerKey].offers[0].additionalCosts) {
                    location.products[0].sellers[sellerKey].offers[0].additionalCosts = [];
                }
                location.products[0].sellers[sellerKey].offers[0].additionalCosts.push(newAdditionalCost);
                console.log(location.products[0].sellers[sellerKey].offers[0].additionalCosts);
            }
            ctrl.getAdditionalCosts(location);
        };
        ctrl.deleteAdditionalCost = function(additionalCost, location) {
            if (additionalCost.fakeId < 0) {
                // This is a newly added object, delete it altogether.
                deleteAdditionalCost(additionalCost, location);
            } else {
                // This object exists in the database. Mark it for deletion.
                additionalCost.isDeleted = true;
            }
            // Add a new blank additional cost if there aren't any left.
            addFirstAdditionalCost();
        };
        ctrl.getAdditionalCostParentProductUom = function(additionalCost) {
            let parentProduct = getAdditionalCostParentProduct(additionalCost),
                location;
            // If the additional cost has no parent product, use the first product in location.
            if (!parentProduct) {
                location = getLocationById(additionalCost.parentLocationId);
                parentProduct = location.products[0];
            }
            return parentProduct.uom;
        };
        ctrl.productPriceChanged = function(product, loc, oldPrice, newPrice) {
            product.totalAmount = calculateProductAmount(product, loc);
        };
        ctrl.productTableNoQuoteCheckAllChanged = function(location, status) {
            if (ctrl.noQuoteReason) {
                ctrl.noQuoteReason[location.rand] = null;
            }
            for (let i = 0; i < location.products.length; i++) {
                let sellerKey = ctrl.getSellerKey(location, location.products[i]);
                location.products[i].sellers[sellerKey].offers[0].hasNoQuote = status;
                ctrl.productPriceChanged(location.products[i], location);
                // ctrl.NoQuoteReason[location.rand];
                location.products[i].sellers[0].offers[0].noQuoteReason = null;
                ctrl.noQuoteChanged(location, location.products[i]);
            }
        };
        ctrl.noQuoteChanged = function(location, prod) {
            ctrl.productTableNoQuoteCheckAll[location.rand] = areAllProductsNoQuote(location);
            var noQuote = prod.sellers[0].offers[0].hasNoQuote;
            if (typeof noQuote != 'undefined' && !noQuote) {
                prod.sellers[0].offers[0].noQuoteReason = null;
            }
            var sellerKey = ctrl.getSellerKey(location, prod);
            prod.sellers[sellerKey].offers[0].price = null;
            ctrl.productPriceChanged(prod, location);
        };
        ctrl.setLatestOfferParams = function(location) {
            ctrl.latestOfferToken = ctrl.token;
            ctrl.latestOfferLocation = location.rand;
            ctrl.latestOfferSeller = ctrl.individuals[0].products[0].sellers[0].sellerCounterparty.id;
            ctrl.randomOfferRefreshToken = generateOfferPopupRandomToken();
        };

        /**
         * Updates the validity property of the offers of all products with given value.
         * Note that there's only one seller and one offer per product in this view's DTO.
         */
        ctrl.updateOffersValidity = function(value) {
            for (let i = 0; i < ctrl.individuals.length; i++) {
                for (let j = 0; j < ctrl.individuals[i].products.length; j++) {
                    let sellerKey = ctrl.getSellerKey(ctrl.individuals[i], ctrl.individuals[i].products[j]);
                    ctrl.individuals[i].products[j].sellers[sellerKey].offers[0].validity = value;
                }
            }
        };

        /**
         * Determines whether the Additional Cost's Price UOM field should be enabled.
         * It should only be enabled when the Additional Cost's costType is "Unit" (business rule).
         */
        ctrl.additionalCostPriceUomEnabled = function(additionalCost) {
            return additionalCost.costType && additionalCost.costType.id === ctrl.COST_TYPE_UNIT_ID;
        };

        function generateOfferPopupRandomToken() {
            return Date.now();
        }
        ctrl.updateModel = function(model, value) {
            if (!model) {
                model = {};
            }
            angular.copy(value, model);
        };
        ctrl.updateModelProperty = function(model, property, value) {
            model[property] = value;
        };
        ctrl.addSupplier = function(supplier, type) {
            error = 0;
            var location_supplier;
            if (type == 'individual') {
                if (typeof location_supplier == 'undefined') {
                    location_supplier = [];
                }
                $.each(ctrl.individuals, (key, val) => {
                    location_supplier.push(val.rand);
                });
                var newLocations = [], newLocation;
                $.each(angular.copy(location_supplier), (key, val) => {
                    var loc = $.extend(true, {}, getLocationById(val));
                    if (loc.request.id == ctrl.active_req) {
                        // if (!loc.physicalSupplier) {
                        // console.log(1, loc.rand);
                        // console.log(2, location_supplier);
                        // console.log(3, $.inArray(loc.rand, location_supplier));
                        var supp = loc.rand.split('_')[2];
                        // console.log(4, Number(supp));
                        // console.log(5, supplier.id);
                        if ($.inArray(loc.rand, location_supplier) == -1 || Number(supp) != supplier.id) {
                            newLocation = angular.copy(loc);
                            newLocation.physicalSupplier = supplier;
                            newLocation.comments = '';
                            $.each(newLocation.products, (k, v) => {
                                v.sellers[0].id = 0;
                                $.each(v.sellers[0].offers[0].energyParameterValues, (key, val1) => {
                                    if (typeof val1 == 'object' && val1) {
                                        val1.specValue = null;
                                    }
                                });
                                v.sellers[0].offers[0].id = 0;
                                // v.sellers[0].offers[0].requestSellerId = 0;
                                v.sellers[0].offers[0].additionalCosts = [];
                                v.sellers[0].offers[0].offer.id = 0;
                                v.sellers[0].offers[0].physicalSupplierCounterparty = supplier;
                                v.sellers[0].offers[0].price = null;
                                v.totalAmount = 0;
                            });
                            var newOffer = angular.copy(loc.offer);
                            newOffer.additionalCosts = [];
                            newOffer.id = 0;
                            newOffer.physicalSupplier = supplier;
                            newOffer.requestId = newLocation.request.id;
                            newOffer.requestLocationId = newLocation.id;
                            newLocation.offer = newOffer;
                            newLocation.id = 0;
                            newLocation.rand = `i_${ loc.id }0_${ supplier.id }_${ newOffer.requestId}`;
                            if (loc.id > 0) {
                                newLocations.push(newLocation);
                            }
                        } else {
                            error++;
                        }
                        // }
                    }
                });
                if (!error > 0) {
                    console.log(newLocation);
                    let result = [];
                    for (let len = newLocations.length, i = 0; i < len; ++i) {
                        let age = newLocations[i].rand;
                        if (result.indexOf(age) > -1) {
                            continue;
                        }
                        result.push(age);
                        ctrl.individuals.push(newLocations[i]);
                    }
                    console.log(result);
                    ctrl.addAdditionalCost(newLocation);
                    ctrl.locations = getAllLocations();
                } else {
                    toastr.error('Selected physical supplier is already added!');
                }
            } else {
                var supplierId;
                if (supplier) {
                    supplierId = supplier.id;
                } else {
                    supplierId = null;
                }
                var suppliersList = [];
                $.each(ctrl.locations, (k, v) => {
                    suppliersList.push(v.rand);
                });
                $.each(suppliersList, (k, v) => {
                    type = v.split('_')[0];
                    if (type == 'p') {
                        var loc = $.extend(true, {}, getLocationById(v));
                        var newLocationRand = `p_${ loc.id }_${ supplierId }_null_${ loc.requestId}`;
                        if (suppliersList.indexOf(newLocationRand) > -1) {
                            error++;
                        }
                    }
                });
                if (error > 0) {
                    ctrl.buttonsDisabled = false;
                    toastr.error('Selected offer is already added');
                    return;
                }
                supplierPortalModel.addPhysicalSupplier(ctrl.token, supplierId).then((data) => {
                    console.log(data);
                    $.each(data.payload, (k, v) => {
                        if (v.physicalSupplier) {
                            v.rand = `p_${ v.id }_${ v.physicalSupplier.id }_null`;
                        } else {
                            v.rand = `p_${ v.id }_null` + '_null';
                        }
                        ctrl.packages.push(v);
                    });
                    ctrl.locations = getAllLocations();
                    calculateProductAmountsAllLocations();
                    addFirstAdditionalCost(null);
                    $.each(ctrl.locations, (k, v) => {
                        let addCost = ctrl.getAdditionalCosts(v);
                        $.each(addCost, (k1, v1) => {
                            addPriceUomChg(v1, v);
                        });
                    });
                    ctrl.activeRFQ = data.payload[0].rfqs[0].rfq.id;
                    ctrl.buttonsDisabled = false;
                    // addFirstAdditionalCost(null);
                }).catch((reason) => {
                    ctrl.buttonsDisabled = false;
                    console.log(reason);
                });
            }
            // addFirstAdditionalCost(null);
            ctrl.newSupplier = null;
        };
        ctrl.returnParamIndex = function(elem, idx) {
            // console.log(elem)
            if (typeof ctrl.specIndex == 'undefined') {
                ctrl.specIndex = [];
            }
            var paramValues = [];
            $.each(ctrl.locations, (k, v) => {
                $.each(v.products, (k1, v1) => {
                    if (v1.isEnergyCalculationRequired) {
                        if (paramValues.length == 0) {
                            paramValues.push(v1.sellers[0].offers[0].energyParameterValues);
                        }
                    }
                });
            });
            // console.log(paramValues)
            if (elem) {
                if (ctrl.individuals.length > 0) {
                    $.each(paramValues[0], (key, val) => {
                        if (typeof val == 'object' && val) {
                            if (val.specParameterId == elem.id) {
                                // console.log(key)
                                ctrl.specIndex[idx] = key;
                                // console.log( ctrl.specIndex)
                            }
                        }
                    });
                }
                return ctrl.specIndex;
            }
        };
        ctrl.getSellerKey = function(loc, product) {
            var sellerKey = 0;
            return 0;
            // console.log('--',loc)
            var ps = loc.rand.split('_')[2];
            $.each(product.sellers, (key, val) => {
                $.each(val.offers, (keyO, valO) => {
                    if (valO && valO.physicalSupplierCounterparty && ps) {
                        if (valO.physicalSupplierCounterparty.id == ps) {
                            sellerKey = key;
                        }
                    }
                    if (valO && !valO.physicalSupplierCounterparty && !ps) {
                        sellerKey = key;
                    }
                });
            });
            return sellerKey;
        };
        ctrl.mainReasonChanged = function(reason, location) {
            $.each(location.products, (k, v) => {
                let sellerKey = ctrl.getSellerKey(location, v);
                v.sellers[sellerKey].offers[0].noQuoteReason = reason;
            });
        };
        ctrl.productReasonChanged = function(reason, product, location) {
            var productsCount = location.products.length;
            var sameReason = 0;
            $.each(location.products, (k, v) => {
                let sellerKey = ctrl.getSellerKey(location, v);
                if (v.sellers[sellerKey].offers[0].noQuoteReason) {
                    if (v.sellers[sellerKey].offers[0].noQuoteReason.id == reason.id) {
                        sameReason++;
                    }
                }
            });
            if (productsCount == sameReason) {
                if (typeof ctrl.noQuoteReason == 'undefined') {
                    ctrl.noQuoteReason = [];
                }
                ctrl.noQuoteReason[location.rand] = reason;
            }
            console.log(ctrl.noQuoteReason);
        };
        ctrl.getAllRequestsInPackage = function(rfqId) {
            var requestsList = [];
            $.each(ctrl.packages, (packK, packV) => {
                $.each(packV.rfqs, (rfqK, rfqV) => {
                    if (rfqV.rfq) {
                        if (rfqV.rfq.id == rfqId) {
                            $.each(rfqV.requests, (reqK, reqV) => {
                                if (requestsList.indexOf(reqV.request.name) == -1) {
                                    requestsList.push(reqV.request.name);
                                }
                            });
                        }
                    } else if (rfqId == 'surrogate') {
                        $.each(rfqV.requests, (reqK, reqV) => {
                            if (requestsList.indexOf(reqV.request.name) == -1) {
                                requestsList.push(reqV.request.name);
                            }
                        });
                    }
                });
            });
            return requestsList;
        };
        ctrl.getAllProductsInRequest = function(currentRequest) {
            var currentReqId = currentRequest.id;
            var addedProdIds = [];
            var returnProducts = [];
            $.each(ctrl.individuals, (indK, indV) => {
                if (indV.request.id == currentReqId) {
                    $.each(indV.products, (pk, pv) => {
                        if (addedProdIds.indexOf(pv.id) == -1) {
                            addedProdIds.push(pv.id);
                            returnProducts.push(pv.product);
                        }
                    });
                }
            });
            return returnProducts;
        };
        ctrl.addPackage = function(activeRFQId) {
            var data = angular.copy(ctrl.cardInitData.Payload);
            if (activeRFQId == 'surrogate') {
                activeRFQId = 'null';
            }
            data.rfqId = activeRFQId;
            ctrl.buttonsDisabled == true;
            groupOfRequestsModel.addPhysicalSupplierInCard(data).then((server_data) => {
                $rootScope.$broadcast('bladeDataChanged', true);
                $.each(ctrl.packages, (packK, packV) => {
                    $.each(packV.rfqs, (rfqK, rfqV) => {
                        if (activeRFQId != 'null') {
                            if (rfqV.rfq.id == activeRFQId) {
                                ctrl.packages[packK].rfqs = server_data.payload['0'].rfqs;
                                ctrl.locations = getAllLocations();
                                calculateProductAmountsAllLocations();
                                addFirstAdditionalCost(null);
                                $.each(ctrl.locations, (k, v) => {
                                    let addCost = ctrl.getAdditionalCosts(v);
                                    $.each(addCost, (k1, v1) => {
                                        addPriceUomChg(v1, v);
                                    });
                                });
                            }
                        } else if (!rfqV.rfq) {
                            ctrl.packages[packK].rfqs = server_data.payload['0'].rfqs;
                            ctrl.locations = getAllLocations();
                            calculateProductAmountsAllLocations();
                            addFirstAdditionalCost(null);
                            $.each(ctrl.locations, (k, v) => {
                                let addCost = ctrl.getAdditionalCosts(v);
                                $.each(addCost, (k1, v1) => {
                                    addPriceUomChg(v1, v);
                                });
                            });
                        }
                    });
                });
                ctrl.buttonsDisabled == false;
                // console.log(server_data);
            }).catch((e) => {
                ctrl.buttonsDisabled == false;
            });
        };
        ctrl.initSellersCardNavigation = function() {
            setTimeout(() => {
                var cards = $('#sellerCardsItems .card-carousel-item');
                cards.addClass('hidden');
                $.each($(cards), (k, v) => {
                    if (k <= 2) {
                        $(v).removeClass('hidden');
                    }
                });
            });
        };
        ctrl.sellersCardNavigation = function(direction) {
            if (typeof ctrl.sellerCardsCurrentOffset == 'undefined') {
                ctrl.sellerCardsCurrentOffset = 0;
            }
            var itemsToDisplay = 3;
            var cards = $('#sellerCardsItems .card-carousel-item');
            var collectionLength = cards.length;
            var firstElementIndex = ctrl.sellerCardsCurrentOffset;
            var lastElementIndex = firstElementIndex + itemsToDisplay - 1;
            if (direction == 'next') {
                if (lastElementIndex >= collectionLength) {
                    return;
                }
                firstElementIndex = firstElementIndex + 1;
                lastElementIndex = lastElementIndex + 1;
                ctrl.sellerCardsCurrentOffset = firstElementIndex;
            } else {
                if (firstElementIndex <= 0) {
                    return;
                }
                firstElementIndex = firstElementIndex - 1;
                lastElementIndex = lastElementIndex - 1;
                ctrl.sellerCardsCurrentOffset = firstElementIndex;
            }
            cards.addClass('hidden');
            $.each($(cards), (k, v) => {
                if (k >= firstElementIndex && k <= lastElementIndex) {
                    $(v).removeClass('hidden');
                }
            });
            // console.log(cards);
        };
        ctrl.changeOfferSupplier = function(supplierId, location) {
            if (!supplierId) {
                return;
            }
            var objProducts, obj;
            var requestOffersIds = [];
            var found = 0;
            var locationParams = location.rand.split('_');
            locationParams[2] = supplierId.id;
            var newLocationRand = locationParams.join('_');
            var isPackage = locationParams[0] == 'p';
            if (isPackage) {
                obj = ctrl.packages;
                objProducts = location.rfqs[0].requests[0].request.locations[0].products;
            } else {
                obj = ctrl.individuals;
                objProducts = location.products;
            }
            $.each(obj, (k, v) => {
                if (v.rand == newLocationRand) {
                    found++;
                }
            });
            if (found == 0) {
                $.each(objProducts, (k, v) => {
                    requestOffersIds.push(v.sellers[0].offers[0].id);
                });
                ctrl.disablePhysicalSupplierField = true;
                supplierPortalModel.changeOfferSupplier(ctrl.token, supplierId.id, requestOffersIds.join(',')).then((data) => {
                    console.log(data);
                    ctrl.buttonsDisabled = false;
                    location.physicalSupplier = supplierId;
                    $.each(objProducts, (k, v) => {
                        v.sellers[0].offers[0].physicalSupplierCounterparty = supplierId;
                    });
                    ctrl.disablePhysicalSupplierField = false;
                    // addFirstAdditionalCost(null);
                }).catch((reason) => {
                    ctrl.buttonsDisabled = false;
                    ctrl.disablePhysicalSupplierField = false;
                    console.log(reason);
                });
            } else {
                toastr.error('Selected physical supplier is already added!');
            }
        };
        ctrl.copyOffer = function(packageId) {
            supplierPortalModel.copyPackageOffer(ctrl.token, packageId).then((data) => {
                console.log(data);
                $.each(data.payload, (k, v) => {
                    if (v.physicalSupplier) {
                        v.rand = `po_${ v.id }_${ v.physicalSupplier.id }_null`;
                    } else {
                        v.rand = `po_${ v.id }_null` + '_null';
                    }
                    ctrl.packagesOffers.push(v);
                });
                ctrl.locations = getAllLocations();
                calculateProductAmountsAllLocations();
                addFirstAdditionalCost(null);
                $.each(ctrl.locations, (k, v) => {
                    let addCost = ctrl.getAdditionalCosts(v);
                    $.each(addCost, (k1, v1) => {
                        addPriceUomChg(v1, v);
                    });
                });
                ctrl.activeRFQ = data.payload[0].rfqs[0].rfq.id;
                ctrl.buttonsDisabled = false;
                // addFirstAdditionalCost(null);
            }).catch((reason) => {
                ctrl.buttonsDisabled = false;
                console.log(reason);
            });
        };
        ctrl.getDistinctLocationsInRequest = function(reqId) {
            var locationsNames = [];
            $.each(ctrl.individuals, (indK, indV) => {
                if (indV.request.id == reqId) {
                    if (locationsNames.indexOf(indV.location.name) == -1) {
                        locationsNames.push(indV.location.name);
                    }
                }
            });
            return locationsNames;
        };
        console.log('SupplierPortalController');
        ctrl.updatePhysicalSupplier = function(id) {
            console.log(id);
            console.log(ctrl.packages[id].physicalSupplier.name);
        };
        ctrl.getVesselDetailsByRequestId = function(requestId) {
            var vesselDetails = null;
            $.each(ctrl.individuals, (indK, indV) => {
                if (indV.request.id == requestId) {
                    vesselDetails = indV.vesselDetails;
                }
            });
            return vesselDetails;
        };
        ctrl.checkEnergyProduct = function(products) {
            ok = 0;
            $.each(products, (k, v) => {
                if (v.isEnergyCalculationRequired) {
                    ok++;
                }
            });
            if (ok > 0) {
                return true;
            }
            return false;
        };
        ctrl.changedPhSupplier = function(idx, where) {
            // console.log(idx);
            if (where == 'individuals') {
                // console.log(ctrl.individuals[idx]);
                $timeout(() => {
                    if (ctrl.individuals[idx].physicalSupplier == null) {
                        // toastr.error('Physical Supplier cannot be deleted. Please select a valid physical supplier.')
                        ctrl.individuals[idx].physicalSupplier = ctrl.individuals[idx].products[0].sellers[0].offers[0].physicalSupplierCounterparty;
                    }
                }, 100);
            }
            if (where == 'packages') {
                // console.log(ctrl.packages[idx]);
                // console.log(ctrl.packages[idx].rfqs["0"].requests["0"].request.locations["0"].products["0"].sellers["0"].offers["0"].physicalSupplierCounterparty);
                // .rfqs["0"].requests["0"].request.locations["0"].products["0"].sellers["0"].offers["0"].physicalSupplierCounterparty
                $timeout(() => {
                    if (ctrl.packages[idx].physicalSupplier == null) {
                        // toastr.error('Physical Supplier cannot be deleted. Please select a valid physical supplier.')
                        ctrl.packages[idx].physicalSupplier = ctrl.packages[idx].rfqs['0'].requests['0'].request.locations['0'].products['0'].sellers['0'].offers['0'].physicalSupplierCounterparty;
                    }
                }, 100);
            }
        };
        ctrl.checkisNaN = function(oldVal, newVal) {
            // console.log(newVal)
            if (newVal && isNaN(newVal)) {
                return oldVal;
            }
            return false;
        };

        ctrl.checkPrice = function(oldVal, newVal, product, giveError) {
            newVal = Math.floor(Number(newVal));
            if (_.isInteger(newVal) && newVal > 0 || _.isInteger(newVal) && product.allowZeroPricing && newVal === 0) {
                return false;
            }
            if (giveError) {
                if (product.allowZeroPricing) {
                    toastr.error('Please enter a valid price');
                } else {
                    toastr.error('Please enter a price greater than 0');
                }
            }
            return oldVal ? oldVal : '';
        };

        ctrl.updateIncoterm = function(incoterm, location, seller, request) {
            // requestOfferIds = ctrl.returnLocationReqOffIds(location, seller.randUniquePkg);
            var  requestOfferIds = [];
            $.each(location.products, (prodK, prodV) => {
            	$.each(prodV.sellers, (sellerK, sellerV) => {
	                $.each(prodV.sellers, (sellerK, sellerV) => {
                    	if (sellerV.offers) {
                    		if (sellerV.offers[0].id) {
                    			requestOfferIds.push(sellerV.offers[0].id);
                    		}
                    	}
	                });
                });
            });

            var data = {
                RequestOfferIds: requestOfferIds,
                IncotermId: incoterm.id
            };
            if (typeof data.RequestOfferIds[0] != 'undefined') {
                groupOfRequestsModel.updateIncoterm(data).then((response) => {
                    if (response.isSuccess) {
                    	location.products[0].sellers[0].offers[0].incoterm = incoterm;
                    }
                });
            }
        };

        ctrl.getPackageIncoterm = function(packageId) {
        	var incoterm = null;
            $.each(ctrl.packages, (pk, pv) => {
                if (pv.id == packageId) {
                    $.each(pv.rfqs, (rfk, rfv) => {
                        $.each(rfv.requests, (rqk, rqv) => {
                            $.each(rqv.request.locations, (lk, lv) => {
                                $.each(lv.products, (pk, pv) => {
                                    $.each(pv.sellers, (sk, sv) => {
                                        $.each(sv.offers, (ok, ov) => {
                                            incoterm = ov.incoterm;
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
            return	incoterm;
        };
        ctrl.updateIncotermInPackage = function(packageId, incoterm) {
            // .payload.packages["0"].rfqs["0"].requests["0"].request.locations["0"].products["0"].sellers["0"].offers["0"].incoterm
            var requestOfferIds = [];
            $.each(ctrl.packages, (pk, pv) => {
                if (pv.id == packageId) {
                    $.each(pv.rfqs, (rfk, rfv) => {
                        $.each(rfv.requests, (rqk, rqv) => {
                            $.each(rqv.request.locations, (lk, lv) => {
                                $.each(lv.products, (pk, pv) => {
                                    $.each(pv.sellers, (sk, sv) => {
                                        $.each(sv.offers, (ok, ov) => {
                                            requestOfferIds.push(ov.id);
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            });
            var data = {
                RequestOfferIds: _.uniq(requestOfferIds),
                IncotermId: incoterm.id
            };
            if (typeof data.RequestOfferIds[0] != 'undefined') {
                groupOfRequestsModel.updateIncoterm(data).then(() => {
                });
            }
        };

        ctrl.disableCostBasedOnApplicableProductStatus = function(productId, locationProducts) {
            var statusesToDisableProduct = [ 'Cancelled' ];
            var statusesToDisableAll = [ 'Stemmed' ];
            var allHasDisableStatus = false;
            var productHasDisableStatus = false;
            $.each(locationProducts, (pk, pv) => {
                if (pv.productStatus) {
                    if (productId == pv.id) {
                        if (statusesToDisableProduct.indexOf(pv.productStatus.name) != -1) {
                            productHasDisableStatus = true;
                        }
                    }
                    if (statusesToDisableAll.indexOf(pv.productStatus.name) != -1) {
                        allHasDisableStatus = true;
                    }
                }
            });
            if (productId != -1) {
                return productHasDisableStatus;
            }
            return allHasDisableStatus;
        };

        ctrl.getFilterAdditionalCostList = function() {
            // Shiptech10.Api.Masters/api/masters/additionalcosts/listApps
            let payload =  { Payload: {} };
            let result = $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/listApps`, payload).then((result) => {
                const results = result.data?.payload;
                let futureAdditionalCost = results.filter(e => e.costType.name !== "Total" && e.costType.name !== "Range")
                ctrl.FilterAdditionalCost = futureAdditionalCost;
            })
        }
        ctrl.mapSpecParamKeyById = function(product) {
        	let mappedSpecParamKeys = [];
        	let object = product.sellers[0].offers[0].energyParameterValues;
            Object.keys(object).forEach((objectKey) => {
			    let value = object[objectKey];
			    if (value) {
				    if (value.specParameterId) {
					    mappedSpecParamKeys[value.specParameterId] = objectKey;
				    }
			    }
			    return;
            });
            return mappedSpecParamKeys;
        };

        $(document).on('keyup', '.typeahead', (ev, suggestion) => {
            var currentTargetHeight, currentTargetLeftPosition,currentTargetTopPosition;
        	if ($('[uib-typeahead-popup]').is(':visible')) {
        		if ($(ev.target).attr('typeahead-append-to') == '\'body\'') {
                    $('[uib-typeahead-popup]').css('top', '');
                    $('[uib-typeahead-popup]').css('left', '');
        			currentTargetTopPosition = $(ev.target).offset().top;
        			currentTargetLeftPosition = $(ev.target).offset().left;
        			currentTargetHeight = parseFloat($(ev.target).css('height'));
        			$('[uib-typeahead-popup]').css('top', currentTargetTopPosition + currentTargetHeight);
        			$('[uib-typeahead-popup]').css('left', currentTargetLeftPosition);
        		}
        	}
        });
        $('.blade-column.main-content-column').on('scroll', () => {
        	if ($('[uib-typeahead-popup]').is(':visible')) {
                var currentTargetHeight, currentTargetLeftPosition,currentTargetTopPosition;
        		var activeInput = $(`[aria-owns='${ $('[uib-typeahead-popup]:visible').attr('id') }']`);
        		if ($(activeInput).attr('typeahead-append-to') == '\'body\'') {
        			console.log('^^^^^^^');
        			currentTargetTopPosition = $(activeInput).offset().top;
        			currentTargetLeftPosition = $(activeInput).offset().left;
        			currentTargetHeight = parseFloat($(activeInput).css('height'));
        			$('[uib-typeahead-popup]').css('top', currentTargetTopPosition + currentTargetHeight);
        			$('[uib-typeahead-popup]').css('left', currentTargetLeftPosition);
	        		// currentTopPosition = parseFloat($("[uib-typeahead-popup]").css("top"));
	        		// $("[uib-typeahead-popup]").css("top", currentTopPosition - $(this).scrollTop());
        		}
        	}
        });
    }
]);
angular.module('shiptech.pages').component('supplierPortal', {
    templateUrl: 'pages/supplier-portal/views/supplier-portal-component.html',
    controller: 'SupplierPortalController',
    bindings: {
        placement: '<',
        source: '<',
        initdata: '<',
        bladeinfo: '<',
    }
});


angular.module('shiptech.pages').filter('filterNoQuoteProducts', () => {
    return function(items) {
        let filtered = [];
        angular.forEach(items, (item) => {
        	if (!item.sellers[0].offers[0].hasNoQuote) {
	            filtered.push(item);
        	}
        });
        return filtered;
    };
});
