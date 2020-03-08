angular.module('shiptech.pages').controller('SellerCardController', [ '$scope', '$rootScope', 'Factory_Master', '$element', '$attrs', '$timeout', '$filter', '$state', '$stateParams', 'tenantModel', 'tenantSupplierPortalService', 'uiApiModel', 'listsModel', 'lookupModel', 'supplierPortalModel', 'groupOfRequestsModel', 'LOOKUP_MAP', 'LOOKUP_TYPE', 'VALIDATION_MESSAGES', 'COST_TYPE_IDS', 'COMPONENT_TYPE_IDS', 'IDS', 'VALIDATION_STOP_TYPE_IDS', 'CUSTOM_EVENTS', 'MOCKUP_MAP', '$listsCache',
    function($scope, $rootScope, Factory_Master, $element, $attrs, $timeout, $filter, $state, $stateParams, tenantModel, tenantSupplierPortalService, uiApiModel, listsModel, lookupModel, supplierPortalModel, groupOfRequestsModel, LOOKUP_MAP, LOOKUP_TYPE, VALIDATION_MESSAGES, COST_TYPE_IDS, COMPONENT_TYPE_IDS, IDS, VALIDATION_STOP_TYPE_IDS, CUSTOM_EVENTS, MOCKUP_MAP, $listsCache) {
        let ctrl = this;
        ctrl.token = $stateParams.token;
        $scope.forms = {};
        ctrl.additionalCosts = [];
        ctrl.lookupType = null;
        ctrl.additionalCostApplicableFor = {};
        ctrl.additionalCostTotalAmountSums = {};
        ctrl.tenantSettings = null;
        ctrl.offer = null;
        ctrl.tenantQuoteDisabled = null;
        ctrl.tenantQuoteWarning = null;
        ctrl.buttonsDisabled = false;
        ctrl.productTableNoQuoteCheckAll = [];
        ctrl.PRICING_TYPE_FORMULA_ID = 2;
        // There is no "Other" product at the moment. This is simply the first unassigned ID based on the products currently received from backend.
        // Once there is an "Other" product, its ID should replace the value below.
        ctrl.PRODUCT_OTHER_ID = 10;
        ctrl.COST_TYPE_UNIT_ID = 2;
        ctrl.invalidFields = [];
        ctrl.contact = null;
        ctrl.lists = $listsCache;
        tenantSupplierPortalService.tenantSettings.then((settings) => {
            ctrl.numberPrecision = settings.payload.defaultValues;
            ctrl.currency = settings.payload.tenantFormats.currency;
        });
        if ($stateParams.token) {
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
                    listsModel.getForSupplierPortal(ctrl.token).then((data) => {
                        ctrl.lists = data;
                        console.log(ctrl.lists);
                        lookupModel.getAdditionalCostTypesForSupplierPortal(ctrl.token).then((data) => {
                            ctrl.additionalCostTypes = normalizeArrayToHash(data.payload, 'id');
                            supplierPortalModel.getRfq(ctrl.token).then((data) => {
                                ctrl.requests = data.payload;
                                ctrl.request = ctrl.requests[0];
                                ctrl.locations = getAllLocations();

                                getLocationsSuppliers();
                                calculateProductAmountsAllLocations();
                                initNoQuoteCheckBoxAllLocations(ctrl.locations);
                                // Holds the IDs of the locations checked in the Bunkerable Ports section.
                                // It is bound there in the template, so updating it is reflected automagically
                                // in the view.
                                ctrl.selectedLocationIds = selectAllLocationIds(ctrl.locations);
                                ctrl.offer = ctrl.locations[0].products[0].sellers[0].offers[0];
                                ctrl.active_req = ctrl.request.id;
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
                                $.each(ctrl.displayLocations, (k, v) => {
                                    let addCost = ctrl.getAdditionalCosts(v);
                                    $.each(addCost, (k1, v1) => {
                                        addPriceUomChg(v1, v);
                                    });
                                });
                                // Bind Select2 selects.
                                // $('.select2').select2({
                                //     width: null
                                // });
                                initializeDateInputs();
                            });
                        });
                    });
                });
            });
        }
        ctrl.$onChanges = function(change) {
            if (typeof change.source != 'undefined') {
                if (change.source.currentValue) {
                    tenantModel.get().then((data) => {
                        ctrl.tenantSettings = data.payload;
                        // console.log('Tenant Settings: ', ctrl.tenantSettings);
                        uiApiModel.get(MOCKUP_MAP['unrouted.seller-card']).then((data) => {
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
                            lookupModel.getAdditionalCostTypes().then((data) => {
                                setTimeout(() => {
                                    ctrl.additionalCostTypes = normalizeArrayToHash(data.payload, 'id');
                                    ctrl.locations = [];
                                    ctrl.requests = change.source.currentValue;
                                    ctrl.request = ctrl.requests[0];
                                    ctrl.locations[0] = ctrl.request.locations[0];
                                    ctrl.displayLocations = [];
                                    $.each(ctrl.requests, (k, v) => {
                                        ctrl.displayLocations.push(v.locations[0]);
                                    });
                                    if (typeof change.activerequestid != 'undefined') {
                                        ctrl.activerequestid = change.activerequestid.currentValue;
                                    }
                                    console.log(ctrl.locations);
                                    // getLocationsSuppliers();
                                    calculateProductAmountsAllLocations();
                                    initNoQuoteCheckBoxAllLocations(ctrl.locations);
                                    // Holds the IDs of the locations checked in the Bunkerable Ports section.
                                    // It is bound there in the template, so updating it is reflected automagically
                                    // in the view.
                                    ctrl.selectedLocationIds = selectAllLocationIds(ctrl.locations);
                                    ctrl.offer = ctrl.locations[0].products[0].sellers[0].offers[0];
                                    // ctrl.active_req = ctrl.request.id
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
                                    lookupModel.getCounterpartyContacts(getContactCounterparty().id).then((data) => {
                                        ctrl.counterpartyContacts = data.payload;
                                    });
                                    // lookupModel.getNoQuoteReason().then(function(data) {
                                    //     ctrl.reasons = data.payload;
                                    // });
                                    $.each(ctrl.displayLocations, (k, v) => {
                                        let addCost = ctrl.getAdditionalCosts(v);
                                        $.each(addCost, (k1, v1) => {
                                            addPriceUomChg(v1, v);
                                        });
                                    });
                                    // Bind Select2 selects.
                                    // $('.select2').select2({
                                    //     width: null
                                    // });
                                    // initializeDateInputs();
                                }, 10);
                            });
                        });
                    });
                }
            }
        };

        function initializeDateInputs() {
            let date = $('.form_meridian_datetime');
            ctrl.dateFormat = tenantSupplierPortalService.getDateFormat();
            date.datetimepicker({
                format: ctrl.dateFormat,
                isRTL: App.isRTL(),
                showMeridian: true,
                autoclose: true,
                pickerPosition: App.isRTL() ? 'bottom-right' : 'bottom-left',
                todayBtn: false
            }).on('changeDate', (ev) => {
                $timeout(() => {
                    $(ev.target).find('input').val(tenantSupplierPortalService.formatDate(ev.date));
                });
            }).on('hide', (ev) => {
                $timeout(() => {
                    $(ev.target).find('input').val(tenantSupplierPortalService.formatDate(ev.date));
                });
            });
        }

        function initNoQuoteCheckBoxAllLocations(locations) {
            for (let i = 0; i < locations.length; i++) {
                ctrl.productTableNoQuoteCheckAll[locations[i].rand] = areAllProductsNoQuote(locations[i]);
                if (ctrl.productTableNoQuoteCheckAll[locations[i].rand]) {
                    if (typeof ctrl.noQuoteReason == 'undefined') {
                        ctrl.noQuoteReason = [];
                    }
                    ctrl.noQuoteReason[locations[i].rand] = locations[i].products[0].sellers[0].offers[0].noQuoteReason;
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
            return ctrl.displayLocations[0].products[0].sellers[0].sellerCounterparty;
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
            return $filter('filter')(ctrl.request.locations, {
                id: locationId
            })[0];
        }

        function getDisplayLocationById(locationId, requestId) {
            return $filter('filter')(ctrl.displayLocations, {
                location: {
                    id: locationId
                }
            })[0];
        }

        function getSupplierById(supplierId) {
            return $filter('filter')(ctrl.suppliers, {
                id: supplierId
            })[0];
        }

        function getOfferForLocation(location) {
            return location.offer;
            // return $filter("filter")(ctrl.request.offers, {
            //    requestLocationId: locationId
            // })[0];
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
            for (let i = 0; i < ctrl.requests.length; i++) {
                for (let j = 0; j < ctrl.requests[i].locations.length; j++) {
                    result.push(ctrl.requests[i].locations[j]);
                }
            }
            return result;
        }

        /**
         * get locations - physical supplier combinations
         * @returns {var}
         */
        function getLocationsSuppliers() {
            locPhy = [];
            ctrl.suppliers = [];
            // debugger
            $.each(ctrl.request.locations, (locK, locV) => {
                locV.offer = ctrl.request.offers[0];
                $.each(locV.products, (prodK, prodV) => {
                    $.each(prodV.sellers, (sellerK, sellerV) => {
                        seller = sellerV;
                        uniqueIdentifier = `${locV.id }-null-${ ctrl.request.id}`;
                        if (typeof seller.offers != 'undefined') {
                            if (seller.offers.length > 0) {
                                if (seller.offers[0].physicalSupplierCounterparty) {
                                    uniqueIdentifier = `${locV.id }-${ seller.offers[0].physicalSupplierCounterparty.id }-${ ctrl.request.id}`;
                                    ctrl.suppliers.push(seller.offers[0].physicalSupplierCounterparty);
                                }
                            }
                        }
                        if ($.inArray(uniqueIdentifier, locPhy) == -1) {
                            locPhy.push(uniqueIdentifier);
                        }
                        seller.randUnique = uniqueIdentifier;
                    });
                });
            });
            ctrl.displayLocations = [];
            $.each(locPhy, (key, val) => {
                loc = $.extend(true, {}, getLocationById(val.split('-')[0]));
                if (loc) {
                    if (val.split('-')[1] != 'null') {
                        loc.physicalSupplier = $.extend(true, {}, getSupplierById(val.split('-')[1]));
                    } else {
                        loc.physicalSupplier = null;
                    }
                    loc.requestId = val.split('-')[2];
                    loc.rand = val;
                    ctrl.displayLocations.push(loc);
                    loc = null;
                }
            });
            $.each(ctrl.displayLocations, (k, v) => {
                $.each(v.products, (pk, pv) => {
                    $.each(pv.sellers, (sk, sv) => {
                        if (v.physicalSupplier && sv) {
                            if (v.physicalSupplier.id != sv.offers[0].physicalSupplierCounterparty.id) {
                                ctrl.displayLocations[k].products[pk].sellers.splice(sk, 1);
                            }
                        }
                    });
                });
            });
            console.log(ctrl.displayLocations);
            // console.log(locPhy[0].split('-'))
        }

        /**
         * Given an array of location objects, it extracts all their ID's in an
         * object whose keys are the IDs.
         */
        function selectAllLocationIds(locations) {
            let result = {};
            for (let i = 0; i < locations.length; i++) {
                result[locations[i].location.id] = true;
            }
            return result;
        }

        /**
         * Determines if given location has additional costs.
         */
        function locationHasAdditionalCosts(location) {
            if (typeof ctrl.getAdditionalCosts(location) == 'undefined') {
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
                for (let i = 0; i < ctrl.displayLocations.length; i++) {
                    if (!locationHasAdditionalCosts(ctrl.displayLocations[i])) {
                        ctrl.addAdditionalCost(ctrl.displayLocations[i]);
                    }
                }
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
            for (let i = 0; i < offers.length; i++) {
                result = [];
                for (let j = 0; j < offers[i].additionalCosts.length; j++) {
                    if (offers[i].additionalCosts[j].additionalCost !== null) {
                        result.push(offers[i].additionalCosts[j]);
                    }
                }
                angular.copy(result, offers[i].additionalCosts);
            }
            return offers;
        }

        function validateAdditionalCostsNonInputs(location) {
            let compare,
                nonFields = [ 'currency', 'priceUom' ],
                additionalCosts = ctrl.getAdditionalCosts(location),
                additionalCost;
            if (typeof additionalCosts != 'undefined') {
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

        function calculateProductAmountsAllLocations() {
            for (let i = 0; i < ctrl.displayLocations.length; i++) {
                calculateProductsAmountField(ctrl.displayLocations[i]);
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
            return ctrl.additionalCostTypes[additionalCost.additionalCost.id].componentType.id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT;
        }

        /**
         * Get the corresponding component type ID for a given additional cost.
         */
        function getAdditionalCostDefaultCostType(additionalCost) {
            if (!additionalCost.additionalCost) {
                return false;
            }
            return ctrl.additionalCostTypes[additionalCost.additionalCost.id].costType;
        }

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
            sellerKey = ctrl.getSellerKey(loc, product);
            currentConfirmedQtyPrice = 1;
            if (typeof product.confirmedQtyPrice != 'undefined') {
                currentConfirmedQtyPrice = product.confirmedQtyPrice;
            }
            return Number(currentConfirmedQtyPrice) * Number(product.maxQuantity) * Number(product.sellers[sellerKey].offers[0].price) || 0;
        }

        function sumProductMaxQuantities(products, additionalCost) {
            let result = 0;
            for (let i = 0; i < products.length; i++) {
                product = products[i];
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
                result = result + Number(products[i].totalAmount);
            }
            return result;
        };

        /**
         * Get the grand total for a given location, that is the sum of product total and additional costs total.
         */
        ctrl.getGrandTotal = function(location) {
            return ctrl.sumProductAmounts(location.products) + (ctrl.additionalCostTotalAmountSums[location.rand] || 0);
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
                if (additionalCost.priceUom && additionalCost.prodConv && additionalCost.prodConv.length == location.products.length) {
                    for (let i = 0; i < location.products.length; i++) {
                        product = location.products[i];
                        if (additionalCost.isAllProductsCost || product.id == additionalCost.parentProductId) {
                            additionalCost.amount = additionalCost.amount + product.maxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                        }
                    }
                }
                break;
            case COST_TYPE_IDS.FLAT:
                additionalCost.amount = additionalCost.price;
                break;
            case COST_TYPE_IDS.PERCENT:
                productComponent = isProductComponent(additionalCost);
                if (additionalCost.isAllProductsCost || !productComponent) {
                    totalAmount = ctrl.sumProductAmounts(location.products);
                } else {
                    totalAmount = product.totalAmount;
                }
                if (productComponent) {
                    additionalCost.amount = totalAmount * additionalCost.price / 100;
                } else {
                    totalAmount = totalAmount + sumProductComponentAdditionalCostAmounts(location);
                    additionalCost.amount = totalAmount * additionalCost.price / 100;
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
            if (!ctrl.additionalCosts[location.id]) {
                return;
            }
            for (let i = 0; i < ctrl.additionalCosts[location.id].length; i++) {
                if (isProductComponent(ctrl.additionalCosts[location.id][i]) || ctrl.additionalCosts[location.id][i].costType.id !== COST_TYPE_IDS.PERCENT) {
                    result = result + ctrl.additionalCosts[location.id][i].totalAmount;
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
            if (ctrl.displayLocations[0].products[0].sellers[0].offers[0].contactCounterparty === null) {
                ctrl.invalidFields = [ 'Quoted By' ];
                return false;
            }
            if (!$scope.forms.products.$valid) {
                ctrl.invalidFields = getInvalidFields($scope.forms.products);
                return false;
            }
            if (!$scope.forms.additionalCosts.$valid) {
                ctrl.invalidFields = getInvalidFields($scope.forms.additionalCosts);
                return false;
            }
            let payload = [];
            for (let i = 0; i < ctrl.displayLocations.length; i++) {
                // if (ctrl.selectedLocationIds[ctrl.request.locations[i].location.id]) {
                nonInputInvalidFields = validateAdditionalCostsNonInputs(ctrl.displayLocations[i]);
                if (nonInputInvalidFields !== null) {
                    ctrl.invalidFields = nonInputInvalidFields;
                    return false;
                }
                offers = [];
                offerForLocation = getOfferForLocation(ctrl.displayLocations[i]);
                for (let j = 0; j < ctrl.displayLocations[i].products.length; j++) {
                    sellerKey = ctrl.getSellerKey(ctrl.displayLocations[i], ctrl.displayLocations[i].products[j]);
                    offers = offers.concat(ctrl.displayLocations[i].products[j].sellers[sellerKey].offers);
                }
                offers = removeNullAdditionalCosts(offers);
                ctrl.displayLocations[i].offer = offerForLocation;
                // payload.push({
                //     requestLocationId: ctrl.displayLocations[i].id,
                //     requestOffers: offers,
                //     allProductsAdditionalCosts: offerForLocation.additionalCosts
                // });
                // }
            }
            payload = ctrl.displayLocations;
            return payload;
        }
        ctrl.setDialogType = function(type, input) {
            ctrl.lookupType = LOOKUP_MAP[type];
            ctrl.lookupInput = input;
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
            result = offerForLocation.additionalCosts;
            ctrl.additionalCostApplicableFor = {};
            for (let m = 0; m < result.length; m++) {
                additionalCost = result[m];
                if (!additionalCost.fakeId) {
                    additionalCost.fakeId = -Date.now();
                }
                // Save product model for "Applicable for", and calculate the confirmedQuantity
                // based on it:
                ctrl.additionalCostApplicableFor[additionalCost.fakeId] = null;
                additionalCost.maxQuantity = sumProductMaxQuantities(location.products, additionalCost);
                // TODO: Get the quantityUom of the first product? Or is there a different business logic for this?
                additionalCost.quantityUom = location.products[0].quantityUom;
                additionalCost.parentLocationId = location.id;
                additionalCost = calculateAdditionalCostAmounts(additionalCost, null, location);
                if (!additionalCost.isDeleted) {
                    ctrl.additionalCostTotalAmountSums[location.rand] += additionalCost.totalAmount;
                }
            }
            for (let i = 0; i < location.products.length; i++) {
                for (let j = 0; j < location.products[i].sellers.length; j++) {
                    offer = ctrl.getSellerLatestOffer(location.products[i].sellers[j]);
                    // Save product model for "Applicable for."
                    if (typeof offer != 'undefined') {
                        if (typeof offer.additionalCosts != 'undefined') {
                            for (let k = 0; k < offer.additionalCosts.length; k++) {
                                additionalCost = offer.additionalCosts[k];
                                if (!additionalCost.fakeId) {
                                    additionalCost.fakeId = -Date.now();
                                }
                                additionalCost.parentProductId = location.products[i].id;
                                additionalCost.parentLocationId = location.id;
                                ctrl.additionalCostApplicableFor[additionalCost.fakeId] = location.products[i];
                                additionalCost.maxQuantity = sumProductMaxQuantities(location.products, additionalCost);
                                additionalCost = calculateAdditionalCostAmounts(additionalCost, location.products[i], location);
                                if (!additionalCost.isDeleted) {
                                    ctrl.additionalCostTotalAmountSums[location.rand] += additionalCost.totalAmount;
                                }
                            }
                            result = result.concat(offer.additionalCosts);
                        }
                    }
                }
            }
            result = $filter('filter')(result, {
                isDeleted: false
            });
            ctrl.additionalCosts[location.id] = result;
            return result;
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
                currentOfferDate = moment(seller.offers[0].quoteDate, moment.ISO_8601);
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
                prod = location.products[i];
                if (prod.maxQuantity.id == additionalCost.priceUom.id) {
                    additionalCost.prodConv[i] = 1;
                } else {
                    setConvertedAddCost(prod, additionalCost, i);
                }
            }
        };

        function setConvertedAddCost(prod, additionalCost, i) {
            lookupModel.getConvertedUOM(prod.product.id, 1, prod.uom.id, additionalCost.priceUom.id).then((server_data) => {
                additionalCost.prodConv[i] = server_data.payload;
            }).catch((e) => {
                throw 'Unable to get the uom.';
            });
        }
        ctrl.productUomChanged = function(product, loc) {
            productUomChg(product, loc);
        };

        function productUomChg(product, loc) {
            sellerKey = ctrl.getSellerKey(loc, product);
            if (!$stateParams.token) {
                if (product.canBeEdited) {
                    data = {
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
                }
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
            if (payload) {
                ctrl.buttonsDisabled = true;
                supplierPortalModel.sendQuote(ctrl.token, payload).then((data) => {
                    ctrl.buttonsDisabled = false;
                    addFirstAdditionalCost(null);
                    $state.reload();
                }).catch((reason) => {
                    ctrl.buttonsDisabled = false;
                    addFirstAdditionalCost(null);
                });
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
            lookupModel.get(LOOKUP_TYPE.PRODUCTS, productId).then((server_data) => {
                product = server_data.payload;
                // If there's a set lookupInput, it means we need
                // to copy the lookup dialog selection into it.
                if (ctrl.lookupInput) {
                    target = ctrl.lookupInput.sellers[0].offers[0].quotedProduct;
                    target.name = product.name;
                    target.id = product.id;
                }
            });
        };
        ctrl.selectCounterparty = function(sellerId) {
            let data;
            lookupModel.get(ctrl.counterpartyType, sellerId).then((server_data) => {
                data = server_data.payload;
                ctrl.lookupInput.sellers[0].offers[0].physicalSupplierCounterparty = {};
                ctrl.lookupInput.sellers[0].offers[0].physicalSupplierCounterparty.id = data.id;
                ctrl.lookupInput.sellers[0].offers[0].physicalSupplierCounterparty.name = data.name;
            });
        };
        ctrl.selectSupplier = function(sellerId) {
            let data;
            data = $filter('filter')(ctrl.lists.Supplier, {
                id: sellerId.id
            })[0];
            console.log(data);
            // lookupModel.get(ctrl.counterpartyType, sellerId.id).then(function(server_data) {
            //     data = server_data.payload;
            ctrl.newSupplier = {};
            ctrl.newSupplier.id = data.id;
            ctrl.newSupplier.name = data.name;
            // });
        };

        function findAdditionalCost(additionalCost, location) {
            let i,
                j,
                offerForLocation = getOfferForLocation(location);
            for (i = 0; i < offerForLocation.additionalCosts.length; i++) {
                if (additionalCost.fakeId === offerForLocation.additionalCosts[i].fakeId) {
                    return {
                        container: offerForLocation.additionalCosts,
                        index: i
                    };
                }
            }
            for (i = 0; i < location.products.length; i++) {
                sellerKey = ctrl.getSellerKey(location, location.products[i]);
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
            if (typeof ctrl.currency == 'undefined') {
                ctrl.currency = ctrl.offer.currency;
            }
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
                if (!location.products[i].sellers[0].offers[0].hasNoQuote) {
                    return false;
                }
            }
            return true;
        }

        /**
         * Moves the given additional cost object under the given product in the given location,
         * deleting it from the product it is currently under.
         * @param {Object} additionalCost - An additional cost object.
         * @param {Object} product - A product object, which is the target parent product.
         * @param {Object} location - The current location (under which all of this happens).
         */
        ctrl.applicableForChange = function(additionalCost, product, location) {
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
                if (product.canBeEdited) {
                    product.sellers[0].offers[0].additionalCosts.push(additionalCost);
                } else {
                    toastr.error('You can\'t add an additional cost for that product');
                }
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
        ctrl.additionalCostNameChanged = function(additionalCost) {
            additionalCost.costType = getAdditionalCostDefaultCostType(additionalCost);
        };
        ctrl.quotedByChanged = function(quotedBy) {
            for (let i = 0; i < ctrl.displayLocations.length; i++) {
                for (let j = 0; j < ctrl.displayLocations[i].products.length; j++) {
                    ctrl.displayLocations[i].products[j].sellers[0].offers[0].contactCounterparty = {};
                    ctrl.displayLocations[i].products[j].sellers[0].offers[0].contactCounterparty.id = quotedBy.id;
                    ctrl.displayLocations[i].products[j].sellers[0].offers[0].contactCounterparty.name = quotedBy.name;
                }
            }
        };

        /**
         * Adds an Additional Cost to the first product in a location.
         * @param {Object} location - The location object containing the product.
         */
        ctrl.addAdditionalCost = function(location) {
            let newAdditionalCost = createNewAdditionalCostObject();
            // if (location.products[0].sellers.length > 0) {
            //     location.products[0].sellers[0].offers[0].additionalCosts.push(newAdditionalCost);
            // }
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                    	if (prodV.sellers.length > 0) {
	                        $.each(prodV.sellers, (sellerK, sellerV) => {
	                            if (sellerV.offers.length > 0) {
	                                if (sellerV.offers[0].additionalCosts && sellerV.offers[0].additionalCosts.length == 0) {
	                            		if (!reqV.hasFirstAdditionalCost) {
		                            		sellerV.offers[0].additionalCosts.push(newAdditionalCost);
		                            		reqV.hasFirstAdditionalCost = true;
	                            		}
	                            	}
	                            }
	                        });
                    	}
                    });
                });
            });
        };
        ctrl.deleteAdditionalCost = function(additionalCost, location) {
            if (additionalCost.fakeIndex < 0) {
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
        ctrl.productPriceChanged = function(product, loc) {
            product.totalAmount = calculateProductAmount(product, loc);
        };
        ctrl.productTableNoQuoteCheckAllChanged = function(location, status) {
            for (let i = 0; i < location.products.length; i++) {
                location.products[i].sellers[0].offers[0].hasNoQuote = status;
            }
        };
        ctrl.noQuoteChanged = function(location) {
            ctrl.productTableNoQuoteCheckAll[location.rand] = areAllProductsNoQuote(location);
        };
        ctrl.setLatestOfferParams = function(location) {
            ctrl.latestOfferToken = ctrl.token;
            ctrl.latestOfferLocation = location.id;
            ctrl.latestOfferSeller = ctrl.displayLocations[0].products[0].sellers[0].sellerCounterparty.id;
            ctrl.randomOfferRefreshToken = generateOfferPopupRandomToken();
        };

        /**
         * Updates the validity property of the offers of all products with given value.
         * Note that there's only one seller and one offer per product in this view's DTO.
         */
        ctrl.updateOffersValidity = function(value) {
            for (let i = 0; i < ctrl.displayLocations.length; i++) {
                for (let j = 0; j < ctrl.displayLocations[i].products.length; j++) {
                    ctrl.displayLocations[i].products[j].sellers[0].offers[0].validity = value;
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
        ctrl.addSupplier = function(supplier) {
            error = 0;
            if (typeof location_supplier == 'undefined') {
                location_supplier = [];
            }
            $.each(ctrl.displayLocations, (key, val) => {
                if (!val.physicalSupplier) {
                    location_supplier.push(`${val.location.id }_null`);
                } else {
                    location_supplier.push(`${val.location.id }_${ val.physicalSupplier.id}`);
                }
            });
            $.each(Array.from(new Set(location_supplier)), (key, val) => {
                console.log(val);
                loc = $.extend(true, {}, getDisplayLocationById(val.split('_')[0]));
                if (loc.requestId == ctrl.active_req) {
                    if (!loc.physicalSupplier) {
                        if (location_supplier.indexOf(`${loc.location.id }_${ supplier.id}`) == -1) {
                            newLocation = angular.copy(loc);
                            newLocation.physicalSupplier = supplier;
                            $.each(newLocation.products, (k, v) => {
                                v.sellers[0].id = 0;
                                v.sellers[0].offers[0].id = 0;
                                v.sellers[0].offers[0].physicalSupplierCounterparty = supplier;
                            });
                            newLocation.rand = `${loc.location.id }_${ supplier.id}`;
                            console.log(newLocation);
                            ctrl.displayLocations.push(newLocation);
                        } else {
                            error++;
                        }
                    } else if (location_supplier.indexOf(`${loc.location.id }_${ supplier.id}`) == -1) {
                        newLocation = angular.copy(loc);
                        newLocation.physicalSupplier = supplier;
                        $.each(newLocation.products, (k, v) => {
                            v.sellers[0].id = 0;
                            v.sellers[0].offers[0].id = 0;
                            v.sellers[0].offers[0].physicalSupplierCounterparty = supplier;
                        });
                        newLocation.rand = `${loc.location.id }_${ supplier.id}`;
                        console.log(newLocation);
                        ctrl.displayLocations.push(newLocation);
                    } else {
                        error++;
                    }
                }
            });
            if (error > 0) {
                toastr.error('Selected physical supplier is already added!');
            }
            ctrl.newSupplier = null;
        };
        ctrl.returnParamIndex = function(elem, idx) {
            // console.log(elem)
            if (typeof ctrl.specIndex == 'undefined') {
                ctrl.specIndex = [];
            }
            if (elem) {
                $.each(ctrl.request.locations[0].products[0].sellers[0].offers[0].energyParameterValues, (key, val) => {
                    if (typeof val == 'object' && val) {
                        if (val.specParameterId == elem.id) {
                            ctrl.specIndex[idx] = key;
                        }
                    }
                });
            }
        };
        ctrl.getSellerKey = function(loc, product) {
            // sellerKey = null;
            // $.each(product.sellers, function(key, val) {
            //     if (val.offers[0] && val.offers[0].physicalSupplierCounterparty) {
            //         if (val.offers[0].physicalSupplierCounterparty.id == loc.physicalSupplier.id) {
            //             sellerKey = key
            //         }
            //     }
            // })
            return 0;
        };
        ctrl.mainReasonChanged = function(reason, location) {
            $.each(location.products, (k, v) => {
                v.sellers[0].offers[0].noQuoteReason = reason;
            });
        };
        ctrl.productReasonChanged = function(reason, product, location) {
            productsCount = location.products.length;
            sameReason = 0;
            $.each(location.products, (k, v) => {
                if (v.sellers[0].offers[0].noQuoteReason) {
                    if (v.sellers[0].offers[0].noQuoteReason.id == reason.id) {
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
        };
        ctrl.saveSupplierCard = function() {
            let nonInputInvalidFields,
                offers,
                offerForLocation;
            ctrl.invalidFields = [];
            $.each($scope.forms.products, (k, v) => {
                if (!v.$valid) {
                    ctrl.invalidFields.push(getInvalidFields(v));
                }
            });
            if (ctrl.invalidFields.length > 0) {
                $.each(ctrl.invalidFields, (invK, invV) => {
                    toastr.error(`Check invalid field: ${ invV}`);
                });
                return false;
            }
            if (!$scope.forms.additionalCosts.$valid) {
                ctrl.invalidFields = getInvalidFields($scope.forms.additionalCosts);
                return false;
            }
            let payload = [];
            for (let i = 0; i < ctrl.displayLocations.length; i++) {
                // if (ctrl.selectedLocationIds[ctrl.request.locations[i].location.id]) {
                nonInputInvalidFields = validateAdditionalCostsNonInputs(ctrl.displayLocations[i]);
                if (nonInputInvalidFields !== null) {
                    ctrl.invalidFields = nonInputInvalidFields;
                    return false;
                }
                offers = [];
                offerForLocation = getOfferForLocation(ctrl.displayLocations[i]);
                for (let j = 0; j < ctrl.displayLocations[i].products.length; j++) {
                    sellerKey = ctrl.getSellerKey(ctrl.displayLocations[i], ctrl.displayLocations[i].products[j]);
                    if (ctrl.displayLocations[i].products[j].sellers.length > 0) {
                        offers = offers.concat(ctrl.displayLocations[i].products[j].sellers[sellerKey].offers);
                    }
                }
                offers = removeNullAdditionalCosts(offers);
                ctrl.displayLocations[i].offer = offerForLocation;
                // payload.push({
                //     requestLocationId: ctrl.displayLocations[i].id,
                //     requestOffers: offers,
                //     allProductsAdditionalCosts: offerForLocation.additionalCosts
                // });
                // }
            }
            payload = ctrl.requests;
            // var payload = compileOffers();
            if (payload) {
                ctrl.buttonsDisabled = true;
                groupOfRequestsModel.saveSupplierCard(payload).then((data) => {
                    ctrl.buttonsDisabled = false;
                    addFirstAdditionalCost(null);
                    $rootScope.$broadcast('supplierCardChangedData', ctrl.requests);
                }).catch((reason) => {
                    ctrl.buttonsDisabled = false;
                    addFirstAdditionalCost(null);
                });
            } else {
                toastr.error(VALIDATION_MESSAGES.INVALID_FIELDS + ctrl.invalidFields.join(', '));
                addFirstAdditionalCost(null);
            }
        };
	    console.log('SellerCardController');
    }
]);

angular.module('shiptech.pages').component('sellerCard', {
    templateUrl: 'components/blade/templates/seller-card-component.html',
    controller: 'SellerCardController',
    bindings: {
        placement: '<',
        source: '<',
        activerequestid: '<',
        bladeinfo: '<',
        saveCard: '&',
    }
});
