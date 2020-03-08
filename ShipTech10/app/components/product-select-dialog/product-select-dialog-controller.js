angular.module('shiptech').controller('ProductSelectDialogController', [ '$scope', '$timeout', '$state', 'STATE', 'MOCKUP_MAP', 'uiApiModel', '$listsCache', '$Api_Service',
    function($scope, $timeout, $state, STATE, MOCKUP_MAP, uiApiModel, $listsCache, $Api_Service) {
        $scope.state = $state;
        $scope.STATE = STATE;
        let ctrl = this;
        ctrl.selectedRow = null;
        ctrl.checkboxes = [];
        ctrl.tableOptions = {};
        ctrl.tableOptions.order = null;
        ctrl.tableOptions.pageLength = 10;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        $scope.$on('selectedProduct', () => {
            console.log('mass');
        });
        ctrl.$onInit = function() {
            let endpoint = MOCKUP_MAP['unrouted.select-product-dialog'];
            // uiApiModel.get(endpoint).then(function(data) {
            // ctrl.ui = data;
            // });
            payload = {
			  app: 'masters',
			  screen: 'productlist',
			  clc_id: 'masters_productlist',
			  params: {
			    page: 1,
			    sort: '',
			    col: '',
			    rows: 999,
			    shrinkToFit: true,
			    query: '',
			    UIFilters: {},
			    filters: [],
			    modal: 'true',
			  }
            };
            $Api_Service.entity.list(payload, (callback) => {
                console.log(callback);
                filteredActiveProducts = [];
                $.each(callback.rows, (k, v) => {
                	if (!v.isDeleted) {
		                filteredActiveProducts.push(v);
                	}
                });
                ctrl.data = callback.rows;
            });
            ctrl.ui = {
                products: {
                    columns: [
                        {
                            name: 'checkbox',
                            caption: '',
                            skipRendering: true,
                            alwaysVisible: true,
                            sortable: false,
                            sortableName: ''
                        },
                        {
                            name: 'productId',
                            caption: 'Product ID',
                            visible: true,
                            sortable: true,
                            sortableName: 'productId'
                        },
                        {
                            name: 'displayName',
                            caption: 'Name',
                            visible: true,
                            sortable: true,
                            sortableName: 'displayName'
                        },
                        {
                            name: 'productType',
                            caption: 'Type',
                            visible: true,
                            sortable: true,
                            sortableName: 'productType.name'
                        },
                        {
                            name: 'createdBy',
                            caption: 'Created by',
                            visible: true,
                            sortable: true,
                            sortableName: 'createdBy'
                        },
                        {
                            name: 'createdOn',
                            caption: 'Created on',
                            visible: true,
                            sortable: true,
                            sortableName: 'createdOn'
                        },
                        {
                            name: 'lastModifiedBy',
                            caption: 'Last modified by',
                            visible: true,
                            sortable: true,
                            sortableName: 'lastModifiedBy'
                        },
                        {
                            name: 'lastModifiedOn',
                            caption: 'Last modified on',
                            visible: true,
                            sortable: true,
                            sortableName: 'lastModifiedOn'
                        },
                        {
                            name: 'isDeleted',
                            caption: 'Status',
                            visible: true,
                            sortable: true,
                            sortableName: 'isDeleted'
                        },
                    ]
                }
            };

            destroyDataTable();

            ctrl.table = initDatatable('#product_select');
            let info = ctrl.table.page.info();
            ctrl.tableOptions.totalRows = ctrl.data.length;
        };

        ctrl.toggleSelection = function(index, row) {
            for (let i = 0; i < ctrl.checkboxes.length; i++) {
                ctrl.checkboxes[i] = false;
            }
            ctrl.checkboxes[index] = true;
            ctrl.selectedRow = row;
        };
        ctrl.$onChanges = function(changes) {
            if (changes.filters.isFirstChange()) {
                return false;
            }
            ctrl.selectedCheckbox = null;
            ctrl.filters = changes.filters.currentValue;
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
         * Initializes the product select datatable.
         * @param {JSON} - The settings to use for DataTable initialization.
         * Must be JSON-normalized to the DataTables settings format!
         * @returns {Object} - The resulting DataTable object.
         */
        function initDatatable(selector, settings) {
            // Bind and initialize the DataTable.
            let table = ProductSelectDataTable.init({
                selector: selector,
                dom: 'Bflrt',
                columnDefs: [ {
                    targets: [ 0 ],
                    sortable: false
                } ]
            });
            // Re-place (move) the datatable searchbox in the main content menu, as per spec.
            replaceDataTableSearchBox('#product_select_filter', '#search_box_dummy_product');
            return table;
        }
        ctrl.confirmProductSelection = function() {
            if (!ctrl.selectedRow) {
                return;
            }
            let product = {
                product: {
                    name: ctrl.selectedRow.name,
                    id: ctrl.selectedRow.id,
                },
            };
            ctrl.onProductSelect({
                product: product
            });
            ctrl.checkboxes = [];
        };
    }
]);
