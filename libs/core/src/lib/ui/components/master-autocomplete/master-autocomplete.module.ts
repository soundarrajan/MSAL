import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UIModule} from '@shiptech/core/ui/ui.module';
import {MasterSelectorModule} from '@shiptech/core/ui/components/master-selector/master-selector.module';
import {PrimeNGModule} from '../../primeng.module';
import {AutocompleteComponent} from "@shiptech/core/ui/components/master-autocomplete/autocomplete/autocomplete.component";

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
    AutocompleteComponent
  ],
  exports: [
    AutocompleteComponent
  ],
  entryComponents: []
})
export class MasterAutocompleteModule {
}
