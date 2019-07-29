import { ReplaySubject } from 'rxjs';

export interface IAppConfig {
  agGridLicense: string;
  loggingApi: string;
  loaded$: ReplaySubject<IAppConfig>;
}
