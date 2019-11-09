import { Injectable, InjectionToken } from '@angular/core';
import { AppConfig } from '@shiptech/core/config/app-config';
import { CacheApiService } from '@shiptech/core/services/lookups-api/cache-api.service';
import { ILookupsApiService } from '@shiptech/core/services/lookups-api/lookups-api.service.interface';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { ILookupRequest, ILookupResponse } from '@shiptech/core/lookups/lookup.request';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ILookupFilter, LookupFilter } from '@shiptech/core/lookups/lookup-filter';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { toQueryString } from '@shiptech/core/utils/QueryString';
import { ApiServiceBase } from '@shiptech/core/api/api-base.service';
import { IUomLookupDto } from '@shiptech/core/services/lookups-api/mock-data/uoms.mock';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';


export const LOOKUPS_API_SERVICE = new InjectionToken<ILookupsApiService>('ILookupsApiService');

enum LookupsApiPaths {
  GetUoms = 'api/uom/list',
}

// @dynamic
@Injectable({
  providedIn: 'root'
})
export class LookupsApiService extends ApiServiceBase implements ILookupsApiService {
  @ApiCallUrl()
  protected _lookupApiUrl = this.appConfig.lookupApiUrl;

  constructor(protected appConfig: AppConfig, httpClient: HttpClient, protected cacheService: CacheApiService, private loggerFactory: LoggerFactory) {
    super(httpClient, loggerFactory.createLogger(LookupsApiService.name));
  }

  @ObservableException()
  getUoms<T = ILookupRequest>(request: T): Observable<ILookupResponse<IUomLookupDto>> {
    return this.getLookup(request, LookupsApiPaths.GetUoms);
  }

  @ObservableException()
  protected getLookup<TResponseDto, TFilter extends ILookupFilter = ILookupFilter>(request: ILookupRequest<TFilter>, path: LookupsApiPaths): Observable<ILookupResponse<TResponseDto>> {
    request = request || <ILookupRequest<TFilter>>{};
    const filter = request.filter || new LookupFilter();

    const requestUrl = `${this._lookupApiUrl}/${path}?${toQueryString(filter)}`;

    return this.cacheService.cachedLookupRequest(requestUrl, request.byPassCache);
  }
}
