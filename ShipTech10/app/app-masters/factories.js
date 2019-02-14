/**
 * Master Factory
 */
APP_MASTERS.factory('Factory_Master', ['$window', '$http', '$Api_Service', 'API', 'screenLoader', function($window, $http, $Api_Service, API, screenLoader) {
    var general_api = '';
    return {
        mastersTree: function(callback) {
            $http({
                method: 'GET',
                url: 'layouts/mastersList.json'
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                callback(response.data);
            }, function errorCallback(response) {
                console.log(response)
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            return false;
        },
        getTranslations: function(callback) {
            $http({
                method: 'GET',
                url: 'translations/cma.json'
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                callback(response.data);
            }, function errorCallback(response) {
                console.log(response)
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        },
        getScreenActions: function(data, callback) {
            $Api_Service.screen.get_actions(data, function(result) {
                callback(result);
            });
        },
        get_master_structure: function(app, master_id, generic_layout, dev, callback) {
            screenLoader.showLoader();
            // debugger;
            var data = {
                app: app,
                screen: master_id,
                generic: generic_layout
            };
            if (dev == 1) {
                $http({
                    method: 'GET',
                    url: 'layouts/' + data.screen + '.json'
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    callback(response.data.layout);
                }, function errorCallback(response) {
                    console.log(response)
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
                if (app == 'masters') {
                    data.screen = 'counterparty';
                    $Api_Service.screen.get(data, function(result) {
                        console.log(result.layout);
                    });
                }
            } else {
                $Api_Service.screen.get(data, function(result) {
                    callback(result.layout);
                });
            }
            return false;
        },
        getPriceTypes: function(app, master_id, callback) {
            var data = {
                app: app,
                screen: master_id,
                id: 1
            };
            // console.log(data);
            $Api_Service.entity.get(data, function(result) {
                callback(result);
            });
            return false;
        },
        getContractFormulas: function(data, callback) {
            $Api_Service.contract.getContractFormulas(data, function(result) {
                callback(result);
            });
            return false;
        },
        upload_file: function(fd, callback) {
            uploadUrl = API.BASE_URL_DATA_MASTERS + '/api/masters/companies/createLogo';
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function successCallback(response) {
                if (response) {
                    callback('Success')
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });
        },
        upload_document: function(data, callback) {
            var url = API.BASE_URL_DATA_MASTERS + '/api/masters/documentupload/create';
            $http.post(url, data, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function successCallback(response) {
                if (response) {
                    callback('Success');
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });
        },
        get_file: function(id, callback) {
            getUrl = API.BASE_URL_DATA_MASTERS + '/api/masters/companies/download';
            id = {
                "Payload": id
            };
            $http.post(getUrl, id, {
                responseType: "arraybuffer"
            }).then(function successCallback(response) {
                if (response.data) {
                    mime = response.headers("content-type");
                    callback(response.data, mime);
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });
        },
        get_document_file: function(payload, callback) {
            url = API.BASE_URL_DATA_MASTERS + '/api/masters/documentupload/download';
            $http({
                method: 'POST',
                url: url,
                data: payload,
                responseType: "arraybuffer",
                headers: {
                    'Origin': 'http://localhost:9000',
                    // 'Content-Type': undefined
                    'Content-Type': 'application/json',
                }
            }).then(function success(response) {
                if (response) {
                    var mime = response.headers("content-type");
                    callback(response, mime);
                }
            }, function error(response) {
                if (response) {
                    callback(response, false);
                }
            });
        },
        generateTemplate: function(payload, callback) {
            url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/upload/generate';
            $http({
                method: 'POST',
                url: url,
                data: payload,
                responseType: "arraybuffer",
                headers: {
                    // 'Origin': 'http://localhost:9001',
                    'Content-Type': 'application/json',
                }
            }).then(function success(response) {
                if (response) {
                    var mime = response.headers("content-type");
                    callback(response, mime);
                }
            }, function error(response) {
                if (response) {
                    callback(response, false);
                }
            });
        },
        downloadFTP: function(payload, callback) {
            // url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/download/downloadFile';
            url = API.BASE_URL + '/Shiptech10.Api.ImportExport/api/importExport/download/downloadFile';
            $http({
                method: 'POST',
                url: url,
                data: payload,
                responseType: "arraybuffer",
                headers: {
                    // 'Origin': 'http://localhost:9001',
                    'Content-Type': 'application/json',
                }
            }).then(function success(response) {
                if (response) {
                    var mime = response.headers("content-type");
                    callback(response, mime);
                }
            }, function error(response) {
                if (response) {
                    callback(response, false);
                }
            });
        },
        sapExport: function(payload, newExport, callback) {
            if (newExport) {
                url = API.BASE_URL_DATA_PROCUREMENT + "/api/procurement/order/SAPExport"
            } else {
                url = API.BASE_URL_DATA_PROCUREMENT + "/api/procurement/order/SAPExportGetFile"
            }
            $http({
                method: 'POST',
                url: url,
                data: payload,
                responseType: "arraybuffer",
                headers: {
                    // 'Origin': 'http://localhost:9001',
                    'Content-Type': 'application/json',
                }
            }).then(function success(response) {
                if (response) {
                    var mime = response.headers("content-type");
                    callback(response, mime);
                }
            }, function error(response) {
                if (response) {
                    callback(response, false);
                }
            });
        },
        uploadSchedulerConfiguration: function(payload, callback) {
            url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/upload/newschedulerconfiguration';
            $http({
                method: 'POST',
                url: url,
                data: payload,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function success(response) {
                if (response) {
                    callback(response);
                }
            }, function error(response) {
                if (response) {
                    callback(response, false);
                }
            });
        },
        uploadFTPFile: function(payload, callback) {
            url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/upload/upload';
            $http({
                method: 'POST',
                url: url,
                data: payload,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function success(response) {
                if (response) {
                    callback(response);
                }
            }, function error(response) {
                if (response) {
                    callback(response, false);
                }
            });
        },
        get_master_elements: function(app, master_id, dev, callback) {
            var data = {
                app: app,
                screen: master_id
            };
            if (dev == 1) {
                $http({
                    method: 'GET',
                    url: 'layouts/' + data.screen + '.json'
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    callback(response.data.elements);
                }, function errorCallback(response) {
                    console.log(response)
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            } else {
                $Api_Service.entity.structure(data, function(result) {
                    callback(result);
                });
            }
        },
        get_master_entity: function(entity_id, master_id, app, callback, screenChild) { 
            var data = {
                app: app,
                screen: master_id,
                id: entity_id,
                child: screenChild,
            };
            // if(app == "default" && child == "entity_documents") return;
            $Api_Service.entity.get(data, function(result) {
                callback(result);
            });
            return false;
        },
        finalInvoiceDuedates: function(payload, callback) {
            url = API.BASE_URL_DATA_INVOICES + '/api/invoice/finalInvoiceDueDates';
            $http({
                method: 'POST',
                url: url,
                data: payload,
                // responseType: "json",
            }).then(function success(response) {
                if (response) {
                    callback(response.data.payload);
                }
            }, function error(response) {
                if (response) {
                    callback(response, false);
                }
            });
        },
        createDebunker: function(id, callback) {
            $Api_Service.claim.debunker(id, function(result) {
                callback(result);
            });
            return false;
        },
        save_terms_and_conditions: function(id, text, callback) {
            var data = {
                "Filters": [{
                    "ColumnName": "ContractId",
                    "Value": id
                }, {
                    "ColumnName": "Terms",
                    "Value": text
                }]
            }
            $Api_Service.contract.save_terms_and_conditions(data, function(result) {
                callback(result);
            });
            return false;
        },
        get_master_list: function(app, screen, field, callback) {
            var data = {
                app: app,
                screen: screen,
                field: field
            };
            if (field.Type == 'dropdown' || field.Type == 'textUOM') {
                $Api_Service.dropdown.get(data, function(result) {
                    callback(result);
                });
            } else {
                $Api_Service.dropdown.lookup(data, function(result) {
                    callback(result);
                });
            }
            return false;
        },
        getDataTable: function(app, screen, id, data, callback) {
            var data = {
                app: app,
                screen: screen,
                id: id,
                data: data
            };
            $Api_Service.datatable.get(data, function(result) {
                callback(result);
            });
            return false;
        },
        exchangeRate: function(param, callback) {
            $Api_Service.dropdown.custom(param, function(result) {
                callback(result);
            });
            return false;
        },
        get_custom_dropdown: function(param, callback) {
            $Api_Service.dropdown.custom(param, function(result) {
                callback(result);
            });
            return false;
        },
        getChangedValues: function(master, order_id, delivery_number, lab_result_id, name, callback) {
            var data = {
                dropdown: master,
                order_id: order_id,
                delivery_number: delivery_number,
                lab_result_id: lab_result_id,
                dropdown_id: name
            };
            $Api_Service.dropdown.get(data, function(result) {
                callback(result);
            });
            return false;
        },
        save_master_structure: function(app, screen, layout, callback) {
            var data = {
                app: app,
                screen: screen,
                layout: layout
            };
            $Api_Service.screen.update(data, function(result) {
                callback(result);
            });
        },
        save_master_changes: function(app, screen, fields, callback) {
            var data = {
                app: app,
                screen: screen,
                data: fields,
            };
            $Api_Service.entity.update(data, function(result) {
                callback(result);
            });
        },
        labsActions: function(app, screen, id, action, status, callback) {
            var data = {
                app: app,
                screen: screen,
                id: id,
                status: status,
            };
            if (action == 1) {
                $Api_Service.entity.verify(data, function(result) {
                    callback(result);
                });
            } else if (action == 2) {
                $Api_Service.entity.revert(data, function(result) {
                    callback(result);
                });
            }
        },
        create_master_entity: function(app, screen, fields, callback) {
            var data = {
                app: app,
                screen: screen,
                data: fields,
            };
            $Api_Service.entity.create(data, function(result) {
                callback(result);
            });
        },
        cancel_claim: function(app, screen, fields, callback) {
            var data = {
                app: app,
                screen: screen,
                data: fields,
            };
            $Api_Service.entity.cancel(data, function(result) {
                callback(result);
            });
        },
        complete_claim: function(app, screen, fields, callback) {
            var data = {
                app: app,
                screen: screen,
                data: fields,
            };
            $Api_Service.entity.complete(data, function(result) {
                callback(result);
            });
        },
        verify_delivery: function(app, screen, id, deliveryDto, callback) {
            var data = {
                app: app,
                screen: screen,
                id: id,
                payload: deliveryDto,
                bulk: false,
                verifyAndSave: true
            };
            $Api_Service.entity.verify(data, function(result) {
                callback(result);
            });
        },
        bulk_verify_delivery: function(app, screen, ids, callback) {
            var data = {
                app: app,
                screen: screen,
                payload: ids,
                id: 42,
                bulk: true
            };
            $Api_Service.entity.verify(data, function(result) {
                callback(result);
            });
        },
        get_seller_rating: function(app, screen, id, callback) {
            var data = {
                app: app,
                screen: screen,
                id: id,
            };
            $Api_Service.rating.get(data, function(result) {
                callback(result);
            });
        },
        create_seller_rating: function(app, screen, data, callback) {
            var data = {
                app: app,
                screen: screen,
                data: data,
            };
            $Api_Service.rating.create(data, function(result) {
                callback(result);
            });
        },
        create_invoice_from_delivery: function(data, callback) {
            $Api_Service.invoice.createfromdelivery(data, function(result) {
                callback(result);
            });
        },
        dueDateWithoutSave: function(payload, callback) {
            $Api_Service.invoice.dueDateWithoutSave(payload, function(res) {
                callback(res);
            });
        },
        cancel_invoice: function(fields, callback) {
            $Api_Service.invoice.cancelInvoice(fields, function(res) {
                console.log(fields)
                callback(res);
            });
        },
        submit_invoice_review: function(fields, callback) {
            $Api_Service.invoice.submitInvoiceReview(fields, function(res) {
                callback(res);
            });
        },
        accept_invoice: function(fields, callback) {
            $Api_Service.invoice.acceptInvoice(fields, function(res) {
                callback(res);
            });
        },
        submit_invoice_approve: function(fields, callback) {
            $Api_Service.invoice.submitInvoiceApprove(fields, function(res) {
                callback(res);
            });
        },
        approve_invoice: function(fields, callback) {         
            $Api_Service.invoice.approveInvoice(fields, function(res) {
                callback(res);
            });
        },
        revert_invoice: function(fields, callback) {
            $Api_Service.invoice.revertInvoice(fields, function(res) {
                callback(res);
            });
        },        
        reject_invoice: function(fields, callback) {
            $Api_Service.invoice.rejectInvoice(fields, function(res) {
                callback(res);
            });
        },
        get_apply_for_list: function(order_id, callback) {
            $Api_Service.invoice.getApplyForList(order_id, function(res) {
                callback(res);
            });
        },
        change_password: function(data, callback) {
            $Api_Service.admin.changePassword(data, function(result) {
                callback(result);
            });
        },
        create_credit_note: function(data, callback) {
            $Api_Service.invoice.createCreditNote(data, function(result) {
                callback(result);
            });
        },
        claims_create_credit_note: function(data, callback) {
            $Api_Service.claim.createCreditNote(data, function(result) {
                callback(result);
            });
        },
        get_conversion_info: function(data, callback) {
            $Api_Service.delivery.getConversionInfo(data, function(result) {
                // console.log(result);
                callback(result);
            });
        },
        raise_claim: function(data, callback) {
            $Api_Service.delivery.raiseClaim(data, function(result) {
                // console.log(result);
                callback(result);
            });
        },
        send_labs_template_email: function(data, callback) {
            $Api_Service.delivery.sendLabsTemplateEmail(data, function(result) {
                // console.log(result);
                callback(result);
            });
        },
        revert_verify: function(data, callback) {
            $Api_Service.delivery.revertVerify(data, function(result) {
                // console.log(result);
                callback(result);
            });
        },
        confirm_contract: function(data, callback) {
            $Api_Service.contract.confirm(data, function(result) {
                console.log(result);
                callback(result);
            });
        },
        delete_contract: function(data, callback) {
            $Api_Service.contract.delete(data, function(result) {
                console.log(result);
                callback(result);
            });
        },
        cancel_contract: function(data, callback) {
            $Api_Service.contract.cancel(data, function(result) {
                callback(result);
            });
        },
        extend_contract: function(data, callback) {
            $Api_Service.contract.extend(data, function(result) {
                console.log(result);
                callback(result);
            });
        },
        undo_confirm_contract: function(data, callback) {
            $Api_Service.contract.undo(data, function(result) {
                console.log(result);
                callback(result);
            });
        },
        get_working_due_date: function(data, callback) {
            $Api_Service.invoice.getWorkingDueDate(data, function(result) {
                callback(result);
            });
        },
        list_by_transaction_type: function(data, callback) {
            $Api_Service.mail.list_by_transaction_type(data, function(result) {
                callback(result);
            });
        },
        contract_preview: function(data, callback) {
            $Api_Service.contract.previewContract(data, function(result) {
                callback(result);
            });
        },
        send_contract_preview: function(data, callback) {
            $Api_Service.mail.sendPreviewContract(data, function(result) {
                callback(result);
            });
        },
        send_email_preview: function(data, callback) {
            $Api_Service.mail.sendEmailPreview(data, function(result) {
                callback(result);
            });
        },
        discardSavedPreview: function(data, callback) {
            $Api_Service.mail.discardSavedPreview(data, function(result) {
                callback(result);
            });
        },
        contract_preview_email: function(data, callback) {
            $Api_Service.contract.contractPreviewEmail(data, function(result) {
                callback(result);
            });
        },
        labs_preview_email: function(data, callback) {
            $Api_Service.labs.labsPreviewEmail(data, function(result) {
                callback(result);
            });
        },
        invalid_lab: function(data, callback) {
            $Api_Service.labs.invalid_lab(data, function(result) {
                callback(result);
            });
        },
        save_email_contract: function(data, callback) {
            $Api_Service.mail.saveEmailPreview(data, function(result) {
                callback(result);
            });
        },
        bring_rob_status: function(data, callback){
            $Api_Service.masters.bring_rob_status(data, function(result) {
                callback(result);
            });
        },
        claim_preview_email: function(data, callback) {
            $Api_Service.claim.claimPreviewEmail(data, function(result) {
                callback(result);
            });
        },
        getTransactionsForApp: function(data, callback) {
            $Api_Service.alerts.getTransactionsForApp(data, function(result) {
                callback(result);
            });
        },
        getAlertsParametersForTransaction: function(data, callback) {
            $Api_Service.alerts.getAlertsParametersForTransaction(data, function(result) {
                callback(result);
            });
        },
        alertsGetRuleCondition: function(data, callback) {
            $Api_Service.alerts.alertsGetRuleCondition(data, function(result) {
                callback(result);
            });
        },
        alertsGetRuleOperator: function(data, callback) {
            $Api_Service.alerts.alertsGetRuleOperator(data, function(result) {
                callback(result);
            });
        },
        alertsGetTriggerRuleValuesByParamId: function(data, callback) {
            $Api_Service.alerts.alertsGetTriggerRuleValuesByParamId(data, function(result) {
                callback(result);
            });
        },
        alertsGetRoles: function(data, callback) {
            $Api_Service.alerts.alertsGetRoles(data, function(result) {
                callback(result);
            });
        },
        alertsGetUserFromRoles: function(data, callback) {
            $Api_Service.alerts.alertsGetUserFromRoles(data, function(result) {
                callback(result);
            });
        },
        getAlertTypes: function(data, callback) {
            $Api_Service.alerts.getAlertTypes(data, function(result) {
                callback(result);
            });
        },
        alertsGetActivationDetailsRecurrences: function(data, callback) {
            $Api_Service.alerts.alertsGetActivationDetailsReccurences(data, function(result) {
                callback(result);
            });
        },
        alertsGetActivationDetailsUntils: function(data, callback) {
            $Api_Service.alerts.alertsGetActivationDetailsUntils(data, function(result) {
                callback(result);
            });
        },
        getSpecParamsDeliveryProduct: function(data, callback) {
            $Api_Service.delivery.getSpecParamsDeliveryProduct(data, function(result) {
                callback(result);
            });
        },
        getQtyParamsDeliveryProsuct: function(data, callback) {
            $Api_Service.delivery.getQtyParamsDeliveryProsuct(data, function(result) {
                callback(result);
            });
        },
        getSplitDeliveryLimits: function(data, callback) {
            $Api_Service.delivery.getSplitDeliveryLimits(data, function(result) {
                callback(result);
            });
        },
        convertCurrency: function(data, callback) {
            $Api_Service.masters.convertCurrency(data, function(result) {
                callback(result);
            });
        },
        getByStrategyAndProduct: function(data, callback) {
            $Api_Service.contract.getByStrategyAndProduct(data, function(result) {
                callback(result);
            });
        },
        getNotificationsList: function(data, callback) {
            $Api_Service.alerts.getNotificationsList(data, function(result) {
                callback(result);
            });
        },
        initSignalRParameters: function(callback) {
            $Api_Service.alerts.initSignalRParameters(function(result) {
                callback(result);
            });
        },
        raiseNoteOfProtestProduct: function(data, callback) {
            $Api_Service.delivery.raiseNoteOfProtestProduct(data, function(result) {
                callback(result);
            });
        },
        notificationsActions: function(data, callback) {
            $Api_Service.alerts.notificationsActions(data, function(result) {
                callback(result);
            });
        },
        contractProductDeliveryActions: function(data, type, callback) {
            $Api_Service.contract.contractProductDeliveryActions(data, type, function(result) {
                callback(result);
            });
        },
        saveContractDeliveryModal: function(data, type, callback) {
            $Api_Service.contract.saveContractDeliveryModal(data, type, function(result) {
                callback(result);
            });
        },
        get_group_requests_ids: function(data, callback) {
            $Api_Service.request.get_group_requests_ids(data, function(result) {
                callback(result);
            });
        },
        saveTreasuryTableData: function(data, callback) {
            $Api_Service.invoice.saveTreasuryTableData(data, function(result) {
                callback(result);
            });
        },
        getUomConversionFactor: function(data, callback) {
            $Api_Service.masters.getUomConversionFactor(data, function(result) {
                callback(result);
            });
        },
        getAdditionalCosts: function(data, callback) {
            $Api_Service.masters.getAdditionalCosts(data, function(result) {
                callback(result);
            });
        },
        getSpecForProcurement: function(data, application, callback) {
            $Api_Service.procurement.getSpecForProcurement(data, application, function(result) {
                callback(result);
            });
        },
        saveSpecForProcurement: function(data, application, callback) {
            $Api_Service.procurement.saveSpecForProcurement(data, application, function(result) {
                callback(result);
            });
        },
        getContractFormulaList: function(data, callback) {
            $Api_Service.contract.getContractFormulaList(data, function(result) {
                callback(result);
            });
        },
        getRelatedDeliveries: function(data, callback) {
            $Api_Service.delivery.getRelatedDeliveries(data, function(result) {
                callback(result);
            });
        },
        getDeliveryConfigurations: function(data, callback) {
            $Api_Service.delivery.getDeliveryConfigurations(data, function(result) {
                callback(result);
            });
        },
        deleteDelivery: function(data, callback) {
            $Api_Service.delivery.deleteDelivery(data, function(result) {
                callback(result);
            });
        },
        deleteDeliveryProduct: function(data, callback) {
            $Api_Service.delivery.deleteDeliveryProduct(data, function(result) {
                callback(result);
            });
        },
        splitDelivery: function(data, callback) {
            $Api_Service.delivery.splitDelivery(data, function(result) {
                callback(result);
            });
        },
        specGroupGetByProduct: function(data, callback) {
            $Api_Service.masters.specGroupGetByProduct(data, function(result) {
                callback(result);
            });
        },
        getSellerBlade: function(data, callback) {
            $Api_Service.procurement.getSellerBlade(data, function(result) {
                callback(result);
            });
        },
        getEnergyBlade: function(data, callback) {
            $Api_Service.procurement.getEnergyBlade(data, function(result) {
                callback(result);
            });
        },
        getLabInfoForOrder: function(data, callback) {
            $Api_Service.labs.getLabInfoForOrder(data, function(result) {
                callback(result);
            });
        },
        deleteLab: function(data, callback) {
            $Api_Service.labs.deleteLab(data, function(result) {
                callback(result);
            });
        },
        updatePaymentProofDetails: function(data, callback) {
            $Api_Service.invoice.updatePaymentProofDetails(data, function(result) {
                callback(result);
            });
        },
        getReportsGroups: function(callback) {
            $Api_Service.reports.getReportsGroups(function(result) {
                callback(result);
            });
        },
        getReportsInGroup: function(data, callback) {
            $Api_Service.reports.getReportsInGroup(data, function(result) {
                callback(result);
            });
        },
        deleteContact: function(data, callback) {
            $Api_Service.entity.delete(data, function(result) {
                callback(result);
            });
        },
        getProductsForSellerInLocation: function(data, callback) {
            $Api_Service.masters.getProductsForSellerInLocation(data, function(result) {
                callback(result);
            });
        },
        getPreferredProductsForSellerInLocation: function(data, callback) {
            $Api_Service.masters.getPreferredProductsForSellerInLocation(data, function(result) {
                callback(result);
            });
        },
        invoiceTotalConversion: function(data, callback) {
            $Api_Service.invoice.invoiceTotalConversion(data, function(result) {
                callback(result);
            });
        },
        getReport: function(data, callback) {
            $Api_Service.reports.getReport(data, function(result) {
                callback(result);
            });
        },
        selectAllTreasuryReport: function(data, callback) {
            $Api_Service.invoice.selectAllTreasuryReport(data, function(result) {
                callback(result);
            });
        },
        contractPlanningGetQuantityAverage: function(data, callback) {
            $Api_Service.request.contractPlanningGetQuantityAverage(data, function(result) {
                callback(result);
            });
        },        
        get_master_list_filtered: function(app, screen, clc_id, callback) {
            var data = {
                app: app,
                screen: screen,
                clc_id: clc_id,
                params: {
                    UIFilters: {},
                    col: "",
                    filters: undefined,
                    page: 1,
                    query: "",
                    rows: 25,
                    shrinkToFit: true,
                    sort: ""
                }
            };
            $Api_Service.entity.list(data, function(result) {
                callback(result);
            });
        },
        uploadInvoicePrice: function(fd, callback){
            var uploadUrl = API.BASE_URL_DATA_MASTERS + '/api/masters/prices/import';
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function successCallback(response) {
                if (response) {
                    callback(response)
                } else {
                    callback(false);
                }
            }, function errorCallback(response) {
                console.log('HTTP ERROR');
                callback(false);
            });

        }
    };
}]);
