import { Observable } from "rxjs";
import { IDocumentsListRequest, IDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-upload-list.dto";

export interface IDocumentsApiService {
  getDocumentList(request: IDocumentsListRequest): Observable<IDocumentsListResponse>;
}
