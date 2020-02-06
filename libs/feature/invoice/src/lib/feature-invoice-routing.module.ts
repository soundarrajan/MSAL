import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FeatureInvoiceModuleResolver } from './feature-invoice-route.resolver';
import { FeatureInvoiceComponent } from './views/invoice-complete/feature-invoice.component';
import { MainInvoiceComponent } from './views/main-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: MainInvoiceComponent,
    data: {
      breadcrumb: 'Complete View List'
    },
    resolve: { moduleInit: FeatureInvoiceModuleResolver },
    children: [
      {
        path: '',
        redirectTo: 'complete_view',
        pathMatch: 'full'
      },
      {
        path: 'complete_view',
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
