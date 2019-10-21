import {
  IRelatedLinkItem,
  IRelatedLinksRouteData,
  RelatedLinksComponent
} from '@shiptech/core/ui/components/related-links/related-links.component';
import { Route } from '@angular/router';
import { KnownNamedRouterOutlets } from '@shiptech/core/ui/components/navigation/known-named-router-outlets';
import { EntityRelatedLinkType } from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';

export interface IRelatedLinksRouteDefinition extends Route {
  data: IRelatedLinksRouteData;
}

export const SHIPTECH_RELATED_LINKS: IRelatedLinkItem[] = [
  { label: 'Request', id: EntityRelatedLinkType.Request },
  { label: 'Offer', id: EntityRelatedLinkType.Offer },
  { label: 'Order', id: EntityRelatedLinkType.Order },
  { label: 'Delivery', id: EntityRelatedLinkType.Delivery },
  { label: 'Quantity Control', id: EntityRelatedLinkType.QuantityControl },
  { label: 'Labs', id: EntityRelatedLinkType.Labs },
  { label: 'Claims', id: EntityRelatedLinkType.Claims },
  { label: 'Invoices', id: EntityRelatedLinkType.Invoices },
  { label: 'Recon', id: EntityRelatedLinkType.Recon }
];

export function relatedLinksRouteDefinition(currentRouteLinkType: EntityRelatedLinkType, entityIdRouteParam: string, availableLinks: IRelatedLinkItem[] = SHIPTECH_RELATED_LINKS): IRelatedLinksRouteDefinition {
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
