import { Injectable, InjectionToken } from "@angular/core";
import { ApiCallUrl } from "@shiptech/core/utils/decorators/api-call.decorator";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "@shiptech/core/config/app-config";
import { ObservableException } from "@shiptech/core/utils/decorators/observable-exception.decorator";
import { IEmailLogsRequest, IEmailLogsResponse } from "./request-response-dtos/email-logs.dto";
import { Observable } from "rxjs";
import { IEmailLogsApiService } from "./email-logs-api.service.interface";

export namespace EmailLogsApiPaths {
  export const getEmailLogs = () => `api/masters/emaillogs/list`;
}

@Injectable({
  providedIn: 'root'
})
export class EmailLogsApi implements IEmailLogsApiService {

  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getEmailLogs(request: IEmailLogsRequest): Observable<IEmailLogsResponse> {
    return this.http.post<IEmailLogsResponse>(`${this._apiUrl}/${EmailLogsApiPaths.getEmailLogs()}`, { payload: {...request} });
  }
}

export const EMAIL_LOGS_MASTERS_API_SERVICE = new InjectionToken<IEmailLogsApiService>('EMAIL_LOGS_MASTERS_API_SERVICE');
