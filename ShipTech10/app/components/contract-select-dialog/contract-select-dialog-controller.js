angular.module('shiptech').controller('ContractSelectDialogController', ['$scope', '$timeout', '$state', 'STATE', 'selectContractModel', 'MOCKUP_MAP', 'uiApiModel', 'screenLoader', '$tenantSettings',
    function($scope, $timeout, $state, STATE, selectContractModel, MOCKUP_MAP, uiApiModel, screenLoader, $tenantSettings) {
        $scope.state = $state;
        $scope.STATE = STATE;
        var ctrl = this;
        ctrl.selectedRow = null;
        ctrl.checkboxes = [];
        ctrl.tableOptions = {};
        ctrl.tableOptions.order = null;
        ctrl.tableOptions.pageLength = 10;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.tenantSettings = $tenantSettings;
        $scope.$on('selectedContarct', function() {
            console.log('mass');
        });
        ctrl.$onInit = function() {
            var endpoint = MOCKUP_MAP['unrouted.select-contract-dialog'];
            uiApiModel.get(endpoint).then(function(data) {
                ctrl.ui = data;
            });
        };
        ctrl.toggleSelection = function(index, row) {
            for (var i = 0; i < ctrl.checkboxes.length; i++) {
                ctrl.checkboxes[i] = false;
            }
            ctrl.checkboxes[index] = true;
            ctrl.selectedRow = row;
        };
        ctrl.$onChanges = function(changes) {
            if (changes.filters.isFirstChange()) {
                return false;
            }
            ctrl.filters = changes.filters.currentValue;
            ctrl.data = null;
			$("contract-select-dialog").css({
				top: "45%",
			})	
			screenLoader.isLoading();
			$("contract-select-dialog").css("opacity", "0")
			$("contract-select-dialog").css("margin-top", "-100px");
			ctrl.refreshedSelectDialog = false;
			ctrl.toggleSelection(null, null);
            selectContractModel.getSuggestedContracts(null, null, ctrl.filters).then(function(server_data) {
				
				ctrl.refreshedSelectDialog = true;
				ctrl.selectedCheckbox = null;
				ctrl.selectedRow = null;
				ctrl.toggleSelection(null, null);
                
                // destroyDataTable();
				screenLoader.finishLoading();
                ctrl.data = server_data.payload;
				$("contract-select-dialog").css({
					top: "0",
					marginTop: "15px",
				})	
                // if (ctrl.data.length == 0) {
                // }
                	setTimeout(function(){
    					$("contract-select-dialog").css({
							top: "0",
							marginTop: "15px",
							opacity: "1",
						})		
                	},500)
                // $timeout(function() {
                //     // ctrl.table = initDatatable('#contract_select');
                //     // var info = ctrl.table.page.info();
                //     // setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
                //     // ctrl.tableOptions.totalRows = server_data.matchedCount;
                //     // handleTableEvents();
                // });
            }, function(){
            	setTimeout(function(){
					screenLoader.finishLoading();
					$("contract-select-dialog").css({
						top: "0",
						marginTop: "15px",
						opacity: "1",
					})	
            	},500)
            });
        };

        function destroyDataTable(clearHtml) {
            if (ctrl.table) {
                ctrl.table.off('order.dt');
                ctrl.table.off('length.dt');
                if (clearHtml) {
                    ctrl.table.destroy(true);
                } else {
                    ctrl.table.destroy();
                }
                ctrl.table = null;
            }
        }
        /**
         * Initializes the contract select datatable.
         * @param {JSON} - The settings to use for DataTable initialization.
         * Must be JSON-normalized to the DataTables settings format!
         * @return {Object} - The resulting DataTable object.
         */
        function initDatatable(selector, settings) {
            // Bind and initialize the DataTable.
            var table = ContractSelectDataTable.init({
                selector: selector,
                dom: 'Bflrt',
                columnDefs: [{
                    targets: [0],
                    sortable: false
                }]
            });
            // Re-place (move) the datatable searchbox in the main content menu, as per spec.
            replaceDataTableSearchBox('#contract_select_filter', '#search_box_dummy_contract');
            return table;
        }
        ctrl.confirmContractSelection = function() {
            if (!ctrl.selectedRow) {
                return;
            }
            var contract = {
                contract: {
                    name: ctrl.selectedRow.contractName,
                    id: ctrl.selectedRow.id1,
                },
                seller: ctrl.selectedRow.seller,
                contractProductId: ctrl.selectedRow.contractProductId,
                formulaDescription: ctrl.selectedRow.formula,
                deliveryPrice: ctrl.selectedRow.fixedPrice,
                premiumDiscount: ctrl.selectedRow.premiumDiscount,
                noOfDaysBeforeExpiry: ctrl.selectedRow.noOfDaysBeforeExpiry,
                minQuantity: ctrl.selectedRow.minQuantity,
                maxQuantity: ctrl.selectedRow.maxQuantity
            };
            ctrl.onContractSelect({
                contract: contract
            });
            ctrl.checkboxes = [];
        };

		$('contract-select-dialog').on('hidden.bs.modal', function () {
		    // ctrl.checkboxes = null;
		    // ctrl.selectedRow = null;
		});

    }
]);