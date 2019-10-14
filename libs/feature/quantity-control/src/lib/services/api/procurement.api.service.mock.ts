import { Injectable } from '@angular/core';
import { IProcurementApiService } from './procurement.api.service.interface';
import {
  IProcurementRequestsRequest,
  IProcurementRequestsResponse
} from './request-response/procurement-requests.request-response';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class QuantityControlMockApiService implements IProcurementApiService {

  constructor() { }

  getAllProcurementRequests(request: IProcurementRequestsRequest): Observable<IProcurementRequestsResponse> {
    return throwError('Not implemented');
  }
}
