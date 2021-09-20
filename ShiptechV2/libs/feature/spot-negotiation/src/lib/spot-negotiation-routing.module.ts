import { MainSpotNegotiationComponent } from './views/main-spot-negotiation.component';
import { SpotNegotiationComponent } from './views/main/details/spot-negotiation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';

import { KnownSpotNegotiationRoutes } from './known-spot-negotiation.routes';
import { StaticListsRouteResolver } from './static-lists-route.resolver';

const routes: Routes = [
  {
    path: '',
    component: MainSpotNegotiationComponent,
    // resolve: { moduleInit: SpotNegotiationModule },
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            redirectTo: KnownSpotNegotiationRoutes.spotNegotiationList,
            pathMatch: 'full'
          },
          {
            path: KnownSpotNegotiationRoutes.spotNegotiationList
          },
          {
            path: `:${KnownSpotNegotiationRoutes.idParam}`,
            children: [
              {
                path: '',
                redirectTo: KnownSpotNegotiationRoutes.details,
                pathMatch: 'full'
              },
              {
                path: KnownSpotNegotiationRoutes.details,
                component: SpotNegotiationComponent,
                resolve: { staticLists: StaticListsRouteResolver },
                data: {
                  title: 'Negotiation',
                  breadcrumb: 'Negotiation'
                }
              }
              // Note: Left here just for reference, QC does not have related links.
              // relatedLinksRouteDefinition(EntityType.PortCall, KnownQuantityControlRoutes.ReportIdParam)
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpotNegotiationRoutingModule {}
