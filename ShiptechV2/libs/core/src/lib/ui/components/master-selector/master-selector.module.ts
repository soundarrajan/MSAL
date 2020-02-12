import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterSelectorHostComponent } from '@shiptech/core/ui/components/master-selector/master-selector-host.component';
import { MasterSelectorTriggerDirective } from '@shiptech/core/ui/components/master-selector/master-selector-trigger.directive';
import { VesselMasterSelectorComponent } from '@shiptech/core/ui/components/master-selector/known-masters/vessel/vessel-master-selector.component';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { VesselPortCallsMasterSelectorComponent } from '@shiptech/core/ui/components/master-selector/known-masters/vessel-port-calls/vessel-port-calls-master-selector.component';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import {DocumentsMasterSelectorComponent} from "@shiptech/core/ui/components/master-selector/known-masters/documents/documents-master-selector.component";
import { AgFooterModule } from "@shiptech/core/ui/components/ag-footer/ag-footer.module";
import { ButtonModule } from 'primeng/button';
import { PortalModule } from '@angular/cdk/portal';
import {AgGridModule} from "@ag-grid-community/angular";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    FilterPresetsModule,
    SearchBoxModule,
    AgGridExtensionsModule,
    AgGridModule,
    AgFilterDisplayModule,
    AgFooterModule,
    ButtonModule,
    PortalModule
  ],
  declarations: [
    MasterSelectorHostComponent,
    MasterSelectorTriggerDirective,
    VesselMasterSelectorComponent,
    VesselPortCallsMasterSelectorComponent,
    DocumentsMasterSelectorComponent
  ],
  exports: [
    MasterSelectorHostComponent,
    MasterSelectorTriggerDirective,
    VesselMasterSelectorComponent,
    VesselPortCallsMasterSelectorComponent,
    DocumentsMasterSelectorComponent
  ],
  entryComponents: [
    MasterSelectorHostComponent,
    VesselMasterSelectorComponent,
    DocumentsMasterSelectorComponent
  ]
})
export class MasterSelectorModule {
}
