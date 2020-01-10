import {Observable} from "rxjs";
import {IAuditLogAdminRequest, IAuditLogAdminResponse} from "@shiptech/core/services/admin-api/dtos/audit-log.dto";

export interface IAuditLogAdminApiService {
  getAuditLog(request: IAuditLogAdminRequest): Observable<IAuditLogAdminResponse>;
}
