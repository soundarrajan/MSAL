import {
  IProcurementRequestsRequest,
  IProcurementRequestsResponse
} from './request-response/procurement-requests.request-response';
import { Observable } from 'rxjs';

export interface IProcurementApiService {
  getAllProcurementRequests(request: IProcurementRequestsRequest): Observable<IProcurementRequestsResponse>;
}
