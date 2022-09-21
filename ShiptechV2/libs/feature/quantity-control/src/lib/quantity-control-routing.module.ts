import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';
import { MainQuantityControlComponent } from './views/main-quantity-control.component';
import { QcReportsListComponent } from './views/qc-reports-list/qc-reports-list.component';
import { QcReportDetailsComponent } from './views/qc-report/details/qc-report-details.component';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { QuantityControlModuleResolver } from './quantiy-control-route.resolver';
import { QcReportDetailsRouteResolver } from './views/qc-report/details/qc-report-details-route.resolver';
import { KnownQuantityControlRoutes } from './known-quantity-control.routes';
import { QcReportDetailsUnsavedChangesGuard } from './guards/qc-report-details-unsaved-changes-guard.service';
import { QcReportDetailsEmailLogsComponent } from './views/qc-report/email-logs/qc-report-details-email-logs.component';
import { QcReportDetailsAuditLogsComponent } from './views/qc-report/audit-logs/qc-report-details-audit-logs.component';
import { QcReportDetailsDocumentsComponent } from './views/qc-report/documents/qc-report-details-documents.component';

interface IQcReportDetailsRouteData {
  [KnownQuantityControlRoutes.ReportIdParam]: Type<
    QcReportDetailsRouteResolver
  >;
}

const routes: Routes = [
  {
    path: '',
    component: MainQuantityControlComponent,
    resolve: { moduleInit: QuantityControlModuleResolver },
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Quantity Control List'
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
            data: { title: 'Quantity Control List' }
          },
          {
            path: `${KnownQuantityControlRoutes.Report}/:${KnownQuantityControlRoutes.ReportIdParam}`,
            children: [
              {
                path: '',
                redirectTo: KnownQuantityControlRoutes.ReportDetails,
                pathMatch: 'full'
              },
              {
                path: KnownQuantityControlRoutes.ReportDetails,
                canDeactivate: [QcReportDetailsUnsavedChangesGuard],
                component: QcReportDetailsComponent,
                resolve: <IQcReportDetailsRouteData>{
                  // Note: ReportId is expected in child routes in the data.
                  reportId: QcReportDetailsRouteResolver
                },
                data: {
                  title: 'Quantity Control - Vessel',
                  breadcrumb: 'Vessel Details'
                }
              },
              {
                path: KnownQuantityControlRoutes.ReportDocumentsPath,
                component: QcReportDetailsDocumentsComponent,
                data: {
                  title: 'Quantity Control - Documents',
                  breadcrumb: 'Documents'
                }
              },
              {
                path: KnownQuantityControlRoutes.ReportEmailLogPath,
                component: QcReportDetailsEmailLogsComponent,
                data: {
                  title: 'Quantity Control - Email Log',
                  breadcrumb: 'Email Log'
                }
              },
              {
                path: KnownQuantityControlRoutes.ReportAuditPath,
                component: QcReportDetailsAuditLogsComponent,
                data: {
                  title: 'Quantity Control - Audit Log',
                  breadcrumb: 'Audit Log'
                }
              },
              {
                path: '',
                outlet: KnownNamedRouterOutlets.topbar,
                component: EntityStatusComponent
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
export class QuantityControlRoutingModule {}
