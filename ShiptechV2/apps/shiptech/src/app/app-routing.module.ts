import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { KnownModulesPaths } from '@shiptech/core';
import { AuthenticationGuard } from '../../../../libs/core/src/lib/guards/authentication.guard';
import { AdalGuard } from 'adal-angular4';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        canActivate: [AuthenticationGuard],
        path: KnownModulesPaths.QualityControl,
        loadChildren: () => import('@shiptech/feature/quality-control').then(m => m.QualityControlModule)
      }
    ]
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
