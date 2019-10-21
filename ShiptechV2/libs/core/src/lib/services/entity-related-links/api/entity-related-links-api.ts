import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObservableException } from '../../../utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '../../../utils/decorators/api-call.decorator';
import { LoggerFactory } from '../../../logging/logger-factory.service';
import { AppConfig } from '../../../config/app-config';
import { ApiServiceBase } from '@shiptech/core/api/api-base.service';
import { IEntityRelatedLinksApi } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api.interface';
import {
  IEntityRelatedLinksRequestDto,
  IEntityRelatedLinksResponseDto
} from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';

export const EntityRelatedLinksApiPaths = {
  get: () => `api/infrastructure/navbar/navbaridslist`
};

@Injectable({
  providedIn: 'root'
})
export class EntityRelatedLinksApi extends ApiServiceBase implements IEntityRelatedLinksApi {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.infrastructureApiUrl;

  constructor(private http: HttpClient, private appConfig: AppConfig, loggerFactory: LoggerFactory) {
    super(http, loggerFactory.createLogger(EntityRelatedLinksApi.name));
  }

  @ObservableException()
  public getRelatedLinksForEntity(id: any): Observable<IEntityRelatedLinksResponseDto> {
    return this.http.post<IEntityRelatedLinksResponseDto>(`${this._apiUrl}/${EntityRelatedLinksApiPaths.get()}`,
      this.Request<IEntityRelatedLinksRequestDto>({
        InvoiceId: id
      }));
  }
}

export const ENTITY_RELATED_LINKS_API = new InjectionToken<IEntityRelatedLinksApi>('IEntityRelatedLinksApi');
