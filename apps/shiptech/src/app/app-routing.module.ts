import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { KnownModulesPaths } from '@shiptech/core';
import { AuthenticationGuard } from '@shiptech/core';
import { AdalGuard } from 'adal-angular-wrapper';
import { BlankComponent } from './components/blank/blank.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Home'
    },
    children: [
      {
        path: '',
        component: BlankComponent
      },
      {
        canActivate: [AuthenticationGuard],
        path: KnownModulesPaths.QualityControl,
        loadChildren: () => import('@shiptech/feature/quality-control').then(m => m.QualityControlModule),
        data: {
          breadcrumb: 'Quality Control'
        }
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
