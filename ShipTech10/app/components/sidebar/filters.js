angular.module('shiptech.components').controller('FiltersController', [
    '$q',
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    '$filtersData',
    '$timeout',
    'filterConfigurationModel',
    '$compile',
    '$listsCache',
    '$tenantSettings',
    'CUSTOM_EVENTS',
    'tenantService',
    function($q, $rootScope, $scope, $state, $stateParams, $filtersData, $timeout, filterConfigurationModel, $compile, $listsCache, $tenantSettings, CUSTOM_EVENTS, tenantService) {
        $scope.filtersData = $filtersData;
        $scope.listsCache = $listsCache;
        $scope.tenantSettings = $tenantSettings;
        tenantService.procurementSettings.then((settings) => {
            ctrl.procurementSettings = settings.payload;
            if (($scope.currentList == 'schedule-dashboard-table'  || $scope.currentList == 'schedule-dashboard-calendar') && ctrl.procurementSettings.request.deliveryWindowDisplay.id == 2) {
                if ($scope.currentColumns) {
                    for (let i = $scope.currentColumns.length - 1; i >= 0; i--) {
                        if ($scope.currentColumns[i].columnValue == 'VoyageDetail_DeliveryFrom' || $scope.currentColumns[i].columnValue == 'VoyageDetail_DeliveryTo') {
                            $scope.currentColumns.splice(i, 1);
                        }
                    }
                }
            }
        });
        tenantService.scheduleDashboardConfiguration.then((settings) => {
            ctrl.scheduleDashboardConfiguration = settings.payload;
            let vesselType = _.find(ctrl.scheduleDashboardConfiguration.hiddenFields, function(object) {
                 return object.option.name == 'Vessel Type';
            });
            if ($scope.currentList == 'schedule-dashboard-calendar' && vesselType.hidden) {
                if ($scope.currentColumns) {
                    for (let i = $scope.currentColumns.length - 1; i >= 0; i--) {
                        if ($scope.currentColumns[i].columnValue == 'VesselType') {
                                $scope.currentColumns.splice(i, 1);
                        }
                    }
                }
            }
            let company = _.find(ctrl.scheduleDashboardConfiguration.hiddenFields, function(object) {
                 return object.option.name == 'Company';
            });
            if ($scope.currentList == 'schedule-dashboard-calendar' && company.hidden) {
                if ($scope.currentColumns) {
                    for (let i = $scope.currentColumns.length - 1; i >= 0; i--) {
                        if ($scope.currentColumns[i].columnValue == 'CompanyName') {
                                $scope.currentColumns.splice(i, 1);
                        }
                    }
                }
            }
        });

        console.log('init');
        $scope.noDefault = null;
        var ctrl = this;
        $rootScope.isDefaultConfig = null;
        ctrl.isSellerPortal = window.location.hash.indexOf('supplier-portal') > 0;
        $scope.$on('savedLayout', () => {
            if ($scope.$$listenerCount.savedLayout > 1) {
                $scope.$$listenerCount.savedLayout = 0;
            }
            if ($scope.selectedConfig) {
                $scope.createAndUpdateFilterConfig($scope.selectedConfig.id, $scope.selectedConfig.name, $rootScope.rawFilters, $scope.selectedConfig.isDefault, true);
            }
            $rootScope.clc_loaded = false;
            setTimeout(() => {
                $rootScope.lastLoadedListPayload = null;
	            $state.reload();
            });
        });

        ctrl.hideSidebar = function() {
            QuickSidebar.hide();
        };

        $scope.$on('colModel', (e, data) => {
          	$scope.colModel = data;
        });
        $scope.$on('applyRawFilters', (e, data) => {
            $scope.applyFilters($rootScope.rawFilters);
        });

        $rootScope.$on('breadcrumbs-filter-applied', (event, packedFilter, productTypeView) => {
            if (!productTypeView) {
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
                    for (let i = $scope.globalFilters.length - 1; i >= 0; i--) {
                        if ($scope.globalFilters[i].value.length > 0) {
                            if ($scope.globalFilters[i].value[0].toLowerCase() == packedFilter.value[0].toLowerCase()) {
                                $scope.globalFilters.splice(i, 1);
                            }
                        }
                    }
                }
            } else {
                if (!$scope.globalFilters[0].value) {
                    $scope.globalFilters = [];
                } 
            }

            	// Apply filters
            $scope.applyFilters($scope.globalFilters);
        });

        $scope.applyFilters = function(data, noSlide, fromcol, column, defaultConf) {
            // $scope.currentList = $state.current.url.replace(":screen_id", $state.params.screen_id).replace("/", "");

            if (typeof $rootScope.lastFilterApplied == 'undefined') {
            	$rootScope.lastFilterApplied = 0;
            }
            let difference = new Date().getTime() - $rootScope.lastFilterApplied;
            console.log(`-----------------${ difference}`);
            if (difference < 1000) {
            	return false;
            }
            $rootScope.lastFilterApplied = new Date().getTime();

            // console.log("_____________________", $scope.currentList);
            console.log(localStorage.getItem('persistentGlobalFilters'));
            if (localStorage.getItem('persistentGlobalFilters')) {
                data = angular.copy(JSON.parse(localStorage.getItem('persistentGlobalFilters')));
                $scope.globalFilters = angular.copy(JSON.parse(localStorage.getItem('persistentGlobalFilters')));
                localStorage.removeItem('persistentGlobalFilters');
            }

            $rootScope.listOfAppliedFiltersString = [];
            var hasRequestProductStatusFilter = false;
        	if ($scope.globalFilters) {
        		for (let i = 0; i < $scope.globalFilters.length; i++) {
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
            console.log(`$rootScope.listOfAppliedFiltersString : ${ $rootScope.listOfAppliedFiltersString}`);

            if(data) {
                if(data.clear) {
                    data = [];
                }

                var loopList = [];
                if($scope.currentList === 'schedule-dashboard-calendar') {
                    loopList = data.Filters;
                }else{
                    loopList = data;
                }
                $.each(loopList, (_, v) => {
                    $.each($scope.colModel, (_, v1) => {
                        if(v.column.columnName.toLowerCase().replace(' ', '.') === v1.name.toLowerCase()) {
                            v.column.columnName = v1.label;
                        }
                    });
                });
            }

            let isInvalidValue = false;
            $.each(loopList, (k, v) => {
                if (v.condition.conditionNrOfValues && (!v.value || v.value == 'Invalid date')) {
                    isInvalidValue = true;
                }
                $.each(v.value, (k1, v1) => {
                	if (typeof v1 != 'undefined') {
                		if (!v1) {
		                    isInvalidValue = true;
                		}
                	} else {
	                    isInvalidValue = true;
                	}
                });
            });
            if (isInvalidValue) {
                toastr.error('Please enter a value');
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
            if (typeof $scope.packedFilters == 'undefined') {
                $scope.packedFilters = {};
            }
            if (data && data.length > 0) {
                if (fromcol) {
                    $.each(data, (k, v) => {
                        v.unSaved = true;
                    });
                    if ($rootScope.rawFilters) {
                        var differentColumns = [];
                        let checkColumn = data[0].column.columnValue;
                        if ($rootScope.rawFilters.length > 0) {
                            // differentColumns = _.find($rootScope.rawFilters, function(o) {  return o && o.column.columnValue != checkColumn });
                            differentColumns = $rootScope.rawFilters.filter((o) => {
                                return o && o.column.columnValue != checkColumn;
                            });
                            $.each(differentColumns, (k, v) => {
                            	v.isDuplicate = false;
                            	$.each(data, (k1, v1) => {
                            		if (v.column.columnName == v1.column.columnName && v.condition.conditionName == v1.condition.conditionName && JSON.stringify(v.value) == JSON.stringify(v1.value)) {
		                            	v.isDuplicate = true;
                            		}
                            	});
                            	if (!v.isDuplicate) {
                            		data.push(v);
                            	}
                            });
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
                        $.each(data, (k, v) => {
                            if (v) {
                                if (v.column.columnValue == column) {
                                    data.splice(k, 1);
                                }
                            }
                        });
                    }
                    $.each(data, (k, v) => {
                        if (v && v.column && v.column.columnType.toLowerCase() == 'date') {
                            if ([ 'eta', 'etb' ].indexOf(v.column.columnValue.toLowerCase()) < 0) {
                                v.column.dateType = 'server';
                            }
                            if (v.column.columnValue.toLowerCase().indexOf('created') != -1 || v.column.columnValue.toLowerCase().indexOf('modified') != -1) {
                                v.column.dateType = 'subtractTimezone';
                            }
                        }
                    });
                }
                // console.log(data);
                // console.log(2,);
            } else {
                data = [];
            }

            if ($state.current.name == 'default.dashboard-timeline' || $state.current.name == 'default.home' || $state.current.name == 'default.schedule-dashboard-table' || $state.current.name == 'default.dashboard-table') {
                $scope.packedFilters = $scope.packFilters(angular.copy($scope.checkPackedFiltersBasedOnView(angular.copy(data))));
            } else {
                $scope.packedFilters = $scope.packFilters(data);
            }
            $scope.packedFilters.raw = $rootScope.rawFilters;
            $rootScope.filterForExport = angular.copy($scope.packedFilters);
            $rootScope.filtersAppliedOps = angular.copy(data);
            if (defaultConf) {
                $rootScope.timelineSaved = $scope.packedFilters;
            }
            $scope.formatHeaders(data);


            $scope.noDefault = false;
            if ($rootScope.sortList) {
                $scope.packedFilters.sortList = $rootScope.sortList;
            }
            if ($scope.packedFilters && !defaultConf || $scope.packedFilters && defaultConf && !column) {
                if ($rootScope.clc_loaded) {
                    // console.log(123)
                    if (!ctrl.saveFilterActionEvent) {
                        if ($state.current.name == 'default.dashboard-timeline' || $state.current.name == 'default.home' ||  $state.current.name == 'default.schedule-dashboard-table' || $state.current.name == 'default.dashboard-table') {
	                        $rootScope.$broadcast('filters-applied', $scope.packedFilters, false, $rootScope.productTypeView);
                        } else {
                            $rootScope.$broadcast('filters-applied', $scope.packedFilters);
                        }
                    } else {
                        ctrl.saveFilterActionEvent = false;
                        if ($state.current.name == 'default.dashboard-timeline' || $state.current.name == 'default.home' || $state.current.name == 'default.schedule-dashboard-table' || $state.current.name == 'default.dashboard-table') {
                            $rootScope.$broadcast('filters-applied', $scope.packedFilters, false, $rootScope.productTypeView);
                        }
                    }
                }
            }
            if (noSlide != true) {
                ctrl.hideSidebar();
            }
        };

        $scope.checkPackedFiltersBasedOnView = function(filters) {
            let arrayOfFilters = [];
            for (let i = 0; i < filters.length; i++) {
                let skipFilters = false;
                if ($rootScope.productTypeView && $rootScope.productTypeView.id == 1) {
                    if (filters[i].value[0] == 'Alkali Strategy' || filters[i].value[0] == 'Residue Strategy') {
                        skipFilters = true;
                    }
                }
                if ($rootScope.productTypeView && $rootScope.productTypeView.id == 2) {
                    if (filters[i].value[0] == 'Alkali Strategy' || filters[i].value[0] == 'Bunker Strategy') {
                        skipFilters = true;
                    }
                }
                if ($rootScope.productTypeView && $rootScope.productTypeView.id == 3) {
                    if (filters[i].value[0] == 'Residue Strategy' || filters[i].value[0] == 'Bunker Strategy') {
                        skipFilters = true;
                    }
                }
                if (!skipFilters) {
                    arrayOfFilters.push(filters[i]);
                }
            }

            console.log(arrayOfFilters);
            return arrayOfFilters;

        }

        $scope.formatHeaders = function(data) {
            $('.colMenu')
                .parent()
                .removeClass('unsavedFilteredColumn');
            $.each(data, (k, v) => {
                if (v.unSaved) {
                    $(`.colMenu[data-column="${ v.column.columnValue }"]`)
                        .parent()
                        .addClass('unsavedFilteredColumn');
                }
            });
        };

		$rootScope.$on("clearUnsavedFilters", () => {
        	if ($state.current.url == '/schedule-dashboard-table') {
        		if (!$scope.selectedConfig) {
	        		angular.element($('.clearFiltersSidebar')).scope().clearFilters();
        		}
        	} else {
	        	$scope.clearUnsavedFilters();
        	}
		} );


        $scope.clearUnsavedFilters = function() {
    		console.log('$scope.clearUnsavedFilters', new Date() - window.lastclearUnsavedFiltersCall);
        	if (new Date() - window.lastclearUnsavedFiltersCall < 5000) {
        		return;
        	}
        	window.lastclearUnsavedFiltersCall = new Date();
            let clearedFilters = [];
            $.each($rootScope.rawFilters, (k, v) => {
                if (!v.unSaved || v.fromTreasurySummary) {
                    clearedFilters.push(v);
                }
            });
            $rootScope.rawFilters = clearedFilters;
            $timeout(() => {
	            $scope.applyFilters($rootScope.rawFilters, true);
            });
        };

        $scope.$on('clearUnsavedFilters', (event) => {
            // This should only be applied from schedule dashboard calendar
            if ($scope.selectedConfig && $scope.selectedConfig.id != 0) {
	            $scope.loadSelectedConfig();
            } else {
            	$state.reload();
            }
        });

        $scope.$on('treasurySummaryFilters', (event, data) => {
            // This should only be applied from schedule dashboard calendar
            // $rootScope.$broadcast("filters-applied", data)
            $scope.globalFilters = _.filter($scope.globalFilters, (v) => {
            	return !v.fromTreasurySummary;
            });
            console.log($rootScope.rawFilters);
            $scope.applyFilters(data, true, true);
        });

        $scope.$on('applyDefaultConfiguration', (event, data, loadDef) => {
            $scope.selectedConfig = data;
            $scope.applyDefaultConfiguration(data, loadDef);
        });

        $scope.applyDefaultConfiguration = function(data, loadDef) {
            if (ctrl.saveFilterActionEvent) {
                return;
            }
            if ($state.current.name == 'default.dashboard-table') {
                data.filters = data.filters.replace('VoyageDetail_Request_Id', '(CASE WHEN VoyageDetail_Request_Id = 0 THEN NULL ELSE VoyageDetail_Request_Id END)');
            }
            $scope.globalFilters = [];
            // if new configuration, return
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
            var filtersList = data.filtersList;
            var sortList = data.sortList;

            $.each(filtersList, (key, val) => {
                if (val.columnValue == '[Open]') {
                    val.columnValue = 'Open';
                }
                if (val.columnValue == '[Close]') {
                    val.columnValue = 'Close';
                }

                let newFilter = {
                    column: null,
                    condition: null,
                    filterOperator: val.filterOperator,
                    value: []
                };
                if ($state.current.name == 'default.dashboard-table') {
                    if (val.columnValue == 'VoyageDetail_Request_Id') {
                        val.columnValue = '(CASE WHEN VoyageDetail_Request_Id = 0 THEN NULL ELSE VoyageDetail_Request_Id END)';
                    }
                }
                // check in current columns
                $.each($scope.currentColumns, (key2, val2) => {
                    if (val2.columnValue == val.columnValue) {
                        newFilter.column = val2;
                    }
                });
                // check values
                $.each($scope.conditions, (key2, val2) => {
                    if (val2.conditionValue == val.conditionValue) {
                        newFilter.condition = val2;
                    }
                });
                // add values
                $.each(val.values, (key2, val2) => {
                    newFilter.value.push(val2);
                });
                $scope.globalFilters.push(newFilter);
                if (newFilter.column.columnRoute === 'schedule-dashboard-calendar' && newFilter.column.columnName == 'Port Status') {
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
        	$scope.globalFilters = [ {} ];
        	if (localStorage.getItem('persistentGlobalFilters')) {
	        	$scope.globalFilters = angular.copy(JSON.parse(localStorage.getItem('persistentGlobalFilters')));
	        	$scope.applyFilters($scope.globalFilters);
        	}
        };

        $scope.$watch('selectedConfig', () => {
        	// $rootScope.persistentGlobalFilters = angular.copy($scope.globalFilters);

        	if (!$scope.selectedConfig) {
        		// debugger;
        	}
        }, true);

        $rootScope.$on('changeTimeScale', () => {
        	if ($scope.globalFilters) {
        		if (!_.isEmpty($scope.globalFilters[0].column)) {
		        	localStorage.setItem('persistentGlobalFilters', JSON.stringify(angular.copy($scope.globalFilters)));
        		}
        	}
        });

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
            setTimeout(() => {
	            ctrl.saveFilterActionEvent = false;
            	$scope.$apply();
            });
        };
        $scope.packFilters = function(data) {
            if (!data) {
                data = [];
            }
            $rootScope.rawFilters = angular.copy(data);
            var packedFilters = [];
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
                $.each(data, (key, val) => {
                    if (!_.isEmpty(val) && !_.isEmpty(val.column)) {
                        // console.log(val);
                        let filter = {
                            columnValue: val.column.columnValue,
                            fromTreasurySummary: val.fromTreasurySummary,
                            ColumnType: val.column.columnType,
                            isComputedColumn: val.column.isComputedColumn,
                            ConditionValue: val.condition.conditionValue,
                            Values: _.toArray(val.value)
                        };

                        if(filter.columnValue === 'Open' || filter.columnValue === 'Close') {
                            filter.columnValue = `[${ filter.columnValue }]`;
                        }

                        if(val.filterOperator) {
                            filter.FilterOperator = val.filterOperator;
                        } else if(key === 0) {
                            filter.FilterOperator = 0;
                        } else {
                            filter.FilterOperator = 1;
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
            if ($state.current.url.indexOf(':screen_id') > -1) {
                $scope.currentList = $state.current.url.replace(':screen_id', $state.params.screen_id).replace('/', '');
            } else {
                $scope.currentList = $state.current.url.replace('/', '');
                if($scope.currentList.includes("new-request")) {
                    $scope.currentList = $scope.currentList.replace('new-request', 'edit-request');
                }
            }

            if ($rootScope.isModal) {
                var list = $scope.currentList.split('/')[0];
                $scope.currentList = `${list }/${ $rootScope.modalTableId}`;
            }
            // console.log(modalTableId)
            if ($state.current.name == 'default.home' || $state.current.name == 'default.dashboard-timeline') {
                $scope.currentList = 'schedule-dashboard-calendar';
            }
            if ($scope.currentList == 'contract-planning/') {
                $scope.currentList = 'contract-planning';
            }
            if ($scope.currentList.indexOf('contract-planning') >= 0) {
                $scope.currentList = 'contract-planning';
            }
            if ($scope.currentList.indexOf(':entity_id') > -1) {
                $scope.currentList = $scope.currentList.replace('/:entity_id', '');
            }
            if ($scope.currentList.indexOf('/:') && $scope.currentList != 'edit-request/:requestId') {
                $scope.currentList = $scope.currentList.split('/:')[0];
            }
            console.log('currentList', $scope.currentList);
            // console.log('$scope.filtersData',$scope.filtersData);
            $scope.currentColumns = [];
            if($rootScope.rawFilters === undefined) {
                $rootScope.rawFilters = [];
            }
            $rootScope.CheckForFilters = 0;
            $scope.conditions = $scope.filtersData.filterConditions;
            $.each($scope.filtersData.filterColumns, (key, value) => {
                if (value.columnRoute == $scope.currentList) {
                    // if(value.columnType == 'Number') value.columnType = 'longNumber';
                    //
                    if ($scope.tenantSettings.companyDisplayName == 'Pool') {
                        value.columnName = value.columnName.replace('Carrier', $scope.tenantSettings.companyDisplayName.name);
                    }
                    value.columnName = value.columnName.replace('Company', $scope.tenantSettings.companyDisplayName.name);
                    value.columnName = value.columnName.replace('Service', $scope.tenantSettings.serviceDisplayName.name);
                    if ((value.columnRoute == 'schedule-dashboard-table' || value.columnRoute == 'schedule-dashboard-calendar') && (value.columnValue == 'VoyageDetail_DeliveryFrom' || value.columnValue == 'VoyageDetail_DeliveryTo')) {
                        if (ctrl.procurementSettings) {
                            if (ctrl.procurementSettings.request.deliveryWindowDisplay.id == 2) {
                                return;
                            }
                        }
                    }
                    if (value.columnRoute  == 'schedule-dashboard-calendar' && value.columnValue == 'VesselType') {
                        if (ctrl.scheduleDashboardConfiguration) {
                            let vesselType = _.find(ctrl.scheduleDashboardConfiguration.hiddenFields, function(object) {
                                return object.option.name == 'Vessel Type';
                            });
                            if (vesselType.hidden) {
                                return;
                            }                         
                        }
                    }

                    if (value.columnRoute  == 'schedule-dashboard-calendar' && value.columnValue == 'CompanyName') {
                        if (ctrl.scheduleDashboardConfiguration) {
                            let company = _.find(ctrl.scheduleDashboardConfiguration.hiddenFields, function(object) {
                                return object.option.name == 'Company';
                            });
                            if (company.hidden) {
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
                $timeout(() => {
                    if(typeof ctrl.hideSidebar == 'function') {
                        ctrl.hideSidebar();
                    }
                });
            }
            console.log('$rootScope.CheckForFilters', $rootScope.CheckForFilters);
        };
        $scope.createFilters();
        $scope.clearFilters = function(noSlide) {
            $scope.globalFilters = [];
            $rootScope.isDefaultConfig = $scope.selectedConfig;
            $scope.selectedConfig = null;
            $rootScope.timelineSaved = null;
            $rootScope.saveFiltersTimeline = $rootScope.saveFiltersDefaultTimeline;
            $rootScope.saveFiltersDefaultTimeline = null;
            $rootScope.activeBreadcrumbFilters = null;
            let data = {
                clear: true
            };
            $scope.applyFilters(data, noSlide);
        };
        $scope.clearCurrentLine = function(index, where, column) {
            if (column) {
                $scope.pageFilters[column][index].value = [];
                if (where == 'column') {
                    $scope.pageFilters[column][index].condition = {};
                }
            } else if ($scope.globalFilters[index]) {
                // delecte condition value if column/condition is changed
                $scope.globalFilters[index].value = [];
                // delete contition when column name is changed
                if (where == 'column') {
                    $scope.globalFilters[index].condition = {};
                }
            }
        };

        $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            let array = [ 'Schedule Dashboard', 'Schedule Dashboard', 'Schedule Dashboard Timeline' ];
            if (array.indexOf(toParams.path[1] && toParams.path[1].label) != -1 && $rootScope.startView) {
                $rootScope.clc_loaded = false;
                if (toParams.path[1] && toParams.path[1].label == 'Schedule Dashboard Timeline') {
                    $rootScope.isTimelineFiltersDefault = true;
                } else {
                    $rootScope.isTimelineFiltersDefault = false;
                }
                $scope.globalFilters = [];
                $rootScope.listOfAppliedFiltersString = [];
                $rootScope.rawFilters = [];
                $scope.createFilters();
                $scope.getDefaultFiltersConfiguration();
                $scope.getFiltersConfigurations();
            }
        });

        var deregisterStateChangeStart = $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            $rootScope.clc_loaded = false;
            if (toParams.path[1] && toParams.path[1].label == 'Schedule Dashboard Timeline') {
                $rootScope.isTimelineFiltersDefault = true;
            } else {
                $rootScope.isTimelineFiltersDefault = false;
            }
            $scope.globalFilters = [];
            $rootScope.listOfAppliedFiltersString = [];
            $rootScope.startView = true;
            $rootScope.rawFilters = [];
            $scope.createFilters();
            $scope.getDefaultFiltersConfiguration();
            $scope.getFiltersConfigurations();

            deregisterStateChangeStart();
        });

        $rootScope.$on('filtersTimelineDefault', () => {
            $rootScope.clc_loaded = false;
            $scope.globalFilters = [];
            $rootScope.listOfAppliedFiltersString = [];
            $rootScope.rawFilters = [];
            $scope.createFilters();
            $scope.getDefaultFiltersConfiguration();
            $scope.getFiltersConfigurations();
        });

	    angular.element(document).ready(() => {
		    // $rootScope.clc_loaded = false;
            // $scope.globalFilters = [{}];
            // console.log("$rootScope.rawFilters", $rootScope.rawFilters);
            // $rootScope.rawFilters = [];
            $scope.createFilters();
            if (typeof $scope.getDefaultFiltersConfiguration == 'function') {
	            $scope.getDefaultFiltersConfiguration();
            }
            if (typeof $scope.getFiltersConfigurations == 'function') {
	            $scope.getFiltersConfigurations();
            }
            // $rootScope.CheckForFilters = 1
	    });
        $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams) => {
        	$scope.filtersConfigurations = null;
        	$scope.defaultConfiguration = null;
            $scope.noDefault = null;
            $scope.packedFilters = [];
        });


        $scope.formatDate = function(elem, dateFormat) {
            // console.log(1)
            if (elem) {
                var formattedDate = elem;
                let date = Date.parse(elem);
                date = new Date(date);
                if (date) {
                    let utc = date.getTime() + date.getTimezoneOffset() * 60000;
                    // return utc;
                    dateFormat = dateFormat.replace(/d/g, 'D').replace(/y/g, 'Y');
                    formattedDate = fecha.format(utc, dateFormat);
                }
                // console.log(formattedDate)
                return formattedDate;
            }
        };
        $scope.getDefaultFiltersConfiguration = function(fromSave) {
            if ($scope.currentList.contains('invoices/invoice/')) {
                return;
            }
        	if (localStorage.getItem('persistentGlobalFilters') || !fromSave && $scope.defaultConfiguration) {
        		return;
        	}

            if ($rootScope.isTimelineFiltersDefault) {
                $rootScope.isTimelineFiltersDefault = false;
                return;
            }

            let data = $scope.currentList;
            $scope.defaultConfiguration = null;
            filterConfigurationModel
                .getDefaultFiltersConfiguration(data)
                .then((response) => {
                    console.log('----');
                    console.log('Filters');
                    $rootScope.isRefresh = true;
                    $scope.defaultConfiguration = response.payload;
                    if (!response.payload && !fromSave) {
                    	$rootScope.$broadcast('filters-applied', []);
                    }
                    if ($scope.defaultConfiguration != null) {
                        $rootScope.clearDefaultFilters = true;
                        var retVal = $scope.applyDefaultConfiguration($scope.defaultConfiguration, true);
                        $rootScope.savedDefaultFilters = $scope.defaultConfiguration.filters;
                        $scope.selectedConfig = $scope.defaultConfiguration;
                        $rootScope.isDefaultConfig = $scope.selectedConfig;
                        if ($state.current.name == 'default.dashboard-timeline' || $state.current.name == 'default.dashboard-calendar') {
                            $rootScope.saveFiltersDefaultTimeline = $scope.defaultConfiguration.filtersList;
                        }
                        $scope.enableDisableDeleteLayout($scope.selectedConfig);
                        // selected != default
                        // but if default exists, set as selected initially
                    } else {
                        // $scope.selectedConfig = {
                        //     id: 0
                        // };
                        $scope.noDefault = true;
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };

        $scope.clearValues = function(column, key) {
        	setTimeout(() => {
	        	$scope.$apply(() => {
		        	$scope.columnFilters[column][key].value = null;
	        	});
        	});
        };

        $scope.createAndUpdateFilterConfig = function(id, name, data, isDefault, menuZone, table) {
            // configuration must have at least one filter
            console.log($rootScope);
            // console.log($scope.$parent.CLC.tableParams)
            if (!table) {
                table = $rootScope.listTableSelector;
            }
            if (data) {
                if (data.length == 0 && !menuZone) {
                    toastr.error('Configuration must have at least one filter');
                    return;
                }
                var filtersList = $scope.packFilters(data);
                for (var i = 0; i < filtersList.length; i++) {
                    if (filtersList[i].ColumnType == 'Date') {
                        for (var j = 0; j < filtersList[i].Values.length; j++) {
                             filtersList[i].Values[j] =  moment.utc(filtersList[i].Values[j]).format('YYYY-MM-DD');
                        }
                        console.log(filtersList[i]);
                    }
             
                 }

              
            } else {
                filtersList = [];
            }

         
            if (name == 'Add new configuration') {
                var no = $scope.filtersConfigurations.length - 1;
                name = `Configuration ${ no}`;
                // name = 'Test Configuration ';
            }
            let route = $scope.currentList;
            var sortList = $rootScope.sortList;

            // form payload
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
                .then((response) => {
                    console.log(response);
                    toastr.success('Configuration saved!');

                    // $state.reload();globalFilters
                    if (route == 'schedule-dashboard-calendar' || route == 'schedule-dashboard-table') {
                        $scope.filtersConfigurations = null;
                        $scope.getFiltersConfigurations();
                        $scope.getDefaultFiltersConfiguration(true);
                    }
                })
                .catch((error) => {
		            ctrl.saveFilterActionEvent = false;
                    console.log(error);
                });
        };
        $scope.getFiltersConfigurations = function() {
            if (!$scope.filtersConfigurations) {
                let data = $scope.currentList;
                // $scope.filtersConfigurations = null;
                filterConfigurationModel.getFiltersConfigurations(data).then((response) => {
                    let data = response.payload;
                    if ($scope.currentList.contains('invoices/invoice/')) {
                        let responseGet = response.payload;
                        if (responseGet) {
                            for (let i = 0; i < responseGet.length; i++) {
                                if (responseGet[i] && responseGet[i].isDefault == true) {
                                    $scope.defaultConfiguration = responseGet[i];
                                    break;
                                }
                            }
                        }
                        if (!responseGet) {
                            $rootScope.$broadcast('filters-applied', []);
                        }
                        if ($scope.defaultConfiguration != null) {
                            var retVal = $scope.applyDefaultConfiguration($scope.defaultConfiguration, true);
                            $scope.selectedConfig = $scope.defaultConfiguration;
                            $scope.enableDisableDeleteLayout($scope.selectedConfig);
                        }
                    }
                    $scope.filtersConfigurations = data;
                    $scope.filtersConfigurations.unshift({
                        id: 0,
                        route: $scope.currentList,
                        name: 'Add new configuration'
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
            if ($state.current.name == 'default.dashboard-timeline' || $state.current.name == 'default.home') {
                $rootScope.deleteTimelineConfiguration = true;
            }
            let data = selectedConfig.id;
            $scope.filtersConfigurations = null;
            $rootScope.timelineSaved = null;
            $rootScope.saveFiltersDefaultTimeline = null;
            filterConfigurationModel
                .deleteConfiguration(data)
                .then((response) => {
                    console.log(response);
                    toastr.success('Configuration deleted!');
                    $timeout(() => {
                        $state.reload();
                        if ($state.current.name == 'default.dashboard-timeline' || $state.current.name == 'default.home' || $state.current.name == 'default.dashboard-table') {
                            $rootScope.$broadcast('filters-removed', $rootScope.productTypeView);
                        }
                    }, 1000);
                })
                .catch((error) => {
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
            return $q((resolve, reject) => {
                // send default config to table build
                // no default config, send false
                if($state.current.url == '/all-requests-table' && $rootScope.rawFilters.length == 0) {
                    $rootScope.rawFilters = [
                        {
                            "column": {
                                "columnRoute": "all-requests-table",
                                "columnName": "Request Date",
                                "columnValue": "RequestDate",
                                "sortColumnValue": null,
                                "columnType": "Date",
                                "isComputedColumn": false
                            },
                            "condition": {
                                "conditionName": "Is after or equal to",
                                "conditionValue": ">=",
                                "conditionApplicable": "Date",
                                "conditionNrOfValues": 1
                            },
                            "filterOperator": 0,
                            "value": [
                                moment().subtract(1, 'months').format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ')
                            ]
                        },
                        {
                            "column": {
                                "columnRoute": "all-requests-table",
                                "columnName": "Request Status",
                                "columnValue": "RequestStatus_DisplayName",
                                "sortColumnValue": null,
                                "columnType": "Text",
                                "isComputedColumn": false
                            },
                            "condition": {
                                "conditionName": "Is not",
                                "conditionValue": "!=",
                                "conditionApplicable": "Text",
                                "conditionNrOfValues": 1
                            },
                            "filterOperator": 0,
                            "value": [
                                "CANCELLED"
                            ]
                        }
                    ]                    
                }
                
                if ($rootScope.rawFilters && $state.current.url != '/schedule-dashboard-table') {
                    $scope.packedFilters = $scope.packFilters($rootScope.rawFilters);
                    $scope.packedFilters.raw = $rootScope.rawFilters;
                    
                    if ($rootScope.sortList) {
                        $scope.packedFilters.sortList = $rootScope.sortList;
                    }
                }
                
                if($state.current.url == '/all-requests-table') {
                    $rootScope.filterForExport = angular.copy($scope.packedFilters);
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
            return $q((resolve, reject) => {
                // send default config to table build
                // no default config, send false
                $scope.$watch('currentColumns', (newVal) => {
                    // if (newVal != null) {
                    // console.log(newVal)
                    resolve(newVal);

                    // }
                });
            });
        };
        $rootScope.getGlobalFilters = function() {
            return $q((resolve, reject) => {
                // send default config to table build
                // no default config, send false
                $scope.$watch('globalFilters', (newVal) => {
                    // if (newVal != null) {
                    // console.log(newVal)
                    console.log($rootScope.rawFilters);
                    $.each($rootScope.rawFilters, (k, v) => {
                    	if (v.fromTreasurySummary) {
                    		newVal.push(v);
                    	}
                    });
                    resolve(newVal);

                    // }
                });
            });
        };

        var clickedOnScrollbar = function(mouseX){
          if( $(window).outerWidth() <= mouseX ){
            return true;
          }
        }
        $(document).on('mousedown', (e) => {
            // check that your clicked
            // element has no id=info
            // and is not child of info
            // console.log(e.target)
            // console.log($("#customPopover").find(e.target).length)
            if (!$(e.target).hasClass('colMenu')) {
                if (!clickedOnScrollbar(e.clientX) && e.target.id != 'customPopover' && !$('#customPopover').find(e.target).length && !$(e.target).hasClass('miunsAct')) {
                    $scope.hidePopover();
                }
            }
        });
        $scope.hidePopover = function() {
        	$('custom-popover').remove();
            $('.bootstrap-datetimepicker-widget').remove();
            $('*:not([tooltip])').tooltip('destroy');
            $('[tooltip][data-original-title]').tooltip({
                container: 'body',
                placement: 'auto'
            });
        };
        $scope.columnSort = function(table, column, order, sortColumn, columnObj) {
            if (!column || column === 'undefined') {
                column = _.get(columnObj, 'column.columnValue');
            }

            if (!sortColumn) {
                sortColumn = _.get(columnObj, 'column.columnValue');
            }

            $.each($rootScope.sortList, (k, v) => {
                if (v.columnValue == '[open]') {
                    v.columnValue = 'open';
                }
                if (v.columnValue == '[close]') {
                    v.columnValue = 'open';
                }
            });

            if ($rootScope.sortList && $rootScope.sortList.length > 0) {
                $.each($rootScope.sortList, (k, v) => {
                    if (v) {
                        if (sortColumn) {
                            if (v.sortColumnValue && v.sortColumnValue.toLowerCase() == sortColumn.toLowerCase() || v.columnValue.toLowerCase() == sortColumn.toLowerCase()) {
                                $rootScope.sortList.splice(k, 1);
                            }
                        } else if (v.columnValue.toLowerCase() == column.toLowerCase()) {
                            $rootScope.sortList.splice(k, 1);
                        }
                    }
                });
            }

            var idx = $rootScope.sortList && $rootScope.sortList.length > 0 ? _.maxBy($rootScope.sortList, 'sortIndex').sortIndex + 1 : 0;

            if (order > 0) {
                if (sortColumn) {
                    $rootScope.sortList.push({
                    	columnValue: sortColumn.replace(/\./g, '_').toLowerCase(),
                    	sortIndex: idx,
                    	isComputedColumn: columnObj.column.isComputedColumn,
                    	sortParameter: order,
                    	col: column.replace(/\./g, '_').toLowerCase()
                    });
                } else {
                    var isComputedColumn = false;
                	if (columnObj.column) {
                		if (columnObj.column.isComputedColumn) {
		                	isComputedColumn = true;
                		}
                	}
                    $rootScope.sortList.push({
                    	columnValue: column.replace(/\./g, '_').toLowerCase(),
                    	sortIndex: idx,
                    	isComputedColumn: isComputedColumn,
                    	sortParameter: order
                    });
                }
            }

            $.each($rootScope.sortList, (k, v) => {
                if (v.columnValue == 'open' || v.columnValue == 'close') {
                    v.columnValue = `[${ v.columnValue }]`;
                }
            });

            $scope.applyFilters($rootScope.rawFilters);

            $scope.hidePopover();
        };
        $scope.appendFilters = function(obj) {
            $timeout(() => {
                $scope.$apply(() => {
                    $scope.globalFilters.push(data);
                });
            });
        };
        $scope.checkColumnFilters = function(column) {
            if (typeof $scope.columnFilters == 'undefined') {
                $scope.columnFilters = {};
                $scope.columnFilters[column] = [];
            }
            var filters = $rootScope.rawFilters;

            $.each(filters, (k, v) => {
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
            if (column == 'Eta' && window.location.href.includes("invoices/deliveries") != -1) {
                $rootScope.etaCleared = true;
            }
            $scope.columnFilters[column] = [];
            var newFilter = [];
            $.each($rootScope.rawFilters, (k, v) => {
                if (v.column.columnValue != column) {
                    newFilter.push(v);
                }
            });
            $rootScope.rawFilters = newFilter;
            $scope.applyFilters($rootScope.rawFilters);
        };


        $scope.verifyValue = function(element) {
            if (window.location.href.indexOf("all-requests-table") != -1 || window.location.href.indexOf("order-list") != -1) {
                for (var i = 0; i < $rootScope.filtersAppliedOps.length; i++) {
                    $rootScope.rawFilters[i] = angular.copy($rootScope.filtersAppliedOps[i]);
                }
            }
           
        }

        $scope.setDefaultConditionType = function(column, key) {
            // console.log($scope.columnFilters[column][key]);
            // debugger;
            // only type text

            if (column == 'IsVerified_Name') {
                $scope.columnFilters[column][key].column.columnType = 'Bool';
            }

            if ($scope.columnFilters[column][key].column) {
		        if($scope.columnFilters[column][key].column.columnType == 'Text') {
		            // if the filter doesn't come from a configuration / filter isn't already set -> default only empty filters
		            if(!$scope.columnFilters[column][key].value && !$scope.columnFilters[column][key].condition) {
		                // find 'Contains' for type Tex and set that condition as default
		                $.each($scope.conditions, (key_cond, val_cond) => {
		                    if(val_cond.conditionApplicable == 'Text' && val_cond.conditionNrOfValues > 0) {
		                        if(val_cond.conditionName == 'Contains') {
		                            $scope.columnFilters[column][key].condition = angular.copy(val_cond);
                                }
                            }
		                });
		            }
		        }
            }
        };

        $scope.enableDisableDeleteLayout = function(isDisabled) {
        	if (isDisabled) {
        		if (isDisabled.id != 0) {
        			$('.st-content-action-icons .delete_layout').css('opacity', 1);
        			$('.st-content-action-icons .delete_layout').css('pointer-events', 'initial');
        		} else {
        			$('.st-content-action-icons .delete_layout').css('opacity', 0.3);
        			$('.st-content-action-icons .delete_layout').css('pointer-events', 'none');
        		}
        	} else {
        			$('.st-content-action-icons .delete_layout').css('opacity', 0.3);
        			$('.st-content-action-icons .delete_layout').css('pointer-events', 'none');
        	}
        };

        $rootScope.$on('enableDisableDeleteLayout', (event, isDisabled) => {
            $scope.enableDisableDeleteLayout(isDisabled);
        });

        // $scope.getDefaultFiltersConfiguration()

        $rootScope.applyFiltersOnEnter = function() {
            $(document).keypress((event) => {
                let keycode = event.keyCode ? event.keyCode : event.which;
                if(keycode == '13') {
                    if ($('custom-popover').is(':visible')) {
                        if (typeof $rootScope.applyFiltersOnEnter == 'function') {
                            $rootScope.applyFiltersOnEnter = null;
                            $('custom-popover .applyFilters').trigger('click');
                            $scope.hidePopover();
                        }
                    }
                }
            });
        };
        if (typeof $rootScope.applyFiltersOnEnter == 'function') {
            $rootScope.applyFiltersOnEnter();
        }
    }
]);
angular.module('shiptech.components').component('filters', {
    templateUrl: 'components/sidebar/views/filters.html',
    controller: 'FiltersController',
    bindings: {
        settings: '='
    }
});
// angular.module("shiptech.components").component("filtersWidget", {
//     templateUrl: "components/sidebar/views/filters-widget.html",
//     controller: "FiltersController",
//     bindings: {
//         settings: "="
//     }
// });
angular.module('shiptech').directive('filtersWidget', () => {
    return {
        templateUrl: 'components/sidebar/views/filters-widget.html',
        controller: 'FiltersController'
    };
});
