angular.module('shiptech.components')
    .controller('OfferDetailsDialogController', ['$scope', '$element', '$attrs', '$filter', '$timeout', 'listsModel', 'lookupModel', 'uiApiModel', 
                'newRequestModel', 'groupOfRequestsModel', 'tenantService', 'MOCKUP_MAP', 'LOOKUP_MAP', 'LOOKUP_TYPE', 'COST_TYPE_IDS','COMPONENT_TYPE_IDS',
        function($scope, $element, $attrs, $filter, $timeout, listsModel, lookupModel, uiApiModel, newRequestModel, groupOfRequestsModel, tenantService,
                MOCKUP_MAP, LOOKUP_MAP, LOOKUP_TYPE, COST_TYPE_IDS, COMPONENT_TYPE_IDS) {
            
            $scope.forms = {};

            var ctrl = this;

            ctrl.COST_TYPE_UNIT_ID = 2;

            ctrl.lookupType = null;
            ctrl.lookupInput = null;
            ctrl.additionalCosts = [];
            ctrl.additionalCostApplicableFor = {};
            ctrl.additionalCostTotalAmountSums = {};
            ctrl.requestProduct = null;
            ctrl.requestLocation = null;
            ctrl.productTableNoQuoteCheckAll = false;

            tenantService.tenantSettings
                        .then(function(settings){
                            ctrl.numberPrecision = settings.payload.defaultValues;
                            ctrl.currency = settings.payload.tenantFormats.currency;
                        });

            ctrl.$onInit = function() {

                // Get the UI data.
                uiApiModel.get(MOCKUP_MAP['unrouted.offer-details-dialog'])
                            .then(function(data){
                                ctrl.ui = data;

                                //Normalize relevant data for use in the template.
                                ctrl.generalInformationFields = normalizeArrayToHash(ctrl.ui.generalInformation.fields, 'name');
                                ctrl.productFormFields = normalizeArrayToHash(ctrl.ui.product.fields, 'name');
                                ctrl.productColumns = normalizeArrayToHash(ctrl.ui.product.columns, 'name');
                                ctrl.additionalCostColumns = normalizeArrayToHash(ctrl.ui.additionalCost.columns, 'name');

                                // Get the business data.
                                listsModel.get()
                                            .then(function(data) {                                                
                                                ctrl.lists = data;
                                                
                                                lookupModel.getAdditionalCostTypes()
                                                    .then(function(data) {
                                                        ctrl.additionalCostTypes = normalizeArrayToHash(data.payload, 'id');
                                                    });
                                            });

                            });

            };         

            ctrl.$onChanges = function(changes) {
                if(!ctrl.args.product) {
                    return;
                }  

                ctrl.requestProduct = changes.args.currentValue.product;
                ctrl.requestLocation = changes.args.currentValue.location;

                groupOfRequestsModel.getOfferDetails(changes.args.currentValue.offer.id)
                .then(function(data) {
                    ctrl.data = data.payload;
                    
                    ctrl.location = ctrl.data.locations[0];
                    ctrl.globalAdditionalCosts = ctrl.data.offers[0].additionalCosts;
                    setProductPricingType();
                    addFirstAdditionalCost();

                    initNoQuoteCheckBoxAll(ctrl.location);

                    calculateProductsAmountField(ctrl.location);
                    for (var k = 0; k < ctrl.globalAdditionalCosts.length; k++) {

                        additionalCost = ctrl.globalAdditionalCosts[k];
                        addPriceUomChg(additionalCost, ctrl.location);
                    }
                    for (var i = 0; i < ctrl.location.products.length; i++) {
                        var prod = ctrl.location.products[i];
                        for (var k = 0; k < prod.sellers[0].offers[0].additionalCosts.length; k++) {
                            var ac = prod.sellers[0].offers[0].additionalCosts[k];
                            addPriceUomChg(ac, ctrl.location);
                        }
                    }

                    // Get the counterparty contacts to use in the Quoted by select control.
                    lookupModel.getCounterpartyContacts(ctrl.requestProduct.sellers[0].sellerCounterparty.id).then(function(data){
                        ctrl.counterpartyContacts = data.payload.contacts;
                    });
        			
                });
                
            };            

            ctrl.getAdditionalCosts = function() {
                var product,
                    additionalCost,
                    // Set result to th global additional costs array in the DTO,
                    // which contains the "All Products" additional costs.
                    result = ctrl.globalAdditionalCosts;                    

                ctrl.additionalCostApplicableFor = {};
                ctrl.additionalCostTotalAmountSums[ctrl.location.id] = 0;
                

                for(var k = 0; k < result.length; k++) {

                    additionalCost = result[k];

                    if(!additionalCost.fakeId) {
                        additionalCost.fakeId = -Date.now();
                    }
                    
                    // Save product model for "Applicable for", and calculate the maxQuantity
                    // based on it:
                    ctrl.additionalCostApplicableFor[additionalCost.fakeId] = null;
                    additionalCost.maxQuantity = sumProductMaxQuantities(ctrl.location.products);
                    // TODO: Get the quantityUom of the first product? Or is there a different business logic for this?
                    additionalCost.quantityUom = ctrl.location.products[0].quantityUom;

                    additionalCost = calculateAdditionalCostAmounts(additionalCost, null, ctrl.location);

                    if(!additionalCost.isDeleted) {
                        ctrl.additionalCostTotalAmountSums[ctrl.location.id] += additionalCost.totalAmount;    
                    }
                    
                }

                if (ctrl.location.products) {
                    for(var i = 0; i < ctrl.location.products.length; i++) {
                        product = ctrl.location.products[i];
                        if (product.sellers[0].offers[0].additionalCosts) {
                            for(var j = 0; j < product.sellers[0].offers[0].additionalCosts.length; j++) {                                
                                additionalCost = product.sellers[0].offers[0].additionalCosts[j];

                                if(!additionalCost.fakeId) {
                                    additionalCost.fakeId = -Date.now();
                                }
                                additionalCost.parentProductId = product.id;

                                ctrl.additionalCostApplicableFor[additionalCost.fakeId] = product;
                                additionalCost.maxQuantity = ctrl.location.products[i].maxQuantity;

                                additionalCost = calculateAdditionalCostAmounts(additionalCost, ctrl.location.products[i], ctrl.location);

                                if(!additionalCost.isDeleted) {
                                    ctrl.additionalCostTotalAmountSums[ctrl.location.id] += additionalCost.totalAmount;
                                }
                            }                        

                            result = result.concat(product.sellers[0].offers[0].additionalCosts);
                        }

                    }
                }

                result = $filter('filter')(result, {isDeleted: false});

                ctrl.additionalCosts = result;

                return result;
            };


            ctrl.setDialogType = function(type, input) {
                ctrl.lookupType = LOOKUP_MAP[type];
                ctrl.lookupInput = input;
            };


            ctrl.selectQuotedProduct = function(productId) {
                
                var product,
                    target;

                lookupModel.get(LOOKUP_TYPE.PRODUCTS, productId).then(function(server_data) {
                    product = server_data.payload;

                    // If there's a set lookupInput, it means we need
                    // to copy the lookup dialog selection into it.
                    if(ctrl.lookupInput) {
                        
                        target = ctrl.lookupInput.sellers[0].offers[0].quotedProduct;

                        target.name = product.name;
                        target.id = product.id;

                    }
                });

            };


            /**
            * Checks if the given additional cost belongs 
            * to the ProductComponent category.
            */
            function isProductComponent(additionalCost) {
                if(!additionalCost.additionalCost) {
                    return false;
                }

                return ctrl.additionalCostTypes[additionalCost.additionalCost.id].componentType.id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT; 
            }


            /**
            * Get the corresponding component type ID for a given additional cost.
            */
            function getAdditionalCostDefaultCostType(additionalCost) {
                if(!additionalCost.additionalCost) {
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
                for(var i = 0; i < location.products.length; i++) {
                    productUomChg(location.products[i]);
                }
            }


            function calculateProductAmount(product) {
                return +product.confirmedQtyPrice * +product.maxQuantity * +product.sellers[0].offers[0].price || 0;
            }

            function sumProductMaxQuantities(products) {
                var result = 0;

                for(var i = 0; i < products.length; i++) {
                    result += products[i].maxQuantity;
                }

                return result;
            }


            /**
            * Sum the Amount field of all products.
            */
            ctrl.sumProductAmounts = function(products) {
                var result = 0;

                for(var i = 0; i < products.length; i++) {
                    result += products[i].totalAmount;
                }
                return result;
            };


            /**
            * Get the grand total for a given location, that is the sum of product total and additional costs total.
            */ 
            ctrl.getGrandTotal = function(location) {
                return ctrl.sumProductAmounts(location.products) + (ctrl.additionalCostTotalAmountSums[location.id] || 0);
            };

            /**
            * Calculates the amount-related fields of an additional cost, as per FSD p. 169: Amount, Extras Amount, Total Amount.
            */
            function calculateAdditionalCostAmounts(additionalCost, product, location) {
                var totalAmount,
                    productComponent;

                if(!additionalCost.costType) {
                    return additionalCost;
                }

                switch(additionalCost.costType.id) {
                    case COST_TYPE_IDS.UNIT:
                        //additionalCost.amount = additionalCost.maxQuantity * additionalCost.price;
                        additionalCost.amount = 0;
                        if (additionalCost.priceUom && additionalCost.prodConv && additionalCost.prodConv.length == location.products.length)
                            for (var i = 0; i < location.products.length; i++) {
                                product = location.products[i];
                                if (additionalCost.isAllProductsCost || product.id == additionalCost.parentProductId)
                                    additionalCost.amount = additionalCost.amount + product.maxQuantity * additionalCost.prodConv[i] * additionalCost.price;
                            }
                    break;

                    case COST_TYPE_IDS.FLAT:
                        additionalCost.amount = additionalCost.price;
                    break;

                    case COST_TYPE_IDS.PERCENT:

                        productComponent = isProductComponent(additionalCost);

                        if(additionalCost.isAllProductsCost || !productComponent) {
                            totalAmount = ctrl.sumProductAmounts(location.products);
                        } else {
                            totalAmount = product.totalAmount;
                        }

                        if(productComponent) {
                            additionalCost.amount = totalAmount * additionalCost.price/100;
                        } else {
                            totalAmount += sumProductComponentAdditionalCostAmounts();
                            additionalCost.amount = totalAmount * additionalCost.price/100;
                        }
 
                    break;                    
                }

                additionalCost.extrasAmount = additionalCost.extras/100 * additionalCost.amount;

                additionalCost.totalAmount = additionalCost.amount + additionalCost.extrasAmount;
                additionalCost.rate = additionalCost.totalAmount / additionalCost.maxQuantity;
                
                return additionalCost;
            }
            

 /**
            * Sum the amounts of all additional costs that are NOT tax component additional costs.
            */
            function sumProductComponentAdditionalCostAmounts() {
                var result = 0;

                for(var i = 0; i < ctrl.additionalCosts.length; i++) {
                    if (isProductComponent(ctrl.additionalCosts[i]) || ctrl.additionalCosts[i].costType.id !== COST_TYPE_IDS.PERCENT) {
                        result += ctrl.additionalCosts[i].totalAmount;
                    }
                }

                return result;
            }

            /**
            * Gets a reference to a product in the request object.
            * @param {Object} product - A Product object.
            * @param {Object} location - The location object to scan.
            * @return {Object} The product object reference from the request object, if found.
            */
            function getRequestProductReference(product, location) {
                return $filter("filter")(location.products, { product : { id : product.product.id }})[0];
            }


            function getProductById(productId) {
                return $filter("filter")(ctrl.location.products, {id: productId})[0];
            }


            function findAdditionalCost(additionalCost, product) {
                var i,
                    j;

                for(i = 0; i < ctrl.globalAdditionalCosts.length; i++) {
                    if(additionalCost.fakeId === ctrl.globalAdditionalCosts[i].fakeId) {
                        return {container: ctrl.globalAdditionalCosts, index: i};
                    }
                }

                for(i = 0; i < ctrl.location.products.length; i++) {
                    for(j = 0; j < ctrl.location.products[i].sellers[0].offers[0].additionalCosts.length; j++) {
                        if(additionalCost.fakeId === ctrl.location.products[i].sellers[0].offers[0].additionalCosts[j].fakeId) {
                            return {container: ctrl.location.products[i].sellers[0].offers[0].additionalCosts, index: j};
                        }
                    }
                }

                return null;
            }


            function getAdditionalCostParentProduct(additionalCost) {

                return getProductById(additionalCost.parentProductId);

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
                    comment: "",
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
            * Moves the given additional cost object under the given product in the given location,
            * deleting it from the product it is currently under.
            * @param {Object} additionalCost - An additional cost object.
            * @param {Object} product - A product object, which is the target parent product.
            * @param {Object} location - The current location (under which all of this happens).
            */
            ctrl.applicableForChange = function(additionalCost, product, location) {
                
                // If "All" is selected, product will be undefined.
                // See: http://stackoverflow.com/questions/30604938/add-two-extra-options-to-a-select-list-with-ngoptions-on-it/30606388#30606388
                additionalCost.isAllProductsCost = !product;

                // Delete the additional cost from parent, which is either a product, or the "global" Additional Cost array.
                deleteAdditionalCost(additionalCost);

                // Add the additional cost to the new parent, be it a product or the "global" Additional Costs array.
                if(additionalCost.isAllProductsCost) {
                    additionalCost.parentProductId = -1;
                    ctrl.globalAdditionalCosts.push(additionalCost);
                } else {
                    additionalCost.parentProductId = product.id;
                    product.sellers[0].offers[0].additionalCosts.push(additionalCost);
                }
            };


            /**
            * Deletes the additional cost from its parent, which is either a product, or the "global" Additional Costs array.
            * @param {Object} additionalCost - The additional cost object to delete.
            * @param {Object} parentProduct - The parent product of the additional object. If null,
            *   the additional cost will be searched for/deleted from the "global" Additional Costs array.
            */
            function deleteAdditionalCost(additionalCost) {

                var parentData = findAdditionalCost(additionalCost);

                if(parentData) {
                    parentData.container.splice(parentData.index, 1);
                } else {
                    throw 'Attempting deletion of a non-existent additional cost: ' + JSON.stringify(additionalCost);
                }
            }

            function offerHasAdditionalCosts() {
                var additionalCosts = ctrl.getAdditionalCosts();
                return additionalCosts.length;
            }


            /**
            * Adds a first additional cost row in case there are none in the respective location.
            */
            function addFirstAdditionalCost() {

                for(var i = 0; i < ctrl.data.locations.length; i++) {
                    if(!offerHasAdditionalCosts()) {
                        ctrl.addAdditionalCost(ctrl.data.locations[i]);
                    }
                }
            }

            /**
            * changes pricing types to what the user has selected in the table outside the popup
            */
            function setProductPricingType() {
                for(var i = 0; i < ctrl.data.locations.length; i++) {
                    for(var j = 0; j < ctrl.data.locations[i].products.length; j++) {
                        ctrl.data.locations[i].products[j].pricingType = ctrl.requestProduct.pricingType;
                    }
                }
            }


            /**
            * Adds an Additional Cost to the first product in a location.
            * @param {Object} location - The location object containing the product.
            */
            ctrl.addAdditionalCost = function(location) {
                var newAdditionalCost = createNewAdditionalCostObject();
                location.products[0].sellers[0].offers[0].additionalCosts.push(newAdditionalCost);
            };


            ctrl.deleteAdditionalCost = function(additionalCost) {

                if(additionalCost.fakeIndex < 0) {
                    deleteAdditionalCost(additionalCost);

                } else {
                    // This object exists in the database. Mark it for deletion.
                    additionalCost.isDeleted = true;
                }

                // Add a new blank additional cost if there aren't any left.
                addFirstAdditionalCost();

            };


            ctrl.getAdditionalCostParentProductUom = function(additionalCost) {
                var parentProduct = getAdditionalCostParentProduct(additionalCost);

                // If the additional cost has no parent product, use the first product in location.
                if(!parentProduct) {
                    parentProduct = ctrl.location.products[0];
                }

                return parentProduct.uom;

            };
            ctrl.addPriceUomChanged = function (additionalCost, location) {
                addPriceUomChg(additionalCost, location);
            };
            function addPriceUomChg(additionalCost, location) {
                if (!additionalCost.priceUom)
                    return;
                additionalCost.prodConv = [];
                for (var i = 0; i < location.products.length; i++) {
                    prod = location.products[i];
                    if (prod.maxQuantity.id == additionalCost.priceUom.id) {
                        additionalCost.prodConv[i] = 1;
                    }
                    else
                        setConvertedAddCost(prod, additionalCost, i);

                }
            };
            function setConvertedAddCost(prod, additionalCost, i) {
                lookupModel.getConvertedUOM(prod.product.id, 1, prod.uom.id, additionalCost.priceUom.id).then(function (server_data) {
                    additionalCost.prodConv[i] = server_data.payload;
                })
                .catch(function (e) {
                    throw 'Unable to get the uom.';
                });
            }
            ctrl.productUomChanged = function (product) {
                productUomChg(product);
            };
            function productUomChg(product) {
                if (product.uom.id == product.sellers[0].offers[0].priceQuantityUom.id) {
                    product.confirmedQtyPrice = 1;
                    product.totalAmount = +product.confirmedQtyPrice * +product.maxQuantity * +product.sellers[0].offers[0].price;
                }
                else
                    lookupModel.getConvertedUOM(product.product.id, 1, product.uom.id, product.sellers[0].offers[0].priceQuantityUom.id).then(function (server_data) {
                        product.confirmedQtyPrice = server_data.payload;
                        product.totalAmount = +product.confirmedQtyPrice * +product.maxQuantity * +product.sellers[0].offers[0].price;
                    })
                    .catch(function (e) {
                        throw 'Unable to get the uom.';
                    });
            }


            function validateAdditionalCostsNonInputs(additionalCosts) {

                var compare,
                    nonFields = ['currency', 'priceUom'],
                    additionalCost;

                if(!additionalCosts) {
                    return null;
                }

                for(var i = 0; i < additionalCosts.length; i++) {
                    
                    for(var j = 0; j < nonFields.length; j++) {
                        
                        additionalCost = additionalCosts[i];
                        compare = additionalCosts[i][nonFields[j]];
                            
                        if(!compare || angular.equals({}, compare)) {

                            // Special cases:
                                // Ommit priceUom check if the cost type exists isn't "Unit".
                            if(nonFields[j] === 'priceUom' && additionalCost.costType && additionalCost.costType.id !== ctrl.COST_TYPE_UNIT_ID) {
                                continue;
                            }                            
                            return [nonFields[j]];
                        }
                    }
                }

                return null;
            }

            /**
            * Removes the empty Additional Costs from the DTO to avoid sending them to server.
            */
            function removeNullAdditionalCosts(additionalCosts) {
                var result = [];

                for(var i = 0; i < additionalCosts.length; i++) {
                    if(additionalCosts[i].additionalCost !== null){
                        result.push(additionalCosts[i]);
                    }
                }

                return result;
            }

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
            * Compiles the first offers from the first seller of all products;
            */
            function compileOffers() {
                var result = [];

                for(var i = 0; i < ctrl.location.products.length; i++) {
                    ctrl.location.products[i].sellers[0].offers[0].additionalCosts = removeNullAdditionalCosts(ctrl.location.products[i].sellers[0].offers[0].additionalCosts);
                    result.push(ctrl.location.products[i].sellers[0].offers[0]);
                }

                return result;
            }


            /**
            * Saves the changes in the offer and closes popup.
            */
            ctrl.saveOffer = function() {
                
                var additionalCosts = ctrl.getAdditionalCosts()
                    offers = compileOffers();

                additionalCosts = removeNullAdditionalCosts(additionalCosts);

                if(validateAdditionalCostsNonInputs(additionalCosts) !== null) {

                    addFirstAdditionalCost();
                    return false;

                }
                if (!$scope.forms.general.$valid) {
                    addFirstAdditionalCost();

                    ctrl.invalidFields = getInvalidFields($scope.forms.general);
                    return false;

                }

                if(!$scope.forms.products.$valid) {
                    addFirstAdditionalCost();
                    
                    ctrl.invalidFields = getInvalidFields($scope.forms.products);
                    return false;

                }

                if(!$scope.forms.additionalCosts.$valid) {
                    addFirstAdditionalCost();

                    ctrl.invalidFields = getInvalidFields($scope.forms.additionalCosts);
                    return false;

                }
                for (var i = 0; i < offers.length; i++) {
                    offers[i].contactCounterparty = offers[0].contactCounterparty;
                    offers[i].paymentTerm = offers[0].paymentTerm;
                    offers[i].physicalSupplierCounterparty = offers[0].physicalSupplierCounterparty;
                }
                groupOfRequestsModel.updateOfferDetails(
                                    ctrl.location.id,
                                    offers,
                                    ctrl.globalAdditionalCosts
                                )
                                .then(function(response){
                                    addFirstAdditionalCost();
                                    ctrl.onOfferSaved({ offer : response.payload[0], 
                                                    product : ctrl.requestProduct});
                                })
                                .catch(function(error){
                                    addFirstAdditionalCost();
                                });

                // $('#offer_details').modal('toggle');
                // ctrl.closeBlade();
                $bladeEntity.close();
            };

		


            ctrl.updateModel = function(model, value) {
                if(!model) {
                    model = {};
                }
                angular.copy(value, model);
            };


            ctrl.updateModelProperty = function(model, property, value) {
                model[property] = value;
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


            ctrl.productPriceChanged = function(product) {
                product.totalAmount = calculateProductAmount(product);
            };


            /**
            * Change the cost type to the default for the respective additional cost.
            */
            ctrl.additionalCostNameChanged = function(additionalCost) {
                additionalCost.costType = getAdditionalCostDefaultCostType(additionalCost);
            };


            /**
            * Determines whether the Additional Cost's Price UOM field should be enabled.
            * It should only be enabled when the Additional Cost's costType is "Unit" (business rule).
            */
            ctrl.additionalCostPriceUomEnabled = function(additionalCost) {
                return additionalCost.costType && additionalCost.costType.id === ctrl.COST_TYPE_UNIT_ID;
            };            

            ctrl.productTableNoQuoteCheckAllChanged = function(location, status) {
                for(var i = 0; i < location.products.length; i++) {
                    location.products[i].sellers[0].offers[0].hasNoQuote = status;
                }
            };

            ctrl.noQuoteChanged = function(location) {
                ctrl.productTableNoQuoteCheckAll = areAllProductsNoQuote(location);
            };

            /**
            * Check if all products in a location have the noQuote flag set to true;
            */
            function areAllProductsNoQuote(location) {
                for(var i = 0; i < location.products.length; i++) {
                    if(!location.products[i].sellers[0].offers[0].hasNoQuote) {
                        return false;
                    }
                }
                return true;
            }

            function initNoQuoteCheckBoxAll(location) {
                ctrl.productTableNoQuoteCheckAll = areAllProductsNoQuote(location);
            }

		    ctrl.closeBlade = function() {
		    	$('.bladeEntity').removeClass("open");
		    	$('body').css("overflow-y", "initial");
		    	setTimeout(function(){
			    	$rootScope.bladeTemplateUrl = '';
		    	},500);
		    }            

}]);


angular.module('shiptech.components').component('offerDetailsDialog', {
    templateUrl: 'components/offer-details-dialog/views/offer-details-dialog-component.html',
    controller: 'OfferDetailsDialogController',
    bindings: {
        args: '<',
        onOfferSaved: '&'
    }    
});