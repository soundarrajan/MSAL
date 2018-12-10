/**
 * mCustomScrollbar Custom file
 * @author Liviu M. | Ascensys
 */
var MCScustom = {
    settings: {
        contract: {
            axis: 'x',
            live: true,
            theme: "light"
        },
    },
    load: function() {
        // if (window.innerHeight > 800) {
        //     height = 475
        // } else {
        //     height = 350;
        // }
        // if ($('.ui-jqgrid-bdiv').length > 0) {
        //     console.log(height)
            // $('.ui-jqgrid-bdiv').mCustomScrollbar('destroy').mCustomScrollbar({
            //     axis: 'y',
            //     live: true,
            //     // setHeight: height
            // });
        // }
        // if ($('.ui-jqgrid-view').length > 0) {
        //     $('.ui-jqgrid-view').mCustomScrollbar('destroy').mCustomScrollbar({
        //         axis: 'x',
        //         live: true,
        //     });
        // }
        if ($('.sub-menu-scroll').length > 0) {
            // $('.sub-menu-scroll').mCustomScrollbar('destroy').mCustomScrollbar({
            //     axis: 'y',
            //     setHeight: 500
            // });
        }
        if ($('.asc_jqgrid__columns-list').length > 0) {
            $('.asc_jqgrid__columns-list').mCustomScrollbar('destroy').mCustomScrollbar({
                axis: 'y',
                // setHeight: 680
            });
        }
        if ($('.filterRules').length > 0) {
            $('.filterRules').mCustomScrollbar('destroy').mCustomScrollbar({
                axis: 'y',
                // setHeight: 680
            });
        }
    },
    contract_load: function(callback) {
        $(".top-tab-section .products-tabs").mCustomScrollbar('destroy').mCustomScrollbar(this.settings.contract);
        $(".group_ContractSummary .portlet").mCustomScrollbar('destroy').mCustomScrollbar();
    },
    contract_scroll_right: function() {
        $(".top-tab-section .products-tabs").mCustomScrollbar('scrollTo', 'right');
    },
    contract_additional_costs: function() {
        $(".custom-hardcoded-table.additional-costs").mCustomScrollbar('destroy').mCustomScrollbar({
            axis: 'x',
            theme: "light-3"
        });
    }
};




