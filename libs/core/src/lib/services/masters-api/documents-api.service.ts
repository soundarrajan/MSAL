import { Injectable, InjectionToken } from "@angular/core";
import { ApiCallUrl } from "@shiptech/core/utils/decorators/api-call.decorator";
import { HttpClient } from "@angular/common/http";
import { AppConfig } from "@shiptech/core/config/app-config";
import { ObservableException } from "@shiptech/core/utils/decorators/observable-exception.decorator";
import { Observable } from "rxjs";
import { IEmailLogsApiService } from "./email-logs-api.service.interface";
import { IDocumentsListRequest, IDocumentsListResponse } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-upload-list.dto";
import { IDocumentsApiService } from "@shiptech/core/services/masters-api/documents-api.service.interface";

export namespace DocumentsApiPaths {
  export const getDocuments = () => `api/masters/documenttype/list`;
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
}

export const DOCUMENTS_MASTERS_API_SERVICE = new InjectionToken<IEmailLogsApiService>("DOCUMENTS_MASTERS_API_SERVICE");
