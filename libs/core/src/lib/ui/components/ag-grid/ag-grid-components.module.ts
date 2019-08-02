import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgTemplateRendererComponent } from './ag-template-renderer/ag-template-renderer.component';
import { AgTemplateRendererDirective } from './ag-template-renderer/ag-template-renderer.directive';
import { AgPagingComponent } from '../ag-paging/ag-paging.component';
import { PageSizeSelectorComponent } from '../page-size-selector/page-size-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgPagingModule } from '../ag-paging/ag-paging.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgPagingModule
  ],
  declarations: [
    AgTemplateRendererComponent,
    AgTemplateRendererDirective,
    PageSizeSelectorComponent
  ],
  exports: [
    AgTemplateRendererComponent,
    AgTemplateRendererDirective,
    AgPagingComponent,
    PageSizeSelectorComponent
  ]
})
export class AgGridComponentsModule {
}
