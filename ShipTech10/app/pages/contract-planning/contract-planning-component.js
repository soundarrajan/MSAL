angular.module('shiptech.pages').controller('ContractPlanningController', [ '$scope', '$rootScope', '$element', '$attrs', '$timeout', '$sce', '$filter', '$compile', '$state', '$stateParams', 'STATE', 'LOOKUP_MAP', 'uiApiModel', 'selectContractModel', 'newRequestModel', 'tenantService', 'IDS', 'EMAIL_TRANSACTION', 'emailModel', 'EXPORT_FILETYPE', 'EXPORT_FILETYPE_EXTENSION', 'groupOfRequestsModel', '$uibModal', 'scheduleDashboardStatusResource', 'ContractPlanningDataSharing', 'Factory_Master', '$listsCache',
    function($scope, $rootScope, $element, $attrs, $timeout, $sce, $filter, $compile, $state, $stateParams, STATE, LOOKUP_MAP, uiApiModel, selectContractModel, newRequestModel, tenantService, IDS, EMAIL_TRANSACTION, emailModel, EXPORT_FILETYPE, EXPORT_FILETYPE_EXTENSION, groupOfRequestsModel, $uibModal, scheduleDashboardStatusResource, ContractPlanningDataSharing, Factory_Master, $listsCache) {
        $scope.STATE = STATE;
        $scope.Math = window.Math;
        let ctrl = this;
        let tableSelector = '#contract_planning';
        ctrl.sellerTypeIds = IDS.FAKE_SELLER_TYPE_ID;
        ctrl.EXPORT_FILETYPE = EXPORT_FILETYPE;
        ctrl.sellerFilters = [];
        ctrl.buttonsDisabled = false;
        ctrl.tableLoaded = false;
        // Holds the lookup lists for Suggested Contracts and Seller.
        ctrl.lookupLists = [];
        ctrl.selectedContracts = [];
        ctrl.currentRequest = null;
        ctrl.groupId = $stateParams.groupId;
        ctrl.tenantUOM = null;
        tenantService.tenantSettings.then((settings) => {
            ctrl.tenantSettings = settings.payload;
            ctrl.numberPrecision = settings.payload.defaultValues;
            ctrl.tenantUOM = settings.payload.tenantFormats.uom;
            ctrl.dateFormat = settings.payload.tenantFormats.dateFormat.name;
        });
        ctrl.tableOptions = {};
        ctrl.tableOptions.order = [
            [ 2, 'asc' ]
        ];
        ctrl.tableOptions.pageLength = 25;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.tableOptions.searchTerm = null;
        ctrl.lists = $listsCache;
        //  contract planning data used in clc table
        // $rootScope.contractPlanningData = {
        //     selectedContracts: null
        // }
        // $rootScope.contractPlanningData = ctrl.selectedContracts;
        // $rootScope.$watch('contractPlanningData', function(newVal, oldVal){
        //     console.log($rootScope.contractPlanningData);
        // }, true);
        //
        // console.log(ContractPlanningDataSharing.callFunction);
        // console.log(ContractPlanningDataSharing.test());
        // end data for table

        // $scope.$on('filters-applied', function(event, payload) {
        //     ctrl.tableOptions.filters = payload;
        //     pagination = {
        //         "start": ctrl.tableOptions.paginationStart,
        //         "length": ctrl.tableOptions.pageLength
        //     }
        //     selectContractModel.getContractPlanning(ctrl.tableOptions.order, pagination, ctrl.tableOptions.filters, null, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //         destroyDataTable();
        //         $timeout(function() {
        //             ctrl.data = server_data.payload;
        //             ctrl.table = initDataTable(tableSelector);
        //             var info = ctrl.table.page.info();
        //             setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
        //             ctrl.tableOptions.totalRows = server_data.matchedCount;
        //             handleTableEvents();

        //         });
        //         setTimeout(function(){
        //          $(tableSelector).dataTable().fnAdjustColumnSizing(false);
        //         },1000)
        //     });
        // })
        // $scope.search = function(value) {
        //     ctrl.tableOptions.searchTerm = value;
        //     ctrl.setPage(1, true)
        // }
        $scope.testscheduleDashboardVesselVoyages = function() {
            // console.log($rootScope.scheduleDashboardVesselVoyages);
        };
        // ctrl.$onInit = function() {
        //     console.log($rootScope.scheduleDashboardVesselVoyages);
        //     listsModel.get().then(function(data) {
        //         ctrl.lists = data;
        //         uiApiModel.get().then(function(data) {
        //             ctrl.ui = data;
        //          $.each(data.contracts.columns, function(colK, colV){
        //                 if (ctrl.tenantSettings.companyDisplayName.name == "Pool") {
        //                     colV.caption = colV.caption.replace('COMPANY', 'POOL');
        //                     colV.caption = colV.caption.replace('COMPANIES', 'POOLS');
        //                 }
        //                 if (ctrl.tenantSettings.serviceDisplayName.name == "Operator") {
        //                     colV.caption = colV.caption.replace('SERVICE', 'OPERATOR');
        //                 }
        //          })
        //             // ctrl.ui = {"contracts":{"columns":[{"name":"","caption":"","visible":true,"type":"","sortable":false,"dtoPath":"","alwaysVisible":true},{"name":"previewEmail","caption":"","visible":true,"sortable":false,"sortableName":"previewEmail","alwaysVisible":true},{"name":"requestId","caption":"PAGES.CONTRACT_PLANNING.REQUEST_ID","visible":true,"type":"html-num","sortableName":"RequestId","dtoPath":"requestId"},{"name":"requestProductStatus","caption":"PAGES.CONTRACT_PLANNING.REQUEST_PRODUCT_STATUS","visible":true,"sortableName":"RequestProductStatus","dtoPath":"requestProductStatus"},{"name":"requestStatus","caption":"PAGES.CONTRACT_PLANNING.REQUEST_STATUS","visible":true,"sortableName":"RequestStatus","dtoPath":"requestStatus"},{"name":"vesselName","caption":"PAGES.CONTRACT_PLANNING.VESSEL","visible":true,"sortableName":"Vessel_Name","dtoPath":"vessel.name"},{"name":"serviceName","caption":"PAGES.CONTRACT_PLANNING.SERVICE","visible":true,"sortableName":"Service_Name","dtoPath":"service.name"},{"name":"bunkeringLocationName","caption":"PAGES.CONTRACT_PLANNING.PORT","visible":true,"sortableName":"BunkeringLocation_Name","dtoPath":"bunkeringLocation.name"},{"name":"eta","caption":"PAGES.CONTRACT_PLANNING.ETA","visible":true,"sortableName":"BunkeringEta","dtoPath":"BunkeringEta","type":"date"},{"name":"productName","caption":"PAGES.CONTRACT_PLANNING.PRODUCT","visible":true,"sortableName":"Product_Name","dtoPath":"product.name"},{"name":"minMaxQty","caption":"PAGES.CONTRACT_PLANNING.MIN_MAX_QTY","visible":true,"sortableName":"MinQuantity","dtoPath":"minQuantity"},{"name":"contract","caption":"PAGES.CONTRACT_PLANNING.CONTRACT","visible":true,"sortableName":"Contract_Name","dtoPath":"contract.name"},{"name":"seller","caption":"PAGES.CONTRACT_PLANNING.SELLER","visible":true,"sortableName":"Seller_Name","dtoPath":"seller.name"},{"name":"agreementType","caption":"PAGES.CONTRACT_PLANNING.AGREEMENT_TYPE","visible":true,"sortableName":"AgreementType_Name","dtoPath":"agreementType"},{"name":"comment","caption":"PAGES.CONTRACT_PLANNING.COMMENTS","visible":true,"sortableName":"Comment","dtoPath":"comment"},{"name":"buyerName","caption":"PAGES.CONTRACT_PLANNING.BUYER","visible":true,"sortableName":"Buyer_Name","dtoPath":"buyer.name"},{"name":"etd","caption":"PAGES.CONTRACT_PLANNING.ETD","visible":true,"sortableName":"Etd","dtoPath":"etd","type":"date"},{"name":"deliveryOptionName","caption":"PAGES.CONTRACT_PLANNING.DELIVERY_OPTION","visible":true,"sortableName":"DeliveryOption_Name","dtoPath":"deliveryOption.name"},{"name":"formulaDescription","caption":"PAGES.CONTRACT_PLANNING.FORMULA_DESCRIPTION","visible":true,"sortableName":"FormulaDescription","dtoPath":"formulaDescription"},{"name":"premiumDiscount","caption":"PAGES.CONTRACT_PLANNING.PREMIUM_DISCOUNT","visible":true,"sortableName":"PremiumDiscount","dtoPath":"premiumDiscount"},{"name":"deliveryPrice","caption":"PAGES.CONTRACT_PLANNING.DELIVERY_PRICE","visible":true,"sortableName":"DeliveryPrice","dtoPath":"deliveryPrice"},{"name":"requestComment","caption":"PAGES.CONTRACT_PLANNING.REQUEST_COMMENTS","visible":true,"sortableName":"RequestComment","dtoPath":"requestComment"},{"name":"noOfdaysBeforeExpiry","caption":"PAGES.CONTRACT_PLANNING.DAYS_BEFORE_EXPIRY","visible":true,"sortableName":"NoOfdaysBeforeExpiry","dtoPath":"noOfdaysBeforeExpiry"},{"name":"contractualMinMaxQty","caption":"PAGES.CONTRACT_PLANNING.CONTRACTUAL_MIN_MAX_QTY","visible":true,"sortableName":"ContractMinQuantity","dtoPath":"contractMinQuantity"},{"name":"LastPurchasedQuantity","caption":"PAGES.CONTRACT_PLANNING.LASTPURCHASEDQUANTITY","visible":true,"sortableName":"lastPurchasedQuantity","dtoPath":"lastPurchasedQuantity"}]}};

        //             //Normalize relevant data for use in template.
        //             ctrl.contractsColumns = normalizeArrayToHash(ctrl.ui.contracts.columns, 'name');
        //             //debugger
        //             ctrl.settings = normalizeJSONDataTables(ctrl.ui);
        //             if (ctrl.groupId) {
        //                 fetchContracts([{
        //                     "ColumnName": "RequestGroupId",
        //                     "Value": +ctrl.groupId
        //                 }]);
        //             } else {
        //                 fetchContracts();
        //             }

        //             function fetchContracts(filters) {
        //                 if ($rootScope.scheduleDashboardVesselVoyages) {
        //                     voyageFilter = ""
        //                     $.each($rootScope.scheduleDashboardVesselVoyages, function(k, v) {
        //                         voyageFilter += v.vesselVoyageId + ','
        //                     })
        //                     if (voyageFilter.charAt(voyageFilter.length - 1) == ',') {
        //                         voyageFilter = voyageFilter.substr(0, voyageFilter.length - 1);
        //                     }
        //                     if (!filters || typeof(filters) == 'undefined') {
        //                         filters = [];
        //                     }
        //                     filters.push({
        //                         'ColumnName': 'VesselVoyageDetailIds',
        //                         'Value': voyageFilter
        //                     });
        //                 }
        //                 pagination = {
        //                     "start": ctrl.tableOptions.paginationStart,
        //                     "length": ctrl.tableOptions.pageLength
        //                 }
        //                 defaultOrder = null;
        //                 selectContractModel.getContractPlanning(defaultOrder, pagination, ctrl.tableOptions.filters, filters, ctrl.tableOptions.searchTerm).then(function(data) {
        //                     showData(data);
        //                 });
        //             }
        //         });
        //     });
        // };
        // /**
        //  * Initializes the Schedule Dashboard Table datatable.
        //  * @param {JSON} - The settings to use for DataTable initialization.
        //  * Must be JSON-normalized to the DataTables settings format!
        //  * @return {Object} - The resulting DataTable object.
        //  */
        // function initDataTable(selector, settings) {
        //     // Bind and initialize the DataTable.
        //     var table = ContractPlanningDataTable.init({
        //         selector: selector,
        //         dom: 'Bflrt',
        //         columnDefs: ctrl.settings.contracts.columnDefs,
        //         colvisColumns: ctrl.settings.contracts.colvisColumns,
        //         pageLength: ctrl.tableOptions.pageLength,
        //         order: ctrl.tableOptions.order
        //     });
        //     // var table = ContractPlanningDataTable.init({
        //     //     selector: selector,
        //     //     columnDefs: settings.columnDefs,
        //     //     fixedColumns: true,
        //     //     colvisColumns: settings.colvisColumns,
        //     //     dom: 'Bflrt',
        //     //     pageLength: ctrl.tableOptions.pageLength,
        //     //     order: []
        //     // });
        //     // Re-place (move) the datatable searchbox in the main content menu, as per spec.
        //     replaceDataTableSearchBox('#contract_planning_filter', '#search_box_dummy_contract_planning');
        //     return table;
        // }
        ctrl.saveCurrentRequest = function(request) {
            ctrl.currentRequest = request;
        };
        ctrl.clearContract = function(contractName) {
            if (!contractName) {
                ctrl.currentRequest.contract = null;
                ctrl.currentRequest.seller = null;
                ctrl.currentRequest.formulaDescription = null;
                ctrl.currentRequest.deliveryPrice = null;
                ctrl.currentRequest.premiumDiscount = null;
                ctrl.currentRequest.noOfDaysBeforeExpiry = null;
            }
        };
        ctrl.minQtyBlur = function() {
            if (parseFloat($scope.minMaxModalEdit.maxQuantity) < parseFloat($scope.minMaxModalEdit.minQuantity) || !parseFloat($scope.minMaxModalEdit.maxQuantity)) {
                $scope.minMaxModalEdit.maxQuantity = $scope.minMaxModalEdit.minQuantity;
            }
        };
        ctrl.selectContract = function(contract) {
            ctrl.currentRequest.contractMinQuantity = contract.minQuantity;
            ctrl.currentRequest.contractMaxQuantity = contract.maxQuantity;
        	$rootScope.$broadcast('selectedContractFromModal', contract);
            return;
            ctrl.currentRequest.contract = contract.contract;
            ctrl.currentRequest.contractProductId = contract.contractProductId;
            ctrl.currentRequest.seller = contract.seller;
            ctrl.currentRequest.contractProductId = contract.contractProductId;
            ctrl.currentRequest.formulaDescription = contract.formulaDescription;
            ctrl.currentRequest.deliveryPrice = contract.deliveryPrice;
            ctrl.currentRequest.premiumDiscount = contract.premiumDiscount;
            ctrl.currentRequest.noOfDaysBeforeExpiry = contract.noOfDaysBeforeExpiry;
            $scope.contractPlanningHasChangesMade = true;
            setTimeout(() => {
                $(tableSelector).dataTable().fnAdjustColumnSizing(false);
            }, 10);
        };

        ctrl.selectProduct = function(product) {
            $rootScope.$broadcast('selectedProductFromModal', product);
            return;
        };

        ctrl.selectSellerContract = function(sellerContractObject) {
            ctrl.currentRequest.contract = sellerContractObject.contract;
            ctrl.currentRequest.seller = sellerContractObject.counterparty;
        };
        ctrl.setSellerFilters = function(request) {
            let newFilters = [];
            if (request.bunkeringLocation) {
                newFilters.push({
                    ColumnName: 'LocationId',
                    Value: request.bunkeringLocation.id
                });
            }
            if (request.product) {
                newFilters.push({
                    ColumnName: 'ProductId',
                    Value: request.product.id
                });
            }
            ctrl.sellerFilters = angular.copy(newFilters);
            ctrl.saveCurrentRequest(request);
        };
        ctrl.setContractFilters = function(request) {
            // request = JSON.parse(setContractFilters);
            let newFilters = [];
            if (request.bunkeringLocation) {
                newFilters.push({
                    ColumnName: 'LocationId',
                    Value: request.bunkeringLocation.id
                });
            }
            if (request.product) {
                newFilters.push({
                    ColumnName: 'ProductId',
                    Value: request.product.id
                });
            }
            if (request.bunkeringEta) {
                newFilters.push({
                    ColumnName: 'Eta',
                    Value: request.bunkeringEta
                });
            }            
            // if (request.seller) {
            //    newFilters.push({
            //        'ColumnName': 'SellerId',
            //        'Value': request.seller.id
            //    });
            // } else {
            console.log(request);
            newFilters.push({
                ColumnName: 'SellerId',
                Value: 0
            });
            newFilters.push({
                ColumnName: 'RequestId',
                Value: request.requestId
            });
            // }
            ctrl.contractFilters = angular.copy(newFilters);
            ctrl.saveCurrentRequest(request);
        };

        /**
         * Retrieves and sets the lookup lists for the Suggested Contracts and Seller columns.
         */
        ctrl.getLookupLists = function(request, index) {
            ctrl.setContractFilters(request);
            if (typeof ctrl.lookupLists[index] == 'undefined' || ctrl.lookupLists[index] === null) {
                newRequestModel.search(ctrl.contractFilters).then((data) => {
                    ctrl.lookupLists[index] = data.payload;
                });
            }
        };
        ctrl.getLookupListsContract = function(rowId, index) {
            ctrl.CLC = $('#flat_contract_planning');
            ctrl.tableData = ctrl.CLC.jqGrid.Ascensys.gridObject.rows;
            var request = ctrl.tableData[rowId];
            ctrl.setContractFilters(request);
            if (typeof ctrl.lookupLists[index] == 'undefined' || ctrl.lookupLists[index] === null) {
                newRequestModel.search(ctrl.contractFilters).then((data) => {
                    ctrl.lookupLists[index] = data.payload;
                });
            }
        };

        ctrl.resetContractPlaning = false;
        $timeout(() => {
            ctrl.resetContractPlaning = true;
        }, 50);

        /**
         * Saves contract planning data.
         */
        $rootScope.$on('contractPlanningSelectedRows', (data, res) => {
            ctrl.contractPlanningSelectedRows = res;
            // ctrl.saveContractPlanning();
        });
        $rootScope.$on('gridDataDone', (data, res) => {
            ctrl.contractPlanningSelectedRows = [];
        });
        $rootScope.$on('contractModalData', (data, res) => {
            ctrl.setContractFilters(res);
        });

        ctrl.saveContractPlanning = function(manual, saveAndSend) {
            let contractList = ctrl.contractPlanningSelectedRows;
            ctrl.CLC = $('#flat_contract_planning');
            ctrl.tableData = ctrl.CLC.jqGrid.Ascensys.gridObject.rows;


            /* OLD*/
            // for (var i = 0; i < ctrl.selectedContracts.length; i++) {
            //     if (ctrl.selectedContracts[i]) {
            //         contractList.push(ctrl.data[i]);
            //     }
            // }
            /* OLD*/

            if (contractList.length < 1) {
                toastr.error('Please select the rows to be saved !');
                return;
            }
            var noContractAssigned = '';
            if (manual) {
                var noMinMaxQuantity = '';
            }
            var noAgreementType = '';
            var requestStatusError = '';
            $.each(contractList, (k, v) => {
                if (v.requestId == 0 && v.contract == null) {
                    noContractAssigned = `${noContractAssigned }${v.vessel.name }, `;
                }
                if (manual && (v.minQuantity == null || v.maxQuantity == null || v.minQuantity < 0 || v.maxQuantity < 0)) {
                    noMinMaxQuantity = `${noMinMaxQuantity }${v.vessel.name }, `;
                }
                if (v.agreementType == null) {
                    noAgreementType = `${noAgreementType }${v.vessel.name }, `;
                }
                if (v.requestStatus) {
		            if (v.requestStatus.name != 'Planned' && v.requestStatus.name != 'Created' && v.requestStatus.name != 'Questionnaire' && v.requestStatus.name != 'Validated') {
	                    requestStatusError = `${requestStatusError }${v.vessel.name }, `;
		            }
                }
            });
            if (noContractAssigned.length > 0 || manual && noMinMaxQuantity.length > 0 || noAgreementType.length > 0) {
                var displayError = '';
                if (noContractAssigned.length > 0) {
                    displayError = `${displayError }The following vessels: ${ noContractAssigned } have no contract assigned\r\n`;
                }
                if (manual && noMinMaxQuantity.length > 0) {
                    displayError = `${displayError }The following vessels: ${ noMinMaxQuantity } have invalid Min-Max Quantities\r\n`;
                }
                if (noAgreementType.length > 0) {
                    displayError = `${displayError }The following vessels: ${ noAgreementType } have no Agreement Types selected`;
                }
                if (requestStatusError.length > 0) {
                    displayError = `${displayError }For the following vessels: ${ requestStatusError } request must be in 'Planned', 'Created', 'Questionnaire' or 'Validated' status`;
                }
                toastr.error(displayError);
                return;
            }


            ctrl.buttonsDisabled = true;
            if (saveAndSend) {
                newRequestModel.contractPlanningSaveAndSend(contractList).then((response) => {
                    ctrl.buttonsDisabled = false;
                    $rootScope.scheduleDashboardVesselVoyages = null;
                    $state.reload();
                }).catch((error) => {
                    ctrl.buttonsDisabled = false;
                    // $state.reload();
                });
            } else {
                newRequestModel.saveContractPlanning(contractList).then((response) => {
                    ctrl.buttonsDisabled = false;
                    $rootScope.scheduleDashboardVesselVoyages = null;
                    $state.reload();
                }).catch((error) => {
                    ctrl.buttonsDisabled = false;
                    // $state.reload();
                });
            }
        };

        $timeout(() => {
            $scope.resetContractPlaning = true;
        }, 50);

        ctrl.contractPlanningAutoSave = function(rowIndex) {
            var CLC = $('#flat_contract_planning');
            var rowObject = CLC.jqGrid.Ascensys.gridObject.rows[rowIndex];

            // CLC.jqGrid('setRowData',rowIndex +1 ,rowObject);

            var listsCache = ctrl.lists;

            Object.keys($rootScope.editableCProwsModel).forEach((objectKey) => {
                let value = $rootScope.editableCProwsModel[objectKey];
                if (`row-${ parseFloat(rowIndex + 1)}` == objectKey) {
                    if (value.contractChanged) {
                        rowObject.contract = value.contract;
                    } else {
                        rowObject.contract = CLC.jqGrid.Ascensys.gridData[parseFloat(objectKey.split('row-')[1]) - 1].contract;
                    }
                    rowObject.agreementType = null;
                    if (_.filter(listsCache.AgreementType, (o) => {
                        return o.id == value.agreementType.id;
                    }).length > 0) {
                    	rowObject.agreementType = 	_.filter(listsCache.AgreementType, (o) => {
                            return o.id == value.agreementType.id;
                        })[0];
                    }
                    if (typeof value.comment != 'undefined') {
                        rowObject.comment = value.comment ? value.comment : null;
                    }
                    rowObject.product = value.product;
                    rowObject.contractProductId = value.contractProductId;
                }
                return;
            });


            if (rowObject.requestStatus) {
                if (rowObject.requestStatus.name != 'Planned' && rowObject.requestStatus.name != 'Created' && rowObject.requestStatus.name != 'Questionnaire' && rowObject.requestStatus.name != 'Validated') {
                    toastr.info('Request must be in \'Planned\', \'Created\', \'Questionnaire\' or \'Validated\' status to autosave ');
                    return;
                }
            }

        	newRequestModel.contractPlanningAutoSave(rowObject).then((response) => {
        		if (response.payload) {
		            Object.keys($rootScope.editableCProwsModel).forEach((objectKey) => {
		                let value = $rootScope.editableCProwsModel[objectKey];
		                if (`row-${ parseFloat(rowIndex + 1)}` == objectKey) {
		                    if (value.contractChanged) {
		                        rowObject.contract = value.contract;
		                    } else {
		                        rowObject.contract = CLC.jqGrid.Ascensys.gridData[parseFloat(objectKey.split('row-')[1]) - 1].contract;
		                    }
                            if (typeof value.comment != 'undefined') {
                                rowObject.comment = value.comment ? value.comment : null;
                            }
		                    rowObject.agreementType = value.agreementType;
		                    rowObject.product = value.product;
		                    rowObject.contractProductId = value.contractProductId;
		                    rowObject.preplanningDetailId = response.payload;
                            $(Elements.table[Elements.settings['flat_contract_planning'].table]).trigger('reloadGrid');
		                }
		                return;
		            });
        		}
            }).catch((error) => {

            });
        };

        $rootScope.contractPreviewEmail = function(contract) {
            // debugger;
            ctrl.selectedContracts = ctrl.contractPlanningSelectedRows;
            if (_.uniqBy(ctrl.selectedContracts, 'seller.id').length > 1) {
                toastr.error('You cannot preview email of multiple sellers at once');
                return;
            }
            let contractList = ctrl.contractPlanningSelectedRows;
            if ($scope.contractPlanningHasChangesMade) {
                toastr.error('Please save the changes first!');
                return;
            }
            // var contractList = [];
            // for (var i = 0; i < ctrl.selectedContracts.length; i++) {
            //     if (ctrl.selectedContracts[i]) {
            //         contractList.push(ctrl.data[i]);
            //     }
            // }
            var previewEmailIsInvalid = false;
            $.each(ctrl.selectedContracts, (k, v) => {
                if (v.requestId == 0) {
                    previewEmailIsInvalid = true;
                    toastr.error('Please save selected row before previewing email!');
                }
            });
            if (previewEmailIsInvalid) {
                return;
            }
            console.log(contractList);
            var sameSeller = true;
            var noAssociatedContract = false;
            var dataError = false;
            var requestIds = [];
            var locationIds = [];
            var productIds = [];
            var requestProductIds = [];
            var sellerIds = {};
            var noSellerContract = false;
            var uniqueSlrId;
            if (ctrl.selectedContracts.length == 0 || !ctrl.selectedContracts) {
                toastr.error('Please select at least one contract');
                return;
            }
            $.each(ctrl.selectedContracts, (k, contract) => {
                if (!contract.seller) {
                    noSellerContract = true;
                    // sameSeller = false;
                }
                if (contract.contract.fullValue) {
                    if (contract.contract.fullValue.seller) {
                        noSellerContract = false;
                    }
                }
                if (contract.seller) {
                    uniqueSlrId = contract.seller.id;
                }
                if (typeof uniqueSlrId != 'undefined') {
                    if (uniqueSlrId != contract.seller.id) {
                        sameSeller = false;
                    }
                }
                if (!contract.contract) {
                    noAssociatedContract = true;
                    return;
                }
                if (contract.requestId && contract.product && contract.bunkeringLocation) {
                    requestIds.push(contract.requestId);
                    locationIds.push(contract.bunkeringLocation.id);
                    productIds.push(contract.product.id);
                    requestProductIds.push(contract.requestProductId);
                } else {
                    dataError = true;
                }
            });
            if (sameSeller == false) {
                toastr.error('The contracts should have the same seller');
                return;
            }
            if (noSellerContract) {
                toastr.error('The selected contract doesn\'t have a seller');
                return;
            }
            if (noAssociatedContract) {
                toastr.error('one of the selected rows doesn\'t have an associated contract');
                return;
            }
            if (dataError) {
                toastr.error('an error has occured');
                return;
            }
            let data = {
                requestId: requestIds.join(),
                locationId: locationIds.join(),
                productId: productIds.join(),
                requestProductId: requestProductIds.join(),
                sellerId: uniqueSlrId
            };
            // templateName: 'ContractPlanningEmailTemplate',
            console.log(data);
            ctrl.selectedContracts = [];
            $state.go(STATE.PREVIEW_EMAIL, {
                data: data,
                transaction: EMAIL_TRANSACTION.CONTRACT_PLANNING
            });
        };
        ctrl.sendContractPlanningEmail = function() {
            var noAssociatedContract = false;
            ctrl.selectedContracts = ctrl.contractPlanningSelectedRows;
            if ($scope.contractPlanningHasChangesMade) {
                toastr.error('Please save the changes first!');
                return;
            }
            // var contractList = [];
            // for (var i = 0; i < ctrl.selectedContracts.length; i++) {
            //     if (ctrl.selectedContracts[i]) {
            //         contractList.push(ctrl.data[i]);
            //     }
            // }
            // console.log(contractList);
            var dataError = false;
            var requestIds = [];
            var locationIds = [];
            var productIds = [];
            var requestProductIds = [];
            if (ctrl.selectedContracts.length == 0 || !ctrl.selectedContracts) {
                toastr.error('Please select at least one contract');
                return;
            }
            $.each(ctrl.selectedContracts, (k, contract) => {
                if (!contract.contract) {
                    noAssociatedContract = true;
                    return;
                }
                if (noAssociatedContract) {
                    toastr.error('one of the selected rows doesn\'t have an associated contract');
                    return;
                }
                if (contract.requestId && contract.product && contract.bunkeringLocation) {
                    requestIds.push(contract.requestId);
                    locationIds.push(contract.bunkeringLocation.id);
                    productIds.push(contract.product.id);
                    requestProductIds.push(contract.requestProductId);
                } else {
                    dataError = true;
                }
            });
            if (noAssociatedContract) {
                toastr.error('one of the selected rows doesn\'t have an associated contract');
                return;
            }
            if (dataError) {
                toastr.error('an error has occured');
                return;
            }
            let data = {
                requestId: requestIds.join(),
                locationId: locationIds.join(),
                // productId: productIds.join()
                requestProductId: requestProductIds.join()
            };
            // templateName: 'ContractPlanningEmailTemplate',
            console.log(data);
            ctrl.selectedContracts = [];
            emailModel.sendContractPlanningEmail(data);
        };

        /**
         * Go to table page taking into account current table options
         * @param {int} page - page to switch to.
         */
        // ctrl.setPage = function(page, isFromSearch) {
        //     if (page < 1 || page >= ctrl.tableOptions.totalRows / ctrl.tableOptions.pageLength + 1) {
        //         if (!isFromSearch) {
        //             return false;
        //         }
        //     }
        //     ctrl.tableLoaded = false;
        //     var tablePagination = {};
        //     tablePagination.start = (page - 1) * ctrl.tableOptions.pageLength;
        //     tablePagination.length = ctrl.tableOptions.pageLength;
        //     tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
        //     setTableVars(tablePagination.length, tablePagination.start);
        //     selectContractModel.getContractPlanning(tableOrder, tablePagination, ctrl.tableOptions.filters, null, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //         showData(server_data);
        //     });
        // };
        ctrl.prepareTableForPrint = function(tableWidth) {
            let beforePrint = function(tableWidth) {
                if($('clc-table-list')) {
                    // 1017px = default page landscape width
                    // var tableWidth = $('clc-table-list').width();
                    // console.log('clc-table-list',tableWidth);
                    let percentWidth = 101700 / tableWidth;
                    console.log('proc', percentWidth);
                    if(percentWidth < 100) {
                        // resize only when print is smaller
                        var zoomP = `${100 - parseFloat(percentWidth).toFixed(2) }%`;
                        $('div.inside_content ui-view').css('zoom', zoomP);
                    }
                }
            };
            let afterPrint = function() {
                $('div.inside_content ui-view').css('zoom', '100%');
            };
            if ('matchMedia' in window) {
                window.matchMedia('print').addListener((media) => {
                    // matches is true before print and false after
                    if(media.matches) {
                        beforePrint(tableWidth);
                    } else{
                        afterPrint();
                    }
                });
            } else {
                window.onbeforeprint = function() {
                    beforePrint();
                };
                window.onafterprint = function() {
                    afterPrint();
                };
            }
        };
        ctrl.export = function(fileType) {
            if(fileType == 0) {
                // get table width here, it gets altered later
                let tableWidth = $('#contract_planning_wrapper').width();
                ctrl.prepareTableForPrint(tableWidth);
                window.print();
                return;
            }
            let tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
            let tableFilters = angular.copy(ctrl.tableOptions.filters);
            let tableColumnList = ctrl.table.columns();
            let columns = [];
            let columnData = {};
            for (let i = 0; i < tableColumnList[0].length; i++) {
                if (ctrl.table.columns(i).visible()[0]) {
                    columnData = {};
                    columnData.DtoPath = $(ctrl.table.column(i).header()).data('dtoPath');

                    // customizations for dtoPath when status is mapped
                    if(columnData.DtoPath == 'requestProductStatus') {
                        columnData.DtoPath = 'requestProductStatusDisplayName';
                    }
                    if(columnData.DtoPath == 'requestStatus') {
                        columnData.DtoPath = 'requestStatusDisplayName';
                    }
                    if(columnData.DtoPath == 'agreementType') {
                        columnData.DtoPath = 'agreementType.name';
                    }
                    if(columnData.DtoPath == 'noOfDaysBeforeExpiry') {
                        columnData.DtoPath = 'noOfDaysBeforeExpiry';
                    }


                    columnData.Label = $(ctrl.table.column(i).header()).text().trim();
                    if (columnData.Label !== '' && columnData.DtoPath) {
                        columns.push(columnData);
                    }
                }
            }
            let tablePagination = {};
            tablePagination.start = (ctrl.tableOptions.currentPage - 1) * ctrl.tableOptions.pageLength;
            tablePagination.length = ctrl.tableOptions.pageLength;
            selectContractModel.getContractPlanningExport(tableOrder, tableFilters, tablePagination, columns, fileType).then((result) => {
                if (!result) {
                    return false;
                }
                if (!result.filename) {
                    result.filename = `Contract.${ EXPORT_FILETYPE_EXTENSION[fileType]}`;
                }
                // var blob = new Blob([result.data]);
                // saveAs(blob, result.filename);

                let blob = new Blob([ result.data ], {
                    type: result.headers.ContentType
                });

                let a = document.createElement('a');
                a.style = 'display: none';
                document.body.appendChild(a);
                // Create a DOMString representing the blob and point the link element towards it
                let url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = result.filename;
                // programatically click the link to trigger the download
                a.click();
                // release the reference to the file by revoking the Object URL
                window.URL.revokeObjectURL(url);
            });
        };

        /**
         * Initializes all user events on the table (pagination, sorting, searching)
         */
        // function handleTableEvents() {
        //     var table = $(tableSelector);
        //     table.on('order.dt', function(e) {
        //         var neworder = angular.copy(ctrl.table.order().slice(0));
        //         var tableOrder;
        //         //reset pagination
        //         var tablePagination = {};
        //         tablePagination.start = 0;
        //         tablePagination.length = ctrl.tableOptions.pageLength;
        //         ctrl.tableOptions.order = neworder;
        //         ctrl.setPage(ctrl.tableOptions.currentPage);
        //         // selectContractModel.getContractPlanning(tableOrder, tablePagination, ctrl.tableOptions.filters, null, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //         //     showData(server_data);
        //         // });
        //     });
        //     table.on('length.dt', function(e, settings, len) {
        //         ctrl.tableLoaded = false;
        //         var info = ctrl.table.page.info();
        //         var tablePagination = {};
        //         tablePagination.start = info.start;
        //         tablePagination.length = len;
        //         ctrl.tableOptions.pageLength = len;
        //         tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
        //         selectContractModel.getContractPlanning(tableOrder, tablePagination, ctrl.tableOptions.filters, null, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //             showData(server_data);
        //         });
        //     });
        // }

        // function showData(data) {
        //     // Unbind datatable before altering the underlying HTML.
        //     // //clear existing data
        //     ctrl.selectedContracts = []
        //     destroyDataTable();
        //     ctrl.data = data.payload;
        //     $timeout(function() {
        //         ctrl.table = initDataTable(tableSelector);
        //         ctrl.tableOptions.totalRows = data.matchedCount;
        //         handleTableEvents();
        //         ctrl.tableLoaded = true;
        //     });
        // }

        // function destroyDataTable(clearHtml) {
        //     // ctrl.data = [];
        //     // $(tableSelector).DataTable().clear;
        //     // return;
        //     if (ctrl.table) {
        //         ctrl.table.off('order.dt');
        //         ctrl.table.off('length.dt');
        //         if (clearHtml) {
        //             ctrl.table.destroy(true);
        //         } else {
        //             try {
        //                 $(tableSelector).DataTable().clear();
        //                 $(tableSelector).DataTable().destroy()
        //             } catch (err) {
        //                 console.log(err);
        //             }
        //             // ctrl.table.destroy();
        //         }
        //         ctrl.table = null;
        //     }
        // }
        /**
         * Set table parameters
         * @param {int} length - count of items on each page of the table.
         * @param {int} start - item number start of current page of the table.
         * @param {Object} order - sort order of the table.
         */
        // function setTableVars(length, start, order) {
        //     if (typeof length != "undefined" && length !== null) {
        //         ctrl.tableOptions.pageLength = length;
        //     }
        //     if (typeof start != "undefined" && start !== null) {
        //         ctrl.tableOptions.paginationStart = start;
        //     }
        //     if (typeof order != "undefined" && order !== null) {
        //         ctrl.tableOptions.order = order;
        //     }
        //     ctrl.tableOptions.currentPage = ctrl.tableOptions.paginationStart / ctrl.tableOptions.pageLength + 1;
        // }
        /**
         * Change datatable order to match server required format
         * @param {Array} - The order format from datatables.
         * @return {Object} - normalized object representing a human-readable table order
         */
        // function normalizeDatatablesOrder(datatablesOrderArray) {
        //     var tableOrder = {};
        //     if (datatablesOrderArray.length > 0) {
        //         datatablesOrderArray = datatablesOrderArray[0];
        //         tableOrder.column = $(ctrl.table.column(datatablesOrderArray[0]).header()).data('columnName');
        //         tableOrder.order = datatablesOrderArray[1];
        //     }
        //     return tableOrder;
        // }
        $rootScope.$on('openMinMaxModal', (event, data) => {
            ctrl.CLC = $('#flat_contract_planning');
            ctrl.tableData = ctrl.CLC.jqGrid.Ascensys.gridObject.rows;
            ctrl.currentRowData = ctrl.tableData[data - 1];
            ctrl.currentRowIndex = data;
            ctrl.openMinMaxModalEdit(ctrl.currentRowData);

            // alert(data);
        });
        $rootScope.$on('contractPlanningDataChanged', (event, data) => {
            ctrl.contractPlanningDataChanged = true;
        });

        $rootScope.$on('procurementContractPlanningSummary', (event, data) => {
        	ctrl.procurementContractPlanningSummary = data;
        });


        $rootScope.$on('contractPlanningChange', (event, data) => {
            ctrl.CLC = $('#flat_contract_planning');
            ctrl.tableData = ctrl.CLC.jqGrid.Ascensys.gridObject.rows;
            ctrl.currentRowData = ctrl.tableData[data - 1];
            ctrl.currentRowIndex = data;
            // ctrl.CLC.jqGrid("clearGridData");
            // $.each(ctrl.tableData, function(k,v){
            //  ctrl.CLC.jqGrid("addRowData", k, v);
            // });
            // $compile(ctrl.CLC)($scope)
        });

        ctrl.openMinMaxModalEdit = function(rowData) {
            console.log(rowData);
            $timeout(() => {
	            $scope.minMaxModalEdit = null;
            }, 50);
            // $scope.minMaxModalEdit = $scope.minMaxModalEdit;
            $timeout(() => {
                $scope.minMaxModalEdit = rowData;
                if (!$scope.minMaxModalEdit.qtyUom) {
                    $scope.minMaxModalEdit.qtyUom = ctrl.tenantUOM;
                }
                $scope.$apply(() => {
                    $compile($('#minMaxModal'))($scope);
                    $('#minMaxModal').modal();
                });
            }, 100);
        };
        $('body').on('click', '.contract_planning_min_max_qty_wrap a', function(e) {
            e.preventDefault();
            var rowIndex = $(this).attr('rowId');
            var rowData = $('#flat_contract_planning').jqGrid.Ascensys.gridObject.rows[parseFloat(rowIndex) - 1];
            // $rootScope.$broadcast('contractPlanningChange', $rootScope.contractPlanningChange);
            $scope.minMaxModalEdit = null;
            $timeout(() => {
                ctrl.currentRowData = rowData;
                ctrl.currentRowIndex = parseFloat(rowIndex);

                $scope.minMaxModalEdit = rowData;
                if (!$scope.minMaxModalEdit.qtyUom) {
                    $scope.minMaxModalEdit.qtyUom = ctrl.tenantUOM;
                }
                $('#minMaxModal').modal();
            });

            // ctrl.openMinMaxModalEdit(rowData)
        });
        ctrl.saveMinMaxModal = function(minEdit, maxEdit, qtyUom) {
            if (!qtyUom) {
                toastr.error('Please select Quantity UOM');
                return;
            }
            if (parseFloat(minEdit) > parseFloat(maxEdit)) {
                toastr.error('Min Quantity can\'t be greater than max Quantity');
                return;
            }

            // ctrl.CLC.jqGrid('clearGridData')
            //     .jqGrid('setGridParam', { data: results })
            //     .trigger('reloadGrid', [{ page: 1}]);

            ctrl.CLC = $('#flat_contract_planning');
            ctrl.tableData = ctrl.CLC.jqGrid.Ascensys.gridObject.rows;
    		if (!ctrl.currentRowData) {
    			ctrl.currentRowData = {};
    		}
    		ctrl.CLC = $('#flat_contract_planning');
            ctrl.tableData = ctrl.CLC.jqGrid.Ascensys.gridObject.rows;
        	ctrl.currentRowData.minQuantity = minEdit;
        	ctrl.currentRowData.maxQuantity = maxEdit;
        	ctrl.tableData[ctrl.currentRowIndex - 1].qtyUom = qtyUom;
        	ctrl.tableData[ctrl.currentRowIndex - 1].minQuantity = ctrl.currentRowData.minQuantity;
        	ctrl.tableData[ctrl.currentRowIndex - 1].maxQuantity = ctrl.currentRowData.maxQuantity;
        	$('#flat_contract_planning').jqGrid('setCell', ctrl.currentRowIndex, 'maxQuantity', maxEdit);
        	$('#flat_contract_planning').jqGrid('setCell', ctrl.currentRowIndex, 'minQuantity', minEdit);

            var textForMinEdit = $filter('number')(minEdit, ctrl.numberPrecision.quantityPrecision) != '' ? $filter('number')(minEdit, ctrl.numberPrecision.quantityPrecision) : minEdit;
            var textForMaxEdit = $filter('number')(maxEdit, ctrl.numberPrecision.quantityPrecision) != '' ? $filter('number')(maxEdit, ctrl.numberPrecision.quantityPrecision) : maxEdit;

        	$(`.contract_planning_min_max_qty_wrap[rowid=${ctrl.currentRowIndex }] span.values`).text(`${textForMinEdit } - ${ textForMaxEdit}`);

        	// $(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"] span.values").text($filter("number")(minEdit, ( ctrl.numberPrecision.quantityPrecision || 3 )) +" - "+ $filter("number")(maxEdit, ( ctrl.numberPrecision.quantityPrecision || 3 )))
        	// $scope.$apply();
        	$compile($('.contract_planning_min_max_qty_wrap'))($scope);
        	ctrl.contractPlanningAutoSave(ctrl.currentRowIndex - 1);
        	// contract_planning_min_max_qty
        	// ctrl.CLC.jqGrid("clearGridData");
        	// $.each(ctrl.tableData, function(k,v){
	        // 	ctrl.CLC.jqGrid("addRowData", k, v);
        	// });
        	// $rootScope.$broadcast('contractPlanningDataChanged', true);
        	// ctrl.CLC.trigger("reload");
            /* $scope.minMaxModalEdit.qtyUom = qtyUom
            $scope.minMaxModalEdit.minQuantity = minEdit;
            $scope.minMaxModalEdit.maxQuantity = maxEdit;*/
        };
        ctrl.contractPlanningHasChanges = function() {
            $scope.contractPlanningHasChangesMade = true;
        };
        ctrl.hideEmptyRow = function(bool) {
            if (bool == true) {
                $('.dataTables_empty').hide();
            } else {
                $('.dataTables_empty').show();
            }
        };
        ctrl.trustAsHtml = function(data) {
            data = $filter('translate')(data);
            return $sce.trustAsHtml(data);
        };

        ctrl.getStatuses = function() {
            let requestData = { Payload:true };
            return scheduleDashboardStatusResource.fetch(requestData).$promise.then((data) => {
                ctrl.statuses = data.payload.labels;
            });
        };
        ctrl.getStatuses();
        ctrl.getStatusColor = function(statusName) {
            var statusColor = null;
            $.each(ctrl.statuses, (k, v) => {
                if (v.status.name == statusName) {
                    statusColor = v.colorCode;
                }
            });
            return statusColor;
        };

        ctrl.formatDate = function(elem, dateFormat) {
            // date = new Date(data).getTime();
            // return moment(data).format(format);

            if (elem) {
                var formattedDate = elem;
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
                return formattedDate;
            }
        };


        // /////////////////////////////////////////////////////////////////////////////////////////////////////////
        //  CHANGED LOOKUPS  //
        // ////////////////////

        ctrl.getListFilters = function(rowObj) {
            // 1. if any is null, set id: 0 to send to api
            if(rowObj.bunkeringLocation == null) {
                rowObj.bunkeringLocation = { id: 0 };
            }
            if(rowObj.product == null) {
                rowObj.product = { id: 0 };
            }
            if(rowObj.seller == null) {
                rowObj.seller = { id: 0 };
            }
            if(rowObj.requestId == null) {
                rowObj.requestId = 0;
            }

            // 2. filters array
            let filters = [
                { ColumnName: 'LocationId', Value: rowObj.bunkeringLocation.id },
                { ColumnName: 'ProductId', Value: rowObj.product.id },
                { ColumnName: 'SellerId', Value: rowObj.seller.id },
                { ColumnName: 'RequestId', Value: rowObj.requestId },
            ];

            return filters;
        };

        ctrl.triggerModalForTable = function(rowObj, idx) {
            // form filters for lookup
            let filters = ctrl.getListFilters(rowObj);

            // only lookup list to get from contract planning is contract
            var data = {
                template: 'general',
                clc: 'contractplanning_contractlist',
                name: 'Contract',
                id: `Contract_${ idx}`,
                formvalue: '',
                idx: '',
                field_name: `Contract_${ idx}`,
                filter: filters
            };

            // call trigger modal function with data
            ctrl.triggerModal(data.template, data.clc, data.name, data.id, data.formvalue, data.idx, data.field_name, data.filter);
        };

        // this function only broadcasts data to open modal with, function is handled by controller master
        ctrl.triggerModal = function(template, clc, name, id, formvalue, idx, field_name, filter) {
            var data = {
                template: template,
                clc: clc,
                name: name,
                id: id,
                formvalue: formvalue,
                idx: idx,
                field_name: field_name,
                filter: filter
            };
            // $scope.$emit('triggerListModal',{'listOptions': data });
            $rootScope.$broadcast('triggerListModal', { listOptions: data });
        };

        ctrl.initOptions = function(field, rowObj, idx) {
            // idx = row index
            if(field.field == 'contract') {
                // for each contract planning row, get typeahead options
                // store in $scope.options.Contract_idx
                // form filters for typeahead
                let filters = ctrl.getListFilters(rowObj);
                ctrl.getOptions({ Name: `Contract_${ idx}`, masterSource: 'contractplanning_contractlist' }, filters);
            }

            if(field.field == 'agreementType') {
                ctrl.getOptions({ Name: 'AgreementType', masterSource: 'AgreementType' });
            }
        };

        ctrl.getOptions = function(field, filters) {
            // get options for lookup typeahead
            // debugger;
            if (field) {
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
                // add contract filters
                if(field.Name.indexOf('Contract') >= 0) {
                    if(filters != null) {
                        // filters with big F
                        field.Filters = angular.copy(filters);
                    }
                }

                if (!$rootScope.cp_options) {
                    $rootScope.cp_options = [];
                }

                Factory_Master.get_master_list('procuremenet', 'contract-planning', field, (callback) => {
                    if (callback) {
                        $rootScope.cp_options[field.Name] = callback;
                        ContractPlanningDataSharing.options = {
                            optArray: $rootScope.cp_options
                        };
                        ContractPlanningDataSharing.updatedOptions();


                        // $rootScope.$watchGroup([$scope.formValues, $rootScope.cp_options], function() {
                        //     $timeout(function() {
                        //         if (field.Type == 'textUOM') {
                        //             id = '#' + field.Name;
                        //         } else {
                        //             id = '#' + field.masterSource + field.Name;
                        //         }
                        //         if ($(id).data('val')) {
                        //             $(id).val($(id).data('val'));
                        //         }
                        //     }, 50);
                        // })
                    }
                });
            }
        };


        // //////////////////////////
        //   END CHANGED LOOKUPS  //
        // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // call functions from ContractPlanningDataSharing service
        $scope.$watch(() => {
            return ContractPlanningDataSharing.callFunction;
        }, (newVal, oldVal) => {
            // first, check function hasn't been triggered yet (watch happens twice)
            let ok = true;
            // if(newVal.functionName == 'initTypeaheadOptions' || newVal.functionName == 'triggerModal'){
            //     if(newVal.params[1] == oldVal.params[1]){
            //         ok = false;
            //     }
            // }
            if(ok) {
                switch(newVal.functionName) {
                case 'selectContract':
                    ctrl.selectedContracts[newVal.params[1]] = newVal.params[0];
                    break;
                case 'contractPreviewEmail':
                    $rootScope.contractPreviewEmail();
                    break;
                case 'initOptions':
                    ctrl.initOptions(newVal.params[0], newVal.params[1], newVal.params[2]);
                    break;
                case 'triggerModal':
                    ctrl.triggerModalForTable(newVal.params[0], newVal.params[1]);
                    break;
                default:
                    console.log('Contract planning function not found!');
                }

                ContractPlanningDataSharing.callFunction = {
                    functionName: null,
                    params: []
                };
            }
        }, true);


        // table interaction functions
        // ctrl.selectContract = function(index){
        //     ctrl.selectedContracts[index] = true;
        // }

        // end table interaction functions
    }
]);
angular.module('shiptech.pages').component('contractPlanning', {
    templateUrl: 'pages/contract-planning/views/contract-planning-component.html',
    controller: 'ContractPlanningController'
});


angular.module('shiptech.pages').service('ContractPlanningDataSharing', function() {
    // this is the function which will be called from ContractPlanningController
    this.callFunction = {
        functionName: null,
        params: []
    };
    this.options = {
        optArray: []
    };

    this.selectContract = function(data) {
        this.callFunction.functionName = 'selectContract';
        this.callFunction.params = data;
    };

    this.selectProduct = function(data) {
        this.callFunction.functionName = 'selectProduct';
        this.callFunction.params = data;
    };

    this.contractPreviewEmail = function() {
        this.callFunction.functionName = 'contractPreviewEmail';
        this.callFunction.params = [];
    };

    this.getLookupList = function(data) {
        this.callFunction.functionName = 'getLookupList';
        this.callFunction.params = data;
    };

    this.initOptions = function(data) {
        this.callFunction.functionName = 'initOptions';
        this.callFunction.params = data;
    };

    this.contractplanningTriggerModal = function(data) {
        this.callFunction.functionName = 'triggerModal';
        this.callFunction.params = data;
    };

    this.updatedOptions = function() {
        this.callFunction.functionName = 'updatedOptions';
        this.callFunction.params = this.options;
    };
});
