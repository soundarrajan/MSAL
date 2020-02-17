import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgCellTemplateComponent } from "./ag-cell-template/ag-cell-template.component";
import { AgCellTemplateDirective } from "./ag-cell-template/ag-cell-template.directive";
import { PageSizeSelectorComponent } from "../page-size-selector/page-size-selector.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgPagingModule } from "../ag-paging/ag-paging.module";
import { AgColumnGroupHeaderTemplateDirective } from "@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header-template.directive";
import { AgColumnGroupHeaderComponent } from "@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component";
import { AgColumnHeaderTemplateDirective } from "@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header-template.directive";
import { AgColumnHeaderComponent } from "@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component";
import { AgGridSizeToFitDirective } from "@shiptech/core/ui/components/ag-grid/directives/size-to-fit.directive";
import { AgGridFirstColumnLockedDirective } from "@shiptech/core/ui/components/ag-grid/directives/first-column-locked.directive";
import { AgGridDeselectFilteredRowsDirective } from "@shiptech/core/ui/components/ag-grid/directives/deselect-filtred-rows.directive";
import { AgGridEmptyFilterOptionDirective } from "@shiptech/core/ui/components/ag-grid/directives/empty-filter-option";
import { AgDatePickerComponent } from "@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component";
import { AgGridClearAllFiltersDirective } from "@shiptech/core/ui/components/ag-grid/directives/clear-all-filters.directive";
import { AgCheckBoxRendererComponent } from "@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component";
import { AgCheckBoxHeaderComponent } from "@shiptech/core/ui/components/ag-grid/ag-check-box-header/ag-check-box-header.component";
import { FlexModule } from "@angular/flex-layout";
import {AgAsyncBackgroundFillComponent} from "@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component";
import { CalendarModule } from 'primeng/calendar';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PrimeNGModule} from "@shiptech/core/ui/primeng.module";

const COMPONENTS = [
  AgCellTemplateComponent,
  AgCellTemplateDirective,
  AgColumnHeaderComponent,
  AgColumnGroupHeaderTemplateDirective,
  AgColumnGroupHeaderComponent,
  AgColumnHeaderTemplateDirective,
  AgGridSizeToFitDirective,
  AgGridClearAllFiltersDirective,
  AgGridFirstColumnLockedDirective,
  AgGridDeselectFilteredRowsDirective,
  AgGridEmptyFilterOptionDirective,
  PageSizeSelectorComponent,
  AgGridFirstColumnLockedDirective,
  AgGridDeselectFilteredRowsDirective,
  AgDatePickerComponent,
  AgCheckBoxHeaderComponent,
  AgCheckBoxRendererComponent,
  AgAsyncBackgroundFillComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgPagingModule,
    PrimeNGModule,
    MatCheckboxModule,
    FlexModule,
    CalendarModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    AgPagingModule,
    ...COMPONENTS
  ]
})
export class AgGridExtensionsModule {
}
