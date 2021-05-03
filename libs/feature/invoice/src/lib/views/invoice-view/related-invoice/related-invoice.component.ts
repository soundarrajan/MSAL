import { Component, OnInit } from '@angular/core';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-renderer.component';
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
      "order-number":"1234",
      "type":"Final",
      "date":"12-01-2021",
      "amount":"120000",
      "deductions":"1000",
      "paid":"100000",
      "status":"Approved"
  },
    {
      "id": "123",
      "order-number":"1234",
      "type":"Provisional",
      "date":"12-01-2021",
      "amount":"120000",
      "deductions":"1000",
      "paid":"100000",
      "status":"New"
  },
    {
      "id": "123",
      "order-number":"1234",
      "type":"Credit",
      "date":"12-01-2021",
      "amount":"120000",
      "deductions":"1000",
      "paid":"100000",
      "status":"Approved"
  },
    {
      "id": "123",
      "order-number":"1234",
      "type":"Debit",
      "date":"12-01-2021",
      "amount":"120000",
      "deductions":"1000",
      "paid":"100000",
      "status":"Reverted"
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
    { headerName: 'Invoice ID', headerTooltip: 'Invoice ID', field: 'id', width: 100, cellClass: ['aggridlink aggridtextalign-center'], headerClass: ['aggrid-text-align-c'] },
    { headerName: 'Order number', headerTooltip: 'Order number', field: 'order-number', cellClass: ['aggridtextalign-left'] },
    {
      headerName: 'Invoice Type', headerTooltip: 'Invoice Type', field: 'type'
    },
    {
      headerName: 'Invoice Date', headerTooltip: 'Invoice Date', field: 'date', width: 150, 
    },
    {
      headerName: 'Invoice Amt', headerTooltip: 'Invoice Amt', field: 'amount', width: 150, 
    },
    {
      headerName: 'Deductions', headerTooltip: 'Deductions', field: 'deductions', width: 150, 
    },
    {
      headerName: 'Paid Amount', headerTooltip: 'Paid Amount', field: 'paid',  width: 150,
    },
    { headerName: 'Invoice status', headerTooltip: 'Invoice status', field: 'status',
        cellRendererFramework:AGGridCellRendererComponent, cellRendererParams: function(params) {
          var classArray:string[] =[];
            classArray.push('aggridtextalign-center');
            let newClass= params.value==='Reverted'?'custom-chip-type1 red-chip':
                          params.value==='Approved'?'custom-chip-type1 mediumgreen':
                          params.value==='New'?'custom-chip-type1 dark':
                          'custom-chip-type1';
                          classArray.push(newClass);
            return {cellClass: classArray.length>0?classArray:null} }}
  ];


}
