import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GetServiceInstanceDirective } from '@shiptech/core/developer-toolbar/get-service-instance.directive';
import { DeveloperToolbarComponent } from '@shiptech/core/developer-toolbar/developer-toolbar.component';
import { ApiServiceSettingsComponent } from '@shiptech/core/developer-toolbar/api-service-settings/api-service-settings.component';
import { MaterialModule } from '@shiptech/core/ui/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({

  declarations: [
    GetServiceInstanceDirective,
    DeveloperToolbarComponent,
    ApiServiceSettingsComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    DeveloperToolbarComponent,
    GetServiceInstanceDirective
  ]
})
export class DeveloperToolbarModule {
  constructor() {
  }

}

