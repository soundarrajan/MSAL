import { Component, OnInit } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-requests-details',
  templateUrl: './requests-details.component.html',
  styleUrls: ['./requests-details.component.scss']
})
export class RequestsDetailsComponent implements OnInit {

  public gridOptions: GridOptions;
  public colResizeDefault;
  public rowCount: Number;
  public date = new FormControl(new Date());
  currentDate = new Date();
  selectedFromDate: Date = new Date(this.currentDate.setMonth((this.currentDate.getMonth())-3));
  selectedToDate: Date = new Date();

  constructor() {
    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      //enableColResize: true,
      //enableSorting: true,
      animateRows: true,
      headerHeight: 38,
      rowHeight: 50,
      groupHeaderHeight: 40,
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
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
        // if (params.columnApi.getAllDisplayedColumns().length <= 10 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
        //   params.api.sizeColumnsToFit();
        // }
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

  onDateChange(event) {
    console.log('selected date', event);
    
  }

  private columnDefs = [
    {
      headerName: 'Request ID', headerTooltip: 'Request ID', field: 'requestid', width: 100, headerClass: ['aggrid-text-align-c'],
      cellClass: function (params) {
        var classArray: string[] = ['aggrid-link', 'aggrid-content-c'];
        let newClass = params.data.status === 'Stemmed' ? 'aggrid-left-ribbon lightgreen' :
          params.data.status === 'New' ? 'aggrid-left-ribbon amber' :
            params.data.status === 'Inquired' ? 'aggrid-left-ribbon mediumpurple' :
              'aggrid-left-ribbon dark';
        classArray.push(newClass);
        return classArray.length > 0 ? classArray : null
      }
    },
    { headerName: 'Service', field: 'service', headerTooltip: 'Service', headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 100 },
    { headerName: 'Port', headerTooltip: 'Port', field: 'port', width: 100, cellClass: ['aggrid-content-c aggrid-column-splitter-left'] },
    { headerName: 'ETA', headerTooltip: 'ETA', field: 'eta', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    { headerName: 'ETD', headerTooltip: 'ETD', field: 'etd', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    {
      headerName: 'Fuel Grade', headerTooltip: 'Fuel Grade', width: 160, field: 'fuelgrade', cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'multiple-values' }, cellClass: ['aggrid-content-c aggrid-column-splitter-left'],
      valueGetter: function (params) {
        return params.data.fuelgrade;
      }
    },
    { headerName: 'Trader', field: 'trader', headerTooltip: 'Trader', width: 100, cellClass: ['aggrid-content-c aggrid-column-splitter-left'] },
    { headerName: 'Operator', field: 'operator', headerTooltip: 'Operator', width: 100, cellClass: ['aggrid-content-c'] },
    {
      headerName: 'Status', field: 'status', headerTooltip: 'Status', cellRendererFramework: AGGridCellRendererComponent, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'],
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        classArray.push('aggrid-content-center');
        let newClass = params.value === 'Stemmed' ? 'custom-chip lightgreen' :
          params.value === 'New' ? 'custom-chip amber' :
            params.value === 'Inquired' ? 'custom-chip mediumpurple' :
              '';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null }
      }
    },
    { headerName: 'Request Type', headerTooltip: 'Request Type', field: 'retype', width: 110, cellClass: ['aggrid-content-c'] },
  ];

  private rowData = [
    {
      requestid: '12819ED', service: 'IA4', vesselname: 'Guantemala Maersk', vesselid: '34R', newreq: 'Physical', port: 'Seattle', eta: '10/10/2019', etd: '10/10/2019', fuelgrade: ['RMK850'], trader: 'Europe Trader', operator: 'Macheal Chris', status: 'Stemmed', retype: 'BOPS'
    },
    {
      requestid: '13587ED', service: '22D', vesselname: 'Marchen Maersk', vesselid: '28S', newreq: 'Physical', port: 'Ningbo', eta: '10/10/2019', etd: '10/10/2019', fuelgrade: ['RMK850', 'RMK5005'], trader: 'New York City', operator: 'No Operator', status: 'Inquired', retype: 'Trader'
    },
    {
      requestid: '13587ED', service: '22D', vesselname: 'Marchen Maersk', vesselid: '28S', newreq: 'Physical', port: 'Ningbo', eta: '10/10/2019', etd: '10/10/2019', fuelgrade: ['RMK850', 'RMK5005'], trader: 'New York City', operator: 'No Operator', status: 'Inquired', retype: 'Trader'
    },
    {
      requestid: '56900GA', service: '90P', vesselname: 'Areana', vesselid: '43H', newreq: 'Physical', port: 'Shanghai', eta: '10/10/2019', etd: '10/10/2019', fuelgrade: ['RMK850', 'RMK5005', 'RMK850'], trader: 'East of Suez', operator: 'No Operator', status: 'New', retype: 'BOPS'
    },
    {
      requestid: '56900GA', service: '90P', vesselname: 'Areana', vesselid: '43H', newreq: 'Physical', port: 'Shanghai', eta: '10/10/2019', etd: '10/10/2019', fuelgrade: ['RMK850', 'RMK5005', 'RMK850'], trader: 'East of Suez', operator: 'No Operator', status: 'New', retype: 'BOPS'
    },
    {
      requestid: '12819ED', service: 'IA4', vesselname: 'Guantemala Maersk', vesselid: '34R', newreq: 'Physical', port: 'Seattle', eta: '10/10/2019', etd: '10/10/2019', fuelgrade: ['RMK850'], trader: 'Europe Trader', operator: 'Macheal Chris', status: 'Stemmed', retype: 'BOPS'
    },
    {
      requestid: '13587ED', service: '22D', vesselname: 'Marchen Maersk', vesselid: '28S', newreq: 'Physical', port: 'Ningbo', eta: '10/10/2019', etd: '10/10/2019', fuelgrade: ['RMK850', 'RMK5005'], trader: 'New York City', operator: 'No Operator', status: 'Inquired', retype: 'Trader'
    }

  ];
}
