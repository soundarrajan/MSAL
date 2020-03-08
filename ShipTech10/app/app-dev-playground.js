var APP_DEV_PLAYGROUND = angular.module('shiptech.app.dev.playground', [
    'ui.router',
    'shiptech.app.api',
    'shiptech.app.general.components'
]);

APP_DEV_PLAYGROUND.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('DEVP_HOME', {
        params: {
            path: [ {
                label: 'Dev Playground Home',
                uisref: 'dev.playground.home'
            } ],
            title: 'Dev Playground Home'
        },
        url: '/dev-playground',
        templateUrl: 'app-dev-playground/views/home.html'
    });
} ]);
