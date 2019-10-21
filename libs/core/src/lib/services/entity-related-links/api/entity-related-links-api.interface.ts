import { Observable } from 'rxjs';
import { IEntityRelatedLinksResponseDto } from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';

export interface IEntityRelatedLinksApi {
  getRelatedLinksForEntity(id: any): Observable<IEntityRelatedLinksResponseDto>
}
