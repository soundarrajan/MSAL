angular.module("shiptech.pages").controller("SelectContractController", ["$window", "$scope", "$rootScope", "$element", "$attrs", "$timeout", "$filter", '$state', "listsModel", "uiApiModel", 'selectContractModel', 'orderModel', 'STATE', 'LOOKUP_TYPE',
    function($window, $scope,  $rootScope, $element, $attrs, $timeout, $filter, $state, listsModel, uiApiModel, selectContractModel, orderModel, STATE, LOOKUP_TYPE) {
        var ctrl = this;
        ctrl.STATE = STATE;
        // ctrl.contracts = [];
        ctrl.contractList = [];
        ctrl.checkboxes = [];
        ctrl.autocompleteContract = null;
        ctrl.requestId = $state.params.requestId ? $state.params.requestId : 1;
        ctrl.contractId = $state.params.contractId ? $state.params.contractId : null;
        ctrl.requestScreen = $state.current.name == 'default.edit-request' ? true : false;
        ctrl.lookupType = null;
        ctrl.selectedRow = null;
        $state.params.title = $state.params.title + " " + ctrl.requestId;
        ctrl.tableOptions = {};
        ctrl.tableOptions.pageLength = 10;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.showAllContracts = false;
        ctrl.productTabs = [];
        ctrl.isRequest = true;

        ctrl.$onInit = function(){
            // debugger;
            if(localStorage.getItem('displayAllContracts') != null){
                ctrl.allContracts = localStorage.getItem('displayAllContracts');
                localStorage.removeItem('displayAllContracts');
            }else{
                ctrl.allContracts = false;
            }
        }

        ctrl.gotoContractEvaluation = function() {
            //contract Id is 0 in order to get all contracts
            var contractId = 0;
            $state.go(STATE.CONTRACT_EVALUATION, {
                contractId: contractId,
                requestId: ctrl.requestId
            });
        };
    
        ctrl.setDialogTypeContract = function() {
            ctrl.lookupType = LOOKUP_TYPE.CONTRACT;
        };
        ctrl.contractIsInRequestProducts = function(contract) {
            isInContract = false
            $.each(ctrl.productsContractIds, function(pciK, pciV) {
                if (contract.contract.id == pciV.contractId && contract.requestProductId == pciV.requestProductId) {
                    isInContract = true
                }
            })
            return isInContract
        }
      
        // ctrl.selectContract = function(contractId) {
        //     ctrl.autocompleteContract = null;
        //     selectContractModel.getRequestContract(ctrl.requestId, contractId).then(function(data) {
        //         if (data.payload !== null) {
        //             ctrl.contracts.push(data.payload);
        //             ctrl.products = getContractsProducts(ctrl.contracts);
        //         }
        //     });
        // };

        function getContractsProducts(contractList) {
            var products = [];
      
            $.each(contractList, function(key, val) {
                if (Array.isArray(val.product)) {
                    $.each(val.contract, function(key2, val2) {
                        products = addProductToSet(val2, products);
                    })
                } else {
                    products = addProductToSet(val.product, products)
                }
            })
            return products;
        }

        function addProductToSet(product, set) {
            found = false;
            $.each(set, function(key, val) {
                if (val.id == product.id) found = true;
            })
            if (!found) set.push(product);
            return set;
        }
        
        ctrl.selectDefaultContracts = function() {
            ctrl.checkboxes = [];
            ctrl.selectedRows = [];
            $.each(ctrl.defaultSelectedContracts, function(dsck, dscv) {
                $.each(ctrl.contracts, function(ctrk, ctrv) {
                    if (ctrv.contract.id == dscv) {
                        ctrl.checkboxes[ctrv.contract.id + '_' + ctrv.requestProductId] = true;
                        ctrl.selectedRows.push(ctrv);
                    }
                })
            })
            if (ctrl.selectedRows.length == 1) {}
            $scope.$emit('selectedContracts', ctrl.selectedRows);
        }
        
        selectContractModel.getContractsAutocomplete().then(function(data) {
            ctrl.contractList = data.payload;
        });



        // --------------------------------------------- betty 25.07
        // ctrl.initContractTable = function(pagination) {
        //     if (!pagination) {
        //         pagination = {};
        //         pagination.start = 0;
        //         pagination.length = ctrl.tableEntries;
        //     }
        //     selectContractModel.getBestContract(ctrl.requestId, pagination).then(function(data) {
        //         processData(data);
        //         ctrl.selectDefaultContracts();
        //     });
        // }
        // --------------------------------------------- betty 25.07
        // ctrl.initContractTable()
        // ctrl.displayAllContracts = function(pagination) {
        //     if (!pagination) {
        //         pagination = {};
        //         pagination.start = 0;
        //         pagination.length = ctrl.tableEntries;
        //     }
        //     selectContractModel.getAllContract(ctrl.requestId, pagination).then(function(data) {
        //         processData(data, true)
        //     });
        // };

        ctrl.displayAllContracts = function(){
            // debugger;
            ctrl.allContracts = true;


            // localStorage.setItem('displayAllContracts', true);

            // $state.reload();
        }

        $rootScope.$on("gridDataDone", function(data,res) {
        	setTimeout(function(){
	        	$rootScope.$broadcast('best_contracts_checkbox', $rootScope.defaultSelectedBestContracts);
        	})
    //     	setTimeout(function(){
	   //          $scope.resetTreasuryCheckboxes();
	   //          vm.lastCallTableParams = res;
				// // vm.cpCtr = [];
    //     	},500)
        });

        $rootScope.$on('best_contracts_checkbox', function(e,arg){

            ctrl.checkboxes = []; //reinit array
            anyChecked = _.reduce(arg, function(all, val, key){
                if(typeof val != 'undefined'){
                    if(val.isChecked){
                        all = all || val.isChecked; // count true
                        ctrl.checkboxes[key] = true; //set checkboxes here
                    }
                }
                return all;
            }, false);

            if(anyChecked){
                ctrl.showProceedButton(); // if any true, show btn
            }else{
                ctrl.showProceedButton(false); // if any true, show btn
            }

        })
        // --------------------------------------------- betty 25.07
        // processData = function(data, all) {
        //     ctrl.contracts = data.payload;
        //     result = ctrl.contracts.length;
        //     page = 1;
        //     ctrl.entries = result
        //     skip = ctrl.entries * (page - 1);
        //     ctrl.matchedCount = data.matchedCount;
        //     ctrl.currentPage = page;
        //     ctrl.maxPages = Math.ceil(ctrl.matchedCount / ctrl.entries);
        //     if (all) {
        //         ctrl.showAllContracts = true;
        //     }
        // }
        // ctrl.getNotificationsListPage = function(currentPage, direction) {
        //     if (direction == 'next') {
        //         newPage = currentPage + 1;
        //         ctrl.changePage(currentPage);
        //     }
        //     if (direction == 'prev') {
        //         newPage = currentPage - 1;
        //         ctrl.changePage(newPage);
        //     }
        // }
        // ctrl.changePage = function(newPage) {
        //     pagination = {};
        //     pagination.start = newPage * ctrl.tableEntries;
        //     pagination.length = ctrl.tableEntries;
        //     if (ctrl.showAllContracts) {
        //         ctrl.displayAllContracts(pagination)
        //     } else {
        //         ctrl.initContractTable(pagination)
        //     }
        // }



        ctrl.confirmContractSelection = function() {
            ctrl.buttonsDisabled = true;
            requestProductIds = [];
            contractProductIds = [];
            contractIds = [];
            errors = 0;
            console.log(ctrl.selectedContracts)
            $.each(ctrl.selectedContracts, function(ck, cv) {
                if (cv.requestProductId) {
                    if (requestProductIds.indexOf(cv.requestProductId) > -1) {
                        errors++;
                        toastr.error('For Product ' + cv.product.name + ' you selected multiple Contract to be confirmed. Please select only one Contract per Product from Request.');
                    }
                    contractIds.push(cv.contract.id);
                    contractProductIds.push(cv.contractProductId);
                    requestProductIds.push(cv.requestProductId);
                }
            })
            if (errors == 0) {
                orderModel.getExistingOrders(requestProductIds.join(',')).then(function(responseData) {
                    ctrl.buttonsDisabled = false;
                    responseOrderData = responseData.payload
                    if (responseOrderData.length == 0) {
                        $('#confirm').modal('show');
                        responseOrders = null;
                    } else {
                        selectedProductsRequestLocationIds = []
                        $.each(ctrl.request.locations, function(locK, locV) {
                            $.each(locV.products, function(prodK, prodV) {
                                $.each(requestProductIds, function(pk, pv) {
                                    if (pv == prodV.id) {
                                        if (selectedProductsRequestLocationIds.indexOf(locV.id) == -1) {
                                            selectedProductsRequestLocationIds.push(locV.id);
                                        }
                                    }
                                })
                            })
                        })
                        responseOrders = [];
                        $.each(responseOrderData, function(rdk, rdv) {
                            if (selectedProductsRequestLocationIds.indexOf(rdv.requestLocationId) != -1) {
                                responseOrders.push(rdv);
                            }
                        })
                        // selectedContracts, selectedProducts, orderFromResponse
                        hasError = false;
                        errorMessages = [];
                        errorType = [];
                        if (responseOrders.length > 0) {
                            if (ctrl.selectedContracts[0].currency.id != responseOrders[0].products[0].currency.id) {
                                hasError = true;
                                errorType.push("Currency")
                            }
                            // 259200000 is 3 days in miliseconds
                            if (new Date($scope.getProductLocationETAByRequestProductId(requestProductIds[0])) - new Date(responseOrders[0].orderEta) > 259200000 || new Date($scope.getProductLocationETAByRequestProductId(requestProductIds[0])) - new Date(responseOrders[0].orderEta) < -259200000) {
                                hasError = true;
                                errorType.push("ETA Difference")
                            }
                            if (responseOrders[0].seller) {
                                if (ctrl.selectedContracts[0].seller.id != responseOrders[0].seller.id) {
                                    hasError = true;
                                    errorType.push("Seller")
                                }
                            } else {
                                hasError = true
                            }
                        }
                        if (hasError) {
                            errorTypes = errorType.join(", ");
                            if (errorTypes) {
                                errorMessage = "Unable to add " + $scope.getProductNameByRequestProductId(requestProductIds[0]) + " for " + ctrl.request.vesselDetails.vessel.name + " in existing stemmed order " + responseOrders[0].id + " due to conflicting " + errorTypes + ". New order will be created." + errorTypes + " will be only that did not met the criteria for extending the order";
                            }
                            responseOrders = null;
                            // alert(errorMessage);
                            toastr.info(errorMessage, '', {
                                timeOut: 10000
                            });
                        } else {
                            errorMessage = null;
                        }
                        $('#confirm').modal('show');
                    }
                    ctrl.confirmationProductOrders = {
                        "requestId": ctrl.requestId,
                        "contractId": contractIds.join(','),
                        "contractProductId": contractProductIds.join(','),
                        "requestProductId": requestProductIds.join(',')
                    };
                    broadcastDataConfirmation = {
                        "confirmationProductOrders": ctrl.confirmationProductOrders,
                        "requestOrder": responseOrders
                    }
                    $scope.$broadcast('confirmationProductOrders', broadcastDataConfirmation);
                }, function(responseData) {
                    ctrl.buttonsDisabled = false;
                });
            } else {
                ctrl.buttonsDisabled = false;
            }
        }
        ctrl.showProceedButton = function(noneSelected) {
    
            selected = 0;

            //if some contracts are selected, check if they match (by requestProductId)
            ctrl.selectedContracts = [];
            if(!noneSelected){
                $.each(ctrl.checkboxes, function(k, v) {
                    if (v) {
                        $.each(ctrl.contracts, function(kc, vc) {
                            if (vc.requestProductId) {
                                if (k == vc.id) {
                                    selected++;
                                    ctrl.selectedContracts.push(vc)
                                }
                            }
                        })
                    }
                })
            }
  
            //set variable to show btn
            if (selected > 0) {
                ctrl.contractHasProduct = true;
            } else {
                ctrl.contractHasProduct = false;
            }

            dataToBroadcast = {
            	checkboxes : ctrl.checkboxes,
            }

            $rootScope.$broadcast('showProceedButton', dataToBroadcast)

            console.log("ctrl.contractHasProduct", ctrl.contractHasProduct);
        }

        ctrl.goBack = function() {
            $window.history.back();
        };

        // --------------------------------------------- betty 25.07
        // ctrl.initTableScale = function() {
        //     setTimeout(function() {
        //         $(".custom-hardcoded-table table").css("display", "none");
        //         $(".custom-hardcoded-table").css("max-width", function() {
        //             return $($(this).parent()).width() + 'px'
        //         })
        //         $(".custom-hardcoded-table table").css("display", "initial");
        //     }, 500)
        // }

    }
]);
angular.module('shiptech.pages').component('selectContract', {
    templateUrl: 'pages/select-contract/views/select-contract-component.html',
    controller: "SelectContractController",
    bindings: {
        selectedProducts: '<',
        contracts: '<',
        contractHasProduct: '=',
        selectedContracts: '='
    }
});