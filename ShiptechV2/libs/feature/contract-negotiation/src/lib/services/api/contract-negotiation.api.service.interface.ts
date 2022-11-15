import { Observable } from 'rxjs';

export interface IContractNegotiationApiService {
  getTenantConfiguration(request: any): Observable<any>;
  getStaticLists(request: any): Observable<any>;
}
