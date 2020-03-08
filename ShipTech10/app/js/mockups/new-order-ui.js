export.module = {
    "vesselDetails": {
        "fields": [
                    {
                        "name": "Vessel",
                        "caption": "PAGES.NEW_ORDER.VESSEL",
                        "visible": true
                    },
                    {
                        "name": "VesselImoNo",
                        "caption": "PAGES.NEW_ORDER.VESSEL_IMO_NO",
                        "type": "lookup",
                        "visible": true
                    },
                    {
                        "name": "ServiceCode",
                        "caption": "PAGES.NEW_ORDER.SERVICE_CODE",
                        "type": "lookup",
                        "visible": true
                    },
                    {
                        "name": "OrderDate",
                        "caption": "PAGES.NEW_ORDER.ORDER_DATE",
                        "type": "datetime",
                        "visible": true
                    },
                    {
                        "name": "Buyer",
                        "caption": "PAGES.NEW_ORDER.BUYER_CODE",
                        "visible": true
                    }
        ]
    },

    "orderSummary": {
        "fields": [
        ]
    },

    "sellerDetails": {
        "fields": [
                    {
                        "name": "Seller",
                        "caption": "PAGES.NEW_ORDER.SELLER",
                        "visible": true
                    },
                    {
                        "name": "Contact",
                        "caption": "PAGES.NEW_ORDER.CONTACT",
                        "visible": true
                    },
                    {
                        "name": "PaymntTerms",
                        "caption": "PAGES.NEW_ORDER.PAYMENT_TERMS",
                        "visible": true
                    }
        ]
    },

    "Port" : {
        "fields": [
                    {
                        "name": "locationName",
                        "caption": "PAGES.NEW_ORDER.LOCATION_NAME",
                        "visible": true
                    },
                    {
                        "name": "eta",
                        "caption": "PAGES.NEW_ORDER.ETA",
                        "type": "datetime",
                        "visible": true
                    },
                    {
                        "name": "agentCounterparty",
                        "caption": "PAGES.NEW_ORDER.AGENT",
                        "visible": true
                    },
                    {
                        "name": "carrierCompany",
                        "caption": "PAGES.NEW_ORDER.CARRIER_COMPANY_NAME",
                        "visible": true
                    },
                    {
                        "name": "paymentCompany",
                        "caption": "PAGES.NEW_ORDER.PAYMENT_COMPANY_NAME",
                        "visible": true
                    },
                    {
                        "name": "deliveryDate",
                        "caption": "PAGES.NEW_ORDER.DELIVERY_DATE",
                        "type": "datetime",
                        "visible": true
                    },
                    {
                        "name": "pricingDate",
                        "caption": "PAGES.NEW_ORDER.PRICING_DATE",
                        "type": "datetime",
                        "visible": true
                    },
                    {
                        "name": "transactionLimitStatus",
                        "caption": "PAGES.NEW_ORDER.TRANSACTION_LIMIT_STATUS",
                        "visible": true
                    },
                    {
                        "name": "comments",
                        "caption": "PAGES.NEW_ORDER.COMMENTS",
                        "visible": true
                    }
        ]
    },

    "Product": {
        "columns": [
                    {
                        "name": "Product",
                        "caption": "PAGES.NEW_ORDER.PRODUCT",
                        "visible": true
                    },
                    {
                        "name": "specGroup",
                        "caption": "PAGES.NEW_ORDER.SPEC_GROUP",
                        "visible": true
                    },
                    {
                        "name": "deliveryOption",
                        "caption": "PAGES.NEW_ORDER.DELIVERY_OPTION",
                        "visible": true
                    },
                    {
                        "name": "physicalSupplier",
                        "caption": "PAGES.NEW_ORDER.PHYSICAL_SUPPLIER",
                        "visible": true
                    },
                    {
                        "name": "minQuantity",
                        "caption": "PAGES.NEW_ORDER.MIN_QUANTITY",
                        "visible": true
                    },                    {
                        "name": "maxQuantity",
                        "caption": "PAGES.NEW_ORDER.MAX_QUANTITY",
                        "visible": true
                    },
                    {
                        "name": "price",
                        "caption": "PAGES.NEW_ORDER.PRICE",
                        "visible": true
                    },
                    {
                        "name": "formulaDescription",
                        "caption": "PAGES.NEW_ORDER.FORMULA_DESCRIPTION",
                        "visible": true
                    },
                    {
                        "name": "amount",
                        "caption": "PAGES.NEW_ORDER.AMOUNT",
                        "visible": true
                    },
                    {
                        "name": "agreementType",
                        "caption": "PAGES.NEW_ORDER.AGREEMENT_TYPE",
                        "visible": true
                    },
                    {
                        "name": "status",
                        "caption": "PAGES.NEW_ORDER.STATUS",
                        "visible": true
                    },
                    {
                        "name": "pricingType",
                        "caption": "PAGES.NEW_ORDER.PRICING_TYPE",
                        "visible": true
                    },
                    {
                        "name": "comments",
                        "caption": "PAGES.NEW_ORDER.REQUEST_COMMENTS",
                        "visible": true
                    },
                    {
                        "name": "contractId",
                        "caption": "PAGES.NEW_ORDER.CONTRACT_ID",
                        "visible": true
                    },
                    {
                        "name": "pricingDate",
                        "caption": "PAGES.NEW_ORDER.PRICING_DATE",
                        "visible": true
                    }

        ]
    },

    "additionalCost": {
        "columns": [
                    {
                        "name": "name",
                        "caption": "PAGES.NEW_ORDER.NAME",
                        "visible": true
                    },
                    {
                        "name": "type",
                        "caption": "PAGES.NEW_ORDER.TYPE",
                        "visible": true
                    },
                    {
                        "name": "confirmedQuantity",
                        "caption": "PAGES.NEW_ORDER.CONFIRMED_QUANTITY",
                        "visible": true
                    },
                    {
                        "name": "Price",
                        "caption": "PAGES.NEW_ORDER.PRICE",
                        "visible": true
                    },
                    {
                        "name": "ApplicableFor",
                        "caption": "PAGES.NEW_ORDER.APPLICABLE_FOR",
                        "visible": true
                    },
                    {
                        "name": "Amount",
                        "caption": "PAGES.NEW_ORDER.AMOUNT",
                        "visible": true
                    },
                    {
                        "name": "Extras",
                        "caption": "PAGES.NEW_ORDER.EXTRAS",
                        "visible": true
                    },
                    {
                        "name": "ExtraAmount",
                        "caption": "PAGES.NEW_ORDER.EXTRA_AMOUNT",
                        "visible": true
                    },
                    {
                        "name": "TotalAmount",
                        "caption": "PAGES.NEW_ORDER.TOTAL_AMOUNT",
                        "visible": true
                    },
                    {
                        "name": "Rate",
                        "caption": "PAGES.NEW_ORDER.RATE",
                        "visible": true
                    },
                    {
                        "name": "Comments",
                        "caption": "PAGES.NEW_ORDER.COMMENTS",
                        "visible": true
                    }
        ]
    },

    "nomination": {
        "fields": [
                    {
                        "name": "type",
                        "caption": "PAGES.NEW_ORDER.VALIDATED_BY",
                        "visible": true
                    },
                    {
                        "name": "vessel",
                        "caption": "PAGES.NEW_ORDER.VESSEL",
                        "visible": true
                    },
                    {
                        "name": "broker",
                        "caption": "PAGES.NEW_ORDER.BROKER",
                        "visible": true
                    },
                    {
                        "name": "surveyorCounterparty",
                        "caption": "PAGES.NEW_ORDER.SURVEYOR",
                        "visible": true
                    },
                    {
                        "name": "barge",
                        "caption": "PAGES.NEW_ORDER.BARGE",
                        "visible": true
                    },
                    {
                        "name": "lab",
                        "caption": "PAGES.NEW_ORDER.LAB",
                        "visible": true
                    }

        ]
    }
}
