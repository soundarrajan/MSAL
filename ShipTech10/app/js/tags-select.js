var TagsSelect = function() {

    var tagsSelect = function(options) {

        // Set the "bootstrap" theme as the default theme for all Select2
        // widgets.
        //
        // @see https://github.com/select2/select2/issues/2927
        $.fn.select2.defaults.set("theme", "bootstrap");

        $(options.selector).select2({
            placeholder: options.placeholder,        
            width: null,
            containerCss: {"min-width": "200px"},
            dir: options.dir
        });

    };

    return {

        init: function(options) {
            tagsSelect(options);
        }

    };

}();
