//TODO: refactor and cleanup all of this.
import { Injectable } from '@angular/core';
import { LookupsCacheService } from './legacy-cache/legacy-cache.service';
import { AdalService } from 'adal-angular-wrapper';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { LicenseManager } from 'ag-grid-enterprise';
import { ILegacyConfig } from './config/legacy-config.interfaces';
import { AppConfig } from './config/app-config.service';
import { IAppConfig } from './config/app-config.interface';
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
              private authService: AuthenticationService
  ) {
  }

  initApp(): Observable<any> {
    return this.loadAppConfigAsync().pipe(
      concatMap(config => {

        Object.assign(this.appConfig, config);

        LicenseManager.setLicenseKey(config.agGridLicense);

        this.authService.init(config.auth);
        this.authService.handleWindowCallback();

        if (!this.authService.userInfo.authenticated) {
          //TODO: handle adal errors and token expire
          this.authService.login();

          return new Observable<ILegacyConfig>(() => {
            // Note: Intentionally left blank, this obs should never complete
          });
        }

        this.appConfig.loaded$ = this.setupLoadedSubject(this.appConfig);

        //TODO: What happens if loading cache fails? Handle failure anyway.
        return this.legacyCache.load();
        return EMPTY$;
      }));
  }

  private setupLoadedSubject(value?: AppConfig): ReplaySubject<IAppConfig> {
    const subject = new ReplaySubject<IAppConfig>(1);
    if (value) {
      subject.next(value);
    }
    return subject;
  }

  private loadAppConfigAsync(): Observable<AppConfig> {
    // TODO: Remove hardcoded path to settings
    // TODO: use dynamic settings json from v1
    return this.http
      .get<AppConfig>('/assets/config/settings.runtime.json');
  }
}

export function bootstrapApplication(bootstrapService: BootstrapService): () => Promise<any> {
  return () => bootstrapService.initApp().toPromise();
}
