import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
// import { OperationalAmountDialog } from 'src/app/movements/popup-screens/operational-amount.component';
// import { InventoryReportPopupComponent } from '../../../ops-inventory/popup-screens/inventory-report-popup/inventory-report-popup.component';
// import { ChangeLogPopupComponent } from '../../dialog-popup/change-log-popup/change-log-popup.component';
@Component({
  selector: 'ag-grid-cell-renderer',
  template: `
    <div *ngIf="params.type === 'row-remove-icon'">
      <div class="remove-icon" (click)="deleteRow()"></div>
    </div>
    <div *ngIf="params.type === 'row-remove-icon-with-checkbox'">
      <div class="remove-icon-with-checkbox" (click)="deleteRow()"></div>
    </div>
    <div *ngIf="params.type === 'row-remove-icon-cell-hover'">
      <div class=" remove-icon-cell-hover" (click)="deleteRow()"></div>
    </div>
    <div *ngIf="params.type === 'download'">
      <div class="download-icon"></div>
    </div>
    <div *ngIf="params.type === 'radio-button-selection'">
      <mat-radio-button
        [checked]="params.value"
        class="grid-radio-btn"
      ></mat-radio-button>
    </div>
    <div *ngIf="params.type === 'checkbox-selection'">
      <mat-checkbox class="grid-checkbox"></mat-checkbox>
    </div>
    <div *ngIf="params.type === 'download-json-btn'">
      <button mat-raised-button class="blue-button h-25">Download JSON</button>
    </div>
    <div
      *ngIf="params.type === 'cell-edit-sort-order'"
      style="margin-left: -55px;"
    >
      <span class="sort-order-icon-disabled"></span>
      <span class="sort-order-icon"></span>
    </div>
    <div *ngIf="params.type == 'revert'">
      <img
        src="../../../assets/customicons/revert.svg"
        width="13"
        alt="Revert"
      />
    </div>
    <div *ngIf="params.type == 'actions'">
      <div class="action-icon-dark"></div>
      <div *ngIf="params.type === 'border-cell'">
        <div class="border-cell">
          <span class="left-data">{{ params.value }}</span>
          <span class="right-data">{{ params.data.orderProduct }}</span>
        </div>
      </div>
      <div *ngIf="params.type === 'dashed-border-darkcell'">
        <div class="dashed-border" style="">{{ params.value }}</div>
      </div>
      <div *ngIf="params.type === 'dashed-border-with-expand'">
        <span class="dashed-border with-expand">{{ params.value }}</span>
        <span class="expand-arrow"></span>
      </div>
      <div
        *ngIf="params.type === 'dashed-border-dark-search'"
        class="cell-bg-border"
      >
        <div class="truncate-100p inner-cell dark" style="padding: 0 3px;">
          <span class="dashed-border with-search">
            {{ params.value }}<span class="search-icon-dark"></span>
          </span>
        </div>
      </div>
    </div>
  `
})
export class AGGridCellActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public popupOpen: boolean;
  constructor(public router: Router, public dialog: MatDialog) {}

  agInit(params: any): void {
    this.params = params;
    // console.log(this.params);
  }

  refresh(): boolean {
    return false;
  }
  deleteRow() {
    const rowData = [];
    this.params.api.forEachNode(node => rowData.push(node.data));
    const index = this.params.node.rowIndex;
    let newData = [];
    newData = rowData.splice(index, 1);
    this.params.api.applyTransaction({ remove: newData });
    this.params.action();
  }
}
