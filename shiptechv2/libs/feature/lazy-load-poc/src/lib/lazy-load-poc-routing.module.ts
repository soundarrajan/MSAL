import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLazyLoadComponent } from './views/main-lazy-load.component';
import { LazyViewComponent } from './views/lazy-view/lazy-view.component';
import { LazyLoadPocRouteResolver } from './lazy-load-poc-route.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainLazyLoadComponent,
    children: [
      {
        path: '',
        resolve: { test: LazyLoadPocRouteResolver },
        component: LazyViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LazyLoadPocRoutingModule {}
