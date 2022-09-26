import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { Router } from "@angular/router";
import { AGGridMultiDataRendererComponent } from '../../../core/ag-grid-renderers/ag-grid-multi-data-renderer.component';
import { AGGridCellLinkRenderer } from '../../../core/ag-grid-renderers/ag-grid-cell-link-renderer.component';
import { LocalService } from '../../../services/local-service.service';

@Component({
  selector: 'app-contract-request-details',
  templateUrl: './contract-request-details.component.html',
  styleUrls: ['./contract-request-details.component.scss']
})
export class ContractRequestDetailsComponent implements OnInit {
  public switchTheme: boolean = true;
  public theme = false;
  public gridOptions_data: GridOptions;
  public rowCount: Number;
  public rowSelection;
  public newScreen: boolean = true;
  public rowData_aggrid1 = [];

  ngOnInit(): void {
    this.localService.setTheme(this.theme);
  }
  ngOnChanges() {
    this.getGridData();
  }
  mainPage(id) {
    if (this.router.url.includes("buyer"))
      this.router.navigate(['shiptech/contractnegotiation/buyer/details', id]);
    else if (this.router.url.includes("approver")) {
      this.router.navigate(['shiptech/contractnegotiation/approver/details', id]);
    }
  }

  filterList = {
    filters: [
      {
        name: 'Default',
        count: '9',
        defaultFilter: true,
        selected: true,
        pinned: true,
        position: 0
      },
      {
        name: 'All',
        count: '12',
        defaultFilter: false,
        selected: false,
        pinned: true,
        position: 1
      }
    ],
    enableMoreFilters: true,
    multiSelect: false
  }

  constructor(public dialog: MatDialog, public router: Router, private localService: LocalService) {
    this.rowSelection = 'single';
    this.gridOptions_data = <GridOptions>{
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      columnDefs: this.columnDef_aggrid,
      suppressCellSelection: true,
      headerHeight: 30,
      // rowHeight: 35,
      animateRows: true,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        //this.gridOptions_data.api.setRowData(this.rowData_aggrid);
        this.gridOptions_data.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions_data.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
        this.getGridData();
      },
      getRowHeight(params) {
        let c = 0;
        c = params.data.Locations.reduce((sum, value) => {
          return (sum + value.Products.length);
        }, 0)
        let m = params.data.Locations.reduce((sum, value) => {
          return (sum + (value.Products.length > 1 ? value.Products.length : 0));
        }, 0)
        if (c > 0)
          return ((c * 35) - (m * 7));
        else
          return (35);
      },
      onColumnResized: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
          //params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();

        }
      },
      frameworkComponents: {
        cellLinkRenderer: AGGridCellLinkRenderer
      }
    }

  }

  getGridData() {

    this.localService.getContractNegoRequestDetailsJSON('10001').subscribe((res: any) => {
      this.rowData_aggrid1 = res;
      this.gridOptions_data.api.setRowData(this.rowData_aggrid1)
    })
  }

  private columnDef_aggrid = [
    {
      headerName: 'Request ID', headerTooltip: 'Request ID', field: 'RequestId', width: 100, cellClass: ['aggridlink'], cellStyle: { 'padding-left': '15px' },
      cellRenderer: "cellLinkRenderer", cellRendererParams: { onClick: this.mainPage.bind(this) }
    },
    {
      headerName: 'Created Date', headerTooltip: 'Created Date', field: 'CreatedDate', width: 120, cellStyle: { 'padding-left': '15px' }
    },
    {
      headerName: 'Status', headerTooltip: 'Status', field: 'Status', width: 80,
      cellRenderer: function (params) {
        return `<div class="status-circle"><span class="circle ` + params.value + `"></span>` + params.value + `</div>`;
      }
    },
    {
      headerName: 'Buyer', headerTooltip: 'Buyer', field: 'Buyer', width: 120
    },
    {
      headerName: 'Start Date', headerTooltip: 'Start Date', field: 'StartDate', width: 120
    },
    {
      headerName: 'End Date', headerTooltip: 'End Date', field: 'EndDate', width: 120, cellClass: ['thick-right-border']
    },
    {
      headerName: 'Location', headerTooltip: 'Location', field: 'LocationName', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data border-left'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'LocationName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        //return params.data.data[0].type;
        return params.data.Locations;
      }
    },
    {
      headerName: 'Product', headerTooltip: 'Product', field: 'ProductName', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data thick-right-border border-right'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'ProductName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        //return params.data.data[0].type;
        return params.data.Locations;
      }
    },
    {
      headerName: 'Offers', headerTooltip: 'Offers', field: 'Offers', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'Offers', type: 'text' },
      valueGetter: function (params) {
        //return params.data.data[0].type;
        return params.data.Locations;
      }
    },
    {
      headerName: 'Awaiting app.', headerTooltip: 'Awaiting app.', field: 'AwaitingApproval', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      //cellRendererFramework: AGGridCellRendererV2Component, cellRendererParams: { label: 'circle', type: 'chip-bg', cellClass: ['chip-circle await'] }
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'AwaitingApproval', cellClass: 'chip-circle await' },
      valueGetter: function (params) {
        //return params.data.data[0].type;
        return params.data.Locations;
      }
    },
    {
      headerName: 'Approved', headerTooltip: 'Approved', field: 'Approved', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      //cellRendererFramework: AGGridCellRendererV2Component, cellRendererParams: { label: 'circle', type: 'chip-bg', cellClass: ['chip-circle approve'] }
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'Approved', cellClass: 'chip-circle approve' },
      valueGetter: function (params) {
        //return params.data.data[0].type;
        return params.data.Locations;
      }
    },

    {
      headerName: 'Rejected', headerTooltip: 'Rejected', field: 'Rejected', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      //cellRendererFramework: AGGridCellRendererV2Component, cellRendererParams: { label: 'circle', type: 'chip-bg', cellClass: ['chip-circle reject'] }
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'Rejected', cellClass: 'chip-circle reject' },
      valueGetter: function (params) {
        //return params.data.data[0].type;
        return params.data.Locations;
      }
    },
    {
      headerName: 'Contract Created', headerTooltip: 'Contract Created', field: 'ContractCreated', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      //cellRendererFramework: AGGridCellRendererV2Component, cellRendererParams: { label: 'circle', type: 'chip-bg', cellClass: ['chip-circle create'] }
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'ContractCreated', cellClass: 'chip-circle create' },
      valueGetter: function (params) {
        //return params.data.data[0].type;
        return params.data.Locations;
      }
    },

  ];

  public rowData_aggrid = [
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '4', approved: '', rejected: '', contractCreated: '2'
    },
    {
      requestID: '1232', requestDate: '12/02/2022', status: 'Closed', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' },
      { location: 'Rotterdam', product: '', offers: '10' }],
      awaitingapp: '', approved: '2', rejected: '', contractCreated: ''
    },
    {
      requestID: '1233', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' },
      { location: '', product: 'RMK350', offers: '' }],
      awaitingapp: '', approved: '', rejected: '2', contractCreated: '2'
    },
    {
      requestID: '1234', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '4', approved: '', rejected: '', contractCreated: '2'
    },
    {
      requestID: '1235', requestDate: '12/02/2022', status: 'Closed', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' },
      { location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '2', rejected: '', contractCreated: ''
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '', rejected: '2', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '4', approved: '', rejected: '', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Closed', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' },
      { location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '2', rejected: '', contractCreated: ''
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '', rejected: '2', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '4', approved: '', rejected: '', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Closed', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' },
      { location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '2', rejected: '', contractCreated: ''
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '', rejected: '2', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '4', approved: '', rejected: '', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Closed', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' },
      { location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '2', rejected: '', contractCreated: ''
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '', rejected: '2', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '4', approved: '', rejected: '', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Closed', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' },
      { location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '2', rejected: '', contractCreated: ''
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '', rejected: '2', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '4', approved: '', rejected: '', contractCreated: '2'
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Closed', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' },
      { location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '2', rejected: '', contractCreated: ''
    },
    {
      requestID: '1231', requestDate: '12/02/2022', status: 'Open', buyer: 'San Anderson', startDate: '01/07/2022', endDate: '31/12/2022',
      data: [{ location: 'Amsterdam', product: 'RMK850', offers: '10' }],
      awaitingapp: '', approved: '', rejected: '2', contractCreated: '2'
    },

  ]

  onResize(event) {
    this.gridOptions_data.api.sizeColumnsToFit();
  }

}
