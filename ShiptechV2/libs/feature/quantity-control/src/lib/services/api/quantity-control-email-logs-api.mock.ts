import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiCall, ApiCallForwardTo } from "@shiptech/core/utils/decorators/api-call.decorator";
import { IGetQcEmailLogsRequest, IGetQcEmailLogsResponse } from "./request-response/qc-emails-list.request-response";
import { getMockQcEmailLogs } from "./mock/qc-email-list.mock";
import { IQuantityControlEmailLogsApiService } from "./quantity-control-email-logs.api.service.interface";
import { QuantityControlEmailLogsApi } from "./quantity-control-email-logs-api";

@Injectable({
  providedIn: "root"
})
export class QuantityControlEmailLogsApiMock implements IQuantityControlEmailLogsApiService {

  @ApiCallForwardTo() realService: QuantityControlEmailLogsApi;

  constructor(realService: QuantityControlEmailLogsApi) {
    this.realService = realService;
  }

  @ApiCall()
  getEmailLogs(request: IGetQcEmailLogsRequest): Observable<IGetQcEmailLogsResponse> {
    const items = getMockQcEmailLogs(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length
    });
  }
}
