import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdalGuard } from 'adal-angular-wrapper';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';
import { AuthenticationGuard } from '@shiptech/core/guards/authentication.guard';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { MainQuantityControlComponent } from "../../../../libs/feature/quantity-control/src/lib/views/main-quantity-control.component";
import { QuantityControlModuleResolver } from "../../../../libs/feature/quantity-control/src/lib/quantiy-control-route.resolver";

const routes: Routes = [
  { path: '', component: LayoutMainComponent, pathMatch: 'full' },
  {
    path: '',
    data: {
      breadcrumb: 'Delivery'
    },
    children: [
      {
        path: KnownPrimaryRoutes.QuantityControl,
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('@shiptech/feature/quantity-control').then(m => m.QuantityControlModule)
      }
    ]
  },
  {
    path: KnownPrimaryRoutes.LazyLoad,
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('@shiptech/feature/lazy-load-poc').then(m => m.LazyLoadPocModule)
  }
];

@NgModule({
  providers: [
    AdalGuard
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
