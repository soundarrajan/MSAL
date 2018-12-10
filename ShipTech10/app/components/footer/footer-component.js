function FooterController() {

}

angular.module('shiptech.components').component('footerComponent', {
    templateUrl: 'components/footer/views/footer-component.html',
    controller: FooterController,
    bindings: {
        settings: '='
    }
});