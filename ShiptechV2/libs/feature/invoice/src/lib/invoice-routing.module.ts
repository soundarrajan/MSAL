import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FeatureInvoiceModuleResolver } from './invoice-route.resolver';
import { InvoiceCompleteListComponent } from './views/invoice-complete-list/invoice-complete-list.component';
import { MainInvoiceComponent } from './views/main-invoice.component';
import { InvoiceListComponent } from './views/invoice-list/invoice-list.component';
import { KnownInvoiceRoutes } from './known-invoice.routes';

const routes: Routes = [
  {
    path: '',
    component: MainInvoiceComponent,
    resolve: { moduleInit: FeatureInvoiceModuleResolver },
    children: [
      {
        path: '',
        redirectTo: KnownInvoiceRoutes.CompleteView,
        pathMatch: 'full'
      },
      {
        path: KnownInvoiceRoutes.CompleteView,
        component: InvoiceCompleteListComponent,
        data: { title: 'COMPLETE VIEW LIST', breadcrumb: 'Complete View List' }
      },
      {
        path: KnownInvoiceRoutes.InvoiceList,
        component: InvoiceListComponent,
        data: { title: 'INVOICES LIST', breadcrumb: 'Invoices List' }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {
}
