var NewOrderProductsDatatable = function () {

    var initTable = function () {
        var table = $('#new_order_products');

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


            // setup buttons extentension: http://datatables.net/extensions/buttons/
            buttons: [],

            // setup responsive extension: http://datatables.net/extensions/responsive/
            responsive: false,

            bAutoWidth: false,

            "order": [[ 2, "desc" ]],

            pagingType: 'input',

            // set the initial value
            "paging": false,

            "searching": false,

            "info": false,

            // set the initial value
            "pageLength": 25,

            "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

            "initComplete": function(settings) {
                var table =  this;

                resizeScrollContainer(table, settings);

                $(window).resize(function(){
                    resizeScrollContainer(table, settings);
                });
            }
        });

        return oTable;
    };

    /**
    * Resets a fixed-header datatable height.
    * Source: http://stackoverflow.com/a/11122153
    */
    function resizeScrollContainer(table, settings) {
        var height = calcTableHeight();

        $('div.dataTables_scrollBody').css('height', height);

        setTimeout(function() { table.fnAdjustColumnSizing(); }, 10);
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
        init: function () {

            if (!jQuery().dataTable) {
                return;
            }

            return initTable();
        }

    };

}();
