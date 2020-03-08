var ScheduleDashboardDataTable = (function() {
    let initTable = function(options) {
        let table = $(options.selector);

        let oTable = table.DataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            language: {
                aria: {
                    sortAscending: ': activate to sort column ascending',
                    sortDescending: ': activate to sort column descending'
                },
                emptyTable: 'No data available in table',
                info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                infoEmpty: 'No entries found',
                infoFiltered: '(filtered1 from _MAX_ total entries)',
                lengthMenu: '_MENU_ entries',
                search: 'Search:',
                zeroRecords: 'No matching records found',
                paginate: {
                    previous: '&lt;',
                    next: '&gt;'
                }
            },
            retrieve: true,
            // Or you can use remote translation file
            // "language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            // },

            // Initialize scrollY to any value to achieve fixed header effect.
            scrollY: false,
            scrollX: true,

            dom: options.dom,

            // setup buttons extension: http://datatables.net/extensions/buttons/
            buttons: [
                {
                    extend: 'colvis',
                    text: '<i class="fa fa-2x fa-gear"></i>',
                    columns: options.colvisColumns
                }
            ],
            lengthMenu: [
                [ 25, 50, 100, -1 ],
                [ 25, 50, 100, 'All' ] // change per page values here
            ],
            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: false,

            bAutoWidth: false,

            pagingType: 'input',

            pageLength: options.pageLength,

            order: options.order,


            columnDefs: options.columnDefs,


            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function() {
                    // console.log('cols reordered');
                }
            },

            colResize: options.colResize,

            columnDefs: options.columnDefs,


            // "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            // "dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",


        });

        return oTable;
    };

    /**
    * Resets a fixed-header datatable height.
    * Source: http://stackoverflow.com/a/11122153
    */
    function resizeScrollContainer(table, settings) {
        let height = calcTableHeight();

        $('div.dataTables_scrollBody').css('height', height);

        setTimeout(() => {
            table.fnAdjustColumnSizing();
        }, 10);
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

        // var bias = 250;
        // return $(window).height() - getHeaderHeight() - getFooterHeight() - getContentMenuHeight() - bias;

        let height = 1;

        $('#schedule_dashboard_table').find('TR').each((index, element) => {
            height = height + $(element).outerHeight(true);
            if(index > 10) {
                return false;
            }
        });

        return height;
    }


    return {

        // main function to initiate the module
        init: function(options) {
            if (!jQuery().dataTable) {
                return;
            }

            return initTable(options);
        }

    };
}());
