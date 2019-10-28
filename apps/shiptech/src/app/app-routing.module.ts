import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdalGuard } from 'adal-angular-wrapper';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';
import { AuthenticationGuard } from '@shiptech/core/guards/authentication.guard';
import { KnownModulesPaths } from '@shiptech/core/enums/known-modules-routes.enum';

const routes: Routes = [
  { path: '', component: LayoutMainComponent, pathMatch: 'full' },
  {
    path: KnownModulesPaths.QuantityControl,
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('@shiptech/feature/quantity-control').then(m => m.QuantityControlModule)
  },
  {
    path: KnownModulesPaths.LazyLoad,
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
