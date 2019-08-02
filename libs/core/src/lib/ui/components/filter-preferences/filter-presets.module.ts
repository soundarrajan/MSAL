import { NgModule } from '@angular/core';
import { FilterPreferencesComponent } from './filter-preference.component';
import { AvailableFiltersComponent } from './available-filters/available-filters.component';
import { AgGridFilterPresetsService } from './ag-filter-presets-service/ag-filter-presets.service';
import { AgGridFilterPresetsDirective } from './ag-grid-filter-presets.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { PREFERENCE_STORAGE } from '../../../services/preference-storage/preference-storage.interface';
import {
  USER_SETTINGS_API_SERVICE,
  UserSettingsApiService
} from '../../../services/user-settings/user-settings-api.service';
import { UserSettingsApiServiceMock } from '../../../services/user-settings/user-settings-api.service.mock';
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
    AgGridFilterPresetsService,
    UserSettingsApiService,
    UserSettingsApiServiceMock,
    {
      provide: PREFERENCE_STORAGE,
      useFactory: getDefaultStorage,
      deps: [USER_SETTINGS_API_SERVICE]
    }
  ],
  exports: [
    FilterPreferencesComponent,
    AvailableFiltersComponent,
    AgGridFilterPresetsDirective,
    PresetsMenuDropdownComponent
  ]
})
export class FilterPresetsModule {
}
