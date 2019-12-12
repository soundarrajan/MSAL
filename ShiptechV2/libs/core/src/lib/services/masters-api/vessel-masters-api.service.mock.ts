import { VesselMastersApi } from './vessel-masters-api.service';
import { Observable, of } from 'rxjs';
import { ApiCall, ApiCallForwardTo } from '../../utils/decorators/api-call.decorator';
import { Injectable } from '@angular/core';
import { IVesselMastersApi } from './vessel-masters-api.service.interface';
import { IVesselMasterRequest, IVesselMasterResponse } from '@shiptech/core/services/masters-api/dtos/vessel';
import getVesselsResponseMock from './mock-data/get-vessels-response.mock.json';
import {
  IVesselPortCallMasterRequest,
  IVesselPortCallMasterResponse
} from '@shiptech/core/services/masters-api/dtos/vessel-port-call';
import { getMockVesselPortCallsEventsLog } from '@shiptech/core/services/masters-api/mock-data/vessel-port-calls.mock';

const mockVesselPortCallsEventsLog = getMockVesselPortCallsEventsLog(30);

@Injectable({
  providedIn: 'root'
})
export class VesselMastersApiMock implements IVesselMastersApi {
  @ApiCallForwardTo() realService: VesselMastersApi;

  constructor(realService: VesselMastersApi) {
    this.realService = realService;
  }

  @ApiCall()
  getVessels(request: IVesselMasterRequest): Observable<IVesselMasterResponse> {
    return of({
      items: getVesselsResponseMock,
      totalItems: getVesselsResponseMock.length
    });
  }

  @ApiCall()
  getVesselPortCalls(request: IVesselPortCallMasterRequest): Observable<IVesselPortCallMasterResponse> {

    return of({
      items: mockVesselPortCallsEventsLog,
      totalItems: mockVesselPortCallsEventsLog.length
    });
  }
}
