import {Observable} from "rxjs";
import {IDocumentsListRequest, IDocumentsListResponse} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";
import {IDocumentsUpdateIsVerifiedRequest, IDocumentsUpdateIsVerifiedResponse} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto";
import {IDocumentsDeleteRequest, IDocumentsDeleteResponse} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto";
import {IDocumentsUpdateNotesRequest, IDocumentsUpdateNotesResponse} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto";
import {IDocumentsCreateUploadResponse} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto";
import {IDocumentsDownloadRequest} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto";

export interface IDocumentsApiService {
  getDocumentList(request: IDocumentsListRequest): Observable<IDocumentsListResponse>;

  updateIsVerifiedDocument(request: IDocumentsUpdateIsVerifiedRequest): Observable<IDocumentsUpdateIsVerifiedResponse>;

  updateNotesDocument(request: IDocumentsUpdateNotesRequest): Observable<IDocumentsUpdateNotesResponse>;

  deleteDocument(request: IDocumentsDeleteRequest): Observable<IDocumentsDeleteResponse>;

  uploadFile(request: FormData): Observable<IDocumentsCreateUploadResponse>;

  downloadDocument(id: IDocumentsDownloadRequest): Observable<Blob>;
}
