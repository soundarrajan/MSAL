import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AGGridCellRendererComponent } from '../../ag-grid/ag-grid-cell-renderer.component';

@Component({
  selector: 'app-change-log-popup',
  templateUrl: './change-log-popup.component.html',
  styleUrls: ['./change-log-popup.component.css']
})
export class ChangeLogPopupComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public isdisplaydensityhigh: boolean = false;
  public rowCount: Number;
  rowData: any = [];

  ngOnInit() {}
  ngAfterViewInit() {
    //setTimeout(() => {
    this.rowData = this.data;
    //},10)
  }
  constructor(
    private router: Router,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ChangeLogPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialog_gridOptions = <GridOptions>{
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      columnDefs: this.columnDefs,
      suppressRowClickSelection: true,
      getRowHeight: params => {
        return this.isdisplaydensityhigh ? 48 : 25;
      },
      headerHeight: this.isdisplaydensityhigh ? 60 : 30,
      groupHeaderHeight: this.isdisplaydensityhigh ? 60 : 30,
      // groupIncludeTotalFooter: true,
      onGridReady: params => {
        this.dialog_gridOptions.api = params.api;
        this.dialog_gridOptions.columnApi = params.columnApi;
        this.dialog_gridOptions.api.sizeColumnsToFit();
        this.dialog_gridOptions.api.setRowData(this.rowData);
        this.rowCount = this.dialog_gridOptions.api.getDisplayedRowCount();
      },
      getRowStyle: function(params) {
        if (params.node.rowPinned) {
          return { 'font-weight': '500', 'font-size': '20px' };
        }
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 5 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  public columnDefs = [
    {
      headerName: 'Version',
      headerTooltip: 'Version',
      field: 'version',
      width: 175,
      cellClass: ['aggridtextalign-center'],
      headerClass: ['', 'aggrid-text-align-c']
    },
    {
      headerName: 'Date',
      headerTooltip: 'Date',
      field: 'date',
      cellClass: ['aggridtextalign-center'],
      headerClass: ['', 'aggrid-text-align-c'],
      width: 180,
      cellRendererFramework: AGGridCellRendererComponent,
      cellRendererParams: { cellClass: ['custom-chip dark'] }
    },
    {
      headerName: 'Change Description',
      headerTooltip: 'Change Description',
      field: 'description',
      width: 150,
      cellClass: ['aggridtextalign-left']
    }
  ];

  // private rowData = [

  //     {
  //         version: '1.0', date: '29 - Aug - 2020 17:32', description: 'change description'
  //     },
  //     {
  //       version: '1.1', date: '29 - Aug - 2020 17:32', description: 'change description'
  //     },
  //   {
  //     version: '1.2', date: '29 - Aug - 2020 17:32', description: 'change description'
  //   },

  // ];

  closeDialog() {
    this.dialogRef.close();
  }
}
