import {Injectable, InjectionToken} from "@angular/core";
import {ApiCallUrl} from "@shiptech/core/utils/decorators/api-call.decorator";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "@shiptech/core/config/app-config";
import {ObservableException} from "@shiptech/core/utils/decorators/observable-exception.decorator";
import {Observable} from "rxjs";
import {IAuditLogApiService} from "@shiptech/core/services/admin-api/audit-log-api.service.interface";
import {IAuditLogRequest, IAuditLogResponse} from "@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto";

export namespace AuditLogApiPaths {
  export const getAuditLog = () => `api/admin/audit/get`;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogApi implements IAuditLogApiService {

  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getAuditLog(request: IAuditLogRequest): Observable<IAuditLogResponse> {
    return this.http.post<IAuditLogResponse>(`${this._apiUrl}/${AuditLogApiPaths.getAuditLog()}`, {payload: request});
  }
}

export const AUDIT_LOG_ADMIN_API_SERVICE = new InjectionToken<IAuditLogApiService>('AUDIT_LOG_ADMIN_API_SERVICE');
