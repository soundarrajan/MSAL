import { Inject, Injectable } from '@angular/core';
import { PROCUREMENT_API_SERVICE } from './api/procurement.api.service';
import { IProcurementApiService } from './api/procurement.api.service.interface';
import {
  IProcurementRequestDto,
  IShiptechPaginationModel,
  IShiptechProcurementRequestsDto
} from './models/procurement-requests.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProcurementRequestsResponse } from './api/request-response/procurement-requests.request-response';

@Injectable()
export class ProcurementService {

  constructor(@Inject(PROCUREMENT_API_SERVICE) private api: IProcurementApiService) { }

  getAllProcurementRequests(content: Partial<IShiptechProcurementRequestsDto>): Observable<IProcurementRequestsResponse> {
    const payload: IShiptechProcurementRequestsDto = {
      filters: [],
      order: undefined,
      pageFilters: {},
      pagination: content.pagination,
      searchText: undefined,
      SortList: content.SortList
    }
    return this.api.getAllProcurementRequests({payload});
  }
}
