import { Injectable, InjectionToken } from "@angular/core";
import { ApiCallUrl } from "@shiptech/core/utils/decorators/api-call.decorator";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "@shiptech/core/config/app-config";
import { ObservableException } from "@shiptech/core/utils/decorators/observable-exception.decorator";
import { Observable } from "rxjs";
import { IEmailLogsApiService } from "./email-logs-api.service.interface";
import { IDocumentsListRequest, IDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";
import { IDocumentsUpdateIsVerifiedRequest, IDocumentsUpdateIsVerifiedResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto";
import { IDocumentsDeleteRequest, IDocumentsDeleteResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto";
import { IDocumentsUpdateNotesRequest, IDocumentsUpdateNotesResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto";

export namespace DocumentsApiPaths {
  export const getDocuments = () => `api/masters/documentupload/list`;
  export const updateIsVerifiedDocument = () => `api/masters/documentupload/update`;
  export const updateNotesDocument = () => `api/masters/documentupload/notes`;
  export const deleteDocument = () => `api/masters/documentupload/delete`;
  export const downloadDocument = () => `api/masters/documentupload/downloadGet`;
}

@Injectable({
  providedIn: "root"
})
export class DocumentsApi implements IDocumentsApiService {

  @ApiCallUrl()
  protected _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getDocumentList(request: IDocumentsListRequest): Observable<IDocumentsListResponse> {
    return this.http.post<IDocumentsListResponse>(`${this._apiUrl}/${DocumentsApiPaths.getDocuments()}`, { payload: { ...request } });
  }

  @ObservableException()
  updateIsVerifiedDocument(request: IDocumentsUpdateIsVerifiedRequest): Observable<IDocumentsUpdateIsVerifiedResponse> {
    return this.http.post<IDocumentsListResponse>(`${this._apiUrl}/${DocumentsApiPaths.updateIsVerifiedDocument()}`, { payload: { ...request } });
  }

  @ObservableException()
  updateNotesDocument(request: IDocumentsUpdateNotesRequest): Observable<IDocumentsUpdateNotesResponse> {
    return this.http.post<IDocumentsUpdateNotesResponse>(`${this._apiUrl}/${DocumentsApiPaths.updateNotesDocument()}`, { payload: { ...request } });
  }

  @ObservableException()
  deleteDocument(request: IDocumentsDeleteRequest): Observable<IDocumentsDeleteResponse> {
    return this.http.post<IDocumentsDeleteResponse>(`${this._apiUrl}/${DocumentsApiPaths.deleteDocument()}`, { payload: { ...request } });
  }

  downloadDocument(id: number): string{
    return `${this._apiUrl}/${DocumentsApiPaths.downloadDocument()}`;
  }
}

export const DOCUMENTS_API_SERVICE = new InjectionToken<IEmailLogsApiService>("DOCUMENTS_API_SERVICE");
