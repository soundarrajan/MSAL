import { ILookupRequest, ILookupResponse } from '../../lookups/lookup.request';
import { Observable } from 'rxjs';
import { IUomLookupDto } from '@shiptech/core/services/lookups-api/mock-data/uoms.mock';

export interface ILookupsApiService {
  getUoms<T = ILookupRequest>(request: T): Observable<ILookupResponse<IUomLookupDto>>;
}
