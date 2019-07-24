import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainQualityControlComponent } from './main-quality-control/main-quality-control.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([
      {path: '', component: MainQualityControlComponent}
    ])
  ],
  declarations: [MainQualityControlComponent]
})
export class QualityControlModule {}
