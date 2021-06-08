/**
 * APP GENERAL COMPONENTS (Shiptech)
 * Directives
 */
window.increment = 0;
Number(function() {
    /**
     * Configurable List Control (CLC)
     * {table list} directive
     */
    APP_GENERAL_COMPONENTS.directive('clcTableList', [
        '$templateRequest',
        '$tenantSettings',
        '$compile',
        '$Api_Service',
        '$timeout',
        'Factory_General_Components',
        '$http',
        '$rootScope',
        'uiApiModel',
        'dataProcessors',
        'getExternalFilters',
        'screenLoader',
        'tenantService',
        '$filtersData',
        '$state',
        function($templateRequest, $tenantSettings, $compile, $Api_Service, $timeout, Factory_General_Components, $http, $rootScope, uiApiModel, dataProcessors, getExternalFilters, screenLoader, tenantService, $filtersData, $state) {
            return {
                restrict: 'E',
                controller: 'Controller_Configurable_List_Control as CLC',
                scope: {
                    id: '=',
                    source: '=',
                    app: '=',
                    screen: '=',
                    controls: '=',
                    filters: '=',
                    rowactions: '=',
                    hasloader: '=',
                    modal: '='
                },
                link: function(scope, element, attrs, CLC) {
                    tenantService.procurementSettings.then((settings) => {
                        window.procurementSettings = settings.payload;
                    });
                    tenantService.scheduleDashboardConfiguration.then((settings) => {
                        $rootScope.scheduleDashboardConfiguration = settings.payload;
                    });
                    $rootScope.isModal = scope.modal;
                    $rootScope.modalTableId = scope.id;
                    if (scope.screen) {
	                    $rootScope.listTableSelector = `flat_${ scope.screen.replace('list', '_list')}`;
                    }
                    $rootScope.sortList = null;
                    console.log(scope.hasloader);
                    // console.log(CLC);
                    if (window.Elements && typeof window.Elements.scope[scope.id] === 'undefined') {
                        // console.log(scope);
                        Elements.scope[scope.id] = {};
                        Elements.scope[scope.id].id = scope.id;
                        Elements.scope[scope.id].screen = scope.screen;
                        Elements.scope[scope.id].app = scope.app;
                        Elements.scope[scope.id].controls = scope.controls;
                        Elements.scope[scope.id].rowactions = scope.rowactions;
                        Elements.scope[scope.id].filters = scope.filters;
                        Elements.scope[scope.id].selector = attrs.id;
                        Elements.scope[scope.id].modal = attrs.modal;
                        CLC.tableParams.filters = Elements.scope[scope.id].filters;
                        CLC.tableParams.PageFilters = {};
                    }
                    scope.tenantSetting = $tenantSettings;
                    CLC.tableParams.PageFilters = {};
                    $rootScope.rawFilters = [];
                    scope.$on('$stateChangeSuccess', () => {
                        CLC.tableParams.PageFilters = {};
                        $rootScope.lastLoadedListPayload = null;
                        console.log('stateChangeSuccess');
                    });
                    var checkProcurement = -1;
                    // else return;
                    let procurement_apps = [
                        {
                            name: 'requestslist',
                            editPath: '/edit-request/',
                            screen: 'all-requests-table'
                        },
                        {
                            name: 'scheduleDashboardTable',
                            editPath: '/edit-request/',
                            screen: 'schedule-dashboard-table'
                        },
                        {
                            name: 'orderlist',
                            editPath: '/edit-order/',
                            screen: 'order-list'
                        },
                        {
                            name: 'contractplanning',
                            screen: 'contract-planning'
                        }
                    ];
                    checkProcurement = _.findIndex(procurement_apps, (o) => {
                        return o.name == scope.screen;
                    });

                    let generic_layout = [
                        'entity_documents'
                    ];
                    var checkGenericLayout = _.findIndex(generic_layout, (s) => {
                        return s == scope.id;
                    });
                    // checkGenericLayout = -1;

                    scope.initialLayout = {};

                    setTimeout(() => {
                        checkCanBuildTable(scope.id, checkProcurement);
                    });

                    function checkCanBuildTable(table_id, checkProcurement) {
                        var isDev = 0;
                        if (window.Elements && typeof window.Elements.scope[table_id].controls !== 'undefined' && 
                        	typeof Elements.scope[table_id].screen !== 'undefined' && 
                        	typeof Elements.scope[table_id].id !== 'undefined' && 
                        	typeof Elements.scope[table_id].app !== 'undefined') {
                            var id = scope.modal ? `/${ table_id}` : '';

                            var appScreen;
                            if (checkProcurement >= 0) {
                                appScreen = procurement_apps[checkProcurement].screen;
                            } else if (table_id == 'contractplanning_contractlist') {
                                appScreen = 'contractplanning_contractlist';
                            } else {
                                appScreen = window.location.hash.replace(/[0-9,\/,#/]/g, '') + id;
                            }

                            if(checkGenericLayout < 0) {
                                uiApiModel.getListLayout(appScreen).then(
                                    (data) => {
                                        if (data.payload) {
                                            var response = data.payload;
                                            var layout = JSON.parse(response.layout);
                                            layout.id = response.id;
                                            var initialLayout = angular.copy(layout);
                                            $Api_Service.screen.get(
                                                {
                                                    app: Elements.scope[table_id].app,
                                                    screen: Elements.scope[table_id].screen,
                                                    clc_id: Elements.scope[table_id].id,
                                                    modal: Elements.scope[table_id].modal
                                                },
                                                (callback) => {
                                                    if (callback && callback.clc) {
                                                        if (scope.source) {
                                                            callback.clc = angular.copy(scope.source);
                                                        }
                                                        $.each(callback.clc.colModel, (k, v) => {
                                                            v.label = v.label.replace('Service', scope.tenantSetting.serviceDisplayName.name);
                                                            v.label = v.label.replace('Company', scope.tenantSetting.companyDisplayName.name);
                                                            if (scope.tenantSetting.companyDisplayName.name == 'Pool') {
                                                                v.label = v.label.replace('Carrier', scope.tenantSetting.companyDisplayName.name);
                                                            }
                                                        });
                                                        $rootScope.$broadcast('tableLayoutLoaded', initialLayout);
                                                        var Layout = layout.clc;
                                                        if (!Layout.rowActions) {
                                                            Layout.rowActions = [];
                                                        }
                                                        Layout.rowActions = Layout.rowActions.concat(callback.clc.rowActions);
                                                        Layout.rowActions = _.uniqBy(Layout.rowActions, 'label');
                                                        Layout.table_id = `${Layout.view_type }_${ Layout.table_name.replace(/ /g, '_').toLowerCase()}`;
                                                        Layout.pager_id = `${Layout.view_type }_${ Layout.table_name.replace(/ /g, '_').toLowerCase() }_pager`;
                                                        Layout.defaultColumnList = callback.clc.colModel;
                                                        Layout.matchedColumnList = doLayoutsMatching(initialLayout, callback);
                                                        console.log(Layout.matchedColumnList);
                                                        // set col model
                                                        // Layout.colModel =
                                                        buildTable(Layout, Elements.scope[table_id], true, Layout.matchedColumnList);
                                                    } else {
                                                        loadDefaultUi();
                                                    }
                                                }
                                            );
                                        } else {
                                            loadDefaultUi();
                                        }
                                        // console.log(data)
                                    },
                                    (reason) => {
                                        // console.log(reason)
                                        loadDefaultUi();
                                    }
                                );
                            }else{
                                loadDefaultUi();
                            }

                            // } else {
                            // loadDefaultUi()
                            // }
                            function loadDefaultUi() {

                                if (['masters_counterpartylist_surveyors', 'masters_counterpartylist_labs', 'masters_counterpartylist_physicalsuppliers', 'masters_counterpartylist_seller', 'masters_counterpartylist_broker', 'masters_counterpartylist_barge', 'masters_counterpartylist_customers'].includes(Elements.scope[table_id].id)) {
                                    id = 'masters_counterpartylist';
                                } else {
                                    id = Elements.scope[table_id].id;
                                }
                                //  
                                let generic_layout = false;
                                if(id == 'entity_documents') {
                                    generic_layout = {
                                        needed: true,
                                        layout: 'entity_documents'
                                    };
                                }
                                if(id == 'entity_audit_log') {
                                    generic_layout = {
                                        needed: true,
                                        layout: 'entity_audit_log'
                                    };
                                }
                                $Api_Service.screen.get(
                                    {
                                        app: Elements.scope[table_id].app,
                                        screen: Elements.scope[table_id].screen,
                                        clc_id: id,
                                        generic: generic_layout
                                        // clc_id: Elements.scope[table_id].selector.split("'")[1]
                                    },
                                    (cb) => {
                                        var callback = angular.copy(cb);
                                        if (callback && callback.clc) {
                                            callback.id = null;
                                            if (scope.source) {
                                                callback.clc = angular.copy(scope.source);
                                            }
                                            callback.clc.colModel = _.uniqBy(callback.clc.colModel, "name");
                                            if ($rootScope.adminConfiguration) {
                                                if ($rootScope.adminConfiguration.contract.hideAllowedProduct) {
                                                    if (callback.clc.table_name == 'Available Contracts') {
                                                        for (let i = callback.clc.colModel.length - 1; i >= 0; i--) {
                                                            callback.clc.colModel[i];
                                                            if (callback.clc.colModel[i].label == 'Allowed Products') {
                                                                callback.clc.colModel.splice(i, 1);
                                                            }
                                                        }
                                                        // $.each(callback.clc.colModel, function(k,v){
                                                        // })
                                                    }
                                                }
                                            }
	                                        if (window.procurementSettings) {
		                                        if (window.procurementSettings.fieldVisibility.isCustomerHidden) {
	                                                if (callback.clc.table_name == "Orders list") {
	                                                	for (var i = callback.clc.colModel.length - 1; i >= 0; i--) {
	                                                		callback.clc.colModel[i]
	                                                        if (callback.clc.colModel[i].name == "customerName") {
	                                                            callback.clc.colModel.splice(i, 1);
	                                                        }
	                                                	}
	                                                }
		                                        }
	                                        }                                            
                                            $.each(callback.clc.colModel, (k, v) => {
                                                v.label = v.label.replace('Service', scope.tenantSetting.serviceDisplayName.name);
                                                v.label = v.label.replace('Company', scope.tenantSetting.companyDisplayName.name);
                                                if (scope.tenantSetting.companyDisplayName.name == 'Pool') {
                                                    v.label = v.label.replace('Carrier', scope.tenantSetting.companyDisplayName.name);
                                                }
                                            });
                                            initialLayout = angular.copy(callback);
                                            let Layout = '';
                                            Layout = callback.clc;
                                            // $.each(initialLayout.clc.colModel, function(k, v) {
                                            //     v.cellFormat = v.formatter;
                                            // })
                                            $rootScope.$broadcast('tableLayoutLoaded', initialLayout);
                                            Layout.table_id = `${Layout.view_type }_${ Layout.table_name.replace(/ /g, '_').toLowerCase()}`;
                                            Layout.pager_id = `${Layout.view_type }_${ Layout.table_name.replace(/ /g, '_').toLowerCase() }_pager`;
                                            buildTable(Layout, Elements.scope[table_id], false, initialLayout);
                                        }
                                    }
                                );
                            }

                            function doLayoutsMatching(userColumns, defaultColumns) {
                                // console.log(userColumns.clc.colModel);
                                // console.log(defaultColumns.clc.colModel);
                                // 1. define new col model
                                let matchedCol = [];
                                let found = false;
                                let newCol = null;
                                if (userColumns.clc.table_name != defaultColumns.clc.table_name) {
                                    // $state.reload();
                                    userColumns.clc.table_name = defaultColumns.clc.table_name;
                                    toastr.error('The previously saved list configurations is no longer valid therefore the system default configuration has been loaded. Please configure your list preferences again.');
                                    return;
                                }
                                if (scope.source) {
                                    defaultColumns.clc.colModel = angular.copy(scope.source.colModel);
                                }

                                //  
                                // 2. loop custom col mod el & match default ones (to keep column order)
                                $.each(userColumns.clc.colModel, (_, usr_val) => {
                                    // 2.1 check for match in default (based on index or name)
                                    $.each(defaultColumns.clc.colModel, (_, def_val) => {
                                        found = false;
                                        // index
                                        if (typeof usr_val.index != 'undefined') {
                                            if (typeof def_val.index != 'undefined') {
                                                if (usr_val.index == def_val.index) {
                                                    found = true;
                                                }
                                            }
                                        }
                                        // name
                                        if (typeof usr_val.name != 'undefined') {
                                            if (typeof def_val.name != 'undefined') {
                                                if (usr_val.name == def_val.name) {
                                                    found = true;
                                                }
                                            }
                                        }
                                        if (found) {
                                            // keep configuration from users configuration (width / hidden)
                                            newCol = angular.copy(usr_val);
                                            if (typeof usr_val.width != 'undefined') {
                                                newCol.width = usr_val.width;
                                            }
                                            if (typeof usr_val.label != 'undefined') {
                                                newCol.label = def_val.label;
                                            }
                                            if (typeof usr_val.hidden != 'undefined') {
                                                newCol.hidden = usr_val.hidden;
                                            }
                                            if (def_val.cellFormat) {
                                                newCol.cellFormat = def_val.cellFormat;
                                            }
                                            matchedCol.push(newCol);
                                        } else {
                                            // erase from user's configuration ie don't push to new configurations
                                        }
                                    });
                                });
                                // 3. loop default col model to add new columns
                                let additionalCols = [];
                                $.each(defaultColumns.clc.colModel, (def_key, def_val) => {
                                    // 2. check for match in created col model (not to add twice)
                                    found = false;
                                    $.each(matchedCol, (new_key, new_val) => {
                                        // index
                                        if (typeof def_val.index != 'undefined') {
                                            if (typeof new_val.index != 'undefined') {
                                                if (def_val.index == new_val.index) {
                                                    found = true;
                                                }
                                            }
                                        }
                                        // name
                                        if (typeof def_val.name != 'undefined') {
                                            if (typeof new_val.name != 'undefined') {
                                                if (def_val.name == new_val.name) {
                                                    found = true;
                                                }
                                            }
                                        }
                                    });
                                    if (found) {
                                        // column is already there
                                    } else {
                                        // column not there, add to colModel as it is
                                        newCol = angular.copy(def_val);
                                        newCol.hidden = true;
                                        additionalCols.push(newCol);
                                    }
                                });
                                // concat
                                matchedCol = matchedCol.concat(additionalCols);
                                matchedCol = _.uniqBy(matchedCol, 'name');
                                // in matched we have matched col model, return it
                                return matchedCol;
                            }
                        }
                    }
                    // RUN directire after loading ALL dependencies
                    $timeout(() => {
                        return;
                        isDev = 0;

                        $.each(Elements.scope, (key, params) => {
                            if (params.id == 'masters_counterpartylist_surveyors' || params.id == 'masters_counterpartylist_labs' || params.id == 'masters_counterpartylist_barge' || params.id == 'masters_counterpartylist_physicalsuppliers' || params.id == 'masters_counterpartylist_seller' || params.id == 'masters_counterpartylist_broker') {
                                params.id = 'masters_counterpartylist';
                            }

                            $Api_Service.screen.get(
                                {
                                    app: params.app,
                                    screen: params.screen,
                                    clc_id: params.id,
                                    modal: params.modal
                                },
                                (callback) => {
                                    let Layout = '';
                                    if (scope.source) {
                                        callback.clc = angular.copy(scope.source);
                                    }
                                    Layout = callback.clc;
                                    if (callback && callback.clc) {
                                        $.each(callback.clc.colModel, (k, v) => {
                                            v.label = v.label.replace('Service', scope.tenantSetting.serviceDisplayName.name);
                                            v.label = v.label.replace('Company', scope.tenantSetting.companyDisplayName.name);
                                            if (scope.tenantSetting.companyDisplayName.name == 'Pool') {
                                                v.label = v.label.replace('Carrier', scope.tenantSetting.companyDisplayName.name);
                                            }
                                        });
                                        if ($rootScope.adminConfiguration) {
                                            if ($rootScope.adminConfiguration.contract.hideAllowedProduct) {
                                                if (callback.clc.table_name == 'Available Contracts') {
                                                    $.each(callback.clc.colModel, (k, v) => {
                                                        if (v.label == 'Allowed Products') {
                                                            callback.clc.colModel.splice(k, 1);
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                        if (window.procurementSettings) {
	                                        if (window.procurementSettings.fieldVisibility.isCustomerHidden) {
                                                if (callback.clc.table_name == "Orders list") {
                                                	for (var i = callback.clc.colModel.length - 1; i >= 0; i--) {
                                                		callback.clc.colModel[i]
                                                        if (callback.clc.colModel[i].name == "customerName") {
                                                            callback.clc.colModel.splice(i, 1);
                                                        }
                                                	}
                                                }
	                                        }
                                        }  

                                        Layout.table_id = `${Layout.view_type }_${ Layout.table_name.replace(/ /g, '_').toLowerCase()}`;
                                        Layout.pager_id = `${Layout.view_type }_${ Layout.table_name.replace(/ /g, '_').toLowerCase() }_pager`;
                                        buildTable(Layout, params);
                                    }
                                }
                            );
                        });
                    });

                    function buildTable(newValue, attrs, customLayout, initialLayout) {
                        if (newValue.matchedColumnList) {
                            // if there is a matched column list, build table with that
                            newValue.colModel = newValue.matchedColumnList;
                            // toastr.info('The default layout for this page has changed. Please check additional columns from settings and save your new layout.');
                        }

                        if (attrs.screen == 'scheduleDashboardTable') {
                            for (var i = newValue.colModel.length - 1; i >= 0; i--) {
                                if (newValue.colModel[i].name == 'voyageDetail.deliveryFrom' || newValue.colModel[i].name == 'voyageDetail.deliveryTo') {
                                    if (procurementSettings.request.deliveryWindowDisplay.id == 2) {
                                        newValue.colModel.splice(i, 1);
                                    }
                                } 
                            }
                        }

                        if (attrs.screen == 'requestslist') {
                            for (var i = newValue.colModel.length - 1; i >= 0; i--) {
                                if (newValue.colModel[i].name == 'hasOpsValidation') {
                                    if (scope.tenantSetting.shiptechLite) {
                                        newValue.colModel.splice(i, 1);
                                    }
                                }
                            }  
                        }
                        
                        if (attrs.screen == 'orderlist') {
                            for (var i = newValue.colModel.length - 1; i >= 0; i--) {
                                if (newValue.colModel[i].name == 'isVerified.name' || newValue.colModel[i].name == 'verifiedBy.displayName' || newValue.colModel[i].name == 'verifiedOn') {
                                    if (procurementSettings.order.orderVerificationReq.id == 2) {
                                        newValue.colModel.splice(i, 1);
                                    }
                                } else if (newValue.colModel[i].name == 'hasSellerConfirmationDocument') {
                                    if (scope.tenantSetting.shiptechLite) {
                                        newValue.colModel.splice(i, 1);
                                    }
                                }

                            }
                            for (var i = newValue.rowActions.length - 1; i >= 0; i--) {
                                if (newValue.rowActions[i].name == '') {
                                    if (procurementSettings.order.orderVerificationReq.id == 2) {
                                        newValue.rowActions.splice(i, 1);
                                    }
                                }
                            }
                        }

                        if (scope.source) {
                            console.log('clc static src:', scope.source);
                            // newValue = scope.source;
                        }
                        // console.log(attrs.modal)
                        CLC.tableParams.modal = attrs.modal;
                        // {end} load static layout from source (#dev)
                        // disable row actions -- @liviu.m
                        if (scope.rowactions == 'false') {
                            console.log('CLC SCOPE', scope.rowactions);
                            console.log('CLC VAL', newValue);
                            newValue.rowActions = [];
                        } else {
                            // show actions :)
                        }
                        // {end} disable row actions
                        if (newValue.length == 0) {
                            // empty source? STOP SCRIPT!
                            return false;
                        }
                        // if (!Elements.scope[attrs.id].modal) {

                        // }
                        // if (typeof $rootScope.getListFilters == 'function') {
                        // $rootScope.getListFilters().then(function (data) {
                        //     if (data) {
                        //         CLC.tableParams.tableColumnFilters = data;
                        //     }
                        // });

                        // }
                        // CLC.tableConfig();
                        // current view && next view

                        let table_view = newValue.view_type;
                        // IDs
                        let table_id = newValue.table_id;
                        let pager_id = newValue.pager_id;
                        // Add settings
                        Elements.settings[table_id] = {
                            table: '',
                            pager: '',
                            source: ''
                        };
                        // Update settings
                        Elements.settings[table_id].shrinkToFit = false;
                        Elements.settings[table_id].sortable = false;
                        // Elements.settings[table_id].autowidth = true;
                        // Elements.settings[table_id].forceFit = true;
                        // Elements.settings[table_id].responsive = true;
                        Elements.settings[table_id].source = newValue;
                        Elements.settings[table_id].caption = Elements.settings[table_id].source.table_name;
                        Elements.settings[table_id].table = table_id;
                        // Elements.settings[table_id].PageFilters = CLC.tableParams.PageFilters;
                        // Elements.settings[table_id].pager = pager_id;
                        // Elements.settings[table_id].source.url = 'http://shiptech.dev.ascensys.ro/clc2/' + Elements.settings[table_id].source.url;
                        Elements.settings[table_id].source.multiSort = true;
                        Elements.settings[table_id].source.datastr = [];
                        // Update jQgrid Object

                        if (Elements.scope[attrs.id].modal) {
                            Elements.settings[table_id].source.height = window.innerHeight / 1.8;
                            if (scope.id != 'procurement_rfqrequestslist') {
                                Elements.settings[table_id].source.colModel.unshift({
                                    label: 'Actions-checkboxes',
                                    name: 'actions-checkboxes',
                                    key: true,
                                    width: 32,
                                    sortable: false,
                                    resizable: false,
                                    frozen: true,
                                    fixed: true,
                                    cellFormat: 'modal_check'
                                });
                                Elements.settings[table_id].source.radioselect = true;
                            } else {
                                Elements.settings[table_id].source.multiselect = true;
                            }
                        } else {
                            Elements.settings[table_id].source.height = '50vh';
                            if (table_id != 'flat_available_contracts') {
                                Elements.settings[table_id].source.height = 'calc(100vh - 400px)';
                            }
                            if (table_id == 'flat_audit_log') {
                                Elements.settings[table_id].source.height = 'calc(100vh - 340px)';
                            }
                        }

                        Elements.settings[table_id].source.pager = `#${ Elements.settings[table_id].pager}`;

                        Elements.settings[table_id].source.colModel = dataProcessors.formatClcColumns(Elements.settings[table_id].source.colModel, CLC, scope.tenantSetting);

                        function initAfterLoad(params) {
                            // set items per page
                            if ($(Elements.table[Elements.settings[table_id].table]).jqGrid('getGridParam', 'rowNum') > 9999) {
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid('setGridParam', {
                                    rowNum: Elements.settings[table_id].source.rowNum
                                });
                            }
                            if (Elements.scope[attrs.id].modal) {
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid('setGridParam', {
                                    // multiselect: true,
                                });
                            }
                            $(Elements.table[Elements.settings[table_id].table]).jqGrid('setGridParam', {
                                customList: Layout.defaultColumnList
                            });
                            // API GET DATA
                            var str_app = attrs.app.replace(/'/g, '');
                            if (scope.filters) {
                                CLC.tableParams.filters = scope.filters;
                            }
                            if (scope.Filters) {
                                CLC.tableParams.Filters = scope.Filters;
                            }
                            if ((scope.$root.currentColumnRoute.indexOf('labs') != -1 || scope.$root.currentColumnRoute.indexOf('claims') != -1) && scope.id == 'orders_orders') {
                                CLC.tableParams.PageFilters.push(
                                    {
                                        ColumnType: 'Text',
                                        ConditionValue: '!=',
                                        FilterOperator: 0,
                                        Values: [ 'Stemmed' ],
                                        columnValue: 'OrderStatus_DisplayName',
                                        isComputedColumn: false
                                    }
                                );
                                if(scope.$root.currentColumnRoute.indexOf('labs') != -1){
                                    CLC.tableParams.PageFilters.push(
                                        {
                                             ColumnType: 'Text',
                                             ConditionValue: '!=',
                                             FilterOperator: 1,
                                             Values: [ 'Cancelled' ],
                                             columnValue: 'OrderStatus_DisplayName',
                                             isComputedColumn: false
                                         }
                                     );
                                }
                                if(scope.$root.currentColumnRoute.indexOf('labs') != -1){
                                    CLC.tableParams.PageFilters.push(
                                    {
                                            ColumnType: 'Text',
                                            ConditionValue: '!=',
                                            FilterOperator: 1,
                                            Values: [ 'Closed' ],
                                            columnValue: 'OrderStatus_DisplayName',
                                            isComputedColumn: false
                                        }
                                    );
                                }
                            }
                            if (scope.id == 'admin_userlist' && (scope.$root.currentColumnRoute.indexOf('claims') != -1 || scope.$root.currentColumnRoute == "new-request/admin_userlist")  ) {
                                if (CLC.tableParams.PageFilters.length == 0) {
                                    CLC.tableParams.PageFilters = [
                                        {
                                            ColumnName: 'IsDeleted',
                                            ColumnType: 'Bool',
                                            ColumnValue: 'IsDeleted',
                                            ConditionValue: '=',
                                            Values: [ '0' ],
                                            FilterOperator: 0,
                                            isComputedColumn: false
                                        }
                                    ];
                                } else {
                                    let obj =
                                        {
                                            ColumnName: 'IsDeleted',
                                            ColumnType: 'Bool',
                                            ColumnValue: 'IsDeleted',
                                            ConditionValue: '=',
                                            Values: [ '0' ],
                                            FilterOperator: 0,
                                            isComputedColumn: false
                                        };

                                    CLC.tableParams.PageFilters.push(obj);
                                }
                            }
                            // console.log(CLC)
                            // if (CLC.tableParams.PageFilters) {

                            // $rootScope.sortList = []task
                            if (CLC.tableParams.PageFilters && CLC.tableParams.PageFilters.sortList) {
                                $rootScope.sortList = CLC.tableParams.PageFilters.sortList;
                                var currentTableColumns = _.filter($filtersData.filterColumns, function(o){
                                	return o.columnRoute == $rootScope.currentColumnRoute;
                                })
                                console.log(currentTableColumns);
                                $.each($rootScope.sortList, function(k,v){
	                                var matchingColumn = 0;	
	                                $.each(currentTableColumns, function(k2,v2){
	                                	if (v2.sortColumnValue) {
	                                		if (v2.sortColumnValue.toLowerCase().replace(/ /g, '_') == v.columnValue) {
			                                	matchingColumn = v2;
	                                		}
	                                	}
	                                })
	                                if (matchingColumn) {
	                                	v.col = matchingColumn.columnValue.toLowerCase().replace(/ /g, '_')
	                                }
                                })
                            } else {
                                let sortList = [];
                                if ($(Elements.table[Elements.settings[table_id].table]).jqGrid('getGridParam', 'sortname')) {
                                    let col = $(Elements.table[Elements.settings[table_id].table]).jqGrid('getGridParam', 'sortname');
                                    let sort = $(Elements.table[Elements.settings[table_id].table]).jqGrid('getGridParam', 'sortorder');
                                    let directionsNames = { asc: 1, desc: 2, none: 0 };
                                    // $.each(existingSortName, function(k, v) {
                                    if (directionsNames[sort] > 0) {
                                        console.log(121);
                                        sortList.push({ columnValue: col.replace(/\./g, '_').toLowerCase(), sortIndex: 0, sortParameter: directionsNames[sort] });
                                    }
                                    // });
                                    if (!CLC.tableParams.PageFilters) {
                                        CLC.tableParams.PageFilters = {};
                                    }
                                    CLC.tableParams.PageFilters.sortList = sortList;
                                }
                                $rootScope.sortList = sortList;
                            }
                            if (localStorage.getItem('scheduleDates')) {
                                var startDate = JSON.parse(localStorage.getItem('scheduleDates')).start;
                                var endDate = JSON.parse(localStorage.getItem('scheduleDates')).end;
                                CLC.tableParams.dates = {
                                    startDate: startDate,
                                    endDate: endDate
                                };
                            }

                            if (localStorage.getItem('scheduleDatesTable')) {
                                startDate = JSON.parse(localStorage.getItem('scheduleDatesTable')).start;
                                endDate = JSON.parse(localStorage.getItem('scheduleDatesTable')).end;
                                CLC.tableParams.tableDates = {
                                    startDate: startDate,
                                    endDate: endDate
                                };
                            }
                            $rootScope.$broadcast('colModel', Elements.settings[table_id].source.colModel);
                            if (Elements.settings[table_id].source.rowNum) {
                                CLC.tableParams.rows = Elements.settings[table_id].source.rowNum;
                            }
                            if ($(Elements.table[Elements.settings[table_id].table]).jqGrid('getGridParam', 'rowNum')) {
                                CLC.tableParams.rows = $(Elements.table[Elements.settings[table_id].table]).jqGrid('getGridParam', 'rowNum');
                            }
                            screenLoader.showLoader();
                            if ($('[data-entries-select]').length > 0) {
                                if (parseFloat($('[data-entries-select]').val()) != CLC.tableParams.rows) {
                                    CLC.tableParams.rows = $('[data-entries-select]').val();
                                }
                            }

                            let listPayload = {
                                app: attrs.app,
                                screen: attrs.screen,
                                clc_id: attrs.id,
                                params: CLC.tableParams
                            };

                            if (JSON.stringify(listPayload) === $rootScope.lastLoadedListPayload && !Elements.scope[attrs.id].modal) {
                                return;
                            }
                            $.each(listPayload.params.PageFilters, (k, v) => {
                                if (typeof listPayload.params.PageFilters[k] != 'undefined') {
                                    if (listPayload.params.PageFilters[k].columnValue == 'IsVerified_Name') {
                                        listPayload.params.PageFilters[k].ColumnType = 'YesNo';
                                        if (listPayload.params.PageFilters[k].Values[0] == '1') {
                                            listPayload.params.PageFilters[k].Values[0] = 'Yes';
                                        } else if(listPayload.params.PageFilters[k].Values[0] == '0') {
                                            listPayload.params.PageFilters[k].Values[0] = 'No';
                                        }
                                    }
                                }
                            });
                            $rootScope.lastLoadedListPayload = JSON.stringify(listPayload);
                            if (scope.hasloader) {
                                $(Elements.table[Elements.settings[table_id].table]).parents('clc-table-list').addClass('loading');
                            }
                            $Api_Service.entity.list(listPayload,
                                (callback) => {
                                    $(Elements.table[Elements.settings[table_id].table]).parents('clc-table-list').removeClass('loading');
                                    if (callback) {
                                        if(table_id === 'flat_email_log_list') {
                                            $.each(callback.rows, (k, v) => {
                                                if(v.to && typeof v.to === 'string') {
                                                    v.to = v.to.replace(/,/g, ';');
                                                }
                                                if(v.cc && typeof v.cc === 'string') {
                                                    v.cc = v.cc.replace(/,/g, ';');
                                                }
                                                if(v.bcc && typeof v.bcc === 'string') {
                                                    v.bcc = v.bcc.replace(/,/g, ';');
                                                }
                                            });
                                        }
                                        var oldTableParams = angular.copy(CLC.tableParams);
                                        //  
                                        // store all grid data (rows)
                                        $(Elements.table[Elements.settings[table_id].table]).jqGrid.Ascensys.gridData = callback.rows;
                                        console.log('GRID DATA', $(Elements.table[Elements.settings[table_id].table]).jqGrid.Ascensys.gridData);
                                        $rootScope.$broadcast('gridDataDone', CLC.tableParams);

                                        /* RESET SELECTED DATA AFTER LIST CHANGE*/
                                        if (scope.id == 'deliveries_transactionstobeinvoiced') {
                                            scope.selectedProductIds = [];
                                            scope.rowsProduct = [];
                                            scope.selectedOrderAdditionalCostId = [];
                                            $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.selectedProductIds = [];
                                            $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.selectedOrderAdditionalCostId = [];
                                            $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.rowsProduct = [];
                                        }

                                        /* (END) RESET SELECTED DATA AFTER LIST CHANGE*/


                                        // VERTICALS SCROLLBAR
                                        // $(".ui-jqgrid-bdiv")css("width", "100%");
                                        $('.ui-jqgrid-view').on('scroll', function() {
                                            var offsetChild = $(this).children('.ui-jqgrid-bdiv').offset().left - $(this).children('.ui-jqgrid-bdiv').offsetParent().offset().left;
                                            $(this).children('.ui-jqgrid-bdiv').css('min-width', `${parseFloat($(this).css('width')) - parseFloat(offsetChild) }px`);
                                        });
                                        $('.ui-jqgrid-view, .ui-jqgrid-bdiv').on('scroll', function() {
                                            $('.datepicker').parent().hide();
                                        });
                                        if (table_id == 'flat_available_contracts') {
                                            if (callback.rows.length == 1) {
                                                $('.ui-jqgrid-bdiv').css('height', 'unset');
                                            } else {
                                                $('.ui-jqgrid-bdiv').css('max-height', `${$(Elements.table[Elements.settings[table_id].table]).jqGrid.Ascensys.gridData.length * 60 + 15 }px`);
                                            }
                                        } else {
                                            // $(".ui-jqgrid-bdiv").css("max-height", $(Elements.table[Elements.settings[table_id].table]).jqGrid.Ascensys.gridData.length * 37 + 15 + "px")
                                        }
                                        // END VERTICALS SCROLLBAR
                                        //
                                        // REMOVE MASTER LINKS FROM LOOKUPS
                                        setTimeout(() => {
                                            let styles = {
                                                pointerEvents : 'none',
                                                color: '#333',
                                                cursor: 'default',
                                                textDecoration: 'none'
                                            };
                                            $('.modal-content td .formatter.edit_link').parent('a').removeAttr('href');
                                            $('.modal-content td .formatter.edit_link').parent('a').css(styles);
                                            $('.modal-content td a .formatter.edit_link').css(styles);
                                        });
                                        // REMOVE MASTER LINKS FROM LOOKUPS
                                        Elements.settings[table_id].source.height = '10vh';

                                        // apply hstyle
                                        $.each(Elements.settings[table_id].source.colModel, (key, obj) => {
                                            if (obj.formatter.name == 'order_list_checkbox') {
                                                $(`th[id*="${ obj.name }"]`).addClass('order_list_checkbox');
                                                if (procurementSettings.order.orderVerificationReq.id == 1) {
                                                    // $rootScope.selectedOrderListRows = [];
                                                    // $scope.selectOrders = []
                                                    $('.order_list_checkbox > div').html('<i id="selectAllOrderList"' +
                                                        ' style="font-size: 25px !important; color: #d9d9d9;"' +
                                                        ' class="fa fa-square-o" ng-click="selectAllOrderList()"></i>');
                                                    // $timeout(function(){
                                                    // })
                                                }
                                            }
                                            if (obj.hstyle) {
                                                $(`th[id*="${ obj.name }"]`).addClass(`hstyle-color-${ obj.hstyle.color}`);
                                                $(`th[id*="${ obj.name }"]`).addClass(`hstyle-background-${ obj.hstyle.background}`);
                                            }
                                        });
                                        // console.log(CLC);
                                        // console.log($rootScope);

                                        // if (CLC.tableParams) {

                                        if ($rootScope.sortList) {
                                            $('.colMenu')
                                                .parent()
                                                .removeClass('sortednone sortedasc sorteddesc');
                                            $.each($rootScope.sortList, (k, v) => {
                                                let directionsNames = [ 'none', 'asc', 'desc' ];

                                                let column = v.columnValue;
                                                let sort = v.sortParameter;

                                                if (column == '[open]') {
                                                    column = 'open';
                                                }

                                                if (column == '[close]') {
                                                    column = 'close';
                                                }

                                                if (v.col) {
                                                    column = v.col;
                                                }
                                                if (table_id == "flat_claims_list" && column == 'id') {
                                                	column = "claimNo";
                                                }

                                                // console.log(column, directionsNames[sort]);
                                                $(`.colMenu[data-sortCol="${ column.toLowerCase() }"]`)
                                                    .parent()
                                                    .addClass(`sorted${ directionsNames[sort]}`);
                                                console.log("!@#");
                                            });
                                        }

                                        // }
                                        // -end- apply hstyle
                                        Elements.settings[table_id].source.datastr = callback.rows;
                                        // Elements.settings[table_id].source.tableParams = angular.copy(CLC.tableParams);
                                        $(Elements.table[Elements.settings[table_id].table]).jqGrid('Ascensys.setPages', {
                                            page: CLC.tableParams.page,
                                            total: callback.total
                                        });
                                        $.each(Object.keys(Elements.settings), (key, val) => {
                                            $(Elements.table[Elements.settings[val].table]).jqGrid('clearGridData');
                                            for (let i = 0; i < Elements.settings[val].source.datastr.length; i++) {
                                                try {
                                                    $(Elements.table[Elements.settings[val].table]).jqGrid('addRowData', i + 1, Elements.settings[val].source.datastr[i]);
                                                } catch (e) {
                                                    console.log(e);
                                                }
                                            }
                                        });

                                        if (typeof Elements.scope[scope.id].controls !== 'undefined' && Elements.scope[scope.id].controls !== '') {
                                            $(Elements.table[Elements.settings[table_id].table]).jqGrid('Ascensys.selectControls', Elements.scope[scope.id].controls);
                                        }
                                        $(Elements.table[Elements.settings[table_id].table]).jqGrid('Ascensys.storeGridObject', callback);
                                        $(Elements.table[Elements.settings[table_id].table]).jqGrid('Ascensys.load');
                                        $rootScope.clc_loaded = true;
                                        // console.log(scope);
                                        $('clc-table-list > *').unbind();
                                        $compile($('clc-table-list > *'))(scope);
                                        CLC.search_table = table_id;
                                        MCScustom.load();
                                        // if (!customLayout) resizeTableWidth();
                                        // If the width of all the columns is smaller than the container,
                                        // Resize the columns to take 100% of the width of the container,
                                        // Otherwise let the columns overflow and allow scroll
                                        if ($('.ui-jqgrid-view').width() - $('.ui-jqgrid-hbox').width() > 0) {
                                            resizeTableWidth();
                                        }
                                        reloadGridPlugins();
                                        var triggePayload = {
                                            table: table_id,
                                            tableData: callback
                                            // layout: scope.initialLayout
                                        };
                                        $rootScope.$broadcast('tableLoaded', triggePayload);
                                        $rootScope.lastLoadedListPayload = null;
                                        $('select[name="asc_jqgrid__entries-entries"]').val(oldTableParams.rows);

                                        $rootScope.getGlobalFilters().then((data) => {
                                            if (data) {
                                                $(Elements.table[Elements.settings[table_id].table]).jqGrid('Ascensys.columnFilters', data);
                                                CLC.tableParams.unpackedFilters = data;
                                            }
                                        });

                                        $('select[name="asc_jqgrid__entries-entries"] option[value="999999"]').text('All');
                                    }
                                }
                            );
                        }
                        // On Load Complete
                        Elements.settings[table_id].source.loadComplete = function(params) {
                            if ($rootScope.getConfigurationForTableLoad && typeof $rootScope.getConfigurationForTableLoad == 'function') {
                                $rootScope.getConfigurationForTableLoad().then((data) => {
                                    if (data) {
                                        if (!jQuery.isEmptyObject(data)) {
                                            console.log(data);
                                            CLC.tableParams.PageFilters = data;
                                            initAfterLoad(params);
                                        }else {
                                            initAfterLoad(params);
                                        }
                                    } else {
                                        initAfterLoad(params);
                                    }
                                });
                            } else {
                                initAfterLoad(params);
                            }
                        };


                        Elements.settings[table_id].source.resizeStop = function(width, index) {
                            $('.ui-jqgrid-view,.ui-jqgrid-bdiv,.ui-jqgrid-hdiv').width($(Elements.table[Elements.settings[table_id].table]).width());
                            if ($("#flat_contract_planning_comment").width()) {
                                let elements =  $(".contract_planning_comments"); 
                                if (elements.length) {
                                    var array = [];
                                    for (var i = 0 ; i < elements.length ; i++) {
                                        elements[i].style.width = "0px";
                                        array.push(parseFloat(elements[i].style.width.split("px")[0]));
                                    }
                                }
                                $rootScope.generalWidth = $("#flat_contract_planning_comment").width();
                            }
                            if ($("#flat_invoices_app_complete_view_list_backOfficeComments").width()) {
                                let elements =  $(".box_office_comments"); 
                                if (elements.length) {
                                    var array = [];
                                    for (var i = 0 ; i < elements.length ; i++) {
                                        elements[i].style.width = "0px";
                                        array.push(parseFloat(elements[i].style.width.split("px")[0]));
                                    }
                                }
                                $rootScope.generalWidth  =  $("#flat_invoices_app_complete_view_list_backOfficeComments").width(); 
                            }
                            MCScustom.load();
                        };
                        Elements.settings[table_id].source.sortupdate = function(index, iCol, sortorder) {
                            $(Elements.table[Elements.settings[settings_keys[i]].table]).jqGrid('setGridWidth', Elements.settings[settings_keys[i]].source.width, true);
                        };
                        Elements.settings[table_id].source.on_page_change = function(data) {
                            CLC.tableParams.page = data.page;
                            CLC.tableParams.PageFilters.sortList = CLC.tableParams.sortList;
                            $(Elements.table[Elements.settings[table_id].table]).trigger('reloadGrid');
                            reloadGridPlugins();
                        };
                        Elements.settings[table_id].source.on_rows_change = function(data) {
                            // console.log(data)
                            CLC.tableParams.rows = data.rows;
                            $(Elements.table[Elements.settings[table_id].table]).jqGrid('setGridParam', { rowNum: data.rows });
                            CLC.tableParams.page = 1;
                            $(Elements.table[Elements.settings[table_id].table]).trigger('reloadGrid');
                            reloadGridPlugins();
                        };
                        Elements.settings[table_id].source.on_general_search = function(data) {
                            CLC.tableParams.SearchText = data;
                            CLC.tableParams.page = 1;
                            $(Elements.table[Elements.settings[table_id].table]).trigger('reloadGrid');
                            reloadGridPlugins();
                        };
                        Elements.settings[table_id].source.on_ui_filter = function(data) {
                            CLC.tableParams.UIFilters = data;
                            console.log('ON PAYLOAD FILTERS', CLC.tableParams.UIFilters);
                            $(Elements.table[Elements.settings[table_id].table]).trigger('reloadGrid');
                            reloadGridPlugins();
                        };
                        Elements.settings[table_id].source.on_page_filter = function(data) {
                            CLC.tableParams.PageFilters = data;
                            CLC.tableParams.sortList = data.sortList;
                            CLC.tableParams.page = 1;
                            console.log('ON Page FILTERS', CLC.tableParams.PageFilters);

                            if (data.sortList) {
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid('setGridParam', { sortname: null });
                            }
                            if (data.raw) {
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid('Ascensys.columnFilters', data.raw);
                            }
                            $(Elements.table[Elements.settings[table_id].table]).trigger('reloadGrid');
                            reloadGridPlugins();
                        };
                        Elements.settings[table_id].source.on_payload_filter = function(data) {
                            console.log('yolo', data);
                            CLC.tableParams.filters = data;
                            console.log('ON PAYLOAD FILTERS', CLC.tableParams.filters);
                            $(Elements.table[Elements.settings[table_id].table]).trigger('reloadGrid');
                            reloadGridPlugins();
                        };

                        /* RADIO SELECT */
                        // console.log(Elements.settings[table_id].source.radioselect)
                        //
                        var reloadGridPlugins = function() {
                            $('.jqgrid_component .jqgrow td:not(:has(span, a))').tooltip({
                                container: 'body',
                                placement: 'auto'
                            });
                        };
                        if (Elements.settings[table_id].source.radioselect == true || table_id == 'flat_invoices_app_deliveries_list') {
                            Elements.settings[table_id].source.onSelectRow = function(rowid, status, e) {
                                let allRowData = Elements.settings[table_id].source.datastr[rowid - 1];
                                if (typeof scope.selected == 'undefined') {
                                    scope.selected = 0;
                                }
                                if (status == true) {
                                    if (scope.selected != rowid) {
                                        $(this).jqGrid('resetSelection');
                                        scope.selected = rowid;
                                        $(`#${ Elements.settings[table_id].table}`).jqGrid('setSelection', rowid);
                                    }
                                } else {
                                    allRowData = null;
                                }
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid.Ascensys.selectedRowData = allRowData;
                            };
                        }
                        if (scope.app == 'invoices' && table_id == 'flat_invoices_app_invoice_list') {
                            Elements.settings[table_id].source.onSelectRow = function(rowid, status, e) {
                                let allRowData = Elements.settings[table_id].source.datastr[rowid - 1];
                                if (!$rootScope.selectedInvoices) {
                                	$rootScope.selectedInvoices = [];
                                }
                                if (status == true) {
                                	$rootScope.selectedInvoices.push(allRowData);
                                } else {
                                	$.each($rootScope.selectedInvoices, (k,v) => {
                                		if (v) {
	                                		if (v.id == allRowData.id) {
	                                			$rootScope.selectedInvoices.splice(k,1);
	                                		}
                                		}
                                	})
                                    // allRowData = null;
                                }
                                console.log($rootScope.selectedInvoices);
                            };
                        }

                        /* RADIO SELECT */
                        /* transactions to be invoiced*/
                        if (scope.app == 'invoices' && scope.id == 'deliveries_transactionstobeinvoiced') {
                            Elements.settings[table_id].source.onSelectRow = function(rowid, status, e) {
                                let allRowData = Elements.settings[table_id].source.datastr[rowid - 1];
                                let orderAdditionalCostId = allRowData.orderAdditionalCostId;
                                var productId = null;
                                if (!orderAdditionalCostId) {
                                    var productId = allRowData.deliveryProductId;
                                }
                                if (typeof scope.selectedProductIds == 'undefined') {
                                    scope.selectedProductIds = [];
                                }
                                if (typeof scope.selectedOrderAdditionalCostId == 'undefined') {
                                    scope.selectedOrderAdditionalCostId = [];
                                }
                                // console.log(status);
                                if (status == true) {
                                    if (scope.selectedOrderId != allRowData.order.id || scope.selectedCounterpartyId != allRowData.counterparty.id) {
                                        scope.selectedProductIds = [];
                                        scope.rowsProduct = [];
                                        scope.selectedOrderAdditionalCostId = [];
                                        scope.selectedOrderId = allRowData.order.id;
                                        var currentSelectedRows = $(`#${ Elements.settings[table_id].table}`).jqGrid('getGridParam', 'selarrrow');
                                        var selectedOrderChanged = false;
                                        $.each(currentSelectedRows, (k, v) => {
                                            if (Elements.settings[table_id].source.datastr[k - 1] != scope.selectedOrderId) {
                                                selectedOrderChanged = true;
                                            }
                                        });
                                        if (selectedOrderChanged) {
                                            $(this).jqGrid('resetSelection');
                                        }
                                        scope.selectedCounterpartyId = allRowData.counterparty.id;
                                        // if (typeof(e) == 'undefined') {
                                        $.each(Elements.settings[table_id].source.datastr, (k, v) => {
                                            if (v.order.id == scope.selectedOrderId && k != rowid - 1) {
                                                $(`#${ Elements.settings[table_id].table}`).jqGrid('setSelection', k + 1);
                                            }
                                        });
                                        // }
                                        $(`#${ Elements.settings[table_id].table}`).jqGrid('setSelection', rowid);
                                        if (scope.selectedProductIds.indexOf(productId) < 0) {
                                            if (productId) {
                                                scope.selectedProductIds.push(productId);
                                                scope.rowsProduct.push(rowid);
                                            }
                                        }
                                        if (scope.selectedOrderAdditionalCostId.indexOf(orderAdditionalCostId) < 0) {
                                            if (orderAdditionalCostId) {
                                                scope.selectedOrderAdditionalCostId.push(orderAdditionalCostId);
                                            }
                                        }
                                    } else {
                                        if (productId) {
                                            scope.selectedProductIds.push(productId);
                                            scope.rowsProduct.push(rowid);
                                        }
                                        if (orderAdditionalCostId) {
                                            scope.selectedOrderAdditionalCostId.push(orderAdditionalCostId);
                                        }
                                    }
                                } else {
                                    if (productId) {
                                        scope.selectedProductIds.splice(scope.selectedProductIds.indexOf(productId), 1);
                                        scope.rowsProduct.splice(scope.rowsProduct.indexOf(rowid), 1);

                                        if (scope.selectedProductIds.length == 0) {
                                            scope.selectedOrderId = null;
                                            scope.selectedCounterpartyId = null;
                                        }
                                    }
                                    if (orderAdditionalCostId) {
                                        scope.selectedOrderAdditionalCostId.splice(scope.selectedOrderAdditionalCostId.indexOf(orderAdditionalCostId), 1);
                                        if (scope.selectedOrderAdditionalCostId.length == 0) {
                                            scope.selectedOrderId = null;
                                            scope.selectedCounterpartyId = null;
                                        }
                                    }
                                }
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid.Ascensys.selectedProductIds = scope.selectedProductIds;
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid.Ascensys.rowsProduct = scope.rowsProduct;
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid.Ascensys.selectedOrderAdditionalCostId = scope.selectedOrderAdditionalCostId;
                                console.log(scope.rowsProduct);
                                console.log(scope.selectedProductIds, scope.selectedOrderAdditionalCostId);
                            };
                        }
                        if (scope.app == 'delivery' && scope.id == 'delivery_deliverylist' || scope.app == 'delivery' && scope.id == 'delivery_ordersdeliverylist') {
                            Elements.settings[table_id].source.beforeSelectRow = function(rowid, e) {
                                if (typeof $rootScope.selectedRowId == 'undefined') {
                                    $rootScope.selectedRowId = null;
                                }
                                // if ($rootScope.selectedRowId != rowid && $rootScope.selectedRowId != null) {
                                //     $("#" + Elements.settings[table_id].table).jqGrid('resetSelection');
                                // }
                                if (typeof $rootScope.selectDeliveryRows == 'undefined') {
                                    $rootScope.selectDeliveryRows = [];
                                }
                                let selectedRowsIds = $(`#${ Elements.settings[table_id].table}`).jqGrid('getGridParam', 'selarrrow');
                                if (selectedRowsIds.length > 0) {
                                    var rowData = Elements.settings[table_id].source.datastr[selectedRowsIds[0] - 1];
                                    var selectionData = Elements.settings[table_id].source.datastr[rowid - 1];
                                    if (rowData.order.id != selectionData.order.id) {
                                        $(`#${ Elements.settings[table_id].table}`).jqGrid('resetSelection');
                                        $rootScope.selectDeliveryRows = [];
                                    }
                                }
                            };
                            Elements.settings[table_id].source.onSelectRow = function(rowid, status, e) {
                                if (status == true) {
                                    $rootScope.selectedRowId = rowid;
                                    let allRowData = Elements.settings[table_id].source.datastr[rowid - 1];
                                    $rootScope.selectDeliveryRows = allRowData;
                                    console.log(allRowData);
                                    // /
                                    if (typeof $rootScope.selectDeliveryRows == 'undefined') {
                                        $rootScope.selectDeliveryRows = [];
                                    }
                                    let selectedRowsIds = $(`#${ Elements.settings[table_id].table}`).jqGrid('getGridParam', 'selarrrow');
                                    console.log('selectedRowsIds', selectedRowsIds);
                                    $rootScope.selectDeliveryRows = [];
                                    $.each(selectedRowsIds, (key, val) => {
                                        rowData = Elements.settings[table_id].source.datastr[val - 1];
                                        $rootScope.selectDeliveryRows.push(rowData);
                                    });
                                } else {
                                    $rootScope.selectedRowId = null;
                                    $rootScope.selectDeliveryRow = null;
                                    if (typeof $rootScope.selectDeliveryRows != 'undefined') {
                                        var removeSel = Elements.settings[table_id].source.datastr[rowid - 1];
                                        $.each($rootScope.selectDeliveryRows, (key, val) => {
                                            if (val.id == removeSel.id) {
                                                $rootScope.selectDeliveryRows.splice(key, 1);
                                                return false; // return false to break from $.each
                                            }
                                        });
                                    }
                                }
                            };
                        } else if (checkProcurement >= 0) {
                            Elements.settings[table_id].source.beforeSelectRow = function(rowid, e) {
                                return $(e.target).is('input[type=checkbox]');
                            };
                        }

                        function resizeTableWidth() {
                            if (typeof Elements.settings[table_id] != 'undefined') {
                                var jqgrid_element = $(Elements.table[Elements.settings[table_id].table]).parents('.jqgrid_component');
                            }
                            let old_size = 0;
                            let new_size = 0;
                            let matches = 0;
                            if (typeof matchCheckInterval !== 'undefined') {
                                clearInterval(matchCheckInterval);
                            }
                            window.matchCheckInterval = setInterval(() => {
                                if (matches >= 2) {
                                    clearInterval(matchCheckInterval);
                                    return;
                                }
                                {
                                    let overWidth = 0;
                                    let hScrollWidth = $('.ui-jqgrid').width();
                                    let settings_keys = Object.keys(Elements.settings);
                                    for (let i = 0; i < settings_keys.length; i++) {
                                        jqgrid_element = $(Elements.table[Elements.settings[settings_keys[i]].table]).parents('.jqgrid_component');
                                        var columnsNo = 0;
                                        if (typeof Elements.table[Elements.settings[settings_keys[i]].table] != 'undefined') {
                                            var columns = Elements.table[Elements.settings[settings_keys[i]].table].jqGrid('getGridParam', 'colModel');
                                        }
                                        $.each(columns, (key, val) => {
                                            if (!val.hidden) {
                                                columnsNo++;
                                            }
                                        });
                                        // $(Elements.table[Elements.settings[settings_keys[i]].table]).setGridParam('shrinkToFit', true)
                                        if (jqgrid_element.width() < hScrollWidth) {
                                            Elements.settings[settings_keys[i]].source.width = hScrollWidth;
                                            // jqgrid_element.find('.ui-jqgrid-view').addClass('border-scroll');
                                            overWidth = 1;
                                        } else {
                                            jqgrid_element.find('.ui-jqgrid-view').removeClass('border-scroll');
                                            if (columnsNo * 100 <= jqgrid_element.width()) {
                                                Elements.settings[settings_keys[i]].source.width = jqgrid_element.width();
                                            } else {
                                                Elements.settings[settings_keys[i]].source.width = columnsNo * 150;
                                            }
                                        }
                                        Elements.settings[settings_keys[i]].source.width = Elements.settings[settings_keys[i]].source.width - overWidth;

                                        let screenCssPixelRatio = (window.outerWidth - 8) / window.innerWidth;
                                        var zoomLevel;
                                        if (screenCssPixelRatio >= 0.46 && screenCssPixelRatio <= 0.54) {
                                            zoomLevel = '-4';
                                        } else if (screenCssPixelRatio <= 0.64) {
                                            zoomLevel = '-3';
                                        } else if (screenCssPixelRatio <= 0.76) {
                                            zoomLevel = '-2';
                                        } else if (screenCssPixelRatio <= 0.92) {
                                            zoomLevel = '-1';
                                        } else if (screenCssPixelRatio <= 1.10) {
                                            zoomLevel = '0';
                                        } else if (screenCssPixelRatio <= 1.32) {
                                            zoomLevel = '1';
                                        } else if (screenCssPixelRatio <= 1.58) {
                                            zoomLevel = '2';
                                        } else if (screenCssPixelRatio <= 1.90) {
                                            zoomLevel = '3';
                                        } else if (screenCssPixelRatio <= 2.28) {
                                            zoomLevel = '4';
                                        } else if (screenCssPixelRatio <= 2.70) {
                                            zoomLevel = '5';
                                        } else {
                                            zoomLevel = 'unknown';
                                        }
                                        // if (zoomLevel == "0") {
                                        $(Elements.table[Elements.settings[settings_keys[i]].table]).jqGrid('setGridWidth', Elements.settings[settings_keys[i]].source.width, true);
                                        // }
                                    }
                                    MCScustom.load();
                                }
                                if (typeof jqgrid_element != 'undefined') {
                                    old_size = new_size;
                                    new_size = jqgrid_element.width();
                                    if (new_size == old_size) {
                                        matches++;
                                    }
                                }
                            }, 50);
                        }
                        // Before processing
                        // Elements.settings[table_id].source.beforeProcessing = function(data, status, xhr) {};
                        // Row Actions
                        // console.log(scope.rowActions)
                        if (Elements.settings[table_id].source.rowActions) {
                            if (Elements.settings[table_id].source.colModel[0].name.indexOf('actions') < 0) {
                                $.each(Elements.settings[table_id].source.rowActions, (i, v) => {
                                    // var actionObj = v;
                                    let column = {
                                        action_index: i,
                                        label: `Actions-${ i}`,
                                        name: `actions-${ i}`,
                                        key: true,
                                        width: v.width ? v.width : 32,
                                        sortable: false,
                                        resizable: false,
                                        frozen: true,
                                        fixed: true,
                                        exclude: true,
                                        formatter: v.formatter ?
                                            CLC.get_formatter(v.formatter) :
                                            function(cellvalue, options, rowObject) {
                                                let actions = '';
                                                let rowID = 0;


                                                if (typeof v.idSrc != 'undefined') {
                                                    if(v.idSrc == 'voyageDetail.request.id') {
                                                        if(rowObject.voyageDetail) {
                                                            if(rowObject.voyageDetail.request) {
                                                                rowID = rowObject.voyageDetail.request.id;
                                                                if (Elements.settings[table_id].source.table_name == 'Table Schedule Dashboard') {
                                                                    if (rowID != 0) {
                                                                        return `<a  href="/#/edit-request/${ rowID }"><span style="display: block; margin-left: 7px !important;" title="Edit" class="jqgrid-ng-action edit" >Edit</span></a>`;
                                                                    }
                                                                    return `<a disabled="true" style="display: block; height: 35px; width: 30px;" href="/#/edit-request/${ rowID }"><span style="position: relative; display: block; margin-left: 7px !important; top: 6px !important;" title="Edit" class="jqgrid-ng-action edit" >Edit</span></a>`;
                                                                }
                                                                return `<a href="/#/edit-request/${ rowID }"><span title="Edit" class="jqgrid-ng-action edit" >Edit</span></a>`;
                                                            }
                                                            rowID = rowObject.voyageDetail.id;
                                                            return `<a href="/#/new-request/${ rowID }"><span title="Edit" class="jqgrid-ng-action edit" >Edit</span></a>`;
                                                        }
                                                    }else if (typeof rowObject[v.idSrc] == 'object') {
                                                        rowID = rowObject[v.idSrc].id;
                                                    } else {
                                                        rowID = rowObject[v.idSrc];
                                                        if (!rowID && v.altId) {
                                                            return `<a href="/#/new-request/${ rowObject[v.altId] }"><span title="Edit" class="jqgrid-ng-action edit" >Edit</span></a>`;
                                                        }
                                                        if (!rowID && !v.altId) {
                                                            return '';
                                                        }
                                                    }
                                                } else if (rowObject.id) {
                                                    rowID = rowObject.id;
                                                    // console.log('idSRC: default (id)');
                                                }
                                                // console.log('JQGRID EDIT ACTION ID: ', rowID);
                                                let i = options.colModel.action_index;
                                                var rowId = '';
                                                if (typeof rowObject[v.url] !== 'undefined') {
                                                    if (rowObject[v.url]) {
                                                        rowId = rowObject[v.url].id;
                                                    }
                                                }
                                                if (table_id == 'flat_invoices_app_invoice_list') {
                                                    if (rowObject.isClaimSybtype) {
                                                        actions = `<a href="/v2/invoices/edit/${ rowObject.invoice.id }" ><span class="jqgrid-ng-action ${ v.class }" title="${ v.label }">${ v.label }</span></a>`;
                                                        return actions;
                                                    }
                                                    if (typeof rowObject.invoiceType != 'undefined' && rowObject.invoiceType) {
                                                        if (rowObject.invoiceType.name == 'CreditNote' || rowObject.invoiceType.name == 'DebitNote') {
                                                            actions = `<a href="/v2/invoices/edit/${ rowObject.invoice.id }" ><span class="jqgrid-ng-action ${ v.class }" title="${ v.label }">${ v.label }</span></a>`;
                                                            return actions;
                                                        }
                                                        actions = `<a href="/v2/invoices/edit/${ rowObject.invoice.id }" ><span class="jqgrid-ng-action ${ v.class }" title="${ v.label }">${ v.label }</span></a>`;
                                                        return actions;
                                                    }
                                                }
                                                if (table_id == 'flat_email_log_list') {
                                                    var index = parseFloat(options.rowId) - 1;
                                                    rowObject = Elements.settings[table_id].source.datastr[index];
                                                    actions = `<a href="/#/masters/emaillogs/edit/${ rowObject.id }" target="_blank" ><span class="jqgrid-ng-action edit"></span></a>`;
                                                    return actions;
                                                }
                                                
                                                if (table_id == 'flat_trade_book_mapping_list' && rowObject.tradeBook) {
                                                    actions = `<span class="jqgrid-ng-action ${ v.class }" ng-click="CLC.do_entity_action('${ v.class }', '${ rowObject.tradeBook.id }', '', null, '${ checkProcurement }')"></span></a>`;
                                                    return actions;
                                                }
                                                var cellAttrs;
                                                if (v.data_attributes) {
                                                    cellAttrs = `<a ng-disabled ="!${ eval(v.disabled) }"${ v.data_attributes } ng-click="CLC.dataAction('${ v.action }', '${ encodeURIComponent(JSON.stringify(rowObject)) }')" class=" ${ v.class }">${ v.label }</a>`;
                                                } else {
                                                    cellAttrs = `<span title="${ v.label }" class="jqgrid-ng-action ${ v.class }" ng-click="CLC.do_entity_action('${ v.class }', '${ rowID }', '${ rowId }', null, '${ checkProcurement }')">${ v.label }</span>`;
                                                }
                                                actions = cellAttrs;
                                                return actions;
                                            }
                                    };
                                    if (v.last) {
                                        Elements.settings[table_id].source.colModel.push(column);
                                    } else {
                                        Elements.settings[table_id].source.colModel.unshift(column);
                                    }
                                });
                            }
                        }
                        if (!customLayout) {
                            // Hidden columns
                            if (Elements.settings[table_id].source.tenantData.hiddenColumns) {
                                for (var i = 0; i < Elements.settings[table_id].source.tenantData.hiddenColumns.length; i++) {
                                    if (!Elements.scope[attrs.id].modal) {
                                        Elements.settings[table_id].source.colModel[Elements.settings[table_id].source.tenantData.hiddenColumns[i]].hidden = true;
                                    }
                                }
                            }
                        }
                        // rowList
                        Elements.settings[table_id].source.tenantData.rowList = Elements.settings[table_id].source.rowList;
                        // -start- TABLE
                        $timeout(() => {
                            {
                                $(`[id*="${ attrs.selector }"]`).html('');
                                // define elements
                                Elements.container = angular.element(`<div class="jqgrid_component" data-view-type="${ table_view }"></div>`);
                                Elements.table[Elements.settings[table_id].table] = angular.element(`<table id="${ Elements.settings[table_id].table }"></table>`);
                                Elements.pager[Elements.settings[table_id].pager] = angular.element(`<div id="${ Elements.settings[table_id].pager }"></div>`);
                                $(`[id*="${ attrs.selector }"]`).html(Elements.container);
                                Elements.container.append(Elements.table[Elements.settings[table_id].table]);
                                Elements.container.append(Elements.pager[Elements.settings[table_id].pager]);
                                // Load JQGRID
                                $(Elements.table[Elements.settings[table_id].table]).jqGrid(Elements.settings[table_id].source);
                                // if (CLC.tableParams.tableColumnFilters) {
                                // $.each(CLC.tableParams.tableColumnFilters, function(k, v) {

                                console.log(table_id);
                                if(table_id === 'flat_schedule_dashboard_table') {
                                    $('#flat_schedule_dashboard_table')
                                        .closest('div.ui-jqgrid-view')
                                        .find('div.ui-jqgrid-hdiv table.ui-jqgrid-htable tr.ui-jqgrid-labels > th.ui-th-column')
                                        .each(function() {
                                            let colId = $(this)
                                                .attr('id')
                                                .replace(/\./g, '_')
                                                .replace(/ /g, '');
                                            let col = colId.replace(`${table_id }_`, '');
                                            let sortCol = col.toLowerCase();


                                            $(this).attr('id', colId);
                                            $(this).find('div').attr('id', colId);

                                            console.log(colId);
                                            console.log(sortCol, col);


                                            if(colId != 'flat_schedule_dashboard_table_voyageDetail_request_requestDetail_fuelMaxQuantity' &&
                                                colId != 'flat_schedule_dashboard_table_voyageDetail_request_requestDetail_contractMaxQuantity') {
                                                // min - max quantity columns should not have sorting
                                                if($(this).hasClass('ui-sortable-handle')) {
                                                    var helperCoulmnTitle = `${$rootScope.currentColumnRoute } : ${ col}`;
                                                    $(this)
                                                        .append(`<a class="colMenu" title="${ helperCoulmnTitle }" data-column="${ col }" data-table="${ table_id } data-sortCol="${ sortCol }"><i class="fa fa-caret-down"></i></a>`);
                                                }
                                            }
                                        });
                                }else{
                                    $(`#${ table_id}`)
                                        .closest('div.ui-jqgrid-view')
                                        .find('div.ui-jqgrid-hdiv table.ui-jqgrid-htable tr.ui-jqgrid-labels > th.ui-th-column > span.ui-jqgrid-resize')
                                        .each(function() {
                                            let sortCol = $(this)
                                                .siblings('div')
                                                .attr('id')
                                                .replace(`jqgh_${ table_id }_`, '')
                                                .replace(/\./g, '0')
                                                .replace(/0/g, '_')
                                                .replace(/ /g, '');
                                            let col = _
                                                .startCase(
                                                    $(this)
                                                        .siblings('div')
                                                        .attr('id')
                                                        .replace(`jqgh_${ table_id }_`, '')
                                                        .replace(/\./g, '0')
                                                )
                                                .replace(/0/g, '_')
                                                .replace(/ /g, '');
                                            // console.log(col);
                                            // if (v.columnValue == col) {

                                            // console.log(col,sortCol);

                                            helperCoulmnTitle = `${$rootScope.currentColumnRoute } : ${ col}`;
                                            let toAppend = `<a class="colMenu" title="${ helperCoulmnTitle }" data-column="${ col }" data-table="${ table_id }"><i class="fa fa-caret-down"></i></a>`;
                                            $(this)
                                                .parent()
                                                .append($(toAppend).attr('data-sortCol', sortCol.toLowerCase()));
                                            // .append('<input type="checkbox">');
                                            // }

                                            if ($(this).parent('#flat_invoices_app_complete_view_list_isChecked').length > 0) {
                                                $(this)
                                                    .parent()
                                                    .append('<input class="treasury_checkbox" id="treasury_checkbox_header" type="checkbox" ng-model="CLC.treasury_checkbox_header" ng-change="CLC.selectAllTreasuryRows()" ng-init="CLC.calculateSubtotal()"><label class="treasury_checkbox header" for="treasury_checkbox_header"><i class="fa fa-check"></i></label>');
                                                // $(this).find(".s-ico").remove();
                                                // $(this).parent().find(".colMenu").remove();
                                            }
                                        });
                                }


                                // });
                                $('.colMenu').on('click', function($event) {
                                    $event.preventDefault();


                                    $('custom-popover').remove();
                                    let left = $event.pageX < window.innerWidth - 350 ? $event.pageX : $event.pageX - 260;
                                    $('custom-popover').unbind();
                                    angular.element('body').append($compile(`<custom-popover style="left:${ left }px;top:${ $event.pageY + 20 }px" column = "'${ $(this).data('column') }'" table = "'${ $(this).data('table') }'" sortcol = "'${ $(this).data('sortcol') }'"></custom-popover>`)(scope));
                                    setTimeout(() => {
                                        MCScustom.load();
                                    });
                                });
                                // }

                                $(Elements.table[Elements.settings[table_id].table]).jqGrid('navGrid', `#${ Elements.settings[table_id].pager}`, {
                                    edit: false,
                                    add: false,
                                    del: false,
                                    search: false,
                                    refresh: true
                                });
                            }
                        });

                        $('tbody').first().attr('id', 'scrollArea');
                        $('.ui-jqgrid-bdiv').first().attr('id', 'contentArea');
                        // -end- TABLE
                        // var clusterize = new window.Clusterize({
                        //   scrollId: 'scrollArea',
                        //   contentId: 'contentArea'
                        // });
                    }
                }
            };
        }
    ]);

    /**
     * Entity Edit Control (EEC)
     * {form} directive
     */
    APP_GENERAL_COMPONENTS.directive('entityEditForm', [
        '$templateRequest',
        '$compile',
        function($templateRequest, $compile) {
            return {
                restrict: 'E',
                // controller: "Controller_Master as CM",
                // controller: "ScreenLayout_Controller as SLC",
                scope: {
                    structure: '=',
                    type: '=',
                    screen: '=',
                    entity: '=',
                    editAction: '=',
                    app: '=',
                    screenchild: '='
                },
                link: function(scope, element, attrs) {
                    // Load Template
                    $templateRequest('app-general-components/views/entity_edit_form.html').then((html) => {
                        let wrappedHtml = `<div ng-controller='Controller_Master as CM'>${html }</div>`;
                        if (attrs.specificController) {
                            wrappedHtml = `<div ng-controller='${attrs.specificController }'>${ html }</div>`;
                        }
                        element.append($compile(wrappedHtml)(scope));
                    });
                }
            };
        }

    ]);

    /**
     * Dynamic Layout Control (DLC)
     * {structure list} directive
     */
    APP_GENERAL_COMPONENTS.directive('dinamicLayoutControl', [
        '$templateRequest',
        '$compile',
        function($templateRequest, $compile) {
            return {
                restrict: 'E',
                controller: 'Controller_Master as CM',
                scope: {
                    structure: '=',
                    elements: '=',
                    screen: '='
                },
                link: function(scope, element, attrs) {
                    // Load Template
                    $templateRequest('app-general-components/views/dinamic_layout_control.html').then((html) => {
                        element.append($compile(html)(scope));
                    });
                    // scope watch : structure
                    scope.$watch('structure', (newValue) => {
                        scope.structure = newValue;
                    });
                    // scope watch : elements
                    scope.$watch('elements', (newValue) => {
                        scope.elements = newValue;
                    });
                    scope.$watch('app', (newValue) => {
                        scope.app = newValue;
                    });
                }
            };
        }
    ]);

    /**
     * Data Tables custom Directive
     *
     */
    // APP_GENERAL_COMPONENTS.directive('ascDataTables', ['$templateRequest', '$compile', function($templateRequest, $compile) {
    //     return {
    //         restrict: 'E',
    //         controller: 'Controller_Master as CM',
    //         scope: {
    //             source: '='
    //         },
    //         link: function(scope, element, attrs) {
    //             // Load Template
    //             $templateRequest('app-general-components/views/custom_data_tables.html').then(function(html) {
    //                 element.append($compile(html)(scope));
    //             });
    //             scope.$watch('source', function(newValue) {
    //                 scope.source = newValue;
    //             });
    //         },
    //     }
    // }]);
    /**
     * General Header
     * used for actions and searchbar
     */
    APP_GENERAL_COMPONENTS.directive('generalHeader', [
        '$templateRequest',
        '$compile',
        '$rootScope',
        function($templateRequest, $compile, $rootScope) {
            return {
                restrict: 'E',
                controller: 'Controller_General_Header as GH',
                scope: {
                    actions: '=',
                    color: '='
                },
                link: function(scope, element, attrs) {
                	console.log($rootScope.adminConfiguration);
                    // Load Template
                    $templateRequest('app-general-components/views/general_header.html').then((html) => {
                        element.append($compile(html)(scope));
                    });
                    // scope watch actions
                    // label | special | type | method | url
                    scope.$watch('actions', (newValue) => {
                        scope.actions = newValue;
                    });
                    // scope watch color
                    scope.$watch('color', (newValue) => {
                        if (newValue) {
                            if (newValue == 'white') {
                                scope.color = 'white';
                            } else {
                                scope.color = 'gray';
                            }
                        }
                    });
                }
            };
        }
    ]);
    // Create dynamic model
    APP_GENERAL_COMPONENTS.directive('dynamicModel', [
        '$compile',
        '$parse',
        function($compile, $parse) {
            return {
                restrict: 'A',
                terminal: true,
                priority: 100000,
                link: function(scope, elem, attrs) {
                    if (!attrs.dynamicModel) {
                        return;
                    }
                    let name = $parse(attrs.dynamicModel)(scope);
                    elem.removeAttr('dynamic-model');
                    elem.attr('ng-model', name);
                    $compile(elem)(scope);
                }
            };
        }
    ]); // Create dynamic conditions
    // Create dynamic conditions
    // Dynamic condition for non-repeating elements
    APP_GENERAL_COMPONENTS.directive('dynamicCondition', [
        '$compile',
        function($compile) {
            return {
                link: function(scope, element, attrs) {
                    // scope.$watchGroup([attrs.dynamicCondition, attrs.dynamicConditionType], function(dynamicCondition) {
                    if (!attrs.dynamicConditionType || !attrs.dynamicCondition) {
                        return;
                    }
                    // console.log('test')
                    element.removeAttr('dynamic-condition');
                    element.removeAttr('dynamic-condition-type');
                    element.attr(attrs.dynamicConditionType, attrs.dynamicCondition);
                    element.unbind();
                    $compile(element)(scope);
                    // });
                }
            };
        }
    ]);
    // Dynamic condition for elements with ng-repeat/ng-options/.. child nodes
    APP_GENERAL_COMPONENTS.directive('dynamicConditionRepeat', [
        '$compile',
        function($compile) {
            return {
                link: function(scope, element, attrs) {
                    // scope.$watchGroup([attrs.dynamicCondition, attrs.dynamicConditionType], function(dynamicCondition) {
                    if (!attrs.dynamicConditionType || !attrs.dynamicCondition) {
                        return;
                    }
                    // console.log('test')
                    element.removeAttr('dynamic-condition-repeat');
                    element.removeAttr('dynamic-condition-repeat-type');
                    element.attr(attrs.dynamicConditionType, attrs.dynamicCondition);
                    element.unbind();
                    // $compile(element)(scope);
                    // });
                },
                compile: function(scope, element, attrs) {
                    return {
                        post: function() {
                            $compile(element)(scope);
                        }
                    };
                }
            };
        }
    ]);
    APP_GENERAL_COMPONENTS.directive('dynamicPattern', [
        '$compile',
        function($compile) {
            return {
                link: function(scope, element, attrs) {
                    // scope.$watch(attrs.dynamicPattern, function(dynamicPattern) {
                    if (!attrs.dynamicPattern) {
                        return;
                    }
                   
                    var pattern = '';
                    if (attrs.dynamicPattern == 'decimalNumber' || attrs.dynamicPattern == 'Number') {
                        pattern = /^[-,+]*\d{1,6}(,\d{3})*(\.\d*)?$/;
                    } else if (attrs.dynamicPattern == 'longNumber') {
                        pattern = /^[-,+]*\d{1,15}(,\d{3})*(\.\d*)?$/;
                    } 
                    else if(attrs.dynamicPattern == 'char'){
                        pattern = /^[a-zA-Z._-]+$/;
                    }
                    else if(attrs.dynamicPattern == 'alphaNumeric'){
                        pattern = /^[a-zA-Z0-9._-]+$/;
                    }
                    else if (attrs.dynamicPattern == 'website') {
                        pattern = /^((https?|ftp):\/\/)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,20}){1,20}(\/.*[?].*)?[.]?$/;
                    } else if (attrs.dynamicPattern == 'email') {
                        // pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-][.]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                        pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    } else {
                        element.removeAttr('ng-pattern');
                    }
                    element.attr('ng-pattern', pattern);
                    element.removeAttr('dynamic-pattern');
                    element.unbind();
                    setTimeout(function(){
                        $compile(element)(scope);
                    })
                    // });
                }
            };
        }
    ]);
    // APP_GENERAL_COMPONENTS.directive('todayDate', ['$compile', function($compile) {
    //     return {
    //         'link': function(scope, element, attrs) {
    //             // scope.$watchGroup([attrs.dynamicCondition, attrs.dynamicConditionType], function(dynamicCondition) {
    //             if (!attrs.todayDate) return;
    //             setTimeout(function() {
    //                 $('#' + attrs.id).val('2016-06-05T00:00:00').trigger('change')
    //             }, 1);
    //             element.removeAttr("todayDate");
    //             element.unbind();
    //             // $compile(element)(scope);
    //             // });
    //         }
    //     };
    // }]);
    APP_GENERAL_COMPONENTS.directive('computeFormula', [
        '$filter',
        function($filter) {
            return {
                restrict: 'A',
                scope: {
                    computeFormula: '='
                },
                link: function(scope, element, attrs) {
                    // set the initial value of the textbox
                    //
                    element.val(scope.computeFormula);
                    element.data('old-value', scope.computeFormula);
                    // detect outside changes and update our input
                    if (isNaN(scope.computeFormula) || typeof scope.computeFormula === 'undefined') {
                        return;
                    }
                    scope.$watch('computeFormula', (val) => {
                        element.val($filter('number')(scope.computeFormula, 3));
                        element.change();
                    });
                    // on blur, update the value in scope

                    setTimeout(() => {
                        element.change();
                    }, 10);
                }
            };
        }
    ]);
    APP_GENERAL_COMPONENTS.directive('contenteditable', () => {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                function read() {
                    ngModel.$setViewValue(element.html());
                }
                ngModel.$render = function() {
                    element.html(ngModel.$viewValue || '');
                };
                element.bind('blur keyup change', () => {
                    scope.$apply(read);
                });
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('backButton', () => {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', () => {
                    history.back();
                    scope.$apply();
                });
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('starRating', () => {
        // var template = ''
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {},
            templateUrl: 'app-general-components/views/controls/starRating.html',
            link: function(scope, element, attrs, ngModel) {
                let unregister = scope.$watch(() => {
                    return ngModel.$modelValue;
                }, initialize);

                function initialize(value) {
                    let filledStars = $(element).find('.filled');
                    filledStars.css('width', `${ngModel.$viewValue * 20 }%`);
                    $(element)
                        .find('input')
                        .val(ngModel.$viewValue);
                    unregister();
                }
                scope.$watch(
                    () => {
                        return ngModel.$modelValue;
                    },
                    (newValue) => {
                        let currentWidth = newValue * 20;
                        $(element)
                            .find('.filled')
                            .css('width', `${currentWidth }%`);
                        $(element)
                            .find('input')
                            .val(newValue);
                    }
                );
                $(element)
                    .children('.stars')
                    .on('mouseleave', (event) => {
                        let target = event.currentTarget;
                        let initialWidth = ngModel.$viewValue * 20;
                        $(target)
                            .children('.filled')
                            .css('width', `${initialWidth }%`);
                        $(target)
                            .children('.filled')
                            .css('opacity', 1);
                        // console.log(ngModel.$viewValue);
                    });
                scope.previewRating = function(event) {
                    let target = event.currentTarget;
                    let parentWidth = $(target).context.offsetWidth;
                    let ratingPercent = event.offsetX / parentWidth * 100;
                    let starRating = ratingPercent * 5 / 100;
                    let roundedStarRating = Math.ceil(starRating * 2) / 2;
                    let filledWidth = roundedStarRating * 20;
                    $(target)
                        .children('.filled')
                        .css('opacity', 0.5);
                    $(target)
                        .children('.filled')
                        .css('width', `${filledWidth }%`);
                };
                scope.calculateRating = function(event) {
                    let target = event.currentTarget;
                    let parentWidth = $(target).context.offsetWidth;
                    // var clickPos = event.offsetX;
                    let ratingPercent = event.offsetX / parentWidth * 100;
                    let starRating = ratingPercent * 5 / 100;
                    let roundedStarRating = Math.ceil(starRating * 2) / 2;
                    let filledWidth = roundedStarRating * 20;
                    ngModel.$setViewValue(roundedStarRating);
                    $(target)
                        .next('input')
                        .val(ngModel.$viewValue);
                    // $(target).next('input').attr('ng-model',ngModel);
                    $(target)
                        .children('.filled')
                        .animate(
                            {
                                width: `${filledWidth }%`
                            },
                            300
                        );
                    // css("width",filledWidth+'%');
                };
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('imagedrop', [
        '$parse',
        '$document',
        function($parse, $document) {
            return {
                restrict: 'A',
                // controller: 'Controller_Master as CM',
                link: function(scope, element, attrs) {
                    let onImageDrop = $parse(attrs.onImageDrop);
                    // When an item is dragged over the document
                    let onDragOver = function(e) {
                        e.preventDefault();
                        angular.element('body').addClass('dragOver');
                    };
                    // When the user leaves the window, cancels the drag or drops the item
                    let onDragEnd = function(e) {
                        e.preventDefault();
                        angular.element('body').removeClass('dragOver');
                    };
                    // When a file is dropped
                    let loadFile = function(file) {
                        scope.uploadedFile = file;
                        scope.$apply(onImageDrop(scope));
                        console.log(file);
                        // reader = new FileReader();
                        // reader.onload = function(event) {
                        //     scope.uploadedFile = event.target.result;
                        //     scope.uploadedFile = scope.uploadedFile.split(",");
                        //     scope.$apply(onImageDrop(scope));
                        // };
                        // reader.readAsDataURL(file);
                    };
                    // Dragging begins on the document
                    $document.bind('dragover', onDragOver);
                    // Dragging ends on the overlay, which takes the whole window
                    element.bind('dragleave', onDragEnd).bind('drop', (e) => {
                        onDragEnd(e);
                        loadFile(e.originalEvent.dataTransfer.files[0]);
                    });
                }
            };
        }
    ]);
    APP_GENERAL_COMPONENTS.directive('contenteditable', () => {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                function read() {
                    ngModel.$setViewValue(element.html());
                }
                ngModel.$render = function() {
                    element.html(ngModel.$viewValue || '');
                };
                element.bind('blur keyup change', () => {
                    scope.$apply(read);
                });
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('changeviewmodel', () => {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                // format text going to user (model to view)
                ngModel.$formatters.push((value) => {
                    // console.log(ngModel)
                    return ngModel.$modelValue.replace('##order##', '<span class="tag label label-info" style="clear: none;">Request<span data-role="remove"></span></span>');
                });
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('multiTags', () => {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(
                    'formValues',
                    (newValue, oldValue) => {
                        if (newValue) {
	                            if (window.location.href.indexOf("contracts/contract/edit/") != -1) {
	                                if (!oldValue.company || (oldValue.company && oldValue.company.name != newValue.company.name) || (oldValue.allowedCompanies.length != newValue.allowedCompanies.length)) {
	                                    scope.multiTags(attrs.uniqueId, -1, attrs.name);
	                                }
	                            } else {
		                        	tagNewValue = JSON.stringify(newValue[attrs.uniqueId]);
		                        	tagOldValue = JSON.stringify(oldValue[attrs.uniqueId]);
			                    	if (tagNewValue != tagOldValue || tagOldValue == undefined || !$(element).hasClass("multiTagInitialized")) {
		                                scope.multiTags(attrs.uniqueId, -1, attrs.name);
		                                $(element).addClass("multiTagInitialized")
			                    	}
	                            }
                        }
                    },
                    true
                );
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('multiSelect', () => {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.selectpicker({
                    iconBase: 'fa',
                    tickIcon: 'fa-check',
                    container: 'body'
                });
                element.selectpicker('refresh').selectpicker('selectAll');
                setTimeout(() => {
                    element.change();
                }, 1);
                scope.$watch(
                    'formFieldsNew',
                    (newValue, oldValue) => {
                        if (newValue) {
                            element.selectpicker('refresh').selectpicker('selectAll');
                        }
                        setTimeout(() => {
                            element.change();
                        }, 1);
                    },
                    true
                );
                scope.$on('lastValueDeselected', (ev, args) => {
                    let value = `string:${ args.value}`;
                    element.selectpicker('val', value);
                    element.selectpicker('render');
                });
                // scope.$watch('formValues', function(newValue, oldValue) {
                //     if (newValue) scope.multiTags(attrs.uniqueId, -1, attrs.name);
                // }, true);
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('timePicker', () => {
        // var template = ''
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {},
            link: function(scope, element, attrs, ngModel) {
                let unregister = scope.$watch(() => {
                    return ngModel.$modelValue;
                }, initialize);

                function initialize(value) {
                    unregister();
                }
                scope.$watch(
                    () => {
                        return ngModel.$modelValue;
                    },
                    () => {
                        let minutes = ngModel.$viewValue % 60;
                        let hours = (ngModel.$viewValue - minutes) / 60;
                        if (hours < 10) {
                            hours = `0${ hours}`;
                        }
                        if (minutes < 10) {
                            minutes = `0${ minutes}`;
                        }
                        $(element)
                            .find('.hours')
                            .val(hours);
                        $(element)
                            .find('.minutes')
                            .val(minutes);
                    }
                );
                $(element)
                    .find('.hours')
                    .on('change', function() {
                        if ($(this).val() > 23) {
                            $(this).val(23);
                        }
                        if ($(this).val() < 10) {
                            $(this).val(`0${ $(this).val()}`);
                        }
                        var hours = $(this).val();
                        var minutes = $(element)
                            .find('.minutes')
                            .val();
                        var newTime = parseFloat(hours * 60) + parseFloat(minutes);
                        ngModel.$setViewValue(newTime);
                    });
                $(element)
                    .find('.minutes')
                    .on('change', function() {
                        if ($(this).val() > 59) {
                            $(this).val(59);
                        }
                        if ($(this).val() < 10) {
                            $(this).val(`0${ $(this).val()}`);
                        }
                        minutes = $(this).val();
                        hours = $(element)
                            .find('.hours')
                            .val();
                        newTime = parseFloat(hours * 60) + parseFloat(minutes);
                        ngModel.$setViewValue(newTime);
                    });
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('richTextEditor', () => {
        return {
            restrict: 'A',
            require: 'ngModel',
            replace : true,
            transclude: true,
            // template : '<div><textarea></textarea></div>',
            link: function(scope, element, attrs, ctrl) {
                let textarea = element.wysihtml5({
                    html: true,
                    image: false
                });
                let editor = textarea.data('wysihtml5').editor;
                var synchronize = function() {
                    if (editor.getValue()) {
                        scope.$apply(() => {
                            ctrl.$setViewValue(editor.getValue());
                        });
                    } else {
                        setTimeout(() => {
                            if ($(editor.textareaElement).hasClass('ng-dirty')) {
                                scope.$apply(() => {
                                    ctrl.$setViewValue(null);
                                });
                            }
                        });
                    }
                };
                var removeClientSideCodeInjection = function(comments) {
                    let value = comments, newValue, finalValue = '', removeValue, nr = 0;
                    let hasClientSideCodeInjection = true;
                    while(hasClientSideCodeInjection) {
                        removeValue = '';
                        if (value.split('<script>')) {
                            newValue = value.split('<script>');
                        }
                        if (newValue[1] && newValue[1].split('</script>')) {
                            removeValue = '<script>' + newValue[1].split('</script>')[0] + '</script>';
                        }
                        value = value.replace(removeValue, '');
                        if (value.split('<script>').length == 1) {
                            hasClientSideCodeInjection = false;
                        }
                    }
                    return value;
                };
                var removeClientSideCodeInjection1 = function(comments) {
                    let value = comments, newValue, finalValue = '', removeValue, nr = 0;
                    let hasClientSideCodeInjection = true;
                    while(hasClientSideCodeInjection) {
                        removeValue = '';
                        if (value.split('&lt;script&gt;')) {
                            newValue = value.split('&lt;script&gt;');
                        }
                        if (newValue[1] && newValue[1].split('&lt;/script&gt;')) {
                            removeValue = '&lt;script&gt;' + newValue[1].split('&lt;/script&gt;')[0] + '&lt;/script&gt;';
                        }
                        value = value.replace(removeValue, '');
                        if (value.split('&lt;script&gt;').length == 1) {
                            hasClientSideCodeInjection = false;
                        }
                    }
                    return value;
                };
                editor.on('redo:composer', synchronize);
                editor.on('undo:composer', synchronize);
                editor.on('paste', synchronize);
                editor.on('aftercommand:composer', synchronize);
                editor.on('change', synchronize);
                // the secret sauce to update every keystroke, may be cheating but it works
                // editor.on('load', function() {
                //     wysihtml5.dom.observe(editor.currentView.iframe.contentDocument.body, ['keyup'], synchronize);
                // });
                // handle changes to model from outside the editor
                scope.$watch(attrs.ngModel, (newValue) => {
                    if (newValue) {
                        newValue = removeClientSideCodeInjection(newValue);
                        newValue = removeClientSideCodeInjection1(newValue);
                    }
                    console.log(ctrl);
                    // necessary to prevent thrashing
                    if (newValue && newValue !== editor.getValue()) {
                        // element.html(newValue);
                        editor.setValue(newValue);
                        ctrl.$setViewValue(editor.getValue());
                    }
                });
                // editor.on('change', function() {
                //     if (editor.getValue()) scope.$apply(function() {
                //         ctrl.$setViewValue(editor.getValue());
                //     });
                // });
                // model -> view
                // ctrl.$render = function() {
                //     textarea.html(ctrl.$viewValue);
                //     editor.setValue(ctrl.$viewValue);
                // };
                // ctrl.$render();
            }
        };
    });
    APP_GENERAL_COMPONENTS.filter('duration', () => {
        return function(number, fraction) {
            // Ensure that the passed in data is a number
            if (isNaN(number) || number < 1) {
                // If the data is not a number or is less than one (thus not having a cardinal value) return it unmodified.
                return '';
            }
            // If the data we are applying the filter to is a number, perform the actions to check it's ordinal suffix and apply it.
            //
            var hrs = parseInt(number / 60);
            var mins = number - hrs * 60;
            if (mins < 10) {
                mins = `0${ mins}`;
            }
            if (hrs < 10) {
                hrs = `0${ hrs}`;
            }
            return `${hrs } : ${ mins}`;
        };
    });
    APP_GENERAL_COMPONENTS.directive('format', [
        '$filter',
        function($filter) {
            return {
                // restrict: 'A',
                // ret
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    if (!ctrl) {
                        return;
                    }
                    if (!attrs.format) {
                        return;
                    }                  
                    ctrl.$formatters.unshift((a) => {
                        var filter, fraction;
                        if (attrs.format.split(':')[1]) {
                            filter = attrs.format.split(':')[0];
                            fraction = attrs.format.split(':')[1];
                        } else {
                            filter = attrs.format;
                            fraction = 3;
                        }
                        if (filter.endsWith(':')) {
                            filter = attrs.format.split(':')[0];
                        }
                        if (filter == 'duration') {
                            elem.bind('focus', (e) => {
                                if (!elem.val()) {
                                    elem.val('');
                                }
                            });
                        }
                        elem.bind('keydown keypress', (e) => {
                        	// prevent "e" char
                            if (e.keyCode == 69) {
                                e.preventDefault();
                            }
                        });                        
                        if(fraction == 0) {
                            // if (parseInt(ctrl.$modelValue) == 0) {
                            //     return null;
                            // }
                            return parseInt(ctrl.$modelValue);
                        }
                        var returnData = null;
                        if (ctrl.$modelValue != null && ctrl.$modelValue !== '' && typeof ctrl.$modelValue != 'undefined') {
                            try {
                                returnData = $filter(filter)(ctrl.$modelValue, fraction);
                            } catch(error) {
                                console.error(error);
                                 
                            }
                        }
                        return returnData;
                        elem.unbind();
                    });
                    ctrl.$parsers.unshift((viewValue) => {
                        if (attrs.format.split(':')[1]) {
                            filter = attrs.format.split(':')[0];
                            fraction = attrs.format.split(':')[1];
                        } else {
                            filter = attrs.format;
                            fraction = 3;
                        }
                        if (filter == 'duration') {
                            elem.bind('focus', (e) => {
                                elem.val('');
                            });
                        }
                        elem.bind('blur', (e) => {
                            viewValue = `${angular.copy(ctrl.$viewValue) }`;
                            let plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');

                            if (plainNumber) {
                                if(fraction == 0) {
                                    elem.val(parseInt(plainNumber));
                                } else{
                                    newVal = $filter(filter)(plainNumber, fraction);
                                    elem.val(newVal);
                                }
                            } else {
                                elem.val(plainNumber);
                            }
                        });
                        return viewValue;
                        elem.unbind();
                    });
                }
            };
        }
    ]);
    APP_GENERAL_COMPONENTS.directive('tooltip', () => {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var container;
                if (!attrs.tooltip) {
                    container = 'body';
                } else {
                    container = false;
                }
                var triggerAction = 'hover';
                if (attrs.tooltiptrigger == 'click') {
                    triggerAction = 'click';
                }
                $(element).tooltip({
                    trigger: triggerAction,
                    container: container
                });
                $(element).hover(
                    () => {
                        // on mouseenter
                    },
                    () => {
                        // on mouseleave
                        // $(element).tooltip('hide');
                    }
                );
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('dropdownOrdering', () => {
        // var template = ''
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {},
            link: function(scope, element, attrs, ngModel) {
                let unregister = scope.$watch(() => {
                    return ngModel.$modelValue;
                }, initialize);

                function initialize(value) {
                    setTimeout(() => {
                        var currentOrder = [];
                        var objArray = $(element).find('.ordering-element');
                        $.each(objArray, function() {
                            currentOrder.push($(this).attr('unique-id'));
                        });
                        console.log(currentOrder);
                        $.each(currentOrder, (index, value) => {
                            $.each(ngModel.$modelValue, (idx, val) => {
                                if (value == val.precedenceRule.name) {
                                    val.ord = parseFloat(index) + 1;
                                }
                            });
                        });
                    });
                    // console.log(ngModel.$modelValue);
                    unregister();
                }
                scope.$watch(
                    () => {
                        return ngModel.$modelValue;
                    },
                    () => {
                        var fwdBtn = $(element).find('.moveFwd');
                        var backBtn = $(element).find('.moveBack');
                        fwdBtn.on('click', function() {
                            var activeElement = $(this)
                                .parents('.ordering-element')
                                .attr('unique-id');
                            $.each($(element).find('.ordering-element'), function(key, value) {
                                if ($(this).attr('unique-id') == activeElement) {
                                    var activeIndex = key;
                                }
                            });
                            objArray = $(element).find('.ordering-element');
                            var nextElemIdx = parseFloat(activeIndex) + 1;
                            var currentElement = $(objArray)[activeIndex];
                            var targetElement = $(objArray)[nextElemIdx];
                            $(currentElement).css({
                                transform: 'translateX(100%) scale(1.1)',
                                opacity: 0
                            });
                            $(targetElement).css({
                                transform: 'scale(0.1)',
                                opacity: 0
                            });
                            setTimeout(() => {
                                $(currentElement).css({
                                    transform: 'translateX(0%) scale(1)',
                                    opacity: 1
                                });
                                $(targetElement).css({
                                    transform: 'scale(1)',
                                    opacity: 1
                                });
                                $(currentElement).insertAfter($(targetElement));
                                updateModel();
                            }, 500);
                        });
                        backBtn.on('click', function() {
                            activeElement = $(this)
                                .parents('.ordering-element')
                                .attr('unique-id');
                            $.each($(element).find('.ordering-element'), function(key, value) {
                                if ($(this).attr('unique-id') == activeElement) {
                                    activeIndex = key;
                                }
                            });
                            objArray = $(element).find('.ordering-element');
                            nextElemIdx = parseFloat(activeIndex) - 1;
                            currentElement = $(objArray)[activeIndex];
                            targetElement = $(objArray)[nextElemIdx];
                            $(currentElement).css({
                                transform: 'translateX(-100%) scale(1.1)',
                                opacity: 0
                            });
                            $(targetElement).css({
                                transform: 'scale(0.1)',
                                opacity: 0
                            });
                            setTimeout(() => {
                                $(currentElement).css({
                                    transform: 'translateX(0%) scale(1)',
                                    opacity: 1
                                });
                                $(targetElement).css({
                                    transform: 'scale(1)',
                                    opacity: 1
                                });
                                $(currentElement).insertBefore($(targetElement));
                                updateModel();
                            }, 500);
                        });

                        function updateModel() {
                            currentOrder = [];
                            objArray = $(element).find('.ordering-element');
                            $.each(objArray, function() {
                                currentOrder.push($(this).attr('unique-id'));
                            });
                            $.each(currentOrder, (index, value) => {
                                $.each(ngModel.$modelValue, (idx, val) => {
                                    if (value == val.precedenceRule.name) {
                                        val.ord = parseFloat(index) + 1;
                                    }
                                });
                            });
                        }
                    }
                );
            }
        };
    });
    APP_GENERAL_COMPONENTS.filter('sumOfValueArray', () => {
        return function(data, key) {
            //  
            if (angular.isUndefined(data) || angular.isUndefined(key)) {
                return 0;
            }
            let sum = 0;
            angular.forEach(data, (v, k) => {
                if (v[key]) {
                    sum = sum + v[key];
                }
            });
            return sum;
        };
    });
    APP_GENERAL_COMPONENTS.filter('sumOfValueObject', () => {
        return function(data, key) {
            if (angular.isUndefined(data) || angular.isUndefined(key)) {
                return 0;
            }
            let sum = 0;
            angular.forEach(data, (v, k) => {
                if (k == key && v) {
                    sum = sum + v;
                }
            });
            return sum;
        };
    });
    APP_GENERAL_COMPONENTS.directive('bindOnce', () => {
        return {
            scope: true,
            link: function($scope, $element) {
                setTimeout(() => {
                    $scope.$destroy();
                    $element.removeClass('ng-binding ng-scope');
                }, 0);
            }
        };
    });
    APP_GENERAL_COMPONENTS.directive('ngRightClick', [
        '$parse',
        function($parse) {
            return function(scope, element, attrs) {
                let fn = $parse(attrs.ngRightClick);
                element.bind('contextmenu', (event) => {
                    scope.$apply(() => {
                        event.preventDefault();
                        fn(scope, {
                            $event: event
                        });
                    });
                });
                element.bind('contextmenu1', (event) => {
                    scope.$apply(() => {
                        event.preventDefault();
                        fn(scope, {
                            $event: event
                        });
                    });
                });

            };
        }
    ]);
    APP_GENERAL_COMPONENTS.directive('ejDateFormat', [
        '$window',
        '$injector',
        function($window, $injector) {
            return {
                require: '^ngModel',
                restrict: 'A',
                link: function(scope, elm, attrs, ctrl) {
                    let moment = $window.moment;
                    let tenantService, dateFormat;
                    if (attrs.stDateFormat === 'supplierPortal') {
                        tenantService = $injector.get('tenantSupplierPortalService');
                    } else {
                        tenantService = $injector.get('tenantService');
                    }
                    dateFormat = tenantService.getDateFormat();
                    console.log(elm['0'].attributes[10].nodeValue);
                    ctrl.$formatters.unshift((modelValue) => {
                        if (!dateFormat || !modelValue) {
                            return '';
                        }
                        let retVal;
                        // We're getting UTC dates from server.
                        // moment.js uses by default local timezone (http://momentjs.com/docs/#/parsing/utc/).
                        // We want to display server time (UTC), unless specifically
                        // required to display local time, via the st-date-to-local
                        // custom attribute.
                        if (!dateFormat) {
                            dateFormat = tenantService.getDateFormat();
                        }
                        if (attrs.stDateToLocal !== undefined) {
                            // moment.js default behavior: return date in LOCAL TIME.
                            retVal = moment
                                .utc(modelValue)
                                .local()
                                .format(dateFormat);
                        } else {
                            // Make moment.js use UTC (as the server date provided).
                            retVal = moment.utc(modelValue).format(dateFormat);
                        }
                        return retVal;
                    });
                    ctrl.$parsers.unshift((viewValue) => {
                        if (!dateFormat) {
                            dateFormat = tenantService.getDateFormat();
                        }
                        // When parsing the model value, always use UTC, since this goes to the server.
                        let date = moment.utc(viewValue, dateFormat);
                        return date.format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ');
                    });
                }
            };
        }
    ]);

    APP_GENERAL_COMPONENTS.directive('customPopover', () => {
        return {
            templateUrl: 'app-general-components/views/columnFiltersPopover.html',
            controller: 'FiltersController',
            scope: {
                column: '=',
                sortcol: '=',
                table: '=',
                globalFilters: '='
            },
            link: function(scope, element, attrs) {
                // console.log(scope);
                scope.pageFilters = scope.$parent.CLC.tableParams.unpackedFilters;
            }
        };
    });
    APP_GENERAL_COMPONENTS.filter('srcurl', [
        '$sce',
        function($sce) {
            return function(text) {
                // text = text.replace("watch?v=", "embed/");
                return $sce.trustAsResourceUrl(text);
            };
        }
    ]);

    APP_GENERAL_COMPONENTS.directive('ngDynamicController', [ '$compile', '$parse', function($compile, $parse) {
        return {
            scope: {
                name: '=ngDynamicController'
            },
            restrict: 'A',
            terminal: true,
            priority: 100000,
            link: function(scope, elem, attrs) {
                elem.attr('ng-controller', scope.name);
                elem.removeAttr('ng-dynamic-controller');

                $compile(elem)(scope);
            }
        };
    } ]);
}());
