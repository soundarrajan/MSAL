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
        path: `${KnownContractNegotiationRoutes.RequestsList}`,
        data: {
          title: 'Contract Requests List',
          breadcrumb: 'Request List'
        },
        children: [
          {
            path: '',
            component: ContractNegotiationComponent,
            pathMatch: 'full',
            data: {
              title: 'Request List',
              breadcrumb: 'Request List'
            },
          },
          {
            path: `:${KnownContractNegotiationRoutes.RequestIdParam}`,
            component: MainPageComponent,
            pathMatch: 'full',
            data: {
              title: 'Contract Negotiation',
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
export class ContractNegotiationRoutingModule { 
  constructor(){
    console.log(routes);
  }
}
