import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';




export namespace PortPopupApiPaths{
    export const getAgentInfo = () => `api/Smart/Port/getPortAgentInfo`;
    export const getPortProductAvailability = () => `api/Smart/Port/getPortProductAvailability`;
}

@Injectable({
  providedIn: 'root'
})
export class PortPopupService{

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_SMART;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

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

}

