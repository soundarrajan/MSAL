import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MasterSelectorHostComponent } from '@shiptech/core/ui/components/master-selector/master-selector-host.component';
import { MasterSelectorTriggerDirective } from '@shiptech/core/ui/components/master-selector/master-selector-trigger.directive';
import { UIModule } from '@shiptech/core/ui/ui.module';
import { FilterPresetsModule } from '@shiptech/core/ui/components/filter-preferences/filter-presets.module';
import { SearchBoxModule } from '@shiptech/core/ui/components/search-box/search-box.module';
import { AgGridExtensionsModule } from '@shiptech/core/ui/components/ag-grid/ag-grid-extensions.module';
import { AgGridModule } from 'ag-grid-angular';
import { AgFilterDisplayModule } from '@shiptech/core/ui/components/ag-filter-display/ag-filter-display.module';
import { AgFooterModule } from "@shiptech/core/ui/components/ag-footer/ag-footer.module";
import { SelectorComponent } from "@shiptech/core/ui/components/master-selector/selector/selector.component";

export function getDefaultStorage(defaultStorage: any): any {
  return defaultStorage;
}

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
    SelectorComponent
  ],
  exports: [
    MasterSelectorHostComponent,
    MasterSelectorTriggerDirective,
    SelectorComponent
  ],
  entryComponents: [
    MasterSelectorHostComponent,
    SelectorComponent
  ]
})
export class MasterSelectorModule {
}
