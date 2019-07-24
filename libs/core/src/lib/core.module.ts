import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCoreModule } from './modules/app-core.module';

@NgModule({
  imports: [
    CommonModule,
    AppCoreModule
  ],
  exports: [
    AppCoreModule
  ]
})
export class CoreModule {}
