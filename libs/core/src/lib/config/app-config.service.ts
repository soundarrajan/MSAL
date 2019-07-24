import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mapTo, tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
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
  ILegacyConfig, ILookupMapLegacyConfig, ILookupTypeLegacyConfig, IOrderCommandsLegacyConfig,
  IPackagesConfigurationLegacyConfig, IProductStatusIdsLegacyConfig,
  IScreenActionsLegacyConfig,
  IScreenLayoutsLegacyConfig,
  ISellerSortOrderLegacyConfig,
  IStateLegacyConfig,
  IStatusLegacyConfig,
  ITenantLegacyConfig, ITimescaleLegacyConfig,
  IValidationMessagesLegacyConfig,
  IvalidationStopTypeIdsLegacyConfig,
  IViewTypesLegacyConfig
} from './legacy-config';

@Injectable()
export class AppConfig implements ILegacyConfig {
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

  public loaded$ = new ReplaySubject<ILegacyConfig>(1);

  constructor(private http: HttpClient) {}


  loadAppConfigAsync(): Promise<ILegacyConfig> {
    // Note: Angular APP_INITIALIZER only waits for Promise, and NOT Observables
    return this.http
      .get('/assets/config/settings.runtime.json')
      .pipe(
        tap((result: ILegacyConfig) => {

          this.auth = result.auth;

          this.agGridLicense = result.agGridLicense;

          this.loaded$.next(this);
        }),
        mapTo(this)
      )
      .toPromise();
  }
}

export function loadConfiguration(config: AppConfig): () => Promise<ILegacyConfig> {
  return (): Promise<ILegacyConfig> => config.loadAppConfigAsync();
}
