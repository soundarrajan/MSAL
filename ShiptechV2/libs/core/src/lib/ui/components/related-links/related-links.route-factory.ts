import {
  IRelatedLinksRouteData,
  RelatedLinksComponent
} from '@shiptech/core/ui/components/related-links/related-links.component';
import { MenuItem } from 'primeng/api';
import { Route } from '@angular/router';
import { Type } from '@angular/core';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';

export interface IBreadrumbsRightRoute extends Route {
  data: IRelatedLinksRouteData;
}

export const SHIPTECH_RELATED_LINKS: MenuItem[] = [
  { label: 'Request', id: 'request' },
  { label: 'Offer', id: 'offer' },
  { label: 'Order', id: 'order' },
  { label: 'Delivery', id: 'delivery' },
  { label: 'Quantity Control', id: 'quantityControl', routerLink: ['./'] },
  { label: 'Labs', id: 'labs' },
  { label: 'Claims', id: 'claims' },
  { label: 'Invoices', id: 'invoices' },
  { label: 'Recon', id: 'recon' }
];

export function getRelatedLinksRouteFactory(links: MenuItem[] = SHIPTECH_RELATED_LINKS, component: Type<any> = RelatedLinksComponent): IBreadrumbsRightRoute {
  return <IBreadrumbsRightRoute>{
    outlet: KnownNamedRouterOutlets.breadcrumbsRight,
    path: '',
    component: component,
    data: {
      relatedLinks: { links }
    }
  };
}
