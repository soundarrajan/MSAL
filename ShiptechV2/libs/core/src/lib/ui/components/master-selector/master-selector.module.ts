import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterSelectorHostComponent } from '@shiptech/core/ui/components/master-selector/master-selector-host.component';
import { MasterSelectorTriggerDirective } from '@shiptech/core/ui/components/master-selector/master-selector-trigger.directive';
import { VesselMasterSelectorComponent } from '@shiptech/core/ui/components/master-selector/known-masters/vessel/vessel-master-selector.component';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { PortalModule } from '@angular/cdk/portal';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { AgGridModule } from 'ag-grid-angular';
import { Button, ButtonModule, DynamicDialogModule } from 'primeng';
import { VesselPortCallsAutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/known-masters/vessel-port-calls/vessel-port-calls-autocomplete.component';
import { VesselPortCallsMasterSelectorComponent } from '@shiptech/core/ui/components/master-selector/known-masters/vessel-port-calls/vessel-port-calls-master-selector.component';

export function getDefaultStorage(defaultStorage: any): any {
  return defaultStorage;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    PortalModule,
    FilterPresetsModule,
    SearchBoxModule,
    AgGridExtensionsModule,
    AgGridModule,
    DynamicDialogModule,
    ButtonModule,
  ],
  declarations: [
    MasterSelectorHostComponent,
    MasterSelectorTriggerDirective,
    VesselMasterSelectorComponent,
    VesselPortCallsMasterSelectorComponent
  ],
  exports: [
    MasterSelectorHostComponent,
    MasterSelectorTriggerDirective,
    VesselMasterSelectorComponent,
    VesselPortCallsMasterSelectorComponent
  ],
  entryComponents: [
    MasterSelectorHostComponent,
    VesselMasterSelectorComponent
  ]
})
export class MasterSelectorModule {
}
