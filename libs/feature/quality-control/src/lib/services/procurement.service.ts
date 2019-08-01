import { Inject, Injectable } from '@angular/core';
import { PROCUREMENT_API_SERVICE } from './api/procurement.api.service';
import { IProcurementApiService } from './api/procurement.api.service.interface';
import { IProcurementOrdersRequest } from './models/procurement-requests.dto';
import { defer, Observable } from 'rxjs';
import { IProcurementRequestsResponse } from './api/request-response/procurement-requests.request-response';
import { IGetProcurementOrders } from './models/get-procurement-orders.interface';

@Injectable()
export class ProcurementService {

  constructor(@Inject(PROCUREMENT_API_SERVICE) private api: IProcurementApiService) {
  }

  getAllProcurementRequests(content: IGetProcurementOrders): Observable<IProcurementRequestsResponse> {
    const payload: IProcurementOrdersRequest = {
      pagination: content.pagination,
      SortList: {
        SortList: content.sorts
      }
    };

    if(content.filters && content.filters.length) {
      payload.pageFilters = {
        Filters: content.filters
      }
    }

    if(content.sorts && content.filters.length) {
      payload.SortList = {
        SortList: content.sorts
      }
    }

    if(content.searchText) {
      payload.searchText = content.searchText
    }
    return defer(() => this.api.getAllProcurementRequests({ payload }));
  }
}
