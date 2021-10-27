import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Select, Store } from '@ngxs/store';
import { SelectSeller, EditLocationRow } from '../../store/actions/ag-grid-row.action';
// import { ChangeLogPopupComponent } from '../dialog-popup/change-log-popup/change-log-popup.component';

// Not found
// import { OperationalAmountDialog } from 'src/app/movements/popup-screens/operational-amount.component';

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
      <mat-checkbox class="grid-checkbox test22" [checked]="params.value" (click)="selectCounterParties(params)"></mat-checkbox>
    </div>
    <div
      class="hover-popup-icon grid-popup"
      *ngIf="params.type === 'grid-popup-icon'"
    >
      <span>{{ params.value }}</span>
      <div
        class="popup-icon"
        matTooltip="View Operational Calc."
        matTooltipShowDelay="200"
      ></div>
    </div>
    <div
      class="hover-popup-icon"
      *ngIf="params.type === 'cell-with-popup-icon'"
    >
      <div>{{ params.value }}</div>
      <div
        class="popup-icon-inline"
        [ngClass]="{ 'popup-icon-active': popupOpen }"
        matTooltip="View Operational Calc."
        matTooltipShowDelay="200"
      ></div>
    </div>
    <div *ngIf="params.type === 'view-link'">
      <span (click)="navigateTo($event)">View</span>
    </div>
    <div *ngIf="params.type === 'edit-link'">
      <span (click)="navigateTo($event)">Edit</span>
    </div>
    <div *ngIf="params.type === 'copy-link'">
      <span (click)="navigateTo($event)">Copy</span>
    </div>
    <div *ngIf="params.type === 'delete-link'">
      <span (click)="navigateTo($event)">Delete</span>
    </div>
    <div *ngIf="params.type === 'run-link'">
      <span
        [ngClass]="{
          'view-eye-icon': params.value == 'View EOM',
          'run-icon': params.value == 'Run EOM'
        }"
      ></span>
      <span (click)="navigateTo($event)">{{ params.value }}</span>
    </div>
    <div *ngIf="params.type === 'download-json-btn'">
      <button mat-raised-button class="blue-button h-25">Download JSON</button>
    </div>
    <div *ngIf="params.type === 'view-figma-btn'">
      <button mat-raised-button class="blue-button h-25" (click)="viewFigma()">
        View Figma
      </button>
    </div>
    <div *ngIf="params.type === 'change-logs-btn'">
      <!-- <button mat-raised-button class="blue-button h-25" (click)="changeLog()">
        Change Logs
      </button> -->
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
  constructor(public router: Router, public dialog: MatDialog,private store: Store,private changeDetector: ChangeDetectorRef) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }
  deleteRow() {
    let rowData = [];
    this.params.api.forEachNode(node => rowData.push(node.data));
    const index = this.params.node.rowIndex;
    let newData = [];
    newData = rowData.splice(index, 1);
    this.params.api.applyTransaction({ remove: newData });
  }

  navigateTo(e) {
    this.params.onClick(this.params);
  }

  selectCounterParties(params){
    let updatedRow = { ...Object.assign({}, params.data) };
    updatedRow = this.formatRowData(updatedRow,params);
    // Update the store
    this.store.dispatch(new EditLocationRow(updatedRow));
    params.node.setData(updatedRow);
}

setproductvalid(row, currentLocProdCount,paramsvalue){
  for (let index = 0; index < currentLocProdCount; index++) {
    if(paramsvalue){
      let indx = index +1;
      let val = "checkProd" + indx;
      row[val] = false;
    }else{
      let indx = index +1;
      let val = "checkProd" + indx;
      row[val] = true;
    }
  }
  return row
}
  formatRowData(row, params) {
  //  alert(4); 
    let row1
    this.store.subscribe(({ spotNegotiation }) => {
      let Currentproduct = spotNegotiation.locations;
      let currentLocProd= Currentproduct.filter(row2 => row2.locationId == row.locationId);
      if(currentLocProd.length != 0){
        let currentLocProdCount = currentLocProd[0].requestProducts.length;

        row1 = { ...Object.assign({}, row) };      
        if(params.value){
          row1.isSelected = false;
          row1 = this.setproductvalid(row1,currentLocProdCount,params.value)
          
        }else{
          row1.isSelected = true;
          row1 = this.setproductvalid(row1,currentLocProdCount,params.value)
        }
      }
    });
    return row1;
  }
  viewFigma() {
    const figmaLink = this.params.value;
    this.router.navigate([]).then(result => {
      window.open(figmaLink, '_blank');
    });
  }
}
