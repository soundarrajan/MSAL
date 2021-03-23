import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { ContractModuleResolver } from './contract-route.resolver';

import { ContractDetailsUnsavedChangesGuard } from './guards/contract-details-unsaved-changes-guard.service';
import { KnownContractRoutes } from './known-contract.routes';
import { ContractDetailsRouteResolver } from './views/contract/details/contract-details-route.resolver';
import { MainContractComponent } from './views/main-contract.component';
import { ContractDetailsComponent } from './views/contract/details/contract-details.component';
import { NavBarResolver } from './views/contract/details/navbar-route.resolver';
import { UomsRouteResolver } from './views/contract/details/uoms-route.resolver';
import { SatisfactionLevelRouteResolver } from './views/contract/details/satisfaction-level-route.resolver';
import { ClaimTypeRouteResolver } from './views/contract/details/claim-type-route.resolver';
import { QuantityCategoryRouteResolver } from './views/contract/details/quantity-category-route.resolver';
import { ScheduleDashboardLabelsRouteResolver } from './views/contract/details/schedule-dashboard-labels-route.resolver';
import { ContractDetailsDocumentsComponent } from './views/contract/documents/contract-details-documents.component';
import { ContractFeedbackRouteResolver } from './views/contract/details/contract-feedback-route.resolver';
import { ContractRouteResolver } from './views/contract/details/contract-route.resolver';

interface IContractDetailsRouteData {
  [KnownContractRoutes.ContractIdParam]: Type<
  ContractDetailsRouteResolver
  >;
}

const routes: Routes = [
  {
    path: '',
    component: MainContractComponent,
    resolve: { moduleInit: ContractModuleResolver },
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Contract List'
        },
        children: [
          {
            path: '',
            redirectTo: KnownContractRoutes.ContractList,
            pathMatch: 'full'
          },
          {
            path: KnownContractRoutes.ContractList,
            data: { title: 'Contract List' }
          },
          {
            path: `${KnownContractRoutes.Contract}/:${KnownContractRoutes.ContractIdParam}`,
            children: [
              {
                path: '',
                redirectTo: KnownContractRoutes.ContractDetails,
                pathMatch: 'full'
              },
              {
                path: KnownContractRoutes.ContractDetails,
                canDeactivate: [ContractDetailsUnsavedChangesGuard],
                component: ContractDetailsComponent,
                resolve:{
                  // Note: ReportId is expected in child routes in the data.
                  orderNumbers : ContractDetailsRouteResolver,
                  delivery: ContractRouteResolver,
                  navBar: NavBarResolver,
                  uoms: UomsRouteResolver,
                  //bargeList: BargeRouteResolver,
                  deliveryFeedback: ContractFeedbackRouteResolver,
                  satisfactionLevel: SatisfactionLevelRouteResolver,
                  claimType: ClaimTypeRouteResolver,
                  quantityCategory: QuantityCategoryRouteResolver,
                  scheduleDashboardLabelConfiguration: ScheduleDashboardLabelsRouteResolver
                },
                data: {
                  title: 'Contract Details',
                  breadcrumb: 'Contract Details'
                }
              },
              {
                path: KnownContractRoutes.ContractDocumentsPath,
                component: ContractDetailsDocumentsComponent,
                data: {
                  title: 'Contract - Documents',
                  breadcrumb: 'Documents'
                }
              },
              {
                path: KnownContractRoutes.ContractEmailLogPath,
                data: {
                  title: 'Contract - Email Log',
                  breadcrumb: 'Email Log'
                }
              },
              {
                path: KnownContractRoutes.ContractAuditPath,
                data: {
                  title: 'Contract - Audit Log',
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
export class ContractRoutingModule {}
