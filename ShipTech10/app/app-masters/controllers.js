/**
 * Master Controller
 */ APP_MASTERS.controller("Controller_Master", [
    "API",
    "$tenantSettings",
    "tenantService",
    "$scope",
    "$rootScope",
    "$sce",
    "$Api_Service",
    "Factory_Master",
    "$state",
    "$location",
    "$q",
    "$compile",
    "$timeout",
    "$interval",
    "$templateCache",
    "$listsCache",
    "$uibModal",
    "uibDateParser",
    "uiGridConstants",
    "$filter",
    "$http",
    "$window",
    "$controller",
    "payloadDataModel",
    "statusColors",
    "screenLoader",
    "$parse",
    function(API, $tenantSettings, tenantService, $scope, $rootScope, $sce, $Api_Service, Factory_Master, $state, $location, $q, $compile, $timeout, $interval, $templateCache, $listsCache, $uibModal, uibDateParser, uiGridConstants, $filter, $http, $window, $controller, payloadDataModel, statusColors, screenLoader, $parse) {
        var vm = this;
        if ($state.params.path) {
            vm.app_id = $state.params.path[0].uisref.split(".")[0];
        }
        if ($scope.screen) {
            vm.screen_id = $scope.screen;
        } else {
            vm.screen_id = $state.params.screen_id;
        }
        $scope.typeOf = function(argument) {
            return typeof argument;
        };
        $scope.copiedId = 0;
        $rootScope.$broadcast("editInstance", vm.editInstance);
        // APP SPECIFIC CONTROLLER INSERTION
        $controller("Controller_Datatables", {
            $scope: $scope
        }); //This works
        // $controller('Controller_General_Header', { $scope: $scope });
        if (vm.app_id == "alerts") {
            $controller("Controller_Alerts", {
                $scope: $scope
            });
        }
        if (vm.app_id == "invoices") {
            $controller("Controller_Invoice", {
                $scope: $scope
            });
        }
        if (vm.app_id == "delivery") {
            $controller("Controller_Delivery", {
                $scope: $scope
            });
        }
        if (vm.app_id == "admin") {
            $controller("Controller_Admin", {
                $scope: $scope
            });
        }
        if (vm.app_id == "contracts") {
            $controller("Controller_Contract", {
                $scope: $scope
            });
        }
        if (vm.app_id == "claims") {
            $controller("Controller_Claims", {
                $scope: $scope
            });
        }
        if (vm.app_id == "labs") {
            $controller("Controller_Labs", {
                $scope: $scope
            });
        }
        if (vm.app_id == "recon") {
            $controller("Controller_Recon", {
                $scope: $scope
            });
        }
        if (!vm.overrideInvalidDate) {
            vm.overrideInvalidDate = {}
        }

		// angular.element(document).ready(function () {
		// 	setTimeout(function(){
		// 		screenLoader.hideLoader();
		// 	},7000)		    
		// });

        // END APP SPECIFIC CONTROLLER INSERTION
        vm.entity_id = $state.params.entity_id;
        $rootScope.entity_id = $state.params.entity_id;
        vm.isDev = 0;
        vm.listsCache = $listsCache;
     
        vm.formValues = $rootScope.formValues;
        $scope.host = $location.$$host;
        $scope.changedFields = 0;
        $scope.submitedAction = false;
        $scope.submitedAcc = function(act) {
            $timeout(function() {
                if (act != "save_master_changes()") {
                    $scope.submitedAction = false;
                } else {
                    // $timeout(function() {
                    // $scope.submitedAction = true;
                    // }, 10);
                }
            }, 3500);
        };
        vm.adminConfiguration = {};
        $scope.getAdminConfiguration = function() {
            // console.log(1);
            if (!$rootScope.getAdminConfigurationCall) {
                // console.log("from Master");
                $rootScope.getAdminConfigurationCall = true;
                Factory_Master.get_master_entity(1, "configuration", "admin", function(callback2) {
                    if (callback2) {
                    	$rootScope.$broadcast("adminConfiguration", callback2)
                        $rootScope.getAdminConfigurationCall = false;
                        // console.log("from Master done");
                        vm.adminConfiguration = callback2;
                        $rootScope.adminConfiguration = callback2;
                        $scope.getAdminConfigurationGH(callback2);
                    }
                });
            }
        };
        if (!vm.entity_id) {
            $scope.isEdit = false;
            vm.isEdit = false;
            $scope.isCreate = true;
        } else {
            $scope.isEdit = true;
            vm.isEdit = true;
            $scope.isCreate = false;
        }

      vm.getColorCodeFromLabels = function(statusObj) {
        return statusColors.getColorCodeFromLabels(statusObj, vm.listsCache.ScheduleDashboardLabelConfiguration);
      }

        vm.getStatusColor = function(statusName, cell) {
            var statusColor = statusColors.getDefaultColor();
            if(statusName) {
                statusColor = statusColors.getColorCode(statusName);
            }
            if(cell && cell.displayName) {
                statusColor = statusColors.getColorCode(cell.displayName);
                $.each(vm.listsCache.ScheduleDashboardLabelConfiguration, function(k, v) {
                    if(cell.id === v.id && cell.transactionTypeId === v.transactionTypeId) {
                        statusColor = v.code;
                        return false;
                    }
                });
            }
            return statusColor;
        }
        $scope.$on("visible_sections", function(event, object) {
            // console.log(12)
            $scope.visible_sections = object;
            if (vm.app_id == "contracts") {
                if ($rootScope.formValues.productQuantityRequired) {
                    vm.equalizeColumnsHeightGrouped(".group_ContractSummary", ".group_General_Contract, .group_contact");
                } else {
                    vm.equalizeColumnsHeightGrouped(".group_ContractSummary", ".group_General_Contract, .group_contact, .group_contractualQuantity, .group_ProductDetails, .group_AdditionalCosts, .group_Penalty");
                }
            }
        });
        vm.isMobile = (function() {
            var check = false;
            (function(a) {
                if (
                    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                        a.substr(0, 4)
                    )
                )
                    check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        })();
        vm.mime_types = {
            "application/postscript": "ps",
            "audio/x-aiff": "aiff",
            "text/plain": "txt",
            "application/atom+xml": "atom",
            "audio/basic": "snd",
            "video/x-msvideo": "avi",
            "application/x-bcpio": "bcpio",
            "application/octet-stream": "so",
            "image/bmp": "bmp",
            "application/x-netcdf": "nc",
            "image/cgm": "cgm",
            "application/x-cpio": "cpio",
            "application/mac-compactpro": "cpt",
            "application/x-csh": "csh",
            "text/css": "css",
            "text/csv": "csv",
            "application/x-director": "dxr",
            "image/vnd.djvu": "djvu",
            "application/msword": "doc",
            "application/xml-dtd": "dtd",
            "application/x-dvi": "dvi",
            "text/x-setext": "etx",
            "application/andrew-inset": "ez",
            "image/gif": "gif",
            "application/srgs": "gram",
            "application/srgs+xml": "grxml",
            "application/x-gtar": "gtar",
            "application/x-hdf": "hdf",
            "application/mac-binhex40": "hqx",
            "text/html": "html",
            "x-conference/x-cooltalk": "ice",
            "image/x-icon": "ico",
            "text/calendar": "ifb",
            "image/ief": "ief",
            "model/iges": "igs",
            "image/jpeg": "jpg",
            "application/x-javascript": "js",
            "application/json": "json",
            "audio/midi": "midi",
            "application/x-latex": "latex",
            "audio/x-mpegurl": "m3u",
            "application/x-troff-man": "man",
            "application/mathml+xml": "mathml",
            "application/x-troff-me": "me",
            "model/mesh": "silo",
            "application/vnd.mif": "mif",
            "video/quicktime": "qt",
            "video/x-sgi-movie": "movie",
            "audio/mpeg": "mpga",
            "video/mpeg": "mpg",
            "application/x-troff-ms": "ms",
            "video/vnd.mpegurl": "mxu",
            "application/oda": "oda",
            "application/ogg": "ogg",
            "image/x-portable-bitmap": "pbm",
            "chemical/x-pdb": "pdb",
            "application/pdf": "pdf",
            "image/x-portable-graymap": "pgm",
            "application/x-chess-pgn": "pgn",
            "image/png": "png",
            "image/x-portable-anymap": "pnm",
            "image/x-portable-pixmap": "ppm",
            "application/vnd.ms-powerpoint": "ppt",
            "audio/x-pn-realaudio": "ram",
            "image/x-cmu-raster": "ras",
            "application/rdf+xml": "rdf",
            "image/x-rgb": "rgb",
            "application/vnd.rn-realmedia": "rm",
            "application/x-troff": "tr",
            "application/rss+xml": "rss",
            "text/rtf": "rtf",
            "text/richtext": "rtx",
            "text/sgml": "sgml",
            "application/x-sh": "sh",
            "application/x-shar": "shar",
            "application/x-stuffit": "sit",
            "application/x-koan": "skt",
            "application/smil": "smil",
            "application/x-futuresplash": "spl",
            "application/x-wais-source": "src",
            "application/x-sv4cpio": "sv4cpio",
            "application/x-sv4crc": "sv4crc",
            "image/svg+xml": "svgz",
            "application/x-shockwave-flash": "swf",
            "application/x-tar": "tar",
            "application/x-tcl": "tcl",
            "application/x-tex": "tex",
            "application/x-texinfo": "texinfo",
            "image/tiff": "tiff",
            "text/tab-separated-values": "tsv",
            "application/x-ustar": "ustar",
            "application/x-cdlink": "vcd",
            "model/vrml": "wrl",
            "application/voicexml+xml": "vxml",
            "audio/x-wav": "wav",
            "image/vnd.wap.wbmp": "wbmp",
            "application/vnd.wap.wbxml": "wbxml",
            "text/vnd.wap.wml": "wml",
            "application/vnd.wap.wmlc": "wmlc",
            "text/vnd.wap.wmlscript": "wmls",
            "application/vnd.wap.wmlscriptc": "wmlsc",
            "image/x-xbitmap": "xbm",
            "application/xhtml+xml": "xhtml",
            "application/vnd.ms-excel": "xls",
            "application/xml": "xsl",
            "image/x-xpixmap": "xpm",
            "application/xslt+xml": "xslt",
            "application/vnd.mozilla.xul+xml": "xul",
            "image/x-xwindowdump": "xwd",
            "chemical/x-xyz": "xyz",
            "application/zip": "zip"
        };
        $scope.systemInstrumentCurrency = "";
        $scope.refreshValue = 0;
        $scope.tenantSetting = $tenantSettings;
        vm.tenantSetting = $tenantSettings;
        // console.log('tenantSetting', $scope.tenantSetting);
        $scope.addedFields = new Object();
        $scope.formFields = new Object();
        $scope.formValues = new Object();
        $scope.locationReload = function() {
            if ($scope.copiedId > 0) {
                localStorage.setItem(vm.app_id + vm.screen_id + "_copy", $scope.copiedId);
                $state.reload();
            } else {
                $scope.formValues = {};
            }
        };
        $scope.getDefaultUom = function() {
            return $scope.tenantSetting.tenantFormats.uom;
        };
        vm.getTranslations = function() {
            Factory_Master.getTranslations(function(callback) {
                if (callback) {
                    $scope.translations = callback;
                }
            });
        };
        vm.get_master_structure = function(screenChild) {
            screenLoader.showLoader();
            $scope.getAdminConfiguration();
            if (!vm.entity_id) {
                vm.get_master_elements(screenChild);
            }
            var generic_layout = false;
        
            console.log('get_master_structure',$state);
        
          
            //load default screen and app
            var app_id = vm.app_id;
            var screen_id = vm.screen_id;
        

            //you might not need to change app & screen, but load entity_documents
            if(screenChild == 'entity_documents'){
                // is generic layout (for now, documents only)
                generic_layout = {
                    needed: true,
                    layout: screenChild
                }

                // if app & screen needs to be changed for layout call, match in map (for documents page)
                var entity_documents_map = {
                    "default.view-request-documents": {
                        app: "procurement",
                        screen: "request_entity_documents"
                    },
                    "default.view-group-of-requests-documents": {
                        app: "procurement",
                        screen: "group_of_requests_entity_documents"
                    },
                    "default.view-order-documents": {
                        app: "procurement",
                        screen: "order_entity_documents"
                    },
                    "delivery.documents": {
                        app: "delivery",
                        screen: "entity_documents"
                    },
                    "contracts.documents": {
                        app: "contracts",
                        screen: "entity_documents"
                    },
                    "labs.documents": {
                        app: "labs",
                        screen: "entity_documents"
                    },
                    "claims.documents": {
                        app: "claims",
                        screen: "entity_documents"
                    },
                    "invoices.documents": {
                        app: "invoices",
                        screen: "entity_documents"
                    },
                    "masters.documents": {
                        app: "masters",
                        screen: "entity_documents"
                    }

                }
                if(entity_documents_map[$state.current.name]){
                    app_id = entity_documents_map[$state.current.name].app;
                    screen_id = entity_documents_map[$state.current.name].screen;
                }
            }

            Factory_Master.get_master_structure(app_id, screen_id, generic_layout, vm.isDev, function(callback) {
                if (callback) {
                    screenLoader.hideLoader();
                    $scope.screenId = callback.id;
                    delete callback.id;
                    // debugger;
                    $scope.formFields = callback;
                    // multiple layouts
                    if (callback.children) {
                        if (screenChild) {
                            $scope.formFields = callback.children[screenChild];
                        } else {
                            $scope.formFields = callback.children["edit"];
                        }
                        $scope.updateScreenID = callback.children.id;
                    }
                    // {end} multiple layouts
                    $scope.sortableGroups = [];
                    if (vm.app_id == "invoices") {
                        if ($state.params.screen_id == "claims") {
                            delete $scope.formFields["CostDetails"];
                            delete $scope.formFields["ProductDetails"];
                            delete $scope.formFields["InvoiceSummary"];
                        }
                        if ($state.params.screen_id == "invoice") {
                            delete $scope.formFields["ClaimDetails"];
                        }
                    }
                    if ($scope.isCreate && vm.screen_id == "counterparty" && vm.app_id == "masters") {
                        $scope.formValues.status = { id: 1 };
                    }
                    $.each($scope.formFields, function(index, value) {
                        $scope.sortableGroups.push(value);
                        $.each(value.children, function(key, val) {
                            val.Active = false;
                            if ($scope.tenantSetting.companyDisplayName.name == "Pool") {
                                val.Label = val.Label.replace("COMPANY", "POOL");
                                val.Label = val.Label.replace("CARRIER", "POOL");
                                val.Label = val.Label.replace("CARRIERS", "POOLS");
                                val.Label = val.Label.replace("COMPANIES", "POOLS");
                            }
                            if ($scope.tenantSetting.serviceDisplayName.name == "Operator") {
                                val.Label = val.Label.replace("SERVICE", "OPERATOR");
                            }
                            // if (val.Label.indexOf(Compan) == "Label") {}
                        });
                    });
                    $rootScope.$broadcast("formFields", $scope.formFields);
                    vm.checkLabelsHeight();
                    if (vm.app_id == "contracts") {
                        $scope.initContractScreen();
                    }
                } else {
                    screenLoader.hideLoader();
                }
            });
        };
        vm.formFieldSearch = function(formFields, Unique_ID) {
            for (var key in formFields) {
                if (typeof formFields[key] == "string") {
                    if (key == "Unique_ID" && formFields[key] == Unique_ID) {
                        return formFields;
                    }
                    continue;
                }
                var aux = vm.formFieldSearch(formFields[key], Unique_ID);
                if (aux) {
                    return aux;
                }
            }
            return false;
        };
        vm.checkLabelsHeight = function() {
            $timeout(function() {
                $.each($(".form-group label:not(.mt-checkbox)"), function(key, val) {
                    if (this.offsetHeight > 26) {
                        $(this)
                            .css("height", 30)
                            .css("padding-top", 0);
                    }
                });
            }, 1);
        };
        vm.get_master_elements = function(screenChild) {
            Factory_Master.get_master_elements(vm.app_id, vm.screen_id, vm.isDev, function(callback) {
                if (callback) {
                    $scope.dragElements = callback;
                }
            });
        };
        $scope.save_master_structure = function() {
            vm.structure = angular.toJson($scope.formFields);
            Factory_Master.save_master_structure(vm.app_id, vm.screen_id, $scope.formFields, function(callback, response) {
                if (response != false) {
                    toastr.success(callback);
                    $scope.loaded = true;
                } else {
                    toastr.error("Error occured");
                }
            });
        };
        $scope.reset_form = function(ev) {
            if ($scope.copiedId > 0) {
                localStorage.setItem(vm.app_id + vm.screen_id + "_copy", $scope.copiedId);
                $state.reload();
            } else {
                $state.reload();
            }
        };
        $scope.undirtyForm = function() {
            if (vm.editInstance) {
                vm.editInstance.$pristine = true;
                vm.editInstance.$dirty = false;
                angular.forEach(vm.editInstance, function(input, key) {
                    if (typeof input == "object" && input.$name) {
                        if (input.$pristine) input.$pristine = true;
                        if (input.$dirty) {
                            input.$dirty = false;
                        }
                    }
                });
            }
        };
        $scope.save_modal_entity = function(app, screen) {
            if (app == "alerts" && screen == "alerts") {
                if ($rootScope.formValues.isRecurrent && (typeof $rootScope.formValues.statusId == "undefined" || $rootScope.formValues.statusId == null)) {
                    toastr.error("Until status cannot be null if Remind Every is checked");
                    return;
                }
                if ($rootScope.formValues.temp.dummyActivateOn && !$rootScope.formValues.activateOn) {
                    toastr.error("Please select a date for activate on");
                    return;
                }
                if ($rootScope.formValues.temp.dummyDeactivateOn && !$rootScope.formValues.deactivateOn) {
                    toastr.error("Please select a date for deactivate on");
                    return;
                }
            }
            vm.invalid_form = false;
            if (1 == 1) {
            
                $rootScope.filterFromData = {};
                $.each($rootScope.formValues, function(key, val) {
                    if (!angular.equals(val, [{}])) {
                        $rootScope.filterFromData[key] = val;
                    }
                });
              
                vm.fields = angular.toJson($rootScope.filterFromData);
                if ($rootScope.filterFromData.id > 0) {
                    Factory_Master.save_master_changes(app, screen, vm.fields, function(callback) {
                        if (callback.status == true) {
                            toastr.success(callback.message);
                            $("table.ui-jqgrid-btable").trigger("reloadGrid");
                            $scope.prettyCloseModal();
                            // $scope.modalInstance.close();
                        } else {
                            if (callback.message) {
                                toastr.error(callback.message);
                            } else {
                                toastr.error("An error has occured, please check the fields");
                            }
                        }
                    });
                } else {
                    Factory_Master.create_master_entity(app, screen, vm.fields, function(callback) {
                        if (callback.status == true) {
                            toastr.success(callback.message);
                            $("table.ui-jqgrid-btable").trigger("reloadGrid");
                            $scope.prettyCloseModal();
                        } else {
                            if (callback.message) {
                                toastr.error(callback.message);
                            } else {
                                toastr.error("An error has occured, please check the fields");
                            }
                        }
                    });
                }
            } else {
                vm.invalid_form = true;
                var message = "Please fill in required fields:";
                $.each(vm.editInstance.$error.required, function(key, val) {
                    message += "<br>" + val.$name;
                });
                toastr.error(message);
            }
        };

        $scope.save_master_changes = function(ev, sendEmails, noReload, completeCallback) {
            screenLoader.showLoader();
            $("form").addClass("submitted");
            vm.invalid_form = false;
            // console.log(vm.editInstance);
            if(vm.app_id == 'masters' && vm.screen_id == 'counterparty') {
                if($scope.formValues && $scope.formValues.counterpartyTypes) {
                    var validCounterpartyTypes = [];
                    $.each($scope.formValues.counterpartyTypes, function(k, v) {
                        if(v.id != 0) {
                            validCounterpartyTypes.push(v);
                        }
                    });
                    $scope.formValues.counterpartyTypes = validCounterpartyTypes;
                }
            }
            if(vm.app_id === 'masters' && vm.screen_id === 'buyer') {
            	// if(!$scope.formValues.code) {
	            	if(!$scope.formValues.code) {
	            		$scope.formValues.code = null;
	            	}
            		if ($scope.formValues.hasNoMoreChildren) {

                        if($scope.formValues.user){

                            $scope.formValues.name = $scope.formValues.user.displayName;
                        }
            		} else {
            			// $scope.formValues.name = $scope.formValues.tempName;
            		}
            	// } else {
        			// $scope.formValues.name = $scope.formValues.code;
            	// }
            }
            if (vm.app_id == "masters" && vm.screen_id == "vessel") {
                if ($scope.formValues.earliestRedelivery >= $scope.formValues.latestRedelivery && $scope.formValues.earliestRedelivery != null && $scope.formValues.latestRedelivery != null) {
                    toastr.error("Latest Redelivery Date can't be lower than Earliest redelivery date");
                    setTimeout(function() {
                        $scope.submitedAction = false;
                    }, 100);
                    return;
                    vm.editInstance.$valid = false;
                }
                tankErrors = false;
                $.each($scope.formValues.tanks, function(k, v) {
                    if (!v.name) {
                        if (!v.isDeleted) {
                            tankErrors = true;
                        }
                    }
                });
                if (tankErrors) {
                    toastr.error("Please check the vessel tank details for errors");
                    setTimeout(function() {
                        $scope.submitedAction = false;
                    }, 100);
                    vm.editInstance.$valid = false;
                    // return
                }

                minMaxError = false;
                $.each($scope.formValues.robs, function(k,v) {
                	if (v.minQty > v.maxQty) {
		                minMaxError = true;
                	}
                })
                if (minMaxError) {
                    toastr.error("Please check min max values for errors");
                    setTimeout(function() {
                        $scope.submitedAction = false;
                    }, 100);
                    vm.editInstance.$valid = false;                	
                    return false;               	
                }

            }
            if (vm.app_id == "masters" && vm.screen_id == "vesseltype") {

                minMaxError = false;
                $.each($scope.formValues.robs, function(k,v) {
                	if (v.minQty > v.maxQty) {
		                minMaxError = true;
                	}
                })
                if (minMaxError) {
                    toastr.error("Please check min max values for errors");
                    setTimeout(function() {
                        $scope.submitedAction = false;
                    }, 100);
                    vm.editInstance.$valid = false; 
                    return false;               	
                }

            }            
            if (vm.app_id == "masters" && vm.screen_id == "location") {
                if (typeof $scope.formValues.productsSystemInstruments[0] != "undefined") {
                    if (!$scope.formValues.productsSystemInstruments[0].product && !$scope.formValues.productsSystemInstruments[0].systemInstrument) {
                        $scope.formValues.productsSystemInstruments = [];
                    }
                } else {
                    $scope.formValues.productsSystemInstruments = [];
                }
            }
            /* Contract Validations*/
            if (typeof $scope.save_master_changes_controllerSpecific === "function") {
                if (!$scope.save_master_changes_controllerSpecific(ev, vm.editInstance)) {
                    return;
                }
            }
            if (vm.app_id == "masters" && vm.screen_id == "specgroup") {
                hasError = false;
                $.each($scope.formValues.specGroupParameters, function(k, v) {
                    if (!v.min && !v.max) {
                        // vm.editInstance.$valid = false
                    } else {
                        if (v.min != null && v.max != null) {
                            if (Number(v.min) > Number(v.max)) {
                                hasError = true;
                            }
                        }
                    }
                });
                if (hasError) {
                    toastr.error("Min value can't be greater than Max value");
                    setTimeout(function() {
                        $scope.submitedAction = false;
                    }, 100);
                    return;
                }
            }
            if (vm.app_id == "masters" && vm.screen_id == "product") {
                if (!$scope.formValues.defaultSpecGroup) {
                    toastr.warning("Please create a Spec Group for the product in the Spec Group master and then select a default Spec Group");
                }
            }
            if (vm.app_id == "contracts" && vm.screen_id == "contract") {
                //chech for product location to be obj
                ret = false;
                $.each($scope.formValues.products, function(key, val) {
                    if (typeof val.location != "object") {
                        //toastr error is shown from app-contract controller - save_master_changes_controllerSpecific
                        ret = true;
                    }
                });
                if (ret) {
                    vm.editInstance.$valid = false;
                    setTimeout(function() {
                        $scope.submitedAction = false;
                    }, 100);
                    return;
                }
            }

            if (vm.app_id == "admin" && vm.screen_id == "configuration") {
                //chech for product location to be obj
                $.each($scope.formValues.email, function(key, val) {
	                toEmailsConfigurationSimplified = []
	                ccEmailsConfigurationSimplified = []
                	if (val.toEmailsConfiguration) {
	                	if (val.toEmailsConfiguration.length > 0) {
	                		$.each(val.toEmailsConfiguration, function(tok,tov){
				                toEmailsConfigurationSimplified.push(tov.id);
	                		})
	                	}
                	}
                	if (val.ccEmailsConfiguration) {
	                	if (val.ccEmailsConfiguration.length > 0) {
	                		$.each(val.ccEmailsConfiguration, function(cck,ccv){
				                ccEmailsConfigurationSimplified.push(ccv.id);
	                		})
	                	}  
                	}  
                	val.toEmailsConfiguration = toEmailsConfigurationSimplified.length > 0 ? toEmailsConfigurationSimplified.join(",") : null;              	
                	val.ccEmailsConfiguration = ccEmailsConfigurationSimplified.length > 0 ? ccEmailsConfigurationSimplified.join(",") : null;              	
                });
            }

            /* END Contract Validations*/
            if (vm.editInstance.$valid) {
                $scope.filterFromData = {};
                $scope.submitedAction = true;
                $.each($scope.formValues, function(key, val) {
                    if (!angular.equals(val, [{}])) {
                        $scope.filterFromData[key] = angular.copy(val);
                    }
                    if (val && val.id && angular.equals(val.id, -1)) {
                        $scope.filterFromData[key] = null;
                    }
                    if (vm.screen_id == "formula" || vm.screen_id == "labresult") {
                        if (angular.equals(val, {})) {
                            $scope.filterFromData[key] = null;
                        }
                        if (key == "pricingScheduleOptionSpecificDate") {
                            if (val && val.dates && angular.equals(val.dates, [{}])) {
                                $scope.filterFromData[key] = null;
                            }
                        }
                    }
                });
                if (vm.app_id == "contracts" && vm.screen_id == "contract") {
                    if ($scope.filterFromData.productQuantityRequired == false || typeof $scope.filterFromData.productQuantityRequired == "undefined") {
                        $.each($scope.filterFromData.products, function(key, val) {
                            $scope.filterFromData.products[key].details = null;
                        });
                    }
                    if (typeof $scope.filterFromData != "undefined") {
                        if (typeof $scope.filterFromData.products != "undefined") {
                            $scope.filterFromData.products.forEach(function(product, index) {
                                if (product.additionalCosts != null) {
                                    if (product.additionalCosts.length == 1 && !product.additionalCosts[0].costType) {
                                        $scope.filterFromData.products[index].additionalCosts = null;
                                    }
                                }
                            });
                        }
                    } else {
                        return;
                    }
                }
				if (vm.app_id == "masters" && vm.screen_id == "vessel") {
					if ($scope.filterFromData.usingVesselTypeRob) {
						$scope.filterFromData.robs = null;
					}
				} 
				if (vm.app_id == "admin" && vm.screen_id == "users") {
					if (!$("#Signature").val()) {
						$scope.filterFromData.signature = null;
					}
				}      
                if (vm.app_id == "masters" && vm.screen_id == "price") {
                	tempMarketPrices = [];
                    $.each($scope.filterFromData.marketPrices, function(key, val) {
                    	if (!(val.id == 0 && !val.quotePrice)) {
		                	tempMarketPrices.push(val);
                    	}
                    });
                    $scope.filterFromData.marketPrices = tempMarketPrices;
                }				          
                if (vm.app_id == "admin" && vm.screen_id == "role") {
                    console.log($scope.formValues.deepmerge);
                    roles = $scope.formValues.roles;
                    $.each(roles.rights, function(key, module) {
                        $.each(module.moduleScreenConfigurations, function(key2, screen) {
                            screen.actions = [];
                        });
                    });
                    $scope.formValues.roles.rights = [];
                    $.each($scope.formValues.deepmerge, function(key, deepModule) {
                        obj = {};
                        obj.moduleScreenConfigurations = [];
                        $.each(deepModule, function(key2, deepScreen) {
                            actions = [];
                            $.each(deepScreen, function(key3, deepAction) {
                                if (key3 != "screen" && key3 != "definedScreenTemplates" && key3 != "selectedScreenTemplate") {
                                    if (deepAction.isSelected) {
                                        actions.push({
                                            id: key3,
                                            name: deepAction.name
                                        });
                                    }
                                }
                            });
                            if($scope.formValues.id != 0){
                                obj.id = deepModule.module.idSrv;
                            }else{
                                obj.id = 0;
                            }
                            module = {
                                id: deepModule.module.id,
                                name: deepModule.module.name
                            };
                            screen = {};
                            if (typeof deepScreen.screen != "undefined") {
                                screen = {
                                    id: deepScreen.screen.id,
                                    name: deepScreen.screen.name
                                };
                            }
                            selectedScreenTemplate = {};
                            if (typeof deepScreen.selectedScreenTemplate != "undefined") {
                                selectedScreenTemplate = deepScreen.selectedScreenTemplate;
                            }
                            obj.module = module;
                            if (screen.id && selectedScreenTemplate.id) {
                                obj.moduleScreenConfigurations.push({
                                    id: deepScreen.idSrv,
                                    screen: screen,
                                    screenTemplate: selectedScreenTemplate,
                                    actions: actions
                                });
                            }
                        });
                        $scope.formValues.roles.rights.push(obj);
                    });
                    $scope.filterFromData = roles;
                }
                if (vm.app_id == "invoices" && vm.screen_id == "invoice") {
                	validCostDetails = []
                    if ($scope.filterFromData.costDetails.length > 0) {
                        $.each($scope.filterFromData.costDetails, function(k, v) {
                            if (typeof v.product != "undefined" && v.product != null) {
                                if (v.product.id == -1) {
                                    v.product = null;
                                    v.deliveryProductId = null;
                                } else  {
                                	if (v.product.productId) {
	                                    v.product.id = v.product.productId;
                                	}
                                	if (v.product.deliveryProductId) {
                                		v.deliveryProductId = angular.copy(v.product.deliveryProductId);
                                	}
	                            	v.isAllProductsCost = false;
	                            }
                            }
	                        if ((!!v.id && !(v.id == 0 && v.isDeleted)) || (!v.Id && !v.isDeleted)) {
                                // v.isDeleted = false;
	                        	validCostDetails.push(v);
	                        }
                        });
                    }
                    $scope.filterFromData.costDetails = validCostDetails;
                    // return;
                    costTypeError = false;
                    for (var i = $scope.filterFromData.costDetails.length - 1; i >= 0; i--) {
                    	if (!$scope.filterFromData.costDetails[i].costType) {
		                    costTypeError = true;
                    	}
                    }
                    if (costTypeError) {
                        toastr.error("Please select Cost type");
                        $scope.submitedAction = false;
                        return false;
                    }
                    if ($state.params.screen_id != "claims") {
                        if ($filter('filter')($scope.filterFromData.productDetails, {isDeleted: false}).length == 0 && $filter('filter')($scope.filterFromData.costDetails, {isDeleted: false}).length == 0) {
                            toastr.error("Please add at least one product or one cost");
                            $scope.submitedAction = false;
                            return false;
                        }
                    }
                }
                if (vm.app_id == "masters" && vm.screen_id == "documenttype") {
                    if((typeof $scope.formValues.id == 'undefined') || ($scope.formValues.id == 0)){
                       $scope.filterFromData.name = $scope.filterFromData.displayName;
                    }
                }

                vm.fields = angular.toJson($scope.filterFromData);
                if (vm.entity_id) {
                    vm.entity_id = vm.entity_id;
                } else {
                    vm.entity_id = 0;
                }
                if (vm.entity_id > 0) {
                    Factory_Master.save_master_changes(vm.app_id, vm.screen_id, vm.fields, function(callback) {
                        screenLoader.showLoader();
                        //alert('no reload');
                        if (callback.status == true) {
                            
                            $scope.loaded = true;
                            if (vm.app_id == "admin" && vm.screen_id == "configuration") {
                                vm.entity_id = 0;
                            }
                            setTimeout(function() {
                                $scope.submitedAction = false;
                            }, 100);
                            if (sendEmails) {
                                $scope.sendEmails();
                            }
                            if(noReload == undefined || typeof noReload == undefined || !noReload){
                                toastr.success(callback.message);
                                //alert('reloading');
                                $state.reload();
                                screenLoader.hideLoader();
                            } else {
                                if(completeCallback){
                                    toastr.success('Saved');
                                    toastr.warning('Preparing to complete');
                                    completeCallback();
                                }
                            }
                            
                        } else {
                            screenLoader.hideLoader();
                            toastr.error(callback.message);
                            setTimeout(function() {
                                $scope.submitedAction = false;
                            }, 100);

                            if (vm.app_id == "invoices" && vm.screen_id == "invoice") {
                                if ($scope.filterFromData.costDetails.length > 0) {
                                    $.each($scope.filterFromData.costDetails, function(k, v) {
                                        if (v.product == null)
                                            if (v.associatedOrderProduct == "All" || v.isAllProductsCost) {
                                                v.product = {
                                                    id: -1
                                                };
                                            }
                                    });
                                }
                            }
                        }

                    });
                } else {
                    Factory_Master.create_master_entity(vm.app_id, vm.screen_id, vm.fields, function(callback) {

                        if (callback.status == true) {
                            toastr.success(callback.message);
                            if (vm.app_id == "admin" && vm.screen_id == "configuration") {
                                vm.entity_id = 0;
                                Factory_Master.get_master_entity(vm.entity_id, vm.screen_id, vm.app_id, function(callback2) {
                                    if (callback2) {
                                        $scope.formValues = callback2;
                                    }
                                });
                            } else {
                                if ($location.path().slice(-2) == "/0") {
                                    locationPath = $location.path().slice(0, -1);
                                } else {
                                    locationPath = $location.path();
                                }
                                if (vm.app_id == "admin"){
                                    if(vm.screen_id == "sellerrating"){
                                        //do nothing
                                    }else{
                                        if (sendEmails) {
                                            $location.path(locationPath + callback.id).hash("mail");
                                        } else {
                                            $location.path(locationPath + callback.id);
                                        }
                                    }
                                }else{
                                    if (sendEmails) {
                                        $location.path(locationPath + callback.id).hash("mail");
                                    } else {
                                        $location.path(locationPath + callback.id);
                                    }
                                }
                            }
                            setTimeout(function() {
                                $scope.submitedAction = false;
                            }, 100);
                        } else {
                            // toastr.error(callback.message);
                            setTimeout(function() {
                                $scope.submitedAction = false;
                            }, 1000);
                            $scope.submitedAction = false;
                        }
                    });
                }
                //$scope.refreshSelect();
            } else {
                $scope.submitedAction = false;
                vm.invalid_form = true;
                var message = "Please fill in required fields:";
                var names = [];
                $.each(vm.editInstance.$error.required, function(key, val) {
                    if (names.indexOf(val.$name) == -1) {
                        message += "<br>" + val.$name;
                    }
                    names += val.$name;
                });
                i = 0;
                $.each(vm.editInstance.$error.pattern, function(key, val) {
                    i++;
                    if (i === 1) {
                        message += "<br>Please check format:";
                    }
                    message += "<br>" + val.$name;
                });
                toastr.error(message);
                setTimeout(function() {
                    $scope.submitedAction = false;
                }, 100);
            }
        };
        $scope.save_terms_and_conditions = function(id) {
            //  console.log(id);
            //  console.log(vm.entity_id);
            // console.log($scope.formValues)
            Factory_Master.save_terms_and_conditions(id, $scope.formValues.termsAndConditions, function(response) {
                if (response) {
                    if (response.status == true) {
                        console.log(response.data);
                        toastr.success(response.message);
                    } else {
                        toastr.error(response.message);
                    }
                }
            });
        };
        $scope.copyEntity = function() {
            localStorage.setItem(vm.app_id + vm.screen_id + "_copy", vm.entity_id);
            $location.path("/" + vm.app_id + "/" + vm.screen_id + "/edit/");
        };
        $scope.triggerError = function(name, errors) {
            if (errors.$viewValue != "NaN") {
                toastr.error(name);
            }
        };
        $scope.sellerRatingScreen = function(app, screen, entityId) {
            if (!app) {
                app = vm.app_id;
            }
            if (!screen) {
                screen = vm.screen_id;
            }
            if (!entityId) {
                entityId = vm.entity_id;
            }
            if ($rootScope.sellerRatingFunctionDone) return;
            $rootScope.sellerRatingFunctionDone = true;
            Factory_Master.get_seller_rating(app, screen, entityId, function(response) {
                $rootScope.sellerRatingFunctionDone = false;
                if (response.error) {
                    toastr.error(response.message);
                } else {
                    $scope.sellerRating = response;
                    tpl = $templateCache.get("app-general-components/views/modal_sellerrating.html");
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        size: "full",
                        appendTo: angular.element(document.getElementsByClassName("page-container")),
                        windowTopClass: "fullWidthModal",
                        scope: $scope //passed current scope to the modal
                    });
                }
            });
        };
        // SPEC GROUP MODAL
        $scope.modalSpecGroupEdit = function(product, entityId, application, orderData) {
            vm.activeProductForSpecGroupEdit = product;
            if (application == "request" || application == "order") {
                $scope.canChangeSpec = false;
                $scope.modalSpecGroupParametersEditable = true;
            } else {
                $scope.modalSpecGroupParametersEditable = false;
            }
            if (!product.specGroup) {
                toastr.error("Please select a spec group!");
                return;
            }
            if (application == "request" || application == "supplier") {
                if (!entityId) {
                    $scope.modalSpecGroupParametersEditable = false;
                }
                if (typeof product.productStatus != "undefined" && product.productStatus != null) {
                    status = product.productStatus.name;
                    if (status == "Created" || status == "Questionnaire" || status == "Validated" || status == "ReOpen" || status == "PartiallyInquired" || status == "Inquired") {
                        $scope.modalSpecGroupParametersEditable = true;
                    } else {
                        $scope.modalSpecGroupParametersEditable = false;
                    }
                } else {
                    $scope.modalSpecGroupParametersEditable = false;
                }
                if (application == "supplier") {
                    $scope.modalSpecGroupParametersEditable = false;
                }
                $.each(product.screenActions, function(key, val) {
                    if (val.name == "ChangeSpecParameters") {
                        $scope.canChangeSpec = true;
                    }
                });
                productId = product.product.id;
                if (application == "request") {
                    data = {
                        Payload: {
                            Filters: [
                                {
                                    ColumnName: "RequestProductId",
                                    Value: product.id
                                },
                                {
                                    ColumnName: "SpecGroupId",
                                    Value: product.specGroup.id
                                },
                                {
                                    ColumnName: "ProductId",
                                    Value: productId
                                }
                            ]
                        }
                    };
                }
                if (application == "supplier") {
                    data = {
                        Token: $state.params.token,
                        Parameters: {
                            Filters: [
                                {
                                    ColumnName: "RequestProductId",
                                    Value: product.id
                                },
                                {
                                    ColumnName: "SpecGroupId",
                                    Value: product.specGroup.id
                                },
                                {
                                    ColumnName: "ProductId",
                                    Value: productId
                                }
                            ]
                        }
                    };
                }
            }
            if (application == "order") {
                $.each(orderData.screenActions, function(key, val) {
                    if (val.name == "ChangeSpecParameters") {
                        $scope.canChangeSpec = true;
                    }
                });
                productId = product.product.id;
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: "OrderProductId",
                                Value: product.id
                            },
                            {
                                ColumnName: "SpecGroupId",
                                Value: product.specGroup.id
                            },
                            {
                                ColumnName: "ProductId",
                                Value: productId
                            }
                        ]
                    }
                };
            }
            if (application == "contract") {
                productId = product.product.id;
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: "ContractProductId",
                                Value: product.id ? product.id : null
                            },
                            {
                                ColumnName: "SpecGroupId",
                                Value: product.specGroup.id
                            },
                            {
                                ColumnName: "ProductId",
                                Value: productId
                            }
                        ]
                    }
                };
                if (vm.isEdit && $scope.formValues.status.name != "Confirmed" && product.id != 0) {
                    $scope.modalSpecGroupParametersEditable = true;
                    $scope.canChangeSpec = true;
                }
            }
            tpl = $templateCache.get("app-general-components/views/modalSpecGroupEdit.html");
            Factory_Master.getSpecForProcurement(data, application, function(response) {
                if (response) {
                    $scope.modalSpecGroupParameters = response.data.payload;
                    $scope.application = application;
                    $scope.product = product;
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        size: "full",
                        appendTo: angular.element(document.getElementsByClassName("page-container")),
                        windowTopClass: "fullWidthModal",
                        scope: $scope
                    });
                } else {
                    toastr.error("An error has occured");
                }
            });
        };
        $scope.modalSpecGroupParametersUpdateUom = function(specParamId, index) {
            console.log(specParamId);
            console.log(index);
            Factory_Master.get_master_entity(specParamId.id, "specparameter", "masters", function(response) {
                if (response) {
                    $scope.modalSpecGroupParameters[index].uom = response.uom;
                    $scope.modalSpecGroupParameters[index].energyParameterTypeId = response.energyParameterType.id;
                }
            });
        };
        $scope.saveProcurementSpecGroup = function(data, application) {
            console.log(application);
            console.log(vm.activeProductForSpecGroupEdit);
            console.log(data);
            if (application == "request") {
                $.each(data, function(key, spec) {
                    data[key].requestProduct = {};
                    data[key].specGroup = {};
                    data[key].requestProduct.id = vm.activeProductForSpecGroupEdit.id;
                    data[key].specGroup.id = vm.activeProductForSpecGroupEdit.specGroup.id;
                });
            }
            if (application == "order") {
                $.each(data, function(key, spec) {
                    spec.orderProduct = data[0].orderProduct;
                    spec.specGroup = data[0].specGroup;
                });
            }
            if (application == "contract") {
                $.each(data, function(key, spec) {
                    spec.contractProduct = data[0].contractProduct;
                    spec.specGroup = data[0].specGroup;
                });
            }
            objToSend = {
                ProductId: vm.activeProductForSpecGroupEdit.product.id,
                SpecParameters: data
            };
            Factory_Master.saveSpecForProcurement(objToSend, application, function(response) {
                if (response) {
                    if (response.status) {
                        toastr.success("Saved succesfully");
                        setTimeout(function() {
                            $scope.prettyCloseModal();
                        }, 500);
                    } else {
                        toastr.error(response.message);
                    }
                    console.log(response);
                } else {
                    toastr.error("An error has occured");
                }
            });
        };
        // end SPEC GROUP MODAL
        //
        // $scope.$on('triggerListModal', function (e, a) {
        //     if (typeof a.listOptions != 'undefined') {
        //         $scope.triggerModal(a.listOptions.template, a.listOptions.clc, a.listOptions.name, a.listOptions.id, a.listOptions.formvalue, a.listOptions.idx,
        //             a.listOptions.field_name, a.listOptions.filter);
        //     }
        // })
        $scope.createModalParams = function(obj) {
            $rootScope.modalParams = obj;
            // return obj
        };
        $scope.triggerModal = function(template, clc, name, id, formvalue, idx, field_name, filter) {
            tpl = "";
            if (template == "formula") {
                $scope.modal = {
                    clc: "masters_formulalist",
                    app: "masters",
                    screen: "formulalist",
                    name: name,
                    source: id,
                    field_name: field_name
                };
                if (formvalue) {
                    $scope.modal.formvalue = formvalue;
                    $scope.modal.idx = idx;
                }
                if (vm.app_id == "contracts") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ContractId",
                            Value: vm.entity_id ? vm.entity_id : null
                        }
                    ];
                }
                tpl = $templateCache.get("app-general-components/views/modal_formula.html");
            } else if (template == "alerts") {
                tpl = $templateCache.get("app-general-components/views/modal_alerts.html");
                $scope.modal = {
                    source: clc
                };
            } else if (template == "general") {
                tpl = $templateCache.get("app-general-components/views/modal_general_lookup.html");
                if (clc == "deliveries_transactionstobeinvoiced") {
                    clcs = ["invoices", "transactionstobeinvoiced"];
                } else if (clc == "payableTo") {
                    clcs = ["invoices", "payableTo"];
                } else if (clc == "contactplanning_contractlist") {
                    // clcs = ['procurement','contractplanning_contractlist'];
                } else {
                    if (typeof clc != "undefined") {
                        clcs = clc.split("_");
                    } else {
                        console.log("CLC not defined for modal!");
                        return;
                    }
                }
                $scope.modal = {
                    clc: clc,
                    app: clcs[0],
                    screen: clcs[1],
                    name: name,
                    source: id,
                    field_name: field_name
                };
                if (clc == "payableTo") {
                    $scope.modal.app = "masters";
                    $scope.modal.screen = "counterpartylist";
                }
                if (clc == "contactplanning_contractlist") {
                    $scope.modal.filters = filter;
                }
                if (clc == "procurement_bunkerableport" || clc == "procurement_destinationport") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "VesselId",
                            Value: filter.id
                        },
                        {
                            ColumnName: "VesselVoyageDetailId",
                            Value: null
                        }
                    ];
                }
                if (clc == "procurement_requestcounterpartytypes") {
                    var filterString = "";
                    $.each(filter, function(key, val) {
                        filterString += val;
                        filterString += ",";
                    });
                    filterString = filterString.slice(0, -1);
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: filterString
                        }
                    ];
                }
                if (clc == "procurement_buyerlist") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "VesselId",
                            Value: filter.id
                        },
                        {
                            ColumnName: "VesselVoyageDetailId",
                            Value: null
                        }
                    ];
                }
                if(clc == "procurement_productcontractlist"){
                    $scope.modal.filters = filter;
                }
                if (filter == "filter__invoices_order_id") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "Order_Id",
                            Value: $scope.formValues.orderDetails ? $scope.formValues.orderDetails.order.id : ""
                        }
                    ];
                }
                if (filter == "mass") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "UomType",
                            Value: 2
                        }
                    ];
                }
                if (filter == "volume") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "UomType",
                            Value: 3
                        }
                    ];
                }
                if (filter == "sellerList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: "2, 11"
                        }
                    ];
                    $scope.modal.clc = "masters_counterpartylist_seller";
                }
                if (filter == "agentList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 5
                        }
                    ];
                }
                if (filter == "brokerList") {
                    $scope.modal.clc = "masters_counterpartylist_broker";
                }
                if (filter == "supplierList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 1
                        }
                    ];
                }
                if (filter == "surveyorList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 6
                        }
                    ];
                }
                if (filter == "labsList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 8
                        }
                    ];
                }
                if (filter == "bargeList") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "CounterpartyTypes",
                            Value: 7
                        }
                    ];
                }
                if (filter == "price_period_filter") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "SystemInstrumentId",
                            Value: $scope.formValues.systemInstrument.id
                        }
                    ];
                }
                if (filter == "filter__vessel_defaultFuelOilProduct") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ProductId",
                            Value: $scope.formValues.defaultFuelOilProduct.id
                        }
                    ];
                }

                if (filter == "filter__vessel_defaultDistillateProduct") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ProductId",
                            Value: $scope.formValues.defaultDistillateProduct.id
                        }
                    ];
                }
                if (filter == "filter__vessel_defaultLsfoProduct") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ProductId",
                            Value: $scope.formValues.defaultLsfoProduct.id
                        }
                    ];
                }
                if (filter == "filter__productDefaultSpec") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "ProductId",
                            Value: $scope.formValues.id
                        }
                    ];
                }
                if (filter == "delivery_order_filter") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "id",
                            Value: "7"
                        }
                    ];
                }
                if (filter == "filter__admin_templates") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "EmailTransactionTypeId",
                            Value: $scope.grid ? $scope.grid.appScope.fVal().formValues.email[idx].transactionType.id : $scope.formValues.email[idx].transactionType.id
                        },
                        {
                            ColumnName: "Process",
                            Value: $scope.grid ? $scope.grid.appScope.fVal().formValues.email[idx].process : $scope.formValues.email[idx].process 
                        }
                    ];
                }
                if (filter == "filter__master_documenttypetemplates") {
                    $scope.modal.filters = [
                        {
                            ColumnName: "EmailTransactionTypeId",
                            Value: $scope.grid.appScope.fVal().formValues.templates[idx].transactionType.id
                        }
                    ];
                }
                if (filter == "filter__vessel_tankProduct") {
                    $scope.modal.filters = [
						{columnValue: "ProductType_Id", ColumnType: "Number", ConditionValue: "=", Values: [$scope.formValues.temp.tanks.productType.id], FilterOperator: 0}
						// {columnValue: "ProductType_Name", ColumnType: "Text", ConditionValue: "LIKE", Values: [$scope.formValues.temp.tanks.productType.name], FilterOperator: 0}
                    ];
                    localStorage.setItem("uniqueModalTableIdentifier", "productsInVesselMaster");
                }                
                if (clc == "masters_marketinstrumentlist") {
                    $scope.modal.screen = "marketinstrument";
                }
                if (formvalue) {
                    $scope.modal.formvalue = formvalue;
                    $scope.modal.idx = idx;
                }
            } else if (template == "sellerrating") {
                $scope.getSellerRating();
                tpl = $templateCache.get("app-general-components/views/modal_sellerrating.html");
            } else if (template == "setResetPassword") {
                tpl = $templateCache.get("app-general-components/views/modal_setPassword.html");
            } else if (template == "labsResultRecon") {
                tpl = $templateCache.get("app-general-components/views/modal_labsResultRecon.html");
            } else if (template == "raiseClaimType") {
                tpl = $templateCache.get("app-general-components/views/modal_raiseClaimType.html");
            } else if (template == "splitDeliveryModal") {
                tpl = $templateCache.get("app-general-components/views/modal_splitDelivery.html");
            }
            if (template == "splitDeliveryModal" || template == "raiseClaimType") {
                $scope.modalInstance = $uibModal.open({
                    template: tpl,
                    size: "full",
                    appendTo: angular.element(document.getElementsByClassName("page-container")),
                    windowTopClass: "fullWidthModal smallModal",
                    scope: $scope //passed current scope to the modal
                });
                return;
            }
            $scope.modalInstance = $uibModal.open({
                template: tpl,
                size: "full",
                appendTo: angular.element(document.getElementsByClassName("page-container")),
                windowTopClass: "fullWidthModal",
                scope: $scope //passed current scope to the modal
            });
        };
        $scope.$on("modal.closing", function(event, reason, closed) {
            if (!$scope.modalClosed) {
                if (typeof $scope.modalInstance != "undefined") {
                    event.preventDefault();
                    console.log($rootScope.modalInstance);
                    console.log($scope.modalInstance);
                    $scope.prettyCloseModal();
                    $scope.modalClosed = true;
                }
            }
        });
        $scope.prettyCloseModal = function() {
            var modalStyles = {
                transition: "0.3s",
                opacity: "0",
                transform: "translateY(-50px)"
            };
            var bckStyles = {
                opacity: "0",
                transition: "0.3s"
            };
            $("[modal-render='true']").css(modalStyles);
            $(".modal-backdrop").css(bckStyles);
            setTimeout(function() {
                if ($scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                if ($rootScope.modalInstance) {
                    $rootScope.modalInstance.close();
                }
            }, 500);
        };
        vm.list_table = function() {
            return Factory_Master.list_table(vm.screen_id);
        };
        vm.mastersCatalog = function() {
            Factory_Master.mastersTree(function(callback, response) {
                vm.mastersTree = callback;
            });
        };
        vm.selectMaster = function(id, name) {
            $location.path("/masters/" + id);
            $scope.master_name = name;
        };
        vm.editMasterStructure = function() {
            $location.path("/masters/" + vm.screen_id + "/structure");
        };
        vm.get_master_entity = function(screenChild) {
         	

            vm.get_master_structure(screenChild);
            // console.log(screenChild);
            setTimeout(function() {
                vm.addHeadeActions();
            }, 10);
            if ($scope.entity == -1) {
                vm.entity_id = "";
            } else if ($scope.entity > 0) {
                vm.entity_id = $scope.entity;
            } else {
                vm.entity_id = vm.entity_id;
            }
        	if (vm.entity_id == "") {
        		if (vm.app_id == "masters" && vm.screen_id == "location") {
        			$scope.formValues.portType = {id: 1};
        			$scope.formValues.displayPortInMap = true;
        		}
        	}


            if (vm.entity_id == "0") {
            } else {
                // $rootScope.transportData este variabila globala folosita pentru cazurile in care avem nevoie
                // sa populam un ecran de create, atunci cand datele vin in urma unei actiuni.
                if ($rootScope.transportData != null) {
                    $scope.isCopiedEntity = true;
                    $scope.formValues = $rootScope.transportData;
                    $rootScope.transportData = null;

                   
               
                    if (vm.app_id == "invoices" && vm.screen_id == "invoice") {
                        screenLoader.hideLoader();
                        $scope.triggerChangeFields("InvoiceRateCurrency");
                        if ($scope.formValues.costDetails.length > 0) {
                            $.each($scope.formValues.costDetails, function(k, v) {
                                if (v.product == null || v.isAllProductsCost) {
                                    v.product = {
                                        id: -1,
                                        name: "All"
                                    };
                                }
                                if (v.product.id != -1) {
				                	v.product.productId = angular.copy(v.product.id);
				                	if (v.deliveryProductId) {
					                	v.product.id = v.deliveryProductId;
				                	}
				                }
                            });
                        }
                    }
                } else {
                    if (localStorage.getItem(vm.app_id + vm.screen_id + "_copy")) {
                        id = localStorage.getItem(vm.app_id + vm.screen_id + "_copy");
                        if (id > 0) {
                            $scope.copiedId = id;
                            
                            Factory_Master.get_master_entity(id, vm.screen_id, vm.app_id, function(response) {
                                if (response) {
                                    $scope.formValues = response;
                                
                                    $.each($scope.formValues, function(key, val) {
                                        if (val && angular.isArray(val)) {
                                            $.each(val, function(key1, val1) {
                                                if (val && val1 && val1.hasOwnProperty("isDeleted")) {
                                                    if (vm.app_id != "contracts" && vm.screen_id != "contract" &&
                                                    	vm.app_id != "admin" && vm.screen_id != "users") {
                                                        response[key][key1].id = 0;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    $scope.formValues.id = 0;
                                    if (typeof $scope.formValues.name != "undefined") {
                                        $scope.formValues.name = null;
                                    }
                                    if ($scope.formValues.conversionFactor) {
                                        $scope.formValues.conversionFactor.id = 0;
                                    }
                                    // reset contract status
                                    if (vm.app_id == "contracts" && vm.screen_id == "contract") {
                                        $scope.formValues.status = null;
                                        $.each($scope.formValues.details, function(k, v) {
                                            v.id = 0;
                                        });
                                        $.each($scope.formValues.products, function(k, v) {
                                            v.id = 0;
                                            $.each(v.details, function(k1, v1) {
                                                v1.id = 0;
                                            });
                                            v.formula = null;
                                            v.mtmFormula = null;
                                            v.price = null;
                                            v.mtmPrice = null;
                                        });
                                        $scope.formValues.summary.plannedQuantity = 0;
                                        $scope.formValues.summary.utilizedQuantity = 0;
                                        $scope.formValues.summary.availableQuantity = $scope.formValues.summary.contractedQuantity;
                                        $scope.formValues.summary.copiedContract = true;
                                        $scope.formValues.createdBy = null;
                                        toastr.info($filter("translate")("Formula and MTM Formula was reset for all products"));
                                    }
                                    if (vm.app_id == "admin" && vm.screen_id == "users") {
                                        $scope.formValues.contactInformation.id = 0;
                                        $scope.formValues.contactInformation.address.id = 0;
                                    }
                                    if (vm.app_id == "admin" && vm.screen_id == "role") {
                                        $scope.formValues.roles.id = 0;
                                        $.each($scope.formValues.roles.rights, function(key,val){
                                            $scope.formValues.roles.rights[key].id = 0;
                                        });
                                    }
                                    if (vm.app_id == "masters" && vm.screen_id == "product") {
                                        $scope.formValues.defaultSpecGroup = null;
                                    }
                                    if (vm.app_id == "claims" && vm.screen_id == "claims") {
                                        $scope.formValues = {};
                                        $scope.formValues.claimsPossibleActions = null;
                                        $scope.formValues.isEditable = true;
                                        $scope.formValues.orderDetails = response.orderDetails;
                                        $scope.formValues.deliveryDate = response.deliveryDate;
                                        $scope.triggerChangeFields("OrderID", "orderDetails.order");
                                    }
                                    if (vm.app_id == "labs" && vm.screen_id == "labresult") {
                                        vm.checkVerifiedDeliveryFromLabs("loadedData");
                                    }
                                    toastr.success("Entity copied");
                                    localStorage.removeItem(vm.app_id + vm.screen_id + "_copy");
                                    $scope.$emit("formValues", $scope.formValues);
                                }
                            });
                        }
                    } else {
                        if(vm.entity_id){
                            screenLoader.showLoader();
                        }
                        Factory_Master.get_master_entity(
                            vm.entity_id,
                            vm.screen_id,
                            vm.app_id,
                            function(callback) {
                                screenLoader.hideLoader();
                                if (callback) {
                                    
                                    $scope.formValues = callback;
                                    if(vm.screen_id === 'emaillogs') {
                                        if($scope.formValues.to && typeof($scope.formValues.to) === 'string') {
                                          $scope.formValues.to = $scope.formValues.to.replace(/,/g, ';');
                                        }
                                        if($scope.formValues.cc && typeof($scope.formValues.cc) === 'string') {
                                          $scope.formValues.cc = $scope.formValues.cc.replace(/,/g, ';');
                                        }
                                        if($scope.formValues.bcc && typeof($scope.formValues.bcc) === 'string') {
                                          $scope.formValues.bcc = $scope.formValues.bcc.replace(/,/g, ';');
                                        }
                                    }

                                    if(vm.app_id === 'masters' && vm.screen_id === 'buyer') {
                                      $scope.formValues.showCode = !!$scope.formValues.code;
                                    }
                                    if(vm.app_id === 'masters' && vm.screen_id === 'vessel') {
                                    	$scope.flattenVesselVoyages();
										$scope.initRobTable();
                                    }  




				                    if (vm.app_id == "invoices" && vm.screen_id == "invoice") {
				                        $scope.triggerChangeFields("InvoiceRateCurrency");
				                        if ($scope.formValues.costDetails.length > 0) {
				                            $.each($scope.formValues.costDetails, function(k, v) {
				                                if (v.product == null || v.isAllProductsCost) {
				                                    v.product = {
				                                        id: -1,
				                                        name: "All"
				                                    };
				                                }
				                                if (v.product.id != -1) {
								                	v.product.productId = angular.copy(v.product.id);
								                	v.product.id = angular.copy(v.deliveryProductId);
								                }
				                            });
				                        }
				                    }

                                    $rootScope.$broadcast("formValues", $scope.formValues);
                                    $scope.refreshSelect();
                                    $rootScope.formValuesLoaded = callback;
                                    if (vm.screen_id == "invoice" && vm.app_id == "invoices") {
                                      if(!$scope.formValues.paymentDate) {
                                        $scope.formValues.paymentDate = $scope.formValues.workingDueDate;
                                      }
                                        if ($scope.formValues.costDetails.length > 0) {
                                            $.each($scope.formValues.costDetails, function(k, v) {
                                                if (v.product == null || v.isAllProductsCost) {
                                                    v.product = {
                                                        id: -1,
                                                        name: "All"
                                                    };
                                                }
                                            });
                                        }
                                        $.each($scope.formValues.productDetails, function(k, v) {
                                        	if (v.sapInvoiceAmount) {
                                        		v.invoiceAmount = v.sapInvoiceAmount;
                                        	} else {
                                        		v.invoiceAmount = v.invoiceComputedAmount;
                                        	}
                                        });
                                    }
                                    if (vm.app_id == "labs" && vm.screen_id == "labresult") {
                                        vm.checkVerifiedDeliveryFromLabs("loadedData");
                                    }
                                    if (vm.app_id == "invoices") {
                                        $scope.initInvoiceScreen();
                                    }
                                    if (vm.app_id == "contracts") {
                                        $scope.initContractScreen();
                                    }
                                    if ($location.hash() == "mail") {
                                        $scope.sendEmails();
                                        $location.hash("");
                                    }
                                    if (vm.app_id == "admin" && vm.screen_id == "configuration") {
    	                            	$.each($scope.formValues.email, function(k,v){
		                            		if (v.toEmailsConfiguration) {
		                            			v.toEmailsConfiguration = v.toEmailsConfiguration.split(",");
		                            			tempToEmailsConfiguration = [];
		                            			$.each(v.toEmailsConfiguration, function(tok,tov){
		                            				tempToEmailsConfiguration.push({"id" : parseFloat(tov)});
		                            			})
		                        				$scope.formValues.email[k].toEmailsConfiguration = tempToEmailsConfiguration;
		                            		}
		                            		if (v.ccEmailsConfiguration) {
		                            			v.ccEmailsConfiguration = v.ccEmailsConfiguration.split(",");
		                            			tempCcEmailsConfiguration = [];
		                            			$.each(v.ccEmailsConfiguration, function(tok,tov){
			                            			tempCcEmailsConfiguration.push({"id" : parseFloat(tov)});
		                            			})
		                        				$scope.formValues.email[k].ccEmailsConfiguration = tempCcEmailsConfiguration;
		                            		}                            		
		                            	})
                                    }

                                }
                            },
                            screenChild
                        );
                    }
                    if (localStorage.getItem(vm.app_id + vm.screen_id + "_newEntity")) {
                        screenLoader.hideLoader();
                        data = angular.fromJson(localStorage.getItem(vm.app_id + vm.screen_id + "_newEntity"));
                        localStorage.removeItem(vm.app_id + vm.screen_id + "_newEntity");
                        $scope.formValues = data;
                    }
                }
            }
            $scope.loaded = true;
            $scope.undirtyForm();
        };
        vm.addHeadeActions = function() {
            $('.page-content-wrapper a[data-group="extern"]').each(function() {
                if ($(this).attr("data-compiled") == 0) {
                    if ($(this).attr("data-method") != "") {
                        $(this).attr("ng-click", $(this).data("method") + ';submitedAcc("' + $(this).data("method") + '")');
                        $(this).attr("data-method", "");
                        $(this).attr("data-compiled", 1);
                        $compile($(this))($scope);
                    }
                }
            });
            if (vm.app_id == "masters" && vm.screen_id == "counterparty") {
                $(".entity_active").attr("ng-model", "formValues.isDeleted");
            } else {
                $(".entity_active")
                    .attr("ng-checked", "!CM.entity_id || formValues.isDeleted == false")
                    .attr("ng-true-value", "false")
                    .attr("ng-false-value", "true")
                    .attr("ng-model", "formValues.isDeleted");
                $(".completed").attr("ng-model", "formValues.completed");
                if (vm.screen_id == "claimtype") {
                    $(".entity_active").attr("ng-disabled", "formValues.name ? true : false");
                }
            }
            $compile($(".entity_active"))($scope);
            $compile($(".completed"))($scope);
            // added++;
        };
        vm.delayaddHeadeActions = function() {
            return $timeout(vm.addHeadeActions, 100);
        };
        vm.delayaddModalActions = function() {
            setTimeout(function() {
                // $(this).unbind();
                $('.modal-content a[data-group="extern"]').each(function() {
                    if (!$(this).attr("ng-click")) {
                        $(this).attr("ng-click", $(this).data("method"));
                        $(this).attr("data-method", "");
                        $(this).attr("data-compiled", Number($(this).attr("data-compiled")) + 1);
                        $compile($(this))($scope);
                    }
                });
            }, 100);
        };
        vm.setPageTitle = function(title) {
            $state.params.title = title;
        };
        $scope.triggerChangeFields = function(name, id) {
            $rootScope.formDataFields = $scope.formValues;
            fields = ["OrderID", "labResultID", "deliveryNumber", "Product"];
            company_id = $("#companylistCompany").val();
            market_id = $("#MarketInstrumentMarketInstrument").val();
            if (typeof $scope.triggerChangeFieldsAppSpecific == "function") {
                $scope.triggerChangeFieldsAppSpecific(name, id);
            }
            if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
              if(name == 'EstimatedSettlementAmount') {
                if($scope.formValues.claimDetails.estimatedSettlementAmount < 0) {
                  $.each($scope.options.SettlementType, function(k, v) {
                    if(v.name === 'Receive') {
                      $scope.formValues.claimDetails.settlementType = v;
                      $scope.formValues.claimDetails.estimatedSettlementAmount *= -1;
                      toastr.info('The estimated settlement amount cannot be negative. The settlement type has been set to "Receive" and the amount is positive.');
                    }
                  });
                }
              }
              // else if($scope.formValues.claimDetails.estimatedSettlementAmount > 0) {
              //   $.each($scope.options.SettlementType, function(k, v) {
              //     if(v.name === 'Pay') {
              //       $scope.formValues.claimDetails.settlementType = v;
              //     }
              //   });
              // }
            }
            if (vm.app_id == "masters") {
                if (vm.screen_id == 'additionalcost' && name == 'CostType' &&
                    $scope.formValues && $scope.formValues.costType) {
                    if($scope.formValues.costType.name == 'Flat' || $scope.formValues.costType.name == 'Unit') {
                        $scope.formValues.componentType = null;
                        $('.edit_form_fields_ComponentType_masters').hide();
                    } else {
                        $('.edit_form_fields_ComponentType_masters').show();
                    }
                }               
                if (vm.screen_id == 'vessel' && id == 'temp.tanks.productType') {
                	setTimeout(function(){
	                	 $scope.options["ProductFiltered"] = $filter('filter')(angular.copy($listsCache.Product), {productTypeId:$scope.formValues.temp.tanks.productType.id} );
	                	 $scope.formValues.temp.tanks.product = null;
	                	 $scope.$apply();
                	},500);
                }
                if (vm.screen_id == 'vessel' && id == 'vesselType') {
                	setTimeout(function(){
                		if ($scope.formValues.usingVesselTypeRob) {
							$.each($scope.formValues.robs, function(rk,rv){
								rv.minQty = null
								rv.maxQty = null
							})
	                		$scope.triggerRobStandard(true);
							$scope.$apply();
                		}
                	},500);
                }                
                if (name == 'Buyer' && vm.screen_id == 'buyer') {
                  if($scope.formValues.user) {
                    // $scope.formValues.name = $scope.formValues.user.displayName;
                    Factory_Master.get_master_entity($scope.formValues.user.id, "users", "admin", function(response) {
                        if (response) {
                          // $scope.formValues.code = response.displayName;
                        }
                    });
                  }
                }
                if (name == "Company" && vm.screen_id == "exchangerate") {
                    Factory_Master.get_master_entity($scope.formValues.company.id, "company", "masters", function(response) {
                        if (response) {
                            $scope.formValues.baseCurrency = {};
                            $scope.formValues.baseCurrency = response.currencyId;
                        }
                    });
                }
                if (name == "DefaultFuelOil" && vm.screen_id == "vessel") {
                    var field = new Object();
                    field = vm.formFieldSearch($scope.formFields, "fuelOilSpecGroup");
                    if (field) vm.getOptions(field);
                }
 
                if (name == "DefaultDistillate" && vm.screen_id == "vessel") {
                    var field = new Object();
                    field = vm.formFieldSearch($scope.formFields, "distillateSpecGroup");
                    if (field) vm.getOptions(field);
                }
                if (name == "defaultLsfoProduct" && vm.screen_id == "vessel") {
                    var field = new Object();
                    field = vm.formFieldSearch($scope.formFields, "lsfoSpecGroup");
                    if (field) vm.getOptions(field);
                }
                if (name == "specParameter" && vm.screen_id == "specgroup") {
                    row = $('[name= "' + name + '"]').data("row-index");
                    setTimeout(function() {
                        val = $('[name= "' + name + '"]').data("cell-id");
                        Factory_Master.get_master_entity(val, "specparameter", "masters", function(response) {
                            if (response) {
                                $scope.formValues = $rootScope.formValuesLoaded;
                                $scope.formValues.specGroupParameters[row].uom = response.uom;
                            }
                        });
                    }, 1);
                }
                if (name == "InheritDefault" && vm.screen_id == "product") {
                    Factory_Master.get_master_entity($scope.formValues.parent.id, "product", "masters", function(response) {
                        if (response) {
                            $scope.formValues.defaultSpecGroup = response.defaultSpecGroup;
                        }
                    });
                }
                if (name == "systemInstrument" && vm.screen_id == "price") {
                    if ($scope.formValues.systemInstrument) {
                        Factory_Master.get_master_entity($scope.formValues.systemInstrument.id, "systeminstrument", "masters", function(response) {
                            if (response) {
                                $scope.formValues.marketInstrumentCode = response.marketInstrument.code;
                                $scope.formValues.code = response.marketInstrument.code;
                                $scope.formValues.period = null;
                                obj = [];
                                $.each(response.periods, function(key, value) {
                                    obj.push(value.period);
                                });
                                $scope.options.systemInstrumentPeriod = obj;
                            }
                        });
                    }
                }
                if (name == "MarketInstrument" && vm.screen_id == "systeminstrument") {
                    param = {
                        app: vm.app_id,
                        screen: vm.screen_id,
                        MarketInstrument: eval("$scope.formValues." + id + ".id")
                    };
                    Factory_Master.get_custom_dropdown(param, function(callback) {
                        if (callback) {
                            $scope.formValues.calendar = {
                                name: callback.calendar
                            };
                            $scope.formValues.currency = callback.currency;
                            $scope.formValues.uom = {
                                name: callback.uom
                            };
                        }
                    });
                    return;
                }
                if (name == "formulaFlatPercentage" && vm.screen_id == "formula") {
                    // set uom as null if formula changed and it's percentage
                    if (id != null) {
                        if (typeof $scope.formValues.complexFormulaQuoteLines[id].formulaFlatPercentage)
                            if ($scope.formValues.complexFormulaQuoteLines[id].formulaFlatPercentage.id == 2) {
                                $scope.formValues.complexFormulaQuoteLines[id].uom = null;
                            }
                    }
                }
                if(name == "transactionType" && vm.screen_id == "documenttype"){
                    var filters = [
                        {
                            ColumnName: "EmailTransactionTypeId",
                            Value: $scope.formValues.templates[id].transactionType.id
                        }
                    ];
                    var field = {
                        Name:"EmailTemplate_" + id,
                        Type:"lookup",
                        clc_id:"masters_documenttypetemplates",
                        filter: filters,
                        masterSource:"DocumentTypeTemplates"
                    }
                    vm.getOptions(field);
                }
            }
            if (name == "DocumentType") {
                // clone formValues to $rootScope { liviu.m. }
                $rootScope.formValues = $scope.formValues;
            }
            if (vm.app_id == "labs" && name == "OrderID" && id == "order") {
                vm.checkVerifiedDeliveryFromLabs("orderChange");
            }
        };

        vm.getDataTable = function(id, data, obj, idx, app, screen) {
            $scope.dynamicTable = [];
            if (!app) {
                app = vm.app_id;
            }
            if (!screen) {
                screen = vm.screen_id;
            }
            if (id) {
                id = id.toLowerCase();
                Factory_Master.getDataTable(app, screen, id, data, function(callback) {
                    if (callback) {
                        $scope.dynamicTable[id] = callback;
                        if (obj == "labTestResults") {
                            $scope.formValues.labTestResults = [];
                            $scope.formValues.labTestResults = callback;
                        } else if (obj == "deliveryProducts") {
                            $scope.formValues.deliveryProducts[idx].qualityParameters = [];
                            angular.merge($scope.formValues.deliveryProducts[idx].qualityParameters, callback);
                        } else if (obj == "sealNumber") {
                            $scope.formValues.labSealNumberInformation = [];
                            $scope.formValues.labSealNumberInformation = callback;
                        }
                        $scope.selectedReconProduct = null;
                    }
                });
            }
        };
        vm.useDisplayName = function(fieldName){
            var displayNameList = ['invoiceStatus','ClaimType'];
            var found = _.indexOf(displayNameList, fieldName);
            if(found < 0) return false;
            return true;
        }
        vm.getOptions = function(field, fromListsCache) {
            //Move this somewhere nice and warm
            var objectByString = function(obj, string) {
                if (string.includes(".")) {
                    return objectByString(obj[string.split(".", 1)], string.replace(string.split(".", 1) + ".", ""));
                } else {
                    return obj[string];
                }
            };
            if (!fromListsCache) {
                if (field == "agreementType") field = { name: "AgreementType" };

                if (field) {
                    if (!$scope.options) {
                        $scope.options = [];
                    }

                    // setTimeout(function() {
                    if (field.Filter && typeof $scope.formValues != "undefined") {
                        field.Filter.forEach(function(entry) {
                            if (entry.ValueFrom == null) return;
                            var temp = 0;
                            try {
                                temp = eval("$scope.formValues." + entry.ValueFrom);
                            } catch (error) {}
                            entry.Value = temp;
                        });
                    }
                    retFunc = false;
                    if (field.Name == "Product") {
                        $.each(field.Filter, function(key, val) {
                            if (val.ColumnName == "OrderId") if (val.Value == 0) retFunc = true;
                        });
                    }
                    if (retFunc) return;

                    var app_id = vm.app_id;
                    var screen_id = vm.screen_id;
                    if ($state.params.title == "New Request" || $state.params.title == "Edit Request") {
                        app_id = "procurement";
                        screen_id = "request";

                        if (field.Name == "BunkerablePort") {
                            if (typeof field.filters != "undefined" && field.filters != null) {
                                field.Filters = [
                                    {
                                        ColumnName: "VesselId",
                                        Value: field.filters.name.id
                                    },
                                    {
                                        ColumnName: "VesselVoyageDetailId",
                                        Value: null
                                    }
                                ];
                                delete field.filters;
                            }
                        }
                        if (field.Name == "Buyer") {
                            if (typeof field.filters != "undefined" && field.filters != null) {
                                field.Filters = [
                                    {
                                        ColumnName: "VesselId",
                                        Value: field.filters.name.id
                                    },
                                    {
                                        ColumnName: "VesselVoyageDetailId",
                                        Value: null
                                    }
                                ];
                                delete field.filters;
                            }
                        }
                    }

                    // if()
                    Factory_Master.get_master_list(app_id, screen_id, field, function(callback) {
                        if (callback) {
                            $scope.options[field.Name] = callback;
                            if (vm.app_id == "masters" && vm.screen_id == "vessel") vm.checkSpecGroup(field);
                            $scope.$watchGroup([$scope.formValues, $scope.options], function() {
                                $timeout(function() {
                                    if (field.Type == "textUOM") {
                                        id = "#" + field.Name;
                                    } else {
                                        id = "#" + field.masterSource + field.Name;
                                    }
                                    if ($(id).data("val")) {
                                        $(id).val($(id).data("val"));
                                    }
                                }, 50);
                            });
                        }
                    });
                    // }, 1000)
                }
            } else {
                //get values from listsCache, put in options obj for specific dropdowns
                //get options for request status
                if (field.Name == "etaFreezeStatus" && field.masterSource) {
                    $scope.options["etaFreezeStatus"] = [];
                    $scope.options["etaFreezeStatus"] = angular.copy($scope.listsCache.RequestStatus);
                }
                if (field.Name == "numberOfCounterpartiesToDisplay") {
                    console.log(vm.listsCache);
                    $scope.options["numberOfCounterpartiesToDisplay"] = [];
                    $.each(vm.listsCache.ItemsToDisplay, function(key, val) {
                        $scope.options["numberOfCounterpartiesToDisplay"].push(val.name);
                    });
                }
            }
        };
        $scope.$watchGroup(
            ["formValues.defaultFuelOilProduct", "formValues.defaultDistillateProduct", "formValues.defaultLsfoProduct"],
            function(newVal, oldVal) {
                if ($scope.formValues.defaultFuelOilProduct == "" || $scope.formValues.defaultFuelOilProduct == null) {
                    $scope.formValues.fuelOilSpecGroup = null;
                }
                if ($scope.formValues.defaultDistillateProduct == "" || $scope.formValues.defaultDistillateProduct == null) {
                    $scope.formValues.distillateSpecGroup = null;
                }
                if ($scope.formValues.defaultLsfoProduct == "" || $scope.formValues.defaultLsfoProduct == null) {
                    $scope.formValues.lsfoSpecGroup = null;
                }
            },
            true
        );
        vm.checkSpecGroup = function(field) {
            var map = {
                FuelOilSpec: "fuelOilSpecGroup",
                DistillateSpec: "distillateSpecGroup",
                lsfoSpecGroup: "lsfoSpecGroup"
            };
            if (typeof map[field.Name] == "undefined") return;
            if (typeof $scope.options[field.Name] != "undefined" && $scope.options[field.Name][0].id != -1 && typeof $scope.formValues != "undefined" && typeof $scope.formValues[map[field.Name]] != "undefined") {
                if ($scope.options[field.Name].length > 0) {
                    found = false;
                    $.each($scope.options[field.Name], function(key, val) {
                        if (typeof val != "undefined") if (val.id == $scope.formValues[map[field.Name]].id) found = true;
                    });
                    if (!found) $scope.formValues[map[field.Name]] = null;
                } else {
                    $scope.formValues[map[field.Name]] = null;
                }
            } else {
                $scope.formValues[map[field.Name]] = null;
            }
        };
        vm.deleteContactFromMasterEdit = function(key, value, screen, confirmed) {
            // vm.confimContactDelete = confirm("Are you sure you want to delete contact?");
            // if(vm.confimContactDelete){

            if (confirmed) {
                if (typeof value.id != "undefined") {
                    if (value.id == 0) {
                        $scope.formValues.contacts.splice(key, 1);
                    } else {
                        //fo call and if ok delete from ui too
                        var payload = {
                            app: "masters",
                            screen: vm.screen_id,
                            delete_list: "contacts",
                            data: {
                                id: value.id,
                                counterpartyId: vm.entity_id,
                                isDeleted: true
                            }
                        };
                        Factory_Master.deleteContact(payload, function(response) {
                            if (response.status) {
                                $scope.formValues.contacts.splice(key, 1);
                                toastr.success("Contact deleted!");
                            }
                        });
                    }
                } else {
                    $scope.formValues.contacts.splice(key, 1);
                }
            } else {
                $scope.confirmDeleteContact = {
                    key: key,
                    value: value,
                    screen: screen
                };
                $scope.modalInstance = $uibModal.open({
                    templateUrl: "app-general-components/views/modal_confirmDeleteContact.html",
                    size: "full",
                    appendTo: angular.element(document.getElementsByClassName("page-container")),
                    windowTopClass: "fullWidthModal smallModal",
                    scope: $scope //passed current scope to the modal
                });
            }
        };
        vm.getClaimOptions = function(master, claimType) {
            $scope.claimsOptions = [];
            if ($scope.formValues.orderDetails && $scope.formValues.orderDetails.order) {
                order_id = $scope.formValues.orderDetails.order.id;
            } else {
                order_id = null;
            }
            if ($scope.formValues.orderDetails.labResult) {
                lab_result_id = $scope.formValues.orderDetails.labResult.id;
            } else {
                lab_result_id = null;
            }
            product_id = $scope.formValues.orderDetails.deliveryProductId;
            field = {
                Name: master,
                Type: "dropdown",
                masterSource: master
            };
			claimTypeName = null;
            $.each(vm.listsCache['ClaimType'], function(k,v){
            	if (v.id == claimType) {
					claimTypeName = v.name
            	}
            })
            field.param = {
                OrderId: order_id,
                DeliveryProductId: product_id,
                LabResultId: lab_result_id,
                ClaimTypeId: claimType,
                ClaimTypeName: claimTypeName
            };
            Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, function(callback) {
                if (callback) {
                    $scope.claimsOptions = callback;
                }
            });
            return $scope.claimsOptions;
        };
        vm.datepickers = function(id, defToday, type, unique) {
            if (jQuery().datepicker) {
                // console.log(id)
                if (id) {
                    if (id.indexOf("Date") > -1) {
                        type = "date";
                    }
                }
                if (type == "date") {
                    pickers = $(".formatted-date");
                    dateFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;
                    dateFormat = dateFormat
                        .replace(/d/g, "D")
                        .replace(/y/g, "Y")
                        .split(" ")[0];
                    disabledDates = [];
                    if (unique) {
                        $.each(pickers, function(key, value) {
                            var dateTime = $(value).text();
                            if (dateTime) {
                                date = fecha.parse(dateTime, dateFormat);
                                if (!date) {
                                    fecha.masks.customFormat = "DD/MM/YYYY";
                                    date = fecha.parse(dateTime, "customFormat");
                                }
                                var utc = date.getTime() - date.getTimezoneOffset() * 60000; // utc time
                                date = new Date(utc);
                                date = vm.formatDate(date, "yyyy-MM-dd");
                                disabledDates.push(date);
                            }
                        });
                    }
                    setTimeout(function() {
                        //datepicker gets innitialized after datetimpepicker.
                        //if you want datetime-picker, add class datetime-picker
                        $(".date-picker")
                            .not(".datetime-picker")
                            .datetimepicker("remove");
                        $(".date-picker")
                            .not(".datetime-picker")
                            .not(".disabled")
                            .datetimepicker({
                                autoclose: true,
                                format: "yyyy-mm-ddT12:00:00Z",
                                datesDisabled: disabledDates,
                                todayHighlight: true,
                                pickTime: false,
                                minView: 2
                            });
                        // $("#StartDate").datepicker("setDate", startDate);
                        console.log("init datetimepicker");
                        // console.log($(this))
                    }, 10);
                } else {
                    $(".date-picker").datepicker("remove");
                    $(".date-picker")
                        .not(".disabled")
                        .not('[data-datepicker-init="true"]')
                        .datetimepicker({
                            showMeridian: "true",
                            autoclose: true,
                            todayHighlight: true,
                            todayBtn: false,
                            format: "yyyy-mm-ddThh:ii:ssZ"
                        });
                    console.log("init datepicker");
                }
                setTimeout(function() {
                    $(".datetimepicker").addClass("ejDatepicker");
                }, 10);
                if (defToday) {
                    setTimeout(function() {
                        var d = new Date();
                        month = d.getMonth() + 1;
                        day = d.getDate();
                        hours = d.getHours();
                        minutes = d.getMinutes();
                        seconds = d.getSeconds();
                        if (month < 10) {
                            month = "0" + month;
                        }
                        if (day < 10) {
                            day = "0" + day;
                        }
                        if (hours < 10) {
                            hours = "0" + hours;
                        }
                        if (minutes < 10) {
                            minutes = "0" + minutes;
                        }
                        if (seconds < 10) {
                            seconds = "0" + seconds;
                        }
                        date = d.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
                        $("#" + id)
                            .val(date)
                            .datetimepicker("update")
                            .trigger("change");
                    }, 500);
                }
            }
        };
        vm.formatDate = function(elem, dateFormat) {
            if (elem) {
                formattedDate = elem;
                var date = Date.parse(elem);
                date = new Date(date);
                if (date) {
                    var utc = date.getTime() + date.getTimezoneOffset() * 60000;
                    // var utc = date.getTime();
                    if (dateFormat.name) {
                        dateFormat = dateFormat.name.replace(/d/g, "D").replace(/y/g, "Y");
                    } else {
                        dateFormat = dateFormat.replace(/d/g, "D").replace(/y/g, "Y");
                    }
                    formattedDate = fecha.format(utc, dateFormat);
                }
                return formattedDate;
            }
        };
        $scope.toUTCDate = function(date) {
            var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        };
        vm.formatDateTime = function(elem, dateFormat, fieldUniqueId) {
            // console.log(fieldUniqueId)
            if (elem) {
                dateFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;
                dateFormat = dateFormat.replace(/D/g, "d").replace(/Y/g, "y");
                if (typeof fieldUniqueId == "undefined") {
                    fieldUniqueId = "date";
                }
                if (fieldUniqueId == "deliveryDate" && vm.app_id == "recon") {
                    return vm.formatDate(elem, "dd/MM/yyyy");
                }
                if (fieldUniqueId == "invoiceDate" && vm.app_id == "invoices") {
                    return vm.formatDate(elem, "dd/MM/yyyy");
                }
                if (fieldUniqueId == "eta" || fieldUniqueId == "orderDetails.eta" || fieldUniqueId == "etb" || fieldUniqueId == "etd" || fieldUniqueId.toLowerCase().indexOf("delivery") >= 0 || fieldUniqueId == "pricingDate") {
                    // debugger;
                    // return moment.utc(elem).format($scope.tenantSetting.tenantFormatss.dateFormat.name);
                    utcDate = moment.utc(elem).format();
                    formattedDate = $filter("date")(utcDate, dateFormat, 'UTC');
                    // return moment.utc(elem).format(dateFormat);
                } else {
                    formattedDate = $filter("date")(elem, dateFormat);
                }
                return formattedDate;
            }
        };
        vm.formatSimpleDate = function(date) {
            dateFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;
            window.tenantFormatsDateFormat = dateFormat;
            dateFormat = dateFormat.replace(/d/g, "D").replace(/y/g, "Y").split(' ')[0];
            if (date) {
                return moment.utc(date).format(dateFormat);
            }
            return;
        };
        vm.multiTagsContractProducts = function(object, idx, id, uniqueID) {
            setTimeout(function() {
                if (vm.app_id == "contracts" && vm.screen_id == "contract") {
                    var arrayHolder = "products";
                }
                var elt = $(".object_tagsinput_" + id),
                    elt_plus = $(".object_tagsinput_add_" + id);
                elt.tagsinput({
                    itemValue: "value",
                    itemText: "text"
                });
                $.each(object, function(index, value) {
                    elt.tagsinput("add", {
                        value: value.id,
                        text: value.name
                    });
                });
                var elt = $(".object_tagsinput_" + id),
                    elt_plus = $(".object_tagsinput_add_" + id);
                elt.tagsinput({
                    itemValue: "value",
                    itemText: "text"
                });
                $.each($scope.formValues[arrayHolder], function(index, value) {
                    if (!value[uniqueID]) {
                        value[uniqueID] = [];
                    }
                });
                $.each($scope.formValues[arrayHolder][idx][uniqueID], function(index, value) {
                    elt.tagsinput("add", {
                        value: value.id,
                        text: value.name
                    });
                    hideTheChildren();
                });
                var added = [];
                elt_plus.on("click", function() {
                    var source = $("[id=" + id + "]");
                    $.each($scope.formValues[arrayHolder][idx][uniqueID], function(index, value) {
                        if ($.inArray(value.id, added) == -1) {
                            added.push(value.id);
                        }
                    });
                    objectToAdd = JSON.parse(source.attr("data-value"));
                    if ($.inArray(objectToAdd.id, added) == -1) {
                        $scope.formValues[arrayHolder][idx][uniqueID].push(objectToAdd);
                        elt.tagsinput("add", {
                            value: objectToAdd.id,
                            text: objectToAdd.name
                        });
                    } else {
                        toastr.error("Field is already added.");
                    }
                    hideTheChildren();
                    $.each($(".bootstrap-tagsinput .tag"), function(k, v) {
                        $(this).attr("tooltip", "");
                        $(this).attr("data-original-title", $(v).text());
                        $(v)
                            .tooltip("show")
                            .tooltip("hide");
                    });
                });
                $(elt).on("itemRemoved", function(event) {
                    var idToRemove = event.item.value;
                    $.each($scope.formValues[arrayHolder][idx][uniqueID], function(index, value) {
                        if (value.id == idToRemove) {
                            indexRmv = index;
                        }
                    });
                    $scope.formValues[arrayHolder][idx][uniqueID].splice(indexRmv, 1);
                    added.splice(added.indexOf(idToRemove, 1));
                    hideTheChildren();
                    $(".tooltip").tooltip("hide");
                });

                function hideTheChildren() {
                    currentTags = elt.next(".bootstrap-tagsinput").children(".label");
                    currentTags.removeAttr("big-child");
                    currentTags.show();
                    currentTags.css("clear", "none");
                    currentTags
                        .parent(".bootstrap-tagsinput")
                        .children(".hideTagsChild")
                        .remove();
                    $.each(currentTags, function(index, value) {
                        if (index > 2) {
                            $(this)
                                .parent(".bootstrap-tagsinput")
                                .addClass("expanded");
                            $(this)
                                .parents(".multi_lookup_tags")
                                .addClass("expanded");
                            if (index % 3 == 0) {
                                $(this).css("clear", "both");
                            }
                            $(this).attr("big-child", "true");
                        }
                    });
                    if (currentTags.length > 3 && !elt.next(".bootstrap-tagsinput").children(".hideTagsChild").length) {
                        currentTags.parent().prepend("<span class='hideTagsChild'><i class='fa fa-ellipsis-h' aria-hidden='true'></i><span>");
                        $(".hideTagsChild_" + id).css("float", "right");
                    } else {
                        currentTags.parent(".bootstrap-tagsinput").removeClass("expanded");
                        currentTags.parents(".multi_lookup_tags").removeClass("expanded");
                    }
                }
            }, 50);
        };
        $scope.multiTags = function(id, idx, name) {
            console.log("$scope.multiTags");
            var elt = $(".object_tagsinput_" + id),
                elt_plus = $(".object_tagsinput_add_" + id);
            elt.tagsinput({
                itemValue: "value",
                itemText: "text"
            });
            $(elt).on("itemAdded", function(event) {
                if (id == "agents") {
                    index = $scope.formValues[id].length - 1;
                    selectDefaultAgent(id, index);
                }
            });
            $(elt).on("itemRemoved", function(event) {
                var idToRemove = event.item.value;
                $.each($scope.formValues[id], function(index, value) {
                    if (id == "applications" && vm.screen_id == "sellerrating") {
                        if (value.module.id == idToRemove) {
                            indexRmv = index;
                        }
                    } else {
                        indexRmv = null;
                        if (typeof value == "undefined") {
                            return;
                        }
                        console.log(value.id);
                        console.log(idToRemove);
                        if (id == "agents") {
                            comparator = "counterpartyId";
                            if (value[comparator] == idToRemove) {
                                indexRmv = index;
                                console.log($scope.formValues[id][index]);
                                $("*").tooltip("destroy");
                                if ($scope.formValues[id][index].id > 0) {
                                    $scope.formValues[id][index].isDeleted = true;
                                } else {
                                    $scope.formValues[id].splice(index, 1);
                                }
                            }
                        } else {
                            comparator = "id";
                            if (value[comparator] == idToRemove) {
                                indexRmv = index;
                                $scope.formValues[id].splice(index, 1);
                            }
                        }
                    }
                });
                hideTheChildren();
            });
            elt_plus.on("click", function() {
                if (idx >= 0) {
                    selector = id + idx;
                } else {
                    selector = id;
                }
                if ($("#" + selector).attr("data-value") != "") {
                    var itemToAdd = {};
                    if (id == "agents") {
                        $.each($scope.options.Agents, function(index, value) {
                            if ($("#agentsVal").val() == value.id) {
                                itemToAdd = {
                                    counterpartyId: value.id,
                                    counterpartyName: value.name,
                                    id: 0,
                                    isDefault: false
                                };
                            }
                        });
                    } else {
                        $.each($scope.options[name], function(index, value) {
                            selectorElement = $("#" + selector + ':not([data-value^="{{"])');
                            if (selectorElement.attr("data-value") == value.id) {
                                itemToAdd = {
                                    id: value.id,
                                    name: value.name
                                };
                            }
                        });
                    }
                    if ($scope.formValues[id] == "" || !$scope.formValues[id]) {
                        $scope.formValues[id] = [];
                        if (id == "agents" && itemToAdd) {
                            $scope.formValues[id].push(itemToAdd);
                            elt.tagsinput("add", {
                                value: itemToAdd.counterpartyId,
                                text: itemToAdd.counterpartyName
                            });
                        } else if (id == "applications" && vm.screen_id == "sellerrating") {
                            $scope.formValues["applications"].push({
                                module: {
                                    id: itemToAdd.id,
                                    name: itemToAdd.name
                                }
                            });
                            elt.tagsinput("add", {
                                value: itemToAdd.id,
                                text: itemToAdd.name
                            });
                        } else if (id == "allowedCompanies" && vm.screen_id == "contract") {
                            if (itemToAdd.id != $scope.formValues.company.id) {
                                $scope.formValues[id].push(itemToAdd);
                                // $scope.formValues[id].push('asdaskdnqw');
                                elt.tagsinput("add", {
                                    value: itemToAdd.id,
                                    text: itemToAdd.name
                                });
                            } else {
                                toastr.error("This is main company");
                            }
                        }
                    } else {
                        var added = [];
                        if (id == "agents") {
                            $.each($scope.formValues.agents, function(index, value) {
                                added.push(value.counterpartyId);
                            });
                            console.log(itemToAdd);
                            if ($.inArray(itemToAdd.counterpartyId, added) == -1 && itemToAdd.id >= 0) {
                                $scope.formValues.agents.push(itemToAdd);
                                elt.tagsinput("add", {
                                    value: itemToAdd.counterpartyId,
                                    text: itemToAdd.counterpartyName
                                });
                            }
                        } else if (id == "applications" && vm.screen_id == "sellerrating") {
                            $.each($scope.formValues.applications, function(index, value) {
                                added.push(value.module.id);
                            });
                            if ($.inArray(itemToAdd.id, added) == -1) {
                                $scope.formValues["applications"].push({
                                    module: {
                                        id: itemToAdd.id,
                                        name: itemToAdd.name
                                    }
                                });
                                elt.tagsinput("add", {
                                    value: itemToAdd.id,
                                    text: itemToAdd.name
                                });
                            }
                        }
                    }
                }
                hideTheChildren();
            });
            if (idx >= 0) {
                var values = $scope.formValues.products[idx].allowedProducts;
            } else {
                var values = $scope.formValues[id];
            }
            if (values) {
                if (id == "agents") {
                    $.each(values, function(index, value) {
                        if (!value.isDeleted || value.isDeleted == false) {
                            if (index > 2) {
                                $(this).hide();
                            }
                            console.log(value);
                            elt.tagsinput("add", {
                                value: value.counterpartyId,
                                text: value.counterpartyName
                            });
                            selectDefaultAgent(id, index);
                        }
                    });
                } else {
                    $.each(values, function(index, value) {
                        if (index > 2) {
                            $(this).hide();
                        }
                        elt.tagsinput("add", {
                            value: value.id,
                            text: value.name
                        });
                    });
                    $scope.initMultiTags(id);
                }
            }
            hideTheChildren();

            function hideTheChildren() {
                currentTags = elt.next(".bootstrap-tagsinput").children(".label");
                currentTags.removeAttr("big-child");
                currentTags.show();
                currentTags.css("clear", "none");
                currentTags
                    .parent(".bootstrap-tagsinput")
                    .children(".hideTagsChild")
                    .remove();
                $.each(currentTags, function(index, value) {
                    if (index > 2) {
                        $(this)
                            .parent(".bootstrap-tagsinput")
                            .addClass("expanded");
                        $(this)
                            .parents(".multi_lookup_tags")
                            .addClass("expanded");
                        if (index % 3 == 0) {
                            $(this).css("clear", "both");
                        }
                        $(this).attr("big-child", "true");
                    }
                });
                if (currentTags.length > 3 && !elt.next(".bootstrap-tagsinput").children(".hideTagsChild").length) {
                    currentTags.parent().prepend("<span class='hideTagsChild'><i class='fa fa-ellipsis-h' aria-hidden='true'></i><span>");
                    $(".hideTagsChild_" + id).css("float", "right");
                } else {
                    currentTags.parent(".bootstrap-tagsinput").removeClass("expanded");
                    currentTags.parents(".multi_lookup_tags").removeClass("expanded");
                }
            }

            function selectDefaultAgent(id, index, e) {
                $(".tagsFor" + id + " .bootstrap-tagsinput .tag")
                    .last()
                    .append('<input class="defaulttag "  type="checkbox"  name="defaulttag[]" ng-model="formValues.agents[' + index + '].isDefault">');
                $compile($(".defaulttag"))($scope);
                return;
            }
            var childExpanded = false;
            $("body").on("click", ".bootstrap-tagsinput .hideTagsChild", function() {
                if (childExpanded == true) {
                    $(this)
                        .parent(".bootstrap-tagsinput")
                        .children("span.tag[big-child='true']")
                        .hide();
                    $(this)
                        .parent(".bootstrap-tagsinput")
                        .removeClass("expanded");
                    $(this)
                        .parents(".multi_lookup_tags")
                        .removeClass("expanded");
                    childExpanded = false;
                } else {
                    $(this)
                        .parent(".bootstrap-tagsinput")
                        .children("span.tag[big-child='true']")
                        .show();
                    $(this)
                        .parent(".bootstrap-tagsinput")
                        .addClass("expanded");
                    $(this)
                        .parents(".multi_lookup_tags")
                        .addClass("expanded");
                    childExpanded = true;
                }
            });
        };
        $scope.initMultiTags = function(id) {
            var elt = $(".object_tagsinput_" + id);
            elt.tagsinput({
                itemValue: "value",
                itemText: "text"
            });
            elt.tagsinput("removeAll");
            if (vm.screen_id == "sellerrating") {
                var values = $scope.formValues[id];
                values = [];
                $.each($scope.formValues[id], function(index, value) {
                    values.push(value.module);
                });
            } else {
                var values = $scope.formValues[id];
            }
            $.each(values, function(index, value) {
                elt.tagsinput("add", {
                    value: value.id,
                    text: value.name
                });
            });
            hideTheChildren();

            function hideTheChildren() {
                currentTags = elt.next(".bootstrap-tagsinput").children(".label");
                currentTags.removeAttr("big-child");
                currentTags.show();
                currentTags.css("clear", "none");
                currentTags
                    .parent(".bootstrap-tagsinput")
                    .children(".hideTagsChild")
                    .remove();
                $.each(currentTags, function(index, value) {
                    if (index > 2) {
                        $(this)
                            .parent(".bootstrap-tagsinput")
                            .addClass("expanded");
                        $(this)
                            .parents(".multi_lookup_tags")
                            .addClass("expanded");
                        if (index % 3 == 0) {
                            $(this).css("clear", "both");
                        }
                        $(this).attr("big-child", "true");
                    }
                });
                if (currentTags.length > 3 && !elt.next(".bootstrap-tagsinput").children(".hideTagsChild").length) {
                    currentTags.parent().prepend("<span class='hideTagsChild'><i class='fa fa-ellipsis-h' aria-hidden='true'></i><span>");
                    $(".hideTagsChild_" + id).css("float", "right");
                } else {
                    currentTags.parent(".bootstrap-tagsinput").removeClass("expanded");
                    currentTags.parents(".multi_lookup_tags").removeClass("expanded");
                }
                setTimeout(function() {
                    $(".bootstrap-tagsinput")
                        .children("span.tag[big-child='true']")
                        .hide();
                    $(".bootstrap-tagsinput").removeClass("expanded");
                    $(".multi_lookup_tags").removeClass("expanded");
                }, 1);
            }
        };
        $scope.addTagToMulti = function(model, data) {
            vm.plusClickedMultilookup = true;
            alreadyAdded = false;
            if (!$scope.formValues[model] || typeof $scope.formValues[model] == "undefined") {
                $scope.formValues[model] = [];
            }
            if (model != "" && typeof $scope.formValues[model] != "undefined") {
                $.each($scope.formValues[model], function(k, v) {
                    if (v.id == data.id) {
                        alreadyAdded = true;
                    }
                });
            }
            if (alreadyAdded == true) {
                toastr.error("Field is already added!");
            } else {
                $scope.formValues[model].push(data);
            }
        };
        vm.initDropZone = function(id) {
            $timeout(function() {
                Dropzone.autoDiscover = false;
                // or disable for specific dropzone:
                $(function() {
                    // Now that the DOM is fully loaded, create the dropzone, and setup the
                    // event listeners
                    var myDropzone = new Dropzone("#" + id, {
                        url: "#"
                    });
                    myDropzone.on("addedfile", function(file) {
                        if (id == "general_information_upload") {
                            $("#" + id + " input").val(file.name);
                        }
                        // Create the remove button
                        var removeButton = Dropzone.createElement("<a href='javascript:;'' class='btn red btn-sm btn-block'>Remove</a>");
                        // Capture the Dropzone instance as closure.
                        var _this = this;
                        // Listen to the click event
                        removeButton.addEventListener("click", function(e) {
                            // Make sure the button click doesn't submit the form:
                            e.preventDefault();
                            e.stopPropagation();
                            // Remove the file preview.
                            _this.removeFile(file);
                            // If you want to the delete the file on the server as well,
                            // you can do the AJAX request here.
                        });
                        // Add the button to the file preview element.
                        file.previewElement.appendChild(removeButton);
                    });
                });
            }, 10);
        };
        vm.equalizeColumnsHeight = function(elements) {
            elementsArray = elements.split(", ");
            var t = 0; // the height of the highest element (after the function runs)
            var t_elem; // the highest element (after the function runs)
            $timeout(function() {
                $.each(elementsArray, function(index, value) {
                    if ($(value).innerHeight() > t) {
                        t_elem = this;
                        t = parseFloat($(value).outerHeight() - 25);
                    }
                });
                $.each(elementsArray, function(index, value) {
                    $(value + " .portlet").css("minHeight", t);
                });
            }, 500);
        };
        vm.equalizeColumnsHeightGrouped = function(element, group) {
            groupElements = group.split(", ");
            $timeout(function() {
                var groupHeight = 0;
                var groupMargin = 0;
                $.each(groupElements, function(index, value) {
                    if ($(value).length > 0) {
                        groupHeight += parseFloat($(value).outerHeight());
                        groupMargin += parseFloat($(value + " .portlet").css("margin-bottom"));
                    }
                });
                calcHeight = parseFloat(groupHeight - 10);
                $(element + " .portlet").css("height", calcHeight);
                $(element + " .portlet").css("overflow", "auto");
            }, 1000);
        };
        vm.cloneEntity = function(group, obj) {
            if (obj) {
                new_obj = angular.copy(obj);
                new_obj.id = 0;
                new_obj.isActive = true;
                $scope.formValues[group].push(new_obj);
            } else {
                var index = Object.keys($scope.formValues[group]).length;
                $scope.formValues[group][index] = new Object();
            }
        };
        vm.addCounterpartyContact = function() {
            $scope.formValues.contacts.push({
                isActive: true
            });
            // debugger;
        };
        vm.addVesselContact = function() {
            $scope.formValues.contacts.push({
                isActive: true,
                id: 0
            });
            // debugger;
        };
        vm.cloneField = function(field, index) {
            $scope.formFields[field.Group].children.splice(index, 0, angular.copy(field));
        };
        vm.remField = function(field, index) {
            $scope.formFields[field.Group].children.splice(index, 1);
        };
        vm.softDelete = function(item, key) {
            if (!item[key].id || item[key].id == 0) {
                if (item.length > 1) {
                    item.splice(key, 1);
                } else {
                    item[key] = {};
                }
            } else {
                item[key].isDeleted = true;
                if (key == 0) {
                    item.push({});
                }
            }
        };
        vm.deleteAdditionalCost = function(productId, key, emptyArray) {
            if (!$scope.formValues.products[productId].additionalCosts[key].id || $scope.formValues.products[productId].additionalCosts[key].id == 0) {
                if ($scope.formValues.products[productId].additionalCosts.length > 0) {
                    $scope.formValues.products[productId].additionalCosts.splice(key, 1);
                } else {
                    if (emptyArray) {
                        $scope.formValues.products[productId].additionalCosts = [];
                        console.log($scope.formValues.products[productId].additionalCosts);
                    } else {
                        $scope.formValues.products[productId].additionalCosts[key] = {};
                    }
                }
            } else {
                $scope.formValues.products[productId].additionalCosts[key].isDeleted = true;
                if (key == 0) {
                    // $scope.formValues.products[productId].additionalCosts.push({});
                }
            }
        };
        $scope.current_field = {};
        var createNewField = function() {
            return {
                Active: true
            };
        };
        $scope.addElement = function(ele, idx) {
            $scope.current_field.Active = false;
            var returnKey = [];
            var addedFields = [];
            $.each($scope.formFields, function(key, info) {
                returnKey.push(info.children);
            });
            $.each(returnKey, function(keys, infos) {
                $.each(infos, function(key, info) {
                    addedFields.push(info.Unique_ID);
                });
            });
            if ($.inArray(ele.Unique_ID, addedFields) >= 0) {
                toastr.error("Field is already added. Please clone it!");
                return;
            }
            $scope.current_field = createNewField();
            $scope.activeField(ele);
            angular.merge($scope.current_field, ele);
            var group = $scope.current_field.Group;
            var new_group_id = Object.keys($scope.formFields).length;
            if (!group) {
                group = "custom_group" + new_group_id;
            }
            if (typeof $scope.formFields[group] == "undefined") {
                $scope.formFields[group] = {
                    id: group,
                    name: group,
                    children: []
                };
            }
            if (typeof idx == "undefined") {
                if (Object.keys($scope.formFields).indexOf($scope.current_field.Group) < 0) {
                    $scope.formFields[group].id = $scope.current_field.Group.replace(" ", "_");
                    $scope.formFields[group].name = $scope.current_field.Group;
                    $scope.formFields[group].children.push($scope.current_field);
                } else {
                    $scope.formFields[group].children.push($scope.current_field);
                }
            } else {
                var group = $scope.current_field.Group;
                $scope.formFields[group].splice(idx, 0, $scope.current_field);
                $("#fieldSettingTab_lnk").tab("show");
            }
        };
        $scope.activeField = function(f) {
            $scope.current_field.Active = false;
            f.Active = false;
            $scope.current_field = f;
            f.Active = true;
            $("#fieldSettingTab_lnk").tab("show");
        };
        $scope.activeGroup = function(g) {
            $scope.current_group = g;
            $scope.current_group.Active = true;
            $("#groupSettingTab_lnk").tab("show");
        };
        $scope.changeGroup = function() {
            var new_group = $scope.current_field.Group;
            var newField = angular.copy($scope.current_field);
            newField.Cloned = true;
            $scope.formFields[$.trim(new_group)].children.push(newField);
        };
        $scope.removeElement = function(parent, idx, unique_id) {
            $scope.formFields[parent].children[idx].Added = false;
            if ($scope.formFields[parent].children[idx].Active) {
                $("#addFieldTab_lnk").tab("show");
                $scope.current_field = {};
            }
            $scope.formFields[parent].children.splice(idx, 1);
            if ($scope.formFields[parent].children.length < 1) {
                delete $scope.formFields[parent];
            }
            toastr.success("Field deleted");
        };
        $scope.formbuilderSortableOpts = {
            "ui-floating": true,
            connectWith: "ul"
        };
        $scope.formbuilderSortableGroups = {
            "ui-floating": true,
            connectWith: ".formbuilder-group"
        };
        $timeout(function() {
            var hideableFields = $('.fe_entity:not([data-dependent=""])');
            $.each(hideableFields, function() {
                if ($(this).parents("#accordion1").length < 1) {
                    $(this).hide();
                }
            });
            var dataDependent = [];
            $(hideableFields).each(function() {
                dataDependent.push($(this).attr("data-dependent"));
            });
            dataDependent = $.unique(dataDependent);
            $.each(dataDependent, function(key, value) {
                if ($("input[type='radio'][name*=" + value + "]")) {
                    selectedRadioVal = $("input[type='radio'][name*=" + value + "]:checked").val();
                    fieldstoShow = $('.fe_entity[data-dependent="' + value + '"][data-show*="' + selectedRadioVal + '"]');
                    fieldstoShow.show();
                }
            });
        }, 50);
        $scope.checkIfTab = function() {
            $scope.$watch("formFields", function() {
                $timeout(function() {
                    tab = $(".grp_unit")
                        .children(".tab-pane")
                        .first()
                        .addClass("active in");
                    // console.log(tab);
                    $("#tabs_navigation")
                        .insertBefore(tab)
                        .removeClass("hidden");
                    $("#tabs_navigation ul li")
                        .first()
                        .addClass("active");
                }, 10);
            });
        };
        /**
         * Load DLC config using object
         */
        vm.load_dlc_config = function(structure, elements) {
            $scope.formFields = structure;
            $scope.dragElements = elements;
        };
        vm.load_eef_config = function(structure) {
            $scope.formFields = structure;
        };
        // -- data tables masterSource $scope lists --
        //
        // -- {end} data tables masterSource $scope lists --
        // -- Additional Costs SELECT
        if ($listsCache["AdditionalCost"]) {
            $scope.additionalCostsList = $listsCache["AdditionalCost"];
        }
        // -- Additional Costs SELECT
        $scope.getKeysCount = function(obj) {
            count = Object.keys(obj).length;
            return count;
        };
        $scope.refreshSelect = function() {};
        $scope.convertValues = function(oldObj, newObj, type, parent) {
            oldObj = eval(oldObj);
            param = {
                custom: type,
                data: {
                    from: oldObj,
                    to: newObj
                }
            };
            Factory_Master.exchangeRate(param, function(callback) {
                // callback = '1.5';
                if (callback) {
                    initial_val = $("#" + parent).val();
                    updated_val = initial_val * callback;
                    $("#" + parent).val(updated_val);
                }
            });
        };
        $scope.isVisible = function(id) {
            return $("#" + id).is(":visible");
        };
        $scope.fVal = function(id) {
            return $scope;
        };
        $scope.returnSelectName = function(id) {
            return $.trim($("#" + id + " option:selected").text());
        };
        $scope.showTab = function(id) {
            setTimeout(function() {
                $('.nav-tabs a[href="' + id + '"]')
                    .tab("show")
                    .trigger("click");
            }, 1);
        };
        $scope.removeSchedule = function(elem) {
            $scope.formValues[elem] = {};
        };
        $scope.addSchedule = function(elem) {
            if ($scope.formValues[elem].id > 0 && $scope.formValues[elem].isDeleted == false) {
                toastr.error("Schedule already added");
            } else {
                if ($scope.formValues[elem].id > 0) {
                    $scope.formValues[elem].isDeleted = false;
                } else {
                    $scope.formValues[elem].id = 0;
                }
            }
        };
        $scope.addData = function(obj) {
            obj = eval("$scope." + obj);
            obj.push({
                id: 0
            });
            if (vm.app_id == "claims" && vm.screen_id == "claims") {
                $.each(obj, function(key, val) {
                    if (val.id == 0) {
                        if (typeof val.createdBy == "undefined") {
                            val.createdBy = $rootScope.user;
                            val.createdBy.displayName = null;
                            val.createdBy.code = null;
                            val.createdBy.collectionName = null;
                        }
                        if (typeof val.createdOn == "undefined") {
                       
                            val.createdOn = moment().format();
                        }
                    }
                });
            }
        };
        $scope.remData = function(obj, row, idx) {
            obj = eval("$scope." + obj);
            index = obj.indexOf(row);
            length = 0;
            $.each(Object.values(obj), function(key, val) {
                if (!val.isDeleted) {
                    length++;
                }
            });
            if (vm.screen_id == "invoice" && vm.app_id == "invoices") {
            	if ($scope.formValues.status) {
	                if ($scope.formValues.status.name == "Approved") {
	                	if (obj[idx].id) {
		                    toastr.info("You cannot delete product if invoice status is Approved");
		                    return;
	                	}
	                }
            	}
                if (vm.entity_id) {
                	 $scope.sweetConfirm("Are you sure you want to delete this item?", function(response){
                	 	if (response == true) {
							if (row.id > 0) {
							    row.isDeleted = true;
								$scope.save_master_changes();
							} else {
							    obj.splice(index, 1);
							    $scope.$apply();
							}
                	 	}
                	 });
                } else {
                    if (row.id > 0 || !row.id) {
	                    row.isDeleted = true;
	                } else {
	                    // row.isDeleted = true;
	                    obj.splice(index, 1);
	                }
                }
                return;
            }


            if (length > 1) {
                if (row.id > 0) {
                    row.isDeleted = true;
                } else {
                    obj.splice(index, 1);
                }
            } else {
                if (row.id > 0) {
                    row.isDeleted = true;
                    if(vm.app_id !== 'claims' && vm.screen_id !== 'claims') {
                      obj.push({
                          id: 0
                      });
                    }
                } else {
                    obj.splice(index, 1);
                }
            }
        };
        $scope.showRow = function(row, grid) {
            if (angular.equals(grid.options.data, "formValues.periods")) {
                return true;
            } else {
                return !row.isDeleted;
            }
        };
        $scope.setDefaultValue = function(id, val) {
            $timeout(function() {
                $("#" + id)
                    .val(val)
                    .trigger("change");
            }, 10);
        };
        vm.enableMultiSelect = function(id, fromLabel, toLabel) {
            $timeout(function() {
                $("#" + id).multiSelect({
                    selectableHeader: "<div class='custom-header'>" + fromLabel + "</div>",
                    selectionHeader: "<div class='custom-header'>" + toLabel + "</div>"
                });
                $("#" + id)
                    .parents(".multiSelectSwitch")
                    .find(".ms-selectable")
                    .append('<span class="switches"><span>&gt;&gt;</span><span>&lt;&lt;</span></span>');
            }, 100);
        };
        $scope.mapLocation = function(name, id) {
            val = $('[name= "' + name + '"]').val();
            Factory_Master.get_master_entity(val, "location", "masters", function(response) {
                if (response) {
                    newSysInst = [];
                    i = 0;
                    $.each($scope.formValues.productsSystemInstruments, function(key, kval) {
                        if ((!kval.canBeDeleted && kval.id > 0) || (typeof kval.canBeDeleted === "undefined" && kval.id == 0)) {
                            newSysInst[key] = kval;
                            i++;
                        }
                    });
                    $.each(response.productsSystemInstruments, function(key, kval1) {
                        if (kval1.id) {
                            kval1.id = 0;
                            $scope.formValues.productsSystemInstruments.push(kval1);
                            // newSysInst[i] = kval1;
                        }
                    });
                    // $scope.formValues.productsSystemInstruments = [];
                    // $scope.formValues.productsSystemInstruments = newSysInst;
                }
            });
        };
        $scope.selectRow = function(row) {
            $scope.formValues.temp = {
                tanks: {}
            };
            $scope.formValues.temp.tanks = row.entity;
            index = row.grid.rows.indexOf(row);
            angular.merge($scope.formValues.tanks[index], $scope.formValues.temp.tanks);
            $scope.refreshValue = 1;
        };
        $scope.multiSelectLabTestResult = function(row) {
            if (typeof $scope.selectedRows == "undefined") {
                $scope.selectedRows = [];
            }
            selId = row.entity.id;
            if ($scope.selectedRows.indexOf(selId) == -1) {
                $scope.selectedRows.push(selId);
            } else {
                $scope.selectedRows.splice($scope.selectedRows.indexOf(selId), 1);
            }
        };
        $scope.clickUpload = function() {
            setTimeout(function() {
                angular.element("#fileUpload").trigger("click");
                angular.element("#FTPFileUpload").trigger("click");
            }, 1);
        };
        $scope.uploadFiles = function(name, id, file) {
            if (vm.entity_id > 0) {
                var formData = new FormData();
                formData.append("request", '{"Payload":{"Id":' + vm.entity_id + "}}");
                if (id == "drag") {
                    formData.append("file", file);
                } else {
                    $.each($("#fileUpload")[0].files, function(i, file) {
                        formData.append("file", file);
                    });
                }
                Factory_Master.upload_file(formData, function(callback) {
                    if (callback) {
                        $scope.getLogo(name);
                        toastr.success(callback);
                    }
                });
            } else {
                toastr.error("You must save company first");
            }
        };
        $scope.$watch("formValues", function(data) {
            $rootScope.formValues = data;
        });
        $rootScope.droppedDoc = null;
        $scope.dropDocument = function(file) {
            $rootScope.droppedDoc = file;
            $scope.droppedDoc = $rootScope.droppedDoc;
        };
        $scope.uploadDocument = function(selector) {
      
            var data = {
                request: {
                    Payload: {
                        name: "File2",
                        documentType: {}, // { "id":1, "name":"BDN","code":"","collectionName":null } (dinamic)
                        size: 100,
                        fileType: "FileType",
                        transactionType: {}, // {"id":1,"name":"Request","code":"","collectionName":null} (dinamic)
                        fileId: 1,
                        uploadedBy: {
                            id: 1,
                            name: "Admin",
                            code: "",
                            collectionName: null
                        },
                        uploadedOn: "2017-01-11T14:21:37.96",
                        notes: "",
                        isVerified: false,
                        referenceNo: 1,
                        createdBy: {
                            id: 1,
                            name: "Admin",
                            code: "",
                            collectionName: null
                        },
                        createdOn: "2017-01-11T14:21:37.96",
                        lastModifiedByUser: null,
                        lastModifiedOn: null,
                        id: 0,
                        isDeleted: false
                    }
                },
                file: {}
            };
            var FD = new FormData();
            // set data

            if($state.params.screen_id == "documenttype"){
                $rootScope.formValues.documentType = {
                    "id": $state.params.entity_id
                }
            }       
            data.request.Payload.documentType = $rootScope.formValues.documentType;
            data.request.Payload.isVerified = false; // default false
            if (!$rootScope.formValues.documentType) {
                toastr.error("Please fill in required fields: Document Type.");
                return false;
            }
            // isVerified = false
            // if ($rootScope.formValues.isVerified) {
	        //     if ($rootScope.formValues.isVerified.name == "Yes") {isVerified = true}
	        // 	if ($rootScope.formValues.isVerified.name != "Yes") {isVerified = false}
            // }
            // console.log(vm.app_id);
            // console.log(vm.screen_id);
            // console.log($state.current.name);
            var verifiedRequired = {
                "default.view-request-documents": true,
                "default.view-order-documents": true,
                'default.view-group-of-requests-documents': true,
                'delivery.documents': true,
                'labs.documents': true,
                'claims.documents': true,
                'invoices.documents': true,
                'contracts.documents': true,
                'masters.documents': true
            }
            var requiredFields = [];


            if (!$rootScope.formValues.documentType) requiredFields.push("Document Type");
            if(verifiedRequired[$state.current.name])
                // if(!$rootScope.formValues.isVerified)
                //     requiredFields.push("Is Verified");
            if(requiredFields.length){
                var error = "Please fill in required fields: ";
                $.each(requiredFields, function (key,val){
                    error += val + ",";
                })
                error = error.slice(0, -1);
                toastr.error(error);
                return false;
            }
             // if (!$rootScope.formValues.documentType || !$rootScope.formValues.isVerified) {
            // 	toastr.error("Please fill in required fields");
            // 	return false;
            // }
            data.request.Payload.referenceNo = $state.params.entity_id;
            if ($state.params.requestId) data.request.Payload.referenceNo = $state.params.requestId;

       
            var transactionType = {
                id: 0,
                name: "undefined",
                code: "",
                collectionName: null
            };
            var appPath = $state.current.name;
            // Id, Name
            //  1, Request
            //  2, Offer
            //  3, Order
            //  4, Delivery
            //  5, Invoice
            //  6, Labs
            //  7, Claims
            //  8, Masters
            //  9, Contract
            if (appPath.match(/view-request-documents/)) {
                transactionType.id = 1;
                transactionType.name = "Request";
            }
            if (appPath.match(/offer/)) {
                transactionType.id = 2;
                transactionType.name = "Offer";
            }
            if (appPath.match(/view-order-documents/)) {
                transactionType.id = 3;
                transactionType.name = "Order";
            }
            if (appPath.match(/delivery/)) {
                transactionType.id = 4;
                transactionType.name = "Delivery";
            }
            if (appPath.match(/invoices/)) {
                transactionType.id = 5;
                transactionType.name = "Invoice";
            }
            if (appPath.match(/labs/)) {
                transactionType.id = 6;
                transactionType.name = "Labs";
            }
            if (appPath.match(/claims/)) {
                transactionType.id = 7;
                transactionType.name = "Claims";
            }
            if (appPath.match(/masters/)) {
                transactionType.id = 8;
                transactionType.name = "Masters";
            }
            if (appPath.match(/contracts/)) {
                transactionType.id = 9;
                transactionType.name = "Contract";
            }
            // if (appPath.match(/view-group-of-requests-documents/)) {
            //     transactionType.id = 1;
            //     transactionType.name = "Request";
            // }
            if (appPath.match(/default.view-group-of-requests-documents/)) {
                transactionType.id = 2;
                transactionType.name = "Offer";
            }
  

            // master screens transaction types
            var screenTransactionTypeMap = {
                "additionalcost":     {   "id": 13, "name": "AdditionalCosts"},
                "agreementtype":        {   "id": 14, "name": "AgreementTypes"},
                "barge":         {   "id": 15, "name": "Barges"},
                "buyer":        {   "id": 16, "name": "Buyers"},
                "calendar":        {   "id": 17, "name": "Calendars"},
                "claimtype":       {   "id": 18, "name": "ClaimTypes"},
                "contacttype": {   "id": 20, "name": "ContactTypes"},
                "company":     {   "id": 19, "name": "Companies"},
                "pool":     {   "id": 19, "name": "Companies"},
                "counterparty":    {   "id": 21, "name": "Counterparties"},
                "country":        {   "id": 22, "name": "Countries"},
                "deliveryoption":      {   "id": 23, "name": "DeliveryOptions"},
                "event":       {   "id": 25, "name": "Events"},
                "exchangerate":     {   "id": 26, "name": "ExchangeRates"},
                "formula":         {   "id": 27, "name": "Formulas"},
                "incoterms":        {   "id": 28, "name": "Incoterms"},
                "location":        {   "id": 29, "name": "Locations"},
                "paymentterm":      {   "id": 31, "name": "PaymentTerms"},
                "period":        {   "id": 32, "name": "Periods"},
                "price":         {   "id": 33, "name": "Prices"},
                "pricetype":   {"id": 34, "name": "MarketPriceTypes"},
                "product":    {   "id": 35, "name": "Products"},
                "service":   {   "id": 36, "name": "Services"},
                "operator":  {   "id": 36, "name": "Services"},
                "specgroup":        {   "id": 37, "name": "SpecGroups"},
                "specparameter":    {   "id": 38, "name": "SpecParameters"},
                "status":         {   "id": 39, "name": "Statuses"},
                "strategy":         {   "id": 40, "name": "Strategies"},
                "systeminstrument":         {   "id": 41, "name": "SystemInstruments"},
                "uom":    {   "id": 42, "name": "Uoms"},
                "vessel":        {   "id": 43, "name": "Vessels"},
                "vesseltype":        {   "id": 44, "name": "VesselTypes"},
                "currency":         {   "id": 45, "name": "Currencies" }
            }


            // "documenttype":     {"id": 24, "name": "DocumentTypes"},
            if(screenTransactionTypeMap[$state.params.screen_id]){
                transactionType = screenTransactionTypeMap[$state.params.screen_id];
            }
      

            // finally set transaction type
            data.request.Payload.transactionType = transactionType;

            console.log('$state.params.screen_id', $state.params.screen_id);
            if($state.current.name == 'masters.documents' && $state.params.screen_id == "documenttype"){

              
                    //for master documenttype (only with documents upload) set referenceNo to a big number
                    data.request.Payload.referenceNo = Number.MAX_SAFE_INTEGER;

                    // set document type to current document type (if uploading from document type)
                    // data.request.Payload.documentType = {
                    //     "id": $state.params.entity_id
                    // }
    
                    //se trasaction type from list
                    Factory_Master.get_master_entity(vm.entity_id, vm.screen_id, vm.app_id, function(callback) {
                 
                        if (callback) {
                            if(typeof $scope.temp == 'undefined') $scope.temp = {};
                            $scope.temp.formValues = angular.copy(callback);
    
                            var transactionTypes = [];
                    
                            $.each($scope.temp.formValues.templates, function(key,val){
                                var transactionType = {
                                    id: val.transactionType.id,
                                    name: val.transactionType.name,
                                    code: "",
                                    collectionName: null
                                };
                                transactionTypes.push(transactionType);
                            });
             
                            //make call for each transaction type in edit
                            $scope.upload_success = 0;
                            $.each(transactionTypes, function(key,val){
            
                                data.request.Payload.transactionType = angular.copy(val);
                                if ($rootScope.droppedDoc) {
                                    file = $rootScope.droppedDoc;
                                } else {
                                    file = $(selector)[0].files[0];
                                }
                                FD.append("file", file);
                                // add file
                                FD.append("request", JSON.stringify(data.request));
                                Factory_Master.upload_document(FD, function(callback) {
                                    if (callback) {
                                        toastr.success("Document saved!");
                                        $scope.upload_success++;
                                        // $state.reload();
                                        // $('.ui-jqgrid-btable').trigger('reloadGrid');
                                    } else {
                                        toastr.error("Upload error");
                                        // $state.reload();
                                    }
                                });
                            })
    
                            $scope.$watch('upload_success', function(){
                                if($scope.upload_success == transactionTypes.length) 
                                    $state.reload();
                            })
                        }
                    });

            }else{

                if ($rootScope.droppedDoc) {
                    file = $rootScope.droppedDoc;
                } else {
                    file = $(selector)[0].files[0];
                }
                FD.append("file", file);
                // add file
                FD.append("request", JSON.stringify(data.request));
                Factory_Master.upload_document(FD, function(callback) {
                    if (callback) {
                        toastr.success("Document saved!");
                        $state.reload();
                        // $('.ui-jqgrid-btable').trigger('reloadGrid');
                    } else {
                        toastr.error("Upload error");
                        $state.reload();
                    }
                });
            }
    

        };
        $scope.dropDocumentFile = function(name, id, file) {
            Factory_Master.newSchedule(data, function(response) {});
        };
        // download document using XHR - { liviu m. }
        $scope.downloadDocument = function(rowId, docName) {
            Factory_Master.get_document_file(
                {
                    Payload: rowId
                },
                function(file, mime) {
                    if (file.data) {
                        var blob = new Blob([file.data], {
                            type: mime
                        });
                        var a = document.createElement("a");
                        a.style = "display: none";
                        document.body.appendChild(a);
                        //Create a DOMString representing the blob and point the link element towards it
                        var url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = docName;
                        //programatically click the link to trigger the download
                        a.click();
                        //release the reference to the file by revoking the Object URL
                        window.URL.revokeObjectURL(url);
                    }
                }
            );
        };
        $scope.getLogo = function(name) {
            if (vm.entity_id > 0) {
                Factory_Master.get_file(vm.entity_id, function(callback, mime) {
                    if (callback) {
                        $scope.image = [];
                        $scope.image[name] = {};
                        var binary = "";
                        var bytes = new Uint8Array(callback);
                        var len = bytes.byteLength;
                        for (var i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        $scope.image[name].stream = window.btoa(binary);
                        $scope.image[name].type = mime;
                    }
                });
            }
        };
        $scope.arrayBufferToBase64 = function(buffer) {
            var binary = "";
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        };
        $scope.flattenArray = function(obj, find, name) {
            $scope.flattened = {};
            $scope.flattened[name] = [];
            $.each(obj, function(key, val) {
                $scope.flattened[name].push(val[find]);
            });
        };
        $scope.selectedModalValue = function(element) {
            // if (!element)return
            if (!element) {
                if ($rootScope.modalParams) {
                    element = $rootScope.modalParams;
                } else {
                    return;
                }
            }
            // console.log($rootScope)
            id = element.clc;
            object = element.source;
            formvalue = element.formvalue;
            idx = element.idx;
            field_name = element.field_name;
            var CLC = $("#modal_" + id + " table.ui-jqgrid-btable");
            var rowId = CLC.jqGrid("getGridParam", "selrow");
            var rowData = CLC.jqGrid.Ascensys.gridObject.rows[rowId - 1];

            $scope.selected_value = {};
            var transaction_type = "";
            var transactionstobeinvoiced_dtRow = "";
            var toastr_msg = "";
            if (element.screen == "contactlist") {
                $scope.selected_value = rowData;
            } else if (element.screen == "transactionstobeinvoiced") {
                $scope.addTransactionsInInvoice(element);
                return false;
            } else if (element.screen == "orders") {
                $scope.selected_value = {
                    id: rowData.order.id,
                    name: rowData.order.name
                };
            } else if (element.screen == "formulalist" && vm.app_id == "contracts") {
                $scope.selected_value = {
                    id: rowData.id,
                    name: rowData.name,
                    isContractReference: rowData.isContractReference
                };
            } else if (element.screen == "bunkerableport" && vm.app_id == "default") {
                $scope.selected_value = angular.copy(rowData);
                //id from row data is order in table, actual locationId is in rowData.locationId
                if (!angular.equals($scope.selected_value, {})) {
                    $scope.selected_value.id = $scope.selected_value.locationId;
                }
            } else if (element.screen == "destinationport" && vm.app_id == "default") {
                $scope.selected_value = angular.copy(rowData);
                if (!angular.equals($scope.selected_value, {})) {
                    $scope.selected_value.id = $scope.selected_value.destinationId;
                }
            } else if (element.screen == "rfqrequestslist" && vm.app_id == "default") {
                $scope.selected_value = angular.copy(rowData);
                if (!angular.equals($scope.selected_value, {})) {
                    $scope.selected_value.id = $scope.selected_value.requestId;
                }
            } else if (element.screen == "productcontractlist" && vm.app_id == "default"){
                $scope.selected_value = angular.copy(rowData);
                if (!angular.equals($scope.selected_value, {})) {
                    $scope.selected_value.id = $scope.selected_value.contractProductId;
                }
            } else if (element.screen == "requestcounterpartytypes" && vm.app_id == "default") {
                $scope.selected_value = angular.copy(rowData);
            } else if(element.screen == "contractlist" && vm.app_id == "default") {
                $scope.selected_value = angular.copy(rowData);
            }else {
                $.each(rowData, function(key, val) {
                    if (key == "id" || key == "name" || key == "code" || key == "displayName") {
                        $scope.selected_value[key] = val;
                    }
                });
            }
            if (angular.equals($scope.selected_value, {})) {
                toastr.error("Please select one row");
                return;
            }
            if (transaction_type == "delivery") {
                element.source = "formValues.productDetails";
                toastr_msg = "Delivery added";
            }
            if (transaction_type == "cost") {
                element.source = "formValues.costDetails";
                toastr_msg = "Cost added";
            }
            // Check if modal triggered from datatable
            if (!formvalue) {
                if (vm.app_id == "invoices" && element.name != "Physical Supplier") {
                    check = eval("$scope." + element.source);
                    if (Array.isArray(check)) {
                        $scope.target_element = element.source + "." + check.length;
                        element.source = element.source + "." + check.length;
                    } else {
                        $scope.target_element = element.source;
                    }
                } else {
                    $scope.target_element = element.source;
                }
                elements = element.source.split(".");
            } else {
                $scope.target_element = element.source;
                elements = formvalue.split(".");
                elements.push(idx);
                if (object.indexOf("[") > -1) {
                    object = object.replace("[", ".");
                    object = object.replace("]", "");
                    object = object.split(".");
                    $.each(object, function(key, val) {
                        elements.push(val);
                    });
                } else {
                    elements.push(object);
                }
            }
            // if (!duplicated_row) {
            // Check if modal triggered from datatable
            if (!formvalue) {
                $scope.assignObjValue($scope, elements, $scope.selected_value);
                if (element.screen == "rfqrequestslist") {
                	$scope.selected_value = [];
                	rowsData = CLC.jqGrid('getGridParam','selarrrow')
                	$.each(rowsData,function(k,v){
	                	$scope.selected_value.push(CLC.jqGrid.Ascensys.gridObject.rows[v - 1]);
                	})
                }
                $rootScope.$broadcast("dataListModal", { val: $scope.selected_value, elem: elements });
            } else {
            	if ($scope.grid) {
	                $scope.assignObjValue($scope.grid.appScope.fVal(), elements, $scope.selected_value);
            	} else {
	                $scope.assignObjValue($scope, elements, $scope.selected_value);
            	}
            }
            if (transaction_type == "delivery" || transaction_type == "cost") {
                toastr.success(toastr_msg);
            }
            // } else {
            //     if (transaction_type == 'delivery' || transaction_type == 'cost') {
            //         toastr.error('Delivery already exists');
            //     }
            // }
            $scope.prettyCloseModal();
            $("*").tooltip("destroy");
            $scope.triggerChangeFields(field_name, elements[1]);
        };
        $scope.assignObjValue = function(obj, keyPath, value) {
            lastKeyIndex = keyPath.length - 1;
            for (var i = 0; i < lastKeyIndex; ++i) {
                key = keyPath[i];
                next_key = keyPath[i + 1];
                if (typeof next_key === "number") {
                    if (!(key in obj)) obj[key] = [];
                } else {
                    if (!(key in obj)) obj[key] = {};
                }
                if (obj[key] == null) obj[key] = {};
                obj = obj[key];
            }
            obj[keyPath[lastKeyIndex]] = value;
        };

        $scope.addTransactionsInInvoice = function(element) {
            id = element.clc;
            object = element.source;
            formvalue = element.formvalue;
            idx = element.idx;
            field_name = element.field_name;
            var CLC = $("#modal_" + id + " table.ui-jqgrid-btable");
            var rowId = CLC.jqGrid("getGridParam", "selrow");
            var rowData = CLC.jqGrid.Ascensys.gridObject.rows[rowId - 1];
            selectedRows = [];
            $.each(CLC.jqGrid.Ascensys.selectedProductIds, function(k1, v1) {
                $.each(CLC.jqGrid.Ascensys.gridObject.rows, function(k2, v2) {
                    if (v1 == v2.deliveryProductId) {
                        selectedRows.push(v2);
                    }
                });
            });
            orderAdditionalCostId = [];
            $.each(CLC.jqGrid.Ascensys.selectedOrderAdditionalCostId, function(k1, v1) {
                $.each(CLC.jqGrid.Ascensys.gridObject.rows, function(k2, v2) {
                    if (v1 == v2.orderAdditionalCostId) {
                        orderAdditionalCostId.push(v2);
                    }
                });
            });

            mixedRows = selectedRows.concat(orderAdditionalCostId);

            $.each(mixedRows, function(k, rowData) {
                if (rowData.costName) {
                    transaction_type = "cost";
                	rowData.product.productId = rowData.product.id
                    rowData.product.id = rowData.deliveryProductId;
                    transactionstobeinvoiced_dtRow = {
                        product: rowData.product,
                        costName: rowData.costName,
                        costType: rowData.costType,
                        orderAdditionalCostId: rowData.orderAdditionalCostId,
                        deliveryProductId: rowData.deliveryProductId,
                        deliveryQuantity: rowData.deliveryQuantity,
                        deliveryQuantityUom: rowData.deliveryQuantityUom,
                        estimatedAmount: rowData.estimatedAmount,
                        estimatedAmountCurrency: rowData.estimatedAmountCurrency,
                        estimatedRate: rowData.estimatedRate,
                        estimatedRateCurrency: rowData.estimatedRateCurrency,
                        invoiceRateCurrency: $scope.formValues.invoiceRateCurrency,
                        estimatedRateUom: rowData.estimatedRateUom,
                        sulphurContent: rowData.sulphurContent,
                        pricingDate: rowData.pricingDate,
                        isDeleted: rowData.isDeleted,
                        invoiceAmount: rowData.invoiceAmount,
                        invoiceTotalAmount: rowData.invoiceTotalAmount,
                        estimatedTotalAmount: rowData.estimatedTotalAmount,
                        //new on 30.08.2018
                        invoiceQuantityUom: rowData.invoiceQuantityUom,
                        invoiceRateUom: rowData.invoiceRateUom,
                        estimatedExtras: rowData.estimatedExtra,
                        // invoiceExtras: rowData.estimatedExtra,
                        estimatedExtrasAmount: rowData.estimatedExtraAmount
                    };
                }
                if (rowData.delivery) {
                	rowData.product.productId = angular.copy(rowData.product.id)
                    transactionstobeinvoiced_dtRow = {
                        amountInInvoice: "",
                        deliveryNo: rowData.delivery.name,
                        agreementType: rowData.agreementType,
                        deliveryProductId: rowData.deliveryProductId,
                        invoicedProduct: rowData.invoicedProduct,
                        orderedProduct: rowData.orderedProduct,
                        confirmedQuantity: rowData.confirmedQuantity,
                        confirmedQuantityUom: rowData.confirmedQuantityUom,
                        deliveryQuantity: rowData.deliveryQuantity,
                        deliveryQuantityUom: rowData.confirmedQuantityUom,
                        deliveryMFM: rowData.deliveryMFM,
                        sulphurContent: rowData.sulphurContent,
                        difference: "",
                        estimatedAmount: rowData.estimatedAmount,
                        estimatedAmountCurrency: rowData.estimatedRateCurrency,
                        estimatedRate: rowData.estimatedRate,
                        estimatedRateCurrency: rowData.estimatedRateCurrency,
                        invoiceAmount: "",
                        invoiceAmountCurrency: {},
                        invoiceQuantity: "",
                        invoiceQuantityUom: {},
                        invoiceRate: "",
                        invoiceRateUom: rowData.invoiceRateUom,
                        invoiceRateCurrency: $scope.formValues.invoiceRateCurrency,
                        isDeleted: rowData.isDeleted,
                        pricingDate: rowData.pricingDate,
                        product: rowData.product,
                        physicalSupplierCounterparty: rowData.physicalSupplierCounterparty,
                        estimatedRateUom: rowData.estimatedRateUom,
                        pricingScheduleName: rowData.pricingScheduleName,
                        reconStatus: {
                            id: 1,
                            name: "Matched",
                            code: "",
                            collectionName: null
                        }
                    };
                }
                if (rowData.costName) {
                    alreadyExists = false;
                    $.each($scope.formValues.costDetails, function(idx, val) {
                        if (rowData.orderAdditionalCostId == val.orderAdditionalCostId) {
                            alreadyExists = true;
                        }
                    });
                    if (!alreadyExists) {
                        $scope.formValues.costDetails.push(transactionstobeinvoiced_dtRow);
                    } else {
                        toastr.error("Selected cost already exists");
                    }
                }
                if (rowData.delivery) {
                    alreadyExists = false;
                    $.each($scope.formValues.productDetails, function(idx, val) {
                        if (rowData.deliveryProductId == val.deliveryProductId && !val.isDeleted) {
                            alreadyExists = true;
                        }
                    });
                    if (!alreadyExists) {
                    	transactionstobeinvoiced_dtRow.invoiceQuantity = transactionstobeinvoiced_dtRow.deliveryQuantity;
                    	transactionstobeinvoiced_dtRow.invoiceQuantityUom = transactionstobeinvoiced_dtRow.deliveryQuantityUom;
                        $scope.formValues.productDetails.push(transactionstobeinvoiced_dtRow);
                    } else {
                        toastr.error("Selected product already exists");
                    }
                }
            });
            $scope.modalInstance.close();
        };
        /*SELLER RATING MODAL*/
        $scope.getSellerRating = function() {
            if (!$scope.sellerRating) {
                Factory_Master.get_seller_rating(vm.app_id, vm.screen_id, vm.entity_id, function(response) {
                    if (response) {
                        $scope.sellerRating = response;
                    }
                });
            }
        };
        $scope.createSellerRating = function() {
            $scope.modalInstance.close();
            Factory_Master.create_seller_rating(vm.app_id, vm.screen_id, $scope.sellerRating, function(response) {
                if (response) {
                    if (response.status == true) {
                        if (vm.app_id == "default") {
                            $scope.sellerRatingScreen("Procurement", "Procurement", $state.params.orderId);
                        } else {
                            $scope.sellerRatingScreen(vm.app_id, vm.screen_id, vm.entity_id);
                        }
                        toastr.success(response.message);
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                    }
                }
            });
        };
        $scope.discardSellerRating = function() {
            $.each($scope.sellerRating.categories, function(key, value) {
                $.each(value.details, function(key1, value1) {
                    value1.rating = 0;
                    $scope.discardRating = true;
                });
            });
        };
        /*SELLER RATING MODAL*/
        /*SET RESET PASSWORD*/
        $scope.validateAndSetPassword = function(pass1, pass2) {
            if (typeof pass1 && typeof pass2 != "undefined") {
                if (pass1 == pass2) {
                    $scope.formValues.password = pass1;
                    toastr.success("Password was set");
                    $scope.modalInstance.close();
                } else {
                    toastr.error("The passwords do not match!");
                }
            } else {
                toastr.error("Please fill the password fields");
            }
        };
        $scope.validateAndChangePassword = function(pass1, pass2) {
            if (typeof pass1 && typeof pass2 != "undefined") {
                if (pass1 == pass2) {
                    data = {
                        userId: $scope.formValues.id,
                        password: pass1
                    };
                    Factory_Master.change_password(data, function(response) {
                        if (response) {
                            if (response.status == true) {
                                toastr.success(response.message);
                            } else {
                                $scope.loaded = true;
                                toastr.error(response.message);
                            }
                        }
                    });
                } else {
                    toastr.error("The passwords do not match!");
                }
            } else {
                toastr.error("Please fill the password fields");
            }
        };
        $scope.cancelSetPassword = function() {
            $scope.formValues.password = null;
            $scope.prettyCloseModal();
        };
        /* END SET RESET PASSWORD*/
        // TREASURY REPORT ----
        $scope.treasury_generate_report = function() {
            var UIFilters = {};
            if ($scope.formValues.Seller) {
                UIFilters.SellerIds = $scope.formValues.Seller.id;
            }
            if ($scope.formValues.Broker) {
                UIFilters.BrokerIds = $scope.formValues.Broker.id;
            }
            if ($scope.formValues.Company) {
                UIFilters.CompanyIds = $scope.formValues.Company.id;
            }
            if ($scope.formValues.PaymentStatus) {
                UIFilters.PaymentStatusIds = $scope.formValues.PaymentStatus.id;
            }
            if ($scope.formValues.PaymentDateFrom) {
                UIFilters.PaymentDateFrom = $scope.formValues.PaymentDateFrom;
            }
            if ($scope.formValues.PaymentDateTo) {
                UIFilters.PaymentDateTo = $scope.formValues.PaymentDateTo;
            }
            $("#" + Elements.settings[Object.keys(Elements.settings)[0]].table).jqGrid.table_config.on_ui_filter(UIFilters);
        };

        $scope.go_report_cashflow = function() {
            window.open("#/reports/cashflow", "_blank");
        };
		
        
        $scope.treasury_clear_report = function() {
			$scope.formValues.PaymentStatus = null;
			$scope.formValues.PaymentDateFrom = null;
			$scope.formValues.PaymentDateTo = null;
        }
        $scope.invoices_payment_due_date_filter = function() {
            $("#" + Elements.settings[Object.keys(Elements.settings)[0]].table).jqGrid.table_config.on_ui_filter({
                PaymentDueDate: $("#invoices_payment_due_date_filter").val()
            });
        };
        /*DELIVERY*/
        $scope.setQualityMatch = function(bdn, survey, min, max) {
            /**
             * Changed function in order to work with new delivery params. For labs bdn= labs value; survey = min value; min = max value. For delivery params are as described
             */
            if (vm.app_id == "labs") {
                // labVal = bdn; labMin = survey; labMax = min;
                // // console.log(typeof(labVal), typeof(null));
                // if(typeof(labVal) != 'number'){
                //     if(typeof(labVal) == 'string'){
                //         labVal = parseFloat(labVal);
                //         console.log(typeof(labVal),labVal);
                //     }
                //     if(typeof(labVal) != 'number') return;
                //     if (labVal == NaN) return;
                // }
                // if(labMin != null)
                //     if(labVal < labMin) return 2;
                // if(labMax != null)
                //     if(labVal > labMax) return 2;
                // return 1;
                // if (bdn == null) return;
                if ((typeof bdn == "string" && bdn == "") || bdn == null) return;
                if (isNaN(bdn)) return;
                if (isNaN(survey)) return;
                if (bdn < survey && survey != null) {
                    return 2;
                }
                if (bdn > min && min != null) {
                    return 2;
                }
                return 1;
            } else {
                if ((typeof bdn == "string" && bdn == "") || bdn == null) return;
                if ((typeof survey == "string" && survey == "") || survey == null) return;
                if (isNaN(bdn)) return;
                if (isNaN(survey)) return;
                var variance = survey - bdn;
                // if (min)
                //     if (variance < min) return $listsCache.QualityMatch[1];
                // if (max)
                //     if (variance > max) return $listsCache.QualityMatch[1];
                // return $listsCache.QualityMatch[0];
                //changed logic -> passed for exact match, failed otherwise
                if (variance == 0) return $listsCache.QualityMatch[0];
                return $listsCache.QualityMatch[1];
            }
        };
        /*END DELIVERY*/
        $scope.checkQualityStatus = function() {
            var status = 0;
            $.each($scope.formValues.labTestResults, function(key, val) {
                if (val.qualityMatch && val.qualityMatch.name == "Failed") {
                    status++;
                }
            });
            if (status == 0) {
                $scope.formValues.reconMatch = {
                    id: 1,
                    name: "Passed"
                };
            } else {
                $scope.formValues.reconMatch = {
                    id: 2,
                    name: "Failed"
                };
            }
        };
        $scope.hideAddDataButton = function() {
            buttons = $(".addData")
                .parents(".ui-grid-render-container")
                .find(".addData");
            count = buttons.length;
            first = buttons[0];
            if (count > 1) {
                first.addClass("hidden");
            }
        };
        // Check default options from layout
        $scope.checkDefaults = function(options, name, id) {
            $scope.formValues[id] = [];
            $.each(options, function(key, val) {
                $scope.formValues[id].push($scope.options[name][val]);
            });
        };
        $scope.reconQualityDispute = function() {
            var ClaimTypeId = 2;
            if (typeof ($scope.selectedRows != "undefined") && $scope.selectedRows != null && $scope.selectedRows.length > 0) {
                var data = {
                    LabTestResultIds: $scope.selectedRows,
                    DeliveryQualityParameterIds: [],
                    DeliveryProductId: null,
                    ClaimTypeId: ClaimTypeId
                };
                Factory_Master.raise_claim(data, function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            // toastr.success(response.message);
                            localStorage.setItem("claimsclaims_newEntity", angular.toJson(response.data));
                            window.open($location.$$absUrl.replace($location.$$path, "/claims/claim/edit/"), "_blank");
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                });
            } else {
                toastr.error("Please select a parameter!");
            }
        };
        // Email Log Filter
        $scope.emailLogFilter = function(operation) {
            if (operation == "search") {
                // var UIFilters = {} // not used here :)
                var Filters = [];
                if ($rootScope.formDataFields.module) {
                    Filters.push({
                        ColumnName: "Module",
                        Value: $rootScope.formDataFields.module.id.toString()
                    });
                }
                if ($rootScope.formDataFields.sender) {
                    Filters.push({
                        ColumnName: "Sender",
                        Value: $rootScope.formDataFields.sender.toString()
                    });
                }
                if ($rootScope.formDataFields.status) {
                    Filters.push({
                        ColumnName: "Status",
                        Value: $rootScope.formDataFields.status.id.toString()
                    });
                }
                if ($rootScope.formDataFields.entity) {
                    Filters.push({
                        ColumnName: "Entity",
                        Value: $rootScope.formDataFields.entity.id.toString()
                    });
                }
                if ($rootScope.formDataFields.subject) {
                    Filters.push({
                        ColumnName: "Subject",
                        Value: $rootScope.formDataFields.subject.toString()
                    });
                }
                if ($rootScope.formDataFields.emailTo) {
                    Filters.push({
                        ColumnName: "EmailTo",
                        Value: $rootScope.formDataFields.emailTo.toString()
                    });
                }
                $("#" + Elements.settings[Object.keys(Elements.settings)[0]].table).jqGrid.table_config.on_payload_filter(Filters);
                toastr.success("Search params sent");
                $rootScope.masterEmailLogsFilters = Filters;
            }
            if (operation == "reset") {
                $state.reload();
                toastr.success("Reset form cleared");
            }
        };
        // {end} Email Log Filter
        /*Labs PREVIEW*/
        $scope.getEmailTransactionType = function(valType) {
        	$scope.emailTemplates = null;
        	$rootScope.previewEmail = null;
            $.each($listsCache["EmailTransactionType"], function(key, val) {
                if (val["name"] == valType) {
                    $transactionId = val["id"];
                }
            });
            Factory_Master.list_by_transaction_type($transactionId, function(response) {
                if (response) {
                    if (response.status == true) {
                        $scope.emailTemplates = response.data;
                        $.each($scope.emailTemplates, function(k, v) {
                            if (!v.displayName) {
                                v.displayName = v.name;
                            }
                        });
                        if (valType == "Claims") {
                            keysToRemove = [];
                            $.each($scope.emailTemplates, function(k, v) {
                                entityClaimType = $rootScope.formValues.claimType.claimType.name;
                                if ($rootScope.formValues.claimType.claimType.name == "Quantity" && $rootScope.formValues.densitySubtypes.length > 0) {
                                    entityClaimType = "Density";
                                }
                                if (v.name.indexOf(entityClaimType) == -1) {
                                    keysToRemove.push(k);
                                }
                            });
                            keysToRemove.reverse();
                            $.each(keysToRemove, function(key, val) {
                                $scope.emailTemplates.splice(val, 1);
                            });
                            $scope.emailTemplates;
                            $scope.ClaimEmailTemplate = $scope.emailTemplates[0];
                            setTimeout(function() {
                                $("#ClaimEmailTemplate").trigger("change");
                            }, 100);
                        }
                    }
                }
            });
        };


        
        $scope.formEmailString = function(data){
            if(typeof data == "object"){
                // array
                var emailStr = "";
                $.each(data, function(_, em){
                    emailStr += em;
                })
                return emailStr.substring(0, emailStr.length - 1);
            }
            if(typeof data == "string"){
                return data.replace(/,/g, ';');
            }
        }
        
		

        $scope.$on("previewEmail", function(events, args) {
            $rootScope.previewEmail = args;
            $rootScope.previewEmail.to == null ? ($rootScope.previewEmail.to = []) : "";
            $rootScope.previewEmail.cc == null ? ($rootScope.previewEmail.cc = []) : "";
            $rootScope.previewEmail.bcc == null ? ($rootScope.previewEmail.bcc = []) : "";
            $rootScope.previewEmail.toEmailOthers = $scope.formEmailString($rootScope.previewEmail.toOthers);
            $rootScope.previewEmail.ccEmailOthers = $scope.formEmailString($rootScope.previewEmail.ccOthers);
        });
        if (!$scope.onMyEvent)
            $scope.onMyEvent = $scope.$on("tableLayoutLoaded", function(e, arg) {
                // console.log(1)
                vm.delayaddModalActions();
            });
        $scope.addEmailAddressInPreview = function(model, value) {
            currentValues = eval("$rootScope." + model);
            isDuplicate = false;
            $.each(currentValues, function(key, currentVal) {
                if (currentVal.name == value.name && currentVal.idEmailAddress == value.idEmailAddress) {
                    isDuplicate = true;
                }
            });
            if (isDuplicate) {
                toastr.error("Contact is already added");
            } else {
                currentValues.push(value);
            }
        };
        $scope.sendPreviewEmail = function() {
        	// asdasd
        	
        	$scope.saveClaimEmail(true, function(resp){
        		if (resp == true) {
        			data = { Payload: $rootScope.previewEmail };

		            var toString = [],
		                ccString = [];
		            $.each($rootScope.previewEmail.to, function(k, v) {
		                toString.push(v.idEmailAddress);
		            });
		            $.each($rootScope.previewEmail.cc, function(k, v) {
		                ccString.push(v.idEmailAddress);
		            });
		            toString = toString.toString();
		            ccString = ccString.toString();

		            request_data = payloadDataModel.create(data.Payload);

		            var comments = {
		                "id": $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
		                "name": $rootScope.previewEmail.comment.name,
		                "emailTemplate":  $rootScope.currentEmailTemplate,
		                "businessId": vm.entity_id,
		                "secondBusinessId": null,
		                "thirdBusinessId": null,
		                "isDeleted": false,
		                "Content": $rootScope.previewEmail.content,
		                "To": toString,
		                "Cc": ccString,
		                "ToOthers": $rootScope.previewEmail.toOthers,
		                "CcOthers": $rootScope.previewEmail.ccOthers,
		                "From": $rootScope.previewEmail.from
		            };
		            // find email template object
		            $.each(vm.listsCache.EmailTemplate, function(key,value){
		                if(value.id == $rootScope.currentEmailTemplate){
		                    comments.emailTemplate =  angular.copy(value);
		                    return;
		                }
		            })
		            request_data.Payload.comment = angular.copy(comments);

		            if (request_data.warningMessage) {
		                confirmAction = window.confirm(request_data.warningMessage);
		                if (confirmAction) {
		                    Factory_Master.send_email_preview(request_data, function(response) {
		                        if (response) {
		                            if (response.status == true) {
		                                $scope.loaded = true;
		                                toastr.success("Email Preview was sent!");
		                                var url = $state.$current.url.prefix + $state.params.screen_id + "/edit/" + $state.params.entity_id;
		                                $location.path(url);
		                            } else {
		                                $scope.loaded = true;
		                                toastr.error(response.message);
		                            }
		                        }
		                    });
		                }
		            } else {
		                Factory_Master.send_email_preview(request_data, function(response) {
		                    if (response) {
		                        if (response.status == true) {
		                            $scope.loaded = true;
		                            toastr.success("Email Preview was sent!");
		                            var url = $state.$current.url.prefix + $state.params.screen_id + "/edit/" + $state.params.entity_id;
		                            $location.path(url);
		                        } else {
		                            $scope.loaded = true;
		                            toastr.error(response.message);
		                        }
		                    }
		                });
		            }
        		}
        	})
            
        };
        /* END CONTRACT PREVIEW*/
        $scope.goToFormula = function() {
            window.open("#/masters/formula/edit/", "_blank");
        };
        $scope.addSpecParamsToClaim = function(event) {
            //check if valid
            selectedDisabled = event.currentTarget.attributes["ng-disabled"].value;
            selectedParamId = parseInt(event.currentTarget.attributes["spec-param-id"].value); //specParam.id
            selectedParamClaimType = parseInt(event.currentTarget.attributes["claim-type"].value); //claim.claim.id (actual id to send)
            selectedParamRadioId = event.currentTarget.attributes["radio-id"].value; //claim.id (given id for validation)
            selectedClaimId = selectedParamRadioId.split("_")[3];
            // console.log(selectedClaimId);
            //cancel selection if disabled
            if (selectedDisabled == "true") {
                event.currentTarget.checked = false;
                return;
            }
            //mark parameters disabled
            if (typeof $rootScope.raiseClaimInfo.currentClaimTypeId == "undefined") {
                $rootScope.raiseClaimInfo.currentClaimTypeId = selectedParamClaimType;
                $rootScope.raiseClaimInfo.currentClaimId = selectedClaimId;
                $(selectedParamRadioId)[0].checked = true;
                $.each(vm.availableClaimTypes, function(claimKey, claimVal) {
                    if (claimVal.id != selectedClaimId) {
                        $.each(claimVal.specParams, function(paramKey, paramVal) {
                            paramVal.disabled = "true";
                        });
                    }
                });
                $rootScope.raiseClaimInfo.currentSpecParamIds.push(selectedParamId);
            } else {
                if ($rootScope.raiseClaimInfo.currentClaimId == selectedClaimId || $rootScope.raiseClaimInfo.currentSpecParamIds.length == 0) {
                    //add / erase from array if it fits
                    i = $.inArray(selectedParamId, $rootScope.raiseClaimInfo.currentSpecParamIds);
                    if (i >= 0) {
                        $rootScope.raiseClaimInfo.currentSpecParamIds.splice(i, 1);
                        //remove restrictions if unchecked all params
                        if ($rootScope.raiseClaimInfo.currentSpecParamIds.length == 0) {
                            $.each(vm.availableClaimTypes, function(claimKey, claimVal) {
                                $.each(claimVal.specParams, function(paramKey, paramVal) {
                                    paramVal.disabled = "false";
                                });
                            });
                            $(selectedParamRadioId)[0].checked = false;
                            delete $rootScope.raiseClaimInfo.currentClaimTypeId;
                        }
                    } else {
                        $rootScope.raiseClaimInfo.currentSpecParamIds.push(selectedParamId);
                        $rootScope.raiseClaimInfo.currentClaimTypeId = selectedParamClaimType;
                    }
                }
            }
        };
        $scope.selectClaimInfoId = function(claimTypeId, claimId) {
            //claimId = just for disabling checkboxes
            $rootScope.raiseClaimInfo.currentClaimTypeId = claimTypeId;
            $rootScope.raiseClaimInfo.currentClaimId = claimId;
            paramsSet = false;
            $rootScope.raiseClaimInfo.currentSpecParamIds = [];
            $.each(vm.availableClaimTypes, function(claimKey, claimVal) {
                if (claimVal.id != $rootScope.raiseClaimInfo.currentClaimId) {
                    //uncheck checkboxes that do not fit & disable them
                    $.each(claimVal.specParams, function(paramKey, paramVal) {
                        id = "#claim_info_checkbox_" + paramVal.specParameter.id;
                        $(id)[0].checked = false;
                        paramVal.disabled = "true";
                    });
                } else {
                    //check current claim boxes & make available
                    $.each(claimVal.specParams, function(paramKey, paramVal) {
                        paramVal.disabled = "false";
                        id = "#claim_info_checkbox_" + paramVal.specParameter.id;
                        $(id)[0].checked = true;
                        $rootScope.raiseClaimInfo.currentSpecParamIds.push(paramVal.id);
                        paramsSet = true;
                    });
                }
            });
        };
        $scope.deliveryProductChanged = function(prod) {
            if (prod.product != $scope.formValues.temp.savedProdForCheck) {
                $rootScope.deliveryProductChanged = true;
                console.log($rootScope.deliveryProductChanged);
            } else {
                $rootScope.deliveryProductChanged = false;
                console.log($rootScope.deliveryProductChanged);
            }
        };
        /*DeliveryList*/
        // $scope.createDeliveryFromDeliveryList = function() {
        //     if (typeof($rootScope.selectDeliveryRow) !== 'undefined' && $rootScope.selectDeliveryRow != null) {
        //         if ($rootScope.selectDeliveryRow.delivery != null) {
        //             toastr.error("This item already has a delivery!")
        //             return;
        //         } else {
        //             localStorage.setItem('deliveryFromOrder', angular.toJson($rootScope.selectDeliveryRow));
        //         }
        //     }
        //     // var selectedRowsIds = $('#flat_orders_delivery_list').jqGrid('getGridParam', 'selarrrow');
        //     // $rootScope.selectDeliveryRows = [];
        //     // if (typeof(selectedRowsIds) !== 'undefined' && selectedRowsIds != null && selectedRowsIds.length > 0) {
        //     //     $.each(selectedRowsIds, function(key, val) {
        //     //         rowData = $('#flat_orders_delivery_list').jqGrid.Ascensys.gridObject.rows[val - 1];
        //     //         if (($rootScope.selectDeliveryRows != null) || ($rootScope.selectDeliveryRows.length != 0)){
        //     //             $rootScope.selectDeliveryRows.push(rowData);
        //     //         } else {
        //     //             $rootScope.selectDeliveryRows = [];
        //     //             $rootScope.selectDeliveryRows.push(rowData);
        //     //         }
        //     //     })
        //     //     console.log($rootScope.selectDeliveryRows);
        //     // }
        //     console.log($rootScope.selectDeliveryRows);
        //     if ($rootScope.selectDeliveryRows) {
        //      if ($rootScope.selectDeliveryRows.length == 1) {
        //          localStorage.setItem('deliveryFromOrder', angular.toJson($rootScope.selectDeliveryRows[0]));
        //      } else {
        //          localStorage.setItem('deliveriesFromOrder', angular.toJson($rootScope.selectDeliveryRows));
        //      }
        //     }
        //     $location.path(vm.app_id + '/' + 'delivery' + '/edit/');
        // }
        // $scope.watchSelectDeliveryRow = function() {
        //     setTimeout(function() {
        //         if (!localStorage.getItem('deliveryFromOrder')) {
        //             return
        //         }
        //         data = JSON.parse(localStorage.getItem('deliveryFromOrder'));
        //         localStorage.removeItem('deliveryFromOrder');
        //         $rootScope.selectDeliveryRow = null;
        //         $scope.formValues.order = data.order;
        //         $scope.formValues.surveyor = data.surveyor;
        //         if (typeof($scope.formValues.deliveryProducts) == 'undefined') {
        //             $scope.formValues.deliveryProducts = []
        //         }
        //         $scope.formValues.deliveryProducts.push({
        //             'orderedProduct': data.product,
        //             'product': data.product,
        //             'confirmedQuantityAmount': data.confirmedQuantityAmount,
        //             'confirmedQuantityUom': data.confirmedQuantityUom
        //         });
        //         //add quality and quantity params for product
        //         orderProductId = data.orderProductId;
        //         orderProductSpecGroupId = data.specGroup.id;
        //         dataForInfo = {
        //             "Payload": {
        //                 "Filters": [{
        //                     "ColumnName": "OrderProductId",
        //                     "Value": orderProductId
        //                 }, {
        //                     "ColumnName": "SpecGroupId",
        //                     "Value": orderProductSpecGroupId
        //                 }]
        //             }
        //         }
        //         var qualityParams = {};
        //         var quantityParams = {};
        //         Factory_Master.getSpecParamsDeliveryProduct(dataForInfo, function(response) {
        //             console.log(response);
        //             $scope.formValues.deliveryProducts[0].qualityParameters = response;
        //         })
        //         Factory_Master.getQtyParamsDeliveryProsuct(dataForInfo, function(response) {
        //             quantityParams = response;
        //             $scope.formValues.deliveryProducts[0].quantityParameters = response;
        //         })
        //         console.log($scope.formValues.deliveryProducts);
        //         Factory_Master.get_master_entity($scope.formValues.order.id, 'orders', 'orders', function(response) {
        //             $scope.formValues.sellerName = response.seller.name;
        //             $scope.formValues.port = response.location.name;
        //             $scope.formValues.OrderBuyer = response.buyer.name;
        //             $scope.formValues.temp.orderedProducts = response.products;
        //             if (response.surveyorCounterparty) {
        //                 $scope.formValues.surveyorName = response.surveyorCounterparty.name;
        //             }
        //         });
        //         $scope.getDeliveryOrderSummary($scope.formValues.order.id);
        //     })
        //     setTimeout(function() {
        //         if (!localStorage.getItem('deliveriesFromOrder')) {
        //             return
        //         }
        //         data = JSON.parse(localStorage.getItem('deliveriesFromOrder'));
        //         localStorage.removeItem('deliveriesFromOrder');
        //         $rootScope.selectDeliveryRows = [];
        //         $scope.formValues.order = data[0].order;
        //         $scope.formValues.surveyor = data[0].surveyor;
        //         if (typeof($scope.formValues.deliveryProducts) == 'undefined') {
        //             $scope.formValues.deliveryProducts = []
        //         }
        //         $.each(data, function(key, delivery) {
        //             $scope.formValues.deliveryProducts.push({
        //                 'orderedProduct': delivery.product,
        //                 'product': delivery.product,
        //                 'confirmedQuantityAmount': delivery.confirmedQuantityAmount,
        //                 'confirmedQuantityUom': delivery.confirmedQuantityUom
        //             });
        //             orderProductId = delivery.orderProductId;
        //             orderProductSpecGroupId = delivery.specGroup.id;
        //             dataForInfo = {
        //                 "Payload": {
        //                     "Filters": [{
        //                         "ColumnName": "OrderProductId",
        //                         "Value": orderProductId
        //                     }, {
        //                         "ColumnName": "SpecGroupId",
        //                         "Value": orderProductSpecGroupId
        //                     }]
        //                 }
        //             }
        //             var qualityParams = {};
        //             var quantityParams = {};
        //             Factory_Master.getSpecParamsDeliveryProduct(dataForInfo, function(response) {
        //                 $scope.formValues.deliveryProducts[key].qualityParameters = response;
        //             })
        //             Factory_Master.getQtyParamsDeliveryProsuct(dataForInfo, function(response) {
        //                 quantityParams = response;
        //                 $scope.formValues.deliveryProducts[key].quantityParameters = response;
        //             })
        //         });
        //         console.log($scope.formValues.deliveryProducts);
        //         Factory_Master.get_master_entity($scope.formValues.order.id, 'orders', 'orders', function(response) {
        //             $scope.formValues.sellerName = response.seller.name;
        //             $scope.formValues.port = response.location.name;
        //             $scope.formValues.OrderBuyer = response.buyer.name;
        //             $scope.formValues.temp.orderedProducts = response.products;
        //             if (response.surveyorCounterparty) {
        //                 $scope.formValues.surveyorName = response.surveyorCounterparty.name;
        //             }
        //         });
        //         $scope.getDeliveryOrderSummary($scope.formValues.order.id);
        //     });
        // }
        /*DeliveryList*/
        /*Convert Currency*/
        $scope.convertCurrency = function(fromCurrencyId, toCurrencyId, exchangeDate, amount, convertCallback) {
            var d = new Date();
            month = d.getMonth() + 1;
            day = d.getDate();
            hours = d.getHours();
            minutes = d.getMinutes();
            seconds = d.getSeconds();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            date = d.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds;
            if (!exchangeDate) {
                exchangeDate = date;
            }
            data = {
                Payload: {
                    Order: null,
                    Filters: [
                        {
                            ColumnName: "FromCurrencyId",
                            Value: fromCurrencyId
                        },
                        {
                            ColumnName: "ToCurrencyId",
                            Value: toCurrencyId
                        },
                        {
                            ColumnName: "ExchangeDate",
                            Value: exchangeDate
                        },
                        {
                            ColumnName: "Amount",
                            Value: amount
                        }
                    ],
                    Pagination: {
                        Skip: 0,
                        Take: 10
                    }
                }
            };
            Factory_Master.convertCurrency(data, function(callback) {
                if (callback) {
                    if (convertCallback) {
                        convertCallback(callback.data);
                    }
                }
            });
        };
        /*Convert Currency*/
        /*Print Function*/
        $scope.printElem = function(selector) {
            var mywindow = window.open("", "PRINT", "height=400,width=600");
            mywindow.document.write("<html><head>");
            mywindow.document.write("</head><body >");
            mywindow.document.write($(selector).html());
            mywindow.document.write("</body></html>");
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
            mywindow.print();
            mywindow.close();
            return true;
        };
        /*END Print Function*/
        $scope.stringToObject = function(string, obj) {
            $scope[obj] = JSON.parse(string);
        };
        /*END ContractDelivery*/
        $scope.$on("copyAlertAction", function(event) {
            console.log($scope.formValues);
            $rootScope.copyAlertAction = true;
        });
        vm.displayStatusInHeader = function() {
            $rootScope.$watch("formValues", function() {
                if ($state.params.screen_id == "claim") {
                    if (typeof $rootScope.formValues != "undefined" && typeof $rootScope.formValues.claimDetails != "undefined" && typeof $rootScope.formValues.claimDetails.status != "undefined") {
                        if (!$state.params.status || typeof $state.params.status == "undefined") {
                            $state.params.status = {};
                        }
                        $state.params.status.name = $rootScope.formValues.claimDetails.status.name;
                        $state.params.status.displayName = $rootScope.formValues.claimDetails.status.displayName;
                        $state.params.status.bg = statusColors.getColorCodeFromLabels(
                            $rootScope.formValues.claimDetails.status,
                            $listsCache.ScheduleDashboardLabelConfiguration);
                        $state.params.status.color = "white";
                    }
                }
            });
        };
        $scope.saveNewContactCounterparty = function(newContact, counterpartyData) {
            if (newContact.name == "" || !newContact.name || !newContact.contactType.id || !newContact.email || newContact.email == "") {
                toastr.error("Please fill the required fields");
                return;
            } else {
                $.each(counterpartyData.contacts, function(k, v) {
                    if (v.id == 0) {
                        counterpartyData.contacts.splice(k, 1);
                    }
                });
                newContact.id = 0;
                newContact.emailContact = true;
                dataToAdd = counterpartyData;
                dataToAdd.contacts.push(newContact);
                $rootScope.$broadcast("confirmedBladeNavigation", true)
                Factory_Master.save_master_changes("masters", "counterparty", dataToAdd, function(callback) {
		            $(".blade-column.main-content-column .ng-dirty").removeClass("ng-dirty");
                    vm.newContact = null;
                    vm.addNewContact = false;
                    if (callback.status == true) {
                        toastr.success(callback.message);
                        // $scope.closeBlade();
                    } else {
                        toastr.error(callback.message);
                    }
                });
            }
        };
        $scope.closeBlade = function() {
        	if ($(".blade-column.main-content-column .ng-dirty").length > 0) {
	        	$('.confirmBladeClose').removeClass('hide');
	        	$('.confirmBladeClose').modal();
        	} else {
        		$scope.confirmCloseBlade();		
        	}
        };
        $scope.confirmCloseBlade = function(){
            $(".bladeEntity").removeClass("open");
            $("body").css("overflow-y", "auto");
            setTimeout(function() {
                $rootScope.bladeTemplateUrl = "";
                if($rootScope.refreshPending) {
                	$state.reload();
                  // window.location.reload();
                }
                $rootScope.$broadcast("counterpartyBladeClosed", true);
            }, 500);
        }
        $scope.isMeanFormula = function() {
            $.each($scope.formValues.complexFormulaQuoteLines, function(key, val) {
                if ($scope.formValues.complexFormulaQuoteLines[key].formulaOperation) {
                    $scope.formValues.complexFormulaQuoteLines[key].formulaOperation.id = 3;
                }
            });
        };
        $scope.getToday = function() {
            return new Date();
        };
        // Delivery App
        vm.initCarouselStep = function(param) {
            if (param == "start") return 0;
            windowWidth = $window.innerWidth;
            if (windowWidth > 991) return 4;
            return 2;
        };
        $scope.getSpecGroupByProduct = function(productId) {
            data = {
                Payload: {
                    Filters: [
                        {
                            ColumnName: "ProductId",
                            Value: productId
                        }
                    ]
                }
            };
            if (typeof vm.productSpecGroup == "undefined") {
                vm.productSpecGroup = [];
            }

            //if spec group for product exists, do not make call again
            if (typeof vm.productSpecGroup[productId] != "undefined") return;
            // if(typeof(vm.productSpecGroup[productId]) != []) return;

            Factory_Master.specGroupGetByProduct(data, function(callback) {
                if (callback) {
                    vm.productSpecGroup[productId] = callback.data.payload;
                }
            });
        };
        vm.getContractConfiguration = function() {
            console.log("getting contract config");
        };
        vm.trustAsHtml = function(data) {
            return $sce.trustAsHtml(data);
        };
        $scope.doEntityActionMaster = function(type, url, method, absolute, new_tab) {
            data = [type, url, method, absolute, new_tab];
            $rootScope.$broadcast("generalAction", data);
            // $scope.general_action(type, url, method, absolute, new_tab);
        };
        vm.getAdditionalCostsComponentTypes = function(callback) {
            if (!$scope.additionalCostsComponentTypes) {
		    	if (!$rootScope.called_getAdditionalCosts) {
		    		$rootScope.called_getAdditionalCosts = 1;
	                Factory_Master.getAdditionalCosts(0, function(response) {
			    		$rootScope.called_getAdditionalCosts = false;
	                    console.log(response);
                        $scope.additionalCostsComponentTypes = response.data.payload;
	                    callback($scope.additionalCostsComponentTypes);
	                });
		    	}
            } else {
                callback($scope.additionalCostsComponentTypes);
            }
        };
        $scope.filterCostTypesByAdditionalCost = function(cost, rowRenderIndex) {
            var doFiltering = function(addCostCompTypes){
                costType = null;
                $.each(addCostCompTypes, function(k, v) {
                    if (v.id == cost) {
                        costType = v.costType.id;
                    }
                });
                availableCosts = [];
                if (costType == 1 || costType == 2) {
                    $.each(vm.listsCache.CostType, function(k, v) {
                        if (v.id == 1 || v.id == 2) {
                            availableCosts.push(v);
                        }
                    });
                }
                if (costType == 3) {
                    $.each(vm.listsCache.CostType, function(k, v) {
                        if (v.id == 3) {
                            availableCosts.push(v);
                        }
                    });
                }
                return availableCosts;
            }

            if($scope.additionalCostsComponentTypes === undefined){
                vm.getAdditionalCostsComponentTypes(function(additionalCostsComponentTypes) {
                    return doFiltering(additionalCostsComponentTypes);
                });
            }else{
                return doFiltering($scope.additionalCostsComponentTypes);
            }
           
        };
        $scope.setDefaultCostType = function(additionalCost) {
            $.each($scope.additionalCostsComponentTypes, function(k, v) {
                if (v.id == additionalCost.id) {
                    defaultCostType = v.costType;
                }
            });
            return defaultCostType;
        };
        $scope.resetUom = function(key1, key2) {
            if ($scope.formValues.products[key1].additionalCosts[key2].costType.name != "Unit") {
                $scope.formValues.products[key1].additionalCosts[key2].uom = null;
            } else {
                $scope.formValues.products[key1].additionalCosts[key2].uom = $scope.tenantSetting.tenantFormats.uom;
            }
        };
        $scope.clearSchedules = function() {
            $scope.formValues.pricingScheduleOptionDateRange = null;
            $scope.formValues.pricingScheduleOptionSpecificDate = null;
            $scope.formValues.pricingScheduleOptionEventBasedSimple = null;
            $scope.formValues.pricingScheduleOptionEventBasedExtended = null;
            $scope.formValues.pricingScheduleOptionEventBasedContinuous = null;
        };
        $scope.getProductTooltipByProductId = function(productId) {
            tooltipName = null;
            $.each($listsCache.Product, function(pk, pv) {
                if (pv.id == productId) {
                    tooltipName = pv.displayName;
                }
            });
            return tooltipName;
        };
        $scope.goToFormulaScreen = function(id) {
            console.log(id);
            console.log($scope.formValues);
            // if (localStorage.getItem("uneditableFormula")) {
            //     localStorage.removeItem("uneditableFormula");
            // }
            // if (!$scope.formValues.status) return;
            // if (!id) return;
            // if ($scope.formValues.status.name == "Confirmed" || $scope.formValues.status.name == "Delivered") {
            //     localStorage.setItem("uneditableFormula", id);
            // }
            $window.open(location.origin + "/#/masters/formula/edit/" + id, "_blank");
            // console.log( location.origin + '/#/masters/formula/edit/' + id)
        };
        $scope.checkEditableFormula = function(isEditable) {

                if (!isEditable) {
                    $scope.submitedAction = true;
                    toastr.error("Formula cannot be modifed for a Confirmed / Delivered contract");

            }
        };
        vm.checkVerifiedDelivery = [false, false];
        vm.checkVerifiedDeliveryFromLabs = function(orderChange) {
            if (orderChange == "orderChange") {
                // console.log(orderChange)
                $("#DeliveryDeliveryID")[0].disabled = "";
                $("#DeliveryDeliveryID")[0].options[0].text = "";
                return;
            }
            if (orderChange == "loadedData") vm.checkVerifiedDelivery[1] = true;
            if (orderChange == "loadedControl") vm.checkVerifiedDelivery[0] = true;
            if (vm.checkVerifiedDelivery[0]) {
                if (vm.checkVerifiedDelivery[1]) {
                    $timeout(function() {
                        var someValidOption = false;
                        console.log("#DeliveryDeliveryID", $("#DeliveryDeliveryID"));
                        $.each($("#DeliveryDeliveryID")[0].options, function(key, val) {
                            console.log(val.value);
                            if (val.value != "?" && val.value != "" && val.value != " ") someValidOption = true;
                        });
                        if (!someValidOption && vm.entity_id > 0) {
                            console.log("#DeliveryDeliveryID", $("#DeliveryDeliveryID"));
                            $("#DeliveryDeliveryID")[0].disabled = true;
                            if ($scope.formValues.delivery != null) {
                                $("#DeliveryDeliveryID")[0].options[0].text = $scope.formValues.delivery.name + " is not Verified";
                            }
                        }
                    }, 10);
                }
            }
        };
        $scope.showMultiLookupWarning = function(model) {
            setTimeout(function() {
                if (model) {
                    if (model.id && !vm.plusClickedMultilookup) {
                        toastr.warning("Please click on ‘+’ button to add");
                    }
                }
                vm.plusClickedMultilookup = false;
            }, 300);
        };
        $scope.validateEmailPattern = function(modelData) {
            pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            resultOk = pattern.test(modelData);
            if (resultOk) {
                return modelData;
            } else {
                return null;
            }
        };
        jQuery(document).ready(function() {
            setTimeout(function() {
                var inputs = document.querySelectorAll(".inputfile");
                Array.prototype.forEach.call(inputs, function(input) {
                    var label = input.nextElementSibling,
                        labelVal = label.innerHTML;
                    input.addEventListener("change", function(e) {
                        $rootScope.droppedDoc = null;
                        $scope.$apply(function() {
                            $scope.droppedDoc = null;
                        });
                        var fileName = "";
                        if (this.files && this.files.length > 1) fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length);
                        else fileName = e.target.value.split("\\").pop();
                        if (fileName) label.querySelector("span").innerHTML = fileName;
                        else label.innerHTML = labelVal;
                    });
                    // Firefox bug fix
                    input.addEventListener("focus", function() {
                        input.classList.add("has-focus");
                    });
                    input.addEventListener("blur", function() {
                        input.classList.remove("has-focus");
                    });
                });
            }, 1500);
            setTimeout(function() {
                $.each($(".bootstrap-tagsinput .tag"), function(k, v) {
                    $(this).attr("tooltip", "");
                    $(this).attr("data-original-title", $(v).text());
                    $(v)
                        .tooltip("show")
                        .tooltip("hide");
                });
            }, 10);
        });
        //  $("select.visibleSectionsFilter").on("change", function() {
        //      select = this
        //      setTimeout(function(){
        //          options = $(select).find("option[value!='']");
        //          selectedOptions = $(select).find("option[value!='']:selected");
        //          if (typeof(selectedOptions) != 'undefined') {
        //              if (selectedOptions.length <= 1) {
        //                  if ($(selectedOptions)[0]) {
        //                  $($(selectedOptions)[0]).attr("disabled", "disabled");
        //                  $('.selectpicker').selectpicker('refresh');
        //                  }
        //              } else {
        //                  $(options).removeAttr("disabled");
        //                  $('.selectpicker').selectpicker('refresh');
        //              }
        //              console.log(selectedOptions);
        //          }
        // $('.selectpicker').selectpicker('refresh');
        //      },300)
        //  })
        $scope.$on("formValues", function() {
            // vm.initRobSectionUOM();
            if(vm.screen_id == 'additionalcost') {
                $scope.triggerChangeFields('CostType', 'costType');
            }
        });
        vm.initRobSectionUOM = function() {
            if (typeof $scope.formValues != "undefined") {
                var uomsToPopulate = ["robHsfoDeliveryUom", "robLsfoDeliveryUom", "robDoGoDeliveryUom", "robHsfoRedeliveryUom", "robLsfoRedeliveryUom", "robDoGoRedeliveryUom"];
                $.each(uomsToPopulate, function(key, val) {
                    // if((typeof $scope.formValues[val] != 'undefined') && ((typeof $scope.formValues[val] != 'object') || ($scope.formValues[val] == null))){
                    //     $scope.formValues[val] = $tenantSettings['tenantFormats']['uom'];
                    // }
                    if (typeof $scope.formValues[val] == "undefined" || $scope.formValues[val] == null) {
                        $scope.formValues[val] = $tenantSettings["tenantFormats"]["uom"];
                    }
                });
            }
        };
        vm.initOptionsForDefaultLab = function() {
            // defaultLab -- options[defaultLab]
            // var payload = {
            //     app: "masters",
            //     screen: "counterpartylist",
            //     clc_id: "masters_counterpartylist_labs"
            // }
            Factory_Master.get_master_list_filtered("masters", "counterpartylist", "masters_counterpartylist_labs", function(response) {
                defaultLabOptions = [];
                if (response) {
                    if (response.rows.length > 0) {
                        $.each(response.rows, function(k, v) {
                            defaultLabOptions.push({
                                name: v.name,
                                id: v.id
                            });
                        });
                        $scope.options["defaultLab"] = defaultLabOptions;
                    }
                }
            });
        };
        $scope.defaultHolidayRuleDays = function() {
            if ($scope.formValues.pricingScheduleOptionEventBasedContinuous.period.id != 4) {
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = $scope.options.HolidayRule[1];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = $scope.options.HolidayRule[1];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = $scope.options.HolidayRule[1];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = $scope.options.HolidayRule[1];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = $scope.options.HolidayRule[1];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = $scope.options.HolidayRule[1];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = $scope.options.HolidayRule[1];
            } else {
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.sundayHolidayRule = $scope.options.HolidayRule[0];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.mondayHolidayRule = $scope.options.HolidayRule[0];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.tuesdayHolidayRule = $scope.options.HolidayRule[0];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.wednesdayHolidayRule = $scope.options.HolidayRule[0];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.thursdayHolidayRule = $scope.options.HolidayRule[0];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.fridayHolidayRule = $scope.options.HolidayRule[0];
                $scope.formValues.pricingScheduleOptionEventBasedContinuous.saturdayHolidayRule = $scope.options.HolidayRule[0];
            }
        };
        /*Location Master Preffered Seller Product Table*/
        $scope.openLocationPreferredSellerProducts = function(currentSellerKey) {
            $scope.locationCurrentPreferredSellerKey = currentSellerKey;
            tpl = $templateCache.get("app-general-components/views/modal_preferredSellersProduct.html");
            // payload
            $scope.locationMasterPreferredSellerProductsTableConfig = {};
            getPayload = $scope.createLocationPreferredSellerProductsPayload();
            getPreferredProductsForSellerInLocation = {
                Payload: {
                    LocationId: vm.entity_id != "" ? vm.entity_id : 0,
                    SellerId: $scope.formValues.sellers[currentSellerKey].id
                }
            };
            
            // preferred products
            $scope.preferredProductsForSellerInLocation = [];
            $scope.NOTpreferredProductsForSellerInLocation = [];
            $.each($scope.formValues.sellers[currentSellerKey].products, function(ppk, ppv) {
                if ($scope.preferredProductsForSellerInLocation.indexOf(ppv.product.id + "") == -1) {

                    //append preffered products to payload
                    getPayload.Payload.SelectedProductIds.push(ppv.product.id); // number needed
                    $scope.preferredProductsForSellerInLocation.push(ppv.product.id + "");
                }
            });

            //make SelectedProducts a string
            getPayload.Payload.SelectedProductIds = JSON.stringify(getPayload.Payload.SelectedProductIds);
            localStorage.setItem('preferredProducts', getPayload.Payload.SelectedProductIds);
            // $scope.setPrefferedPoductsForSellerInTable();

    
            Factory_Master.getProductsForSellerInLocation(getPayload, function(response) {
                if (response) {
                    $scope.locationPreferredSellerProductsData = response.data.payload;

                    //all products
                    if(!$scope.locationPreferredSellerProductsDataAllProd){
                        $scope.locationPreferredSellerProductsDataAllProd = [];
                    }
                    $scope.locationPreferredSellerProductsDataAllProd = _.union($scope.locationPreferredSellerProductsDataAllProd, response.data.payload);


                    console.log($scope.locationPreferredSellerProductsDataAllProd);


                    $scope.locationPreferredSellerProductsDataLength = response.data.matchedCount;
                    $scope.locationPreferredSellerProductsDataPages = Math.ceil($scope.locationPreferredSellerProductsDataLength / $scope.locationMasterPreferredSellerProductsTableConfig.take);
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        size: "full",
                        appendTo: angular.element(document.getElementsByClassName("page-container")),
                        windowTopClass: "fullWidthModal",
                        scope: $scope //passed current scope to the modal
                    });
                }
            });
        };

        $scope.createLocationPreferredSellerProductsPayload = function(reloadTable) {
            if (!$scope.locationMasterPreferredSellerProductsTableConfig.currentPage) {
                $scope.locationMasterPreferredSellerProductsTableConfig.currentPage = 1;
            }
            if (!$scope.locationMasterPreferredSellerProductsTableConfig.take) {
                $scope.locationMasterPreferredSellerProductsTableConfig.take = 25;
            }
            if (!$scope.locationMasterPreferredSellerProductsTableConfig.order) {
                $scope.locationMasterPreferredSellerProductsTableConfig.order = {};
            }
            $scope.locationMasterPreferredSellerProductsTableConfig.skip = ($scope.locationMasterPreferredSellerProductsTableConfig.currentPage - 1) * $scope.locationMasterPreferredSellerProductsTableConfig.take;
            payload = {
                Payload: {
                    SelectedProductIds: [],
                    Order: {
                        ColumnName: $scope.locationMasterPreferredSellerProductsTableConfig.order.columnName,
                        SortOrder: $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder
                    },
                    PageFilters: {
                        Filters: []
                    },
                    Filters: [],
                    SearchText: $scope.locationMasterPreferredSellerProductsTableConfig.searchText,
                    Pagination: {
                        Skip: $scope.locationMasterPreferredSellerProductsTableConfig.skip,
                        Take: $scope.locationMasterPreferredSellerProductsTableConfig.take
                    },
                    SortList: [
                        {
                            columnValue: "name",
                            sortParameter: 2
                        },
                        {
                            columnValue: "parent_name",
                            sortIndex: 1,
                            sortParameter: 1
                        }
                    ]
                }
            };
            if (reloadTable) {
                Factory_Master.getProductsForSellerInLocation(payload, function(response) {
                    if (response) {
                        $scope.locationPreferredSellerProductsData = response.data.payload;

                        //all products
                        if(!$scope.locationPreferredSellerProductsDataAllProd){
                            $scope.locationPreferredSellerProductsDataAllProd = [];
                        }
                        $scope.locationPreferredSellerProductsDataAllProd = _.union($scope.locationPreferredSellerProductsDataAllProd, response.data.payload);

                        
                        $scope.locationPreferredSellerProductsDataLength = response.data.matchedCount;
                        $scope.locationPreferredSellerProductsDataPages = Math.ceil($scope.locationPreferredSellerProductsDataLength / $scope.locationMasterPreferredSellerProductsTableConfig.take);
                    }
                });
            }
            return payload;
        };
        $scope.savePrefferedSellerProducts = function() {
            if ($scope.preferredProductsForSellerInLocation.length <= 0) {
                toastr.error("Please select at least one product");
                return;
            }
            preferredProducts = [];
            $.each($scope.preferredProductsForSellerInLocation, function(k, v) {
                preferredProducts.push({
                    product: {
                        id: parseFloat(v),
                    },
                    isDeleted: false
                });
            });
            // $.each($scope.NOTpreferredProductsForSellerInLocation, function(k, v) {
            //     preferredProducts.push({
            //         product: {
            //             id: parseFloat(v),
            //         },
            //         isDeleted: true
            //     });
            // });
            $scope.prettyCloseModal();
            $.each($scope.formValues.sellers[$scope.locationCurrentPreferredSellerKey].products, function(_, initProdV) {
            	$.each(preferredProducts, function(_,pv){
            		if (pv.product.id == initProdV.product.id) {
						pv.id = initProdV.id;
            		}
            	})
            })
          
            $.each(preferredProducts, function(key1, val1){
                if(typeof val1.product.name == 'undefined'){
                    $.each($scope.locationPreferredSellerProductsDataAllProd, function(key2, val2){
                        if(val2.id == val1.product.id){
                            val1.product.name = val2.name;
                        }
                    });
                }
            });
      
            $scope.formValues.sellers[$scope.locationCurrentPreferredSellerKey].products = preferredProducts;
            
        };
        $scope.preferredSellersSelectAllProducts = function(selectAll) {
            if (!selectAll) {
                $scope.preferredProductsForSellerInLocation = [];
                return;
            }
            payload = {
                Payload: {
                    Order: {
                        ColumnName: $scope.locationMasterPreferredSellerProductsTableConfig.order.columnName,
                        SortOrder: $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder
                    },
                    PageFilters: {
                        Filters: []
                    },
                    Filters: [],
                    SearchText: $scope.locationMasterPreferredSellerProductsTableConfig.searchText,
                    Pagination: {
                        Skip: 0,
                        Take: 99999
                    }
                }
            };
            Factory_Master.getProductsForSellerInLocation(payload, function(response) {
                if (response) {
                    $scope.preferredProductsForSellerInLocation = [];
                    response.data.payload;
                    $.each(response.data.payload, function(k, v) {
                        $scope.preferredProductsForSellerInLocation.push(v.id + "");
                        $scope.setPrefferedPoductsForSellerInTable();
                    });
                }
            });
        };

        $scope.changeLocationMasterPreferredSellerProductsTableConfigColumnSorting = function(columnId) {
            if ($scope.locationMasterPreferredSellerProductsTableConfig.order.columnName != columnId) {
                $scope.locationMasterPreferredSellerProductsTableConfig.order.columnName = columnId;
                $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder = "asc";
            } else {
                if ($scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder == "asc") {
                    $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder = "desc";
                } else {
                    $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder = "asc";
                }
            }
        };
        $scope.checkIfIsPrefferedProduct = function(productId) {
            isPreffered = false;
            if ($scope.preferredProductsForSellerInLocation.indexOf(productId + "") != -1) {
                isPreffered = true;
            }
            return isPreffered;
        };
        $scope.changePrefferedProduct = function(productId) {
            isAlreadyPreferred = -1;
            $.each($scope.preferredProductsForSellerInLocation, function(ppk, ppv) {
                if (parseFloat(ppv) == parseFloat(productId)) {
                    isAlreadyPreferred = ppk;
                }
            });
            if (isAlreadyPreferred == -1) {
                $scope.preferredProductsForSellerInLocation.push(productId + "");
                $scope.NOTpreferredProductsForSellerInLocation.splice(productId + "");
            } else {
                $scope.preferredProductsForSellerInLocation.splice(isAlreadyPreferred, 1);
                $scope.NOTpreferredProductsForSellerInLocation.push(productId + "");
            }
        };
        /*Location Master Preffered Seller Product Table*/
        $scope.getEditInstance = function() {
            return vm.editInstance;
        };
        $scope.validateEmails = function(string, key) {
     
            if (!string || string.length == 0){
                $scope.previewEmail[key] = "";
                $scope.emailPreview[key].$setValidity(key, true);
            }else{

                var emailObj = [];
         
                // force copy the string
                var string_copy = string + '';
                emailObj = string_copy.replace(/\s/g, "").split(";");
    
                emailObj = emailObj.filter(function(e) {
                    return e;
                });
    
                emailObj = emailObj.filter(function(e) {
                    return e;
                });
                pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (emailObj.length > 0) {
                    i = 0;
                    $.each(emailObj, function(k, v) {
                        if (!pattern.test(v)) {
                            toastr.error(v + " is not a valid email address!");
                            i++;
                        }
                    });
                    if (i == 0) {
                        $scope.previewEmail[key] = emailObj;
                        $scope.emailPreview[key].$setValidity(key, true);
                    } else {
                        $scope.previewEmail[key] = [];
                        $scope.emailPreview[key].$setValidity(key, false);
                    }
                }
            }
        };
        $scope.discardSavedPreview = function() {
            data = {
                Payload: {
                    EmailTemplateId: $rootScope.currentEmailTemplate,
                    BusinessId: vm.entity_id
                }
            };
            Factory_Master.discardSavedPreview(data, function(response) {
                if (response) {
                    if (response.status == true) {
                        toastr.success("Email Preview discarded!");
                        $rootScope.previewEmail = null;
                        $state.reload();
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                    }
                }
            });
        };
        $scope.saveClaimEmail = function(sendEmail, callback) {
    
            var toString = [],
                ccString = [],
                toOthersString = [],
                ccOthersString = [];

            $.each($rootScope.previewEmail.to, function(k, v) {
                toString.push(v.idEmailAddress);
            });
            $.each($rootScope.previewEmail.cc, function(k, v) {
                ccString.push(v.idEmailAddress);
            });
            if(typeof $rootScope.previewEmail.toOthers == 'string'){
                toOthersString = $rootScope.previewEmail.toOthers;
            }else{
                $.each($rootScope.previewEmail.toOthers, function(k, v) {
                    toOthersString.push(v);
                });
                toOthersString = toOthersString.toString();
            }
            if(typeof $rootScope.previewEmail.ccOthers == 'string'){
                ccOthersString = $rootScope.previewEmail.ccOthers;
            }else{
                $.each($rootScope.previewEmail.ccOthers, function(k, v) {
                    ccOthersString.push(v);
                });
                ccOthersString = ccOthersString.toString();
            }


            toString = toString.toString();
            ccString = ccString.toString();

            var data = {
                Payload: {
                    Id: $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
                    Name: $rootScope.previewEmail.comment.name,
                    Content: $rootScope.previewEmail.content,
                    EmailTemplate: {
                        Id: $rootScope.currentEmailTemplate
                    },
                    BusinessId: vm.entity_id,
                    To: $rootScope.previewEmail.to,
                    Cc: $rootScope.previewEmail.cc,
                    ToOthers: toOthersString,
                    CcOthers: ccOthersString,
                    From: $rootScope.previewEmail.from
                }
            };

            request_data = payloadDataModel.create(data.Payload);

            var comments = {
                "id": $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
                "name": $rootScope.previewEmail.comment.name,
                "emailTemplate":  $rootScope.currentEmailTemplate,
                "businessId": vm.entity_id,
                "secondBusinessId": null,
                "thirdBusinessId": null,
                "isDeleted": false,
                "content": $rootScope.previewEmail.content,
                "to": toString,
                "cc": ccString,
                "toOthers": toOthersString,
                "ccOthers": ccOthersString,
                "from": $rootScope.previewEmail.from
            };
            // find email template object
            $.each(vm.listsCache.EmailTemplate, function(key,value){
                if(value.id == $rootScope.currentEmailTemplate){
                    comments.emailTemplate =  angular.copy(value);
                    return;
                }
            })
            request_data.Payload.comment = angular.copy(comments);

            Factory_Master.save_email_contract(request_data, function(response) {
                if (response) {
                    if (response.status == true) {
                        toastr.success("Email Preview Saved!");
                        if (!sendEmail) {
	                        $rootScope.previewEmail = null;
	                        $state.reload();
                        } else  {
	                        callback(true)
                        }
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                        callback(false)
                    }
                }
            });
        };
        $scope.getIndex = function(arr, string) {
            return _.findIndex(arr, function(o) { return o.name == string; });
        };
        $scope.sendClaimPreviewEmail = function() {
        	$scope.saveClaimEmail(true, function(resp){
	            var toString = [],
	                ccString = [],
	                toOthersString = [],
	                ccOthersString = [];

	            $.each($rootScope.previewEmail.to, function(k, v) {
	                toString.push(v.idEmailAddress);
	            });
	            $.each($rootScope.previewEmail.cc, function(k, v) {
	                ccString.push(v.idEmailAddress);
	            });
	            if(typeof $rootScope.previewEmail.toOthers == 'string'){
	                toOthersString = $rootScope.previewEmail.toOthers;
	            }else{
	                $.each($rootScope.previewEmail.toOthers, function(k, v) {
	                    toOthersString.push(v);
	                });
	                toOthersString = toOthersString.toString();
	            }
	            if(typeof $rootScope.previewEmail.ccOthers == 'string'){
	                ccOthersString = $rootScope.previewEmail.ccOthers;
	            }else{
	                $.each($rootScope.previewEmail.ccOthers, function(k, v) {
	                    ccOthersString.push(v);
	                });
	                ccOthersString = ccOthersString.toString();
	            }

	            toString = toString.toString();
	            ccString = ccString.toString();
	            var saveData = {
	                Payload: {
	                    Id: $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
	                    Name: $rootScope.previewEmail.comment.name,
	                    Content: $rootScope.previewEmail.content,
	                    Subject: $rootScope.previewEmail.subject,
	                    EmailTemplateId: $rootScope.currentEmailTemplate,
	                    BusinessId: vm.entity_id,
	                    To: toString,
	                    Cc: ccString,
	                    ToOthers: toOthersString,
	                    CcOthers: ccOthersString,
	                    From: $rootScope.previewEmail.from
	                }
	            };
	            request_data = payloadDataModel.create(saveData.Payload);

	            var comments = {
	                "id": $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
	                "name": $rootScope.previewEmail.comment.name,
	                "emailTemplate":  $rootScope.currentEmailTemplate,
	                "businessId": vm.entity_id,
	                "secondBusinessId": null,
	                "thirdBusinessId": null,
	                "isDeleted": false,
	                "content": $rootScope.previewEmail.content,
	                "to": toString,
	                "cc": ccString,
	                "toOthers": toOthersString,
	                "ccOthers": ccOthersString,
	                "from": $rootScope.previewEmail.from
	            };
	            // find email template object
	            $.each(vm.listsCache.EmailTemplate, function(key,value){
	                if(value.id == $rootScope.currentEmailTemplate){
	                    comments.emailTemplate =  angular.copy(value);
	                    return;
	                }
	            })
	            request_data.Payload.comment = angular.copy(comments);

	            Factory_Master.send_email_preview(request_data, function(response) {
	                if (response) {
	                    if (response.status == true) {
	                        $scope.loaded = true;
	                        toastr.success("Email Preview was sent!");
	                        var url = $state.$current.url.prefix + $state.params.screen_id + "/edit/" + $state.params.entity_id;
	                        $location.path(url);
	                    } else {
	                        $scope.loaded = true;
	                        toastr.error(response.message);
	                    }
	                }
	            });
			})

            // Factory_Master.save_email_contract(saveData, function(response) {
            //     if (response) {
            //         if (response.status == true) {
            //             template = {
            //                 "id": $rootScope.currentEmailTemplate,
            //                 "name": $rootScope.currentEmailTemplateName
            //             };
            //             $scope.changeClaimEmailTemplate(template, true);
            //             return;
            //             if (data.warningMessage) {
            //                 confirmAction = window.confirm(data.warningMessage);
            //                 if (confirmAction) {
            //                     $scope.sendEmailPreviewActionCall()
            //                 }
            //             } else {
            //                 $scope.sendEmailPreviewActionCall()
            //             }
            //         } else {
            //             $scope.loaded = true;
            //             toastr.error(response.message);
            //         }
            //     }
            // })
        };


        $scope.sweetConfirm = function(message, callback){
        	if (!message) { return false}
        	// confirm = confirm(message);
    		sweetConfirmResponse = {};
        	$(".sweetConfirmModal").modal();
        	$(".sweetConfirmModal").removeClass("hide fade");
        	$(".sweetConfirmModal").css("transform", "translateY(100px)");
        	$(".sweetConfirmModal .modal-body").text(message);

        	$(".sweetConfirmModal .sweetConfirmModalYes").on("click", function() {
        		callback(true);
        		// sweetConfirmResponse.bool = true
        		// sweetConfirmResponse.action = action
        		// $scope.sweetConfirmHasResponded(sweetConfirmResponse)
        	})
        	$(".sweetConfirmModal .sweetConfirmModalNo").on("click", function() {
        		callback(false);
        		// sweetConfirmResponse.bool = false
        		// sweetConfirmResponse.action = action
        		// $scope.sweetConfirmHasResponded(sweetConfirmResponse)
        	})
        }
		// $scope.sweetConfirmHasResponded = function(data) {
		// 	console.log(data);
		// }

        vm.useDisplayName = function(fieldName){
            var displayNameList = ['invoiceStatus', 'customStatus', 'ClaimType'];
            var found = _.indexOf(displayNameList, fieldName);
            if(found < 0) return false;
            return true;
        }
        $scope.checkUncheckAllRoles = function(list, value){
            $.each(list, function(k,v){
                    if(v.name == "ViewOnly" ||
                        v.name == "CreateNew" ||
                        v.name == "Edit"
                        ) {
                        v.isSelected = value;
                    }
            })
            return list;
        }


		$scope.notificationAction = function(type) {
		    if ($rootScope.selectedNotifications == null || typeof($rootScope.selectedNotifications) == 'undefined') {
		        if (type != 'stats') {
		            toastr.error("Please select a notification!");
		            return;
		        }
		    }
		    console.log(type);
		    data = {
		        action: type,
		        notificationId: $rootScope.selectedNotifications
		    }
		    Factory_Master.notificationsActions(data, function(callback) {
		        if (callback) {
		            if (callback.status == true) {
		                if (type != 'stats') {
		                    toastr.success("Success!");
		                    $state.reload();
		                } else {
		                    $rootScope.notificationsStats = callback.data.unreadCount;
		                }
		            } else {
		                toastr.error("An error has occured!");
		            }
		        }
		    });
        } 
        

        $scope.triggerRobStandard = function(usingStandard){
        
            if($scope.formValues.vesselType){
                vesselTypeId = angular.copy($scope.formValues.vesselType.id);
            } else {
            	if (usingStandard) {
	                toastr.error("No vessel type defined");
	                vesselTypeId = null;
	                $scope.formValues.usingVesselTypeRob = false;
	                $scope.initRobTable();
	                return;
            	}
            }


            
            if($scope.formValues.id){
                vesselId = angular.copy($scope.formValues.id);
            } else {
                vesselId = 0;
            }

            usingStandard = $scope.formValues.usingVesselTypeRob; 
            if(usingStandard){
                vesselId = null;
            } else {
                vesselTypeId = null;
                $scope.initRobTable();
            }

            data = {"Payload":{"usingStandard":usingStandard,"vesselTypeId":vesselTypeId,"vesselId":vesselId}};
          
            
            //api/masters/vessels/listRobsVessel
            Factory_Master.bring_rob_status(data, function(callback) {
		        if (callback) {
                    console.log('rob status', callback);
		            if (callback.status == true) {
                        var robValues = callback.data.payload;
                        $scope.formValues.robs = robValues;
                        if(!robValues.length){
							$scope.initRobTable();
                        }
		            } else {
		                toastr.error("An error has occured!");
		            }
		        }
            });
            
        };

		$scope.flattenVesselVoyages = function() {
			$scope.formValues.flattenedVoyages = []
			$.each($scope.formValues.voyages, function(vk,vv){
				$.each(vv.voyageDetails, function(vdk,vdv){
					voyageDetailRow = {
						code : vv.code,
						port : vdv.port,
						portFunction : vdv.portFunction,
						country : vdv.country,
						eta : vdv.eta,
						etb : vdv.etb,
						etd : vdv.etd,
						remarks : vdv.remarks,
					}
					$scope.formValues.flattenedVoyages.push(voyageDetailRow)
				})
			})
		}

        $scope.initRobTable = function(){
          if (!$scope.formValues.robs || $scope.formValues.robs.length == 0) {
            var defaultUomId = $scope.getDefaultUom().id;
             $scope.formValues.robs = [
                {
                  'productType': {'name': 'HSFO', 'id': 1},
                  'uom': {
                    'id': defaultUomId
                  }
                }, 
                {'productType': {'name': 'LSFO', 'id': 3},
                  'uom': {
                    'id': defaultUomId
                  }
                }, 
                {'productType': {'name': 'DOGO', 'id': 6},
                  'uom': {
                    'id': defaultUomId
                  }
                },
            ]
          }
          if ($scope.formValues.usingVesselTypeRob) {
            $scope.triggerRobStandard($scope.formValues.usingVesselTypeRob)
          }
        }


        $scope.uploadPriceImport = function(){

            $scope.priceDisabledUpload = true;
  
            var availableFile = false;
            var fileLocation = "";

            // check if file is uploaded
            if($('#fileUpload')[0].files.length > 0){
                availableFile = true;
                fileLocation = "input";
            }else{
                if($scope.droppedDoc){
                    availableFile = true;
                    fileLocation = "dropped";
                }else{
                    availableFile = false;
                }
            }

            if(availableFile){
                
                // form payload
                var formData = new FormData();
                var payload = {
                    "Payload": {
                        "name": "File2",
                        "documentType": {
                            "transactionTypeId": 0,
                            "id": 0,
                            "name": "",
                            "displayName": null,
                            "code": "",
                            "collectionName": null,
                            "customNonMandatoryAttribute1": ""
                        },
                        "size": 100,
                        "fileType": "FileType",
                        "transactionType": {
                            "id": 0,
                            "name": "",
                            "code": "",
                            "collectionName": null
                        },
                        "fileId": 1,
                        "uploadedBy": {
                            "id": 0,
                            "name": "",
                            "code": "",
                            "collectionName": null
                        },
                        "uploadedOn": "2017-01-11T14:21:37.96",
                        "notes": "",
                        "isVerified": false,
                        "referenceNo": "314",
                        "createdBy": {
                            "id": 1,
                            "name": "Admin",
                            "code": "",
                            "collectionName": null
                        },
                        "createdOn": "2017-01-11T14:21:37.96",
                        "lastModifiedByUser": null,
                        "lastModifiedOn": null,
                        "id": 0,
                        "isDeleted": false
                    }
                }
                formData.append('request', JSON.stringify(payload));

                // append file
                var invalidFile = false;
                if(fileLocation == "input"){
                    if($('#fileUpload')[0].files) {
                        $.each($('#fileUpload')[0].files, function(i, file) {
                            console.log(file.type);
                            if(file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
                                formData.append('file', file);
                            }else{
                                invalidFile = true;
                            }
                        });
                    }
                }
                if(fileLocation == "dropped"){
                    console.log($scope.droppedDoc.type);
                    if($scope.droppedDoc.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
                        formData.append('file', $scope.droppedDoc);
                    }else{
                        invalidFile = true;
                    }
                }
                if(invalidFile){
                    toastr.error("File type not supported. Please add xls/xlsx.");

                    delete $scope.droppedDoc;
                    delete $rootScope.droppedDoc;
                    $('#fileUpload').val('');
                    $(".fileUploadName span").text("");
                    $scope.priceDisabledUpload = false;
                    return;
                }else{

                    //make call to upload file
                    toastr.info("Uploading...");
                    Factory_Master.uploadInvoicePrice(formData, function(callback) {
                        if (callback && callback.status == 200) {

                            toastr.success('File uploaded successfully.');
                            
                            if(callback.data)
                                if(callback.data.message != "")
                                    toastr.warning(callback.data.message);
                            

        
                   
                            $state.reload();
                                // $scope.droppedDoc = null;
                                // $rootScope.droppedDoc = null;
                                // delete $scope.uploadedFile;
                                // delete $rootScope.uploadedFile;
//                                 delete $scope.droppedDoc;
//                                 delete $rootScope.droppedDoc;
//                                 $('#fileUpload').val('');
//                                 $(".fileUploadName span").text("");
//                                 $scope.priceDisabledUpload = false;
//                                 $scope.apply();
                                       
                          
                        } else {
                            
                                // $scope.droppedDoc = null;
                                // $rootScope.droppedDoc = null;
                                // delete $scope.uploadedFile;
                                // delete $rootScope.uploadedFile;
                                delete $scope.droppedDoc;
                                delete $rootScope.droppedDoc;
                                $('#fileUpload').val('');
                                $(".fileUploadName span").text("");
                                $scope.priceDisabledUpload = false;
                                $scope.apply();
 
                        }
                    });
                }


            }else{
                toastr.error("Please add file to import!");
                $scope.priceDisabledUpload = false;
                return;
            }
        }


        vm.openEmailPreview = function(url, entity_id){
            var previewUrl = url + "/" + entity_id;
            //$window.open(previewUrl, '_blank');
            $location.path(previewUrl);

        }

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href") // activated tab
		  setTimeout(function(){
		  	$scope.$apply();
		  });
		});
// .custom-hardcoded-table.fixed-header 
		// $('tbody').on("scroll", function(e) { //detect a scroll event on the tbody
		// 	$('thead').css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
		// });


	    $scope.initEmailTemplateTypeahead = function(rowKey, rowData) {
	        if (typeof($scope.options['EmailTemplate_' + rowKey]) == 'undefined') {
	            field = {
	                Name: "EmailTemplate_" + rowKey,
	                Type: "lookup",
	                clc_id: "admin_templates",
	                masterSource: "EmailTemplate",
	                Filter: [
	                    {
	                        ColumnName: "EmailTransactionTypeId",
	                        Value: rowData.transactionType.id
	                    },
	                    {
	                        ColumnName: "Process",
	                        Value: rowData.process
	                    }
	                ]
	            };
	            vm.getOptions(field);
	        }
	    }

	    $rootScope.$on("setInvoiceApplicableFor", function(e, data){
	    	$scope.dtMasterSource.applyFor = data;
	    	vm.invoiceApplicableForProducts = data;
        })
        
        vm.initMask = function(timeout){
            vm.formatted = "";
            if(!$scope.formatDates)  $scope.formatDates = {};

            //  helper functions 
            var datePositions = {
                day: 0,
                month: 0,
                year: 0
            }
            var charCodes = {
                47: "/",
                45: "-",
                46: "."
            }
            function parseHour(str){
                str = str.split(" ")[1];
                return {
                    hours: str.split(":")[0],
                    minutes: str.split(":")[1]
                }
            }
            function parseDate(str, separator, positions){
                str = str.split(" ")[0];
                return {
                    day: str.split(separator)[positions['day']],
                    month: str.split(separator)[positions['month']],
                    year: str.split(separator)[positions['year']]
                }
            }

            function findSeparator(str){
                var idx = 0;
                while(charCodes[str[idx].charCodeAt(0)] === undefined) idx++;
                return str[idx];
            }


            function calculateDatePositions(format){
                format = format.toLowerCase();
                format = format.split(" ")[0]; // remove hour
                var separator = findSeparator(format)
                var bits = format.split(separator);
                $.each(bits, function(key,val){
                     if(val.indexOf("y") >= 0) datePositions['year'] = key;
                     if(val.indexOf("m") >= 0) datePositions['month'] = key;
                     if(val.indexOf("d") >= 0) datePositions['day'] = key;
                })

                return datePositions;
            }
            function normalizeFormatter(str){
                str.replace("MMM","MM");
                return str;
            }

            function formMomentFormat(format, dateOnly){
                var date = format.split(" ")[0].toUpperCase();
                if(dateOnly) return date;
                return date + " HH:mm"; // default 24hours and minutes
            }
            function formMaskFormat(format, dateOnly){
                // debugger;
                var idx = 0;
                var mask = "";  
                format = format.toLowerCase();
                if(format.indexOf('mmm') < 0){
                    // only numbers
                    for(idx = 0; idx < format.length; idx++){
                        if(format.charCodeAt(idx) >= 97 && format.charCodeAt(idx) <= 122){ // is letter
                            mask = mask + "0"; // allow any number
                       }else{
                        mask = mask + format[idx];
                       }
                    }
                }else{
                    // for 'MMM' allow letters
                    for(idx = 0; idx < format.length; idx++){
                        if(format.charCodeAt(idx) >= 97 && format.charCodeAt(idx) <= 122){ // is letter
                            if(format.charCodeAt(idx) == 109){
                                mask = mask + "A"; // allow any letter
                            }else{
                                mask = mask + "0"; // allow any number
                            }
             
                       }else{
                            mask = mask + format[idx];
                       }
                    }
                }
                if(dateOnly) return mask.split(" ")[0];
                return mask;
            }

            // end helper functions

            /// initialization
            var currentFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;

            var DATE_POSITIONS = calculateDatePositions(currentFormat);
            var SEPARATOR = findSeparator(currentFormat);
      
            var momentFormat = formMomentFormat(currentFormat);
            var momentFormatDateOnly = formMomentFormat(currentFormat, true);
            var maskFormat = formMaskFormat(currentFormat);
            var maskFormatDateOnly = formMaskFormat(currentFormat, true);


            vm.DATE_OPTIONS = {
                datePositions: DATE_POSITIONS,
                separator: SEPARATOR,
                momentFormat: momentFormat,
                momentFormatDateOnly: momentFormatDateOnly,
                maskFormat: maskFormat,
                maskFormatDateOnly: maskFormatDateOnly
            }

            /// end variables initialization
        

            // mask options
            var options =  {
                translation: {
                    //-----  date 
                    //1. day
                    d: {pattern: /[0-2]/}, // fist digit of day ( 0 / 2 ),
                    e: {pattern: /[0-9]/}, // second digit of day ( 0 / 9 ),
                    f: {pattern: /[0-1]/}, // second digit of day ( 0 / 1 ),
                    // 2. month
                    m: {pattern: /[0-1]/}, // first digit of month ( 0 / 1)
                    n: { pattern: /[0-9]/}, // second digit of month ( 0 -9 )
                    o: { pattern: /[0-2]/ },// second digit of month ( 0 -2 )
                    // 3. year
                    y: {pattern: /[0-9]/},
                    // ----- hour
                    // 4. hour
                    h: { pattern: /[0-2]/}, // first digit of hour ( 0 - 2)
                    j: { pattern: /[0-9]/}, // second digit of hour ( 0 - 9 )
                    K: { pattern: /[0-4]/}, // second digit of hour ( 0 - 4)
                    // 5. min
                    a: { pattern: /[0-5]/}, // first digit of minute ( 0 - 5 )
                    b: { pattern: /[0-9]/}, // second digit of minute ( 0 - 9)
                },
                onKeyPress: function(value, e, field, options) {
                    // select formatter
                    var formatUsed = "";
                    if(field.hasClass('date-only')){
                        formatUsed  = vm.DATE_OPTIONS.momentFormatDateOnly;
                    }else{
                        formatUsed  = vm.DATE_OPTIONS.momentFormat;
                    }
                   
                    // process date
                    var val = moment(value, formatUsed, true);

                    // console.log(field.hasClass('date-only'))
                    // console.log(val, val.isValid());
                    
                    // test date validity
                    if(vm.invalidDate === undefined) vm.invalidDate = {};
                    if(val.isValid()){
                        vm.invalidDate[field[0].name] = false;
                    }else{
                        vm.invalidDate[field[0].name] = true;
                    }
                }
            }
            // end mask options


            // ACTUAL MASK INITIALIZATION
            function init(){
                var dateTime = $('.formatted-date-input.date-time');
                $.each(dateTime, function(key){
                    $(dateTime[key]).mask(maskFormat, options);
                })
                var dateOnly = $('.formatted-date-input.date-only');
                $.each(dateOnly, function(key){
                    $(dateOnly[key]).mask(maskFormatDateOnly, options);
                })
            }
            if(timeout){
                setTimeout(init,2000);
            }else{
                init();
            }
   

            // END ACTUAL MASK INITIALIZATION
            
        }

        vm.initValidityForDate = function(name){
            if(vm.invalidDate === undefined) vm.invalidDate = {};
            vm.invalidDate[name] = false;
        }

        vm.formatDateTimeReverse = function (value, simpleDate){
            var val = null;
            if(simpleDate) val = moment(value, vm.DATE_OPTIONS.momentFormatDateOnly, true)
            else val = moment(value, vm.DATE_OPTIONS.momentFormat, true)
        
            if(val.isValid()) return val.format('YYYY-MM-DDTHH:mm:ss');
            return null;
        }

        vm.setValue = function(inputDetails, direction, simpleDate, app){
            

            /**  @param inputDetails - object w. the inputs details:
             * 
             *    - root: CM/$scope/$rootScope/any other controller
             *    - path: string path to the object, can be nested: "formValues.deliveryProducts[0].headers.myValue"
             *    - isNested: true if path is nested, false otherwise
             *    - pickerId: id set to <span class="input-group-btn date-picker">, used to set date inside the datepicker after date is set manually
             * 
             *    Note: deep nested properties will be accessed using lodash
             *    _.get(root, path) _.get(object, 'a[0].b.c');
             *    _.set(root, path, valueToSet); // _.set(object, 'a[0].b.c', 4);
             * 
             *   @param direction - number (1 / 2)
             *    - whether function is called after datepicker changes date (1) or after date is changed by typing (2)
             * 
             *   @param simpleDate - boolean 
             *    - true if date is date-only
             * 
             *   @param app - string
             *    - sometimes this is needed when calling vm.formatSimpleDate
             * 
             *   ------------------------------------------------------------------------------
             * 
             *  1. Date formed by typing is stored in root.formatDates[path]
                So if i have Some_Controller.nested.nested2.value => the formated value will be in Some_Controller.formatDates.nested.nested2.value 

                2. @variable DATE_FORMAT is set to $scope.tenantSetting.tenantFormats.dateFormat
                  This needs to be changed if it has other path in other controller
             */
            var DATE_FORMAT = $scope.tenantSetting.tenantFormats.dateFormat;

            var rootMap = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'vm': vm
            }

            if (!vm.overrideInvalidDate) {
                vm.overrideInvalidDate = {}
            }
            vm.overrideInvalidDate[inputDetails.pickerId] = true;

            if(direction == 1){
                // datepicker input -> date typing input
                $timeout(function() {
                    if(simpleDate){
                        var dateValue = _.get(rootMap[inputDetails.root],inputDetails.path);
                        var formattedDate = vm.formatSimpleDate(dateValue, DATE_FORMAT, app);
                        _.set(rootMap[inputDetails.root], "formatDates." + inputDetails.path, formattedDate); 
                    } else{
                        var dateValue = _.get(rootMap[inputDetails.root],inputDetails.path);
                        var formattedDate = vm.formatDateTime(dateValue, DATE_FORMAT);
                        _.set(rootMap[inputDetails.root], "formatDates." + inputDetails.path, formattedDate); 
                    }
                    vm.overrideInvalidDate[inputDetails.pickerId] = false;
                },2);
            }
            if(direction == 2){
                // date typing input -> datepicker input 
                $timeout(function() { 
                    
                    var date = _.get(rootMap[inputDetails.root], "formatDates." +  inputDetails.path);
                    var copy = angular.copy(date);
                    var formattedDate = vm.formatDateTimeReverse(copy, simpleDate);
                    _.set(rootMap[inputDetails.root], inputDetails.path, formattedDate); 

                    // also change datepicker value
                    $('.date-picker#' + inputDetails.pickerId).datetimepicker('setDate', new Date(formattedDate));
                },2);
            }
        }

        jQuery(document).ready(function(){
        	$(".date-picker").on("mouseover", function(){
        		if (!vm.DATE_OPTIONS) {
        			return;
        		}
        		dp = $(this).find("input");
        		val = $(this).prev(".formatted-date-input").val();

	            var formattedDate = vm.formatDateTimeReverse(val, true);

	            // also change datepicker value
	            $(dp).datetimepicker('setDate', new Date(formattedDate));

        	})
        })

        vm.stopPropagation = function($event){
            console.log($event);
            $event.stopPropagation();
        }

    }
]);
