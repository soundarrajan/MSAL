import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { AGGridCellActionsComponent } from './ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from './ag-grid/ag-grid-cell-editable.component';
import { MasterChip } from './master-chip/master-chip.component';
import { OperationalAmountDialog } from './pop-ups/operational-amount.component';
import { OpsSpecParameterDialog } from './pop-ups/ops-spec-parameter.component';
import { SpecParameterDialog } from './pop-ups/spec-parameter.component';
import { TabsComponent } from './tabs/tabs.component';
import { ReadonlyDetailsComponent } from './readonly-details/readonly-details.component';
import { AgGridCellStyleComponent } from './ag-grid/ag-grid-cell-style.component';
import { AGGridCellRendererComponent } from './ag-grid/ag-grid-cell-renderer.component';
@NgModule({ 
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgGridModule.withComponents([])
  ],
  exports: [ 
    TabsComponent,
    MasterChip,
    ReadonlyDetailsComponent
  ],
  declarations: [
    TabsComponent,
    AGGridCellActionsComponent,    
    AGGridCellEditableComponent,
    OpsSpecParameterDialog,
    OperationalAmountDialog,
    SpecParameterDialog,
    MasterChip,
    ReadonlyDetailsComponent,
    AgGridCellStyleComponent,
    AGGridCellRendererComponent
  ],
})
export class DSComponentsModule {}
