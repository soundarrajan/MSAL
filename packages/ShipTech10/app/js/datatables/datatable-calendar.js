var ScheduleDashboardCalendarDataTable = function() {
    var initTable = function(options) {
		console.warn("Datatable initStart :", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
        var table = $('#schedule_calendar_table');
        var oTable = table.DataTable({
            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found",
                "paginate": {
                    "previous": "&lt;",
                    "next": "&gt;"
                }
            },


            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},
            // Initialize scrollY to any value to achieve fixed header effect.
            // scrollY: 0,
        
            //             {
            //                 "targets": hidden_cols_left.concat(hidden_cols_right),
            //                 "visible": false
            //             },
            //             {
            //                 "targets": visible_cols,
            //                 "sortable": false
            //             }
            //         ],
            // setup buttons extentension: http://datatables.net/extensions/buttons/


            buttons: [],
            scrollX: true,
            scrollY: '450px',
            deferRender: true,
            fixedHeader: true,
            fixedColumns: {
                leftColumns: options.hiddenColumns ? 4 - options.hiddenColumns : 4,
            },
            responsive: false,
            bAutoWidth: true,
            scrollCollapse: true,
            processing: true,
            "bScrollCollapse": true,
            "bJQueryUI": false,
            "bScrollAutoCss": true,
            pagingType: 'input',
            order: [
                [0, 'asc']
            ],
            "lengthMenu": [
                [25, 50, 100, 9999],
                [25, 50, 100, "All"] // change per page values here
            ],

            
            // set the initial value
            "pageLength": options.pageLength,
            // "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
            "createdRow": options.createdRow,
            "createdCell": options.createdCell,
            "initComplete": function(settings) {
                var table = this;
                // table.fnAdjustColumnSizing(); ----------

                // jQuery('.dataTables_scrollHead').css('width', '99%'); //changing the width ------------
                // resizeScrollContainer(table, settings);
                // $(window).resize(function() {
                //     resizeScrollContainer(table, settings);
                // });
                // if (options.initComplete) {
                //     options.initComplete();
                // }
            },
            "drawCallback": function() {
                console.warn("Datatable drawCallback:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
                // jQuery('.dataTables_scrollHead').css('width', '99%'); //changing the width --------
            },
            "preDrawCallback": function() {
                // console.warn("Datatable preDrawCallback:", (new Date()).getTime() - window.scheduleDashboardCalendarModelGetEndTime );
            },
        });
        return oTable;
    };
    /**
     * Resets a fixed-header datatable height.
     * Source: http://stackoverflow.com/a/11122153
     */
    function resizeScrollContainer(table, settings) {
        // var height = calcTableHeight();
        // $('div.dataTables_scrollBody').css('height', height);
        // setTimeout(function() {
        //     table.fnAdjustColumnSizing();
        // }, 10);
    }

    function getHeaderHeight() {
        return $('.page-header').outerHeight(true);
    }

    function getContentMenuHeight() {
        return $('.st-main-content-menu').outerHeight(true);
    }

    function getFooterHeight() {
        return $('.page-footer').outerHeight(true) + $('.footer').outerHeight(true);
    }

    function calcTableHeight() {
        // This is at this stage an arbitrary value, more or less, determined by trial and error.
        // TODO: find way to calculate it accurately. Hint: probably some unaccounted-for element(s).
        var bias = 250;
        return $(window).height() - getHeaderHeight() - getFooterHeight() - getContentMenuHeight() - bias;
    }
    return {
        //main function to initiate the module
        init: function(options) {
            if (!jQuery().dataTable) {
                return;
            }
            if (typeof $('#schedule_calendar_table').val() == 'undefined') {
                return;
            }
            return initTable(options);
        }
    };
}();
jQuery(document).ready(function() {});