function PortInformationController() {
    console.log('PortInformationController');
}

angular.module('shiptech').component('portInformation', {
    templateUrl: 'components/sidebar/views/port-information.html',
    controller: PortInformationController,
    bindings: {
        settings: '='
    }
});
