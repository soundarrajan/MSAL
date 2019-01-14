/**
 * Controller_Configurable_List_Control
 */
APP_GENERAL_COMPONENTS.controller("Controller_Configurable_List_Control", [
    "$tenantSettings",
    "$scope",
    "$rootScope",
    "$Api_Service",
    "Factory_General_Components",
    "$state",
    "$location",
    "$timeout",
    "$compile",
    "$templateRequest",
    "Factory_Master",
    "$uibModal",
    "$templateCache",
    "$filter",
    "$listsCache",
    "scheduleDashboardStatusResource",
    "tenantModel",
    "newRequestModel",
    "screenActionsModel",
    "SCREEN_ACTIONS",
    "ContractPlanningDataSharing",
    "selectContractModel",
    "$http",
    "statusColors",
    function($tenantSettings, $scope, $rootScope, $Api_Service, Factory_General_Components, $state, $location, $timeout, $compile, $templateRequest, Factory_Master, $uibModal, $templateCache, $filter, $listsCache, scheduleDashboardStatusResource, tenantModel, newRequestModel, screenActionsModel, SCREEN_ACTIONS, ContractPlanningDataSharing, selectContractModel, $http, statusColors) {
        var vm = this;
        vm.listsCache = $listsCache;
        vm.SCREEN_ACTIONS = SCREEN_ACTIONS;
        // clc directive current id
        vm.directive_current_id = "";
        $scope.tenantSettings = $tenantSettings;
        vm.entity_id = $state.params.entity_id;
        vm.screen_id = $state.params.screen_id;

        vm.triggerRobStandard = function(){
           // console.error('trigger');
           //  alert('trigger');
        };


        $scope.getScope = function() {
            return $scope;
        };

        // contract planning
        // console.log(ContractPlanningDataSharing.callFunction);
        // console.log(ContractPlanningDataSharing.test());
        // contract planning
        // $scope.$watch(function(){
        //         return ContractPlanningDataSharing.callFunction;
        //     }, function(newVal, oldVal){

        //         switch(newVal.functionName){
        //             case 'updatedOptions':
        //                 $scope.cp_options = newVal.params;
        //                 break;
        //             default:
        //                 console.log('Contract planning func not defined');
        //         }
        //     }, true);

        $scope.contractPlanningSelect = function(data, idx) {
            ContractPlanningDataSharing.selectContract([data, idx]);
        };
        $scope.contractPlanningEmail = function(data, idx) {
            ContractPlanningDataSharing.contractPreviewEmail();
        };

        $scope.getLookupList = function(data, idx) {
            ContractPlanningDataSharing.getLookupList([data, idx]);
        };
        $scope.contractPlanningInitOptions = function(field, data, idx) {
            ContractPlanningDataSharing.initOptions([field, data, idx]);
        };

        $scope.contractplanningTriggerModal = function(data, idx) {
            ContractPlanningDataSharing.contractplanningTriggerModal([data, idx]);
        };

        $scope.selectedAgreementType = function(idx) {
            var data = $eval("contract_planning_agreementType_" + idx);
            ContractPlanningDataSharing.selectedAgreementType([data, idx]);
        };

    
        $scope.getNote = function(modal_id) {
            // console.log('getting note');
            // console.log(modal_id);
            var payload = {
                Id: modal_id
            };
            Factory_General_Components.get_note(payload, function(callback) {
                if (callback) {
                    $scope.Note = callback;
                    if ($scope.Note.noteCreatedAt == null) {
                        $scope.Note.noteCreatedAt = new Date();
                    }
                }
            });
        };
        $scope.deleteUploadLog = function(modal_id) {
            console.log("deleteUploadLog" + modal_id);
            var payload = {
                Id: modal_id
            };
            Factory_General_Components.delete_upload_log(payload, function(callback) {
                if (callback) {
                    console.log(callback);
                    $("table.ui-jqgrid-btable").trigger("reloadGrid");
                }
            });
        };
        $scope.updateNote = function(modal_id, note) {
            console.log("updating note");
            console.log(modal_id);
            console.log(note);
            var payload = {
                Notes: note.notes,
                NoteCreatedAt: note.noteCreatedAt,
                NoteCreatedBy: {
                    Id: note.noteCreatedBy.id,
                    Name: note.noteCreatedBy.name,
                    Code: null,
                    CollectionName: null
                },
                Id: modal_id,
                IsDeleted: false
            };
            Factory_General_Components.update_note(payload, function(callback) {
                if (callback) {
                    console.log("get note callback");
                    console.log(callback);
                }
            });
        };

        $scope.updateDocumentsNote = function(modal_id, note){
            var payload = {
                "Id": modal_id,
                "Notes": note
            }
            Factory_General_Components.update_documents_note(payload, function(response) {
                if (response) {
                    if(response.status == 200){
                        toastr.success('Successfully updated note');
                        $scope.documentNotesTemp[modal_id].prevValue = $scope.documentNotesTemp[modal_id].notesValue;
                    }else{
                        //restore prev value
                        toastr.error("Error occured updating note");
                        $scope.documentNotesTemp[modal_id].notesValue = $scope.documentNotesTemp[modal_id].prevValue;
                    }
                    $scope.prettyCloseModal();
                }else{
                    //restore prev value
                    toastr.error("Error occured updating note");
                    $scope.documentNotesTemp[modal_id].notesValue = $scope.documentNotesTemp[modal_id].prevValue;
                    $scope.prettyCloseModal();
                }
            });
        }
        // Get Table Config
        vm.table_config = [];
        vm.config_id = ""; // config ID
        vm.app_id = ""; // app identificator
        vm.clc_type = ""; // clc type { master / audit / documents }
        vm.url_source = $state.$current.url.source;
        // CLC datatype local --  table params (page/sort/rows/search/etc)
        vm.tableParams = {
            page: 1,
            sort: "",
            col: "",
            rows: 25,
            shrinkToFit: true,
            query: "",
            UIFilters: {},
            filters: []
        };
        $scope.jqgrid_loaded = false;
        $scope.test = function(val) {
            console.log(val);
        };
        $scope.$on("filters-applied", function(event, payload) {
            if ($scope.$$listenerCount["filters-applied"] > 1) {
                $scope.$$listenerCount["filters-applied"] = 0;
            }
            // console.log('init');
            // console.log($rootScope.listTableSelector);
            setTimeout(function() {
                if (typeof $(".jqgrid_component>.ui-jqgrid").attr("id") != "undefined") {
                    var table_id = $(".jqgrid_component>.ui-jqgrid")
                        .attr("id")
                        .replace("gbox_", "");
                }
                // if (!vm.hasChangedOn_page_filter && Object.keys(payload).length == 0) {
                //     return false;
                // }
                // vm.hasChangedOn_page_filter = true;
                if (Elements.settings[table_id]) {
                	// $(Elements.table[Elements.settings[table_id].table]).jqGrid(Elements.settings[table_id].source);
                	if (payload.raw || payload.sortList) {
		                    Elements.settings[table_id].source.on_page_filter(payload);
                	}
                }
                // console.log(Elements.settings[$rootScope.listTableSelector].source)
            }, 300);
        });
        vm.jqgrid_loaded = function(bool) {
            $scope.jqgrid_loaded = bool;

        };
        vm.openNotes = function(id, modal_name) {

            switch (modal_name) {
                case 'table_modal':

                    $scope.modal_id = id;
                    $scope.modalInstance = $uibModal.open({
                        // windowTemplateUrl : '../app-general-components/views/modals.html',
                        template: $templateCache.get("app-general-components/views/modal_notes.html"),
                        // size: 'medium',
                        keyboard: false,
                        appendTo: angular.element(document.getElementsByClassName("page-container")),
                        windowTopClass: "notesModal",
                        // controller: 'Controller_Master',
                        scope: $scope //passed current scope to the modal
                    });
                    break;
                case 'documents_notes_modal':
                    $scope.modal_id = id;
                    if(typeof $scope.documentNotesTemp == 'undefined'){
                        $scope.documentNotesTemp = [];
                    }
                    var rowSelector = "[notes-row-id=" + id + "]";
                    var rowValue = $(rowSelector).attr("notes-row-value");
                    if(typeof $scope.documentNotesTemp[id] == 'undefined'){
                        $scope.documentNotesTemp[id] = {
                            initialValue: rowValue, // initial
                            notesValue: rowValue, // last modified not saved
                            prevValue: rowValue  // last modified and saved
                        }
                    }

                    

                    console.log( $scope.documentNotesTemp);
                    $scope.modalInstance = $uibModal.open({
                        template: $templateCache.get("app-general-components/views/modal_documents_notes.html"),
                        keyboard: false,
                        appendTo: angular.element(document.getElementsByClassName("page-container")),
                        windowTopClass: "documentsNotesModal",
                        scope: $scope //passed current scope to the modal
                    });
                    break;
                default:
                    console.log("No table modal defined.");
            }
        };
        vm.verifyDocument = function(documentId, rowId){
            // debugger;
            // console.log($scope.formValues);
            // console.log(documentId);
            // console.log(rowId);
            // $scope.$apply();
            var rowIdx = parseInt(rowId) - 1;
            // console.log( vm.lastCallTableData);
            // console.log(vm.lastCallTableData.tableData.rows[rowIdx])


            // console.log(eval('$scope.doc_verify_' + documentId));
            $scope['doc_verify_'+ documentId] = eval('$scope.doc_verify_' + documentId);
            var payload = angular.copy(vm.lastCallTableData.tableData.rows[rowIdx]);
            if(typeof $scope.documentNotesTemp != 'undefined'){
                if($scope.documentNotesTemp[documentId].notesValue){
                    payload.notes = $scope.documentNotesTemp[documentId].notesValue;
                }
            }
            payload.isVerified = eval('$scope.doc_verify_' + documentId);
            payload.verifiedBy = null;
            payload.verifiedOn = null;

            Factory_General_Components.updateDocumentVerify(payload,function(callback){
                if (callback.status == 200) {
                    if(payload.isVerified) toastr.success('Document verified!');
                    if(!payload.isVerified) toastr.success('Document unverified!');

                    $state.reload();
                }else{
                    toastr.error('Error occured!');
                }

            });
        }
        vm.addHeadeActions = function() {
            $('.page-content-wrapper a[data-group="extern"]').each(function() {
                if ($(this).attr("data-compiled") == 0) {
                    $(this).attr("ng-click", $(this).data("method"));
                    $(this).attr("data-method", "");
                    $(this).attr("data-compiled", 1);
                    $(this).attr("ng-controller", "Controller_Master as CM");
                    $compile($(this))($scope);
                }
            });
        };
        vm.delayaddHeadeActions = function() {
            return $timeout(vm.addHeadeActions, 100);
        };
        vm.delayaddHeadeActions();
        $scope.tenantSettings = $tenantSettings;
        // console.log($rootScope.deliveryIDlabs);
        $rootScope.$watch("deliveryIDlabs", function() {
            if ($rootScope.deliveryIDlabs != null) {
                vm.tableParams.UIFilters = {
                    DeliveryId: $rootScope.deliveryIDlabs
                };
            }
        });
        $scope.prettyCloseModalAlerts = function(showConfirm) {
            if (showConfirm) {
                $scope.showSweetConfirm("Controller_Configurable_List_Control", "The alert is not saved, are you sure you want to close it?", "prettyCloseModalAlerts(false)");
            } else {
                $scope.prettyCloseModal();
            }
        };
        $scope.showSweetConfirm = function(controller, text, confirmAction) {
            $(".confirmModal").modal();
            $(".confirmModal").removeClass("hide");
            $(".confirmModal").attr("ng-controller", controller);
            $(".confirmModal .confirmAction").attr("ng-click", confirmAction);
            $compile($(".confirmModal"))($scope);
            $rootScope.confirmModalData = {
                text: text
            };
        };
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
                $scope.modalInstance.close();
            }, 300);
        };
        // set app id
        setTimeout(function() {
            vm.newInvoiceType = $("#newInvoiceType").val();
            $("#newInvoiceType").change(function() {
                vm.newInvoiceType = $("#newInvoiceType").val();
            });
        }, 1);
        /*

        if ( $state.current.url.indexOf('masters') >= 0 )
            vm.app_id = 'masters';
        if ( $state.current.url.indexOf('admin') >= 0 )
            vm.app_id = 'admin';
        */
        // specific app id (from directive param)
        vm.setAppId = function(id) {
            vm.app_id = id;
        };
        vm.setScreenId = function(id) {
            vm.config_id = id;
        };
        // $timeout(function() {
        //     $('.bs-select').selectpicker({
        //         iconBase: 'fa',
        //         tickIcon: 'fa-check',
        //     });
        // }, 10);
        // set config id
        //vm.config_id = $state.params.screen_id;
        // set clc type
        vm.clc_type = $state.$current.url.source;
        // @todo : remove it. not used anymore {florin m.}
        /*
        vm.tableConfig = function () {
            Factory_General_Components.get_table_config(vm.app_id, vm.config_id, function (callback) {
                if (callback) {
                    vm.table_config = callback;
                    vm.table_config.table_id = vm.table_config.view_type + '_' + vm.table_config.table_name.replace(/ /g, '_').toLowerCase();
                    vm.table_config.pager_id = vm.table_config.view_type + '_' + vm.table_config.table_name.replace(/ /g, '_').toLowerCase() + '_pager';
                    //$scope.$watch('source');
                }
            });
        };
       */
        $scope.getStatuses = function() {

        scheduleDashboardConfigurationInterval = setInterval(function(){
	    	if (window.scheduleDashboardConfiguration) {
	    		clearInterval(scheduleDashboardConfigurationInterval);
				$scope.statuses = window.scheduleDashboardConfiguration.payload.labels;
            	// $scope.adminDashboardStatuses = $filter("filter")(window.scheduleDashboardConfiguration.data.labels, { displayInDashboard : true}, true);
             //    if ($scope.calendarStatuses) {
             //    	$scope.createStatusFilters()
             //    }

	    		// $scope.adminDashboardStatuses = $filter("filter")(data.labels, { displayInDashboard : true}, true);
		     //    statusList = ctrl.dashboardConfiguration.labels;
	      //       selectTimeScale($stateParams.timescale);
	    	}
        },500)        	
        	// setTimeout(function(){
		       //  $scope.statuses = tenantModel.getScheduleDashboardConfiguration().payload.labels;	
        	// },550)


	    //     	if (!window.scheduleDashboardConfiguration) {
		   //          var requestData = {
		   //              Payload: true
		   //          };

					// return tenantScheduleDashboardConfiguration.get(requestData).$promise.then(function (data) {
					// 	window.scheduleDashboardConfiguration = data;
					//  //    scheduleDashboardConfiguration = data;
					//  //    return data;
		   //      	tenantModel.getScheduleDashboardConfiguration()	
					//     $scope.statuses = data.payload.labels;
					// })

		   //          // return tenantScheduleDashboardConfiguration.fetch(requestData).$promise.then(function(data) {
		   //          //     $scope.statuses = data.payload.labels;
		   //          // });
	    //     	} else {
				 //    $scope.statuses = window.scheduleDashboardConfiguration.payload.labels;
	    //     	}
        };
        $scope.getStatuses();

        $scope.getStatusColor = function(statusName, cell) {
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

        // Do Entity Action
        vm.do_entity_action = function(action, id, url_id, ev, checkProcurement) {
            if (typeof checkProcurement == "undefined") checkProcurement = -1;
            switch (action) {
                case "copy":
                    if (checkProcurement >= 0) {
                        $rootScope.$broadcast("copyProcurementEntity", id);
                        return;
                    }
                    if (typeof $state.params.screen_id == "undefined") {
                        $state.params.screen_id = "";
                    }
                    if (typeof $state.params.screen_id !== "undefined") {
                        $state.params.screen_id = $state.params.screen_id;
                    }
                    screen_id = $state.params.screen_id;
                    if ($scope.tenantSettings.companyDisplayName.name == "Pool" && $state.params.screen_id == "company") {
                        screen_id = "pool";
                    }
                    if ($scope.tenantSettings.serviceDisplayName.name == "Operator" && $state.params.screen_id == "service") {
                        screen_id = "operator";
                    }
                    var url = $state.$current.url.prefix + screen_id + "/edit/";
                    vm.app_id = $state.params.path[0].uisref.split(".")[0];
                    vm.lastUrl = url;
                    if ($state.params.screen_id == "claim") {
                        $state.params.screen_id = "claims";
                    }
                    if (vm.app_id == "alerts") {
                        $scope.triggerModal(id, true);
                        return;
                    }

                    localStorage.setItem(vm.app_id + $state.params.screen_id + "_copy", id);
                    // window.open($location.$$absUrl.replace($location.$$path, url), '_blank');
                    // var url = $state.$current.url.prefix + $state.params.screen_id + '/edit/';
                    $location.path(url);
                    break;
                case "edit":
                    //alert(id);
                    vm.app_id = $state.params.path[0].uisref.split(".")[0];
                    if (vm.app_id == "recon") {
                        id = url_id;
                    }
                    if ($state.params.screen_id == "deliveriestobeverified") {
                        id = url_id;
                        $state.params.screen_id = "delivery";
                    }
                    if (typeof $state.params.screen_id == "undefined") {
                        $state.params.screen_id = "";
                    }
                    if (typeof $state.params.screen_id !== "undefined") {
                        $state.params.screen_id = $state.params.screen_id;
                    }
                    // console.log(vm.app_id )
                    // break;
                    if (vm.app_id == "alerts") {
                        $scope.triggerModal(id);
                    } else {
                        // window.open($location.$$absUrl.replace($location.$$path, url), '_blank');
                        if (checkProcurement == -1) {
                            screen_id = $state.params.screen_id;
                            if ($scope.tenantSettings.companyDisplayName.name == "Pool" && $state.params.screen_id == "company") {
                                screen_id = "pool";
                            }
                            if ($scope.tenantSettings.serviceDisplayName.name == "Operator" && $state.params.screen_id == "service") {
                                screen_id = "operator";
                            }
                            var url = $state.$current.url.prefix + screen_id + "/edit/" + id;
                        } else {
                            var procurement_apps = [
                                {
                                    name: "requestslist",
                                    editPath: "/edit-request/"
                                },
                                {
                                    name: "scheduleDashboardTable",
                                    editPath: "/edit-request/"
                                },
                                {
                                    name: "orderlist",
                                    editPath: "/edit-order/"
                                },
                                {
                                    name: "contractplanning"
                                }
                            ];
                            var url = procurement_apps[checkProcurement].editPath + id;
                            // console.log(procurement_apps[checkProcurement].editPath)
                        }
                        window.open($location.$$absUrl.replace($location.$$path, url), '_blank');
                        // $location.path(url);
                    }
                    break;
                case "delete":
                    var Payload = {};
                    $('[id*="documents_list"]').jqGrid.Ascensys.gridData.forEach(function(val, key) {
                        if (id == val.id) {
                            Payload = val;
                        }
                    });
                    console.log(Payload);
                    // console.log(id);
                    // $('.ui-jqgrid-btable').jqGrid('getGridParamaram', 'data');
                    // $rootScope.CLC.deleteDocument(1);
                    if (Payload.app && Payload.screen) {
                        var pld = {
                            Id: Payload.id
                        };
                        Factory_General_Components.delete_upload_log(pld, function(callback) {
                            var confirm = window.confirm('Delete File "' + Payload.docName + '"?');
                            if (confirm) {
                                if (callback) {
                                    // console.log(callback);
                                    toastr.success("Delete done");
                                    $("table.ui-jqgrid-btable").trigger("reloadGrid");
                                } else {
                                    toastr.error("Error occured");
                                }
                            } else {
                                toastr.info("Delete cancelled!");
                            }
                        });
                        break;
                    }
                    $scope.showSweetConfirm("Controller_Configurable_List_Control", "The alert is not saved, are you sure you want to close it?", "deleteDocumentFromList("+id+")");
                    break;
                case "insert":
                    console.log("insert new row");
                    break;
                case "remove":
                    console.log("remove row");
                    break;
            }
        };

        $scope.deleteDocumentFromList = function(id) {
            $('[id*="documents_list"]').jqGrid.Ascensys.gridData.forEach(function(val, key) {
                if (id == val.id) {
                    Payload = val;
                }
            });
            Factory_General_Components.entity_delete(id, Payload, function(callback) {
                // var confirm = window.confirm('Delete File "' + Payload.name + '"?');
                if (confirm) {
                    if (callback) {
                        toastr.success("Delete done");
                        $('[id*="documents_list"]').trigger("reloadGrid");
                    } else {
                        toastr.error("Error occured");
                    }
                } else {
                    toastr.info("Delete cancelled!");
                }
            });         
        }


        $scope.triggerModal = function(id, copy) {
            $rootScope.modal = {
                source: id
            };
            // "copyAlertAction" : true
            if (copy) {
                copyAlertAction = true;
                $rootScope.$broadcast("copyAlertAction");
            }
            $rootScope.modalInstance = $uibModal.open({
                // windowTemplateUrl : '../app-general-components/views/modals.html',
                template: $templateCache.get("app-general-components/views/modal_alerts.html"),
                size: "full",
                keyboard: false,
                appendTo: angular.element(document.getElementsByClassName("page-container")),
                windowTopClass: "fullWidthModal",
                // controller: 'Controller_Master',
                scope: $rootScope //passed current scope to the modal
            });
        };
        // $scope.test=1;
        //  $scope.$on('formValues', function(val) {
        //     console.log( $scope.formValues);
        //     });
        // Save columns order
        vm.save_columns_order = function(column_map) {
            console.log("new order for master " + $state.params.screen_id + ": " + column_map.toString());
        };
        // Save hidden columns
        vm.save_hidden_columns = function(column_map) {
            console.log("hidden columns for master " + $state.params.screen_id + ": " + column_map.toString());
        };
        vm.dataAction = function(action, object) {
            $rootScope.$broadcast(action, object);
        };
        // Cached columns order (client-side persistent)
        vm.cached_columns_order = function(column_map, table, override) {
            var new_column_map;
            if (typeof localStorage.getItem(table + "-columns-order") === undefined || localStorage.getItem(table + "-columns-order") === null) {
                new_column_map = column_map;
                localStorage.setItem(table + "-columns-order", JSON.stringify(column_map));
            } else {
                new_column_map = JSON.parse(localStorage.getItem(table + "-columns-order"));
            }
            if (override) {
                new_column_map = column_map;
                localStorage.setItem(table + "-columns-order", JSON.stringify(column_map));
            }
            return new_column_map;
        };
        vm.formatDate = function(elem, dateFormat) {
            if (elem) {
                formattedDate = elem;
                var date = Date.parse(elem);
                date = new Date(date);
                if (date) {
                    var utc = date.getTime() + date.getTimezoneOffset() * 60000;
                    //return utc;
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
        vm.hasAction = function(action, row) {
            return screenActionsModel.hasAction(action, row.screenActions);
        };
        vm.canConfirm = function(row) {
            canReconfirm = true;
            $.each(row.screenActions, function(sak, sav) {
                if (sav) {
                    if (sav.name == "Confirm") {
                        canReconfirm = false;
                    }
                }
            });
            return canReconfirm;
        };
        vm.canReconfirm = function(row) {
            canReconfirm = true;
            if (row.allProductsAreFinalPrice) {
                $.each(row.screenActions, function(sak, sav) {
                    if (sav) {
                        if (sav.name == "ReConfirm") {
                            canReconfirm = false;
                        }
                    }
                });
            }
            return canReconfirm;
        };
        // Get jQgrid Formatter
        vm.get_formatter = function(name) {
            // ====== SETTINGS ======
            var tpl = '<span class="formatter :class :css_formatting" data-formatter-type=":type">:content</span>';
            var var_bind = function(var_name, var_value, element) {
                return element.replace(var_name, var_value, element);
            };
            // ====== /SETTINGS ======
            // ====== FORMATTERS ======
            {
                var composed = function(cellValue, options, rowObject) {
                    if (!options.colModel.secondUnit) return;
                    if (!rowObject[options.colModel.secondUnit]) return;
                    return $filter("number")(cellValue, $scope.tenantSettings.defaultValues[options.colModel.secondUnit.indexOf("Uom") ? "quantityPrecision" : "pricePrecision"]) + " " + rowObject[options.colModel.secondUnit].name;
                };
                var confirmOrder = function(cellValue, options, rowObject) {
                    if (!rowObject.order) return;
                    var cls = "btn btn-outline btn-xs";
                    if (!vm.canConfirm(rowObject)) {
                      cls += ' orange';
                    }
                    return ' <a name="confirm" class="' + cls + '" ng-disabled="' + vm.canConfirm(rowObject) + "\"  ng-click=\"CLC.dataAction('confirmOrder', " + rowObject.order.id + ')">Confirm</a>';
                };
                /**
                 * general formatter used in any cell without custom formatter. It replaces null value with blank string.
                 * Iri - request by Mihai T 22.05.18
                 */

                /* to display null -> blank string; 0 -> 0  - Betty - request by Cristina 26.07.18 */
                var generalCell = function(cellValue, options, rowObject) {
                    if (cellValue === 0) return cellValue;
                    return cellValue ? cellValue : "";
                };

                var reconfirmOrder = function(cellValue, options, rowObject) {
                    if (!rowObject.order) return;
                    var cls = "btn btn-outline btn-xs";
                    if (!vm.canReconfirm(rowObject)) {
                      cls += ' orange';
                    }
                    return '<a name="reconfirm" class="' + cls + '" ng-disabled="' + vm.canReconfirm(rowObject) + "\"  ng-click=\"CLC.dataAction('reconfirmOrder', " + rowObject.order.id + ')">Reconfirm</a>';
                };
                var formatStatus = function(cellValue, options, rowObject) {
                    if (cellValue != null && cellValue != "") {
                        if (typeof cellValue == "object") {
                            color = $scope.getStatusColor(cellValue.name);
                            label = cellValue.displayName ? cellValue.displayName : cellValue.name;
                        } else {
                            label = rowObject[options.colModel.displayName || options.colModel.name];
                            // label = rowObject[options.colModel.name.split('.')[0]].name;
                            name = label;
                            label = cellValue;
                            cell = rowObject[options.colModel.name.split('.')[0]];
                            if (options.colModel.findColor) {
                                name = rowObject[options.colModel.findColor].name;
                                label = rowObject[options.colModel.findColor].displayName;
                            }
                            color = $scope.getStatusColor(name, cell);
                        }
                        if (label && color) {
                            return '<span class="label formatStatus" style="overflow:hidden; text-overflow:ellipsis; display:block; background-color:' + color + '" >' + label + "</span>";
                        } else {
                            return "";
                        }
                    }
                    return "";
                };
                var scheduleDashboard_formatStatus = function(cellValue, options, rowObject){
                    var label,
                        color,
                        status;

                    if(rowObject.voyageDetail){

                        if (rowObject.voyageDetail.request.id != 0) {
    
                            status = rowObject.voyageDetail.request.requestStatusDisplayName ? rowObject.voyageDetail.request.requestStatusDisplayName : rowObject.voyageDetail.request.requestStatus;
                            label = status.displayName ? status.displayName : status.name;
                        } else {
        
                            status = rowObject.voyageDetail.portStatusDisplayName ? rowObject.voyageDetail.portStatusDisplayName : rowObject.voyageDetail.portStatus;
                            label = status.displayName ? status.displayName : status.name;
                            
                        }
    
                        color =  $scope.getStatusColor(null, status);
    
                        if (label && color) {
                            return '<span class="label formatStatus" style="overflow:hidden; text-overflow:ellipsis; display:block; background-color:' + color + '" >' + label + "</span>";
                        } 
                    }
                    return "";

                }

                var scheduleDashboard_fuelOilOfRequestType = function(cellValue, options, rowObject){
                    if(cellValue === undefined) return "";
                    return cellValue.displayName ? cellValue.displayName : cellValue.name;
                }
                var scheduleDashboard_minMax = function(cellValue, options, rowObject){

                    if(rowObject.voyageDetail){
                        if(rowObject.voyageDetail.request){
                            if(rowObject.voyageDetail.request.requestDetail){
                       
                                var max = rowObject.voyageDetail.request.requestDetail[ options.colModel.schQuantitySource + "MaxQuantity" ];
                                max = max ? max : "";
                                var min = rowObject.voyageDetail.request.requestDetail[ options.colModel.schQuantitySource + "MinQuantity" ];
                                min = min ? min : "";
                                return min + " - " + max;
                            }
                        }
                    }
                    return "";
                }
              
                var formatDate = function(cellValue, options, rowObject) {
                    var tpl = '<span class="formatter">:content</span>';
                    var element = tpl;
                    // console.log($scope.tenantSettings);
                    dateFormat = $scope.tenantSettings.tenantFormats.dateFormat.name;
                    dateFormat = dateFormat.replace(/D/g, "d").replace(/Y/g, "y");
                    formattedDate = $filter("date")(cellValue, dateFormat);
                    if (options.label == "ETA" || options.label == "ETB" || options.label == "ETD") {
                        formattedDate = $filter("date")(cellValue, dateFormat, 'UTC');
                    }
                    if (formattedDate) {
                        if (formattedDate.indexOf("0001") != -1) {
                            formattedDate = "";
                        }
                    }
                    if (cellValue != null) {
                        return "<div>" + formattedDate + "<div>";
                        // formattedDate = vm.formatDate(cellValue, $scope.tenantSettings.tenantFormats.dateFormat);
                        // element = var_bind(':content', formattedDate, element);
                        // return formattedDate;
                    }
                    return "";
                };
                var contract_planning_checkbox = function(cellValue, options, rowObject) {
                    var tpl = '<label class="mt-checkbox mt-checkbox-outline" style="padding-left: 5px;">' + '<input type="checkbox" class="contract_planning_checkbox" rowId="' + options.rowId + '" ng-disabled="!CLC.cpCtr[' + options.rowId + ']" ng-model="selectContracts[' + options.rowId + ']"  ng-click="selectContractPlanningRow(' + options.rowId + ",selectContracts[" + options.rowId + '])"/><span></span></label>';

                    return tpl;
                };
                var contract_planning_email = function(cellValue, options, rowObject) {
                    var tpl = '<a class="font-grey-cascade" ng-click="contractPlanningEmail(' + rowObject.id + ')"><i class="glyphicon glyphicon-envelope"></i></a>';

                    return tpl;
                };
                var contract_planning_min_max_qty = function(cellValue, options, rowObject) {
                    // return rowObject.minQuantity;
                    var minQty = "";
                    var maxQty = "";
                    theCLC = $("#flat_contract_planning");
                    if (typeof(theCLC.jqGrid.Ascensys.gridObject.rows) != 'undefined') {
                        rowObject.contractMinQuantity = theCLC.jqGrid.Ascensys.gridObject.rows[options.rowId - 1].contractMinQuantity;
                        rowObject.contractMaxQuantity = theCLC.jqGrid.Ascensys.gridObject.rows[options.rowId - 1].contractMaxQuantity;
                    }
                    if (options.colModel.dataFrom == "base") {
                        if (rowObject.minQuantity != null) minQty = $filter("number")(rowObject.minQuantity, $scope.tenantSettings.defaultValues.quantityPrecision);
                        if (rowObject.maxQuantity != null) maxQty = $filter("number")(rowObject.maxQuantity, $scope.tenantSettings.defaultValues.quantityPrecision);
                    }

                    if (options.colModel.dataFrom == "contractual") {
                        if (rowObject.contractMinQuantity != null) minQty = $filter("number")(rowObject.contractMinQuantity, $scope.tenantSettings.defaultValues.quantityPrecision);
                        if (rowObject.contractMaxQuantity != null) maxQty = $filter("number")(rowObject.contractMaxQuantity, $scope.tenantSettings.defaultValues.quantityPrecision);
                    }
                    if (options.colModel.dataFrom == "modal") {
                        if (options.gid == "flat_select_contract") {
                            if (rowObject.minQuantity != null) minQty = $filter("number")(rowObject.minQuantity, $scope.tenantSettings.defaultValues.quantityPrecision);
                            if (rowObject.maxQuantity != null) maxQty = $filter("number")(rowObject.maxQuantity, $scope.tenantSettings.defaultValues.quantityPrecision);
                        }
                    }
                    fieldDisabled = false
                    if (rowObject.requestStatus) {
                        if (rowObject.requestStatus.name != "Planned" && rowObject.requestStatus.name != "Created" && rowObject.requestStatus.name != "Questionnaire" && rowObject.requestStatus.name != "Validated") {
                            fieldDisabled = true;
                        }
                    }                    

                    if (options.colModel.dataFrom == "base") {
                        if (!fieldDisabled) {
                            // var tpl = '<span tooltip class="contract_planning_min_max_qty_wrap" rowId="' + options.rowId + '">' + '<a data-toggle="modal" href="#minMaxModal" class="contract_planning_min_max_qty" ng-click="CLC.openMinMaxModalEdit(' + options.rowId + ')" rowId="' + options.rowId + '"><i class="fa fa-pencil font-dark"></i></a> <span class="values">' + minQty + " - " + maxQty + "</span></span>";
                            var tpl = '<span tooltip class="contract_planning_min_max_qty_wrap" rowId="' + options.rowId + '">' + '<a class="contract_planning_min_max_qty" rowId="' + options.rowId + '"><i class="fa fa-pencil font-dark"></i></a> <span class="values">' + minQty + " - " + maxQty + "</span></span>";
                        } else {
                            var tpl = "<span class='contract_planning_min_max_qty_wrap' rowId='"+ options.rowId + "' tooltip> <span class='values'>" + minQty + ' - ' + maxQty + "</span> </span>";
                        }
                    } else {
                        //contractual qty not editable at all
                        var tpl = "<span tooltip>" + minQty + " - " + maxQty + "</span>";
                    }
                    return tpl;
                };
                var contract_planning_contract = function(cellValue, options, rowObject) {
                    var objString = JSON.stringify(rowObject);
                    var fieldString = JSON.stringify({ field: "contract" });
                    // var tpl = " <span ng-init='contractPlanningInitOptions(" + fieldString + "," + objString + "," + options.rowId + ")'></span>" +
                    //           "<div class='input-group'>" +
                    //           "<input name='Contract_" + options.rowId + "' id='Contract_" + options.rowId + "' " +
                    //           "uib-typeahead='contract as contract.name for contract in cp_options.Contract_" + options.rowId + " | filter:$viewValue | limitTo:5' "  +
                    //           "typeahead-on-select='contractPlanningSelectedContract($item.id)'  typeahead-editable='false' " +
                    //           "class='typeahead form-control' ng-model='Contract_" + options.rowId + "'/>" +
                    //           "</div>";
                    // tpl = '<div class="input-group input-group-sm contractPlanningContractTypeahead" ng-controller="Controller_Configurable_List_Control as CLC" >';
                    // tpl += '<input class="form-control no-right-border" ng-focus="CLC.setContractFiltersContractPlanning('+options.rowId+')" ng-model="CLC.contractPlanningContractTypeahead['+options.rowId+']"  uib-typeahead="contract as contract.name for contract in CLC.getContractTypeaheadListCP('+options.rowId+')" />'
                    //                tpl += '<span class="input-group-addon">'
                    // tpl += '<i class="fa fa-search clickable" data-toggle="modal" href="#selectContract" ng-click="$ctrl.setContractFilters(row)"></i>'
                    // tpl += '</span>'
                    tpl += "</div>";
                    initialContractValue = rowObject.contract ? "'" + rowObject.contract.name + "'" : rowObject.contract;
                    tpl = '<div class="input-group input-group-sm contractPlanningContractTypeahead">';
                    columnKey = "'contract'";
                    if (!$rootScope.editableCProwsModel) {
                        $rootScope.editableCProwsModel = [];
                    }
                    if (!$rootScope.editableCProwsModel['row-'+options.rowId]) {
                        $rootScope.editableCProwsModel['row-'+options.rowId] = [];
                    }
                    $rootScope.editableCProwsModel['row-'+options.rowId]['contract'] = rowObject.contract;
                    $rootScope.editableCProwsModel['row-'+options.rowId]['contractChanged'] = false;
                    // CLC.getInitialContractValue('+options.rowId+')
// // ng-init="CLC.cpCtr[' +
//                         options.rowId +
//                         "] = " +
//                         initialContractValue +
//                         '"
                    tpl += '<input ng-init="CLC.cpCtr[' +
                        options.rowId +
                        '] = '+initialContractValue+'; CLC.changeCPRowModel(null ,' + options.rowId + "," + columnKey + ", true" + ');"  class="form-control no-right-border" typeahead-show-hint="true" typeahead-min-length="1" typeahead-append-to-body="true" typeahead-wait-ms="100" typeahead-on-select="CLC.changeCPRowModel($item, ' +
                        options.rowId +
                        "," +
                        columnKey +
                        ');" ng-focus="CLC.setContractFiltersContractPlanning(' +
                        options.rowId +
                        ')" ng-model="CLC.cpCtr[' +
                        options.rowId +
                        ']" ng-change="CLC.contractIsEditing = '+options.rowId+'" ng-blur="CLC.clearContractLinkCP('+options.rowId+')"  uib-typeahead="contract as contract.name for contract in CLC.getContractTypeaheadListCP(' +
                        options.rowId +
                        ')" />';
                    // tpl += options.rowId+'-><span ng-bind="CLC.getContractTypeaheadListCP('+options.rowId+')"></span><-'
            //                     data = {
            //     template: 'general',
            //     clc: 'contractplanning_contractlist',
            //     name: 'Contract',
            //     id: 'Contract_' + idx,
            //     formvalue: '',
            //     idx: '',
            //     field_name: 'Contract_' + idx,
            //     filter: filters
            // }
            // ng-click="triggerModal(\'general\', \'contractplanning_contractlist\', \'Contract\', \'Contract_\' + '+options.rowId+', \'\', \'\', \'Contract_\' + '+options.rowId+')"
                    tpl +='<i class="fa fa-search clickable form-control" data-toggle="modal" href="#selectContract" ng-click="openContractPopupInCP('+options.rowId+')" style="border-left: 1px solid #c2cad8;"><span hidden="true">&nbsp;</span></i>';
                    // tpl += '<i class="fa fa-search clickable" data-toggle="modal" href="#selectContract" ng-click="openContractPopupInCP('+options.rowId+')" ></i>'
                    // tpl += 'dddd'
                  //
                  if (rowObject.contract) {
                    tpl += '<div id="contract-planning-contract-link-' + options.rowId + '"><a target="_blank" href="#/contracts/contract/edit/' + rowObject.contract.id + '"> <span class="formatter edit_link edit_link_contract_id" data-formatter-type="link"> <i style="float: none;" class="fa fa-edit"></i>' + rowObject.contract.id + '</span></a> </div>';
                  } else {
                    tpl += '<div id="contract-planning-contract-link-' + options.rowId + '"></div>';
                  }
                  tpl += '</div>';

                    // tpl = cellValue;
                    return tpl;
                };


                var contract_planning_product = function(cellValue, options, rowObject) {
                    // tpl = "<div>";   
                    tpl = '<div class="input-group input-group-sm contractPlanningContractTypeahead" style="display: flex;">';

                    columnKey = "'product'";
                    if (rowObject.product) {
                        currentValue = rowObject.product.id
                    } else {
                        currentValue = 0;
                    }

                    fieldDisabled = false
                    if (rowObject.requestStatus) {
                        if (rowObject.requestStatus.name != "Planned" && rowObject.requestStatus.name != "Created" && rowObject.requestStatus.name != "Questionnaire" && rowObject.requestStatus.name != "Validated") {
                            fieldDisabled = true;
                        }
                    }   

                    tpl += '<div style="width: 197px;"><select ng-disabled="'+fieldDisabled+'" id="contract_planning_product_select_' + options.rowId + '" rowId="' + options.rowId + '" ng-change="CLC.changeCPRowModel(CLC.product[' + options.rowId + "], " + options.rowId + "," + columnKey + ');" ng-init="CLC.product[' + options.rowId + '].id = '+currentValue+'; CLC.changeCPRowModel(CLC.product[' + options.rowId + "], " + options.rowId + "," + columnKey + ", true" + ');" ng-model="CLC.product[' + options.rowId + ']" ng-options="item as item.name for item in CLC.listsCache.Product track by item.id" class="form-control input-group-addon contract_planning_product"></select></div>';

                    // tpl +='<span ng-controller="Controller_Master as CM" class="input-group-addon " ng-click="triggerModal(\'general\', \'masters_productlist\', \'\' , \'  cpPr['+options.rowId +']\',\'\',\'\', \'Product\' )" ><i class="fa fa-search"></i></span> ';           

                    if (fieldDisabled) {
                        tpl += '<i disabled class="fa fa-search clickable form-control contract_planning_product" style="height: 30px; border-radius: 0;"><span hidden="true">&nbsp;</span></i>';
                    } else {
                        tpl += '<i ng-disabled="'+fieldDisabled+'" class="fa fa-search clickable form-control contract_planning_product" data-toggle="modal" href="#selectProduct" ng-click="openProductPopupInCP(' + options.rowId + ')" style="height: 30px; border-radius: 0;"><span hidden="true">&nbsp;</span></i>';
                    }
                    tpl += '</div>';

                    // tpl = cellValue;
                    return tpl;
                };

                var contract_planning_agreementtype = function(cellValue, options, rowObject) {
                    // var tpl = "<span title=''><select class='w100 form-control' ng-options='item as item.name for item in CLC.listsCache.AgreementType track by item.id' ng-init='contract_planning_agreementtype[" + options.rowId + "] = "+rowObject['agreementType']+"' ng-model='contract_planning_agreementtype[" + options.rowId + "]' /></span>";
                    columnKey = "'agreementType'";
                    if (rowObject.agreementType) {
                        currentValue = rowObject.agreementType.id
                    } else {
                        currentValue = 2;
                    }
                    tpl = '<select rowId="' + options.rowId + '" ng-change="CLC.changeCPRowModel(agrementType[' + options.rowId + "], " + options.rowId + "," + columnKey + ', false);" ng-init="agrementType[' + options.rowId + '].id = '+currentValue+'; CLC.changeCPRowModel(agrementType[' + options.rowId + "], " + options.rowId + "," + columnKey + ', true);" ng-model="agrementType[' + options.rowId + ']" ng-options="item as item.name for item in CLC.listsCache.AgreementType track by item.id" class="form-control w100 contract_planning_agreementtype">';
                    // tpl += '<option value="null"></option>';
                    // $.each($listsCache.AgreementType, function(key, val) {
                    //     if (rowObject.agreementType) {
                    //         if (rowObject.agreementType.id == val.id) {
                    //             selected = true;
                    //         } else {
                    //             selected = false;
                    //         }
                    //     } else {
                    //         selected = false;
                    //     }
                    //     if (selected == true) {
                    //         tpl += '<option  selected="true" value="' + val.id + '">' + val.name + "</option>";
                    //     } else {
                    //         tpl += '<option  value="' + val.id + '">' + val.name + "</option>";
                    //     }
                    // });
                    tpl += "</select>";
                    return tpl;
                };
                var contract_planning_comments = function(cellValue, options, rowObject) {
                    textVal = "";
                    columnKey = "'comment'";
                    if (rowObject.comment) {
                        textVal = rowObject.comment;
                    }
                    var tpl = '<textarea class="contract_planning_comments"  ng-blur="CLC.changeCPRowModel(cpcomment[' + options.rowId + "], " + options.rowId + "," + columnKey + ', false);" ng-model="cpcomment[' + options.rowId + ']" ng-init="cpcomment[' + options.rowId + '] = \''+textVal+'\'" rowId="' + options.rowId + '" cols="30" rows="1" style="width: 100px; max-width: 100px; min-width: 100px; min-height: 30px" >' + textVal + "</textarea>";
                    return tpl;
                };
                var order_comments = function(cellValue, options, rowObject) {
                    // var tpl = '<span tooltip data-original-title="' + cellValue + '" class="formatter" data-placement="left"> :content </span>';
                    var comment_to_display = $filter("limitTo")(cellValue, 60, 0);
                    // tpl = var_bind(':content', comment_to_display, tpl);
                    if (cellValue == null) cellValue = "";
                    return cellValue;
                };
                var formatOnlyDate = function(cellValue, options, rowObject) {
                    var tpl = '<span class="formatter">:content</span>';
                    var element = tpl;
                    formattedDate = $filter("date")(cellValue, "dd/MM/yyyy");
                    if (formattedDate) {
                        if (formattedDate.indexOf("0001") != -1) {
                            formattedDate = "";
                        }
                    }
                    if (cellValue != null) {
                        return "<div>" + formattedDate + "<div>";
                        // formattedDate = vm.formatDate(cellValue, $scope.tenantSettings.tenantFormats.dateFormat);
                        // element = var_bind(':content', formattedDate, element);
                        // return formattedDate;
                    }
                    return "";
                };               
                var formatDateUtc = function(cellValue, options, rowObject) {
                    var tpl = '<span class="formatter">:content</span>';
                    var element = tpl;
                    // console.log($scope.tenantSettings);
                    dateFormat = $scope.tenantSettings.tenantFormats.dateFormat.name;
                    dateFormat = dateFormat.replace(/D/g, "d").replace(/Y/g, "y");
                    formattedDate = $filter("date")(cellValue, dateFormat, "UTC");
                    if (options.colModel.label == "Due Date" || options.colModel.label == "Working Due Date" || options.colModel.label == "Seller Due Date" || options.colModel.label == "Order Date") {
                        formattedDate = $filter("date")(cellValue, "dd/MM/yyyy", "UTC");
                    }
                    if (formattedDate) {
                        if (formattedDate.indexOf("0001") != -1) {
                            formattedDate = "";
                        }
                    }
                    if (cellValue != null) {
                        return "<div>" + formattedDate + "<div>";
                        // formattedDate = vm.formatDate(cellValue, $scope.tenantSettings.tenantFormats.dateFormat);
                        // element = var_bind(':content', formattedDate, element);
                        // return formattedDate;
                    }
                    return "";
                };
                var table_modal = function(cellValue, options, rowObject) {
                    var tpl = '<span class="jqgrid-ng-action copy centeredIcon" ng-click="CLC.openNotes(' + rowObject.id + ',\'table_modal\')" title="Copy">Copy</span>';
                    return tpl;
                };
                var documents_verified_checkbox = function(cellValue, options, rowObject) {
                    console.log(cellValue, options);
                    console.log(rowObject);
                    $scope["doc_verify_"+rowObject.id] = cellValue;
                    var tpl = '<span class=""><label class="mt-custom-checkbox" for="doc_verify_' + rowObject.id + '"><input type="checkbox" ng-model="doc_verify_' + rowObject.id + '" name="documents_verified" id="doc_verify_' + rowObject.id + '" ng-change="CLC.verifyDocument(' + rowObject.id + ',' + options.rowId + ')"/><span></span></label></span>';
                    return tpl;
                };
                var documents_notes_modal = function(cellValue, options, rowObject) {
                    // rowObject.notes = "asdasdasdasdasd";
                    var tpl = '<span class="jqgrid-ng-action centeredIcon" notes-row-id="' + rowObject.id + '" notes-row-value="' + rowObject.notes + '" ng-click="CLC.openNotes(' + rowObject.id + ', \'documents_notes_modal\')" title="Open"><i class="fa fa-comments" aria-hidden="true" style="font-size:14px"></i></span>';
                    return tpl;
                };
                var editLocationLink = function(cellValue, options, rowObject) {
                    var tpl = '<a href="/#/masters/location/edit/' + cellValue + '"><span class="formatter edit_link">' + cellValue + "</span></a>";
                    return tpl;
                };

                var schedule_type = function(cellValue, options, rowObject) {
                    var tpl = '<span class="centeredIcon ' + cellValue + '-scheduleIcon"><i class="fa fa-clock-o" aria-hidden="true"></i></span>';
                    return tpl;
                };
                var time_only = function(cellValue, options, rowObject) {
                    var time = $filter("date")(cellValue, "shortTime");
                    var tpl = "<span>" + time + "</span>";
                    return tpl;
                };
                var date_only = function(cellValue, options, rowObject) {
                    var date = $filter("date")(cellValue, "shortDate");
                    var tpl = "<span>" + date + "</span>";
                    return tpl;
                };
                var delete_upload_log = function(cellValue, options, rowObject) {
                    var tpl = '<span class="jqgrid-ng-action delete centeredIcon" ng-click="CLC.deleteUploadLog(' + rowObject.id + ')" title="Delete"></span>';
                    return tpl;
                };
                //masters_isdeleted Active/Inactive
                var masters_isdeleted = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    if (typeof cellValue == "undefined") {
                        element = var_bind(":content", "", element);
                    }
                    if (!cellValue || cellValue == "Active") {
                        element = var_bind(":content", "Active", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                    } else {
                        element = var_bind(":content", "Inactive", element);
                        element = var_bind(":css_formatting", "danger lowercase", element);
                    }
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    return element;
                };
                var masters_blacklisted = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    if (typeof cellValue == "undefined") {
                        element = var_bind(":content", "", element);
                    }
                    if (!cellValue || cellValue == "Active") {
                        element = var_bind(":content", "No", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                    } else {
                        element = var_bind(":content", "Yes", element);
                        element = var_bind(":css_formatting", "danger lowercase", element);
                    }
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    return element;
                };
                var delivery_quality_matched = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    element = var_bind(":content", cellValue, element);
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    if (typeof cellValue == "undefined") {
                        element = var_bind(":content", "", element);
                    }
                    if (parseInt(cellValue) == 1) {
                        element = var_bind(":content", "Passed", element);
                        element = var_bind(":css_formatting", "passed lowercase", element);
                    }
                    if (parseInt(cellValue) == 0) {
                        element = var_bind(":content", "Failed", element);
                        element = var_bind(":css_formatting", "failed lowercase", element);
                    }
                    return element;
                };
                //order_status partially invoiced/invoiced
                var order_status_invoiced = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    element = var_bind(":content", cellValue.name, element);
                    element = var_bind(":css_formatting", "succes lowercase", element);
                    element = var_bind(":content", cellValue, element);
                    return element;
                };
                var approval_status = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    if (cellValue == null) {
                        element = var_bind(":content", "-", element);
                    }
                    if (cellValue == "Discrepancy") element = var_bind(":class", "discrepancy", element);
                    element = var_bind(":content", cellValue, element);
                    element = var_bind(":css_formatting", "succes lowercase", element);
                    // element = var_bind(':content', cellValue, element);
                    return element;
                };
                //invoice status Approved / Waiting for approval
                var invoice_status_approved = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    element = var_bind(":content", cellValue, element);
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    if (parseInt(cellValue) == 1) {
                        element = var_bind(":content", "Approved", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                    }
                    if (parseInt(cellValue) == 0) {
                        element = var_bind(":content", "Waiting for approval", element);
                        element = var_bind(":css_formatting", "warning lowercase", element);
                    }
                    return element;
                };
                //status matched not matched
                var status_matched_notmatched = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    if (cellValue == "Matched") {
                        element = var_bind(":content", "Matched", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                    }
                    if (cellValue == "Unmatched") {
                        element = var_bind(":content", "Unmatched", element);
                        element = var_bind(":css_formatting", "danger lowercase", element);
                    }
                    if (cellValue == "" || cellValue == null) {
                        element = var_bind(":content", "", element);
                    } else {
                        //default
                        newDisplayName = null;
                        $.each($listsCache.QualityMatch, function(key, val) {
                            if (val.name == cellValue) {
                                if (val.displayName) newDisplayName = val.displayName;
                            }
                        });
                        if (newDisplayName != null) {
                            element = var_bind(":content", newDisplayName, element);
                        } else {
                            element = var_bind(":content", cellValue, element);
                        }
                    }
                    return element;
                };
                //status verified not verified
                var status_verified_notverified = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    if (typeof cellValue == "object") {
                        if (cellValue != null) {
                            if (typeof cellValue.displayName != "undefined") {
                                if (cellValue.displayName != null) {
                                    newDisplayName = cellValue.displayName;
                                } else {
                                    newDisplayName = "-";
                                }
                            } else {
                                newDisplayName = cellValue.name;
                            }
                            element = var_bind(":content", newDisplayName, element);
                            if (cellValue.name == "Open") {
                                element = var_bind(":content", "Verified", element);
                                element = var_bind(":css_formatting", "warning lowercase min100", element);
                            }
                            if (cellValue.name == "Verified") {
                                element = var_bind(":content", "Verified", element);
                                element = var_bind(":css_formatting", "succes lowercase min100", element);
                            }
                            if (cellValue.name == "NotVerified") {
                                element = var_bind(":content", "Not verified", element);
                                element = var_bind(":css_formatting", "warning lowercase min100", element);
                            }
                        } else {
                            //cellValue is null, only bind content '';
                            element = var_bind(":content", "", element);
                        }
                    } else {
                        //not obj, regular binding
                        element = var_bind(":content", cellValue, element);
                        if (cellValue == "") {
                            element = var_bind(":content", "", element);
                        }
                        if (cellValue == "Open") {
                            element = var_bind(":content", "Verified", element);
                            element = var_bind(":css_formatting", "warning lowercase min100", element);
                        }
                        if (cellValue == "Verified") {
                            element = var_bind(":content", "Verified", element);
                            element = var_bind(":css_formatting", "succes lowercase min100", element);
                        }
                        if (cellValue == "NotVerified") {
                            element = var_bind(":content", "Not verified", element);
                            element = var_bind(":css_formatting", "warning lowercase min100", element);
                        }
                    }
                    return element;
                };
                // active_inactive
                var active_inactive = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    element = var_bind(":content", cellValue, element);
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    if (parseInt(cellValue) == 1) {
                        element = var_bind(":content", "active", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                    }
                    if (parseInt(cellValue) == 0) {
                        element = var_bind(":content", "inactive", element);
                        element = var_bind(":css_formatting", "danger lowercase", element);
                    }
                    return element;
                };
                // passed_failed
                var passed_failed = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    element = var_bind(":content", cellValue, element);
                    if (cellValue == "" || typeof cellValue == "undefined") {
                        element = var_bind(":content", "", element);
                    }
                    if (parseInt(cellValue) == 1) {
                        element = var_bind(":content", "passed", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                    }
                    if (parseInt(cellValue) == 0) {
                        element = var_bind(":content", "failed", element);
                        element = var_bind(":css_formatting", "danger lowercase", element);
                    }
                    return element;
                };
                // yes_no
                var yes_no = function(cellValue, options, rowObject) {
                    var elemClass = name;
                    var type = "status";
                    //default
                    var content = "";
                    var cssFormatting = "";
                    if (cellValue == "") {
                        content = "";
                    }
                    if (cellValue == true) {
                        content = "Yes";
                        cssFormatting = "succes lowercase";
                    }
                    if (cellValue == false) {
                        content = "No";
                        cssFormatting = "danger lowercase";
                    }
                    var element = '<span class="formatter ' + elemClass + " " + cssFormatting + '" data-formatter-type="' + type + '">' + content + "</span>";
                    return element;
                };
                // yes_no reversed
                var yes_no_reversed = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    element = var_bind(":content", cellValue, element);
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    if (parseInt(cellValue) == 1) {
                        element = var_bind(":content", "yes", element);
                        element = var_bind(":css_formatting", "danger lowercase", element);
                    }
                    if (parseInt(cellValue) == 0) {
                        element = var_bind(":content", "no", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                    }
                    return element;
                };
                // edit_link  - add edit lionk to column
                var edit_link = function(cellValue, options, rowObject) {
                    var tpl = '<span class="formatter :class" data-formatter-type=":type" ng-click="CLC.do_entity_action(\'edit\', \':entity_id\')">' + cellValue + "</span>";
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    if ($state.params.screen_id == "contract" && rowObject["id1"]) {
                        element = var_bind(":entity_id", rowObject["id1"], element);
                    }
                    element = var_bind(":entity_id", rowObject["id"], element);
                    if (options.gid == "flat_contractproductdeliveries") {
                        var tpl = '  <a ng-href="#/delivery/delivery/edit/' + rowObject["deliveryId"] + '" ><span class="formatter edit_link" data-formatter-type="status">' + rowObject["deliveryNo"] + "</span></a>";
                        if (rowObject["deliveryId"] != null) {
                            // return '<span class="formatter edit_link"><a href="#/deliveries/delivery/edit/'+rowObject["deliveryId"]+'" target="_blank">'+rowObject["deliveryNo"]+'</a></span>';
                            return tpl;
                        } else {
                            return "<span></span>";
                        }
                    }
                    if (options.gid == "flat_counterparties") {
                        var tpl = '<a ng-href="#/masters/counterparty/edit/' + cellValue + '"  target="_blank"><span class="formatter edit_link" data-formatter-type="status">' + cellValue + "</span></a>";
                        if (cellValue != null) {
                            return tpl;
                        } else {
                            return "<span></span>";
                        }
                    }
                    if (options.gid == "flat_formula_master_list") {
                        var tpl = '<a ng-href="#/masters/formula/edit/' + cellValue + '"  target="_blank"><span class="formatter edit_link" data-formatter-type="status">' + cellValue + "</span></a>";
                        if (cellValue != null) {
                            return tpl;
                        } else {
                            return "<span></span>";
                        }
                    }
                    if(options.gid == "flat_available_contracts"){
                        var entity_name = "";
                        if(options.colModel.name == "contract.id") entity_name = "contracts/contract";
                        if(options.colModel.name == "formulaId") entity_name = "masters/formula";

                        var tpl = '<a ng-href="#/' + entity_name + '/edit/' + cellValue + '" data-html="true" target="_blank"><span class="formatter edit_link" data-formatter-type="status">' + cellValue + "</span></a>";

                        if (options.colModel.name == "formulaId") {
                            var tpl = '<a ng-href="#/' + entity_name + '/edit/' + cellValue + '" data-html="true" target="_blank"><span class="formatter edit_link" data-formatter-type="status">' + rowObject["formulaDescription"] + "</span></a>";
                        }
                        if (cellValue != null) {
                            return tpl;
                        } else {
                            return "<span></span>";
                        }
                    }

                    return element;
                };
                // edit_delivery_link  - add edit link to column
                var edit_delivery_link = function(cellValue, options, rowObject) {
                    cellValue == null ? (cellValue = "") : "";
                    if (rowObject.delivery) {
                        var tpl = '  <a  href="#/delivery/delivery/edit/' + rowObject.delivery.id + '" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                    } else {
                        var tpl = '  <a  style="width: calc(100% - 20px);"><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
                    }
                    return tpl;
                }; // edit_order_link  - add edit lionk to column
                var contract_link = function(cellValue, options, rowObject) {
                    cellValue == null ? (cellValue = "") : "";
                    if (rowObject.contract) {
                        var tpl = '  <a  href="#/contracts/contract/edit/' + rowObject.contract.id + '" target="_blank" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                    } else {
                        var tpl = '  <a  style="width: calc(100% - 20px); target="_blank""><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
                    }
                    return tpl;
                };                
                var edit_request_link_from_delivery = function(cellValue, options, rowObject) {
                    cellValue == null ? (cellValue = "") : "";
                    tpl = " ";
                    if (rowObject.requestId) {
                        var tpl = '  <a  href="#/edit-request/' + rowObject.requestId + '" target="_blank" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none" >' + cellValue + "</span></a>";
                    } else if (rowObject.voyageDetail){
                        if(rowObject.voyageDetail.request){
                            if (rowObject.voyageDetail.request.id) {
                                var tpl = '  <a  href="#/edit-request/' + rowObject.voyageDetail.request.id + '" target="_blank" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none" >' + cellValue + "</span></a>";
                            }
                        }else{
                            var tpl = '  <a  href="#/new-request/' + rowObject.voyageDetail.id + '" target="_blank" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none" >' + cellValue + "</span></a>";
                        }
                    } else {
                        var tpl = '  <a  style="width: calc(100% - 20px);"><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
                    }

           
                    return tpl;
                }; // edit_order_link  - add edit lionk to column
                var edit_invoice_link = function(cellValue, options, rowObject) {
                    cellValue == null ? (cellValue = "") : "";
                    if (rowObject.invoice) {
                        var tpl = '  <a  href="#/invoices/invoice/edit/' + rowObject.invoice.id + '" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                    } else {
                        var tpl = '  <a  style="width: calc(100% - 20px);"><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
                    }
                    return tpl;
                };
                var edit_order_link = function(cellValue, options, rowObject) {
                    if (rowObject.order) {
                        var tpl = ' <a href="#/edit-order/' + rowObject.order.id + '" style="width: 100%" target="_blank"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.order.name + "</span></a>";
                    } else {
                        var tpl = '<span class="formatter no_order" style="white-space:none"> - </span>';
                        setTimeout(function() {
                            if ($(".no_order").length > 0) {
                                $(".no_order")
                                    .parents("tr")
                                    .find('td[aria-describedby="flat_recon_actions-0"]')
                                    .html("");
                            }
                        }, 10);
                    }
                    var element = tpl;
                    return element;
                };
                var edit_request_link = function(cellValue, options, rowObject) {
                    var tpl = null;
                    if (rowObject.requestGroupId) {
                        var tpl = ' <a href="#/group-of-requests/' + rowObject.requestGroupId + '" target="_blank" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.request.id + "</span></a>";
                    } else if (rowObject.request) {
                        var tpl = ' <a href="#/edit-request/' + rowObject.request.id + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.request.id + "</span></a>";
                    } else {
                        var tpl = ' <a style="width: calc(100% + 40px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none"> - </span></a>';
                        var tpl = "";
                    }
                    if (rowObject.requestId) {
                        var tpl = ' <a href="#/edit-request/' + rowObject.requestId + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.requestId + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                var go_to_request = function(cellValue, options, rowObject) {
                    var tpl = "";
                    if (cellValue) {
                        var tpl = ' <a href="#/edit-request/' + cellValue + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + cellValue + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                var go_to_request_ordersdelivery = function(cellValue, options, rowObject) {
                    var tpl = "";
                    if (cellValue) {
                        var tpl = ' <a href="#/edit-request/' + rowObject.reqId + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + cellValue + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                var go_to_order = function(cellValue, options, rowObject) {
                    var tpl = "";
                    // if(typeo(cellValue.indexOf('BU') > -1){
                    //     if (cellValue && rowObject.order) {
                    //         var tpl = ' <a href="#/edit-order/' + rowObject.order.id + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.order.name + '</span></a>';
                    //     }
                    // }else{
                    if (cellValue && rowObject.order) {
                        var tpl = ' <a href="#/edit-order/' + rowObject.order.id + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.order.name + "</span></a>";
                    }
                    // }
                    var element = tpl;
                    return element;
                };
                /*From Claims List*/
                var edit_order_link_from_claims = function(cellValue, options, rowObject) {
                    var tpl = "";
                    if (cellValue) {
                        var tpl = ' <a href="#/edit-order/' + rowObject.orderId + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + cellValue + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                var edit_claim_link_from_claims = function(cellValue, options, rowObject) {
                    var tpl = "";
                    if (cellValue) {
                        var tpl = ' <a href="#/claims/claim/edit/' + rowObject.id + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + cellValue + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                var edit_delivery_link_from_claims = function(cellValue, options, rowObject) {
                    cellValue == null ? (cellValue = "") : "";
                    if (cellValue) {
                        var tpl = '  <a  href="#/delivery/delivery/edit/' + cellValue + '" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                    } else {
                        var tpl = '  <a  style="width: calc(100% - 20px);"><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
                    }
                    return tpl;
                };
                var requestNoFromRequestId = function(cellValue, options, rowObject) {
                    var tpl = "";
                    if (cellValue && rowObject.requestNo) {
                        var tpl = ' <a href="#/edit-request/' + cellValue + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.requestNo + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                var groupOfRequests = function(cellValue, options, rowObject) {
                    var tpl = "";
                    if (cellValue) {
                        var tpl = ' <a href="#/group-of-requests/' + cellValue + '" target="_blank" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + cellValue + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                /* END From Claims List*/
                // status_new_verified
                var status_new_verified = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    // console.log(typeof cellValue);
                    if (typeof cellValue != "object") {
                        element = var_bind(":content", cellValue, element);
                        if (cellValue == "") {
                            element = var_bind(":content", "", element);
                        }
                        if (cellValue == "New") {
                            element = var_bind(":content", "new", element);
                            element = var_bind(":css_formatting", "warning lowercase", element);
                        }
                        if (cellValue == "Verified") {
                            element = var_bind(":content", "verified", element);
                            element = var_bind(":css_formatting", "succes lowercase", element);
                        }
                        if (cellValue == "Delivered") {
                            element = var_bind(":content", "Delivered", element);
                            element = var_bind(":css_formatting", "succes lowercase", element);
                        }
                        if (cellValue == "Invalid" || cellValue == "Off Spec") {
                            element = var_bind(":content", cellValue, element);
                            element = var_bind(":css_formatting", "danger lowercase", element);
                        }
                    } else {
                        if (cellValue != null) {
                            if (cellValue.displayName) {
                                newDisplayName = cellValue.displayName;
                            } else {
                                newDisplayName = cellValue.name;
                            }
                            //bind content
                            element = var_bind(":content", newDisplayName, element);
                            if (newDisplayName == "") {
                                element = var_bind(":content", "", element);
                            }
                            console.log(cellValue);
                            //color
                            if (cellValue.name == "New") {
                                element = var_bind(":content", "new", element);
                                element = var_bind(":css_formatting", "warning lowercase", element);
                            }
                            if (cellValue.name == "Verified") {
                                element = var_bind(":content", "verified", element);
                                element = var_bind(":css_formatting", "succes lowercase", element);
                            }
                            if (cellValue.name == "Delivered") {
                                element = var_bind(":content", "Delivered", element);
                                element = var_bind(":css_formatting", "succes lowercase", element);
                            }
                            if (cellValue.name == "Stemmed") {
                                element = var_bind(":css_formatting", "warning lowercase", element);
                            }
                            if (cellValue.name == "Confirmed") {
                                element = var_bind(":css_formatting", "succes lowercase", element);
                            }
                            if (cellValue.name == "Invalid") {
                                element = var_bind(":css_formatting", "danger lowercase", element);
                            }
                        } else {
                            newDisplayName = null;
                            element = var_bind(":content", "-", element);
                        }
                    }
                    return element;
                };
                // claim_status
                var claim_status = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    element = var_bind(":content", cellValue, element);
                    if (parseInt(cellValue) == 0) {
                        element = var_bind(":content", "New", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                        return element;
                    }
                    if (parseInt(cellValue) == 1) {
                        element = var_bind(":content", "Completed", element);
                        element = var_bind(":css_formatting", "warning lowercase", element);
                        return element;
                    }
                    //default
                    element = var_bind(":content", cellValue, element);
                    return element;
                };
                // contract management status_draft
                var status_draft = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    element = var_bind(":content", cellValue, element);
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    if (typeof cellValue == "string") {
                        if (cellValue.indexOf("Draft")) {
                            element = var_bind(":css_formatting", "greyed lowercase", element);
                        }
                        if (cellValue.indexOf("draft")) {
                            element = var_bind(":css_formatting", "greyed lowercase", element);
                        }
                    }
                    if (parseInt(cellValue) == 0) {
                        element = var_bind(":content", "Draft", element);
                        element = var_bind(":css_formatting", "greyed lowercase", element);
                    } else {
                        element = var_bind(":content", "", element);
                    }
                    return element;
                };
                // contract management list  "extend" actions
                var extend_action = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    //default
                    element = var_bind(":content", cellValue, element);
                    if (parseInt(cellValue) == 1) {
                        element = var_bind(":content", "Extend", element);
                        element = var_bind(":css_formatting", "warning-ghost lowercase", element);
                    } else {
                        element = var_bind(":content", "Extend", element);
                        element = var_bind(":css_formatting", "greyed-ghost lowercase", element);
                    }
                    if (cellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    return element;
                };
                // recon list order status - delivery
                var delivery_status = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    if (typeof cellValue != "undefined") {
                        if (typeof cellValue == "string") {
                            newCellValue = cellValue;
                        } else {
                            if (cellValue.displayName) {
                                newCellValue = cellValue.displayName;
                            } else {
                                newCellValue = cellValue.name;
                            }
                        }
                    }
                    //default
                    element = var_bind(":content", newCellValue, element);
                    if (newCellValue == "") {
                        element = var_bind(":content", "", element);
                    }
                    valSet = false;
                    if (parseInt(cellValue) == 1) {
                        element = var_bind(":content", "Confirmed", element);
                        element = var_bind(":css_formatting", "succes lowercase", element);
                        valSet = true;
                    }
                    if (parseInt(cellValue) == 0) {
                        element = var_bind(":content", "Partially delivered", element);
                        element = var_bind(":css_formatting", "warning lowercase", element);
                        valSet = true;
                    }
                    if (!valSet && typeof cellValue != "undefined") {
                        if (cellValue.name == "Confirmed") {
                            element = var_bind(":content", newCellValue, element);
                            element = var_bind(":css_formatting", "succes lowercase", element);
                        } else {
                            element = var_bind(":content", newCellValue, element);
                            element = var_bind(":css_formatting", "warning lowercase", element);
                        }
                    }
                    return element;
                };
                // Lookup
                var lookup_input = function(cellValue, options, rowObject) {
                    var element = tpl;
                    var input = "<input ng-click=\"CLC.trigger('contract_lookup', {input_id: 'req_" + rowObject.req_id + '\'})" class="lookup_input req_' + rowObject.req_id + '" name="req_' + rowObject.req_id + '" id="req_' + rowObject.req_id + '" value=":lookup_input_value" />';
                    input = var_bind(":lookup_input_value", cellValue, input);
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    element = var_bind(":content", input, element);
                    return element;
                };
                // text input
                var text_input = function(cellValue, options, rowObject) {
                    var element = tpl;
                    var input = '<input class="text_input x" name="x" id="x" value=":text_input_value" />';
                    if (cellValue) {
                        input = var_bind(":text_input_value", cellValue, input);
                    } else {
                    }
                    input = var_bind(":text_input_value", "", input);
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    element = var_bind(":content", input, element);
                    return element;
                };
                // date
                var date = function(cellValue, options, rowObject) {
                    ngModel = "treasuryRow_" + rowObject.id;
                    var element = tpl;
                    var input = '<div class="input-group date date-picker" data-provide="datepicker" data-date-format="dd/mm/yyyy" data-date-viewmode="years" data-date-minviewmode="months"> <input type="text" class="form-control" readonly="" value=":text_input_value"> <span class="input-group-btn"> <button class="btn default" type="button"> <i class="fa fa-calendar"></i> </button> </span> </div>';
                    //var input = '<input data-provide="datepicker" class="datepicker date_input x" name="x" id="x" value=":text_input_value" />';
                    var d = new Date(cellValue);
                    var day = d.getDate();
                    var month = d.getMonth() + 1; //Months are zero based
                    var year = d.getFullYear();
                    var date = day + "/" + month + "/" + year;
                    var date = "";
                    input = var_bind(":text_input_value", date, input);
                    element = var_bind(":content", input, element);
                    // newDate = vm.formatDate(d, "DD/mm/yyyy")
                    // element = '<input type=text disabled value="'+d+'" >';
                    fdate = $filter("date")(cellValue, "dd/MM/yyyy hh:mm", "+0");
                    if (typeof fdate == "undefined") {
                        fdate = "";
                    }
                    element = "<span>" + fdate + "</span>";
                    return element;
                };
                // dropdown
                var dropdown = function(cellValue, options, rowObject) {
                    var values = cellValue;
                    var element = tpl;
                    element = var_bind(":class", "dropdown", element);
                    var input = '<select class="form-control">:options</select>';
                    var options = "";
                    $.each(values, function(key, val) {
                        options += '<option value="' + val + '">' + key + "</option>";
                    });
                    input = var_bind(":options", options, input);
                    element = var_bind(":content", input, element);
                    return element;
                };
                // number input
                var number = function(cellValue, options, rowObject) {
                    var element = tpl;
                    var input = '<input type="number" class="text_input x" name="x" id="x" value=":text_input_value" />';
                    if (cellValue) {
                        input = var_bind(":text_input_value", cellValue, input);
                    } else {
                    }
                    input = var_bind(":text_input_value", "", input);
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    element = var_bind(":content", input, element);
                    return element;
                };
                var numberText = function(cellValue, options, rowObject) {
                    element = "";
                    if (cellValue) {
                        element = $filter("number")(cellValue, 3);
                    }
                    return element;
                };
                var quantity = function(cellValue, options, rowObject) {
                    element = "";
                    if (cellValue != null) {
                        element = $filter("number")(cellValue, $scope.tenantSettings.defaultValues.quantityPrecision);
                    }

                    return element;
                };
                var price = function(cellValue, options, rowObject) {
                    element = "";
                    if (cellValue != null) {
                        element = $filter("number")(cellValue, $scope.tenantSettings.defaultValues.pricePrecision);
                    }
                    return element;
                };
                var amount = function(cellValue, options, rowObject) {
                    element = "";
                    if (cellValue != null) {
                        element = $filter("number")(cellValue, $scope.tenantSettings.defaultValues.amountPrecision);
                    }
                    return element;
                };
                //checkbox
                var checkbox = function(cellValue, options, rowObject) {
                    var element = tpl;
                    var input = '<input type="checkbox" class="checkbox_input x" name="x" id="x" :checked />';
                    if (cellValue) {
                        input = var_bind(":checked", cellValue, input);
                    } else {
                    }
                    input = var_bind(":checked", "", input);
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    element = var_bind(":content", input, element);
                    return element;
                };
                var modal_check = function(cellValue, options, rowObject) {
                    var element = tpl;
                    var input = '<label class="mt-checkbox"><span></span></label>';
                    if (cellValue) {
                        input = var_bind(":checked", cellValue, input);
                    } else {
                    }
                    input = var_bind(":checked", "", input);
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "checkbox", element);
                    element = var_bind(":content", input, element);
                    return element;
                };
                var formGotoDocument = function(cellValue, options, rowObject) {
                    // return '<a ng-controller="Controller_Master as CM" ng-click="downloadDocument(' + rowObject.id + ')" title="Download">' + cellValue + '</a>';
                    return '<a ng-controller="Controller_Master as CM" ng-click="downloadDocument(' + rowObject.id + ",'" + rowObject.name + '\')" title="Download">' + cellValue + "</a>";
                };
                // collection Read -- {code, collectionName, id, name}
                var collectionRead = function(cellValue, options, rowObject) {
                    var element = tpl;
                    element = var_bind(":content", cellValue[options.colModel.params.collectionSelector], element);
                    if (options.colModel.params.collectionType == "status") {
                        element = var_bind(":type", "status", element);
                        switch (cellValue.id) {
                            case 1: // success
                                element = var_bind(":css_formatting", "succes lowercase", element);
                                break;
                            case 2: // pending
                                element = var_bind(":css_formatting", "warning lowercase", element);
                                break;
                        }
                    }
                    return element;
                };
                // date Format
                var dateFormat = function(cellValue, options, rowObject) {
                    var tpl = '<span class="formatter">:content</span>';
                    var element = tpl;
                    // console.log($scope.tenantSettings);
                    dateFormat = $scope.tenantSettings.tenantFormats.dateFormat.name;
                    dateFormat = dateFormat.replace(/D/g, "d").replace(/Y/g, "y");
                    formattedDate = $filter("date")(cellValue, dateFormat);
                    if (cellValue != null) {
                        return "<div>" + formattedDate + "<div>";
                        // formattedDate = vm.formatDate(cellValue, $scope.tenantSettings.tenantFormats.dateFormat);
                        // element = var_bind(':content', formattedDate, element);
                        // return formattedDate;
                    }
                    return "";
                };

                
                var best_contract_color = function(cellValue, options, rowObject) {
                    if(cellValue == null) cellValue = "";

                    var tpl = '<span class=" best_contract_formatter">' + cellValue + '</span>';
           
                    return tpl;

                    // return cellValue;

                    // display: inline-block;
                    // padding: 2px 10px;
                    // background: green;
                    // color: #fff;
                };

                var best_contract_is_match = function(cellValue, options, rowObject) {
                    var className = "";

                    if(options.colModel.name == "location.name"){
                        if(rowObject.mainLocationMatched){
                            className = "isMatch";
                        }
                    }

                    if(options.colModel.name == "product.name"){
                        if(rowObject.mainProductMatched){
                            className = "isMatch";
                        }
                    }
             
                    var tpl = '<span class=" ' + className + '">' + cellValue + '</span>';
                    return tpl;
                };

                var best_contract_price = function(cellValue, options, rowObject) {
                    var tpl = '<span class=""></span>';
                    if(cellValue != null){
                        if(rowObject.currency != null){

                            var currency = rowObject.currency.name;
                            var price =  $filter('number')(rowObject.fixedPrice, 3);
                 
    
                            tpl = '<span class="">' + currency + ' ' + price + '</span>';
                        }
                    }
                    return tpl;
                };

                var quantity_with_uom = function(cellValue, options, rowObject) {
                    var tpl = '<span class=""></span>';
                    if(cellValue != null){
                        if (rowObject.uom != null) {
                            var uom = rowObject.uom.name;
                            var qty = $filter('number')(rowObject[options.colModel.name], 3);
                            
                            console.log(rowObject[options.colModel.name]);
                      
                        }
    
                        tpl = '<span class="">'+ qty + ' ' + uom +'</span>';
                    }
                    return tpl;
                };

                var best_contract_loop = function(cellValue, options, rowObject) {
                    var cellList = "";
                    currentCellKey = options.colModel.name
                    if (options.colModel.name.indexOf(".name") != -1) {
                        currentCellKey = options.colModel.name.split(".name")[0]
                    } 

                    $.each(rowObject[currentCellKey], function(key,val){
                        cellList = cellList + "<div>" + (val.name ? val.name : val);
                        if(key != (rowObject[currentCellKey].length - 1)){
                            cellList = cellList + ",</div>";
                        }else{
                            cellList = cellList + "</div>";
                        }
                        
                    })
           
                    var tpl = '<span class="best_contract_loop"><ul style="overflow:hidden" data-html="true" tooltip data-original-title="'+cellList+'">'+ cellList + '</ul></span>';
                    return tpl;
                };

                var best_contract_checkbox = function(cellValue, options, rowObject) {
                    // var tpl = '<span class="formatter">best_contract_checkbox</span>';

                    var uniqueModel = "checked_" + rowObject.id;
                    var entityId = rowObject.id;
                    if (typeof vm.changedfields[entityId] == "undefined") {
                        vm.changedfields[entityId] = {};
                    }
                    vm.changedfields[rowObject.id]["isChecked"] = cellValue || rowObject.isAssignedContract;
                    if (!$rootScope.defaultSelectedBestContracts) {
                        $rootScope.defaultSelectedBestContracts = vm.changedfields;
                    }
                    // if (rowObject.isAssignedContract) {
                    //  $rootScope.$emit('best_contracts_checkbox', {isChecked: true});
                       //  vm.checkChange(entityId);
                    // }

                  
                    var tpl = "<input class='best_contracts_checkbox' id='chk_" + uniqueModel + "' type='checkbox' ng-model='CLC.changedfields[" + entityId + "].isChecked' ng-change='CLC.checkChange(" + entityId + ");' /><label class='best_contracts_checkbox' for='chk_" + uniqueModel + "'><i class='fa fa-check'></i></label>";

                    return tpl;

                };

            }
            // ====== /FORMATTERS ======
            // ====== RUN ======
            if (typeof eval(name) == "function") {
                return eval(name);
            } else {
                console.error("Formatter " +name+ " doesn't exist!");
            }
            // ====== /RUN ======
        };
        vm.changedfields = [];
        vm.editable_formatter = function(format, name) {
            console.log(format);
            console.log(name);
            var date = function(cellValue, options, rowObject) {
                // return new Date();
            };
            var treasury_checkbox = function(cellValue, options, rowObject) {
                uniqueModel = "checked_" + rowObject.id;
                vm.changedfields[entityId]["isChecked"] = cellValue;
                // tpl = "<label class='mt-checkbox'><input type='checkbox' ng-model='CLC.changedfields[" + entityId + "].isChecked' ng-change='CLC.checkChange(); CLC.calculateSubtotal(CLC.changedfields[" + entityId + "].isChecked)' /><span></span></label>"
                tpl = "<input class='treasury_checkbox' id='chk_" + uniqueModel + "' type='checkbox' ng-model='CLC.changedfields[" + entityId + "].isChecked' ng-change='CLC.checkChange(" + entityId + "); CLC.calculateSubtotal(CLC.changedfields[" + entityId + "].isChecked)' /><label class='treasury_checkbox' for='chk_" + uniqueModel + "'><i class='fa fa-check'></i></label>";
                return tpl;
            };
            var textarea = function(cellValue, options, rowObject) {
                if (cellValue == null || typeof cellValue == "undefined") {
                    cellValue = "";
                }
                entityId = rowObject.id;
                if (typeof vm.changedfields[entityId] == "undefined") {
                    vm.changedfields[entityId] = {};
                }
                vm.changedfields[entityId][name] = cellValue;
                tpl = "<span title=''><input class='form-control' ng-model='CLC.changedfields[" + entityId + "]." + name + "' ng-blur='CLC.checkChange(" + entityId + ")' /></span>";
                return tpl;
            };
            var dropdown = function(cellValue, options, rowObject) {
                if (cellValue == null || typeof cellValue == "undefined") {
                    cellValue = "";
                }
                entityId = rowObject.id;
                if (typeof vm.changedfields[entityId] == "undefined") {
                    vm.changedfields[entityId] = {};
                }
                vm.changedfields[entityId]['paymentStatus'] = rowObject.paymentStatus;
                tpl = "<span title=''><select class='w100 form-control' ng-options='item as item.name for item in CLC.listsCache.PaymentStatus track by item.id' ng-model='CLC.changedfields[" + entityId + "].paymentStatus' ng-change='CLC.checkChange(" + entityId + ")' /></span>";
                return tpl;
            };
            var date = function(cellValue, options, rowObject) {
                // this is the editable date formatter 
                // template %%%
                if (cellValue == null || typeof cellValue == "undefined") {
                    cellValue = "";
                }
                entityId = rowObject.id;
                if (typeof vm.changedfields[entityId] == "undefined") {
                    vm.changedfields[entityId] = {};
                }
                vm.changedfields[entityId][name] = cellValue;
                dateFormat = $scope.tenantSettings.tenantFormats.dateFormat.name;
                dateFormat = 'dd/MM/yyyy';
                tpl =
                    "<div class='input-group date date-picker' data-date-format='yyyy-mm-ddT12:00:00Z' data-provide='datepicker'><span class='dateFormatted'>{{CLC.formatDate(CLC.changedfields[" +
                    entityId +
                    "]." +
                    name +
                    ", '" +
                    dateFormat +
                    "')}}</span><input type='text' class='form-control hidden' readonly='' ng-change='CLC.checkChange(" +
                    entityId +
                    ")' ng-model='CLC.changedfields[" +
                    entityId +
                    "]." +
                    name +
                    "'> <span class='input-group-btn'> <button class='btn default' type='button'><i class='fa fa-calendar' style='font-size:15px;'></i></button> </span> </div>";
                return tpl;
            };
            var ftpActiveCheckbox = function(cellValue, options, rowObject) {
                tpl = "<input type='checkbox' ng-init='ftpActive_" + rowObject.id + "=" + cellValue + "' ng-model='ftpActive_" + rowObject.id + "' ng-change='CLC.ftpActiveCheckboxChange(" + rowObject.id + ",ftpActive_" + rowObject.id + ");' /><span></span>";
                return tpl;
            };
            var sap_date = function(cellValue, options, rowObject) {
                // formattedDate = $filter('date')(cellValue, 'short');
                dateFormat = $scope.tenantSettings.tenantFormats.dateFormat.name;
                dateFormat = dateFormat.replace(/D/g, "d").replace(/Y/g, "y");
                formattedDate = $filter("date")(cellValue, dateFormat);
                var tpl = '<span ng-controller="SAPExportController as $ctrl"><a   ng-click="$ctrl.sapExport(' + "'" + cellValue + "'" + ')"><span class="formatter">' + formattedDate + "</span></a></span>";
                return tpl;
            };
            var sap_download_link = function(cellValue, options, rowObject) {
                var tpl = '<a ng-controller="SAPExportController as $ctrl"   ng-click="$ctrl.sapExport(' + "'" + rowObject.exportDate + "'" + ')"><span class="formatter">' + cellValue + "</span></a>";
                return tpl;
            };
            if (typeof eval(format) == "function") {
                return eval(format);
            }
        };
        vm.ftpActiveCheckboxChange = function(rowId, value) {
            var payload = {
                Id: rowId,
                active: value
            };
            Factory_General_Components.update_scheduler_configuration(payload, function(callback) {
                if (callback) {
                    console.log(callback);
                }
            });
        };

        vm.saveTreasuryRowChange = function(entityId, changedData) {
            var CLC = $("#invoices_treasuryreport");
            var tableData = CLC.jqGrid.Ascensys.gridObject.rows;
            currentRow = null;
            $.each(tableData, function(k, v) {
                if (v.id == entityId) {
                    currentRow = v;
                }
            });
            console.log(currentRow);
            payload = {
                InvoiceId: currentRow.invoice ? currentRow.invoice.id : null,
                DeliveryId: currentRow.delivery_Id,
                OrderId: currentRow.order.id,
                PaymentDate: changedData.paymentDate ? changedData.paymentDate : null,
                BackOfficeComments: changedData.backOfficeComments,
                PaymentStatus: changedData.paymentStatus ? changedData.paymentStatus : null,
                AccountancyDate: changedData.accountancyDate ? changedData.accountancyDate : null,
                IsChecked: changedData.isChecked ? changedData.isChecked : null
            };
            Factory_General_Components.updateTreasuryInfo(payload, function(callback) {
                if (callback.isSuccess) {
                    toastr.success("Saved successfully");
                    $(".datepicker").hide();
                    var theCLC = $("#flat_invoices_app_complete_view_list");
                    var rowData = CLC.jqGrid.Ascensys.gridObject.rows;
                    $.each(rowData, function(k, v) {
                        if (v.id == entityId) {
                            theCLC.jqGrid("setCell", k+1, 'delayInDates', callback.payload.delayInDates);
                        }
                    });                    
                } else {
                    toastr.error("There was an error when saving the field");
                    $(".datepicker").hide();
                }
            });
        };

        vm.checkChange = function(entityId) {
            if (vm.screen_id == "treasuryreport") {
                $rootScope.treasuryChangedfields = vm.changedfields;
                allSelected = true;
                $.each(vm.changedfields, function(k, v) {
                    if (typeof v != "undefined") {
                        if (typeof vm.changedfields[k] != "undefined") {
                            if (vm.changedfields[k].isChecked == false) {
                                allSelected = false;
                            }
                        }
                    }
                });
                vm.treasury_checkbox_header = allSelected;
                if (entityId) {
                    vm.saveTreasuryRowChange(entityId, vm.changedfields[entityId]);
                }
            }

            if(vm.search_table == "flat_available_contracts"){
                $rootScope.$emit('best_contracts_checkbox', vm.changedfields);
            }

        };

        vm.selectAllTreasuryRows = function() {


            selectAllTreasuryReportPayload = {
            Payload: {
                    Order: null,
                    PageFilters: {
                        Filters: []
                    },
                    SortList: {
                        SortList: []
                    }, 
                    Filters: [],
                    SearchText: null,
                    Pagination: {
                        Skip: 0,
                        Take: 25
                    }
                }
            };    
            selectAllTreasuryReportPayload.Payload.Filters = vm.lastCallTableParams.filters
            selectAllTreasuryReportPayload.Payload.PageFilters.Filters = vm.lastCallTableParams.PageFilters
            selectAllTreasuryReportPayload.UIFilters = vm.lastCallTableParams.UIFilters
            selectAllTreasuryReportPayload.Payload.SearchText = vm.lastCallTableParams.SearchText
            selectAllTreasuryReportPayload.Payload.SortList.SortList = vm.lastCallTableParams.PageFilters.sortList        
            selectAllTreasuryReportPayload.Payload.Pagination.Take =vm.lastCallTableParams.rows;
            selectAllTreasuryReportPayload.Payload.Pagination.Skip =vm.lastCallTableParams.rows * (vm.lastCallTableParams.page - 1);    

            Factory_Master.selectAllTreasuryReport(selectAllTreasuryReportPayload, function(callback) {
                if (callback) {
                    if (callback.status) {
                        $(".treasury_checkbox").prop("checked", true);
                        var CLC = $("#invoices_treasuryreport");
                        var rowData = CLC.jqGrid.Ascensys.gridObject.rows;

                        treasuryTotal = 0;
                        $.each(rowData, function(k, v) {
                            if (typeof vm.changedfields[v.id] != "undefined") {
                                vm.changedfields[v.id].isChecked = true;
                            }
                            v.isChecked = true;
                            treasuryTotal += v.invoiceAmount;
                            vm.treasury_checkbox_header = true;
                        });
                        $compile($("#invoices_treasuryreport"))($rootScope);
                        $compile($('[ng-model="treasurySubtotal"]'))($rootScope);
                        $rootScope.treasurySubtotal = treasuryTotal;                        
                    }
                }
            });
            // $http.post(API.BASE_URL_DATA_INVOICES + '/api/invoice/selectAllTreasuryReport', selectAllTreasuryReportPayload
            // ).then(function successCallback(response) {
            //  if (response.data.isSuccess == true) {
            //      $scope.treasuryReportTotals = response.data.payload;
            //  } else {
            //      toastr.error(response.data.errorMessage);
            //  }
            // });          

        };
        vm.calculateSubtotal = function(data) {
            // console.log(data);
            // console.log(vm.changedfields);
            allRows = vm.changedfields;
            rowsTocheck = [];
            var CLC = $("#invoices_treasuryreport");
            var rowData = CLC.jqGrid.Ascensys.gridObject.rows;
            Object.keys(allRows).forEach(function(key, index) {
                if (this[key].isChecked == true) {
                    selectedData = this[key];
                    $.each(rowData, function(k, v) {
                        if (v.id == key) {
                            rowsTocheck.push(v);
                        }
                    });
                }
            }, allRows);
            $rootScope.treasurySubtotal = 0;
            $.each(rowsTocheck, function(k, v) {
                $rootScope.treasurySubtotal += v.invoiceAmount;
            });
            console.log($rootScope.treasurySubtotal);
        };

        $rootScope.$on("gridDataDone", function(data,res) {
            setTimeout(function(){
                $scope.resetTreasuryCheckboxes();
                vm.lastCallTableParams = res;
                // vm.cpCtr = [];
            },500)
        });
        $rootScope.$on("tableLoaded", function(ev,data){
            setTimeout(function(){
                vm.lastCallTableData = data;
                jQuery(document).ready(function(){
                    $('select.contract_planning_product').select2();
                })        

            },500)
        })
        $scope.resetTreasuryCheckboxes = function() {
            allRows = vm.changedfields;
            rowsTocheck = [];
            $rootScope.treasurySubtotal = 0;
            var CLC = $("#invoices_treasuryreport");
            var rowData = CLC.jqGrid.Ascensys.gridObject.rows;
            // Object.keys(allRows).forEach(function(key, index) {
            //     // this[key].isChecked = false;
            //     if (this[key].isChecked == true) {
               //      $rootScope.treasurySubtotal += 0;
            //     }
            // }, allRows);
            $.each(rowData, function(k, v) {
                if (v.isChecked == true) {
                    $rootScope.treasurySubtotal += v.invoiceAmount;
                } else {
                    vm.treasury_checkbox_header = false;
                    $scope.$apply();
                }
            });
        };
        // Triggers
        vm.trigger = function(entity, params) {
            var contract_lookup = function(params) {
                console.log("trigger -> contract_lookup");
                console.log(entity, params);
                if (params.input_id) {
                    vm.contract__selected_input = params.input_id;
                }
                /*$('#contract_lookup').remove();
                $templateRequest('app-general-components/views/modal_contract_lookup.html').then(function (html) {

                    $('body').append($compile(html)($scope));
                    $('#contract_lookup').modal({
                        modalOverflow: true,
                    });

                });*/
                $("#contract_lookup").modal({
                    modalOverflow: true
                });
                var CLC = $("#contract_lookup table.ui-jqgrid-btable");
                CLC.trigger("reloadGrid");
            };
            var common_lookup = function(params) {
                console.log("trigger -> common_lookup");
                console.log(entity, params);
                $timeout(function() {
                    if (params.input_id) {
                        vm.selected_input = params.input_id;
                    }
                    $("#modal_" + vm.selected_input).modal({
                        modalOverflow: true
                    });
                    var CLC = $("#modal_" + vm.selected_input + " table.ui-jqgrid-btable");
                    CLC.trigger("reloadGrid");
                }, 10);
            };
            if (typeof eval(entity) == "function") {
                eval(entity + "(" + JSON.stringify(params) + ")");
            }
        };
        vm.select_contract = function() {
            var CLC = $("#contract_lookup table.ui-jqgrid-btable");
            var rowId = CLC.jqGrid("getGridParam", "selrow");
            var rowData = CLC.getRowData(rowId);
            vm.contract__selected_contract = rowData.id;
            $("#contract_lookup").modal("hide");
            $("#" + vm.contract__selected_input).val(vm.contract__selected_contract);
        };
        // DOCUMENTS SCREEN SELECTOR - liviu.m@ejump
        vm.get_documents_screen_name = function() {
            var _screen_map = {
                // 'screen_id': 'documents screen name'
                counterparty: "counterpartylist",
                location: "locationlist",
                product: "productlist",
                company: "companylist",
                buyer: "buyerlist",
                service: "servicelist",
                strategy: "strategylist",
                vessel: "vessellist",
                vesseltype: "vesseltypelist",
                marketinstrument: "marketinstrumentlist",
                systeminstrument: "systeminstrumentlist",
                price: "pricelist",
                pricetype: "pricetypelist",
                specgroup: "specgrouplist",
                specparameter: "specparameterlist",
                paymentterm: "paymenttermlist",
                deliveryoption: "deliveryoptionlist",
                incoterms: "incotermlist",
                uom: "uomlist",
                period: "periodlist",
                event: "eventlist",
                calendar: "calendarlist",
                documenttype: "documenttypelist",
                contacttype: "contacttypelist",
                agreementtype: "agreementtypelist",
                additionalcost: "additionalcostlist",
                barge: "bargelist",
                status: "statuslist",
                country: "countrylist",
                currency: "currencylist",
                exchangerate: "exchangeratelist",
                formula: "formulalist",
                claimtype: "claimtypelist",
                users: "userlist", // admin
                role: "rolelist", // admin
                configuration: "configurationlist", // admin
                claim: "claimslist", // claims
                contract: "contractlist" // contracts
            };
            
            var _dns = _screen_map[$state.params.screen_id] ? _screen_map[$state.params.screen_id] : "undefined";
            return _dns;
        };
        // {end} DOCUMENTS SCREEN SELECTOR
        $scope.filterEmailLog = function() {
            var appPath = $state.current.name;
            var transactionTypeId = 0;
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
            //  10, PreRequest
            //  11, NewRfq
            if (appPath.match(/view-request-emaillog/)) transactionTypeId = 1;
            if (appPath.match(/offer/)) transactionTypeId = 2;
            if (appPath.match(/view-order-emaillog/)) transactionTypeId = 3;
            if (appPath.match(/delivery/)) transactionTypeId = 4;
            if (appPath.match(/invoices/)) transactionTypeId = 5;
            if (appPath.match(/labs/)) transactionTypeId = 6;
            if (appPath.match(/claims/)) transactionTypeId = 7;
            if (appPath.match(/masters/)) transactionTypeId = 8;
            if (appPath.match(/contracts/)) transactionTypeId = 15;
            // if (appPath.match(/PreRequest/)) transactionTypeId = 10;
            // if (appPath.match(/NewRfq/)) transactionTypeId = 11;
            var Filter = [
                {
                    ColumnName: "TransactionTypeId",
                    Value: transactionTypeId
                },
                {
                    ColumnName: "TransactionIds",
                    Value: $state.params.entity_id
                }
            ];
            $("#" + Elements.settings[Object.keys(Elements.settings)[0]].table).jqGrid.table_config.on_payload_filter(Filter);
        };
        /*CONTRACT DELIVERY LIST*/
        $scope.initProductDeliveryList = function() {
            filters = [
                {
                    ColumnName: "Id",
                    Value: $state.params.entity_id
                }
            ];
            $("#" + Elements.settings[Object.keys(Elements.settings)[0]].table).jqGrid.table_config.on_payload_filter(filters);
        };
        $scope.newFilterEmailLog = function(type, entity_id) {
            if (type == "request") {
                transactionTypeId = "1,10,11,12,13,21,16";
            }
            if (type == "order") transactionTypeId = 3;
            if (type == "contract") transactionTypeId = 15;
            if (type == "group-request") {
                data = {
                    Payload: entity_id
                };
                Factory_Master.get_group_requests_ids(data, function(callback) {
                    if (callback) {
                        console.log(callback.data);
                        reqIds = [];
                        $.each(callback.data.payload, function(k, v) {
                            reqIds.push(v.id);
                        });
                        reqIds = reqIds.join();
                        filters = [
                            {
                                ColumnName: "TransactionTypeId",
                                Value: "1,10,11,12,13,21"
                            },
                            {
                                ColumnName: "TransactionIds",
                                Value: reqIds
                            }
                        ];
                        $scope.requestIdsFilter = filters;
                        return;
                    }
                });
            } else {
                filters = [
                    {
                        ColumnName: "TransactionTypeId",
                        Value: transactionTypeId
                    },
                    {
                        ColumnName: "TransactionIds",
                        Value: entity_id
                    }
                ];
                return filters;
            }
        };
        vm.openMinMaxModalEdit = function(rowId) {
            $rootScope.$broadcast("openMinMaxModal", rowId);
        };
        vm.CPagreementTypeChange = function(rowId, newData) {
            $scope.CLC = $("#flat_contract_planning");
            $scope.tableData = $scope.CLC.jqGrid.Ascensys.gridObject.rows;
            $scope.currentRowData = $scope.tableData[rowId];
            if (typeof $scope.currentRowData.agreementType == "undefied" || $scope.currentRowData.agreementType == null) {
                $scope.currentRowData.agreementType = {};
            }
            $scope.currentRowData.agreementType.id = newData;
            // $scope.CLC.jqGrid("clearGridData");
            // $.each($scope.tableData, function(k,v){
            //  $scope.CLC.jqGrid("addRowData", k, v);
            // });
            // $compile($(".contractPlanningContractTypeahead"))($scope);
        };
        vm.CPcommentChange = function(rowId, newData) {
            $scope.CLC = $("#flat_contract_planning");
            $scope.tableData = $scope.CLC.jqGrid.Ascensys.gridObject.rows;
            $scope.currentRowData = $scope.tableData[rowId];
            $scope.currentRowData.comment = newData;
            // $scope.CLC.jqGrid("clearGridData");
            // $.each($scope.tableData, function(k,v){
            //  $scope.CLC.jqGrid("addRowData", k, v);
            // });
            // $compile($(".contractPlanningContractTypeahead"))($scope);
        };

        $rootScope.$on("contractPlanningDataChanged", function() {
            vm.hasChanged = true;
            // $compile($(".contractPlanningContractTypeahead"))($scope);
        });
        vm.getContractTypeaheadListCP = function(rowId) {
            $(".contractPlanningContractTypeahead")
                .parent("td")
                .css("overflow", "visible");
            if (typeof vm.contractPlanningContractTypeaheadOptions == "undefined") {
                return false;
            }
            return vm.contractPlanningContractTypeaheadOptions["r" + parseFloat(rowId - 1)];
        };

        $scope.updateMinMaxQuantities = function(rowIdx, productId){
            
            ctrl.CLC = $('#flat_contract_planning');
            ctrl.tableData = ctrl.CLC.jqGrid.Ascensys.gridObject.rows
            ctrl.currentRowData = ctrl.tableData[rowIdx-1]

            payload = {'Payload' : {
                    'vesselId': ctrl.currentRowData.vessel ? ctrl.currentRowData.vessel.id : null,
                    'locationId': ctrl.currentRowData.bunkeringLocation ? ctrl.currentRowData.bunkeringLocation.id : null,
                    'productId': productId ? productId : null,
                    'serviceId': ctrl.currentRowData.service ? ctrl.currentRowData.service.id : null,
                    'sellerId': /*ctrl.currentRowData.seller ? ctrl.currentRowData.seller.id :*/ null,              
                }   
            }

            Factory_Master.contractPlanningGetQuantityAverage(payload, function(response) {
                if (response) {
                    maxEdit = response.data.payload.avgMaxOrderedQuantity
                    minEdit = response.data.payload.avgMinOrderedQuantity
                    ctrl.currentRowIndex = rowIdx;
                    ctrl.currentRowData.minQuantity = minEdit;
                    ctrl.currentRowData.maxQuantity = maxEdit;
                    ctrl.tableData[ctrl.currentRowIndex-1] = ctrl.currentRowData;
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "maxQuantity", maxEdit)
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "minQuantity", minEdit)
                    $(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"] span.values").text($filter("number")(minEdit, $scope.tenantSettings.defaultValues.quantityPrecision) +" - "+ $filter("number")(maxEdit, $scope.tenantSettings.defaultValues.quantityPrecision))
                    $compile($(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"]"))($scope)
                } else {
                    maxEdit = 0;
                    minEdit = 0;
                    ctrl.currentRowIndex = rowIdx;
                    ctrl.currentRowData.minQuantity = minEdit;
                    ctrl.currentRowData.maxQuantity = maxEdit;
                    ctrl.tableData[ctrl.currentRowIndex-1] = ctrl.currentRowData;
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "maxQuantity", maxEdit)
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "minQuantity", minEdit)
                    $(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"] span.values").text($filter("number")(minEdit, $scope.tenantSettings.defaultValues.quantityPrecision) +" - "+ $filter("number")(maxEdit, $scope.tenantSettings.defaultValues.quantityPrecision))
                    $compile($(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"]"))($scope)                  
                }
            })

        }

        vm.changeCPRowModel = function(value, rowIdx, columnKey, isOnInit) {
            if (typeof $rootScope.editableCProwsModel == "undefined") {
                $rootScope.editableCProwsModel = {};
            }
            if (rowIdx) {
                keyRow = "row-" + rowIdx;
                if (typeof $rootScope.editableCProwsModel[keyRow] == "undefined") {
                    $rootScope.editableCProwsModel[keyRow] = {};
                }
                $rootScope.editableCProwsModel[keyRow][columnKey] = value;
                if (columnKey == 'product') {
                    $('#flat_contract_planning').jqGrid("setCell", rowIdx, "product", value);
                    if ($('#contract_planning_product_select_' + rowIdx).hasClass("select2-hidden-accessible")) {
                        $('#contract_planning_product_select_' + rowIdx).select2("destroy");
                        $('#contract_planning_product_select_' + rowIdx).val(value.id);
                        $('#contract_planning_product_select_' + rowIdx).select2();                 
                    }
                    // vm.product[rowIdx] = value;
                    // $('#contract_planning_product_select_' + rowIdx).val(value.id).trigger('change');
                    setTimeout(function(){
                        vm.setContractFiltersContractPlanning(rowIdx)
                    },500)

                    if (!isOnInit) {
                        if (vm.cpCtr) {
                            if (vm.cpCtr[rowIdx]) {
                                $rootScope.editableCProwsModel[keyRow]['contract'] = null;
                                CLC.jqGrid.Ascensys.gridData[rowIdx - 1].contract = null;
                                vm.cpCtr[rowIdx] = null;
                                $('#flat_contract_planning').jqGrid("setCell", rowIdx, "contract", null);
                                // vm.getContractTypeaheadListCP(rowIdx);
                                    $("#contract-planning-contract-link-"+rowIdx + ' a').remove();
                                }
                            $('[ng-model="CLC.cpCtr['+rowIdx+']"]').addClass("ng-dirty")                                
                            vm.clearContractLinkCP(rowIdx);    
                        }
                        angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)          
                    }
                    if (!isOnInit) {
                        setTimeout(function(){
                            $scope.updateMinMaxQuantities(rowIdx, value.id)
                        })
                    }
                } else {
                    if (!isOnInit) {
                        angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)          
                    }	
                }
            }
            if (columnKey == "contract") {
                if (!isOnInit) {
                    $rootScope.editableCProwsModel[keyRow][columnKey] = value;
                    $rootScope.editableCProwsModel[keyRow]['contractChanged'] = true;
                    $('#flat_contract_planning').jqGrid("setCell", rowIdx, "contract", value);
                    if (!$scope.contractWasSelectedFromModal) {
                        var contractData = {
                            "contract": {
                                "name": value.fullValue.contractName,
                                "id": value.fullValue.id1,
                            },
                            "seller": value.fullValue.seller,
                            "formulaDescription": value.fullValue.formula,
                            "deliveryPrice": value.fullValue.fixedPrice,
                            "premiumDiscount": value.fullValue.premiumDiscount,
                            "noOfDaysBeforeExpiry": value.fullValue.noOfDaysBeforeExpiry,
                            "minQuantity": value.fullValue.minQuantity,
                            "contractProductId": value.fullValue.contractProductId,
                            "maxQuantity": value.fullValue.maxQuantity
                        }; 
                        value.fullValue = angular.copy(contractData);               
                    }
                    $rootScope.editableCProwsModel[keyRow]['contractProductId'] = value.fullValue.contractProductId;
                    $scope.contractWasSelectedFromModal = false;
                    if (value) {
                        vm.selectContract(value.fullValue, rowIdx);
                        angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)          
                    } else {
                        vm.selectContract(null, rowIdx);
                        angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)          
                    }
                    // $rootScope.editableCProwsModel[keyRow][columnKey] = value;
                    $('tr#' + rowIdx + '>td:nth-child(14)').prop('title', value.id);
                } else {
                    // $("#flat_contract_planning").jqGrid("setCell", rowIdx, columnKey, value);
                    console.log($("#invoices_treasuryreport").jqGrid.Ascensys.gridObject.rows[rowIdx-1]);
                }
            } else {
            }
            $.each($scope.selectedContractPlanningRows, function(k,v){
                if (v.rowIndex == rowIdx) {
                    v[columnKey] = value
                }
            })
            // console.log($scope.selectedContractPlanningRows);
            // console.log($rootScope.editableCProwsModel);
        };


        $rootScope.$on("gridDataDone", function(data,res){
            $scope.selectedContractPlanningRows = [];
            // selectContracts = []
            $scope.selectContracts = []
            $('#jqgh_flat_contract_planning_actions-0').html('<i id="selectAllContractPlanning"' +
                ' style="font-size: 25px !important; color: #d9d9d9;"' +
                ' class="fa fa-square-o" ng-click="selectAllContractPlanning()"  ng-mouseover="evaluateChangedContracts()"></i>');
            $('#jqgh_flat_contract_planning_actions-0').css('display', 'inherit');
        });

        $scope.evaluateChangedContracts = function() {
            if (vm.contractIsEditing) {
                vm.clearContractLinkCP(vm.contractIsEditing);
                vm.contractIsEditing = null
                return; 
            }
        }

        $scope.selectAllContractPlanning = function() {
            // $('[ng-model*="CLC.cpCtr"]').blur()
                var el = $('#selectAllContractPlanning').first();
                if (el.hasClass('fa-square-o')) {
                    theCLC = $("#flat_contract_planning");
                    for (var i = 0; i < theCLC.jqGrid.Ascensys.gridObject.rows.length; i++) {
                        if (!$scope.selectContracts[i + 1] && vm.cpCtr[i + 1]) {
                            $scope.selectContracts[i + 1] = true;
                            $scope.selectContractPlanningRow(i + 1, i + 1);
                        }
                    }
                } else if (el.hasClass('fa-check-square-o')) {
                    for (var i = 0; i < theCLC.jqGrid.Ascensys.gridObject.rows.length; i++) {
                        if ($scope.selectContracts[i + 1]) {
                            $scope.selectContracts[i + 1] = false;
                            $scope.selectContractPlanningRow(i + 1, i + 1);
                        }
                    }
                }
                $.each($scope.selectedContractPlanningRows, function(ksc, vsc) {
                    if (typeof $rootScope.editableCProwsModel != "undefined") {
                        Object.keys($rootScope.editableCProwsModel).map(function(objectKey, index) {
                            var value = $rootScope.editableCProwsModel[objectKey];
                            if ("row-" + vsc.rowIndex == objectKey) {
                                if (value.contractChanged) {
                                    vsc.contract = value.contract;
                                } else {
                                    vsc.contract = CLC.jqGrid.Ascensys.gridData[ parseFloat(objectKey.split("row-")[1]) - 1 ].contract;
                                }
                            }
                        });
                    }
                });  

                rowsWithContract = 0;
                $.each(CLC.jqGrid.Ascensys.gridData, function(gdk, gdv){
                    if (gdv.contract) {
                        rowsWithContract += 1;
                    }
                })

                if ($scope.selectedContractPlanningRows.length < rowsWithContract || rowsWithContract == 0) {
                    var el = $('#selectAllContractPlanning').first();
                    if (el.hasClass('fa-check-square-o')) {
                        el.removeClass('fa-check-square-o');
                        el.addClass('fa-square-o');
                    }
                } else if ($scope.selectedContractPlanningRows.length === rowsWithContract) {
                    var el = $('#selectAllContractPlanning').first();
                    if (el.hasClass('fa-square-o')) {
                        el.removeClass('fa-square-o');
                        el.addClass('fa-check-square-o');
                    }
                }            
        }

        $rootScope.$on("selectedContractFromModal", function(data,res){
            obj = {
                "id" : res.contract.id,
                "name" : res.contract.name,
                "fullValue" : res,
            }
            $scope.contractWasSelectedFromModal = true;
            vm.changeCPRowModel(obj, $scope.openContractModalRowIdx, 'contract');
        });

        $rootScope.$on("selectedProductFromModal", function(data,res){
            obj = {
                "id" : res.product.id,
                "name" : res.product.name,
                "fullValue" : res,
            }
            $scope.productWasSelectedFromModal = true;
            vm.changeCPRowModel(obj, $scope.openProductModalRowIdx, 'product');
        });

        vm.selectContract = function(contract, rowId, columnKey) {
            // if () {}
            // if (!vm.hasChanged) {rowId -= 1 }
            // vm.hasChanged = true;
            // tableData = CLC.jqGrid.Ascensys.gridObject.rows
            if (contract) {
                contractObj = {
                    "id" : contract.contract.id,
                    "name" : contract.contract.name
                }
              vm.cpCtr[rowId] = contractObj;
                $("#flat_contract_planning").jqGrid("setCell", rowId, "contract", contractObj);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "seller.name", contract.seller.name);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "contractProductId", contract.contractProductId);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "formulaDescription", contract.formulaDescription);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "deliveryPrice", contract.deliveryPrice);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "premiumDiscount", contract.premiumDiscount);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "noOfDaysBeforeExpiry", contract.noOfDaysBeforeExpiry);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "contractMinQuantity", contract.contractMinQuantity);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "contractMaxQuantity", contract.contractMaxQuantity);

                $('#contract-planning-contract-link-' + rowId).html('<a target="_blank" href="#/contracts/contract/edit/' +
                  contractObj.id + '"> <span class="formatter edit_link edit_link_contract_id" data-formatter-type="link"> <i style="float: none;" class="fa fa-edit"></i>' +
                  contractObj.id + '</span></a>');
            } else {
                $("#flat_contract_planning").jqGrid("setCell", rowId, "contract", null);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "seller.name", null);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "contractProductId", null);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "formulaDescription", null);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "deliveryPrice", null);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "premiumDiscount", null);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "noOfDaysBeforeExpiry", null);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "contractMinQuantity", null);
                $("#flat_contract_planning").jqGrid("setCell", rowId, "contractMaxQuantity", null);
            }

            // currentRowData = tableData[rowId];
            //    currentRowData.contract = contract.contract;
            //    currentRowData.seller = contract.seller;
            //    currentRowData.formulaDescription = contract.formulaDescription;
            //    currentRowData.deliveryPrice = contract.deliveryPrice;
            //    currentRowData.premiumDiscount = contract.premiumDiscount;
            //    currentRowData.noOfDaysBeforeExpiry = contract.noOfDaysBeforeExpiry;
            //    currentRowData.contractMinQuantity = contract.minQuantity;
            //    currentRowData.contractMaxQuantity = contract.maxQuantity;

            // $('#flat_contract_planning').jqGrid("setCell", rowId, "contract", contract);

            // CLC.jqGrid("clearGridData");
            // $.each(tableData, function(k,v){
            //  CLC.jqGrid("addRowData", k, v);
            // });
            // $scope.$apply();
            // $compile($(".contractPlanningContractTypeahead"))($scope)
        };

        vm.getInitialContractValue = function(rowId) {
            if (!vm.hasChanged) {
                rowId -= 1;
            }
            if (typeof $rootScope.editableCProwsModel == "undefined") {
                $rootScope.editableCProwsModel = {};
            }
            keyRow = "row-" + parseFloat(rowId);
            CLC = $("#flat_contract_planning");
            rowData = CLC.jqGrid.Ascensys.gridObject.rows[rowId];
            if (rowData.contract) {
                if (!$rootScope.editableCProwsModel[keyRow]) {
                    $rootScope.editableCProwsModel[keyRow] = {}
                }
                $rootScope.editableCProwsModel[keyRow]['contract'] = rowData.contract;
                vm.changeCPRowModel(rowData.contract, rowId, 'contract')
                return rowData.contract;
            }
            return;
        };

        vm.clearContractLinkCP = function(rowId){
            setTimeout(function(){
                if ($('[ng-model="CLC.cpCtr['+rowId+']"]').hasClass("ng-dirty")) {
                    if (vm.cpCtr[rowId]) {
                        if (!vm.cpCtr[rowId].name) {
                            vm.cpCtr[rowId] = null;
                            if (typeof($("#flat_contract_planning").jqGrid.Ascensys.gridObject.rows[rowId]) != 'undefined') {
                                $("#flat_contract_planning").jqGrid.Ascensys.gridObject.rows[rowId].contract = null;
                                CLC.jqGrid.Ascensys.gridData[rowId - 1].contract = null;
                            }
                            $("#contract-planning-contract-link-"+rowId + ' a').remove();
                            $('[ng-model="CLC.cpCtr['+rowId+']"]').val(null);
                            if ($scope.selectContracts[rowId]) {
                                $scope.selectContracts[rowId] = false;
                                CLC.jqGrid.Ascensys.gridData[rowId - 1].contract = null;
                                setTimeout(function(){
                                    // $scope.selectContractPlanningRow(rowId, rowId);
                                    $.each($scope.selectedContractPlanningRows, function(k, v) {
                                        if (v) {
                                            if (v.rowIndex == rowId) {
                                                $scope.selectedContractPlanningRows.splice(k, 1);
                                            }
                                        }
                                    }); 
                                    if ($rootScope.editableCProwsModel['row-' + parseFloat(rowId) ].contractChanged) {
                                        $rootScope.editableCProwsModel['row-' + parseFloat(rowId) ].contract = null
                                    }
                                    $('#' + rowId + '.jqgrow').first().css({'background-color': '#ffffff'});
                                })
                            }
                            $scope.$apply();
                        }
                    } else {

                            vm.cpCtr[rowId] = null;
                            if (typeof($("#flat_contract_planning").jqGrid.Ascensys.gridObject.rows[rowId]) != 'undefined') {
                                $("#flat_contract_planning").jqGrid.Ascensys.gridObject.rows[rowId].contract = null;
                                CLC.jqGrid.Ascensys.gridData[rowId - 1].contract = null;
                            }
                            $("#contract-planning-contract-link-"+rowId + ' a').remove();
                            $('[ng-model="CLC.cpCtr['+rowId+']"]').val(null);
                            if ($scope.selectContracts[rowId]) {
                                $scope.selectContracts[rowId] = false;
                                CLC.jqGrid.Ascensys.gridData[rowId - 1].contract = null;
                                setTimeout(function(){
                                    // $scope.selectContractPlanningRow(rowId, rowId);
                                    $.each($scope.selectedContractPlanningRows, function(k, v) {
                                        if (v) {
                                            if (v.rowIndex == rowId) {
                                                $scope.selectedContractPlanningRows.splice(k, 1);
                                            }
                                        }
                                    }); 
                                    if ($rootScope.editableCProwsModel['row-' + parseFloat(rowId) ].contractChanged) {
                                        $rootScope.editableCProwsModel['row-' + parseFloat(rowId) ].contract = null
                                    }
                                    $('#' + rowId + '.jqgrow').first().css({'background-color': '#ffffff'});
                                })
                            }
                            $scope.$apply();                        
      //                   CLC.jqGrid.Ascensys.gridData[rowId - 1].contract = null;
                        // vm.cpCtr[rowId] = null;
                        // if (typeof($("#flat_contract_planning").jqGrid.Ascensys.gridObject.rows[rowId]) != 'undefined') {
                        //  $("#flat_contract_planning").jqGrid.Ascensys.gridObject.rows[rowId].contract = null;
                        // }
                        // $("#contract-planning-contract-link-"+rowId + ' a').remove();
      //                   $('[ng-model="CLC.cpCtr['+rowId+']"]').val(null);
                        // vm.selectContract(null, rowId);              
                    }
                    if (vm.cpCtr[rowId]) {
                        vm.clearContractLinkCP(rowId)
                    }
                }
            },10)
        }

        vm.setContractFiltersContractPlanning = function(rowId) {
            // console.log(rowId);
            // return;
            initialRowId = angular.copy(rowId);
            if (!vm.hasChanged) {
                rowId -= 1;
            }
            CLC = $("#flat_contract_planning");
            request = CLC.jqGrid.Ascensys.gridObject.rows[rowId];
            request.product = $rootScope.editableCProwsModel['row-'+ parseFloat(parseFloat(rowId)+1)]['product'];
            console.log(request);
            var newFilters = [];
            if (request.bunkeringLocation) {
                newFilters.push({
                    ColumnName: "LocationId",
                    Value: request.bunkeringLocation.id
                });
            }
            if ($rootScope.editableCProwsModel['row-'+ parseFloat(parseFloat(rowId)+1)]['product']) {
                newFilters.push({
                    ColumnName: "ProductId",
                    Value: $rootScope.editableCProwsModel['row-'+ parseFloat(parseFloat(rowId)+1)]['product'].id
                });
            }
            newFilters.push({
                ColumnName: "SellerId",
                Value: 0
            });
            newFilters.push({
                ColumnName: "RequestId",
                Value: request.requestId
            });
            if (typeof vm.contractPlanningContractTypeaheadOptions == "undefined") {
                vm.contractPlanningContractTypeaheadOptions = [];
            }
            console.log($rootScope.editableCProwsModel);
            selectContractModel.getSuggestedContracts(null, null, newFilters).then(function(server_data) {
                response = [];
                $.each(server_data.payload, function(k, v) {
                    obj = {
                        id: v.id1,
                        name: v.contractName,
                        fullValue: v
                    };
                    response.push(obj);
                });
                vm.contractPlanningContractTypeaheadOptions["r" + rowId] = response;
                // console.log(vm.contractPlanningContractTypeaheadOptions['r'+initialRowId]);
            });
            //         newRequestModel.search(newFilters).then(function(data) {
            //          response = []
            //          $.each(data.payload, function(k,v){
            //              response.push(v.contract)
            //          })
            //          vm.contractPlanningContractTypeaheadOptions['r'+initialRowId] = data.payload;
            // console.log(vm.contractPlanningContractTypeaheadOptions['r'+initialRowId]);
            //         });
        };

        $scope.selectContractPlanningRow = function(rowIdx, value) {
            CLC = $("#flat_contract_planning");
            request = CLC.jqGrid.Ascensys.gridObject.rows[rowIdx - 1];
            request.rowIndex = rowIdx;
            if (typeof $scope.selectedContractPlanningRows == "undefined") {
                $scope.selectedContractPlanningRows = [];
            }
            rowIsAlreadySelected = false;
            $.each($scope.selectedContractPlanningRows, function(k, v) {
                if (v.rowIndex == rowIdx) {
                    rowIsAlreadySelected = true;
                    indexInCollection = k;
                }
            });
            if (!rowIsAlreadySelected) {
                $scope.selectedContractPlanningRows.push(request);
                $('#' + rowIdx + '.jqgrow').first().css({'background-color': 'rgba(0, 0, 255, 0.1)'});
            } else {
                $scope.selectedContractPlanningRows.splice(indexInCollection, 1);
                $('#' + rowIdx + '.jqgrow').first().css({'background-color': '#ffffff'});
            }
            $.each($scope.selectedContractPlanningRows, function(ksc, vsc) {
                if (typeof $rootScope.editableCProwsModel != "undefined") {
                    Object.keys($rootScope.editableCProwsModel).map(function(objectKey, index) {
                        var value = $rootScope.editableCProwsModel[objectKey];
                        if ("row-" + vsc.rowIndex == objectKey) {
                            if (value.contractChanged) {
                                vsc.contract = value.contract;
                            } else {
                                vsc.contract = CLC.jqGrid.Ascensys.gridData[ parseFloat(objectKey.split("row-")[1]) - 1 ].contract;
                            }
                            // vsc.contract = CLC.jqGrid.Ascensys.gridData[ parseFloat(objectKey.split("row-")[1]) - 1 ].contract;
                            vsc.comment = value.comment ? value.comment : null;
                            vsc.agreementType = value.agreementType;
                            vsc.product = value.product;
                            if (typeof(value.contractProductId) != 'undefined') {
	                            vsc.contractProductId = value.contractProductId;
                            }
                            // if (value.agreementType != null) {
                            //     vsc.agreementType = {};
                            //     vsc.agreementType.id = value.agreementType;
                            // }
                        }
                    });
                }
            });
            console.log($scope.selectedContractPlanningRows);
            $rootScope.$broadcast("contractPlanningSelectedRows", $scope.selectedContractPlanningRows);


            var rowsWithContract = 0;
            if (CLC.jqGrid.Ascensys.gridObject.page == 1) {
                $.each(CLC.jqGrid.Ascensys.gridData, function(k, v) {
                    rowsWithContract += !!v.contract;
                });
            } else {
                $.each(CLC.jqGrid.Ascensys.gridObject.rows, function(k,v) {
                    if (v.contract) {
                        rowsWithContract += 1;
                    }   
                })
            }

            if ($scope.selectedContractPlanningRows.length < rowsWithContract || rowsWithContract == 0) {
                var el = $('#selectAllContractPlanning').first();
                if (el.hasClass('fa-check-square-o')) {
                    el.removeClass('fa-check-square-o');
                    el.addClass('fa-square-o');
                }
            } else if ($scope.selectedContractPlanningRows.length === rowsWithContract) {
                var el = $('#selectAllContractPlanning').first();
                if (el.hasClass('fa-square-o')) {
                    el.removeClass('fa-square-o');
                    el.addClass('fa-check-square-o');
                }
            }
        };
        $scope.openContractPopupInCP = function(rowIdx) {
            CLC = $("#flat_contract_planning");
            request = CLC.jqGrid.Ascensys.gridObject.rows[rowIdx - 1];
            $scope.openContractModalRowIdx = rowIdx;
            $rootScope.$broadcast("contractModalData", request)
        }
        $scope.openProductPopupInCP = function (rowIdx) {
            CLC = $("#flat_contract_planning");
            request = CLC.jqGrid.Ascensys.gridObject.rows[rowIdx - 1];
            $scope.openProductModalRowIdx = rowIdx;
            $rootScope.$broadcast("contractProductData", request)
        }
        jQuery(document).ready(function() {
            $(document).on("change", ".contract_planning_agreementtype", function() {
                rowId = $(this).attr("rowId");
                newData = $(this).val();
                if (!vm.hasChanged) {
                    rowId -= 1;
                }
                // vm.CPagreementTypeChange(rowId, newData)
                // vm.hasChanged = true;
                // $rootScope.$broadcast('contractPlanningDataChanged', rowId);
                // $compile($(".contractPlanningContractTypeahead"))($scope)
            });
            $(document).on("blur", ".contract_planning_comments", function() {
                rowId = $(this).attr("rowId");
                newData = $(this).val();
                if (!vm.hasChanged) {
                    rowId -= 1;
                }
                // vm.CPcommentChange(rowId, newData)
                // vm.hasChanged = true;
                // $rootScope.$broadcast('contractPlanningDataChanged', rowId);
                // $compile($(".contractPlanningContractTypeahead"))($scope)
            });
            // $(document).on("click",".contract_planning_min_max_qty", function(){
            //  rowId = $(this).attr("rowId");
            //  $rootScope.$broadcast('openMinMaxModal', rowId);
            // })
        });

        // initMask %%%
        vm.initMask = function(timeout){
            console.log("initMask", timeout);
        }
        // setValue %%%
        vm.setValue = function(inputDetails, direction, simpleDate){

            /**
             *  @param inputDetails - input path and root
             *  check setValue function in Controller_Master for detalied parameters
             */
            var DATE_FORMAT = $scope.tenantSettings.tenantFormats.dateFormat;

            var rootMap = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'CLC': vm
            }

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

        // init datepickers %%%
        vm.initDatepickers = function (){
            setTimeout(function() {
                $(".date-picker").datepicker({
                    autoclose: true,
                    pickerPosition: "bottom-left"
                });
            }, 100);
        }
        

    }
]);
APP_GENERAL_COMPONENTS.controller("Controller_General_Header", [
    "$rootScope",
    "$scope",
    "$controller",
    "$Api_Service",
    "Factory_General_Components",
    "Factory_Master",
    "$state",
    "$location",
    "$compile",
    "uiApiModel",
    "$filter",
    "$filtersData",
    function($rootScope, $scope, $controller, $Api_Service, Factory_General_Components, Factory_Master, $state, $location, $compile, uiApiModel, $filter, $filtersData) {
        var vm = this;
        // params
        $controller("Controller_Master", {
            $scope: $scope
        });
        $rootScope.$on("formValues", function(event, payload) {
            if (payload) {
                $scope.formValues = payload;
            }
        });
        setTimeout(function() {
            console.log("$rootScope", $rootScope.formValues);
            console.log("$scope", $scope.formValues);
        }, 3000);
        vm.app_id = $state.params.path[0].uisref.split(".")[0];
        vm.section_id = $state.params.section_id;
        if (!$state.params.screen_id) {
            vm.screen_id = $("clc-table-list").data("screen");
        } else {
            vm.screen_id = $state.params.screen_id;
        }
        vm.entity_id = $state.params.entity_id;
        $scope.entity_id = $state.params.entity_id;
        vm.general_header_config = "";
        $scope.allSections = [];
        $scope.getAdminConfigurationGH = function(data) {
            vm.adminConfiguration = data;
        };
        // $scope.showHideSectionsEvt = function(evt){
        //     console.log($evt);
        // }
        // $('select#multiple li').on('click',function(evt){
        //     console.log($evt);
        // })
        $scope.showHideSections = function(obj) {
            // console.log(obj);
            // $scope.visible_sections_old = $scope.visible_sections;
            if (obj.length > 0) {
                $scope.visible_sections_old = $scope.visible_sections;
                $rootScope.$broadcast("visible_sections", $scope.visible_sections);
            } else {
                if (typeof $scope.visible_sections_old != "undefined") {
                    $scope.$broadcast("lastValueDeselected", {
                        value: $scope.visible_sections_old[0]
                    });
                }
            }
        };
        $scope.$on("formFields", function(event, payload) {
            if (payload) {
                $scope.formFieldsNew = payload;
                vm.moreInformations = true;
                if (vm.screen_id == "treasuryreport" || (vm.screen_id == "configuration" && vm.app_id == "admin")) {
                    vm.moreInformations = false;
                    vm.hideMoreInformations = true;
                }
            }
        });
        $scope.$on("generalAction", function(event, payload) {
            if (payload) {
                vm.general_action.apply(this, payload);
            }
        });
        // General Action (top bar)
        // type = goto | custom
        $scope.general_action = function(type, url, method, absolute, new_tab) {
            vm.general_action(type, url, method, absolute, new_tab);
        };
        vm.general_action = function(type, url, method, absolute, new_tab) {
            if (method == "sellerRatingScreen()") {
                $scope.sellerRatingScreen();
            }
            switch (type) {
                case "goto":
                    if ($state.$current.url.prefix.indexOf("edit") > 0) {
                        $state.$current.url.prefix = $state.$current.url.prefix.replace("edit/", "");
                    }
                    if (url !== "") {
                        var url = !absolute ? $state.$current.url.prefix + $state.params.screen_id + "/" + url : $state.$current.url.prefix + url;
                    } else {
                        // var url = $state.$current.url.prefix + $state.params.screen_id;
                        $state.reload();
                    }
                    // inject entity_id
                    if ($state.params.entity_id) {
                        url = JSON.stringify(url);
                        url = url.replace(/:entity_id/g, $state.params.entity_id);
                        url = JSON.parse(url);
                    }
                    if (new_tab === true) {
                        
                        window.open($location.$$absUrl.replace($location.$$path, url), '_blank');
                        $state.reload();
    
                    } else {
                        console.log(url);
                        $location.path(url);
                    }
                    break;
                case "custom":
                    switch (method) {
                        case "new_entity":
                            Factory_General_Components.entity_new(function(callback) {
                                if (callback) {
                                    var url = $state.$current.url.prefix + $state.params.screen_id + "/edit/0";
                                    $location.path(url);
                                } else {
                                    toastr.error("Error occured");
                                }
                            });
                            break;
                        case "copy_entity":
                            Factory_General_Components.entity_copy(function(callback) {
                                if (callback) {
                                    var url = $state.$current.url.prefix + $state.params.screen_id + "/edit/0";
                                    $location.path(url);
                                } else {
                                    toastr.error("Error occured");
                                }
                            });
                            break;
                        case "entity_save_changes":
                            Factory_General_Components.entity_save(function(callback) {
                                toastr.error("Error occured");
                            });
                            break;
                        case "entity_discard_changes":
                            Factory_General_Components.entity_discard(function(callback) {
                                toastr.error("Error occured");
                            });
                            break;
                        case "structure_save_changes":
                            Factory_General_Components.structure_save(function(callback) {
                                toastr.error("Error occured");
                            });
                            break;
                        case "structure_discard_changes":
                            Factory_General_Components.structure_discard(function(callback) {
                                toastr.error("Error occured");
                            });
                            break;
                    }
                    //eval('Factory_General_Components.' + ajax_method + '(function(callback){if(callback) {$location.path($state.$current.url.prefix + $state.params.screen_id);}})');
                    break;
            }
        };
        //Export icons
        //filters need to be sent on export too, listen for event to export
        $rootScope.$on("filters-applied", function(e, a) {
            vm.tablesExportFilters = a;
        });
        vm.prepareTableForPrint = function(tableWidth) {
            var beforePrint = function(tableWidth) {
                if ($("clc-table-list")) {
                    //1017px = default page landscape width
                    // var tableWidth = $('clc-table-list').width();
                    // console.log('clc-table-list',tableWidth);
                    var percentWidth = 101700 / tableWidth;
                    console.log("proc", percentWidth);
                    if (percentWidth < 100) {
                        //resize only when print is smaller
                        zoomP = 100 - parseFloat(percentWidth).toFixed(2) + "%";
                        $("div.inside_content ui-view").css("zoom", zoomP);
                    }
                }
            };
            var afterPrint = function() {
                $("div.inside_content ui-view").css("zoom", "100%");
            };
            if ("matchMedia" in window) {
                window.matchMedia("print").addListener(function(media) {
                    //matches is true before print and false after
                    if (media.matches) {
                        beforePrint(tableWidth);
                    } else {
                        afterPrint();
                    }
                });
            } else {
                window.onbeforeprint = function() {
                    beforePrint();
                };
                window.onafterprint = function() {
                    afterPrint();
                };
            }
        };
        $scope.$on("tableLayoutLoaded", function(e, payload) {
            $scope.tableData = payload;
        });

        $scope.deleteSelectedConfiguration = function(){
            selectedConfiguration = $("#configurations_list").val();
            if (selectedConfiguration) {
                filtersScope = angular.element($("#filters-widget-scope")).scope();
                filtersScope.deleteConfig({id:selectedConfiguration});
                return;
            } else {
                toastr.error("Please select configuration to be deleted");
                return;
            }
        }


        $scope.$watch("selectedConfig", function(){
        	enableDisableDeleteLayout()
        })
        $(document).on("change", "#configurations_list", function() {
        	enableDisableDeleteLayout()
        })
        enableDisableDeleteLayout = function(){
        	if ($("#configurations_list").val()) {
        		if ($("#configurations_list").val() != "0") {
        			$(".st-content-action-icons .delete_layout").css("opacity", 1)
        			$(".st-content-action-icons .delete_layout").css("pointer-events", "none");
        		} else {
        			$(".st-content-action-icons .delete_layout").css("opacity", 0.3)
        			$(".st-content-action-icons .delete_layout").css("pointer-events", "none");
        		}
        	} else {
        			$(".st-content-action-icons .delete_layout").css("opacity", 0.3)
        			$(".st-content-action-icons .delete_layout").css("pointer-events", "none");
        	}
        }

        vm.export = function(icon, params) {
     
            var table_id = id;
            id = icon.id ? "/" + icon.id : "";
            $scope.currentList = window.location.hash.replace(/[0-9,\/,#/]/g, "") + id;
            if (icon.action == "print") {
                //get table width here, it gets altered later
                var tableWidth = $("clc-table-list").width();
                vm.prepareTableForPrint(tableWidth);
                window.print();
                return;
            }
            if (icon.action == "delete_layout") {
            	if ($("#configurations_list").val() == "0" || !$("#configurations_list").val() || $("#configurations_list").val() == 0) {
	                toastr.error("Please select configuration to be deleted");
            		return
            	}
            	sweetConfirmScope = angular.element($("clc-table-list div")).scope();
            	$scope.confirmModalData = {};
            	$scope.confirmModalData.text = "Do you want to delete the configuration?";
                sweetConfirmScope.showSweetConfirm("Controller_General_Header", "Do you want to delete the configuration?", "deleteSelectedConfiguration(false)");
                return;
            }
            if (icon.action == "save_layout") {
              if((!$scope.selectedConfig || ($scope.selectedConfig && !$scope.selectedConfig.name)) &&
                  $('#configuration_name').length > 0 && !$('#configuration_name').first().val()) {
                    toastr.error("Please enter a configuration name!");
                    return;
              }
                //get table width here, it gets altered later
                newColModel = Object.values(Elements.table)[0].jqGrid("getGridParam", "colModel");
                payload = [];
                $.each(newColModel, function(k, v) {
                    if (!v.exclude && v.label) {
                        v.formatter = null;
                        $.each($scope.tableData.clc.colModel, function(sk, sv) {
                            if (v.name == sv.name) {
                                v.formatter = sv.formatter;
                            }
                        });
                        payload.push(v);
                    }
                });
                $scope.tableData.clc.colModel = [];
                $scope.tableData.clc.colModel = payload;

                uiApiModel.saveListLayout($scope.currentList, $scope.tableData).then(function(data) {
                    if (data.isSuccess) {
                        $rootScope.$broadcast("savedLayout");
                        toastr.success("Layout successfully saved");
                    }
                });
                return;
            }
            if (params) {
                app = params.app;
                screen = params.screen;
            } else {
                app = vm.app_id;
                screen = vm.screen_id;
            }
            var json = {
                app: app,
                screen: screen,
                action: icon.action,
                colModel: Object.values(Elements.table)[0].jqGrid("getGridParam", "colModel"),
                search: vm.general_search_terms,
                pageFilters: vm.tablesExportFilters,
                table_id: table_id
            };
            if ($scope.currentList == "masters/emaillogs") {
                if ($rootScope.masterEmailLogsFilters != "undefined") {
                    json.filters = $rootScope.masterEmailLogsFilters;
                }
            }
            if ($scope.currentList == "invoicesinvoice") {
                console.log('colModel: ', json.colModel);
                console.log('filtersData: ', $filtersData);
                var order_list_columns = [];
                for(var i = 0; i < $filtersData.filterColumns.length; i++) {
                    if($filtersData.filterColumns[i].columnRoute !== 'invoices/invoice') {
                        order_list_columns.push($filtersData.filterColumns[i]);
                    }
                }

                for(var i = 0; i < json.colModel.length; i++) {
                    for(var j = 0; j < order_list_columns.length; j++) {
                        if(json.colModel[i].name.toLowerCase().replace('.', '_') === order_list_columns[j].columnValue.toLowerCase()) {
                            json.colModel[i].columnType = order_list_columns[j].columnType;
                            continue;
                        }
                    }
                }
            }

            if($scope.currentList == "invoicesdeliveries" || $scope.currentList == "invoicesclaims"
                || $scope.currentList == 'invoicestreasuryreport' || $scope.currentList == 'invoicescomplete_view'){
                var column_route =  "";
                if($scope.currentList == "invoicesdeliveries") column_route = 'invoices/deliveries';
                if($scope.currentList == "invoicesclaims") column_route = 'invoices/claims';
                if($scope.currentList == "invoicestreasuryreport") column_route = 'invoices/treasuryreport';
                if($scope.currentList == "invoicescomplete_view") column_route = 'invoices/complete_view';
                var invoice_columns = [];
                for(var i = 0; i < $filtersData.filterColumns.length; i++) {
                    if($filtersData.filterColumns[i].columnRoute === column_route) {
                        invoice_columns.push($filtersData.filterColumns[i]);
                    }
                }
                for(var i = 0; i < json.colModel.length; i++) {
                    for(var j = 0; j < invoice_columns.length; j++) {
                        if(json.colModel[i].name.toLowerCase().replace('.', '_') === invoice_columns[j].columnValue.toLowerCase()) {
                            json.colModel[i].columnType = invoice_columns[j].columnType;
                            continue;
                        }
                    }
                }

            }
            Factory_General_Components.entity_export(json, function(response) {
                console.log(response);
            });
        };
        //End Export Icons
        // Search
        vm.general_search_terms = "";
        vm.searched = false;
        vm.general_search = function(val) {
            console.log("search triggered");
            if (val) {
                vm.searched = true;
            } else {
                vm.searched = false;
            }
            var table_id = Elements.settings[Object.keys(Elements.settings)[0]].source.table_id;
            var table_url = Elements.settings[Object.keys(Elements.settings)[0]].source.url;
            $("#" + Elements.settings[Object.keys(Elements.settings)[0]].table).jqGrid.table_config.on_general_search(val);
        };
        vm.taxi = {
            url: "",
            absolute: false
        };
        $rootScope.$on("formValues", function(event, data) {
            $scope.formValues = data;
        });
        vm.taxi_start = function() {
            if (vm.taxi.url) {
                var url = !vm.taxi.absolute ? $location.$$url + "/" + vm.taxi.url : $state.$current.url.prefix + vm.taxi.url;
                vm.taxi.url = "";
                $location.path(url);
            }
        };
        /*GET SCREEN ACTIONS*/
        vm.getScreenActions = function() {
            var data = {
                app: vm.app_id,
                screen: vm.screen_id
            };
            console.log("email preview req data", data);


            $rootScope.$watch("formValuesLoaded", function() {
                if (typeof $rootScope.formValuesLoaded != "undefined") {
                    if ($rootScope.formValuesLoaded.screenActions) {
                        Factory_Master.getScreenActions(data, function(response) {
                            if (response) {
                                screenButtons = [];

                                console.log("email preview response ", response);
                                $.each(response, function(key, value) {
                                    if (value.isCrosschekRequired == false) {
                                        if (vm.app_id == "invoices") {
                                            obj = vm.mapInvoiceActions(value, false);
                                            if (value.mappedScreenActionName == "CreateFinalInvoice") {
                                                obj = {
                                                    action: "createFinalInvoice()",
                                                    disabled: !$rootScope.formValuesLoaded.canCreateFinalInvoice,
                                                    label: "CreateFinalInvoice"
                                                };
                                            }
                                        }
                                        if (obj != null) {
                                            screenButtons.push(obj);
                                        }
                                    } else {
                                        if (vm.app_id == "invoices") {
                                            obj = vm.mapInvoiceActions(value, true);
                                        }
                                        if (obj != null) {
                                            screenButtons.push(obj);
                                        }
                                    }
                                });
                            } else {
                                toastr.error("An error has occured!");
                            }
                            $scope.screenButtons = screenButtons;
                            $rootScope.screenButtons = screenButtons;
                        });
                    }
                }
            });
        };
        vm.mapInvoiceActions = function(action, requireCheck) {
            obj = {};
            DTOscreenActions = [];
            $.each($rootScope.formValuesLoaded.screenActions, function(key, value) {
                DTOscreenActions.push(value.id);
            });
            // init object
            obj.label = action.mappedScreenActionName;
            obj.disabled = true;
            // check if is in payload
            isInPayload = false;
            if (DTOscreenActions.length > 0) {
                if (DTOscreenActions.indexOf(action.mappedScreenActionId) != -1) {
                    isInPayload = true;
                }
            }
            // switch actions
            if (action.mappedScreenActionName == "Cancel") {
                obj.action = "cancel_invoice()";
                if (isInPayload == true) {
                    obj.disabled = false;
                }
            }
            if (action.mappedScreenActionName == "SubmitForApprovalInvoice") {
                obj.action = "submit_invoice_approve()";
                if (isInPayload == true) {
                    obj.disabled = false;
                }
            }
            if (action.mappedScreenActionName == "SubmitForReview") {
                obj.action = "submit_invoice_review()";
                if (isInPayload == true) {
                    obj.disabled = false;
                }
            }
            if (action.mappedScreenActionName == "Accept") {
                obj.action = "accept_invoice()";
                if (isInPayload == true) {
                    obj.disabled = false;
                }
            }
            if (action.mappedScreenActionName == "ApproveInvoice") {
                obj.action = "approve_invoice()";
                if (isInPayload == true) {
                    obj.disabled = false;
                }
            }
            if (action.mappedScreenActionName == "Revert") {
                obj.action = "revert_invoice()";
                if (isInPayload == true) {
                    obj.disabled = false;
                }
            }            
            if (action.mappedScreenActionName == "RejectInvoice") {
                obj.action = "reject_invoice()";
                if (isInPayload == true) {
                    obj.disabled = false;
                }
            }
            if (action.mappedScreenActionName == "UpdatePaymentProofDetails") {
                obj.hide = true;
            }
            // enable button if is not required to check the payload
            if (requireCheck == false) {
                obj.disabled = false;
            }
            return obj;
        };
        vm.translateLabel = function(string) {
            translated = $filter('translate')(string);
            if(translated){
                translatedString = translated
            } else {
                translatedString = "default"
            }
            return translatedString;
        }


        /*GET SCREEN ACTIONS*/
        //     $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
        //    $('clc-table-list').remove()
        // });
    }
]);
