export interface IAuthLegacyConfig {
  instance: string;
  tenant: string;
  clientId: string;
  authEndpoint: string;
  cacheLocation: string;
  extraQueryParameter: string;
  logOutUri: string;
  endpoints: Record<string, string>;
  anonymousEndpoints: string[];
  postLogoutRedirectUri?: any;
  expireOffsetSeconds: number;
}

export interface ITenantLegacyConfig {
  translations: string;
  showCalenderView: boolean;
}

export interface IStateLegacyConfig {
  DEFAULT: string;
  HOME: string;
  DASHBOARD_TABLE: string;
  DASHBOARD_TIMELINE: string;
  DASHBOARD_CALENDAR: string;
  NEW_REQUEST: string;
  EDIT_REQUEST: string;
  VIEW_REQUEST_DOCUMENTS: string;
  VIEW_REQUEST_AUDITLOG: string;
  VIEW_REQUEST_EMAILLOG: string;
  VIEW_GROUP_OF_REQUESTS_EMAILLOG: string;
  COPY_REQUEST: string;
  ALL_REQUESTS_TABLE: string;
  GROUP_OF_REQUESTS: string;
  NEW_ORDER: string;
  EDIT_ORDER: string;
  VIEW_ORDER_DOCUMENTS: string;
  VIEW_ORDER_AUDITLOG: string;
  VIEW_ORDER_EMAILLOG: string;
  ORDER_LIST: string;
  ORDER_TRANSACTION_KPI: string;
  SELECT_CONTRACT: string;
  SUPPLIER_PORTAL: string;
  PREVIEW_EMAIL: string;
  VIEW_RFQ: string;
  CONTRACT_PLANNING: string;
  CONTRACT_EVALUATION: string;
  VIEW_GROUP_OF_REQUESTS_DOCUMENTS: string;
  SAP_EXPORT: string;
  REPORTS: string;
}

export interface IViewTypesLegacyConfig {
  LIST: string[];
}

export interface IApiUrlsLegacyConfig {
  BASE_URL_DATA_PROCUREMENT: string;
  BASE_URL_DATA_EMAIL: string;
  BASE_URL_DATA_MASTERS: string;
  BASE_URL_DATA_ADMIN: string;
  BASE_URL_DATA_BOPS: string;
  BASE_URL_DATA_INFRASTRUCTURE: string;
  BASE_URL_DATA_SELLER_PORTAL: string;
  BASE_URL_DATA_CLAIMS: string;
  BASE_URL_DATA_LABS: string;
  BASE_URL_DATA_CONTRACTS: string;
  BASE_URL_DATA_DELIVERY: string;
  BASE_URL_DATA_RECON: string;
  BASE_URL_DATA_SELLERRATING: string;
  BASE_URL_DATA_INVOICES: string;
  BASE_URL_DATA_ALERTS: string;
  BASE_URL_DATA_HANGFIRE: string;
  BASE_URL_DATA_MAIL: string;
  BASE_URL_DATA_IMPORTEXPORT: string;
  BASE_URL_DATA_SMART: string;
  BASE_URL_UI: string;
  BASE_URL_OPEN_SERVER: string;
  BASE_HEADER_FOR_NOTIFICATIONS: string;
  BASE_URL: string;
  USE_LOCAL_MOCKUPS: boolean;
}

export interface IScreenLayoutsLegacyConfig {
  SCHEDULE_DASHBOARD: number;
  NEW_REQUEST: number;
  NEW_ORDER: number;
  REQUEST_LIST: number;
  GROUP_OF_REQUESTS: number;
}

export interface ITimescaleLegacyConfig {
  DEFAULT: string;
  DAY: string;
  WEEK: string;
}

export interface ICustomEventsLegacyConfig {
  BREADCRUMB_FILTER_STATUS: string;
  BREADCRUMB_REFRESH_PAGE: string;
  NOTIFICATION_RECEIVED: string;
}

export interface ILookupTypeLegacyConfig {
  VESSEL: string;
  COMPANY: string;
  VOYAGES: string;
  LOCATIONS: string;
  PRODUCTS: string;
  REQUEST: string;
  SERVICES: string;
  BUYER: string;
  SELLER: string;
  BROKER: string;
  SURVEYOR: string;
  LAB: string;
  BARGE: string;
  VESSEL_SCHEDULE: string;
  AGENT: string;
  SUPPLIER: string;
  PHYSICAL_SUPPLIER: string;
  CONTRACT: string;
  COUNTERPARTIES: string;
  PAYMENT_TERM: string;
  DESTINATIONS: string;
  CONTRACT_SELLER: string;
  NO_QUOTE_REASON: string;
}

export interface ILookupMapLegacyConfig {
  Vessel: string;
  VesselImoNo: string;
  VesselPumpingRate: string;
  Company: string;
  carrierCompany: string;
  paymentCompany: string;
  Ports: string;
  Voyages: string;
  Product: string;
  QuotedProduct: string;
  Request: string;
  ServiceCode: string;
  Agent: string;
  Buyer: string;
  locationName: string;
  Seller: string;
  broker: string;
  surveyorCounterparty: string;
  PhysicalSupplier: string;
  lab: string;
  barge: string;
  contract: string;
  Destinations: string;
  PaymntTerms: string;
  noQuoteReason: string;
}

export interface IScreenActionsLegacyConfig {
  COPY: string;
  CANCEL: string;
  CREATERFQ: string;
  SKIPRFQ: string;
  SENDRFQ: string;
  AMENDRFQ: string;
  REVOKERFQ: string;
  INCLUDEINRFQ: string;
  DELINKRFQ: string;
  REVIEW: string;
  GOSPOT: string;
  GOCONTRACT: string;
  VALIDATEPREREQUEST: string;
  SENDQUESTIONNAIRE: string;
  CONFIRM: string;
  REJECTORDER: string;
  CANCELORDER: string;
  APPROVEORDER: string;
  AMENDORDER: string;
  REQUOTE: string;
  RECONFIRM: string;
  SUBMITFORAPPROVAL: string;
  CONFIRMSELLEREMAIL: string;
  CONFIRMALLEMAIL: string;
  SHOWSOFTSTOPCONFIRMEMAIL: string;
  SHOWSOFTSTOPSELLEREMAIL: string;
  SHOWHARDSTOPCONFIRMEMAIL: string;
  SHOWHARDSTOPSELLEREMAIL: string;
}

export interface IIDSLegacyConfig {
  BROKER_COUNTERPARTY_ID: number;
  SURVEYOR_COUNTERPARTY_ID: number;
  BARGE_COUNTERPARTY_ID: number;
  LAB_COUNTERPARTY_ID: number;
  AGENT_COUNTERPARTY_ID: number;
  SELLER_COUNTERPARTY_ID: number;
  SUPPLIER_COUNTERPARTY_ID: number;
  FAKE_SELLER_TYPE_ID: number;
}

export interface IValidationMessagesLegacyConfig {
  SUCCESS: string;
  GENERAL_ERROR: string;
  INVALID_FIELDS: string;
  UNAUTHORIZED: string;
}

export interface IOrderCommandsLegacyConfig {
  CONFIRM: string;
  CONFIRMONLY: string;
  RECONFIRM: string;
  CANCEL: string;
  REJECT: string;
  APPROVE: string;
  AMEND: string;
  SUBMIT_FOR_APPROVAL: string;
  CONFIRM_TO_SELLER: string;
  CONFIRM_TO_ALL: string;
  CONFIRM_TO_LABS: string;
  CONFIRM_TO_SURVEYOR: string;
}

export interface ICancelledLegacyConfig {
  id: number;
  name: string;
}

export interface IAmmenedLegacyConfig {
  id: number;
  name: string;
}

export interface IStemmedLegacyConfig {
  id: number;
  name: string;
}

export interface IPartiallyStemmedLegacyConfig {
  id: number;
  name: string;
}

export interface IStatusLegacyConfig {
  CANCELLED: ICancelledLegacyConfig;
  AMENDED: IAmmenedLegacyConfig;
  STEMMED: IStemmedLegacyConfig;
  PARTIALLY_STEMMED: IPartiallyStemmedLegacyConfig;
}

export interface ICostTypeIdsLegacyConfig {
  FLAT: number;
  UNIT: number;
  PERCENT: number;
}

export interface IComponentTypeIdsLegacyConfig {
  TAX_COMPONENT: number;
  PRODUCT_COMPONENT: number;
}

export interface ISellerSortOrderLegacyConfig {
  PREFERENCE: string;
  ALPHABET: string;
  RATING: string;
}

export interface IProductStatusIdsLegacyConfig {
  PARTIALLY_INQUIRED: number;
  INQUIRED: number;
  QUOTED: number;
}

export interface IExportFileTypeLegacyConfig {
  NONE: number;
  EXCEL: number;
  CSV: number;
  PDF: number;
}

export interface IvalidationStopTypeIdsLegacyConfig {
  HARD: number;
  SOFT: number;
}

export interface EXPORTFILETYPEEXTENSION {
  0: string;
  1: string;
  2: string;
  3: string;
}

export interface IPackagesConfigurationLegacyConfig {
  ENABLED: boolean;
}

export interface IEmailTransactionLegacyConfig {
  REQUEST: string;
  GROUP_OF_REQUESTS: string;
  REQUOTE: string;
  VIEW_RFQ: string;
  ORDER: string;
  ORDER_CONFIRM: string;
  CONTRACT_PLANNING: string;
}

// tslint:disable-next-line:no-empty-interface
export interface ILegacyAppConfig {
  auth: IAuthLegacyConfig;
  API: IApiUrlsLegacyConfig;
  COMPONENT_TYPE_IDS: IComponentTypeIdsLegacyConfig;
  COST_TYPE_IDS: ICostTypeIdsLegacyConfig;
  CUSTOM_EVENTS: ICustomEventsLegacyConfig;
  EMAIL_TRANSACTION: IEmailTransactionLegacyConfig;
  EXPORT_FILETYPE: IExportFileTypeLegacyConfig;
  EXPORT_FILETYPE_EXTENSION: EXPORTFILETYPEEXTENSION;
  IDS: IIDSLegacyConfig;
  INSTRUMENTATION_KEY: string;
  LOOKUP_MAP: ILookupMapLegacyConfig;
  LOOKUP_TYPE: ILookupTypeLegacyConfig;
  ORDER_COMMANDS: IOrderCommandsLegacyConfig;
  PACKAGES_CONFIGURATION: IPackagesConfigurationLegacyConfig;
  PRODUCT_STATUS_IDS: IProductStatusIdsLegacyConfig;
  SCREEN_ACTIONS: IScreenActionsLegacyConfig;
  SCREEN_LAYOUTS: IScreenLayoutsLegacyConfig;
  SELLER_SORT_ORDER: ISellerSortOrderLegacyConfig;
  STATE: IStateLegacyConfig;
  STATUS: IStatusLegacyConfig;
  TIMESCALE: ITimescaleLegacyConfig;
  VALIDATION_MESSAGES: IValidationMessagesLegacyConfig;
  VALIDATION_STOP_TYPE_IDS: IvalidationStopTypeIdsLegacyConfig;
  VIEW_TYPES: IViewTypesLegacyConfig;
  tenantConfigs: ITenantLegacyConfig;
}
