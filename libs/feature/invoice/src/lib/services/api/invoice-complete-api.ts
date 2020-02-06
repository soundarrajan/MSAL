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

export namespace InvoiceApiPaths {
  export const getCompletesList = () => `api/invoice/completeViewList`;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceCompleteApi implements IInvoiceCompleteApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_INVOICES;

  constructor(private http: HttpClient, private appConfig: AppConfig) {
  }

  @ObservableException()
  getReportList(request: IGetInvoiceCompletesListRequest): Observable<IGetInvoiceCompletesListResponse> {
    return this.http.post<IGetInvoiceCompletesListResponse>(`${this._apiUrl}/${InvoiceApiPaths.getCompletesList()}`, { payload: request });
  }

}

export const INVOICE_COMPLETE_API_SERVICE = new InjectionToken<IInvoiceCompleteApiService>('INVOICE_COMPLETE_API_SERVICE');
