import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';




export namespace VesselPopupApiPaths{
    export const getVesselBasicInfo = () => `api/Smart/Vessel/getVesselInfo`;
    export  const getmyDefaultview = () => `api/Smart/MapView/getDefaultView`
    export const getBdnReport = () => `api/Smart/Reports/getBDNReport`;
    export const getOrderDetails = () => `api/Smart/Reports/getOrderReport`;
    export const getVesselRedeliveryInfo = () => `api/Smart/Vessel/getVesselRedeliveryInfo`;
    export const getVesselSchedule = () => `api/Smart/Vessel/getVesselSchedule`;
    export const getVesselAlertList = () => `api/Smart/Port/getVesselAlertList`;
    export const putVesselAlertList = () => `api/Smart/Port/createVesselAlert`;
    export const getVesselRouteData = () => `api/Smart/Vessel/getVesselRoute`;
    export const saveDefaultView = () => `api/Smart/MapView/saveDefaultView`;
}

@Injectable({
  providedIn: 'root'
})
export class VesselPopupService{

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_SMART;
  myDefaultViewPayload: any = [];
  APImyDefaultView: any = [];

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getVesselBasicInfo(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getVesselBasicInfo()}`,
      { payload: request }
    );
  }
  @ObservableException()
  getmyDefaultview(request: any): Observable<any>{
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getmyDefaultview()}`,
      { payload: request }
    );
  }

  @ObservableException()  
    saveDefaultView(request: any): Observable<any> {
      return this.http.post<any>(
        `${this._apiUrl}/${VesselPopupApiPaths.saveDefaultView()}`,
        request
      )
      
    }


  @ObservableException()
  getBdnReport(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getBdnReport()}`,
      { payload: request }
    );
  }

  @ObservableException()

  getOrderDetails(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getOrderDetails()}`,
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

  @ObservableException()
  loadVesselAlertList(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getVesselAlertList()}`,
      { payload: request }
    );
  }

  @ObservableException()
  updateVesselAlertList(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.putVesselAlertList()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getVesselRouteData(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${VesselPopupApiPaths.getVesselRouteData()}`,
      { payload: request }
    );
  }
}

