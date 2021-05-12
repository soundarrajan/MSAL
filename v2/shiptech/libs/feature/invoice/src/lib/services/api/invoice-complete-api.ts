import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { IInvoiceCompleteApiService } from './invoice-complete.api.service.interface';
import {
  IGetInvoiceCompletesListRequest,
  IGetInvoiceCompletesListResponse
} from './dto/invoice-complete-list-item.dto';
import {
  IGetInvoiceListRequest,
  IGetInvoiceListResponse
} from './dto/invoice-list-item.dto';
import { IInvoiceDetailsItemRequest, IInvoiceDetailsItemResponse,INewInvoiceDetailsItemRequest } from './dto/invoice-details-item.dto';
import { catchError, map } from 'rxjs/operators';

export namespace InvoiceApiPaths {
  export const getCompletesList = () => `api/invoice/completeViewList`;
  export const getInvoicesList = () => `api/invoice/list`;
  export const getCompletesListExport = () => 'api/invoice/exportCompleteView';
  export const getInvoicesListExport = () => `api/invoice/export`;
  export const getInvoiceItem = () => `api/invoice/get`;
  export const getNewInvoiceItem = () => `api/invoice/newFromDelivery`;

  export const updateInvoiceItem = () => `api/invoice/update`;
  export const productListOnInvoice = () => `api/invoice/deliveriesToBeInvoicedList`;
  export const submitapproval = () => `api/invoice/submitForApproval`;
  export const cancelInvoiceItem = () => `api/invoice/cancel`;
  export const acceptInvoiceItem = () => `api/invoice/accept`;
  export const revertInvoiceItem = () => `api/invoice/revert`;
  export const rejectInvoiceItem = () => `api/invoice/reject`;
  export const approveInvoiceItem = () => `api/invoice/approve`;
  export const submitReview = () => `api/invoice/submitForReview`;
  export const getStaticLists = () =>  `api/infrastructure/static/lists`;
  export const getUomConversionFactor = () =>  `api/masters/uoms/convertQuantity`;
  export const calculateProductRecon = () =>  `api/recon/invoiceproduct`;

  


}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCompleteApi implements IInvoiceCompleteApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_INVOICES;

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE;

  @ApiCallUrl()
  private _masterUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  @ApiCallUrl()
  private _reconUrl = this.appConfig.v1.API.BASE_URL_DATA_RECON;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getReportList(
    request: IGetInvoiceCompletesListRequest
  ): Observable<IGetInvoiceCompletesListResponse> {
    return this.http.post<IGetInvoiceCompletesListResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.getCompletesList()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getInvoiceList(
    request: IGetInvoiceListRequest
  ): Observable<IGetInvoiceListResponse> {
    return this.http.post<IGetInvoiceListResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.getInvoicesList()}`,
      { payload: request }
    );
  }

  getReportListExportUrl(): string {
    return `${this._apiUrl}/${InvoiceApiPaths.getCompletesListExport()}`;
  }

  getInvoiceListExportUrl(): string {
    return `${this._apiUrl}/${InvoiceApiPaths.getInvoicesListExport()}`;
  }

  @ObservableException()
  getInvoicDetails(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.getInvoiceItem()}`, 
      request );
  }
  getNewInvoicDetails(
    request: INewInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.getNewInvoiceItem()}`, 
      request );
  }

  @ObservableException()
  updateInvoiceItem(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.updateInvoiceItem()}`, 
      request );
  }

  @ObservableException()
  productListOnInvoice(
    request ): Observable<any> {
    return this.http.post(
      `${this._apiUrl}/${InvoiceApiPaths.productListOnInvoice()}`, 
      request );
  }
  @ObservableException()
  approveInvoiceItem(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.approveInvoiceItem()}`, 
      request );
  }

  @ObservableException()
  submitapproval(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.submitapproval()}`, 
      request );
  }

  @ObservableException()
  cancelInvoiceItem(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.cancelInvoiceItem()}`, 
      request );
  }

  @ObservableException()
  acceptInvoiceItem(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.acceptInvoiceItem()}`, 
      request );
  }

  @ObservableException()
  revertInvoiceItem(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.revertInvoiceItem()}`, 
      request );
  }

  @ObservableException()
  rejectInvoiceItem(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.rejectInvoiceItem()}`, 
      request );
  }
  @ObservableException()
  submitReview(
    request: IInvoiceDetailsItemRequest
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.submitReview()}`, 
      request );
  }

  @ObservableException()
  getStaticLists(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._infrastructureApiUrl}/${InvoiceApiPaths.getStaticLists()}`,
      { Payload: request }
    ).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  getUomConversionFactor(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._masterUrl}/${InvoiceApiPaths.getUomConversionFactor()}`,
      request
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  
  @ObservableException()
  calculateProductRecon(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._reconUrl}/${InvoiceApiPaths.calculateProductRecon()}`,
      {payload: request}
    ).pipe(
      map((body: any) => body),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

}

export const INVOICE_COMPLETE_API_SERVICE = new InjectionToken<
  IInvoiceCompleteApiService
>('INVOICE_COMPLETE_API_SERVICE');
