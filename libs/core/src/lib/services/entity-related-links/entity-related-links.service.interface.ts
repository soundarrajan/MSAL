import { Observable } from 'rxjs';
import { IEntityRelatedLink } from '@shiptech/core/services/entity-related-links/entity-related-links.model';

export interface IEntityRelatedLinksService {
  getRelatedLinksForEntity(id: any): Observable<IEntityRelatedLink[]>
}
