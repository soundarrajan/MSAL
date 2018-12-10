angular.module('shiptech.components').component('headerComponent', {
    templateUrl: 'components/header/views/header-component.html',
    controller: 'HeaderController',
    bindings: {
        settings: '='
    }
});
