import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgTemplateRendererComponent } from './ag-template-renderer/ag-template-renderer.component';
import { AgTemplateRendererDirective } from './ag-template-renderer/ag-template-renderer.directive';
import { AgPagingComponent } from '../ag-paging/ag-paging.component';
import { PageSizeSelectorComponent } from '../page-size-selector/page-size-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgPagingModule } from '../ag-paging/ag-paging.module';
import { ListboxModule } from 'primeng/listbox';
import { AgHeaderRendererDirective } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-header-renderer.directive';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgPagingModule,
    ListboxModule
  ],
  declarations: [
    AgTemplateRendererComponent,
    AgTemplateRendererDirective,
    AgHeaderRendererDirective,
    AgColumnGroupHeaderComponent,
    PageSizeSelectorComponent
  ],
  exports: [
    AgTemplateRendererComponent,
    AgTemplateRendererDirective,
    AgHeaderRendererDirective,
    AgColumnGroupHeaderComponent,
    AgPagingComponent,
    PageSizeSelectorComponent
  ]
})
export class AgGridComponentsModule {
}
