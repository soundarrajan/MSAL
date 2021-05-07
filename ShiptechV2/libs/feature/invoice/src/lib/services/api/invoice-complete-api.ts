import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
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
import { IInvoiceDetailsItemRequest, IInvoiceDetailsItemResponse } from './dto/invoice-details-item.dto';

export namespace InvoiceApiPaths {
  export const getCompletesList = () => `api/invoice/completeViewList`;
  export const getInvoicesList = () => `api/invoice/list`;
  export const getCompletesListExport = () => 'api/invoice/exportCompleteView';
  export const getInvoicesListExport = () => `api/invoice/export`;
  export const getInvoiceItem = () => `api/invoice/get`;
  export const updateInvoiceItem = () => `api/invoice/update`;
  export const productListOnInvoice = () => `api/invoice/deliveriesToBeInvoicedList`;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCompleteApi implements IInvoiceCompleteApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_INVOICES;

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
}

export const INVOICE_COMPLETE_API_SERVICE = new InjectionToken<
  IInvoiceCompleteApiService
>('INVOICE_COMPLETE_API_SERVICE');
