import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdalGuard } from 'adal-angular-wrapper';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';
import { AuthenticationGuard } from '@shiptech/core/guards/authentication.guard';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    pathMatch: 'full',
    data: {
      title: 'Shiptech'
    }
  },
  {
    path: '',
    data: {
      breadcrumb: 'Delivery',
      breadcrumbUrl: '/#/delivery',
      breadcrumbIcon: 'fa fa-home'
    },
    children: [
      {
        path: KnownPrimaryRoutes.QuantityControl,
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@shiptech/feature/quantity-control').then(
            m => m.QuantityControlModule
          )
      },
      {
        path: KnownPrimaryRoutes.EmailTemplateEditor,
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@shiptech/feature/ete').then(m => m.EteModule)
      }
    ]
  },
  {
    path: '',
    data: {
      breadcrumb: 'Invoice List',
      breadcrumbUrl: '/#/invoice',
      breadcrumbIcon: 'fa fa-home'
    },
    children: [
      {
        path: KnownPrimaryRoutes.Invoices,
        canActivate: [AuthenticationGuard],
        loadChildren: () =>
          import('@shiptech/feature/invoice').then(m => m.InvoiceModule)
      }
    ]
  },
  {
    path: KnownPrimaryRoutes.LazyLoad,
    canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('@shiptech/feature/lazy-load-poc').then(m => m.LazyLoadPocModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  providers: [AdalGuard],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
