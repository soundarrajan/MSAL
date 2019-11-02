import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AgGridComponentsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-components.module';
import { AgTemplateRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-template-renderer/ag-template-renderer.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridComponentsModule,
    AgGridModule.withComponents([AgTemplateRendererComponent, AgColumnGroupHeaderComponent]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [AgGridModule, AgGridComponentsModule]
})
export class QuantityControlGridModule {
}
