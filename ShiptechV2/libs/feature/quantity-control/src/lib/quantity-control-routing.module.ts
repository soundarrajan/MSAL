import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainQuantityControlComponent } from './views/main-quantity-control.component';
import { QcReportsListComponent } from './views/qc-reports-list/qc-reports-list.component';
import { QcReportViewComponent } from './views/qc-report-view/qc-report-view.component';
import { relatedLinksRouteDefinition } from '@shiptech/core/ui/components/related-links/related-links.route-factory';
import { EntityType } from '@shiptech/core/services/entity-related-links/model/entity-related-links.model';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { QuantityControlRouteResolver } from './quantiy-control-route.resolver';
import { QcReportViewRouteResolver } from './views/qc-report-view/qc-report-view-route.resolver';
import { KnownQuantityControlRoutes } from './known-quantity-control.routes';

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
        redirectTo: KnownQuantityControlRoutes.ReportList,
        pathMatch: 'full'
      },
      {
        path: KnownQuantityControlRoutes.ReportList,
        component: QcReportsListComponent,
      //  resolve: { tenantSettings: ModuleSettingsResolver },
        data: { title: 'Quantity Control', breadcrumb: 'Quantity Control' }
      },
      {
        path: `${KnownQuantityControlRoutes.ReportView}/:${KnownQuantityControlRoutes.ReportIdParam}`,
        resolve: {
          portCall: QcReportViewRouteResolver
        },
        children: [
          {
            path: '',
            component: QcReportViewComponent,
          //  resolve: { tenantSettings: ModuleSettingsResolver },
            data: { title: 'Quantity Control - Vessel', breadcrumb: 'Quantity Control' }
          },
          {
            path: '',
            outlet: KnownNamedRouterOutlets.topbar,
            component: EntityStatusComponent
          },
          relatedLinksRouteDefinition(EntityType.PortCall, KnownQuantityControlRoutes.ReportIdParam)
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
