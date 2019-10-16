import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainQuantityControlComponent } from './views/main-quantity-control.component';
import { PortCallsListComponent } from './views/port-calls-list/port-calls-list.component';

const routes: Routes = [
  {
    path: '',
    component: MainQuantityControlComponent,
    children: [
      {
        path: '',
        redirectTo: 'port-calls-list'
      },
      {
        path: 'port-calls-list',
        component: PortCallsListComponent
      },
      {
        path: 'port-call/:{portCallId}',
        component: PortCallsListComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuantityControlRoutingModule {}
