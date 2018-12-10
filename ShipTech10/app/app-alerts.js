// Load MASTERS APP (module)
var APP_ALERTS = angular.module('shiptech.app.alerts', [
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
APP_ALERTS.constant('ALERTS_STATE', {
    'DEFAULT': 'alerts',
    'ALERTS': 'alerts.list',
    'CREATE': 'alerts.create',
    'NOTIFICATIONS': 'alerts.notifications'
});

// Config
APP_ALERTS.config(['$stateProvider', '$urlRouterProvider', 'ALERTS_STATE', function ($stateProvider, $urlRouterProvider, ALERTS_STATE) {

    $stateProvider

        .state(ALERTS_STATE.DEFAULT, {
            abstract: true,
            templateUrl: 'layouts/default.html'
        })

    // ALERTS view (single master list)
    .state(ALERTS_STATE.ALERTS, {
        params: {
            path: [{
                label: 'Alerts',
                uisref: ALERTS_STATE.ALERTS
            }],
            title: 'Alerts'
        },
        url: '/alerts',
        requireADLogin: true,
        templateUrl: 'app-alerts/views/list.html'
    })

    // ALERTS entity edit view (single master entity -- edit screen)
    .state(ALERTS_STATE.CREATE, {
        params: {
            path: [{
                label: 'ALERTS View',
                uisref: ALERTS_STATE.CREATE
            }],
            title: 'CREATE ALERT RULE'
        },
        url: '/alerts/create',
        requireADLogin: true,
        templateUrl: 'app-alerts/views/create.html'
    })
    .state(ALERTS_STATE.NOTIFICATIONS, {
        params: {
            path: [{
                label: 'Notifications View',
                uisref: ALERTS_STATE.CREATE
            }],
            title: 'Notifications List'
        },
        url: '/alerts/notifications',
        requireADLogin: true,
        templateUrl: 'app-alerts/views/notifications.html'
    });
}]);

// ON RUN
APP_ALERTS.run(['$state', '$rootScope', 'ALERTS_STATE', function ($state, $rootScope, ALERTS_STATE) {

    var titleMap = {}
    titleMap[ALERTS_STATE.ALERTS] = 'SEARCH ALERTS';
    titleMap[ALERTS_STATE.CREATE] = 'CREATE ALERT RULE';
    titleMap[ALERTS_STATE.NOTIFICATIONS] = 'NOTIFICATION';


    var screenMap = {
        'alerts_list': 'Alerts',
    }; // only one screen here. map not needed

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
