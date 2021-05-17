angular.module('shiptech.models')
    .factory('orderResource', [ '$resource', 'resourceInterceptor', 'API', function($resource, resourceInterceptor, API) {
        // return $resource('js/mockups/new-request-api.js', null,
        return $resource(`${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/:verb`, null,
            {
                getTemplates: { method:'POST', params:{ verb:'previewEmailTemplates' } },
                get: { method:'POST', params:{ verb:'get' } },
                new: { method:'POST', params:{ verb:'empty' } },
                list: { method:'POST', params:{ verb:'list' } },
                export: { method:'POST', params:{ verb:'export' }, responseType: 'arraybuffer',
                    transformResponse: function(data, headers) {
                        return {
                            data: data,
                            filename: parseFilenameFromHeaders(headers)
                        };
                    } },
                create: { method:'POST', params:{ verb:'create' }, interceptor: resourceInterceptor },
                close: { method:'POST', params:{ verb:'close' }, interceptor: resourceInterceptor },
                getOrderDiffAfterMail: { method:'POST', params:{ verb:'getOrderDiffAfterMail' }, interceptor: resourceInterceptor },
                update: { method:'POST', params:{ verb:'update' }, interceptor: resourceInterceptor },
                verifyOrders: { method:'POST', params:{ verb:'verifyOrders' }, interceptor: resourceInterceptor },
                createWithContract: { method:'POST', params:{ verb:'createWithContract' } },
                createOrders: { method:'POST', params:{ verb:'createOrders' } },
                preview: { method:'POST', params:{ verb:'preview' } },
                previewConfirmation: { method:'POST', params:{ verb:'previewConfirmation' } },
                previewOrderToBeDeliveredMail: { method:'POST', params:{ verb:'previewOrderToBeDeliveredMail' } },
                sendOrderToBeDeliveredMail: { method:'POST', params:{ verb:'sendOrderToBeDeliveredMail' } },
                confirm: { method:'POST', params:{ verb:'confirm' }, interceptor: resourceInterceptor },
                confirmOnly: { method:'POST', params:{ verb:'confirmOnly' }, interceptor: resourceInterceptor },
                reConfirm: { method:'POST', params:{ verb:'reConfirm' }, interceptor: resourceInterceptor },
                confirmToSeller: { method:'POST', params:{ verb:'confirmToSeller' }, interceptor: resourceInterceptor },
                confirmToSurveyor: { method:'POST', params:{ verb:'confirmToSurveyor' }, interceptor: resourceInterceptor },
                confirmToAll: { method:'POST', params:{ verb:'confirmToAll' }, interceptor: resourceInterceptor },
                confirmToLab: { method:'POST', params:{ verb:'confirmToLab' }, interceptor: resourceInterceptor },
                confirmPretest: { method:'POST', params:{ verb:'confirmPretest' }, interceptor: resourceInterceptor },
                updateCancelOrderReason: { method:'POST', params:{ verb:'updateCancelOrderReason' }, interceptor: resourceInterceptor },
                getManualCancellationEmail: { method:'POST', params:{ verb:'getManualCancellationEmail' }, interceptor: resourceInterceptor },
                getContractProductAdditionalCosts: { method:'POST', params:{ verb:'getContractProductAdditionalCosts' }, interceptor: resourceInterceptor },
                cancel: { method:'POST', params:{ verb:'cancel' }, interceptor: resourceInterceptor },
                reject: { method:'POST', params:{ verb:'reject' }, interceptor: resourceInterceptor },
                approve: { method:'POST', params:{ verb:'approve' }, interceptor: resourceInterceptor },
                amend: { method:'POST', params:{ verb:'amend' }, interceptor: resourceInterceptor },
                submitForApproval: { method:'POST', params:{ verb:'submitforapproval' }, interceptor: resourceInterceptor },
                getOrderListForRequest: { method:'POST', params:{ verb:'getOrderListForRequest' } },
                checkIfOrderCanBeCreatedUsingSelectedContract : { method: 'POST', params: { verb: 'checkIfOrderCanBeCreatedUsingSelectedContract' } },
                getFormulaDetails : { method: 'POST', params: { verb: 'getFormulaDetails' } },
                mailPreviewConfirmToSeller : { method: 'POST', params: { verb: 'mailPreviewConfirmToSeller' } },
                cancelOrderProduct : { method: 'POST', params: { verb: 'cancelOrderProduct' } },
                getCustomerConfiguration : { method: 'POST', params: { verb: 'getOrderCustomerConfiguration' } },
                getExistingOrders : { method: 'POST', params: { verb: 'getExistingOrders' },
                },
            });
    } ]);


