//TODO: refactor and cleanup all of this.
import { Injectable } from '@angular/core';
import { LookupsCacheService } from './legacy-cache/legacy-cache.service';
import { AdalService } from 'adal-angular-wrapper';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { LicenseManager } from 'ag-grid-enterprise';
import { AppConfig } from './config/app-config.service';
import { IAppConfig } from './config/app-config.interface';
import { LegacyLookupsDatabase } from './legacy-cache/legacy-lookups-database.service';
import { AuthenticationService } from './authentication/authentication.service';
import { EMPTY$ } from './utils/rxjs-operators';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {

  constructor(private appConfig: AppConfig,
              private legacyCache: LookupsCacheService,
              private adal: AdalService,
              private http: HttpClient,
              private authService: AuthenticationService,
              private legacyLookupsDatabase: LegacyLookupsDatabase
  ) {
  }

  initApp(): Observable<any> {
    // TODO: Implement proper logging here

    // Note: Order is very important here.
    return this.loadAppConfig().pipe(
      concatMap(() => this.setupAuthentication()),
      concatMap(() => this.legacyLookupsDatabase.init()),
      concatMap(() => this.legacyCache.load()),
      tap(() => this.setupAgGrid())
    );
  }

  private setupAgGrid(): void {
    //TODO: Update to latest ag-grid
    LicenseManager.setLicenseKey(this.appConfig.agGridLicense);
  }

  private loadAppConfig(): Observable<IAppConfig> {
    // TODO: Remove hardcoded path to settings
    const settingsUrl = 'assets/config/settings.runtime.json';

    return this.http.get<IAppConfig>(settingsUrl).pipe(tap(config => Object.assign(this.appConfig, config)));
  }

  private setupAuthentication(): Observable<any> {

    this.authService.init(this.appConfig.auth);

    if (this.authService.isAuthenticated) {
      return EMPTY$;
    }
    //TODO: handle adal errors and token expire
    this.authService.login();

    return new Observable<IAppConfig>(() => {
      // Note: Intentionally left blank, this obs should never complete so we don't see a glimpse of the application before redirected to login.
    });
  }
}

export function bootstrapApplication(bootstrapService: BootstrapService): () => Promise<any> {
  return () => bootstrapService.initApp().toPromise();
}
