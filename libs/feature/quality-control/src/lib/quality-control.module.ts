import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainQualityControlComponent } from './views/main-quality-control/main-quality-control.component';
import { QualityControlGridModule } from './quality-control-grid.module';
import { LoggingModule } from '../../../../core/src/lib/logging/logging.module';
import { ModuleLoggerFactory } from './core/logging/module-logger-factory';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: MainQualityControlComponent}]),
    QualityControlGridModule,
    LoggingModule
  ],
  declarations: [MainQualityControlComponent],
  providers: [
    ModuleLoggerFactory
  ]
})
export class QualityControlModule {}
