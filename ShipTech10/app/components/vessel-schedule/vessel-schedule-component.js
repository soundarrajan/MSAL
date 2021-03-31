angular.module('shiptech').controller('VesselScheduleController', [ '$scope', '$state', '$timeout', '$filter', '$tenantSettings', 'STATE', 'MOCKUP_MAP', 'LOOKUP_TYPE', 'uiApiModel', 'lookupModel',
    function($scope, $state, $timeout, $filter, $tenantSettings, STATE, MOCKUP_MAP, LOOKUP_TYPE, uiApiModel, lookupModel) {
        $scope.state = $state;
        $scope.STATE = STATE;
        let ctrl = this;
        ctrl.table = null;
        ctrl.selectedLocations = [];
        ctrl.EnableSingleSelect = false
        let vesselScheduleEndpoint = MOCKUP_MAP['unrouted.vessel-schedule'];
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

	    $scope.$on('getVesselSchedules', (evt, value,EnableSingleselect) => {
            
            ctrl.EnableSingleSelect = EnableSingleselect;
        // $scope.accessSelection = value;
 	       if (value == 0) {
                return false;
            }

            lookupModel.getList(LOOKUP_TYPE.VESSEL_SCHEDULE, null, null, {
                ColumnName: 'Id',
                OperationType: 0,
                ValueType: 5,
                Value: value
            }).then((data) => {
                ctrl.data = data.payload;
                ctrl.data1 = angular.copy(data.payload);
                $.each(ctrl.data, (k, v) => {
                    v.eta = $scope.formatDate(v.eta);
                    v.etb = $scope.formatDate(v.etb);
                    v.etd = $scope.formatDate(v.etd);
                });
                destroyDataTable();
                $timeout(() => {
                    ctrl.table = SimpleDatatable.init({
                        selector: '.simple-datatable',
                        order: [
                            [ 0, 'asc' ]
                        ]
                    });
                });
            });
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

        function destroyDataTable() {
            if (ctrl.table) {
                ctrl.table.fnDestroy();
                ctrl.table = null;
            }
        }
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
        ctrl.selectedLocationsSingle = function(index){
        ctrl.selectedLocations = [];
        ctrl.selectedLocations[index] = true;
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
    }
]);
angular.module('shiptech.components').component('vesselSchedule', {
    templateUrl: 'components/vessel-schedule/views/vessel-schedule-component.html',
    controller: 'VesselScheduleController',
    bindings: {
        vesselId: '<',
        onVesselSchedulesSelect: '&',
    }
});

