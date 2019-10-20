import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiCall, ApiCallForwardTo } from '../../utils/decorators/api-call.decorator';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { Store } from '@ngxs/store';
import { IEntityRelatedLinksService } from '@shiptech/core/services/entity-related-links/entity-related-links.service.interface';
import { EntityRelatedLinksService } from '@shiptech/core/services/entity-related-links/entity-related-links.service';
import { IEntityRelatedLink } from '@shiptech/core/services/entity-related-links/entity-related-links.model';

@Injectable()
export class EntityRelatedLinksServiceMock implements IEntityRelatedLinksService {
  @ApiCallForwardTo() realService: EntityRelatedLinksService;

  constructor(private store: Store, realService: EntityRelatedLinksService) {
    this.realService = realService;
  }

  @ObservableException()
  @ApiCall()
  getRelatedLinksForEntity(id: any): Observable<IEntityRelatedLink[]> {
   return of([])
  }
}
