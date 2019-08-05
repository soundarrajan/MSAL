import { NgModule } from '@angular/core';
import { FilterPreferencesComponent } from './filter-preference.component';
import { AvailableFiltersComponent } from './available-filters/available-filters.component';
import { AgGridFilterPresetsService } from './ag-filter-presets-service/ag-filter-presets.service';
import { AgGridFilterPresetsDirective } from './ag-grid-filter-presets.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { PresetsMenuDropdownComponent } from './presets-menu-dropdown/presets-menu-dropdown.component';

export function getDefaultStorage(defaultStorage: any): any {
  return defaultStorage;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    FilterPreferencesComponent,
    AvailableFiltersComponent,
    AgGridFilterPresetsDirective,
    PresetsMenuDropdownComponent
  ],
  providers: [
    AgGridFilterPresetsService
  ],
  exports: [
    FilterPreferencesComponent,
    AvailableFiltersComponent,
    AgGridFilterPresetsDirective,
    PresetsMenuDropdownComponent
  ],
  entryComponents: [
    AvailableFiltersComponent
  ]
})
export class FilterPresetsModule {
}
