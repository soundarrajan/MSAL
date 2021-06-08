angular.module('shiptech.pages').controller('GroupOfRequestsController', [
    '$scope',
    '$rootScope',
    '$element',
    '$compile',
    '$attrs',
    '$timeout',
    '$interval',
    '$uibModal',
    '$templateCache',
    '$listsCache',
    '$filter',
    '$state',
    '$stateParams',
    '$http',
    'Factory_Master',
    'STATE',
    'API',
    'SCREEN_ACTIONS',
    'screenActionsModel',
    'uiApiModel',
    'lookupModel',
    'groupOfRequestsModel',
    'newRequestModel',
    'tenantService',
    'LOOKUP_TYPE',
    'LOOKUP_MAP',
    'SCREEN_LAYOUTS',
    'SELLER_SORT_ORDER',
    'EMAIL_TRANSACTION',
    'CUSTOM_EVENTS',
    'MOCKUP_MAP',
    'PACKAGES_CONFIGURATION',
    'screenLoader',
    'listsModel',
    '$tenantSettings',
    '$sce',
    function($scope, $rootScope, $element, $compile, $attrs, $timeout, $interval, $uibModal, $templateCache, $listsCache, $filter, $state, $stateParams, $http, Factory_Master, STATE, API, SCREEN_ACTIONS, screenActionsModel, uiApiModel, lookupModel, groupOfRequestsModel, newRequestModel, tenantService, LOOKUP_TYPE, LOOKUP_MAP, SCREEN_LAYOUTS, SELLER_SORT_ORDER, EMAIL_TRANSACTION, CUSTOM_EVENTS, MOCKUP_MAP, PACKAGES_CONFIGURATION, screenLoader, listsModel, $tenantSettings, $sce) {
        $scope.STATE = STATE;
        let ctrl = this;
        let groupId = $stateParams.groupId;
        let group = $stateParams.group;
        let initialValueExternalComments = null;
        let initialValueInternalComments = null;
        ctrl.groupId = $stateParams.groupId;
        $state.params.title = 'Group of Requests';
        ctrl.req_cards = 'big';
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
        tenantService.tenantSettings.then((settings) => {
            ctrl.quoteByCurrency = settings.payload.tenantFormats.currency;
            ctrl.quoteByTimezone = settings.payload.tenantFormats.timeZone;
            ctrl.numberPrecision = settings.payload.defaultValues;
            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
            ctrl.quantityPrecision = settings.payload.defaultValues.quantityPrecision;
            ctrl.tenantFormats = settings.payload.tenantFormats;
            // ctrl.needSupplierQuote = settings.payload.
        });
        tenantService.procurementSettings.then((settings) => {
            ctrl.isEnergyCalculationRequired = settings.payload.energyConfiguration.isEnergyCalculationRequired;
            ctrl.sixMonthHistoryFor = settings.payload.energyConfiguration.sixMonthHistoryFor;
            ctrl.includeAverageSurveyorCharge = settings.payload.energyConfiguration.includeAverageSurveyorCharge;
            ctrl.averageSurveyorCost = settings.payload.energyConfiguration.averageSurveyorCost;
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
        if (typeof ctrl.blade == 'undefined') {
            ctrl.blade = {};
        }

        let alreadySaved = [];

        // handler for filtering on request status
        $scope.$on(CUSTOM_EVENTS.NOTIFICATION_RECEIVED, (event, notification) => {
            let requestNotification = null;
            ctrl.notificationCount = 0;
            for (let i = 0; i < notification.length; i++) {
                requestNotification = notification[i];
                if (ctrl.requests) {
                    for (let j = 0; j < ctrl.requests.length; j++) {
                        if (ctrl.requests[j].id == requestNotification.RequestId) {
                            ctrl.notificationCount = ctrl.notificationCount + requestNotification.TotalNoOfUnreadOffers;
                        }
                    }
                }
            }
        });


        ctrl.onSixMonthsUpdate = function(results) {
            if (results) {
                // if (results != "-") {
                // 	if (typeof(ctrl.active_prod.products[0].energyParameterValues.initialSpecificEnergy) == "undefined") {
                // 		ctrl.active_prod.products[0].energyParameterValues.initialSpecificEnergy = angular.copy(ctrl.active_prod.products[0].energyParameterValues.specificEnergy);
                // 	}
                // 	if (!ctrl.active_prod.products[0].energyParameterValues.initialSpecificEnergy) {
                // 		ctrl.active_prod.products[0].energyParameterValues.specificEnergy = results;
                // 	}
                // }
                $('.blade-column.main-content-column .ng-dirty').removeClass('ng-dirty');
                ctrl.viewEnergyContentBlade(ctrl.blade.counterpartyActiveSeller, ctrl.blade.counterpartyActiveLocation);
            }
        };

        ctrl.isMinimumTotal = function(requestProducts, location, seller) {
            if (!ctrl.bestTcoData) {
                return;
            }
            let isMinimumTotal = false;
            let currentRequestOfferIds = [];
            $.each(requestProducts, (k, v) => {
                var correctProduct = v.productLocations[`L${ location[0].uniqueLocationIdentifier}`];
            	if (correctProduct) {
	                var productOffer = ctrl.getSellerProductOfferOnLocationRewrite(correctProduct, location, seller.sellerCounterparty.id, seller);
            	}
            	if (productOffer) {
                    currentRequestOfferIds.push(productOffer.id);
            	}
                // if (v.requestLocationId == location[0].id) {
                // 	$.each(v.sellers, function(k1,v1){
                // 		if (v1.sellerCounterparty.id == seller.sellerCounterparty.id) {
                // 			$.each(v1.offers, function(k2,v2){
                // 				currentRequestOfferIds.push(v2.id);
                // 			})
                // 		}
                // 	})
                // }
            });
            // console.log(currentRequestOfferIds);
            $.each(ctrl.bestTcoData.bestTotalTCO, (k, v) => {
                $.each(v.products, (k1, v1) => {
                    if (currentRequestOfferIds.indexOf(v1.requestOfferId) != -1) {
                        isMinimumTotal = true;
                    }
                });
            });
            return isMinimumTotal;
        };

        ctrl.isMinimumAmountOrTco = function(productOffer) {
            if (!ctrl.bestTcoData || !productOffer) {
                return;
            }
            let isMinimumAmountOrTco = false;
            $.each(ctrl.bestTcoData.bestIndividuals, (k, v) => {
                $.each(v.bestTCO, (k1, v1) => {
                    if (v1.requestOfferId == productOffer.id) {
                        isMinimumAmountOrTco = true;
                    }
                });
            });
            return isMinimumAmountOrTco;
        };


        function checkAllCheckboxesDefault() {
        	$.each($('.checkAllOnLocation'), (cbk, cbv) => {
                var checkAllLocationIdentifier = $(cbv).attr('checkAllUniqueLocationIdentifier');
        		let checkedItems = 0;
        		$.each($('[uniqueLocationIdentifier]'), (rowCheckK, rowCheckV) => {
        			if ($(rowCheckV).attr('uniqueLocationIdentifier') == checkAllLocationIdentifier) {
		        		checkedItems--;
		        		if ($(rowCheckV).prop('checked') == true) {
			        		checkedItems++;
		        		}
        			}
        		});
        		if (checkedItems >= 0) {
		        	$(cbv).prop('checked', true);
        		} else {
		        	$(cbv).prop('checked', false);
        		}
        	});
        }
        ctrl.isPhysicalSupplierMandatory = function(counterparty) {
            if (ctrl.fieldVisibility.isPhysicalSupplierMandatory) {
                if (typeof counterparty.physicalSupplier == 'undefined' || counterparty.physicalSupplier == null) {
                    toastr.info('Please make sure you have selected a Physical Supplier before entering price');
                    counterparty.price = null;
                }
            }
        };

        var decodeHtmlEntity = function(str) {
          return str.replace(/&#(\d+);/g, function(match, dec) {
            return String.fromCharCode(dec);
          });
        };

        ctrl.initScreenAfterSendOrSkipRfq = function() {
            // if (action == 'sendRFQ') {
            //     $state.reload();
            //     return;
            // }

	        	$('.checkAllOnLocation').prop('checked', false);
            ctrl.requirements = [];
            ctrl.selectedNoQuoteItems = [];
            ctrl.requirementRequestProductIds = [];
            groupOfRequestsModel.getGroup(groupId).then((data) => {
                	if (data.payload[0].requestGroup.customNonMandatoryAttribute1) {
                		ctrl.sellerSortOrder = data.payload[0].requestGroup.customNonMandatoryAttribute1;
                	} else {
                		ctrl.sellerSortOrder = SELLER_SORT_ORDER.ALPHABET;
                	}
                parseRequestList(data.payload, false, false, true);
                // initializeDataArrays(data.payload);
                getGroupInfo(groupId);
                ctrl.priceInputsDisabled = false;
            });

            function getGroupInfo(groupId) {
                groupOfRequestsModel.getGroupInfo(groupId).then((data) => {
                    	if (data.payload.internalComments) {
                        ctrl.internalComments = decodeHtmlEntity(_.unescape(data.payload.internalComments)).replace(/<br\s?\/?>/g, '\n');
                        initialValueInternalComments = ctrl.internalComments;
                    	}
                    	if (data.payload.externalComments) {
                        ctrl.externalComments = decodeHtmlEntity(_.unescape(data.payload.externalComments)).replace(/<br\s?\/?>/g, '\n');
                        initialValueExternalComments = ctrl.externalComments;
                    	}
                    console.log(data.payload);
                    if (data.payload.quoteByCurrency !== null) {
                        ctrl.setQuoteByCurrency(data.payload.quoteByCurrency.id, data.payload.quoteByCurrency.name);
                    }
                    if (data.payload.quoteByTimeZone !== null) {
                        ctrl.setQuoteByTimezone(data.payload.quoteByTimeZone.id, data.payload.quoteByTimeZone.name);
                    }
                    ctrl.en6MHReferenceDate = data.payload.en6MHReferenceDate;
                    ctrl.quoteByDate = data.payload.quoteByDate;
                    ctrl.quoteByDateFrom = data.payload.quoteByDateFrom;
                    ctrl.rfqNotes = data.payload.rfqNotes;
                    if (ctrl.quoteByDateFrom == '' || ctrl.quoteByDateFrom == null) {
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
                        if (ctrl.isQuoteDateAutoPopulated) {
                            ctrl.quoteByDateFrom = `${d.getFullYear() }-${ month }-${ day }T${ hours }:${ minutes }:${ seconds}`;
                        }
                    }
                    ctrl.isReviewed = data.payload.isReviewed;
                });
            }
        };

      
        // Get the UI settings from server. When complete, get business data.
        ctrl.initScreen = function() {
            uiApiModel.get(SCREEN_LAYOUTS.GROUP_OF_REQUESTS).then((data) => {
                ctrl.ui = data;
                ctrl.screenActions = uiApiModel.getScreenActions();
                // Normalize relevant data for use in the template.
                ctrl.generalInfoFields = normalizeArrayToHash(ctrl.ui.GeneralInformation.fields, 'name');
                ctrl.bestOfferColumns = normalizeArrayToHash(ctrl.ui.BestOffer.columns, 'name');
                ctrl.requirements = [];
                ctrl.requirementRequestProductIds = [];
                // Get the generic data Lists.

                ctrl.sellerTypeIds = getSellerTypeIds();
                lookupModel.getSellerAutocompleteList(ctrl.sellerTypeIds).then((server_data) => {
                    ctrl.sellerAutocompleteList = server_data.payload;
                });
                lookupModel.getSellerAutocompleteList([ '1' ]).then((server_data) => {
                    ctrl.physicalSupplierList = server_data.payload;
                });
                lookupModel.getSellerAutocompleteList([ '3' ]).then((server_data) => {
                    ctrl.brokerList = server_data.payload;
                });
                // Get the lookup list for the Request field in the General Information section.
                groupOfRequestsModel.getRequests().then((data) => {
                    ctrl.autocompleteRequest = data.payload;
                    $timeout(() => {
                        initializeLookupInputs();
                    });
                });
                // Get the business data.
                groupOfRequestsModel.getGroup(groupId).then((data) => {
                	if (data.payload[0].requestGroup.customNonMandatoryAttribute1) {
                		ctrl.sellerSortOrder = data.payload[0].requestGroup.customNonMandatoryAttribute1;
                	} else {
                		ctrl.sellerSortOrder = SELLER_SORT_ORDER.ALPHABET;
                	}
                    parseRequestList(data.payload, false);
                    //initializeDataArrays(data.payload);
                    getGroupInfo(groupId);
                    ctrl.priceInputsDisabled = false;
                });

                function getGroupInfo(groupId) {
                    groupOfRequestsModel.getGroupInfo(groupId).then((data) => {
                    	ctrl.en6MHReferenceDate = data.payload.en6MHReferenceDate;
                    	if (data.payload.internalComments) {
                            ctrl.internalComments = decodeHtmlEntity(_.unescape(data.payload.internalComments)).replace(/<br\s?\/?>/g, '\n');
                            initialValueInternalComments = ctrl.internalComments;
                    	}
                    	if (data.payload.externalComments) {
                            ctrl.externalComments = decodeHtmlEntity(_.unescape(data.payload.externalComments)).replace(/<br\s?\/?>/g, '\n');
                            initialValueExternalComments = ctrl.externalComments;
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
                        ctrl.rfqNotes = data.payload.rfqNotes;
                        if (ctrl.quoteByDateFrom == '' || ctrl.quoteByDateFrom == null) {
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
                            if (ctrl.isQuoteDateAutoPopulated) {
                                ctrl.quoteByDateFrom = `${d.getFullYear() }-${ month }-${ day }T${ hours }:${ minutes }:${ seconds}`;
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
            // Initialize the ETAs.
            ctrl.etas = calcETAs(ctrl.requests);
            // Initialize array of selected requests.
            ctrl.selectedRequests = ctrl.requests;
            // Get the Best Offer data. - Deprecated - Now we use getBestTco

            //

            // initialize the various data arrays needed by the template
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                	loopLocation = locV;
                    $.each(locV.products, (prodK, prodV) => {
                        prodV.requestId = reqV.id;
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            var seller = sellerV;
                            var uniqueIdentifier = `${seller.sellerCounterparty.id }-null`;
                            var packageType = 'individual';
                            if (typeof seller.offers != 'undefined') {
                                if (seller.offers.length > 0) {
                                	seller.offers[0].computedEta = loopLocation.recentEta ? loopLocation.recentEta : loopLocation.eta
                                    if (seller.offers[0].physicalSupplierCounterparty) {
                                        uniqueIdentifier = `${seller.sellerCounterparty.id }-${ seller.offers[0].physicalSupplierCounterparty.id}`;
                                    }
                                    if (!seller.offers[0].packageId) {
                                        packageType = 'individual';
                                    } else if (seller.offers[0].isSurrogatePackage) {
                                        packageType = 'buyer';
                                    } else {
                                        packageType = 'seller';
                                    }
                                    if (sellerV.offers[0].quotedProduct) {
	                                    if (sellerV.offers[0].quotedProduct.id != prodV.product.id) {
								            listsModel.getProductTypeByProduct(sellerV.offers[0].quotedProduct.id).then((server_data) => {
			                                    sellerV.offers[0].quotedProductGroupId = server_data.data.payload.productTypeGroup.id;
								            });
	                                    } else {
		                                    sellerV.offers[0].quotedProductGroupId = prodV.productTypeGroupId;
	                                    }
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
	            // groupOfRequestsModel.getBestOffer(requestGroupProductIds).then(function (data) {
	            //     ctrl.bestOfferData = data.payload;
	            // });
	            groupOfRequestsModel.getBestTco(requestGroupProductIds, ctrl.groupId).then((data) => {
	                ctrl.bestTcoData = data.payload;
	                ctrl.bestTcoData = $scope.modelBestTCODataForTemplating(ctrl.bestTcoData);
                    ctrl.mySelection = data.payload.mySelection.quotations;
	                ctrl.mySelectionSurveyorCost = data.payload.mySelection.averageSurveyorCost;
	            });
            }

            ctrl.recompileDefaultSellerChecks();

            ctrl.setPageTitle();
        }
        ctrl.calculateRandUniquePkg = function(seller) {
            var physicalSupplierId = null;
            var packageType = 'individual';
            var packageId = null;
            if (typeof seller.offers != 'undefined') {
                if (seller.offers.length > 0) {
                    if (seller.offers[0].physicalSupplierCounterparty) {
                        physicalSupplierId = seller.offers[0].physicalSupplierCounterparty.id;
                    }
                    if (!seller.offers[0].packageId) {
                        packageType = 'individual';
                    } else {
                        packageId = seller.offers[0].packageId;
                        if (seller.offers[0].isSurrogatePackage) {
                            packageType = 'buyer';
                        } else {
                            packageType = 'seller';
                        }
                    }
                }
            }
            var randUniquePkg = `${seller.sellerCounterparty.id }-${ physicalSupplierId }-${ packageType }-${ packageId}`;
            return randUniquePkg;
        };
        $scope.remodelSellersStructure = function(requestList) {
            // return requestList;
            // here we remodel the data to fit current FE implementation after BE structure changes
            $.each(requestList, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        if (typeof prodV.sellersCopy == 'undefined') {
                            prodV.sellersCopy = [];
                        }
                        $.each(prodV.sellers, (selK, selV) => {
                            if (selV.offers) {
                                if (selV.offers.length > 0) {
                                    $.each(selV.offers, (offK, offV) => {
                                        prodV.sellersCopy.unshift(angular.copy(selV));
                                    });
                                } else {
                                    prodV.sellersCopy.unshift(angular.copy(selV));
                                }
                            } else {
                                prodV.sellersCopy.unshift(angular.copy(selV));
                            }
                            $.each(prodV.sellersCopy, (sck, scv) => {
                                if (scv.id == selV.id) {
                                    scv.offers = [];
                                }
                            });
                        });
                        var offersToBeAdded = [];
                        $.each(prodV.sellersCopy, (sck, scv) => {
                            offersToBeAdded = [];
                            $.each(prodV.sellers, (selK, selV) => {
                                if (selV.offers) {
                                    if (selV.offers.length > 0) {
                                        $.each(selV.offers, (offK, offV) => {
                                            offersToBeAdded.unshift(angular.copy(offV));
                                        });
                                    }
                                } else {
                                    offersToBeAdded.unshift(angular.copy(offV));
                                }
                            });
                        });
                        $.each(prodV.sellersCopy, (sck, scv) => {
                            $.each(offersToBeAdded, (offk, offv) => {
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

        ctrl.recompileDefaultSellerChecks = function() {
        	$timeout(() => {
	        	if (ctrl.initialSelectedCheckboxesRequirements) {
	                if (ctrl.initialSelectedCheckboxesRequirements.length != 0 || ctrl.initialSelectedCheckboxesRequirements == true) {
	                    ctrl.requirements = [];
	                    ctrl.initedCheckboxes = [];
	                    ctrl.checkedCounterpartyRows = [];
	                	$scope.$apply(() => {
	        	            ctrl.resetSellerInitChecks = false;
	                	});
	                    $timeout(() => {
	                        ctrl.resetSellerInitChecks = true;
	                    }, 150);
	                }
	            }
        	});
        };

        function getSellerTypeIds() {
            let sellerIdList = [];
            for (let sellerType in ctrl.sellerTypeCheckboxes) {
                if (ctrl.sellerTypeCheckboxes[sellerType] === true) {
                    var filtered = $filter('filter')(ctrl.lists.CounterpartyType, {
                        name: sellerType
                    })[0];
                    if (typeof filtered != 'undefined') {
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
        ctrl.calculateScreenActions = function() {
            if (!ctrl.requests) {
                return false;
            }
            let requestProducts = [];
            let product, requestActions;
            // Iterate Requests and their respective locations and products to extract actions.
            for (let i = 0; i < ctrl.requests.length; i++) {
                for (let j = 0; j < ctrl.requests[i].locations.length; j++) {
                    for (let k = 0; k < ctrl.requests[i].locations[j].products.length; k++) {
                        product = ctrl.requests[i].locations[j].products[k];
                        if (
                            $filter('filter')(requestProducts, {
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
            let requestIds = [];
            for (let i = 0; i < requests.length; i++) {
                requestIds.push(requests[i].id);
            }
            return requestIds;
        }

        /**
         * Initializes the various data arrays needed by the template.
         * @param {Array} requests - The list of requests for which we need info.
         */
        function initializeDataArrays(requests, skipSellerSorting) {
            var productIds = getRequestGroupProductIdsCSV(requests);
            var counterpatyIds = getRequestGroupCounterpartyIdsCSV(requests);
            if (!skipSellerSorting) {
	            groupOfRequestsModel.getSellersSorted(counterpatyIds, productIds, ctrl.sellerSortOrder).then((data) => {
	                if (data.payload !== null) {
	                    ctrl.sellers = normalizeArrayToHash(data.payload, 'counterpartyId');
                        ctrl.locationsRatingSorted = _.groupBy(data.payload, 'locationId');
	                    ctrl.sellerOrder = getSellerOrder(data.payload);
	                }
	                ctrl.locations = getLocationsFromRequests(requests);
	                ctrl.groupLocationsByUniqueLocationIdentifier();
	                ctrl.products = getAllRequestProductList(requests);
	                setRequestProductCount(requests);
	                // initialize notifications
	                notificationsModel.stop();
	                notificationsModel.start(getRequestIds(requests));
	                // calculates screen actions
	                ctrl.calculateScreenActions();
	            });
            }
        }

        /**
         * Initializes the lookup input fields in the template.
         * TODO: Can this be automated by iterating the UI fields?
         */
        function initializeLookupInputs() {
            bindTypeahead('#id_Request', normalizeJSONRequestsLookupData(ctrl.autocompleteRequest), requestTypeaheadChange);
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
            let element = $(selector);
            element
                .typeahead(
                    {
                        hint: true,
                        highlight: true,
                        minLength: 1
                    },
                    {
                        source: lookupModel.substrMatcher(list),
                        limit: 10
                    }
                )
                .bind('typeahead:select', (event, suggestion) => {
                    if (cb) {
                        cb(event, suggestion);
                    }
                });
        }

        ctrl.displayNumberOfRowsNegTable = function() {
            var data = [
                {
                    value: 3,
                    name: '3'
                },
                {
                    value: 5,
                    name: '5'
                },
                {
                    value: 10,
                    name: '10'
                },
                {
                    value: 999,
                    name: 'All'
                }
            ];
            return data;
        };

        /**
         * Gets a Request object by its name, from the autocompleteRequest array.
         * @param {String} name - The Request name.
         * @returns {Object} - The Request object, if found.
         */
        function getRequestByName(name) {
            for (let i = 0; i < ctrl.autocompleteRequest.length; i++) {
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
            groupOfRequestsModel.getRequests().then((data) => {
                var payloadRequestList = _.uniq(_.map(requestsList, 'requestId'));

                if (typeof requestsList == 'string') {
                    var requestName = requestsList;
	                ctrl.autocompleteRequest = data.payload;

	                if(alreadySaved.indexOf(requestName) != -1) {
	                    return;
	                }

	                alreadySaved.push(requestName);

	                var request = getRequestByName(requestName);
	                if (request.id) {
	                	var request = request.id;
	                }
                	payloadRequestList = [ request ];
                }


                groupOfRequestsModel.addRequestsToGroup(payloadRequestList, groupId).then((newRequestData) => {
                    if (newRequestData.payload) {
                        var newRequestAddedData = $scope.remodelSellersStructure(newRequestData.payload);
                        // newRequestAddedData = newRequestData.payload;
                        for (let i = 0; i < newRequestAddedData.length; i++) {
                            ctrl.requests.unshift(newRequestAddedData[i]);
                        }
                        ctrl.prefferedSellerCheckbox = true;
                        ctrl.requestTabs = createRequestTabs(ctrl.requests);
                        initializeDataArrays(ctrl.requests);
                        parseRequestList(ctrl.requests, false);
                        // $timeout(function(){
	                       //  ctrl.prefferedSellerCheckbox = false;
                        // },50)
                        ctrl.recompileDefaultSellerChecks();

	                    groupOfRequestsModel.getGroupInfo(groupId).then((data) => {
	                    	ctrl.en6MHReferenceDate = data.payload.en6MHReferenceDate;
	                    	if (data.payload.internalComments) {
	                            ctrl.internalComments = decodeHtmlEntity(_.unescape(data.payload.internalComments)).replace(/<br\s?\/?>/g, '\n');
	                    	}
	                    	if (data.payload.externalComments) {
	                            ctrl.externalComments = decodeHtmlEntity(_.unescape(data.payload.externalComments)).replace(/<br\s?\/?>/g, '\n');
	                    	}
                            ctrl.rfqNotes = data.payload.rfqNotes;
	                    });
                    }
                }).finally(() => {
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
            $(event.target).typeahead('val', '');
        }

        function sellerTypeaheadChange(event, suggestion) { }

        /**
         * Get the minimum and nmaximum ETAs from the group of Requests.
         * @param {Requests[]} requests - An array of Requests to search in.
         * @returns {Object} An object with the "from" and "to" ETAs as properties.
         */
        function calcETAs(requests) {
            let dates = [];
            // Iterate Requests and their respective locations to extract ETAs.
            for (let i = 0; i < requests.length; i++) {
                for (let j = 0; j < requests[i].locations.length; j++) {
                    dates.push(moment.utc(requests[i].locations[j].eta));
                }
            }
            return {
                etaFrom: moment.min(dates).format('MM/DD/YYYY HH:mm'),
                etaTo: moment.max(dates).format('MM/DD/YYYY HH:mm')
            };
        }

        /**
         * Retrieves a CSV string made of the IDs of the products in all Requests in the Group.
         * @param {Requests[]} requests - An array of Requests (the Requests group).
         * @returns {String} Product IDs as a CSV string.
         */
        function getRequestGroupProductIdsCSV(requests) {
            let ids = getRequestGroupProductIds(requests);
            return ids.join(',');
        }

        /**
         * Retrieves an array made of the IDs of the products in all Requests in the Group.
         * @param {Requests[]} requests - An array of Requests (the Requests group).
         * @returns {Array} Product IDs list
         */
        function getRequestGroupProductIds(requests) {
            let ids = [];
            // Iterate Requests and their respective locations and products to extract ETAs.
            for (let i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    for (let j = 0; j < requests[i].locations.length; j++) {
                        for (let k = 0; k < requests[i].locations[j].products.length; k++) {
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
         * @returns {Array} Counterparty IDs list
         */
        function getRequestGroupCounterpartyIdsCSV(requests) {
            let ids = [];
            let counterpartyId = -1;
            let counterparty = null;
            // Iterate Requests and their respective locations and products to extract ETAs.
            for (let i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    for (let j = 0; j < requests[i].locations.length; j++) {
                        for (let k = 0; k < requests[i].locations[j].products.length; k++) {
                            for (let m = 0; m < requests[i].locations[j].products[k].sellers.length; m++) {
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
         * @returns {Requests[]} locations - A list of locations.
         */
        function getLocationsFromRequests(requests) {
            let buildedLocations = [];
            ctrl.locations = [];
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        requests[i].locations[j].requestsIds = [];
                    }
                }
            }
            var locationStart = 1000;

            $.each(requests, (rk, rv) => {
            	rv.locations = $filter('orderBy')(rv.locations, '-recentEta', true);
            	rv.firstRecentEta = rv.locations.length > 0 ? rv.locations[0].recentEta : null;
            });
        	requests = $filter('orderBy')(requests, '-firstRecentEta', true);
        	// ctrl.selectedRequests = $filter("orderBy")(ctrl.requests, "-firstRecentEta", true);

            // Iterate Requests and their respective locations to extract ETAs.
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        requests[i].locations[j].requestId = requests[i].id;
                        var uniqueLocationIdentifier = locationStart.toString();
                        locationStart++;
                        // .toString(36)
                        // .substr(2, 6);
                        requests[i].locations[j].uniqueLocationIdentifier = uniqueLocationIdentifier;
                        var availableBuildedLocationKey = -1;
                        if (buildedLocations.length > 0) {
                            var isNewLocation = true;
                            $.each(buildedLocations, (buildedLocationKey, buildedLocationValue) => {
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
                            if (typeof requests[i].locations[j].requestsIds == 'undefined') {
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
            return $filter('orderBy')(buildedLocations, '-location.name', true);
        }

        ctrl.setProductData = function(data, loc) {
            return data;
        };


        /**
         * Get the list of all products from the requests in the group. Group them according to their requests
         * @param {Requests[]} requests - An array of Requests to search in.
         */
        function getAllRequestProductList(requests) {
            let products = [];
            let product, requestProducts, productInList;
            // Iterate Requests and their respective locations and products to extract ETAs.
            for (var i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    requestProducts = [];
                    for (var j = 0; j < requests[i].locations.length; j++) {
                        var currentProducts = [];
                        for (let k = 0; k < requests[i].locations[j].products.length; k++) {
                            product = requests[i].locations[j].products[k];
                            // if product not already in list
                            // filter = $filter("filter")(requestProducts, {
                            //     product: {
                            //         name: product.product.name,
                            //         id: product.product.id
                            //     }
                            // });
                            // filter = $filter("filter")(requestProducts, {id});
                            var reuseProductFlag = -1;
                            $.each(requestProducts, (rpk, rpv) => {
                                // check if this product cand be displayed on a column of a previous product
                                if (rpv.product.id == product.product.id && rpv.requestLocationId != requests[i].locations[j].location.id) {
                                    if (typeof rpv.productLocations[`L${ requests[i].locations[j].uniqueLocationIdentifier}`] == 'undefined') {
                                        reuseProductFlag = rpk;
                                    }
                                }
                            	currentProducts.push(rpv.id);
                            });

                        	if (currentProducts.indexOf(product.id) == -1) {
                                if (reuseProductFlag >= 0) {
                                    // add the current product to a previous product column
                                    requestProducts[reuseProductFlag].productLocations[`L${ requests[i].locations[j].uniqueLocationIdentifier}`] = product;
                                } else {
                                    product.requestId = requests[i].id;
                                    product.productLocations = [];
                                    product.productLocations[`L${ requests[i].locations[j].uniqueLocationIdentifier}`] = product;
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
        // set number of distinct products on each request
        function setRequestProductCount(requests) {
            let requestProductList, productCount;
            for (let i = 0; i < requests.length; i++) {
                if (!requests[i].isDeleted) {
                    productCount = 0;
                    requestProductList = [];
                    // productsOnLocationsCount = [];
                    for (let j = 0; j < requests[i].locations.length; j++) {
                        for (let k = 0; k < requests[i].locations[j].products.length; k++) {
                            var product = requests[i].locations[j].products[k];
                            if (
                                $filter('filter')(requestProductList, {
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
            let tabs = [];
            let requestTab;
            for (let i = 0; i < requests.length; i++) {
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
        ctrl.addSellerToLocations = function(sellerId, locations) {
            // get seller csv
            let product, newCounterparty, newSeller;
            let counterpatyIds = getRequestGroupCounterpartyIdsCSV(ctrl.requests);
            let productIds = [];
            $.each(locations[0].products, (pk, pv) => {
                productIds.push(pv.id);
            });
            var getSellersSortedPayload = {
                RequestProductList: productIds.join(','),
                RequestGroupId: ctrl.groupId,
                LocationId: locations[0].location.id,
                RequestSellerId: sellerId
            };
            if (ctrl.sellerIsAlreadyOnLocation(sellerId, locations[0].uniqueLocationIdentifier)) {
                return toastr.error('The selected seller is already present on that location');
            }
            groupOfRequestsModel.addSeller(getSellersSortedPayload).then((data) => {
                if (data.isSuccess) {
                    ctrl.newSeller = [];
                    ctrl.initScreen();
                    return false;
                    counterpatyIds = `${counterpatyIds },${ sellerId}`;
                    // get sellers object info
                    groupOfRequestsModel.getSellersSorted(counterpatyIds, productIds, ctrl.sellerSortOrder).then((data) => {
                        ctrl.sellers = normalizeArrayToHash(data.payload, 'counterpartyId');
                        ctrl.sellerOrder = getSellerOrder(data.payload);
                        var randomUnique = Math.random()
                            .toString(36)
                            .substr(2, 6);
                        newCounterparty = {};
                        $.each(data.payload, (k, v) => {
                            if (v.counterpartyId == sellerId) {
                                newCounterparty = v;
                            }
                        });
                        // newCounterparty = angular.copy($filter("filter")(data.payload, {
                        //     counterpartyId: sellerId
                        // }));
                        var sellerIsAlreadyAddedToLocation = false;
                        if (ctrl.sellerIsAlreadyOnLocation(sellerId, locations[0].uniqueLocationIdentifier)) {
                            return toastr.error('The selected seller is already present on that location');
                        }
                        // if (newCounterparty || typeof(newCounterparty) == 'undefined') {
                        for (let i = 0; i < locations.length; i++) {
                            for (let j = 0; j < locations[i].products.length; j++) {
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
                                newSeller.randUnique = `${randomUnique }-null`;
                                newSeller.randUniquePkg = `${randomUnique }-null-individual-null`;
                                newSeller.packageType = 'individual';
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
                        // reset seller inputs template model
                        ctrl.newSeller = [];
                        ctrl.recompileDefaultSellerChecks();
                    });
                }
            });
            ctrl.changeScroll();
        };
        ctrl.addSellerToAllLocations = function(sellerId, locations) {
            let product, newCounterparty, newSeller;
            let counterpatyIds = getRequestGroupCounterpartyIdsCSV(ctrl.requests);
            let productIds = getRequestGroupProductIdsCSV(ctrl.requests);
            var locationsCount = 0;
            ctrl.sellersAddedToAllLocations = 0;
            $.each(ctrl.locations, (k, v) => {
                if (!ctrl.sellerIsAlreadyOnLocation(sellerId, v.uniqueLocationIdentifier)) {
                    locationsCount = locationsCount + 1;
                }
            });
            $.each(ctrl.locations, (k, v) => {
                setTimeout(() => {
                    let currentLocationProductIds = [];
                    $.each(v.products, (k2, v2) => {
                        currentLocationProductIds.push(v2.id);
                    });
                    // $.each(locations, function(k1,v1){
                    // })
                    currentLocationProductIds = currentLocationProductIds.join(',');

                    var getSellersSortedPayload = {
                        RequestProductList: currentLocationProductIds,
                        RequestGroupId: ctrl.groupId,
                        LocationId: v.location.id,
                        RequestSellerId: sellerId
                    };
                    if (!ctrl.sellerIsAlreadyOnLocation(sellerId, v.uniqueLocationIdentifier)) {
                        groupOfRequestsModel.addSeller(getSellersSortedPayload).then((data) => {
                            if (data.isSuccess) {
                                ctrl.sellersAddedToAllLocations = ctrl.sellersAddedToAllLocations + 1;
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
        ctrl.sellerIsAlreadyOnLocation = function(sellerId, locationUnique) {
            var sellerIsInLocation = false;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    if (locV.uniqueLocationIdentifier == locationUnique) {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
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
        ctrl.onSellerSelect = function(sellerId) {
            let locations;
            // get locations
            // if no input saved, add to all locations
            if (ctrl.lookupInput === null) {
                locations = ctrl.locations;
                // if input has been saved, only add to input model location
            } else {
                locations = ctrl.lookupInput;
            }
            ctrl.addSellerToLocations(sellerId, locations);
        };
        ctrl.onSupplierSelect = function(newSupplierData) {
            var seller = ctrl.physicalSupplierOpenModalData.seller;
            var sellerLocation = ctrl.physicalSupplierOpenModalData.location;
            var newSupplier = {
                id: newSupplierData.id,
                name: newSupplierData.name
            };
            ctrl.updatePhysicalSupplierForSellers(seller, newSupplier, sellerLocation);
        };
        ctrl.onBrokerSelect = function(newSupplierData) {
            var seller = ctrl.physicalSupplierOpenModalData.seller;
            var sellerLocation = ctrl.physicalSupplierOpenModalData.location;
            var newSupplier = {
                id: newSupplierData.id,
                name: newSupplierData.name
            };
            ctrl.updateBrokerForSellers(seller, newSupplier, sellerLocation);
        };
        ctrl.changeSellerTypes = function() {
            ctrl.sellerTypeIds = getSellerTypeIds();
            lookupModel.getSellerAutocompleteList(ctrl.sellerTypeIds).then((server_data) => {
                ctrl.sellerAutocompleteList = server_data.payload;
            });
        };

        /**
         * Save latest lookup input model used
         *
         * @param {object} input - the input model we want to save
         */
        ctrl.setLookupInput = function(input) {
            ctrl.lookupInput = input;
        };

        /**
         * Get latest product offer from seller
         *
         * @param {object} product - product as retrieved from the server
         * @param {array} locations - currentLocation group as retrieved from the server
         * @param {object} sellerId - sellerId we wish to get offer from
         */
        ctrl.getSellerProductOfferOnLocation = function(product, locations, sellerId, sellerObj) {
            let seller;
            let theLocation;
            // get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    theLocation = locations[i];
                    break;
                }
            }
            var physicalSupplierId = null;
            if (typeof sellerObj.offers != 'undefined') {
                if (sellerObj.offers.length > 0) {
                    if (sellerObj.offers[0].physicalSupplierCounterparty) {
                        physicalSupplierId = sellerObj.offers[0].physicalSupplierCounterparty.id;
                    }
                }
            }
            // if there is no matching location. return null offer
            if (!theLocation) {
                return null;
            }
            for (i = 0; i < theLocation.products.length; i++) {
                // productIds should match
                if (theLocation.products[i].product.id === product.product.id) {
                    for (let j = 0; j < theLocation.products[i].sellers.length; j++) {
                        seller = theLocation.products[i].sellers[j];
                        if (seller.sellerCounterparty.id == sellerId) {
                            var loopPhysicalSupplierId = null;
                            if (typeof seller.offers != 'undefined') {
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
        ctrl.getSellerProductOfferOnLocationRewrite = function(product, locations, sellerId, sellerObj) {
            var offer = null;
            $.each(ctrl.requests, (reqK, reqV) => {
                if (product.requestId == reqV.id) {
                    $.each(reqV.locations, (locK, locV) => {
                        if (locV.uniqueLocationIdentifier == locations[0].uniqueLocationIdentifier) {
                            $.each(locV.products, (prodK, prodV) => {
                                if (prodV.id == product.id) {
                                    if (prodV.sellers.length > 0) {
                                        $.each(prodV.sellers, (selK, selV) => {
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
        ctrl.getSellerProductStatusOnLocation = function(product, locations, sellerObj) {
            var productStatus = null;
            $.each(ctrl.requests, (reqK, reqV) => {
                if (product.requestId == reqV.id) {
                    $.each(reqV.locations, (locK, locV) => {
                        if (locV.uniqueLocationIdentifier == locations[0].uniqueLocationIdentifier) {
                            $.each(locV.products, (prodK, prodV) => {
                                if (prodV.id == product.id) {
                                    if (prodV.sellers.length > 0) {
                                        $.each(prodV.sellers, (selK, selV) => {
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
        ctrl.getSellerRequestStatusOnLocation = function(product, locations, sellerObj) {
            var requestStatus = null;
            $.each(ctrl.requests, (reqK, reqV) => {
                if (product.requestId == reqV.id) {
                    $.each(reqV.locations, (locK, locV) => {
                        if (locV.uniqueLocationIdentifier == locations[0].uniqueLocationIdentifier) {
                            $.each(locV.products, (prodK, prodV) => {
                                if (prodV.id == product.id) {
                                    if (prodV.sellers.length > 0) {
                                        $.each(prodV.sellers, (selK, selV) => {
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
        ctrl.getProductMaxQuantityOnLocation = function(product, locations) {
        	if (!product) {
        		return;
        	}
            var data = {};
            let theLocation;
            // get correct location from group (the location matching the products request)
            for (let i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    theLocation = locations[i];
                    break;
                }
            }
            // if there is no matching location. return empty quantity
            if (!theLocation) {
                return 0;
            }
            // var productList = $filter("filter")(location.products, {
            //     product: {
            //         id: product.product.id
            //     }
            // });
            var productList = [];
            $.each(theLocation.products, (k, v) => {
                if (v.id == product.id) {
                    productList.push(v);
                }
            });
            if (productList.length > 0) {
                data.qty = productList[0].maxQuantity;
                data.uom = productList[0].uom;
                data.quotePrice = productList[0].quotePrice;
                return data;
            }
            return 0;
        };

        /**
         * Get all sellers of products in the specified location.
         *
         * @param {array} locations - array of Location DTO objects with matching location parameter as retrieved from the server
         */
        ctrl.getSortedLocationSellers = function(locations) {
            let sellers = [];
            let counterpartyIds = [];
            let seller = null;
            let counterpartyId = -1;
            let productList = [];
            if (typeof locations == 'undefined') {
                return false;
            }
            // get products from grouped locations
            for (var i = 0; i < locations.length; i++) {
                productList = productList.concat(locations[i].products);
            }
            for (i = 0; i < productList.length; i++) {
                for (let j = 0; j < productList[i].sellers.length; j++) {
                    seller = productList[i].sellers[j];
                    if (seller) {
                        var uniqueIdentifier = seller.sellerCounterparty.id;
                        if (typeof seller.offers != 'undefined') {
                            if (seller.offers.length > 0) {
                                if (seller.offers[0].physicalSupplierCounterparty) {
                                    uniqueIdentifier = `${seller.sellerCounterparty.id }-${ seller.offers[0].physicalSupplierCounterparty.id}`;
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
            // order array to make sure we respect user sort preference
            ctrl.sellerLocationOrder = getSellerOrder(ctrl.locationsRatingSorted[locations[0].location.id]);
            sellers.sort((a, b) => {
                return ctrl.sellerOrder.indexOf(a.sellerCounterparty.id) - ctrl.sellerOrder.indexOf(b.sellerCounterparty.id);
            });
            return sellers;
        };

        ctrl.getSellerRatingForCounterpartyForSpecificLocation = function(location, counterpartyId) {
            let findSellerRatingForSpecificLocation = _.find(ctrl.locationsRatingSorted[location[0].location.id], function(object) {
                return object.counterpartyId === counterpartyId;
            });
            if (findSellerRatingForSpecificLocation) {
                return findSellerRatingForSpecificLocation.sellerRating;
            }
        }

        /**
         * Get correct seller order from counterparty list.
         *
         * @param {object} counterparties - array with counterparty DTOs
         */
        function getSellerOrder(counterparties) {
            let order = [];
            if (counterparties) {
                for (let i = 0; i < counterparties.length; i++) {
                    order.push(counterparties[i].counterpartyId);
                }
            }
            return order;
        }

        function getRequestById(requestId) {
            return $filter('filter')(ctrl.requests, {
                id: requestId
            })[0];
        }

        /**
         * Remove all requirements of seller from location
         *
         * @param {object} seller - seller object
         * @param {array} locations - location group list
         */
        function removeSellerRequirementsOnLocation(seller, locations, ignoreUpdate) {
            let theLocation, req;
            let productList = [];
            let currentRowRequirements = [];
            if (typeof seller == 'undefined' && typeof locations == 'undefined') {
                return false;
            }
            var physicalSupplierId = null;
            if (seller.offers.length > 0) {
                if (seller.offers[0].physicalSupplierCounterparty) {
                    physicalSupplierId = seller.offers[0].physicalSupplierCounterparty.id;
                }
            }
            for (var i = ctrl.requirements.length - 1; i >= 0; i--) {
                for (let j = 0; j < locations.length; j++) {
                    req = ctrl.requirements[i];
                    theLocation = locations[j];
                    var composedUniqueLocationSellerPhysical = `${theLocation.uniqueLocationIdentifier }-${ seller.randUnique}`;
                    if (req.UniqueLocationSellerPhysical.indexOf(composedUniqueLocationSellerPhysical) > -1 && theLocation.id == req.RequestLocationId) {
                        if (req.randUniquePkg == seller.randUniquePkg) {
				            currentRowRequirements.push(req);
                            ctrl.requirements.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            // get products from grouped locations
            for (i = 0; i < locations.length; i++) {
                productList = productList.concat(locations[i].products);
            }
            for (i = 0; i < productList.length; i++) {
                ctrl.requirementRequestProductIds = removeProductFromRequestProductIds(seller, productList[i], ctrl.requirementRequestProductIds);
            }
            // calculates screen actions
            console.log(currentRowRequirements);
            seller.selected = false;
            if (!ignoreUpdate) {
	            checkUncheckSellerRowUpdate(seller, locations, currentRowRequirements, false);
            }
            ctrl.calculateScreenActions();
        }


        function checkUncheckSellerRowUpdate(seller, locations, currentRowRequirements, checkBool) {
    		if (currentRowRequirements.length > 0) {
	   //  		activeSeller = seller;
                // checkValue = checkBool;
                // activeRequirements = currentRowRequirements;
	        	if (checkBool) {
                    // seller.selected = checkBool;
                    // setSelectedBoolOnSellerCheckbox(currentRowRequirements, checkBool)
                    var payload = createSellerRowCheckPayload(currentRowRequirements, seller, locations, true);
	        	} else {
                    // seller.selected = checkBool;
                    // setSelectedBoolOnSellerCheckbox(currentRowRequirements, checkBool)
	        		payload = createSellerRowCheckPayload(currentRowRequirements, seller, locations, false);
	        	}
	        	if (payload == false) {
                    return;
                }
	        	groupOfRequestsModel.checkSellerRow(payload).then(
	                (response) => {
	                    setSelectedBoolOnSellerCheckbox(currentRowRequirements, checkBool, response.payload);
	                	console.log(response);
	                }
	    		);
        	}
        }

        function setSelectedBoolOnSellerCheckbox(currentRowRequirements, checkBool, response) {
        	$.each(currentRowRequirements, (k, requirement) => {
                var currentRequirement = angular.copy(requirement);
	            $.each(ctrl.requests, (reqK, reqV) => {
                    $.each(reqV.locations, (locK, locV) => {
                    	if (locV.id == currentRequirement.RequestLocationId) {
	                        $.each(locV.products, (prodK, prodV) => {
                                var currentProduct = angular.copy(prodV);
	                            if (prodV.id == currentRequirement.RequestProductId) {
					        		// console.log("++++++++ currentRowRequirements:", currentRequirement.RequestProductId, currentRequirement.randUniquePkg);
                                    var activeSellerFromResponse = _.find(response, (obj) => {
				                		return obj.requestProductId == currentRequirement.RequestProductId;
				                	});
				                	if (activeSellerFromResponse.length > 0) {
				                		activeSellerFromResponse = activeSellerFromResponse[0];
				                	}

                                    $.each(ctrl.requests, (reqK, reqV) => {
                                        $.each(reqV.locations, (locK, locV) => {
                                            if (locV.id == currentRequirement.RequestLocationId) {
                                                $.each(locV.products, (prodK, prodV) => {
                                                    let foundSeller = _.find(prodV.sellers, (o) => {
                                                        return o.randUniquePkg === currentRequirement.randUniquePkg;
                                                    });
                                                    if (foundSeller) {
                                                        var fakeSellerObj = angular.copy(foundSeller);
                                                    	if (!currentRequirement.RequestSellerId) {
                                                    		fakeSellerObj.rfq = null;
                                                    		fakeSellerObj.offers = [];
                                                    	}
                                                        return;
                                                    }
                                                });
                                            }
                                        });
                                    });

                                    if (fakeSellerObj) {
                                        fakeSellerObj.id = activeSellerFromResponse.id;
                                        fakeSellerObj.selected = activeSellerFromResponse.selected;
                                    }

                                    /*
						        	fakeSellerObj = {
						        		"id": activeSellerFromResponse.id,
						        		"randUniquePkg" : currentRequirement.randUniquePkg,
						        		"selected" : activeSellerFromResponse.selected,
						        		"offers" : [],
						        		"rfq" : {},
						        		"packageType" : "individual",
                                        "sellerCounterparty" : _.find(angular.copy(ctrl.sellers), function(o) { return o.counterpartyId === activeSellerFromResponse.requestSellerId })
                                    };
                                    fakeSellerObj.sellerCounterparty.id = activeSellerFromResponse.requestSellerId;
                                    fakeSellerObj.sellerCounterparty.name = fakeSellerObj.sellerCounterparty.counterpartyName;
                                    */

                                    var foundSeller = false;
	                                if (prodV.sellers.length > 0) {
	                                    $.each(prodV.sellers, (selK, selV) => {
	                                        if (selV.randUniquePkg == currentRequirement.randUniquePkg) {
	                                        	// console.log("++++++++ found Seller" + selV.randUniquePkg + " on product: " + prodV.id)
	                                        	foundSeller = true;
	                                            selV.selected = checkBool;
	                                        }
	                                    });
	                                }
				                	foundSeller = _.find(prodV.sellers, (obj) => {
				                		return obj.randUniquePkg == currentRequirement.randUniquePkg;
				                	});
				                	// console.log("++++++++ lodash found Seller"+ JSON.stringify(foundSeller) + " *** " + currentRequirement.randUniquePkg + " on product: " + prodV.id)
				                	if (!foundSeller) {
				                		prodV.sellers.push(fakeSellerObj);
				                	};
	                            }
	                        });
                    	}
                    });
	            });
        	});
        }

        function createSellerRowCheckPayload(requirements, seller, locations, checked) {
            let productIds = [];
            var hasPriceEnabled = false;
            $.each(requirements, (rk, rv) => {
	            if (rv.productHasOffer) {
		            hasPriceEnabled = true;
	            }
	            $.each(locations, (lk, lv) => {
		            if (rv.RequestLocationId == lv.id) {
			            productIds.push(rv.RequestProductId);
		            }
	            });
            });
            if (hasPriceEnabled) {
            	return false;
            }
            productIds = _.uniqBy(productIds, (e) => {
                return e;
            });
            productIds = productIds.join(',');
            if (!$scope.shouldSaveToggleCheckboxes()) {
                productIds = '';
            }
            if (productIds == '') {
                return false;
            }
            var sellersPayload = {
                RequestProductList: productIds,
                RequestGroupId: ctrl.groupId,
                LocationId: locations[0].location.id,
                RequestSellerId: seller.sellerCounterparty.id,
                HasPriceEnabled: hasPriceEnabled,
                Selected: checked
            };
            return sellersPayload;
        }

        $scope.shouldSaveToggleCheckboxes = function() {
        	let shouldSave = true;
        	$.each(ctrl.requests, (k, v) => {
        		if ([ 'Inquired', 'Quoted', 'Stemmed', 'PartiallyQuoted', 'PartiallyStemmed', 'PartiallyInquired' ].indexOf(v.requestStatus.name) != -1) {
		        	shouldSave = false;
        		}
        	});
        	return shouldSave;
        };

        ctrl.sellerShouldBeCheckedOnInit = function(locationLocationId, productId, sellerCounterpartyId, sellerRandUniquePkg, uniqueLocationIdentifier) {
        	let locationId = locationLocationId;
        	let prodId = productId;
        	let sellerId = sellerCounterpartyId;
        	let randUniquePkg = sellerRandUniquePkg;
        	let locationIdentifier = uniqueLocationIdentifier;

        	// for individual checkbox
            let isSelected = false;
            let sellerExistsForProduct = false;
            $.each(ctrl.requests, (reqK, reqV) => {
                var loopRequest = reqV;
                $.each(reqV.locations, (locK, locV) => {
                	if (locV.location.id == locationId) {
	                    $.each(locV.products, (prodK, prodV) => {
	                    	if (prodV.id == prodId) {
		                        $.each(prodV.sellers, (sellerK, sellerV) => {
		                            if (sellerV.sellerCounterparty.id == sellerId && sellerRandUniquePkg == sellerV.randUniquePkg) {
							            sellerExistsForProduct = true;
                                        var currentCheckRequestData = loopRequest;
                                        var hasNoQuote = false;
		                                if (sellerV.offers) {
		                                    if (sellerV.offers.length > 0) {
		                                        if (!sellerV.offers[0].hasNoQuote) {
		                       						hasNoQuote = sellerV.offers[0].hasNoQuote;
		                                        }
		                                    }
		                                }
		                                if (!hasNoQuote) {
		                                	if (/* (sellerV.isPreferredSeller && sellerV.selected == null) ||*/ sellerV.selected == true || sellerV.selected == null) {
				                                isSelected = true;
		                                	}
		                                }
		                            }
		                        });
	                    	}
	                    });
                	}
                });
            });

            if (!sellerExistsForProduct) {
            	isSelected = true;
            }
            // if (["Inquired","Quoted","Stemmed", "PartiallyQuoted", "PartiallyStemmed", "PartiallyInquired"].indexOf(currentCheckRequestData.requestStatus.name) != -1) {
            // 	isSelected = false;
            // }
            if (!$scope.shouldSaveToggleCheckboxes()) {
                isSelected = false;
            }

            return isSelected;

            if (typeof ctrl.checkedCounterpartyRows == 'undefined') {
            	ctrl.checkedCounterpartyRows = [];
            }
            if (typeof ctrl.initedCheckboxes == 'undefined') {
            	ctrl.initedCheckboxes = [];
            }
            if (ctrl.initedCheckboxes[`${locationId }-${ prodId }-${ sellerId}`]) {
                return;
            }
            if (!ctrl.initedCheckboxes[`${locationId }-${ prodId }-${ sellerId}`]) {
                ctrl.initedCheckboxes[`${locationId }-${ prodId }-${ sellerId}`] = true;
            }

            if (`${randUniquePkg} - ${locationIdentifier}` == '61-null-individual-null - 1001') {
            	// debugger;
            }

	            if (typeof ctrl.checkedCounterpartyRows[`${randUniquePkg}-${locationIdentifier}`] == 'undefined') {
		            ctrl.checkedCounterpartyRows[`${randUniquePkg}-${locationIdentifier}`] = false;
	            }
	            $.each(ctrl.requests, (reqK, reqV) => {
	            	$.each(reqV.locations, (locK, locV) => {
	            		if (locationIdentifier == locV.uniqueLocationIdentifier) {
		            		$.each(locV.products, (prodK, prodV) => {
		            			$.each(prodV.sellers, (sellerK, sellerV) => {
		            				if (sellerV.randUniquePkg == randUniquePkg) {
                                        var hasNoQuote = false;
		            					if (sellerV.offers) {
		            						if (sellerV.offers.length > 0) {
		            							if (!sellerV.offers[0].hasNoQuote) {
		            								hasNoQuote = sellerV.offers[0].hasNoQuote;
		            							}
		            						}
		            					}
		            					if (!hasNoQuote) {
		            						if (sellerV.isPreferredSeller && sellerV.selected == null || sellerV.selected == true) {
		            							ctrl.checkedCounterpartyRows[`${randUniquePkg}-${locationIdentifier}`] = true;
		            						}
		            					}
		            				}
		            			});
		            		});
	            		}
	            	});
	            });
            // console.log(locationId, prodId, sellerId) ;
            console.log('*************', `${locationId }-${ prodId }-${ sellerId}`, ctrl.checkedCounterpartyRows[`${randUniquePkg}-${locationIdentifier}`]);

            setTimeout(() => {
	            ctrl.initialSelectedCheckboxesRequirements = angular.copy(ctrl.requirements);
	            console.log(ctrl.initialSelectedCheckboxesRequirements);
            }, 250);
            return ctrl.checkedCounterpartyRows[`${randUniquePkg}-${locationIdentifier}`];
        };


        function removeAllSellerRequirements() {
            ctrl.requirements = [];
        }
        ctrl.productHasSeller = function(product, sellerId) {
            return (
                $filter('filter')(
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
        function removeSellerProductRequirementsOnLocation(seller, locations, product, event) {
            let theLocation;
            if (typeof sellerId == 'undefined' && typeof locations == 'undefined' && typeof product == 'undefined') {
                return false;
            }
            // get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    theLocation = locations[i];
                    break;
                }
            }
            // if there is no matching location. product is not available
            if (!theLocation) {
                return false;
            }
            for (i = ctrl.requirements.length - 1; i >= 0; i--) {
                var req = ctrl.requirements[i];
                var composedUniqueLocationSellerPhysical = `${theLocation.uniqueLocationIdentifier }-${ seller.randUnique}`;
                if (req.UniqueLocationSellerPhysical.indexOf(composedUniqueLocationSellerPhysical) > -1 && theLocation.id == req.RequestLocationId && product.id == req.RequestProductId) {
                    if (req.randUniquePkg == seller.randUniquePkg) {
		                if (typeof event != 'undefined') {
				            checkUncheckSellerRowUpdate(seller, locations, [ ctrl.requirements[i] ], false);
		                }
                        ctrl.requirements.splice(i, 1);
                    }
                }
            }
            ctrl.requirementRequestProductIds = removeProductFromRequestProductIds(seller, product, ctrl.requirementRequestProductIds);
            // calculates screen actions
            ctrl.calculateScreenActions();
        }
        ctrl.removePackageRequirements = function(seller, locations, productSample) {
            var i = 0;
            var req;
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
            let result = ids;
            for (let i = ids.length - 1; i >= 0; i--) {
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
        ctrl.selectRequest = function(requestList) {
            addRequest(requestList);
        };
        ctrl.getSellerProductTotalOnLocation = function(products, locations, sellerId) {
            let total = 0;
            let seller, offer, product, requestProductsInLocation;
            let theLocation;
            // get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === products[0].requestId) {
                    theLocation = locations[i];
                    break;
                }
            }
            // if there is no matching location. return empty total
            if (!theLocation) {
                return 0;
            }
            for (i = 0; i < theLocation.products.length; i++) {
                product = theLocation.products[i];
                requestProductsInLocation = $filter('filter')(products, {
                    // product: {
                    //     id: product.product.id
                    // }
                    id : product.id
                });
                if (requestProductsInLocation.length > 0 && requestProductsInLocation[0].requestId == theLocation.requestId) {
                    for (let j = 0; j < product.sellers.length; j++) {
                        seller = product.sellers[j];
                        if (seller.sellerCounterparty.id == sellerId) {
                            offer = ctrl.getSellerLatestOffer(seller);
                            if (offer) {
                                total = total + offer.totalAmount;
                                if (!total) {
                                    total = 0;
                                }
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
        ctrl.getSellerLatestOffer = function(seller) {
            if (!seller || !seller.offers || seller.offers.length === 0) {
                return null;
            }
            let latestDate = moment(seller.offers[0].quoteDate, moment.ISO_8601);
            let latestOffer = seller.offers[0];
            let currentDate;
            for (let i = 0; i < seller.offers.length; i++) {
                var currentOfferDate = moment(seller.offers[0].quoteDate, moment.ISO_8601);
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
        ctrl.isRequestTabExpanded = function(index) {
            if (typeof ctrl.requestTabs[index] != 'undefined') {
                return ctrl.requestTabs[index].expanded;
            }
            return false;
        };

        /**
         * Toggle the expanded state of a request tab from the Group of Requests table.
         *
         * @param {integer} index - The request tab index in the ctrl.requestTabs array.
         */
        ctrl.toggleRequestTab = function(index) {
            ctrl.requestTabs[index].expanded = !ctrl.requestTabs[index].expanded;
        };
        ctrl.expandAll = function() {
            // debugger;
            ctrl.isSellerHistoryExpanded = !ctrl.isSellerHistoryExpanded;
            // ctrl.isRequestTabExpanded = !ctrl.isRequestTabExpanded;
            ctrl.commentsSectionIsExpanded = !ctrl.commentsSectionIsExpanded;
            ctrl.counterpartyDetailsIsExpanded = !ctrl.counterpartyDetailsIsExpanded;
            ctrl.allExpanded = !ctrl.allExpanded;
        };
        ctrl.toggleEnergyContentTab = function(product, prodKey) {
            if (ctrl.isEnergyCalculationRequired) {
                console.log(product);
                if (typeof ctrl.energyContentExpanded == 'undefined') {
                    ctrl.energyContentExpanded = [];
                }
                ctrl.energyContentExpanded[`prod${ product.requestId }${prodKey}`] = !ctrl.energyContentExpanded[`prod${ product.requestId }${prodKey}`];
                ctrl.priceExpanded[`prod${ product.requestId }${prodKey}`] = !ctrl.priceExpanded[`prod${ product.requestId }${prodKey}`];
            } else {
                if (typeof ctrl.priceExpanded == 'undefined') {
                    ctrl.priceExpanded = [];
                }
                ctrl.priceExpanded[`prod${ product.requestId }${prodKey}`] = !ctrl.priceExpanded[`prod${ product.requestId }${prodKey}`];
            }
        };

        /**
         * Set lookup dialog variables
         *
         * @param {string} type - The type of content we want the dialog to show
         */
        ctrl.setDialogType = function(type) {
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
        ctrl.hasSellerProductRequirements = function(sellerObj, locations, physicalSupplierId, product) {
            let req, locationProduct;
            let theLocation;
            if (typeof sellerId == 'undefined' && typeof locations == 'undefined' && typeof product == 'undefined') {
                return false;
            }
            // get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    theLocation = locations[i];
                    break;
                }
            }
            // if there is no matching location. product is not available
            if (!theLocation) {
                return false;
            }
            for (i = 0; i < ctrl.requirements.length; i++) {
                req = ctrl.requirements[i];
                if (req.randUniquePkg == sellerObj.randUniquePkg) {
                    if (theLocation.location.id == req.LocationId && theLocation.id == req.RequestLocationId) {
                        for (let j = 0; j < theLocation.products.length; j++) {
                            locationProduct = theLocation.products[j];
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
        ctrl.hasCounterpartyAllRowRequirements = function(sellerId, locations, sellerObj) {
            let req;
            var physicalSupplierId = null;

            /* rewrite*/
                var uniqueRowIdentifier = `${sellerObj.randUniquePkg }-${ locations[0].uniqueLocationIdentifier}`;
                var rowCheckboxes = $(`[unique-row-identifier='${uniqueRowIdentifier }']`);
                var rowCheckboxesLength = rowCheckboxes.length;
                var checkedRowCheckboxes = 0;
			    $.each(rowCheckboxes, function() {
			    	if (!$(this).is(':visible')) {
			    		rowCheckboxesLength--;
			    	}
			    	if ($(this).prop('checked') == true) {
			            checkedRowCheckboxes++;
			    	}
			    });
			    if (checkedRowCheckboxes >= rowCheckboxesLength) {
			    	return true;
			    }
			    return false;

            /* rewrite*/
        };
        ctrl.hasSellerRequirements = function(sellerId, locations, sellerObj) {
            let req;
            var physicalSupplierId = null;

            /* rewrite*/
            var uniqueRowIdentifier = `${sellerObj.randUniquePkg }-${ locations[0].uniqueLocationIdentifier}`;
            var rowCheckboxes = $(`[unique-row-identifier='${uniqueRowIdentifier }']`);
            var rowCheckboxesLength = rowCheckboxes.length;
            var checkedRowCheckboxes = 0;
			    $.each(rowCheckboxes, function() {
			    	if (!$(this).is(':visible')) {
			    		rowCheckboxesLength--;
			    	}
			    	if ($(this).prop('checked') == true) {
			            checkedRowCheckboxes++;
			    	}
			    });
			    if (checkedRowCheckboxes >= rowCheckboxesLength) {
			    	return true;
			    }
			    return false;

            /* rewrite*/
        };
        ctrl.hasSellerRequirements = function(sellerId, locations, sellerObj) {
            let req;
            let theLocation;
            var physicalSupplierId = null;

            /* rewrite*/
			    // uniqueRowIdentifier = sellerObj.randUniquePkg + "-" + locations[0].uniqueLocationIdentifier
			    // rowCheckboxes = $("[unique-row-identifier='"+uniqueRowIdentifier+"']");
			    // rowCheckboxesLength = rowCheckboxes.length;
			    // checkedRowCheckboxes = 0;
			    // $.each(rowCheckboxes, function(){
			    // 	if (!$(this).is(":visible")) {
			    // 		rowCheckboxesLength--;
			    // 	}
			    // 	if ($(this).prop("checked") == true) {
			    //         checkedRowCheckboxes++;
			    // 	}
			    // })
			    // if (checkedRowCheckboxes >= rowCheckboxesLength) {
			    // 	return true
			    // }
			    // return false
            /* rewrite*/


            checkAllCheckboxesDefault();
            if (sellerObj.offers.length > 0) {
                if (sellerObj.offers[0].physicalSupplierCounterparty) {
                    physicalSupplierId = sellerObj.offers[0].physicalSupplierCounterparty.id;
                }
            }
            if (typeof sellerId == 'undefined' && typeof locations == 'undefined' && typeof physicalSupplierId == 'undefined') {
                return false;
            }
            for (let i = 0; i < ctrl.requirements.length; i++) {
                for (let j = 0; j < locations.length; j++) {
                    var requirement = ctrl.requirements[i];
                    theLocation = locations[j];
                    // if (sellerId == requirement.SellerId && location.location.id == requirement.LocationId && location.id == requirement.RequestLocationId && physicalSupplierId == requirement.PhysicalSupplierCounterpartyId) {
                    //     return true;
                    // }
                    var composedUniqueLocationSellerPhysical = `${theLocation.uniqueLocationIdentifier }-${ sellerObj.randUnique}`;
                    if (requirement.UniqueLocationSellerPhysical == composedUniqueLocationSellerPhysical && requirement.randUniquePkg == sellerObj.randUniquePkg) {
                        /* update requirementData in case row was checked before making changes on the row */
                        requirement.PhysicalSupplierCounterpartyId = physicalSupplierId;
                        return true;
                    }
                }
            }
            return false;
        };
        ctrl.hasPackageRequirement = function(seller) {
            var hasRequirement = false;
            $.each(ctrl.requirements, function(rV, rK) {
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
            for (let i = 0; i < ctrl.requirements.length; i++) {
                if (productId == ctrl.requirements[i].RequestProductId) {
                    return true;
                }
            }
            return false;
        }
        ctrl.calcStackBarStyles = function(left, right) {
            left = parseFloat(left);
            right = parseFloat(right);
            let total = left + right,
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
                left: `${leftPerc }%`,
                right: `${rightPerc }%`
            };
        };

        /**
         * check if product is available on the location
         *
         * @param {object} product - product object
         * @param {array} locations - location group where seller is checked
         */
        ctrl.productAvailableOnLocation = function(product, locations) {
            var productAvailable = false;
            $.each(ctrl.requests, (reqK, reqV) => {
                if (reqV.id == product.requestId) {
                    $.each(reqV.locations, (locK, locV) => {
                        if (locV.uniqueLocationIdentifier == locations[0].uniqueLocationIdentifier) {
                            $.each(locV.products, (prodK, prodV) => {
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
        ctrl.hasAction = function(action) {
            return screenActionsModel.hasAction(action, uiApiModel.getScreenActions());
        };
        ctrl.setDelinkIds = function() {
            let selectedRequestIds = [];
            Object.keys(ctrl.requestCheckboxes).forEach((key) => {
                if (ctrl.requestCheckboxes[key]) {
                    selectedRequestIds.push(key);
                }
                return;
            });
            ctrl.delinkIds = {
                selectedRequestIds: selectedRequestIds,
                allRequests: ctrl.requests,
                groupId: groupId
            };
            // groupOfRequestsModel.delinkRequests(selectedRequestIds, ctrl.groupId).then(function() {
            //     // ctrl.onDelink({requestIds : ctrl.requestIds});
            //     ctrl.delinkRequests(selectedRequestIds);
            // });
        };
        ctrl.delinkRequests = function(requestIds) {
            for (let i = ctrl.requests.length - 1; i >= 0; i--) {
                if (requestIds.indexOf(`${ ctrl.requests[i].id}`) != -1) {
                    ctrl.requests.splice(i, 1);
                }
            }
            ctrl.requestTabs = createRequestTabs(ctrl.requests);
            initializeDataArrays(ctrl.requests);
        };
        ctrl.sortSellers = function() {
            initializeDataArrays(ctrl.requests);
        };
        ctrl.noRequestsSelected = function() {
            let selectedRequestIds = [];
            Object.keys(ctrl.requestCheckboxes).forEach((key) => {
                if (ctrl.requestCheckboxes[key]) {
                    selectedRequestIds.push(key);
                }
                return;
            });
            return selectedRequestIds.length <= 0;
        };
        ctrl.requirementsAreCorrect = function() {
            let requirement;
            let isCorrect = true;
            if (ctrl.requirements.length == 0 || !ctrl.requirements) {
                return false;
            }
            for (let i = 0; i < ctrl.requirements.length; i++) {
                requirement = ctrl.requirements[i];
                if (typeof requirement.PricingTypeId == 'undefined' || requirement.PricingTypeId === null) {
                    isCorrect = false;
                    break;
                }
                if (typeof requirement.SellerId == 'undefined' || requirement.SellerId === null) {
                    isCorrect = false;
                    break;
                }
                if (typeof requirement.ProductId == 'undefined' || requirement.ProductId === null) {
                    isCorrect = false;
                    break;
                }
                if (typeof requirement.RequestLocationId == 'undefined' || requirement.RequestLocationId === null) {
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

        ctrl.listOfNoQuote = function(seller, location, product, productOffer, noQuoteCheckboxes) {
            if (!ctrl.requirementRequestProductIdsNoQuote) {
                ctrl.requirementRequestProductIdsNoQuote = [];
            }
            let findElement = _.find(ctrl.requirementRequestProductIdsNoQuote, function(object) {
                return object.requestProductId == product.id && object.productSellerId == seller.sellerCounterparty.id && object.requestOffer == productOffer;
            });
            if (!findElement) {
                ctrl.requirementRequestProductIdsNoQuote.push({
                    requestProductId: product.id,
                    productStatus: product.productStatus,
                    requestOfferId: productOffer !== null ? productOffer.id : null,
                    productSellerId: seller.sellerCounterparty.id,
                    requestOffer: productOffer,
                    randUniquePkg: seller.randUniquePkg
                });
            } else if (findElement) {
                ctrl.requirementRequestProductIdsNoQuote = _.filter(ctrl.requirementRequestProductIdsNoQuote, function(object) {
                    return !(object.requestProductId == product.id && object.productSellerId == seller.sellerCounterparty.id && object.requestOffer == productOffer);
                });
            }
            if (noQuoteCheckboxes) {
                 ctrl.requirementRequestProductIdsNoQuote.push({
                    requestProductId: product.id,
                    productStatus: product.productStatus,
                    requestOfferId: productOffer !== null ? productOffer.id : null,
                    productSellerId: seller.sellerCounterparty.id,
                    requestOffer: productOffer,
                    randUniquePkg: seller.randUniquePkg
                });
            }
        }
        ctrl.requirementsAreCorrectForConfirm = function() {
            let requirement;
            let isCorrect = true;
            let existingRequestProductIds = [];
            if (ctrl.requirementRequestProductIds.length == 0) {
                return false;
            }
            ctrl.confirmButtonDisabled = false;
            for (let i = 0; i < ctrl.requirementRequestProductIds.length; i++) {
                let element = ctrl.requirementRequestProductIds[i];
                let findNumberOfProduct = _.filter(ctrl.requirementRequestProductIds, function(object) {
                    return object.requestProductId == element.requestProductId && object.productSellerId != element.productSellerId;
                });
                if (findNumberOfProduct.length) {
                   ctrl.confirmButtonDisabled = true;
                } 
                let findNumberOfProductNoQuote = _.filter(ctrl.requirementRequestProductIdsNoQuote, function(object) {
                    return object.requestProductId == element.requestProductId && object.productSellerId != element.productSellerId;
                });
                if (findNumberOfProductNoQuote.length) {
                   ctrl.confirmButtonDisabled = true;
                }
                requirement = ctrl.requirementRequestProductIds[i];
                if (typeof requirement.requestOfferId == 'undefined' || requirement.requestOfferId === null) {
                    isCorrect = false;
                    break;
                }
                // if (requirement.productStatus.name == 'Amended') {
                //     isCorrect = false;
                //     break;
                // }
                if (typeof requirement.requestOffer.price == 'undefined' || requirement.requestOffer.price === null) {
                    isCorrect = false;
                    break;
                }
                // if (existingRequestProductIds.indexOf(requirement.requestProductId) >= 0) {
                //     isCorrect = false;
                //     break;
                // }
                existingRequestProductIds.push(requirement.requestProductId);
            }
            return isCorrect;
        };
        ctrl.requirementsAreCorrectForRevokeAmend = function() {
            let requirement;
            let isCorrect = true;
            for (let i = 0; i < ctrl.requirementRequestProductIds.length; i++) {
                requirement = ctrl.requirementRequestProductIds[i];
                if (typeof requirement.requestOfferId == 'undefined' || requirement.requestOfferId === null) {
                    isCorrect = false;
                    break;
                }
            }
            return isCorrect;
        };
        // check all checkbox
        ctrl.checkAll = function(uniqueLocationIdentifier, event) {
            //          console.log(uniqueLocationIdentifier);
            var currentCheckBool = $(event.target).prop('checked');
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
            $('input[uniqueLocationIdentifier]').removeClass('locationRowToBeChecked');
            var myCheckInputs = $(`input[uniqueLocationIdentifier='${ uniqueLocationIdentifier }']`);
            $(myCheckInputs).each(function() {
                if ($(this).prop('checked') != currentCheckBool && !$(this).is(':disabled')) {
                    $(this)
                    // .prop("checked", currentCheckBool)
                        .addClass('locationRowToBeChecked');
                }
            });
            $timeout(() => {
                $('.locationRowToBeChecked').click();
            }, 1);
        };

        /** ***************************************************************************
         *   EVENT HANDLERS
         ******************************************************************************/
        ctrl.createSellerRequirements = function(seller, locations, $event, uniqueLocationIdentifier, randUniquePkg, event) {
            let req, product, locationSeller, productOffer, request, theLocation;
            let currentRowRequirements = [];

            if ($event && ctrl.selectedNoQuoteItems) {
                var noQuoteCheckboxes = $($event.target).parents('tr').find('[has-no-quote="true"]');

	            console.log(ctrl.selectedNoQuoteItems);
	            if ($($event.target).prop('checked') == false && ctrl.selectedNoQuoteItems) {
                    var newSelectedNoQuoteItems = angular.copy(ctrl.selectedNoQuoteItems);
		            Object.keys(newSelectedNoQuoteItems).forEach((key) => {
		                if (newSelectedNoQuoteItems[key]) {
	            	 		newSelectedNoQuoteItems[key] = false;
		                }
		                return;
		            });
		            setTimeout(() => {
			            console.log(ctrl.selectedNoQuoteItems);
			            console.log(newSelectedNoQuoteItems);
		            	ctrl.selectedNoQuoteItems = newSelectedNoQuoteItems;
                        $.each(ctrl.selectedNoQuoteItems, (k, v) => {
                            if (!v) {
                                let productOfferId = k.substring(2);
                                console.log(productOfferId);
                                ctrl.requirementRequestProductIdsNoQuote = _.filter(ctrl.requirementRequestProductIdsNoQuote, function(object) {
                                    return object.requestOffer.id != productOfferId;
                                });
                            }      
                        });
			            $scope.$apply();
			            console.log(ctrl.selectedNoQuoteItems);
		            });
	            }
	            $.each($(noQuoteCheckboxes), (k, v) => {
	            	if (!ctrl.selectedNoQuoteItems) {
	            		ctrl.selectedNoQuoteItems = [];
	            	}
	            	ctrl.selectedNoQuoteItems[`nq${ $(v).attr('product-offer-id')}`] = true;
	            });
            }

            var physicalSupplier = {};
            var contactCounterparty = {};
            var brokerCounterparty = {};
            physicalSupplier.id = null;
            physicalSupplier.name = null;
            var productHasSeller = false;
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
                for (let i = 0; i < locations.length; i++) {
                    theLocation = locations[i];
                    for (let j = 0; j < theLocation.products.length; j++) {
                        product = theLocation.products[j];
                        // create RFQ requirements
                        productOffer = ctrl.getSellerProductOfferOnLocationRewrite(product, locations, seller.sellerCounterparty.id, seller);
                        if (productOffer) {
                            if (productOffer.hasNoQuote) {
                                $.each(ctrl.selectedNoQuoteItems, (k, v) => {
                                    if (k == 'nq' + productOffer.id && v) {
                                        ctrl.listOfNoQuote(seller, theLocation, product, productOffer, true);
                                    }
                                   
                                });
                                continue;
                            }
                        }
                    }
                }
                if (seller.packageType != 'individual') {
                    ctrl.removePackageRequirements(seller, locations, productOffer.packageId);
                }
            } else {
                for (let i = 0; i < locations.length; i++) {
                    theLocation = locations[i];
                    for (let j = 0; j < theLocation.products.length; j++) {
                        product = theLocation.products[j];
                        // for(var j = 0; j < product.sellers.length; j++) {
                        // locationSeller = location.products[i].sellers[j];
                        // if (seller.sellerCounterparty.id == locationSeller.sellerCounterparty.id){
                        request = getRequestById(theLocation.requestId);
                        var prodSeller = null;
                        for (let k = 0; k < product.sellers.length; k++) {
                            if (product.sellers[k].randUniquePkg == seller.randUniquePkg) {
                                prodSeller = product.sellers[k];
                            }
                        }
                        $.each(ctrl.requests, (reqK, reqV) => {
                            $.each(reqV.locations, (locK, locV) => {
                                $.each(locV.products, (prodK, prodV) => {
                                    $.each(prodV.sellers, (sellerK, sellerV) => {
                                        // if (typeof(sellerV.uniqueLocationSellerPhysical) != 'undefined' && typeof(prodSeller.uniqueLocationSellerPhysical) != 'undefined') {
                                        //     if (sellerV.uniqueLocationSellerPhysical == prodSeller.uniqueLocationSellerPhysical) {
                                        //         //sellerV.selected = true;
                                        //     }
                                        // }
                                    });
                                });
                            });
                        });
                        ctrl.initialSelectedCheckboxesRequirements = true;
                        // create RFQ requirements
                        productOffer = ctrl.getSellerProductOfferOnLocationRewrite(product, locations, seller.sellerCounterparty.id, seller);
                        var productHasRFQ = false;
                        if (productOffer) {
                            if (productOffer.rfq) {
                                productHasRFQ = true;
                            }
                        }
                        if (productOffer) {
                            if (productOffer.hasNoQuote) {
                                $.each(ctrl.selectedNoQuoteItems, (k, v) => {
                                    if (k == 'nq' + productOffer.id && v) {
                                        ctrl.listOfNoQuote(seller, theLocation, product, productOffer, true);
                                    }
                                   
                                });
                                continue;
                            }
                        }
                        if (product.productStatus.name == 'Stemmed' && !seller.packageId) {
                            continue;
                        }
                        var productHasOffer = true;
                        if (product.sellers.length == 0) {
                            productHasOffer = false;
                        }
                        var sellerIsInProduct = false;
                        var requestSellerId = null;
                        $.each(product.sellers, (selK, selV) => {
                            if (selV.randUniquePkg == seller.randUniquePkg) {
                                requestSellerId = selV.id;
                                sellerIsInProduct = true;
                                if (typeof selV.offers == 'undefined' || selV.offers == null || selV.offers.length < 1 || !selV.offers[0].id) {
                                    productHasOffer = false;
                                }
                            }
                        });
                        if ((!sellerIsInProduct && productHasOffer) || seller.isCloned) {
                            productHasOffer = false;
                        }
                        req = {
                            RequestLocationId: theLocation.id,
                            RequestGroupId: ctrl.groupId,
                            RequestStatus: request.requestStatus.name,
                            SellerId: seller.sellerCounterparty.id,
                            RequestSellerId: requestSellerId,
                            RequestId: request.id,
                            VesselId: request.vesselId,
                            LocationId: theLocation.location.id,
                            VesselVoyageDetailId: theLocation.vesselVoyageDetailId,
                            ProductId: product.product.id,
                            RfqId: prodSeller != null && prodSeller.rfq !== null ? prodSeller.rfq.id : null,
                            WorkflowId: product.workflowId,
                            OrderFields: null,
                            RequestProductId: product.id,
                            ProductTypeId: product.productTypeId,
                            productStatus: product.productStatus,
                            ProductTypeGroupId: product.productTypeGroupId,
                            QuotedProductGroupId: productOffer !== null && typeof productOffer != 'undefined' ? productOffer.quotedProductGroupId : null,
                            PhysicalSupplierCounterpartyId: physicalSupplier.id,
                            ContactCounterpartyId: contactCounterparty.id ? contactCounterparty.id : null,
                            BrokerCounterpartyId: brokerCounterparty.id ? brokerCounterparty.id : null,
                            productHasOffer: productHasOffer,
                            productHasPrice: productOffer ? Boolean(productOffer.price) : false,
                            productHasRFQ: productHasRFQ,
                            requestOfferId: productOffer !== null && typeof productOffer != 'undefined' ? productOffer.id : null,
                            UniqueLocationSellerPhysical: `${theLocation.uniqueLocationIdentifier }-${ seller.randUnique}`,
                            rowLocationSellerPhysical: `${uniqueLocationIdentifier }-${ randUniquePkg}`,
                            randUniquePkg: seller.randUniquePkg,
                            isClonedSeller: seller.isCloned,
                            currencyId: productOffer ? productOffer.currency ? productOffer.currency.id : null : null,
                            vesselETA: theLocation.eta,
                            productAllowZeroPricing: product.allowZeroPricing
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
                        currentRowRequirements.push(req);
                        // create confirmation requirements
                        ctrl.requirementRequestProductIds.push({
                            requestProductId: product.id,
                            productStatus: product.productStatus,
                            requestOfferId: productOffer !== null && typeof productOffer != 'undefined' ? productOffer.id : null,
                            productSellerId: seller.sellerCounterparty.id,
                            requestOffer: productOffer,
                            randUniquePkg: seller.randUniquePkg
                        });
                        // }
                    }
                }
                // }
            }
            // calculates screen actions
            console.log(currentRowRequirements);
            // seller.selected = true;
            if (typeof event != 'undefined') {
	            checkUncheckSellerRowUpdate(seller, locations, currentRowRequirements, true);
            }
            ctrl.calculateScreenActions();
        };
        ctrl.createSellerRequirementsForProduct = function(seller, locations, productSample, uniqueLocationIdentifier, randUniquePkg, event) {
            let request;
            let theLocation, requestProductsInLocation;
            let currentuniqueLocationIdentifier = uniqueLocationIdentifier;
            let currentrandUniquePkg = randUniquePkg;
            // get correct location from group (the location matching the products request)
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].requestId === productSample.requestId) {
                    theLocation = locations[i];
                    break;
                }
            }
            // if there is no matching location. product is not available
            if (!theLocation) {
                return false;
            }
            var physicalSupplier = {};
            var contactCounterparty = {};
            var brokerCounterparty = {};
            physicalSupplier.id = null;
            physicalSupplier.name = null;
            if (typeof seller.offers != 'undefined') {
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
                for (i = 0; i < theLocation.products.length; i++) {
                    if (theLocation.products[i].id === productSample.id) {
                        var product = theLocation.products[i];
                        break;
                    }
                }
                removeSellerProductRequirementsOnLocation(seller, locations, product, event);
                // if (seller.packageType != 'individual') {
                //     ctrl.removeSellerProductRequirementsOnLocation(seller, locations, productSample)
                // }
            } else {
                // get actual product from location (identified by the productSample)
                ctrl.initialSelectedCheckboxesRequirements = true;
                for (i = 0; i < theLocation.products.length; i++) {
                    if (theLocation.products[i].id === productSample.id) {
                        product = theLocation.products[i];
                        break;
                    }
                }
                // if there is no matching product, it is not available
                if (!product) {
                    return false;
                }
                request = getRequestById(theLocation.requestId);
                var prodSeller = null;
                for (let k = 0; k < product.sellers.length; k++) {
                    if (product.sellers[k].randUniquePkg == seller.randUniquePkg) {
                        prodSeller = product.sellers[k];
                    }
                }
                var productOffer = ctrl.getSellerProductOfferOnLocationRewrite(product, locations, seller.sellerCounterparty.id, seller);
                var productHasRFQ = false;
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
                var currentProductStatus = ctrl.getSellerProductStatusOnLocation(productSample, locations, seller);
                if (currentProductStatus == 'Stemmed' && !seller.packageId) {
                    return false;
                }
                var productHasOffer = true;
                if (product.sellers.length == 0) {
                    productHasOffer = false;
                }
                var sellerIsInProduct = false;
                var requestSellerId = null;
                $.each(product.sellers, (selK, selV) => {
                    if (selV.randUniquePkg == seller.randUniquePkg) {
                        requestSellerId = selV.id;
                        sellerIsInProduct = true;
                        if (typeof selV.offers == 'undefined' || selV.offers == null || selV.offers.length < 1 || !selV.offers[0].id) {
                            productHasOffer = false;
                        }
                    }
                });
                if ((!sellerIsInProduct && productHasOffer) || seller.isCloned) {
                    productHasOffer = false;
                }
                var req = {
                    RequestLocationId: theLocation.id,
                    RequestGroupId: ctrl.groupId,
                    RequestStatus: request.requestStatus.name,
                    SellerId: seller.sellerCounterparty.id,
                    RequestSellerId: requestSellerId,
                    RequestId: request.id,
                    VesselId: request.vesselId,
                    LocationId: theLocation.location.id,
                    VesselVoyageDetailId: theLocation.vesselVoyageDetailId,
                    ProductId: product.product.id,
                    RfqId: prodSeller != null && prodSeller.rfq !== null ? prodSeller.rfq.id : null,
                    WorkflowId: product.workflowId,
                    OrderFields: null,
                    RequestProductId: product.id,
                    ProductTypeId: product.productTypeId,
                    productStatus: product.productStatus,
                    ProductTypeGroupId: product.productTypeGroupId,
                    QuotedProductGroupId: productOffer !== null && typeof productOffer != 'undefined' ? productOffer.quotedProductGroupId : null,
                    PhysicalSupplierCounterpartyId: physicalSupplier.id,
                    ContactCounterpartyId: contactCounterparty.id ? contactCounterparty.id : null,
                    BrokerCounterpartyId: brokerCounterparty.id ? brokerCounterparty.id : null,
                    productHasOffer: productHasOffer,
                    productHasPrice: productOffer ? Boolean(productOffer.price) : false,
                    productHasRFQ: productHasRFQ,
                    requestOfferId: productOffer !== null && typeof productOffer != 'undefined' ? productOffer.id : null,
                    UniqueLocationSellerPhysical: `${theLocation.uniqueLocationIdentifier }-${ seller.randUnique}`,
                    rowLocationSellerPhysical: `${currentuniqueLocationIdentifier }-${ currentrandUniquePkg}`,
                    randUniquePkg: seller.randUniquePkg,
                    isClonedSeller: seller.isCloned,
                    currencyId: productOffer ? productOffer.currency ? productOffer.currency.id : null : null,
                    vesselETA: theLocation.eta,
                    productAllowZeroPricing: product.allowZeroPricing
                };
                if (product.pricingType) {
                    req.PricingTypeId = product.pricingType.id;
                } else {
                    req.PricingTypeId = null;
                }
                ctrl.requirements.push(req);
                var currentRowRequirements = req;
                // create confirmation requirements
                ctrl.requirementRequestProductIds.push({
                    requestProductId: product.id,
                    productStatus: product.productStatus,
                    requestOfferId: productOffer !== null ? productOffer.id : null,
                    productSellerId: seller.sellerCounterparty.id,
                    requestOffer: productOffer,
                    randUniquePkg: seller.randUniquePkg
                });
                if (typeof event != 'undefined') {
		            checkUncheckSellerRowUpdate(seller, locations, [ currentRowRequirements ], true);
                }
            }
            // calculates screen actions
            ctrl.calculateScreenActions();
        };
        ctrl.createSellerRequirementsForProductPackage = function(seller, locations) {
            var matchingPackageIdProducts = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        if (prodV.sellers.length > 0) {
                            $.each(prodV.sellers, (selK, selV) => {
                                if (selV.randUniquePkg == seller.randUniquePkg) {
                                    prodV.seller = selV;
                                    matchingPackageIdProducts.push(prodV);
                                }
                            });
                        }
                    });
                });
            });
            $.each(matchingPackageIdProducts, (key, prodValue) => {
                ctrl.createSellerRequirementsForProduct(prodValue.seller, locations, prodValue);
            });
        };

        /**
         * check if we should show extra buttons
         */
        ctrl.extraButtons = function() {
            return $('.st-extra-buttons').find('li').length === 0;
        };
        ctrl.deleteRequest = function(request) {
            for (let i = ctrl.requests.length - 1; i >= 0; i--) {
                if (ctrl.requests[i].id == request.id) {
                    ctrl.requests.splice(i, 1);
                }
            }
            initializeDataArrays(ctrl.requests);
        };
        ctrl.setQuoteByCurrency = function(currencyId, currencyName) {
            ctrl.quoteByCurrency = {
                id: currencyId,
                name: currencyName
            };
        };
        ctrl.isCurrencyDisabled = function() {
            // if (ctrl.bestOfferData && ctrl.bestOfferData.length > 0) {
            //     return true;
            // }
            if (ctrl.rfqSent) {
                return true;
            }
            return false;
        };
        ctrl.setQuoteByTimezone = function(timeZoneId, timeZoneName) {
            ctrl.quoteByTimezone = {
                id: timeZoneId,
                name: timeZoneName
            };
        };

        ctrl.requirementsHasNoPrice = function() {
            var hasNoPrice = false;
        	if (ctrl.requirements.length == 0) {
	        	hasNoPrice = true;
	        	return hasNoPrice;
        	}
        	$.each(ctrl.requirements, (k, v) => {
        		if (!v.productHasPrice) {
		        	hasNoPrice = true;
        		}
        	});
        	return hasNoPrice;
        };
        ctrl.requirementsHasNoRfqId = function() {
            var hasNoRfqId = false;
        	if (ctrl.requirements.length == 0) {
	        	hasNoRfqId = true;
	        	return hasNoRfqId;
        	}
        	$.each(ctrl.requirements, (k, v) => {
        		if (!v.RfqId) {
		        	hasNoRfqId = true;
        		}
        	});
        	return hasNoRfqId;
        };
        ctrl.checkSludgeSeller = function() {
            let i = 0;
            var sludgeMatchSellerProductError = false;
            let msg = 'A Sludge Seller is required for Sludge Product Type';
            let isSludgeProduct = false;
            $.each(ctrl.requirements, (requirementK, requirementV) => {
                let product = _.find(ctrl.locations, { id: requirementV.RequestLocationId });
                if (!product || !product.products) {
                    return false;
                }
                product = _.find(product.products, { id: requirementV.RequestProductId });
                if (!product || !product.productTypeId) {
                    return false;
                }
                let productTypeId = product.productTypeId;
                isSludgeProduct = _.find(ctrl.listsCache.ProductTypeGroup, (obj) => {
                    return obj.name == 'Sludge';
                }, 'id').id == product.productTypeGroupId;


                let seller = _.find(product.sellers, { sellerCounterparty: { id: requirementV.SellerId } });
                var sellerTypeSludge = false;
                $.each(ctrl.locations, (lk, lv) => {
                    $.each(lv.products, (pk, pv) => {
                        $.each(pv.sellers, (sk, sv) => {
                            if (sv.randUniquePkg == requirementV.randUniquePkg) {
                                $.each(sv.counterpartyTypes, (ctk, ctv) => {
                                    if (ctv.name == 'Sludge') {
                                        sellerTypeSludge = true;
                                    }
                                });
                            }
                        });
                    });
                });

                if (isSludgeProduct && !sellerTypeSludge) {
                    toastr.error(msg);
                    return true;
                }
                return false;


                /*
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
                */
            });
            // if (i == 0) {
        };
        ctrl.sendRFQ = function(reload) {
            /* validate unicity for location-seller-physical-supplier*/
            // productTypeId
            var duplicatesArray = [];
            console.log(ctrl.requirements);

            if (ctrl.checkSludgeSeller()) {
                return false;
            }
            $.each(ctrl.requirements, (requirementK, requirementV) => {
                if (requirementV.isClonedSeller) {
                    var  reqRandUnique = `${requirementV.SellerId }-${ requirementV.PhysicalSupplierCounterpartyId}`;
                    $.each(ctrl.locations, (locK, locV) => {
                        var valuesSoFar = [];
                        var sellers = ctrl.getSortedLocationSellers([ locV ]);
                        $.each(sellers, (k, v) => {
                            var physicalSupplierId = null;
                            var physicalSupplierName = null;
                            if (typeof v.offers != 'undefined') {
                                if (v.offers.length > 0) {
                                    if (v.offers[0].physicalSupplierCounterparty) {
                                        physicalSupplierId = v.offers[0].physicalSupplierCounterparty.id;
                                        physicalSupplierName = v.offers[0].physicalSupplierCounterparty.name;
                                    }
                                }
                            }
                            var composedSellerIds = `${v.sellerCounterparty.id }-${ physicalSupplierId}`;
                            var uniqueStringIdentifier = `${locV.location.name }*${ v.sellerCounterparty.name }*${ physicalSupplierName}`;
                            if (reqRandUnique == composedSellerIds) {
                                if (valuesSoFar.indexOf(composedSellerIds) > -1 && v.packageType == 'individual') {
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
                $.each(duplicatesArray, (k, val) => {
                    var locationName = val.split('*')[0];
                    var sellerName = val.split('*')[1];
                    var physicalSupplierName = val.split('*')[2];
                    if (physicalSupplierName != 'null') {
                        toastr.error(`For the location ${ locationName } the seller ${ sellerName } with Physical Supplier ${ physicalSupplierName } already exists `);
                    } else {
                        toastr.error(`For the location ${ locationName } the seller ${ sellerName } with no Physical Supplier already exists `);
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
                            .add(30, 'minutes')
                            .toJSON();
                    }
                } else {
                    ctrl.quoteByDate = null;
                }
            }
            let rfq_data = {
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
                (response) => {
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
                        angular.element($('.bladeEntity .closeBlade')).scope().closeBlade();
                        $('body').css('overflow-y', 'auto');
                        setTimeout(() => {
                            $rootScope.bladeTemplateUrl = '';
                            if($rootScope.refreshPending) {
                                $state.reload();
                                // window.location.reload();
                            }
                            setTimeout(() => {
                                ctrl.initScreenAfterSendOrSkipRfq();
                            }, 10);
                        }, 10);
                        $state.reload();
                    }
                    return false;
                },
                () => {
                    ctrl.buttonsDisabled = false;
                }
            ).finally(() => {
            	ctrl.initScreenAfterSendOrSkipRfq();
            });
        };
        ctrl.skipRFQ = function() {
            /* validate unicity for location-seller-physical-supplier*/
            var duplicatesArray = [];
            console.log(ctrl.requirements);
            if (ctrl.checkSludgeSeller()) {
                return false;
            }
            $.each(ctrl.requirements, (requirementK, requirementV) => {
                if (requirementV.isClonedSeller) {
                    var reqRandUnique = `${requirementV.SellerId }-${ requirementV.PhysicalSupplierCounterpartyId}`;
                    $.each(ctrl.locations, (locK, locV) => {
                        var valuesSoFar = [];
                        var sellers = ctrl.getSortedLocationSellers([ locV ]);
                        $.each(sellers, (k, v) => {
                            var physicalSupplierId = null;
                            var physicalSupplierName = null;
                            if (typeof v.offers != 'undefined') {
                                if (v.offers.length > 0) {
                                    if (v.offers[0].physicalSupplierCounterparty) {
                                        physicalSupplierId = v.offers[0].physicalSupplierCounterparty.id;
                                        physicalSupplierName = v.offers[0].physicalSupplierCounterparty.name;
                                    }
                                }
                            }
                            var composedSellerIds = `${v.sellerCounterparty.id }-${ physicalSupplierId}`;
                            var uniqueStringIdentifier = `${locV.location.name }*${ v.sellerCounterparty.name }*${ physicalSupplierName}`;
                            if (reqRandUnique == composedSellerIds) {
                                if (valuesSoFar.indexOf(composedSellerIds) > -1 && v.packageType == 'individual') {
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
                $.each(duplicatesArray, (k, val) => {
                    var locationName = val.split('*')[0];
                    var sellerName = val.split('*')[1];
                    physicalSupplierName = val.split('*')[2];
                    if (physicalSupplierName != 'null') {
                        toastr.error(`For the location ${ locationName } the seller ${ sellerName } with Physical Supplier ${ physicalSupplierName } already exists `);
                    } else {
                        toastr.error(`For the location ${ locationName } the seller ${ sellerName } with no Physical Supplier already exists `);
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
            let rfq_data = {
                Requirements: ctrl.requirements,
                QuoteByDate: ctrl.quoteByDate,
                RequestGroupId: ctrl.groupId,
                QuoteByCurrencyId: ctrl.quoteByCurrency.id,
                QuoteByTimeZoneId: ctrl.quoteByTimezone.id,
                Comments: null
            };
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.skipRFQ(rfq_data).then(
                (response) => {
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
                    var newData = response.payload;
                    var allClonedFoundSellers = [];
                    $.each(newData, (newDataKey, newDataValue) => {
                        var newDataPhysicalSupplierId = 'null';
                        if (typeof newDataValue.offers != 'undefined') {
                            if (newDataValue.offers.length > 0) {
                                if (newDataValue.offers[0].physicalSupplierCounterparty) {
                                    newDataPhysicalSupplierId = newDataValue.offers[0].physicalSupplierCounterparty.id;
                                }
                            }
                        }
                        $.each(ctrl.requests, (reqK, reqV) => {
                            $.each(reqV.locations, (locK, locV) => {
                                if (locV.id == newDataValue.requestLocationId) {
                                    $.each(locV.products, (prodK, prodV) => {
                                        if (prodV.id == newDataValue.requestProductId) {
                                            var foundSellerKey = -1;
                                            $.each(prodV.sellers, (sellerK, sellerV) => {
                                                physicalSupplierId = 'null';
                                                if (typeof sellerV.offers != 'undefined') {
                                                    if (sellerV.offers.length > 0) {
                                                        if (sellerV.offers[0].physicalSupplierCounterparty) {
                                                            physicalSupplierId = sellerV.offers[0].physicalSupplierCounterparty.id;
                                                        }
                                                    }
                                                }
                                                if (newDataValue.sellerCounterparty.id == sellerV.sellerCounterparty.id && newDataPhysicalSupplierId == physicalSupplierId) {
                                                    foundSellerKey = sellerK;
                                                    var foundSellerId = sellerV.sellerCounterparty.id;
                                                    var foundPhysicalSupplierId = physicalSupplierId;
                                                    if (sellerV.isCloned) {
                                                        allClonedFoundSellers.push(sellerV.randUnique);
                                                    }
                                                }
                                            });
                                            if (foundSellerKey == -1) {
                                                newDataValue.randUnique = `${newDataValue.sellerCounterparty.id }-${ newDataPhysicalSupplierId}`;
                                                newDataValue.randUniquePkg = `${newDataValue.sellerCounterparty.id }-${ newDataPhysicalSupplierId }-individual-null`;
                                                newDataValue.packageType = 'individual';
                                                newDataValue.isCloned = false;
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers.push(newDataValue);
                                            } else {
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey] = newDataValue;
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey].randUnique = `${foundSellerId }-${ foundPhysicalSupplierId}`;
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey].randUniquePkg = `${foundSellerId }-${ foundPhysicalSupplierId }-individual-null`;
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey].packageType = 'individual';
                                                ctrl.requests[reqK].locations[locK].products[prodK].sellers[foundSellerKey].isCloned = false;
                                            }
                                        }
                                    });
                                }
                            });
                        });
                    });
                    $.each(ctrl.requests, (reqK, reqV) => {
                        $.each(reqV.locations, (locK, locV) => {
                            $.each(locV.products, (prodK, prodV) => {
                                $.each(prodV.sellers, (sellerK, sellerV) => {
                                    if (typeof sellerV != 'undefined') {
                                        var physicalSupplierId = null;
                                        if (typeof sellerV.offers != 'undefined') {
                                            if (sellerV.offers.length > 0) {
                                                if (sellerV.offers[0].physicalSupplierCounterparty) {
                                                    physicalSupplierId = sellerV.offers[0].physicalSupplierCounterparty.id;
                                                }
                                            }
                                        }
                                        if (allClonedFoundSellers.indexOf(sellerV.randUnique) != -1) {
                                            ctrl.requests[reqK].locations[locK].products[prodK].sellers[sellerK].randUnique = `${sellerV.sellerCounterparty.id }-${ physicalSupplierId}`;
                                            ctrl.requests[reqK].locations[locK].products[prodK].sellers[sellerK].randUniquePkg = `${sellerV.sellerCounterparty.id }-${ physicalSupplierId }-individual-null`;
                                            ctrl.requests[reqK].locations[locK].products[prodK].sellers[sellerK].packageType = 'individual';
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
                () => {
                    ctrl.buttonsDisabled = false;
                }
            ).finally(() => {
            	ctrl.initScreenAfterSendOrSkipRfq();
            });
        };
        ctrl.countUniqueVessels = function(sellerRandUniquePkg) {
            var vesselIds = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
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
        ctrl.setConfirmationOffers = function() {
            let productErrors = [];
            _.each(ctrl.requirements, (value, key) => {
                if(!value.productHasPrice && !value.productAllowZeroPricing) {
                    productErrors.push('Please enter a price greater than 0 for the selected products');
                }
                return;
            });

            if (_.uniqBy(ctrl.requirements, 'QuotedProductGroupId').length != 1) {
	        	productErrors.push('Product types from different groups cannot be stemmed in one order. Please select the products with same group to proceed');
            }


            if (ctrl.isOfferReviewMandatory && !ctrl.isReviewed) {
                productErrors.push('Your tenant configuration require that Group should be Reviewed before confirming an Offer');
            }

            if (productErrors.length > 0) {
                _.each(productErrors, (value, key) => {
                    toastr.error(value);
                });
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

            $bladeEntity.open('confirmOffer');
        };
        ctrl.canSendRFQ = function() {
            ctrl.calculateScreenActions();
            return ctrl.hasAction(ctrl.SCREEN_ACTIONS.SENDRFQ) && ctrl.requirementsAreCorrect();
        };
        ctrl.canConfirm = function() {
            return ctrl.requirementsAreCorrectForConfirm();
        };
        ctrl.canRevokeAmend = function() {
            return ctrl.requirementsAreCorrectForRevokeAmend();
        };
        ctrl.viewRFQ = function(id) {
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
        ctrl.viewBladeRFQ = function(id) {
            $rootScope.bladeRfqGroupId = $stateParams.groupId;
        };
        ctrl.goSpot = function() {
            $state.go(STATE.GROUP_OF_REQUESTS, {
                groupId: groupId
            });
        };
        ctrl.changeRequirementsPricingType = function(product) {
            let requirement;
            for (let i = 0; i < ctrl.requirements.length; i++) {
                requirement = ctrl.requirements[i];
                if (requirement.RequestId === product.requestId && requirement.ProductId === product.product.id) {
                    requirement.PricingTypeId = product.pricingType.id;
                }
            }
        };
        ctrl.setLatestOfferProduct = function(product, locations, seller) {
            seller = $filter('filter')(product.sellers, {
                sellerCounterparty : {
                    id: seller.sellerCounterparty.id
                }
            })[0];
            ctrl.latestOfferProduct = product;
            ctrl.latestOfferSeller = seller;
        };
        ctrl.setOfferDetailsParams = function(product, seller, theLocation) {
            ctrl.offerDetailsLocation = theLocation;
            ctrl.offerDetailsProduct = product;
            ctrl.offerDetails = 0;
            ctrl.offerDetails = ctrl.getSellerProductOfferOnLocation(product, theLocation, seller.sellerCounterparty.id, seller);
            setTimeout(() => {
                if (ctrl.offerDetails != 0) {
                    $bladeEntity.open('offerDetails');
                }
            }, 500);
        };
        ctrl.updateOffer = function(offer, product) {
            let seller, currentSeller;
            for (let m = 0; m < product.sellers.length; m++) {
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
        ctrl.updateSpecParemeters = function(params) {
            $rootScope.shouldRefreshGroup = true;
            groupOfRequestsModel.updateEnergySpecValues(params).then((data) => {
            	ctrl.initScreenAfterSendOrSkipRfq();
            	$rootScope.$broadcast('energySpecParametersUpdated', true);
            	$('.blade-column.main-content-column .ng-dirty').removeClass('ng-dirty');
            	ctrl.viewEnergyContentBlade(ctrl.blade.counterpartyActiveSeller, ctrl.blade.counterpartyActiveLocation);
            	ctrl.confirmedBladeNavigation = true;
                // $("body").css("overflow-y", "visible");
                // $rootScope.$broadcast("bladeDataChanged", true);
                // $state.reload();
                // update CCAI & net specific energy
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
        ctrl.revokeRFQ = function() {
            if (ctrl.requirements.length === 0) {
                toastr.error('Please select the Products to Revoke RFQ');
                return false;
            }
            let rfq_data = {
                Requirements: ctrl.requirements,
                QuoteByTimeZoneId: ctrl.quoteByTimezone.id,
                QuoteByCurrencyId: ctrl.quoteByCurrency.id,
                Comments: null,
                RequestGroupId: ctrl.groupId
            };
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.revokeRFQ(rfq_data).then(
                (data) => {
                	if (data.payload) {
	                	if (data.payload.redirectToRequest) {
                            var lastRequestId = rfq_data.Requirements[0].RequestId;
	                		location.href = `/#/edit-request/${lastRequestId}`;
	                		return;
	                	}
                	}
                    ctrl.buttonsDisabled = false;
                    ctrl.initScreenAfterSendOrSkipRfq();
                    return false;
                },
                () => {
                    ctrl.buttonsDisabled = false;
                    ctrl.initScreenAfterSendOrSkipRfq();
                    return false;
                }
            ).finally(
                () => {
                }
            );
        };
        ctrl.amendRFQ = function() {
            if (ctrl.requirements.length === 0) {
                toastr.error('Please select the Products to Amend RFQ');
                return false;
            }
            let rfq_data = ctrl.requirements;
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.amendRFQ(rfq_data).then(
                (data) => {
                    ctrl.initScreenAfterSendOrSkipRfq();
                }
            ).finally(
                () => {
                	ctrl.initScreenAfterSendOrSkipRfq();
                }
            );
        };

        ctrl.triggerCommentsChange = function() {
            $rootScope.overrideCloseNavigation = false;
        };

        ctrl.removeClientSideCodeInjection = function(comments) {
            let value = comments, newValue, finalValue = '', removeValue, nr = 0;
            let hasClientSideCodeInjection = true;
            if (!comments) {
                return comments;
            }
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

        ctrl.saveComments = function(internalComments, externalComments, fromDate, event) {
            if (ctrl.quoteByDateFrom == '0000-00-00T00:00+00:00' || !$('#quoteByDateFrom_dateinput').hasClass('focusedOut') && !ctrl.quoteByDateFrom) {
                if (!event) {
	                return;
                }
            }
            if (fromDate && ctrl.lastSavedQuoteByDateFrom == ctrl.quoteByDateFrom) {
                return;
            }
            ctrl.lastSavedQuoteByDateFrom = ctrl.quoteByDateFrom;
        	if (internalComments) {
	        	internalComments = internalComments.replace(/(\r\n|\n)/g, '<br/>');
        	}
        	if (externalComments) {
	        	externalComments = externalComments.replace(/(\r\n|\n)/g, '<br/>');
        	}
            initialValueInternalComments = internalComments;
            initialValueExternalComments = externalComments;
            groupOfRequestsModel.updateGroup(groupId, internalComments, externalComments, ctrl.quoteByDate, ctrl.quoteByTimezone, ctrl.quoteByCurrency, ctrl.quoteByDateFrom);
            $rootScope.overrideCloseNavigation = true;
        };

        // set requote requirements needed by requote dialog
        ctrl.setRequoteRequirements = function(seller, theLocation) {
            ctrl.requirementsToRequote = ctrl.getRequoteRequirements(seller, theLocation);
        };
        // get requote requirements matching location/seller pair
        ctrl.getRequoteRequirements = function(seller, locations) {
            let requoteRequirements = [];
            let product, req, theLocation;
            for (let i = 0; i < ctrl.requirements.length; i++) {
                req = ctrl.requirements[i];
            	if (req.randUniquePkg == seller.randUniquePkg && locations[0].uniqueLocationIdentifier == req.rowLocationSellerPhysical.split('-')[0]) {
                    requoteRequirements.push(req);
            	}
                // $.each(ctrl.requests, function (reqK, reqV) {
                //     $.each(reqV.locations, function (locK, locV) {
                //         $.each(locV.products, function (prodK, prodV) {
                //             $.each(prodV.sellers, function (sellerK, sellerV) {
                //                 if (sellerV.randUniquePkg == req.randUniquePkg && locV.location.id == req.LocationId && locV.id == req.RequestLocationId && req.RfqId != null && seller.sellerCounterparty.id == sellerV.sellerCounterparty.id) {
                //                     requoteRequirements.push(req);
                //                 }
                //             });
                //         });
                //     });
                // });

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
            return angular.copy(requoteRequirements);
        };
        ctrl.previewEmail = function(seller, locations) {
        	ctrl.changeBladeWidgetFunction = null;
        	if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.previewEmail',
	        		params : [ seller, locations ]
	        	};
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;


        	// removeSellerRequirementsOnLocation(seller, locations, true);
            let rowRequirements = [];

            // ctrl.requirements = [];

            ctrl.refreshedRFQEmailBlade = false;
            if (locations.location || locations.length > 0) {
                var uniqueLocationIdentifier;
                if (locations.length > 0) {
                    uniqueLocationIdentifier = locations[0].uniqueLocationIdentifier;
                } else {
                    uniqueLocationIdentifier = locations.uniqueLocationIdentifier;
                }
                ctrl.blade.activeWidget = null;
                $.each(ctrl.requirements, (reqK, reqV) => {
                	if (reqV.randUniquePkg != seller.randUniquePkg) {
		                // ctrl.requirements = [];
                	}
                });
                var locationsList = [];
                $.each(ctrl.requests, (reqK, reqV) => {
                    $.each(reqV.locations, (locK, locV) => {
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

            for (let i = 0; i < ctrl.requirements.length; i++) {
                let req = ctrl.requirements[i];
                if (req.randUniquePkg.indexOf(seller.randUniquePkg) != -1) {
                    rowRequirements.push(req);
                    if (!req.productHasRFQ) {
                        ctrl.rfqScreenToDisplayIsMail = true;
                    }
                }
            }

            // Remove SludgeProducts From emailPreview payload
            var requirementsFilteredWithoutSludgeProduct = [];
            var hasSimpleProduct = false;
            var hasSludgeProduct = false;
            let sludgeProductTypeGroup = _.find(ctrl.listsCache.ProductTypeGroup, { name : 'Sludge' });
            $.each(rowRequirements, (k, v) => {
                if (v.ProductTypeGroupId != sludgeProductTypeGroup.id) {
                    requirementsFilteredWithoutSludgeProduct.push(v);
                    hasSimpleProduct = true;
                } else {
                    hasSludgeProduct = true;
                }
            });

            if (hasSimpleProduct && hasSludgeProduct) {
	            rowRequirements = requirementsFilteredWithoutSludgeProduct;
            }
            if (rowRequirements.length > 0) {
                let rfq_data = {
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
                ctrl.bladeTemplateUrl = 'components/blade/templates/gor-blade-content.html';
                ctrl.blade.counterpartyData = {
                    id: seller.sellerCounterparty.id
                };
                ctrl.blade.activeSeller = `${seller.requestLocationId }-${ seller.randUnique}`;
                ctrl.blade.counterpartyActiveSeller = seller;
                var theLocation = locations[0];
                ctrl.blade.counterpartyActiveLocation = theLocation;
	            $rootScope.bladeFilteredRfq = ctrl.blade.counterpartyActiveSeller;
	            $rootScope.bladeFilteredRfq.locationData = ctrl.blade.counterpartyActiveLocation;
                ctrl.blade.colLayout = 'double';
                setTimeout(() => { });
                ctrl.blade.activeWidget = 'email';
                ctrl.blade.widgetType = 'counterparty';
                // if (!ctrl.rfqScreenToDisplayIsMail) {
                // ctrl.setBladeCounterpartyActiveSeller();
                // }
                $bladeEntity.open('groupOfRequestBlade');
                ctrl.bladeOpened = true;
                ctrl.dataLoaded = true;
                setTimeout(() => { }, 1500);
            } else {
                ctrl.bladeTemplateUrl = 'components/blade/templates/gor-blade-content.html';
                ctrl.blade.counterpartyData = {
                    id: seller.sellerCounterparty.id
                };
                ctrl.blade.activeSeller = `${seller.requestLocationId }-${ seller.randUnique}`;
                ctrl.blade.counterpartyActiveSeller = seller;
            	theLocation = locations[0];
                ctrl.blade.counterpartyActiveLocation = theLocation;
	            $rootScope.bladeFilteredRfq = ctrl.blade.counterpartyActiveSeller;
	            $rootScope.bladeFilteredRfq.locationData = ctrl.blade.counterpartyActiveLocation;
                ctrl.blade.colLayout = 'double';
                ctrl.blade.activeWidget = 'email';
                ctrl.blade.widgetType = 'counterparty';
                if (!ctrl.rfqScreenToDisplayIsMail) {
                    ctrl.setBladeCounterpartyActiveSeller();
                }
                $bladeEntity.open('groupOfRequestBlade');
                ctrl.bladeOpened = true;
                ctrl.dataLoaded = true;
            }
            setTimeout(() => {
	            ctrl.refreshedRFQEmailBlade = true;
	            $scope.$apply();
            }, 10);
        };
        ctrl.getSellerOffers = function(seller, loc) {
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
        ctrl.canDelinkRequests = function() {
            let selectedRequestIds = [];
            let requestProductActions, products;
            let canDelink = false;
            Object.keys(ctrl.requestCheckboxes).forEach((key) => {
                if (ctrl.requestCheckboxes[key]) {
                    selectedRequestIds.push(key);
                }
                return;
            });
            if (ctrl.requests && selectedRequestIds.length == ctrl.requests.length) {
	        	let delinkableRequests = 0;
	        	$.each(ctrl.requests, (rk, rv) => {
	        		if ([ 'Validated', 'Reopened', 'ReOpen' ].indexOf(rv.requestStatus.name) != -1) {
		            	delinkableRequests++;
	        		}
	        	});
	        	if (delinkableRequests != selectedRequestIds.length) {
	            	return false;
	        	}
            }
            for (let i = 0; i < selectedRequestIds.length; i++) {
                if (ctrl.requestCheckboxes[selectedRequestIds[i]]) {
                    for (let j = 0; j < ctrl.requests.length; j++) {
                        if (ctrl.requests[j].id == selectedRequestIds[i]) {
                            products = getAllRequestProductList([ ctrl.requests[j] ])[0];
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
        // remove seller from location group
        ctrl.removeSellerFromLocation = function(seller, locations) {
            var physicalSupplierId = null;
            if (typeof seller.offers != 'undefined') {
                if (seller.offers.length > 0) {
                    if (seller.offers[0].physicalSupplierCounterparty) {
                        physicalSupplierId = seller.offers[0].physicalSupplierCounterparty.id;
                    }
                }
            }
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            if (sellerV) {
                                if (seller.randUnique == sellerV.randUnique) {
                                    ctrl.requests[reqK].locations[locK].products[prodK].sellers.splice(sellerK, 1);
                                }
                            }
                        });
                    });
                });
            });
            $.each(ctrl.locations, (locK, locV) => {
                $.each(locV.location.sellers, (selK, selV) => {
                    if (selV) {
                        if (seller.randUnique == selV.randUnique) {
                            locV.location.sellers.splice(selK, 1);
                        }
                    }
                });
            });
            for (let i = ctrl.requirements.length - 1; i >= 0; i--) {
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
        ctrl.canDeleteSeller = function(seller, locations) {
            let canDeleteSeller = true;
            locationLoop: for (let locationIndex = 0; locationIndex < locations.length; locationIndex++) {
                let theLocation = locations[locationIndex];
                for (let i = 0; i < theLocation.products.length; i++) {
                    let product = theLocation.products[i];
                    for (let j = product.sellers.length - 1; j >= 0; j--) {
                        if (product.sellers[j].randUniquePkg === seller.randUniquePkg) {
                            if (product.sellers[j].offers) {
                                for (let k = product.sellers[j].offers.length - 1; k >= 0; k--) {
                                    let offer = product.sellers[j].offers[k];
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
        ctrl.gotoContractPlanning = function() {
            let groupId = getGroupId();
            if (groupId < 0) {
                return false;
            }
            $state.go(STATE.CONTRACT_PLANNING, {
                groupId: groupId
            });
        };
        ctrl.reloadGroup = function() {
            $state.reload();
        };
        ctrl.viewEditCounterpartyBlade = function(counterpartyId, theLocation, seller) {
        	ctrl.changeBladeWidgetFunction = null;
            ctrl.blade.widgetType = 'none';
        	if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewEditCounterpartyBlade',
	        		params : [ counterpartyId, theLocation, seller ]
	        	};
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

            ctrl.bladeTemplateUrl = 'components/blade/templates/gor-blade-content.html';
            if (typeof ctrl.blade == 'undefined') {
                ctrl.blade = {};
            }
            ctrl.blade.counterpartyActiveSeller = seller;
            ctrl.blade.counterpartyActiveLocation = theLocation;
            Factory_Master.get_master_entity(counterpartyId, 'counterparty', 'masters', (callback) => {
                if (callback) {
                    console.log(callback);
                    ctrl.blade.counterpartyData = callback;
                    // ctrl.blade.widgetType = 'general';
                    ctrl.blade.widgetType = 'counterparty';
                    // ctrl.blade.colLayout = 'single';
                    // ctrl.blade.colLayout = 'none';
                    ctrl.blade.colLayout = 'double';
                    ctrl.blade.activeWidget = 'contact';
                    ctrl.blade.counterpartyActiveLocation = theLocation;
                    ctrl.blade.counterpartyActiveProducts = theLocation[0].products;
                    ctrl.blade.activeSeller = `${seller.requestLocationId }-${ seller.randUnique}`;
                    // $rootScope.counterpartyData = callback;
                    $bladeEntity.open('groupOfRequestBlade');
                    ctrl.bladeOpened = true;
                }
            });
            ctrl.dataLoaded = true;
        };
        ctrl.viewSupplierCardBlade = function(seller, loc, products, request) {
        	ctrl.changeBladeWidgetFunction = null;
        	if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewSupplierCardBlade',
	        		params : [ seller, loc, products, request ]
	        	};
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

            ctrl.bladeTemplateUrl = 'components/blade/templates/gor-blade-content.html';
            if (typeof ctrl.blade == 'undefined') {
                ctrl.blade = {};
            }
            // ctrl.dataLoaded = false;
            ctrl.blade.requestId = null;
            ctrl.blade.counterpartyActiveLocation = loc;
            ctrl.blade.counterpartyData = seller.sellerCounterparty;
            ctrl.blade.counterpartyActiveSeller = seller;
            ctrl.blade.widgetType = 'counterparty';
            ctrl.blade.colLayout = 'double';
            ctrl.blade.activeWidget = 'card';
            ctrl.blade.activeSeller = `${seller.requestLocationId }-${ seller.randUnique}`;
            if (loc) {
                if (loc.length > 0) {
                    loc = loc[0];
                }
            }
            var activeSellerCardTab = {
                requestId: products ? products[0].requestId : null,
                rfqId: seller.packageType == 'seller' ? seller.offers['0'].rfq.id : null,
                packageType: seller.packageType
            };
            ctrl.initSupplierCardData(loc, seller, activeSellerCardTab);
            uiApiModel.get(MOCKUP_MAP['unrouted.seller-card']).then((data) => {
                ctrl.blade_ui = data;
                ctrl.requestDetailsFields = normalizeArrayToHash(ctrl.blade_ui.requestDetails.fields, 'name');
                ctrl.bunkerablePortsFields = normalizeArrayToHash(ctrl.blade_ui.bunkerablePorts.fields, 'name');
                ctrl.commentsFields = normalizeArrayToHash(ctrl.blade_ui.comments.fields, 'name');
                ctrl.productFormFields = normalizeArrayToHash(ctrl.blade_ui.product.fields, 'name');
                ctrl.productColumns = normalizeArrayToHash(ctrl.blade_ui.product.columns, 'name');
                ctrl.additionalCostColumns = normalizeArrayToHash(ctrl.blade_ui.additionalCost.columns, 'name');
                $bladeEntity.open('groupOfRequestBlade');
                ctrl.bladeOpened = true;
            });
        };
        ctrl.viewEnergyContentBlade = function(seller, loc, products, productOffer) {
        	ctrl.changeBladeWidgetFunction = null;
        	if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewEnergyContentBlade',
	        		params : [ seller, loc, products, productOffer ]
	        	};
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

            ctrl.bladeTemplateUrl = 'components/blade/templates/gor-blade-content.html';
            if (loc[0]) {
                loc = loc[0];
            }
            if (typeof ctrl.blade == 'undefined') {
                ctrl.blade = {};
            }
            ctrl.blade.requestId = null;
            if (products) {
                if (products.length > 1) {
                    ctrl.blade.requestId = products[0].requestId;
                }
            }
            console.log('!@#');


            ctrl.dataLoaded = false;
            ctrl.blade.counterpartyActiveLocation = loc;
            ctrl.blade.counterpartyActiveSeller = seller;
            // ctrl.blade.counterpartyData = seller.sellerCounterparty;
            // ctrl.blade.counterpartyActiveSeller = seller;
            // ctrl.blade.widgetType = 'general';
            // ctrl.blade.colLayout = 'single';
            // ctrl.blade.colLayout = 'none';
            ctrl.blade.widgetType = 'counterparty';
            ctrl.blade.colLayout = 'double';
            ctrl.blade.activeWidget = 'energyContent';
            ctrl.blade.activeSeller = `${seller.requestLocationId }-${ seller.randUnique}`;
            ctrl.initEnergyBlade(loc, seller, productOffer);
            // $rootScope.counterpartyData = callback;
            $bladeEntity.open('groupOfRequestBlade');
            ctrl.bladeOpened = true;
        };
        ctrl.viewRequote = function(seller, theLocation) {
        	ctrl.changeBladeWidgetFunction = null;
        	if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.viewRequote',
	        		params : [ seller, theLocation ]
	        	};
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;

            // ctrl.requirements = [];
            if (theLocation.location) {
                ctrl.blade.activeWidget = null;
                var uniqueLocationIdentifier = theLocation.uniqueLocationIdentifier;
                var locationsList = [];
                $.each(ctrl.requests, (reqK, reqV) => {
                    $.each(reqV.locations, (locK, locV) => {
                        if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
                            locationsList.push(locV);
                        }
                    });
                });
                theLocation = locationsList;
            }
            // ctrl.createSellerRequirements(seller, theLocation);

            /*
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
            */

            ctrl.bladeTemplateUrl = 'components/blade/templates/gor-blade-content.html';
            if (typeof ctrl.blade == 'undefined') {
                ctrl.blade = {};
            }
            ctrl.blade.counterpartyActiveLocation = theLocation;
            ctrl.blade.counterpartyData = seller.sellerCounterparty;
            ctrl.blade.counterpartyActiveSeller = seller;
            // ctrl.blade.widgetType = 'general';
            ctrl.blade.widgetType = 'counterparty';
            // ctrl.blade.colLayout = 'single';
            // ctrl.blade.colLayout = 'none';
            ctrl.blade.colLayout = 'double';
            ctrl.blade.activeWidget = 'requote';
            ctrl.blade.activeSeller = `${seller.requestLocationId }-${ seller.randUnique}`;
            // $rootScope.counterpartyData = callback;
            ctrl.requirementsToRequote = ctrl.getRequoteRequirements(seller, theLocation);


            $bladeEntity.open('groupOfRequestBlade');
            ctrl.bladeOpened = true;
            ctrl.dataLoaded = true;
        };
        ctrl.viewBladeSellerRating = function(counterpartyId, theLocation, seller) {
            ctrl.changeBladeWidgetFunction = null;
            if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !ctrl.confirmedBladeNavigation) {
                $('.confirmNavigateBlade').removeClass('hide');
                $('.confirmNavigateBlade').modal();
                ctrl.changeBladeWidgetFunction = {
                    function: 'ctrl.viewBladeSellerRating',
                    params : [ counterpartyId, theLocation, seller ]

                };
                return;
            }
            ctrl.confirmedBladeNavigation = false;
            ctrl.blade.colLayout = 'double';
            ctrl.blade.activeWidget = 'rating';
            ctrl.bladeTemplateUrl = 'components/blade/templates/gor-blade-content.html';
              if (typeof ctrl.blade == 'undefined') {
                ctrl.blade = {};
            }
            ctrl.blade.counterpartyActiveSeller = seller;
            ctrl.blade.counterpartyActiveLocation = theLocation;
            payload = { 
                'locationId': theLocation[0] ? theLocation[0].location.id : theLocation.location.id,
                'counterpartyId': counterpartyId
            };
            Factory_Master.getSellerRatingForNegociation(payload, (callback) => {
                if (callback) {
                    ctrl.blade.sellerRatingBladeData = callback;
                    let findSpecificLocation = _.find(ctrl.blade.sellerRatingBladeData, function(obj) {
                        return obj.location;
                    });
                    let findAllLocations = _.find(ctrl.blade.sellerRatingBladeData, function(obj) {
                        return !obj.location;
                    });
                    ctrl.blade.noSpecificLocation = !findSpecificLocation ? true : false;
                    ctrl.blade.noAllLocations = !findAllLocations ? true : false;
                    ctrl.blade.widgetType = 'counterparty';
                    ctrl.blade.colLayout = 'double';
                    ctrl.blade.activeWidget = 'rating';
                    ctrl.blade.counterpartyActiveLocation = theLocation;
                    ctrl.blade.counterpartyActiveProducts = theLocation[0].products;
                    ctrl.blade.activeSeller = `${seller.requestLocationId }-${ seller.randUnique}`;
                    $bladeEntity.open('groupOfRequestBlade');
                    ctrl.bladeOpened = true;
                }
            });
            ctrl.dataLoaded = true;
        };

        ctrl.formatDateTime = function(elem) {
            if (elem) {
                var dateFormat = ctrl.tenantSetting.tenantFormats.dateFormat.name;
                let hasDayOfWeek = false;
                if (dateFormat.startsWith('DDD ')) {
                    hasDayOfWeek = true;
                    dateFormat = dateFormat.split('DDD ')[1];
                }
                dateFormat = dateFormat.replace(/D/g, 'd').replace(/Y/g, 'y');
                formattedDate = $filter('date')(elem, dateFormat);
                if (hasDayOfWeek) {
                    formattedDate = `${moment.utc(elem).format('ddd') } ${ formattedDate}`;
                }
                if (formattedDate.endsWith('00:00')) {
                    formattedDate = formattedDate.split('00:00')[0];
                }
                return formattedDate;
            }
        };


        ctrl.formatNumber = function(value) {
            if (value) {
                if (value != Math.floor(value)) {
                    return value.toString().split('.')[1].length == 1 ? value.toFixed(1) : value.toFixed(2);
                } 
            }
            return !value ? 0 : value;
        }

        ctrl.changeBladeCounterparty = function(seller, theLocation) {
            // ctrl.dataLoaded = true;

        	ctrl.changeBladeWidgetFunction = null;
        	if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !ctrl.confirmedBladeNavigation) {
	        	$('.confirmNavigateBlade').removeClass('hide');
	        	$('.confirmNavigateBlade').modal();
	        	ctrl.changeBladeWidgetFunction = {
	        		function: 'ctrl.changeBladeCounterparty',
	        		params : [ seller, theLocation ]
	        	};
	        	return;
        	}
        	ctrl.confirmedBladeNavigation = false;


            ctrl.blade.productLocation = theLocation;
            ctrl.blade.productSellerId = seller.sellerCounterparty.id;
            ctrl.blade.counterpartyActiveSeller = seller;
            ctrl.blade.counterpartyActiveLocation = theLocation;
            if (ctrl.blade.activeWidget == 'email') {
	            setTimeout(() => {
		            ctrl.refreshedRFQEmailBlade = false;
		            $scope.$apply();
		            $scope.$apply();
	            }, 50);
	            setTimeout(() => {
	                ctrl.previewEmail(seller, theLocation);
	            }, 100);
            }
            if (ctrl.blade.activeWidget == 'card') {
                ctrl.initSupplierCardData(theLocation, seller);
                setTimeout(() => {
                    ctrl.initCardDetails(theLocation);
                    ctrl.initSupplierCardData(theLocation, seller);
                });
            }
            if (ctrl.blade.activeWidget == 'energyContent') {
                setTimeout(() => {
                    // ctrl.initCardDetails(theLocation);
                    ctrl.initEnergyBlade(theLocation, seller);
                });
            }
            if (ctrl.blade.activeWidget == 'requote') {
                setTimeout(() => { });
                ctrl.viewRequote(seller, theLocation);
            }
            if (ctrl.blade.activeWidget == 'contact') {
            	// ctrl.blade.widgetType = "none";
            	ctrl.blade.activeWidget = null;
                Factory_Master.get_master_entity(seller.sellerCounterparty.id, 'counterparty', 'masters', (callback) => {
                    if (callback) {
		            	ctrl.blade.activeWidget = 'contact';
                        ctrl.blade.counterpartyData = callback;
                        ctrl.dataLoaded = true;
                    }
                });
            }

            if (ctrl.blade.activeWidget == 'rating') {
                ctrl.blade.activeWidget = null;
                payload = { 
                    'locationId': theLocation.location.id,
                    'counterpartyId': seller.sellerCounterparty.id
                };
                Factory_Master.getSellerRatingForNegociation(payload, (callback) => {
                    if (callback) {
                        console.log(callback);
                        ctrl.blade.sellerRatingBladeData = callback;
                        let findSpecificLocation = _.find(ctrl.blade.sellerRatingBladeData, function(obj) {
                            return obj.location;
                        });
                        let findAllLocations = _.find(ctrl.blade.sellerRatingBladeData, function(obj) {
                            return !obj.location;
                        });
                        ctrl.blade.noSpecificLocation = !findSpecificLocation ? true : false;
                        ctrl.blade.noAllLocations = !findAllLocations ? true : false;
                        ctrl.blade.widgetType = 'counterparty';
                        ctrl.blade.colLayout = 'double';
                        ctrl.blade.activeWidget = 'rating';
                        ctrl.blade.counterpartyActiveLocation = theLocation;
                        ctrl.blade.counterpartyActiveProducts = theLocation[0].products;
                        ctrl.blade.activeSeller = `${seller.requestLocationId }-${ seller.randUnique}`;
                        $bladeEntity.open('groupOfRequestBlade');
                        ctrl.bladeOpened = true;
                    }
                }); 

            }
        };
        ctrl.openGeneralWidgetBlade = function(widget, product) {
            ctrl.bladeTemplateUrl = 'components/blade/templates/gor-blade-content.html';
            ctrl.blade.widgetType = 'general';
            ctrl.blade.colLayout = 'single';
            ctrl.blade.activeWidget = widget;
            $bladeEntity.open('groupOfRequestBlade');
            ctrl.bladeOpened = true;
            ctrl.dataLoaded = true;
            if (widget == 'energyCalculation') {
            	ctrl.initEnergyCalculation(product);
            }
            if (widget == 'comments') {
                $rootScope.overrideCloseNavigation = true;
            }
        };

        ctrl.checkIfCanInitEnergyCalculation = function(product) {
            let canInitEnergyCalculation = false;

            var requestId = product.requestId;
            var productId = product.product.id;
            var currentProduct = product;
            var requestProductIds = [];
            $.each(ctrl.requests, (reqK, reqV) => {
            	if (requestId == reqV.id) {
	                $.each(reqV.locations, (locK, locV) => {
                        var currentLocation = locV;
	                    $.each(locV.products, (prodK, prodV) => {
	                        if (productId == prodV.product.id) {
			                    $.each(prodV.sellers, (sellerK, sellerV) => {
			                    	if (sellerV.offers.length > 0) {
			                    		if (prodV.isEnergyCalculationRequired && ctrl.isEnergyCalculationRequired) {
                                            canInitEnergyCalculation = true;
			                    		}
			                    	}
			                    });
	                        }
	                    });
	                });
            	}
            });
            return canInitEnergyCalculation;
        };

        ctrl.initEnergyCalculation = function(product) {
            var requestId = product.requestId;
            var productId = product.product.id;
            var currentProduct = product;
            var requestProductIds = [];
            $.each(ctrl.requests, (reqK, reqV) => {
            	if (requestId == reqV.id) {
	                $.each(reqV.locations, (locK, locV) => {
                        var currentLocation = locV;
	                    $.each(locV.products, (prodK, prodV) => {
	                        if (productId == prodV.product.id) {
                        		requestProductIds.push(prodV.id);
	                        }
	                    });
	                });
            	}
            });
            console.log(requestProductIds);
            var payload = {
                requestGroupId:ctrl.groupId,
                requestProductIds:requestProductIds.join(',')
            };
            var initData = {
                payload : payload,
                currentProduct : currentProduct
            };
            ctrl.energyCalculationBladePayload = null;
            setTimeout(() => {
                ctrl.energyCalculationBladePayload = initData;
            });
        };
        ctrl.groupSellersInLocations = function() {
            var groupedLocationsIds = [];
            var groupedLocations = [];
            $.each(ctrl.locations, (locationK, locationV) => {
                var loc = {};
                if (groupedLocationsIds.indexOf(locationV.uniqueLocationIdentifier) == -1) {
                    groupedLocationsIds.push(locationV.uniqueLocationIdentifier);
                    loc.uniqueLocationIdentifier = locationV.uniqueLocationIdentifier;
                    loc.location = locationV.location;
                    groupedLocations.push(loc);
                }
            });
            // return false;
            $.each(groupedLocations, (k, v) => {
                $.each(ctrl.locations, (locationK, locationV) => {
                    if (locationV.uniqueLocationIdentifier == v.uniqueLocationIdentifier) {
                        $.each(locationV.products, (k1, v1) => {
                            $.each(v1.sellers, (k2, v2) => {
                                if (typeof groupedLocations[k].sellers == 'undefined') {
                                    groupedLocations[k].sellers = [];
                                }
                                // if (!v2.isCloned) {
                                v2.uniqueLocationSellerPhysical = `${locationV.location.id }-${ v2.randUnique}`;
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
            $.each(groupedLocations, (k, v) => {
                var addedSellers = [];
                var filteredSellers = [];
                $.each(v.sellers, (k1, v1) => {
                    if (addedSellers.indexOf(v1.randUnique) == -1) {
                        if (!(v1.packageId && !ctrl.packagesConfigurationEnabled)) {
                            addedSellers.push(v1.randUnique);
                            filteredSellers.push(v1);
                        }
                    }
                });
                v.sellers = filteredSellers;
            });
            var productIds = getRequestGroupProductIdsCSV(ctrl.requests);
            var counterpatyIds = getRequestGroupCounterpartyIdsCSV(ctrl.requests);
            $scope.tempGroupedLocation = angular.copy(groupedLocations);
            groupOfRequestsModel.getSellersSorted(counterpatyIds, productIds, ctrl.sellerSortOrder).then((data) => {
                $.each($scope.tempGroupedLocation, (vk, vv) => {
                    var addedSellers = [];
                    $.each(data.payload, (dk, dv) => {
                        $.each(vv.sellers, (uosK, uosV) => {
                            if (typeof $scope.tempGroupedLocation[vk].orderedSellers == 'undefined') {
                                $scope.tempGroupedLocation[vk].orderedSellers = [];
                            }
                            if (dv.locationId == vv.location.id) {
                                if (dv.counterpartyId == uosV.sellerCounterparty.id) {
                                    if (addedSellers.indexOf(uosV.randUniquePkg) == -1) {
                                        $scope.tempGroupedLocation[vk].orderedSellers.push(uosV);
                                        addedSellers.push(uosV.randUniquePkg);
                                    }
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
        ctrl.duplicateSeller = function(seller, theLocation, event) {
            // console.log(seller);
            var currentLocationId = theLocation[0].uniqueLocationIdentifier;
            var locations = [];
            $.each(ctrl.locations, (k, v) => {
                if (v.uniqueLocationIdentifier == currentLocationId) {
                    locations.push(v);
                }
            });
            var randomUnique = window.crypto.getRandomValues(new Uint8Array(1))
                .toString(36)
                .substr(2, 6);
            for (let i = 0; i < locations.length; i++) {
                for (let j = 0; j < locations[i].products.length; j++) {
                    var product = locations[i].products[j];
                    // if (!productHasSeller(product, seller.sellerCounterparty.id)) {
                    var newSeller = {
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
                    newSeller.randUnique = `${randomUnique }-null`;
                    newSeller.sellerCounterparty = {
                        id: seller.sellerCounterparty.id,
                        name: seller.sellerCounterparty.name
                    };
                    newSeller.randUniquePkg = `${randomUnique }-null-individual-null`;
                    newSeller.packageType = 'individual';
                    newSeller.packageId = null;
                    product.sellers.push(newSeller);
                    // }
                }
            }
            ctrl.groupLocationsByUniqueLocationIdentifier();
            // console.log(ctrl.locations);
            console.log('_____________');
            console.log(ctrl.requests);
            console.log('-------------');
        };
        ctrl.setAsCurrentSelection = function(obj, src) {
            console.log(obj);
            var sellers = '';
            var products = '';
            var offer = [];
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
            $.each(obj, (key, val) => {
                if (val.requestOfferId) {
                    offer.push(val.requestOfferId);
                }
            });
            var offerS = offer.join();
            // }
            groupOfRequestsModel.markCurrentSelection(offerS).then(
                (response) => {
                    var mySelectionResponse = response.payload.mySelection.quotations;
                    console.log(ctrl.mySelection);
                    ctrl.mySelection = mySelectionResponse;
                    ctrl.mySelectionSurveyorCost = response.payload.mySelection.averageSurveyorCost;
                    return false;
                    console.log(mySelectionResponse);
                    $.each(mySelectionResponse, (myselRespK, myselRespV) => {
                        var responseSelectionIsInCurrentSelection = false;
                        $.each(ctrl.mySelection, (myselK, myselV) => {
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
                (response) => {
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
        ctrl.checkIfPriceChanged = function(value) {
        	if (value) {
	            ctrl.checkedIfPriceChanged = Math.floor(Number(value));
        	} else {
	            ctrl.checkedIfPriceChanged = value;
        	}
        };

        ctrl.savePriceChange = function(priceValue, requestOfferId, seller, locations, productSample) {
            if (ctrl.checkedIfPriceChanged === priceValue) {
                return false;
            }
            $scope.tempRequestOfferId = requestOfferId;


            let intPriceValue = Math.floor(Number(priceValue));
            let priceIsInteger = _.isInteger(intPriceValue);

            if (!(priceIsInteger && intPriceValue > 0 || priceIsInteger && productSample.allowZeroPricing && intPriceValue === 0)) {
                // Reset price to previous value
                $.each(ctrl.requests, (reqK, reqV) => {
                    $.each(reqV.locations, (locK, locV) => {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
                                if (sellerV.offers) {
                                    $.each(sellerV.offers, (ofK, ofV) => {
                                        if (ofV.id == $scope.tempRequestOfferId) {
                                            ofV.price = ctrl.checkedIfPriceChanged;
                                        }
                                    });
                                }
                            });
                        });
                    });
                });
                if (productSample.allowZeroPricing) {
                    toastr.error('Please enter a valid price');
                } else {
                    toastr.error('Please enter a price greater than 0');
                }
                return false;
            }

            var payloadLocation = null;
            var curentOfferRequestId = productSample.requestId;
            $.each(ctrl.requests, (reqK, reqV) => {
            	if (reqV.id == curentOfferRequestId) {
		            payloadLocation = reqV.locations;
            	}
            });

            ctrl.priceInputsDisabled = true;
            toastr.info('Please wait while prices are updating');
            var priceData = {
                RequestOfferId: requestOfferId,
                Price: priceValue,
                Locations : payloadLocation
            };

            groupOfRequestsModel.updatePrice(priceData).then(

                (response) => {
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
                var  oldData = angular.copy(ctrl.requests);
	            $.each(oldData, (rk, rv) => {
	            	if (rv.id == response.payload.id) {
	            		oldData[rk] = angular.copy(response.payload);
	            	}
	            });
	            var skipSellerSorting = false;
	            // ctrl.sortSellers();
	            parseRequestList(oldData, false, skipSellerSorting);
                    ctrl.locations = getLocationsFromRequests(ctrl.requests);
                    ctrl.products = getAllRequestProductList(ctrl.requests);
                    setRequestProductCount(ctrl.requests);
                    // initialize notifications
                    notificationsModel.stop();
                    notificationsModel.start(getRequestIds(ctrl.requests));
                    // calculates screen actions
                    ctrl.calculateScreenActions();
                    if (ctrl.nextPriceInput) {
                	setTimeout(() => {
	                	$(`[productPriceIndexNo=${ctrl.nextPriceInput}]`).click();
	                	$(`[productPriceIndexNo=${ctrl.nextPriceInput}]`).focus();
                	}, 100);
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
                (response) => {
                    ctrl.priceInputsDisabled = false;
                    $.each(ctrl.requests, (reqK, reqV) => {
                        $.each(reqV.locations, (locK, locV) => {
                            $.each(locV.products, (prodK, prodV) => {
                                $.each(prodV.sellers, (sellerK, sellerV) => {
                                    if (sellerV.offers) {
                                        $.each(sellerV.offers, (ofK, ofV) => {
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

        ctrl.checkIfPhysicalSupplierChanged = function(oldSupplier, seller) {
            ctrl.oldSupplierBeforeChange = oldSupplier;
            var requestLocationId = seller.requestLocationId;
            var randUnique = seller.randUnique;
            console.log(seller);
        };

        ctrl.calculateUniqueCounterpartyType = function(seller) {
            var allCounterpartyTypes = [];
            $.each(seller.counterpartyTypes, (k, v) => {
                allCounterpartyTypes.push(v.name);
            });
            var returnData = {};
            if (allCounterpartyTypes.indexOf('Seller') != -1 && allCounterpartyTypes.indexOf('Supplier') != -1) {
                returnData.sellerUniqueCounterpartyType = 'Supplier';
                returnData.counterpartyTypeFontClass = 'font-yellow-gold';
                return returnData;
            }
            if (allCounterpartyTypes.indexOf('Supplier') != -1) {
                returnData.sellerUniqueCounterpartyType = 'Supplier';
                returnData.counterpartyTypeFontClass = 'font-yellow-lemon';
                return returnData;
            }
            if (allCounterpartyTypes.indexOf('Seller') != -1) {
                returnData.sellerUniqueCounterpartyType = 'Seller';
                returnData.counterpartyTypeFontClass = 'font-green-jungle';
                return returnData;
            }
            if (allCounterpartyTypes.indexOf('Broker') != -1) {
                returnData.sellerUniqueCounterpartyType = 'Broker';
                returnData.counterpartyTypeFontClass = 'font-blue';
                return returnData;
            }
        };
        ctrl.findTotalSellersOnLocation = function(theLocation) {
            var groupedLocationsIds = [];
            var groupedLocations = [];
            $.each(ctrl.locations, (locationK, locationV) => {
                if (groupedLocationsIds.indexOf(locationV.location.id) == -1) {
                    groupedLocationsIds.push(locationV.location.id);
                    groupedLocations.push(locationV.location);
                }
                $.each(groupedLocations, (k, v) => {
                    if (locationV.location.id == v.id) {
                        $.each(locationV.products, (k1, v1) => {
                            $.each(v1.sellers, (k2, v2) => {
                                if (typeof groupedLocations[k].sellers == 'undefined') {
                                    groupedLocations[k].sellers = [];
                                }
                                groupedLocations[k].sellers.push(v2);
                            });
                        });
                    }
                });
            });
            $.each(groupedLocations, (k, v) => {
                var addedSellers = [];
                var filteredSellers = [];
                $.each(v.sellers, (k1, v1) => {
                    var physicalSupplierId = null;
                    if (typeof v1.offers != 'undefined') {
                        if (v1.offers.length > 0) {
                            if (v1.offers[0].physicalSupplierCounterparty) {
                                physicalSupplierId = v1.offers[0].physicalSupplierCounterparty.id;
                            }
                        }
                    }
                    var composedSellerIds = `${v1.sellerCounterparty.id } - ${ physicalSupplierId}`;
                    if (addedSellers.indexOf(composedSellerIds) == -1) {
                        addedSellers.push(composedSellerIds);
                        filteredSellers.push(v1);
                    }
                });
                v.sellers = filteredSellers;
            });
            var locationId = theLocation[0].location.id;
            var sellerLocations = groupedLocations;
            var data = {};
            // allSellersIds = [];
            $.each(sellerLocations, (locK, locV) => {
                if (locationId == locV.id) {
                    data.found = 0;
                    $.each(locV.sellers, (sellerK, sellerV) => {
                         var physicalSupplierName = null;
                         if (typeof sellerV.offers != 'undefined') {
                            if (sellerV.offers.length > 0) {
                                if (sellerV.offers[0].physicalSupplierCounterparty) {
                                    physicalSupplierName = sellerV.offers[0].physicalSupplierCounterparty.name;
                                }
                            }
                        }
                        var loopSellerNameComposed = `${sellerV.sellerCounterparty.name } ${ physicalSupplierName}`;
                        loopSellerNameComposed = loopSellerNameComposed.toLowerCase();
                        if (loopSellerNameComposed.indexOf(ctrl.searchTermNegotiationTable) != -1) {
                            data.found = data.found + 1;
                        }
                    });
                    data.total = locV.sellers.length;
                }
            });

            /* rewrite*/
            var uniqueLocationIdentifier = theLocation[0].uniqueLocationIdentifier;
            var uniqeSellers = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
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

            /* rewrite*/
            return data;
        };
        ctrl.performSellersSearchInTable = function(keyword) {
            console.log(keyword);
            console.log(ctrl.requests);
            var requests = ctrl.requests;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    reqV.locations[locK].foundInSearch = 0;
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            physicalSupplierName = null;
                            if (typeof sellerV.offers != 'undefined') {
                                if (sellerV.offers.length > 0) {
                                    if (sellerV.offers[0].physicalSupplierCounterparty) {
                                        physicalSupplierName = sellerV.offers[0].physicalSupplierCounterparty.name;
                                    }
                                }
                            }
                            var loopSellerNameComposed = `${sellerV.sellerCounterparty.name } ${ physicalSupplierName}`;
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
        ctrl.updatePhysicalSupplierForSellers = function(seller, newSupplier, theLocation, event) {
            // oldSupplier = ctrl.oldSupplierBeforeChange;
            ctrl.disablePhysicalSupplierLookup = true;
            var oldSupplier = seller.oldPhysicalSupplier;
            var randUnique = seller.randUnique;
            var randUniquePkg = seller.randUniquePkg;
            // if (typeof(newSupplier) == 'undefined') {ctrl.disablePhysicalSupplierLookup = false; return false;}
            if (newSupplier && oldSupplier) {
	            if (newSupplier.id === oldSupplier.id) {
	                ctrl.disablePhysicalSupplierLookup = false;
	                return false;
	            }
            }

            if (!newSupplier) {
                $.each(theLocation, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
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
                if (ctrl.fieldVisibility.isPhysicalSupplierMandatory) {
	                if ($($(event.target).parent('.physicalSupplier')).find($('[uib-typeahead-popup].dropdown-menu')).css('display') == 'none') {
		                toastr.error('You must select a Physical Supplier');
	                }
	                return;
                }
            }
            if (seller.isCloned) {
                $.each(theLocation, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            if (sellerV.randUnique == randUnique) {
                                console.log(sellerV);
                                if (typeof sellerV.offers == 'undefined') {
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
            } else if (typeof newSupplier != 'undefined') {
                var newSupplierId;
                var newRandUnique;
                if (newSupplier) {
                    newSupplierId = newSupplier.id;
                    newRandUnique = `${seller.sellerCounterparty.id }-${ newSupplier.id}`;
                } else {
                    newSupplierId = null;
                    newRandUnique = `${seller.sellerCounterparty.id }-null`;
                }
                var sellerWithSupplierExists = false;

                /** ***
                    LOGIC FOR PACKAGES ACROSS SAME LOCATION
                    ****/
                if (seller.packageType == 'individual') {
                    $.each(theLocation, (locK, locV) => {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
                                if (sellerV.randUnique == newRandUnique && sellerV.packageType == seller.packageType) {
                                    sellerWithSupplierExists = true;
                                }
                            });
                        });
                    });
                } else {
                    var activeRandUniquePkg = seller.randUniquePkg;
                    var activeRandUnique = randUnique;
                    var activeLocationId = theLocation[0].location.id;
                    var activePackageType = seller.packageType;
                    var activeRequestProductIds = [];
                    var sameSellerSupplierRequestProductIds = [];
                    var packageRequestSellerIds = [];
                    $.each(ctrl.requests, (reqK, reqV) => {
                        $.each(reqV.locations, (locK, locV) => {
                            $.each(locV.products, (prodK, prodV) => {
                                $.each(prodV.sellers, (selK, selV) => {
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
                    $.each(ctrl.requests, (reqK, reqV) => {
                        $.each(reqV.locations, (locK, locV) => {
                            if (locV.location.id == activeLocationId) {
                                $.each(locV.products, (prodK, prodV) => {
                                    $.each(prodV.sellers, (selK, selV) => {
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
                    $.each(activeRequestProductIds, (k, v) => {
                        $.each(sameSellerSupplierRequestProductIds, (k1, v1) => {
                            if (v == v1) {
                                sellerWithSupplierExists = true;
                            }
                        });
                    });
                    console.log(activeRequestProductIds);
                    console.log(sameSellerSupplierRequestProductIds);
                }

                /** ***
                    LOGIC FOR PACKAGES ACROSS SAME LOCATION
                    ****/
                console.log(sellerWithSupplierExists);
                if (sellerWithSupplierExists) {
                    $.each(theLocation, (locK, locV) => {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
                                if (sellerV.randUnique == randUnique) {
                                    if (typeof sellerV.offers == 'undefined') {
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
                    if (newSupplier != oldSupplier) {
	                        toastr.error('The selected Physical Supplier already exist for that seller on that location');
                    }
                } else {
                    var requestOfferIds = [];
                    $.each(theLocation, (locK, locV) => {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
                                if (sellerV.randUniquePkg == randUniquePkg) {
                                    if (sellerV.offers.length > 0) {
                                        requestOfferIds.push(sellerV.offers[0].id);
                                    }
                                }
                            });
                        });
                    });
                    // requestSellerIds = JSON.stringify(requestSellerIds)
                    if (seller.packageType == 'seller' || seller.packageType == 'buyer') {
                        var requestSellerIds = packageRequestSellerIds;
                    }
                    // "RequestSellerIds": requestSellerIds,
                    var data = {
                        RequestOfferIds: requestOfferIds,
                        PhysicalSupplierId: newSupplierId
                    };
                    if (typeof data.RequestOfferIds[0] != 'undefined') {
                        groupOfRequestsModel.updatePhysicalSupplier(data).then(
                            (newRequestData) => {
                                ctrl.disablePhysicalSupplierLookup = false;
                                if (newRequestData.isSuccess) {
                                    if (seller.packageType == 'individual') {
                                        $.each(theLocation, (locK, locV) => {
                                            $.each(locV.products, (prodK, prodV) => {
                                                $.each(prodV.sellers, (sellerK, sellerV) => {
                                                    if (sellerV.randUnique == randUnique && sellerV.packageType == seller.packageType) {
                                                        if (typeof sellerV.offers == 'undefined') {
                                                            sellerV.offers = [
                                                                {
                                                                    physicalSupplierCounterparty: newSupplier
                                                                }
                                                            ];
                                                        } else {
                                                            sellerV.offers[0].physicalSupplierCounterparty = newSupplier;
                                                        }
                                                        sellerV.randUnique = newRandUnique;
                                                        sellerV.randUniquePkg = `${newRandUnique }-${ seller.packageType }-${ seller.packageId}`;
                                                        sellerV.oldPhysicalSupplier = newSupplier;
                                                    }
                                                });
                                            });
                                        });
                                    } else {
                                        $.each(ctrl.requests, (reqK, reqV) => {
                                            $.each(reqV.locations, (locK, locV) => {
                                                if (locV.location.id == activeLocationId) {
                                                    $.each(locV.products, (prodK, prodV) => {
                                                        $.each(prodV.sellers, (selK, selV) => {
                                                            if (selV.randUniquePkg == activeRandUniquePkg) {
                                                                if (typeof selV.offers == 'undefined') {
                                                                    selV.offers = [
                                                                        {
                                                                            physicalSupplierCounterparty: newSupplier
                                                                        }
                                                                    ];
                                                                } else {
                                                                    selV.offers[0].physicalSupplierCounterparty = newSupplier;
                                                                }
                                                                selV.randUnique = newRandUnique;
                                                                selV.randUniquePkg = `${newRandUnique }-${ seller.packageType }-${ seller.packageId}`;
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
                            (response) => {
                                $.each(theLocation, (locK, locV) => {
                                    $.each(locV.products, (prodK, prodV) => {
                                        $.each(prodV.sellers, (sellerK, sellerV) => {
                                            if (sellerV.randUnique == randUnique && sellerV.packageType == seller.packageType) {
                                                if (typeof sellerV.offers == 'undefined') {
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
                        $.each(theLocation, (locK, locV) => {
                            $.each(locV.products, (prodK, prodV) => {
                                $.each(prodV.sellers, (sellerK, sellerV) => {
                                    if (sellerV.randUnique == randUnique && sellerV.packageType == seller.packageType) {
                                        if (typeof sellerV.offers == 'undefined') {
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
                $.each(theLocation, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            if (sellerV.randUnique == randUnique && sellerV.packageType == seller.packageType) {
                                if (typeof sellerV.offers == 'undefined') {
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
            if (ctrl.hasSellerRequirements(seller.sellerCounterparty.id, theLocation, seller)) {
                ctrl.createSellerRequirements(seller, theLocation, null);
            }
            setTimeout(() => {
                ctrl.disablePhysicalSupplierLookup = false;
            }, 3000);
            ctrl.changeScroll();
        };
        ctrl.returnLocationReqOffIds = function(theLocation, randUniquePkg) {
            var requestOfferIds = [];
            $.each(theLocation, (locK, locV) => {
                $.each(locV.products, (prodK, prodV) => {
                    $.each(prodV.sellers, (sellerK, sellerV) => {
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
        ctrl.updateBrokerForSellers = function(seller, newBroker, theLocation) {
            // oldSupplier = ctrl.oldSupplierBeforeChange;
            ctrl.disableBrokerLookup = true;
            var oldBroker = seller.oldBroker;
            var randUniquePkg = seller.randUniquePkg;
            if (newBroker === oldBroker) {
                ctrl.disableBrokerLookup = false;
                return false;
            }
            if (seller.isCloned) {
                $.each(theLocation, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            if (sellerV.randUniquePkg == randUniquePkg) {
                                console.log(sellerV);
                                if (typeof sellerV.offers == 'undefined') {
                                    sellerV.offers = [
                                        {
                                            brokerCounterparty: newBroker
                                        }
                                    ];
                                } else {
                                    sellerV.offers[0].brokerCounterparty = newBroker;
                                    $.each(ctrl.requirements, (k, v) => {
                                    	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                    		v.BrokerCounterpartyId = newBroker.id;
                                    	}
                                    });
                                }
                            }
                        });
                    });
                });
                ctrl.disableBrokerLookup = false;
            } else {
                var requestOfferIds = ctrl.returnLocationReqOffIds(theLocation, randUniquePkg);
                var data = {
                    RequestOfferIds: requestOfferIds,
                    BrokerId: newBroker ? newBroker.id : null
                };
                if (typeof data.RequestOfferIds[0] != 'undefined') {
                    groupOfRequestsModel.updateBroker(data).then(
                        (response) => {
                            ctrl.disableBrokerLookup = false;
                            ctrl.initScreen();
                            return false;
                            if (response.isSuccess) {
                                $.each(theLocation, (locK, locV) => {
                                    $.each(locV.products, (prodK, prodV) => {
                                        $.each(prodV.sellers, (sellerK, sellerV) => {
                                            if (sellerV.randUniquePkg == randUniquePkg) {
                                                console.log(sellerV);
                                                if (typeof sellerV.offers == 'undefined') {
                                                    sellerV.offers = [
                                                        {
                                                            brokerCounterparty: newBroker
                                                        }
                                                    ];
                                                } else {
                                                    sellerV.offers[0].brokerCounterparty = newBroker;
                                                    $.each(ctrl.requirements, (k, v) => {
                                                    	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                                    		v.BrokerCounterpartyId = newBroker.id;
                                                    	}
                                                    });
                                                }
                                            }
                                        });
                                    });
                                });
                            }
                        },
                        () => {
                            ctrl.disableBrokerLookup = false;
                        }
                    );
                } else {
                    ctrl.disableBrokerLookup = false;
                    $.each(theLocation, (locK, locV) => {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
                                if (seller.sellerCounterparty.id == sellerV.sellerCounterparty.id) {
                                    console.log(sellerV);
                                    if (typeof sellerV.offers == 'undefined' || sellerV.offers.length == 0) {
                                        sellerV.offers = [
                                            {
                                                brokerCounterparty: newBroker
                                            }
                                        ];
                                    } else {
                                        sellerV.offers[0].brokerCounterparty = newBroker;
                                        $.each(ctrl.requirements, (k, v) => {
                                            	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                            		v.BrokerCounterpartyId = newBroker.id;
                                            	}
                                        });
                                    }
                                }
                            });
                        });
                    });
                }
            }
            setTimeout(() => {
                ctrl.disableBrokerLookup = false;
            }, 3000);
        };
        ctrl.updateContactForSellers = function(seller, newContact, theLocation) {
            // oldSupplier = ctrl.oldSupplierBeforeChange;
            ctrl.disableContactLookup = true;
            var oldContact = seller.oldContact;
            var randUniquePkg = seller.randUniquePkg;
            if (newContact) {
                if (oldContact) {
                    if (newContact.id === oldContact.id) {
                        ctrl.disableContactLookup = false;
                        return false;
                    }
                }
            }
            if (seller.isCloned) {
                $.each(theLocation, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            if (sellerV.randUniquePkg == randUniquePkg) {
                                console.log(sellerV);
                                if (typeof sellerV.offers == 'undefined') {
                                    sellerV.offers = [
                                        {
                                            contactCounterparty: newContact
                                        }
                                    ];
                                } else {
                                    sellerV.offers[0].contactCounterparty = newContact;
                                    $.each(ctrl.requirements, (k, v) => {
                                    	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                    		v.ContactCounterpartyId = newContact.id;
                                    	}
                                    });
                                }
                            }
                        });
                    });
                });
                ctrl.disableContactLookup = false;
            } else {
                var requestOfferIds = [];
                $.each(theLocation, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            if (sellerV.sellerCounterparty.id == seller.sellerCounterparty.id) {
                                if (sellerV.offers.length > 0) {
                                    requestOfferIds.push(sellerV.offers[0].id);
                                }
                            }
                        });
                    });
                });
                var data = {
                    RequestOfferIds: requestOfferIds,
                    SellerContactId: newContact ? newContact.id : null
                };
                if (typeof data.RequestOfferIds[0] != 'undefined') {
                    groupOfRequestsModel.updateContact(data).then(
                        (response) => {
                            ctrl.disableContactLookup = false;
                            if (response.isSuccess) {
                                ctrl.initScreen();
                                return false;
                                $.each(theLocation, (locK, locV) => {
                                    $.each(locV.products, (prodK, prodV) => {
                                        $.each(prodV.sellers, (sellerK, sellerV) => {
                                            if (sellerV.randUniquePkg == randUniquePkg) {
                                                console.log(sellerV);
                                                if (typeof sellerV.offers == 'undefined') {
                                                    sellerV.offers = [
                                                        {
                                                            contactCounterparty: newContact
                                                        }
                                                    ];
                                                } else {
                                                    sellerV.offers[0].contactCounterparty = newContact;
                                                    $.each(ctrl.requirements, (k, v) => {
                                                    	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                                    		v.ContactCounterpartyId = newContact.id;
                                                    	}
                                                    });
                                                }
                                            }
                                        });
                                    });
                                });
                            }
                        },
                        () => {
                            ctrl.disableContactLookup = false;
                        }
                    );
                } else {
                    ctrl.disableContactLookup = false;
                    $.each(theLocation, (locK, locV) => {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
                                if (seller.sellerCounterparty.id == sellerV.sellerCounterparty.id) {
                                    console.log(sellerV);
                                    if (typeof sellerV.offers == 'undefined') {
                                        sellerV.offers = [
                                            {
                                                contactCounterparty: newContact
                                            }
                                        ];
                                    } else if (sellerV.offers.length == 0) {
                                        sellerV.offers = [
                                            {
                                                contactCounterparty: newContact
                                            }
                                        ];
                                    } else {
                                        sellerV.offers[0].contactCounterparty = newContact;
                                        $.each(ctrl.requirements, (k, v) => {
                                            	if (v.randUniquePkg == sellerV.randUniquePkg) {
                                            		v.ContactCounterpartyId = newContact.id;
                                            	}
                                        });
                                    }
                                }
                            });
                        });
                    });
                }
            }
            setTimeout(() => {
                ctrl.disableContactLookup = false;
            }, 3000);
        };
        ctrl.getContactListForSeller = function(seller, callback) {
            if (typeof ctrl.sellerContactList == 'undefined') {
                ctrl.sellerContactList = [];
            }
            var payload = {
                Payload: seller.sellerCounterparty.id
            };
            var endpoint = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/activeEmailContacts`;
            if (!ctrl.sellerContactList[`s${ seller.sellerCounterparty.id}`]) {
	            $http.post(endpoint, payload).then((response) => {
	                if (response.status == 200) {
	                    ctrl.sellerContactList[`s${ seller.sellerCounterparty.id}`] = response.data.payload;
	                    if (seller.offers.length == 0 && response.data.payload.length == 1) {
	                        seller.offers[0] = {};
	                        seller.offers[0].contactCounterparty = response.data.payload[0];
	                    }
	                }
	                callback(response.data.payload);
	            });
            } else if (callback) {
                callback(ctrl.sellerContactList[`s${ seller.sellerCounterparty.id}`]);
            }
        };
        ctrl.diffProducts = function() {
            // INIDIVIDUAL
            ctrl.ids = [];
            ctrl.differentProducts = [];
            ctrl.bestTcoData.bestIndividuals.grandTotal = 0;
            $.each(ctrl.bestTcoData.bestIndividuals, (key, val) => {
                val.request.amount = 0;
                $.each(val.bestTCO, (skey, sval) => {
                    val.request.amount += Number(sval.amount);
                    val.request.vessel = sval.vessel;
                    ctrl.bestTcoData.bestIndividuals.grandTotal += sval.amount;
                    if ($.inArray(sval.product.id, ctrl.ids) == -1) {
                        sval.product.amount = sval.amount;
                        ctrl.differentProducts.push(sval.product);
                    } else {
                        $.each(ctrl.differentProducts, (k, v) => {
                            if (v.id == sval.product.id) {
                                v.amount = v.amount + sval.amount;
                            }
                        });
                    }
                    ctrl.ids.push(sval.product.id);
                });
            });
            // PACKAGES
            ctrl.bestPackagesGrandTotal = 0;
            $.each(ctrl.bestTcoData.bestPackages, (key, val) => {
                ctrl.bestPackagesGrandTotal = ctrl.bestPackagesGrandTotal + val.tco;
            });
            if (ctrl.includeAverageSurveyorChargeChecbox == true) {
                $.each(ctrl.bestTcoData.bestIndividuals, (key, val) => {
                    ctrl.bestTcoData.bestIndividuals.grandTotal += val.surveyorCost;
                });
                $.each(ctrl.bestTcoData.bestPackages, (key, val) => {
                    ctrl.bestPackagesGrandTotal = ctrl.bestPackagesGrandTotal + val.surveyorCost;
                });
            }
            // ctrl.bestTcoData.bestIndividuals.surveyorCost = ctrl.bestTcoData.bestIndividuals.surveyorCost;
        };
        ctrl.calculateBestTotalTCOGrandTotal = function() {
            ctrl.bestTotalTCOGrandTotal = 0;
            ctrl.tcoSurveyorCost = 0;
            $.each(ctrl.bestTcoData.bestTotalTCO, (tcoK, tcoV) => {
                $.each(tcoV.products, (pk, pv) => {
                    ctrl.bestTotalTCOGrandTotal = ctrl.bestTotalTCOGrandTotal + pv.amount;
                });
                if (ctrl.includeAverageSurveyorChargeChecbox == true) {
                    ctrl.bestTotalTCOGrandTotal = ctrl.bestTotalTCOGrandTotal + tcoV.surveyorCost;
                    if (tcoV.surveyorCost) {
                        ctrl.tcoSurveyorCost = ctrl.tcoSurveyorCost + tcoV.surveyorCost;
                    }
                }
            });
            return ctrl.bestTotalTCOGrandTotal;
        };
        ctrl.calculateSellerIsVisible = function(key, seller, theLocation) {
            var isVisible = true;
            if (ctrl.displayNoOfSellers) {
                var numberOfSellersToDisplay;
	            if (ctrl.displayNoOfSellers.name == 'All') {
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
                if (theLocation[0].sellersExpanded) {
                    isVisible = true;
                }
                if (theLocation[0].fullLocationSellersExpanded) {
                    isVisible = false;
                }
            } else {
                isVisible = true;
            }
            if (ctrl.searchTermNegotiationTable == '') {
                if (key >= numberOfSellersToDisplay) {
                    isVisible = false;
                }
                if (theLocation[0].sellersExpanded) {
                    isVisible = true;
                }
                if (theLocation[0].fullLocationSellersExpanded) {
                    isVisible = false;
                }
            }
            if (seller.isCloned) {
                isVisible = true;
            }
            return isVisible;
        };
        ctrl.checkIfHasRevokedRFQsAll = function(seller, currentSellerLocation) {
            var AllRFQsAreRevoked = true;
            $.each(currentSellerLocation, (locK, locV) => {
                $.each(locV.products, (prodK, prodV) => {
                    $.each(prodV.sellers, (sellerK, sellerV) => {
                        if (seller.randUnique == sellerV.randUnique) {
                            if (typeof sellerV.offers != 'undefined') {
                                if (sellerV.offers.length > 0) {
                                    if (sellerV.offers[0].rfqStatus != 'Revoked') {
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
        ctrl.removeSellerRevokedRFQsFromLocation = function(seller, currentSellerLocation) {
            var dataReq = [];
            var AllRFQsAreRevoked = ctrl.checkIfHasRevokedRFQsAll(seller, currentSellerLocation);
            if (seller.isCloned) {
                ctrl.removeSellerFromLocation(seller, currentSellerLocation);
                return false;
            }
            // if (seller.isPreferredSeller) {
            //     toastr.error("This seller is preferred at the port");
            //     return false;
            // }
            var sellerHasOfferOnLocation = false, physicalSupplierId;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    if (locV.uniqueLocationIdentifier == currentSellerLocation[0].uniqueLocationIdentifier) {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
                                if (seller.randUnique == sellerV.randUnique) {
                                    if (typeof sellerV.offers != 'undefined') {
                                        if (sellerV.offers.length > 0) {
                                        	if (sellerV.offers[0].id) {
		                                        sellerHasOfferOnLocation = true;
                                        	}
                                            if (sellerV.offers[0].rfqStatus == 'Revoked') {
                                                if (sellerV.offers[0].physicalSupplierCounterparty != null) {
                                                    physicalSupplierId = sellerV.offers[0].physicalSupplierCounterparty.id;
                                                } else {
                                                    physicalSupplierId = null;
                                                }
                                                var req = {
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
                toastr.error('Negotiation is in progress for this seller');
                return false;
            }
            let product, newCounterparty, newSeller;
            let counterpatyIds = getRequestGroupCounterpartyIdsCSV(ctrl.requests);
            // var productIds = getRequestGroupProductIdsCSV(ctrl.requests);
            let productIds = [];
            $.each(currentSellerLocation[0].products, (k, v) => {
                productIds.push(v.id);
            });
            productIds = productIds.join(',');
            var getSellersSortedPayload = {
                RequestProductList: productIds,
                RequestGroupId: ctrl.groupId,
                LocationId: currentSellerLocation[0].location.id,
                RequestSellerId: seller.sellerCounterparty.id
            };
            groupOfRequestsModel.deleteSeller(getSellersSortedPayload).then(
                (data) => {
                    if (data.isSuccess) {
                        ctrl.initScreen();
                        return false;
                    }
                },
                (response) => {
                    ctrl.initScreen();
                    return false;
                }
            );
            return false;

            if (dataReq.length <= 0) {
                toastr.error('Negotiation is in progress for this seller');
                return false;
            }
            var payloadRequirements = {
                requirements: dataReq
            };
            groupOfRequestsModel.removeRequirements(payloadRequirements).then(
                (data) => {
                    ctrl.initScreen();
                    return false;
                    // console.log(data);
                    // $state.reload();
                },
                (response) => {
                    ctrl.initScreen();
                    return false;
                    // console.log(response);
                    // $state.reload();
                }
            );
        };
        ctrl.calculateMinValidity = function(seller, requestProducts, location) {
            var valitidiesList = [];
            $.each(requestProducts, (rpK, rpV) => {
                var productOffer = ctrl.getSellerProductOfferOnLocation(rpV, location, seller.sellerCounterparty.id, seller);
                if (productOffer) {
                    if (productOffer.validity) {
                        valitidiesList.push(productOffer.validity);
                    }
                }
            });
            maxValidityDate = null;
            if (valitidiesList.length > 0) {
                var maxValidityDate = new Date(valitidiesList[0]).getTime();
                $.each(valitidiesList, (vK, vV) => {
                    if (new Date(vV).getTime() > maxValidityDate) {
                        maxValidityDate = new Date(vV).getTime();
                    }
                });
            }
            if (maxValidityDate) {
                var msValidity = maxValidityDate - new Date().getTime();
                var hoursValidity = msValidity / (1000 * 3600);
                // return hoursValidity.toFixed();
                return hoursValidity;
            }
            return '-';

            return maxValidityDate;
        };
        ctrl.setBladeCounterpartyActiveSeller = function() {
        	if (!ctrl.blade.counterpartyActiveSeller) {
        		return false;
        	}
            $rootScope.bladeFilteredRfq = ctrl.blade.counterpartyActiveSeller;
            $rootScope.bladeFilteredRfq.locationData = ctrl.blade.counterpartyActiveLocation;
        };
        ctrl.calculateMySelectionTotal = function() {
            var total = 0;
            $.each(ctrl.mySelection, (k, v) => {
                if (v.tco) {
                    total = total + v.tco;
                }
            });
            if (ctrl.includeAverageSurveyorCharge) {
                total = total + ctrl.mySelectionSurveyorCost;
            }
            return total;
        };
        ctrl.reviewRFQ = function() {
            ctrl.groupId;
            groupOfRequestsModel.reviewGroup(ctrl.groupId).then(
                (data) => {
                    console.log(data);
                    if (data.isSuccess) {
                        ctrl.isReviewed = true;
                    }
                },
                (response) => {
                    console.log(response);
                }
            );
        };
        ctrl.calculateTotalAmountForProductsPerRequestperSeller = function(requestProducts, currLocation, seller) {
            var totalAmount = 0;
            let hasAtLeastOneRfq = false;
            let foundNoValidTco = false;
            $.each(requestProducts, (k, product) => {
                var correctProduct = product.productLocations[`L${ currLocation[0].uniqueLocationIdentifier}`];
            	if (correctProduct) {
	                var productOffer = ctrl.getSellerProductOfferOnLocationRewrite(correctProduct, currLocation, seller.sellerCounterparty.id, seller);
            	}
                if (productOffer) {
                	if (productOffer.id) {
	                	hasAtLeastOneRfq = true;
                	}
                    if (productOffer.energyParameterValues && ctrl.isEnergyCalculationRequired) {
                        if (productOffer.energyParameterValues.tco) {
                            totalAmount = totalAmount + productOffer.energyParameterValues.tco;
                        } else if (ctrl.isEnergyCalculationRequired) {
	                            foundNoValidTco = true;
	                    	}
                    } else if (productOffer.totalAmount || productOffer.hasNoQuote) {
                        totalAmount = totalAmount + (productOffer.totalAmount || 0);
                    } else {
                        // foundNoValidTco = true;
                    }
                } else if (correctProduct) {
	                    foundNoValidTco = true;
                	}
            });
            if (ctrl.includeAverageSurveyorCharge && hasAtLeastOneRfq && ctrl.isEnergyCalculationRequired) {
            	if (totalAmount > 0) {
	                totalAmount = totalAmount + ctrl.averageSurveyorCost;
            	}
            }
            return foundNoValidTco ? -1 : totalAmount;
        };

        /** ***************************************************************************
         *   END EVENT HANDLERS
         ******************************************************************************/
        /**
         * Supplier Card specific functions
         */
        ctrl.initCardDetails = function(activeLocation) {
            ctrl.cardRequests = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                var requestLocation = false;
                $.each(reqV.locations, (locK, locV) => {
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
        ctrl.initSupplierCardData = function(theLocation, seller, activeSellerCardTab) {
            var requestLocationIds = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
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
                    physicalSupplierId: seller.randUnique.split('-')[1] == 'null' ? null : seller.randUnique.split('-')[1],
                    requestLocationIds: requestLocationIds.join(',')
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
                ctrl.cannotViewSellerCardMessage = 'Please add a contact for the offer before continuing';
            } else if (seller.isCloned || seller.offers.length == 0 || !seller.offers) {
                ctrl.cannotViewSellerCard = true;
                ctrl.cannotViewSellerCardMessage = 'Please send or skip RFQ before continuing';
            } else {
                // console.error('card data');
                ctrl.dataLoaded = false;
                ctrl.cannotViewSellerCard = false;
                Factory_Master.getSellerBlade(
                    ctrl.initDataforCard,
                    (callback) => {
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
                    () => {
                        ctrl.dataLoaded = true;
                    }
                );
            }
            setTimeout(() => {
                ctrl.cannotViewSellerCard ? ctrl.dataLoaded = true : '';
            }, 1000);
        };
        ctrl.initEnergyBlade = function(theLocation, seller, productOffer) {
            var requestLocationIds = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
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
                    physicalSupplierId: seller.randUnique.split('-')[1],
                    requestLocationIds: requestLocationIds.join(',')
                }
            };
            $scope.tempProductOffer = productOffer;
            $scope.tempSellerData = seller;
            Factory_Master.getEnergyBlade(ctrl.initDataforCard, (callback) => {
                ctrl.dataLoaded = true;
                if (callback) {
                    ctrl.sellerOffers = {};
                    ctrl.sellerOffers = callback.data.payload;
                    var products = [];
                    $.each(ctrl.sellerOffers, (k, v) => {
                        $.each(v.products, (pk, pv) => {
                            if (pv.isEnergyCalculationRequired) {
                                if (pk > 0) {
                                    var prod = angular.copy(v);
                                    prod.products = [ prod.products[pk] ];
                                    ctrl.sellerOffers.push(prod);
                                }
                            }
                        });
                    });
                    ctrl.sellerOffers = $filter('orderBy')(ctrl.sellerOffers, 'id');
                    console.log($scope.tempProductOffer);
                    // debugger;
                    if (ctrl.lastActiveProdIndex) {
                    	if (ctrl.lastActiveProdIndex < ctrl.sellerOffers.length) {
		                    ctrl.active_prod = ctrl.sellerOffers[ctrl.lastActiveProdIndex];
                    	} else {
		                    ctrl.active_prod = ctrl.sellerOffers[0];
                    	}
                    } else {
	                    ctrl.active_prod = ctrl.sellerOffers[0];
                    }
		            ctrl.sixMonthPayload = {
		                requestGroupId: ctrl.groupId,
		                locationIds: theLocation.location.id,
		                sellerCounterpartyId: seller.sellerCounterparty.id,
		                physicalSupplierCounterpartyId: seller.randUnique.split('-')[1]
		            };
                    $.each(ctrl.sellerOffers, (k, v) => {
                        $.each(v.products, (pk, pv) => {
                            var currentPackageId = null;
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
	    $rootScope.$on('initScreenAfterSendOrSkipRfq', (event, res) => {
            ctrl.initScreenAfterSendOrSkipRfq();
            groupOfRequestsModel.getBestTco(requestGroupProductIds, ctrl.groupId).then((data) => {
                ctrl.bestTcoData = data.payload;
                ctrl.bestTcoData = $scope.modelBestTCODataForTemplating(ctrl.bestTcoData);
                ctrl.mySelection = data.payload.mySelection.quotations;
                ctrl.mySelectionSurveyorCost = data.payload.mySelection.averageSurveyorCost;
            });
            $rootScope.shouldRefreshGroup = false;
	    });
        $rootScope.$on('isPhysicalSupplierMandatory', (event, res) => {
            ctrl.isPhysicalSupplierMandatory(res);
        });

        $rootScope.$on('supplierCardChangedData', (event, supplierCardData) => {
            console.log(supplierCardData);
            ctrl.initScreen();
            return false;
            $state.reload();
            $.each(supplierCardData, (scK, scV) => {
                $.each(scV.locations[0].products, (scProdK, scProdV) => {
                    var scProductId = scProdV.id;
                    var scSellerUniqueId = null;
                    var scRequestId = scV.id;
                    var scLocationUnique = scV.locations[0].uniqueLocationIdentifier;
                    if (scProdV.sellers.length > 0) {
                        if (scProdV.sellers[0].offers.length > 0) {
                            scSellerUniqueId = scProdV.sellers[0].randUnique;
                        }
                    }
                    $.each(ctrl.requests, (reqK, reqV) => {
                        if (reqV.id == scRequestId) {
                            $.each(reqV.locations, (locK, locV) => {
                                if (locV.uniqueLocationIdentifier == scLocationUnique) {
                                    $.each(locV.products, (prodK, prodV) => {
                                        if (prodV.id == scProductId) {
                                            if (prodV.sellers.length > 0) {
                                                $.each(prodV.sellers, (selK, selV) => {
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
        ctrl.stopCallback = function(event, ui, elem) {
            $.each(ctrl.compareLines, (k, v) => {
                ctrl.compareLines[k].droppable = true;
            });
        };
        ctrl.startCallback = function(event, ui, elem) {
            $.each(ctrl.compareLines, (k, v) => {
                ctrl.compareLines[k].droppable = true;
                $.each(v, (sk, sv) => {
                    if (sv.seller) {
                        if (sv == elem) {
                            console.log('exists');
                            ctrl.compareLines[k].droppable = false;
                        }
                    }
                });
            });
        };
        ctrl.dropCallback = function(event, ui) {
            event.target.innerHTML = ui.draggable.context.innerHTML;
            ctrl.draggableProducts = [];
            $.each(ctrl.compareLines, (k, v) => {
                $.each(v, (sk, sv) => {
                    if (sv.product) {
                        ctrl.draggableProducts.push(sv.product.id);
                    }
                    if (sv.products) {
                        $.each(sv.products, (pk, pv) => {
                            ctrl.draggableProducts.push(pv.product.id);
                        });
                    }
                });
                ctrl.compareLines[k].droppable = true;
            });
        };

        ctrl.canAmendRFQ = function() {
            let requirement;
            let isCorrect = true;
            for (let i = 0; i < ctrl.requirementRequestProductIds.length; i++) {
                requirement = ctrl.requirementRequestProductIds[i];
                if (typeof requirement.requestOfferId == 'undefined' || requirement.requestOfferId === null) {
                    isCorrect = false;
                    break;
                }
            }
            return isCorrect;
        };

        ctrl.canDrag = function(elem) {
            if (!ctrl.draggableProducts) {
                return true;
            }
            if (ctrl.compareLines.length <= 1) {
                return true;
            }
            if (elem.products) {
                var found = 0;
                $.each(elem.products, (k, v) => {
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
        ctrl.compareSelection = function() {
            var linesTco = [];
            var firstLineRefferenceProducts = [];
            $.each(ctrl.compareLines[0].first.products, (prodK, prodV) => {
                if (firstLineRefferenceProducts.indexOf(prodV.product.id) == -1) {
                    firstLineRefferenceProducts.push(prodV.product.id);
                }
            });
            $.each(ctrl.compareLines[0].second.products, (prodK, prodV) => {
                if (firstLineRefferenceProducts.indexOf(prodV.product.id) == -1) {
                    firstLineRefferenceProducts.push(prodV.product.id);
                }
            });
            $.each(ctrl.compareLines[0].third.products, (prodK, prodV) => {
                if (firstLineRefferenceProducts.indexOf(prodV.product.id) == -1) {
                    firstLineRefferenceProducts.push(prodV.product.id);
                }
            });
            $.each(ctrl.compareLines, (k, v) => {
                linesTco.push($filter('sumOfValueArray')(v, 'tco'));
            });
            ctrl.minTco = Math.min.apply(Math, linesTco);
        };
        ctrl.hasParam = function(param) {
            var found = false;
            if (ctrl.active_prod) {
			    if (ctrl.active_prod.products) {
			        $.each(ctrl.active_prod.products[0].specParameters, (k, v) => {
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

        /* TCO checkboxes*/
        ctrl.tcoHasPackageRequirements = function(pkgData) {
            var physicalSupplierId = null;
            var packageType;
            if (pkgData.isSurrogate) {
                packageType = 'buyer';
            } else {
                packageType = 'seller';
            }
            if (pkgData.physicalSupplier) {
                if (pkgData.physicalSupplier.id) {
                    physicalSupplierId = pkgData.physicalSupplier.id;
                }
            }
            var sellerRandUniquePkg = `${pkgData.seller.id }-${ physicalSupplierId }-${ packageType }-${ pkgData.packageId}`;
            pkgData.randUniquePkg = sellerRandUniquePkg;
            return ctrl.hasPackageRequirement(pkgData);
        };
        ctrl.createTcoSellerRequirementsForProductPackage = function(pkgData) {
            var  matchingPackageIdProducts = [];
            var locations = [];
            var currentSeller = null;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        if (prodV.sellers.length > 0) {
                            $.each(prodV.sellers, (selK, selV) => {
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
            $.each(matchingPackageIdProducts, (key, prodValue) => {
                ctrl.createSellerRequirementsForProduct(currentSeller, locations, prodValue);
            });
        };
        ctrl.hasTcoSellerProductRequirements = function(requestOfferId) {
            var sellerObj = null;
            var physicalSupplierId = null;
            var product = null;
            var locations = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        if (prodV.sellers.length > 0) {
                            $.each(prodV.sellers, (selK, selV) => {
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
        ctrl.createTcoSellerRequirementsForProduct = function(requestOfferId) {
            // seller, locations, productSample
            var seller = null;
            var product = null;
            var locations = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        if (prodV.sellers.length > 0) {
                            $.each(prodV.sellers, (selK, selV) => {
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
        ctrl.isSelectedBestTotalTco = function() {
            if (!ctrl.requirements) {
                return false;
            }
            if (ctrl.requirements.length == 0) {
                return false;
            }
            var bestTcoRequestOfferIdList = [];
            $.each(ctrl.bestTcoData.bestTotalTCO, (tcok, tcov) => {
                $.each(tcov.products, (pk, pv) => {
                    bestTcoRequestOfferIdList.push(pv.requestOfferId);
                });
            });
            if (bestTcoRequestOfferIdList.length > ctrl.requirements.length) {
                return false;
            }
            $.each(ctrl.requirements, (requirementK, requirementV) => {
                if (bestTcoRequestOfferIdList.indexOf(requirementV.requestOfferId) == -1) {
                    return false;
                }
            });
            return true;
        };
        ctrl.selectBestTotalTco = function() {
            var requestOfferIdList = [];
            $.each(ctrl.bestTcoData.bestTotalTCO, (tcok, tcov) => {
                $.each(tcov.products, (pk, pv) => {
                    requestOfferIdList.push(pv.requestOfferId);
                });
            });
            var isCheckSelected = angular.copy(ctrl.isSelectedBestTotalTco());
            if (!isCheckSelected) {
                for (var i = requestOfferIdList.length - 1; i >= 0; i--) {
                    requestOfferIdList[i];
                    $.each(ctrl.requirements, (k, v) => {
                        if (requestOfferIdList[i] == v.requestOfferId) {
                            requestOfferIdList.splice(i, 1);
                        }
                    });
                }
            }
            $.each(requestOfferIdList, (rk, requestOfferId) => {
                ctrl.createTcoSellerRequirementsForProduct(requestOfferId);
            });
        };
        ctrl.isSelectedMySelection = function() {
            if (!ctrl.requirements) {
                return false;
            }
            if (ctrl.requirements.length == 0) {
                return false;
            }
            var mySelectionRequestOfferIdList = [];
            $.each(ctrl.bestTcoData.mySelection.quotations, (msk, msv) => {
                // mySelectionRequestOfferIdList.push(msv.requestOfferId);
                $.each(msv.products, (pk, pv) => {
                    mySelectionRequestOfferIdList.push(pv.requestOfferId);
                });
            });
            if (mySelectionRequestOfferIdList.length > ctrl.requirements.length) {
                return false;
            }
            $.each(ctrl.requirements, (requirementK, requirementV) => {
                if (mySelectionRequestOfferIdList.indexOf(requirementV.requestOfferId) == -1) {
                    return false;
                }
            });
            return true;
        };
        ctrl.selectMySelection = function() {
            var requestOfferIdList = [];
            $.each(ctrl.bestTcoData.mySelection.quotations, (tcok, tcov) => {
                $.each(tcov.products, (pk, pv) => {
                    requestOfferIdList.push(pv.requestOfferId);
                });
            });
            var isCheckSelected = angular.copy(ctrl.isSelectedMySelection());
            if (!isCheckSelected) {
                for (var i = requestOfferIdList.length - 1; i >= 0; i--) {
                    requestOfferIdList[i];
                    $.each(ctrl.requirements, (k, v) => {
                        if (requestOfferIdList[i] == v.requestOfferId) {
                            requestOfferIdList.splice(i, 1);
                        }
                    });
                }
            }
            // debugger;
            $.each(requestOfferIdList, (rk, requestOfferId) => {
                ctrl.createTcoSellerRequirementsForProduct(requestOfferId);
            });
        };

        /* END TCO checkboxes*/
        ctrl.getPackageRequestIds = function(packageId) {
            var requestIds = [];
            $.each(ctrl.bestTcoData.bestPackages, (pk, pg) => {
                if (pg.packageId == packageId) {
                    $.each(pg.products, (prodK, prodV) => {
                        if (requestIds.indexOf(prodV.request.id) == -1) {
                            requestIds.push(prodV.request.id);
                        }
                    });
                }
            });
            return requestIds;
        };
        ctrl.getRequestComment = function(requestProducts, product, location, sellerCounterpartyId, seller) {
            var comments = '';
            var commentsCount = 0;
            $.each(requestProducts, (rk, rv) => {
                var productOffer = ctrl.getSellerProductOfferOnLocationRewrite(rv, location, sellerCounterpartyId, seller);
                if (productOffer) {
                    if (productOffer.offer) {
                        if (productOffer.offer.sellerComments) {
                            comments = productOffer.offer.sellerComments;
                        }
                        if (productOffer.offer.sellerComments) {
                            commentsCount = commentsCount + 1;
                        }
                    }
                }
            });
            if (commentsCount > 0) {
                return comments;
            }
            return false;
        };
        ctrl.calculate6MHistoryAverage = function() {
            console.log(ctrl);
            ctrl.show6MHistoryAverage = true;
        };
        $scope.modelBestTCODataForTemplating = function(bestTcoData) {
            ctrl.bestTotalTCOUniqueRequestsList = [];
            $.each(bestTcoData.bestTotalTCO, (btk, btv) => {
                btv.requestIdForGrouping = btv.products[0].request.id;
                if (ctrl.bestTotalTCOUniqueRequestsList.indexOf(btv.products[0].request.id) == -1) {
                    ctrl.bestTotalTCOUniqueRequestsList.push(btv.products[0].request.id);
                }
            });
            return bestTcoData;
        };
        ctrl.getTotalBestTCOForRequest = function(requestId) {
            var total = 0;
            $.each(ctrl.bestTcoData.bestTotalTCO, (btk, btv) => {
                if (btv.requestIdForGrouping == requestId) {
                    total = total + btv.tco;
                }
            });
            return total;
        };
        ctrl.getTotalMySelectionForRequest = function(requestId) {
            return false;
            var total = 0;
            $.each(ctrl.bestTcoData.mySelection.quotations, (msk, msv) => {
                if (msv.request.id == requestId) {
                    if (msv.amount) {
                        total = total + msv.amount;
                    }
                }
            });
            return total;
        };
        ctrl.getVesselByRequestId = function(requestId) {
            var vessel = null;
            $.each(ctrl.requests, (rk, rv) => {
                if (rv.id == requestId) {
                    vessel = rv.vesselDetails.vessel;
                }
            });
            return vessel;
        };
        $rootScope.$on('bladeDataChanged', (event, data) => {
            console.log();
            ctrl.confirmedBladeNavigation = true;
            $scope.bladeDataChanged = data;
            ctrl.viewSupplierCardBlade(ctrl.blade.counterpartyActiveSeller, ctrl.blade.counterpartyActiveLocation, null, null);
        });
        $rootScope.$on('confirmedBladeNavigation', (event, data) => {
	        ctrl.confirmedBladeNavigation = true;
        });

        // timer for validity count
        ctrl.timerCount = 0;
        ctrl.validityArray = [];
        ctrl.validityArray[ctrl.timerCount] = null;
        ctrl.getOfferPaymentTerm = function(seller) {
            var paymentTerm = null;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (sellerK, sellerV) => {
                            if (seller.id == sellerV.id) {
                                if (typeof sellerV.offers != 'undefined') {
                                    if (sellerV.offers.length > 0) {
                                        $.each(sellerV.offers, (ofk, ofv) => {
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
        ctrl.countdown = function(time) {
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
        $scope.showHideSections = function(obj) {
            if (obj.length > 0) {
                ctrl.visible_sections_old = ctrl.visible_sections;
            } else if (typeof ctrl.visible_sections_old != 'undefined') {
                ctrl.visible_sections = ctrl.visible_sections_old;
                $('select#multiple').selectpicker('val', ctrl.visible_sections_old[0]);
                $('select#multiple').selectpicker('render');
            }
        };
        jQuery(document).on('focus', 'input[type=\'number\']', () => {
            var input = $('input[type="number"]');
            window.addEventListener('mousewheel', (evt) => {
                if ($(evt.target).prop('tagName') == 'INPUT') {
                    evt.preventDefault();
                } else {
                    return true;
                }
            });
        });
        jQuery(document).on('blur', 'input[type=\'number\']', () => {
            var input = $('input[type="number"]');
            window.addEventListener('mousewheel', (evt) => {
                return true;
            });
        });
        ctrl.checkisNaN = function(oldVal, newVal) {
            if (isNaN(newVal)) {
                if (isNaN(oldVal)) {
                    return null;
                }
                return oldVal;
            }
            return false;
        };
        ctrl.getMarketPricePopup = function(product, locations) {
            data = {};
            let theLocation;
            for (let i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    theLocation = locations[i];
                    break;
                }
            }
            if (!theLocation) {
                return 0;
            }
            var productList = [];
            $.each(theLocation.products, (k, v) => {
                if (v.product.id == product.product.id) {
                    product = v;
                }
            });
            var popupHtml = '';
            if (product.quoteName) {
                popupHtml = `${product.quoteName }<br>Quote Date: ${ $filter('date')(product.quoteDate, 'dd/MM/yyyy')}`;
            }
            return popupHtml;
        };
        ctrl.formatDate = function(elem, dateFormat) {
            if (elem) {
                var formattedDate = elem;
                var dateFormat = ctrl.tenantSetting.tenantFormats.dateFormat.name;
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
        };
        ctrl.getMarketPriceData = function(product, locations) {
            data = {};
            let theLocation;
            for (let i = 0; i < locations.length; i++) {
                if (locations[i].requestId === product.requestId) {
                    theLocation = locations[i];
                    break;
                }
            }
            if (!theLocation) {
                return 0;
            }
            var productList = [];
            $.each(theLocation.products, (k, v) => {
                if (v.product.id == product.product.id) {
                    product = v;
                }
            }); 
            let LocationId,ProductId;
            let payload={
            	payload:[{LocationId:theLocation.location.id,ProductId:product.product.id}]
            }
            $scope.marketPriceHistoryList=[];
            $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/rfq/getPriceByLocationAndProduct`, payload).then((response) => {
                if (response) {
                    if (response.data) {
						$scope.marketPriceHistoryList=[];
						$scope.marketPriceHistoryList=response.data.payload;
                        setTimeout(()=>{
                        	$scope.adjustMarketPricePopupPosition();
                        })
                    }
                } else {
                    ctrl.hasAccess = false;
                }
            });  
        }

        $scope.adjustMarketPricePopupPosition = () => {
        	var popupElement = $(".marketPriceHistoryListPopup:visible");
        	if (popupElement.length > 0) {
	        	var triggerElement = $(popupElement).parent().children(".dropdown-toggle");
	        	var triggerElementOffsetTop = $(triggerElement).offset().top - window.scrollY;
	        	var triggerElementOffsetLeft = $(triggerElement).offset().left;
	        	$(popupElement).css("top", triggerElementOffsetTop);
	        	$(popupElement).css("left", triggerElementOffsetLeft);
	        	$(popupElement).css("z-index", "100");
	        	$(popupElement).css("position", "fixed");
	        	$(popupElement).css("transform", "translate(-90% , 10px)");
        	}
        }

        $(window).on("scroll", ()=> {
        	$scope.adjustMarketPricePopupPosition();
        })
		$('.marketPriceHistoryListPopup').on('hide.bs.dropdown', function () {
		   console.log("dropdown closed");
		});


        ctrl.openContactCounterpartyModal = function(seller, theLocation) {
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
            ctrl.getContactListForSeller(seller, (data) => {
	            ctrl.OptionsContactCounterpartyModal = data;
                var tpl = $templateCache.get('components/sellers-dialog/views/contactCounterpartyModal.html');
	            ctrl.activeSellerForContactCounterparty = seller;
	            ctrl.activeLocationForContactCounterparty = theLocation;
	            $scope.modalInstance = $uibModal.open({
	                template: tpl,
	                appendTo: angular.element(document.getElementsByClassName('page-container')),
	                size: 'full',
	                windowTopClass: 'fullWidthModal',
	                scope: $scope // passed current scope to the modal
	            });
            });
        };
        ctrl.confirmContactCounterpartySelection = function(selectedItem) {
            if (!selectedItem) {
                toastr.error('Please select one Contact');
                return false;
            }
            ctrl.updateContactForSellers(ctrl.activeSellerForContactCounterparty, selectedItem, ctrl.activeLocationForContactCounterparty);
            ctrl.activeSellerForContactCounterparty = null;
            ctrl.activeLocationForContactCounterparty = null;
            ctrl.prettyCloseModal();
        };
        ctrl.prettyCloseModal = function() {
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
        ctrl.sellerHasBroker = function(seller, theLocation) {
            if (!ctrl.fieldVisibility.isBrokerMandatory) {
                return true;
            }
            var hasBroker = false;
            var randUniquePkg = seller.randUniquePkg;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    if (theLocation.uniqueLocationIdentifier == locV.uniqueLocationIdentifier) {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
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
        ctrl.sellerHasPhysicalSupplier = function(seller, theLocation) {
            if (!ctrl.fieldVisibility.isPhysicalSupplierMandatory) {
                return true;
            }
            var hasSupplier = false;
            randUniquePkg = seller.randUniquePkg;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    if (theLocation.uniqueLocationIdentifier == locV.uniqueLocationIdentifier) {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
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
        ctrl.sellerHasContact = function(seller, theLocation) {
            if (!ctrl.fieldVisibility.isSellerContactMandatory) {
                return true;
            }
            var hasContact = false;
            randUniquePkg = seller.randUniquePkg;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    if (theLocation.uniqueLocationIdentifier == locV.uniqueLocationIdentifier) {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
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
        ctrl.openSellerInterstedModal = function(seller, theLocation) {
            // ctrl.OptionsContactCounterpartyModal = ctrl.sellerContactList['s'+seller.id]
            var tpl = $templateCache.get('pages/group-of-requests/views/not-interested-modal.html');
            ctrl.notInterstedModalActiveData = {
                seller: seller,
                location: theLocation,
                sellerNotInterested: angular.copy(seller.isNotInterested)
            };
            // ctrl.activeLocationForContactCounterparty = location;
            $scope.modalInstance = $uibModal.open({
                template: tpl,
                appendTo: angular.element(document.getElementsByClassName('page-container')),
                size: 'full',
                windowTopClass: 'fullWidthModal smallModal',
                scope: $scope // passed current scope to the modal
            });
        };
        ctrl.saveNotInterestedModal = function() {
            var activeRandUniquePkg = ctrl.notInterstedModalActiveData.seller.randUniquePkg;
            var requestSellerIds = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (selK, selV) => {
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
            var data = {
                Filters: [
                    {
                        ColumnName: 'RequestSellerId',
                        Value: requestSellerIds.join(',')
                    },
                    {
                        ColumnName: 'Comments',
                        Value: ctrl.notInterstedModalActiveData.seller.notInterestedComments
                    },
                    {
                        ColumnName: 'NotInterested',
                        Value: ctrl.notInterstedModalActiveData.sellerNotInterested
                    }
                ]
            };
            // if (ctrl.notInterstedModalActiveData.sellerNotInterested && !ctrl.notInterstedModalActiveData.seller.notInterestedComments) {
            //  toastr.error("Comment is mandatory");
            //  return false;
            // }
            groupOfRequestsModel.sellerNotInterested(data).then((response) => {
                if (response.isSuccess) {
                    $.each(ctrl.notInterstedModalActiveData.location, (locK, locV) => {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
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
        ctrl.getIncoterm = function(request, theLocation, seller, incoterm) {
            // incotermHasSellers = 0;
            var baseIncoterm = {
                hasSellerOffer: 0,
                incoterm: null
            };
            $.each(ctrl.requests, (k, v) => {
                if (v.id == request) {
                    $.each(v.locations, (kl, vl) => {
                        if (vl.uniqueLocationIdentifier == theLocation[0].uniqueLocationIdentifier) {
                            $.each(vl.products, (pk, pv) => {
                                if (pv.sellers.length > 0) {
                                    $.each(pv.sellers, (sk, sv) => {
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
                                                            $.each(sv.offers, (ok, ov) => {
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
        ctrl.updateIncoterm = function(incoterm, theLocation, seller, request) {
            // requestOfferIds = ctrl.returnLocationReqOffIds(location, seller.randUniquePkg);
            var requestOfferIds = [];
            $.each(ctrl.requests, (reqK, reqV) => {
                if (reqV.id == request) {
                    $.each(reqV.locations, (locK, locV) => {
                        $.each(locV.products, (prodK, prodV) => {
                            $.each(prodV.sellers, (sellerK, sellerV) => {
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
            var data = {
                RequestOfferIds: requestOfferIds,
                IncotermId: incoterm.id
            };
            if (typeof data.RequestOfferIds[0] != 'undefined') {
                groupOfRequestsModel.updateIncoterm(data).then((response) => {
                    if (response.isSuccess) {
                        ctrl.getIncoterm(request, theLocation, seller, incoterm);
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

        ctrl.calculateFirsRowColSpan = function() {
            var colspan = 7;
            if(ctrl.allExpanded) {
                colspan = 18;
                if(ctrl.counterpartyCommentsVisibility !== 1) {
                    colspan = colspan - 1;
                }
                if(ctrl.sellerHistoryVisibility !== 1) {
                    colspan = colspan - 10;
                }
            }
            return colspan;
        };

        ctrl.checkIfGroupHasRFQ = function() {
            var groupHasRFQ = false;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (selK, selV) => {
                            if (selV.offers) {
                                if (selV.offers.length > 0) {
                                    $.each(selV.offers, (ofK, ofV) => {
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

        ctrl.checkIfSellerHasRFQ = function(sellerRandUnique, theLocation) {
            var availableProductsPerLocation = 0, uniqueLocationIdentifier;
            if (theLocation.length > 0) {
                uniqueLocationIdentifier = theLocation[0].uniqueLocationIdentifier;
            } else {
                uniqueLocationIdentifier = theLocation.uniqueLocationIdentifier;
            }
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                    if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
                        availableProductsPerLocation = availableProductsPerLocation + locV.products.length;
                    }
                });
            });
            var totalOffersRFQsNo = 0;
            var totalSkipped = 0;
            $.each(ctrl.requests, (reqK, reqV) => {
                $.each(reqV.locations, (locK, locV) => {
                	if (locV.uniqueLocationIdentifier == uniqueLocationIdentifier) {
	                    $.each(locV.products, (prodK, prodV) => {
	                        $.each(prodV.sellers, (selK, selV) => {
	                            if (selV.randUniquePkg == sellerRandUnique) {
	                                if (selV.offers) {
	                                    if (selV.offers.length > 0) {
	                                        $.each(selV.offers, (ofK, ofV) => {
	                                            if (ofV.id) {
		                                            if (ofV.rfq) {
		                                                totalOffersRFQsNo = totalOffersRFQsNo + 1;
		                                            }
		                                            if (!ofV.rfq) {
		                                                totalSkipped = totalSkipped + 1;
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

            if (sellerRandUnique.indexOf('-individual-') == -1) {
                return 'font-green-jungle';
            } // because is package

            if (totalOffersRFQsNo && !totalSkipped) {
                return 'font-green-jungle';
            }
            if (totalSkipped) {
                return 'font-grey-salsa';
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

        ctrl.shouldDisplayCounterpartyTypeFilter = function(counterpartyTypeId) {
            if (!ctrl.counterpartyTypeFilters) {
                return false;
            }
            var shouldDisplay = false;
            $.each(ctrl.counterpartyTypeFilters, (k, v) => {
                if (counterpartyTypeId == v.id) {
                    shouldDisplay = true;
                }
            });
            if (shouldDisplay && counterpartyTypeId == 1) {
                if (typeof ctrl.sellerTypeCheckboxes.Supplier == 'undefined') {
                    ctrl.sellerTypeCheckboxes.Supplier = true;
                }
            }
            if (shouldDisplay && counterpartyTypeId == 2) {
                if (typeof ctrl.sellerTypeCheckboxes.Seller == 'undefined') {
                    ctrl.sellerTypeCheckboxes.Seller = true;
                }
            }
            if (shouldDisplay && counterpartyTypeId == 3) {
                if (typeof ctrl.sellerTypeCheckboxes.Broker == 'undefined') {
                    ctrl.sellerTypeCheckboxes.Broker = true;
                }
            }
            if (shouldDisplay && counterpartyTypeId == 11) {
                if (typeof ctrl.sellerTypeCheckboxes.Sludge == 'undefined') {
                    ctrl.sellerTypeCheckboxes.Sludge = true;
                }
            }
            return shouldDisplay;
        };
        ctrl.checkedSellerTypesSelected = function() {
            if (!ctrl.sellerTypeCheckboxes.Supplier && !ctrl.sellerTypeCheckboxes.Seller && !ctrl.sellerTypeCheckboxes.Broker && !ctrl.sellerTypeCheckboxes.Sludge) {
                return false;
            }
            return true;
        };
        ctrl.selectAllCounterpartyTypeFilters = function(value) {
            if (value) {
                ctrl.sellerTypeCheckboxes.Supplier = true;
                ctrl.sellerTypeCheckboxes.Seller = true;
                ctrl.sellerTypeCheckboxes.Broker = true;
                ctrl.sellerTypeCheckboxes.Sludge = true;
            } else {
                ctrl.sellerTypeCheckboxes.Supplier = false;
                ctrl.sellerTypeCheckboxes.Seller = false;
                ctrl.sellerTypeCheckboxes.Broker = false;
                ctrl.sellerTypeCheckboxes.Sludge = false;
            }
            ctrl.changeSellerTypes();
        };
        ctrl.checkIfIsPrefferedProductForSeller = function(productId, seller) {
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
        ctrl.setDefaultNoOfSellers = function() {
            $.each(ctrl.listsCache.ItemsToDisplay, (key, val) => {
                // debugger;

                if (val.name == ctrl.noOfCounterpartiesToDisplay) {
                    ctrl.displayNoOfSellers = val;
                }
            });
        };
        $rootScope.$on('sendEmailRFQ', (e, data) => {
        	if (!$rootScope.onSendEmailRFQDoneGOR) {
	        	ctrl.confirmedBladeNavigation = true;
		        	$rootScope.onSendEmailRFQDoneGOR = true;
		        	ctrl.requirements = data;
		            ctrl.sendRFQ(true);
        	}
        	setTimeout(() => {
                $rootScope.onSendEmailRFQDoneGOR = false;
        	}, 2000);
        });


        $rootScope.$on('reloadGroupPreviewRFQ', (e, data) => {
        	ctrl.refreshedRFQEmailBlade = false;
        	setTimeout(() => {
        		ctrl.refreshedRFQEmailBlade = true;
        		$scope.$apply();
        	}, 10);
        });

        ctrl.stripDecimals = function(value) {
            return Math.round(value);
        };

        ctrl.goToNextPriceInput = function(event) {
            ctrl.nextPriceInput = null;
            var allPriceIndexes = [];
            $.each($('input.productOfferPrice'), function() {
                if ($(this).is(':enabled')) {
                    allPriceIndexes.push($(this).attr('productPriceIndexNo'));
                }
            });
            var currentPriceIndex = $(event.currentTarget).attr('productPriceIndexNo');
            var currentPriceIndexInArray = allPriceIndexes.indexOf(currentPriceIndex);
            var nextItemIndex;
            if (currentPriceIndexInArray == allPriceIndexes.length - 1) {
                nextItemIndex = allPriceIndexes[0];
            } else {
                nextItemIndex = allPriceIndexes[currentPriceIndexInArray + 1];
            }
            if (event.keyCode == 9) {
                ctrl.nextPriceInput = nextItemIndex;
            }
            if (ctrl.nextPriceInput) {
            	setTimeout(() => {
                	$(`[productPriceIndexNo=${ctrl.nextPriceInput}]`).click();
                	$(`[productPriceIndexNo=${ctrl.nextPriceInput}]`).focus();
            	}, 100);
            }
        };

        $scope.$on('dataListModal', (e, a) => {
            // on-request-select="ctrl.selectRequest(request)"
            if (typeof a.elem != 'undefined') {
                if (typeof a.val != 'undefined') {
                    if (a.elem[a.elem.length - 1] == 'request') {
                        var selectedReqeustsLists = [];
                    	$.each(a.val, (key, data) => {
	                    	selectedReqeustsLists.push(data);
                    	});
                        ctrl.selectRequest(selectedReqeustsLists);
                    }
                    if (a.elem[a.elem.length - 1] == 'seller') {
                        ctrl.addSellerToAllLocations(a.val.id, ctrl.locations);
                        // ctrl.onSupplierSelect(a.val.id);
                    }
                    if (a.elem[a.elem.length - 1].indexOf('counterparty') >= 0) {
                        ctrl.addSellerToLocations(a.val.id, ctrl.newSellerLocation);
                    }
                    if (a.elem[a.elem.length - 1] == 'physical_supplier') {
                        var locationSellers = ctrl.getSortedLocationSellers(ctrl.physicalSupplierUpdate.location);
                        var seller = locationSellers[ctrl.physicalSupplierUpdate.sellerKey];
                        if (typeof seller.offers[0] == 'undefined') {
                            seller.offers[0] = {
                                physicalSupplierCounterparty: a.val
                            };
                        } else {
                            seller.offers[0].physicalSupplierCounterparty = a.val;
                        }

                        ctrl.updatePhysicalSupplierForSellers(seller, seller.offers[0].physicalSupplierCounterparty, ctrl.physicalSupplierUpdate.location);
                    }
                    if (a.elem[a.elem.length - 1] == 'broker') {
                        var locationSellers = ctrl.getSortedLocationSellers(ctrl.brokerUpdate.location);
                        var seller = locationSellers[ctrl.brokerUpdate.sellerKey];
                        if (typeof seller.offers[0] == 'undefined') {
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

        ctrl.setPageTitle = function() {
            let vesselArr = [];
            let vesselList = '';
            $.each(ctrl.requests, (key, val) => {
                if(vesselArr.indexOf(val.vesselDetails.vessel.name) <= 0) {
                    vesselArr.push(val.vesselDetails.vessel.name);
                    vesselList = `${vesselList }${val.vesselDetails.vessel.name }, `;
                }
            });
            vesselList = vesselList.slice(0, -2);
            let title = '';

            if ($state.params.title) {
                title = $state.params.title;
            } else {
                title = $state.params.path[$state.params.path.length - 1].label;
            }

            title = `${title } - `;
            title = title + vesselList;
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            });
            // $rootScope.$emit('$changePageTitle', {
            //     title: title
            // })
        };

        ctrl.gorTableRendered = function(rowIdx, theLocation) {
            var locationsLength = 0;
            $.each($filter('groupBy')(ctrl.locations, 'uniqueLocationIdentifier'), (k, v) => {
                if (k) {
                    locationsLength = locationsLength + 1;
                }
            });
            console.log('hide loader from gorTableRendered', rowIdx, locationsLength);
        };

        ctrl.confirmNavigateBlade = function() {
            console.log(ctrl.changeBladeWidgetFunction);
            ctrl.confirmedBladeNavigation = true;
            eval(eval(ctrl.changeBladeWidgetFunction.function).apply(null, ctrl.changeBladeWidgetFunction.params));
        };

        $rootScope.$on('counterpartyBladeClosed', (e, d) => {
            if (d) {
                ctrl.prefferedSellerCheckbox = true;
                ctrl.requirements = [];
                ctrl.requirementRequestProductIds = [];
                ctrl.groupedSellersByLocation = null;
                ctrl.bladeOpened = false;
                ctrl.confirmedBladeNavigation = true;
                $scope.$apply();
                ctrl.recompileDefaultSellerChecks();
                // setTimeout(function(){
                // 	ctrl.prefferedSellerCheckbox = false;
                // 	$scope.$apply();
                // },500)
            }
        });

        $rootScope.$on('undoComments', function() {
            ctrl.undoComments();
        });

        ctrl.sendRequote = function() {
            if (!ctrl.requirements || ctrl.requirements.length <= 0) {
                toastr.error('You cannot Requote, as No RFQ is associated with Sellers Offer.');
                return;
            }
            let rfq_data = {
                Requirements: ctrl.requirements,
                QuoteByDate: ctrl.quoteByDate,
                QuoteByCurrencyId: ctrl.quoteByCurrency.id,
                QuoteByTimeZoneId: ctrl.quoteByTimezone.id,
                Comments: ctrl.internalComments
            };

            groupOfRequestsModel.requoteRFQ(rfq_data).then((response) => {
                ctrl.requirements = [];
            });
        };

        ctrl.checkIfCanSendNoQuote = function() {
            var hasNoQuotableSelected = false;
            var hasQuotableSelected = false;
            if (ctrl.requirements.length > 0) {
                hasQuotableSelected = true;
            }
            var selectedNoQuotableItems = [];
        	if (ctrl.selectedNoQuoteItems) {
                Object.keys(ctrl.selectedNoQuoteItems).forEach((key) => {
				    if (ctrl.selectedNoQuoteItems[key]) {
				    	selectedNoQuotableItems.push(key.split('nq')[1]);
                        hasNoQuotableSelected = true;
				    }
				    return;
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

        	if (hasNoQuotableSelected) {
                ctrl.sendNoQuoteButtonText = 'Enable Quote';
            }
        	if (hasQuotableSelected) {
                ctrl.sendNoQuoteButtonText = 'No Quote';
            }
        	if (!hasNoQuotableSelected && !hasQuotableSelected) {
                ctrl.sendNoQuoteButtonText = null;
            }
            var selectedQuotableItems = [];
        	$.each(ctrl.requirements, (reqKey, reqVal) => {
	        	selectedQuotableItems.push(reqVal.requestOfferId);
	        	if (!reqVal.requestOfferId) {
	        		ctrl.sendNoQuoteButtonText = null;
	        	}
        	});
        	var requestOfferIds;
        	if (hasNoQuotableSelected) {
                var noQuoteBool = false;
        		requestOfferIds = selectedNoQuotableItems;
        	} else {
        		noQuoteBool = true;
        		requestOfferIds = selectedQuotableItems;
        	}
        	var payload = {
        	 	Payload : {
        	 		RequestOfferIds : requestOfferIds,
        	 		NoQuote : noQuoteBool
        	 	}
        	 };
        	 ctrl.sendNoQuotePayload = payload;
        };
        ctrl.sendNoQuote = function() {
        	/** ************
        	RLS is request -location-seller unique combination
        	 ****************/

        	let validationDataAt_RLS_level = [];

        	console.log(ctrl.requirements);

            var sellerSupplierLocationsOfRequirements = [];
        	$.each(ctrl.requirements, (rk, rv) => {
                var sslCombined = `${rv.RequestId }-${ rv.SellerId }-${ rv.PhysicalSupplierCounterpartyId }-${ rv.RequestLocationId}`;
                sellerSupplierLocationsOfRequirements.push(sslCombined);
        	});

            $.each(ctrl.requests, (reqK, reqV) => {
                var currentRequest = reqV;
                $.each(reqV.locations, (locK, locV) => {
                    var currentLocation = locV;
                    $.each(locV.products, (prodK, prodV) => {
                        $.each(prodV.sellers, (selK, selV) => {
                            var currentSeller = selV;
                            $.each(selV.offers, (ofK, ofV) => {
                                if (ofV.id) {
                                    var currentPhysicalSupplierId = null;
                                	if (ofV.physicalSupplierCounterparty) {
	                                	currentPhysicalSupplierId = ofV.physicalSupplierCounterparty.id;
                                	}
                                    var currentRSSL = `${currentRequest.id }-${ currentSeller.sellerCounterparty.id }-${ currentPhysicalSupplierId }-${ currentLocation.id}`;
                        			if (typeof validationDataAt_RLS_level[currentRSSL] == 'undefined') {
                        				validationDataAt_RLS_level[currentRSSL] = {
								        	allWouldBeNoQuote : false,
								    		totalNoQuoteItems : 0,
								    		totalOffers : 0,
								    		hasAdditionalCostsAll : false,
								    		selectedItemsFromThis_RLS : 0,
								    		RLScombinationString : `request: ${ currentRequest.id }, location: ${ currentLocation.location.name } seller: ${ currentSeller.sellerCounterparty.name}`,
								    		hasAdditionalCostsForProduct : false,
                        				};
                        			}
                                	if (ctrl.sendNoQuotePayload.Payload.RequestOfferIds.indexOf(ofV.id.toString()) != -1 ||
                                		ctrl.sendNoQuotePayload.Payload.RequestOfferIds.indexOf(ofV.id) != -1) {
								    		validationDataAt_RLS_level[currentRSSL].selectedItemsFromThis_RLS++;

							            	$.each(currentRequest.offers, (ok, ov) => {
                                                var currentOffer = ov;
                                                var currentOfferRSSL = `${currentOffer.requestId }-${ currentOffer.sellerCounterpartyId }-${ currentOffer.physicalSupplierCounterpartyId }-${ currentOffer.requestLocationId}`;
							            		if (sellerSupplierLocationsOfRequirements.indexOf(currentOfferRSSL) != -1) {
								            		$.each(ov.additionalCosts, (ack, acv) => {
								            			if (!acv.isDeleted) {
												    		validationDataAt_RLS_level[currentRSSL].hasAdditionalCostsAll = true;
								            			}
								            		});
							            		}
							            	});
	            		            		$.each(ofV.additionalCosts, (ack, acv) => {
						            			if (!acv.isDeleted) {
										    		validationDataAt_RLS_level[currentRSSL].hasAdditionalCostsForProduct = true;
						            			}
						            		});
                                	}
						    		validationDataAt_RLS_level[currentRSSL].totalOffers++;
                                	if (ofV.hasNoQuote == true) {
						        		validationDataAt_RLS_level[currentRSSL].totalNoQuoteItems++;
                                	}
                                }
                            });
                        });
                    });
                });
            });


            var allWouldBeNoQuoteError = false;
        	Object.keys(validationDataAt_RLS_level).forEach((key) => {
                var value = validationDataAt_RLS_level[key];
	            if (ctrl.sendNoQuotePayload.Payload.NoQuote == true &&
	            	(value.totalNoQuoteItems + value.selectedItemsFromThis_RLS >= value.totalOffers && (value.hasAdditionalCostsForProduct || value.hasAdditionalCostsAll)) ||
	            		            	value.hasAdditionalCostsForProduct) {
                    var errorMessage = `For ${ value.RLScombinationString } are additional costs applied for selected items. Please remove them before sending No Quote`;
                    toastr.error(errorMessage);
                    console.log(errorMessage);
                    allWouldBeNoQuoteError = true;
	            }
            });

        	if (allWouldBeNoQuoteError) {
	            return;
        	}
            groupOfRequestsModel.switchHasNoQuote(ctrl.sendNoQuotePayload).then((response) => {
                ctrl.initScreenAfterSendOrSkipRfq();
	            groupOfRequestsModel.getBestTco(requestGroupProductIds, ctrl.groupId).then((data) => {
	                ctrl.bestTcoData = data.payload;
	                ctrl.bestTcoData = $scope.modelBestTCODataForTemplating(ctrl.bestTcoData);
                    ctrl.mySelection = data.payload.mySelection.quotations;
	                ctrl.mySelectionSurveyorCost = data.payload.mySelection.averageSurveyorCost;
	            });
            });
        };

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

            var width = `${100 / ($('.negotiationProductTh').length / $('.negotiationLocationRowGroup').length) }%`;
            return width;
        };

        ctrl.trustAsHtml = function(html) {
        	return $sce.trustAsHtml(html);
        };

        ctrl.groupLocationsByUniqueLocationIdentifier = function() {
        	ctrl.locationsGroupedByULI = $filter('groupBy')(ctrl.locations, 'uniqueLocationIdentifier');
        	if (typeof ctrl.recompileDefaultSellerChecks == 'function') {
	        	ctrl.recompileDefaultSellerChecks();
        	}
        };


        $scope.$watch('ctrl.requests', (newValue, oldValue) => {
        });
        $scope.$watch('ctrl.locations', (newValue, oldValue) => {
            ctrl.groupLocationsByUniqueLocationIdentifier();
        });
        $scope.$watch('ctrl.requirements', (newValue, oldValue) => {
        });


        ctrl.goToOrderForProduct = function(product) {
            var requestId = product.requestId;
            var productId = product.product.id;
            var foundOffers = [];
            $.each(ctrl.requests, (reqK, reqV) => {
            	if (requestId == reqV.id) {
	                $.each(reqV.locations, (locK, locV) => {
	                	var currentLocation = locV;
	                    $.each(locV.products, (prodK, prodV) => {
	                        if (productId == prodV.product.id) {
	                        	if (prodV.orderId) {
	                        		var data = {
	                        			eta : currentLocation.eta,
	                        			orderId : prodV.orderId
	                        		};
	                        		foundOffers.push(data);
	                        	}
	                        }
	                    });
	                });
            	}
            });
            if (foundOffers.length > 0) {
	            if (_.orderBy(foundOffers, 'eta', 'asc')[0]) {
                    var earliestEtaOrder = _.orderBy(foundOffers, 'eta', 'asc')[0].orderId;
	            	window.open(`/#/edit-order/${earliestEtaOrder}`, '_blank');
	            }
            }
            console.log(foundOffers);
        };
        ctrl.checkIfProductHasOrder = function(product) {
            var requestId = product.requestId;
            var productId = product.product.id;
            var foundOffers = [];
            $.each(ctrl.requests, (reqK, reqV) => {
            	if (requestId == reqV.id) {
	                $.each(reqV.locations, (locK, locV) => {
	                	var currentLocation = locV;
	                    $.each(locV.products, (prodK, prodV) => {
	                        if (productId == prodV.product.id) {
	                        	if (prodV.orderId) {
	                        		var data = {
	                        			eta : currentLocation.eta,
	                        			orderId : prodV.orderId
	                        		};
	                        		foundOffers.push(data);
	                        	}
	                        }
	                    });
	                });
            	}
            });
            if (foundOffers.length > 0) {
            	return true;
            }
        	return false;
        };

        ctrl.calculateTooltipPosition = function(event) {
            // var maxHeight = 175;
            // console.log($(event.target).parents("td").find(".groupOfRequestTableTooltip"));
        };
        ctrl.undoComments = function() {
            if (initialValueExternalComments != null) {
                ctrl.externalComments = initialValueExternalComments.replace(/<br\s?\/?>/g, '\n');
            } else {
                ctrl.externalComments = '';
            }
            if (initialValueInternalComments != null) {
                ctrl.internalComments = initialValueInternalComments.replace(/<br\s?\/?>/g, '\n');
            } else {
                ctrl.internalComments = '';
            }
        };

        // ctrl.scroll = function(value) {
        //    if (value == true) {
        //         $('.table').css('overflow-x', 'initial');
        //         return true;
        //    } else {
        //         $('.table').css('overflow-x', 'auto');
        //         return false;
        //    }
        // }
        ctrl.setWidth = function(element) {
            $(element).css('opacity', '0');
            setTimeout(() => {
                if ($(element).width() > 400) {
                    $(element).css('width', '380px');
                    $(element).css('white-space', 'initial');
                }
                $(element).css('opacity', '1');
            });
        }; 

        ctrl.getWidth = function(element) {
            $(element).css('opacity', '0');
            $(element).css('left', '-300px');
            if (!ctrl.allExpanded) {
                // $('#negotiation-table-fixed-container').css('overflow', 'initial');
            }
            setTimeout(() => {
                let elementWidth = $(element).width();
                if (elementWidth) {
                    $(element).css('left', -(elementWidth - 30));
                }
                $(element).css('opacity', '1');
            });
        };


        ctrl.setWidthTooltip = function(object) {
            let elements = $(event.target).parents('td').find('.groupOfRequestTableTooltip ');
            if (object.generalSellerStatus != '') {
                let generalSellerStatus = elements[0];
                ctrl.setWidth(generalSellerStatus);
            }
            if (object.generalSellerComment != '') {
                let generalSellerComments = elements[1];
                ctrl.setWidth(generalSellerComments);
            }
            if (object.portSellerStatus != '') {
                let portSellerStatus = elements[2];
                ctrl.setWidth(portSellerStatus);
            }
            if (object.portSellerComments != '') {
                let portSellerComments = elements[3];
                ctrl.setWidth(portSellerComments);
            }
        };
        ctrl.changeScroll = function() {
        	setTimeout(function(){
	            $('#negotiation-table-fixed-container').css('overflow', 'auto');
        	},500)
        };

        ctrl.keyPress = function() {
            $('#negotiation-table-fixed-container').css('overflow', 'initial');
        };
        $(document).on('click blur', (ev, suggestion) => {
        	if ($(ev.target).attr("uib-typeahead")) {
        		return false;
        	}
        	$('#negotiation-table-fixed-container').css('overflow', 'auto');
        });
        $(document).on('keyup', 'input[uib-typeahead]', (ev, suggestion) => {
        	if ($('[uib-typeahead-popup]').is(':visible')) {
        		if ($(ev.target).attr('typeahead-append-to') == 'body') {
                    $('[uib-typeahead-popup]').css('top', '');
                    $('[uib-typeahead-popup]').css('left', '');
                    var parentZoom = 1;
        			if ($('#negotiation-table-fixed-container').length > 0) {
	        			parentZoom = $('#negotiation-table-fixed-container').css('zoom');
        			}
                    var currentTargetTopPosition = $(ev.target).offset().top * parentZoom;
                    var currentTargetLeftPosition = $(ev.target).offset().left * parentZoom;
        			var currentTargetHeight = parseFloat($(ev.target).css('height'));
        			$('[uib-typeahead-popup]').css('top', currentTargetTopPosition + currentTargetHeight);
        			$('[uib-typeahead-popup]').css('left', currentTargetLeftPosition);
        		}
        	}
        });
    }
]);
angular.module('shiptech.pages').component('groupOfRequests', {
    templateUrl: 'pages/group-of-requests/views/group-of-requests-component.html',
    controller: 'GroupOfRequestsController',
    bindings : {
    	fillMedianSixMonth : '<'
    }
});
