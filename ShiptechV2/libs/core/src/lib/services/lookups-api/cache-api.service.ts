import { Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILookupResponse } from '../../lookups/lookup.request';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { Cacheable } from 'ngx-cacheable';
import { switchMap } from 'rxjs/operators';
import { ApiError } from '../../error-handling/api/api-error';

// @dynamic
@Injectable()
export class CacheApiService {

  constructor(protected httpClient: HttpClient) {
  }

  // @dynamic
  // noinspection JSUnusedLocalSymbols
  @ObservableException()
  @Cacheable({
    cacheResolver: (oldParameters: any[], newParameters: any[]) => {
      // Note: old url and new may refer to different path, since this is a shared method.
      const oldUrl = oldParameters[0];
      const newUrl = newParameters[0];

      // Note: For the same url decide if we should use the cache or not.
      // Note: If second parameter _byPassCache is set to true, make a fresh request
      const byPassCache = newParameters && newParameters.length > 1 && newParameters[1] === true;
      // noinspection UnnecessaryLocalVariableJS
      const useFromCache = oldUrl === newUrl && !byPassCache;

      return useFromCache;
    },
    shouldCacheDecider: (response: ILookupResponse<any>) => response && !!response.items,
    maxAge: 1000 * 60 * 2, // in ms, cache for 2 minutes,
    slidingExpiration: true,
    maxCacheCount: 100
  })
  public cachedLookupRequest<TResponseDto>(url: string, _byPassCache: boolean): Observable<ILookupResponse<TResponseDto>> {
    return this.httpClient
      .get<ILookupResponse<TResponseDto>>(url)
      .pipe(switchMap(response => (!response || !response.items ? throwError(ApiError.LookupsItemsPropertyMissing(response)) : of(response))));
  }
}
