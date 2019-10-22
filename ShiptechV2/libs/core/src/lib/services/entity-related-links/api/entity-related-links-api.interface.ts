import { Observable } from 'rxjs';
import {
  EntityRelatedLinksResponseDto,
  EntityTypeIdField
} from '@shiptech/core/services/entity-related-links/api/entity-related-links.api.model';

export interface IEntityRelatedLinksApi {
  getRelatedLinksForEntity(entityTypeIdField: EntityTypeIdField, id: any): Observable<EntityRelatedLinksResponseDto>
}
