import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';




export namespace MapViewApiPaths{
    export const getVesselsList = () => `api/Smart/MapView/getVesselsList`;
    export const getLocationsList = () => `api/Smart/MapView/getLocationsList`;
    export const getRegionFilters= () => `api/Smart/MapView/getRegionFilters`;
}

@Injectable({
  providedIn: 'root'
})
export class MapViewService{

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_SMART;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getVesselsListForMap(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${MapViewApiPaths.getVesselsList()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getLocationsListForMap(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${MapViewApiPaths.getLocationsList()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getRegionFiltersForMap(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${MapViewApiPaths.getRegionFilters()}`,
      { payload: request }
    );
  }

}

