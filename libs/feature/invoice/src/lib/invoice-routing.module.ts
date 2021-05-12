import { NavBarResolver } from './views/invoice-view/details/navbar-route-resolver';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FeatureInvoiceModuleResolver } from './invoice-route.resolver';
import { InvoiceCompleteListComponent } from './views/invoice-complete-list/invoice-complete-list.component';
import { MainInvoiceComponent } from './views/main-invoice.component';
import { InvoiceListComponent } from './views/invoice-list/invoice-list.component';
import { KnownInvoiceRoutes } from './known-invoice.routes';
import { InvoiceViewComponent } from './views/invoice-view/invoice-view.component';
import { StaticListsRouteResolver } from './views/invoice-view/details/static-lists-route.resolver';

const routes: Routes = [
  {
    path: '',
    component: MainInvoiceComponent,
    resolve: { moduleInit: FeatureInvoiceModuleResolver },
    children: [
      {
        path: '',
        redirectTo: KnownInvoiceRoutes.InvoiceList,
        pathMatch: 'full'
      },
      {
        path: KnownInvoiceRoutes.CompleteView,
        component: InvoiceCompleteListComponent,
        data: { title: 'Complete View', breadcrumb: 'Complete View List' }
      },
      {
        path: KnownInvoiceRoutes.InvoiceList,
        component: InvoiceListComponent,
        data: { title: 'Invoice List', breadcrumb: 'Invoices List' }
      },
      {
        path: KnownInvoiceRoutes.InvoiceView,
        children: [
          {
            path: `:${KnownInvoiceRoutes.InvoiceIdParam}`,
            component: InvoiceViewComponent,
            resolve:{
              navBar: NavBarResolver,
              staticLists: StaticListsRouteResolver
            },
            data: { title: 'View Invoice', breadcrumb: 'View Invoice' }
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {}
