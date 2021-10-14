import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { QcReportDetailsUnsavedChangesGuard } from './guards/qc-report-details-unsaved-changes-guard.service';
import { KnownControlTowerRoutes } from './control-tower.routes';
import { MainControlTowerComponent } from './views/main-control-tower.component';
import { ControlTowerModuleResolver } from './control-tower-route.resolver';
import { ControlTowerDetailsRouteResolver } from './views/control-tower/details/control-tower-details-route.resolver';
import { ControlTowerDetailsComponent } from './views/control-tower/details/control-tower-details.component';
import { ControlTowerViewComponent } from './views/control-tower/view/control-tower-view.component';
import { ResidueDifferenceComponent } from './views/control-tower/view/components/residue-difference/residue-difference.component';
import { ControlTowerHomeNewComponent } from './views/control-tower/view/components/control-tower-home-new/control-tower-home-new.component';

interface IControlTowerDetailsRouteData {
  [KnownControlTowerRoutes.ReportIdParam]: Type<
    ControlTowerDetailsRouteResolver
  >;
}

const routes: Routes = [
  {
    path: '',
    component: MainControlTowerComponent,
    resolve: { moduleInit: ControlTowerModuleResolver },
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Control Tower List'
        },
        children: [
          {
            path: '',
            redirectTo: KnownControlTowerRoutes.ControlTowerList,
            pathMatch: 'full'
          },
          {
            path: KnownControlTowerRoutes.ControlTowerList,
            component: ControlTowerViewComponent,
            data: { title: 'Control Tower List' }
          },
          {
            path: `${KnownControlTowerRoutes.Report}/:${KnownControlTowerRoutes.ReportIdParam}`,
            children: [
              {
                path: '',
                redirectTo: KnownControlTowerRoutes.ReportDetails,
                pathMatch: 'full'
              },
              {
                path: KnownControlTowerRoutes.ReportDetails,
                canDeactivate: [QcReportDetailsUnsavedChangesGuard],
                component: ControlTowerDetailsComponent,
                resolve: <IControlTowerDetailsRouteData>{
                  // Note: ReportId is expected in child routes in the data.
                  reportId: ControlTowerDetailsRouteResolver
                },
                data: {
                  title: 'Quantity Control - Vessel',
                  breadcrumb: 'Vessel Details'
                }
              },
              {
                path: '',
                outlet: KnownNamedRouterOutlets.topbar,
                component: EntityStatusComponent
              }
              // Note: Left here just for reference, QC does not have related links.
              // relatedLinksRouteDefinition(EntityType.PortCall, KnownControlTowerRoutes.ReportIdParam)
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
export class ControlTowerRoutingModule {}
