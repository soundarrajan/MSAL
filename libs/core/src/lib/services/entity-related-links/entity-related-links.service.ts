import { IEntityRelatedLinksApi } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api.interface';
import { Inject, Injectable } from '@angular/core';
import { ENTITY_RELATED_LINKS_API } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api';
import { Observable } from 'rxjs';
import {
  AllEntityRelatedTypes,
  EntityRelatedLinkType,
  IEntityRelatedLink
} from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';
import { ModuleLoggerFactory } from '../../../../../feature/quantity-control/src/lib/core/logging/module-logger-factory';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { Store } from '@ngxs/store';
import { IEntityRelatedLinksResponseDto } from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EntityRelatedLinksService extends BaseStoreService {
  constructor(@Inject(ENTITY_RELATED_LINKS_API) private api: IEntityRelatedLinksApi, store: Store, loggerFactory: ModuleLoggerFactory){
    super(store, loggerFactory.createLogger(EntityRelatedLinksService.name));
  }

  getRelatedLinksForEntity(id: any): Observable<IEntityRelatedLink[]> {
    return this.api.getRelatedLinksForEntity(id).pipe(
      map(response => AllEntityRelatedTypes.map(t => this.tryMapToIEntityRelatedLink(t, response)).filter(e => e))
    );
  }

  // noinspection JSMethodCanBeStatic
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
