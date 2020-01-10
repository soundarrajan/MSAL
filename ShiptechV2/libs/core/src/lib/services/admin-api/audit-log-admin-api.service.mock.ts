import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {ApiCall, ApiCallForwardTo} from "@shiptech/core/utils/decorators/api-call.decorator";
import {IAuditLogAdminApiService} from "@shiptech/core/services/admin-api/audit-log-admin-api.service.interface";
import {AuditLogAdminApi} from "@shiptech/core/services/admin-api/audit-log-admin-api.service";
import {IAuditLogAdminRequest, IAuditLogAdminResponse} from "@shiptech/core/services/admin-api/dtos/audit-log.dto";
import {random} from "faker";
import {getMockAuditLog} from "@shiptech/core/services/admin-api/mock-data/audit-log.mock";

@Injectable({
  providedIn: "root"
})
export class AuditLogAdminApiMock implements IAuditLogAdminApiService {

  @ApiCallForwardTo() realService: AuditLogAdminApi;

  constructor(realService: AuditLogAdminApi) {
    this.realService = realService;
  }

  @ApiCall()
  getAuditLog(request: IAuditLogAdminRequest): Observable<IAuditLogAdminResponse> {
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
