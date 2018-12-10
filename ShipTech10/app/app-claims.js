// Load MASTERS APP (module)
var APP_CLAIMS = angular.module('shiptech.app.claims', [
    // 3rd party
    'ui.router',
    // 'ngCookies',
    'ui.tree', 'ui.sortable',
    // Specific modules
    'shiptech.app.api', 'shiptech.app.general.components'
]);
// Constants
APP_CLAIMS.constant('CLAIMS_STATE', {
    'DEFAULT': 'claims',
    'SINGLE': 'claims.single',
    'AUDIT': 'claims.audit',
    'DOCUMENTS': 'claims.documents',
    'EMAIL': 'claims.email',
    'STRUCTURE': 'claims.structure',
    'EDIT': 'claims.edit',
    'EMAILPREVIEW': 'claims.emailpreview',
});
// Config
APP_CLAIMS.config(['$stateProvider', '$urlRouterProvider', 'CLAIMS_STATE', function($stateProvider, $urlRouterProvider, CLAIMS_STATE) {
    $stateProvider.state(CLAIMS_STATE.DEFAULT, {
            abstract: true,
            templateUrl: 'layouts/default.html'
        })
        // CLAIMS view (single master list)
        .state(CLAIMS_STATE.SINGLE, {
            params: {
                path: [{
                    label: 'Claims List',
                    uisref: CLAIMS_STATE.SINGLE
                }],
                title: 'Claims List'
            },
            url: '/claims/:screen_id',
            requireADLogin: true,
            templateUrl: 'app-claims/views/list.html'
        })
        // CLAIMS - AUDIT view (single master-audit list)
        .state(CLAIMS_STATE.AUDIT, {
            params: {
                path: [{
                    label: 'Claims List',
                    uisref: CLAIMS_STATE.SINGLE
                }, {
                    label: 'Audit View',
                    uisref: CLAIMS_STATE.AUDIT
                }],
                title: 'Audit View'
            },
            url: '/claims/:screen_id/audit-log/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-claims/views/list_audit.html'
        })
        // CLAIMS - AUDIT view (single master-audit list)
        .state(CLAIMS_STATE.EMAIL, {
            params: {
                path: [{
                    label: 'Claims List',
                    uisref: CLAIMS_STATE.SINGLE
                }, {
                    label: 'Mail View',
                    uisref: CLAIMS_STATE.EMAIL
                }],
                title: 'Mail View'
            },
            url: '/claims/:screen_id/email-log/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-claims/views/list_email.html'
        })
        // CLAIMS - DOCUMENTS view (single master-documents list)
        .state(CLAIMS_STATE.DOCUMENTS, {
            params: {
                path: [{
                    label: 'Claims List',
                    uisref: CLAIMS_STATE.SINGLE
                }, {
                    label: 'Documents View',
                    uisref: CLAIMS_STATE.DOCUMENTS
                }],
                title: 'Documents View'
            },
            url: '/claims/:screen_id/documents/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-claims/views/list_documents.html'
        })
        // CLAIMS structure view (single master structure list)
        .state(CLAIMS_STATE.STRUCTURE, {
            params: {
                path: [{
                    label: 'Claims List',
                    uisref: CLAIMS_STATE.SINGLE
                }, {
                    label: 'Claims Structure',
                    uisref: CLAIMS_STATE.STRUCTURE
                }],
                title: 'Claims Structure'
            },
            url: '/claims/:screen_id/structure',
            requireADLogin: true,
            templateUrl: 'app-claims/views/structure.html'
        })
        // CLAIMS entity edit view (single master entity -- edit screen)
        .state(CLAIMS_STATE.EDIT, {
            params: {
                path: [{
                    label: 'Claims List',
                    uisref: CLAIMS_STATE.SINGLE
                }, {
                    label: 'Claim Edit',
                    uisref: CLAIMS_STATE.EDIT
                }],
                title: 'Claim Edit' ,
                status: {
	            	color : '',
	            	bg : '',
	            	name: ''
	            }
            },
            url: '/claims/:screen_id/edit/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-claims/views/edit.html'
        }).state(CLAIMS_STATE.EMAILPREVIEW, {
            params: {
                path: [{
                    label: 'CLAIMS Management View',
                    uisref: CLAIMS_STATE.SINGLE
                }, {
                    label: 'CLAIMS Entity Edit',
                    uisref: CLAIMS_STATE.EDIT
                }],
                title: 'CLAIMS Email Preview'
            },
            url: '/claims/:screen_id/emailpreview/:entity_id',
            requireADLogin: true,
            templateUrl: 'app-claims/views/emailpreview.html'
        });
}]);
// ON RUN
APP_CLAIMS.run(['$state', '$rootScope', 'CLAIMS_STATE', function($state, $rootScope, CLAIMS_STATE) {
    var titleMap = {}
    titleMap[CLAIMS_STATE.SINGLE] = 'Claims List';
    titleMap[CLAIMS_STATE.EDIT] = 'Claims ';
    var screenMap = {}; // only one screen here. map not needed
    var entityMap = {}; // if needed :)
    // do not edit below
    $rootScope.$on('$includeContentLoaded', function() {
        changeTitle();
    });
    $rootScope.$on('$stateChangeSuccess', function() {
        changeTitle();
    });
    var changeTitle = function() {
        if (titleMap[$state.current.name]) {
            var newTitle = titleMap[$state.current.name];
            newTitle = newTitle.replace(/:screen_id/i, screenMap[$state.params.screen_id]).replace(/:entity_id/i, $state.params.entity_id);
            $state.params.title = newTitle;
        }
    };
}]);
