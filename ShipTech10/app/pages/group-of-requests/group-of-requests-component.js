angular.module("shiptech.pages").controller("GroupOfRequestsController", [
    "$scope",
    "$rootScope",
    "$element",
    "$compile",
    "$attrs",
    "$timeout",
    "$interval",
    "$uibModal",
    "$templateCache",
    "$listsCache",
    "$filter",
    "$state",
    "$stateParams",
    "$http",
    "Factory_Master",
    "STATE",
    "API",
    "SCREEN_ACTIONS",
    "screenActionsModel",
    "uiApiModel",
    "lookupModel",
    "groupOfRequestsModel",
    "newRequestModel",
    "tenantService",
    "notificationsModel",
    "LOOKUP_TYPE",
    "LOOKUP_MAP",
    "SCREEN_LAYOUTS",
    "SELLER_SORT_ORDER",
    "EMAIL_TRANSACTION",
    "CUSTOM_EVENTS",
    "MOCKUP_MAP",
    "PACKAGES_CONFIGURATION",
    "screenLoader",
    "listsModel",
    "$tenantSettings",
    "$sce",
    function ($scope, $rootScope, $element, $compile, $attrs, $timeout, $interval, $uibModal, $templateCache, $listsCache, $filter, $state, $stateParams, $http, Factory_Master, STATE, API, SCREEN_ACTIONS, screenActionsModel, uiApiModel, lookupModel, groupOfRequestsModel, newRequestModel, tenantService, notificationsModel, LOOKUP_TYPE, LOOKUP_MAP, SCREEN_LAYOUTS, SELLER_SORT_ORDER, EMAIL_TRANSACTION, CUSTOM_EVENTS, MOCKUP_MAP, PACKAGES_CONFIGURATION, screenLoader, listsModel, $tenantSettings, $sce) {
        $scope.STATE = STATE;
        var ctrl = this;
        var groupId = $stateParams.groupId;
        var group = $stateParams.group;
        ctrl.groupId = $stateParams.groupId;
        $state.params.title = "Group of Requests";
        ctrl.req_cards = "big";
        ctrl.active_prod = {};
        ctrl.LOOKUP_TYPE = LOOKUP_TYPE;
        ctrl.SCREEN_ACTIONS = SCREEN_ACTIONS;
        ctrl.SELLER_SORT_ORDER = SELLER_SORT_ORDER;
        // ctrl.sellerSortOrder = SELLER_SORT_ORDER.RATING;
        ctrl.packagesConfigurationEnabled = PACKAGES_CONFIGURATION.ENABLED;
        ctrl.requirements = [];
        ctrl.dataLoaded = false;
        ctrl.listsCache = $listsCache;
        ctrl.lists = $listsCache;
        ctrl.requirementsToRequote = [];
        ctrl.isEnergyCalculationRequired = true;
        $scope.tenantSetting = $tenantSettings;
        ctrl.tenantSetting = $tenantSettings;
        tenantService.tenantSettings.then(function (settings) {
            ctrl.quoteByCurrency = settings.payload.tenantFormats.currency;
            ctrl.quoteByTimezone = settings.payload.tenantFormats.timeZone;
            ctrl.numberPrecision = settings.payload.defaultValues;
            ctrl.isEnergyCalculationRequired = settings.payload.defaultValues.isEnergyCalculationRequired;
            ctrl.includeAverageSurveyorCharge = settings.payload.defaultValues.includeAverageSurveyorCharge;
            ctrl.averageSurveyorCost = settings.payload.defaultValues.averageSurveyorCost;
            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
            ctrl.tenantFormats = settings.payload.tenantFormats;
            //ctrl.needSupplierQuote = settings.payload.
        });
        tenantService.procurementSettings.then(function (settings) {
            ctrl.needSupplierQuote = settings.payload.offer.needSupplierQuoteValidityDateExpiry;
            ctrl.isSkipRfqAllowed = settings.payload.offer.isSkipRfqAllowed;
            ctrl.allowAddNewContact = settings.payload.request.allowAddNewContact;
            ctrl.isOfferReviewMandatory = settings.payload.offer.isOfferReviewMandatory;
            ctrl.isQuoteDateAutoPopulated = settings.payload.offer.isQuoteDateAutoPopulated;
            ctrl.isQuoteByEndDateValidated = settings.payload.offer.isQuoteByEndDateValidated;
            ctrl.commentsDefaultView = settings.payload.offer.commentsDefaultView;
            ctrl.bestTcoDefaultView = settings.payload.offer.bestTcoDefaultView;
            ctrl.priceDetailsDefaultView = settings.payload.offer.priceDetailsDefaultView;
            ctrl.sellerHistoryVisibility = settings.payload.offer.sellerHistoryVisibility.id;
            ctrl.counterpartyCommentsVisibility = settings.payload.offer.counterpartyCommentsVisibility.id;
            ctrl.fieldVisibility = settings.payload.fieldVisibility;
            // ctrl.displayNoOfSellers = settings.payload.offer.noOfSellersForDisplay;  -- this is not used anymore
            ctrl.counterpartyTypeFilters = settings.payload.request.counterpartyTypeFilters;
            ctrl.noOfCounterpartiesToDisplay = settings.payload.offer.numberOfCounterpartiesToDisplay;

            ctrl.displayAdditionalCostColumn = !settings.payload.fieldVisibility.isAdditionalCostHidden;
            ctrl.totalColumnIsHidden = settings.payload.fieldVisibility.isNegotiationTotalHidden;
            ctrl.negotiationDisplayDecimal = settings.payload.request.negotiationDisplayDecimal.id == 1;
        });
        ctrl.offers = [];
        ctrl.sellerTypeCheckboxes = {};
        ctrl.internalComments = null;
        ctrl.externalComments = null;
        ctrl.sellerAutocompleteList = [];
        ctrl.newSeller = [];
        ctrl.requirementRequestProductIds = [];
        ctrl.confirmationProductOffers = [];
        ctrl.delinkIds = [];
        ctrl.requestCheckboxes = [];
        ctrl.groupId = groupId;
        ctrl.lookupInput = null;
        ctrl.rfqSent = false;
        ctrl.isSellerHistoryExpanded = false;
        ctrl.commentsSectionIsExpanded = false;
        ctrl.allExpanded = false;
        ctrl.buttonsDisabled = true;
        ctrl.notificationCount = 0;
        if (typeof ctrl.blade == "undefined") {
            ctrl.blade = {};
        }

        var alreadySaved = [];
  
        //handler for filtering on request status
        $scope.$on(CUSTOM_EVENTS.NOTIFICATION_RECEIVED, function (event, notification) {
            var requestNotification = null;
            ctrl.notificationCount = 0;
            for (var i = 0; i < notification.length; i++) {
                requestNotification = notification[i];
                if (ctrl.requests) {
                    for (var j = 0; j < ctrl.requests.length; j++) {
                        if (ctrl.requests[j].id == requestNotification.RequestId) {
                            ctrl.notificationCount += requestNotification.TotalNoOfUnreadOffers;
                        }
                    }
                }
            }
        });

        ctrl.initScreenAfterSendOrSkipRfq = function() {
	        	$(".checkAllOnLocation").prop("checked", false);
                ctrl.requirements = [];
                ctrl.selectedNoQuoteItems = [];
                ctrl.requirementRequestProductIds = [];
                groupOfRequestsModel.getGroup(groupId).then(function (data) {
                	if (data.payload[0].requestGroup.customNonMandatoryAttribute1) {
                		ctrl.sellerSortOrder = data.payload[0].requestGroup.customNonMandatoryAttribute1
                	} else {
                		ctrl.sellerSortOrder = SELLER_SORT_ORDER.ALPHABET
                	}
                    parseRequestList(data.payload, false, false, true);
                    // initializeDataArrays(data.payload);
                    getGroupInfo(groupId);
                    ctrl.priceInputsDisabled = false;
                });

                function getGroupInfo(groupId) {
                    groupOfRequestsModel.getGroupInfo(groupId).then(function (data) {
                    	if (data.payload.internalComments) {
                            ctrl.internalComments = data.payload.internalComments.replace(/<br\s?\/?>/g,"\n");
                    	}
                    	if (data.payload.externalComments) {
                            ctrl.externalComments = data.payload.externalComments.replace(/<br\s?\/?>/g,"\n");
                    	}
                        console.log(data.payload);
                        if (data.payload.quoteByCurrency !== null) {
                            ctrl.setQuoteByCurrency(data.payload.quoteByCurrency.id, data.payload.quoteByCurrency.name);
                        }
                        if (data.payload.quoteByTimeZone !== null) {
                            ctrl.setQuoteByTimezone(data.payload.quoteByTimeZone.id, data.payload.quoteByTimeZone.name);
                        }
                        ctrl.quoteByDate = data.payload.quoteByDate;
                        ctrl.quoteByDateFrom = data.payload.quoteByDateFrom;
                        if (ctrl.quoteByDateFrom == "" || ctrl.quoteByDateFrom == null) {
                            var d = new Date();
                            month = d.getMonth() + 1;
                            day = d.getDate();
                            hours = d.getHours();
                            minutes = d.getMinutes();
                            seconds = d.getSeconds();
                            if (month < 10) month = "0" + month;
                            if (day < 10) day = "0" + day;
                            if (hours < 10) hours = "0" + hours;
                            if (minutes < 10) minutes = "0" + minutes;
                            if (seconds < 10) seconds = "0" + seconds;
                            if (ctrl.isQuoteDateAutoPopulated) {
                                ctrl.quoteByDateFrom = d.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
                            }
                        }
                        ctrl.isReviewed = data.payload.isReviewed;
                    });
                }
        }

        // Get the UI settings from server. When complete, get business data.
        ctrl.initScreen = function () {
            uiApiModel.get(SCREEN_LAYOUTS.GROUP_OF_REQUESTS).then(function (data) {
                ctrl.ui = data;
                ctrl.screenActions = uiApiModel.getScreenActions();
                //Normalize relevant data for use in the template.
                ctrl.generalInfoFields = normalizeArrayToHash(ctrl.ui.GeneralInformation.fields, "name");
                ctrl.bestOfferColumns = normalizeArrayToHash(ctrl.ui.BestOffer.columns, "name");
                ctrl.requirements = [];
                ctrl.requirementRequestProductIds = [];
                // Get the generic data Lists.
                
                ctrl.sellerTypeIds = getSellerTypeIds();
                lookupModel.getSellerAutocompleteList(ctrl.sellerTypeIds).then(function (server_data) {
                    ctrl.sellerAutocompleteList = server_data.payload;
                });
                lookupModel.getSellerAutocompleteList(["1"]).then(function (server_data) {
                    ctrl.physicalSupplierList = server_data.payload;
                });
                lookupModel.getSellerAutocompleteList(["3"]).then(function (server_data) {
                    ctrl.brokerList = server_data.payload;
                });
                // Get the lookup list for the Request field in the General Information section.
                groupOfRequestsModel.getRequests().then(function (data) {
                    ctrl.autocompleteRequest = data.payload;
                    $timeout(function () {
                        initializeLookupInputs();
                    });
                });
                // Get the business data.
                groupOfRequestsModel.getGroup(groupId).then(function (data) {
                	if (data.payload[0].requestGroup.customNonMandatoryAttribute1) {
                		ctrl.sellerSortOrder = data.payload[0].requestGroup.customNonMandatoryAttribute1
                	} else {
                		ctrl.sellerSortOrder = SELLER_SORT_ORDER.ALPHABET
                	}
                    parseRequestList(data.payload, false);
                    initializeDataArrays(data.payload);
                    getGroupInfo(groupId);
                    ctrl.priceInputsDisabled = false;
                });

                function getGroupInfo(groupId) {
                    groupOfRequestsModel.getGroupInfo(groupId).then(function (data) {
                    	if (data.payload.internalComments) {
                            ctrl.internalComments = data.payload.internalComments.replace(/<br\s?\/?>/g,"\n");
                    	}
                    	if (data.payload.externalComments) {
                            ctrl.externalComments = data.payload.externalComments.replace(/<br\s?\/?>/g,"\n");
                    	}
                        console.log(data.payload);
                        if (data.payload.quoteByCurrency !== null) {
                            ctrl.setQuoteByCurrency(data.payload.quoteByCurrency.id, data.payload.quoteByCurrency.name);
                        }
                        if (data.payload.quoteByTimeZone !== null) {
                            ctrl.setQuoteByTimezone(data.payload.quoteByTimeZone.id, data.payload.quoteByTimeZone.name);
                        }
                        ctrl.quoteByDate = data.payload.quoteByDate;
                        ctrl.quoteByDateFrom = data.payload.quoteByDateFrom;
                        if (ctrl.quoteByDateFrom == "" || ctrl.quoteByDateFrom == null) {
                            var d = new Date();
                            month = d.getMonth() + 1;
                            day = d.getDate();
                            hours = d.getHours();
                            minutes = d.getMinutes();
                            seconds = d.getSeconds();
                            if (month < 10) month = "0" + month;
                            if (day < 10) day = "0" + day;
                            if (hours < 10) hours = "0" + hours;
                            if (minutes < 10) minutes = "0" + minutes;
                            if (seconds < 10) seconds = "0" + seconds;
                            if (ctrl.isQuoteDateAutoPopulated) {
                                ctrl.quoteByDateFrom = d.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
                            }
                        }
                        ctrl.isReviewed = data.payload.isReviewed;
                    });
                }
            });
        };
        ctrl.initScreen();
        /**
         * Initializes various data needed by the template, parses request list to group requests.
         * @param {Array} requestList - The list of requests for which we need info.
         */
        function parseRequestList(requestList, remodel, skipSellerSorting, skipBestCalls) {
            // Remodel requests object after change in database structure
            // console.clear();
            // console.log(requestList);
            if (remodel) {
                requestList = $scope.remodelSellersStructure(requestList);
            }
            // END Remodel requests object after change in database structure
            // console.log(requestList);
            // debugger;
            ctrl.requests = requestList;
            ctrl.requestTabs = createRequestTabs(ctrl.requests);
            //Initialize the ETAs.
            ctrl.etas = calcETAs(ctrl.requests);
            // Initialize array of selected requests.
            ctrl.selectedRequests = ctrl.requests;
            // Get the Best Offer data. - Deprecated - Now we use getBestTco

            //

            // initialize the various data arrays needed by the template
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        prodV.requestId = reqV.id;
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            seller = sellerV;
                            uniqueIdentifier = seller.sellerCounterparty.id + "-null";
                            packageType = "individual";
                            if (typeof seller.offers != "undefined") {
                                if (seller.offers.length > 0) {
                                    if (seller.offers[0].physicalSupplierCounterparty) {
                                        uniqueIdentifier = seller.sellerCounterparty.id + "-" + seller.offers[0].physicalSupplierCounterparty.id;
                                    }
                                    if (!seller.offers[0].packageId) {
                                        packageType = "individual";
                                    } else {
                                        if (seller.offers[0].isSurrogatePackage) {
                                            packageType = "buyer";
                                        } else {
                                            packageType = "seller";
                                        }
                                    }
                                    if (sellerV.offers[0].quotedProduct.id != prodV.product.id) {
							            listsModel.getProductTypeByProduct(sellerV.offers[0].quotedProduct.id).then(function(server_data) {
		                                    sellerV.offers[0].quotedProductGroupId = server_data.data.payload.productTypeGroup.id;
							            })                                    
                                    } else {
	                                    sellerV.offers[0].quotedProductGroupId = prodV.productTypeGroupId;
                                    }
                                    seller.packageId = seller.offers[0].packageId;
                                }
                            }
                            seller.randUniquePkg = ctrl.calculateRandUniquePkg(sellerV);
                            // seller.randUniquePkg = uniqueIdentifier + '-' + packageType;
                            seller.packageType = packageType;
                            seller.randUnique = uniqueIdentifier;
                        });
                    });
                });
            });
            initializeDataArrays(ctrl.requests, skipSellerSorting);
            requestGroupProductIds = getRequestGroupProductIdsCSV(ctrl.requests);
            if (!skipBestCalls) {
	            groupOfRequestsModel.getBestOffer(requestGroupProductIds).then(function (data) {
	                ctrl.bestOfferData = data.payload;
	            });
	            groupOfRequestsModel.getBestTco(requestGroupProductIds, ctrl.groupId).then(function (data) {
	                ctrl.bestTcoData = data.payload;
	                ctrl.bestTcoData = $scope.modelBestTCODataForTemplating(ctrl.bestTcoData);
	                ctrl.mySelection = data.payload.mySelection.quotations;
	                ctrl.mySelectionSurveyorCost = data.payload.mySelection.averageSurveyorCost;
	            });
            }

            ctrl.setPageTitle();
        }
        ctrl.calculateRandUniquePkg = function (seller) {
            physicalSupplierId = null;
            packageType = "individual";
            packageId = null;
            if (typeof seller.offers != "undefined") {
                if (seller.offers.length > 0) {
                    if (seller.offers[0].physicalSupplierCounterparty) {
                        physicalSupplierId = seller.offers[0].physicalSupplierCounterparty.id;
                    }
                    if (!seller.offers[0].packageId) {
                        packageType = "individual";
                    } else {
                        packageId = seller.offers[0].packageId;
                        if (seller.offers[0].isSurrogatePackage) {
                            packageType = "buyer";
                        } else {
                            packageType = "seller";
                        }
                    }
                }
            }
            randUniquePkg = seller.sellerCounterparty.id + "-" + physicalSupplierId + "-" + packageType + "-" + packageId;
            return randUniquePkg;
        };
        $scope.remodelSellersStructure = function (requestList) {
            // return requestList;
            // here we remodel the data to fit current FE implementation after BE structure changes
            $.each(requestList, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        if (typeof prodV.sellersCopy == "undefined") {
                            prodV.sellersCopy = [];
                        }
                        $.each(prodV.sellers, function (selK, selV) {
                            if (selV.offers) {
                                if (selV.offers.length > 0) {
                                    $.each(selV.offers, function (offK, offV) {
                                        prodV.sellersCopy.unshift(angular.copy(selV));
                                    });
                                } else {
                                    prodV.sellersCopy.unshift(angular.copy(selV));
                                }
                            } else {
                                prodV.sellersCopy.unshift(angular.copy(selV));
                            }
                            $.each(prodV.sellersCopy, function (sck, scv) {
                                if (scv.id == selV.id) {
                                    scv.offers = [];
                                }
                            });
                        });
                        $.each(prodV.sellersCopy, function (sck, scv) {
                            offersToBeAdded = [];
                            $.each(prodV.sellers, function (selK, selV) {
                                if (selV.offers) {
                                    if (selV.offers.length > 0) {
                                        $.each(selV.offers, function (offK, offV) {
                                            offersToBeAdded.unshift(angular.copy(offV));
                                        });
                                    }
                                } else {
                                    offersToBeAdded.unshift(angular.copy(offV));
                                }
                            });
                        });
                        $.each(prodV.sellersCopy, function (sck, scv) {
                            $.each(offersToBeAdded, function (offk, offv) {
                                if (scv.offers.length == 0 && !offv.wasAdded) {
                                    scv.offers[0] = offv;
                                    offv.wasAdded = true;
                                }
                            });
                        });
                        // console.log(offersToBeAdded);
                        prodV.sellers = prodV.sellersCopy;
                    });
                });
            });
            return requestList;
        };

        function getSellerTypeIds() {
            var sellerIdList = [];
            for (var sellerType in ctrl.sellerTypeCheckboxes) {
                if (ctrl.sellerTypeCheckboxes[sellerType] === true) {
                    filtered = $filter("filter")(ctrl.lists.CounterpartyType, {
                        name: sellerType
                    })[0];
                    if (typeof filtered != "undefined") {
                        sellerIdList.push(filtered.id);
                    }
                }
            }
            return sellerIdList;
        }
        // Gets the ACTUAL groupId from the first request in the payload,
        // useful for groups being created anew (there's no groupId in the URL/$scope).
        function getGroupId() {
            if (!ctrl.requests[0]) {
                return -1;
            }
            return ctrl.requests[0].requestGroup.id;
        }
        /**
         * Initializes screenactions (buttons) according to possible actions and request actions
         */
        ctrl.calculateScreenActions = function () {
            if (!ctrl.requests) {
                return false;
            }
            var requestProducts = [];
            var product, requestActions;
            // Iterate Requests and their respective locations and products to extract actions.
            for (var i = 0; i < ctrl.requests.length; i++) {
                for (var j = 0; j < ctrl.requests[i].locations.length; j++) {
                    for (var k = 0; k < ctrl.requests[i].locations[j].products.length; k++) {
                        product = ctrl.requests[i].locations[j].products[k];
                        if (
                            $filter("filter")(requestProducts, {
                                id: product.id
                            }).length === 0
                        ) {
                            if (productHasRequirements(product.id)) {
                                requestProducts.push(product);
                            }
                        }
                    }
                }
            }
            requestActions = screenActionsModel.getActionsFromProductList(requestProducts);
            if (requestActions) {
                ctrl.screenActions = screenActionsModel.intersectActionLists(uiApiModel.getScreenActions(), requestActions);
            }
            ctrl.buttonsDisabled = false;
        };
        /**
         * return a list of all request ids
         * @param {Array} requests - The list of requests for which we need info.
         */
        function getRequestIds(requests) {
            var requestIds = [];
            for (var i = 0; i < requests.length; i++) {
                requestIds.push(requests[i].id);
            }
            return requestIds;
        }
        /**
         * Initializes the various data arrays needed by the template.
         * @param {Array} requests - The list of requests for which we need info.
         */
        function initializeDataArrays(requests, skipSellerSorting) {
            productIds = getRequestGroupProductIdsCSV(requests);
            counterpatyIds = getRequestGroupCounterpartyIdsCSV(requests);
            if (!skipSellerSorting) {
	            groupOfRequestsModel.getSellersSorted(counterpatyIds, productIds, ctrl.sellerSortOrder).then(function (data) {
	                if (data.payload !== null) {
	                    ctrl.sellers = normalizeArrayToHash(data.payload, "counterpartyId");
	                    ctrl.sellerOrder = getSellerOrder(data.payload);
	                }
	                ctrl.locations = getLocationsFromRequests(requests);
	                ctrl.groupLocationsByUniqueLocationIdentifier()
	                ctrl.products = getAllRequestProductList(requests);
	                setRequestProductCount(requests);
	                //initialize notifications
	                notificationsModel.stop();
	                notificationsModel.start(getRequestIds(requests));
	                //calculates screen actions
	                ctrl.calculateScreenActions();
	            });
			}
        }
        /**
         * Initializes the lookup input fields in the template.
         * TODO: Can this be automated by iterating the UI fields?
         */
        function initializeLookupInputs() {
            bindTypeahead("#id_Request", normalizeJSONRequestsLookupData(ctrl.autocompleteRequest), requestTypeaheadChange);
            // bindTypeahead('#id_Seller',
            //              normalizeJSONRequestsLookupData(ctrl.sellerAutocompleteList),
            //              sellerTypeaheadChange);
        }
        /**
         * Bind Twitter Typeahead functionality to a given input.
         * @param {*} selector - A valid jQuery selector.
         * @param {Array} list - The lookup list, in which to search.
         * @param {function} cb - A callback function to call when user selects an option.
         */
        function bindTypeahead(selector, list, cb) {
            var element = $(selector);
            element
                .typeahead(
                    {
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },
                    {
                        source: lookupModel.substrMatcher(list),
                        limit: 5
                    }
                )
                .bind("typeahead:select", function (event, suggestion) {
                    if (cb) {
                        cb(event, suggestion);
                    }
                });
        }

        ctrl.displayNumberOfRowsNegTable = function () {
            data = [
                {
                    value: 3,
                    name: "3"
                },
                {
                    value: 5,
                    name: "5"
                },
                {
                    value: 10,
                    name: "10"
                },
                {
                    value: 999,
                    name: "All"
                }
            ];
            return data;
        };
        /**
         * Gets a Request object by its name, from the autocompleteRequest array.
         * @param {String} name - The Request name.
         * @return {Object} - The Request object, if found.
         */
        function getRequestByName(name) {
            for (var i = 0; i < ctrl.autocompleteRequest.length; i++) {
                if (ctrl.autocompleteRequest[i].name === name) {
                    return ctrl.autocompleteRequest[i];
                }
            }
        }
        /**
         * Adds a Request to the ctrl.selectedRequests array.
         * @param {String} - A Request object name.
         */
        function addRequest(requestsList) {
            groupOfRequestsModel.getRequests().then(function (data) {
                payloadRequestList = _.uniq(_.map(requestsList, 'requestId'))
                
                if (typeof(requestsList) == "string") {
                	requestName = requestsList;
	                ctrl.autocompleteRequest = data.payload;
	            
	                if(alreadySaved.indexOf(requestName) != -1){
	                    return;
	                }

	                alreadySaved.push(requestName);

	                var request = getRequestByName(requestName);
	                if (request.id) {
	                	var request = request.id;
	                }
                	payloadRequestList = [request];
                }
                

                groupOfRequestsModel.addRequestsToGroup(payloadRequestList, groupId).then(function (newRequestData) {
                    if (newRequestData.payload) {
                        newRequestAddedData = $scope.remodelSellersStructure(newRequestData.payload);
                        // newRequestAddedData = newRequestData.payload;
                        for (var i = 0; i < newRequestAddedData.length; i++) {
                            ctrl.requests.unshift(newRequestAddedData[i]);
                        }
                        ctrl.prefferedSellerCheckbox = true;
                        ctrl.requestTabs = createRequestTabs(ctrl.requests);
                        initializeDataArrays(ctrl.requests);
                        parseRequestList(ctrl.requests, false);
                        $timeout(function(){
	                        ctrl.prefferedSellerCheckbox = false;
                        },50)

	                    groupOfRequestsModel.getGroupInfo(groupId).then(function (data) {
	                    	if (data.payload.internalComments) {
	                            ctrl.internalComments = data.payload.internalComments.replace(/<br\s?\/?>/g,"\n");
	                    	}
	                    	if (data.payload.externalComments) {
	                            ctrl.externalComments = data.payload.externalComments.replace(/<br\s?\/?>/g,"\n");
	                    	}
	                    });

                    }
                }).finally(function(){
                });
            });
        }
        /**
         * Handles changes in the Request input typeahead.
         */
        function requestTypeaheadChange(event, suggestion) {
            // Add the request named 'suggestion'.
            addRequest(suggestion);
            // Clear the input.
            $(event.target).typeahead("val", "");
        }

        function sellerTypeaheadChange(event, suggestion) { }
        /**
         * Get the minimum and nmaximum ETAs from the group of Requests.
         * @param {Requests[]} requests - An array of Requests to search in.
         * @return {Object} An object with the "from" and "to" ETAs as properties.
         */
        function calcETAs(requests) {
            var dates = [];
            // Iterate Requests and their respective locations to extract ETAs.
            for (var i = 0; i < requests.length; i++) {
                for (var j = 0; j < requests[i].locations.length; j++) {
                    dates.push(moment.utc(requests[i].locations[j].eta));
                }
            }
            return {
                etaFrom: moment.min(dates).format("MM/DD/YYYY HH:mm"),
                etaTo: moment.max(dates).format("MM/DD/YYYY HH:mm")
            };
        }
        /**
         * Retrieves a CSV string made of the IDs of the products in all Requests in the Group.
         * @param {Requests[]} requests - An array of Requests (the Requests group).
         * @return {String} Product IDs as a CSV string.
         */
        function getRequestGroupProductIdsCSV(requests) {
            var ids = getRequestGroupProductIds(requests);
            return ids.join(",");
        }
        /**
         * Retrieves an array made of the IDs of the products in all Requests in the Group.
         * @param {Requests[]} requests - An array of Requests (the Requests group).
         * @return {Array} Product IDs list
         */
        function getRequestGroupProductIds(requests) {
            var ids = [];
            // Iterate Requests and their respective locations and products to extract ETAs.
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        for (var k = 0; k < requests[i].locations[j].products.length; k++) {
                            ids.push(requests[i].locations[j].products[k].id);
                        }
                    }
                }
            }
            return ids;
        }
        /**
         * Retrieves an array made of the IDs of the counterparties in all Requests in the Group.
         * @param {Requests[]} requests - An array of Requests (the Requests group).
         * @return {Array} Counterparty IDs list
         */
        function getRequestGroupCounterpartyIdsCSV(requests) {
            var ids = [];
            var counterpartyId = -1;
            var counterparty = null;
            // Iterate Requests and their respective locations and products to extract ETAs.
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        for (var k = 0; k < requests[i].locations[j].products.length; k++) {
                            for (var m = 0; m < requests[i].locations[j].products[k].sellers.length; m++) {
                                counterparty = requests[i].locations[j].products[k].sellers[m];
                                if (counterparty) {
                                    counterpartyId = requests[i].locations[j].products[k].sellers[m].sellerCounterparty.id;
                                }
                                if (ids.indexOf(counterpartyId) === -1) {
                                    ids.push(counterpartyId);
                                }
                            }
                        }
                    }
                }
            }
            return ids.join();
        }
        /**
         * Get the list of locations from the group of Requests.
         * @param {Requests[]} requests - An array of Requests to search in.
         * @return {Requests[]} locations - A list of locations.
         */
        function getLocationsFromRequests(requests) {
            var buildedLocations = [];
            ctrl.locations = [];
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        requests[i].locations[j].requestsIds = [];
                    }
                }
            }
            locationStart = 1000;

            $.each(requests, function(rk,rv){
            	rv.locations = $filter("orderBy")(rv.locations, "-recentEta", true);
            	rv.firstRecentEta = rv.locations.length > 0 ? rv.locations[0].recentEta : null;
            })
        	requests = $filter("orderBy")(requests, "-firstRecentEta", true);
        	// ctrl.selectedRequests = $filter("orderBy")(ctrl.requests, "-firstRecentEta", true);

            // Iterate Requests and their respective locations to extract ETAs.
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        requests[i].locations[j].requestId = requests[i].id;
                        uniqueLocationIdentifier = locationStart.toString();
                        locationStart ++;
                            // .toString(36)
                            // .substr(2, 6);
                        requests[i].locations[j].uniqueLocationIdentifier = uniqueLocationIdentifier;
                        availableBuildedLocationKey = -1;
                        if (buildedLocations.length > 0) {
                            isNewLocation = true;
                            $.each(buildedLocations, function (buildedLocationKey, buildedLocationValue) {
                                if (buildedLocationValue.location.id == requests[i].locations[j].location.id) {
                                    isNewLocation = false;
                                    if (buildedLocationValue.requestsIds.indexOf(requests[i].locations[j].requestId) == -1) {
                                        if (availableBuildedLocationKey == -1) {
                                            availableBuildedLocationKey = buildedLocationKey;
                                        }
                                    }
                                }
                            });
                        }
                        console.log(availableBuildedLocationKey);
                        if (availableBuildedLocationKey == -1) {
                            if (typeof requests[i].locations[j].requestsIds == "undefined") {
                                requests[i].locations[j].requestsIds = [];
                            }
                            requests[i].locations[j].requestsIds.push(requests[i].id);
                        } else {
                            buildedLocations[availableBuildedLocationKey].requestsIds.push(requests[i].id);
                            requests[i].locations[j].requestsIds = buildedLocations[availableBuildedLocationKey].requestsIds;
                            requests[i].locations[j].uniqueLocationIdentifier = buildedLocations[availableBuildedLocationKey].uniqueLocationIdentifier;
                        }
                        buildedLocations.push(requests[i].locations[j]);
                        // locations.push(requests[i].locations[j]);
                    }
                }
            }
            return $filter("orderBy")(buildedLocations, "-location.name", true);
        }

ctrl.setProductData = function(data, loc) {
	return data;
}


        /**
         * Get the list of all products from the requests in the group. Group them according to their requests
         * @param {Requests[]} requests - An array of Requests to search in.
         */
        function getAllRequestProductList(requests) {
            var products = [];
            var product, requestProducts, productInList;
            // Iterate Requests and their respective locations and products to extract ETAs.
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    requestProducts = [];
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        currentProducts = [];
                        for (var k = 0; k < requests[i].locations[j].products.length; k++) {
                            product = requests[i].locations[j].products[k];
                            //if product not already in list
                            // filter = $filter("filter")(requestProducts, {
                            //     product: {
                            //         name: product.product.name,
                            //         id: product.product.id
                            //     }
                            // });
                            // filter = $filter("filter")(requestProducts, {id});                            
                            reuseProductFlag = -1;
                            $.each(requestProducts, function(rpk,rpv) {
                                // check if this product cand be displayed on a column of a previous product
                                if ((rpv.product.id == product.product.id) && ((rpv.requestLocationId != requests[i].locations[j].location.id)))
                                {
                                    if (typeof(rpv.productLocations["L" + requests[i].locations[j].uniqueLocationIdentifier]) == "undefined")
                                         reuseProductFlag = rpk;
                                }
                            	currentProducts.push(rpv.id);
                            })	

                        	if (currentProducts.indexOf(product.id) == -1) {
                                if (reuseProductFlag >= 0)
                                {
                                    // add the current product to a previous product column
                                    requestProducts[reuseProductFlag].productLocations["L" + requests[i].locations[j].uniqueLocationIdentifier] = product;
                                }
                                else
                                {
                                    product.requestId = requests[i].id;
                                    product.productLocations = [];
                                    product.productLocations["L" + requests[i].locations[j].uniqueLocationIdentifier] = product;
                                    requestProducts.push(product);
                                }
                        	}

                            // productInList = filter.length > 0;
                            // if (!productInList) {
                            //     //save request Id in product so we know where it comes from
                            //     product.requestId = requests[i].id;
                            //     requestProducts.push(product);
                            // }
                        }
                    }
                    products.push(requestProducts);
                    requests[i].newProductCount = requestProducts.length;	
                }
            }
            return products;
        }
        //set number of distinct products on each request
        function setRequestProductCount(requests) {
            var requestProductList, productCount;
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    productCount = 0;
                    requestProductList = [];
                    // productsOnLocationsCount = [];
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        for (var k = 0; k < requests[i].locations[j].products.length; k++) {
                            product = requests[i].locations[j].products[k];
                            if (
                                $filter("filter")(requestProductList, {
                                    id: product.id
                                }).length === 0
                            ) {
                                productCount++;
                                requestProductList.push(product);
                            }
                            // $.each(product.productLocations, function(prlk,prlv){
                            // 	productsOnLocationsCount.push("P" + prlv.product.id + prlv )
                            // })
                        }
                    }
                    requests[i].productCount = productCount;
                }
            }
        }
        /**
         * create a tab object for each request
         * @param {Requests[]} requests - An array of Requests to search in.
         */
        function createRequestTabs(requests) {
            var tabs = [];
            var requestTab;
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    requestTab = {
                        name: requests[i].name,
                        expanded: false
                    };
                    tabs.push(requestTab);
                }
            }
            return tabs;
        }
        /**
         * add a new seller to each product in the locations provided
         * @param {Object} seller - the new seller object
         * @param {Array} locations - the locations
         */
        ctrl.addSellerToLocations = function (sellerId, locations) {
            //get seller csv
            var product, newCounterparty, newSeller;
            var counterpatyIds = getRequestGroupCounterpartyIdsCSV(ctrl.requests);
            var productIds = [];
            $.each(locations[0].products, function (pk, pv) {
                productIds.push(pv.id);
            });
            getSellersSortedPayload = {
                RequestProductList: productIds.join(","),
                RequestGroupId: ctrl.groupId,
                LocationId: locations[0].location.id,
                RequestSellerId: sellerId
            };
            if (ctrl.sellerIsAlreadyOnLocation(sellerId, locations[0].uniqueLocationIdentifier)) {
                return toastr.error("The selected seller is already present on that location");
            }
            groupOfRequestsModel.addSeller(getSellersSortedPayload).then(function (data) {
                if (data.isSuccess) {
                    ctrl.newSeller = [];
                    ctrl.initScreen();
                    return false;
                    counterpatyIds += "," + sellerId;
                    //get sellers object info
                    groupOfRequestsModel.getSellersSorted(counterpatyIds, productIds, ctrl.sellerSortOrder).then(function (data) {
                        ctrl.sellers = normalizeArrayToHash(data.payload, "counterpartyId");
                        ctrl.sellerOrder = getSellerOrder(data.payload);
                        randomUnique = Math.random()
                            .toString(36)
                            .substr(2, 6);
                        newCounterparty = {};
                        $.each(data.payload, function (k, v) {
                            if (v.counterpartyId == sellerId) {
                                newCounterparty = v;
                            }
                        });
                        // newCounterparty = angular.copy($filter("filter")(data.payload, {
                        //     counterpartyId: sellerId
                        // }));
                        sellerIsAlreadyAddedToLocation = false;
                        if (ctrl.sellerIsAlreadyOnLocation(sellerId, locations[0].uniqueLocationIdentifier)) {
                            return toastr.error("The selected seller is already present on that location");
                        }
                        // if (newCounterparty || typeof(newCounterparty) == 'undefined') {
                        for (var i = 0; i < locations.length; i++) {
                            for (var j = 0; j < locations[i].products.length; j++) {
                                product = locations[i].products[j];
                                // if (!ctrl.productHasSeller(product, newCounterparty.counterpartyId)) {
                                newSeller = {
                                    rfq: null
                                };
                                newSeller.requestLocationId = locations[i].id;
                                newSeller.requestProductId = product.id;
                                newSeller.isCloned = true;
                                newSeller.offers = [
                                    {
                                        physicalSupplierCounterparty: null
                                    }
                                ];
                                newSeller.randUnique = randomUnique + "-null";
                                newSeller.randUniquePkg = randomUnique + "-null-individual-null";
                                newSeller.packageType = "individual";
                                newSeller.sellerCounterparty = {
                                    id: newCounterparty.counterpartyId,
                                    name: newCounterparty.counterpartyName
                                };
                                product.sellers.push(newSeller);
                                // } else {
                                // sellerIsAlreadyAddedToLocation = true;
                                // }
                            }
                        }
                        // }
                        //reset seller inputs template model
                        ctrl.newSeller = [];
                    });
                }
            });
        };
        ctrl.addSellerToAllLocations = function (sellerId, locations) {
            var product, newCounterparty, newSeller;
            var counterpatyIds = getRequestGroupCounterpartyIdsCSV(ctrl.requests);
            var productIds = getRequestGroupProductIdsCSV(ctrl.requests);
            locationsCount = 0;
            ctrl.sellersAddedToAllLocations = 0;
            $.each(ctrl.locations, function (k, v) {
                if (!ctrl.sellerIsAlreadyOnLocation(sellerId, v.uniqueLocationIdentifier)) {
                    locationsCount += 1;
                }
            });
            $.each(ctrl.locations, function (k, v) {
                setTimeout(function () {
                    getSellersSortedPayload = {
                        RequestProductList: productIds,
                        RequestGroupId: ctrl.groupId,
                        LocationId: v.location.id,
                        RequestSellerId: sellerId
                    };
                    if (!ctrl.sellerIsAlreadyOnLocation(sellerId, v.uniqueLocationIdentifier)) {
                        groupOfRequestsModel.addSeller(getSellersSortedPayload).then(function (data) {
                            if (data.isSuccess) {
                                ctrl.sellersAddedToAllLocations += 1;
                                if (ctrl.sellersAddedToAllLocations >= locationsCount) {
                                    ctrl.initScreen();
                                    return false;
                                }
                            }
                        });
                    }
                }, 100);
            });
        };
        ctrl.sellerIsAlreadyOnLocation = function (sellerId, locationUnique) {
            sellerIsInLocation = false;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (locV.uniqueLocationIdentifier == locationUnique) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.sellerCounterparty.id == sellerId) {
                                    sellerIsInLocation = true;
                                }
                            });
                        });
                    }
                });
            });
            return sellerIsInLocation;
        };
        /**
         * callback for selecting a seller from the sellers lookup dialog
         * @param {Object} sellerID - the new seller object id
         */
        ctrl.onSellerSelect = function (sellerId) {
            var locations;
            //get locations
            // if no input saved, add to all locations
            if (ctrl.lookupInput === null) {
                locations = ctrl.locations;
                //if input has been saved, only add to input model location
            } else {
                locations = ctrl.lookupInput;
            }
            ctrl.addSellerToLocations(sellerId, locations);
        };
        ctrl.onSupplierSelect = function (newSupplierData) {
            seller = ctrl.physicalSupplierOpenModalData.seller;
            sellerLocation = ctrl.physicalSupplierOpenModalData.location;
            newSupplier = {
                id: newSupplierData.id,
                name: newSupplierData.name
            };
            ctrl.updatePhysicalSupplierForSellers(seller, newSupplier, sellerLocation);
        };
        ctrl.onBrokerSelect = function (newSupplierData) {
            seller = ctrl.physicalSupplierOpenModalData.seller;
            sellerLocation = ctrl.physicalSupplierOpenModalData.location;
            newSupplier = {
                id: newSupplierData.id,
                name: newSupplierData.name
            };
            ctrl.updateBrokerForSellers(seller, newSupplier, sellerLocation);
        };
        ctrl.changeSellerTypes = function () {
            ctrl.sellerTypeIds = getSellerTypeIds();
            lookupModel.getSellerAutocompleteList(ctrl.sellerTypeIds).then(function (server_data) {
                ctrl.sellerAutocompleteList = server_data.payload;
            });
        };
        /**
         * Save latest lookup input model used
         *
         * @param {object} input - the input model we want to save
         */
        ctrl.setLookupInput = function (input) {
            ctrl.lookupInput = input;
        };
        /**
         * Get latest product offer from seller
         *
         * @param {object} product - product as retrieved from the server
         * @param {array} locations - currentLocation group as retrieved from the server
         * @param {object} sellerId - sellerId we wish to get offer from
         */
        ctrl.getSellerProductOfferOnLocation = function (product, locations, sellerId, sellerObj) {
            var seller;
            var location;
            //get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) { }
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    location = locations[i];
                    break;
                }
            }
            physicalSupplierId = null;
            if (typeof sellerObj.offers != "undefined") {
                if (sellerObj.offers.length > 0) {
                    if (sellerObj.offers[0].physicalSupplierCounterparty) {
                        physicalSupplierId = sellerObj.offers[0].physicalSupplierCounterparty.id;
                    }
                }
            }
            //if there is no matching location. return null offer
            if (!location) {
                return null;
            }
            for (i = 0; i < location.products.length; i++) {
                //productIds should match
                if (location.products[i].product.id === product.product.id) {
                    for (var j = 0; j < location.products[i].sellers.length; j++) {
                        seller = location.products[i].sellers[j];
                        if (seller.sellerCounterparty.id == sellerId) {
                            loopPhysicalSupplierId = null;
                            if (typeof seller.offers != "undefined") {
                                if (seller.offers.length > 0) {
                                    if (seller.offers[0].physicalSupplierCounterparty) {
                                        loopPhysicalSupplierId = seller.offers[0].physicalSupplierCounterparty.id;
                                    }
                                }
                                if (loopPhysicalSupplierId == physicalSupplierId) {
                                    return seller.offers[0];
                                    // return ctrl.getSellerLatestOffer(seller);
                                }
                            }
                        }
                    }
                }
            }
            return offer;
        };
        ctrl.getSellerProductOfferOnLocationRewrite = function (product, locations, sellerId, sellerObj) {
            offer = null;
            $.each(ctrl.requests, function (reqK, reqV) {
                if (product.requestId == reqV.id) {
                    $.each(reqV.locations, function (locK, locV) {
                        if (locV.uniqueLocationIdentifier == locations[0].uniqueLocationIdentifier) {
                            $.each(locV.products, function (prodK, prodV) {
                                if (prodV.id == product.id) {
                                    if (prodV.sellers.length > 0) {
                                        $.each(prodV.sellers, function (selK, selV) {
                                            if (selV.randUniquePkg == sellerObj.randUniquePkg) {
                                                if (selV.offers.length > 0) {
                                                    offer = selV.offers[0];
                                                } else {
                                                    offer = selV.offers;
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
            if (offer) {
                if (offer.length > 0) {
                    offer = offer[0];
                }
            }
            return offer;
        };
        ctrl.getSellerProductStatusOnLocation = function (product, locations, sellerObj) {
            productStatus = null;
            $.each(ctrl.requests, function (reqK, reqV) {
                if (product.requestId == reqV.id) {
                    $.each(reqV.locations, function (locK, locV) {
                        if (locV.uniqueLocationIdentifier == locations[0].uniqueLocationIdentifier) {
                            $.each(locV.products, function (prodK, prodV) {
                                if (prodV.id == product.id) {
                                    if (prodV.sellers.length > 0) {
                                        $.each(prodV.sellers, function (selK, selV) {
                                            if (selV.randUniquePkg == sellerObj.randUniquePkg) {
                                                productStatus = prodV.productStatus.name;
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
            return productStatus;
        };
        ctrl.getSellerRequestStatusOnLocation = function (product, locations, sellerObj) {
            requestStatus = null;
            $.each(ctrl.requests, function (reqK, reqV) {
                if (product.requestId == reqV.id) {
                    $.each(reqV.locations, function (locK, locV) {
                        if (locV.uniqueLocationIdentifier == locations[0].uniqueLocationIdentifier) {
                            $.each(locV.products, function (prodK, prodV) {
                                if (prodV.id == product.id) {
                                    if (prodV.sellers.length > 0) {
                                        $.each(prodV.sellers, function (selK, selV) {
                                            if (selV.randUniquePkg == sellerObj.randUniquePkg) {
                                                requestStatus = reqV.requestStatus.name;
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
            return requestStatus;
        };        
        
        /**
         * Get latest product offer from seller
         *
         * @param {object} product - Product DTO object as retrieved from the server
         * @param {array} locations - locations array group
         */
        ctrl.getProductMaxQuantityOnLocation = function (product, locations) {
        	if (!product) {
        		return;
        	}
            data = {};
            var location;
            //get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    location = locations[i];
                    break;
                }
            }
            //if there is no matching location. return empty quantity
            if (!location) {
                return 0;
            }
            // var productList = $filter("filter")(location.products, {
            //     product: {
            //         id: product.product.id
            //     }
            // });
            productList = [];
            $.each(location.products, function (k, v) {
                if (v.id == product.id) {
                    productList.push(v);
                }
            });
            if (productList.length > 0) {
                data.qty = productList[0].maxQuantity;
                data.uom = productList[0].uom;
                data.quotePrice = productList[0].quotePrice;
                return data;
            } else {
                return 0;
            }
        };
        /**
         * Get all sellers of products in the specified location.
         *
         * @param {array} locations - array of Location DTO objects with matching location parameter as retrieved from the server
         */
        ctrl.getSortedLocationSellers = function (locations) {
            var sellers = [];
            var counterpartyIds = [];
            var seller = null;
            var counterpartyId = -1;
            var productList = [];
            if (typeof locations == "undefined") {
                return false;
            }
            //get products from grouped locations
            for (var i = 0; i < locations.length; i++) {
                productList = productList.concat(locations[i].products);
            }
            for (i = 0; i < productList.length; i++) {
                for (var j = 0; j < productList[i].sellers.length; j++) {
                    seller = productList[i].sellers[j];
                    if (seller) {
                        uniqueIdentifier = seller.sellerCounterparty.id;
                        if (typeof seller.offers != "undefined") {
                            if (seller.offers.length > 0) {
                                if (seller.offers[0].physicalSupplierCounterparty) {
                                    uniqueIdentifier = seller.sellerCounterparty.id + "-" + seller.offers[0].physicalSupplierCounterparty.id;
                                }
                            }
                        }
                    }
                    if (counterpartyIds.indexOf(seller.randUniquePkg) == -1) {
                        if (!(seller.packageId && !ctrl.packagesConfigurationEnabled)) {
                            counterpartyIds.push(seller.randUniquePkg);
                            sellers.push(seller);
                        }
                    }
                    // if (counterpartyIds.indexOf(seller.randUnique) == -1) {
                    //     counterpartyIds.push(seller.randUnique);
                    //     sellers.push(seller);
                    // }
                }
            }
            //order array to make sure we respect user sort preference
            sellers.sort(function (a, b) {
                return ctrl.sellerOrder.indexOf(a.sellerCounterparty.id) - ctrl.sellerOrder.indexOf(b.sellerCounterparty.id);
            });
            // ctrl.sortedLocationSellers = sellers
            return sellers;
        };
        /**
         * Get correct seller order from counterparty list.
         *
         * @param {object} counterparties - array with counterparty DTOs
         */
        function getSellerOrder(counterparties) {
            var order = [];
            for (var i = 0; i < counterparties.length; i++) {
                order.push(counterparties[i].counterpartyId);
            }
            return order;
        }

        function getRequestById(requestId) {
            return $filter("filter")(ctrl.requests, {
                id: requestId
            })[0];
        }
        /**
         * Remove all requirements of seller from location
         *
         * @param {object} seller - seller object
         * @param {array} locations - location group list
         */
        function removeSellerRequirementsOnLocation(seller, locations) {
            var location, req;
            var productList = [];
            if (typeof seller == "undefined" && typeof locations == "undefined") {
                return false;
            }
            physicalSupplierId = null;
            if (seller.offers.length > 0) {
                if (seller.offers[0].physicalSupplierCounterparty) {
                    physicalSupplierId = seller.offers[0].physicalSupplierCounterparty.id;
                }
            }
            for (var i = ctrl.requirements.length - 1; i >= 0; i--) {
                for (var j = 0; j < locations.length; j++) {
                    req = ctrl.requirements[i];
                    location = locations[j];
                    composedUniqueLocationSellerPhysical = location.uniqueLocationIdentifier + "-" + seller.randUnique;
                    if (req.UniqueLocationSellerPhysical.indexOf(composedUniqueLocationSellerPhysical) > -1 && location.id == req.RequestLocationId) {
                        if (req.randUniquePkg == seller.randUniquePkg) {
                            ctrl.requirements.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            //get products from grouped locations
            for (i = 0; i < locations.length; i++) {
                productList = productList.concat(locations[i].products);
            }
            for (i = 0; i < productList.length; i++) {
                ctrl.requirementRequestProductIds = removeProductFromRequestProductIds(seller, productList[i], ctrl.requirementRequestProductIds);
            }
            //calculates screen actions
            ctrl.calculateScreenActions();
        }

        function removeAllSellerRequirements() {
            ctrl.requirements = [];
        }
        ctrl.productHasSeller = function (product, sellerId) {
            return (
                $filter("filter")(
                    product.sellers,
                    {
                        sellerCounterparty: {
                            id: sellerId
                        }
                    },
                    true
                ).length > 0
            );
        };
        /**
         * Remove product requirements of seller from location
         *
         * @param {object} seller - seller object
         * @param {array} locations - location group list
         * @param {object} product - product object
         */
        function removeSellerProductRequirementsOnLocation(seller, locations, product) {
            var location;
            if (typeof sellerId == "undefined" && typeof locations == "undefined" && typeof product == "undefined") {
                return false;
            }
            //get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    location = locations[i];
                    break;
                }
            }
            //if there is no matching location. product is not available
            if (!location) {
                return false;
            }
            for (i = ctrl.requirements.length - 1; i >= 0; i--) {
                req = ctrl.requirements[i];
                composedUniqueLocationSellerPhysical = location.uniqueLocationIdentifier + "-" + seller.randUnique;
                if (req.UniqueLocationSellerPhysical.indexOf(composedUniqueLocationSellerPhysical) > -1 && location.id == req.RequestLocationId && product.id == req.RequestProductId) {
                    if (req.randUniquePkg == seller.randUniquePkg) {
                        ctrl.requirements.splice(i, 1);
                    }
                }
            }
            ctrl.requirementRequestProductIds = removeProductFromRequestProductIds(seller, product, ctrl.requirementRequestProductIds);
            //calculates screen actions
            ctrl.calculateScreenActions();
        }
        ctrl.removePackageRequirements = function (seller, locations, productSample) {
            for (i = ctrl.requirements.length - 1; i >= 0; i--) {
                req = ctrl.requirements[i];
                if (req.randUniquePkg == seller.randUniquePkg) {
                    ctrl.requirements.splice(i, 1);
                }
            }
            for (i = ctrl.requirementRequestProductIds.length - 1; i >= 0; i--) {
                req = ctrl.requirementRequestProductIds[i];
                if (req.randUniquePkg == seller.randUniquePkg) {
                    ctrl.requirementRequestProductIds.splice(i, 1);
                }
            }
        };

        function removeProductFromRequestProductIds(seller, product, ids) {
            var result = ids;
            for (var i = 0; i < ids.length; i++) {
                if (ids[i].requestProductId == product.id && ids[i].productSellerId == seller.sellerCounterparty.id) {
                    result.splice(i, 1);
                }
            }
            return result;
        }
        /**
         * Handle selecting a request from lookup
         *
         * @param {object} request - request object to be added
         */
        ctrl.selectRequest = function (requestList) {
            addRequest(requestList);
        };
        ctrl.getSellerProductTotalOnLocation = function (products, locations, sellerId) {
            var total = 0;
            var seller, offer, product, requestProductsInLocation;
            var location;
            //get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === products[0].requestId) {
                    location = locations[i];
                    break;
                }
            }
            //if there is no matching location. return empty total
            if (!location) {
                return 0;
            }
            for (i = 0; i < location.products.length; i++) {
                product = location.products[i];
                requestProductsInLocation = $filter("filter")(products, {
                    // product: {
                    //     id: product.product.id
                    // }
                    id : product.id
                });
                if (requestProductsInLocation.length > 0 && requestProductsInLocation[0].requestId == location.requestId) {
                    for (var j = 0; j < product.sellers.length; j++) {
                        seller = product.sellers[j];
                        if (seller.sellerCounterparty.id == sellerId) {
                            offer = ctrl.getSellerLatestOffer(seller);
                            if (offer) {
                                total += offer.totalAmount;
                                if (!total) total = 0;
                            }
                        }
                    }
                }
            }
            return total;
        };
        /**
         * Get latest seller offer from product seller list.
         *
         * @param {object} seller - a product seller object
         */
        ctrl.getSellerLatestOffer = function (seller) {
            if (!seller || !seller.offers || seller.offers.length === 0) {
                return null;
            }
            var latestDate = moment(seller.offers[0].quoteDate, moment.ISO_8601);
            var latestOffer = seller.offers[0];
            var currentDate;
            for (var i = 0; i < seller.offers.length; i++) {
                currentOfferDate = moment(seller.offers[0].quoteDate, moment.ISO_8601);
                if (currentOfferDate.isAfter(latestDate)) {
                    latestDate = currentOfferDate;
                    latestOffer = seller.offers[i];
                }
            }
            return latestOffer;
        };
        /**
         * Determine the expanded status of a request tab.
         *
         * @param {integer} index - The request tab index in the ctrl.requestTabs array.
         */
        ctrl.isRequestTabExpanded = function (index) {
            if (typeof ctrl.requestTabs[index] != "undefined") {
                return ctrl.requestTabs[index].expanded;
            }
            return false;
        };
        /**
         * Toggle the expanded state of a request tab from the Group of Requests table.
         *
         * @param {integer} index - The request tab index in the ctrl.requestTabs array.
         */
        ctrl.toggleRequestTab = function (index) {
            ctrl.requestTabs[index].expanded = !ctrl.requestTabs[index].expanded;
        };
        ctrl.expandAll = function(){
            //debugger;
            ctrl.isSellerHistoryExpanded = !ctrl.isSellerHistoryExpanded
           //ctrl.isRequestTabExpanded = !ctrl.isRequestTabExpanded;
           ctrl.commentsSectionIsExpanded = !ctrl.commentsSectionIsExpanded;
           ctrl.counterpartyDetailsIsExpanded = !ctrl.counterpartyDetailsIsExpanded;
           ctrl.allExpanded = !ctrl.allExpanded;
        }
        ctrl.toggleEnergyContentTab = function (product, prodKey) {
            if (ctrl.isEnergyCalculationRequired) {
                console.log(product);
                if (typeof ctrl.energyContentExpanded == "undefined") {
                    ctrl.energyContentExpanded = [];
                }
                ctrl.energyContentExpanded["prod" + product.requestId + prodKey] = !ctrl.energyContentExpanded["prod" + product.requestId + prodKey];
                ctrl.priceExpanded["prod" + product.requestId + prodKey] = !ctrl.priceExpanded["prod" + product.requestId + prodKey];
            } else {
                if (typeof ctrl.priceExpanded == "undefined") {
                    ctrl.priceExpanded = [];
                }
                ctrl.priceExpanded["prod" + product.requestId + prodKey] = !ctrl.priceExpanded["prod" + product.requestId + prodKey];
            }
        };
        /**
         * Set lookup dialog variables
         *
         * @param {string} type - The type of content we want the dialog to show
         */
        ctrl.setDialogType = function (type) {
            ctrl.lookupType = type;
        };
        /**
         * check if requirement has been created for parameter pairings
         *
         * @param {integer} sellerId - requirement seller id
         * @param {array} locations - location group where requirement is created
         * @param {string} product - requirement product
         * @param {string} productOffer - requirement product offer (if none available, skip product)
         */
        ctrl.hasSellerProductRequirements = function (sellerObj, locations, physicalSupplierId, product) {
            var req, locationProduct;
            var location;
            if (typeof sellerId == "undefined" && typeof locations == "undefined" && typeof product == "undefined") {
                return false;
            }
            //get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    location = locations[i];
                    break;
                }
            }
            //if there is no matching location. product is not available
            if (!location) {
                return false;
            }
            for (i = 0; i < ctrl.requirements.length; i++) {
                req = ctrl.requirements[i];
                if (req.randUniquePkg == sellerObj.randUniquePkg) {
                    if (location.location.id == req.LocationId && location.id == req.RequestLocationId) {
                        for (var j = 0; j < location.products.length; j++) {
                            locationProduct = location.products[j];
                            if (product.id == req.RequestProductId && product.requestId == req.RequestId) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        };
        /**
         * check if requirement has been created for parameter pairings
         *
         * @param {integer} sellerId - requirement seller id
         * @param {array} locations - location group where requirement is created
         */
        ctrl.hasSellerRequirements = function (sellerId, locations, sellerObj) {
            var req;
            var location;
            physicalSupplierId = null;
            if (sellerObj.offers.length > 0) {
                if (sellerObj.offers[0].physicalSupplierCounterparty) {
                    physicalSupplierId = sellerObj.offers[0].physicalSupplierCounterparty.id;
                }
            }
            if (typeof sellerId == "undefined" && typeof locations == "undefined" && typeof physicalSupplierId == "undefined") {
                return false;
            }
            for (var i = 0; i < ctrl.requirements.length; i++) {
                for (var j = 0; j < locations.length; j++) {
                    requirement = ctrl.requirements[i];
                    location = locations[j];
                    // if (sellerId == requirement.SellerId && location.location.id == requirement.LocationId && location.id == requirement.RequestLocationId && physicalSupplierId == requirement.PhysicalSupplierCounterpartyId) {
                    //     return true;
                    // }
                    composedUniqueLocationSellerPhysical = location.uniqueLocationIdentifier + "-" + sellerObj.randUnique;
                    if (requirement.UniqueLocationSellerPhysical == composedUniqueLocationSellerPhysical && requirement.randUniquePkg == sellerObj.randUniquePkg) {
                        /* update requirementData in case row was checked before making changes on the row */
                        requirement.PhysicalSupplierCounterpartyId = physicalSupplierId;
                        return true;
                    }
                }
            }
            return false;
        };
        ctrl.hasPackageRequirement = function (seller) {
            hasRequirement = false;
            $.each(ctrl.requirements, function (rV, rV) {
                if (rV.randUniquePkg == seller.randUniquePkg) {
                    hasRequirement = true;
                }
            });
            return hasRequirement;
        };
        /**
         * check if product has requirements created for it
         *
         * @param {integer} productId - requirement product id
         */
        function productHasRequirements(productId) {
            for (var i = 0; i < ctrl.requirements.length; i++) {
                if (productId == ctrl.requirements[i].RequestProductId) {
                    return true;
                }
            }
            return false;
        }
        ctrl.calcStackBarStyles = function (left, right) {
            left = parseFloat(left);
            right = parseFloat(right);
            var total = left + right,
                rightPerc,
                leftPerc;
            if (total !== 0) {
                leftPerc = Math.round(left * 100 / total);
                rightPerc = Math.round(right * 100 / total);
            } else {
                leftPerc = 50;
                rightPerc = 50;
            }
            // Corner cases:
            if (leftPerc <= 30) {
                leftPerc = 30;
                rightPerc = 70;
            }
            if (rightPerc <= 30) {
                rightPerc = 30;
                leftPerc = 70;
            }
            return {
                left: leftPerc + "%",
                right: rightPerc + "%"
            };
        };
        /**
         * check if product is available on the location
         *
         * @param {object} product - product object
         * @param {array} locations - location group where seller is checked
         */
        ctrl.productAvailableOnLocation = function (product, locations) {
            productAvailable = false;
            $.each(ctrl.requests, function (reqK, reqV) {
                if (reqV.id == product.requestId) {
                    $.each(reqV.locations, function (locK, locV) {
                        if (locV.uniqueLocationIdentifier == locations[0].uniqueLocationIdentifier) {
                            $.each(locV.products, function (prodK, prodV) {
                                if (prodV.product.id == product.product.id) {
                                    productAvailable = true;
                                }
                            });
                        }
                    });
                }
            });
            return productAvailable;
        };
        ctrl.hasAction = function (action) {
            return screenActionsModel.hasAction(action, uiApiModel.getScreenActions());
        };
        ctrl.setDelinkIds = function () {
            var selectedRequestIds = [];
            Object.keys(ctrl.requestCheckboxes).map(function (key, value) {
                if (ctrl.requestCheckboxes[key]) {
                    selectedRequestIds.push(key);
                }
            });
            ctrl.delinkIds = {
                selectedRequestIds: selectedRequestIds,
                groupId: groupId
            };
            // groupOfRequestsModel.delinkRequests(selectedRequestIds, ctrl.groupId).then(function() {
            //     // ctrl.onDelink({requestIds : ctrl.requestIds});
            //     ctrl.delinkRequests(selectedRequestIds);
            // });
        };
        ctrl.delinkRequests = function (requestIds) {
            for (var i = ctrl.requests.length - 1; i >= 0; i--) {
                if (requestIds.indexOf("" + ctrl.requests[i].id) != -1) {
                    ctrl.requests.splice(i, 1);
                }
            }
            ctrl.requestTabs = createRequestTabs(ctrl.requests);
            initializeDataArrays(ctrl.requests);
        };
        ctrl.sortSellers = function () {
            initializeDataArrays(ctrl.requests);
        };
        ctrl.noRequestsSelected = function () {
            var selectedRequestIds = [];
            Object.keys(ctrl.requestCheckboxes).map(function (key, value) {
                if (ctrl.requestCheckboxes[key]) {
                    selectedRequestIds.push(key);
                }
            });
            return selectedRequestIds.length <= 0;
        };
        ctrl.requirementsAreCorrect = function () {
            var requirement;
            var isCorrect = true;
            if (ctrl.requirements.length == 0 || !ctrl.requirements) {
                return false;
            }
            for (var i = 0; i < ctrl.requirements.length; i++) {
                requirement = ctrl.requirements[i];
                if (typeof requirement.PricingTypeId == "undefined" || requirement.PricingTypeId === null) {
                    isCorrect = false;
                    break;
                }
                if (typeof requirement.SellerId == "undefined" || requirement.SellerId === null) {
                    isCorrect = false;
                    break;
                }
                if (typeof requirement.ProductId == "undefined" || requirement.ProductId === null) {
                    isCorrect = false;
                    break;
                }
                if (typeof requirement.RequestLocationId == "undefined" || requirement.RequestLocationId === null) {
                    isCorrect = false;
                    break;
                }
                if (requirement.productHasOffer == true) {
                    isCorrect = false;
                    break;
                }
            }
            return isCorrect;
        };
        ctrl.requirementsAreCorrectForConfirm = function () {
            var requirement;
            var isCorrect = true;
            var existingRequestProductIds = [];
            if (ctrl.requirementRequestProductIds.length == 0) {
                return false;
            }
            for (var i = 0; i < ctrl.requirementRequestProductIds.length; i++) {
                requirement = ctrl.requirementRequestProductIds[i];
                if (typeof requirement.requestOfferId == "undefined" || requirement.requestOfferId === null) {
                    isCorrect = false;
                    break;
                }
                if (typeof requirement.requestOffer.price == "undefined" || requirement.requestOffer.price === null) {
                    isCorrect = false;
                    break;
                }
                if (existingRequestProductIds.indexOf(requirement.requestProductId) >= 0) {
                    isCorrect = false;
                    break;
                }
                existingRequestProductIds.push(requirement.requestProductId);
            }
            return isCorrect;
        };
        ctrl.requirementsAreCorrectForRevokeAmend = function () {
            var requirement;
            var isCorrect = true;
            for (var i = 0; i < ctrl.requirementRequestProductIds.length; i++) {
                requirement = ctrl.requirementRequestProductIds[i];
                if (typeof requirement.requestOfferId == "undefined" || requirement.requestOfferId === null) {
                    isCorrect = false;
                    break;
                }
            }
            return isCorrect;
        };
        //check all checkbox
        ctrl.checkAll = function (uniqueLocationIdentifier, event) {
            //          console.log(uniqueLocationIdentifier);
            currentCheckBool = $(event.target).prop("checked");
            //          $("input[uniqueLocationIdentifier='"+uniqueLocationIdentifier+"']").click()
            // $.each($("input[uniqueLocationIdentifier='"+uniqueLocationIdentifier+"']"), function(){
            //  if ($(this).prop("checked") != currentCheckBool ) {
            //      $(this).addClass("locationRowToBeChecked");
            //  }
            // })
            // $timeout(function () {
            //  $(".locationRowToBeChecked").click()
            // }, 1);
            // $timeout(function () {
            //  $(".locationRowToBeChecked").removeClass("locationRowToBeChecked")
            // }, 1);
            $("input[uniqueLocationIdentifier]").removeClass("locationRowToBeChecked"); 
            myCheckInputs = $("input[uniqueLocationIdentifier='" + uniqueLocationIdentifier + "']");
            $(myCheckInputs).each(function () {
                if ($(this).prop("checked") != currentCheckBool && !$(this).is(":disabled"))
                    $(this)
                        // .prop("checked", currentCheckBool)
                        .addClass("locationRowToBeChecked");
            });
            $timeout(function () {
                $(".locationRowToBeChecked").click();
            }, 1);
        };
        /*****************************************************************************
         *   EVENT HANDLERS
         ******************************************************************************/
        ctrl.createSellerRequirements = function (seller, locations, $event) {
            var req, product, locationSeller, productOffer, request, location;

            if ($event && ctrl.selectedNoQuoteItems ) {
	            noQuoteCheckboxes = $($event.target).parents('tr').find('[has-no-quote="true"]');
	            
	            console.log(ctrl.selectedNoQuoteItems);
	            if ($($event.target).prop("checked") == false && ctrl.selectedNoQuoteItems) {
	            	newSelectedNoQuoteItems = angular.copy(ctrl.selectedNoQuoteItems);
		            Object.keys(newSelectedNoQuoteItems).map(function (key, value) {
		                if (newSelectedNoQuoteItems[key]) {
	            	 		newSelectedNoQuoteItems[key] = false;
		                }
		            });
		            setTimeout(function(){
			            console.log(ctrl.selectedNoQuoteItems);
			            console.log(newSelectedNoQuoteItems);
		            	ctrl.selectedNoQuoteItems = newSelectedNoQuoteItems
			            $scope.$apply();
			            console.log(ctrl.selectedNoQuoteItems);
		            })
	            }
	            $.each($(noQuoteCheckboxes), function(k,v){
	            	if (!ctrl.selectedNoQuoteItems) {
	            		ctrl.selectedNoQuoteItems = []
	            	}
	            	ctrl.selectedNoQuoteItems["nq" + $(v).attr("product-offer-id")] = true;
	            })
            }

            physicalSupplier = {};
            contactCounterparty = {};
            brokerCounterparty = {};
            physicalSupplier.id = null;
            physicalSupplier.name = null;
            productHasSeller = false;
            if (seller.offers.length > 0) {
                if (seller.offers[0].physicalSupplierCounterparty) {
                    physicalSupplier = seller.offers[0].physicalSupplierCounterparty;
                }
                if (seller.offers[0].contactCounterparty) {
                    contactCounterparty = seller.offers[0].contactCounterparty;
                }
                if (seller.offers[0].brokerCounterparty) {
                    brokerCounterparty = seller.offers[0].brokerCounterparty;
                }                
                productHasSeller = true;
            }
            if (ctrl.hasSellerRequirements(seller.sellerCounterparty.id, locations, seller)) {
                removeSellerRequirementsOnLocation(seller, locations);
                if (seller.packageType != "individual") {
                    ctrl.removePackageRequirements(seller, locations, productOffer.packageId);
                }
            } else {
                for (var i = 0; i < locations.length; i++) {
                    location = locations[i];
                    for (var j = 0; j < location.products.length; j++) {
                        product = location.products[j];
                        //for(var j = 0; j < product.sellers.length; j++) {
                        //locationSeller = location.products[i].sellers[j];
                        // if (seller.sellerCounterparty.id == locationSeller.sellerCounterparty.id){
                        request = getRequestById(location.requestId);
                        prodSeller = null;
                        for (var k = 0; k < product.sellers.length; k++) {
                            if (product.sellers[k].randUniquePkg == seller.randUniquePkg) {
                                prodSeller = product.sellers[k];
                            }
                        }
                        //create RFQ requirements
                        productOffer = ctrl.getSellerProductOfferOnLocationRewrite(product, locations, seller.sellerCounterparty.id, seller);
                        productHasRFQ = false;
                        if (productOffer) {
                            if (productOffer.rfq) {
                                productHasRFQ = true;
                            }
                        }
                        if (productOffer) {
                            if (productOffer.hasNoQuote) {
                                continue;
                            }
                        }
                        if (product.productStatus.name == "Stemmed" && !seller.packageId) {
                            continue;
                        }
                        productHasOffer = true;
                        if (product.sellers.length == 0) {
                            productHasOffer = false;
                        }
                        sellerIsInProduct = false;
                        requestSellerId = null;
                        $.each(product.sellers, function (selK, selV) {
                            if (selV.randUniquePkg == seller.randUniquePkg) {
                                requestSellerId = selV.id;
                                sellerIsInProduct = true;
                                if (typeof selV.offers == "undefined") {
                                    productHasOffer = false;
                                } else {
                                    if (selV.offers == null) {
                                        productHasOffer = false;
                                    } else if (selV.offers.length < 1) {
                                        productHasOffer = false;
                                    } else if (!selV.offers[0].id) {
                                        productHasOffer = false;
                                    }
                                }
                            }
                        });
                        if (!sellerIsInProduct && productHasOffer) {
                            productHasOffer = false;
                        }
                        if (seller.isCloned) {
                            productHasOffer = false;
                        }
                        req = {
                            RequestLocationId: location.id,
                            RequestGroupId: ctrl.groupId,
                            SellerId: seller.sellerCounterparty.id,
                            RequestSellerId: requestSellerId,
                            RequestId: request.id,
                            VesselId: request.vesselId,
                            LocationId: location.location.id,
                            VesselVoyageDetailId: location.vesselVoyageDetailId,
                            ProductId: product.product.id,
                            RfqId: prodSeller != null && prodSeller.rfq !== null ? prodSeller.rfq.id : null,
                            WorkflowId: product.workflowId,
                            OrderFields: null,
                            RequestProductId: product.id,
                            ProductTypeId: product.productTypeId,
                            ProductTypeGroupId: product.productTypeGroupId,
                            QuotedProductGroupId: productOffer !== null && typeof productOffer != "undefined" ? productOffer.quotedProductGroupId : null,
                            PhysicalSupplierCounterpartyId: physicalSupplier.id,
                            ContactCounterpartyId: contactCounterparty.id ? contactCounterparty.id : null,
                            BrokerCounterpartyId: brokerCounterparty.id ? brokerCounterparty.id : null,
                            productHasOffer: productHasOffer,
                            productHasPrice: productOffer ? (productOffer.price ? true : false) : false,
                            productHasRFQ: productHasRFQ,
                            requestOfferId: productOffer !== null && typeof productOffer != "undefined" ? productOffer.id : null,
                            UniqueLocationSellerPhysical: location.uniqueLocationIdentifier + "-" + seller.randUnique,
                            randUniquePkg: seller.randUniquePkg,
                            isClonedSeller: seller.isCloned,
                            currencyId: productOffer ? (productOffer.currency ? productOffer.currency.id : null) : null,
                            vesselETA: location.eta
                        };
                        if (product.pricingType) {
                            req.PricingTypeId = product.pricingType.id;
                        } else {
                            req.PricingTypeId = null;
                        }
                        //                   if (productOffer) {
                        //                    if (productOffer.hasNoQuote) { continue }
                        //                   }
                        // if (product.productStatus.name == "Stemmed" && !seller.packageId) { continue }
                        ctrl.requirements.push(req);
                        //create confirmation requirements
                        ctrl.requirementRequestProductIds.push({
                            requestProductId: product.id,
                            requestOfferId: productOffer !== null && typeof productOffer != "undefined" ? productOffer.id : null,
                            productSellerId: seller.sellerCounterparty.id,
                            requestOffer: productOffer,
                            randUniquePkg: seller.randUniquePkg
                        });
                        // }
                    }
                }
                // }
            }
            //calculates screen actions
            ctrl.calculateScreenActions();
        };
        ctrl.createSellerRequirementsForProduct = function (seller, locations, productSample) {
            var request;
            var location, requestProductsInLocation;
            //get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === productSample.requestId) {
                    location = locations[i];
                    break;
                }
            }
            //if there is no matching location. product is not available
            if (!location) {
                return false;
            }
            physicalSupplier = {};
            contactCounterparty = {};
            brokerCounterparty = {};
            physicalSupplier.id = null;
            physicalSupplier.name = null;
            if (typeof seller.offers != "undefined") {
                if (seller.offers.length > 0) {
                    if (seller.offers[0].physicalSupplierCounterparty) {
                        physicalSupplier = seller.offers[0].physicalSupplierCounterparty;
                    }
                    if (seller.offers[0].contactCounterparty) {
                        contactCounterparty = seller.offers[0].contactCounterparty;
                    }
                    if (seller.offers[0].brokerCounterparty) {
                        brokerCounterparty = seller.offers[0].brokerCounterparty;
                    }
                }
            }
            if (ctrl.hasSellerProductRequirements(seller, locations, physicalSupplier.id, productSample)) {
                for (i = 0; i < location.products.length; i++) {
                    if (location.products[i].id === productSample.id) {
                        product = location.products[i];
                        break;
                    }
                }
                removeSellerProductRequirementsOnLocation(seller, locations, product);
                // if (seller.packageType != 'individual') {
                //     ctrl.removeSellerProductRequirementsOnLocation(seller, locations, productSample)
                // }
            } else {
                //get actual product from location (identified by the productSample)
                for (i = 0; i < location.products.length; i++) {
                    if (location.products[i].id === productSample.id) {
                        product = location.products[i];
                        break;
                    }
                }
                //if there is no matching product, it is not available
                if (!product) {
                    return false;
                }
                request = getRequestById(location.requestId);
                prodSeller = null;
                for (var k = 0; k < product.sellers.length; k++) {
                    if (product.sellers[k].randUniquePkg == seller.randUniquePkg) prodSeller = product.sellers[k];
                }
                productOffer = ctrl.getSellerProductOfferOnLocationRewrite(product, locations, seller.sellerCounterparty.id, seller);
                productHasRFQ = false;
                if (productOffer) {
                    if (productOffer.rfq) {
                        productHasRFQ = true;
                    }
                }
                if (productOffer) {
                    if (productOffer.hasNoQuote) {
                        return false;
                    }
                }
                currentProductStatus = ctrl.getSellerProductStatusOnLocation(productSample, locations, seller);
                if (currentProductStatus == "Stemmed" && !seller.packageId) {
                    return false;
                }
                productHasOffer = true;
                if (product.sellers.length == 0) {
                    productHasOffer = false;
                }
                sellerIsInProduct = false;
                requestSellerId = null;
                $.each(product.sellers, function (selK, selV) {
                    if (selV.randUniquePkg == seller.randUniquePkg) {
                        requestSellerId = selV.id;
                        sellerIsInProduct = true;
                        if (typeof selV.offers == "undefined") {
                            productHasOffer = false;
                        } else {
                            if (selV.offers == null) {
                                productHasOffer = false;
                            } else if (selV.offers.length < 1) {
                                productHasOffer = false;
                            } else if (!selV.offers[0].id) {
                                productHasOffer = false;
                            }
                        }
                    }
                });
                if (!sellerIsInProduct && productHasOffer) {
                    productHasOffer = false;
                }
                if (seller.isCloned) {
                    productHasOffer = false;
                }
                req = {
                    RequestLocationId: location.id,
                    RequestGroupId: ctrl.groupId,
                    SellerId: seller.sellerCounterparty.id,
                    RequestSellerId: requestSellerId,
                    RequestId: request.id,
                    VesselId: request.vesselId,
                    LocationId: location.location.id,
                    VesselVoyageDetailId: location.vesselVoyageDetailId,
                    ProductId: product.product.id,
                    RfqId: prodSeller != null && prodSeller.rfq !== null ? prodSeller.rfq.id : null,
                    WorkflowId: product.workflowId,
                    OrderFields: null,
                    RequestProductId: product.id,
                    ProductTypeId: product.productTypeId,
                    ProductTypeGroupId: product.productTypeGroupId,
					QuotedProductGroupId: productOffer !== null && typeof productOffer != "undefined" ? productOffer.quotedProductGroupId : null,                    
                    PhysicalSupplierCounterpartyId: physicalSupplier.id,
                    ContactCounterpartyId: contactCounterparty.id ? contactCounterparty.id : null,
                    BrokerCounterpartyId: brokerCounterparty.id ? brokerCounterparty.id : null,
                    productHasOffer: productHasOffer,
                     productHasPrice: productOffer ? (productOffer.price ? true : false) : false,
                    productHasRFQ: productHasRFQ,
                    requestOfferId: productOffer !== null && typeof productOffer != "undefined" ? productOffer.id : null,
                    UniqueLocationSellerPhysical: location.uniqueLocationIdentifier + "-" + seller.randUnique,
                    randUniquePkg: seller.randUniquePkg,
                    isClonedSeller: seller.isCloned,
                    currencyId: productOffer ? (productOffer.currency ? productOffer.currency.id : null) : null,
                    vesselETA: location.eta
                };
                if (product.pricingType) {
                    req.PricingTypeId = product.pricingType.id;
                } else {
                    req.PricingTypeId = null;
                }
                ctrl.requirements.push(req);
                //create confirmation requirements
                ctrl.requirementRequestProductIds.push({
                    requestProductId: product.id,
                    requestOfferId: productOffer !== null ? productOffer.id : null,
                    productSellerId: seller.sellerCounterparty.id,
                    requestOffer: productOffer,
                    randUniquePkg: seller.randUniquePkg
                });
            }
            //calculates screen actions
            ctrl.calculateScreenActions();
        };
        ctrl.createSellerRequirementsForProductPackage = function (seller, locations) {
            matchingPackageIdProducts = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        if (prodV.sellers.length > 0) {
                            $.each(prodV.sellers, function (selK, selV) {
                                if (selV.randUniquePkg == seller.randUniquePkg) {
                                    prodV.seller = selV;
                                    matchingPackageIdProducts.push(prodV);
                                }
                            });
                        }
                    });
                });
            });
            $.each(matchingPackageIdProducts, function (key, prodValue) {
                ctrl.createSellerRequirementsForProduct(prodValue.seller, locations, prodValue);
            });
        };
        /**
         * check if we should show extra buttons
         */
        ctrl.extraButtons = function () {
            return $(".st-extra-buttons").find("li").length === 0;
        };
        ctrl.deleteRequest = function (request) {
            for (var i = ctrl.requests.length - 1; i >= 0; i--) {
                if (ctrl.requests[i].id == request.id) {
                    ctrl.requests.splice(i, 1);
                }
            }
            initializeDataArrays(ctrl.requests);
        };
        ctrl.setQuoteByCurrency = function (currencyId, currencyName) {
            ctrl.quoteByCurrency = {
                id: currencyId,
                name: currencyName
            };
        };
        ctrl.isCurrencyDisabled = function () {
            if (ctrl.bestOfferData && ctrl.bestOfferData.length > 0) {
                return true;
            }
            if (ctrl.rfqSent) {
                return true;
            }
            return false;
        };
        ctrl.setQuoteByTimezone = function (timeZoneId, timeZoneName) {
            ctrl.quoteByTimezone = {
                id: timeZoneId,
                name: timeZoneName
            };
        };

        ctrl.requirementsHasNoPrice = function() {
        	hasNoPrice = false;
        	if (ctrl.requirements.length == 0) {
	        	hasNoPrice = true;
	        	return hasNoPrice;
        	}
        	$.each(ctrl.requirements, function(k,v){
        		if (!v.productHasPrice) {
		        	hasNoPrice = true;
        		}
        	})
        	return hasNoPrice;
        }
        ctrl.checkSludgeSeller = function () {
            var i = 0;
            sludgeMatchSellerProductError = false 
            var msg= "A Service Provider Seller is required for Sludge Product Type";

            $.each(ctrl.requirements, function (requirementK, requirementV) {
                var product = _.find(ctrl.locations, { id: requirementV.RequestLocationId });
                if (!product || !product.products) {
                    return false;
                }
                product = _.find(product.products, { id: requirementV.RequestProductId });
                if (!product || !product.productTypeId) {
                    return false;
                }
                var productTypeId = product.productTypeId;
                var seller = _.find(product.sellers, { sellerCounterparty: { id: requirementV.SellerId } });
                sellerTypeSludge = false
                $.each(ctrl.locations, function(lk,lv){
                	$.each(lv.products, function(pk,pv){
                		$.each(pv.sellers, function(sk,sv) {
                			if (sv.randUniquePkg == requirementV.randUniquePkg) {
								$.each(sv.counterpartyTypes, function(ctk,ctv){
									if (ctv.name == "Service Provider") {
						                sellerTypeSludge = true
									}
								})
                			}
                		})
                	})
                })
                // var sellerTypeSludge
                // var sellerTypeSludge = _.find(seller.counterpartyTypes, { name: "Service Provider" });
                if (productTypeId == 4) {
                    if (sellerTypeSludge) {
                        i++;
                    } else {
                        i = 0;
	                    sludgeMatchSellerProductError = true
                    }
                } else {
                    if (sellerTypeSludge) {
                        i = 0;
                    } else {
                        i++;
                    }
                }
            });
            // if (i == 0) {
            if (sludgeMatchSellerProductError) {
                toastr.error(msg);
                return true;
            } else {
                return false;
            }
        };
        ctrl.sendRFQ = function (reload) {
            /*validate unicity for location-seller-physical-supplier*/
            // productTypeId
            duplicatesArray = [];
            console.log(ctrl.requirements);

            if (ctrl.checkSludgeSeller()) {
                return false;
            }
            $.each(ctrl.requirements, function (requirementK, requirementV) {
                if (requirementV.isClonedSeller) {
                    reqRandUnique = requirementV.SellerId + "-" + requirementV.PhysicalSupplierCounterpartyId;
                    $.each(ctrl.locations, function (locK, locV) {
                        valuesSoFar = [];
                        sellers = ctrl.getSortedLocationSellers([locV]);
                        $.each(sellers, function (k, v) {
                            physicalSupplierId = null;
                            physicalSupplierName = null;
                            if (typeof v.offers != "undefined") {
                                if (v.offers.length > 0) {
                                    if (v.offers[0].physicalSupplierCounterparty) {
                                        physicalSupplierId = v.offers[0].physicalSupplierCounterparty.id;
                                        physicalSupplierName = v.offers[0].physicalSupplierCounterparty.name;
                                    }
                                }
                            }
                            composedSellerIds = v.sellerCounterparty.id + "-" + physicalSupplierId;
                            uniqueStringIdentifier = locV.location.name + "*" + v.sellerCounterparty.name + "*" + physicalSupplierName;
                            if (reqRandUnique == composedSellerIds) {
                                if (valuesSoFar.indexOf(composedSellerIds) > -1 && v.packageType == "individual") {
                                    if (duplicatesArray.indexOf(uniqueStringIdentifier) == -1) {
                                        duplicatesArray.push(uniqueStringIdentifier);
                                    }
                                }
                            }
                            valuesSoFar.push(composedSellerIds);
                        });
                    });
                }
            });
            if (duplicatesArray.length > 0) {
                $.each(duplicatesArray, function (k, val) {
                    locationName = val.split("*")[0];
                    sellerName = val.split("*")[1];
                    physicalSupplierName = val.split("*")[2];
                    if (physicalSupplierName != "null") {
                        toastr.error("For the location " + locationName + " the seller " + sellerName + " with Physical Supplier " + physicalSupplierName + " already exists ");
                    } else {
                        toastr.error("For the location " + locationName + " the seller " + sellerName + " with no Physical Supplier already exists ");
                    }
                });
                return false;
            }
            if (ctrl.isQuoteDateAutoPopulated) {
                if (ctrl.quoteByDateFrom == null) {
                    ctrl.quoteByDateFrom = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
                }
                if (ctrl.isQuoteByEndDateValidated) {
                    if (ctrl.quoteByDate == null) {
                        // ctrl.quoteByDate = new Date(new Date(ctrl.quoteByDateFrom).getTime() + 30 * 60000 );
                        ctrl.quoteByDate = moment
                            .utc(ctrl.quoteByDateFrom)
                            .add(30, "minutes")
                            .toJSON();
                    }
                } else {
                    ctrl.quoteByDate = null;
                }
            }
            var rfq_data = {
                Requirements: ctrl.requirements,
                QuoteByDate: ctrl.quoteByDate,
                QuoteByDateFrom: ctrl.quoteByDateFrom,
                QuoteByCurrencyId: ctrl.quoteByCurrency.id,
                QuoteByTimeZoneId: ctrl.quoteByTimezone.id,
                RequestGroupId: ctrl.groupId,
                Comments: null
            };
            // return false;
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.sendRFQ(rfq_data).then(
                function (response) {
                    ctrl.buttonsDisabled = false;
                    ctrl.rfqSent = true;
                    $stateParams.group = null;
                    ctrl.requirements = [];
                    ctrl.requirementRequestProductIds = [];
                    ctrl.initScreenAfterSendOrSkipRfq();
                    if (response.isSuccess && response.errorMessage) {
                    	toastr.info(response.errorMessage);
                    }
                    if (reload) {
                    	ctrl.initScreenAfterSendOrSkipRfq();
                        // $state.reload();
                    }
                    return false;
                },
                function () {
                    ctrl.buttonsDisabled = false;
                }
            );
        };
        ctrl.skipRFQ = function () {
            /*validate unicity for location-seller-physical-supplier*/
            duplicatesArray = [];
            console.log(ctrl.requirements);
            if (ctrl.checkSludgeSeller()) {
                return false;
            }
            $.each(ctrl.requirements, function (requirementK, requirementV) {
                if (requirementV.isClonedSeller) {
                    reqRandUnique = requirementV.SellerId + "-" + requirementV.PhysicalSupplierCounterpartyId;
                    $.each(ctrl.locations, function (locK, locV) {
                        valuesSoFar = [];
                        sellers = ctrl.getSortedLocationSellers([locV]);
                        $.each(sellers, function (k, v) {
                            physicalSupplierId = null;
                            physicalSupplierName = null;
                            if (typeof v.offers != "undefined") {
                                if (v.offers.length > 0) {
                                    if (v.offers[0].physicalSupplierCounterparty) {
                                        physicalSupplierId = v.offers[0].physicalSupplierCounterparty.id;
                                        physicalSupplierName = v.offers[0].physicalSupplierCounterparty.name;
                                    }
                                }
                            }
                            composedSellerIds = v.sellerCounterparty.id + "-" + physicalSupplierId;
                            uniqueStringIdentifier = locV.location.name + "*" + v.sellerCounterparty.name + "*" + physicalSupplierName;
                            if (reqRandUnique == composedSellerIds) {
                                if (valuesSoFar.indexOf(composedSellerIds) > -1 && v.packageType == "individual") {
                                    if (duplicatesArray.indexOf(uniqueStringIdentifier) == -1) {
                                        duplicatesArray.push(uniqueStringIdentifier);
                                    }
                                }
                            }
                            valuesSoFar.push(composedSellerIds);
                        });
                    });
                }
            });
            if (duplicatesArray.length > 0) {
                $.each(duplicatesArray, function (k, val) {
                    locationName = val.split("*")[0];
                    sellerName = val.split("*")[1];
                    physicalSupplierName = val.split("*")[2];
                    if (physicalSupplierName != "null") {
                        toastr.error("For the location " + locationName + " the seller " + sellerName + " with Physical Supplier " + physicalSupplierName + " already exists ");
                    } else {
                        toastr.error("For the location " + locationName + " the seller " + sellerName + " with no Physical Supplier already exists ");
                    }
                });
                return false;
            }
            if (ctrl.isQuoteDateAutoPopulated) {
                if (ctrl.quoteByDateFrom == null) {
                    ctrl.quoteByDateFrom = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
                }
                if (ctrl.isQuoteByEndDateValidated) {
                    if (ctrl.quoteByDate == null) {
                        ctrl.quoteByDate = new Date(new Date(ctrl.quoteByDateFrom).getTime() + 30 * 60000);
                    }
                } else {
                    ctrl.quoteByDate = null;
                }
            }
            var rfq_data = {
                Requirements: ctrl.requirements,
                QuoteByDate: ctrl.quoteByDate,
                RequestGroupId: ctrl.groupId,
                QuoteByCurrencyId: ctrl.quoteByCurrency.id,
                QuoteByTimeZoneId: ctrl.quoteByTimezone.id,
                Comments: null
            };
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.skipRFQ(rfq_data).then(
                function (response) {
                    ctrl.buttonsDisabled = false;
                    ctrl.rfqSent = true;
                    $stateParams.group = null;
                    ctrl.requirements = [];
                    ctrl.requirementRequestProductIds = [];
                    ctrl.initScreenAfterSendOrSkipRfq();
                    return false;
                    // $state.reload();
                    // return false;
                    // ctrl.buttonsDisabled = false;
                    // ctrl.rfqSent = true;
                    // $stateParams.group = null;
                    newData = response.payload;
                    allClonedFoundSellers = [];
                    $.each(newData, function (newDataKey, newDataValue) {
                        newDataPhysicalSupplierId = "null";
                        if (typeof newDataValue.offers != "undefined") {
                            if (newDataValue.offers.length > 0) {
                                if (newDataValue.offers[0].physicalSupplierCounterparty) {
                                    newDataPhysicalSupplierId = newDataValue.offers[0].physicalSupplierCounterparty.id;
                                }
                            }
                        }
                        $.each(ctrl.requests, function (reqK, reqV) {
                            $.each(reqV.locations, function (locK, locV) {
                                if (locV.id == newDataValue.requestLocationId) {
                                    $.each(locV.products, function (prodK, prodV) {
                                        if (prodV.id == newDataValue.requestProductId) {
                                            foundSellerKey = -1;
                                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                                physicalSupplierId = "null";
                                                if (typeof sellerV.offers != "undefined") {
                                                    if (sellerV.offers.length > 0) {
                                                        if (sellerV.offers[0].physicalSupplierCounterparty) {
                                                            physicalSupplierId = sellerV.offers[0].physicalSupplierCounterparty.id;
                                                        }
                                                    }
                                                }
                                                if (newDataValue.sellerCounterparty.id == sellerV.sellerCounterparty.id && newDataPhysicalSupplierId == physicalSupplierId) {
                                                    foundSellerKey = sellerK;
                                                    foundSellerId = sellerV.sellerCounterparty.id;
                                                    foundPhysicalSupplierId = physicalSupplierId;
                                                    if (sellerV.isCloned) {
                                                        allClonedFoundSellers.push(sellerV.randUnique);
                                                    }
                                                }
                                            });
                                            if (foundSellerKey == -1) {
                                                newDataValue.randUnique = newDataValue.sellerCounterparty.id + "-" + newDataPhysicalSupplierId;
                                                newDataValue.randUniquePkg = newDataValue.sellerCounterparty.id + "-" + newDataPhysicalSupplierId + "-individual-null";
                                                newDataValue.packageType = "individual";
                                                newDataValue.isCloned = false;
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers.push(newDataValue);
                                            } else {
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey] = newDataValue;
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey].randUnique = foundSellerId + "-" + foundPhysicalSupplierId;
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey].randUniquePkg = foundSellerId + "-" + foundPhysicalSupplierId + "-individual-null";
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey].packageType = "individual";
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey].isCloned = false;
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    });
                    $.each(ctrl.requests, function (reqK, reqV) {
                        $.each(reqV.locations, function (locK, locV) {
                            $.each(locV.products, function (prodK, prodV) {
                                $.each(prodV.sellers, function (sellerK, sellerV) {
                                    if (typeof sellerV != "undefined") {
                                        physicalSupplierId = null;
                                        if (typeof sellerV.offers != "undefined") {
                                            if (sellerV.offers.length > 0) {
                                                if (sellerV.offers[0].physicalSupplierCounterparty) {
                                                    physicalSupplierId = sellerV.offers[0].physicalSupplierCounterparty.id;
                                                }
                                            }
                                        }
                                        if (allClonedFoundSellers.indexOf(sellerV.randUnique) != -1) {
                                            ctrl.requests[reqK].locations[locK].products[prodK].sellers[sellerK].randUnique = sellerV.sellerCounterparty.id + "-" + physicalSupplierId;
                                            ctrl.requests[reqK].locations[locK].products[prodK].sellers[sellerK].randUniquePkg = sellerV.sellerCounterparty.id + "-" + physicalSupplierId + "-individual-null";
                                            ctrl.requests[reqK].locations[locK].products[prodK].sellers[sellerK].packageType = "individual";
                                        }
                                    }
                                });
                            });
                        });
                    });
                    initializeDataArrays(ctrl.requests);
                    removeAllSellerRequirements();
                    // angular.merge(ctrl.requests, newData);
                    // $state.reload();
                },
                function () {
                    ctrl.buttonsDisabled = false;
                }
            );
        };
        ctrl.countUniqueVessels = function (sellerRandUniquePkg) {
            vesselIds = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            if (sellerV.randUniquePkg == sellerRandUniquePkg) {
                                if (vesselIds.indexOf(reqV.vesselDetails.vessel.id) == -1) {
                                    vesselIds.push(reqV.vesselDetails.vessel.id);
                                }
                            }
                        });
                    });
                });
            });
            return vesselIds.length;
        };
        ctrl.setConfirmationOffers = function () {
            if (_.uniqBy(ctrl.requirements, 'QuotedProductGroupId').length != 1) {
	        	toastr.error("Product types from different groups cannot be stemmed in one order. Please select the products with same group to proceed");
		    	return false;
            }

            ctrl.confirmationProductOffers = {
                requestProductIds: ctrl.requirementRequestProductIds.slice(0),
                requirements: ctrl.requirements,
                quoteByDate: ctrl.quoteByDate,
                quoteByCurrencyId: ctrl.quoteByCurrency.id,
                quoteByTimeZoneId: ctrl.quoteByTimezone.id,
                comments: null,
                fullGroupData: ctrl.requests
            };


            if (ctrl.isOfferReviewMandatory && !ctrl.isReviewed) {
                toastr.error("Your tenant configuration require that Group should be Reviewed before confirming an Offer");
                return false;
            }
            $bladeEntity.open("confirmOffer");
        };
        ctrl.canSendRFQ = function () {
            ctrl.calculateScreenActions();
            return ctrl.hasAction(ctrl.SCREEN_ACTIONS.SENDRFQ) && ctrl.requirementsAreCorrect();
        };
        ctrl.canConfirm = function () {
            return ctrl.requirementsAreCorrectForConfirm();
        };
        ctrl.canRevokeAmend = function () {
            return ctrl.requirementsAreCorrectForRevokeAmend();
        };
        ctrl.viewRFQ = function (id) {
            $rootScope.bladeRfqGroupId = $stateParams.groupId;
            console.log($stateParams);
            if (!groupId) {
                $state.go(STATE.VIEW_RFQ, {
                    requestGroupId: id
                });
            } else {
                $state.go(STATE.VIEW_RFQ, {
                    requestGroupId: groupId
                });
            }
        };
        ctrl.viewBladeRFQ = function (id) {
            $rootScope.bladeRfqGroupId = $stateParams.groupId;
        };
        ctrl.goSpot = function () {
            $state.go(STATE.GROUP_OF_REQUESTS, {
                groupId: groupId
            });
        };
        ctrl.changeRequirementsPricingType = function (product) {
            var requirement;
            for (var i = 0; i < ctrl.requirements.length; i++) {
                requirement = ctrl.requirements[i];
                if (requirement.RequestId === product.requestId && requirement.ProductId === product.product.id) {
                    requirement.PricingTypeId = product.pricingType.id;
                }
            }
        };
        ctrl.setLatestOfferProduct = function (product, locations, seller) {
            var location = locations[0];
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    var location = locations[i];
                    break;
                }
            }
            var productList = $filter("filter")(location.products, {
                product: {
                    id: product.product.id
                }
            });
            if (productList.length > 0) {
                product = productList[0];
            }
            ctrl.latestOfferProduct = product;
            ctrl.latestOfferSeller = seller;
        };
        ctrl.setOfferDetailsParams = function (product, seller, location) {
            ctrl.offerDetailsLocation = location;
            ctrl.offerDetailsProduct = product;
            ctrl.offerDetails = 0;
            ctrl.offerDetails = ctrl.getSellerProductOfferOnLocation(product, location, seller.sellerCounterparty.id, seller);
            setTimeout(function () {
                if (ctrl.offerDetails != 0) {
                    $bladeEntity.open("offerDetails");
                }
            }, 500);
        };
        ctrl.updateOffer = function (offer, product) {
            var seller, currentSeller;
            for (var m = 0; m < product.sellers.length; m++) {
                seller = product.sellers[m];
                if (seller.id == offer.requestSellerId) {
                    currentSeller = seller;
                    seller.offers.length = 0;
                    seller.offers.push(offer);
                    break;
                }
            }
            ctrl.initScreen();
            return false;
            // $state.reload();
        };
        ctrl.updateSpecParemeters = function (params) {
            groupOfRequestsModel.updateEnergySpecValues(params).then(function (data) {
            	ctrl.confirmedBladeNavigation = true;
                $("body").css("overflow-y", "visible");
                // $rootScope.$broadcast("bladeDataChanged", true);
                // $state.reload();
                //update CCAI & net specific energy
                // console.log(data);
                // console.log(ctrl.active_prod.products[0].energyParameterValues);
                if (data.payload.id == ctrl.active_prod.products[0].energyParameterValues.id) {
                    ctrl.active_prod.products[0].energyParameterValues.ccai = data.payload.energyParameterValues.ccai;
                    ctrl.active_prod.products[0].energyParameterValues.ccaiUom = data.payload.energyParameterValues.ccaiUom;
                    ctrl.active_prod.products[0].energyParameterValues.specificEnergy = data.payload.energyParameterValues.specificEnergy;
                    ctrl.active_prod.products[0].energyParameterValues.specificEnergyUom = data.payload.energyParameterValues.specificEnergyUom;
                }
            });
        };
        ctrl.revokeRFQ = function () {
            if (ctrl.requirements.length === 0) {
                toastr.error("Please select the Products to Revoke RFQ");
                return false;
            }
            var rfq_data = {
                Requirements: ctrl.requirements,
                QuoteByTimeZoneId: ctrl.quoteByTimezone.id,
                QuoteByCurrencyId: ctrl.quoteByCurrency.id,
                Comments: null
            };
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.revokeRFQ(rfq_data).then(
                function (data) {
                    ctrl.buttonsDisabled = false;
                    ctrl.initScreen();
                    return false;
                },
                function () {
                    ctrl.buttonsDisabled = false;
                    ctrl.initScreen();
                    return false;
                }
            ).finally(
                function(){
                }
            );
        };
        ctrl.amendRFQ = function () {
         
            if (ctrl.requirements.length === 0) {
                toastr.error("Please select the Products to Amend RFQ");
                return false;
            }
            var rfq_data = ctrl.requirements;
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.amendRFQ(rfq_data).then(
                function (data) {
                    ctrl.buttonsDisabled = false;
                },
                function () {
                    ctrl.buttonsDisabled = false;
                }
            ).finally(
                function(){
                }
            );


        };
        ctrl.saveComments = function (internalComments, externalComments, fromDate) {
            if (fromDate && ctrl.lastSavedQuoteByDateFrom == ctrl.quoteByDateFrom) {
                return;
            }
            ctrl.lastSavedQuoteByDateFrom = ctrl.quoteByDateFrom;
        	if (internalComments) {
	        	internalComments = internalComments.replace(/(\r\n|\n)/g, "<br/>")
        	}
        	if (externalComments) {
	        	externalComments = externalComments.replace(/(\r\n|\n)/g, "<br/>")
        	}
            groupOfRequestsModel.updateGroup(groupId, internalComments, externalComments, ctrl.quoteByDate, ctrl.quoteByTimezone, ctrl.quoteByCurrency, ctrl.quoteByDateFrom);
        };

        //set requote requirements needed by requote dialog
        ctrl.setRequoteRequirements = function (seller, location) {
            ctrl.requirementsToRequote = ctrl.getRequoteRequirements(seller, location);
        };
        //get requote requirements matching location/seller pair
        ctrl.getRequoteRequirements = function (seller, locations) {
            var requoteRequirements = [];
            var product, req, location;
            for (var i = 0; i < ctrl.requirements.length; i++) {
                req = ctrl.requirements[i];
                $.each(ctrl.requests, function (reqK, reqV) {
                    $.each(reqV.locations, function (locK, locV) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.randUniquePkg == req.randUniquePkg && locV.location.id == req.LocationId && locV.id == req.RequestLocationId && req.RfqId != null) {
                                    requoteRequirements.push(req);
                                }
                            });
                        });
                    });
                });
                // for (var j = 0; j < locations.length; j++) {
                //     location = locations[j];
                //     // if (seller.sellerCounterparty.id == req.SellerId && location.location.id == req.LocationId && location.id == req.RequestLocationId && req.RfqId != null) {
                //     if (seller.randUniquePkg == req.randUniquePkg && req.RfqId != null) {
                //         // //go through request products lists
                //         // for (var j = 0; j < ctrl.products.length; j++) {
                //         //     //go through request products
                //         //     for (var k = 0; k < ctrl.products[j].length; k++){
                //         //         product = ctrl.products[j][k];
                //         //         //all selected products need to have requote screen action
                //         //         if (req.RequestProductId == product.id) {
                //         //             if (!screenActionsModel.hasAction(SCREEN_ACTIONS.REQUOTE, product.screenActions)) {
                //         //                 //if they do not, stop processing
                //         //                 return [];
                //         //             }
                //         //         }
                //         //     }
                //         // }
                //     }
                // }
            }
            return angular.copy(ctrl.requirements);
        };
        ctrl.previewEmail = function (seller, locations) {

        	ctrl.changeBladeWidgetFunction = null;
        	if ($(".blade-column.main-content-column .ng-dirty").length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.previewEmail',
	        		params : [seller,locations]
	        	}
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;


            var rowRequirements = [];

            ctrl.refreshedRFQEmailBlade = false;
            if (locations.location || locations.length > 0) {
                if (locations.length > 0) {
                    uniqueLocationIdentifier = locations[0].uniqueLocationIdentifier;
                } else {
                    uniqueLocationIdentifier = locations.uniqueLocationIdentifier;
                }
                ctrl.blade.activeWidget = null;
                $.each(ctrl.requirements, function(reqK, reqV){
                	if (reqV.randUniquePkg != seller.randUniquePkg) {
		                ctrl.requirements = [];
                	}
                })
                locationsList = [];
                $.each(ctrl.requests, function (reqK, reqV) {
                    $.each(reqV.locations, function (locK, locV) {
                        if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
                            locationsList.push(locV);
                        }
                    });
                });
                locations = locationsList;
                if (ctrl.requirements.length == 0) {
	                ctrl.createSellerRequirements(seller, locations);
                }
            }
            ctrl.rfqScreenToDisplayIsMail = false;

            for (var i = 0; i < ctrl.requirements.length; i++) {
                var req = ctrl.requirements[i];
                for (var locationIndex = 0; locationIndex < locations.length; locationIndex++) {
                    var location = locations[locationIndex];
                    // if (seller.sellerCounterparty.id == req.SellerId && location.location.id == req.LocationId && location.id == req.RequestLocationId) {
                    // }
                    if (req.UniqueLocationSellerPhysical.indexOf(seller.randUnique) != -1) {
                        rowRequirements.push(req);
                        if (!req.productHasRFQ) {
                            ctrl.rfqScreenToDisplayIsMail = true;
                        }
                    }
                }
            }

            // Remove SludgeProducts From emailPreview payload
            requirementsFilteredWithoutSludgeProduct = []
    		hasSimpleProduct = false
    		hasSludgeProduct = false
            $.each(ctrl.requirements, function(k,v){
            	if (v.ProductTypeId != 4) {
            		hasSimpleProduct = true
            		requirementsFilteredWithoutSludgeProduct.push(v);
            	} else {
            		hasSludgeProduct = true
            	}
            })

            if (hasSimpleProduct && hasSludgeProduct) {
	            rowRequirements = requirementsFilteredWithoutSludgeProduct
            }

            if (rowRequirements.length > 0) {
                var rfq_data = {
                    Requirements: rowRequirements,
                    QuoteByDate: ctrl.quoteByDate,
                    QuoteByDateFrom: ctrl.quoteByDateFrom,
                    QuoteByCurrencyId: ctrl.quoteByCurrency.id,
                    QuoteByTimeZoneId: ctrl.quoteByTimezone.id,
                    Comments: null,
                    groupId: groupId
                };
                // $state.go(STATE.PREVIEW_EMAIL, {
                //     data: rfq_data,
                //     transaction: EMAIL_TRANSACTION.GROUP_OF_REQUESTS
                // });
                $stateParams.data = rfq_data;
                $stateParams.transaction = EMAIL_TRANSACTION.GROUP_OF_REQUESTS;
                // ctrl.blade.email = data.payload;
                // ctrl.blade.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                ctrl.bladeTemplateUrl = "components/blade/templates/gor-blade-content.html";
                ctrl.blade.counterpartyData = {
                    id: seller.sellerCounterparty.id
                };
                ctrl.blade.activeSeller = seller.requestLocationId + "-" + seller.randUnique;
                ctrl.blade.counterpartyActiveSeller = seller;
                ctrl.blade.counterpartyActiveLocation = location;
                ctrl.blade.colLayout = "double";
                setTimeout(function () { });
                ctrl.blade.activeWidget = "email";
                ctrl.blade.widgetType = "counterparty";
                if (!ctrl.rfqScreenToDisplayIsMail) {
                    ctrl.setBladeCounterpartyActiveSeller();
                }
                $bladeEntity.open("groupOfRequestBlade");
                ctrl.bladeOpened = true;
                ctrl.dataLoaded = true;
                setTimeout(function () { }, 1500);
            } else {
				ctrl.bladeTemplateUrl = "components/blade/templates/gor-blade-content.html";
                ctrl.blade.counterpartyData = {
                    id: seller.sellerCounterparty.id
                };
                ctrl.blade.activeSeller = seller.requestLocationId + "-" + seller.randUnique;
                ctrl.blade.counterpartyActiveSeller = seller;
                if (!location) {
                	location = locations[0];
                }
                ctrl.blade.counterpartyActiveLocation = location;
                ctrl.blade.colLayout = "double";            	
                ctrl.blade.activeWidget = "email";
                ctrl.blade.widgetType = "counterparty";
                if (!ctrl.rfqScreenToDisplayIsMail) {
                    ctrl.setBladeCounterpartyActiveSeller();
                }
                $bladeEntity.open("groupOfRequestBlade");
                ctrl.bladeOpened = true;
                ctrl.dataLoaded = true;
            }
            setTimeout(function () { 
	            ctrl.refreshedRFQEmailBlade = true;
	            $scope.$apply();
            }, 10);
        };
        ctrl.getSellerOffers = function (seller, loc) {
            // debugger
            // ctrl.sellerOffers = [];
            // $.each(ctrl.requests, function(reqK, reqV) {
            //     $.each(reqV.locations, function(locK, locV) {
            //         if (locV.location.id == loc.location.id) {
            //             $.each(locV.products, function(prodK, prodV) {
            //                 sellerHasProduct = false;
            //                 $.each(prodV.sellers, function(selK, selV) {
            //                     if (selV.randUnique == seller.randUnique) {
            //                         sellerHasProduct = true;
            //                         prodV.offer = selV.offers[0]
            //                     }
            //                 })
            //                 if (sellerHasProduct == true) {
            //                     prodV.vessel = reqV.vesselDetails;
            //                     prodV.reqName = reqV.name;
            //                     ctrl.sellerOffers.push(prodV)
            //                 }
            //             })
            //         }
            //     })
            // })
            // ctrl.active_prod = ctrl.sellerOffers[0]
        };
        ctrl.canDelinkRequests = function () {
            var selectedRequestIds = [];
            var requestProductActions, products;
            var canDelink = false;
            Object.keys(ctrl.requestCheckboxes).map(function (key, value) {
                if (ctrl.requestCheckboxes[key]) {
                    selectedRequestIds.push(key);
                }
            });
            if (ctrl.requests && selectedRequestIds.length == ctrl.requests.length) return false;
            for (var i = 0; i < selectedRequestIds.length; i++) {
                if (ctrl.requestCheckboxes[selectedRequestIds[i]]) {
                    for (var j = 0; j < ctrl.requests.length; j++) {
                        if (ctrl.requests[j].id == selectedRequestIds[i]) {
                            products = getAllRequestProductList([ctrl.requests[j]])[0];
                            requestProductActions = screenActionsModel.getActionsFromProductList(products);
                            if (screenActionsModel.hasProductAction(SCREEN_ACTIONS.DELINKRFQ, requestProductActions)) {
                                canDelink = true;
                            } else {
                                canDelink = false;
                                break;
                            }
                        }
                    }
                }
                if (canDelink === false) {
                    break;
                }
            }
            return canDelink;
        };
        //remove seller from location group
        ctrl.removeSellerFromLocation = function (seller, locations) {
            physicalSupplierId = null;
            if (typeof seller.offers != "undefined") {
                if (seller.offers.length > 0) {
                    if (seller.offers[0].physicalSupplierCounterparty) {
                        physicalSupplierId = seller.offers[0].physicalSupplierCounterparty.id;
                    }
                }
            }
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            if (sellerV) {
                                if (seller.randUnique == sellerV.randUnique) {
                                    ctrl.requests[reqK].locations[locK].products[prodK].sellers.splice(sellerK, 1);
                                }
                            }
                        });
                    });
                });
            });
            $.each(ctrl.locations, function (locK, locV) {
                $.each(locV.location.sellers, function (selK, selV) {
                    if (selV) {
                        if (seller.randUnique == selV.randUnique) {
                            locV.location.sellers.splice(selK, 1);
                        }
                    }
                });
            });
            for (var i = ctrl.requirements.length - 1; i >= 0; i--) {
                ctrl.requirements[i];
                if (ctrl.requirements[i].randUniquePkg == seller.randUniquePkg) {
                    ctrl.requirements.splice(i, 1);
                }
            }
            // initializeDataArrays(ctrl.requests);
            console.log(ctrl.requests);
            // console.log(ctrl.locations);
            // console.log(ctrl.sellers);
        };
        ctrl.canDeleteSeller = function (seller, locations) {
            var canDeleteSeller = true;
            locationLoop: for (var locationIndex = 0; locationIndex < locations.length; locationIndex++) {
                var location = locations[locationIndex];
                for (var i = 0; i < location.products.length; i++) {
                    var product = location.products[i];
                    for (var j = product.sellers.length - 1; j >= 0; j--) {
                        if (product.sellers[j].randUniquePkg === seller.randUniquePkg) {
                            if (product.sellers[j].offers) {
                                for (var k = product.sellers[j].offers.length - 1; k >= 0; k--) {
                                    var offer = product.sellers[j].offers[k];
                                    if (offer.requestSellerId != 0) {
                                        canDeleteSeller = false;
                                        break locationLoop;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return canDeleteSeller;
        };
        ctrl.gotoContractPlanning = function () {
            var groupId = getGroupId();
            if (groupId < 0) {
                return false;
            }
            $state.go(STATE.CONTRACT_PLANNING, {
                groupId: groupId
            });
        };
        ctrl.reloadGroup = function () {
            $state.reload();
        };
        ctrl.viewEditCounterpartyBlade = function (counterpartyId, location, seller) {

        	ctrl.changeBladeWidgetFunction = null;
            ctrl.blade.widgetType = "none";
        	if ($(".blade-column.main-content-column .ng-dirty").length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewEditCounterpartyBlade',
	        		params : [counterpartyId,location,seller]
	        	}
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

            ctrl.bladeTemplateUrl = "components/blade/templates/gor-blade-content.html";
            if (typeof ctrl.blade == "undefined") {
                ctrl.blade = {};
            }
            ctrl.blade.counterpartyActiveSeller = seller;
            ctrl.blade.counterpartyActiveLocation = location;
            Factory_Master.get_master_entity(counterpartyId, "counterparty", "masters", function (callback) {
                if (callback) {
                    console.log(callback);
                    ctrl.blade.counterpartyData = callback;
                    // ctrl.blade.widgetType = 'general';
                    ctrl.blade.widgetType = "counterparty";
                    // ctrl.blade.colLayout = 'single';
                    // ctrl.blade.colLayout = 'none';
                    ctrl.blade.colLayout = "double";
                    ctrl.blade.activeWidget = "contact";
                    ctrl.blade.counterpartyActiveLocation = location;
                    ctrl.blade.counterpartyActiveProducts = location[0].products;
                    ctrl.blade.activeSeller = seller.requestLocationId + "-" + seller.randUnique;
                    // $rootScope.counterpartyData = callback;
                    $bladeEntity.open("groupOfRequestBlade");
                    ctrl.bladeOpened = true;
                }
            });
            ctrl.dataLoaded = true;
        };
        ctrl.viewSupplierCardBlade = function (seller, loc, products, request) {
        	ctrl.changeBladeWidgetFunction = null;
        	if ($(".blade-column.main-content-column .ng-dirty").length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewSupplierCardBlade',
	        		params : [seller,loc,products,request]
	        	}
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

            ctrl.bladeTemplateUrl = "components/blade/templates/gor-blade-content.html";
            if (typeof ctrl.blade == "undefined") {
                ctrl.blade = {};
            }
            // ctrl.dataLoaded = false;
            ctrl.blade.requestId = null;
            ctrl.blade.counterpartyActiveLocation = loc;
            ctrl.blade.counterpartyData = seller.sellerCounterparty;
            ctrl.blade.counterpartyActiveSeller = seller;
            ctrl.blade.widgetType = "counterparty";
            ctrl.blade.colLayout = "double";
            ctrl.blade.activeWidget = "card";
            ctrl.blade.activeSeller = seller.requestLocationId + "-" + seller.randUnique;
            if (loc) {
                if (loc.length > 0) {
                    loc = loc[0];
                }
            }
            activeSellerCardTab = {
                requestId: products ? products[0].requestId : null,
                rfqId: seller.packageType == "seller" ? seller.offers["0"].rfq.id : null,
                packageType: seller.packageType
            };
            ctrl.initSupplierCardData(loc, seller, activeSellerCardTab);
            uiApiModel.get(MOCKUP_MAP["unrouted.seller-card"]).then(function (data) {
                ctrl.blade_ui = data;
                ctrl.requestDetailsFields = normalizeArrayToHash(ctrl.blade_ui.requestDetails.fields, "name");
                ctrl.bunkerablePortsFields = normalizeArrayToHash(ctrl.blade_ui.bunkerablePorts.fields, "name");
                ctrl.commentsFields = normalizeArrayToHash(ctrl.blade_ui.comments.fields, "name");
                ctrl.productFormFields = normalizeArrayToHash(ctrl.blade_ui.product.fields, "name");
                ctrl.productColumns = normalizeArrayToHash(ctrl.blade_ui.product.columns, "name");
                ctrl.additionalCostColumns = normalizeArrayToHash(ctrl.blade_ui.additionalCost.columns, "name");
                $bladeEntity.open("groupOfRequestBlade");
                ctrl.bladeOpened = true;
            });
        };
        ctrl.viewEnergyContentBlade = function (seller, location, products, productOffer) {


        	ctrl.changeBladeWidgetFunction = null;
        	if ($(".blade-column.main-content-column .ng-dirty").length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewEnergyContentBlade',
	        		params : [seller,location,products,productOffer]
	        	}
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

            ctrl.bladeTemplateUrl = "components/blade/templates/gor-blade-content.html";
            if (location[0]) {
                location = location[0];
            }
            if (typeof ctrl.blade == "undefined") {
                ctrl.blade = {};
            }
            ctrl.blade.requestId = null;
            if (products) {
                if (products.length > 1) {
                    ctrl.blade.requestId = products[0].requestId;
                }
            }
            console.log("!@#");
     
            
            ctrl.dataLoaded = false;
            ctrl.blade.counterpartyActiveLocation = location;
            ctrl.blade.counterpartyActiveSeller = seller;
            // ctrl.blade.counterpartyData = seller.sellerCounterparty;
            // ctrl.blade.counterpartyActiveSeller = seller;
            // ctrl.blade.widgetType = 'general';
            // ctrl.blade.colLayout = 'single';
            // ctrl.blade.colLayout = 'none';
            ctrl.blade.widgetType = "counterparty";
            ctrl.blade.colLayout = "double";
            ctrl.blade.activeWidget = "energyContent";
            ctrl.blade.activeSeller = seller.requestLocationId + "-" + seller.randUnique;
            ctrl.initEnergyBlade(location, seller, productOffer);
            // $rootScope.counterpartyData = callback;
            $bladeEntity.open("groupOfRequestBlade");
            ctrl.bladeOpened = true;
        };
        ctrl.viewRequote = function (seller, theLocation) {

        	ctrl.changeBladeWidgetFunction = null;
        	if ($(".blade-column.main-content-column .ng-dirty").length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewRequote',
	        		params : [seller,theLocation]
	        	}
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

            ctrl.requirements = [];
            if (theLocation.location) {
                ctrl.blade.activeWidget = null;
                uniqueLocationIdentifier = theLocation.uniqueLocationIdentifier;
                locationsList = [];
                $.each(ctrl.requests, function (reqK, reqV) {
                    $.each(reqV.locations, function (locK, locV) {
                        if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
                            locationsList.push(locV);
                        }
                    });
                });
                theLocation = locationsList;
            }
            ctrl.createSellerRequirements(seller, theLocation);

    		cannotSendRequote = false;
            $.each(ctrl.requirements, function(k,v){
            	if (!v.productHasPrice) {
            		cannotSendRequote = true;
            	}
            })

            if (cannotSendRequote) {
            	toastr.error("You cannot send requote for the selected seller because not all the offers have been quoted");
            	return;
            }

            ctrl.bladeTemplateUrl = "components/blade/templates/gor-blade-content.html";
            if (typeof ctrl.blade == "undefined") {
                ctrl.blade = {};
            }
            ctrl.blade.counterpartyActiveLocation = theLocation;
            ctrl.blade.counterpartyData = seller.sellerCounterparty;
            ctrl.blade.counterpartyActiveSeller = seller;
            // ctrl.blade.widgetType = 'general';
            ctrl.blade.widgetType = "counterparty";
            // ctrl.blade.colLayout = 'single';
            // ctrl.blade.colLayout = 'none';
            ctrl.blade.colLayout = "double";
            ctrl.blade.activeWidget = "requote";
            ctrl.blade.activeSeller = seller.requestLocationId + "-" + seller.randUnique;
            // $rootScope.counterpartyData = callback;
            ctrl.requirementsToRequote = ctrl.getRequoteRequirements(seller, theLocation);
            $bladeEntity.open("groupOfRequestBlade");
            ctrl.bladeOpened = true;
            ctrl.dataLoaded = true;
        };
        ctrl.viewBladeSellerRating = function() {
        	ctrl.changeBladeWidgetFunction = null;
        	if ($(".blade-column.main-content-column .ng-dirty").length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewBladeSellerRating',
	        		params : []
	        	}
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

        	ctrl.blade.activeWidget ='rating' ; 
        	ctrl.blade.colLayout = 'double'
        }
        ctrl.changeBladeCounterparty = function (seller, theLocation) {
            // ctrl.dataLoaded = true;
        	ctrl.changeBladeWidgetFunction = null;
        	if ($(".blade-column.main-content-column .ng-dirty").length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.changeBladeCounterparty',
	        		params : [seller,theLocation]
	        	}
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;


            ctrl.blade.productLocation = theLocation;
            ctrl.blade.productSellerId = seller.sellerCounterparty.id;
            ctrl.blade.counterpartyActiveSeller = seller;
            ctrl.blade.counterpartyActiveLocation = theLocation;
            if (ctrl.blade.activeWidget == "email") {
	            setTimeout(function(){
		            ctrl.refreshedRFQEmailBlade = false;
		            $scope.$apply();
		            $scope.$apply();
	            },50)
	            setTimeout(function(){
	                ctrl.previewEmail(seller, theLocation);
	            },100)
            }
            if (ctrl.blade.activeWidget == "card") {
                ctrl.initSupplierCardData(theLocation, seller);
                setTimeout(function () {
                    ctrl.initCardDetails(theLocation);
                    ctrl.initSupplierCardData(theLocation, seller);
                });
            }
            if (ctrl.blade.activeWidget == "energyContent") {
                setTimeout(function () {
                    // ctrl.initCardDetails(theLocation);
                    ctrl.initEnergyBlade(theLocation, seller);
                });
            }
            if (ctrl.blade.activeWidget == "requote") {
                setTimeout(function () { });
                ctrl.viewRequote(seller, theLocation);
            }
            if (ctrl.blade.activeWidget == "contact") {
            	// ctrl.blade.widgetType = "none";
            	ctrl.blade.activeWidget = null
                Factory_Master.get_master_entity(seller.sellerCounterparty.id, "counterparty", "masters", function (callback) {
                    if (callback) {
		            	ctrl.blade.activeWidget = 'contact'
                        ctrl.blade.counterpartyData = callback;
                        ctrl.dataLoaded = true;
                    }
                });
            }
        };
        ctrl.openGeneralWidgetBlade = function (widget) {
            ctrl.bladeTemplateUrl = "components/blade/templates/gor-blade-content.html";
            ctrl.blade.widgetType = "general";
            ctrl.blade.colLayout = "single";
            ctrl.blade.activeWidget = widget;
            $bladeEntity.open("groupOfRequestBlade");
            ctrl.bladeOpened = true;
            ctrl.dataLoaded = true;
        };
        ctrl.groupSellersInLocations = function () {
            groupedLocationsIds = [];
            groupedLocations = [];
            $.each(ctrl.locations, function (locationK, locationV) {
                loc = {};
                if (groupedLocationsIds.indexOf(locationV.uniqueLocationIdentifier) == -1) {
                    groupedLocationsIds.push(locationV.uniqueLocationIdentifier);
                    loc.uniqueLocationIdentifier = locationV.uniqueLocationIdentifier;
                    loc.location = locationV.location;
                    groupedLocations.push(loc);
                }
            });
            // return false;
            $.each(groupedLocations, function (k, v) {
                $.each(ctrl.locations, function (locationK, locationV) {
                    if (locationV.uniqueLocationIdentifier == v.uniqueLocationIdentifier) {
                        $.each(locationV.products, function (k1, v1) {
                            $.each(v1.sellers, function (k2, v2) {
                                if (typeof groupedLocations[k].sellers == "undefined") {
                                    groupedLocations[k].sellers = [];
                                }
                                // if (!v2.isCloned) {
                                v2.uniqueLocationSellerPhysical = locationV.location.id + "-" + v2.randUnique;
                                groupedLocations[k].sellers.push(v2);
                                // }
                            });
                        });
                    }
                    // if (typeof(groupedLocations[k].data) == 'undefined') {
                    //     groupedLocations[k].data = []
                    // }
                    // v.location = locationV.location;
                    // v.uniqueLocationIdentifier = locationV.uniqueLocationIdentifier;
                });
            });
            $.each(groupedLocations, function (k, v) {
                addedSellers = [];
                filteredSellers = [];
                $.each(v.sellers, function (k1, v1) {
                    if (addedSellers.indexOf(v1.randUnique) == -1) {
                        if (!(v1.packageId && !ctrl.packagesConfigurationEnabled)) {
                            addedSellers.push(v1.randUnique);
                            filteredSellers.push(v1);
                        }
                    }
                });
                v.sellers = filteredSellers;
            });
            productIds = getRequestGroupProductIdsCSV(ctrl.requests);
            counterpatyIds = getRequestGroupCounterpartyIdsCSV(ctrl.requests);
            $scope.tempGroupedLocation = angular.copy(groupedLocations);
            groupOfRequestsModel.getSellersSorted(counterpatyIds, productIds, ctrl.sellerSortOrder).then(function (data) {
                $.each($scope.tempGroupedLocation, function (vk, vv) {
                    addedSellers = [];
                    $.each(data.payload, function (dk, dv) {
                        $.each(vv.sellers, function (uosK, uosV) {
                            if (typeof $scope.tempGroupedLocation[vk].orderedSellers == "undefined") {
                                $scope.tempGroupedLocation[vk].orderedSellers = [];
                            }
                            if (dv.counterpartyId == uosV.sellerCounterparty.id) {
                                if (addedSellers.indexOf(uosV.randUniquePkg) == -1) {
                                    $scope.tempGroupedLocation[vk].orderedSellers.push(uosV);
                                    addedSellers.push(uosV.randUniquePkg);
                                }
                            }
                        });
                    });
                    $scope.tempGroupedLocation[vk].sellers = $scope.tempGroupedLocation[vk].orderedSellers;
                });
                // debugger;
                ctrl.groupedSellersByLocation = $scope.tempGroupedLocation;
                // return ctrl.groupedSellersByLocation;
            });
            // debugger;
            //          ctrl.groupedSellersByLocation = groupedLocations;
            //          return ctrl.groupedSellersByLocation;
            // console.log(groupedLocations);
            // ctrl.groupedSellersByLocation = groupedLocations;
            // return ctrl.groupedSellersByLocation;
        };
        ctrl.duplicateSeller = function (seller, location, event) {
            // console.log(seller);
            currentLocationId = location[0].uniqueLocationIdentifier;
            locations = [];
            $.each(ctrl.locations, function (k, v) {
                if (v.uniqueLocationIdentifier == currentLocationId) {
                    locations.push(v);
                }
            });
            randomUnique = Math.random()
                .toString(36)
                .substr(2, 6);
            for (var i = 0; i < locations.length; i++) {
                for (var j = 0; j < locations[i].products.length; j++) {
                    product = locations[i].products[j];
                    // if (!productHasSeller(product, seller.sellerCounterparty.id)) {
                    newSeller = {
                        rfq: null
                    };
                    newSeller.requestLocationId = locations[i].id;
                    newSeller.requestProductId = product.id;
                    newSeller.isCloned = true;
                    newSeller.offers = [
                        {
                            physicalSupplierCounterparty: null
                        }
                    ];
                    newSeller.randUnique = randomUnique + "-null";
                    newSeller.sellerCounterparty = {
                        id: seller.sellerCounterparty.id,
                        name: seller.sellerCounterparty.name
                    };
                    newSeller.randUniquePkg = randomUnique + "-null-individual-null";
                    newSeller.packageType = "individual";
                    newSeller.packageId = null;
                    product.sellers.push(newSeller);
                    // }
                }
            }
            console.log(ctrl.locations);
        };
        ctrl.setAsCurrentSelection = function (obj, src) {
            console.log(obj);
            sellers = "";
            products = "";
            offer = [];
            // if (src == 'table') {
            //     $.each(obj, function(key, val) {
            //         if (key == 0) {
            //             separator = ''
            //         } else {
            //             separator = ','
            //         }
            //         // sellers += separator + val.RequestSellerId;
            //         // products += separator + val.RequestProductId;
            //         products += separator + val.RequestProductId;
            //     })
            // } else {
            $.each(obj, function (key, val) {
                if (val.requestOfferId) {
                    offer.push(val.requestOfferId);
                }
            });
            offerS = offer.join();
            // }
            groupOfRequestsModel.markCurrentSelection(offerS).then(
                function (response) {
                    mySelectionResponse = response.payload.mySelection.quotations;
                    console.log(ctrl.mySelection);
                    ctrl.mySelection = mySelectionResponse;
                    ctrl.mySelectionSurveyorCost = response.payload.mySelection.averageSurveyorCost;
                    return false;
                    console.log(mySelectionResponse);
                    $.each(mySelectionResponse, function (myselRespK, myselRespV) {
                        responseSelectionIsInCurrentSelection = false;
                        $.each(ctrl.mySelection, function (myselK, myselV) {
                            if (myselV.products[0].request.id == myselRespV.products[0].request.id && myselV.product.id == myselRespV.product.id && myselV.location.id == myselRespV.location.id) {
                                ctrl.mySelection[myselK] = myselRespV;
                                responseSelectionIsInCurrentSelection = true;
                            }
                        });
                        if (responseSelectionIsInCurrentSelection == false) {
                            ctrl.mySelection.push(myselRespV);
                        }
                    });
                },
                function (response) {
                    console.log(response);
                }
            );
            // if (typeof ctrl.mySelection == 'undefined') {
            //     ctrl.mySelection = [];
            // }
            // $.each(ctrl.mySelection, function(key, val) {
            //     if (typeof val == 'undefined') {
            //         ctrl.mySelection = [];
            //     } else {
            //         if (val.src == src) {
            //             ctrl.mySelection.splice(key, 1)
            //         }
            //     }
            // })
            // $.each(obj, function(key, val) {
            //     obj[key].src = src;
            //     if (src == 'table') {
            //         $.each(ctrl.locations, function(locationKey, locationVal) {
            //             if (locationVal.id == val.RequestLocationId) {
            //                 obj[key].location = locationVal.location;
            //                 obj[key].products = locationVal.products;
            //                 $.each(locationVal.products, function(prodk, prodv) {
            //                     if (prodv.product.id == val.ProductId) {
            //                         obj[key].product = prodv.product;
            //                         obj[key].qty = prodv.maxQuantity;
            //                         obj[key].uom = prodv.uom;
            //                     }
            //                     $.each(prodv.sellers, function(sellerk, sellerv) {
            //                         if (sellerv.sellerCounterparty.id == val.SellerId) {
            //                             obj[key].seller = sellerv.sellerCounterparty;
            //                             obj[key].currency = sellerv.quoteByCurrency;
            //                             obj[key].offer = sellerv.offers[0];
            //                         }
            //                     })
            //                 })
            //             }
            //         })
            //     } else {
            //         obj[key].offer = {
            //             "totalAmount": val.amount,
            //             "offerPrice": val.price
            //         }
            //     }
            //     ctrl.mySelection.push(val);
            // })
            // console.log(obj)
            //
            // ctrl.mySelection.concat(obj)
        };
        ctrl.checkIfPriceChanged = function (value) {
            ctrl.checkedIfPriceChanged = value;
        };
        ctrl.savePriceChange = function (priceValue, requestOfferId, seller, locations, productSample) {
            if (ctrl.checkedIfPriceChanged == priceValue) {
                return false;
            }
            $scope.tempRequestOfferId = requestOfferId;
            if((priceValue < 1 && productSample.productTypeId != 8 && productSample.allowZeroPricing == false)){
                toastr.error("Please enter a price greater than 0");
                // return false;
            }
            if (isNaN(priceValue) || priceValue == '') {
                $.each(ctrl.requests, function (reqK, reqV) {
                    $.each(reqV.locations, function (locK, locV) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.offers) {
                                    $.each(sellerV.offers, function (ofK, ofV) {
                                        if (ofV.id == $scope.tempRequestOfferId) {
                                            ofV.price = ctrl.checkedIfPriceChanged;
                                        }
                                    });
                                }
                            });
                        });
                    });
                });
                return false;
            }
            payloadLocation = null;
            curentOfferRequestId = productSample.requestId;
            $.each(ctrl.requests, function(reqK,reqV){
            	if (reqV.id == curentOfferRequestId) {
		            payloadLocation = reqV.locations;
            	}
            })



            ctrl.priceInputsDisabled = true;
            toastr.info("Please wait while prices are updating");
            priceData = {
                "RequestOfferId": requestOfferId,
                "Price": priceValue,
                "Locations" : payloadLocation
            };
        

            groupOfRequestsModel.updatePrice(priceData).then(
               
                function (response) {

                ctrl.priceInputsDisabled = false;
                ctrl.requirements = [];
                ctrl.requirementRequestProductIds = [];
                // ctrl.initScreen();
             //    groupOfRequestsModel.getBestOffer(getRequestGroupProductIdsCSV(ctrl.requests)).then(function(data) {
	            //     ctrl.bestOfferData = data.payload;
	            // });    
	            // groupOfRequestsModel.getBestTco(getRequestGroupProductIdsCSV(ctrl.requests), ctrl.groupId).then(function(data) {
	            //     ctrl.bestTcoData = data.payload;
	            //     ctrl.bestTcoData = $scope.modelBestTCODataForTemplating(ctrl.bestTcoData);
	            //     ctrl.mySelection = data.payload.mySelection.quotations;
	            //     ctrl.mySelectionSurveyorCost = data.payload.mySelection.averageSurveyorCost;
	            // });   

	            oldData = angular.copy(ctrl.requests);
	            $.each(oldData, function(rk,rv){
	            	if (rv.id == response.payload.id) {
	            		oldData[rk] = angular.copy(response.payload);
	            	}
	            })
	            skipSellerSorting = true;
	            // ctrl.sortSellers();
	            parseRequestList(oldData, false, skipSellerSorting);
                ctrl.locations = getLocationsFromRequests(ctrl.requests);
                ctrl.products = getAllRequestProductList(ctrl.requests);
                setRequestProductCount(ctrl.requests);
                //initialize notifications
                notificationsModel.stop();
                notificationsModel.start(getRequestIds(ctrl.requests));
                //calculates screen actions
                ctrl.calculateScreenActions();      
                if (ctrl.nextPriceInput) {
                	setTimeout(function(){
	                	$('[productPriceIndexNo='+ctrl.nextPriceInput+']').click();
	                	$('[productPriceIndexNo='+ctrl.nextPriceInput+']').focus();
                	},100)
                }          
                return false;


                    // ctrl.priceInputsDisabled = false;
                    ctrl.requirements = [];
                    ctrl.requirementRequestProductIds = [];
                    // ctrl.selectedRequests = null;
                    ctrl.initScreen();
                    // $state.reload();
                    return false;
                    // newData = [];
                    // newData[0] = response.payload;
                    // newData = $scope.remodelSellersStructure(newData);
                    // $.each(ctrl.requests, function(reqK, reqV) {
                    //     if (newData[0].id == reqV.id) {
                    //         ctrl.requests[reqK] = newData[0]
                    //         // reqV = newData[0];
                    //     }
                    // })
                    // parseRequestList(ctrl.requests);
                    // initializeDataArrays(ctrl.requests);
                    // groupOfRequestsModel.getBestTco(getRequestGroupProductIdsCSV(ctrl.requests), ctrl.groupId).then(function(data) {
                    //     ctrl.bestTcoData = data.payload;
                    //     ctrl.mySelection = data.payload.mySelection.quotations;
                    //     ctrl.mySelectionSurveyorCost = data.payload.mySelection.averageSurveyorCost;
                    // });
                    // parseRequestList(ctrl.requests);
                    // ctrl.checkedIfPriceChanged = null;
                },
                function (response) {
                    ctrl.priceInputsDisabled = false;
                    $.each(ctrl.requests, function (reqK, reqV) {
                        $.each(reqV.locations, function (locK, locV) {
                            $.each(locV.products, function (prodK, prodV) {
                                $.each(prodV.sellers, function (sellerK, sellerV) {
                                    if (sellerV.offers) {
                                        $.each(sellerV.offers, function (ofK, ofV) {
                                            if (ofV.id == $scope.tempRequestOfferId) {
                                                ofV.price = ctrl.checkedIfPriceChanged;
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    });
                    ctrl.requirements = [];
                    ctrl.requirementRequestProductIds = [];
                    ctrl.checkedIfPriceChanged = null;
                    console.log(response);
                }
            );
        };

        ctrl.checkIfPhysicalSupplierChanged = function (oldSupplier, seller) {
            ctrl.oldSupplierBeforeChange = oldSupplier;
            requestLocationId = seller.requestLocationId;
            randUnique = seller.randUnique;
            console.log(seller);
        };
        
        ctrl.calculateUniqueCounterpartyType = function (seller) {
            allCounterpartyTypes = [];
            $.each(seller.counterpartyTypes, function (k, v) {
                allCounterpartyTypes.push(v.name);
            });
            returnData = {};
            if (allCounterpartyTypes.indexOf("Seller") != -1 && allCounterpartyTypes.indexOf("Supplier") != -1) {
              returnData.sellerUniqueCounterpartyType = "Supplier";
              returnData.counterpartyTypeFontClass = "font-yellow-gold";
              return returnData;
            }
            if (allCounterpartyTypes.indexOf("Supplier") != -1) {
                returnData.sellerUniqueCounterpartyType = "Supplier";
                returnData.counterpartyTypeFontClass = "font-yellow-lemon";
                return returnData;
            }
            if (allCounterpartyTypes.indexOf("Seller") != -1) {
                returnData.sellerUniqueCounterpartyType = "Seller";
                returnData.counterpartyTypeFontClass = "font-green-jungle";
                return returnData;
            }
            if (allCounterpartyTypes.indexOf("Broker") != -1) {
                returnData.sellerUniqueCounterpartyType = "Broker";
                returnData.counterpartyTypeFontClass = "font-blue";
                return returnData;
            }
        };
        ctrl.findTotalSellersOnLocation = function (location) {
            groupedLocationsIds = [];
            groupedLocations = [];
            $.each(ctrl.locations, function (locationK, locationV) {
                if (groupedLocationsIds.indexOf(locationV.location.id) == -1) {
                    groupedLocationsIds.push(locationV.location.id);
                    groupedLocations.push(locationV.location);
                }
                $.each(groupedLocations, function (k, v) {
                    if (locationV.location.id == v.id) {
                        $.each(locationV.products, function (k1, v1) {
                            $.each(v1.sellers, function (k2, v2) {
                                if (typeof groupedLocations[k].sellers == "undefined") {
                                    groupedLocations[k].sellers = [];
                                }
                                groupedLocations[k].sellers.push(v2);
                            });
                        });
                    }
                });
            });
            $.each(groupedLocations, function (k, v) {
                addedSellers = [];
                filteredSellers = [];
                $.each(v.sellers, function (k1, v1) {
                    physicalSupplierId = null;
                    if (typeof v1.offers != "undefined") {
                        if (v1.offers.length > 0) {
                            if (v1.offers[0].physicalSupplierCounterparty) {
                                physicalSupplierId = v1.offers[0].physicalSupplierCounterparty.id;
                            }
                        }
                    }
                    composedSellerIds = v1.sellerCounterparty.id + " - " + physicalSupplierId;
                    if (addedSellers.indexOf(composedSellerIds) == -1) {
                        addedSellers.push(composedSellerIds);
                        filteredSellers.push(v1);
                    }
                });
                v.sellers = filteredSellers;
            });
            locationId = location[0].location.id;
            sellerLocations = groupedLocations;
            data = {};
            // allSellersIds = [];
            $.each(sellerLocations, function (locK, locV) {
                if (locationId == locV.id) {
                    data.found = 0;
                    $.each(locV.sellers, function (sellerK, sellerV) {
                        physicalSupplierName = null;
                        if (typeof sellerV.offers != "undefined") {
                            if (sellerV.offers.length > 0) {
                                if (sellerV.offers[0].physicalSupplierCounterparty) {
                                    physicalSupplierName = sellerV.offers[0].physicalSupplierCounterparty.name;
                                }
                            }
                        }
                        loopSellerNameComposed = sellerV.sellerCounterparty.name + " " + physicalSupplierName;
                        loopSellerNameComposed = loopSellerNameComposed.toLowerCase();
                        if (loopSellerNameComposed.indexOf(ctrl.searchTermNegotiationTable) != -1) {
                            data.found += 1;
                        }
                    });
                    data.total = locV.sellers.length;
                }
            });
            /*rewrite*/
            uniqueLocationIdentifier = location[0].uniqueLocationIdentifier;
            uniqeSellers = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (uniqeSellers.indexOf(sellerV.randUniquePkg) == -1) {
                                    if (!(sellerV.packageId && !ctrl.packagesConfigurationEnabled)) {
                                        uniqeSellers.push(sellerV.randUniquePkg);
                                    }
                                }
                            });
                        });
                    }
                });
            });
            data.total = uniqeSellers.length;
            /*rewrite*/
            return data;
        };
        ctrl.performSellersSearchInTable = function (keyword) {
            console.log(keyword);
            console.log(ctrl.requests);
            requests = ctrl.requests;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    reqV.locations[locK].foundInSearch = 0;
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            physicalSupplierName = null;
                            if (typeof sellerV.offers != "undefined") {
                                if (sellerV.offers.length > 0) {
                                    if (sellerV.offers[0].physicalSupplierCounterparty) {
                                        physicalSupplierName = sellerV.offers[0].physicalSupplierCounterparty.name;
                                    }
                                }
                            }
                            loopSellerNameComposed = sellerV.sellerCounterparty.name + " " + physicalSupplierName;
                            loopSellerNameComposed = loopSellerNameComposed.toLowerCase();
                            if (loopSellerNameComposed.indexOf(keyword) == -1) {
                                sellerV.isInSearch = false;
                            } else {
                                sellerV.isInSearch = true;
                                reqV.locations[locK].foundInSearch += 1;
                            }
                        });
                    });
                });
            });
        };
        ctrl.updatePhysicalSupplierForSellers = function (seller, newSupplier, location, event) {
            // oldSupplier = ctrl.oldSupplierBeforeChange;
            ctrl.disablePhysicalSupplierLookup = true;
            oldSupplier = seller.oldPhysicalSupplier;
            randUnique = seller.randUnique;
            randUniquePkg = seller.randUniquePkg;
            // if (typeof(newSupplier) == 'undefined') {ctrl.disablePhysicalSupplierLookup = false; return false;}
            if (newSupplier && oldSupplier) {
	            if (newSupplier.id === oldSupplier.id) {
	                ctrl.disablePhysicalSupplierLookup = false;
	                return false;
	            }
            }

            if (!newSupplier) {
                $.each(location, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            if (sellerV.randUnique == randUnique) {
                            	if (sellerV.offers.length > 0) {
	                                sellerV.offers[0].physicalSupplierCounterparty = oldSupplier;
                            	}
                            }
                        });
                    });
                });
                console.log();
                ctrl.disablePhysicalSupplierLookup = false;
                if ($($(event.target).parent(".physicalSupplier")).find($("[uib-typeahead-popup].dropdown-menu")).css("display") == 'none' ) {
	                toastr.error("You must select a Physical Supplier");
                }                
                return
            }
            if (seller.isCloned) {
                $.each(location, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            if (sellerV.randUnique == randUnique) {
                                console.log(sellerV);
                                if (typeof sellerV.offers == "undefined") {
                                    sellerV.offers = [
                                        {
                                            physicalSupplierCounterparty: newSupplier
                                        }
                                    ];
                                } else {
                                    sellerV.offers[0].physicalSupplierCounterparty = newSupplier;
                                }
                                if (!newSupplier) {
                                    sellerV.offers[0].physicalSupplierCounterparty = oldSupplier;
                                }
                            }
                        });
                    });
                });
                ctrl.disablePhysicalSupplierLookup = false;
            } else {
                if (typeof newSupplier != "undefined") {
                    if (newSupplier) {
                        newSupplierId = newSupplier.id;
                        newRandUnique = seller.sellerCounterparty.id + "-" + newSupplier.id;
                    } else {
                        newSupplierId = null;
                        newRandUnique = seller.sellerCounterparty.id + "-null";
                    }
                    sellerWithSupplierExists = false;
                    /*****
                    LOGIC FOR PACKAGES ACROSS SAME LOCATION
                    ****/
                    if (seller.packageType == "individual") {
                        $.each(location, function (locK, locV) {
                            $.each(locV.products, function (prodK, prodV) {
                                $.each(prodV.sellers, function (sellerK, sellerV) {
                                    if (sellerV.randUnique == newRandUnique && sellerV.packageType == seller.packageType) {
                                        sellerWithSupplierExists = true;
                                    }
                                });
                            });
                        });
                    } else {
                        activeRandUniquePkg = seller.randUniquePkg;
                        activeRandUnique = randUnique;
                        activeLocationId = location[0].location.id;
                        activePackageType = seller.packageType;
                        activeRequestProductIds = [];
                        sameSellerSupplierRequestProductIds = [];
                        packageRequestSellerIds = [];
                        $.each(ctrl.requests, function (reqK, reqV) {
                            $.each(reqV.locations, function (locK, locV) {
                                $.each(locV.products, function (prodK, prodV) {
                                    $.each(prodV.sellers, function (selK, selV) {
                                        if (selV.randUniquePkg == activeRandUniquePkg) {
                                            if (selV.offers.length > 0) {
                                                packageRequestSellerIds.push(selV.id);
                                                activeRequestProductIds.push(prodV.id);
                                            }
                                        }
                                    });
                                });
                            });
                        });
                        $.each(ctrl.requests, function (reqK, reqV) {
                            $.each(reqV.locations, function (locK, locV) {
                                if (locV.location.id == activeLocationId) {
                                    $.each(locV.products, function (prodK, prodV) {
                                        $.each(prodV.sellers, function (selK, selV) {
                                            if (selV.randUnique == newRandUnique && selV.randUniquePkg != activeRandUniquePkg && selV.packageType == activePackageType) {
                                                if (selV.offers.length > 0) {
                                                    sameSellerSupplierRequestProductIds.push(prodV.id);
                                                }
                                            }
                                        });
                                    });
                                }
                            });
                        });
                        $.each(activeRequestProductIds, function (k, v) {
                            $.each(sameSellerSupplierRequestProductIds, function (k1, v1) {
                                if (v == v1) {
                                    sellerWithSupplierExists = true;
                                }
                            });
                        });
                        console.log(activeRequestProductIds);
                        console.log(sameSellerSupplierRequestProductIds);
                    }
                    /*****
                    LOGIC FOR PACKAGES ACROSS SAME LOCATION
                    ****/
                    console.log(sellerWithSupplierExists);
                    if (sellerWithSupplierExists) {
                        $.each(location, function (locK, locV) {
                            $.each(locV.products, function (prodK, prodV) {
                                $.each(prodV.sellers, function (sellerK, sellerV) {
                                    if (sellerV.randUnique == randUnique) {
                                        if (typeof sellerV.offers == "undefined") {
                                            sellerV.offers = [
                                                {
                                                    physicalSupplierCounterparty: oldSupplier
                                                }
                                            ];
                                        } else {
                                            sellerV.offers[0].physicalSupplierCounterparty = oldSupplier;
                                        }
                                    }
                                });
                            });
                        });
                        toastr.error("The selected Physical Supplier already exist for that seller on that location");
                    } else {
                        requestOfferIds = [];
                        $.each(location, function (locK, locV) {
                            $.each(locV.products, function (prodK, prodV) {
                                $.each(prodV.sellers, function (sellerK, sellerV) {
                                    if (sellerV.randUniquePkg == randUniquePkg) {
                                        if (sellerV.offers.length > 0) {
                                            requestOfferIds.push(sellerV.offers[0].id);
                                        }
                                    }
                                });
                            });
                        });
                        // requestSellerIds = JSON.stringify(requestSellerIds)
                        if (seller.packageType == "seller" || seller.packageType == "buyer") {
                            requestSellerIds = packageRequestSellerIds;
                        }
                        // "RequestSellerIds": requestSellerIds,
                        data = {
                            RequestOfferIds: requestOfferIds,
                            PhysicalSupplierId: newSupplierId
                        };
                        if (typeof data.RequestOfferIds[0] != "undefined") {
                            groupOfRequestsModel.updatePhysicalSupplier(data).then(
                                function (newRequestData) {
                                    ctrl.disablePhysicalSupplierLookup = false;
                                    if (newRequestData.isSuccess) {
                                        if (seller.packageType == "individual") {
                                            $.each(location, function (locK, locV) {
                                                $.each(locV.products, function (prodK, prodV) {
                                                    $.each(prodV.sellers, function (sellerK, sellerV) {
                                                        if (sellerV.randUnique == randUnique && sellerV.packageType == seller.packageType) {
                                                            if (typeof sellerV.offers == "undefined") {
                                                                sellerV.offers = [
                                                                    {
                                                                        physicalSupplierCounterparty: newSupplier
                                                                    }
                                                                ];
                                                            } else {
                                                                sellerV.offers[0].physicalSupplierCounterparty = newSupplier;
                                                            }
                                                            sellerV.randUnique = newRandUnique;
                                                            sellerV.randUniquePkg = newRandUnique + "-" + seller.packageType + "-" + seller.packageId;
                                                            sellerV.oldPhysicalSupplier = newSupplier;
                                                        }
                                                    });
                                                });
                                            });
                                        } else {
                                            $.each(ctrl.requests, function (reqK, reqV) {
                                                $.each(reqV.locations, function (locK, locV) {
                                                    if (locV.location.id == activeLocationId) {
                                                        $.each(locV.products, function (prodK, prodV) {
                                                            $.each(prodV.sellers, function (selK, selV) {
                                                                if (selV.randUniquePkg == activeRandUniquePkg) {
                                                                    if (typeof selV.offers == "undefined") {
                                                                        selV.offers = [
                                                                            {
                                                                                physicalSupplierCounterparty: newSupplier
                                                                            }
                                                                        ];
                                                                    } else {
                                                                        selV.offers[0].physicalSupplierCounterparty = newSupplier;
                                                                    }
                                                                    selV.randUnique = newRandUnique;
                                                                    selV.randUniquePkg = newRandUnique + "-" + seller.packageType + "-" + seller.packageId;
                                                                    selV.oldPhysicalSupplier = newSupplier;
                                                                }
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        }
                                    }
                                    ctrl.initScreen();
                                    return false;
                                    // $state.reload();
                                },
                                function (response) {
                                    $.each(location, function (locK, locV) {
                                        $.each(locV.products, function (prodK, prodV) {
                                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                                if (sellerV.randUnique == randUnique && sellerV.packageType == seller.packageType) {
                                                    if (typeof sellerV.offers == "undefined") {
                                                        sellerV.offers = [
                                                            {
                                                                physicalSupplierCounterparty: oldSupplier
                                                            }
                                                        ];
                                                    } else {
                                                        sellerV.offers[0].physicalSupplierCounterparty = oldSupplier;
                                                    }
                                                }
                                            });
                                        });
                                    });
                                    ctrl.disablePhysicalSupplierLookup = false;
                                    ctrl.initScreen();
                                    return false;
                                    // $state.reload();
                                }
                            );
                        } else {
                            $.each(location, function (locK, locV) {
                                $.each(locV.products, function (prodK, prodV) {
                                    $.each(prodV.sellers, function (sellerK, sellerV) {
                                        if (sellerV.randUnique == randUnique && sellerV.packageType == seller.packageType) {
                                            if (typeof sellerV.offers == "undefined") {
                                                sellerV.offers = [
                                                    {
                                                        physicalSupplierCounterparty: newSupplier
                                                    }
                                                ];
                                            } else if (sellerV.offers.length == 0) {
                                                sellerV.offers = [
                                                    {
                                                        physicalSupplierCounterparty: newSupplier
                                                    }
                                                ];
                                            } else {
                                                sellerV.offers[0].physicalSupplierCounterparty = newSupplier;
                                            }
                                        }
                                    });
                                });
                            });
                            ctrl.disablePhysicalSupplierLookup = false;
                        }
                    }
                } else {
                    $.each(location, function (locK, locV) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.randUnique == randUnique && sellerV.packageType == seller.packageType) {
                                    if (typeof sellerV.offers == "undefined") {
                                        sellerV.offers = [
                                            {
                                                physicalSupplierCounterparty: oldSupplier
                                            }
                                        ];
                                    } else {
                                        sellerV.offers[0].physicalSupplierCounterparty = oldSupplier;
                                    }
                                }
                            });
                        });
                    });
                    ctrl.disablePhysicalSupplierLookup = false;
                }
            }
            if (ctrl.hasSellerRequirements(seller.sellerCounterparty.id, location, seller)) {
                ctrl.createSellerRequirements(seller, location, null);
            }
            setTimeout(function () {
                ctrl.disablePhysicalSupplierLookup = false;
            }, 3000);
        };
        ctrl.returnLocationReqOffIds = function (location, randUniquePkg) {
            requestOfferIds = [];
            $.each(location, function (locK, locV) {
                $.each(locV.products, function (prodK, prodV) {
                    $.each(prodV.sellers, function (sellerK, sellerV) {
                        if (sellerV.randUniquePkg == randUniquePkg) {
                            if (sellerV.offers.length > 0) {
                                requestOfferIds.push(sellerV.offers[0].id);
                            }
                        }
                    });
                });
            });
            return requestOfferIds;
        };
        ctrl.updateBrokerForSellers = function (seller, newBroker, location) {
            // oldSupplier = ctrl.oldSupplierBeforeChange;
            ctrl.disableBrokerLookup = true;
            oldBroker = seller.oldBroker;
            randUniquePkg = seller.randUniquePkg;
            if (newBroker === oldBroker) {
                ctrl.disableBrokerLookup = false;
                return false;
            }
            if (seller.isCloned) {
                $.each(location, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            if (sellerV.randUniquePkg == randUniquePkg) {
                                console.log(sellerV);
                                if (typeof sellerV.offers == "undefined") {
                                    sellerV.offers = [
                                        {
                                            brokerCounterparty: newBroker
                                        }
                                    ];
                                } else {
                                    sellerV.offers[0].brokerCounterparty = newBroker;
                                    $.each(ctrl.requirements, function(k,v){
                                    	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                    		v.BrokerCounterpartyId = newBroker.id;
                                    	}
                                    })
                                }
                            }
                        });
                    });
                });
                ctrl.disableBrokerLookup = false;
            } else {
                requestOfferIds = ctrl.returnLocationReqOffIds(location, randUniquePkg);
                data = {
                    RequestOfferIds: requestOfferIds,
                    BrokerId: newBroker ? newBroker.id : null
                };
                if (typeof data.RequestOfferIds[0] != "undefined") {
                    groupOfRequestsModel.updateBroker(data).then(
                        function (response) {
                            ctrl.disableBrokerLookup = false;
                            ctrl.initScreen();
                            return false;
                            if (response.isSuccess) {
                                $.each(location, function (locK, locV) {
                                    $.each(locV.products, function (prodK, prodV) {
                                        $.each(prodV.sellers, function (sellerK, sellerV) {
                                            if (sellerV.randUniquePkg == randUniquePkg) {
                                                console.log(sellerV);
                                                if (typeof sellerV.offers == "undefined") {
                                                    sellerV.offers = [
                                                        {
                                                            brokerCounterparty: newBroker
                                                        }
                                                    ];
                                                } else {
                                                    sellerV.offers[0].brokerCounterparty = newBroker;
                                                    $.each(ctrl.requirements, function(k,v){
                                                    	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                                    		v.BrokerCounterpartyId = newBroker.id;
                                                    	}
                                                    })
                                                }
                                            }
                                        });
                                    });
                                });
                            }
                        },
                        function () {
                            ctrl.disableBrokerLookup = false;
                        }
                    );
                } else {
                    ctrl.disableBrokerLookup = false;
                    $.each(location, function (locK, locV) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (seller.sellerCounterparty.id == sellerV.sellerCounterparty.id) {
                                    console.log(sellerV);
                                    if (typeof sellerV.offers == "undefined") {
                                        sellerV.offers = [
                                            {
                                                brokerCounterparty: newBroker
                                            }
                                        ];
                                    } else {
                                        if (sellerV.offers.length == 0) {
                                            sellerV.offers = [
                                                {
                                                    brokerCounterparty: newBroker
                                                }
                                            ];
                                        } else {
                                            sellerV.offers[0].brokerCounterparty = newBroker;
                                            $.each(ctrl.requirements, function(k,v){
                                            	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                            		v.BrokerCounterpartyId = newBroker.id;
                                            	}
                                            })
                                        }
                                    }
                                }
                            });
                        });
                    });                    
                }
            }
            setTimeout(function () {
                ctrl.disableBrokerLookup = false;
            }, 3000);
        };
        ctrl.updateContactForSellers = function (seller, newContact, location) {
            // oldSupplier = ctrl.oldSupplierBeforeChange;
            ctrl.disableContactLookup = true;
            oldContact = seller.oldContact;
            randUniquePkg = seller.randUniquePkg;
            if (newContact)
                if (oldContact)
                    if (newContact.id === oldContact.id) {
                        ctrl.disableContactLookup = false;
                        return false;
                    }
            if (seller.isCloned) {
                $.each(location, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            if (sellerV.randUniquePkg == randUniquePkg) {
                                console.log(sellerV);
                                if (typeof sellerV.offers == "undefined") {
                                    sellerV.offers = [
                                        {
                                            contactCounterparty: newContact
                                        }
                                    ];
                                } else {
                                    sellerV.offers[0].contactCounterparty = newContact;
                                    $.each(ctrl.requirements, function(k,v){
                                    	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                    		v.ContactCounterpartyId = newContact.id;
                                    	}
                                    })
                                }
                            }
                        });
                    });
                });
                ctrl.disableContactLookup = false;
            } else {
                requestOfferIds = [];
                $.each(location, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            if (sellerV.sellerCounterparty.id == seller.sellerCounterparty.id) {
                                if (sellerV.offers.length > 0) {
                                    requestOfferIds.push(sellerV.offers[0].id);
                                }
                            }
                        });
                    });
                });
                data = {
                    RequestOfferIds: requestOfferIds,
                    SellerContactId: newContact ? newContact.id : null
                };
                if (typeof data.RequestOfferIds[0] != "undefined") {
                    groupOfRequestsModel.updateContact(data).then(
                        function (response) {
                            ctrl.disableContactLookup = false;
                            if (response.isSuccess) {
                                ctrl.initScreen();
                                return false;
                                $.each(location, function (locK, locV) {
                                    $.each(locV.products, function (prodK, prodV) {
                                        $.each(prodV.sellers, function (sellerK, sellerV) {
                                            if (sellerV.randUniquePkg == randUniquePkg) {
                                                console.log(sellerV);
                                                if (typeof sellerV.offers == "undefined") {
                                                    sellerV.offers = [
                                                        {
                                                            contactCounterparty: newContact
                                                        }
                                                    ];
                                                } else {
                                                    sellerV.offers[0].contactCounterparty = newContact;
                                                    $.each(ctrl.requirements, function(k,v){
                                                    	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                                    		v.ContactCounterpartyId = newContact.id;
                                                    	}
                                                    })
                                                }
                                            }
                                        });
                                    });
                                });
                            }
                        },
                        function () {
                            ctrl.disableContactLookup = false;
                        }
                    );
                } else {
                    ctrl.disableContactLookup = false;
                    $.each(location, function (locK, locV) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (seller.sellerCounterparty.id == sellerV.sellerCounterparty.id) {
                                    console.log(sellerV);
                                    if (typeof sellerV.offers == "undefined") {
                                        sellerV.offers = [
                                            {
                                                contactCounterparty: newContact
                                            }
                                        ];
                                    } else {
                                        if (sellerV.offers.length == 0) {
                                            sellerV.offers = [
                                                {
                                                    contactCounterparty: newContact
                                                }
                                            ];
                                        } else {
                                            sellerV.offers[0].contactCounterparty = newContact;
                                            $.each(ctrl.requirements, function(k,v){
                                            	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                            		v.ContactCounterpartyId = newContact.id;
                                            	}
                                            })
                                        }
                                    }
                                }
                            });
                        });
                    });
                }
            }
            setTimeout(function () {
                ctrl.disableContactLookup = false;
            }, 3000);
        };
        ctrl.getContactListForSeller = function (seller, callback) {
            if (typeof ctrl.sellerContactList == "undefined") {
                ctrl.sellerContactList = [];
            }
            payload = {
                Payload: seller.sellerCounterparty.id
            };
            endpoint = API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/activeEmailContacts";
            if (!ctrl.sellerContactList["s" + seller.sellerCounterparty.id]) {
	            $http.post(endpoint, payload).then(function success(response) {
	                if (response.status == 200) {
	                    ctrl.sellerContactList["s" + seller.sellerCounterparty.id] = response.data.payload;
	                    if (seller.offers.length == 0 && response.data.payload.length == 1) {
	                        seller.offers[0] = {};
	                        seller.offers[0].contactCounterparty = response.data.payload[0];
	                    }
	                }
	                callback(response.data.payload)
	            });
            }
        };
        ctrl.diffProducts = function () {
            // INIDIVIDUAL
            ctrl.ids = [];
            ctrl.differentProducts = [];
            ctrl.bestTcoData.bestIndividuals.grandTotal = 0;
            $.each(ctrl.bestTcoData.bestIndividuals, function (key, val) {
                val.request.amount = 0;
                $.each(val.bestTCO, function (skey, sval) {
                    val.request.amount += Number(sval.amount);
                    val.request.vessel = sval.vessel;
                    ctrl.bestTcoData.bestIndividuals.grandTotal += sval.amount;
                    if ($.inArray(sval.product.id, ctrl.ids) == -1) {
                        sval.product.amount = sval.amount;
                        ctrl.differentProducts.push(sval.product);
                    } else {
                        $.each(ctrl.differentProducts, function (k, v) {
                            if (v.id == sval.product.id) {
                                v.amount += sval.amount;
                            }
                        });
                    }
                    ctrl.ids.push(sval.product.id);
                });
            });
            // PACKAGES
            ctrl.bestPackagesGrandTotal = 0;
            $.each(ctrl.bestTcoData.bestPackages, function (key, val) {
                ctrl.bestPackagesGrandTotal += val.tco;
            });
            if (ctrl.includeAverageSurveyorChargeChecbox == true) {
                $.each(ctrl.bestTcoData.bestIndividuals, function (key, val) {
                    ctrl.bestTcoData.bestIndividuals.grandTotal += val.surveyorCost;
                });
                $.each(ctrl.bestTcoData.bestPackages, function (key, val) {
                    ctrl.bestPackagesGrandTotal += val.surveyorCost;
                });
            }
            // ctrl.bestTcoData.bestIndividuals.surveyorCost = ctrl.bestTcoData.bestIndividuals.surveyorCost;
        };
        ctrl.calculateBestTotalTCOGrandTotal = function () {
            ctrl.bestTotalTCOGrandTotal = 0;
            ctrl.tcoSurveyorCost = 0;
            $.each(ctrl.bestTcoData.bestTotalTCO, function (tcoK, tcoV) {
                $.each(tcoV.products, function (pk, pv) {
                    ctrl.bestTotalTCOGrandTotal += pv.amount;
                });
                if (ctrl.includeAverageSurveyorChargeChecbox == true) {
                    ctrl.bestTotalTCOGrandTotal += tcoV.surveyorCost;
                    if (tcoV.surveyorCost) {
                        ctrl.tcoSurveyorCost += tcoV.surveyorCost;
                    }
                }
            });
            return ctrl.bestTotalTCOGrandTotal;
        };
        ctrl.calculateSellerIsVisible = function (key, seller, location) {
            isVisible = true;
            if (ctrl.displayNoOfSellers) {
	            if (ctrl.displayNoOfSellers.name == "All") {
	                numberOfSellersToDisplay = 9999;
	            } else {
	                numberOfSellersToDisplay = parseFloat(ctrl.displayNoOfSellers.name);
	            }
            } else {
                numberOfSellersToDisplay = 0;
            }
            if (ctrl.searchTermNegotiationTable == null) {
                if (key >= numberOfSellersToDisplay) {
                    isVisible = false;
                }
                if (location[0].sellersExpanded) {
                    isVisible = true;
                }
                if (location[0].fullLocationSellersExpanded) {
                    isVisible = false;
                }
            } else {
                isVisible = true;
            }
            if (ctrl.searchTermNegotiationTable == "") {
                if (key >= numberOfSellersToDisplay) {
                    isVisible = false;
                }
                if (location[0].sellersExpanded) {
                    isVisible = true;
                }
                if (location[0].fullLocationSellersExpanded) {
                    isVisible = false;
                }
            }
            if (seller.isCloned) {
                isVisible = true;
            }
            return isVisible;
        };
        ctrl.checkIfHasRevokedRFQsAll = function (seller, currentSellerLocation) {
            AllRFQsAreRevoked = true;
            $.each(currentSellerLocation, function (locK, locV) {
                $.each(locV.products, function (prodK, prodV) {
                    $.each(prodV.sellers, function (sellerK, sellerV) {
                        if (seller.randUnique == sellerV.randUnique) {
                            if (typeof sellerV.offers != "undefined") {
                                if (sellerV.offers.length > 0) {
                                    if (sellerV.offers[0].rfqStatus != "Revoked") {
                                        AllRFQsAreRevoked = false;
                                    }
                                }
                            }
                        }
                    });
                });
            });
            return AllRFQsAreRevoked;
        };
        ctrl.removeSellerRevokedRFQsFromLocation = function (seller, currentSellerLocation) {
            dataReq = [];
            AllRFQsAreRevoked = ctrl.checkIfHasRevokedRFQsAll(seller, currentSellerLocation);
            if (seller.isCloned) {
                ctrl.removeSellerFromLocation(seller, currentSellerLocation);
                return false;
            }
            // if (seller.isPreferredSeller) {
            //     toastr.error("This seller is preferred at the port");
            //     return false;
            // }
            sellerHasOfferOnLocation = false;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (locV.uniqueLocationIdentifier == currentSellerLocation[0].uniqueLocationIdentifier) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (seller.randUnique == sellerV.randUnique) {
                                    if (typeof sellerV.offers != "undefined") {
                                        if (sellerV.offers.length > 0) {
                                        	if (sellerV.offers[0].id) {
		                                        sellerHasOfferOnLocation = true;
                                        	}
                                            if (sellerV.offers[0].rfqStatus == "Revoked") {
                                                if (sellerV.offers[0].physicalSupplierCounterparty != null) {
                                                    physicalSupplierId = sellerV.offers[0].physicalSupplierCounterparty.id;
                                                } else {
                                                    physicalSupplierId = null;
                                                }
                                                req = {
                                                    RequestLocationId: locV.id,
                                                    SellerId: sellerV.sellerCounterparty.id,
                                                    RequestId: reqV.id,
                                                    VesselId: reqV.vesselId,
                                                    LocationId: locV.location.id,
                                                    VesselVoyageDetailId: locV.vesselVoyageDetailId,
                                                    ProductId: prodV.product.id,
                                                    RfqId: sellerV.offers[0].rfq.id,
                                                    WorkflowId: prodV.workflowId,
                                                    OrderFields: null,
                                                    RequestProductId: prodV.id,
                                                    PhysicalSupplierCounterpartyId: physicalSupplierId,
                                                    RequestOfferId: sellerV.offers[0].id
                                                };
                                                dataReq.push(req);
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            });
            if (sellerHasOfferOnLocation) {
                toastr.error("Negotiation is in progress for this seller");
                return false;
            } else {
                var product, newCounterparty, newSeller;
                var counterpatyIds = getRequestGroupCounterpartyIdsCSV(ctrl.requests);
                // var productIds = getRequestGroupProductIdsCSV(ctrl.requests);
                var productIds = [];
                $.each(currentSellerLocation[0].products, function (k, v) {
                    productIds.push(v.id);
                });
                productIds = productIds.join(",");
                getSellersSortedPayload = {
                    RequestProductList: productIds,
                    RequestGroupId: ctrl.groupId,
                    LocationId: currentSellerLocation[0].location.id,
                    RequestSellerId: seller.sellerCounterparty.id
                };
                groupOfRequestsModel.deleteSeller(getSellersSortedPayload).then(
                    function (data) {
                        if (data.isSuccess) {
                            ctrl.initScreen();
                            return false;
                        }
                    },
                    function (response) {
                        ctrl.initScreen();
                        return false;
                    }
                );
                return false;
            }
            if (dataReq.length <= 0) {
                toastr.error("Negotiation is in progress for this seller");
                return false;
            }
            payloadRequirements = {
                requirements: dataReq
            };
            groupOfRequestsModel.removeRequirements(payloadRequirements).then(
                function (data) {
                    ctrl.initScreen();
                    return false;
                    // console.log(data);
                    // $state.reload();
                },
                function (response) {
                    ctrl.initScreen();
                    return false;
                    // console.log(response);
                    // $state.reload();
                }
            );
        };
        ctrl.calculateMinValidity = function (seller, requestProducts, location) {
            valitidiesList = [];
            $.each(requestProducts, function (rpK, rpV) {
                productOffer = ctrl.getSellerProductOfferOnLocation(rpV, location, seller.sellerCounterparty.id, seller);
                if (productOffer) {
                    if (productOffer.validity) {
                        valitidiesList.push(productOffer.validity);
                    }
                }
            });
            maxValidityDate = null;
            if (valitidiesList.length > 0) {
                maxValidityDate = new Date(valitidiesList[0]).getTime();
                $.each(valitidiesList, function (vK, vV) {
                    if (new Date(vV).getTime() > maxValidityDate) {
                        maxValidityDate = new Date(vV).getTime();
                    }
                });
            }
            if (maxValidityDate) {
                msValidity = maxValidityDate - new Date().getTime();
                hoursValidity = msValidity / (1000 * 3600);
                // return hoursValidity.toFixed();
                return hoursValidity;
            } else {
                return "-";
            }
            return maxValidityDate;
        };
        ctrl.setBladeCounterpartyActiveSeller = function () {
        	if (!ctrl.blade.counterpartyActiveSeller) {
        		return false;
        	}
            $rootScope.bladeFilteredRfq = ctrl.blade.counterpartyActiveSeller;
            $rootScope.bladeFilteredRfq.locationData = ctrl.blade.counterpartyActiveLocation;
        };
        ctrl.calculateMySelectionTotal = function () {
            total = 0;
            $.each(ctrl.mySelection, function (k, v) {
                if (v.tco) {
                    total += v.tco;
                }
            });
            if (ctrl.includeAverageSurveyorCharge) {
                total += ctrl.mySelectionSurveyorCost;
            }
            return total;
        };
        ctrl.reviewRFQ = function () {
            ctrl.groupId;
            groupOfRequestsModel.reviewGroup(ctrl.groupId).then(
                function (data) {
                    console.log(data);
                    if (data.isSuccess) {
                        ctrl.isReviewed = true;
                    }
                },
                function (response) {
                    console.log(response);
                }
            );
        };
        ctrl.calculateTotalAmountForProductsPerRequestperSeller = function (requestProducts, currLocation, seller) {
            totalAmount = 0;
            var foundNoValidTco = false;
            $.each(requestProducts, function (k, product) {
            	correctProduct = product.productLocations['L' + currLocation[0].uniqueLocationIdentifier];
            	if (correctProduct) {
	                var productOffer = ctrl.getSellerProductOfferOnLocationRewrite(correctProduct, currLocation, seller.sellerCounterparty.id, seller);
            	}
                if (productOffer) {
                    if (productOffer.energyParameterValues) {
                        if (productOffer.energyParameterValues.tco) {
                            totalAmount += productOffer.energyParameterValues.tco;
                        } else {
                            foundNoValidTco = true;
                        }
                    } else {
                        if (productOffer.totalAmount || productOffer.hasNoQuote) {
                            totalAmount += productOffer.totalAmount || 0;
                        } else {
                            foundNoValidTco = true;
                        }
                    }
                } else {
                	if (correctProduct) {
	                    foundNoValidTco = true;
                	}
                }
            });
            if (ctrl.includeAverageSurveyorCharge) {
                totalAmount += ctrl.averageSurveyorCost;
            }
            return foundNoValidTco ? -1 : totalAmount;
        };
        /*****************************************************************************
         *   END EVENT HANDLERS
         ******************************************************************************/
        /**
         * Supplier Card specific functions
         */
        ctrl.initCardDetails = function (activeLocation) {
            ctrl.cardRequests = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                requestLocation = false;
                $.each(reqV.locations, function (locK, locV) {
                    if (locV.uniqueLocationIdentifier == activeLocation.uniqueLocationIdentifier) {
                        // debugger
                        requestLocation = true;
                    }
                });
                if (requestLocation) {
                    ctrl.cardRequests.push(reqV);
                }
            });
            ctrl.active_req_val = ctrl.cardRequests[0];
        };
        ctrl.initSupplierCardData = function (theLocation, seller, activeSellerCardTab) {
            requestLocationIds = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (locV.uniqueLocationIdentifier == theLocation.uniqueLocationIdentifier) {
                        if (requestLocationIds.indexOf(locV.id) == -1) {
                            requestLocationIds.push(locV.id);
                        }
                    }
                });
            });
            ctrl.initDataforCard = {
                Payload: {
                    requestGroupId: ctrl.groupId,
                    locationId: theLocation.location.id,
                    sellerCounterpartyId: seller.sellerCounterparty.id,
                    physicalSupplierId: seller.randUnique.split("-")[1],
                    requestLocationIds: requestLocationIds.join(",")
                }
            };
            ctrl.sellerHasBroker(seller, theLocation);
            $rootScope.currentSellerCardHasSupplier = ctrl.sellerHasPhysicalSupplier(seller, theLocation);
            ctrl.sellerHasContact(seller, theLocation);
            // if (!ctrl.sellerHasPhysicalSupplier(seller, theLocation)) {
            //     ctrl.cannotViewSellerCard = true;
            //     ctrl.cannotViewSellerCardMessage = "Please add a physical supplier for the offer before continuing";
            // }
            if (!ctrl.sellerHasContact(seller, theLocation)) {
                ctrl.cannotViewSellerCard = true;
                ctrl.cannotViewSellerCardMessage = "Please add a contact for the offer before continuing";
            } else if (seller.isCloned || seller.offers.length == 0 || !seller.offers) {
                ctrl.cannotViewSellerCard = true;
                ctrl.cannotViewSellerCardMessage = "Please send or skip RFQ before continuing";
            } else {
                // console.error('card data'); 
                ctrl.dataLoaded = false;
                ctrl.cannotViewSellerCard = false;
                Factory_Master.getSellerBlade(
                    ctrl.initDataforCard,
                    function (callback) {
                        ctrl.dataLoaded = true;
                        if (callback) {
                            if (callback.status) {
                                ctrl.blade.supplierCardData = {};
                                ctrl.blade.supplierCardData.payload = callback;
                                ctrl.blade.supplierCardData.initData = ctrl.initDataforCard;
                                ctrl.blade.supplierCardData.activeSellerCardTab = activeSellerCardTab;
                            } else {
                                ctrl.blade.supplierCardData = {};
                                ctrl.blade.supplierCardData.error = true;
                            }
                        }
                    },
                    function () {
                        ctrl.dataLoaded = true;
                    }
                );
            }
            setTimeout(function () {
                ctrl.cannotViewSellerCard ? (ctrl.dataLoaded = true) : "";
            }, 1000);
        };
        ctrl.initEnergyBlade = function (theLocation, seller, productOffer) {
            requestLocationIds = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (locV.uniqueLocationIdentifier == theLocation.uniqueLocationIdentifier) {
                        if (requestLocationIds.indexOf(locV.id) == -1) {
                            requestLocationIds.push(locV.id);
                        }
                    }
                });
            });
            ctrl.initDataforCard = {
                Payload: {
                    requestGroupId: ctrl.groupId,
                    locationId: theLocation.location.id,
                    sellerCounterpartyId: seller.sellerCounterparty.id,
                    physicalSupplierId: seller.randUnique.split("-")[1],
                    requestLocationIds: requestLocationIds.join(",")
                }
            };
            $scope.tempProductOffer = productOffer;
            $scope.tempSellerData = seller;
            Factory_Master.getEnergyBlade(ctrl.initDataforCard, function (callback) {
                ctrl.dataLoaded = true;
                if (callback) {
                    ctrl.sellerOffers = {};
                    ctrl.sellerOffers = callback.data.payload;
                    products = [];
                    $.each(ctrl.sellerOffers, function (k, v) {
                        $.each(v.products, function (pk, pv) {
                            if (pv.isEnergyCalculationRequired) {
                                if (pk > 0) {
                                    prod = angular.copy(v);
                                    prod.products = [prod.products[pk]];
                                    ctrl.sellerOffers.push(prod);
                                }
                            }
                        });
                    });
                    ctrl.sellerOffers = $filter("orderBy")(ctrl.sellerOffers, "id");
                    console.log($scope.tempProductOffer);
                    // debugger;
                    ctrl.active_prod = ctrl.sellerOffers[0];
                    $.each(ctrl.sellerOffers, function (k, v) {
                        $.each(v.products, function (pk, pv) {
                            currentPackageId = null;
                            if (v.package) {
                                currentPackageId = v.package.id;
                            }
                            if (pv.product.id == $scope.tempProductOffer.quotedProduct.id && $scope.tempProductOffer.offer.requestId == v.request.id && $scope.tempSellerData.packageId == currentPackageId) {
                                ctrl.active_prod = v;
                            }
                        });
                    });
                    ctrl.dataLoaded = true;
                }
            });
        };
        $rootScope.$on("supplierCardChangedData", function (event, supplierCardData) {
            console.log(supplierCardData);
            ctrl.initScreen();
            return false;
            $state.reload();
            $.each(supplierCardData, function (scK, scV) {
                $.each(scV.locations[0].products, function (scProdK, scProdV) {
                    scProductId = scProdV.id;
                    scSellerUniqueId = null;
                    scRequestId = scV.id;
                    scLocationUnique = scV.locations[0].uniqueLocationIdentifier;
                    if (scProdV.sellers.length > 0) {
                        if (scProdV.sellers[0].offers.length > 0) {
                            scSellerUniqueId = scProdV.sellers[0].randUnique;
                        }
                    }
                    $.each(ctrl.requests, function (reqK, reqV) {
                        if (reqV.id == scRequestId) {
                            $.each(reqV.locations, function (locK, locV) {
                                if (locV.uniqueLocationIdentifier == scLocationUnique) {
                                    $.each(locV.products, function (prodK, prodV) {
                                        if (prodV.id == scProductId) {
                                            if (prodV.sellers.length > 0) {
                                                $.each(prodV.sellers, function (selK, selV) {
                                                    if (selV.randUnique == scSellerUniqueId) {
                                                        selV.offers = scProdV.sellers[0].offers;
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
        ctrl.compareLines = [
            {
                first: {},
                second: {},
                third: {},
                droppable: true
            }
        ];
        ctrl.stopCallback = function (event, ui, elem) {
            $.each(ctrl.compareLines, function (k, v) {
                ctrl.compareLines[k].droppable = true;
            });
        };
        ctrl.startCallback = function (event, ui, elem) {
            $.each(ctrl.compareLines, function (k, v) {
                ctrl.compareLines[k].droppable = true;
                $.each(v, function (sk, sv) {
                    if (sv.seller) {
                        if (sv == elem) {
                            console.log("exists");
                            ctrl.compareLines[k].droppable = false;
                        }
                    }
                });
            });
        };
        ctrl.dropCallback = function (event, ui) {
            event.target.innerHTML = ui.draggable.context.innerHTML;
            ctrl.draggableProducts = [];
            $.each(ctrl.compareLines, function (k, v) {
                $.each(v, function (sk, sv) {
                    if (sv.product) {
                        ctrl.draggableProducts.push(sv.product.id);
                    }
                    if (sv.products) {
                        $.each(sv.products, function (pk, pv) {
                            ctrl.draggableProducts.push(pv.product.id);
                        });
                    }
                });
                ctrl.compareLines[k].droppable = true;
            });
        };
        ctrl.canDrag = function (elem) {
            if (!ctrl.draggableProducts) {
                return true;
            }
            if (ctrl.compareLines.length <= 1) {
                return true;
            }
            if (elem.products) {
                found = 0;
                $.each(elem.products, function (k, v) {
                    if (ctrl.draggableProducts.indexOf(v.product.id) > -1) {
                        found++;
                    }
                });
                if (found == elem.products.length) {
                    return true;
                }
            }
            if (elem.product) {
                if (ctrl.draggableProducts.indexOf(elem.product.id) > -1) {
                    return true;
                }
            }
            return false;
        };
        ctrl.compareSelection = function () {
            linesTco = [];
            firstLineRefferenceProducts = [];
            $.each(ctrl.compareLines[0].first.products, function (prodK, prodV) {
                if (firstLineRefferenceProducts.indexOf(prodV.product.id) == -1) {
                    firstLineRefferenceProducts.push(prodV.product.id);
                }
            });
            $.each(ctrl.compareLines[0].second.products, function (prodK, prodV) {
                if (firstLineRefferenceProducts.indexOf(prodV.product.id) == -1) {
                    firstLineRefferenceProducts.push(prodV.product.id);
                }
            });
            $.each(ctrl.compareLines[0].third.products, function (prodK, prodV) {
                if (firstLineRefferenceProducts.indexOf(prodV.product.id) == -1) {
                    firstLineRefferenceProducts.push(prodV.product.id);
                }
            });
            $.each(ctrl.compareLines, function (k, v) {
                linesTco.push($filter("sumOfValueArray")(v, "tco"));
            });
            ctrl.minTco = Math.min.apply(Math, linesTco);
        };
        ctrl.hasParam = function (param) {
            found = false;
			if (ctrl.active_prod) {
			    if (ctrl.active_prod.products) {
			        $.each(ctrl.active_prod.products[0].specParameters, function (k, v) {
			            if (v.specParameter.id == param) {
			                found = true;
			            }
			        });
			    }
			}
            if (found) {
                return false;
            }
            return true;
        };
        /*TCO checkboxes*/
        ctrl.tcoHasPackageRequirements = function (pkgData) {
            physicalSupplierId = null;
            if (pkgData.isSurrogate) {
                packageType = "buyer";
            } else {
                packageType = "seller";
            }
            if (pkgData.physicalSupplier) {
                if (pkgData.physicalSupplier.id) {
                    physicalSupplierId = pkgData.physicalSupplier.id;
                }
            }
            sellerRandUniquePkg = pkgData.seller.id + "-" + physicalSupplierId + "-" + packageType + "-" + pkgData.packageId;
            pkgData.randUniquePkg = sellerRandUniquePkg;
            return ctrl.hasPackageRequirement(pkgData);
        };
        ctrl.createTcoSellerRequirementsForProductPackage = function (pkgData) {
            matchingPackageIdProducts = [];
            locations = [];
            currentSeller = null;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        if (prodV.sellers.length > 0) {
                            $.each(prodV.sellers, function (selK, selV) {
                                if (selV.randUniquePkg == pkgData.randUniquePkg) {
                                    prodV.seller = selV;
                                    currentSeller = selV;
                                    matchingPackageIdProducts.push(prodV);
                                    locations.push(locV);
                                }
                            });
                        }
                    });
                });
            });
            $.each(matchingPackageIdProducts, function (key, prodValue) {
                ctrl.createSellerRequirementsForProduct(currentSeller, locations, prodValue);
            });
        };
        ctrl.hasTcoSellerProductRequirements = function (requestOfferId) {
            sellerObj = null;
            physicalSupplierId = null;
            product = null;
            locations = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        if (prodV.sellers.length > 0) {
                            $.each(prodV.sellers, function (selK, selV) {
                                if (selV.offers) {
                                    if (selV.offers.length > 0) {
                                        if (selV.offers[0].id == requestOfferId) {
                                            sellerObj = selV;
                                            locations.push(locV);
                                            product = prodV;
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
            });
            return ctrl.hasSellerProductRequirements(sellerObj, locations, physicalSupplierId, product);
        };
        ctrl.createTcoSellerRequirementsForProduct = function (requestOfferId) {
            // seller, locations, productSample
            seller = null;
            product = null;
            locations = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        if (prodV.sellers.length > 0) {
                            $.each(prodV.sellers, function (selK, selV) {
                                if (selV.offers) {
                                    if (selV.offers.length > 0) {
                                        if (selV.offers[0].id == requestOfferId) {
                                            seller = selV;
                                            locations.push(locV);
                                            product = prodV;
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
            });
            ctrl.createSellerRequirementsForProduct(seller, locations, product);
        };
        ctrl.isSelectedBestTotalTco = function () {
            if (!ctrl.requirements) {
                return false;
            }
            if (ctrl.requirements.length == 0) {
                return false;
            }
            bestTcoRequestOfferIdList = [];
            $.each(ctrl.bestTcoData.bestTotalTCO, function (tcok, tcov) {
                $.each(tcov.products, function (pk, pv) {
                    bestTcoRequestOfferIdList.push(pv.requestOfferId);
                });
            });
            if (bestTcoRequestOfferIdList.length > ctrl.requirements.length) {
                return false;
            }
            $.each(ctrl.requirements, function (requirementK, requirementV) {
                if (bestTcoRequestOfferIdList.indexOf(requirementV.requestOfferId) == -1) {
                    return false;
                }
            });
            return true;
        };
        ctrl.selectBestTotalTco = function () {
            requestOfferIdList = [];
            $.each(ctrl.bestTcoData.bestTotalTCO, function (tcok, tcov) {
                $.each(tcov.products, function (pk, pv) {
                    requestOfferIdList.push(pv.requestOfferId);
                });
            });
            isCheckSelected = angular.copy(ctrl.isSelectedBestTotalTco());
            if (!isCheckSelected) {
                for (var i = requestOfferIdList.length - 1; i >= 0; i--) {
                    requestOfferIdList[i];
                    $.each(ctrl.requirements, function (k, v) {
                        if (requestOfferIdList[i] == v.requestOfferId) {
                            requestOfferIdList.splice(i, 1);
                        }
                    });
                }
            }
            $.each(requestOfferIdList, function (rk, requestOfferId) {
                ctrl.createTcoSellerRequirementsForProduct(requestOfferId);
            });
        };
        ctrl.isSelectedMySelection = function () {
            if (!ctrl.requirements) {
                return false;
            }
            if (ctrl.requirements.length == 0) {
                return false;
            }
            mySelectionRequestOfferIdList = [];
            $.each(ctrl.bestTcoData.mySelection.quotations, function (msk, msv) {
                // mySelectionRequestOfferIdList.push(msv.requestOfferId);
                $.each(msv.products, function (pk, pv) {
                    mySelectionRequestOfferIdList.push(pv.requestOfferId);
                });
            });
            if (mySelectionRequestOfferIdList.length > ctrl.requirements.length) {
                return false;
            }
            $.each(ctrl.requirements, function (requirementK, requirementV) {
                if (mySelectionRequestOfferIdList.indexOf(requirementV.requestOfferId) == -1) {
                    return false;
                }
            });
            return true;
        };
        ctrl.selectMySelection = function () {
            requestOfferIdList = [];
            $.each(ctrl.bestTcoData.mySelection.quotations, function (tcok, tcov) {
                $.each(tcov.products, function (pk, pv) {
                    requestOfferIdList.push(pv.requestOfferId);
                });
            });
            isCheckSelected = angular.copy(ctrl.isSelectedMySelection());
            if (!isCheckSelected) {
                for (var i = requestOfferIdList.length - 1; i >= 0; i--) {
                    requestOfferIdList[i];
                    $.each(ctrl.requirements, function (k, v) {
                        if (requestOfferIdList[i] == v.requestOfferId) {
                            requestOfferIdList.splice(i, 1);
                        }
                    });
                }
            }
            // debugger;
            $.each(requestOfferIdList, function (rk, requestOfferId) {
                ctrl.createTcoSellerRequirementsForProduct(requestOfferId);
            });
        };
        /*END TCO checkboxes*/
        ctrl.getPackageRequestIds = function (packageId) {
            requestIds = [];
            $.each(ctrl.bestTcoData.bestPackages, function (pk, pg) {
                if (pg.packageId == packageId) {
                    $.each(pg.products, function (prodK, prodV) {
                        if (requestIds.indexOf(prodV.request.id) == -1) {
                            requestIds.push(prodV.request.id);
                        }
                    });
                }
            });
            return requestIds;
        };
        ctrl.getRequestComment = function (requestProducts, product, location, sellerCounterpartyId, seller) {
            comments = "";
            commentsCount = 0;
            $.each(requestProducts, function (rk, rv) {
                productOffer = ctrl.getSellerProductOfferOnLocationRewrite(rv, location, sellerCounterpartyId, seller);
                if (productOffer) {
                    if (productOffer.offer) {
                        if (productOffer.offer.sellerComments) {
                            comments = productOffer.offer.sellerComments;
                        }
                        if (productOffer.offer.sellerComments) {
                            commentsCount += 1;
                        }
                    }
                }
            });
            if (commentsCount > 0) {
                return comments;
            }
            return false;
        };
        ctrl.calculate6MHistoryAverage = function () {
            console.log(ctrl);
            ctrl.show6MHistoryAverage = true;
        };
        $scope.modelBestTCODataForTemplating = function (bestTcoData) {
            ctrl.bestTotalTCOUniqueRequestsList = [];
            $.each(bestTcoData.bestTotalTCO, function (btk, btv) {
                btv.requestIdForGrouping = btv.products[0].request.id;
                if (ctrl.bestTotalTCOUniqueRequestsList.indexOf(btv.products[0].request.id) == -1) {
                    ctrl.bestTotalTCOUniqueRequestsList.push(btv.products[0].request.id);
                }
            });
            return bestTcoData;
        };
        ctrl.getTotalBestTCOForRequest = function (requestId) {
            total = 0;
            $.each(ctrl.bestTcoData.bestTotalTCO, function (btk, btv) {
                if (btv.requestIdForGrouping == requestId) {
                    total += btv.tco;
                }
            });
            return total;
        };
        ctrl.getTotalMySelectionForRequest = function (requestId) {
            return false;
            total = 0;
            $.each(ctrl.bestTcoData.mySelection.quotations, function (msk, msv) {
                if (msv.request.id == requestId) {
                    if (msv.amount) {
                        total += msv.amount;
                    }
                }
            });
            return total;
        };
        ctrl.getVesselByRequestId = function (requestId) {
            vessel = null;
            $.each(ctrl.requests, function (rk, rv) {
                if (rv.id == requestId) {
                    vessel = rv.vesselDetails.vessel;
                }
            });
            return vessel;
        };
        $rootScope.$on("bladeDataChanged", function (event, data) {
            console.log();
            ctrl.confirmedBladeNavigation = true;
            $scope.bladeDataChanged = data;
            ctrl.viewSupplierCardBlade(ctrl.blade.counterpartyActiveSeller, ctrl.blade.counterpartyActiveLocation, null, null)
        });
        $rootScope.$on("confirmedBladeNavigation", function (event, data) {
	        ctrl.confirmedBladeNavigation = true
        });

        // timer for validity count
        ctrl.timerCount = 0;
        ctrl.validityArray = [];
        ctrl.validityArray[ctrl.timerCount] = null;
        ctrl.getOfferPaymentTerm = function (seller) {
            paymentTerm = null;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (sellerK, sellerV) {
                            if (seller.id == sellerV.id) {
                                if (typeof sellerV.offers != "undefined") {
                                    if (sellerV.offers.length > 0) {
                                        $.each(sellerV.offers, function (ofk, ofv) {
                                            if (ofv.paymentTerm) {
                                                paymentTerm = ofv.paymentTerm;
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    });
                });
            });
            return paymentTerm;
        };
        ctrl.countdown = function (time) {
        // countdonw not needed anymore
        /*    ctrl.timerCount++;
            // console.log(ctrl.timerCount, time);
            ctrl.validityArray[ctrl.timerCount] = {};
            if (time != "-") {
                numeric = parseFloat(time); //time is in hours
                ctrl.validityArray[ctrl.timerCount].numeric = numeric;
                hours = parseInt(time);
                mins = (numeric - hours) * 60;
                mins = parseInt(mins);
                ctrl.validityArray[ctrl.timerCount].displayString = hours + " h, " + mins + " m";
            } else {
                ctrl.validityArray[ctrl.timerCount].displayString = time;
                ctrl.validityArray[ctrl.timerCount].numeric = time;
            }
            $timeout(function () {
                ctrl.startTimer = true;
            }, 2000);
            // console.log(ctrl.validityArray);
        */    
            return ctrl.timerCount;
        };
        // $interval(function () {
        //     if (ctrl.startTimer) {
        //         $.each(ctrl.validityArray, function (key, val) {
        //             if (typeof val != "undefined" && key != 0) {
        //                 if (typeof val.numeric == "number") {
        //                     numeric = ctrl.validityArray[key].numeric;
        //                     numeric = numeric - 0.0166666667;
        //                     ctrl.validityArray[key].numeric = numeric;
        //                     hours = parseInt(numeric);
        //                     mins = (numeric - hours) * 60;
        //                     mins = parseInt(mins);
        //                     ctrl.validityArray[key].displayString = hours + " h, " + mins + " m";
        //                 }
        //             }
        //         });
        //     }
        // }, 60000);
        $scope.showHideSections = function (obj) {
            if (obj.length > 0) {
                ctrl.visible_sections_old = ctrl.visible_sections;
            } else {
                if (typeof ctrl.visible_sections_old != "undefined") {
                    ctrl.visible_sections = ctrl.visible_sections_old;
                    $("select#multiple").selectpicker("val", ctrl.visible_sections_old[0]);
                    $("select#multiple").selectpicker("render");
                }
            }
        };
        jQuery(document).on("focus", "input[type='number']", function () {
            input = $('input[type="number"]');
            window.addEventListener("mousewheel", function (evt) {
                if ($(evt.target).prop("tagName") == "INPUT") {
                    evt.preventDefault();
                } else {
                    return true;
                }
            });
        });
        jQuery(document).on("blur", "input[type='number']", function () {
            input = $('input[type="number"]');
            window.addEventListener("mousewheel", function (evt) {
                return true;
            });
        });
        ctrl.checkisNaN = function (oldVal, newVal) {
            if (isNaN(newVal)) {
                if (isNaN(oldVal)) {
                    return null;
                }
                return oldVal;
            } else {
                return false;
            }
        };
        ctrl.getMarketPricePopup = function (product, locations) {
            data = {};
            var location;
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    location = locations[i];
                    break;
                }
            }
            if (!location) {
                return 0;
            }
            productList = [];
            $.each(location.products, function (k, v) {
                if (v.product.id == product.product.id) {
                    product = v;
                }
            });
            popupHtml = "";
            if (product.quoteName) {
                popupHtml = product.quoteName + "<br>Quote Date: " + $filter("date")(product.quoteDate, "dd/MM/yyyy");
            }
            return popupHtml;
        };
        ctrl.openContactCounterpartyModal = function (seller, location) {
            // ctrl.OptionsContactCounterpartyModal = ctrl.sellerContactList["s" + seller.id];
            // tpl = $templateCache.get("components/sellers-dialog/views/contactCounterpartyModal.html");
            // ctrl.activeSellerForContactCounterparty = seller;
            // ctrl.activeLocationForContactCounterparty = location;
            // $scope.modalInstance = $uibModal.open({
            //     template: tpl,
            //     appendTo: angular.element(document.getElementsByClassName("page-container")),
            //     size: "full",
            //     windowTopClass: "fullWidthModal",
            //     scope: $scope //passed current scope to the modal
            // });
            ctrl.getContactListForSeller(seller, function(data){
	            ctrl.OptionsContactCounterpartyModal = data;
	            tpl = $templateCache.get('components/sellers-dialog/views/contactCounterpartyModal.html');
	            ctrl.activeSellerForContactCounterparty = seller;
	            ctrl.activeLocationForContactCounterparty = location;
	            $scope.modalInstance = $uibModal.open({
	                template: tpl,
	                appendTo: angular.element(document.getElementsByClassName("page-container")),
	                size: 'full',
	                windowTopClass: 'fullWidthModal',
	                scope: $scope //passed current scope to the modal
	            })
            })            
        };
        ctrl.confirmContactCounterpartySelection = function (selectedItem) {
            if (!selectedItem) {
                toastr.error("Please select one Contact");
                return false;
            }
            ctrl.updateContactForSellers(ctrl.activeSellerForContactCounterparty, selectedItem, ctrl.activeLocationForContactCounterparty);
            ctrl.activeSellerForContactCounterparty = null;
            ctrl.activeLocationForContactCounterparty = null;
            ctrl.prettyCloseModal();
        };
        ctrl.prettyCloseModal = function () {
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
            setTimeout(function () {
                if ($scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                if ($rootScope.modalInstance) {
                    $rootScope.modalInstance.close();
                }
            }, 500);
        };
        ctrl.sellerHasBroker = function (seller, theLocation) {
            if (!ctrl.fieldVisibility.isBrokerMandatory) {
                return true;
            }
            hasBroker = false;
            randUniquePkg = seller.randUniquePkg;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (theLocation.uniqueLocationIdentifier == locV.uniqueLocationIdentifier) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.randUniquePkg == randUniquePkg) {
                                    if (sellerV.offers) {
                                        if (sellerV.offers.length > 0) {
                                            if (sellerV.offers[0].brokerCounterparty) {
                                                hasBroker = true;
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            });
            return hasBroker;
        };
        ctrl.sellerHasPhysicalSupplier = function (seller, theLocation) {
            if (!ctrl.fieldVisibility.isPhysicalSupplierMandatory) {
                return true;
            }
            hasSupplier = false;
            randUniquePkg = seller.randUniquePkg;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (theLocation.uniqueLocationIdentifier == locV.uniqueLocationIdentifier) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.randUniquePkg == randUniquePkg) {
                                    if (sellerV.offers) {
                                        if (sellerV.offers.length > 0) {
                                            if (sellerV.offers[0].physicalSupplierCounterparty) {
                                                hasSupplier = true;
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            });
            return hasSupplier;
        };
        ctrl.sellerHasContact = function (seller, theLocation) {
            if (!ctrl.fieldVisibility.isSellerContactMandatory) {
                return true;
            }
            hasContact = false;
            randUniquePkg = seller.randUniquePkg;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (theLocation.uniqueLocationIdentifier == locV.uniqueLocationIdentifier) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.randUniquePkg == randUniquePkg) {
                                    if (sellerV.offers) {
                                        if (sellerV.offers.length > 0) {
                                            if (sellerV.offers[0].contactCounterparty) {
                                                hasContact = true;
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            });
            return hasContact;
        };
        ctrl.openSellerInterstedModal = function (seller, location) {
            // ctrl.OptionsContactCounterpartyModal = ctrl.sellerContactList['s'+seller.id]
            tpl = $templateCache.get("pages/group-of-requests/views/not-interested-modal.html");
            ctrl.notInterstedModalActiveData = {
                seller: seller,
                location: location,
                sellerNotInterested: angular.copy(seller.isNotInterested)
            };
            // ctrl.activeLocationForContactCounterparty = location;
            $scope.modalInstance = $uibModal.open({
                template: tpl,
                appendTo: angular.element(document.getElementsByClassName("page-container")),
                size: "full",
                windowTopClass: "fullWidthModal smallModal",
                scope: $scope //passed current scope to the modal
            });
        };
        ctrl.saveNotInterestedModal = function () {
            activeRandUniquePkg = ctrl.notInterstedModalActiveData.seller.randUniquePkg;
            requestSellerIds = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (selK, selV) {
                            if (selV.randUniquePkg == activeRandUniquePkg) {
                                if (selV.offers.length > 0) {
                                    if (selV.id) {
                                        requestSellerIds.push(selV.id);
                                    }
                                }
                            }
                        });
                    });
                });
            });
            data = {
                Filters: [
                    {
                        ColumnName: "RequestSellerId",
                        Value: requestSellerIds.join(",")
                    },
                    {
                        ColumnName: "Comments",
                        Value: ctrl.notInterstedModalActiveData.seller.notInterestedComments
                    },
                    {
                        ColumnName: "NotInterested",
                        Value: ctrl.notInterstedModalActiveData.sellerNotInterested
                    }
                ]
            };
            // if (ctrl.notInterstedModalActiveData.sellerNotInterested && !ctrl.notInterstedModalActiveData.seller.notInterestedComments) {
            //  toastr.error("Comment is mandatory");
            //  return false;
            // }
            groupOfRequestsModel.sellerNotInterested(data).then(function (response) {
                if (response.isSuccess) {
                    $.each(ctrl.notInterstedModalActiveData.location, function (locK, locV) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.randUniquePkg == ctrl.notInterstedModalActiveData.seller.randUniquePkg) {
                                    sellerV.isNotInterested = angular.copy(ctrl.notInterstedModalActiveData.sellerNotInterested);
                                    sellerV.notInterestedComments = ctrl.notInterstedModalActiveData.seller.notInterestedComments;
                                }
                            });
                        });
                    });
                    ctrl.prettyCloseModal();
                }
            });
        };
        ctrl.getIncoterm = function (request, location, seller, incoterm) {
            // incotermHasSellers = 0;
            baseIncoterm = {
                hasSellerOffer: 0,
                incoterm: null
            };
            $.each(ctrl.requests, function (k, v) {
                if (v.id == request) {
                    $.each(v.locations, function (kl, vl) {
                        if (vl.uniqueLocationIdentifier == location[0].uniqueLocationIdentifier) {
                            $.each(vl.products, function (pk, pv) {
                                if (pv.sellers.length > 0) {
                                    $.each(pv.sellers, function (sk, sv) {
                                        if (sv.randUniquePkg == seller.randUniquePkg) {
                                            if (sv.defaultIncoterm) {
                                                baseIncoterm.defaultIncoterm = sv.defaultIncoterm;
                                            }
                                        }
                                        if (sv.id) {
                                            if (sv.randUniquePkg == seller.randUniquePkg) {
                                                if (sv.offers) {
                                                    if (sv.offers.length > 0) {
                                                        baseIncoterm.incoterm = sv.offers[0].incoterm;
                                                        if (incoterm) {
                                                            $.each(sv.offers, function (ok, ov) {
                                                                ov.incoterm = incoterm;
                                                            });
                                                        }
                                                    }
                                                }
                                                baseIncoterm.hasSellerOffer++;
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
            if (!baseIncoterm.incoterm) {
                baseIncoterm.incoterm = baseIncoterm.defaultIncoterm;
            }
            return baseIncoterm;
        };
        ctrl.updateIncoterm = function (incoterm, location, seller, request) {
            // requestOfferIds = ctrl.returnLocationReqOffIds(location, seller.randUniquePkg);
            requestOfferIds = [];
            $.each(ctrl.requests, function (reqK, reqV) {
                if (reqV.id == request) {
                    $.each(reqV.locations, function (locK, locV) {
                        $.each(locV.products, function (prodK, prodV) {
                            $.each(prodV.sellers, function (sellerK, sellerV) {
                                if (sellerV.randUniquePkg == seller.randUniquePkg) {
                                    if (sellerV.offers) {
                                        if (sellerV.offers[0].id) {
                                            requestOfferIds.push(sellerV.offers[0].id);
                                        }
                                    }
                                }
                            });
                        });
                    });
                }
            });
            data = {
                RequestOfferIds: requestOfferIds,
                IncotermId: incoterm.id
            };
            if (typeof data.RequestOfferIds[0] != "undefined") {
                groupOfRequestsModel.updateIncoterm(data).then(function (response) {
                    if (response.isSuccess) {
                        ctrl.getIncoterm(request, location, seller, incoterm);
                    }
                });
            }
        };
        // ctrl.calculateFirsRowColSpan = function () {
        //     colspan = 0;
        //     if (ctrl.isSellerHistoryExpanded) {
        //         colspan = 16;
        //     } else {
        //         if (ctrl.sellerHistoryVisibility == 1) {
        //             colspan = 6;
        //         } else {
        //             colspan = 8;
        //         }
        //     }
        //     if (ctrl.counterpartyCommentsVisibility == 1) {
        //         colspan += 1;
        //     }
        //     return colspan;
        // };

        ctrl.calculateFirsRowColSpan = function () {
            colspan = 7;
            if(ctrl.allExpanded){
                colspan = 18;
                if(ctrl.counterpartyCommentsVisibility !== 1){
                    colspan = colspan - 1;
                }
                if(ctrl.sellerHistoryVisibility !== 1){
                    colspan = colspan - 10;
                }
            } 
            return colspan;
        };

        ctrl.checkIfGroupHasRFQ = function () {
            groupHasRFQ = false;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    $.each(locV.products, function (prodK, prodV) {
                        $.each(prodV.sellers, function (selK, selV) {
                            if (selV.offers) {
                                if (selV.offers.length > 0) {
                                    $.each(selV.offers, function (ofK, ofV) {
                                        if (ofV.id) { 
                                            groupHasRFQ = true;
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            });
            return groupHasRFQ;
        };

        ctrl.checkIfSellerHasRFQ = function (sellerRandUnique, theLocation) {
            
            availableProductsPerLocation = 0;
            if (theLocation.length > 0) {
                uniqueLocationIdentifier = theLocation[0].uniqueLocationIdentifier;
            } else {
                uniqueLocationIdentifier = theLocation.uniqueLocationIdentifier;
            }
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                    if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
                        availableProductsPerLocation += locV.products.length;
                    }
                });
            });
            totalOffersRFQsNo = 0;
            totalSkipped = 0;
            $.each(ctrl.requests, function (reqK, reqV) {
                $.each(reqV.locations, function (locK, locV) {
                	if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
	                    $.each(locV.products, function (prodK, prodV) {
	                        $.each(prodV.sellers, function (selK, selV) {
	                            if (selV.randUniquePkg == sellerRandUnique) {
	                                if (selV.offers) {
	                                    if (selV.offers.length > 0) {
	                                        $.each(selV.offers, function (ofK, ofV) {
	                                            if (ofV.id) {
		                                            if (ofV.rfq) {
		                                                totalOffersRFQsNo += 1;
		                                            }
		                                            if (!ofV.rfq) {
		                                                totalSkipped += 1;
		                                            }		                                            
	                                            }
	                                        });
	                                    }
	                                }
	                            }
	                        });
	                    });
                	}
                });
            });
            
            if (sellerRandUnique.indexOf("-individual-") == -1) {
                return "font-green-jungle";
            } // because is package
            
            if (totalOffersRFQsNo && !totalSkipped) {
                return "font-green-jungle";
            }
            if (totalSkipped) {
                return "font-grey-salsa";
            }
            if (!totalOffersRFQsNo && !totalSkipped) {
            	return false;
            }

            // if (totalOffersRFQsNo == 0) {
            //     return false;
            // }
         
            // if (totalOffersRFQsNo == availableProductsPerLocation) {
            //     return "font-green-jungle";
            // }
            // if (totalOffersRFQsNo + totalSkipped == availableProductsPerLocation) {
            //     return "font-grey-salsa";
            // }
            // if (totalOffersRFQsNo < availableProductsPerLocation) {
            //     return "font-grey-salsa";
            // }
            return false;
        };

        ctrl.shouldDisplayCounterpartyTypeFilter = function (counterpartyTypeId) {
            if (!ctrl.counterpartyTypeFilters) {
                return false;
            }
            shouldDisplay = false;
            $.each(ctrl.counterpartyTypeFilters, function (k, v) {
                if (counterpartyTypeId == v.id) {
                    shouldDisplay = true;
                }
            });
            if (shouldDisplay && counterpartyTypeId == 1) {
                if (typeof ctrl.sellerTypeCheckboxes.Supplier == "undefined") {
                    ctrl.sellerTypeCheckboxes.Supplier = true;
                }
            }
            if (shouldDisplay && counterpartyTypeId == 2) {
                if (typeof ctrl.sellerTypeCheckboxes.Seller == "undefined") {
                    ctrl.sellerTypeCheckboxes.Seller = true;
                }
            }
            if (shouldDisplay && counterpartyTypeId == 3) {
                if (typeof ctrl.sellerTypeCheckboxes.Broker == "undefined") {
                    ctrl.sellerTypeCheckboxes.Broker = true;
                }
            }
            if (shouldDisplay && counterpartyTypeId == 11) {
                if (typeof ctrl.sellerTypeCheckboxes["Service Provider"] == "undefined") {
                    ctrl.sellerTypeCheckboxes["Service Provider"] = true;
                }
            }
            return shouldDisplay;
        };
        ctrl.checkedSellerTypesSelected = function () {
            if (!ctrl.sellerTypeCheckboxes.Supplier && !ctrl.sellerTypeCheckboxes.Seller && !ctrl.sellerTypeCheckboxes.Broker && !ctrl.sellerTypeCheckboxes["Service Provider"]) {
                return false;
            }
            return true;
        };
        ctrl.selectAllCounterpartyTypeFilters = function (value) {
            if (value) {
                ctrl.sellerTypeCheckboxes.Supplier = true;
                ctrl.sellerTypeCheckboxes.Seller = true;
                ctrl.sellerTypeCheckboxes.Broker = true;
                ctrl.sellerTypeCheckboxes["Service Provider"] = true;
            } else {
                ctrl.sellerTypeCheckboxes.Supplier = false;
                ctrl.sellerTypeCheckboxes.Seller = false;
                ctrl.sellerTypeCheckboxes.Broker = false;
                ctrl.sellerTypeCheckboxes["Service Provider"] = false;
            }
            ctrl.changeSellerTypes();
        };
        ctrl.checkIfIsPrefferedProductForSeller = function (productId, seller) {
            if (!seller.preferredProductsIds) {
                return false;
            }
            if (seller.preferredProductsIds.indexOf(productId) != -1) {
                return true;
            }
            return false;
            // isPrefferedProduct = false;
            // $.each(ctrl.requests, function(reqK, reqV) {
            //     $.each(reqV.locations, function(locK, locV) {
            //         $.each(locV.products, function(prodK, prodV) {
            //             if (productId == prodV.id) {
            //                 $.each(prodV.sellers, function(selK, selV) {
            //                     if (selV.randUniquePkg == sellerRandUniquePkg) {
            //                         if (selV.isPrefferedForThisProduct) {
            //                             isPrefferedProduct = true;
            //                         }
            //                     }
            //                 })
            //             }
            //         })
            //     })
            // })
            // return isPrefferedProduct;
        };
        ctrl.setDefaultNoOfSellers = function () {
            $.each(ctrl.listsCache.ItemsToDisplay, function (key, val) {
                // debugger;

                if (val.name == ctrl.noOfCounterpartiesToDisplay) {
                    ctrl.displayNoOfSellers = val;
                }
            });
        };
        $rootScope.$on("sendEmailRFQ", function (e, data) {
        	if (!$rootScope.onSendEmailRFQDoneGOR) {
	        	ctrl.confirmedBladeNavigation = true;
		        	$rootScope.onSendEmailRFQDoneGOR = true;
		        	ctrl.requirements = data;
		            ctrl.sendRFQ(false);
        	}
        	setTimeout(function(){
				$rootScope.onSendEmailRFQDoneGOR = false;
        	},2000)
        });


        $rootScope.$on("reloadGroupPreviewRFQ", function (e, data) {
        	ctrl.refreshedRFQEmailBlade = false;
        	setTimeout(function () { 
        		ctrl.refreshedRFQEmailBlade = true;
        		$scope.$apply();
        	}, 10); 
        });

        ctrl.stripDecimals = function (value) {
            return Math.round(value);
        };

		ctrl.goToNextPriceInput = function(event) {
			ctrl.nextPriceInput = null; 
			allPriceIndexes = [];
			$.each($('input.productOfferPrice'), function(){
				if ($(this).is(':enabled')) {
					allPriceIndexes.push($(this).attr('productPriceIndexNo'));
				}
			})
			currentPriceIndex = $(event.currentTarget).attr('productPriceIndexNo');
			currentPriceIndexInArray = allPriceIndexes.indexOf(currentPriceIndex);
			if (currentPriceIndexInArray == allPriceIndexes.length-1) {
				nextItemIndex = allPriceIndexes[0]
			} else {
				nextItemIndex = allPriceIndexes[currentPriceIndexInArray+1]
			}
			if (event.keyCode == 9) {
				ctrl.nextPriceInput = nextItemIndex;
			}
            if (ctrl.nextPriceInput) {
            	setTimeout(function(){
                	$('[productPriceIndexNo='+ctrl.nextPriceInput+']').click();
                	$('[productPriceIndexNo='+ctrl.nextPriceInput+']').focus();
            	},100)
            } 			
		}

        $scope.$on("dataListModal", function (e, a) {
            // on-request-select="ctrl.selectRequest(request)"
            if (typeof a.elem != "undefined") {
                if (typeof a.val != "undefined") {
                    if (a.elem[a.elem.length - 1] == "request") {
                    	selectedReqeustsLists = []
                    	$.each(a.val, function(key, data){
	                    	selectedReqeustsLists.push(data);
                    	})
                        ctrl.selectRequest(selectedReqeustsLists);
                    }
                    if (a.elem[a.elem.length - 1] == "seller") {
                        ctrl.addSellerToAllLocations(a.val.id, ctrl.locations);
                        // ctrl.onSupplierSelect(a.val.id);
                    }
                    if (a.elem[a.elem.length - 1].indexOf("counterparty") >= 0) {
                        ctrl.addSellerToLocations(a.val.id, ctrl.newSellerLocation);
                    }
                    if (a.elem[a.elem.length - 1] == "physical_supplier") {
                        var locationSellers = ctrl.getSortedLocationSellers(ctrl.physicalSupplierUpdate.location);
                        var seller = locationSellers[ctrl.physicalSupplierUpdate.sellerKey];
                        if (typeof seller.offers[0] == "undefined") {
                            seller.offers[0] = {
                                physicalSupplierCounterparty: a.val
                            };
                        } else {
                            seller.offers[0].physicalSupplierCounterparty = a.val;
                        }

                        ctrl.updatePhysicalSupplierForSellers(seller, seller.offers[0].physicalSupplierCounterparty, ctrl.physicalSupplierUpdate.location);
                    }
                    if (a.elem[a.elem.length - 1] == "broker") {
                        var locationSellers = ctrl.getSortedLocationSellers(ctrl.brokerUpdate.location);
                        var seller = locationSellers[ctrl.brokerUpdate.sellerKey];
                        if (typeof seller.offers[0] == "undefined") {
                            seller.offers[0] = {
                                brokerCounterparty: a.val
                            };
                        } else {
                            seller.offers[0].brokerCounterparty = a.val;
                        }

                        ctrl.updateBrokerForSellers(seller, seller.offers[0].brokerCounterparty, ctrl.brokerUpdate.location);
                    }
                }
            }
        });

        ctrl.setPageTitle = function(){

            var vesselArr = [];
            var vesselList = "";
            $.each(ctrl.requests, function(key,val){
                if(vesselArr.indexOf(val.vesselDetails.vessel.name) <= 0){
                    vesselArr.push(val.vesselDetails.vessel.name);
                    vesselList += val.vesselDetails.vessel.name + ", ";
                }
            });
            vesselList = vesselList.slice(0,-2);
            var title = "";

            if ($state.params.title) {
                title = $state.params.title;
            } else {
                title = $state.params.path[$state.params.path.length - 1].label;
            }

            if(vesselArr.length == 1){
                title = title + " - ";
            }else{
                title = title + " - ";
            }
            title = title +  vesselList;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            })
            // $rootScope.$emit('$changePageTitle', {
            //     title: title
            // })
        }

		ctrl.gorTableRendered = function(rowIdx,location) {
			locationsLength = 0
			$.each($filter('groupBy')(ctrl.locations, 'uniqueLocationIdentifier'), function(k,v){
				if (k) {
					locationsLength += 1
				}
			})
			console.log("hide loader from gorTableRendered", rowIdx, locationsLength)
			if (rowIdx+1 == locationsLength) {
			}
		}

		ctrl.confirmNavigateBlade = function() {
			console.log(ctrl.changeBladeWidgetFunction); 
			ctrl.confirmedBladeNavigation = true;
			eval(eval(ctrl.changeBladeWidgetFunction.function).apply(null, ctrl.changeBladeWidgetFunction.params) )
		}

		$rootScope.$on("counterpartyBladeClosed", function(e,d){
			if (d) {
				ctrl.prefferedSellerCheckbox = true;
				ctrl.requirements = []
				ctrl.requirementRequestProductIds = []
				ctrl.groupedSellersByLocation = null;
				ctrl.bladeOpened = false;
				ctrl.confirmedBladeNavigation = true;
				$scope.$apply();
				setTimeout(function(){
					ctrl.prefferedSellerCheckbox = false;
					$scope.$apply();
				},500)
			}
		});

        ctrl.sendRequote = function() {
            if (!ctrl.requirements || ctrl.requirements.length <= 0) {
                toastr.error("You cannot Requote, as No RFQ is associated with Sellers Offer.");
                return;
            }
            var rfq_data = {
                "Requirements": ctrl.requirements,
                "QuoteByDate": ctrl.quoteByDate,
                "QuoteByCurrencyId": ctrl.quoteByCurrency.id,
                "QuoteByTimeZoneId": ctrl.quoteByTimezone.id,
                "Comments": ctrl.internalComments
            };

            groupOfRequestsModel.requoteRFQ(rfq_data).then(function(response) {
				ctrl.requirements = [];
            });
        };

        ctrl.checkIfCanSendNoQuote = function() {
			hasNoQuotableSelected = false;
			hasQuotableSelected = false;
			if (ctrl.requirements.length > 0) {
				hasQuotableSelected = true;
			}
        	selectedNoQuotableItems = [];
        	if (ctrl.selectedNoQuoteItems) {
				Object.keys(ctrl.selectedNoQuoteItems).map(function (key, value) {
				    if (ctrl.selectedNoQuoteItems[key]) {
				    	selectedNoQuotableItems.push(key.split('nq')[1])
						hasNoQuotableSelected = true; 		
				    }
				});        	
        	}
        	// $.each(ctrl.selectedNoQuoteItems, function(nqKey, nqVal){
        	// 	if (nqVal) {
		       //  	selectedNoQuotableItems.push(nqKey.split('nq')[1])
        	// 		hasNoQuotableSelected = true;
        	// 	}
        	// });
        	if (hasNoQuotableSelected && hasQuotableSelected) {
	        	ctrl.sendNoQuoteButtonText = null;
        		return false;
        	}

        	if (hasNoQuotableSelected) {ctrl.sendNoQuoteButtonText = 'Enable Quote';}
        	if (hasQuotableSelected) {ctrl.sendNoQuoteButtonText = 'No Quote';}
        	if (!hasNoQuotableSelected && !hasQuotableSelected) {ctrl.sendNoQuoteButtonText = null;}
        	selectedQuotableItems = []
        	$.each(ctrl.requirements, function(reqKey, reqVal){
	        	selectedQuotableItems.push(reqVal.requestOfferId);
	        	if (!reqVal.requestOfferId) {
	        		ctrl.sendNoQuoteButtonText = null;
	        	}
        	});
        	if (hasNoQuotableSelected) {
        		noQuoteBool = false
        		requestOfferIds = selectedNoQuotableItems
        	} else {
        		noQuoteBool = true
        		requestOfferIds = selectedQuotableItems
        	}
        	 payload = {
        	 	"Payload" : {
        	 		"RequestOfferIds" : requestOfferIds,
        	 		"NoQuote" : noQuoteBool
        	 	}
        	 }
        	 ctrl.sendNoQuotePayload = payload;
        }
        ctrl.sendNoQuote = function(){
            groupOfRequestsModel.switchHasNoQuote(ctrl.sendNoQuotePayload).then(function(response) {
                ctrl.initScreenAfterSendOrSkipRfq();
            });        	
        }

        ctrl.calculateProductColumnWidth = function() {
       //  	numberOfRequests = 0;
       //  	numberOfProducts = 0;
       //  	productLocations = [];
       //  	$.each(ctrl.requests, function (reqK, reqV) {
       //  		numberOfRequests += 1;
       //          $.each(reqV.locations, function (locK, locV) {
       //              $.each(locV.products, function (prodK, prodV) {
       //              	if (prodV.productLocations) {
	      //               	Object.keys(prodV.productLocations).forEach(function(key) {
							// 	productLocations.push(key)
							// });
       //              	}
		     //    		numberOfProducts += 1;
       //              })
       //          })
       //      })
       //      width = null;
       //      if (numberOfRequests == 1 && numberOfProducts < 5) {
       //      }

        	width = 100 / ($(".negotiationProductTh").length / $(".negotiationLocationRowGroup").length)  + "%";
            return width
        }

        ctrl.trustAsHtml = function(html){
        	return $sce.trustAsHtml(html);
        }

        ctrl.groupLocationsByUniqueLocationIdentifier = function() {
        	ctrl.locationsGroupedByULI = $filter('groupBy')(ctrl.locations, 'uniqueLocationIdentifier');
        }


		$scope.$watch('ctrl.requests', function(newValue, oldValue) {
		});
		$scope.$watch('ctrl.locations', function(newValue, oldValue) {
			ctrl.groupLocationsByUniqueLocationIdentifier()
		});		
		$scope.$watch('ctrl.requirements', function(newValue, oldValue) {
		});


    }
]);
angular.module("shiptech.pages").component("groupOfRequests", {
    templateUrl: "pages/group-of-requests/views/group-of-requests-component.html",
    controller: "GroupOfRequestsController"
});
