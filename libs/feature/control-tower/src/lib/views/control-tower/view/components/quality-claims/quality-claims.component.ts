import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';

@Component({
  selector: 'app-quality-claims',
  templateUrl: './quality-claims.component.html',
  styleUrls: ['./quality-claims.component.css']
})
export class QualityClaimsComponent implements OnInit {
  public switchTheme: boolean = true;
  public gridOptions_data: GridOptions;
  public rowCount: Number;
  today = new FormControl(new Date());
  public rowSelection;
  @Input() theme: boolean;
  @Input() newScreen: boolean;

  ngOnInit(): void {}
  tabChange() {
    this.gridOptions_data.api.sizeColumnsToFit();
  }
  constructor(public dialog: MatDialog) {
    this.rowSelection = 'single';
    this.gridOptions_data = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid,
      suppressCellSelection: true,
      headerHeight: 30,
      rowHeight: 35,
      animateRows: false,
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
      headerName: 'Order No.',
      headerTooltip: 'Order No.',
      field: 'orderNo',
      cellClass: ['aggridlink'],
      width: 120,
      cellStyle: { 'padding-left': '15px' }
    },
    {
      headerName: 'Delivery No.',
      headerTooltip: 'Delivery No.',
      field: 'deliveryNo',
      cellClass: ['aggridlink'],
      width: 120
    },
    {
      headerName: 'Claim No. ',
      headerTooltip: 'Claim No. ',
      field: 'claimNo',
      cellClass: ['aggridlink'],
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
      headerName: 'Sub-type',
      headerTooltip: 'Sub-type',
      field: 'subType',
      width: 120
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
      headerName: 'No Response',
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['status aggridtextalign-center'],
      headerTooltip: 'Progress',
      field: 'status',
      width: 150,
      cellRendererFramework: AGGridCellRendererV2Component,
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'New'
            ? 'custom-chip-v2 small medium-blue'
            : params.value === '7-14 days'
            ? 'custom-chip-v2 small medium-yellow'
            : params.value === '15+ days'
            ? 'custom-chip-v2 small medium-red'
            : 'custom-chip-v2 small dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    }
    /* {
      headerName: 'Actions', headerClass: ["aggrid-text-align-c"], cellClass: ['aggridtextalign-center'], headerTooltip: 'Actions',
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'actions' }, cellStyle: { 'align-items': 'center' },
      resizable: false, suppressMovable: true, width: 110
    } */
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
      status: '15+ days',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
      status: '15+ days',
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
      subType: 'Demsity @ 15C',
      status: '15+ days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
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
      subType: 'Demsity @ 15C',
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
      subType: 'Demsity @ 15C',
      status: '7-14 days',
      amount: '1035.15 USD',
      date: 'Wed 17/03/21 05:30',
      createdBy: 'mathangi',
      actions: ''
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

  /*  public onrowClicked (ev){
    //console.log("hhhhhhhhh");
    var index = ev.rowIndex;
    //alert(index);
    const dialogRef = this.dialog.open(RowstatusOnchangePopupComponent, {
      width: '382px',
      height: 'auto',
      maxHeight:'519px',
      backdropClass: 'dark-popupBackdropClass',
      panelClass: this.theme ? 'dark-theme' : 'light-theme',
      data:{title:'Claims',id:'Claim Id'}
    });

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
    this.gridOptions_data.api.forEachNodeAfterFilterAndSort(function(rowNode, index) {
      // console.log("eeeeeeeee");
      // console.log(rowNode);
      if (!rowNode.isSelected() === true) {
        return;
      }
      var data = rowNode.data;
      data.status = result.data;
      itemsToUpdate.push(data);
    });
    var res = this.gridOptions_data.api.applyTransaction({ update: itemsToUpdate });
    this.gridOptions_data.api.deselectAll();//optional


    });
  } */
}
