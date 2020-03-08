// Load MASTERS APP (module)
var APP_LABS = angular.module('shiptech.app.labs', [
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
APP_LABS.constant('LABS_STATE', {
    DEFAULT: 'labs',
    SINGLE: 'labs.single',
    AUDIT: 'labs.audit',
    DOCUMENTS: 'labs.documents',
    EMAIL: 'labs.email',
    STRUCTURE: 'labs.structure',
    EDIT: 'labs.edit',
    EMAILPREVIEW: 'labs.emailpreview',
});

// Config
APP_LABS.config([ '$stateProvider', '$urlRouterProvider', 'LABS_STATE', function($stateProvider, $urlRouterProvider, LABS_STATE) {
    $stateProvider

        .state(LABS_STATE.DEFAULT, {
            abstract: true,
            templateUrl: 'layouts/default.html'
        })

    // LABS view (single master list)
        .state(LABS_STATE.SINGLE, {
            params: {
                path: [
                    {
                        label: 'Labs',
                        uisref: LABS_STATE.SINGLE
                    }, {
                        label: 'Labs Results List',
                        uisref: LABS_STATE.SINGLE
                    }
                ],
                title: 'Labs Results List'
            },
            url: '/labs/:screen_id',
            requireADLogin: true,
            templateUrl: 'app-labs/views/list.html'
        })

    // LABS - AUDIT view (single master-audit list)
        .state(LABS_STATE.AUDIT, {
            params: {
                path: [
                    {
                        label: 'Labs View',
                        uisref: LABS_STATE.SINGLE
                    },
                    {
                        label: 'Audit View',
                        uisref: LABS_STATE.AUDIT
                    }
                ],
                title: 'Audit View'
            },
            url: '/labs/:screen_id/audit/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-labs/views/list_audit.html'
        })

    // LABS - DOCUMENTS view (single master-documents list)
        .state(LABS_STATE.DOCUMENTS, {
            params: {
                path: [
                    {
                        label: 'Labs View',
                        uisref: LABS_STATE.SINGLE
                    },
                    {
                        label: 'Documents View',
                        uisref: LABS_STATE.DOCUMENTS
                    }
                ],
                title: 'Documents View'
            },
            url: '/labs/:screen_id/documents/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-labs/views/list_documents.html'
        })

        .state(LABS_STATE.EMAIL, {
            params: {
                path: [
                    {
                        label: 'Labs View',
                        uisref: LABS_STATE.SINGLE
                    },
                    {
                        label: 'Email Log',
                        uisref: LABS_STATE.EMAIL
                    }
                ],
                title: 'Email Log'
            },
            url: '/labs/:screen_id/email-log/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-labs/views/list_email.html'
        })

    // LABS structure view (single master structure list)
        .state(LABS_STATE.STRUCTURE, {
            params: {
                path: [
                    {
                        label: 'Labs View',
                        uisref: LABS_STATE.SINGLE
                    },
                    {
                        label: 'Labs Structure',
                        uisref: LABS_STATE.STRUCTURE
                    }
                ],
                title: 'Labs Structure'
            },
            url: '/labs/:screen_id/structure',
            requireADLogin: true,
            templateUrl: 'app-labs/views/structure.html'
        })

    // LABS entity edit view (single master entity -- edit screen)
        .state(LABS_STATE.EDIT, {
            params: {
                path: [
                    {
                        label: 'Labs',
                        uisref: LABS_STATE.SINGLE
                    },
                    {
                        label: 'Labs Edit',
                        uisref: LABS_STATE.EDIT
                    }
                ],
                title: 'Labs Entity Edit'
            },
            url: '/labs/:screen_id/edit/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-labs/views/edit.html'
        }).state(LABS_STATE.EMAILPREVIEW, {
            params: {
                path: [ {
                    label: 'Labs Management View',
                    uisref: LABS_STATE.SINGLE
                }, {
                    label: 'Labs Entity Edit',
                    uisref: LABS_STATE.EDIT
                } ],
                title: 'Labs Email Preview'
            },
            url: '/labs/:screen_id/emailpreview/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-labs/views/emailpreview.html'
        });
} ]);

// ON RUN
APP_LABS.run([ '$state', '$rootScope', 'LABS_STATE', function($state, $rootScope, LABS_STATE) {
    let titleMap = {};
    titleMap[LABS_STATE.SINGLE] = 'Lab Results List';
    titleMap[LABS_STATE.EDIT] = 'Labs <new>';

    let screenMap = {}; // only one screen here. map not needed

    let entityMap = {}; // if needed :)

    // do not edit below
    $rootScope.$on('$includeContentLoaded', () => {
        changeTitle();
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
