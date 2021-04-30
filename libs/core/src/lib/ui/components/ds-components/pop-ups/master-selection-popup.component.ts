import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridOptions } from "ag-grid-community";

@Component({
    selector: 'master-search-popup',
    template:
        `
      <div class="inventory-report-popup">
  <div class="header">
    <div class="title">Inventory Report 29 Aug</div>
    <div class="header-btn">
      <button class="blue-button h-25">Load</button>
      <button class="blue-button h-25">Confirm</button>
      <span class="seperator-line"></span>
      <span class="close" style="cursor:pointer;" [mat-dialog-close]="true"></span>
    </div>
   </div>
  <mat-dialog-content>
  <ag-grid-angular id="tradelistgrid" style="height: calc(100vh - 156px);"
      [gridOptions]="dialog_gridOptions"  
      class="ag-theme-material angular-v9">
  </ag-grid-angular> 
  <app-footer-v2 class="footer-popup" [id]="'inv-report-popup'"  [singleGrid]="true" [doublePagination]="true" [rowCount]="rowCount" [maxSize]="7"></app-footer-v2>  
</mat-dialog-content>
  </div>
    `,
})
export class MasterSelectionDialog {

    public dialog_gridOptions: GridOptions;
    public rowCount: Number;
    public hoverRowDetails =
        [
            { label: "Day Opening Balance", value: "5000 MT" },
            { label: "In", value: "3000 MT" },
            { label: "Out", value: "-5000 MT" },
            { label: "Transfer Out", value: "-2000 MT" },
            { label: "Transfer In", value: "0 MT" },
            { label: "Gain", value: "20 MT" },
            { label: "Loss", value: "0 MT" },
            { label: "Adj In", value: "0 MT" },
            { label: "Adj Out", value: "0 MT" },
            { label: "Day Closing Balance", value: "1020 MT" }
        ];
    ngOnInit() {
    }
    constructor(private router: Router,
        public dialogRef: MatDialogRef<MasterSelectionDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dialog_gridOptions = <GridOptions>{
            defaultColDef: {
                filter: true,
                sortable: true,
                resizable: true
            },
            columnDefs: this.columnDefs,
            suppressRowClickSelection: true,
            headerHeight: 30,
            rowHeight: 30,
            // groupIncludeTotalFooter: true,
            onGridReady: params => {
                this.dialog_gridOptions.api = params.api;
                this.dialog_gridOptions.columnApi = params.columnApi;
                this.dialog_gridOptions.api.sizeColumnsToFit();
                this.dialog_gridOptions.api.setRowData(this.rowData);
                this.rowCount = this.dialog_gridOptions.api.getDisplayedRowCount();
            },
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': '500', 'font-size': '20px' };
                }
            },
            onColumnResized: function (params) {
                if (params.columnApi.getAllDisplayedColumns().length <= 5 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
                    params.api.sizeColumnsToFit();
                }
            }
        };
    }
    tankSummary() {
        //this.dialogRef.close();
        this.router.navigate([]).then(result => {  window.open('opsinventory/tankSummary', '_blank'); });
        //this.router.navigate(['opsinventory/tankSummary']);
    }
    public columnDefs = [
        {
            headerName: "Tank Name",
            headerTooltip: "Tank Name",
            field: "tankname",
            width: 175,
            cellClass: ["aggridtextalign-left"]
        },
        {
            headerName: "Location",
            headerTooltip: "Location",
            field: "location",
            width: 150,
            cellClass: ["aggridtextalign-left"]
        },
        {
            headerName: "Product",
            headerTooltip: "Product",
            field: "product",
            width: 150,
            cellClass: ["aggridtextalign-left"]
        },
        {
            headerName: "UOM",
            headerTooltip: "UOM",
            field: "uom",
            width: 75,
            cellClass: ["aggridtextalign-left"]
        },
        {
            headerName: "Terminal Balance",
            headerTooltip: "Terminal Balance",
            field: "terminalbalance",
            type: 'numericColumn',
            width: 150,
            valueFormatter: this.numberFormatter,
            cellClass: ["aggridtextalign-right"]
        },
        {
            headerName: "System Balance",
            headerTooltip: "System Balance",
            field: "systembalance",
            width: 150,
            valueFormatter: this.numberFormatter,
            // cellClass: ["aggridtextalign-right aggridlink"],
            type: 'numericColumn',
            cellClass: ["hoverdisable hover-cell-menu-icon"]

        },
        {
            headerName: "Difference",
            headerTooltip: "Difference",
            field: "difference",
            type: 'numericColumn',
            valueFormatter: this.numberFormatter,
            width: 150,
            cellClass: ["aggridtextalign-right"]
        },
        {
            headerName: "Difference Type",
            headerTooltip: "Difference Type",
            field: "differencetype",
            width: 150,
            cellClass: ["aggridtextalign-left"]
        },

    ];

    public numberFormatter(params) {
        if (isNaN(params.value))
            return params.value;
        else
            return params.value.toFixed(4);
    }

    private rowData = [
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        },
        {
            tankname: 'Tank-1 LongBeach', location: 'LongBeach', product: 'Ethanol', uom: 'BBL', terminalbalance: '10,000', systembalance: '12,000', difference: '-2,000', differencetype: 'Loss'
        }
    ];

    closeDialog() {
        this.dialogRef.close();
    }

}

export enum masterURLenums {
    paymentCompany = 'https://euw-sh-int-bvt-api.azurewebsites.net/Shiptech10.Api.Masters/api/masters/companies/list',
    mock = 'Mock',
    mixed = 'Mixed'
  }