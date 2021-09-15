/**
 * Master Factory
 */
APP_MASTERS.factory('Factory_Master', [ '$window', '$http', '$Api_Service', 'API', 'screenLoader', function($window, $http, $Api_Service, API, screenLoader) {
    let general_api = '';
    return {
        getVesselVoyageBunkeringDetails: function(data, callback) {
            let payload = {
                Payload: data
            };
            let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/getVesselVoyageBunkeringDetails`;
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then((response) => {
                callback(response.data);
            }, (response) => {
                console.log(response);
            });
        },
        getCounterpartyTypes: function(data, callback) {
            let payload = {
                Payload: data
            };
            let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/getCounterpartyTypes`;
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then((response) => {
                callback(response.data);
            }, (response) => {
                console.log(response);
            });
        },
        mastersTree: function(callback) {
            $http({
                method: 'GET',
                url: 'layouts/mastersList.json'
            }).then((response) => {
                // this callback will be called asynchronously
                // when the response is available
                callback(response.data);
            }, (response) => {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
            return false;
        },
        getTranslations: function(callback) {
            $http({
                method: 'GET',
                url: 'translations/cma.json'
            }).then((response) => {
                // this callback will be called asynchronously
                // when the response is available
                callback(response.data);
            }, (response) => {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        },
        getScreenActions: function(data, callback) {
            $Api_Service.screen.get_actions(data, (result) => {
                callback(result);
            });
        },
        get_master_structure: function(app, master_id, generic_layout, dev, callback) {
            screenLoader.showLoader();
            // debugger;
            let data = {
                app: app,
                screen: master_id,
                generic: generic_layout
            };
            if (dev == 1) {
                $http({
                    method: 'GET',
                    url: `layouts/${ data.screen }.json`
                }).then((response) => {
                    // this callback will be called asynchronously
                    // when the response is available
                    callback(response.data.layout);
                }, (response) => {
                    console.log(response);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
                if (app == 'masters') {
                    data.screen = 'counterparty';
                    $Api_Service.screen.get(data, (result) => {
                        console.log(result.layout);
                    });
                }
            } else {
                $Api_Service.screen.get(data, (result) => {
                    callback(result.layout);
                });
            }
            return false;
        },
        getPriceTypes: function(app, master_id, callback) {
            let data = {
                app: app,
                screen: master_id,
                id: 1
            };
            // console.log(data);
            $Api_Service.entity.get(data, (result) => {
                callback(result);
            });
            return false;
        },
        getContractFormulas: function(data, callback) {
            $Api_Service.contract.getContractFormulas(data, (result) => {
                callback(result);
            });
            return false;
        },
        upload_file: function(fd, callback) {
            var uploadUrl = `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/createLogo`;
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then((response) => {
                if (response) {
                    callback('Success');
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
        },
        upload_document: function(data, callback) {
            let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/create`;
            $http.post(url, data, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then((response) => {
                if (response) {
                    callback('Success');
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
        },
        upload_document_import_data: function(data, callback) {
            let url = `${API.BASE_URL_DATA_ADMIN }/api/admin/import/upload`;
            $http.post(url, data, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then((response) => {
                if (response) {
                    callback(response.data);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
        },

        get_file: function(id, callback) {
            var getUrl = `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/download`;
            id = {
                Payload: id
            };
            $http.post(getUrl, id, {
                responseType: 'arraybuffer'
            }).then((response) => {
                if (response.data) {
                    var mime = response.headers('content-type');
                    callback(response.data, mime);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
        },
        get_document_file: function(payload, callback) {
            var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/download`;
            $http({
                method: 'POST',
                url: url,
                data: payload,
                responseType: 'arraybuffer',
                headers: {
                    'Origin': 'http://localhost:9000',
                    // 'Content-Type': undefined
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                if (response) {
                    let mime = response.headers('content-type');
                    callback(response, mime);
                }
            }, (response) => {
                if (response) {
                    callback(response, false);
                }
            });
        },
        generateTemplate: function(payload, callback) {
            var url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/generate`;
            $http({
                method: 'POST',
                url: url,
                data: payload,
                responseType: 'arraybuffer',
                headers: {
                    // 'Origin': 'http://localhost:9001',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                if (response) {
                    let mime = response.headers('content-type');
                    callback(response, mime);
                }
            }, (response) => {
                if (response) {
                    callback(response, false);
                }
            });
        },
        downloadFTP: function(payload, callback) {
            // url = API.BASE_URL_DATA_IMPORTEXPORT + '/api/importExport/download/downloadFile';
            url = `${API.BASE_URL }/Shiptech10.Api.ImportExport/api/importExport/download/downloadFile`;
            $http({
                method: 'POST',
                url: url,
                data: payload,
                responseType: 'arraybuffer',
                headers: {
                    // 'Origin': 'http://localhost:9001',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                if (response) {
                    let mime = response.headers('content-type');
                    callback(response, mime);
                }
            }, (response) => {
                if (response) {
                    callback(response, false);
                }
            });
        },
        sapExport: function(payload, newExport, callback) {
            if (newExport) {
                url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/SAPExport`;
            } else {
                url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/SAPExportGetFile`;
            }
            $http({
                method: 'POST',
                url: url,
                data: payload,
                responseType: 'arraybuffer',
                headers: {
                    // 'Origin': 'http://localhost:9001',
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                if (response) {
                    let mime = response.headers('content-type');
                    callback(response, mime);
                }
            }, (response) => {
                if (response) {
                    callback(response, false);
                }
            });
        },
        uploadSchedulerConfiguration: function(payload, callback) {
            url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/newschedulerconfiguration`;
            $http({
                method: 'POST',
                url: url,
                data: payload,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then((response) => {
                if (response) {
                    callback(response);
                }
            }, (response) => {
                if (response) {
                    callback(response, false);
                }
            });
        },
        uploadFTPFile: function(payload, callback) {
            url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/upload`;
            $http({
                method: 'POST',
                url: url,
                data: payload,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then((response) => {
                if (response) {
                    callback(response);
                }
            }, (response) => {
                if (response) {
                    callback(response, false);
                }
            });
        },
        get_master_elements: function(app, master_id, dev, callback) {
            let data = {
                app: app,
                screen: master_id
            };
            if (dev == 1) {
                $http({
                    method: 'GET',
                    url: `layouts/${ data.screen }.json`
                }).then((response) => {
                    // this callback will be called asynchronously
                    // when the response is available
                    callback(response.data.elements);
                }, (response) => {
                    console.log(response);
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            } else {
                $Api_Service.entity.structure(data, (result) => {
                    callback(result);
                });
            }
        },
        get_master_entity: function(entity_id, master_id, app, callback, screenChild) {
            let data = {
                app: app,
                screen: master_id,
                id: entity_id,
                child: screenChild,
            };
            // if(app == "default" && child == "entity_documents") return;
            $Api_Service.entity.get(data, (result) => {
                callback(result);
            });
            return false;
        },
        finalInvoiceDuedates: function(payload, callback) {
            url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/finalInvoiceDueDates`;
            $http({
                method: 'POST',
                url: url,
                data: payload,
                // responseType: "json",
            }).then((response) => {
                if (response) {
                    callback(response.data.payload);
                }
            }, (response) => {
                if (response) {
                    callback(response, false);
                }
            });
        },
        createDebunker: function(id, callback) {
            $Api_Service.claim.debunker(id, (result) => {
                callback(result);
            });
            return false;
        },
        save_terms_and_conditions: function(id, text, callback) {
            let data = {
                Filters: [ {
                    ColumnName: 'ContractId',
                    Value: id
                }, {
                    ColumnName: 'Terms',
                    Value: text
                } ]
            };
            $Api_Service.contract.save_terms_and_conditions(data, (result) => {
                callback(result);
            });
            return false;
        },
        get_master_list: function(app, screen, field, callback) {
            let data = {
                app: app,
                screen: screen,
                field: field
            };
            if (field.Type == 'dropdown' || field.Type == 'textUOM') {
                $Api_Service.dropdown.get(data, (result) => {
                    callback(result);
                });
            } else {
                $Api_Service.dropdown.lookup(data, (result) => {
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
            $Api_Service.datatable.get(data, (result) => {
                callback(result);
            });
            return false;
        },
        exchangeRate: function(param, callback) {
            $Api_Service.dropdown.custom(param, (result) => {
                callback(result);
            });
            return false;
        },
        get_custom_dropdown: function(param, callback) {
            $Api_Service.dropdown.custom(param, (result) => {
                callback(result);
            });
            return false;
        },
        getChangedValues: function(master, order_id, delivery_number, lab_result_id, name, callback) {
            let data = {
                dropdown: master,
                order_id: order_id,
                delivery_number: delivery_number,
                lab_result_id: lab_result_id,
                dropdown_id: name
            };
            $Api_Service.dropdown.get(data, (result) => {
                callback(result);
            });
            return false;
        },
        save_master_structure: function(app, screen, layout, callback) {
            let data = {
                app: app,
                screen: screen,
                layout: layout
            };
            $Api_Service.screen.update(data, (result) => {
                callback(result);
            });
        },
        save_master_changes: function(app, screen, fields, callback) {
            let data = {
                app: app,
                screen: screen,
                data: fields,
            };
            $Api_Service.entity.update(data, (result) => {
                callback(result);
            });
        },
        labsActions: function(app, screen, id, action, status, callback) {
            let data = {
                app: app,
                screen: screen,
                id: id,
                status: status,
            };
            if (action == 1) {
                $Api_Service.entity.verify(data, (result) => {
                    callback(result);
                });
            } else if (action == 2) {
                $Api_Service.entity.revert(data, (result) => {
                    callback(result);
                });
            }
        },
        verify_lab: function(data, callback) {
            $Api_Service.labs.verify_lab(data, (result) => {
                callback(result);
            });
        },
        create_master_entity: function(app, screen, fields, callback) {
            let data = {
                app: app,
                screen: screen,
                data: fields,
            };
            $Api_Service.entity.create(data, (result) => {
                callback(result);
            });
        },
        cancel_claim: function(app, screen, fields, callback) {
            let data = {
                app: app,
                screen: screen,
                data: fields,
            };
            $Api_Service.entity.cancel(data, (result) => {
                callback(result);
            });
        },
        complete_claim: function(app, screen, fields, callback) {
            let data = {
                app: app,
                screen: screen,
                data: fields,
            };
            $Api_Service.entity.complete(data, (result) => {
                callback(result);
            });
        },
        verify_delivery: function(app, screen, id, deliveryDto, callback) {
            let data = {
                app: app,
                screen: screen,
                id: id,
                payload: deliveryDto,
                bulk: false,
                verifyAndSave: true
            };
            $Api_Service.entity.verify(data, (result) => {
                callback(result);
            });
        },
        bulk_verify_delivery: function(app, screen, ids, callback) {
            let data = {
                app: app,
                screen: screen,
                payload: ids,
                id: 42,
                bulk: true
            };
            $Api_Service.entity.verify(data, (result) => {
                callback(result);
            });
        },
        get_seller_rating: function(app, screen, id, callback) {
            let data = {
                app: app,
                screen: screen,
                id: id,
            };
            $Api_Service.rating.get(data, (result) => {
                callback(result);
            });
        },
        create_seller_rating: function(app, screen, data, callback) {
            var data = {
                app: app,
                screen: screen,
                data: data,
            };
            $Api_Service.rating.create(data, (result) => {
                callback(result);
            });
        },
        create_invoice_from_delivery: function(data, callback) {
            $Api_Service.invoice.createfromdelivery(data, (result) => {
                callback(result);
            });
        },
        dueDateWithoutSave: function(payload, callback) {
            $Api_Service.invoice.dueDateWithoutSave(payload, (res) => {
                callback(res);
            });
        },
        cancel_invoice: function(fields, callback) {
            $Api_Service.invoice.cancelInvoice(fields, (res) => {
                console.log(fields);
                callback(res);
            });
        },
        submit_invoice_review: function(fields, callback) {
            $Api_Service.invoice.submitInvoiceReview(fields, (res) => {
                callback(res);
            });
        },
        accept_invoice: function(fields, callback) {
            $Api_Service.invoice.acceptInvoice(fields, (res) => {
                callback(res);
            });
        },
        submit_invoice_approve: function(fields, callback) {
            $Api_Service.invoice.submitInvoiceApprove(fields, (res) => {
                callback(res);
            });
        },
        approve_invoice: function(fields, callback) {
            $Api_Service.invoice.approveInvoice(fields, (res) => {
                callback(res);
            });
        },
        revert_invoice: function(fields, callback) {
            $Api_Service.invoice.revertInvoice(fields, (res) => {
                callback(res);
            });
        },
        reject_invoice: function(fields, callback) {
            $Api_Service.invoice.rejectInvoice(fields, (res) => {
                callback(res);
            });
        },
        get_apply_for_list: function(order_id, callback) {
            $Api_Service.invoice.getApplyForList(order_id, (res) => {
                callback(res);
            });
        },
        change_password: function(data, callback) {
            $Api_Service.admin.changePassword(data, (result) => {
                callback(result);
            });
        },
        create_credit_note: function(data, callback) {
            $Api_Service.invoice.createCreditNote(data, (result) => {
                callback(result);
            });
        },
        claims_create_credit_note: function(data, callback) {
            $Api_Service.claim.createCreditNote(data, (result) => {
                callback(result);
            });
        },
        claims_create_preclaim_cn: function(data, callback) {
            $Api_Service.claim.createPreclaimCN(data, (result) => {
                callback(result);
            });
        },
        get_conversion_info: function(data, callback) {
            $Api_Service.delivery.getConversionInfo(data, (result) => {
                // console.log(result);
                callback(result);
            });
        },
        raise_claim: function(data, callback) {
            $Api_Service.delivery.raiseClaim(data, (result) => {
                // console.log(result);
                callback(result);
            });
        },
        send_labs_template_email: function(data, callback) {
            $Api_Service.delivery.sendLabsTemplateEmail(data, (result) => {
                // console.log(result);
                callback(result);
            });
        },
        revert_verify: function(data, callback) {
            $Api_Service.delivery.revertVerify(data, (result) => {
                // console.log(result);
                callback(result);
            });
        },
        confirm_contract: function(data, callback) {
            $Api_Service.contract.confirm(data, (result) => {
                console.log(result);
                callback(result);
            });
        },
        delete_contract: function(data, callback) {
            $Api_Service.contract.delete(data, (result) => {
                console.log(result);
                callback(result);
            });
        },
        cancel_contract: function(data, callback) {
            $Api_Service.contract.cancel(data, (result) => {
                callback(result);
            });
        },
        extend_contract: function(data, callback) {
            $Api_Service.contract.extend(data, (result) => {
                console.log(result);
                callback(result);
            });
        },
        undo_confirm_contract: function(data, callback) {
            $Api_Service.contract.undo(data, (result) => {
                console.log(result);
                callback(result);
            });
        },
        get_working_due_date: function(data, callback) {
            $Api_Service.invoice.getWorkingDueDate(data, (result) => {
                callback(result);
            });
        },
        list_by_transaction_type: function(data, callback) {
            $Api_Service.mail.list_by_transaction_type(data, (result) => {
                callback(result);
            });
        },
        contract_preview: function(data, callback) {
            $Api_Service.contract.previewContract(data, (result) => {
                callback(result);
            });
        },
        send_contract_preview: function(data, callback) {
            $Api_Service.mail.sendPreviewContract(data, (result) => {
                callback(result);
            });
        },
        send_email_preview: function(data, callback) {
            $Api_Service.mail.sendEmailPreview(data, (result) => {
                callback(result);
            });
        },
        discardSavedPreview: function(data, callback) {
            $Api_Service.mail.discardSavedPreview(data, (result) => {
                callback(result);
            });
        },
        contract_preview_email: function(data, callback) {
            $Api_Service.contract.contractPreviewEmail(data, (result) => {
                callback(result);
            });
        },
        labs_preview_email: function(data, callback) {
            $Api_Service.labs.labsPreviewEmail(data, (result) => {
                callback(result);
            });
        },
        invalid_lab: function(data, callback) {
            $Api_Service.labs.invalid_lab(data, (result) => {
                callback(result);
            });
        },
        save_email_contract: function(data, callback) {
            $Api_Service.mail.saveEmailPreview(data, (result) => {
                callback(result);
            });
        },
        bring_rob_status: function(data, callback) {
            $Api_Service.masters.bring_rob_status(data, (result) => {
                callback(result);
            });
        },
        getVesselBOPSDetails: function(data, callback) {
            $Api_Service.masters.getVesselBOPSDetails(data, (result) => {
                callback(result);
            });
        },
        getService: function(data, callback) {
            $Api_Service.masters.getService(data, (result) => {
                callback(result);
            });
        },
        claim_preview_email: function(data, callback) {
            $Api_Service.claim.claimPreviewEmail(data, (result) => {
                callback(result);
            });
        },
        getTransactionsForApp: function(data, callback) {
            $Api_Service.alerts.getTransactionsForApp(data, (result) => {
                callback(result);
            });
        },
        getAlertsParametersForTransaction: function(data, callback) {
            $Api_Service.alerts.getAlertsParametersForTransaction(data, (result) => {
                callback(result);
            });
        },
        alertsGetRuleCondition: function(data, callback) {
            $Api_Service.alerts.alertsGetRuleCondition(data, (result) => {
                callback(result);
            });
        },
        alertsGetRuleOperator: function(data, callback) {
            $Api_Service.alerts.alertsGetRuleOperator(data, (result) => {
                callback(result);
            });
        },
        alertsGetTriggerRuleValuesByParamId: function(data, callback) {
            $Api_Service.alerts.alertsGetTriggerRuleValuesByParamId(data, (result) => {
                callback(result);
            });
        },
        alertsGetRoles: function(data, callback) {
            $Api_Service.alerts.alertsGetRoles(data, (result) => {
                callback(result);
            });
        },
        alertsGetUserFromRoles: function(data, callback) {
            $Api_Service.alerts.alertsGetUserFromRoles(data, (result) => {
                callback(result);
            });
        },
        getAlertTypes: function(data, callback) {
            $Api_Service.alerts.getAlertTypes(data, (result) => {
                callback(result);
            });
        },
        alertsGetActivationDetailsRecurrences: function(data, callback) {
            $Api_Service.alerts.alertsGetActivationDetailsReccurences(data, (result) => {
                callback(result);
            });
        },
        alertsGetActivationDetailsUntils: function(data, callback) {
            $Api_Service.alerts.alertsGetActivationDetailsUntils(data, (result) => {
                callback(result);
            });
        },
        getSpecParamsDeliveryProduct: function(data, callback) {
            $Api_Service.delivery.getSpecParamsDeliveryProduct(data, (result) => {
                callback(result);
            });
        },
        getQtyParamsDeliveryProsuct: function(data, callback) {
            $Api_Service.delivery.getQtyParamsDeliveryProsuct(data, (result) => {
                callback(result);
            });
        },
        getSplitDeliveryLimits: function(data, callback) {
            $Api_Service.delivery.getSplitDeliveryLimits(data, (result) => {
                callback(result);
            });
        },
        convertCurrency: function(data, callback) {
            $Api_Service.masters.convertCurrency(data, (result) => {
                callback(result);
            });
        },
        getByStrategyAndProduct: function(data, callback) {
            $Api_Service.contract.getByStrategyAndProduct(data, (result) => {
                callback(result);
            });
        },
        getNotificationsList: function(data, callback) {
            $Api_Service.alerts.getNotificationsList(data, (result) => {
                callback(result);
            });
        },
        initSignalRParameters: function(callback) {
            $Api_Service.alerts.initSignalRParameters((result) => {
                callback(result);
            });
        },
        raiseNoteOfProtestProduct: function(data, callback) {
            $Api_Service.delivery.raiseNoteOfProtestProduct(data, (result) => {
                callback(result);
            });
        },
        notificationsActions: function(data, callback) {
            $Api_Service.alerts.notificationsActions(data, (result) => {
                callback(result);
            });
        },
        contractProductDeliveryActions: function(data, type, callback) {
            $Api_Service.contract.contractProductDeliveryActions(data, type, (result) => {
                callback(result);
            });
        },
        saveContractDeliveryModal: function(data, type, callback) {
            $Api_Service.contract.saveContractDeliveryModal(data, type, (result) => {
                callback(result);
            });
        },
        get_group_requests_ids: function(data, callback) {
            $Api_Service.request.get_group_requests_ids(data, (result) => {
                callback(result);
            });
        },
        saveTreasuryTableData: function(data, callback) {
            $Api_Service.invoice.saveTreasuryTableData(data, (result) => {
                callback(result);
            });
        },
        getUomConversionFactor: function(data, callback) {
            $Api_Service.masters.getUomConversionFactor(data, (result) => {
                callback(result);
            });
        },
        getAdditionalCosts: function(data, callback) {
            $Api_Service.masters.getAdditionalCosts(data, (result) => {
                callback(result);
            });
        },
        getAdditionalCostsForLocation: function(data, callback) {
            $Api_Service.masters.getAdditionalCostsForLocation(data, (result) => {
                callback(result);
            });
        },
        getSpecForProcurement: function(data, application, callback) {
            $Api_Service.procurement.getSpecForProcurement(data, application, (result) => {
                callback(result);
            });
        },
        saveSpecForProcurement: function(data, application, callback) {
            $Api_Service.procurement.saveSpecForProcurement(data, application, (result) => {
                callback(result);
            });
        },
        getContractFormulaList: function(data, callback) {
            $Api_Service.contract.getContractFormulaList(data, (result) => {
                callback(result);
            });
        },
        getRelatedDeliveries: function(data, callback) {
            $Api_Service.delivery.getRelatedDeliveries(data, (result) => {
                callback(result);
            });
        },
        getDeliveryConfigurations: function(data, callback) {
            $Api_Service.delivery.getDeliveryConfigurations(data, (result) => {
                callback(result);
            });
        },
        deleteDelivery: function(data, callback) {
            $Api_Service.delivery.deleteDelivery(data, (result) => {
                callback(result);
            });
        },
        deleteDeliveryProduct: function(data, callback) {
            $Api_Service.delivery.deleteDeliveryProduct(data, (result) => {
                callback(result);
            });
        },
        splitDelivery: function(data, callback) {
            $Api_Service.delivery.splitDelivery(data, (result) => {
                callback(result);
            });
        },
        specGroupGetByProduct: function(data, callback) {
            $Api_Service.masters.specGroupGetByProduct(data, (result) => {
                callback(result);
            });
        },
        getSellerBlade: function(data, callback) {
            $Api_Service.procurement.getSellerBlade(data, (result) => {
                callback(result);
            });
        },
        getEnergyBlade: function(data, callback) {
            $Api_Service.procurement.getEnergyBlade(data, (result) => {
                callback(result);
            });
        },
        getLabInfoForOrder: function(data, callback) {
            $Api_Service.labs.getLabInfoForOrder(data, (result) => {
                callback(result);
            });
        },
        deleteLab: function(data, callback) {
            $Api_Service.labs.deleteLab(data, (result) => {
                callback(result);
            });
        },
        updatePaymentProofDetails: function(data, callback) {
            $Api_Service.invoice.updatePaymentProofDetails(data, (result) => {
                callback(result);
            });
        },
        getReportsGroups: function(callback) {
            $Api_Service.reports.getReportsGroups((result) => {
                callback(result);
            });
        },
        getReportsInGroup: function(data, callback) {
            $Api_Service.reports.getReportsInGroup(data, (result) => {
                callback(result);
            });
        },
        deleteContact: function(data, callback) {
            $Api_Service.entity.delete(data, (result) => {
                callback(result);
            });
        },
        getProductsForSellerInLocation: function(data, callback) {
            $Api_Service.masters.getProductsForSellerInLocation(data, (result) => {
                callback(result);
            });
        },
        getPreferredProductsForSellerInLocation: function(data, callback) {
            $Api_Service.masters.getPreferredProductsForSellerInLocation(data, (result) => {
                callback(result);
            });
        },
        invoiceTotalConversion: function(data, callback) {
            $Api_Service.invoice.invoiceTotalConversion(data, (result) => {
                callback(result);
            });
        },
        getReport: function(data, callback) {
            $Api_Service.reports.getReport(data, (result) => {
                callback(result);
            });
        },
        selectAllTreasuryReport: function(data, callback) {
            $Api_Service.invoice.selectAllTreasuryReport(data, (result) => {
                callback(result);
            });
        },
        contractPlanningGetQuantityAverage: function(data, callback) {
            $Api_Service.request.contractPlanningGetQuantityAverage(data, (result) => {
                callback(result);
            });
        },
        getRangeTotalAdditionalCosts: function(data, callback) {
            $Api_Service.procurement.getRangeTotalAdditionalCosts(data, (result) => {
                callback(result);
            });
        },
        getBOPSDensityByProductId: function(productId, callback) {
            let payload = {
                Payload: productId
            };
            $Api_Service.masters.getBOPSDensityByProductId(payload, (result) => {
                callback(result);
            });
        },
        get_master_list_filtered: function(app, screen, clc_id, callback) {
            let data = {
                app: app,
                screen: screen,
                clc_id: clc_id,
                params: {
                    UIFilters: {},
                    col: '',
                    filters: undefined,
                    page: 1,
                    query: '',
                    rows: 25,
                    shrinkToFit: true,
                    sort: ''
                }
            };
            $Api_Service.entity.list(data, (result) => {
                callback(result);
            });
        },
        uploadInvoicePrice: function(fd, callback) {
            let uploadUrl = `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/import`;
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then((response) => {
                if (response) {
                    callback(response);
                } else {
                    callback(false);
                }
            }, (response) => {
                console.log('HTTP ERROR');
                callback(false);
            });
        },
        getSellerRatingConfig: function(data, callback) {
            let payload = {
                Payload: data
            };
            let url =`${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerrating/getConfig`;
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then((response) => {
                callback(response.data.payload);
            }, (response) => {
                console.log(response);
                callback(false);
            });
        },
        getCounterpartyLocations: function(data, callback) {
            let payload = {
                Payload: data
            };
            let url =`${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerrating/getCounterpartyLocations`;
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then((response) => {
                callback(response.data.payload);
            }, (response) => {
                console.log(response);
                callback(false);
            });
        },
        updateSellerRatingReview: function(data, callback) {
            let payload = {
                Payload: data
            };
            let url = `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerratingreview/update`;
            $http.post(url, payload).then(
                (response) => {
                    let res = {};
                    if (response.status == 200) {
                        res.status = true;
                        res.message = 'Rating saved!';
                        callback(res);
                    } else {
                        res.status = false;
                        res.message = 'Could not save rating!';
                    }
                },
                (response) => {
                    let res = {};
                    res.status = false;
                    res.message = 'Could not save rating!';
                    console.log('HTTP ERROR while trying to save rating!');
                }
            );
        },
        getSellerRatingReview: function(data, callback) {
            let payload = {
                Payload: data
            };
            let url = `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerratingreview/getForCounterPartyMaster`;
            $http.post(url, payload).then(
                (response) => {
                    let res = {};
                    if (response.status == 200) {
                        callback(response.data.payload);
                    } else {
                        res.status = false;
                        res.message = 'An error has ocurred!';
                    }
                },
                (response) => {
                    let res = {};
                    res.status = false;
                    res.message = 'An error has ocurred!';
                }
            );
        },
        getSellerRatingForNegociation: function(data, callback) {
            let payload = {
                Payload: data
            };
            let url = `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerratingreview/getForNegotiation`;
            $http.post(url, payload).then(
                (response) => {
                    let res = {};
                    if (response.status == 200) {
                        callback(response.data.payload);
                    } else {
                        res.status = false;
                        res.message = 'An error has ocurred!';
                    }
                },
                (response) => {
                    let res = {};
                    res.status = false;
                    res.message = 'An error has ocurred!';
                }
            );
        },
        getLocationSellerContacts: function(contactsdata, callback) {
            let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/getsellercontacts`;
            $http({
                method: 'POST',
                url: url,
                data: contactsdata
            }).then((response) => {                
                callback(response.data.payload);
            }, (response) => {
                // console.log(response);
            });
        },

        get_counterpartySubDepartments : (counterpartyId, callback) => {
            let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/subDepartmentList`;
            let payload = {
                Payload: counterpartyId
            };            
            $http({
                method: 'POST',
                url: url,
                data: payload
            }).then((response) => {                
                callback(response.data.payload);
            }, (response) => {
                // console.log(response);
            });
        }


    };
} ]);
