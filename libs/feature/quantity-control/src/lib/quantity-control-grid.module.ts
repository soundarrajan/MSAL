import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { AgDatePickerComponent } from '@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-cell-template.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridExtensionsModule,
    AgGridModule.withComponents([AgCellTemplateComponent, AgColumnHeaderComponent, AgColumnGroupHeaderComponent, AgDatePickerComponent]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [AgGridModule, AgGridExtensionsModule]
})
export class QuantityControlGridModule {
}
