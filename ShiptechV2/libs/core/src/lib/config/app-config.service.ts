import { Injectable } from '@angular/core';
import {
  EXPORTFILETYPEEXTENSION,
  IApiUrlsLegacyConfig,
  IAuthLegacyConfig,
  IComponentTypeIdsLegacyConfig,
  ICostTypeIdsLegacyConfig,
  ICustomEventsLegacyConfig,
  IEmailTransactionLegacyConfig,
  IExportFileTypeLegacyConfig,
  IIDSLegacyConfig,
  ILegacyConfig,
  ILookupMapLegacyConfig,
  ILookupTypeLegacyConfig,
  IOrderCommandsLegacyConfig,
  IPackagesConfigurationLegacyConfig,
  IProductStatusIdsLegacyConfig,
  IScreenActionsLegacyConfig,
  IScreenLayoutsLegacyConfig,
  ISellerSortOrderLegacyConfig,
  IStateLegacyConfig,
  IStatusLegacyConfig,
  ITenantLegacyConfig,
  ITimescaleLegacyConfig,
  IValidationMessagesLegacyConfig,
  IvalidationStopTypeIdsLegacyConfig,
  IViewTypesLegacyConfig
} from './legacy-config.interfaces';
import { IAppConfig } from './app-config.interface';

@Injectable({
  providedIn: 'root'
})
export class AppConfig implements IAppConfig {
  public auth: IAuthLegacyConfig;
  API: IApiUrlsLegacyConfig;
  COMPONENT_TYPE_IDS: IComponentTypeIdsLegacyConfig;
  COST_TYPE_IDS: ICostTypeIdsLegacyConfig;
  CUSTOM_EVENTS: ICustomEventsLegacyConfig;
  EMAIL_TRANSACTION: IEmailTransactionLegacyConfig;
  EXPORT_FILETYPE: IExportFileTypeLegacyConfig;
  EXPORT_FILETYPE_EXTENSION: EXPORTFILETYPEEXTENSION;
  IDS: IIDSLegacyConfig;
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

  public agGridLicense: string;
}


