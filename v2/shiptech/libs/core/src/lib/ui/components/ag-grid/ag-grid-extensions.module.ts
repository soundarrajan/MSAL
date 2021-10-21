import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgCellTemplateComponent } from './ag-cell-template/ag-cell-template.component';
import { AgCellTemplateDirective } from './ag-cell-template/ag-cell-template.directive';
import { PageSizeSelectorComponent } from '../page-size-selector/page-size-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgPagingModule } from '../ag-paging/ag-paging.module';
import { AgColumnGroupHeaderTemplateDirective } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header-template.directive';
import { AgColumnGroupHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-group-header/ag-column-group-header.component';
import { AgColumnHeaderTemplateDirective } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header-template.directive';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { AgGridSizeToFitDirective } from '@shiptech/core/ui/components/ag-grid/directives/size-to-fit.directive';
import { AgGridFirstColumnLockedDirective } from '@shiptech/core/ui/components/ag-grid/directives/first-column-locked.directive';
import { AgGridDeselectFilteredRowsDirective } from '@shiptech/core/ui/components/ag-grid/directives/deselect-filtred-rows.directive';
import { AgGridEmptyFilterOptionDirective } from '@shiptech/core/ui/components/ag-grid/directives/empty-filter-option';
import { AgDatePickerComponent } from '@shiptech/core/ui/components/ag-grid/ag-data-picker/ag-date-picker.component';
import { AgGridClearAllFiltersDirective } from '@shiptech/core/ui/components/ag-grid/directives/clear-all-filters.directive';
import { AgCheckBoxRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component';
import { AgCheckBoxHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-header/ag-check-box-header.component';
import { FlexModule } from '@angular/flex-layout';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';
import { CalendarModule } from 'primeng/calendar';
import { AgOpenPopUpComponent } from './ag-open-pop-up/ag-open-pop-up.component';
import { ControlTowerModalComponent } from '../control-tower-modal/control-tower-modal.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { AgPagingNewModule } from '../ag-paging-new/ag-paging-new.module';
import { PageSizeSelectorNewComponent } from '../page-size-selector-new/page-size-selector-new.component';

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
  PageSizeSelectorNewComponent,
  AgGridFirstColumnLockedDirective,
  AgGridDeselectFilteredRowsDirective,
  AgDatePickerComponent,
  AgCheckBoxHeaderComponent,
  AgCheckBoxRendererComponent,
  AgAsyncBackgroundFillComponent,
  AgOpenPopUpComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgPagingModule,
    AgPagingNewModule,
    FlexModule,
    CalendarModule,
    FormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: [...COMPONENTS],
  exports: [AgPagingModule, ...COMPONENTS]
})
export class AgGridExtensionsModule {}
