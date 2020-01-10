import { Injectable, InjectionToken } from "@angular/core";
import { IQuantityControlApiService } from "../../../../../feature/quantity-control/src/lib/services/api/quantity-control.api.service.interface";
import { ApiCallUrl } from "@shiptech/core/utils/decorators/api-call.decorator";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "@shiptech/core/config/app-config";
import { ObservableException } from "@shiptech/core/utils/decorators/observable-exception.decorator";
import { IEmailLogsMastersRequest, IEmailLogsMastersResponse } from "./dtos/email-logs.dto";
import { Observable } from "rxjs";
import { IEmailLogsMastersApiService } from "./email-logs-masters-api.service.interface";

export namespace EmailLogsMasterApiPaths {
  export const getEmailLogs = () => `api/masters/emaillogs/list`;
}

@Injectable({
  providedIn: 'root'
})
export class EmailLogsMastersApi implements IEmailLogsMastersApiService {

  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getEmailLogs(request: IEmailLogsMastersRequest): Observable<IEmailLogsMastersResponse> {
    return this.http.post<IEmailLogsMastersResponse>(`${this._apiUrl}/${EmailLogsMasterApiPaths.getEmailLogs()}`, { payload: request });
  }
}

export const EMAIL_LOGS_MASTERS_API_SERVICE = new InjectionToken<IEmailLogsMastersApiService>('EMAIL_LOGS_MASTERS_API_SERVICE');
