import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MaterialModule } from '../../material.module';
import { UIModule } from '../../ui.module';
import { AGGridCellActionsComponent } from './ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from './ag-grid/ag-grid-cell-editable.component';
import { AGGridCellRendererV2Component } from './ag-grid/ag-grid-cell-rendererv2.component';
import { FooterV2Component } from './footer-v2/footer-v2.component';
import { RowstatusOnchangeResiduePopupComponent } from './rowstatus-onchange-residue-popup/rowstatus-onchange-residue-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UIModule,
    MatRadioModule,
    AgGridModule.withComponents([
      AGGridCellActionsComponent,
      AGGridCellEditableComponent,
      AGGridCellRendererV2Component
    ])
  ],
  exports: [RowstatusOnchangeResiduePopupComponent, FooterV2Component],
  declarations: [
    AGGridCellActionsComponent,
    AGGridCellEditableComponent,
    AGGridCellRendererV2Component,
    RowstatusOnchangeResiduePopupComponent,
    FooterV2Component
  ],
  entryComponents: [RowstatusOnchangeResiduePopupComponent]
})
export class DSV2ComponentsModule {}
