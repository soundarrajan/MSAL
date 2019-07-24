import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mapTo, tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';

export interface IAppConfig {
  baseTechoilUrl: string;
  baseReverseProxyUrl: string;

  rackApiUrl: string;
  rsSchedulingApiUrl: string;
  psSchedulingApiUrl: string;
  lookupApiUrl: string;
  productUrlExternalUrlFormat: string;
  deliveryExternalUrlFormat: string;
  terminalMasterExternalUrlFormat: string;
  counterpartyExternalUrlFormat: string;
  tenantApiUrl: string;
  tenantPublicApiUrl: string;
  permissionsApiUrl: string;
  userSettingsApiUrl: string;
  loggingApi: string;
  // TODO:  Temporary hack until backend is finished to allow other devs to work, to be removed
  enableAuthorization: string;
  tenantId: string;
  clientId: string;
  agGridLicense: string;

  deliveryApiUrl: string;
  cycleExternalUrlFormat: string;
  mockUserName: string;
  serviceUrl: string;

  configApiUrl: string;

  setBackendServiceUrl: () => void;

  mongoUrl: string;
  AppVersion: string;
  PipelineAccesible: boolean;
  TradingAccessible: boolean;

  loaded$: Observable<IAppConfig>;
}

@Injectable()
export class AppConfig {
  public baseTechoilUrl: string;
  public baseReverseProxyUrl: string;
  public serviceUrl: string;
  public mongoUrl: string;

  public rackApiUrl: string;
  public rsSchedulingApiUrl: string;
  public psSchedulingApiUrl: string;
  public lookupApiUrl: string;
  public productUrlExternalUrlFormat: string;
  public deliveryExternalUrlFormat: string;
  public terminalMasterExternalUrlFormat: string;
  public counterpartyExternalUrlFormat: string;
  public tenantApiUrl: string;
  public tenantPublicApiUrl: string;
  public permissionsApiUrl: string;
  public userSettingsApiUrl: string;
  public loggingApi: string;
  // TODO:  Temporary hack until backend is finished to allow other devs to work, to be removed
  public enableAuthorization: string;
  public tenantId: string;
  public clientId: string;
  public agGridLicense: string;

  public configApiUrl: string;
  public deliveryApiUrl: string;
  public cycleExternalUrlFormat: string;
  public mockUserName: string;
  public settingsJson: string;
  public AppVersion: string;
  public PipelineAccesible: boolean;
  public TradingAccessible: boolean;
  // temporary authorization enable/disable - testing

  public loaded$ = new ReplaySubject<IAppConfig>(1);

  setBackendServiceUrl() {
    localStorage.setItem('serviceUrl', this.serviceUrl);
  }

  constructor(private http: HttpClient) {}

  loadAppConfigAsync(): Promise<IAppConfig> {
    // Note: Angular APP_INITIALIZER only waits for Promise, and NOT Observables
    return this.http
      .get('/assets/config/settings.runtime.json')
      .pipe(
        tap((result: IAppConfig) => {
          this.baseTechoilUrl = result.baseTechoilUrl;
          this.baseReverseProxyUrl = result.baseReverseProxyUrl;

          this.rackApiUrl = result.rackApiUrl;
          this.lookupApiUrl = result.lookupApiUrl;

          this.tenantApiUrl = result.tenantApiUrl;
          this.tenantPublicApiUrl = result.tenantPublicApiUrl;
          this.rsSchedulingApiUrl = result.rsSchedulingApiUrl;
          this.psSchedulingApiUrl = result.psSchedulingApiUrl;
          this.permissionsApiUrl = result.permissionsApiUrl;
          this.userSettingsApiUrl = result.userSettingsApiUrl;
          this.tenantId = result.tenantId;
          this.clientId = result.clientId;
          this.loggingApi = result.loggingApi;
          this.mongoUrl = result.mongoUrl;

          this.configApiUrl = result.baseReverseProxyUrl + result.configApiUrl;
          this.deliveryApiUrl = result.baseReverseProxyUrl + result.deliveryApiUrl;
          this.deliveryExternalUrlFormat = result.baseTechoilUrl + result.deliveryExternalUrlFormat;
          this.productUrlExternalUrlFormat = result.baseTechoilUrl + result.productUrlExternalUrlFormat;
          this.counterpartyExternalUrlFormat = result.baseTechoilUrl + result.counterpartyExternalUrlFormat;
          this.cycleExternalUrlFormat = result.baseTechoilUrl + result.cycleExternalUrlFormat;
          this.terminalMasterExternalUrlFormat = result.baseTechoilUrl + result.terminalMasterExternalUrlFormat;
          this.serviceUrl = result.serviceUrl;

          this.AppVersion = result.AppVersion;

          // TODO: Temporary hack until backend is finished to allow other devs to work, to be removed
          this.enableAuthorization = result.enableAuthorization;
          this.agGridLicense = result.agGridLicense;

          this.mockUserName = result.mockUserName;
          this.settingsJson = JSON.stringify(result);

          this.PipelineAccesible = result.PipelineAccesible;
          this.TradingAccessible = result.TradingAccessible;

          this.loaded$.next(this);
        }),
        mapTo(this)
      )
      .toPromise();
  }
}

export function loadConfiguration(config: AppConfig): () => Promise<IAppConfig> {
  return (): Promise<IAppConfig> => config.loadAppConfigAsync();
}
