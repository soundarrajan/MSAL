angular.module('shiptech')
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        '$qProvider',
        'STATE',
        'TIMESCALE',

        function($stateProvider, $urlRouterProvider, $locationProvider, $qProvider, STATE, TIMESCALE) {
            $urlRouterProvider.otherwise('/');
            $locationProvider.hashPrefix('');
            $qProvider.errorOnUnhandledRejections(false);
            $stateProvider

                .state(STATE.DEFAULT, {
                    abstract: true,
                    params: {
					    // path: [{
					    //             label: 'Procurement',
					    //             uisref: STATE.HOME
					    //         },
					    //         {
					    //             label: 'Schedule Dashboard',
					    //             uisref: STATE.DASHBOARD_CALENDAR
					    //         }],
					    title: 'Schedule Dashboard Timeline',
					    timescale: TIMESCALE.DEFAULT
                    },
                    // template: '<schedule-dashboard-calendar></schedule-dashboard-calendar>'
                    templateUrl: 'layouts/default.html'
                })

                // Home page
                .state(STATE.HOME, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Schedule Dashboard Timeline',
                            uisref: STATE.HOME
                        } ],
                        title: 'Schedule Dashboard Timeline',
                    },
                    url: '/',
                    template: '<schedule-dashboard-timeline></schedule-dashboard-timeline>',
                })
                .state('default.test', {
                    params: {

                        title: 'Test'
                    },
                    url: '/tests',
                    templateUrl: 'components/blade/templates/gor-energyContent-widget.html',
                })

                // Schedule Dashboard Timeline
                .state(STATE.DASHBOARD_TIMELINE, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Schedule Dashboard Timeline',
                            uisref: STATE.DASHBOARD_TIMELINE
                        } ],
                        title: 'Schedule Dashboard Timeline',
                    },
                    url: '/schedule-dashboard-timeline',
                    template: '<schedule-dashboard-timeline></schedule-dashboard-timeline>'
                })

                // Schedule Dashboard Table View
                .state(STATE.DASHBOARD_TABLE, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Schedule Dashboard',
                            uisref: STATE.DASHBOARD_TABLE
                        } ],
                        title: 'Schedule Dashboard'
                    },
                    url: '/schedule-dashboard-table',
                    template: '<schedule-dashboard-table></schedule-dashboard-table>'
                })

                // Schedule Dashboard Calendar View
                .state(STATE.DASHBOARD_CALENDAR, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Schedule Dashboard',
                            uisref: STATE.DASHBOARD_CALENDAR
                        } ],
                        title: 'Schedule Dashboard',
                        timescale: TIMESCALE.DEFAULT
                    },
                    url: '/schedule-dashboard-calendar',
                    template: '<schedule-dashboard-calendar></schedule-dashboard-calendar>'
                })

                .state(STATE.SAP_EXPORT, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'SAP Export',
                            uisref: STATE.SAP_EXPORT
                        } ],
                        title: 'SAP Export',

                    },
                    url: '/sap-export',
                    template: '<sap-export></sap-export>'
                })

                // New Request View
                .state(STATE.NEW_REQUEST, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'New Request',
                            uisref: STATE.NEW_REQUEST
                        } ],
                        title: 'New Request',
                        voyageId : null
                    },
                    url: '/new-request/:voyageId',
                    template: '<new-request></new-request>'
                })

                // New Request Copy View
                .state(STATE.COPY_REQUEST, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'New Request',
                            uisref: STATE.COPY_REQUEST
                        } ],
                        title: 'New Request',
                        copyFrom: null
                    },
                    url: '/new-request', // GOTCHA: To send copyFrom as an object, DO NOT add it to the URL!
                    template: '<new-request></new-request>'
                })

                // Edit Request View
                .state(STATE.EDIT_REQUEST, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Edit Request',
                            uisref: STATE.EDIT_REQUEST
                        } ],
                        title: 'Edit Request',
                        requestId : null
                    },
                    url: '/edit-request/:requestId',
                    template: '<new-request></new-request>'
                })

                // View Request Documents
                .state(STATE.VIEW_GROUP_OF_REQUESTS_DOCUMENTS, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Negotiation Documents', uisref: STATE.VIEW_GROUP_OF_REQUESTS_DOCUMENTS },
                        ],
                        title: 'View Requests Documents',
                        requestId: null
                    },
                    url: '/view-group-of-requests-documents/:requestId',
                    template: '<view-group-of-requests-documents></view-group-of-requests-documents>'
                })

                  // View Request Documents
                .state(STATE.VIEW_GROUP_OF_REQUESTS_REPORT, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Negotiation Report', uisref: STATE.VIEW_GROUP_OF_REQUESTS_REPORT },
                        ],
                        title: 'View Requests Report',
                        requestId: null
                    },
                    url: '/view-group-of-requests-report/:requestId',
                    template: '<view-group-of-requests-report></view-group-of-requests-report>'
                })

                // View Group of Request Documents
                .state(STATE.VIEW_REQUEST_DOCUMENTS, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Request Documents', uisref: STATE.VIEW_REQUEST_DOCUMENTS },
                        ],
                        title: 'View Request Documents',
                        requestId: null
                    },
                    url: '/view-request-documents/:requestId',
                    template: '<view-request-documents></view-request-documents>'
                })

                  // View Group of Request Documents
                .state(STATE.VIEW_REQUEST_REPORT, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Request Report', uisref: STATE.VIEW_REQUEST_REPORT },
                        ],
                        title: 'View Request Report',
                        requestId: null
                    },
                    url: '/view-request-report/:requestId',
                    template: '<view-request-report></view-request-report>'
                })

                // View Request Audit Log
                .state(STATE.VIEW_REQUEST_AUDITLOG, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Request Audit Log', uisref: STATE.VIEW_REQUEST_AUDITLOG },
                        ],
                        title: 'View Request Audit Log',
                        requestId: null
                    },
                    url: '/view-request-auditlog/:requestId',
                    template: '<view-request-auditlog></view-request-auditlog>'
                })

                .state(STATE.VIEW_REQUEST_EMAILLOG, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Request Email Log', uisref: STATE.VIEW_REQUEST_EMAILLOG },
                        ],
                        title: 'View Request Email Log',
                        requestId: null
                    },
                    url: '/view-request-emaillog/:requestId',
                    template: '<view-request-emaillog></view-request-emaillog>'
                })

                // All Requests Table View
                .state(STATE.ALL_REQUESTS_TABLE, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'All Requests',
                            uisref: STATE.ALL_REQUESTS_TABLE
                        } ],
                        title: 'All Requests'
                    },
                    url: '/all-requests-table',
                    template: '<all-requests-table></all-requests-table>'
                })

                // Group of Requests View
                .state(STATE.GROUP_OF_REQUESTS, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Negotiation',
                            uisref: STATE.GROUP_OF_REQUESTS
                        } ],
                        title: 'Negotiation',
                        groupId : null,
                        group: null
                    },
                    url: '/group-of-requests/:groupId',
                    template: '<group-of-requests></group-of-requests>'
                })
                .state(STATE.VIEW_GROUP_OF_REQUESTS_EMAILLOG, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        }, {
                            label: 'View Negotiation Email Log',
                            uisref: STATE.VIEW_GROUP_OF_REQUESTS_EMAILLOG
                        }, ],
                        title: 'View Negotiation Email Log',
                        requestId: null
                    },
                    url: '/group-of-requests-emaillog/:groupId',
                    template: '<group-of-requests-emaillog></group-of-requests-emaillog>'
                })

                // New Order View
                .state(STATE.NEW_ORDER, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'New Order',
                            uisref: STATE.NEW_ORDER
                        } ],
                        title: 'New Order'
                    },
                    url: '/new-order',

                    template: '<new-order></new-order>'
                })

                // Edit Order View
                .state(STATE.EDIT_ORDER, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Edit Order',
                            uisref: STATE.EDIT_ORDER
                        } ],
                        title: 'Edit Order'
                    },
                    url: '/edit-order/:orderId',
                    template: '<new-order></new-order>'
                })

                // View Order Documents
                .state(STATE.VIEW_ORDER_DOCUMENTS, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Order Documents', uisref: STATE.VIEW_ORDER_DOCUMENTS },
                        ],
                        title: 'View Order Documents',
                        orderId: null
                    },
                    url: '/view-order-documents/:orderId',
                    template: '<view-order-documents></view-order-documents>'
                })

                // View Order Audit Log
                .state(STATE.VIEW_ORDER_AUDITLOG, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Order Audit Log', uisref: STATE.VIEW_ORDER_AUDITLOG },
                        ],
                        title: 'View Order Audit Log',
                        orderId: null
                    },
                    url: '/view-order-auditlog/:orderId',
                    template: '<view-order-auditlog></view-order-auditlog>'
                })

                .state(STATE.VIEW_ORDER_EMAILLOG, {
                    params: {
                        path: [
                            { label: 'Procurement', uisref: STATE.HOME },
                            { label: 'View Order Email Log', uisref: STATE.VIEW_ORDER_EMAILLOG },
                        ],
                        title: 'View Order Email Log',
                        orderId: null
                    },
                    url: '/view-order-emaillog/:orderId',
                    template: '<view-order-emaillog></view-order-emaillog>'
                })

                // Order List
                .state(STATE.ORDER_LIST, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Order List',
                            uisref: STATE.ORDER_LIST
                        } ],
                        title: 'Order List'
                    },
                    url: '/order-list',
                    template: '<order-list></order-list>'
                })

                // Order Transaction KPI
                .state(STATE.ORDER_TRANSACTION_KPI, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Order',
                            uisref: STATE.ORDER_TRANSACTION_KPI
                        } ],
                        title: 'Order - Vessel <NAME> - REQ 00045522'
                    },
                    url: '/order-transaction-kpi',
                    template: '<order-transaction-kpi></order-transaction-kpi>'
                })

                // Select Contract
                .state(STATE.SELECT_CONTRACT, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Select Contract',
                            uisref: STATE.SELECT_CONTRACT
                        } ],
                        title: 'Select Contract - Req',
                        requestId: null,
                        contractId: null
                    },
                    url: '/select-contract/:requestId',
                    template: '<select-contract></select-contract>'
                })

                // Supplier Portal
                .state(STATE.SUPPLIER_PORTAL, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Shiptech Supplier Portal',
                            uisref: STATE.SUPPLIER_PORTAL
                        } ],
                        title: 'Shiptech Supplier Portal',
                    },
                    url: '/supplier-portal/{token:any}',
                    template: '<supplier-portal placement="supplierPortal"></supplier-portal>'
                })

                // Preview Email
                .state(STATE.PREVIEW_EMAIL, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Order',
                            uisref: STATE.PREVIEW_EMAIL
                        } ],
                        title: 'Preview Email',
                        data: null,
                        transaction: null,
                        multipleRequests: null
                    },
                    url: '/preview-email',
                    template: '<preview-email></preview-email>'
                })

                // View RFQ
                .state(STATE.VIEW_RFQ, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Group of Requests',
                            uisref: STATE.VIEW_RFQ
                        } ],
                        title: 'Group of Requests',
                        requestGroupId: null
                    },
                    url: '/view-rfq/:groupId',
                    template: '<view-rfq></view-rfq>'
                })

                // Contract Planning
                .state(STATE.CONTRACT_PLANNING, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Contract Planning',
                            uisref: STATE.CONTRACT_PLANNING
                        } ],
                        title: 'Contract Planning'
                    },
                    url: '/contract-planning/:groupId?',
                    template: '<contract-planning></contract-planning>'
                })

                // Contract Evaluation
                .state(STATE.CONTRACT_EVALUATION, {
                    params: {
                        path: [ {
                            label: 'Procurement',
                            uisref: STATE.HOME
                        },
                        {
                            label: 'Contract Evaluation',
                            uisref: STATE.CONTRACT_EVALUATION
                        } ],
                        title: 'Contract Evaluation',
                        requestId: null,
                        contractId: null
                    },
                    url: '/contract-evaluation',
                    template: '<contract-evaluation></contract-evaluation>'
                })

                .state(STATE.REPORTS, {
                    params: {
                        path: [ {
                            label: 'Reports',
                            uisref: STATE.REPORTS
                        } ],
                        title: 'Reports',
                        entity_id: { value: null, squash: true },
                        serlocid1: { value: null, squash: true },
                        serlocid2: { value: null, squash: true },
                        serlocid3: { value: null, squash: true },
                        serlocid4: { value: null, squash: true },
                        serlocid5: { value: null, squash: true },
                        serlocid6: { value: null, squash: true },
                        type: { value: null, squash: true }
                    },
                    url: '/reports/{type}/{entity_id}/{serlocid1}/{serlocid2}/{serlocid3}/{serlocid4}/{serlocid5}/{serlocid6}',	
                    template: '<reports></reports>'
                })

            ;
        }
    ])

    .config([ '$translateProvider', 'API', 'tenantConfigs', function($translateProvider, API, tenantConfigs) {
        // use   http://localhost:9006/ + '/translations/' for local translations testing
        // def   prefix: API.BASE_URL_OPEN_SERVER + '/translations/',

        $translateProvider.useStaticFilesLoader({
            prefix: `${API.BASE_URL_OPEN_SERVER }/translations/`,
            // prefix: `http://localhost:9015/translations/`,
            suffix: '.json'
        });
        window.notActiveLabel = (tenantConfigs.translations == 'CMA' || tenantConfigs.translations == 'en') ? true : false;
        // translations are based tenant, use tenantConfigs.translations (file name)
        $translateProvider.preferredLanguage(tenantConfigs.translations);
        $translateProvider.useSanitizeValueStrategy('sanitize');
    } ])

    .run([ '$rootScope', function($rootScope) {
        $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
            // Implement changes here.
        });
    }
    ]);


