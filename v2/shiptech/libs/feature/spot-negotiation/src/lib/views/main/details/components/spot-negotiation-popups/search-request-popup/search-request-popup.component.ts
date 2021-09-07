import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellRendererComponent } from '../../../../../../core/ag-grid/ag-grid-cell-renderer.component';

@Component({
  selector: 'app-search-request-popup',
  templateUrl: './search-request-popup.component.html',
  styleUrls: ['./search-request-popup.component.css']
})
export class SearchRequestPopupComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public rowCount: Number;
  public hoverRowDetails = [
    { label: 'Day Opening Balance', value: '5000 MT' },
    { label: 'In', value: '3000 MT' },
    { label: 'Out', value: '-5000 MT' },
    { label: 'Transfer Out', value: '-2000 MT' },
    { label: 'Transfer In', value: '0 MT' },
    { label: 'Gain', value: '20 MT' },
    { label: 'Loss', value: '0 MT' },
    { label: 'Adj In', value: '0 MT' },
    { label: 'Adj Out', value: '0 MT' },
    { label: 'Day Closing Balance', value: '1020 MT' }
  ];
  ngOnInit() {}
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<SearchRequestPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialog_gridOptions = <GridOptions>{
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      columnDefs: this.columnDefs,
      suppressRowClickSelection: true,
      headerHeight: 30,
      rowHeight: 30,
      rowSelection: 'multiple',
      // groupIncludeTotalFooter: true,
      onGridReady: params => {
        this.dialog_gridOptions.api = params.api;
        this.dialog_gridOptions.columnApi = params.columnApi;
        this.dialog_gridOptions.api.sizeColumnsToFit();
        this.dialog_gridOptions.api.setRowData(this.rowData);
        this.rowCount = this.dialog_gridOptions.api.getDisplayedRowCount();
      },
      getRowStyle: function(params) {
        if (params.node.rowPinned) {
          return { 'font-weight': '500', 'font-size': '20px' };
        }
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 5 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }
  tankSummary() {
    //this.dialogRef.close();
    this.router.navigate([]).then(result => {
      window.open('opsinventory/tankSummary', '_blank');
    });
    //this.router.navigate(['opsinventory/tankSummary']);
  }
  public columnDefs = [
    {
      headerName: '',
      field: 'check',
      filter: true,
      suppressMenu: true,
      width: 35,
      checkboxSelection: true,
      resizable: false,
      suppressMovable: true,
      headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
      cellClass: 'p-1 checkbox-center ag-checkbox-v2'
    },
    {
      headerName: 'ID',
      headerTooltip: 'ID',
      field: 'id',
      width: 175,
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Date',
      headerTooltip: 'Date',
      field: 'date',
      cellClass: ['aggridtextalign-center']
    },
    {
      headerName: 'Service',
      headerTooltip: 'Service',
      field: 'service',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Buyer',
      headerTooltip: 'Buyer',
      field: 'buyer',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Vessel',
      headerTooltip: 'Vessel',
      field: 'vessel',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'IMO',
      headerTooltip: 'IMO',
      field: 'imo',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'ETA',
      headerTooltip: 'ETA',
      field: 'eta',
      cellClass: ['aggridtextalign-center']
    },
    {
      headerName: 'Location',
      headerTooltip: 'Location',
      field: 'location',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Request Status',
      headerTooltip: 'Request Status',
      field: 'request_status',
      suppressMenu: true,
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['aggridtextalign-center'],
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'Validated'
            ? 'custom-chip medium-amber'
            : 'custom-chip dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'OPS Validation',
      headerTooltip: 'OPS Validation',
      field: 'ops_validation',
      suppressMenu: true,
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['aggridtextalign-center'],
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'No' ? 'custom-chip medium-red' : 'custom-chip dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'Product',
      headerTooltip: 'Product',
      field: 'product',
      cellClass: ['aggridtextalign-left']
    }
  ];

  public numberFormatter(params) {
    if (isNaN(params.value)) return params.value;
    else return params.value.toFixed(4);
  }

  private rowData = [
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    },
    {
      id: '112837',
      date: '12/10/2020 10:30',
      service: 'SALONIXP',
      buyer: 'Saida Moleu',
      vessel: 'A La Marine',
      imo: '09827822',
      eta: '12/10/2020 10:30',
      location: 'Rotterdam',
      request_status: 'Validated',
      ops_validation: 'No',
      product: 'RMG 380'
    }
  ];

  closeDialog() {
    this.dialogRef.close();
  }
}
