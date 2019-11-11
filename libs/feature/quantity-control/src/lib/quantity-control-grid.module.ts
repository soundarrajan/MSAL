import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AgGridComponentsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-components.module';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridComponentsModule,
    AgGridModule.withComponents([AgCellTemplateComponent, AgColumnHeaderComponent, AgColumnGroupHeaderComponent]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [AgGridModule, AgGridComponentsModule]
})
export class QuantityControlGridModule {
}
