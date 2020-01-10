import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiCall, ApiCallForwardTo } from "@shiptech/core/utils/decorators/api-call.decorator";
import { getMockEmailLogs } from "./mock-data/email-logs.mock";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { DocumentsApi } from "@shiptech/core/services/masters-api/documents-api.service";
import { IGetDocumentsListRequest, IGetDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/document.dto";

@Injectable({
  providedIn: "root"
})
export class DocumentssApiMock implements IDocumentsApiService {

  @ApiCallForwardTo() realService: DocumentsApi;

  constructor(realService: DocumentsApi) {
    this.realService = realService;
  }

  @ApiCall()
  getEmailLogs(request: IGetDocumentsListRequest): Observable<IGetDocumentsListResponse> {
    const items = getMockEmailLogs(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length
    });
  }
}
