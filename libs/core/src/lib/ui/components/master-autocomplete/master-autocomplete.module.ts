import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { VesselAutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/known-masters/vessel/vessel-autocomplete.component';
import { MasterSelectorModule } from '@shiptech/core/ui/components/master-selector/master-selector.module';
import { VesselPortCallsAutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/known-masters/vessel-port-calls/vessel-port-calls-autocomplete.component';
import { DocumentsAutocompleteComponent } from '@shiptech/core/ui/components/master-autocomplete/known-masters/documents/documents-autocomplete.component';
import { ButtonModule } from 'primeng/button';
import { PortalModule } from '@angular/cdk/portal';

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
  declarations: [
    VesselAutocompleteComponent,
    VesselPortCallsAutocompleteComponent,
    DocumentsAutocompleteComponent
  ],
  exports: [
    VesselAutocompleteComponent,
    VesselPortCallsAutocompleteComponent,
    DocumentsAutocompleteComponent
  ],
  entryComponents: []
})
export class MasterAutocompleteModule {
}
