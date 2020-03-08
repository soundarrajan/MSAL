angular.module('shiptech').controller('SuppliersDialogController', [ '$scope', '$state', '$timeout', 'STATE', 'MOCKUP_MAP', 'LOOKUP_TYPE', 'uiApiModel', 'lookupModel',
    function($scope, $state, $timeout, STATE, MOCKUP_MAP, LOOKUP_TYPE, uiApiModel, lookupModel) {
        $scope.state = $state;
        $scope.STATE = STATE;

        let ctrl = this;
        let tableSelector = '#suppliers_table';

        ctrl.table = null;
        ctrl.tableData = [];
        ctrl.checkboxes = [];

        ctrl.selectedRow = null;

        ctrl.tableOptions = {};
        ctrl.tableOptions.order = [ [ 0, 'asc' ] ];
        ctrl.tableOptions.pageLength = 25;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;


        ctrl.sellerTypes = null;
        ctrl.filters = null;

        let suppliersDialogEndpoint = MOCKUP_MAP['unrouted.sellers-dialog'];

        function initDatatable() {
            let table = LookupDialogDataTable.init(
                {
                    dom: 'Bflrt',
                    selector: tableSelector,
                    pageLength: ctrl.tableOptions.pageLength,
                    order: ctrl.tableOptions.order
                }
            );

            // Re-place (move) the datatable searchbox in the main content menu, as per spec.
            replaceDataTableSearchBox('#suppliers_table_filter', '#search_box_dummy_suppliers');

            return table;
        }


        ctrl.$onInit = function() {
            uiApiModel.get(suppliersDialogEndpoint).then((data) => {
                ctrl.ui = data;
            });
        };


        ctrl.$onChanges = function(changes) {
            let call;

            if (changes.sellerTypes) {
                ctrl.sellerTypes = changes.sellerTypes.currentValue;
            }

            if (!ctrl.sellerTypes) {
                return false;
            }

            if (typeof changes.filters !== 'undefined' && changes.filters.isFirstChange()) {
                return false;
            }

            if (changes.filters) {
                ctrl.filters = changes.filters.currentValue;
            }

            if(ctrl.supplierPortal) {
                call = lookupModel.getSellerListForSupplierPortal(ctrl.supplierPortalToken, ctrl.sellerTypes, null, null, ctrl.filters);
            } else {
                call = lookupModel.getSellerList(ctrl.sellerTypes, null, null, ctrl.filters);
            }

            call.then((server_data) => {
                destroyDataTable();
                ctrl.tableData = server_data.payload;

                $timeout(() => {
                    ctrl.checkboxes = [];
                    ctrl.table = initDatatable();
                    let info = $(tableSelector).DataTable().page.info();
                    setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
                    ctrl.tableOptions.totalRows = server_data.matchedCount;
                    handleTableEvents();
                });
            });
        };

        ctrl.toggleSelection = function(index, row) {
            for (let i = 0; i < ctrl.checkboxes.length; i++) {
                if (index !== i) {
                    ctrl.checkboxes[i] = false;
                }
            }
            ctrl.checkboxes[index] = true;

            ctrl.selectedRow = row;
        };

        function destroyDataTable() {
            // different destroy handling from lookup since we cannot re-create the sellers table if datatables completely deletes it
            if(ctrl.table) {
                ctrl.table.off('order.dt');
                ctrl.table.off('length.dt');
                ctrl.table.destroy();
                ctrl.table = null;
            }
        }

        ctrl.confirmSuppliersSelection = function() {
            ctrl.onSupplierSelect({ sellerId: ctrl.selectedRow });
            ctrl.checkboxes = [];
        };

        /**
        * Change datatable order to match server required format
        * @param {Array} - The order format from datatables.
        * @returns {Object} - normalized object representing a human-readable table order
        */
        function normalizeDatatablesOrder(datatablesOrderArray) {
            let tableOrder = {};
            datatablesOrderArray = datatablesOrderArray[0];

            tableOrder.column = $(ctrl.table.column(datatablesOrderArray[0]).header()).data('columnName');
            tableOrder.order = datatablesOrderArray[1];

            return tableOrder;
        }


        /**
        * Set table parameters
        * @param {int} length - count of items on each page of the table.
        * @param {int} start - item number start of current page of the table.
        * @param {Object} order - sort order of the table.
        */
        function setTableVars(length, start, order) {
            if (typeof length != 'undefined' && length !== null) {
                ctrl.tableOptions.pageLength = length;
            }
            if (typeof start != 'undefined' && start !== null) {
                ctrl.tableOptions.paginationStart = start;
            }
            if (typeof order != 'undefined' && order !== null) {
                ctrl.tableOptions.order = order;
            }

            ctrl.tableOptions.currentPage = ctrl.tableOptions.paginationStart / ctrl.tableOptions.pageLength + 1;
        }

        /**
        * Go to table page taking into account current table options
        * @param {int} page - page to switch to.
        */
        ctrl.setPage = function(page) {
            let call;

            if (page < 1 || page >= ctrl.tableOptions.totalRows / ctrl.tableOptions.pageLength + 1) {
                return false;
            }

            let tablePagination = {};
            tablePagination.start = (page - 1) * ctrl.tableOptions.pageLength;
            tablePagination.length = ctrl.tableOptions.pageLength;
            tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);

            setTableVars(tablePagination.length, tablePagination.start);

            if(ctrl.supplierPortal) {
                call = lookupModel.getSellerListForSupplierPortal(ctrl.supplierPortalToken, ctrl.sellerTypes, tableOrder, tablePagination, ctrl.filters);
            } else {
                call = lookupModel.getSellerList(ctrl.sellerTypes, tableOrder, tablePagination, ctrl.filters);
            }

            call.then((server_data) => {
                ctrl.tableData = server_data.payload;
                ctrl.checkboxes = [];
                $timeout(() => {
                    ctrl.table.columns.adjust();
                });
            });
        };

        /**
        * Initializes all user events on the table (pagination, sorting, searching)
        */
        function handleTableEvents() {
            let table = $(tableSelector),
                call;

            table.on('order.dt', (e) => {
                let neworder = angular.copy(ctrl.table.order().slice(0));
                let tableOrder;
                // reset pagination
                let tablePagination = {};
                tablePagination.start = 0;
                tablePagination.length = ctrl.tableOptions.pageLength;

                tableOrder = normalizeDatatablesOrder(neworder);

                if(ctrl.supplierPortal) {
                    call = lookupModel.getSellerListForSupplierPortal(ctrl.supplierPortalToken, ctrl.sellerTypes, tableOrder, tablePagination, ctrl.filters);
                } else {
                    call = lookupModel.getSellerList(ctrl.sellerTypes, tableOrder, tablePagination, ctrl.filters);
                }

                call.then((server_data) => {
                    destroyDataTable();
                    ctrl.tableData = server_data.payload;
                    setTableVars(ctrl.tableOptions.pageLength, 0, neworder);

                    $timeout(() => {
                        ctrl.table = initDatatable();
                        handleTableEvents();
                    });
                });
            });

            table.on('length.dt', (e, settings, len) => {
                let info = ctrl.table.page.info(),
                    tablePagination = {},
                    call;

                tablePagination.start = info.start;
                tablePagination.length = len;
                ctrl.pageLength = len;
                tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);

                setTableVars(tablePagination.length, tablePagination.start);

                if(ctrl.supplierPortal) {
                    call = lookupModel.getSellerListForSupplierPortal(ctrl.supplierPortalToken, ctrl.sellerTypes, tableOrder, tablePagination, ctrl.filters);
                } else {
                    call = lookupModel.getSellerList(ctrl.sellerTypes, tableOrder, tablePagination, ctrl.filters);
                }

                call.then((server_data) => {
                    destroyDataTable();
                    ctrl.tableData = server_data.payload;

                    $timeout(() => {
                        ctrl.table = initDatatable();
                        handleTableEvents();
                    });
                });
            });
        }
    }
]);
angular.module('shiptech.components').component('suppliersDialog', {
    templateUrl: 'components/suppliers-dialog/views/suppliers-dialog-component.html',
    controller: 'SuppliersDialogController',
    bindings: {
        sellerTypes: '<',
        supplierPortal: '<',
        supplierPortalToken: '<',
        filters: '<',
        onSupplierSelect: '&',
        onSellerContractSelect: '&'
    }
});
