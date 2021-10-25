import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';
import { MainDeliveryComponent } from './views/main-delivery.component';
import { DeliveryDetailsComponent } from './views/delivery/details/delivery-details.component';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { DeliveryModuleResolver } from './delivery-route.resolver';
import { DeliveryDetailsRouteResolver } from './views/delivery/details/delivery-details-route.resolver';

import { KnownDeliverylRoutes } from './known-delivery.routes';
import { DeliveryDetailsUnsavedChangesGuard } from './guards/delivery-details-unsaved-changes-guard.service';
import { DeliveryDetailsEmailLogsComponent } from './views/delivery/email-logs/delivery-details-email-logs.component';
import { DeliveryDetailsDocumentsComponent } from './views/delivery/documents/delivery-details-documents.component';
import { DeliveryRouteResolver } from './views/delivery/details/delivery-route.resolver';
import { UomsRouteResolver } from './views/delivery/details/uoms-route.resolver';
import { DeliveryFeedbackRouteResolver } from './views/delivery/details/delivery-feedback-route.resolver';
import { SatisfactionLevelRouteResolver } from './views/delivery/details/satisfaction-level-route.resolver';
import { NavBarResolver } from './views/delivery/details/navbar-route.resolver';
import { BargeRouteResolver } from './views/delivery/details/barge-route.resolver';
import { ClaimTypeRouteResolver } from './views/delivery/details/claim-type-route.resolver';
import { ScheduleDashboardLabelsRouteResolver } from './views/delivery/details/schedule-dashboard-labels-route.resolver';
import { QuantityCategoryRouteResolver } from './views/delivery/details/quantity-category-route.resolver';
import { UomVolumeRouteResolver } from './views/delivery/details/uom-volume-route.resolver';
import { UomMassRouteResolver } from './views/delivery/details/uom-mass-route.resolver';
import { PumpingRateUomRouteResolver } from './views/delivery/details/pumping-rate-uom-route.resolver';
import { SampleSourceRouteResolver } from './views/delivery/details/sample-source-route.resolver';

interface IDeliveryDetailsRouteData {
  [KnownDeliverylRoutes.DeliveryIdParam]: Type<DeliveryDetailsRouteResolver>;
}

const routes: Routes = [
  {
    path: '',
    component: MainDeliveryComponent,
    resolve: { moduleInit: DeliveryModuleResolver },
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            redirectTo: KnownDeliverylRoutes.DeliveryList,
            pathMatch: 'full'
          },
          {
            path: `${KnownDeliverylRoutes.Delivery}/:${KnownDeliverylRoutes.DeliveryIdParam}`,
            children: [
              {
                path: '',
                redirectTo: KnownDeliverylRoutes.DeliveryDetails,
                pathMatch: 'full'
              },
              {
                path: KnownDeliverylRoutes.DeliveryDetails,
                canDeactivate: [DeliveryDetailsUnsavedChangesGuard],
                component: DeliveryDetailsComponent,
                resolve: {
                  // Note: ReportId is expected in child routes in the data.
                  orderNumbers: DeliveryDetailsRouteResolver,
                  delivery: DeliveryRouteResolver,
                  navBar: NavBarResolver,
                  uoms: UomsRouteResolver,
                  bargeList: BargeRouteResolver,
                  deliveryFeedback: DeliveryFeedbackRouteResolver,
                  satisfactionLevel: SatisfactionLevelRouteResolver,
                  claimType: ClaimTypeRouteResolver,
                  quantityCategory: QuantityCategoryRouteResolver,
                  scheduleDashboardLabelConfiguration: ScheduleDashboardLabelsRouteResolver,
                  pumpingRateUom: PumpingRateUomRouteResolver,
                  uomVolume: UomVolumeRouteResolver,
                  uomMass: UomMassRouteResolver,
                  sampleSource: SampleSourceRouteResolver
                },
                data: {
                  title: 'Delivery Entity Edit',
                  breadcrumb: 'Delivery Entity Edit'
                }
              },
              {
                path: KnownDeliverylRoutes.DeliveryDocumentsPath,
                component: DeliveryDetailsDocumentsComponent,
                data: {
                  title: 'Delivery - Documents',
                  breadcrumb: 'Documents'
                }
              },
              {
                path: KnownDeliverylRoutes.DeliveryEmailLogPath,
                component: DeliveryDetailsEmailLogsComponent,
                data: {
                  title: 'Delivery - Email Log',
                  breadcrumb: 'Email Log'
                }
              },
              {
                path: KnownDeliverylRoutes.DeliveryAuditPath,
                data: {
                  title: 'Delivery - Audit Log',
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
export class DeliveryRoutingModule {}
