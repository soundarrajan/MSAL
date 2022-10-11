import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ApiCall,
  ApiCallForwardTo
} from '@shiptech/core/utils/decorators/api-call.decorator';
import { IDocumentsApiService } from '@shiptech/core/services/masters-api/documents-api.service.interface';
import { DocumentsApi } from '@shiptech/core/services/masters-api/documents-api.service';
import {
  IDocumentsListRequest,
  IDocumentsListResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto';
import { getMockDocuments } from '@shiptech/core/services/masters-api/mock-data/documents.mock';
import {
  IDocumentsUpdateIsVerifiedRequest,
  IDocumentsUpdateIsVerifiedResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import {
  IDocumentsDeleteRequest,
  IDocumentsDeleteResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import {
  IDocumentsUpdateNotesRequest,
  IDocumentsUpdateNotesResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';
import {
  IDocumentsCreateUploadRequest,
  IDocumentsCreateUploadResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { IDocumentsDownloadRequest, IDocumentsDownloadZipRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto';
import { getMockDocumentsMaster } from '@shiptech/core/services/masters-api/mock-data/documents-master.mock';
import {
  IDocumentsMasterRequest,
  IDocumentsMasterResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto';

@Injectable({
  providedIn: 'root'
})
export class DocumentsApiMock implements IDocumentsApiService {
  @ApiCallForwardTo() realService: DocumentsApi;

  constructor(realService: DocumentsApi) {
    this.realService = realService;
  }

  @ApiCall()
  getDocumentList(
    request: IDocumentsListRequest
  ): Observable<IDocumentsListResponse> {
    const items = getMockDocuments(request.pagination.take) || [];
    return of({
      payload: items,
      matchedCount: items.length
    });
  }

  @ApiCall()
  updateIsVerifiedDocument(
    request: IDocumentsUpdateIsVerifiedRequest
  ): Observable<IDocumentsUpdateIsVerifiedResponse> {
    return of(undefined);
  }

  @ApiCall()
  updateNotesDocument(
    request: IDocumentsUpdateNotesRequest
  ): Observable<IDocumentsUpdateNotesResponse> {
    return of(undefined);
  }

  @ApiCall()
  deleteDocument(
    request: IDocumentsDeleteRequest
  ): Observable<IDocumentsDeleteResponse> {
    return of(undefined);
  }

  @ApiCall()
  downloadDocument(request: IDocumentsDownloadRequest): Observable<Blob> {
    return of(undefined);
  }

  @ApiCall()
  downloadDocumentAsZip(request: IDocumentsDownloadZipRequest): Observable<Blob> {
    return of(undefined);
  }

  @ApiCall()
  uploadFile(
    request: IDocumentsCreateUploadRequest
  ): Observable<IDocumentsCreateUploadResponse> {
    return of(undefined);
  }

  @ApiCall()
  getDocumentsMaster(
    request: IDocumentsMasterRequest
  ): Observable<IDocumentsMasterResponse> {
    const items = getMockDocumentsMaster(request.pagination.take) || [];
    return of({
      payload: items,
      matchedCount: items.length
    });
  }
}
