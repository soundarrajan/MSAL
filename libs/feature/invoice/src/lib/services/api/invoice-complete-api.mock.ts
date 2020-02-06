import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InvoiceCompleteApi } from './invoice-complete-api';
import { ApiCall, ApiCallForwardTo } from '@shiptech/core/utils/decorators/api-call.decorator';
import * as _ from 'lodash';
import {
  ICompleteListItemDto,
  IGetInvoiceCompletesListRequest,
  IGetInvoiceCompletesListResponse
} from './dto/invoice-complete-list-item.dto';
import { getMockInvoiceCompleteList } from './mock/invoice-complete-list.mock';
import { IInvoiceCompleteApiService } from './invoice-complete.api.service.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoiceCompleteApiMock implements IInvoiceCompleteApiService {

  @ApiCallForwardTo() realService: InvoiceCompleteApi;

  constructor(realService: InvoiceCompleteApi) {
    this.realService = realService;
  }

  @ApiCall()
  getReportList(request: IGetInvoiceCompletesListRequest): Observable<IGetInvoiceCompletesListResponse> {
    const items = getMockInvoiceCompleteList(request.pagination.take) || [];
    const firstItem = (_.first(items) || <ICompleteListItemDto>{});

    return of({
      items: items,
      totalCount: items.length,
      nbOfMatched: firstItem.nbOfMatched || 0,
      nbOfMatchedWithinLimit: firstItem.nbOfMatchedWithinLimit || 0,
      nbOfNotMatched: firstItem.nbOfNotMatched || 0
    });
  }

}
