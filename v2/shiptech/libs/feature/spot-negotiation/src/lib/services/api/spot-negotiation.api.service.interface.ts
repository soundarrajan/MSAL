import { Observable } from 'rxjs';

export interface ISpotNegotiationApiService {
  getTenantConfiguration(request: any): Observable<any>;

  getStaticLists(request: any): Observable<any>;
}
