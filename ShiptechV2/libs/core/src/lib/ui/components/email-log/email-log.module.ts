import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { EmailLogComponent } from '@shiptech/core/ui/components/email-log/email-log.component';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgDatePickerComponent } from '@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { AgFooterModule } from '@shiptech/core/ui/components/ag-footer/ag-footer.module';
import { AgGridModule } from '@ag-grid-community/angular';

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    AgGridExtensionsModule,
    AgGridModule.withComponents([
      AgCellTemplateComponent,
      AgColumnHeaderComponent,
      AgColumnGroupHeaderComponent,
      AgDatePickerComponent
    ]),
    AgFilterDisplayModule,
    AgFooterModule
  ],
  declarations: [EmailLogComponent],
  exports: [EmailLogComponent],
  entryComponents: []
})
export class EmailLogModule {}
