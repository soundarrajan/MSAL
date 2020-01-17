import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIModule } from "@shiptech/core/ui/ui.module";
import { MasterSelectorModule } from "@shiptech/core/ui/components/master-selector/master-selector.module";
import { PrimeNGModule } from "../../primeng.module";
import { AgGridExtensionsModule } from "@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module";
import { AgGridModule } from "ag-grid-angular";
import { AgCellTemplateComponent } from "@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component";
import { AgColumnHeaderComponent } from "@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component";
import { AgColumnGroupHeaderComponent } from "@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component";
import { AgDatePickerComponent } from "@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component";
import { AgFilterDisplayModule } from "@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module";
import { DocumentsComponent } from "@shiptech/core/ui/components/documents/documents.component";
import { DocumentViewEditNotesComponent } from "./document-view-edit-notes/document-view-edit-notes.component";

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    PrimeNGModule,
    MasterSelectorModule,
    AgGridExtensionsModule,
    AgGridModule.withComponents([AgCellTemplateComponent, AgColumnHeaderComponent, AgColumnGroupHeaderComponent, AgDatePickerComponent]),
    AgFilterDisplayModule
  ],
  declarations: [
    DocumentsComponent,
    DocumentViewEditNotesComponent
  ],
  exports: [
    DocumentsComponent
  ],
  entryComponents: [
    DocumentViewEditNotesComponent
  ]
})
export class DocumentsModule {
}
