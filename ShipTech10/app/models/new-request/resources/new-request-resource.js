angular.module('shiptech.models').factory('newRequestResource', [ '$resource', 'resourceInterceptor', 'API', function($resource, resourceInterceptor, API) {
    // return $resource('js/mockups/new-request-api.js', null,
    return $resource(`${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/:verb`, null, {
        get: {
            method: 'POST',
            params: {
                verb: 'get'
            }
        },
        new: {
            method: 'POST',
            params: {
                verb: 'new'
            }
        },
        getEmpty: {
            method: 'POST',
            params: {
                verb: 'empty'
            }
        },
        cancel: {
            method: 'POST',
            params: {
                verb: 'cancel'
            }
        },
        complete: {
            method: 'POST',
            params: {
                verb: 'complete'
            }
        },
        create: {
            method: 'POST',
            params: {
                verb: 'create'
            },
            interceptor: resourceInterceptor
        },
        update: {
            method: 'POST',
            params: {
                verb: 'update'
            },
            interceptor: resourceInterceptor
        },
        search: {
            method: 'POST',
            params: {
                verb: 'search'
            }
        },
        getRequestEmailTemplate: {
            method: 'POST',
            params: {
                verb: 'model'
            }
        },
        validate: {
            method: 'POST',
            params: {
                verb: 'validate'
            },
            interceptor: resourceInterceptor
        },
        sendPrerequest: {
            method: 'POST',
            params: {
                verb: 'sendPrerequest'
            },
            interceptor: resourceInterceptor
        },
        cancelProduct: {
            method: 'POST',
            params: {
                verb: 'cancelProduct'
            }
        },
        contractPlanningAutoSave: {
            method: 'POST',
            params: {
                verb: 'contractPlanningAutoSave'
            }
        },

        cancelLocation: {
            method: 'POST',
            params: {
                verb: 'cancelLocation'
            }
        },
        getBestContract: {
            method: 'POST',
            params: {
                verb: 'bestContract'
            }
        },
        getAllContract: {
            method: 'POST',
            params: {
                verb: 'allContract'
            }
        },
        getRequestContract: {
            method: 'POST',
            params: {
                verb: 'evaluateForRequest'
            }
        },
        getContractPlanning: {
            method: 'POST',
            params: {
                verb: 'planning'
            }
        },
        getContractPlanningExport: {
            method: 'POST',
            params: {
                verb: 'exportPlanning'
            },
            responseType: 'arraybuffer',
            transformResponse: function(data, headers) {
                return {
                    data: data,
                    filename: parseFilenameFromHeaders(headers),
                    headers: headers
                };
            }
        },
        getSuggestedContracts: {
            method: 'POST',
            params: {
                verb: 'searchForPopup'
            }
        },
        contractPlanning: {
            method: 'POST',
            params: {
                verb: 'contractPlanning'
            },
            interceptor: resourceInterceptor
        },
        contractPlanningSaveAndSend: {
            method: 'POST',
            params: {
                verb: 'contractPlanningSaveAndSend'
            },
            interceptor: resourceInterceptor
        },
        sendContractPlanningEmail: {
            method: 'POST',
            params: {
                verb: 'contractPlanningEmail'
            },
            interceptor: resourceInterceptor
        },
        previewContractPlanning: {
            method: 'POST',
            params: {
                verb: 'previewContractPlanning'
            }
        },
        getLatestOffer: {
            method: 'POST',
            params: {
                verb: 'latestOffer'
            }
        },
        omitOffer: {
            method: 'POST',
            params: {
                verb: 'omitOffer'
            }
        },
        canBeCancelled: {
            method: 'POST',
            params: {
                verb: 'canBeCancelled'
            }
        },
        getDefaultBuyer: {
            method: 'POST',
            params: {
                verb: 'getDefaultBuyer'
            }
        },
        getRequestStatusesOrdered: {
            method: 'POST',
            params: {
                verb: 'requeststatuseslist'
            }
        },
        getBunkerPlansForVesselVoyageDetailId: {
            method: 'POST',
            params: {
                verb: 'getBunkerPlansForVesselVoyageDetailId'
            }
        },
        questionnaireStatus: {
            method: 'POST',
            params: {
                verb: 'questionnaireStatus'
            }
        },
        sendQuestionnaire: {
            method: 'POST',
            params: {
                verb: 'sendQuestionnaire'
            }
        }
    });
} ]).factory('newRequestResourceMasters', [ '$resource', 'resourceInterceptor', 'API', function($resource, resourceInterceptor, API) {
    // return $resource('js/mockups/new-request-api.js', null,
    return $resource(`${API.BASE_URL_DATA_MASTERS }/api/masters/locations/:verb`, null, {
        getDestinations: {
            method: 'POST',
            params: {
                verb: 'listVesselSearch'
            }
        }
    });
} ]);
