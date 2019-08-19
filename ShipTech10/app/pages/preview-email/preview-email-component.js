angular.module("shiptech.pages").controller("PreviewEmailController", [
    "$window",
    "$rootScope",
    "$scope",
    "$element",
    "$attrs",
    "$timeout",
    "$state",
    "$stateParams",
    "$filter",
    "EMAIL_TRANSACTION",
    "STATE",
    "emailModel",
    "newRequestModel",
    "orderModel",
    "groupOfRequestsModel",
    "$sce",
    "$tenantSettings",
    "payloadDataModel",
    "screenLoader",
    "$listsCache",
    "$http",
    "API",
    "Factory_Master",
    "$uibModal",
    "$templateCache",
    function($window, $rootScope, $scope, $element, $attrs, $timeout, $state, $stateParams, $filter, EMAIL_TRANSACTION, STATE, emailModel, newRequestModel, orderModel, groupOfRequestsModel, $sce, $tenantSettings, payloadDataModel, screenLoader, $listsCache, $http, API, Factory_Master, $uibModal, $templateCache) {
        var ctrl = this;
        ctrl.state = $state;
        ctrl.STATE = STATE;
        ctrl.templateList = [];
        ctrl.emailTransactionTypeId = 10;
        ctrl.data = $stateParams.data;
        ctrl.lists = $listsCache;
        ctrl.transaction = $stateParams.transaction;
        $scope.transaction = $stateParams.transaction;
        ctrl.multipleRequests = $stateParams.multipleRequests;
        ctrl.template = {
            id: 0,
            name: null
        };
        ctrl.tenantSetting = $tenantSettings;
        ctrl.defaultTemplate = $state.defaultTemplate;
        if ($stateParams.data) {
        	if ($stateParams.data.defaultTemplate) {
		        ctrl.defaultTemplate = $stateParams.data.defaultTemplate;
        	}
        }
        ctrl.shownEmailNr = 3;

        ctrl.getAvailableDocumentAttachments = function(entityId, transaction){
            var referenceNo = entityId;
            var transactionTypeId = _.find(ctrl.lists["TransactionType"], function(el){
                return el.name == transaction;
            }).id;
            payload = {
                "PageFilters": {
                    "Filters": []
                },
                "SortList": {
                    "SortList": []
                },
                "Filters": [
                {
                    "ColumnName": "ReferenceNo",
                    "Value": referenceNo
                },
                {
                    "ColumnName": "TransactionTypeId",
                    "Value": transactionTypeId
                }
                ],
                "SearchText": null,
                "Pagination": {
                    "Skip": 0,
                    "Take": 9999
                }
            }
            $http.post(API.BASE_URL_DATA_MASTERS + "/api/masters/documentupload/list", {
                "Payload": payload
            }).then(function successCallback(response) {
                ctrl.availableDocumentAttachmentsList = response.data.payload;
                $.each(ctrl.availableDocumentAttachmentsList, function(k,v) {
                    v.isIncludedInMail = true;
                }); 
           });
        };

        $scope.addToAttachments = function(el) {
            if (!el) {
                toastr.error("Please select a document");
                return;
            }
            var isInList = _.find(ctrl.email.attachmentsList, function(v){
                return v.id == el.id;
            });
            if (isInList && isInList.isIncludedInMail) {
                toastr.error("Attachment already added");
            } else {
                el.isIncludedInMail = true;
                if (!ctrl.email.attachmentsList) {
                    ctrl.email.attachmentsList = [];
                }
                ctrl.email.attachmentsList.push(el);
            }
        };

        $scope.downloadDocument = function(rowId, docName) {
            Factory_Master.get_document_file(
                {
                    Payload: rowId
                },
                function(file, mime) {
                    if (file.data) {
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
                    }
                }
            );
        };

        ctrl.$onInit = function(){
            // debugger;
            console.log('$onInit - previewEmailData: ', JSON.parse(localStorage.getItem('previewEmailData')));
            // console.log(localStorage.getItem('previewEmailData'));

            if(localStorage.getItem('previewEmailData')){
                var data = JSON.parse(localStorage.getItem('previewEmailData'));
                localStorage.removeItem('previewEmailData');

                $state.go(STATE.PREVIEW_EMAIL, data);
            }

            // also set page title on init, only for preview email pages
            if($state.current.name == "default.preview-email"){
                $rootScope.$broadcast('$changePageTitle', {
                    title: "Email Preview"
                })
            }
        }
        
        //Normalize relevant data for use in the template.
        // Get the generic data Lists.
        if (ctrl.transaction == "OrderConfirmationToSellerOrVessel") {
            transactionTypeId = [];
            $.each(ctrl.lists.EmailTransactionType, function(key, value) {
                if (value.name == ctrl.transaction) transactionTypeId.push(value.id);
                if (value.name == "OrderReConfirmationToSellerOrVessel") transactionTypeId.push(value.id);
                if (value.name == "OrderConfirmationToLabEmail") transactionTypeId.push(value.id);
            });
            if (transactionTypeId.length > 1) {
                ctrl.emailTransactionTypeId = transactionTypeId.join(",");
            }
        } else {
            var transactionTypeId = $filter("filter")(
                ctrl.lists.EmailTransactionType,
                {
                    name: ctrl.transaction
                },
                true
            );
            if (transactionTypeId.length > 0) {
                ctrl.emailTransactionTypeId = transactionTypeId[0].id;
            }
            if (ctrl.transaction == EMAIL_TRANSACTION.ORDER) {
                ctrl.emailTransactionTypeId = '3,14,27,34,24';
            }
        }

        if (ctrl.transaction == EMAIL_TRANSACTION.REQUEST) {
        	if (ctrl.state.params) {
        		if (ctrl.state.params.path) {
		        	ctrl.state.params.path[1].label = "Request"
        		}
        	}
        }          	
        ctrl.loadTemplateList = function() {
            var templateFilter;
            // Get the template list for the template dropdown
            if (ctrl.transaction === EMAIL_TRANSACTION.ORDER) {
                return orderModel.getTemplates(ctrl.emailTransactionTypeId, ctrl.data.orderId).then(function(data) {
                    ctrl.templateList = data.payload;
                    $.each(ctrl.templateList, function(k, v) {
                        if (!v.displayName) {
                            v.displayName = v.name;
                        }
                    });
                    ctrl.getAvailableDocumentAttachments(ctrl.data.orderId, "Order");
                });
            }
            if (ctrl.transaction === "OrderNoBDNToVesselEmail") {
                return new Promise(function(resolve, reject) {
                    orderModel.previewOrderToBeDeliveredMail(ctrl.data, ctrl.template).then(function(data) {
                        ctrl.email = data.payload;
                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                        if (ctrl.email.comment) {
                            if (!ctrl.email.comment.emailTemplate) return;
                            ctrl.templateList = [ctrl.email.comment.emailTemplate];
                            ctrl.template = ctrl.email.comment.emailTemplate;
                        }
                    }, function(){
                        ctrl.template = null;
                        ctrl.data = {};
                        ctrl.email = {};
                    });
                    resolve(true);
                });
            }
            return emailModel.getTemplates(ctrl.emailTransactionTypeId).then(function(data) {
                ctrl.templateList = data.payload;
                switch (ctrl.transaction) {
                    case EMAIL_TRANSACTION.REQUEST:
                        ctrl.getAvailableDocumentAttachments(ctrl.data.requestId, "Request");
                        break;
                    case EMAIL_TRANSACTION.GROUP_OF_REQUESTS:
                        var id = ctrl.data.Requirements[0].RequestId;
                        var multipleRequests = false;
                        //check if multiple requests are selected
                        for (var i = 1; i < ctrl.data.Requirements.length; i++) {
                            if (ctrl.data.Requirements[i].RequestId != id) {
                                multipleRequests = true;
                                break;
                            }
                        }
                        if (multipleRequests) {
                            templateFilter = $filter("filter")(
                                ctrl.templateList,
                                {
                                    name: "MultipleRfqNewRFQEmailTemplate"
                                },
                                true
                            );
                        } else {
                            templateFilter = $filter("filter")(
                                ctrl.templateList,
                                {
                                    // name: "SingleRfqNewRFQEmailTemplate"
                                    name: "MultipleRfqNewRFQEmailTemplate"
                                },
                                true
                            );
                        }
                        if (templateFilter.length > 0) {
                            ctrl.template = templateFilter[0];
                        }
                        ctrl.getAvailableDocumentAttachments(ctrl.data.groupId, "Offer");
                        break;
                    case EMAIL_TRANSACTION.REQUOTE:
                        ctrl.template = ctrl.templateList[0];
                        ctrl.defaultTemplate = ctrl.templateList[0];
                        break;
                    case EMAIL_TRANSACTION.VIEW_RFQ:
                        if (ctrl.multipleRequests) {
                            templateFilter = $filter("filter")(
                                ctrl.templateList,
                                {
                                    name: "MultipleRfqAmendRFQEmailTemplate"
                                },
                                true
                            );
                        } else {
                            templateFilter = $filter("filter")(
                                ctrl.templateList,
                                {
                                    // name: "SingleRfqRequestChangesEmailTemplate"
                                    name: "MultipleRfqAmendRFQEmailTemplate"
                                },
                                true
                            );
                        }
                        if (templateFilter.length > 0) {
                            ctrl.template = templateFilter[0];
                            ctrl.defaultTemplate = templateFilter[0];
                        }
                        break;
                    case EMAIL_TRANSACTION.ORDER:
	                    ctrl.defaultTemplate = ctrl.templateList[0];
                        break;
                    case EMAIL_TRANSACTION.ORDER_CONFIRM:
                        ctrl.template = {
                            id: null,
                            name: null
                        };
                        break;
                    case EMAIL_TRANSACTION.CONTRACT_PLANNING:
                        break;
                    default:
                        return false;
                }
                $.each(ctrl.templateList, function(k, v) {
                    if (!v.displayName) {
                        v.displayName = v.name;
                    }
                });
            });
        };

        $scope.$on("selectDocumentAttachment", function (e, a) {
            a.isIncludedInMail = true;
            $scope.addToAttachments(a);
        });

        ctrl.loadTemplateList().then(function() {
            // Get the default template data.
            if (ctrl.defaultTemplate) {
                ctrl.loadTemplate(ctrl.defaultTemplate);
                $state.defaultTemplate = null;
            } else {
                ctrl.loadTemplate(ctrl.template);
            } 
        });

        ctrl.formEmailString = function(data){
            if(typeof data == "object"){
                // array
                var emailStr = "";
                $.each(data, function(_, em){
                    emailStr += em;
                })
                return emailStr.substring(0, emailStr.length() - 1);
            }
            if(typeof data == "string"){
                return data.replace(/,/g, ';');
            }
        }

        ctrl.initOthers = function(){
            // debugger;
            if(ctrl.email.toOthers){
                ctrl.toEmailOthers = ctrl.formEmailString(ctrl.email.toOthers);
            }else{
                ctrl.toEmailOthers = "";
            }
            if(ctrl.email.ccOthers){
                ctrl.ccEmailOthers = ctrl.formEmailString(ctrl.email.ccOthers);
            }else{
                ctrl.ccEmailOthers = "";
            }
            // screenLoader.hideLoader();
        };

        ctrl.loadTemplate = function(template, oldTemplate) {
            if (template && template.name) {
                if (template.name.toLowerCase().indexOf("surveyor") !== -1) {
                    if (ctrl.data.missingSurveyor) {
                        toastr.error('Surveyor is mandatory');
                        ctrl.template = null;
                        return;
                    }
                }
                if (template.name.toLowerCase().indexOf("lab") !== -1) {
                    if (ctrl.data.missingLab) {
                        toastr.error('Lab is mandatory');
                        ctrl.template = null;
                        return;
                    }
                }
            }

            var payload;
            ctrl.template = template;

            // debugger
            switch (ctrl.transaction) {
                case EMAIL_TRANSACTION.REQUEST:
                case "ValidatePreRequest":
                    screenLoader.showLoader();
                    if (localStorage.getItem('setQuestionnaireTemplate')) {
                    	ctrl.template = angular.copy(JSON.parse(localStorage.getItem('setQuestionnaireTemplate')));
                    	localStorage.removeItem("setQuestionnaireTemplate");
                    }
                    if(!ctrl.template) {
                    	return;
                    }
                    if(ctrl.template.id == 0) {
                    	return;
                    }                    
                    if (ctrl.template.name === 'Questionnaire - Redelivery') {
                        ctrl.template.name = 'Redelivery';
                    }
                    if (ctrl.template.name === 'Questionnaire - Standard') {
                        ctrl.template.name = 'Standard';
                    }
                    newRequestModel.getRequestEmailTemplate(ctrl.data, ctrl.template, ctrl.emailTransactionTypeId).then(function(data) {
                        ctrl.email = data.payload;

                        // init toOthers and ccOthers
                        ctrl.initOthers();

                        if (ctrl.template.id === 0) {
                            templateFilter = $filter("filter")(
                                ctrl.templateList,
                                {
                                    id: ctrl.email.comment.emailTemplate.id
                                },
                                true
                            );
                            if (templateFilter.length > 0) {
                                ctrl.template = templateFilter[0];
                            }
                        }
                        ctrl.email = data.payload;
                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                    }, function(){
                    	ctrl.template = null;
                    	// ctrl.data = {};
                    	ctrl.email = {};
                    }).finally(function(){setTimeout(function(){screenLoader.hideLoader()},1500)});
                    break;
                case EMAIL_TRANSACTION.GROUP_OF_REQUESTS:
                    // console.log(ctrl.data);
                    /** Check if QuoteByDate exists and set it from QuoteByDateFrom if not -- 04.05.2018 (Iri) */
                    if (!ctrl.data.QuoteByDate && ctrl.data.QuoteByDateFrom) ctrl.data.QuoteByDate = ctrl.data.QuoteByDateFrom;
                    screenLoader.showLoader();
                    groupOfRequestsModel.getRfqEmailTemplate(ctrl.data, ctrl.template).then(function(data) {
                        ctrl.email = data.payload;
                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                        ctrl.initOthers();
                    }, function(){
                    	ctrl.template = null;
                    	ctrl.data = {};
                    	ctrl.email = {};
                    }).finally(function(){setTimeout(function(){screenLoader.hideLoader()},1500)});
                    break;
                case EMAIL_TRANSACTION.REQUOTE:
                     screenLoader.showLoader();
                    groupOfRequestsModel.getRfqRequoteEmailTemplate(ctrl.data).then(function(data) {
                        ctrl.email = data.payload;
                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                        ctrl.initOthers();
                    }, function(){
                    	ctrl.template = null;
                    	ctrl.data = {};
                    	ctrl.email = {};
                    }).finally(function(){setTimeout(function(){screenLoader.hideLoader()},1500)});
                    break;
                case EMAIL_TRANSACTION.VIEW_RFQ:
                      screenLoader.showLoader();
                    groupOfRequestsModel
                        .getViewRfqEmailTemplate(ctrl.data, ctrl.template)
                        .then(function(data) {
                            ctrl.email = data.payload;
                            ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                            ctrl.defaultTemplate = ctrl.template;
                            ctrl.initOthers();
                        }, function(){
	                    	ctrl.template = null;
	                    	ctrl.data = {};
	                    	ctrl.email = {};
	                    })
                        .catch(function(data) {
                            ctrl.template = ctrl.defaultTemplate;
                        }).finally(function(){setTimeout(function(){screenLoader.hideLoader()},1500)});
                    break;
                case EMAIL_TRANSACTION.ORDER:
                    if (ctrl.data.defaultCancellationEmail) {
	                    ctrl.template = ctrl.data.defaultCancellationEmail;
	                    ctrl.data.defaultCancellationEmail = null;
                    }
                    screenLoader.showLoader();
                    if (ctrl.template.id === 0) {
                        setTimeout(function(){screenLoader.hideLoader()},1500);
                        return false;
                    }
                    orderModel.getOrderEmailTemplate(ctrl.data, ctrl.template).then(function(data) {
                    	setTimeout(function(){
	                        ctrl.email = data.payload;
	                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
	                        ctrl.initOthers();
                    		$scope.$apply();
                        },50)
                    }, function(){
                    	ctrl.template = null;
                    	// ctrl.data = {};
                    	ctrl.email = {};
                    }).finally(function(){setTimeout(function(){screenLoader.hideLoader()},1500)});
                    break;
                case EMAIL_TRANSACTION.ORDER_CONFIRM:
                    screenLoader.showLoader();
                    orderModel.getOrderConfirmationEmailTemplate(ctrl.data, ctrl.template).then(function(data) {
                        ctrl.email = data.payload;
                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                        if (ctrl.email.comment) {
                            if (!ctrl.email.comment.emailTemplate) return;
                            ctrl.template = ctrl.email.comment.emailTemplate;
                            $.each(ctrl.templateList, function(k,v){
                            	if (v.id == ctrl.template.id) {
                            		ctrl.template.name = v.name;
                            	}
                            })
                        }
                        ctrl.initOthers();
                    }, function(){
                    	ctrl.template = null;
                    	ctrl.data = {};
                    	ctrl.email = {};
                    }).finally(function(){setTimeout(function(){screenLoader.hideLoader()},1500)});
                    break;
                case EMAIL_TRANSACTION.CONTRACT_PLANNING:
                    screenLoader.showLoader();
                    ctrl.data.templateName = template.name;
                    newRequestModel.getContractPlanningEmailTemplate(ctrl.data).then(function(data) {
                        ctrl.email = data.payload;
                        ctrl.template = data.payload.comment.emailTemplate;
                        ctrl.templateList.forEach(function(object) {
                            if (object.id == ctrl.template.id){
                                ctrl.template = object;
                            } 
                        });
                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                        ctrl.initOthers();
                        // ctrl.data = null
                    }, function(){
                    	ctrl.template = null;
                    	ctrl.data = {};
                    	ctrl.email = {};
                    }).finally(function(){setTimeout(function(){screenLoader.hideLoader()},1500)});
                    break;
                default:
                    return false;
            }
        };
        ctrl.saveComments = function(action, refresh) {
        	var refreshAfter = refresh;
            if (ctrl.email.comment === null) {
                return false;
            }
            var emailData = {};
            console.log(ctrl.transaction);
            console.log(ctrl.data);
            switch (ctrl.transaction) {
                case EMAIL_TRANSACTION.REQUEST:
                case "ValidatePreRequest":
                    emailData = {
                        businessId: ctrl.data.requestId
                    };
                    break;
                case EMAIL_TRANSACTION.GROUP_OF_REQUESTS:
                    emailData = {
                        businessId: ctrl.data.groupId,
                        secondBusinessId: ctrl.data.Requirements[0].LocationId,
                        thirdBusinessId: ctrl.data.Requirements[0].SellerId
                    };
                    break;
                case EMAIL_TRANSACTION.REQUOTE:
                    emailData = {
                        businessId: ctrl.data.groupId,
                        secondBusinessId: ctrl.data.Requirements[0].LocationId,
                        thirdBusinessId: ctrl.data.Requirements[0].SellerId
                    };
                    break;
                case EMAIL_TRANSACTION.VIEW_RFQ:
                    emailData = {
                        businessId: ctrl.data.rfqId
                    };
                    break;
                case "OrderNoBDNToVesselEmail":
                case EMAIL_TRANSACTION.ORDER:
                    emailData = {
                        businessId: ctrl.data.orderId
                    };
                    break;
                case EMAIL_TRANSACTION.ORDER_CONFIRM:
                    emailData = {
                        businessId: ctrl.data.orderId
                    };
                    break;
                case EMAIL_TRANSACTION.CONTRACT_PLANNING:
                    if (!ctrl.data.sellerId) {
                        return false;
                    }
                    emailData = {
                        businessId: null,
                        businessIds: ctrl.data.requestId
                    };
                    break;
                default:
                    return false;
            }

            if (ctrl.email.subject) {
            	emailData.subject = ctrl.email.subject;
            }
            //switch to prevstate to create correct payload fo save
            if (action == "discard") {
            	ctrl.buttonsDisabled = true;
                var validAttachments = [];
                var attachmentList = angular.copy(ctrl.email.attachmentsList);
                var availableAttachmentList = angular.copy(ctrl.availableDocumentAttachmentsList);

                $.each(availableAttachmentList, function(k, v) {
                    if (v.isIncludedInMail === false || v.isIncludedInMail === true) {
                        var elm = angular.copy(v);
                        var found = false;
                        $.each(attachmentList, function(k1, v1) {
                            if (v1.id === v.id) {
                                found = true;
                                elm.isIncludedInMail = true;
                            }
                        });
                        if (!found) {
                            elm.isIncludedInMail = false;
                        }
                        validAttachments.push(elm);
                    }
                });

                emailData.attachmentsList = validAttachments;
                emailModel.discardPreview(emailData, ctrl.template).then(function() {
                    $state.defaultTemplate = ctrl.template;
                    $state.reload();
    	        	if ($stateParams.data) {
	    	        	if ($stateParams.data.defaultTemplate) {
					        $stateParams.data.defaultTemplate = null;
			        	}
    	        	}                    
                }).finally(function(){
                	ctrl.buttonsDisabled = false;
                });
            } else if (action == "sendRFQ") {
            	ctrl.buttonsDisabled = true;
                return emailModel.saveComments(emailData, ctrl.email.comment, ctrl.template, ctrl.email).then(function() {
                    // $state.defaultTemplate = ctrl.template;
                    // $rootScope.refreshPending = true;
                    if (ctrl.state.current.name == "default.group-of-requests") {
	                    $rootScope.$broadcast("sendEmailRFQ", ctrl.data.Requirements);
                    }
                 
                }).finally(function(){
                	ctrl.buttonsDisabled = false;
                });
            } else if (ctrl.transaction == EMAIL_TRANSACTION.CONTRACT_PLANNING) {
            	ctrl.buttonsDisabled = true;
                return emailModel.saveForBusinessIds(emailData, ctrl.email.comment, ctrl.template, ctrl.email).then(function() {
                 	
                }).finally(function(){                	
                	ctrl.buttonsDisabled = false;
                });
            } else {
            	ctrl.buttonsDisabled = true;
                return emailModel.saveComments(emailData, ctrl.email.comment, ctrl.template, ctrl.email).then(function() {
    	        	if ($stateParams.data) {
	    	        	if ($stateParams.data.defaultTemplate) {
					        $stateParams.data.defaultTemplate = null;
			        	}
    	        	}
                    $state.defaultTemplate = ctrl.template;
                   if(refreshAfter){
                        $state.reload();
                    }
                    if (ctrl.state.current.name == "default.group-of-requests") {
	                    $rootScope.$broadcast("reloadGroupPreviewRFQ", true);
                    }  
                }).finally(function(){
                	ctrl.buttonsDisabled = false;
                    // if (ctrl.state.current.name == "default.group-of-requests") {
	                   //  $rootScope.$broadcast("sendEmailRFQ", 'noReload');
                    // }
                });
            }
        };

        ctrl.saveAndSend = function(action) {
            var errors = [];
            if (ctrl.template) {
                if (ctrl.template.name.toLowerCase().indexOf("confirm") !== -1) {
                    if (ctrl.data.missingPhysicalSupplier) {
                        errors.push('Physical supplier is mandatory');
                    }
                    if (ctrl.data.missingSpecGroup) {
                        errors.push('Spec group is mandatory');
                    }
                }
            }

            if (errors.length > 0) {
                _.each(errors, function(value, key) {
                    toastr.error(value);
                });
                return;
            }

            ctrl.saveComments(action, false).then(function () {
                if (action != "sendRFQ") {
                    // ctrl.sendEmail(true);
                    ctrl.sendEmail(false);
                }

            });
        };
        
        ctrl.sendEmail = function(remainOnSamePage) {
        	$.each(ctrl.templateList, function(k,v){
        		if (v.id == ctrl.email.comment.emailTemplate.id) {
        			ctrl.email.comment.emailTemplate.displayName = v.displayName;
        			ctrl.email.comment.emailTemplate.name = v.name;
        			ctrl.email.comment.emailTemplate.internalName = v.internalName;
        		}
        	});
            if (ctrl.email === null) {
                return false;
            }

            if (ctrl.email.to == null) {
                toastr.error("Please check the recipient field!");
                return false;
            }

            if (ctrl.transaction == 'OrderNoBDNToVesselEmail') {
                var orderId = ctrl.data.orderId;
                var orderProductIds = ctrl.data.orderProductIds;

                if (orderId && orderProductIds) {
                    orderModel.sendOrderToBeDeliveredMail(orderId, orderProductIds).then(function() {
                        // toastr.success('Operation completed successfully');
                        window.location.href = "#/delivery/ordersdelivery";
                    });
                } 
                return;
            }

            // console.log(email);
            if (ctrl.transaction == EMAIL_TRANSACTION.GROUP_OF_REQUESTS) {
            	if (!ctrl.email.businessId) {
            		ctrl.email.businessId = ctrl.data.groupId;
            	}
            }
            if (ctrl.transaction == EMAIL_TRANSACTION.ORDER) {
        		if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToSeller') != -1) {
	                orderModel.sendOrderCommand('confirmToSeller', ctrl.email.businessId).
	                then(function (response) {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch(function (error) {
	                    ctrl.buttonsDisabled = false;
	                });            			
        			return;
        		}
        		if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToVessel') != -1) {
	                orderModel.sendOrderCommand('confirmToAll', ctrl.email.businessId).
	                then(function (response) {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch(function (error) {
	                    ctrl.buttonsDisabled = false;
	                });            			
        			return;
        		}  
        		if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToLab') != -1) {
	                orderModel.sendOrderCommand('confirmToLab', ctrl.email.businessId).
	                then(function (response) {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch(function (error) {
	                    ctrl.buttonsDisabled = false;
	                });            			
        			return;
        		} 
        		if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToSurveyor') != -1) {
	                orderModel.sendOrderCommand('confirmToSurveyor', ctrl.email.businessId).
	                then(function (response) {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch(function (error) {
	                    ctrl.buttonsDisabled = false;
	                });            			
        			return;
        		}         		
            }
            if (ctrl.transaction == EMAIL_TRANSACTION.REQUOTE) {
            	// ctrl.email.businessId = ctrl.data.groupId;
            }

            if (ctrl.data) {
	            if (ctrl.data.rfqRequirements && ctrl.email.comment.emailTemplate.name == 'MultipleRfqRevokeRFQEmailTemplate') {
		            var rfq_data = {
		                Requirements: ctrl.data.rfqRequirements,
		                QuoteByTimeZoneId: null,
		                QuoteByCurrencyId: null,
		                Comments: null
		            };
		            groupOfRequestsModel.revokeRFQ(rfq_data).then(function(data) {
                        if (data.payload) {
                            if (data.payload.redirectToRequest) {
                                lastRequestId = rfq_data.Requirements[0].RequestId;
                                location.href = "/#/edit-request/"+lastRequestId;
                                return;
                            }
                        }
                        window.history.back();
                    });
		            return;
	            }

	            if (ctrl.data.rfqRequirements && ctrl.email.comment.emailTemplate.name == 'MultipleRfqAmendRFQEmailTemplate') {
		            var rfq_data = ctrl.data.rfqRequirements;
		            groupOfRequestsModel.amendRFQ(rfq_data).then(
						window.history.back()
		            )
		            return;
	            }            
            }

            // ctrl.data.orderCanConfirmSelerEmail = true;
            ctrl.buttonsDisabled = true;
            console.log($scope, ctrl);

            if (ctrl.data.orderCanConfirmSelerEmail) {
	            var request_data = {
	                "Filters": [{
	                    "ColumnName": "OrderId",
	                    "Value": ctrl.data.orderId
	                }, {
	                    "ColumnName": "TemplateId",
	                    "Value": ctrl.template.id
	                }, {
	                    "ColumnName": "TemplateName",
	                    "Value": ctrl.template.name
	                }]
	            };
	            // request_data = payloadDataModel.create(payload);
            	orderModel.mailPreviewConfirmToSeller(request_data).then(function(){
		            emailModel.sendEmail(ctrl.email, ctrl.template).then(function() {
		                if (ctrl.transaction != EMAIL_TRANSACTION.GROUP_OF_REQUESTS) {
                           if(!remainOnSamePage){
                                $window.history.back();
                           }
		                }
		            });
            	}).finally(function(){
            		ctrl.buttonsDisabled = false;
            		$state.reload()
            	})
            } /*else if (ctrl.data.command) {
                orderModel.sendOrderCommand(ctrl.data.command, ctrl.data.orderId)
                .then(function (response) {
                    ctrl.buttonsDisabled = false;
                    // $state.go(STATE.EDIT_ORDER, {
                    //     orderId: ctrl.orderId
                    // });
      
                }).catch(function (error) {
                    ctrl.buttonsDisabled = false;
                    $state.reload()
                  
                });
            }*/ else {
	            emailModel.sendEmail(ctrl.email, ctrl.template).then(function() {
					if(ctrl.template && ctrl.template.name === 'Questionnaire - Standard' || ctrl.template.name === 'Questionnaire - Redelivery') {
						payload = ctrl.data.requestId
						newRequestModel.questionnaireStatus(payload).then(function(){
                            $window.history.back();
						})
					} else {

		                if (ctrl.transaction != EMAIL_TRANSACTION.GROUP_OF_REQUESTS) {
	                        if(!remainOnSamePage){
	                            $window.history.back();
	                       }
		                }
					} 	                
	            }).finally(function(){
	                if (ctrl.transaction == EMAIL_TRANSACTION.CONTRACT_PLANNING) {
	                	window.location.href = "#/contract-planning/";
	                	return;
	                }
	            	ctrl.buttonsDisabled = false;
	            	$state.reload()
	            });
            }

        };
        ctrl.addEmail = function(email, list, constructor) {
            if (!email) {
                return;
            }
            if (!email.name) {
                return;
            }
            if (!list && constructor) {
                ctrl.email[constructor] = [];
                list = ctrl.email[constructor];
            }
            if (list.length > 0) {
                var isEmailInList =
                    $filter("filter")(list, {
                        idEmailAddress: email.idEmailAddress
                    }).length > 0;
            } else {
                isEmailInList = false;
            }
            if (!isEmailInList) {
                list.push(email);
            } else {
                toastr.error("Email address is already added!");
            }
            clearEmailInputs();
        };
        ctrl.removeEmail = function(email, list) {
        	$('[tooltip]').tooltip('destroy');
            console.log(email);
            list.splice(email, 1);
            setTimeout(function(){
	            $('[tooltip]').tooltip();
            },100)
        };
        jQuery(document).ready(function($){
        	$(document).on("mouseover", '*[tooltip]', function(){
	            $('[tooltip]').tooltip();
        	})
        })

        function clearEmailInputs() {
            ctrl.toEmail = "";
            ctrl.ccEmail = "";
        }
        ctrl.clearEmailInputs = function() {
            ctrl.toEmail = "";
            ctrl.ccEmail = "";
        };
        ctrl.canSend = function() {
            // || ctrl.transaction === EMAIL_TRANSACTION.REQUOTE
            if (ctrl.transaction === EMAIL_TRANSACTION.GROUP_OF_REQUESTS /*|| ctrl.transaction === EMAIL_TRANSACTION.VIEW_RFQ*//*commented because of bug 8464*/) {
                return false;
            } else if (ctrl.transaction === EMAIL_TRANSACTION.ORDER) {
                if (typeof ctrl.email.businessId == "undefined") {
                    return false;
                }
                
                if(typeof(ctrl.email.comment.emailTemplate.name) != 'undefined'){

                    if (ctrl.email.comment.emailTemplate.name == "ContractOrderConfirmationEmail") {
                        if (!ctrl.data.canSendConfirm) return false; 
                    }
                    if (ctrl.email.comment.emailTemplate.name.indexOf("ConfirmationToSeller") != -1 ) {
                        if (!ctrl.data.canSendConfirmToSeller) return false;  
                    }
                    if (ctrl.email.comment.emailTemplate.name.indexOf("ConfirmationToVessel") != -1) {
                        if (!ctrl.data.canSendConfirmToVessel) return false; 
                    }                    
                }else{
                    if (typeof ctrl.data.canSend !== "undefined") return ctrl.data.canSend;
                }
      
            }
            return true;
        };
        ctrl.goBack = function() {
            $window.history.back();
        };
        ctrl.focusInnerInput = function(event) {
            console.log(event.target);
            $(event.target)
                .children("input.typeahead")
                .focus();
        };

        ctrl.validateEmails = function(string, key) {

            if (!string || string.length == 0){
                ctrl.email[key] = emailObj;
                ctrl.emailPreview[key].$setValidity(key, true);
            }else{

                var emailObj = [];
    
                // force copy the string
                var string_copy = string + '';
                emailObj = string_copy.replace(/\s/g, "").split(";");
    
                emailObj = emailObj.filter(function(e) {
                    return e;
                });
    
    
                pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (emailObj.length > 0) {
                    i = 0;
                    $.each(emailObj, function(k, v) {
                        if (!pattern.test(v)) {
                            toastr.error(v + " is not a valid email address!");
                            i++;
                        }
                    });
                    if (i == 0) {
                        ctrl.email[key] = emailObj;
                        ctrl.emailPreview[key].$setValidity(key, true);
                    } else {
                        ctrl.email[key] = [];
                        ctrl.emailPreview[key].$setValidity(key, false);
                    }
                }
            }
        };

         ctrl.saveAndSendButtonLabel = function() {
            saveAndSendButtonLabel = "Save and Send";
            if (["ContractPlanningEmailTemplate", "ContractPlanningUpdateEmailTemplate"].indexOf(ctrl.template.name) != -1) {
                saveAndSendButtonLabel = "Send Email";
            }

            return saveAndSendButtonLabel;

        };
    }
]);
angular.module("shiptech.pages").component("previewEmail", {
    templateUrl: "pages/preview-email/views/preview-email-component.html",
    controller: "PreviewEmailController"
});
