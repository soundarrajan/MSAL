import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './views/contract-negotiation-components/main-page/main-page.component';
import { ContractNegotiationComponent } from './views/contract-negotiation-components/contract-negotiation.component';
import { MainContractNegotiationComponent } from './views/main-contract-negotiation.component';
//import { ContractNegotiationModuleResolver } from './contract-negotiation-route.resolver';
import { KnownContractNegotiationRoutes } from './known-contract-negotiation.routes';


const routes: Routes = [
  {
    path: '',
    component: MainContractNegotiationComponent,
    //resolve: { moduleInit: ContractNegotiationModuleResolver },
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Contract Requests List'
        },
        children: [
          {
            path: '',
            redirectTo: KnownContractNegotiationRoutes.RequestsList,
            pathMatch: 'full'
          },
          {
            path: KnownContractNegotiationRoutes.RequestsList,
            component: ContractNegotiationComponent,
            data: { title: 'Contract Requests List' }
          },
          {
            path: `${KnownContractNegotiationRoutes.RequestsList}/${KnownContractNegotiationRoutes.RequestDetails}/:${KnownContractNegotiationRoutes.RequestIdParam}`,
            component: MainPageComponent,
            data: { breadCrumb1: 'Contract Negotiation' }
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
