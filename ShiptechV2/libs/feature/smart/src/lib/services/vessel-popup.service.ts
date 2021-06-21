import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';




export namespace VesselPopupApiPaths{
    export const getVesselBasicInfo = () => `api/Smart/Vessel/getVesselInfo`;
    export const getVesselRedeliveryInfo = () => `api/Smart/Vessel/getVesselRedeliveryInfo`;
    export const getVesselSchedule = () => `api/Smart/Vessel/getVesselSchedule`;
}

@Injectable({
  providedIn: 'root'
})
export class VesselPopupService{

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_SMART;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getVesselBasicInfo(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getVesselBasicInfo()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getVesselRedeliveryInfo(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getVesselRedeliveryInfo()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getVesselSchedule(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getVesselSchedule()}`,
      { payload: request }
    );
  }

}

