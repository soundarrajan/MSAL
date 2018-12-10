angular.module("shiptech.pages")
    .controller("ContractEvaluationController", ["$window", "$scope", "$element", "$attrs", "$state", "$stateParams", "$timeout", "STATE", "uiApiModel", "selectContractModel",
        function($window, $scope, $element, $attrs, $state, $stateParams, $timeout, STATE, uiApiModel, selectContractModel) {

            $scope.STATE = STATE;
            var ctrl = this;

            ctrl.contractId = $stateParams.contractId;
            ctrl.requestId = $stateParams.requestId;

            ctrl.checkboxes = [];

            ctrl.$onInit = function() {
                uiApiModel.get().then(function(data){
                    ctrl.ui = data;

                    //Normalize relevant data for use in the template.
                    ctrl.evaluationsColumns = normalizeArrayToHash(ctrl.ui.evaluations.columns, 'name');


                    selectContractModel.getContractEvaluations({requestId: ctrl.requestId, contractId: ctrl.contractId}).then(function(data) {
                        ctrl.data = data.payload;

                        $timeout(function() {
                            //hack to remove backdrop when coming from modal (TODO: fix on modal side)
                            $(".modal-backdrop").remove();

                            ctrl.table = initDataTable('#contract_evaluation', ctrl.settings);
                        });
                    });
                });
            };

            /**
            * Initializes the Schedule Dashboard Table datatable.
            * @param {JSON} - The settings to use for DataTable initialization.
            * Must be JSON-normalized to the DataTables settings format!
            * @return {Object} - The resulting DataTable object.
            */
            function initDataTable(selector, settings) {

                // Bind and initialize the DataTable.
                var table = ContractEvaluationDataTable.init({
                                selector: selector,
                                dom: 'Bflrtip'
                            });


                // Re-place (move) the datatable searchbox in the main content menu, as per spec.
                replaceDataTableSearchBox('#contract_evaluation_filter');
                return table;
            }

            ctrl.getUIContractColumnByIndex = function(index) {
                var offset = 2; // Account for the Parameter and Weight columns before the Contract columns.

                return ctrl.ui.evaluations.columns[index + offset];
            };

            //get checked contract and add it to selected contracts
            ctrl.selectContract = function() {
                var contractId = ctrl.selectedRow.id;

                $state.go(STATE.SELECT_CONTRACT, {requestId: ctrl.requestId, contractId: contractId});
            };

            ctrl.toggleSelection = function(index, row) {
                for (var i = 0; i < ctrl.checkboxes.length; i++) {
                    ctrl.checkboxes[i] = false;
                }
                ctrl.checkboxes[index] = true;

                ctrl.selectedRow = row;
            };

            ctrl.goBack = function() {
                $window.history.back();
            };
}]);

angular.module('shiptech.pages').component('contractEvaluation', {
    templateUrl: 'pages/contract-evaluation/views/contract-evaluation-component.html',
    controller: "ContractEvaluationController"
});