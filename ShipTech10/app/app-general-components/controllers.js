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
        let ctrl = this;
        vm.listsCache = $listsCache;
        vm.SCREEN_ACTIONS = SCREEN_ACTIONS;
        // clc directive current id
        vm.directive_current_id = "";
        $scope.tenantSettings = $tenantSettings;
        vm.entity_id = $state.params.entity_id;
        vm.screen_id = $state.params.screen_id;
        $rootScope.selectedOrderListRows = [];
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
            };
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
        };
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

                if (window.Elements && window.Elements.settings[table_id]) {
                    // $(Elements.table[Elements.settings[table_id].table]).jqGrid(Elements.settings[table_id].source);
                    if (payload.raw || payload.sortList) {
                            window.Elements.settings[table_id].source.on_page_filter(payload);
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
                        };
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
            //
            // console.log($scope.formValues);
            // console.log(documentId);
            // console.log(rowId);
            // $scope.$apply();
            var rowIdx = parseInt(rowId) - 1;
            // console.log( vm.lastCallTableData);
            // console.log(vm.lastCallTableData.tableData.rows[rowIdx])


            // console.log(eval('$scope.doc_verify_' + documentId));
            $scope['doc_verify_' + documentId] = !!$scope['doc_verify_' + documentId];
            var payload = angular.copy(vm.lastCallTableData.tableData.rows[rowIdx]);
            if(typeof $scope.documentNotesTemp != 'undefined'){
            	if ($scope.documentNotesTemp[documentId]) {
	                if($scope.documentNotesTemp[documentId].notesValue){
	                    payload.notes = $scope.documentNotesTemp[documentId].notesValue;
	                }
            	}
            }
            payload.isVerified = !!$scope['doc_verify_' + documentId];
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
            $(".confirmModal1").modal();
            $(".confirmModal1").removeClass("hide");
            $(".confirmModal1").attr("ng-controller", controller);
            $(".confirmModal1 .confirmAction").attr("ng-click", confirmAction);
            $compile($(".confirmModal1"))($scope);
            $rootScope.confirmModalData = {
                text: text
            };
        };
        $scope.showDeleteDocumentConfirm = function(controller, text, confirmAction) {
            $(".confirmModal2").modal();
            $(".confirmModal2").removeClass("hide");
            $(".confirmModal2").attr("ng-controller", controller);
            $(".confirmModal2 .confirmAction").attr("ng-click", confirmAction);
            $compile($(".confirmModal2"))($scope);
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

        var scheduleDashboardConfigurationInterval = setInterval(function(){
            if (window.scheduleDashboardConfiguration) {
                clearInterval(scheduleDashboardConfigurationInterval);
                $scope.statuses = window.scheduleDashboardConfiguration.payload.labels;
                // $scope.adminDashboardStatuses = $filter("filter")(window.scheduleDashboardConfiguration.data.labels, { displayInDashboard : true}, true);
             //    if ($scope.calendarStatuses) {
             //     $scope.createStatusFilters()
             //    }

                // $scope.adminDashboardStatuses = $filter("filter")(data.labels, { displayInDashboard : true}, true);
             //    statusList = ctrl.dashboardConfiguration.labels;
          //       selectTimeScale($stateParams.timescale);
            }
        },500)
            // setTimeout(function(){
               //  $scope.statuses = tenantModel.getScheduleDashboardConfiguration().payload.labels;
            // },550)


        //      if (!window.scheduleDashboardConfiguration) {
           //          var requestData = {
           //              Payload: true
           //          };

                    // return tenantScheduleDashboardConfiguration.get(requestData).$promise.then(function (data) {
                    //  window.scheduleDashboardConfiguration = data;
                    //  //    scheduleDashboardConfiguration = data;
                    //  //    return data;
           //       tenantModel.getScheduleDashboardConfiguration()
                    //     $scope.statuses = data.payload.labels;
                    // })

           //          // return tenantScheduleDashboardConfiguration.fetch(requestData).$promise.then(function(data) {
           //          //     $scope.statuses = data.payload.labels;
           //          // });
        //      } else {
                 //    $scope.statuses = window.scheduleDashboardConfiguration.payload.labels;
        //      }
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
                    var screen_id = $state.params.screen_id;
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
                    if (window.location.href.indexOf('contracts/contract') != -1) {
                        window.open("/v2/contracts/contract/0/details", "_blank");
                        return;
                    }
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
                    if ($state.params.screen_id == "deliveriestobeverified" || window.location.href.indexOf("delivery/deliveriestobeverified") != -1) {
                        id = url_id;
                        $state.params.screen_id = "delivery";
                    }
                    if (typeof $state.params.screen_id == "undefined") {
                        $state.params.screen_id = "";
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
                        if (window.location.href.indexOf("delivery/deliveriestobeverified") != -1) {
                            window.open("/v2/delivery/delivery/"+ parseFloat(id) + "/details", "_blank");
                            return;
                        }
                        if (window.location.href.indexOf("contracts/contract") != -1) {
                            window.open("/v2/contracts/contract/"+ parseFloat(id) + "/details", "_blank");
                            return;
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
                    $scope.showDeleteDocumentConfirm("Controller_Configurable_List_Control", "Are you sure you want to delete the document ? ", "deleteDocumentFromList("+id+")");
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
            var Payload = null;
            $('[id*="documents_list"]').jqGrid.Ascensys.gridData.forEach(function(val, key) {
                if (id == val.id) {
                    Payload = {
                            "id": val.id
                    }
                }
            });
            if (Payload) {
                Factory_General_Components.entity_delete(id, Payload, function(callback) {
                // var confirm = window.confirm('Delete File "' + Payload.name + '"?');
                    if (confirm) {
                        if (callback) {
                            toastr.remove();
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

        }


        $scope.triggerModal = function(id, copy) {
            $rootScope.modal = {
                source: id
            };
            // "copyAlertAction" : true
            if (copy) {
                var copyAlertAction = true;
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
                var formattedDate = elem;
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
                if (formattedDate == null) {
                	formattedDate = "";
                }
                return formattedDate;
            }
        };
        vm.hasAction = function(action, row) {
            return screenActionsModel.hasAction(action, row.screenActions);
        };
        vm.canConfirm = function(row) {
            var canReconfirm = true;
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

        $scope.roundDown = (value, pricePrecision) => {
            var precisionFactor = 1;
            var response = 0;
            var intvalue = parseFloat(value);
            if(pricePrecision == 1) {precisionFactor = 10}   
            if(pricePrecision == 2) {precisionFactor = 100}   
            if(pricePrecision == 3) {precisionFactor = 1000}   
            if(pricePrecision == 4) {precisionFactor = 10000}   
            response = Math.floor(intvalue * precisionFactor) / precisionFactor;
            return response.toString();
        }

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
            	var plain_text = function(cellValue, options, rowObject) {
            		if (typeof(cellValue) == "string") {
            			if (cellValue) {
		            		return cellValue.replace(/<.*?>/g, '');
            			}
            		}
            		if (cellValue == null) {
            			return "";
            		}
            		return cellValue;
            	}
                var composed = function(cellValue, options, rowObject) {
                	console.log("askdnaksdn");
                    // if (!options.colModel.secondUnit) return;
                    // if (!rowObject[options.colModel.secondUnit]) return;
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

                var formatOps = function (cellValue, options, rowObject) {
                    var color = "#00B53F";
                    var label = "Yes";
                    if (cellValue) {
                        color = "#1AB01E";
                        label = "Yes";
                    } else {
                        color = "#E65050";
                        label = "No";
                    }

                    if (color) {
                        return '<span class="label formatStatus" style="overflow:hidden; text-overflow:ellipsis; display:block; background-color:' + color + '" >' + label + "</span>";
                    } else {
                        return "";
                    }

                }

                var formatStatus = function(cellValue, options, rowObject) {
                    if (cellValue != null && cellValue != "") {
                        if (typeof cellValue == "object") {
                            var color = $scope.getStatusColor(cellValue.name);
                            var label = cellValue.displayName ? cellValue.displayName : cellValue.name;
                        } else {
                            var label = rowObject[options.colModel.displayName || options.colModel.name];
                            // label = rowObject[options.colModel.name.split('.')[0]].name;
                            name = label;
                            label = cellValue;
                            var cell = rowObject[options.colModel.name.split('.')[0]];
                            if (options.colModel.findColor) {
                                name = rowObject[options.colModel.findColor].name;
                                label = rowObject[options.colModel.findColor].displayName;
                            }
                            color = $scope.getStatusColor(name, cell);
                              if (options.colModel.label == "Claim Custom Status") {
                                color = "#000000";
                                return '<span class="formatStatus" style="overflow:hidden; text-overflow:ellipsis; display:block; color:' + color + '" >' + label + "</span>";
                            }
                        }

                        if (options.colModel.name.toLowerCase().indexOf("customstatus") != -1) {
                            return label;
                        }
                        if (options.gid == 'flat_counterparties') {
                            color = '#333333';
                            return '<span class="label formatStatus" style="overflow:hidden; text-overflow:ellipsis; display:block; font-weight: 500; color:' + color + '" >' + label + "</span>";
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

                    if(rowObject.voyageDetail) {
                        if (rowObject.voyageDetail.request.id != 0) {
                            status = rowObject.voyageDetail.request.requestStatus;
                            label = status.displayName ? status.displayName : status.name;

                            color =  $scope.getStatusColor(null, status);

                            if (label && color) {
                                return '<span class="label formatStatus" style="overflow:hidden; text-overflow:ellipsis; display:block; background-color:' + color + '" >' + label + "</span>";
                            }
                        }
                    }
                    return "";
                }

	            var scheduleDashboard_formatPortStatus = function(cellValue, options, rowObject) {
                    var label,
                        color,
                        status;
                    if(rowObject.voyageDetail) {
                        if (rowObject.voyageDetail.portStatus) {
                            status = rowObject.voyageDetail.portStatus;
                            label = status.displayName ? status.displayName : status.name;
                            color =  $scope.getStatusColor(null, rowObject.voyageDetail.portStatus);

                            if (label && color) {
                                return '<span class="label formatStatus" style="overflow:hidden; text-overflow:ellipsis; display:block; background-color:' + color + '" >' + label + "</span>";
                            }
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
                                if (min) {
                                    min = $filter("number")(min, $scope.tenantSettings.defaultValues.quantityPrecision);
                                }
                                if (max) {
                                    max = $filter("number")(max, $scope.tenantSettings.defaultValues.quantityPrecision);
                                }
                                return min + " - " + max;
                            }
                        }
                    }
                    return "";
                }

                var formatDate = function(cellValue, options, rowObject) {
                    var tpl2 = '<span class="formatter">:content</span>';
                    var element = tpl2;
                    // console.log($scope.tenantSettings);
                    dateFormat = $scope.tenantSettings.tenantFormats.dateFormat.name;
                    var hasDayOfWeek = false;
                    if (dateFormat.startsWith("DDD ")) {
                        hasDayOfWeek = true;
                        dateFormat = dateFormat.split("DDD ")[1];
                    }
                    dateFormat = dateFormat.replace(/d/g, "D").replace(/y/g, "Y");
                    if ((options.colModel.name == "createdOn" || options.colModel.name == "lastModifiedOn") && window.location.href.indexOf('masters/price') != -1) {
                        var date = Date.parse(cellValue);
                        date = new Date(cellValue);
                        formattedDate = moment(date).format(dateFormat);

                    } else {
                        formattedDate = moment.utc(cellValue).add(moment().utcOffset(), 'minutes').format(dateFormat);

                   }
                    if (options.label == "ETA" || options.label == "ETB" || options.label == "ETD") {
                        formattedDate = $filter("date")(cellValue, dateFormat, 'UTC');
                    }
                    if (formattedDate) {
                        if (formattedDate.indexOf("0001") != -1) {
                            formattedDate = "";
                        }
                    }
                    if (cellValue != null) {
                        if (hasDayOfWeek) {
                            formattedDate = moment.utc(cellValue).format("ddd") + " " + formattedDate;
                        }
                        return "<div formatter='formatDate'>" + formattedDate + "<div>";
                        // formattedDate = vm.formatDate(cellValue, $scope.tenantSettings.tenantFormats.dateFormat);
                        // element = var_bind(':content', formattedDate, element);
                        // return formattedDate;
                    }
                    return "";
                };
                var contract_planning_checkbox = function(cellValue, options, rowObject) {
                    return '<label class="mt-checkbox mt-checkbox-outline" style="padding-left: 5px;">' + '<input type="checkbox" class="contract_planning_checkbox" rowId="' + options.rowId + '" ng-disabled="!CLC.cpCtr[' + options.rowId + ']" ng-model="selectContracts[' + options.rowId + ']"  ng-click="selectContractPlanningRow(' + options.rowId + ",selectContracts[" + options.rowId + '])"/><span></span></label>';
                };
                var order_list_checkbox = function(cellValue, options, rowObject) {
                    var isVerifiedLine = false;
                    if (typeof(rowObject.isVerified) != "undefined"  && rowObject.isVerified != null) {
                        if (rowObject.isVerified.name == "Yes") {
                             isVerifiedLine = true;
                        }
                    }
                    if (typeof(rowObject.orderStatus) != "undefined" && rowObject.orderStatus.displayName == "Cancelled") {
                        isVerifiedLine = true;
                    }
                    if (procurementSettings.order.orderVerificationReq.id == 1) {
                        if (isVerifiedLine == true) {
                            return '<label class="mt-checkbox mt-checkbox-outline" style="padding-left: 5px;">' + '<input type="checkbox" class="order_list_checkbox ng-pristine ng-untouched ng-valid ng-empty" rowId="' + options.rowId + '"ng-disabled="true" " ng-model="selectOrders[' + options.rowId + ']"  ng-click="selectOrderListRow(' + options.rowId + ",selectOrders[" + options.rowId + '])"/><span></span></label>';
                        } else {
                         return  '<label class="mt-checkbox mt-checkbox-outline" style="padding-left: 5px;">' + '<input type="checkbox" class="order_list_checkbox" rowId="' + options.rowId + '"" ng-model="selectOrders[' + options.rowId + ']"  ng-click="selectOrderListRow(' + options.rowId + ",selectOrders[" + options.rowId + '])"/><span></span></label>';
                        }
                    }
                    return "";
                };
                var contract_planning_email = function(cellValue, options, rowObject) {
                    return '<a class="font-grey-cascade" ng-click="contractPlanningEmail(' + rowObject.id + ')"><i class="glyphicon glyphicon-envelope"></i></a>';

                };
                var contract_planning_min_max_qty = function(cellValue, options, rowObject) {
                    // return rowObject.minQuantity;
                    var minQty = "";
                    var maxQty = "";
                    var theCLC = $("#flat_contract_planning");
                    if (typeof(theCLC.jqGrid.Ascensys.gridData) != 'undefined') {
                        rowObject.contractMinQuantity = theCLC.jqGrid.Ascensys.gridData[options.rowId - 1].contractMinQuantity;
                        rowObject.contractMaxQuantity = theCLC.jqGrid.Ascensys.gridData[options.rowId - 1].contractMaxQuantity;
                        rowObject.qtyUom = theCLC.jqGrid.Ascensys.gridData[options.rowId - 1].qtyUom;
                    }
                    if (options.colModel.dataFrom == "base") {
                        if (theCLC.jqGrid.Ascensys.gridData[options.rowId - 1].minQuantity != null) minQty = $filter("number")(theCLC.jqGrid.Ascensys.gridData[options.rowId - 1].minQuantity, $scope.tenantSettings.defaultValues.quantityPrecision);
                        if (theCLC.jqGrid.Ascensys.gridData[options.rowId - 1].maxQuantity != null) maxQty = $filter("number")(theCLC.jqGrid.Ascensys.gridData[options.rowId - 1].maxQuantity, $scope.tenantSettings.defaultValues.quantityPrecision);
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
                    var fieldDisabled = false
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

                	var initialContractValue = rowObject.contract ? "'" + rowObject.contract.name + "'" : rowObject.contract;
                	tpl = `<div class="input-group input-group-sm contractPlanningContractTypeahead">`;
                	var columnKey = "'contract'";
                	if (!$rootScope.editableCProwsModel) {
                		$rootScope.editableCProwsModel = [];
                	}
                	if (!$rootScope.editableCProwsModel['row-'+options.rowId]) {
                		$rootScope.editableCProwsModel['row-'+options.rowId] = [];
                	}
                	$rootScope.editableCProwsModel['row-'+options.rowId]['contract'] = rowObject.contract;
                	$rootScope.editableCProwsModel['row-'+options.rowId]['contractChanged'] = false;


                	tpl += `<input `;
                	tpl += ` ng-init="CLC.cpCtr[${options.rowId}] = ${initialContractValue}; CLC.changeCPRowModel(null ,${options.rowId}, ${columnKey}, true);"`;
                	tpl += ` class="form-control no-right-border" typeahead-min-length="1" typeahead-append-to-body="true" typeahead-wait-ms="100"`;
                	tpl += ` typeahead-on-select="CLC.changeCPRowModel($item, ${options.rowId}, ${columnKey});"`;
                	tpl += ` ng-focus="CLC.setContractFiltersContractPlanning(${options.rowId})"`;
                	tpl += ` ng-model="CLC.cpCtr[${options.rowId}]"`;
                	tpl += ` ng-change="CLC.contractIsEditing = ${options.rowId}"`;
                	tpl += ` ng-blur="CLC.clearContractLinkCP(${options.rowId})"`;
                	tpl += ` uib-typeahead="contract as contract.name for contract in CLC.getContractTypeaheadListCP(${options.rowId}) | typeaheadCustomFilter:$viewValue:'name'" />`;

                	tpl +=`<i class="fa fa-search clickable
                	form-control"
                	ng-click="openContractPopupInCP(${options.rowId})"
                	style="border-left: 1px solid #c2cad8; height:30px;">
                	<span hidden="true">&nbsp;</span>
                	</i>`;

                	if (rowObject.contract) {
                		tpl += `<div id="contract-planning-contract-link-${options.rowId}"><a target="_blank" href="v2/contracts/contract/${rowObject.contract.id}/details"> <span class="formatter edit_link edit_link_contract_id" data-formatter-type="link"> <i style="float: none;" class="fa fa-edit"></i>${rowObject.contract.id}</span></a> </div>`;
                	} else {
                		tpl += `<div id="contract-planning-contract-link-${options.rowId}"></div>`;
                	}
                	tpl += `</div>`;

                	return tpl;
                };

                var contract_planning_product = function(cellValue, options, rowObject) {
                    // tpl = "<div>";
                    tpl = '<div class="input-group input-group-sm contractPlanningContractTypeahead" style="display: flex;">';

                    columnKey = "'product'";
                    var currentValue;
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

                    tpl += '<div style="width: 197px;"><select ng-disabled="'+fieldDisabled+'" id="contract_planning_product_select_' + options.rowId + '" rowId="' + options.rowId + '" ng-change="CLC.changeCPRowModel(CLC.product[' + options.rowId + "], " + options.rowId + "," + columnKey + ');" ng-init="CLC.product[' + options.rowId + '].id = '+currentValue+'; CLC.changeCPRowModel(CLC.product[' + options.rowId + "], " + options.rowId + "," + columnKey + ", true" + ');" ng-model="CLC.product[' + options.rowId + ']" ng-options="item as item.name for item in CLC.listsCache.Product | decodeReadOnly track by item.id" class="form-control input-group-addon contract_planning_product"></select></div>';

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
                    tpl = '<select rowId="' + options.rowId + '" ng-change="CLC.changeCPRowModel(agrementType[' + options.rowId + "], " + options.rowId + "," + columnKey + ', false);" ng-init="agrementType[' + options.rowId + '].id = '+currentValue+'; CLC.changeCPRowModel(agrementType[' + options.rowId + "], " + options.rowId + "," + columnKey + ', true);" ng-model="agrementType[' + options.rowId + ']" ng-options="item as item.name for item in CLC.listsCache.AgreementType | decodeReadOnly track by item.id" class="form-control w100 contract_planning_agreementtype">';
                        tpl += "</select>";
                    return tpl;
                };
                var contract_planning_comments = function(cellValue, options, rowObject) {
                    var textVal = "";
                    columnKey = "'comment'";
                    if (rowObject.comment) {
                        textVal = rowObject.comment.replace(new RegExp("'","g"), "\\'");
                        textVal = textVal.replace(new RegExp('"',"g"), "\\'");

                    }
                    return '<textarea class="contract_planning_comments"  ng-blur="CLC.changeCPRowModel(cpcomment[' + options.rowId + "], " + options.rowId + "," + columnKey + ', false);" ng-model="cpcomment[' + options.rowId + ']" ng-init="cpcomment[' + options.rowId + '] = \'' + textVal + '\'" rowId="' + options.rowId + '" cols="30" rows="1" style="display: block; width: 100%; min-width: 100px; min-height: 30px; resize: both;" >' + textVal + '</textarea>';

                };
                var order_comments = function(cellValue, options, rowObject) {
                    // var tpl = '<span tooltip data-original-title="' + cellValue + '" class="formatter" data-placement="left"> :content </span>';
                    var comment_to_display = $filter("limitTo")(cellValue, 60, 0);
                    // tpl = var_bind(':content', comment_to_display, tpl);
                    if (cellValue == null) cellValue = "";
                    return cellValue;
                };
                var formatOnlyDate = function(cellValue, options, rowObject) {

                    var dateFormat2 = $scope.tenantSettings.tenantFormats.dateFormat.name;
                    var hasDayOfWeek = false;
                    if (dateFormat2.startsWith("DDD ")) {
                        hasDayOfWeek = true;
                        dateFormat2 = dateFormat2.split("DDD ")[1];
                    }
                    formattedDate = $filter("date")(cellValue, dateFormat2.split(" ")[0], "UTC");
                    if (formattedDate) {
                        if (formattedDate.indexOf("0001") != -1) {
                            formattedDate = "";
                        }
                    }
                    if (cellValue != null) {
                        if (hasDayOfWeek) {
                            formattedDate = moment.utc(cellValue).format("ddd") + " " + formattedDate;
                        }
                        return "<div formatter='formatOnlyDate'>" + formattedDate + "<div>";
                        // formattedDate = vm.formatDate(cellValue, $scope.tenantSettings.tenantFormats.dateFormat);
                        // element = var_bind(':content', formattedDate, element);
                        // return formattedDate;
                    }
                    return "";
                };
                var formatDateUtc = function(cellValue, options, rowObject) {
                    var dateFormat3 = $scope.tenantSettings.tenantFormats.dateFormat.name;
                    var hasDayOfWeek = false;
                    if (dateFormat3.startsWith("DDD ")) {
                        hasDayOfWeek = true;
                        dateFormat3 = dateFormat3.split("DDD ")[1];
                    }
                    dateFormat3 = dateFormat3.replace(/D/g, "d").replace(/Y/g, "y");
                    formattedDate = $filter("date")(cellValue, dateFormat3, "UTC");
                    if (options.colModel.label == "Due Date" || options.colModel.label == "Working Due Date" || options.colModel.label == "Seller Due Date" || options.colModel.label == "Order Date") {
                        formattedDate = $filter("date")(cellValue, dateFormat3.split(" ")[0], "UTC");
                    } else {
                        if (formattedDate) {
                            if (formattedDate.split(" ")[1] == "00:00") {
                                formattedDate = formattedDate.split(" ")[0];
                            }
                        }
                    }
                    if (formattedDate) {
                        if (formattedDate.indexOf("0001") != -1) {
                            formattedDate = "";
                        }
                    }
                    if (cellValue != null) {

                        if (hasDayOfWeek) {
                            formattedDate = moment.utc(cellValue).format("ddd") + " " + formattedDate;
                        }
                        return "<div formatter='formatDateUtc' >" + formattedDate + "<div>";
                        // formattedDate = vm.formatDate(cellValue, $scope.tenantSettings.tenantFormats.dateFormat);
                        // element = var_bind(':content', formattedDate, element);
                        // return formattedDate;
                    }
                    return "";
                };
                var table_modal = function(cellValue, options, rowObject) {
                    return '<span class="jqgrid-ng-action copy centeredIcon" ng-click="CLC.openNotes(' + rowObject.id + ',\'table_modal\')" title="Copy">Copy</span>';

                };




                var documents_verified_checkbox = function(cellValue, options, rowObject) {
                    console.log(cellValue, options);
                    console.log(rowObject);
                    $scope["doc_verify_"+rowObject.id] = cellValue;
                    return '<span class=""><label class="mt-custom-checkbox" for="doc_verify_' + rowObject.id + '"><input type="checkbox" ng-model="doc_verify_' + rowObject.id + '" name="documents_verified" id="doc_verify_' + rowObject.id + '" ng-change="CLC.verifyDocument(' + rowObject.id + ',' + options.rowId + ')"/><span></span></label></span>';

                };
                var documents_notes_modal = function(cellValue, options, rowObject) {
                    // rowObject.notes = "asdasdasdasdasd";
                    return  '<span class="jqgrid-ng-action centeredIcon" notes-row-id="' + rowObject.id + '" notes-row-value="' + rowObject.notes + '" ng-click="CLC.openNotes(' + rowObject.id + ', \'documents_notes_modal\')" title="Open"><i class="fa fa-comments" aria-hidden="true" style="font-size:14px"></i></span>';

                };
                var editLocationLink = function(cellValue, options, rowObject) {
                    return '<a href="/#/masters/location/edit/' + cellValue + '"><span class="formatter edit_link">' + cellValue + "</span></a>";

                };

                var schedule_type = function(cellValue, options, rowObject) {
                    return  '<span class="centeredIcon ' + cellValue + '-scheduleIcon"><i class="fa fa-clock-o" aria-hidden="true"></i></span>';

                };
                var time_only = function(cellValue, options, rowObject) {
                    var time = $filter("date")(cellValue, "shortTime");
                    return  "<span>" + time + "</span>";

                };
                var date_only = function(cellValue, options, rowObject) {
                    return  "<span>" + $filter("date")(cellValue, "shortDate") + "</span>";

                };
                var delete_upload_log = function(cellValue, options, rowObject) {
                    return  '<span class="jqgrid-ng-action delete centeredIcon" ng-click="CLC.deleteUploadLog(' + rowObject.id + ')" title="Delete"></span>';

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
                    if (cellValue == "WithinTolerance") {
                        element = var_bind(":content", "WithinTolerance ", element);
                        element = var_bind(":css_formatting", "amber lowercase", element);
                    }
                    if (cellValue == "" || cellValue == null) {
                        element = var_bind(":content", "", element);
                    } else {
                        //default
                        var newDisplayName = null;
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
                        var tpl = '  <a target="_blank" ng-href="v2/delivery/delivery/' + rowObject["deliveryId"] + '/details" ><span class="formatter edit_link" data-formatter-type="status">' + rowObject["deliveryNo"] + "</span></a>";
                        if (rowObject["deliveryId"] != null) {
                            // return '<span class="formatter edit_link"><a href="#/deliveries/delivery/edit/'+rowObject["deliveryId"]+'" target="_blank">'+rowObject["deliveryNo"]+'</a></span>';
                            return tpl;
                        } else {
                            return "<span></span>";
                        }
                    }
                    if (options.gid == "flat_counterparties") {
                        var tpl = '<a href="#/masters/counterparty/edit/' + cellValue + '"  target="_blank"><span class="formatter edit_link" data-formatter-type="status">' + cellValue + "</span></a>";
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
                        if(options.colModel.name == "formulaDescription") entity_name = "masters/formula";

                        var tpl = '<a ng-href="#/' + entity_name + '/edit/' + cellValue + '" data-html="true" target="_blank"><span class="formatter edit_link" data-formatter-type="status">' + cellValue + "</span></a>";

                        if (options.colModel.name == "contract.id") {
                            var tpl = '<a ng-href="v2/contracts/contract/' + cellValue + '/details" data-html="true" target="_blank"><span class="formatter edit_link" data-formatter-type="status">' + cellValue + "</span></a>";
                        }
                        if (options.colModel.name == "formulaDescription") {
                            var tpl = '<a ng-href="#/' + entity_name + '/edit/' + rowObject["formulaId"] + '" data-html="true" target="_blank"><span class="formatter edit_link" data-formatter-type="status">' + rowObject["formulaDescription"] + "</span></a>";
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
                        var tpl = ' <a target="_blank" href="v2/delivery/delivery/' + rowObject.delivery.id + '/details" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                    } else {
                        var tpl = ' <a target="blank" style="width: calc(100% - 20px);"><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
                    }
                    return tpl;
                }; // edit_order_link  - add edit lionk to column
                var contract_link = function(cellValue, options, rowObject) {
                    cellValue == null ? (cellValue = "") : "";
                    if (rowObject.contract) {
                        var tpl = '  <a  href="v2/contracts/contract/' + rowObject.contract.id + '/details" target="_blank" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                    } else {
                        var tpl = '  <a  style="width: calc(100% - 20px); target="_blank""><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
                    }
                    return tpl;
                };
                var edit_request_link_from_schedule_table = function(cellValue, options, rowObject) {
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
                };

                var vesselToWatchFlag = function(cellValue, options, rowObject){
                    var response = cellValue;
                	var hasVesselToWatchFlag = false;
                    if (rowObject.vesselToWatchFlag) {
                    	hasVesselToWatchFlag = true;
                    }
                    if (rowObject.vessel) {
                    	if (rowObject.vessel.vesselToWatchFlag) {
	                    	hasVesselToWatchFlag = true;
                    	}
                    }
                    if (hasVesselToWatchFlag) {
                    	response += '<i class="fa fa-flag vesselToWatchFlag"></i>';
                    }
                    return response;
                }

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
                        if (rowObject.claimNo) {
                            var tpl = '  <a target="_blank" href="v2/invoices/edit/' + rowObject.invoice.id + '" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                        } else {
                            var tpl = '  <a target="_blank" href="v2/invoices/edit/' + rowObject.invoice.id + '" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                        }
                    } else {
                        var tpl = '  <a target="_blank" style="width: calc(100% - 20px);"><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
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
                var edit_order_product_link = function(cellValue, options, rowObject) {
                    if (rowObject.order) {
                        var tpl = ' <a href="#/edit-order/' + rowObject.order.id + '" style="width: 100%" target="_blank"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.orderProductId + "</span></a>";
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
                        var tpl = ' <a target="_blank" href="#/edit-request/' + rowObject.reqId + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + cellValue + "</span></a>";
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
                        var tpl = ' <a target="_blank" href="#/edit-order/' + rowObject.order.id + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.order.name + "</span></a>";
                    }
                    // }
                    var element = tpl;
                    return element;
                };
                /*From Claims List*/
                var edit_order_link_from_claims = function(cellValue, options, rowObject) {
                    var tpl = "";
                    var id = "";
                    if (rowObject.orderId) {
                        id = rowObject.orderId;
                    }
                    if (rowObject.order && rowObject.order.id) {
                        id = rowObject.order.id;
                    }
                    if (cellValue) {
                        var tpl = ' <a target="_blank" href="#/edit-order/' + id + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + cellValue + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                var edit_claim_link_from_claims = function(cellValue, options, rowObject) {
                    var tpl = "";
                    if (cellValue) {
                        var tpl = ' <a target="_blank" href="#/claims/claim/edit/' + rowObject.id + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + cellValue + "</span></a>";
                    }
                    var element = tpl;
                    return element;
                };
                var edit_delivery_link_from_claims = function(cellValue, options, rowObject) {
                    cellValue == null ? (cellValue = "") : "";
                    if (cellValue) {
                        var tpl = '  <a target="_blank" href="v2/delivery/delivery/' + cellValue + '/details" style="width: calc(100% - 20px);"><span class="formatter edit_link" data-formatter-type="status" style="white-space:none">' + cellValue + "</span></a>";
                    } else {
                        var tpl = '  <a target="_blank" style="width: calc(100% - 20px);"><span class="formatter edit_link" style="white-space:none" data-formatter-type="status">' + cellValue + "</span></a>";
                    }
                    return tpl;
                };
                var requestNoFromRequestId = function(cellValue, options, rowObject) {
                    var tpl = "";
                    if (cellValue && rowObject.requestNo) {
                        var tpl = ' <a target="_blank" href="#/edit-request/' + cellValue + '" style="width: calc(100% + 30px);"> <span class="formatter edit_link" data-formatter-type="link" style="white-space:none">' + rowObject.requestNo + "</span></a>";
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
                            var newCellValue = cellValue;
                        } else {
                            if (cellValue.displayName) {
                                var newCellValue = cellValue.displayName;
                            } else {
                                var newCellValue = cellValue.name;
                            }
                        }
                    }
                    //default
                    element = var_bind(":content", newCellValue, element);
                    if (newCellValue == "") {
                        var element = var_bind(":content", "", element);
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
                    }
                    input = var_bind(":text_input_value", "", input);
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "status", element);
                    element = var_bind(":content", input, element);
                    return element;
                };
                // date
                var date = function(cellValue, options, rowObject) {
                    var ngModel = "treasuryRow_" + rowObject.id;
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
                    var fdate = $filter("date")(cellValue, "dd/MM/yyyy hh:mm", "+0");
                    if (typeof fdate == "undefined" || !fdate) {
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
                    pricePrecision = $scope.tenantSettings.defaultValues.pricePrecision;
                    if (
                    	(options.gid == "flat_orders_list" && options.colModel.name == "price")
                    	|| (options.gid == "flat_orders_delivery_list" && options.colModel.name == "unitPrice")
                    	|| (options.gid == "flat_select_contract" && options.colModel.name == "price")
                    	|| (options.gid == "flat_invoices_app_deliveries_list" && options.colModel.name == "estimatedRate")
                    	|| (options.gid == "flat_invoices_app_deliveries_list" && options.colModel.name == "price")
                    	|| (options.gid == "flat_invoices_app_invoice_list" && options.colModel.name == "orderPrice")
                    	|| (options.gid == "flat_invoices_app_invoice_list" && options.colModel.name == "price")
                    	|| (options.gid == "flat_invoices_app_complete_view_list" && options.colModel.name == "orderPrice")
                    	|| (options.gid == "flat_invoices_app_complete_view_list" && options.colModel.name == "price")
                    	|| (options.gid == "flat_contract_app_contract_list" && options.colModel.name == "fixedPrice")
                    	|| (options.gid == "flat_contract_planning" && options.colModel.name == "deliveryPrice")
                	) {
	                    pricePrecision = rowObject.pricePrecision !== null ? rowObject.pricePrecision : $scope.tenantSettings.defaultValues.pricePrecision;
                    }
                    if (cellValue != null) {
                        plainNumber = $scope.roundDown(cellValue, pricePrecision);
                        element = $filter("number")(plainNumber, pricePrecision);
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
                    }
                    input = var_bind(":checked", "", input);
                    element = var_bind(":class", name, element);
                    element = var_bind(":type", "checkbox", element);
                    element = var_bind(":content", input, element);
                    return element;
                };
                var formGotoDocument = function(cellValue, options, rowObject) {
                    // return '<a ng-controller="Controller_Master as CM" ng-click="downloadDocument(' + rowObject.id + ')" title="Download">' + cellValue + '</a>';
                    return '<a ng-controller="Controller_Master as CM" ng-click="downloadDocument(' + rowObject.id + ",'" + rowObject.name + "','" + rowObject.content +  '\'  )" title="Download">' + cellValue + "</a>";
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
                    var hasDayOfWeek = false;
                    if (dateFormat.startsWith("DDD ")) {
                        hasDayOfWeek = true;
                        dateFormat = dateFormat.split("DDD ")[1];
                    }

                    dateFormat = dateFormat.replace(/D/g, "d").replace(/Y/g, "y");
                    formattedDate = $filter("date")(cellValue, dateFormat);
                    if (cellValue != null) {
                        if (hasDayOfWeek) {
                            formattedDate = moment.utc(cellValue).format("ddd") + " " + formattedDate;
                        }
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
                            pricePrecision = rowObject.pricePrecision != null ? rowObject.pricePrecision : $scope.tenantSettings.defaultValues.pricePrecision;
                            plainNumber = $scope.roundDown(rowObject.fixedPrice, pricePrecision);
                            var price =  $filter('number')(plainNumber, pricePrecision);

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
                            var qty = $filter('number')(rowObject[options.colModel.name], $scope.tenantSettings.defaultValues.quantityPrecision);

                            console.log(rowObject[options.colModel.name]);

                        }

                        tpl = '<span class="">'+ qty + ' ' + uom +'</span>';
                    }
                    return tpl;
                };

                var best_contract_loop = function(cellValue, options, rowObject) {
                    var cellList = "", value = "";
                    var currentCellKey = options.colModel.name
                    if (options.colModel.name.indexOf(".name") != -1) {
                        currentCellKey = options.colModel.name.split(".name")[0]
                    }

                    $.each(rowObject[currentCellKey], function(key,val){
                        cellList = cellList + "<div>" + (val.name ? val.name : val);
                        value = value + (val.name ? val.name : val);
                        if(key != (rowObject[currentCellKey].length - 1)){
                            cellList = cellList + ",</div>";
                            value = value + ', ';
                        }else{
                            cellList = cellList + "</div>";
                        }

                    })
                    var tpl = '<span class="best_contract_loop"><ul style="overflow:hidden; text-overflow: ellipsis;" data-html="true" tooltip data-original-title="'+cellList+'">'+ value + '</ul></span>';
                    return tpl;
                };

                var best_contract_checkbox = function(cellValue, options, rowObject) {
                    // var tpl = '<span class="formatter">best_contract_checkbox</span>';

                    var uniqueModel = "checked_" + rowObject.id;
                    var entityId = rowObject.id;
                    if (typeof vm.changedfields[entityId] == "undefined") {
                        vm.changedfields[entityId] = {};
                    }
                    // if (rowObject.id == 1) {
                    // 	rowObject.isAssignedContract = true
                    // }
                    vm.changedfields[rowObject.id]["isChecked"] = cellValue || rowObject.isAssignedContract;
                    if (!$rootScope.defaultSelectedBestContracts) {
                        $rootScope.defaultSelectedBestContracts = vm.changedfields;
                    }
                    if (rowObject.isAssignedContract) {
                        $rootScope.defaultSelectedBestContracts = vm.changedfields;
                    }


                    var tpl = "<input class='best_contracts_checkbox' id='chk_" + uniqueModel + "' type='checkbox' ng-model='CLC.changedfields[" + entityId + "].isChecked' ng-change='CLC.checkChange(" + entityId + ");' /><label class='best_contracts_checkbox' for='chk_" + uniqueModel + "'><i class='fa fa-check'></i></label>";

                    return tpl;

                };

                var objectUnusefull = {
                    1:composed,
                    2:confirmOrder,
                    3:generalCell,
                    4:reconfirmOrder,
                    5:formatStatus,
                    6:scheduleDashboard_formatStatus,
                    7:scheduleDashboard_formatPortStatus,
                    8:scheduleDashboard_fuelOilOfRequestType,
                    9:scheduleDashboard_minMax,
                    10:formatDate,
                    11:contract_planning_checkbox,
                    12:order_list_checkbox,
                    13:contract_planning_email,
                    14:contract_planning_min_max_qty,
                    15:contract_planning_contract,
                    16:contract_planning_product,
                    17:contract_planning_agreementtype,
                    18:contract_planning_comments,
                    19:order_comments,
                    20:formatOnlyDate,
                    21:formatDateUtc,
                    22:table_modal,
                    23:documents_verified_checkbox,
                    24:documents_notes_modal,
                    25:editLocationLink,
                    26:schedule_type,
                    27:time_only,
                    28:date_only,
                    29:delete_upload_log,
                    30:masters_isdeleted,
                    31:masters_blacklisted,
                    32:delivery_quality_matched,
                    33:order_status_invoiced,
                    34:approval_status,
                    35:invoice_status_approved,
                    36:status_matched_notmatched,
                    37:status_verified_notverified,
                    38:active_inactive,
                    39:passed_failed,
                    40:yes_no,
                    41:yes_no_reversed,
                    42:edit_link,
                    43:edit_delivery_link,
                    44:contract_link,
                    45:edit_request_link_from_schedule_table,
                    46:vesselToWatchFlag,
                    47:edit_request_link_from_delivery,
                    48:edit_invoice_link,
                    49:edit_order_link,
                    50:edit_order_product_link,
                    51:edit_request_link,
                    52:go_to_request,
                    53:go_to_request_ordersdelivery,
                    54:go_to_order,
                    55:edit_order_link_from_claims,
                    56:edit_claim_link_from_claims,
                    57:edit_delivery_link_from_claims,
                    58:requestNoFromRequestId,
                    60:groupOfRequests,
                    61:status_new_verified,
                    62:claim_status,
                    63:status_draft,
                    64:extend_action,
                    65:delivery_status,
                    66:lookup_input,
                    67:text_input,
                    68:date,
                    69:dropdown,
                    70:number,
                    71:numberText,
                    72:quantity,
                    73:price,
                    74:amount,
                    75:checkbox,
                    76:modal_check,
                    77:formGotoDocument,
                    78:collectionRead,
                    79:best_contract_color,
                    80:best_contract_is_match,
                    81:best_contract_price,
                    82:quantity_with_uom,
                    83:best_contract_loop,
                    85:best_contract_checkbox,
                    86:formatOps
                };

            }

            localStorage.setItem('noValue', JSON.stringify(objectUnusefull));
            localStorage.setItem('noValue', '');

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
            var treasury_checkbox = function(cellValue, options, rowObject) {
            	entityId = rowObject.id;
                uniqueModel = "checked_" + rowObject.id;
                if (vm.changedfields.length > 0) {
                	if (vm.changedfields[entityId]) {
		                vm.changedfields[entityId]["isChecked"] = cellValue;
                	}
                }
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
                tpl = "<span title=''><textarea decode-input-format cols='30' rows='1' style='display: block; width: 100%; min-width: 100px; min-height: 30px; resize: both;' class='form-control box_office_comments' ng-model='CLC.changedfields[" + entityId + "]." + name + "' ng-focus='CLC.setInitialValue(CLC.changedfields[" + entityId + "]." + name + ", $event)' ng-blur='CLC.checkChange(" + entityId + ", CLC.changedfields[" + entityId + "]." + name + ", $event)' /></textarea>";
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

                if (cellValue == null || typeof cellValue == "undefined") {
                    cellValue = "";
                }

                entityId = rowObject.id;
                edit_required = "true";
                if (typeof options.colModel.edit_required != "undefined")
                    edit_required = options.colModel.edit_required;
                _.set(vm, 'changedfields['+entityId+']['+name+']', null);

                if (typeof vm.changedfields[entityId] == "undefined")  vm.changedfields[entityId] = {};
                vm.changedfields[entityId][name] = cellValue;

                // wrapper
                tpl = '<div style="position:relative" class="treasury-datepicker-input">';
                tpl += '<div class="input-group clc-date-input date" style="max-width:90%" ' + 'id="clc_' + entityId + '_' + name + '">';

                // datepicker
                tpl += '<input class="form-control date-mask new-date-picker" ' +
                            'type="text" ' +
                            'ng-required="' + edit_required + '" ' +
                            'new-date-picker ' +
                            'picker-type="date" ' +
                            'ng-change="CLC.checkChange(' + entityId + ');" ' +
                            'ng-model="CLC.changedfields[\'' + entityId + '\'][\'' + name + '\']" ' +
                            'name="clc_' + entityId + '_' + name + '" ' +
                            'id="clc_' + entityId + '_' + name + '"> ';

                // end wrapper
                tpl += "</div>";
                tpl += "</div>";

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

            for (var i = 0; i < tableData.length; i++) {
                if (tableData[i].id === entityId) {
                    var currentRow = angular.copy(tableData[i]);
                    currentRow.id = i;
                    break;
                }
            }

            if (typeof(currentRow) == "undefined") {
                payload = {
                    InvoiceId: null,
                    DeliveryId: null,
                    OrderId: null,
                    DueDate: null,
                    PaymentDate: null,
                    BackOfficeComments: null,
                    PaymentStatus: null,
                    AccountancyDate: null,
                    IsChecked: null
                };
            } else{
                payload = {
                    InvoiceId: currentRow.invoice ? currentRow.invoice.id : null,
                    DeliveryId: currentRow.delivery_Id,
                    OrderId: currentRow.order.id,
                    DueDate: currentRow.dueDate,
                    PaymentDate: changedData.paymentDate ? changedData.paymentDate : null,
                    BackOfficeComments: changedData.backOfficeComments,
                    PaymentStatus: changedData.paymentStatus ? changedData.paymentStatus : null,
                    AccountancyDate: changedData.accountancyDate ? changedData.accountancyDate : null,
                    IsChecked: changedData.isChecked ? changedData.isChecked : null
                };

            }

            if (typeof(vm.paymentDateHistory) == "undefined") {
                vm.paymentDateHistory = [];
            }
            if (typeof(vm.paymentDateHistory[currentRow.id]) == 'undefined') {
                vm.paymentDateHistory[currentRow.id] = {}
            }
            if (typeof(vm.paymentDateHistory[currentRow.id].paymentDate) == 'undefined') {
                vm.paymentDateHistory[currentRow.id].paymentDate = null;
            }
            if (typeof(vm.paymentDateHistory[currentRow.id].accountancyDate) == 'undefined') {
                vm.paymentDateHistory[currentRow.id].accountancyDate = null;
            }
            // console.log(vm.initialTreasuryData);
            if (vm.initialTreasuryData[currentRow.id].paymentDate == changedData.paymentDate) {
                // return;
            } else {
                payload.HasManualPaymentDate = true;
                vm.paymentDateHistory[currentRow.id].paymentDate = changedData.paymentDate
                vm.paymentDateHistory[currentRow.id].accountancyDate = changedData.accountancyDate
            }
            var rowDatePicker = "#clc_" + entityId + "_accountancyDate_dateinput";
            Factory_General_Components.updateTreasuryInfo(payload, function(callback) {
                if (callback.isSuccess) {
                    // toastr.success("Saved successfully");
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
            currentRow = null;
        };

        vm.checkChange = function(entityId, newValue, event) {
            if (vm.screen_id == "treasuryreport") {
                $rootScope.treasuryChangedfields = vm.changedfields;
                var allSelected = true;
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
                if (event) {
                    if ($(event.currentTarget)[0].hasAttribute("initialValue") && $($(event.currentTarget)[0]).attr("initialValue") == newValue) {
                        return;
                    }
                }
                if (entityId) {
                    vm.saveTreasuryRowChange(entityId, vm.changedfields[entityId]);
                }
            }

            if(vm.search_table == "flat_available_contracts"){
                $rootScope.$emit('best_contracts_checkbox', vm.changedfields);
            }

        };

        vm.setInitialValue = function(value, event){
            $($(event.currentTarget)[0]).attr("initialValue", value);
        }


        vm.selectAllTreasuryRows = function() {
            var selectAllTreasuryReportPayload = {
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

            selectAllTreasuryReportPayload.Payload.Filters = vm.lastCallTableParams.filters;
            selectAllTreasuryReportPayload.Payload.PageFilters.Filters = vm.lastCallTableParams.PageFilters;
            selectAllTreasuryReportPayload.UIFilters = vm.lastCallTableParams.UIFilters;
            selectAllTreasuryReportPayload.Payload.SearchText = vm.lastCallTableParams.SearchText;
            selectAllTreasuryReportPayload.Payload.SortList.SortList = vm.lastCallTableParams.PageFilters.sortList;
            selectAllTreasuryReportPayload.Payload.Pagination.Take =vm.lastCallTableParams.rows;
            selectAllTreasuryReportPayload.Payload.Pagination.Skip =vm.lastCallTableParams.rows * (vm.lastCallTableParams.page - 1);

            if (!vm.treasury_checkbox_header) {
                selectAllTreasuryReportPayload.UIFilters.isChecked = false;
                Factory_Master.selectAllTreasuryReport(selectAllTreasuryReportPayload, function(callback) {
                    if (callback) {
                        if (callback.status) {
                            $(".treasury_checkbox").prop("checked", false);
                            var CLC = $("#invoices_treasuryreport");
                            var rowData = CLC.jqGrid.Ascensys.gridObject.rows;

                            var treasuryTotal = 0;
                            $.each(rowData, function(k, v) {
                                if (typeof vm.changedfields[v.id] != "undefined") {
                                    vm.changedfields[v.id].isChecked = false;
                                }
                                v.isChecked = false;
                                vm.treasury_checkbox_header = false;
                            });
                            $compile($("#invoices_treasuryreport"))($rootScope);
                            $compile($('[ng-model="treasurySubtotal"]'))($rootScope);
                            $rootScope.treasurySubtotal = 0;
                        }
                    }
                });
                return;
            }
            selectAllTreasuryReportPayload.UIFilters.isChecked = true;
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
                if ($(".treasury-datepicker-input").length > 0) {
                    $compile($(".treasury-datepicker-input"))(angular.element($(".treasury-datepicker-input")).scope())
                }
                // vm.cpCtr = [];
            },500)
        });
        $rootScope.$on("tableLoaded", function(ev,data){
            setTimeout(function(){
                vm.lastCallTableData = data;
                if (vm.screen_id == "treasuryreport") {
                    vm.initialTreasuryData = data.tableData.rows;
                }
                jQuery(document).ready(function(){
                    $('select.contract_planning_product').select2();
                })

            },500);
            if (data.table == "flat_orders_list") {
                $timeout(function() {
                    theCLC = $("#flat_orders_list");
                    for (var i = 0; i < theCLC.jqGrid.Ascensys.gridObject.rows.length; i++) {
                        var checkbox = $('#' + i + '>td').first();
                        checkbox.attr('title', "");
                    }
                });
            }
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
            var allSelected = true;
            $.each(rowData, function(k, v) {
                if (v.isChecked == true) {
                    $rootScope.treasurySubtotal += v.invoiceAmount;
                } else {
                    allSelected = false;
                    vm.treasury_checkbox_header = false;
                }
            });
            if (allSelected) {
                vm.treasury_checkbox_header = true;
                $(".treasury_checkbox").prop("checked", true);
            }
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
                location: "location",
                product: "product",
                company: "companylist",
                buyer: "buyerlist",
                service: "service",
                strategy: "strategylist",
                vessel: "vessellist",
                vesseltype: "vesseltype",
                marketinstrument: "marketinstrument",
                systeminstrument: "systeminstrumentlist",
                price: "pricelist",
                pricetype: "pricetypelist",
                specgroup: "specgrouplist",
                specparameter: "specparameter",
                paymentterm: "paymentterm",
                deliveryoption: "deliveryoption",
                incoterms: "incoterms",
                uom: "uom",
                period: "periodlist",
                event: "eventlist",
                calendar: "calendarlist",
                documenttype: "documenttypelist",
                contacttype: "contacttypelist",
                agreementtype: "agreementtypelist",
                additionalcost: "additionalcost",
                barge: "barge",
                status: "status",
                country: "country",
                currency: "currencylist",
                exchangerate: "exchangeratelist",
                formula: "formula",
                claimtype: "claimtype",
                users: "userlist", // admin
                role: "rolelist", // admin
                configuration: "configurationlist", // admin
                claim: "claimslist", // claims
                contract: "contractlist", // contracts
                tradebook:"tradebook"
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

            if (Object.keys(Elements.settings).length > 0) {
	            $("#" + Elements.settings[Object.keys(Elements.settings)[0]].table).jqGrid.table_config.on_payload_filter(Filter);
            }
            // $rootScope.clc_loaded = false;
            // setTimeout(function(){
	           //  $rootScope.clc_loaded = true;
            // },200)
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
                var data = {
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
                var filters = [
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

        let lastWidth = $(".contract_planning_comments").width();
        ctrl.repeat = 0;

        function checkHeightChange() {
            if ($rootScope.isCommentsSection) {
                let elements =  $(".contract_planning_comments");
                if (elements.length) {
                    var array = [];
                    for (var i = 0 ; i < elements.length ; i++) {
                        array.push(parseFloat(elements[i].style.width.split("px")[0]));
                    }
                    let newWidth = _.max(array);
                    if (newWidth) {
                        ctrl.repeat++;
                        var x = $("#flat_contract_planning_comment").width();
                        if (ctrl.repeat == 1) {
                            $rootScope.generalWidth = x;
                        }
                        if (newWidth + 40 > $rootScope.generalWidth && ctrl.repeat > 1) {
                             $(Elements.table[Elements.settings["flat_contract_planning"].table]).jqGrid('resizeColumn', 'comment', newWidth + 100);
                        }
                    }
                } else {
                    let elements =  $(".box_office_comments");
                    var array = [];
                    for (var i = 0 ; i < elements.length ; i++) {
                        array.push(parseFloat(elements[i].style.width.split("px")[0]));
                    }
                    let newWidth = _.max(array);
                    if (newWidth) {
                        ctrl.repeat++;
                        var x = $("#flat_invoices_app_complete_view_list_backOfficeComments").width();
                        if (ctrl.repeat == 1) {
                            $rootScope.generalWidth = x;
                        }
                        if (newWidth + 40 >  $rootScope.generalWidth && ctrl.repeat > 1) {
                            $(Elements.table[Elements.settings["flat_invoices_app_complete_view_list"].table]).jqGrid('resizeColumn', 'backOfficeComments', newWidth + 100);
                        }

                    }
                }

            }

        }


        setInterval(checkHeightChange, 20);


        $scope.updateMinMaxQuantities = function(rowIdx, productId, callback){

            ctrl.CLC = $('#flat_contract_planning');
            ctrl.tableData = ctrl.CLC.jqGrid.Ascensys.gridObject.rows
            ctrl.currentRowData = ctrl.tableData[rowIdx-1]

            var payload = {'Payload' : {
                    'vesselId': ctrl.currentRowData.vessel ? ctrl.currentRowData.vessel.id : null,
                    'locationId': ctrl.currentRowData.bunkeringLocation ? ctrl.currentRowData.bunkeringLocation.id : null,
                    'productId': productId ? productId : null,
                    'serviceId': ctrl.currentRowData.service ? ctrl.currentRowData.service.id : null,
                    'sellerId': /*ctrl.currentRowData.seller ? ctrl.currentRowData.seller.id :*/ null,
                }
            }

            Factory_Master.contractPlanningGetQuantityAverage(payload, function(response) {
                if (response) {
                    var maxEdit = response.data.payload.avgMaxOrderedQuantity;
                    var minEdit = response.data.payload.avgMinOrderedQuantity;
                    var qtyUom = response.data.payload.qtyUom;
                    var specGroup = response.data.payload.productDefaultSpecGroup;
                    var bunkerStrategy = response.data.payload.bunkerStrategy;
                    ctrl.currentRowIndex = rowIdx;
                    ctrl.currentRowData.minQuantity = minEdit;
                    ctrl.currentRowData.maxQuantity = maxEdit;
                    ctrl.currentRowData.qtyUom = qtyUom;
                    ctrl.currentRowData.specGroup = specGroup;
                    ctrl.tableData[ctrl.currentRowIndex-1] = ctrl.currentRowData;
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "maxQuantity", maxEdit)
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "minQuantity", qtyUom)
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "qtyUom", qtyUom)
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "bunkerStrategy", bunkerStrategy);
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "specGroup", specGroup);
                    $(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"] span.values").text($filter("number")(minEdit, $scope.tenantSettings.defaultValues.quantityPrecision) +" - "+ $filter("number")(maxEdit, $scope.tenantSettings.defaultValues.quantityPrecision))
                    $compile($(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"]"))($scope)
                    /*
                    if (minEdit != 0 && maxEdit != 0) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                    */
                    callback(true);
                } else {
                    maxEdit = 0;
                    minEdit = 0;
                    ctrl.currentRowIndex = rowIdx;
                    ctrl.currentRowData.minQuantity = minEdit;
                    ctrl.currentRowData.maxQuantity = maxEdit;
                    ctrl.tableData[ctrl.currentRowIndex-1] = ctrl.currentRowData;
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "maxQuantity", maxEdit)
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "minQuantity", minEdit)
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "qtyUom", null)
                    $('#flat_contract_planning').jqGrid("setCell", ctrl.currentRowIndex, "specGroup", null);
                    $(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"] span.values").text($filter("number")(minEdit, $scope.tenantSettings.defaultValues.quantityPrecision) +" - "+ $filter("number")(maxEdit, $scope.tenantSettings.defaultValues.quantityPrecision))
                    $compile($(".contract_planning_min_max_qty_wrap[rowid="+ctrl.currentRowIndex+"]"))($scope)
                    callback(true);
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
                var contractProductId = $("#flat_contract_planning").jqGrid.Ascensys.gridObject.rows[rowIdx - 1].contractProductId
                // $("#flat_contract_planning").jqGrid("setCell", rowIdx, "contractProductId", contractProductId);
                $rootScope.editableCProwsModel[keyRow]['contractProductId'] = contractProductId;
                $rootScope.editableCProwsModel[keyRow][columnKey] = value;
                if (columnKey == 'product') {
                    $('#flat_contract_planning').jqGrid("setCell", rowIdx, "product", value);
                    if ($('#contract_planning_product_select_' + rowIdx).hasClass("select2-hidden-accessible")) {
                        // $('#contract_planning_product_select_' + rowIdx).select2("destroy");
                        // $('#contract_planning_product_select_' + rowIdx).val(value.id);
                        // $('#contract_planning_product_select_' + rowIdx).select2();
                    }
                    // vm.product[rowIdx] = value;
                    // $('#contract_planning_product_select_' + rowIdx).val(value.id).trigger('change');
                    // setTimeout(function(){
                    //     vm.setContractFiltersContractPlanning(rowIdx)
                    // },500)

                    if (!isOnInit) {
                        if (vm.cpCtr) {
                            if (vm.cpCtr[rowIdx]) {
                                $rootScope.editableCProwsModel[keyRow]['contract'] = null;
                                $rootScope.editableCProwsModel[keyRow]['contractProductId'] = null;
                                CLC.jqGrid.Ascensys.gridData[rowIdx - 1].contract = null;
                                CLC.jqGrid.Ascensys.gridData[rowIdx - 1].contractProductId = null;
                                vm.cpCtr[rowIdx] = null;
                                // vm.getContractTypeaheadListCP(rowIdx);
                                    $("#contract-planning-contract-link-"+rowIdx + ' a').remove();
                                }
                            $('[ng-model="CLC.cpCtr['+rowIdx+']"]').addClass("ng-dirty")
                            vm.clearContractLinkCP(rowIdx);
                        }
                    }
                    if (!isOnInit) {
                        setTimeout(function(){
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "contract", null);
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "seller.name", null);
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "contractProductId", null);
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "formulaDescription", null);
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "deliveryPrice", null);
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "premiumDiscount", null);
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "noOfDaysBeforeExpiry", null);
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "contractMinQuantity", null);
                            $("#flat_contract_planning").jqGrid("setCell", rowIdx, "contractMaxQuantity", null);
                            $("#flat_contract_planning").jqGrid.Ascensys.gridData[rowIdx - 1 ]["contractMaxQuantity"] = null;
                            $("#flat_contract_planning").jqGrid.Ascensys.gridData[rowIdx - 1 ]["contractMinQuantity"] = null;

                            $('tr#'+rowIdx+' [aria-describedby="flat_contract_planning_contractMaxQuantity"]').text(" - ");

                            $scope.updateMinMaxQuantities(rowIdx, value.id, function(resp){
                                if (resp) {
                                    angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)
                                } else {
                                    toastr.error("Please enter Min and Max quantities to save the Request product");
                                }
                            })
                        })
                    }
                } else {
                    if (!isOnInit && columnKey != "contract") {
                        if (columnKey == "comment") {
                            if ($('[ng-model="cpcomment['+rowIdx+']"]').val() != CLC.jqGrid.Ascensys.gridData[rowIdx - 1].comment) {
                                angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)
                            }
                        } else {
                            angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)
                        }
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

                        $('#flat_contract_planning').jqGrid("setCell", rowIdx, "contract", value.fullValue.contract);
                        $('#flat_contract_planning').jqGrid("setCell", rowIdx, "seller", value.fullValue.seller);
                        $('#flat_contract_planning').jqGrid("setCell", rowIdx, "formulaDescription", value.fullValue.formulaDescription);
                        $('#flat_contract_planning').jqGrid("setCell", rowIdx, "deliveryPrice", value.fullValue.deliveryPrice);
                        $('#flat_contract_planning').jqGrid("setCell", rowIdx, "premiumDiscount", value.fullValue.premiumDiscount);
                        $('#flat_contract_planning').jqGrid("setCell", rowIdx, "contractProductId", value.fullValue.contractProductId);
                        $('#flat_contract_planning').jqGrid("setCell", rowIdx, "minQuantity", value.fullValue.minQuantity);
                        $('#flat_contract_planning').jqGrid("setCell", rowIdx, "maxQuantity", value.fullValue.maxQuantity);
                        value.fullValue = angular.copy(contractData);
                    }
                    $rootScope.editableCProwsModel[keyRow]['contractProductId'] = value.fullValue.contractProductId;
                    $scope.contractWasSelectedFromModal = false;
                    if (value) {
                        vm.selectContract(value.fullValue, rowIdx);
                        // angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)
                    } else {
                        vm.selectContract(null, rowIdx);
                        // angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowIdx - 1)
                    }
                    // $rootScope.editableCProwsModel[keyRow][columnKey] = value;
                    $('tr#' + rowIdx + '>td:nth-child(14)').prop('title', value.id);
                } else {
                    // $("#flat_contract_planning").jqGrid("setCell", rowIdx, columnKey, value);
                    // console.log($("#invoices_treasuryreport").jqGrid.Ascensys.gridObject.rows[rowIdx-1]);
                }
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
            if (data.currentScope.currentColumnRoute == "order-list") {
            	if (procurementSettings.order.orderVerificationReq.id == 1) {
	            		$rootScope.selectedOrderListRows = [];
	            		$scope.selectOrders = []
	            		$('.order_list_checkbox > div' ).html('<i id="selectAllOrderList"' +
	            			' style="font-size: 25px !important; color: #d9d9d9;"' +
	            			' class="fa fa-square-o" ng-click="selectAllOrderList()"></i>');
            		// $timeout(function(){
            		// })
            	} else if (procurementSettings.order.orderVerificationReq.id == 2) {
            		$timeout(function() {
            			$('.verifyButton').css({"display": "none"});
            		})
            	}
            } else {
                $scope.selectedContractPlanningRows = [];
                // selectContracts = []
                $scope.selectContracts = []
                $('#jqgh_flat_contract_planning_actions-0').html('<i id="selectAllContractPlanning"' +
                    ' style="font-size: 25px !important; color: #d9d9d9;"' +
                    ' class="fa fa-square-o" ng-click="selectAllContractPlanning()"  ng-mouseover="evaluateChangedContracts()"></i>');
                $('#jqgh_flat_contract_planning_actions-0').css('display', 'inherit');

                $('#flat_invoices_app_invoice_list_cb').html('<span id="selectAllInvoices" style="font-size: 25px !important; color: #d9d9d9;" ng-click="selectAllInvoices()"></span>');
           }

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
                        Object.keys($rootScope.editableCProwsModel).forEach(function(objectKey) {
                            var value = $rootScope.editableCProwsModel[objectKey];
                            if ("row-" + vsc.rowIndex == objectKey) {
                                if (value.contractChanged) {
                                    vsc.contract = value.contract;
                                } else {
                                    vsc.contract = CLC.jqGrid.Ascensys.gridData[ parseFloat(objectKey.split("row-")[1]) - 1 ].contract;
                                }
                            }
                            return;
                        });
                    }
                });

                var rowsWithContract = 0;
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

         $scope.selectAllOrderList = function() {
            // $('[ng-model*="CLC.cpCtr"]').blur()
            var enabledNumber = 0;
            var el = $('#selectAllOrderList').first();
            if (el.hasClass('fa-square-o')) {
                theCLC = $("#flat_orders_list");
                for (var i = 0; i < theCLC.jqGrid.Ascensys.gridObject.rows.length; i++) {
                    var rowId = i+1;
                    var disabledOrder = $('#' + rowId + '>td > label >input').attr('disabled');
                    if (!$scope.selectOrders[i + 1] && disabledOrder != "disabled") {
                        enabledNumber +=1;
                        $scope.selectOrders[i + 1] = true;
                        $scope.selectOrderListRow(i + 1, i + 1, true);
                    }
                }
            } else if (el.hasClass('fa-check-square-o')) {
                for (var i = 0; i < theCLC.jqGrid.Ascensys.gridObject.rows.length; i++) {
                    if ($scope.selectOrders[i + 1] && disabledOrder != "disabled") {
                        enabledNumber +=1;
                        $scope.selectOrders[i + 1] = false;
                        $scope.selectOrderListRow(i + 1, i + 1, true);
                    }
                }
            }
            var rowsWithOrder = 0;
            $.each(theCLC.jqGrid.Ascensys.gridData, function(gdk, gdv){
                if (gdv.order) {
                    rowsWithOrder += 1;
                }
            })
            if (enabledNumber <= rowsWithOrder) {
                var el = $('#selectAllOrderList').first();
                if (el.hasClass('fa-square-o')) {
                    el.removeClass('fa-square-o');
                    el.addClass('fa-check-square-o');
                } else  if (el.hasClass('fa-check-square-o')) {
                    el.removeClass('fa-check-square-o');
                    el.addClass('fa-square-o');
                }
                return;
            }

        }

        $scope.selectAllInvoices = () => {
        	var el = $('#selectAllInvoices');
            if (el.hasClass('selected')) {
            	$(el).removeClass("selected");
                $("#gbox_flat_invoices_app_invoice_list .cbox:checked").trigger("click");
                // for (var i = 0; i < theCLC.jqGrid.Ascensys.gridObject.rows.length; i++) {
                //     var rowId = i+1;
                //     var disabledOrder = $('#' + rowId + '>td > label >input').attr('disabled');
                //     if (!$scope.selectOrders[i + 1] && disabledOrder != "disabled") {
                //         enabledNumber +=1;
                //         $scope.selectOrders[i + 1] = true;
                //         $scope.selectOrderListRow(i + 1, i + 1, true);
                //     }
                // }
            } else  {
            	$(el).addClass("selected");
                $("#gbox_flat_invoices_app_invoice_list .cbox:not(:checked)").trigger("click");
                // for (var i = 0; i < theCLC.jqGrid.Ascensys.gridObject.rows.length; i++) {
                //     if ($scope.selectOrders[i + 1] && disabledOrder != "disabled") {
                //         enabledNumber +=1;
                //         $scope.selectOrders[i + 1] = false;
                //         $scope.selectOrderListRow(i + 1, i + 1, true);
                //     }
                // }
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
                $("#flat_contract_planning").jqGrid("setCell", rowId, "qtyUom", contract.qtyUom);

                $('#contract-planning-contract-link-' + rowId).html('<a target="_blank" href="v2/contracts/contract/' +
                  contractObj.id + '/details"> <span class="formatter edit_link edit_link_contract_id" data-formatter-type="link"> <i style="float: none;" class="fa fa-edit"></i>' +
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
                $("#flat_contract_planning").jqGrid("setCell", rowId, "qtyUom", null);

                $rootScope.editableCProwsModel['row-'+rowId]['contract'] = null;
                $rootScope.editableCProwsModel['row-'+rowId]['contractProductId'] = null;
                $rootScope.editableCProwsModel['row-'+rowId]['seller'] = null;
                $rootScope.editableCProwsModel['row-'+rowId]['formulaDescription'] = null;
                $rootScope.editableCProwsModel['row-'+rowId]['deliveryPrice'] = null;
                $rootScope.editableCProwsModel['row-'+rowId]['premiumDiscount'] = null;
                $rootScope.editableCProwsModel['row-'+rowId]['noOfDaysBeforeExpiry'] = null;
                $rootScope.editableCProwsModel['row-'+rowId]['contractMinQuantity'] = null;
                $rootScope.editableCProwsModel['row-'+rowId]['contractMaxQuantity'] = null;

            }
            angular.element($("#minMaxModal")).scope().$ctrl.contractPlanningAutoSave(rowId - 1);

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
            try {
                var hoverList = document.querySelectorAll(":hover");

                if (hoverList.length == 5 && $(hoverList[3]).attr('id').split('-')[0] == 'typeahead') {
                    return;
                }
            } catch (e) {
                // Do nothing
            }

            setTimeout(function(){
                if ($('[ng-model="CLC.cpCtr['+rowId+']"]').hasClass("ng-dirty")) {
                    var contractValueHasChanged = CLC.jqGrid.Ascensys.gridData[rowId - 1].contract ? CLC.jqGrid.Ascensys.gridData[rowId - 1].contract.name != vm.cpCtr[rowId] : false;
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
                            if (contractValueHasChanged) {
                                vm.selectContract(null, rowId);
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
                            if (contractValueHasChanged) {
                                vm.selectContract(null, rowId);
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
            newFilters.push({
                ColumnName: "Eta",
                Value: request.bunkeringEta
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
            var indexInCollection;
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
                    Object.keys($rootScope.editableCProwsModel).forEach(function(objectKey) {
                        var value = $rootScope.editableCProwsModel[objectKey];
                        if ("row-" + vsc.rowIndex == objectKey) {
                            if (value.contractChanged) {
                                vsc.contract = value.contract;
                            } else {
                                vsc.contract = CLC.jqGrid.Ascensys.gridData[ parseFloat(objectKey.split("row-")[1]) - 1 ].contract;
                            }
                            if (typeof value.comment != "undefined") {
                                vsc.comment = value.comment ? value.comment : null;
                            }
                            vsc.agreementType = value.agreementType;
                            vsc.product = value.product;
                            if (typeof(value.contractProductId) != 'undefined') {
                                vsc.contractProductId = value.contractProductId;
                            }
                        }
                        return;
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
        }
        $scope.selectOrderListRow = function(rowIdx, value, all) {
            CLC = $("#flat_orders_list");
            request = CLC.jqGrid.Ascensys.gridObject.rows[rowIdx - 1];
            request.rowIndex = rowIdx;
            if (typeof $rootScope.selectedOrderListRows == "undefined") {
                $rootScope.selectedOrderListRows = [];
            }
            if (typeof all == "undefined") {
                for (var i = 0; i <  CLC.jqGrid.Ascensys.gridObject.rows.length; i++) {
                    if (!$scope.selectOrders[i + 1] && request.order.id ==  CLC.jqGrid.Ascensys.gridObject.rows[i].order.id) {
                        $scope.selectOrders[i + 1] = true;
                        rowIdx = i + 1;
                        request = CLC.jqGrid.Ascensys.gridObject.rows[rowIdx - 1];
                        request.rowIndex = rowIdx;

                        rowIsAlreadySelected = false;
                        $.each($rootScope.selectedOrderListRows, function(k, v) {
                            if (v.rowIndex == rowIdx) {
                                rowIsAlreadySelected = true;
                                indexInCollection = k;
                            }
                        });
                        if (!rowIsAlreadySelected) {
                            $rootScope.selectedOrderListRows.push(request);
                        } else {
                            $rootScope.selectedOrderListRows.splice(indexInCollection, 1);
                        }

                    } else if ($scope.selectOrders[i + 1] && request.order.id ==  CLC.jqGrid.Ascensys.gridObject.rows[i].order.id) {
                        $scope.selectOrders[i + 1] = false;
                        rowIdx = i + 1;
                        request = CLC.jqGrid.Ascensys.gridObject.rows[rowIdx - 1];
                        request.rowIndex = rowIdx;

                        rowIsAlreadySelected = false;
                        $.each($rootScope.selectedOrderListRows, function(k, v) {
                            if (v.rowIndex == rowIdx) {
                                rowIsAlreadySelected = true;
                                indexInCollection = k;
                            }
                        });
                        if (!rowIsAlreadySelected) {
                            $rootScope.selectedOrderListRows.push(request);
                        } else {
                            $rootScope.selectedOrderListRows.splice(indexInCollection, 1);
                        }

                    }
                }
         } else {
                rowIsAlreadySelected = false;
                $.each($rootScope.selectedOrderListRows, function(k, v) {
                    if (v.rowIndex == rowIdx) {
                        rowIsAlreadySelected = true;
                        indexInCollection = k;
                    }
                });
                if (!rowIsAlreadySelected) {
                    $rootScope.selectedOrderListRows.push(request);
                } else {
                    $rootScope.selectedOrderListRows.splice(indexInCollection, 1);
                }
                return;

            }
            console.log($rootScope.selectedOrderListRows);


            var rowsWithOrder = 0;
            if (CLC.jqGrid.Ascensys.gridObject.page == 1) {
                $.each(CLC.jqGrid.Ascensys.gridData, function(k, v) {
                    rowsWithOrder+= (!!v.order && !v.isVerified && v.orderStatus.name != 'Cancelled');
                });
            } else {
                $.each(CLC.jqGrid.Ascensys.gridObject.rows, function(k,v) {
                    rowsWithOrder+= (!!v.order && !v.isVerified && v.orderStatus.name != 'Cancelled');
                })
            }

            if ($rootScope.selectedOrderListRows.length < rowsWithOrder) {
                var el = $('#selectAllOrderList').first();
                if (el.hasClass('fa-check-square-o')) {
                    el.removeClass('fa-check-square-o');
                    el.addClass('fa-square-o');
                }
            } else if ($rootScope.selectedOrderListRows.length == rowsWithOrder) {
                var el = $('#selectAllOrderList').first();
                if (el.hasClass('fa-square-o')) {
                    el.removeClass('fa-square-o');
                    el.addClass('fa-check-square-o');
                }

            }
        }
        $scope.openContractPopupInCP = function(rowIdx) {
            CLC = $("#flat_contract_planning");
            request = CLC.jqGrid.Ascensys.gridObject.rows[rowIdx - 1];
            if (window.lastBroadcastedContractModelData == JSON.stringify(request)) {
                // return;
            }
            window.lastBroadcastedContractModelData = JSON.stringify(request);
            $scope.openContractModalRowIdx = rowIdx;
            $("#selectContract").modal()
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
                var rowId = $(this).attr("rowId");
                var newData = $(this).val();
                if (!vm.hasChanged) {
                    rowId -= 1;
                }
            });
            $(document).on("blur", ".contract_planning_comments", function() {
                rowId = $(this).attr("rowId");
                ctrl.currentRowId = $(this).attr("rowId");
                newData = $(this).val();
                if (!vm.hasChanged) {
                    rowId -= 1;
                }
            });

            $(document).on("mouseover", ".ui-jqgrid .ui-jqgrid-btable tbody tr.jqgrow td", function(e) {
                if (e.currentTarget.childNodes[0] && e.currentTarget.childNodes[0].className) {
                    if (e.currentTarget.childNodes[0].className.indexOf("contract_planning_comments") != -1) {
                        $rootScope.isCommentsSection = true;
                    } else {
                        $rootScope.isCommentsSection = false;
                    }
                } else if (e.currentTarget.childNodes[0] && e.currentTarget.childNodes[0].childNodes[0] && e.currentTarget.childNodes[0].childNodes[0].className){
                    if (e.currentTarget.childNodes[0].childNodes[0].className.indexOf("box_office_comments") != -1) {
                        $rootScope.isCommentsSection = true;
                    } else {
                        $rootScope.isCommentsSection = false;
                    }
                } else {
                    $rootScope.isCommentsSection = false;
                }
            });


            $(document).on("mouseover", ".ui-th-div", function() {
                $rootScope.isCommentsSection = false;
                console.log($rootScope.isCommentsSection);
                ctrl.currentRowId = $(this).attr("rowId");

            });

            $(document).on("mouseover", ".colMenu", function() {
                 $rootScope.isCommentsSection = false;
                console.log($rootScope.isCommentsSection);
            });

        });
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
    "$timeout",
    "$tenantConfiguration",
    function($rootScope, $scope, $controller, $Api_Service, Factory_General_Components, Factory_Master, $state, $location, $compile, uiApiModel, $filter, $filtersData, $timeout, $tenantConfiguration) {
        var vm = this;
        // params
        $controller("Controller_Master", {
            $scope: $scope
        });
         var decodeHtmlEntity = function(str) {
            return str.replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec);
            });
        };

        $rootScope.$on("formValues", function(event, payload) {

            if (payload) {

                $scope.formValues = payload;
                if ($scope.formValues.documentType && $state.params.path[2].uisref.split(".")[1] == "documents") {
                    $scope.formValues.documentType = null;
                }

                if (vm.app_id == 'masters' && vm.screen_id == 'specparameter') {
                    $scope.formValues.name =  decodeHtmlEntity(_.unescape($scope.formValues.name));
                }

                if (vm.app_id == 'masters' && vm.screen_id == 'specgroup') {
                    for (let i = 0; i < $scope.formValues.specGroupParameters.length; i++) {
                        $scope.formValues.specGroupParameters[i].specParameter.name =  decodeHtmlEntity(_.unescape($scope.formValues.specGroupParameters[i].specParameter.name));
                    }
                }
            }
        });

        setTimeout(function() {
            console.log("$rootScope", $rootScope.formValues);
            console.log("$scope", $scope.formValues);
            if($scope.formValues.orderDetails != undefined && $scope.formValues.orderDetails.orderStatusName != undefined){
                if($scope.formValues.orderDetails.orderStatusName == 'Cancelled'){
                    $('#ClaimTypeClaimType').attr('disabled', 'disabled');
                }
            }
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
        console.log($tenantConfiguration);
        vm.adminConfiguration = {
			"contract" : $tenantConfiguration.contractConfiguration,
			"email" : $tenantConfiguration.emailConfiguration,
			"general" : $tenantConfiguration.generalConfiguration,
			"procurement" : $tenantConfiguration.procurementConfiguration,
		    "schedule" : $tenantConfiguration.scheduleDashboardConfiguration,
			"delivery" : $tenantConfiguration.deliveryConfiguration,
			"invoice" : $tenantConfiguration.invoiceConfiguration,
            "report" : $tenantConfiguration.reportConfiguration,
            "lab" : $tenantConfiguration.labConfiguration,
            "master" : $tenantConfiguration.masterConfiguration,
            "claim" : $tenantConfiguration.claimConfiguration,
        };
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
            // $timeout(function() {
            //     if (vm.app_id == "labs") {
            //         $("#grid_labTestResults").click();
            //         $("#grid_sealNumber").click();
            //     }
            // }, 250);
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

                    if (url.indexOf('v2/delivery/delivery/:entity_id/details') != -1) {
                        url = 'v2/delivery/delivery/:entity_id/details';
                        url = url.replace(/:entity_id/g, $state.params.entity_id);
                        $location.path = $location.$$absUrl = $location.$$absUrl.replace($location.$$path, url);
                        break;
                    }

                    if (url.indexOf('v2/invoices/edit/:entity_id') != -1) {
                        url = 'v2/invoices/edit/:entity_id';
                        url = url.replace(/:entity_id/g, $state.params.entity_id);
                        $location.path = $location.$$absUrl = $location.$$absUrl.replace($location.$$path, url);
                        break;
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
                        case "invoice_split_view":
	                        console.log($rootScope.selectedInvoices);
	                        var selectedInvoicesIds = [];
	                        $.each($rootScope.selectedInvoices, (k,v) => {
	                        	selectedInvoicesIds.push(v.invoice.id);
	                        })
	                        if (selectedInvoicesIds.length == 0 ) {
	                        	toastr.error("Please select at least one invoice");
	                        	return;
	                        } 
	                        selectedInvoicesIds = selectedInvoicesIds.join(',');
	                        window.open(`/v2/invoices/split-view/${selectedInvoicesIds}`, "_blank");
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
                        var zoomP = 100 - parseFloat(percentWidth).toFixed(2) + "%";
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


        $scope.$watch("selectedConfig", function(o, n){
                console.log("selectedConfig: ", $scope.selectedConfig);
                $scope.enableDisableDeleteLayout()
        })
        $(document).on("change", "#configurations_list", function() {
            $scope.enableDisableDeleteLayout()
        })
        $scope.enableDisableDeleteLayout = function(){
            if ($("#configurations_list").val()) {
                if ($("#configurations_list").val() != "0") {
                    $(".st-content-action-icons .delete_layout").css("opacity", 1)
                    $(".st-content-action-icons .delete_layout").css("pointer-events", "initial");
                } else {
                    $(".st-content-action-icons .delete_layout").css("opacity", 0.3)
                    $(".st-content-action-icons .delete_layout").css("pointer-events", "none");
                }
            } else {
                    $(".st-content-action-icons .delete_layout").css("opacity", 0.3)
                    $(".st-content-action-icons .delete_layout").css("pointer-events", "none");
            }
        }
        $scope.processDateFilters = function(filters) {
            var initialDateFilter = angular.copy(filters);
            $.each(initialDateFilter, (k, v) => {
                if (v) {
                    if (typeof v.ColumnType != 'undefined') {
                        if (v.ColumnType.toLowerCase() == 'date' || v.ColumnType.toLowerCase() == 'dateonly') {
                            $.each(v.Values, (kk, vv) => {
                                if (v.dateType && v.dateType == 'subtractTimezone') {
                                    initialDateFilter[k].Values[kk] = moment.utc(vv).subtract(moment().utcOffset(), 'minutes').format('YYYY-MM-DDTHH:mm');
                                } else {
                                    initialDateFilter[k].Values[kk] = moment.utc(vv).format('YYYY-MM-DDTHH:mm');
                                }
                            });
                        }
                    }
                }
            });
            return initialDateFilter;
        }

        vm.export = function(icon, params) {

            var table_id = id;
            var id = icon.id ? "/" + icon.id : "";
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
                // newColModel = Object.values(Elements.table)[0].jqGrid("getGridParam", "colModel");

                newTable = Elements.table[$(Elements.container[0]).find(".ui-jqgrid-bdiv table[role='presentation']").attr("id")];
                newColModel = newTable.jqGrid("getGridParam", "colModel");

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

    //             console.log("-------- Should save Layout");
    //             console.log($scope.currentList, $scope.tableData);
    //             console.log("--------");
                // return;
                $scope.tableData.clc.rowNum = newTable.jqGrid("getGridParam", "rowNum");
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
            if ($rootScope.filterForExport) {
                if ($rootScope.filterForExport.raw) {
                    delete $rootScope.filterForExport.raw;
                }
            }

            $rootScope.filterForExport = _.isEmpty($rootScope.filterForExport) ? [] : $scope.processDateFilters($rootScope.filterForExport);
            var json = {
                app: app,
                screen: screen,
                action: icon.action,
                colModel: Object.values(Elements.table)[0].jqGrid("getGridParam", "colModel"),
                search: vm.general_search_terms,
                pageFilters: $rootScope.filterForExport ,
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

            if ($scope.currentList == 'contractscontract') {
                if (typeof(contract_list_columns) == 'undefined') { var contract_list_columns = []; }
                for(var i = 0; i < $filtersData.filterColumns.length; i++) {
                    if($filtersData.filterColumns[i].columnRoute == 'contracts/contract') {
                        contract_list_columns.push($filtersData.filterColumns[i]);
                    }
                }

                for(var i = 0; i < json.colModel.length; i++) {
                    for(var j = 0; j < contract_list_columns.length; j++) {
                        if(json.colModel[i].name.toLowerCase().replace('.', '_') === contract_list_columns[j].columnValue.toLowerCase()) {
                            json.colModel[i].columnType = contract_list_columns[j].columnType;
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

            setTimeout(function() {
                if (typeof $(".jqgrid_component>.ui-jqgrid").attr("id") != "undefined") {
                    var table_id = $(".jqgrid_component>.ui-jqgrid")
                        .attr("id")
                        .replace("gbox_", "");
                }
                if (Elements.settings[table_id]) {
                    Elements.settings[table_id].source.on_general_search(val);
                }
            });

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

        function array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr; // for testing
        };
        vm.getScreenActions = function() {
            var data = {
                app: vm.app_id,
                screen: vm.screen_id
            };
            console.log("email preview req data", data);


            $rootScope.$watchGroup(["formValuesLoaded", "screenLayoutData"], function(newVal, oldVal) {
            	if (newVal[0] && newVal[1]) {
            		var screenLayoutActions = newVal[1].screenButtons;
            		console.log("BOTH LOADED")
                    if (screenLayoutActions) {
                        var screenButtons = [];

                        console.log("email preview response ", screenLayoutActions);
                        $.each(screenLayoutActions, function(key, value) {
                            if (value.isCrosschekRequired == false) {
                                if (vm.app_id == "invoices") {
                                    var obj = vm.mapInvoiceActions(value, false);
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
                            if (value.mappedScreenActionName == "ApproveInvoice") {
                                approveInvoiceIndex = key;
                            }
                        });
                    } else {
                        toastr.error("An error has occured!");
                    }

                    if (approveInvoiceIndex) {
                        screenButtons = array_move(screenButtons, approveInvoiceIndex, 0);
                    }
                    $scope.screenButtons = screenButtons;
                    $rootScope.screenButtons = screenButtons;
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

        jQuery(document).ready(function($){
            $(document).on('mouseenter', 'td[data-original-title] , .treasury-datepicker-input', function(){
                if ($(this).attr("data-original-title") != "" && $(this).attr("data-original-title") != " ") {
                    $(this).tooltip({container:'body'}).tooltip("show");
                } else {
                    $(this).tooltip("hide");
                    $(this).removeAttr("data-original-title");
                    // $(this).tooltip("dispose");
                }
                if ($(this).hasClass("treasury-datepicker-input") || $(this).parents("treasury-datepicker-input").length > 0) {
                    $(this).attr('data-original-title', $(this).children("input").val())
                      .tooltip('fixTitle')
                      .tooltip('show');
                }
            })

			$(document).on('keydown', function(e) {
				var keyCode = e.keyCode || e.which;
				if (keyCode == 9 ) {
					// e.preventDefault();
					if ($(document.activeElement).parents(".ui-jqgrid-bdiv").length > 0) {
						$(".ui-jqgrid-bdiv > div").css("float", "right");
						setTimeout(function(){
							$(".ui-jqgrid-bdiv > div").css("float", "left");
							setTimeout(function(){
								// $(document.activeElement)[0].scrollIntoViewIfNeeded()
								// $(".ui-jqgrid-view").animate(
								// 	{
								// 		scrollLeft : $(document.activeElement).offset().left - 250
								// 	},200
								// )
								var computedScrollLeft = 0;
								// setTimeout(function(){
									if ($(document.activeElement).offset().left > $(document.activeElement).parents(".ui-jqgrid-view").width() ||
										$(document.activeElement).offset().left < $(document.activeElement).parents(".ui-jqgrid-view").width()/2
										) {
										computedScrollLeft = $(document.activeElement).position().left - $(document.activeElement).parents(".ui-jqgrid-view").width()/4;
										// computedScrollLeft = $(document.activeElement).parents(".ui-jqgrid-view").width()/2;
									}
								// },50)
								// setTimeout(function(){
									// console.log($(document.activeElement));
									// console.log("left", $(document.activeElement).position().left);
									// console.log(computedScrollLeft);
									if (computedScrollLeft > 0) {
										$(".ui-jqgrid-view").scrollLeft(computedScrollLeft);
									}
								// },100)
							},250)
							// $(document.activeElement).offset().left
							// $(document.activeElement)[0].scrollIntoView();
						})
					}
				}
			});


        })

        vm.isHierarchicalMasterList = function() {
            var listScreens = ["counterparty", "location", "buyer", "strategy", "service", "product", "company"];
            if (listScreens.indexOf(vm.screen_id) != -1 &&
            	window.location.href.endsWith(vm.screen_id)) {
                return true;
            }
            return false;
        }

        vm.checkIfIsDelivery =  function() {
            if (window.location.href.indexOf('delivery/delivery/') != -1 )  {
                return true;
            }
            return false;
        }

        vm.checkIfIsContract = function() {
            if (window.location.href.indexOf('contracts/contract') != -1) {
                return true;
            }
            return false;
        }

        vm.checkIfIsInvoice = function() {
            if (window.location.href.indexOf('invoices/invoice') != -1) {
                return true;
            }
            return false;
        }


        /*GET SCREEN ACTIONS*/
        //     $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
        //    $('clc-table-list').remove()
        // });
    }
]);
