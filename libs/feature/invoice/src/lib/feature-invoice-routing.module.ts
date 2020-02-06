import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FeatureInvoiceModuleResolver } from './feature-invoice-route.resolver';
import { FeatureInvoiceComponent } from './views/invoice-complete/feature-invoice.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Complete View List'
    },
    resolve: { moduleInit: FeatureInvoiceModuleResolver },
    children: [
      {
        path: '',
        redirectTo: 'invoices/complete_view',
        pathMatch: 'full'
      },
      {
        path: 'invoices/complete_view',
        component: FeatureInvoiceComponent,
        data: { title: 'COMPLETE VIEW LIST' }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureInvoiceRoutingModule {
}
