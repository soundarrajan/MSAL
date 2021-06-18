import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';




export namespace PortPopupApiPaths{
    export const getAgentInfo = () => `api/Smart/Port/getPortAgentInfo`;
    export const getPortProductAvailability = () => `api/Smart/Port/getPortProductAvailability`;
    export const getOtherDetails = () => `api/Smart/Port/getPortOtherDetails`;
    export const getPortBasicInfo = () => `api/Smart/Port/getPortBasicInfo`;
    export const getPortRemark = () => `api/Smart/Port/getPortRemarksList`;
    export const putPortRemark = () => `api/Smart/Port/create`;
    export const getVesselArrivalDetails = () => `api/Smart/Port/getVesselArrivalDetail`;
}

@Injectable({
  providedIn: 'root'
})
export class PortPopupService{

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_SMART;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getPortBasicInfo(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${PortPopupApiPaths.getPortBasicInfo()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getAgentInfo(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${PortPopupApiPaths.getAgentInfo()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getPortProductAvailability(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${PortPopupApiPaths.getPortProductAvailability()}`,
      { payload: request }
    );
  }
  
  getOtherDetails(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${PortPopupApiPaths.getOtherDetails()}`,
      { payload: request }
    );
  }
  putPortRemark(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${PortPopupApiPaths.putPortRemark()}`,
      { payload: request }
    );
  }
  loadPortRemark(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${PortPopupApiPaths.getPortRemark()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getVesselArrivalDetails(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${PortPopupApiPaths.getVesselArrivalDetails()}`,
      { payload: request }
    );
  }

}

