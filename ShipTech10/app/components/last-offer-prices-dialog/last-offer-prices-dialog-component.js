angular.module('shiptech.components')
    .controller('LastOfferPricesDialogController', [ '$scope', '$element', '$attrs', '$timeout', 'uiApiModel', 'newRequestModel', 'supplierPortalModel', 'MOCKUP_MAP',
        function($scope, $element, $attrs, $timeout, uiApiModel, newRequestModel, supplierPortalModel, MOCKUP_MAP) {
            let ctrl = this;

            ctrl.$onInit = function() {
                uiApiModel.get(MOCKUP_MAP['unrouted.latest-offer-dialog'])
                    .then((data) => {
                        ctrl.ui = data;

                        // Normalize relevant data for use in the template.
                        ctrl.tableColumns = normalizeArrayToHash(ctrl.ui.columns, 'name');
                    });
            };

            ctrl.$onChanges = function(changes) {
                if (changes.args.currentValue === null) {
                    return;
                }

                ctrl.args = changes.args.currentValue;

                if(!ctrl.args || !ctrl.args.product && !ctrl.args.token) {
                    return;
                }

                if(!ctrl.args.token) {
                    newRequestModel.getLatestOffer(ctrl.args.product, ctrl.args.seller)
                        .then((data) => {
                            ctrl.data = data.payload;
                            ctrl.selectedItem = ctrl.data[0];
                            ctrl.checkEnableComments();
                        });
                } else {
                    supplierPortalModel.getPriceHistory(ctrl.args.token, ctrl.args.location, ctrl.args.seller)
                        .then((data) => {
                            ctrl.data = data.payload;
                            ctrl.selectedItem = ctrl.data[0];
                            ctrl.checkEnableComments();
                        });
                }
            };

            ctrl.checkEnableComments = function() {
        		ctrl.hasOmittedProduct = false;
        		ctrl.omittedSellerComments = null;
                $.each(ctrl.data, (k, v) => {
                	if (v.isOmitted) {
                		ctrl.omittedSellerComments = v.sellerComments;
                		ctrl.hasOmittedProduct = true;
                	}
                });
            };

            ctrl.setSelectedItem = function(item) {
                ctrl.selectedItem = item;
            };
            ctrl.omitOffer = function() {
            	$.each(ctrl.data, (k, v) => {
        			v.sellerComments = ctrl.omittedSellerComments;
            	});
            	newRequestModel.omitOffer(ctrl.data).then((response) => {
            		if (response.isSuccess) {
            			toastr.success('Saved successfuly');
            			$('button.close[data-dismiss="modal"]').trigger('click');
            			// ctrl.prettyCloseModal();
            		}
                });
            };
		    ctrl.prettyCloseModal = function() {
		        let modalStyles = {
		            transition: '0.3s',
		            opacity: '0',
		            transform: 'translateY(-50px)'
		        };
		        let bckStyles = {
		            opacity: '0',
		            transition: '0.3s',
		        };
		        $('[modal-render=\'true\']').css(modalStyles);
		        $('.modal-backdrop').css(bckStyles);
		        setTimeout(() => {
		            if ($scope.modalInstance) {
		                $scope.modalInstance.close();
		            }
		            if ($rootScope.modalInstance) {
		                $rootScope.modalInstance.close();
		            }
		        }, 500);
		    };
        } ]);


angular.module('shiptech.components').component('lastOfferPricesDialog', {
    templateUrl: 'components/last-offer-prices-dialog/views/last-offer-prices-dialog.html',
    controller: 'LastOfferPricesDialogController',
    bindings: {
        args: '<'
    }
});
