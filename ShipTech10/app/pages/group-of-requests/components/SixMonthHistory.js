angular.module('shiptech.components')
    .controller('SixMonthHistory', ['$scope', '$rootScope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings',  
        function($scope, $rootScope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings) {

	        var ctrl = this;
	        tenantService.tenantSettings.then(function (settings) {
	            ctrl.numberPrecision = settings.payload.defaultValues;
	            ctrl.pricePrecision = settings.payload.defaultValues.pricePrecision;
	            ctrl.amountPrecision = settings.payload.defaultValues.amountPrecision;
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
		    	console.log(changes.activeProduct.currentValue);
				
				ctrl.fillMedianSixMonth = null;

				ctrl.enSixMhReferenceDate = ctrl.enSixMhReferenceDate;
				ctrl.requestGroupId = ctrl.sixMonthPayload.requestGroupId;
				ctrl.sellerCounterpartyId = ctrl.sixMonthPayload.sellerCounterpartyId;
				ctrl.sellerCounterpartyId = ctrl.sixMonthPayload.sellerCounterpartyId;
				ctrl.physicalSupplierCounterpartyId = ctrl.sixMonthPayload.physicalSupplierCounterpartyId;
				ctrl.locationIds = [ctrl.sixMonthPayload.locationIds].join();
				if (ctrl.sixMonthHistoryFor.name == "Seller") {
					ctrl.physicalSupplierCounterpartyId = null;
				} else {
					if (ctrl.physicalSupplierCounterpartyId != 'null' && ctrl.physicalSupplierCounterpartyId) {
						ctrl.sellerCounterpartyId = null;
					}
				}		    	
		    	ctrl.activeProduct = changes.activeProduct.currentValue;
	            payload = {
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
				ctrl.getSixMonthHistoryData(payload, function(response){
					console.log(response)
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

			ctrl.getSixMonthHistoryData = function(payload, callback) {
                groupOfRequestsModel.energy6MonthHistory(payload).then(function (data) {
					_.map(data.payload, function(el){
						if (el.isSelected == null) {
							el.isSelected = true;
							return true;
						}
					});
					ctrl.sixMonthsHistoryData = data.payload;
                	if (callback) {
                		callback();
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
					if (v.isSelected) {
						sum += parseFloat(v.netSpecificEnergyValue);
						count++;
					}
				})
				median = sum / count;
				ctrl.fillMedianSixMonth = median;
				console.log(median);
			}

			$rootScope.$on("energySpecParametersUpdated", function(ev, val){
				if (val) {
					payload = ctrl.sixMonthsHistoryData;
	                groupOfRequestsModel.updateEnergy6MonthHistory(payload).then(function (data) {
	                	console.log(data);
	                });	            
				}
			})

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
    	fillMedianSixMonth : '=',
    }
});