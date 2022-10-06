import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { AgDatePickerComponent } from '@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component';
import { AgCheckBoxHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-header/ag-check-box-header.component';
import { AgCheckBoxRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridExtensionsModule,
    AgGridModule.withComponents([
      AgCellTemplateComponent,
      AgColumnHeaderComponent,
      AgColumnGroupHeaderComponent,
      AgDatePickerComponent,
      AgCheckBoxHeaderComponent,
      AgCheckBoxRendererComponent,
      AgAsyncBackgroundFillComponent
    ]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [AgGridModule, AgGridExtensionsModule]
})
export class ContractGridModule {}
