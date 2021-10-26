angular.module('shiptech').service('screenLoader', [
    function() {
        function showLoader() {
            return;
            // localStorage.setItem('lastOpenLoader', new Date().getTime());
            // $('.screen-loader').show();
        }

        function hideLoader() {
            return;
            // $('.screen-loader').hide();
        }

        // clearInterval(loaderTiming);
        //  loaderTiming = setInterval(function(){
        //      if (new Date().getTime() - localStorage.getItem('lastOpenLoader') > 6000) {
        //          hideLoader();
        //          // localStorage.removeItem('lastOpenLoader');
                // // clearInterval(loaderTiming);
        //      }
        //  },1000)

        function isLoading() {
            localStorage.setItem('lastOpenLoader', new Date().getTime());
            $('.screen-loader').show();
        }

        function finishLoading() {
            $('.screen-loader').hide();
        }


        return {
            showLoader: showLoader,
            hideLoader: hideLoader,
            isLoading: isLoading,
            finishLoading: finishLoading,
        };
    }
]);

angular.module('shiptech').config([
    '$httpProvider',
    function($httpProvider) {
        let routeExceptions = [
            'uib/template/typeahead/typeahead-match.html',
            'uib/template/typeahead/typeahead-popup.html',
            'pages/schedule-dashboard-timeline/views/right-click-popover-timeline.html',
            'app-general-components/views/columnFiltersPopover.html',
            'api/invoice/totalConversion',
            'api/masters/uoms/convertQuantity',
            'api/masters/locations/listVesselSearch',
            'api/infrastructure/navbar/navbaridslist',
            'api/procurement/request/searchForPopup',
            'api/mail/templates/listByTypeAndProcess',
            'uib/template/typeahead/typeahead-popup.html',
            'api/procurement/request/bestContract',
            'api/masters/specGroups/getByProduct',
            'mail/templates/listByTypeAndProcess',
            'api/masters/companies/download',
            'api/recon/invoicecost',
            'api/recon/invoiceproduct',
            'api/invoice/updateTreasuryInfo',
            'api/masters/locations/getForRequest',
            'api/masters/vessels/getForRequest',
            'api/masters/specGroups/getSpecGroupByProductAndVessel',
            'api/procurement/request/getDefaultBuyer',
            'api/procurement/request/requeststatuseslist',
            'api/admin/user/list',
            'api/masters/listconfigurations/get',
            'api/infrastructure/screenlayout/get',
            'api/infrastructure/navbar/navbaridslist',
            'api/masters/agreementType/individualLists',
            'api/mail/templates/listByTransactionType',
            'api/admin/user/getVesselOperators',
            'api/procurement/request/getDefaultBuyer',
            'api/procurement/request/getQuantityAverage',
            'api/procurement/request/getQuantityAndStrategy',
            'api/infrastructure/reports/getOperationalReportParameters',
            'api/claims/getQuantityShortage',
            'api/procurement/request/isAuthorizedForReportsTab',
            'api/masters/exchangeRates/convert',
            'api/claims/getDeliveryLookup',
            'api/claims/getLabResultLookup',
            'api/claims/getClaimsListForOrder',
            'api/claims/getProductDropdown',
            'api/procurement/rfq/isAuthorizedForReportsTab'
        ];
        $httpProvider.interceptors.push([
            '$q'/* , 'applicationInsightsService'*/, '$log', 'appInsightsInstance', '$rootScope',
            function($q/* , applicationInsightsService*/, $log, appInsightsInstance, $rootScope) {      
                function computePerformance(url) {
                    let deferredResult = $q.defer();

                    if (performance && performance.getEntriesByName && performance.clearResourceTimings) {
                        let perf = performance.getEntriesByName(url);

                        let durationMs = 0;
                        let networkMs = 0;
                        let sendMs = 0;
                        let receiveMs = 0;
                        let domProcessingMs = 0;

                        let performancePromises = [];

                        for (let i = 0; i < perf.length; i++) {
                            let perfItem = perf[i];

                            var defer = $q.defer();
                            performancePromises.push(defer);

                            durationMs = durationMs + perfItem.duration;
                            networkMs = networkMs + (perfItem.connectEnd - perfItem.startTime);
                            sendMs = sendMs + (perfItem.responseStart - perfItem.requestStart);
                            receiveMs = receiveMs + (perfItem.responseEnd - perfItem.responseStart);

                            if (setImmediate && performance.now) {
                                var startDom = performance.now;
                                setImmediate(() => {
                                    domProcessingMs = performance.now() - startDom;
                                    durationMs = durationMs + domProcessingMs;

                                    defer.resolve();
                                });
                            }
                        }

                        performance.clearResourceTimings();

                        $q.all(performancePromises).then(() => {
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


                function loaderIsOpen() {
                    return $('.screen-loader').css('display') != 'none';
                }

                return {
                    request: function name(request) {
                        if (appInsightsInstance) {
                            request.trackAjaxTelemetryId = `|${ appInsightsInstance.context.telemetryTrace.traceID }.${ Microsoft.ApplicationInsights.Util.newId()}`;
                            request.tenantUrl = window.location.origin;
                            request.startPerformance = performance && performance.now ? performance.now() : 0;

                            request.headers['x-ms-request-root-id'] = appInsightsInstance.context.telemetryTrace.traceID;
                            request.headers['x-ms-request-id'] = request.trackAjaxTelemetryId;
                        }

                        var routeCall = request.url;

                        if (request.url.indexOf('/api/') != -1) {
                            routeCall = `api/${ request.url.split('/api/')[1]}`;
                        }


                        if (routeCall.indexOf('invoice/list') != -1) {
                            // debugger;
                        }
                        if (routeExceptions.indexOf(routeCall) == -1) {

                            /* APP INSIGHTS LOGGER Start Timer*/
                            if (!loaderIsOpen()) {
                                window.firstApiCallStartTime = Date.now();
                                console.log('FIRST API CALL START TIME!!!');
                                console.log('First Start : ==============: ', window.firstApiCallStartTime);
                                $rootScope.pageViewTelemetryId = Microsoft.ApplicationInsights.Util.generateW3CId();
                                if (appInsightsInstance) {
                                    appInsightsInstance.trackPageView({
                                        id: $rootScope.pageViewTelemetryId,
                                        name: window.actionLevel ? window.actionLevel + ' ' + window.location.href : window.location.href,
                                        properties: {
                                            tenantUrl: window.location.origin
                                        }
                                    });
                                }
                                appInsightsInstance.startTrackEvent(window.actionLevel ? window.actionLevel + ' ' + window.location.href : window.location.href);
                            }

                            /* END APP INSIGHTS LOGGER Start Timer*/

                            $('.screen-loader').fadeIn(200);
                            $('clc-table-list tbody').css('transition', '0.3s');
                            $('clc-table-list tbody').css('opacity', 0);
                            if (typeof window.openedScreenLoaders == 'undefined') {
                                window.openedScreenLoaders = 0;
                            }
                            window.openedScreenLoaders = window.openedScreenLoaders + 1;
                        }
                        // applicationInsightsService.trackMetric('Requests in que on request', window.openedScreenLoaders, config);
                        return request;
                    },
                    response: function name(config) {
                        let request = config.config;
                        let responseCode = config.status;

                        if (appInsightsInstance) {
                            computePerformance(request.url).then((ajaxPerformance) => {
                                appInsightsInstance.dependencies.trackDependencyDataInternal({
                                    id: request.trackAjaxTelemetryId,
                                    name: `${request.method } ${ request.url}`,
                                    target: request.url,
                                    type: 'Ajax',
                                    duration: performance && performance.now ? performance.now() - request.startPerformance : 0,
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
                        }


                        var routeCall = config.config.url;

                        if (config.config.url.indexOf('/api/') != -1) {
                            routeCall = `api/${ config.config.url.split('/api/')[1]}`;
                        }
                        if (routeExceptions.indexOf(routeCall) == -1) {
                        	console.log("loader*****************", routeCall);
                            /* APP INSIGHTS LOGGER*/
                            if (typeof window.intervalLoaderWatch == 'undefined' || !window.intervalLoaderWatch) {
                                window.intervalLoaderWatch = setInterval(() => {
                                    if (!loaderIsOpen()) {
                                        console.log(window.actionLevel);
                                        console.log("TIME AT ACTION LEVEL!")
                                        console.log('Last End: ==============: ', Date.now() - window.firstApiCallStartTime);
                                        if (appInsightsInstance) {
                                            if ($rootScope.user) {
                                                appInsightsInstance.context.user.id = '{id: ' + $rootScope.user.id  + '; name: ' + $rootScope.user.name + ' }';
                                                appInsightsInstance.setAuthenticatedUserContext($rootScope.user.name);
                                            }
                                            appInsightsInstance.trackMetric({ name:  window.actionLevel ? window.actionLevel + ' ' + window.location.href : window.location.href, average: Date.now() - window.firstApiCallStartTime}, window.location);
                                            appInsightsInstance.stopTrackEvent(window.actionLevel ? window.actionLevel + ' ' + window.location.href : window.location.href, { type: window.actionLevel ? 'Action Level' : 'PAGE LOAD TIME' });
                                            appInsightsInstance.trackPageView();
                                            appInsightsInstance.context.telemetryTrace.traceID = Microsoft.ApplicationInsights.Util.generateW3CId();

                                        }
                                        delete window.firstApiCallStartTime;
                                        delete window.actionLevel;
                                        clearInterval(window.intervalLoaderWatch);
                                        window.intervalLoaderWatch = false;
                                    }
                                }, 50);
                            }
                            if (!loaderIsOpen()) {
                                clearInterval(window.intervalLoaderWatch);
                                window.intervalLoaderWatch = false;
                                delete window.actionLevel;
                            }

                            /* END APP INSIGHTS LOGGER*/


                            window.openedScreenLoaders = window.openedScreenLoaders - 1;
                            setTimeout(() => {
                                if (window.openedScreenLoaders <= 0) {
                                    $('.screen-loader').fadeOut(200);
                                    $('clc-table-list tbody').css('opacity', 1);
                                    $rootScope.$broadcast('loaderHasClosed', true);
                                }
                            }, 50);
                        }
                        return config;
                    },
                    responseError: function name(config) {
                        var routeCall = config.config.url;
                        if (config.config.url.indexOf('/api/') != -1) {
                            routeCall = `api/${ config.config.url.split('/api/')[1]}`;
                        }
                        if (routeExceptions.indexOf(routeCall) == -1) {
                            window.openedScreenLoaders = window.openedScreenLoaders - 1;
                            var errorText;
                            if (config.data.ErrorMessage && config.status != 200) {
                                errorText = config.data.ErrorMessage;
                                if (config.data.reference) {
                                    errorText = `${errorText } - ${ config.data.reference}`;
                                }
                                if (config.data.Reference) {
                                    errorText = `${errorText } - ${ config.data.Reference}`;
                                }
                                toastr.error(errorText);
                            } else if (config.data.message && config.status != 200) {
                                errorText = config.data.message;
                                if (config.data.reference) {
                                    errorText = `${errorText } - ${ config.data.reference}`;
                                }
                                if (config.data.Reference) {
                                    errorText = `${errorText } - ${ config.data.Reference}`;
                                }
                                toastr.error(errorText);
                            } else if (config.data.errorMessage && config.status != 200) {
                                errorText = config.data.errorMessage;
                                if (config.data.reference) {
                                    errorText = `${errorText } - ${ config.data.reference}`;
                                }
                                if (config.data.Reference) {
                                    errorText = `${errorText } - ${ config.data.Reference}`;
                                }
                                toastr.error(errorText);
                            } else if (config.status == '401') {
                                    toastr.error('You do not have authorization to perform this action.');
                                } else {
                                    toastr.error('An error has occured');
                                }


                            /* APP INSIGHTS LOGGER*/
                            if (typeof window.intervalLoaderWatch == 'undefined' || !window.intervalLoaderWatch) {
                                window.intervalLoaderWatch = setInterval(() => {
                                    if (!loaderIsOpen()) {
                                        console.log('Last End on Error: ==============: ', Date.now() - window.firstApiCallStartTime);
                                        if (appInsightsInstance) {
                                            appInsightsInstance.trackMetric({ name: 'Page data loading duration', average: Date.now() - window.firstApiCallStartTime }, window.location);
                                            appInsightsInstance.context.telemetryTrace.traceID = Microsoft.ApplicationInsights.Util.generateW3CId();
                                        }
                                        delete window.firstApiCallStartTime;
                                        clearInterval(window.intervalLoaderWatch);
                                        window.intervalLoaderWatch = false;
                                    }
                                }, 50);
                            }
                            if (!loaderIsOpen()) {
                                clearInterval(window.intervalLoaderWatch);
                                window.intervalLoaderWatch = false;
                            }

                            /* END APP INSIGHTS LOGGER*/

                            if (window.openedScreenLoaders <= 0) {
                                setTimeout(() => {
                                    if (window.openedScreenLoaders <= 0) {
                                        $('.screen-loader').fadeOut(200);
                                        $('clc-table-list tbody').css('opacity', 1);
                                    }
                                    console.warn(`LOADER CLOSED ON ERROR: ${ window.location.href}`);
                                }, 50);
                            }

                            let guidReference = config.data.Reference || config.data.reference;
                            $('#autoTestingGUIDerror').text(guidReference);

                            //  console.log("response timeout:" + window.openedScreenLoaders);
                        }
                        // console.log("***** response:" + window.openedScreenLoaders);
                        // //console.log(config);

                        if (appInsightsInstance) {
                            delete window.actionLevel;
                            appInsightsInstance.appInsights.trackException({ message: 'Response error' }, config);
                        }
                        // applicationInsightsService.trackException('Response error', config);
                        return false;
                    },
                };
            }
        ]);
    }
]);
