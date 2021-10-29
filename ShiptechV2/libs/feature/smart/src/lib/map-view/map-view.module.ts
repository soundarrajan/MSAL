import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationMsalModule } from '@shiptech/core/authentication/authentication-msal.module';
import { AuthenticationAdalModule } from '@shiptech/core/authentication/authentication-adal.module';
import { MaterialModule } from '../material-module';
import { SharedModule } from '../shared/shared.module';
import { MapViewRoutingModule } from './map-view-routing.module';
import { MapViewHomeComponent } from './map-view-home/map-view-home.component';
import { VesselDetailsComponent } from './vessel-details/vessel-details.component';
import { ComponentsComponent } from './components/components.component';
import { PortDetailsComponent } from './port-details/port-details.component';
import { environment } from '@shiptech/environment';

@NgModule({
  declarations: [
    MapViewHomeComponent,
    VesselDetailsComponent,
    ComponentsComponent,
    PortDetailsComponent
  ],
  imports: [
    CommonModule,
    !window.location.hostname.includes('cma')
      ? AuthenticationMsalModule.forFeature()
      : AuthenticationAdalModule.forFeature(),
    MapViewRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class MapViewModule {}
