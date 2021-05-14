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

  export const createInvoiceItem = () => `api/invoice/create`;
  export const updateInvoiceItem = () => `api/invoice/update`;
  export const productListOnInvoice = () => `api/invoice/deliveriesToBeInvoicedList`;
  export const submitapproval = () => `api/invoice/submitForApproval`;
  export const cancelInvoiceItem = () => `api/invoice/cancel`;
  export const acceptInvoiceItem = () => `api/invoice/accept`;
  export const revertInvoiceItem = () => `api/invoice/revert`;
  export const rejectInvoiceItem = () => `api/invoice/reject`;
  export const approveInvoiceItem = () => `api/invoice/approve`;
  export const submitForReview = () => `api/invoice/submitForReview`;
  export const getStaticLists = () =>  `api/infrastructure/static/lists`;
  export const getUomConversionFactor = () =>  `api/masters/uoms/convertQuantity`;
  export const calculateProductRecon = () =>  `api/recon/invoiceproduct`;
  export const addTransaction = () =>  `api/invoice/deliveriesToBeInvoicedList`;
  export const totalConversion = () =>  `api/invoice/totalConversion`;




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
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {

    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.getInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  getNewInvoicDetails(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {

    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.getNewInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  createInvoice(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.createInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.upsertedId),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  updateInvoice(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.updateInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  productListOnInvoice(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${InvoiceApiPaths.productListOnInvoice()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  approveInvoiceItem(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.approveInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  submitapproval(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.submitapproval()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  cancelInvoiceItem(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.cancelInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  acceptInvoiceItem(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.acceptInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  revertInvoiceItem(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.revertInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  rejectInvoiceItem(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.rejectInvoiceItem()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  submitForReview(
    request: any
  ): Observable<IInvoiceDetailsItemResponse> {
    return this.http.post<IInvoiceDetailsItemResponse>(
      `${this._apiUrl}/${InvoiceApiPaths.submitForReview()}`,
      { payload: request }
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
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

  @ObservableException()
  addTransaction(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${InvoiceApiPaths.addTransaction()}`,
      request
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

  @ObservableException()
  computeInvoiceTotalConversion(
    request: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this._apiUrl}/${InvoiceApiPaths.totalConversion()}`,
      {payload: request}
    ).pipe(
      map((body: any) => body.payload),
      catchError((body: any) => of(body.error.ErrorMessage && body.error.Reference ? body.error.ErrorMessage + ' ' + body.error.Reference : body.error.errorMessage + ' ' + body.error.reference))
    );
  }

}

export const INVOICE_COMPLETE_API_SERVICE = new InjectionToken<
  IInvoiceCompleteApiService
>('INVOICE_COMPLETE_API_SERVICE');
