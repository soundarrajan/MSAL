import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { Router } from "@angular/router";
import { AGGridMultiDataRendererComponent } from '../../../core/ag-grid-renderers/ag-grid-multi-data-renderer.component';
import { AGGridCellLinkRenderer } from '../../../core/ag-grid-renderers/ag-grid-cell-link-renderer.component';
import { LocalService } from '../../../services/local-service.service';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';

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
    // this.getGridData();
  }
  mainPage(id) {
    this.router.navigate([`contract-negotiation/requests/${id}`]);
    /*this.router.navigate(['contract-request/request/0/details', id]);
    if (this.router.url.includes("buyer"))
      this.router.navigate(['shiptech/contractnegotiation/buyer/details', id]);
    else if (this.router.url.includes("approver")) {
      this.router.navigate(['shiptech/contractnegotiation/approver/details', id]);
    }*/
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


  dataSource: any = {
    getRows: async (params: any) => {
      let requestPayload = {
        "skip": 0,
        "take": 25,
        "filters": {
          "groupName": "string",
          "columnValue": "string",
          "columnType": 1,
          "conditionValue": "string",
          "values": [
            "string"
          ],
          "filterOperator": 0,
          "isComputedColumn": true,
          "precision": 0
        },
        "sortList": {
          "columnValue": "string",
          "sortIndex": 0,
          "sortParameter": 0,
          "isComputedColumn": true
        }
      }

      this.contractService.getContractRequestList(requestPayload)
        .subscribe(response => {
          params.successCallback(response);
        });
    }
  };

  constructor(public dialog: MatDialog, public router: Router, private localService: LocalService, private contractService: ContractNegotiationService) {
    this.rowSelection = 'single';
    this.gridOptions_data = <GridOptions>{
      rowModelType: 'serverSide',
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
        this.gridOptions_data.api.setServerSideDatasource(this.dataSource);
        this.gridOptions_data.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions_data.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
        this.getGridData();
      },
      getRowHeight(params) {
        let c = 0;
        c = params.data.locations.reduce((sum, value) => {
          return (sum + value.products.length);
        }, 0)
        let m = params.data.locations.reduce((sum, value) => {
          return (sum + (value.products.length > 1 ? value.products.length : 0));
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

    // this.localService.getContractNegoRequestDetailsJSON('10001').subscribe((res: any) => {
    //   this.rowData_aggrid1 = res;
    //   this.gridOptions_data.api.setRowData(this.rowData_aggrid1)
    // })
  }

  private columnDef_aggrid = [
    {
      headerName: 'Request ID', headerTooltip: 'Request ID', field: 'id', width: 100, cellClass: ['aggridlink'], cellStyle: { 'padding-left': '15px' },
      cellRenderer: "cellLinkRenderer", cellRendererParams: { onClick: this.mainPage.bind(this) }
    },
    {
      headerName: 'Created Date', headerTooltip: 'Created Date', field: 'createdOn', width: 120, cellStyle: { 'padding-left': '15px' }
    },
    {
      headerName: 'Status', headerTooltip: 'Status', field: 'status', width: 80,
      cellRenderer: function (params) {
        return `<div class="status-circle"><span class="circle ` + params.value + `"></span>` + params.value + `</div>`;
      }
    },
    {
      headerName: 'Buyer', headerTooltip: 'Buyer', field: 'buyer', width: 120
    },
    {
      headerName: 'Start Date', headerTooltip: 'Start Date', field: 'startDate', width: 120
    },
    {
      headerName: 'End Date', headerTooltip: 'End Date', field: 'endDate', width: 120, cellClass: ['thick-right-border']
    },
    {
      headerName: 'Location', headerTooltip: 'Location', field: 'locations', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data border-left'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'locationName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        console.log(params);
        return params.data.locations;
      }
    },
    {
      headerName: 'Product', headerTooltip: 'Product', field: 'productName', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data thick-right-border border-right'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'productName', type: 'chip-bg', cellClass: 'chip-rectangle' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Offers', headerTooltip: 'Offers', field: 'offers', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'offers', type: 'text' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Awaiting app.', headerTooltip: 'Awaiting app.', field: 'awaitingApproval', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'awaitingApproval', cellClass: 'chip-circle await' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Approved', headerTooltip: 'Approved', field: 'approved', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'approved', cellClass: 'chip-circle approve' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },

    {
      headerName: 'Rejected', headerTooltip: 'Rejected', field: 'rejected', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'rejected', cellClass: 'chip-circle reject' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },
    {
      headerName: 'Contract Created', headerTooltip: 'Contract Created', field: 'contracted', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center loop-data'], width: 120,
      cellRendererFramework: AGGridMultiDataRendererComponent,
      cellRendererParams: { label: 'contracted', cellClass: 'chip-circle create' },
      valueGetter: function (params) {
        return params.data.locations;
      }
    },

  ];

  onResize(event) {
    this.gridOptions_data.api.sizeColumnsToFit();
  }

}
