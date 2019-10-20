import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainQuantityControlComponent } from './views/main-quantity-control.component';
import { PortCallsListComponent } from './views/port-calls-list/port-calls-list.component';
import {
  IRelatedLinksRouteData,
  RelatedLinksComponent
} from '@shiptech/core/ui/components/related-links/related-links.component';
import { BlankComponent } from '@shiptech/core/ui/components/blank/blank.component';
import { PortCallComponent } from './views/port-call/port-call.component';

const routes: Routes = [
  {
    path: '',
    component: MainQuantityControlComponent,
    data: {
      breadcrumb: 'Quantity Control'
    },
    children: [
      { // TODO: Used for testing remove it
        path: 'blank-page',
        component: BlankComponent
      },
      {
        path: '',
        redirectTo: 'port-calls',
        pathMatch: 'full'
      },
      {
        path: 'port-calls',
        component: PortCallsListComponent,
        data: { title: 'Quantity Control', breadcrumb: 'Port Calls' }
      },
      {
        path: 'port-call-details/:id',
        children: [
          {
            path: '',
            component: PortCallComponent,
            data: { title: 'Quantity Control - Vessel', breadcrumb: 'Port Calls' }
          },
          {
            outlet: 'breadcrumbs-right',
            path: '',
            component: RelatedLinksComponent,
            data: <IRelatedLinksRouteData>{
              relatedLinks: {
                // TODO: Extract to known constant, this should be in Core
                links: [
                  { label: 'Request', id: 'request' },
                  { label: 'Offer', id: 'offer' },
                  { label: 'Order', id: 'order' },
                  { label: 'Delivery', id: 'delivery' },
                  { label: 'Quantity Control', id: 'quantityControl', routerLink: ['./'] },
                  { label: 'Labs', id: 'labs' },
                  { label: 'Claims', id: 'claims' },
                  { label: 'Invoices', id: 'invoices' },
                  { label: 'Recon', id: 'recon' }
                ]
              }
            }
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
export class QuantityControlRoutingModule {
}
