import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {ApiCall, ApiCallForwardTo} from "@shiptech/core/utils/decorators/api-call.decorator";
import {IAuditLogApiService} from "@shiptech/core/services/admin-api/audit-log-api.service.interface";
import {AuditLogApi} from "@shiptech/core/services/admin-api/audit-log-api.service";
import {IAuditLogRequest, IAuditLogResponse} from "@shiptech/core/services/admin-api/request-response-dtos/audit-log.dto";
import {random} from "faker";
import {getMockAuditLog} from "@shiptech/core/services/admin-api/mock-data/audit-log.mock";

@Injectable({
  providedIn: "root"
})
export class AuditLogApiMock implements IAuditLogApiService {

  @ApiCallForwardTo() realService: AuditLogApi;

  constructor(realService: AuditLogApi) {
    this.realService = realService;
  }

  @ApiCall()
  getAuditLog(request: IAuditLogRequest): Observable<IAuditLogResponse> {
    const items = getMockAuditLog(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length,
      deletedCount: random.number(),
      modifiedCount: random.number(),
      isAcknowledged: random.boolean(),
      isModifiedCountAvailable: random.boolean(),
      upsertedId: random.number(),
      status: random.number(),
      isSuccess: random.boolean(),
      message: random.word(),
      error: null,
      errorMessage: random.word()
    });
  }
}
