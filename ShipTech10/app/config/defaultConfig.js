var appConfig = function () {
    var returnVars = {
        "auth": {
            "instance": "https://login.microsoftonline.com/",
            "tenant": "twentyfoursoftwareoutlook.onmicrosoft.com",
            "clientId": "3e7b4241-b1e6-4769-bb5c-989d64458e51",
            "authEndpoint" :"/oauth2/authorize",
            "extraQueryParameter": "nux=1",
            "logOutUri": "",
            "endpoints": {
                "http://mail.24software.ro:8081/": "3e7b4241-b1e6-4769-bb5c-989d64458e51",
                "https://app.powerbi.com": "https://analysis.windows.net/powerbi/api",
                "https://api.powerbi.com": "https://analysis.windows.net/powerbi/api"
            },
            "anonymousEndpoints": ["http://shiptech10.24software.ro:8081/"],
            "postLogoutRedirectUri": null,
            "expireOffsetSeconds": 10
        },
        "tenantConfigs": {
            "translations": "CMA"
        },
        "STATE": {
            "DEFAULT": "default",
            "HOME": "default.home",
            "DASHBOARD_TABLE": "default.dashboard-table",
            "DASHBOARD_CALENDAR": "default.dashboard-calendar",
            "NEW_REQUEST": "default.new-request",
            "EDIT_REQUEST": "default.edit-request",
            "VIEW_REQUEST_DOCUMENTS": "default.view-request-documents",
            "VIEW_REQUEST_AUDITLOG": "default.view-request-auditlog",
            "VIEW_REQUEST_EMAILLOG": "default.view-request-emaillog",
            "VIEW_GROUP_OF_REQUESTS_EMAILLOG": "default.group-of-requests-emaillog",
            "COPY_REQUEST": "default.copy-request",
            "ALL_REQUESTS_TABLE": "default.all-requests-table",
            "GROUP_OF_REQUESTS": "default.group-of-requests",
            "NEW_ORDER": "default.new-order",
            "EDIT_ORDER": "default.edit-order",
            "VIEW_ORDER_DOCUMENTS": "default.view-order-documents",
            "VIEW_ORDER_AUDITLOG": "default.view-order-auditlog",
            "VIEW_ORDER_EMAILLOG": "default.view-order-emaillog",
            "ORDER_LIST": "default.order-list",
            "ORDER_TRANSACTION_KPI": "default.order-transaction-kpi",
            "SELECT_CONTRACT": "default.select-contract",
            "SUPPLIER_PORTAL": "default.supplier-portal",
            "PREVIEW_EMAIL": "default.preview-email",
            "VIEW_RFQ": "default.view-rfq",
            "CONTRACT_PLANNING": "default.contract-planning",
            "CONTRACT_EVALUATION": "default.contract-evaluation",
            "VIEW_GROUP_OF_REQUESTS_DOCUMENTS": "default.view-group-of-requests-documents",
            "SAP_EXPORT": "default.sap-export",
            "REPORTS": "default.reports"
        },
        "VIEW_TYPES": {
            "LIST": ["default.dashboard-table", "default.all-requests-table", "default.order-list", "default.view-rfq", "default.select-contract", "default.contract-planning", "default.contract-evaluation"]
        },
        "API": {
            "BASE_URL_DATA_PROCUREMENT": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Procurement",
            "BASE_URL_DATA_EMAIL": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Mail",
            "BASE_URL_DATA_MASTERS": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Masters",
            "BASE_URL_DATA_ADMIN": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Admin",
            "BASE_URL_DATA_INFRASTRUCTURE": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Infrastructure",
            "BASE_URL_DATA_SELLER_PORTAL": "http://shiptech10.24software.ro:8081/Integration1060/Shiptech10.Api.SellerPortal",
            "BASE_URL_DATA_CLAIMS": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Claims",
            "BASE_URL_DATA_LABS": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Labs",
            "BASE_URL_DATA_CONTRACTS": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Contracts",
            "BASE_URL_DATA_DELIVERY": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Delivery",
            "BASE_URL_DATA_RECON": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Recon",
            "BASE_URL_DATA_SELLERRATING": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.SellerRating",
            "BASE_URL_DATA_INVOICES": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Invoice",
            "BASE_URL_DATA_ALERTS": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.BusinessAlerts",
            "BASE_URL_DATA_HANGFIRE": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Hangfire",
            "BASE_URL_DATA_MAIL": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Mail",
            "BASE_URL_DATA_IMPORTEXPORT": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.ImportExport",
            "BASE_URL_UI": "http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Infrastructure/api/infrastructure/screenlayout",
            "BASE_URL_OPEN_SERVER": "http://shiptech10.24software.ro:8160",
            "BASE_HEADER_FOR_NOTIFICATIONS": "http://mail.24software.ro:8160",
            "BASE_URL": "http://mail.24software.ro:8081/Integration1060/",
            "USE_LOCAL_MOCKUPS": false
        },
        "SCREEN_LAYOUTS": {
            "SCHEDULE_DASHBOARD": 1,
            "NEW_REQUEST": 4,
            "NEW_ORDER": 7,
            "REQUEST_LIST": 3,
            "GROUP_OF_REQUESTS": 5
        },
        "TIMESCALE": {
            "DEFAULT": "default",
            "DAY": "day",
            "WEEK": "week"
        },
        "CUSTOM_EVENTS": {
            "BREADCRUMB_FILTER_STATUS": "breadcrumbsFilter",
            "BREADCRUMB_REFRESH_PAGE": "breadcrumbsRefreshPage",
            "NOTIFICATION_RECEIVED": "notificationReceived"
        },
        "LOOKUP_TYPE": {
            "VESSEL": "vessels",
            "COMPANY": "companies",
            "VOYAGES": "voyages",
            "LOCATIONS": "locations",
            "PRODUCTS": "products",
            "REQUEST": "request",
            "SERVICES": "services",
            "BUYER": "buyer",
            "SELLER": "counterparties",
            "BROKER": "counterparties",
            "SURVEYOR": "counterparties",
            "LAB": "counterparties",
            "BARGE": "counterparties",
            "VESSEL_SCHEDULE": "vesselSchedules",
            "AGENT": "counterparties",
            "SUPPLIER": "counterparties",
            "PHYSICAL_SUPPLIER": "counterparties",
            "CONTRACT": "contract",
            "COUNTERPARTIES": "counterparties",
            "PAYMENT_TERM": "paymentTerm",
            "DESTINATIONS": "destinations",
            "CONTRACT_SELLER": "getWithContracts",
            "NO_QUOTE_REASON": "noQuoteReason"
        },
        "LOOKUP_MAP": {
            "Vessel": "vessels",
            "VesselImoNo": "vessels",
            "VesselPumpingRate": "vessels",
            "Company": "companies",
            "carrierCompany": "companies",
            "paymentCompany": "companies",
            "Ports": "locations",
            "Voyages": "voyages",
            "Product": "products",
            "QuotedProduct": "products",
            "Request": "request",
            "ServiceCode": "services",
            "Agent": "agent",
            "Buyer": "buyer",
            "locationName": "locations",
            "Seller": "seller",
            "broker": "broker",
            "surveyorCounterparty": "surveyor",
            "PhysicalSupplier": "physicalSupplier",
            "lab": "lab",
            "barge": "barge",
            "contract": "contract",
            "Destinations": "locations",
            "PaymntTerms": "paymentTerm",
            "noQuoteReason": "noQuoteReason"
        },
        "SCREEN_ACTIONS": {
            "COPY": "Copy",
            "CANCEL": "Cancel",
            "CREATERFQ": "CreateRfq",
            "SKIPRFQ": "SkipRfq",
            "SENDRFQ": "SendRfq",
            "AMENDRFQ": "AmendRfq",
            "REVOKERFQ": "RevokeRfq",
            "INCLUDEINRFQ": "IncludeInRfq",
            "DELINKRFQ": "DelinkFromRfq",
            "REVIEW": "Review",
            "GOSPOT": "GoSpot",
            "GOCONTRACT": "GoContract",
            "VALIDATEPREREQUEST": "ValidatePreRequest",
            "SENDQUESTIONNAIRE": "SendQuestionnaire",
            "CONFIRM": "Confirm",
            "REJECTORDER": "RejectOrder",
            "CANCELORDER": "CancelOrder",
            "APPROVEORDER": "ApproveOrder",
            "AMENDORDER": "AmendOrder",
            "REQUOTE": "Requote",
            "RECONFIRM": "ReConfirm",
            "SUBMITFORAPPROVAL": "SubmitForApproval",
            "CONFIRMSELLEREMAIL": "ConfirmSellerEmail",
            "CONFIRMALLEMAIL": "ConfirmAllEmail",
            "SHOWSOFTSTOPCONFIRMEMAIL": "ShowSoftStopConfirmEmail",
            "SHOWSOFTSTOPSELLEREMAIL": "ShowSoftStopSellerEmail",
            "SHOWHARDSTOPCONFIRMEMAIL": "ShowHardStopConfirmEmail",
            "SHOWHARDSTOPSELLEREMAIL": "ShowHardStopSellerEmail"
        },
        "IDS": {
            "BROKER_COUNTERPARTY_ID": 3,
            "SURVEYOR_COUNTERPARTY_ID": 6,
            "BARGE_COUNTERPARTY_ID": 7,
            "LAB_COUNTERPARTY_ID": 8,
            "AGENT_COUNTERPARTY_ID": 5,
            "SELLER_COUNTERPARTY_ID": 2,
            "SUPPLIER_COUNTERPARTY_ID": 1,
            "FAKE_SELLER_TYPE_ID": -1
        },
        "VALIDATION_MESSAGES": {
            "SUCCESS": "Operation completed successfully!",
            "GENERAL_ERROR": "An error has occured!",
            "INVALID_FIELDS": "The following fields are required or invalid: ",
            "UNAUTHORIZED": "User is unauthorized to perform this action."
        },
        "ORDER_COMMANDS": {
            "CONFIRM": "confirm",
            "CONFIRMONLY": "confirmOnly",
            "RECONFIRM": "reConfirm",
            "CANCEL": "cancel",
            "REJECT": "reject",
            "APPROVE": "approve",
            "AMEND": "amend",
            "SUBMIT_FOR_APPROVAL": "submitForApproval",
            "CONFIRM_TO_SELLER": "confirmToSeller",
            "CONFIRM_TO_ALL": "confirmToAll",
            "CONFIRM_TO_LABS": "confirmToLab",
            "CONFIRM_TO_SURVEYOR": "confirmToSurveyor"
        },
        "STATUS": {
            "CANCELLED": {
                "id": 14,
                "name": "Cancelled"
            },
            "AMENDED": {
                "id": 17,
                "name": "Amended"
            },
            "STEMMED": {
                "id": 12,
                "name": "Stemmed"
            },
            "PARTIALLY_STEMMED": {
                "id": 11,
                "name": "PartiallyStemmed"
            }
        },
        "COST_TYPE_IDS": {
            "FLAT": 1,
            "UNIT": 2,
            "PERCENT": 3
        },
        "COMPONENT_TYPE_IDS": {
            "TAX_COMPONENT": 1,
            "PRODUCT_COMPONENT": 2
        },
        "SELLER_SORT_ORDER": {
            "PREFERENCE": "Preference",
            "ALPHABET": "Alphabet",
            "RATING": "Rating"
        },
        "PRODUCT_STATUS_IDS": {
            "PARTIALLY_INQUIRED": 7,
            "INQUIRED": 8,
            "QUOTED": 10
        },
        "EXPORT_FILETYPE": {
            "NONE": 0,
            "EXCEL": 1,
            "CSV": 2,
            "PDF": 3
        },
        "VALIDATION_STOP_TYPE_IDS": {
            "HARD": 1,
            "SOFT": 2
        },
        "EXPORT_FILETYPE_EXTENSION": {
            "0": "",
            "1": "xls",
            "2": "csv",
            "3": "pdf"
        },
        "PACKAGES_CONFIGURATION": {
            "ENABLED": true
        },
        "EMAIL_TRANSACTION": {
            "REQUEST": "PreRequest",
            "GROUP_OF_REQUESTS": "NewRfq",
            "REQUOTE": "Requote",
            "VIEW_RFQ": "RequestChanges",
            "ORDER": "Order",
            "ORDER_CONFIRM": "OrderConfirmationToSellerOrVessel",
            "CONTRACT_PLANNING": "ContractPlanning"
        }
    }
    return returnVars;
}();
