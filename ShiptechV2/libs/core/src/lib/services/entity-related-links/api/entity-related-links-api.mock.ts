import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiCall, ApiCallForwardTo } from '../../../utils/decorators/api-call.decorator';
import { ObservableException } from '../../../utils/decorators/observable-exception.decorator';
import { Store } from '@ngxs/store';
import { IEntityRelatedLinksApi } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api.interface';
import { EntityRelatedLinksApi } from '@shiptech/core/services/entity-related-links/api/entity-related-links-api';
import { IEntityRelatedLinksResponseDto } from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';

@Injectable()
export class EntityRelatedLinksApiMock implements IEntityRelatedLinksApi {
  @ApiCallForwardTo() realService: EntityRelatedLinksApi;

  constructor(private store: Store, realService: EntityRelatedLinksApi) {
    this.realService = realService;
  }

  @ObservableException()
  @ApiCall()
  getRelatedLinksForEntity(id: any): Observable<IEntityRelatedLinksResponseDto> {
    return of({
      requestId: 1,
      contractId: 2,
      requestGroupId: 3,
      orderId: 4,
      deliveryId: 5,
      labId: 6,
      claimId: 7,
      invoiceId: 8,
      hasQuote: false
    });
  }
}
