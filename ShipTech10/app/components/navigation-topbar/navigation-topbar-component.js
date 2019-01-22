angular.module('shiptech').controller('NavigationTopBarController', ['$rootScope', '$timeout', '$scope', '$state', '$stateParams' , '$filter', 'STATE', 'CUSTOM_EVENTS', 'VIEW_TYPES',
    'scheduleDashboardCalendarModel', 'API', '$http',
    function($rootScope, $timeout, $scope, $state, $stateParams, $filter, STATE, CUSTOM_EVENTS, VIEW_TYPES, scheduleDashboardCalendarModel, API, $http) {

    	ctrl = this;
    	ctrl.availableStates = [
    		"default.edit-request", // REQUEST
    		"default.new-request", // REQUEST
    		"default.group-of-requests", // RFQ/OFFER/CONTRACT
    		"contracts.edit", // RFQ/OFFER/CONTRACT
    		"default.select-contract", // RFQ/OFFER/CONTRACT
    		"default.new-order", // ORDER
    		"default.edit-order", // ORDER
    		"delivery.edit", // DELIVERY
    		"labs.edit", // LABS
    		"claims.edit", // CLAIMS
    		"invoices.edit", // INVOICES
    		"recon.edit", // RECON
		]
		
		setTimeout(function(){
			//$scope.shouldDisplayNavigationBar = true;
			//console.error($state.params);
		}, 3000);

    	$scope.$watch(function(){
    		stateParams = JSON.stringify($state.params);
    		return ($state.$current+"&&&"+stateParams);
    	}, function(newVal, oldVal){
    		parameters = newVal.split('&&&')
		    stateParams = JSON.parse(parameters[1]);
		    $scope.currentPage = parameters[0];
		    $scope.entityId = stateParams.requestId;
			$scope.initNavigation();
			//console.error('scope params', $state.params);
		})     

    	$scope.initNavigation = function(resize){
			if (!$scope.navigationItems || resize) {
				$scope.shouldDisplayNavigationBar = false;
				createNavigationItems();
				setItemsActiveStatus();
				setResponsiveItemsNames();
			}
    	}
    	$(window).resize(function(){
			$scope.initNavigation(true);
    	})


    	createNavigationItems = function(payload) {
			// indexStatus = calculate if is previous, current or next
			
			if(typeof payload != 'undefined'){
				console.log('the payload', payload);
			}


    		$scope.navigationItems = [
	    		{
	    			"id": "request",
	    			"displayName" : "Request",
	    			"url" : (typeof payload != 'undefined' && payload.requestId ) ? "#/edit-request/" + payload.requestId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.requestId ) ? payload.requestId : '',
	    			"indexStatus" : null,
	    			"hidden" : false
	    		},
	    		{
	    			"id": "contract",
	    			"displayName" : "Contract",
	    			"url" : (typeof payload != 'undefined' && payload.contractId ) ? "#/contracts/contract/edit/" + payload.contractId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.contractId ) ? payload.contractId : '',
	    			"indexStatus" : null,
	    			"hidden" : ((typeof payload != 'undefined' && payload.contractId) || ($scope.currentPage == 'contracts.edit')) ? false : true
	    		},
	    		{
	    			"id": "rfq",
	    			"displayName" : (typeof payload != 'undefined' && payload.hasQuote ) ? "Offer" : "RFQ",
	    			"url" : (typeof payload != 'undefined' && payload.requestGroupId ) ? "#/group-of-requests/" + payload.requestGroupId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.requestGroupId ) ? payload.requestGroupId : '',
	    			"indexStatus" : null,
	    			"hidden" : false
	    		},
	    		{
	    			"id": "order",
	    			"displayName" : "Order",
	    			"url" : (typeof payload != 'undefined' && payload.orderId ) ? "#/edit-order/" + payload.orderId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.orderId ) ? payload.orderId : '',
	    			"indexStatus" : null,
	    			"hidden" : false
	    		},
	    		{
	    			"id": "delivery",
	    			"displayName" : "Delivery",
	    			"url" : (typeof payload != 'undefined' && payload.deliveryId ) ? "#/delivery/delivery/edit/" + payload.deliveryId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.deliveryId ) ? payload.deliveryId : '',
	    			"indexStatus" : null,
	    			"hidden" : false
	    		},
	    		{
	    			"id": "labs",
	    			"displayName" : "Labs",
	    			"url" : (typeof payload != 'undefined' && payload.labId ) ? "#/labs/labresult/edit/" + payload.labId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.labId ) ? payload.labId : '',
	    			"indexStatus" : null,
	    			"hidden" : false
	    		},    		    		    		
	    		{
	    			"id": "claims",
	    			"displayName" : "Claims",
	    			"url" : (typeof payload != 'undefined' && payload.claimId ) ? "#/claims/claim/edit/" + payload.claimId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.claimId ) ? payload.claimId : '',
	    			"indexStatus" : null,
	    			"hidden" : false
	    		},
	    		{
	    			"id": "invoices",
	    			"displayName" : "Invoices",
	    			"url": (typeof payload != 'undefined' && payload.invoiceId) ? "#/invoices/invoice/edit/" + payload.invoiceId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.invoiceId ) ? payload.invoiceId : '',
	    			"indexStatus" : null,
	    			"hidden" : false
	    		},
	    		{
	    			"id": "recon",
	    			"displayName" : "Recon",
	    			"url" : (typeof payload != 'undefined' && payload.orderId ) ? "#/recon/reconlist/edit/" + payload.orderId : '',
	    			"entityId" : (typeof payload != 'undefined' && payload.orderId ) ? payload.orderId : '',
	    			"indexStatus" : null,
	    			"hidden" : false
	    		},    		    		    		
			];
			
    	}

    	setItemsActiveStatus = function() {
			activeItemId = null
			
			navigationPayload = {}

		

            console.log('_____ $state.params _____', $state.params);
            
    		if ($scope.currentPage == 'default.edit-request' || $scope.currentPage == 'default.new-request') {
				activeItemId = 'request'
				navigationPayload.RequestId = $state.params.requestId;
    		}
    		if ($scope.currentPage == 'contracts.edit') {
				activeItemId = 'contract'
				navigationPayload.ContractId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == 'default.group-of-requests') {
				activeItemId = 'rfq'
				navigationPayload.RequestGroupId = $state.params.groupId;
    		}
    		if ($scope.currentPage == 'default.new-order' || $scope.currentPage == 'default.edit-order') {
				activeItemId = 'order'
				navigationPayload.OrderId = $state.params.orderId;
    		}
    		if ($scope.currentPage == "delivery.edit") {
				activeItemId = 'delivery'
				navigationPayload.DeliveryId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == "labs.edit") {
				activeItemId = 'labs'
				navigationPayload.LabId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == "claims.edit") {
				activeItemId = 'claims'
				navigationPayload.ClaimId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == "invoices.edit") {
				activeItemId = 'invoices'
				navigationPayload.InvoiceId = $state.params.entity_id;
    		}
    		if ($scope.currentPage == "recon.edit") {
			
				activeItemId = 'recon'
				navigationPayload.OrderId = $state.params.entity_id;
			}


    		if (activeItemId) {
				//move this back to true, after you sort the orderId problem
				$scope.shouldDisplayNavigationBar = true

				//console.error('navigation payload', navigationPayload)

				$http({
					method: "POST",
					url: API.BASE_URL_DATA_INFRASTRUCTURE + '/api/infrastructure/navbar/navbaridslist',
					data: {
						payload: navigationPayload,
					}
				}).then(function(data){
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
	
			var markNavigationItems = function(){
				activeItemIndex = -1;  
				$.each($scope.navigationItems, function(itemKey, itemVal){
					if (itemVal.id == activeItemId) {
						itemVal.indexStatus = 'navigationBar-active';
						activeItemIndex = itemKey;
					}
				}) 	
											  
				$.each($scope.navigationItems, function(itemKey, itemVal){
					if (itemKey < activeItemIndex) {
						itemVal.indexStatus = 'navigationBar-previous'
					}
					if (itemKey > activeItemIndex) {
						itemVal.indexStatus = 'navigationBar-next'
					}	
				}) 	
			}

			markNavigationItems();

    	}

    	setResponsiveItemsNames = function() {
    		$.each($scope.navigationItems, function(itemKey, itemVal){
				if (window.innerWidth < 960) {
					itemVal.displayName = itemVal.displayName.substring(0,3);
				}
    			if (window.innerWidth < 775) {
					itemVal.displayName = itemVal.displayName.substring(0,2);
    			}
    		})
    	}


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
