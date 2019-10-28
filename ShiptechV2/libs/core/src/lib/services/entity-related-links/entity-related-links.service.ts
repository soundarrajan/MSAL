import { IEntityRelatedLinksApi } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api.interface';
import { Inject, Injectable } from '@angular/core';
import { ENTITY_RELATED_LINKS_API } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api';
import { Observable } from 'rxjs';
import {
  AllEntityTypes,
  EntityToEntityIdFieldMap,
  EntityType,
  IEntityRelatedLink
} from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';
import { ModuleLoggerFactory } from '../../../../../feature/quantity-control/src/lib/core/logging/module-logger-factory';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { Store } from '@ngxs/store';
import { EntityRelatedLinksResponse } from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';
import { map } from 'rxjs/operators';
import { UrlService } from '@shiptech/core/services/url/url.service';

@Injectable({
  providedIn: 'root'
})
export class EntityRelatedLinksService extends BaseStoreService {
  constructor(
    private urlService: UrlService,
    @Inject(ENTITY_RELATED_LINKS_API) private api: IEntityRelatedLinksApi, store: Store, loggerFactory: ModuleLoggerFactory){
    super(store, loggerFactory.createLogger(EntityRelatedLinksService.name));
  }

  getRelatedLinksForEntity(entityType: EntityType, id: any): Observable<IEntityRelatedLink[]> {
    return this.api.getRelatedLinksForEntity(EntityToEntityIdFieldMap[entityType], Number(id)).pipe(
      map(response => AllEntityTypes.map(t => this.tryMapToEntityRelatedLink(t, response)).filter(e => e))
    );
  }

  // noinspection JSMethodCanBeStatic
  private tryMapToEntityRelatedLink(type: EntityType, dto: EntityRelatedLinksResponse): IEntityRelatedLink | undefined {
    // TODO: Define a V1 Route Service
    switch (type) {
      case EntityType.Request:
        return !dto.requestId ? undefined : {
          type: type,
          id: dto.requestId,
          url: this.urlService.editRequest(dto.requestId)
        };
      case EntityType.Offer:
        return dto.requestGroupId ? {
          type: type,
          id: dto.requestGroupId,
          url: this.urlService.offer(dto.requestId)
        } : undefined;
      case EntityType.Order:
        return dto.orderId ? {
          type: type,
          id: dto.orderId,
          url: this.urlService.editOrder(dto.orderId)
        } : undefined;
      case EntityType.Delivery:
        return !dto.deliveryId ? undefined : {
          type: type,
          id: dto.deliveryId,
          url: this.urlService.editDelivery(dto.deliveryId)
        };
      case EntityType.PortCall:
        return dto.portCallId ? {
          type: type,
          id: dto.portCallId,
          url: this.urlService.portCallDetails(dto.portCallId)
        } : undefined;
      case EntityType.Lab:
        return dto.labId ? {
          type: type,
          id: dto.labId,
          url: this.urlService.editLabResults(dto.labId)
        } : undefined;
      case EntityType.Claim:
        return dto.claimId ? {
          type: type,
          id: dto.claimId,
          url: this.urlService.editClaim(dto.claimId)
        } : undefined;
      case EntityType.Invoice:
        return dto.invoiceId ? {
          type: type,
          id: dto.invoiceId,
          url: this.urlService.editInvoice(dto.invoiceId)
        } : undefined;
      case EntityType.Recon:
        return dto.orderId ? {
          type: type,
          id: dto.orderId,
          url: this.urlService.editReconListOrder(dto.orderId)
        } : undefined;
    }
  }
}
