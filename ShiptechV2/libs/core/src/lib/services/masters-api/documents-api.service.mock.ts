import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiCall, ApiCallForwardTo } from "@shiptech/core/utils/decorators/api-call.decorator";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { DocumentsApi } from "@shiptech/core/services/masters-api/documents-api.service";
import { IDocumentsListRequest, IDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-upload-list.dto";
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
  getDocumentList(request: IDocumentsListRequest): Observable<IDocumentsListResponse> {
    const items = getMockDocuments(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length
    });
  }
}
