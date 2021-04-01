import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit {

  public gridOptions: GridOptions;
  public colResizeDefault;
  public rowCount: Number;
  public date = new FormControl(new Date());

  constructor() {
    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      //enableColResize: true,
      //enableSorting: true,
      animateRows: true,
      headerHeight: 40,
      rowHeight:40,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        suppressSizeToFit: false,
        resizable:true
      },
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        this.gridOptions.api.setRowData(this.rowData);
        this.gridOptions.api.sizeColumnsToFit(); 
        this.rowCount = this.gridOptions.api.getDisplayedRowCount();

      },
      onColumnResized: function (params) {
      },
      onColumnVisible: function (params) {
      },
      onColumnPinned: function (params) {
      },
      onGridSizeChanged: function (params) {
        params.api.sizeColumnsToFit();
      }
    };
  }

  ngOnInit() {
    
  }

  private columnDefs = [
    { headerName: 'Entity Name', headerTooltip: 'Entity Name', field: 'entityname',width:160 ,cellClass:['font-bold aggrid-content-c']},
    { headerName: 'Event Type', field: 'eventtype', headerTooltip: 'Event Type',width:160,cellClass:['aggrid-content-c']  },
    { headerName: 'Field Name', field: 'fieldname', headerTooltip: 'Field Name',width:160,cellClass:['aggrid-content-c']   },
    { headerName: 'New Value', headerTooltip: 'New Value', field: 'newvalue',cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'] },
    { headerName: 'Old Value', headerTooltip: 'Old Value', field: 'oldvalue',cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'] },
    { headerName: 'User Name', headerTooltip: 'User Name', field: 'username',cellClass:['aggrid-content-c'],width:160  },
    { headerName: 'Date', headerTooltip: 'Date', field: 'date',cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'] }
  ];

  private rowData = [
    {
      entityname: 'Current ROB', eventtype: 'Add', newvalue: '3000', fieldname: 'LSDIS', oldvalue: 'NA', username: 'Rowena@inatech.com', date: '10/10/2019 11:27'
    },
    {
      entityname: 'Unpumpable', eventtype: 'Add', newvalue: '40', fieldname: 'HSFO', oldvalue: 'NA', username: 'Yusus@inatech.com', date: '10/10/2019 11:27'
    },
    {
      entityname: 'Unpumpable', eventtype: 'Delete', newvalue: 'NA', fieldname: 'HSDIS', oldvalue: '32l', username: 'Pooja@inatech.com', date: '10/10/2019 11:27'
    },
    {
      entityname: 'Unpumpable', eventtype: 'Edit', newvalue: '20', fieldname: 'ULSFO', oldvalue: '25', username: 'Yusus@inatech.com', date: '10/10/2019 11:27'
    }


  ];
}
