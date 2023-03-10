/**
 * CLaims Controller
 */
APP_CLAIMS.controller("Controller_Claims", [
    "$scope",
    "$rootScope",
    "$Api_Service",
    "Factory_Claims",
    "$state",
    "$location",
    "$q",
    "$compile",
    "$timeout",
    "Factory_Master",
    "$listsCache",
    "$tenantSettings",
    "screenLoader",
    function($scope, $rootScope, $Api_Service, Factory_Claims, $state, $location, $q, $compile, $timeout, Factory_Master, $listsCache, $tenantSettings, screenLoader) {
        var vm = this;
        var guid = "";
        vm.screen_id = "claims";
        if ($state.params.path) {
            vm.app_id = $state.params.path[0].uisref.split(".")[0];
        }
        vm.entity_id = $state.params.entity_id;
        $scope.addedFields = new Object();
        $scope.tenantCurrency = $tenantSettings.tenantFormats.currency;
        vm.response = "";
        vm.ids = "";
        $rootScope.$on("formFields", function(event, data) {
            $scope.formFields = data;
        });
        $rootScope.$on("formValues", function(event, data) {
            $scope.formValues = data;
        });
        $rootScope.$on("editInstance", function(value) {
            vm.editInstance = value;
        });
        vm.compiles = function() {
            $.each($(".group_Order_Details input,.group_Order_Details .uom_group select, #CreatedBy"), function(i, str) {
                $(this).attr("disabled", "disabled");
                $(this).attr("readonly", "true");
            });
            $(".group_Order_Details .date-picker").datepicker("remove");
            $scope.$watch("formFields", function() {
                setTimeout(function() {
                    if ($("#ClaimTypeClaimType").val() == 1) {
                        $(".edit_form_fields_Quantity.Shortage_claims").show();
                    } else {
                        $(".edit_form_fields_Quantity.Shortage_claims").hide();
                    }
                    // $('.group_debunkerDetails .form-control').attr('ng-if', 'formValues.claimType.claimType.id == 4');
                    // $compile($('.group_debunkerDetails .form-control'))($scope);
                    if ($("#ClaimTypeClaimType").val() == 4) {
                        $(".group_debunkerDetails")
                            .removeClass("hiddenGroup")
                            .show();
                    } else {
                        $(".group_debunkerDetails")
                            .addClass("hiddenGroup")
                            .hide();
                    }
                    $("#ClaimTypeClaimType").change(function() {
                        if ($(this).val() == 4) {
                            $(".group_debunkerDetails")
                                .removeClass("hiddenGroup")
                                .show();
                        } else {
                            $(".group_debunkerDetails")
                                .addClass("hiddenGroup")
                                .hide();
                        }
                    });
                    $("#ActualSettlementAmount, #CompromisedAmount, #NoClaimAmmount").attr("disabled", true);
                    $("#EstimatedSettlementAmount").change(function() {
                        $("#ActualSettlementAmount, #CompromisedAmount, #NoClaimAmmount")
                            .val($(this).val())
                            .change();
                    });
                }, 10);
            });
        };

        vm.getRelatedClaims = function(id) {
            console.log($scope.formValues);
            Factory_Claims.getRelatedClaims(id, function(callback) {
                if (callback) {
                    if (callback.status == true) {
                        vm.relatedClaims = callback.data;
                        $scope.relatedClaims = callback.data;
                    }
                }
            });
        };
        vm.deleteClaim = function(claimId) {
            Factory_Claims.deleteClaim(claimId, function(callback) {
                if (callback) {
                    if (callback.status == true) {
                        toastr.success("Claim was deleted successfully");
                        for (var i = $scope.relatedClaims.length - 1; i >= 0; i--) {
                            claim = $scope.relatedClaims[i];
                            if (claim.id == claimId) {
                                $scope.relatedClaims.splice[(i, 1)];
                            }
                        }
                        if (vm.entity_id == claimId) {
                            $location.path("/claims/claim/edit/" + $scope.relatedClaims[0].id);
                        } else {
                            $state.reload();
                        }
                    } else {
                        toastr.error(callback.message);
                    }
                }
            });
        };
        vm.getOptions = function(field) {
            //Move this somewhere nice and warm
            var objectByString = function(obj, string) {
                if (string.includes(".")) {
                    return objectByString(obj[string.split(".", 1)], string.replace(string.split(".", 1) + ".", ""));
                } else {
                    return obj[string];
                }
            };
            if (field) {
                if (field.Filter && typeof $scope.formValues != "undefined") {
                    field.Filter.forEach(function(entry) {
                        if (entry.ValueFrom == null) return;
                        var temp = 0;
                        try {
                            temp = $scope.formValues[entry.ValueFrom];
                        } catch (error) {}
                        entry.Value = temp;
                    });
                }
                if (!$scope.options) {
                    $scope.options = [];
                }
                Factory_Master.get_master_list(vm.app_id, vm.screen_id, field, function(callback) {
                    if (callback) {
                        $scope.options[field.Name] = callback;
                        $scope.$watchGroup([$scope.formValues, $scope.options], function() {
                            $timeout(function() {
                                if (field.Type == "textUOM") {
                                    id = "#" + field.Name;
                                } else {
                                    id = "#" + field.masterSource + field.Name;
                                }
                                if ($(id).data("val")) {
                                    $(id).val($(id).data("val"));
                                }
                            }, 50);
                        });
                    }
                });
            }
        };
        $scope.checkClaimType = function() {
            $("#ActualSettlementAmount").attr("disabled", "disabled");
            $("#CompromisedAmount").attr("disabled", "disabled");
            $("#NoClaimAmmount").attr("disabled", "disabled");
            $("#EstimatedSettlementAmount").on("change", function() {
                $("#ActualSettlementAmount").val($(this).val());
                $("#CompromisedAmount").val($(this).val());
                $("#NoClaimAmmount").val($(this).val());
            });
            if ($scope.formValues && $scope.formValues.claimType && $scope.formValues.claimType.claimType.name) {
                var type = $scope.formValues.claimType.claimType.name;
                if (type == "Debunker") {
                    $(".group_debunkerDetails").show();
                } else {
                    $(".group_debunkerDetails").hide();
                }
                if (type == "Debunker" && (!$scope.formValues.claimDetails.estimatedSettlementAmount || !$rootScope.EstimatedSettlementAmountManualChange)) {
                    if (!$scope.formValues.claimDebunkerDetails || typeof $scope.formValues.claimDebunkerDetails == "undefined") {
                        $scope.formValues.claimDebunkerDetails = {};
                    }
                    $scope.formValues.claimDetails.estimatedSettlementAmount = $scope.formValues.claimDebunkerDetails.debunkerAmount - $scope.formValues.claimDebunkerDetails.resaleAmount;
                } else if (type == "Quantity" && !$scope.formValues.claimDetails.estimatedSettlementAmount && $scope.formValues.quantitySubtypes) {
                    if (!$scope.formValues.quantitySubtypes) $scope.formValues.quantitySubtypes = [];
                    $scope.formValues.claimDetails.estimatedSettlementAmount = ($scope.formValues.quantitySubtypes[0].sellerQuantity - $scope.formValues.quantitySubtypes[0].buyerQuantity) * $scope.formValues.orderDetails.orderPrice;
                }
            }
            $rootScope.EstimatedSettlementAmountManualChange = false;
        };
        vm.formFieldSearch = function(formFields, Unique_ID) {
            for (var key in formFields) {
                if (typeof formFields[key] == "string") {
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
        };
        $scope.triggerChangeFieldsAppSpecific = function(name, id) {
            console.log($rootScope.createDebunkerFromClaim);
            if (!$rootScope.createDebunkerFromClaim && vm.entity_id < 1) {
                $.each($listsCache.ClaimType, function(k, v) {
                    if (typeof v != "undefined") {
                        if (v.name == "Debunker") {
                            $listsCache.ClaimType.splice(k, 1);
                        }
                    }
                });
            }
            if (vm.app_id == 'claims' && vm.screen_id == 'claims') {
              if(name == 'EstimatedSettlementAmount') {
                if($scope.formValues.claimDetails.estimatedSettlementAmount < 0) {
                  $.each($scope.options.SettlementType, function(k, v) {
                    if(v.name === 'Receive') {
                      $scope.formValues.claimDetails.settlementType = v;
                      $scope.formValues.claimDetails.estimatedSettlementAmount *= -1;
                      toastr.info('The estimated settlement amount cannot be negative. The settlement type has been set to "Receive" and the amount is positive.');
                    }
                  });
                }
              }
              // else if($scope.formValues.claimDetails.estimatedSettlementAmount > 0) {
              //   $.each($scope.options.SettlementType, function(k, v) {
              //     if(v.name === 'Pay') {
              //       $scope.formValues.claimDetails.settlementType = v;
              //     }
              //   });
              // }
            }
            if (name == "OrderID") {
                //suprascriem niste date
                Factory_Master.get_master_entity($scope.formValues.orderDetails.order.id, "orders", "orders", function(response) {
                    if (response) {
                        if (response.orderDate) {
                            $scope.formValues.orderDetails.orderDate = response.orderDate;
                        }
                        if (response.status) {
                            // $scope.formValues.orderDetails.orderStatusName = response.status.name;
                            $scope.formValues.orderDetails.orderStatusName = response.status.displayName;
                        }
                        if (response.deliveryDate) {
                            $scope.formValues.orderDetails.deliveryDate = response.deliveryDate;
                        }
                        if (response.vessel) {
                            $scope.formValues.orderDetails.vessel = response.vessel.name;
                        }
                        if (response.location) {
                            $scope.formValues.orderDetails.port = response.location.name;
                        }
                        if (response.seller) {
                            $scope.formValues.orderDetails.counterparty = response.seller.name;
                        }
                        if (response.paymentCompany) {
                            $scope.formValues.orderDetails.company = response.paymentCompany.name;
                        }
                        if (response.products && response.products.length > 0) {
                            $scope.formValues.temp = { tempProductforType: response.products };
                            if ($scope.formValues.orderDetails.product) {
                                $.each($scope.formValues.temp.tempProductforType, function(k, v) {
                                    if (v.product.id && v.product.id == $scope.formValues.orderDetails.product.id) {
                                        $scope.formValues.orderDetails.productType = v.productType.name;
                                    }
                                });
                            }
                        }
                        //retrigger de dropdowns delivery, labs, products
						if (!$scope.formValues.claimDetails.estimatedSettlementAmountCurrency) {
						    $scope.formValues.claimDetails.estimatedSettlementAmountCurrency = $scope.tenantCurrency;
						}
                        var field = new Object();
                        field = vm.formFieldSearch($scope.formFields, "orderDetails.deliveryNo");
                        if (field) vm.getOptions(field);
                        field = vm.formFieldSearch($scope.formFields, "orderDetails.labResult");
                        if (field) vm.getOptions(field);
                        field = vm.formFieldSearch($scope.formFields, "orderDetails.product");
                        if (field) vm.getOptions(field);
                        delete field;
                    }
                });
            }
            if (name == "deliveryNumber") {
                if ($scope.formValues.orderDetails.deliveryNo) {
                    if ($scope.formValues.orderDetails.deliveryProductId === null) {
                        $scope.formValues.orderDetails.deliveryProductId = "";
                    }
                    var id = $scope.formValues.orderDetails.deliveryNo.id;
                    angular.merge($scope.formValues, $scope.formValues.orderDetails.deliveryNo.payload);
                    var field = new Object();
                    field = vm.formFieldSearch($scope.formFields, "orderDetails.labResult");
                    if (field) vm.getOptions(field);
                    field = vm.formFieldSearch($scope.formFields, "orderDetails.product");
                    $scope.options.Product = {};
                    if (field) vm.getOptions(field);
                    delete $scope.formValues.orderDetails.deliveryNo.payload;
                    delete field;
                }
            }
            if (name == "labResultID") {
                if ($scope.formValues.orderDetails.labResult) {
                    if ($scope.formValues.orderDetails.deliveryProductId === null) {
                        $scope.formValues.orderDetails.deliveryProductId = "";
                    }
                    var id = $scope.formValues.orderDetails.labResult.id;
                    angular.merge($scope.formValues, $scope.formValues.orderDetails.labResult.payload);
                    var field = new Object();
                    field = vm.formFieldSearch($scope.formFields, "orderDetails.product");
                    if (field) vm.getOptions(field);
                    delete $scope.formValues.orderDetails.labResult.payload;
                    delete field;
                }
            }
            if (name == "Product") {
                if ($scope.formValues.orderDetails.product) {
                    var id = $scope.formValues.orderDetails.product.id;
                    angular.merge($scope.formValues.orderDetails, $scope.formValues.orderDetails.product.payload.orderDetails);
                    delete $scope.formValues.orderDetails.product.payload;
                    $scope.formValues.claimDetails.estimatedSettlementAmountCurrency = $scope.formValues.orderDetails.currency;
                    $.each($scope.formValues.temp.tempProductforType, function(k, v) {
                        if (v.product.id && v.product.id == $scope.formValues.orderDetails.product.id) {
                            $scope.formValues.orderDetails.productType = v.productType.name;
                        }
                    });
                    $timeout(function() {
                        $("#EstimatedSettlementAmount").trigger("change");
                    }, 10);
                }
            }
            if (name == "ClaimType") {
              $.each($scope.formValues.quantitySubtypes, function(k, v) {
                v.isDeleted = true;
              });
              $.each($scope.formValues.qualitySubtypes, function(k, v) {
                v.isDeleted = true;
              });
              $.each($scope.formValues.densitySubtypes, function(k, v) {
                v.isDeleted = true;
              });
              $.each($scope.formValues.complianceSubtypes, function(k, v) {
                v.isDeleted = true;
              });
              $scope.checkClaimType();
            }
            if (name == "DebunkerQuantitywithUOM") {
                if ($scope.formValues.orderDetails) {
                    $scope.formValues.claimDebunkerDetails.debunkerAmount = $scope.formValues.orderDetails.orderPrice * $scope.formValues.claimDebunkerDetails.debunkerQuantity;
                    $scope.formValues.claimDebunkerDetails.debunkerAmountCurrency = $scope.formValues.orderDetails.currency;
                }
                $scope.formValues.claimDebunkerDetails.resaleAmount = $scope.formValues.claimDebunkerDetails.debunkerQuantity * $scope.formValues.claimDebunkerDetails.salePrice;
                $scope.formValues.claimDebunkerDetails.resaleAmountCurrency = $scope.formValues.claimDebunkerDetails.salePriceCurrency;
                $scope.refreshSelect();
            }
            if (name == "SalePricewithCurrency") {
                $scope.formValues.claimDebunkerDetails.resaleAmount = $scope.formValues.claimDebunkerDetails.debunkerQuantity * $scope.formValues.claimDebunkerDetails.salePrice;
                $scope.formValues.claimDebunkerDetails.resaleAmountCurrency = $scope.formValues.claimDebunkerDetails.salePriceCurrency;
                if ($scope.formValues.orderDetails && $scope.formValues.claimDebunkerDetails.salePriceCurrency) {
                    salePriceConverted = $scope.convertCurrency($scope.formValues.claimDebunkerDetails.salePriceCurrency.id, $scope.formValues.orderDetails.currency.id, null, $scope.formValues.claimDebunkerDetails.salePrice, function(response) {
                        salePriceConverted = response;
                        if (salePriceConverted > $scope.formValues.orderDetails.orderPrice) {
                            toastr.error("Debunker Sale Price should not exceed Order Price!");
                        }
                    });
                }
                $scope.refreshSelect();
            }
            if (name != "EstimatedSettlementAmount") {
                $scope.checkClaimType();
            } else {
                $rootScope.EstimatedSettlementAmountManualChange = true;
            }
        };
        $scope.cancel_claim = function() {
            vm.fields = angular.toJson($scope.formValues.id);
            Factory_Master.cancel_claim(vm.app_id, vm.screen_id, vm.fields, function(callback) {
                if (callback.status == true) {
                    toastr.success(callback.message);
                    $scope.loaded = true;
                    $state.reload();
                } else {
                    toastr.error(callback.message);
                }
            });
        };
        $scope.complete_claim = function() {
            vm.fields = angular.toJson($scope.formValues.id);
            angular.forEach(vm.editInstance, function(input, key) {
                if (input) {
                    if (typeof input == "object" && input.$name) {
                        if (input.$dirty && input.$name != "NoClaimAmmount" && input.$touched) {
                            $scope.changedFields++;
                        }
                    }
                }
            });

            if ($scope.changedFields <= 0) {
                Factory_Master.complete_claim(vm.app_id, vm.screen_id, vm.fields, function(callback) {
                    if (callback.status == true) {
                        $state.reload();
                        toastr.success(callback.message);
                        $scope.loaded = true;
                    } else {
                        toastr.error(callback.message);
                    }
                });
            } else {
                toastr.error("You must save the claim first");
            }
        };
        $scope.setQuantitySub = function() {
            $scope.IsQuantitySubtype = $("#quantity_Parameter option:checked").data("opt");
        };
        $scope.checkSubtype = function() {
            if (vm.entity_id > 0) {
                $scope.$watchGroup("formValues", function() {
                    if ($scope.formValues.densitySubtypes[0]) {
                        $scope.IsQuantitySubtype = false;
                    } else if ($scope.formValues.quantitySubtypes[0]) {
                        $scope.IsQuantitySubtype = true;
                    }
                    return $scope.IsQuantitySubtype;
                });
            }
        };
        $scope.createDebunker = function() {
            screenLoader.showLoader();
            Factory_Master.createDebunker(vm.entity_id, function(response) {
                if (response) {
                    if (response.status == true) {
                        $scope.loaded = true;
                        toastr.success(response.message);
                        $rootScope.transportData = response.data;
                        $rootScope.createDebunkerFromClaim = true;
                        $location.path("claims/claim/edit/");
                        screenLoader.hideLoader();
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                    }
                }
            });
        };
        $scope.changeClaimEmailTemplate = function(value, sendEmailBool) {
            $rootScope.currentEmailTemplate = value.id;
            $rootScope.currentEmailTemplateName = value.name;
            if (value.name == "ClaimQuantityEmail") {
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: "ClaimId",
                                Value: vm.entity_id
                            },
                            {
                                ColumnName: "ClaimTypeName",
                                Value: "Quantity"
                            }
                        ]
                    }
                };
            }
            if (value.name == "ClaimDensityEmail") {
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: "ClaimId",
                                Value: vm.entity_id
                            },
                            {
                                ColumnName: "ClaimTypeName",
                                Value: "Quantity"
                            },
                            {
                                ColumnName: "ClaimSubtypeName",
                                Value: "Density"
                            }
                        ]
                    }
                };
            }
            if (value.name == "ClaimComplianceEmail") {
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: "ClaimId",
                                Value: vm.entity_id
                            },
                            {
                                ColumnName: "ClaimTypeName",
                                Value: "Compliance"
                            }
                        ]
                    }
                };
            }
            specParameters = [];
            $.each($rootScope.formValues.qualitySubtypes, function(key, value) {
                specParameters.push(value.specParameter.id);
            });
            specParameters = specParameters.toString();
            if (value.name == "ClaimQualityEmail") {
                data = {
                    Payload: {
                        Filters: [
                            {
                                ColumnName: "ClaimId",
                                Value: vm.entity_id
                            },
                            {
                                ColumnName: "SpecParameterId",
                                Value: specParameters
                            },
                            {
                                ColumnName: "ClaimTypeName",
                                Value: "Quality"
                            }
                        ]
                    }
                };
            }
            console.log($rootScope.formValues.qualitySubtypes);
            if (data) {
                Factory_Master.claim_preview_email(data, function(response) {
                    if (response) {
                        if (response.status == true) {
                            $scope.$emit("previewEmail", response.data);
                            if (sendEmailBool) {
                                $rootScope.previewEmail = response.data;
                                $scope.sendEmailPreviewActionCall();
                            }
                        } else {
                            $scope.loaded = true;
                            toastr.error(response.message);
                        }
                    }
                });
            } else {
                toastr.error("An error has occured!");
            }
        };
        // $scope.discardSavedPreview = function() {
        //     data = {
        //         "Payload": {
        //             "EmailTemplateId": $rootScope.currentEmailTemplate,
        //             "BusinessId": vm.entity_id,
        //         }
        //     };
        //     Factory_Master.discardSavedPreview(data, function(response) {
        //         if (response) {
        //             if (response.status == true) {
        //                 toastr.success("Email Preview Saved!");
        //                 $rootScope.previewEmail = null
        //                 $state.reload();
        //             } else {
        //                 $scope.loaded = true;
        //                 toastr.error(response.message);
        //             }
        //         }
        //     })
        // }
        // $scope.saveClaimEmail = function() {
        //     data = {
        //         "Payload": {
        //             "Id": $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
        //             "Name": $rootScope.previewEmail.comment.name,
        //             "Content": $rootScope.previewEmail.content,
        //             "EmailTemplate": {
        //                 "Id": $rootScope.currentEmailTemplate
        //             },
        //             "BusinessId": vm.entity_id,
        //             "To": $rootScope.previewEmail.to,
        //             "Cc": $rootScope.previewEmail.cc,
        //             "ToOthers": $rootScope.previewEmail.toOthers,
        //             "CcOthers": $rootScope.previewEmail.ccOthers,
        //             "From": $rootScope.previewEmail.from,
        //         }
        //     };
        //     Factory_Master.save_email_contract(data, function(response) {
        //         if (response) {
        //             if (response.status == true) {
        //                 toastr.success("Email Preview Saved!");
        //                 $rootScope.previewEmail = null
        //                 $state.reload();
        //             } else {
        //                 $scope.loaded = true;
        //                 toastr.error(response.message);
        //             }
        //         }
        //     })
        // }
        // $scope.sendClaimPreviewEmail = function() {
        //     saveData = {
        //         "Payload": {
        //             "Id": $rootScope.previewEmail.comment ? $rootScope.previewEmail.comment.id : 0,
        //             "Name": $rootScope.previewEmail.comment.name,
        //             "Content": $rootScope.previewEmail.content,
        //             "EmailTemplateId": $rootScope.currentEmailTemplate,
        //             "BusinessId": vm.entity_id,
        //             "To": $rootScope.previewEmail.to,
        //             "Cc": $rootScope.previewEmail.cc,
        //             "ToOthers": $rootScope.previewEmail.toOthers,
        //             "CcOthers": $rootScope.previewEmail.ccOthers,
        //             "From": $rootScope.previewEmail.from,
        //         }
        //     };
        //     Factory_Master.send_email_preview(saveData, function(response) {
        //         if (response) {
        //             if (response.status == true) {
        //                 $scope.loaded = true;
        //                 toastr.success("Email Preview was sent!");
        //                 var url = $state.$current.url.prefix + $state.params.screen_id + '/edit/' + $state.params.entity_id;
        //                 $location.path(url);
        //             } else {
        //                 $scope.loaded = true;
        //                 toastr.error(response.message);
        //             }
        //         }
        //     })
        //     // Factory_Master.save_email_contract(saveData, function(response) {
        //     //     if (response) {
        //     //         if (response.status == true) {
        //     //             template = {
        //     //                 "id": $rootScope.currentEmailTemplate,
        //     //                 "name": $rootScope.currentEmailTemplateName
        //     //             };
        //     //             $scope.changeClaimEmailTemplate(template, true);
        //     //             return;
        //     //             if (data.warningMessage) {
        //     //                 confirmAction = window.confirm(data.warningMessage);
        //     //                 if (confirmAction) {
        //     //                     $scope.sendEmailPreviewActionCall()
        //     //                 }
        //     //             } else {
        //     //                 $scope.sendEmailPreviewActionCall()
        //     //             }
        //     //         } else {
        //     //             $scope.loaded = true;
        //     //             toastr.error(response.message);
        //     //         }
        //     //     }
        //     // })
        // }
        $scope.sendEmailPreviewActionCall = function() {
            Factory_Master.send_email_preview($rootScope.previewEmail, function(response) {
                if (response) {
                    if (response.status == true) {
                        $scope.loaded = true;
                        toastr.success("Email Preview was sent!");
                        var url = $state.$current.url.prefix + $state.params.screen_id + "/edit/" + $state.params.entity_id;
                        $location.path(url);
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                    }
                }
            });
        };
        $scope.downloadClaimAttachment = function(attachmentId) {
            Factory_Master.get_document_file(
                {
                    Payload: attachmentId
                },
                function(file, mime) {
                    if (file.data) {
                        if (file.status == 200) {
                            var blob = new Blob([file.data], {
                                type: mime
                            });
                            var a = document.createElement("a");
                            a.style = "display: none";
                            document.body.appendChild(a);
                            //Create a DOMString representing the blob and point the link element towards it
                            var url = window.URL.createObjectURL(blob);
                            a.href = url;
                            a.download = docName;
                            //programatically click the link to trigger the download
                            a.click();
                            //release the reference to the file by revoking the Object URL
                            window.URL.revokeObjectURL(url);
                        } else {
                            toastr.error(file.statusText);
                        }
                    } else {
                        toastr.error(file.statusText);
                    }
                }
            );
        };
        $scope.claims_create_credit_note = function(id) {
            var data = {
                claimId: vm.entity_id,
                InvoiceTypeName: "CreditNote"
            };
            if (id == 1) {
                data.IsResale = true;
            }
            if (id == 2) {
                data.IsDebunker = true;
            }
            Factory_Master.claims_create_credit_note(data, function(response) {
                if (response) {
                    if (response.status == true) {
                        $scope.loaded = true;
                        toastr.success(response.message);
                        $rootScope.transportData = response.data;
                        $location.path("invoices/claims/edit/");
                    } else {
                        $scope.loaded = true;
                        toastr.error(response.message);
                    }
                }
            });
        };
        // $timeout(vm.compiles(), 100);


        $scope.setPageTitle = function(claim, vessel){
            //tab title
            var title = "Claims - " + claim + " - " + vessel; 
            $rootScope.$broadcast('$changePageTitle', {
                title: title
            })
        }
        $scope.$on('formValues', function(){
            console.log($scope.formValues);
            if(vm.screen_id == "claims"){
          
                if($scope.formValues.name){

                     //1. if order  with request, set request name
                    if($scope.formValues.orderDetails){
                        if($scope.formValues.orderDetails.requestInfo){
                            if($scope.formValues.orderDetails.requestInfo.request){
                                $scope.setPageTitle($scope.formValues.orderDetails.requestInfo.request.name, $scope.formValues.orderDetails.requestInfo.vesselName);
                                return;
                            }
                        }
                    }
                    //2. if order without requesr, set order name
                    if($scope.formValues.orderDetails){
                        if($scope.formValues.orderDetails.order){
                            if($scope.formValues.orderDetails.order){
                                $scope.setPageTitle($scope.formValues.orderDetails.order.name, $scope.formValues.orderDetails.vessel);
                                return;
                            }
                        }
                    }
                    //3. else set claim name
                    if($scope.formValues.orderDetails){
                        $scope.setPageTitle($scope.formValues.name, $scope.formValues.orderDetails.vessel);
                    }
                }
            }
        })
    }
]);
