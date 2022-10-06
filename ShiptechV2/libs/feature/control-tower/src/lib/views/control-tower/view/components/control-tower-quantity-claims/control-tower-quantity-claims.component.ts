import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';

@Component({
  selector: 'app-control-tower-quantity-claims',
  templateUrl: './control-tower-quantity-claims.component.html',
  styleUrls: ['./control-tower-quantity-claims.component.css']
})
export class ControlTowerQuantityClaimsComponent implements OnInit {
  public switchTheme: boolean = true;
  public gridOptions_data: GridOptions;
  public rowCount: Number;
  today = new FormControl(new Date());
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  public rowSelection;
  ngOnInit(): void {}
  constructor(public dialog: MatDialog) {}
}
