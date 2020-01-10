import {Injectable, InjectionToken} from "@angular/core";
import {ApiCallUrl} from "@shiptech/core/utils/decorators/api-call.decorator";
import {HttpClient} from "@angular/common/http";
import {AppConfig} from "@shiptech/core/config/app-config";
import {ObservableException} from "@shiptech/core/utils/decorators/observable-exception.decorator";
import {Observable} from "rxjs";
import {IAuditLogAdminApiService} from "@shiptech/core/services/admin-api/audit-log-admin-api.service.interface";
import {IAuditLogAdminRequest, IAuditLogAdminResponse} from "@shiptech/core/services/admin-api/dtos/audit-log.dto";

export namespace AuditLogAdminApiPaths {
  export const getAuditLog = () => `api/admin/audit/get`;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogAdminApi implements IAuditLogAdminApiService {

  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getAuditLog(request: IAuditLogAdminRequest): Observable<IAuditLogAdminResponse> {
    return this.http.post<IAuditLogAdminResponse>(`${this._apiUrl}/${AuditLogAdminApiPaths.getAuditLog()}`, {payload: request});
  }
}

export const AUDIT_LOG_ADMIN_API_SERVICE = new InjectionToken<IAuditLogAdminApiService>('AUDIT_LOG_ADMIN_API_SERVICE');
