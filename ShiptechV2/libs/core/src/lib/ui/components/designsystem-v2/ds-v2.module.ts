import { AgGridModule } from '@ag-grid-community/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MaterialModule } from '../../material.module';
import { UIModule } from '../../ui.module';
import { AvailableFiltersPreferencesComponent } from './dialog-popup/available-filters-preferences/available-filters-preferences.component';
import { SellerratingpopupComponent } from './dialog-popup/sellerratingpopup/sellerratingpopup.component';
import { AGGridCellActionsComponent } from './ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererAsyncStatusComponent } from './ag-grid/ag-grid-cell-async-status/ag-grid-cell-async-status.component';
import { AGGridCellEditableComponent } from './ag-grid/ag-grid-cell-editable.component';
import { AGGridCellRendererV2Component } from './ag-grid/ag-grid-cell-rendererv2.component';
import { FooterV2Component } from './footer-v2/footer-v2.component';
import { RowstatusOnchangePopupComponent } from './rowstatus-onchange-popup/rowstatus-onchange-popup.component';
import { RowstatusOnchangeQualitylabPopupComponent } from './rowstatus-onchange-qualitylab-popup/rowstatus-onchange-qualitylab-popup.component';
import { RowstatusOnchangeResiduePopupComponent } from './rowstatus-onchange-residue-popup/rowstatus-onchange-residue-popup.component';
import { DarkSelectionMenuComponent } from './dark-selection-menu/dark-selection-menu.component'
import { SearchProductsPopupComponent } from './search-products-popup/search-products-popup.component'
import { SearchLocationPopupComponent } from './search-location-popup/search-location-popup.component'
import { NgxPaginationModule } from 'ngx-pagination';
import { AGGridCellRendererStatusComponent } from './ag-grid/ag-grid-cell-status/ag-grid-cell-status.component';
import { ControlTowerPopupComponent } from './control-tower-popup/control-tower-popup.component';
import { AgFooterNewModule } from '@shiptech/core/ui/components/ag-footer-new/ag-footer-new.module'
import { SharedModule } from '@shiptech/core/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { RatingModule } from 'ng-starrating';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    UIModule,
    NgxPaginationModule,
    MatRadioModule,
    AgFooterNewModule,
    SharedModule,
    DragDropModule,
    RatingModule,
    NgxSpinnerModule,
    AgGridModule.withComponents([
      AGGridCellActionsComponent,
      AGGridCellEditableComponent,
      AGGridCellRendererV2Component,
      AGGridCellRendererAsyncStatusComponent,
      AGGridCellRendererStatusComponent
    ])
  ],
  exports: [
    RowstatusOnchangeResiduePopupComponent,
    FooterV2Component,
    ControlTowerPopupComponent,
    RowstatusOnchangeQualitylabPopupComponent,
    RowstatusOnchangePopupComponent,
    AGGridCellRendererAsyncStatusComponent,
    AGGridCellRendererStatusComponent,
    DarkSelectionMenuComponent,
    SearchProductsPopupComponent,
    SearchLocationPopupComponent
  ],
  declarations: [
    AvailableFiltersPreferencesComponent,
    SellerratingpopupComponent,
    AGGridCellActionsComponent,
    AGGridCellEditableComponent,
    AGGridCellRendererV2Component,
    RowstatusOnchangeResiduePopupComponent,
    FooterV2Component,
    ControlTowerPopupComponent,
    RowstatusOnchangeQualitylabPopupComponent,
    RowstatusOnchangePopupComponent,
    AGGridCellRendererAsyncStatusComponent,
    AGGridCellRendererStatusComponent,
    DarkSelectionMenuComponent,
    SearchProductsPopupComponent,
    SearchLocationPopupComponent
  ],
  entryComponents: [
    RowstatusOnchangeResiduePopupComponent,
    ControlTowerPopupComponent,
    RowstatusOnchangeQualitylabPopupComponent,
    RowstatusOnchangePopupComponent
  ]
})
export class DSV2ComponentsModule {}
