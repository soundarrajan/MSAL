import { Inject, Injectable, Injector } from '@angular/core';
import { LookupsCacheService } from './legacy-cache/legacy-cache.service';
import { AdalService } from 'adal-angular-wrapper';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { LicenseManager } from 'ag-grid-enterprise';
import { AppConfig, IAppConfig } from './config/app-config';
import { LegacyLookupsDatabase } from './legacy-cache/legacy-lookups-database.service';
import { AuthenticationService } from './authentication/authentication.service';
import { EMPTY$ } from './utils/rxjs-operators';
import { ILegacyAppConfig } from './config/legacy-app-config';
import { ILoggerSettings, LOGGER_SETTINGS, LoggerFactory } from './logging/logger-factory.service';
import { TenantSettingsService } from './services/tenant-settings/tenant-settings.service';
import { TenantSettingsModuleName } from './store/states/tenant/tenant-settings.interface';
import { environment } from '@shiptech/environment';
import { DeveloperToolbarService } from './developer-toolbar/developer-toolbar.service';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { UserProfileService } from '@shiptech/core/services/user-profile/user-profile.service';

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
              private appErrorHandler: AppErrorHandler,
              private urlService: UrlService,
              @Inject(LOGGER_SETTINGS) private loggerSettings: ILoggerSettings
  ) {
  }

  initApp(): Observable<any> {
    // TODO: Implement proper logging here

    // Note: Order is very important here.
    return this.loadAppConfig().pipe(
      tap(() => this.setupLogging()),
      concatMap(() => this.setupAuthentication()),
      concatMap(() => this.setupDeveloperToolbar()),
      concatMap(() => this.loadUserProfile()),
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
    const runtimeSettingsUrl = this.urlService.getRuntimeSettings();
    const legacySettingsUrl = this.urlService.getLegacySettings();

    return forkJoin(
      this.http.get<ILegacyAppConfig>(legacySettingsUrl),
      this.http.get<IAppConfig>(runtimeSettingsUrl)
    ).pipe(map(([legacyConfig, appConfig]) => {
      Object.assign(this.appConfig, appConfig);
      this.appConfig.v1 = legacyConfig;

      return this.appConfig;
    }));
  }

  private setupAuthentication(): Observable<void> {

    this.authService.init(this.appConfig.v1.auth);

    if (this.authService.isAuthenticated) {
      return EMPTY$;
    }
    //TODO: handle adal errors and token expire
    this.authService.login();

    return new Observable<void>(() => {
      // Note: Intentionally left blank, this obs should never complete so we don't see a glimpse of the application before redirected to login.
    });
  }

  private setupDeveloperToolbar(): Observable<void> {
    return of(this.injector.get(DeveloperToolbarService).bootstrap());
  }

  private loadUserProfile(): Observable<void> {
    // Note: UserProfileService instance needs to be created after app config is loaded because of the tenant setting api url
    const userProfileService = this.injector.get(UserProfileService);

    return userProfileService.load().pipe(catchError(error => {
      // TODO: Refactor this pipe and share it with loadGeneralTenantSettings
      if (environment.production) {
        return throwError(error);
      } else {
        // Note: For development, if the user profile service is mocked, the developer toolbar will not be shown
        // Note: because the app init has failed, thus we should swallow this exception, and manually show the error to the dev.
        this.appErrorHandler.handleError(error);

        return EMPTY$;
      }
    }));
  }

  private loadGeneralTenantSettings(): Observable<void> {
    // Note: TenantSettingsService instance needs to be created after app config is loaded because of the tenant setting api url
    const tenantSettingsService = this.injector.get(TenantSettingsService);

    return tenantSettingsService.loadModule(TenantSettingsModuleName.General).pipe(catchError(error => {
      if (environment.production) {
        return throwError(error);
      } else {
        // Note: For development, if the tenant settings service is mocked, the developer toolbar will not be shown
        // Note: because the app init has failed, thus we should swallow this exception, and manually show the error to the dev.
        this.appErrorHandler.handleError(error);

        return EMPTY$;
      }
    }));
  }
}

export function bootstrapApplication(bootstrapService: BootstrapService): () => Promise<any> {
  return () => bootstrapService.initApp().toPromise();
}
