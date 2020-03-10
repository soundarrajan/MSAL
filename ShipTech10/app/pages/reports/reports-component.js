angular.module('shiptech.pages').controller('ReportsController', [
    '$rootScope',
    '$scope',
    'Factory_Master',
    '$sce',
    '$q',
    '$element',
    '$attrs',
    '$timeout',
    '$state',
    '$filter',
    '$stateParams',
    'newRequestModel',
    'orderModel',
    'listsModel',
    'uiApiModel',
    'lookupModel',
    'screenActionsModel',
    'tenantService',
    'STATE',
    'LOOKUP_MAP',
    'LOOKUP_TYPE',
    'SCREEN_LAYOUTS',
    'SCREEN_ACTIONS',
    'IDS',
    'VALIDATION_MESSAGES',
    'PRODUCT_STATUS_IDS',
    'EMAIL_TRANSACTION',
    '$uibTooltip',
    'adalAuthenticationService',
    '$http',
    '$tenantSettings',
    '$listsCache',
    function($rootScope, $scope, Factory_Master, $sce, $q, $element, $attrs, $timeout, $state, $filter, $stateParams, newRequestModel, orderModel, listsModel, uiApiModel, lookupModel, screenActionsModel, tenantService, STATE, LOOKUP_MAP, LOOKUP_TYPE, SCREEN_LAYOUTS, SCREEN_ACTIONS, IDS, VALIDATION_MESSAGES, PRODUCT_STATUS_IDS, EMAIL_TRANSACTION, $uibTooltip, adalService, $http, $tenantSettings, $listsCache) {
        let ctrl = this;
        ctrl.customReports = false;
        ctrl.tenantSettings = $tenantSettings;
        ctrl.listsCache = $listsCache;
        ctrl.currentSelection = {
            name: 'Selected Report',
            url: null
        };

        ctrl.reports = [];
        ctrl.token = null;
        ctrl.reportsLoading = true;
        ctrl.toggled = false;

        ctrl.initComponent = function() {
            ctrl.reportsLoading = true;

            // set customReports flag
            if ($stateParams.title === 'Custom Reports') {
                ctrl.customReports = true;
            }
            if ($stateParams.title === 'Reports') {
                ctrl.customReports = false;
            }
            if ($state.current.name === 'default.custom-reports') {
                ctrl.customReports = true;
            }
            if ($state.current.name === 'default.reports') {
                ctrl.customReports = false;
            }

            // get token
            ctrl.token = adalService.getCachedToken('https://analysis.windows.net/powerbi/api');
            // if(ctrl.token == null) $state.reload();
            if (ctrl.token == null) {
                $http.get('https://app.powerbi.com').then(
                    (response) => {
                        ctrl.token = adalService.getCachedToken('https://analysis.windows.net/powerbi/api');
                        ctrl.getReportsGroups();
                    },
                    (error) => {
                        ctrl.token = adalService.getCachedToken('https://analysis.windows.net/powerbi/api');
                        ctrl.getReportsGroups();
                    }
                );
            }

            if (ctrl.token != null) {
                $timeout(() => {
                    ctrl.getReportsGroups();
                }, 100);
            }
        };

        $scope.once = true;

        ctrl.getReportsGroups = function() {
            Factory_Master.getReportsGroups((response) => {
                if (response.status == 200) {
                    $.each(response.data.value, (key, categ) => {
                        if (categ.name.indexOf('Shiptech') >= 0) {
                            ctrl.reports.push(categ);
                        }
                    });
                    ctrl.getReportsInGroup();
                } else if (response.status == 401 && $scope.once) {
                    $scope.once = false;
                    Factory_Master.getReportsGroups();
                } else {
                    toastr.error(response.message);
                }
            });
        };

        ctrl.getReportsInGroup = function() {
            let loadedCount = 0;
            $.each(ctrl.reports, (key, val) => {
                Factory_Master.getReportsInGroup({ group_id: val.id }, (response) => {
                    val.reportsList = [];
                    console.log(response);
                    $.each(response.data.value, (key2, val2) => {
                        val.reportsList.push(val2);
                    });
                    loadedCount++;
                    if (loadedCount == ctrl.reports.length) {
                        ctrl.reportsLoading = false;
                    }
                });
            });
        };
        ctrl.getStandardReports = function() {
            var reportSrc = 'getStandard';
            var reportType = '';

            Factory_Master.getReport({ reportSrc: reportSrc, reportType: reportType.id }, (response) => {
                ctrl.standardReports = response;
                if ($state.params.type) {
                    reportSrc = 'getreport';
                    // reportSrc = $state.params.type;
                    reportType = _.find(ctrl.listsCache.ReportsCategory, (o) => {
                        // return o.name.toLowerCase() ==  "cashflow";
                        return o.internalName.toLowerCase() == $state.params.type.toLowerCase();
                    });
                    let entity_id = $state.params.entity_id ? $state.params.entity_id : '';
                    Factory_Master.getReport({ reportSrc: reportSrc, reportType: reportType.id }, (resp) => {
                        // ctrl.standardReports = response;
                        ctrl.toggled = true;
                        ctrl.showIframe = true;
                        ctrl.customReports = true;
                        if (reportType.internalName == 'OrderToInvoice' || reportType.internalName == 'OrderNegotiation') {
	                        resp.payload.items[0].link = resp.payload.items[0].link + encodeURIComponent(entity_id);
                        } else if (reportType.internalName == 'Cashflow') {
	                        resp.payload.items[0].link = resp.payload.items[0].link + encodeURIComponent('GUID=') + resp.payload.items[0].filterId;
                        } else if (reportType.internalName == 'OperationalReport') {
	                        resp.payload.items[0].link = `${resp.payload.items[0].link }&${ encodeURIComponent('ServiceId') }=${ entity_id}`;
                        }

                        // <items[0].link>&GUID=<items[0].filterId>

                        ctrl.selectIframe = resp.payload.items[0];
                    });
                }
            });
        };

        if (ctrl.tenantSettings.defaultValues.isSSRSReports) {
            ctrl.getStandardReports();
            ctrl.reportsLoading = false;
        } else {
            ctrl.getStandardReports();
            ctrl.initComponent();
        }
        ctrl.loadReport = function(selection) {
            ctrl.embedErrorMessage = null;

            // create new element to embed powerbi
            var newContainer = document.createElement('div');
            newContainer.id = 'reportContainer';
            $('#reportContainerWrapper').empty();
            document.getElementById('reportContainerWrapper').appendChild(newContainer);

            $('#reportContainer').ready(() => {
                let models = window['powerbi-client'].models;
                let permissions = models.Permissions.Read;
                let reportContainer = document.getElementById('reportContainer');

                let config = {
                    type: 'report',
                    tokenType: models.TokenType.Aad,
                    accessToken: ctrl.token,
                    permissions: permissions,
                    embedUrl: ctrl.currentSelection.url,
                    settings: {
                        filterPaneEnabled: true,
                        navContentPaneEnabled: true
                    }
                };

                // Embed the report and display it within the div container.
                let report = powerbi.embed(reportContainer, config);
                report.on('error', (event) => {
                    ctrl.embedErrorMessage = event.detail;
                });
            }, 100);
        };

        ctrl.setCurrentSelection = function(report) {
            ctrl.currentSelection.name = report.name;
            ctrl.currentSelection.url = report.embedUrl;
            ctrl.loadReport(ctrl.currentSelection);
        };

        ctrl.clearSelected = function(obj) {
            $.each(obj, (k, v) => {
                obj[k] = false;
            });
        };
        ctrl.showChilds = function(key) {
            ctrl.standardReports[key].active = !ctrl.standardReports[key].active;
            collapseAnother(key);
        };
        var collapseAnother = function(index) {
            for (let i = 0; i < ctrl.standardReports.length; i++) {
                if (i != index) {
                    ctrl.standardReports[i].active = false;
                }
            }
        };
    }
]);
angular.module('shiptech.pages').component('reports', {
    templateUrl: 'pages/reports/views/reports-component.html',
    controller: 'ReportsController'
});
