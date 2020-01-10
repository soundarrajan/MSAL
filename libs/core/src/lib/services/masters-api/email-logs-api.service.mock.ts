import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiCall, ApiCallForwardTo } from "@shiptech/core/utils/decorators/api-call.decorator";
import { IEmailLogsRequest, IEmailLogsResponse } from "./request-response-dtos/email-logs.dto";
import { getMockEmailLogs } from "./mock-data/email-logs.mock";
import { IEmailLogsApiService } from "./email-logs-api.service.interface";
import { EmailLogsApi } from "@shiptech/core/services/masters-api/email-logs-api.service";

@Injectable({
  providedIn: "root"
})
export class EmailLogsApiMock implements IEmailLogsApiService {

  @ApiCallForwardTo() realService: EmailLogsApi;

  constructor(realService: EmailLogsApi) {
    this.realService = realService;
  }

  @ApiCall()
  getEmailLogs(request: IEmailLogsRequest, emailTransactionTypeId: number, reportId: number): Observable<IEmailLogsResponse> {
    const items = getMockEmailLogs(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length
    });
  }
}
