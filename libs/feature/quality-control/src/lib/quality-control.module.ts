import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainQualityControlComponent } from './main-quality-control/main-quality-control.component';
import { QualityControlGridModule } from './quality-control-grid/quality-control-grid.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: '', component: MainQualityControlComponent}
    ]),
    QualityControlGridModule
  ],
  declarations: [MainQualityControlComponent]
})
export class QualityControlModule {}
