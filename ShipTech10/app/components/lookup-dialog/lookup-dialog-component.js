angular.module('shiptech.components').controller('LookupDialogController', [ '$scope', '$element', '$attrs', '$timeout', 'lookupModel', 'uiApiModel', 'MOCKUP_MAP', 'LOOKUP_TYPE',
    function($scope, $element, $attrs, $timeout, lookupModel, uiApiModel, MOCKUP_MAP, LOOKUP_TYPE) {
        $scope.Math = window.Math;
        let ctrl = this;
        let tableSelector = '#lookup_table';
        ctrl.table = null;
        ctrl.lookupType = null;
        ctrl.LOOKUP_TYPE = LOOKUP_TYPE;
        ctrl.tableData = [];
        ctrl.selectedRow = null;
        ctrl.checkboxes = [];
        ctrl.requestCheckboxes = [];
        ctrl.tableOptions = {};
        ctrl.tableOptions.order = [
            [ 1, 'asc' ]
        ];
        ctrl.tableOptions.pageLength = 25;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.tableOptions.searchTerm = null;

        $scope.search = function(value) {
            ctrl.tableOptions.searchTerm = value;
            var call;
            if (ctrl.supplierPortal) {
                call = lookupModel.getListForSupplierPortal(ctrl.supplierPortalToken, ctrl.lookupType, null, null, ctrl.tableOptions.filters, value);
            } else {
                call = lookupModel.getList(ctrl.lookupType, null, null, ctrl.tableOptions.filters, value, ctrl.vesselId, ctrl.args);
            }
            call.then((server_data) => {
                destroyDataTable();
                ctrl.tableData = server_data.payload;
                $timeout(() => {
                    ctrl.table = initDatatable(true);
                    // set flag to true if init comes from search
                    if(ctrl.table) {
	                    let info = ctrl.table.page.info();
	                    setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
	                    ctrl.tableOptions.totalRows = server_data.matchedCount;
	                    handleTableEvents();
                    }
                });
            });
        };

        function initDatatable(searchFlag) {
            let table = LookupDialogDataTable.init({
                dom: 'Bflrt',
                selector: tableSelector,
                pageLength: ctrl.tableOptions.pageLength,
                order: ctrl.tableOptions.order
            });
            replaceDataTableSearchBox('#lookup_table_filter');

            if(!searchFlag) {
                // only clear searchterm on table change
                // ctrl.tableOptions.searchTerm = null;
            }
            return table;
        }

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
        ctrl.$onInit = function() {
            let endpoint = MOCKUP_MAP['unrouted.lookup'];
            uiApiModel.get(endpoint).then((data) => {
                ctrl.ui = data;
                ctrl.tableOptions.searchTerm = null;
            });
        };
        ctrl.$onChanges = function(changes) {
            let call;
            ctrl.tableOptions.searchTerm = null;
            if (!changes.lookupType && ctrl.lookupType === LOOKUP_TYPE.VOYAGES && ctrl.vesselId) {
                ctrl.tableData = [];
                ctrl.tableOptions.order = [
                    [ 0, 'asc' ]
                ];
                setTimeout(() => {
                    $('#lookup').on('shown.bs.modal', () => {
                        $scope.search('');
                    });
                });
                return false;
            }
            if (!changes.lookupType) {
                return false;
            }
            if (changes.lookupType.isFirstChange()) {
                return false;
            }
            if (changes.lookupType.currentValue === LOOKUP_TYPE.VOYAGES && ctrl.vesselId) {
                ctrl.tableOptions.order = [
                    [ 0, 'asc' ]
                ];
            } else {
                ctrl.tableOptions.order = [
                    [ 1, 'asc' ]
                ];
            }
            ctrl.selectedCheckbox = null;
            ctrl.lookupType = changes.lookupType.currentValue;
            if (ctrl.supplierPortal) {
                call = lookupModel.getListForSupplierPortal(ctrl.supplierPortalToken, ctrl.lookupType, null, null, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm);
            } else {
                call = lookupModel.getList(ctrl.lookupType, null, null, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm, ctrl.vesselId, ctrl.args);
            }
            call.then((server_data) => {
                destroyDataTable(true);
                ctrl.tableData = server_data.payload;
                $timeout(() => {
                    ctrl.table = initDatatable();
                    let info = ctrl.table.page.info();
                    setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
                    ctrl.tableOptions.totalRows = server_data.matchedCount;
                    handleTableEvents();
                });
            });
            setTimeout(() => {
                $('#lookup').on('hidden.bs.modal', () => {
                    $scope.search('');
                });
            });
        };
        ctrl.toggleSelection = function(index, row) {
            for (let i = 0; i < ctrl.checkboxes.length; i++) {
                ctrl.checkboxes[i] = false;
            }
            ctrl.checkboxes[index] = true;
            ctrl.selectedRow = row;
        };
        ctrl.confirmLookupSelection = function() {
            if (!ctrl.selectedRow) {
                return;
            }
            console.log(ctrl.lookupType);
            switch (ctrl.lookupType) {
            case LOOKUP_TYPE.VESSEL:
                ctrl.onVesselSelect({
                    vessel: ctrl.selectedRow.id
                });
                break;
            case LOOKUP_TYPE.COMPANY:
                ctrl.onCompanySelect({
                    company: ctrl.selectedRow.id
                });
                break;
            case LOOKUP_TYPE.VOYAGES:
                ctrl.onLocationSelect({
                    location: ctrl.selectedRow.locationId,
                    extraDetails: ctrl.selectedRow
                });
                break;
            case LOOKUP_TYPE.LOCATIONS:
                ctrl.onLocationSelect({
                    location: ctrl.selectedRow.id
                });
                break;
            case LOOKUP_TYPE.PRODUCTS:
                ctrl.onProductSelect({
                    product: ctrl.selectedRow.id
                });
                break;
            case LOOKUP_TYPE.REQUEST:
                ctrl.onRequestSelect({
                    request: ctrl.selectedRow
                });
                break;
            case LOOKUP_TYPE.SERVICES:
                ctrl.onServiceSelect({
                    service: ctrl.selectedRow.id
                });
                break;
            case LOOKUP_TYPE.BUYER:
                ctrl.onBuyerSelect({
                    buyer: ctrl.selectedRow
                });
                break;
            case LOOKUP_TYPE.CONTRACT:
                ctrl.onContractSelect({
                    contractId: ctrl.selectedRow.id1
                });
                break;
            case LOOKUP_TYPE.PAYMENT_TERM:
                ctrl.onPaymentTermSelect({
                    paymentTerm: ctrl.selectedRow
                });
                break;
            case LOOKUP_TYPE.BARGE:
                ctrl.onBargeSelect({
                    barge: ctrl.selectedRow
                });
                break;
            case LOOKUP_TYPE.TRADER:
                ctrl.onTraderSelect({
                    trader: ctrl.selectedRow
                });
                break;
            case LOOKUP_TYPE.NO_QUOTE_RESON:
                ctrl.onReasonSelect({
                    reason: ctrl.selectedRow
                });
                break;
            }
            ctrl.checkboxes = [];
            $scope.search('');
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
            // if(tableOrder.column === 'contractName') tableOrder.column = 'name';
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
            var tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
            setTableVars(tablePagination.length, tablePagination.start);
            if (ctrl.supplierPortal) {
                call = lookupModel.getListForSupplierPortal(ctrl.supplierPortalToken, ctrl.lookupType, tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm);
            } else {
                call = lookupModel.getList(ctrl.lookupType, tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm, ctrl.vesselId, ctrl.args);
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
                console.log(ctrl.tableOptions.searchTerm);
                let neworder = angular.copy(ctrl.table.order().slice(0));
                let tableOrder;
                // reset pagination
                let tablePagination = {};
                tablePagination.start = 0;
                tablePagination.length = ctrl.tableOptions.pageLength;
                tableOrder = normalizeDatatablesOrder(neworder);
                if (ctrl.supplierPortal) {
                    call = lookupModel.getListForSupplierPortal(ctrl.supplierPortalToken, ctrl.lookupType, tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm);
                } else {
                    call = lookupModel.getList(ctrl.lookupType, tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm, ctrl.vesselId, ctrl.args);
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
                ctrl.tableOptions.pageLength = len;
                var tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
                setTableVars(tablePagination.length, tablePagination.start);
                if (ctrl.supplierPortal) {
                    call = lookupModel.getListForSupplierPortal(ctrl.supplierPortalToken, ctrl.lookupType, tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm);
                } else {
                    call = lookupModel.getList(ctrl.lookupType, tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm, ctrl.vesselId, ctrl.args);
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
angular.module('shiptech.components').component('lookupDialog', {
    templateUrl: 'components/lookup-dialog/views/lookup-dialog-component.html',
    controller: 'LookupDialogController',
    bindings: {
        lookupType: '<',
        supplierPortal: '<',
        supplierPortalToken: '<',
        args: '<',
        vesselId: '<',
        onVesselSelect: '&',
        onCompanySelect: '&',
        onLocationSelect: '&',
        onDestinationSelect: '&',
        onProductSelect: '&',
        onRequestSelect: '&',
        onServiceSelect: '&',
        onBuyerSelect: '&',
        onContractSelect: '&',
        onPaymentTermSelect: '&',
        onBargeSelect: '&',
        onReasonSelect: '&'
    }
});
