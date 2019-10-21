import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainQuantityControlComponent } from './views/main-quantity-control.component';
import { PortCallsListComponent } from './views/port-calls-list/port-calls-list.component';
import { BlankComponent } from '@shiptech/core/ui/components/blank/blank.component';
import { PortCallComponent } from './views/port-call/port-call.component';
import { relatedLinksRouteDefinition } from '@shiptech/core/ui/components/related-links/related-links.route-factory';
import { EntityRelatedLinkType } from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';

export enum KnownQuantityControlRoutes {
  portCallsList = 'port-calls',
  portCallDetails = 'port-call-details',
  portCallDetailsParams = 'callId',
}

const routes: Routes = [
  {
    path: '',
    component: MainQuantityControlComponent,
    data: {
      breadcrumb: 'Quantity Control'
    },
    children: [
      { // TODO: Used for testing remove it
        path: 'blank-page',
        component: BlankComponent
      },
      {
        path: '',
        redirectTo: KnownQuantityControlRoutes.portCallsList,
        pathMatch: 'full'
      },
      {
        path: KnownQuantityControlRoutes.portCallsList,
        component: PortCallsListComponent,
        data: { title: 'Quantity Control', breadcrumb: 'Port Calls' }
      },
      {
        path: `${KnownQuantityControlRoutes.portCallDetails}/:${KnownQuantityControlRoutes.portCallDetailsParams}`,
        children: [
          {
            path: '',
            component: PortCallComponent,
            data: { title: 'Quantity Control - Vessel', breadcrumb: 'Port Call' }
          },
          relatedLinksRouteDefinition(EntityRelatedLinkType.QuantityControl, KnownQuantityControlRoutes.portCallDetailsParams)
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuantityControlRoutingModule {
}
