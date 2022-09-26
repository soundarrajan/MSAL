import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { Router } from "@angular/router";
import { EmailPreviewPopupComponent } from '../contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';

@Component({
  selector: 'app-contract-nego-auditlog',
  templateUrl: './contract-nego-auditlog.component.html',
  styleUrls: ['./contract-nego-auditlog.component.scss']
})
export class ContractNegoAuditlogComponent implements OnInit {

  public gridOptions_nego_history: GridOptions;
  public gridOptions_chat_history: GridOptions;
  public theme:boolean=false;
  private statusBGRules = {
    'bg-success': function (params) {
      return params.value === 'Success';
    },
    'bg-pending': function (params) {
      return params.value === 'Pending';
    },
    'bg-failed': function (params) {
      return params.value === 'Failed';
    }
  };
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
  constructor(public dialog: MatDialog) { 
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
        this.gridOptions_nego_history.api.sizeColumnsToFit();
        params.api.sizeColumnsToFit();
        this.gridOptions_nego_history.api.setRowData(this.rowData_nego_grid);

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

  private rowData_nego_grid = [
      
{date:'12/12/2021 12:34',user:'Alexander James',transactionType:'Modify',section:'Offer',location:'Amsterdam',counterparty:'Shell Bunkering',
product:'RMG 380',field:'Premium',oldValue:'3 USD',newValue:'2.5 USD'},
{date:'12/12/2021 12:34',user:'Yusuf Hasaan',transactionType:'Modify',section:'Request',location:'Rotterdam',counterparty:'ABC Fuels solutions',
product:'RMG 380',field:'Minimum Qty',oldValue:'1000 MT',newValue:'1000 MT'},
{date:'12/12/2021 12:34',user:'Prem Vijay',transactionType:'Modify',section:'Offer',location:'Amsterdam',counterparty:'Shell Bunkering',
product:'RMG 380',field:'Premium',oldValue:'3 USD',newValue:'2.5 USD'},
{date:'12/12/2021 12:34',user:'Alexander James',transactionType:'Modify',section:'Offer',location:'Amsterdam',counterparty:'Shell Bunkering',
product:'RMG 380',field:'Premium',oldValue:'3 USD',newValue:'2.5 USD'},
{date:'12/12/2021 12:34',user:'Yusuf Hasaan',transactionType:'Modify',section:'Request',location:'Rotterdam',counterparty:'ABC Fuels solutions',
product:'RMG 380',field:'Minimum Qty',oldValue:'1000 MT',newValue:'1000 MT'},
{date:'12/12/2021 12:34',user:'Prem Vijay',transactionType:'Modify',section:'Offer',location:'Amsterdam',counterparty:'Shell Bunkering',
product:'RMG 380',field:'Premium',oldValue:'3 USD',newValue:'2.5 USD'},
{date:'12/12/2021 12:34',user:'Alexander James',transactionType:'Modify',section:'Offer',location:'Amsterdam',counterparty:'Shell Bunkering',
product:'RMG 380',field:'Premium',oldValue:'3 USD',newValue:'2.5 USD'},
{date:'12/12/2021 12:34',user:'Yusuf Hasaan',transactionType:'Modify',section:'Request',location:'Rotterdam',counterparty:'ABC Fuels solutions',
product:'RMG 380',field:'Minimum Qty',oldValue:'1000 MT',newValue:'1000 MT'},
{date:'12/12/2021 12:34',user:'Prem Vijay',transactionType:'Modify',section:'Offer',location:'Amsterdam',counterparty:'Shell Bunkering',
product:'RMG 380',field:'Premium',oldValue:'3 USD',newValue:'2.5 USD'}
  ];

  private columnDef_chat_grid = [
      { headerName: 'Date', headerTooltip: 'Date', tooltipField: 'date', field: 'date',width:100,suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
      { headerName: 'User', headerTooltip: 'User', tooltipField: 'user', field: 'user',width:100, suppressSizeToFit: false,cellClass:'aggrid-text-resizable',  },
      { headerName: 'Transaction Type', headerTooltip: 'Transaction Type', tooltipField: 'transactionType' , field: 'transactionType',width:70,suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
      { headerName: 'Section', headerTooltip: 'Section', field: 'section', tooltipField: 'section', suppressSizeToFit: false,width:70,cellClass:'aggrid-text-resizable', },
      { headerName: 'Old Chat', headerTooltip: 'Old Chat', field: 'old_chat', tooltipField: 'old_chat', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
      { headerName: 'New Chat', headerTooltip: 'New Chat', field: 'new_chat', tooltipField: 'new_chat', suppressSizeToFit: false,cellClass:'aggrid-text-resizable', },
      
  ];
  
    private rowData_chat_grid = [
        
      { date:'12/12/2021 12:34',user:'Alexander James',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'This Offer is for Amsterdam for the month of July to Sep'},
      { date:'12/12/2021 12:34',user:'Alexander James',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'This Offer is for Amsterdam for the month of July to Sep'},
      { date:'12/12/2021 12:34',user:'Alexander James',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'This Offer is for Amsterdam for the month of July to Sep'},
      { date:'12/12/2021 12:34',user:'Yusuf Hassan',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'This Offer is for Amsterdam for the month of July to Sep'},
      { date:'12/12/2021 12:34',user:'Prem Vijay',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'Conversation Deleted'},
      { date:'12/12/2021 12:34',user:'Alexander James',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'This Offer is for Amsterdam for the month of July to Sep'},
      { date:'12/12/2021 12:34',user:'Prem Vijay',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'This Offer is for Amsterdam for the month of July to Sep'},
      { date:'12/12/2021 12:34',user:'Yusuf Hassan',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'This Offer is for Amsterdam for the month of July to Sep'},
      { date:'12/12/2021 12:34',user:'Alexander James',transactionType:'Modify',section:'Offer',
        old_chat:'This Offer is for Rotterdam for the month of July to Sep',new_chat:'Conversation Deleted'}
       ];   

  

}