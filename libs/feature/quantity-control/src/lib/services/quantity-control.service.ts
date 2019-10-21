import { Inject, Injectable } from '@angular/core';
import { QUANTITY_CONTROL_API_SERVICE } from './api/quantity-control.api.service';
import { IQuantityControlApiService } from './api/quantity-control.api.service.interface';
import { Observable, of } from 'rxjs';

@Injectable()
export class QuantityControlService {

  constructor(@Inject(QUANTITY_CONTROL_API_SERVICE) private api: IQuantityControlApiService) {
  }

  getAllProcurementRequests(content: any): Observable<unknown[]> {
    const payload: any = {
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

    return of([]);
    // return defer(() => this.api.getAllProcurementRequests({ payload })));
  }
}
