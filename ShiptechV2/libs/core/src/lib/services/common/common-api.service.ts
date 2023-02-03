import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { AppConfig } from '@shiptech/core/config/app-config';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { ICommonApiService, ILocationListResponse, IProductListResponse } from './common.api.service.interface';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { catchError, map } from 'rxjs/operators';
import { SpotNegotiationApiPaths } from 'libs/feature/spot-negotiation/src/lib/services/api/spot-negotiation-api';
import { IDocumentsCreateUploadRequest, IDocumentsCreateUploadResponse } from '../masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { IDocumentsUpdateIsVerifiedRequest } from '../masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import { IDocumentsUpdateNotesRequest, IDocumentsUpdateNotesResponse } from '../masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';
import { IDocumentsDeleteRequest, IDocumentsDeleteResponse } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { IDocumentsDownloadRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto';

export const CommonApiPaths = {
  getSellerRatings: `api/sellerrating/sellerratingreview/getForNegotiation`,
  getProductList: `api/masters/products/list`,
  getLocationList: `api/masters/locations/listVessel`,
  getDocumentTypeList: `api/masters/documenttype/list`,
  getDocuments: `api/masters/documentupload/list`,
  updateIsVerifiedDocument: `api/masters/documentupload/update`,
  updateNotes: `api/masters/documentupload/notes`,
  uploadDocument: `api/masters/documentupload/create`,
  deleteDocument: `api/masters/documentupload/delete`,
  downloadDocument: `api/masters/documentupload/download`
};

@Injectable({
  providedIn: 'root'
})
export class CommonApiService implements ICommonApiService {
  shared_rowData_grid: any;
  @ApiCallUrl()
  private _sellerApiUrl = this.appConfig.v1.API.BASE_URL_DATA_SELLERRATING;
  protected _masterApiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  handleErrorMessage(body: any) {
    return of(body instanceof HttpErrorResponse && body.status != 401 ? (body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errors ? body.error.errors : body.error.errorMessage) : { message: 'Unauthorized' });
  }

  @ObservableException()
  getDocumentTypeList(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._masterApiUrl}/${CommonApiPaths.getDocumentTypeList}`, { Payload: request })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
      );
  }

  @ObservableException()
  getDocuments(request: any): Observable<any> {
    return this.http
      .post<any>(`${this._masterApiUrl}/${CommonApiPaths.getDocuments}`, { Payload: request })
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
      );
  }

  @ObservableException()
  uploadFile(request: any): Observable<any> {
    return this.http.post<any>(`${this._masterApiUrl}/${CommonApiPaths.uploadDocument}`, request).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  updateIsVerifiedDocument(request: IDocumentsUpdateIsVerifiedRequest): Observable<any> {
    return this.http.post<any>(`${this._masterApiUrl}/${CommonApiPaths.updateIsVerifiedDocument}`, { payload: { ...request } });
  }

  @ObservableException()
  getSellerRatingforNegotiation(payload: any): Observable<any> {
    return this.http.post<any>(`${this._sellerApiUrl}/${CommonApiPaths.getSellerRatings}`, payload).pipe(
      map((body: any) => body),
      catchError((body: any) => this.handleErrorMessage(body))
    );
  }

  @ObservableException()
  getProductList(request: any): Observable<IProductListResponse> {
    const requestUrl = `${this._masterApiUrl}/${CommonApiPaths.getProductList}`;
    return this.http.post(requestUrl, { Payload: request }).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the product list'))
    );
  }

  @ObservableException()
  getLocationList(request: any): Observable<ILocationListResponse> {
    const requestUrl = `${this._masterApiUrl}/${CommonApiPaths.getLocationList}`;
    return this.http.post(requestUrl, { Payload: request }).pipe(
      map((body: any) => body),
      catchError(() => of('Error, could not load the product list'))
    );
  }

  @ObservableException()
  updateNotes(request: IDocumentsUpdateNotesRequest): Observable<IDocumentsUpdateNotesResponse> {
    return this.http.post<IDocumentsUpdateNotesResponse>(`${this._masterApiUrl}/${CommonApiPaths.updateNotes}`, { payload: { ...request } });
  }
  @ObservableException()
  deleteDocument(request: IDocumentsDeleteRequest): Observable<IDocumentsDeleteResponse> {
    return this.http.post<IDocumentsDeleteResponse>(`${this._masterApiUrl}/${CommonApiPaths.deleteDocument}`, { payload: { ...request } });
  }

  @ObservableException()
  downloadDocument(request: IDocumentsDownloadRequest): Observable<Blob> {
    return this.http.post(`${this._masterApiUrl}/${CommonApiPaths.downloadDocument}`, request, {
      responseType: 'blob'
    });
  }
}
export const COMMON_API_SERVICE = new InjectionToken<ICommonApiService>('COMMON_API_SERVICE');
