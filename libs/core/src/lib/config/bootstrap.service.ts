//TODO: refactor and cleanup all of this.
import { Injectable } from '@angular/core';
import { LookupsCacheService } from '../legacy-cache/legacy-cache.service';
import { AdalService } from 'adal-angular4';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { LicenseManager } from 'ag-grid-enterprise';
import { ILegacyConfig } from './legacy-config.interfaces';
import { AppConfig } from './app-config.service';
import { IAppConfig } from './app-config.interface';

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
          this.adal.login();

          return new Observable<ILegacyConfig>(() => {
            // Note: Intentionally left blank, this obs should never complete
          });
        }
        return this.legacyCache.load();
        //return EMPTY$;
      }));
  }

  private loadAppConfigAsync(): Observable<IAppConfig> {
    // TODO: Remove hardcoded path to settings
    return this.http
      .get<IAppConfig>('http://dev.shiptech.24software.ro:81/config/defaultConfig.json');
  }
}

export function bootstrapApplication(bootstrapService: BootstrapService): () => Promise<any> {
  return () => bootstrapService.initApp().toPromise();
}
