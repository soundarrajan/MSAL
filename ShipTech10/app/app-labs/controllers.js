/**
 * Labs Controller
 */
APP_LABS.controller('Controller_Labs', ['$scope', '$rootScope', '$Api_Service', 'Factory_Labs', '$state', '$location', '$q', '$compile', '$timeout', 'Factory_Master', '$listsCache', '$filter', 'statusColors', function ($scope, $rootScope, $Api_Service, Factory_Labs, $state, $location, $q, $compile, $timeout, Factory_Master, $listsCache, $filter, statusColors) {
    var vm = this;
    var guid = '';
    vm.master_id = $state.params.master_id;
    vm.entity_id = $state.params.entity_id;
    $scope.addedFields = new Object;
    vm.response = "";
    vm.ids = '';
    if ($state.params.path) {
        vm.app_id = $state.params.path[0].uisref.split('.')[0];
    }
    if ($scope.screen) {
        vm.screen_id = $scope.screen;
    } else {
        vm.screen_id = $state.params.screen_id;
    }
    $rootScope.$on('formValues', function (event, data) {
        $scope.formValues = data;
        // $scope.reconMatchDisplayName();
        $scope.setStatusForHeader('init');
        $scope.registerDropdowns();
        $.each($scope.formFields, function(index, value) {
            $.each(value.children, function(key, val) {
            	if ($scope.formValues.status.name == 'Verified') {
            		val.disabled = true;
            		val.Disabled = true;
            	}	
            });
        });

    });

    $scope.setStatusForHeader = function (value) {
        // value is true or false
        // only statuses that can be calculated are 3,4
        // for 5 (failed) and 2 (verified), display status but do not allow recalculation
        // 4 is passed (in spec), 3 is failed (off spec)
        if (typeof value == 'undefined') return;
        if (value == 'init') {
            if (typeof ($scope.formValues.status) != 'undefined') {
                if ($scope.formValues.status.name) {
                    if (!$state.params.status_labs) {
                        $state.params.status_labs = {};
                    }

                    $state.params.status_labs = angular.copy($scope.formValues.status);
                    $state.params.status_labs.bg = statusColors.getColorCodeFromLabels(
                        $state.params.status_labs,
                        $listsCache.ScheduleDashboardLabelConfiguration);
                    $state.params.status_labs.color = 'white';
                }
            } else {
                $state.params.status_labs = null;
            }
        } else {

            if (typeof $state.params.status_labs == 'undefined') {
                $state.params.status_labs = {};
                //return;
            }
            //invalid
            if ($scope.formValues.status.id == 5) return;
            //verified
            if ($scope.formValues.status.id == 2) return;

            $.each($listsCache.LabResultStatus, function (key, val) {
                if (value && val.id == 4) {
                    $scope.formValues.status = val;
                }
                if (!value && val.id == 3) {
                    $scope.formValues.status = val;
                }
                $state.params.status_labs = angular.copy($scope.formValues.status);
                $state.params.status_labs.bg = statusColors.getColorCodeFromLabels(
                    $state.params.status_labs,
                    $listsCache.ScheduleDashboardLabelConfiguration);
                $state.params.status_labs.color = "white";
            });
        }
    }

    $scope.reconMatchDisplayName = function (setOnTheFly, value) {
        if (!setOnTheFly) {
            $.each($listsCache.QualityMatch, function (key, val) {
                if (val.id == $scope.formValues.reconMatch.id) {
                    $scope.formValues.reconMatch.displayName = val.displayName;
                }
            })
        } else {
            // if set on the fly, value is true or false
            // 1 is passed, 2 id failed
            if (typeof $state.params.status == 'undefined') return;
      
            $.each($listsCache.QualityMatch, function (key, val) {
                if (value && val.id == 1) {

                    $scope.formValues.reconMatch = val;
                }
                if (!value && val.id == 2) {
                    $scope.formValues.reconMatch = val;
                }
                $state.params.status.name = $scope.formValues.reconMatch.name;
                $state.params.status.displayName = $scope.formValues.reconMatch.displayName;
                $state.params.status.bg = statusColors.getColorCodeFromLabels(
                    $scope.formValues.reconMatch,
                    $listsCache.ScheduleDashboardLabelConfiguration);
            });

        }
        // console.log($listsCache.QualityMatch);
        // console.log($scope.formValues.reconMatch);
    }

    $scope.registerDropdowns = function () {
        var field = new Object;
        field = vm.formFieldSearch($scope.formFields, 'delivery');
        if (field) vm.getOptions(field);
        field = vm.formFieldSearch($scope.formFields, 'product');
        if (field) vm.getOptions(field);
        delete field;
    }

    $scope.triggerChangeFieldsAppSpecific = function (name, id) {
    
        if (name == 'OrderID' && id == "order") {
            //suprascriem niste date
            Factory_Master.get_master_entity($scope.formValues.order.id, 'orders', 'orders', function (response) {
                if (response) {
                    $scope.thirdParty = {}
                    if ($scope.formValues.delivery) {
                        del = $scope.formValues.delivery.id;
                    } else {
                        del = '';
                    }
                    if ($scope.formValues.name) {
                        lab = $scope.formValues.name;
                    } else {
                        lab = 'Lab New';
                    }
                    $state.params.title = $scope.formValues.order.name + "- DEL - " + del + ' - ' + lab;
                    if (typeof ($scope.formValues.vessel) == 'undefined') {
                        $scope.formValues.vessel = {}
                    }
                    if (typeof ($scope.formValues.barge) == 'undefined') {
                        $scope.formValues.barge = {}
                    }
                    $scope.labOrderSummary = response;
                    if (response.seller) {
                        $scope.formValues.seller = response.seller.name;
                        $scope.thirdParty.seller = response.seller.name
                    }
                    if (response.buyer) {
                        $scope.formValues.buyer = response.buyer.name;
                    }
                    if (response.vessel) {
                        $scope.formValues.vessel = response.vessel;
                        $scope.thirdParty.vessel = response.vessel.name
                    }
                    if (response.location) {
                        $scope.formValues.port = response.location.name;
                    }
                    if (response.paymentCompany) {
                        $scope.formValues.company = response.paymentCompany;
                    }
                    if (response.surveyorCounterparty && !$scope.formValues.surveyor) {
                        $scope.formValues.surveyor = response.surveyorCounterparty;
                        $scope.formValues.surveyorName = response.surveyorCounterparty.name;
                        $scope.thirdParty.surveyor = response.surveyorCounterparty.name
                    }
                    if (response.barge) {
                        $scope.thirdParty.barge = response.barge.name
                    }
                    if (response.phisycalSupplier) {
                        $scope.thirdParty.phisycal_supplier = response.phisycalSupplier.name
                    }
                    if (response.broker) {
                        $scope.thirdParty.broker = response.broker.name
                    }
                    if (response.lab) {
                        $scope.thirdParty.labs = response.lab.name
                        if (!$scope.formValues.counterparty) {
	                        $scope.formValues.counterparty = response.lab
                        }
                    }
                    if (response.products) {
                        $scope.temp = {
                            products: response.products
                        }
                        if ($scope.formValues.product) {
                            fil = $filter('filter')($scope.temp.products, { product: { id: $scope.formValues.product.id } })[0];
                            if (fil) {
                                $scope.formValues.specGroup = fil.specGroup.name;
                            }
                        }
                    }
                    //retrigger de dropdowns delivery, labs, products
                    var field = new Object;
                    field = vm.formFieldSearch($scope.formFields, 'delivery');
                    if (field) vm.getOptions(field);
                    field = vm.formFieldSearch($scope.formFields, 'product');
                    if (field) vm.getOptions(field);
                    delete field;
                    if (typeof ($scope.formValues.reconMatch) != 'undefined') {
                        if ($scope.formValues.reconMatch.name) {
                            // $state.params.title = "DEL - " + delID + " - " + $scope.formValues.order.name + ' - ' + $scope.formValues.temp.deliverysummary.vesselName;
                            // $state.params.title = 'CTRL' + $scope.formValues.name;
                            $scope.reconMatchDisplayName();
                            if (!$state.params.status) {
                                $state.params.status = {};
                            }
                            $state.params.status.name = $scope.formValues.reconMatch.name;
                            $state.params.status.displayName = $scope.formValues.reconMatch.displayName;
                            $state.params.status.bg = statusColors.getColorCodeFromLabels(
                                $scope.formValues.reconMatch,
                                $listsCache.ScheduleDashboardLabelConfiguration);
                            $state.params.status.color = 'white';
                        }
                    } else {
                        $state.params.status = null;
                    }

                    if (typeof ($scope.formValues.status) != 'undefined') {
                        if ($scope.formValues.status.name) {
                            if (!$state.params.status_labs) {
                                $state.params.status_labs = {};
                            }
                            $state.params.status_labs = angular.copy($scope.formValues.status);
                            $state.params.status_labs.bg = statusColors.getColorCodeFromLabels(
                                $state.params.status_labs,
                                $listsCache.ScheduleDashboardLabelConfiguration);
                            $state.params.status_labs.color = 'white';
                        }
                    } else {
                        $state.params.status_labs = null;
                    }
                    data = {
                        'Order': $scope.formValues.order.id,
                    };
                    if (!$scope.formValues.id) {
                        vm.getDataTable('SealNumber', data, 'sealNumber');
                    }
                }
            });
            Factory_Master.getLabInfoForOrder($scope.formValues.order.id, function (response) {
                vm.relatedLabs = response.data;
                $scope.relatedLabs = vm.relatedLabs;
                vm.relatedLabs = data;
            });
        }
        if (name == 'DeliveryID') {
            $scope.formValues.product = null; // 11269
            var field = new Object;
            field = vm.formFieldSearch($scope.formFields, 'product');
            if (field) vm.getOptions(field);
            delete field;
            if (!$scope.formValues.delivery) return;
            Factory_Master.get_master_entity($scope.formValues.delivery.id, 'delivery', 'delivery', function (response) {
                if (response.barge) {
                    $scope.formValues.barge = response.barge;
                }
                if (response.deliveryDate) {
                    $scope.formValues.deliveryDate = response.deliveryDate;
                }
                if (response.pumpingDurationSeconds) {
                    // $scope.formValues.surveyedHours = response.pumpingDurationSeconds;
                }
            })
            if ($scope.formValues.delivery) {
                del = $scope.formValues.delivery.id;
            } else {
                del = '';
            }
            if ($scope.formValues.name) {
                lab = $scope.formValues.name;
            } else {
                lab = 'Lab New';
            }
            $state.params.title = lab + ' - ' + $scope.formValues.order.name + " - DEL " + del;
        }
        if (name == 'Product' && $scope.formValues.product) {
        	filteredSpecGroup = $filter('filter')($scope.temp.products, { product: { id: $scope.formValues.product.id } })[0];
        	if (filteredSpecGroup) {
        		filteredSpecGroup = filteredSpecGroup.specGroup;
        	}
        	if (filteredSpecGroup) {
	            $scope.formValues.specGroup = filteredSpecGroup.name;
        	}
            vm.setorderProdId();
            if (typeof vm.changed == 'undefined') {
                vm.changed = 0;
            }
            if (!$scope.formValues.order && !$scope.formValues.orderProductId) return;
            setTimeout(function () {
                data = {
                    'orderId': $scope.formValues.order.id,
                    'orderProductId': $scope.formValues.orderProductId,
                    'deliveryProductId': $scope.formValues.deliveryProductId
                };
                console.log(data);
                console.log($scope.formValues);
                // if (!data.productId) return;
                if ((vm.changed > 0 && vm.entity_id > 0) || (vm.changed >= 0 && vm.entity_id < 1)) {
                    vm.getDataTable('spec', data, 'labTestResults');
                }
            }, 100);
            vm.changed++;
            vm.setPhysicalSupplier();
        }
    }
    vm.getDataTable = function (id, data, obj, idx, app, screen) {
        $scope.dynamicTable = [];
        if (!app) {
            app = vm.app_id
        }
        if (!screen) {
            screen = vm.screen_id
        }
        if (id) {
            id = id.toLowerCase();
            if ($scope.formValues.isFromIntegration) { return }
            Factory_Master.getDataTable(app, screen, id, data, function (callback) {
                if (callback) {
                    $scope.dynamicTable[id] = callback;
                    if (obj == 'labTestResults') {
                        $scope.formValues.labTestResults = [];
                        $scope.formValues.labTestResults = callback;
                    } else if (obj == 'deliveryProducts') {
                        $scope.formValues.deliveryProducts[idx].qualityParameters = [];
                        angular.merge($scope.formValues.deliveryProducts[idx].qualityParameters, callback);
                    } else if (obj == 'sealNumber') {
                        $scope.formValues.labSealNumberInformation = [];
                        $scope.formValues.labSealNumberInformation = callback;
                    }
                    $scope.selectedReconProduct = null;
                }
            });
        }
    }
    vm.getOptions = function (field) {
        //Move this somewhere nice and warm
        var objectByString = function (obj, string) {
            if (string.includes(".")) {
                return objectByString(obj[string.split(".", 1)], string.replace(string.split(".", 1) + ".", ""));
            } else {
                return obj[string];
            }
        }
        if (!$scope.optionsCache) {
            $scope.optionsCache = {};
        }

        if (!(JSON.stringify($scope.optionsCache[field.Name]) == JSON.stringify(field))) {
            $scope.optionsCache[field.Name] = JSON.stringify(field);
            if (field.Filter && typeof ($scope.formValues) != 'undefined') {
                field.Filter.forEach(function (entry) {
                    if (entry.ValueFrom == null) return;
                    var temp = 0;
                    try {
                        temp = eval('$scope.formValues.' + entry.ValueFrom);
                    } catch (error) { }
                    entry.Value = temp;
                });
            }
            if (!$scope.options) {
                $scope.options = [];
            }
            Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, function (callback) {
                if (callback) {
                    $scope.options[field.Name] = [];
                    console.log('emptied options', $scope.options[field.Name]);
                    $scope.options[field.Name] = callback;
                    $scope.$watchGroup([$scope.formValues, $scope.options], function () {
                        vm.setPhysicalSupplier();
                        $timeout(function () {
                            if (field.Type == 'textUOM') {
                                id = '#' + field.Name;
                            } else {
                                id = '#' + field.masterSource + field.Name;
                            }
                            if ($(id).data('val')) {
                                $(id).val($(id).data('val'));
                            }
                        }, 50);
                    })
                    if (field.Unique_ID == 'product') {
                        vm.setorderProdId();
                    }
                }
            });
        }
    };
    vm.setorderProdId = function () {
        $scope.formValues.orderProductId = null;
        $scope.formValues.deliveryProductId = null;
        if (!$scope.formValues.product) return;
        $.each($scope.options.Product, function (k, v) {
            if (v.name == $scope.formValues.product.name) {
                // console.log(v)
                if (v.payload) {
                    $scope.formValues.orderProductId = v.payload.orderProductId;
                    $scope.formValues.deliveryProductId = v.payload.deliveryProductId;
                }
            }
        })
    }

    vm.setPhysicalSupplier = function () {
        if (!$scope.formValues.product) return;
        $.each($scope.options['Product'], function (key, val) {
            if (val.id == $scope.formValues.product.id) {
                if (val.physicalSupplier != null) {
                    $scope.formValues.physicalSupplier = val.physicalSupplier.name;
                }
            }
        })
    }
    vm.formFieldSearch = function (formFields, Unique_ID) {
        for (var key in formFields) {
            if (typeof (formFields[key]) == "string") {
                if (key == "Unique_ID" && formFields[key] == Unique_ID) {
                    return formFields;
                }
                continue;
            }
            var aux = vm.formFieldSearch(formFields[key], Unique_ID);
            if (aux) {
                return aux;
            }
        }
        return false;
    }
    $scope.labsActions = function (action) {
        var id = $scope.formValues.id;
        var status = $scope.formValues.status;
        Factory_Master.labsActions(vm.app_id, vm.screen_id, id, action, status, function (callback) {
            if (callback.status == true) {
                $scope.loaded = true;
                toastr.success(callback.message);
                $state.reload();
            } else {
                if (callback) {
                    if (callback.message) {
                        toastr.error(callback.message);
                    }
                }
            }
        });
    }
    $scope.selectUniqueClaim = function(labClaimTypeSelection){
    	$scope.labResults_claimId = labClaimTypeSelection.id;
    	$rootScope.selectedLabResults_claimId = labClaimTypeSelection.id;
    }
    $scope.raiseClaim = function (data) {
    	// if (true) {
    	if ($scope.labResults_claimId.length > 1 && !$rootScope.selectedLabResults_claimId) {
			$(".claimTypeSelectionModal").modal();
			$(".claimTypeSelectionModal").removeClass("hide fade");
			$(".claimTypeSelectionModal").css("transform", "translateY(100px)");
    		$scope.claimTypeSelectionModalOptions = [];
			uniqueClaimTypes = _.uniq($scope.labResults_claimId);
    		$.each($listsCache.ClaimType, function(k,v){
    			$.each(uniqueClaimTypes, function(ck,cv){
    				if (v.id == cv) {
    					$scope.claimTypeSelectionModalOptions.push(v);
    				}	
    			})
    		})	
    		return;
    	} else {
    	    if ($scope.labResults_claimId.length != 1) {
    	        $scope.labResults_claimId = $rootScope.selectedLabResults_claimId;
    	    }
    	}

    	if ($scope.labResults_claimId[0]) {
    	    $scope.labResults_claimId = $scope.labResults_claimId[0];
    	}

        if (!data) {
            data = {
                "LabTestResultIds": $scope.labResults_specParamIds,
                "DeliveryQualityParameterIds": [],
                "DeliveryProductId": null,
                "ClaimTypeId": $scope.labResults_claimId
            }
        }
        Factory_Master.raise_claim(data, function (response) {
            if (response) {
                if (response.status == true) {
                    $scope.loaded = true;
                    // toastr.success(response.message);
                    $rootScope.transportData = response.data;
                    console.log('-----', response.data);
                    $location.path('claims/claim/edit/');
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        })
    }

    $scope.invalidLab = function (data) {
        // console.log($scope.formValues.id);
        var data = {
            "Payload": $scope.formValues.id
        }
        Factory_Master.invalid_lab(data, function (response) {
            if (response) {
                if (response.status == true) {
                    // console.log(response);
                    toastr.success('Lab status saved successfully.');
                    $timeout(function () {
                        $state.reload();
                    }, 2000);
                } else {
                    toastr.error('Lab Status could not be set to invalid.');
                }
            } else {
                toastr.error('Lab Status could not be set to invalid.');
            }
        });
    }
  
    $scope.initLabsPreviewEmail = function(id) {
        $rootScope.currentEmailTemplate = 38;
        data = {
            "Payload": {
                "Filters": [{
                    "ColumnName": "LabResultId",
                    "Value": id
                }, {
                    "ColumnName": "TemplateId",
                    "Value": 38
                }, {
                    "ColumnName": "TemplateName",
                    "Value": "LabResultEmail"
                }]
            }
        }
        Factory_Master.labs_preview_email(data, function (response) {
            if (response) {
                if (response.status == true) {
                	if (response.data) {
                		if (response.data.comment) {
                			if (response.data.comment.emailTemplate) {
                				response.data.emailTemplateId = response.data.comment.emailTemplate.id;
                			}
                		}
                	}
                    $scope.$emit('previewEmail', response.data);
                } else {
                    $scope.loaded = true;
                    toastr.error(response.message);
                }
            }
        })
    }
    $scope.deleteRelatedLab = function (labId) {
        Factory_Master.deleteLab(labId, function (callback) {
            if (callback) {
                if (callback.status == true) {
                    toastr.success("Lab was deleted successfully");
                    for (var i = $scope.relatedLabs.length - 1; i >= 0; i--) {
                        claim = $scope.relatedLabs[i];
                        if (claim.id == claimId) {
                            $scope.relatedLabs.splice[i, 1];
                        }
                    }
                    if (vm.entity_id == labId) {
                        $location.path('/labs/labresult/edit/' + vm.relatedLabs[0].id);
                    } else {
                        $state.reload();
                    }
                } else {
                    toastr.error(callback.errorMessage)
                }
            }
        })
    }

    // $scope.$on('reconMatchRecalculated', function(){
    //     console.log($scope.formValues.labTestResults);
    //     newReconMatch = _.reduce($scope.formValues.labTestResults, function(result, value, key){
    //         // console.log(value);
    //     });
    // })
    $scope.$watch(function () { return $scope.formValues.labTestResults }, function (oldVal, newVal) {
      
        if (typeof $scope.formValues.labTestResults != 'undefined') {
            newReconMatch = _.reduce($scope.formValues.labTestResults, function (result, value, key) {
                if ((value != null) && (value.qualityMatch != null) && (typeof value.qualityMatch != 'undefined')) {
                    if (value.qualityMatch.id == 1) {
                        result = result && true; //passed
                    } else {
                        result = result && false; //failed
                    }
                    return result;
                }
                return result;
            }, true);
            if ($scope.formValues.id) {
                $scope.reconMatchDisplayName(true, newReconMatch);
                $scope.setStatusForHeader(newReconMatch);
            }
            // console.log('newReconMatch', newReconMatch);
        }
    }, true);

    $('#Vessel').removeAttr('disabled').removeAttr('ng-disabled').attr('readonly', 'true');
    $scope.setPageTitle = function(lab, vessel){
        //tab title
        var title = "Labs - " + lab + " - " + vessel; 
        $rootScope.$broadcast('$changePageTitle', {
            title: title
        })
    }

    $scope.calculatePassedFailedInLab = function( rowVal ) {
		passedStatus = null
		failedStatus = null
    	$.each($listsCache.QualityMatch, function(k,v){
    		if (v.name == "Passed") {
    			passedStatus = v
    		}
    		if (v.name == "Failed") {
    			failedStatus = v
    		}    		
    	})
    	currentStatusResponse = null
    	if (rowVal.min && rowVal.max) {
    		if (rowVal.value > rowVal.min && rowVal.value < rowVal.max) {
		    	currentStatusResponse = passedStatus
    		} else {
		    	currentStatusResponse = failedStatus
    		}
    	} else {
    		if (rowVal.min) {
	    		if (rowVal.value >= rowVal.min) {
			    	currentStatusResponse = passedStatus
	    		} else {
			    	currentStatusResponse = failedStatus
	    		}
    		} 
    		if (rowVal.max) {
	    		if (rowVal.value <= rowVal.max) {
			    	currentStatusResponse = passedStatus
	    		} else {
			    	currentStatusResponse = failedStatus
	    		}
    		}     		   		
    	}
    	rowVal.qualityMatch = currentStatusResponse;
    	console.log(currentStatusResponse.name);
    }

    $scope.$on('formValues', function(){
        // console.log($scope.formValues);
        if(vm.app_id == "labs"){
            if($scope.formValues.name){



                // 1. if lab linked to delivery
                if($scope.formValues.requestInfo){
                    //  if order linked to delivery has a req, display req id
                    if($scope.formValues.requestInfo){
                        if($scope.formValues.requestInfo.request){
                            $scope.setPageTitle($scope.formValues.requestInfo.request.name, $scope.formValues.requestInfo.vesselName);
                            return;
                        }
                    }

                }
                
                // 2 if order linked to deleivery does not have a req, display order id
                if($scope.formValues.order){
                    $scope.setPageTitle($scope.formValues.order.name, $scope.formValues.vessel.name);
                    return;
                }


                // 3. else display lab name
                if($scope.formValues.vessel){
                    $scope.setPageTitle($scope.formValues.name, $scope.formValues.vessel.name);
                }
            }
        }
    })

}]);
