angular.module('shiptech').controller('NavigationTopBarController', [ '$rootScope', '$tenantSettings', '$timeout', '$scope', '$state', '$stateParams', '$filter', 'STATE', 'CUSTOM_EVENTS', 'VIEW_TYPES',
    'scheduleDashboardCalendarModel', 'API', '$http',
    function($rootScope, $tenantSettings, $timeout, $scope, $state, $stateParams, $filter, STATE, CUSTOM_EVENTS, VIEW_TYPES, scheduleDashboardCalendarModel, API, $http) {
		var ctrl = this;
    	ctrl.availableStates = [
    		'default.edit-request', // REQUEST
    		'default.new-request', // REQUEST
    		'default.group-of-requests', // RFQ/OFFER/CONTRACT
    		'contracts.edit', // RFQ/OFFER/CONTRACT
    		'default.select-contract', // RFQ/OFFER/CONTRACT
    		'default.new-order', // ORDER
    		'default.edit-order', // ORDER
    		'delivery.edit', // DELIVERY
    		'labs.edit', // LABS
    		'claims.edit', // CLAIMS
    		'invoices.edit', // INVOICES
    		'recon.edit', // RECON
        ];

        // setTimeout(() => {
        //     $scope.shouldDisplayNavigationBar = true;
        //     console.error($state.params);
        // }, 3000);

        $scope.tenantSettings = $tenantSettings;

    	$scope.$watch(() => {
			var stateParams = JSON.stringify($state.params);
    		return `${$state.$current}&&&${stateParams}`;
    	}, (newVal, oldVal) => {
			var parameters = newVal.split('&&&');
		    var stateParams = JSON.parse(parameters[1]);
		    $scope.currentPage = parameters[0];
		    $scope.entityId = stateParams.requestId;
            $scope.initNavigation();
            // console.error('scope params', $state.params);
        });

		$scope.checkIfShouldDisplayNavigationBar = function(){
			var possiblePages = ['default.edit-request', 'default.new-request', 'contracts.edit', 'default.group-of-requests', 'default.new-order', 'default.edit-order', 'delivery.edit', 'labs.edit', 'claims.edit', 'invoices.edit', 'recon.edit'];
			if(possiblePages.indexOf($scope.currentPage) >= 0){
				return true;
			}
			return false;
		};

    	$scope.initNavigation = function(resize) {
			$scope.shouldDisplayNavigationBar = $scope.checkIfShouldDisplayNavigationBar();
			if($scope.shouldDisplayNavigationBar){
				createNavigationItems();
                setItemsActiveStatus();
                setResponsiveItemsNames();
			}
		};

    	$(window).resize(() => {
            $scope.initNavigation(true);
    	});

		var createNavigationItems = function(payload) {
            // indexStatus = calculate if is previous, current or next

            if(typeof payload != 'undefined') {
                console.log('the payload', payload);
            }


    		var navigationItems = [
	    		{
	    			id: 'request',
	    			displayName : 'Request',
	    			url : typeof payload != 'undefined' && payload.requestId ? `#/edit-request/${ payload.requestId}` : '',
	    			entityId : typeof payload != 'undefined' && payload.requestId ? payload.requestId : '',
	    			indexStatus : null,
	    			hidden : false
	    		},
	    		{
	    			id: 'rfq',
	    			displayName : typeof payload != 'undefined' && payload.hasQuote ? 'Offer' : 'RFQ',
	    			url : typeof payload != 'undefined' && payload.requestGroupId ? `#/group-of-requests/${ payload.requestGroupId}` : '',
	    			entityId : typeof payload != 'undefined' && payload.requestGroupId ? payload.requestGroupId : '',
	    			indexStatus : null,
	    			hidden : false
	    		},
	    		{
	    			id: 'order',
	    			displayName : 'Order',
	    			url : typeof payload != 'undefined' && payload.orderId ? `#/edit-order/${ payload.orderId}` : '',
	    			entityId : typeof payload != 'undefined' && payload.orderId ? payload.orderId : '',
	    			indexStatus : null,
	    			hidden : false
	    		}	    		
            ];
            var shiptechLiteTransactions;
            if (typeof payload != 'undefined' && payload.invoiceClaimDetailId) {   
                shiptechLiteTransactions = [
                    {
                        id: 'contract',
                        displayName : 'Contract',
                        url : typeof payload != 'undefined' && payload.contractId ? `v2/contracts/contract/${ payload.contractId}/details` : '',
                        entityId : typeof payload != 'undefined' && payload.contractId ? payload.contractId : '',
                        indexStatus : null,
                        hidden : !(typeof payload != 'undefined' && payload.contractId || $scope.currentPage == 'contracts.edit')
                    },
                    {
                        id: 'delivery',
                        displayName : 'Delivery',
                        url : typeof payload != 'undefined' && payload.deliveryId ? `v2/delivery/delivery/${ payload.deliveryId}/details` : '',
                        entityId : typeof payload != 'undefined' && payload.deliveryId ? payload.deliveryId : '',
                        indexStatus : null,
                        hidden : false
                    },
                    {
                        id: 'labs',
                        displayName : 'Labs',
                        url : typeof payload != 'undefined' && payload.labId ? `#/labs/labresult/edit/${ payload.labId}` : '',
                        entityId : typeof payload != 'undefined' && payload.labId ? payload.labId : '',
                        indexStatus : null,
                        hidden : false
                    },
                    {
                        id: 'claims',
                        displayName : 'Claims',
                        url : typeof payload != 'undefined' && payload.claimId ? `#/claims/claim/edit/${ payload.claimId}` : '',
                        entityId : typeof payload != 'undefined' && payload.claimId ? payload.claimId : '',
                        indexStatus : null,
                        hidden : false
                    },
                    {
                        id: 'invoices',
                        displayName : 'Invoices',
                        url: typeof payload != 'undefined' && payload.invoiceId ? `#/invoices/claims/edit/${ payload.invoiceId}` : '',
                        entityId : typeof payload != 'undefined' && payload.invoiceId ? payload.invoiceId : '',
                        indexStatus : null,
                        hidden : false
                    },
                    {
                        id: 'recon',
                        displayName : 'Recon',
                        url : typeof payload != 'undefined' && payload.orderId ? `#/recon/reconlist/edit/${ payload.orderId}` : '',
                        entityId : typeof payload != 'undefined' && payload.orderId ? payload.orderId : '',
                        indexStatus : null,
                        hidden : false
                    }
                ]
            } else {
                shiptechLiteTransactions = [
                    {
                        id: 'contract',
                        displayName : 'Contract',
                        url : typeof payload != 'undefined' && payload.contractId ? `v2/contracts/contract/${ payload.contractId}/details` : '',
                        entityId : typeof payload != 'undefined' && payload.contractId ? payload.contractId : '',
                        indexStatus : null,
                        hidden : !(typeof payload != 'undefined' && payload.contractId || $scope.currentPage == 'contracts.edit')
                    },
                    {
                        id: 'delivery',
                        displayName : 'Delivery',
                        url : typeof payload != 'undefined' && payload.deliveryId ? `v2/delivery/delivery/${ payload.deliveryId}/details` : '',
                        entityId : typeof payload != 'undefined' && payload.deliveryId ? payload.deliveryId : '',
                        indexStatus : null,
                        hidden : false
                    },
                    {
                        id: 'labs',
                        displayName : 'Labs',
                        url : typeof payload != 'undefined' && payload.labId ? `#/labs/labresult/edit/${ payload.labId}` : '',
                        entityId : typeof payload != 'undefined' && payload.labId ? payload.labId : '',
                        indexStatus : null,
                        hidden : false
                    },
                    {
                        id: 'claims',
                        displayName : 'Claims',
                        url : typeof payload != 'undefined' && payload.claimId ? `#/claims/claim/edit/${ payload.claimId}` : '',
                        entityId : typeof payload != 'undefined' && payload.claimId ? payload.claimId : '',
                        indexStatus : null,
                        hidden : false
                    },
                    {
                        id: 'invoices',
                        displayName : 'Invoices',
                        url: typeof payload != 'undefined' && payload.invoiceId ? `v2/invoices/edit/${ payload.invoiceId}` : '',
                        entityId : typeof payload != 'undefined' && payload.invoiceId ? payload.invoiceId : '',
                        indexStatus : null,
                        hidden : false
                    },
                    {
                        id: 'recon',
                        displayName : 'Recon',
                        url : typeof payload != 'undefined' && payload.orderId ? `#/recon/reconlist/edit/${ payload.orderId}` : '',
                        entityId : typeof payload != 'undefined' && payload.orderId ? payload.orderId : '',
                        indexStatus : null,
                        hidden : false
                    }
                ]
            }


            if (!$scope.tenantSettings.shiptechLite) {
	            $scope.navigationItems = [...navigationItems, ...shiptechLiteTransactions];
            } else {
	            $scope.navigationItems = navigationItems;
            }
    	};

		var setItemsActiveStatus = function() {
			var activeItemId = null;

			var navigationPayload = {};


            console.log('_____ $state.params _____', $state.params);

    		if ($scope.currentPage == 'default.edit-request' || $scope.currentPage == 'default.new-request') {
                activeItemId = 'request';
                navigationPayload.RequestId = $state.params.requestId;
    		}
    		if ($scope.currentPage == 'contracts.edit') {
                activeItemId = 'contract';
                navigationPayload.ContractId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == 'default.group-of-requests') {
                activeItemId = 'rfq';
                navigationPayload.RequestGroupId = $state.params.groupId;
    		}
    		if ($scope.currentPage == 'default.new-order' || $scope.currentPage == 'default.edit-order') {
                activeItemId = 'order';
                navigationPayload.OrderId = $state.params.orderId;
    		}
    		if ($scope.currentPage == 'delivery.edit') {
                activeItemId = 'delivery';
                navigationPayload.DeliveryId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == 'labs.edit') {
                activeItemId = 'labs';
                navigationPayload.LabId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == 'claims.edit') {
                activeItemId = 'claims';
                navigationPayload.ClaimId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == 'invoices.edit') {
                activeItemId = 'invoices';
                navigationPayload.InvoiceId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == 'recon.edit') {
                activeItemId = 'recon';
                navigationPayload.OrderId = $state.params.entity_id;
            }


    		if (activeItemId) {
                // move this back to true, after you sort the orderId problem
                $scope.shouldDisplayNavigationBar = true;

                // console.error('navigation payload', navigationPayload)
                if (navigationPayload.InvoiceId == '') {
                    return;
                }

                $http({
                    method: 'POST',
                    url: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/navbar/navbaridslist`,
                    data: {
                        payload: navigationPayload,
                    }
                }).then((data) => {
                    createNavigationItems(data.data);
                    markNavigationItems();
                });
            }


            // setTimeout(function(){
            // 	params = {
            // 		x: 1
            // 	}
            // 	createNavigationItems(params);
            // })

            var markNavigationItems = function() {
				var activeItemIndex = -1;
                $.each($scope.navigationItems, (itemKey, itemVal) => {
                    if (itemVal.id == activeItemId) {
                        itemVal.indexStatus = 'navigationBar-active';
                        activeItemIndex = itemKey;
                    }
                });

                $.each($scope.navigationItems, (itemKey, itemVal) => {
                    if (itemKey < activeItemIndex) {
                        itemVal.indexStatus = 'navigationBar-previous';
                    }
                    if (itemKey > activeItemIndex) {
                        itemVal.indexStatus = 'navigationBar-next';
                    }
                });
            };
            markNavigationItems();
    	};

    	var setResponsiveItemsNames = function() {
    		$.each($scope.navigationItems, (itemKey, itemVal) => {
                if (window.innerWidth < 960) {
                    itemVal.displayName = itemVal.displayName.substring(0, 3);
                }
    			if (window.innerWidth < 775) {
                    itemVal.displayName = itemVal.displayName.substring(0, 2);
    			}
    		});
    	};
    }
]);

angular.module('shiptech.components').component('navigationTopbar', {
    templateUrl: 'components/navigation-topbar/views/navigation-topbar-component.html',
    controller: 'NavigationTopBarController',
    bindings: {
        // lookupType: '<',
        // onReasonSelect: '&'
    }
});
