//TODO: refactor and cleanup all of this.
import { Injectable } from '@angular/core';
import { LookupsCacheService } from './legacy-cache/legacy-cache.service';
import { AdalService } from 'adal-angular-wrapper';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { LicenseManager } from 'ag-grid-enterprise';
import { ILegacyConfig } from './config/legacy-config.interfaces';
import { AppConfig } from './config/app-config.service';
import { IAppConfig } from './config/app-config.interface';

@Injectable({
  providedIn: 'root'
})
export class BootstrapService {
  constructor(private appConfig: AppConfig, private legacyCache: LookupsCacheService, private adal: AdalService, private http: HttpClient) {
  }

  initApp(): Observable<any> {
    return this.loadAppConfigAsync().pipe(
      concatMap(config => {

        Object.assign(this.appConfig, config);

        LicenseManager.setLicenseKey(config.agGridLicense);

        this.adal.init(config.auth);
        this.adal.handleWindowCallback();

        if (!this.adal.userInfo.authenticated) {
          //TODO: handle adal errors and token expire
          this.adal.login();

          return new Observable<ILegacyConfig>(() => {
            // Note: Intentionally left blank, this obs should never complete
          });
        }
        //TODO: What happens if loading cache fails? Handle failure anyway.
        return this.legacyCache.load();
        //return EMPTY$;
      }));
  }

  private loadAppConfigAsync(): Observable<IAppConfig> {
    // TODO: Remove hardcoded path to settings
    // TODO: use dynamic settings json from v1
    return this.http
      .get<IAppConfig>('/assets/config/settings.runtime.json');
  }
}

export function bootstrapApplication(bootstrapService: BootstrapService): () => Promise<any> {
  return () => bootstrapService.initApp().toPromise();
}
