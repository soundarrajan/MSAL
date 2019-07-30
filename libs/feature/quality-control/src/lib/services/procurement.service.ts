import { Inject, Injectable } from '@angular/core';
import { PROCUREMENT_API_SERVICE } from './api/procurement.api.service';
import { IProcurementApiService } from './api/procurement.api.service.interface';
import { IProcurementRequestDto, IShiptechProcurementRequestsDto } from './models/procurement-requests.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProcurementService {

  constructor(@Inject(PROCUREMENT_API_SERVICE) private api: IProcurementApiService) { }

  getAllProcurementRequests(): Observable<IProcurementRequestDto[]> {
    const payload: IShiptechProcurementRequestsDto = {
      filters: [],
      order: undefined,
      pageFilters: {},
      pagination: {take: 25, skip: 0},
      searchText: undefined,
      SortList: []
    }
    return this.api.getAllProcurementRequests({payload}).pipe(map(r => r.payload))
  }
}
