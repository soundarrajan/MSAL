angular.module("shiptech.components").controller("FiltersController", [
    "$q",
    "$rootScope",
    "$scope",
    "$state",
    "$stateParams",
    "$filtersData",
    "$timeout",
    "filterConfigurationModel",
    "$compile",
    "$listsCache",
    "$tenantSettings",
    'CUSTOM_EVENTS',
    'Factory_App_Dates_Processing',
    function($q, $rootScope, $scope, $state, $stateParams, $filtersData, $timeout, filterConfigurationModel, $compile, $listsCache, $tenantSettings, CUSTOM_EVENTS, Factory_App_Dates_Processing) {
        $scope.filtersData = $filtersData;
        $scope.listsCache = $listsCache;
        $scope.tenantSettings = $tenantSettings;
        console.log("init");
        $scope.noDefault = null;
        ctrl = this;

        ctrl.isSellerPortal = window.location.hash.indexOf("supplier-portal") > 0;
        $scope.$on("savedLayout", function() {
            if ($scope.$$listenerCount["savedLayout"] > 1) {
                $scope.$$listenerCount["savedLayout"] = 0;
            }
            if ($scope.selectedConfig) {
                $scope.createAndUpdateFilterConfig($scope.selectedConfig.id, $scope.selectedConfig.name, $rootScope.rawFilters, $scope.selectedConfig.isDefault, true);
            }
            $rootScope.clc_loaded = false;
            // console.log(1)
            // $timeout(function () {
            $state.reload();
            // }, 1000);
        });

        ctrl.hideSidebar = function() {
            QuickSidebar.hide();
        }; 

        $scope.$on('colModel', function(e, data) {
          $scope.colModel = data;
        });

        $rootScope.$on("breadcrumbs-filter-applied", function(event, packedFilter) {
            // First filter applied
            $scope.appliedFiltersFromBreadcrumb = true;
        	if (!$scope.globalFilters) {
        		$scope.globalFilters = [];
                $scope.applyFilters($scope.globalFilters);
                return;
        	}
        	if ($scope.globalFilters.length === 0 || !$scope.globalFilters[0].value) {
        		$scope.globalFilters[0] = packedFilter;
                $scope.applyFilters($scope.globalFilters);
                return;
        	}

            if (!$rootScope.listOfAppliedFiltersString) {
                $rootScope.listOfAppliedFiltersString = [];
            }

        	if ($rootScope.listOfAppliedFiltersString.indexOf(packedFilter.value[0].toLowerCase()) == -1) {
                $scope.globalFilters.push(packedFilter);
        	} else {
        		for (var i = $scope.globalFilters.length - 1; i >= 0; i--) {
        			if ($scope.globalFilters[i].value.length > 0) {
		        		if ($scope.globalFilters[i].value[0].toLowerCase() == packedFilter.value[0].toLowerCase()) {
	                        $scope.globalFilters.splice(i, 1);
	                    }
        			}
        		}
        	}
        	// Apply filters
            $scope.applyFilters($scope.globalFilters);
        });

        $scope.applyFilters = function(data, noSlide, fromcol, column, defaultConf) {

            // $scope.currentList = $state.current.url.replace(":screen_id", $state.params.screen_id).replace("/", "");
            //console.log("_____________________", $scope.currentList);
			console.log(localStorage.getItem("persistentGlobalFilters"));
			if (localStorage.getItem("persistentGlobalFilters")) {
				data = angular.copy(JSON.parse(localStorage.getItem("persistentGlobalFilters")));
				$scope.globalFilters = angular.copy(JSON.parse(localStorage.getItem("persistentGlobalFilters")));
				localStorage.removeItem("persistentGlobalFilters");
			}
            $rootScope.listOfAppliedFiltersString = []
        	hasRequestProductStatusFilter = false;	
        	if ($scope.globalFilters) {
        		for (var i = 0; i < $scope.globalFilters.length; i++) {
        			if ($scope.globalFilters[i].column && $scope.globalFilters[i].column.columnName == 'Port Status') {
        				$rootScope.listOfAppliedFiltersString.push($scope.globalFilters[i].value[0].toLowerCase());
        				if (!hasRequestProductStatusFilter) {
        					if (!$scope.appliedFiltersFromBreadcrumb) {
		        				$rootScope.activeBreadcrumbFilters = $scope.globalFilters[i].value[0];
    							$scope.appliedFiltersFromBreadcrumb = false;
        					}
        				}
        				hasRequestProductStatusFilter = true;	
        			}
        		}
        	}
            if (!hasRequestProductStatusFilter && !$scope.appliedFiltersFromBreadcrumb) {
                $rootScope.activeBreadcrumbFilters = null;
            }
            console.log("$rootScope.listOfAppliedFiltersString : "+ $rootScope.listOfAppliedFiltersString);

            if(data){
            	
                if(data.clear) data = [];
                
                var loopList = [];
                if($scope.currentList === "schedule-dashboard-calendar"){
                    loopList = data.Filters;
                }else{
                    loopList = data;
                }
                $.each(loopList, function(_, v) {
                    if(v.column.columnValue === 'Open' || v.column.columnValue === 'Close') {
                        v.column.columnValue = '[' + v.column.columnValue + ']';
                    }


                    $.each($scope.colModel, function(_, v1) {
                        if(v.column.columnName.toLowerCase().replace(' ', '.') === v1.name.toLowerCase()) {
                            v.column.columnName = v1.label;
                        }
                    });
                });
            }

            invalidDateFilters =  _.filter(loopList, function(obj) {
	            if (obj.column.columnType == 'Date' || obj.column.columnType == 'DateOnly') {
	            	hasInvalidDate = false;
	            	if (obj.value.length < obj.condition.conditionNrOfValues) {
		            	hasInvalidDate = true;
	            	}
	            	$.each(obj.value, function(k,v){
	            		if (v) {
		            		if (!v || parseFloat(v.split("-")[0]) < 1753 || isNaN(parseFloat(v.split("-")[0])) ) {
				            	hasInvalidDate = true;
		            		}
	            		} else {
			            	hasInvalidDate = true;
	            		}
	            	})
	            	return hasInvalidDate;
	            } 
			});
			if (invalidDateFilters.length > 0) {
				toastr.error("Please enter correct date format")
				return;
			}

          // console.log('applied filters');
            console.log('data: ', data);
            // console.log(sortList)
            // console.log(data);
            if (typeof $scope.packedFilters == "undefined") {
                $scope.packedFilters = {};
            }
            if (data && data.length > 0) {
                if (fromcol) {
                    $.each(data, function(k, v) {
                        v.unSaved = true;
                    });
                    if ($rootScope.rawFilters) {

                        differentColumns = [];
                        var checkColumn = data[0].column.columnValue;
                        if ($rootScope.rawFilters.length > 0) {
                            //differentColumns = _.find($rootScope.rawFilters, function(o) {  return o && o.column.columnValue != checkColumn });
                            differentColumns = $rootScope.rawFilters.filter(function(o) {
                                return o && o.column.columnValue != checkColumn;
                            });
                            if (differentColumns) {
                                data = data.concat(differentColumns);
                            }
                        }
                        // console.log(test)
                        // $.each($rootScope.rawFilters, function(k, v) {
                        //         $.each(data, function(dk, dv) {
                        //             if (angular.equals(v, dv)) {
                        //                 data.splice(dk, 1);
                        //             }
                        //         });
                        // });
                        //     // console.log(1,$rootScope.rawFilters);
                    }
                    if (column) {
                        $.each(data, function(k, v) {
                            if (v) {
                                if (v.column.columnValue == column) {
                                    data.splice(k, 1);
                                }
                            }
                        });
                    }
                    $.each(data, function(k, v) {
                        if (v && v.column && v.column.columnType.toLowerCase() == "date") {
                            if (["eta", "etb"].indexOf(v.column.columnValue.toLowerCase()) < 0) {
                                v.column.dateType = "server";
                            }
                        }
                    });
                }
                // console.log(data);
                // console.log(2,);
            } else {
                data = []
            }
            $scope.packedFilters = $scope.packFilters(data);
            $scope.packedFilters.raw = $rootScope.rawFilters;
            $scope.formatHeaders(data);
            $scope.noDefault = false;
            if ($rootScope.sortList) {
                $scope.packedFilters.sortList = $rootScope.sortList;
            }
            if (($scope.packedFilters && !defaultConf) || ($scope.packedFilters && defaultConf && !column)) {
                if ($rootScope.clc_loaded) {
                    // console.log(123)
                    if (!ctrl.saveFilterActionEvent) {
	                    $rootScope.$broadcast("filters-applied", $scope.packedFilters);
                    } else {
						ctrl.saveFilterActionEvent = false;
                    }
                }
            }
            if (noSlide != true) ctrl.hideSidebar();
        };

        $scope.formatSimpleDate = function(date) {
            dateFormat = $scope.tenantSettings.tenantFormats.dateFormat.name;
            dateFormat = dateFormat.replace(/d/g, "D").replace(/y/g, "Y").split(' ')[0];
            if (date) {
                return moment.utc(date).format(dateFormat);
            }
            return;
        };

        $scope.formatHeaders = function(data) {
            $(".colMenu")
                .parent()
                .removeClass("unsavedFilteredColumn");
            $.each(data, function(k, v) {
                if (v.unSaved) {
                    $('.colMenu[data-column="' + v.column.columnValue + '"]')
                        .parent()
                        .addClass("unsavedFilteredColumn");
                }
            });
        };

        jQuery(document).on("click", "#clearUnsavedFilters", function() {
        	if ($state.current.url == '/schedule-dashboard-table') {
        		angular.element($(".clearFiltersSidebar")).scope().clearFilters();
        	} else {
	        	$scope.clearUnsavedFilters()
        	}
        })

        $scope.clearUnsavedFilters = function() {
    		console.log("$scope.clearUnsavedFilters" , new Date() - window.lastclearUnsavedFiltersCall)
        	if (new Date() - window.lastclearUnsavedFiltersCall < 5000) {
        		return;
        	}
        	window.lastclearUnsavedFiltersCall = new Date();
            var clearedFilters = [];
            $.each($rootScope.rawFilters, function(k, v) {
                if (!v.unSaved) {
                    clearedFilters.push(v);
                }
            });
            $rootScope.rawFilters = clearedFilters;
            $timeout(function(){
	            $scope.applyFilters($rootScope.rawFilters, true);
            })
        };

        $scope.$on("clearUnsavedFilters", function (event) {
            // This should only be applied from schedule dashboard calendar
            if ($scope.selectedConfig && $scope.selectedConfig.id != 0) {
	            $scope.loadSelectedConfig();
            } else {
            	$state.reload();
            }
        })

        $scope.applyDefaultConfiguration = function(data, loadDef) {
            if (ctrl.saveFilterActionEvent) {return}
            $scope.globalFilters = [];
            //if new configuration, return
            if (!data) {
                $scope.globalFilters.push({});
                $scope.clearUnsavedFilters();
                $rootScope.activeBreadcrumbFilters = null;
                // $rootScope.appFilters = null;
                // $rootScope.$broadcast("filters-applied", []);
                return;
            }
            if (data.id == 0) {
                $scope.globalFilters.push({});
                $scope.clearUnsavedFilters();
                $rootScope.activeBreadcrumbFilters = null;
                // $rootScope.appFilters = null;
                // $rootScope.$broadcast("filters-applied", []);
                return;
            }
            if (data.id == -1) {
                $scope.clearFilters(true);
                $scope.clearUnsavedFilters();
                $rootScope.activeBreadcrumbFilters = null;
                // $rootScope.appFilters = null;
                // $rootScope.$broadcast("filters-applied", []);
                return;
            }
            filtersList = data.filtersList;
            sortList = data.sortList;

            $.each(filtersList, function(key, val) {
                var newFilter = {
                    column: null,
                    condition: null,
                    value: []
                };
                //check in current columns
                $.each($scope.currentColumns, function(key2, val2) {
                    if (val2.columnValue == val.columnValue) {
                        newFilter.column = val2;
                    }
                });
                //check values
                $.each($scope.conditions, function(key2, val2) {
                    if (val2.conditionValue == val.conditionValue) {
                        newFilter.condition = val2;
                    }
                });
                //add values
                $.each(val.values, function(key2, val2) {
                    newFilter.value.push(val2);
                });
                $scope.globalFilters.push(newFilter);
                if (newFilter.column.columnRoute === 'schedule-dashboard-calendar' && (newFilter.column.columnName == 'Port Status')) {
                    $rootScope.activeBreadcrumbFilters = newFilter.value[0];
                    // $rootScope.$broadcast(CUSTOM_EVENTS.BREADCRUMB_FILTER_STATUS, newFilter.value[0], 0);
                }
                delete newFilter;
            });
            // if (sortList) {
            //     $scope.globalFilters.sortList = sortList;
            // }
            $rootScope.sortList = sortList;
            if (loadDef) {
                $scope.applyFilters($scope.globalFilters, false, false, false, true);
                ctrl.hideSidebar();
            }
        };

        $scope.initGlobalFilters = function() {
        	$scope.globalFilters = [{}];
        	if (localStorage.getItem("persistentGlobalFilters")) {
	        	$scope.globalFilters = angular.copy(JSON.parse(localStorage.getItem("persistentGlobalFilters")));
	        	$scope.applyFilters($scope.globalFilters);
        	}
        }

        $scope.$watch('selectedConfig',function(){
        	// $rootScope.persistentGlobalFilters = angular.copy($scope.globalFilters);
        	
        	if (!$scope.selectedConfig) {
        		// debugger;
        	}
        },true);

        $rootScope.$on("changeTimeScale", function(){
        	if ($scope.globalFilters) {
        		if (!_.isEmpty($scope.globalFilters[0].column)) {
		        	localStorage.setItem("persistentGlobalFilters", JSON.stringify(angular.copy($scope.globalFilters)) );
        		}
        	}
        })

        $scope.loadSelectedConfig = function(load, isDefault) {
        	
            if (!load) {
                load = true;
            }
            if ($scope.selectedConfig) {
	            if ($scope.selectedConfig.id == 0) {
	            	return;
	            }
            }
            if (!ctrl.saveFilterActionEvent && $scope.selectedConfig) {
	            $scope.applyDefaultConfiguration($scope.selectedConfig, load);
            }
            setTimeout(function(){
	            ctrl.saveFilterActionEvent = false;
            	$scope.$apply();

            })
            $scope.datepickers();
        };
        $scope.packFilters = function(data) {
            if (!data) data = [];
            $rootScope.rawFilters = angular.copy(data);
            packedFilters = [];
            if (data.clear) {
                packedFilters = [];
            } else {
                // if (data.sortList) {
                //     sortList = data.sortList;
                //     packedFilters.sortList = sortList;
                //     delete data.sortList;
                //     // data = _.pull(data, 'sortlist');
                //     console.log(data)
                // }
                $.each(data, function(key, val) {
                    if (!_.isEmpty(val) && !_.isEmpty(val.column)) {
                        // console.log(val);
                        var filter = {
                            columnValue: val.column.columnValue,
                            ColumnType: val.column.columnType,
                            ConditionValue: val.condition.conditionValue,
                            Values: _.toArray(val.value)
                        };
                        // if (key > 0) {

                        if(val.filterOperator) {
                            filter.FilterOperator = val.filterOperator;
                        } else {
                            if(key === 0) {
                                filter.FilterOperator = 0;
                            } else {
                                filter.FilterOperator = 2;
                            }
                        }
                        if (val.column.dateType) {
                            filter.dateType = val.column.dateType;
                        }
                        // }
                        packedFilters.push(filter);
                    } else {
                        toastr.error("Invalid configuration!");
                    }
                });
            }

            return packedFilters;
        };
        // $scope.$watch('filtersData',function(){
        //     console.log('$scope.filtersData',$scope.filtersData);
        //     $scope.createFilters();
        // },true);
        $scope.createFilters = function() {
            if ($state.current.url.indexOf(":screen_id") > -1) {
                $scope.currentList = $state.current.url.replace(":screen_id", $state.params.screen_id).replace("/", "");
            } else {
                $scope.currentList = $state.current.url.replace("/", "");
            }

            if ($rootScope.isModal) {
                list = $scope.currentList.split("/")[0];
                $scope.currentList = list + "/" + $rootScope.modalTableId;
            }
            // console.log(modalTableId)
            if ($state.current.name == "default.home") {
                $scope.currentList = "schedule-dashboard-calendar";
            }
            if ($scope.currentList == "contract-planning/") $scope.currentList = "contract-planning";
            if ($scope.currentList.indexOf("contract-planning") >= 0) $scope.currentList = "contract-planning";
            if ($scope.currentList.indexOf(":entity_id") > -1) {
                $scope.currentList = $scope.currentList.replace("/:entity_id", "");
            }
            if ($scope.currentList.indexOf("/:") && $scope.currentList != "edit-request/:requestId") {
                $scope.currentList = $scope.currentList.split("/:")[0];
            }
            console.log("currentList", $scope.currentList);
            // console.log('$scope.filtersData',$scope.filtersData);
            $scope.currentColumns = [];
            if($rootScope.rawFilters === undefined) $rootScope.rawFilters = [];
            $rootScope.CheckForFilters = 0;
            $scope.conditions = $scope.filtersData.filterConditions;
            $.each($scope.filtersData.filterColumns, function(key, value) {
                if (value.columnRoute == $scope.currentList) {
                    // if(value.columnType == 'Number') value.columnType = 'longNumber';
                    // 
                    if ($scope.tenantSettings.companyDisplayName == "Pool") {
						value.columnName = value.columnName.replace("Carrier", $scope.tenantSettings.companyDisplayName.name);
                    }
					value.columnName = value.columnName.replace("Company", $scope.tenantSettings.companyDisplayName.name);
					value.columnName = value.columnName.replace("Service", $scope.tenantSettings.serviceDisplayName.name);
                    $scope.currentColumns.push(value);
                   // $rootScope.rawFilters[value.columnName] = value;
                    $rootScope.CheckForFilters++;
                } else if (value.columnRoute === 'view-order-auditlog' && $scope.currentList.indexOf('masters') > -1) {
                    // Filters for all masters routes
                    value.columnRoute = $scope.currentList;
                    $scope.currentColumns.push(value);
                    $rootScope.CheckForFilters++;
                }
            });
            if ($rootScope.CheckForFilters == 0) {
                $timeout(function() {
                    if(typeof ctrl.hideSidebar == 'function')
                        ctrl.hideSidebar();
                });
            }
            console.log("$rootScope.CheckForFilters", $rootScope.CheckForFilters);
        };
        $scope.createFilters();
        $scope.clearFilters = function(noSlide) {
            $scope.globalFilters = [];
            $scope.selectedConfig = null;
            $rootScope.activeBreadcrumbFilters = null;
            var data = {
                clear: true
            };
            $scope.applyFilters(data, noSlide);
        };
        $scope.clearCurrentLine = function(index, where, column) {
            if (column) {
                $scope.pageFilters[column][index].value = [];
                if (where == "column") $scope.pageFilters[column][index].condition = {};
            } else {
                if ($scope.globalFilters[index]) {
                    //delecte condition value if column/condition is changed
                    $scope.globalFilters[index].value = [];
                    //delete contition when column name is changed
                    if (where == "column") $scope.globalFilters[index].condition = {};
                }
            }
        };
        $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
            $rootScope.clc_loaded = false;   
                $scope.globalFilters = [];
                $rootScope.listOfAppliedFiltersString = [];
                $rootScope.rawFilters = [];
                $scope.createFilters();
                $scope.getDefaultFiltersConfiguration();
                $scope.getFiltersConfigurations();
       
        });
	    angular.element(document).ready(function () {
		    // $rootScope.clc_loaded = false;   
            // $scope.globalFilters = [{}];
            // console.log("$rootScope.rawFilters", $rootScope.rawFilters);
            // $rootScope.rawFilters = [];
            $scope.createFilters();
            if (typeof($scope.getDefaultFiltersConfiguration) == 'function') {
	            $scope.getDefaultFiltersConfiguration();
            }
            if (typeof($scope.getFiltersConfigurations) == 'function') {
	            $scope.getFiltersConfigurations();
            }
            // $rootScope.CheckForFilters = 1
	    });        
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
            $scope.noDefault = null;
            $scope.packedFilters = [];
        });
  
        $scope.datepickers = function() {
            setTimeout(function() {
                $(".date-time-picker").datetimepicker({
                    showMeridian: "true",
                    autoclose: true,
                    format: "yyyy-mm-ddThh:ii:ssZ",
                    pickerPosition: "bottom-left"
                });
                $(".date-picker").datepicker({
                    autoclose: true,
                    format: "yyyy-mm-dd",
                    pickerPosition: "bottom-left"
                });
            }, 100);
        };
        ctrl.datepickers = function() {
        	$scope.datepickers();
        }

        $scope.formatDate = function(elem, dateFormat) {
            // console.log(1)
            if (elem) {
                formattedDate = elem;
                var date = Date.parse(elem);
                date = new Date(date);
                if (date) {
                    var utc = date.getTime() + date.getTimezoneOffset() * 60000;
                    //return utc;
                    dateFormat = dateFormat.replace(/d/g, "D").replace(/y/g, "Y");
                    formattedDate = fecha.format(utc, dateFormat);
                }
                // console.log(formattedDate)
                return formattedDate;
            }
        };
        $scope.getDefaultFiltersConfiguration = function(fromSave) {
        	if (localStorage.getItem("persistentGlobalFilters") || (!fromSave && $scope.defaultConfiguration)) {
        		return;
        	}
            var data = $scope.currentList;
            $scope.defaultConfiguration = null;
            filterConfigurationModel
                .getDefaultFiltersConfiguration(data)
                .then(function(response) {
                    $scope.defaultConfiguration = response.payload;
                    if (!response.payload && !fromSave) {
                    	$rootScope.$broadcast("filters-applied", []);
                    } 
                    if ($scope.defaultConfiguration != null) {
                        retVal = $scope.applyDefaultConfiguration($scope.defaultConfiguration, true);
                        $scope.selectedConfig = $scope.defaultConfiguration;
                        $scope.enableDisableDeleteLayout($scope.selectedConfig);
                        //selected != default
                        //but if default exists, set as selected initially
                    } else {
                        // $scope.selectedConfig = {
                        //     id: 0
                        // };
                        $scope.noDefault = true;
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        };

        $scope.createAndUpdateFilterConfig = function(id, name, data, isDefault, menuZone, table) {
            //configuration must have at least one filter
            console.log($rootScope);
            // console.log($scope.$parent.CLC.tableParams)
            if (!table) {
                table = $rootScope.listTableSelector;
            }
            if (data) {
                if (data.length == 0 && !menuZone) {
                    toastr.error("Configuration must have at least one filter");
                    return;
                }
                filtersList = $scope.packFilters(data);
            } else {
                filtersList = [];
            }
            if (name == "Add new configuration") {
                no = $scope.filtersConfigurations.length - 1;
                name = "Configuration " + no;
                // name = 'Test Configuration ';
            }
            var route = $scope.currentList;
            sortList = $rootScope.sortList;

            //form payload
            var data = {
                Id: id,
                Name: name,
                UserId: $rootScope.user.id,
                FiltersList: filtersList,
                SortList: sortList,
                IsDefault: isDefault,
                Route: route
            };
            ctrl.saveFilterActionEvent = true;
            filterConfigurationModel
                .saveConfiguration(data)
                .then(function(response) {
                    console.log(response);
                    toastr.success("Configuration saved!");

                    // $state.reload();globalFilters
                    if (route == 'schedule-dashboard-calendar' || route == 'schedule-dashboard-table') {
                        $scope.filtersConfigurations = null;
                        $scope.getFiltersConfigurations();
                        $scope.getDefaultFiltersConfiguration(true);
                    }
                })
                .catch(function(error) {
		            ctrl.saveFilterActionEvent = false;
                    console.log(error);
                });
        };
        $scope.getFiltersConfigurations = function() {
            if (!$scope.filtersConfigurations) {
                var data = $scope.currentList;
                // $scope.filtersConfigurations = null;
                filterConfigurationModel.getFiltersConfigurations(data).then(function(response) {
                    $scope.filtersConfigurations = response.payload;
                    $scope.filtersConfigurations.unshift({
                        id: 0,
                        route: $scope.currentList,
                        name: "Add new configuration"
                    });
                    // $scope.filtersConfigurations.unshift({
                    //     id: -1,
                    //     route: $scope.currentList,
                    //     name: ''
                    // })
                    ctrl.hideSidebar();
                });
            }
        };
        $scope.deleteConfig = function(selectedConfig) {
            var data = selectedConfig.id;
            filterConfigurationModel
                .deleteConfiguration(data)
                .then(function(response) {
                    console.log(response);
                    toastr.success("Configuration deleted!");
                    $timeout(function() {
                        $state.reload();
                    }, 1000);
                })
                .catch(function(error) {
                    console.log(error);
                });
        };
        // $scope.$on('gridDataDone', function(){
        //     if(!$scope.loadedDefault){
        //         $scope.getDefaultFiltersConfiguration();
        //         $scope.loadedDefault = true;
        //     }
        // })
        $rootScope.getConfigurationForTableLoad = function() {
            return $q(function(resolve, reject) {
                // send default config to table build
                // no default config, send false
                
                if ($rootScope.rawFilters && $state.current.url != '/schedule-dashboard-table') {
			            $scope.packedFilters = $scope.packFilters($rootScope.rawFilters);
			            $scope.packedFilters.raw = $rootScope.rawFilters;
			            if ($rootScope.sortList) {
			                $scope.packedFilters.sortList = $rootScope.sortList;
			            }
                }

                // test = $scope.packFilters($rootScope.rawFilters);
                // console.log($rootScope.rawFilters);
                resolve($scope.packedFilters);
                // $scope.$apply();
                // $scope.$watch("noDefault", function(newVal) {
                //     if (newVal != null) {
                //         if (newVal) {
                //             reject(false);
                //         } else {
                //         }
                //     }
                // });
            });
        };
        $rootScope.getListFilters = function() {
            return $q(function(resolve, reject) {
                // send default config to table build
                // no default config, send false
                $scope.$watch("currentColumns", function(newVal) {
                    // if (newVal != null) {
                    // console.log(newVal)
                    resolve(newVal);

                    // }
                });
            });
        };
        $rootScope.getGlobalFilters = function() {
            return $q(function(resolve, reject) {
                // send default config to table build
                // no default config, send false
                $scope.$watch("globalFilters", function(newVal) {
                    // if (newVal != null) {
                    // console.log(newVal)
                    resolve(newVal);

                    // }
                });
            });
        };
        $(document).click(function(e) {
            // check that your clicked
            // element has no id=info
            // and is not child of info
            // console.log(e.target)
            // console.log($("#customPopover").find(e.target).length)
            if (!$(e.target).hasClass("colMenu")) {
                if (e.target.id != "customPopover" && !$("#customPopover").find(e.target).length && !$(e.target).hasClass("miunsAct")) {
                    $scope.hidePopover();
                }
            }
        });
        $scope.hidePopover = function() {
            $("custom-popover").remove();
            $("*:not([tooltip])").tooltip("destroy");
            $("[tooltip][data-original-title]").tooltip({
                                container: "body",
                                placement: "auto"
                            });
        };
        $scope.columnSort = function(table, column, order, sortColumn) {

            if ($rootScope.sortList && $rootScope.sortList.length > 0) {
                $.each($rootScope.sortList, function(k, v) {
                    if (v) {
                        if (sortColumn) {
                            if ((v.sortColumnValue && v.sortColumnValue.toLowerCase() == sortColumn.toLowerCase()) || v.columnValue.toLowerCase() == sortColumn.toLowerCase()) {
                                $rootScope.sortList.splice(k, 1);
                            }
                        } else {
                            if (v.columnValue.toLowerCase() == column.toLowerCase()) {
                                $rootScope.sortList.splice(k, 1);
                            }
                        }
                    }
                });
            }

            idx = $rootScope.sortList && $rootScope.sortList.length > 0 ? _.maxBy($rootScope.sortList, "sortIndex").sortIndex + 1 : 0;

            if (order > 0) {
                if (sortColumn) {
                    $rootScope.sortList.push({ columnValue: sortColumn.replace(/\./g, "_").toLowerCase(), sortIndex: idx, sortParameter: order, col: column.replace(/\./g, "_").toLowerCase() });
                } else {
                    $rootScope.sortList.push({ columnValue: column.replace(/\./g, "_").toLowerCase(), sortIndex: idx, sortParameter: order });
                }
            }

            $scope.applyFilters($rootScope.rawFilters);

            $scope.hidePopover();
        };
        $scope.appendFilters = function(obj) {
            $timeout(function() {
                $scope.$apply(function() {
                    $scope.globalFilters.push(data);
                });
            });
        };
        $scope.checkColumnFilters = function(column) {
            if (typeof $scope.columnFilters == "undefined") {
                $scope.columnFilters = {};
                $scope.columnFilters[column] = [];
            }
            filters = $rootScope.rawFilters;
           
            $.each(filters, function(k, v) {
                if (v.column.columnValue == column) {
                    $scope.columnFilters[column].push(v);
                }
            });
            if ($scope.columnFilters[column].length == 0) {
                $scope.columnFilters[column].push({});
            }
            console.log($scope.columnFilters[column]);
        };
        $scope.removeFilterRow = function(index, column) {
            $scope.columnFilters[column].splice(index, 1);
        };
        $scope.removeFilterColumn = function(column) {
            $scope.columnFilters[column] = [];
            newFilter = [];
            $.each($rootScope.rawFilters, function(k, v) {
                if (v.column.columnValue != column) {
                    newFilter.push(v);
                }
            });
            $rootScope.rawFilters = newFilter;
            $scope.applyFilters($rootScope.rawFilters);
        };

        $scope.clearValues = function(column, key) {
            $scope.columnFilters[column][key]["value"] = [];
            $(".filterRules .formatted-date-input").val("");
        };

        $scope.setDefaultConditionType = function(column, key){
            // console.log($scope.columnFilters[column][key]);
            // debugger;
            // only type text
            if ($scope.columnFilters[column][key].column) {
		        if($scope.columnFilters[column][key].column.columnType == 'Text'){
		            // if the filter doesn't come from a configuration / filter isn't already set -> default only empty filters
		            if(!$scope.columnFilters[column][key].value){

		                //find 'Contains' for type Tex and set that condition as default
		                $.each($scope.conditions, function(key_cond,val_cond){
		                    if(val_cond.conditionApplicable == "Text")
		                        if(val_cond.conditionName == "Contains")
		                            $scope.columnFilters[column][key].condition = angular.copy(val_cond);

		                });
		            }
		        }
            }
        }

        // date inputs
        $scope.initMask = function(timeout){

            // var DATE_OPTIONS = Factory_App_Dates_Processing.getDateOptions();
            // filters use custom format set on //window.tenantFormatsDateFormat;
            // get processed formats based on that one from Factory_App_Dates_Processing
            var DATE_OPTIONS = Factory_App_Dates_Processing.getDateOptionsForFilters();
        
            // mask options
            var options =  {
                onKeyPress: function(value, e, field, options) {
                    // select formatter
                    var formatUsed = "";
                    if(field.hasClass('date-only')){
                        formatUsed  = DATE_OPTIONS.momentFormatDateOnly;
                    }else{
                        formatUsed  = DATE_OPTIONS.momentFormat;
                    }
                    // process date
                    var val = moment(value, formatUsed, true);
                    // test date validity
                    if($scope.invalidDate === undefined) $scope.invalidDate = {};
                    if(val.isValid()){
                        $scope.invalidDate[field[0].name] = false;
                    }else{
                        $scope.invalidDate[field[0].name] = true;
                    }
                }
            }
            // end mask options
    
            // ACTUAL MASK INITIALIZATION
            function init(){
                var dateTime = $('.formatted-date-input.date-time');
                $.each(dateTime, function(key){
                    $(dateTime[key]).mask(DATE_OPTIONS.maskFormat, options);
                })
                var dateOnly = $('.formatted-date-input.date-only');
                $.each(dateOnly, function(key){
                    $(dateOnly[key]).mask(DATE_OPTIONS.maskFormatDateOnly, options);
                })

                if($scope.formatDates === undefined) $scope.formatDates = {};
            }
            if(timeout){
                setTimeout(init,2000);
            }else{
                init();
            }
            // END ACTUAL MASK INITIALIZATION
        }
        $scope.setValue = function(inputDetails, direction, simpleDate, app){
            
            /** See @param inputDetails
            /**     @param direction
            /**     @param simpleDate
            /**     @param app
             *   explained in controller_master
             */


            var DATE_FORMAT = $scope.tenantSettings.tenantFormats.dateFormat;
    
            var rootMap = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                '$ctrl': ctrl
            }
            
            if (!ctrl.overrideInvalidDate) {
                ctrl.overrideInvalidDate = {}
            }
            ctrl.overrideInvalidDate[inputDetails.pickerId] = true;

            if(direction == 1){
                // datepicker input -> date typing input
                $timeout(function() {
                    if(simpleDate){
                        var dateValue = _.get(rootMap[inputDetails.root],inputDetails.path);
                        var formattedDate = Factory_App_Dates_Processing.formatSimpleDate(dateValue, DATE_FORMAT, app);
                        _.set(rootMap[inputDetails.root], "formatDates." + inputDetails.path, formattedDate); 
                    } else{
                        var dateValue = _.get(rootMap[inputDetails.root],inputDetails.path);
                        var formattedDate = Factory_App_Dates_Processing.formatDateTime(dateValue, DATE_FORMAT, inputDetails.fieldId);
                        _.set(rootMap[inputDetails.root], "formatDates." + inputDetails.path, formattedDate); 
                    }
                     $('[ng-model*="formatDates.'+inputDetails.path+'"]').removeClass("invalid")
                });
            }
            if(direction == 2){
                // date typing input -> datepicker input 
                $timeout(function() { 
                    var date = _.get(rootMap[inputDetails.root], "formatDates." +  inputDetails.path);
                    var copy = angular.copy(date);
                    var formattedDate = Factory_App_Dates_Processing.formatDateTimeReverse(copy, simpleDate);
                    _.set(rootMap[inputDetails.root], inputDetails.path, formattedDate); 
    
                    // also change datepicker value
                    console.log('.date-picker#' + inputDetails.pickerId);
                    $('.date-picker#' + inputDetails.pickerId).datepicker('setDate', new Date(formattedDate));
                    ctrl.overrideInvalidDate[inputDetails.pickerId] = false;
                });
            }
        }

        $scope.initModelValue = function(inputDetails){
            var rootMap = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                '$ctrl': ctrl
            }
     
            $timeout(function() {
                _.set(rootMap[inputDetails.root], "formatDates." + inputDetails.path, ""); 
                console.log($scope.formatDates);
            });

        }

        $scope.enableDisableDeleteLayout = function(isDisabled){

        	if (isDisabled) {
        		if (isDisabled.id != 0) {
        			$(".st-content-action-icons .delete_layout").css("opacity", 1)
        			$(".st-content-action-icons .delete_layout").css("pointer-events", "initial");
        		} else {
        			$(".st-content-action-icons .delete_layout").css("opacity", 0.3)
        			$(".st-content-action-icons .delete_layout").css("pointer-events", "none");
        		}
        	} else {
        			$(".st-content-action-icons .delete_layout").css("opacity", 0.3)
        			$(".st-content-action-icons .delete_layout").css("pointer-events", "none");
        	}
        	
        }
                 
        // $scope.getDefaultFiltersConfiguration()
    }
]);
angular.module("shiptech.components").component("filters", {
    templateUrl: "components/sidebar/views/filters.html",
    controller: "FiltersController",
    bindings: {
        settings: "="
    }
});
// angular.module("shiptech.components").component("filtersWidget", {
//     templateUrl: "components/sidebar/views/filters-widget.html",
//     controller: "FiltersController",
//     bindings: {
//         settings: "="
//     }
// });
angular.module("shiptech").directive("filtersWidget", function() {
    return {
        templateUrl: "components/sidebar/views/filters-widget.html",
        controller: "FiltersController"
    };
});
