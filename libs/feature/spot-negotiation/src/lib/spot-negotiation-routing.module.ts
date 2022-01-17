import { MainSpotNegotiationComponent } from './views/main-spot-negotiation.component';
import { SpotNegotiationComponent } from './views/main/details/spot-negotiation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';

import { KnownSpotNegotiationRoutes } from './known-spot-negotiation.routes';
import { StaticListsRouteResolver } from './static-lists-route.resolver';
import { NavBarResolver } from './views/main/details/navbar-route.resolver';
import { UomsRouteResolver } from './uoms-route.resolver';
import { SpotnegoemaillogComponent } from './views/main/details/components/spotnegoemaillog/spotnegoemaillog.component';

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
                resolve: {
                  staticLists: StaticListsRouteResolver,
                  navBar: NavBarResolver,
                  uoms: UomsRouteResolver
                },
                data: {
                  title: 'Negotiation',
                  breadcrumb: 'Negotiation'
                }
              },
              {
                path: KnownSpotNegotiationRoutes.emailLog,
                component: SpotnegoemaillogComponent,
                data: {
                  title: 'Negotiation - Email Log',
                  breadcrumb: 'Email Log'
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
