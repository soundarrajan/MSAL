angular.module('shiptech.pages').controller('AllRequestsTableController', [ '$scope', '$element', '$attrs', '$timeout', '$filter', '$state', '$window', '$location', 'STATE', 'uiApiModel', 'groupOfRequestsModel', 'requestListTableModel', 'tenantService', 'scheduleDashboardStatusResource', 'tenantScheduleDashboardConfiguration', 'SCREEN_LAYOUTS', 'EXPORT_FILETYPE', 'EXPORT_FILETYPE_EXTENSION', 'CUSTOM_EVENTS',
    function($scope, $element, $attrs, $timeout, $filter, $state, $window, $location, STATE, uiApiModel, groupOfRequestsModel, requestListTableModel, tenantService, scheduleDashboardStatusResource, tenantScheduleDashboardConfiguration, SCREEN_LAYOUTS, EXPORT_FILETYPE, EXPORT_FILETYPE_EXTENSION, CUSTOM_EVENTS) {
        //      var tableSelector = '#all_requests_table';
        // $scope.Math = window.Math;
        $scope.STATE = STATE;
        let ctrl = this;
        //      $state.params.title = "All requests"
        //      ctrl.settings = null;
        //      ctrl.buttonsDisabled = false;
        ctrl.tableData = {};
        //      ctrl.tableOptions.order = [
        //          [2, 'desc']
        //      ];
        //      ctrl.tableOptions.pageLength = 25;
        //      ctrl.tableOptions.paginationStart = 0;
        //      ctrl.tableOptions.currentPage = 1;
        //      ctrl.tableOptions.totalRows = 0;
        //      ctrl.tableOptions.searchTerm = null;
        ctrl.proceedRequest = null;
        // ctrl.selectedRequests = null;
        ctrl.EXPORT_FILETYPE = EXPORT_FILETYPE;
        tenantService.tenantSettings.then((settings) => {
            window.tenantFormatsDateFormat = settings.payload.tenantFormats.dateFormat.name;
        });
        //
        //
        // console.log(STATE)

        $scope.$on('proceedFromRequestList', (e, payload) => {
            // console.log(JSON.parse(decodeURIComponent(payload)))
            ctrl.setProceedRequest(JSON.parse(decodeURIComponent(payload)));
        });
        $scope.$on('tableLoaded', (e, payload) => {
            // console.log(payload)
            ctrl.tableData = payload;

            $(`#${ ctrl.tableData.table}`).click((e) => {
                var selected = $(`#${ ctrl.tableData.table}`).jqGrid('getGridParam').selarrrow;
                var clicked = $(`#${ ctrl.tableData.table}`).jqGrid('getGridParam').selrow;
                var tableRowIndex = $(e.target).parents('tr').attr('id');
                var clickedRowData = ctrl.tableData.tableData.rows[tableRowIndex - 1];
                if (!$(e.target).is('input[type=checkbox]')) {
                    return;
                }
                if (!selected) {
                    return;
                }
                console.log($(e.target).prop('checked'));

                if (typeof ctrl.selectedRequests == 'undefined') {
                    ctrl.selectedRequests = [];
                }

                for (let i = selected.length - 1; i >= 0; i--) {
                    var sv = selected[i];
                    if (!$(e.target).prop('checked') && (ctrl.tableData.tableData.rows[Number(sv) - 1].requestId == clickedRowData.requestId)) {
                        selected.splice(i, 1);
                    }
                }

                $scope.$apply(() => {
                    ctrl.selectedRequestsRows = [];
                    ctrl.selectedRequestsRows = ctrl.checkSelected(selected, clicked);
                    if (ctrl.selectedRequestsRows) {
                        ctrl.selectedRequests = createRequestIdsModel(ctrl.selectedRequestsRows);
                    }
                });
                console.log(ctrl.selectedRequestsRows);
            });
        });
        ctrl.checkSelected = function(selected, clicked) {
            var selectedRequests = [];
            $(`#${ ctrl.tableData.table}`).jqGrid('resetSelection');
            $(`#${ ctrl.tableData.table } tr[aria-selected='true'] input`).removeAttr('checked');
            $(`#${ ctrl.tableData.table } tr`).attr('aria-selected', 'false');
            $(`#${ ctrl.tableData.table } tr`).removeClass('ui-state-highlight');
            // setTimeout(function(){
            $.each(selected, (sk, sv) => {
                selectedRequests.push(ctrl.tableData.tableData.rows[Number(sv) - 1]);
            });
            var all = [];
            $.each(ctrl.tableData.tableData.rows, (k, v) => {
                if (_.findIndex(selectedRequests, (o) => {
                    return o.requestId == v.requestId;
                }) >= 0) {
                    $(`#${ ctrl.tableData.table}`).jqGrid('setSelection', k + 1);
                    all.push(v);
                }
            });
            return all;
            // },200)
            // console.log(selected)
        };
        // ctrl.checkInTable = function(checkedRows) {
        //     $("#" + ctrl.tableData.table).jqGrid('resetSelection')
        //     $.each(checkedRows, function(k, v) {
        //         $("#" + ctrl.tableData.table).jqGrid('setSelection', Number(v) + 1);
        //     })
        // ctrl.saveTableLayout = function() {
        //     newColModel = $("#flat_requests_list").jqGrid('getGridParam', 'colModel');
        //     payload = []
        //     $.each(newColModel, function(k, v) {
        //         if (!v.exclude && v.label) {
        //             payload.push(v)
        //         }
        //     })
        //     ctrl.tableData.layout.clc.colModel = [];
        //     ctrl.tableData.layout.clc.colModel = payload;
        //     uiApiModel.saveListLayout('all-requests-table', ctrl.tableData.layout).then(function(data) {
        //         if (data.isSuccess) {
        //             toastr.success('Layout successfully saved');
        //         }
        //     })
        // }
        //      $scope.$on('filters-applied', function(event, payload) {
        //          ctrl.tableOptions.filters = payload;
        //          requestListTableModel.getTable(null, null, payload, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //              destroyDataTable();
        //              ctrl.tableData = server_data.payload;
        //              $timeout(function() {
        //                  ctrl.table = initDataTable(tableSelector, ctrl.settings.Requests);
        //                  var info = ctrl.table.page.info();
        //                  setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
        //                  ctrl.tableOptions.totalRows = server_data.matchedCount;
        //                  handleTableEvents();
        //              });
        //          });
        //      })
        //      //handler for filtering on request status
        //      $scope.$on(CUSTOM_EVENTS.NOTIFICATION_RECEIVED, function(event, notification) {
        //          var requestNotification = null;
        //          for (var i = 0; i < notification.length; i++) {
        //              requestNotification = notification[i];
        //              for (var j = 0; j < ctrl.tableData.length; j++) {
        //                  if (ctrl.tableData[j].requestId == requestNotification.RequestId) {
        //                      ctrl.tableData[j].notificationCount = requestNotification.TotalNoOfUnreadOffers;
        //                  }
        //              }
        //          }
        //      });
        //      $scope.search = function(value) {
        //          ctrl.tableOptions.searchTerm = value;
        // var neworder = angular.copy(ctrl.table.order().slice(0));
        //          var tableOrder;
        //          var tablePagination = {};
        //          tablePagination.start = 0;
        //          tablePagination.length = ctrl.tableOptions.pageLength;
        //          tableOrder = normalizeDatatablesOrder(neworder);
        //          // setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
        //          //
        //          // getTable(order, pagination, filters, search)
        //          requestListTableModel.getTable(tableOrder, tablePagination, ctrl.tableOptions.filters, value).then(function(server_data) {
        //              destroyDataTable();
        //              ctrl.tableData = server_data.payload;
        //              $timeout(function() {
        //                  ctrl.table = initDataTable(tableSelector, ctrl.settings.Requests);
        //                  var info = ctrl.table.page.info();
        //            setTableVars(ctrl.tableOptions.pageLength, tablePagination.start, ctrl.tableOptions.order);
        //                  // setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
        //                  ctrl.tableOptions.totalRows = server_data.matchedCount;
        //                  handleTableEvents();
        //              });
        //          });
        //          // ctrl.tableOptions.searchTerm = null;
        //      }
        //      // Get the UI settings from server. When complete, get business data.
        //      uiApiModel.get( /*SCREEN_LAYOUTS.REQUEST_LIST*/ ).then(function(data) {
        //          ctrl.ui = data;
        //          ctrl.settings = normalizeJSONDataTables(ctrl.ui);
        //          requestListTableModel.getTable(null, null,null,null).then(function(server_data) {
        //              ctrl.tableData = server_data.payload;
        //              // Initalize the selected IDs model.
        //              ctrl.selectedRequests = createRequestIdsModel(ctrl.tableData);
        //              //reset notifications model to watch received requests
        //              notificationsModel.stop();
        //              notificationsModel.start(Object.keys(ctrl.selectedRequests));
        //              $timeout(function() {
        //                  console.log(ctrl.settings)
        //                  ctrl.table = initDataTable(tableSelector, ctrl.settings.Requests);
        //                  var info = ctrl.table.page.info();
        //                  setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
        //                  ctrl.tableOptions.totalRows = server_data.matchedCount;
        //                  handleTableEvents();
        //              });
        //          });
        //      });
        //      /**
        //       * Change datatable order to match server required format.
        //       * @param {Array} datatablesOrderArray - The order format from datatables.
        //       * @return {Object} - normalized object representing a human-readable table order
        //       */
        //      function normalizeDatatablesOrder(datatablesOrderArray) {
        //          var tableOrder = {};
        //          datatablesOrderArray = datatablesOrderArray[0];
        //          tableOrder.column = $(ctrl.table.column(datatablesOrderArray[0]).header()).data('columnName');
        //          tableOrder.order = datatablesOrderArray[1];
        //          return tableOrder;
        //      }
        //      /**
        //       * Extracts requests IDs from the payload into an object with the IDs as keys.
        //       * This is used to keep track of the selected request IDs in the template.
        //       * @param {Object} data - The full data object as received from server.
        //       * @return {Object} An object in which the keys are the request IDs and the values
        //       *   are booleans reflecting the selected state of the request (the checked state of
        //       *   the respective checkbox).
        //       */
        function createRequestIdsModel(data) {
            let result = {};
            for (let i = 0; i < data.length; i++) {
                result[data[i].requestId] = true;
            }
            return result;
        }
        //      *
        //       * Set table parameters
        //       * @param {int} length - count of items on each page of the table.
        //       * @param {int} start - item number start of current page of the table.
        //       * @param {Object} order - sort order of the table.
        //      function setTableVars(length, start, order) {
        //          if (typeof length != 'undefined' && length !== null) {
        //              ctrl.tableOptions.pageLength = length;
        //          }
        //          if (typeof start != 'undefined' && start !== null) {
        //              ctrl.tableOptions.paginationStart = start;
        //          }
        //          if (typeof order != 'undefined' && order !== null) {
        //              ctrl.tableOptions.order = order;
        //          }
        //          ctrl.tableOptions.currentPage = ctrl.tableOptions.paginationStart / ctrl.tableOptions.pageLength + 1;
        //      }
        //      /**
        //       * Go to table page taking into account current table options
        //       * @param {int} page - page to switch to.
        //       */
        //      ctrl.setPage = function(page) {
        //          if (page < 1 || page > ctrl.tableOptions.totalRows / ctrl.tableOptions.pageLength + 1) {
        //              return false;
        //          }
        //          var tablePagination = {};
        //          tablePagination.start = (page - 1) * ctrl.tableOptions.pageLength;
        //          tablePagination.length = ctrl.tableOptions.pageLength;
        //          tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
        //          setTableVars(tablePagination.length, tablePagination.start);
        //          requestListTableModel.getTable(tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //              destroyDataTable();
        //              ctrl.tableData = server_data.payload;
        //              ctrl.selectedRequests = createRequestIdsModel(ctrl.tableData);
        //              notificationsModel.stop();
        //              notificationsModel.start(Object.keys(ctrl.selectedRequests));
        //              $timeout(function() {
        //                  ctrl.table = initDataTable(tableSelector, ctrl.settings.Requests);
        //                  handleTableEvents();
        //              });
        //          });
        //      };
        //      /**
        //       * Initializes all user events on the table (pagination, sorting, searching)
        //       */
        //      function handleTableEvents() {
        //          var table = $(tableSelector);
        //          table.on('order.dt', function(e) {
        //              var neworder = angular.copy(ctrl.table.order().slice(0));
        //              var tableOrder;
        //              var tablePagination = {};
        //              tablePagination.start = 0;
        //              tablePagination.length = ctrl.tableOptions.pageLength;
        //              tableOrder = normalizeDatatablesOrder(neworder);
        //              ctrl.setPage(ctrl.tableOptions.currentPage);
        //              // requestListTableModel.getTable(tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //              //     destroyDataTable();
        //              //     ctrl.tableData = server_data.payload;
        //              //     ctrl.selectedRequests = createRequestIdsModel(ctrl.tableData);
        //              //     notificationsModel.stop();
        //              //     notificationsModel.start(Object.keys(ctrl.selectedRequests));
        //              //     setTableVars(ctrl.tableOptions.pageLength, 0, neworder);
        //              //         // ctrl.table = initDataTable(tableSelector, ctrl.settings.Requests);
        //              //         handleTableEvents();
        //              //     // $timeout(function() {
        //              //     // });
        //              // });
        //          });
        //          table.on('length.dt', function(e, settings, len) {
        //              var info = ctrl.table.page.info();
        //              var tablePagination = {};
        //              tablePagination.start = info.start;
        //              tablePagination.length = len;
        //              ctrl.tableOptions.pageLength = len;
        //              tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
        //              setTableVars(tablePagination.length, tablePagination.start);
        //              requestListTableModel.getTable(tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //                  destroyDataTable();
        //                  ctrl.tableData = server_data.payload;
        //                  // Initalize the selected IDs model.
        //                  ctrl.selectedRequests = createRequestIdsModel(ctrl.tableData);
        //                  notificationsModel.stop();
        //                  notificationsModel.start(Object.keys(ctrl.selectedRequests));
        //                  $timeout(function() {
        //                      ctrl.table = initDataTable(tableSelector, ctrl.settings.Requests);
        //                      handleTableEvents();
        //                  });
        //              });
        //          });
        //      }
        //      function destroyDataTable(clearHtml) {
        //          if (ctrl.table) {
        //              ctrl.table.off('order.dt');
        //              ctrl.table.off('length.dt');
        //              if (clearHtml) {
        //                  ctrl.table.destroy(true);
        //              } else {
        //                  ctrl.table.destroy();
        //              }
        //              ctrl.table = null;
        //          }
        //      }
        //      /**
        //       * Initializes the All Requests Table datatable.
        //       * @param {JSON} - The settings to use for DataTable initialization.
        //       * Must be JSON-normalized to the DataTables settings format!
        //       * @return {Object} - The resulting DataTable object.
        //       */
        //      function initDataTable(selector, settings) {
        //          // Bind and initialize the DataTable.
        //          var table = AllRequestsDataTable.init({
        //              selector: selector,
        //              columnDefs: settings.columnDefs,
        //              colvisColumns: settings.colvisColumns,
        //              dom: 'Bflrt',
        //              pageLength: ctrl.tableOptions.pageLength,
        //              order: ctrl.tableOptions.order
        //          });
        //          // Re-place (move) the datatable searchbox in the main content menu, as per spec.
        //          replaceDataTableSearchBox('#all_requests_table_filter');
        //          return table;
        //      }
        /** **********************************************************************************
         *   EVENT HANDLERS
         ************************************************************************************/
        ctrl.setProceedRequest = function(request) {
            ctrl.proceedRequest = request;
        };
        ctrl.groupRequests = function() {
            let selectedRequestIds = [];
            Object.keys(ctrl.selectedRequests).forEach((key) => {
                if (ctrl.selectedRequests[key]) {
                    selectedRequestIds.push(key);
                }
                return;
            });
            ctrl.buttonsDisabled = true;
            groupOfRequestsModel.groupRequests(selectedRequestIds).then((data) => {
                ctrl.buttonsDisabled = false;
                // TODO: change way we get groupID
                // var requestGroupId = data.payload[0].requestGroup.id;
                // $state.go(STATE.GROUP_OF_REQUESTS, {
                //     groupId: requestGroupId
                // });
                window.open($location.$$absUrl.replace('#'+$location.$$path,
                        'v2/group-of-requests/'+ data.groupId +'/'+ selectedRequestIds[0]), '_self');
            }, () => {
                ctrl.buttonsDisabled = false;
            });
        };
        ctrl.isGroupButtonDisabled = function() {
            let request;
            let isGrouped = false;
            let noRequestsSelected = true;
            if (ctrl.selectedRequests) {
                Object.keys(ctrl.selectedRequests).forEach((key) => {
                    if (ctrl.selectedRequests[key]) {
                        noRequestsSelected = false;
                        request = $filter('filter')(ctrl.tableData.tableData.rows, {
                            requestId: key
                        })[0];
                        if (request && request.requestGroupId !== null) {
                            isGrouped = true;
                        }
                    }
                    return;
                });
            }
            return noRequestsSelected || isGrouped;
        };
        ctrl.goToRequest = function(requestID) {
            let href = $state.href(STATE.EDIT_REQUEST, {
                requestId: requestID
            }, {
                absolute: false
            });
            $window.open(href, '_blank');
        };
        ctrl.goToGroupOfRequests = function(groupID) {
            let href = $state.href(STATE.GROUP_OF_REQUESTS, {
                groupId: groupID
            }, {
                absolute: false
            });
            $window.open(href, '_self');
        };
        ctrl.gotoNewRequest = function() {
            let href = $state.href(STATE.NEW_REQUEST);
            $window.open(href, '_self');
        };
        ctrl.prepareTableForPrint = function(tableWidth) {
            let beforePrint = function(tableWidth) {
                if ($('clc-table-list')) {
                    // 1017px = default page landscape width
                    // var tableWidth = $('clc-table-list').width();
                    // console.log('clc-table-list',tableWidth);
                    let percentWidth = 101700 / tableWidth;
                    console.log('proc', percentWidth);
                    if (percentWidth < 100) {
                        // resize only when print is smaller
                        var zoomP = `${100 - parseFloat(percentWidth).toFixed(2) }%`;
                        $('div.inside_content ui-view').css('zoom', zoomP);
                    }
                }
            };
            let afterPrint = function() {
                $('div.inside_content ui-view').css('zoom', '100%');
            };
            if ('matchMedia' in window) {
                window.matchMedia('print').addListener((media) => {
                    // matches is true before print and false after
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
        ctrl.export = function(fileType) {
            if (fileType == 0) {
                let tableWidth = $('#gview_flat_requests_list').width();
                ctrl.prepareTableForPrint(tableWidth);
                window.print();
                return;
            }
            let tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
            let tableColumnList = ctrl.table.columns();
            let columns = [];
            let columnData = {};
            for (let i = 0; i < tableColumnList[0].length; i++) {
                if (ctrl.table.columns(i).visible()[0]) {
                    columnData = {};
                    columnData.DtoPath = $(ctrl.table.column(i).header()).data('dtoPath');
                    columnData.Label = $(ctrl.table.column(i).header()).text().trim();
                    if (columnData.Label !== '' && columnData.DtoPath) {
                        columns.push(columnData);
                    }
                }
            }
            let tablePagination = {};
            tablePagination.start = (ctrl.tableOptions.currentPage - 1) * ctrl.tableOptions.pageLength;
            tablePagination.length = ctrl.tableOptions.pageLength;
            requestListTableModel.exportList(tableOrder, tablePagination, columns, fileType, ctrl.tableOptions.filters, ctrl.tableOptions.search).then((result) => {
                if (!result) {
                    return false;
                }
                if (!result.filename) {
                    result.filename = `Request.${ EXPORT_FILETYPE_EXTENSION[fileType]}`;
                }
                let blob = new Blob([ result.data ]);
                saveAs(blob, result.filename);
            });
        };
        ctrl.setLastOfferArgs = function(request) {
            ctrl.lastOfferArgs = {
                product: {
                    id: request.productId,
                    name: request.productName
                },
                seller: null
            };
        };
        ctrl.getStatuses = function() {
        	setTimeout(() => {
        		// $scope.statuses = tenantModel.getScheduleDashboardConfiguration().payload.labels;
        		if (!window.scheduleDashboardConfiguration) {
		            let requestData = {
		                Payload: true
		            };

                    return tenantScheduleDashboardConfiguration.get(requestData).$promise.then((data) => {
                        window.scheduleDashboardConfiguration = data;
					 //    scheduleDashboardConfiguration = data;
					 //    return data;
					    ctrl.statuses = data.payload.labels;
                    });
        		}
				    ctrl.statuses = window.scheduleDashboardConfiguration.payload.labels;
        	}, 550);
        };
        ctrl.getStatuses();
        ctrl.getStatusColor = function(statusName) {
            var statusColor = '#fff';
            $.each(ctrl.statuses, (k, v) => {
                if (v.status.name == statusName) {
                    statusColor = v.colorCode;
                }
            });
            return statusColor;
        };

        /** **********************************************************************************
         *   END EVENT HANDLERS
         ************************************************************************************/
    }
]);

angular.module('shiptech.pages').component('allRequestsTable', {
    templateUrl: 'pages/all-requests-table/views/all-requests-table-component.html',
    controller: 'AllRequestsTableController'
});
