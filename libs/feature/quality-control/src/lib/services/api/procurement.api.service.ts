import { Injectable, InjectionToken } from '@angular/core';
import { IProcurementApiService } from './procurement.api.service.interface';
import {
  IProcurementRequestsRequest,
  IProcurementRequestsResponse
} from './request-response/procurement-requests.request-response';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core';

export namespace ProcurementApiPaths {
  export const allRequests = 'api/procurement/request/tableView';
}

@Injectable({
  providedIn: 'root'
})
export class ProcurementApiService implements IProcurementApiService {

  private _apiUrl = this.appConfig.API.BASE_URL_DATA_PROCUREMENT;

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  getAllProcurementRequests(request: IProcurementRequestsRequest): Observable<IProcurementRequestsResponse> {
    return this.http.post<IProcurementRequestsResponse>(`${this._apiUrl}/${ProcurementApiPaths.allRequests}`, request);
  }
}

export const PROCUREMENT_API_SERVICE = new InjectionToken<IProcurementApiService>('PROCUREMENT_API_SERVICE')
