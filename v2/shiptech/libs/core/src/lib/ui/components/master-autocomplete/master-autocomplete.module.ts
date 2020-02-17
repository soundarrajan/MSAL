import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { ButtonModule } from 'primeng/button';
import { PortalModule } from '@angular/cdk/portal';
import { AutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/autocomplete/autocomplete.component';

export function getDefaultStorage(defaultStorage: any): any {
  return defaultStorage;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    MasterSelectorModule,
    ButtonModule,
    PortalModule
  ],
  declarations: [AutocompleteComponent],
  exports: [AutocompleteComponent],
  entryComponents: []
})
export class MasterAutocompleteModule {}
