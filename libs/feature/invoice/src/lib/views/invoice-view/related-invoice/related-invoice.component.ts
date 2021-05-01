import { Component, OnInit } from '@angular/core';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'shiptech-related-invoice',
  templateUrl: './related-invoice.component.html',
  styleUrls: ['./related-invoice.component.css']
})
export class RelatedInvoiceComponent implements OnInit {
  public gridOptions_data: GridOptions;
  rowData_aggrid: any = [
    {
      "id": "123",
      "name": "Transfer Movements - Transfer Tab"
  },
  {
      "id": "124",
      "name": "Transfer Movements - Inter Transfer Tab"
  },
  {
      "id": "125",
      "name": "Delivery Movements - Inventory Tab"
  },
  {
      "id": "126",
      "name": "Delivery Movements - B2B Tab"
  },
  {
      "id": "127",
      "name": "Movements - Full Screen"
  }
  ];
  constructor() {
    this.setupGrid();
   }

  ngOnInit(): void {
    
  }

  setupGrid(){
    this.gridOptions_data = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      animateRows: false,

      onGridReady: (params) => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.setRowData(this.rowData_aggrid);
        this.gridOptions_data.api.sizeColumnsToFit();  
        params.api.sizeColumnsToFit();     

      },
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },

      onColumnResized: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 11 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 11) {
          params.api.sizeColumnsToFit();

        }
      }
    }
  }

  private columnDef_aggrid = [
    { headerName: 'ID', headerTooltip: 'ID', field: 'id', width: 100, cellClass: ['aggridtextalign-center'], headerClass: ['aggrid-text-align-c'] },
    { headerName: 'Name', headerTooltip: 'Name', field: 'name', cellClass: ['aggridtextalign-left'] },
    {
      headerName: '', headerTooltip: '', field: 'download-json', cellClass: ['aggridlink aggridtextalign-center'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: {
        type: 'download-json-btn'
      }
    },
    {
      headerName: '', headerTooltip: '', field: 'view', width: 150, cellClass: ['aggridlink aggridtextalign-center'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: {
        type: 'view-link'
      }
    },
    {
      headerName: '', headerTooltip: '', field: 'edit', width: 150, cellClass: ['aggridlink aggridtextalign-center'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: {
        type: 'edit-link'
      }
    },
    {
      headerName: '', headerTooltip: '', field: 'copy', width: 150, cellClass: ['aggridlink aggridtextalign-center'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: {
        type: 'copy-link'
      }
    },
    {
      headerName: '', headerTooltip: '', field: 'delete',  width: 150, cellClass: ['aggridlink aggridtextalign-center'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: {
        type: 'delete-link'
      }
    },
  ];


}
