import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { VesselAutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/known-masters/vessel/vessel-autocomplete.component';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { PrimeNGModule } from '../../primeng.module';
import { VesselPortCallsAutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/known-masters/vessel-port-calls/vessel-port-calls-autocomplete.component';

export function getDefaultStorage(defaultStorage: any): any {
  return defaultStorage;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    PrimeNGModule,
    MasterSelectorModule
  ],
  declarations: [
    VesselAutocompleteComponent,
    VesselPortCallsAutocompleteComponent
  ],
  exports: [
    VesselAutocompleteComponent,
    VesselPortCallsAutocompleteComponent
  ],
  entryComponents: []
})
export class MasterAutocompleteModule {
}
