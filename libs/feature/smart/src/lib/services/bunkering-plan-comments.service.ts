import { Injectable } from '@angular/core';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ApiServiceBase } from '@shiptech/core/api/api-base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { VesselDataModel, FuelDetails, VesselLocation, RequestDetail } from '../shared/models/vessel.data.model';
import { BehaviorSubject } from 'rxjs';
import {
    IAuditLogRequest,
    IAuditLogResponse
  } from '@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto';
  
export namespace BunkerPlanCommentApiPaths {
    export const getBPComments = () => `api/Smart/Comment/getBPComments`;
    export const getRequestComments = () => `api/Smart/Comment/getRequestComments`;
}

@Injectable({
  providedIn: 'root'
})
export class BunkeringPlanCommentsService {
  @ApiCallUrl()
  protected _apiUrlAdmin = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_SMART;
  protected _apiUrlInfra = this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE;
  protected _apiUrlProcure = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  
  }    
  
  // getBunkerPlanComments to get Comments for bunker plan comment section
  @ObservableException()
  getBunkerPlanComments(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${BunkerPlanCommentApiPaths.getBPComments()}`,
      { payload: request }
    );
  }
  // getRequestComments to get Comments for Request comment section
  @ObservableException()
  getRequestComments(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${BunkerPlanCommentApiPaths.getRequestComments()}`,
      { payload: request }
    );
  }
}
