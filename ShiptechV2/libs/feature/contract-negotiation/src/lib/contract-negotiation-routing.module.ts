import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './views/contract-negotiation-components/main-page/main-page.component';
import { ContractNegotiationComponent } from './views/contract-negotiation-components/contract-negotiation.component';
import { MainContractNegotiationComponent } from './views/main-contract-negotiation.component';
import { ContractNegotiationModuleResolver } from './contract-negotiation-route.resolver';
import { KnownContractNegotiationRoutes } from './known-contract-negotiation.routes';


const routes: Routes = [
  {
    path: '',
    component: MainContractNegotiationComponent,
    resolve: { moduleInit: ContractNegotiationModuleResolver },
    children: [
      {
        path: '',
        children: [
          {
            path: KnownContractNegotiationRoutes.RequestsList,
            component: ContractNegotiationComponent,
            //redirectTo: KnownContractNegotiationRoutes.RequestsList,
            pathMatch: 'full',
            data: {
              title: 'Contract Requests List',
              breadcrumb: 'Requests List'
            }
          },
          {
            path: `${KnownContractNegotiationRoutes.RequestsList}/:${KnownContractNegotiationRoutes.RequestIdParam}`,
            component: MainPageComponent,
            data: {
              title: 'Negotiation',
              breadcrumb: 'Negotiation'
            }
          }
        ]
      }
    ]
  }
];

/*const routes: Routes = [
  {
    path: 'request',
    component: ContractNegotiationComponent,
    data: { breadCrumb1: 'Contract Negotiation' }
  },
  {
    path: 'buyer',
    component: ContractNegotiationComponent,
    data: { breadCrumb1: 'Contract Negotiation' }
  },
  {
    path: 'approver',
    component: ContractNegotiationComponent,
    data: { breadCrumb1: 'Contract Negotiation' }
  },
  {
    path: 'approver/details/:id',
    component: MainPageComponent,
    data: { breadCrumb1: 'Contract Negotiation' }
  },
  {
    path: 'buyer/details/:id',
    component: MainPageComponent,
    data: { breadCrumb1: 'Contract Negotiation' }
  }
];*/

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractNegotiationRoutingModule { }
