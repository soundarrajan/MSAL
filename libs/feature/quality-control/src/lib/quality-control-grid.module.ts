import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgPagingComponent } from '../../../../core/src/lib/ui/components/ag-paging/ag-paging.component';
import { CommonModule } from '@angular/common';
import { PageSizeSelectorComponent } from '../../../../core/src/lib/ui/components/page-size-selector/page-size-selector.component';
import { PrimeNGModule } from '@shiptech/core';

@NgModule({
  declarations: [AgPagingComponent, PageSizeSelectorComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PrimeNGModule
  ],
  exports: [AgGridModule, AgPagingComponent, PageSizeSelectorComponent]
})
export class QualityControlGridModule {
}
