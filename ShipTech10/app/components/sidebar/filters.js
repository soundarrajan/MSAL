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
    'tenantService',
    function($q, $rootScope, $scope, $state, $stateParams, $filtersData, $timeout, filterConfigurationModel, $compile, $listsCache, $tenantSettings, CUSTOM_EVENTS, tenantService) {
        $scope.filtersData = $filtersData;
        $scope.listsCache = $listsCache;
        $scope.tenantSettings = $tenantSettings;
		tenantService.procurementSettings.then(function(settings) {
			ctrl.procurementSettings = settings.payload;
			if ($scope.currentList == "schedule-dashboard-calendar" && ctrl.procurementSettings.request.deliveryWindowDisplay.id == 2) {
				if ($scope.currentColumns) {
					for (var i = $scope.currentColumns.length - 1; i >= 0; i--) {
						if ($scope.currentColumns[i].columnValue == "VoyageDetail_DeliveryFrom" || $scope.currentColumns[i].columnValue == "VoyageDetail_DeliveryTo") {
							$scope.currentColumns.splice(i,1)
						}
					}
				}
			}
		});

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
            setTimeout(function(){
                $rootScope.lastLoadedListPayload = null;
	            $state.reload();
            });
        });

        ctrl.hideSidebar = function() {
            QuickSidebar.hide();
        }; 

        $scope.$on('colModel', function(e, data) {
          	$scope.colModel = data;
        });        
        $scope.$on('applyRawFilters', function(e, data) {
			$scope.applyFilters($rootScope.rawFilters);
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

        $scope.applyFilters = function (data, noSlide, fromcol, column, defaultConf) {
            // $scope.currentList = $state.current.url.replace(":screen_id", $state.params.screen_id).replace("/", "");

            if (typeof($rootScope.lastFilterApplied) == 'undefined') {
            	$rootScope.lastFilterApplied = 0;
            }
            var difference = new Date().getTime() - $rootScope.lastFilterApplied;
            console.log("-----------------" + difference);
            if (difference < 1000) {
            	return false;
            }
            $rootScope.lastFilterApplied = new Date().getTime();

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
                    $.each($scope.colModel, function(_, v1) {
                        if(v.column.columnName.toLowerCase().replace(' ', '.') === v1.name.toLowerCase()) {
                            v.column.columnName = v1.label;
                        }
                    });
                });
            }

            var isInvalidValue = false;
            $.each(loopList, function(k, v) {
                if (v.condition.conditionNrOfValues && (!v.value || v.value == "Invalid date")) {
                    isInvalidValue = true;
                }
                $.each(v.value, function(k1,v1){
                	if (typeof(v1) != 'undefined') {
                		if (!v1) {
		                    isInvalidValue = true;
                		}
                	} else {
	                    isInvalidValue = true;
                	}
                })
            });
            if (isInvalidValue) {
                toastr.error("Please enter a value");
            	return false;
            }

            /*
            invalidDateFilters =  _.filter(loopList, function(obj) {
	            if (obj.column.columnType == 'Date' || obj.column.columnType == 'DateOnly') {
	            	hasInvalidDate = false;
                    if (!obj.value) {
                        return hasInvalidDate;
                    }
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
            */

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
                            $.each(differentColumns, function(k,v){
                            	v.isDuplicate = false;	
                            	$.each(data, function(k1,v1){
                            		if (v.column.columnName == v1.column.columnName && v.condition.conditionName == v1.condition.conditionName && JSON.stringify(v.value) == JSON.stringify(v1.value)) {
		                            	v.isDuplicate = true;	
                            		}
                            	})
                            	if (!v.isDuplicate) {
                            		data.push(v);
                            	}
                            })
                            // if (differentColumns) {
                            //     data = data.concat(differentColumns);
                            // }
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
                            if (v.column.columnValue.toLowerCase().indexOf("created") != -1 || v.column.columnValue.toLowerCase().indexOf("modified") != -1) {
                                v.column.dateType = "subtractTimezone";
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
        		if (!$scope.selectedConfig) {
	        		angular.element($(".clearFiltersSidebar")).scope().clearFilters();
        		}
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
                if (!v.unSaved || v.fromTreasurySummary) {
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

        $scope.$on("treasurySummaryFilters", function (event, data) {
            // This should only be applied from schedule dashboard calendar
            // $rootScope.$broadcast("filters-applied", data)
            $scope.globalFilters = _.filter($scope.globalFilters, function(v){
            	return !v.fromTreasurySummary;
            })
            console.log($rootScope.rawFilters);
            $scope.applyFilters(data, true, true);
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
                if (val.columnValue == '[Open]') {
                    val.columnValue = 'Open';
                }
                if (val.columnValue == '[Close]') {
                    val.columnValue = 'Close';
                }
           
                var newFilter = {
                    column: null,
                    condition: null,
                    filterOperator: val.filterOperator,
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
                            fromTreasurySummary: val.fromTreasurySummary,
                            ColumnType: val.column.columnType,
                            isComputedColumn: val.column.isComputedColumn,
                            ConditionValue: val.condition.conditionValue,
                            Values: _.toArray(val.value)
                        };

                        if(filter.columnValue === 'Open' || filter.columnValue === 'Close') {
                            filter.columnValue = '[' + filter.columnValue + ']';
                        }

                        if(val.filterOperator) {
                            filter.FilterOperator = val.filterOperator;
                        } else {
                            if(key === 0) {
                                filter.FilterOperator = 0;
                            } else {
                                filter.FilterOperator = 1;
                            }
                        }
                        if (val.column.dateType) {
                            filter.dateType = val.column.dateType;
                        }
                        // }
                        packedFilters.push(filter);
                    } else {
                        // toastr.error("Invalid configuration!");
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
            if ($state.current.name == "default.home" || $state.current.name == "default.dashboard-timeline") {
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
					if (value.columnRoute == "schedule-dashboard-calendar" && (value.columnValue == "VoyageDetail_DeliveryFrom" || value.columnValue == "VoyageDetail_DeliveryTo")  ) {
						if (ctrl.procurementSettings) {
							if (ctrl.procurementSettings.request.deliveryWindowDisplay.id == 2) {
								return;
							}
						}
					}
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
        	$scope.filtersConfigurations = null;
        	$scope.defaultConfiguration = null;
            $scope.noDefault = null;
            $scope.packedFilters = [];
        });
  
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

        $scope.clearValues = function(column, key) {
        	setTimeout(function(){
	        	$scope.$apply(function(){
		        	$scope.columnFilters[column][key]["value"] = null;
	        	})
        	})
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
			$scope.filtersConfigurations = null;
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
                    console.log($rootScope.rawFilters);
                    $.each($rootScope.rawFilters, function(k,v){
                    	if (v.fromTreasurySummary) {
                    		newVal.push(v);		
                    	}
                    })
                    resolve(newVal);

                    // }
                });
            });
        };
        $(document).on("mousedown", function(e) {
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
            $(".bootstrap-datetimepicker-widget").remove();
            $("*:not([tooltip])").tooltip("destroy");
            $("[tooltip][data-original-title]").tooltip({
                container: "body",
                placement: "auto"
            });
        };
        $scope.columnSort = function(table, column, order, sortColumn, columnObj) {

            if (!column || column === 'undefined') {
                column = _.get(columnObj, 'column.columnValue');
            }

            if (!sortColumn) {
                sortColumn = _.get(columnObj, 'column.columnValue');
            }

            $.each($rootScope.sortList, function(k, v) {
                if (v.columnValue == '[open]') {
                    v.columnValue = 'open';
                }
                if (v.columnValue == '[close]') {
                    v.columnValue = 'open';
                }
            });

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
                    $rootScope.sortList.push({ 
                    	columnValue: sortColumn.replace(/\./g, "_").toLowerCase(), 
                    	sortIndex: idx, 
                    	isComputedColumn: columnObj.column.isComputedColumn, 
                    	sortParameter: order, 
                    	col: column.replace(/\./g, "_").toLowerCase() 
                    });
                } else {
                	isComputedColumn = false;
                	if (columnObj.column) {
                		if (columnObj.column.isComputedColumn) {
		                	isComputedColumn = true;
                		}
                	}
                    $rootScope.sortList.push({ 
                    	columnValue: column.replace(/\./g, "_").toLowerCase(), 
                    	sortIndex: idx, 
                    	isComputedColumn: isComputedColumn, 
                    	sortParameter: order 
                    });
                }
            }

            $.each($rootScope.sortList, function(k, v) {
                if (v.columnValue == 'open' || v.columnValue == 'close') {
                    v.columnValue = '[' + v.columnValue + ']';
                }
            });

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
           //  setTimeout(function(){
	          //   if ($(".popover-filter-date").length > 0) {
			        // $compile($(".popover-filter-date"))(angular.element($(".popover-filter-date")).scope());
	          //   }
           //  })
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

        $scope.setDefaultConditionType = function(column, key){
            // console.log($scope.columnFilters[column][key]);
            // debugger;
            // only type text

            if (column == "IsVerified_Name") {
                $scope.columnFilters[column][key].column.columnType = "Bool";
            }

            if ($scope.columnFilters[column][key].column) {
		        if($scope.columnFilters[column][key].column.columnType == 'Text'){
		            // if the filter doesn't come from a configuration / filter isn't already set -> default only empty filters
		            if(!$scope.columnFilters[column][key].value && !$scope.columnFilters[column][key].condition) {

		                //find 'Contains' for type Tex and set that condition as default
		                $.each($scope.conditions, function(key_cond,val_cond){
		                    if(val_cond.conditionApplicable == "Text" && val_cond.conditionNrOfValues > 0) {
		                        if(val_cond.conditionName == "Contains") {
		                            $scope.columnFilters[column][key].condition = angular.copy(val_cond);
                                }
                            }
		                });
		            }
		        } 
            }
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

		$rootScope.applyFiltersOnEnter = function(){
			$(document).keypress(function(event){
				var keycode = (event.keyCode ? event.keyCode : event.which);
				if(keycode == '13'){
					if ($('custom-popover').is(":visible")) {
						if (typeof $rootScope.applyFiltersOnEnter == 'function') {
							$rootScope.applyFiltersOnEnter = null;	
							$("custom-popover .applyFilters").trigger("click");
							$scope.hidePopover();
						}
					}
				}
			});
		}
		if (typeof $rootScope.applyFiltersOnEnter == 'function') {
			$rootScope.applyFiltersOnEnter();
		}
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
