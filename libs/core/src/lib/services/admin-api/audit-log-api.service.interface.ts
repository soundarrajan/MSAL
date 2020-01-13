import {Observable} from "rxjs";
import {IAuditLogRequest, IAuditLogResponse} from "@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto";

export interface IAuditLogApiService {
  getAuditLog(request: IAuditLogRequest): Observable<IAuditLogResponse>;
}
