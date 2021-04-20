angular.module('shiptech.components')
    .controller('OrderEmailDialogController', [ '$scope', 'SCREEN_ACTIONS',
        function($scope, SCREEN_ACTIONS) {
            let ctrl = this;
            ctrl.SCREEN_ACTIONS = SCREEN_ACTIONS;
            ctrl.messageType = SCREEN_ACTIONS.SHOWSOFTSTOPCONFIRMEMAIL;

            ctrl.$onChanges = function(changes) {
                if (changes.messageType.isFirstChange()) {
                    return false;
                }
                ctrl.messageType = changes.messageType.currentValue;
                if (ctrl.messageType == 'hardPretest') {
                    ctrl.messageText = 'You did not send pre test confirmation.';
                }
                if (ctrl.messageType == 'hardVessel') {
                    ctrl.messageText = 'You did not send a confirmation email to Vessel.';
                }
                if (ctrl.messageType == 'hardSeller') {
                    ctrl.messageText = 'You did not send a confirmation email to Seller.';
                }
                if (ctrl.messageType == 'hardBoth') {
                    ctrl.messageText = 'You did not send a confirmation email to Seller and Vessel.';
                }
                if (ctrl.messageType == 'softVessel') {
                    ctrl.messageText = 'You did not send a confirmation email to Vessel?';
                }
                if (ctrl.messageType == 'softSeller') {
                    ctrl.messageText = 'You did not send a confirmation email to Seller?';
                }
                if (ctrl.messageType == 'softBoth') {
                    ctrl.messageText = 'You did not send a confirmation email to Seller and Vessel?';
                }
                if (ctrl.messageType.indexOf('soft') != -1) {
                	ctrl.messageHStype = 'soft';
                } else {
                	ctrl.messageHStype = 'hard';
                }
            };

            ctrl.confirmOrder = function() {
                ctrl.onConfirm();
            };
        } ]);

angular.module('shiptech.components').component('orderEmailDialog', {
    templateUrl: 'components/order-email-dialog/views/order-email-dialog-component.html',
    controller: 'OrderEmailDialogController',
    bindings: {
    	messageType: '<',
        onConfirm: '&',
    }
});
