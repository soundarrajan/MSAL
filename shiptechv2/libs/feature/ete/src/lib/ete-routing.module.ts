import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainEteComponent} from './views/main-ete.component';
import {KnownEteRoutes} from './known-ete.routes';
import {EteEditComponent} from "./views/ete-edit/ete-edit.component";

const routes: Routes = [
  {
    path: '',
    component: MainEteComponent,
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Email Template Editor'
        },
        children: [
          {
            path: `:${KnownEteRoutes.templateIdParam}`,
            component: EteEditComponent,
            data: {title: 'Email Template Editor'}
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EteRoutingModule {
}
