// Load MASTERS APP (module)
var APP_MASTERS = angular.module('shiptech.app.masters', [
    // 3rd party
    'ui.router',
    // 'ngCookies',
    'ui.tree', 'ui.sortable',
    // Specific modules
    'shiptech.app.api', 'shiptech.app.general.components'
]);
// Constants
APP_MASTERS.constant('MASTER_STATE', {
    DEFAULT: 'masters',
    HOME: 'masters.home',
    SINGLE: 'masters.single',
    AUDIT: 'masters.audit',
    DOCUMENTS: 'masters.documents',
    EMAIL: 'masters.email',
    STRUCTURE: 'masters.structure',
    HIERARCHY: 'masters.hierarchy',
    EDIT: 'masters.edit',
});
// Config
APP_MASTERS.config([ '$stateProvider', '$urlRouterProvider', 'MASTER_STATE', function($stateProvider, $urlRouterProvider, MASTER_STATE) {
    $stateProvider.state(MASTER_STATE.DEFAULT, {
        abstract: true,
        templateUrl: 'layouts/default.html'
    })
        // CATALOG view (list all masters)
        .state(MASTER_STATE.HOME, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: MASTER_STATE.HOME
                } ],
                title: 'Masters List'
            },
            url: '/masters',
            requireADLogin: true,
            templateUrl: 'app-masters/views/catalog.html'
        })
        // MASTER view (single master list)
        .state(MASTER_STATE.SINGLE, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: MASTER_STATE.HOME
                }, {
                    label: 'Master List',
                    uisref: MASTER_STATE.SINGLE
                } ],
                title: 'Master View'
            },
            requireADLogin: true,
            url: '/masters/:screen_id',
            templateUrl: function($stateParams) {
                if ($stateParams.screen_id == 'templateProperties') {
                    return 'app-masters/views/template_properties.html';
                }
                if ($stateParams.screen_id == 'operator') {
                    $stateParams.screen_id = 'service';
                }
                if ($stateParams.screen_id == 'pool') {
                    $stateParams.screen_id = 'company';
                }
                return `app-masters/views/list/${ $stateParams.screen_id }.html`;
            }
        })
        // MASTER structure view (single master structure list)
        .state(MASTER_STATE.STRUCTURE, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: MASTER_STATE.HOME
                }, {
                    label: 'Master List',
                    uisref: MASTER_STATE.SINGLE
                }, {
                    label: 'Master Structure',
                    uisref: MASTER_STATE.STRUCTURE
                } ],
                title: 'Master Structure'
            },
            url: '/masters/:screen_id/structure',
            requireADLogin: true,
            templateUrl: function($stateParams) {
                if ($stateParams.screen_id == 'templateProperties') {
                    return 'app-masters/views/structure_template_properties.html';
                }
                if ($stateParams.screen_id == 'operator') {
                    $stateParams.screen_id = 'service';
                }
                if ($stateParams.screen_id == 'pool') {
                    $stateParams.screen_id = 'company';
                }
                return 'app-masters/views/structure.html';
            }
        })
        // MASTER entity edit view (single master entity -- edit screen)
        .state(MASTER_STATE.EDIT, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: MASTER_STATE.HOME
                }, {
                    label: 'Master List',
                    uisref: MASTER_STATE.SINGLE
                }, {
                    label: 'Master Edit',
                    uisref: MASTER_STATE.EDIT
                } ],
                title: 'Master Entity Edit'
            },
            requireADLogin: true,
            url: '/masters/:screen_id/edit/:entity_id',
            templateUrl: function($stateParams) {
                if ($stateParams.screen_id == 'templateProperties') {
                    return 'app-masters/views/template_properties.html';
                }
                if ($stateParams.screen_id == 'operator') {
                    $stateParams.screen_id = 'service';
                }
                if ($stateParams.screen_id == 'pool') {
                    $stateParams.screen_id = 'company';
                }
                return `app-masters/views/edit/${ $stateParams.screen_id }.html`;
            }
        }).state(MASTER_STATE.DOCUMENTS, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: MASTER_STATE.HOME
                }, {
                    label: 'Master List',
                    uisref: MASTER_STATE.SINGLE
                }, {
                    label: 'Master Documents',
                    uisref: MASTER_STATE.DOCUMENTS
                } ],
                title: 'Master Entity Documents'
            },
            requireADLogin: true,
            url: '/masters/:screen_id/documents/:entity_id',
            templateUrl: 'app-masters/views/list_documents.html'
        }).state(MASTER_STATE.AUDIT, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: MASTER_STATE.HOME
                }, {
                    label: 'Master List',
                    uisref: MASTER_STATE.SINGLE
                }, {
                    label: 'Master Audit Log',
                    uisref: MASTER_STATE.AUDIT
                } ],
                title: 'Master Entity Audit Log'
            },
            requireADLogin: true,
            url: '/masters/:screen_id/audit-log/:entity_id',
            templateUrl: 'app-masters/views/list_audit.html'
        }).state(MASTER_STATE.HIERARCHY, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: MASTER_STATE.HOME
                }, {
                    label: 'Master List',
                    uisref: MASTER_STATE.SINGLE
                }, {
                    label: 'Hierarchy',
                    uisref: MASTER_STATE.HIERARCHY
                } ],
                title: 'Master Hierarchy'
            },
            requireADLogin: true,
            url: '/masters/:screen_id/hierarchy',
            templateUrl: 'app-masters/views/hierarchy.html'
        })
        // Email Log
        .state(MASTER_STATE.EMAIL, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: MASTER_STATE.HOME
                }, {
                    label: 'Master List',
                    uisref: MASTER_STATE.SINGLE
                }, {
                    label: 'Master Email Log',
                    uisref: MASTER_STATE.EMAIL
                } ],
                title: 'Master Entity Email Log'
            },
            requireADLogin: true,
            url: '/masters/:screen_id/email-log/:entity_id',
            templateUrl: 'app-masters/views/list_email.html'
        });
} ]);
// ON RUN
APP_MASTERS.run([ '$state', '$rootScope', 'MASTER_STATE', '$tenantSettings', function($state, $rootScope, MASTER_STATE, $tenantSettings) {
    $rootScope.tenantSettings = $tenantSettings;
    let titleMap = {};
    titleMap[MASTER_STATE.HOME] = 'Master Screens';
    titleMap[MASTER_STATE.SINGLE] = ':screen_id List';
    titleMap[MASTER_STATE.AUDIT] = ':screen_id :: Audit :entity_id';
    titleMap[MASTER_STATE.DOCUMENTS] = ':screen_id :: Documents :entity_id';
    titleMap[MASTER_STATE.STRUCTURE] = ':screen_id :: Structure';
    titleMap[MASTER_STATE.HIERARCHY] = ':screen_id :: Hierarchy';
    titleMap[MASTER_STATE.EDIT] = ':screen_id :: Edit :entity_id';
    let screenMap = {
        counterparty: 'Counterparty',
        location: 'Location',
        product: 'Product',
        company: 'Company',
        buyer: 'Buyer',
        service: 'Service',
        strategy: 'Strategy',
        vessel: 'Vessel',
        vesseltype: 'Vessel Type',
        marketinstrument: 'Market Instrument',
        systeminstrument: 'System Instrument',
        price: 'Price',
        pricetype: 'Market Price Type',
        specgroup: 'Spec Group',
        specparameter: 'Spec Parameter',
        paymentterm: 'Payment Term',
        deliveryoption: 'Delivery Option',
        incoterms: 'Incoterms',
        uom: 'Uom',
        period: 'Period',
        event: 'Event',
        calendar: 'Calendar',
        documenttype: 'Document Type',
        contacttype: 'Contact Type',
        agreementtype: 'Agreement Type',
        additionalcost: 'Additional Cost',
        barge: 'Barge',
        status: 'Status',
        country: 'Country',
        currency: 'Currency',
        exchangerate: 'Exchange Rate',
        formula: 'Formula',
        claimtype: 'Claim Type',
        emaillogs: 'Email Log',
    };
    let entityMap = {}; // if needed :)
    // do not edit below
    $rootScope.$on('$includeContentLoaded', () => {
        changeTitle();
    });

    $rootScope.$on('$stateChangeSuccess', () => {
        changeTitle();
        // alert('yolo');
        window.Elements = {
            	style: [],
	            container: [],
	            header: [],
	            table: [],
	            pager: [],
	            settings: [],
	            actions: [],
	            scope: {},
        };
    });
    var changeTitle = function() {
        if (titleMap[$state.current.name]) {
            var screenTitle = screenMap[$state.params.screen_id];
            if (screenTitle == 'Company' && $rootScope.tenantSettings.companyDisplayName.name == 'Pool') {
                screenTitle = 'Pool';
            }
            if (screenTitle == 'Service' && $rootScope.tenantSettings.serviceDisplayName.name == 'Operator') {
                screenTitle = 'Operator';
            }
            let newTitle = titleMap[$state.current.name];
            newTitle = newTitle.replace(/:screen_id/i, screenTitle).replace(/:entity_id/i, $state.params.entity_id);
            $state.params.title = newTitle;

            if ($state.params.path[1]) {
                $state.params.path[1].label = titleMap[MASTER_STATE.SINGLE].replace(/:screen_id/i, screenTitle).replace(/:entity_id/i, $state.params.entity_id);
            }
            if ($state.params.path[2]) {
                $state.params.path[2].label = titleMap[$state.current.name].replace(/:screen_id/i, screenTitle).replace(/:entity_id/i, $state.params.entity_id);
            }
        }
    };
} ]);
