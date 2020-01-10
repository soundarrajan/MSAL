import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiCall, ApiCallForwardTo } from "@shiptech/core/utils/decorators/api-call.decorator";
import { IEmailLogsMastersRequest, IEmailLogsMastersResponse } from "./dtos/email-logs.dto";
import { getMockEmailLogs } from "./mock-data/email-logs.mock";
import { IEmailLogsMastersApiService } from "./email-logs-masters-api.service.interface";
import { EmailLogsMastersApi } from "@shiptech/core/services/masters-api/email-logs-masters-api.service";

@Injectable({
  providedIn: "root"
})
export class EmailLogsMastersApiMock implements IEmailLogsMastersApiService {

  @ApiCallForwardTo() realService: EmailLogsMastersApi;

  constructor(realService: EmailLogsMastersApi) {
    this.realService = realService;
  }

  @ApiCall()
  getEmailLogs(request: IEmailLogsMastersRequest): Observable<IEmailLogsMastersResponse> {
    const items = getMockEmailLogs(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length
    });
  }
}
