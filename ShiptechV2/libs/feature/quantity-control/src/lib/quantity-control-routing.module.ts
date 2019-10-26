import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainQuantityControlComponent } from './views/main-quantity-control.component';
import { PortCallsListComponent } from './views/port-calls-list/port-calls-list.component';
import { PortCallComponent } from './views/port-call/port-call.component';
import { relatedLinksRouteDefinition } from '@shiptech/core/ui/components/related-links/related-links.route-factory';
import { EntityType } from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { QuantityControlRouteResolver } from './quantiy-control-route.resolver';

export enum KnownQuantityControlRoutes {
  portCallsList = 'port-calls',
  portCallDetails = 'port-call-details',
  portCallDetailsParams = 'callId',
}

const routes: Routes = [
  {
    path: '',
    component: MainQuantityControlComponent,
    resolve: { moduleInit: QuantityControlRouteResolver},
    data: {
      breadcrumb: 'Delivery'
    },
    children: [
      {
        path: '',
        redirectTo: KnownQuantityControlRoutes.portCallsList,
        pathMatch: 'full'
      },
      {
        path: KnownQuantityControlRoutes.portCallsList,
        component: PortCallsListComponent,
      //  resolve: { tenantSettings: ModuleSettingsResolver },
        data: { title: 'Quantity Control', breadcrumb: 'Quantity Control' }
      },
      {
        path: `${KnownQuantityControlRoutes.portCallDetails}/:${KnownQuantityControlRoutes.portCallDetailsParams}`,

        children: [
          {
            path: '',
            component: PortCallComponent,
          //  resolve: { tenantSettings: ModuleSettingsResolver },
            data: { title: 'Quantity Control - Vessel', breadcrumb: 'Quantity Control' }
          },
          {
            path: '',
            outlet: KnownNamedRouterOutlets.topbar,
            component: EntityStatusComponent
          },
          relatedLinksRouteDefinition(EntityType.PortCall, KnownQuantityControlRoutes.portCallDetailsParams)
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
