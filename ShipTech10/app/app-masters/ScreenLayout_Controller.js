/**
 * ScreenLayout_Controller Controller
 */ 

APP_MASTERS.controller("ScreenLayout_Controller", [
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



    	var vm = this
   //  	if ($scope.CM) {
			// var vm = angular.extend($scope.CM, vm);
   //  	}
		// var vm = this;


		onlyInScreenLayout_Controller = "ScreenLayout_Controller";

        // if ($state.params.path) {
        //     vm.app_id = $state.params.path[0].uisref.split(".")[0];
        // }
        // if ($scope.screen) {
        //     vm.screen_id = $scope.screen;
        // } else {
        //     vm.screen_id = $state.params.screen_id;
        // }		

        // if (vm.app_id == "invoices") {
	       //  vm.dynamicController = "Controller_Master as CM";
        // }

        $scope.checkIfTab = function() {
            $scope.$watch("formFields", function() {
                setTimeout(function() {
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

        
    }

]);




// function extendScreenLayout(child, vm, statusColors1) {
// 	statusColors = statusColors1;
// 	initialChild = child;
// 	masterThis = vm;
// 	vm = child.prototype;
// 	console.log("!#!@#");
//         vm.enableMultiSelect = function(id, fromLabel, toLabel) {
//             $timeout(function() {
//                 $("#" + id).multiSelect({
//                     selectableHeader: "<div class='custom-header'>" + fromLabel + "</div>",
//                     selectionHeader: "<div class='custom-header'>" + toLabel + "</div>"
//                 });
//                 $("#" + id)
//                     .parents(".multiSelectSwitch")
//                     .find(".ms-selectable")
//                     .append('<span class="switches"><span>&gt;&gt;</span><span>&lt;&lt;</span></span>');
//             }, 100);
//         };
//         // $scope
//         vm.load_eef_config = function(structure) {
//             $scope.formFields = structure;
//         };

// 	vm.getColorCodeFromLabels = function(statusObj) {
//         return statusColors.getColorCodeFromLabels(statusObj, vm.listsCache.ScheduleDashboardLabelConfiguration);
//     }
// }