import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GridOptions } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';
import { RowstatusOnchangeQuantityrobdiffPopupComponent } from '@shiptech/core/ui/components/designsystem-v2/rowstatus-onchange-quantityrobdiff-popup/rowstatus-onchange-quantityrobdiff-popup.component';

@Component({
  selector: 'control-tower-quantity-difference',
  templateUrl: './control-tower-quantity-difference.component.html',
  styleUrls: ['./control-tower-quantity-difference.component.css']
})
export class ControlTowerQuantityDifferenceComponent implements OnInit {
  public switchTheme: boolean = true;
  public gridTitle = 'ROB Difference';
  public gridOptions_data: GridOptions;
  public gridOptions_data1: GridOptions;
  public toggleNewFilter: boolean = true;
  public toggleMASFilter: boolean = true;
  public toggleResolvedFilter: boolean = true;
  public rowCount: Number;
  today = new FormControl(new Date());
  public rowSelection;
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  ngOnInit(): void {}

  constructor(public dialog: MatDialog) {}

  selectedTabChange(e: MatTabChangeEvent) {
    //console.log(e);
    if (e.index == 0) this.gridTitle = 'ROB Difference';

    if (e.index == 1) this.gridTitle = 'Supply Difference';
  }

  filterGridNew(text) {
    console.log(this.gridTitle);
    // if (this.toggleNewFilter) {
    //   var instance = this.gridOptions_data.api.getFilterInstance('progress');
    //   instance.setModel({
    //     values: [text]
    //   });
    //   this.gridOptions_data.api.onFilterChanged();
    // } else {
    //   var instance = this.gridOptions_data.api.getFilterInstance('progress');
    //   instance.setModel(null);
    //   this.gridOptions_data.api.onFilterChanged();
    // }
    this.toggleNewFilter = !this.toggleNewFilter;
    this.toggleMASFilter = true;
    this.toggleResolvedFilter = true;
  }

  filterGridMAS(text) {
    if (this.toggleMASFilter) {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel({
        values: [text]
      });
      this.gridOptions_data.api.onFilterChanged();
    } else {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel(null);
      this.gridOptions_data.api.onFilterChanged();
    }
    this.toggleMASFilter = !this.toggleMASFilter;
    this.toggleNewFilter = true;
    this.toggleResolvedFilter = true;
  }

  filterGridResolved(text) {
    if (this.toggleResolvedFilter) {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel({
        values: [text]
      });
      this.gridOptions_data.api.onFilterChanged();
    } else {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel(null);
      this.gridOptions_data.api.onFilterChanged();
    }
    this.toggleResolvedFilter = !this.toggleResolvedFilter;
    this.toggleNewFilter = true;
    this.toggleMASFilter = true;
  }
}