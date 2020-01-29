import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIModule } from "@shiptech/core/ui/ui.module";
import { AgGridExtensionsModule } from "@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module";
import { AgGridModule } from "ag-grid-angular";
import { AgCellTemplateComponent } from "@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component";
import { AgColumnHeaderComponent } from "@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component";
import { AgColumnGroupHeaderComponent } from "@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component";
import { AgDatePickerComponent } from "@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component";
import { AgFilterDisplayModule } from "@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module";
import { AuditLogComponent } from "@shiptech/core/ui/components/audit-log/audit-log.component";

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    AgGridExtensionsModule,
    AgGridModule.withComponents([AgCellTemplateComponent, AgColumnHeaderComponent, AgColumnGroupHeaderComponent, AgDatePickerComponent]),
    AgFilterDisplayModule
  ],
  declarations: [
    AuditLogComponent
  ],
  exports: [
    AuditLogComponent
  ],
  entryComponents: []
})
export class AuditLogModule {
}
