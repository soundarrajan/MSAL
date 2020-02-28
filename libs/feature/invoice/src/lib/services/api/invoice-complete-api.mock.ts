import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InvoiceCompleteApi } from './invoice-complete-api';
import {
  ApiCall,
  ApiCallForwardTo
} from '@shiptech/core/utils/decorators/api-call.decorator';
import {
  IGetInvoiceCompletesListRequest,
  IGetInvoiceCompletesListResponse
} from './dto/invoice-complete-list-item.dto';
import { getMockInvoiceCompleteList } from './mock/invoice-complete-list.mock';
import { IInvoiceCompleteApiService } from './invoice-complete.api.service.interface';
import {
  IGetInvoiceListRequest,
  IGetInvoiceListResponse
} from './dto/invoice-list-item.dto';
import { getMockInvoiceList } from './mock/invoice-list.mock';

@Injectable({
  providedIn: 'root'
})
export class InvoiceCompleteApiMock implements IInvoiceCompleteApiService {
  @ApiCallForwardTo() realService: InvoiceCompleteApi;

  constructor(realService: InvoiceCompleteApi) {
    this.realService = realService;
  }

  @ApiCall()
  getReportList(
    request: IGetInvoiceCompletesListRequest
  ): Observable<IGetInvoiceCompletesListResponse> {
    const items = getMockInvoiceCompleteList(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length
    });
  }

  @ApiCall()
  getInvoiceList(
    request: IGetInvoiceListRequest
  ): Observable<IGetInvoiceListResponse> {
    const items = getMockInvoiceList(request.pagination.take) || [];

    return of({
      payload: items,
      matchedCount: items.length
    });
  }

  @ApiCall()
  getReportListExportUrl(): string {
    return '';
  }

  @ApiCall()
  getInvoiceListExportUrl(): string {
    return '';
  }
}
