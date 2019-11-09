import { LookupsApiService } from './lookups-api.service';
import { Observable, of } from 'rxjs';
import { ILookupFilter } from '../../lookups/lookup-filter';
import { ApiCall, ApiCallForwardTo } from '../../utils/decorators/api-call.decorator';
import { ILookupRequest, ILookupResponse } from '../../lookups/lookup.request';
import { Injectable } from '@angular/core';
import { ILookupsApiService } from './lookups-api.service.interface';
import { IUomLookupDto, mockUomsLookup } from './mock-data/uoms.mock';

@Injectable()
export class LookupsApiServiceMock implements ILookupsApiService {
  @ApiCallForwardTo() realService: LookupsApiService;

  constructor(realService: LookupsApiService) {
    this.realService = realService;
  }


  @ApiCall()
  getUoms(request: ILookupRequest): Observable<ILookupResponse<IUomLookupDto>> {
    return of({ items: mockUomsLookup });
  }

  // noinspection JSMethodCanBeStatic
  private getFilterOrDefault(filter: ILookupFilter): ILookupFilter {
    // Note: We mock server behavior which defaults to these values
    filter.page = filter.page || 0;
    filter.pageSize = filter.pageSize || 10;
    filter.startsWith = filter.startsWith || '';
    return filter;
  }

  private search<T>(source: T[], prop: keyof T, filter: ILookupFilter): T[] {
    filter = this.getFilterOrDefault(filter);

    const startIndex = (filter.page - 1) * filter.pageSize;
    return source
      .filter(dto =>
        (dto[prop] || '')
          .toString()
          .toLowerCase()
          .startsWith((filter.startsWith || '').toLowerCase())
      )
      .slice(startIndex, startIndex + filter.pageSize);
  }
}
