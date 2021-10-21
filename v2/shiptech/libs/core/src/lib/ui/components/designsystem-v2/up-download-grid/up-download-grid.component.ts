import { Component, OnInit, ViewChild, ElementRef, Input, } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellEditableComponent } from '../ag-grid/ag-grid-cell-editable.component';
import { AGGridCellActionsComponent } from '../ag-grid/ag-grid-cell-actions.component';

@Component({
  selector: 'app-up-download-grid',
  templateUrl: './up-download-grid.component.html',
  styleUrls: ['./up-download-grid.component.css']
})
export class UpDownloadGridComponent implements OnInit {

  public gridOptions_data: GridOptions;
  @Input() files: any = [];
  constructor() {
    this.gridOptions_data = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: true
      },
      columnDefs: this.columnDef_grid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      animateRows: false,
      onGridReady: (params) => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_grid);

      },
      onColumnResized: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();

        }
      }
    }
  }

  ngOnInit(): void {
  }

  uploadDocument(doc, doctype) {
    var lastfile = doc[doc.length - 1];
    var file = lastfile.name.split(".");;
    let filename = file[0];
    let fileformat = file[1].toUpperCase();;
    this.gridOptions_data.api.applyTransaction({
      add: [{
        doc_name: filename, doc_type: doctype, format: fileformat, upload_by: 'Alexander James', date: '12/09/2020', remarks: 'modified contract on 12/09/2020', download: ""
      }]
    });
  }

  private columnDef_grid = [
    {
      resizable: false,
      width: 20,
      suppressMenu: true,
      headerClass: ['aggridtextalign-center'],
      headerName: "",
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon' }
    },
    { headerName: 'Document Name', headerTooltip: 'Document Name', field: 'doc_name' },
    { headerName: 'Document Type', headerTooltip: 'Document Type', field: 'doc_type' },
    { headerName: 'Format', width: 120, headerTooltip: 'Format', field: 'format' },
    { headerName: 'Uploaded by', headerTooltip: 'Uploaded by', field: 'upload_by' },
    { headerName: 'Date uploaded', headerTooltip: 'Date Uploaded', field: 'date' },
    { headerName: 'Remarks', headerTooltip: 'Remarks', field: 'remarks' },
    {
      headerName: 'Download', suppressMenu: true, sortable: false, width: 100, headerTooltip: 'Download', field: 'download', headerClass: ['pd-0'], cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'download' }
    },

  ];

  private rowData_grid = [

    {
      doc_name: 'Sept contract', doc_type: 'Contract Document', format: 'PDF', upload_by: 'Alexander James', date: '12/09/2020', remarks: 'modified contract on 12/09/2020', download: ""
    },
    {
      doc_name: 'Sept contract', doc_type: 'Contract Document', format: 'PDF', upload_by: 'Alexander James', date: '12/09/2020', remarks: 'modified contract on 12/09/2020', download: ""
    }
  ]

}
