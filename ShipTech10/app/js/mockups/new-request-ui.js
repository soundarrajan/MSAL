{
    "vesselDetails": {
        "fields": [
                    {
                        "name": "Vessel",
                        "caption": "PAGES.NEW_REQUEST.VESSEL",
                        "type": "lookup",
                        "visible": true
                    },
                    {
                        "name": "VesselImoNo",
                        "caption": "PAGES.NEW_REQUEST.VESSEL_IMO_NO",
                        "type": "lookup",
                        "visible": true      
                    },
                    {
                        "name": "ServiceCode",
                        "caption": "PAGES.NEW_REQUEST.SERVICE_CODE",
                        "type": "lookup",
                        "visible": true                        
                    },
                    {
                        "name": "RequestDate",
                        "caption": "PAGES.NEW_REQUEST.REQUEST_DATE",
                        "type": "datetime",
                        "visible": true                        
                    },
                    {
                        "name": "VesselPumpingRate",
                        "caption": "PAGES.NEW_REQUEST.VESSEL_PUMPING_RATE",
                        "visible": true                        
                    },
                    {
                        "name": "Chartered",
                        "caption": "PAGES.NEW_REQUEST.CHARTERED",
                        "type": "checkbox",
                        "visible": true                        
                    },
                    {
                        "name": "Company",
                        "caption": "Company",
                        "type": "lookup",
                        "visible": true
                    },

                    {
                        "name": "linebreak_1",
                        "type": "linebreak",
                        "visible": true
                    },

                    {
                        "name": "EarliestRedeliveryDate",
                        "caption": "PAGES.NEW_REQUEST.EARLIEST_REDELIVERY_DATE",
                        "type": "datetime",
                        "visible": true                        
                    },
                    {
                        "name": "EstimatedRedeliveryDate",
                        "caption": "PAGES.NEW_REQUEST.ESTIMATED_REDELIVERY_DATE",
                        "type": "datetime",
                        "visible": true                        
                    },
                    {
                        "name": "LatestRedeliveryDate",
                        "caption": "PAGES.NEW_REQUEST.LATEST_REDELIVERY_DATE",
                        "type": "datetime",
                        "visible": true                        
                    }
        ]
    },

    "Locations" : {
        "fields": [
                    {
                        "name": "Eta",
                        "caption": "PAGES.NEW_REQUEST.ETA",
                        "type": "datetime",
                        "visible": true
                    },
                    {
                        "name": "Etb",
                        "caption": "PAGES.NEW_REQUEST.ETB",
                        "type": "datetime",
                        "visible": true
                    },

                    {
                        "name": "Etd",
                        "caption": "PAGES.NEW_REQUEST.ETD",
                        "type": "datetime",
                        "visible": true
                    },
                    {
          			    "name": "recentEta",
                        "caption": "PAGES.NEW_REQUEST.RECENT_ETA",
                        "type": "datetime",
                        "visible": true
                    }, 
                    {
                        "name": "Agent",
                        "caption": "PAGES.NEW_REQUEST.AGENT",
                        "visible": true
                    },                    
                    {
                        "name": "Buyer",
                        "caption": "PAGES.NEW_REQUEST.BUYER",
                        "type": "lookup",
                        "visible": true
                    }
        ],

        "columns": [
                    {
                        "name": "Product",
                        "caption": "PAGES.NEW_REQUEST.PRODUCT",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "ProductType",
                        "caption": "PAGES.NEW_REQUEST.PRODUCT_TYPE",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "ProductCategory",
                        "caption": "PAGES.NEW_REQUEST.PRODUCT_CATEGORY",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "SpecGroup",
                        "caption": "PAGES.NEW_REQUEST.SPEC_GROUP",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "RobOnArrival",
                        "caption": "PAGES.NEW_REQUEST.ROB_ON_ARRIVAL",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "DeliveryOption",
                        "caption": "PAGES.NEW_REQUEST.DELIVERY_OPTION",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "MinQty",
                        "caption": "PAGES.NEW_REQUEST.MIN_QTY",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "MaxQty",
                        "caption": "PAGES.NEW_REQUEST.MAX_QTY",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },                    
                    {
                        "name": "SuggestedLift",
                        "caption": "PAGES.NEW_REQUEST.SUGGESTEDLIFT",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "Uom",
                        "caption": "PAGES.NEW_REQUEST.UOM",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "AgreementType",
                        "caption": "PAGES.NEW_REQUEST.AGREEMENT_TYPE",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "ContractId",
                        "caption": "PAGES.NEW_REQUEST.CONTRACT_ID",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "Comment",
                        "caption": "PAGES.NEW_REQUEST.COMMENT",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },   
                    {
                        "name": "PreTest",
                        "caption": "PAGES.NEW_REQUEST.PRETEST",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },                                     
                    {
                        "name": "expectedPrice",
                        "caption": "PAGES.NEW_REQUEST.EXPECTEDPRICE",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    },
                    {
                        "name": "ProductStatus",
                        "caption": "PAGES.NEW_REQUEST.PRODUCT_STATUS",
                        "visible": true,
                        "alwaysVisible": true,
                        "sortable": false
                    }
        ]
    },

    "FooterSection": {
        "fields": [
                    {
                        "name": "ValidatedBy",
                        "caption": "PAGES.NEW_REQUEST.VALIDATED_BY",
                        "visible": true
                    },
                    {
                        "name": "Comments",
                        "caption": "PAGES.NEW_REQUEST.COMMENTS",
                        "visible": true
                    }
        ]
    }
}
