import { KeyedMenuItems } from './sidebar-view.model';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';

export const BASE_MENU: KeyedMenuItems = {
  masters: {
    label: 'Masters',
    items: {
      additional_cost: {
        label: 'Additional cost',
        items: {
          additional_cost_list: {
            label: 'Additional cost List',
            url: '/#/masters/additionalcost',
            target: '_blank'
          },
          new_additional_cost: {
            label: 'New additional cost',
            url: '/#/masters/additionalcost/edit/',
            target: '_blank'
          }
        }
      },
      agreement_type: {
        label: 'Agreement type',
        items: {
          agreement_type_list: {
            label: 'Agreement type List',
            url: '/#/masters/agreementtype',
            target: '_blank'
          },
          new_agreement_type: {
            label: 'New agreement type',
            url: '/#/masters/agreementtype/edit/',
            target: '_blank'
          }
        }
      },
      barge: {
        label: 'Barge',
        items: {
          barge_list: {
            label: 'Barge List',
            url: '/#/masters/barge',
            target: '_blank'
          },
          new_barge: {
            label: 'New barge',
            url: '/#/masters/barge/edit/',
            target: '_blank'
          }
        }
      },
      buyer: {
        label: 'Buyer',
        items: {
          buyer_list: {
            label: 'Buyer List',
            url: '/#/masters/buyer',
            target: '_blank'
          },
          new_buyer: {
            label: 'New buyer',
            url: '/#/masters/buyer/edit/',
            target: '_blank'
          }
        }
      },
      calendar: {
        label: 'Calendar',
        items: {
          calendar_list: {
            label: 'Calendar List',
            url: '/#/masters/calendar',
            target: '_blank'
          },
          new_calendar: {
            label: 'New calendar',
            url: '/#/masters/calendar/edit/',
            target: '_blank'
          }
        }
      },
      claim_type: {
        label: 'Claim Type',
        items: {
          claim_type_list: {
            label: 'Claim Type List',
            url: '/#/masters/claimtype',
            target: '_blank'
          },
          new_claim_type: {
            label: 'New claim type',
            url: '/#/masters/claimtype/edit/',
            target: '_blank'
          }
        }
      },
      company: {
        label: 'TO BE OVERRIDDEN',
        items: {
          company_list: {
            label: 'TO BE OVERRIDDEN',
            url: '/#/company',
            target: '_blank'
          },
          new_company: {
            label: 'TO BE OVERRIDDEN',
            url: 'company/edit',
            target: '_blank'
          }
        }
      },
      contact_type: {
        label: 'Contact type',
        items: {
          contact_type_list: {
            label: 'Contact type List',
            url: '/#/masters/contacttype',
            target: '_blank'
          },
          new_contact_type: {
            label: 'New contact type',
            url: '/#/masters/contacttype/edit/',
            target: '_blank'
          }
        }
      },
      counterparty: {
        label: 'Counterparty',
        items: {
          counterparty_list: {
            label: 'Counterparty List',
            url: '/#/masters/counterparty',
            target: '_blank'
          },
          new_counterparty: {
            label: 'New Counterparty',
            url: '/#/masters/counterparty/edit/',
            target: '_blank'
          }
        }
      },
      country: {
        label: 'Country',
        items: {
          country_list: {
            label: 'Country List',
            url: '/#/masters/country',
            target: '_blank'
          },
          new_country: {
            label: 'New country',
            url: '/#/masters/country/edit/',
            target: '_blank'
          }
        }
      },
      currency: {
        label: 'Currency',
        items: {
          currency_list: {
            label: 'Currency List',
            url: '/#/masters/currency',
            target: '_blank'
          },
          new_currency: {
            label: 'New currency',
            url: '/#/masters/currency/edit/',
            target: '_blank'
          }
        }
      },
      delivery_option: {
        label: 'Delivery option',
        items: {
          delivery_option_list: {
            label: 'Delivery option List',
            url: '/#/masters/deliveryoption',
            target: '_blank'
          },
          new_delivery_option: {
            label: 'New delivery option',
            url: '/#/masters/deliveryoption/edit/',
            target: '_blank'
          }
        }
      },
      document_type: {
        label: 'Document type',
        items: {
          document_type_list: {
            label: 'Document type List',
            url: '/#/masters/documenttype',
            target: '_blank'
          },
          new_document_type: {
            label: 'New document type',
            url: '/#/masters/documenttype/edit/',
            target: '_blank'
          }
        }
      },
      email_logs: {
        label: 'Email Logs',
        items: {
          email_logs: {
            label: 'Email Logs',
            url: '/#/masters/emaillogs',
            target: '_blank'
          }
        }
      },
      event: {
        label: 'Event',
        items: {
          event_list: {
            label: 'Event List',
            url: '/#/masters/event',
            target: '_blank'
          },
          new_event: {
            label: 'New event',
            url: '/#/masters/event/edit/',
            target: '_blank'
          }
        }
      },
      exchange_rate: {
        label: 'Exchange rate',
        items: {
          exchange_rate_list: {
            label: 'Exchange rate List',
            url: '/#/masters/exchangerate',
            target: '_blank'
          },
          new_exchange_rate: {
            label: 'New exchange rate',
            url: '/#/masters/exchangerate/edit/',
            target: '_blank'
          }
        }
      },
      formula: {
        label: 'Formula',
        items: {
          formula_list: {
            label: 'Formula List',
            url: '/#/masters/formula',
            target: '_blank'
          },
          new_formula: {
            label: 'New formula',
            url: '/#/masters/formula/edit/',
            target: '_blank'
          }
        }
      },
      incoterms: {
        label: 'Incoterms',
        items: {
          incoterms_list: {
            label: 'Incoterms List',
            url: '/#/masters/incoterms',
            target: '_blank'
          },
          new_incoterms: {
            label: 'New incoterms',
            url: '/#/masters/incoterms/edit/',
            target: '_blank'
          }
        }
      },
      location: {
        label: 'Location',
        items: {
          location_list: {
            label: 'Location List',
            url: '/#/masters/location',
            target: '_blank'
          },
          new_location: {
            label: 'New Location',
            url: '/#/masters/location/edit/',
            target: '_blank'
          }
        }
      },
      market_instrument: {
        label: 'Market instrument',
        items: {
          market_instrument_list: {
            label: 'Market instrument List',
            url: '/#/masters/marketinstrument',
            target: '_blank'
          },
          new_market_instrument: {
            label: 'New market instrument',
            url: '/#/masters/marketinstrument/edit/',
            target: '_blank'
          }
        }
      },
      payment_term: {
        label: 'Payment term',
        items: {
          payment_term_list: {
            label: 'Payment term List',
            url: '/#/masters/paymentterm',
            target: '_blank'
          },
          new_payment_term: {
            label: 'New payment term',
            url: '/#/masters/paymentterm/edit/',
            target: '_blank'
          }
        }
      },
      period: {
        label: 'Period',
        items: {
          period_list: {
            label: 'Period List',
            url: '/#/masters/period',
            target: '_blank'
          },
          new_period: {
            label: 'New period',
            url: '/#/masters/period/edit/',
            target: '_blank'
          }
        }
      },
      price_master: {
        label: 'Price master',
        items: {
          price_list: {
            label: 'Price List',
            url: '/#/masters/price',
            target: '_blank'
          },
          new_price: {
            label: 'New price',
            url: '/#/masters/price/edit/',
            target: '_blank'
          }
        }
      },
      price_type: {
        label: 'Price type',
        items: {
          price_type_list: {
            label: 'Price type List',
            url: '/#/masters/pricetype',
            target: '_blank'
          },
          new_price_type: {
            label: 'New Price type',
            url: '/#/masters/pricetype/edit/',
            target: '_blank'
          }
        }
      },
      product: {
        label: 'Product',
        items: {
          product_list: {
            label: 'Product List',
            url: '/#/masters/product',
            target: '_blank'
          },
          new_product: {
            label: 'New product',
            url: '/#/masters/product/edit/',
            target: '_blank'
          }
        }
      },
      service: {
        label: 'TO BE OVERRIDDEN',
        items: {
          service_list: {
            label: 'TO BE OVERRIDDEN',
            url: '/#/service',
            target: '_blank'
          },
          new_service: {
            label: 'TO BE OVERRIDDEN',
            url: 'service/edit',
            target: '_blank'
          }
        }
      },
      spec_group: {
        label: 'Spec group',
        items: {
          spec_group_list: {
            label: 'Spec group List',
            url: '/#/masters/specgroup',
            target: '_blank'
          },
          new_spec_group: {
            label: 'New Spec group',
            url: '/#/masters/specgroup/edit/',
            target: '_blank'
          }
        }
      },
      spec_parameter: {
        label: 'Spec parameter',
        items: {
          spec_parameter_list: {
            label: 'Spec parameter List',
            url: '/#/masters/specparameter',
            target: '_blank'
          },
          new_spec_parameter: {
            label: 'New Spec parameter',
            url: '/#/masters/specparameter/edit/',
            target: '_blank'
          }
        }
      },
      status: {
        label: 'Status',
        items: {
          status_list: {
            label: 'Status List',
            url: '/#/masters/status',
            target: '_blank'
          },
          new_status: {
            label: 'New status',
            url: '/#/masters/status/edit/',
            target: '_blank'
          }
        }
      },
      strategy: {
        label: 'Strategy',
        items: {
          strategy_list: {
            label: 'Strategy List',
            url: '/#/masters/strategy',
            target: '_blank'
          },
          new_strategy: {
            label: 'New strategy',
            url: '/#/masters/strategy/edit/',
            target: '_blank'
          }
        }
      },
      system_instrument: {
        label: 'System instrument',
        items: {
          system_instrument_list: {
            label: 'System instrument List',
            url: '/#/masters/systeminstrument',
            target: '_blank'
          },
          new_system_instrument: {
            label: 'New system instrument',
            url: '/#/masters/systeminstrument/edit/',
            target: '_blank'
          }
        }
      },
      uom: {
        label: 'UOM',
        items: {
          uom_list: {
            label: 'UOM List',
            url: '/#/masters/uom',
            target: '_blank'
          },
          new_uom: {
            label: 'New UOM',
            url: '/#/masters/uom/edit/',
            target: '_blank'
          }
        }
      },
      vessel: {
        label: 'Vessel',
        items: {
          vessel_list: {
            label: 'Vessel List',
            url: '/#/masters/vessel',
            target: '_blank'
          },
          new_vessel: {
            label: 'New vessel',
            url: '/#/masters/vessel/edit/',
            target: '_blank'
          }
        }
      },
      vessel_type: {
        label: 'Vessel type',
        items: {
          vessel_type_list: {
            label: 'Vessel type List',
            url: '/#/masters/vesseltype',
            target: '_blank'
          },
          new_vessel_type: {
            label: 'New vessel type',
            url: '/#/masters/vesseltype/edit/',
            target: '_blank'
          }
        }
      }
    }
  },
  procurement: {
    label: 'Procurement',
    items: {
      schedule_dashboard: {
        label: 'Schedule Dashboard',
        items: {
          schedule_dashboard_calendar: {
            label: 'Schedule Dashboard Calendar',
            url: '/#/schedule-dashboard-calendar',
            target: '_blank'
          },
          schedule_dashboard_table: {
            label: 'Schedule Dashboard Table',
            url: '/#/schedule-dashboard-table',
            target: '_blank'
          },
          schedule_dashboard_timeline: {
            label: 'Schedule Dashboard Timeline',
            url: '/#/schedule-dashboard-timeline',
            target: '_blank'
          }
        }
      },
      request: {
        label: 'Request',
        items: {
          request_list: {
            label: 'Request List',
            url: '/#/all-requests-table',
            target: '_blank'
          },
          new_request: {
            label: 'New Request',
            url: '/#/new-request',
            target: '_blank'
          }
        }
      },
      order: {
        label: 'Order',
        items: {
          order_list: {
            label: 'Order List',
            url: '/#/order-list',
            target: '_blank'
          },
          new_order: {
            label: 'New Order',
            url: '/#/new-order',
            target: '_blank'
          },
          sap_export: {
            label: 'SAP Export',
            url: '/#/sap-export',
            target: '_blank'
          }
        }
      },
      contract_planning: {
        label: 'Contract Planning',
        url: '/#/contract-planning/',
        target: '_blank'
      }
    }
  },
  contract: {
    label: 'Contract',
    items: {
      contract_list: {
        label: 'Contract list',
        url: '/#/contracts/contract',
        target: '_blank'
      },
      new_contract: {
        label: 'New contract',
        url: '/v2/contracts/contract/0/details',
        target: '_blank'
      }
    }
  },
  delivery: {
    label: 'Delivery',
    items: {
      qualityControl: {
        label: 'Quantity Control List',
        routerLink: [`/${KnownPrimaryRoutes.QuantityControl}`],
        target: '_blank'
      },
      orders_to_be_delivered: {
        label: 'Orders to be delivered',
        url: '/#/delivery/ordersdelivery',
        target: '_blank'
      },
      new_delivery: {
        label: 'New delivery',
        url: '/v2/delivery/delivery/0/details',
        target: '_blank'
      },
      delivery_list: {
        label: 'Delivery List',
        url: '/#/delivery/delivery',
        target: '_blank'
      },
      deliveries_to_be_verified: {
        label: 'Deliveries to be verified',
        url: '/#/delivery/deliveriestobeverified',
        target: '_blank'
      }
    }
  },
  labs: {
    label: 'Labs',
    items: {
      lab_results_list: {
        label: 'Lab results list',
        url: '/#/labs/labresult',
        target: '_blank'
      },
      new_lab_result: {
        label: 'New lab result',
        url: '/#/labs/labresult/edit/',
        target: '_blank'
      }
    }
  },
  claims: {
    label: 'Claims',
    items: {
      claims_list: {
        label: 'Claims list',
        url: '/#/claims/claim',
        target: '_blank'
      },
      new_claim: {
        label: 'New claim',
        url: '/#/claims/claim/edit/',
        target: '_blank'
      }
    }
  },
  invoices: {
    label: 'Invoices',
    items: {
      invoice_deliveries_list: {
        label: 'Deliveries list',
        url: '/#/invoices/deliveries',
        target: '_blank'
      },
      claims_list: {
        label: 'Claims list',
        url: '/#/invoices/claims',
        target: '_blank'
      },
      invoices_list: {
        label: 'Invoices list',
        url: '/#/invoices/invoice',
        target: '_blank'
      },
      complete_view: {
        label: 'Complete view',
        url: '/#/invoices/complete_view',
        target: '_blank'
      },
      treasury_report: {
        label: 'Treasury report',
        url: '/#/invoices/treasuryreport',
        target: '_blank'
      }
    }
  },
  recon: {
    label: 'Recon',
    items: {
      recon_list: {
        label: 'Recon list',
        url: '/#/recon/reconlist',
        target: '_blank'
      }
    }
  },
  admin: {
    label: 'Admin',
    items: {
      users_list: {
        label: 'Users list',
        items: {
          users_list: {
            label: 'Users List',
            url: '/#/admin/users',
            target: '_blank'
          },
          new_user: {
            label: 'New user',
            url: '/#/admin/users/edit/',
            target: '_blank'
          }
        }
      },
      roles_list: {
        label: 'Roles list',
        items: {
          roles_list: {
            label: 'Roles List',
            url: '/#/admin/role',
            target: '_blank'
          },
          new_role: {
            label: 'New Role',
            url: '/#/admin/role/edit/',
            target: '_blank'
          }
        }
      },
      configuration: {
        label: 'Configuration',
        url: '/#/admin/configuration/edit/1',
        target: '_blank'
      },
      import_data: {
        label: 'Order to Invoice Import',
        url: '/#/admin/order-import',
        target: '_blank'
      },
      seller_rating: {
        label: 'Seller Rating',
        url: '/#/admin/sellerrating/edit/',
        target: '_blank'
      },
      alerts: {
        label: 'Alerts',
        items: {
          alerts_list: {
            label: 'Alerts list',
            url: '/#/alerts',
            target: '_blank'
          }
        }
      }
    }
  },
  reports: {
    label: 'Reports',
    url: '/#/reports',
    target: '_blank'
  },
  integrations: {
    label: 'Integrations'
  }
};
