import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiCall, ApiCallForwardTo } from "@shiptech/core/utils/decorators/api-call.decorator";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { DocumentsApi } from "@shiptech/core/services/masters-api/documents-api.service";
import { IGetDocumentsListRequest, IGetDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/document.dto";
import { getMockDocuments } from "@shiptech/core/services/masters-api/mock-data/documents.mock";

@Injectable({
  providedIn: "root"
})
export class DocumentsApiMock implements IDocumentsApiService {

  @ApiCallForwardTo() realService: DocumentsApi;

  constructor(realService: DocumentsApi) {
    this.realService = realService;
  }

  @ApiCall()
  getDocumentList(request: IGetDocumentsListRequest): Observable<IGetDocumentsListResponse> {
    const items = getMockDocuments(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length
    });
  }
}
