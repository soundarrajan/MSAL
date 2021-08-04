import { MainSpotNegotiationComponent } from './views/main-spot-negotiation.component';
import { SpotNegotiationComponent } from './views/contract/details/spot-negotiation.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';


import { ContractDetailsUnsavedChangesGuard } from './guards/contract-details-unsaved-changes-guard.service';
import { KnownSpotNegotiationRoutes } from './known-spot-negotiation.routes';


const routes: Routes = [
  {
    path: '',
    component: MainSpotNegotiationComponent,
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            redirectTo: KnownSpotNegotiationRoutes.ContractList,
            pathMatch: 'full'
          },
          {
            path: KnownSpotNegotiationRoutes.ContractList
          },
          {
            path: `${KnownSpotNegotiationRoutes.Contract}/:${KnownSpotNegotiationRoutes.ContractIdParam}`,
            children: [
              {
                path: '',
                redirectTo: KnownSpotNegotiationRoutes.ContractDetails,
                pathMatch: 'full'
              },
              {
                path: KnownSpotNegotiationRoutes.ContractDetails,
                canDeactivate: [ContractDetailsUnsavedChangesGuard],
                component: SpotNegotiationComponent,
                data: {
                  title: 'Contract Entity Edit',
                  breadcrumb: 'Contract Entity Edit'
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
