// Load MASTERS APP (module)
var APP_CONTRACT = angular.module('shiptech.app.contract', [
    // 3rd party
    'ui.router',
    // 'ngCookies',
    'ui.tree', 'ui.sortable',
    // Specific modules
    'shiptech.app.api', 'shiptech.app.general.components'
]);
// Constants
APP_CONTRACT.constant('CONTRACT_STATE', {
    DEFAULT: 'contracts',
    HOME: 'contracts.home',
    SINGLE: 'contracts.single',
    PRODUCTDELIVERY: 'contracts.productdelivery',
    AUDIT: 'contracts.audit',
    DOCUMENTS: 'contracts.documents',
    STRUCTURE: 'contracts.structure',
    PREVIEW: 'contracts.preview',
    EMAIL: 'contracts.email',
    EMAILPREVIEW: 'contracts.emailpreview',
    DELIVERIES: 'contracts.deliveries',
    EDIT: 'contracts.edit',
    TERMS_CONDITIONS: 'contracts.terms-conditions'
});
// Config
APP_CONTRACT.config([ '$stateProvider', '$urlRouterProvider', 'CONTRACT_STATE', function($stateProvider, $urlRouterProvider, CONTRACT_STATE) {
    $stateProvider.state(CONTRACT_STATE.DEFAULT, {
        abstract: true,
        templateUrl: 'layouts/default.html'
    })
        // CONTRACT view (single master list)
        .state(CONTRACT_STATE.HOME, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                } ],
                title: 'Contract Home'
            },
            url: '/contracts',
            requireADLogin: true,
            templateUrl: function($stateParams) {
                return 'app-contract/views/catalog.html';
            }
        })
        // CONTRACT view (single master list)
        .state(CONTRACT_STATE.SINGLE, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract List',
                    uisref: CONTRACT_STATE.SINGLE
                } ],
                title: 'Contract List'
            },
            url: '/contracts/:screen_id',
            requireADLogin: true,
            templateUrl: function($stateParams) {
                return `app-contract/views/list/${ $stateParams.screen_id }.html`;
            }
        })
        .state(CONTRACT_STATE.PRODUCTDELIVERY, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Deliveries View',
                    uisref: CONTRACT_STATE.PRODUCTDELIVERY
                } ],
                title: 'Deliveries View'
            },
            url: '/contracts/:screen_id/productdelivery/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-contract/views/list/productdelivery.html'
        })
        // CONTRACT - AUDIT view (single master-audit list)
        .state(CONTRACT_STATE.AUDIT, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Audit View',
                    uisref: CONTRACT_STATE.AUDIT
                } ],
                title: 'Audit View'
            },
            url: '/contracts/:screen_id/audit-log/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-contract/views/list_audit.html'
        })
        // CONTRACT - DOCUMENTS view (single master-documents list)
        .state(CONTRACT_STATE.DOCUMENTS, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Documents View',
                    uisref: CONTRACT_STATE.DOCUMENTS
                } ],
                title: 'Documents View'
            },
            url: '/contracts/:screen_id/documents/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-contract/views/list_documents.html'
        })
        // CONTRACT structure view (single master structure list)
        .state(CONTRACT_STATE.STRUCTURE, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Contract Structure',
                    uisref: CONTRACT_STATE.STRUCTURE
                } ],
                title: 'Contract Structure'
            },
            url: '/contracts/:screen_id/structure',
            requireADLogin: true,
            templateUrl: 'app-contract/views/structure.html'
        })
        // CONTRACT entity edit view (single master entity -- edit screen)
        .state(CONTRACT_STATE.EDIT, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Contract Entity Edit',
                    uisref: CONTRACT_STATE.EDIT
                } ],
                title: 'Contract Entity Edit'
            },
            url: '/contracts/:screen_id/edit/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-contract/views/edit.html'
        }).state(CONTRACT_STATE.PREVIEW, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Contract Entity Edit',
                    uisref: CONTRACT_STATE.EDIT
                } ],
                title: 'Contract Preview'
            },
            url: '/contracts/:screen_id/preview/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-contract/views/preview.html'
        }).state(CONTRACT_STATE.EMAILPREVIEW, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Contract Email Preview',
                    uisref: CONTRACT_STATE.EMAILPREVIEW
                } ],
                title: 'Contract Email Preview'
            },
            url: '/contracts/:screen_id/email-preview/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-contract/views/email.html'
        }).state(CONTRACT_STATE.EMAIL, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Contract Email Log',
                    uisref: CONTRACT_STATE.EMAIL
                } ],
                title: 'Contract Email Log'
            },
            url: '/contracts/:screen_id/email-log/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-contract/views/list_email.html'
        }).state(CONTRACT_STATE.TERMS_CONDITIONS, {
            params: {
                path: [ {
                    label: 'Contract Home',
                    uisref: CONTRACT_STATE.HOME
                }, {
                    label: 'Contract Management View',
                    uisref: CONTRACT_STATE.SINGLE
                }, {
                    label: 'Contract Terms & Conditions',
                    uisref: CONTRACT_STATE.TERMS_CONDITIONS
                } ],
                title: 'Terms & Conditions'
            },
            url: '/contracts/:screen_id/terms-conditions/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-contract/views/terms_conditions.html'
        });
} ]);
// ON RUN
APP_CONTRACT.run([ '$state', '$rootScope','$window', '$location', 'CONTRACT_STATE', function($state, $rootScope, $window, $location, CONTRACT_STATE) {
    let titleMap = {};
    titleMap[CONTRACT_STATE.SINGLE] = ':screen_id';
    titleMap[CONTRACT_STATE.EDIT] = 'Contracts :: Edit :entity_id';
    titleMap[CONTRACT_STATE.STRUCTURE] = 'Contracts :: Structure';

    let screenMap = {
        contract: 'Contract List',
        planning: 'Contract Planning',
        productdelivery: 'Contract :contract_id Product Deliveries',
    };
    let entityMap = {}; // if needed :)
    // do not edit below
    $rootScope.$on('$includeContentLoaded', () => {
        changeTitle();
    });
    $rootScope.$on('$stateChangeStart', (event, fromState, stateParams) => {
        if(fromState.name === CONTRACT_STATE.EDIT){
            event.preventDefault();
            $window.open($location.$$absUrl.replace('#'+$location.$$path, 'v2/contracts/contract/'+stateParams.entity_id+'/details'), '_self');
            // $window.open('http://localhost:9016/v2/contracts/contract/'+stateParams.entity_id+'/details', '_self');
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
    };
} ]);
