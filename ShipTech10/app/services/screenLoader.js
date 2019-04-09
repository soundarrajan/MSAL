angular.module('shiptech').service('screenLoader', [
    function(){

        function showLoader() {
        	return;
        	// localStorage.setItem('lastOpenLoader', new Date().getTime());
            // $('.screen-loader').show();
        }

        function hideLoader(){
        	return;
            // $('.screen-loader').hide();
           
        }

		// clearInterval(loaderTiming);
       //  loaderTiming = setInterval(function(){
       //  	if (new Date().getTime() - localStorage.getItem('lastOpenLoader') > 6000) {
       //  		hideLoader();
       //  		// localStorage.removeItem('lastOpenLoader');
	    		// // clearInterval(loaderTiming);
       //  	}
       //  },1000)
    
        return {
            showLoader: showLoader,
            hideLoader: hideLoader,
        }

    }
]);


angular.module("shiptech").config([
    "$httpProvider",
    function($httpProvider) {

    	var routeExceptions = [
			"uib/template/typeahead/typeahead-match.html", 
			"uib/template/typeahead/typeahead-popup.html",
			"app-general-components/views/columnFiltersPopover.html",
			"api/invoice/totalConversion",
			"api/masters/uoms/convertQuantity",
			"api/masters/locations/listVesselSearch",
			"api/infrastructure/navbar/navbaridslist",
			"api/procurement/request/searchForPopup",
			"api/mail/templates/listByTypeAndProcess",
			"uib/template/typeahead/typeahead-popup.html",
			"mail/templates/listByTypeAndProcess",
			"api/masters/companies/download",
			"api/recon/invoicecost",
			"api/recon/invoiceproduct",
			"api/invoice/updateTreasuryInfo",
			"api/procurement/request/getQuantityAverage",
    	];

        $httpProvider.interceptors.push([
            "$q",
            function($q) {
                return {
                    request: function name(request) {
                    	routeCall = request.url;
                    	if (request.url.indexOf("/api/") != -1) {
	                    	routeCall = 'api/' + request.url.split("/api/")[1];
                    	}
                    	if (routeCall.indexOf('invoice/list') != -1 ) {
                    		// debugger;
                    	}
                    	if (routeExceptions.indexOf(routeCall) == -1) {
	                    	// console.log("screenLoader OPEN:" + routeCall);
	                    	// console.log("***** request:" + window.openedScreenLoaders + "  url : " + routeCall);
	                    	$('.screen-loader').fadeIn(200);
	                    	$('clc-table-list tbody').css("transition", "0.3s");
	                    	$('clc-table-list tbody').css("opacity", 0);
	                    	if (typeof(window.openedScreenLoaders) == 'undefined') {
	                    		window.openedScreenLoaders = 0;
	                    	}	
	                    	window.openedScreenLoaders += 1;
                    	}
                        return request;
                    },
                    response: function name(config) {
                    	routeCall = config.config.url
                    	if (config.config.url.indexOf("/api/") != -1) {
	                    	routeCall = 'api/' + config.config.url.split("/api/")[1];
                    	}
                        if (routeExceptions.indexOf(routeCall) == -1) {
	                    	window.openedScreenLoaders -= 1;
		                    	if (window.openedScreenLoaders <= 0) {
		                    		console.log("**** set timeout for loader");
			                    	setTimeout(function(){
			                    		// console.log("***** enter timeout for loader");
				                    	if (window.openedScreenLoaders <= 0) {
					                    	// console.log("screenLoader CLOSE:" + routeCall);
					                    	$('.screen-loader').fadeOut(200);
					                    	$('clc-table-list tbody').css("opacity", 1);
				                    	}
			                    	},50)
		                    	}
		                    	// console.log("response timeout:" + window.openedScreenLoaders);
	                    	// console.log("***** response:" + window.openedScreenLoaders);
                    	}
                    	// //console.log(config);
                        return config;
                    },
                    responseError: function name(config) {
                    	routeCall = config.config.url
                    	if (config.config.url.indexOf("/api/") != -1) {
	                    	routeCall = 'api/' + config.config.url.split("/api/")[1];
                    	}
                    	if (routeExceptions.indexOf(routeCall) == -1) {
	                    	window.openedScreenLoaders -= 1;
                    		if (config.data.ErrorMessage && config.status != 200) {
                    			errorText = config.data.ErrorMessage;
                    			if (config.data.reference) {
	                    			errorText += ' - ' + config.data.reference;
                    			}
                    			if (config.data.Reference) {
	                    			errorText += ' - ' + config.data.Reference;
                    			}                    			
                    			toastr.error(errorText);
                    		} else if (config.data.message && config.status != 200) {
                    			errorText = config.data.message;
                    			if (config.data.reference) {
	                    			errorText += ' - ' + config.data.reference;
                    			}
                    			if (config.data.Reference) {
	                    			errorText += ' - ' + config.data.Reference;
                    			}                      			
                    			toastr.error(errorText);
                    		} else if (config.data.errorMessage && config.status != 200) {
                    			errorText = config.data.errorMessage;
                    			if (config.data.reference) {
	                    			errorText += ' - ' + config.data.reference;
                    			}
                    			if (config.data.Reference) {
	                    			errorText += ' - ' + config.data.Reference;
                    			}                      			
                    			toastr.error(errorText);
                    		} else {
                    			if (config.status == "401") {
                    				toastr.error('You do not have authorization to perform this action.');
                    			} else {
	                    			toastr.error("An error has occured");
                    			}
                    		}
	                    	if (window.openedScreenLoaders <= 0) {
								setTimeout(function(){
			                    	if (window.openedScreenLoaders <= 0) {
										$('.screen-loader').fadeOut(200);
										$('clc-table-list tbody').css("opacity", 1);
			                    	}
								},50)
	                    	}

	                    	var guidReference = config.data.Reference || config.data.reference;
	                    	$("#autoTestingGUIDerror").text(guidReference);

		                    // 	console.log("response timeout:" + window.openedScreenLoaders);
                    	}
                    	// console.log("***** response:" + window.openedScreenLoaders);
                    	// //console.log(config);
                        return false;
                    },                    
                };
            }
        ]);      
    }
]);
