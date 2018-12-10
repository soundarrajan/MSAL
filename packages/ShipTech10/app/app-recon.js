// Load MASTERS APP (module)
var APP_RECON = angular.module('shiptech.app.recon', [
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
APP_RECON.constant('RECON_STATE', {
    'DEFAULT': 'recon',
    'HOME': 'recon.home',
    'SINGLE': 'recon.single',
    'AUDIT': 'recon.audit',
    'DOCUMENTS': 'recon.documents',
    'STRUCTURE': 'recon.structure',
    'EDIT': 'recon.edit',
});

// Config
APP_RECON.config(['$stateProvider', '$urlRouterProvider', 'RECON_STATE', function ($stateProvider, $urlRouterProvider, RECON_STATE) {

    $stateProvider

    .state(RECON_STATE.DEFAULT, {
        abstract: true,
        templateUrl: 'layouts/default.html'
    })

    .state(RECON_STATE.HOME, {
        params: {
            path: [
                {
                    label: 'Recon List',
                    uisref: RECON_STATE.HOME
                }
            ],
            title: 'Recon List'
        },
        url: '/recon/:screen_id',
        requireADLogin: true,
        templateUrl: 'app-recon/views/list/recon_list.html'
    })
    // RECON view (single master list)
    .state(RECON_STATE.SINGLE, {
        params: {
            path: [
                {
                    label: 'Recon List',
                    uisref: RECON_STATE.HOME
                },
                {
                    label: 'Recon View',
                    uisref: RECON_STATE.SINGLE
                }
            ],
            title: 'Recon View'
        },
        url: '/recon/:screen_id',
        requireADLogin: true,
        templateUrl: function ($stateParams) {
            return 'app-recon/views/list/' + $stateParams.screen_id + '.html';
        }
    })

    // RECON - AUDIT view (single master-audit list)
    .state(RECON_STATE.AUDIT, {
        params: {
            path: [
                {
                    label: 'Recon List',
                    uisref: RECON_STATE.HOME
                },
                {
                    label: 'Audit View',
                    uisref: RECON_STATE.AUDIT
                }
            ],
            title: 'Audit View'
        },
        url: '/recon/:screen_id/audit/:entity_id',
        requireADLogin: true,
        templateUrl: 'app-recon/views/list_audit.html'
    })

    // RECON - DOCUMENTS view (single master-documents list)
    .state(RECON_STATE.DOCUMENTS, {
        params: {
            path: [
                {
                    label: 'Recon List',
                    uisref: RECON_STATE.HOME
                },
                {
                    label: 'Documents View',
                    uisref: RECON_STATE.DOCUMENTS
                }
            ],
            title: 'Documents View'
        },
        url: '/recon/:screen_id/documents/:entity_id',
        requireADLogin: true,
        templateUrl: 'app-recon/views/list_documents.html'
    })

    // RECON structure view (single master structure list)
    .state(RECON_STATE.STRUCTURE, {
        params: {
            path: [
                {
                    label: 'Recon List',
                    uisref: RECON_STATE.HOME
                },
                {
                    label: 'Recon Structure',
                    uisref: RECON_STATE.STRUCTURE
                }
            ],
            title: 'Recon Structure'
        },
        url: '/recon/:screen_id/structure',
        requireADLogin: true,
        templateUrl: 'app-recon/views/structure.html'
    })

    // RECON entity edit view (single master entity -- edit screen)
    .state(RECON_STATE.EDIT, {
        params: {
            path: [
                {
                    label: 'Recon List',
                    uisref: RECON_STATE.HOME
                },
                {
                    label: 'Recon Entity Edit',
                    uisref: RECON_STATE.EDIT
                }
            ],
            title: 'Recon Entity Edit'
        },
        url: '/recon/:screen_id/edit/:entity_id',
        requireADLogin: true,
        templateUrl: 'app-recon/views/edit.html'
    });
}]);

// ON RUN
APP_RECON.run(['$state', '$rootScope', 'RECON_STATE', function ($state, $rootScope, RECON_STATE) {

    var titleMap = {}
    titleMap[RECON_STATE.HOME] = 'Recon List';
    titleMap[RECON_STATE.SINGLE] = ':screen_id List';
    titleMap[RECON_STATE.STRUCTURE] = ':screen_id :: Structure';
    titleMap[RECON_STATE.EDIT] = ':screen_id :: Edit :entity_id';

    var screenMap = {
        'reconlist': 'Recon',
        'quantity_recon': 'Quantity Reconciliation',
        'quality_recon': 'Quality Reconciliation',
        'price_cost_recon': 'Price and Cost Reconciliation',
    };

    var entityMap = {}; // if needed :)

    // do not edit below
    $rootScope.$on('$includeContentLoaded', function () {
        changeTitle();
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        changeTitle();
    });

    var changeTitle = function () {
        if (titleMap[$state.current.name]) {
            var newTitle = titleMap[$state.current.name];
            newTitle = newTitle.replace(/:screen_id/i, screenMap[$state.params.screen_id]).replace(/:entity_id/i, $state.params.entity_id);
            $state.params.title = newTitle;
        }
    };

}]);
