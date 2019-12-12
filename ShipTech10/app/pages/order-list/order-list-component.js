angular.module('shiptech.pages').controller('OrderListController', ['$scope', '$rootScope', '$element', '$attrs', '$timeout', 'uiApiModel', 'orderModel', 'STATE', 'ORDER_COMMANDS', 'screenActionsModel', 'scheduleDashboardCalendarModel', 'tenantService', 'EXPORT_FILETYPE', 'EXPORT_FILETYPE_EXTENSION', 'SCREEN_ACTIONS', '$state',
    function($scope, $rootScope, $element, $attrs, $timeout, uiApiModel, orderModel, STATE, ORDER_COMMANDS, screenActionsModel, scheduleDashboardCalendarModel, tenantService, EXPORT_FILETYPE, EXPORT_FILETYPE_EXTENSION, SCREEN_ACTIONS, $state) {
        var ctrl = this;
        $scope.Math = window.Math;
        var tableSelector = '#order_list_table';
        ctrl.STATE = STATE;
        ctrl.ORDER_COMMANDS = ORDER_COMMANDS;
        ctrl.EXPORT_FILETYPE = EXPORT_FILETYPE;
        ctrl.statusList = [];
        ctrl.SCREEN_ACTIONS = SCREEN_ACTIONS; //Stemmed;
        // ctrl.CONFIRM_BTN_ACTIVE_STATUS = null;
        ctrl.settings = null;
        ctrl.tableOptions = {};
        ctrl.tableOptions.order = [
            [0, 'asc']
        ];
        ctrl.tableOptions.pageLength = 25;
        ctrl.tableOptions.paginationStart = 0;
        ctrl.tableOptions.currentPage = 1;
        ctrl.tableOptions.totalRows = 0;
        ctrl.tableOptions.searchTerm = null;
        ctrl.buttonsDisabled = false;
        tenantService.tenantSettings.then(function(settings) {
            ctrl.numberPrecision = settings.payload.defaultValues;
            window.tenantFormatsDateFormat = settings.payload.tenantFormats.dateFormat.name;
        });
        // $scope.$on('filters-applied', function(event, payload) {
        //     ctrl.tableOptions.filters = payload;
        //     orderModel.list(null, null, payload, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //         destroyDataTable();
        //         ctrl.tableData = server_data.payload;
        //         $timeout(function() {
        //             ctrl.table = initDataTable(tableSelector, ctrl.settings);
        //             var info = ctrl.table.page.info();
        //             setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
        //             ctrl.tableOptions.totalRows = server_data.matchedCount;
        //             handleTableEvents();
        //         });
        //     });
        // })
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
        // $scope.search = function(value) {
        //     ctrl.tableOptions.searchTerm = value;
        //     var neworder = angular.copy(ctrl.table.order().slice(0));
        //     var tableOrder;
        //     var tablePagination = {};
        //     tablePagination.start = 0;
        //     tablePagination.length = ctrl.tableOptions.pageLength;
        //     tableOrder = normalizeDatatablesOrder(neworder);
        //     orderModel.list(ctrl.tableOptions.order, tablePagination, ctrl.tableOptions.filters, value).then(function(server_data) {
        //         destroyDataTable();
        //         ctrl.tableData = server_data.payload;
        //         $timeout(function() {
        //             ctrl.table = initDataTable(tableSelector, ctrl.settings);
        //             var info = ctrl.table.page.info();
        //             // setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
        //             setTableVars(ctrl.tableOptions.pageLength, tablePagination.start, ctrl.tableOptions.order);
        //             ctrl.tableOptions.totalRows = server_data.matchedCount;
        //             handleTableEvents();
        //         });
        //     });
        // }
        // ctrl.$onInit = function() {
        //     // Get the UI settings from server. When complete, get business data.
        //     uiApiModel.get( /*SCREEN_LAYOUTS.REQUEST_LIST*/ ).then(function(data) {
        //         ctrl.ui = data;
        //         ctrl.settings = normalizeJSONDataTable(ctrl.ui.Orders);
        //         scheduleDashboardCalendarModel.getStatuses().then(function(data) {
        //             if (data) {
        //                 ctrl.statusList = data.labels;
        //             }
        //             order = null;
        //             pagination = null;
        //             filters = null;
        //             search = null;
        //             uiFilters = null;
        //             orderIds = null;
        //             requestId = null;
        //                 // debugger;
        //             if ($rootScope.tempFilterOrdersFromConfirm) {
        //                 if ($rootScope.tempFilterOrdersFromConfirm.length == 1) {
        //                     requestId = $rootScope.tempFilterOrdersFromConfirm[0];
        //                 } else if ($rootScope.tempFilterOrdersFromConfirm.length > 1) {
        //                     orderIds = $rootScope.tempFilterOrdersFromConfirm.join(",")
        //                 }
        //                 console.log(requestId);
        //                 uiFilters = {
        //                     "VesselId": null,
        //                     "ProductId": null,
        //                     "LocationId": null,
        //                     "StatusId": null,
        //                     "AgreementTypeId": null,
        //                     "BuyerId": null,
        //                     "ServiceId": null,
        //                     "OrderIds": orderIds,
        //                     "RequestId": requestId
        //                 }
        //             }
        //             $rootScope.tempFilterOrdersFromConfirm = null;
        //             // if(order == null){
        //             //     //add default ordering, if no prev configuration is used
        //             //     order = {column: "Eta", order: "desc"};
        //             //     $('th[data-column-name=Eta]').addClass('ordered ordered_asc');
        //             // }
        //             // orderModel.list(order, pagination, filters, search, uiFilters).then(function(data) {
        //             //     ctrl.tableData = data.payload;
        //             //     $timeout(function() {
        //             //         ctrl.table = initDataTable(tableSelector, ctrl.settings);
        //             //         var info = ctrl.table.page.info();
        //             //         setTableVars(info.length, info.start, angular.copy(ctrl.table.order().slice(0)));
        //             //         ctrl.tableOptions.totalRows = data.matchedCount;
        //             //         handleTableEvents();
        //             //     });
        //             // });
        //         });
        //     });
        // };
        /**
         * Set table parameters
         * @param {int} length - count of items on each page of the table.
         * @param {int} start - item number start of current page of the table.
         * @param {Object} order - sort order of the table.
         */
        // function setTableVars(length, start, order) {
        //     if (typeof length != 'undefined' && length !== null) {
        //         ctrl.tableOptions.pageLength = length;
        //     }
        //     if (typeof start != 'undefined' && start !== null) {
        //         ctrl.tableOptions.paginationStart = start;
        //     }
        //     if (typeof order != 'undefined' && order !== null) {
        //         ctrl.tableOptions.order = order;
        //     }
        //     ctrl.tableOptions.currentPage = ctrl.tableOptions.paginationStart / ctrl.tableOptions.pageLength + 1;
        // }
        /**
         * Initializes the Order List Table datatable.
         * @param {JSON} - The settings to use for DataTable initialization.
         * Must be JSON-normalized to the DataTables settings format!
         * @return {Object} - The resulting DataTable object.
         */
        // function initDataTable(selector, settings) {
        //     // console.log(settings)
        //     // Bind and initialize the DataTable.
        //     var table = OrderListDatatable.init({
        //         selector: selector,
        //         columnDefs: settings.columnDefs,
        //         fixedColumns: true,
        //         colvisColumns: settings.colvisColumns,
        //         dom: 'Bflrt',
        //         pageLength: ctrl.tableOptions.pageLength,
        //         order: []
        //     });
        //     // Re-place (move) the datatable searchbox in the main content menu, as per spec.
        //     replaceDataTableSearchBox('#order_list_table_filter');
        //     return table;
        // }
        // function destroyDataTable(clearHtml) {
        //     if (ctrl.table) {
        //         ctrl.table.off('order.dt');
        //         ctrl.table.off('length.dt');
        //         if (clearHtml) {
        //             ctrl.table.destroy(true);
        //         } else {
        //             ctrl.table.destroy();
        //         }
        //         ctrl.table = null;
        //     }
        // }
        /**
         * Go to table page taking into account current table options
         * @param {int} page - page to switch to.
         */
        // ctrl.setPage = function(page) {
        //     if (page < 1 || page > ctrl.tableOptions.totalRows / ctrl.tableOptions.pageLength + 1) {
        //         return false;
        //     }
        //     var tablePagination = {};
        //     tablePagination.start = (page - 1) * ctrl.tableOptions.pageLength;
        //     tablePagination.length = ctrl.tableOptions.pageLength;
        //     tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
        //     setTableVars(tablePagination.length, tablePagination.start);
        //     orderModel.list(tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //         destroyDataTable();
        //         ctrl.tableData = server_data.payload;
        //         $timeout(function() {
        //             ctrl.table = initDataTable(tableSelector, ctrl.settings);
        //             handleTableEvents();
        //         });
        //     });
        // };
        // /**
        //  * Change datatable order to match server required format.
        //  * @param {Array} datatablesOrderArray - The order format from datatables.
        //  * @return {Object} - normalized object representing a human-readable table order
        //  */
        // function normalizeDatatablesOrder(datatablesOrderArray) {
        //     var tableOrder = {};
        //     if (datatablesOrderArray.length > 0) {
        //         datatablesOrderArray = datatablesOrderArray[0];
        //         tableOrder.column = $(ctrl.table.column(datatablesOrderArray[0]).header()).data('columnName');
        //         tableOrder.order = datatablesOrderArray[1];
        //     }
        //     return tableOrder;
        // }
        $scope.$on('confirmOrder', function(e, payload) {
            // ctrl.confirmOrder = function(orderId) {

            $('a[name="confirm"]').addClass('disabled');
            orderModel.sendOrderCommand(ctrl.ORDER_COMMANDS.CONFIRMONLY, payload).then(function(data) {
                $('a[name="confirm"]').removeClass('disabled');
                $("#flat_orders_list").jqGrid.table_config.on_page_change({
                    page: $('.paginate_input').val()
                });
            }, function() {
                $('a[name="confirm"]').removeClass('disabled');
            });
        });
        // })
        $scope.$on('reconfirmOrder', function(e, data) {
            // ctrl.reconfirmOrder = function(orderId) {
            payload = {"id": data};
            $('a[name="reconfirm"]').addClass('disabled');
            orderModel.sendOrderCommand(ctrl.ORDER_COMMANDS.RECONFIRM, payload).then(function(data) {
                $('a[name="reconfirm"]').removeClass('disabled');
                $("#flat_orders_list").jqGrid.table_config.on_page_change({
                    page: $('.paginate_input').val()
                });
            }, function() {
                $('a[name="reconfirm"]').removeClass('disabled');
            });
            // };
        });
        /**
         * Initializes all user events on the table (pagination, sorting, searching)
         */
        // function handleTableEvents() {
        //     var table = $(tableSelector);
        //     table.on('order.dt', function(e) {
        //         // table.dataTable().fnClearTable();
        //         setTimeout(function() {
        //             var neworder = angular.copy(ctrl.table.order().slice(0));
        //             // console.log(neworder)
        //             var tableOrder;
        //             var tablePagination = {};
        //             tablePagination.start = 0;
        //             tablePagination.length = ctrl.tableOptions.pageLength;
        //             tableOrder = normalizeDatatablesOrder(neworder);
        //             console.log(tableOrder.column);
        //             if (tableOrder.column.indexOf(',') == -1) {
        //                 if ($('th[data-column-name=' + tableOrder.column + ']').hasClass('ordered') == true) {
        //                     if ($('th[data-column-name=' + tableOrder.column + ']').hasClass('ordered_asc') == true) {
        //                         tableOrder.order = 'desc';
        //                         $('th[data-column-name=' + tableOrder.column + ']').removeClass('ordered_asc');
        //                     } else {
        //                         tableOrder.order = 'asc';
        //                         $('th[data-column-name=' + tableOrder.column + ']').removeClass('ordered_desc');
        //                     }
        //                 } else {
        //                     $('th[data-column-name]').removeClass('ordered')
        //                 }
        //                 $('th[data-column-name=' + tableOrder.column + ']').addClass('ordered ordered_' + tableOrder.order);
        //             }
        //             orderModel.list(tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //                 // ctrl.table.clear();
        //                 destroyDataTable();
        //                 ctrl.tableData = server_data.payload;
        //                 // ctrl.table.clear();
        //                 // ctrl.table.rows.add(ctrl.tableData);
        //                 // ctrl.table.draw()
        //                 // ctrl.table.rows.add(ctrl.tableData );
        //                 // table.dataTable().fnAddData( ctrl.tableData)
        //                 // ctrl.table.draw();
        //                 // console.log(ctrl.tableData)
        //                 setTableVars(ctrl.tableOptions.pageLength, 0, neworder);
        //                 // ctrl.table.columns.adjust();
        //                 // setTimeout(function(){
        //                 //           ctrl.table.fnAdjustColumnSizing();
        //                 // },10);
        //                 $timeout(function() {
        //                     ctrl.table = initDataTable(tableSelector, ctrl.settings);
        //                     handleTableEvents();
        //                 });
        //             });
        //         }, 10);
        //         //
        //     });
        //     // table.on('search.dt', function() {
        //     //     alert('ha');
        //     // })
        //     table.on('length.dt', function(e, settings, len) {
        //         var info = ctrl.table.page.info();
        //         var tablePagination = {};
        //         tablePagination.start = info.start;
        //         tablePagination.length = len;
        //         ctrl.tableOptions.pageLength = len;
        //         tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
        //         setTableVars(tablePagination.length, tablePagination.start);
        //         orderModel.list(tableOrder, tablePagination, ctrl.tableOptions.filters, ctrl.tableOptions.searchTerm).then(function(server_data) {
        //             destroyDataTable();
        //             ctrl.tableData = server_data.payload;
        //             $timeout(function() {
        //                 ctrl.table = initDataTable(tableSelector, ctrl.settings);
        //                 handleTableEvents();
        //             });
        //         });
        //     });
        // }
        // ctrl.getColorCodeByStatusId = function(id) {
        //     colorCode = null;
        //     for (var i = 0; i < ctrl.statusList.length; i++) {
        //         if (ctrl.statusList[i].status.id === id) {
        //             colorCode = ctrl.statusList[i].colorCode;
        //         }
        //     }
        //     if (!colorCode) {
        //         colorCode = "#A3481B"
        //     }
        //     return colorCode;
        // };
        // ctrl.prepareTableForPrint = function(tableWidth) {
        //     var beforePrint = function(tableWidth) {
        //         if ($('clc-table-list')) {
        //             //1017px = default page landscape width
        //             // var tableWidth = $('clc-table-list').width();
        //             // console.log('clc-table-list',tableWidth);
        //             var percentWidth = 101700 / tableWidth;
        //             console.log('proc', percentWidth);
        //             if (percentWidth < 100) {
        //                 //resize only when print is smaller
        //                 zoomP = 100 - parseFloat(percentWidth).toFixed(2) + "%";
        //                 $('div.inside_content ui-view').css("zoom", zoomP);
        //             }
        //         }
        //     }
        //     var afterPrint = function() {
        //         $('div.inside_content ui-view').css("zoom", "100%");
        //     }
        //     if ('matchMedia' in window) {
        //         window.matchMedia('print').addListener(function(media) {
        //             //matches is true before print and false after
        //             if (media.matches) {
        //                 beforePrint(tableWidth);
        //             } else {
        //                 afterPrint();
        //             }
        //         });
        //     } else {
        //         window.onbeforeprint = function() {
        //             beforePrint();
        //         }
        //         window.onafterprint = function() {
        //             afterPrint();
        //         }
        //     }
        // }
        // ctrl.export = function(fileType) {
        //     if (fileType == 0) {
        //         var tableWidth = $('#order_list_table_wrapper').width();
        //         ctrl.prepareTableForPrint(tableWidth);
        //         window.print();
        //         return;
        //     }
        //     var tableOrder = normalizeDatatablesOrder(ctrl.tableOptions.order);
        //     var tableColumnList = ctrl.table.columns();
        //     var columns = [];
        //     var columnData = {};
        //     for (var i = 0; i < tableColumnList[0].length; i++) {
        //         if (ctrl.table.columns(i).visible()[0]) {
        //             columnData = {};
        //             columnData.DtoPath = $(ctrl.table.column(i).header()).data('dtoPath');
        //             columnData.Label = $(ctrl.table.column(i).header()).text().trim();
        //             if (columnData.Label !== "" && columnData.DtoPath) {
        //                 columns.push(columnData);
        //             }
        //         }
        //     }
        //     var tablePagination = {};
        //     tablePagination.start = (ctrl.tableOptions.currentPage - 1) * ctrl.tableOptions.pageLength;
        //     tablePagination.length = ctrl.tableOptions.pageLength;
        //     orderModel.exportList(tableOrder, tablePagination, columns, fileType, ctrl.tableOptions.filters).then(function(result) {
        //         if (!result) {
        //             return false;
        //         }
        //         if (!result.filename) {
        //             result.filename = "Order." + EXPORT_FILETYPE_EXTENSION[fileType];
        //         }
        //         var blob = new Blob([result.data]);
        //         saveAs(blob, result.filename);
        //     });
        // };
        //
        // ctrl.hasAction = function(action, row) {
        //     return screenActionsModel.hasProductAction(action, row.screenActions);
        // };
        // ctrl.canReconfirm = function(row) {
        //     canReconfirm = false
        //     if (row.allProductsAreFinalPrice) {
        //         $.each(row.screenActions, function(sak, sav) {
        //             if (sav) {
        //                 if (sav.name == "ReConfirm") {
        //                     canReconfirm = true
        //                 }
        //             }
        //         })
        //     }
        //     return canReconfirm
        // }
    }
]);
angular.module('shiptech.pages').component('orderList', {
    templateUrl: 'pages/order-list/views/order-list-component.html',
    controller: 'OrderListController'
});