/*
 * API Service
 */
APP_API.factory('$Api_Service', [
    '$listsCache',
    '$tenantSettings',
    '$tenantConfiguration',
    'tenantModel',
    'API',
    '$q',
    '$http',
    '$state',
    '$translate',
    '$cacheFactory',
    'dataProcessors',
    '$rootScope',
    'screenLoader',
    function($listsCache, $tenantSettings, $tenantConfiguration, tenantModel, API, $q, $http, $state, $translate, $cacheFactory, dataProcessors, $rootScope, screenLoader) {
        let _debug = true;
        let api_map = {
            general: {
                nomenclatoare: {
                    json: {
                        Payload: true
                    },
                    endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/static/lists`
                },
                audit: {
                    endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/audit/get`
                },
                generalSettings: {
                    endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/generalConfiguration/get`
                }
            },
            procurement: {
                requestslist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 3
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path: [ 'clc', 'request_list' ]
                        }
                    },
                    entity: {
                        export: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/export`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/tableView`
                        }
                    }
                },
                rfqrequestslist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 3
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path: [ 'clc', 'rfq_request_list' ]
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/rfq/selectRequest`
                        }
                    }
                },
                orderlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 6
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        export: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/export`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/list`
                        }
                    }
                },
                scheduleDashboardTable: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 1
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path: [ 'tables', 'scheduleDashboardTableClc' ]
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/scheduledashboard/getTable`
                        }
                    }
                },
                contractplanning: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 8
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/getContractPlanningGrids`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/exportPlanning`
                        }
                    }
                },
                contractplanning_contractlist: {
                    layout: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/searchForPopup`
                        }
                    }
                },
                bunkerableport: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 102
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path: [ 'clc', 'procurement_bunkerableport' ]
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/listVessel`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/export`
                        }
                    }
                },
                destinationport: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 102
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path: [ 'clc', 'procurement_bunkerableport' ]
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/listVessel`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/export`
                        }
                    }
                },
                buyerlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 112
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/list`
                        }
                    }
                },
                terminallist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 102
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/getTerminals`
                        }
                    }
                },
                agentlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`
                        }
                    }
                },
                brokerlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`
                        }
                    }
                },
                requestcounterpartytypes: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path: [ 'clc', 'requestcounterpartytypes' ]
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listbyTypes`
                        }
                    }
                },
                contractlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 400
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/list`
                        }
                    }
                },
                request_bestcontracts: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 4
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path: [ 'clc', 'best_contract' ]
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/bestContract`
                        }
                    }
                },
                request_bestcontracts_all: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 4
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path: [ 'clc', 'best_contract' ]
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/allContract`
                        }
                    }
                },
                request_entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 4
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                },
                order_entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 7
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                },
                group_of_requests_entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 5
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                },
                productcontractlist: {
                    entity:{
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getContractProductForOrderProduct`
                        }
                    },
                    layout: {
                        get: {}
                    }
                }

            },
            masters: {
                entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 145
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                },
                counterpartylist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/export`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/update`
                        }
                    }
                },
                counterpartylist_broker: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listMasters`
                        }
                    }
                },
                counterpartylist_agent: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listMasters`
                        }
                    }
                },
                counterpartylist_labs: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listMasters`
                        }
                    }
                },
                counterpartylist_surveyors: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listMasters`
                        }
                    }
                },
                counterpcounterpartylist_physicalsuppliers: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listMasters`
                        }
                    }
                },
                counterparty: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 101
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/export`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/update`
                        },
                        getParentForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/getParentForSearch`
                        }
                    }
                },
                contactlist: {
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/contactList`
                        }
                    }
                },
                locationlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 102
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/listMasters`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/export`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/update`
                        }
                    }
                },
                location: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 103
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        getForTransactionForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/getForTransactionForSearch`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/update`
                        },
                        getParentForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/getParentSearch`
                        }
                    }
                },
                productlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 104
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/update`
                        }
                    }
                },
                product: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 105
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/update`
                        },
                        getParentForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/products/getParentForSearch`
                        }
                    }
                },
                companylist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 106
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/update`
                        }
                    }
                },
                company: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 107
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/update`
                        },
                        getParentForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/getParentForSearch`
                        }
                    }
                },
                strategylist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 108
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/update`
                        }
                    }
                },
                strategy: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 109
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        getForTransactionForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/getForTransactionForSearch`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/update`
                        },
                        getParentForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/strategies/getParentForSearch`
                        }
                    }
                },
                servicelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 110
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/update`
                        }
                    }
                },
                service: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 111
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/update`
                        },
                        getParentForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/getParentForSearch`
                        }
                    }
                },
                buyerlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 112
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/update`
                        }
                    }
                },
                buyer: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 113
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/update`
                        },
                        getParentForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/getParentForSearch`
                        }
                    }
                },
                vessellist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 114
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/update`
                        }
                    }
                },
                vessel: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 115
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/update`
                        }
                    }
                },
                vesseltypelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 116
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/update`
                        }
                    }
                },
                vesseltype: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 117
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vesseltypes/update`
                        }
                    }
                },
                marketinstrumentlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 118
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/update`
                        }
                    }
                },
                marketinstrument: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 119
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/update`
                        }
                    }
                },
                systeminstrumentlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 120
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/update`
                        }
                    }
                },
                systeminstrument: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 121
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/systeminstruments/update`
                        }
                    }
                },
                pricelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 122
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/update`
                        }
                    }
                },
                price: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 123
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/update`
                        }
                    }
                },
                priceTypes: {
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/prices/emptyMarketPrice`
                        }
                    }
                },
                pricetypelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 124
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/update`
                        }
                    }
                },
                pricetype: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 125
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/marketpricetype/update`
                        }
                    }
                },
                specgrouplist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 126
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/update`
                        }
                    }
                },
                specgroup: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 127
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specgroups/update`
                        }
                    }
                },
                specparameterlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 128
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/update`
                        }
                    }
                },
                specparameter: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 129
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        getForTransactionForSearch: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/getForTransactionForSearch`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/specparameters/update`
                        }
                    }
                },
                paymenttermlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 130
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/update`
                        }
                    }
                },
                paymentterm: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 131
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/paymentterm/update`
                        }
                    }
                },
                deliveryoptionlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 132
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/update`
                        }
                    }
                },
                deliveryoption: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 133
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/deliveryoptions/update`
                        }
                    }
                },
                incotermlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 134
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/update`
                        }
                    }
                },
                incoterms: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 135
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/incoterms/update`
                        }
                    }
                },
                uomlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 136
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/update`
                        }
                    }
                },
                uom: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 137
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/update`
                        }
                    }
                },
                periodlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 138
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/update`
                        }
                    }
                },
                period: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 139
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/update`
                        }
                    }
                },
                eventlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 140
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/update`
                        }
                    }
                },
                event: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 141
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/events/update`
                        }
                    }
                },
                calendarlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 142
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/update`
                        }
                    }
                },
                calendar: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 143
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/calendars/update`
                        }
                    }
                },
                documenttypelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 144
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/update`
                        }
                    }
                },
                documenttype: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 145
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/documenttype/update`
                        }
                    }
                },
                documenttypetemplates: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 204
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_EMAIL }/api/mail/templates/listByTransactionType`
                        }
                    }
                },
                contacttypelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 146
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/update`
                        }
                    }
                },
                contacttype: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 147
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contacttypes/update`
                        }
                    }
                },
                agreementtypelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 148
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/update`
                        }
                    }
                },
                agreementtype: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 149
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementtype/update`
                        }
                    }
                },
                additionalcostlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 150
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/update`
                        }
                    }
                },
                additionalcost: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 151
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/update`
                        }
                    }
                },
                bargelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 152
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/update`
                        }
                    }
                },
                barge: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 153
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/barge/update`
                        }
                    }
                },
                statuslist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 154
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/update`
                        }
                    }
                },
                status: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 155
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/status/update`
                        }
                    }
                },
                currencylist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 156
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/update`
                        }
                    }
                },
                currency: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 157
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/codesList`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/update`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/currencies/export`
                        }
                    }
                },
                exchangeratelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 158
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/update`
                        }
                    }
                },
                exchangerate: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 159
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangerates/update`
                        }
                    }
                },
                formulalist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 160
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/update`
                        }
                    }
                },
                formula: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 161
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/update`
                        }
                    }
                },
                countrylist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 162
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/update`
                        }
                    }
                },
                country: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 163
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/countries/update`
                        }
                    }
                },
                emaillogslist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 164
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/update`
                        }
                    }
                },
                emaillogs: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 165
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/emaillogs/update`
                        }
                    }
                },
                timezonelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 166
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/update`
                        }
                    }
                },
                timezone: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 167
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/timezones/update`
                        }
                    }
                },
                claimtypelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 170
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/listMasters`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/update`
                        }
                    }
                },
                claimtype: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 171
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/claimtype/update`
                        }
                    }
                },
                templatelist: {
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MAIL }/api/mail/templates/list`
                        }
                    }
                },
                contact: {
                    entity: {
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/contact/delete`
                        }
                    }
                }
            },
            admin: {
                userlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 200
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/update`
                        }
                    }
                },
                users: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 201
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/list`
                        },
                        lookup: {
                            Company: {
                                endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/listAdmin`
                            },
                            Buyer: {
                                endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/listAdmin`
                            },
                            Vessel: {
                                endpoint: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/listAdmin`
                            }
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_MASTERS }/api/admin/user/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/update`
                        }
                    }
                },
                user: {
                    listForSearch: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/listForSearch`
                },
                rolelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 202
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/update`
                        }
                    }
                },
                role: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 203
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/update`
                        },
                        moduleScreenActions: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/moduleScreenActions`
                        },
                        lookup: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/role/lookup`
                        }
                    }
                },
                configuration: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 204
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/generalConfiguration/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/generalConfiguration/update`
                        }
                    }
                },
                subscriptionslist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 205
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/subscription/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/subscription/get`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/subscription/create`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/subscription/delete`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/subscription/update`
                        }
                    }
                },
                ftpUploads: {
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/getuploadedfileslist`
                        },
                        delete: {
                            endpoint: `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/deleteuploadlog`
                        }
                    }
                },
                schedulerConfigurations: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 211
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/getschedulerconfigurationlist`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_IMPORTEXPORT }/api/importExport/upload/newschedulerconfiguration`
                        }
                    }
                },
                sellerrating: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 801
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerrating/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerrating/export`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerrating/update`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerrating/update`
                        }
                    }
                },
                templates: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 204
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_MAIL }/api/mail/templates/listByTypeAndProcess`
                        }
                    }
                },
                tradebooks:{
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 215
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/tradeBookMapping/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/tradeBookMapping/get`
                        }
                    }
                },
                tradebook: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 216
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/tradeBookMapping/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/tradeBookMapping/update`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_ADMIN }/api/admin/tradeBookMapping/create`
                        }
                    },
                    lookup: {
                    }
                },
            },
            claims: {
                claimslist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 500
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/get`
                        }
                    }
                },
                claims: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 501
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/export`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/getOrderLookup`,
                            json: {}
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/update`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/create`
                        },
                        complete: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/complete`
                        },
                        cancel: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/cancel`
                        }
                    },
                    lookup: {
                        Order: {
                            json: {
                                Payload: true
                            },
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/autocompleteOrder`
                        }
                    }
                },
                claim: {
                    entity: {
                        export: {
                            endpoint: `${API.BASE_URL_DATA_CLAIMS }/api/claims/export`
                        }
                    }
                },
                entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 501
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                }
            },
            orders: {
                orders: {
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/list`
                        },
                        get: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/export`
                        }
                    },
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 100
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    }
                },
                sap_export: {
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getAllSAPOrderExports`
                        }
                    },
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 12,
                                    Order: null,
                                    Filters: [],
                                    Pagination: {
                                        Skip: 0,
                                        Take: 25
                                    }
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        }
                    }
                }
            },
            labs: {
                labresultlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 700
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            endpoint: `${API.BASE_URL_DATA_LABS }/api/labs/list`
                        }
                    }
                },
                labresult: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 701
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_LABS }/api/labs/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_LABS }/api/labs/export`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_LABS }/api/labs/getOrderLookup`,
                            json: {}
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_LABS }/api/labs/update`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_LABS }/api/labs/create`
                        },
                        verify: {
                            endpoint: `${API.BASE_URL_DATA_LABS }/api/labs/verify`
                        },
                        revert: {
                            endpoint: `${API.BASE_URL_DATA_LABS }/api/labs/revert`
                        }
                    },
                    lookup: {
                        Order: {
                            json: {
                                Payload: true
                            },
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/autocompleteOrder`
                        }
                    }
                },
                entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 701
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                }
            },
            contracts: {
                contractlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 400
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/list`
                        }
                    }
                },
                contract: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 401
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/export`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/getOrderLookup`,
                            json: {}
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/update`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/create`
                        }
                    }
                },
                entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 401
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                }
            },
            delivery: {
                deliverylist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 600
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/list`
                        }
                    }
                },
                ordersdeliverylist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 600
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getOrdersToBeDelivered`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getOrdersToBeDelivered/export`
                        }
                    }
                },
                delivery: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 601
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/get`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/export`
                        },
                        list: {
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/getOrderLookup`,
                            json: {}
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/update`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/create`
                        }
                    }
                },
                deliverysummary: {
                    entity: {
                        get: {
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/summary`
                        }
                    }
                },
                deliveriestobeverified: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 602
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/listToBeVerified`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/delivery/listToBeVerified/export`
                        }
                    }
                },
                entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 601
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                }
            },
            recon: {
                reconlist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 900
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_RECON }/api/recon/reconList`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_RECON }/api/recon/reconList/export`
                        }
                    }
                },
                recon: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 901
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_RECON }/api/recon/orderDetail`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_DELIVERY }/api/recon/export`
                        }
                    }
                }
            },
            alerts: {
                alertslist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 213
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_ALERTS }/api/alerts/list`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_ALERTS }/api/alerts/export`
                        }
                    }
                },
                alerts: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 214
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_ALERTS }/api/alerts/get`,
                            endpointDrop: `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_ALERTS }/api/alerts/update`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_ALERTS }/api/alerts/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_ALERTS }/api/alerts/create`
                        }
                    }
                }
            },
            invoices: {
                invoice: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 303
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/update`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/create`
                        }
                    }
                },
                transactionstobeinvoiced: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 300
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/deliveriesToBeInvoicedList`
                        }
                    }
                },
                invoicelist: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 301
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/list`
                        }
                    }
                },
                completeview: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 302
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/completeViewList`
                        }
                    }
                },
                complete_view: {
                    entity: {
                        export: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/exportCompleteView`
                        }
                    }
                },
                claims: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 303
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        get: {
                            json: {},
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/update`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/claimsToBeInvoicedList/export`
                        },
                        create: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/create`
                        }
                    }
                },
                treasuryreport: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 304
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`
                        },
                        update: {
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/update`
                        }
                    },
                    entity: {
                        list: {
                            json: {
                                Payload: {
                                    Order: null,
                                    Filters: [],
                                    Pagination: {
                                        Skip: 0,
                                        Take: 3
                                    }
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/treasuryReport`
                        },
                        export: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/treasuryReportExport`
                        }
                    }
                },
                deliveries: {
                    entity: {
                        export: {
                            endpoint: `${API.BASE_URL_DATA_INVOICES }/api/invoice/deliveriesToBeInvoicedList/export`
                        }
                    }
                },
                entity_documents: {
                    layout: {
                        get: {
                            json: {
                                Payload: {
                                    ScreenType: 303
                                }
                            },
                            endpoint: `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/screenlayout/get`,
                            path_clc: [ 'clc', 'entity_documents' ]
                        }
                    }
                }
            }
        };

        let cache = new Object();
        cache.loaded = 0;
        if (_debug) {
            console.log('Loaded tenant settings: ', $tenantSettings);
        }
        if (_debug) {
        	 var result = {};
			_.forEach(Object.keys($listsCache).sort(), function(key) {
			result[key] = $listsCache[key];
			});
            console.log('Loaded cache: ', result);
        }
        var formatters = function(obj) {
            for (let key in obj) {
                if (obj[key]) {
                    if (typeof obj[key] == 'object') {
                        formatters(obj[key]);
                        continue;
                    }
                    if (typeof obj[key] == 'string') {
                        if (key == 'Parse') {
                            if (obj[key] == 'amount') {
                                obj[key] = `number:${ $tenantSettings.defaultValues.amountPrecision}`;
                            }
                            if (obj[key] == 'price') {
                                obj[key] = `number:${ $tenantSettings.defaultValues.pricePrecision}`;
                            }
                            if (obj[key] == 'quantity') {
                                obj[key] = `number:${ $tenantSettings.defaultValues.quantityPrecision}`;
                            }
                            if (obj[key] == 'date') {
                                obj[key] = $tenantSettings.tenantFormats.dateFormat;
                            }
                        }
                        continue;
                    }
                }
            }
            return obj;
        };
        let getGenericLayout = function(layout, list) {
            let layouts_map = {
                entity_documents: 'DocumentUpload',
                entity_audit_log: 'Audit',
            };
            let toReturn = '';

            $.each(list, (key, value) => {
                if(layouts_map[layout] == value.name) {
                    toReturn = value.layout;
                }
            });

            return toReturn;
        };
        let parse = function(param, data) {
            let result;
            if (_debug) {
                console.log('$APIService parse called with ', param, data);
            }
            if (param == 'formatters') {
                result = formatters(data);
                return result;
            }
            if (param == 'getGenericLayout') {
                result = getGenericLayout(data.name, data.list);
                return result;
            }
        };


        // generic layout cache
        var $Generic_Layout = {

            // 0. layout cache
            Generic_Layout_Cache: null,

            // 1. function to init generic layout cache
            initCache: function() {
                console.log(this);
                $Generic_Layout.Generic_Layout_Cache = $cacheFactory('Generic_Layout');
            },

            // 2. function to check if generic layout is already loaded
            layoutLoaded: function(name) {
                // Generic_Layout_Cache = $cacheFactory('Generic_Layout');
                if (angular.isUndefined($Generic_Layout.Generic_Layout_Cache.get(name))) {
                    return false;
                }
                return true;
                // $scope.keys.push(key);
                // }
                //   $scope.cache.put(key, angular.isUndefined(value) ? null : value);
                // };
            },

            // 3. function to put layout in cache
            cacheLayout: function(name, layout) {
                // Generic_Layout_Cache = $cacheFactory('Generic_Layout');
                $Generic_Layout.Generic_Layout_Cache.put(name, angular.isUndefined(layout) ? null : layout);
            },

            // 4. funtion to get layout from cache
            getLayout: function(name) {
                return $Generic_Layout.Generic_Layout_Cache.get(name);
            }
        };
        $Generic_Layout.initCache();
        // //////////////////////////////////////

        let $Api_Service = {
            screen: {
                get_actions: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService screen.get called with the following params:');
                    }
                    if (_debug) {
                        console.log(param);
                    }
                    if (param.app == 'admin' && param.screen == 'subscriptionlist') {
                        let apiJSON = {
                            layout: {},
                            elements: {},
                            clc: {}
                        };
                        callback(apiJSON);
                        return;
                    }
                    if (param.app == 'admin' && param.screen == 'CONFIGURATION') {
                        let apiJSON1 = {
                            layout: {},
                            elements: {},
                            clc: {}
                        };
                        callback(apiJSON1);
                        return;
                    }
                    if (param.app == 'masters' && param.screen == 'contactlist') {
                        param.screen = 'counterpartylist';
                    }
                    if (param.app == 'invoices' && param.screen == 'claims') {
                        param.screen = 'invoice';
                    }

                    if(!api_map[param.app][param.screen]) {
                        return;
                    }
                    if(!api_map[param.app][param.screen].layout) {
                        return;
                    }

                    $http.post(api_map[param.app][param.screen].layout.get.endpoint, api_map[param.app][param.screen].layout.get.json).then(
                        (response) => {
                            if (response.data) {
                                // console.log(response);
                                // var jsonDATA = JSON.parse(response.data.screenButtons);
                                // if (typeof(param.clc_id) != 'undefined') {
                                //     if (typeof(jsonDATA.clc[param.clc_id]) != 'undefined') {
                                //         var singleCLC = jsonDATA.clc[param.clc_id];
                                //         jsonDATA.clc = singleCLC;
                                //     }
                                // }
                                // var result = parse("formatters", jsonDATA);
                                callback(response.data.screenButtons);
                            } else {
                                callback(false);
                            }
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            callback(false);
                        }
                    );
                },
                get: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService screen.get called with the following params:');
                    }
                    if (_debug) {
                        console.log(param);
                    }
                    if (param.app == 'admin' && param.screen == 'subscriptionlist') {
                        var apiJSON = {
                            layout: {},
                            elements: {},
                            clc: {}
                        };
                        callback(apiJSON);
                        return;
                    }
                    if (param.app == 'admin' && param.screen == 'ftpUploads') {
                        let apiJSON1 = {
                            layout: {},
                            elements: {},
                            clc: {
                                table_name: 'All uploaded files',
                                datatype: 'local',
                                language: 'en',
                                rowNum: 10,
                                rowList: [ 30, 20, 10 ],
                                multiselect: false,
                                viewrecords: true,
                                sortable: {
                                    options: {
                                        items: '>th:not(:has([id*="_cb"],[id*="_actions"]),:hidden)'
                                    }
                                },
                                view_type: 'flat',
                                treeGrid: false,
                                treeGridModel: 'adjacency',
                                ExpandColumn: 'actions-dimensional',
                                colModel: [
                                    {
                                        index: 'notes',
                                        label: 'Notes',
                                        name: 'notes',
                                        width: 100,
                                        sortable: true,
                                        formatter: 'table_modal'
                                    },
                                    {
                                        index: 'id',
                                        label: 'ID',
                                        name: 'id',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'docName',
                                        label: 'Document Name',
                                        name: 'docName',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'app.name',
                                        label: 'Application',
                                        name: 'app.name',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'screen.name',
                                        label: 'Page',
                                        name: 'screen.name',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'fileType',
                                        label: 'File Type',
                                        name: 'fileType',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'size',
                                        label: 'Size',
                                        name: 'size',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'addedBy.name',
                                        label: 'Added By',
                                        name: 'addedBy.name',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'addedOn',
                                        label: 'Added On',
                                        name: 'addedOn',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'status.name',
                                        label: 'Status',
                                        name: 'status.name',
                                        width: 150,
                                        sortable: true
                                    },
                                    {
                                        index: 'schedule',
                                        label: 'Schedule',
                                        name: 'schedule',
                                        width: 150,
                                        sortable: true,
                                        formatter: 'schedule_type'
                                    }
                                ],
                                rowActions: [
                                    {
                                        label: 'Delete',
                                        class: 'delete',
                                        url: '/api/importExport/upload/newschedulerconfiguration'
                                    }
                                ],
                                tenantData: {
                                    view: 'flat',
                                    views: [ 'flat', 'dimensional' ],
                                    hiddenColumns: [],
                                    columnsOrder: [ 0, 1, 2, 3, 4, 5, 6 ],
                                    numberOfAdditionalColumns: 0,
                                    columnsOrderLoadOnce: false
                                }
                            }
                        };
                        callback(apiJSON1);
                        return;
                    }
                    if (param.app == 'procurement' && param.screen == 'productcontractlist') {
                        apiJSON = {
                            layout: {},
                            elements: {},
                            clc: {
                                table_name: 'Select Contract',
                                datatype: 'local',
                                language: 'en',
                                rowNum: 25,
                                // rowList: [999999, 100, 50, 25],
                                multiselect: false,
                                viewrecords: true,
                                sortable: { options: { items: '>th:not(:has([id*="_cb"],[id*="_actions"]),:hidden)' } },
                                view_type: 'flat',
                                treeGrid: false,
                                treeGridModel: 'adjacency',
                                // ExpandColumn: "actions-dimensional",
                                colModel: [
                                    { label: 'Contract ID', name: 'contract.id', width: 50 },
                                    { label: 'Contract Name', name: 'contract.name', width: 150 },
                                    // { label: "Expiry Date", name: "validTo", width: 150},
                                    { label: 'Price', name: 'price', width: 150 },
                                    { label: 'Formula Desc', name: 'formula.name', width: 150 },
                                    { label: 'Pricing Type', name: 'pricingType.name', width: 150 },
                                    // { label: "Additional Cost", name: "additionalCost", width: 100 },
                                    // { label: "Seller", name: "seller.name", width: 150 },
                                    { label: 'Location', name: 'location.name', width: 150 },
                                    { label: 'Product', name: 'product.name', width: 150 },
                                    // { label: "Contracted Quantity", name: "contractedQuantity", width: 150, formatter: "quantity" },
                                    // { label: "Available Quantity", name: "availableQuantity", width: 150, formatter: "quantity" },
                                    // { label: "Status", name: "status.name", width: 150, displayName: "status.name" },
                                    // { label: "Contract Min. - Max. Qty", name: "contract", width: 150, formatter: "contract_planning_min_max_qty", dataFrom: "modal" }
                                ],
                                rowActions: [],
                                tenantData: { view: 'flat', views: [ 'flat', 'dimensional' ], hiddenColumns: [], columnsOrder: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ], numberOfAdditionalColumns: 0, columnsOrderLoadOnce: false }
                            },
                            id: 150
                        };

                        callback(apiJSON);
                        return;
                    }
                    if (param.app == 'masters' && param.screen == 'contactlist') {
                        param.screen = 'counterpartylist';
                    }
                    if (param.app == 'claims' && param.screen == 'claim') {
                        param.screen = 'claims';
                    }


                    // check if params are defined for app & screen
                    if (typeof api_map[param.app][param.screen] == 'undefined') {
                        return;
                    }


                    if(param.generic && $state.current.url.indexOf('emailpreview') == -1 && $state.current.url.indexOf('documents/') == -1) {
                        // if app is requesting a generic layout, first check if it is already loaded
                        if($Generic_Layout.layoutLoaded(param.generic.layout)) {
                            // layut loaded, return what you have

                            let jsonDATA = $Generic_Layout.getLayout(param.generic.layout);
                            if(param.clc_id && api_map[param.app][param.screen].layout.get.path_clc) {
                                let paths = api_map[param.app][param.screen].layout.get.path_clc;
                                let lastKeyIndex = paths.length - 1;
                                for (let i = 0; i < lastKeyIndex; ++i) {
                                    var key = paths[i];
                                    var next_key = paths[i + 1];
                                    jsonDATA = jsonDATA[key];
                                }
                                if (!jsonDATA.colModel) {
                                    jsonDATA = {
                                        clc: jsonDATA[paths[lastKeyIndex]]
                                    };
                                } else {
                                    jsonDATA = {
                                        clc: jsonDATA
                                    };
                                }
                            }else{
                                // jsonDATA = jsonDATA.layout;
                            }
                            console.log('generic returned', jsonDATA);
                            let result = parse('formatters', jsonDATA);
                            console.log('generic returned 2', result);

                            callback(result);
                            return;
                        }
                        // continue, make call and cache layout
                    }
                    // console.log('generic returned 2',param.json);
                    // if(param.json) {
                    //     var result = parse("formatters", jsonDATA);
                    //     callback(param.json);
                    //     return;
                    // }
                    // console.log('really returned');
                    $http.post(api_map[param.app][param.screen].layout.get.endpoint, api_map[param.app][param.screen].layout.get.json).then(
                        (response) => {
                            if (response.data) {
                                // debugger;

                                if (param.app == 'invoices' && param.screen == 'invoice') {
                                	$rootScope.screenLayoutData = response.data;
                                }

                                let jsonDATA2 = null;
                                if (param.generic) {
                                    // jsonDATA = response.data.genericLayouts;
                                    // 1. get the generic layout you need, genericLayout is an array w. multiple layouts
                                    // var genericLayouts = angular.copy(response.data.genericLayouts);
                                    jsonDATA2 = JSON.parse(parse('getGenericLayout', { name: param.generic.layout,
                                        list: response.data.genericLayouts }));

                                    // 2. cache the layout for later user
                                    $Generic_Layout.cacheLayout(param.generic.layout, jsonDATA2);
                                }else{
                                    jsonDATA2 = JSON.parse(response.data.layout);
                                }


                                if (api_map[param.app][param.screen].layout.get.path ||
                                   param.clc && api_map[param.app][param.screen].layout.get.path_clc) {
                                    let paths2 = api_map[param.app][param.screen].layout.get.path;
                                    if(!paths2) {
                                        paths2 = api_map[param.app][param.screen].layout.get.path_clc;
                                    }
                                    let lastKeyIndex2 = paths2.length - 1;
                                    for (let i1 = 0; i1 < lastKeyIndex2; ++i1) {
                                        key = paths2[i1];
                                        next_key = paths2[i1 + 1];
                                        jsonDATA2 = jsonDATA2[key];
                                    }
                                    jsonDATA2 = {
                                        clc: jsonDATA2[paths2[lastKeyIndex2]]
                                    };
                                }

                                if (typeof param.clc_id != 'undefined') {
                                    if (param.modal) {
                                        param.clc_id = param.clc_id.split('_');
                                        param.clc_id = `${param.clc_id[0] }_${ param.clc_id[1]}`;
                                    }
                                    if (typeof jsonDATA2.clc[param.clc_id] != 'undefined') {
                                        let singleCLC = jsonDATA2.clc[param.clc_id];
                                        jsonDATA2.clc = singleCLC;
                                    }
                                }
                                let result2 = parse('formatters', jsonDATA2);
                                console.log('$APIService screen.get got response:');
                                console.log(result2);
                                if (param.clc_id == 'entity_documents') {
	                         		$rootScope.$broadcast('documentsScreenLayout', result2);
                                }
                                callback(result2);
                            } else {
                                callback(false);
                            }
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            callback(false);
                        }
                    );
                },
                update: function(param, callback) {
                    $http.post(api_map[param.app][param.screen].layout.get.endpoint, api_map[param.app][param.screen].layout.get.json).then(
                        (response) => {
                            let newLayout = {};
                            newLayout.elements = [];
                            newLayout.layout = {};
                            newLayout.clc = [];
                            if (response.data) {
                                let data = JSON.parse(response.data.layout);
                                let jsonDATA = api_map[param.app][param.screen].layout.get.json;
                                newLayout.elements = data.elements;
                                newLayout.layout = data.layout;
                                newLayout.layout.children.edit = param.layout;
                                jsonDATA.Payload.id = response.data.id;
                                jsonDATA.Payload.layout = JSON.stringify(newLayout);
                                $http.post(api_map[param.app][param.screen].layout.update.endpoint, jsonDATA).then(
                                    (response2) => {
                                        if (response2.status == 200) {
                                            callback('Saved');
                                        } else {
                                            callback(false);
                                        }
                                    },
                                    (response2) => {
                                        console.log('HTTP ERROR');
                                        callback(false);
                                    }
                                );
                            } else {
                                callback(false);
                            }
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            callback(false);
                        }
                    );
                }
            },
            datatable: {
                get: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService datatable.get called with the following params:', param);
                    }
                    if (param.id.length < 1 && !isNaN(param.id)) {
                        callback(false);
                        return;
                    }
                    // Customizari
                    let apiJSON = {};
                    let url = '';
                    if (param.app == 'delivery' && param.screen == 'delivery' && param.id == 'spec') {
                        apiJSON = {
                            Payload: {
                                Order: null,
                                Filters: [
                                    {
                                        ColumnName: 'OrderId',
                                        Value: param.data.orderId
                                    },
                                    {
                                        ColumnName: 'ProductId',
                                        Value: param.data.productId
                                    }
                                ],
                                Pagination: {
                                    Skip: 0,
                                    Take: 10
                                },
                                SearchText: null
                            }
                        };
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/specParameters/getLabsSpecParameters`;
                        $http.post(url, apiJSON).then((response) => {
                            if (response.status == 200) {
                                let res = [];
                                response.data.payload.forEach((entry) => {
                                    let i = {};
                                    i.specParameter = entry.specParameter;
                                    i.claimTypeId = entry.claimTypeId;
                                    i.min = entry.min;
                                    i.max = entry.max;
                                    i.uom = entry.uom;
                                    res.push(i);
                                });
                                callback(res);
                            } else {
                                console.log('Error retrieving spec parameters for product');
                                callback(false);
                            }
                        });
                        return;
                    }
                    if (param.app == 'labs' && param.screen == 'labresult' && param.id == 'spec') {
                        apiJSON = {
                            Payload: {
                                Order: null,
                                Filters: [
                                    {
                                        ColumnName: 'OrderId',
                                        Value: param.data.orderId
                                    },
                                    {
                                        ColumnName: 'DeliveryProductId',
                                        Value: param.data.deliveryProductId
                                    },
                                    {
                                        ColumnName: 'OrderProductId',
                                        Value: param.data.orderProductId
                                    }
                                ],
                                Pagination: {
                                    Skip: 0,
                                    Take: 10
                                },
                                SearchText: null
                            }
                        };
                        if(param.id == 'spec') {
                            apiJSON.Payload.SortList = {
                                SortList: [
                                    {
                                        columnValue: 'SpecGroupParameter_Id',
                                        sortParameter: 1
                                    }
                                ]
                            };
                        }
                        $http.post(`${API.BASE_URL_DATA_MASTERS }/api/masters/specParameters/getLabsSpecParameters`, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('Could not retrieve datatable');
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'labs' && param.screen == 'labresult' && param.id == 'sealnumber') {
                        apiJSON = {
                            Payload: {
                                Order: null
                            }
                        };
                        $http.post(`${API.BASE_URL_DATA_LABS }/api/labs/empty`, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('Could not retrieve datatable');
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'labs' && param.screen == 'labresult' && param.id == 'labstestslist') {
                        apiJSON = {
                            Payload: param.data
                        };
                        $http.post(`${API.BASE_URL_DATA_LABS }/api/labs/tests/list`, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('Could not retrieve datatable');
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'recon' && param.screen == 'recon' && param.id == 'quantity') {
                        apiJSON = {
                            Payload: {
                                Pagination: {
                                    Skip: 0,
                                    Take: 1000
                                }
                            },
                            UiFilters: {
                                OrderId: param.data.orderId,
                                UomId: param.data.UomId
                            }
                        };
                        // "UomId": param.data.uomId,
                        url = `${API.BASE_URL_DATA_RECON }/api/recon/quantityList`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('HTTP ERROR retrieving quantity recon');
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'recon' && param.screen == 'recon' && param.id == 'price') {
                        console.log(param);
                        apiJSON = {
                            Payload: {
                                Pagination: {
                                    Skip: 0,
                                    Take: 1000
                                },
                                Filters: [
                                    {
                                        ColumnName: 'OrderId',
                                        Value: param.data.orderId
                                    }
                                ]
                            }
                        };
                        // var apiJSON = {
                        //     "Payload": param.data.orderId
                        // };
                        url = `${API.BASE_URL_DATA_RECON }/api/recon/priceReconList`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('HTTP ERROR retrieving quantity recon');
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'recon' && param.screen == 'recon' && param.id == 'qualityreconlist') {
                        console.log(param);
                        apiJSON = {
                            Payload: {
                                Pagination: {
                                    Skip: 0,
                                    Take: 1000
                                },
                                Filters: [
                                    {
                                        ColumnName: 'OrderId',
                                        Value: param.data.orderId
                                    }
                                ]
                            }
                        };
                        // var apiJSON = {
                        //     "Payload": param.data.orderId
                        // };
                        url = `${API.BASE_URL_DATA_RECON }/api/recon/qualityReconList`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('HTTP ERROR retrieving quantity recon');
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    // End customizari
                },
                update: function(param, callback) {
                    if (param.app == 'labs' && param.screen == 'labresult') {
                        let apiJSON = {
                            Payload: param.data
                        };
                        $http.post(`${API.BASE_URL_DATA_LABS }/api/labs/tests/bulksave`, apiJSON).then((response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Success!';
                            }
                            callback(res);
                        });
                        return;
                    }
                },
                create: function(param, callback) {}
            },
            rating: {
                get: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService rating.get called with the following params:', param);
                    }
                    let moduleMap = new Object();
                    $listsCache.Module.forEach((entry) => {
                        moduleMap[entry.name] = new Object();
                        moduleMap[entry.name].moduleId = entry.id;
                    });
                    $listsCache.TransactionType.forEach((entry) => {
                        if (moduleMap[entry.name]) {
                            moduleMap[entry.name].transactionId = entry.id;
                        }
                        if (entry.name == 'Order') {
                            moduleMap.Procurement.transactionId = entry.id;
                        }
                    });
                    // $listsCache.TransactionType.forEach(function(entry) {
                    // });
                    let map = {
                        contracts: 'Contracts',
                        delivery: 'Delivery',
                        labs: 'Labs',
                        claims: 'Claims',
                        invoices: 'Invoice',
                        admin: 'Admin',
                        masters: 'Masters',
                        recon: 'Recon',
                        Procurement: 'Procurement'
                    };
                    var moduleId = moduleMap[map[param.app]].moduleId;
                    var transactionTypeId = moduleMap[map[param.app]].transactionId;
                    if (param.app == 'Procurement') {
                        transactionTypeId = 5;
                    }
                    let apiJSON = {
                        Payload: {
                            Filters: [
                                {
                                    ColumnName: 'ModuleId',
                                    Value: moduleId
                                },
                                {
                                    ColumnName: 'ObjectId',
                                    Value: param.id
                                },
                                {
                                    ColumnName: 'TransactionTypeId',
                                    Value: transactionTypeId
                                }
                            ]
                        }
                    };
                    let url = `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerratingreview/get`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                callback(response.data.payload);
                            } else {
                                var data = {};
                                data.error = true;
                                data.message = response.data.ErrorMessage;
                                console.log('Error retrieving seller rating!');
                                callback(data);
                            }
                        },
                        (response) => {
                            var data = {};
                            data.error = true;
                            data.message = response.data.ErrorMessage;
                            console.log('Error retrieving seller rating!');
                            callback(data);
                        }
                    );
                },
                create: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService rating.get called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param.data
                    };
                    let url = `${API.BASE_URL_DATA_SELLERRATING }/api/sellerrating/sellerratingreview/create`;
                    $http.post(url, apiJSON).then(
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
                }
            },
            entity: {
                structure: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService entity.structure called with the following params:');
                    }
                    if (_debug) {
                        console.log(param);
                    }
                    if (param.app == 'default' && param.screen == 'request_procurement_documents') {
                        param.app = 'claims';
                        param.screen = 'claims';
                    }
                    $http.post(api_map[param.app][param.screen].layout.get.endpoint, api_map[param.app][param.screen].layout.get.json).then(
                        (response) => {
                            if (response.status == 200) {
                                let jsonDATA = JSON.parse(response.data.layout);
                                let result = jsonDATA.elements;
                                callback(result);
                            } else {
                                callback(false);
                            }
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            callback(false);
                        }
                    );
                },

                list: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService entity.list called with the following params:', param);
                    }
                    // debugger;
                    let apiJSON = {
                        Payload: {
                            Order: null,
                            PageFilters: {
                                Filters: []
                            },
                            SortList: {
                                SortList: []
                            },
                            Filters: [],
                            SearchText: null,
                            Pagination: {
                                Skip: 0,
                                Take: 0
                            }
                        }
                    };
                    if (param.app == 'delivery' && param.clc_id == 'delivery_ordersdeliverylist' && param.screen == 'ordersdeliverylist') {
                        if (param.params.col == 'requestId') {
                            param.params.col = 'reqId';
                        }
                        if (param.params.col == 'orderName') {
                            param.params.col = 'order_id';
                        }
                    }
                    // console.log(param.app);
                    // console.log(param.clc_id);
                    // console.log(param.screen);
                    if (param.app == 'delivery' && param.clc_id == 'delivery_deliverylist' && param.screen == 'deliverylist') {
                        if (param.params.col == 'orderNo') {
                            param.params.col = 'Order_Name';
                        }
                    }
                    if (param.app == 'invoices' && param.clc_id == 'invoices_treasuryreport' && param.screen == 'treasuryreport') {
                        // console.log(param);
                        if (param.params.col == 'paymentStatus') {
                            param.params.col = 'paymentStatus_Name';
                        }
                    }
                    if (param.app == 'masters' && param.clc_id == 'masters_emaillogslist') {
                        if (param.params.col == 'status') {
                            param.params.col = 'Status_Name';
                        }
                        if (param.params.col == 'to') {
                            param.params.col = '[To]';
                        }
                        if (param.params.col == 'from') {
                            param.params.col = '[From]';
                        }
                    }
                    // displayStatus changes
                    if (param.app == 'recon' && param.clc_id == 'recon_reconlist') {
                        if (param.params.col == 'orderStatus') {
                            param.params.col = 'orderStatus.name';
                        }
                    }
                    if (param.app == 'invoices' && param.clc_id == 'invoices_treasuryreport') {
                        if (param.params.col == 'invoiceStatus.displayName') {
                            param.params.col = 'invoiceStatus.name';
                        }
                    }
                    if (param.app == 'invoices' && param.clc_id == 'invoices_completeview') {
                        if (param.params.col == 'invoiceStatus.displayName') {
                            param.params.col = 'invoiceStatus.name';
                        }
                        if (param.params.col == 'invoiceApprovalStatus.displayName') {
                            param.params.col = 'invoiceApprovalStatus.name';
                        }
                        if (param.params.col == 'orderStatus.displayName') {
                            param.params.col = 'orderStatus.name';
                        }
                    }
                    if (param.app == 'invoices' && param.clc_id == 'invoices_invoiceslist') {
                        if (param.params.col == 'invoiceStatus.displayName') {
                            param.params.col = 'invoiceStatus.name';
                        }
                        if (param.params.col == 'invoiceApprovalStatus.displayName') {
                            param.params.col = 'invoiceApprovalStatus.name';
                        }
                        if (param.params.col == 'orderStatus.displayName') {
                            param.params.col = 'orderStatus.name';
                        }
                    }
                    if (param.app == 'invoices' && param.clc_id == 'deliveries_transactionstobeinvoiced') {
                        if (param.params.col == 'orderStatus') {
                            param.params.col = 'orderStatus.name';
                        }
                    }
                    if (param.app == 'claims' && param.clc_id == 'claims_claimslist') {
                        if (param.params.col == 'claimStatusDisplayName') {
                            param.params.col = 'claimStatus';
                        }
                    }
                    if (param.app == 'delivery' && param.clc_id == 'delivery_ordersdeliverylist') {
                        if (param.params.col == 'orderStatusDisplayName') {
                            param.params.col = 'orderStatus';
                        }
                    }
                    if (param.app == 'delivery' && param.clc_id == 'delivery_deliverylist') {
                        if (param.params.col == 'deliveryStatus.displayName') {
                            param.params.col = 'deliveryStatus.name';
                        }
                    }
                    if (param.app == 'delivery' && param.clc_id == 'delivery_deliveriestobeverified') {
                        if (param.params.col == 'deliveryStatus') {
                            param.params.col = 'deliveryStatus.name';
                        }
                    }
                    if (param.app == 'contracts' && param.clc_id == 'contracts_contractlist') {
                        if (param.params.col == 'status.displayName') {
                            param.params.col = 'status.name';
                        }
                    }
                    if (param.app == 'recon' && param.clc_id == 'recon_reconlist') {
                        if (param.params.col == 'buyer.name') {
                            param.params.col = 'buyer_Name';
                        }
                    }
                    if (param.app == 'contractplanning' && param.screen == 'contractlist') {
                        param.app = 'procurement';
                    }
                    // TBD filtrare
                    // console.log(scheduleDashboardVesselVoyages);
                    if (param.app == 'procurement' && param.screen == 'contractplanning') {
                        let scheduleDashboardVesselVoyages = JSON.parse(localStorage.getItem('scheduleDashboardVesselVoyages'));

                        if (scheduleDashboardVesselVoyages) {
                            var voyageFilter = '';
                            $.each(scheduleDashboardVesselVoyages, (k, v) => {
                                if(v.voyageDetail) {
                                    voyageFilter = `${voyageFilter }${v.voyageDetail.id },`;
                                }
                            });
                            if (voyageFilter.charAt(voyageFilter.length - 1) == ',') {
                                voyageFilter = voyageFilter.substr(0, voyageFilter.length - 1);
                            }
                            if (!param.params.filters || typeof param.params.filters == 'undefined') {
                                param.params.filters = [];
                            }
                            if (param.params.PageFilters.sortList) {
                                delete param.params.PageFilters.sortList;
                            }
                            param.params.filters.push({
                                ColumnName: 'VesselVoyageDetailIds',
                                Value: voyageFilter
                            });
                        }
                        localStorage.removeItem('scheduleDashboardVesselVoyages');
                    }
                    if (param.app == 'procurement' && param.screen == 'orderlist') {
                        let tempFilterOrdersFromConfirm = JSON.parse(localStorage.getItem('tempFilterOrdersFromConfirm'));
                        if (tempFilterOrdersFromConfirm) {
                            if (tempFilterOrdersFromConfirm.length == 1) {
                                var requestId = tempFilterOrdersFromConfirm[0];
                            } else if (tempFilterOrdersFromConfirm.length > 1) {
                                var orderIds = tempFilterOrdersFromConfirm.join(',');
                            }
                            console.log(requestId);
                            param.params.UIFilters = {
                                VesselId: null,
                                ProductId: null,
                                LocationId: null,
                                StatusId: null,
                                AgreementTypeId: null,
                                BuyerId: null,
                                ServiceId: null,
                                OrderIds: orderIds,
                                RequestId: requestId
                            };
                        }

                        localStorage.removeItem('tempFilterOrdersFromConfirm');
                    }


                    if (typeof param.params != 'undefined' && param.params != null) {
                        if (typeof param.params.filters !== 'undefined' && param.params.filters.length > 0) {
                            apiJSON.Payload.Filters = param.params.filters;
                        }
                        // UIFilters
                        if (typeof param.params.UIFilters !== 'undefined' && Object.keys(param.params.UIFilters).length > 0) {
                            apiJSON.UIFilters = param.params.UIFilters;
                        } else {
                            console.log('UPS');
                        }
                        // Search term
                        if (typeof param.params.SearchText !== 'undefined') {
                            apiJSON.Payload.SearchText = param.params.SearchText;
                        } else {
                            console.log('UPS');
                        }
                        // PageFilters
                        if (typeof param.params.PageFilters !== 'undefined' && Object.keys(param.params.PageFilters).length > 0) {
                            console.log();
                            if (param.params.PageFilters.sortList) {
                                // delete apiJSON.Payload.PageFilters.Filters.sortList
                                apiJSON.Payload.SortList.SortList = param.params.PageFilters.sortList;
                                if (param.params.PageFilters.sortList) {
                                    delete param.params.PageFilters.sortList;
                                }
                            }
                            if (param.params.PageFilters.raw) {
                                delete param.params.PageFilters.raw;
                            }
                            // if (param.params.PageFilters.hasOwnProperty('raw')) {
                            // 	param.params.PageFilters = {}
                            // }
                            apiJSON.Payload.PageFilters.Filters = _.isEmpty(param.params.PageFilters) ? [] : processDateFilters(param.params.PageFilters);
                        } else {
                            console.log('UPS');
                        }

                        function processDateFilters(filters) {
                        	var initialDateFilter = angular.copy(filters);
                            $.each(initialDateFilter, (k, v) => {
                                if (v) {
                                    if (typeof v.ColumnType != 'undefined') {
                                        if (v.ColumnType.toLowerCase() == 'date' || v.ColumnType.toLowerCase() == 'dateonly') {
                                            $.each(v.Values, (kk, vv) => {
	                                            if (v.dateType && v.dateType == 'subtractTimezone') {
	                                                initialDateFilter[k].Values[kk] = moment.utc(vv).subtract(moment().utcOffset(), 'minutes').format('YYYY-MM-DDTHH:mm');
	                                            } else {
	                                                initialDateFilter[k].Values[kk] = moment.utc(vv).format('YYYY-MM-DDTHH:mm');
	                                            }
                                            });
                                        }
                                    }
                                }
                            });
                            return initialDateFilter;
                        }

                        // if (apiJSON.Payload.SortList.SortList.length == 0) {
                        //     if (param.params.colArray && param.params.colArray.length > 0 && (param.params.sortArray && param.params.sortArray.length > 0)) {
                        //         directionsNames = { asc: 1, desc: 2, none: 0 };
                        //         $.each(param.params.colArray, function(k, v) {
                        //             if (directionsNames[param.params.sortArray[k]] > 0) {
                        //                 apiJSON.Payload.SortList.SortList.push({ ColumnValue: v.replace(".", "_"), SortIndex: k, SortParameter: directionsNames[param.params.sortArray[k]] });
                        //             }
                        //         });
                        //         // apiJSON.Payload.Order = {
                        //         //     ColumnName: cols[0].replace(".", "_"),
                        //         //     SortOrder: directionsNames[directions[0]]
                        //         // };
                        //     }
                        // }
                        apiJSON.Payload.Pagination.Take = param.params.rows;
                        apiJSON.Payload.Pagination.Skip = param.params.rows * (param.params.page - 1);
                    }

                    // default URL init
                    let url = '';

                    if (param.app == 'masters' && param.clc_id == 'masters_productlist') {
                        let uniqueModalTableIdentifier = localStorage.getItem('uniqueModalTableIdentifier');
                        if (uniqueModalTableIdentifier == 'productsInVesselMaster' || uniqueModalTableIdentifier =='productsInTradeBookMapping' ) {
                        	url = `${API.BASE_URL_DATA_MASTERS }/api/masters/products/listMasters`;
                        	apiJSON.Payload.PageFilters.Filters = param.params.filters;
                        }
                        localStorage.removeItem('uniqueModalTableIdentifier');
                    }

                    if (param.clc_id == "masters_counterpartylist_subdepartment") {
                    	url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/subDepartmentPaginatedList`;
                    }

                    if (param.clc_id == "admin_userlist" && (window.location.href.indexOf('/edit-request') || window.location.href.indexOf('/new-request')) ) {
                    	param.clc_id = "admin_userlist";
                    	url = `${API.BASE_URL_DATA_ADMIN}/api/admin/user/getVesselOperatorsPaginated`;
                    }

                    // payableTo URL (invoices)
                    if ((param.app == 'invoices' && param.screen == 'invoice' || param.app == 'masters' && param.screen == 'counterpartylist') && param.clc_id == 'payableTo') {
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: '2, 11'
                            }
                        ];
                    }
                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_surveyors') {
                        // console.log(12132)
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: 6
                            }
                        ];
                    }
                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_physicalsuppliers') {
                        // console.log(12132)
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: 1
                            }
                        ];
                    }
                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_customer') {
                        // console.log(12132)
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: 4
                            }
                        ];
                    }                    

                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_barge') {
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: 7
                            }
                        ];
                    }
                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_labs') {
                        console.log(param);
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: 8
                            }
                        ];
                    }
                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_customers') {
                        console.log(param);
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: 4
                            }
                        ];
                    }                    
                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_seller') {
                        console.log(param);
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        var value = '2, 11';
                        if ($state.params.screen_id == 'contract') {
                            // 11 este serviceProvider
                            value = '2,11';
                        }
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: value
                            }
                        ];
                    }
                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_broker') {
                        console.log(param);
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: 3
                            }
                        ];
                    }
                    if (param.app == 'masters' && param.screen == 'counterpartylist' && param.clc_id == 'masters_counterpartylist_agent') {
                        console.log(param);
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: 5
                            }
                        ];
                    }
                    // price master - filtered period list
                    if (param.app == 'masters' && param.screen == 'period' && param.clc_id == 'masters_period_price') {
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/periods/listBySystemInstrument`;
                    }
                    // transactionstobeinvoiced URL (invoices)
                    if (param.app == 'invoices' && param.screen == 'transactionstobeinvoiced') {
                        if (param.clc_id == 'deliveries_transactionstobeinvoiced') {
                            url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/deliveriesToBeInvoicedList`;
                        }
                        if (param.clc_id == 'claims_transactionstobeinvoiced') {
                            url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/claimsToBeInvoicedList`;
                        }
                    }

                    // procurement
                    if (param.app == 'procurement' && param.screen == 'agentlist') {
                        if (param.clc_id == 'procurement_agentlist') {
                            apiJSON.Payload.Filters = [
                                {
                                    ColumnName: 'CounterpartyTypes',
                                    Value: 5
                                }
                            ];
                        }
                    }
                    if (param.app == 'procurement' && param.screen == 'brokerlist') {
                        if (param.clc_id == 'procurement_brokerlist') {
                            apiJSON.Payload.Filters = [
                                {
                                    ColumnName: 'CounterpartyTypes',
                                    Value: 3
                                }
                            ];
                        }
                    }
                    // Documents URL (all apps)

                    if (param.clc_id == 'entity_documents') {
                        console.log('$$$$');
                        // debugger;
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/list`;

                        // filters
                        let appPath = $state.current.name;
                        let transactionTypeId = 0;
                        // Id, Name
                        //  1, Request
                        //  2, Offer
                        //  3, Order
                        //  4, Delivery
                        //  5, Invoice
                        //  6, Labs
                        //  7, Claims
                        //  8, Masters
                        //  9, Contract
                        if (appPath.match(/view-request-documents/)) {
                            transactionTypeId = 1;
                        }
                        if (appPath.match(/offer/)) {
                            transactionTypeId = 2;
                        }
                        if (appPath.match(/default.view-group-of-requests-documents/)) {
                            transactionTypeId = 2;
                        }
                        if (appPath.match(/view-order-documents/)) {
                            transactionTypeId = 3;
                        }
                        if (appPath.match(/delivery/)) {
                            transactionTypeId = 4;
                        }
                        if (appPath.match(/invoices/)) {
                            transactionTypeId = 5;
                        }
                        if (appPath.match(/labs/)) {
                            transactionTypeId = 6;
                        }
                        if (appPath.match(/claims/)) {
                            transactionTypeId = 7;
                        }
                        if (appPath.match(/masters/)) {
                            transactionTypeId = 8;
                        }
                        if (appPath.match(/contracts/)) {
                            transactionTypeId = 9;
                        }
                        // {end} filters
                        if (
                        	!_.has(apiJSON, 'Payload.Filters') ||
                        	_.get(apiJSON, 'Payload.Filters').length === 0 ||
                        	appPath.match(/contracts/) ||
                        	appPath.match(/labs/) ||
                        	appPath.match(/claims/) ||
                        	appPath.match(/masters/)
                        	) {
                            apiJSON.Payload.Filters = [
                                {
                                    ColumnName: 'ReferenceNo',
                                    Value: $state.params.entity_id
                                }, // a.k.a. businessId (entity_id)
                                {
                                    ColumnName: 'TransactionTypeId',
                                    Value: transactionTypeId
                                }
                            ];
                        }

                        // document type master
                        if ($state.params.requestId) {
                            apiJSON.Payload.Filters[0].Value = $state.params.requestId;
                        }

                        if($state.current.name == 'masters.documents' || $state.current.name == 'masters.documents-counterparty') {
                            if($state.params.screen_id == 'documenttype') {
                                // change url
                                url = `${API.BASE_URL_DATA_MASTERS }/api/masters/documentupload/documentTypelist`;
                                apiJSON.Payload.Filters[1].Value = $state.params.entity_id;
                                apiJSON.Payload.Filters[1].ColumnName = 'DocumentTypeId';
                            }else{
                                let screenTransactionTypeMap = {
                                    additionalcost:     { id: 13, name: 'AdditionalCosts' },
                                    agreementtype:        { id: 14, name: 'AgreementTypes' },
                                    barge:         { id: 15, name: 'Barges' },
                                    buyer:        { id: 16, name: 'Buyers' },
                                    calendar:        { id: 17, name: 'Calendars' },
                                    claimtype:       { id: 18, name: 'ClaimTypes' },
                                    contacttype: { id: 20, name: 'ContactTypes' },
                                    company:     { id: 19, name: 'Companies' },
                                    pool:     { id: 19, name: 'Companies' },
                                    counterparty:    { id: 21, name: 'Counterparties' },
                                    country:        { id: 22, name: 'Countries' },
                                    deliveryoption:      { id: 23, name: 'DeliveryOptions' },
                                    documenttype:        { id: 24, name: 'DocumentTypes' },
                                    event:       { id: 25, name: 'Events' },
                                    exchangerate:     { id: 26, name: 'ExchangeRates' },
                                    formula:         { id: 27, name: 'Formulas' },
                                    incoterms:        { id: 28, name: 'Incoterms' },
                                    location:        { id: 29, name: 'Locations' },
                                    paymentterm:      { id: 31, name: 'PaymentTerms' },
                                    period:        { id: 32, name: 'Periods' },
                                    price:         { id: 33, name: 'Prices' },
                                    pricetype:   { id: 34, name: 'MarketPriceTypes' },
                                    product:    { id: 35, name: 'Products' },
                                    service:   { id: 36, name: 'Services' },
                                    operator:  { id: 36, name: 'Services' },
                                    specgroup:        { id: 37, name: 'SpecGroups' },
                                    specparameter:    { id: 38, name: 'SpecParameters' },
                                    status:         { id: 39, name: 'Statuses' },
                                    strategy:         { id: 40, name: 'Strategies' },
                                    systeminstrument:         { id: 41, name: 'SystemInstruments' },
                                    uom:    { id: 42, name: 'Uoms' },
                                    vessel:        { id: 43, name: 'Vessels' },
                                    vesseltype:        { id: 44, name: 'VesselTypes' },
                                    currency:         { id: 45, name: 'Currencies' }
                                };

                                apiJSON.Payload.Filters[1].Value = screenTransactionTypeMap[$state.params.screen_id].id;
                            }
                        }
                    }
                    // Audit Log URL (all apps)
                    if (param.clc_id == 'entity_audit_log') {
                        url = `${API.BASE_URL_DATA_ADMIN }/api/admin/audit/get`;
                        // filters
                        let availableTransactions = {
                            counterparty: 'Counterparty',
                            location: 'Location',
                            product: 'Product',
                            company: 'Company',
                            buyer: 'Buyer',
                            service: 'Service',
                            strategy: 'Strategy',
                            vessel: 'Vessel',
                            vesseltype: 'Vesseltype',
                            marketinstrument: 'Marketinstrument',
                            systeminstrument: 'Systeminstrument',
                            price: 'Price',
                            pricetype: 'Pricetype',
                            specgroup: 'Specgroup',
                            specparameter: 'Specparameter',
                            paymentterm: 'Paymentterm',
                            deliveryoption: 'Deliveryoption',
                            incoterms: 'Incoterm',
                            uom: 'Uom',
                            period: 'Period',
                            event: 'Event',
                            calendar: 'Calendar',
                            documenttype: 'Documenttype',
                            contacttype: 'Contacttype',
                            agreementtype: 'Agreementtype',
                            additionalcost: 'Additionalcost',
                            barge: 'Barge',
                            status: 'Status',
                            country: 'Country',
                            currency: 'Currency',
                            exchangerate: 'Exchangerate',
                            formula: 'Formula',
                            claimtype: 'Claimtype',
                            users: 'User',
                            role: 'Role',
                            claim: 'Claim',
                            contract: 'Contract',
                            configuration: 'Configuration',
                            request_procurement: 'Request',
                            order_procurement: 'Order',
                            delivery: 'Delivery',
                            invoice: 'Invoice',
                            claims: 'Invoice',
                            labresult: 'LabResult',
                            reconlist: 'Reconlist',
                            tradebook: 'Tradebook'
                        };
                        let transactionId = availableTransactions[$state.params.screen_id];
                        console.log(`Listing Audit Logs for BusinessId: ${ $state.params.entity_id } AND Transaction: ${ transactionId}`);
                        // {end} filters
                        apiJSON.Payload = {
                            Filters: [
                                {
                                    ColumnName: 'BusinessId',
                                    Value: $state.params.entity_id
                                },
                                {
                                    ColumnName: 'Transaction',
                                    Value: transactionId
                                }
                            ],
                            Pagination: {
                                Take: param.params.rows,
                                Skip: param.params.rows * (param.params.page - 1)
                            },
                            PageFilters: {
                                Filters: []
                            },
                            SortList: {
                                SortList: []
                            }
                        };

                        if (param.params.PageFilters && param.params.PageFilters.length > 0) {
                            apiJSON.Payload.PageFilters.Filters = param.params.PageFilters;
                        }
                        if (param.params.sortList && param.params.sortList.length > 0) {
                            // delete apiJSON.Payload.PageFilters.Filters.sortList
                            apiJSON.Payload.SortList.SortList = param.params.sortList;
                        }
                    }
                    // contract/productdelivery
                    if (param.clc_id == 'contractProductDeliveries') {
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'Id',
                                Value: $state.params.entity_id
                            }
                        ];
                        url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/deliveries`;
                    }

                    if (param.clc_id == 'request_bestcontracts' || param.clc_id == 'request_bestcontracts_all') {
                        apiJSON.Payload.Filters = [
                            {
                                ColumnName: 'RequestId',
                                Value: $state.params.requestId
                            }
                        ];
                    }
                    if (param.clc_id == 'procurement_scheduleDashboardTable') {
                        console.log($rootScope.productTypeView);
                    	if (!localStorage.getItem('scheduleDatesTable')) {
                    		var interval = setInterval(() => {
                    			if (localStorage.getItem('scheduleDatesTable')) {
                    				param.params.tableDates = {};
                    				var scheduleDatesTable = JSON.parse(localStorage.getItem('scheduleDatesTable'));
                    				param.params.tableDates.startDate = scheduleDatesTable.start;
                    				param.params.tableDates.endDate = scheduleDatesTable.end;
                                    Elements.settings.flat_table_schedule_dashboard.source.loadComplete();
                                    clearInterval(interval);
                    			}
                    		}, 200);
                    		return;
                    	}
                        // apiJSON.Payload.Start = localStorage.getItem('scheduleDatesTable').start;
                        // apiJSON.Payload.End = localStorage.getItem('scheduleDatesTable').end;
                        if (!param.params.tableDates) {
                        	// return false;
                            // if (typeof startDate == "undefined" || startDate === null || typeof endDate == "undefined" || endDate === null) {
                            //     apiJSON.Payload.Start = moment()
                            //         .subtract(7, "d")
                            //         .utc()
                            //         .startOf("day")
                            //         .toISOString();
                            //     apiJSON.Payload.End = moment()
                            //         .add(21, "d")
                            //         .utc()
                            //         .endOf("day")
                            //         .toISOString();
                            // }
                        } else {
                            apiJSON.Payload.Start = param.params.tableDates.startDate;
                            apiJSON.Payload.End = param.params.tableDates.endDate;
                        }
                        
                        if ($rootScope.productTypeView) {
                            apiJSON.Payload.Filters = [];
                            let packedFilter = {
                                columnName: 'ProductViewId',
                                value:  $rootScope.productTypeView.id 
                            };
                            apiJSON.Payload.Filters.push(packedFilter);
                        }
                    }

                    // if url is still not set
                    if(url == '') {
                        url = api_map[param.app][param.screen].entity.list.endpoint;
                    }

                    if (param.params.modal && param.screen == 'currencylist' &&  window.location.href.indexOf('/masters/currency') != -1) {
                        url = url.replace('listMasters', 'codesList'); 
                    } else if (param.params.modal) {
                        url = url.replace('listMasters', 'list');
                    }


                    if (param.clc_id == 'procurement_contractplanning') {
                    	if (window.lastCallData) {
	                    	if (JSON.stringify(window.lastCallData.Payload) == JSON.stringify(apiJSON) && new Date() - window.lastCallData.Time < 1000) {
	                    		return;
	                    	}
                    	}
                    	window.lastCallData = {
                    		Payload : apiJSON,
                    		Time : new Date()
                    	};
                    }

                    if (param.clc_id == 'orders_orders' && [ 'delivery'/* ,"claim","lab"*/ ].indexOf($state.params.screen_id) != -1) {
                    	var defaultFiltering = [
	                    	{
	                    		columnValue: 'OrderStatus_DisplayName',
	                    		ColumnType: 'Text',
	                    		isComputedColumn: false,
	                    		ConditionValue: '=',
	                    		Values: [
	                    		'Confirmed'
	                    		],
	                    		FilterOperator: 0
	                    	},
	                    	{
	                    		columnValue: 'OrderStatus_DisplayName',
	                    		ColumnType: 'Text',
	                    		isComputedColumn: false,
	                    		ConditionValue: '=',
	                    		Values: [
	                    		'PartiallyDelivered'
	                    		],
	                    		FilterOperator: 2
	                    	}
                    	];
                    	$.each(defaultFiltering, (k, v) => {
	                    	apiJSON.Payload.PageFilters.Filters.push(v);
                    	});
                    }
                    $http.post(url, angular.toJson(apiJSON)).then(
                        (response) => {
                        	 $rootScope.$broadcast('scheduleDashboardTableGetResponse', response.data);
                            if(param.clc_id == 'procurement_contractplanning') {
                                var plannedQuantitySummary = response.data.payload.plannedQuantitySummary;
                                var unplannedQuantitySummary = response.data.payload.unplannedQuantitySummary;
                                var cpSummary = {
                                    plannedQuantitySummary : plannedQuantitySummary,
                                    unplannedQuantitySummary : unplannedQuantitySummary
                                };
                                $rootScope.$broadcast('procurementContractPlanningSummary', cpSummary);
                            }
                            if (response.data) {
                                let res = new Object();
                                res.records = response.data.matchedCount;
                                res.page = param.params.page;
                                res.total = Math.ceil(response.data.matchedCount / param.params.rows);
                                res.rows = response.data.payload;

                                if(param.clc_id == 'procurement_scheduleDashboardTable') {
                                    res.rows = res.rows.scheduleDashboardView;
                                }
                                if(param.clc_id == 'procurement_contractplanning') {
                                    res.rows = res.rows.contractPlanningList;
                                }

                                // if (api_map[param.app][param.screen]["layout"]["get"]["processResponse"]) {
                                //     var processor = api_map[param.app][param.screen]["layout"]["get"]["processResponse"];
                                //     var processedData = dataProcessors[processor](res.rows.scheduleDashboardView);
                                //     res.rows = processedData;
                                // }

                                // debugger;

                                if (_debug) {
                                    console.log('$APIService entity.list result:', res);
                                }
                                callback(res);
                            } else {
                                callback(false);
                            }
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            callback(false);
                        }
                    );
                    // callback(false);
                },
                get: function(param, callback) {
                    // if (_debug) console.log("$APIService entity.get called with the following params:", param);
                    // Customizari
                    let url = '';
                    if (param.app == 'invoices' && param.screen == 'invoice' && param.child == 'entity_documents') {
                        return;
                    }
                    if (param.app == 'admin' && param.screen == 'sellerrating') {
                        let apiJSON = {
                            Payload: {
                            }
                        };
                        url = api_map[param.app][param.screen].entity.get.endpoint;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('HTTP ERROR while retrieving Seller Rating');
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR while retrieving Seller Rating');
                                callback(false);
                            }
                        );
                        return;
                    }

                    if (param.app == 'admin' && param.screen == 'configuration') {
                        let result = {};
                        if ($rootScope.reloadTenantConfiguration) {
                            $rootScope.reloadTenantConfiguration = false;
                            
							var tenantConfigPayload = false;
							if (window.location.href.indexOf("admin/configuration") != -1 || window.location.href.indexOf("id_token=") != -1) {
								tenantConfigPayload = true;
							}
                            $http.post(`${appConfig.API.BASE_URL }/Shiptech10.Api.Admin/api/admin/tenantConfiguration/get`, {
                                Payload: tenantConfigPayload
                            }).then((response) => {
                                if (response.status == 200) {
                                    angular.module('shiptech').value('$tenantSettings', response.data.generalConfiguration);
                                    angular.module('shiptech').value('$tenantConfiguration', response.data);
                                    result.contract = response.data.contractConfiguration;
                                    result.email = response.data.emailConfiguration;
                                    result.general = response.data.generalConfiguration;
                                    result.procurement = response.data.procurementConfiguration;
                                    result.schedule = response.data.scheduleDashboardConfiguration;
                                    result.delivery = response.data.deliveryConfiguration;
                                    result.invoice = response.data.invoiceConfiguration;
                                    result.report = response.data.reportConfiguration;
                                    result.lab = response.data.labConfiguration;
                                    result.master = response.data.masterConfiguration;
                                    result.claim = response.data.claimConfiguration;
                                    $rootScope.$broadcast('tenantConfiguration', result);
                                    $rootScope.tenantConfigurationResponseData = result;
                                    callback(result);
                                }
                            });
                        } else {
    							result.contract = $tenantConfiguration.contractConfiguration;
    							result.email = $tenantConfiguration.emailConfiguration;
    							result.general = $tenantConfiguration.generalConfiguration;
    							result.procurement = $tenantConfiguration.procurementConfiguration;
    						    result.schedule = $tenantConfiguration.scheduleDashboardConfiguration;
    							result.delivery = $tenantConfiguration.deliveryConfiguration;
    							result.invoice = $tenantConfiguration.invoiceConfiguration;
                                result.report = $tenantConfiguration.reportConfiguration;
                                result.lab = $tenantConfiguration.labConfiguration;
                                result.master = $tenantConfiguration.masterConfiguration;
                                result.claim = $tenantConfiguration.claimConfiguration;
    							$rootScope.$broadcast('tenantConfiguration', result);
                                $rootScope.tenantConfigurationResponseData = result;
	                            callback(result);
    	                        return;
                        }
                    }
                    if (param.app == 'admin' && param.screen == 'role') {
                        function deepmerge(foo, bar) {
                            let merged = {};
                            for (let each in bar) {
                                if (foo.hasOwnProperty(each) && bar.hasOwnProperty(each)) {
                                    if (typeof foo[each] == 'object' && typeof bar[each] == 'object') {
                                        merged[each] = deepmerge(foo[each], bar[each]);
                                    } else {
                                        merged[each] = [ foo[each], bar[each] ];
                                    }
                                } else if (bar.hasOwnProperty(each)) {
                                    merged[each] = bar[each];
                                }
                            }
                            for (let each1 in foo) {
                                if (!(each1 in bar) && foo.hasOwnProperty(each1)) {
                                    merged[each1] = foo[each1];
                                }
                            }
                            return merged;
                        }
                        let roles_promise = $http.post(api_map[param.app][param.screen].entity.get.endpoint, {
                            Payload: param.id
                        });
                        let check_promise = $http.post(api_map[param.app][param.screen].entity.moduleScreenActions.endpoint, {
                            Payload: {}
                        });
                        $q.all([ roles_promise, check_promise ]).then((responses) => {
                            if (responses[0].status == 200) {
                                var res1 = responses[0].data;
                            } else {
                                callback(false);
                                console.log('Error retrieving roles!');
                            }
                            if (responses[1].status == 200) {
                                var res2 = responses[1].data.payload;
                            } else {
                                callback(false);
                                console.log('Error retrieving role checks!');
                            }
                            let modules = {};
                            if(typeof res2 != 'undefined') {
                                res2.forEach((entry) => {
                                    let screens = {};
                                    entry.screens.forEach((entry2) => {
                                        let screenActions = {
                                            screen: {
                                                id: entry2.id,
                                                name: entry2.name
                                            },
                                            definedScreenTemplates: entry2.definedScreenTemplates
                                        };
                                        entry2.screenActions.forEach((entry3) => {
                                            screenActions[entry3.id] = {
                                                name: entry3.name
                                            };
                                        });
                                        screens[entry2.name] = screenActions;
                                    });
                                    screens.module = {
                                        id: entry.id,
                                        name: entry.name
                                    };
                                    modules[entry.name] = screens;
                                    // } else {
                                    // modules[entry.name] = [];
                                    // }
                                });
                            }

                            let checks = {};
                            if (param.id != '' && typeof res1 != 'undefined') {
                                res1.rights.forEach((entry) => {
                                    let screens = {};
                                    entry.moduleScreenConfigurations.forEach((entry2) => {
                                        let actions = {};
                                        entry2.actions.forEach((entry3) => {
                                            actions[entry3.id] = {
                                                isSelected: true
                                            };
                                        });
                                        actions.selectedScreenTemplate = entry2.screenTemplate;
                                        actions.idSrv = entry2.id;
                                        screens[entry2.screen.name] = actions;
                                    });
                                    screens.module = {
                                        idSrv: entry.id
                                    };
                                    checks[entry.module.name] = screens;
                                });
                            }
                            callback({
                                roles: res1,
                                moduleScreenActions: res2,
                                deepmerge: deepmerge(modules, checks),
                                isDeleted: res1.isDeleted
                            });
                        });
                        return;
                    }
                    // End customizari
                    if (param.id) {
                        if (param.id.length < 1 && !isNaN(param.id)) {
                            callback(false);
                            return;
                        }
                    }
                    // if (typeof(api_map[param.app][param.screen]) == 'undefined') {return}
                    if (param.app == 'claims' && param.screen == 'claim') {
                        param.screen = 'claims';
                    }
                    if (param.app == 'default' && param.screen == 'request_procurement') {
                        return;
                    }
                    if (param.app == 'default' && param.screen == 'request_procurement_documents') {
                        return;
                    }
                    if (param.app == 'default' && param.screen == 'order_procurement') {
                        return;
                    }
                    if (param.app == 'invoices' && param.screen == 'treasuryreport') {
                        return;
                    }
                    url = api_map[param.app][param.screen].entity.get.endpoint;
                    if (param.child && param.child == 'entity_documents') {
                        // url = 'http://path_to/documents';
                    }
                    if (param.child && param.child == 'entity_audit_log') {
                        // url = 'http://path_to/audit_log';
                    }
                    data = `{"Payload":${ param.id }}`;
                    if (typeof param.id == 'undefined' || !param.id) {
                        return;
                    }
                    $http.post(url, data).then(
                        (response) => {
                            if (response.data) {
                                let res;
                                // Customizari...poate le mutam altundeva?
                                if (param.app == 'admin' && param.screen == 'role') {
                                    res = response.data;
                                } else {
                                    res = response.data.payload;
                                }
                                let dimensionalMasters = {
                                    counterparty: true,
                                    location: true,
                                    product: true,
                                    company: true,
                                    buyer: true,
                                    service: true,
                                    strategy: true
                                };
                                if (param.app == 'masters' && dimensionalMasters[param.screen] && res.parent === null) {
                                    res.parent = {
                                        id: -1,
                                        name: 'No Parent'
                                    };
                                }
                                if (param.app == 'invoices' && param.screen == 'invoice') {
                                	if (res.invoiceChecks) {
                                		delete res.invoiceChecks;
                                	}
                                }
                                // End Customizari
                                // if (_debug) console.log("$APIService entity.get answer:", res);
                                callback(res);
                                return;
                            }
                            callback(false);
                            return;
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            callback(false);
                            return;
                        }
                    );
                },
                update: function(param, callback) {
                    let data;
                    if (typeof param.data !== 'object') {
                        data = JSON.parse(param.data);
                    } else {
                        data = param.data;
                    }
                    if (_debug) {
                        console.log('$APIService entity.update called with the following params:', param);
                    }
                    if (param.app == 'admin' && param.screen == 'configuration') {
                        param.id = 0;
                        if ($tenantSettings.shiptechLite) {
                            let email = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/emailConfiguration/update`, {
                                Payload: data.email
                            });
                            let general = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/generalConfiguration/update`, {
                                Payload: data.general
                            });
                            let procurement = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/procurementConfiguration/update`, {
                                Payload: data.procurement
                            });
                            let schedule = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/scheduleDashboardConfiguration/update`, {
                                Payload: data.schedule
                            });
                            let report = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/reportConfiguration/update`, {
                                Payload: data.report
                            });  
                            $q.all([ email, general, procurement, schedule, report]).then(
                            (responses) => {
                                let result = {};
                                result.status = true;
                                result.message = '';
                                if (responses[0].status == 200) {
                                    result.message = `${result.message }Email settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Email settings failed to save!<br>`;
                                }

                                if (responses[1].status == 200) {
                                    result.message = `${result.message }General settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }General settings failed to save!<br>`;
                                }

                                if (responses[2].status == 200) {
                                    result.message = `${result.message }Procurement settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Procurement settings failed to save!<br>`;
                                }

                                if (responses[3].status == 200) {
                                    result.message = `${result.message }Schedule settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Schedule settings failed to save!<br>`;
                                }

                                if (responses[4].status == 200) {
                                    result.message = `${result.message }Report settings saved!<br>`;
                                } else {
                                     result.message = `${result.message }Report settings failed to save!<br>`;
                                }
                                callback(result);
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                let res3 = new Object();
                                res3.message = 'HTTP Error!';
                                if (_debug) {
                                    res3.message = response.data.message;
                                }
                                callback(res3);
                                return;
                            }
                        );
                        return;
                        }
                        let contract = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/contractConfiguration/update`, {
                            Payload: data.contract
                        });
                        let email = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/emailConfiguration/update`, {
                            Payload: data.email
                        });
                        let general = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/generalConfiguration/update`, {
                            Payload: data.general
                        });
                        let procurement = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/procurementConfiguration/update`, {
                            Payload: data.procurement
                        });
                        let schedule = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/scheduleDashboardConfiguration/update`, {
                            Payload: data.schedule
                        });
                        let delivery = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/deliveryConfiguration/update`, {
                            Payload: data.delivery
                        });
                        let invoice = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/invoiceConfiguration/update`, {
                            Payload: data.invoice
                        });
                        let report = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/reportConfiguration/update`, {
                            Payload: data.report
                        });                
                        let lab = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/labConfiguration/update`, {
                            Payload: data.lab
                        });
                        let master = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/masterConfiguration/update`, {
                            Payload: data.master
                        });
                        let claim = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/claimConfiguration/update`, {
                            Payload: data.claim
                        });
                        $q.all([ contract, email, general, procurement, schedule, delivery, invoice, report, lab, master, claim ]).then(
                            (responses) => {
                                let result = {};
                                result.status = true;
                                result.message = '';
                                if (!$tenantSettings.shiptechLite) {
                                    if (responses[0].status == 200) {
                                        result.message = `${result.message }Contract settings saved!<br>`;
                                    } else {
                                        result.message = `${result.message }Contract settings failed to save!<br>`;
                                    }
                                }
                                if (responses[1].status == 200) {
                                    result.message = `${result.message }Email settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Email settings failed to save!<br>`;
                                }
                                if (responses[2].status == 200) {
                                    result.message = `${result.message }General settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }General settings failed to save!<br>`;
                                }
                                if (responses[3].status == 200) {
                                    result.message = `${result.message }Procurement settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Procurement settings failed to save!<br>`;
                                }
                                if (responses[4].status == 200) {
                                    result.message = `${result.message }Schedule settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Schedule settings failed to save!<br>`;
                                }
                                
                                if (!$tenantSettings.shiptechLite) {
                                    if (responses[5].status == 200) {
                                        result.message = `${result.message }Delivery settings saved!<br>`;
                                    } else {
                                        result.message = `${result.message }Delivery settings failed to save!<br>`;
                                    }
                                    if (responses[6].status == 200) {
                                        result.message = `${result.message }Invoice settings saved!<br>`;
                                    } else {
                                        result.message = `${result.message }Invoice settings failed to save!<br>`;
                                    }
                                }
                                if (responses[7].status == 200) {
                                    result.message = `${result.message }Report settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Report settings failed to save!<br>`;
                                }
                                if (responses[8].status == 200) {
                                    result.message = `${result.message }Lab settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Lab settings failed to save!<br>`;
                                }
                                if (responses[9].status == 200) {
                                    result.message = `${result.message }Master settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Master settings failed to save!<br>`;
                                }
                                if (responses[10].status == 200) {
                                    result.message = `${result.message }Claim settings saved!<br>`;
                                } else {
                                    result.message = `${result.message }Claim settings failed to save!<br>`;
                                }
                                
                                callback(result);
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                let res3 = new Object();
                                res3.message = 'HTTP Error!';
                                if (_debug) {
                                    res3.message = response.data.message;
                                }
                                callback(res3);
                                return;
                            }
                        );
                        return;
                    }
                    if (param.app == 'admin' && param.screen == 'sellerrating') {
                        let apiJSON = {
                            Payload: data
                        };
                        let url = api_map[param.app][param.screen].entity.update.endpoint;
                        let res4 = new Object();
                        res4.status = true;
                        res4.message = 'Success!';
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(res4);
                                } else {
                                    console.log('HTTP ERROR while updating Seller Rating');
                                    res4.status = false;
                                    res4.message = 'Failed!';
                                    callback(res4);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR while retrieving Seller Rating');
                                res4.status = false;
                                res4.message = 'Failed!';
                                callback(res4);
                            }
                        );
                        return;
                    }
                    // if (param.app == 'labs' && param.screen == 'labresult') {
                    //     var apiJSON2 = {
                    //         "Payload": data.labTestResults
                    //     };
                    //     delete data.labTestResults;
                    //     var apiJSON1 = {
                    //         "Payload": data
                    //     }
                    //     //delete apiJSON1.Payload.labTestResults;
                    //     var entity = $http.post(API.BASE_URL_DATA_LABS + "/api/labs/update", apiJSON1);
                    //     var testResults = $http.post(API.BASE_URL_DATA_LABS + "/api/labs/tests/bulksave", apiJSON2);
                    //     console.log(apiJSON1, apiJSON2);
                    //     $q.all([testResults, entity]).then(function success(responses) {
                    //         var result = new Object;
                    //         if (responses[0].status == 200 && responses[1].status == 200) {
                    //             var res = new Object;
                    //             res.status = true;
                    //             res.message = "Success!";
                    //         }
                    //         callback(res);
                    //     }, function errorCallback(response) {
                    //         console.log('HTTP ERROR');
                    //         res.message = "HTTP Error!";
                    //         if (_debug) res.message = response.data.ErrorMessage;
                    //         callback(res);
                    //         return;
                    //     });
                    // }
                    let dimensionalMasters = {
                        counterparty: true,
                        location: true,
                        product: true,
                        company: true,
                        buyer: true,
                        service: true,
                        strategy: true
                    };
                    if (param.app == 'masters' && dimensionalMasters[param.screen]) {
                        if (data.parent !== null) {
                            if (data.parent.id === -1) {
                                data.parent = null;
                            }
                        }
                    }
                    let updateJSON = {
                        Payload: data
                    };
                    let res = {
                        id: 0,
                        message: 'Failed!',
                        status: false
                    };
                    $http.post(api_map[param.app][param.screen].entity.update.endpoint, updateJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                res.status = true;
                                res.message = 'Success!';
                                callback(res);
                            } else {
                                callback(res);
                            }
                            return;
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            res.message = 'HTTP Error!';
                            if (_debug) {
                                res.message = response.data.ErrorMessage;
                            }
                            callback(res);
                            return;
                        }
                    );
                },
                create: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService entity.create called with the following params:');
                    }
                    if (_debug) {
                        console.log(param);
                    }
                    let data;
                    if (typeof param.data !== 'object') {
                        data = JSON.parse(param.data);
                    } else {
                        data = param.data;
                    }
                    if (param.app == 'admin' && param.screen == 'configuration') {
                        param.id = 0;
                        let contract = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/contractConfiguration/update`, {
                            Payload: data.contract
                        });
                        let email = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/emailConfiguration/update`, {
                            Payload: data.email
                        });
                        let general = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/generalConfiguration/update`, {
                            Payload: data.general
                        });
                        let procurement = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/procurementConfiguration/update`, {
                            Payload: data.procurement
                        });
                        let schedule = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/scheduleDashboardConfiguration/update`, {
                            Payload: data.schedule
                        });
                        let delivery = $http.post(`${API.BASE_URL_DATA_ADMIN }/api/admin/deliveryConfiguration/update`, {
                            Payload: data.delivery
                        });
                        console.log("CREATE");
                        $q.all([ contract, email, general, procurement, schedule, delivery ]).then(
                            (responses) => {
                                let result = {};
                                result.status = true;
                                result.message = '';
                                if (responses[0].status == 200) {
                                    result.message = `${result.message }${'Contract settings saved!' + '\r\n'}`;
                                } else {
                                    result.message = `${result.message }${'Contract settings failed to save!' + '\r\n'}`;
                                }
                                if (responses[1].status == 200) {
                                    result.message = `${result.message }${'Email settings saved!' + '\r\n'}`;
                                } else {
                                    result.message = `${result.message }${'Email settings failed to save!' + '\r\n'}`;
                                }
                                if (responses[2].status == 200) {
                                    result.message = `${result.message }${'General settings saved!' + '\r\n'}`;
                                } else {
                                    result.message = `${result.message }${'General settings failed to save!' + '\r\n'}`;
                                }
                                if (responses[3].status == 200) {
                                    result.message = `${result.message }${'Procurement settings saved!' + '\r\n'}`;
                                } else {
                                    result.message = `${result.message }${'Procurement settings failed to save!' + '\r\n'}`;
                                }
                                if (responses[4].status == 200) {
                                    result.message = `${result.message }${'Schedule settings saved!' + '\r\n'}`;
                                } else {
                                    result.message = `${result.message }${'Schedule settings failed to save!' + '\r\n'}`;
                                }
                                if (responses[5].status == 200) {
                                    result.message = `${result.message }${'Delivery settings saved!' + '\r\n'}`;
                                } else {
                                    result.message = `${result.message }${'Delivery settings failed to save!' + '\r\n'}`;
                                }
                                callback(result);
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                let res1 = {};
                                res1.message = 'HTTP Error!';
                                if (_debug) {
                                    res1.message = response.data.message;
                                }
                                callback(res1);
                                return;
                            }
                        );
                        return;
                    }
                    // if (param.app == 'labs' && param.screen == 'labresult') {
                    //     var apiJSON2 = {
                    //         "Payload": data.labTestResults
                    //     };
                    //     delete data.labTestResults;
                    //     var apiJSON1 = {
                    //         "Payload": data
                    //     }
                    //     $http.post(API.BASE_URL_DATA_LABS + "/api/labs/create", apiJSON1).then(function successCallback(response) {
                    //         if (response.status == 200) {
                    //             var res = new Object;
                    //             res.status = true;
                    //             res.id = response.data.upsertedId;
                    //             res.message = 'Succesfully created Lab Result ' + res.id + '!';
                    //             callback(res);
                    //             apiJSON2.Payload.forEach(function(entry) {
                    //                 entry.labResult.id = res.id;
                    //             });
                    //             $http.post(API.BASE_URL_DATA_LABS + "/api/labs/tests/create", apiJSON2).then(function successCallback(response) {
                    //                 if (response.status == 200) {
                    //                     var res = new Object;
                    //                     res.status = true;
                    //                     res.message = 'Succesfully created Lab Test Results!';
                    //                     callback(res);
                    //                 }
                    //             }, function errorCallback(response) {
                    //                 var res = new Object;
                    //                 console.log('HTTP ERROR');
                    //                 res.message = "HTTP Error!";
                    //                 if (_debug) res.message = response.data.ErrorMessage;
                    //                 callback(res);
                    //                 return;
                    //             });
                    //         } else {
                    //             res.status = false;
                    //             res.message = "Failed!";
                    //             callback(res);
                    //             return;
                    //         }
                    //     }, function errorCallback(response) {
                    //         var res = new Object;
                    //         console.log('HTTP ERROR');
                    //         res.message = "HTTP Error!";
                    //         if (_debug) res.message = response.data.ErrorMessage;
                    //         callback(res);
                    //         return;
                    //     });
                    //     return;
                    // }
                    let updateJSON = {
                        Payload: data
                    };
                    let i = 0;
                    let res = {
                        id: 0,
                        message: '',
                        status: false
                    };
                    let dimensionalMasters = {
                        counterparty: true,
                        location: true,
                        product: true,
                        company: true,
                        buyer: true,
                        service: true,
                        strategy: true
                    };
                    if (param.app == 'masters' && dimensionalMasters[param.screen]) {
                        if (data.parent !== null) {
                            if (data.parent.id === -1) {
                                data.parent = null;
                            }
                        }
                    }
                    $http.post(api_map[param.app][param.screen].entity.create.endpoint, updateJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                res.status = true;
                                res.message = 'Success!';
                                res.id = response.data.upsertedId;
                                callback(res);
                                return;
                            }
                            res.status = false;
                            res.message = 'Failed!';
                            callback(res);
                            return;
                        },
                        (response) => {
                            res.status = false;
                            res.message = 'Failed!';
                            if (response.data.ErrorMessage || response.data.errorMessage) {
                                response.data.ErrorMessage ? res.message = response.data.ErrorMessage : res.message = response.data.errorMessage;
                                console.log(`HTTP ERROR ${ response.data.ErrorMessage}`);
                                // if (_debug) res.message = response.data.ErrorMessage;
                            } else {
                                res.message = response.data.exceptionMessage;
                            }
                            callback(res);
                            return;
                        }
                    );
                },
                export: function(param, callback) {
                    console.log('param: ', param);
                    if (_debug) {
                        console.log('$APIService entity.export called with the following params:', param);
                    }
                    // public enum ExportTypeEnum {
                    //     None = 0,
                    //         Excel = 1,
                    //         CSV = 2,
                    //         PDF = 3
                    // }
                    let payload = new Object();
                    switch (param.action) {
                    case 'export_xls':
                        payload.exportType = 1;
                        var file_type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                        break;
                    case 'export_csv':
                        payload.exportType = 2;
                        file_type = 'text/csv';
                        break;
                    case 'export_pdf':
                        payload.exportType = 3;
                        file_type = 'text/csv';
                        break;
                    default:
                        payload.exportType = 2;
                        file_type = 'text/plain';
                    }
                    
                    var timeZoneException = [
                        { old: "America/Godthab", new: "America/Santiago" },
                    ];
                    let timeZone1 = jstz().timezone_name;
                    let findTimezoneException = timeZoneException.find(function(object) {
                        return object.old == timeZone1;
                    });
                    let timeZone = jstz().timezone_name;
                    if (findTimezoneException) {
                        timeZone = findTimezoneException.new;
                    }
                    let d = new Date();
                    let dOffset = d.getTimezoneOffset();
                    payload.Order = null;
                    payload.Filters = param.filters;
                    payload.SearchText = param.search;
                    payload.Pagination = param.pagination || {};
                    payload.columns = new Array();
                    payload.dateTimeOffset = dOffset;
                    payload.timeZone = timeZone;
                    if (param.pageFilters) {
                        payload.PageFilters = {};
                        payload.PageFilters.Filters = [];
                        payload.PageFilters.Filters = param.pageFilters;
                        if (param.pageFilters.sortList) {
	                        payload.SortList = {};
	                        payload.SortList.SortList = param.pageFilters.sortList;
                        }
                    }
                    if (param.filters) {
                        payload.Filters = param.filters;
                    }
                    param.colModel.forEach((entry) => {
                        if (!entry.hidden && !entry.key) {
                            let obj = new Object();
                            obj.dtoPath = entry.name;
                            // customizations for displayName (obj mapped in list, send .DisplayName to export)
                            if (param.screen == 'orderlist') {
                                if (obj.dtoPath == 'productStatus') {
                                    obj.dtoPath = 'productStatus.DisplayName';
                                }
                                if (obj.dtoPath == 'orderStatus') {
                                    obj.dtoPath = 'orderStatus.DisplayName';
                                }
                            }
                            if (param.screen == 'deliveriestobeverified') {
                                if (obj.dtoPath == 'deliveryStatus') {
                                    obj.dtoPath = 'deliveryStatus.displayName';
                                }
                            }
                            if (param.screen == 'delivery') {
                                if (obj.dtoPath == 'orderNo') {
                                    obj.dtoPath = 'order.name';
                                }
                            }
                            if (param.screen == 'deliveries' && param.app == 'invoices') {
                                if (obj.dtoPath == 'orderStatus') {
                                    obj.dtoPath = 'orderStatus.displayName';
                                }
                            }
                            if (param.screen == 'reconlist') {
                                if (obj.dtoPath == 'orderStatus') {
                                    obj.dtoPath = 'orderStatus.displayName';
                                }
                            }
                            if (param.screen == 'requestslist') {
                                if (entry.name == 'requestStatus') {
                                    obj.dtoPath = entry.displayName;
                                }
                                if (entry.name == 'productStatus') {
                                    obj.dtoPath = entry.displayName;
                                }
                            }
                            obj.label = entry.label;
                            if (entry.columnType) {
                                obj.columnType = entry.columnType;
                            }
                            payload.columns.push(obj);
                        }
                    });

                    function downloadURI(uri, name) {
                        let link = document.createElement('a');
                        link.download = name;
                        link.href = uri;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        delete link;
                    }
                    if (param.app == 'alerts') {
                        param.screen = 'alerts';
                    }
                    if (param.screen == 'ordersdelivery') {
                        param.screen = 'ordersdeliverylist';
                    }

                    // set url
                    if(typeof api_map[param.app] == 'undefined') {
                        return;
                    }
                    if(typeof api_map[param.app][param.screen] == 'undefined') {
                        return;
                    }
                    let url = api_map[param.app][param.screen].entity.export.endpoint;


                    // customizations
                    if (param.app == 'contracts' && param.screen == 'contract' && param.table_id ==
                    'masters_counterpartylist') {
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/export`;
                        payload.Filters = [
                            {
                                ColumnName: 'CounterpartyTypes',
                                Value: '2, 11'
                            }
                        ];
                    }
                    // console.log(param.app,param.screen);
                    // debugger;
                    screenLoader.showLoader();
                    $http({
                        url: url,
                        method: 'POST',
                        responseType: 'arraybuffer',
                        data: {
                            Payload: payload
                        },
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': file_type
                        }
                    }).then((data) => {
                        let blob = new Blob([ data.data ], {
                            type: file_type
                        });
                        // console.log(data.headers());
                        // console.log(filename);
                        var filename = data.headers('filename');
                        new File([ data.data ], filename);
                        let objectUrl = URL.createObjectURL(blob);
                        // Create link.
                        var a = document.createElement('a');
                        // Set link on DOM.
                        document.body.appendChild(a);
                        // Set link's visibility.
                        a.style = 'display: none';
                        // Set href on link.
                        a.href = objectUrl;
                        // Set file name on link.
                        a.download = filename;
                        // Trigger click of link.
                        a.click();
                        // Clear.
                        window.URL.revokeObjectURL(objectUrl);
                        // console.log(objectUrl);
                        // window.open(objectUrl);
                    }).finally(() => {
                        screenLoader.hideLoader();
                    });
                    // success(function (data, status, headers, config) {
                    //     var blob = new Blob([data], {type: file_type});
                    //     var objectUrl = URL.createObjectURL(blob);
                    //     window.open(objectUrl);
                    // }).error(function(response){
                    //  return {'isSuccess' : false};
                    // });
                },
                cancel: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService entity.cancel called with the following params:', param);
                    }
                    if (param.app != 'claims') {
                        callback({
                            status: false,
                            message: 'Not implemented yet!'
                        });
                        return;
                    }
                    let res = {
                        status: false,
                        message: 'Error!'
                    };
                    if (param.app == 'claims') {
                        let data;
                        if (typeof param.data !== 'object') {
                            data = JSON.parse(param.data);
                        } else {
                            data = param.data;
                        }
                        let updateJSON = {
                            Payload: data
                        };
                        $http.post(api_map[param.app][param.screen].entity.cancel.endpoint, updateJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    res.status = true;
                                    res.message = 'Success!';
                                    res.id = response.data.upsertedId;
                                    callback(res);
                                    return;
                                }
                                res.status = false;
                                res.message = 'Failed!';
                                callback(res);
                                return;
                            },
                            (response) => {
                                res.status = false;
                                res.message = 'Failed!';
                                console.log(`HTTP ERROR ${ response.data.ErrorMessage}`);
                                if (_debug) {
                                    res.message = response.data.ErrorMessage;
                                }
                                callback(res);
                                return;
                            }
                        );
                    }
                },
                verify: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService entity.verify called with the following params:', param);
                    }
                    if (param.id.length < 1 && !isNaN(param.id)) {
                        callback(false);
                        return;
                    }
                    if (param.app == 'labs') {
                        var apiJSON = JSON.stringify({
                            Payload: {
                                Id: param.id,
                                Status: {
                                    Id: param.status.id,
                                    Name: param.status.name
                                }
                            }
                        });
                        var url = api_map[param.app][param.screen].entity.verify.endpoint;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    let res = {
                                        status: response.data.isSuccess,
                                        message: ''
                                    };
                                    if (response.data.isSuccess) {
                                        res.message = 'Labs verified!';
                                    } else {
                                        res.message = 'Labs verification failed!';
                                    }
                                    callback(res);
                                } else {
                                    callback({
                                        status: false,
                                        message: 'Labs verification failed!'
                                    });
                                    return;
                                }
                            },
                            (response) => {
                                callback({
                                    status: false,
                                    message: response.data.ErrorMessage
                                });
                                return;
                            }
                        ).finally(() => {
                            // Nothing
                        });
                        return;
                    }
                    if (param.app == 'delivery' && param.screen == 'delivery') {
                        var apiJSON;
                        var url;
                        if (param.bulk) {
                            apiJSON = {
                                Payload: param.payload
                            };
                            url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/bulkVerify`;
                        } else {
                            url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/verify`;
                            if (param.verifyAndSave) {
                                apiJSON = {
                                    Payload: JSON.parse(param.payload)
                                };
                            } else {
                                apiJSON = {
                                    Payload: {
                                        DeliveryId: param.id
                                    }
                                };
                            }
                        }
                        screenLoader.showLoader();
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    let res = {
                                        status: response.data.isSuccess,
                                        message: ''
                                    };
                                    if (response.data.isSuccess) {
                                        res.message = 'Deliveries verified!';
                                    } else {
                                        res.message = 'Deliveries verification failed!';
                                    }
                                    callback(res);
                                } else {
                                    callback({
                                        status: false,
                                        message: 'Delivery verification failed!'
                                    });
                                    return;
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback({
                                    status: false,
                                    message: response.data.ErrorMessage
                                });
                                return;
                            }
                        ).finally(() => {
                            screenLoader.hideLoader();
                        });
                        return;
                    }
                    $http.post(api_map[param.app][param.screen].entity.verify.endpoint, `{"Payload":${ param.id }}`).then(
                        (response) => {
                            if (response.status == 200) {
                                let res = {
                                    status: response.data.isSuccess,
                                    message: ''
                                };
                                if (response.data.isSuccess) {
                                    res.message = 'Lab Result verified!';
                                } else {
                                    res.message = 'Lab Result verification failed!';
                                }
                                callback(res);
                                return;
                            }
                            callback({
                                status: false,
                                message: 'Lab Result verification failed!'
                            });
                            return;
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            callback({
                                status: false,
                                message: 'Lab Result verification failed!'
                            });
                            return;
                        }
                    );
                },
                revert: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService entity.revert called with the following params:', param);
                    }
                    if (param.id.length < 1 && !isNaN(param.id)) {
                        callback(false);
                        return;
                    }

                    if (param.app == 'labs') {
                        let apiJSON = JSON.stringify({
                            Payload: {
                                Id: param.id,
                                Status: {
                                    Id: param.status.id,
                                    Name: param.status.name
                                }
                            }
                        });
                        let url = api_map[param.app][param.screen].entity.revert.endpoint;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    let res = {
                                        status: response.data.isSuccess,
                                        message: ''
                                    };
                                    if (response.data.isSuccess) {
                                        res.message = 'Labs verified!';
                                    } else {
                                        res.message = 'Labs verification failed!';
                                    }
                                    callback(res);
                                } else {
                                    callback({
                                        status: false,
                                        message: 'Labs verification failed!'
                                    });
                                    return;
                                }
                            },
                            (response) => {
                                callback({
                                    status: false,
                                    message: response.data.ErrorMessage
                                });
                                return;
                            }
                        ).finally(() => {
                            // Nothing
                        });
                        return;
                    }

                    $http.post(api_map[param.app][param.screen].entity.revert.endpoint, `{"Payload":${ param.id }}`).then(
                        (response) => {
                            if (response.status == 200) {
                                let res = {
                                    status: response.data.isSuccess,
                                    message: ''
                                };
                                if (response.data.isSuccess) {
                                    res.message = 'Lab Result reverted!';
                                } else {
                                    res.message = 'Lab Result revert operation failed!';
                                }
                                callback(res);
                                return;
                            }
                            callback({
                                status: false,
                                message: 'Lab Result revert operation failed!'
                            });
                            return;
                        },
                        (response) => {
                            console.log('HTTP ERROR');
                            callback({
                                status: false,
                                message: 'Lab Result revert operation failed!'
                            });
                            return;
                        }
                    );
                    // callback(false);
                },
                complete: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService entity.complete called with the following params:', param);
                    }
                    if (param.app != 'claims') {
                        callback({
                            status: false,
                            message: 'Not implemented yet!'
                        });
                        return;
                    }
                    let res = {
                        status: false,
                        message: 'Error!'
                    };
                    if (param.app == 'claims') {
                        let data;
                        if (typeof param.data !== 'object') {
                            data = JSON.parse(param.data);
                        } else {
                            data = param.data;
                        }
                        let updateJSON = {
                            Payload: data
                        };
                        $http.post(api_map[param.app][param.screen].entity.complete.endpoint, updateJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    res.status = true;
                                    res.message = 'Success!';
                                    res.id = response.data.upsertedId;
                                    callback(res);
                                    return;
                                }
                                res.status = false;
                                res.message = 'Failed!';
                                callback(res);
                                return;
                            },
                            (response) => {
                                res.status = false;
                                res.message = 'Failed!';
                                console.log(`HTTP ERROR ${ response.data.ErrorMessage}`);
                                if (_debug) {
                                    res.message = response.data.ErrorMessage;
                                }
                                callback(res);
                                return;
                            }
                        );
                    }
                },
                delete: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService entity.delete called with the following params:', param);
                    }
                    if (param.app == 'masters' && param.delete_list == 'contacts') {
                        if (typeof param.data !== 'object') {
                            var data = JSON.parse(param.data);
                        } else {
                            var data = param.data;
                        }
                        let updateJSON = {
                            Payload: data
                        };

                        let url = api_map[param.app].contact.entity.delete.endpoint;

                        console.log(param);

                        if (param.screen == 'vessel') {
                            url = `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/deleteContact`;
                        }
                        if (param.screen == 'service') {
                            url = `${API.BASE_URL_DATA_MASTERS }/api/masters/services/deleteContact`;
                        }
                        if (param.screen == 'counterparty') {
                            url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/deleteContact`;
                        }

                        $http.post(url, updateJSON).then(
                            (response) => {
                                console.log(response);
                                if (response.status == 200) {
                                    var res = {};
                                    res.status = true;
                                    res.message = 'Contact deleted successfully!';
                                    callback(res);
                                    return;
                                }
                                res = {};
                                res.status = false;
                                res.message = 'Contact delete error!';
                                callback(res);
                                return;
                            },
                            (response) => {
                                var res = {};
                                res.status = false;
                                res.message = 'Contact delete error!';
                                console.log(`HTTP ERROR ${ response.data.ErrorMessage}`);
                                if (_debug) {
                                    res.message = response.data.ErrorMessage;
                                }
                                callback(res);
                                return;
                            }
                        );
                    }
                }
            },
            dropdown: {
                get: function(param, callback) {
                    // if (_debug) console.log("$APIService dropdown.get called with:", param);
                    // Custom implementations
                    let apiJSON;
                    let url;
                    if (param.app == 'admin' && param.screen == 'configuration' && param.field.masterSource == 'Screen') {
                        apiJSON = {
                            Payload: false
                        };
                        url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/infrastructure/static/ModuleScreen`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    console.log(response.data.payload);
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'admin' && param.screen == 'configuration' && param.field.masterSource == 'Application') {
                        apiJSON = {
                            Payload: false
                        };
                        url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/infrastructure/static/ModuleScreen`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'admin' && param.screen == 'configuration' && param.field.masterSource == 'TransactionStatus') {
                        console.log(param);
                        apiJSON = {
                            Payload: {
                                Application: {
                                    Id: param.field.application.application.id,
                                    Name: param.field.application.application.name
                                },
                                Screen: {
                                    Id: param.field.transaction.id,
                                    Name: param.field.transaction.name
                                }
                                // "Application": { "Id": 3, "Name": "Procurement" },
                                // "Screen": { "Id": 5, "Name": "Pre Request" }
                            }
                        };
                        url = `${API.BASE_URL_DATA_IMPORTEXPORT }/api/infrastructure/static/StatusByScreenAndApplication`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'alerts' && param.screen == 'alerts') {
                        console.log(param.field.masterSource);
                        url = api_map.alerts.alerts.entity.get.endpointDrop + param.field.masterSource;
                        $http.post(url).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'contracts' && param.screen == 'contract' && (param.field.masterSource == 'contractAgreementTypesList' || param.field.masterSource == 'AgreementType')) {
                        console.log(param.field.masterSource);
			            let payload = { Payload:{ Order:null, PageFilters:{ Filters:[] }, SortList:{ SortList:[] }, Filters:[], SearchText:null, Pagination:{ Skip:0, Take:10000 } } };
			            url = `${API.BASE_URL_DATA_MASTERS }/api/masters/agreementType/individualLists`;
                        $http.post(url, payload).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload.contractAgreementTypesList);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'claims' && param.screen == 'claims' && param.field.masterSource == 'claimSubtype') {
                        var decodeHtmlEntity = function(str) {
                            return str.replace(/&#(\d+);/g, function(match, dec) {
                                return String.fromCharCode(dec);
                            });
                        };

                        // debugger;
                        if (param.field.param.ClaimTypeName == 'Quantity') {
                            apiJSON = {
                                Payload: {
                                    OrderId: param.field.param.OrderId ? param.field.param.OrderId : null,
                                    DeliveryProductId: param.field.param.DeliveryProductId ? param.field.param.DeliveryProductId : null,
                                    LabResultId: param.field.param.LabResultId ? param.field.param.LabResultId : null,
                                    ClaimTypeId: param.field.param.ClaimTypeId ? param.field.param.ClaimTypeId : null,
                                    OrderProductId: param.field.param.OrderProductId ? param.field.param.OrderProductId : null
                                }
                            };
                            url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/getQuantitySubtypes`;
                            $http.post(url, apiJSON).then(
                                (response) => {
                                    if (response.status == 200) {
                                        let result = new Object();
                                        response.data.payload.forEach((entry) => {
                                            result[entry.specParameter.id] = {
                                                id: entry.specParameter.id,
                                                name:  decodeHtmlEntity(_.unescape(entry.specParameter.name)),
                                                isQuantitySubtype: entry.isQuantitySubtype,
                                                payload: entry
                                            };
                                        });
                                        callback(result);
                                    } else {
                                        console.log('ERROR');
                                        callback(false);
                                        return;
                                    }
                                },
                                (response) => {
                                    console.log('HTTP ERROR');
                                    callback(false);
                                    return;
                                }
                            );
                        }
                        if (param.field.param.ClaimTypeName == 'Quality' || param.field.param.ClaimTypeName == 'Compliance') {
                            apiJSON = {
                                Payload: {
                                    OrderId: param.field.param.OrderId ? param.field.param.OrderId : null,
                                    DeliveryProductId: param.field.param.DeliveryProductId ? param.field.param.DeliveryProductId : null,
                                    LabResultId: param.field.param.LabResultId ? param.field.param.LabResultId : null,
                                    ClaimTypeId: param.field.param.ClaimTypeId ? param.field.param.ClaimTypeId : null
                                }
                            };
                            url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/getQualitySubtypes`;
                            $http.post(url, apiJSON).then(
                                (response) => {
                                    if (response.status == 200) {
                                        let result = new Object();
                                        response.data.payload.forEach((entry) => {
                                            result[entry.specParameter.id] = {
                                                id: entry.specParameter.id,
                                                name: decodeHtmlEntity(_.unescape(entry.specParameter.name)),
                                                payload: {
                                                    specParameter: entry.specParameter,
                                                    labTestResultId: entry.labTestResultId,
                                                    deliveryQualityParameterId: entry.deliveryQualityParameterId,
                                                    specParameterUom: entry.specParameterUom,
                                                    minValue: entry.minValue,
                                                    maxValue: entry.maxValue,
                                                    testValue: entry.testValue,
                                                    id: null,
                                                    isDeleted: false
                                                }
                                            };
                                        });
                                        callback(result);
                                    } else {
                                        console.log('ERROR');
                                        callback(false);
                                        return;
                                    }
                                },
                                (response) => {
                                    console.log('HTTP ERROR');
                                    callback(false);
                                    return;
                                }
                            );
                        }
                        return;
                    }
                    // End Custom implementation
                    // Filter implementations
                    if (typeof param.field.Filter != 'undefined') {
                        if (param.app == 'labs' && param.screen == 'labresult') {
                            if (param.field.Unique_ID == 'delivery') {
                                let invalidFilter = false;
                                if (param.field.Filter) {
                                    $.each(param.field.Filter, (k, v) => {
                                        if (v.ColumnName == 'OrderId' && v.Value == 0) {
                                            invalidFilter = true;
                                        }
                                    });
                                }
                                if (invalidFilter) {
                                    return false;
                                }
                                apiJSON = {
                                    Payload: {
                                        Order: null,
                                        Filters: param.field.Filter,
                                        Pagination: null
                                    }
                                };
                                if (param.app == 'labs') {
                                    url = `${API.BASE_URL_DATA_LABS }/api/labs/getDeliveryLookup`;
                                } else {
                                    url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/getDeliveryLookup`;
                                }
                                $http.post(url, apiJSON).then((response) => {
                                    if (response.status == 200) {
                                        let result = [];
                                        response.data.payload.forEach((entry) => {
                                            result.push({
                                                id: entry.deliveryNo.id,
                                                name: entry.deliveryNo.name,
                                                payload: {
                                                    barge: entry.barge
                                                }
                                            });
                                        });
                                        callback(result);
                                    } else {
                                        console.log('HTTP ERROR');
                                        callback([
                                            {
                                                id: -1,
                                                name: 'Error retrieving deliveries'
                                            }
                                        ]);
                                    }
                                });
                            }
                            if (param.field.Unique_ID == 'product') {
                                apiJSON = {
                                    Payload: {
                                        Order: null,
                                        Filters: param.field.Filter,
                                        Pagination: null
                                    }
                                };

                                var hasOrderId = true;
                                $.each(param.field.Filter, (k, v) => {
                                	if (v.ColumnName == 'OrderId' && v.Value == 0) {
		                                var hasOrderId = false;
                                	}
                                });
                                if (!hasOrderId) {
                            		return;
                                }

                                url = `${API.BASE_URL_DATA_LABS }/api/labs/getProductDropdown`;
                                $http.post(url, apiJSON).then((response) => {
                                    if (response.status == 200) {
                                        let result = [];
                                        response.data.payload.forEach((entry) => {
                                            result.push({
                                                id: entry.product.id,
                                                name: entry.product.name,
                                                physicalSupplier: entry.pshysicalSupplier,
                                                payload: {
                                                    orderProductId: entry.orderProductId,
                                                    deliveryProductId: entry.deliveryProductId,
                                                    productTypeId: entry.productType.id
                                                }
                                            });
                                        });
                                        callback(result);
                                    } else {
                                        console.log('HTTP ERROR');
                                        callback([
                                            {
                                                id: -1,
                                                name: 'Error retrieving products'
                                            }
                                        ]);
                                    }
                                });
                            }
                            return;
                        }
                        if (param.app == 'contracts' && param.screen == 'contract') {
                            if (param.field.Unique_ID == 'primaryContact') {
                                apiJSON = {
                                    Payload: {
                                        Filters: [
                                            {
                                                ColumnName: 'SellerId',
                                                Value: param.field.Filter[0].Value
                                            },
                                            {
                                                ColumnName: 'ContractId',
                                                Value: parseFloat($state.params.entity_id)
                                            }
                                        ]
                                    }
                                };
                                url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/contactBySeller`;
                                $http.post(url, apiJSON).then((response) => {
                                    if (response.status == 200) {
                                        callback(response.data.payload);
                                    } else {
                                        console.log('HTTP ERROR');
                                        callback([
                                            {
                                                id: -1,
                                                name: 'Error retrieving contacts'
                                            }
                                        ]);
                                    }
                                });
                            }
                            return;
                        }
                        if (param.app == 'claims' && param.screen == 'claims') {
                            if (param.field.Unique_ID == 'orderDetails.deliveryNo') {
                                apiJSON = {
                                    Payload: {
                                        Order: null,
                                        Filters: param.field.Filter,
                                        Pagination: null
                                    }
                                };
                                url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/getDeliveryLookup`;
                                $http.post(url, apiJSON).then((response) => {
                                    if (response.status == 200) {
                                        let result = [];
                                        response.data.payload.forEach((entry) => {
                                            result.push({
                                                id: entry.deliveryNo.id,
                                                name: entry.deliveryNo.name,
                                                payload: {
                                                    orderDetails: {
                                                        deliveryDate: entry.deliveryDate,
                                                        vessel: entry.vessel,
                                                        port: entry.port,
                                                        counterparty: entry.counterparty
                                                    }
                                                }
                                            });
                                        });
                                        callback(result);
                                    } else {
                                        console.log('HTTP ERROR');
                                        callback([
                                            {
                                                id: -1,
                                                name: 'Error retrieving deliveries'
                                            }
                                        ]);
                                    }
                                });
                            }
                            if (param.field.Unique_ID == 'orderDetails.labResult') {
                                apiJSON = {
                                    Payload: {
                                        Order: null,
                                        Filters: param.field.Filter,
                                        Pagination: null
                                    }
                                };
                                url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/getLabResultLookup`;
                                $http.post(url, apiJSON).then((response) => {
                                    if (response.status == 200) {
                                        let result = [];
                                        response.data.payload.forEach((entry) => {
                                            result.push({
                                                id: entry.labResult.id,
                                                name: entry.labResult.name,
                                                payload: {
                                                    orderDetails: {
                                                        vessel: entry.vessel,
                                                        port: entry.port,
                                                        counterparty: entry.counterparty
                                                    }
                                                }
                                            });
                                        });
                                        callback(result);
                                    } else {
                                        console.log('HTTP ERROR');
                                        callback([
                                            {
                                                id: -1,
                                                name: 'Error retrieving deliveries'
                                            }
                                        ]);
                                    }
                                });
                            }
                            if (param.field.Unique_ID == 'orderDetails.product') {
                                apiJSON = {
                                    Payload: {
                                        Order: null,
                                        Filters: param.field.Filter,
                                        Pagination: null
                                    }
                                };

                                url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/getProductDropdown`;
                                if (param.field.Filter[0].Value != 0) {
                                    // console.log(1)
                                    $http.post(url, apiJSON).then((response) => {
                                        if (response.status == 200) {
                                            let result = [];
                                            response.data.payload.forEach((entry) => {
                                                result.push({
                                                    id: entry.product.id,
                                                    name: entry.product.name,
                                                    pricePrecision: entry.pricePrecision,
                                                    payload: {
                                                        orderDetails: {
                                                            orderProductId: entry.orderProductId,
                                                            deliveryProductId: entry.deliveryProductId,
                                                            orderPrice: entry.orderPrice,
                                                            currency: entry.currency,
                                                            physicalSupplier: entry.physicalSupplier,
                                                            claimQuantity : entry.bdnQuantityAmount,
                                                            claimQuantityUom : entry.bdnUom
                                                        },
                                                        claimDetails: {
                                                            bdnQuantity: entry.bdnQuantityAmount,
                                                            bdnQuantityUom : entry.bdnUom,
                                                            vesselQuantity: entry.vesselQuantityAmount,
                                                            vesselQuantityUom : entry.vesselQuantityUom
                                                        },
                                                        productTypeId: entry.productType.id
                                                    }
                                                });
                                            });
                                            callback(result);
                                        } else {
                                            console.log('HTTP ERROR');
                                            callback([
                                                {
                                                    id: -1,
                                                    name: 'Error retrieving deliveries'
                                                }
                                            ]);
                                        }
                                    });
                                }
                            }
                            return;
                        }
                        console.log('Filter dropdown unimplemented!');
                        callback([
                            {
                                id: -1,
                                name: 'Not implemented!'
                            }
                        ]);
                        return;
                    }
                    // End Filter implementations
                    if (typeof param.field.UOMType != 'undefined') {
                        if (typeof $listsCache[param.field.UOMType] != 'undefined') {
                            callback($listsCache[param.field.UOMType]);
                        } else {
                            console.log('$APIService dropdown.get failed for UOMType:', param.field.UOMType);
                            callback([
                                {
                                    id: -1,
                                    name: 'Not implemented!'
                                }
                            ]);
                        }
                        return;
                    }
                    if (typeof $listsCache[param.field.masterSource] != 'undefined') {
                        callback($listsCache[param.field.masterSource]);
                    } else {
                        console.log('$APIService dropdown.get failed for masterSource:', param.field.masterSource);
                        callback([
                            {
                                id: -1,
                                name: 'Not implemented!'
                            }
                        ]);
                    }

                    if (param.dropdown == 'exchangerate-company') {
                        apiJSON = {
                            Payload: param.unique_id
                        };
                        $http.post(api_map.masters.company.entity.get.endpoint, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload.currencyId);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    return;
                },
                custom: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService dropdown.custom called with params:', param);
                    }
                    if (param.app == 'masters' && param.screen == 'systeminstrument') {
                        let apiJSON = {
                            Payload: param.MarketInstrument
                        };
                        let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/marketinstruments/get`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    let result = new Object();
                                    result.calendar = response.data.payload.calendar.name;
                                    result.uom = response.data.payload.uom.name;
                                    result.currency = response.data.payload.currency;
                                    callback(result);
                                } else {
                                    console.log('ERROR');
                                    callback(false);
                                    return;
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                                return;
                            }
                        );
                    }
                    return;
                },
                lookup: function(param, callback) {
                    // if (_debug) console.log("$APIService dropdown.lookup called for masterSource " + param.field.masterSource + " with params:", param);
                    if (typeof param.field.Filter != 'undefined') {
                        if (param.app == 'masters' && (param.screen == 'vessel' || param.screen == 'product') && param.field.masterSource == 'SpecGroup') {
                            var apiJSON = {
                                Payload: {
                                    Order: null,
                                    Filters: param.field.Filter,
                                    Pagination: null
                                }
                            };
                            var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/products/getSpec`;
                            $http.post(url, apiJSON).then( 
                                (response) => {
                                    if (response.status == 200) {
						            	filteredIsDeleted = _.filter(response.data.payload, function(o) { 
											return o.isDeleted == false; 
										});
                                        callback(filteredIsDeleted);
                                    } else {
                                        console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                        callback([
                                            {
                                                id: -1,
                                                name: 'API Error!'
                                            }
                                        ]);
                                    }
                                },
                                (response) => {
                                    console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            );
                            return;
                        }
                        if (param.app == 'masters' && param.screen == 'documenttype' && param.field.masterSource == 'DocumentTypeTemplates') {
                            var url = `${API.BASE_URL_DATA_EMAIL }/api/mail/templates/listByTransactionType`;
                            var apiJSON = {
                                Payload: {
                                    pagination: {},
                                    Filters: param.field.Filter
                                }
                            };
                            $http.post(url, apiJSON).then(
                                (response) => {
                                    console.log(response);
                                    if (response.status == 200) {
                                        callback(response.data.payload);
                                    } else {
                                        callback(false);
                                    }
                                },
                                (response) => {
                                    console.log('HTTP ERROR');
                                    console.log(response);
                                    callback(false);
                                }
                            );
                            return;
                        }
                        //Port Call get options
                        if (param?.field?.masterSource == 'PortCall') {
                            var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/vesselSchedules/list`;
                            var apiJSON = {
                                "IsValid": false,
                                "TenantMongoDbUrl": null,
                                "TenantId": null,
                                "IsAuthorized": false,
                                "Payload": {
                                  "Order": null,
                                  "Filters": [],
                                  "Pagination": {
                                    "Skip": 0,
                                    "Take": 25
                                  }
                                }
                            }
                            apiJSON.Payload.Filters = param.field.Filter;
                            $http.post(url, apiJSON).then(
                                (response) => {
                                    console.log(response);
                                    if (response.status == 200) {
                                        callback(response.data.payload);
                                    } else {
                                        callback(false);
                                    }
                                },
                                (response) => {
                                    console.log('HTTP ERROR');
                                    console.log(response);
                                    callback(false);
                                }
                            );
                            return;
                        }
                        // if (param.app == 'labs' && param.screen == 'labresult' && param.field.masterSource == 'Surveyor') {
                        //     var apiJSON = {
                        //         "Payload": {
                        //             "Order": null,
                        //             "PageFilters":{"Filters":param.field.Filter},
                        //             "Filters": param.field.Filter,
                        //             "Pagination": {"Skip":0,"Take":99}
                        //         }
                        //     };
                        //     // {"Payload":{"Order":null,"PageFilters":{"Filters":[]},"Filters":[],"SearchText":null,"Pagination":{"Skip":0,"Take":25}}}
                        //             // "Filters": param.field.Filter,
                        //     var url = API.BASE_URL_DATA_MASTERS + '/api/masters/counterparties/listMasters';
                        //     $http.post(url, apiJSON).then(function success(response) {
                        //         if (response.status == 200) {
                        //             callback(response.data.payload);
                        //         } else {
                        //             console.log("$APIService dropdown.lookup failed for parameter ", param.field.masterSource);
                        //             callback([{
                        //                 "id": -1,
                        //                 "name": "API Error!"
                        //             }]);
                        //         }
                        //     }, function failed(response) {
                        //         console.log("$APIService dropdown.lookup failed for parameter ", param.field.masterSource);
                        //         callback([{
                        //             "id": -1,
                        //             "name": "HTTP Error!"
                        //         }]);
                        //     });
                        //     return;
                        // }
                        if (param.field.clc_id == 'admin_templates') {
                            var apiJSON = {
                                Payload: {
                                    Order: null,
                                    Filters: param.field.Filter,
                                    Pagination: {
                                        Skip: 0,
                                        Take: 999
                                    }
                                }
                            };
                            var url = api_map.admin.templates.entity.list.endpoint;
                            $http.post(url, apiJSON).then(
                                (response) => {
                                    if (response.status == 200) {
                                        callback(response.data.payload);
                                    } else {
                                        console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                        callback([
                                            {
                                                id: -1,
                                                name: 'API Error!'
                                            }
                                        ]);
                                    }
                                },
                                (response) => {
                                    console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            );
                            return;
                        }
                        callback([
                            {
                                id: -1,
                                name: 'Filter not implemented yet!'
                            }
                        ]);
                        console.log(`$APIService dropdown.lookup filter ${ param.field.Filter } has not been implemented!`);
                        return;
                    }
                    // Custom implementations
                    if (param.app == 'alerts' && param.screen == 'alerts') {
                        console.log(param.field.masterSource);
                        var url = api_map.alerts.alerts.entity.get.endpointDrop + param.field.masterSource;
                        $http.post(url).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'invoices' && param.screen == 'invoice' && param.field.clc_id == 'masters_counterpartylist_seller') {
                        var apiJSON = {
                            Payload: {
                                Filters: [
                                    {
                                        ColumnName: 'CounterpartyTypes',
                                        Value: 2
                                    }
                                ]
                            }
                        };
                        var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypesAutocomplete`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                        return;
                    }
                    // console.log(param)
                    if (param.app == 'masters' && param.screen == 'barge' && param.field.clc_id == 'masters_counterpartylist_barge') {
                        var apiJSON = {
                            Payload: {
                                Filters: [
                                    {
                                        ColumnName: 'CounterpartyTypes',
                                        Value: 7
                                    }
                                ]
                            }
                        };
                        var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypesAutocomplete`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                        return;
                    }
                    if (param.field.clc_id == 'masters_counterpartylist_labs') {
                        var apiJSON = {
                            Payload: {
                                Filters: [
                                    {
                                        ColumnName: 'CounterpartyTypes',
                                        Value: 8
                                    }
                                ]
                            }
                        };
                        var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypesAutocomplete`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                        return;
                    }
                    if (param.field.clc_id == 'masters_counterpartylist_customers') {
                        var apiJSON = {
                            Payload: {
                                Filters: [
                                    {
                                        ColumnName: 'CounterpartyTypes',
                                        Value: 4
                                    }
                                ]
                            }
                        };
                        var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypesAutocomplete`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                        return;
                    }
                    if (param.app == 'delivery' && param.screen == 'delivery' && param.field.masterSource == 'OrderList') {
                        var apiJSON = {
                            UIFilters: {
                                RequestStatuses: '13,19'
                            },
                            Payload: {}
                        };
                        var url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getForTransactionForSearch`;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                        return;
                    }
                    if (param.app == 'masters' && param.field.masterSource == 'OperatingCompany') {
                        var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/companies/specificCompanyForSearch`;
                        var apiJSON = {
                            Payload: {
                                Filters: [
                                    {
                                        ColumnName: 'CompanyTypeId',
                                        Value: 2
                                    }
                                ]
                            }
                        };
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                    }
                    if (param.app == 'claims' && param.field.masterSource == 'Order') {
                        $http.post(api_map[param.app][param.screen].lookup[param.field.masterSource].endpoint, api_map[param.app][param.screen].lookup[param.field.masterSource].json).then((response) => {
                            if (response.status == 200) {
                                callback(response.data.payload);
                            } else {
                                console.log('HTTP ERROR');
                                callback([
                                    {
                                        id: -1,
                                        name: `Error retrieving field ${ param.field.masterSource}`
                                    }
                                ]);
                            }
                        });
                        return;
                    }
                    if ((param.app == 'masters' || param.app == 'admin' || param.app == 'alerts' || param.app == 'claims') && param.field.masterSource == 'Users') {
                        var apiJSON = {
                            Payload: ''
                        };
                        if (param.app == 'claims') {
                            apiJSON = {
                                Payload: true
                            };
                        }

                        url = api_map.admin.user.listForSearch;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                    callback([
                                        {
                                            id: -1,
                                            name: 'API Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                        return;
                    }
                    if (param.app == 'labs' && param.screen == 'labresult' && param.field.clc_id == 'masters_counterpartylist_labs') {
                        url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        var apiJSON = {
                            Payload: {
                                Order: null,
                                PageFilters: {
                                    Filters: []
                                },
                                Filters: [
                                    {
                                        ColumnName: 'CounterpartyTypes',
                                        Value: 8
                                    }
                                ],
                                SearchText: null,
                                Pagination: {
                                    Skip: 0,
                                    Take: 25
                                }
                            }
                        };
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                    callback([
                                        {
                                            id: -1,
                                            name: 'API Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                        return;
                    }
                    if (param.app == 'masters' && param.field.masterSource && param.field.masterSource.includes('Parent')) {
                        var apiJSON = {
                            Payload: {}
                        };
                        var url = '';
                        if (param.field.masterSource == 'ParentCounterparty') {
                            url = api_map.masters.counterparty.entity.getParentForSearch.endpoint;
                        }
                        if (param.field.masterSource == 'ParentLocation') {
                            url = api_map.masters.location.entity.getParentForSearch.endpoint;
                        }
                        if (param.field.masterSource == 'ParentProduct') {
                            url = api_map.masters.product.entity.getParentForSearch.endpoint;
                        }
                        if (param.field.masterSource == 'ParentCompany') {
                            url = api_map.masters.company.entity.getParentForSearch.endpoint;
                        }
                        if (param.field.masterSource == 'ParentStrategy') {
                            url = api_map.masters.strategy.entity.getParentForSearch.endpoint;
                        }
                        if (param.field.masterSource == 'ParentService') {
                            url = api_map.masters.service.entity.getParentForSearch.endpoint;
                        }
                        if (param.field.masterSource == 'ParentBuyer') {
                            url = api_map.masters.buyer.entity.getParentForSearch.endpoint;
                        }
                        if (url != '') {
                            $http.post(url, apiJSON).then(
                                (response) => {
                                    if (response.data) {
                                        let res = [];
                                        res.push({
                                            id: -1,
                                            name: 'No Parent'
                                        });
                                        response.data.payload.forEach((entry) => {
                                            let temp = {
                                                id: entry.id,
                                                name: entry.name
                                            };
                                            res.push(temp);
                                            delete temp;
                                        });
                                        callback(res);
                                    } else {
                                        callback({
                                            id: 0,
                                            name: 'Error retrieving parents'
                                        });
                                    }
                                },
                                (response) => {
                                    console.log('HTTP ERROR');
                                    callback(false);
                                    return;
                                }
                            );
                        }
                        return;
                    }
                    if (param.app == 'labs' && param.field.masterSource == 'Order') {
                        $http.post(api_map[param.app][param.screen].lookup[param.field.masterSource].endpoint, api_map[param.app][param.screen].lookup[param.field.masterSource].json).then((response) => {
                            if (response.status == 200) {
                                callback(response.data.payload);
                            } else {
                                console.log('HTTP ERROR');
                                callback([
                                    {
                                        id: -1,
                                        name: `Error retrieving field ${ param.field.masterSource}`
                                    }
                                ]);
                            }
                        });
                        return;
                    }
                    if (param.app == 'admin' && param.screen == 'users' && param.field.masterSource == 'roles') {
                        var apiJSON = {
                            Payload: true
                        };
                        // urls = JSON.stringify(url)
                        var postUrl = api_map[param.app].role.entity.lookup.endpoint;
                        $http.post(postUrl, apiJSON).then(
                            (response) => {
                                console.log(response);
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                console.log(response);
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'admin' && param.screen == 'users' && (param.field.masterSource == 'Company' || param.field.masterSource == 'Buyer' || param.field.masterSource == 'Vessel')) {
                        var apiJSON = {
                            Payload: {
                                pagination: {}
                            }
                        };
                        // urls = JSON.stringify(url)
                        var postUrl = api_map[param.app].users.entity.lookup[param.field.masterSource].endpoint;
                        $http.post(postUrl, apiJSON).then(
                            (response) => {
                                console.log(response);
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                console.log(response);
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'contracts' && param.screen == 'contract' && param.field.masterSource == 'Seller') {
                        var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/counterparties/listByTypes`;
                        var apiJSON = {
                            Payload: {
                                pagination: {},
                                Filters: [
                                    {
                                        ColumnName: 'CounterpartyTypes',
                                        Value: '2,11'
                                    }
                                ]
                            }
                        };
                        $http.post(url, apiJSON).then(
                            (response) => {
                                console.log(response);
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                console.log(response);
                                callback(false);
                            }
                        );
                        return;
                    }
                    if (param.app == 'masters' && param.screen == 'documenttype' && param.field.masterSource == 'DocumentTypeTemplates') {
                        var url = `${API.BASE_URL_DATA_EMAIL }/api/mail/templates/listByTransactionType`;
                        var apiJSON = {
                            Payload: {
                                pagination: {},
                                Filters: param.field.filter
                            }
                        };
                        $http.post(url, apiJSON).then(
                            (response) => {
                                console.log(response);
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback(false);
                                }
                            },
                            (response) => {
                                console.log('HTTP ERROR');
                                console.log(response);
                                callback(false);
                            }
                        );
                        return;
                    }
                    let lookupSearch = {
                        strategy: true,
                        specparameter: true,
                        location: true
                    };
                    if (param.app == 'masters' && lookupSearch[param.field.masterSource]) {
                        var apiJSON = {
                            Payload: {}
                        };
                        var url = api_map.masters[param.field.masterSource].entity.getForTransactionForSearch.endpoint;
                        $http.post(url, apiJSON).then(
                            (response) => {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            },
                            (response) => {
                                console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                callback([
                                    {
                                        id: -1,
                                        name: 'HTTP Error!'
                                    }
                                ]);
                            }
                        );
                        return;
                    }
                    if (param.app == 'procurement') {
                        // debugger;
                        var apiJSON = {
                            Payload: {
                                Order: null,
                                PageFilters: {
                                    Filters: []
                                },
                                SortList: {
                                    SortList: []
                                },
                                Filters: [],
                                SearchText: null,
                                Pagination: {
                                    Skip: 0,
                                    Take: 25
                                }
                            }
                        };
                        if (typeof param.field.filters != 'undefined') {
                            apiJSON.Payload.filters = {};
                            apiJSON.Payload.filters = angular.copy(param.field.filters);
                        }
                        if (typeof param.field.Filters != 'undefined') {
                            apiJSON.Payload.Filters = {};
                            apiJSON.Payload.Filters = angular.copy(param.field.Filters);
                        }
                        if(param.field.Name == "usersList") {
                            apiJSON.Payload.Pagination.Take = 999;
                        }
                        // debugger;

                        // 0. define masters list url map based on masterSource
                        let urlMap = {
                            VesselList: `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/listMasters`,
                            ServiceList: `${API.BASE_URL_DATA_MASTERS }/api/masters/services/listMasters`,
                            masters_locations: `${API.BASE_URL_DATA_MASTERS }/api/masters/locations/listVessel`,
                            procurement_buyerslist: `${API.BASE_URL_DATA_MASTERS }/api/masters/buyer/list`,
                            contractplanning_contractlist: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/searchForPopup`,
                            order_contract: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getContractProductForOrderProduct`,
                            order_contract_autocomplete: `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getAutocompleteContractProductForOrderProduct`,
                            admin_users: `${API.BASE_URL_DATA_ADMIN }/api/admin/user/list`
                        };

                        if (param.field.Name == "usersList") {
                            apiJSON.Payload.PageFilters = {
                                Filters : [{"columnValue":"IsDeleted","ColumnType":"Bool","isComputedColumn":false,"ConditionValue":"=","Values":["0"],"FilterOperator":0}]
                            }; 
                        }
                        // console.log(param);

                        if (typeof urlMap[param.field.masterSource] != 'undefined') {
                            // 1. if url is defined, make call and get options
                            var url = urlMap[param.field.masterSource];

                            $http.post(url, apiJSON).then(
                                (response) => {
                                    // debugger;
                                    if (response.status == 200) {
                                        callback(response.data.payload);
                                    } else {
                                        callback([
                                            {
                                                id: -1,
                                                name: 'HTTP Error!'
                                            }
                                        ]);
                                    }
                                },
                                (response) => {
                                    console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                                    callback([
                                        {
                                            id: -1,
                                            name: 'HTTP Error!'
                                        }
                                    ]);
                                }
                            );
                            return;
                        } else if (typeof $listsCache[param.field.masterSource] != 'undefined') {
                            // 2. check for options in lists cache
                            callback($listsCache[param.field.masterSource]);
                        } else {
                            // 3. nothing found :(
                            console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                            callback([
                                {
                                    id: -1,
                                    name: 'No options defined! Please fix!'
                                }
                            ]);
                        }
                    }

                    if (param.app == 'invoices' && param.screen == 'treasuryreport' && param.field.Name == 'Seller') {
                    	// merge sellers and Service providers
                    	var mergedList = $listsCache.Seller.concat($listsCache.Sludge);
                        callback(mergedList);
                        return;
                    }
                    if (param.app == 'masters' && param.screen == 'vessel' && param.field.masterSource == 'ProductFiltered') {
                    	// merge sellers and Service providers
                    	$listsCache.VesselProductFilteredType = angular.copy($listsCache.Product);
                        callback($listsCache.VesselProductFilteredType);
                        return;
                    }


                    // End Custom implementations
                    if (typeof $listsCache[param.field.masterSource] != 'undefined') {
                        callback($listsCache[param.field.masterSource]);
                    } else {
                        console.log('$APIService dropdown.lookup failed for parameter ', param.field.masterSource);
                        callback([
                            {
                                id: -1,
                                name: 'No options defined! Please fix!'
                            }
                        ]);
                    }
                    return;
                }
            },
            labs: {
                labsPreviewEmail: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_LABS }/api/labs/preview`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to contractPreviewEmail!');
                        }
                    );
                },
                getLabInfoForOrder: function(param, callback) {
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_LABS }/api/labs/getLabInfoForOrder`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                let res = {};
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                console.log('Error getLabInfoForOrder');
                                callback(false);
                            }
                        },
                        (response) => {
                            console.log('Error get getLabInfoForOrder');
                            callback(response.data);
                        }
                    );
                },
                deleteLab: function(param, callback) {
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_LABS }/api/labs/delete`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = {};
                                // res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                console.log('Error deleteLab');
                                var res = {};
                                res.status = false;
                                res.errorMessage = response.data.ErrorMessage;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = {};
                            res.status = false;
                            res.errorMessage = response.data.ErrorMessage;
                            callback(res);
                            console.log('Error get deleteLab');
                        }
                    );
                },
                invalid_lab: function(param, callback) {
                    let url = `${API.BASE_URL_DATA_LABS }/api/labs/invalid`;
                    $http.post(url, param).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = {};
                                // res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                console.log('Error invalid lab');
                                var res = {};
                                res.status = false;
                                res.errorMessage = response.data.ErrorMessage;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = {};
                            res.status = false;
                            res.errorMessage = response.data.ErrorMessage;
                            callback(res);
                            console.log('Error invalid lab');
                        }
                    );
                },
                verify_lab: function(param, callback) {
                    let url = `${API.BASE_URL_DATA_LABS }/api/labs/verify`;
                    let apiJSON = {
                        Payload: param
                    };
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = {};
                                // res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                console.log('Error verify lab');
                                var res = {};
                                res.status = false;
                                res.errorMessage = response.data.ErrorMessage;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = {};
                            res.status = false;
                            res.errorMessage = response.data.ErrorMessage;
                            callback(res);
                            console.log('Error verify lab');
                        }
                    );
                }
            },
            invoice: {
                createfromdelivery: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService invoice.createfromdelivery called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/newFromDelivery`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Invoice Created!';
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not create invoice!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not create invoice!';
                            callback(res);
                            console.log('HTTP ERROR while trying to create invoice!');
                        }
                    );
                },
                cancelInvoice: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.cancelInvoice called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: {
                        	id : parseFloat(param)
                        }
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/cancel`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Invoice Cancelled!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not cancel invoice!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not cancel invoice!';
                            callback(res);
                        }
                    );
                },
                dueDateWithoutSave: function(payload, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.dueDateWithoutSave called with the following params:', payload);
                    }
                    let apiJSON = payload;
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/dueDateWithoutSave`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            callback(res);
                        }
                    );
                },
                submitInvoiceReview: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.submitInvoiceReview called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: {
                        	id : parseFloat(param)
                        }
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/submitForReview`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Invoice Submitted for Review!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not submit invoice for review!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not submit invoice for review!';
                            callback(res);
                        }
                    );
                },
                acceptInvoice: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.acceptInvoice called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: {
                        	id : parseFloat(param)
                        }
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/accept`;
                    screenLoader.showLoader();
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Invoice Accepted!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not accept invoice!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not accept invoice!';
                            callback(res);
                        }
                    ).finally(() => {
                        screenLoader.hideLoader();
                    }); ;
                },
                submitInvoiceApprove: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.submitInvoiceApprove called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: {
                        	id : parseFloat(param)
                        }
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/submitForApproval`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Invoice Submitted for Approve!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not submit invoice for approve!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not submit invoice for approve!';
                            callback(res);
                        }
                    );
                },
                approveInvoice: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.submitInvoiceApprove called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/approve`;
                    screenLoader.showLoader();
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Invoice Approved!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not approve invoice!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not approve invoice!';
                            callback(res);
                        }
                    ).finally(() => {
                        screenLoader.hideLoader();
                    });
                },
                revertInvoice: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.revertInvoice called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: {
                        	id : parseFloat(param)
                        }
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/revert`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Invoice Reverted!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not revert invoice!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not revert invoice!';
                            callback(res);
                        }
                    );
                },
                rejectInvoice: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.rejectInvoice called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: {
                        	id : parseFloat(param)
                        }
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/reject`;
                    screenLoader.showLoader();
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Invoice Rejected!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not reject invoice!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not reject invoice!';
                            callback(res);
                        }
                    ).finally(() => {
                        screenLoader.hideLoader();
                    });
                },
                getApplyForList: function(orderId, callback) {
                    screenLoader.showLoader();
                    if (_debug) {
                        console.log('$APIService invoice.getApplyForList called with the following ORDER_ID:', orderId);
                    }
                    let apiJSON = {
                        Payload: orderId
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/getApplicableProducts`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not get ApplyFor list!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not get ApplyFor list!';
                            callback(res);
                        }
                    ).finally(() => {
                        screenLoader.hideLoader();
                    });
                },
                createCreditNote: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService invoice.createCreditNote called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/newFromClaim`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Credit note Created!';
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not create credit note!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not create credit note!';
                            callback(res);
                            console.log('HTTP ERROR while trying to save credit note!');
                        }
                    );
                },
                createPreclaimCN: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService invoice.createPreclaimCN called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/newPreclaimCN`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Pre-claim Credit note Created!';
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not create pre-claim credit note!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not create pre-claim credit note!';
                            callback(res);
                            console.log('HTTP ERROR while trying to save pre-claim credit note!');
                        }
                    );
                },
                getWorkingDueDate: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService invoice.getWorkingDueDate called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/workingDueDate`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Got Working Due Date!';
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not get Working Due Date !';
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not get Working Due Date !';
                            console.log('HTTP ERROR while trying to get Working Due Date !');
                        }
                    );
                },
                saveTreasuryTableData: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService invoice.saveTreasuryTableData called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/updateRows`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not saveTreasuryTableData!';
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not saveTreasuryTableData !';
                            callback(res);
                            console.log('HTTP ERROR while trying to saveTreasuryTableData!');
                        }
                    );
                },
                updatePaymentProofDetails: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.updatePaymentProofDetails called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/updatePaymentProofDetails`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not updatePaymentProofDetails!';
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not updatePaymentProofDetails !';
                            callback(res);
                            console.log('HTTP ERROR while trying to updatePaymentProofDetails!');
                        }
                    );
                },
                invoiceTotalConversion: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.updatePaymentProofDetails called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/totalConversion`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not invoiceTotalConversion!';
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not invoiceTotalConversion !';
                            callback(res);
                            console.log('HTTP ERROR while trying to invoiceTotalConversion!');
                        }
                    );
                },
                selectAllTreasuryReport: function(param, callback) {
                    if (_debug) {
                        console.log('$APIService invoice.selectAllTreasuryReport called with the following params:', param);
                    }

                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/selectAllTreasuryReport`;
                    $http.post(url, param).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not selectAllTreasuryReport!';
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not selectAllTreasuryReport !';
                            callback(res);
                            console.log('HTTP ERROR while trying to selectAllTreasuryReport!');
                        }
                    );
                }
            },
            admin: {
                changePassword: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService invoice.changePassword called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_ADMIN }/api/admin/user/changePassword`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Password Changed!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not change Password!';
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not change Password!';
                            console.log('HTTP ERROR while trying to change password!');
                        }
                    );
                }
            },
            delivery: {
                getConversionInfo: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService delivery.getConversionInfo called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/getConversionInfo`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'get Conversion Info!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not get Conversion Info!';
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not get Conversion Info!';
                            console.log('HTTP ERROR while trying to get Conversion Info!');
                        }
                    );
                },
                raiseClaim: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService delivery.raiseNoteOfProtest called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/new`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Claim Raised';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not raise note of protest';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not raise note of protest';
                            callback(res);
                            console.log('HTTP ERROR while trying to raiseNoteOfProtest');
                        }
                    );
                },
                sendLabsTemplateEmail: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService delivery.sendLabsTemplateEmail called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/SendLabsTemplateEmail`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Email Template Sent';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to raiseNoteOfProtest');
                        }
                    );
                },
                revertVerify: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService delivery.Revert Verify Success called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/revert`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Revert Verify Success';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not get Revert Verify';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            // res.message = "Could not Revert Verify";
                            console.log('HTTP ERROR while trying to Revert Verify');
                            callback(res);
                        }
                    );
                },
                getSpecParamsDeliveryProduct: function(param, callback) {
                    console.log(param);
                    let apiJSON = param;
                    // var url = API.BASE_URL_DATA_MASTERS + '/api/masters/specParameters/getDeliverySpecParameters';
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/getDeliverySpecParameters`;
                    $http.post(url, apiJSON).then((response) => {
                        if (response.status == 200) {
                            callback(response.data.payload);
                        } else {
                            console.log('Error retrieving spec parameters for product');
                            callback(false);
                        }
                    });
                },
                getQtyParamsDeliveryProsuct: function(param, callback) {
                    console.log(param);
                    let apiJSON = param;
                    // var url = API.BASE_URL_DATA_MASTERS + '/api/masters/specParameters/getDeliverySpecParameters';
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/getDeliveryQuantityParameters`;
                    $http.post(url, apiJSON).then((response) => {
                        if (response.status == 200) {
                            console.log(response);
                            callback(response.data.payload);
                        } else {
                            console.log('Error retrieving quantity parameters for product');
                            callback(false);
                        }
                    });
                },
                getSplitDeliveryLimits: function(param, callback) {
                    console.log(param);
                    let apiJSON = param;
                    // var url = API.BASE_URL_DATA_MASTERS + '/api/masters/specParameters/getDeliverySpecParameters';
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/getDeliverySplitLimits`;
                    $http.post(url, apiJSON).then((response) => {
                        if (response.status == 200) {
                            console.log(response);
                            callback(response.data.payload);
                        } else {
                            console.log('Error retrieving quantity parameters for product');
                            callback(false);
                        }
                    });
                },
                raiseNoteOfProtestProduct: function(param, callback) {
                    console.log(param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/DeliveryLetter`;
                    $http.post(url, apiJSON).then((response) => {
                        if (response.status == 200) {
                            let res = new Array();
                            res.status = true;
                            res.message = 'Note of protest sent';
                            callback(res);
                        } else {
                            console.log('Error raise Note Of Protest');
                            callback(false);
                        }
                    });
                },
                getRelatedDeliveries: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/deliveryInfoForOrder`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                let res = {};
                                res.data = response.data.payload;
                                // response.data.payload.forEach(function(entry) {
                                //     // var i = new Object;
                                //     // res.push(i);
                                // });
                                res.status = true;
                                // res.message = 'Note of protest sent';
                                callback(res);
                            } else {
                                console.log('Error get realted deliveries');
                                callback(false);
                            }
                        },
                        (response) => {
                            console.log('Error get realted deliveries');
                            callback(response.data);
                        }
                    );
                },
                getDeliveryConfigurations: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ADMIN }/api/admin/deliveryConfiguration/getCached`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                let res = {};
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                console.log('Error get delivery confiurations');
                                callback(false);
                            }
                        },
                        (response) => {
                            console.log('Error get delivery confiurations');
                            callback(response.data);
                        }
                    );
                },
                deleteDelivery: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/delete`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            console.log(response);
                            if (response.status == 200) {
                                var res = {};
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                console.log('Error delete delivery.');
                                var res = {};
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                                callback(res);
                            }
                        },
                        (response) => {
                            console.log('Error delete delivery');
                            let res = {};
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                        }
                    );
                },
                splitDelivery: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/split`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                let res = {};
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                console.log('Error split delivery.');
                                callback(response.data);
                            }
                        },
                        (response) => {
                            console.log('Error split delivery');
                            callback(response.data);
                        }
                    );
                },
                deleteDeliveryProduct: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_DELIVERY }/api/delivery/products/delete`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = {};
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                console.log('Error delete delivery product');
                                var res = {};
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                                callback(res);
                            }
                        },
                        (response) => {
                            console.log('Error delete delivery product');
                            let res = {};
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                        }
                    );
                }
            },
            contract: {
                confirm: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService contract.confirm called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/confirm`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Contract confirmed!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to confirm contract!');
                        }
                    );
                },
                delete: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService contract.delete called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/delete`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Contract deleted!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to delete contract!');
                        }
                    );
                },
                cancel: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService contract.confirm called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/cancel`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Contract cancelled!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to cancel contract!');
                        }
                    );
                },
                extend: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService contract.confirm called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/extend`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Contract extended!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to extend contract!');
                        }
                    );
                },
                undo: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService contract.confirm called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/undo`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Contract unconfirmed!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to undo contract!');
                        }
                    );
                },
                previewContract: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService contract.previewContract called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/preview`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Contract preview!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to preview contract!');
                        }
                    );
                },
                contractPreviewEmail: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/previewEmail`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to contractPreviewEmail!');
                        }
                    );
                },
                getByStrategyAndProduct: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/getByStrategyAndProduct`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getByStrategyAndProduct!');
                        }
                    );
                },
                contractProductDeliveryActions: function(param, type, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/${ type}`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to contractProductDeliveryActions!');
                        }
                    );
                },
                saveContractDeliveryModal: function(param, type, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    var urlParam;
                    let apiJSON = {
                        payload: param
                    };
                    if (type == 'price') {
                        urlParam = 'quantityPrice';
                    }
                    if (type == 'mtm') {
                        urlParam = 'quantityMtm';
                    }
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/${ urlParam}`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to saveContractDeliveryModal!');
                        }
                    );
                },
                getContractFormulaList: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/formulas/listMasters`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getContractFormulaList!');
                        }
                    );
                },
                getContractFormulas: function(param, callback) {
                    let apiJSON = {
                        payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/getContractFormulas`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to save terms & conditions!');
                        }
                    );
                },
                save_terms_and_conditions: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = {
                        payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/saveTerms`;
                    // if(param){
                    //     console.log(param);
                    //     return;
                    // }
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.message = 'Terms and Conditions saved!';
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to save terms & conditions!');
                        }
                    );
                }
            },
            mail: {
                list_by_transaction_type: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = {
                        Payload: {
                            Filters: [
                                {
                                    ColumnName: 'EmailTransactionTypeId',
                                    Value: param
                                }
                            ]
                        }
                    };
                    let url = `${API.BASE_URL_DATA_EMAIL }/api/mail/templates/listByTransactionType`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to list_by_transaction_type!');
                        }
                    );
                },
                sendPreviewContract: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_EMAIL }/api/mail/sendPreview`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to sendPreviewContract!');
                        }
                    );
                },
                sendPreviewEmail: function(param, callback) {
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_EMAIL }/api/mail/sendPreview`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to send Email Preview!');
                        }
                    );
                },
                sendEmailPreview: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_EMAIL }/api/mail/sendPreview`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to send Email Preview!');
                        }
                    );
                },
                discardSavedPreview: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_EMAIL }/api/mail/discardSavedPreview`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to send Email Preview!');
                        }
                    );
                },
                saveEmail: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_EMAIL }/api/mail/comments/save`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to saveEmail!');
                        }
                    );
                },
                saveEmailPreview: function(param, callback) {
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_EMAIL }/api/mail/comments/save`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to saveEmail!');
                        }
                    );
                }
            },
            claim: {
                claimPreviewEmail: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/previewEmail`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to claimPreviewEmail!');
                        }
                    );
                },
                debunker: function(id, callback) {
                    let url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/newDebunker`;
                    let data = {
                        Payload: id
                    };
                    $http.post(url, data).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to create debunker!');
                        }
                    );
                },
                createCreditNote: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService claim.createCreditNote called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/newFromClaim`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Credit note Created!';
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not create credit note!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not create credit note!';
                            callback(res);
                            console.log('HTTP ERROR while trying to save credit note!');
                        }
                    );
                },
                createPreclaimCN: function(param, callback) {
                    console.log(param);
                    if (_debug) {
                        console.log('$APIService invoice.createPreclaimCN called with the following params:', param);
                    }
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_INVOICES }/api/invoice/newPreclaimCN`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.message = 'Pre-claim Credit note Created!';
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = 'Could not create pre-claim credit note!';
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Could not create pre-claim credit note!';
                            callback(res);
                            console.log('HTTP ERROR while trying to save pre-claim credit note!');
                        }
                    );
                },
                getRelatedClaims: function(param, callback) {
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/getClaimsListForOrder`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            console.log('HTTP ERROR while trying to save credit note!');
                        }
                    );
                },
                deleteClaim: function(param, callback) {
                    let apiJSON = {
                        Payload: param
                    };
                    let url = `${API.BASE_URL_DATA_CLAIMS }/api/claims/delete`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.status = true;
                                res.data = response.data.payload;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.ErrorMessage;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to save credit note!');
                        }
                    );
                }
            },
            alerts: {
                getTransactionsForApp: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    if (param) {
                        var url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/transactions?appId=${ param}`;
                    } else {
                        var url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/transactions`;
                    }
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getTransactionsForApp!');
                        }
                    );
                },
                getAlertsParametersForTransaction: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/parameters`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getTransactionsForApp!');
                        }
                    );
                },
                alertsGetRuleCondition: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/conditions`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getTransactionsForApp!');
                        }
                    );
                },
                alertsGetRuleOperator: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/operators`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getTransactionsForApp!');
                        }
                    );
                },
                alertsGetTriggerRuleValuesByParamId: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/valuesof?parameterId=${ param}`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to Get Trigger Rule Values By Param Id!');
                        }
                    );
                },
                alertsGetRoles: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/roles`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to Get user roles!');
                        }
                    );
                },
                alertsGetUserFromRoles: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    // var url = API.BASE_URL_DATA_ALERTS + '/api/alerts/staticdata/users?roleId='+param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/users`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to alertsGetUserFromRoles!');
                        }
                    );
                },
                getAlertTypes: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/types`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getAlertTypes!');
                        }
                    );
                },
                alertsGetActivationDetailsReccurences: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/recurrences`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getAlertTypes!');
                        }
                    );
                },
                alertsGetActivationDetailsUntils: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/staticdata/untilstatuses`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getAlertTypes!');
                        }
                    );
                },
                getNotificationsList: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/notifications/list`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.matchedCount = response.data.matchedCount;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getNotificationsList!');
                        }
                    );
                },
                initSignalRParameters: function(callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    // return;
                    let apiJSON = {
                        Payload: {}
                    };
                    let url = `${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/static/signalr`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                callback(response);
                            } else {
                                let res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getNotificationsList!');
                        }
                    );
                },
                notificationsActions: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    var urlVar;
                    let apiJSON = {
                        Payload: param.notificationId
                    };
                    if (param.action == 'dismiss') {
                        urlVar = 'dismiss';
                    }
                    if (param.action == 'stats') {
                        urlVar = 'stats';
                    }
                    let url = `${API.BASE_URL_DATA_ALERTS }/api/alerts/notifications/${ urlVar}`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data.payload;
                                res.status = true;
                                res.matchedCount = response.data.matchedCount;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getNotificationsList!');
                        }
                    );
                }
            },
            masters: {
                bring_rob_status: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/vessels/listRobsVessel`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to claimPreviewEmail!');
                        }
                    );
                },
                convertCurrency: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/exchangeRates/convert`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to claimPreviewEmail!');
                        }
                    );
                },
                getUomConversionFactor: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/uoms/convertQuantity`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                        }
                    );
                },
                getAdditionalCosts: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = {
                        Payload: {}
                    };
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/listApps`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getAdditionalCosts!');
                        }
                    );
                },
                getAdditionalCostsForLocation: function(param, callback) {
                    let apiJSON = param;
                    var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/additionalcosts/listforlocation`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getAdditionalCostsForLocation!');
                        }
                    );
                },
                specGroupGetByProduct: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/specGroups/getByProduct`;
                    $http.post(url, param).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                if ($state.params.screen_id == 'contract') {
	                                res.data.payload =  _.filter(res.data.payload, function(o) { 
										return o.isDeleted == false; 
									});
		                        }
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to specGroupGetByProduct!');
                        }
                    );
                },
                getProductsForSellerInLocation: function(param, callback) {
                    if(localStorage.getItem('preferredProducts')) {
                        var preferred = localStorage.getItem('preferredProducts');
                        param.Payload.SelectedProductIds = preferred;
                    }

                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/products/getProductsForSellerInLocation`;
                    $http.post(url, param).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getProductsForSellerInLocation!');
                        }
                    );
                },
                getPreferredProductsForSellerInLocation: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/products/getPreferredProductsForSellerInLocation`;
                    $http.post(url, param).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to specGroupGetByProduct!');
                        }
                    );
                },
                getService: function(param, callback) {
                    let url = `${API.BASE_URL_DATA_MASTERS }/api/masters/services/get`;
                    $http.post(url, param).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying getSevice!');
                        }
                    );
                },
                getBOPSDensityByProductId: function(param, callback) {
                    let apiJSON = param;
                    var url = `${API.BASE_URL_DATA_MASTERS }/api/masters/products/getBOPSDensity`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getBOPSDensityByProductId!');
                        }
                    );
                }
            },
            request: {
                get_group_requests_ids: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/rfq/getGroup`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to claimPreviewEmail!');
                        }
                    );
                },
                contractPlanningGetQuantityAverage: function(param, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    let url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/getQuantityAndStrategy`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                let res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                // var res = new Object();
                                // res.status = false;
                                // res.message = response.data.ErrorMessage;
                                callback(false);
                            }
                        },
                        (response) => {
                            // var res = new Object();
                            // res.status = false;
                            // res.message = response.data.ErrorMessage;
                            callback(false);
                            console.log('HTTP ERROR while trying to claimPreviewEmail!');
                        }
                    );
                }
            },
            procurement: {
                getSpecForProcurement: function(param, application, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = param;
                    if (application == 'request') {
                        var url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/getSpecParameterForRequestProduct`;
                    }
                    if (application == 'supplier') {
                        var url = `${API.BASE_URL_DATA_SELLER_PORTAL }/api/sellerPortal/request/getSpecParameterForRequestProduct`;
                        console.log($state);
                        // var url = API.BASE_URL_DATA_PROCUREMENT + '/api/procurement/request/getSpecParameterForRequestProduct';
                    }
                    if (application == 'order') {
                        var url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getSpecParameterForOrderProduct`;
                    }
                    if (application == 'contract') {
                        var url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/getSpecParameterForContractProduct`;
                    }
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to claimPreviewEmail!');
                        }
                    );
                },
                saveSpecForProcurement: function(param, application, callback) {
                    // if (_debug) console.log("$APIService contract.confirm called with the following params:", param);
                    let apiJSON = {
                        Payload: param
                    };
                    if (application == 'request') {
                        var url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/request/saveSpecParameterForRequestProduct`;
                    }
                    if (application == 'order') {
                        var url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/saveSpecParameterForOrderProduct`;
                    }
                    if (application == 'contract') {
                        var url = `${API.BASE_URL_DATA_CONTRACTS }/api/contract/contract/saveSpecParameterForContractProduct`;
                    }
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                if (response.data.ErrorMessage) {
                                    res.message = response.data.ErrorMessage;
                                } else {
                                    res.message = response.data.exceptionMessage;
                                }
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            if (response.data.ErrorMessage) {
                                res.message = response.data.ErrorMessage;
                            } else {
                                res.message = response.data.exceptionMessage;
                            }
                            callback(res);
                            console.log('HTTP ERROR while trying to saveSpecForProcurement!');
                        }
                    );
                },
                getSellerBlade: function(param, callback) {
                    let url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/rfq/getSellerBlade`;
                    $http.post(url, param).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                if (response.data.ErrorMessage) {
                                    res.message = response.data.ErrorMessage;
                                } else {
                                    res.message = response.data.exceptionMessage;
                                }
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            if (response.ErrorMessage) {
                                res.message = response.ErrorMessage;
                            } else {
                                res.message = response.exceptionMessage;
                            }
                            callback(res);
                            console.log('HTTP ERROR while trying to getSellerBlade!');
                        }
                    );
                },
                getEnergyBlade: function(param, callback) {
                	screenLoader.showLoader();
                    let url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/rfq/getEnergySpecValues`;
                    $http.post(url, param).then(
                        (response) => {
		                	screenLoader.hideLoader();
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                if (response.data.ErrorMessage) {
                                    res.message = response.data.ErrorMessage;
                                } else {
                                    res.message = response.data.exceptionMessage;
                                }
                            }
                        },
                        (response) => {
		                	screenLoader.hideLoader();
                            let res = new Object();
                            res.status = false;
                            if (response.data.ErrorMessage) {
                                res.message = response.data.ErrorMessage;
                            } else {
                                res.message = response.data.exceptionMessage;
                            }
                            callback(res);
                            console.log('HTTP ERROR while trying to getSellerBlade!');
                        }
                    );
                },
                getRangeTotalAdditionalCosts: function(param, callback) {
                    let apiJSON = param;
                    var url = `${API.BASE_URL_DATA_PROCUREMENT }/api/procurement/order/getRangeTotalAdditionalCosts`;
                    $http.post(url, apiJSON).then(
                        (response) => {
                            if (response.status == 200) {
                                var res = new Object();
                                res.data = response.data;
                                res.status = true;
                                callback(res);
                            } else {
                                var res = new Object();
                                res.status = false;
                                res.message = response.data.ErrorMessage;
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = response.data.ErrorMessage;
                            callback(res);
                            console.log('HTTP ERROR while trying to getRangeTotalAdditionalCosts!');
                        }
                    );
                }
            },
            reports: {
                getReportsGroups: function(callback) {
                    $http.get('https://api.powerbi.com/v1.0/myorg/groups').then(
                        (response) => {
                            if (response.status == 200) {
                                callback(response);
                            } else {
                                let res = new Object();
                                res.status = false;
                                res.message = 'Cannot find powerbi reports. You may want to check the SSRS configuration!';
                                res.data = response;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Error occured while getting reports data!';
                            res.data = response;
                            callback(res);
                            console.log('HTTP ERROR while trying to get reports!');
                        }
                    );
                },
                getReportsInGroup: function(data, callback) {
                    $http.get(`https://api.powerbi.com/v1.0/myorg/groups/${ data.group_id }/reports/`).then(
                        (response) => {
                            if (response.status == 200) {
                                callback(response);
                            } else {
                                let res = new Object();
                                res.status = false;
                                res.message = 'Error occured while getting reports data!';
                                res.data = response;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Error occured while getting reports data!';
                            res.data = response;
                            callback(res);
                            console.log('HTTP ERROR while trying to get reports!');
                        }
                    );
                },
                getReport: function(data, callback) {
                    $http.post(`${API.BASE_URL_DATA_INFRASTRUCTURE }/api/infrastructure/reports/${ data.reportSrc}`, { Payload: data.reportType }).then(
                        (response) => {
                            if (response.status == 200) {
                                callback(response.data);
                            } else {
                                let res = new Object();
                                res.status = false;
                                res.message = 'Error occured while getting reports data!';
                                res.data = response;
                                callback(res);
                            }
                        },
                        (response) => {
                            let res = new Object();
                            res.status = false;
                            res.message = 'Error occured while getting reports data!';
                            res.data = response;
                            callback(res);
                            console.log('HTTP ERROR while trying to get reports!');
                        }
                    );
                }
            }
        };
        return $Api_Service;
    }
]);
