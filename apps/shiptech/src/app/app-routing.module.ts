import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationGuard, KnownModulesPaths } from '@shiptech/core';
import { AdalGuard } from 'adal-angular-wrapper';
import { LayoutMainComponent } from '@shiptech/core/ui/layout/main/layout-main.component';

const routes: Routes = [
  { path: '', component: LayoutMainComponent, pathMatch: 'full' },
  {
    path: KnownModulesPaths.QuantityControl,
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('@shiptech/feature/quantity-control').then(m => m.QuantityControlModule)
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
