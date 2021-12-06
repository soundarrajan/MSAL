import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';

@Component({
  selector: 'app-residue-claims',
  templateUrl: './residue-claims.component.html',
  styleUrls: ['./residue-claims.component.css']
})
export class ResidueClaimsComponent implements OnInit {
  public switchTheme: boolean = true;
  public gridOptions_data: GridOptions;
  public rowCount: Number;
  today = new FormControl(new Date());
  @Input() theme: boolean;
  ngOnInit(): void {}
  tabChange() {
    //alert("");
    this.gridOptions_data.api.sizeColumnsToFit();
  }
  constructor() {
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
      headerHeight: 30,
      rowHeight: 35,
      animateRows: false,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },

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
      headerName: 'Order No.',
      headerTooltip: 'Order No.',
      field: 'orderNo',
      width: 120,
      cellStyle: { 'padding-left': '15px' }
    },
    {
      headerName: 'Delivery No.',
      headerTooltip: 'Delivery No.',
      field: 'deliveryNo',
      width: 120
    },
    {
      headerName: 'Claim No. ',
      headerTooltip: 'Claim No. ',
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
      headerName: 'Product',
      headerTooltip: 'Product',
      field: 'product',
      width: 120
    },
    {
      headerName: 'Seller',
      headerTooltip: 'Seller',
      field: 'seller',
      width: 120
    },
    {
      headerName: 'Qty Shortage',
      headerTooltip: 'Qty Shortage',
      field: 'shortage',
      width: 120
    },
    {
      headerName: 'UOM',
      headerTooltip: 'UOM',
      field: 'uom',
      width: 120
    },
    {
      headerName: 'Claim Status',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['status aggridtextalign-center'],
      headerTooltip: 'Claim Status',
      field: 'status',
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
      headerName: 'Estd. Settlement Amt.',
      headerTooltip: 'Estd. Settlement Amt.',
      field: 'amount',
      width: 120
    },
    {
      headerName: 'Created date',
      headerTooltip: 'Created date',
      field: 'date',
      width: 120
    },
    {
      headerName: 'Created By',
      headerTooltip: 'Created By',
      field: 'createdBy',
      width: 120
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
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Off Spec',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Resolved',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'New',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    },
    {
      orderNo: '109661',
      deliveryNo: '12502',
      claimNo: 'CLM1466',
      vessel: 'Alabama',
      port: 'Algeciras',
      product: 'RMG 380 0.5%',
      seller: 'Repsol Petroleo',
      shortage: '1300.000',
      uom: 'MT',
      status: 'Marked as Seen',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
    }
  ];
}
