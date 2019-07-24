import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mapTo, tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';

export interface IAppConfig {
  tenantId: string;
  clientId: string;

  agGridLicense: string;

  loaded$: Observable<IAppConfig>;
}

@Injectable()
export class AppConfig {
  public tenantId: string;
  public clientId: string;

  public agGridLicense: string;

  public loaded$ = new ReplaySubject<IAppConfig>(1);

  constructor(private http: HttpClient) {}

  loadAppConfigAsync(): Promise<IAppConfig> {
    // Note: Angular APP_INITIALIZER only waits for Promise, and NOT Observables
    return this.http
      .get('/assets/config/settings.runtime.json')
      .pipe(
        tap((result: IAppConfig) => {
          this.tenantId = result.tenantId;
          this.clientId = result.clientId;
          this.agGridLicense = result.agGridLicense;

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
