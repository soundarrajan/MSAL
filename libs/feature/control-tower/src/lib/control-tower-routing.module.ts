import { RouterModule, Routes } from '@angular/router';
import { NgModule, Type } from '@angular/core';
import { EntityStatusComponent } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { KnownNamedRouterOutlets } from '@shiptech/core/enums/known-named-router-outlets';
import { KnownControlTowerRoutes } from './control-tower.routes';
import { MainControlTowerComponent } from './views/main-control-tower.component';
import { ControlTowerModuleResolver } from './control-tower-route.resolver';
import { ControlTowerViewComponent } from './views/control-tower/view/control-tower-view.component';



const routes: Routes = [
  {
    path: '',
    component: MainControlTowerComponent,
    resolve: { moduleInit: ControlTowerModuleResolver },
    children: [
      {
        path: '',
        data: {
          breadcrumb: 'Control Tower List'
        },
        children: [
          {
            path: '',
            redirectTo: KnownControlTowerRoutes.ControlTowerList,
            pathMatch: 'full'
          },
          {
            path: KnownControlTowerRoutes.ControlTowerList,
            component: ControlTowerViewComponent,
            data: { title: 'Control Tower List' }
          },
          {
            path: KnownControlTowerRoutes.ControlTowerList+'/:id',
            component: ControlTowerViewComponent,
            data: { title: 'Control Tower List' }
          },
         
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlTowerRoutingModule {}
