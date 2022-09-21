import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapViewHomeComponent } from './map-view-home/map-view-home.component';
import { VesselDetailsComponent } from './vessel-details/vessel-details.component';
import { ComponentsComponent } from './components/components.component';
import { ScheduleDashboardLabelsRouteResolverService as ScheduleDashboardLabelsRouteResolver } from "./../services/schedule-dashboard-labels-route-resolver.service";
import { VesselListRouteResolverService as VesselListRouteResolver } from "./../services/vessel-list-route-resolver.service";

const routes: Routes = [
  {
    path: 'dashboard', component: MapViewHomeComponent,
    resolve: {
      scheduleDashboardLabelConfiguration: ScheduleDashboardLabelsRouteResolver,
      vesselListWithImono: VesselListRouteResolver,
    }
  },
  {
    path: 'vesselDetails', component: VesselDetailsComponent
  },
  {
    path: 'components', component: ComponentsComponent
  },
  {
    path : '**', redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapViewRoutingModule { }
