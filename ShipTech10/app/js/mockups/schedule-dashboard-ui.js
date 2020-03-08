export.module = {
    "tables": {
        "scheduleDashboardTable": {
            "columns": [
                {
                    "caption": "",
                    "visible": true,
                    "alwaysVisible": true,
                    "sortable": false
                },
                {
                    "caption": "",
                    "visible": true,
                    "alwaysVisible": true,
                    "sortable": false
                },
                {
                    "caption": "",
                    "visible": true,
                    "alwaysVisible": true,
                    "sortable": false
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.REQUEST_ID",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_request_id"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.STATUS",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_portStatus"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.SERVICES",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "serviceName"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.VESSEL",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "vesselName"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.REQUEST_PRODUCT",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_request_requestDetail_fuelOilOfRequest"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.PRODUCT_TYPE",
                    "visible": true,
                    "sortable": true,
                    "sortableName":  "voyageDetail_request_requestDetail_fuelOilOfRequestType_Id"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.VOYAGE_CODE",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_locationCode"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.LOCATION",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_locationName"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.ETA",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_eta"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.BUYER",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "buyerName"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.AGREEMENT",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_request_requestDetail_agreementType"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.MINMAX",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_request_requestDetail_fuelMinQuantity"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.DISTILLATE",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "defaultDistillate"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.COMPANY",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "companyName"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.DEFAULT_FUEL",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "defaultFuel"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.DEFAULT_LSFO",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "defaultLsfo"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.COMMENT",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "comment"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.VESSELVOYAGEID",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_vesselVoyageId"
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_TABLE.CONTRACTUALMINMAX",
                    "visible": true,
                    "sortable": true,
                    "sortableName": "voyageDetail_request_requestDetail_contractMinQuantity"
                }
            ]
        },
        "scheduleDashboardCalendar": {
            "columns": [
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_CALENDAR.SERVICE",
                    "visible": true,
                    "sortable": true
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_CALENDAR.VESSEL",
                    "visible": true,
                    "sortable": true
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_CALENDAR.BUYER",
                    "visible": true,
                    "sortable": true
                },
                {
                    "caption": "PAGES.SCHEDULE_DASHBOARD_CALENDAR.COMPANY",
                    "visible": true,
                    "sortable": true
                }
            ],
            "dateScroller": {
                "default": {
                    "startDate": 7,
                    "dayCount": 28,
                    "visibleColCount": 28,
                    "defaultHiddenColsLeft": 0,
                    "defaultHiddenColsRight": 0,
                    "timeframeDelta": 28,
                    "calendarUnit": "d"
                },
                "week": {
                    "startDate": "week_start",
                    "dayCount": 7,
                    "visibleColCount": 7,
                    "defaultHiddenColsLeft": 0,
                    "defaultHiddenColsRight": 0,
                    "timeframeDelta": 7,
                    "calendarUnit": "d"
                },
                "day": {
                    "startDate": "day_start",
                    "dayCount": 24,
                    "visibleColCount": 24,
                    "defaultHiddenColsLeft": 0,
                    "defaultHiddenColsRight": 0,
                    "timeframeDelta": 1,
                    "calendarUnit": "h"
                }
            }
        }
    }
}
