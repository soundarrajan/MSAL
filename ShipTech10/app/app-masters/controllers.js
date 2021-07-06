/**
 * Master Controller
 */
 APP_MASTERS.controller('Controller_Master', [
    'API',
    '$tenantSettings',
    'tenantService',
    '$scope',
    '$rootScope',
    '$sce',
    '$Api_Service',
    'Factory_Master',
    '$state',
    '$location',
    '$q',
    '$compile',
    '$timeout',
    '$interval',
    '$templateCache',
    '$listsCache',
    '$uibModal',
    'uibDateParser',
    'uiGridConstants',
    '$filter',
    '$http',
    '$window',
    '$controller',
    'payloadDataModel',
    'statusColors',
    'screenLoader',
    '$parse',
    'EMAIL_TRANSACTION',
    'STATE',
    'orderModel',
    function(API, $tenantSettings, tenantService, $scope, $rootScope, $sce, $Api_Service, Factory_Master, $state, $location, $q, $compile, $timeout, $interval, $templateCache, $listsCache, $uibModal, uibDateParser, uiGridConstants, $filter, $http, $window, $controller, payloadDataModel, statusColors, screenLoader, $parse, EMAIL_TRANSACTION, STATE, orderModel) {
    	// extendScreenLayout(window.masterCTRL, this, statusColors);
        let ctrl=this;
        $scope.tradeBookfilter=[];
        $rootScope.TempadditionalCosts = [];
        $scope.vm = this;
        $scope.preferredContacts = [];

        $controller('ScreenLayout_Controller', {
            $scope: $scope
        });

        let vm = this;
        vm.scope = $scope;
        if ($state.params.path) {
            vm.app_id = $state.params.path[0].uisref.split('.')[0];
        }
        vm.isCMATranslations = window.isCMATranslations;
        if ($scope.screen) {
            vm.screen_id = $scope.screen;
        } else {
            vm.screen_id = $state.params.screen_id;
        }
        $scope.typeOf = function(argument) {
            return typeof argument;
        };
        $scope.copiedId = 0;
        $rootScope.$broadcast('editInstance', vm.editInstance);
        // APP SPECIFIC CONTROLLER INSERTION
        $controller('Controller_Datatables', {
            $scope: $scope
        }); // This works
        // $controller('Controller_General_Header', { $scope: $scope });
        if (vm.app_id == 'alerts') {
            $controller('Controller_Alerts', {
                $scope: $scope
            });
        }

        /*
        if (vm.app_id == "invoices") {
            $controller("Controller_Invoice", {
                $scope: $scope
            });
        }
        */
        if (vm.app_id == 'delivery') {
            $controller('Controller_Delivery', {
                $scope: $scope
            });
        }
        if (vm.app_id == 'admin') {
            $controller('Controller_Admin', {
                $scope: $scope
            });
        }
        if (vm.app_id == 'contracts') {
            $controller('Controller_Contract', {
                $scope: $scope
            });
        }
        if (vm.app_id == 'claims') {
            $controller('Controller_Claims', {
                $scope: $scope
            });
        }
        if (vm.app_id == 'labs') {
            $controller('Controller_Labs', {
                $scope: $scope
            });
        }
        if (vm.app_id == 'recon') {
            $controller('Controller_Recon', {
                $scope: $scope
            });
        }

        if (!vm.overrideInvalidDate) {
            vm.overrideInvalidDate = {};
        }

        // angular.element(document).ready(function () {
        // 	setTimeout(function(){
        // 		screenLoader.hideLoader();
        // 	},7000)
        // });

        // END APP SPECIFIC CONTROLLER INSERTION
        vm.entity_id = $state.params.entity_id;
        vm.location_id = $state.params.location_id;
        $rootScope.entity_id = $state.params.entity_id;
        vm.isDev = 0;
        vm.listsCache = $listsCache;

        vm.formValues = $rootScope.formValues;

        let mcrPart = 0.5; //50%
        let oneReeferConsumption = 4.0; //4 KWH

        //These constants are used for calculating Vessel - One Day Reserve. (mcrPart, oneReeferConsumption)
        if (vm.app_id == 'masters' && vm.screen_id == 'vessel' && !$scope.isHideVesselBopsDetails) {
            vm.formValues.mcrPart = mcrPart;
            vm.formValues.oneReeferConsumption = oneReeferConsumption;
        }

        $scope.host = $location.$$host;
        $scope.changedFields = 0;
        $scope.submitedAction = false;
        $scope.reloadPage = false;

        $(document).on('click',  function (event) {
            if ($(event.target).parent()[0].nodeName != 'LI' && $(event.target).parents('.st-main-content-menu').length && ($(event.target).hasClass('btn') || $(event.target).hasClass('ladda-label'))) {
                window.actionLevel = event.target.outerText.trim();
                if (event.target.outerText == 'Save') {
                    let length = window.location.href.split('/#/')[1].split('/').length - 1;
                    let id = parseFloat(window.location.href.split('/#/')[1].split('/')[length]);
                    if (!isNaN(id)) {
                        window.actionLevel = 'Update';
                    }
                }
                if ($(event.target).parents('li').length && ($(event.target).parents('.dropdown-menu.st-extra-buttons').length || $(event.target).parents('.dropdown-menu.pull-right').length)) {
                    window.actionLevel = event.target.outerText.trim();
                }
            }


        });
        $scope.submitedAcc = function(act) {
            $timeout(() => {
                if (act != 'save_master_changes()') {
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
            if (!$rootScope.getAdminConfigurationCall) {
                $rootScope.getAdminConfigurationCall = true;
                if (vm.app_id == 'admin' && vm.screen_id == 'configuration') {
                    return;
                }
                Factory_Master.get_master_entity(1, 'configuration', 'admin', (callback2) => {
                    if (callback2) {
                    	$rootScope.$broadcast('adminConfiguration', callback2);
                        $rootScope.getAdminConfigurationCall = false;
                        vm.adminConfiguration = callback2;
                        $rootScope.adminConfiguration = callback2;
				        $scope.isHideVesselBopsDetails = !$rootScope.adminConfiguration.master.isVesselBopsDetailsVisible;
                    }
                });
            }
        };
        //its used to hide LocationTerminals ScreenLayout
        $scope.isLocationTerminalVisible = function () {
            var isLoactionterminals = false;
            if ($rootScope.adminConfiguration.master.isLocationTerminalVisible == true) {
                isLoactionterminals = true;
            } else {
                isLoactionterminals = false;
            }
            return isLoactionterminals;
        }


         //its used to hide PortSequence ScreenLayout
         $scope.isPortSequenceVisible=function(){
            var isPortSequences=false;
            if($rootScope.adminConfiguration.master.isPortSequenceVisible==true){
                isPortSequences=true;
            } else {
                isPortSequences=false;
            }
            return isPortSequences;
        }

        //its used to hide BankAccount Number isCounterpartyBankAccountAddable ScreenLayout
        $scope.isCounterpartyBankAccountAddable = function () {
            var isCounterpartyBankAccountAddable = false;
            if ($rootScope.adminConfiguration.master.isCounterpartyBankAccountAddable == true) {
                isCounterpartyBankAccountAddable = true;
            } else {
                isCounterpartyBankAccountAddable = false;
            }
            return isCounterpartyBankAccountAddable;
        }

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
        };

        vm.getStatusColor = function(statusName, cell) {
            let statusColor = statusColors.getDefaultColor();
            if(statusName) {
                statusColor = statusColors.getColorCode(statusName);
            }
            if(cell && cell.displayName) {
                statusColor = statusColors.getColorCode(cell.displayName);
                $.each(vm.listsCache.ScheduleDashboardLabelConfiguration, (k, v) => {
                    if(cell.id === v.id && cell.transactionTypeId === v.transactionTypeId) {
                        statusColor = v.code;
                        return false;
                    }
                });
            }
            return statusColor;
        };
        $scope.$on('visible_sections', (event, object) => {
            $scope.visible_sections = object;
            if (vm.app_id == 'contracts') {
                if ($rootScope.formValues.productQuantityRequired) {
                    vm.equalizeColumnsHeightGrouped('.group_ContractSummary', '.group_General_Contract, .group_contact');
                } else {
                    vm.equalizeColumnsHeightGrouped('.group_ContractSummary', '.group_General_Contract, .group_contact, .group_contractualQuantity, .group_ProductDetails, .group_AdditionalCosts, .group_Penalty');
                }
            }
        });
        vm.isMobile = (function() {
            let check = false;
            (function(a) {
                if (
                    (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i).test(a) ||
                    (/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(
                        a.substr(0, 4)
                    )
                ) {
                    check = true;
                }
            }(navigator.userAgent || navigator.vendor || window.opera));
            return check;
        }());
        vm.mime_types = {
            'application/postscript': 'ps',
            'audio/x-aiff': 'aiff',
            'text/plain': 'txt',
            'application/atom+xml': 'atom',
            'audio/basic': 'snd',
            'video/x-msvideo': 'avi',
            'application/x-bcpio': 'bcpio',
            'application/octet-stream': 'so',
            'image/bmp': 'bmp',
            'application/x-netcdf': 'nc',
            'image/cgm': 'cgm',
            'application/x-cpio': 'cpio',
            'application/mac-compactpro': 'cpt',
            'application/x-csh': 'csh',
            'text/css': 'css',
            'text/csv': 'csv',
            'application/x-director': 'dxr',
            'image/vnd.djvu': 'djvu',
            'application/msword': 'doc',
            'application/xml-dtd': 'dtd',
            'application/x-dvi': 'dvi',
            'text/x-setext': 'etx',
            'application/andrew-inset': 'ez',
            'image/gif': 'gif',
            'application/srgs': 'gram',
            'application/srgs+xml': 'grxml',
            'application/x-gtar': 'gtar',
            'application/x-hdf': 'hdf',
            'application/mac-binhex40': 'hqx',
            'text/html': 'html',
            'x-conference/x-cooltalk': 'ice',
            'image/x-icon': 'ico',
            'text/calendar': 'ifb',
            'image/ief': 'ief',
            'model/iges': 'igs',
            'image/jpeg': 'jpg',
            'application/x-javascript': 'js',
            'application/json': 'json',
            'audio/midi': 'midi',
            'application/x-latex': 'latex',
            'audio/x-mpegurl': 'm3u',
            'application/x-troff-man': 'man',
            'application/mathml+xml': 'mathml',
            'application/x-troff-me': 'me',
            'model/mesh': 'silo',
            'application/vnd.mif': 'mif',
            'video/quicktime': 'qt',
            'video/x-sgi-movie': 'movie',
            'audio/mpeg': 'mpga',
            'video/mpeg': 'mpg',
            'application/x-troff-ms': 'ms',
            'video/vnd.mpegurl': 'mxu',
            'application/oda': 'oda',
            'application/ogg': 'ogg',
            'image/x-portable-bitmap': 'pbm',
            'chemical/x-pdb': 'pdb',
            'application/pdf': 'pdf',
            'image/x-portable-graymap': 'pgm',
            'application/x-chess-pgn': 'pgn',
            'image/png': 'png',
            'image/x-portable-anymap': 'pnm',
            'image/x-portable-pixmap': 'ppm',
            'application/vnd.ms-powerpoint': 'ppt',
            'audio/x-pn-realaudio': 'ram',
            'image/x-cmu-raster': 'ras',
            'application/rdf+xml': 'rdf',
            'image/x-rgb': 'rgb',
            'application/vnd.rn-realmedia': 'rm',
            'application/x-troff': 'tr',
            'application/rss+xml': 'rss',
            'text/rtf': 'rtf',
            'text/richtext': 'rtx',
            'text/sgml': 'sgml',
            'application/x-sh': 'sh',
            'application/x-shar': 'shar',
            'application/x-stuffit': 'sit',
            'application/x-koan': 'skt',
            'application/smil': 'smil',
            'application/x-futuresplash': 'spl',
            'application/x-wais-source': 'src',
            'application/x-sv4cpio': 'sv4cpio',
            'application/x-sv4crc': 'sv4crc',
            'image/svg+xml': 'svgz',
            'application/x-shockwave-flash': 'swf',
            'application/x-tar': 'tar',
            'application/x-tcl': 'tcl',
            'application/x-tex': 'tex',
            'application/x-texinfo': 'texinfo',
            'image/tiff': 'tiff',
            'text/tab-separated-values': 'tsv',
            'application/x-ustar': 'ustar',
            'application/x-cdlink': 'vcd',
            'model/vrml': 'wrl',
            'application/voicexml+xml': 'vxml',
            'audio/x-wav': 'wav',
            'image/vnd.wap.wbmp': 'wbmp',
            'application/vnd.wap.wbxml': 'wbxml',
            'text/vnd.wap.wml': 'wml',
            'application/vnd.wap.wmlc': 'wmlc',
            'text/vnd.wap.wmlscript': 'wmls',
            'application/vnd.wap.wmlscriptc': 'wmlsc',
            'image/x-xbitmap': 'xbm',
            'application/xhtml+xml': 'xhtml',
            'application/vnd.ms-excel': 'xls',
            'application/xml': 'xsl',
            'image/x-xpixmap': 'xpm',
            'application/xslt+xml': 'xslt',
            'application/vnd.mozilla.xul+xml': 'xul',
            'image/x-xwindowdump': 'xwd',
            'chemical/x-xyz': 'xyz',
            'application/zip': 'zip'
        };
        $scope.systemInstrumentCurrency = '';
        $scope.refreshValue = 0;
        $scope.tenantSetting = $tenantSettings;
        vm.tenantSetting = $tenantSettings;
        $scope.addedFields = new Object();
        $scope.formFields = new Object();
        $scope.formValues = new Object();

        //These constants are used for calculating Vessel - One Day Reserve. (sfocMe, sfocAe,  mcrPart, oneReeferConsumption)
        if (vm.app_id == 'masters' && vm.screen_id == 'vessel' && !$scope.isHideVesselBopsDetails) {
            $scope.formValues.sfocMe = 200.0; //200 g/KWH
            $scope.formValues.sfocAe = 235.0; //235 g/KWH
            $scope.formValues.pilotSpeed = 0;
            $scope.formValues.mcrPart = mcrPart;
            $scope.formValues.oneReeferConsumption = oneReeferConsumption;
        }

        $scope.locationReload = function() {
            if ($scope.copiedId > 0) {
                localStorage.setItem(`${vm.app_id + vm.screen_id }_copy`, $scope.copiedId);
                $state.reload();
            } else {
                $scope.formValues = {};
            }
        };
        $scope.getDefaultUom = function() {
            return $scope.tenantSetting.tenantFormats.uom;
        };
        vm.getTranslations = function() {
            Factory_Master.getTranslations((callback) => {
                if (callback) {
                    $scope.translations = callback;
                }
            });
        };

        ///min/max Validation
        ctrl.minQtyBlur = function(locationProducts) {
            if (locationProducts.maxSupplyQty < locationProducts.minSupplyQty || !locationProducts.maxSupplyQty) {
                locationProducts.maxSupplyQty = locationProducts.minSupplyQty;
            }
        };
        $scope.validateMinMaxQuantity = function(min, max) {
            if(typeof min == 'string') {
                min = parseFloat(min);
            }
            if(typeof max == 'string') {
                max = parseFloat(max);
            }
            var response = {
                minSupplyQty: min,
                maxSupplyQty: max
            };
            if (min && min > max) {
                response.maxSupplyQty = null;
            }
            if (max && min > max) {
                response.minSupplyQty = null;
            }
            if (min && max && min > max) {
                toastr.warning('Min Quantity can\'t be greater than Max Quantity');
            }
            return response;
        };
        // vm.get_master_structure = function(screenChild) {
        //     screenLoader.showLoader();
        //     $scope.getAdminConfiguration();
        //     if (window.location.href.indexOf('structure') != -1) {
        //         vm.get_master_elements(screenChild);
        //     }
        //     var generic_layout = false;

        //     //load default screen and app
        //     var app_id = vm.app_id;
        //     var screen_id = vm.screen_id;


        //     //you might not need to change app & screen, but load entity_documents
        //     if(screenChild == 'entity_documents'){
        //         // is generic layout (for now, documents only)
        //         generic_layout = {
        //             needed: true,
        //             layout: screenChild
        //         }

        //         // if app & screen needs to be changed for layout call, match in map (for documents page)
        //         var entity_documents_map = {
        //             "default.view-request-documents": {
        //                 app: "procurement",
        //                 screen: "request_entity_documents"
        //             },
        //             "default.view-group-of-requests-documents": {
        //                 app: "procurement",
        //                 screen: "group_of_requests_entity_documents"
        //             },
        //             "default.view-order-documents": {
        //                 app: "procurement",
        //                 screen: "order_entity_documents"
        //             },
        //             "delivery.documents": {
        //                 app: "delivery",
        //                 screen: "entity_documents"
        //             },
        //             "contracts.documents": {
        //                 app: "contracts",
        //                 screen: "entity_documents"
        //             },
        //             "labs.documents": {
        //                 app: "labs",
        //                 screen: "entity_documents"
        //             },
        //             "claims.documents": {
        //                 app: "claims",
        //                 screen: "entity_documents"
        //             },
        //             "invoices.documents": {
        //                 app: "invoices",
        //                 screen: "entity_documents"
        //             },
        //             "masters.documents": {
        //                 app: "masters",
        //                 screen: "entity_documents"
        //             }

        //         }
        //         if(entity_documents_map[$state.current.name]){
        //             app_id = entity_documents_map[$state.current.name].app;
        //             screen_id = entity_documents_map[$state.current.name].screen;
        //         }
        //     }

        //     Factory_Master.get_master_structure(app_id, screen_id, generic_layout, vm.isDev, function(callback) {
        //         if (callback) {
        //             screenLoader.hideLoader();
        //             $scope.screenId = callback.id;
        //             delete callback.id;
        //             //
        //             $scope.formFields = callback;
        //             // multiple layouts
        //             if (callback.children) {
        //                 if (screenChild) {
        //                     $scope.formFields = callback.children[screenChild];
        //                 } else {
        //                     $scope.formFields = callback.children["edit"];
        //                 }
        //                 $scope.updateScreenID = callback.children.id;
        //             }
        //             // {end} multiple layouts
        //             $scope.sortableGroups = [];
        //             if (vm.app_id == "invoices") {
        //                 if ($state.params.screen_id == "claims") {
        //                     delete $scope.formFields["CostDetails"];
        //                     delete $scope.formFields["ProductDetails"];
        //                     delete $scope.formFields["InvoiceSummary"];
        //                 }
        //                 if ($state.params.screen_id == "invoice") {
        //                     delete $scope.formFields["ClaimDetails"];
        //                 }
        //             }
        //             if ($scope.isCreate && vm.screen_id == "counterparty" && vm.app_id == "masters") {
        //                 $scope.formValues.status = { id: 1 };
        //             }
        //             $.each($scope.formFields, function(index, value) {
        //                 $scope.sortableGroups.push(value);
        //                 $.each(value.children, function(key, val) {
        //                     val.Active = false;
        //                     if ($scope.tenantSetting.companyDisplayName.name == "Pool") {
        //                         val.Label = val.Label.replace("COMPANY", "POOL");
        //                         val.Label = val.Label.replace("CARRIER", "POOL");
        //                         val.Label = val.Label.replace("CARRIERS", "POOLS");
        //                         val.Label = val.Label.replace("COMPANIES", "POOLS");
        //                     }
        //                     if ($scope.tenantSetting.serviceDisplayName.name == "Operator") {
        //                         val.Label = val.Label.replace("SERVICE", "OPERATOR");
        //                     }
        //                     // if (val.Label.indexOf(Compan) == "Label") {}
        //                 });
        //             });
        //             $rootScope.$broadcast("formFields", $scope.formFields);
        //             vm.checkLabelsHeight();
        //             if (vm.app_id == "contracts") {
        //                 $scope.initContractScreen();
        //             }
        //         } else {
        //             screenLoader.hideLoader();
        //         }
        //     });
        // };
        vm.formFieldSearch = function(formFields, Unique_ID) {
            for (let key in formFields) {
                if (typeof formFields[key] == 'string') {
                    if (key == 'Unique_ID' && formFields[key] == Unique_ID) {
                        return formFields;
                    }
                    continue;
                }
                let aux = vm.formFieldSearch(formFields[key], Unique_ID);
                if (aux) {
                    return aux;
                }
            }
            return false;
        };

        $scope.createCreditNote = function() {
	        let selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
	        if (selectedRowData) {
	            let claimSettlementType = selectedRowData.settlementType.name;
	            let actualSettlementAmount = selectedRowData.actualSettlementAmount;
	            let claimType = selectedRowData.claimType.name;
	            let claimId = selectedRowData.id;
	            if (selectedRowData.claimsPossibleActions.canCreateCreditNote) {
                    let data = {
                        ClaimId: claimId
                    };
                    localStorage.setItem('createCreditNoteFromInvoiceClaims', JSON.stringify(data));
                    //window.open(`/#/${ vm.app_id }/` + 'claims' + '/edit/', '_blank');
                    window.open(`/v2/${ vm.app_id }/` + 'edit/0', "_blank");

                    /*
	                Factory_Master.create_credit_note(data, function(response) {
	                    if (response) {
	                        if (response.status == true) {
	                            $scope.loaded = true;
	                            toastr.success(response.message);
	                            $rootScope.transportData = response.data;
	                            $location.path(vm.app_id + '/claims/edit/');
	                        } else {
	                            $scope.loaded = true;
	                            toastr.error(response.message);
	                        }
	                    }
	                })
                    */
	            } else {
	                toastr.error('You can\'t create credit note for this claim');
	            }
	            // $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData = null
	        } else {
	            toastr.error('Please select one claim');
	        }
	    };

        $scope.createDebunkerCreditNote = function() {
		    let selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
		    if (selectedRowData) {
		        let claimSettlementType = selectedRowData.settlementType.name;
		        let actualSettlementAmount = selectedRowData.actualSettlementAmount;
		        let claimType = selectedRowData.claimType.name;
		        let claimId = selectedRowData.id;
		        if (selectedRowData.claimsPossibleActions.canCreateDebunkerCreditNote) {
		            let data = {
		                ClaimId: claimId,
		                IsDebunker: 1
		            };
                    localStorage.setItem('createDebunkerCreditNoteFromInvoiceClaims', JSON.stringify(data));
                    // window.open(`/#/${ vm.app_id }/` + 'claims' + '/edit/', '_blank');
                    window.open(`/v2/${ vm.app_id }/` + 'edit/0', "_blank");

                    /*
		            Factory_Master.create_credit_note(data, function(response) {
		                if (response) {
		                    if (response.status == true) {
		                        $scope.loaded = true;
		                        toastr.success(response.message);
		                        $rootScope.transportData = response.data;
		                        $location.path(vm.app_id + '/claims/edit/');
		                    } else {
		                        $scope.loaded = true;
		                        toastr.error(response.message);
		                    }
		                }
		            })
                    */
		        } else {
		            toastr.error('You can\'t create debunker credit note for this claim');
		        }
		    } else {
		        toastr.error('Please select one claim');
		    }
        };
        $scope.createResaleCreditNote = function() {
            let selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
            if (selectedRowData) {
                let claimSettlementType = selectedRowData.settlementType.name;
                let actualSettlementAmount = selectedRowData.actualSettlementAmount;
                let resaleAmount = selectedRowData.resaleAmount;
                let claimType = selectedRowData.claimType.name;
                let claimId = selectedRowData.id;
                if (selectedRowData.claimsPossibleActions.canCreateResaleCreditNote) {
                    let data = {
                        ClaimId: claimId,
                        IsResale: 1
                    };
                    localStorage.setItem('createResaleCreditNoteFromInvoiceClaims', JSON.stringify(data));
                    //window.open(`/#/${ vm.app_id }/` + 'claims' + '/edit/', '_blank');
                    window.open(`/v2/${ vm.app_id }/` + 'edit/0', "_blank");

                    /*
                    Factory_Master.create_credit_note(data, function(response) {
                        if (response) {
                            if (response.status == true) {
                                $scope.loaded = true;
                                toastr.success(response.message);
                                $rootScope.transportData = response.data;
                                $location.path(vm.app_id + '/claims/edit/');
                            } else {
                                $scope.loaded = true;
                                toastr.error(response.message);
                            }
                        }
                    })
                    */
                } else {
                    toastr.error('You can\'t create resale credit note for this claim');
                }
            } else {
                toastr.error('Please select one claim');
            }
        };
        $scope.createPreclaimCreditNote = function() {
            let selectedRowData = $('#invoices_app_deliveries_list').jqGrid.Ascensys.selectedRowData;
            if (selectedRowData) {
                let claimId = selectedRowData.id;
                let data = {
                    ClaimId: claimId,
                    IsPreclaimCN: 1
                };
                localStorage.setItem('createPreclaimCreditNoteFromInvoiceClaims', JSON.stringify(data));
                //window.open(`/#/${ vm.app_id }/` + 'claims' + '/edit/', '_blank');
                window.open(`/v2/${ vm.app_id }/` + 'edit/0', "_blank");
            } else {
                toastr.error('Please select one claim');
            }
        };

        $scope.createInvoiceFromDelivery = function() {
	        let productIds = $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.selectedProductIds;
	        let orderAdditionalCostId = $('#flat_invoices_app_deliveries_list').jqGrid.Ascensys.selectedOrderAdditionalCostId;
	        let invoiceType = $('#newInvoiceType').val();
	        if (!invoiceType) {
	            toastr.error('Please select invoice type');
	            return;
	        }
	        if (!orderAdditionalCostId) {
	            toastr.error('Please select at least one row');
	            return;
	        }
	        if (productIds.length == 0 && orderAdditionalCostId.length == 0) {
	            toastr.error('Please select at least one row');
	            return;
	        }
	        let data = {
	            DeliveryProductIds: productIds,
	            OrderAdditionalCostIds: orderAdditionalCostId,
	            InvoiceTypeName: invoiceType,
	        };
            localStorage.setItem('invoiceFromDelivery', angular.toJson(data));
            // window.open(`/#/${ vm.app_id }/` + 'invoice' + '/edit/', '_blank');
            window.open(`/v2/${vm.app_id}/` + 'edit/0', "_blank");
	    };

        vm.checkLabelsHeight = function() {
            setTimeout(() => {
                $.each($('.form-group label:not(.mt-checkbox)'), function(key, val) {
                    if (this.offsetHeight > 26) {
                        $(this)
                            .css('height', 30)
                            .css('padding-top', 0);
                    }
                });
            }, 1);
        };
        vm.get_master_elements = function(screenChild) {
            Factory_Master.get_master_elements(vm.app_id, vm.screen_id, vm.isDev, (callback) => {
                if (callback) {
                    $scope.dragElements = callback;
                }
            });
        };
        $scope.save_master_structure = function() {

            vm.structure = angular.toJson($scope.formFields);
            Factory_Master.save_master_structure(vm.app_id, vm.screen_id, $scope.formFields, (callback, response) => {
                if (response != false) {
                    toastr.success(callback);
                    $scope.loaded = true;
                } else {
                    toastr.error('Error occured');
                }
            });
        };
        $scope.reset_form = function(ev) {
            if ($scope.copiedId > 0) {
                localStorage.setItem(`${vm.app_id + vm.screen_id }_copy`, $scope.copiedId);
                $state.reload();
            } else {
                $state.reload();
            }
        };
        $scope.undirtyForm = function() {
            if (vm.editInstance) {
                vm.editInstance.$pristine = true;
                vm.editInstance.$dirty = false;
                angular.forEach(vm.editInstance, (input, key) => {
                    if (typeof input == 'object' && input.$name) {
                        if (input.$pristine) {
                            input.$pristine = true;
                        }
                        if (input.$dirty) {
                            input.$dirty = false;
                        }
                    }
                });
            }
        };
        $scope.save_modal_entity = function(app, screen) {
            if (app == 'alerts' && screen == 'alerts') {
                if ($rootScope.formValues.isRecurrent && (typeof $rootScope.formValues.statusId == 'undefined' || $rootScope.formValues.statusId == null)) {
                    toastr.error('Until status cannot be null if Remind Every is checked');
                    return;
                }
                if ($rootScope.formValues.temp.dummyActivateOn && !$rootScope.formValues.activateOn) {
                    toastr.error('Please select a date for activate on');
                    return;
                }
                if ($rootScope.formValues.temp.dummyDeactivateOn && !$rootScope.formValues.deactivateOn) {
                    toastr.error('Please select a date for deactivate on');
                    return;
                }
            }
            vm.invalid_form = false;
            $rootScope.filterFromData = {};
            $.each($rootScope.formValues, (key, val) => {
                if (!angular.equals(val, [ {} ])) {
                    $rootScope.filterFromData[key] = val;
                }
            });

            vm.fields = angular.toJson($rootScope.filterFromData);
            if ($rootScope.filterFromData.id > 0) {
                Factory_Master.save_master_changes(app, screen, vm.fields, (callback) => {
                    if (callback.status == true) {
                        toastr.success(callback.message);
                        $('table.ui-jqgrid-btable').trigger('reloadGrid');
                        $scope.prettyCloseModal();
                        // $scope.modalInstance.close();
                    } else if (callback.message) {
                        toastr.error(callback.message);
                    } else {
                        toastr.error('An error has occured, please check the fields');
                    }
                });
            } else {
                Factory_Master.create_master_entity(app, screen, vm.fields, (callback) => {
                    if (callback.status == true) {
                        toastr.success(callback.message);
                        $('table.ui-jqgrid-btable').trigger('reloadGrid');
                        $scope.prettyCloseModal();
                    } else if (callback.message) {
                        toastr.error(callback.message);
                    } else {
                        toastr.error('An error has occured, please check the fields');
                    }
                });
            }
        };

        function setAllChild(object, type) {
            if (object.isSelected) {
                $scope.formValues[type].push({id: object.id, name: object.name});
            }
            if (object.children && object.children.length) {
                for (var i = 0; i < object.children.length; i++) {
                    setAllChild(object.children[i], type);
                }
            }
        }

        $scope.verifyAllLocation = function(category) {
            if (category.name != null && category.name != "") {
                return true;
            }
            if (category.details) {
                for (let i = 0; i < category.details.length; i++) {
                    if ((category.details[i].name  != null   && category.details[i].name != "") ||  category.details[i].weight) {
                        return true;
                    }
                }
            }
            return false;
        }


        // Deprecate function on 06.07.2021
        $scope.counterPartyListisValid = () => {
            // Return boolean
            // True allow saving;
            // False don't allow saving;
            if(vm.app_id == 'masters' && vm.screen_id == 'counterparty'){

                let counterPartyWithoutAccess = '';

                // Checked list
                $scope.formValues.counterpartyTypes.some(e => {

                    if(!$scope.filteredCounterpartyTypeList.find(j => e.id === j.id)){
                        // Checked and enabled
                        counterPartyWithoutAccess += `${e.name} `
                    }
                });

                if(counterPartyWithoutAccess){
                    toastr.info(`You dont have permission to add ${counterPartyWithoutAccess} ${counterPartyWithoutAccess.split(" ").length > 2 ? "types" : "type"} of Counterparty`)
                    return false;
                }
            }

            return true;
        }
        $scope.save_master_changes = function(ev, sendEmails, noReload, completeCallback) {
            screenLoader.showLoader();
            $('form').addClass('submitted');
            vm.invalid_form = false;


            // verify deprecate 06.07.2021
            // if(!$scope.counterPartyListisValid()){
            //     return;
            // }

            if(vm.app_id == 'masters' && vm.screen_id == 'strategy') {
                if ($scope.formValues.mtmType.id != 1) {
                    $scope.formValues.mtmFormulaProducts = _.filter($scope.formValues.mtmFormulaProducts, function(object) {
                        return object.product && object.formula;
                    });
                }
            }
            if (vm.app_id == 'admin' &&  vm.screen_id == 'sellerrating') {
                let hasTotalWeightDifferentBy100 = false;
                for (let i = 0 ; i < $scope.formValues.applications.length; i++) {
                    if ($scope.formValues.applications[i].specificLocations && !$scope.formValues.applications[i].isDeleted) {
                        for (let j = 0; j < $scope.formValues.applications[i].specificLocations.length; j++) {
                            if (!$scope.formValues.applications[i].specificLocations[j].isDeleted) {
                                let ratingRequired = false;
                                for (let k = 0; k < $scope.formValues.applications[i].specificLocations[j].categories.length; k++) {
                                    if (!$scope.formValues.applications[i].specificLocations[j].categories[k].isDeleted) {
                                        let findIndex = _.findIndex($scope.formValues.applications[i].specificLocations[j].categories[k].details, function(object) {
                                            return object.ratingRequired && !object.isDeleted;
                                        });
                                        if (findIndex != -1) {
                                            ratingRequired = true;
                                        }
                                    }
                                }
                                if (ratingRequired && $scope.formValues.applications[i].specificLocations[j].totalWeightage != 100) {
                                   hasTotalWeightDifferentBy100 = true;
                                }
                            }
                        }
                    }
                    if ($scope.formValues.applications[i].allLocations && $scope.formValues.applications[i].allLocations.categories) {
                        for (let p = 0; p < $scope.formValues.applications[i].allLocations.categories.length; p++) {
                            if (!$scope.verifyAllLocation($scope.formValues.applications[i].allLocations.categories[p]) && !$scope.formValues.applications[i].allLocations.categories[p].id) {
                                $scope.formValues.applications[i].allLocations.categories.splice(p, 1);
                                p--;
                            }
                        }
                        if (!$scope.formValues.applications[i].allLocations.categories.length) {
                            $scope.formValues.applications[i].allLocations = null;
                        }

                    }
                    if ($scope.formValues.applications[i].allLocations && !$scope.formValues.applications[i].isDeleted) {
                        if (!$scope.formValues.applications[i].allLocations.categories.isDeleted) {
                            let ratingRequired = false;
                            for (let l = 0 ; l < $scope.formValues.applications[i].allLocations.categories.length; l++) {
                                if (!$scope.formValues.applications[i].allLocations.categories[l].isDeleted) {
                                    let findIndex = _.findIndex($scope.formValues.applications[i].allLocations.categories[l].details, function(object) {
                                        return object.ratingRequired && !object.isDeleted;
                                    });
                                    if (findIndex != -1) {
                                        ratingRequired = true;
                                    }
                                }
                        }
                        if (ratingRequired && $scope.formValues.applications[i].allLocations.totalWeightage != 100) {
                            hasTotalWeightDifferentBy100 = true;
                        }
                        }

                    }

                }
                if (hasTotalWeightDifferentBy100) {
                    toastr.error('Please adjust the weight of the questions so total weight is 100!');
                    vm.editInstance.$valid = false;
                }

            }

            if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
                if ($scope.formValues.claimDetails.claimQuantity) {
                    if ($scope.formValues.claimDetails.claimQuantity < 0) {
                        toastr.error('Please enter a value greater than zero for claim quantity!');
                        vm.editInstance.$valid = false;
                        return;
                    }
                }

                if ($scope.formValues != undefined && $scope.formValues.orderDetails != undefined && $scope.formValues.orderDetails.orderStatusName != undefined && $scope.formValues.orderDetails.orderStatusName != 'Cancelled') {
                    if ($scope.formValues.claimType != undefined && $scope.formValues.claimType.claimType != undefined && $scope.formValues.claimType.claimType.name != undefined && $scope.formValues.claimType.claimType.name != '') {
                       if($scope.formValues.claimType.claimType.name == 'Cancellation') {
                           toastr.warning("Kindly change the Claim Type");
                           return
                       }
                    }
                }
            }

            if (vm.app_id == 'admin' && vm.screen_id == 'users') {
                var dataSrcs = {
                    vessel_access: 'accessVessels',
                    buyer_access: 'accessBuyers',
                    company_access: 'accessCompanies'
                };
                var types = ['vessel_access', 'buyer_access', 'company_access'];
                if ($scope.formValues.company) {
                    let newCompany = {
                        id: $scope.formValues.company.id,
                        name: $scope.formValues.company.name
                    }
                    $scope.formValues.company = newCompany;
                }
                console.log($scope.formValues);
                console.log($rootScope.tabData);
                console.log($rootScope.listOfVesselTypes);
                _.forEach(types, function(type) {
                    $scope.formValues[dataSrcs[type]] = [];
                    for (let i = 0; i < $rootScope.tabData[type].length; i++) {
                        console.log($rootScope.tabData[type][i]);
                        setAllChild($rootScope.tabData[type][i], dataSrcs[type]);
                    }
                });
                if ($scope.formValues.accessVessels && $rootScope.listOfVesselTypes) {
                    for (let i = 0; i < $rootScope.listOfVesselTypes.length; i++) {
                        let vesselType = $rootScope.listOfVesselTypes[i];
                        let checkIfIsVesselType = _.filter($scope.formValues.accessVessels, function(object) {
                            return object.name == vesselType.name && object.id == vesselType.id;
                        });
                        if (checkIfIsVesselType.length) {
                            let result = [];
                            result = _.filter($scope.formValues.accessVessels, function (object) {
                                return object.name != vesselType.name;
                            });
                            $scope.formValues.accessVessels = result;
                            console.log($scope.formValues);
                        }
                    }

                }

            }

            if(vm.app_id == 'masters' && vm.screen_id == 'systeminstrument') {
                let periods = [];
                if($scope.formValues && $scope.formValues.periods) {
                    for (var i = 0; i < $scope.formValues.periods.length; i++) {
                        if ($scope.formValues.periods[i].period && $scope.formValues.periods[i].validFrom && $scope.formValues.periods[i].validTo) {
                            periods.push($scope.formValues.periods[i]);
                        }
                    }
                }
                $scope.formValues.periods = periods;
                if ($scope.formValues && $scope.formValues.productsLocations) {
                    let errors = '';
                    let products = [];
                    let locations = [];
                    let systemInstrument = {
                        'name': $scope.formValues.name,
                        'id': $scope.formValues.id
                    }
                    for (let i = 0; i < $scope.formValues.productsLocations.length; i++) {
                        $scope.formValues.productsLocations[i].systemInstrument = systemInstrument;
                        if ($scope.formValues.productsLocations[i].isBunkerwireDefault && !$scope.formValues.productsLocations[i].isDeleted) {
                            let element = $scope.formValues.productsLocations[i];
                            var findCombinationProductAndLocationBunkerwireDefault = _.filter($scope.formValues.productsLocations, function(object) {
                                if (object.location && object.product && element.location && element.product) {
                                    return !object.isDeleted && object.location.name == element.location.name && object.product.name == element.product.name && object.isBunkerwireDefault;
                                }
                            });
                            if (findCombinationProductAndLocationBunkerwireDefault.length > 1) {
                                products.push(element.product.name);
                                locations.push(element.location.name);
                            }
                        } else if ($scope.formValues.productsLocations[i].isCargoDefault && !$scope.formValues.productsLocations[i].isDeleted) {
                            let element = $scope.formValues.productsLocations[i];
                            var findCombinationProductAndLocationCargoDefault = _.filter($scope.formValues.productsLocations, function(object) {
                                if (object.location && object.product && element.location && element.product) {
                                    return  !object.isDeleted && object.location.name == element.location.name && object.product.name == element.product.name && object.isCargoDefault;
                                }
                            });
                            if (findCombinationProductAndLocationCargoDefault.length > 1 ) {
                                products.push(element.product.name);
                                locations.push(element.location.name);
                            }
                        }
                    }
                    products = _.uniq(products);
                    locations = _.uniq(locations);
                    let productsString = '';
                    let locationsString = '';
                    for (let i = 0; i < products.length; i++) {
                        productsString += products[i] + ',';
                    }
                    for (let i = 0; i < locations.length; i++) {
                        locationsString += locations[i] + ',';
                    }
                    if (productsString[productsString.length - 1] == ',') {
                        productsString =  productsString.substring(0,  productsString.length - 1);
                    }
                    if (locationsString[locationsString.length - 1] == ',') {
                        locationsString =  locationsString.substring(0,  locationsString.length - 1);
                    }
                    if (productsString != '' && locationsString != '' && products.length > 1) {
                        toastr.warning('Default bunkerwire quote is already available for the products ' + productsString + ' and locations ' + locationsString + '. Please check and update');
                        return;
                    }
                    if (productsString != '' && locationsString != '' && products.length == 1) {
                        toastr.warning('Default bunkerwire quote is already available for the product ' + productsString + ' and location ' + locationsString + '. Please check and update');
                        return;
                    }
                }
            }

            if(vm.app_id == 'masters' && vm.screen_id == 'location') {
                 var SaveAdditionalCostDetValidation = $scope.SaveAdditionalCostDetValidation();
                 console.log("SaveAdditionalCostDetValidation")
                 if(!SaveAdditionalCostDetValidation){
                 	return
                 }
                 // var SaveLocationProductsValidation = $scope.SaveLocationProductsValidation();
                 // console.log("SaveLocationProductsValidation")
                 // if(!SaveLocationProductsValidation){
                 // 	return
                 // }

                 if ($scope.formValues) {
                    if($scope.formValues.productsSystemInstruments){
                        let errors = '';
                        let products = [];
                        let systemInstruments = [];
                        let location = {
                            'name': $scope.formValues.name,
                            'id': $scope.formValues.id
                        }
                        for (let i = 0; i < $scope.formValues.productsSystemInstruments.length; i++) {
                            $scope.formValues.productsSystemInstruments[i].location = location;
                            if ($scope.formValues.productsSystemInstruments[i].isBunkerwireDefault && !$scope.formValues.productsSystemInstruments[i].isDeleted) {
                                let element = $scope.formValues.productsSystemInstruments[i];
                                var findCombinationProductAndSystemInstrumentBunkerwireDefault = _.filter($scope.formValues.productsSystemInstruments, function(object) {
                                    if (object.systemInstrument && object.product && element.systemInstrument && element.product) {
                                        return !object.isDeleted && object.systemInstrument.name == element.systemInstrument.name && object.product.name == element.product.name && object.isBunkerwireDefault;
                                    }
                                });
                                if (findCombinationProductAndSystemInstrumentBunkerwireDefault.length > 1) {
                                    products.push(element.product.name);
                                    systemInstruments.push(element.systemInstrument.name);
                                }
                            } else if ($scope.formValues.productsSystemInstruments[i].isCargoDefault && !$scope.formValues.productsSystemInstruments[i].isDeleted) {
                                let element = $scope.formValues.productsSystemInstruments[i];
                                var findCombinationProductAndSystemInstrumentCargoDefault = _.filter($scope.formValues.productsSystemInstruments, function(object) {
                                    if (object.systemInstrument && object.product && element.systemInstrument && element.product) {
                                        return  !object.isDeleted && object.systemInstrument.name == element.systemInstrument.name && object.product.name == element.product.name && object.isCargoDefault;
                                    }
                                });
                                if (findCombinationProductAndSystemInstrumentCargoDefault.length > 1 ) {
                                    products.push(element.product.name);
                                    systemInstruments.push(element.systemInstrument.name);
                                }
                            }
                        }
                        products = _.uniq(products);
                        systemInstruments = _.uniq(systemInstruments);
                        let productsString = '';
                        let systemInstrumentsString = '';
                        for (let i = 0; i < products.length; i++) {
                            productsString += products[i] + ',';
                        }
                        for (let i = 0; i < systemInstruments.length; i++) {
                            systemInstrumentsString += systemInstruments[i] + ',';
                        }
                        if (productsString[productsString.length - 1] == ',') {
                            productsString =  productsString.substring(0,  productsString.length - 1);
                        }
                        if (systemInstrumentsString[systemInstrumentsString.length - 1] == ',') {
                            systemInstrumentsString =  systemInstrumentsString.substring(0,  systemInstrumentsString.length - 1);
                        }
                        if (productsString != '' && systemInstrumentsString != '' && products.length > 1) {
                            toastr.warning('Default bunkerwire quote is already available for the products ' + productsString + ' and system instruments' + systemInstrumentsString + '. Please check and update');
                            return;
                        }
                        if (productsString != '' && systemInstrumentsString != '' && products.length == 1) {
                            toastr.warning('Default bunkerwire quote is already available for the product ' + productsString + ' and system instrument ' + systemInstrumentsString + '. Please check and update');
                            return;
                        }
                    }

                    if($scope.formValues.sellers){
                        angular.forEach($scope.formValues.sellers, (sellerContact) => {
                            let savedContacts = $filter('filter')(sellerContact.sellerContacts, function(value){ return (value.id > 0);},true );
                            if(savedContacts && savedContacts.length > 0){
                                angular.forEach(savedContacts, (contact) => {
                                    let isDeleted = $filter('filter')(sellerContact.locationContacts, { id: contact.id}).length == 0;
                                    if(isDeleted){
                                        contact.isDeleted = true;
                                        sellerContact.locationContacts.push(contact);
                                    }
                                });
                            }
                        });
                    }
                }
            }


            if(vm.app_id == 'masters' && vm.screen_id == 'counterparty') {
                if($scope.formValues) {
                    if($scope.formValues.counterpartyTypes){
                        let validCounterpartyTypes = [];
                        $.each($scope.formValues.counterpartyTypes, (k, v) => {
                            if(v.id != 0) {
                                validCounterpartyTypes.push(v);
                            }
                        });
                        $scope.formValues.counterpartyTypes = validCounterpartyTypes;
                    }
                    if($scope.formValues.counterpartyLocations){
                        angular.forEach($scope.formValues.counterpartyLocations, (counterpartyLocation, locIndex) => {
                            let savedContacts = $filter('filter')($scope.preferredContacts[locIndex], { isNewContact : false} )
                            if(savedContacts  && savedContacts.length > 0){
                                angular.forEach(savedContacts, (contact) => {
                                    let isDeleted = $filter('filter')(counterpartyLocation.locationContacts, { id: contact.id}).length == 0;
                                    if(isDeleted){
                                        contact.isDeleted = true;
                                        counterpartyLocation.locationContacts.push(contact);
                                    }
                                });
                            }
                        });
                    }

                    if($rootScope.TempcounterpartyBankAccounts != undefined && $rootScope.TempcounterpartyBankAccounts.length !=0){
                        $scope.formValues.counterpartyBankAccounts = angular.merge($scope.formValues.counterpartyBankAccounts, $rootScope.TempcounterpartyBankAccounts);
                    }
                }
                if ($scope.isCustomerCounterparty()) {
                	$scope.formValues.counterpartyCustomerConfiguration.isDeleted = false;
                } else {
                	if ($scope.formValues.counterpartyCustomerConfiguration) {
                		$scope.formValues.counterpartyCustomerConfiguration.isDeleted = true;
                	} else {
	                    $scope.formValues.counterpartyCustomerConfiguration = null;
                	}
                }


            }


            if(vm.app_id === 'masters' && vm.screen_id === 'buyer') {
            	// if(!$scope.formValues.code) {
	            	if(!$scope.formValues.code) {
	            		$scope.formValues.code = null;
	            	}
            		if ($scope.formValues.hasNoMoreChildren) {
                    if($scope.formValues.user) {
                        $scope.formValues.name = $scope.formValues.user.displayName;
                    }
            		} else {
            			// $scope.formValues.name = $scope.formValues.tempName;
            		}
            	// } else {
        			// $scope.formValues.name = $scope.formValues.code;
            	// }
            }
            if (vm.app_id == 'masters' && vm.screen_id == 'vessel') {
            	if ($scope.formValues.earliestRedelivery == '0000-00-00T00:00+00:00') {
                    $scope.formValues.earliestRedelivery = null;
                };
            	if ($scope.formValues.latestRedelivery == '0000-00-00T00:00+00:00') {
                    $scope.formValues.latestRedelivery = null;
                };
                if ($scope.formValues.earliestRedelivery >= $scope.formValues.latestRedelivery && $scope.formValues.earliestRedelivery != null && $scope.formValues.latestRedelivery != null) {
                    toastr.error('Latest Redelivery Date can\'t be lower than Earliest redelivery date');
                    setTimeout(() => {
                        $scope.submitedAction = false;
                    }, 100);
                    return;
                    vm.editInstance.$valid = false;
                }

                // disabled on 03.01.2019 - de la Teo
                // tankErrors = false;
                // $.each($scope.formValues.tanks, function(k, v) {
                //     if (!v.name) {
                //         if (!v.isDeleted) {
                //             tankErrors = true;
                //         }
                //     }
                // });
                // if (tankErrors) {
                //     toastr.error("Please check the vessel tank details for errors");
                //     setTimeout(function() {
                //         $scope.submitedAction = false;
                //     }, 100);
                //     vm.editInstance.$valid = false;
                // }

                var minMaxError = false;
                $.each($scope.formValues.robs, (k, v) => {
                	if (v.minQty > v.maxQty) {
		                minMaxError = true;
                	}
                });
                if (minMaxError) {
                    toastr.error('Please check min max values for errors');
                    setTimeout(() => {
                        $scope.submitedAction = false;
                    }, 100);
                    vm.editInstance.$valid = false;
                    return false;
                }
                $.each($scope.formValues.voyages, (k, v) => {
                	if (v.voyageUpdated == '0000-00-00T00:00+00:00') {
                		v.voyageUpdated = null;
                	}
                	if (v.voyageUpdated == null) {
                        delete v.voyageUpdated;
                	}
                });
                if (!$scope.isHideVesselBopsDetails && ($scope.formValues.departments == undefined || $scope.formValues.departments.length < 1)) {
                    setTimeout(() => {
                        $scope.submitedAction = false;
                    }, 100);
                    vm.editInstance.$valid = false;
                    if(vm.editInstance) {
                        if(!vm.editInstance.$error) {
                            vm.editInstance.$error = {};
                        }
                        if(!vm.editInstance.$error.required) {
                            vm.editInstance.$error.required = [];
                        }
                        $('#departments').addClass('invalid');
                        vm.editInstance.$error.required.push(vm.editInstance['OperationalDepartment']);
                    }
                }
            }
            if (vm.app_id == 'masters' && vm.screen_id == 'vesseltype') {
                var minMaxError = false;
                $.each($scope.formValues.robs, (k, v) => {
                	if (v.minQty > v.maxQty) {
		                minMaxError = true;
                	}
                });
                if (minMaxError) {
                    toastr.error('Please check min max values for errors');
                    setTimeout(() => {
                        $scope.submitedAction = false;
                    }, 100);
                    vm.editInstance.$valid = false;
                    return false;
                }
                if (!vm.entity_id || vm.entity_id == '') {
                	$scope.formValues.internalName = angular.copy($scope.formValues.name);
                }
            }

            /* Contract Validations*/
            if (typeof $scope.save_master_changes_controllerSpecific === 'function') {
                if (!$scope.save_master_changes_controllerSpecific(ev, vm.editInstance)) {
                    return;
                }
            }
            if (vm.app_id == 'masters' && vm.screen_id == 'specgroup') {
                var hasError = false;
                $.each($scope.formValues.specGroupParameters, (k, v) => {
                    if (!v.min && !v.max) {
                        // vm.editInstance.$valid = false
                    } else if (v.min != null && v.max != null) {
                        if (Number(v.min) > Number(v.max)) {
                            hasError = true;
                        }
                    }
                });
                if (hasError) {
                    toastr.error('Min value can\'t be greater than Max value');
                    setTimeout(() => {
                        $scope.submitedAction = false;
                    }, 100);
                    return;
                }
            }
            if (vm.app_id == 'masters' && vm.screen_id == 'product') {
                if (!$scope.formValues.defaultSpecGroup) {
                    toastr.warning('Please create a Spec Group for the product in the Spec Group master and then select a default Spec Group');
                }
                let newEnergyFormulaProducts = [];
                if ($scope.formValues.isEnergyCalculationRequired) {
                    if (_.get($scope, 'formValues.energyFormulaSpecific.id')) {
                        let energyFormulaSpecific = {
                            product: {
                                id: Number(vm.entity_id),
                            },
                            energyFormula: {
                                id: _.get($scope, 'formValues.energyFormulaSpecific.id')
                            },
                            energyFormulaTypeName: 'SpecificEnergyCalculation'
                        };

                        let energyFormulaSpecificId = 0;

                        _.each($scope.formValues.energyFormulaProducts, (value, key) => {
                            if (value.energyFormulaTypeName === 'SpecificEnergyCalculation') {
                                energyFormulaSpecificId = value.id;
                            }
                        });

                        energyFormulaSpecific.id = energyFormulaSpecificId;
                        newEnergyFormulaProducts.push(energyFormulaSpecific);
                    } else {
                        toastr.error('Please select the Specific Energy Calculation Formula');
                        return;
                    }

                    if (_.get($scope, 'formValues.energyFormulaCCAI.id')) {
                        let energyFormulaCCAI = {
                            product: {
                                id: Number(vm.entity_id),
                            },
                            energyFormula: {
                                id: _.get($scope, 'formValues.energyFormulaCCAI.id')
                            },
                            energyFormulaTypeName: 'CCAI'
                        };

                        let energyFormulaCCAIId = 0;

                        _.each($scope.formValues.energyFormulaProducts, (value, key) => {
                            if (value.energyFormulaTypeName === 'CCAI') {
                                energyFormulaCCAIId = value.id;
                            }
                        });

                        energyFormulaCCAI.id = energyFormulaCCAIId;
                        newEnergyFormulaProducts.push(energyFormulaCCAI);
                    }
                }

                $scope.formValues.energyFormulaProducts = newEnergyFormulaProducts;
            }
            if (vm.app_id == 'contracts' && vm.screen_id == 'contract') {
                // chech for product location to be obj
                var ret = false;
                $.each($scope.formValues.products, (key, val) => {
                    if (typeof val.location != 'object') {
                        // toastr error is shown from app-contract controller - save_master_changes_controllerSpecific
                        ret = true;
                    }
                });
                if (ret) {
                    vm.editInstance.$valid = false;
                    setTimeout(() => {
                        $scope.submitedAction = false;
                    }, 100);
                    return;
                }
            }
            if (vm.app_id == 'admin' && vm.screen_id == 'users') {
                if ($scope.formValues.contactInformation.email) {
                	if (!$scope.validateEmailPattern($scope.formValues.contactInformation.email)) {
	                    toastr.error('Invalid email address');
	                    return;
                	}
                }
            }

            if (vm.app_id == 'admin' && vm.screen_id == 'users') {
                if ($scope.formValues.contactInformation.email) {
                	if (!$scope.validateEmailPattern($scope.formValues.contactInformation.email)) {
	                    toastr.error('Invalid email address');
	                    return;
                	}
                }
            }

            if (vm.app_id == 'admin' && vm.screen_id == 'configuration') {
                // chech for product location to be obj
                $.each($scope.formValues.email, (key, val) => {
                	if (typeof val.toEmailsConfiguration == 'string') {
                		val.toEmailsConfiguration = val.toEmailsConfiguration.split(',');
                	}
                    if (typeof val.ccEmailsConfiguration == 'string') {
                        val.ccEmailsConfiguration = val.ccEmailsConfiguration.split(',');
                    }
                    if (typeof val.attachmentDocumentTypes == 'string') {
                        val.attachmentDocumentTypes = val.attachmentDocumentTypes.split(',');
                    }

	                var toEmailsConfigurationSimplified = [];
	                var ccEmailsConfigurationSimplified = [];
	                var attachmentDocumentTypesSimplified = [];
                	if (val.toEmailsConfiguration) {
	                	if (val.toEmailsConfiguration.length > 0) {
	                		$.each(val.toEmailsConfiguration, (tok, tov) => {
				                toEmailsConfigurationSimplified.push(tov.id);
	                		});
	                	}
                	}
                	if (val.ccEmailsConfiguration) {
	                	if (val.ccEmailsConfiguration.length > 0) {
	                		$.each(val.ccEmailsConfiguration, (cck, ccv) => {
				                ccEmailsConfigurationSimplified.push(ccv.id);
	                		});
	                	}
                	}

                  	if (val.attachmentDocumentTypes) {
	                	if (val.attachmentDocumentTypes.length > 0) {
	                		$.each(val.attachmentDocumentTypes, (cck, ccv) => {
				                attachmentDocumentTypesSimplified.push(ccv.id);
	                		});
	                	}
                	}
                	val.toEmailsConfiguration = toEmailsConfigurationSimplified.length > 0 ? toEmailsConfigurationSimplified.join(',') : null;
                	val.ccEmailsConfiguration = ccEmailsConfigurationSimplified.length > 0 ? ccEmailsConfigurationSimplified.join(',') : null;
                	val.attachmentDocumentTypes = attachmentDocumentTypesSimplified.length > 0 ? attachmentDocumentTypesSimplified.join(',') : null;
                });
            }

            if (vm.app_id == 'contracts' && vm.screen_id == 'contract') {
                let additionalCost = [];
                for (let i = 0; i < $scope.formValues.products.length; i++) {
                    for (let j = 0; j < $scope.formValues.products[i].additionalCosts.length; j++) {
                        if (!$scope.formValues.products[i].additionalCosts[j].isDeleted) {
                            let amount = parseInt($scope.formValues.products[i].additionalCosts[j].amount);
                            if (amount < 0 && !$scope.formValues.products[i].additionalCosts[j].isAllowingNegativeAmmount) {
                                additionalCost.push($scope.formValues.products[i].additionalCosts[j].additionalCost.name);
                            }
                        }
                    }
                }
                additionalCost = _.uniq(additionalCost);
                let additionalCostString = '';
                for (let i = 0; i < additionalCost.length; i++) {
                    additionalCostString += additionalCost[i] + ',';
                }
                if (additionalCostString[additionalCostString.length - 1] == ',') {
                    additionalCostString =  additionalCostString.substring(0,  additionalCostString.length - 1);
                }
                if (additionalCostString != ''  && additionalCost.length > 1) {
                    toastr.warning('The additional costs ' + additionalCostString + ' does not allow negative amounts!');
                    return;
                }
                if (additionalCostString != '' && additionalCost.length == 1) {
                    toastr.warning('The additional cost ' + additionalCostString + ' does not allow negative amounts!');
                    return;
                }

            }

            if(vm.app_id == 'labs' && vm.screen_id == 'labresult') {
                var generalNotesScope = angular.element($('.grid_generalNotes')).scope();
                $scope.formValues.labNotes = generalNotesScope.formValues.notes;
            }

            /* END Contract Validations*/
            if (vm.editInstance.$valid) {
                if (vm.app_id == 'admin' &&  vm.screen_id == 'sellerrating') {
                    for (let i = 0 ; i < $scope.formValues.applications.length; i++) {
                        const model = {
                            'allLocations': null,
                            'id': null,
                            'isDeleted': null,
                            'module': null,
                            'specificLocations': null,

                        }
                        const value = _.pick($scope.formValues.applications[i], _.keys(model));
                        if (value.allLocations) {
                            if (!value.specificLocations) {
                                value.specificLocations = [];
                            }
                            value.specificLocations.push(value.allLocations);
                        }
                        $scope.formValues.applications[i] = {
                            'id': value.id,
                            'isDeleted': value.isDeleted,
                            'module': value.module,
                            'locations': value.specificLocations
                        }

                        console.log($scope.formValues.applications[i]);
                    }
                }
                $scope.filterFromData = {};
                $scope.submitedAction = true;
                $.each($scope.formValues, (key, val) => {
                    if (!angular.equals(val, [ {} ])) {
                        $scope.filterFromData[key] = angular.copy(val);
                    }
                    if (val && val.id && angular.equals(val.id, -1)) {
                        $scope.filterFromData[key] = null;
                    }
                    if (vm.screen_id == 'formula' || vm.screen_id == 'labresult') {
                        if (angular.equals(val, {})) {
                            $scope.filterFromData[key] = null;
                        }
                        if (key == 'pricingScheduleOptionSpecificDate') {
                            if (val && val.dates && angular.equals(val.dates, [ {} ])) {
                                $scope.filterFromData[key] = null;
                            }
                        }
                    }
                });

	            if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
	                let type = $scope.filterFromData.claimType.claimType.name;
	                if (type.toLowerCase() != 'debunker') {
	                	$scope.filterFromData.claimDebunkerDetails = null;
	                }
	            }
                if (vm.app_id == 'contracts' && vm.screen_id == 'contract') {
                    if ($scope.filterFromData.productQuantityRequired == false || typeof $scope.filterFromData.productQuantityRequired == 'undefined') {
                        $.each($scope.filterFromData.products, (key, val) => {
                            $scope.filterFromData.products[key].details = null;
                        });
                    }
                    if (typeof $scope.filterFromData != 'undefined') {
                        if (typeof $scope.filterFromData.products != 'undefined') {
                            $scope.filterFromData.products.forEach((product, index) => {
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
                if (vm.app_id == 'masters' && vm.screen_id == 'vessel') {
                    if ($scope.filterFromData.usingVesselTypeRob) {
                        $scope.filterFromData.robs = null;
                    }
                }
                if (vm.app_id == 'masters' && vm.screen_id == 'vessel') {
                    if (!$scope.filterFromData.tanks) {
                        $scope.filterFromData.tanks = [];
                    }
                    if ($scope.formValues.temp && $scope.formValues.temp.tanks) {
                        if ($scope.formValues.temp.tanks.availableCapacity && $scope.formValues.temp.tanks.usableCapacity && !$scope.formValues.temp.tanks.tankCategory && !$scope.formValues.temp.tanks.product && !$scope.formValues.temp.tanks.uom) {
                            $scope.formValues.temp.tanks = {};
                        }
                        if ($scope.formValues.temp.tanks && JSON.stringify($scope.formValues.temp.tanks) != JSON.stringify({})) {
                            $scope.filterFromData.tanks.push($scope.formValues.temp.tanks);
                        }
                    }
                }

                if (vm.app_id == 'admin' && vm.screen_id == 'users') {
                    if (!$('#Signature').val()) {
                        $scope.filterFromData.signature = null;
                    }
                }
                if (vm.app_id == 'masters' && vm.screen_id == 'price') {
                	var tempMarketPrices = [];
                    $.each($scope.filterFromData.marketPrices, (key, val) => {
                    	if (!(val.id == 0 && !val.quotePrice)) {
		                	tempMarketPrices.push(val);
                    	}
                    });
                    $scope.filterFromData.marketPrices = tempMarketPrices;
                }
                if (vm.app_id == 'masters' && vm.screen_id == 'formula' && (!vm.entity_id || vm.entity_id == '')) {
                    $.each($scope.filterFromData.complexFormulaQuoteLines, (key, val) => {
	                    $.each(val.systemInstruments, (key2, val2) => {
                            if (typeof val2.complexFormulaQuoteLine != 'undefined' &&
                                val2.complexFormulaQuoteLine !== null) {
                                val2.complexFormulaQuoteLine.id = 0;
                            }
	                    });
                    });
                }
                if (vm.app_id == 'admin' && vm.screen_id == 'role') {
                   // console.log($scope.formValues.deepmerge);
                    var roles = $scope.formValues.roles;

                    roles.accessCounterpartyTypes = $scope.formValues.roles.accessCounterpartyTypes;

                    $.each(roles.rights, (key, module) => {
                        $.each(module.moduleScreenConfigurations, (key2, screen) => {
                            // screen.id = null;
                            screen.actions = [];
                        });
                    });
                    $scope.formValues.roles.rights = [];
                    $.each($scope.formValues.deepmerge, (key, deepModule) => {
                        var obj = {};
                        obj.moduleScreenConfigurations = [];
                        $.each(deepModule, (key2, deepScreen) => {
                            var actions = [];
                            $.each(deepScreen, (key3, deepAction) => {
                                if (key3 != 'screen' && key3 != 'definedScreenTemplates' && key3 != 'selectedScreenTemplate') {
                                    if (deepAction.isSelected) {
                                        actions.push({
                                            id: key3,
                                            name: deepAction.name
                                        });
                                    }
                                }
                            });
                            if($scope.formValues.id != 0) {
                                obj.id = deepModule.module.idSrv;
                            }else{
                                obj.id = 0;
                            }
                            module = {
                                id: deepModule.module.id,
                                name: deepModule.module.name
                            };
                            screen = {};
                            if (typeof deepScreen.screen != 'undefined') {
                                screen = {
                                    id: deepScreen.screen.id,
                                    name: deepScreen.screen.name
                                };
                            }
                            var selectedScreenTemplate = {};
                            if (typeof deepScreen.selectedScreenTemplate != 'undefined') {
                                selectedScreenTemplate = deepScreen.selectedScreenTemplate;
                            }
                            obj.module = module;
                            if (screen.id && selectedScreenTemplate.id) {
                                obj.moduleScreenConfigurations.push({
                                    id: vm.entity_id == '' ? 0 : deepScreen.idSrv,
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
                if (vm.app_id == 'invoices' && vm.screen_id == 'invoice') {
                	// if ($scope.paymentDateWasManuallyChanged && !$scope.filterFromData.hasManualPaymentDate) {
	                // 	if ($scope.manualPaymentDateReference.split("T")[0] == $scope.filterFromData.paymentDate.split("T")[0]) {
		               //  	$scope.filterFromData.hasManualPaymentDate = true;
		               //  	$scope.filterFromData.hasManualPaymentDate = false;
	                // 	}
                	// }
                	var validCostDetails = [];
                    if ($scope.filterFromData.costDetails.length > 0) {
                        $.each($scope.filterFromData.costDetails, (k, v) => {
                            if (typeof v.product != 'undefined' && v.product != null) {
                                if (v.product.id == -1) {
                                    v.product = null;
                                    v.deliveryProductId = null;
                                } else {
                                	if (v.product.productId) {
	                                    v.product.id = v.product.productId;
                                	}
                                	if (v.product.deliveryProductId) {
                                		v.deliveryProductId = angular.copy(v.product.deliveryProductId);
                                	}
	                            	v.isAllProductsCost = false;
	                            }
                            }
	                        if (Boolean(v.id) && !(v.id == 0 && v.isDeleted) || !v.Id && !v.isDeleted) {
                                // v.isDeleted = false;
	                        	validCostDetails.push(v);
	                        }
                        });
                    }
                    $scope.filterFromData.costDetails = validCostDetails;
                    // return;
                    var costTypeError = false;
                    for (var i = $scope.filterFromData.costDetails.length - 1; i >= 0; i--) {
                    	if (!$scope.filterFromData.costDetails[i].costType) {
		                    costTypeError = true;
                    	}
                    }
                    if (costTypeError) {
                        toastr.error('Please select Cost type');
                        $scope.submitedAction = false;
                        return false;
                    }
                    if ($state.params.screen_id != 'claims') {
                        if ($filter('filter')($scope.filterFromData.productDetails, { isDeleted: false }).length == 0 && $filter('filter')($scope.filterFromData.costDetails, { isDeleted: false }).length == 0) {
                            toastr.error('Please add at least one product or one cost');
                            $scope.submitedAction = false;
                            return false;
                        }
                    }
                }
                if (vm.app_id == 'masters' && vm.screen_id == 'documenttype') {
                    if(typeof $scope.formValues.id == 'undefined' || $scope.formValues.id == 0) {
                        $scope.filterFromData.name = $scope.filterFromData.displayName;
                    }
                }

                if (vm.app_id == 'masters' && vm.screen_id == 'formula') {
                    if ($scope.filterFromData.pricingScheduleOptionSpecificDate) {
                        $scope.filterFromData.pricingScheduleOptionSpecificDate.dates = _.filter($scope.filterFromData.pricingScheduleOptionSpecificDate.dates, function(object) {
                            return (!object.id && !object.isDeleted) || object.id;
                        });
                    }
                }

                if (vm.app_id == 'delivery' && vm.screen_id == 'delivery') {
                    $.each($scope.filterFromData.deliveryProducts, (key, value) => {
                        if ($scope.filterFromData.deliveryProducts[key].agreedQuantityAmount == null || $scope.filterFromData.deliveryProducts[key].agreedQuantityAmount == '') {
                            $scope.filterFromData.deliveryProducts[key].agreedQuantityUom = null;
                        }
                        if ($scope.filterFromData.deliveryProducts[key].vesselQuantityAmount == null || $scope.filterFromData.deliveryProducts[key].vesselQuantityAmount == '') {
                            $scope.filterFromData.deliveryProducts[key].vesselQuantityUom = null;
                        }
                        if ($scope.filterFromData.deliveryProducts[key].fuelManifoldTemperature == null || $scope.filterFromData.deliveryProducts[key].fuelManifoldTemperature == '') {
                            $scope.filterFromData.deliveryProducts[key].fuelManifoldTemperatureUom = null;
                        }
                        if ($scope.filterFromData.deliveryProducts[key].confirmedQuantityAmount == null || $scope.filterFromData.deliveryProducts[key].confirmedQuant == '') {
                            $scope.filterFromData.deliveryProducts[key].confirmedQuantityUom = null;
                        }
                        if ($scope.filterFromData.deliveryProducts[key].deliveredVolume == null || $scope.filterFromData.deliveryProducts[key].deliveredVolume == '') {
                            $scope.filterFromData.deliveryProducts[key].deliveredVolumeUom = null;
                        }
                        if ($scope.filterFromData.deliveryProducts[key].buyerQuantityAmount == null || $scope.filterFromData.deliveryProducts[key].buyerQuantityAmount == '') {
                            $scope.filterFromData.deliveryProducts[key].buyerQuantityUom = null;
                        }
                        if ($scope.filterFromData.deliveryProducts[key].sellerQuantityAmount == null || $scope.filterFromData.deliveryProducts[key].sellerQuantityAmount == '') {
                            $scope.filterFromData.deliveryProducts[key].sellerQuantityUom = null;
                        }
                        if ($scope.filterFromData.deliveryProducts[key].surveyorQuantityAmount == null || $scope.filterFromData.deliveryProducts[key].surveyorQuantityAmount == '') {
                            $scope.filterFromData.deliveryProducts[key].surveyorQuantityUom = null;
                        }
                        if ($scope.filterFromData.deliveryProducts[key].vesselFlowMeterQuantityAmount == null || $scope.filterFromData.deliveryProducts[key].vesselFlowMeterQuantityAmount == '') {
                            $scope.filterFromData.deliveryProducts[key].vesselFlowMeterQuantityUom = null;
                        }
                    });
                }

                vm.fields = angular.toJson($scope.filterFromData);
                if (!vm.entity_id) {
                    vm.entity_id = 0;
                }
                if (vm.entity_id > 0) {
                    Factory_Master.save_master_changes(vm.app_id, vm.screen_id, vm.fields, (callback) => {
                        screenLoader.showLoader();
                        // alert('no reload');
                        if (callback.status == true) {
                            $scope.loaded = true;
                            if (vm.app_id == 'admin' && vm.screen_id == 'configuration') {
                                vm.entity_id = 0;
                                $rootScope.reloadTenantConfiguration = true;
                            }
                            setTimeout(() => {
                                $scope.submitedAction = false;
                            }, 100);
                            if (sendEmails) {
                                $scope.sendEmails();
                            }
                            if(noReload == undefined || typeof noReload == undefined || !noReload) {
                                toastr.success(callback.message);
                                // alert('reloading');
                                var $tenantConfiguration = null;
                                $state.reload();
                                screenLoader.hideLoader();
                            } else if(completeCallback) {

                                toastr.success('Saved');

                                toastr.warning('Preparing to complete');
                                $('#ClaimTypeClaimType').attr('disabled', 'disabled');
                                completeCallback();
                            }
                        } else {
                            // toastr.error(callback.message);
                            setTimeout(() => {
                                $scope.submitedAction = false;
                            }, 100);

                            if (vm.app_id == 'invoices' && vm.screen_id == 'invoice') {
                                if ($scope.filterFromData.costDetails.length > 0) {
                                    $.each($scope.filterFromData.costDetails, (k, v) => {
                                        if (v.product == null) {
                                            if (v.associatedOrderProduct == 'All' || v.isAllProductsCost) {
                                                v.product = {
                                                    id: -1
                                                };
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    });
                } else {
                    Factory_Master.create_master_entity(vm.app_id, vm.screen_id, vm.fields, (callback) => {
                        if (callback.status == true) {
                            toastr.success(callback.message);
                            if (vm.app_id == 'admin' && vm.screen_id == 'configuration') {
                                vm.entity_id = 0;
                                $state.reload();
                                Factory_Master.get_master_entity(vm.entity_id, vm.screen_id, vm.app_id, (callback2) => {
                                    if (callback2) {
                                        $scope.formValues = callback2;

                                    }
                                });
                            } else {
                                var locationPath;
                                if ($location.path().slice(-2) == '/0') {
                                    locationPath = $location.path().slice(0, -1);
                                } else {
                                    locationPath = $location.path();
                                }
                                if (vm.app_id == 'admin') {
                                    if(vm.screen_id == 'sellerrating') {
                                        $state.reload();
                                    }else if (sendEmails) {
                                        $location.path(locationPath + callback.id).hash('mail');
                                    } else {
                                        $location.path(locationPath + callback.id);
                                    }
                                }else if (sendEmails) {
                                    $location.path(locationPath + callback.id).hash('mail');
                                } else {
                                    $location.path(locationPath + callback.id);
                                }
                            }
                            setTimeout(() => {
                                $scope.submitedAction = false;
                            }, 100);
                        } else {
                            // toastr.error(callback.message);
                            setTimeout(() => {
                                $scope.submitedAction = false;
                            }, 1000);
                            $scope.submitedAction = false;
                        }
                    });
                }
                // $scope.refreshSelect();
            } else {
                $scope.submitedAction = false;
                vm.invalid_form = true;
                let message = 'Please fill in required fields:';
                let message_min = 'Please enter a value greater than zero for:';
                let hasMessage = false;
                let isMin = false;
                let names = [];
                $.each(vm.editInstance.$error.required, (key, val) => {
                    if (names.indexOf(val.$name) == -1) {
                        message = `${message }<br>${ val.$name ? val.$name : val.$$attr.id}`;
                        hasMessage = true;
                    }
                    names = names + (val.$name ? val.$name : val.$$attr.id);
                });
                i = 0;
                $.each(vm.editInstance.$error.pattern, (key, val) => {
                    i++;
                    if (i === 1) {
                        message = `${message }<br>Please check format:`;
                    }
                    message = `${message }<br>${ val.$name}`;
                    hasMessage = true;
                });

                $.each(vm.editInstance.$error.min, (key, val) => {
                    message_min = `${message_min }<br>${val.$name ? val.$name : val.$$attr.id}`;
                    isMin = true;
                });
                if (hasMessage) {
                    toastr.error(message);
                }
                if (isMin) {
                    toastr.error(message_min);
                }
                setTimeout(() => {
                    $scope.submitedAction = false;
                }, 100);
            }
        };

        $scope.throwerror = function (toastererror) {
            toastr.error(toastererror);

        };

        $scope.SaveLocationProductsValidation = function () {
            var returnresult = false;
            if ($scope.formValues.locationProducts != undefined && $scope.formValues.locationProducts.length > 0) {
                $.each($scope.formValues.locationProducts, (k, v) => {
                    if((v.locationProducts == undefined || v.locationProducts == "") || (v.productType == undefined || v.productType == ""))
                        {
                        toastr.error('Please fill all required details');
                            return returnresult =false
                        }
                    });
            }
            else
            {
                return returnresult = true
            }
            return returnresult
            console.log("returnresult", returnresult)
        }
        $scope.SaveAdditionalCostDetValidation = function () {


            var returnresult = false;

            if ($scope.formValues.additionalCosts != undefined && $scope.formValues.additionalCosts.length > 0) {
                $.each($scope.formValues.additionalCosts, (m, n) => {
                    if(n.additionalCost == undefined || n.additionalCost == ""){
                        $('#ItemName'+ m).addClass('ng-invalid');
                    }
                    else
                    {
                        $('#ItemName'+ m).removeClass('ng-invalid');
                    }
                    if(n.costType == undefined || n.costType == ""){
                        $('#Type'+ m).addClass('ng-invalid');
                    }
                    else
                    {
                        $('#Type'+ m).removeClass('ng-invalid');
                    }
                    if(n.costType != undefined && n.costType.name != undefined){
                        if (n.costType.name == 'Range' || n.costType.name == 'Total') {
                            $('#Amount' + m).removeClass('ng-invalid');
                        }
                        else
                        {
                            if (n.amount == undefined || n.amount == "") {
                                $('#Amount' + m).addClass('ng-invalid');
                            }
                            else {
                                $('#Amount' + m).removeClass('ng-invalid');
                            }
                        }
                    }
                    else{
                        if (n.amount == undefined || n.amount == "") {
                            $('#Amount' + m).addClass('ng-invalid');
                        }
                        else {
                            $('#Amount' + m).removeClass('ng-invalid');
                        }
                    }

                    if(n.currency == undefined || n.currency == ""){
                        $('#Currency'+ m).addClass('ng-invalid');
                    }
                    else
                    {
                        $('#Currency'+ m).removeClass('ng-invalid');
                    }

                });



                $.each($scope.formValues.additionalCosts, (k, v) => {
                    if((v.additionalCost == undefined || v.additionalCost == "") || (v.costType == undefined || v.costType == ""))
                    {

                        toastr.error('Please fill all required details');
                        return returnresult = false
                    }
                    else{
                        if(v.costType.name == 'Range' || v.costType.name == 'Total'){
                            /* Additional Cost Details Validations start */
                                    if (v.additionalCostDetails != undefined && v.additionalCostDetails.length != 0) {
                                        var FormvalueLength = v.additionalCostDetails.length - 1;
                                        $.each(v.additionalCostDetails, (i, j) => {
                                            if (FormvalueLength != i) {
                                                if (IsZeroOrHigher(j.qtyFrom) || IsZeroOrHigher(j.qtyTo) || IsDataExists(j.priceUom) || IsDataExists(j.costType) || IsDataExists(j.amount) || IsDataExists(j.currency)) {
                                                    toastr.error('Please fill all required details in Port Additional Cost Details');
                                                    return returnresult = false
                                                }
                                                else if (parseInt(j.qtyFrom) >= parseInt(j.qtyTo)) {
                                                    toastr.error('Quantity From Should be less than Quantity To');
                                                    return returnresult = false
                                                }
                                                else {
                                                    return returnresult = true
                                                }
                                            }
                                            else {
                                                if (IsZeroOrHigher(j.qtyFrom) || IsZeroOrHigher(j.qtyTo) || IsDataExists(j.priceUom) || IsDataExists(j.costType) || IsDataExists(j.amount) || IsDataExists(j.currency)) {
                                                    toastr.error('Please fill all required details in Port Additional Cost Details');
                                                    return returnresult = false
                                                }
                                                else if (parseInt(j.qtyFrom) >= parseInt(j.qtyTo)) {
                                                    toastr.error('Quantity From Should be less than Quantity To');
                                                    return returnresult = false

                                                }
                                                else {
                                                    return returnresult = true
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        toastr.error('Please fill all required details in Port Additional Cost Details');
                                        return returnresult = false
                                    }

                            /* Additional Cost Details Validations End */
                        }
                        else{
                            //AdditionalCostDetails should be empty
                            if(v.amount == undefined || v.amount == ""){
                                $('#Amount').addClass('ng-invalid');
                                    if(v.currency == undefined || v.currency == ""){
                                        $('#Currency').addClass('ng-invalid');
                                    }
                                toastr.error('Please fill all required details');
                                return returnresult = false
                            }
                            else if(v.currency == undefined || v.currency == ""){
                                $('#Currency').addClass('ng-invalid');
                                toastr.error('Please fill all required details');
                                return returnresult = false
                            }
                            else
                            {
                                return returnresult = true
                            }

                        }
                    }
                });
            }
            else
            {
                return returnresult = true
            }
            return returnresult
            console.log("returnresult", returnresult)
        };


        $scope.save_terms_and_conditions = function(id) {

            Factory_Master.save_terms_and_conditions(id, $scope.formValues.termsAndConditions, (response) => {
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
            localStorage.setItem(`${vm.app_id + vm.screen_id }_copy`, vm.entity_id);
            $location.path(`/${ vm.app_id }/${ vm.screen_id }/edit/`);
        };

        $scope.navigateToSellerRating = function() {
            $location.path(`/${ vm.app_id }/${ vm.screen_id }/seller-rating/${ vm.entity_id }/${ vm.location_id }`);
        };
        $scope.triggerError = function(name, errors) {
            if (errors.$viewValue != 'NaN') {
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
            if ($rootScope.sellerRatingFunctionDone) {
                return;
            }
            $rootScope.sellerRatingFunctionDone = true;
            Factory_Master.get_seller_rating(app, screen, entityId, (response) => {
                $rootScope.sellerRatingFunctionDone = false;
                if (response.error) {
                    toastr.error(response.message);
                } else {
                    $scope.sellerRating = response;
                    var tpl = $templateCache.get('app-general-components/views/modal_sellerrating.html');
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        size: 'full',
                        appendTo: angular.element(document.getElementsByClassName('page-container')),
                        windowTopClass: 'fullWidthModal',
                        scope: $scope // passed current scope to the modal
                    });
                }
            });
        };

        var decodeHtmlEntity = function(str) {
            return str.replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec);
            });
        };

        vm.decodeHtml = function(str) {
            return decodeHtmlEntity(_.unescape(str));
        }

        // SPEC GROUP MODAL
        $scope.modalSpecGroupEdit = function(product, entityId, application, orderData) {
            vm.activeProductForSpecGroupEdit = product;
            if (application == 'request' || application == 'order') {
                $scope.canChangeSpec = false;
                $scope.modalSpecGroupParametersEditable = true;
            } else {
                $scope.modalSpecGroupParametersEditable = false;
            }
            if (!product.specGroup) {
                toastr.error('Please select a spec group!');
                return;
            }
            if (application == 'request' || application == 'supplier') {
                if (!entityId) {
                    $scope.modalSpecGroupParametersEditable = false;
                }
                if (typeof product.productStatus != 'undefined' && product.productStatus != null) {
                    status = product.productStatus.name;
                    if (status == 'Created' || status == 'Questionnaire' || status == 'Validated' || status == 'ReOpen' || status == 'PartiallyInquired' || status == 'Inquired') {
                        $scope.modalSpecGroupParametersEditable = true;
                    } else {
                        $scope.modalSpecGroupParametersEditable = false;
                    }
                } else {
                    $scope.modalSpecGroupParametersEditable = false;
                }
                if (application == 'supplier') {
                    $scope.modalSpecGroupParametersEditable = false;
                }
                $.each(product.screenActions, (key, val) => {
                    if (val.name == 'ChangeSpecParameters') {
                        $scope.canChangeSpec = true;
                    }
                });
                var productId = product.product.id;
                if (application == 'request') {
                    var data = {
                        Payload: {
                            Filters: [
                                {
                                    ColumnName: 'RequestProductId',
                                    Value: product.id
                                },
                                {
                                    ColumnName: 'SpecGroupId',
                                    Value: product.specGroup.id
                                },
                                {
                                    ColumnName: 'ProductId',
                                    Value: productId
                                }
                            ]
                        }
                    };
                }
                if (application == 'supplier') {
                    var data = {
                        Token: $state.params.token,
                        Parameters: {
                            Filters: [
                                {
                                    ColumnName: 'RequestProductId',
                                    Value: product.id
                                },
                                {
                                    ColumnName: 'SpecGroupId',
                                    Value: product.specGroup.id
                                },
                                {
                                    ColumnName: 'ProductId',
                                    Value: productId
                                }
                            ]
                        }
                    };
                }
            }
            if (application == 'order') {
                $.each(orderData.screenActions, (key, val) => {
                    if (val.name == 'ChangeSpecParameters') {
                        $scope.canChangeSpec = true;
                    }
                });
                var productId = product.product.id;
                var data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: 'OrderProductId',
                                Value: product.id
                            },
                            {
                                ColumnName: 'SpecGroupId',
                                Value: product.specGroup.id
                            },
                            {
                                ColumnName: 'ProductId',
                                Value: productId
                            }
                        ]
                    }
                };
            }
            if (application == 'contract') {
                var productId = product.product.id;
                var data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: 'ContractProductId',
                                Value: product.id ? product.id : null
                            },
                            {
                                ColumnName: 'SpecGroupId',
                                Value: product.specGroup.id
                            },
                            {
                                ColumnName: 'ProductId',
                                Value: productId
                            }
                        ]
                    }
                };
                if (vm.isEdit && $scope.formValues.status.name != 'Confirmed' && product.id != 0) {
                    $scope.modalSpecGroupParametersEditable = true;
                    $scope.canChangeSpec = true;
                }
            }
            tpl = $templateCache.get('app-general-components/views/modalSpecGroupEdit.html');
            Factory_Master.getSpecForProcurement(data, application, (response) => {
                if (response) {
                    $scope.modalSpecGroupParameters = response.data.payload;
                    for (let i = 0; i < $scope.modalSpecGroupParameters.length; i++) {
                        $scope.modalSpecGroupParameters[i].specParameter.name = decodeHtmlEntity(_.unescape( $scope.modalSpecGroupParameters[i].specParameter.name));
                    }
                    $scope.application = application;
                    $scope.product = product;
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        size: 'full',
                        appendTo: angular.element(document.getElementsByClassName('page-container')),
                        windowTopClass: 'fullWidthModal',
                        scope: $scope
                    });
                } else {
                    toastr.error('An error has occured');
                }
            });
        };
        $scope.modalSpecGroupParametersUpdateUom = function(specParamId, index) {

            Factory_Master.get_master_entity(specParamId.id, 'specparameter', 'masters', (response) => {
                if (response) {
                    $scope.modalSpecGroupParameters[index].uom = response.uom;
                    $scope.modalSpecGroupParameters[index].energyParameterTypeId = response.energyParameterType.id;
                }
            });
        };
        $scope.saveProcurementSpecGroup = function(data, application) {

            if (application == 'request') {
                $.each(data, (key, spec) => {
                    data[key].requestProduct = {};
                    data[key].specGroup = {};
                    data[key].requestProduct.id = vm.activeProductForSpecGroupEdit.id;
                    data[key].specGroup.id = vm.activeProductForSpecGroupEdit.specGroup.id;
                });
            }
            if (application == 'order') {
                $.each(data, (key, spec) => {
                    spec.orderProduct = data[0].orderProduct;
                    spec.specGroup = data[0].specGroup;
                });
            }
            if (application == 'contract') {
                $.each(data, (key, spec) => {
                    spec.contractProduct = data[0].contractProduct;
                    spec.specGroup = data[0].specGroup;
                });
            }
            var objToSend = {
                ProductId: vm.activeProductForSpecGroupEdit.product.id,
                SpecParameters: data
            };
            Factory_Master.saveSpecForProcurement(objToSend, application, (response) => {
                if (response) {
                    if (response.status) {
                        toastr.success('Saved succesfully');
                        setTimeout(() => {
                            $scope.prettyCloseModal();
                        }, 500);
                    } else {
                        toastr.error(response.message);
                    }
                    console.log(response);
                } else {
                    toastr.error('An error has occured');
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
        $scope.tradeBookFilters = function(template, clc, name, id, formvalue, idx) {
            if ($scope.formValues.tradeBookMappings[idx].productType!=null) {
                $scope.tradeBookfilter = [
                    {columnValue: "ProductType_Id", ColumnType: "Number", ConditionValue: "=", Values: [$scope.formValues.tradeBookMappings[idx].productType.id], FilterOperator: 0}
                    ];
            localStorage.setItem("uniqueModalTableIdentifier", "productsInTradeBookMapping");
            }else{
                $scope.tradeBookfilter =[];
            }
        }
        //   $scope.triggerModal = function(template, clc, name, id, formvalue, idx, field_name, filter) {
        //       tpl = "";
        //       if (template == "formula") {
        //           $scope.modal = {
        //               clc: "masters_formulalist",
        //               app: "masters",
        //               screen: "formulalist",
        //               name: name,
        //               source: id,
        //               field_name: field_name
        //           };
        //           if (formvalue) {
        //               $scope.modal.formvalue = formvalue;
        //               $scope.modal.idx = idx;
        //           }
        //           if (vm.app_id == "contracts") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "ContractId",
        //                       Value: vm.entity_id ? vm.entity_id : null
        //                   }
        //               ];
        //           }
        //           tpl = $templateCache.get("app-general-components/views/modal_formula.html");
        //       } else if (template == "alerts") {
        //           tpl = $templateCache.get("app-general-components/views/modal_alerts.html");
        //           $scope.modal = {
        //               source: clc
        //           };
        //       } else if (template == "general") {
        //           tpl = $templateCache.get("app-general-components/views/modal_general_lookup.html");
        //           if (clc == "deliveries_transactionstobeinvoiced") {
        //               clcs = ["invoices", "transactionstobeinvoiced"];
        //           } else if (clc == "payableTo") {
        //               clcs = ["invoices", "payableTo"];
        //           } else if (clc == "contactplanning_contractlist") {
        //               // clcs = ['procurement','contractplanning_contractlist'];
        //           } else {
        //               if (typeof clc != "undefined") {
        //                   clcs = clc.split("_");
        //               } else {
        //                   return;
        //               }
        //           }
        //           $scope.modal = {
        //               clc: clc,
        //               app: clcs[0],
        //               screen: clcs[1],
        //               name: name,
        //               source: id,
        //               field_name: field_name
        //           };
        //           if (clc == "payableTo") {
        //               $scope.modal.app = "masters";
        //               $scope.modal.screen = "counterpartylist";
        //           }
        //           if (clc == "contactplanning_contractlist") {
        //               $scope.modal.filters = filter;
        //           }
        //           if (clc == "procurement_bunkerableport" || clc == "procurement_destinationport") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "VesselId",
        //                       Value: filter.id
        //                   },
        //                   {
        //                       ColumnName: "VesselVoyageDetailId",
        //                       Value: null
        //                   }
        //               ];
        //           }
        //           if (clc == "procurement_requestcounterpartytypes") {
        //               var filterString = "";
        //               $.each(filter, function(key, val) {
        //                   filterString += val;
        //                   filterString += ",";
        //               });
        //               filterString = filterString.slice(0, -1);
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "CounterpartyTypes",
        //                       Value: filterString
        //                   }
        //               ];
        //           }
        //           if (clc == "procurement_buyerlist") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "VesselId",
        //                       Value: filter.id
        //                   },
        //                   {
        //                       ColumnName: "VesselVoyageDetailId",
        //                       Value: null
        //                   }
        //               ];
        //           }
        //           if(clc == "procurement_productcontractlist"){
        //               $scope.modal.filters = filter;
        //           }
        //           if (filter == "filter__invoices_order_id") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "Order_Id",
        //                       Value: $scope.formValues.orderDetails ? $scope.formValues.orderDetails.order.id : ""
        //                   }
        //               ];
        //           }
        //           if (filter == "mass") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "UomType",
        //                       Value: 2
        //                   }
        //               ];
        //           }
        //           if (filter == "volume") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "UomType",
        //                       Value: 3
        //                   }
        //               ];
        //           }
        //           if (filter == "sellerList") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "CounterpartyTypes",
        //                       Value: "2, 11"
        //                   }
        //               ];
        //               $scope.modal.clc = "masters_counterpartylist_seller";
        //           }
        //           if (filter == "agentList") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "CounterpartyTypes",
        //                       Value: 5
        //                   }
        //               ];
        //           }
        //           if (filter == "brokerList") {
        //               $scope.modal.clc = "masters_counterpartylist_broker";
        //           }
        //           if (filter == "supplierList") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "CounterpartyTypes",
        //                       Value: 1
        //                   }
        //               ];
        //           }
        //           if (filter == "surveyorList") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "CounterpartyTypes",
        //                       Value: 6
        //                   }
        //               ];
        //           }
        //           if (filter == "labsList") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "CounterpartyTypes",
        //                       Value: 8
        //                   }
        //               ];
        //           }
        //           if (filter == "bargeList") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "CounterpartyTypes",
        //                       Value: 7
        //                   }
        //               ];
        //           }
        //           if (filter == "price_period_filter") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "SystemInstrumentId",
        //                       Value: $scope.formValues.systemInstrument.id
        //                   }
        //               ];
        //           }
        //           if (filter == "filter__vessel_defaultFuelOilProduct") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "ProductId",
        //                       Value: $scope.formValues.defaultFuelOilProduct.id
        //                   }
        //               ];
        //           }

        //           if (filter == "filter__vessel_defaultDistillateProduct") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "ProductId",
        //                       Value: $scope.formValues.defaultDistillateProduct.id
        //                   }
        //               ];
        //           }
        //           if (filter == "filter__vessel_defaultLsfoProduct") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "ProductId",
        //                       Value: $scope.formValues.defaultLsfoProduct.id
        //                   }
        //               ];
        //           }
        //           if (filter == "filter__productDefaultSpec") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "ProductId",
        //                       Value: $scope.formValues.id
        //                   }
        //               ];
        //           }
        //           if (filter == "delivery_order_filter") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "id",
        //                       Value: "7"
        //                   }
        //               ];
        //           }
        //           if (filter == "filter__admin_templates") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "EmailTransactionTypeId",
        //                       Value: $scope.grid ? $scope.grid.appScope.fVal().formValues.email[idx].transactionType.id : $scope.formValues.email[idx].transactionType.id
        //                   },
        //                   {
        //                       ColumnName: "Process",
        //                       Value: $scope.grid ? $scope.grid.appScope.fVal().formValues.email[idx].process : $scope.formValues.email[idx].process
        //                   }
        //               ];
        //           }
        //           if (filter == "filter__master_documenttypetemplates") {
        //               $scope.modal.filters = [
        //                   {
        //                       ColumnName: "EmailTransactionTypeId",
        //                       Value: $scope.grid.appScope.fVal().formValues.templates[idx].transactionType.id
        //                   }
        //               ];
        //           }
        //           if (filter == "filter__vessel_tankProduct") {
        //               $scope.modal.filters = [
        // {columnValue: "ProductType_Id", ColumnType: "Number", ConditionValue: "=", Values: [$scope.formValues.temp.tanks.productType.id], FilterOperator: 0}
        // // {columnValue: "ProductType_Name", ColumnType: "Text", ConditionValue: "LIKE", Values: [$scope.formValues.temp.tanks.productType.name], FilterOperator: 0}
        //               ];
        //               localStorage.setItem("uniqueModalTableIdentifier", "productsInVesselMaster");
        //           }
        //           if (clc == "masters_marketinstrumentlist") {
        //               $scope.modal.screen = "marketinstrument";
        //           }
        //           if (formvalue) {
        //               $scope.modal.formvalue = formvalue;
        //               $scope.modal.idx = idx;
        //           }
        //       } else if (template == "sellerrating") {
        //           $scope.getSellerRating();
        //           tpl = $templateCache.get("app-general-components/views/modal_sellerrating.html");
        //       } else if (template == "setResetPassword") {
        //           tpl = $templateCache.get("app-general-components/views/modal_setPassword.html");
        //       } else if (template == "labsResultRecon") {
        //           tpl = $templateCache.get("app-general-components/views/modal_labsResultRecon.html");
        //       } else if (template == "raiseClaimType") {
        //           tpl = $templateCache.get("app-general-components/views/modal_raiseClaimType.html");
        //       } else if (template == "splitDeliveryModal") {
        //           tpl = $templateCache.get("app-general-components/views/modal_splitDelivery.html");
        //       }
        //       if (template == "splitDeliveryModal" || template == "raiseClaimType") {
        //           $scope.modalInstance = $uibModal.open({
        //               template: tpl,
        //               size: "full",
        //               appendTo: angular.element(document.getElementsByClassName("page-container")),
        //               windowTopClass: "fullWidthModal smallModal",
        //               scope: $scope //passed current scope to the modal
        //           });
        //           return;
        //       }
        //       $scope.modalInstance = $uibModal.open({
        //           template: tpl,
        //           size: "full",
        //           appendTo: angular.element(document.getElementsByClassName("page-container")),
        //           windowTopClass: "fullWidthModal",
        //           scope: $scope //passed current scope to the modal
        //       });
        //   };
        $scope.$on('modal.closing', (event, reason, closed) => {
            if (!$scope.modalClosed) {
                if (typeof $scope.modalInstance != 'undefined') {
                    event.preventDefault();
                    $scope.prettyCloseModal();
                    $scope.modalClosed = true;
                }
            }
        });
        $scope.prettyCloseModal = function() {
            let modalStyles = {
                transition: '0.3s',
                opacity: '0',
                transform: 'translateY(-50px)'
            };
            let bckStyles = {
                opacity: '0',
                transition: '0.3s'
            };
            $('[modal-render=\'true\']').css(modalStyles);
            $('.modal-backdrop').css(bckStyles);
            setTimeout(() => {
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
            Factory_Master.mastersTree((callback, response) => {
                vm.mastersTree = callback;
            });
        };
        vm.selectMaster = function(id, name) {
            $location.path(`/masters/${ id}`);
            $scope.master_name = name;
        };
        vm.editMasterStructure = function() {
            $location.path(`/masters/${ vm.screen_id }/structure`);
        };
        //    vm.get_master_entity = function(screenChild) {
        //     	if (localStorage.getItem("invoiceFromDelivery")) {
        //     		// $rootScope.transportData = angular.copy(JSON.parse(localStorage.getItem("invoiceFromDelivery")));

		   //      Factory_Master.create_invoice_from_delivery(angular.copy(JSON.parse(localStorage.getItem("invoiceFromDelivery"))), function(response) {
		   //          if (response) {
		   //              if (response.status == true) {
		   //                  $scope.loaded = true;
		   //                  $rootScope.transportData = response.data;
		   //                  if(!$rootScope.transportData.paymentDate) {
		   //                      $rootScope.transportData.paymentDate = $rootScope.transportData.workingDueDate;
		   //                  }
        //                        $scope.formValues = angular.copy($rootScope.transportData);
	    //                     $scope.triggerChangeFields("InvoiceRateCurrency");
	    //                     if ($scope.formValues.costDetails) {
		   //                      if ($scope.formValues.costDetails.length > 0) {
		   //                          $.each($scope.formValues.costDetails, function(k, v) {
		   //                              if (v.product == null || v.isAllProductsCost) {
		   //                                  v.product = {
		   //                                      id: -1,
		   //                                      name: "All"
		   //                                  };
		   //                              }
		   //                              if (v.product.id != -1) {
        // 	                	v.product.productId = angular.copy(v.product.id);
        // 	                	if (v.deliveryProductId) {
        // 		                	v.product.id = v.deliveryProductId;
        // 	                	}

        // 	                }
		   //                          });
		   //                      }
	    //                     }
		   //              } else {
		   //                  $scope.loaded = true;
		   //                  toastr.error(response.message);
		   //              }
		   //          }
        //                $rootScope.transportData = null;
        // localStorage.removeItem("invoiceFromDelivery");
		   //      })

        //     	}

        //        vm.get_master_structure(screenChild);
        //        setTimeout(function() {
        //            vm.addHeadeActions();
        //        }, 10);
        //        if ($scope.entity == -1) {
        //            vm.entity_id = "";
        //        } else if ($scope.entity > 0) {
        //            vm.entity_id = $scope.entity;
        //        } else {
        //            vm.entity_id = vm.entity_id;
        //        }
        //    	if (vm.entity_id == "") {
        //    		if (vm.app_id == "masters" && vm.screen_id == "location") {
        //    			$scope.formValues.portType = {id: 1};
        //    			$scope.formValues.displayPortInMap = true;
        //    		}
        //    	}


        //        if (vm.entity_id == "0") {
        //        } else {
        //            // $rootScope.transportData este variabila globala folosita pentru cazurile in care avem nevoie
        //            // sa populam un ecran de create, atunci cand datele vin in urma unei actiuni.
        //            if ($rootScope.transportData != null) {
        //                $scope.isCopiedEntity = true;
        //                $scope.formValues = $rootScope.transportData;
        //                $rootScope.transportData = null;


        //                if (vm.app_id == "invoices" && vm.screen_id == "invoice") {
        // 		$scope.triggerChangeFields("InvoiceRateCurrency");
	    //                     if ($scope.formValues.costDetails) {
		   //                      if ($scope.formValues.costDetails.length > 0) {
		   //                          $.each($scope.formValues.costDetails, function(k, v) {
		   //                              if (v.product == null || v.isAllProductsCost) {
		   //                                  v.product = {
		   //                                      id: -1,
		   //                                      name: "All"
		   //                                  };
		   //                              } else {
        // 	                	if (v.product.id != v.deliveryProductId) {
        // 		                	v.product.productId = angular.copy(v.product.id);
        // 		                	v.product.id = angular.copy(v.deliveryProductId);
        // 	                	}
		   //                              }
		   //                          });
		   //                      }
	    //                     }
        //                }
        //            } else {
        //                if (localStorage.getItem(vm.app_id + vm.screen_id + "_copy")) {
        //                    id = localStorage.getItem(vm.app_id + vm.screen_id + "_copy");
        //                    if (id > 0) {
        //                        $scope.copiedId = id;

        //                        Factory_Master.get_master_entity(id, vm.screen_id, vm.app_id, function(response) {
        //                            if (response) {
        //                                $scope.formValues = response;

        //                                $.each($scope.formValues, function(key, val) {
        //                                    if (val && angular.isArray(val)) {
        //                                        $.each(val, function(key1, val1) {
        //                                            if (val && val1 && val1.hasOwnProperty("isDeleted")) {
        //                                                if (vm.app_id != "contracts" && vm.screen_id != "contract" &&
        //                                                	vm.app_id != "admin" && vm.screen_id != "users") {
        //                                                    response[key][key1].id = 0;
        //                                                }
        //                                            }
        //                                        });
        //                                    }
        //                                });
        //                                $scope.formValues.id = 0;
        //                                if (typeof $scope.formValues.name != "undefined") {
        //                                    $scope.formValues.name = null;
        //                                }
        //                                if ($scope.formValues.conversionFactor) {
        //                                    $scope.formValues.conversionFactor.id = 0;
        //                                }
        //                                // reset contract status
        //                                if (vm.app_id == "contracts" && vm.screen_id == "contract") {
        //                                    $scope.formValues.status = null;
        //                                    $.each($scope.formValues.details, function(k, v) {
        //                                        v.id = 0;
        //                                    });
        //                                    $.each($scope.formValues.products, function(k, v) {
        //                                        v.id = 0;
        //                                        $.each(v.details, function(k1, v1) {
        //                                            v1.id = 0;
        //                                        });
        //                                        $.each(v.additionalCosts, function(k1, v1) {
        //                                            v1.id = 0;
        //                                        });
        //                                        v.formula = null;
        //                                        v.mtmFormula = null;
        //                                        v.price = null;
        //                                        v.mtmPrice = null;
        //                                    });
        //                                    $scope.formValues.summary.plannedQuantity = 0;
        //                                    $scope.formValues.summary.utilizedQuantity = 0;
        //                                    $scope.formValues.summary.availableQuantity = $scope.formValues.summary.contractedQuantity;
        //                                    $scope.formValues.summary.copiedContract = true;
        //                                    $scope.formValues.createdBy = null;
        //                                    toastr.info($filter("translate")("Formula and MTM Formula was reset for all products"));
        //                                }
        //                                if (vm.app_id == "admin" && vm.screen_id == "users") {
        //                                    $scope.formValues.contactInformation.id = 0;
        //                                    $scope.formValues.contactInformation.address.id = 0;
        //                                }
        //                                if (vm.app_id == "admin" && vm.screen_id == "role") {
        //                                    $scope.formValues.roles.id = 0;
        //                                    $.each($scope.formValues.roles.rights, function(key,val){
        //                                        $scope.formValues.roles.rights[key].id = 0;
        //                                    });
        //                                }
        //                                if (vm.app_id == "masters" && vm.screen_id == "product") {
        //                                    $scope.formValues.defaultSpecGroup = null;
        //                                }
        //                                if (vm.app_id == "claims" && vm.screen_id == "claims") {
        //                                    $scope.formValues = {};
        //                                    $scope.formValues.claimsPossibleActions = null;
        //                                    $scope.formValues.isEditable = true;
        //                                    $scope.formValues.orderDetails = response.orderDetails;
        //                                    $scope.formValues.deliveryDate = response.deliveryDate;
        //                                    $scope.triggerChangeFields("OrderID", "orderDetails.order");
        //                                }
        //                                if (vm.app_id == "labs" && vm.screen_id == "labresult") {
        //                                    vm.checkVerifiedDeliveryFromLabs("loadedData");
        //                                }
        //                                if (vm.app_id == "masters" && vm.screen_id == "paymentterm") {
        //                                    vm.checkVerifiedDeliveryFromLabs("loadedData");
        //                                    $.each($scope.formValues.conditions, function(k,v){
	    //                                     v.paymentTerm = null
        //                                    })
        //                                }
        //                                toastr.success("Entity copied");
        //                                localStorage.removeItem(vm.app_id + vm.screen_id + "_copy");
        //                                $scope.$emit("formValues", $scope.formValues);
        //                            }
        //                        });
        //                    }
        //                } else {
        //                    if(vm.entity_id){
        //                        screenLoader.showLoader();
        //                    }
        //                    Factory_Master.get_master_entity(
        //                        vm.entity_id,
        //                        vm.screen_id,
        //                        vm.app_id,
        //                        function(callback) {
        //                            screenLoader.hideLoader();
        //                            if (callback) {

        //                                $scope.formValues = callback;
        //                                if(vm.screen_id === 'emaillogs') {
        //                                    if($scope.formValues.to && typeof($scope.formValues.to) === 'string') {
        //                                      $scope.formValues.to = $scope.formValues.to.replace(/,/g, ';');
        //                                    }
        //                                    if($scope.formValues.cc && typeof($scope.formValues.cc) === 'string') {
        //                                      $scope.formValues.cc = $scope.formValues.cc.replace(/,/g, ';');
        //                                    }
        //                                    if($scope.formValues.bcc && typeof($scope.formValues.bcc) === 'string') {
        //                                      $scope.formValues.bcc = $scope.formValues.bcc.replace(/,/g, ';');
        //                                    }
        //                                }

        //                                if(vm.app_id === 'masters' && vm.screen_id === 'buyer') {
        //                                  $scope.formValues.showCode = !!$scope.formValues.code;
        //                                }
        //                                if(vm.app_id === 'masters' && vm.screen_id === 'vessel') {
        //                                	$scope.flattenVesselVoyages();
        // 					$scope.initRobTable();
        //                                }


				 //                    if (vm.app_id == "invoices" && vm.screen_id == "invoice") {
				 //                        $scope.triggerChangeFields("InvoiceRateCurrency");
				 //                        if ($scope.formValues.costDetails.length > 0) {
				 //                            $.each($scope.formValues.costDetails, function(k, v) {
				 //                                if (v.product == null || v.isAllProductsCost) {
				 //                                    v.product = {
				 //                                        id: -1,
				 //                                        name: "All"
				 //                                    };
				 //                                }
				 //                                if (v.product.id != -1) {
        // 			                	v.product.productId = angular.copy(v.product.id);
        // 			                	// v.product.id = angular.copy(v.deliveryProductId);
        // 			                }
				 //                            });
				 //                        }
				 //                    }

        //                                $rootScope.$broadcast("formValues", $scope.formValues);
        //                                $scope.refreshSelect();
        //                                $rootScope.formValuesLoaded = callback;
        //                                if (vm.screen_id == "invoice" && vm.app_id == "invoices") {
        //                                  if(!$scope.formValues.paymentDate) {
        //                                    $scope.formValues.paymentDate = $scope.formValues.workingDueDate;
        //                                  }
        //                                    if ($scope.formValues.costDetails.length > 0) {
        //                                        $.each($scope.formValues.costDetails, function(k, v) {
        //                                            if (v.product == null || v.isAllProductsCost) {
        //                                                v.product = {
        //                                                    id: -1,
        //                                                    name: "All"
        //                                                };
        //                                            }
        //                                        });
        //                                    }
        //                                    $.each($scope.formValues.productDetails, function(k, v) {
        //                                    	if (v.sapInvoiceAmount) {
        //                                    		v.invoiceAmount = v.sapInvoiceAmount;
        //                                    	} else {
        //                                    		v.invoiceAmount = v.invoiceComputedAmount;
        //                                    	}
        //                                    });
        //                                }
        //                                if (vm.app_id == "labs" && vm.screen_id == "labresult") {
        //                                    vm.checkVerifiedDeliveryFromLabs("loadedData");
        //                                }
        //                                if (vm.app_id == "invoices") {
        //                                    $scope.initInvoiceScreen();
        //                                }
        //                                if (vm.app_id == "contracts") {
        //                                    $scope.initContractScreen();
        //                                }
        //                                if ($location.hash() == "mail") {
        //                                    $scope.sendEmails();
        //                                    $location.hash("");
        //                                }
        //                                if (vm.app_id == "admin" && vm.screen_id == "configuration") {
    	//                             	$.each($scope.formValues.email, function(k,v){
		   //                          		if (v.toEmailsConfiguration) {
		   //                          			v.toEmailsConfiguration = v.toEmailsConfiguration.split(",");
		   //                          			tempToEmailsConfiguration = [];
		   //                          			$.each(v.toEmailsConfiguration, function(tok,tov){
		   //                          				tempToEmailsConfiguration.push({"id" : parseFloat(tov)});
		   //                          			})
		   //                      				$scope.formValues.email[k].toEmailsConfiguration = tempToEmailsConfiguration;
		   //                          		}
		   //                          		if (v.ccEmailsConfiguration) {
		   //                          			v.ccEmailsConfiguration = v.ccEmailsConfiguration.split(",");
		   //                          			tempCcEmailsConfiguration = [];
		   //                          			$.each(v.ccEmailsConfiguration, function(tok,tov){
			  //                           			tempCcEmailsConfiguration.push({"id" : parseFloat(tov)});
		   //                          			})
		   //                      				$scope.formValues.email[k].ccEmailsConfiguration = tempCcEmailsConfiguration;
		   //                          		}
		   //                          	})
        //                                }

        //                            }
        //                        },
        //                        screenChild
        //                    );
        //                }
        //                if (localStorage.getItem(vm.app_id + vm.screen_id + "_newEntity")) {
        //                    screenLoader.hideLoader();
        //                    data = angular.fromJson(localStorage.getItem(vm.app_id + vm.screen_id + "_newEntity"));
        //                    localStorage.removeItem(vm.app_id + vm.screen_id + "_newEntity");
        //                    $scope.formValues = data;
        //                }
        //            }
        //        }
        //        $scope.loaded = true;
        //        $scope.undirtyForm();
        //    };
        vm.addHeadeActions = function() {
            $('.page-content-wrapper a[data-group="extern"]').each(function() {
                if ($(this).attr('data-compiled') == 0) {
                    if ($(this).attr('data-method') != '') {
                        $(this).attr('ng-click', `${$(this).data('method') };submitedAcc("${ $(this).data('method') }")`);
                        $(this).attr('data-method', '');
                        $(this).attr('data-compiled', 1);
                        $compile($(this))($scope);
                    }
                }
            });
            if (vm.app_id == 'masters' && vm.screen_id == 'counterparty') {
                $('.entity_active').attr('ng-model', 'formValues.isDeleted');
            } else {
                $('.entity_active')
                    .attr('ng-checked', '!CM.entity_id || formValues.isDeleted == false')
                    .attr('ng-true-value', 'false')
                    .attr('ng-false-value', 'true')
                    .attr('ng-model', 'formValues.isDeleted');
                $('.completed').attr('ng-model', 'formValues.completed');
                if (vm.screen_id == 'claimtype') {
                    $('.entity_active').attr('ng-disabled', 'formValues.name ? true : false');
                }
            }
            $compile($('.entity_active'))($scope);
            $compile($('.completed'))($scope);
            // added++;
        };
        vm.delayaddHeadeActions = function() {
            return $timeout(vm.addHeadeActions, 100);
        };
        vm.delayaddModalActions = function() {
            setTimeout(() => {
                // $(this).unbind();
                $('.modal-content a[data-group="extern"]').each(function() {
                    if (!$(this).attr('ng-click')) {
                        $(this).attr('ng-click', $(this).data('method'));
                        $(this).attr('data-method', '');
                        $(this).attr('data-compiled', Number($(this).attr('data-compiled')) + 1);
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


            var fields = [ 'OrderID', 'labResultID', 'deliveryNumber', 'Product' ];
            var company_id = $('#companylistCompany').val();
            var market_id = $('#MarketInstrumentMarketInstrument').val();

            if (typeof $scope.triggerChangeFieldsAppSpecific == 'function') {
                $scope.triggerChangeFieldsAppSpecific(name, id);
            }
            if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
                if(name == 'EstimatedSettlementAmount') {
                    if($scope.formValues.claimDetails.estimatedSettlementAmount < 0) {
                        $.each($scope.options.SettlementType, (k, v) => {
                            if(v.name === 'Receive') {
                                $scope.formValues.claimDetails.settlementType = v;
                                $scope.formValues.claimDetails.estimatedSettlementAmount *= -1;
                                toastr.info('The estimated settlement amount cannot be negative. The settlement type has been set to "Receive" and the amount is positive.');
                            }
                        });
                    }
                }

                if ($scope.formValues != undefined && $scope.formValues.orderDetails != undefined && $scope.formValues.orderDetails.orderStatusName != undefined && $scope.formValues.orderDetails.orderStatusName != 'Cancelled') {
                    if ($scope.formValues.claimType != undefined && $scope.formValues.claimType.claimType != undefined && $scope.formValues.claimType.claimType.name != undefined && $scope.formValues.claimType.claimType.name != '') {
                       if($scope.formValues.claimType.claimType.name == 'Cancellation') {
                           toastr.warning("Kindly change the Claim Type");
                       }
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
            if (vm.app_id == 'masters') {
                if (vm.screen_id == 'additionalcost' && name == 'CostType' &&
                    $scope.formValues && $scope.formValues.costType) {
                    if($scope.formValues.costType.name == 'Flat' || $scope.formValues.costType.name == 'Unit' || $scope.formValues.costType.name == 'Range' || $scope.formValues.costType.name == 'Total') {
                        $scope.formValues.componentType = null;
                        $('.edit_form_fields_ComponentType_masters').hide();
                    } else {
                        $('.edit_form_fields_ComponentType_masters').show();
                    }
                }
                if (vm.screen_id == 'vessel' && id == 'vesselType') {
                	setTimeout(() => {
                		if ($scope.formValues.usingVesselTypeRob) {
                            $.each($scope.formValues.robs, (rk, rv) => {
                                rv.minQty = null;
                                rv.maxQty = null;
                            });
	                		$scope.triggerRobStandard(true);
                            $scope.$apply();
                		}
                	}, 500);
                }
                if(vm.screen_id == 'vessel' && id == 'defaultService') {
                    if (!$scope.isHideVesselBopsDetails) {
                        data = { Payload: $scope.formValues.defaultService.id };

                        Factory_Master.getService(data, (callback) => {
                            if (callback) {
                                if (callback.status == true) {
                                    let serviceObj = callback.data.payload;
                                    if(!serviceObj.length) {
                                        $scope.formValues.reeferUtilization = serviceObj.reeferUtilization;
                                    }
                                } else {
                                    toastr.error('An error has occured!');
                                }
                            }
                        });
                    };
                }
                if(vm.screen_id == 'vessel' && id == 'customer') {
                	if ($scope.firstSubdepartmentLoaded) {
	                	$scope.formValues.subDepartment = null;
                	}
                    Factory_Master.get_counterpartySubDepartments($scope.formValues.customer.id, (response) => {
                        $scope.firstSubdepartmentLoaded = true;
                        if (response) {
                            $scope.options.subDepartment = response;
                        }
                    });
                }
                if (name == 'Buyer' && vm.screen_id == 'buyer') {
                    if($scope.formValues.user) {
                    // $scope.formValues.name = $scope.formValues.user.displayName;
                        Factory_Master.get_master_entity($scope.formValues.user.id, 'users', 'admin', (response) => {
                            if (response) {
                                // $scope.formValues.code = response.displayName;
                            }
                        });
                    }
                }
                if (name == 'Company' && vm.screen_id == 'exchangerate') {
                    Factory_Master.get_master_entity($scope.formValues.company.id, 'company', 'masters', (response) => {
                        if (response) {
                            $scope.formValues.baseCurrency = {};
                            $scope.formValues.baseCurrency = response.currencyId;
                        }
                    });
                }
                if (name == 'DefaultFuelOil' && vm.screen_id == 'vessel') {
                    var field = new Object();
                    field = vm.formFieldSearch($scope.formFields, 'fuelOilSpecGroup');
                    if (field) {
                        vm.getOptions(field);
                    }
                }

                if (name == 'DefaultDistillate' && vm.screen_id == 'vessel') {
                    var field = new Object();
                    field = vm.formFieldSearch($scope.formFields, 'distillateSpecGroup');
                    if (field) {
                        vm.getOptions(field);
                    }
                }
                if (name == 'defaultLsfoProduct' && vm.screen_id == 'vessel') {
                    var field = new Object();
                    field = vm.formFieldSearch($scope.formFields, 'lsfoSpecGroup');
                    if (field) {
                        vm.getOptions(field);
                    }
                }
                if (name == 'specParameter' && vm.screen_id == 'specgroup') {
                    var row = $(`[name= "${ name }"]`).data('row-index');
                    setTimeout(() => {
                        var val = $(`[name= "${ name }"]`).data('cell-id');
                        Factory_Master.get_master_entity(val, 'specparameter', 'masters', (response) => {
                            if (response) {
                                $scope.formValues = $rootScope.formValuesLoaded;
                                $scope.formValues.specGroupParameters[row].uom = response.uom;
                            }
                        });
                    }, 1);
                }
                if (name == 'InheritDefault' && vm.screen_id == 'product') {
                    Factory_Master.get_master_entity($scope.formValues.parent.id, 'product', 'masters', (response) => {
                        if (response) {
                            $scope.formValues.defaultSpecGroup = response.defaultSpecGroup;
                        }
                    });
                }
                if (name == 'systemInstrument' && vm.screen_id == 'price') {
                    if ($scope.formValues.systemInstrument) {
                        Factory_Master.get_master_entity($scope.formValues.systemInstrument.id, 'systeminstrument', 'masters', (response) => {
                            if (response) {
                                $scope.formValues.marketInstrumentCode = response.marketInstrument.code;
                                $scope.formValues.code = response.marketInstrument.code;
                                $scope.formValues.period = null;
                                obj = [];
                                $.each(response.periods, (key, value) => {
                                    obj.push(value.period);
                                });
                                $scope.options.systemInstrumentPeriod = obj;
                            }
                        });
                    }
                }
                if (name == 'MarketInstrument' && vm.screen_id == 'systeminstrument') {
                    var param = {
                        app: vm.app_id,
                        screen: vm.screen_id,
                        MarketInstrument: eval("$scope.formValues." + id + ".id")
                    };
                    Factory_Master.get_custom_dropdown(param, (callback) => {
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
                if (name == 'formulaFlatPercentage' && vm.screen_id == 'formula') {
                    // set uom as null if formula changed and it's percentage
                    if (id != null) {
                        if (typeof $scope.formValues.complexFormulaQuoteLines[id].formulaFlatPercentage) {
                            if ($scope.formValues.complexFormulaQuoteLines[id].formulaFlatPercentage.id == 2) {
                                $scope.formValues.complexFormulaQuoteLines[id].uom = null;
                            }
                        }
                    }
                }
                if(name == 'transactionType' && vm.screen_id == 'documenttype') {
                    let filters = [
                        {
                            ColumnName: 'EmailTransactionTypeId',
                            Value: $scope.formValues.templates[id].transactionType.id
                        }
                    ];
                    var field = {
                        Name:`EmailTemplate_${ id}`,
                        Type:'lookup',
                        clc_id:'masters_documenttypetemplates',
                        filter: filters,
                        masterSource:'DocumentTypeTemplates'
                    };
                    vm.getOptions(field);
                }
            }
            if (name == 'DocumentType') {

                // clone formValues to $rootScope { liviu.m. }
                $rootScope.formValues = $scope.formValues;
            }
            if (vm.app_id == 'labs' && name == 'OrderID' && id == 'order') {
                vm.checkVerifiedDeliveryFromLabs('orderChange');
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
                Factory_Master.getDataTable(app, screen, id, data, (callback) => {
                    if (callback) {
                        $scope.dynamicTable[id] = callback;
                        if (obj == 'labTestResults') {
                            $scope.formValues.labTestResults = [];
                            $scope.formValues.labTestResults = callback;
                        } else if (obj == 'deliveryProducts') {
                            $scope.formValues.deliveryProducts[idx].qualityParameters = [];
                            angular.merge($scope.formValues.deliveryProducts[idx].qualityParameters, callback);
                        } else if (obj == 'sealNumber') {
                            $scope.formValues.labSealNumberInformation = [];
                            $scope.formValues.labSealNumberInformation = callback;
                        }
                        $scope.selectedReconProduct = null;
                    }
                });
            }
        };
        vm.useDisplayName = function(fieldName) {
            let displayNameList = [ 'invoiceStatus', 'ClaimType' ];
            let found = _.indexOf(displayNameList, fieldName);
            if(found < 0) {
                return false;
            }
            return true;
        };
        vm.getOptions = function(field, fromListsCache) {
            // Move this somewhere nice and warm

            var objectByString = function(obj, string) {
                if (string.includes('.')) {
                    return objectByString(obj[string.split('.', 1)], string.replace(`${string.split('.', 1) }.`, ''));
                }
                return obj[string];
            };
            if (!fromListsCache) {
                if (field == 'agreementType') {
                    field = { name: 'AgreementType' };
                }

                if (field) {
                    if (!$scope.options) {
                        $scope.options = [];
                    }

                    // setTimeout(function() {
                    if (field.Filter && typeof $scope.formValues != 'undefined') {
                        field.Filter.forEach((entry) => {
                            if (entry.ValueFrom == null) {
                                return;
                            }
                            let temp = 0;
                            try {
                                temp = _.get($scope, "formValues[" +  entry.ValueFrom.split(".").join("][") + "]");
                            } catch (error) {}
                            if (typeof temp == "undefined") {
                                temp = 0;
                            }
                            entry.Value = temp;
                        });
                    }
                    var retFunc = false;
                    if (field.Name == 'Product') {
                        $.each(field.Filter, (key, val) => {
                            if (val.ColumnName == 'OrderId') {
                                if (val.Value == 0) {
                                    retFunc = true;
                                }
                            }
                        });
                    }
                    if (retFunc) {
                        return;
                    }

                    let app_id = vm.app_id;
                    let screen_id = vm.screen_id;
                    if ($state.params.title == 'New Request' || $state.params.title == 'Edit Request') {
                        app_id = 'procurement';
                        screen_id = 'request';

                        if (field.Name == 'BunkerablePort') {
                            if (typeof field.filters != 'undefined' && field.filters != null) {
                                field.Filters = [
                                    {
                                        ColumnName: 'VesselId',
                                        Value: field.filters.name.id
                                    },
                                    {
                                        ColumnName: 'VesselVoyageDetailId',
                                        Value: null
                                    }
                                ];
                                delete field.filters;
                            }
                        }
                        if (field.Name == 'Buyer') {
                            if (typeof field.filters != 'undefined' && field.filters != null) {
                                field.Filters = [
                                    {
                                        ColumnName: 'VesselId',
                                        Value: field.filters.name.id
                                    },
                                    {
                                        ColumnName: 'VesselVoyageDetailId',
                                        Value: null
                                    }
                                ];
                                delete field.filters;
                            }
                        }
                    }

					if (field.Name == "DefaultSpecGroup" && vm.entity_id && vm.screen_id == "product" && vm.app_id == "masters") {
						field.Filters = [
                            {
                                ColumnName: 'ProductId',
                                Value: vm.entity_id
                            },
                        ];
					}

                    if (!$scope.optionsCache) {
                        $scope.optionsCache = {};
                    }

                    if (!(JSON.stringify($scope.optionsCache[field.Name]) == JSON.stringify(field))) {
                        $scope.optionsCache[field.Name] = JSON.stringify(field);
                        Factory_Master.get_master_list(app_id, screen_id, field, (callback) => {
                            if (callback) {

                                $scope.options[field.Name] = _.orderBy(callback, [item => item.name.toLowerCase()], ['asc']);
                                if (vm.app_id == 'masters' && vm.screen_id == 'vessel') {
                                    vm.checkSpecGroup(field);
                                }
                                if (vm.app_id == 'masters' && vm.screen_id == 'currency' && field.Name == 'CurrencyCode') {
                                    vm.getCurrencyCodeFiltered();
                                }
                                $scope.$watchGroup([ $scope.formValues, $scope.options ], () => {
                                    // $timeout(function() {
                                    var id;
                                    if (field.Type == 'textUOM') {
                                        id = `#${ field.Name}`;
                                    } else {
                                        id = `#${ field.masterSource }${field.Name}`;
                                    }
                                    if ($(id).data('val')) {
                                        $(id).val($(id).data('val'));
                                    }
                                    // }, 50);
                                });
                            }
                        });
                    }
                    // }, 1000)
                }
            } else {
                // get values from listsCache, put in options obj for specific dropdowns
                // get options for request status
                if (field.Name == 'etaFreezeStatus' && field.masterSource) {
                    $scope.options.etaFreezeStatus = angular.copy($scope.listsCache.RequestStatus);
                }
                if (field.Name == 'numberOfCounterpartiesToDisplay') {
                    $scope.options.numberOfCounterpartiesToDisplay = [];
                    $.each(vm.listsCache.ItemsToDisplay, (key, val) => {
                        $scope.options.numberOfCounterpartiesToDisplay.push(val.name);
                    });
                }
            }
        };
        $scope.$watchGroup(
            [ 'formValues.defaultFuelOilProduct', 'formValues.defaultDistillateProduct', 'formValues.defaultLsfoProduct' ],
            (newVal, oldVal) => {
            	if (vm.screen_id == "vessel") {
	                if ($scope.formValues.defaultFuelOilProduct == '' || $scope.formValues.defaultFuelOilProduct == null) {
	                    $scope.formValues.fuelOilSpecGroup = null;
	                }
	                if ($scope.formValues.defaultDistillateProduct == '' || $scope.formValues.defaultDistillateProduct == null) {
	                    $scope.formValues.distillateSpecGroup = null;
	                }
	                if ($scope.formValues.defaultLsfoProduct == '' || $scope.formValues.defaultLsfoProduct == null) {
	                    $scope.formValues.lsfoSpecGroup = null;
	                }
            	}
            },
            true
        );
        vm.checkSpecGroup = function(field) {
            let map = {
                FuelOilSpec: 'fuelOilSpecGroup',
                DistillateSpec: 'distillateSpecGroup',
                lsfoSpecGroup: 'lsfoSpecGroup'
            };
            if (typeof map[field.Name] == 'undefined') {
                return;
            }
            if (typeof $scope.options[field.Name] != 'undefined' && $scope.options[field.Name][0].id != -1 && typeof $scope.formValues != 'undefined' && typeof $scope.formValues[map[field.Name]] != 'undefined') {
                if ($scope.options[field.Name].length > 0) {
                    var found = false;
                    $.each($scope.options[field.Name], (key, val) => {
                        if (typeof val != 'undefined') {
                            if (val.id == $scope.formValues[map[field.Name]].id) {
                                found = true;
                            }
                        }
                    });
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
                if (typeof value.id != 'undefined') {
                    if (value.id == 0) {
                        $scope.formValues.contacts.splice(key, 1);
                    } else {
                        // fo call and if ok delete from ui too
                        let payload = {
                            app: 'masters',
                            screen: vm.screen_id,
                            delete_list: 'contacts',
                            data: {
                                id: value.id,
                                counterpartyId: vm.entity_id,
                                isDeleted: true
                            }
                        };
                        Factory_Master.deleteContact(payload, (response) => {
                            if (response.status) {
                                $scope.formValues.contacts.splice(key, 1);
                                toastr.success('Contact deleted!');
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
                    templateUrl: 'app-general-components/views/modal_confirmDeleteContact.html',
                    size: 'full',
                    appendTo: angular.element(document.getElementsByClassName('page-container')),
                    windowTopClass: 'fullWidthModal smallModal',
                    scope: $scope // passed current scope to the modal
                });
            }
        };
        vm.getClaimOptions = function(master, claimType) {
            $scope.claimsOptions = [];
            var order_product_id, lab_result_id, order_id;
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
            if ($scope.formValues.orderDetails && $scope.formValues.orderDetails.orderProductId) {
                order_product_id = $scope.formValues.orderDetails.orderProductId;
            } else {
                order_product_id = null;
            }
            var product_id = $scope.formValues.orderDetails.deliveryProductId;
            var field = {
                Name: master,
                Type: 'dropdown',
                masterSource: master
            };
            var claimTypeName = null;
            $.each(vm.listsCache.ClaimType, (k, v) => {
            	if (v.id == claimType) {
                    claimTypeName = v.name;
            	}
            });
            field.param = {
                OrderId: order_id,
                DeliveryProductId: product_id,
                OrderProductId: order_product_id,
                LabResultId: lab_result_id,
                ClaimTypeId: claimType,
                ClaimTypeName: claimTypeName
            };
            Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, (callback) => {
                if (callback) {
                    $scope.claimsOptions = callback;
                }
            });
            return $scope.claimsOptions;
        };


        vm.formatDate = function(elem, dateFormat) {
            if (elem) {
                var formattedDate = elem;
                var dateFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;
            	var hasDayOfWeek = false;
	            if (dateFormat.startsWith('DDD ')) {
	            	hasDayOfWeek = true;
	            	dateFormat = dateFormat.split('DDD ')[1];
	            }
                let date = Date.parse(elem);
                date = new Date(date);
                if (date) {
                    let utc = date.getTime() + date.getTimezoneOffset() * 60000;
                    // var utc = date.getTime();
                    if (dateFormat.name) {
                        dateFormat = dateFormat.name.replace(/d/g, 'D').replace(/y/g, 'Y');
                    } else {
                        dateFormat = dateFormat.replace(/d/g, 'D').replace(/y/g, 'Y');
                    }
                    formattedDate = fecha.format(utc, dateFormat);
                }
                if (hasDayOfWeek) {
                	formattedDate = `${moment(elem).format('ddd') } ${ formattedDate}`;
                }
                return formattedDate;
            }
        };
        $scope.toUTCDate = function(date) {
            let _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        };
        vm.formatDateTime = function(elem, dateFormat, fieldUniqueId) {
            if (elem) {
                var dateFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;
            	let hasDayOfWeek = false;
	            if (dateFormat.startsWith('DDD ')) {
	            	hasDayOfWeek = true;
	            	dateFormat = dateFormat.split('DDD ')[1];
	            }
                dateFormat = dateFormat.replace(/D/g, 'd').replace(/Y/g, 'y');
                if (typeof fieldUniqueId == 'undefined') {
                    fieldUniqueId = 'date';
                }
                if (fieldUniqueId == 'deliveryDate' && vm.app_id == 'recon') {
                    return vm.formatDate(elem, 'dd/MM/yyyy');
                }
                if (fieldUniqueId == 'invoiceDate' && vm.app_id == 'invoices') {
                    return vm.formatDate(elem, 'dd/MM/yyyy');
                }
                if (fieldUniqueId == 'resultDate' || fieldUniqueId == 'eta' || fieldUniqueId == 'orderDetails.eta' || fieldUniqueId == 'etb' || fieldUniqueId == 'etd' || fieldUniqueId.toLowerCase().indexOf('delivery') >= 0 || fieldUniqueId == 'pricingDate') {
                    //
                    // return moment.utc(elem).format($scope.tenantSetting.tenantFormatss.dateFormat.name);
                    var utcDate = moment.utc(elem).format();
                    formattedDate = $filter('date')(utcDate, dateFormat, 'UTC');
                    // return moment.utc(elem).format(dateFormat);
                } else {
                    formattedDate = $filter('date')(elem, dateFormat);
                }
                if (hasDayOfWeek) {
                	formattedDate = `${moment.utc(elem).format('ddd') } ${ formattedDate}`;
                }
                if (formattedDate.endsWith('00:00')) {
                	formattedDate = formattedDate.split('00:00')[0];
                }
                return formattedDate;
            }
        };

        vm.formatNumber = function(value) {
            if (value) {
                if (value != Math.floor(value)) {
                    return value.toString().split('.')[1].length == 1 ? value.toFixed(1) : value.toFixed(2);
                }
            }
            return !value ? 0 : value;
        }

        vm.formatSimpleDate = function(date) {
            var dateFormat = $scope.tenantSetting.tenantFormats.dateFormat.name;
            window.tenantFormatsDateFormat = dateFormat;
            let hasDayOfWeek = false;
            if (dateFormat.startsWith('DDD ')) {
            	hasDayOfWeek = true;
            	dateFormat = dateFormat.split('DDD ')[1];
            }
            var dateFormat = dateFormat.replace(/d/g, 'D').replace(/y/g, 'Y').split(' ')[0];
            if (date) {
            	dateFormatted = moment.utc(date).format(dateFormat);
                if (hasDayOfWeek) {
                	dateFormatted = `${moment.utc(date).format('ddd') } ${ dateFormatted}`;
                }
                return dateFormatted;
            }
            return;
        };
        vm.multiTagsContractProducts = function(object, idx, id, uniqueID) {
            setTimeout(() => {
                if (vm.app_id == 'contracts' && vm.screen_id == 'contract') {
                    var arrayHolder = 'products';
                }
                var elt = $(`.object_tagsinput_${ id}`),
                    elt_plus = $(`.object_tagsinput_add_${ id}`);
                elt.tagsinput({
                    itemValue: 'value',
                    itemText: 'text'
                });
                $.each(object, (index, value) => {
                    elt.tagsinput('add', {
                        value: value.id,
                        text: value.name
                    });
                });
                var elt = $(`.object_tagsinput_${ id}`),
                    elt_plus = $(`.object_tagsinput_add_${ id}`);
                elt.tagsinput({
                    itemValue: 'value',
                    itemText: 'text'
                });
                $.each($scope.formValues[arrayHolder], (index, value) => {
                    if (!value[uniqueID]) {
                        value[uniqueID] = [];
                    }
                });
                $.each($scope.formValues[arrayHolder][idx][uniqueID], (index, value) => {
                    elt.tagsinput('add', {
                        value: value.id,
                        text: value.name
                    });
                    hideTheChildren();
                });
                let added = [];
                elt_plus.on('click', () => {
                    let source = $(`[id=${ id }]`);
                    $.each($scope.formValues[arrayHolder][idx][uniqueID], (index, value) => {
                        if ($.inArray(value.id, added) == -1) {
                            added.push(value.id);
                        }
                    });
                    var objectToAdd = JSON.parse(source.attr('data-value'));
                    if ($.inArray(objectToAdd.id, added) == -1) {
                        $scope.formValues[arrayHolder][idx][uniqueID].push(objectToAdd);
                        elt.tagsinput('add', {
                            value: objectToAdd.id,
                            text: objectToAdd.name
                        });
                    } else {
                        toastr.error('Field is already added.');
                    }
                    hideTheChildren();
                });
                $(elt).on('itemRemoved', (event) => {
                    let idToRemove = event.item.value;
                    var indexRmv;
                    $.each($scope.formValues[arrayHolder][idx][uniqueID], (index, value) => {
                        if (value.id == idToRemove) {
                            indexRmv = index;
                        }
                    });
                    $scope.formValues[arrayHolder][idx][uniqueID].splice(indexRmv, 1);
                    added.splice(added.indexOf(idToRemove, 1));
                    hideTheChildren();
                    $('.tooltip').tooltip('hide');
                });

                function hideTheChildren() {
                    $scope.initBoostrapTagsInputTooltip();
                    var currentTags = elt.next('.bootstrap-tagsinput').children('.label');
                    currentTags.removeAttr('big-child');
                    currentTags.show();
                    currentTags.css('clear', 'none');
                    currentTags
                        .parent('.bootstrap-tagsinput')
                        .children('.hideTagsChild')
                        .remove();
                    $.each(currentTags, function(index, value) {
                        if (index > 2) {
                            $(this)
                                .parent('.bootstrap-tagsinput')
                                .addClass('expanded');
                            $(this)
                                .parents('.multi_lookup_tags')
                                .addClass('expanded');
                            if (index % 3 == 0) {
                                $(this).css('clear', 'both');
                            }
                            $(this).attr('big-child', 'true');
                        }
                    });
                    if (currentTags.length > 3 && !elt.next('.bootstrap-tagsinput').children('.hideTagsChild').length) {
                        currentTags.parent().prepend('<span class=\'hideTagsChild\'><i class=\'fa fa-ellipsis-h\' aria-hidden=\'true\'></i><span>');
                        $(`.hideTagsChild_${ id}`).css('float', 'right');
                    } else {
                        currentTags.parent('.bootstrap-tagsinput').removeClass('expanded');
                        currentTags.parents('.multi_lookup_tags').removeClass('expanded');
                    }
                }
            }, 50);
        };
        $scope.multiTags = function(id, idx, name) {
            let elt = $(`.object_tagsinput_${ id}`),
                elt_plus = $(`.object_tagsinput_add_${ id}`);
            elt.tagsinput({
                itemValue: 'value',
                itemText: 'text'
            });
            $(elt).on('itemAdded', (event) => {
                var index;
                if (id == 'agents') {
                    index = $scope.formValues[id].length - 1;
                    selectDefaultAgent(id, index);
                }
            });
            $(elt).on('itemRemoved', (event) => {
                let idToRemove = event.item.value;
                var comparator, indexRmv;
                // $.each($scope.formValues[id], (index, value) => {
                // });
                for (var index = $scope.formValues[id].length - 1; index >= 0; index--) {
                	value = $scope.formValues[id][index];

                    if (id == 'applications' && vm.screen_id == 'sellerrating') {
                        if (value.module.id == idToRemove) {
                            indexRmv = index;
                        }
                    } else {
                        indexRmv = null;
                        if (typeof value == 'undefined') {
                            return;
                        }
                        if (id == 'agents') {
                            comparator = 'counterpartyId';
                            if (value[comparator] == idToRemove) {
                                indexRmv = index;
                                $('*').tooltip('destroy');
                                if ($scope.formValues[id][index].id > 0) {
                                    $scope.formValues[id][index].isDeleted = true;
                                } else {
                                    $scope.formValues[id].splice(index, 1);
                                }
                            }
                        } else if (["locationProductTypes"].includes(id)) {
                            if (value.productType.id == idToRemove) {
                                indexRmv = index;
                                $('*').tooltip('destroy');
                                if ($scope.formValues[id][index].id > 0) {
	                                    $scope.formValues[id][index].isDeleted = true;
                                } else {
                                    $scope.formValues[id].splice(index, 1);
                                }
                                $scope.$apply();
                            }
                        } else if (["locationHSFO05Grades","locationDistillateGrades","locationHSFO35Grades"].includes(id)) {
                            if (value.product.id == idToRemove) {
                                indexRmv = index;
                                // $timeout(()=>{
	                                $('*').tooltip('destroy');
	                                if ($scope.formValues[id][index]) {
		                                if ($scope.formValues[id][index].id > 0) {
		                                    $scope.formValues[id][index].isDeleted = true;
		                                } else {
		                                    $scope.formValues[id][index].isDeleted = true;
		                                    $scope.formValues[id].splice(index, 1);
		                                }
	                                }
	                                $scope.$apply();
                                // })
                            }
                        } else {
                            comparator = 'id';
                            if (value[comparator] == idToRemove) {
                                indexRmv = index;
                                $scope.formValues[id].splice(index, 1);
                            }
                        }
                    }
                } // end for
                if (window.location.href.indexOf('masters/specparameter') != -1 && id == 'claimTypes') {
                    $scope.checkAutoSaveClaimCheckbox();
                }

                hideTheChildren();
            });
            elt_plus.on('click', () => {
                var selector;
                if (idx >= 0) {
                    selector = id + idx;
                } else {
                    selector = id;
                }
                if ($(`#${ selector}`).attr('data-value') != '') {
                    let itemToAdd = {};
                    if (id == 'agents') {
                        $.each($scope.options.Agents, (index, value) => {
                            if ($('#agentsVal').val() == value.id) {
                                itemToAdd = {
                                    counterpartyId: value.id,
                                    counterpartyName: value.name,
                                    id: 0,
                                    isDefault: false
                                };
                            }
                        });
                    } else {
                        $.each($scope.options[name], (index, value) => {
                            var selectorElement = $(`#${ selector }:not([data-value^="{{"])`);
                            if (selectorElement.attr('data-value') == value.id) {
                                itemToAdd = {
                                    id: value.id,
                                    name: value.name
                                };
                            }
                        });
                    }
                    if ($scope.formValues[id] == '' || !$scope.formValues[id]) {
                        $scope.formValues[id] = [];
                        if (id == 'agents' && itemToAdd) {
                            $scope.formValues[id].push(itemToAdd);
                            elt.tagsinput('add', {
                                value: itemToAdd.counterpartyId,
                                text: itemToAdd.counterpartyName
                            });
                        } else if (id == 'applications' && vm.screen_id == 'sellerrating') {
                            $scope.formValues.applications.push({
                                module: {
                                    id: itemToAdd.id,
                                    name: itemToAdd.name
                                }
                            });
                            elt.tagsinput('add', {
                                value: itemToAdd.id,
                                text: itemToAdd.name
                            });
                        } else if (id == 'allowedCompanies' && vm.screen_id == 'contract') {
                            if (itemToAdd.id != $scope.formValues.company.id) {
                                $scope.formValues[id].push(itemToAdd);
                                itemToAdd.name = vm.decodeHtml(itemToAdd.name) ? angular.copy(vm.decodeHtml(itemToAdd.name)) : itemToAdd.name;
                                // $scope.formValues[id].push('asdaskdnqw');
                                elt.tagsinput('add', {
                                    value: itemToAdd.id,
                                    text: itemToAdd.name
                                });
                            } else {
                            	$('.toast').remove();
                                toastr.error('This is main company');
                            }
                        }
                    } else {
                        let added = [];
                        if (id == 'agents') {
                            $.each($scope.formValues.agents, (index, value) => {
                                added.push(value.counterpartyId);
                            });
                            if ($.inArray(itemToAdd.counterpartyId, added) == -1 && itemToAdd.id >= 0) {
                                $scope.formValues.agents.push(itemToAdd);
                                elt.tagsinput('add', {
                                    value: itemToAdd.counterpartyId,
                                    text: itemToAdd.counterpartyName
                                });
                            }
                        } else if (id == 'applications' && vm.screen_id == 'sellerrating') {
                            $.each($scope.formValues.applications, (index, value) => {
                                added.push(value.module.id);
                            });
                            if ($.inArray(itemToAdd.id, added) == -1) {
                                $scope.formValues.applications.push({
                                    module: {
                                        id: itemToAdd.id,
                                        name: itemToAdd.name
                                    }
                                });
                                elt.tagsinput('add', {
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
	                if (id == 'agents') {
	                    $.each(values, function(index, value) {
	                        if (!value.isDeleted || value.isDeleted == false) {
	                            value.counterpartyName = vm.decodeHtml(value.counterpartyName) ? angular.copy(vm.decodeHtml(value.counterpartyName)) : value.counterpartyName;
	                            if (index > 2) {
	                                $(this).hide();
	                            }
	                            elt.tagsinput('add', {
	                                value: value.counterpartyId,
	                                text: value.counterpartyName
	                            });
	                            selectDefaultAgent(id, index);
	                        }
	                    });
	                } else if (id == "locationProductTypes") {
	                    $.each(values, function(index, value) {
	                        if (index > 2) {
	                            $(this).hide();
	                        }
	                        if (!value.isDeleted) {
		                        elt.tagsinput('add', {
		                            value: value.productType.id,
		                            text: value.productType.name
		                        });
	                        }
	                    });
	                    $scope.initMultiTags(id);
	                } else if (["locationHSFO05Grades","locationDistillateGrades","locationHSFO35Grades"].includes(id)) {
	                    $.each(values, function(index, value) {
	                        if (index > 2) {
	                            $(this).hide();
	                        }
	                        if (!value.isDeleted) {
		                        elt.tagsinput('add', {
		                            value: value.product.id,
		                            text: value.product.name
		                        });
	                        }
	                    });
	                    $scope.initMultiTags(id);
	                }else {
	                    $.each(values, function(index, value) {
	                        value.name = vm.decodeHtml(value.name) ? angular.copy(vm.decodeHtml(value.name)) : value.name;
	                        if (index > 2) {
	                            $(this).hide();
	                        }
	                         elt.tagsinput('add', {
	                            value: value.id,
	                             text: value.name
	                         });
	                    });
	                    $scope.initMultiTags(id);
	                }
            }
            hideTheChildren();

            function hideTheChildren() {
            	$scope.initBoostrapTagsInputTooltip();
                currentTags = elt.next('.bootstrap-tagsinput').children('.label');
                currentTags.removeAttr('big-child');
                currentTags.css("display", "block");
                currentTags.css('clear', 'none');
                currentTags
                    .parent('.bootstrap-tagsinput')
                    .children('.hideTagsChild')
                    .remove();
                $.each(currentTags, function(index, value) {
                    if (index > 2) {
                        $(this)
                            .parent('.bootstrap-tagsinput')
                            .addClass('expanded');
                        $(this)
                            .parents('.multi_lookup_tags')
                            .addClass('expanded');
                        if (index % 3 == 0) {
                            $(this).css('clear', 'both');
                        }
                        $(this).attr('big-child', 'true');
                    }
                });
                if (currentTags.length > 3 && !elt.next('.bootstrap-tagsinput').children('.hideTagsChild').length) {
                    currentTags.parent().prepend('<span class=\'hideTagsChild\'><i class=\'fa fa-ellipsis-h\' aria-hidden=\'true\'></i><span>');
                    $(`.hideTagsChild_${ id}`).css('float', 'right');
                } else {
                    currentTags.parent('.bootstrap-tagsinput').removeClass('expanded');
                    currentTags.parents('.multi_lookup_tags').removeClass('expanded');
                }
            }

            function selectDefaultAgent(id, index, e) {
                $(`.tagsFor${ id } .bootstrap-tagsinput .tag`)
                    .last()
                    .append(`<input class="defaulttag "  type="checkbox"  name="defaulttag[]" ng-model="formValues.agents[${ index }].isDefault">`);
                $compile($('.defaulttag'))($scope);
                return;
            }

        };
        $scope.initMultiTags = function(id) {
            let elt = $(`.object_tagsinput_${ id}`);
            elt.tagsinput({
                itemValue: 'value',
                itemText: 'text'
            });
            elt.tagsinput('removeAll');
            if (vm.screen_id == 'sellerrating') {
                var values = $scope.formValues[id];
                values = [];
                $.each($scope.formValues[id], (index, value) => {
                    values.push(value.module);
                });
            } else {
                var values = $scope.formValues[id];
            }
            $.each(values, (index, value) => {
            	if (id == "locationProductTypes") {
                	if (!value.isDeleted) {
		                elt.tagsinput('add', {
		                    value: value.productType.id,
		                    text: value.productType.name
		                });
                	}
                } else if (["locationHSFO05Grades","locationDistillateGrades","locationHSFO35Grades"].includes(id)) {
                	if (!value.isDeleted) {
		                elt.tagsinput('add', {
		                    value: value.product.id,
		                    text: value.product.name
		                });
                	}
                } else {
	                elt.tagsinput('add', {
	                    value: value.id,
	                    text: value.name
	                });
                }
            });
            hideTheChildren();

            function hideTheChildren() {
                currentTags = elt.next('.bootstrap-tagsinput').children('.label');
                currentTags.removeAttr('big-child');
                currentTags.show();
                currentTags.css('clear', 'none');
                currentTags
                    .parent('.bootstrap-tagsinput')
                    .children('.hideTagsChild')
                    .remove();
                $.each(currentTags, function(index, value) {
                    if (index > 2) {
                        $(this)
                            .parent('.bootstrap-tagsinput')
                            .addClass('expanded');
                        $(this)
                            .parents('.multi_lookup_tags')
                            .addClass('expanded');
                        if (index % 3 == 0) {
                            $(this).css('clear', 'both');
                        }
                        $(this).attr('big-child', 'true');
                    }
                });
                if (currentTags.length > 3 && !elt.next('.bootstrap-tagsinput').children('.hideTagsChild').length) {
                    currentTags.parent().prepend('<span class=\'hideTagsChild\'><i class=\'fa fa-ellipsis-h\' aria-hidden=\'true\'></i><span>');
                    $(`.hideTagsChild_${ id}`).css('float', 'right');
                } else {
                    currentTags.parent('.bootstrap-tagsinput').removeClass('expanded');
                    currentTags.parents('.multi_lookup_tags').removeClass('expanded');
                }
                setTimeout(() => {
                    $('.bootstrap-tagsinput')
                        .children('span.tag[big-child=\'true\']')
                        .hide();
                    $('.bootstrap-tagsinput').removeClass('expanded');
                    $('.multi_lookup_tags').removeClass('expanded');
                }, 1);
            }
        };
        $scope.addTagToMulti = function(model, data) {
        	if (vm.app_id == 'masters' && vm.screen_id == 'location') {
           		if (["locationProductTypes","locationHSFO05Grades","locationDistillateGrades","locationHSFO35Grades"].includes(model) ) {
        			$scope.addTagToMultiInLocationMaster(model, data);
        			return;
        		}
        	}
            vm.plusClickedMultilookup = true;
            var alreadyAdded = false;
            if (!$scope.formValues[model] || typeof $scope.formValues[model] == 'undefined') {
                $scope.formValues[model] = [];
            }
            if (model != '' && typeof $scope.formValues[model] != 'undefined') {
                $.each($scope.formValues[model], (k, v) => {
                    if (v.id == data.id) {
                        alreadyAdded = true;
                    }
                });
            }
            if (alreadyAdded == true) {
                toastr.error('Field is already added!');
            } else {
                $scope.formValues[model].push(data);
                if (window.location.href.indexOf('masters/specparameter') != -1 && model == 'claimTypes') {
                    $scope.checkAutoSaveClaimCheckbox();
                }
                setTimeout(() => {
                    $scope.initBoostrapTagsInputTooltip();
                });
            }
        };

        $scope.checkAutoSaveClaimCheckbox = function() {
            let claimTypeList = $listsCache.ClaimType;
            let isAutoSaveClaimDisabled = true;
            for (let i = 0; i < $scope.formValues.claimTypes.length; i++) {
                let claimType = $scope.formValues.claimTypes[i];
                let findClaimTypeWithAutoSaveClaimChecked = _.filter(claimTypeList, function(object) {
                    return object.id == claimType.id && object.databaseValue == 1;
                });
                if (findClaimTypeWithAutoSaveClaimChecked && findClaimTypeWithAutoSaveClaimChecked.length) {
                    isAutoSaveClaimDisabled = false;
                    break;
                }
            }

            $scope.formValues.isAutoSaveClaimDisabled = isAutoSaveClaimDisabled;
            if (isAutoSaveClaimDisabled) {
                $scope.formValues.autoSaveClaim = false;
                $scope.$digest();
            }


        }

        $scope.addTagToMultiInLocationMaster = (model, data) => {
            vm.plusClickedMultilookup = true;
            var alreadyAdded = false;
            if (!$scope.formValues[model] || typeof $scope.formValues[model] == 'undefined') {
                $scope.formValues[model] = [];
            }
            if (model != '' && typeof $scope.formValues[model] != 'undefined') {
            	if (model == "locationProductTypes") {
	                $.each($scope.formValues[model], (k, v) => {
	                    if (v.productType.id == data.id) {
	                    	if (v.isDeleted) {
	                    		v.isDeleted = false;
	                    		return false;
	                    	}
	                        alreadyAdded = true;
	                    }
	                });
            	} else if (["locationHSFO05Grades","locationDistillateGrades","locationHSFO35Grades"].includes(model)) {
            		$.each($scope.formValues[model], (k, v) => {
            			if (v.product.id == data.id) {
            				if (v.isDeleted) {
            					v.isDeleted = false;
            					return false;
            				}
            				alreadyAdded = true;
            			}
            		});
	            }
            }
            if (alreadyAdded == true) {
                toastr.error('Field is already added!');
            } else {
            	if (model == "locationProductTypes") {
	            	modeledData = {
	            		"productType" : data,
	            		"id" : 0,
	            		"name" : data.name
	            	}
            	} else if (["locationHSFO05Grades","locationDistillateGrades","locationHSFO35Grades"].includes(model)) {
            		if (model == "locationHSFO05Grades") {
            			productGrade = 2;
            		}
            		if (model == "locationDistillateGrades") {
            			productGrade = 1;
            		}
            		if (model == "locationHSFO35Grades") {
            			productGrade = 3;
            		}
	            	modeledData = {
	            		"product" : data,
	            		"productGrade" : {"id":productGrade},
	            		"location" : {"id":vm.entity_id},
	            		"id" : 0,
	            		"name" : data.name
	            	}
            	}
                $scope.formValues[model].push(modeledData);
                setTimeout(() => {
                    $scope.initBoostrapTagsInputTooltip();
                });
            }
        }

        vm.initDropZone = function(id) {
            $timeout(() => {
                Dropzone.autoDiscover = false;
                // or disable for specific dropzone:
                $(() => {
                    // Now that the DOM is fully loaded, create the dropzone, and setup the
                    // event listeners
                    let myDropzone = new Dropzone(`#${ id}`, {
                        url: '#'
                    });
                    myDropzone.on('addedfile', function(file) {
                        if (id == 'general_information_upload') {
                            $(`#${ id } input`).val(file.name);
                        }
                        // Create the remove button
                        let removeButton = Dropzone.createElement('<a href=\'javascript:;\'\' class=\'btn red btn-sm btn-block\'>Remove</a>');
                        // Capture the Dropzone instance as closure.
                        let _this = this;
                        // Listen to the click event
                        removeButton.addEventListener('click', (e) => {
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
            var elementsArray = elements.split(', ');
            let t = 0; // the height of the highest element (after the function runs)
            let t_elem; // the highest element (after the function runs)
            $timeout(() => {
                $.each(elementsArray, function(index, value) {
                    if ($(value).innerHeight() > t) {
                        t_elem = this;
                        t = parseFloat($(value).outerHeight() - 25);
                    }
                });
                $.each(elementsArray, (index, value) => {
                    $(`${value } .portlet`).css('minHeight', t);
                });
            }, 500);
        };
        vm.equalizeColumnsHeightGrouped = function(element, group) {
            var groupElements = group.split(', ');
            $timeout(() => {
                let groupHeight = 0;
                let groupMargin = 0;
                $.each(groupElements, (index, value) => {
                    if ($(value).length > 0) {
                        groupHeight = groupHeight + parseFloat($(value).outerHeight());
                        groupMargin = groupMargin + parseFloat($(`${value } .portlet`).css('margin-bottom'));
                    }
                });
                var calcHeight = parseFloat(groupHeight - 10);
                $(`${element } .portlet`).css('height', calcHeight);
                $(`${element } .portlet`).css('overflow', 'auto');
            }, 1000);

        };
        vm.cloneEntity = function(group, obj) {
            if (obj) {
                var new_obj = angular.copy(obj);
                new_obj.id = 0;
                new_obj.isActive = true;
                $scope.formValues[group].push(new_obj);
            } else {
                let index = Object.keys($scope.formValues[group]).length;
                $scope.formValues[group][index] = new Object();
            }
        };
        vm.addCounterpartyContact = function() {
            $scope.formValues.contacts.push({
                isActive: true
            });
            //
        };
        vm.addVesselContact = function() {
            $scope.formValues.contacts.push({
                isActive: true,
                id: 0
            });
            //
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
                    $scope.formValues.pricingScheduleOptionSpecificDate.dates[key].isDeleted = true;
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
                } else if (emptyArray) {
                    $scope.formValues.products[productId].additionalCosts = [];
                } else {
                    $scope.formValues.products[productId].additionalCosts[key] = {};
                }
            } else {
                $scope.formValues.products[productId].additionalCosts[key].isDeleted = true;
                if (key == 0) {
                    // $scope.formValues.products[productId].additionalCosts.push({});
                }
            }
        };
        $scope.current_field = {};
        let createNewField = function() {
            return {
                Active: true
            };
        };
        $scope.initBoostrapTagsInputTooltip = function() {
        	if ($('.bootstrap-tagsinput .tag').length == 0) {
        		return;
        	}
            $('.bootstrap-tagsinput .tag').each(function(k, v) {
                if ($(v).is(':visible') && !$(v).hasClass('tooltip')) {
                    $(this).attr('tooltip', '');
                    $(this).attr('data-original-title', $(v).text());
                    $(v).tooltip();
                }
            });
        };
        $scope.addElement = function(ele, idx) {
            $scope.current_field.Active = false;
            let returnKey = [];
            let addedFields = [];
            $.each($scope.formFields, (key, info) => {
                returnKey.push(info.children);
            });
            $.each(returnKey, (keys, infos) => {
                $.each(infos, (key, info) => {
                    addedFields.push(info.Unique_ID);
                });
            });

            if ($.inArray(ele.Unique_ID, addedFields) >= 0) {
                toastr.error('Field is already added. Please clone it!');
                return;
            }

            $scope.current_field = createNewField();
            $scope.activeField(ele);
            angular.merge($scope.current_field, ele);
            var group = $scope.current_field.Group;
            let new_group_id = Object.keys($scope.formFields).length;
            if (!group) {
                group = `custom_group${ new_group_id}`;
            }
            if (typeof $scope.formFields[group] == 'undefined') {
                $scope.formFields[group] = {
                    id: group,
                    name: group,
                    children: []
                };
            }
            if (typeof idx == 'undefined') {
                if (Object.keys($scope.formFields).indexOf($scope.current_field.Group) < 0) {
                    $scope.formFields[group].id = $scope.current_field.Group.replace(' ', '_');
                    $scope.formFields[group].name = $scope.current_field.Group;
                    $scope.formFields[group].children.push($scope.current_field);
                } else {
                    $scope.formFields[group].children.push($scope.current_field);
                }
            } else {
                var group = $scope.current_field.Group;
                $scope.formFields[group].splice(idx, 0, $scope.current_field);
                $('#fieldSettingTab_lnk').tab('show');
            }
        };

        $scope.activeField = function(f) {
            $scope.current_field.Active = false;
            f.Active = false;
            $scope.current_field = f;
            f.Active = true;
            $('#fieldSettingTab_lnk').tab('show');
        };
        $scope.activeGroup = function(g) {
            $scope.current_group = g;
            $scope.current_group.Active = true;
            $('#groupSettingTab_lnk').tab('show');
        };
        $scope.changeGroup = function() {
            let new_group = $scope.current_field.Group;
            let newField = angular.copy($scope.current_field);
            newField.Cloned = true;
            $scope.formFields[$.trim(new_group)].children.push(newField);
        };
        $scope.removeElement = function(parent, idx, unique_id) {
            $scope.formFields[parent].children[idx].Added = false;
            if ($scope.formFields[parent].children[idx].Active) {
                $('#addFieldTab_lnk').tab('show');
                $scope.current_field = {};
            }
            $scope.formFields[parent].children.splice(idx, 1);
            if ($scope.formFields[parent].children.length < 1) {
                delete $scope.formFields[parent];
            }
            toastr.success('Field deleted');
        };
        $scope.formbuilderSortableOpts = {
            'ui-floating': true,
            'connectWith': 'ul'
        };
        $scope.formbuilderSortableGroups = {
            'ui-floating': true,
            'connectWith': '.formbuilder-group'
        };
        if ($state.current.name && $state.current.name != 'default.group-of-requests') {
	        // setTimeout(function() {
	        //     var hideableFields = $('.fe_entity:not([data-dependent=""])');
	        //     $.each(hideableFields, function() {
	        //         if ($(this).parents("#accordion1").length < 1) {
	        //             $(this).hide();
	        //         }
	        //     });
	        //     var dataDependent = [];
	        //     $(hideableFields).each(function() {
	        //         dataDependent.push($(this).attr("data-dependent"));
	        //     });
	        //     dataDependent = $.unique(dataDependent);
	        //     $.each(dataDependent, function(key, value) {
	        //         if ($("input[type='radio'][name*=" + value + "]")) {
	        //             selectedRadioVal = $("input[type='radio'][name*=" + value + "]:checked").val();
	        //             fieldstoShow = $('.fe_entity[data-dependent="' + value + '"][data-show*="' + selectedRadioVal + '"]');
	        //             fieldstoShow.show();
	        //         }
	        //     });
	        // }, 50);
        }

        $scope.checkIfTab = function() {
            $scope.$watch('formFields', () => {
                $timeout(() => {
                    var tab = $('.grp_unit')
                        .children('.tab-pane')
                        .first()
                        .addClass('active in');
                    $('#tabs_navigation')
                        .insertBefore(tab)
                        .removeClass('hidden');
                    $('#tabs_navigation ul li')
                        .first()
                        .addClass('active');
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

        vm.loadShiptechLite = function() {

            if ($rootScope.adminConfiguration) {
                vm.shiptechLite = $rootScope.adminConfiguration.general.shiptechLite;
            }
        };

        // vm.load_eef_config = function(structure) {
        //     $scope.formFields = structure;
        // };
        // -- data tables masterSource $scope lists --
        //
        // -- {end} data tables masterSource $scope lists --
        // -- Additional Costs SELECT
        if ($listsCache.AdditionalCost) {
            $scope.additionalCostsList = $listsCache.AdditionalCost;
        }
        // -- Additional Costs SELECT
        $scope.getKeysCount = function(obj) {
            var count = Object.keys(obj).length;
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
            Factory_Master.exchangeRate(param, (callback) => {
                // callback = '1.5';
                if (callback) {
                    var initial_val = $(`#${ parent}`).val();
                    var updated_val = initial_val * callback;
                    $(`#${ parent}`).val(updated_val);
                }
            });
        };
        $scope.isVisible = function(id) {
            return $(`#${ id}`).is(':visible');
        };
        $scope.isParentVisible = function(id) {
            return $(`#${ id}`).parent().is(':visible');
        };
        $scope.fVal = function(id) {
            return $scope;
        };
        $scope.returnSelectName = function(id) {
            return $.trim($(`#${ id } option:selected`).text());
        };
        $scope.showTab = function(id) {
            setTimeout(() => {
                $(`.nav-tabs a[href="${ id }"]`)
                    .tab('show')
                    .trigger('click');
            }, 1);
        };
        $scope.removeSchedule = function(elem) {
            $scope.formValues[elem] = {};
        };
        $scope.addSchedule = function(elem) {
            if ($scope.formValues[elem].id > 0 && $scope.formValues[elem].isDeleted == false) {
                toastr.error('Schedule already added');
            } else if ($scope.formValues[elem].id > 0) {
                $scope.formValues[elem].isDeleted = false;
            } else {
                $scope.formValues[elem].id = 0;
            }
        };

        $scope.setScope = function(notes, status) {
            $scope.formValues.notes = notes;
            if (status) {
                $scope.formValues.status = {};
                $scope.formValues.status = status;
            }
        }

        $scope.$watch('formValues.notes', function(scope){
            var generalNotesScope = angular.element($('.grid_generalNotes')).scope();
            if (generalNotesScope && generalNotesScope.formValues) {
                $rootScope.notes = generalNotesScope.formValues.notes;
            }
        }, true);

        $scope.addData = function(obj) {
            obj = eval("$scope." + obj);
            obj.push({
                id: 0
            });
            if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
                $.each(obj, (key, val) => {
                    if (val.id == 0) {
                        if (typeof val.createdBy == 'undefined') {
                            val.createdBy = $rootScope.user;
                            // val.createdBy.displayName = null;
                            val.createdBy.code = null;
                            val.createdBy.collectionName = null;
                        }
                        if (typeof val.createdOn == 'undefined') {
                            val.createdOn = moment().format();
                        }
                    }
                });
            }
            if (vm.app_id == 'default' && (window.location.href.indexOf('request') != -1 || window.location.href.indexOf('order') != -1)) {
                $.each(obj, (key, val) => {
                    if (val.id == 0) {
                        if (typeof val.createdBy == 'undefined') {
                            val.createdBy = $rootScope.user;
                            // val.createdBy.displayName = null;
                            val.createdBy.code = null;
                            val.createdBy.collectionName = null;
                        }
                        if (typeof val.createdAt == 'undefined') {
                            val.createdAt = moment().format();
                        }
                    }
                });
            }
            if (vm.app_id == 'labs' && vm.screen_id == 'labresult') {
                $.each(obj, (key, val) => {
                    if (val.id == 0) {
                        if (typeof val.createdBy == 'undefined') {
                            val.createdBy = $rootScope.user;
                            // val.createdBy.displayName = null;
                            val.createdBy.code = null;
                            val.createdBy.collectionName = null;
                        }
                        if (typeof val.createdAt == 'undefined') {
                            val.createdAt = moment().format();
                        }
                    }
                });
            }
        };
        $scope.remData = function(obj, row, idx) {
            let autoSave = false;
            if (obj == "formValues.notes") {
                autoSave = true;
            }
            obj = eval("$scope." + obj);
            index = obj.indexOf(row);
            length = 0;
            $.each(Object.values(obj), (key, val) => {
                if (!val.isDeleted) {
                    length++;
                }
            });
            if (vm.screen_id == 'invoice' && vm.app_id == 'invoices') {
            	if ($scope.formValues.status) {
	                if ($scope.formValues.status.name == 'Approved') {
	                	if (obj[idx].id) {
		                    toastr.info('You cannot delete product if invoice status is Approved');
		                    return;
	                	}
	                }
            	}
                if (vm.entity_id) {
                	 $scope.sweetConfirm('Are you sure you want to delete this item?', (response) => {
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
                } else if (row.id > 0 || !row.id) {
	                    row.isDeleted = true;
	                } else {
	                    // row.isDeleted = true;
	                    obj.splice(index, 1);
	                }
                return;
            }


            if (length > 1) {
                if (row.id > 0) {
                    row.isDeleted = true;
                } else {
                    obj.splice(index, 1);
                }
            } else if (row.id > 0) {
                row.isDeleted = true;
                if(vm.app_id !== 'claims' && vm.screen_id !== 'claims') {
                    if (vm.app_id == 'default' && (window.location.href.indexOf('request') != -1 || window.location.href.indexOf('order') != -1) || (vm.app_id == 'labs' && vm.screen_id == 'labresult')) {
                    } else {
                        obj.push({
                            id: 0
                        });
                    }
                }

            } else {
                obj.splice(index, 1);
            }
            if (autoSave) {
                $scope.autoSaveNotes(obj);
            }
        };
        $scope.showRow = function(row, grid) {
            if (angular.equals(grid.options.data, 'formValues.periods')) {
                return true;
            }
            return !row.isDeleted;
        };
        $scope.setDefaultValue = function(id, val) {
            $timeout(() => {
                $(`#${ id}`)
                    .val(val)
                    .trigger('change');
            }, 10);
        };
        vm.enableMultiSelect = function(id, fromLabel, toLabel) {
            $timeout(() => {
                $(`#${ id}`).multiSelect({
                    selectableHeader: `<div class='custom-header'>${ fromLabel }</div>`,
                    selectionHeader: `<div class='custom-header'>${ toLabel }</div>`
                });
                $(`#${ id}`)
                    .parents('.multiSelectSwitch')
                    .find('.ms-selectable')
                    .append('<span class="switches"><span>&gt;&gt;</span><span>&lt;&lt;</span></span>');
            }, 100);
        };
        $scope.mapLocation = function(name, id) {
            var val = $(`[name= "${ name }"]`).val();
            Factory_Master.get_master_entity(val, 'location', 'masters', (response) => {
                if (response) {
                    var newSysInst = [];
                    var i = 0;
                    $.each($scope.formValues.productsSystemInstruments, (key, kval) => {
                        if (!kval.canBeDeleted && kval.id > 0 || typeof kval.canBeDeleted === 'undefined' && kval.id == 0) {
                            newSysInst[key] = kval;
                            i++;
                        }
                    });
                    $.each(response.productsSystemInstruments, (key, kval1) => {
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
            if (typeof $scope.selectedRows == 'undefined') {
                $scope.selectedRows = [];
            }
            var selId = row.entity.id;
            if ($scope.selectedRows.indexOf(selId) == -1) {
                $scope.selectedRows.push(selId);
            } else {
                $scope.selectedRows.splice($scope.selectedRows.indexOf(selId), 1);
            }
        };
        $scope.clickUpload = function() {
            setTimeout(() => {
                angular.element('#fileUpload').trigger('click');
                angular.element('#FTPFileUpload').trigger('click');
            }, 1);
        };
        $scope.uploadFiles = function(file) {
            if ($state.params.entity_id > 0) {
                var file;
                if ($rootScope.droppedDoc) {
                    file = $rootScope.droppedDoc;
                } else {
                    if ($('#fileUpload')[0].files[0]) {
                        file = $('#fileUpload')[0].files[0];
                    }
                }
                let formData = new FormData();
                formData.append('request', `{"Payload":{"Id":${ $state.params.entity_id}}}`);
                formData.append('file', file);

                Factory_Master.upload_file(formData, (callback) => {
                    if (callback) {
                        toastr.success(callback);
                        $state.reload();
                    }
                });
            } else {
                toastr.error('You must save company first');
            }
        };
        $scope.$watch('formValues', (data) => {

            $rootScope.formValues = data;
	    	if (vm.entity_id == '') {
	          	if (vm.app_id === 'masters' && vm.screen_id === 'service') {
	          		if (!$scope.formValues.hsfoUom) {
		                $scope.formValues.hsfoUom = $scope.tenantSetting.tenantFormats.uom;
	          		}
	          		if (!$scope.formValues.dmaUom) {
		                $scope.formValues.dmaUom = $scope.tenantSetting.tenantFormats.uom;
	          		}
	          		if (!$scope.formValues.lsfoUom) {
		                $scope.formValues.lsfoUom = $scope.tenantSetting.tenantFormats.uom;
	          		}
	            }
	    	}
        });
        $rootScope.droppedDoc = null;
        $scope.dropDocument = function(file) {
            $rootScope.droppedDoc = file;
            $scope.droppedDoc = $rootScope.droppedDoc;
            if (window.location.href.indexOf("masters/price") != -1 ) { return; }
            if ($scope.formValues.documentType) {
                if ($scope.formValues.documentType.name != '') {
                    $rootScope.formValues.documentType = $scope.formValues.documentType;
                    $scope.uploadDocument('#fileUpload');
                }
            } else {
                toastr.warning('Please select a Document Type and upload the file again');
                $rootScope.droppedDoc = null;
                $scope.droppedDoc = null;
            }
        };
        $scope.uploadDocument = function(selector) {
            let data = {
                request: {
                    Payload: {
                        name: 'File2',
                        documentType: {}, // { "id":1, "name":"BDN","code":"","collectionName":null } (dinamic)
                        size: 100,
                        fileType: 'FileType',
                        transactionType: {}, // {"id":1,"name":"Request","code":"","collectionName":null} (dinamic)
                        fileId: 1,
                        uploadedBy: {
                            id: 1,
                            name: 'Admin',
                            code: '',
                            collectionName: null
                        },
                        uploadedOn: '2017-01-11T14:21:37.96',
                        notes: '',
                        isVerified: false,
                        referenceNo: 1,
                        createdBy: {
                            id: 1,
                            name: 'Admin',
                            code: '',
                            collectionName: null
                        },
                        createdOn: '2017-01-11T14:21:37.96',
                        lastModifiedByUser: null,
                        lastModifiedOn: null,
                        id: 0,
                        isDeleted: false
                    }
                },
                file: {}
            };
            let FD = new FormData();
            // set data

            if($state.params.screen_id == 'documenttype') {
                $rootScope.formValues.documentType = {
                    id: $state.params.entity_id
                };
            }
            var documentTypeScope = angular.element($('.form_input_DocumentType')).scope();
            $rootScope.formValues.documentType = documentTypeScope.formValues.documentType;
            data.request.Payload.documentType = $rootScope.formValues.documentType;
            data.request.Payload.isVerified = false; // default false
            if (!$rootScope.formValues.documentType) {
                toastr.error('Please fill in required fields: Document Type.');
                return false;
            }
            // isVerified = false
            // if ($rootScope.formValues.isVerified) {
	        //     if ($rootScope.formValues.isVerified.name == "Yes") {isVerified = true}
	        // 	if ($rootScope.formValues.isVerified.name != "Yes") {isVerified = false}
            // }
            let verifiedRequired = {
                'default.view-request-documents': true,
                'default.view-order-documents': true,
                'default.view-group-of-requests-documents': true,
                'delivery.documents': true,
                'labs.documents': true,
                'claims.documents': true,
                'invoices.documents': true,
                'contracts.documents': true,
                'masters.documents': true
            };
            let requiredFields = [];


            if (!$rootScope.formValues.documentType) {
                requiredFields.push('Document Type');
            }
            if(verifiedRequired[$state.current.name] && requiredFields.length) {
                let error = 'Please fill in required fields: ';
                $.each(requiredFields, (key, val) => {
                    error = `${error }${val },`;
                });
                error = error.slice(0, -1);
                toastr.error(error);
                return false;
            }
            // if (!$rootScope.formValues.documentType || !$rootScope.formValues.isVerified) {
            // 	toastr.error("Please fill in required fields");
            // 	return false;
            // }
            data.request.Payload.referenceNo = $state.params.entity_id;
            if ($state.params.requestId) {
                data.request.Payload.referenceNo = $state.params.requestId;
            }


            let transactionType = {
                id: 0,
                name: 'undefined',
                code: '',
                collectionName: null
            };
            let appPath = $state.current.name;
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
                transactionType.name = 'Request';
            }
            if (appPath.match(/offer/)) {
                transactionType.id = 2;
                transactionType.name = 'Offer';
            }
            if (appPath.match(/view-order-documents/)) {
                transactionType.id = 3;
                transactionType.name = 'Order';
            }
            if (appPath.match(/delivery/)) {
                transactionType.id = 4;
                transactionType.name = 'Delivery';
            }
            if (appPath.match(/invoices/)) {
                transactionType.id = 5;
                transactionType.name = 'Invoice';
            }
            if (appPath.match(/labs/)) {
                transactionType.id = 6;
                transactionType.name = 'Labs';
            }
            if (appPath.match(/claims/)) {
                transactionType.id = 7;
                transactionType.name = 'Claims';
            }
            if (appPath.match(/masters/)) {
                transactionType.id = 8;
                transactionType.name = 'Masters';
            }
            if (appPath.match(/contracts/)) {
                transactionType.id = 9;
                transactionType.name = 'Contract';
            }
            // if (appPath.match(/view-group-of-requests-documents/)) {
            //     transactionType.id = 1;
            //     transactionType.name = "Request";
            // }
            if (appPath.match(/default.view-group-of-requests-documents/)) {
                transactionType.id = 2;
                transactionType.name = 'Offer';
            }


            // master screens transaction types
            let screenTransactionTypeMap = {
                additionalcost:     { id: 13, name: 'AdditionalCosts' },
                agreementtype:        { id: 14, name: 'AgreementTypes' },
                barge:         { id: 15, name: 'Barges' },
                buyer:        { id: 16, name: 'Buyers' },
                calendar:        { id: 17, name: 'Calendars' },
                claimtype:       { id: 18, name: 'ClaimTypes' },
                contacttype: { id: 20, name: 'ContactTypes' },
                company:     { id: 19, name: 'Companies' },
                pool:     { id: 19, name: 'Companies' },
                counterparty:    { id: 21, name: 'Counterparties' },
                country:        { id: 22, name: 'Countries' },
                deliveryoption:      { id: 23, name: 'DeliveryOptions' },
                event:       { id: 25, name: 'Events' },
                exchangerate:     { id: 26, name: 'ExchangeRates' },
                formula:         { id: 27, name: 'Formulas' },
                incoterms:        { id: 28, name: 'Incoterms' },
                location:        { id: 29, name: 'Locations' },
                paymentterm:      { id: 31, name: 'PaymentTerms' },
                period:        { id: 32, name: 'Periods' },
                price:         { id: 33, name: 'Prices' },
                pricetype:   { id: 34, name: 'MarketPriceTypes' },
                product:    { id: 35, name: 'Products' },
                service:   { id: 36, name: 'Services' },
                operator:  { id: 36, name: 'Services' },
                specgroup:        { id: 37, name: 'SpecGroups' },
                specparameter:    { id: 38, name: 'SpecParameters' },
                status:         { id: 39, name: 'Statuses' },
                strategy:         { id: 40, name: 'Strategies' },
                systeminstrument:         { id: 41, name: 'SystemInstruments' },
                uom:    { id: 42, name: 'Uoms' },
                vessel:        { id: 43, name: 'Vessels' },
                vesseltype:        { id: 44, name: 'VesselTypes' },
                currency:         { id: 45, name: 'Currencies' }
            };


            // "documenttype":     {"id": 24, "name": "DocumentTypes"},
            if(screenTransactionTypeMap[$state.params.screen_id]) {
                transactionType = screenTransactionTypeMap[$state.params.screen_id];
            }


            // finally set transaction type
            data.request.Payload.transactionType = transactionType;
            var file;
            if($state.current.name == 'masters.documents' && $state.params.screen_id == 'documenttype') {
                // for master documenttype (only with documents upload) set referenceNo to a big number
                data.request.Payload.referenceNo = Number.MAX_SAFE_INTEGER;

                // set document type to current document type (if uploading from document type)
                // data.request.Payload.documentType = {
                //     "id": $state.params.entity_id
                // }

                // se trasaction type from list
                Factory_Master.get_master_entity(vm.entity_id, vm.screen_id, vm.app_id, (callback) => {
                    if (callback) {
                        if(typeof $scope.temp == 'undefined') {
                            $scope.temp = {};
                        }
                        $scope.temp.formValues = angular.copy(callback);

                        let transactionTypes = [];

                        $.each($scope.temp.formValues.templates, (key, val) => {
                            let transactionType = {
                                id: val.transactionType.id,
                                name: val.transactionType.name,
                                code: '',
                                collectionName: null
                            };
                            transactionTypes.push(transactionType);
                        });

                        // make call for each transaction type in edit
                        $scope.upload_success = 0;
                        $.each(transactionTypes, (key, val) => {
                            data.request.Payload.transactionType = angular.copy(val);
                            var file;
                            if ($rootScope.droppedDoc) {
                                file = $rootScope.droppedDoc;
                            } else {
                                file = $(selector)[0].files[0];
                            }
                            FD.append('file', file);
                            // add file
                            FD.append('request', JSON.stringify(data.request));
                            Factory_Master.upload_document(FD, (callback) => {
                                if (callback) {
                                    toastr.success('Document saved!');
                                    $scope.upload_success++;
                                    // $state.reload();
                                    // $('.ui-jqgrid-btable').trigger('reloadGrid');
                                } else {
                                    toastr.error('Upload error');
                                    // $state.reload();
                                }
                            });
                        });

                        $scope.$watch('upload_success', () => {
                            if($scope.upload_success == transactionTypes.length) {
                                $state.reload();
                            }
                        });
                    }
                });
            }else{
                if ($rootScope.droppedDoc) {
                    file = $rootScope.droppedDoc;
                } else {
                    file = $(selector)[0].files[0];
                }
                FD.append('file', file);
                // add file
                FD.append('request', JSON.stringify(data.request));
                Factory_Master.upload_document(FD, (callback) => {
                    if (callback) {
                        toastr.success('Document saved!');
                        $state.reload();
                        // $('.ui-jqgrid-btable').trigger('reloadGrid');
                        // location.reload();
                    } else {
                        toastr.error('Upload error');
                        $state.reload();
                        // location.reload();
                    }
                });
            }
        };
        $scope.dropDocumentFile = function(name, id, file) {
            Factory_Master.newSchedule(data, (response) => {});
        };
        // download document using XHR - { liviu m. }
        $scope.downloadDocument = function(rowId, docName, content) {
            var payload = {
                "id": rowId,
                "name": docName
            }
            Factory_Master.get_document_file(
                {
                    Payload: payload
                },
                (file, mime) => {
                    if (file.data) {
                        let blob = new Blob([ file.data ], {
                            type: mime
                        });
                        let a = document.createElement('a');
                        a.style = 'display: none';
                        document.body.appendChild(a);
                        // Create a DOMString representing the blob and point the link element towards it
                        let url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = docName;
                        // programatically click the link to trigger the download
                        a.click();
                        // release the reference to the file by revoking the Object URL
                        window.URL.revokeObjectURL(url);
                    }
                }
            );
        };
        $scope.getLogo = function(name) {
            if ($state.params.entity_id > 0) {
                Factory_Master.get_file($state.params.entity_id, (callback, mime) => {
                    if (callback) {
                        $scope.image = [];
                        $scope.image[name] = {};
                        let binary = '';
                        let bytes = new Uint8Array(callback);
                        let len = bytes.byteLength;
                        for (let i = 0; i < len; i++) {
                            binary = binary + String.fromCharCode(bytes[i]);
                        }
                        $scope.image[name].stream = window.btoa(binary);
                        $scope.image[name].type = mime;
                    }
                });
            }
        };
        $scope.arrayBufferToBase64 = function(buffer) {
            let binary = '';
            let bytes = new Uint8Array(buffer);
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary = binary + String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        };
        $scope.flattenArray = function(obj, find, name) {
            $scope.flattened = {};
            $scope.flattened[name] = [];
            $.each(obj, (key, val) => {
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
            var id = element.clc;
            var object = element.source;
            var formvalue = element.formvalue;
            var idx = element.idx;
            var field_name = element.field_name;
            let CLC = $(`#modal_${ id } table.ui-jqgrid-btable`);
            let rowId = CLC.jqGrid('getGridParam', 'selrow');
            let rowData = CLC.jqGrid.Ascensys.gridObject.rows[rowId - 1];

            $scope.selected_value = {};
            let transaction_type = '';
            let transactionstobeinvoiced_dtRow = '';
            let toastr_msg = '';
            if (element.screen == 'contactlist') {
                $scope.selected_value = rowData;
            } else if (element.screen == 'transactionstobeinvoiced') {
                $scope.addTransactionsInInvoice(element);
                return false;
            } else if (element.screen == 'orders') {
                $scope.selected_value = {
                    id: rowData.order.id,
                    name: rowData.order.name
                };
            } else if (element.screen == 'formulalist' && vm.app_id == 'contracts') {
                $scope.selected_value = {
                    id: rowData.id,
                    name: rowData.name,
                    isContractReference: rowData.isContractReference
                };
            }
            else if (element.screen == 'bunkerableport' && vm.app_id == 'default') {
                $scope.selected_value = angular.copy(rowData);
                // id from row data is order in table, actual locationId is in rowData.locationId
                if (!angular.equals($scope.selected_value, {})) {
                    $scope.selected_value.id = $scope.selected_value.locationId;
                }
            } else if (element.screen == 'destinationport' && vm.app_id == 'default') {
                $scope.selected_value = angular.copy(rowData);
                if (!angular.equals($scope.selected_value, {})) {
                    $scope.selected_value.id = $scope.selected_value.locationId;
                }
            } else if (element.screen == 'rfqrequestslist' && vm.app_id == 'default') {
                $scope.selected_value = angular.copy(rowData);
                if (!angular.equals($scope.selected_value, {})) {
                    $scope.selected_value.id = $scope.selected_value.requestId;
                }
            } else if (element.screen == 'productcontractlist' && vm.app_id == 'default') {
                $scope.selected_value = angular.copy(rowData);
                if (!angular.equals($scope.selected_value, {})) {
                    $scope.selected_value.id = $scope.selected_value.contractProductId;
                }
            } else if (element.screen == 'requestcounterpartytypes' && vm.app_id == 'default') {
                $scope.selected_value = angular.copy(rowData);
            } else if(element.screen == 'contractlist' && vm.app_id == 'default') {
                $scope.selected_value = angular.copy(rowData);
            } else if(element.clc == 'entity_documents' && element.source == 'availableDocumentAttachments') {
                if (element.screen == 'entity_documents') {
                    $timeout(() => {
                        rowData.isIncludedInMail = true;
                        $scope.addToAttachments(rowData);
                    });
                } else {
                    $timeout(() => {
                        $rootScope.$broadcast('selectDocumentAttachment', rowData);
                    });
                }
                $scope.prettyCloseModal();
                $('*').tooltip('destroy');
                return;
            } else {
                $.each(rowData, (key, val) => {
                    if (key == 'id' || key == 'name' || key == 'code' || key == 'displayName') {
                        $scope.selected_value[key] = val;
                    }
                });
            }

            // if (element.screen == 'locationlist'  && vm.app_id == 'default'){
            //     $scope.portValuechange(rowData);
            // }
            if (angular.equals($scope.selected_value, {})) {
                toastr.error('Please select one row');
                return;
            }
            if (transaction_type == 'delivery') {
                element.source = 'formValues.productDetails';
                toastr_msg = 'Delivery added';
            }
            if (transaction_type == 'cost') {
                element.source = 'formValues.costDetails';
                toastr_msg = 'Cost added';
            }
            // Check if modal triggered from datatable
            if (!formvalue) {
                if (vm.app_id == 'invoices' && element.name != 'Physical Supplier') {
                    check = $scope[element.source];
                    if (Array.isArray(check)) {
                        $scope.target_element = `${element.source }.${ check.length}`;
                        element.source = `${element.source }.${ check.length}`;
                    } else {
                        $scope.target_element = element.source;
                    }
                } else {
                    $scope.target_element = element.source;
                }
                var elements = element.source.split('.');
            } else {
                $scope.target_element = element.source;
                elements = formvalue.split('.');
                elements.push(idx);
                if (object.indexOf('[') > -1) {
                    object = object.replace('[', '.');
                    object = object.replace(']', '');
                    object = object.split('.');
                    $.each(object, (key, val) => {
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
                if (element.screen == 'productlist' && element.name == 'Product' && element.app == 'masters') {
                    let productIndex = element.source.split('.')[2];
                    if(elements[1]=='locationProducts'){
                        $scope.addLocationProductToConversion(productIndex, null, true);
                    }else{
                        $scope.addProductToConversion(productIndex, null, true);
                    }

                }
                  if (element.screen == 'rfqrequestslist') {
                	$scope.selected_value = [];
                    var rowsData = CLC.jqGrid('getGridParam', 'selarrrow');
                	$.each(rowsData, (k, v) => {
	                	$scope.selected_value.push(CLC.jqGrid.Ascensys.gridObject.rows[v - 1]);
                	});
                }
                $rootScope.$broadcast('dataListModal', { val: $scope.selected_value, elem: elements });
            } else if ($scope.grid) {
	                $scope.assignObjValue($scope.grid.appScope.fVal(), elements, $scope.selected_value);
            	} else {
	                $scope.assignObjValue($scope, elements, $scope.selected_value);
            	}
            if (transaction_type == 'delivery' || transaction_type == 'cost') {
                toastr.success(toastr_msg);
            }
            // } else {
            //     if (transaction_type == 'delivery' || transaction_type == 'cost') {
            //         toastr.error('Delivery already exists');
            //     }
            // }
            $scope.prettyCloseModal();
            $('*').tooltip('destroy');
            $scope.triggerChangeFields(field_name, elements[1]);
        };




        $scope.assignObjValue = function(obj, keyPath, value) {
            var lastKeyIndex = keyPath.length - 1;
            for (let i = 0; i < lastKeyIndex; ++i) {
                var key = keyPath[i];
                var next_key = keyPath[i + 1];
                if (typeof next_key === 'number') {
                    if (!(key in obj)) {
                        obj[key] = [];
                    }
                } else if (!(key in obj)) {
                    obj[key] = {};
                }
                if (obj[key] == null) {
                    obj[key] = {};
                }
                obj = obj[key];
            }
            obj[keyPath[lastKeyIndex]] = value;
        };

        $scope.assignObjValue_tankproduct = function(idx,value){
            $scope.formValues.vesselProducts[idx].product = value;
        }

        $scope.addnewTankDetail = function(index){
            var newItem ={
                'vessel':$scope.formValues.vesselProducts[index].vessel,
                'vesselProduct':{
                    id:$scope.formValues.vesselProducts? $scope.formValues.vesselProducts[index].id:0
                },
                'isDeleted': false,
                'isActive': true,
                'createdBy':$rootScope.user,
                'clientIpAddress': null,
                'lastModifiedByUser': null,
                'lastModifiedOn': null,
                'modulePathUrl': null,
                'userAction': null,
                'createdOn': moment().format()
            }
            if($scope.formValues.vesselProducts[index].vesselProductTanks)
                $scope.formValues.vesselProducts[index].vesselProductTanks.push(newItem);
            else
                $scope.formValues.vesselProducts[index]['vesselProductTanks']=([newItem]);
        }
        ///shouldn't be allowed to select the same product type twice
        $scope.addVesselProductType=function(key,productTypeId){
            for(var i=0; $scope.formValues.vesselProducts.length>i;i++){
                if(!$scope.formValues.vesselProducts[i].isDeleted && key!=i)
                {
                    var vesselProduct=$scope.formValues.vesselProducts[i];
                    if (vesselProduct.productType.id == productTypeId.id && vesselProduct.density !=undefined  ) {
                        $scope.formValues.vesselProducts[key].productType=null;
                        return toastr.error('Selected productType already exists');;
                    }
                }
            }
        }
        $scope.addnewTankProduct = function(index){
            var newItem ={
                'clientIpAddress': null,
                'createdBy':$rootScope.user,
                'isDeleted': false,
                'lastModifiedByUser': null,
                'lastModifiedOn': null,
                'modulePathUrl': null,
                'userAction': null,
                'createdOn': moment().format(),
                'vessel':{
                    'clientIpAddress':  $scope.formValues.clientIpAddress,
                    'code': $scope.formValues.code,
                    'collectionName': $scope.formValues.collectionName,
                    'customNonMandatoryAttribute1': $scope.formValues.customNonMandatoryAttribute1,
                    'displayName': $scope.formValues.displayName,
                    'id': $scope.formValues.id,
                    'internalName': $scope.formValues.internalName,
                    'isDeleted': $scope.formValues.isDeleted,
                    'modulePathUrl': $scope.formValues.modulePathUrl,
                    'name': $scope.formValues.name,
                    'userAction': $scope.formValues.userAction
                }
            }
            if($scope.formValues.vesselProducts)
                $scope.formValues.vesselProducts.push(newItem);
            else
                $scope.formValues['vesselProducts']=[(newItem)];
            // $scope.formValues.vesselProducts.push(newItem);
            $scope.addnewTankDetail( $scope.formValues.vesselProducts.length-1);
        }

        $scope.addnewTradebookItem = function (isNew){
            var newItem = {
                location:null,
                productType:null,
                product:null
            }
            if(isNew && !vm.entity_id){
                $scope.formValues.tradeBookMappings = [];
                $scope.formValues['tradeBookMappings'].push(newItem);
            }
            else if(!isNew){
                if($scope.formValues['tradeBookMappings'] == null){
                    $scope.formValues.tradeBookMappings = [];
                    $scope.formValues['tradeBookMappings'].push(newItem);
                }
                else
                    $scope.formValues['tradeBookMappings'].push(newItem);
            }
        }

        $scope.initInvoiceTypeOptions = function() {
	        vm.getOptions({
	            Name: 'DocumentTypeEnum',
	            Type: 'dropdown',
	            masterSource: 'DocumentTypeEnum'
	        });
	        $('#newInvoiceType').find('option').remove();
	        if (!$scope.options) {
	            $scope.options = [];
	        }
	        // vm.listsCache['DocumentTypeEnum'];
	        $($('[name=\'newInvoiceType\']').parent().parent()[1]).hide();
	        $('#newInvoiceType').append($('<option>', {
	            value: '',
	            text: ''
	        }));
	        $.each(vm.listsCache.DocumentTypeEnum, (k, v) => {
                if(v.internalName != 'PreclaimCreditNote' && v.internalName != 'PreclaimDebitNote') {
                    $('#newInvoiceType').append($('<option>', {
                        // value: v.name,
                        value: v.internalName,
                        internalName: `${v.internalName }`,
                        text: `${v.name }`
                    }));
                }
	        });
	    };

        $scope.addTransactionsInInvoice = function(element) {
            var id = element.clc;
            var object = element.source;
            var formvalue = element.formvalue;
            var idx = element.idx;
            var field_name = element.field_name;
            let CLC = $(`#modal_${ id } table.ui-jqgrid-btable`);
            let rowId = CLC.jqGrid('getGridParam', 'selrow');
            let rowData = CLC.jqGrid.Ascensys.gridObject.rows[rowId - 1];
            var selectedRows = [];
            $.each(CLC.jqGrid.Ascensys.selectedProductIds, (k1, v1) => {
                $.each(CLC.jqGrid.Ascensys.gridObject.rows, (k2, v2) => {
                    if (v1 == v2.deliveryProductId) {
                        selectedRows.push(v2);
                    }
                });
            });
            var orderAdditionalCostId = [];
            $.each(CLC.jqGrid.Ascensys.selectedOrderAdditionalCostId, (k1, v1) => {
                $.each(CLC.jqGrid.Ascensys.gridObject.rows, (k2, v2) => {
                    if (v1 == v2.orderAdditionalCostId) {
                        orderAdditionalCostId.push(v2);
                    }
                });
            });

            var mixedRows = selectedRows.concat(orderAdditionalCostId);

            $.each(mixedRows, (k, rowData) => {
                if (rowData.costName) {
                    var transaction_type = 'cost';
                	rowData.product.productId = rowData.product.id;
                    // rowData.product.id = rowData.deliveryProductId;
                    var transactionstobeinvoiced_dtRow = {
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
                        // new on 30.08.2018
                        invoiceQuantityUom: rowData.invoiceQuantityUom,
                        invoiceRateUom: rowData.invoiceRateUom,
                        estimatedExtras: rowData.estimatedExtra,
                        // invoiceExtras: rowData.estimatedExtra,
                        estimatedExtrasAmount: rowData.estimatedExtraAmount
                    };
                }
                if (rowData.delivery) {
                	rowData.product.productId = angular.copy(rowData.product.id);
                    transactionstobeinvoiced_dtRow = {
                        amountInInvoice: '',
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
                        difference: '',
                        estimatedAmount: rowData.estimatedAmount,
                        estimatedAmountCurrency: rowData.estimatedRateCurrency,
                        estimatedRate: rowData.estimatedRate,
                        estimatedRateCurrency: rowData.estimatedRateCurrency,
                        invoiceAmount: '',
                        invoiceAmountCurrency: {},
                        invoiceQuantity: '',
                        invoiceQuantityUom: {},
                        invoiceRate: '',
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
                            name: 'Matched',
                            code: '',
                            collectionName: null
                        }
                    };
                }
                if (rowData.costName) {
                    var alreadyExists = false;
                    $.each($scope.formValues.costDetails, (idx, val) => {
                        if (rowData.orderAdditionalCostId == val.orderAdditionalCostId) {
                            alreadyExists = true;
                        }
                    });
                    if (!alreadyExists) {
                        $scope.formValues.costDetails.push(transactionstobeinvoiced_dtRow);
                    } else {
                        toastr.error('Selected cost already exists');
                    }
                }
                if (rowData.delivery) {
                    alreadyExists = false;
                    $.each($scope.formValues.productDetails, (idx, val) => {
                        if (rowData.deliveryProductId == val.deliveryProductId && !val.isDeleted) {
                            alreadyExists = true;
                        }
                    });
                    if (!alreadyExists) {
                    	transactionstobeinvoiced_dtRow.invoiceQuantity = transactionstobeinvoiced_dtRow.deliveryQuantity;
                    	transactionstobeinvoiced_dtRow.invoiceQuantityUom = transactionstobeinvoiced_dtRow.deliveryQuantityUom;
                        $scope.formValues.productDetails.push(transactionstobeinvoiced_dtRow);
                    } else {
                        toastr.error('Selected product already exists');
                    }
                }
            });
            $scope.modalInstance.close();
        };

        /* SELLER RATING MODAL*/
        $scope.getSellerRating = function() {
            if (!$scope.sellerRating) {
                Factory_Master.get_seller_rating(vm.app_id, vm.screen_id, vm.entity_id, (response) => {
                    if (response) {
                        $scope.sellerRating = response;
                    }
                });
            }
        };
        $scope.createSellerRating = function() {
            $scope.modalInstance.close();
            Factory_Master.create_seller_rating(vm.app_id, vm.screen_id, $scope.sellerRating, (response) => {
                if (response) {
                    if (response.status == true) {
                        if (vm.app_id == 'default') {
                            $scope.sellerRatingScreen('Procurement', 'Procurement', $state.params.orderId);
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
            $.each($scope.sellerRating.categories, (key, value) => {
                $.each(value.details, (key1, value1) => {
                    value1.rating = 0;
                    $scope.discardRating = true;
                });
            });
        };

        /* SELLER RATING MODAL*/
        /* SET RESET PASSWORD*/
        $scope.validateAndSetPassword = function(pass1, pass2) {
            if (typeof pass1 && typeof pass2 != 'undefined') {
                if (pass1 == pass2) {
                    $scope.formValues.password = pass1;
                    toastr.success('Password was set');
                    $scope.modalInstance.close();
                } else {
                    toastr.error('The passwords do not match!');
                }
            } else {
                toastr.error('Please fill the password fields');
            }
        };
        $scope.validateAndChangePassword = function(pass1, pass2) {
            if (typeof pass1 && typeof pass2 != 'undefined') {
                if (pass1 == pass2) {
                    data = {
                        userId: $scope.formValues.id,
                        password: pass1
                    };
                    Factory_Master.change_password(data, (response) => {
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
                    toastr.error('The passwords do not match!');
                }
            } else {
                toastr.error('Please fill the password fields');
            }
        };
        $scope.cancelSetPassword = function() {
            $scope.formValues.password = null;
            $scope.prettyCloseModal();
        };

        /* END SET RESET PASSWORD*/
        // TREASURY REPORT ----
        $scope.treasury_generate_report = function() {
            let UIFilters = {};
            let treasurySummaryFilters = [];

            let sellerOperator = 1;
            let brokerOperator = 1;
            let companyOperator = 1;
            let paymentStatusOperator = 1;
            let paymentDateOperator = 1;

            var newFilterItem = null;
            for (let i = $rootScope.rawFilters.length - 1; i >= 0; i--) {
            	if ($rootScope.rawFilters[i].fromTreasurySummary) {
	            	$rootScope.rawFilters.splice(i, 1);
            	} else {
            		if ($rootScope.rawFilters[i].column.columnValue == 'Seller_Name') {
            			sellerOperator = 2;
            		}
            		if ($rootScope.rawFilters[i].column.columnValue == 'Broker_Name') {
            			brokerOperator = 2;
            		}
            		if ($rootScope.rawFilters[i].column.columnValue == 'PaymentCompany_Name') {
            			companyOperator = 2;
            		}
            		if ($rootScope.rawFilters[i].column.columnValue == 'PaymentStatus_Name') {
            			paymentStatusOperator = 2;
            		}
            		if ($rootScope.rawFilters[i].column.columnValue == 'PaymentDate') {
            			paymentDateOperator = 2;
            		}
            	}
            }

            $.each($scope.formValues.SellerWithInactive, (sk, sv) => {
            	if (sv.id) {
            		newFilterItem = {
					    column: {
					        columnRoute: 'invoices/treasuryreport',
					        columnName: 'Seller',
					        columnValue: 'Seller_Name',
					        sortColumnValue: null,
					        columnType: 'Text',
					        isComputedColumn: false
					    },
					    condition: {
					        conditionName: 'Is equal',
					        conditionValue: '=',
					        conditionApplicable: 'Text',
					        conditionNrOfValues: 1
					    },
					    filterOperator: sk == 0 ? sellerOperator : 2,
					    value: {
					        0: sv.name
					    },
					    unSaved: false,
					    fromTreasurySummary: true,
                    };
            		treasurySummaryFilters.push(newFilterItem);
            	}
            });
            $.each($scope.formValues.BrokerWithInactive, (bk, bv) => {
            	if (bv.id) {
            		newFilterItem = {
					    column: {
					        columnRoute: 'invoices/treasuryreport',
					        columnName: 'Broker',
					        columnValue: 'Broker_Name',
					        sortColumnValue: null,
					        columnType: 'Text',
					        isComputedColumn: false
					    },
					    condition: {
					        conditionName: 'Is equal',
					        conditionValue: '=',
					        conditionApplicable: 'Text',
					        conditionNrOfValues: 1
					    },
					    filterOperator: bk == 0 ? brokerOperator : 2,
					    value: {
					        0: bv.name
					    },
					    unSaved: false,
					    fromTreasurySummary: true,
                    };
            		treasurySummaryFilters.push(newFilterItem);
            	}
            });
            $.each($scope.formValues.CompanyWithInactive, (ck, cv) => {
            	if (cv.id) {
            		newFilterItem = {
					    column: {
					        columnRoute: 'invoices/treasuryreport',
					        columnName: 'PaymentCompany',
					        columnValue: 'PaymentCompany_Name',
					        sortColumnValue: null,
					        columnType: 'Text',
					        isComputedColumn: false
					    },
					    condition: {
					        conditionName: 'Is equal',
					        conditionValue: '=',
					        conditionApplicable: 'Text',
					        conditionNrOfValues: 1
					    },
					    filterOperator: ck == 0 ? companyOperator : 2,
					    value: {
					        0: cv.name
					    },
					    unSaved: false,
					    fromTreasurySummary: true,
                    };
            		treasurySummaryFilters.push(newFilterItem);
            	}
            });
        	if ($scope.formValues.PaymentStatus) {
        		newFilterItem = {
					    column: {
					        columnRoute: 'invoices/treasuryreport',
					        columnName: 'PaymentStatus',
					        columnValue: 'PaymentStatus_Name',
					        sortColumnValue: null,
					        columnType: 'Text',
					        isComputedColumn: false
					    },
					    condition: {
					        conditionName: 'Is equal',
					        conditionValue: '=',
					        conditionApplicable: 'Text',
					        conditionNrOfValues: 1
					    },
					    filterOperator: paymentStatusOperator,
					    value: {
					        0: $scope.formValues.PaymentStatus.name
					    },
					    unSaved: false,
					    fromTreasurySummary: true,
                };
        		treasurySummaryFilters.push(newFilterItem);
        	}

            if ($scope.formValues.PaymentDateFrom && $scope.formValues.PaymentDateTo) {
                newFilterItem = {
				    column: {
				        columnRoute: 'invoices/treasuryreport',
				        columnName: 'Payment Date',
				        columnValue: 'PaymentDate',
				        sortColumnValue: null,
				        columnType: 'DateOnly',
				        isComputedColumn: true
				    },
				    condition: {
				        conditionName: 'Is between',
				        conditionValue: 'between',
				        conditionApplicable: 'Date',
				        conditionNrOfValues: 2
				    },
				    filterOperator: paymentDateOperator,
				    value: {
				        0: $scope.formValues.PaymentDateFrom,
				        1: $scope.formValues.PaymentDateTo
				    },
				    unSaved: false,
				    fromTreasurySummary: true,
                };
        		treasurySummaryFilters.push(newFilterItem);
            } else if ($scope.formValues.PaymentDateFrom) {
            	newFilterItem = {
				    column: {
				        columnRoute: 'invoices/treasuryreport',
				        columnName: 'Payment Date',
				        columnValue: 'PaymentDate',
				        sortColumnValue: null,
				        columnType: 'DateOnly',
				        isComputedColumn: true
				    },
				    condition: {
				        conditionName: 'Is after or equal to',
				        conditionValue: '>=',
				        conditionApplicable: 'Date',
				        conditionNrOfValues: 1
				    },
				    filterOperator: paymentDateOperator,
				    value: {
				        0: $scope.formValues.PaymentDateFrom
				    },
				    unSaved: false,
				    fromTreasurySummary: true,
                };
        		treasurySummaryFilters.push(newFilterItem);
            } else if ($scope.formValues.PaymentDateTo) {
            	newFilterItem = {
				    column: {
				        columnRoute: 'invoices/treasuryreport',
				        columnName: 'Payment Date',
				        columnValue: 'PaymentDate',
				        sortColumnValue: null,
				        columnType: 'DateOnly',
				        isComputedColumn: true
				    },
				    condition: {
				        conditionName: 'Is before or equal to',
				        conditionValue: '<=',
				        conditionApplicable: 'Date',
				        conditionNrOfValues: 1
				    },
				    filterOperator: paymentDateOperator,
				    value: {
				        0: $scope.formValues.PaymentDateTo
				    },
				    unSaved: false,
				    fromTreasurySummary: true,
                };
        		treasurySummaryFilters.push(newFilterItem);
            }
            $.each(treasurySummaryFilters, (k, v) => {
            	$rootScope.rawFilters.push(v);
            });
            treasurySummaryFilters = angular.copy($rootScope.rawFilters);


        	$rootScope.$broadcast('treasurySummaryFilters', treasurySummaryFilters);
            // $("#" + Elements.settings[Object.keys(Elements.settings)[0]].table).jqGrid.table_config.on_ui_filter(UIFilters);
        };

        $scope.go_report_cashflow = function() {
            window.open('#/reports/cashflow', '_blank');
        };


        $scope.treasury_clear_report = function() {
        	$timeout(() => {
        		$('input[ng-model="dummyModel"]').val('');
        		$('.bootstrap-tagsinput span.label').remove();
        		// $('.date-picker-icon').next("input").val("");

        		// try refresh datepicker
                // $('[ng-model="formValues.PaymentDateFrom"]').parent().find("input").val("").trigger("change");
                // $('[ng-model="formValues.PaymentDateTo"]').parent().find("input").val("").trigger("change");
        		if ($('[ng-model="formValues.PaymentDateFrom"]').next('.datePickerDayOfWeek')) {
	        		$('[ng-model="formValues.PaymentDateFrom"]').next('.datePickerDayOfWeek').text('');
        		}
        		if ($('[ng-model="formValues.PaymentDateTo"]').next('.datePickerDayOfWeek')) {
	        		$('[ng-model="formValues.PaymentDateTo"]').next('.datePickerDayOfWeek').text('');
        		}
        		// try refresh datepicker
        		$('[ng-model="formValues.PaymentDateFrom"]').parent().find('input').val('');
                $('[ng-model="formValues.PaymentDateTo"]').parent().find('input').val('');
                $scope.formValues.PaymentStatus = null;
                $scope.formValues.PaymentDateFrom = null;
                $scope.formValues.SellerWithInactive = null;
                $scope.formValues.BrokerWithInactive = null;
                $scope.formValues.CompanyWithInactive = null;
                $scope.formValues.PaymentDateTo = null;
        	});
        };


        /* DELIVERY*/
        $scope.setQualityMatch = function(bdn, survey, min, max) {
            /**
             * Changed function in order to work with new delivery params. For labs bdn= labs value; survey = min value; min = max value. For delivery params are as described
             */
            if (vm.app_id == 'labs') {
                // labVal = bdn; labMin = survey; labMax = min;
                // if(typeof(labVal) != 'number'){
                //     if(typeof(labVal) == 'string'){
                //         labVal = parseFloat(labVal);
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
                if (typeof bdn == 'string' && bdn == '' || bdn == null) {
                    return;
                }
                if (isNaN(bdn)) {
                    return;
                }
                if (isNaN(survey)) {
                    return;
                }
                if (bdn < survey && survey != null) {
                    return 2;
                }
                if (bdn > min && min != null) {
                    return 2;
                }
                return 1;
            }
            if (typeof bdn == 'string' && bdn == '' || bdn == null) {
                return;
            }
            if (typeof survey == 'string' && survey == '' || survey == null) {
                return;
            }
            if (isNaN(bdn)) {
                return;
            }
            if (isNaN(survey)) {
                return;
            }
            let variance = survey - bdn;
            // if (min)
            //     if (variance < min) return $listsCache.QualityMatch[1];
            // if (max)
            //     if (variance > max) return $listsCache.QualityMatch[1];
            // return $listsCache.QualityMatch[0];
            // changed logic -> passed for exact match, failed otherwise
            if (variance == 0) {
                return $listsCache.QualityMatch[0];
            }
            return $listsCache.QualityMatch[1];
        };

        /* END DELIVERY*/
        $scope.checkQualityStatus = function() {
            let status = 0;
            $.each($scope.formValues.labTestResults, (key, val) => {
                if (val.qualityMatch && val.qualityMatch.name == 'Failed') {
                    status++;
                }
            });
            if (status == 0) {
                $scope.formValues.reconMatch = {
                    id: 1,
                    name: 'Passed'
                };
            } else {
                $scope.formValues.reconMatch = {
                    id: 2,
                    name: 'Failed'
                };
            }
        };
        $scope.hideAddDataButton = function() {
            var buttons = $('.addData')
                .parents('.ui-grid-render-container')
                .find('.addData');
            var count = buttons.length;
            var first = buttons[0];
            if (count > 1) {
                first.addClass('hidden');
            }
        };
        // Check default options from layout
        $scope.checkDefaults = function(options, name, id) {
            $scope.formValues[id] = [];
            $.each(options, (key, val) => {
                $scope.formValues[id].push($scope.options[name][val]);
            });
        };
        $scope.reconQualityDispute = function() {
            let ClaimTypeId = 2;
            if (typeof ($scope.selectedRows != 'undefined') && $scope.selectedRows != null && $scope.selectedRows.length > 0) {
                let data = {
                    LabTestResultIds: $scope.selectedRows,
                    DeliveryQualityParameterIds: [],
                    DeliveryProductId: null,
                    ClaimTypeId: ClaimTypeId
                };
                Factory_Master.raise_claim(data, (response) => {
                    if (response) {
                        if (response.status == true) {
                            $scope.loaded = true;
                            // toastr.success(response.message);
                            localStorage.setItem('claimsclaims_newEntity', angular.toJson(response.data));
                            window.open($location.$$absUrl.replace($location.$$path, '/claims/claim/edit/'), '_blank');
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                });
            } else {
                toastr.error('Please select a parameter!');
            }
        };
        // Email Log Filter
        $scope.emailLogFilter = function(operation) {
            if (operation == 'search') {
                // var UIFilters = {} // not used here :)
                let Filters = [];
                if ($rootScope.formDataFields.module) {
                    Filters.push({
                        ColumnName: 'Module',
                        Value: $rootScope.formDataFields.module.id.toString()
                    });
                }
                if ($rootScope.formDataFields.sender) {
                    Filters.push({
                        ColumnName: 'Sender',
                        Value: $rootScope.formDataFields.sender.toString()
                    });
                }
                if ($rootScope.formDataFields.status) {
                    Filters.push({
                        ColumnName: 'Status',
                        Value: $rootScope.formDataFields.status.id.toString()
                    });
                }
                if ($rootScope.formDataFields.entity) {
                    Filters.push({
                        ColumnName: 'Entity',
                        Value: $rootScope.formDataFields.entity.id.toString()
                    });
                }
                if ($rootScope.formDataFields.subject) {
                    Filters.push({
                        ColumnName: 'Subject',
                        Value: $rootScope.formDataFields.subject.toString()
                    });
                }
                if ($rootScope.formDataFields.emailTo) {
                    Filters.push({
                        ColumnName: 'EmailTo',
                        Value: $rootScope.formDataFields.emailTo.toString()
                    });
                }
                $(`#${ Elements.settings[Object.keys(Elements.settings)[0]].table}`).jqGrid.table_config.on_payload_filter(Filters);
                toastr.success('Search params sent');
                $rootScope.masterEmailLogsFilters = Filters;
            }
            if (operation == 'reset') {
                $state.reload();
                toastr.success('Reset form cleared');
            }
        };
        // {end} Email Log Filter
        /* Labs PREVIEW*/
        $scope.getEmailTransactionType = function(valType) {
        	$scope.emailTemplates = null;
        	$rootScope.previewEmail = null;
            var transactionId;
            $.each($listsCache.EmailTransactionType, (key, val) => {
                if (val.name == valType) {
                    transactionId = val.id;
                }
            });
            Factory_Master.list_by_transaction_type(transactionId, (response) => {
                if (response) {
                    if (response.status == true) {
                        $scope.emailTemplates = response.data;
                        $.each($scope.emailTemplates, (k, v) => {
                            if (!v.displayName) {
                                v.displayName = v.name;
                            }
                        });
                        if (valType == 'Claims') {
                            var keysToRemove = [];
                            $.each($scope.emailTemplates, (k, v) => {
                                var entityClaimType = $rootScope.formValues.claimType.claimType.name;
                                if ($rootScope.formValues.claimType.claimType.name == 'Quantity' && $rootScope.formValues.densitySubtypes.length > 0) {
                                    entityClaimType = 'Density';
                                }
                                if (v.name.indexOf(entityClaimType) == -1) {
                                    keysToRemove.push(k);
                                }
                            });
                            keysToRemove.reverse();
                            $.each(keysToRemove, (key, val) => {
                                $scope.emailTemplates.splice(val, 1);
                            });
                            $scope.emailTemplates;
                            $scope.ClaimEmailTemplate = $scope.emailTemplates[0];
                            setTimeout(() => {
                                $('#ClaimEmailTemplate').trigger('change');
                            }, 100);
                        }
                    }
                }
            });
        };


        $scope.formEmailString = function(data) {
            if(typeof data == 'object') {
                // array
                let emailStr = '';
                $.each(data, (_, em) => {
                    emailStr = emailStr + em;
                });
                return emailStr.substring(0, emailStr.length - 1);
            }
            if(typeof data == 'string') {
                return data.replace(/,/g, ';');
            }
        };


        $scope.$on('previewEmail', (events, args) => {
            $rootScope.previewEmail = args;
            $rootScope.previewEmail.to == null ? $rootScope.previewEmail.to = [] : '';
            $rootScope.previewEmail.cc == null ? $rootScope.previewEmail.cc = [] : '';
            $rootScope.previewEmail.bcc == null ? $rootScope.previewEmail.bcc = [] : '';
            $rootScope.previewEmail.toEmailOthers = $scope.formEmailString($rootScope.previewEmail.toOthers);
            $rootScope.previewEmail.ccEmailOthers = $scope.formEmailString($rootScope.previewEmail.ccOthers);
            $.each($rootScope.availableDocumentAttachmentsList, (k, v) => {
                if (v.isIncludedInMail) {
                    $.each($rootScope.previewEmail.attachmentsList, (k1, v1) => {
                        if (v1.id === v.id) {
                            v1.isIncludedInMail = true;
                        }
                    });
                }
            });
        });
        if (!$scope.onMyEvent) {
            $scope.onMyEvent = $scope.$on('tableLayoutLoaded', (e, arg) => {
                vm.delayaddModalActions();
            });
        }
        $scope.addEmailAddressInPreview = function(model, value) {
            var currentValues = eval("$rootScope." + model);
            var isDuplicate = false;
            $.each(currentValues, (key, currentVal) => {
                if (currentVal.name == value.name && currentVal.idEmailAddress == value.idEmailAddress) {
                    isDuplicate = true;
                }
            });
            if (isDuplicate) {
                toastr.error('Contact is already added');
            } else {
                currentValues.push(value);
            }
        };
        $scope.sendPreviewEmail = function() {
        	// asdasd

        	$scope.saveClaimEmail(true, (resp) => {
        		if (resp == true) {
                    let  toOthersString = [], ccOthersString = [];
                    if(typeof $rootScope.previewEmail.toOthers == 'string') {
                        toOthersString = $rootScope.previewEmail.toOthers;
                    }else{
                        $.each($rootScope.previewEmail.toOthers, (k, v) => {
                            toOthersString.push(v);
                        });
                        toOthersString = toOthersString.toString();
                    }

                    if(typeof $rootScope.previewEmail.ccOthers == 'string') {
                        ccOthersString = $rootScope.previewEmail.ccOthers;
                    }else{
                        $.each($rootScope.previewEmail.ccOthers, (k, v) => {
                            ccOthersString.push(v);
                        });
                        ccOthersString = ccOthersString.toString();
                    }

                    $rootScope.previewEmail.toOthers = angular.copy(toOthersString);
                    $rootScope.previewEmail.ccOthers = angular.copy(ccOthersString);

        			data = { Payload: $rootScope.previewEmail };

		            let toString = [],
		                ccString = [];
		            $.each($rootScope.previewEmail.to, (k, v) => {
		                toString.push(v.idEmailAddress);
		            });
		            $.each($rootScope.previewEmail.cc, (k, v) => {
		                ccString.push(v.idEmailAddress);
		            });
		            toString = toString.toString();
		            ccString = ccString.toString();

                    toOthersString = $rootScope.previewEmail.toOthers.toString();
                    ccOthersString = $rootScope.previewEmail.ccOthers.toString();


                    var request_data = payloadDataModel.create(data.Payload);

		            let comments = {
		                id: $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
		                name: $rootScope.previewEmail.comment.name,
		                emailTemplate:  $rootScope.currentEmailTemplate,
		                businessId: vm.entity_id,
		                secondBusinessId: null,
		                thirdBusinessId: null,
		                isDeleted: false,
		                Content: $rootScope.previewEmail.content,
		                To: toString,
		                Cc: ccString,
		                ToOthers: $rootScope.previewEmail.toOthers,
		                CcOthers: $rootScope.previewEmail.ccOthers,
		                From: $rootScope.previewEmail.from
		            };
		            // find email template object
		            $.each(vm.listsCache.EmailTemplate, (key, value) => {
		                if(value.id == $rootScope.currentEmailTemplate) {
		                    comments.emailTemplate = angular.copy(value);
		                    return;
		                }
		            });
		            request_data.Payload.comment = angular.copy(comments);

		            if (request_data.warningMessage) {
                        var confirmAction = window.confirm(request_data.warningMessage);
		                if (confirmAction) {
		                    Factory_Master.send_email_preview(request_data, (response) => {
		                        if (response) {
		                            if (response.status == true) {
		                                $scope.loaded = true;
		                                toastr.success('Email Preview was sent!');
		                                let url = `${$state.$current.url.prefix + $state.params.screen_id }/edit/${ $state.params.entity_id}`;
		                                $location.path(url);
		                            } else {
		                                $scope.loaded = true;
		                                toastr.error(response.message);
		                            }
		                        }
		                    });
		                }
		            } else {
		                Factory_Master.send_email_preview(request_data, (response) => {
		                    if (response) {
		                        if (response.status == true) {
		                            $scope.loaded = true;
		                            toastr.success('Email Preview was sent!');
		                            let url = `${$state.$current.url.prefix + $state.params.screen_id }/edit/${ $state.params.entity_id}`;
		                            $location.path(url);
		                        } else {
		                            $scope.loaded = true;
		                            toastr.error(response.message);
		                        }
		                    }
		                });
		            }
        		}
        	});
        };

        /* END CONTRACT PREVIEW*/
        $scope.goToFormula = function() {
            window.open('#/masters/formula/edit/', '_blank');
        };
        $scope.addSpecParamsToClaim = function(event) {
            // check if valid
            var selectedDisabled = event.currentTarget.attributes['ng-disabled'].value;
            var  selectedParamId = parseInt(event.currentTarget.attributes['spec-param-id'].value); // specParam.id
            var selectedParamClaimType = parseInt(event.currentTarget.attributes['claim-type'].value); // claim.claim.id (actual id to send)
            var selectedParamRadioId = event.currentTarget.attributes['radio-id'].value; // claim.id (given id for validation)
            var selectedClaimId = selectedParamRadioId.split('_')[3];
            // cancel selection if disabled
            if (selectedDisabled == 'true') {
                event.currentTarget.checked = false;
                return;
            }
            // mark parameters disabled
            if (typeof $rootScope.raiseClaimInfo.currentClaimTypeId == 'undefined') {
                $rootScope.raiseClaimInfo.currentClaimTypeId = selectedParamClaimType;
                $rootScope.raiseClaimInfo.currentClaimId = selectedClaimId;
                $(selectedParamRadioId)[0].checked = true;
                $.each(vm.availableClaimTypes, (claimKey, claimVal) => {
                    if (claimVal.id != selectedClaimId) {
                        $.each(claimVal.specParams, (paramKey, paramVal) => {
                            paramVal.disabled = 'true';
                        });
                    }
                });
                $rootScope.raiseClaimInfo.currentSpecParamIds.push(selectedParamId);
            } else if ($rootScope.raiseClaimInfo.currentClaimId == selectedClaimId || $rootScope.raiseClaimInfo.currentSpecParamIds.length == 0) {
                // add / erase from array if it fits
                var i = $.inArray(selectedParamId, $rootScope.raiseClaimInfo.currentSpecParamIds);
                if (i >= 0) {
                    $rootScope.raiseClaimInfo.currentSpecParamIds.splice(i, 1);
                    // remove restrictions if unchecked all params
                    if ($rootScope.raiseClaimInfo.currentSpecParamIds.length == 0) {
                        $.each(vm.availableClaimTypes, (claimKey, claimVal) => {
                            $.each(claimVal.specParams, (paramKey, paramVal) => {
                                paramVal.disabled = 'false';
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
        };
        $scope.selectClaimInfoId = function(claimTypeId, claimId) {
            // claimId = just for disabling checkboxes
            $rootScope.raiseClaimInfo.currentClaimTypeId = claimTypeId;
            $rootScope.raiseClaimInfo.currentClaimId = claimId;
            var paramsSet = false;
            $rootScope.raiseClaimInfo.currentSpecParamIds = [];
            $.each(vm.availableClaimTypes, (claimKey, claimVal) => {
                if (claimVal.id != $rootScope.raiseClaimInfo.currentClaimId) {
                    // uncheck checkboxes that do not fit & disable them
                    $.each(claimVal.specParams, (paramKey, paramVal) => {
                        id = `#claim_info_checkbox_${ paramVal.specParameter.id}`;
                        $(id)[0].checked = false;
                        paramVal.disabled = 'true';
                    });
                } else {
                    // check current claim boxes & make available
                    $.each(claimVal.specParams, (paramKey, paramVal) => {
                        paramVal.disabled = 'false';
                        id = `#claim_info_checkbox_${ paramVal.specParameter.id}`;
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
            } else {
                $rootScope.deliveryProductChanged = false;
            }
        };

        /* DeliveryList*/
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
        //     // }
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
        //             $scope.formValues.deliveryProducts[0].qualityParameters = response;
        //         })
        //         Factory_Master.getQtyParamsDeliveryProsuct(dataForInfo, function(response) {
        //             quantityParams = response;
        //             $scope.formValues.deliveryProducts[0].quantityParameters = response;
        //         })
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
        /* DeliveryList*/
        /* Convert Currency*/
        $scope.convertCurrency = function(fromCurrencyId, toCurrencyId, exchangeDate, amount, convertCallback) {
            let d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var hours = d.getHours();
            var minutes = d.getMinutes();
            var seconds = d.getSeconds();
            if (month < 10) {
                month = `0${ month}`;
            }
            if (day < 10) {
                day = `0${ day}`;
            }
            if (hours < 10) {
                hours = `0${ hours}`;
            }
            if (minutes < 10) {
                minutes = `0${ minutes}`;
            }
            if (seconds < 10) {
                seconds = `0${ seconds}`;
            }
            var date = `${d.getFullYear() }-${ month }-${ day }T${ hours }:${ minutes }:${ seconds}`;
            if (!exchangeDate) {
                exchangeDate = date;
            }
            var data = {
                Payload: {
                    Order: null,
                    Filters: [
                        {
                            ColumnName: 'FromCurrencyId',
                            Value: fromCurrencyId
                        },
                        {
                            ColumnName: 'ToCurrencyId',
                            Value: toCurrencyId
                        },
                        {
                            ColumnName: 'ExchangeDate',
                            Value: exchangeDate
                        },
                        {
                            ColumnName: 'Amount',
                            Value: amount
                        }
                    ],
                    Pagination: {
                        Skip: 0,
                        Take: 10
                    }
                }
            };
            Factory_Master.convertCurrency(data, (callback) => {
                if (callback) {
                    if (convertCallback) {
                        convertCallback(callback.data);
                    }
                }
            });
        };

        /* Convert Currency*/
        /* Print Function*/
        $scope.printElem = function(selector) {
            let mywindow = window.open('', 'PRINT', 'height=400,width=600');
            mywindow.document.write('<html><head>');
            mywindow.document.write('</head><body >');
            mywindow.document.write($(selector).html());
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10*/
            mywindow.print();
            mywindow.close();
            return true;
        };

        /* END Print Function*/
        $scope.stringToObject = function(string, obj) {
            $scope[obj] = JSON.parse(string);
        };

        /* END ContractDelivery*/
        $scope.$on('copyAlertAction', (event) => {
            $rootScope.copyAlertAction = true;
        });
        vm.displayStatusInHeader = function() {
            $rootScope.$watch('formValues', () => {
                if ($state.params.screen_id == 'claim') {

                    if (typeof $rootScope.formValues != 'undefined' && typeof $rootScope.formValues.claimDetails != 'undefined' && typeof $rootScope.formValues.claimDetails.status != 'undefined') {
                        if (!$state.params.status || typeof $state.params.status == 'undefined') {
                            $state.params.status = {};
                        }
                        $state.params.status.name = $rootScope.formValues.claimDetails.status.name;
                        $state.params.status.displayName = $rootScope.formValues.claimDetails.status.displayName;
                        $state.params.status.bg = statusColors.getColorCodeFromLabels(
                            $rootScope.formValues.claimDetails.status,
                            $listsCache.ScheduleDashboardLabelConfiguration);
                        $state.params.status.color = 'white';
                    }
                }
            });
        };
        $scope.saveNewContactCounterparty = function(newContact, counterpartyData) {
            if (newContact.name == '' || !newContact.name || !newContact.contactType.id || !newContact.email || newContact.email == '') {
                toastr.error('Please fill the required fields');
                return;
            }

            	if (!$scope.validateEmailPattern(newContact.email)) {
                toastr.error('Invalid email address');
                return;
            	}

            $.each(counterpartyData.contacts, (k, v) => {
                if (v.id == 0) {
                    counterpartyData.contacts.splice(k, 1);
                }
            });
            newContact.id = 0;
            newContact.emailContact = true;
            var dataToAdd = counterpartyData;
            dataToAdd.contacts.push(newContact);
            $rootScope.$broadcast('confirmedBladeNavigation', true);
            Factory_Master.save_master_changes('masters', 'counterparty', dataToAdd, (callback) => {
		            $('.blade-column.main-content-column .ng-dirty').removeClass('ng-dirty');
                vm.newContact = null;
                vm.addNewContact = false;
                if (callback.status == true) {
                    toastr.success(callback.message);
                    // $scope.closeBlade();
                } else {
                    toastr.error(callback.message);
                }
            });
        };
        $scope.closeBlade = function() {
        	if ($('.blade-column.main-content-column .ng-dirty').length > 0 && !$rootScope.overrideCloseNavigation) {
                if ($('general-energy-calculation').length > 0) {
                    $('.confirmEnergyBladeClose').removeClass('hide');
                    $('.confirmEnergyBladeClose').modal();
                } else {
                    $('.confirmBladeClose').removeClass('hide');
                    $('.confirmBladeClose').modal();
                }
        	} else {
        		$scope.confirmCloseBlade();
        	}
        	if ($rootScope.shouldRefreshGroup) {
        		$rootScope.$broadcast('initScreenAfterSendOrSkipRfq', true);
        	}
        };
        $scope.confirmCloseBlade = function() {
            $('.bladeEntity').removeClass('open');
            $('body').css('overflow-y', 'auto');
            setTimeout(() => {
                $rootScope.bladeTemplateUrl = '';
                if($rootScope.refreshPending) {
                	$state.reload();
                    // window.location.reload();
                }
                $rootScope.$broadcast('undoComments', true);
                $rootScope.$broadcast('counterpartyBladeClosed', true);
                $rootScope.overrideCloseNavigation = false;
            }, 500);
        };

        $scope.confirmSaveBlade = function() {
            $rootScope.$broadcast('updateEnergySpecValuesByProduct', true);
        };

        $scope.isMeanFormula = function() {
            $.each($scope.formValues.complexFormulaQuoteLines, (key, val) => {
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
            if (param == 'start') {
                return 0;
            }
            var windowWidth = $window.innerWidth;
            if (windowWidth > 991) {
                return 4;
            }
            return 2;
        };
        $scope.getSpecGroupByProduct = function(productId, additionalSpecGroup) {
            var data = {
                Payload: {
                    Filters: [
                        {
                            ColumnName: 'ProductId',
                            Value: productId
                        }
                    ]
                }
            };
            if (typeof vm.productSpecGroup == 'undefined') {
                vm.productSpecGroup = [];
            }

            // if spec group for product exists, do not make call again
            if (typeof vm.productSpecGroup[productId] != 'undefined') {
                return;
            }
            // if(typeof(vm.productSpecGroup[productId]) != []) return;

            Factory_Master.specGroupGetByProduct(data, (callback) => {
                if (callback) {

                	if (additionalSpecGroup) {
                		var additionalSpecIsInArray = false;
	                	$.each(callback.data.payload, function(k,v){
	                		if (v.id == additionalSpecGroup.id) {
		                		additionalSpecIsInArray = true;
	                		}
	                	})
	                	if (!additionalSpecIsInArray) {
	                		callback.data.payload.push(additionalSpecGroup);
	                	}
                	}
                    vm.productSpecGroup[productId] = callback.data.payload;
                    // $scope.addProductToConversion(index, false, false);
                }
            });
        };


        vm.getContractConfiguration = function() {
            console.log('getting contract config');
        };

        vm.trustAsHtml = function(data) {
            return $sce.trustAsHtml(data);
        };

        vm.trustAsHtmlField = function(data) {
            if (data && _.has($scope, `formValues.${ data.Unique_ID}`)) {
                return $sce.trustAsHtml(_.get($scope, `formValues.${ data.Unique_ID}`));
            }
        };

        $scope.doEntityActionMaster = function(type, url, method, absolute, new_tab) {
            data = [ type, url, method, absolute, new_tab ];
            $rootScope.$broadcast('generalAction', data);
            // $scope.general_action(type, url, method, absolute, new_tab);
        };


        $rootScope.$on('$stateChangeStart',
            (event, toState, toParams, fromState, fromParams) => {
		    $rootScope.called_getAdditionalCostsCM = false;
            });
        vm.getAdditionalCostsComponentTypes = function(callback) {
            if (!vm.additionalCostsComponentTypes) {
		    	if (!$rootScope.called_getAdditionalCostsCM) {
		    		$rootScope.called_getAdditionalCostsCM = 1;
	                Factory_Master.getAdditionalCosts(0, (response) => {
			    		// $rootScope.called_getAdditionalCostsCM = false;
                        vm.additionalCostsComponentTypes = response.data.payload;
                        $rootScope.additionalCostsComponentTypes = response.data.payload;
	    				$scope.filterCostTypesByAdditionalCost(null);
	                    callback(vm.additionalCostsComponentTypes);
                        return vm.additionalCostsComponentTypes;
	                });
		    	}
            } else {
                callback(vm.additionalCostsComponentTypes);
            }
        };


        $scope.filterCostTypesByAdditionalCostInvoice = function(cost, rowRenderIndex) {
            if (typeof vm.filteredCostTypesByAdditionalCost == 'undefined') {
	            vm.filteredCostTypesByAdditionalCost = [];
            }

            var currentCost;
            if (!$rootScope.additionalCostsComponentTypes) {
                return;
            }
            var costType;
            $.each($rootScope.additionalCostsComponentTypes, (k, v) => {
                if (v.id == currentCost) {
                    costType = v.costType.id;
                }
            });

            var availableCosts = [];
            $.each(vm.listsCache.CostType, (ack, acv) => {
                if (acv) {
                    if (costType == 1 || costType == 2) {
		                if (acv.id == 1 || acv.id == 2) {
	                        availableCosts.push(acv);
		                }
                    }
                    if (costType == 3) {
		                if (acv.id == 3) {
	                        availableCosts.push(acv);
		                }
                    }
                }
            });
            return availableCosts;
        };

        // Cost Type filter for Barge Additional Cost Details popup

        $scope.filterBargeCostTypes = function() {
                var availableCosts = [];
                    $.each(vm.listsCache.CostType, (k, v) => {
                        if (v.id == 1 || v.id == 2) {
                            availableCosts.push(v);
                        }
                    });

                return availableCosts;
        };
        $scope.filterCostTypesByAdditionalCost = function(cost, rowRenderIndex) {

            var currentCost = cost;


            let doFiltering = function(addCostCompTypes, cost) {
                var costType = null;
                $.each(addCostCompTypes, (k, v) => {
                    if (v.id == currentCost) {
                        costType = v.costType.id;
                    }
                });
                var availableCosts = [];
                if (costType == 1 || costType == 2) {
                    $.each(vm.listsCache.CostType, (k, v) => {
                        if (v.id == 1 || v.id == 2) {
                            availableCosts.push(v);
                        }
                    });
                }
                if (costType == 3) {
                    $.each(vm.listsCache.CostType, (k, v) => {
                        if (v.id == 3) {
                            availableCosts.push(v);
                        }
                    });
                }
                $scope.EnableBargeCostDetails = false;
                $scope.EnableBargeCostDetails = false;
                if (costType == 4) {
                    $.each(vm.listsCache.CostType, (k, v) => {
                        if (v.id == 4) {
                            $scope.EnableBargeCostDetails = true;
                            availableCosts.push(v);
                        }
                    });
                }
                if (costType == 5) {
                    $.each(vm.listsCache.CostType, (k, v) => {
                        if (v.id == 5) {
                            $scope.EnableBargeCostDetails = true;
                            availableCosts.push(v);
                        }
                    });
                }

                return availableCosts;
            };

            // return doFiltering(vm.additionalCostsComponentTypes, currentCost);
            if(vm.additionalCostsComponentTypes === undefined) {
                vm.getAdditionalCostsComponentTypes((additionalCostsComponentTypes) => {
                    return doFiltering(additionalCostsComponentTypes);
                });
            }else{
                return doFiltering(vm.additionalCostsComponentTypes);
            }
        };

        $scope.setDefaultCurrency = function(additionalCost,key) {
            var defaultCostType;
            if($scope.formValues.additionalCosts.length >0){
                if($scope.formValues.additionalCosts[key].amount != undefined){
                    $scope.formValues.additionalCosts[key].amount = '';
                }
                if($scope.formValues.additionalCosts[key].priceUom != undefined){
                    $scope.formValues.additionalCosts[key].priceUom = '';
                }
                if($scope.formValues.additionalCosts[key].extrasPercentage != undefined){
                    $scope.formValues.additionalCosts[key].extrasPercentage = '';
                }
            }
            $scope.CurrentadditionalCostsdetails  = key;
            // if($scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails == undefined ){

            // }

            // }
            if(additionalCost.name == 'Range' || additionalCost.name == 'Total'){

                defaultCostType = $scope.vm.tenantSetting.tenantFormats.currency;
                $scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails = [];
                $scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails.push({'id':0,'currency':$scope.vm.tenantSetting.tenantFormats.currency})

            }
            else{
                if($scope.formValues.additionalCosts[key].additionalCostDetails != undefined){
                    $scope.formValues.additionalCosts[key].additionalCostDetails = undefined;
                }
            }
            return defaultCostType;
        };
        $scope.setAmountValidation = function(key){

            $('#Amount'+ key).removeClass('ng-invalid');
        };
        $scope.setCurrencyValidation = function(key){

            $('#Currency'+ key).removeClass('ng-invalid');
        };

        $scope.setDefaultCostType = function(additionalCost, key) {
            $('#ItemName'+ key).removeClass('ng-invalid');
            $('#Type'+ key).removeClass('ng-invalid');

            if($scope.formValues.additionalCosts.length >0){
                if($scope.formValues.additionalCosts[key].amount != undefined){
                    $scope.formValues.additionalCosts[key].amount = '';
                }
                if($scope.formValues.additionalCosts[key].priceUom != undefined){
                    $scope.formValues.additionalCosts[key].priceUom = '';
                }
                if($scope.formValues.additionalCosts[key].extrasPercentage != undefined){
                    $scope.formValues.additionalCosts[key].extrasPercentage = '';
                }
            }
            if($scope.formValues.additionalCosts[key].additionalCostDetails != undefined){
                $scope.formValues.additionalCosts[key].additionalCostDetails = undefined;
            }

            var defaultCostType;
            $.each(vm.additionalCostsComponentTypes, (k, v) => {
                if (v.id == additionalCost.id) {
                    defaultCostType = v.costType;
                    if((v.costType.id == 4 || v.costType.id == 5) && v.id == additionalCost.id){
                        $scope.formValues.additionalCosts[key].currency = $scope.vm.tenantSetting.tenantFormats.currency;
                        $('#Currency'+ key).removeClass('ng-invalid');
                        $('#Amount'+ key).removeClass('ng-invalid');
                    }
                    else{
                        $scope.formValues.additionalCosts[key].currency = '';
                    }
                }

            });
            return defaultCostType;
        };

        $scope.resetUom = function(key1, key2) {
            if ($scope.formValues.products[key1].additionalCosts[key2].costType.name != 'Unit') {
                $scope.formValues.products[key1].additionalCosts[key2].uom = null;
            } else {
                $scope.formValues.products[key1].additionalCosts[key2].uom = $scope.tenantSetting.tenantFormats.uom;
            }
        };

        $scope.setIsAllowingNegativeAmmount = function(key1, key2) {
            let additionalCost = $scope.formValues.products[key1].additionalCosts[key2].additionalCost;
            let findAdditionalCostComponent = _.find(vm.additionalCostsComponentTypes, function(obj) {
                return obj.id == additionalCost.id;
            });
            if (findAdditionalCostComponent) {
                $scope.formValues.products[key1].additionalCosts[key2].isAllowingNegativeAmmount = findAdditionalCostComponent.isAllowingNegativeAmmount;
            }



        }

        $scope.clearSchedules = function() {
            $scope.formValues.pricingScheduleOptionDateRange = null;
            $scope.formValues.pricingScheduleOptionSpecificDate = null;
            $scope.formValues.pricingScheduleOptionEventBasedSimple = null;
            $scope.formValues.pricingScheduleOptionEventBasedExtended = null;
            $scope.formValues.pricingScheduleOptionEventBasedContinuous = null;
        };
        $scope.getProductTooltipByProductId = function(productId) {
            var tooltipName = null;
            $.each($listsCache.Product, (pk, pv) => {
                if (pv.id == productId) {
                    tooltipName = pv.displayName;
                }
            });
            return tooltipName;
        };
        $scope.goToFormulaScreen = function(id) {
            // if (localStorage.getItem("uneditableFormula")) {
            //     localStorage.removeItem("uneditableFormula");
            // }
            // if (!$scope.formValues.status) return;
            // if (!id) return;
            // if ($scope.formValues.status.name == "Confirmed" || $scope.formValues.status.name == "Delivered") {
            //     localStorage.setItem("uneditableFormula", id);
            // }
            $window.open(`${location.origin }/#/masters/formula/edit/${ id}`, '_blank');
        };
        $scope.checkEditableFormula = function(isEditable) {
            if (!isEditable) {
                $scope.submitedAction = true;
                toastr.error('Formula cannot be modifed for a Confirmed / Delivered contract');
            }
        };
        vm.checkVerifiedDelivery = [ false, false ];
        vm.checkVerifiedDeliveryFromLabs = function(orderChange) {
            if (orderChange == 'orderChange' &&  $('#DeliveryDeliveryID') &&  $('#DeliveryDeliveryID').length > 0) {
                $('#DeliveryDeliveryID')[0].disabled = '';
                $('#DeliveryDeliveryID')[0].options[0].text = '';
                return;
            }
            if (orderChange == 'loadedData') {
                vm.checkVerifiedDelivery[1] = true;
            }
            if (orderChange == 'loadedControl') {
                vm.checkVerifiedDelivery[0] = true;
            }
            if (vm.checkVerifiedDelivery[0]) {
                if (vm.checkVerifiedDelivery[1]) {
                    $timeout(() => {
                        let someValidOption = false;
                        if($('#DeliveryDeliveryID') && $('#DeliveryDeliveryID').length > 0) {
                            $.each($('#DeliveryDeliveryID')[0].options, (key, val) => {
                                if (val.value != '?' && val.value != '' && val.value != ' ') {
                                    someValidOption = true;
                                }
                            });
                            if (!someValidOption && vm.entity_id > 0) {
                                $('#DeliveryDeliveryID')[0].disabled = true;
                                if ($scope.formValues.delivery != null) {
                                    $('#DeliveryDeliveryID')[0].options[0].text = `${$scope.formValues.delivery.name } is not Verified`;
                                }
                            }
                        }
                    }, 10);
                }
            }
        };
        $scope.showMultiLookupWarning = function(model) {
            $('#departments').removeClass('invalid');
            setTimeout(() => {
                if (model) {
                    if (model.id && !vm.plusClickedMultilookup) {
                        toastr.warning('Please click on ‘+’ button to add');
                    }
                }
                vm.plusClickedMultilookup = false;
            }, 300);
        };
        $scope.validateEmailPattern = function(modelData, hideErrorMessage) {
            var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var resultOk = pattern.test(modelData);
            if (resultOk) {
                return modelData;
            }
            if (!hideErrorMessage) {
            	toastr.error('Invalid email address');
            }
            return null;
        };

        $scope.validateContactNamePattern = function(modelData) {
            var errorMessage = 'The contacts cannot contain the characters ",", ";", "|"';
            if (modelData.indexOf(',') == -1 && modelData.indexOf(';') == -1 && modelData.indexOf('|') == -1) {
                return modelData;
            }
            	toastr.error(errorMessage);
            return null;
        };

        jQuery(document).ready(() => {
            if (window.readyOnce) {
                return;
            }

            window.readyOnce = true;
        	if (/* $state.current.name.indexOf('.documents') != -1 &&*/ typeof $rootScope.setDocumentTimeout == 'undefined') {
        		$rootScope.setDocumentTimeout = true;
	            setTimeout(() => {
	            	$(document).on('change', 'input.inputfile', function() {
                        if (window.location.href.indexOf("masters/price") != -1 ) {
                            var fileScope = angular.element($('.dropzone-file-area')).scope();
                            var currentFile = this.files[0];
                            fileScope.$apply(() => {
                                fileScope.droppedDoc = currentFile;
                            });
                            $rootScope.droppedDoc = currentFile;
                        	return;
                        }

                        if (window.location.href.indexOf("admin/order-import") != -1) {
                            let currentFile = this.files[0];
                            var fileScope = angular.element($('input').parent().find('.fileNameLabel')).scope();
                            if (currentFile) {
                                $rootScope.droppedDoc = currentFile;
                                fileScope.$apply(() => {
                                    fileScope.droppedDoc = currentFile;
                                });
                            }
                            return;
                        }
                        var input = $(this);
	                    // var label = $(input).next();
                        //    var labelVal = label.innerHTML;
	                    // if (!label) {
	                    // 	return;
	                    // }

                        if (window.location.href.indexOf("/company/") != -1 || window.location.href.indexOf("/pool/") != -1) {
                            $scope.uploadFiles();
                        } else {
                            var currentFile = this.files[0];
	                            let documentTypeValues = this.form[1].value;
	                            if (documentTypeValues == '') {
	                                toastr.warning('Please select a Document Type and upload the file again');
	                                return;
	                            }
                            var fileScope = angular.element($('input').parent().find('.fileNameLabel')).scope();
                            $rootScope.droppedDoc = currentFile;
                            fileScope.$apply(() => {
                                fileScope.droppedDoc = currentFile;
                            });
                            $scope.uploadDocument('#fileUpload');
                        }
                        // $("input").parent().find(".fileNameLabel").text(currentFile.name)

                        // var fileName = "";
                        // if (this.files && this.files.length > 1) {
                        // 	fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length)
                        // } else {
	                       //  fileName = $(this).val().split("\\").pop();
                        // }
                        // if (fileName) {
                        // 	$(label).children("span").innerHTML = fileName
                        // } else {
                        // 	label.innerHTML = labelVal;
                        // }
	            	});

	                // var inputs = document.querySelectorAll(".inputfile");
	                // Array.prototype.forEach.call(inputs, function(input) {
	                //     var label = input.nextElementSibling,
	                //         labelVal = label.innerHTML;
	                //     input.addEventListener("change", function(e) {
	                //         $rootScope.droppedDoc = null;
	                //         $scope.$apply(function() {
	                //             $scope.droppedDoc = null;
	                //         });
	                //         var fileName = "";
	                //         if (this.files && this.files.length > 1) fileName = (this.getAttribute("data-multiple-caption") || "").replace("{count}", this.files.length);
	                //         else fileName = e.target.value.split("\\").pop();
	                //         if (fileName) label.querySelector("span").innerHTML = fileName;
	                //         else label.innerHTML = labelVal;
	                //     });
	                //     // Firefox bug fix
	                //     input.addEventListener("focus", function() {
	                //         input.classList.add("has-focus");
	                //     });
	                //     input.addEventListener("blur", function() {
	                //         input.classList.remove("has-focus");
	                //     });
	                // });
	            }, 1500);
        	}
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
        //          }
        // $('.selectpicker').selectpicker('refresh');
        //      },300)
        //  })
        $scope.$on('formValues', () => {
            // vm.initRobSectionUOM();
            if (vm.screen_id == 'additionalcost') {
                $scope.triggerChangeFields('CostType', 'costType');
            }
            if (vm.screen_id == 'service') {
                if (!$scope.formValues.dmaUom) {
                    $scope.formValues.dmaUom = $scope.getDefaultUom();
                }
                if (!$scope.formValues.hsfoUom) {
                    $scope.formValues.hsfoUom = $scope.getDefaultUom();
                }
                if (!$scope.formValues.lsfoUom) {
                    $scope.formValues.lsfoUom = $scope.getDefaultUom();
                }
            }
            if (vm.screen_id == 'product') {
                _.each($scope.formValues.energyFormulaProducts, (value, key) => {
                    if (value.energyFormulaTypeName === 'SpecificEnergyCalculation') {
                        $scope.formValues.energyFormulaSpecific = value.energyFormula;
                        $scope.formValues.energyFormulaDescriptionSpecific = value.energyFormula.displayName;
                    }
                    if (value.energyFormulaTypeName === 'CCAI') {
                        $scope.formValues.energyFormulaCCAI = value.energyFormula;
                        $scope.formValues.energyFormulaDescriptionCCAI = value.energyFormula.displayName;
                    }
                });
            }
            if (vm.screen_id == 'counterparty') {
                vm.preparePreferredContacts($scope.formValues.counterpartyLocations);
            }
            if(vm.screen_id == 'location'){
                // location seller contacts to be in synch with counterparty location contacts
                _.each($scope.formValues.sellers, (seller, index) =>{
                    if(seller.sellerContacts && seller.sellerContacts.length > 0 && seller.sellerContacts[0].indexId === undefined){
                        let sellerContacts = [];
                        _.each(seller.sellerContacts, (sellerContact, contactIndex) => {
                            let savedSellerContacts = $filter('filter')(seller.locationContacts, { contactId: sellerContact.id });
                            let sellerContactId = 0
                            if(savedSellerContacts.length > 0){
                                sellerContactId = savedSellerContacts[0].id;
                                savedSellerContacts[0].indexId = contactIndex;
                            }
                            sellerContact = { indexId: contactIndex, contactId: sellerContact.id, id: sellerContactId, email: sellerContact.email}
                            sellerContacts.push(sellerContact);
                        });
                        $scope.formValues.sellers[index].sellerContacts = sellerContacts;
                    }
                });
            }
        });
        $('body').on('click', () => {
		    $('[role="tooltip"]').remove();
            $scope.initBoostrapTagsInputTooltip();
        });
        vm.initRobSectionUOM = function() {
            if (typeof $scope.formValues != 'undefined') {
                let uomsToPopulate = [ 'robHsfoDeliveryUom', 'robLsfoDeliveryUom', 'robDoGoDeliveryUom', 'robHsfoRedeliveryUom', 'robLsfoRedeliveryUom', 'robDoGoRedeliveryUom' ];
                $.each(uomsToPopulate, (key, val) => {
                    // if((typeof $scope.formValues[val] != 'undefined') && ((typeof $scope.formValues[val] != 'object') || ($scope.formValues[val] == null))){
                    //     $scope.formValues[val] = $tenantSettings['tenantFormats']['uom'];
                    // }
                    if (typeof $scope.formValues[val] == 'undefined' || $scope.formValues[val] == null) {
                        $scope.formValues[val] = $tenantSettings.tenantFormats.uom;
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
            Factory_Master.get_master_list_filtered('masters', 'counterpartylist', 'masters_counterpartylist_labs', (response) => {
                var defaultLabOptions = [];
                if (response) {
                    if (response.rows.length > 0) {
                        $.each(response.rows, (k, v) => {
                            defaultLabOptions.push({
                                name: v.name,
                                id: v.id
                            });
                        });
                        $scope.options.defaultLab = defaultLabOptions;
                    }
                }
            });
        };
        vm.preparePreferredContacts = function(locationSellerGroups){
            _.each(locationSellerGroups, (value, key) => {
                let contacts = [];
                _.each(value.locationContacts, (contact, contactIndex) => {
                    let isExistAlready = $scope.preferredContacts[key]?
                                    $filter('filter')($scope.preferredContacts[key], { contactId: contact.contactId }).length > 0 : false;
                    if(!isExistAlready){
                        contact.indexId = contacts.length + 1;
                        contact.isNewContact = false;
                        contacts.push(contact);
                    }
                });
                $scope.preferredContacts[key] = contacts;
            });
        }

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

        /* Location Master Preffered Seller Product Table*/
        $scope.openLocationPreferredSellerProducts = function(currentSellerKey, master) {

            var objMapping;
        	if (master) {
        		if (master == 'counterpartyMaster') {
        			objMapping = 'counterpartyLocations';
        		} else {
        			objMapping = 'sellers';
        		}
        	} else {
                objMapping = 'sellers';
        	}
            $scope.locationCurrentPreferredSellerKey = currentSellerKey;
            tpl = $templateCache.get('app-general-components/views/modal_preferredSellersProduct.html');
            // payload
            $scope.locationMasterPreferredSellerProductsTableConfig = {};
            var getPayload = $scope.createLocationPreferredSellerProductsPayload();
            var getPreferredProductsForSellerInLocation;
            if (objMapping == 'sellers') {
	            getPreferredProductsForSellerInLocation = {
	                Payload: {
	                    LocationId: vm.entity_id != '' ? vm.entity_id : 0,
	                    SellerId: $scope.formValues[objMapping][currentSellerKey].id
	                }
	            };
            }
            if (objMapping == 'counterpartyLocations') {
	            getPreferredProductsForSellerInLocation = {
	                Payload: {
	                    SellerId: vm.entity_id != '' ? vm.entity_id : 0,
	                    LocationId: $scope.formValues[objMapping][currentSellerKey].id
	                }
	            };
            }



            // preferred products
            $scope.preferredProductsForSellerInLocation = [];
            if (!$scope.NOTpreferredProductsForSellerInLocation) {
	            $scope.NOTpreferredProductsForSellerInLocation = [];
            }
            $.each($scope.formValues[objMapping][currentSellerKey].products, (ppk, ppv) => {
                if ($scope.preferredProductsForSellerInLocation.indexOf(`${ppv.product.id }`) == -1) {
                    // append preffered products to payload
                    getPayload.Payload.SelectedProductIds.push(ppv.product.id); // number needed
                    if (!ppv.isDeleted) {
	                    $scope.preferredProductsForSellerInLocation.push(`${ppv.product.id }`);
                    }
                }
            });

            // make SelectedProducts a string
            getPayload.Payload.SelectedProductIds = JSON.stringify(getPayload.Payload.SelectedProductIds);
            localStorage.setItem('preferredProducts', getPayload.Payload.SelectedProductIds);
            // $scope.setPrefferedPoductsForSellerInTable();


            Factory_Master.getProductsForSellerInLocation(getPayload, (response) => {
                if (response) {
                    $.each($scope.NOTpreferredProductsForSellerInLocation, (k, v) => {
                    	$.each(response.data.payload, (rk, rv) => {
                    		if (rv.id == parseFloat(v)) {
                    			rv.selected = false;
                    			rv.isDeleted = true;
                    		}
                    	});
                    });
                    $scope.locationPreferredSellerProductsData = response.data.payload;
                    if(!$scope.locationPreferredSellerProductsDataAllProd) {
                        $scope.locationPreferredSellerProductsDataAllProd = [];
                    }
                    $scope.locationPreferredSellerProductsDataAllProd = _.union($scope.locationPreferredSellerProductsDataAllProd, response.data.payload);
                    $scope.locationPreferredSellerProductsDataLength = response.data.matchedCount;
                    $scope.locationPreferredSellerProductsDataPages = Math.ceil($scope.locationPreferredSellerProductsDataLength / $scope.locationMasterPreferredSellerProductsTableConfig.take);
                    $scope.modalInstance = $uibModal.open({
                        template: tpl,
                        size: 'full',
                        appendTo: angular.element(document.getElementsByClassName('page-container')),
                        windowTopClass: 'fullWidthModal',
                        scope: $scope // passed current scope to the modal
                    });
                }
            });
        };






     /* Location Master - Barge cost details table*/
        $scope.openBargeCostDetails = function(currentSellerKey, master,formvalues) {
            var objMapping;
            $scope.CurrentadditionalCostsdetails  = formvalues;
            if($scope.formValues != undefined && $scope.formValues.additionalCosts != undefined)
            {
            console.log("1111111111", $scope.formValues.additionalCosts);
            console.log("1111111111", $rootScope.RootTempadditionalCosts)
                if($rootScope.RootTempadditionalCosts == undefined){
                    $rootScope.RootTempadditionalCosts = angular.copy($scope.formValues.additionalCosts);
                }
            }
            if($scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails == undefined ){
                $scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails = [];
                $scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails.push({'id':0,'currency':$scope.vm.tenantSetting.tenantFormats.currency})

            }

            tpl = $templateCache.get('app-general-components/views/modal_BargeCostDetails.html');
            $scope.modalInstance = $uibModal.open({
                template: tpl,
                size: 'full',
                appendTo: angular.element(document.getElementsByClassName('page-container')),
                windowTopClass: 'fullWidthModal',
                scope: $scope // passed current scope to the modal
            });
        };


        $scope.createLocationPreferredSellerProductsPayload = function(reloadTable) {
            if (!$scope.locationMasterPreferredSellerProductsTableConfig.currentPage) {
                $scope.locationMasterPreferredSellerProductsTableConfig.currentPage = 1;
            }
            if (!$scope.locationMasterPreferredSellerProductsTableConfig.take) {
                $scope.locationMasterPreferredSellerProductsTableConfig.take = 25;
            }
            var sortList;
            if (!$scope.locationMasterPreferredSellerProductsTableConfig.order) {
                $scope.locationMasterPreferredSellerProductsTableConfig.order = {};
                sortList = [
                    {
                        columnValue: 'name',
                        sortParameter: 2
                    }
                ];
            } else {
            	sortList = [
	            	{
	            		columnValue : $scope.locationMasterPreferredSellerProductsTableConfig.order.columnName,
	            		sortParameter : $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder == 'asc' ? 1 : 2
	            	}
            	];
            }
            $scope.locationMasterPreferredSellerProductsTableConfig.skip = ($scope.locationMasterPreferredSellerProductsTableConfig.currentPage - 1) * $scope.locationMasterPreferredSellerProductsTableConfig.take;
            var payload = {
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
                    SortList: sortList
                }
            };
            if (reloadTable) {
                Factory_Master.getProductsForSellerInLocation(payload, (response) => {
                    if (response) {
                        $scope.locationPreferredSellerProductsData = response.data.payload;

                        // all products
                        if(!$scope.locationPreferredSellerProductsDataAllProd) {
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

            var objMapping;
    		if (vm.screen_id == 'counterparty') {
    			objMapping = 'counterpartyLocations';
    		} else {
    			objMapping = 'sellers';
    		}

            if ($scope.preferredProductsForSellerInLocation.length <= 0) {
                toastr.error('Please select at least one product');
                return;
            }
            var preferredProducts = [];
            $.each($scope.preferredProductsForSellerInLocation, (k, v) => {
                preferredProducts.push({
                    product: {
                        id: parseFloat(v),
                    },
                    isDeleted: false
                });
            });
            $.each($scope.NOTpreferredProductsForSellerInLocation, (k, v) => {
                preferredProducts.push({
                    product: {
                        id: parseFloat(v),
                    },
                    isDeleted: true
                });
            });
            $scope.prettyCloseModal();
            $.each($scope.formValues[objMapping][$scope.locationCurrentPreferredSellerKey].products, (_, initProdV) => {
            	$.each(preferredProducts, (_, pv) => {
            		if (pv.product.id == initProdV.product.id) {
                        pv.id = initProdV.id;
            		}
            	});
            });

            $.each(preferredProducts, (key1, val1) => {
                if(typeof val1.product.name == 'undefined') {
                    $.each($scope.locationPreferredSellerProductsDataAllProd, (key2, val2) => {
                        if(val2.id == val1.product.id && val2.name) {
                            val1.product.name = val2.name;
                        }
                    });
                }
            });

            $scope.formValues[objMapping][$scope.locationCurrentPreferredSellerKey].products = preferredProducts;

        };
        $scope.getValidFromTo = function(ValueFrom, ValueTo){

            if(ValueFrom != undefined && ValueTo != undefined){
                if(ValueFrom > ValueTo){
                toastr.error("Quantity From should be Greater than Quantity To")
                }
            }
        }
        function IsDataExists(data) {
            if (data == "" || data == null || data == undefined) {
                return true;
            } else {
                return false;
            }
        }
        function IsZeroOrHigher(data) {
            if (data >= 0) {
                return false;
            } else {
                return true;
            }
        }

        $scope.saveBargeCostDetails = function() {
            if($scope.formValues.additionalCosts)
            if($scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails.length > 0)
            {
                var isvalidbargecostdetails = true;
                var isvalidminmaxqty = true;
                var FormvalueLength = $scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails.length -1;

                for(let k = 0; k < $scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails.length; k++)
                {
                    let v = $scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails[k];
                    if(FormvalueLength != k) {
                        if(IsZeroOrHigher(v.qtyFrom) || IsZeroOrHigher(v.qtyTo) || IsDataExists(v.priceUom) || IsDataExists(v.costType) || IsDataExists(v.amount)  || IsDataExists(v.currency)){
                            isvalidbargecostdetails = false;
                            break;
                        }
                        else if(parseInt(v.qtyFrom) >= parseInt(v.qtyTo)){
                            isvalidminmaxqty = false;
                            break;
                        }
                    }
                    else{
                        if(IsZeroOrHigher(v.qtyFrom) || IsZeroOrHigher(v.qtyTo) || IsDataExists(v.priceUom) || IsDataExists(v.costType) || IsDataExists(v.amount)  || IsDataExists(v.currency)){
                            isvalidbargecostdetails = false;
                            break;
                        }
                        else if(parseInt(v.qtyFrom) >= parseInt(v.qtyTo)){
                            isvalidminmaxqty = false;
                            break;
                        }
                        else{
                            $scope.prettyCloseModal();
                        }
                    }
                }

                if(!isvalidbargecostdetails){
                    toastr.error('Please fill all required details');
                    return
                }
                if(!isvalidminmaxqty){
                    toastr.error('Quantity From Should be less than Quantity To');
                                return

                }

            }

        };
        $scope.preferredSellersSelectAllProducts = function(selectAll) {
            if (!selectAll) {
                $scope.preferredProductsForSellerInLocation = [];
                return;
            }
            var payload = {
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
            Factory_Master.getProductsForSellerInLocation(payload, (response) => {
                if (response) {
                    $scope.preferredProductsForSellerInLocation = [];
                    response.data.payload;
                    $scope.locationPreferredSellerProductsDataAllProd = _.union($scope.locationPreferredSellerProductsDataAllProd, response.data.payload);
                    $.each(response.data.payload, (k, v) => {
                        $scope.preferredProductsForSellerInLocation.push(`${v.id }`);
                        // $scope.setPrefferedPoductsForSellerInTable();
                    });
                }
            });
        };

        $scope.changeLocationMasterPreferredSellerProductsTableConfigColumnSorting = function(columnId) {
            if ($scope.locationMasterPreferredSellerProductsTableConfig.order.columnName != columnId) {
                $scope.locationMasterPreferredSellerProductsTableConfig.order.columnName = columnId;
                $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder = 'asc';
            } else if ($scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder == 'asc') {
                $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder = 'desc';
            } else {
                $scope.locationMasterPreferredSellerProductsTableConfig.order.sortOrder = 'asc';
            }
        };
        $scope.checkIfIsPrefferedProduct = function(productId) {
            var isPreffered = false;
            if ($scope.preferredProductsForSellerInLocation.indexOf(`${productId }`) != -1) {
                isPreffered = true;
            }
            return isPreffered;
        };
        $scope.changePrefferedProduct = function(productId) {
            var isAlreadyPreferred = -1;
            $.each($scope.preferredProductsForSellerInLocation, (ppk, ppv) => {
                if (parseFloat(ppv) == parseFloat(productId)) {
                    isAlreadyPreferred = ppk;
                }
            });
            if (isAlreadyPreferred == -1) {
                $scope.preferredProductsForSellerInLocation.push(`${productId }`);
                if ($scope.NOTpreferredProductsForSellerInLocation.indexOf(`${productId}`) != -1) {
	                $scope.NOTpreferredProductsForSellerInLocation.splice($scope.NOTpreferredProductsForSellerInLocation.indexOf(`${productId}`), 1);
                }
            } else {
                if ($scope.preferredProductsForSellerInLocation.indexOf(`${productId}`) != -1) {
	                $scope.preferredProductsForSellerInLocation.splice($scope.preferredProductsForSellerInLocation.indexOf(`${productId}`), 1);
                }
                $scope.NOTpreferredProductsForSellerInLocation.push(`${productId }`);
            }
        };

        /* Location Master Preffered Seller Product Table*/
        $scope.getEditInstance = function() {
            return vm.editInstance;
        };
        $scope.validateEmails = function(string, key) {
            if (!string || string.length == 0) {
                $scope.previewEmail[key] = '';
                $scope.emailPreview[key].$setValidity(key, true);
            }else{
                let emailObj = [];

                // force copy the string
                let string_copy = `${string }`;
                emailObj = string_copy.replace(/\s/g, '').split(';');

                emailObj = emailObj.filter((e) => {
                    return e;
                });

                emailObj = emailObj.filter((e) => {
                    return e;
                });
                var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (emailObj.length > 0) {
                    i = 0;
                    $.each(emailObj, (k, v) => {
                        if (!pattern.test(v)) {
                            toastr.error(`${v } is not a valid email address!`);
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
            var data = {
                Payload: {
                    EmailTemplateId: $rootScope.currentEmailTemplate,
                    BusinessId: vm.entity_id,
                    AttachmentsList : $rootScope.previewEmail.attachmentsList
                }
            };
            Factory_Master.discardSavedPreview(data, (response) => {
                if (response) {
                    if (response.status == true) {
                        toastr.success('Email Preview discarded!');
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
            let toString = [],
                ccString = [],
                toOthersString = [],
                ccOthersString = [];

            $.each($rootScope.previewEmail.to, (k, v) => {
                toString.push(v.idEmailAddress);
            });
            $.each($rootScope.previewEmail.cc, (k, v) => {
                ccString.push(v.idEmailAddress);
            });
            if(typeof $rootScope.previewEmail.toOthers == 'string') {
                toOthersString = $rootScope.previewEmail.toOthers;
            }else{
                $.each($rootScope.previewEmail.toOthers, (k, v) => {
                    toOthersString.push(v);
                });
                toOthersString = toOthersString.toString();
            }
            if(typeof $rootScope.previewEmail.ccOthers == 'string') {
                ccOthersString = $rootScope.previewEmail.ccOthers;
            }else{
                $.each($rootScope.previewEmail.ccOthers, (k, v) => {
                    ccOthersString.push(v);
                });
                ccOthersString = ccOthersString.toString();
            }


            toString = toString.toString();
            ccString = ccString.toString();

            let data = {
                Payload: {
                    Id: $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
                    Name: $rootScope.previewEmail.comment.name,
	                AttachmentsList: $rootScope.previewEmail.attachmentsList,
                    Content: $rootScope.previewEmail.content,
                    subject: $rootScope.previewEmail.subject,
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

            var request_data = payloadDataModel.create(data.Payload);

            let comments = {
                id: $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
                name: $rootScope.previewEmail.comment.name,
                emailTemplate:  $rootScope.currentEmailTemplate,
                businessId: vm.entity_id,
                secondBusinessId: null,
                thirdBusinessId: null,
                isDeleted: false,
                content: $rootScope.previewEmail.content,
                to: toString,
                cc: ccString,
                toOthers: toOthersString,
                ccOthers: ccOthersString,
                from: $rootScope.previewEmail.from
            };
            // find email template object
            $.each(vm.listsCache.EmailTemplate, (key, value) => {
                if(value.id == $rootScope.currentEmailTemplate) {
                    comments.emailTemplate = angular.copy(value);
                    return;
                }
            });
            request_data.Payload.comment = angular.copy(comments);

            Factory_Master.save_email_contract(request_data, (response) => {
                if (response) {
                    if (response.status == true) {
                        toastr.success('Email Preview Saved!');
                        if (!sendEmail) {
	                        $rootScope.previewEmail = null;
	                        $state.reload();
                        } else {
	                        callback(true);
                        }
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                        callback(false);
                    }
                }
            });
        };
        $scope.getIndex = function(arr, string) {
            return _.findIndex(arr, (o) => {
                return o.name == string;
            });
        };
        $scope.sendClaimPreviewEmail = function() {
        	// $scope.saveClaimEmail(true, function(resp){
	            let toString = [],
	                ccString = [],
	                toOthersString = [],
	                ccOthersString = [];

	            $.each($rootScope.previewEmail.to, (k, v) => {
	                toString.push(v.idEmailAddress);
	            });
	            $.each($rootScope.previewEmail.cc, (k, v) => {
	                ccString.push(v.idEmailAddress);
	            });
	            if(typeof $rootScope.previewEmail.toOthers == 'string') {
	                toOthersString = $rootScope.previewEmail.toOthers;
	            }else{
	                $.each($rootScope.previewEmail.toOthers, (k, v) => {
	                    toOthersString.push(v);
	                });
	                toOthersString = toOthersString.toString();
	            }
	            if(typeof $rootScope.previewEmail.ccOthers == 'string') {
	                ccOthersString = $rootScope.previewEmail.ccOthers;
	            }else{
	                $.each($rootScope.previewEmail.ccOthers, (k, v) => {
	                    ccOthersString.push(v);
	                });
	                ccOthersString = ccOthersString.toString();
	            }

	            let validAttachments = angular.copy($rootScope.previewEmail.attachmentsList);
	            validAttachments = _.filter(validAttachments, (el) => {
	            	return el.isIncludedInMail == true || el.isIncludedInMail == false;
	            });

	            toString = toString.toString();
	            ccString = ccString.toString();
	            let saveData = {
	                Payload: {
	                    Id: $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
	                    Name: $rootScope.previewEmail.comment.name,
	                    Content: $rootScope.previewEmail.content,
	                    Subject: $rootScope.previewEmail.subject,
                    AttachmentsList: validAttachments,
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

	            let comments = {
	                id: $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
	                name: $rootScope.previewEmail.comment.name,
	                emailTemplate:  $rootScope.currentEmailTemplate,
	                businessId: vm.entity_id,
	                secondBusinessId: null,
	                thirdBusinessId: null,
	                isDeleted: false,
	                content: $rootScope.previewEmail.content,
	                to: toString,
	                cc: ccString,
	                toOthers: toOthersString,
	                ccOthers: ccOthersString,
	                from: $rootScope.previewEmail.from
	            };
	            // find email template object
	            $.each(vm.listsCache.EmailTemplate, (key, value) => {
	                if(value.id == $rootScope.currentEmailTemplate) {
	                    comments.emailTemplate = angular.copy(value);
	                    return;
	                }
	            });
	            request_data.Payload.comment = angular.copy(comments);

	            Factory_Master.send_email_preview(request_data, (response) => {
	                if (response) {
	                    if (response.status == true) {
	                        $scope.loaded = true;
	                        toastr.success('Email Preview was sent!');
	                       let url = `${$state.$current.url.prefix + $state.params.screen_id }/edit/${ $state.params.entity_id}`;
                            if (window.location.href.indexOf('contracts/contract/email-preview/') != -1) {
                                let contractUrl = 'v2/contracts/contract/' + $state.params.entity_id + '/details';
                                window.location.href = contractUrl;
                            } else {
                                $location.path(url);
                            }
	                    } else {
	                        $scope.loaded = true;
	                        toastr.error(response.message);
	                    }
	                }
	            });
            // })

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


        $scope.sweetConfirm = function(message, callback) {
        	if (!message) {
                return false;
            }
        	// confirm = confirm(message);
            var sweetConfirmResponse = {};
        	$('.sweetConfirmModal').modal();
        	$('.sweetConfirmModal').removeClass('hide fade');
        	$('.sweetConfirmModal').css('transform', 'translateY(100px)');
        	$('.sweetConfirmModal .modal-body').text(message);

        	$('.sweetConfirmModal .sweetConfirmModalYes').on('click', () => {
        		callback(true);
        		// sweetConfirmResponse.bool = true
        		// sweetConfirmResponse.action = action
        		// $scope.sweetConfirmHasResponded(sweetConfirmResponse)
        	});
        	$('.sweetConfirmModal .sweetConfirmModalNo').on('click', () => {
        		callback(false);
        		// sweetConfirmResponse.bool = false
        		// sweetConfirmResponse.action = action
        		// $scope.sweetConfirmHasResponded(sweetConfirmResponse)
        	});
        };
        vm.useDisplayName = function(fieldName) {
            let displayNameList = [ 'invoiceStatus', 'customStatus', 'ClaimType' ];
            let found = _.indexOf(displayNameList, fieldName);
            if(found < 0) {
                return false;
            }
            return true;
        };
        $scope.checkUncheckAllRoles = function(list, value) {
            $.each(list, (k, v) => {
                if(v.name == 'ViewOnly' ||
                        v.name == 'CreateNew' ||
                        v.name == 'Edit'
                ) {
                    v.isSelected = value;
                }
            });
            return list;
        };


        $scope.notificationAction = function(type) {
		    if ($rootScope.selectedNotifications == null || typeof $rootScope.selectedNotifications == 'undefined') {
		        if (type != 'stats') {
		            toastr.error('Please select a notification!');
		            return;
		        }
		    }
		    var data = {
		        action: type,
		        notificationId: $rootScope.selectedNotifications
		    };
		    Factory_Master.notificationsActions(data, (callback) => {
		        if (callback) {
		            if (callback.status == true) {
		                if (type != 'stats') {
		                    toastr.success('Success!');
		                    $state.reload();
		                } else {
		                    $rootScope.notificationsStats = callback.data.unreadCount;
		                }
		            } else {
		                toastr.error('An error has occured!');
		            }
		        }
		    });
        };


        $scope.triggerRobStandard = function(usingStandard) {
            var vesselTypeId;
            if($scope.formValues.vesselType) {
                vesselTypeId = angular.copy($scope.formValues.vesselType.id);
            } else if (usingStandard) {
	                toastr.error('No vessel type defined');
	                vesselTypeId = null;
	                $scope.formValues.usingVesselTypeRob = false;
	                $scope.initRobTable();
	                return;
            	}

            var vesselId;
            if($scope.formValues.id) {
                vesselId = angular.copy($scope.formValues.id);
            } else {
                vesselId = 0;
            }

            usingStandard = $scope.formValues.usingVesselTypeRob;
            if(usingStandard) {
                vesselId = null;
            } else {
                vesselTypeId = null;
                $scope.initRobTable();
            }

            data = { Payload:{ usingStandard:usingStandard, vesselTypeId:vesselTypeId, vesselId:vesselId } };


            // api/masters/vessels/listRobsVessel
            Factory_Master.bring_rob_status(data, (callback) => {
		        if (callback) {
		            if (callback.status == true) {
                        let robValues = callback.data.payload;
                        $scope.formValues.robs = robValues;
                        if(!robValues.length) {
                            $scope.initRobTable();
                        }
		            } else {
		                toastr.error('An error has occured!');
		            }
		        }
            });
        };

        $scope.flattenVesselVoyages = function() {
            $scope.formValues.flattenedVoyages = [];
            $.each($scope.formValues.voyages, (vk, vv) => {
                $.each(vv.voyageDetails, (vdk, vdv) => {
                    var voyageDetailRow = {
                        id : vdv.id,
                        code : vv.code,
                        port : vdv.port,
                        portFunction : vdv.portFunction,
                        country : vdv.country,
                        eta : vdv.eta,
                        etb : vdv.etb,
                        etd : vdv.etd,
                        remarks : vdv.remarks,
                        speed: vdv.speed,
                        distanceStandard: vdv.distanceStandard,
                        distanceECA: vdv.distanceECA,
                        hasUsdRestrictions: vdv.hasUsdRestrictions
                    };
                    $scope.formValues.flattenedVoyages.push(voyageDetailRow);
                });
            });
        };

        $scope.initRobTable = function() {
            if (!$scope.formValues.robs || $scope.formValues.robs.length == 0) {
                let defaultUomId = $scope.getDefaultUom().id;
                $scope.formValues.robs = [
                    {
                        productType: { name: 'HSFO', id: 1 },
                        uom: {
                            id: defaultUomId
                        }
                    },
                    { productType: { name: 'LSFO', id: 3 },
                        uom: {
                            id: defaultUomId
                        }
                    },
                    { productType: { name: 'DOGO', id: 6 },
                        uom: {
                            id: defaultUomId
                        }
                    },
                ];
            }
            if ($scope.formValues.usingVesselTypeRob) {
                $scope.triggerRobStandard($scope.formValues.usingVesselTypeRob);
            }
        };


        $scope.uploadPriceImport = function() {
            $scope.priceDisabledUpload = true;

            let availableFile = false;
            let fileLocation = '';

            // check if file is uploaded
            if($('#fileUpload')[0].files.length > 0) {
                availableFile = true;
                fileLocation = 'input';
            }else if($scope.droppedDoc) {
                availableFile = true;
                fileLocation = 'dropped';
            }

            if(availableFile) {
                // form payload
                let formData = new FormData();
                let payload = {
                    Payload: {
                        name: 'File2',
                        documentType: {
                            transactionTypeId: 0,
                            id: 0,
                            name: '',
                            displayName: null,
                            code: '',
                            collectionName: null,
                            customNonMandatoryAttribute1: ''
                        },
                        size: 100,
                        fileType: 'FileType',
                        transactionType: {
                            id: 0,
                            name: '',
                            code: '',
                            collectionName: null
                        },
                        fileId: 1,
                        uploadedBy: {
                            id: 0,
                            name: '',
                            code: '',
                            collectionName: null
                        },
                        uploadedOn: '2017-01-11T14:21:37.96',
                        notes: '',
                        isVerified: false,
                        referenceNo: '314',
                        createdBy: {
                            id: 1,
                            name: 'Admin',
                            code: '',
                            collectionName: null
                        },
                        createdOn: '2017-01-11T14:21:37.96',
                        lastModifiedByUser: null,
                        lastModifiedOn: null,
                        id: 0,
                        isDeleted: false
                    }
                };
                formData.append('request', JSON.stringify(payload));

                // append file
                let invalidFile = false;
                if(fileLocation == 'input') {
                    if($('#fileUpload')[0].files) {
                        $.each($('#fileUpload')[0].files, (i, file) => {
                            if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                                formData.append('file', file);
                            }else{
                                invalidFile = true;
                            }
                        });
                    }
                }
                if(fileLocation == 'dropped') {
                    if($scope.droppedDoc.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        formData.append('file', $scope.droppedDoc);
                    }else{
                        invalidFile = true;
                    }
                }
                if(invalidFile) {
                    toastr.error('File type not supported. Please add xls/xlsx.');

                    delete $scope.droppedDoc;
                    delete $rootScope.droppedDoc;
                    $('#fileUpload').val('');
                    $('.fileUploadName span').text('');
                    $scope.priceDisabledUpload = false;
                    return;
                }

                // make call to upload file
                toastr.info('Uploading...');
                Factory_Master.uploadInvoicePrice(formData, (callback) => {
                    if (callback && callback.status == 200) {
                        toastr.success('File uploaded successfully.');

                        if(callback.data) {
                            if(callback.data.message != '') {
                                toastr.warning(callback.data.message);
                            }
                        }


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
                        $('.fileUploadName span').text('');
                        $scope.priceDisabledUpload = false;
                        $scope.apply();
                    }
                });
            }else{
                toastr.error('Please add file to import!');
                $scope.priceDisabledUpload = false;
                return;
            }
        };


        vm.openEmailPreview = function(url, entity_id) {
            let previewUrl = `${url }/${ entity_id}`;
            // $window.open(previewUrl, '_blank');
            $location.path(previewUrl);
        };

        $('a[data-toggle="tab"]').on('shown.bs.tab', (e) => {
            let href = _.get(window, 'location.href');
            if (href && typeof href === 'string' && href.indexOf('admin/configuration') === -1) {
                let target = $(e.target).attr('href'); // activated tab
                setTimeout(() => {
                    $scope.$apply();
                });
            }
        });
        // .custom-hardcoded-table.fixed-header
        // $('tbody').on("scroll", function(e) { //detect a scroll event on the tbody
        // 	$('thead').css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
        // });


	    $scope.initEmailTemplateTypeahead = function(rowKey, rowData) {
	        if (typeof $scope.options[`EmailTemplate_${ rowKey}`] == 'undefined') {
	            var field = {
	                Name: `EmailTemplate_${ rowKey}`,
	                Type: 'lookup',
	                clc_id: 'admin_templates',
	                masterSource: 'EmailTemplate',
	                Filter: [
	                    {
	                        ColumnName: 'EmailTransactionTypeId',
	                        Value: rowData.transactionType.id
	                    },
	                    {
	                        ColumnName: 'Process',
	                        Value: rowData.process
	                    }
	                ]
	            };
	            vm.getOptions(field);
	        }
	    };

        $scope.goToEmailTemplate = function(id) {
            window.open("/v2/email-template-editor/" + id, "_blank");
        }

	    $rootScope.$on('setInvoiceApplicableFor', (e, data) => {
	    	$scope.dtMasterSource.applyFor = data;
	    	vm.invoiceApplicableForProducts = data;
        });


        // INVOICE ACTIONS IN HEADER
		    $scope.cancel_invoice = function() {
		        Factory_Master.cancel_invoice(vm.entity_id, (callback) => {
		            if (callback.status == true) {
		                $scope.loaded = true;
		                toastr.success(callback.message);
		                $state.reload();
		            } else {
		                toastr.error(callback.message);
		            }
		        });
		    };
		    // Submit Invoice for Review
		    $scope.submit_invoice_review = function() {
		        screenLoader.showLoader();
		        Factory_Master.submit_invoice_review(vm.entity_id, (callback) => {
		            if (callback.status == true) {
		                $scope.loaded = true;
		                toastr.success(callback.message);
		                screenLoader.hideLoader();
		                $state.reload();
		            } else {
		                toastr.error(callback.message);
		            }
		        });
		    };
		    // Accept Invoice
		    $scope.accept_invoice = function() {
		        vm.fields = angular.toJson($scope.formValues);
		        Factory_Master.accept_invoice(vm.entity_id, (callback) => {
		            $scope.loaded = true;
		            if (callback.status == true) {
		                toastr.success(callback.message);
		                $state.reload();
		            } else {
		                toastr.error(callback.message);
		            }
		        });
		    };
		    // Submit Invoice for Approve
		    $scope.submit_invoice_approve = function() {
		        vm.fields = angular.toJson($scope.formValues);
		        screenLoader.showLoader();
		        Factory_Master.submit_invoice_approve(vm.entity_id, (callback) => {
		            screenLoader.showLoader();
		            if (callback.status == true) {
		                $scope.loaded = true;
		                toastr.success(callback.message);
		                $state.reload();
		                screenLoader.hideLoader();
		            } else {
		                toastr.error(callback.message);
		            }
		        });
		    };
		    // Approve Invoice
		    $scope.approve_invoice = function() {
		        vm.fields = angular.toJson($scope.formValues);
		        vm.fields = angular.element($('[name="CM.editInstance"]')).scope().formValues;

		    var validCostDetails = [];
            if (vm.fields.costDetails.length > 0) {
                $.each(vm.fields.costDetails, (k, v) => {
                    if (typeof v.product != 'undefined' && v.product != null) {
                        if (v.product.id == -1) {
                            v.product = null;
                            v.deliveryProductId = null;
                        } else {
                            	if (v.product.productId) {
                                v.product.id = v.product.productId;
                            	}
                            	if (v.product.deliveryProductId) {
                            		v.deliveryProductId = angular.copy(v.product.deliveryProductId);
                            	}
                            	v.isAllProductsCost = false;
                        }
                    }
                    if (Boolean(v.id) && !(v.id == 0 && v.isDeleted) || !v.Id && !v.isDeleted) {
                        // v.isDeleted = false;
                        	validCostDetails.push(v);
                    }
                });
            }
            vm.fields.costDetails = validCostDetails;

		        if (angular.element($('[name="CM.editInstance"]')).scope().CM.editInstance.$valid) {
			        Factory_Master.approve_invoice(vm.fields, (callback) => {
			            if (callback.status == true) {
			                $scope.loaded = true;
			                toastr.success(callback.message);
			                $state.reload();
			                screenLoader.hideLoader();
			            } else {
			                toastr.error(callback.message);
			            }
			        });
		        } else {
	                let message = 'Please fill in required fields:';
	                let names = [];
	                $.each(angular.element($('[name="CM.editInstance"]')).scope().CM.editInstance.$error.required, (key, val) => {
	                    if (names.indexOf(val.$name) == -1) {
	                        message = `${message }<br>${ val.$name}`;
	                    }
	                    names = names + val.$name;
	                });
	                toastr.error(message);
		        }
		    };
		    // Revert Invoice
		    $scope.revert_invoice = function() {
		        vm.fields = angular.toJson($scope.formValues);
		        Factory_Master.revert_invoice(vm.entity_id, (callback) => {
		            if (callback.status == true) {
		                $scope.loaded = true;
		                toastr.success(callback.message);
		                $state.reload();
		            } else {
		                toastr.error(callback.message);
		            }
		        });
		    };
		    // Reject Invoice
		    $scope.reject_invoice = function() {
		        vm.fields = angular.toJson($scope.formValues);
		        Factory_Master.reject_invoice(vm.entity_id, (callback) => {
		            if (callback.status == true) {
		                $scope.loaded = true;
		                toastr.success(callback.message);
		                $state.reload();
		            } else {
		                toastr.error(callback.message);
		            }
		        });
		    };


	    $scope.createFinalInvoice = function(fv) {
            var invoiceType = {
	            id: 2,
	            name: 'FinalInvoice',
	            code: null
	        };
	        var data = {
		        invoiceType : invoiceType,
		        entityId : vm.entity_id
	        };

            var formValues = angular.element($('[name="CM.editInstance"]')).scope().formValues;
            localStorage.setItem('invoice_createFinalInvoice', angular.toJson(data));
            window.open('/#/invoices/invoice/edit/', '_blank');
	    };

        // INVOICE ACTIONS IN HEADER


        function convertDecimalSeparatorStringToNumber(number) {
            var numberToReturn = number;
        	if (typeof number == 'string') {
	        	if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
	        	    var decimalSeparator;
	        	    var thousandsSeparator;
	        		if (number.indexOf(',') > number.indexOf('.')) {
	        			decimalSeparator = ',';
	        			thousandsSeparator = '.';
	        		} else {
	        			thousandsSeparator = ',';
	        			decimalSeparator = '.';
	        		}
		        	numberToReturn = parseFloat(parseFloat(number.split(decimalSeparator)[0].replace(new RegExp(thousandsSeparator, 'g'), '')) + parseFloat(`0.${number.split(decimalSeparator)[1]}`));
	        	} else {
	        		numberToReturn = parseFloat(number);
	        	}
        	}
        	if (isNaN(numberToReturn)) {
        		numberToReturn = 0;
        	}
        	return parseFloat(numberToReturn);
        }
        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            if (toParams.screen_id == 'invoice') {
                if (toParams.entity_id != '') {
                    $rootScope.reloadPage = true;
                } else {
                    $rootScope.reloadPage = false;
                    vm.getAdditionalCostsComponentTypes();
                }
                window.initialUomConversionDone = {
                    product : 0,
                    cost : 0
                };
            }
        });

        $scope.invoiceKeyPress = function(type) {
            $rootScope.reloadPage = false;
        };

        $scope.invoiceConvertUom = function(type, rowIndex, formValues, isUom) {
            var currentRowIndex = rowIndex;
            var additionalCost = formValues.costDetails[currentRowIndex];
            if ($rootScope.reloadPage) {
                return;
            }
            if (!isUom || $rootScope.addNewCost) {
                if (additionalCost) {
                    if (additionalCost.associatedOrderProduct == 'All' || additionalCost.product.name == 'All'){
                        getDefaultUomForAdditionalCost(additionalCost, currentRowIndex, true);
                    } else {
                        getDefaultUomForAdditionalCost(additionalCost, currentRowIndex);
                    }
                }
                $rootScope.addNewCost = false;
            }
            var currentRowIndex = rowIndex;
	    	if (!window.initialUomConversionDone) {
	    		window.initialUomConversionDone = {
		    		product : 0,
		    		cost : 0
	    		};
	    	}
            if (window.initialUomConversionDone.product != 0) {
                if (formValues.productDetails.length == window.initialUomConversionDone.product && $('form[name="CM.editInstance"]').hasClass('ng-pristine') && $('form[name="CM.editInstance"]').hasClass('ng-invalid')) {
                    return;
                }
            } else if (window.initialUomConversionDone.cost != 0) {
                if (formValues.costDetails.length == window.initialUomConversionDone.cost && $('form[name="CM.editInstance"]').hasClass('ng-pristine')) {
                    return;
                }
            }
	        calculateGrand(formValues);
	        vm.type = type;
	        if (vm.type == 'product') {
                window.initialUomConversionDone.product++;
                var product = formValues.productDetails[currentRowIndex];
	            if (typeof product.product != 'undefined' && typeof product.invoiceQuantityUom != 'undefined' && typeof product.invoiceRateUom !== 'undefined') {
	                if (product.invoiceQuantityUom == null || product.invoiceRateUom == null /* || typeof(product.invoiceAmount) == 'undefined'*/) {
	                    return;
	                };
	                $scope.getUomConversionFactor(product.product.id, 1, product.invoiceQuantityUom.id, product.invoiceRateUom.id, product.contractProductId, product.orderProductId ? product.orderProductId : product.id, (response) => {
                        var conversionFactor = response;
	                    formValues.productDetails[currentRowIndex].invoiceAmount = convertDecimalSeparatorStringToNumber(formValues.productDetails[currentRowIndex].invoiceQuantity) * (convertDecimalSeparatorStringToNumber(formValues.productDetails[currentRowIndex].invoiceRate) * conversionFactor);
	                    // formValues.productDetails[currentRowIndex].invoiceComputedAmount = formValues.productDetails[currentRowIndex].invoiceAmount;
	                    formValues.productDetails[currentRowIndex].difference = parseFloat(formValues.productDetails[currentRowIndex].invoiceAmount) - parseFloat(formValues.productDetails[currentRowIndex].estimatedAmount);

	                    calculateGrand(formValues);
	                    if (formValues.productDetails[currentRowIndex]) {
	                        calculateProductRecon();
	                    }
	                });
	            }
	            // recalculatePercentAdditionalCosts(formValues);
	        }
	        if (vm.type == 'cost') {
                window.initialUomConversionDone.cost++;
	            vm.old_cost = formValues.costDetails[currentRowIndex];
	            if (formValues.costDetails[currentRowIndex].product) {
	            	if (formValues.costDetails[currentRowIndex].product.id == -1) {
			            vm.old_product = formValues.costDetails[currentRowIndex].product.id;
	            	} else {
			            vm.old_product = formValues.costDetails[currentRowIndex].product.productId;
	            	}
	            }
	            vm.old_costType = formValues.costDetails[currentRowIndex].costType;
	            if (vm.old_product == -1) {
	                formValues.costDetails[currentRowIndex].isAllProductsCost = true;
	                if (typeof $scope.grid.appScope.fVal().dtMasterSource.applyFor == 'undefined') {
	                    $http.post(`${API.BASE_URL_DATA_INVOICES }/api/invoice/getApplicableProducts`, {
	                        Payload: formValues.orderDetails.order.id
	                    }).then((response) => {
	                        calculate(vm.old_cost, response.data.payload[1].id, vm.old_costType);
	                    });
	                } else {
                        if (formValues.productDetails[0]) {
                            if (!formValues.productDetails[0].invoicedProduct) {
                                return;
                            }
                        }
                        calculate(vm.old_cost, formValues.productDetails[0] ? formValues.productDetails[0].invoicedProduct.id : null, vm.old_costType);
	                }
	            } else {
	                calculate(vm.old_cost, vm.old_product, vm.old_costType);
	            }

                var allCostApplyFor = 0;
	            $.each($scope.grid.appScope.fVal().dtMasterSource.applyFor, (k, v) => {
	            	if (v.name != 'All') {
			            allCostApplyFor = allCostApplyFor + v.convertedFinalQuantityAmount;
	            	}
	            });
	            $.each($scope.grid.appScope.fVal().dtMasterSource.applyFor, (k, v) => {
	            	if (v.name == 'All') {
	            		v.convertedFinalQuantityAmount = allCostApplyFor;
	            	}
	            });

	            function calculate(cost, product, costType) {
	                vm.cost = cost;
	                vm.product = product;
	                vm.costType = costType;
	                // calculate extra
	                if (!formValues.costDetails[rowIndex].invoiceExtras) {
	                    formValues.costDetails[rowIndex].invoiceExtras = 0;
	                }
                    var rateUom;
	                if (vm.cost.invoiceRateUom) {
	                    rateUom = vm.cost.invoiceRateUom.id;
	                } else {
	                    rateUom = null;
	                }
	                var quantityUom;
	                if (vm.cost.invoiceQuantityUom) {
	                    quantityUom = vm.cost.invoiceQuantityUom.id;
	                } else {
	                    quantityUom = null;
	                }
	                if (!vm.costType) {
                        return;
                    }
                    if (vm.costType.name == 'Percent' || vm.costType.name == 'Flat') {
		                    rateUom = quantityUom;
                    }


	                if (vm.costType.name == 'Flat') {
	                    formValues.costDetails[rowIndex].invoiceAmount = convertDecimalSeparatorStringToNumber(vm.cost.invoiceRate);
	                    formValues.costDetails[rowIndex].invoiceExtrasAmount = convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceExtras) / 100 * convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceAmount);
	                    formValues.costDetails[rowIndex].invoiceTotalAmount = convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceExtrasAmount) + convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceAmount);
	                    calculateGrand(formValues);
	                    return;
	                }
	                $scope.getUomConversionFactor(vm.product, 1, quantityUom, rateUom, null, 1, (response) => {
	                    if (vm.costType) {
	                        if (vm.costType.name == 'Unit') {
	                            formValues.costDetails[rowIndex].invoiceAmount = response * convertDecimalSeparatorStringToNumber(vm.cost.invoiceRate) * convertDecimalSeparatorStringToNumber(vm.cost.invoiceQuantity);
	                        }

	                        formValues.costDetails[rowIndex].invoiceExtrasAmount = convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceExtras) / 100 * convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceAmount);
	                        formValues.costDetails[rowIndex].invoiceTotalAmount = convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceExtrasAmount) + convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceAmount);
	                        formValues.costDetails[rowIndex].difference = convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].invoiceTotalAmount) - convertDecimalSeparatorStringToNumber(formValues.costDetails[rowIndex].estimatedTotalAmount);

	                        formValues.costDetails[rowIndex].deliveryProductId = formValues.costDetails[rowIndex].product.deliveryProductId ? formValues.costDetails[rowIndex].product.deliveryProductId : formValues.costDetails[rowIndex].deliveryProductId;
	                        // calculate grandTotal
	                        if (vm.cost) {
	                            calculateCostRecon();
	                        }
	                        calculateGrand(formValues);
	                    }
	                });
	            }
	        }

            function getDefaultUomForAdditionalCost(additionalCost, index, isAll) {
                if (!$scope.listProductTypeGroupsDefaults) {
                    let payload1 = { Payload: {} };
                    $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload1).then((response) => {
                        if (response.data.payload != 'null') {
                            $scope.listProductTypeGroupsDefaults = response.data.payload;
                            let payload;
                            if (isAll) {
                                payload = { Payload: formValues.productDetails[0].product.id };
                            } else {
                                payload = { Payload: additionalCost.product.productId };
                            }
                            $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                                if (response.data.payload != 'null') {
                                    let productTypeGroup  = response.data.payload.productTypeGroup;
                                    let defaultUomAndCompany = _.find($scope.listProductTypeGroupsDefaults, function(object) {
                                        return object.id == productTypeGroup.id;
                                    });
                                    if (defaultUomAndCompany) {
                                        formValues.costDetails[index].invoiceRateUom = defaultUomAndCompany.defaultUom;
                                        formValues.costDetails[index].invoiceQuantityUom = defaultUomAndCompany.defaultUom;

                                    }
                                }
                            });
                        }
                    });

                } else {
                    let payload;
                    if (isAll) {
                        payload = { Payload: formValues.productDetails[0].product.id };
                    } else {
                        payload = { Payload: additionalCost.product.productId };
                    }
                    $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                        if (response.data.payload != 'null') {
                            let productTypeGroup  = response.data.payload.productTypeGroup;
                            let defaultUomAndCompany = _.find($scope.listProductTypeGroupsDefaults, function(object) {
                                return object.id == productTypeGroup.id;
                            });
                            if (defaultUomAndCompany) {
                                formValues.costDetails[index].invoiceRateUom = defaultUomAndCompany.defaultUom;
                                formValues.costDetails[index].invoiceQuantityUom = defaultUomAndCompany.defaultUom;
                            }

                        }
                    });
                }

            }

	        function recalculatePercentAdditionalCosts(formValues) {
	    		$.each(formValues.costDetails, (ck, cv) => {
	    			if (cv.costType.name == 'Percent') {
		    			$scope.invoiceConvertUom('cost', ck, formValues, true);
	    			}
	    		});
	        }

	        function calculateCostRecon() {
	            if (!vm.cost.estimatedRate || !vm.cost.invoiceAmount) {
	                return;
	            }
	            $http.post(`${API.BASE_URL_DATA_RECON }/api/recon/invoicecost`, {
	                payload: vm.cost
	            }).then((response) => {
	                if (response.data == 1) {
	                    obj = {
	                        id: 1,
	                        name: 'Matched'
	                    };
	                } else {
	                    obj = {
	                        id: 2,
	                        name: 'Unmatched'
	                    };
	                }
	                formValues.costDetails[rowIndex].reconStatus = obj;
	            });
	        }

	        function calculateProductRecon() {
                if (!product.invoiceRateCurrency || !product.estimatedRateCurrency) {
	        		return false;
                }

	        	if (!product.invoiceRateCurrency.id || !product.estimatedRateCurrency.id) {
	        		return false;
	        	}
	            $http.post(`${API.BASE_URL_DATA_RECON }/api/recon/invoiceproduct`, {
	                payload: product
	            }).then((response) => {
	                if (response.data == 1) {
	                    obj = {
	                        id: 1,
	                        name: 'Matched'
	                    };
	                } else {
	                    obj = {
	                        id: 2,
	                        name: 'Unmatched'
	                    };
	                }
	                product.reconStatus = obj;
	            });
	        }

	        function calculateGrand(formValues) {
	            if (!formValues.invoiceSummary) {
	                formValues.invoiceSummary = {};
	            }
	            // formValues.invoiceSummary.provisionalInvoiceAmount = $scope.calculateprovisionalInvoiceAmount(formValues){}
	            formValues.invoiceSummary.invoiceAmountGrandTotal = $scope.calculateInvoiceGrandTotal(formValues);
	            formValues.invoiceSummary.invoiceAmountGrandTotal -= formValues.invoiceSummary.provisionalInvoiceAmount;
	            formValues.invoiceSummary.estimatedAmountGrandTotal = $scope.calculateInvoiceEstimatedGrandTotal(formValues);
	            formValues.invoiceSummary.totalDifference = convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.invoiceAmountGrandTotal) - convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.estimatedAmountGrandTotal);
	            formValues.invoiceSummary.netPayable = convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.invoiceAmountGrandTotal) - convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.deductions);
	            $scope.changedFVal = formValues;
	        }
	    };

        $scope.getAdditionalCostsData = function() {
		        data = 0;
		        Factory_Master.getAdditionalCosts(data, (response) => {
		            if (response) {
		                if (response.status == true) {
		                    //
		                    $rootScope.additionalCostsData = response.data.payload;

		                    return response.data.payload;
		                }
		                    toastr.error('An error has occured!');
		            }
		        });
		    };
        $scope.getUomConversionFactor = function(ProductId, Quantity, FromUomId, ToUomId, contractProductId, orderProductId, callback) {
            var productId = ProductId;
            var quantity = Quantity;
            var fromUomId = FromUomId;
            var toUomId = ToUomId;
	        var data = {
	            Payload: {
	                ProductId: productId,
                    OrderProductId: orderProductId,
	                Quantity: quantity,
	                FromUomId: fromUomId,
	                ToUomId: toUomId,
                    ContractProductId: contractProductId ? contractProductId : null
	            }
	        };
	        if (toUomId == fromUomId) {
	            callback(1);
	            return;
	        }
            if (!productId || !toUomId || !fromUomId) {
                return;
            }
	        Factory_Master.getUomConversionFactor(data, (response) => {
	            if (response) {
	                if (response.status == true) {
	                    callback(response.data.payload);
	                } else {
	                    toastr.error('An error has occured!');
	                }
	            }
	        });
	    };

	    $scope.calculateprovisionalInvoiceAmount = function(formValues) {
            var grandTotal = 0;
	        $.each(formValues.relatedInvoices, (k, v) => {
	            if (!v.isDeleted && typeof v.invoiceAmount != 'undefined' && v.invoiceType.internalName == 'ProvisionalInvoice') {
	                grandTotal = grandTotal + v.invoiceAmount;
	            }
	        });
	        return grandTotal;
	    };


        $scope.calculateInvoiceGrandTotal = function(formValues) {
		        var grandTotal = 0;
		        $.each(formValues.productDetails, (k, v) => {
		            if (!v.isDeleted && typeof v.invoiceAmount != 'undefined') {
		                grandTotal = grandTotal + convertDecimalSeparatorStringToNumber(v.invoiceAmount);
		            }
		        });
		        $.each(formValues.costDetails, (k, v) => {
		            if (!v.isDeleted) {
		                if (typeof v.invoiceTotalAmount != 'undefined') {
		                    grandTotal = grandTotal + convertDecimalSeparatorStringToNumber(v.invoiceTotalAmount);
		                }
		            }
		        });
		        return grandTotal;
		    };
        $scope.calculateInvoiceEstimatedGrandTotal = function(formValues) {
	        var grandTotal = 0;
	        $.each(formValues.productDetails, (k, v) => {
	            if (!v.isDeleted && typeof v.estimatedAmount != 'undefined') {
	                grandTotal = grandTotal + v.estimatedAmount;
	            }
	        });
	        $.each(formValues.costDetails, (k, v) => {
	            if (!v.isDeleted) {
	                if (typeof v.estimatedAmount != 'undefined') {
	                    grandTotal = grandTotal + v.estimatedAmount;
	                }
	            }
	        });
	        return grandTotal;
	    };

        $scope.camelCaseToSpaces = function(str) {
            return str.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => {
                return str.toUpperCase();
            });
        };
        $scope.computeTotalInvoiceAmountOnClaimAmountChange = function() {
            var costsAmountSum = 0;
	    	$.each($scope.CM.formValues.invoiceClaimDetails, (k, v) => {
		    	costsAmountSum = costsAmountSum + convertDecimalSeparatorStringToNumber(v.invoiceAmount);
	    	});
	    	$scope.CM.formValues.invoiceSummary.invoiceAmountGrandTotal = costsAmountSum;
	    };

	    $scope.getAavailableDocumentAttachments = function(entityId, transaction) {
	    	let referenceNo = entityId;
	    	let transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
	    		return el.name == transaction;
	    	}).id;
	    	var payload = {
	    		PageFilters: {
	    			Filters: []
	    		},
	    		SortList: {
	    			SortList: []
	    		},
	    		Filters: [
	    		{
	    			ColumnName: 'ReferenceNo',
	    			Value: referenceNo
	    		},
	    		{
	    			ColumnName: 'TransactionTypeId',
	    			Value: transactionTypeId
	    		}
	    		],
	    		SearchText: null,
	    		Pagination: {
	    			Skip: 0,
	    			Take: 9999
	    		}
	    	};
	    	$http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/list`, {
	            Payload: payload
	        }).then((response) => {
		    	$rootScope.availableDocumentAttachmentsList = response.data.payload;
	        	$.each($rootScope.availableDocumentAttachmentsList, (k, v) => {
	        		v.isIncludedInMail = true;
	        	});
	        });
	    };

	    $scope.addToAttachments = function(el) {
	    	if (!el) {
	    		toastr.error('Please select a document');
	    		return;
	    	}
	    	let isInList = _.find($scope.previewEmail.attachmentsList, (v) => {
	    		return v.id == el.id;
	    	});
	    	if (isInList) {
	    		if (isInList.isIncludedInMail == false) {
	    			isInList.isIncludedInMail = true;
	    		} else {
		    		toastr.error('Attachment already added');
	    		}
	    	} else {
	    		if (!$scope.previewEmail.attachmentsList) {
	    			$scope.previewEmail.attachmentsList = [];
	    		}
	    		$scope.previewEmail.attachmentsList.push(el);
	    	}
	    };

        $scope.removeProductTypeMasterService = function(rowIndex, productTypeKey) {
            var scope = angular.element($('entity-edit-form > div')).scope();
            if (scope.formValues.locations[rowIndex].productTypes[productTypeKey].id == 0) {
                scope.formValues.locations[rowIndex].productTypes.splice(productTypeKey, 1);
            } else {
                scope.formValues.locations[rowIndex].productTypes[productTypeKey].isDeleted = true;
            }
        };

        $(document).bind('DOMNodeRemoved', (e) => {
		    // $(".tooltip").tooltip("hide");
        });

        $scope.previewOrderToBeDeliveredMail = function() {
            if (!$rootScope.selectDeliveryRows || $rootScope.selectDeliveryRows.length === 0) {
                toastr.error('Please select at least an order product');
                return;
            }

            let orderId = _.get($rootScope.selectDeliveryRows[0], 'order.id');
            let orderProductIds = _.map($rootScope.selectDeliveryRows, 'orderProductId');

            if (orderId && orderProductIds) {
                let previewEmailData = {
                    data: {
                        orderId: orderId,
                        orderProductIds: orderProductIds
                    },
                    transaction: 'OrderNoBDNToVesselEmail'
                };

                localStorage.setItem('previewEmailData', JSON.stringify(previewEmailData));

                let url = $state.href(STATE.PREVIEW_EMAIL);

                $location.path(url.replace('#', ''));
            }
        };

        $scope.sendOrderToBeDeliveredMail = function() {
            if (!$rootScope.selectDeliveryRows || $rootScope.selectDeliveryRows.length === 0) {
                toastr.error('Please select at least an order product');
                return;
            }

            let orderId = _.get($rootScope.selectDeliveryRows[0], 'order.id');
            let orderProductIds = _.map($rootScope.selectDeliveryRows, 'orderProductId');

            if (orderId && orderProductIds) {
                orderModel.sendOrderToBeDeliveredMail(orderId, orderProductIds).then(() => {
                    toastr.success('Operation completed successfully');
                });
            }
        };

        function emailNoAutomaticType() {
            let array = [];
            if (vm.listsCache.EmailType) {
                vm.listsCache.EmailType.forEach((obj) => {
                    if (obj.name != 'Automatic') {
                        array.push(obj);
                    }
                });
            }

            return array;
        }
        vm.EmailTypeNoAutomatic = emailNoAutomaticType();

        vm.enabledEmailToVessel = function() {
            if (window.location.href.indexOf("delivery/delivery") != -1 ) {
                return false;
            }
            var enabledEmailToVessel = true;
            if (typeof $rootScope.adminConfiguration != 'undefined') {
                $rootScope.adminConfiguration.email.forEach((obj) => {
                    if (obj.process == 'Order No BDN To Vessel Email') {
                        if (obj.emailType.name == 'None') {
                            enabledEmailToVessel = false;
                        }
                    }
                });
            }
            return enabledEmailToVessel;
        };

        vm.getCurrencyCodeFiltered = function() {

            let data = {
                app: 'masters',
                screen: 'currency',
                clc_id: 'masters_currencylist',
                params: {
                    UIFilters: {},
                    col: '',
                    filters: {},
                    page: 1,
                    query: '',
                    rows: 9999,
                    shrinkToFit: true,
                    sort: '',
                    modal: true
                }
            };


            $Api_Service.entity.list(data, (result) => {
                $scope.options.CurrencyCode = result.rows;
            });
        };

        vm.getDocumentTypesFiltered = function() {
            let screen_name = $state.params.screen_id.toLowerCase();
        	let transactionTypeName = {
        		// 'claim': 'Claims',
        		// 'contract': 'Contract',
        		labresult: 'Labs',
        		request_procurement: 'Request',
        		request_procurement_documents: 'Offer',
        		order_procurement: 'Order',
        		counterparty : 'Counterparties',
        		company: 'Companies',
        		country: 'Countries',
        		strategy: 'Strategies',
        		currency: 'Currencies',
        		status: 'Statuses'
        	};
        	if (transactionTypeName[screen_name]) {
        		screen_name = transactionTypeName[screen_name].toLowerCase();
        	}
            if (screen_name) {
                $scope.formValues.documentType = null;
            }

    	    let transactionTypeId = _.find(vm.listsCache.TransactionType, (el) => {
    			return el.name.toLowerCase().indexOf(screen_name) > -1;
    		}).id;

	    	var documentTypeFilters = [
	    		{
	    			ColumnName: 'ReferenceNo',
	    			Value: vm.entity_id
	    		},
	    		{
	    			ColumnName: 'TransactionTypeId',
	    			Value: transactionTypeId
	    		}
    		];

            let data = {
                app: 'masters',
                screen: 'documenttype',
                clc_id: 'masters_documenttype',
                params: {
                    UIFilters: {},
                    col: '',
                    filters: documentTypeFilters,
                    page: 1,
                    query: '',
                    rows: 9999,
                    shrinkToFit: true,
                    sort: ''
                }
            };


            $Api_Service.entity.list(data, (result) => {
            	$scope.options.DocumentType = result.rows;
            });
        };
        $scope.createOrderFromOrderList = function() {
            if ($rootScope.selectedOrderListRows) {
                if ($rootScope.selectedOrderListRows.length == 1) {
                    localStorage.setItem('ordersFromOrderList', angular.toJson($rootScope.selectedOrderListRows[0]));
                } else {
                    localStorage.setItem('ordersFromOrderList', angular.toJson($rootScope.selectedOrderListRows));
                }
            }
            let payload = [];
            $.each($rootScope.selectedOrderListRows, (k, v) => {
                if ($rootScope.selectedOrderListRows[k].order.id) {
                    let obj = {
                        Id: $rootScope.selectedOrderListRows[k].order.id
                    };
                    payload.push(obj);
                }
            });

            orderModel.verifyOrders(payload).then((responseData) => {
            	$rootScope.$broadcast('applyRawFilters', true);
            }).catch((err) => {
            });
        };
        $scope.changeCurrency = function(element) {
            let elem = `#${ element}`;
            let widthTemp = `#width_tmp_option_${ element}`;
            let option = `#${ element } option:selected`;
            let select = '#width_tmp_select_' + 'EstimatedSettlementAmount';

            $(widthTemp).html($(option).text());
            $(elem).width($(select).width());
        };

        $scope.changeCurrencyValues = function(element) {
            let array = [ 'ActualSettlementAmount', 'EstimatedSettlementAmount', 'CompromisedAmount', 'OrderPrice', 'NoClaimAmmount' ];
            if (array.indexOf(element) != -1) {
                let elem = `#${ element}`;
                let widthTemp = `#width_tmp_option_${ element}`;
                let option = `#${ element } option:selected`;
                let select = `#width_tmp_select_${ element}`;

                $(widthTemp).html($(option).text());
                $(elem).width($(select).width());
                if (element == 'EstimatedSettlementAmount') {
                    $scope.changeCurrency('ActualSettlementAmount');
                    $scope.changeCurrency('CompromisedAmount');
                    $scope.changeCurrency('NoClaimAmmount');
                }
            }
        };
        $rootScope.$on('changeCurrencyValues', (event, res) => {
            $scope.changeCurrencyValues(res);
        });

        $scope.addLocationProductToConversion = function(index, allowProduct, isMainProduct) {
            if (!$scope.formValues.locationProducts[index].conversionFactors) {
                $scope.formValues.locationProducts[index].conversionFactors = [];
            }
            let selectedProduct, isAlreadyAdded = 0, indexDeleted = -1;
            let payload;
            setTimeout(() => {
                if (isMainProduct) {
                    selectedProduct = $scope.formValues.locationProducts[index];
                    if ($scope.formValues.locationProducts[index].conversionFactors.length) {
                        var allowProducts = $scope.formValues.locationProducts[index].allowedProducts;
                        if (allowProducts.length) {
                            $scope.formValues.locationProducts[index].conversionFactors.forEach((value, key) => {
                                var idIndex = _.findIndex(allowProducts, (o) => {
                                    return o.id == value.product.id;
                                });
                                if (idIndex == -1) {
                                    if (value.id == 0) {
                                        $scope.formValues.locationProducts[index].conversionFactors.splice(key, 1);
                                        return;
                                    }
                                    $scope.formValues.locationProducts[index].conversionFactors[key].isDeleted = true;
                                }
                            });
                        } else {
                            var indexProduct = $scope.formValues.locationProducts[index].conversionFactors.length - 1;
                            $scope.formValues.locationProducts[index].conversionFactors[indexProduct].isDeleted = true;
                        }
                    }
                }else if (allowProduct != null) {
                    selectedProduct = { product: allowProduct };
                } else if (allowProduct == null) {
                    var allowProducts = $scope.formValues.locationProducts[index].allowedProducts;
                    if (allowProducts.length) {
                        $scope.formValues.locationProducts[index].conversionFactors.forEach((value, key) => {
                            if (value.product.id != $scope.formValues.locationProducts[index].product.id) {
                                var idIndex = _.findIndex(allowProducts, (o) => {
                                    return o.id == value.product.id;
                                });
                                if (idIndex == -1) {
                                    indexDeleted = key;
                                    if (value.id == 0) {
                                        $scope.formValues.locationProducts[index].conversionFactors.splice(indexDeleted, 1);
                                        return;
                                    }
                                    $scope.formValues.locationProducts[index].conversionFactors[indexDeleted].isDeleted = true;
                                }
                            }
                        });
                    } else {
                        $scope.formValues.locationProducts[index].conversionFactors.forEach((value, key) => {
                            if (value.product.id != $scope.formValues.locationProducts[index].product.id && !value.isDeleted) {
                                if (value.id == 0) {
                                    $scope.formValues.locationProducts[index].conversionFactors.splice(key, 1);
                                    return;
                                }
                                $scope.formValues.locationProducts[index].conversionFactors[key].isDeleted = true;
                            }
                        });
                    }
                }
                if ($scope.formValues.locationProducts[index].conversionFactors) {
                    if (selectedProduct) {
                        let indexProduct = _.findLastIndex($scope.formValues.locationProducts[index].conversionFactors, (o) => {
                            return o.product.id == selectedProduct.product.id;
                        });
                        if (indexProduct != -1) {
                            if (!$scope.formValues.locationProducts[index].conversionFactors[indexProduct].isDeleted) {
                                toastr.error('Product is already added');
                                isAlreadyAdded = 1;
                            }
                        }
                    }
                }
            });
        };
        $scope.addProductToConversion = function(index, allowProduct, isMainProduct) {
            if (index == "tanks") {
                return;
            }
            if($scope.formValues.tradeBookMappings && $scope.formValues.tradeBookMappings.length>0 && $scope.formValues.tradeBookMappings.count!=0){
                if (!$scope.formValues.tradeBookMappings[index].conversionFactors) {
                    $scope.formValues.tradeBookMappings[index].conversionFactors = [];
                }
            }else{
                if (!$scope.formValues.products[index].conversionFactors) {
                    $scope.formValues.products[index].conversionFactors = [];
                }

            }

            let selectedProduct, isAlreadyAdded = 0, indexDeleted = -1;
            let payload;
            setTimeout(() => {
                if (isMainProduct) {
                    selectedProduct = $scope.formValues.products[index];
                    if ($scope.formValues.products[index].conversionFactors.length) {
                        var allowProducts = $scope.formValues.products[index].allowedProducts;
                        if (allowProducts.length) {
                            $scope.formValues.products[index].conversionFactors.forEach((value, key) => {
                                var idIndex = _.findIndex(allowProducts, (o) => {
                                    return o.id == value.product.id;
                                });
                                if (idIndex == -1) {
                                    if (value.id == 0) {
                                        $scope.formValues.products[index].conversionFactors.splice(key, 1);
                                        return;
                                    }
                                    $scope.formValues.products[index].conversionFactors[key].isDeleted = true;
                                }
                            });
                        } else {
                            var indexProduct = $scope.formValues.products[index].conversionFactors.length - 1;
                            $scope.formValues.products[index].conversionFactors[indexProduct].isDeleted = true;
                        }
                    }
                } else if (allowProduct != null) {
                    selectedProduct = { product: allowProduct };
                } else if (allowProduct == null) {
                    var allowProducts = $scope.formValues.products[index].allowedProducts;
                    if (allowProducts.length) {
                        $scope.formValues.products[index].conversionFactors.forEach((value, key) => {
                            if (value.product.id != $scope.formValues.products[index].product.id) {
                                var idIndex = _.findIndex(allowProducts, (o) => {
                                    return o.id == value.product.id;
                                });
                                if (idIndex == -1) {
                                    indexDeleted = key;
                                    if (value.id == 0) {
                                        $scope.formValues.products[index].conversionFactors.splice(indexDeleted, 1);
                                        return;
                                    }
                                    $scope.formValues.products[index].conversionFactors[indexDeleted].isDeleted = true;
                                }
                            }
                        });
                    } else {
                        $scope.formValues.products[index].conversionFactors.forEach((value, key) => {
                            if (value.product.id != $scope.formValues.products[index].product.id && !value.isDeleted) {
                                if (value.id == 0) {
                                    $scope.formValues.products[index].conversionFactors.splice(key, 1);
                                    return;
                                }
                                $scope.formValues.products[index].conversionFactors[key].isDeleted = true;
                            }
                        });
                    }
                }
                if ($scope.formValues.products[index].conversionFactors) {
                    if (selectedProduct) {
                        let indexProduct = _.findLastIndex($scope.formValues.products[index].conversionFactors, (o) => {
                            return o.product.id == selectedProduct.product.id;
                        });
                        if (indexProduct != -1) {
                            if (!$scope.formValues.products[index].conversionFactors[indexProduct].isDeleted) {
                                toastr.error('Product is already added');
                                isAlreadyAdded = 1;
                            }
                        }
                    }
                }
                if (!isAlreadyAdded && indexDeleted == -1 && selectedProduct) {
                    payload = { Payload: selectedProduct.product.id };
                    $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/getProdDefaultConversionFactors`, payload).then((response) => {
                        if (response.data.payload != 'null') {
                            let contractConversionFactor = {
                                id: 3,
                                name: "Standard (Product)"
                            }
                            let object = {
                                id: 0,
                                product : selectedProduct.product,
                                value: response.data.payload.value,
                                massUom: response.data.payload.massUom,
                                volumeUom: response.data.payload.volumeUom,
                                contractConversionFactorOptions: contractConversionFactor
                            };
                            $scope.formValues.products[index].conversionFactors.push(object);
                            $scope.defaultUomSludge(index);
                        }
                    });
                }
            });
        };

        $scope.defaultUomSludge = function(index) {
            let size = $scope.formValues.products[index].conversionFactors.length - 1;
            payload = { Payload: $scope.formValues.products[index].conversionFactors[size].product.id };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`, payload).then((response) => {
                    if (response.data.payload != 'null') {
                        let productTypeGroup  = response.data.payload.productTypeGroup;
                        let sludgeProductTypeGroup = _.find(vm.listsCache.ProductTypeGroup, { name : 'Sludge' });
                        payload = { Payload: {} };
                        $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/listProductTypeGroupsDefaults`, payload).then((response) => {
                            if (response.data.payload != 'null') {
                               let defaultUomAndCompany = _.find(response.data.payload, function(object) {
                                    return object.id == productTypeGroup.id;
                               });
                               if (defaultUomAndCompany) {
                                    if (defaultUomAndCompany.id == sludgeProductTypeGroup.id) {
                                        $scope.formValues.products[index].priceUom = defaultUomAndCompany.defaultUom;
                                        $scope.formValues.products[index].mtmPriceUom = defaultUomAndCompany.defaultUom;
                                    }
                                    if ($scope.formValues.products[index].summary) {
                                        $scope.formValues.products[index].summary.uom = defaultUomAndCompany.defaultUom.name;
                                    }
                                    for (let i = 0; i < $scope.formValues.details.length; i++) {
                                        $scope.formValues.details[i].uom = defaultUomAndCompany.defaultUom;
                                    }
                                    if ($scope.formValues.products[index].details) {
                                        for (let i = 0; i < $scope.formValues.products[index].details.length; i++) {
                                            $scope.formValues.products[index].details[i].uom = defaultUomAndCompany.defaultUom;
                                        }
                                    }

                               }

                            }
                        });


                    }
            });

        }

        vm.saveConversionFactors = function(conversionFactors, conversionFactorsDropdown) {
            if (conversionFactorsDropdown && conversionFactors.contractConversionFactorOptions.id == 3) {
                payload = { Payload: conversionFactors.product.id };
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/products/getProdDefaultConversionFactors`, payload).then((response) => {
                    if (response.data.payload != 'null') {
                        conversionFactors.value = response.data.payload.value;
                        conversionFactors.massUom = response.data.payload.massUom;
                        conversionFactors.volumeUom = response.data.payload.volumeUom;
                        if (conversionFactors.contractProductId) {
                            let conversionFactorsList = [];
                            conversionFactorsList.push(conversionFactors);
                            payload = { Payload: conversionFactorsList };
                            $http.post(`${API.BASE_URL_DATA_CONTRACTS  }/api/contract/contract/saveConversionFactorsForContractProduct`, payload).then((response) => {
                                if (response.data.payload != 'null') {
                                    let res = response.data.payload[0];
                                    ctrl.data.products[index].convFactorMassUom = res.massUom;
                                    ctrl.data.products[index].convFactorValue = res.value;
                                    ctrl.data.products[index].convFactorVolumeUom = res.volumeUom;

                                }
                            });
                        }
                    }
                });

            } else {
                if (conversionFactors.contractProductId) {
                    let conversionFactorsList = [];
                    conversionFactorsList.push(conversionFactors);
                    payload = { Payload: conversionFactorsList };
                    $http.post(`${API.BASE_URL_DATA_CONTRACTS  }/api/contract/contract/saveConversionFactorsForContractProduct`, payload).then((response) => {
                        if (response.data.payload != 'null') {
                            let res = response.data.payload[0];
                            ctrl.data.products[index].convFactorMassUom = res.massUom;
                            ctrl.data.products[index].convFactorValue = res.value;
                            ctrl.data.products[index].convFactorVolumeUom = res.volumeUom;

                        }
                    });
                }
            }



        }

        $scope.autoSaveNotes = function() {
            var generalNotesScope = angular.element($('.grid_generalNotes')).scope();
            let length = window.location.href.split('/#/')[1].split('/').length - 1;
            let id = parseFloat(window.location.href.split('/#/')[1].split('/')[length]);
            if (!isNaN(id)) {
                if (window.location.href.indexOf('request/') != -1) {
                    payload = { Payload: {
                        "requestId": id,
                        "requestNotes": generalNotesScope.formValues.notes
                    }};
                    $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/request/autosave`, payload).then((response) => {
                        if (response.data.payload != 'null') {
                            generalNotesScope.formValues.notes = response.data.payload;
                        }
                    });
                } else  if (window.location.href.indexOf('order/') != -1) {
                    payload = { Payload: {
                        "orderId": id,
                        "orderNotes": generalNotesScope.formValues.notes
                    }};
                    $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/order/autosave`, payload).then((response) => {
                        if (response.data.payload != 'null') {
                            generalNotesScope.formValues.notes = response.data.payload;
                        }
                    });
                } else if (window.location.href.indexOf('group-of-requests/') != -1) {
                    payload = { Payload: {
                        "rfqId": id,
                        "rfqNotes": generalNotesScope.formValues.notes
                    }};
                    $http.post(`${API.BASE_URL_DATA_PROCUREMENT}/api/procurement/rfq/autosave`, payload).then((response) => {
                        if (response.data.payload != 'null') {
                            generalNotesScope.formValues.notes = response.data.payload;
                        }
                    });

                } else  if (vm.app_id == 'labs' && vm.screen_id == 'labresult' && id > 0) {
                    payload = { Payload: {
                        "LabResultId": id,
                        "labNotes": generalNotesScope.formValues.notes
                    }};
                    $http.post(`${API.BASE_URL_DATA_LABS}/api/labs/autosave`, payload).then((response) => {
                        if (response && response.data && response.data.payload != 'null') {
                            generalNotesScope.formValues.notes = response.data.payload;
                        }
                    });
                }
            }
        }


         $scope.setRatingC = function() {
            let rating = $(".my-rating");
            for (let i = 0; i < rating.length; i++) {
                let rate =  $(rating[i]).attr("rating");
                if (Number(rate) > 0) {
                    $(rating[i]).starRating({
                        initialRating: rate,
                        strokeWidth: 40,
                        starSize: 20,
                        totalStars: 5,
                        emptyColor: 'white',
                        strokeColor: '#337AB7',
                        activeColor: '#337AB7',
                        useGradient: false,
                        minRating: 1,
                        readOnly: true,
                        callback: function(currentRating, $el){
                            console.log('DOM element ', $el);
                        }
                    });
                }
            }
        }


        $scope.rating = function() {
            //or for example
            let options = {
                min_value: 1,
                max_value: 5,
                step_size: 0.1,
                initial_value: 0,
                readonly: true
            }
            $(".rating").rate(options);
            let rating = $(".rating");
            for (let i = 0; i < rating.length; i++) {
                let rate =  $(rating[i]).attr("rating");
                if (Number(rate) > 0) {
                    $(rating[i]).rate("setValue", Number(rate));
                }
            }
        }


        $scope.openSellerRatingForPreferredLocation = function(location, counterparty) {
            let data = {
                "location": location,
                "counterparty": counterparty
            }
            localStorage.setItem('sellerRatingForPreferredLocation', JSON.stringify(data));
            window.open(`/#/${ vm.app_id }/${ vm.screen_id }/seller-rating/${ vm.entity_id }/${ location.id }`, "_blank");


        }

        $scope.navigateToAuditCounterparty = function() {
            $location.path(`/${ vm.app_id }/${ vm.screen_id }/audit-log/${ vm.entity_id }/${ vm.location_id }`);

        }

        $scope.navigateToDocumentsCounterparty = function() {
            $location.path(`/${ vm.app_id }/${ vm.screen_id }/documents/${ vm.entity_id }/${ vm.location_id }`);

        }

        $scope.navigateToSellerRating = function() {
            if (vm.location_id) {
                $location.path(`/${ vm.app_id }/${ vm.screen_id }/seller-rating/${ vm.entity_id }/${ vm.location_id }`);
                return;
            }
            localStorage.setItem('counterparty', JSON.stringify($scope.formValues.displayName));
            $location.path(`/${ vm.app_id }/${ vm.screen_id }/seller-rating/${ vm.entity_id }/0`);
        }

        $scope.isCustomerCounterparty = function() {
        	var isCustomer = false;
        	$.each($scope.formValues.counterpartyTypes, (k,v) => {
        		if (v.internalName == "Customer" || v.name == "Customer") {
		        	isCustomer = true;
        		}
        	})
        	return isCustomer;
        }



          // modal close
        $scope.prettyCloseModal = function() {
            let modalStyles = {
                transition: '0.3s',
                opacity: '0',
                transform: 'translateY(-50px)'
            };
            let bckStyles = {
                opacity: '0',
                transition: '0.3s'
            };
            $('[modal-render=\'true\']').css(modalStyles);
            $('.modal-backdrop').css(bckStyles);
            setTimeout(() => {
                if ($scope.modalInstance) {
                    $scope.modalInstance.close();
                }
                // $(".modal-scrollable").css("display", "none")
            }, 500);
        };

        $scope.showModalConfirmDeletePreferredLocationWithRating = function(message, additionalData, callback) {
            $scope.confirmModalAdditionalData = additionalData;
            $('.confirmModalDeletePreferredLocationWithRating').modal();
            $('.confirmModalDeletePreferredLocationWithRating').removeClass('hide');
            $('.modal-open.page-overflow .modal-scrollable').css("overflow-x", "hidden !important");
            $scope.confirmModalData = {
                message : message
            };
            $scope.confirmedModal = false;
            $('.confirmAction1').on('click', () => {

                if ($scope.confirmedModal) {
                    return;
                }
                if ($scope.key >= 0) {
                    $scope.formValues.counterpartyLocations[$scope.key].isDeleted = true;
                }
                $scope.key = -1;
                $scope.confirmedModal = true;
                $scope.$apply();
                return callback($scope.confirmModalAdditionalData);
            });
        };

        $scope.deleteCouterpartyaccountno = function(key) {

            if($scope.formValues.counterpartyBankAccounts.length >0){
                if($rootScope.TempcounterpartyBankAccounts != undefined){
                    $scope.formValues.counterpartyBankAccounts[key].isDeleted =true
                    $rootScope.TempcounterpartyBankAccounts.push($scope.formValues.counterpartyBankAccounts[key]);
                }else{
                    $rootScope.TempcounterpartyBankAccounts = [];
                    $scope.formValues.counterpartyBankAccounts[key].isDeleted =true
                    $rootScope.TempcounterpartyBankAccounts.push($scope.formValues.counterpartyBankAccounts[key]);
                }
                $scope.formValues.counterpartyBankAccounts.splice(key, 1);
            }
        }

        /*Additional Cost Details Popup Close Modal start*/

        $scope.PopupprettyCloseModal = function(){
            $scope.showModalAdditionalCostDetailsConfirmation('Do you still want to Cancel Additional Cost Details?', true, (modalResponse) => {
                if (modalResponse) {
                    $scope.prettyCloseModal();
                }
            });
        }

        $scope.showModalAdditionalCostDetailsConfirmation = function(message, additionalData, callback) {

            if($scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails.length == 0){
                $scope.prettyCloseModal();
                return;
            }

            $scope.confirmModalAdditionalData = additionalData;
            $('.AdditionalCostDetailsModalConfirmation').modal();
            $('.AdditionalCostDetailsModalConfirmation').removeClass('hide');
            $('.modal-open.page-overflow .modal-scrollable').css("overflow-x", "hidden !important");
            $scope.confirmModalData = {
                message : message
            };

            $scope.confirmedModal = false;
            $('.confirmAction1').on('click', () => {

                if ($scope.confirmedModal) {
                    return;
                }
                else{

                    if($rootScope.RootTempadditionalCosts != undefined && $rootScope.RootTempadditionalCosts.length !=0){
                       $scope.formValues.additionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails = angular.copy($rootScope.RootTempadditionalCosts[$scope.CurrentadditionalCostsdetails].additionalCostDetails);
                    }
                }

                $scope.key = -1;
                $scope.confirmedModal = true;
               // $scope.$digest()
                $scope.$apply();
                return callback($scope.confirmModalAdditionalData);
            });
        };
        /*Additional Cost Details Popup Close Modal End*/
        $scope.deleteLocation = function(key) {
            if ($scope.formValues.counterpartyLocations[key].isSpecificLocation && $scope.formValues.counterpartyLocations[key].rating && $scope.formValues.counterpartyLocations[key].lastModifiedBy && $scope.formValues.counterpartyLocations[key].lastModifiedOn) {
                $scope.key = key;
                $scope.showModalConfirmDeletePreferredLocationWithRating('Seller Rating also would be removed. Do you still want to remove the location?', true, (modalResponse) => {
                    if (modalResponse) {
                        $scope.prettyCloseModal();
                    }
                });
            } else {
                $scope.formValues.counterpartyLocations[key].isDeleted = true;

                let locationContacts = $filter('filter')($scope.formValues.counterpartyLocations, {isNewContact: false});
                angular.forEach(locationContacts, (locationContact) => {
                    locationContact.isDeleted = false;
                });
                $scope.formValues.counterpartyLocations[key].locationContacts = locationContacts;
            }
        }

        $scope.resetLocationData = function(location) {

            location.isSpecificLocation = false;
            location.rating = null;
            location.lastModifiedBy = null;
            location.lastModifiedOn = null
        }

        $scope.setNewLocationContacts = function(counterpartyLocationIndex){
            let locationContacts = [];
            _.each($scope.formValues.contacts, (contact) => {
                if(contact.email){
                    locationContacts.push({ email: contact.email, contactId: contact.id, indexId: locationContacts.length + 1, isNewContact: true });
                }
            });
            $scope.preferredContacts[counterpartyLocationIndex] = locationContacts;
        }

        $scope.addEmptyLocationContact = function(){
            if($scope.formValues.counterpartyLocations){
                $scope.setNewLocationContacts($scope.formValues.counterpartyLocations.length);
                $scope.formValues.counterpartyLocations.push({id:0, locationContacts:[]});
            } else{
                $scope.setNewLocationContacts(0);
                $scope.formValues.counterpartyLocations = [{id:0, locationContacts:[]}];
            }
        }

        $scope.getLocationDetails = function(){
            const index = $scope.formValues.sellers && $scope.formValues.sellers.length >0 ? $scope.formValues.sellers.length-1 : 0;
            const counterpartyId = $scope.formValues.sellers[index].counterparty.id;
            const locationId = $scope.formValues? $scope.formValues.id : 0;

            if(locationId > 0){
                let payload = {
                    Payload: {counterparty: {id: counterpartyId}, location: {id: locationId}}
                }

                Factory_Master.getLocationSellerContacts(payload, (callback) => {
                    if (callback) {
                        $.each(callback, (k, v) => {
                            $scope.preferredContacts[k] = callback[k].locationContact[0];
                        });
                    }
                });
            }
        }

        $scope.locationContactsChange= function(index){
            // as per API requirement
            let counterpartyLocations = $scope.formValues.counterpartyLocations[index];

            if(counterpartyLocations.locationContacts && counterpartyLocations.locationContacts.length > 0){
            counterpartyLocations.locationContacts.forEach(function (element) {
                if(element.id && element.id > 0 && counterpartyLocations.id && counterpartyLocations.id >0 && counterpartyLocations.id != element.locationSellerId){
                    element.id = 0;
                    element.locationSellerId = counterpartyLocations.id;
                }
                if(counterpartyLocations.id && counterpartyLocations.id >0 && counterpartyLocations.id != element.locationSellerId){
                    element.locationSellerId = counterpartyLocations.id;
                }
              });
            }
        }

        $scope.$watch('formValues.contacts', function (newValue, oldValue) {
            if (newValue === oldValue)
                return;
            _.each($scope.preferredContacts, (locationContacts, index) => {
                locationContacts = $filter('filter')(locationContacts, { isNewContact: false });
                _.each($scope.formValues.contacts, (contact) => {
                    let isAlreadyExists = contact.id == 0 ? false : $filter('filter')(locationContacts, { contactId: contact.id }).length > 0;
                    if (contact.email && !isAlreadyExists) {
                        locationContacts.push({ email: contact.email, contactId: contact.id, indexId: locationContacts.length + 1, isNewContact: true });
                    }
                });
                $scope.preferredContacts[index] = locationContacts;
            });
        }, true);

        $scope.deleteSeller = function(key) {
            $scope.formValues.sellers[key].isDeleted = true;

            let locationContacts = $filter('filter')($scope.formValues.sellers[key].locationContacts, {isNewContact: false});
            angular.forEach(locationContacts, (locationContact) => {
                locationContact.isDeleted = false;
            });
            $scope.formValues.counterpartyLocations[key].locationContacts = locationContacts;
        }

        $scope.deleteVesselProduct = function(key) {
            //Delete childs
            if($scope.formValues.vesselProducts[key].product!=null){
                angular.forEach($scope.formValues.vesselProducts[key].vesselProductTanks, (input, vptKey) => {
                    $scope.formValues.vesselProducts[key].vesselProductTanks[vptKey].isDeleted = true;
                });
                $scope.formValues.vesselProducts[key].isDeleted = true;
            }else{
                $scope.formValues.vesselProducts.splice(key,1);
            }
        }

        $scope.deleteVesselProductTank = function(vpKey, vptKey) {
            if($scope.formValues.vesselProducts[vpKey].vesselProductTanks[vptKey].id!=undefined){
                $scope.formValues.vesselProducts[vpKey].vesselProductTanks[vptKey].isDeleted = true;
            }else{
                $scope.formValues.vesselProducts[vpKey].vesselProductTanks.splice(vptKey, 1);
            }
        }

        $scope.addnewLocationProduct = () => {
        	if (!$scope.formValues.locationProducts) {
        		$scope.formValues.locationProducts = [];
        	}
        	$scope.formValues.locationProducts.push({"id":0});
        }

        $scope.initMultilookupsForLocationProducts = () => {
        	$scope.multilookupsForLocationProducts = [
	        	{"Unique_ID":"locationProductTypes", "Name":"locationProductTypes", "Label":"LOCATION_PRODUCT_TYPES", "Required":false, "masterSource":"ProductType", "LastOnRow":true},
				{"Unique_ID":"locationHSFO05Grades", "Name":"locationHSFO05Grades", "Label":"LOCATION_HSFO_05_GRADES", "Required":false, "masterSource":"Product", "LastOnRow":true},
				{"Unique_ID":"locationDistillateGrades", "Name":"locationDistillateGrades", "Label":"LOCATION_DISTILLATE_GRADES", "Required":false, "masterSource":"Product", "LastOnRow":true},
				{"Unique_ID":"locationHSFO35Grades", "Name":"locationHSFO35Grades", "Label":"LOCATION_HSFO_35_GRADES", "Required":false, "masterSource":"Product", "LastOnRow":true}
        	]
        }

        $scope.isLocationBopsDetailsVisible = () => {
        	if ($rootScope.adminConfiguration.master.isLocationBopsDetailsVisible) {
        		return true;
        	}
    		return false;
        }

        $scope.deleteTradeBookItem = function(key) {
            if($scope.formValues.tradeBookMappings[key].id){
                $scope.formValues.tradeBookMappings[key].isDeleted = true;
            }
            else
                $scope.formValues.tradeBookMappings.splice(key, 1);

            let noDeleted = $scope.formValues.tradeBookMappings.filter(function(item){
                return item.isDeleted == true;
            });

            if(noDeleted.length ==  $scope.formValues.tradeBookMappings.length )
                $scope.addnewTradebookItem(false);
        }

        $scope.initLocationBopsDetailsDefaultValues = () => {
        	$timeout(()=>{
				!$scope.formValues.distanceSECAArea ? $scope.formValues.distanceSECAArea = 0 : "";
				!$scope.formValues.pilotInTime ? $scope.formValues.pilotInTime = 1 : "";
				!$scope.formValues.earliestPortTradingTime ? $scope.formValues.earliestPortTradingTime = 14 : "";
				!$scope.formValues.latestPortTradingTime ? $scope.formValues.latestPortTradingTime = 3 : "";
        	})
        }


        $scope.selectCounterpartyType = (item) => {

            // Empty model
            $scope.formValues.counterpartyTypeAccessModel = null;

            if(typeof $scope.formValues.roles.accessCounterpartyTypes  == 'undefined'){
                $scope.formValues.roles.accessCounterpartyTypes  = [];
            }

            let exists = $scope.formValues.roles.accessCounterpartyTypes.filter(e => e.id === item.id);
            if(exists.length > 0) {
                // Already in list
                toastr.error('This counterparty type already exists!');
                return
            }

            $scope.formValues.roles.accessCounterpartyTypes.push(item);
        }


        $scope.removeArrayFromArray = (toRemove = [], originalArray, key = 'id') => {
            const newList =  originalArray.filter((element) => {
                if(toRemove.some(x => x.id === element.id)) {
                    return false;
                }
                return true;
            });

            return newList;
        }

        $scope.removeCounterpartyType = (item) => {
            let futureArray = $scope.formValues.roles.accessCounterpartyTypes.filter(e => e.id !== item.id);
            $scope.formValues.roles.accessCounterpartyTypes = futureArray;
        }


        $scope.bargeCostSequenceChange = (currentadditionalCostsdetails, key, value) => {
            if($scope.formValues.additionalCosts[currentadditionalCostsdetails].additionalCostDetails[key+1]) {
                $scope.formValues.additionalCosts[currentadditionalCostsdetails].additionalCostDetails[key+1].qtyFrom = $scope.formValues.additionalCosts[currentadditionalCostsdetails].additionalCostDetails[key].qtyTo;
            }
        }
        $scope.bargeCostSequenceUomChange = (currentadditionalCostsdetails) => {
            $.each($scope.formValues.additionalCosts[currentadditionalCostsdetails].additionalCostDetails, (k,v) => {
                if(k !== 0) {
                    v.priceUom = $scope.formValues.additionalCosts[currentadditionalCostsdetails].additionalCostDetails[0].priceUom;
                }
            })
        }
        $scope.bargeCostSequenceQtyToInvalid = (currentadditionalCostsdetails, key, value) => {
            var qtyTo = convertDecimalSeparatorStringToNumber(value.qtyTo);
            var qtyFrom = convertDecimalSeparatorStringToNumber(value.qtyFrom);
            if($scope.formValues.additionalCosts[currentadditionalCostsdetails].additionalCostDetails[key+1]) {
                nextQtyTo = $scope.formValues.additionalCosts[currentadditionalCostsdetails].additionalCostDetails[key+1].qtyTo;
            } else {
                nextQtyTo = false;
            }
            if(qtyTo <= qtyFrom) {
                return true;
            }
            if(nextQtyTo == false) {
                return false;
            }
            if(qtyTo >= nextQtyTo ) {
                return true;
            }
            return false;
        }






/* USER master customer lookup logic */
        $scope.openCustomerLookup = () => {
            $scope.userMasterSelectedCustomersIdsArray = [];
            $.each($scope.formValues.accessCustomers, (k,v) => {
                $scope.userMasterSelectedCustomersIdsArray.push(v.id);
                v.isSelected = true;
            })
            if(!$scope.userMasterCustomerTableConfig) {
                $scope.userMasterCustomerTableConfig = {}
            }
            $scope.userMasterCustomerTableConfig.currentPage = 1;
            $scope.formValues.tempCustomerSelection = angular.copy($scope.formValues.accessCustomers, $scope.formValues.tempCustomerSelection);
            $scope.userMasterSelectedCustomersIds = $scope.userMasterSelectedCustomersIdsArray.join(",");
            var payload = $scope.createUserMasterCustomerPayload(false);

            $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`, payload).then((response) => {
                $scope.userMasterCustomerData = response.data.payload;
                $.each($scope.userMasterCustomerData, (k,v) => {
                    if($scope.userMasterSelectedCustomersIdsArray.includes(v.id)) {
                        v.isSelected = true;
                    }
                })
                $scope.userMasterCustomerDataLength = response.data.matchedCount;
                $scope.locationPreferredSellerProductsDataPages = Math.ceil($scope.userMasterCustomerDataLength / $scope.userMasterCustomerTableConfig.take);
                tpl = $templateCache.get('app-general-components/views/screen_parts/masters/modal_UserCustomerList.html');
                $scope.modalInstance = $uibModal.open({
                    template: tpl,
                    size: 'full',
                    appendTo: angular.element(document.getElementsByClassName('page-container')),
                    windowTopClass: 'fullWidthModal',
                    scope: $scope // passed current scope to the modal
                });

            });
        }
        $scope.createUserMasterCustomerPayload = function(reloadTable) {
            if(!$scope.userMasterCustomerTableConfig) {
                $scope.userMasterCustomerTableConfig = {}
            }
            if (!$scope.userMasterCustomerTableConfig.currentPage) {
                $scope.userMasterCustomerTableConfig.currentPage = 1;
            }
            if (!$scope.userMasterCustomerTableConfig.take) {
                $scope.userMasterCustomerTableConfig.take = 25;
            }
            $scope.userMasterCustomerTableConfig.skip = ($scope.userMasterCustomerTableConfig.currentPage - 1) * $scope.userMasterCustomerTableConfig.take;
            var payload = {
                Payload: {
                    PageFilters: {
                        Filters: []
                    },
                    Filters : [
                        {
                            ColumnName: 'CounterpartyTypes',
                            Value: 4
                        },
                        {
                            ColumnName: 'SelectedCounterpartyIds',
                            Value: $scope.userMasterSelectedCustomersIds
                        }
                    ],
                    SearchText: $scope.userMasterCustomerTableConfig.searchText,
                    Pagination: {
                        Skip: $scope.userMasterCustomerTableConfig.skip,
                        Take: $scope.userMasterCustomerTableConfig.take
                    },
                }
            };
            if (reloadTable) {
                $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`, payload).then((response) => {
                    $scope.userMasterCustomerData = response.data.payload;
                    $.each($scope.userMasterCustomerData, (k,v) => {
                        if($scope.userMasterSelectedCustomersIdsArray.includes(v.id)) {
                            v.isSelected = true;
                        }
                    })
                    $scope.userMasterCustomerDataLength = response.data.matchedCount;
                });
            }
            return payload;
        };

        $scope.addUserMasterCustomerToSelection = (item) => {

            var customerSelectionExists = false;
            var customerSelectionKey = false;
            $.each($scope.formValues.tempCustomerSelection, (k,v) => {
                if(v.id === item.id) {
                    customerSelectionKey = k;
                    customerSelectionExists = true;
                }
            })
            if(customerSelectionExists) {
                $scope.formValues.tempCustomerSelection[customerSelectionKey].isSelected = item.isSelected;
            } else {
                obj = {
                    id : item.id,
                    isSelected : item.isSelected,
                    name : item.name
                }
                $scope.formValues.tempCustomerSelection.push(obj);
            }
            console.log($scope.formValues.tempCustomerSelection);
        }
        $scope.saveUserMasterCustomerSelection = () => {
            console.log($scope.formValues.tempCustomerSelection);
            $scope.formValues.accessCustomers = [];
            $.each($scope.formValues.tempCustomerSelection, (k,v) => {
                if (v.isSelected) {
                    $scope.formValues.accessCustomers.push(v);
                }
            })
            $scope.prettyCloseModal();
        }
        $scope.selectAllUserMasterCustomers = (selectState) => {
            $.each($scope.userMasterCustomerData, (k,v) => {
                v.isSelected = selectState;
            })
        }
/* END USER master customer lookup logic */


        $scope.sendLicense = () => {
            $http.post(`${API.BASE_URL_DATA_MASTERS}/api/masters/vessels/vesselSendLicense`, {
                Payload: vm.entity_id
            }).then((response) => {
                console.log("Response", response);
            });
        };



        $scope.getFilteredCounterpartyTypeList = () => {

            if(typeof $scope.filteredCounterpartyTypeList !== 'undefined'){
                return;
            }

            $http.post(`${API.BASE_URL_DATA_ADMIN}/api/admin/user/CounterpartyTypeAccess`, {
                Payload: "" // user id is handled in backend.
            }).then((response) => {
                // Handle error
                if(response === false){
                    $scope.filteredCounterpartyTypeList = "Error";
                }

                $scope.filteredCounterpartyTypeList = response.data.payload;

                // Deprecate 06.07.2021
                // $scope.counterPartyListisValid();
            }).catch(e => {
                $scope.filteredCounterpartyTypeList = "Error";
            });
        }

        $scope.disabledCheckbox = function(field, value) {
            // Return true or false
            // True = disabled;
            // False = allowed;

            if(!field.Unique_ID === "counterpartyTypes"){
                return false
            }

            if(!$scope.filteredCounterpartyTypeList){
                return false;
            }

            if(typeof $scope.filteredCounterpartyTypeList !== "string"){

                if($scope.filteredCounterpartyTypeList.some(e => e.id === value.id)){
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        }

    }
]);

$('body').on('click', '.bootstrap-tagsinput .hideTagsChild', function(e) {
    $(this).parent('.bootstrap-tagsinput').addClass("current");
    $(".bootstrap-tagsinput.expanded:not(.current)").removeClass("expanded").children('span.tag[big-child=\'true\']').hide();
    $(".multi_lookup_tags.expanded:not(.current)").removeClass("expanded");
	$(this).parent('.bootstrap-tagsinput').removeClass("current");
	childExpanded = false;
    if ($(this).parent('.bootstrap-tagsinput').hasClass("expanded")) {
    	childExpanded = true;
    }
    // $scope.initBoostrapTagsInputTooltip();
    if (childExpanded == true) {
        $(this)
            .parent('.bootstrap-tagsinput')
            .children('span.tag[big-child=\'true\']')
            .hide();
        $(this)
            .parent('.bootstrap-tagsinput')
            .removeClass('expanded');
        $(this)
            .parents('.multi_lookup_tags')
            .removeClass('expanded');
    } else {
        $(this)
            .parent('.bootstrap-tagsinput')
            .children('span.tag[big-child=\'true\']')
            .show();
        $(this)
            .parent('.bootstrap-tagsinput')
            .addClass('expanded');
        $(this)
            .parents('.multi_lookup_tags')
            .addClass('expanded');
        childExpanded = true;
    }
});

$("body").on("click", (e)=>{
	if (!$(e.target).hasClass("bootstrap-tagsinput") && $(e.target).parents(".bootstrap-tagsinput").length == 0) {
	    $('.bootstrap-tagsinput')
	        .children('span.tag[big-child=\'true\']')
	        .hide();
	    $('.bootstrap-tagsinput')
	        .removeClass('expanded');
	    $('.multi_lookup_tags')
	        .removeClass('expanded');
	}
})