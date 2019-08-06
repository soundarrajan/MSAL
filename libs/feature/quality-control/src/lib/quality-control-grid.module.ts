import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '@shiptech/core';
import { AgTemplateRendererDirective } from '@shiptech/core/ui/components/ag-grid/ag-template-renderer/ag-template-renderer.directive';
import { AgGridComponentsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-components.module';
import { AgTemplateRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-template-renderer/ag-template-renderer.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridComponentsModule,
    AgGridModule.withComponents([AgTemplateRendererComponent, AgTemplateRendererDirective]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [AgGridModule, AgGridComponentsModule]
})
export class QualityControlGridModule {
}
