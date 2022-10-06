import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { Observable, throwError } from 'rxjs';

export namespace InsertUpdateAlert{
    export const insertUpdateAlert = ()=> 'api/Smart/Alert/CreateUpdateAlert';
} 
export namespace GetAlert{
  export const getAlerts = ()=> 'api/Smart/Alert/GetAlerts';
} 
export namespace GetAlertParams{
  export const getAlertsParams = ()=>'api/smart/Alert/GetAlertParameters'
}

export namespace DeleteAlert{
  export const deleteAlert = ()=> 'api/Smart/Alert/DeleteAlertById'
}

@Injectable({
    providedIn: 'root'
  })

  export class alertservice{

@ApiCallUrl()
private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_SMART;
  
constructor(private http: HttpClient, private appConfig: AppConfig) {}
  
@ObservableException()
  createUpdateAlert(request: any): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${InsertUpdateAlert.insertUpdateAlert()}`,
      { payload: request }
    );
  }

 @ObservableException()
  getAlerts(request: any):Observable<any>{
    return this.http.post<any>(
      `${this._apiUrl}/${GetAlert.getAlerts()}`,
      { payload: request }
    );
  }
  @ObservableException()
  getAlertParamters(request:any): Observable<any>{
    return this.http.post<any>(
      `${this._apiUrl}/${GetAlertParams.getAlertsParams()}`,
      {payload: request}
    );
  } 
  @ObservableException()
  deleteNotification(request:any): Observable<any>{
    return this.http.post<any>(
      `${this._apiUrl}/${DeleteAlert.deleteAlert()}`,
      {payload: request}
    );
  } 
  }
  