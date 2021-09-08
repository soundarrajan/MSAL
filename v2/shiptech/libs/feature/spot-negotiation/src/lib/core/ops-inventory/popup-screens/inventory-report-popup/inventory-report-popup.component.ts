import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { AGGridCellMenuPopupComponent } from '../../../ag-grid/ag-grid-cell-menu.component';

@Component({
  selector: 'app-inventory-report-popup',
  templateUrl: './inventory-report-popup.component.html',
  styleUrls: ['./inventory-report-popup.component.css']
})
export class InventoryReportPopupComponent implements OnInit {
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
    public dialogRef: MatDialogRef<InventoryReportPopupComponent>,
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
      headerName: 'Tank Name',
      headerTooltip: 'Tank Name',
      field: 'tankname',
      width: 175,
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Location',
      headerTooltip: 'Location',
      field: 'location',
      width: 150,
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Product',
      headerTooltip: 'Product',
      field: 'product',
      width: 150,
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'UOM',
      headerTooltip: 'UOM',
      field: 'uom',
      width: 75,
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Terminal Balance',
      headerTooltip: 'Terminal Balance',
      field: 'terminalbalance',
      type: 'numericColumn',
      width: 150,
      valueFormatter: this.numberFormatter,
      cellClass: ['aggridtextalign-right']
    },
    {
      headerName: 'System Balance',
      headerTooltip: 'System Balance',
      field: 'systembalance',
      width: 150,
      valueFormatter: this.numberFormatter,
      // cellClass: ["aggridtextalign-right aggridlink"],
      type: 'numericColumn',
      cellClass: ['hoverdisable hover-cell-menu-icon'],
      cellRendererFramework: AGGridCellMenuPopupComponent,
      cellRendererParams: {
        type: 'hover-click-drag-menu-singleGrid',
        cellClass: ['aggridlink'],
        rowDetails: this.hoverRowDetails,
        headerLabel: 'Tank-LongBeach',
        onClick: this.tankSummary.bind(this),
        cell_alignment: 'flex-end'
      },
      cellStyle: { 'justify-content': 'flex-end' }
    },
    {
      headerName: 'Difference',
      headerTooltip: 'Difference',
      field: 'difference',
      type: 'numericColumn',
      valueFormatter: this.numberFormatter,
      width: 150,
      cellClass: ['aggridtextalign-right']
    },
    {
      headerName: 'Difference Type',
      headerTooltip: 'Difference Type',
      field: 'differencetype',
      width: 150,
      cellClass: ['aggridtextalign-left']
    }
  ];

  public numberFormatter(params) {
    if (isNaN(params.value)) return params.value;
    else return params.value.toFixed(4);
  }

  private rowData = [
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    },
    {
      tankname: 'Tank-1 LongBeach',
      location: 'LongBeach',
      product: 'Ethanol',
      uom: 'BBL',
      terminalbalance: '10,000',
      systembalance: '12,000',
      difference: '-2,000',
      differencetype: 'Loss'
    }
  ];

  closeDialog() {
    this.dialogRef.close();
  }
}
