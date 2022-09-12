import { Observable } from 'rxjs';
import {
  IVesselMasterRequest,
  IVesselMasterResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/vessel';
import { InjectionToken } from '@angular/core';
import {
  IVesselPortCallMasterRequest,
  IVesselPortCallMasterResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';

export interface IVesselMastersApi {
  getVessels(request: IVesselMasterRequest): Observable<IVesselMasterResponse>;
  getVesselPortCalls(
    request: IVesselPortCallMasterRequest
  ): Observable<IVesselPortCallMasterResponse>;
}

export const VESSEL_MASTERS_API_SERVICE = new InjectionToken<IVesselMastersApi>(
  'IVesselMastersApi'
);
