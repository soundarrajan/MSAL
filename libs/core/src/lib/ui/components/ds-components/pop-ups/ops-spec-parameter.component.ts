import { Component, OnInit, Inject } from '@angular/core';
import { GridOptions } from "ag-grid-community";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AGGridCellActionsComponent } from '../ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from '../ag-grid/ag-grid-cell-editable.component';

@Component({
    selector: 'ops-spec-parameter-dialog',
    template:
        `
      <div class="header-container">
        <div class="title">Spec Parameter</div>
        <div class="popup-close-icon"  [mat-dialog-close]="true"></div>
      </div>
      <div>
        <mat-dialog-content>
          <ag-grid-angular domLayout='autoHeight' style="width: 100%;height: 100%;" [gridOptions]="dialog_gridOptions" class="ag-popupgrid-v2 ag-theme-material angular-v9">
          </ag-grid-angular>
        </mat-dialog-content>
      </div>
      <div>
        <mat-dialog-actions align="end">
            <button class="save-action-btn" [mat-dialog-close]="true">
                <span>Save</span>
            </button>
        </mat-dialog-actions>
      </div>
    `,
})
export class OpsSpecParameterDialog {

    public dialog_gridOptions: GridOptions;

    ngOnInit() {
    }
    constructor(
        public dialogRef: MatDialogRef<OpsSpecParameterDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dialog_gridOptions = <GridOptions>{
            defaultColDef: {
                filter: false,
                sortable: false,
                resizable: true
            },
            columnDefs: this.columnDefs,
            suppressRowClickSelection: true,
            headerHeight: 30,
            rowHeight: 28,
            onGridReady: params => {
                this.dialog_gridOptions.api = params.api;
                this.dialog_gridOptions.columnApi = params.columnApi;
                this.dialog_gridOptions.api.sizeColumnsToFit();
                this.dialog_gridOptions.api.setRowData(this.rowData);
                this.addCustomHeaderEventListener(params);
            },
            onColumnResized: function (params) {
                if (params.columnApi.getAllDisplayedColumns().length <= 8 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
                    params.api.sizeColumnsToFit();
                }
            }
        };
    }
    addCustomHeaderEventListener(params) {
        let addButtonElement = document.getElementsByClassName('add-btn-popup');
        addButtonElement[0].addEventListener('click', (event) => {
            params.api.applyTransaction({
                add: [{
                    specParam: 'TAN', minmax: 'Min', minimum: '0', maximum: '0', uom: "MT",
                }]
            });
        });

    }
    public columnDefs = [
        {
            resizable: false,
            width: 30,
            suppressMenu: true,
            headerName: "",
            headerClass: ['aggridtextalign-center'],
            headerComponentParams: {
                template: `<span  unselectable="on">
                   <div class="add-btn-popup"></div>
                   <span ref="eMenu"></span>`
            },
            cellClass: ['aggridtextalign-left'],
            cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon' }
        },
        {
            headerName: 'Spec Parameter', headerTooltip: 'Spec Parameter', field: 'specParam', cellClass: ['editable-cell'],
            cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'spec-parameter' }
        },
        {
            headerName: 'Min/Max', headerTooltip: 'Min/Max', width: 100, field: 'minmax', cellClass: ['editable-cell'],
            cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'cost-type', items: ['Min', 'Max'] }
        },
        {
            headerName: 'Minimum', headerTooltip: 'Minimum', width: 150, field: 'minimum', cellClass: ['aggridtextalign-right editable-cell cell-align'], type: 'numericColumn', editable: true, singleClickEdit: true
        },
        {
            headerName: 'Maximum', headerTooltip: 'Maximum', width: 150, field: 'maximum', cellClass: ['aggridtextalign-right editable-cell cell-align'], type: 'numericColumn', editable: true, singleClickEdit: true
        },
        { headerName: 'UOM', headerTooltip: 'UOM', width: 100, field: 'uom', editable: true, singleClickEdit: true, cellClass: ['editable-cell'] }
    ];

    private rowData = [
        {
            specParam: 'TAN', minmax: 'Min', minimum: 0, maximum: 5, uom: "MT"
        },
        {
            specParam: 'TAN', minmax: 'Min', minimum: 0, maximum: 5, uom: "MT"
        },
        {
            specParam: 'TAN', minmax: 'Min', minimum: 0, maximum: 5, uom: "MT"
        },
        {
            specParam: 'TAN', minmax: 'Min', minimum: 0, maximum: 5, uom: "MT"
        }
    ]

}