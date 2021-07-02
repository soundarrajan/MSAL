// Load MASTERS APP (module)
var APP_INVOICE = angular.module('shiptech.app.invoice', [
    // 3rd party
    'ui.router',
    // 'ngCookies',
    'ui.tree',
    'ui.sortable',
    // Specific modules
    'shiptech.app.api',
    'shiptech.app.general.components'
]);

// Constants
APP_INVOICE.constant('INVOICE_STATE', {
    DEFAULT: 'invoices',
    HOME: 'invoices.home',
    SINGLE: 'invoices.single',
    AUDIT: 'invoices.audit',
    DOCUMENTS: 'invoices.documents',
    EMAIL: 'invoices.email',
    STRUCTURE: 'invoices.structure',
    EDIT: 'invoices.edit'
});
// 'TREASURY_REPORT': 'invoices.treasury_report'

// Config
APP_INVOICE.config([ '$stateProvider', '$urlRouterProvider', 'INVOICE_STATE', function($stateProvider, $urlRouterProvider, INVOICE_STATE) {
    $stateProvider

        .state(INVOICE_STATE.DEFAULT, {
            abstract: true,
            templateUrl: 'layouts/default.html'
        })

        .state(INVOICE_STATE.HOME, {
            params: {
                path: [
                    {
                        label: 'Invoice List',
                        uisref: INVOICE_STATE.HOME
                    }
                ],
                title: 'Invoice List'
            },
            url: '/invoices',
            templateUrl: 'app-invoice/views/catalog.html'
        })

    // .state(INVOICE_STATE.TREASURY_REPORT, {
    //     params: {
    //         path: [
    //             {
    //                 label: 'Invoice List',
    //                 uisref: INVOICE_STATE.HOME
    //             }
    //         ],
    //         title: 'Treasury Report'
    //     },
    //     url: '/invoices/treasuryreport',
    //     templateUrl: 'app-invoice/views/list/treasuryreport.html'
    // })

    // INVOICE view (single master list)
        .state(INVOICE_STATE.SINGLE, {
            params: {
                path: [
                    {
                        label: 'Invoice List',
                        uisref: INVOICE_STATE.HOME
                    },
                    {
                        label: 'Invoice View',
                        uisref: INVOICE_STATE.SINGLE
                    }
                ],
                title: 'Invoice View'
            },
            url: '/invoices/:screen_id',
            requireADLogin: true,
            templateUrl: function($stateParams) {
                return `app-invoice/views/list/${ $stateParams.screen_id }.html`;
            }
        })

    // INVOICE structure view (single master structure list)
        .state(INVOICE_STATE.STRUCTURE, {
            params: {
                path: [
                    {
                        label: 'Invoice List',
                        uisref: INVOICE_STATE.HOME
                    },
                    {
                        label: 'Invoice View',
                        uisref: INVOICE_STATE.SINGLE
                    },
                    {
                        label: 'Invoice Structure',
                        uisref: INVOICE_STATE.STRUCTURE
                    }
                ],
                title: 'Invoice Structure'
            },
            url: '/invoices/:screen_id/structure',
            requireADLogin: true,
            templateUrl: 'app-invoice/views/structure.html'
        })

    // INVOICE entity edit view (single master entity -- edit screen)
        .state(INVOICE_STATE.EDIT, {
            params: {
                path: [
                    {
                        label: 'Invoice List',
                        uisref: INVOICE_STATE.HOME
                    },
                    {
                        label: 'Invoice View',
                        uisref: INVOICE_STATE.SINGLE
                    },
                    {
                        label: 'Invoice Entity Edit',
                        uisref: INVOICE_STATE.EDIT
                    }
                ],
                title: 'Invoice Entity Edit'
            },
            url: '/invoices/:screen_id/edit/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-invoice/views/edit.html'
        })

        .state(INVOICE_STATE.AUDIT, {
            params: {
                path: [
                    {
                        label: 'Delivery List',
                        uisref: INVOICE_STATE.HOME
                    },
                    {
                        label: 'Invoice View',
                        uisref: INVOICE_STATE.SINGLE
                    },
                    {
                        label: 'Delivery Audit View',
                        uisref: INVOICE_STATE.AUDIT
                    }
                ],
                title: 'Delivery Audit View'
            },
            url: '/invoices/:screen_id/audit-log/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-invoice/views/list_audit.html'
        })

        .state(INVOICE_STATE.DOCUMENTS, {
            params: {
                path: [
                    {
                        label: 'Delivery List',
                        uisref: INVOICE_STATE.HOME
                    },
                    {
                        label: 'Invoice View',
                        uisref: INVOICE_STATE.SINGLE
                    },
                    {
                        label: 'Delivery Documents View',
                        uisref: INVOICE_STATE.DOCUMENTS
                    }
                ],
                title: 'Delivery Documents View'
            },
            url: '/invoices/:screen_id/documents/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-invoice/views/list_documents.html'
        })

        .state(INVOICE_STATE.EMAIL, {
            params: {
                path: [
                    {
                        label: 'Delivery List',
                        uisref: INVOICE_STATE.HOME
                    },
                    {
                        label: 'Invoice View',
                        uisref: INVOICE_STATE.SINGLE
                    },
                    {
                        label: 'Email Log',
                        uisref: INVOICE_STATE.EMAIL
                    }
                ],
                title: 'Email Log'
            },
            url: '/invoices/:screen_id/email-log/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-invoice/views/list_email.html'
        });
} ]);

// ON RUN
APP_INVOICE.run([ '$state', '$rootScope','$window','$location', 'INVOICE_STATE', function($state, $rootScope, $window, $location, INVOICE_STATE) {
    let titleMap = {};
    titleMap[INVOICE_STATE.HOME] = 'Invoice Screens';
    titleMap[INVOICE_STATE.SINGLE] = ':screen_id List';
    titleMap[INVOICE_STATE.STRUCTURE] = ':screen_id :: Structure';
    titleMap[INVOICE_STATE.EDIT] = ':screen_id :: Edit :entity_id';

    let screenMap = {
        deliveries: 'Transactions to be invoiced',
        claims: 'Invoices',
        invoices: 'Invoices',
        invoice: 'Invoices',
        complete_view: 'Complete View',
        filters: 'Filters',
        treasury_report: 'Treasury Report Details',
    };

    let entityMap = {}; // if needed :)

    // do not edit below
    $rootScope.$on('$includeContentLoaded', () => {
        changeTitle();
    });

    $rootScope.$on('$stateChangeStart', (event, fromState, stateParams) => {
        if(fromState.name === INVOICE_STATE.EDIT){
            event.preventDefault();
            $window.open($location.$$absUrl.replace('#'+$location.$$path, 'v2/invoices/edit/'+stateParams.entity_id), '_self');
            //$window.open('http://localhost:9016/v2/invoices/edit/'+stateParams.entity_id, '_self');
        }
    });

    $rootScope.$on('$stateChangeSuccess', () => {
        changeTitle();
    });

    var changeTitle = function() {
        if (titleMap[$state.current.name]) {
            let newTitle = titleMap[$state.current.name];
            newTitle = newTitle.replace(/:screen_id/i, screenMap[$state.params.screen_id]).replace(/:entity_id/i, $state.params.entity_id);
            $state.params.title = newTitle;
        }
	        if($state.params.screen_id == 'treasuryreport') {
	            $state.params.title = 'Treasury Report';
	        }
    };
} ]);
