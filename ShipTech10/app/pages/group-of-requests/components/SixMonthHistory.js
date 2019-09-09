angular.module('shiptech.components')
    .controller('SixMonthHistory', ['$scope', '$element', '$attrs', '$timeout', 'groupOfRequestsModel', 'MOCKUP_MAP', '$state', 'tenantService', '$tenantSettings',  
        function($scope, $element, $attrs, $timeout, groupOfRequestsModel, MOCKUP_MAP, $state, tenantService, $tenantSettings) {

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

			ctrl.$onInit = function() {
				console.log(ctrl.sixMonthPayload);
				ctrl.requestGroupId = ctrl.sixMonthPayload.requestGroupId;
				ctrl.sellerCounterpartyId = ctrl.sixMonthPayload.sellerCounterpartyId;
				ctrl.physicalSupplierCounterpartyId = ctrl.sixMonthPayload.physicalSupplierCounterpartyId;
				ctrl.locationIds = [ctrl.sixMonthPayload.locationIds].join();
				if (ctrl.sixMonthHistoryFor.name == "Seller") {
					ctrl.physicalSupplierCounterpartyId = null;
				} else {
					ctrl.sellerCounterpartyId = null;
				}
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
				
			}

			ctrl.getSixMonthHistoryData = function(payload, callback) {
                groupOfRequestsModel.energy6MonthHistory(payload).then(function (data) {
					ctrl.sixMonthsHistoryData = data.payload;
                	if (callback) {
                		callback();
                	}
                });	            
			}

		}
	]	
);

angular.module('shiptech.components').component('sixMonthsHistory', {
    templateUrl: 'components/blade/templates/gor-smHistory.html',
    controller: 'SixMonthHistory',
    bindings: {
    	sixMonthPayload : '<',
    	sixMonthHistoryFor : '<',
    }
});