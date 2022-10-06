import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginViewComponent } from './login-view/login-view.component';
import { AuthGaurdService } from './services/auth-guard.service';
import { MapViewModule } from './map-view/map-view.module';

const routes: Routes = [
  { path: 'mapview', loadChildren: () => import('./map-view/map-view.module').then(m => m.MapViewModule) },
  { path: 'login', component : LoginViewComponent },
  { path: '**', redirectTo : 'smart' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartRoutingModule { }
