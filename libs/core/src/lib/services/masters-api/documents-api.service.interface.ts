import { Observable } from "rxjs";
import { IDocumentsListRequest, IDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";
import { IDocumentsUpdateIsVerifiedRequest, IDocumentsUpdateIsVerifiedResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto";
import { IDocumentsDeleteRequest, IDocumentsDeleteResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto";

export interface IDocumentsApiService {
  getDocumentList(request: IDocumentsListRequest): Observable<IDocumentsListResponse>;
  updateIsVerifiedDocument(request: IDocumentsUpdateIsVerifiedRequest): Observable<IDocumentsUpdateIsVerifiedResponse>;
  deleteDocument(request: IDocumentsDeleteRequest): Observable<IDocumentsDeleteResponse>;
}
