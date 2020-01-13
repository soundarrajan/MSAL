import { Observable } from "rxjs";
import { IGetDocumentsListRequest, IGetDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/document.dto";

export interface IDocumentsApiService {
  getDocumentList(request: IGetDocumentsListRequest): Observable<IGetDocumentsListResponse>;
}
