import { Injectable, InjectionToken } from "@angular/core";
import { IQuantityControlApiService } from "./quantity-control.api.service.interface";
import { ApiCallUrl } from "@shiptech/core/utils/decorators/api-call.decorator";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "@shiptech/core/config/app-config";
import { ObservableException } from "@shiptech/core/utils/decorators/observable-exception.decorator";
import { IGetQcEmailLogsRequest, IGetQcEmailLogsResponse } from "./request-response/qc-emails-list.request-response";
import { Observable } from "rxjs";
import { IQuantityControlEmailLogsApiService } from "./quantity-control-email-logs.api.service.interface";

export namespace MasterApiPaths {
  export const getEmailLogs = () => `api/masters/emaillogs/list`;
}

@Injectable({
  providedIn: 'root'
})
export class QuantityControlEmailLogsApi implements IQuantityControlEmailLogsApiService {

  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getEmailLogs(request: IGetQcEmailLogsRequest): Observable<IGetQcEmailLogsResponse> {
    return this.http.post<IGetQcEmailLogsResponse>(`${this._apiUrl}/${MasterApiPaths.getEmailLogs()}`, { payload: request });
  }
}

export const QUANTITY_CONTROL_EMAIL_LOGS_API_SERVICE = new InjectionToken<IQuantityControlEmailLogsApiService>('QUANTITY_CONTROL_EMAIL_LOGS_API_SERVICE');
