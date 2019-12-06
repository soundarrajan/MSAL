angular.module('shiptech.components')
    .controller('timelineRightClickPopover', ['$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings', 'API', '$http', '$listsCache', 'statusColors',
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings, API, $http, $listsCache, statusColors) {

	        var ctrl = this;
		
	        tenantService.tenantSettings.then(function (settings) {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	        });

		    ctrl.$onChanges = function (changes) {
		    	$scope.test = new Date();
		    	$scope.rightClickPopoverData = changes.rightClickPopoverData.currentValue;
		    	$timeout(function(){
		    		todayVoyages = changes.rightClickPopoverData.currentValue.todayVoyages;
		    		if (changes.rightClickPopoverData.currentValue.bunkerDetails) {
			    		$scope.todaysBunkerDetails = normalizeBunkerDetails(changes.rightClickPopoverData.currentValue.bunkerDetails);
			    		$.each($scope.todaysBunkerDetails, function(k,v){
			    			todayVoyages.push(v);	
			    		})
		    		}
			    	groupVoyages(todayVoyages);
		    	})
		    	ctrl.vesselName = changes.rightClickPopoverData.currentValue.todayVoyages[0].VesselName;
		    	
		    };

		    normalizeBunkerDetails = function(bunkerDetails) {
		    	normalizedBunkerDetails = [];
		    	$.each(bunkerDetails, function(k,v){
		    		itemStructure = {
					    "voyageDetail": {
					    	"request": {
					    		"requestDetail" : {}
					    	},
					        "id": v.voyageDetail.id,
					        "hasStrategy": v.hasStrategy,
					        "bunkerPlan": v.bunkerPlan
					    },
					}
					normalizedBunkerDetails.push(itemStructure);
		    	})
		    	return normalizedBunkerDetails;
		    }

		    groupVoyages = function(voyages) {
		    	
		    	groupedVoyages = _.groupBy(voyages, 'voyageDetail.id');

		    	ctrl.groupedVoyagesDetails = angular.copy(groupedVoyages);

		    	groupedVoyagesBunker = angular.copy(groupedVoyages);
		    	groupedVoyagesRequest = angular.copy(groupedVoyages);
		    	groupedVoyagesOrder = angular.copy(groupedVoyages);
		    	groupedVoyagesAllRequestProductsAreStemmed = [];
		    	allProductTypes = {};
	    		orderProductTypes = {};

		    	uniqueVoyages = [];
		    	$.each(voyages, function(k,v){
		    		uniqueVoyages.push(v.voyageDetail.id);
		    	});
		    	uniqueVoyages = _.uniq(uniqueVoyages);

		    	hasEntity = {};
		    	$.each(uniqueVoyages, function(k,v){
	    			hasEntity[v] = {
	    				hasBunkerPlan : false,
	    				hasRequest : false,
	    				hasOrder : false
	    			};
			    	$.each(voyages, function(k1,v1){
			    		if (v == v1.voyageDetail.id) {
			    			if (v1.voyageDetail.bunkerPlan) {
			    				hasEntity[v1.voyageDetail.id].hasBunkerPlan = true;
			    			}
			    			if (v1.voyageDetail.request.id != 0) {
			    				hasEntity[v1.voyageDetail.id].hasRequest = true;
			    			}
			    			if (v1.voyageDetail.request.requestDetail.orderId) {
			    				hasEntity[v1.voyageDetail.id].hasOrder = true;
			    			}
			    		}
			    	})
		    	})


				$.each(uniqueVoyages, function(key, value) {
					groupedVoyagesAllRequestProductsAreStemmed[value] = true;
					$.each(voyages, function(key2, value2) {
						if (value == value2.voyageDetail.id) {
							if (value2.voyageDetail.request) {
								if (value2.voyageDetail.request.id) {
									if (!value2.voyageDetail.request.requestDetail.orderId || typeof(value2.voyageDetail.request.requestDetail.orderId) == "undefined") {
										groupedVoyagesAllRequestProductsAreStemmed[value] = false;
									}
								}
							}							
						}
					});										
					if (!hasEntity[value].hasOrder) {
						groupedVoyagesAllRequestProductsAreStemmed[value] = false;
					}
				});

				_.forEach(groupedVoyagesBunker, function(value, key) {
					groupedVoyagesBunker[key] = _.groupBy(groupedVoyagesBunker[key], function(item) {
						if (item.voyageDetail.bunkerPlan) {
							return item.voyageDetail.bunkerPlan.id;
						}
					});											
				});
				_.forEach(groupedVoyagesRequest, function(value, key) {
					groupedVoyagesRequest[key] = _.groupBy(groupedVoyagesRequest[key], function(item) {
						if (item.voyageDetail.request) {
							if (item.voyageDetail.request.id) {
								return item.voyageDetail.request.id;
							}
						}
					});
				});
				_.forEach(groupedVoyagesOrder, function(value, key) {
					groupedVoyagesOrder[key] = _.groupBy(groupedVoyagesOrder[key], function(item) {
						if (item.voyageDetail.request) {
							if (item.voyageDetail.request.requestDetail.orderId) {
								return item.voyageDetail.request.requestDetail.orderId;
							}
						}
					});
				});

				$.each(uniqueVoyages, function(k,v){
					allProductTypes[v] = []
					orderProductTypes[v] = []
				})

				Object.keys(groupedVoyagesBunker).forEach(function (item) {
					Object.keys(groupedVoyagesBunker[item]).forEach(function (item2) {
						groupedVoyagesBunker[item][item2] = _.uniqBy(groupedVoyagesBunker[item][item2], 'voyageDetail.bunkerPlan.productType');
						groupedVoyagesBunker[item][item2] = _.groupBy(groupedVoyagesBunker[item][item2], 'voyageDetail.bunkerPlan.productType'); 
						Object.keys(groupedVoyagesBunker[item][item2]).forEach(function (item3) {
							// groupedVoyagesBunker[item][item2][item3] = _.sumBy(groupedVoyagesBunker[item][item2][item3], 'voyageDetail.bunkerPlan.supplyQuantity');
							if (item3 != "undefined") {
								allProductTypes[item].push(item3);
							}
							
						});
					});
				});
				Object.keys(groupedVoyagesRequest).forEach(function (item) {
					Object.keys(groupedVoyagesRequest[item]).forEach(function (item2) {
						groupedVoyagesRequest[item][item2] = _.uniqBy(groupedVoyagesRequest[item][item2], 'voyageDetail.request.requestDetail.Id');
						groupedVoyagesRequest[item][item2] = _.groupBy(groupedVoyagesRequest[item][item2], 'voyageDetail.request.requestDetail.fuelType.name'); 
						Object.keys(groupedVoyagesRequest[item][item2]).forEach(function (item3) {
							if (item3 != "undefined") {
								groupedVoyagesRequest[item][item2][item3] = _.sumBy(groupedVoyagesRequest[item][item2][item3], 'voyageDetail.request.requestDetail.fuelMaxQuantity');
								allProductTypes[item].push(item3);
							} else {
								delete groupedVoyagesRequest[item][item2];
							}
							
						});
					});
				});


				Object.keys(groupedVoyagesOrder).forEach(function (item) {
					Object.keys(groupedVoyagesOrder[item]).forEach(function (item2) {
						if (item2 != "undefined") {
							// groupedVoyagesOrder[item][item2] = _.uniqBy(groupedVoyagesOrder[item][item2], 'voyageDetail.request.requestDetail.orderId');
							groupedVoyagesOrder[item][item2] = _.groupBy(groupedVoyagesOrder[item][item2], 'voyageDetail.request.requestDetail.fuelType.name'); 
							Object.keys(groupedVoyagesOrder[item][item2]).forEach(function (item3) {
								if (item3 != "undefined") {
									groupedVoyagesOrder[item][item2][item3] = _.sumBy(groupedVoyagesOrder[item][item2][item3], 'voyageDetail.request.requestDetail.orderProductQuantity');
									allProductTypes[item].push(item3);
									orderProductTypes[item].push(item3);
								}
								
							});
						} else {
							delete(groupedVoyagesOrder[item][item2])
						}
					});
				});				

				Object.keys(allProductTypes).forEach(function (item) {
					allProductTypes[item] = _.uniq(allProductTypes[item]);
				});				

				$.each(uniqueVoyages, function(k,v){
					if (groupedVoyagesAllRequestProductsAreStemmed[v]) {
						allProductTypes[v] = orderProductTypes[v]
					}
				})


				ctrl.groupedVoyages = {
					'hasEntity' : hasEntity,
					'allProductTypes' : allProductTypes,
					'groupedVoyagesAllRequestProductsAreStemmed' : groupedVoyagesAllRequestProductsAreStemmed,
					'groupedVoyagesBunker' : groupedVoyagesBunker,
					'groupedVoyagesRequest' : groupedVoyagesRequest,
					'groupedVoyagesOrder' : groupedVoyagesOrder,
					'uniqueVoyages' : uniqueVoyages		
				}		    		

		    }

		    ctrl.getPriorityStatus = function(voyage) {
				highestPriorityStatus = _.maxBy(ctrl.groupedVoyagesDetails[voyage], "voyageDetail.portStatusPriority");
				if (highestPriorityStatus) {
					var colorCode = statusColors.getColorCodeFromLabels(highestPriorityStatus.voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration);
					highestPriorityStatus.voyageDetail.portStatus.color = colorCode;
					highestPriorityStatus.voyageDetail.portStatus.fontColor = getContrastYIQ(colorCode);
				} else {
					highestPriorityStatus = ctrl.groupedVoyagesDetails[voyage][0];
					var colorCode = statusColors.getColorCodeFromLabels(highestPriorityStatus.voyageDetail.portStatus, $listsCache.ScheduleDashboardLabelConfiguration);
					highestPriorityStatus.voyageDetail.portStatus.color = colorCode;
					highestPriorityStatus.voyageDetail.portStatus.fontColor = getContrastYIQ(colorCode);
				}
				return highestPriorityStatus.voyageDetail.portStatus;
		    }

	        ctrl.addVoyageToContractPlanning = function(voyageStop) {
	            $rootScope.scheduleDashboardVesselVoyages = [ctrl.groupedVoyagesDetails[voyageStop][0]];
	            localStorage.setItem('scheduleDashboardVesselVoyages', JSON.stringify($rootScope.scheduleDashboardVesselVoyages));
	            // $rootScope.activeBreadcrumbFilters = [];
	            $('.contextmenu a.close').click();
	            window.open("/#/contract-planning/", "_blank");
	        }

			ctrl.$onInit = function() {
			};

			ctrl.canAddToContractPlanning = function(voyage) {
				if (moment(ctrl.groupedVoyagesDetails[voyage][0].voyageDetail.eta) > moment()) {
					return true;
				}
				return false;
			}

			function getContrastYIQ(hexcolor){
			    hexcolor = hexcolor.replace("#", "");
			    var r = parseInt(hexcolor.substr(0,2),16);
			    var g = parseInt(hexcolor.substr(2,2),16);
			    var b = parseInt(hexcolor.substr(4,2),16);
			    var yiq = ((r*299)+(g*587)+(b*114))/1000;
			    return (yiq >= 128) ? 'black' : 'white';
			}

	        ctrl.confirmCancelBunkerStrategy = function(bunkerPlan, vsVal) {
				$(".cancelStrategyModal").modal();
				$(".cancelStrategyModal").removeClass("hide");
				ctrl.cancelStrategyModalData = {};
				ctrl.cancelStrategyModalData.vesselName = vsVal.request.vesselName;
				ctrl.cancelStrategyModalData.portCode = vsVal.locationCode;
				ctrl.cancelStrategyModalData.eta = vsVal.eta;
				ctrl.cancelStrategyModalData.fuelType = bunkerPlan.productType;
				ctrl.cancelStrategyModalData.quantity = bunkerPlan.supplyQuantity;
				ctrl.cancelStrategyModalData.uom = bunkerPlan.supplyUomName;
				ctrl.cancelStrategyModalData.bunkerPlanId = bunkerPlan.id;
			}


	        ctrl.cancelStrategy = function(bunkerPlanId){
				var url = API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/cancelStrategy";
				payload = {
					payload : bunkerPlanId
				}
				var currentBunkerPlanId = bunkerPlanId;
	            $http.post(url, payload).then(function success(response) {
	                if (response.status == 200) {
	                	$state.reload();
	                } else {
	                    console.log("Error cancelStrategy");
	                }
	            });
	            $scope.cancelStrategyModalData = null;
			}
		}
	]	
);

angular.module('shiptech.components').component('timelineRightClickPopover', {
    templateUrl: 'pages/schedule-dashboard-timeline/views/right-click-popover-timeline.html',
    controller: 'timelineRightClickPopover',
    bindings: {
    	rightClickPopoverData : '<',
    }
});