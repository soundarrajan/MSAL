import { NgModule } from '@angular/core';
import { DefaultModule } from '@shiptech/core';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    DefaultModule,
    AgGridModule
  ],
  exports: [AgGridModule]
})
export class QualityControlGridModule {
}
