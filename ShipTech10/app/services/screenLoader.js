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
    
        function isLoading() {
        	localStorage.setItem('lastOpenLoader', new Date().getTime());
            $('.screen-loader').show();
        }

        function finishLoading(){
            $('.screen-loader').hide();
        }


        return {
            showLoader: showLoader,
            hideLoader: hideLoader,
            isLoading: isLoading,
            finishLoading: finishLoading,
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
			"api/procurement/request/getQuantityAndStrategy",
			"api/claims/getQuantityShortage"
    	];
        $httpProvider.interceptors.push([
            "$q"/*, 'applicationInsightsService'*/, '$log', 'appInsightsInstance', '$rootScope',
            function ($q/*, applicationInsightsService*/, $log, appInsightsInstance, $rootScope) {

                function computePerformance(url) {
                    var deferredResult = $q.defer();

                    if (performance && performance.getEntriesByName && performance.clearResourceTimings) {
                        var perf = performance.getEntriesByName(url);

                        var durationMs = 0;
                        var networkMs = 0;
                        var sendMs = 0;
                        var receiveMs = 0;
                        var domProcessingMs = 0;

                        var performancePromises = [];

                        for (var i = 0; i < perf.length; i++) {
                            var perfItem = perf[i];

                            var defer = $q.defer();
                            performancePromises.push(defer);

                            durationMs += perfItem.duration;
                            networkMs += perfItem.connectEnd - perfItem.startTime;
                            sendMs += perfItem.responseStart - perfItem.requestStart;
                            receiveMs += perfItem.responseEnd - perfItem.responseStart;

                            if (setImmediate && performance.now) {
                                var startDom = performance.now;
                                setImmediate(function () {
                                    domProcessingMs = performance.now() - startDom;
                                    durationMs += domProcessingMs;

                                    defer.resolve();
                                });
                            }
                        }

                        performance.clearResourceTimings();

                        $q.all(performancePromises).then(function() {
                            deferredResult.resolve({
                                durationMs: durationMs,
                                networkMs: networkMs,
                                sendMs: sendMs,
                                receiveMs: receiveMs,
                                domProcessingMs: domProcessingMs
                            });
                        });
                    }

                    return deferredResult.promise;
                }

                return {
                    request: function name(request) {

                        request.trackAjaxTelemetryId = '|' + appInsightsInstance.context.telemetryTrace.traceID + '.' + Microsoft.ApplicationInsights.Util.newId();
                        request.tenantUrl = window.location.origin;
                        request.startPerformance = (performance && performance.now) ? performance.now() : 0;

                        request.headers['x-ms-request-root-id'] = appInsightsInstance.context.telemetryTrace.traceID;
                        request.headers['x-ms-request-id'] = request.trackAjaxTelemetryId;
                        
                    	routeCall = request.url;
						if(window.openedScreenLoaders <= 0 || typeof(window.openedScreenLoaders) == 'undefined') {
							window.screenLoaderStartTime = Date.now();
						}
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
						// applicationInsightsService.trackMetric('Requests in que on request', window.openedScreenLoaders, config);
                        return request;
                    },
                    response: function name(config) {

                        var request = config.config;
                        var responseCode = config.status;

                        computePerformance(request.url).then(function (ajaxPerformance) {
                            appInsightsInstance.dependencies.trackDependencyDataInternal({
                                    id: request.trackAjaxTelemetryId,
                                    name: request.method + ' ' + request.url,
                                    target: request.url,
                                    type: 'Ajax',
                                    duration: (performance && performance.now) ? (performance.now() - request.startPerformance) : 0,
                                    success: responseCode >= 200 && responseCode < 400,
                                    responseCode: responseCode,
                                    method: request.method,
                                    properties: {
                                        tenantUrl: request.tenantUrl
                                    }
                                },
                                ajaxPerformance,
                                {
                                    trace: {
                                        parentID: $rootScope.pageViewTelemetryId
                                    }
                                });
                        });

                        routeCall = config.config.url;

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
                                            appInsightsInstance.trackMetric({ name: 'Page data loading duration', average: Date.now() - window.screenLoaderStartTime }, window.location);
                                            //applicationInsightsService.trackMetric('Page data loading duration', Date.now() - window.screenLoaderStartTime, window.location);
                                        }
			                    	},50);
		                    	}
		                    	// console.log("response timeout:" + window.openedScreenLoaders);
	                    	// console.log("***** response:" + window.openedScreenLoaders);
                    	}
						// applicationInsightsService.trackMetric('Requests in que on response', window.openedScreenLoaders, config);
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
                                        appInsightsInstance.trackMetric({ name: 'Page data loading duration', average: Date.now() - window.screenLoaderStartTime }, window.location);
										//applicationInsightsService.trackMetric('Page data loading duration', Date.now() - window.screenLoaderStartTime, window.location);
                                    }
                                    appInsightsInstance.trackTrace({ message: 'Page data loaded with an exception' }, config);
                                    //applicationInsightsService.trackTraceMessage('Page data loaded with an exception', config);
                                },50)
	                    	}

	                    	var guidReference = config.data.Reference || config.data.reference;
	                    	$("#autoTestingGUIDerror").text(guidReference);

		                    // 	console.log("response timeout:" + window.openedScreenLoaders);
                    	}
                    	// console.log("***** response:" + window.openedScreenLoaders);
                    	// //console.log(config);
                        appInsightsInstance.appInsights.trackException({ message: 'Response error' }, config);
						//applicationInsightsService.trackException('Response error', config);
                        return false;
                    },                    
                };
            }
        ]);      
    }
]);
