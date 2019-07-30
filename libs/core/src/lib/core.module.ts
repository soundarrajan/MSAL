import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContextModule } from './modules/app-context.module';
import { ToastrModule } from 'ngx-toastr';
import { UIModule } from './ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    AppContextModule,
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
  ]
})
export class CoreModule {
}
