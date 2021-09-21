/*
 * API Service
 */

APP_RATING.factory('Factory_Rating', ['$listsCache', '$tenantSettings', 'API', '$q', '$http', '$state', '$translate', '$cacheFactory', function($listsCache, $tenantSettings, API, $q, $http, $state, $translate, $cacheFactory) {
    var _debug = false;
    var api_map = {
        "general": {
            "nomenclatoare": { "json": { "Payload": true }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/static/lists" },
            "audit": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/audit/get" },
            "generalSettings": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/generalConfiguration/get" }
        },
        "masters": {
            "counterpartylist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 100 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "export": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/export" }, "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/update" } } },
            "counterparty": { "layout": { "get": { "json": { "Payload": { "ScreenType": 101 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "export": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/export" }, "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/update" }, "getParentForSearch": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/getParentForSearch" } } },
            "locationlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 102 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/update" } } },
            "location": { "layout": { "get": { "json": { "Payload": { "ScreenType": 103 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/update" }, "getParentForSearch": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/locations/getParentSearch" } } },
            "productlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 104 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/update" } } },
            "product": { "layout": { "get": { "json": { "Payload": { "ScreenType": 105 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/update" }, "getParentForSearch": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/products/getParentForSearch" } } },
            "companylist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 106 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/update" } } },
            "company": { "layout": { "get": { "json": { "Payload": { "ScreenType": 107 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/update" }, "getParentForSearch": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/companies/getParentForSearch" } } },
            "strategylist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 108 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/update" } } },
            "strategy": { "layout": { "get": { "json": { "Payload": { "ScreenType": 109 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/update" }, "getParentForSearch": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/strategies/getParentForSearch" } } },
            "servicelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 110 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/update" } } },
            "service": { "layout": { "get": { "json": { "Payload": { "ScreenType": 111 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/update" }, "getParentForSearch": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/services/getParentForSearch" } } },
            "buyerlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 112 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/update" } } },
            "buyer": { "layout": { "get": { "json": { "Payload": { "ScreenType": 113 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/update" }, "getParentForSearch": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/buyer/getParentForSearch" } } },
            "vessellist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 114 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/update" } } },
            "vessel": { "layout": { "get": { "json": { "Payload": { "ScreenType": 115 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vessels/update" } } },
            "vesseltypelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 116 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/update" } } },
            "vesseltype": { "layout": { "get": { "json": { "Payload": { "ScreenType": 117 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/vesseltypes/update" } } },
            "marketinstrumentlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 118 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/update" } } },
            "marketinstrument": { "layout": { "get": { "json": { "Payload": { "ScreenType": 119 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/update" } } },
            "systeminstrumentlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 120 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/update" } } },
            "systeminstrument": { "layout": { "get": { "json": { "Payload": { "ScreenType": 121 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/systeminstruments/update" } } },
            "pricelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 122 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/update" } } },
            "price": { "layout": { "get": { "json": { "Payload": { "ScreenType": 123 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/prices/update" } } },
            "pricetypelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 124 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/update" } } },
            "pricetype": { "layout": { "get": { "json": { "Payload": { "ScreenType": 125 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/marketpricetype/update" } } },
            "specgrouplist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 126 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/update" } } },
            "specgroup": { "layout": { "get": { "json": { "Payload": { "ScreenType": 127 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specgroups/update" } } },
            "specparameterlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 128 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/update" } } },
            "specparameter": { "layout": { "get": { "json": { "Payload": { "ScreenType": 129 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/specparameters/update" } } },
            "paymenttermlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 130 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/update" } } },
            "paymentterm": { "layout": { "get": { "json": { "Payload": { "ScreenType": 131 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/paymentterm/update" } } },
            "deliveryoptionlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 132 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/update" } } },
            "deliveryoption": { "layout": { "get": { "json": { "Payload": { "ScreenType": 133 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/deliveryoptions/update" } } },
            "incotermlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 134 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/update" } } },
            "incoterms": { "layout": { "get": { "json": { "Payload": { "ScreenType": 135 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/incoterms/update" } } },
            "uomlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 136 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/update" } } },
            "uom": { "layout": { "get": { "json": { "Payload": { "ScreenType": 137 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/uoms/update" } } },
            "periodlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 138 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/update" } } },
            "period": { "layout": { "get": { "json": { "Payload": { "ScreenType": 139 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/periods/update" } } },
            "eventlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 140 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/update" } } },
            "event": { "layout": { "get": { "json": { "Payload": { "ScreenType": 141 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/events/update" } } },
            "calendarlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 142 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/update" } } },
            "calendar": { "layout": { "get": { "json": { "Payload": { "ScreenType": 143 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/calendars/update" } } },
            "documenttypelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 144 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/update" } } },
            "documenttype": { "layout": { "get": { "json": { "Payload": { "ScreenType": 145 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/documenttype/update" } } },
            "contacttypelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 146 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/update" } } },
            "contacttype": { "layout": { "get": { "json": { "Payload": { "ScreenType": 147 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/contacttypes/update" } } },
            "agreementtypelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 148 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/update" } } },
            "agreementtype": { "layout": { "get": { "json": { "Payload": { "ScreenType": 149 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/agreementtype/update" } } },
            "additionalcostlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 150 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/update" } } },
            "additionalcost": { "layout": { "get": { "json": { "Payload": { "ScreenType": 151 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/additionalcosts/update" } } },
            "bargelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 152 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/update" } } },
            "barge": { "layout": { "get": { "json": { "Payload": { "ScreenType": 153 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/barge/update" } } },
            "statuslist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 154 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/update" } } },
            "status": { "layout": { "get": { "json": { "Payload": { "ScreenType": 155 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/status/update" } } },
            "currencylist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 156 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/update" } } },
            "currency": { "layout": { "get": { "json": { "Payload": { "ScreenType": 157 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/update" }, "export": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/currencies/export" } } },
            "exchangeratelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 158 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/update" } } },
            "exchangerate": { "layout": { "get": { "json": { "Payload": { "ScreenType": 159 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/exchangerates/update" } } },
            "formulalist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 160 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/update" } } },
            "formula": { "layout": { "get": { "json": { "Payload": { "ScreenType": 161 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/formulas/update" } } },
            "countrylist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 162 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/update" } } },
            "country": { "layout": { "get": { "json": { "Payload": { "ScreenType": 163 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/countries/update" } } },
            "emaillogslist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 164 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/update" } } },
            "emaillogs": { "layout": { "get": { "json": { "Payload": { "ScreenType": 165 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/emaillogs/update" } } },
            "timezonelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 166 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/update" } } },
            "timezone": { "layout": { "get": { "json": { "Payload": { "ScreenType": 167 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/list" }, "get": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/get" }, "create": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/create" }, "delete": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/delete" }, "update": { "endpoint": API.BASE_URL_DATA_MASTERS + "/api/masters/timezones/update" } } }
        },
        "admin": {
            "userlist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 200 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/list" }, "get": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/get" }, "create": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/create" }, "delete": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/delete" }, "update": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/update" } } },
            "users": { "layout": { "get": { "json": { "Payload": { "ScreenType": 201 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/list" }, "get": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/get" }, "create": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/create" }, "delete": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/delete" }, "update": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/user/update" } } },
            "rolelist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 202 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/list" }, "get": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/get" }, "create": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/create" }, "delete": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/delete" }, "update": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/update" } } },
            "role": { "layout": { "get": { "json": { "Payload": { "ScreenType": 203 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/list" }, "get": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/get" }, "create": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/create" }, "delete": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/delete" }, "update": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/update" }, "moduleScreenActions": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/moduleScreenActions" }, "lookup": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/role/lookup" } } },
            "configuration": { "layout": { "get": { "json": { "Payload": { "ScreenType": 204 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "get": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/generalConfiguration/get" }, "update": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/generalConfiguration/update" } } },
            "subscriptionslist": { "layout": { "get": { "json": { "Payload": { "ScreenType": 205 } }, "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get" }, "update": { "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update" } }, "entity": { "list": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/subscription/list" }, "get": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/subscription/get" }, "create": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/subscription/create" }, "delete": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/subscription/delete" }, "update": { "endpoint": API.BASE_URL_DATA_ADMIN + "/api/admin/subscription/update" } } }
        },
        "claims": {
            "claimslist": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 500
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "list": {
                        "json": {},
                        "endpoint": API.BASE_URL_DATA_CLAIMS + "/api/claims/list"
                    }
                }
            },
            "claims": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 501
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "get": {
                        "endpoint": API.BASE_URL_DATA_CLAIMS + "/api/claims/get"
                    },
                    "list": {
                        "endpoint": API.BASE_URL_DATA_CLAIMS + "/api/claims/getOrderLookup",
                        "json": {}
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_CLAIMS + "/api/claims/update"
                    },
                    "create": {
                        "endpoint": API.BASE_URL_DATA_CLAIMS + "/api/claims/create"
                    },
                    "complete": {
                        "endpoint": API.BASE_URL_DATA_CLAIMS + "/api/claims/complete"
                    },
                    "cancel": {
                        "endpoint": API.BASE_URL_DATA_CLAIMS + "/api/claims/cancel"
                    }
                },
                "lookup": {
                    "Order": {
                        "json": { "Payload": true },
                        "endpoint": API.BASE_URL_DATA_PROCUREMENT + "/api/procurement/order/autocompleteOrder"
                    }
                }
            }
        },
        "orders": {
            "orders": {
                "entity": {
                    "list": {
                        "endpoint": API.BASE_URL_DATA_PROCUREMENT + "/api/procurement/order/list"
                    },
                    "get": {
                        "endpoint": API.BASE_URL_DATA_PROCUREMENT + "/api/procurement/order/get"
                    }
                }
            }
        },
        "labs": {
            "labresultlist": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 700
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "list": {
                        "endpoint": API.BASE_URL_DATA_LABS + "/api/labs/list"
                    }
                }
            },
            "labresult": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 701
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "get": {
                        "endpoint": API.BASE_URL_DATA_LABS + "/api/labs/get"
                    },
                    "list": {
                        "endpoint": API.BASE_URL_DATA_LABS + "/api/labs/getOrderLookup",
                        "json": {}
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_LABS + "/api/labs/update"
                    }
                },
                "lookup": {
                    "Order": {
                        "json": { "Payload": true },
                        "endpoint": API.BASE_URL_DATA_PROCUREMENT + "/api/procurement/order/autocompleteOrder"
                    }
                }
            }
        },
        "contracts": {
            "contractlist": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 400
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "list": {
                        "json": {},
                        "endpoint": API.BASE_URL_DATA_CONTRACTS + "/api/contract/contract/list"
                    }
                }
            },
            "contract": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 401
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "get": {
                        "endpoint": API.BASE_URL_DATA_CONTRACTS + "/api/contract/contract/get"
                    },
                    "list": {
                        "endpoint": API.BASE_URL_DATA_CONTRACTS + "/api/contract/contract/getOrderLookup",
                        "json": {}
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_CONTRACTS + "/api/contract/contract/update"
                    },
                    "create": {
                        "endpoint": API.BASE_URL_DATA_CONTRACTS + "/api/contract/contract/create"
                    }
                }
            }
        },
        "delivery": {
            "deliverylist": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 600
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "list": {
                        "json": {},
                        "endpoint": API.BASE_URL_DATA_DELIVERY + "/api/delivery/list"
                    }
                }
            },
            "delivery": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 601
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "get": {
                        "endpoint": API.BASE_URL_DATA_DELIVERY + "/api/delivery/get"
                    },
                    "list": {
                        "endpoint": API.BASE_URL_DATA_DELIVERY + "/api/delivery/getOrderLookup",
                        "json": {}
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_DELIVERY + "/api/delivery/update"
                    }
                }
            }
        },
        "recon": {
            "reconlist": {
                "layout": {
                    "get": {
                        "json": {
                            "Payload": {
                                "ScreenType": 900
                            }
                        },
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/get"
                    },
                    "update": {
                        "endpoint": API.BASE_URL_DATA_INFRASTRUCTURE + "/api/infrastructure/screenlayout/update"
                    }
                },
                "entity": {
                    "list": {
                        "json": {},
                        "endpoint": API.BASE_URL_DATA_RECON + "/api/recon/reconList"
                    }
                }
            },
            "recon": {}
        }
    };
    var cache = new Object;
    cache.loaded = 0;

    var formatters = function(obj) {
        for (var key in obj) {
            if (obj[key]) {
                if (typeof(obj[key]) == 'object') {
                    formatters(obj[key]);
                    continue;
                }
                if (typeof(obj[key]) == "string") {
                    if (key == "Parse") {
                        if (obj[key] == 'amount') obj[key] = 'number:' + $tenantSettings['defaultValues']['amountPrecision'];
                        if (obj[key] == 'price') obj[key] = 'number:' + $tenantSettings['defaultValues']['pricePrecision'];
                        if (obj[key] == 'quantity') obj[key] = 'number:' + $tenantSettings['defaultValues']['quantityPrecision'];
                        if (obj[key] == 'date') obj[key] = $tenantSettings['tenantFormats']['dateFormat'];
                    }
                    continue;
                }
            }
        }
        return obj;
    };
    var parse = function(param, data) {
        if (_debug) console.log("$APIService parse called with ", param, data);
        if (param == 'formatters') {
            var result = formatters(data);
            return result;
        }
    };


    var $Api_Service = {
        screen: {
            get: function(param, callback) {
                if (_debug) console.log("$APIService screen.get called with the following params:");
                if (_debug) console.log(param);
                if (param.app == 'admin' && param.screen == 'subscriptionlist') {
                    var apiJSON = { "layout": {}, "elements": {}, "clc": {} };
                    callback(apiJSON);
                    return;
                }
                $http.post(api_map[param.app][param.screen]['layout']['get']['endpoint'], api_map[param.app][param.screen]['layout']['get']['json']).then(function successCallback(response) {
                    if (response.data) {
                        var jsonDATA = JSON.parse(response.data.layout);
                        if (typeof(param.clc_id) != 'undefined') {
                            if (typeof(jsonDATA.clc[param.clc_id]) != 'undefined') {
                                var singleCLC = jsonDATA.clc[param.clc_id];
                                jsonDATA.clc = singleCLC;
                            }
                        }
                        var result = parse("formatters", jsonDATA);
                        callback(result);
                    } else {
                        callback(false);
                    }
                }, function errorCallback(response) {
                    console.log('HTTP ERROR');
                    callback(false);
                });
            },
            update: function(param, callback) {
                $http.post(api_map[param.app][param.screen]['layout']['get']['endpoint'], api_map[param.app][param.screen]['layout']['get']['json']).then(function successCallback(response) {
                    var newLayout = new Object;
                    newLayout.elements = [];
                    newLayout.layout = [];
                    newLayout.clc = [];
                    if (response.data) {
                        var data = JSON.parse(response.data.layout);
                        var jsonDATA = api_map[param.app][param.screen]['layout'][param.type]['update']['json'];
                        newLayout.elements = data._v.elements;
                        newLayout.layout = param.layout;
                        jsonDATA.Payload.id = response.data.id;
                        jsonDATA.Payload.layout = JSON.stringify(newLayout);
                        $http.post(api_map[param.app][param.screen]['layout'][param.type]['update']['endpoint'], jsonDATA).then(function successCallback(response2) {
                            if (response2.status == 200) {
                                callback(true);
                            } else {
                                callback(false);
                            }
                        }, function errorCallback(response2) {
                            console.log('HTTP ERROR');
                            callback(false);
                        });
                    } else {
                        callback(false);
                    }
                }, function errorCallback(response) {
                    console.log('HTTP ERROR');
                    callback(false);
                });
            }
        },
        entity: {
            structure: function(param, callback) {
                if (_debug) console.log("$APIService entity.structure called with the following params:");
                if (_debug) console.log(param);
                $http.post(api_map[param.app][param.screen]['layout']['get']['endpoint'], api_map[param.app][param.screen]['layout']['get']['json']).then(function successCallback(response) {
                    if (response.status == 200) {
                        var jsonDATA = JSON.parse(response.data.layout);
                        var result = jsonDATA.elements;
                        callback(result);
                    } else {
                        callback(false);
                    }
                }, function errorCallback(response) {
                    console.log('HTTP ERROR');
                    callback(false);
                });
            },
            list: function(param, callback) {
                if (_debug) console.log("$APIService entity.list called with the following params:");
                if (_debug) console.log(param);
                var apiJSON = {
                    "Payload": {
                        "Order": null,
                        "Filters": [],
                        "Pagination": {
                            "Skip": 0,
                            "Take": 0
                        }
                    }
                };
                //TBD filtrare
                if (param.params.col.length > 0 && (param.params.sort == 'asc' || param.params.sort == 'desc')) {
                    apiJSON.Payload.Order = {
                        "ColumnName": param.params.col.replace(".", "_"),
                        "SortOrder": param.params.sort
                    }
                }
                apiJSON.Payload.Pagination.Take = param.params.rows;
                apiJSON.Payload.Pagination.Skip = param.params.rows * (param.params.page - 1);
                $http.post(api_map[param.app][param.screen]['entity']['list']['endpoint'], angular.toJson(apiJSON)).then(function successCallback(response) {
                    if (response.data) {
                        var res = new Object;
                        res.records = response.data.matchedCount;
                        res.page = param.params.page;
                        res.total = Math.ceil(response.data.matchedCount / param.params.rows);
                        res.rows = response.data.payload;
                        if (_debug) console.log("$APIService entity.list result:", res);
                        callback(res);
                    } else {
                        callback(false);
                    }
                }, function errorCallback(response) {
                    console.log('HTTP ERROR');
                    callback(false);
                });


                callback(false);
            },
            get: function(param, callback) {
                if (_debug) console.log("$APIService entity.get called with the following params:", param);

                //Customizari
                if (param.app == 'labs' && param.screen == 'labresult') {
                    var apiJSON = {
                        "Payload": param.id
                    }
                    var entity = $http.post(API.BASE_URL_DATA_LABS + "/api/labs/get", apiJSON);
                    var testResults = $http.post(API.BASE_URL_DATA_LABS + "/api/labs/tests/list", apiJSON);
                    $q.all([entity, testResults]).then(function success(responses) {
                        var result = new Object;
                        if (responses[0].status == 200) {
                            result = responses[0].data.payload;
                        }
                        if (responses[1].status == 200) {
                            result.labTestResults = responses[1].data.payload;
                        }
                        callback(result);
                    });
                    return;
                }
                if (param.app == 'admin' && param.screen == 'configuration') {
                    param.id = 0;
                    var contract = $http.post(API.BASE_URL_DATA_ADMIN + "/api/admin/contractConfiguration/get", { "Payload": true });
                    var email = $http.post(API.BASE_URL_DATA_ADMIN + "/api/admin/emailConfiguration/get", { "Payload": true });
                    var general = $http.post(API.BASE_URL_DATA_ADMIN + "/api/admin/generalConfiguration/get", { "Payload": true });
                    var procurement = $http.post(API.BASE_URL_DATA_ADMIN + "/api/admin/procurementConfiguration/get", { "Payload": true });
                    var schedule = $http.post(API.BASE_URL_DATA_ADMIN + "/api/admin/scheduleDashboardConfiguration/get", { "Payload": true });
                    $q.all([contract, email, general, procurement, schedule]).then(function(responses) {
                        var result = {};
                        if (responses[0].status == 200) {
                            result['contract'] = responses[0].data.payload;
                        } else {
                            result['contract'] = [];
                        }
                        if (responses[1].status == 200) {
                            result['email'] = responses[1].data.payload;
                        } else {
                            result['email'] = [];
                        }
                        if (responses[2].status == 200) {
                            result['general'] = responses[2].data.payload;
                        } else {
                            result['general'] = [];
                        }
                        if (responses[3].status == 200) {
                            result['procurement'] = responses[3].data.payload;
                        } else {
                            result['procurement'] = [];
                        }
                        if (responses[3].status == 200) {
                            result['schedule'] = responses[3].data.payload;
                        } else {
                            result['schedule'] = [];
                        }
                        callback(result);
                    });
                    return;
                }
                if (param.app == 'admin' && param.screen == 'role') {
                    function deepmerge(foo, bar) {
                        var merged = {};
                        for (var each in bar) {
                            if (foo.hasOwnProperty(each) && bar.hasOwnProperty(each)) {
                                if (typeof(foo[each]) == "object" && typeof(bar[each]) == "object") {
                                    merged[each] = deepmerge(foo[each], bar[each]);
                                } else {
                                    merged[each] = [foo[each], bar[each]];
                                }
                            } else if (bar.hasOwnProperty(each)) {
                                merged[each] = bar[each];
                            }
                        }
                        for (var each in foo) {
                            if (!(each in bar) && foo.hasOwnProperty(each)) {
                                merged[each] = foo[each];
                            }
                        }
                        return merged;
                    }
                    var roles_promise = $http.post(api_map[param.app][param.screen]['entity']['get']['endpoint'], { "Payload": param.id });
                    var check_promise = $http.post(api_map[param.app][param.screen]['entity']['moduleScreenActions']['endpoint'], { "Payload": {} });
                    $q.all([roles_promise, check_promise]).then(function(responses) {
                        if (responses[0].status == 200) {
                            var res1 = responses[0].data;
                        } else {
                            callback(false);
                            console.log("Error retrieving roles!");
                        }
                        if (responses[1].status == 200) {
                            var res2 = responses[1].data.payload;
                        } else {
                            callback(false);
                            console.log("Error retrieving role checks!");
                        }
                        var modules = {};
                        res2.forEach(function(entry) {
                            var name = entry.name;
                            var screens = {};
                            if (entry.screens.length > 0) {
                                entry.screens.forEach(function(entry2) {
                                    var screenActions = {};
                                    entry2.screenActions.forEach(function(entry3) {
                                        screenActions[entry3.id] = {
                                            "name": entry3.name,
                                        };
                                    });
                                    screens[entry2.name] = screenActions;
                                });
                                modules[entry.name] = screens;
                            } else {
                                modules[entry.name] = [];
                            }
                        });
                        var checks = {};
                        if (param.id != '') {
                            res1.rights.forEach(function(entry) {
                                var screens = {};
                                entry.moduleScreenConfigurations.forEach(function(entry2) {
                                    var actions = {};
                                    entry2.actions.forEach(function(entry3) {
                                        actions[entry3.id] = {
                                            "isSelected": true
                                        };
                                    });
                                    screens[entry2.screen.name] = actions;
                                });
                                checks[entry.module.name] = screens;
                            });
                        }
                        var result = {
                            "roles": res1,
                            "moduleScreenActions": res2,
                            "deepmerge": deepmerge(modules, checks)
                        };
                        callback(result);
                    })
                    return;
                }
                //End customizari

                if (param.id.length < 1 && !isNaN(param.id)) {
                    callback(false);
                    return;
                }
                $http.post(api_map[param.app][param.screen]['entity']['get']['endpoint'], '{"Payload":' + param.id + '}').then(function successCallback(response) {
                    if (response.data) {
                        var res = new Object;
                        if (param.app == 'admin' && param.screen == 'role') res = response.data;
                        else { res = response.data.payload; }
                        if (_debug) console.log("$APIService entity.get answer:", res);
                        callback(res);
                        return;
                    } else {
                        callback(false);
                        return;
                    }
                }, function errorCallback(response) {
                    console.log('HTTP ERROR');
                    callback(false);
                    return;
                });
                callback(false);
            },
            update: function(param, callback) {
                if (_debug) console.log("$APIService entity.update called with the following params:", param);
                if (typeof(param.data) !== 'object') {
                    var data = JSON.parse(param.data);
                } else {
                    var data = param.data;
                }
                if (param.app == 'labs' && param.screen == 'labresult') {
                    var apiJSON2 = {
                        "Payload": param.data.labTestResults
                    };
                    delete param.data.labTestResults;
                    var apiJSON1 = {
                        "Payload": param.data
                    }
                    var entity = $http.post(API.BASE_URL_DATA_LABS + "/api/labs/update", apiJSON1);
                    var testResults = $http.post(API.BASE_URL_DATA_LABS + "/api/labs/tests/update", apiJSON2);
                    $q.all([testResults, entity]).then(function success(responses) {
                        var result = new Object;
                        if (responses[0].status == 200 && responses[1].status == 200) {
                            var res = new Object;
                            res.status = true;
                            res.message = "Succes!";
                        }
                        callback(res);
                    });
                    return;
                }
                var updateJSON = {
                    "Payload": data
                }
                var res = {
                    "id": 0,
                    "message": "Failed!",
                    "status": false
                };
                $http.post(api_map[param.app][param.screen]['entity']['update']['endpoint'], updateJSON).then(function successCallback(response) {
                    if (response.status == 200) {
                        res.status = true;
                        res.message = "Succes!";
                        callback(res);
                        return;
                    } else {
                        callback(res);
                        return;
                    }
                    return;
                }, function errorCallback(response) {
                    console.log('HTTP ERROR');
                    res.message = "HTTP Error!";
                    if (_debug) res.message = response.data.ErrorMessage;
                    callback(res);
                    return;
                });
            },
            create: function(param, callback) {
                if (_debug) console.log("$APIService entity.create called with the following params:");
                if (_debug) console.log(param);
                if (typeof(param.data) !== 'object') {
                    var data = JSON.parse(param.data);
                } else {
                    var data = param.data;
                }
                if (param.app == 'labs' && param.screen == 'labresult') {
                    var apiJSON2 = {
                        "Payload": data.labTestResults
                    };
                    delete data.labTestResults;
                    var apiJSON1 = {
                        "Payload": data
                    }
                    $http.post(API.BASE_URL_DATA_LABS + "/api/labs/create", apiJSON1).then(function successCallback(response) {
                        if (response.status == 200) {
                            var res = new Object;
                            res.status = true;
                            res.id = response.data.upsertedId;
                            res.message = 'Succesfully created Lab Result ' + res.id + '!';
                            callback(res);
                            apiJSON2.Payload.forEach(function(entry) {
                                entry.labResult.id = res.id;
                            });
                            $http.post(API.BASE_URL_DATA_LABS + "/api/labs/tests/create", apiJSON2).then(function successCallback(response) {
                                if (response.status == 200) {
                                    var res = new Object;
                                    res.status = true;
                                    res.message = 'Succesfully created Lab Test Results!';
                                    callback(res);
                                }
                            });
                        } else {
                            res.status = false;
                            res.message = "Failed!";
                            callback(res);
                            return;
                        }
                    });
                    return;
                }
                var updateJSON = {
                    "Payload": data
                };
                if (param.app == 'masters') {
                    updateJSON.Payload.isDeleted = false;
                }
                var i = 0;
                var res = {
                    "id": 0,
                    "message": "",
                    "status": false
                };
                $http.post(api_map[param.app][param.screen]['entity']['create']['endpoint'], updateJSON).then(function successCallback(response) {

                    if (response.status == 200) {
                        res.status = true;
                        res.message = "Succes!";
                        res.id = response.data.upsertedId;
                        callback(res);
                        return;
                    } else {
                        res.status = false;
                        res.message = "Failed!";
                        callback(res);
                        return;
                    }
                    return;
                }, function errorCallback(response) {
                    res.status = false;
                    res.message = "Failed!";
                    console.log('HTTP ERROR ' + response.data.ErrorMessage);
                    if (_debug) res.message = response.data.ErrorMessage;
                    callback(res);
                    return;
                });
            },
            export: function(param, callback) {
                if (_debug) console.log("$APIService entity.export called with the following params:", param);
                // public enum ExportTypeEnum {
                //     None = 0,
                //         Excel = 1,
                //         CSV = 2,
                //         PDF = 3
                // }
                var payload = new Object;
                switch (param.action) {
                    case 'export_xls':
                        payload.exportType = 1;
                        break;
                    case 'export_csv':
                        payload.exportType = 2;
                        break;
                    case 'export_pdf':
                        payload.exportType = 3;
                        break;
                    default:
                        payload.exportType = 2;
                }
                payload.Order = null;
                payload.Filters = [];
                payload.Pagination = {};
                payload.columns = new Array;
                param.colModel.forEach(function(entry) {
                    if (!entry.hidden && !entry.key) {
                        var obj = new Object;
                        obj.dtoPath = entry.name;
                        obj.label = entry.label;
                        payload.columns.push(obj);
                    }
                });
                var res = new Object;
                $http.post(api_map[param.app][param.screen]['entity']['export']['endpoint'], { "Payload": payload }).then(function successCallback(response) {
                    if (response.status == 200) {
                        console.log("EXPORT RESPONSE!!!", response);
                    }
                }, function errorCallback(response) {
                    res.status = false;
                    res.message = "Failed!";
                    console.log('HTTP ERROR ' + response.data.ErrorMessage);
                    if (_debug) res.message = response.data.ErrorMessage;
                    callback(res);
                });

            },
            cancel: function(param, callback) {
                if (_debug) console.log("$APIService entity.cancel called with the following params:", param);
                if (param.app != 'claims') {
                    callback({ "status": false, "message": "Not implemented yet!" });
                    return;
                }
                var res = {
                    "status": false,
                    "message": "Error!"
                };
                if (param.app == 'claims') {
                    if (typeof(param.data) !== 'object') {
                        var data = JSON.parse(param.data);
                    } else {
                        var data = param.data;
                    }
                    var updateJSON = {
                        "Payload": data
                    }
                    $http.post(api_map[param.app][param.screen]['entity']['cancel']['endpoint'], updateJSON).then(function successCallback(response) {

                        if (response.status == 200) {
                            res.status = true;
                            res.message = "Succes!";
                            res.id = response.data.upsertedId;
                            callback(res);
                            return;
                        } else {
                            res.status = false;
                            res.message = "Failed!";
                            callback(res);
                            return;
                        }
                        return;
                    }, function errorCallback(response) {
                        res.status = false;
                        res.message = "Failed!";
                        console.log('HTTP ERROR ' + response.data.ErrorMessage);
                        if (_debug) res.message = response.data.ErrorMessage;
                        callback(res);
                        return;
                    });

                }

            },
            complete: function(param, callback) {
                if (_debug) console.log("$APIService entity.complete called with the following params:", param);
                if (param.app != 'claims') {
                    callback({ "status": false, "message": "Not implemented yet!" });
                    return;
                }
                var res = {
                    "status": false,
                    "message": "Error!"
                };
                if (param.app == 'claims') {
                    if (typeof(param.data) !== 'object') {
                        var data = JSON.parse(param.data);
                    } else {
                        var data = param.data;
                    }
                    var updateJSON = {
                        "Payload": data
                    }
                    $http.post(api_map[param.app][param.screen]['entity']['complete']['endpoint'], updateJSON).then(function successCallback(response) {

                        if (response.status == 200) {
                            res.status = true;
                            res.message = "Succes!";
                            res.id = response.data.upsertedId;
                            callback(res);
                            return;
                        } else {
                            res.status = false;
                            res.message = "Failed!";
                            callback(res);
                            return;
                        }
                        return;
                    }, function errorCallback(response) {
                        res.status = false;
                        res.message = "Failed!";
                        console.log('HTTP ERROR ' + response.data.ErrorMessage);
                        if (_debug) res.message = response.data.ErrorMessage;
                        callback(res);
                        return;
                    });

                }
            },
        },
        dropdown: {
            get: function(param, callback) {
                if (_debug) console.log("$APIService dropdown.get called with:", param);
                //Custom implementations

                //End Custom implementation

                //Filter implementations
                if (typeof(param.field.Filter) != 'undefined') {
                    if (param.app == 'labs' && param.screen == 'labresult') {
                        if (param.field.Unique_ID == 'delivery') {
                            var apiJSON = {
                                "Payload": {
                                    "Order": null,
                                    "Filters": param.field.Filter,
                                    "Pagination": null
                                }
                            };
                            var url = API.BASE_URL_DATA_CLAIMS + "/api/claims/getDeliveryLookup";
                            $http.post(url, apiJSON).then(function success(response) {
                                if (response.status == 200) {
                                    var result = [];
                                    response.data.payload.forEach(function(entry) {
                                        result.push({
                                            "id": entry.deliveryNo.id,
                                            "name": entry.deliveryNo.name,
                                            "payload": {
                                                "barge": entry.barge
                                            }
                                        });
                                    });
                                    callback(result);
                                } else {
                                    console.log("HTTP ERROR");
                                    callback([{ "id": -1, "name": "Error retrieving deliveries" }]);
                                }
                            });
                        }
                        if (param.field.Unique_ID == 'product') {
                            var apiJSON = {
                                "Payload": {
                                    "Order": null,
                                    "Filters": param.field.Filter,
                                    "Pagination": null
                                }
                            };
                            var url = API.BASE_URL_DATA_CLAIMS + "/api/claims/getProductDropdown";
                            $http.post(url, apiJSON).then(function success(response) {
                                if (response.status == 200) {
                                    var result = [];
                                    response.data.payload.forEach(function(entry) {
                                        result.push({
                                            "id": entry.product.id,
                                            "name": entry.product.name
                                        });
                                    });
                                    callback(result);
                                } else {
                                    console.log("HTTP ERROR");
                                    callback([{ "id": -1, "name": "Error retrieving products" }]);
                                }
                            });
                        }
                        return;
                    }
                    if (param.app == 'contracts' && param.screen == 'contract') {
                        if (param.field.Unique_ID == 'primaryContact') {
                            var apiJSON = {
                                "Payload": param.field.Filter[0].Value;
                            };
                            var url = API.BASE_URL_DATA_MASTERS + "/api/masters/counterparties/contactBySeller";
                            $http.post(url, apiJSON).then(function success(response) {
                                if (response.status == 200) {
                                    callback(response.data.payload);
                                } else {
                                    console.log("HTTP ERROR");
                                    callback([{ "id": -1, "name": "Error retrieving contacts" }]);
                                }
                            });
                        }
                        return;
                    }
                    if (param.app == 'claims' && param.screen == 'claims') {
                        if (param.field.Unique_ID == 'orderDetails.deliveryNo') {
                            var apiJSON = {
                                "Payload": {
                                    "Order": null,
                                    "Filters": param.field.Filter,
                                    "Pagination": null
                                }
                            };
                            var url = API.BASE_URL_DATA_CLAIMS + "/api/claims/getDeliveryLookup";
                            $http.post(url, apiJSON).then(function success(response) {
                                if (response.status == 200) {
                                    var result = [];
                                    response.data.payload.forEach(function(entry) {
                                        result.push({
                                            "id": entry.deliveryNo.id,
                                            "name": entry.deliveryNo.name,
                                            "payload": {
                                                "orderDetails": {
                                                    "deliveryDate": entry.deliveryDate,
                                                    "vessel": entry.vessel,
                                                    "port": entry.port,
                                                    "counterparty": entry.counterparty
                                                }
                                            }
                                        });
                                    });
                                    callback(result);
                                } else {
                                    console.log("HTTP ERROR");
                                    callback([{ "id": -1, "name": "Error retrieving deliveries" }]);
                                }
                            });
                        }
                        if (param.field.Unique_ID == 'orderDetails.labResult') {
                            var apiJSON = {
                                "Payload": {
                                    "Order": null,
                                    "Filters": param.field.Filter,
                                    "Pagination": null
                                }
                            };
                            var url = API.BASE_URL_DATA_CLAIMS + "/api/claims/getLabResultLookup";
                            $http.post(url, apiJSON).then(function success(response) {
                                if (response.status == 200) {
                                    var result = [];
                                    response.data.payload.forEach(function(entry) {
                                        result.push({
                                            "id": entry.labResult.id,
                                            "name": entry.labResult.name,
                                            "payload": {
                                                "orderDetails": {
                                                    "vessel": entry.vessel,
                                                    "port": entry.port,
                                                    "counterparty": entry.counterparty
                                                }
                                            }
                                        });
                                    });
                                    callback(result);
                                } else {
                                    console.log("HTTP ERROR");
                                    callback([{ "id": -1, "name": "Error retrieving deliveries" }]);
                                }
                            });
                        }
                        if (param.field.Unique_ID == 'orderDetails.product') {
                            var apiJSON = {
                                "Payload": {
                                    "Order": null,
                                    "Filters": param.field.Filter,
                                    "Pagination": null
                                }
                            };
                            var url = API.BASE_URL_DATA_CLAIMS + "/api/claims/getProductDropdown";
                            $http.post(url, apiJSON).then(function success(response) {
                                if (response.status == 200) {
                                    var result = [];
                                    response.data.payload.forEach(function(entry) {
                                        result.push({
                                            "id": entry.product.id,
                                            "name": entry.product.name,
                                            "payload": {
                                                "orderDetails": {
                                                    "orderProductId": entry.orderProductId,
                                                    "deliveryProductId": entry.deliveryProductId,
                                                    "orderPrice": entry.orderPrice,
                                                    "currency": entry.currency,

                                                }
                                            }
                                        });
                                    });
                                    callback(result);
                                } else {
                                    console.log("HTTP ERROR");
                                    callback([{ "id": -1, "name": "Error retrieving deliveries" }]);
                                }
                            });
                        }
                        return;
                    }
                    console.log("Filter dropdown unimplemented!");
                    callback([{ "id": -1, "name": "Not implemented!" }]);
                    return;
                }
                //End Filter implementations

                if (typeof(param.field.UOMType) != 'undefined') {
                    if (typeof($listsCache[param.field.UOMType]) != 'undefined') {
                        callback($listsCache[param.field.UOMType]);
                    } else {
                        console.log("$APIService dropdown.get failed for UOMType:", param.field.UOMType);
                        callback([{ "id": -1, "name": "Not implemented!" }]);
                    }
                    return;
                } else {
                    if (typeof($listsCache[param.field.masterSource]) != 'undefined') {
                        callback($listsCache[param.field.masterSource]);
                    } else {
                        console.log("$APIService dropdown.get failed for masterSource:", param.field.masterSource);
                        callback([{ "id": -1, "name": "Not implemented!" }]);
                    }
                }
                if (param.dropdown == 'ParentStrategy' && param.unique_id == 'Strategy') {
                    var apiJSON = {
                        "Payload": {
                            "Order": null,
                            "Filters": [],
                            "Pagination": {
                                "Skip": 0,
                                "Take": 10
                            }
                        }
                    };
                    $http.post(API.BASE_URL_DATA_MASTERS + "/api/masters/strategy/getParentForSearch", apiJSON).then(function successCallback(response) {
                        if (response.status == 200) {
                            callback(response.data.payload);
                        } else {
                            callback(false);
                        }
                    }, function errorCallback(response) {
                        console.log("HTTP ERROR");
                        callback(false);
                    });

                }
                if (param.dropdown == 'ParentService' && param.unique_id == 'Service') {
                    var apiJSON = {
                        "Payload": {
                            "Order": null,
                            "Filters": [],
                            "Pagination": {
                                "Skip": 0,
                                "Take": 10
                            }
                        }
                    };
                    $http.post(API.BASE_URL_DATA_MASTERS + "/api/masters/service/getParentForSearch", apiJSON).then(function successCallback(response) {
                        if (response.status == 200) {
                            callback(response.data.payload);
                        } else {
                            callback(false);
                        }
                    }, function errorCallback(response) {
                        console.log("HTTP ERROR");
                        callback(false);
                    });

                }
                if (param.dropdown == 'ParentProduct' && param.unique_id == 'Product') {
                    var apiJSON = {
                        "Payload": {
                            "Order": null,
                            "Filters": [],
                            "Pagination": {
                                "Skip": 0,
                                "Take": 10
                            }
                        }
                    };
                    $http.post(API.BASE_URL_DATA_MASTERS + "/api/masters/products/getParentForSearch", apiJSON).then(function successCallback(response) {
                        if (response.status == 200) {
                            callback(response.data.payload);
                        } else {
                            callback(false);
                        }
                    }, function errorCallback(response) {
                        console.log("HTTP ERROR");
                        callback(false);
                    });

                }
                if (param.dropdown == 'exchangerate-company') {
                    var apiJSON = {
                        "Payload": param.unique_id
                    };
                    $http.post(api_map['masters']['company']['entity']['get']['endpoint'], apiJSON).then(function successCallback(response) {
                        if (response.status == 200) {
                            callback(response.data.payload.currencyId);
                        } else {
                            callback(false);
                        }
                    }, function errorCallback(response) {
                        console.log("HTTP ERROR");
                        callback(false);
                    });
                    return;
                }
                if (param.dropdown == 'claimSubtype') {
                    if (param.unique_id.ClaimTypeId == 1) {
                        var apiJSON = {
                            "Payload": {
                                "OrderId": param.unique_id.OrderId ? param.unique_id.OrderId : null,
                                "DeliveryProductId": param.unique_id.DeliveryProductId ? param.unique_id.DeliveryProductId : null,
                                "LabResultId": param.unique_id.LabResultId ? param.unique_id.LabResultId : null,
                                "ClaimTypeId": param.unique_id.ClaimTypeId ? param.unique_id.ClaimTypeId : null
                            }
                        };
                        var url = API.BASE_URL_DATA_CLAIMS + "/api/claims/getQuantitySubtypes";
                        $http.post(url, apiJSON).then(function successCallback(response) {
                                if (response.status == 200) {
                                    var result = new Object;
                                    response.data.payload.forEach(function(entry) {
                                        result[entry.specParameter.id] = {
                                            "id": entry.specParameter.id,
                                            "name": entry.specParameter.name,
                                            "isQuantitySubtype": entry.isQuantitySubtype,
                                            "payload": {
                                                "specParameter": entry.specParameter,
                                                "labTestResultId": entry.labTestResultId,
                                                "deliveryQualityParameterId": entry.deliveryQualityParameterId,
                                                "specParameterUom": entry.orderPrice,
                                                "minValue": entry.minValue,
                                                "maxValue": entry.maxValue,
                                                "testValue": entry.testValue,
                                                "id": null,
                                                "isDeleted": false
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
                            function errorCallback(response) {
                                console.log('HTTP ERROR');
                                callback(false);
                                return;
                            }
                        );
                    }
                    if (param.unique_id.ClaimTypeId == 2 || param.unique_id.ClaimTypeId == 3) {
                        var apiJSON = {
                            "Payload": {
                                "OrderId": param.unique_id.OrderId ? param.unique_id.OrderId : null,
                                "DeliveryProductId": param.unique_id.DeliveryProductId ? param.unique_id.DeliveryProductId : null,
                                "LabResultId": param.unique_id.LabResultId ? param.unique_id.LabResultId : null,
                                "ClaimTypeId": param.unique_id.ClaimTypeId ? param.unique_id.ClaimTypeId : null
                            }
                        };
                        var url = API.BASE_URL_DATA_CLAIMS + "/api/claims/getQualitySubtypes";
                        $http.post(url, apiJSON).then(function successCallback(response) {
                                if (response.status == 200) {
                                    var result = new Object;
                                    response.data.payload.forEach(function(entry) {
                                        result[entry.specParameter.id] = {
                                            "id": entry.specParameter.id,
                                            "name": entry.specParameter.name,
                                            "payload": {
                                                "specParameter": entry.specParameter,
                                                "labTestResultId": entry.labTestResultId,
                                                "deliveryQualityParameterId": entry.deliveryQualityParameterId,
                                                "specParameterUom": entry.specParameterUom,
                                                "minValue": entry.minValue,
                                                "maxValue": entry.maxValue,
                                                "testValue": entry.testValue,
                                                "id": null,
                                                "isDeleted": false
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
                            function errorCallback(response) {
                                console.log('HTTP ERROR');
                                callback(false);
                                return;
                            }
                        );
                    }
                    return;
                }
                // if (typeof($listsCache[param.unique_id]) != 'undefined') {
                //     callback($listsCache[param.unique_id]);
                //     return;
                // }
                return;
            },
            custom: function(param, callback) {
                if (_debug) console.log("$APIService dropdown.custom called with params:", param);
                if (param.app == 'masters' && param.screen == 'systeminstrument') {
                    var apiJSON = { "Payload": param.MarketInstrument };
                    var url = API.BASE_URL_DATA_MASTERS + "/api/masters/marketinstruments/get";
                    $http.post(url, apiJSON).then(function successCallback(response) {
                            if (response.status == 200) {
                                var result = new Object;
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
                        function errorCallback(response) {
                            console.log('HTTP ERROR');
                            callback(false);
                            return;
                        }
                    );

                }
                return;
            },
            lookup: function(param, callback) {
                if (_debug) console.log("$APIService dropdown.lookup called with params:", param);

                if (typeof(param.field.Filter) != 'undefined') {
                    callback([{ "id": -1, "name": "Filter not implemented yet!" }]);
                    console.log("$APIService dropdown.lookup filter " + param.field.Filter + " has not been implemented!");
                    return;
                }
                //Custom implementations
                if (param.app == 'claims' && param.field.masterSource == 'Order') {
                    $http.post(api_map[param.app][param.screen]['lookup'][param.field.masterSource]['endpoint'], api_map[param.app][param.screen]['lookup'][param.field.masterSource]['json']).then(function(response) {
                        if (response.status == 200) {
                            callback(response.data.payload);
                        } else {
                            console.log("HTTP ERROR");
                            callback([{ "id": -1, "name": "Error retrieving field " + param.field.masterSource }]);
                        }
                    });
                    return;
                }
                if (param.app == 'masters' && param.field.masterSource.includes("Parent")) {
                    var apiJSON = { "Payload": {} };
                    var url = '';
                    if (param.field.masterSource == 'ParentCounterparty') {
                        url = api_map['masters']['counterparty']['entity']['getParentForSearch']['endpoint'];
                    }
                    if (param.field.masterSource == 'ParentLocation') {
                        url = api_map['masters']['location']['entity']['getParentForSearch']['endpoint'];
                    }
                    if (param.field.masterSource == 'ParentProduct') {
                        url = api_map['masters']['product']['entity']['getParentForSearch']['endpoint'];
                    }
                    if (param.field.masterSource == 'ParentCompany') {
                        url = api_map['masters']['company']['entity']['getParentForSearch']['endpoint'];
                    }
                    if (param.field.masterSource == 'ParentStrategy') {
                        url = api_map['masters']['strategy']['entity']['getParentForSearch']['endpoint'];
                    }
                    if (param.field.masterSource == 'ParentService') {
                        url = api_map['masters']['service']['entity']['getParentForSearch']['endpoint'];
                    }
                    if (param.field.masterSource == 'ParentBuyer') {
                        url = api_map['masters']['buyer']['entity']['getParentForSearch']['endpoint'];
                    }
                    if (url != '') {
                        $http.post(url, apiJSON).then(function successCallback(response) {
                                if (response.data) {
                                    var res = [];
                                    res.push({ "id": -1, "name": "No Parent" });
                                    response.data.payload.forEach(function(entry) {
                                        var temp = {
                                            "id": entry.id,
                                            "name": entry.name
                                        };
                                        res.push(temp);
                                        delete temp;
                                    });
                                    callback(res);
                                } else {
                                    callback({ "id": 0, "name": "Error retrieving parents" });
                                }
                            },
                            function errorCallback(response) {
                                console.log('HTTP ERROR');
                                callback(false);
                                return;
                            });
                    }
                    return;
                }
                if (param.app == 'labs' && param.field.masterSource == 'Order') {
                    $http.post(api_map[param.app][param.screen]['lookup'][param.field.masterSource]['endpoint'], api_map[param.app][param.screen]['lookup'][param.field.masterSource]['json']).then(function(response) {
                        if (response.status == 200) {
                            callback(response.data.payload);
                        } else {
                            console.log("HTTP ERROR");
                            callback([{ "id": -1, "name": "Error retrieving field " + param.field.masterSource }]);
                        }
                    });
                    return;
                    // var apiJSON = {
                    //     "Payload": {
                    //         "Order": null,
                    //         "Filters": [],
                    //         "Pagination": {
                    //             "Skip": 0,
                    //             "Take": 99999
                    //         }
                    //     }
                    // };
                    // $http.post(api_map['orders']['orders']['entity']['list']['endpoint'], apiJSON).then(function successCallback(response) {
                    //         if (response.data) {
                    //             var res = [];
                    //             response.data.payload.forEach(function(entry) {
                    //                 var temp = {
                    //                     "id": entry.order.id,
                    //                     "name": entry.order.name
                    //                 };
                    //                 res.push(temp);
                    //                 delete temp;
                    //             });
                    //             callback(res);
                    //         } else {
                    //             callback({ "id": 0, "name": "Error retrieving orders!" });
                    //         }
                    //         return;
                    //     },
                    //     function errorCallback(response) {
                    //         console.log('HTTP ERROR');
                    //         callback(false);
                    //         return;
                    //     });
                    // return;
                }
                if (param.app == 'admin' && param.screen == 'users' && param.field.masterSource == 'roles') {
                    var apiJSON = { "Payload": true };
                    $http.post(api_map[param.app]['role']['entity']['lookup'], apiJSON).then(function successCallback(response) {
                        if (response.status == 200) {
                            callback(response.data.payload);
                        } else {
                            callback(false);
                        }
                    }, function errorCallback(response) {
                        console.log("HTTP ERROR");
                        callback(false);
                    });
                    return;
                }
                //End Custom implementations
                if (typeof($listsCache[param.field.masterSource]) != 'undefined') callback($listsCache[param.field.masterSource]);
                else {
                    console.log("$APIService dropdown.lookup failed for parameter ", param.field.masterSource);
                    callback([{ "id": -1, "name": "No options defined! Please fix!" }]);
                }
                return;
            }
        }
    };
    return $Api_Service;
}]);
