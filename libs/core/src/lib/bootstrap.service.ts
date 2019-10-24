//TODO: refactor and cleanup all of this.
import { Inject, Injectable, Injector } from '@angular/core';
import { LookupsCacheService } from './legacy-cache/legacy-cache.service';
import { AdalService } from 'adal-angular-wrapper';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { LicenseManager } from 'ag-grid-enterprise';
import { AppConfig, IAppConfig } from './config/app-config';
import { LegacyLookupsDatabase } from './legacy-cache/legacy-lookups-database.service';
import { AuthenticationService } from './authentication/authentication.service';
import { EMPTY$ } from './utils/rxjs-operators';
import { ILegacyAppConfig } from './config/legacy-app-config';
import { ILoggerSettings, LOGGER_SETTINGS, LoggerFactory } from './logging/logger-factory.service';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant.settings.interface';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {

  get initialized(): Observable<void> {
    return this._initialized;
  }

  private _initialized = new ReplaySubject<void>(1);

  constructor(private appConfig: AppConfig,
              private legacyCache: LookupsCacheService,
              private adal: AdalService,
              private http: HttpClient,
              private authService: AuthenticationService,
              private legacyLookupsDatabase: LegacyLookupsDatabase,
              private loggerFactory: LoggerFactory,
              private injector: Injector,
              @Inject(LOGGER_SETTINGS) private loggerSettings: ILoggerSettings
  ) {
  }

  initApp(): Observable<any> {
    // TODO: Implement proper logging here

    // Note: Order is very important here.
    return this.loadAppConfig().pipe(
      tap(() => this.setupLogging()),
      concatMap(() => this.setupAuthentication()),
      concatMap(() => this.loadGeneralTenantSettings()),
      concatMap(() => this.legacyLookupsDatabase.init()),
      concatMap(() => this.legacyCache.load()),
      tap(() => this.setupAgGrid()),
      tap(() => this._initialized.next())
    );
  }

  private setupLogging(): void {
    this.loggerFactory.init({ ...this.loggerSettings, serverSideUrl: this.appConfig.loggingApi });
  }

  private setupAgGrid(): void {
    //TODO: Update to latest ag-grid
    LicenseManager.setLicenseKey(this.appConfig.agGridLicense);
  }

  private loadAppConfig(): Observable<IAppConfig> {
    // TODO: Remove hardcoded path to settings
    // TODO: Load both settings file, v1 and v2, merge them and also replicate same logic of loading settings based on domain
    const runtimeSettingsUrl = 'assets/config/settings.runtime.json';
    const legacySettingsUrl = '/config/defaultConfig.json';

    return forkJoin(
      this.http.get<ILegacyAppConfig>(legacySettingsUrl),
      this.http.get<IAppConfig>(runtimeSettingsUrl)
    ).pipe(map(([legacyConfig, appConfig]) => {
      Object.assign(this.appConfig, appConfig);
      this.appConfig.v1 = legacyConfig;

      return this.appConfig;
    }));
  }

  private setupAuthentication(): Observable<any> {

    this.authService.init(this.appConfig.v1.auth);

    if (this.authService.isAuthenticated) {
      return EMPTY$;
    }
    //TODO: handle adal errors and token expire
    this.authService.login();

    return new Observable<IAppConfig>(() => {
      // Note: Intentionally left blank, this obs should never complete so we don't see a glimpse of the application before redirected to login.
    });
  }

  private loadGeneralTenantSettings(): Observable<any> {
    // Note: TenantSettingsService instance needs to be created after app config is loaded because of the tenant setting api url
    return this.injector.get(TenantSettingsService).loadModule(TenantSettingsModuleName.General);
  }
}

export function bootstrapApplication(bootstrapService: BootstrapService): () => Promise<any> {
  return () => bootstrapService.initApp().toPromise();
}
