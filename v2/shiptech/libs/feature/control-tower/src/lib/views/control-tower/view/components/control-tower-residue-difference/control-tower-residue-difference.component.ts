import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { RowstatusOnchangeResiduePopupComponent } from '@shiptech/core/ui/components/designsystem-v2/rowstatus-onchange-residue-popup/rowstatus-onchange-residue-popup.component';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';
// import { AGGridCellRendererComponent } from 'src/app/shared/ag-grid/ag-grid-cell-renderer.component';
// import { AGGridCellActionsComponent } from 'src/app/shared/designsystem-v2/ag-grid/ag-grid-cell-actions.component';
// import { RowstatusOnchangeResiduePopupComponent } from 'src/app/shared/designsystem-v2/rowstatus-onchange-residue-popup/rowstatus-onchange-residue-popup.component';

@Component({
  selector: 'app-residue-difference',
  templateUrl: './control-tower-residue-difference.component.html',
  styleUrls: ['./control-tower-residue-difference.component.css']
})
export class ControlTowerResidueDifferenceComponent implements OnInit {
  public switchTheme: boolean = true;
  public gridTitle = 'Sludge Difference';
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  ngOnInit(): void {}

  selectedTabChange(e: MatTabChangeEvent) {
    //console.log(e);
    if (e.index == 0) this.gridTitle = 'Sludge Difference';

    if (e.index == 1) this.gridTitle = 'EGCS Product Difference';
  }
}
