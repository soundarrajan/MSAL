import { Component, OnInit, Inject } from '@angular/core';
import { GridOptions } from "ag-grid-community";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'volume-quantity-dialog',
    template:
        `
      <div class="header-container">
        <div class="title">Operational Gain or Loss Calculation</div>
        <div class="popup-close-icon"  [mat-dialog-close]="true"></div>
      </div>
      <div>
        <mat-dialog-content>
          <ag-grid-angular domLayout='autoHeight' style="width: 100%;height: 100%;" [gridOptions]="dialog_gridOptions" class="ag-popupgrid-v2 ag-theme-material angular-v9">
          </ag-grid-angular>
        </mat-dialog-content>
      </div>
    `,
})
export class OperationalAmountDialog {

    public dialog_gridOptions: GridOptions;
    ngOnInit() {
    }
    constructor(
        public dialogRef: MatDialogRef<OperationalAmountDialog>,
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
            rowHeight: 25,
            // groupIncludeTotalFooter: true,
            onGridReady: params => {
                this.dialog_gridOptions.api = params.api;
                this.dialog_gridOptions.columnApi = params.columnApi;
                this.dialog_gridOptions.api.sizeColumnsToFit();
                this.dialog_gridOptions.api.setRowData(this.rowData);
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
    public columnDefs = [
        {
            headerName: "Description",
            headerTooltip: "Description",
            field: "description",
            width: 100
        },
        {
            headerName: "Value",
            headerTooltip: "Value",
            field: "value",
            type: 'numericColumn',
            width: 50,
            valueFormatter: this.numberFormatter
        }
    ];

    public numberFormatter(params) {
        // params.data - full row data
        // params.value - cell value
        if (isNaN(params.value))
            return params.value;
        else
            return params.value.toFixed(4);
    }
    private rowData = [
        {
            description: 'Executed Qty (in GAL) from multiple Documents',
            value: 1000.0000
        },
        {
            description: 'Invoiced Qty (in GAL) from BL',
            value: 1000.0000
        },
        {
            description: 'Operational Qty (in GAL)',
            value: 1000.0000
        },
        {
            description: 'Per Unit Price (in USD per GAL)',
            value: 1000.0000
        },
        {
            description: 'Operational Value (in USD)',
            value: 1000.0000
        },
        {
            description: 'Operational Value (in USD - Acct Rate)',
            value: 1000.0000
        },
        {
            description: 'Operational Value (in USD - Mkt Rate)',
            value: 1000.0000
        }
    ]

}