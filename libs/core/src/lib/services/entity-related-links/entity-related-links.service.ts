import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '../../utils/decorators/api-call.decorator';
import { LoggerFactory } from '../../logging/logger-factory.service';
import { AppConfig } from '../../config/app-config';
import { ApiServiceBase } from '@shiptech/core/api/api-base.service';
import { IEntityRelatedLinksService } from '@shiptech/core/services/entity-related-links/entity-related-links.service.interface';
import {
  AllEntityRelatedTypes,
  EntityRelatedLinkType,
  IEntityRelatedLink
} from '@shiptech/core/services/entity-related-links/entity-related-links.model';
import {
  IEntityRelatedLinksRequestDto,
  IEntityRelatedLinksResponseDto
} from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';
import { map } from 'rxjs/operators';

export const EntityRelatedLinksApiPaths = {
  get: () => `api/infrastructure/navbar/navbaridslist`
};

@Injectable()
export class EntityRelatedLinksService extends ApiServiceBase implements IEntityRelatedLinksService {
  @ApiCallUrl()
  protected _apiUrl = this.appConfig.infrastructureApiUrl;

  constructor(private http: HttpClient, private appConfig: AppConfig, loggerFactory: LoggerFactory) {
    super(http, loggerFactory.createLogger(EntityRelatedLinksService.name));
  }

  @ObservableException()
  public getRelatedLinksForEntity(id: any): Observable<IEntityRelatedLink[]> {
    return this.http.post<IEntityRelatedLinksResponseDto>(`${this._apiUrl}/${EntityRelatedLinksApiPaths.get()}`,
      this.Request<IEntityRelatedLinksRequestDto>({
        InvoiceId: id
      })).pipe(
      map(response => AllEntityRelatedTypes.map(t => this.tryMapToIEntityRelatedLink(t, response)).filter(e => !e))
    );
  }

  private tryMapToIEntityRelatedLink(type: EntityRelatedLinkType, dto: IEntityRelatedLinksResponseDto): IEntityRelatedLink | undefined {
    switch (type) {
      case EntityRelatedLinkType.Request:
        const requestId = dto['requestId'];
        return !requestId ? undefined : {
          type: type,
          id: requestId,
          url: `/#/edit-request/${requestId}`
        };
      case EntityRelatedLinkType.Offer:
        const offerId = dto['requestGroupId'];
        return !offerId ? undefined : {
          type: type,
          id: dto,
          url: `/#/group-of-requests/${offerId}`
        };
      case EntityRelatedLinkType.Order:
        const orderId = dto['orderId'];
        return !orderId ? undefined : {
          type: type,
          id: dto,
          url: `/#/edit-order/${orderId}`
        };
      case EntityRelatedLinkType.Delivery:
        const deliveryId = dto['deliveryId'];
        return !deliveryId ? undefined : {
          type: type,
          id: dto,
          url: `/#/delivery/delivery/edit/${deliveryId}`
        };
      case EntityRelatedLinkType.QuantityControl:
        const portCallId = dto['portCallId'];
        return !portCallId ? undefined : {
          type: type,
          id: dto,
          url: `v2/quantity-control/port-call-details/${portCallId}` // TODO: harcoded v2
        };
      case EntityRelatedLinkType.Labs:
        const labId = dto['labId'];
        return !labId ? undefined : {
          type: type,
          id: dto,
          url: `/#/labs/labresult/edit/${labId}`
        };
      case EntityRelatedLinkType.Claims:
        const claimId = dto['claimId'];
        return !claimId ? undefined : {
          type: type,
          id: dto,
          url: `/#/claims/edit/${claimId}` // TODO: the url is not valid
        };
      case EntityRelatedLinkType.Invoices:
        const invoiceId = dto['invoiceId'];
        return !invoiceId ? undefined : {
          type: type,
          id: dto,
          url: `/#/invoices/invoice/edit/${invoiceId}`
        };
      case EntityRelatedLinkType.Recon:
        const reconId = dto['orderId'];
        return !reconId ? undefined : {
          type: type,
          id: dto,
          url: `/#/recon/reconlist/edit/${reconId}`
        };
    }
  }
}

export const ENTITY_RELATED_LINKS_SERVICE = new InjectionToken<IEntityRelatedLinksService>('IEntityRelatedLinksService');
