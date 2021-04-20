import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationModule } from '@shiptech/core/authentication/authentication.module';
import { MaterialModule } from '../material-module'; 
import { SharedModule } from '../shared/shared.module';
import { MapViewRoutingModule } from './map-view-routing.module';
import { MapViewHomeComponent } from './map-view-home/map-view-home.component';
import { VesselDetailsComponent } from './vessel-details/vessel-details.component';
import { ComponentsComponent } from './components/components.component';
import { PortDetailsComponent } from './port-details/port-details.component';


@NgModule({
  declarations: [MapViewHomeComponent, VesselDetailsComponent, ComponentsComponent, PortDetailsComponent],
  imports: [
    CommonModule,
    AuthenticationModule.forFeature(),
    MapViewRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class MapViewModule { }
