import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MaterialModule } from '../../material.module';
import { UIModule } from '../../ui.module';
import { AGGridCellActionsComponent } from './ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from './ag-grid/ag-grid-cell-editable.component';

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
      AGGridCellEditableComponent
    ])
  ],
  exports: [],
  declarations: [AGGridCellActionsComponent, AGGridCellEditableComponent],
  entryComponents: []
})
export class DSV2ComponentsModule {}
