// Auth Module
angular
    .module("auth", ["ngRoute", "AdalAngular"])
    .config([
        "$routeProvider",
        "$httpProvider",
        "adalAuthenticationServiceProvider",
        "$locationProvider",
        function($routeProvide, $httpProvider, adalProvider, $locationProvider) {
            $locationProvider.hashPrefix("");
            adalProvider.init(appConfig.auth, $httpProvider);
        }
    ])
    .run([
        "$rootScope",
        "adalAuthenticationService",
        "$http",
        "$q",
        "$window",
        "$interval",
        function($rootScope, adalService, $http, $q, $window, $interval) {
            console.log(adalService);
            console.log("adal:application refresh");
            if (typeof adalService.userInfo.isAuthenticated == "boolean" && typeof adalService.userInfo.loginError == "string") {
                if (adalService.userInfo.loginError.length > 0) {
                    if (adalService.userInfo.loginError.indexOf("Nonce is not same as") < 0) {
                        window.location.reload();
                    }
                    AuthenticationContext.prototype._saveItem("adal.idtoken", "");
                }
                //if (adalService.userInfo.isAuthenticated != true)
                {
                }
            }
            $rootScope.$on("adal:notAuthorized", function(event, token) {
                console.log(event);
                adalService.login();
            });
            $rootScope.$on("adal:acquireTokenSuccess", function(event, token) {
                console.log(event);
                console.log("adal:error - " + AuthenticationContext.prototype._getItem("adal.login.error"));
                if (AuthenticationContext.prototype._getItem("adal.login.error").length > 0) {
                    AuthenticationContext.prototype._saveItem("adal.idtoken", "");
                }
            });
            $rootScope.$on("adal:loginSuccess", function(event, token) {
                console.log(event);
                console.log("adal:error - " + AuthenticationContext.prototype._getItem("adal.login.error"));
                AuthenticationContext.prototype._saveItem("adal_auth_errors", 0);
                getSData().then(bootstrapApplication);
            });
            $rootScope.$on("adal:acquireTokenFailure", handleAuthError);
            $rootScope.$on("adal:loginFailure", handleAuthError);
            $rootScope.$on("adal:stateMismatch", handleAuthError);
            $rootScope.$on("adal:errorResponse", handleAuthError);

            function handleAuthError(event, token) {
                // console.log(1213)
                // toastr.warning("Your session has expired. Please click this message to renew it!", "Session Expired", {
                //     "newestOnTop": true,
                //     "timeOut": "999999",
                //     "extendedTimeOut": "999999",
                //     "onclick": function() {
                //         window.location.reload()
                //     }
                // })
                // return
                console.log(event);
                console.log("adal:error - " + AuthenticationContext.prototype._getItem("adal.login.error"));
                adalErrors = AuthenticationContext.prototype._getItem("adal_auth_errors");
                if (adalErrors > 0) adalErrors++;
                else adalErrors = 1;
                AuthenticationContext.prototype._saveItem("adal_auth_errors", adalErrors);
                console.log("adal:auth errors: " + adalErrors);
                if (adalErrors > 3) {
                    AuthenticationContext.prototype._saveItem("adal.idtoken", "");
                    AuthenticationContext.prototype._saveItem("adal_auth_errors", 0);
                }
                try {
                    // console.log( $window)
                } catch (e) {
                    // statements
                    console.log(e);
                }
            }
            // $rootScope.$on('adal:acquireTokenFailure', function(event, token) {
            //     if (adalService.userInfo.isAuthenticated == false) {
            //         adalService.login();
            // if (localStorage.getItem("loggedOut")) {
            //     localStorage.removeItem("loggedOut");
            // }
            //     }
            // });
            if (adalService.userInfo.loginError == "Nonce is not same as undefined") {
                getSData().then(bootstrapApplication);
            } else {
                if (adalService.userInfo.isAuthenticated == false) {
                    if (window.location.hash.indexOf("#/id_token") > -1 || window.location.hash.indexOf("#id_token") > -1) {
                        // window.location.hash = '#';
                        // $window.location.href = '/';
                        // getSData().then(bootstrapApplication);
                        try {
                            if (typeof adalService.config.loginResource == "undefined") {
                                adalService.login();
                            } else {
                                adalService.acquireToken(adalService.config.loginResource);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        adalService.login();

                        // adalService.logOut();
                    }
                } else {
                    console.log(adalService.config);
                    adalService.acquireToken(adalService.config.loginResource);
                    getSData();
                }
            }
            AuthenticationContext.prototype._saveItem("adal.login.error", "");

            function getSData() {
                if (localStorage.getItem("loggedOut")) {
                    localStorage.removeItem("loggedOut");
                }
                var ts_promise = $http.post(appConfig.API.BASE_URL + "/Shiptech10.Api.Admin/api/admin/generalConfiguration/get", {
                    Payload: false
                });
                var lists_promise = $http.post(appConfig.API.BASE_URL + "/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists", {
                    Payload: false
                });
                var filters_columns = $http.post(appConfig.API.BASE_URL + "/Shiptech10.Api.Infrastructure/api/infrastructure/static/filters", {
                    Payload: false
                });
                return $q.all([ts_promise, lists_promise, filters_columns]).then(
                    function(response) {
                        if (response[0].status == 200) {
                            angular.module("shiptech").value("$tenantSettings", response[0].data.payload);
                        }
                        if (response[1].status == 200) {
                            var lists = new Object();
                            response[1].data.forEach(function(entry) {
                                lists[entry.name] = entry.items;
                            });
                            angular.module("shiptech").value("$listsCache", lists);
                            delete lists;
                        }
                        if (response[2].status == 200) {
                            angular.module("shiptech").value("$filtersData", response[2].data);
                        }
                        bootstrapApplication();
                    },
                    function(errorResponse) {
                        // debugger;
                        if (errorResponse.status == 401) {
                            console.log(errorResponse.statusText);
                            adalService.logOut();
                            if (!localStorage.getItem("loggedOut")) {
                                localStorage.setItem("loggedOut", true);
                            }
                            sessionStorage.clear();
                        } else {
                            console.log(errorResponse);
                            console.log("Async initialisation of tenant settings and cache lists failed!");
                        }
                    }
                );
            }
            // console.log(WebWorkerService);
            // WebWorkerService.test();
        }
    ]);
/**
 *  Main application module to hold the module
 */
angular
    .module("shiptech", [
        // 3rd party
        "ui.router",
        "ui.bootstrap",
        "ngResource",
        "pascalprecht.translate",
        "gridstack-angular",
        "ds.clock",
        "ngSanitize",
        "angular.filter",
        "ngRoute",
        "AdalAngular",
        // Specific modules
        "shiptech.models",
        "shiptech.templates",
        "shiptech.components",
        "shiptech.pages",
        "ngVis"
    ])
    .controller("appCtrl", [
        "$scope",
        "adalAuthenticationService",
        "$http",
        "$document",
        "screenLoader",
        function($scope, adalService, $http, $document, screenLoader) {
            toastr.options = {
                maxOpened: 1,
                timeOut: 4000,
                preventOpenDuplicates: true,
                preventDuplicates: true
            };
            toastr.subscribe(function(args){
                screenLoader.hideLoader();
            });
            $scope.pagetitle = "";
            $scope.pageClass = "";
            window.onerror = function(message, url, line) {
                console.log("error : " + message + " *** " + url + " *** " + line);
            };
            $scope.recordingStatus = "Enable screen capture";
            $scope.toggleRecording = function() {
                if ($scope.recordingStatus == "Stop screen recording") {
                    toastr.info("Saving recording...");
                    setTimeout(function() {
                        window.location.reload();
                    }, 3000);
                } else {
                    text =
                        '<!-- MouseStats:Begin --> <script type="text/javascript">var MouseStats_Commands=MouseStats_Commands?MouseStats_Commands:[]; (function(){function b(){if(void 0==document.getElementById("__mstrkscpt")){var a=document.createElement("script");a.type="text/javascript";a.id="__mstrkscpt";a.src=("https:"==document.location.protocol?"https://ssl":"http://www2")+".mousestats.com/js/5/7/5749710969322164449.js?"+Math.floor((new Date).getTime()/6E5);a.async=!0;a.defer=!0;(document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0]).appendChild(a)}}window.attachEvent?window.attachEvent("onload",b):window.addEventListener("load", b,!1);"complete"===document.readyState&&b()})(); </script> <!-- MouseStats:End -->';
                    $("body").append(text);
                    $scope.recordingStatus = "Stop screen recording";
                    if (adalService.userInfo) {
                        if (!adalService.userInfo.profile) return;
                        MouseStats_Commands.push(["identify", adalService.userInfo.profile.unique_name]);
                    }
                    // console.log(smartlook)
                }
            };
            state = null;

            var pageTitleMap = {};
            pageTitleMap["Contracts :: Edit "] = 'New Contract';
            pageTitleMap["Delivery Entity Edit"] = 'New Delivery';
            pageTitleMap["Dashboard"] = 'Schedule Dashboard';
            pageTitleMap["Labs Edit"] = 'New Labs Result';
            pageTitleMap["Transactions to be invoiced List"] = 'Transactions to be Invoiced List';
            // pageTitleMap["Admin Screen Entity Edit"] = 'Transactions to be Invoiced List';
          
            $scope.setPageTitle = function(title){
   
                if(pageTitleMap[title]){
                    $scope.pagetitle = pageTitleMap[title];
                }else{

                    if(title.indexOf("::") > -1){
                        $scope.pagetitle = title.split("::")[0];
                    }else{
                        $scope.pagetitle = title;
                    }
                }

                console.log($scope.pagetitle);
            }


            $scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {

                if (toParams.title) {
                    $scope.setPageTitle(toParams.title);
                } else {
                    $scope.setPageTitle(toParams.path[toParams.path.length - 1].label);
                }

                
                $scope.pageClass = $scope.pagetitle.toLowerCase().replace(/[^0-9a-zA-Z]/g, "");
                if (state != toState) {
                    updateLists();
                    state = toState;

                    // setTimeout(function() {
                    // QuickSidebar.init()
                    //     $.each($document.find(".input-group-addon"), function() {
                    //         if ($(this).attr("ng-click")) {
                    //             if (
                    //                 $(this)
                    //                     .attr("ng-click")
                    //                     .indexOf("triggerModal") > -1
                    //             ) {
                    //                 console.log(
                    //                     state.url.replace(/[0-9,\/,#/]/g, "").split(":")[0] +
                    //                         "/" +
                    //                         $(this)
                    //                             .attr("ng-click")
                    //                             .split(",")[1]
                    //                             .replace(/[\s,\/,'/]/g, "")
                    //                 );
                    //             }
                    //         }
                    //     });
                    // }, 800);
                }
            });

               $scope.$on("$changePageTitle", function(event, pageData){
           
                    if(pageData.title){
                        $scope.setPageTitle(pageData.title);
                    }
                })
            function updateLists() {
                angular.module("shiptech").value("$listsCache", null);
                $http
                    .post(appConfig.API.BASE_URL + "/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists", {
                        Payload: false
                    })
                    .then(
                        function successCallback(response) {
                            // this callback will be called asynchronously
                            // when the response is available
                            if (response.status == 200) {
                                var lists = new Object();
                                response.data.forEach(function(entry) {
                                    lists[entry.name] = entry.items;
                                });
                                angular.module("shiptech").value("$listsCache", lists);
                                delete lists;
                            }
                        },
                        function errorCallback(response) {
                            if (response.data.indexOf("Token") > -1) {
                                adalService.clearCache();
                                console.log(response);
                            }
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                        }
                    );
            }
            this.settings = {
                layoutPath: "assets/layouts/layout",
                layout: {
                    pageContentWhite: false
                }
            };
        }
    ]);
angular.module("shiptech").config([
    "$routeProvider",
    "$httpProvider",
    "adalAuthenticationServiceProvider",
    function($routeProvide, $httpProvider, adalProvider) {
        // var testDomains = [];
        //contstants not accessible in config method
        var VALIDATION_MESSAGES = appConfig.VALIDATION_MESSAGES;
        // if (window.localStorage.getItem('start')) {
        //     window.localStorage.removeItem('start')
        // }
        // window.localStorage.setItem('start', window.location.hash + '_' + Math.random());
        // callAscensys();
        $httpProvider.interceptors.push([
            "$q",
            function($q) {
                return {
                    request: function name(config) {
                        if (localStorage.getItem("loggedOut")) {
                            sessionStorage.clear();
                            location.reload();
                        }
                        return config;
                    },
                    responseError: function(response) {
                        if (!response.config) return;
                        if (response.config.url.indexOf("getByStrategyAndProduct") > 0 || response.config.url.indexOf("recon/invoicecost") > 0 || response.config.url.indexOf("powerbi") > 0 || response.config.url.indexOf("companies/download") > 0) return $q.reject(response);
                        if (response.data) {
                            response.data.ErrorCode ? (ErrorCode = response.data.ErrorCode) : (ErrorCode = response.data.errorCode);
                            response.data.ErrorMessage ? (ErrorMessage = response.data.ErrorMessage) : (ErrorMessage = response.data.errorMessage);
                            response.data.Reference ? (Reference = response.data.Reference) : (Reference = response.data.reference);
                            if (ErrorCode && ErrorMessage && Reference) {
                                toastr.error(ErrorCode + "<br/>" + ErrorMessage + "<br/>" + Reference);
                            } else {
                                if (response.status == 401) {
                                    toastr.error(VALIDATION_MESSAGES.UNAUTHORIZED);
                                } else {
                                    toastr.error(VALIDATION_MESSAGES.GENERAL_ERROR);
                                }
                            }
                        } else {
                            if (response.status == 401) {
                                toastr.error(VALIDATION_MESSAGES.UNAUTHORIZED);
                            } else {
                                toastr.error(VALIDATION_MESSAGES.GENERAL_ERROR);
                            }
                        }
                        return $q.reject(response);
                    }
                };
            }
        ]);
        // function callAscensys() {
        //     if (testDomains.indexOf(window.location.origin) > -1) {
        //         $.get("http://radupintilie.dev.ascensys.ro/speed_test/index.php", {
        //             'event': 'start',
        //             'event_id': window.localStorage.getItem('start')
        //         });
        //     }
        // }
        adalProvider.init(appConfig.auth, $httpProvider);
    }
]);

/* Setup Layout Part - Quick Sidebar */
angular.module("shiptech").controller("QuickSidebarController", [
    "$scope",
    "$state",
    "STATE",
    function($scope, $state, STATE) {
        // $scope.$on("$includeContentLoaded", function() {
        //     setTimeout(function() {
        //         QuickSidebar.init(); // init quick sidebar
        //     }, 2000);
        // });
        // console.log($state)
        $scope.state = $state;
       
        $scope.$on("$stateChangeStart", function() {
            QuickSidebar.hide();
            $("*").tooltip("destroy");
        });
        this.tab = 2;
        this.hideFilters = function() {
            return window.location.hash.indexOf("edit");
        };
        this.selectTab = function(setTab) {
            this.tab = setTab;
        };
        this.isSelected = function(checkTab) {
            return this.tab === checkTab;
        };
    }
]);

angular.module("shiptech").controller("BladeController", [
    "$scope",
    "$rootScope",
    "$state",
    function($scope, $rootScope, $state) {
        $scope.closeBlade = function() {
            $(".bladeEntity").removeClass("open");
            $("body").css("overflow-y", "auto");
            setTimeout(function() {
                $rootScope.bladeTemplateUrl = "";
            }, 500);
            if ($scope.bladeDataChanged) {
                $state.reload();
            }
        };
        $scope.$on("$stateChangeStart", function() {
            $bladeEntity.close();
        });
        $rootScope.$on("bladeDataChanged", function(event, data) {
            console.log();
            $scope.bladeDataChanged = data;
        });
    }
]);
$bladeEntity = {
    close: function() {
        $(".bladeEntity").removeClass("open");
        $("body").css("overflow-y", "initial");
        setTimeout(function() {
            if (typeof $rootScope != "undefined") {
                $rootScope.bladeTemplateUrl = "";
            }
        }, 500);
    },
    open: function(id) {
        if (id) {
            bladeEntity = $(".bladeEntity#" + id);
        } else {
            bladeEntity = $(".bladeEntity");
        }
        bladeEntity.addClass("open");
        $("body").css("overflow-y", "hidden");
    }
};
/**
 * Templates module
 */
angular.module("shiptech.templates", []);
/**
 * Components module
 */
angular.module("shiptech.components", []);
/**
 * Pages module
 */
angular.module("shiptech.pages", []);
/**
 * Models module
 */
angular.module("shiptech.models", []);
i = 0;

var hostName = window.location.hostname;
var config = "config/defaultConfig.js";
if (["localhost", "mail.24software.ro"].indexOf(hostName) < 0) {
    config = "config/" + hostName + ".js";
}
function bootstrapApplication() {
    if (i == 0) {
        // angular.element(document).ready(function() {
        angular.bootstrap(document, ["shiptech", "shiptech.app.alerts", "shiptech.app.rating", "shiptech.app.masters", "shiptech.app.admin", "shiptech.app.labs", "shiptech.app.delivery", "shiptech.app.claims", "shiptech.app.recon", "shiptech.app.invoice", "shiptech.app.contract"], {
            strictDi: true
        });
        // });
        i++;
    }
}

angular.element(document).ready(function() {
    loadScript(config, function() {
        angular
            .module("shiptech")
            .constant("tenantConfigs", appConfig.tenantConfigs)
            .constant("STATE", appConfig.STATE)
            .constant("VIEW_TYPES", appConfig.VIEW_TYPES)
            .constant("API", appConfig.API)
            .constant("SCREEN_LAYOUTS", appConfig.SCREEN_LAYOUTS)
            .constant("TIMESCALE", appConfig.TIMESCALE)
            .constant("CUSTOM_EVENTS", appConfig.CUSTOM_EVENTS)
            .constant("LOOKUP_TYPE", appConfig.LOOKUP_TYPE)
            .constant("LOOKUP_MAP", appConfig.LOOKUP_MAP)
            .constant("SCREEN_ACTIONS", appConfig.SCREEN_ACTIONS)
            .constant("IDS", appConfig.IDS)
            .constant("VALIDATION_MESSAGES", appConfig.VALIDATION_MESSAGES)
            .constant("ORDER_COMMANDS", appConfig.ORDER_COMMANDS)
            .constant("STATUS", appConfig.STATUS)
            .constant("COST_TYPE_IDS", appConfig.COST_TYPE_IDS)
            .constant("COMPONENT_TYPE_IDS", appConfig.COMPONENT_TYPE_IDS)
            .constant("SELLER_SORT_ORDER", appConfig.SELLER_SORT_ORDER)
            .constant("PRODUCT_STATUS_IDS", appConfig.PRODUCT_STATUS_IDS)
            .constant("EXPORT_FILETYPE", appConfig.EXPORT_FILETYPE)
            .constant("VALIDATION_STOP_TYPE_IDS", appConfig.VALIDATION_STOP_TYPE_IDS)
            .constant("EXPORT_FILETYPE_EXTENSION", appConfig.EXPORT_FILETYPE_EXTENSION)
            .constant("PACKAGES_CONFIGURATION", appConfig.PACKAGES_CONFIGURATION)
            .constant("EMAIL_TRANSACTION", appConfig.EMAIL_TRANSACTION);
        if (window.location.hash.indexOf("supplier-portal") > 0) {
            angular.module("shiptech").value("$tenantSettings", {});
            angular.module("shiptech").value("$listsCache", {});
            angular.module("shiptech").value("$filtersData", {});
            bootstrapApplication();
        } else {
            angular.bootstrap(auth, ["auth"], {
                strictDi: true
            });
        }
    });
});
