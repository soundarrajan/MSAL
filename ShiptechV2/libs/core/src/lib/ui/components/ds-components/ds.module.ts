import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { UIModule } from '../../ui.module';
import { AGGridCellActionsComponent } from './ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from './ag-grid/ag-grid-cell-editable.component';
import { AGGridCellRendererComponent } from './ag-grid/ag-grid-cell-renderer.component';
import { AgGridCellStyleComponent } from './ag-grid/ag-grid-cell-style.component';
import { FooterV2Component } from './footer-v2/footer-v2.component';
import { MasterChip } from './master-chip/master-chip.component';
import { MasterSelectionDialog } from './pop-ups/master-selection-popup.component';
import { OperationalAmountDialog } from './pop-ups/operational-amount.component';
// import { OpsSpecParameterDialog } from './pop-ups/ops-spec-parameter.component';
import { SearchPopupDialog } from './pop-ups/search-popup.component';
import { SpecParameterDialog } from './pop-ups/spec-parameter.component';
import { ReadonlyDetailsComponent } from './readonly-details/readonly-details.component';
import { TabsComponent } from './tabs/tabs.component';
import { StAutosearchSelectorComponent } from './st-autosearch-selector/st-autosearch-selector.component';
import { AmountTenantFormatDirective } from './directives/amount-tenant-format.directive';
import { HtmlDecodeReadonly } from '@shiptech/core/pipes/htmlDecode/html-decode-readonly.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UIModule,
    AgGridModule.withComponents([
      AGGridCellEditableComponent,
      AgGridCellStyleComponent,
      AGGridCellActionsComponent,
      AGGridCellRendererComponent
    ])
  ],
  exports: [
    TabsComponent,
    MasterChip,
    ReadonlyDetailsComponent,
    StAutosearchSelectorComponent
  ],
  declarations: [
    TabsComponent,
    AGGridCellActionsComponent,
    AGGridCellEditableComponent,
    // OpsSpecParameterDialog,
    OperationalAmountDialog,
    SpecParameterDialog,
    MasterChip,
    ReadonlyDetailsComponent,
    AgGridCellStyleComponent,
    AGGridCellRendererComponent,
    SearchPopupDialog,
    MasterSelectionDialog,
    FooterV2Component,
    StAutosearchSelectorComponent,
    AmountTenantFormatDirective,
    HtmlDecodeReadonly
  ],
  entryComponents: [MasterSelectionDialog]
})
export class DSComponentsModule {}
