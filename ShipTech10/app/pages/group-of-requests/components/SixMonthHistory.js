angular.module('shiptech.components')
    .controller('SixMonthHistory', ['$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings', '$listsCache', 
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings, $listsCache) {

	        var ctrl = this;
	        ctrl.listsCache = $listsCache;
	        ctrl.selectedLocations = [];
	        tenantService.tenantSettings.then(function (settings) {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
	            ctrl.quantityPrecision = settings.payload.defaultValues.quantityPrecision;
	        });


	        ctrl.formatDate = function(date) {
    	        dateFormat = $tenantSettings.tenantFormats.dateFormat.name;
	            var hasDayOfWeek = false;
                if (dateFormat.startsWith("DDD ")) {
                    hasDayOfWeek = true
                    dateFormat = dateFormat.split("DDD ")[1];
                }
		        window.tenantFormatsDateFormat = dateFormat;
		        dateFormat = dateFormat.replace(/d/g, "D").replace(/y/g, "Y").split(' ')[0];


		        if (date) {
		        	if (hasDayOfWeek) {
						return moment.utc(date).format("ddd") + " " + moment.utc(date).format(dateFormat) 
		        	} else {
			            return moment.utc(date).format(dateFormat);
		        	}
		        }
	        } 

		    ctrl.$onChanges = function (changes) {
		    	if (!changes.activeProduct) {
		    		// ctrl.sixMonthsHistoryData = null;
		    		// ctrl.computedTableHeight = 0;
		    		return;
		    	}
		    	if (!changes.activeProduct.currentValue) {
		    		// ctrl.sixMonthsHistoryData = null;
		    		// ctrl.computedTableHeight = 0;
		    		return;
		    	}
		    	console.log(changes.activeProduct.currentValue);
		    	if (changes.getGroupData) {
		    		ctrl.getGroupData = changes.getGroupData.currentValue
		    	}
				ctrl.requestOfferId = changes.activeProduct.currentValue.requestOfferId

				ctrl.saveAverage = false;
				specParameters = ["ash", "density", "sulphur", "viscosity", "water"];
				$.each(specParameters, function(k,v) {
					if (changes.activeProduct.currentValue.energyParameterValues[v].specValue == null) {
						ctrl.saveAverage = true;
					}
				})

				ctrl.fillMedianSixMonth = null;

				defaultLocation = _.find(ctrl.listsCache.Location, function(o) { return o.id == ctrl.sixMonthPayload.locationIds; });
				ctrl.selectedLocations = [defaultLocation];
				

				ctrl.enSixMhReferenceDate = ctrl.enSixMhReferenceDate;
				ctrl.requestGroupId = ctrl.sixMonthPayload.requestGroupId;
				ctrl.sellerCounterpartyId = ctrl.sixMonthPayload.sellerCounterpartyId;
				ctrl.physicalSupplierCounterpartyId = ctrl.sixMonthPayload.physicalSupplierCounterpartyId;
				ctrl.locationIds = [ctrl.sixMonthPayload.locationIds].join();
				if (ctrl.sixMonthHistoryFor.name == "Seller") {
					ctrl.physicalSupplierCounterpartyId = null;
				} else {
					// if (ctrl.physicalSupplierCounterpartyId != 'null' && ctrl.physicalSupplierCounterpartyId) {
						ctrl.sellerCounterpartyId = null;
					// }
				}		    	
		    	ctrl.activeProduct = changes.activeProduct.currentValue.product.id;
		    	ctrl.quotedProduct = changes.activeProduct.currentValue.energyParameterValues.quotedProductId;
		    	if (ctrl.quotedProduct) {
			    	ctrl.activeProduct = ctrl.quotedProduct;
		    	}
		    	ctrl.activeProductRequestProductId = changes.activeProduct.currentValue.id;
	            ctrl.sixMonthPayloadSent = {
	                "Filters": [
		                {
		                	"ColumnName":"SellerCounterpartyId",
		                	"Value":ctrl.sellerCounterpartyId
		                },
		                {
		                	"ColumnName":"PhysicalSupplierCounterpartyId",
		                	"Value":ctrl.physicalSupplierCounterpartyId
		                },
		                {
		                	"ColumnName":"RequestGroupId",
		                	"Value":ctrl.requestGroupId
		                },
		                {
		                	"ColumnName":"ProductId",
		                	"Value":ctrl.activeProduct
		                },
		                {
		                	"ColumnName":"RequestProductId",
		                	"Value":ctrl.activeProductRequestProductId
		                },
		                {
		                	"ColumnName":"LocationIds",
		                	"Value":ctrl.locationIds
		                }	                
	                ],
	                "Pagination": {
	                    "Skip": 0,
	                    "Take": 9999
	                },
	                "SearchText": null
	            }				
				ctrl.getSixMonthHistoryData(ctrl.sixMonthPayloadSent, false, function(response){
					console.log(response)
					ctrl.computeTableHeight();
					ctrl.countSelectedItems();
					// ctrl.onSixMonthsUpdate({results : ctrl.average6monthSelected});
				})		    	
		    };

			ctrl.$onInit = function() {
				console.log(ctrl.sixMonthPayload);
				console.log(ctrl.activeProduct);
				ctrl.enSixMhReferenceDate = ctrl.enSixMhReferenceDate;
				ctrl.requestGroupId = ctrl.sixMonthPayload.requestGroupId;
				ctrl.sellerCounterpartyId = ctrl.sixMonthPayload.sellerCounterpartyId;
				ctrl.physicalSupplierCounterpartyId = ctrl.sixMonthPayload.physicalSupplierCounterpartyId;
				ctrl.locationIds = [ctrl.sixMonthPayload.locationIds].join();
				if (ctrl.sixMonthHistoryFor.name == "Seller") {
					ctrl.physicalSupplierCounterpartyId = null;
				} else {
					ctrl.sellerCounterpartyId = null;
				}
				
			}

			ctrl.getSixMonthHistoryData = function(payload, ignoreGetSavedLocations, callback) {
				ctrl.get6MHSavedLocationsByRequestProductId(ctrl.activeProductRequestProductId, function(response) {
					if (!ignoreGetSavedLocations) {
						if (response) {
							$.each(payload.Filters, function(k,v){
								if (v.ColumnName == "LocationIds") {
									v.Value = response
								}
							})
							ctrl.selectedLocations = [];
							$.each(response.split(","), function(k,v){
								locationObj = _.find(ctrl.listsCache.Location, function(o) { return o.id == v; });
								ctrl.selectedLocations.push(locationObj);
							})
						}
					}	
	                groupOfRequestsModel.energy6MonthHistory(payload).then(function (data) {
						var nullSelections = 0;
						$.each(data.payload, function(k,v){
							if (v.isSelected == null) {
								nullSelections++;
							}
						})
						if (typeof(nullSelections) != "undefined") {
							if (nullSelections == data.payload.length) {
								_.map(data.payload, function(el){
									if (el.isSelected == null) {
										el.isSelected = true;
										return true;
									}
								});
							}
						}
						$timeout(function(){
							ctrl.sixMonthsHistoryData = data.payload;
							ctrl.computeTableHeight();
		                	if (callback) {
		                		callback();
		                	}
						},100)
	                });	            
				})
			}

			ctrl.get6MHSavedLocationsByRequestProductId = function(requestProductId, callback) {
                groupOfRequestsModel.get6MHSavedLocationsByRequestProductId(requestProductId).then(function (data) {
                	console.log(data.payload);
                	if (callback) {
                		callback(data.payload);
                	}
                });	            
			}

			ctrl.reassignEnergy6MonthReferenceDate = function() {
				payload = {
	                "Filters": [
		                {
		                	"ColumnName":"En6MHReferenceDate",
		                	"Value":ctrl.enSixMhReferenceDate
		                },
		                {
		                	"ColumnName":"RequestGroupId",
		                	"Value":ctrl.requestGroupId
		                }	                
	                ],
	                "Pagination": {
	                    "Skip": 0,
	                    "Take": 9999
	                },
	                "SearchText": null
	            }					 
                groupOfRequestsModel.reassignEnergy6MonthReferenceDate(payload).then(function (data) {
                	console.log(data);
                });	  
			}

			ctrl.calculate6MHistoryAverage = function() {
				var count = 0;
				var sum = 0;
				var median = 0;
				$.each(ctrl.sixMonthsHistoryData, function(k,v){
					v.requestProductId = ctrl.activeProductRequestProductId;
					v.requestOfferId = ctrl.requestOfferId;
					v.saveAverage = ctrl.saveAverage;
					if (v.isSelected) {
						sum += parseFloat(v.netSpecificEnergyValue);
						count++;
					}
				})
				median = sum / count;
                ctrl.onSixMonthsUpdate({results : false});
                payload = ctrl.sixMonthsHistoryData;

            	$.each($(".months_history .ng-dirty"), function(){
            		$(this).removeClass("ng-dirty");
            	})
                groupOfRequestsModel.updateEnergy6MonthHistory(payload).then(function (data) {
                	ctrl.onSixMonthsUpdate({results : ctrl.average6monthSelected});
					ctrl.fillMedianSixMonth = true;
                	console.log(data);
                });					
				console.log(median);
			}

			ctrl.countSelectedItems = function() {
				var count = 0;
				var sum = 0;
				var median = 0;				
				$.each(ctrl.sixMonthsHistoryData, function(k,v){
					if (v.isSelected) {
						sum += parseFloat(v.netSpecificEnergyValue);
						count++;
					}
				})
				median = sum / count;
				ctrl.selectedItems = {
					"count": count,
					"total" : ctrl.sixMonthsHistoryData.length
				}

				ctrl.average6monthSelected = parseFloat(median).toFixed(2);
				if (isNaN(median)) {
					ctrl.average6monthSelected = "-";
				}
			}

			ctrl.computeTableHeight = function() {
				var maxRowsToShow = 15; 
				if (ctrl.sixMonthsHistoryData.length > maxRowsToShow) {
					ctrl.computedTableHeight = parseFloat(maxRowsToShow * 40 + 20) + "px;"
				} else {
					ctrl.computedTableHeight = parseFloat(ctrl.sixMonthsHistoryData.length * 40 + 20) + "px;"
				}
			}

			ctrl.addLocationToHistory = function(location) {
				var locationAdded = false
				locationAdded = _.find(ctrl.selectedLocations, function(o) { return o.id == location.id; });
				ctrl.sixMonthLocationSelector = null;
				if (locationAdded) {
					toastr.error("Location already selected");
					return;
				} 
				ctrl.selectedLocations.push(location);
				var selectedLocationsIds = []
				$.each(ctrl.selectedLocations, function(k,v){
					selectedLocationsIds.push(v.id);
				})
				$.each(ctrl.sixMonthPayloadSent.Filters, function(k,v){
					if (v.ColumnName == "LocationIds") {
						v.Value = selectedLocationsIds.join();
					}
				})
				ctrl.getSixMonthHistoryData(ctrl.sixMonthPayloadSent, true, function(response){
					console.log(response)
					ctrl.computeTableHeight();
					ctrl.countSelectedItems();
				})
			}
			ctrl.removeLocationFromHistory = function(index) {
				if (ctrl.selectedLocations.length == 1) {
					toastr.error("At least one location should be selected");
					return;
				}
				ctrl.selectedLocations.splice(index, 1);
				var selectedLocationsIds = []
				$.each(ctrl.selectedLocations, function(k,v){
					selectedLocationsIds.push(v.id);
				})
				$.each(ctrl.sixMonthPayloadSent.Filters, function(k,v){
					if (v.ColumnName == "LocationIds") {
						v.Value = selectedLocationsIds.join();
					}
				})
				ctrl.getSixMonthHistoryData(ctrl.sixMonthPayloadSent, true, function(response){
					console.log(response)
					ctrl.computeTableHeight();
					ctrl.countSelectedItems();
				})
			}			



			jQuery(document).ready(function(){
				$(".custom-hardcoded-table-wrapper .tablebody").on("scroll", function(){
					hscrollOffset = $(this).offset().left - $(this).find("table").offset().left;
					bodyOffset = $(this).find("table").offset().left;

					console.log(hscrollOffset, bodyOffset);

					$(".custom-hardcoded-table-wrapper .tableheader").scrollLeft(hscrollOffset)
				})
			})



		}
	]	
);

angular.module('shiptech.components').component('sixMonthsHistory', {
    templateUrl: 'components/blade/templates/gor-smHistory.html',
    controller: 'SixMonthHistory',
    bindings: {
    	activeProduct : '<',
    	sixMonthPayload : '<',
    	enSixMhReferenceDate : '<',
    	sixMonthHistoryFor : '<',
    	getGroupData : '<',
    	onSixMonthsUpdate : '&',
    }
});
