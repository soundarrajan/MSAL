import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'ag-grid-cell-renderer',
  template: `
    <div *ngIf="params.type === 'dark-border-cell'">
      <div class="border-cell">
        {{ params.value }}
      </div>
    </div>
  `
})
export class AGGridCellRendererV2Component implements ICellRendererAngularComp {
  @ViewChild('inputSection') inputSection: ElementRef;
  @ViewChild('menuTriggerHover') menuTriggerHover: MatMenuTrigger;

  public showDollar: boolean = false;
  public params: any;
  public select = '$';
  public inputValue = '';
  public ispriceCalculated: boolean = true;
  public showFormula: boolean = false;
  public editCell: boolean;
  public myFormGroup;
  public editSeller: boolean = true;
  public editedSeller = '';
  public docVal = 'Document Uploaded';
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [
    { counterparty: 'Shell North America Division', selected: false },
    { counterparty: 'Shell North America Division', selected: false },
    { counterparty: 'Trefoil Oil and Sales', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false }
  ];

  frequencyArr = [
    { key: '$', abbriviation: 'USD' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' }
  ];
  constructor(public router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });
  }

  agInit(params: any): void {
    this.params = params;
  }

  hoverMenu(event) {
    event.target.classList.add('selectedIcon');
    this.menuTriggerHover.openMenu();
  }

  additionalcostpopup() {
    // const dialogRef = this.dialog.open(SpotnegoAdditionalcostComponent, {
    //   width: '1170px',
    //   height: '450px',
    //   panelClass: 'additional-cost-popup'
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   this.showDollar = true;
    // });
  }
  sellerratingpopup() {
    // const dialogRef = this.dialog.open(SellerratingpopupComponent, {
    //   width: '1164px',
    //   height: '562px',
    //   panelClass: 'additional-cost-popup'
    // });
    // dialogRef.afterClosed().subscribe(result => {});
  }

  openEmailPreview() {}

  contactinformationpopup() {
    // const dialogRef = this.dialog.open(ContactinformationpopupComponent, {
    //   width: '1194px',
    //   minHeight: '446px',
    //   panelClass: ['additional-cost-popup', 'supplier-contact-popup']
    // });
    // dialogRef.afterClosed().subscribe(result => {});
  }

  suppliercommentspopup() {
    // const dialogRef = this.dialog.open(SupplierCommentsPopupComponent, {
    //   width: '672px',
    //   minHeight: '540px',
    //   panelClass: ['additional-cost-popup', 'supplier-contact-popup']
    // });
    // dialogRef.afterClosed().subscribe(result => {});
  }

  requestChange(e, params) {
    // const dialogRef = this.dialog.open(SpotnegoRequestChangesComponent, {
    //   width: '1164px',
    //   panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class']
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   e.target.parentElement.classList.add('active');
    //   this.inputValue = '560.19';
    //   const itemsToUpdate = [];
    //   const rowData = [];
    //   params.api.forEachNodeAfterFilterAndSort(function(rowNode, index) {
    //     if (!rowNode.isSelected() === true) {
    //       return;
    //     }
    //     const data = rowNode.data;
    //     data.tPr = '$560.19';
    //     data.amt = '4,48,152.00';
    //     data.diff = '1.19';
    //     data.phySupplier = 'Same as seller';
    //     itemsToUpdate.push(data);
    //   });
    //   const res = params.api.applyTransaction({ update: itemsToUpdate });
    //   params.api.deselectAll(); //optional
    //   this.ispriceCalculated = false;
    //   this.showFormula = true;
    // });
  }
  pricingdetailspopup(e, params) {
    // const dialogRef = this.dialog.open(SpotnegoPricingDetailsComponent, {
    //   width: '1164px',
    //   panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class']
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   e.target.parentElement.classList.add('active');
    //   this.inputValue = '560.19';
    //   const itemsToUpdate = [];
    //   const rowData = [];
    //   params.api.forEachNodeAfterFilterAndSort(function(rowNode, index) {
    //     if (!rowNode.isSelected() === true) {
    //       return;
    //     }
    //     const data = rowNode.data;
    //     data.tPr = '$560.19';
    //     data.amt = '4,48,152.00';
    //     data.diff = '1.19';
    //     data.phySupplier = 'Same as seller';
    //     itemsToUpdate.push(data);
    //   });
    //   const res = params.api.applyTransaction({ update: itemsToUpdate });
    //   params.api.deselectAll(); //optional
    //   this.ispriceCalculated = false;
    //   this.showFormula = true;
    // });
  }

  onRightClickMenuOpened(e) {
    e.target.parentElement.classList.add('active');
  }
  onInputChange(e, params) {
    e.target.parentElement.classList.add('active');
    if (e.keyCode == 9) {
      const itemsToUpdate = [];
      params.api.forEachNodeAfterFilterAndSort(function(rowNode, index) {
        if (!rowNode.isSelected() === true) {
          return;
        }
        const data = rowNode.data;
        data.tPr = '$560.19';
        data.amt = '4,48,152.00';
        data.diff = '1.19';
        data.phySupplier = 'Same as seller';
        itemsToUpdate.push(data);
      });
      const res = params.api.applyTransaction({ update: itemsToUpdate });
      params.api.deselectAll(); //optional
    }
  }
  checkedHandler(event) {
    const checked = event.target.checked;
    const colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
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
  }
  selectSupplier(text) {
    this.editedSeller = text;
  }
}
