import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainQuantityControlComponent } from './views/main-quantity-control.component';
import { PortCallsListComponent } from './views/port-calls-list/port-calls-list.component';
import { PortCallDetailsComponent } from './views/port-call-details/port-call-details.component';
import { relatedLinksRouteDefinition } from '@shiptech/core/ui/components/related-links/related-links.route-factory';
import { EntityType } from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { QuantityControlRouteResolver } from './quantiy-control-route.resolver';
import { PortCallDetailsRouteResolver } from './views/port-call-details/port-call-details-route.resolver';
import { KnownQuantityControlRoutes } from './known-quantity-control.routes';
import { AuditLogComponent } from '@shiptech/core/ui/components/audit-log/audit-log.component';

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
        path: `${KnownQuantityControlRoutes.portCallDetails}/:${KnownQuantityControlRoutes.portCallIdParam}`,
        resolve: {
          portCall: PortCallDetailsRouteResolver
        },
        children: [
          {
            path: '',
            component: PortCallDetailsComponent,
            data: { title: 'Quantity Control - Vessel', breadcrumb: 'Quantity Control' },
          },
          {
            path: KnownQuantityControlRoutes.portCallDetailsAuditPath,
            component: AuditLogComponent,
            data: { title: 'Quantity Control - Audit', breadcrumb: 'Audit' },
          },
          {
            path: '',
            outlet: KnownNamedRouterOutlets.topbar,
            component: EntityStatusComponent
          },
          relatedLinksRouteDefinition(EntityType.PortCall, KnownQuantityControlRoutes.portCallIdParam)
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
