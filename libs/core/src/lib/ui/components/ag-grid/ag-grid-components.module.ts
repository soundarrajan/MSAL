import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgCellTemplateComponent } from './ag-cell-template/ag-cell-template.component';
import { AgCellTemplateDirective } from './ag-cell-template/ag-cell-template.directive';
import { AgPagingComponent } from '../ag-paging/ag-paging.component';
import { PageSizeSelectorComponent } from '../page-size-selector/page-size-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgPagingModule } from '../ag-paging/ag-paging.module';
import { ListboxModule } from 'primeng/listbox';
import { AgColumnGroupHeaderTemplateDirective } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header-template.directive';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgColumnHeaderTemplateDirective } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header-template.directive';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgPagingModule,
    ListboxModule
  ],
  declarations: [
    AgCellTemplateComponent,
    AgCellTemplateDirective,
    AgColumnHeaderComponent,
    AgColumnGroupHeaderTemplateDirective,
    AgColumnGroupHeaderComponent,
    AgColumnHeaderTemplateDirective,
    PageSizeSelectorComponent
  ],
  exports: [
    AgCellTemplateComponent,
    AgCellTemplateDirective,
    AgColumnGroupHeaderTemplateDirective,
    AgColumnHeaderTemplateDirective,
    AgColumnGroupHeaderComponent,
    AgColumnHeaderComponent,
    AgPagingComponent,
    PageSizeSelectorComponent
  ]
})
export class AgGridComponentsModule {
}
