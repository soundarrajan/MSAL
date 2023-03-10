import { Injectable, InjectionToken } from '@angular/core';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { Observable } from 'rxjs';
import {
  IDocumentsListRequest,
  IDocumentsListResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto';
import { IDocumentsApiService } from '@shiptech/core/services/masters-api/documents-api.service.interface';
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
import { IDocumentsDownloadRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto';
import {
  IDocumentsMasterRequest,
  IDocumentsMasterResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto';

export namespace DocumentsApiPaths {
  export const getDocuments = `api/masters/documentupload/list`;
  export const updateIsVerifiedDocument = `api/masters/documentupload/update`;
  export const updateNotesDocument = `api/masters/documentupload/notes`;
  export const deleteDocument = `api/masters/documentupload/delete`;
  export const downloadDocument = `api/masters/documentupload/download`;
  export const uploadDocument = 'api/masters/documentupload/create';
  export const getDocumentsType = 'api/masters/documenttype/list';
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsApi implements IDocumentsApiService {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getDocumentList(
    request: IDocumentsListRequest
  ): Observable<IDocumentsListResponse> {
    return this.http.post<IDocumentsListResponse>(
      `${this._apiUrl}/${DocumentsApiPaths.getDocuments}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  updateIsVerifiedDocument(
    request: IDocumentsUpdateIsVerifiedRequest
  ): Observable<IDocumentsUpdateIsVerifiedResponse> {
    return this.http.post<IDocumentsListResponse>(
      `${this._apiUrl}/${DocumentsApiPaths.updateIsVerifiedDocument}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  updateNotesDocument(
    request: IDocumentsUpdateNotesRequest
  ): Observable<IDocumentsUpdateNotesResponse> {
    return this.http.post<IDocumentsUpdateNotesResponse>(
      `${this._apiUrl}/${DocumentsApiPaths.updateNotesDocument}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  deleteDocument(
    request: IDocumentsDeleteRequest
  ): Observable<IDocumentsDeleteResponse> {
    return this.http.post<IDocumentsDeleteResponse>(
      `${this._apiUrl}/${DocumentsApiPaths.deleteDocument}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  uploadFile(
    request: IDocumentsCreateUploadRequest
  ): Observable<IDocumentsCreateUploadResponse> {
    return this.http.post<IDocumentsCreateUploadResponse>(
      `${this._apiUrl}/${DocumentsApiPaths.uploadDocument}`,
      request
    );
  }

  downloadDocument(request: IDocumentsDownloadRequest): Observable<Blob> {
    return this.http.post(
      `${this._apiUrl}/${DocumentsApiPaths.downloadDocument}`,
      request,
      {
        responseType: 'blob'
      }
    );
  }

  @ObservableException()
  getDocumentsMaster(
    request: IDocumentsMasterRequest
  ): Observable<IDocumentsMasterResponse> {
    return this.http.post<IDocumentsMasterResponse>(
      `${this._apiUrl}/${DocumentsApiPaths.getDocumentsType}`,
      { payload: { ...request } }
    );
  }
}

export const DOCUMENTS_API_SERVICE = new InjectionToken<IDocumentsApiService>(
  'DOCUMENTS_API_SERVICE'
);
