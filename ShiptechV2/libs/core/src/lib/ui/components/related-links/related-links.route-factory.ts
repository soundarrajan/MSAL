import {
  IRelatedLinkItem,
  IRelatedLinksRouteData,
  RelatedLinksComponent
} from '@shiptech/core/ui/components/related-links/related-links.component';
import { Route } from '@angular/router';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { EntityType } from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';

export interface IRelatedLinksRouteDefinition extends Route {
  data: IRelatedLinksRouteData;
}

export const AllEntityRelatedLinks: IRelatedLinkItem[] = [
  { label: 'Request', id: EntityType.Request },
  { label: 'Offer', id: EntityType.Offer },
  { label: 'Order', id: EntityType.Order },
  { label: 'Delivery', id: EntityType.Delivery },
  { label: 'Quantity Control', id: EntityType.PortCall },
  { label: 'Labs', id: EntityType.Lab },
  { label: 'Claims', id: EntityType.Claim },
  { label: 'Invoices', id: EntityType.Invoice },
  { label: 'Recon', id: EntityType.Recon }
];

export function relatedLinksRouteDefinition(currentRouteLinkType: EntityType, entityIdRouteParam: string, availableLinks: IRelatedLinkItem[] = AllEntityRelatedLinks): IRelatedLinksRouteDefinition {
  return <IRelatedLinksRouteDefinition>{
    outlet: KnownNamedRouterOutlets.breadcrumbsRight,
    path: '',
    component: RelatedLinksComponent,
    data: {
      relatedLinksOptions: {
        availableLinks,
        currentRouteLinkType,
        entityIdRouteParam
      }
    }
  };
}
