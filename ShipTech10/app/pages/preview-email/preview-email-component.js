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
    function($window, $rootScope, $scope, $element, $attrs, $timeout, $state, $stateParams, $filter, EMAIL_TRANSACTION, STATE, emailModel, newRequestModel, orderModel, groupOfRequestsModel, $sce, $tenantSettings, payloadDataModel, screenLoader, $listsCache) {
        var ctrl = this;
        ctrl.state = $state;
        ctrl.STATE = STATE;
        ctrl.templateList = [];
        ctrl.emailTransactionTypeId = 10;
        ctrl.data = $stateParams.data;
        ctrl.lists = $listsCache;
        ctrl.transaction = $stateParams.transaction;
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
                });
            }
            return emailModel.getTemplates(ctrl.emailTransactionTypeId).then(function(data) {
                ctrl.templateList = data.payload;
                switch (ctrl.transaction) {
                    case EMAIL_TRANSACTION.REQUEST:
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
        }
        ctrl.loadTemplate = function(template, oldTemplate) {
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
                    	ctrl.data = {};
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
            //switch to prevstate to create correct payload fo save
            if (action == "discard") {
            	ctrl.buttonsDisabled = true;
                emailModel.discardPreview(emailData, ctrl.template).then(function() {
                    $state.defaultTemplate = ctrl.template;
                    $state.reload();
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

        ctrl.saveAndSend = function(action){
            screenLoader.showLoader();
            ctrl.saveComments(action, false).then(function () {
                if (action != "sendRFQ") {
                    // ctrl.sendEmail(true);
                    ctrl.sendEmail(false);
                }

            });
        }
        
        ctrl.sendEmail = function(remainOnSamePage) {
        	$.each(ctrl.templateList, function(k,v){
        		if (v.id == ctrl.email.comment.emailTemplate.id) {
        			ctrl.email.comment.emailTemplate.displayName = v.displayName;
        			ctrl.email.comment.emailTemplate.name = v.name;
        		}
        	})
            if (ctrl.email === null) {
                return false;
            }

            if (ctrl.email.to == null) {
                toastr.error("Please check the recipient field!");
                return false;
            }

            // console.log(email);
            if (ctrl.transaction == EMAIL_TRANSACTION.GROUP_OF_REQUESTS) {
            	if (!ctrl.email.businessId) {
            		ctrl.email.businessId = ctrl.data.groupId;
            	}
            }
            if (ctrl.transaction == EMAIL_TRANSACTION.ORDER) {
        		if (ctrl.email.comment.emailTemplate.name == 'SpotOrderConfirmationToSellerEmail' || ctrl.email.comment.emailTemplate.name == 'ContractOrderConfirmationToSellerEmail') {
	                orderModel.sendOrderCommand('confirmToSeller', ctrl.email.businessId).
	                then(function (response) {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch(function (error) {
	                    ctrl.buttonsDisabled = false;
	                });            			
        			return;
        		}
        		if (ctrl.email.comment.emailTemplate.name == 'SpotOrderConfirmationToVesselEmail' || ctrl.email.comment.emailTemplate.name == 'ContractOrderConfirmationToVesselEmail') {
	                orderModel.sendOrderCommand('confirmToAll', ctrl.email.businessId).
	                then(function (response) {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch(function (error) {
	                    ctrl.buttonsDisabled = false;
	                });            			
        			return;
        		}  
        		if (ctrl.email.comment.emailTemplate.name == 'OrderConfirmationToLabEmail') {
	                orderModel.sendOrderCommand('confirmToLab', ctrl.email.businessId).
	                then(function (response) {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch(function (error) {
	                    ctrl.buttonsDisabled = false;
	                });            			
        			return;
        		} 
        		if (ctrl.email.comment.emailTemplate.name == 'OrderConfirmationToSurveyorEmail') {
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
            } else if (ctrl.data.command) {
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
            } else {
	            emailModel.sendEmail(ctrl.email, ctrl.template).then(function() {
	                if (ctrl.transaction != EMAIL_TRANSACTION.GROUP_OF_REQUESTS) {
                        if(!remainOnSamePage){
                            $window.history.back();
                       }
	                }
					if(ctrl.template && ctrl.template.name === 'Questionnaire - Standard' || ctrl.template.name === 'Questionnaire - Redelivery') {
						payload = ctrl.data.requestId
						newRequestModel.questionnaireStatus(payload)
					} 	                
	            }).finally(function(){
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
            console.log(email);
            list.splice(email, 1);
        };

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
                    if (ctrl.email.comment.emailTemplate.name == "SpotOrderConfirmationToSellerEmail" ||
                    	ctrl.email.comment.emailTemplate.name == "ContractOrderConfirmationToSellerEmail") {
                        if (!ctrl.data.canSendConfirmToSeller) return false; 
                    }
                    if (ctrl.email.comment.emailTemplate.name == "SpotOrderConfirmationToVesselEmail" ||
                    	ctrl.email.comment.emailTemplate.name == "ContractOrderConfirmationToVesselEmail") {
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
    }
]);
angular.module("shiptech.pages").component("previewEmail", {
    templateUrl: "pages/preview-email/views/preview-email-component.html",
    controller: "PreviewEmailController"
});
