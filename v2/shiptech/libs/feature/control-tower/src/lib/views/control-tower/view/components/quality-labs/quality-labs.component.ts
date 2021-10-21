import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';
import { RowstatusOnchangeQualitylabPopupComponent } from '@shiptech/core/ui/components/designsystem-v2/rowstatus-onchange-qualitylab-popup/rowstatus-onchange-qualitylab-popup.component';

@Component({
  selector: 'app-quality-labs',
  templateUrl: './quality-labs.component.html',
  styleUrls: ['./quality-labs.component.css']
})
export class QualityLabsComponent implements OnInit {
  public switchTheme: boolean = true;
  public gridOptions_data: GridOptions;
  public rowCount: Number;
  today = new FormControl(new Date());
  public rowSelection;
  public toggleNewFilter: boolean = true;
  public toggleMASFilter: boolean = true;
  public toggleResolvedFilter: boolean = true;
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  ngOnInit(): void {}
  constructor(public dialog: MatDialog) {
    this.rowSelection = 'single';
    this.gridOptions_data = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      columnDefs: this.columnDef_aggrid,
      suppressCellSelection: true,
      headerHeight: 30,
      rowHeight: 35,
      animateRows: true,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      rowSelection: 'single',
      onGridReady: params => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.setRowData(this.rowData_aggrid);
        this.gridOptions_data.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions_data.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
      },

      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 8 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          //params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  private columnDef_aggrid = [
    {
      headerName: 'Lab ID',
      headerTooltip: 'Lab ID',
      field: 'orderNo',
      width: 120,
      cellStyle: { 'padding-left': '15px' }
    },
    {
      headerName: 'Lab Counterparty',
      headerTooltip: 'Lab Counterparty',
      field: 'labcounterparty',
      width: 120,
      cellStyle: { 'padding-left': '15px' }
    },
    {
      headerName: 'Del. No.',
      headerTooltip: 'Delivery No.',
      field: 'deliveryNo',
      width: 120,
      tooltipField: 'deliveryNo'
    },
    {
      headerName: 'Order No. ',
      headerTooltip: 'Order No. ',
      field: 'claimNo',
      width: 120
    },
    {
      headerName: 'Vessel',
      headerTooltip: 'Vessel',
      field: 'vessel',
      tooltipField: 'vessel',
      width: 120
    },
    {
      headerName: 'Port',
      headerTooltip: 'Port',
      field: 'port',
      width: 120
    },
    {
      headerName: 'ETA',
      headerTooltip: 'ETA',
      field: 'date',
      width: 120
    },
    {
      headerName: 'Product',
      headerTooltip: 'Product',
      field: 'product',
      width: 120
    },
    {
      headerName: 'Lab Status',
      headerTooltip: 'Lab Status',
      field: 'status',
      width: 120
    },

    // { headerName: 'Lab Status', headerClass: ['aggrid-text-align-c'],cellClass: ['status aggridtextalign-center'],headerTooltip: 'Lab Status', field: 'status',width:150,
    // cellRendererFramework: AGGridCellRendererV2Component,
    // cellRendererParams: function(params) {
    //   var classArray:string[] =[];
    //     classArray.push('aggridtextalign-center');
    //     let newClass= params.value==='New'?'custom-chip-v2 small medium-blue':
    //                   params.value==='Marked as Seen'?'custom-chip-v2 small medium-yellow':
    //                   params.value==='Off Spec'?'custom-chip-v2 small medium-yellow':
    //                   params.value==='Resolved'?'custom-chip-v2 small light-green':
    //                   'custom-chip-v2 small dark';
    //                   classArray.push(newClass);
    //     return {cellClass: classArray.length>0?classArray:null} }
    // },
    // {
    //   headerName: 'Recon Status', headerTooltip: 'Recon Status', field: 'rstatus',  width:120
    // },
    {
      headerName: 'Claim Raised',
      headerTooltip: 'Claim Raised',
      field: 'claimRaised',
      width: 120
    },

    {
      headerName: 'Created By',
      headerTooltip: 'Created By',
      field: 'createdBy',
      width: 120
    },
    {
      headerName: 'Created On',
      headerTooltip: 'Created On',
      field: 'date',
      width: 120
    },
    {
      headerName: 'Progress',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['status aggridtextalign-center'],
      headerTooltip: 'Progress',
      field: 'progress',
      width: 150,
      cellRendererFramework: AGGridCellRendererV2Component,
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'New'
            ? 'custom-chip-v2 small medium-blue'
            : params.value === 'Marked as Seen'
            ? 'custom-chip-v2 small medium-yellow'
            : params.value === 'Off Spec'
            ? 'custom-chip-v2 small medium-yellow'
            : params.value === 'Resolved'
            ? 'custom-chip-v2 small light-green'
            : 'custom-chip-v2 small dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },

    {
      headerName: 'Actions',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['aggridtextalign-center'],
      headerTooltip: 'Actions',
      cellRendererFramework: AGGridCellActionsComponent,
      cellRendererParams: { type: 'actions' },
      cellStyle: { 'align-items': 'center' },
      resizable: false,
      suppressMovable: true,
      width: 110
    }
  ];

  public rowData_aggrid = [
    {
      orderNo: '1096611',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '1096612',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'VPS',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Marked as Seen'
    },
    {
      orderNo: '1096613',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'VPS',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Marked as Seen'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'VPS',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Off Spec',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Intertek',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Resolved',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Resolved'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Verifuel',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Marked as Seen'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Verifuel',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Off Spec'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Intertek',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Marked as Seen'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Marked as Seen'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Resolved'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Resolved'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Marked as Seen'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Verifuel',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Resolved'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Intertek',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Off Spec'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Verifuel',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Off Spec'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Verifuel',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Off Spec'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Intertek',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Off Spec'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Verifuel',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'Off Spec'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'ViswaLab',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'VPS',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'VPS',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'VPS',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Verifuel',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Intertek',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'New',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'Verifuel',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      subType: 'Demsity @ 15C',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      rstatus: 'Failed',
      claimRaised: 'Yes',
      labcounterparty: 'VPS',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: '',
      progress: 'New'
    }
  ];

  public onRowSelected(ev) {
    // console.log(ev);
    // alert(ev.rowIndex);
  }

  public onSelectionChanged(ev) {
    var selectedRows = this.gridOptions_data.api.getSelectedRows().length;
    //alert(selectedRows);
  }

  public onrowClicked(ev) {
    //console.log("hhhhhhhhh");
    var index = ev.rowIndex;
    //alert(index);
    const dialogRef = this.dialog.open(
      RowstatusOnchangeQualitylabPopupComponent,
      {
        width: '380px',
        height: 'auto',
        maxHeight: '518px',
        backdropClass: 'dark-popupBackdropClass',
        panelClass: this.theme ? 'dark-theme' : 'light-theme',
        data: {
          title: 'Quality Labs',
          id: 'Labs Id',
          status: 'Resolved',
          claimId: 'CLM 1466',
          vessel: 'CMA CGM White Shark',
          port: 'Algeciras',
          product1: 'HSFO',
          product2: 'RMG 380 0.5%',
          subType: 'Density @15C',
          diff: '1035.05 USD'
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      var selectedData = this.gridOptions_data.api.getSelectedRows();
      //var res = this.gridOptions_data.api.applyTransaction({ remove: selectedData });
      // this.gridOptions_data.api.applyTransaction({
      //   add: this.newItems,
      //   addIndex: 0,
      // });

      //alert(result.data);
      //this.gridOptions_data.api.setRowData([]);
      var itemsToUpdate = [];
      this.gridOptions_data.api.forEachNodeAfterFilterAndSort(function(
        rowNode,
        index
      ) {
        // console.log("eeeeeeeee");
        // console.log(rowNode);
        if (!rowNode.isSelected() === true) {
          return;
        }
        var data = rowNode.data;
        data.status = result.data;
        itemsToUpdate.push(data);
      });
      var res = this.gridOptions_data.api.applyTransaction({
        update: itemsToUpdate
      });
      this.gridOptions_data.api.deselectAll(); //optional
    });
  }

  filterGridNew(text) {
    if (this.toggleNewFilter) {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel({
        values: [text]
      });
      this.gridOptions_data.api.onFilterChanged();
    } else {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel(null);
      this.gridOptions_data.api.onFilterChanged();
    }
    this.toggleNewFilter = !this.toggleNewFilter;
    this.toggleMASFilter = true;
    this.toggleResolvedFilter = true;
  }
  filterGridMAS(text) {
    if (this.toggleMASFilter) {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel({
        values: [text]
      });
      this.gridOptions_data.api.onFilterChanged();
    } else {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel(null);
      this.gridOptions_data.api.onFilterChanged();
    }
    this.toggleMASFilter = !this.toggleMASFilter;
    this.toggleNewFilter = true;
    this.toggleResolvedFilter = true;
  }
  filterGridResolved(text) {
    if (this.toggleResolvedFilter) {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel({
        values: [text]
      });
      this.gridOptions_data.api.onFilterChanged();
    } else {
      var instance = this.gridOptions_data.api.getFilterInstance('progress');
      instance.setModel(null);
      this.gridOptions_data.api.onFilterChanged();
    }
    this.toggleResolvedFilter = !this.toggleResolvedFilter;
    this.toggleNewFilter = true;
    this.toggleMASFilter = true;
  }
}
