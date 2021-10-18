import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgFooterNewComponent } from './ag-footer-new.component';
import { AgPagingNewModule } from '../ag-paging-new/ag-paging-new.module';
import { MaterialModule } from '../../material.module';
import { AgGridExtensionsModule } from '../ag-grid/ag-grid-extensions.module';
import { ExportNewModule } from '../export-new/export-new.module';

@NgModule({
  imports: [
    CommonModule,
    AgPagingNewModule,
    MaterialModule,
    ExportNewModule,
    AgGridExtensionsModule
  ],
  declarations: [AgFooterNewComponent],
  exports: [AgFooterNewComponent]
})
export class AgFooterNewModule {}
