import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgDatePickerComponent } from '@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { DocumentsComponent } from '@shiptech/core/ui/components/documents/documents.component';
import { DocumentViewEditNotesComponent } from './document-view-edit-notes/document-view-edit-notes.component';
import { MasterAutocompleteModule } from '@shiptech/core/ui/components/master-autocomplete/master-autocomplete.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { FileSaverModule } from 'ngx-filesaver';
import { AgFooterModule } from '@shiptech/core/ui/components/ag-footer/ag-footer.module';
import { AgGridModule } from '@ag-grid-community/angular';

@NgModule({
  imports: [
    CommonModule,
    UIModule,
    FormsModule,
    CheckboxModule,
    AutoCompleteModule,
    FileUploadModule,
    MasterSelectorModule,
    AgGridExtensionsModule,
    FileSaverModule,
    AgGridModule.withComponents([
      AgCellTemplateComponent,
      AgColumnHeaderComponent,
      AgColumnGroupHeaderComponent,
      AgDatePickerComponent
    ]),
    AgFilterDisplayModule,
    MasterAutocompleteModule,
    AgFooterModule
  ],
  declarations: [DocumentsComponent, DocumentViewEditNotesComponent],
  exports: [DocumentsComponent],
  entryComponents: [DocumentViewEditNotesComponent]
})
export class DocumentsModule {}
