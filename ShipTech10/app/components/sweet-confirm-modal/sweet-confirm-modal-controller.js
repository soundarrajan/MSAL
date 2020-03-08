angular.module('shiptech.components')
    .controller('SweetConfirmModalController', [ '$scope', '$state', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP',
        function($scope, $state, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP) {
            let ctrl = this;
            ctrl.requestIds = null;
            ctrl.groupId = null;

            ctrl.amendRFQ = function() {
                ctrl.onAmend();
            };
            ctrl.reloadRequest = function() {
                ctrl.onReload();
            };
            ctrl.$onChanges = function(changes) {
        	console.log(changes);
        	if (changes.entityToDelete) {
	        	if (changes.entityToDelete.currentValue) {
	        		ctrl.entityToDelete = changes.entityToDelete.currentValue;
	        	}
        	}
        	if (changes.deleteDataParams.currentValue && ctrl.entityToDelete == 'product') {
        		ctrl.deleteDataParams = changes.deleteDataParams.currentValue;
        		if (ctrl.deleteDataParams.product) {
	        		ctrl.confirmText = `Are you sure you want to delete ${ctrl.deleteDataParams.product.product.name } from ${ ctrl.deleteDataParams.location.location.name}`;
	        		ctrl.openModal();
        		}
        	}
        	if (changes.deleteDataParams.currentValue && ctrl.entityToDelete == 'location') {
        		ctrl.deleteDataParams = changes.deleteDataParams.currentValue;
        		ctrl.confirmText = `Are you sure you want to delete ${ ctrl.deleteDataParams.location.location.name}`;
        		ctrl.openModal();
        	}
        	if (changes.deleteDataParams.currentValue && ctrl.entityToDelete == 'request') {
        		ctrl.deleteDataParams = changes.deleteDataParams.currentValue;
                    let list = [ 'Inquired', 'PartiallyInquired', 'Quoted', 'PartiallyQuoted', 'Amended' ];
        		if (list.indexOf($state.params.status.name) != -1) {
                        ctrl.confirmText = 'Are you sure you want to cancel this request?(The Request belongs to a Group and this Group will be deleted)';
                    } else {
                        ctrl.confirmText = 'Are you sure you want to cancel this request?';
                    }
        		ctrl.openModal();
        	}
        	if (changes.deleteDataParams.currentValue && ctrl.entityToDelete == 'canBeCanceledProduct') {
        		ctrl.deleteDataParams = changes.deleteDataParams.currentValue;
        		ctrl.confirmText = changes.deleteDataParams.currentValue.confirmText;
        		ctrl.openModal();
        	}
        	if (changes.deleteDataParams.currentValue && ctrl.entityToDelete == 'canBeCanceledLocation') {
        		ctrl.deleteDataParams = changes.deleteDataParams.currentValue;
        		ctrl.confirmText = changes.deleteDataParams.currentValue.confirmText;
        		ctrl.openModal();
        	}
           	if (changes.deleteDataParams.currentValue && ctrl.entityToDelete == 'canBeCanceledRequest') {
        		ctrl.deleteDataParams = changes.deleteDataParams.currentValue;
        		ctrl.confirmText = changes.deleteDataParams.currentValue.confirmText;
        		ctrl.openModal();
        	}
            };
            ctrl.confirmAction = function() {
        	if (ctrl.entityToDelete == 'product') {
	        	ctrl.onConfirmproductdelete(ctrl.deleteDataParams);
        	}
        	if (ctrl.entityToDelete == 'location') {
	        	ctrl.onConfirmlocationdelete(ctrl.deleteDataParams);
        	}
        	if (ctrl.entityToDelete == 'request') {
	        	ctrl.onConfirmrequestdelete();
        	}
        	if (ctrl.entityToDelete == 'canBeCanceledProduct') {
	        	ctrl.onCanbecancelledproductfromlocation(ctrl.deleteDataParams);
        	}
        	if (ctrl.entityToDelete == 'canBeCanceledLocation') {
	        	ctrl.onCanbecancelledlocation(ctrl.deleteDataParams);
        	}
        	if (ctrl.entityToDelete == 'canBeCanceledRequest') {
	        	ctrl.onCanbecancelledrequest();
        	}
            };
            ctrl.openModal = function() {
        	$('.confirmModal').modal();
        	$('.confirmModal').removeClass('hide fade');
        	$('.confirmModal').css('transform', 'translateY(100px)');
            };
        } ]);

angular.module('shiptech.components').component('sweetConfirm', {
    templateUrl: 'components/sweet-confirm-modal/views/sweet-confirm-modal-component.html',
    controller: 'SweetConfirmModalController',
    bindings: {
        onConfirmproductdelete: '&',
        onConfirmlocationdelete: '&',
        onConfirmrequestdelete: '&',
        onCanbecancelledproductfromlocation: '&',
        onCanbecancelledlocation: '&',
        onCanbecancelledrequest: '&',
        deleteDataParams: '<',
        entityToDelete: '<',
    }
});
