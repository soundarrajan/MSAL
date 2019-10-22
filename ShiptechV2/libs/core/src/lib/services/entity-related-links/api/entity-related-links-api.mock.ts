import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiCall, ApiCallForwardTo } from '../../../utils/decorators/api-call.decorator';
import { ObservableException } from '../../../utils/decorators/observable-exception.decorator';
import { Store } from '@ngxs/store';
import { IEntityRelatedLinksApi } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api.interface';
import { EntityRelatedLinksApi } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api';
import {
  EntityRelatedLinksResponseDto,
  EntityTypeIdField
} from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';

@Injectable({
  providedIn: 'root'
})
export class EntityRelatedLinksApiMock implements IEntityRelatedLinksApi {
  @ApiCallForwardTo() realService: EntityRelatedLinksApi;

  constructor(private store: Store, realService: EntityRelatedLinksApi) {
    this.realService = realService;
  }

  @ObservableException()
  @ApiCall()
  getRelatedLinksForEntity(entityType): Observable<EntityRelatedLinksResponseDto> {
    return of({
      [EntityTypeIdField.Request]: 1,
      [EntityTypeIdField.Offer]: 2,
      [EntityTypeIdField.Order]: 3,
      [EntityTypeIdField.Delivery]: 4,
      [EntityTypeIdField.PortCall]: 5,
      [EntityTypeIdField.Lab]: 6,
      [EntityTypeIdField.Claim]: 7,
      [EntityTypeIdField.Invoice]: 8,
      [EntityTypeIdField.Recon]: 9
    });
  }
}
