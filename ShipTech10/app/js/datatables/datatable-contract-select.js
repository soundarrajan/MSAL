var ContractSelectDataTable = function () {

    var initTable = function (options) {
        var table = $(options.selector);

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
retrieve: true,
            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // Initialize scrollY to any value to achieve fixed header effect.
            // scrollY: 0,

            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [
                        {
                            extend: 'colvis',
                            text: '<i class="fa fa-2x fa-gear"></i>',
                            columns: options.colvisColumns
                        }
            ],

            dom: options.dom,

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: false,

            bAutoWidth: false,

            pagingType: 'input',

            // setup colreorder extension: http://datatables.net/extensions/colreorder/
            colReorder: {
                reorderCallback: function () {
                    console.log( 'callback' );
                }
            },

            columnDefs: options.columnDefs,

            "order": [
                [1, 'asc']
            ],

            "lengthMenu": [
                [25, 50, 100, -1],
                [25, 50, 100, 'All'] // change per page values here
            ],
            // set the initial value
            "pageLength": 25,

            // "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "initComplete": function(settings) {
            }
        });

        return oTable;
    };

    return {

        //main function to initiate the module
        init: function (options) {

            if (!jQuery().dataTable) {
                return;
            }

            return initTable(options);
        }

    };

}();