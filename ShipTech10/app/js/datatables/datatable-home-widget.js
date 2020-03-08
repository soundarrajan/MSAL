var HomeWidgetDatatable = (function() {
    let initTable = function(options) {
        let table = $(options.selector);

        let oTable = table.dataTable({

            paging: true,

            pagingType: 'input',

            pageLength: options.pageLength || 6,

            lengthChange: false,

            info: true,

            searching: false,

            language: {
                paginate: {
                    previous: '&lt;',
                    next: '&gt;'
                }
            },

        });

        return oTable;
    };


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
