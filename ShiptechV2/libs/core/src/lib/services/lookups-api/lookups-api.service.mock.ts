import { ITerminalLookupDto, LookupsApiService } from './lookups-api.service';
import { Observable, of } from 'rxjs';
import { ILookupFilter } from '../../lookups/lookup-filter';
import { MockTerminalsLookup } from './mock-data/terminals.mock';
import { MockProductsLookup } from './mock-data/products.mock';
import { ApiCall, ApiCallForwardTo } from '../../utils/decorators/api-call.decorator';
import { ILookupRequest, ILookupResponse } from '../../lookups/lookup.request';
import { Injectable } from '@angular/core';
import { MockLocationsLookup } from './mock-data/locations.mock';
import { MockUsersLookup } from './mock-data/users.mock';
import { ILookupsApiService } from './lookups-api.service.interface';
import { ICurrenciesLookupDto } from '../../lookups/currency-dto.interface';
import { mockCurrenciesLookup } from './mock-data/currencies.mock';
import { IUomLookupDto } from '../../lookups/uom-dto.interface';
import { mockUomsLookup } from './mock-data/uoms.mock';
import { ILookupDto } from '../../lookups/lookup-dto.interface';
import { mockSitesLookup } from './mock-data/sites.mock';
import { ISitesLookupDto } from '../../lookups/sites-dto';

export const PsMockCyclesLookup: ILookupDto[] = [{ id: 1, name: 'JUNE 1' }, { id: 2, name: 'JULY 1' }, {
  id: 3,
  name: 'AUGUST 1'
}, { id: 4, name: 'SEPT 1' }];
export const PsMockPipelinesLookup: ILookupDto[] = [{ id: 1, name: 'Pipeline 1' }, {
  id: 2,
  name: 'Pipeline 2'
}, { id: 3, name: 'Pipeline 3' }, { id: 4, name: 'Pipeline 4' }];

@Injectable()
export class LookupsApiServiceMock implements ILookupsApiService {
  @ApiCallForwardTo() realService: LookupsApiService;

  constructor(realService: LookupsApiService) {
    this.realService = realService;
  }

  @ApiCall()
  getProducts(request: ILookupRequest): Observable<ILookupResponse> {
    return of({ items: this.search(MockProductsLookup, 'name', request.filter) });
  }

  @ApiCall()
  getTerminals(request: ILookupRequest): Observable<ILookupResponse<ITerminalLookupDto>> {
    return of({ items: this.search(MockTerminalsLookup, 'name', request.filter) });
  }

  @ApiCall()
  getUsers(request: ILookupRequest): Observable<ILookupResponse> {
    return of({ items: this.search(MockUsersLookup, 'name', request.filter) });
  }

  @ApiCall()
  getLocations(request: ILookupRequest): Observable<ILookupResponse> {
    return of({ items: this.search(MockLocationsLookup, 'name', request.filter) });
  }

  @ApiCall()
  getCurrencies(request: ILookupRequest): Observable<ILookupResponse<ICurrenciesLookupDto>> {
    return of({ items: mockCurrenciesLookup });
  }

  @ApiCall()
  getUoms(request: ILookupRequest): Observable<ILookupResponse<IUomLookupDto>> {
    return of({ items: mockUomsLookup });
  }

  @ApiCall()
  getCycles(request: ILookupRequest): Observable<ILookupResponse> {
    return of({ items: this.search(PsMockCyclesLookup, 'name', request.filter) });
  }

  @ApiCall()
  getPipelines(request: ILookupRequest): Observable<ILookupResponse> {
    return of({ items: this.search(PsMockPipelinesLookup, 'name', request.filter) });
  }

  @ApiCall()
  getSites(request: ILookupRequest): Observable<ILookupResponse<ISitesLookupDto>> {
    return of({ items: this.search(mockSitesLookup, 'name', request.filter) });
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
