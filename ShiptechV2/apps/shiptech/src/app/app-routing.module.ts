import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'quality-control',
    loadChildren: () => import('../../../../libs/feature/quality-control/src/lib/quality-control.module').then(m => m.QualityControlModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
