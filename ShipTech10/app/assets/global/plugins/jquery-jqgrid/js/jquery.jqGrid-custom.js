/**
 * Ascensys Extend of jQgrid
 * @author Liviu M. @ ascensys soft
 */
$.jgrid.extend({
    table_config: {},
    Ascensys: {
        // grid is loaded
        loaded: false,
        // jqgrid data object ( all object not just rows part ^.^ )
        gridObject: {},
        gridPages: {},
        gridData: {},
        selectedProductIds: [],
        // table controls
        controls: false,
        /**
         * Load
         * load Ascensys extend of jQgrid
         * @return void
         */
        load: function() {
            if (!$(this).jqGrid.Ascensys.loaded) {
                $(this).jqGrid("Ascensys.init");
                $(this).jqGrid.Ascensys.loaded = true;
            } else {
                if ($(this).parents("clc-table-list").find("." + Cfg.class.container).length == 0) {
                    $(this).jqGrid("Ascensys.init"); // again :)
                }
            }
        },
        init: function() {
            if (typeof this.get(0) !== "undefined") {
                this.jqGrid.table_config = this.get(0).p;
                // append widget areas
                $(this).jqGrid("Ascensys.tpl.create_top_container");
                $(this).jqGrid("Ascensys.tpl.create_bottom_container");
                // load all widgets (elements)
                $.each(
                    $(this).jqGrid.Ascensys.element,
                    function(key, value) {
                        if ($(this).jqGrid.Ascensys.controls) {
                            if ($(this).jqGrid.Ascensys.controls.indexOf(key) >= 0) {
                                $(this).jqGrid("Ascensys.element." + key + ".init");
                            }
                        } else {
                            $(this).jqGrid("Ascensys.element." + key + ".init");
                        }
                    }.bind(this)
                );
                // bind actions
                $(this).jqGrid("Ascensys.bind");
                // check empty containers
                $(".asc_jqgrid__container").each(function() {
                    if ($(this).find(".col div").length == 0) {
                        $(this).addClass("empty_container");
                    }
                });
            } else {
                console.log("jqGrid Custom [Ascensys.init] ---> no table!");
            }
            // $('.jqgrid_component .jqgrow td:not(:has(span))').tooltip({ container: 'body' })
            // $('.bs-select').selectpicker('refresh')
        },
        /**
         * Store received AJAX object
         * @param  {object} data
         * @return void
         */
        storeGridObject: function(data) {
            // console.log(data)
            $(this).jqGrid.Ascensys.gridObject = data;

            $(this).jqGrid("Ascensys.element.pager.reload");
            $(this).jqGrid("Ascensys.element.info.reload");
            $(this).jqGrid("Ascensys.element.entries.reload");
        },
        setPages: function(data) {
            $(this).jqGrid.Ascensys.gridPages = data;
        },
        columnFilters: function(data) {
            // console.log(data)

			var uniqueArray = function(arrArg) {
			  return arrArg.filter(function(elem, pos,arr) {
			    return arr.indexOf(elem) == pos;
			  });
			};

            if (data && data.length > 0) {
            	removedDuplicateData = angular.copy(data);
	            $.each(removedDuplicateData, function(k,v){
	            	removedDuplicateData[k] = JSON.stringify(v);
	            })
				removedDuplicateData = _.uniqBy(removedDuplicateData, function (e) {
					return e;
				});
	            $.each(removedDuplicateData, function(k,v){
	            	removedDuplicateData[k] = JSON.parse(v);
	            })
				// datauniqueArray
	            data = removedDuplicateData;

                $(this).jqGrid.Ascensys.columnFiltersData = data;
                $(this).jqGrid("Ascensys.element.filters.init");
            } else {
                // $(this).jqGrid.Ascensys.columnFiltersData = [];
                $(this).jqGrid("Ascensys.element.filters.remove");
            }
        },
        /**
         * Select table controls
         * @param  [array] controls
         * @return void
         */
        selectControls: function(controls) {
            $(this).jqGrid.Ascensys.controls = controls;
        },
        /**
         * Structure and Element actions (TPL)
         * @type {Object}
         */
        tpl: {
            create_top_container: function() {
                $(this)
                    .parents(".ui-jqgrid")
                    .prepend(Cfg.tpl.container("top"));
            },
            create_bottom_container: function() {
                $(this)
                    .parents(".ui-jqgrid")
                    .append(Cfg.tpl.container("bottom"));
            },
            add_element: function(section, position, element) {
                $(this)
                    .parents(".ui-jqgrid")
                    .find("." + Cfg.class.container + ".section_" + section + " .col." + position)
                    .append(element);
            }
        },
        /**
         * Elements
         * @type {Object}
         */
        element: {
            pager: {
                init: function() {
                    $(this).jqGrid("Ascensys.tpl.add_element", "bottom", "right", $(this).jqGrid("Ascensys.element.pager.structure"));
                },
                reload: function() {
                    // $('.'+Cfg.class.pager_full_numbers).remove();
                    // $(this).jqGrid('Ascensys.tpl.add_element', 'bottom', 'right', $(this).jqGrid('Ascensys.element.pager.structure'));
                    $("." + Cfg.class.pager_input).remove();
                    $(this).jqGrid("Ascensys.tpl.add_element", "bottom", "right", $(this).jqGrid("Ascensys.element.pager.structure"));
                    // $('.jqgrid_component .jqgrow td:not(:has(span))').tooltip({ container: 'body' })
                    // $('.bs-select').selectpicker('refresh')
                },
                structure: function() {
                    //var current_page = parseInt($(this).jqGrid.Ascensys.gridObject.page);
                    //var total_pages = parseInt($(this).jqGrid.Ascensys.gridObject.total);
                    var current_page = $(this).jqGrid.Ascensys.gridPages.page;
                    var total_pages = $(this).jqGrid.Ascensys.gridPages.total;
                    // var left_ctrl = Cfg.tpl.pager_full_numbers.left_ctrl(current_page, total_pages);
                    // var right_ctrl = Cfg.tpl.pager_full_numbers.right_ctrl(current_page, total_pages);
                    // var pages_ctrl = Cfg.tpl.pager_full_numbers.pages_ctrl(current_page, total_pages);
                    // return Cfg.tpl.pager_full_numbers.body( left_ctrl, right_ctrl, pages_ctrl );
                    var left_ctrl = Cfg.tpl.pager_input.left_ctrl(current_page, total_pages);
                    var right_ctrl = Cfg.tpl.pager_input.right_ctrl(current_page, total_pages);
                    var pages_ctrl = Cfg.tpl.pager_input.pages_ctrl(current_page, total_pages);
                    var total_pages = Cfg.tpl.pager_input.total_pages(current_page, total_pages);
                    return Cfg.tpl.pager_input.body(left_ctrl, right_ctrl, pages_ctrl, total_pages);
                }
            },
            info: {
                init: function() {
                    $(this).jqGrid("Ascensys.tpl.add_element", "bottom", "left", $(this).jqGrid("Ascensys.element.info.structure"));
                },
                reload: function() {
                    $("." + Cfg.class.info).remove();
                    $(this).jqGrid("Ascensys.tpl.add_element", "bottom", "left", $(this).jqGrid("Ascensys.element.info.structure"));
                },
                structure: function() {
                    var current_page = parseInt($(this).jqGrid.Ascensys.gridObject.page);
                    var total_pages = parseInt($(this).jqGrid.Ascensys.gridObject.total);
                    var total_items = parseInt($(this).jqGrid.Ascensys.gridObject.records);
                    var per_page_records = parseInt($(this).jqGrid("getGridParam", "rowNum"));
                    var first = per_page_records * current_page - per_page_records + 1;
                    if (current_page < total_pages) {
                        var last = per_page_records * current_page;
                    } else {
                        var last = first + (total_items - first);
                    }
                    var total = total_items;
                    return Cfg.tpl.info(first, last, total);
                }
            },
            filters: {
                init: function() {
                    $("." + Cfg.class.filters).remove();
                    $("#clearUnsavedFilters").remove();
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "center", $(this).jqGrid("Ascensys.element.filters.structure"));
                },
                reload: function() {
                    $("." + Cfg.class.filters).remove();
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "center", $(this).jqGrid("Ascensys.element.filters.structure"));
                },
                remove: function() {
                    $("." + Cfg.class.filters).remove();
                    $("#clearUnsavedFilters").remove();
                },
                structure: function() {
                    return Cfg.tpl.filters();
                }
            },
            entries: {
                init: function() {
                    if ($(this).jqGrid("getGridParam", "view_type") !== "flat") {
                    }
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "left", $(this).jqGrid("Ascensys.element.entries.structure"));
                },
                reload: function() {
                    $("." + Cfg.class.entries).remove();
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "left", $(this).jqGrid("Ascensys.element.entries.structure"));
                },
                structure: function() {
                    //var row_list = $(this).jqGrid('getGridParam', 'rowList');
                    var row_list = $(this).jqGrid("getGridParam", "tenantData").rowList;
                    if (row_list.length == 0) {
                        row_list = [100, 75, 50, 25];
                    }
                    // Failsafe
                    if (row_list.length > 0 && row_list[0] === 999999) {
                        row_list = [100, 75, 50, 25];
                    }
                    var selected_option = $(this).jqGrid("getGridParam", "rowNum");
                    console.log(selected_option)
                    return Cfg.tpl.entries(row_list, selected_option);
                }
            },
            columns: {
                init: function() {
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "right", $(this).jqGrid("Ascensys.element.columns.structure.button"));
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "right", $(this).jqGrid("Ascensys.element.columns.structure.list"));
                },
                reload: function() {
                    $("." + Cfg.class.columns).remove();
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "right", $(this).jqGrid("Ascensys.element.columns.structure.button"));
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "right", $(this).jqGrid("Ascensys.element.columns.structure.list"));
                },
                structure: {
                    button: function() {
                        return Cfg.tpl.columns.button;
                    },
                    list: function() {
                        var colModel = $(this).jqGrid("getGridParam", "colModel");
                        // var colModel = $(this).jqGrid('getGridParam', 'customList');
                        return Cfg.tpl.columns.list(colModel);
                    }
                }
            },
            invoice_type_select: {
                init: function() {
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "right", $(this).jqGrid("Ascensys.element.invoice_type_select.structure"));
                },
                reload: function() {
                    $("." + Cfg.class.invoice_type_select).remove();
                    $(this).jqGrid("Ascensys.tpl.add_element", "top", "right", $(this).jqGrid("Ascensys.element.invoice_type_select.structure"));
                },
                structure: function() {
                    return Cfg.tpl.invoice_type_select;
                }
            }
        },
        bind: function() {
            var that = $("table")[1];
            $(document)
                .on("click", "[data-pager-goto]", function() {
                    if ($(this).data("pager-goto")) {
                        $(that).jqGrid("Ascensys.helper.pager_goto", $(this).data("pager-goto"));
                        $(that).jqGrid.table_config.on_page_change({
                            page: $(this).data("pager-goto")
                        });
                    }
                })
                .on("keyup", "[data-pager-keyup]", function() {
                    if (typeof dataPagerKeyUp !== "undefined") {
                        clearTimeout(dataPagerKeyUp);
                    }
                    window.dataPagerKeyUp = setTimeout(
                        function() {
                            if (isNaN(parseInt($(this).val()))) {
                                $(this).val("");
                            }
                            if (parseInt($(this).val()) < $(this).data("pager-min")) {
                                $(this).val(1);
                            }
                            if (parseInt($(this).val()) > $(this).data("pager-max")) {
                                $(this).val(parseInt($(this).jqGrid.Ascensys.gridObject.total));
                            }
                            $(that).jqGrid("Ascensys.helper.pager_goto", parseInt($(this).val()));
                            $(that).jqGrid.table_config.on_page_change({
                                page: parseInt($(this).val())
                            });
                        }.bind(this),
                        300
                    );
                })
                .on("change", "[data-entries-select]", function() {
                    if ($(this).val() > 0) {
                        $(that).jqGrid("Ascensys.helper.entries_change", parseInt($(this).val()));
                        $(that).jqGrid.table_config.on_rows_change({
                            rows: parseInt($(this).val())
                        });
                    }
                })
                .on("click", "[data-columns-open]", function() {
                    $(that).jqGrid("Ascensys.helper.columns_open");
                })
                .on("click", "[data-columns-freeze]", function(e) {
                    e.stopPropagation();
                })
                .on("click", "body", function() {
                    $(that).jqGrid("Ascensys.helper.columns_close");
                })
                .on("click", "[data-column-switch]", function(evt) {
                    if (window.lastColHide) {
                        if (window.lastColHide == evt.timeStamp) {
                            return;
                        }
                    }
                    window.lastColHide = evt.timeStamp;
                    var targetTable = $(evt.target)
                        .parents("clc-table-list")
                        .find(".ui-jqgrid-htable")
                        .attr("aria-labelledby")
                        .replace("gbox_", "");
                    if ($(this).hasClass("active")) {
                        $(that).jqGrid("Ascensys.helper.column_hide", $(this).data("column"), targetTable);
                        $(this).removeClass("active");
                    } else {
                        $(that).jqGrid("Ascensys.helper.column_show", $(this).data("column"), targetTable);
                        $(this).addClass("active");
                    }
                });
        },
        helper: {
            pager_goto: function(page) {
                var table = $("table")[1];
                $(table).jqGrid("setGridParam", {
                    page: page
                });
                //$(this).trigger('reloadGrid');
            },
            entries_change: function(entries) {
                var table = $("table")[1];
                $(table).jqGrid("setGridParam", {
                    rowNum: entries
                });
                //$(this).trigger('reloadGrid');
            },
            columns_open: function() {
                $("." + Cfg.class.columns + "-list").fadeIn(500);
            },
            columns_close: function() {
                $("." + Cfg.class.columns + "-list").fadeOut(500);
            },
            column_hide: function(col, table) {
                // var table = $("table")[1];
                $("#" + table).hideCol(col);
                $("#" + table).trigger("reloadGrid");
            },
            column_show: function(col, table) {
                // var table = $("table")[1];
                $("#" + table).showCol(col);
                $("#" + table).trigger("reloadGrid");
            }
        }
    }
});
/**
 * Config Object
 * @type {Object}
 */
var Cfg = {
    columnData: {},
    class: {
        container: "asc_jqgrid__container",
        pager_full_numbers: "asc_jqgrid__pager_full_numbers",
        pager_input: "asc_jqgrid__pager_input",
        info: "asc_jqgrid__info",
        entries: "asc_jqgrid__entries",
        columns: "asc_jqgrid__columns",
        filters: "asc_jqgrid__filters",
        invoice_type_select: "asc_jqgrid__invoice_type_select"
    },
    tpl: {
        container: function(section) {
            return '<div class="' + Cfg.class.container + " section_" + section + '"><div class="left col"></div><div class="center col"></div><div class="right col"></div></div>';
        },
        pager_full_numbers: {
            body: function(left_ctrl, right_ctrl, pages_ctrl) {
                return "" + '<div class="' + Cfg.class.pager_full_numbers + ' dataTables_paginate paging_full_numbers" id="schedule_dashboard_table_paginate">' + '<ul class="pagination">' + left_ctrl + pages_ctrl + right_ctrl + "</ul>" + "</div>";
            },
            left_ctrl: function(current_page, total_pages) {
                var element = "" + '<li class="paginate_button first ##DISABLED##" data-pager-goto="##INDEX_FIRST##">' + "<span>◀◀</span>" + "</li>" + '<li class="paginate_button previous ##DISABLED##" data-pager-goto="##INDEX_PREV##">' + "<span>◀</span>" + "</li>";
                if (current_page <= 1) {
                    element = element
                        .replace(/##DISABLED##/g, "disabled")
                        .replace(/##INDEX_PREV##/g, "")
                        .replace(/##INDEX_FIRST##/g, "");
                } else {
                    element = element
                        .replace(/##DISABLED##/g, "")
                        .replace(/##INDEX_PREV##/g, current_page - 1)
                        .replace(/##INDEX_FIRST##/g, total_pages - total_pages + 1);
                }
                return element;
            },
            right_ctrl: function(current_page, total_pages) {
                var element = "" + '<li class="paginate_button next ##DISABLED##" data-pager-goto="##INDEX_NEXT##">' + "<span>►</span>" + "</li>" + '<li class="paginate_button last ##DISABLED##" data-pager-goto="##INDEX_LAST##">' + "<span>►►</span>" + "</li>";
                if (total_pages - current_page <= 0) {
                    element = element
                        .replace(/##DISABLED##/g, "disabled")
                        .replace(/##INDEX_NEXT##/g, "")
                        .replace(/##INDEX_LAST##/g, "");
                } else {
                    element = element
                        .replace(/##DISABLED##/g, "")
                        .replace(/##INDEX_NEXT##/g, current_page + 1)
                        .replace(/##INDEX_LAST##/g, total_pages);
                }
                return element;
            },
            pages_ctrl: function(current_page, total_pages) {
                var element = "" + '<li class="paginate_button ##ACTIVE##" data-pager-goto="##INDEX##">' + "<span>##INDEX##</span>" + "</li>";
                var pages = "";
                for (var i = 1; i <= total_pages; i++) {
                    if (i == current_page) {
                        pages += element.replace(/##INDEX##/g, i).replace(/##ACTIVE##/g, "active");
                    } else {
                        pages += element.replace(/##INDEX##/g, i).replace(/##ACTIVE##/g, "");
                    }
                }
                return pages;
            }
        },
        pager_input: {
            body: function(left_ctrl, right_ctrl, pages_ctrl, total_pages) {
                return "" + '<div class="' + Cfg.class.pager_input + ' dataTables_paginate paging_input">' + '<span class="paginate_page">Page </span>' + left_ctrl + pages_ctrl + right_ctrl + total_pages + "</div>";
            },
            left_ctrl: function(current_page, total_pages) {
                var element = '<span class="previous paginate_button ##DISABLED##" data-pager-goto="##INDEX_PREV##">&lt;</span>';
                if (current_page <= 1) {
                    element = element.replace(/##DISABLED##/g, "disabled").replace(/##INDEX_PREV##/g, "");
                } else {
                    element = element.replace(/##DISABLED##/g, "").replace(/##INDEX_PREV##/g, current_page - 1);
                }
                return element;
            },
            right_ctrl: function(current_page, total_pages) {
                var element = '<span class="next paginate_button ##DISABLED##" data-pager-goto="##INDEX_NEXT##">&gt;</span>';
                if (total_pages - current_page <= 0) {
                    element = element.replace(/##DISABLED##/g, "disabled").replace(/##INDEX_NEXT##/g, "");
                } else {
                    element = element.replace(/##DISABLED##/g, "").replace(/##INDEX_NEXT##/g, current_page + 1);
                }
                return element;
            },
            pages_ctrl: function(current_page, total_pages) {
                var element = '<input class="paginate_input" value="##VALUE##" type="text" data-pager-keyup data-pager-min="##MIN_PAGE##" data-pager-max="##MAX_PAGE##">';
                element = element
                    .replace(/##VALUE##/g, current_page)
                    .replace(/##MIN_PAGE##/g, 1)
                    .replace(/##MAX_PAGE##/g, total_pages);
                return element;
            },
            total_pages: function(current_page, total_pages) {
                var element = '<span class="paginate_of"> of ##TOTAL_PAGES##</span>';
                element = element.replace(/##TOTAL_PAGES##/g, total_pages);
                return element;
            }
        },
        info: function(first, last, total) {
            var element = "" + '<div class="' + Cfg.class.info + ' dataTables_info" data-original="Showing ##FIRST## to ##LAST## of ##TOTAL## entries" data-total="##TOTAL##" data-first="##FIRST##">Showing ##FIRST## to ##LAST## of ##TOTAL## entries</div>';
            element = element
                .replace(/##FIRST##/g, first)
                .replace(/##LAST##/g, last)
                .replace(/##TOTAL##/g, total);
            return element;
        },
        entries: function(row_list, selected_option) {
            var element = "" + '<div class="' + Cfg.class.entries + ' dataTables_length">' + "<label>" + '<select name="' + Cfg.class.entries + '-entries" class="form-control input-sm input-xsmall input-inline bs-select" data-entries-select>' + "##OPTIONS##" + "</select> entries" + "</label>" + "</div>";
            var options = "";
            for (var i = row_list.length - 1; i >= 0; i--) {
                options += "<option " + (selected_option == row_list[i] ? "selected" : "") + ' value="' + row_list[i] + '">' + row_list[i] + "</option>";
            }
            element = element.replace(/##OPTIONS##/g, options);
            return element;
        },
        filters: function() {
            let gridId = $('.ui-jqgrid.ui-widget.ui-widget-content.ui-corner-all')[0].id.split('_');
            let columnId = '#';
            for (let i = 1; i < gridId.length; i++) {
                columnId += gridId[i] + '_';
            }
            columnId += 'isDeleted';
            let isStatus = $(columnId)[0] ? $(columnId)[0].innerText.indexOf('Status') != -1 : false;
            let isBlacklisted = $(columnId)[0] ? $(columnId)[0].innerText.indexOf('Blacklisted') != -1 : false;
            let notActiveCounterparty = $(columnId)[0] ? $(columnId)[0].innerText.indexOf('Not Active') != -1 : false;

            let findServiceColumn = $('#flat_service_list_name')[0] ? $('#flat_service_list_name')[0].innerText.indexOf('Service') != -1 : false;
            let findServiceCodeColumn = $('#flat_service_list_code')[0] ? $('#flat_service_list_code')[0].innerText.indexOf('Service Code') != -1 : false;

            var Filters = $(this).jqGrid.Ascensys.columnFiltersData;
            var conditions = "";
            Filters = _.sortBy(Filters, function(item) {
                return [item.column.columnName, item.$$hashKey];
            });
            console.log(Filters);
            if (window.location.href.indexOf('schedule-dashboard-table') != -1) {
                console.log(Filters);
                console.log(window.productTypeView);
                let filters = angular.copy(Filters);
                let arrayOfFilters = [];
                for (let i = 0; i < filters.length; i++) {
                    let skipFilters = false;
                    if (window.productTypeView && window.productTypeView.id == 1) {
                        if (filters[i].value[0] == 'Alkali Strategy' || filters[i].value[0] == 'Residue Strategy') {
                            skipFilters = true;
                        }
                    }
                    if (window.productTypeView && window.productTypeView.id == 2) {
                        if (filters[i].value[0] == 'Alkali Strategy' || filters[i].value[0] == 'Bunker Strategy') {
                            skipFilters = true;
                        }
                    }
                    if (window.productTypeView && window.productTypeView.id == 3) {
                        if (filters[i].value[0] == 'Residue Strategy' || filters[i].value[0] == 'Bunker Strategy') {
                            skipFilters = true;
                        }
                    }
                    if (!skipFilters) {
                        arrayOfFilters.push(filters[i]);
                    }
                }

                console.log(arrayOfFilters);
                Filters = angular.copy(arrayOfFilters);
            }
            $.each(Filters, function(k, v) {
                if (!_.isEmpty(v)) {
                    console.log(v);
                    if (v.condition.conditionNrOfValues > 0) {
                        if (v.condition.conditionNrOfValues == 2) {
                            value = v.value[0] + " - " + v.value[1];
                        } else {
                            if (v.value && typeof(v.value) == 'object') {
                                value = v.value[0];
                            } else {
                                value = v.value;
                            }
                        }
                        condition = v.condition.conditionName;
                    } else {
                        value = v.condition.conditionName;
                        condition = "";
                    }
                    if (v.filterOperator) {
                        var concats = ["", " and ", " or "];
                        concat = concats[v.filterOperator];
                    } else {
                        concat = "";
                    	if (k > 0) {
	                        concat = " and ";
                    	}
                    }
                    if (v.column.columnRoute == 'schedule-dashboard-table' || v.column.columnRoute == 'schedule-dashboard-calendar') {
                    	if (k > 0) {
	                    	// concat = " or "
                    	}
                    }
                    var columnName = v.column.columnName;
                    var columns = Cfg.columnData;
                    if(v.column.columnValue) {
                        for (var i = 0; i < columns.length; i++) {
                            if(v.column.columnValue.toLowerCase() == columns[i].name.toLowerCase().replace('.', '_')) {
                                columnName = columns[i].label;
                            }
                        }
                    }
    	            if (v.condition.conditionNrOfValues > 0 && (v.column.columnType == "Date" || v.column.columnType == "DateOnly")) {
		            	hasDayOfWeek = false;
    	            	if (window.tenantFormatsDateFormat) {
				            dateFormat = window.tenantFormatsDateFormat;
				            if (dateFormat.startsWith("DDD ")) {
				            	hasDayOfWeek = true;
				            	dateFormat = dateFormat.split("DDD ")[1];
				            }				            
				            dateFormat = dateFormat.replace(/d/g, "D").replace(/y/g, "Y").split(' ')[0];
    	            	} else {
    	            		dateFormat = "DD/MM/YYYY";
    	            	}
			            if (condition != 'Is between') {
	                        if (hasDayOfWeek) {
	                        	dayOfWeekString = moment.utc(value).format("ddd");
				            	value = dayOfWeekString + " " + moment.utc(value).format(dateFormat);
	                        } else {
				            	value = moment.utc(value).format(dateFormat);
	                        }			            	
			            } else {
                            dates = value.split(' - ');
                            for (var i = 0; i < dates.length; i++) {
		                        if (hasDayOfWeek) {
		                        	dayOfWeekString = moment.utc(dates[i]).format("ddd");
		                        	dates[i] = dayOfWeekString + " " + moment.utc(dates[i]).format(dateFormat);
		                        } else {
	                                dates[i] = moment.utc(dates[i].trim()).format(dateFormat);
		                        }
                            }
                            value = dates.join(' - ');
                        }
                    }
                    if (v.column.columnRoute == 'masters/service') {
                        if (v.column.columnValue == 'Name' && findServiceColumn) {
                            v.column.columnName = v.column.columnName.replace('Operator', 'Service');
                        }

                        if (v.column.columnValue == 'Code' && findServiceCodeColumn) {
                            v.column.columnName = v.column.columnName.replace('Operator', 'Service');
                        }
                    }
                    if (v.column.columnRoute == 'invoices/complete_view') {
                        if (v.column.columnValue == 'ValidationDate') {
                            v.column.columnName = 'Validation Date';
                        }
                        if (v.column.columnValue == 'BackOfficeComments') {
                            v.column.columnName = 'Back Office Comments';
                        }
                        if (v.column.columnValue == 'ClaimDate') {
                            v.column.columnName = 'Claim Date';
                        }
                        if (v.column.columnValue == 'DebunkerAmount') {
                            v.column.columnName = 'Debunker Amount';
                        }
                        if (v.column.columnValue == 'AccountNumber') {
                            v.column.columnName = 'Account Number';
                        }
                        if (v.column.columnValue == 'ResaleAmount') {
                            v.column.columnName = 'Resale Amount';
                        }
                    }
                    if (v.column.columnRoute == 'masters/product' && v.column.columnValue == 'CustomNonMandatoryAttribute1') {
                         v.column.columnName = 'Material';
                    }
                    if (window.location.href.indexOf('masters/') != -1 && v.column.columnValue == "IsDeleted" && isStatus) {
                         v.column.columnName = 'Status';
                    }
                    if (window.location.href.indexOf('masters/') != -1 && v.column.columnValue == "IsDeleted" && isBlacklisted) {
                         v.column.columnName = 'Blacklisted';
                    }
                    if (window.location.href.indexOf('masters/counterparty') != -1 && v.column.columnValue == "IsDeleted" && notActiveCounterparty) {
                         v.column.columnName = 'Not Active';
                    }
                    if (v.column.columnType == "Bool" && v.column.columnValue == "IsDeleted") {
                         if (value === "1") {
                            value = "Inactive";
                        }
                        if (value === "0") {
                            value = "Active";
                        }   
                    } else if (v.column.columnType == "Bool") {
	                    if (value === "1") {
	                        value = "Yes";
	                    }
	                    if (value === "0") {
	                        value = "No";
	                    }   
                    } 
                    if (v.column.columnType == "YesNo") {
                        if (value === "1") {
                            value = "Yes";
                        }
                        if (value === "0") {
                            value = "No";
                        }   
                    }
                    conditions += concat + ' <div class="filterCondition">' + v.column.columnName + " " + condition + ' <span class="filterVal">' + _.escape(value) + "</span></div>";
                }
            });
            var element = "" + '<div class="' + Cfg.class.filters + ' dataTables_info">Filter: ##CONTENT##</div>';
            if (conditions.startsWith(" or ")) {conditions = conditions.substring(3)}
            if (conditions.startsWith(" and ")) {conditions = conditions.substring(4)}
            element = element.replace(/##CONTENT##/g, conditions) + '<div id="clearUnsavedFilters" ><a class="btn btn-default" >Clear Unsaved Filters</a></div>';
            // element = element.replace(/##CONTENT##/g, conditions) + '<div id="clearUnsavedFilters"  ng-controller="FiltersController" ><a class="btn btn-default" ng-click="clearUnsavedFilters();">Clear Unsaved Filters</a></div>';
            return element;
        },
        columns: {
            button: function() {
                return "" + '<div class="' + Cfg.class.columns + '-button pull-right">' + '<div class="dt-buttons select-col-btn">' + '<a data-columns-freeze data-columns-open class="dt-button buttons-collection buttons-colvis">' + "</a>" + "</div>" + "</div>";
            },
            list: function(colModel) {
                var element = "" + '<div data-columns-freeze class="' + Cfg.class.columns + '-list dt-button-collection">' + "##COLUMNS##" + "</div>";
                var columns = "";
                // var not_available_columns = [/cb/g, /actions.*/g, /parent/g, /level/g, /isLeaf/g, /expanded/g, /loaded/g, /icon/g];
                var not_available_columns = [/cb/g, /actions.*/g];
                for (var i = 0; i <= colModel.length - 1; i++) {
                    var active = "active";
                    if (colModel[i].hidden) {
                        active = "";
                    }
                    var banned = false;
                    for (var ii = 0; ii < not_available_columns.length; ii++) {
                        if (colModel[i].name.match(not_available_columns[ii])) {
                            banned = true;
                        }
                    }
                    if (!banned) {
                        columns += '<a data-column-switch class="dt-button buttons-columnVisibility ' + active + '" data-column="' + colModel[i].name + '">' + "<span>" + colModel[i].label + "</span>" + "</a>";
                    }
                }
                element = element.replace(/##COLUMNS##/g, columns);
                Cfg.columnData = colModel;
                return element;
            }
        },
        invoice_type_select: function() {
            // return '<div ng-controller="Controller_Master as CM" class="' + Cfg.class.invoice_type_select + '  dynamic_form_editor  "><div class="form-group  "><div class=" col-md-4 col-md-offset-3"><label class="">Invoice Type</label></div><div class="col-md-5"><select ng-if="CM.listsCache" ng-init="initInvoiceTypeOptions()" name="newInvoiceType" class="form-control " id="newInvoiceType"></select></div></div></div>';
        }
    }
};
