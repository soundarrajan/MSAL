// Load ADMIN APP (module)
var APP_ADMIN = angular.module('shiptech.app.admin', [
    // 3rd party
    'ui.router',
    // Specific modules
    'shiptech.app.api', 'shiptech.app.general.components'
]);
// Constants
APP_ADMIN.constant('ADMIN_STATE', {
    DEFAULT: 'admin',
    HOME: 'admin.home',
    SINGLE: 'admin.single',
    AUDIT: 'admin.audit',
    DOCUMENTS: 'admin.documents',
    STRUCTURE: 'admin.structure',
    EDIT: 'admin.edit',
    PASSWORD: 'admin.password',
    CONFIGURATION: 'admin.configuration',
    SELLERRATING: 'admin.sellerRating',
    TRANSLATE: 'admin.translate',
});
// Config
APP_ADMIN.config([ '$stateProvider', '$urlRouterProvider', 'ADMIN_STATE', function($stateProvider, $urlRouterProvider, ADMIN_STATE) {
    $stateProvider.state(ADMIN_STATE.DEFAULT, {
        abstract: true,
        templateUrl: 'layouts/default.html'
    }).state(ADMIN_STATE.HOME, {
        params: {
            path: [ {
                label: 'Admin',
                uisref: ADMIN_STATE.HOME
            } ],
            title: 'Admin'
        },
        url: '/admin',
        requireADLogin: true,
        templateUrl: 'app-admin/views/catalog.html'
    }).state(ADMIN_STATE.SINGLE, {
        params: {
            path: [ {
                label: 'Admin',
                uisref: ADMIN_STATE.HOME
            }, {
                label: 'Admin Screen List',
                uisref: ADMIN_STATE.SINGLE
            } ],
            title: 'Admin Screen List'
        },
        url: '/admin/:screen_id',
        requireADLogin: true,
        // templateUrl: 'app-admin/views/list.html'
        templateUrl: function($stateParams) {
            return `app-admin/views/lists/${ $stateParams.screen_id }.html`;
        }
    }).state(ADMIN_STATE.EDIT, {
        params: {
            path: [ {
                label: 'Admin',
                uisref: ADMIN_STATE.HOME
            }, {
                label: 'Admin Screen Entity Edit',
                uisref: ADMIN_STATE.EDIT
            } ],
            title: 'Admin Screen Entity Edit'
        },
        url: '/admin/:screen_id/edit/:entity_id',
        requireADLogin: true,
        templateUrl: function($stateParams) {
            return `app-admin/views/edit/${ $stateParams.screen_id }.html`;
        }
    }).state(ADMIN_STATE.STRUCTURE, {
        params: {
            path: [ {
                label: 'Admin',
                uisref: ADMIN_STATE.HOME
            }, {
                label: 'Admin Screen Structure Edit',
                uisref: ADMIN_STATE.STRUCTURE
            } ],
            title: 'Admin Screen Structure Edit'
        },
        url: '/admin/:screen_id/structure',
        requireADLogin: true,
        templateUrl: 'app-admin/views/structure.html'
    })
        // ADMIN organization chart
        .state('ADMIN_ORGANIZATION_CHART', {
            params: {
                path: [ {
                    label: 'Organization Chart',
                    uisref: 'admin.org_chart'
                } ]
            },
            pageTitle: 'Organization Chart',
            url: '/admin/:screen_id/organization-chart/:admin_id',
            requireADLogin: true,
            templateUrl: 'app-admin/views/org_chart.html'
        }).state(ADMIN_STATE.PASSWORD, {
            params: {
                path: [ {
                    label: 'Admin List',
                    uisref: ADMIN_STATE.HOME
                }, {
                    label: 'Admin Reset Password',
                    uisref: ADMIN_STATE.PASSWORD
                } ]
            },
            pageTitle: 'Admin Reset Password',
            url: '/admin/reset-password/:admin_id',
            requireADLogin: true,
            templateUrl: 'app-admin/views/reset_password.html'
        }).state(ADMIN_STATE.DOCUMENTS, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: ADMIN_STATE.HOME
                }, {
                    label: 'Master View',
                    uisref: ADMIN_STATE.SINGLE
                }, {
                    label: 'Master Entity Documents',
                    uisref: ADMIN_STATE.DOCUMENTS
                } ],
                title: 'Master Entity Documents'
            },
            url: '/admin/:screen_id/documents/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-admin/views/list_documents.html'
        }).state(ADMIN_STATE.AUDIT, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: ADMIN_STATE.HOME
                }, {
                    label: 'Master View',
                    uisref: ADMIN_STATE.SINGLE
                }, {
                    label: 'Master Entity Audit Log',
                    uisref: ADMIN_STATE.AUDIT
                } ],
                title: 'Master Entity Audit Log'
            },
            url: '/admin/:screen_id/audit-log/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-admin/views/list_audit.html'
        }).state(ADMIN_STATE.TRANSLATE, {
            params: {
                path: [ {
                    label: 'Masters List',
                    uisref: ADMIN_STATE.HOME
                } ],
                title: 'Translate'
            },
            url: '/admin/configuration/translate',
            requireADLogin: true,
            templateUrl: 'app-admin/views/translate.html'
        });
} ]);
// ON RUN
APP_ADMIN.run([ '$state', '$rootScope', 'ADMIN_STATE', function($state, $rootScope, ADMIN_STATE) {
    let titleMap = {};
    titleMap[ADMIN_STATE.HOME] = 'Admin Screens';
    titleMap[ADMIN_STATE.SINGLE] = ':screen_id List';
    titleMap[ADMIN_STATE.STRUCTURE] = ':screen_id :: Structure';
    titleMap[ADMIN_STATE.EDIT] = ':screen_id :: Edit :entity_id';
    titleMap[ADMIN_STATE.PASSWORD] = 'User Password Change';
    titleMap[ADMIN_STATE.TRANSLATE] = 'Translate';
    let screenMap = {
        users: 'Users',
        user_role: 'User Role',
        role: 'User Role',
        configuration: 'Configuration',
        sellerRating: 'sellerRating',
        subscriptionslist: 'Subscription',
        translate: 'Translate'
    };
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
