import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContextModule } from './app-context/app-context.module';
import { ToastrModule } from 'ngx-toastr';
import { UIModule } from './ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppServicesModule } from './services/app-services.module';

// TODO: Define the purpose of Core Module. We should definitely remove UIModule from here and use it where necessary otherwise we risk not being able to lazy load modules
@NgModule({
  imports: [
    CommonModule,
    AppContextModule,
    AppServicesModule.forRoot(),
    ToastrModule.forRoot(),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    AppContextModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: []
})
export class CoreModule {
}
