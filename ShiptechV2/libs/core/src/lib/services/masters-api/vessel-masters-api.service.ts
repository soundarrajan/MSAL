import { Injectable } from '@angular/core';
import { AppConfig } from '@shiptech/core/config/app-config';
import { IVesselMastersApi } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiServiceBase } from '@shiptech/core/api/api-base.service';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { IVesselMasterDto, IVesselMasterRequest, IVesselMasterResponse } from '@shiptech/core/services/masters-api/dtos/vessel';
import { map } from 'rxjs/operators';
import { IVesselPortCallMasterDto, IVesselPortCallMasterRequest, IVesselPortCallMasterResponse } from '@shiptech/core/services/masters-api/dtos/vessel-port-call';
import _ from 'lodash';

enum VesselMastersApiPaths {
  vesselsList = 'api/masters/vessels/list',
  listPortCalls = 'api/masters/vesselSchedules/listPortCalls',
}

// @dynamic
@Injectable({
  providedIn: 'root'
})
export class VesselMastersApi extends ApiServiceBase implements IVesselMastersApi {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(protected appConfig: AppConfig, private http: HttpClient, private loggerFactory: LoggerFactory) {
    super(http, loggerFactory.createLogger(VesselMastersApi.name));
  }

  @ObservableException()
  getVessels(request: IVesselMasterRequest): Observable<IVesselMasterResponse> {
    return this.http.post<{ payload: IVesselMasterDto[]}>(`${this._apiUrl}/${VesselMastersApiPaths.vesselsList}`, { payload: request })
      .pipe(map(r => ({
        items: r.payload || [],
        totalCount: _.first(r.payload || [])?.totalCount ?? 0
      })));
  }

  getVesselPortCalls(request: IVesselPortCallMasterRequest): Observable<IVesselPortCallMasterResponse> {
    return this.http.post<IVesselPortCallMasterDto[]>(`${this._apiUrl}/${VesselMastersApiPaths.listPortCalls}`, { payload: request })
      .pipe(map(r => ({
        items: r || [],
        totalCount: _.first(r || [])?.totalCount ?? 0
      })));
  }
}
