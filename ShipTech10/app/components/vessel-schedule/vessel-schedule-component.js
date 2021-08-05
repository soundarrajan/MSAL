angular.module('shiptech').controller('VesselScheduleController', [ '$scope','$rootScope', '$state', '$timeout', '$filter', '$tenantSettings', 'STATE', 'MOCKUP_MAP', 'LOOKUP_TYPE', 'uiApiModel', 'lookupModel',
    function($scope,$rootScope, $state, $timeout, $filter, $tenantSettings, STATE, MOCKUP_MAP, LOOKUP_TYPE, uiApiModel, lookupModel) {
        $scope.state = $state;
        $scope.Math = window.Math;
        $scope.STATE = STATE;
        let tableSelector = '#lookup_table';
        let ctrl = this;
        ctrl.table = null;
        ctrl.selectedLocations = [];
        ctrl.EnableSingleSelect = false
        let vesselScheduleEndpoint = MOCKUP_MAP['unrouted.vessel-schedule'];
        ctrl.searchTerm = null;
        ctrl.tableOptions = {};
        ctrl.tableOptions.order = [
            [ 1, 'asc' ]
        ];
        ctrl.tableOptions.pageLength = 25;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.$onInit = function() { 

            
            uiApiModel.get(vesselScheduleEndpoint).then((data) => {
                ctrl.ui = data;
            });
        };
        ctrl.$onChanges = function(changes) {
            if (changes.vesselId.isFirstChange() || changes.vesselId.currentValue == 0) {
                return false;
            }
        };

        $scope.search = function(value) {
            ctrl.searchTerm =value;
            lookupModel.getList(LOOKUP_TYPE.LOCATIONS, null, null,{},ctrl.searchTerm ).then((data) => {
                destroyDataTable();
                ctrl.data = data.payload;
                ctrl.tableOptions.totalRows = data.matchedCount;
                ctrl.data1 = angular.copy(data.payload);
                $timeout(() => {
                debugger;
                    ctrl.table = initDatatable(true);
                    // set flag to true if init comes from search
                    if(ctrl.table) {
                        let info = ctrl.table.page.info();
                        setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
                        handleTableEvents();
                    }                       
                });
            });
        };
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
        };
        /**
         * Go to table page taking into account current table options
         * @param {int} page - page to switch to.
         */
        ctrl.setPage = function(page) {
            if(ctrl.selectedLocationsSingle!==undefined){
                ctrl.selectedLocationsSingle[ctrl.indexVoyage]=false;
            }
            let call;
            if (page < 1 || page >= ctrl.tableOptions.totalRows / ctrl.tableOptions.pageLength + 1) {
                return false;
            }
            let tablePagination = {};
            tablePagination.start = (page - 1) * ctrl.tableOptions.pageLength;
            tablePagination.length = ctrl.tableOptions.pageLength;
            setTableVars(tablePagination.length, tablePagination.start);
            call = lookupModel.getList(LOOKUP_TYPE.LOCATIONS, null, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm, null, ctrl.args);
            call.then((server_data) => {
                ctrl.data = server_data.payload;
                ctrl.data1 = server_data.payload;
                ctrl.checkboxes = [];
            });
        };
        function Getlocation(){
            if(ctrl.selectedLocationsSingle!==undefined){
                ctrl.selectedLocationsSingle[ctrl.indexVoyage]=false;
            }
            lookupModel.getList(LOOKUP_TYPE.LOCATIONS, null, null, ctrl.tableOptions.filters,ctrl.searchTerm,ctrl.args).then((data) => {
                destroyDataTable();
                ctrl.data = data.payload;
                ctrl.tableOptions.totalRows = data.matchedCount;
                ctrl.data1 = angular.copy(data.payload);
                $timeout(() => {
                    ctrl.table = initDatatable(true);
                    // set flag to true if init comes from search
                    if(ctrl.table) {
                        let info = ctrl.table.page.info();
                        setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
                        handleTableEvents();
                    }                       
                });
            });
        }
	    $scope.$on('getVesselSchedules', (evt, value,EnableSingleselect,Page, Filters) => {
            let filterPayload = [];
            ctrl.EnableSingleSelect = EnableSingleselect;
            if(Page == 'NewOrder'){
                ctrl.isvoyagePortchangeEnabled = true;
            }else if(Page == "NewRequest"){
                ctrl.isvoyagePortchangeEnabled = false;
                ctrl.islocationPortEnabled = false;
            }
            else{
                ctrl.isvoyagePortchangeEnabled = false;
                ctrl.islocationPortEnabled = true; 
                Getlocation();
            }
            // $scope.accessSelection = value;
 	       if (value == 0) {
                return false;
             }

             if(Filters?.length) {
                filterPayload = Filters;
             } else {
                filterPayload = {
                    ColumnName: 'Id',
                    OperationType: 0,
                    ValueType: 5,
                    Value: value
                }
             }
            if(!ctrl.islocationPortEnabled){
                lookupModel.getList(LOOKUP_TYPE.VESSEL_SCHEDULE, null, null, filterPayload).then((data) => {
                    ctrl.data = data.payload;
                    ctrl.data1 = angular.copy(data.payload);
                    $.each(ctrl.data, (k, v) => {
                        v.eta = $scope.formatDate(v.eta);
                        v.etb = $scope.formatDate(v.etb);
                        v.etd = $scope.formatDate(v.etd);
                    });
                    destroyDataT();
                    $timeout(() => {
                        ctrl.table = SimpleDatatable.init({
                            selector: '.simple-datatable',
                            order: [
                                [ 0, 'asc' ]
                            ]
                        });
                        $('.table').dataTable();
                    });
                });
            }
        });
        $scope.formatDateToMomentFormat = function(dateFormat) {
            var dbFormat = dateFormat;
            var hasDayOfWeek = false;
            var currentFormat = angular.copy(dateFormat);
            if (currentFormat.startsWith('DDD ')) {
                hasDayOfWeek = true;
                currentFormat = currentFormat.split('DDD ')[1];
            }
            currentFormat = currentFormat.replace(/d/g, 'D');
            currentFormat = currentFormat.replace(/y/g, 'Y');
            if (hasDayOfWeek) {
                currentFormat = `ddd ${ currentFormat}`;
            }
            return currentFormat;
        };
        $scope.momentDateFormat = $scope.formatDateToMomentFormat($tenantSettings.tenantFormats.dateFormat.name);

        function destroyDataT() {
            if (ctrl.table) {
                ctrl.table.fnDestroy();
                ctrl.table = null;
            }
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
        };
        $scope.formatDate = function(cellValue) {
            
            let dateFormat = $scope.momentDateFormat;
            let hasDayOfWeek = false;
            dateFormat = dateFormat.replace(/D/g, 'd').replace(/Y/g, 'y');
            var formattedDate = moment(cellValue).format($scope.momentDateFormat);
            if (formattedDate) {
                let array = formattedDate.split(' ');
                let format = [];
                $.each(array, (k, v) => {
                    if (array[k] != '00:00') {
                        format = `${format + array[k] } `;
                    }
                });
                formattedDate = format;
            }

            if (formattedDate) {
                if (formattedDate.indexOf('0001') != -1) {
                    formattedDate = '';
                }
            }
            if (cellValue != null) {
                return formattedDate;
            }
            return '';
        };
        
        function initDatatable(searchFlag) {
            let table = LookupDialogDataTable.init({
                dom: 'Bflrtip',
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
        };


        $scope.selectedLocationsSingle = function(index){
            ctrl.indexVoyage=index;
            ctrl.selectedLocationsSingle = [];
            ctrl.selectedLocationsSingle[index] = true;
        };
        ctrl.confirmVesselSchedulesOrderSelection = function() {
            let selectedLocations = [];
            angular.forEach(ctrl.selectedLocationsSingle, (value, key) => {
                if (value) {
                    // if(ctrl.data[key].destinationVesselVoyageDetailId) {
                    ctrl.data[key].destinationName = [
                        ctrl.data[key].destinationLocationCode,
                        ctrl.data[key].voyageCode,
                        ctrl.data[key].destinationEtaFormated,
                        ctrl.data[key].eta,
                        ctrl.data[key].recentETA,
                    ].join(' - ');
                    // }
                    selectedLocations.push(ctrl.data1[key]);
                }
            });
            ctrl.onVesselSchedulesSelect({
                locations: selectedLocations
            });
            ctrl.selectedLocations = [];
        };
        ctrl.confirmPortSelection = function () {
            var index = ctrl.indexVoyage;
            ctrl.selectedPortMinQty = ctrl.data1[index];
            $rootScope.$broadcast('getSelectedPortMinQty', ctrl.selectedPortMinQty, false, 'NewRequestMinQty');
        };
        ctrl.confirmVesselSchedulesSelection = function() {

            let selectedLocations = [];
            angular.forEach(ctrl.selectedLocations, (value, key) => {
                if (value) {
                    // if(ctrl.data[key].destinationVesselVoyageDetailId) {
                    ctrl.data[key].destinationName = [
                        ctrl.data[key].destinationLocationCode,
                        ctrl.data[key].voyageCode,
                        ctrl.data[key].destinationEtaFormated,
                    ].join(' - ');
                    // }
                    selectedLocations.push(ctrl.data1[key]);
                }
            });
            ctrl.onVesselSchedulesSelect({
                locations: selectedLocations
            });
            // Port call select only for single location and no more multi select option there
            ctrl.onPortCallSelect({
                locations: (ctrl?.indexVoyage!=undefined)? ctrl.data[ctrl.indexVoyage]: selectedLocations[selectedLocations.length-1]
            });
            
            ctrl.selectedLocations = [];
        };
        ctrl.confirmVesselSchedulesSingleSelection = function() {
            let selectedLocations = [];
            angular.forEach(ctrl.selectedLocations, (value, key) => {
                if (value) {
                    // if(ctrl.data[key].destinationVesselVoyageDetailId) {
                    ctrl.data[key].destinationName = [
                        ctrl.data[key].destinationLocationCode,
                        ctrl.data[key].voyageCode,
                        ctrl.data[key].destinationEtaFormated,
                    ].join(' - ');
                    // }
                    selectedLocations.push(ctrl.data1[key]);
                }
            });
            ctrl.onVesselSchedulesSelect({
                locations: selectedLocations
            });
            ctrl.selectedLocations = [];
        };
        /**
         * Initializes all user events on the table (pagination, sorting, searching)
         */
        function handleTableEvents() {
        let table = $(tableSelector),
            call;
        table.on('length.dt', (e, settings, len) => {
            let info = ctrl.table.page.info(),
                tablePagination = {},
                call;
            tablePagination.start = info.start;
            tablePagination.length = len;
            ctrl.tableOptions.pageLength = len;
            setTableVars(tablePagination.length, tablePagination.start);
            call = lookupModel.getList(LOOKUP_TYPE.LOCATIONS, null, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm, null, ctrl.args);
            call.then((server_data) => {
                destroyDataTable();
                ctrl.data = server_data.payload;
                ctrl.data1 = server_data.payload;
                $timeout(() => {
                    ctrl.table = initDatatable();
                    handleTableEvents();
                });
            });
        });
        };
    }
]);
angular.module('shiptech.components').component('vesselSchedule', {
    templateUrl: 'components/vessel-schedule/views/vessel-schedule-component.html',
    controller: 'VesselScheduleController',
    bindings: {
        vesselId: '<',
        onVesselSchedulesSelect: '&',
        onPortCallSelect: '&',
        args: '<',
    }
});

