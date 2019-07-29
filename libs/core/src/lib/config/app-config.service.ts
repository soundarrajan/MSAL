import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
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
import { LicenseManager } from 'ag-grid-enterprise';
import { IAppConfig } from './app-config.interface';
import { EMPTY$ } from '../utils/rxjs-operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class AppConfig implements ILegacyConfig, IAppConfig {
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

//TODO: refactor and cleanup all of this.
@Injectable({
  providedIn: 'root'
})
export class BootstrapService {
  private appConfig: AppConfig;

  constructor(private authService: AuthenticationService, private http: HttpClient) {
  }

  initApp(): Observable<any> {
    return this.loadAppConfigAsync().pipe(
      concatMap(config => {
        this.appConfig = config;

        LicenseManager.setLicenseKey(config.agGridLicense);

        this.authService.init(config.auth);
        this.authService.handleWindowCallback();

        if (!this.authService.userInfo.authenticated) {
          this.authService.login();

          return new Observable<ILegacyConfig>(() => {
            // Note: Intentionally left blank, this obs should never complete
          });
        }

        return EMPTY$;
      }));
  }

  private loadAppConfigAsync(): Observable<AppConfig> {
    // TODO: Remove hardcoded path to settings
    return this.http
      .get<AppConfig>('/assets/config/settings.runtime.json');
  }
}

export function bootstrap(bootstrapService: BootstrapService): () => Promise<any> {
  return () => bootstrapService.initApp().toPromise();
}
