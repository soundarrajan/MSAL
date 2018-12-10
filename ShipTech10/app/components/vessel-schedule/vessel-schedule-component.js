angular.module('shiptech').controller('VesselScheduleController', ['$scope', '$state', '$timeout', 'STATE', 'MOCKUP_MAP', 'LOOKUP_TYPE', 'uiApiModel', 'lookupModel',
    function($scope, $state, $timeout, STATE, MOCKUP_MAP, LOOKUP_TYPE, uiApiModel, lookupModel) {
        $scope.state = $state;
        $scope.STATE = STATE;
        var ctrl = this;
        ctrl.table = null;
        ctrl.selectedLocations = [];
        var vesselScheduleEndpoint = MOCKUP_MAP['unrouted.vessel-schedule'];
        ctrl.$onInit = function() {
            uiApiModel.get(vesselScheduleEndpoint).then(function(data) {
                ctrl.ui = data;
            });
        };
        ctrl.$onChanges = function(changes) {
            if (changes.vesselId.isFirstChange()) {
                return false;
            }
            lookupModel.getList(LOOKUP_TYPE.VESSEL_SCHEDULE, null, null, {
                ColumnName: 'Id',
                OperationType: 0,
                ValueType: 5,
                Value: changes.vesselId.currentValue
            }).then(function(data) {
                ctrl.data = data.payload;
                destroyDataTable();
                $timeout(function() {
                    ctrl.table = SimpleDatatable.init({
                        selector: '.simple-datatable',
                        order: [
                            [0, "asc"]
                        ]
                    });
                });
            });
        };

        function destroyDataTable() {
            if (ctrl.table) {
                ctrl.table.fnDestroy();
                ctrl.table = null;
            }
        }

        ctrl.confirmVesselSchedulesSelection = function() {
            var selectedLocations = [];
            angular.forEach(ctrl.selectedLocations, function(value, key) {
                if (value) {
                  // if(ctrl.data[key].destinationVesselVoyageDetailId) {
                    ctrl.data[key].destinationName = [
                      ctrl.data[key].destinationLocationCode,
                      ctrl.data[key].voyageCode,
                      ctrl.data[key].destinationEtaFormated,
                    ].join(' - ');
                  // }
                  selectedLocations.push(ctrl.data[key]);
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
