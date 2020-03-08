export.module = {
    "GeneralInformation": {
        "fields": [
                    {
                        "name": "EtaFrom",
                        "caption": "PAGES.GROUP_OF_REQUESTS.ETA_FROM",
                        "type": "datetime",
                        "visible": true
                    },
                    {
                        "name": "EtaTo",
                        "caption": "PAGES.GROUP_OF_REQUESTS.ETA_TO",
                        "type": "datetime",
                        "visible": true
                    },

                    {
                        "name": "Request",
                        "caption": "PAGES.GROUP_OF_REQUESTS.REQUEST",
                        "type": "lookup",
                        "visible": true      
                    }
        ]
    },

    "BestOffer" : {
        "columns": [
                    {
                        "caption": "",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "requestId",
                        "caption": "PAGES.GROUP_OF_REQUESTS.REQUEST_ID",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "requestId"
                    },
                    {
                        "name": "vessel",
                        "caption": "PAGES.GROUP_OF_REQUESTS.VESSEL",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "vessel"
                    },                    
                    {
                        "name": "locationName",
                        "caption": "PAGES.GROUP_OF_REQUESTS.LOCATION",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "LocationName"
                    },
                    {
                        "name": "eta",
                        "caption": "PAGES.GROUP_OF_REQUESTS.ETA",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "Eta"
                    },
                    {
                        "name": "supplierName",
                        "caption": "PAGES.GROUP_OF_REQUESTS.SUPPLIER",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "SupplierName"
                    },
                    {
                        "name": "physicalSupplierName",
                        "caption": "PAGES.GROUP_OF_REQUESTS.PHYSICAL_SUPPLIER",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "PhysicalSupplierName"
                    },
                    {
                        "name": "productName",
                        "caption": "PAGES.GROUP_OF_REQUESTS.PRODUCT",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "ProductName"
                    },
                    {
                        "name": "minMaxQuantity",
                        "caption": "PAGES.GROUP_OF_REQUESTS.QUANTITY",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "minQuantity"
                    },
                    {
                        "name": "comments",
                        "caption": "PAGES.GROUP_OF_REQUESTS.COMMENT",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "Comments"
                    },
                    {
                        "name": "Price",
                        "caption": "PAGES.GROUP_OF_REQUESTS.PRICE",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "minQuantity"
                    },
                    {
                        "name": "amount",
                        "caption": "PAGES.GROUP_OF_REQUESTS.AMOUNT",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "Amount"
                    },
                    {
                        "name": "additionalCost",
                        "caption": "PAGES.GROUP_OF_REQUESTS.ADDITIONAL_COST",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "additionalCost"
                    },
                    {
                        "name": "totalPrice",
                        "caption": "PAGES.GROUP_OF_REQUESTS.TOTAL_PRICE",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortableName": "totalPrice"
                    }
        ]
    }
}
