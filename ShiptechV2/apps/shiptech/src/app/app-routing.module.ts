import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { KnownModulesPaths } from '@shiptech/core';
import { AuthenticationGuard } from '../../../../libs/core/src/lib/guards/authentication.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: KnownModulesPaths.QualityControl,
        loadChildren: () => import('@shiptech/feature/quality-control').then(m => m.QualityControlModule)
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
