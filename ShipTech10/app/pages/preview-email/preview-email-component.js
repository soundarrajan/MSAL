angular.module('shiptech.pages').controller('PreviewEmailController', [
    '$window',
    '$rootScope',
    '$scope',
    '$element',
    '$attrs',
    '$timeout',
    '$state',
    '$stateParams',
    '$filter',
    'EMAIL_TRANSACTION',
    'STATE',
    'emailModel',
    'newRequestModel',
    'orderModel',
    'groupOfRequestsModel',
    '$sce',
    '$tenantSettings',
    'payloadDataModel',
    'screenLoader',
    '$listsCache',
    '$http',
    'API',
    'Factory_Master',
    '$uibModal',
    '$templateCache',
    function($window, $rootScope, $scope, $element, $attrs, $timeout, $state, $stateParams, $filter, EMAIL_TRANSACTION, STATE, emailModel, newRequestModel, orderModel, groupOfRequestsModel, $sce, $tenantSettings, payloadDataModel, screenLoader, $listsCache, $http, API, Factory_Master, $uibModal, $templateCache) {
        let ctrl = this;
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

        ctrl.getAvailableDocumentAttachments = function(entityId, transaction) {
            let referenceNo = entityId;
            let transactionTypeId = _.find(ctrl.lists.TransactionType, (el) => {
                return el.name == transaction;
            }).id;
            var payload = {
                PageFilters: {
                    Filters: []
                },
                SortList: {
                    SortList: []
                },
                Filters: [
                    {
                        ColumnName: 'ReferenceNo',
                        Value: referenceNo
                    },
                    {
                        ColumnName: 'TransactionTypeId',
                        Value: transactionTypeId
                    }
                ],
                SearchText: null,
                Pagination: {
                    Skip: 0,
                    Take: 9999
                }
            };
            $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/list`, {
                Payload: payload
            }).then((response) => {
                ctrl.availableDocumentAttachmentsList = response.data.payload;
                $.each(ctrl.availableDocumentAttachmentsList, (k, v) => {
                    v.isIncludedInMail = true;
                });
            });
        };

        $scope.addToAttachments = function(el) {
            if (!el) {
                toastr.error('Please select a document');
                return;
            }
            let isInList = _.find(ctrl.email.attachmentsList, (v) => {
                return v.id == el.id;
            });
            if (isInList && isInList.isIncludedInMail) {
                toastr.error('Attachment already added');
            } else {
                el.isIncludedInMail = true;
                if (!ctrl.email.attachmentsList) {
                    ctrl.email.attachmentsList = [];
                }
                let i = 0;
                while (i >= 0 && i < ctrl.email.attachmentsList.length)
                    if (ctrl.email.attachmentsList[i].id == el.id) {
                        ctrl.email.attachmentsList.splice(i, 1);
                        i --;
                    } else {
                        i ++;
                    }
                ctrl.email.attachmentsList.push(el);
                console.log(ctrl.email.attachmentsList);
            }
        };

        $scope.downloadDocument = function(rowId, docName, content) {
            var payload = {
                "id": rowId,
                "name": docName,
                "content": content
            }
            Factory_Master.get_document_file(
                {
                    Payload: payload
                },
                (file, mime) => {
                    if (file.data) {
                        let blob = new Blob([ file.data ], {
                            type: mime
                        });
                        let a = document.createElement('a');
                        a.style = 'display: none';
                        document.body.appendChild(a);
                        // Create a DOMString representing the blob and point the link element towards it
                        let url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = docName;
                        // programatically click the link to trigger the download
                        a.click();
                        // release the reference to the file by revoking the Object URL
                        window.URL.revokeObjectURL(url);
                    }
                }
            );
        };

        ctrl.$onInit = function() {
            // debugger;
            console.log('$onInit - previewEmailData: ', JSON.parse(localStorage.getItem('previewEmailData')));
            // console.log(localStorage.getItem('previewEmailData'));

            if(localStorage.getItem('previewEmailData')) {
                let data = JSON.parse(localStorage.getItem('previewEmailData'));
                localStorage.removeItem('previewEmailData');

                $state.go(STATE.PREVIEW_EMAIL, data);
            }

            // also set page title on init, only for preview email pages
            if($state.current.name == 'default.preview-email') {
                $rootScope.$broadcast('$changePageTitle', {
                    title: 'Email Preview'
                });
            }
        };

        // Normalize relevant data for use in the template.
        // Get the generic data Lists.
        if (ctrl.transaction == 'OrderConfirmationToSellerOrVessel') {
            transactionTypeId = [];
            $.each(ctrl.lists.EmailTransactionType, (key, value) => {
                if (value.name == ctrl.transaction) {
                    transactionTypeId.push(value.id);
                }
                if (value.name == 'OrderReConfirmationToSellerOrVessel') {
                    transactionTypeId.push(value.id);
                }
                if (value.name == 'OrderConfirmationToLabEmail') {
                    transactionTypeId.push(value.id);
                }
            });
            if (transactionTypeId.length > 1) {
                ctrl.emailTransactionTypeId = transactionTypeId.join(',');
            }
        } else {
            var transactionTypeId = $filter('filter')(
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
		        	ctrl.state.params.path[1].label = 'Request';
        		}
        	}
        }
        ctrl.loadTemplateList = function() {
            let templateFilter;

            if (window.location.href.indexOf('reportId') != -1) {
            	var getParams = window.location.href.split('?')[1];
            	if (getParams) {
	            	ctrl.emailTransactionTypeId = getParams.split('&')[1].split('=')[1];
	            	ctrl.reportId = getParams.split('&')[0].split('=')[1];
	            	ctrl.transaction = 'QuantityControl';
            	}
            } else if ($state.reportId && (ctrl.defaultTemplate.name == 'BunkerQuantity' || ctrl.defaultTemplate.name == 'SludgeQuantity')) {
                ctrl.emailTransactionTypeId = $state.emailTransactionTypeId;
                ctrl.reportId = $state.reportId;
                ctrl.transaction = 'QuantityControl';
            }

            // Get the template list for the template dropdown
            if (ctrl.transaction === EMAIL_TRANSACTION.ORDER) {
                return orderModel.getTemplates(ctrl.emailTransactionTypeId, ctrl.data.orderId).then((data) => {
                    ctrl.templateList = data.payload;
                    $.each(ctrl.templateList, (k, v) => {
                        if (!v.displayName) {
                            v.displayName = v.name;
                        }
                    });
                    ctrl.getAvailableDocumentAttachments(ctrl.data.orderId, 'Order');
                });
            }

            if (ctrl.transaction === 'OrderNoBDNToVesselEmail') {
                return new Promise((resolve, reject) => {
                    orderModel.previewOrderToBeDeliveredMail(ctrl.data, ctrl.template).then((data) => {
                        ctrl.email = data.payload;
                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                        ctrl.initOthers();
                        if (ctrl.email.comment) {
                            if (!ctrl.email.comment.emailTemplate) {
                                return;
                            }
                            ctrl.templateList = [ ctrl.email.comment.emailTemplate ];
                            ctrl.template = ctrl.email.comment.emailTemplate;
                        }
                        ctrl.getAvailableDocumentAttachments(ctrl.data.orderId, 'Order');
                    }, () => {
                        ctrl.template = null;
                        ctrl.data = {};
                        ctrl.email = {};
                    });
                    resolve(true);
                });
            }
            return emailModel.getTemplates(ctrl.emailTransactionTypeId).then((data) => {
                ctrl.templateList = data.payload;
                switch (ctrl.transaction) {
                case EMAIL_TRANSACTION.REQUEST:
                    ctrl.getAvailableDocumentAttachments(ctrl.data.requestId, 'Request');
                    break;
                case EMAIL_TRANSACTION.GROUP_OF_REQUESTS:
                    var id = ctrl.data.Requirements[0].RequestId;
                    var multipleRequests = false;
                    // check if multiple requests are selected
                    for (let i = 1; i < ctrl.data.Requirements.length; i++) {
                        if (ctrl.data.Requirements[i].RequestId != id) {
                            multipleRequests = true;
                            break;
                        }
                    }
                    templateFilter = $filter('filter')(
                        ctrl.templateList,
                        {
                            // name: "SingleRfqNewRFQEmailTemplate"
                            name: 'MultipleRfqNewRFQEmailTemplate'
                        },
                        true
                    );
                    if (templateFilter.length > 0) {
                        ctrl.template = templateFilter[0];
                    }
                    ctrl.getAvailableDocumentAttachments(ctrl.data.groupId, 'Offer');
                    break;
                case EMAIL_TRANSACTION.REQUOTE:
                    ctrl.template = ctrl.templateList[0];
                    ctrl.defaultTemplate = ctrl.templateList[0];
                    ctrl.getAvailableDocumentAttachments(ctrl.data.groupId, "Offer");
                    break;
                case EMAIL_TRANSACTION.VIEW_RFQ:
                    templateFilter = $filter('filter')(
                        ctrl.templateList,
                        {
                            // name: "SingleRfqRequestChangesEmailTemplate"
                            name: 'MultipleRfqAmendRFQEmailTemplate'
                        },
                        true
                    );
                    ctrl.getAvailableDocumentAttachments(ctrl.data.groupId, "Offer");
                    if (templateFilter.length > 0) {
                        ctrl.template = templateFilter[0];
                        ctrl.defaultTemplate = templateFilter[0];
                    }
                    break;
                case EMAIL_TRANSACTION.ORDER:
	                    ctrl.defaultTemplate = ctrl.templateList[0];
                    break;
                case 'QuantityControl':
	                    ctrl.defaultTemplate = $state.defaultTemplate ? $state.defaultTemplate : ctrl.templateList[0];
                        $rootScope.reportId = ctrl.reportId;
                        ctrl.getAvailableDocumentAttachments(ctrl.reportId, 'QuantityControlReport');
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
                $.each(ctrl.templateList, (k, v) => {
                    if (!v.displayName) {
                        v.displayName = v.name;
                    }
                });
            });
        };

        $scope.$on('selectDocumentAttachment', (e, a) => {
            a.isIncludedInMail = true;
            $scope.addToAttachments(a);
        });

        ctrl.loadTemplateList().then(() => {
            // Get the default template data.
            if (ctrl.defaultTemplate) {
                ctrl.loadTemplate(ctrl.defaultTemplate);
                $state.defaultTemplate = null;
            } else {
                ctrl.loadTemplate(ctrl.template);
            }
        });

        ctrl.formEmailString = function(data) {
            if(typeof data == 'object') {
                // array
                let emailStr = '';
                $.each(data, (_, em) => {
                    emailStr = emailStr + em;
                });
                return emailStr.substring(0, emailStr.length() - 1);
            }
            if(typeof data == 'string') {
                return data.replace(/,/g, ';');
            }
        };

        ctrl.initOthers = function() {
            // debugger;
            if(ctrl.email.toOthers) {
                ctrl.toEmailOthers = ctrl.formEmailString(ctrl.email.toOthers);
            }else{
                ctrl.toEmailOthers = '';
            }
            if(ctrl.email.ccOthers) {
                ctrl.ccEmailOthers = ctrl.formEmailString(ctrl.email.ccOthers);
            }else{
                ctrl.ccEmailOthers = '';
            }
            // screenLoader.hideLoader();
        };

        ctrl.loadTemplate = function(template, oldTemplate) {
            if (template && template.name) {
                if (template.name.toLowerCase().indexOf('surveyor') !== -1) {
                    if (ctrl.data.missingSurveyor) {
                        toastr.error('Surveyor is mandatory');
                        ctrl.template = null;
                        return;
                    }
                }
                if (template.name.toLowerCase().indexOf('lab') !== -1) {
                    if (ctrl.data.missingLab) {
                        toastr.error('Lab is mandatory');
                        ctrl.template = null;
                        return;
                    }
                }
                // if (template.name.toLowerCase().indexOf('pretest') !== -1) {
                //     if (ctrl.data.missingPretest) {
                //         toastr.error('PreTest is mandatory');
                //         ctrl.template = null;
                //         return;
                //     }
                // }
            }

            let payload;
            ctrl.template = template;

            // debugger
            switch (ctrl.transaction) {
            case EMAIL_TRANSACTION.REQUEST:
            case 'ValidatePreRequest':
                console.log($rootScope.isPreview);
                screenLoader.showLoader();
                if (ctrl.template.name === 'Questionnaire - Redelivery') {
                    ctrl.template.name = 'Redelivery';
                }
                if (ctrl.template.name === 'Questionnaire - Standard') {
                    ctrl.template.name = 'Standard';
                }
                newRequestModel.getRequestEmailTemplate(ctrl.data, ctrl.template, ctrl.emailTransactionTypeId, $rootScope.isPreview).then((data) => {
                    ctrl.email = data.payload;

                    // init toOthers and ccOthers
                    ctrl.initOthers();

                    if (ctrl.template.id === 0) {
                        var templateFilter = $filter('filter')(
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
                    $rootScope.isPreview = false;
                }, () => {
                        ctrl.template = null;
                        // ctrl.data = {};
                        ctrl.email = {};
                }).finally(() => {
                    setTimeout(() => {
                        screenLoader.hideLoader();
                    }, 1500);
                });



                break;
            case EMAIL_TRANSACTION.GROUP_OF_REQUESTS:
                // console.log(ctrl.data);
                /** Check if QuoteByDate exists and set it from QuoteByDateFrom if not -- 04.05.2018 (Iri) */
                if (!ctrl.data.QuoteByDate && ctrl.data.QuoteByDateFrom) {
                    ctrl.data.QuoteByDate = ctrl.data.QuoteByDateFrom;
                }
                screenLoader.showLoader();
                groupOfRequestsModel.getRfqEmailTemplate(ctrl.data, ctrl.template).then((data) => {
                    ctrl.email = data.payload;
                    ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                    ctrl.initOthers();
                }, () => {
                    	ctrl.template = null;
                    	ctrl.data = {};
                    	ctrl.email = {};
                }).finally(() => {
                    setTimeout(() => {
                        screenLoader.hideLoader();
                    }, 1500);
                });
                break;
            case EMAIL_TRANSACTION.REQUOTE:
                screenLoader.showLoader();
                groupOfRequestsModel.getRfqRequoteEmailTemplate(ctrl.data).then((data) => {
                    ctrl.email = data.payload;
                    ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                    ctrl.initOthers();
                }, () => {
                    	ctrl.template = null;
                    	ctrl.data = {};
                    	ctrl.email = {};
                }).finally(() => {
                    setTimeout(() => {
                        screenLoader.hideLoader();
                    }, 1500);
                });
                break;
            case 'QuantityControl':
	                payload = {
                    Filters: [ {
                        ColumnName: 'ReportId',
                        Value: ctrl.reportId
                    }, {
                        ColumnName: 'TemplateId',
                        Value: ctrl.template.id
                    }, {
                        ColumnName: 'TemplateName',
                        Value: ctrl.template.name
                    } ]
                };
	                $http.post(`${API.BASE_URL_DATA_ROB }/api/quantityControlReport/preview`, {
	                	Payload: payload
	                }).then((response) => {
	                	ctrl.email = response.data.payload;
	                	ctrl.data = {};
	                	ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
	                	ctrl.initOthers();
	                });
                break;
            case EMAIL_TRANSACTION.VIEW_RFQ:
                screenLoader.showLoader();
                groupOfRequestsModel
                    .getViewRfqEmailTemplate(ctrl.data, ctrl.template)
                    .then((data) => {
                        ctrl.email = data.payload;
                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                        ctrl.defaultTemplate = ctrl.template;
                        ctrl.initOthers();
                    }, () => {
	                    	ctrl.template = null;
	                    	ctrl.data = {};
	                    	ctrl.email = {};
	                    })
                    .catch((data) => {
                        ctrl.template = ctrl.defaultTemplate;
                    }).finally(() => {
                        setTimeout(() => {
                            screenLoader.hideLoader();
                        }, 1500);
                    });
                break;
            case EMAIL_TRANSACTION.ORDER:
                if (ctrl.data.defaultCancellationEmail) {
	                    ctrl.template = ctrl.data.defaultCancellationEmail;
	                    ctrl.data.defaultCancellationEmail = null;
                }
                screenLoader.showLoader();
                if (ctrl.template.id === 0) {
                    setTimeout(() => {
                        screenLoader.hideLoader();
                    }, 1500);
                    return false;
                }
                orderModel.getOrderEmailTemplate(ctrl.data, ctrl.template).then((data) => {
                    	setTimeout(() => {
	                        ctrl.email = data.payload;
	                        ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
	                        ctrl.initOthers();
                    		$scope.$apply();
                    }, 50);
                }, () => {
                    	ctrl.template = null;
                    	// ctrl.data = {};
                    	ctrl.email = {};
                }).finally(() => {
                    setTimeout(() => {
                        screenLoader.hideLoader();
                    }, 1500);
                });
                break;
            case EMAIL_TRANSACTION.ORDER_CONFIRM:
                screenLoader.showLoader();
                orderModel.getOrderConfirmationEmailTemplate(ctrl.data, ctrl.template).then((data) => {
                    ctrl.email = data.payload;
                    ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                    if (ctrl.email.comment) {
                        if (!ctrl.email.comment.emailTemplate) {
                            return;
                        }
                        ctrl.template = ctrl.email.comment.emailTemplate;
                        $.each(ctrl.templateList, (k, v) => {
                            	if (v.id == ctrl.template.id) {
                            		ctrl.template.name = v.name;
                            	}
                        });
                    }
                    ctrl.initOthers();
                }, () => {
                    	ctrl.template = null;
                    	ctrl.data = {};
                    	ctrl.email = {};
                }).finally(() => {
                    setTimeout(() => {
                        screenLoader.hideLoader();
                    }, 1500);
                });
                break;
            case EMAIL_TRANSACTION.CONTRACT_PLANNING:
                screenLoader.showLoader();
                ctrl.data.templateName = template.name;
                newRequestModel.getContractPlanningEmailTemplate(ctrl.data).then((data) => {
                    ctrl.email = data.payload;
                    ctrl.template = data.payload.comment.emailTemplate;
                    ctrl.templateList.forEach((object) => {
                        if (object.id == ctrl.template.id) {
                            ctrl.template = object;
                        }
                    });
                    ctrl.emailContentHtml = $sce.trustAsHtml(ctrl.email.content);
                    ctrl.initOthers();
                    // ctrl.data = null
                }, () => {
                    	ctrl.template = null;
                    	ctrl.data = {};
                    	ctrl.email = {};
                }).finally(() => {
                    setTimeout(() => {
                        screenLoader.hideLoader();
                    }, 1500);
                });
                break;
            default:
                return false;
            }
        };
        ctrl.saveComments = function(action, refresh) {
        	let refreshAfter = refresh;
            if (ctrl.email.comment === null) {
                return false;
            }
            let emailData = {};
            console.log(ctrl.transaction);
            console.log(ctrl.data);
            switch (ctrl.transaction) {
            case EMAIL_TRANSACTION.REQUEST:
            case 'ValidatePreRequest':
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
            case 'QuantityControl':
                emailData = {
                    businessId: ctrl.email.businessId
                };
                break;
            case 'OrderNoBDNToVesselEmail':
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
            // switch to prevstate to create correct payload fo save
            if (action == 'discard') {
            	ctrl.buttonsDisabled = true;
                let validAttachments = [];
                let attachmentList = angular.copy(ctrl.email.attachmentsList);
                let availableAttachmentList = angular.copy(ctrl.availableDocumentAttachmentsList);

                $.each(availableAttachmentList, (k, v) => {
                    if (v.isIncludedInMail === false || v.isIncludedInMail === true) {
                        let elm = angular.copy(v);
                        let found = false;
                        $.each(attachmentList, (k1, v1) => {
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
                emailModel.discardPreview(emailData, ctrl.template).then(() => {
                    $state.defaultTemplate = ctrl.template;
                    $state.reportId = ctrl.reportId;
                    $state.emailTransactionTypeId = ctrl.emailTransactionTypeId;
                    $state.reload();
    	        	if ($stateParams.data) {
	    	        	if ($stateParams.data.defaultTemplate) {
					        $stateParams.data.defaultTemplate = null;
			        	}
    	        	}
                }).finally(() => {
                	ctrl.buttonsDisabled = false;
                });
            } else if (action == 'sendRFQ') {
            	ctrl.buttonsDisabled = true;
                return emailModel.saveComments(emailData, ctrl.email.comment, ctrl.template, ctrl.email).then(() => {
                    // $state.defaultTemplate = ctrl.template;
                    // $rootScope.refreshPending = true;
                    if (ctrl.state.current.name == 'default.group-of-requests') {
	                    $rootScope.$broadcast('sendEmailRFQ', ctrl.data.Requirements);
                    }
                }).finally(() => {
                	ctrl.buttonsDisabled = false;
                });
            } else if (ctrl.transaction == EMAIL_TRANSACTION.CONTRACT_PLANNING) {
            	ctrl.buttonsDisabled = true;
                return emailModel.saveForBusinessIds(emailData, ctrl.email.comment, ctrl.template, ctrl.email).then(() => {

                }).finally(() => {
                	ctrl.buttonsDisabled = false;
                });
            } else {
            	ctrl.buttonsDisabled = true;
                return emailModel.saveComments(emailData, ctrl.email.comment, ctrl.template, ctrl.email).then(() => {
    	        	if ($stateParams.data) {
	    	        	if ($stateParams.data.defaultTemplate) {
					        $stateParams.data.defaultTemplate = null;
			        	}
    	        	}
                    $state.defaultTemplate = ctrl.template;
                    if(refreshAfter && ctrl.transaction != 'QuantityControl') {
                        $state.reload();
                    }

                    if (ctrl.state.current.name == 'default.group-of-requests') {
	                    $rootScope.$broadcast('reloadGroupPreviewRFQ', true);
                    }
                }).finally(() => {
                	ctrl.buttonsDisabled = false;
                    // if (ctrl.state.current.name == "default.group-of-requests") {
	                   //  $rootScope.$broadcast("sendEmailRFQ", 'noReload');
                    // }
                });
            }
        };

        ctrl.saveAndSend = function(action) {
            let errors = [];
            if (ctrl.template) {
                if (ctrl.template.name.toLowerCase().indexOf('confirm') !== -1) {
                    if (ctrl.data.missingPhysicalSupplier) {
                        errors.push('Physical supplier is mandatory');
                    }
                    if (ctrl.data.missingSpecGroup) {
                        errors.push('Spec group is mandatory');
                    }
                }
            }

            if (errors.length > 0) {
                _.each(errors, (value, key) => {
                    toastr.error(value);
                });
                return;
            }

            window.clickOnSaveAndSend = true;
            ctrl.saveComments(action, false).then(() => {
                if (action != 'sendRFQ') {
                    // ctrl.sendEmail(true);
                    ctrl.sendEmail(false);
                }
            });
        };

        ctrl.sendEmail = function(remainOnSamePage) {
        	$.each(ctrl.templateList, (k, v) => {
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
                toastr.error('Please check the recipient field!');
                return false;
            }

            if (ctrl.transaction == 'OrderNoBDNToVesselEmail') {
                let orderId = ctrl.data.orderId;
                let orderProductIds = ctrl.data.orderProductIds;

                if (orderId && orderProductIds) {
                    orderModel.sendOrderToBeDeliveredMail(orderId, orderProductIds).then(() => {
                        // toastr.success('Operation completed successfully');
                        window.location.href = '#/delivery/ordersdelivery';
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

            if (ctrl.transaction == 'QuantityControl') {
            	if (!ctrl.email.businessId) {
            		ctrl.email.businessId = ctrl.reportId;
            	}
            	remainOnSamePage = true;
            }
            if (ctrl.transaction == EMAIL_TRANSACTION.ORDER && ctrl.email.comment.emailTemplate.name != 'SludgeConfirmationToVesselEmail') {
        		if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToSeller') != -1) {
	                orderModel.sendOrderCommand('confirmToSeller', ctrl.email.businessId)
	                .then((response) => {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch((error) => {
	                    ctrl.buttonsDisabled = false;
	                });
        			return;
        		}
        		if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToVessel') != -1 || ctrl.email.comment.emailTemplate.name == "OrderConfirmationSingleEmail") {
	                orderModel.sendOrderCommand('confirmToAll', ctrl.email.businessId)
	                .then((response) => {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch((error) => {
	                    ctrl.buttonsDisabled = false;
	                });
        			return;
        		}
        		if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToLab') != -1) {
	                orderModel.sendOrderCommand('confirmToLab', ctrl.email.businessId)
	                .then((response) => {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch((error) => {
	                    ctrl.buttonsDisabled = false;
	                });
        			return;
        		}
        		if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToSurveyor') != -1) {
	                orderModel.sendOrderCommand('confirmToSurveyor', ctrl.email.businessId)
	                .then((response) => {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch((error) => {
	                    ctrl.buttonsDisabled = false;
	                });
        			return;
        		}
        		if (ctrl.email.comment.emailTemplate.name.indexOf('PreTestNominationConfirmation') != -1) {
	                orderModel.sendOrderCommand('confirmPretest', ctrl.email.businessId)
	                .then((response) => {
	                	window.history.back();
	                    ctrl.buttonsDisabled = false;
	                }).catch((error) => {
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
		            groupOfRequestsModel.revokeAndSend(rfq_data).then((data) => {
                        if (data.payload) {
                            if (data.payload.redirectToRequest) {
                                var lastRequestId = rfq_data.Requirements[0].RequestId;
                                location.href = `/#/edit-request/${lastRequestId}`;
                                return;
                            }
                        }
                        window.history.back();
                    });
		            return;
	            }

	            if (ctrl.data.rfqRequirements && ctrl.email.comment.emailTemplate.name == 'MultipleRfqAmendRFQEmailTemplate') {
		            var rfq_data = ctrl.data.rfqRequirements;
		            // if (!ctrl.canAmendRFQ(ctrl.data.rfqRequirements)) {
		            // 	toastr.error("You cannot Amend RFQ for the selected product");
		            // 	return;
		            // }
		            groupOfRequestsModel.amendAndSend(rfq_data).then(
                        window.history.back()
		            );
		            return;
	            }
            }

            // ctrl.data.orderCanConfirmSelerEmail = true;
            ctrl.buttonsDisabled = true;
            console.log($scope, ctrl);

            if (ctrl.data.orderCanConfirmSelerEmail) {
	            let request_data = {
	                Filters: [ {
	                    ColumnName: 'OrderId',
	                    Value: ctrl.data.orderId
	                }, {
	                    ColumnName: 'TemplateId',
	                    Value: ctrl.template.id
	                }, {
	                    ColumnName: 'TemplateName',
	                    Value: ctrl.template.name
	                } ]
	            };
	            // request_data = payloadDataModel.create(payload);
            	orderModel.mailPreviewConfirmToSeller(request_data).then(() => {
		            emailModel.sendEmail(ctrl.email, ctrl.template).then(() => {
		                if (ctrl.transaction != EMAIL_TRANSACTION.GROUP_OF_REQUESTS) {
                            if(!remainOnSamePage) {
                                $window.history.back();
                            }
		                }
		            });
            	}).finally(() => {
            		ctrl.buttonsDisabled = false;
            		$state.reload();
            	});
            } /* else if (ctrl.data.command) {
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
	            emailModel.sendEmail(ctrl.email, ctrl.template).then(() => {
                    if(ctrl.template && ctrl.template.name === 'Questionnaire - Standard' ||
						ctrl.template.name === 'Questionnaire - Redelivery' ||
						ctrl.template.name === 'Redelivery' ||
						ctrl.template.name === 'Standard'
                    ) {
                        var payload = ctrl.data.requestId;
                        newRequestModel.questionnaireStatus(payload).then(() => {
                            $window.history.back();
                        });
                    } else {
		                if (ctrl.transaction != EMAIL_TRANSACTION.GROUP_OF_REQUESTS) {
	                        if(!remainOnSamePage) {
	                            $window.history.back();
	                       }
		                }
	                    if (ctrl.transaction == 'QuantityControl') {
                            if (ctrl.template.name == 'BunkerQuantity') {
                                $http.post(`${API.BASE_URL_DATA_ROB }/api/quantityControlReport/updateStatus`, {
                                    Payload: { reportIds : [ ctrl.reportId ] }
                                }).then((response) => {
                                    window.history.back();
                                });
                            } else {
                                window.history.back();
                            }
	                    }
                    }
	            }).finally(() => {
	                if (ctrl.transaction == EMAIL_TRANSACTION.CONTRACT_PLANNING) {
	                	window.location.href = '#/contract-planning/';
	                	return;
	                }
	            	ctrl.buttonsDisabled = false;
	            	if (ctrl.transaction != 'QuantityControl') {
		            	$state.reload();
	            	}
	            });
            }

            if (window.location.href.indexOf('preview-email?') == -1 && ctrl.transaction == 'QuantityControl') {
                window.history.back();

            }


        };


        ctrl.canAmendRFQ = function(requirements) {
            let requirement;
            let isCorrect = true;
            for (let i = 0; i < requirements.length; i++) {
                requirement = requirements[i];
                if (typeof requirement.requestOfferId == 'undefined' || requirement.requestOfferId === null) {
                    isCorrect = false;
                    break;
                }
            }
            return isCorrect;
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
                    $filter('filter')(list, {
                        idEmailAddress: email.idEmailAddress
                    }).length > 0;
            } else {
                isEmailInList = false;
            }
            if (!isEmailInList) {
                list.push(email);
            } else {
                toastr.error('Email address is already added!');
            }
            clearEmailInputs();
        };
        ctrl.removeEmail = function(email, list) {
        	$('[tooltip]').tooltip('destroy');
            console.log(email);
            list.splice(email, 1);
            setTimeout(() => {
	            $('[tooltip]').tooltip();
            }, 100);
        };
        jQuery(document).ready(($) => {
        	$(document).on('mouseover', '*[tooltip]', () => {
	            $('[tooltip]').tooltip();
        	});
        });

        function clearEmailInputs() {
            ctrl.toEmail = '';
            ctrl.ccEmail = '';
        }
        ctrl.clearEmailInputs = function() {
            ctrl.toEmail = '';
            ctrl.ccEmail = '';
        };
        ctrl.canSend = function() {
            // || ctrl.transaction === EMAIL_TRANSACTION.REQUOTE
            if (ctrl.transaction === EMAIL_TRANSACTION.GROUP_OF_REQUESTS /* || ctrl.transaction === EMAIL_TRANSACTION.VIEW_RFQ*//* commented because of bug 8464*/) {
                return false;
            } else if (ctrl.transaction === EMAIL_TRANSACTION.ORDER) {
                if (typeof ctrl.email.businessId == 'undefined') {
                    return false;
                }

                if(typeof ctrl.email.comment.emailTemplate.name != 'undefined') {
                    if (ctrl.email.comment.emailTemplate.name == 'ContractOrderConfirmationEmail') {
                        if (!ctrl.data.canSendConfirm) {
                            return false;
                        }
                    }
                    if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToSeller') != -1) {
                        if (!ctrl.data.canSendConfirmToSeller) {
                            return false;
                        }
                    }
                    if (ctrl.email.comment.emailTemplate.name.indexOf('ConfirmationToVessel') != -1) {
                        if (!ctrl.data.canSendConfirmToVessel) {
                            return false;
                        }
                    }
                }else if (typeof ctrl.data.canSend !== 'undefined') {
                    return ctrl.data.canSend;
                }
            }
            return true;
        };
        ctrl.goBack = function() {
            if (window.location.href.indexOf('preview-email?reportId') != 1 && ctrl.transaction == 'QuantityControl') {
                console.log("QUANTITY CONTROL");
                let reportUrl = 'v2/quantity-control/report/' + ctrl.reportId + '/details';
                window.location.href = reportUrl;
            } else {
                $window.history.back();
            }
        };
        ctrl.focusInnerInput = function(event) {
            console.log(event.target);
            $(event.target)
                .children('input.typeahead')
                .focus();
        };

        ctrl.validateEmails = function(string, key) {
            if (!string || string.length == 0) {
                ctrl.email[key] = emailObj;
                ctrl.emailPreview[key].$setValidity(key, true);
            }else{
                var emailObj = [];

                // force copy the string
                let string_copy = `${string }`;
                emailObj = string_copy.replace(/\s/g, '').split(';');

                emailObj = emailObj.filter((e) => {
                    return e;
                });


                var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (emailObj.length > 0) {
                    var i = 0;
                    $.each(emailObj, (k, v) => {
                        if (!pattern.test(v)) {
                            toastr.error(`${v } is not a valid email address!`);
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
            var saveAndSendButtonLabel = 'Save and Send';
            if ([ 'ContractPlanningEmailTemplate', 'ContractPlanningUpdateEmailTemplate', 'RequoteRFQEmailTemplate' ].indexOf(ctrl.template.name) != -1) {
                saveAndSendButtonLabel = 'Send Email';
            }

            return saveAndSendButtonLabel;
        };
    }
]);
angular.module('shiptech.pages').component('previewEmail', {
    templateUrl: 'pages/preview-email/views/preview-email-component.html',
    controller: 'PreviewEmailController'
});
