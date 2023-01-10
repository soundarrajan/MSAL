import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { ActivatedRoute } from "@angular/router";
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
@Component({
  selector: 'app-contract-nego-auditlog',
  templateUrl: './contract-nego-auditlog.component.html',
  styleUrls: ['./contract-nego-auditlog.component.scss']
})
export class ContractNegoAuditlogComponent implements OnInit {
  rowData_chat_grid: any[];
  onrowClicked: any;
  dateFormat: string;
  date: string;
  businessId: any;
  generalTenantSettings: any;
  public pageSize: number;
  public totalItems: number;
  listOfRequests: any;
  public gridOptions_nego_history: GridOptions;
  public gridOptions_chat_history: GridOptions;
  public theme:boolean=false;
  public overlayLoadingTemplate =
  '<span class="ag-overlay-loading-center" style="color:white;border-radius:20px; border: 2px solid #5C5C5B; background: #5C5C5B ;">Loading Rows...</span>';
public overlayNoRowsTemplate = '<span>No rows to show</span>';
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
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    tenantSettingsService: TenantSettingsService,
    private ContractNegotiationService: ContractNegotiationService,
    )
    { 
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.dateFormat = this.generalTenantSettings.tenantFormats.dateFormat.name;
    { 
      this.gridOptions_nego_history = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: true
      },
      columnDefs: this.columnDef_nego_grid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      animateRows: false,
      onGridReady: (params) => {
        this.gridOptions_nego_history.api = params.api;
        this.gridOptions_nego_history.columnApi = params.columnApi;
        params.api?.sizeColumnsToFit();
        this.gridOptions_nego_history?.api.showLoadingOverlay();
        },

      onColumnResized: function (params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 8 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api?.sizeColumnsToFit();
        }
      },
      onColumnVisible: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api?.sizeColumnsToFit();

        }
      }
    }

    this.gridOptions_chat_history = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: true
      },
      columnDefs: this.columnDef_chat_grid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      animateRows: false,
      onGridReady: (params) => {
        this.gridOptions_nego_history.api = params.api;
        this.gridOptions_nego_history.columnApi = params.columnApi;
        this.gridOptions_nego_history.api.sizeColumnsToFit();
        params.api.sizeColumnsToFit();
        this.gridOptions_nego_history.api.setRowData(this.rowData_chat_grid);

      },
    }
   }

 
  }
    ngOnInit(): void {
        this.businessId = this.route.snapshot.paramMap.get('requestId');
      console.log(this.businessId);
    }
  
  private columnDef_nego_grid = [
    { headerName: 'Date', headerTooltip: 'Date', tooltipField: 'date', field: 'date',width:200,suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
    { headerName: 'User', headerTooltip: 'User', tooltipField: 'user', field: 'user',width:200, suppressSizeToFit: false,cellClass:'aggrid-text-resizable',  },
    { headerName: 'Transaction Type', headerTooltip: 'Transaction Type', tooltipField: 'transactionType', field: 'transactionType',width:200 ,suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
    { headerName: 'Section', headerTooltip: 'Section', field: 'section', tooltipField: 'section', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
    { headerName: 'Location', headerTooltip: 'Location', field: 'location', tooltipField: 'location', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
    { headerName: 'Counterparty', headerTooltip: 'Counterparty', field: 'counterparty', tooltipField: 'counterparty', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
    { headerName: 'Product', headerTooltip: 'Product', field: 'product', tooltipField: 'product', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
    { headerName: 'Field', headerTooltip: 'Field', field: 'field', tooltipField: 'field', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
    { headerName: 'Old value', headerTooltip: 'Old value', field: 'oldValue', tooltipField: 'oldValue', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
    { headerName: 'New value', headerTooltip: 'New value', field: 'newValue', tooltipField: 'newValue', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
  ];

  private columnDef_chat_grid = [
      { headerName: 'Date', headerTooltip: 'Date', tooltipField: 'date', field: 'date',width:100,suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
      { headerName: 'User', headerTooltip: 'User', tooltipField: 'user', field: 'user',width:100, suppressSizeToFit: false,cellClass:'aggrid-text-resizable',  },
      { headerName: 'Transaction Type', headerTooltip: 'Transaction Type', tooltipField: 'transactionType' , field: 'transactionType',width:70,suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
      { headerName: 'Section', headerTooltip: 'Section', field: 'section', tooltipField: 'section', suppressSizeToFit: false,width:70,cellClass:'aggrid-text-resizable', },
      { headerName: 'Old Chat', headerTooltip: 'Old Chat', field: 'old_chat', tooltipField: 'old_chat', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
      { headerName: 'New Chat', headerTooltip: 'New Chat', field: 'new_chat', tooltipField: 'new_chat', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
      
  ];
  
     getAuditLogs(){
        let reqpayload = {
          
          Filters: [
            { ColumnName: "BusinessId", Value: this.businessId },
            {
              ColumnName: "Transaction",
              Value: 'QuantityControlReport'
            }
          ],
          PageFilters: { Filters: [] },
          Pagination: { Skip: 0, Take: this.pageSize },
          SortList: { SortList: [] }
        };
        this.ContractNegotiationService.getAuditLogsList(
         reqpayload
       ).subscribe((data: any) =>{
        this.gridOptions_nego_history.api.setRowData(data.payload);
        console.log(data.payload);
       });
       
  }
}
